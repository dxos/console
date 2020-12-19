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

To use your KUBE for testing, rather than running all the services locally, specify a different
config file when starting: `config-kube.yml`, which connects to `kube.local` for all services.

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

## PWA

- https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Add_to_home_screen#Manifest
- https://webpack.js.org/guides/progressive-web-application/
- https://medium.com/effective-developers/how-to-test-pwa-daa1a6eaf7bf
