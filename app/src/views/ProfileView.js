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

  _createBackground.call(this);
  _createProfileHeader.call(this);
  _createStats.call(this);
}

ProfileView.prototype = Object.create(View.prototype);
ProfileView.prototype.constructor = ProfileView;
ProfileView.DEFAULT_OPTIONS = {
  profilePicSize: [75, 75]
  
};

ProfileView.prototype.update = function(){
  console.log('PROFILE VIEW UPDATING!');
  console.log(serverRequests.profileData);
  this.username.setContent(serverRequests.profileData.username);
  this.userLocation.setContent(serverRequests.profileData.userLocation);
  this.followersButton.setContent('Followers: ' + serverRequests.profileData.numFollowers);
  this.followingButton.setContent('Following: ' + serverRequests.profileData.numFollowing);
  this.feedsStarted.setContent('Feeds Started: ' + serverRequests.profileData.feeds);
};

function _createBackground() {
  // this.add(bgModifier).add(background);
}

function _createProfileHeader() {
  // profile pic
  var profilePic = new ImageSurface({
    size: [this.options.profilePicSize[0], this.options.profilePicSize[1]],
    content: serverRequests.profileData.profilePicUrl,
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
  this.username = new Surface({
    size: [window.innerWidth - this.options.profilePicSize[0], this.options.profilePicSize[1] / 4],
    content: serverRequests.profileData.username,
    classes: ['ProfileUsername', 'primaryTextColor'],
  });
  
  var usernameModifier = new Modifier({
    align: [1, 0],
    origin: [1, 0]
  });
  
  this.add(usernameModifier).add(this.username);
  
  // user location
  this.userLocation = new Surface({
    size: [window.innerWidth - this.options.profilePicSize[0], this.options.profilePicSize[1] / 4],
    content: serverRequests.profileData.userLocation,
    classes: ['ProfileUserLocation'],
  });
  
  var userLocationModifier = new Modifier({
    align: [1, 0],
    origin: [1, -1]
  });
  
  
  this.add(userLocationModifier).add(this.userLocation);
  
  // followers, following, likes button panel
  this.followersButton = new Surface({
    size: [(window.innerWidth - this.options.profilePicSize[0]) / 3, this.options.profilePicSize[1] / 2],
    content: serverRequests.profileData.numFollowers + ' Followers',
    classes: ['ProfileHeaderButton', 'secondaryBGColor', 'whiteTextColor'],
    properties: {
      textAlign: 'center'
    }
  });
  
  var followersButtonModifier = new Modifier({
    align: [1, 0],
    origin: [3, -1]
  });
  
  this.add(followersButtonModifier).add(this.followersButton);
  
  this.followingButton = new Surface({
    size: [(window.innerWidth - this.options.profilePicSize[0]) / 3, this.options.profilePicSize[1] / 2],
    content: serverRequests.profileData.numFollowing + ' Following',
    classes: ['ProfileHeaderButton', 'secondaryBGColor', 'whiteTextColor'],
    properties: {
      textAlign: 'center'
    }
  });
  
  var followingButtonModifier = new Modifier({
    align: [1, 0],
    origin: [2, -1]
  });
  
  this.add(followingButtonModifier).add(this.followingButton);
  
  var likesButton = new Surface({
    size: [(window.innerWidth - this.options.profilePicSize[0]) / 3, this.options.profilePicSize[1] / 2],
    content: serverRequests.profileData.likes + ' Likes',
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

function _createStats() {
  // Photos added
  var photosAdded = new Surface({
    size: [, 100],
    content: 'Photos added: ' + serverRequests.profileData.photosAdded,
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
  this.feedsStarted = new Surface({
    size: [, 100],
    content: 'Feeds started: ' + serverRequests.profileData.feeds.length,
    classes: ['ProfileStat']
  });
  
  var feedsStartedModifier = new Modifier({
    align: [0.5, 0.6],
    origin: [0.5, 0.5],
    properties: {
      lineHeight: 100 + 'px'
    }
  });
  
  this.add(feedsStartedModifier).add(this.feedsStarted);
  
  // Number of friends
  var numFriends = new Surface({
    size: [, 100],
    content: 'Number of friends: ' + serverRequests.profileData.friends.length,
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
