'use strict';

var View = require('famous/core/View');
var Surface = require('famous/core/Surface');
var ImageSurface = require('famous/surfaces/ImageSurface');
var StateModifier = require('famous/modifiers/StateModifier');

function LoadingView(){
  console.log('Created LoadingView');
  View.apply(this, arguments);
}


function LoadingView(){
  View.apply(this, arguments);
  _createSurface.call(this);
}


LoadingView.prototype = Object.create(View.prototype);
LoadingView.prototype.constructor = LoadingView;
LoadingView.DEFAULT_OPTIONS = {};

function _createSurface(){
  this.rootMod = new StateModifier({
    align: [0.5,0.1],
    origin: [0.5, 0.1]
  });

  this.loadingImageMod = new StateModifier({
    align: [0.5,0.5],
    origin: [0.5, 0.5]
  });

  this.loadingText = new Surface({
    content: 'LOADING!',
    properties:{
      textAlign: 'center'
    }
  });

  this.loadingImage = new ImageSurface({
    size: [200,200],
    content: 'assets/catTied.png'
  });
  var rootNode = this.add(this.rootMod);
  rootNode.add(this.loadingText);
  rootNode.add(this.loadingImageMod).add(this.loadingImage);
}

module.exports = LoadingView;


