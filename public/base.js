var params = getHashParams();
var access_token = params.access_token

var profileImageSource =
`
<div class="pull-left">

  <a href={{external_urls.spotify}}><img width="80" height=80 src="{{images.0.url}}"/></a>
</div>
<a href={{external_urls.spotify}}>{{display_name}}</a>
`;


var profileImageTemplate = Handlebars.compile(profileImageSource);
var profileImagePlaceholder = document.getElementById('profile-image');

var headerLogo = document.getElementById('header-btn-logo');
var headerLogx = document.getElementById('header-btn-logx');
var headerHome = document.getElementById('header-btn-home');
var headerPlaylists = document.getElementById('header-btn-playlists');


if (!checkAuthentication()) {

}else{
  $.ajax({
      url: 'https://api.spotify.com/v1/me',
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      success: function(response) {
        if (response.display_name == null){
          response.display_name = response.id
        }
        profileImagePlaceholder.innerHTML = profileImageTemplate(response);

        headerLogx.innerHTML = "Logout"
        headerLogx.href = "/logout"

        headerHome.href = "/home#" + paramsToURI(getHashParams())

        headerPlaylists.href = "/playlists#" + paramsToURI(getHashParams())
        headerPlaylists.style.visibility = "visible"



        console.log(headerPlaylists)


      },
      async: true
  });
}
