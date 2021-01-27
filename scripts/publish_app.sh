#!/bin/bash

set -euo pipefail

for appdir in `find ./packages -name '*-app' -type d | grep -v node_modules`; do
  pushd $appdir

  REGISTRY_ORG="${REGISTRY_ORG:-dxos}"
  PKG_CHANNEL="${PKG_CHANNEL:-}"
  PKG_NAME=`cat package.json | jq -r '.name' | cut -d'/' -f2- | sed 's/-app$//'`
  REGISTRY_NAME="$REGISTRY_ORG/$PKG_NAME"

  cat <<EOF > app.yml
name: $PKG_NAME
build: yarn dist
EOF

  cat app.yml
  # TODO(burdon): Rename /app (consistently). Set ENV.
  echo "dxn://${REGISTRY_ORG}/application/${PKG_NAME}${PKG_CHANNEL}"

  yarn clean
  yarn -s dx app build

  if [ -d "dist/production" ]; then
    yarn -s dx app publish --path './dist/production'
  else
    yarn -s dx app publish
  fi

  yarn -s dx app register --name "dxn://${REGISTRY_ORG}/application/${PKG_NAME}${PKG_CHANNEL}"
  popd
done
