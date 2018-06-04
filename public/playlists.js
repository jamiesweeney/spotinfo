var params = getHashParams();
var access_token = params.access_token
var user_id;


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


var trace_temp_b = {
    x: null,
    xabel:"asdasd",
    type: 'histogram',
    xbins: {
      end: null,
      size: null,
      start: 0
    }
  };

var trace_temp_l = {
    x: null,
    y: null,
    type: 'line',
};

var layout = {
  title: "Plalist sizes",
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

function getTraces(data){
  var trace_b = trace_temp_b;
  trace_b.x = data;
  trace_b.xbins.end = Math.max(...data);
  trace_b.xbins.size = Math.round(Math.max(...data)/10);

  var trace_l = trace_temp_l;
  counts = getCount(data)
  trace_l.x = Object.keys(counts);
  trace_l.y = Object.values(counts);

  return [trace_b, trace_l]
}





var footer_div = document.getElementsByClassName("footer")[0]

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
          console.log(data)
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
        var node = document.createElement("tr");
        if (response.owner.id == user_id){
          response.public = response.public?"public":"private"; 
          node.innerHTML =  userPlaylistTemplate(response)
          userPlaylistPlaceholder.appendChild(node);
          user_pl_histo.push(response.tracks.total);
          var trace = getTraces(user_pl_histo);
          Plotly.newPlot(user_hist_div.id, trace, layout=layout);
        }else{
          node.innerHTML =  nuserPlaylistTemplate(response)
          nuserPlaylistPlaceholder.appendChild(node);
          nuser_pl_histo.push(response.tracks.total);
          var trace = getTraces(nuser_pl_histo);
          Plotly.newPlot(nuser_hist_div.id, trace, layout=layout);
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
  startup()
}
