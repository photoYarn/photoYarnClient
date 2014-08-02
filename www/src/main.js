define(function(require, exports, module) {
  // import dependencies
  'use strict';
  var Engine = require('famous/core/Engine');
  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var ImageSurface = require('famous/surfaces/ImageSurface');
  var Surface = require('famous/core/Surface');
  var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
  var GridLayout = require('famous/views/GridLayout');
  var mainContext = Engine.createContext();
  var RenderController = require('famous/views/RenderController');
  var View = require('famous/core/View');

  //custom views
  var NewYarnView = require('views/NewYarnView');
  var FeedView = require('views/FeedView');

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

  var initialTime = Date.now();

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
  renderController.show(logo);

  var feedView = new FeedView({
    message: 'custom message'
  });

  var newYarnView = new NewYarnView({
    blah: 'custom blah'
  });

  //Layout Footer
  var buttons = [];
  var createButton1 = function(){
    var button1 = new Surface({
      content: 'Button',
      size: [undefined, undefined],
      properties: {
        backgroundColor: 'hsl(' + (buttons.length * 360 / 3) + ', 100%, 50%)',
        lineHeight: layout.options.footerSize + 'px',
        color: 'black',
        textAlign: 'center'
      }
    });

    button1.on('click', function(){   
      renderController.hide(logo); 
      renderController.hide(newYarnView);
      renderController.show(feedView);
    }.bind(button1)); 

    buttons.push(button1);
  };

  var createButton2 = function(){
    var button2 = new Surface({
      content: 'Button',
      size: [undefined, undefined],
      properties: {
        backgroundColor: 'hsl(' + (buttons.length * 360 / 3) + ', 100%, 50%)',
        lineHeight: layout.options.footerSize + 'px',
        color: 'black',
        textAlign: 'center'
      }
    });

    button2.on('click', function(){
      renderController.hide(feedView);
      renderController.hide(logo);
      renderController.show(newYarnView);
    }.bind(button2)); 

    buttons.push(button2);
  };

  var createButton3 = function(){
    var button3 = new Surface({
      content: 'Button',
      size: [undefined, undefined],
      properties: {
        backgroundColor: 'hsl(' + (buttons.length * 360 / 3) + ', 100%, 50%)',
        lineHeight: layout.options.footerSize + 'px',
        color: 'black',
        textAlign: 'center'
      }
    });

    button3.on('click', function(){
      renderController.hide(newYarnView);
      renderController.hide(feedView);
      renderController.show(logo);
      // renderController.show(testSurface2);
    }.bind(button3)); 

    buttons.push(button3);
  };

  createButton1();
  createButton2();
  createButton3();

  var grid = new GridLayout({
    dimensions: [3,1]
  });
  
  grid.sequenceFrom(buttons);

  layout.footer.add(grid);

  mainContext.add(layout);

});
