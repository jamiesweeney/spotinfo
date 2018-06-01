var params = getHashParams();
var access_token = params.access_token
var user_id;

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
var favSongPlaceholder = document.getElementById('fav-songs-table');



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
var favArtistPlaceholder = document.getElementById('fav-artist-table');


var footer_div = document.getElementsByClassName("footer")[0]

function getFavourites(url, time, type){
  $.ajax({
      url: url,
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      success: function(response) {
        console.log(response)
        if (response.next != null){
          getTracks(response.next, time, type);
        }

        for (var item in response.items){
          data = response.items[item];
          if (type == "songs"){
            insertTracks(data, time, Number(item)+1)
          }else{
            insertArtists(data, time, Number(item)+1)
          }
        }
      },
      error: function(response){
        if (response.status == 429){
          setTimeout ( function(){ getFavourites(url, time, type) }, 5000 );
        }

      }
  });
}


function insertTracks(data, time, rank){
  $.ajax({
      url: data.href,
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      success: function(response) {
        response.rank = rank
        var node = document.createElement("tr");
        node.innerHTML =  favSongTemplate(response)

        tableId = 'fav-'+time+'-songs-table'
        document.getElementById(tableId).appendChild(node);
      },
      error: function(response){
        if (response.status == 429){
          setTimeout ( function(){ insertTracks( data, time, rank ) }, 5000 );

        }
      }
  });
}

function insertArtists(data, time, rank){
  $.ajax({
      url: data.href,
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      success: function(response) {
        response.rank = rank
        var node = document.createElement("tr");
        node.innerHTML =  favArtistTemplate(response)

        tableId = 'fav-'+time+'-artists-table'
        document.getElementById(tableId).appendChild(node);
      },
      error: function(response){
        if (response.status == 429){
          setTimeout ( function(){ insertArtists( data, time, rank ) }, 5000 );

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
        getFavourites('https://api.spotify.com/v1/me/top/tracks?limit=50&offset=0&time_range=short_term', "short", "songs")
        getFavourites('https://api.spotify.com/v1/me/top/tracks?limit=50&offset=0&time_range=medium_term', "medium", "songs")
        getFavourites('https://api.spotify.com/v1/me/top/tracks?limit=50&offset=0&time_range=long_term', "long", "songs")
        getFavourites('https://api.spotify.com/v1/me/top/artists?limit=50&offset=0&time_range=short_term', "short", "artists")
        getFavourites('https://api.spotify.com/v1/me/top/artists?limit=50&offset=0&time_range=medium_term', "medium", "artists")
        getFavourites('https://api.spotify.com/v1/me/top/artists?limit=50&offset=0&time_range=long_term', "long", "artists")
      },
      error: function(response){
        if (response.status == 429){
          setTimeout ( function(){ startup() }, 5000 );
        }
      }
  });
}





function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length;   i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}



if (!checkAuthentication()) {
  window.location = LOGIN_URI;
}else{
  startup()
}