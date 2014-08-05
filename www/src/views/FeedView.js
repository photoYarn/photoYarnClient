define(function(require, exports, module){
  'use strict';
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
	var Transform  = require('famous/core/Transform');
  var ScrollContainer = require('famous/views/ScrollContainer');
  var Scrollview = require("famous/views/Scrollview");

  var ImageSurface = require('famous/surfaces/ImageSurface');

	var FeedEntryView = require('views/FeedEntryView');

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
		entryCount: 4,
		entryHeight: 175
  };
	
  function _createBackground() {
    this.background = new Surface({
			size: [,],
      properties: {
        backgroundColor: '#BADA55',
      }
    });
		
		var bgMod = new Modifier({
			transform: Transform.translate(0,0,-25)
		});
		
    this.rootNode.add(bgMod).add(this.background);

  };

  // create root modifier node
  function _createRootNode() {
    this.rootModifier = new Modifier({
      align: [0, 0],
      origin: [0, 0]
			// transform: Transform.translate(0,0,-10)
    });

    this.rootNode = this.add(this.rootModifier);
  };

  function _createFeedEntries() {
    var feed = new Scrollview({
			direction: 1,
    	margin: 10000 // without this some entries would stop rendering on a hard scroll (fix from https://github.com/Famous/views/issues/11)
    });
		this.entries = [];

    feed.sequenceFrom(this.entries);		

		for (var i = 0; i < this.options.entryCount; i++) {
			var newEntryView = new FeedEntryView();
			
			newEntryView.pipe(feed);
			this.entries.push(newEntryView);
		}
		
		var feedModifier = new Modifier({
			transform: Transform.translate(0, 0, -10)
		});
		
		this.rootNode.add(feedModifier).add(feed);
  };
  
  module.exports = FeedView;
});
