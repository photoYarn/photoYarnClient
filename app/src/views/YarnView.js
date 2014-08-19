'use strict';

//import famo.us dependencies
var View = require('famous/core/View');
var StateModifier = require('famous/modifiers/StateModifier');
var ImageSurface = require('famous/surfaces/ImageSurface');
var Scrollview = require('famous/views/Scrollview');
var Transform = require('famous/core/Transform');
var Surface = require('famous/core/Surface');

//YarnView constructor function
function YarnView(){
  View.apply(this, arguments);
  _createYarn.call(this);
  _createAddPhotoButton.call(this);
  _setListeners.call(this);
}

YarnView.prototype = Object.create(View.prototype);
YarnView.prototype.constructor = YarnView;
YarnView.DEFAULT_OPTIONS = {
};

function _createYarn(){
  //toggled and toggleCount used for animations
  this.toggled = false;

  //main scrollView that holds images
  this.scrollView = new Scrollview({});

  //scrollModifier that scrollview is added in
  this.scrollModifier = new StateModifier({
    size: [160,221.5],
    align: [0.5, 0],
    origin: [0.5, 0],
    transform: Transform.translate(0,0,-15),
  });
  //adding to yarnView
  this.add(this.scrollModifier).add(this.scrollView);


  //focusImage displays the selected image on click, should animate in!
  this.focusImage = new ImageSurface({
    properties: {
      'border-radius': '5px'
    }
  });

  this.focusImageModifier = new StateModifier({
    size: [160, 221.5],
    align: [0.5,0],
    origin: [0.5,0],
    transform: Transform.translate(0,0,-16)
  });

  this.add(this.focusImageModifier).add(this.focusImage);
}

function _createAddPhotoButton() {
  this.addPhotoButton = new Surface({
      size: [320/2, 60],
      content: '+',
      classes: ['photoEntry'],
      properties: {
        fontSize: '60px',
        backgroundColor: '#CCC',
        textAlign: 'center',
        lineHeight: '60px'
      }
  });
}

function _setListeners() {
  this._eventInput.on('initYarnData', function(data) {
    this.yarnData = data;
    this.createDetail(data);
  }.bind(this));

  this.addPhotoButton.on('click', function(){
    if(this.toggled === false){
      this._eventOutput.emit('showAddToYarn', this.yarnData);
    }
  }.bind(this));

  this.focusImage.on('click', function(){
    this.toggle();
  }.bind(this));
}

var yTargetLocation;
//toggle function brings in focused image/scrollview depending on toggle state
YarnView.prototype.toggle = function(target){
  // console.log('Toggling!', target);
  if(target){
    yTargetLocation = target.origin._matrix[13] - this.scrollView._scroller._position;
  }
  if(!this.toggled){
    this.focusImage.setContent(target.origin._imageUrl);
    this.focusImageModifier.setOpacity(1);
    this.scrollModifier.setOpacity(0, {duration: 500});
    this.focusImageModifier.setTransform(Transform.translate(0, yTargetLocation, -10));
    this.focusImageModifier.setSize([320,443], {duration: 500});
    this.focusImageModifier.setTransform(Transform.translate(0, 0, -14), {duration: 500});
  } 
  else {
    this.focusImageModifier.setSize([160, 221.5], {duration: 500});
    this.focusImageModifier.setTransform(Transform.translate(0, yTargetLocation, -16), {duration: 500}, function(){
      this.focusImageModifier.setOpacity(0, {duration: 500});
      this.scrollModifier.setOpacity(1);
    }.bind(this));
  }
  this.toggled = !this.toggled;
};

//populates the yarnView with the specific 
YarnView.prototype.createDetail = function(data){
  var imageLinks = data.links;
  this.sequence = [];
  var count = 0;
  for(var i = 0; i < imageLinks.length; i++){
    var currentImage = imageLinks[i];
    var image = new ImageSurface({
      content: currentImage,
      classes: ['photoEntry'],
      properties: {
        'border-radius': '10px'
      }
    });
    image.spotCount = count;
    count++;
    //lets scroll view hear events on this image
    image.pipe(this.scrollView);
    //toggles in focused image with this images content as focusedImages content
    image.on('click', function(target){
      this.toggle(target);
    }.bind(this));

    this.sequence.push(image);      
  }

  this.sequence.push(this.addPhotoButton);

  this.scrollView.sequenceFrom(this.sequence);
};

module.exports = YarnView;
