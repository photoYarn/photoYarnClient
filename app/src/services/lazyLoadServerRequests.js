'use strict';
var $ = require('jquery');
var serverRequests = {};

var EventEmitter = require('famous/core/EventEmitter');

serverRequests.emitter = new EventEmitter();
serverRequests.loademitter = new EventEmitter();


//serverRequests.data stores yarn data from server
serverRequests.data = [];

/*
serverRequests.cache is a hash with keys that correspond to _id of each yarn and values that
correspond to the index those yarns are stored in the serverRequests.data array.
*/
serverRequests.cache = {};
serverRequests.user = {};

/*
getData fetches data from server and stores it in data array
Stores strings of _id in cache 
*/

serverRequests.getData = function(callback, feedInstance){
  var getURL = 'http://photoyarn.azurewebsites.net/getAllYarns/' + ;
  if (feedInstance) feedInstance.loadingPictures = true;
  $.ajax({
    type: 'GET',
    url: getURL,
    data: {
      yarnsLoaded: serverRequests.data.length,
      numYarns: 8
    },
    success: function (data) {
      console.log(data);
      for(var i = 0; i < data.length; i++){
        var cur = data[i];
        var id = data[i]._id;
        this.cache[id] = this.data.length;
        this.data.push(cur);
      }
      if (callback) {
        if (data.length === 0) feedInstance.doneLoading = true;
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
serverRequests.updateData = function(){
  var getURL = 'http://photoyarn.azurewebsites.net/getYarnsBrowser';

  console.log('Updating Data');
  $.ajax({
    type: 'GET',
    url: getURL,
    success: function (data) {
      for(var i = 0; i < data.length; i++){
        var cur = data[i];
        var id = data[i]._id;
        if(this.cache[id] === undefined){
          console.log('New Entry Found: ', cur);
          this.cache[id] = this.data.length;
          this.data.push(cur);
        } else if(this.data[this.cache[id]].links.length !== cur.links.length){
          console.log('Updated An Entry: ', cur);
          this.data.splice([this.cache[id]],1, cur);
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
serverRequests.postToImgur = function(data, route){
  serverRequests.emitter.emit('Loading');
  var serverData = {};
  serverData.caption = data.caption;
  //serverData.creatorId is hard coded currently, as we do not have users implemented yet!
  serverData.creatorId = serverRequests.user.id;
  // console.log('server creator', serverData.creatorId)
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
      if(route === 'add'){
        serverRequests.postPhotoToServerYarn(serverData);
      }else if(route === 'new'){
        serverRequests.postYarnToServer(serverData);
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
serverRequests.postYarnToServer = function(data){
  $.ajax({
    type: 'POST',
    url: 'http://photoyarn.azurewebsites.net/createNewYarn',
    data: {
      imgurId: data.imgurId,
      link: data.link,
      caption: data.caption,
      creatorId: data.creatorId
    },
    success: function(res){
      console.log('Post to Server Success: ', res);
      serverRequests.updateData();
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
serverRequests.postPhotoToServerYarn = function(data){
  console.log('posting Photo to Yarn', data);
  $.ajax({
    type: 'POST',
    url: 'http://photoyarn.azurewebsites.net/addToYarn',
    data: {
      yarnId: data.yarnId,
      link: data.link,
      creatorId: data.creatorId
    },
    success: function(res){
      console.log('Post to Server Success: ', res);
      serverRequests.updateData();
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
  $.ajax({
      type: "GET",
      url: "https://graph.facebook.com/me?access_token=" + response.token,
      success: function(data) {
          var userData = {
              id: data.id,
              // gender: data.gender.charAt(0) // do we need this?,
              name: data.name,
              token: response.token
          };
          serverRequests.user = userData;
          console.log(userData);
          // request to /users
          $.ajax({
              type: 'POST',
              url: 'http://photoyarn.azurewebsites.net/users',
              data: userData,
              success: function(data) {
                  console.log(data);
                  if (data.serverToken) {
                    window.localStorage.setItem('serverToken', data.serverToken);
                  }
                  serverRequests.getData();
              },
              error: function(error) {
                  console.log(error);
              }
          });
      }
  });
};

serverRequests.getUserDataFromServer = function(userId){
  // $.ajax({
  //   type: 'GET',
  //   url: 'http://photoyarn.azurewebsites.net/user/' + userId,
  //   success: function(res){
  //     console.log('Post to Server Success!', res);
  //        return res;
  //   },
  //   error: function(error, res){
  //     console.log('Get user data from server error', error, res);
  //   }
  // });
  
  // for now I'm returning data before we set up the db to actually handle
  //  the real GET request commented out above - Kyle
  return {
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
};

module.exports = serverRequests;
