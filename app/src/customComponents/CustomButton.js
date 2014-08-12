'use strict';

// import famo.us dependences
var View = require('famous/core/View');
var Modifier = require('famous/core/Modifier');
var Surface = require('famous/core/Surface');
var Transform = require('famous/core/Transform');
var Transitionable = require('famous/transitions/Transitionable');
var SpringTransition = require('famous/transitions/SpringTransition');
var Easing = require('famous/transitions/Easing');

Transitionable.registerMethod('spring', SpringTransition);

// CustomButton constructor
function CustomButton(){
  View.apply(this, arguments);

  // adding elements
  _createRootNode.call(this);
  _createButton.call(this);
  _setListeners.call(this);
}

// set defaults
CustomButton.prototype = Object.create(View.prototype);
CustomButton.prototype.constructor = CustomButton;
CustomButton.DEFAULT_OPTIONS = {
  align: [0.5, 0.5],
  origin: [0.5, 0.5],
  lineHeight: '50px',
  textAlign: 'center',
  bounceScale: 0.8,
  bounceTransition: {
    method: 'spring',
    period: 250,
    dampingRatio: 0.5
  },
};

// create root modifier
function _createRootNode(){
  this.rootModifier = new Modifier({
    align: this.options.align,
    origin: this.options.origin,
  });

  this.rootNode = this.add(this.rootModifier);
}

// create button
function _createButton(){
  this.button = new Surface({
    content: this.options.name,
    classes: this.options.classes,
    properties: {
      lineHeight: this.options.lineHeight,
      textAlign: this.options.textAlign,
    },
  });

  this.rootNode.add(this.button);
}

function _setListeners() {
  this.button.on('click', function() {
    this._bounceBack();
    this._eventOutput.emit('click');
  }.bind(this));
}

CustomButton.prototype._bounceBack = function() {
  this.rootModifier.setTransform(Transform.scale(this.options.bounceScale, this.options.bounceScale, 1));
  this.rootModifier.setTransform(Transform.identity, this.options.bounceTransition);
};

module.exports = CustomButton;
