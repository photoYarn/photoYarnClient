define(function(require, exports, module) {
  'use strict';

  var serverRequests = {};


  serverRequests.data = [];
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

  serverRequests.postToImgur = function(data, target){
   $.ajax({
      type: 'POST',
      url: 'https://api.imgur.com/3/upload',
      headers: {
        Authorization: 'Client-ID ' + 'ef774ae96ae304c',
      },
      data: {
        image: data,
        title: 'New Picture'
      },
      success: function (res) {
        console.log('Post to Imgur Success: ', res.data);
        target.link = res.data.link;
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
      profilePicUrl: 'http://image.shutterstock.com/display_pic_with_logo/1142849/149083895/stock-vector-male-avatar-profile-picture-vector-149083895.jpg',
      username: 'exampleUserName',
      userLocation: 'San Francisco',
      numFollowers: 5,
      numFollowing: 12,
      likes: 3
    }
  };

  module.exports = serverRequests;

});