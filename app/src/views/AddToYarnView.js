'use strict';
var View = require('famous/core/View');
var Surface = require('famous/core/Surface');
var StateModifier = require('famous/modifiers/StateModifier');
var ImageSurface = require('famous/surfaces/ImageSurface');
var Transform = require('famous/core/Transform');

//placeholder image used in production
var catGif = 'assets/catGif.gif';

//This is used 
var serverRequests;

/*
When this view is rendered it has a this.yarnData property
this.yarnData has  caption, _id, and a creatorId properties
When picture is added, it creates a b64image property to this.yarnData
*/

function AddToYarn(){
  View.apply(this, arguments);

  _createTakePictureButton.call(this);
  _createGetPictureButton.call(this);
  _createSendButton.call(this);
  serverRequests = this.options.serverRequests;

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
    serverRequests.postToImgur(this.yarnData, 'add');
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
    var context = this;
    navigator.camera.getPicture(function(data){
      onCameraSuccess(data, context)
    }, onCameraFail, 
    {
      quality: 25,
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.CAMERA,
      correctOrientation: true,
      saveToPhotoAlbum: true,
      encodingType: Camera.EncodingType.JPEG
  });
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
    var context = this;
    navigator.camera.getPicture(function(data){
      onCameraSuccess(data, context)
    }, onCameraFail, 
    {
      quality: 25,
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true,
      encodingType: Camera.EncodingType.JPEG
  });
    }.bind(this));
}


function onCameraSuccess(data, context){
  pictureFrame.setContent('data:image/jpeg;base64,' + data);
  context.yarnData.b64image = data;
}

function onCameraFail(error){
  console.log('Camera Error:', error);
}

module.exports = AddToYarn;

