define(function(require, exports, module){
  'use strict';
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');

  function FeedView(){
    View.apply(this, arguments);

    _createSurface.call(this);
  }

  FeedView.prototype = Object.create(View.prototype);
  FeedView.prototype.constructor = FeedView;
  FeedView.DEFAULT_OPTIONS = {
    message: 'Default message'
  };

  function _createSurface() {
    this.surface = new Surface({
      size: [200, 200],
      content: this.options.message,
      properties: {
        backgroundColor: 'red',
        color: 'white',
      },
    });

    console.log(this.options.message);
    this.add(this.surface);
  };
  
  module.exports = FeedView;
});