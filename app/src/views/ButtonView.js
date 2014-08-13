'use strict';

var View = require('famous/core/View');
var Surface = require('famous/core/Surface');
var ImageSurface = require('famous/surfaces/ImageSurface');
var StateModifier = require('famous/modifiers/StateModifier');
var Transform = require('famous/core/Transform');
var Transitionable = require('famous/transitions/Transitionable');
var SpringTransition = require('famous/transitions/SpringTransition');
var Easing = require('famous/transitions/Easing');

Transitionable.registerMethod('spring', SpringTransition);

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
    size: undefined,
    content: undefined,
    properties: undefined,
    origin: undefined,
    transform: undefined,
    classes: [],
    bounceBack: true,
    bounceTransition: {
        method: 'spring',
        period: 250,
        dampingRatio: 0.5
    },
    bounceScale: 0.8,
    visible: true,
    showTransition: {
        curve: Easing.outExpo,
        duration: 500
    }
};

Button.prototype.events = function events() {
    this.surface.on('click', this._bounceBack.bind(this));
};

Button.prototype.setContent = function(content) {
    return this.surface.setContent(content);
};

Button.prototype._bounceBack = function(content) {
    if (!this.options.bounceBack) return;

    this.centerMod.halt();
    this.centerMod.setTransform(Transform.scale(this.options.bounceScale, this.options.bounceScale, 1));
    this.centerMod.setTransform(Transform.identity, this.options.bounceTransition);
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
