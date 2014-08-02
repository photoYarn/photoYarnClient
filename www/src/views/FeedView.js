define(function(require, exports, module){
  'use strict';
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  var ScrollContainer = require('famous/views/ScrollContainer');

  var ImageSurface = require('famous/surfaces/ImageSurface');

  function FeedView(){
    View.apply(this, arguments);

    _createRootNode.call(this);
		_createBackground.call(this);
    _createFeedEntries.call(this);
  }

  FeedView.prototype = Object.create(View.prototype);
  FeedView.prototype.constructor = FeedView;
  FeedView.DEFAULT_OPTIONS = {
    message: 'Default message',
  };

  // create root modifier node
  function _createRootNode() {
    this.rootModifier = new Modifier({
      align: [0.5, 0.5],
      origin: [0.5, 0.5],
    });

    this.rootNode = this.add(this.rootModifier);
  };
	
  function _createBackground() {
    var background = new Surface({
      properties: {
        backgroundColor: '#999'
      }
    });

    this.add(background);
  };

  function _createFeedEntries() {
		
  };
  
  module.exports = FeedView;
});
