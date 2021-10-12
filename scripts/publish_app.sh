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
  yarn -s dx app build

  if [ -d "dist/production" ]; then
    yarn -s dx app publish --path './dist/production'
  elif [ -d "build" ]; then
    yarn -s dx app publish --path './build'
  else
    yarn -s dx app publish
  fi

  # TODO(egorgripasov): different channels.
  yarn -s dx app register --dxns --name "app.${PKG_NAME}" --domain $DXOS_DOMAIN
  popd
done
