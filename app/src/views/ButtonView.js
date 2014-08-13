'use strict';

var View = require('famous/core/View');
var Surface = require('famous/core/Surface');
var ImageSurface = require('famous/surfaces/ImageSurface');
var StateModifier = require('famous/modifiers/StateModifier');
var Transform = require('famous/core/Transform');
var Easing = require('famous/transitions/Easing');
var Animation = require('../customComponents/CustomAnimations');

function Button() {
    View.apply(this, arguments);

    var SurfaceType = this.options.type === 'image' ? ImageSurface : Surface;

    this.surface = new SurfaceType({
        size: this.options.size,
        content: this.options.content,
        properties: this.options.properties,
        classes: this.options.classes
    });

    this.modifier = new StateModifier({
      origin: this.options.origin,
      transform: this.options.transform,
      size: this.options.size
    });

    this.centerMod = new StateModifier({
        align: [0.5, 0.5],
        origin: [0.5, 0.5]
    });

    this.add(this.modifier).add(this.centerMod).add(this.surface);

    this.surface.pipe(this._eventOutput);
    this.events();

    if (!this.options.visible) this.hide(null, false);
}

Button.prototype = Object.create(View.prototype);
Button.prototype.constructor = Button;

Button.DEFAULT_OPTIONS = {
    type: undefined,
    content: undefined,
    size: undefined,
    origin: undefined,
    align: undefined,
    visible: true,
    properties: undefined,
    transform: undefined,
    classes: [],
    showTransition: {
        curve: Easing.outExpo,
        duration: 500
    }
};

Button.prototype.events = function events() {
    this.surface.on('click', function() {
        Animation.bounceBack(this.modifier);
    }.bind(this));
};

Button.prototype.setContent = function(content) {
    return this.surface.setContent(content);
};

Button.prototype.hide = function(cb, transition) {
    if (!this.visible && this.visible !== undefined) return;
    this.visible = false;

    if (transition === undefined) transition = this.options.showTransition;
    this.centerMod.halt();
    this.centerMod.setTransform(Transform.scale(0.001, 0.001), transition, cb);
};

Button.prototype.show = function(cb, transition) {
    if (this.visible) return;
    this.visible = true;

    if (transition === undefined) transition = this.options.showTransition;
    this.centerMod.halt();
    this.centerMod.setTransform(Transform.identity, transition, cb);
};

Button.prototype.toggle = function(cb) {
    if (this.visible) this.hide();
    else this.show();
};

module.exports = Button;
