define(function(require, exports, module) {
  'use strict';
  var Surface = require('famous/core/Surface');
  function CustomButton(name, targetArray, targetLayout, targetRC, targetView){
    var surface = new Surface({
      content: name,
      classes: ['customButton'],
      properties: {
        lineHeight: targetLayout.options.footerSize + 'px',
        textAlign: 'center'
      }
    });

    surface.on('click', function(){
      targetRC.hide();
      targetRC.show(targetView);
    });
    targetArray.push(surface);
  }

  module.exports = CustomButton;
});