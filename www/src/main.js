define(function(require, exports, module) {
  // import dependencies
  var Engine = require('famous/core/Engine');

  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');

  var ImageSurface = require('famous/surfaces/ImageSurface');
  var Surface = require('famous/core/Surface');

  var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
  var GridLayout = require('famous/views/GridLayout');

  var mainContext = Engine.createContext();
  var initialTime = Date.now();

  //Creating Layout
  var layout = new HeaderFooterLayout({
    headerSize: 50,
    footerSize: 50
  });


  //Layout Header
  layout.header.add(new Surface({
    content: 'Header',
    properties: {
      backgroundColor: 'green',
      lineHeight: layout.options.headerSize + 'px',
      textAlign: 'center'
    }
  }));


  //Layout Content
  var logo = new ImageSurface({
    size: [200, 200],
    content: 'http://code.famo.us/assets/famous_logo.svg',
    classes: ['double-sided']
  });

  var centerSpinModifier = new Modifier({
    origin: [0.5, 0.5],
    transform: function() {
        return Transform.rotateY(0.002 * (Date.now() - initialTime));
    }
  });

  layout.content.add(centerSpinModifier).add(logo);


  //Layout Footer
  layout.footer.add(new Surface({
    content: 'Footer',
    properties: {
      backgroundColor: 'blue',
      lineHeight: layout.options.footerSize + 'px',
      textAlign: 'center'
    }
  }));

  mainContext.add(layout);

});
