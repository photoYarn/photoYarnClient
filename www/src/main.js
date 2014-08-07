define(function(require, exports, module) {
  // import dependencies
  'use strict';
  var Engine = require('famous/core/Engine');
  var mainContext = Engine.createContext();

  //custom tools
  var CustomController = require('customComponents/CustomController');
  var CustomLayout = require('customComponents/CustomLayout');

  //master controller event handler that keeps track of state
  var masterController = new CustomController();

  //Creating Layout
  var layout = new CustomLayout({
    headerSize: 75,
    footerSize: 50,
    eventTarget: masterController.eventInput
  });

  masterController.eventInput.on('GoFeed', function(){
    console.log('hi Feed');
    layout.feedView._getFeeds();
    layout.renderController.show(layout.feedView);
  });
  masterController.eventInput.on('GoNew Yarn', function(){
    console.log('hi New Yarn');
    layout.renderController.show(layout.newYarnView);
  });
  masterController.eventInput.on('GoProfile', function(){
    console.log('hi Profile');
    layout.renderController.show(layout.profileView);
  });
  masterController.eventInput.on('GoYarn', function(){
    console.log('hi Yarn');
    layout.renderController.show(layout.yarnView);
  });
  masterController.eventInput.on('GoAddToYarn', function(data){
    console.log('hi Add To Yarn');
		console.log("data passed into GoAddToYarn listener", data);
    layout.addToYarnView.yarnData = data;
    layout.renderController.show(layout.addToYarnView);
  });
  
  mainContext.add(layout);

});
