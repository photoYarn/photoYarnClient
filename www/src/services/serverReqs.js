define(function(require, exports, module) {
  'use strict';
  var serverRequests = {};

  var serverData = {};

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
        console.log('Post to Server Success!', res);
      },
      error: function(error, res){
        console.log('Post to Server Error', error);
        console.log('Post Error Response', res);
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
        console.log('Post to Server Success!', res);
      },
      error: function(error, res){
        console.log('Post to Server Error', error);
        console.log('Post Error Response', res);
      }
    });
  };

  module.exports = serverRequests;

});