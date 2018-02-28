#-- Imports --#
import json
from flask import Flask, request, redirect, g, render_template, url_for
import requests
import base64
import urllib
import urllib.parse

#-- Global vars --#
app = Flask(__name__)

<<<<<<< HEAD
CLIENT_ID = "f73f551e914f4915a7c38d75fa074cfb"
CLIENT_SECRET = "de1227a6f8144ed1a0094f3eb8878e34"
=======
#  Client Keys
CLIENT_ID = ""
CLIENT_SECRET = ""
>>>>>>> 45fa8ffaa3d220d5c448c27e2c3cf7e4b9c42e35

SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize"
SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
SPOTIFY_API_BASE_URL = "https://api.spotify.com"
API_VERSION = "v1"
SPOTIFY_API_URL = "{}/{}".format(SPOTIFY_API_BASE_URL, API_VERSION)

# Server-side Parameters
CLIENT_SIDE_URL = "http://127.0.0.1"
PORT = 8080
REDIRECT_URI = "{}:{}/callback".format(CLIENT_SIDE_URL, PORT)
SCOPE = "playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private ugc-image-upload user-follow-modify user-follow-read user-library-read user-library-modify user-read-private user-read-birthdate user-read-email user-top-read user-read-playback-state user-modify-playback-state user-read-currently-playing user-read-recently-played"
STATE = ""
SHOW_DIALOG_bool = True
SHOW_DIALOG_str = str(SHOW_DIALOG_bool).lower()

auth_query_parameters = {
    "response_type": "code",
    "redirect_uri": REDIRECT_URI,
    "scope": SCOPE,
    # "state": STATE,
    # "show_dialog": SHOW_DIALOG_str,
    "client_id": CLIENT_ID
}


#-- REST Endpoints --#

#-- Index request, authenticates user through spotify --#
@app.route("/")
def index():
    # Authorization, redirects to callback if sucessful
    url_args = "&".join(["{}={}".format(key,urllib.parse.quote(val)) for key,val in auth_query_parameters.items()])
    auth_url = "{}/?{}".format(SPOTIFY_AUTH_URL, url_args)
    return redirect(auth_url)


#-- Callback request, checks user authentication and retrieves access token, then redirects to home page --#
@app.route("/callback")
def callback():

    # Attempt to get access tokens
    auth_data = authenticate_access(request.args['code'])

    # If authenticated, redirect to home_page
    if (auth_data != None):
        return redirect(url_for("home",
                                    access_token=auth_data['access_token'],
                                    refresh_token=auth_data['refresh_token'],
                                 ))

    # If not, redirect to index to try again
    return redirect("/")


#-- Home page requests, returns the home page --#
@app.route("/home")
def home():

    # Return home page with necessary access data
    if (('access_token' in request.args) and ('refresh_token' in request.args)):
        return render_template("base.html",
                                access_token=request.args['access_token'],
                                refresh_token=request.args['refresh_token'],
                                )

    # If no access data, redirect to index to try again
    return redirect("/")


#-- Home page requests, returns the home page --#
@app.route("/playlists")
def playlists():
    print ("*************************************")
    print (request.args)
    print ("*************************************")

    # Return playlists page with necessary access data
    if (('access_token' in request.args) and ('refresh_token' in request.args)):
        return render_template("playlists.html",
                                access_token=request.args['access_token'],
                                refresh_token=request.args['refresh_token'],
                                )

    # If no access data, redirect to index to try again
    return redirect("/")





#-- Helper Functions --#

#-- Retrieves access token from spotify  using authorization code --#
def authenticate_access(code):
    # Requests refresh and access tokens
    auth_token = code
    code_payload = {
        "grant_type": "authorization_code",
        "code": str(auth_token),
        "redirect_uri": REDIRECT_URI
    }
    base64encoded = base64.urlsafe_b64encode("{}:{}".format(CLIENT_ID, CLIENT_SECRET).encode('UTF-8')).decode('ascii')
    headers = {"Authorization": "Basic {}".format(base64encoded)}
    post_request = requests.post(SPOTIFY_TOKEN_URL, data=code_payload, headers=headers)

    # Redirect to index if unauthorized request
    print (post_request.status_code)
    if (post_request.status_code != 200):
        return None

    # Auth Step 5: Tokens are Returned to Application
    response_data = json.loads(post_request.text)
    return response_data


















### - Bad code ahead
#
#     # Auth Step 6: Use the access token to access Spotify API
#     authorization_header = {"Authorization":"Bearer {}".format(access_token)}
#
#     # Get profile data
#     user_profile_api_endpoint = "{}/me".format(SPOTIFY_API_URL)
#     profile_response = requests.get(user_profile_api_endpoint, headers=authorization_header)
#     profile_data = json.loads(profile_response.text)
#
#     fields = ['birthdate', 'country', 'email', 'followers', 'id', 'images', 'product']
#
#     data_dict = {}
#     for field in fields:
#         data_dict[field] = profile_data[field]
#
#     # Get user playlist data
#     playlist_items = []
#     playlist_api_endpoint = "{}/playlists?limit=50".format(profile_data["href"])
#     playlists_response = requests.get(playlist_api_endpoint, headers=authorization_header)
#     playlist_data = json.loads(playlists_response.text)
#     playlist_items += playlist_data['items']
#
#     while (playlist_data['next'] != None):
#         playlist_api_endpoint = "{}/playlists?limit=50&offset={}".format(profile_data["href"], str(int(playlist_data['offset'])+int(playlist_data['limit'])))
#         playlists_response = requests.get(playlist_api_endpoint, headers=authorization_header)
#         playlist_data = json.loads(playlists_response.text)
#         playlist_items += playlist_data['items']
#
#     user_playlists = []
#     user_playlist_total = 0
#     follow_playlists = []
#     follow_playlist_total = 0
#     max_size = 0
#     for playlist in playlist_items:
#         max_size = max(playlist['tracks']['total'], max_size)
#         if (playlist['owner']['id'] == profile_data['id']):
#             user_playlists += [playlist]
#             user_playlist_total += playlist['tracks']['total']
#         else:
#             follow_playlists += [playlist]
#             follow_playlist_total += playlist['tracks']['total']
#
#     data_dict['user_playlists'] = user_playlists
#     data_dict['user_playlists_len'] = len(user_playlists)
#     data_dict['user_playlist_total'] = user_playlist_total
#     data_dict['user_playlist_top'] = get_most_followed(user_playlists, authorization_header)
#     data_dict['follow_playlists'] = follow_playlists
#     data_dict['follow_playlists_len'] = len(follow_playlists)
#     data_dict['follow_playlist_total'] = follow_playlist_total
#     data_dict['max_size'] = max_size
#     return render_template("index.html",sorted_array=data_dict)
#
#
#
#
#
#
# def get_most_followed(playlists, authorization_header):
#     for playlist in playlists:
#         endpoint = "{}".format(playlist["href"])
#         response = requests.get(endpoint, headers=authorization_header)
#         data = json.loads(response.text)
#


if __name__ == "__main__":
    app.run(debug=True,port=PORT)
