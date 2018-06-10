/**
* Jamie Sweeney
* June 2018
* app.js - Provides the backend web application logic.
**/


// Load our required modules
var express = require('express'),
  nunjucks = require('nunjucks');

var app = express() ;;


// URL to template matching object
// var url_map = {
//   '/':'index.html',
//   '/login':'login.html',
//   '/home':'home.html',
//   '/playlists':'playlists.html',
//   '/favourites':'favourites.html'
// };


// Configure template directory
var PATH_TO_TEMPLATES = 'templates/' ;
nunjucks.configure(PATH_TO_TEMPLATES, {
  autoescape: true,
  express: app
});


// Configure page requests
app.get('/', function(req, res){
  return res.render('index.html');
});
app.get('/test', function(req, res){
  return res.render('test.html');
});

app.get('/login', function(req, res){
  return res.render('login.html');
});
app.get('/home', function(req, res){
  return res.render('home.html');
});
app.get('/playlists', function(req, res){
  return res.render('playlists.html');
});
app.get('/favourites', function(req, res){
  return res.render('favourites.html');
});


// Configure serving of web application files and node modules
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));


// Start the app
app.listen( 8080 ) ;
