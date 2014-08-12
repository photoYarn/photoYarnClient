'use strict';

// import famo.us dependences
var View = require('famous/core/View');
var Modifier = require('famous/core/Modifier');
var Surface = require('famous/core/Surface');
var Animations = require('../customComponents/CustomAnimations');

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
    Animations.bounceBack(this.rootModifier);
    this._eventOutput.emit('click');
  }.bind(this));
}

module.exports = CustomButton;
