# Console

Apollo GraphQL client.

## Usage

First start the server:

```bash
  cd packages/console-server
  yarn start
```

Then start the Webpack devserver.

```bash
  cd packages/console-app
  yarn start
```

Then load the app: http://localhost:8080.

## Using a KUBE

If you would like to use a KUBE for testing, rather than running all the
services locally, you can specify a different config file when starting:
`config-kube.yml` to use `kube.local` and `config-testnet.yml` to use 
`demo.kube.dxos.network`.

For example:

```javascript
  cd packages/console-app
  CONFIG_FILE=config-kube.yml yarn start
```

## Deploy

```bash
  yarn build
```

This creates the following folders:

```
/dist
  /es               # Module imports.
  /production       # Production build.
```

NOTE: GQL and Production files and exported and may be used by the server.

```javascript
import QUERY_STATUS from '@dxos/console-client/gql/system_status.graphql';
import config from '@dxos/console-client/config.json';

...

const file = path.join(__dirname + '../../../../node_modules/@dxos/console-client/dist/production', 'index.html');
res.sendFile(file);
```
