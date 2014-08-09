define(function(require, exports, module) {

    var oauth = (function() {

        var FB_LOGIN_URL = 'https://www.facebook.com/dialog/oauth';
        var FB_LOGOUT_URL = 'https://www.facebook.com/logout.php';

        var tokenStore = window.sessionStorage;
        var appId = 261431800718045; // this is considered public knowledge

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
                console.log('im running in cordova, im in loginWindowHandler, here is url', url);
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
            // init: init,
            oauthCallback: oauthCallback,
        }

    })();

    module.exports = oauth;

});