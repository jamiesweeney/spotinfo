

// Configuration variables
var CLIENT_ID = 'f73f551e914f4915a7c38d75fa074cfb';
var AUTH_URI = 'https://accounts.spotify.com/authorize'
var LOGIN_URI = 'http://127.0.0.1:8080/login'
var REDIRECT_URI = 'http://127.0.0.1:8080/home'
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
            return_status = setTimeout ( function(){ checkAuthentication() }, 5000 );
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




function sortTable(n, id, t) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById(id);
  switching = true;
  //Set the sorting direction to ascending:
  dir = "asc";
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByTagName("TR");
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /*check if the two rows should switch place,
      based on the direction, asc or desc:*/

      if (t == "text"){
        if (dir == "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            //if so, mark as a switch and break the loop:
            shouldSwitch= true;
            break;
          }
        } else if (dir == "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            //if so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }else if (t == "num"){
        if (dir == "asc") {
          if (Number(x.innerHTML) > Number(y.innerHTML)) {
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (Number(x.innerHTML) < Number(y.innerHTML)) {
            shouldSwitch = true;
            break;
          }
        }
      }else{break;}
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      //Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /*If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again.*/
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}
