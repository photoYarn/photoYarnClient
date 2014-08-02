define(function(require, exports, module) {
  'use strict';
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');

  function YarnView(){
    View.apply(this, arguments);

    _createSurface.call(this);
  }

  YarnView.prototype = Object.create(View.prototype);
  YarnView.prototype.constructor = YarnView;
  YarnView.DEFAULT_OPTIONS = {
    message: 'Default Yarn'
  };

  function _createSurface() {
    this.surface = new Surface({
      size: [200, 200],
      content: this.options.message,
      properties: {
        backgroundColor: 'blue',
        color: 'white',
      },
    });

    this.add(this.surface);
  };
  
  module.exports = YarnView;
});