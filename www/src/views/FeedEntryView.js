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
  var Transform = require('famous/core/Transform');
	

  function FeedEntryView(options, yarnData){
    View.apply(this, arguments);

		this.photoCount = 0;

    _createRootNode.call(this);
		_createBackground.call(this, yarnData);
    _createPhotos.call(this, yarnData);
    _createHeaders.call(this, yarnData);
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
  };

  // create root modifier node
  function _createRootNode() {
    this.rootModifier = new Modifier({
      transform: Transform.translate(0,0,1),
			size: [this.options.entrySize[0], this.options.entrySize[1]],
      align: [0, 0],
      origin: [0, 0]
    });

    this.rootNode = this.add(this.rootModifier);
  }
	
  function _createBackground(yarnData) {
    this.background = new Surface({
      content: yarnData.caption,
			size: [this.options.entrySize[0], this.options.entrySize[1]],
			classes: ['FeedEntryBackground'],
      properties: {
        backgroundColor: '#DDD',
      }
    });
		
    this.rootNode.add(this.background);

  }
	
  function _createHeaders(yarnData) {
  
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
      transform: Transform.translate(-3,3,2),
			align: [1,0],
			origin: [1,0]
		});
		
		this.rootNode.add(entryButtonModifier).add(this.entryButton);
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
        transform: Transform.translate(0,0,2),
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
          transform: Transform.translate(0,0,2),
					align: [(i+1) * (this.options.photoSize[0] + this.options.photoPadding) / window.innerWidth , 0.9],
					origin: [0, 1]
				});
				
				this.rootNode.add(addPhotoButtonModifier).add(addPhotoButton);
			}

			newPhoto.pipe(this._eventOutput);
    }
  }
	

	function _setListeners(yarnData) {
		this.entryButton.pipe(this._eventOutput);
		this.background.pipe(this._eventOutput);
		
		
    this.entryButton.on('click', function(){
			console.log(this.options.eventTarget);
			console.log('clicked');
      this.entryButton.emit('GoAddToYarn', yarnData);
    }.bind(this));
	}

  module.exports = FeedEntryView;
});

