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

  // initialize class variables
  serverRequests = this.options.serverRequests;

  // add elements
  _createTakePictureButton.call(this);
  _createGetPictureButton.call(this);
  _createSendButton.call(this);
  _setListeners.call(this);

  this.add(pictureFrameModifier).add(pictureFrame);
}

var pictureFrame = new ImageSurface({
  content: catGif,
  size: [175, 220],
  properties: {
    border: '1px solid #79BD8F'
  }
});

var pictureFrameModifier = new StateModifier({
  align: [0.5, 0.45],
  origin: [0.5, 0.5]
});

AddToYarn.prototype = Object.create(View.prototype);
AddToYarn.prototype.constructor = AddToYarn;
AddToYarn.DEFAULT_OPTIONS = {
  getPictureMsg: 'Get Picture',
  takePictureMsg: 'Take Picture'    
};

function _createSendButton(){
  this.sendButtonModifier = new StateModifier({
    align: [0.5,.95],
    origin: [0.5,1.5]
  });

  this.sendButton = new Surface({
    size: [60, 50],
    content: 'Submit',
    classes: ['CaptionSubmitButton'],
    properties: {
      borderRadius: '10px',
      fontWeight: 'bold',
      textAlign: 'center',
      lineHeight: '50px',
      backgroundColor: '#FF6138',
      color: 'white',
    },
  });

  var buttonModifier = new StateModifier({
      // places the icon in the proper location
      transform: Transform.translate(100, 0, 0)
  });

  var sendButtonNode = this.add(this.sendButtonModifier);
  sendButtonNode.add(this.sendButton);
}


function _createTakePictureButton() {
  this.takePictureModifier = new StateModifier({
    align: [0.22,.95],
    origin: [0.5,1.5]
  });

  this.takePicture = new Surface({
    size: [95, 50],
    content: this.options.takePictureMsg,
    properties: {
      borderRadius: '10px',
      fontWeight: 'bold',
      textAlign: 'center',
      lineHeight: '50px',
      backgroundColor: '#79BD8F',
      color: 'white',
    },
  });

  this.add(this.takePictureModifier).add(this.takePicture);
}

function _createGetPictureButton() {
  this.getPictureModifier = new StateModifier({
    align: [0.78, .95],
    origin: [0.5, 1.5]
  });

  this.getPicture = new Surface({
    size: [95, 50],
    content: this.options.getPictureMsg,
    properties: {
      borderRadius: '10px',
      lineHeight: '50px',
      fontWeight: 'bold',
      textAlign: 'center',
      backgroundColor: '#79BD8F',
      color: 'white',
    },
  });

  this.add(this.getPictureModifier).add(this.getPicture);
}

function _setListeners() {
  this._eventInput.on('initYarnData', function(data) {
    this.yarnData = data;
  }.bind(this));

  this.sendButton.on('click', function() {
    pictureFrame.setContent(catGif);
    serverRequests.postToImgur(this.yarnData, 'add');
  }.bind(this));

  this.takePicture.on('click', function() {
    var context = this;
    navigator.camera.getPicture(function(data) {
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

  this.getPicture.on('click', function() {
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
