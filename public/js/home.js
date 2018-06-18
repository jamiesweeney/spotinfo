/**
* Jamie Sweeney
* June 2018
* home.js - Provides the  js logic for the home page
*         - Checks authentication, redirects to login if not authenticated
**/


// HTML template objects
var userProfileSource =
`
<h2>{{display_name}}</h2>
<div class="media">
  <div class="media-body">
    <div>
      <img class="media-object" width="150" src="{{images.0.url}}" />
    </div>
    <table class="user-profile-table">
      <tr>
        <td>Display name</td>
        <td>{{display_name}}</td>
      </tr>
      <tr>
        <td>ID</td>
        <td>{{id}}</td>
      </tr>
      <tr>
        <td>BOD</td>
        <td>{{birthdate}}</td>
      </tr>
      <tr>
        <td>Email</td>
        <td>{{email}}</td>
      </tr>
      <tr>
        <td>Followers</td>
        <td>{{followers.total}}</td>
      </tr>
      <tr>
        <td>Product</td>
        <td>{{product}}</td>
      </tr>
      <tr>
        <td>Spotify URI</td>
        <td><a href="{{external_urls.spotify}}">{{external_urls.spotify}}</a></td>
      </tr>
      <tr>
        <td>Link</td>
        <td><a href="{{href}}">{{href}}</a></td>
      </tr>
      <tr>
        <td>Country</td>
        <td>{{country}}</td>
      </tr>
    <table>
  </div>
</div>
`;
var userProfileTemplate = Handlebars.compile(userProfileSource);


// DOM elements
var userProfilePlaceholder = document.getElementById('user-profile');


// Get url paramters (if any)
var params = getHashParams();
var access_token = params.access_token

// Get user data
userData = getUserData(access_token)
if (userData){
  // Insert into profile template
  userProfilePlaceholder.innerHTML = userProfileTemplate(userData);
}else{
  userProfilePlaceholder.innerHTML = "<h2>You are not currently logged in.</h2>"
}
