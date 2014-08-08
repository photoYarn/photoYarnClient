define(function(require, exports, module) {
    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var StateModifier = require('famous/modifiers/StateModifier');
    var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');

    var mainContext = Engine.createContext();
		
		$.ajax({
			type: 'POST',
			url: 'https://api.imgur.com/3/upload',
			headers: {
				Authorization: 'Client-ID ' + 'ef774ae96ae304c',
			},
			data: {
				image: 'http://explosionhub.com/wp-content/uploads/2012/07/1562-cute-little-cat.jpg',
				title: 'cute little cat',

			},
			success: function (data) {
				// send a post request to the server here with imgur photo id and yarn id
				console.log(data);
			},
			error: function (error, res) {
				console.log('post error', error);
				console.log('post response', res);
			}
		});
		
		$.ajax({
			type: 'GET',
			url: 'https://api.imgur.com/3/image/htqX9Fp',
			headers: {
				Authorization: 'Client-ID ' + 'ef774ae96ae304c'
			},
			success: function (data) {
				var img = new ImageSurface({
					size: [200, 200],
					content: data.data.link
				});
				mainContext.add(img);
				
			},
			error: function (error, res) {
				console.log('get error', error);
				console.log('get response', res);
			}
		});
		

});
