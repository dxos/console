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
  cd packages/consoe-app
  yarn start
```

Then load the app: http://localhost:8080.

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
