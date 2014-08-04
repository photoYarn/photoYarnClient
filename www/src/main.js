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

  masterController.eventInput.on('FeedClick', function(){
    console.log('hi Feed');
    layout.renderController.show(layout.feedView);
  });
  masterController.eventInput.on('New YarnClick', function(){
    console.log('hi New Yarn');
    layout.renderController.show(layout.newYarnView);
  });
  masterController.eventInput.on('ProfileClick', function(){
    console.log('hi Profile');
    layout.renderController.show(layout.profileView);
  });
  masterController.eventInput.on('YarnClick', function(){
    console.log('hi Yarn');
    layout.renderController.show(layout.yarnView);
  });

  mainContext.add(layout);

});
