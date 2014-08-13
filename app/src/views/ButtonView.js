'use strict';

var View = require('famous/core/View');
var Surface = require('famous/core/Surface');
var ImageSurface = require('famous/surfaces/ImageSurface');
var Modifier = require('famous/core/Modifier');
var Animation = require('../customComponents/CustomAnimations');

function Button() {
    View.apply(this, arguments);

    var SurfaceType = this.options.type === 'image' ? ImageSurface : Surface;

    this.surface = new SurfaceType({
        content: this.options.content,
        size: this.options.size,
        properties: this.options.properties,
        classes: this.options.classes
    });

    this.modifier = new Modifier({
      origin: this.options.origin,
      transform: this.options.transform,
      size: this.options.size
    });

    this.centerMod = new Modifier({
        align: [0.5, 0.5],
        origin: [0.5, 0.5]
    });

    this.add(this.modifier).add(this.centerMod).add(this.surface);

    this.surface.pipe(this._eventOutput);
    this.events();
}

Button.prototype = Object.create(View.prototype);
Button.prototype.constructor = Button;

Button.DEFAULT_OPTIONS = {
    type: undefined,
    content: undefined,
    size: undefined,
    origin: undefined,
    active: false,
    transform: undefined,
    properties: undefined,
    classes: [],
};

Button.prototype.events = function events() {
    this.surface.on('click', function() {
        Animation.bounceBack(this.modifier);
    }.bind(this));
};

Button.prototype.setContent = function(content) {
    return this.surface.setContent(content);
};

Button.prototype.toggle = function(cb) {
    this.options.active = !this.options.active;
    if (this.options.active) {
        this.surface.addClass('primaryBGColor');
    } else {
        this.surface.removeClass('primaryBGColor');
    }
};

module.exports = Button;
