# spotinfo
A simple node.js application for analysis of Spotify user accounts library and listening habits.


## Installation

### Install git
https://git-scm.com/

### Clone the repository.

`git clone https://github.com/jamiesweeney/spotinfo.git`

`cd spotinfo`

### Install node.js
https://nodejs.org/en/download/


### Install dependencies

`npm install npm-install-all -g`

`npm-install-all`


## How to use spotinfo
Run with

`node app.js`

The spotinfo service should now be available from "http:localhost:8080/"

* "/login" - to perform authentication with Spotify
* "/home" - home page
* "/favourites" - see favourite songs and artists
* "/playlists" - see playlist data
* "/logout" - to log back out (removes url params)


## Known Issues
* Sometimes user will need to reauthenticate when moving between pages
* Favourites page requires a lot of processing when building / simulating network graph and slows down
* Favourites network graph is unpredictable / unstable


## Dependencies
* express 4.16.3
* nunjucks 3.1.3
* vis 4.21.0
