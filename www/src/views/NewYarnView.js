define(function(require, exports, module) {
  'use strict';
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var ImageSurface = require('famous/surfaces/ImageSurface');

  function NewYarnView(){
    View.apply(this, arguments);

    _createSurface.call(this);
  }

  NewYarnView.prototype = Object.create(View.prototype);
  NewYarnView.prototype.constructor = NewYarnView;
  NewYarnView.DEFAULT_OPTIONS = {
    message: 'default new yarn view'
  };

  function _createSurface() {
    this.surface = new Surface({
      size: [200, 200],
      content: this.options.message,
      properties: {
        backgroundColor: 'green',
        color: 'white',
      },
    });
    
    this.add(this.surface);
    
  };
  
  module.exports = NewYarnView;
});