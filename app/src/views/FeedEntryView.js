'use strict';

// import famo.us dependencies
var View = require('famous/core/View');
var Surface = require('famous/core/Surface');
var Modifier = require('famous/core/Modifier');
var ImageSurface = require('famous/surfaces/ImageSurface');
var Transform = require('famous/core/Transform');

// FeedEntryView constructor
function FeedEntryView(options, yarnData){
  View.apply(this, arguments);

  // initialize class variables
  this.photoCount = 0;

  // adding elements
  _createRootNode.call(this);
  _createBackground.call(this, yarnData);
  _createHeaders.call(this, yarnData);
  _createPhotos.call(this, yarnData);
  _setListeners.call(this, yarnData);
}

// set defaults
FeedEntryView.prototype = Object.create(View.prototype);
FeedEntryView.prototype.constructor = FeedEntryView;
FeedEntryView.DEFAULT_OPTIONS = {
  entrySize: [undefined, 125],
  defaultCaption: 'This is the default caption',
  captionSize: [undefined, 25],
  photosToShow: 5,
  photoSize: [52, 70],
  textAlign: 'center',
  entryButtonSize: [82, 25],
  dividerHeight: 1,
  photoPadding: 10,
  showNum: 4,
};

// create root modifier
function _createRootNode() {
  this.rootModifier = new Modifier({
    transform: Transform.translate(0,0,1),
    size: [this.options.entrySize[0], this.options.entrySize[1]],
    align: [0, 0],
    origin: [0, 0]
  });

  this.rootNode = this.add(this.rootModifier);
}

// create background
function _createBackground(yarnData) {
  this.background = new Surface({
    content: yarnData.caption,
    size: [this.options.entrySize[0], this.options.entrySize[1]],
    classes: ['FeedEntryBackground']
  });

  this.rootNode.add(this.background);
}

// create header
function _createHeaders(yarnData) {
  this.yarnDetailButton = new Surface({
    size: [this.options.entryButtonSize[0], this.options.entryButtonSize[1]],
    content: yarnData.links.length + ' pics ' + '\u2794',
    properties: {
      backgroundColor: '#FF6138',
      lineHeight: this.options.entryButtonSize[1] + 'px',
      textAlign: this.options.textAlign,
      borderRadius: '5px',
      cursor: 'pointer',
      font: '16px Georgia, sans-serif'
    }
  });

  var yarnDetailButtonModifier = new Modifier({
    transform: Transform.translate(-3,3,2),
    align: [1,0.03],
    origin: [1,0]
  });

  this.rootNode.add(yarnDetailButtonModifier).add(this.yarnDetailButton);
}

// create photos display
function _createPhotos(yarnData) {
  this.photos = [];

  // display number of photos and addPhotoButton
  for (var i = 0; i <= yarnData.links.length && i <= this.options.showNum; i++) {
    if (i === yarnData.links.length || i === this.options.showNum) {
      // instantiate addPhotoButton elem
      var elem = new Surface({
        size: [this.options.photoSize[0], this.options.photoSize[1]],
        content: '+',
        classes: ['photoEntry', 'FeedEntryAddPhotoButton'],
        properties: {
          lineHeight: this.options.photoSize[1] + 'px',
          border: '1px dashed gray',
          'margin-left': '5px'
        }
      });
      this.addPhotoButton = elem;
    } else {
      // instantiate photo elem
      var elem = new ImageSurface({
        size: [this.options.photoSize[0], this.options.photoSize[1]],
        content: yarnData.links[i]+'t',
        classes: ['photoEntry'],
        properties: {
          'pointer-events': 'none',
          'margin-left': '5px'
        },
      });
    }

    var elemModifier = new Modifier({
      transform: Transform.translate(0,0,2),
      align: [i * (this.options.photoSize[0] + this.options.photoPadding) / window.innerWidth , 0.9],
      origin: [0, 1]
    });

    this.rootNode.add(elemModifier).add(elem);
  }
}

// set listeners
function _setListeners(yarnData) {
  // associate click events to display actions
  this.yarnDetailButton.on('click', function() {
    this._eventOutput.emit('showYarnDetail', yarnData);
  }.bind(this));
  this.addPhotoButton.on('click', function() {
    this._eventOutput.emit('showAddToYarn', yarnData);
  }.bind(this));

  // bubble up sync events for scrolling
  this.yarnDetailButton.pipe(this._eventOutput);
  this.addPhotoButton.pipe(this._eventOutput);
  this.background.pipe(this._eventOutput);
}

module.exports = FeedEntryView;
