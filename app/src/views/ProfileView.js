'use strict';
//import famo.us dependencies
var View = require('famous/core/View');
var Surface = require('famous/core/Surface');
var Modifier = require('famous/core/Modifier');
var ImageSurface = require('famous/surfaces/ImageSurface');

//import serverRequests
var serverRequests = require('../services/serverRequests');

function ProfileView(userId){
  View.apply(this, arguments);
  var userData = serverRequests.getUserDataFromServer(userId);

  _createBackground.call(this);
  _createProfileHeader.call(this, userData);
  
<<<<<<< HEAD
  
  _createStats.call(this, userData);
  
=======
>>>>>>> feat/lazyLoad
}

ProfileView.prototype = Object.create(View.prototype);
ProfileView.prototype.constructor = ProfileView;
ProfileView.DEFAULT_OPTIONS = {
  profilePicSize: [75, 75]
  
};

function _createBackground() {
  // this.add(bgModifier).add(background);
}

function _createProfileHeader(userData) {
  // profile pic
  var profilePic = new ImageSurface({
    size: [this.options.profilePicSize[0], this.options.profilePicSize[1]],
    content: userData.profilePicUrl,
    classes: ['ProfilePic']
  });
  
  var profilePicModifier = new Modifier({
    align: [0,0],
    origin: [0,0],
    properties: {
      borderRadius: '10px'
    }
  });
  
  this.add(profilePicModifier).add(profilePic);
  
  // username
  var username = new Surface({
    size: [window.innerWidth - this.options.profilePicSize[0], this.options.profilePicSize[1] / 4],
    content: userData.username,
    classes: ['ProfileUsername', 'primaryTextColor'],
  });
  
  var usernameModifier = new Modifier({
    align: [1, 0],
    origin: [1, 0]
  });
  
  this.add(usernameModifier).add(username);
  
  // user location
  var userLocation = new Surface({
    size: [window.innerWidth - this.options.profilePicSize[0], this.options.profilePicSize[1] / 4],
    content: userData.userLocation,
    classes: ['ProfileUserLocation'],
  });
  
  var userLocationModifier = new Modifier({
    align: [1, 0],
    origin: [1, -1]
  });
  
  
  this.add(userLocationModifier).add(userLocation);
  
  // followers, following, likes button panel
  var followersButton = new Surface({
    size: [(window.innerWidth - this.options.profilePicSize[0]) / 3, this.options.profilePicSize[1] / 2],
    content: userData.numFollowers + ' Followers',
    classes: ['ProfileHeaderButton', 'secondaryBGColor', 'whiteTextColor'],
    properties: {
      textAlign: 'center'
    }
  });
  
  var followersButtonModifier = new Modifier({
    align: [1, 0],
    origin: [3, -1]
  });
  
  this.add(followersButtonModifier).add(followersButton);
  
  var followingButton = new Surface({
    size: [(window.innerWidth - this.options.profilePicSize[0]) / 3, this.options.profilePicSize[1] / 2],
    content: userData.numFollowing + ' Following',
    classes: ['ProfileHeaderButton', 'secondaryBGColor', 'whiteTextColor'],
    properties: {
      textAlign: 'center'
    }
  });
  
  var followingButtonModifier = new Modifier({
    align: [1, 0],
    origin: [2, -1]
  });
  
  this.add(followingButtonModifier).add(followingButton);
  
  var likesButton = new Surface({
    size: [(window.innerWidth - this.options.profilePicSize[0]) / 3, this.options.profilePicSize[1] / 2],
    content: userData.likes + ' Likes',
    classes: ['ProfileHeaderButton', 'secondaryBGColor', 'whiteTextColor'],
    properties: {
      textAlign: 'center'
    }
  });
  
  var likesButtonModifier = new Modifier({
    align: [1, 0],
    origin: [1, -1]
  });
  
  this.add(likesButtonModifier).add(likesButton);
}

function _createStats(userData) {
  // Photos added
  var photosAdded = new Surface({
    size: [, 100],
    content: 'Photos added: ' + userData.photosAdded,
    classes: ['ProfileStat']
  });
  
  var photosAddedModifier = new Modifier({
    align: [0.5, 0.4],
    origin: [0.5, 0.5],
    properties: {
      lineHeight: 100 + 'px'
		}
  });
  
  this.add(photosAddedModifier).add(photosAdded);
  
  // Feeds started
  var feedsStarted = new Surface({
    size: [, 100],
    content: 'Feeds started: ' + userData.feeds.length,
    classes: ['ProfileStat']
  });
  
  var feedsStartedModifier = new Modifier({
    align: [0.5, 0.6],
    origin: [0.5, 0.5],
    properties: {
      lineHeight: 100 + 'px'
		}
  });
  
  this.add(feedsStartedModifier).add(feedsStarted);
  
  // Number of friends
  var numFriends = new Surface({
    size: [, 100],
    content: 'Number of friends: ' + userData.friends.length,
    classes: ['ProfileStat']
  });
  
  var numFriendsModifier = new Modifier({
    align: [0.5, 0.8],
    origin: [0.5, 0.5],
    properties: {
      lineHeight: 100 + 'px'
		}
  });
  
  this.add(numFriendsModifier).add(numFriends);

}

module.exports = ProfileView;
