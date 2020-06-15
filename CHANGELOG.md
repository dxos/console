# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### ISSUES
- 05/31/20: https://github.com/webpack/webpack-cli/issues/1602 (webpack-cli issue with monorepos)

### Added

- [x] Fixed hook that causes 100x rerendering.
- [x] Logging.
- [x] Error handling.
- [x] Table sorting.
- [x] Version check.
- [x] Fix JsonTree (yarn link).
- [x] Client resolvers: https://www.apollographql.com/docs/tutorial/local-state/
- [x] Test backend IPFS client request.
- [x] Hash Router.
- [x] Layout (with Material UI).
- [x] config from provider.
- [x] Error boundary.
- [x] Server React app from server.
    - https://www.freecodecamp.org/news/how-to-set-up-deploy-your-react-app-from-scratch-using-webpack-and-babel-a669891033d4/
- [x] Monorepo for client/server.
- [x] Basic React/Apollo component.

### Next

- [ ] Webpack and dynamic config 
- [X] Complete WNS functionality
    - [X] Logging
    - [X] Trigger server-side wire commands
    - [X] Test on device in production.
- [X] IPFS
- [X] Apps
- [ ] Bots
- [X] Signal
- [ ] Metadata

- [ ] https://github.com/standard/standardx (JSX)
- [ ] Client/server API abstraction (error handler, etc.)
- [X] Port dashboard API calls (resolve config first).
- [ ] Port dashboard react modules with dummy resolvers.
- [ ] Auth for mutations.
