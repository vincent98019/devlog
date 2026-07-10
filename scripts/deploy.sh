#!/usr/bin/env bash
set -euo pipefail

REMOTE_HOST="${REMOTE_HOST:-beefic}"
REMOTE_DIR="${REMOTE_DIR:-devlog}"
ARCHIVE_NAME="${ARCHIVE_NAME:-out.tar.gz}"

printf '[deploy] build site\n'
npm run build

printf '[deploy] pack %s\n' "$ARCHIVE_NAME"
COPYFILE_DISABLE=1 tar --no-xattrs -zcf "$ARCHIVE_NAME" out/

printf '[deploy] upload %s to %s:~\n' "$ARCHIVE_NAME" "$REMOTE_HOST"
scp "$ARCHIVE_NAME" "$REMOTE_HOST:~"

printf '[deploy] update remote directory %s:%s\n' "$REMOTE_HOST" "$REMOTE_DIR"
ssh "$REMOTE_HOST" "
  set -e
  printf '[remote] remove old %s and temporary out\n' '$REMOTE_DIR'
  rm -rf '$REMOTE_DIR' out
  printf '[remote] extract %s\n' '$ARCHIVE_NAME'
  tar -zxf '$ARCHIVE_NAME'
  printf '[remote] move out to %s\n' '$REMOTE_DIR'
  mv out '$REMOTE_DIR'
  printf '[remote] deploy complete: %s\n' '$REMOTE_DIR'
"

printf '[deploy] done\n'
