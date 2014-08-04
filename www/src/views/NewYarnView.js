define(function(require, exports, module) {
  'use strict';
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var StateModifier = require('famous/modifiers/StateModifier');
  var ImageSurface = require('famous/surfaces/ImageSurface');

  if(navigator.camera){
    var takePictureOptions = {
      destinationType : Camera.DestinationType.FILE_URI,
      sourceType : Camera.PictureSourceType.CAMERA
    };

    var getPictureOptions = {
        destinationType : Camera.DestinationType.FILE_URI,
        sourceType : Camera.PictureSourceType.PHOTOLIBRARY
    };    
  }

  function NewYarnView(){
    View.apply(this, arguments);

    _createTakePictureButton.call(this);
    _createGetPictureButton.call(this);
  }

  NewYarnView.prototype = Object.create(View.prototype);
  NewYarnView.prototype.constructor = NewYarnView;
  NewYarnView.DEFAULT_OPTIONS = {
    getPictureMsg: 'Get Picture',
    takePictureMsg: 'Take Picture'    
  };

  function _createTakePictureButton() {

    this.takePictureModifier = new StateModifier({
      align: [0,0],
      origin: [0,0]
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
      console.log('New Yarn View Button 1 Clicked!');
      console.log('Navigator', navigator);
      navigator.camera.getPicture(onSuccess, onFail, takePictureOptions);
      });
  }

  function _createGetPictureButton() {
    this.getPictureModifier = new StateModifier({
      origin: [0,0.5],
      align: [0, 0.5]
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
      console.log('New Yarn View Button 2 Clicked!');
      console.log('Navigator', navigator);
      navigator.camera.getPicture(onSuccess, onFail, getPictureOptions);
      });
  }


  function onSuccess(data){
    console.log('Success', data);
  }

  function onFail(error){
    console.log('Error', error);
  }

  module.exports = NewYarnView;

});