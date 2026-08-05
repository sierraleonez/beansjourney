#!/usr/bin/env bash
# Boots an isolated e2e environment: fresh sqlite db, minimal deterministic
# fixtures (E2ESeeder), built assets, then serves on :8010 for Playwright.
set -euo pipefail
cd "$(dirname "$0")/.."

export DB_CONNECTION=sqlite
export DB_DATABASE="$(pwd)/database/e2e.sqlite"
export SESSION_DRIVER=file
export CACHE_STORE=file
export MAIL_MAILER=log

touch "$DB_DATABASE"
php artisan migrate:fresh --seed --seeder="Database\\Seeders\\E2ESeeder" --force

if [ "${E2E_SKIP_BUILD:-0}" = "1" ]; then
  echo "==> E2E_SKIP_BUILD=1, memakai aset yang sudah ada"
  if [ ! -f public/build/manifest.json ]; then
    echo "ERROR: E2E_SKIP_BUILD=1 tapi public/build/manifest.json tidak ada." >&2
    exit 1
  fi
else
  echo "==> Membangun aset"
  npm run build
fi

exec php artisan serve --host=127.0.0.1 --port=8010
