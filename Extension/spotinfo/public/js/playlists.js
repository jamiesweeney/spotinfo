/**
* Jamie Sweeney
* June 2018
* favourites.js - Provides the js logic for the playlists html file./
*               - Displays all playlists split by owned/followed
**/

// Config options
// Layout options for chart
var layout = {
  title: "Playlist sizes",
  height: 450,
  width: 1100,
  xaxis: {
    title: "Size of playlist",
    titlefont: {
      family: "Courier New, monospace",
      size: 18,
      color: "#7f7f7f"
    }
  },
  yaxis: {
    title: "No. of playlists",
    titlefont: {
      family: "Courier New, monospace",
      size: 18,
      color: "#7f7f7f"
    }
  }
};
// Trace template for histogram graph
var histo_trace_template = {
  x: null,
  type: 'histogram',
  xbins: {
    end: null,
    size: null,
    start: 0
  }
};
// Trace template for line graph
var line_trace_template = {
  x: null,
  y: null,
  type: 'line',
};


// HTML template objects
var userPlaylistSource =
`
<tr>
  <td><img class="media-object" width="50" src="{{images.0.url}}" /></td>
  <td>{{name}}</td>
  <td>{{tracks.total}}</td>
  <td>{{followers.total}}</td>
  <td>{{public}}</td>
</tr>
`;
var userPlaylistTemplate = Handlebars.compile(userPlaylistSource);

var nuserPlaylistSource =
`
<tr>
  <td><img class="media-object" width="50" src="{{images.0.url}}" /></td>
  <td>{{name}}</td>
  <td>{{owner.id}}</td>
  <td>{{tracks.total}}</td>
  <td>{{followers.total}}</td>
</tr>
`;
var nuserPlaylistTemplate = Handlebars.compile(nuserPlaylistSource);


// Function definitions
/**
 * Converts the sizes array to a usable trace
 * @param  {json} data The request url
 * @return {array} Array containing [histo_trace, line_trace]
*/
function getTraces(data){

  // Construct histogram trace
  var trace_b = histo_trace_template;
  trace_b.x = data;
  trace_b.xbins.end = Math.max(...data);
  trace_b.xbins.size = Math.round(Math.max(...data)/10);

  // Construct line trace
  var trace_l = line_trace_template;
  counts = getCount(data)
  trace_l.x = Object.keys(counts);
  trace_l.y = Object.values(counts);

  return [trace_b, trace_l]
}

/**
 * Gets lists of all owned and followed playlists.
 * @param  {string} url The request url
*/
function getPlaylists(url){
  $.ajax({
      url: url,
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      success: function(response) {
        // Recursive call if most pages
        if (response.next != null){
          getPlaylists(response.next);
        }

        // Insert each playlist to the table
        for (var item in response.items){
          data = response.items[item]
          insertPlaylist(data)
        }
      },
      error: function(response){
        // Retry in 5 seconds if too many requests
        if (response.status == 429){
          setTimeout ( function(){ getPlaylists( url ) }, 5000 );
        }

      }
  });
}

/**
 * Gets all the playlist data for a single playlist and adds it to the relevant table
 * @param  {json} data The response data, for that list element
*/
function insertPlaylist(data){
  $.ajax({
      url: data.href,
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      success: function(response) {
        // Create table row node
        var node = document.createElement("tr");

        // If an owned playlist
        if (response.owner.id == user_id){
          // Add to table
          response.public = response.public?"public":"private";
          node.innerHTML =  userPlaylistTemplate(response)
          userPlaylistPlaceholder.appendChild(node);

          // Add to chart dataset
          user_pl_histo.push(response.tracks.total);

          // Update chart
          updateChart("user-hist")

        // If a followed playlist
        }else{
          // Add to table
          node.innerHTML =  nuserPlaylistTemplate(response)
          nuserPlaylistPlaceholder.appendChild(node);

          // Add to chart dataset
          nuser_pl_histo.push(response.tracks.total);

          // Update chart
          updateChart("nuser-hist")
        }
      },
      error: function(response){
        // Rety in 5 seconds if too many requests
        if (response.status == 429){
          setTimeout ( function(){ insertPlaylist( data ) }, 5000 );

        }
      }
  });
}

/**
 * Updates a chart with the new data and correct size
 * @param  {string} id The id of the graph container
*/
function updateChart(id){
  var traces;

  if (id == "user-hist"){
    traces = getTraces(user_pl_histo)
  }else{
    traces = getTraces(nuser_pl_histo)
  }

  // Update with new layout
  ly = layout
  ly.width = document.getElementById(id).parentElement.clientWidth
  Plotly.newPlot(id, traces, layout=ly);
}


// Open default tab
document.getElementById("default-tab").click();

// DOM elements
var userPlaylistPlaceholder = document.getElementById('user-playlists-table');
var nuserPlaylistPlaceholder = document.getElementById('nuser-playlists-table');
var user_hist_div = document.getElementById('user-hist');
var nuser_hist_div = document.getElementById('nuser-hist');

// Add onclick events to tab buttons to resize graph correctly
document.getElementById("user-pl-button").addEventListener("click", function(){
  updateChart("user-hist");
});
document.getElementById("nuser-pl-button").addEventListener("click", function(){
  updateChart("nuser-hist");
});

// Add on resize event to resize graphs to correct size
window.onresize = function(event) {
  updateChart("user-hist")
  updateChart("nuser-hist")
};

// Get url paramters (if any)
var params = getHashParams();
var access_token = params.access_token

// Get user data
userData = getUserData(access_token)
if (userData){

  var user_pl_histo = [];
  var nuser_pl_histo = [];
  var user_id = userData.id;
  getPlaylists('https://api.spotify.com/v1/me/playlists?limit=50&offset=0')
}else{
  // or redirect to login
  window.location = LOGIN_URI;
}
