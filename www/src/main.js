define(function(require, exports, module) {
    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var StateModifier = require('famous/modifiers/StateModifier');

    var mainContext = Engine.createContext();

    var testSurface = new Surface({
        size: [100, 100],
        properties: {
            backgroundColor: 'green'
        }
    });

    var testModifier = new StateModifier({
        origin : [0.5, 0.5],
        align: [0.5, 0.5]
    });

    mainContext.add(testModifier).add(testSurface);
    
});
