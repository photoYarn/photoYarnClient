define(function(require, exports, module){
  'use strict';
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
	var ContainerSurface = require("famous/surfaces/ContainerSurface");
  var ImageSurface = require('famous/surfaces/ImageSurface');
  var ScrollContainer = require('famous/views/ScrollContainer');
	
	var FeedEntryCaptionView = require('views/FeedEntryCaptionView');
	var FeedEntryPhotoView = require('views/FeedEntryPhotoView');

  function FeedEntryView(){
    View.apply(this, arguments);
		
    _createRootNode.call(this);
		_createBackground.call(this);
    _createCaption.call(this);
    _createPhotos.call(this);
		_setListeners.call(this);
  }

  FeedEntryView.prototype = Object.create(View.prototype);
  FeedEntryView.prototype.constructor = FeedEntryView;
	
  FeedEntryView.DEFAULT_OPTIONS = {
		entrySize: [undefined, 175],
		defaultCaption: 'This is the default caption',
		captionSize: [undefined, 25],
		photoSize: [150, 150],
		properties: {
			cursor: 'pointer'
		}
  };

  // create root modifier node
  function _createRootNode() {
    this.rootModifier = new Modifier({
			size: [this.options.entrySize[0], this.options.entrySize[1]],
      align: [0, 0],
      origin: [0, 0]
    });

    this.rootNode = this.add(this.rootModifier);
  };
	
  function _createBackground() {
    this.background = new Surface({
			size: [this.options.entrySize[0], this.options.entrySize[1]],
      properties: {
        backgroundColor: '#789'
      }
    });
		
    this.rootNode.add(this.background);

  };
	
  function _createCaption() {
    this.caption = new Surface({
      size: [this.options.captionSize[0], this.options.captionSize[1]],
      content: this.options.defaultCaption,
			
      properties: {
				lineHeight: this.options.captionSize[1] + 'px',
				backgroundColor: '#BBB'
      }
    });

    var captionModifier = new Modifier({
      align: [0, 0],
      origin: [0, 0]
    });

    this.rootNode.add(captionModifier).add(this.caption);
  };

  function _createPhotos() {
    this.photos = [];

    for (var i = 0; i < 10; i++) {
	    var dummyPhoto = new ImageSurface({
	      size: [150, 150],
	      content: 'http://www.saatchistore.com/217-438-thickbox/pretty-polaroid-notes.jpg'
	    });
			
      this.photos.push(dummyPhoto);

			// pipe photo surface to container view
			dummyPhoto.pipe(this._eventOutput);
    }
		
		var photoRowModifier = new Modifier({
			size: [undefined, this.options.photoSize[1]],
			align: [0, 1],
			origin: [0, 1]
		});

    var photoRow = new ScrollContainer();
		
		for (var i = 0; i < this.photos.length; i++) {
			this.photos[i].pipe(photoRow);
		}
		
    photoRow.sequenceFrom(this.photos);

    this.rootNode.add(photoRowModifier).add(photoRow);
  };

	function _setListeners() {
		this.caption.pipe(this._eventOutput);
		this.background.pipe(this._eventOutput);
	}

  module.exports = FeedEntryView;
});
