define(function(require, exports, module){
  'use strict';
  var View = require('famous/core/View');
  var StateModifier = require('famous/modifiers/StateModifier');
  var ImageSurface = require('famous/surfaces/ImageSurface');

  var catGif = 'http://37.media.tumblr.com/35e8d0682251fa96580100ea6a182e13/tumblr_mst9derOy01re0m3eo1_r12_500.gif';

  function YarnView(){
    View.apply(this, arguments);

    _createYarn.call(this);
  }
  YarnView.prototype = Object.create(View.prototype);
  YarnView.prototype.constructor = YarnView;



  function _createYarn(){
    this.image = new ImageSurface({
      content: catGif
    })

    this.imageModifier = new StateModifier({});

    this.add(this.imageModifier).add(this.image);
  }


  module.exports = YarnView;
});
