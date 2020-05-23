# Console

Apollo GraphQL client.

## Usage

```bash
  yarn
  yarn start
```

http://localhost:8080


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
import QUERY_STATUS from '@dxos/console-client/gql/status.graphql';
import config from '@dxos/console-client/config.json';

...

const file = path.join(__dirname + '../../../../node_modules/@dxos/console-client/dist/production', 'index.html');
res.sendFile(file);
```
