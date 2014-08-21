'use strict';
var $ = require('jquery');
var serverRequests = {};

var EventEmitter = require('famous/core/EventEmitter');

serverRequests.emitter = new EventEmitter();
serverRequests.loademitter = new EventEmitter();


//serverRequests.data stores yarn data from server
serverRequests.data = [];

serverRequests.profileData = {
    profilePicUrl: 'assets/catTied.png',
    username: 'exampleUserName',
    userLocation: 'San Francisco',
    numFollowers: 12,
    numFollowing: 33,
    feeds: [1,2,3,4,5,6,7,8,9], 
    friends: ['adam', 'bob', 'carl', 'doug', 'emily'],
    photosAdded: 42,
    likes: 11
};

/*
serverRequests.cache is a hash with keys that correspond to _id of each yarn and values that
correspond to the index those yarns are stored in the serverRequests.data array.
*/
serverRequests.cache = {};
// serverRequests.user = {};
var numYarnsToLoad = 6;

/*
getData fetches data from server and stores it in data array
Stores strings of _id in cache 
*/

serverRequests.getData = function(callback, feedInstance){
  var getURL;
  if (feedInstance) {
    feedInstance.loadingPictures = true;
    serverRequests.feedInstance = feedInstance;
  }
  if (window.localStorage.getItem('facebookId')) {
    console.log('Getting your pictures!');
    getURL = 'http://photoyarn.azurewebsites.net/getAllYarns';
    console.log(getURL);
  } else {
    console.log('Getting all the pictures!');
    getURL = 'http://photoyarn.azurewebsites.net/getYarnsBrowser';
  }
  $.ajax({
    type: 'GET',
    url: getURL,
    data: {
      yarnsLoaded: serverRequests.data.length,
      numYarns: numYarnsToLoad,
      token: window.localStorage.getItem('serverToken'),
      id: window.localStorage.getItem('facebookId')
    },
    success: function (data) {
      console.log('got ' + data.length + ' yarns from server:', data);

      for (var i = 0; i < data.length; i++) {
        var id = data[i]._id;
        if (this.cache[id] === undefined) {
          this.cache[id] = this.data.length;
          this.data.push(data[i]);
        } else {
          console.log('server served up yarn that has already been cached', data[i]);
          // remove yarn from data array so we don't load duplicates
          data = data.splice(i, 1);
          i--;
        }
      }
      if (callback) {
        if (data.length < numYarnsToLoad) feedInstance.doneLoading = true;
        feedInstance.loadingPictures = false;
        callback.call(feedInstance, data);
      }
    }.bind(this),
    error: function (error) {
      console.log('Get Data Error: ', error);
    }
  });
};

/*
Checks for updated data from server, updates cache and data array if new info found.
Emits a 'Loaded' event when data is loaded.
*/
serverRequests.updateData = function(feedInstance){
  console.log('update data called and feedInstance is ' + feedInstance);

  var getURL;
  if (window.localStorage.getItem('facebookId')) {
    console.log('Getting your pictures!');
    getURL = 'http://photoyarn.azurewebsites.net/getAllYarns';
    console.log(getURL);
  } else {
    console.log('Getting all the pictures!');
    getURL = 'http://photoyarn.azurewebsites.net/getYarnsBrowser';
  }
  console.log('Updating Data');
  $.ajax({
    type: 'GET',
    url: getURL,
    data: {
      yarnsLoaded: 0,
      numYarns: serverRequests.data.length,
      token: window.localStorage.getItem('serverToken'),
      id: window.localStorage.getItem('facebookId')
    },
    success: function (data) {
      console.log('Update data success', data);
      for (var i = 0; i < data.length; i++){
        var cur = data[i];
        var index = data[i]._id;

        if (serverRequests.cache[index] === undefined) {
          console.log('New Entry Found: ', cur);
          serverRequests.cache[index] = serverRequests.data.length;

          // this should be refactored
          serverRequests.data.push(cur);
          // feedInstance.createNewFeedEntry(cur);  
        } else if (serverRequests.data[this.cache[index]].links.length !== cur.links.length) {
          console.log('Updated An Entry: ', cur);

          serverRequests.data.splice(serverRequests.cache[index], 1, cur);
          feedInstance.replaceFeedEntry(serverRequests.cache[index], cur);
        }
      }
      serverRequests.emitter.emit('Loaded');
    }.bind(this),
    error: function (error) {
      console.log('Update Data Error: ', error);
    }
  });
};

/*
Posts images to imgur, and then either adds to a yarn or creates a new yarn.
Requires a data object with a caption, and a ._id which is the yarns unique id.
Requires a b64 string of the image to post to imgur, data.b64image.
Triggers loading event that will show loading screen
*/
serverRequests.postToImgur = function(data, route, feedInstance){
  console.log('in postToImgur feedInstance is ' + feedInstance);

  serverRequests.emitter.emit('Loading');
  var serverData = {};
  serverData.caption = data.caption;
  //serverData.creatorId is hard coded currently, as we do not have users implemented yet!
  serverData.creatorId = window.localStorage.getItem('facebookId');
  console.log('server creator', serverData.creatorId)
  //updated due to success callback
  serverData.link;
  serverData.imgurId;
  serverData.yarnId = data._id;
  console.log(data);
  
 $.ajax({
    type: 'POST',
    url: 'https://api.imgur.com/3/upload',
    headers: {
      Authorization: 'Client-ID ' + 'ef774ae96ae304c',
    },
    data: {
      image: data.b64image,
      //title is not necessary for the purposes of our app. 
      title: data.caption
    },
    success: function (res) {
      console.log('Post to Imgur Success: ', res.data);
      serverData.link = res.data.link;
      serverData.imgurId = res.data.id;
      console.log('Server data', serverData);
      if (route === 'add') {
        serverRequests.postPhotoToServerYarn(serverData, feedInstance);
      } else if (route === 'new') {
        serverRequests.postYarnToServer(serverData, feedInstance);
      }
    },
    error: function (error, res) {
      console.log('Post to Imgur Error: ', error);
      console.log('Post to Imgur Error Response: ', res);
    }
  });
};

/*
Adds a new yarn to the server
On success will invoke the update function
Requires a data object with imgurId, link, caption, and creatorId properties
*/
serverRequests.postYarnToServer = function(data, feedInstance){
  $.ajax({
    type: 'POST',
    url: 'http://photoyarn.azurewebsites.net/createNewYarn?token=' + window.localStorage.getItem('serverToken'),
    data: {
      imgurId: data.imgurId,
      link: data.link,
      caption: data.caption,
      creatorId: data.creatorId
    },
    success: function(res, feedInstance){
      console.log('Post to Server Success: ', res);
      serverRequests.updateData(feedInstance);
    },
    error: function(error, res){
      console.log('Post to Server Error: ', error);
      console.log('Post Error Response: ', res);
    }
  });
};

/*
Adds a photo to a yarn on the server
On success, will invoke the update function
Requires a data object with yarnId and link properties.
*/
serverRequests.postPhotoToServerYarn = function(data, feedInstance){
  console.log('in postPhotoToServerYarn feedInstance is ' + feedInstance);

  console.log('posting Photo to Yarn', data);
  $.ajax({
    type: 'POST',
    url: 'http://photoyarn.azurewebsites.net/addToYarn?token=' + window.localStorage.getItem('serverToken'),
    data: {
      yarnId: data.yarnId,
      link: data.link,
      creatorId: data.creatorId
    },
    success: function(res){
      console.log('Post to Server Success: ', res);
      serverRequests.updateData(feedInstance);
    },
    error: function(error, res){
      console.log('Post to Server Error: ', error);
      console.log('Post to Server Error Response: ', res);
    }
  });
};

/*
Logs in to Facebook, on success will get yarnData from server
*/
serverRequests.loginToFacebook = function(response){
  console.log('response', response);
  $.ajax({
    type: "GET",
    url: "https://graph.facebook.com/me?access_token=" + response.token,
    success: function(data) {
      console.log('graph facebook success!');
      var userData = {
        id: data.id,
        // gender: data.gender.charAt(0) // do we need this?,
        name: data.name,
        token: response.token
      };
      // serverRequests.user = userData;
      console.log(userData);
      // request to /users
      $.ajax({
        type: 'POST',
        url: 'http://photoyarn.azurewebsites.net/users',
        data: userData,
        success: function(data) {
          console.log('data',data);
            // this should all probably be changed to userData.blah instead of data.blah
            // i don't think there is a good reason for server to send back the user
          window.localStorage.setItem('serverToken', data.serverToken);
          window.localStorage.setItem('facebookId', data.user.id);
          window.localStorage.setItem('facebookName', data.user.name);
          serverRequests.getData();
        },
        error: function(error) {
          console.log(error);
        }
      });
    }, 
    error: function(data1, data2){
      console.log('facebook error!');
      console.log('data1', data1);
      console.log('data2', data2);
    }
  });
};

serverRequests.getUserDataFromServer = function(userId){
  $.ajax({
    type: 'GET',
    url: 'http://photoyarn.azurewebsites.net/userInfo',
    data: {
      id: window.localStorage.getItem('facebookId')
    },
    success: function(data){
      serverRequests.profileData.username = data.user.name;
      serverRequests.profileData.numFollowers = serverRequests.profileData.numFollowing = data.user.yarnIds.length;
      serverRequests.profileData.feeds = data.user.yarnIds.length;
      serverRequests.profileData.friends = data.user.friendIds.length;
      console.log(serverRequests.profileData);
    },
    error: function(error, res){
      console.log('Get user data from server error', error, res);
    }
  });
};

module.exports = serverRequests;
