import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import resolve from 'rollup-plugin-node-resolve'
import url from 'rollup-plugin-url'

import pkg from './package.json'

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs'
    },
    {
      file: pkg.module,
      format: 'es'
    }
  ],
  plugins: [
    external(),
    postcss({
      modules: true
    }),
    url(),
    babel({
      exclude: 'node_modules/**'
    }),
    resolve(),
    commonjs({
      /**
       * Rollup had issues importing ReactIs modules, so we needed
       * namedExports for it to work.
       *
       * More info:
       * https://stackoverflow.com/questions/50080893/rollup-error-isvalidelementtype-is-not-exported-by-node-modules-react-is-inde
       * https://github.com/rollup/rollup/wiki/Troubleshooting#name-is-not-exported-by-module
       * https://github.com/rollup/rollup-plugin-commonjs#custom-named-exports
       */
      namedExports: {
        // left-hand side can be an absolute path, a path
        // relative to the current directory, or the name
        // of a module in node_modules
        'node_modules/react-is/index.js': [
          'isValidElementType',
          'isContextConsumer'
        ]
      }
    })
  ]
}
