# Console

Apollo GraphQL client.

## Usage

Use the following command to run the server at: http://localhost:9004

```bash
  yarn start  
```

To test the Console app, the `@dxos/console-app` must be built first:

```bash
  cd ../console-app
  yarn build
```

Use the following command to run the client in development mode (via the `webpack-dev-server`) at http://localhost:8080

```bash
  yarn dev
```

To build the client and serve it directly from the server:

```bash
  yarn build
  yarn start
```

Then open the app at: http://localhost:9004/console


## Production

When running the Console server, either set the `CONFIG_FILE` environment variable or set the `--config` option.

```bash
  ./bin/console.js --config ./config.yml
```

NOTE: The server passes its configuration directly to the Console app when it is loaded.
