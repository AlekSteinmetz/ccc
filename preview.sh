#!/usr/bin/env bash
# Preview the Coral Construction site locally.
#   ./preview.sh          -> http://localhost:8000
#   ./preview.sh 4000     -> http://localhost:4000
set -euo pipefail
cd "$(dirname "$0")"
PORT="${1:-8000}"
URL="http://localhost:${PORT}"

echo "Serving the Coral Construction site at ${URL}"
echo "Press Ctrl+C to stop."

# Open the browser shortly after the server starts (macOS: open, Linux: xdg-open).
( sleep 1; (command -v open >/dev/null && open "$URL") || (command -v xdg-open >/dev/null && xdg-open "$URL") || true ) >/dev/null 2>&1 &

if command -v python3 >/dev/null 2>&1; then
  exec python3 -m http.server "$PORT" --bind 127.0.0.1
elif command -v npx >/dev/null 2>&1; then
  exec npx --yes serve -l "$PORT" .
else
  echo "Python 3 (or Node.js) is required to preview locally." >&2
  exit 1
fi
