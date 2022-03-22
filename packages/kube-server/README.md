# KUBE Server

## Development

Start the server.

```bash
yarn start  
```

NOTE(burdon): Logging does not seem to be flushed.

To GET an endpoint

```bash
curl localhost:9004/kube/services -s | jq
```

To POST to and endpoint

```bash
curl -s -X POST localhost:9004/kube/matrix -H "Content-Type: application/json" -d '{ "pattern": "test" }' | jq
```

## Publishing

```
yarn build

```

## Production

When running the KUBE server, either set the `CONFIG_FILE` environment variable or set the `--config` option.

```bash
  ./bin/kube-server.js --config ~/.dx/profile/local.yml
```
