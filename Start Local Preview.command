#!/bin/zsh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

PORT="${1:-8000}"
URL="http://localhost:${PORT}"

echo "Starting local preview server in: $SCRIPT_DIR"
echo "URL: $URL"
echo "Press Ctrl+C to stop the server."

open "$URL"
python3 -m http.server "$PORT"
