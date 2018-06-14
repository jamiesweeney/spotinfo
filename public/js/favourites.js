/**
* Jamie Sweeney
* June 2018
* favourites.js - Provides the  js logic for the favourites html file./
*               - Displays favourite artists/songs over 3 different time periods
**/


// Config options
// Options for network graph
var options = {
  autoResize: true,
  height: '100%',
  width: '100%',
  locale: 'en',
  clickToUse: false,
  configure: {
    enabled: false
  },    // defined in the configure module.
  edges: {},        // defined in the edges module.
  nodes: {},        // defined in the nodes module.
  groups: {},       // defined in the groups module.
  layout: {},       // defined in the layout module.
  interaction: {},  // defined in the interaction module.
  manipulation: {}, // defined in the manipulation module.
  physics: {
    enabled:true,
    barnesHut: {
      damping: 1,
      centralGravity: 5,
      gravitationalConstant: -10000,
      avoidOverlap: 1,
  },
  maxVelocity: 20,
  minVelocity: 10,
}      // defined in the physics module.
} 

// HTML template objects
var favSongSource =
`
<tr>
  <td><img class="media-object" width="50" src="{{album.images.0.url}}" /></td>
  <td>{{rank}}</td>
  <td>{{name}}</td>
  <td>{{artists.0.name}}</td>
  <td>{{album.name}}</td>
  <td>{{popularity}}</td>
</tr>
`;
var favSongTemplate = Handlebars.compile(favSongSource);

var favArtistSource =
`
<tr>
  <td><img class="media-object" width="50" src="{{images.0.url}}" /></td>
  <td>{{rank}}</td>
  <td>{{name}}</td>
  <td>{{genres}}</td>
  <td>{{popularity}}</td>
</tr>
`;
var favArtistTemplate = Handlebars.compile(favArtistSource);


// Function definitions
/**
 * Gets list of favourites for a specified time and type.
 * @param  {string} url The request url
 * @param  {string} time The time period, from ["short", "medium", "long"]
 * @param  {string} type Either "songs" or "artists" 
*/
function getFavourites(url, time, type){

  // If artists, need to make a data sets and graph for genres
  if (type == "artists"){
    var graph_nodes = new vis.DataSet([]);
    var graph_edges = new vis.DataSet([]);
    var graph_container = document.getElementById('g-graph-'+time);

    // Initialise netowork graph
    var data = {
      nodes: graph_nodes,
      edges: graph_edges
    };
    var network = new vis.Network(graph_container, data, options);     
  }

  $.ajax({
      url: url,
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      success: function(response) {

        if (response.next != null){
          // Recursive call if most pages
          getTracks(response.next, time, type);
        }

        // Insert each data item
        for (var item in response.items){
          data = response.items[item];
          if (type == "songs"){
            insertTracks(data, time, Number(item)+1)
          }else{
            insertArtists(data, time, Number(item)+1, graph_nodes, graph_edges, graph_container)

          }
        }
      },
      error: function(response){
        // Retry after 5 seconds if too many requests response
        if (response.status == 429){
          setTimeout ( function(){ getFavourites(url, time, type) }, 5000 );
        }

      }
  });
}

/**
 * Inserts a track to the list
 * @param  {json} data The api response data
 * @param  {string} time The time period, from ["short", "medium", "long"]
 * @param  {int} rank The items place in the table. 
*/
function insertTracks(data, time, rank){
  $.ajax({
      url: data.href,
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      success: function(response) {
        
        // Create table row node
        response.rank = rank
        var node = document.createElement("tr");
        node.innerHTML =  favSongTemplate(response)

        // Insert into the table
        tableId = 'fav-'+time+'-songs-table'
        document.getElementById(tableId).appendChild(node);
      },
      error: function(response){
        // Retry after 5 seconds if too many requests response
        if (response.status == 429){
          setTimeout ( function(){ insertTracks( data, time, rank ) }, 5000 );

        }
      }
  });
}

/**
 * Inserts a artist to the list
 * @param  {json} data The api response data
 * @param  {string} time The time period, from ["short", "medium", "long"]
 * @param  {int} rank The items place in the table.
 * @param  {vis.DataSet} graph_nodes The dataset object for graph nodes.
 * @param  {vis.DataSet} graph_edges The dataset object for graph edges.
 * @param  {div} graph_container The graph container.
 * 
*/
function insertArtists(data, time, rank, graph_nodes, graph_edges, graph_container){
  $.ajax({
      url: data.href,
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      success: function(response) {

        // Create table row node
        response.rank = rank
        var node = document.createElement("tr");
        node.innerHTML =  favArtistTemplate(response)

        // Insert into the table
        tableId = 'fav-'+time+'-artists-table'
        document.getElementById(tableId).appendChild(node);


        // Add each genre to the graph
        for (genre in response.genres){
          g = response.genres[genre];

          // If already in the graph
          if (graph_nodes.getIds().includes(g)){
            // Add 10 to the size of the node
            graph_nodes.update({
              id: g,
              label: g,
              font:{
                size: graph_nodes.get(g).font.size+10
              }
            });
          // Else - is a new genre
          }else{
            // Add to the graph
            graph_nodes.add({
              id: g,
              label: g,
              font: {
                size:10
              }
            });
          }

          // Add edges to all genres that have already been added
          for (genre2 in response.genres){
            g2 = response.genres[genre2]
            
            // Break when we reach current genre (in outer loop)
            if (g == g2){
              break
            }
        
            if (!(graph_edges.get(g+'$'+g2) || graph_edges.get(g2+'$'+g))){
              // Add undirected edge
              graph_edges.add({
                id: g+'$'+g2,
                from: g,
                to: g2
              });
            }
          }
        }
      },
      error: function(response){
        // Retry after 5 seconds if too many requests response
        if (response.status == 429){
          setTimeout ( function(){ insertArtists( data, time, rank, graph_nodes, graph_edges, graph_container ) }, 5000 );

        }
      }
  });
}

/**
 * Starts each individual favourites process 
*/
function startup(){
  getFavourites('https://api.spotify.com/v1/me/top/tracks?limit=50&offset=0&time_range=short_term', "short", "songs")
  getFavourites('https://api.spotify.com/v1/me/top/tracks?limit=50&offset=0&time_range=medium_term', "medium", "songs")
  getFavourites('https://api.spotify.com/v1/me/top/tracks?limit=50&offset=0&time_range=long_term', "long", "songs")
  getFavourites('https://api.spotify.com/v1/me/top/artists?limit=50&offset=0&time_range=short_term', "short", "artists")
  getFavourites('https://api.spotify.com/v1/me/top/artists?limit=50&offset=0&time_range=medium_term', "medium", "artists")
  getFavourites('https://api.spotify.com/v1/me/top/artists?limit=50&offset=0&time_range=long_term', "long", "artists")
}

// DOM elements
var favSongPlaceholder = document.getElementById('fav-songs-table');
var favArtistPlaceholder = document.getElementById('fav-artist-table');

// Get url paramters (if any)
var params = getHashParams();
var access_token = params.access_token

// Get user data
userData = getUserData(access_token)
if (userData){
  startup()
}else{
  // or redirect to login
  window.location = LOGIN_URI;
}