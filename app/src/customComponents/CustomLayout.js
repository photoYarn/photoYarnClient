'use strict';

// import famo.us dependencies
var View = require('famous/core/View');
var Modifier = require('famous/core/Modifier');
var ImageSurface = require('famous/surfaces/ImageSurface');
var Surface = require('famous/core/Surface');
var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
var GridLayout = require('famous/views/GridLayout');
var RenderController = require('famous/views/RenderController');
var Transform = require('famous/core/Transform');
var Easing = require('famous/transitions/Easing');
var GenericSync = require('famous/inputs/GenericSync');
var MouseSync = require('famous/inputs/MouseSync');
var TouchSync = require('famous/inputs/TouchSync');
GenericSync.register({
    mouse: MouseSync,
    touch: TouchSync,
});
var Transitionable = require('famous/transitions/Transitionable');


// import components/utilities
var ButtonView = require('../views/ButtonView');
var CustomButton = require('./CustomButton');
var $ = require('jquery');
var serverRequests = require('../services/serverRequests.js');

// import views
var NewYarnView = require('../views/NewYarnView');
var FeedView = require('../views/FeedView');
var ProfileView = require('../views/ProfileView');
var YarnView = require('../views/YarnView');
var AddToYarnView = require('../views/AddToYarnView');
var LoadingView = require('../views/LoadingView');

// CustomLayout constructor
function CustomLayout() {
  View.apply(this, arguments);

  this.serverRequests = serverRequests;
  this.hideRatio = new Transitionable(0);

  // adding elements
  _createLayout.call(this);
  _createContent.call(this);
  _createHeader.call(this);
  _createFooter.call(this);
  _setListeners.call(this);
  _setHeaderFooterListeners.call(this);
}

// set defaults
CustomLayout.prototype = Object.create(View.prototype);
CustomLayout.prototype.constructor = CustomLayout;
CustomLayout.DEFAULT_OPTIONS = {
  origin: [0, 0],
  align: [0, 0],
  headerSize: 75,
  footerSize: 50,
  appTitle: 'Photo<span class="textColor0">Y</span>' + 
                                '<span class="textColor1">a</span>' + 
                                '<span class="textColor2">r</span>' + 
                                '<span class="textColor3">n</span>',
  hideTransition: {
    curve: Easing.outExpo,
    duration: 500,
  },
  showTransition: {
    curve: Easing.outExpo,
    duration: 500,
  },
};

// create layout template
function _createLayout() {
  this.layout = new HeaderFooterLayout(this.options);

  this.add(this.layout);
}

// create content component
function _createContent(){
  // famo.us logo because famo.us is cool!
  this.logo = new ImageSurface({
    size: [200, 200],
    content: 'assets/catTied.png',
  });

  var centerModifier = new Modifier({
    origin: [0.5, 0.5],
    align: [0.5, 0.5]
  });

  // initialize content views
  this.feedView = new FeedView({
    message: 'custom feed view',
    serverRequests: this.options.serverRequests,
    headerSize: this.options.headerSize,
    footerSize: this.options.footerSize
   });
  this.newYarnView = new NewYarnView({
    message: 'custom new yarn view',
    serverRequests: this.options.serverRequests,
    feedView: this.feedView
  });

  this.profileView = new ProfileView({
    message: 'custom profile view',
    serverRequests: this.options.serverRequests
  });
  this.yarnView = new YarnView({
    serverRequests: this.options.serverRequests
  });
  this.addToYarnView = new AddToYarnView({
    serverRequests: this.options.serverRequests,
    feedView: this.feedView
  });
  this.loadingView = new LoadingView();

  // initialize and attach RenderController to content display
  this.renderController = new RenderController();
  this.layout.content.add(centerModifier).add(this.renderController);
  this.renderController.show(this.logo);
}

// create header component
function _createHeader(){
  // create header mod
  this.headerMod = new Modifier();

  // create title bar
  this.title = new Surface({
    content: this.options.appTitle,
    classes: ['header', 'primaryBGColor'],
    properties: {
      lineHeight: this.options.headerSize + 'px',
      textAlign: 'center'
    }
  });

  // add title to header display
  this.layout.header.add(this.headerMod).add(this.title);
}

// create footer component
function _createFooter(){
  // create footer modifier
  this.footerMod = new Modifier();

  // create footer background
  var footerBG = new Surface({
    classes: ['darkTopBorder', 'ltGrayBGColor'],
  });

  // create buttons
  this.buttonRefs = {
    viewFeed: new ButtonView({
      size: [this.options.footerSize, this.options.footerSize],
      origin: [0.5, 0.5],
      align: [0.5, 0.5],
      classes: ['navButton1', 'ion-images'],
      properties: {
        fontSize: this.options.footerSize * 0.9 + 'px',
      },
    }),
    createYarn: new ButtonView({
      size: [this.options.footerSize, this.options.footerSize],
      origin: [0.5, 0.5],
      align: [0.5, 0.5],
      classes: ['navButton2', 'ion-camera'],
      properties: {
        fontSize: this.options.footerSize * 0.9 + 'px',
      },
    }),
    viewProfile: new ButtonView({
      size: [this.options.footerSize, this.options.footerSize],
      origin: [0.5, 0.5],
      align: [0.5, 0.5],
      classes: ['navButton3', 'ion-person'],
      properties: {
        fontSize: this.options.footerSize * 0.9 + 'px',
      },
    }),
  };

  // create grid layout for buttons
  this.buttons = [
    this.buttonRefs.viewFeed,
    this.buttonRefs.createYarn,
    this.buttonRefs.viewProfile,
  ];
  this.buttonGrid = new GridLayout({
    dimensions: [this.buttons.length, 1],
  });
  this.buttonGrid.sequenceFrom(this.buttons);

  // add footer elements to footer
  this.footerNode = this.layout.footer.add(this.footerMod);
  this.footerNode.add(footerBG);
  this.footerNode.add(this.buttonGrid);
}

// set touch listeners for hiding/showing header/footer
function _setHeaderFooterListeners() {
  // attaching sync object to feedview
  var sync = new GenericSync(['mouse', 'touch'], {
      direction: GenericSync.DIRECTION_Y,
  });
  sync.subscribe(this.feedView);
  sync.subscribe(this.yarnView);

  // handling touch events
  sync.on('update', function(data) {
    var flip = -data.delta;
    if (flip > 0) {
      this.hideRatio.set(Math.min(100, this.hideRatio.get() + flip));
    } else {
      this.hideRatio.set(Math.max(0, this.hideRatio.get() + flip));
    }

    var headerPos = this.hideRatio.get() * this.options.headerSize / 100;
    var footerPos = this.hideRatio.get() * this.options.footerSize / 100;
    this.headerMod.setTransform(Transform.translate(1, -headerPos, 1));
    this.footerMod.setTransform(Transform.translate(1, footerPos, 1));
  }.bind(this));

  // show/hide layout when touch ends based on threshold
  sync.on('end', function(data) {
    if (this.hideRatio.get() > 50) {
      this._hideLayout();
    } else {
      this._showLayout();
    }
  }.bind(this));
}


// set listeners for buttons in footer nav and in content views
function _setListeners() {
  // bind header click event
  this.title.on('click', function() {
    this._activateButton();
    this.renderController.show(this.logo);
  }.bind(this));

  // associate nav button to display actions
  this.buttonRefs.viewFeed.on('click', function() {
    this._showLayout();
    this.title.setContent(this.options.appTitle);
    this._activateButton(this.buttonRefs.viewFeed);
    this.feedView.trigger('refreshFeed', this.options.serverRequests.data);

    //if yarnView was showing focused image, that image should be hidden.
    if(this.yarnView.toggled){
      this.yarnView.toggle();
    }

    this.renderController.show(this.feedView);
  }.bind(this));

  // associate nav button to display actions
  this.buttonRefs.createYarn.on('click', function() {
    this._showLayout();
    this.title.setContent(this.options.appTitle);
    this._activateButton(this.buttonRefs.createYarn);
    this.renderController.show(this.newYarnView);
  }.bind(this));

  // associate nav button to display actions
  this.buttonRefs.viewProfile.on('click', function() {
    console.log(this.profileView.update());
    this._showLayout();
    this.title.setContent(this.options.appTitle);
    this.profileView.update();
    this._activateButton(this.buttonRefs.viewProfile);
    this.renderController.show(this.profileView);
  }.bind(this));

  // TODO decouple event and child trigger to sync with this.feedView
  this.yarnView.on('showAddToYarn', function(data) {
    this._showLayout();
    this.title.setContent('Add to Yarn');
    this.addToYarnView.trigger('initYarnData', data);
    this.renderController.show(this.addToYarnView);
  }.bind(this))

  this.feedView.on('showYarnDetail', function(data) {
    this._showLayout();
    this.yarnView.trigger('initYarnData', data);
    this.title.setContent(data.caption)
    this.renderController.show(this.yarnView);
  }.bind(this));

  // TODO decouple event and child trigger to sync with this.yarnView
  this.feedView.on('showAddToYarn', function(data) {
    this._showLayout();
    this.addToYarnView.trigger('initYarnData', data);
    this.renderController.show(this.addToYarnView);
  }.bind(this));

  //Event triggered by serverRequests to show loading view
  this.serverRequests.emitter.on('Loading', function(){
    console.log('LOADING IS HAPPENING!');
    this.renderController.show(this.loadingView);
  }.bind(this))

  //Event triggered by serverRequests to transition from loading view to feedview
  this.serverRequests.emitter.on('Loaded', function(){
    console.log('LOADING HAPPENED!');
    this._activateButton(this.buttonRefs.viewFeed);
    this.title.setContent(this.options.appTitle);
    this.renderController.show(this.feedView);
  }.bind(this))

}

// animate hide
CustomLayout.prototype._hideLayout = function() {
  this.hideRatio.set(100);
  this.headerMod.halt();
  this.footerMod.halt();
  this.headerMod.setTransform(Transform.translate(1, -this.options.headerSize, 1), this.options.hideTransition);
  this.footerMod.setTransform(Transform.translate(1, this.options.footerSize, 1), this.options.hideTransition);
}

// animate show
CustomLayout.prototype._showLayout = function() {
  this.hideRatio.set(0);
  this.headerMod.halt();
  this.footerMod.halt();
  this.headerMod.setTransform(Transform.identity, this.options.showTransition);
  this.footerMod.setTransform(Transform.identity, this.options.showTransition);
}

// Activate given button and deactivate others
CustomLayout.prototype._activateButton = function(button) {
  for (var i = 0; i < this.buttons.length; i++) {
    this.buttons[i].toggleOff();
  }
  if (button && !button.isActive()) {
    button.toggleOn();
  }
}

module.exports = CustomLayout;
