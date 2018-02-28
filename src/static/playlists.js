//
// class PlaylistInfo {
//
//   this.playlists = NULL;
//
//   constructor(playlists){
//     this.playlists = playlists;
//   }
// }
//
// class Playlist {
//
//   this.name = NULL;
//   this.size = NULL;
//   this.songs = NULL;
//
//   constructor(name, size, songs){
//     this.name = name;
//     this.size = size;
//     this.songs = songs;
//   }
// }
//
// class Song {
//
//   this.name = NULL;
//   this.genres = NULL;
//   this.artists = NULL;
//   this.album = NULL;
//   this.length = NULL;
//   this.popularity = NULL;
//   this.audio_features = NULL;
//   this.audio_analysis = NULL;
//
//   constructor(name, artists, album, length, popularity){
//     this.name = name;
//     this.artists = artists;
//     this.album = album;
//     this.length = length;
//     this.popularity = popularity;
//   }
//
//   addGenres(genres){
//       this.genres = genres;
//     }
//
//   addAudioFeatures(features){
//     this.audio_features = features;
//   }
//
//   addAudioAnalysis(analysis){
//     this.audio_analysis = analysis;
//   }
//
//
// }


class Playlist {

  constructor(playlist_data) {
    this.collaborative = playlist_data['collaborative']
    this.id = playlist_data['id']
    this.images = playlist_data['images']
    this.name = playlist_data['name']
    this.owner = playlist_data['owner']['id']
    this.public = playlist_data['public']
    this.length = playlist_data['tracks']['total']
    this.tracks = []
    this.get_songs()
  }

  get_data() {
    var data = {
              "collaborative": this.collaborative,
              "id": this.id,
              "images": this.images,
              "name": this.name,
              "owner": this.owner,
              "public": this.public,
              "length": this.length,
    }
    return data
  }

  add_track(track){
    this.tracks.push(track)

  }

  get_songs(){
    get_playlist_tracks(acc_header, 0, this)
  }

}



class Track {

  constructor(track_data) {
    this.album = track_data['album']
    this.artists = track_data['artists']
    this.duration = track_data['duration']
    this.id = track_data['id']
    this.name = track_data['name']
    this.popularity = track_data['popularity']
  }
}








// Get access data
var access_token = document.getElementById("app").getAttribute("access_token")
var refresh_token = document.getElementById("app").getAttribute("refresh_token")
acc_header = "Bearer " + access_token





var playlists = [];
var total_playlists;
playlist_timer = setInterval(print, 100);




var myVar = setTimeout(myTimer, 20000);

function myTimer() {
    playlists = playlists.sort(compare_playlists)
    console.log(playlists)
}


function compare_playlists(a,b) {
  a = a.get_data()

  b = b.get_data()

  return (b["length"] - a["length"])
}

function print(){
  if (total_playlists != null && playlists.length == total_playlists){
    clearInterval(playlist_timer)
    console.log("Finished with " + (playlists.length) + " playlists.")
  }
}

get_playlists_data(acc_header, 0)

// Retrieves user data using GET request
function get_playlists_data(acc_header, offset) {
  $.ajax({
    type : "GET",
    url : "https://api.spotify.com/v1/me/playlists?limit=50&offset="+offset.toString(),
    beforeSend: function(xhr){
      xhr.setRequestHeader('Authorization', acc_header);
    },
    success : function(result) {
      total_playlists=result['total']

      // If another page, get this data
      if (result['next'] != null){
        get_playlists_data(acc_header, result['offset']+50)
      }

      for (pl in result['items']){
        pl = result['items'][pl]
        pl_obj = new Playlist(pl)
        playlists.push(pl_obj)


      }
    },
    error : function(result) {
    }
  });
}

// Retrieves tracks on a single playlist
function get_playlist_tracks(acc_header, offset, playlist) {

  data = playlist.get_data()

  $.ajax({
    type : "GET",
    url : "https://api.spotify.com/v1/users/" + data['owner'] + "/playlists/"+ data['id'] + "/tracks?limit=50&offset=" + offset.toString(),
    beforeSend: function(xhr){
      xhr.setRequestHeader('Authorization', acc_header);
    },
    success : function(result) {

      // If another page, get this data
      if (result['next'] != null){
        get_playlist_tracks(acc_header, result['offset']+50, playlist)
      }

      for (tr in result['items']){
        tr = result['items'][tr]
        tr_obj = new Track(tr['track'])
        playlist.add_track(tr_obj)
      }
    },
    error : function(result) {
      get_playlist_tracks(acc_header, offset, playlist)
    }
  });
}



// Gets a list of songs in that playlist
function get_songs(){

}

// Gets information on a song
function get_info(){

}




// Get list of playlists

// For each playlist

  // Get list of songs

  // For each song

    // Get basic data
    // Get genres
    // Get audio_features
    // Get audio_features
