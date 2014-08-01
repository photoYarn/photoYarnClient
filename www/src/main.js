define(function(require, exports, module) {
    // import dependencies
    var Engine = require('famous/core/Engine');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Surface = require('famous/core/Surface');

    var mainContext = Engine.createContext();
    var initialTime = Date.now();

    function onDeviceReady() {
        text.setContent(device.platform);
    }

    document.addEventListener('deviceready', onDeviceReady, false);

    var logo = new ImageSurface({
        size: [200, 200],
        content: 'http://code.famo.us/assets/famous_logo.svg',
        classes: ['double-sided']
    });

    var text = new Surface({
        size: [200, 200],
        content: 'none yet'
    });

    var centerSpinModifier = new Modifier({
        origin: [0.5, 0.5],
        transform: function() {
            return Transform.rotateY(.002 * (Date.now() - initialTime));
        }
    });

    var textModifier = new Modifier({
        origin: [0.5, 0.5]
    });

    mainContext.add(textModifier).add(text);
    mainContext.add(centerSpinModifier).add(logo);
    // $.ajax({
    //     type: 'POST',
    //     url: 'https://api.imgur.com/3/upload',
    //     headers: {
    //         Authorization: 'Client-ID ' + 'ef774ae96ae304c',
    //         // Accept: 'application/json'
    //     },
    //     data: {
    //         image: 'http://explosionhub.com/wp-content/uploads/2012/07/1562-cute-little-cat.jpg',
    //         title: 'cat'
    //     },
    //     success: function(data) {
    //         console.log(data)
    //     },
    //     error: function(error, response) {
    //         console.log('response', response)
    //         console.log('error', error)
    //     },
    //     // dataType: 'image/jpg'
    // });

    $.ajax({
        type: 'GET',
        url: 'https://api.imgur.com/3/image/La0ANAg',
        headers: {
            Authorization: 'Client-ID ' + 'ef774ae96ae304c',
        },
        success: function(data) {
            console.log(data.data.link);
            var image = new ImageSurface({
                size: [200, 200],
            });
            image.setContent(data.data.link);
            mainContext.add(image);
        },
        error: function(error, response) {
            console.log('response', response)
            console.log('error', error)
        }
    })

    
});
