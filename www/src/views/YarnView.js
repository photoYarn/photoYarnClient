define(function(require, exports, module) {
  'use strict';
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');

  function YarnView(){
    View.apply(this, arguments);

    //creates YarnView
    console.log('Sup Bros');

    _createSurface.call(this);
  }

  YarnView.prototype = Object.create(View.prototype);
  YarnView.prototype.constructor = YarnView;
  YarnView.DEFAULT_OPTIONS = {
    blah: 'default blah'
  };

  function _createSurface() {
    this.surface = new Surface({
      size: [200, 200],
      content: this.options.blah,
      properties: {
        backgroundColor: 'red',
        color: 'white',
      },
    });

    this.add(this.surface);
  };
  
  module.exports = YarnView;
});