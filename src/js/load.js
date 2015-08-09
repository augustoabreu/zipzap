/**
 *  @desc instatiating modules
 */
var Modal = require('./modal'),
    Config = require('./config'),
    Setup = require('./setup'),
    App = require('./app'),
    Menu = require('./menu'),

/**
 *  @desc main object of public methods
 */
    $public = {},
    $pu = $public,

/**
 *  @desc main object of private methods
 */
    $private = {},
    $pr = $private;

/**
 *  @desc init load flow
 */
$private.init = function init() {
  $pr.setupEvents();
};

/**
 *  @desc attach events to load application
 */
$private.setupEvents = function setupEvents() {
  window.addEventListener('load', $pr.onWindowLoad);
};

/**
 *  @desc handle window load event and initiate all modules
 */
$private.onWindowLoad = function onWindowLoad() {
  Config.init();
  Modal.init();
  Setup.init();
  Menu.init();
};

/**
 *  @desc init application
 */
$pr.init();

/**
 *  @desc export public methods to main namespace
 */
module.exports = $public;
