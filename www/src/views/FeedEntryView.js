define(function(require, exports, module){
  'use strict';
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
	var ContainerSurface = require('famous/surfaces/ContainerSurface');
  var ImageSurface = require('famous/surfaces/ImageSurface');
  var ScrollContainer = require('famous/views/ScrollContainer');
  var GridLayout = require('famous/views/GridLayout');
  var Scrollview = require('famous/views/Scrollview');
	
	var FeedEntryCaptionView = require('views/FeedEntryCaptionView');
	var FeedEntryPhotoView = require('views/FeedEntryPhotoView');

  function FeedEntryView(options, yarnData){
    View.apply(this, arguments);

		this.photoCount = 0;

    _createRootNode.call(this);
		_createBackground.call(this);
    _createPhotos.call(this, yarnData);
    _createHeaders.call(this, yarnData);
		_createDividers.call(this);
		_setListeners.call(this, yarnData);
  }

  FeedEntryView.prototype = Object.create(View.prototype);
  FeedEntryView.prototype.constructor = FeedEntryView;
	
  FeedEntryView.DEFAULT_OPTIONS = {
		entrySize: [undefined, 125],
		defaultCaption: 'This is the default caption',
		captionSize: [undefined, 25],
		photosToShow: 5,
		photoSize: [50, 67],
		textAlign: 'center',
		entryButtonSize: [100, 25],
		dividerHeight: 1,
		photoPadding: 10
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
	
  function _createHeaders(yarnData) {
    this.caption = new Surface({
      size: [window.innerWidth - this.options.entryButtonSize[0], this.options.captionSize[1]],
      content: yarnData.caption,
			classes: ['FeedEntryCaption'],
      properties: {
				lineHeight: this.options.captionSize[1] + 'px',
				backgroundColor: '#DDD',
				
      }
    });
		
		var captionModifier = new Modifier({
			align: [0,0],
			origin: [0,0]
		});

		this.entryButton = new Surface({
	  	size: [this.options.entryButtonSize[0], this.options.entryButtonSize[1]],
			content: yarnData.links.length + ' photos ' + '\u2794',
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
		
		this.rootNode.add(entryButtonModifier).add(this.entryButton);

		this.rootNode.add(captionModifier).add(this.caption);
  }
	
  function _createPhotos(yarnData) {
    this.photos = [];
		
    for (var i = 0; i < yarnData.links.length && i < 5; i++) {
			
	    var newPhoto = new ImageSurface({
	      size: [this.options.photoSize[0], this.options.photoSize[1]],
	      content: yarnData.links[i],
				classes: ['FeedEntryPhoto']
	    });
			
      this.photos.push(newPhoto);
			
			if (i < yarnData.links.length) {
		    var padding = new Surface({
		      size: [this.options.photoPadding, this.options.photoSize[1]]
		    });
				
				this.photos.push(padding);
				padding.pipe(this._eventOutput);
			}
			
			var photoModifier = new Modifier({
				align: [i * (this.options.photoSize[0] + this.options.photoPadding) / window.innerWidth , 0.9],
				origin: [0, 1]
			});
			
			this.rootNode.add(photoModifier).add(newPhoto);
			
			if (i === yarnData.links.length - 1 && i < 4) {
		    var addPhotoButton = new Surface({
		      size: [this.options.photoSize[0], this.options.photoSize[1]],
		      content: '+',
					classes: ['FeedEntryPhoto'],
					properties: {
						textSize: 30 + 'px',
						backgroundColor: '#CCC',
						textAlign: 'center',
						lineHeight: this.options.photoSize[1] + 'px'
					}
		    });
				
				var addPhotoButtonModifier = new Modifier({
					align: [(i+1) * (this.options.photoSize[0] + this.options.photoPadding) / window.innerWidth , 0.9],
					origin: [0, 1]
				});
				
				this.rootNode.add(addPhotoButtonModifier).add(addPhotoButton);
			}

			newPhoto.pipe(this._eventOutput);
    }
  }
	
  // function _createPhotos(yarnData) {
  //   this.photos = [];
  //   this.photoRow = new Scrollview({
  //     direction: 0
  //   });
  //
  //   for (var i = 0; i < yarnData.links.length; i++) {
  // 			this.photoCount++;
  //
  // 	    var newPhoto = new ImageSurface({
  // 	      size: [this.options.photoSize[0], this.options.photoSize[1]],
  // 	      content: yarnData.links[i],
  // 				classes: ['FeedEntryPhoto']
  // 	    });
  //
  //     this.photos.push(newPhoto);
  //
  // 			if (i < yarnData.links.length - 1) {
  // 		    var padding = new Surface({
  // 		      size: [this.options.photoPadding, this.options.photoSize[1]]
  // 		    });
  //
  // 				this.photos.push(padding);
  // 				padding.pipe(this._eventOutput);
  // 			}
  //
  // 			// pipe photo surface to container view
  // 			newPhoto.pipe(this._eventOutput);
  // 			newPhoto.pipe(this.photoRow);
  //   }
  //
  // 		var photoRowModifier = new Modifier({
  // 			size: [undefined, this.options.photoSize[1]],
  // 			align: [0, 0.9],
  // 			origin: [0, 1]
  // 		});
  //
  //   this.photoRow.sequenceFrom(this.photos);
  // 		this.photoRow.pipe(this._eventOutput);
  //
  //   this.rootNode.add(photoRowModifier).add(this.photoRow);
  // }
	
  function _createDividers() {
    this.divider = new Surface({
			size: [undefined, this.options.dividerHeight],
			classes: ['FeedEntryDivider']
    });
		
		var dividerModifier = new Modifier({
			align: [0,1],
			origin: [0,1]
		});
		
    this.rootNode.add(dividerModifier).add(this.divider);

  }

	function _setListeners(yarnData) {
		// this.headerGrid.pipe(this._eventOutput);
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

