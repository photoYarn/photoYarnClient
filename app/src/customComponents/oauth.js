var $ = require('jquery');

(function ($) {
  $.deparam = function (params, coerce) {
    var obj = {},
        coerce_types = { 'true': !0, 'false': !1, 'null': null };
      
    // Iterate over all name=value pairs.
    $.each(params.replace(/\+/g, ' ').split('&'), function (j,v) {
      var param = v.split('='),
          key = decodeURIComponent(param[0]),
          val,
          cur = obj,
          i = 0,
            
          // If key is more complex than 'foo', like 'a[]' or 'a[b][c]', split it
          // into its component parts.
          keys = key.split(']['),
          keys_last = keys.length - 1;
        
      // If the first keys part contains [ and the last ends with ], then []
      // are correctly balanced.
      if (/\[/.test(keys[0]) && /\]$/.test(keys[keys_last])) {
        // Remove the trailing ] from the last keys part.
        keys[keys_last] = keys[keys_last].replace(/\]$/, '');
          
        // Split first keys part into two parts on the [ and add them back onto
        // the beginning of the keys array.
        keys = keys.shift().split('[').concat(keys);
          
        keys_last = keys.length - 1;
      } else {
        // Basic 'foo' style key.
        keys_last = 0;
      }
        
      // Are we dealing with a name=value pair, or just a name?
      if (param.length === 2) {
        val = decodeURIComponent(param[1]);
          
        // Coerce values.
        if (coerce) {
          val = val && !isNaN(val)              ? +val              // number
              : val === 'undefined'             ? undefined         // undefined
              : coerce_types[val] !== undefined ? coerce_types[val] // true, false, null
              : val;                                                // string
        }
          
        if ( keys_last ) {
          // Complex key, build deep object structure based on a few rules:
          // * The 'cur' pointer starts at the object top-level.
          // * [] = array push (n is set to array length), [n] = array if n is 
          //   numeric, otherwise object.
          // * If at the last keys part, set the value.
          // * For each keys part, if the current level is undefined create an
          //   object or array based on the type of the next keys part.
          // * Move the 'cur' pointer to the next level.
          // * Rinse & repeat.
          for (; i <= keys_last; i++) {
            key = keys[i] === '' ? cur.length : keys[i];
            cur = cur[key] = i < keys_last
              ? cur[key] || (keys[i+1] && isNaN(keys[i+1]) ? {} : [])
              : val;
          }
            
        } else {
          // Simple key, even simpler rules, since only scalars and shallow
          // arrays are allowed.
            
          if ($.isArray(obj[key])) {
            // val is already an array, so push on the next value.
            obj[key].push( val );
              
          } else if (obj[key] !== undefined) {
            // val isn't an array, but since a second value has been specified,
            // convert val into an array.
            obj[key] = [obj[key], val];
              
          } else {
            // val is a scalar.
            obj[key] = val;
          }
        }
          
      } else if (key) {
        // No value was defined, so set something meaningful.
        obj[key] = coerce
          ? undefined
          : '';
      }
    });
      
    return obj;
  };
})($);


var oauth = (function() {

    var FB_LOGIN_URL = 'https://www.facebook.com/dialog/oauth';
    var FB_LOGOUT_URL = 'https://www.facebook.com/logout.php';

    var tokenStore = window.sessionStorage;
    var appId = 261431800718045; // this is considered public knowledge
    // var appId;

    var loginCallback;
    var loginProcessed;
    var runningInCordova;

    document.addEventListener('deviceready', function() {
        runningInCordova = true;
    }, false);

    var oauthRedirectURL = 'http://localhost:8100/oauthcallback.html';

    // i don't think this is necessary
    // var init = function(params) {
    //     if (params.appId) {
    //         appId = params.appId;
    //         console.log('init called, appId', appId)
    //     } else {
    //         throw 'appId param not set';
    //     }
    // };

    var isLoggedIn = function() {
        return tokenStore.getItem('access_token') !== null;
    }

    var login = function(callback) {
        if (!appId) {
            callback({status: 'unkonwn', error: 'appId not set'});
        }
        var loginWindow;
        var startTime;

        var loginWindowLoadHandler = function(event) {
            var url = event.url;
            console.log('im running in cordova, im in loginWindowHandler, here is url', url);
            if (url.indexOf('access_token') !== -1) {
                console.log('here is your access token')
                // var timeout = 600 - (new Date().getTime() - startTime);
                // setTimeout(function () {
                loginWindow.close();
                // }, timeout > 0 ? timeout : 0);
                oauthCallback(url);
            } else if (url.indexOf('error') !== -1) {
                console.log('there is an error')
            }
        };

        var loginWindowExitHandler = function() {
            loginWindow.removeEventListener('loadstart', loginWindowLoadHandler);
            loginWindow.removeEventListener('exit', loginWindowExitHandler);
            loginWindow = null;
            console.log('removed listeners and login window');
        };

        loginCallback = callback;
        loginProcessed = false;

        if (runningInCordova) {
          oauthRedirectURL = 'https://www.facebook.com/connect/login_success.html';
        }

        startTime = new Date().getTime(); 
        loginWindow = window.open(FB_LOGIN_URL + '?client_id=' + appId + '&redirect_uri=' + oauthRedirectURL +
                    '&response_type=token&scope=public_profile', '_blank', 'location=no');

        if (runningInCordova) {
            tokenStore = window.localStorage;
            console.log(tokenStore);
            loginWindow.addEventListener('loadstart', loginWindowLoadHandler);
            loginWindow.addEventListener('exit', loginWindowExitHandler);
        }

    };

    var logout = function(callback) {
        var access_token = tokenStore.getItem('access_token');
        console.log('deleting access token')
        tokenStore.removeItem('access_token');
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
            queryObj = $.deparam(queryString)
            tokenStore.setItem('access_token', queryObj['access_token']);
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
        // init: init,
        oauthCallback: oauthCallback,
    }

})();

module.exports = oauth;

