'use strict';
var View = require('famous/core/View');
var StateModifier = require('famous/modifiers/StateModifier');
var ImageSurface = require('famous/surfaces/ImageSurface');
var Scrollview = require('famous/views/Scrollview');
var ViewSequence = require('famous/core/ViewSequence');
var Transform = require('famous/core/Transform');
var Surface = require('famous/core/Surface');

var serverRequests = require('../services/serverRequests');
var dummyTarget = "53e5499be71a74d003372cc1";

function YarnView(){
  View.apply(this, arguments);
  console.log(serverRequests.data);
  console.log('Yarn Data', this.yarnData);

  _createYarn.call(this);
}


YarnView.prototype = Object.create(View.prototype);
YarnView.prototype.constructor = YarnView;
YarnView.DEFAULT_OPTIONS = {
  entryHeight: 175
}



function _createYarn(){

  this.scrollView = new Scrollview({
    align: [0.5, 0],
    origin: [0.5, 0],
    margin: 10000
  })
  this.scrollModifier = new StateModifier({
    size: [100,],
    align: [0.5, 0],
    origin: [0.5, 0],
    transform: Transform.translate(0,15,-10)
  });
  this.add(this.scrollModifier).add(this.scrollView);

}

YarnView.prototype.createDetail = function(data){

  var targetArray = data.links;
  console.log(targetArray)
  this.sequence = [];
  for(var i = 0; i < targetArray.length; i++){
    var cur = targetArray[i];
    console.log(cur);
    var image = new ImageSurface({
      size: [100,125],
      content: cur
    })
    image.pipe(this.scrollView);
    this.sequence.push(image);      
    console.log(this.sequence);
  }

  // imageSurface.setContent('assets/catgif.gif')

  var addPhotoButton = new Surface({
      size: [100, 30],
      content: '+',
      properties: {
        textSize: 30 + 'px',
        backgroundColor: '#CCC',
        textAlign: 'center',
      }
    });

  this.sequence.push(addPhotoButton);

  addPhotoButton.on('click', function(){
    this._eventOutput.emit('showAddToYarn', this.yarnData);
  }.bind(this))

  this.scrollView.sequenceFrom(this.sequence);
}

module.exports = YarnView;
