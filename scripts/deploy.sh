#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BRANCH="${DEPLOY_BRANCH:-main}"

cd "$PROJECT_DIR"

git pull --ff-only origin "$BRANCH"
npm ci --omit=dev
pm2 startOrReload ecosystem.config.js --env production
pm2 save
