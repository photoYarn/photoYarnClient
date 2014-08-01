define(function(require, exports, module){
  'use strict';
  var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
  var StateModifier = require('famous/modifiers/StateModifier');

  function MainView(){
    HeaderFooterLayout.apply(this, arguments);

    this.rootModifier = new StateModifier({
            size: [400, 450]
        });

    // saving a reference to the new node
    this.mainNode = this.add(this.rootModifier);

  }
  module.exports = MainView;
});