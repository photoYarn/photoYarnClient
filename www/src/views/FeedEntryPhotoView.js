define(function(require, exports, module){
  'use strict';
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  var ScrollContainer = require('famous/views/ScrollContainer');

  var ImageSurface = require('famous/surfaces/ImageSurface');

  function FeedEntryPhotoView(){
    View.apply(this, arguments);
		
		// eventually we may want to add a profile pic thumbnail in a feed entry photo view
    _createPhotos.call(this);
  }

  FeedEntryPhotoView.prototype = Object.create(View.prototype);
  FeedEntryPhotoView.prototype.constructor = FeedEntryPhotoView;
  FeedEntryPhotoView.DEFAULT_OPTIONS = {
		height: 200
  };

  function _createPhotos() {
    this.photos = [];

    for (var i = 0; i < 10; i++) {
      var dummyPhoto = new ImageSurface({
        size: [150, 125],
        content: 'http://www.saatchistore.com/217-438-thickbox/pretty-polaroid-notes.jpg',
        classes: ['double-sided'],
        transform: function() {
            return Transform.rotateY(0.002 * (Date.now() - initialTime));
        }
      });
      this.yarns.push(logo);
    }

    var yarnRow = new ScrollContainer();
    yarnRow.sequenceFrom(this.yarns);

    this.rootNode.add(yarnRow);
  }

  function _createCaption() {
    var caption = new Surface({
      size: [200, 100],
      content: 'crap',
      properties: {

      }
    });

    var captionModifier = new Modifier({
      align: [0.5, 0.5],
      origin: [0.5, 0.5],
    });

    this.rootNode.add(captionModifier).add(caption);
  }
  
  module.exports = FeedEntryPhotoView;
});
