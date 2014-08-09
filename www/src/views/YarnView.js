define(function(require, exports, module){
  'use strict';
  var View = require('famous/core/View');
  var StateModifier = require('famous/modifiers/StateModifier');
  var ImageSurface = require('famous/surfaces/ImageSurface');
  var Scrollview = require('famous/views/Scrollview');

  var serverRequests = require('services/serverRequests');
  var catGif = 'http://37.media.tumblr.com/35e8d0682251fa96580100ea6a182e13/tumblr_mst9derOy01re0m3eo1_r12_500.gif';
  var dummyTarget = "53e5499be71a74d003372cc1";

  function YarnView(){
    View.apply(this, arguments);
    console.log(serverRequests.data);

    _createYarn.call(this);
  }


  YarnView.prototype = Object.create(View.prototype);
  YarnView.prototype.constructor = YarnView;



  function _createYarn(){
    this.scrollView = new Scrollview({})

    this.scrollModifier = new StateModifier({});

    this.add(this.scrollModifier).add(this.scrollView);
    this.scrollView.on('click', function(){
      this.magicTime();
    }.bind(this));
  }

  YarnView.prototype.magicTime = function(){
    var targetYarn = serverRequests.data[serverRequests.cache[dummyTarget]];
    console.log(targetYarn);
  }


  module.exports = YarnView;
});
