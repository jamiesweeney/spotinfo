
var user_image = document.getElementById("user_image");
var user_name = document.getElementById("user_name");
var user_email = document.getElementById("user_email");
var home_btn = document.getElementById("home_btn");

// Get access data
var access_token = document.getElementById("app").getAttribute("access_token")
var refresh_token = document.getElementById("app").getAttribute("refresh_token")
acc_header = "Bearer " + access_token

//apply_access_data(acc_data)
get_user_data(acc_header)


// Retrieves user data using GET request
function get_user_data(token) {
  $.ajax({
    type : "GET",
    url : "https://api.spotify.com/v1/me",
    beforeSend: function(xhr){xhr.setRequestHeader('Authorization', acc_header);},
    success : function(result) {
      apply_user_data(result)
    },
    error : function(result) {
    }
  });
}

// Applies user data from GET request to HTML document
function apply_user_data(data){
  console.log(data)
  user_name.innerHTML =  data['id']
  user_email.innerHTML = data['email']

}

console.log(home_btn.formaction)
home_btn.formaction = "http://www.google.com"
console.log(home_btn.formaction)
