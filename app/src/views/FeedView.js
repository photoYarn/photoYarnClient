'use strict';

// import famo.us dependencies
var View = require('famous/core/View');
var Surface = require('famous/core/Surface');
var Modifier = require('famous/core/Modifier');
var Transform  = require('famous/core/Transform');
var Scrollview = require('famous/views/Scrollview');
var ViewSequence = require('famous/core/ViewSequence');

var serverRequests = require('../services/serverRequests.js');

var GenericSync = require('famous/inputs/GenericSync');
var Engine = require('famous/core/Engine');

// import views
var FeedEntryView = require('./FeedEntryView');

// initialize class variables
var photoCache = {};
var yarnsLoaded = 0;

// FeedView constructor
function FeedView(){
  View.apply(this, arguments);
  
  this.feedHeight = 0;
  this.scrollHeight = 0;
  this.maxScroll = 0;
  this.loadingPictures = false;
  this.doneLoading = false;
  
  _createRootNode.call(this);
  _createBackground.call(this);
  _setListeners.call(this);
}

// set defaults
FeedView.prototype = Object.create(View.prototype);
FeedView.prototype.constructor = FeedView;
FeedView.DEFAULT_OPTIONS = {
  message: 'Default message',
  entryCount: 4,
  entryHeight: 175,
  buttonPanelHeight: 40,
  numSortButtons: 3
};

function _createBackground() {
  this.background = new Surface({
    size: [,],
    classes: ['FeedViewBG']
  });
  
  var bgMod = new Modifier({
    transform: Transform.translate(0,0,-15)
  });
  
  this.rootNode.add(bgMod).add(this.background);

}

// create root modifier node
function _createRootNode() {
  this.rootModifier = new Modifier({
    align: [0, this.options.buttonPanelHeight / (window.innerHeight - this.options.headerSize - this.options.footerSize)],
    origin: [0, 0]
  });

  this.rootNode = this.add(this.rootModifier);
}

function _createButtonPanel() {
  // network button
  this.networkButton = new Surface({
    size: [window.innerWidth / this.options.numSortButtons, this.options.buttonPanelHeight],
    content: "Network",
    classes: ['FeedViewSortButton'],
    properties: {
      lineHeight: this.options.buttonPanelHeight + 'px'
    }
  });
  
  var networkButtonModifier = new Modifier({
    align: [0, 0],
    origin: [0, 0]
  });
  
  this.add(networkButtonModifier).add(this.networkButton);
  
  // popular button
  this.popularButton = new Surface({
    size: [window.innerWidth / this.options.numSortButtons, this.options.buttonPanelHeight],
    content: "Popular",
    classes: ['FeedViewSortButton'],
    properties: {
      lineHeight: this.options.buttonPanelHeight + 'px'
    }
  });

  var popularButtonModifier = new Modifier({
    align: [0.5, 0],
    origin: [0.5, 0]
  });
  
  this.add(popularButtonModifier).add(this.popularButton);
  
  // new button
  this.newButton = new Surface({
    size: [window.innerWidth / this.options.numSortButtons, this.options.buttonPanelHeight],
    content: "New",
    classes: ['FeedViewSortButton'],
    properties: {
      lineHeight: this.options.buttonPanelHeight + 'px'
    }
  });
  
  var newButtonModifier = new Modifier({
    align: [1, 0],
    origin: [1, 0]
  });
  
  this.add(newButtonModifier).add(this.newButton);
  
}

function _setListeners() {
  this._eventInput.on('refreshFeed', function(data) {
    this.createFeedEntriesFromServer(data);
  }.bind(this));
}

FeedView.prototype.createFeedEntriesFromServer = function(data) {
  console.log('create feed entries called with ', data);

  if (data === undefined) {
    console.log('data is undefined');
    return;
  }
  this.feed = this.feed || new Scrollview({
    clipSize: (window.innerHeight - this.options.headerSize - this.options.footerSize - this.options.buttonPanelHeight),
    direction: 1,
    margin: 10000 // without this some entries would stop rendering on a hard scroll (fix from https://github.com/Famous/views/issues/11)
  });

  this.entries = this.entries || new ViewSequence();
  if (yarnsLoaded === 0) this.feed.sequenceFrom(this.entries);
  
  this.sync = new GenericSync(['scroll', 'touch'], {
    direction: GenericSync.DIRECTION_Y
  });

  for (var i = 0; i < data.length; i++) {
    var newEntryView = new FeedEntryView({eventTarget: this.options.eventTarget}, data[i]);
    newEntryView.pipe(this.feed);
    
    this.feedHeight += this.options.entryHeight;
    
    newEntryView.pipe(this._eventOutput); 
    photoCache[data[i]._id] = newEntryView;
    this.entries.push(newEntryView);
    yarnsLoaded++;
  
    newEntryView.pipe(this.sync);
  }
  
  this.maxScroll = this.feedHeight - 
                    window.innerHeight - 
                    this.options.headerSize - 
                    this.options.footerSize - 
                    this.options.buttonPanelHeight;

  this.sync.on('update', function (data) {
    // upon scroll update scrollHeight 
    this.scrollHeight -= data.delta;

    // give scrollheight a floor and ceiling
    if (this.scrollHeight < 0) this.scrollHeight = 0;
    if (this.scrollHeight > this.maxScroll) this.scrollHeight = this.maxScroll;

    // if we've scrolled halfway down the loaded feeds, load more yarns
    // loadingPictures is set to true in serverRequests at the start
    //  of the GET request and false upon success
    if (this.scrollHeight > this.maxScroll / 2 && 
        this.loadingPictures === false && 
        this.doneLoading === false) {
      serverRequests.getData(this.createFeedEntriesFromServer, this);      
    }
  }.bind(this));

  var feedModifier = new Modifier({
    transform: Transform.translate(0, 0, -10)
  });
  
  this.rootNode.add(feedModifier).add(this.feed);
}

module.exports = FeedView;
