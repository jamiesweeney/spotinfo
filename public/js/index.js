/**
* Jamie Sweeney
* June 2018
* base.js - Provides the  js logic for the index page.
**/


// Get url paramters (if any)
var params = getHashParams();
var access_token = params.access_token

console.log(params)

// Get user data
userData = getUserData(access_token)
if (userData){
    var link_params = paramsToURI(params)
    window.location = REDIRECT_URI + "#" + link_params;
}else{
  // or redirect to login
  window.location = LOGIN_URI;
}
