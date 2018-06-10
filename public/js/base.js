/**
* Jamie Sweeney
* June 2018
* base.js - Provides the  js logic for the base html file./
*         - Checks authentication, adjusts header accordingly
**/


// HTML template objects
var profileImageSource =
`
<div class="pull-left">

  <a href={{external_urls.spotify}}><img width="80" height=80 src="{{images.0.url}}"/></a>
</div>
<a href={{external_urls.spotify}}>{{display_name}}</a>
`;
var profileImageTemplate = Handlebars.compile(profileImageSource);


// Function definitions


/**
 * Inserts the data from getUserData into the page header.
 * @param  {json} response The JSON of the response recieved from getUserData
*/
function insertUserData(response){
  // Put data into template
  profileImagePlaceholder.innerHTML = profileImageTemplate(response);

  // Get extra paramters to add to buttons
  var link_params = paramsToURI(getHashParams())

  // Adjust header link buttons
  headerLogx.innerHTML = "Logout"
  headerLogx.href = "/logout"

  headerHome.href = "/home#" + link_params

  headerPlaylists.href = "/playlists#" + link_params
  headerPlaylists.style.visibility = "visible"

  headerFavourites.href = "/favourites#" + link_params
  headerFavourites.style.visibility = "visible"
}


// DOM elements
var profileImagePlaceholder = document.getElementById('profile-image');

var headerLogo = document.getElementById('header-btn-logo');
var headerLogx = document.getElementById('header-btn-logx');
var headerHome = document.getElementById('header-btn-home');
var headerPlaylists = document.getElementById('header-btn-playlists');
var headerFavourites = document.getElementById('header-btn-favourites');


// Get url paramters (if any)
var params = getHashParams();
var access_token = params.access_token

userData = getUserData(access_token)
if (userData){
  insertUserData(userData)
}
stopLoading()
