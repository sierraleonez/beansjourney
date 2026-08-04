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
npm run build

exec php artisan serve --host=127.0.0.1 --port=8010
