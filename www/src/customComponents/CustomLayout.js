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
      }, false);

      var oauthRedirectURL = 'http://localhost:8100/oauthcallback.html';

      var init = function(params) {
          if (params.appId) {
              appId = params.appId;
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

          var loginWindowLoadHandler = function(event) {
              var url = event.url;
              console.log('im running in cordova')
              if (url.indexOf('access_token') !== -1 || url.indexOf('error') !== -1) {
                  var timeout = 600 - (new Date().getTime() - startTime);
                  setTimeout(function () {
                    loginWindow.close();
                  }, timeout > 0 ? timeout : 0);
                  oauthCallback(url);
              }
          };

          var loginWindowExitHandler = function() {
              loginWindow.removeEventListener('loadstart', loginWindowLoadHandler);
              loginWindow.removeEventListener('exit', loginWindowExitHandler);
          };

          loginCallback = callback;
          loginProcessed = false;
          if (runningInCordova) {
            oauthRedirectURL = 'https://www.facebook.com/connect/login_success.html';
            console.log('runningInCordova =====================================================')
          }

          startTime = new Date().getTime();
          loginWindow = window.open(FB_LOGIN_URL + '?client_id=' + appId + '&redirect_uri=' + oauthRedirectURL +
                      '&response_type=token&scope=public_profile', '_blank', 'location=no');

          if (runningInCordova) {
              tokenStore = window.LocalStorage;
              loginWindow.addEventListener('loadstart', loginWindowLoadHandler);
              loginWindow.addEventListener('exit', loginWindowExitHandler);
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
    this.buttonRefs.login = new CustomButton({
      name: 'Login',
      classes: ['customButton', 'lightgreenBG'],
    });

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