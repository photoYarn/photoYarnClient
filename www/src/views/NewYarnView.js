define(function(require, exports, module) {
  'use strict';
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');

  function NewYarnView(){
    View.apply(this, arguments);

    //creates NewYarnView
    console.log('Sup Bros');

    _createSurface.call(this);
  }

  NewYarnView.prototype = Object.create(View.prototype);
  NewYarnView.prototype.constructor = NewYarnView;
  NewYarnView.DEFAULT_OPTIONS = {
    blah: 'default blah'
  };

  function _createSurface() {
    this.surface = new Surface({
      size: [200, 200],
      content: this.options.blah,
      properties: {
        backgroundColor: 'red',
        color: 'white',
      },
    });

    console.log(this.options.blah);
    this.add(this.surface);
  };
  
  module.exports = NewYarnView;
});