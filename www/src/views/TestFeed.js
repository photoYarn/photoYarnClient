define(function(require, exports, module){
  'use strict';
  var Scrollview = require('famous/views/Scrollview');
  var ViewSequence = require('famous/core/ViewSequence');

  var serverRequests;


  var ImageSurface = require('famous/surfaces/ImageSurface');


  function TestFeed(){
    Scrollview.apply(this, arguments);
    console.log('Trying to make a test feed');
    serverRequests = this.options.serverRequests;
    console.log(serverRequests);
    // _addImage.call(this);
    _createFeed.call(this);
    this._getFeeds.call(this);
  }

  TestFeed.prototype = Object.create(Scrollview.prototype);
  TestFeed.prototype.constructor = TestFeed;
  
  TestFeed.DEFAULT_OPTIONS = {
    origin: [0,0],
    align: [0,0],
  };

  var testImage = new ImageSurface({
    content: 'http://37.media.tumblr.com/35e8d0682251fa96580100ea6a182e13/tumblr_mst9derOy01re0m3eo1_r12_500.gif',
    size: [50,50],
    align: [0.5,0],
    origin: [0.5,0]
  });

  var entries = [];
  entries.push(testImage);

  TestFeed.prototype._getFeeds = function() {
    console.log('Get Feeds Called!');
    $.ajax({
      type: 'GET',
      url: 'http://photoyarn.azurewebsites.net/getAllYarns',
      success: function (data) {
        for(var i = 0; i < data.length; i++){
          var cur = data[i];
          console.log(cur);
          var exImage = new ImageSurface({
            content: data[i].links[0],
            size: [50,50]
          });
          exImage.pipe(this);
          entries.push(exImage);
        }
      }.bind(this),
      error: function (error) {
        console.log("error", error);
      }
    });
  };

  function _createFeed(){
    this.sequenceFrom(entries);
  }

  module.exports = TestFeed;
});
