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
  entryHeight: 175
};

function _createYarn(){
  //toggled and toggleCount used for animations
  this.toggled = false;
  this.toggleCount = 0;

  //main scrollView that holds images
  this.scrollView = new Scrollview({});

  //scrollModifier that scrollview is added in
  this.scrollModifier = new StateModifier({
    size: [320/2,443/2],
    align: [0.5, 0],
    origin: [0.5, 0],
    transform: Transform.translate(0,15,-15),
  });
  //adding to yarnView
  this.add(this.scrollModifier).add(this.scrollView);


  //focusImage displays the selected image on click, should animate in!
  this.focusImage = new ImageSurface({});

  this.focusImageModifier = new StateModifier({
    size: [320, 443],
    align: [0.5,0],
    origin: [0.5,0],
    transform: Transform.moveThen([-200,0,-15], Transform.rotateZ(Math.PI/2)),
  });

  this.add(this.focusImageModifier).add(this.focusImage);
}

function _createAddPhotoButton() {
  this.addPhotoButton = new Surface({
      size: [320/2, 60],
      content: '+',
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

//toggle function brings in focused image/scrollview depending on toggle state
YarnView.prototype.toggle = function(content){
  if(!this.toggled){
    this.focusImage.setContent(content);
    this.scrollModifier.setTransform(Transform.translate(0,2*window.innerHeight,-15), {duration: 500});
    this.focusImageModifier.setTransform(Transform.moveThen([0,0,-10], Transform.rotateX(0)), {duration: 500});
  } 
  else {
    this.focusImage.setContent('');
    this.scrollModifier.setTransform(Transform.translate(0,0,-15), {duration: 500});
    if(this.toggleCount % 2){
      this.focusImageModifier.setTransform(Transform.moveThen([200,-window.innerHeight,-10], 
        Transform.rotateZ(3*Math.PI/2)), {duration: 500});
    } else {
      this.focusImageModifier.setTransform(Transform.moveThen([-200,-window.innerHeight,-10],
        Transform.rotateZ(Math.PI/2)), {duration: 500});
    }
    this.toggleCount++;
  }
  this.toggled = !this.toggled;
};

//populates the yarnView with the specific 
YarnView.prototype.createDetail = function(data){
  var imageLinks = data.links;
  this.sequence = [];
  for(var i = 0; i < imageLinks.length; i++){
    var currentImage = imageLinks[i];
    var image = new ImageSurface({
      content: currentImage,
      properties: {
        padding: '5px'
      }
    });
    //lets scroll view hear events on this image
    image.pipe(this.scrollView);
    //toggles in focused image with this images content as focusedImages content
    image.on('click', function(target){
      var content = target.origin._imageUrl;
      this.toggle(content);
    }.bind(this));

    this.sequence.push(image);      
  }

  this.sequence.push(this.addPhotoButton);

  this.scrollView.sequenceFrom(this.sequence);
};

module.exports = YarnView;
