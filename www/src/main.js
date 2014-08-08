define(function(require, exports, module) {
  // import dependencies
  'use strict';
  var Engine = require('famous/core/Engine');
  var mainContext = Engine.createContext();

  //custom tools
  var CustomLayout = require('customComponents/CustomLayout');
  var serverReqs = require('services/serverReqs');


  //Creating Layout
  var layout = new CustomLayout({
    headerSize: 75,
    footerSize: 50,
    serverRequests: serverReqs
  });
  
  mainContext.add(layout);

});
