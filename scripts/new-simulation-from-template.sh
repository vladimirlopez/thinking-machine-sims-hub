#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <destination_parent_dir> <new_sim_folder_name>"
  exit 1
fi

DEST_PARENT="$1"
NEW_NAME="$2"
TEMPLATE_DIR="$(cd "$(dirname "$0")/.." && pwd)/templates/thinking-experiment-sim-v1"
DEST_DIR="$DEST_PARENT/$NEW_NAME"

if [[ -e "$DEST_DIR" ]]; then
  echo "Destination already exists: $DEST_DIR"
  exit 1
fi

mkdir -p "$DEST_PARENT"
cp -R "$TEMPLATE_DIR" "$DEST_DIR"

echo "Created simulation starter at: $DEST_DIR"
echo "Next: update title/description in index.html and implement logic in src/main.js"
