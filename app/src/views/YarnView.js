'use strict';

//import famo.us dependencies
var View = require('famous/core/View');
var StateModifier = require('famous/modifiers/StateModifier');
var ImageSurface = require('famous/surfaces/ImageSurface');
var Scrollview = require('famous/views/Scrollview');
var ViewSequence = require('famous/core/ViewSequence');
var Transform = require('famous/core/Transform');
var Surface = require('famous/core/Surface');

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

  this.scrollView = new Scrollview({
    align: [0.5, 0],
    origin: [0.5, 0],
    margin: 10000
  })
  this.scrollModifier = new StateModifier({
    size: [100,125],
    align: [0.5, 0],
    origin: [0.5, 0],
    transform: Transform.translate(0,15,-10)
  });
  this.add(this.scrollModifier).add(this.scrollView);

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
}

YarnView.prototype.createDetail = function(data){

  var imageLinks = data.links;
  this.sequence = [];
  for(var i = 0; i < imageLinks.length; i++){
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

    // set event handlers
    image.on('click', function(){
      console.log('HI!');
      this.setTransform(
        Transform.moveThen([0,0,15],Transform.scale(3,3,100)),
        {duration: 1500, curve: 'easeInOut'}
      );
      this.setTransform(
        Transform.moveThen([0,0,-15],Transform.scale(1,1,1)),
        {duration: 1500, curve: 'easeInOut'}
      );
    }.bind(imageModifier))
    // pipe events to ScrollView for scrolling
    image.pipe(this.scrollView);

    this.sequence.push(imageView);      
  }

  // imageSurface.setContent('assets/catgif.gif')

  this.sequence.push(this.addPhotoButton);

  this.scrollView.sequenceFrom(this.sequence);
}

module.exports = YarnView;
