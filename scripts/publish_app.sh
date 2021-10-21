#!/bin/bash

set -euo pipefail

DXOS_DOMAIN="${DXOS_DOMAIN:-dxos}"

for appdir in 'konsole-app' 'keyhole-app'; do
  pushd "packages/$appdir"

  PKG_CHANNEL="${PKG_CHANNEL:-}"
  PKG_NAME=`cat package.json | jq -r '.name' | cut -d'/' -f2- | sed 's/-app$//'`

  cat <<EOF > app.yml
name: $PKG_NAME
build: yarn build
EOF

  cat app.yml

  yarn clean

  # Canary deployment
  yarn -s dx app deploy --dxns --name "app.${PKG_NAME}" --domain $DXOS_DOMAIN --tags dev --version=false

  # Latest version deployment
  yarn -s dx app deploy --dxns --name "app.${PKG_NAME}" --domain $DXOS_DOMAIN --tags latest --skipExising
  popd
done
