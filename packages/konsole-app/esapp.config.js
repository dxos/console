const { NodeGlobalsPolyfillPlugin, FixMemdownPlugin, NodeModulesPlugin } = require('@dxos/esbuild-plugins')
const { resolve } = require('path')
const yaml = require('js-yaml')
const { readFileSync } = require('fs')

const DEFAULT_PATH = resolve(process.cwd(), 'config');

const KEYS_TO_FILE = {
  __CONFIG_DEFAULTS__: 'defaults.yml',
  // __CONFIG_ENVS__: 'envs-map.yml',
  __CONFIG_DYNAMICS__: 'config.yml'
};

/** @type {import('esapp').Config} */
module.exports = {
  entryPoints: ['src/main.tsx'],
  staticDir: 'public',
  plugins: [
    NodeGlobalsPolyfillPlugin(),
    FixMemdownPlugin(),
    NodeModulesPlugin(),
    {
      name: 'dxos-config',
      setup: ({ onResolve, onLoad, initialOptions }) => {
        onResolve({ filter: /loaders\/index$/ }, args => ({ path: require.resolve('@dxos/config/dist/src/loaders/browser', { paths: [args.resolveDir]}) }))

        const injected = [
          resolve(__dirname, 'configGlobal.js')
        ]

        if (initialOptions.inject) {
          initialOptions.inject.push(...injected);
        } else {
          initialOptions.inject = [...injected];
        }

        onResolve({ filter: /^dxos-config-globals$/, }, () => ({ path: 'dxos-config-globals', namespace: 'dxos-config' }))

        const definitions = Object.entries(KEYS_TO_FILE).reduce((prev, [key, value]) => {
          let content = {};
          try {
            content = yaml.load(readFileSync(resolve(DEFAULT_PATH, value)));
    
            // if (value === 'envs-map.yml') {
            //   content = mapFromKeyValues(content, process.env);
            // }
          } catch (error) {
            console.error(error)
            // compiler.hooks.thisCompilation.tap('ConfigPlugin', compilation => {
            //   const error = new WebpackError(`
            //   `)
            //   error.name = 'EnvVariableNotDefinedError';
            //   compilation.errors.push(error);
            // });
          }
          return {
            ...prev,
            [key]: content
          };
        }, {
          __DXOS_CONFIG__: { dynamic: false, publicUrl: '' },
          __CONFIG_ENVS__: {}
        })
        

        onLoad({ filter: /^dxos-config-globals$/, namespace: 'dxos-config' }, () => ({
          resolveDir: __dirname,
          contents: Object.entries(definitions).map(([key, value]) => `window.${key} = ${JSON.stringify(value)};`).join('\n'),
        }))
      }
    },
  ]
}
