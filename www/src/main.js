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

  var RenderController = require('famous/views/RenderController');

  //Creating Layout
  var layout = new HeaderFooterLayout({
    headerSize: 50,
    footerSize: 50
  });

  var renderController = new RenderController();

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
    classes: ['double-sided'],
    transform: function() {
        return Transform.rotateY(0.002 * (Date.now() - initialTime));
    }
  });

  var centerModifier = new Modifier({
    origin: [0.5, 0.5],
  });

  layout.content.add(centerModifier).add(renderController);

  var state = 0;

  var testSurface1 = new Surface({
    content: 'test1'
  });

  var testSurface2 = new Surface({
    content: 'test2'
  });


  //Layout Footer
  var surfaces = [];
  for(var i = 0; i < 3; i++){
    var surface = new Surface({
      content: 'Button',
      size: [undefined, undefined],
      properties: {
        backgroundColor: 'hsl(' + (i * 360 / 3) + ', 100%, 50%)',
        lineHeight: layout.options.footerSize + 'px',
        color: 'black',
        textAlign: 'center'
      }
    });

    surface.on('click', function(){
      state++;
      state = state%3;
      if(state === 2){
        renderController.hide(testSurface2);
        renderController.show(testSurface1);
      } else if(state === 1){
        renderController.hide(logo);
        renderController.show(testSurface2);
      } else if(state === 0){
        renderController.hide(testSurface1);
        renderController.show(logo);
      }
      // renderController.show(testSurface2);
    }.bind(surface)); 

    surfaces.push(surface);
  }


  var grid = new GridLayout({
    dimensions: [3,1]
  });
  
  grid.sequenceFrom(surfaces);
 
  layout.footer.add(grid);

  mainContext.add(layout);

});
