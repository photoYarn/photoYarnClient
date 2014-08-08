define(function(require, exports, module) {
  // import dependencies
  'use strict';
  var Engine = require('famous/core/Engine');
  var mainContext = Engine.createContext();

  //custom tools
  var CustomLayout = require('customComponents/CustomLayout');
  var serverRequests = require('services/serverRequests');
  serverRequests.getData();


  //Creating Layout
  var layout = new CustomLayout({
    headerSize: 75,
    footerSize: 50,
    serverRequests: serverRequests
  });
  
  mainContext.add(layout);

});
