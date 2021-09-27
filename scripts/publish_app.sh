#!/bin/bash

set -euo pipefail

# TODO(burdon): Use array [console-app, keyhole-app]
for appdir in `find ./packages -name 'konsole-app' -type d | grep -v node_modules`; do
  pushd $appdir

  WNS_ORG="${WNS_ORG:-dxos}"
  PKG_CHANNEL="${PKG_CHANNEL:-}"
  PKG_NAME=`cat package.json | jq -r '.name' | cut -d'/' -f2- | sed 's/-app$//'`
  WNS_NAME="$WNS_ORG/$PKG_NAME"

  cat <<EOF > app.yml
name: $PKG_NAME
build: yarn build
EOF

  cat app.yml
  # TODO(burdon): Rename /app (consistently). Set ENV.
  echo "wrn://${WNS_ORG}/application/${PKG_NAME}${PKG_CHANNEL}"

  dx app deploy --dxns --name "konsole-app-v" --domain "vitalikm-org"

  yarn clean
  yarn -s wire app build

  if [ -d "dist/production" ]; then
    yarn -s wire app publish --path './dist/production'
  elif [ -d "build" ]; then
    yarn -s wire app publish --path './build'
  else
    yarn -s wire app publish
  fi

  yarn -s wire app register --name "wrn://${WNS_ORG}/application/${PKG_NAME}${PKG_CHANNEL}"
  popd
done
