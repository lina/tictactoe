var path = require('path');
var webpack = require('webpack');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var mainPath = path.resolve(__dirname, 'client/scripts/src/app');
var buildPath = path.resolve(__dirname, 'client/dist/');

var config = {
  devtool: 'eval', // Makes sure errors in console map to the correct file and line number
  entry: [
    // 'webpack-dev-server/client?http://0.0.0.0:3000', // The script refreshing the browser on none hot updates, WebpackDevServer host and port
    // 'webpack/hot/only-dev-server', // For hot style updates, "only" prevents reload on syntax errors
    mainPath // the application itself
  ],
  output: {
    path: buildPath, // We need to give Webpack a path. It does not actually need it, because files are kept in memory in webpack-dev-server, but an error will occur if nothing is specified. We use the buildPath as that points to where the files will eventually be bundled in production
    filename:'bundle.js',
    // publicPath: "http://0.0.0.0:3000/static/" // Everything related to Webpack should go through a build path, localhost:3000/build. That makes proxying easier to handle
    publicPath: "/"
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: 'style!css!sass'
      },
      {
        test: /\.ttf$|\.jpe?g$|\.png$|\.gif$/,
        loader: "url-loader"
      },
      {
        test: /\.jsx?$/,
        loaders: ['react-hot', 'jsx', 'babel'], //babel-loader as it gives you ES6/7 syntax and JSX transpiling out of the box
        exclude: [nodeModulesPath],
        include: path.join(__dirname, 'client/scripts/src')
      }
    ]
  },
  sassLoader: {
    includePaths: [path.resolve(__dirname, "client/styles/sass")]
  }
};

module.exports = config;
