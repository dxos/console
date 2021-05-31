# KUBE Server

Apollo GraphQL client.

## Usage

Start the server.

```bash
  yarn start  
```

Open the Apollo GraphQL playground: http://localhost:9004/api and run the status query:

```
{
  system_status {
    timestamp
    json
  }
}
```

## Publishing

```
yarn build

```

## Production

When running the KUBE server, either set the `CONFIG_FILE` environment variable or set the `--config` option.

```bash
  ./bin/kube-server.js --config ~/.wire/profile/local.yml
```
