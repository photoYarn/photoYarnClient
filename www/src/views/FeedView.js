define(function(require, exports, module){
  'use strict';
  var View = require('famous/core/View');
  var ImageSurface = require('famous/surfaces/ImageSurface');

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
    this.imageSurface = new ImageSurface({
      size: [200, 200],
      content: 'http://code.famo.us/assets/famous_logo.svg'
    });
    
    this.add(this.imageSurface);
  };
  
  module.exports = FeedView;
});