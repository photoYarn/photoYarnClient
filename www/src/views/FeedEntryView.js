define(function(require, exports, module){
  'use strict';
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
	
	var FeedEntryCaptionView = require('views/FeedEntryCaptionView');
	var FeedEntryPhotoView = require('views/FeedEntryPhotoView');

  function FeedEntryView(){
    View.apply(this, arguments);

    _createRootNode.call(this);
		_createBackground.call(this);
    _createCaption.call(this);
    _createPhotos.call(this);
  }

  FeedEntryView.prototype = Object.create(View.prototype);
  FeedEntryView.prototype.constructor = FeedEntryView;
  FeedEntryView.DEFAULT_OPTIONS = {
		defaultCaption: 'This is the default caption',
		captionSize: [undefined, 50],
		photoSize: [150, 150]
  };

  // create root modifier node
  function _createRootNode() {
    this.rootModifier = new Modifier({
      align: [0.5, 0.5],
      origin: [0.5, 0.5]
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
	
  function _createCaption() {
    var caption = new Surface({
      size: [this.options.captionSize[0], this.options.captionSize[1]],
      content: this.options.defaultCaption,
			
      properties: {
				lineHeight: this.options.captionSize[1]
      }
    });

    var captionModifier = new Modifier({
      align: [0.5, 0.5],
      origin: [0.5, 0.5],
    });

    this.rootNode.add(captionModifier).add(caption);
  };

  function _createPhotos() {
    this.photos = [];

    for (var i = 0; i < 10; i++) {
      var dummyPhoto = new ImageSurface({
        size: [this.options.photoSize[0], this.options.photoSize[1]],
        content: 'http://www.saatchistore.com/217-438-thickbox/pretty-polaroid-notes.jpg',
        transform: function() {
            return Transform.rotateY(0.002 * (Date.now() - initialTime));
        }
      });
      this.photos.push(dummyPhoto);
    }

    var photoRow = new ScrollContainer();
    photoRow.sequenceFrom(this.photos);

    this.rootNode.add(photoRow);
  }
  
  module.exports = FeedEntryView;
});
