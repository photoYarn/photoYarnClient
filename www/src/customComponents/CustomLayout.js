define(function(require, exports, module) {
  // import dependencies
  'use strict';
  var Engine = require('famous/core/Engine');
  var Modifier = require('famous/core/Modifier');
  var ImageSurface = require('famous/surfaces/ImageSurface');
  var Surface = require('famous/core/Surface');
  var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
  var GridLayout = require('famous/views/GridLayout');
  var mainContext = Engine.createContext();
  var RenderController = require('famous/views/RenderController');

  //custom views
  var NewYarnView = require('views/NewYarnView');
  var FeedView = require('views/FeedView');
  var YarnView = require('views/YarnView');

  //custom tools
  var CustomButton = require('customWidgets/CustomButton');
  var CustomController = require('customWidgets/CustomController');

  //Creating Layout
  var layout = new HeaderFooterLayout({
    headerSize: 75,
    footerSize: 50
  });

  //master controller event handler that keeps track of state
  

  var masterController = new CustomController();
  masterController.eventInput.on('FeedClick', function(){
    console.log('hi Feed');
    renderController.show(feedView);
  });
  masterController.eventInput.on('New YarnClick', function(){
    console.log('hi New Yarn');
    renderController.show(newYarnView);
  });
  masterController.eventInput.on('YarnClick', function(){
    console.log('hi Yarn');
    renderController.show(yarnView);
  });


  //famo.us logo because famo.us is cool!
  var logo = new ImageSurface({
    size: [200, 200],
    content: 'http://img3.wikia.nocookie.net/__cb20130220230859/farmville2/images/a/aa/Super-Fine_Yarn_Ball.png',
  });


  var renderController = new RenderController();

  //Layout Header
  layout.header.add(new Surface({
    content: 'Photo Yarn',
    classes: ['customButton','medgreenBG'],
    properties: {
      lineHeight: layout.options.headerSize + 'px',
      textAlign: 'center'
    }
  }));

  //Layout Content
  var centerModifier = new Modifier({
    origin: [0.5, 0.5],
  });

  layout.content.add(centerModifier).add(renderController);
  renderController.show(yarnView);

  var feedView = new FeedView({
    message: 'custom feed view'
  });

  var newYarnView = new NewYarnView({
    message: 'custom new yarn view'
  });

  var yarnView = new YarnView({
    message: 'custom yarn view'
  });

  //Layout Footer
  var buttons = [];

  buttons.push(new CustomButton({
    name: 'Feed',
    classes: ['customButton', 'lightgreenBG'],
    target: feedView,
    eventTarget: masterController.eventInput
  }));

  buttons.push(new CustomButton({
    name: 'New Yarn',
    classes: ['customButton', 'lightgreenBG'],
    target: newYarnView,
    eventTarget: masterController.eventInput
  }));

  buttons.push(new CustomButton({
    name: 'Yarn',
    classes: ['customButton', 'lightgreenBG'],
    target: yarnView,
    eventTarget: masterController.eventInput
  }));

  var grid = new GridLayout({
    dimensions: [3,1]
  });
  
  grid.sequenceFrom(buttons);

  layout.footer.add(grid);

  mainContext.add(layout);

  renderController.show(logo);
});