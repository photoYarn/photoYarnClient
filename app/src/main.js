'use strict';

// include styles
require('../css');

// import Famo.us dependencies
var Engine = require('famous/core/Engine');

// import layout
var CustomLayout = require('./customComponents/CustomLayout');

// import serverRequests to passed down to each view
var serverRequests = require('./services/serverRequests');

//client side oauth with facebook. 
var oauth = require('./customComponents/oauth');

/*
Uncomment this eventListener and disable the serverRequests.getData call below for on device use
Logs in w/ oauth through facebook
*/
document.addEventListener('deviceready', function() {
  console.log('device ready!');
  var runningInCordova = true;
  console.log('serverToken', window.localStorage.getItem('serverToken'));
  console.log('facebookName', window.localStorage.getItem('facebookName'));
  console.log('facebookId', window.localStorage.getItem('facebookId'));
  if(!window.localStorage.getItem('serverToken')){
    console.log('not logged in, so im logging in dude')
    oauth.login(function(response) {
      if (response.status === 'connected') {
        console.log('fb login success, received access token');
        // check against database to see if new user
        // or current user by sending request to
        serverRequests.loginToFacebook(response);
      } else {
        console.log('login failed', response.error);
        // why get data if login failed?
        // serverRequests.getData();
      }
    });          
  } else {
    console.log('already logged in')
    // serverRequests.user.id = window.localStorage.getItem('facebookId');
    // serverRequests.user.name = window.localStorage.getItem('facebookName');
    serverRequests.getData();
  }
}, false);

// create display context
var mainContext = Engine.createContext();

/*
create Layout that includes all custom components. Pass serverRequests objects to child components
*/
var layout = new CustomLayout({
  headerSize: 75,
  footerSize: 50,	
  serverRequests: serverRequests
});

// attach layout to display context
mainContext.add(layout);

// Uncomment below get method to enable on computer testing
// serverRequests.getData();
