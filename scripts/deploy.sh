#!/usr/bin/env bash
set -euo pipefail

REMOTE_HOST="${REMOTE_HOST:-beefic}"
REMOTE_DIR="${REMOTE_DIR:-devlog}"
ARCHIVE_NAME="${ARCHIVE_NAME:-out.tar.gz}"

npm run build

COPYFILE_DISABLE=1 tar -zcvf "$ARCHIVE_NAME" out/
scp "$ARCHIVE_NAME" "$REMOTE_HOST:~"

ssh "$REMOTE_HOST" "
  set -e
  rm -rf '$REMOTE_DIR' out
  tar -zxvf '$ARCHIVE_NAME'
  mv out '$REMOTE_DIR'
"
