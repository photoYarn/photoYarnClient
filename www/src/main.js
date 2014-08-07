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
    // TODO need to handle button click on individual feed to add to yarn
    eventTarget: masterController.eventInput
  });
  
  mainContext.add(layout);

});
