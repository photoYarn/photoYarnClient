'use strict';
var View = require('famous/core/View');
var Surface = require('famous/core/Surface');
var ImageSurface = require('famous/surfaces/ImageSurface');
var StateModifier = require('famous/modifiers/StateModifier');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');

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
  var initialTime = Date.now();
  var count = 0;
  this.rootMod = new StateModifier({
    align: [0.5,0.5],
    origin: [0.5, 0.5]
  });

   var centerSpinModifier = new Modifier({
      align: [0.5, 0.5],
      origin: [0.5, 0.5],
      transform: function() {
        return Transform.rotateZ(.002 * (Date.now() - initialTime));
      }
    });

  this.loadingTextModifier = new Modifier({
    transform: Transform.translate(0,15,0)
  })

  this.loadingText = new Surface({
    content: 'LOADING...',
    properties:{
      textAlign: 'center',
      lineHeight: '100px'
    }
  });

  this.loadingImage = new ImageSurface({
    size: [200,200],
    content: 'assets/catTied.png'
  });

  var rootNode = this.add(this.rootMod);
  rootNode.add(this.loadingTextModifier).add(this.loadingText);
  rootNode.add(centerSpinModifier).add(this.loadingImage);
}

module.exports = LoadingView;


