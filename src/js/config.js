/**
 *  @desc main object of public methods
 */
var $public = {},
    $pu = $public,

/**
 *  @desc main object of private methods
 */
    $private = {},
    $pr = $private;

/**
 *  @desc static data
 */
$private.statics = {
  appName: 'ZipZap',
  difficult: 3,
  hideClass: 'hide',
  invisibleClass: 'invisible',
  app: {
    wrapperClass: 'app-wrapper',
    headerClass: 'app-header',
    gameContainerClass: 'game-container',
    difficultyChangeClass: 'app-difficulty',
    difficultyNumberClass: 'app-difficulty-num',
    menuClass: 'app-menu'
  },
  modal: {
    mainClass: 'app-modal',
    closeButtonClass: 'app-modal-close-btn',
    containerClass: 'app-modal-container',
    titleFieldClass: 'app-modal-title',
    contentFieldClass: 'app-modal-content',
    footerClass: 'app-modal-footer',
    defaultBtnClass: 'app-modal-default-btn',
    hideClass: 'hidden'
  },
  boxClass: 'app-box',
  boxPointerClass: 'app-box-pointer',
  boxWrapperClass: 'app-box-wrapper',
  boxMovingClass: 'app-box-moving',
  matrixWrapperClass: 'matrix-wrap',
  counterClass: 'movements',
  touchStyles: [{
    name: 'click',
    fullName: 'Clicar'
  }, {
    name: 'drag',
    fullName: 'Arrastar'
  }]
};

/**
 *  @desc public data
 */
$private.data = {
  touchStyle: 'drag'
};

/**
 *  @desc init load flow
 */
$public.init = function init() {
  $pu.set('difficulty', 3);
};

/**
 *  @desc check if is a mobile user agent
 */
$public.isMobile = (function isMobile(ua) {
  var reg = /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/;
  return reg.test(ua);
}(window.navigator.userAgent));

/**
 *  @desc translate event name to touchable or clickable device
 */
$public.EventType = (function EventType() {

  var isMobile = $pu.isMobile;

  return {
    touchstart: isMobile ? 'touchstart' : 'mousedown',
    touchmove: isMobile ? 'touchmove' : 'mousemove',
    touchend: isMobile ? 'touchend' : 'mouseup'
  };
}());

/**
 *  @desc get correctly event touch/click position
 *  @param {DOMEvent} event
 */
$public.translateEventPosition = function translateEventPosition(event) {
  if ($pu.isMobile) {

      var touch;

      if (event.touches.length) {
        touch = event.touches[0];
      } else if (event.changedTouches.length) {
        touch = event.changedTouches[0];
      } else if (event.targetTouches.length) {
        touch = event.targetTouches[0];
      } else {
        touch = {
          clientX: 0,
          clientY: 0
        };
      }

      return {
          x: touch.clientX,
          y: touch.clientY
      };
  }

  return {
      x: event.pageX,
      y: event.pageY
  };
};

/**
 *  @desc get static data
 *  @param {String} key
 *  @return {String|Number|Object|Array}
 */
$public.getStatic = function getStatic(key) {
  return $pr.get(key, $pr.statics);
};

/**
 *  @desc get public data
 *  @param {String} key
 *  @param {String} hash
 *  @return {String|Number|Object|Array}
 */
$public.get = function get(key, hash) {
  return $pr.get(key, $pr.data, hash);
};

/**
 *  @desc set public data
 *  @param {String} key
 *  @param {String} value
 *  @param {Boolean} override - optional
 *  @param {String} hash - optional
 *  @return {Boolean}
 */
$public.set = function set(key, value, override, hash) {
  if (!key) return false;

  var data = $pr.data,
      save = value;

  if (typeof override === "string") {
    save = {
      value: value,
      hash: override
    };
  }

  if (data.hasOwnProperty(key) && typeof override === "boolean" && override) {

    if (data[key].hash && data[key].hash === hash) {
      data[key] = save;
      return true;
    } else if (!data[key].hash) {
      data[key] = save;
      return true;
    } else {
      return false;
    }

  } else if(!data.hasOwnProperty(key)) {
    data[key] = save;
    return true;
  } else {
    return false;
  }
};

/**
 *  @desc get main window bounds
 *  @param {Boolean} clean
 *  @return {Object}
 */
$public.getWindowBounds = function getWindowBounds(clean) {
  var headerClass = '.' + $pr.statics.app.headerClass,
      headerHeight = document.querySelector(headerClass).offsetHeight;
  return {
    width: window.innerWidth,
    height: clean ? window.innerHeight : window.innerHeight - headerHeight
  };
};

/**
 *  @desc define main square size
 *  @return {Number}
 */
$public.resolveAppBounds = function resolveAppBounds() {
  var bounds = $pu.getWindowBounds();

  if (bounds.width == bounds.height) {
    return bounds.width;
  } else if (bounds.width > bounds.height) {
    return bounds.height;
  } else {
    return bounds.width;
  }
};

/**
 *  @desc get data from especific object
 *  @param {String} key
 *  @param {Object} object
 *  @param {String} hash - optinal
 */
$private.get = function get(key, object, hash) {
  if (!object.hasOwnProperty(key)) return null;

  var objHash = object[key].hash;

  if (objHash && hash) {
    if (objHash !== hash) return null;
    return object[key].value;
  }

  return object[key];
};

/**
 *  @desc export public methods to main namespace
 */
module.exports = $public;
