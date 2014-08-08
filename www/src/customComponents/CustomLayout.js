define(function(require, exports, module) {
  // import dependencies
  'use strict';

  var Modifier = require('famous/core/Modifier');
  var ImageSurface = require('famous/surfaces/ImageSurface');
  var Surface = require('famous/core/Surface');
  var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
  var GridLayout = require('famous/views/GridLayout');
  var RenderController = require('famous/views/RenderController');

  // RenderController views
  var NewYarnView = require('views/NewYarnView');
  var FeedView = require('views/FeedView');
	var ProfileView = require('views/ProfileView');
  var YarnView = require('views/YarnView');
  var AddToYarnView = require('views/AddToYarnView');
  var TestFeed = require('views/TestFeed');
  
  //custom tools
  var CustomButton = require('customComponents/CustomButton');

  //Creating Layout
  function CustomLayout(){
    HeaderFooterLayout.apply(this, arguments);
    _createContent.call(this);
    _createHeader.call(this);
    _createFooter.call(this);
    _setListeners.call(this);
  }

  CustomLayout.prototype = Object.create(HeaderFooterLayout.prototype);
  CustomLayout.prototype.constructor = CustomLayout;
  CustomLayout.DEFAULT_OPTIONS = {
    align: [0,0],
    headerSize: 75,
    footerSize: 50,
    origin: [0, 0],
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
      align: [0.5, 0.5]
    });

   //  this.feedView = new FeedView({
   //    message: 'custom feed view',
   //   });

    this.newYarnView = new NewYarnView({
      message: 'custom new yarn view'
    });
		
    this.profileView = new ProfileView({
      message: 'custom profile view'
    });

    this.yarnView = new YarnView({});

    this.addToYarnView = new AddToYarnView({});

    this.testFeed = new TestFeed({
      direction: 1,
      margin: 10000,
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
    // initialize vars
    this.buttons = [];
    this.buttonRefs = {};

    // create buttons
    this.buttonRefs.viewFeed = new CustomButton({
      name: 'Feed',
      classes: ['customButton', 'lightgreenBG'],
    });
    this.buttonRefs.createYarn = new CustomButton({
      name: 'New Yarn',
      classes: ['customButton', 'lightgreenBG'],
    });
    this.buttonRefs.viewProfile = new CustomButton({
      name: 'Profile',
      classes: ['customButton', 'lightgreenBG'],
    });

    // create grid layout for buttons
    this.buttons = [
      this.buttonRefs.viewFeed,
      this.buttonRefs.createYarn,
      this.buttonRefs.viewProfile,
    ];
    this.buttonGrid = new GridLayout({
      dimensions: [this.buttons.length, 1]
    });
    this.buttonGrid.sequenceFrom(this.buttons);

    // add gridded buttons to layout
    this.footer.add(this.buttonGrid);
  }

  function _setListeners() {
    // associate nav button events to corresponding content views
    this.buttonRefs.viewFeed.on('click', function() {
      console.log('hi Feed');
      this.renderController.show(this.testFeed);
      // TODO reintegrate update event when testFeed switched to main feed
      // this.feedView.trigger('update');
    }.bind(this));

    this.buttonRefs.createYarn.on('click', function() {
      console.log('hi New Yarn');
      this.renderController.show(this.newYarnView);
    }.bind(this));

    this.buttonRefs.viewProfile.on('click', function() {
      console.log('hi Profile');
      this.renderController.show(this.profileView);
    }.bind(this));
  }

  module.exports = CustomLayout;
});