define(function(require, exports, module) {
  'use strict';

  // import famo.us dependencies
  var Modifier = require('famous/core/Modifier');
  var ImageSurface = require('famous/surfaces/ImageSurface');
  var Surface = require('famous/core/Surface');
  var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
  var GridLayout = require('famous/views/GridLayout');
  var RenderController = require('famous/views/RenderController');

  // import components/utilities
  var CustomButton = require('customComponents/CustomButton');
  var oauth = require('customComponents/oauth');

  // import views
  var NewYarnView = require('views/NewYarnView');
  var FeedView = require('views/FeedView');
  var ProfileView = require('views/ProfileView');
  var YarnView = require('views/YarnView');
  var AddToYarnView = require('views/AddToYarnView');

  // CustomLayout constructor
  function CustomLayout(){
    HeaderFooterLayout.apply(this, arguments);

    // adding elements
    _createContent.call(this);
    _createHeader.call(this);
    _createFooter.call(this);
    _setListeners.call(this);
  }

  // set defaults
  CustomLayout.prototype = Object.create(HeaderFooterLayout.prototype);
  CustomLayout.prototype.constructor = CustomLayout;
  CustomLayout.DEFAULT_OPTIONS = {
    origin: [0, 0],
    align: [0,0],
    headerSize: 75,
    footerSize: 50,
  };

  // create content component
  function _createContent(){

    // famo.us logo because famo.us is cool!
    this.logo = new ImageSurface({
      size: [200, 200],
      content: 'http://img3.wikia.nocookie.net/__cb20130220230859/farmville2/images/a/aa/Super-Fine_Yarn_Ball.png',
    });

    var centerModifier = new Modifier({
      origin: [0.5, 0.5],
      align: [0.5, 0.5]
    });

    // initialize content views
    this.feedView = new FeedView({
      message: 'custom feed view',
      serverRequests: this.options.serverRequests,
     });
    this.newYarnView = new NewYarnView({
      message: 'custom new yarn view',
      serverRequests: this.options.serverRequests
    });

    this.profileView = new ProfileView({
      message: 'custom profile view',
      serverRequests: this.options.serverRequests
    });
    this.yarnView = new YarnView({
      serverRequests: this.options.serverRequests
    });
    this.addToYarnView = new AddToYarnView({
      serverRequests: this.options.serverRequests
    });

    // initialize and attach RenderController to content display
    this.renderController = new RenderController();
    this.content.add(centerModifier).add(this.renderController);
    this.renderController.show(this.logo);
  }

  // create header component
  function _createHeader(){
    // add title bar to header display
    this.header.add(new Surface({
      content: 'PhotoYarn',
      classes: ['customButton', 'medgreenBG', 'header'],
      properties: {
        lineHeight: this.options.headerSize + 'px',
        textAlign: 'center'
      }
    }));
  }

  // create footer component
  function _createFooter(){
    // create buttons
    this.buttonRefs = {
      viewFeed: new CustomButton({
        name: 'Feed',
        classes: ['customButton', 'lightgreenBG'],
      }),
      createYarn: new CustomButton({
        name: 'New Yarn',
        classes: ['customButton', 'lightgreenBG'],
      }),
      viewProfile: new CustomButton({
        name: 'Profile',
        classes: ['customButton', 'lightgreenBG'],
      }),
      login: new CustomButton({
        name: 'Login',
        classes: ['customButton', 'lightgreenBG']
      }),
      yarnView: new CustomButton({
        name: 'YarnView',
        classes: ['customButton', 'lightgreenBG']
      })
    };

    // create grid layout for buttons
    this.buttons = [
      this.buttonRefs.viewFeed,
      this.buttonRefs.createYarn,
      this.buttonRefs.viewProfile,
      this.buttonRefs.login,
      this.buttonRefs.yarnView
    ];
    this.buttonGrid = new GridLayout({
      dimensions: [this.buttons.length, 1]
    });
    this.buttonGrid.sequenceFrom(this.buttons);

    // add gridded buttons to footer display
    this.footer.add(this.buttonGrid);
  }

  // set listeners for buttons in footer nav and in content views
  function _setListeners() {
    // associate click events to display actions
    this.buttonRefs.viewFeed.on('click', function() {
      this.feedView.createFeedEntriesFromServer(this.options.serverRequests.data);
      this.renderController.show(this.feedView);
      // this.options.serverRequests.updateData();
      // TODO reintegrate update event when displaying feedview
      // this.feedView.trigger('update');
    }.bind(this));
    this.buttonRefs.createYarn.on('click', function() {
      this.renderController.show(this.newYarnView);
    }.bind(this));
    this.buttonRefs.viewProfile.on('click', function() {
      this.renderController.show(this.profileView);
    }.bind(this));

    this.feedView.on('showYarnDetail', function(data) {
      this.renderController.show(this.yarnView);
    }.bind(this));
    this.feedView.on('showAddToYarn', function(data) {
      this.addToYarnView.yarnData = data;
      this.renderController.show(this.addToYarnView);
    }.bind(this));
    this.buttonRefs.yarnView.on('click', function(data) {
      this.renderController.show(this.yarnView);
    }.bind(this));

    this.buttonRefs.login.on('click', function() {
      oauth.login(function(response) {
          if (response.status === 'connected') {
              console.log('fb login success, received access token');

              // check against database to see if new user
              // or current user by sending request to
              $.ajax({
                  type: "GET",
                  url: "https://graph.facebook.com/me?access_token=...",
                  success: function(data) {
                      console.log(data)
                      var facebookId = data.id;
                      
                  }
              })

              // redirect to home page here?

          } else {
              console.log('login failed', response.error);
          }
      });
    })
  }

  module.exports = CustomLayout;
});