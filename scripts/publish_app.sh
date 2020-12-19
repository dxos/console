#!/bin/bash

set -euo pipefail

for appdir in `find ./packages -name '*-app' -type d | grep -v node_modules`; do
  pushd $appdir

  WNS_ORG="${WNS_ORG:-dxos}"
  PKG_CHANNEL="${PKG_CHANNEL:-}"
  PKG_NAME=`cat package.json | jq -r '.name' | cut -d'/' -f2- | sed 's/-app$//'`
  WNS_NAME="$WNS_ORG/$PKG_NAME"

  cat <<EOF > app.yml
name: $PKG_NAME
build: yarn dist
EOF

  cat app.yml
  # TODO(burdon): Rename /app (consistently). Set ENV.
  echo "wrn://${WNS_ORG}/application/${PKG_NAME}${PKG_CHANNEL}"

  yarn clean
  yarn -s wire app build

  if [ -d "dist/production" ]; then
    yarn -s wire app publish --path './dist/production'
  else
    yarn -s wire app publish
  fi

  yarn -s wire app register --name "wrn://${WNS_ORG}/application/${PKG_NAME}${PKG_CHANNEL}"
  popd
done
