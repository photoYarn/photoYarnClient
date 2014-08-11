'use strict';
// include styles
require('../css');

// import Famo.us dependencies
var Engine = require('famous/core/Engine');

// import layout
var CustomLayout = require('./customComponents/CustomLayout');
var serverRequests = require('./services/serverRequests');
serverRequests.getData();


// create display context
var mainContext = Engine.createContext();

// create Layout
var layout = new CustomLayout({
  headerSize: 75,
  footerSize: 50,
  serverRequests: serverRequests
});

// attach layout to display context
mainContext.add(layout);
