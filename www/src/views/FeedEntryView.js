define(function(require, exports, module){
  'use strict';
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
	var ContainerSurface = require("famous/surfaces/ContainerSurface");
  var ImageSurface = require('famous/surfaces/ImageSurface');
  var ScrollContainer = require('famous/views/ScrollContainer');
  var GridLayout = require('famous/views/GridLayout');
	
	var FeedEntryCaptionView = require('views/FeedEntryCaptionView');
	var FeedEntryPhotoView = require('views/FeedEntryPhotoView');

  function FeedEntryView(options, yarnData){
    View.apply(this, arguments);

		this.photoCount = 0;

    _createRootNode.call(this);
		_createBackground.call(this);
    _createPhotos.call(this, yarnData);
    _createHeaders.call(this);
		_setListeners.call(this, yarnData);
  }

  FeedEntryView.prototype = Object.create(View.prototype);
  FeedEntryView.prototype.constructor = FeedEntryView;
	
  FeedEntryView.DEFAULT_OPTIONS = {
		entrySize: [undefined, 175],
		defaultCaption: 'This is the default caption',
		captionSize: [undefined, 25],
		photoSize: [150, 150],
		textAlign: 'center',
		entryButtonSize: [100, 25]
  }

  // create root modifier node
  function _createRootNode() {
    this.rootModifier = new Modifier({
			size: [this.options.entrySize[0], this.options.entrySize[1]],
      align: [0, 0],
      origin: [0, 0]
    });

    this.rootNode = this.add(this.rootModifier);
  }
	
  function _createBackground() {
    this.background = new Surface({
			size: [this.options.entrySize[0], this.options.entrySize[1]],
			classes: ['FeedEntryBackground'],
      properties: {
        backgroundColor: '#DDD'
      }
    });
		
    this.rootNode.add(this.background);

  }
	
  function _createHeaders() {
		this.headers = [];
		
    this.headerGrid = new GridLayout({
      dimensions: [2, 1]
		});
    
    this.headerGrid.sequenceFrom(this.headers);
		
		var captionView = new View();

    this.caption = new Surface({
      size: [undefined, this.options.captionSize[1]],
      content: this.options.defaultCaption,
			
      properties: {
				lineHeight: this.options.captionSize[1] + 'px',
				backgroundColor: '#BBB'
      }
    });
		
		var captionModifier = new Modifier({
			align: [0,0],
			origin: [0,0]
		});

		captionView.add(captionModifier).add(this.caption);
		this.headers.push(captionView);
		
		var buttonView = new View();

		this.entryButton = new Surface({
	  	size: [this.options.entryButtonSize[0], this.options.entryButtonSize[1]],
			content: this.photoCount + ' photos ' + '\u2794',
      properties: {
				backgroundColor: '#FF6138',
        lineHeight: this.options.captionSize[1] + 'px',
        textAlign: this.options.textAlign,
				borderRadius: '5px'
      }
		});
		
		var entryButtonModifier = new Modifier({
			align: [1,0],
			origin: [1,0]
		});
		
		buttonView.add(entryButtonModifier).add(this.entryButton);
		this.headers.push(buttonView);

		this.rootNode.add(this.headerGrid);
  }
	
  function _createPhotos(yarnData) {
    this.photos = [];
    var photoRow = new ScrollContainer();
		
		console.log("yarnData", yarnData);
    for (var i = 0; i < yarnData.links.length; i++) {
			this.photoCount++;
			
	    var newPhoto = new ImageSurface({
	      size: [150, 150],
	      content: yarnData.links[i]
	    });
			
      this.photos.push(newPhoto);

			// pipe photo surface to container view
			newPhoto.pipe(this._eventOutput);
			newPhoto.pipe(photoRow);
    }
		
		var photoRowModifier = new Modifier({
			size: [undefined, this.options.photoSize[1]],
			align: [0, 1],
			origin: [0, 1]
		});
		
    photoRow.sequenceFrom(this.photos);
		photoRow.pipe(this._eventOutput);

    this.rootNode.add(photoRowModifier).add(photoRow);
  }

	function _setListeners(yarnData) {
		this.headerGrid.pipe(this._eventOutput);
		this.caption.pipe(this._eventOutput);
		this.entryButton.pipe(this._eventOutput);
		this.background.pipe(this._eventOutput);
		
		this.entryButton.pipe(this.options.eventTarget);
		
    this.entryButton.on('click', function(){
			console.log(this.options.eventTarget);
			console.log('clicked');
      this.entryButton.emit('GoAddToYarn', yarnData);
    }.bind(this));
	}

  module.exports = FeedEntryView;
});

