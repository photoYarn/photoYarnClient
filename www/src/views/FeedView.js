define(function(require, exports, module){
  'use strict';
  var View = require('famous/core/View');
  var Modifier = require('famous/core/Modifier');
  var ScrollContainer = require('famous/views/ScrollContainer');

  // TODO remove debugging code
  var ImageSurface = require('famous/surfaces/ImageSurface');

  function FeedView(){
    View.apply(this, arguments);

    _createRootNode.call(this);
    _createYarns.call(this);
  }

  FeedView.prototype = Object.create(View.prototype);
  FeedView.prototype.constructor = FeedView;
  FeedView.DEFAULT_OPTIONS = {
    message: 'Default message'
  };

  // create root modifier node
  function _createRootNode() {
    this.rootModifier = new Modifier({
      align: [0.5, 0.5],
      origin: [0.5, 0.5],
    });

    this.rootNode = this.add(this.rootModifier);
  };

  function _createYarns() {
    this.yarns = [];

    for (var i = 0; i < 10; i++) {
      var logo = new ImageSurface({
        size: [100, 100],
        content: 'http://www.saatchistore.com/217-438-thickbox/pretty-polaroid-notes.jpg',
        classes: ['double-sided'],
        transform: function() {
            return Transform.rotateY(0.002 * (Date.now() - initialTime));
        }
      });
      this.yarns.push(logo);
    }

    var yarnRow = new ScrollContainer();
    yarnRow.sequenceFrom(this.yarns);

    this.rootNode.add(yarnRow);
  }
  
  module.exports = FeedView;
});
