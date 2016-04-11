var express = require('express');
var port = 5000;

var app = express();

app.set('view engine', 'ejs');

app.get('/', function(req, res){
  res.render('pages/index');
});

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config.js');
var webserverPort = 3000;

new WebpackDevServer(webpack(webpackConfig), {
  publicPath: webpackConfig.output.publicPath,
  hot:true,
  inline: true,
  historyApiFallback: true,
  stats: {
    colors: true
  }
}).listen(webserverPort, '0.0.0.0', function(err, result) {
  if(err) {
    console.log({err: err}, 'Error when connecting to WebpackDevServer');
  }

  console.log({port: webserverPort}, 'Listening on WebpackDevServer port');
});

// specify static content folder
app.use('/', express.static(__dirname + '/client'));

app.listen((process.env.PORT || port), function(){
  console.log('Tic Tac Toe App is running on port 5000');
});
