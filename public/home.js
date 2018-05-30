var params = getHashParams();
var access_token = params.access_token

var userProfileSource =
`
<div class="media">
  <div class="pull-left">
    <img class="media-object" width="150" src="{{images.0.url}}" />
  </div>
  <div class="media-body">
    <dl class="dl-horizontal">
      <dt>Display name</dt><dd class="clearfix">{{display_name}}</dd>
      <dt>ID</dt><dd>{{id}}</dd>
      <dt>BOD</dt><dd>{{birthdate}}</dd>
      <dt>Email</dt><dd>{{email}}</dd>
      <dt>Followers</dt><dd>{{followers.total}}</dd>
      <dt>Product</dt><dd>{{product}}</dd>
      <dt>Spotify URI</dt><dd><a href="{{external_urls.spotify}}">{{external_urls.spotify}}</a></dd>
      <dt>Link</dt><dd><a href="{{href}}">{{href}}</a></dd>
      <dt>Profile Image</dt><dd class="clearfix"><a href="{{images.0.url}}">{{images.0.url}}</a></dd>
      <dt>Country</dt><dd>{{country}}</dd>
    </dl>
  </div>
</div>
`;


var userProfileTemplate = Handlebars.compile(userProfileSource);
var userProfilePlaceholder = document.getElementById('user-profile');

if (!checkAuthentication()) {
  window.location = LOGIN_URI;
}else{
  $.ajax({
      url: 'https://api.spotify.com/v1/me',
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      success: function(response) {
        console.log(response)
        if (response.display_name == null){
          response.display_name = response.id
        }
        userProfilePlaceholder.innerHTML = userProfileTemplate(response);
      },
      async: true
  });
}
