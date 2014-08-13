'use strict';

var Transform = require('famous/core/Transform');
var Transitionable = require('famous/transitions/Transitionable');
var SpringTransition = require('famous/transitions/SpringTransition');
var Easing = require('famous/transitions/Easing');

Transitionable.registerMethod('spring', SpringTransition);

var bounceBack = function(modNode) {
  modNode.setTransform(Transform.scale(0.8, 0.8, 1));
  modNode.setTransform(Transform.identity, {
    method: 'spring',
    period: 250,
    dampingRatio: 0.5
  });
};

module.exports = {
  bounceBack: bounceBack,
};
