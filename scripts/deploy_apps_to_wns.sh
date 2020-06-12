#!/bin/bash

set -euo pipefail

for appdir in `find ./packages -name '*-app' -type d | grep -v node_modules`; do
  pushd $appdir

  ORG="dxos.network"
  PKG_NAME=`cat package.json | jq -r '.name' | cut -d'/' -f2-`
  PKG_DESC=`cat package.json | jq -r '.description'`
  PKG_VERSION=`cat package.json | jq -r '.version'`
  
  if [ -z "$PKG_DESC" ]; then
    PKG_DESC="$PKG_NAME"
  fi
  
  WNS_NAME="$ORG/$PKG_NAME"
  WNS_VERSION=`yarn -s wire app query --name "$WNS_NAME" | jq -r '.[0].version'`
  
  if [ -z "$WNS_VERSION" ]; then
    WNS_VERSION="0.0.0"
  fi
  
  cat <<EOF > app.yml
name: $WNS_NAME
displayName: $PKG_DESC
build: yarn dist
version: $WNS_VERSION
EOF
  
  yarn -s wire app build
  if [ -d "dist/production" ]; then
    yarn -s wire app publish --path './dist/production'
  else
    yarn -s wire app publish
  fi
  yarn -s wire app register

  popd
done