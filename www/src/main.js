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
  var YarnView = require('views/YarnView');

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
  renderController.show(yarnView);

  var feedView = new FeedView({
    message: 'custom message'
  });

  var newYarnView = new NewYarnView({
    blah: 'custom blah'
  });

  var yarnView = new YarnView({
    message: 'Sup Dude'
  });

  //Layout Footer
  var buttons = [];
  var feedViewButton = function(){
    var feedViewButtonSurface = new Surface({
      content: 'FeedView',
      size: [undefined, undefined],
      properties: {
        backgroundColor: 'hsl(' + (buttons.length * 360 / 3) + ', 100%, 50%)',
        lineHeight: layout.options.footerSize + 'px',
        color: 'black',
        textAlign: 'center'
      }
    });

    feedViewButtonSurface.on('click', function(){   
      renderController.hide(yarnView); 
      renderController.hide(newYarnView);
      renderController.show(feedView);
    }.bind(feedViewButtonSurface)); 

    buttons.push(feedViewButtonSurface);
  };

  var newYarnViewButton = function(){
    var newYarnViewButtonSurface = new Surface({
      content: 'newYarnView',
      size: [undefined, undefined],
      properties: {
        backgroundColor: 'hsl(' + (buttons.length * 360 / 3) + ', 100%, 50%)',
        lineHeight: layout.options.footerSize + 'px',
        color: 'black',
        textAlign: 'center'
      }
    });

    newYarnViewButtonSurface.on('click', function(){
      renderController.hide(feedView);
      renderController.hide(yarnView);
      renderController.show(newYarnView);
    }.bind(newYarnViewButtonSurface)); 

    buttons.push(newYarnViewButtonSurface);
  };

  var yarnViewButton = function(){
    var yarnViewButtonSurface = new Surface({
      content: 'yarnView',
      size: [undefined, undefined],
      properties: {
        backgroundColor: 'hsl(' + (buttons.length * 360 / 3) + ', 100%, 50%)',
        lineHeight: layout.options.footerSize + 'px',
        color: 'black',
        textAlign: 'center'
      }
    });

    yarnViewButtonSurface.on('click', function(){
      renderController.hide(newYarnView);
      renderController.hide(feedView);
      renderController.show(yarnView);
    }.bind(yarnViewButtonSurface)); 

    buttons.push(yarnViewButtonSurface);
  };

  feedViewButton();
  newYarnViewButton();
  yarnViewButton();

  var grid = new GridLayout({
    dimensions: [3,1]
  });
  
  grid.sequenceFrom(buttons);

  layout.footer.add(grid);

  mainContext.add(layout);

});
