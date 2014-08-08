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

  // import views
  var NewYarnView = require('views/NewYarnView');
  var FeedView = require('views/FeedView');
  var ProfileView = require('views/ProfileView');
  var YarnView = require('views/YarnView');
  var AddToYarnView = require('views/AddToYarnView');
	
  // instantiate CustomLayout
  var TestFeed = require('views/TestFeed');
  
  //custom tools
  var CustomButton = require('customComponents/CustomButton');
  var deparam = require('customComponents/deparam');

  var oauth = (function() {

      var FB_LOGIN_URL = 'https://www.facebook.com/dialog/oauth';
      var FB_LOGOUT_URL = 'https://www.facebook.com/logout.php';

      var tokenStore = window.sessionStorage;
      var appId;

      var loginCallback;
      var loginProcessed;
      var runningInCordova;

      document.addEventListener('deviceready', function() {
          runningInCordova = true;
          console.log('hi im in here running in cordova')
      }, false);

      var oauthRedirectURL = 'http://localhost:8100/oauthcallback.html';

      var init = function(params) {
          if (params.appId) {
              appId = params.appId;
              console.log('init called, appId', appId)
          } else {
              throw 'appId param not set';
          }
      };

      var isLoggedIn = function() {
          return tokenStore.hasOwnProperty('access_token');
      }

      var login = function(callback) {
          if (!appId) {
              callback({status: 'unkonwn', error: 'appId not set'});
          }
          var loginWindow;
          var startTime;

          loginCallback = callback;
          loginProcessed = false;
          if (runningInCordova) {
            console.log('yo im running in cordova')
            oauthRedirectURL = 'https://www.facebook.com/connect/login_success.html';
          }

          loginWindow = window.open(FB_LOGIN_URL + '?client_id=' + appId + '&redirect_uri=' + oauthRedirectURL +
                      '&response_type=token&scope=public_profile', '_blank', 'location=no');

          if (runningInCordova) {
              loginWindow.addEventListener('loadstart', function() {
                console.log('hiiiiiii')
                loginWindow.close();
              });
          }

      };

      var logout = function(callback) {
          var access_token = tokenStore['access_token']
          delete tokenStore['access_token'];
          if (callback) {
              callback(access_token);
          }
      };

      var oauthCallback = function(url) {
          // Parse the OAuth data received from Facebook
          var queryString;
          var queryObj;

          loginProcessed = true;

          if (url.indexOf("access_token=") !== -1) {
              queryString = url.substr(url.indexOf('#') + 1);
              console.log('heihihi')
              queryObj = $.deparam(queryString)
              console.log(queryObj)
              tokenStore['access_token'] = queryObj['access_token'];
              console.log(tokenStore)
              if (loginCallback) {
                  loginCallback({
                      status: 'connected', 
                      token: queryObj['access_token']
                  });
              }
          } else if (url.indexOf("error=") !== -1) {
              queryString = url.substring(url.indexOf('?') + 1, url.indexOf('#'));
              queryObj = $.deparam(queryString);
              if (loginCallback) {
                  loginCallback({
                      status: 'not_authorized', 
                      error: queryObj.error
                  });
              }
          } else {
              if (loginCallback) {
                  loginCallback({
                      status: 'not_authorized'
                  });
              }
          }
      };

      return {
          login: login,
          logout: logout,
          isLoggedIn: isLoggedIn,
          init: init,
          oauthCallback: oauthCallback,
      }

  })();

  //Creating Layout
>>>>>>> test branch so justin can install app on his phone to see if oauth works
  function CustomLayout(){
    HeaderFooterLayout.apply(this, arguments);
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
    var logo = new ImageSurface({
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
    this.renderController.show(logo);
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
<<<<<<< HEAD
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
    };
=======
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
    this.buttonRefs.login = new CustomButton({
      name: 'Login',
      classes: ['customButton', 'lightgreenBG'],
    });
>>>>>>> test branch so justin can install app on his phone to see if oauth works

    // create grid layout for buttons
    this.buttons = [
      this.buttonRefs.viewFeed,
      this.buttonRefs.createYarn,
      this.buttonRefs.viewProfile,
      this.buttonRefs.login
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
    // associate nav button events to display content actions
    this.buttonRefs.viewFeed.on('click', function() {
      console.log('Feed');
      this.feedView.createFeedEntriesFromServer(this.options.serverRequests.data);
      this.renderController.show(this.feedView);
      // this.options.serverRequests.updateData();
      // TODO reintegrate update event when testFeed switched to main feed
      // this.feedView.trigger('update');

    }.bind(this));
    this.buttonRefs.createYarn.on('click', function() {
      console.log('New Yarn');
      this.renderController.show(this.newYarnView);
    }.bind(this));
    this.buttonRefs.viewProfile.on('click', function() {
      console.log('Profile');
      this.renderController.show(this.profileView);
    }.bind(this));

    oauth.init({appId: 261431800718045});
    this.buttonRefs.login.on('click', function() {
      oauth.login(function(response) {
          if (response.status === 'connected') {
              console.log('fb login success, received access token');

              // check against database to see if new user
              // or current user by sending request to
              // $.ajax({
              //     type: "GET",
              //     url: "https://graph.facebook.com/me?access_token=...",
              //     success: function(data) {
              //         console.log(data)
              //     }
              // })

              // redirect to home page here?

          } else {
              console.log('login failed', response.error);
          }
      });
    }.bind(this));
  }

  module.exports = CustomLayout;
});