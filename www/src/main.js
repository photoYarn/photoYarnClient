define(function(require, exports, module) {
  'use strict';

  // import Famo.us dependencies
  var Engine = require('famous/core/Engine');

  // import layout
  var CustomLayout = require('customComponents/CustomLayout');
  var serverReqs = require('services/serverRequests');


  // create display context
  var mainContext = Engine.createContext();

  // create Layout
  var layout = new CustomLayout({
    headerSize: 75,
    footerSize: 50,
  });
  
  // attach layout to display context
  mainContext.add(layout);
});
