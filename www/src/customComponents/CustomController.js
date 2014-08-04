define(function(require, exports, module) {
  'use strict';
  var EventHandler = require('famous/core/EventHandler');
  function CustomController(){
    this.eventOutput = new EventHandler();
    this.eventInput = new EventHandler();
  }

  module.exports = CustomController;
});