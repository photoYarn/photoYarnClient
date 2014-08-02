define(function(require, exports, module) {
  'use strict';
  var Surface = require('famous/core/Surface');
  function CustomButton(name, targetArray, targetLayout, targetRC, targetView){
    var surface = new Surface({
      content: name,
      properties: {
        backgroundColor: 'hsl(' + (targetArray.length * 360 / 3) + ', 100%, 50%)',
        lineHeight: targetLayout.options.footerSize + 'px',
        color: 'white',
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