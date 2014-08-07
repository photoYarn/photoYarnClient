define(function(require, exports, module){
  'use strict';
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
	var Transform  = require('famous/core/Transform');
  var ScrollContainer = require('famous/views/ScrollContainer');
  var Scrollview = require("famous/views/Scrollview");

  var ImageSurface = require('famous/surfaces/ImageSurface');

	var FeedEntryView = require('views/FeedEntryView');

  var tempCache = {};

  function FeedView(){
    View.apply(this, arguments);
		
		this._getFeeds();
		
    _createRootNode.call(this);
		_createBackground.call(this);
		console.log(this.options)
    // _createFeedEntries.call(this);
  }

  FeedView.prototype = Object.create(View.prototype);
  FeedView.prototype.constructor = FeedView;
  
	FeedView.DEFAULT_OPTIONS = {
    message: 'Default message',
		entryCount: 4,
		entryHeight: 175
  };
	
  FeedView.prototype.updateFeeds = function(){
    console.log('Updating Feed');
   $.ajax({
      type: 'GET',
      url: 'http://photoyarn.azurewebsites.net/getAllYarns',
      success: function (data) {
        for (var i = 0; i < data.length; i++) {
          var index = tempCache[data[i]._id];
          console.log(i, 'index', index);
          console.log(i, 'links length', data[i].links.length);
          if(index){
            console.log(i, 'Entry photoCount', this.entries[index].photoCount);
          }
          if(tempCache[data[i]._id] === undefined){
            console.log('New item found!');
            console.log(tempCache);
            console.log(data[i]);
            //Need to add data[i] to sequence now!
            var newerEntryView = new FeedEntryView({eventTarget: this.options.eventTarget}, data[i]);
            tempCache[data[i]._id] = this.entries.length;
            newerEntryView.pipe(this.feed);
            this.entries.push(newerEntryView);
          }
          else if(index && data[i].links.length !== this.entries[index].photoCount){
            console.log('A feed update happened!!!');
            var newerEntryView = new FeedEntryView({eventTarget: this.options.eventTarget}, data[i]);
            newerEntryView.pipe(this.feed);
            this.entries[index] = newerEntryView;
            console.log(this.entries[index]);
          }
        } 
        this.feed.sequenceFrom(this.entries);
      }.bind(this),
      error: function (error) {
        console.log("error", error);
      }
    });
  };

	FeedView.prototype._getFeeds = function() {
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
		
			//     $.ajax({
			// type: 'POST',
			//     	url: 'http://photoyarn.azurewebsites.net/photo',
			// data: {
			// 	yarnId: "53e15acbc7e187a412eee8ac",
			// 	link:
			// },
			// success: function (data) {
			// 	console.log(data);
			// },
			// error: function (error) {
			// 	console.log("error", error);
			// }
			//     });
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

  // function _createFeedEntries() {
  //   this.feed = new Scrollview({
		// 	direction: 1,
  //   	margin: 10000 // without this some entries would stop rendering on a hard scroll (fix from https://github.com/Famous/views/issues/11)
  //   });
		// this.entries = [];

  //   this.feed.sequenceFrom(this.entries);		

		// for (var i = 0; i < this.options.entryCount; i++) {
		// 	var newEntryView = new FeedEntryView(this.data[i]);

		// 	newEntryView.pipe(feed);
		// 	this.entries.push(newEntryView);
		// }
		
		// var feedModifier = new Modifier({
		// 	transform: Transform.translate(0, 0, -10)
		// });
		
		// this.rootNode.add(feedModifier).add(feed);
  // }
	
  function _createFeedEntriesFromServer(data) {
    this.feed = this.feed || new Scrollview({
			direction: 1,
    	margin: 10000 // without this some entries would stop rendering on a hard scroll (fix from https://github.com/Famous/views/issues/11)
    });

		this.entries = [];

    this.feed.sequenceFrom(this.entries);		

		for (var i = 0; i < data.length; i++) {
			var newEntryView = new FeedEntryView({eventTarget: this.options.eventTarget}, data[i]);
      tempCache[data[i]._id] = this.entries.length;
			newEntryView.pipe(this.feed);
			this.entries.push(newEntryView);
		}
		
		var feedModifier = new Modifier({
			transform: Transform.translate(0, 0, -10)
		});
		
		this.rootNode.add(feedModifier).add(this.feed);
  }
  
  module.exports = FeedView;
});
