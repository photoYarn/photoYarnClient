define(function(require, exports, module){
  'use strict';
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  var ScrollContainer = require('famous/views/ScrollContainer');
	var ContainerSurface = require("famous/surfaces/ContainerSurface");

  var ImageSurface = require('famous/surfaces/ImageSurface');

  function FeedEntryPhotoView(){
    View.apply(this, arguments);
		
		this.container = new ContainerSurface();
		
		// eventually we may want to add a profile pic thumbnail in a feed entry photo view
		_createRootNode.call(this);
    _createPhoto.call(this);
  }

  FeedEntryPhotoView.prototype = Object.create(View.prototype);
  FeedEntryPhotoView.prototype.constructor = FeedEntryPhotoView;
	
  FeedEntryPhotoView.DEFAULT_OPTIONS = {};
	
  function _createRootNode() {
    this.rootModifier = new Modifier({
      align: [0, 0],
      origin: [0, 0]
    });

    this.rootNode = this.add(this.rootModifier);
  };

  function _createPhoto() {
    var dummyPhoto = new ImageSurface({
      size: [150, 125],
      content: 'http://www.saatchistore.com/217-438-thickbox/pretty-polaroid-notes.jpg',
      classes: ['double-sided'],
      transform: function() {
          return Transform.rotateY(0.002 * (Date.now() - initialTime));
      }
    });

    this.rootNode.add(dummyPhoto);
		this.container.add(dummyPhoto);
  };

  module.exports = FeedEntryPhotoView;
});
