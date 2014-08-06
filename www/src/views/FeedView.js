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

  function FeedView(){
    View.apply(this, arguments);
		
		_getFeeds.call(this);
		
    _createRootNode.call(this);
		_createBackground.call(this);
    // _createFeedEntries.call(this);
  }

  FeedView.prototype = Object.create(View.prototype);
  FeedView.prototype.constructor = FeedView;
  
	FeedView.DEFAULT_OPTIONS = {
    message: 'Default message',
		entryCount: 4,
		entryHeight: 175
  }
	
	function _getFeeds() {
		var that = this;
    $.ajax({
			type: 'GET',
    	url: 'http://photoyarn.azurewebsites.net/yarns',
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
	}
	
  function _createBackground() {
    this.background = new Surface({
			size: [,],
      properties: {
        backgroundColor: '#BADA55',
      }
    });
		
		var bgMod = new Modifier({
			transform: Transform.translate(0,0,-25)
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

  function _createFeedEntries() {
    var feed = new Scrollview({
			direction: 1,
    	margin: 10000 // without this some entries would stop rendering on a hard scroll (fix from https://github.com/Famous/views/issues/11)
    });
		this.entries = [];

    feed.sequenceFrom(this.entries);		

		for (var i = 0; i < this.options.entryCount; i++) {
			var newEntryView = new FeedEntryView(this.data[i]);

			newEntryView.pipe(feed);
			this.entries.push(newEntryView);
		}
		
		var feedModifier = new Modifier({
			transform: Transform.translate(0, 0, -10)
		});
		
		this.rootNode.add(feedModifier).add(feed);
  }
	
  function _createFeedEntriesFromServer(data) {
    var feed = new Scrollview({
			direction: 1,
    	margin: 10000 // without this some entries would stop rendering on a hard scroll (fix from https://github.com/Famous/views/issues/11)
    });
		this.entries = [];

    feed.sequenceFrom(this.entries);		

		for (var i = 0; i < data.length; i++) {
			var newEntryView = new FeedEntryView(data[i]);

			newEntryView.pipe(feed);
			this.entries.push(newEntryView);
		}
		
		var feedModifier = new Modifier({
			transform: Transform.translate(0, 0, -10)
		});
		
		this.rootNode.add(feedModifier).add(feed);
  }
  
  module.exports = FeedView;
});




//
// [{"caption":"i like kittens",
// "creatorId":1,"_id":"53e15acbc7e187a412eee8ac",
// "__v":0,
// "imgurIds":["http://static.tumblr.com/81b6d42b4064def5e9062d5f4410c820/betml74/Yl5ml0lia/tumblr_static_impress.jpg"]
// },
// {"caption":"i like kittens",
// "creatorId":1,
// "_id":"53e15b1ae1bb3b51144fd773",
// "__v":0,
// "imgurIds":["http://static.tumblr.com/81b6d42b4064def5e9062d5f4410c820/betml74/Yl5ml0lia/tumblr_static_impress.jpg"]
// },
// {"_id":"53e17d98b782f3880cf5d959",
// "__v" :0,
// "imgurIds":["http://www.davey.com/media/1001/home-tree.png?width=960&height=520&quality=80&mode=crop"]
// },
// {"__v":1,
// "_id":"53e17bcbb782f3880cf5d957",
// "imgurIds":["http://www.funchap.com/wp-content/uploads/2014/05/Cute-Dog-Wallpapers.jpg",
//            "http://www.davey.com/media/1001/home-tree.png?width=960&height=520&quality=80&mode=crop"]
// }]

