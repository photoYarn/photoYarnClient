define(function(require, exports, module) {
  'use strict';
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var StateModifier = require('famous/modifiers/StateModifier');
  var ImageSurface = require('famous/surfaces/ImageSurface');
  var InputSurface = require('famous/surfaces/InputSurface');
  var Transform = require('famous/core/Transform');

  var serverRequests;

  //Variables used by this view
  var captionData = '';
  var mongoData = {};
  var catGif = 'http://37.media.tumblr.com/35e8d0682251fa96580100ea6a182e13/tumblr_mst9derOy01re0m3eo1_r12_500.gif';

  if(navigator.camera){
    var takePictureOptions = {
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.CAMERA,
      correctOrientation: true,
      saveToPhotoAlbum: true,
      encodingType: Camera.EncodingType.JPEG,
      quality: 25
    };

    var getPictureOptions = {
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true,
      encodingType: Camera.EncodingType.JPEG,
      quality: 25
    };    
  }

  function NewYarnView(){
    View.apply(this, arguments);

    _createTakePictureButton.call(this);
    _createGetPictureButton.call(this);
    _createCaption.call(this);
    _createPictureFrame.call(this);
    serverRequests = this.options.serverRequests;

  }

  NewYarnView.prototype = Object.create(View.prototype);
  NewYarnView.prototype.constructor = NewYarnView;
  NewYarnView.DEFAULT_OPTIONS = {
    getPictureMsg: 'Get Picture',
    takePictureMsg: 'Take Picture',
    picSize: [175, 220]
  };

  function _createCaption(){
    console.log(window.innerWidth)
    this.caption = new InputSurface({
      size: [this.options.picSize[0], true],
      placeholder: 'Your caption here'
    });

    this.captionModifier = new StateModifier({
      align: [0.5, 0],
      origin: [0.5, -4]
    });

    this.captionButton = new Surface({
      size: [50, 50],
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
      align: [0.5,1],
      origin: [0.5,1.5]
    });

    var captionNode = this.add(this.captionModifier);
    captionNode.add(this.caption);
    captionNode.add(buttonModifier).add(this.captionButton);

    this.captionButton.on('click', function(){
      captionData = this.caption.getValue();
      console.log(captionData);
      if(!!captionData && !!mongoData && pictureFrame.getContent() !== catGif){
        mongoData.caption = captionData;
        this.caption.setValue('');
        pictureFrame.setContent(catGif);

        console.log(this.options.serverRequests);
        this.options.serverRequests.postYarnToServer(mongoData);
      }
    }.bind(this));

  }


  function _createTakePictureButton() {

    this.takePictureModifier = new StateModifier({
      align: [0.25,1],
      origin: [0.5,1.5]
    });

    this.takePicture = new Surface({
      size: [100, 50],
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

    this.takePicture.on('click', function(){
      console.log('TakePicture Clicked!');
      navigator.camera.getPicture(onCameraSuccess, onCameraFail, takePictureOptions);
      }.bind(this));
  }

  function _createGetPictureButton() {
    this.getPictureModifier = new StateModifier({
      origin: [0.5, 1.5],
      align: [0.75, 1]
    });

    this.getPicture = new Surface({
      size: [100, 50],
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

    this.getPicture.on('click', function(){
      console.log('GetPicture Clicked!');
      navigator.camera.getPicture(onCameraSuccess, onCameraFail, getPictureOptions);
      }.bind(this));
  }
  
  function _createPictureFrame() {
    var pictureFrame = new ImageSurface({
      content: catGif,
      size: [this.options.picSize[0], this.options.picSize[1]],
      classes: ['AddPicViewPic']
    });
    
    var pictureFrameModifier = new StateModifier({
      align: [0.5, 0.5],
      origin: [0.5, 0.5]  
    });
    
    this.add(pictureFrameModifier).add(pictureFrame);
  }


  function onCameraSuccess(data){
    pictureFrame.setContent('data:image/jpeg;base64,' + data);
    serverRequests.postToImgur(data, mongoData);
  }

  function onCameraFail(error){
    console.log('!!!!!!!!!!!!!Error:', error);
  }

  module.exports = NewYarnView;

});