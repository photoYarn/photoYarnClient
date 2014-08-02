define(function(require, exports, module){
  'use strict';
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
	
  function FeedEntryCaptionView(caption){
    View.apply(this, arguments);
		
    _createRootNode.call(this);
    _createCaption.call(this, caption);
		// eventually we may want to add a subheading under the caption
		//  e.g. 'started by John Doe'
  }

  FeedEntryCaptionView.prototype = Object.create(View.prototype);
  FeedEntryCaptionView.prototype.constructor = FeedEntryCaptionView;
  FeedEntryCaptionView.DEFAULT_OPTIONS = {
  	align: [0, 0], 
		origin: [0, 0]
  };
	
	function _createCaption(caption) {
		var cap = new Surface({
			
		});
	}
  
  module.exports = FeedEntryCaptionView;
});
