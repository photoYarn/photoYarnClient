define(function(require, exports, module) {
  'use strict';
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var StateModifier = require('famous/modifiers/StateModifier');
  var ImageSurface = require('famous/surfaces/ImageSurface');

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

  function NewYarnView(){
    View.apply(this, arguments);

    _createTakePictureButton.call(this);
    _createGetPictureButton.call(this);

    this.add(surprise);
  }

  var surprise = new ImageSurface({
    align: [0.5, 0.5],
    origin: [0.5, 0.5],
    size: [200, true]
  });

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
      console.log('TakePicture Clicked!');
      navigator.camera.getPicture(onSuccess, onFail, takePictureOptions);
      });
  }

  function _createGetPictureButton() {
    this.getPictureModifier = new StateModifier({
      origin: [0.5,0],
      align: [0.5, 0]
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
      navigator.camera.getPicture(onSuccess, onFail, getPictureOptions);
      });
  }


  function onSuccess(data){
    surprise.setContent('data:image/jpeg;base64,' + data);
    $.ajax({
      type: 'POST',
      url: 'https://api.imgur.com/3/upload',
      headers: {
        Authorization: 'Client-ID ' + 'ef774ae96ae304c',
      },
      data: {
        image: data,
        title: 'pic'
      },
      success: function (res) {
        console.log('Post Success!');
        console.log(res.data);
        //Send to database below 
        $.ajax({
          type: 'POST',
          url: 'http://photoyarn.azurewebsites.net/yarns',
          data: {
            imgurId: res.data.id,
            caption: 'Test Caption',
            creatorId: 'Kia Kia Kia'
          }
        });
      },
      error: function (error, res) {
        console.log('post error', error);
        console.log('post response', res);
      }
    });
  }

  function onFail(error){
    console.log('!!!!!!!!!!!!!Error:', error);
  }

  module.exports = NewYarnView;

});