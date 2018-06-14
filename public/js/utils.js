/**
* Jamie Sweeney
* June 2018
* utils.js - Provides js functions used by the whole project.
**/

// Configuration variables
var CLIENT_ID = 'f73f551e914f4915a7c38d75fa074cfb';
var AUTH_URI = 'https://accounts.spotify.com/authorize'
var LOGIN_URI = 'http://127.0.0.1:8080/login'
var REDIRECT_URI = 'http://127.0.0.1:8080/home'
var SCOPE = 'user-read-private user-read-email'


// Function definitions
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
 * Converts URL parameters to url 
 * @param {json} data The parameters to use  
 * @return {string} The url created
 */
function paramsToURI(dict) {
  var str = [];
  for(var p in dict){
     str.push(encodeURIComponent(p) + "=" + encodeURIComponent(dict[p]));
  }
  return str.join("&");
}

/**
 * Opens a tab    
 * @param {event} evt The event created by clicking the tab header   
 * @param {string} tabName The id of the tab to be shown  
 */
function openTab(evt, tabName) {
    
  // Get all tabs
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  // Hide them all
  for (i = 0; i < tabcontent.length;   i++) {
      tabcontent[i].style.display = "none";
  }
  // Make all links unactive
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  // Make selected tab visible and active
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

/**
 * Returns the counts for all elements in an array 
 * @param {[int]} arr An array of integers  
 * @return {dict} Dictionary with format {element:count}
 */
function getCount(arr) {
  return arr.reduce((prev, curr) => (prev[curr] = ++prev[curr] || 1, prev), {})
}

/**
 * Retrieves the user data via a GET request.
 * @param  {string} access_token The access token to use when making the GET request.
 * @return  {json} The user data json response.
 * 
*/
function getUserData(access_token){
  var response_data;
  $.ajax({
      url: 'https://api.spotify.com/v1/me',
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      success: function(response) {
        // Make sure we don't have a null display name
        if (response.display_name == null){
          response.display_name = response.id
        }
        response_data = response
      },
      error: function(response) {
        // Retry in 5 seconds if too many requests
        if (response.status == 429){
          return_data = setTimeout ( function(){ getUserData() }, 5000 );
        }
      },
      // This is essential, since we need the rest of the page to wait for this to happen
      async: false
  });
  return response_data
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

  // Load config
  var url = AUTH_URI;

  // Generate a state key
  // var state = generateRandomString(32);

  // Make authentication request
  url += '?response_type=token';
  url += '&client_id=' + encodeURIComponent(CLIENT_ID);
  url += '&scope=' + encodeURIComponent(SCOPE);
  url += '&redirect_uri=' + encodeURIComponent(REDIRECT_URI);
  url += '&state=' + encodeURIComponent(SCOPE);
  url += '&show_dialog=' + encodeURIComponent(true);
  window.location = url;
};

/**
 * Sorts a table for a given column.
 * @param  {int} n The column to sort by.
 * @param  {string} id The id of the table div.
 * @return {t} The datatype thats being sorted, either "text" or "num".
 * 
*/
function sortTable(n, id, t) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById(id);
  switching = true;
  //Set the sorting direction to ascending:
  dir = "asc";

  headers =  table.getElementsByTagName("TH");
  for (i = 1; i < (headers.length - 1); i++) {
    headers[i].childNodes[1].innerHTML="<i class='fas fa-sort'></i>";
  }
  headers[n].childNodes[1].innerHTML="<i class='fas fa-sort-up'></i>";


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
        headers[n].childNodes[1].innerHTML="<i class='fas fa-sort-down'></i>";
      }
    }
  }
}
