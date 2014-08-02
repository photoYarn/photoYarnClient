define(function(require, exports, module) {
  'use strict';
  var View = require('famous/core/View');
  var Modifier = require('famous/core/Modifier');
  var Surface = require('famous/core/Surface');

  function CustomButton(){
    View.apply(this, arguments);
    _createRootNode.call(this);
    _createButton.call(this);
  }

  CustomButton.prototype = Object.create(View.prototype);
  CustomButton.prototype.constructor = CustomButton;
  CustomButton.DEFAULT_OPTIONS = {
    textAlign: 'center'
  };

  function _createRootNode(){
    this.rootModifier = new Modifier({
      align: [0.5, 0.5],
      origin: [0.5, 0.5]
    });

    this.rootNode = this.add(this.rootModifier);
  }

  function _createButton(){
    this.button = new Surface({
      content: this.options.name,
      classes: this.options.classes,
      properties: {
        lineHeight: this.options.lineHeight,
        textAlign: this.options.textAlign
      }
    });

    this.button.on('click', function(){
      this.options.renderController.hide();
      this.options.renderController.show(this.options.target);
    }.bind(this));

    this.rootNode.add(this.button);
  }

  module.exports = CustomButton;

});