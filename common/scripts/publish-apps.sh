#/bin/sh

set -euo pipefail

[[ -e ~/.dx/profile/default ]] || dx profile init --name $DX_PROFILE --template-url "$DX_PROFILE_URL"

for APP_PATH in "packages/console-app" "packages/keyhole-app"
do
  cd $APP_PATH

  # Take an app or frame name, stripping "-app" or "-frame" suffix.
  PKG_NAME=`cat package.json | jq -r '.name' | cut -d'/' -f2- | sed 's/-app$//' | sed 's/-frame$//'`

  echo "::group::Publishing $PKG_NAME"
  
  # Canary deployment
  dx ns --account $DX_DXNS_ACCOUNT --verbose deploy --tag dev --version=false

  # Latest version deployment
  dx ns --account $DX_DXNS_ACCOUNT --verbose deploy --tag latest --skipExisting

  cd -
  echo "::endgroup::"
done
