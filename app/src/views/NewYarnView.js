'use strict';
var View = require('famous/core/View');
var Surface = require('famous/core/Surface');
var StateModifier = require('famous/modifiers/StateModifier');
var ImageSurface = require('famous/surfaces/ImageSurface');
var InputSurface = require('famous/surfaces/InputSurface');
var Transform = require('famous/core/Transform');
var Animations = require('../customComponents/CustomAnimations');
var ButtonView = require('../views/ButtonView');

var serverRequests;
var pictureFrame;

//Variables used by this view
var catGif = './assets/catGif.gif';

function NewYarnView(){
  View.apply(this, arguments);

  // initialize class variables
  this.yarnData = {};
  serverRequests = this.options.serverRequests;

  // add elements
  _createTakePictureButton.call(this);
  _createGetPictureButton.call(this);
  _createCaption.call(this);
  _createPictureFrame.call(this);
  _setListeners.call(this);
}

NewYarnView.prototype = Object.create(View.prototype);
NewYarnView.prototype.constructor = NewYarnView;
NewYarnView.DEFAULT_OPTIONS = {
  getPictureMsg: 'Get Picture',
  takePictureMsg: 'Take Picture',
  picSize: [175, 220]
};

function _createCaption(){
  this.caption = new InputSurface({
    size: [this.options.picSize[0], true],
    placeholder: 'Enter Caption',
    classes: ['CaptionInput'],
    properties: {
      textAlign: 'center',
    }
  });
  
  this.captionModifier = new StateModifier({
    align: [0.5, 0],
    origin: [0.5, -4]
  });
  
  this.captionButton = new ButtonView({
    size: [50, 50],
    classes: ['navButton', 'ion-checkmark'],
    properties: {
      fontSize: 50 * 0.9 + 'px',
    },
  });

  this.captionButtonModifier = new StateModifier({
    align: [0.5,1],
    origin: [0.5,1.5]
  });
  
  var captionNode = this.add(this.captionModifier);
  captionNode.add(this.caption);
  captionNode.add(this.captionButtonModifier).add(this.captionButton);
}


function _createTakePictureButton() {
  this.takePictureModifier = new StateModifier({
    align: [0.22,1],
    origin: [0.5,1.5]
  });

  this.takePicture = new ButtonView({
    size: [50, 50],
    classes: ['navButton', 'ion-camera'],
    properties: {
      fontSize: 50 * 0.9 + 'px',
    },
  });

  this.add(this.takePictureModifier).add(this.takePicture);
}

function _createGetPictureButton() {
  this.getPictureModifier = new StateModifier({
    align: [0.78, 1],
    origin: [0.5, 1.5]
  });

  this.getPicture = new ButtonView({
    size: [50, 50],
    classes: ['navButton', 'ion-image'],
    properties: {
      fontSize: 50 * 0.9 + 'px',
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
  this.caption.on('click', function () {
    document.getElementsByClassName('CaptionInput')[0].maxLength = 30;
  });
  
  this.captionButton.on('click', function(){
    Animations.bounceBack(this.captionButtonModifier);
    if(this.caption.getValue() !== undefined && pictureFrame.getContent() !== catGif){
      this.yarnData.caption = this.caption.getValue();
      this.caption.setValue('');
      pictureFrame.setContent(catGif);
      this.options.serverRequests.postToImgur(this.yarnData, 'new');
    }
  }.bind(this));

  this.takePicture.on('click', function(){
    var context = this;
    Animations.bounceBack(this.takePictureModifier);
    navigator.camera.getPicture(function(data){
      onCameraSuccess(data, context)
    }, onCameraFail, {
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.CAMERA,
      correctOrientation: true,
      saveToPhotoAlbum: true,
      encodingType: Camera.EncodingType.JPEG,
      quality: 25
    });
  }.bind(this));

  this.getPicture.on('click', function(){
    var context = this;
    Animations.bounceBack(this.getPictureModifier);
    navigator.camera.getPicture(function(data){
      onCameraSuccess(data, context)
    }, onCameraFail,
    {
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true,
      encodingType: Camera.EncodingType.JPEG,
      quality: 25
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

module.exports = NewYarnView;
