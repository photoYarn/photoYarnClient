'use strict';
// include styles
require('../css');

// import Famo.us dependencies
var Engine = require('famous/core/Engine');

// import layout
var CustomLayout = require('./customComponents/CustomLayout');

// import serverRequests to passed down to each view
var serverRequests = require('./services/serverRequests');

var oauth = require('./customComponents/oauth');

//enable this eventListener and disable the serverRequests.getData call below for on device use
document.addEventListener('deviceready', function() {
  console.log('device ready!');
  var runningInCordova = true;
  oauth.login(function(response) {
    if (response.status === 'connected') {
        console.log('fb login success, received access token');
        // check against database to see if new user
        // or current user by sending request to
        serverRequests.loginToFacebook(response);
    } else {
        console.log('login failed', response.error);
        serverRequests.getData();
    }
  });      
}, false);



// create display context
var mainContext = Engine.createContext();

// create Layout
var layout = new CustomLayout({
  headerSize: 75,
  footerSize: 50,
  serverRequests: serverRequests
});

// attach layout to display context
mainContext.add(layout);

// //Enable below get method to enable on computer testing
// serverRequests.getData();