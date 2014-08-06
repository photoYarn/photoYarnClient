define(function(require, exports, module) {
  'use strict';
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var StateModifier = require('famous/modifiers/StateModifier');
  var ImageSurface = require('famous/surfaces/ImageSurface');
  var InputSurface = require('famous/surfaces/InputSurface');
  var Transform = require('famous/core/Transform');

  var captionData = '';
  var mongoData;
  var catGif = 'http://37.media.tumblr.com/35e8d0682251fa96580100ea6a182e13/tumblr_mst9derOy01re0m3eo1_r12_500.gif';


  //Need some sort of yarnId and preset caption to post to /photo
  //expecting yarnId and image link _id from post to DB!
  var yarnData = {
    yarnId : '53e269fe608875500746d30a', //string 
    link: 'http://37.media.tumblr.com/35e8d0682251fa96580100ea6a182e13/tumblr_mst9derOy01re0m3eo1_r12_500.gif', //string,
  };

  if(navigator.camera){
    var takePictureOptions = {
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.CAMERA,
      correctOrientation: true,
      saveToPhotoAlbum: true,
      encodingType: Camera.EncodingType.JPEG
    };

    var getPictureOptions = {
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true,
      encodingType: Camera.EncodingType.JPEG

    };    
  }

  function AddToYarn(){
    View.apply(this, arguments);

    _createTakePictureButton.call(this);
    _createGetPictureButton.call(this);
    _createSendButton.call(this);

    this.add(pictureFrame);
  }

  var pictureFrame = new ImageSurface({
    content: catGif,
    align: [0.5, 0.5],
    origin: [0.5, 0.5],
    size: [200, true]
  });

  AddToYarn.prototype = Object.create(View.prototype);
  AddToYarn.prototype.constructor = AddToYarn;
  AddToYarn.DEFAULT_OPTIONS = {
    getPictureMsg: 'Get Picture',
    takePictureMsg: 'Take Picture'    
  };

  function _createSendButton(){
    

    this.sendButtonModifier = new StateModifier({
      transform : Transform.translate(0, -200, 0)
    });


    this.sendButton = new Surface({
      size: [50, 20],
      content: 'Submit',
      properties: {
        backgroundColor: 'red'
      }
    });

    var buttonModifier = new StateModifier({
        // places the icon in the proper location
        transform: Transform.translate(100, 0, 0)
    });

    var sendButtonNode = this.add(this.sendButtonModifier);
    sendButtonNode.add(this.sendButton);

    this.sendButton.on('click', function(){
      pictureFrame.setContent(catGif);
      postToServer(yarnData);
    }.bind(this));

  }


  function _createTakePictureButton() {

    this.takePictureModifier = new StateModifier({
      align: [0.25,1],
      origin: [0.25,1]
    });

    this.takePicture = new Surface({
      size: [100, true],
      content: this.options.takePictureMsg,
      properties: {
        backgroundColor: '#fa5c4f',
        color: 'white',
      },
    });

    this.add(this.takePictureModifier).add(this.takePicture);

    this.takePicture.on('click', function(){
      console.log('TakePicture Clicked!');
      navigator.camera.getPicture(onCameraSuccess, onCameraFail, takePictureOptions);
      }.bind(this));
  }

  function _createGetPictureButton() {
    this.getPictureModifier = new StateModifier({
      origin: [0.75,1],
      align: [0.75, 1]
    });

    this.getPicture = new Surface({
      size: [100, true],
      content: this.options.getPictureMsg,
      properties: {
        backgroundColor: '#fa5c4f',
        color: 'white',
      },
    });

    this.add(this.getPictureModifier).add(this.getPicture);

    this.getPicture.on('click', function(){
      console.log('GetPicture Clicked!');
      navigator.camera.getPicture(onCameraSuccess, onCameraFail, getPictureOptions);
      }.bind(this));
  }


  function onCameraSuccess(data){
    pictureFrame.setContent('data:image/jpeg;base64,' + data);
    postToImgur(data);
  }

  function onCameraFail(error){
    console.log('!!!!!!!!!!!!!Error:', error);
  }

  function postToImgur(data){
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
        console.log('Post to Imgur Success!');
        console.log(res.data);
        yarnData.link = res.data.link;
      },
      error: function (error, res) {
        console.log('post error', error);
        console.log('post response', res);
      }
    });
  }

  function postToServer(data){
    $.ajax({
      type: 'POST',
      url: 'http://photoyarn.azurewebsites.net/photo',
      data: {
        yarnId: data.yarnId,
        link: data.link
      },
      success: function(res){
        console.log('Post to Mongo Success!', res);
      },
      error: function(error, res){
        console.log('post to mongo err', error);
        console.log('post error res', res);
      }
    });
  }


  module.exports = AddToYarn;

});