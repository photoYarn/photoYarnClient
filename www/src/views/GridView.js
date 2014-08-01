define(function(require, exports, module) {
    // import dependencies
    var Engine = require('famous/core/Engine');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Surface = require('famous/core/Surface');
    var GridLayout = require('famous/views/GridLayout');
    


    var pictures = [
        'http://media.moddb.com/images/downloads/1/66/65404/Cute_cat_1.jpg',
        'https://www.petfinder.com/wp-content/uploads/2012/11/99233806-bringing-home-new-cat-632x475.jpg',
        'http://static.guim.co.uk/sys-images/Books/Pix/pictures/2013/12/19/1387464412548/fluffy-cats-009.jpg',
        'https://www.petfinder.com/wp-content/uploads/2012/11/125950112-adopt-second-cat-632x475.jpg',
        'http://i.telegraph.co.uk/multimedia/archive/02763/cats_2763799b.jpg'
    ];
    var ids = ['RtuqUQo', '2rDa8xp', 'eRXmFgl', 'r2Yz2hA', '6camP33'];
    var albumId = "yN5OK";

    // for (var i = 0; i < pictures.length; i++) {
        // $.ajax({
        //     type: 'POST',
        //     url: 'https://api.imgur.com/3/upload',
        //     headers: {
        //         Authorization: 'Client-ID ' + 'ef774ae96ae304c',
        //     },
        //     data: {
                // image: ,
        //         // title: 'cat pics'
        //     },
        //     success: function (data) {
        //         console.log(data);
        //     },
        //     error: function (error, res) {
        //         console.log('post error', error);
        //         console.log('post response', res);
        //     }
        // });
    // }

    var mainContext = Engine.createContext();
    var grid = new GridLayout({
        dimensions: [4, 3]
    });
    var pics = [];
    grid.sequenceFrom(pics);

    for (var i = 0; i < pictures.length; i++) {
        $.ajax({
            type: 'GET',
            url: 'https://api.imgur.com/3/image/' + ids[i],
            headers: {
                Authorization: 'Client-ID ' + 'ef774ae96ae304c'
            },
            success: function (data) {
                var img = new ImageSurface({
                    size: [,],
                    content: data.data.link
                });
                pics.push(img);
                console.log(data)
                
            },
            error: function (error, res) {
                console.log('get error', error);
                console.log('get response', res);
            }
        });
    }

    mainContext.add(grid);
    
});
