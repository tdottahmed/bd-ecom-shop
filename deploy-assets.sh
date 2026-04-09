#!/usr/bin/env bash
# Build assets locally and upload to the live server.
# Usage: ./deploy-assets.sh

set -e

SERVER_USER="directmalaysia"
SERVER_HOST="190.92.174.131"
SERVER_PATH="/home/directmalaysia/public_html/public/build"

echo "Building assets locally..."
npm run build

echo "Uploading public/build/ to server..."
rsync -avz --delete public/build/ "${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/"

echo "Done."
