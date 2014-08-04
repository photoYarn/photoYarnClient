define(function(require, exports, module) {
  'use strict';
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');

  function ProfileView(){
    View.apply(this, arguments);

		_createBackground.call(this);
  }

  ProfileView.prototype = Object.create(View.prototype);
  ProfileView.prototype.constructor = ProfileView;
  ProfileView.DEFAULT_OPTIONS = {
		
  };
	
	function _createBackground() {
		var background = new Surface({
			size: [200, 200],
			content: "Hello, I'm a profile",
			properties: {
				backgroundColor: '#999'
			}
		});
		
		var bgModifier = new Modifier({
			align: [0.5, 0.5],
			origin: [0.5, 0.5]
		});
		
		this.add(bgModifier).add(background);
	}

  module.exports = ProfileView;

});