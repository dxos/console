# KUBE Server

## Development

Start the server.

```bash
rushx start  
```

To GET an endpoint

```bash
curl localhost:9004/kube/services -s | jq
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
