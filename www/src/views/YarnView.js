define(function(require, exports, module) {
  'use strict';
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var ImageSurface = require('famous/surfaces/ImageSurface');

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
    this.surface = new ImageSurface({
      content: 'mockAssets/yarnView.png',
    });

    this.add(this.surface);
  };
  
  module.exports = YarnView;
});