'use strict';

//import famo.us dependencies
var View = require('famous/core/View');
var StateModifier = require('famous/modifiers/StateModifier');
var ImageSurface = require('famous/surfaces/ImageSurface');
var Scrollview = require('famous/views/Scrollview');
var ViewSequence = require('famous/core/ViewSequence');
var Transform = require('famous/core/Transform');
var Surface = require('famous/core/Surface');
var Easing = require('famous/transitions/Easing');

//import serverRequests
var serverRequests = require('../services/serverRequests');

function YarnView(){
  View.apply(this, arguments);

  _createYarn.call(this);
  _createAddPhotoButton.call(this);
  _setListeners.call(this);
}


YarnView.prototype = Object.create(View.prototype);
YarnView.prototype.constructor = YarnView;
YarnView.DEFAULT_OPTIONS = {
  entryHeight: 175
}



function _createYarn(){

  this.toggled = false;

  this.scrollView = new Scrollview({
    margin: 10000
  })
  this.scrollModifier = new StateModifier({
    size: [100,125],
    align: [0.5, 0],
    origin: [0.5, 0],
    transform: Transform.translate(0,15,-10)
  });
  this.add(this.scrollModifier).add(this.scrollView);

  this.hiddenImage = new ImageSurface({
    content : 'assets/catTied.png'
  });

  this.hiddenImageMod = new StateModifier({
    transform: Transform.translate(0,0,-11),
    opacity: 0
  })

  this.add(this.hiddenImageMod).add(this.hiddenImage);
}

function _createAddPhotoButton() {
  this.addPhotoButton = new Surface({
      size: [100, 30],
      content: '+',
      properties: {
        textSize: 30 + 'px',
        backgroundColor: '#CCC',
        textAlign: 'center',
      }
  });

  // attach button to end of photo sequence in createDetail()
}

function _setListeners() {
  this._eventInput.on('initYarnData', function(data) {
    this.yarnData = data;
    this.createDetail(data);
  }.bind(this));

  this.addPhotoButton.on('click', function(){
    this._eventOutput.emit('showAddToYarn', this.yarnData);
  }.bind(this))
  this.hiddenImage.on('click', function(){
    this.toggle();
  }.bind(this));
}

YarnView.prototype.toggle = function(content){

  if(!this.toggled){
    this.hiddenImage.setContent(content)
    this.scrollModifier.setTransform(Transform.moveThen([0,0,-11], Transform.scale(1,1,1)));
    this.scrollModifier.setOpacity(0);
    this.hiddenImageMod.setTransform(Transform.moveThen([0,0,-10], Transform.scale(1,1,1)));
    this.hiddenImageMod.setOpacity(1);
  } else {
    this.scrollModifier.setTransform(Transform.moveThen([0,0,-10], Transform.scale(1,1,1)));
    this.scrollModifier.setOpacity(1);
    this.hiddenImageMod.setTransform(Transform.moveThen([0,0,-11], Transform.scale(1,1,1)));
    this.hiddenImageMod.setOpacity(0);
  }
  this.toggled = !this.toggled;
}


YarnView.prototype.createDetail = function(data){

  var imageLinks = data.links;
  this.sequence = [];
  for(var i = 0; i < imageLinks.length; i++){
    var context = this;
    var currentImage = imageLinks[i];
    var imageView = new View();
    var imageModifier = new StateModifier({
      align: [0.5, 0.5],
      origin: [0.5, 0.5]
    });
    var image = new ImageSurface({
      content: currentImage,
    });
    imageView.add(imageModifier).add(image);

    image.pipe(this.scrollView);
    
    image.on('click', function(target){
      var content = target.origin._imageUrl;
      this.toggle(content);
    }.bind(this));

    this.sequence.push(imageView);      
  }


  this.sequence.push(this.addPhotoButton);

  this.scrollView.sequenceFrom(this.sequence);
}

module.exports = YarnView;
