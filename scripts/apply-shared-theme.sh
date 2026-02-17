#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <html_file> <dark|light>"
  exit 1
fi

HTML_FILE="$1"
MODE="$2"

if [[ ! -f "$HTML_FILE" ]]; then
  echo "File not found: $HTML_FILE"
  exit 1
fi

if [[ "$MODE" == "dark" ]]; then
  THEME_URL="https://cdn.jsdelivr.net/gh/vladimirlopez/thinking-machine-sims-hub@main/themes/dark-refraction-theme.css"
elif [[ "$MODE" == "light" ]]; then
  THEME_URL="https://cdn.jsdelivr.net/gh/vladimirlopez/thinking-machine-sims-hub@main/themes/light-half-atwood-theme.css"
else
  echo "Mode must be 'dark' or 'light'."
  exit 1
fi

LINK_TAG="<link rel=\"stylesheet\" href=\"$THEME_URL\" />"

if grep -Fq "$THEME_URL" "$HTML_FILE"; then
  echo "Theme already present in $HTML_FILE"
  exit 0
fi

perl -0777 -i -pe "s#</head>#  $LINK_TAG\n</head>#" "$HTML_FILE"

echo "Applied $MODE theme to $HTML_FILE"
