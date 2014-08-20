'use strict';
var View = require('famous/core/View');
var Surface = require('famous/core/Surface');
var StateModifier = require('famous/modifiers/StateModifier');
var ImageSurface = require('famous/surfaces/ImageSurface');
var Transform = require('famous/core/Transform');
var Animations = require('../customComponents/CustomAnimations');

//placeholder image used in production
var catGif = 'assets/catGif.gif';

//This is used 
var serverRequests;
var pictureFrame;

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
  _createCaption.call(this);
  _createTakePictureButton.call(this);
  _createGetPictureButton.call(this);
  _createSendButton.call(this);
  _createPictureFrame.call(this);
  _setListeners.call(this);
}

AddToYarn.prototype = Object.create(View.prototype);
AddToYarn.prototype.constructor = AddToYarn;
AddToYarn.DEFAULT_OPTIONS = {
  getPictureMsg: 'Get Picture',
  takePictureMsg: 'Take Picture',
  picSize: [175, 220],
};

function _createCaption() {
  this.caption = new Surface({
    content: '(no caption)',
    size: [this.options.picSize[0], true],
    classes: ['CaptionInput', 'focusTextColor'],
    properties: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '24px',
    },
  });

  this.captionModifier = new StateModifier({
    origin: [0.5, 1],
    align: [0.5, 0.2],
  });

  this.add(this.captionModifier).add(this.caption);
}

function _createSendButton(){
  this.sendButtonModifier = new StateModifier({
    align: [0.5,.95],
    origin: [0.5,1.5]
  });

  this.sendButton = new Surface({
    size: [60, 50],
    content: 'Submit',
    classes: ['CaptionSubmitButton', 'focusBGColor', 'whiteTextColor'],
    properties: {
      borderRadius: '10px',
      textAlign: 'center',
      lineHeight: '50px',
    },
  });

  var sendButtonNode = this.add(this.sendButtonModifier);
  sendButtonNode.add(this.sendButton);
}


function _createTakePictureButton() {
  this.takePictureModifier = new StateModifier({
    align: [0.22,.95],
    origin: [0.5,1.5]
  });

  this.takePicture = new ImageSurface({
    size: [50, 50],
    content: './assets/slr1.png',
    classes: ['primaryBGColor', 'whiteTextColor', 'darkBorder'],
    properties: {
      borderRadius: '10px',
      textAlign: 'center',
      lineHeight: '50px',
    },
  });

  this.add(this.takePictureModifier).add(this.takePicture);
}

function _createGetPictureButton() {
  this.getPictureModifier = new StateModifier({
    align: [0.78, .95],
    origin: [0.5, 1.5]
  });

  this.getPicture = new ImageSurface({
    size: [50, 50],
    content: './assets/stack21.png',
    classes: ['primaryBGColor', 'whiteTextColor', 'darkBorder'],
    properties: {
      borderRadius: '10px',
      lineHeight: '50px',
      textAlign: 'center',
    },
  });

  this.add(this.getPictureModifier).add(this.getPicture);
}

function _createPictureFrame() {
  pictureFrame = new ImageSurface({
    content: catGif,
    size: [this.options.picSize[0], this.options.picSize[1]],
    classes: ['AddPhotoViewPicFrame'],
  });

  var pictureFrameModifier = new StateModifier({
    align: [0.5, 0.5],
    origin: [0.5, 0.5]
  });

  this.add(pictureFrameModifier).add(pictureFrame);
}

function _setListeners() {
  this._eventInput.on('initYarnData', function(data) {
    this.yarnData = data;
    this.caption.setContent(this.yarnData.caption);
  }.bind(this));

  this.sendButton.on('click', function() {
    Animations.bounceBack(this.sendButtonModifier);
    pictureFrame.setContent(catGif);
    serverRequests.postToImgur(this.yarnData, 'add');
  }.bind(this));

  this.takePicture.on('click', function() {
    var context = this;
    Animations.bounceBack(this.takePictureModifier);
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
    Animations.bounceBack(this.getPictureModifier);
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
