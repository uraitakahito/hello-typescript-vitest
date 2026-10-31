#!/bin/sh
# Start or stop the pinned Playwright server that the vrt project connects to.
# Uses Apple Container locally; CI runners set CONTAINER_RUNTIME=docker.
set -eu
cd "$(dirname "$0")/.."

runtime=${CONTAINER_RUNTIME:-container}
name=vrt-playwright

if [ "${1:-start}" = stop ]; then
  exec "$runtime" stop "$name"
fi

# The server and the npm package must be the same Playwright release.
image=$(cat .playwright-image)
version=$(node -p "require('playwright/package.json').version")
case "$image" in
  *":v$version-"*) ;;
  *)
    echo "playwright $version (npm) does not match $image (.playwright-image)" >&2
    exit 1
    ;;
esac

if "$runtime" inspect "$name" >/dev/null 2>&1; then
  echo "$name is already running"
  exit 0
fi

"$runtime" run -d --rm --name "$name" --init --user pwuser --memory 2G --shm-size 1G \
  -p 127.0.0.1:6677:6677 \
  "$image" /bin/sh -c "npx -y playwright@$version run-server --port 6677 --host 0.0.0.0" >/dev/null

# The first start downloads the playwright package inside the container, so wait for it.
tries=0
until "$runtime" logs "$name" 2>&1 | grep -q 'Listening on'; do
  tries=$((tries + 1))
  if [ "$tries" -gt 120 ]; then
    echo "$name did not start within 60 seconds" >&2
    "$runtime" logs "$name" >&2 || true
    exit 1
  fi
  sleep 0.5
done
echo "$name is listening on ws://127.0.0.1:6677/"
