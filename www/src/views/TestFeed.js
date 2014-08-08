define(function(require, exports, module){
  'use strict';
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  var Transform  = require('famous/core/Transform');
  var ScrollContainer = require('famous/views/ScrollContainer');
  var Scrollview = require('famous/views/Scrollview');
  var ViewSequence = require('famous/core/ViewSequence');

  var ImageSurface = require('famous/surfaces/ImageSurface');

  var FeedEntryView = require('views/FeedEntryView');

  var photoCache = {};


  function TestView(){
    View.apply(this, arguments);
    console.log(this.options);
  }

  TestView.prototype = Object.create(View.prototype);
  TestView.prototype.constructor = TestView;
  
  TestView.DEFAULT_OPTIONS = {
    message: 'Default message',
    entryCount: 4,
    entryHeight: 175
  };
  


  TestView.prototype.updateFeeds = function(){
    $.ajax({
      type: 'GET',
      url: 'http://photoyarn.azurewebsites.net/getAllYarns',
      success: function (data) {
        for(var i = 0; i < data.length; i++){
          console.log('Updating Feed!');
          var itemTarget = photoCache[data[i]._id];
          var targetNode = this.feed.getIndex(itemTarget);
          console.log(targetNode);
          if(itemTarget === undefined){
            console.log('NEW ITEM FOUND');
            var newEntryView = new FeedEntryView({eventTarget: this.options.eventTarget}, data[i]);
            newEntryView.pipe(this.feed);
            photoCache[data[i]._id] = newEntryView;
            this.entries.push(newEntryView);
          } else if(itemTarget.photoCount !== data[i].links.length){
            console.log('UPDATING ENTRY @ ', i);
            var location = i;
            var updatedEntryView = new FeedEntryView({eventTarget: this.options.eventTarget}, data[i]);
            updatedEntryView.pipe(this.feed);
            photoCache[data[i]._id] = updatedEntryView;
            var exiting = this.entries.splice(location, 1, updatedEntryView);
            console.log(exiting);
          }
        }
      }.bind(this),
      error: function (error) {
        console.log("error", error);
      }
    });
  };
  

  TestView.prototype._getFeeds = function() {
    console.log('Get Feeds Called!');
    $.ajax({
      type: 'GET',
      url: 'http://photoyarn.azurewebsites.net/getAllYarns',
      success: function (data) {
        _createFeedEntriesFromServer.call(this, data);
      }.bind(this),
      error: function (error) {
        console.log("error", error);
      }
    });
    
  };
  
  function _createBackground() {
    this.background = new Surface({
      size: [,],
      properties: {
        backgroundColor: '#BADA55',
      }
    });
    
    var bgMod = new Modifier({
      transform: Transform.translate(0,0,-15)
    });
    
    this.rootNode.add(bgMod).add(this.background);

  }

  // create root modifier node
  function _createRootNode() {
    this.rootModifier = new Modifier({
      align: [0, 0],
      origin: [0, 0]
      // transform: Transform.translate(0,0,-10)
    });

    this.rootNode = this.add(this.rootModifier);
  }
  
  function _createFeedEntriesFromServer(data) {
    this.feed = this.feed || new Scrollview({
      direction: 1,
      margin: 10000 // without this some entries would stop rendering on a hard scroll (fix from https://github.com/Famous/views/issues/11)
    });

    this.entries = new ViewSequence();

    this.feed.sequenceFrom(this.entries);   

    for (var i = 0; i < data.length; i++) {
      var newEntryView = new FeedEntryView({eventTarget: this.options.eventTarget}, data[i]);
      newEntryView.pipe(this.feed);
      photoCache[data[i]._id] = newEntryView;
      this.entries.push(newEntryView);
    }
    console.log(photoCache);
    
    var feedModifier = new Modifier({
      transform: Transform.translate(0, 0, -10)
    });
    
    this.rootNode.add(feedModifier).add(this.feed);
  }
  
  module.exports = TestFeedView;
});
