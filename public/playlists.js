var params = getHashParams();
var access_token = params.access_token
var user_id;

console.log("sdfsf")

var userPlaylistSource =
`
<tr>
  <td><img class="media-object" width="50" src="{{images.0.url}}" /></td>
  <td>{{name}}</td>
  <td>{{tracks.total}}</td>
  <td>{{followers.total}}</td>
</tr>
`;
var userPlaylistTemplate = Handlebars.compile(userPlaylistSource);
var userPlaylistPlaceholder = document.getElementById('user-playlists-table');

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
var nuserPlaylistPlaceholder = document.getElementById('nuser-playlists-table');

var user_pl_histo = [];
var nuser_pl_histo = [];

var user_hist_div = document.getElementById('user-hist');
var nuser_hist_div = document.getElementById('nuser-hist');


var trace_temp = {
    x: null,
    type: 'histogram',
    xbins: {
      end: null,
      size: null,
      start: 0
    }
  };

function getTrace(data){
  var trace = trace_temp;
  trace.x = data;
  trace.xbins.end = Math.max(...data);
  trace.xbins.size = Math.round(Math.max(...data)/10);
  return trace
}





var footer_div = document.getElementsByClassName("footer")[0]
console.log(footer_div)

function getPlaylists(url){
  $.ajax({
      url: url,
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      success: function(response) {
        if (response.next != null){
          getPlaylists(response.next);
        }

        for (var item in response.items){
          data = response.items[item]
          insertPlaylist(data)
        }
      },
      error: function(response){
        if (response.status == 429){
          setTimeout ( function(){ getPlaylists( url ) }, 5000 );
        }

      }
  });
}


function insertPlaylist(data){
  $.ajax({
      url: data.href,
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      success: function(response) {
        console.log("in")
        var node = document.createElement("tr");
        if (response.owner.id == user_id){
          node.innerHTML =  userPlaylistTemplate(response)
          userPlaylistPlaceholder.appendChild(node);
          user_pl_histo.push(response.tracks.total);
          var trace = getTrace(user_pl_histo);
          Plotly.newPlot(user_hist_div.id, [trace]);
        }else{
          node.innerHTML =  nuserPlaylistTemplate(response)
          nuserPlaylistPlaceholder.appendChild(node);
          nuser_pl_histo.push(response.tracks.total);
          var trace = getTrace(nuser_pl_histo);
          Plotly.newPlot(nuser_hist_div.id, [trace]);
        }
      },
      error: function(response){
        if (response.status == 429){
          setTimeout ( function(){ insertPlaylist( data ) }, 5000 );

        }
      }
  });
}

function startup(){


  $.ajax({
      url: 'https://api.spotify.com/v1/me',
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      success: function(response){
        user_id  = response.id
        getPlaylists('https://api.spotify.com/v1/me/playlists?limit=50&offset=0')
      },
      error: function(response){
        if (response.status == 429){
          setTimeout ( function(){ startup() }, 5000 );
        }
      }
  });
}

if (!checkAuthentication()) {
  window.location = LOGIN_URI;
}else{
  console.log("sdfsdf")
  startup()
}
