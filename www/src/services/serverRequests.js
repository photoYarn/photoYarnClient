define(function(require, exports, module) {
  'use strict';

  var serverRequests = {};

  //serverRequests.data stores yarn data from server
  serverRequests.data = [];
  
  /*
  serverRequests.cache is a hash with keys that correspond to _id of each yarn and values that
  correspond to the index those yarns are stored in the serverRequests.data array.
  */
  serverRequests.cache = {};



  serverRequests.getData = function(callback){
    $.ajax({
      type: 'GET',
      url: 'http://photoyarn.azurewebsites.net/getAllYarns',
      success: function (data) {
        for(var i = 0; i < data.length; i++){
          var cur = data[i];
          var id = data[i]._id;
          this.cache[id] = this.data.length;
          this.data.push(cur);
        }
        if(callback){
          callback(this.data);
        }
      }.bind(this),
      error: function (error) {
        console.log('Get Data Error: ', error);
      }
    });
  };

  serverRequests.updateData = function(){
    console.log('Updating Data');
    $.ajax({
      type: 'GET',
      url: 'http://photoyarn.azurewebsites.net/getAllYarns',
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
      }.bind(this),
      error: function (error) {
        console.log('Update Data Error: ', error);
      }
    });
  };

  serverRequests.postToImgur = function(data){
    var serverData = {};
    serverData.caption = data.caption;
    serverData.link;
    serverData.creatorId = 21;
    serverData.imgurId;
    console.log('serverData', serverData);
   $.ajax({
      type: 'POST',
      url: 'https://api.imgur.com/3/upload',
      headers: {
        Authorization: 'Client-ID ' + 'ef774ae96ae304c',
      },
      data: {
        image: data.b64image,
        title: 'New Picture'
      },
      success: function (res) {
        console.log('Post to Imgur Success: ', res.data);
        serverData.link = res.data.link;
        serverData.imgurId = res.data.id
        console.log('Server data', serverData);
        serverRequests.postYarnToServer(serverData);
      },
      error: function (error, res) {
        console.log('Post to Imgur Error: ', error);
        console.log('Post to Imgur Error Response: ', res);
      }
    });
  };

  serverRequests.postYarnToServer = function(data){
    $.ajax({
      type: 'POST',
      url: 'http://photoyarn.azurewebsites.net/createNewYarn',
      data: {
        imgurId: data.id,
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

  serverRequests.postPhotoToServerYarn = function(data){
    $.ajax({
      type: 'POST',
      url: 'http://photoyarn.azurewebsites.net/addToYarn',
      data: {
        yarnId: data.yarnId,
        link: data.link
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
      profilePicUrl: 'https://cdn3.iconfinder.com/data/icons/cat-power-premium/120/cat_tied-512.png',
      username: 'exampleUserName',
      userLocation: 'San Francisco',
      numFollowers: 12,
      numFollowing: 33,
      likes: 11
    }
  };

  module.exports = serverRequests;

});