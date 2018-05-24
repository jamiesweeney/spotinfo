

// Configuration variables
var CLIENT_ID = 'f73f551e914f4915a7c38d75fa074cfb';
var AUTH_URI = 'https://accounts.spotify.com/authorize'
var LOGIN_URI = 'http://127.0.0.1:8080/login.html'
var REDIRECT_URI = 'http://127.0.0.1:8080/home.html'
var SCOPE = 'user-read-private user-read-email'

/**
 * Obtains parameters from the hash of the URL
 * @return Object
 */
function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
  while ( e = r.exec(q)) {
     hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}


/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
*/
function generateRandomString(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};


/**
 * Gets the user authenticated using the implicit grant redirect
*/
function authenticateWithSpotify(){

  // load config
  var client_id = CLIENT_ID;
  var redirect_uri = REDIRECT_URI;
  var scope = SCOPE;
  var url = AUTH_URI;

  // generate a state key
  var state = generateRandomString(16);

  // make authentication request
  url += '?response_type=token';
  url += '&client_id=' + encodeURIComponent(client_id);
  url += '&scope=' + encodeURIComponent(scope);
  url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
  url += '&state=' + encodeURIComponent(state);
  url += '&show_dialog=' + encodeURIComponent(true);
  window.location = url;
};


/**
 * Checks the users auth parameters by performing a request
 * @return {boolean} Authentication status
*/
function checkAuthentication(){

  // get the auth parameters
  var params = getHashParams();
  var access_token = params.access_token,
      state = params.state

  if (access_token == null || state == null){
    return false;
  }

  var return_status;

  // attempt to get profile info
  $.ajax({
      url: 'https://api.spotify.com/v1/me',
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      success: function(response) {
        return_status = true;
      },
      error: function(response) {
        return_status = false
        console.log("Auth invalid")
        console.log(response)
        switch(response.status) {
          case 400:
            // TODO: Handle error
            console.log("400 - Bad Request");
            break;
          case 401:
            // TODO: Handle error
            console.log("401 - Unauthorized");
            break;
          case 403:
            // TODO: Handle error
            console.log("403 - Forbidden");
            break;
          case 404:
            // TODO: Handle error
            console.log("404 - Not found");
            break;
          case 429:
            // TODO: Handle error
            console.log("429 - Rate limited");
            break;
          case 500:
            // TODO: Handle error
            console.log("500 - Internal server error");
            break;
          case 502:
            // TODO: Handle error
            console.log("502 - Bad gateway");
            break;
          case 503:
            // TODO: Handle error
            console.log("503 - Service unavailable");
            break;
          default:
            console.log("Unknown error");
        }
      },
      async: false
  });
  return return_status
}
