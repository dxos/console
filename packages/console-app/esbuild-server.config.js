const { NodeGlobalsPolyfillPlugin, FixMemdownPlugin, NodeModulesPlugin } = require('@dxos/esbuild-plugins')
const { ConfigPlugin } = require('@dxos/config/dist/src/esbuild-plugin');

/** @type {import('esapp').Config} */
module.exports = {
  entryPoints: ['src/main.tsx'],
  staticDir: 'public',
  outdir: 'out',
  plugins: [
    NodeGlobalsPolyfillPlugin(),
    FixMemdownPlugin(),
    NodeModulesPlugin(),
    ConfigPlugin({
      dynamic: process.env.CONFIG_DYNAMIC === 'true',
    }),
    {
      name: 'resolve-fixup',
      setup({ onResolve }) {
        onResolve({ filter: /react-virtualized/ }, async args => {
          return {
            path: require.resolve('react-virtualized/dist/commonjs', { paths: [args.resolveDir] }),
          }
        })
      },
    }
  ]
}
