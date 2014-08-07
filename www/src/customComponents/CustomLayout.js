define(function(require, exports, module) {
  // import dependencies
  'use strict';

  var Modifier = require('famous/core/Modifier');
  var ImageSurface = require('famous/surfaces/ImageSurface');
  var Surface = require('famous/core/Surface');
  var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
  var GridLayout = require('famous/views/GridLayout');
  var RenderController = require('famous/views/RenderController');

  //custom views
  var NewYarnView = require('views/NewYarnView');
  var FeedView = require('views/FeedView');
	var ProfileView = require('views/ProfileView');
  var YarnView = require('views/YarnView');
  var AddToYarnView = require('views/AddToYarnView');
  
  //custom tools
  var CustomButton = require('customComponents/CustomButton');

  //Creating Layout
  function CustomLayout(){
    HeaderFooterLayout.apply(this, arguments);
    _createContent.call(this);
    _createHeader.call(this);
    _createFooter.call(this);
  }

  CustomLayout.prototype = Object.create(HeaderFooterLayout.prototype);
  CustomLayout.prototype.constructor = CustomLayout;
  CustomLayout.DEFAULT_OPTIONS = {
    align: [0.5, 0,5],
    headerSize: 75,
    footerSize: 50,
    origin: [0.5, 0.5],
    eventTarget: null
  };

  //Layout Content
  function _createContent(){
    //famo.us logo because famo.us is cool!
    var logo = new ImageSurface({
      size: [200, 200],
      content: 'http://img3.wikia.nocookie.net/__cb20130220230859/farmville2/images/a/aa/Super-Fine_Yarn_Ball.png',
    });

    var centerModifier = new Modifier({
      origin: [0.5, 0.5],
    });
    this.feedView = new FeedView({
      message: 'custom feed view',
			eventTarget: this.options.eventTarget
     });

    this.newYarnView = new NewYarnView({
      message: 'custom new yarn view'
    });
		
    this.profileView = new ProfileView({
      message: 'custom profile view'
    });

    this.yarnView = new YarnView({
    });

    this.addToYarnView = new AddToYarnView({

    });
    
    this.renderController = new RenderController();
    this.content.add(centerModifier).add(this.renderController);
    this.renderController.show(logo);

  }
  
  //Layout Header
  function _createHeader(){
    this.header.add(new Surface({
      content: 'PhotoYarn',
      classes: ['customButton', 'medgreenBG', 'header'],
      properties: {
        lineHeight: this.options.headerSize + 'px',
        textAlign: 'center'
      }
    }));
  }


  //Layout Footer
  function _createFooter(){

    this.buttons = [];

    this.buttons.push(new CustomButton({
      name: 'Feed',
      classes: ['customButton', 'lightgreenBG'],
      eventTarget: this.options.eventTarget
    }));

    this.buttons.push(new CustomButton({
      name: 'New Yarn',
      classes: ['customButton', 'lightgreenBG'],
      eventTarget: this.options.eventTarget
    }));

    this.buttons.push(new CustomButton({
      name: 'Profile',
      classes: ['customButton', 'lightgreenBG'],
      eventTarget: this.options.eventTarget
    }));

    // this.buttons.push(new CustomButton({
    //   name: 'Yarn',
    //   classes: ['customButton', 'lightgreenBG'],
    //   eventTarget: this.options.eventTarget
    // }));

    this.buttons.push(new CustomButton({
      name: 'AddToYarn',
      classes: ['customButton', 'lightgreenBG'],
      eventTarget: this.options.eventTarget
    }));


    this.buttonGrid = new GridLayout({
      dimensions: [4,1]
    });
    
    this.buttonGrid.sequenceFrom(this.buttons);

    this.footer.add(this.buttonGrid);
  }


  module.exports = CustomLayout;
});