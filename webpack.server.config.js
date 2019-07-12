// Work around for https://github.com/angular/angular-cli/issues/7200

const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'none',
  entry: {
    // This is our Express server for Dynamic universal
    server: './bin/server.ts'
  },

  /* my settings start */
  //add watching functionality
  watchOptions: {
    ignored: [/dist/, /node_modules/],
    poll: 1000
  },
  externals: [nodeExternals({
    whitelist: [/^@ng-bootstrap/, /^@auth0/, /^angular-froala-wysiwyg/]
  })],
  //fix graphQL Error
  resolve: {
    extensions: ['.ts', '.mjs', '.js']
  },
  /* my settings end */



  /* old settings start 
  externals: [/(node_modules|main\..*\.js)/],
  externals: {
    './dist/server/main': 'require("./server/main")'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  ** old settings end */

  target: 'node',
  optimization: {
    minimize: false
  },
  output: {
    // Puts the output at the root of the dist folder
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    noParse: /polyfills-.*\.js/,
    rules: [{
        test: /\.ts$/,
        loader: 'ts-loader'
      },
      {
        // Mark files inside `@angular/core` as using SystemJS style dynamic imports.
        // Removing this will cause deprecation warnings to appear.
        test: /(\\|\/)@angular(\\|\/)core(\\|\/).+\.js$/,
        parser: {
          system: true
        },
      },
    ]
  },
  plugins: [
    new webpack.ContextReplacementPlugin(
      // fixes WARNING Critical dependency: the request of a dependency is an expression
      /(.+)?angular(\\|\/)core(.+)?/,
      path.join(__dirname, 'src'), // location of your src
      {} // a map of your routes
    ),
    new webpack.ContextReplacementPlugin(
      // fixes WARNING Critical dependency: the request of a dependency is an expression
      /(.+)?express(\\|\/)(.+)?/,
      path.join(__dirname, 'src'), {}
    )
  ]
};
