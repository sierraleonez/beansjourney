#!/usr/bin/env bash
# Checks whether a custom domain in front of Tencent COS is ready to serve HTTPS.
# Usage: ./scripts/check-cos-domain.sh [domain]
# Defaults to bucket.eventaries.cloud (the BeansJourney COS custom domain).

set -euo pipefail

DOMAIN="${1:-bucket.eventaries.cloud}"

echo "== DNS =="
if command -v dig >/dev/null 2>&1; then
    dig +short "$DOMAIN"
else
    nslookup "$DOMAIN" | tail -n +3
fi
echo

echo "== TLS certificate =="
CERT_INFO=$(echo | openssl s_client -connect "${DOMAIN}:443" -servername "$DOMAIN" 2>/dev/null | openssl x509 -noout -subject -ext subjectAltName 2>/dev/null || true)

if [ -z "$CERT_INFO" ]; then
    echo "FAIL: could not retrieve a certificate for $DOMAIN"
    exit 1
fi

echo "$CERT_INFO"
echo

if echo "$CERT_INFO" | grep -q "DNS:${DOMAIN}"; then
    echo "PASS: certificate covers $DOMAIN"
else
    echo "FAIL: certificate does NOT cover $DOMAIN (bind/renew the cert on this domain in the Tencent console)"
    exit 1
fi
echo

echo "== HTTPS reachability (full chain validation, like a browser) =="
set +e
CURL_ERR=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "https://${DOMAIN}/" 2>&1)
CURL_EXIT=$?
set -e

if [ "$CURL_EXIT" -ne 0 ]; then
    echo "GET https://${DOMAIN}/ -> curl error (exit $CURL_EXIT)"
    curl -sv --max-time 15 "https://${DOMAIN}/" 2>&1 | grep -iE "SSL|certificate|error" || true
    echo
    echo "FAIL: leaf certificate matches the domain, but the connection still doesn't validate."
    echo "      Likely cause: the server isn't sending the intermediate CA certificate(s) in the chain."
    echo "      Fix: re-upload the FULL certificate chain (leaf + intermediate), not just the leaf, in the Tencent console."
    exit 1
fi

echo "GET https://${DOMAIN}/ -> HTTP $CURL_ERR"
echo
echo "PASS: $DOMAIN is serving HTTPS with a valid, fully-chained certificate."
