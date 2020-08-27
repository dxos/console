#!/bin/bash

set -euo pipefail

for appdir in `find ./packages -name '*-app' -type d | grep -v node_modules`; do
  pushd $appdir

  WNS_ORG="dxos"
  PKG_NAME=`cat package.json | jq -r '.name' | cut -d'/' -f2- | sed 's/-app$//'`
  PKG_DESC=`cat package.json | jq -r '.description'`
  PKG_VERSION=`cat package.json | jq -r '.version'`
  
  if [ -z "$PKG_DESC" ]; then
    PKG_DESC="$PKG_NAME"
  fi
  
  WNS_NAME="$WNS_ORG/$PKG_NAME"
  WNS_VERSION=`yarn -s wire wns name resolve wrn://${WNS_ORG}/application/${PKG_NAME} | jq -r '.records[0].attributes.version'`
  
  if [ -z "$WNS_VERSION" ]; then
    WNS_VERSION="0.0.1"
  fi
  
  cat <<EOF > app.yml
name: $PKG_NAME
build: yarn dist
version: $WNS_VERSION
EOF
  
  yarn clean

  # TODO(telackey): We need to fix `wire app build` not to bake in a path!
  # In the meantime, use `yarn dist` which will not.
  # yarn -s wire app build
  yarn dist

  if [ -d "dist/production" ]; then
    yarn -s wire app publish --path './dist/production'
  else
    yarn -s wire app publish
  fi
  yarn -s wire app register --name "wrn://${WNS_ORG}/application/${PKG_NAME}"

  popd
done
