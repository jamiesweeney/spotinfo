/**
* Jamie Sweeney
* June 2018
* base.js - Provides the  js logic for logging in.
**/

// Add login link
document.getElementById("login-button").addEventListener('click', function() {authenticateWithSpotify();});

// Get url paramters (if any)
var params = getHashParams();
var access_token = params.access_token

// Redirect user if already authenticated 
userData = getUserData(access_token)
if (userData){
    var link_params = paramsToURI(params)
    window.location = REDIRECT_URI + "#" + link_params;
}
