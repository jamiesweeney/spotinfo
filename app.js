/**
 * This is an example of a basic node.js script that performs
 * the Implicit Grant oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#implicit_grant_flow
 */

 var express = require( 'express' ) ;
 var nunjucks = require( 'nunjucks' ) ;
 var app = express() ;;

 var PATH_TO_TEMPLATES = 'public' ;
 nunjucks.configure( PATH_TO_TEMPLATES, {
     autoescape: true,
     express: app
 } ) ;


app.get( '/', function( req, res ) {
   return res.render( 'index.html' ) ;
} ) ;
app.get( '/login', function( req, res ) {
   return res.render( 'login.html' ) ;
} ) ;
app.get( '/home', function( req, res ) {
   return res.render( 'home.html' ) ;
} ) ;
app.get( '/playlists', function( req, res ) {
   return res.render( 'playlists.html' ) ;
} ) ;
app.get( '/favourites', function( req, res ) {
   return res.render( 'favourites.html' ) ;
} ) ;




app.use(express.static(__dirname + '/public'));

 app.listen( 8080 ) ;
