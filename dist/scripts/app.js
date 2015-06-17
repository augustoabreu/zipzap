/*! ZipZap - v2.0.0 - 2015-06-17 */
;(function ConfigurationModule(zz, undefined) {
  'use strict';

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
      difficultyNumberClass: 'app-difficulty-num'
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
    counterClass: 'movements'
  };

  /**
   *  @desc public data
   */
  $private.data = {};

  /**
   *  @desc init load flow
   */
  $public.init = function init() {
    console.log('Initializing ConfigurationModule');
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
  zz.cfg = $public;

}(this.zipzap = this.zipzap || {}));

;(function ModalModule(zz, undefined) {
  'use strict';

  /**
   *  @desc instatiating modules
   */
  var Config = zz.cfg,

  /**
   *  @desc main object of public methods
   */
      $public = {},
      $pu = $public,

  /**
   *  @desc main object of private methods
   */
      $private = {},
      $pr = $private,

  /**
   *  @desc register modal elements
   */
      $modal = null,
      $closeBtn = null,
      $container = null,
      $titleField = null,
      $contentField = null,
      $footer = null,

  /**
   *  @desc register default classes
   */
      defaultBtnClass = null,
      hideClass = null,
      hiddenClass = null,

  /**
   *  @desc modal custom templates
   */
      customTemplates = [],

  /**
   *  @desc current template
   */
      currentTemplate = null,

  /**
   *  @desc properties of default templates
   */
      props = {
        modal: {
          hasTitleField: true,
          hasCloseButton: true,
          closeOnOverlay: true
        },
        alert: {
          hasCloseButton: false
        },
        confirm: {
          hasCloseButton: false,
          confirmMessage: 'Sim',
          declineMessage: 'Não'
        }
      },

  /**
   *  @desc control to initialize module just once
   */
      initialized = false;

  /**
   *  @desc init modal flow
   *  @param {Object} optins (optional)
   */
  $public.init = function init(options) {
    if (initialized) throw new Error('Modal Module already initialized.');
    console.log('Initializing ModalModule');

    var classes = Config.getStatic('modal'),
        modalClass = classes.mainClass,
        closeButtonClass = classes.closeButtonClass,
        containerClass = classes.containerClass,
        titleClass = classes.titleFieldClass,
        footerClass = classes.footerClass,
        contentClass = classes.contentFieldClass;

    defaultBtnClass = classes.defaultBtnClass;
    hiddenClass = classes.hideClass;
    hideClass = Config.getStatic('hideClass');

    $pr.registerDOMElements({
      modal: modalClass,
      closeButton: closeButtonClass,
      container: containerClass,
      title: titleClass,
      content: contentClass,
      footer: footerClass
    });

    if (options && options.template) {
      $pr.changeToTemplate(options.template);
    } else {
      $pr.setModal();
    }

    initialized = true;
  };

  /**
   *  @desc make #$modal visible
   */
  $public.show = function show() {
    $modal.classList.remove(hiddenClass);
    $pr.addEvents();
    return $public;
  };

  /**
   *  @desc make #$modal invisible
   */
  $public.hide = function hide(e) {
    if (currentTemplate == 'confirm') return;
    $pr.hide(e);
    return $public;
  };

  /**
   *  @desc reset modal template and content
   */
  $public.reset = function reset() {
    $pr.clearTemplate();
    return $public;
  };

  /**
   *  @desc make #$modal invisible
   *  @return {Boolean}
   */
  $public.isVisible = function isVisible() {
    return !$modal.classList.contains(hiddenClass);
  };

  /**
   *  @desc change between default templates
   *  @param {String} template
   *  @param {Object} content - optional
   */
  $public.changeToTemplate = function changeToTemplate(template, content) {
    if (template == 'modal') {
      return $pr.setModal(content);
    } else if (template == 'alert') {
      return $pr.setAlert(content);
    } else if (template == 'confirm') {
      return $pr.setConfirm(content);
    } else if (!!$pr.getCustomTemplate(template)) {
      return $pr.setCustomTemplate(template, content);
    } else {
      throw new Error('Template not found.');
    }
  };

  /**
   *  @desc set custom template
   *  @param {String} name
   *  @param {String} template
   *
   *  @usage to set a custom template use this function like this:
   *
   *  setCustomTemplate('light-template', {
   *    hasTitleField: true,
   *    hasCloseIcon: false,
   *    closeOnOverlay: false,
   *    template: {
   *      base: '<div class="title-field custom-title-class"></div>' +
   *            '<div class="content-field custom-content-class"></div>' +
   *            '<div class="another-custom-div">' +
   *              '<button class="some-button">Close</button>' +
   *            '</div>',
   *      events: [{
   *        'click.title-field': function() {
   *          console.log('click on title field!');
   *        }
   *      },
   *      {
   *        'click.some-button': function() {
   *          console.log('click on my custom button!');
   *        }
   *      }]
   *    }
   *  });
   */
  $public.addCustomTemplate = function addCustomTemplate(name, template) {
    // todo;
    if (!name || !template) {
      throw new Error('You forgot some params to create a custom template.');
    }
  };

  /**
   *  @desc set the content of modal
   *  @param {Object} content
   *  @return {this}
   */
  $public.setContent = function setContent(content) {
    if (!currentTemplate) {
      throw new Error('You have to set a template before setting the content.');
    }

    if (currentTemplate == 'modal') {
      return $pr.setContentModal(content);
    } else if (currentTemplate == 'alert') {
      return $pr.setContentAlert(content);
    } else if (currentTemplate == 'confirm') {
      return $pr.setContentConfirm(content);
    } else {
      return $pr.setContentCustomTemplate(content);
    }
  };

  /**
   *  @desc add events to modal funcionatilly
   */
  $private.addEvents = function addEvents() {
    document.addEventListener('keydown', $pr.hideOnEsc);
  };

  /**
   *  @desc remove eventos attached by the method $private.addEvents
   */
  $private.removeEvents = function addEvents() {
    document.removeEventListener('keydown', $pr.hideOnEsc);
  };

  /**
   *  @desc callback for de event keydown, hide modal if
   *    ESC key was pressed and the close button is being displayed
   *  @param {HTMLEvent} e
   */
  $private.hideOnEsc = function hideOnEsc(e) {
    if (e.keyCode === 27 && !$pr.hasCloseButton()) $pr.hide();
  };

  /**
   *  @desc detect if the close button has the #hideClass
   *  @return {Boolean}
   */
  $private.hasCloseButton = function hasCloseButton() {
    return $closeBtn.classList.contains(hideClass);
  };

  /**
   *  @desc register DOM Element that remains to modal
   *  @param {Object} elements
   *  @param {String} elements.modal
   *  @param {String} elements.closeButton
   *  @param {String} elements.container
   */
  $private.registerDOMElements = function registerDOMElements(elements) {
    if (!elements || !elements.modal || !elements.closeButton ||
        !elements.container || !elements.content || !elements.title ||
        !elements.footer) {
      throw new Error('To register the modal you have to specify all the ' +
                      'HTMLDOMElements.');
    }
    $modal = document.querySelector('.' + elements.modal);
    $closeBtn = document.querySelector('.' + elements.closeButton);
    $container = document.querySelector('.' + elements.container);
    $contentField = document.querySelector('.' + elements.content);
    $titleField = document.querySelector('.' + elements.title);
    $footer = document.querySelector('.' + elements.footer);
  };

  /**
   *  @desc make #$modal invisible
   *  @desc function used only internally
   */
  $private.hide = function hide(e) {
    e && e.preventDefault && e.preventDefault();
    $modal.classList.add(hiddenClass);
    $pr.removeEvents();
  };

  /**
   *  @desc remove all templates classes and objects
   *  @param {Object} opt
   *  @param {Boolean} opt.hide
   */
  $private.clearTemplate = function clearTemplate(opt) {
    var classes = $modal.classList;
    currentTemplate = null;
    [].forEach.call(classes, function(i, m){
      $modal.classList.remove(i);
    });
    opt && opt.hide && $pu.hide();
    classes.add((Config.getStatic('modal')).mainClass);
    $footer.innerHTML = '';
    $contentField.innerHTML = '';
    $titleField.innerHTML = '';
  };

  /**
   *  @desc change to modal template
   *  @param {Object} content - optional
   */
  $private.setModal = function setModal(content) {
    $pr.clearTemplate({ hide: !$pu.isVisible() });
    if (content && !content.showCloseButton && !props.modal.hasCloseButton) {
      $pr.hideCloseButton();
    } else {
      $pr.showCloseButton();
    }
    content && $pr.setContentModal(content);
    currentTemplate = 'modal';
    return $public;
  };

  /**
   *  @desc change to alert template
   *  @param {Object} content - optional
   */
  $private.setAlert = function setAlert(content) {
    $pr.clearTemplate({ hide: !$pu.isVisible() });
    if (content && !content.showCloseButton && !props.alert.hasCloseButton) {
      $pr.hideCloseButton();
    } else {
      $pr.showCloseButton();
    }
    $modal.classList.add('alert-template');
    content && $pr.setContentAlert(content);
    currentTemplate = 'alert';
    return $public;
  };

  /**
   *  @desc change to confirm template
   *  @param {Object} content - optional
   */
  $private.setConfirm = function setConfirm(content) {
    $pr.clearTemplate({ hide: !$pu.isVisible() });
    if (content && !content.showCloseButton && !props.confirm.hasCloseButton) {
      $pr.hideCloseButton();
    } else {
      $pr.showCloseButton();
    }
    $modal.classList.add('confirm-template');
    content && $pr.setContentConfirm(content);
    currentTemplate = 'confirm';
    return $public;
  };

  /**
   *  @desc change to a custom template
   *  @param {Object} template
   *  @param {Object} content - optional
   */
  $private.setCustomTemplate = function setCustomTemplate(template, content) {
    // todo;
    // currentTemplate = template.name;
    // if (content) $pr.setContentCustomTemplate(content);
    // return $public;
  };

  /**
   *  @desc hide close button and remove all events
   */
  $private.hideCloseButton = function hideCloseButton() {
    $closeBtn.classList.add(hideClass);
    $pr.removeCloseEvent();
  };

  /**
   *  @desc hide close button and remove all events
   */
  $private.showCloseButton = function hideCloseButton() {
    $closeBtn.classList.remove(hideClass);
    $pr.addCloseEvent();
  };

  /**
   *  @desc add close evento to $closeBtn
   */
  $private.addCloseEvent = function addCloseEvent($el) {
    $closeBtn = $el || $closeBtn;
    $closeBtn.addEventListener(Config.EventType.touchstart, $pu.hide);
  };

  /**
   *  @desc remove close evento to $closeBtn
   */
  $private.removeCloseEvent = function removeCloseEvent($el) {
    $closeBtn = $el || $closeBtn;
    $closeBtn.removeEventListener(Config.EventType.touchstart, $pu.hide);
  };

  /**
   *  @desc search if a custom element exists and returns it
   *  @param {String} name
   *  @return {Object}
   */
  $private.getCustomTemplate = function getCustomTemplate(name) {
    if (!name) return null;
    var i = 0,
        len = customTemplates.length;
    for(; i < len; i++) {
      if (customTemplates[i].name == name) return customTemplates[i];
    }
    return null;
  };

  /**
   *  @desc set the content of the modal template
   *  @param {Object} content
   *  @param {String} content.title
   *  @param {String} content.content
   *  @return {this}
   */
  $private.setContentModal = function setContentModal(content) {
    if (content.content) $contentField.innerHTML = content.content;
    if (content.title) $titleField.innerHTML = content.title;
    $pr.configFooter({ hide: true });
    return $public;
  };

  /**
   *  @desc set the content of the alert template
   *  @param {Object} content
   *  @param {String} content.title
   *  @param {String} content.content
   *  @param {String} content.btnText
   *  @param {Function} content.btnCallback - optional
   *  @return {this}
   */
  $private.setContentAlert = function setContentAlert(content) {
    if (content.content) $contentField.innerHTML = content.content;
    if (content.title) $titleField.innerHTML = content.title;
    var clicks = [$pu.hide];
    content.btnCallback && clicks.push(content.btnCallback);
    $pr.configFooter({
      hide: false,
      buttons: [{
        color: 'blue',
        text: content.btnText,
        clicks: clicks
      }]
    });
    return $public;
  };

  /**
   *  @desc set the content of the confirm template
   *  @param {Object} content
   *  @param {String} content.title
   *  @param {String} content.content
   *  @param {String} content.btnConfirmMessage
   *  @param {String} content.btnDeclineMessage
   *  @param {Function} content.confirmCallback
   *  @param {Function} content.declineCallback
   *  @return {this}
   */
  $private.setContentConfirm = function setContentConfirm(content) {
    if (content.title) $titleField.innerHTML = content.title;
    if (content.content) $contentField.innerHTML = content.content;

    var confirmMessage = content.btnConfirmMessage ?
                          content.btnConfirmMessage : props.confirm.confirmMessage,
        declineMessage = content.btnDeclineMessage ?
                          content.btnDeclineMessage : props.confirm.declineMessage;

    $pr.configFooter({
      hide: false,
      buttons: [{
        color: content.btnConfirmColor || 'blue',
        text: confirmMessage,
        clicks: tempConfirm
      },
      {
        color: content.btnDeclineColor || 'red',
        text: declineMessage,
        clicks: tempDecline
      }]
    });

    function tempConfirm() {
      $pr.hide();
      content.confirmCallback && content.confirmCallback();
    }

    function tempDecline() {
      $pr.hide();
      content.declineCallback && content.declineCallback();
    }

    return $public;
  };

  /**
   *  @desc set the content of a custom template
   *  @param {Object} content
   */
  $private.setContentCustomTemplate = function setContentCustomTemplate(content) {
    // todo;
    // return $public;
  };

  /**
   *  @desc config footer behaviours
   */
  $private.configFooter = function configFooter(options) {
    $footer.innerHTML = '';
    if (options.hide) {
      $footer.classList.add('hide');
    } else {
      $footer.classList.remove('hide');
    }
    if (options.buttons) {
      var len = options.buttons.length,
          clicks;
      for (var  i = 0; i < len; i++) {
        var button = document.createElement('button');
        button.innerText = options.buttons[i].text;
        button.classList.add(defaultBtnClass);
        button.classList.add(options.buttons[i].color);

        clicks = options.buttons[i].clicks;
        if (clicks.constructor.name === "Array" && clicks.length) {
          for (var j = options.buttons[i].clicks.length - 1; j >= 0; j--) {
            button.addEventListener(Config.EventType.touchstart, options.buttons[i].clicks[j]);
          }
        } else {
          button.addEventListener(Config.EventType.touchstart, options.buttons[i].clicks);
        }

        $footer.appendChild(button);
      }
    }
  };

  /**
   *  @desc export public methods to main namespace
   */
  zz.modal = $public;

}(this.zipzap = this.zipzap || {}));

;(function AppModule(zz, undefined){
  'use strict';

  /**
   *  @desc instatiating modules
   */
  var Config = zz.cfg,
      Modal = zz.modal,
      Setup = zz.setup,

  /**
   *  @desc main app matrix (square)
   */
      matrix = null,

  /**
   *  @desc game difficulty == matrix side
   */
      difficulty = null,

  /**
   *  @desc matrix wrapper - DOM element
   */
      $wrapper = null,

  /**
   *  @desc app header - DOM element
   */
      $header = null,

  /**
   *  @desc app wrapper - DOM element
   */
      $app = null,

  /**
   *  @desc hash for store keys on Config.set()
   */
      sessionHash = null,

  /**
   *  @desc main object of public methods and an alias to it
   */
      $public = {},
      $pu = $public,

  /**
   *  @desc main object of private methods and an alias to it
   */
      $private = {},
      $pr = $private,

  /**
   *  @desc main object of factories and an alias to it
   */
      $factory = {},
      $fac = $factory;

  /**
   *  @desc init app flow
   */
  $public.init = function init(options) {
    console.log('Initializing AppModule');

    Config = Config || zz.cfg;
    Modal = Modal || zz.modal;
    Setup = Setup || zz.setup;

    difficulty = Config.get('difficulty');
    $wrapper = document.querySelector('.' + Config.getStatic('matrixWrapperClass'));
    $header = document.querySelector('.' + Config.getStatic('app').headerClass);
    $app = document.querySelector('.' + Config.getStatic('app').wrapperClass);

    sessionHash = Math.floor(new Date().getTime()*Math.random()*2).toString();

    $wrapper && $pr.prepareMatrix();
  };

  /**
   *  @desc initialize matrix layout
   */
  $private.prepareMatrix = function prepareMatrix() {
    matrix = new Array(difficulty);

    for (var i = 0; i < difficulty; i += 1) {
      matrix[i] = [];
    }

    $pr.startGame();
  };

  /**
   *  @desc call 2 essencial methods to start a new game
   */
  $private.startGame = function startGame() {
    $pr.resetDifficultyBanner();
    $pr.movements('reset');
    $pr.makeMatrix();
    $pr.draw();
  };

  /**
   *  @desc make matrix of difficulty^2 elements
   */
  $private.makeMatrix = function makeMatrix() {

    var row, col, obj, i, rand,
        arr = [],
        len = difficulty * difficulty;

    for (i = 0 ; i < len; i += 1) {
      row = Math.floor(i / difficulty);
      col = i % difficulty;
      obj = {
        row: row,
        col: col,
        observer: $private
      };

      rand = Math.ceil(Math.random() *  len) - 1;

      if (arr.indexOf(rand) !== -1) {
        i -= 1;
        continue;
      }

      arr.push(rand);
      obj.value = rand;

      if (rand === 0) {
        obj.pointer = true;
      }

      matrix[row][col] = $fac.Box(obj);
    }
  };

  /**
   *  @desc draw matrix with DOM elements
   */
  $private.draw = function draw() {

    var $frag = document.createDocumentFragment();

    $pr.each(function (box){
      var $boxWrapper = document.createElement('div');
      $boxWrapper.classList.add(Config.getStatic('boxWrapperClass'));
      $boxWrapper.appendChild(box.e);
      $frag.appendChild($boxWrapper);
    });

    $wrapper.innerHTML = '';
    $wrapper.appendChild($frag);
    $app.classList.remove(Config.getStatic('invisibleClass'));
  };

  /**
   *  @desc run matrix array and execute callback on each box
   *  @param {Function} cb
   */
  $private.each = function each(cb) {
    for (var i = 0; i < difficulty; i += 1) {

      for (var j = 0; j < difficulty; j += 1) {
        cb(matrix[i][j]);
      }

    }
  };

  /**
   *  @desc fired when a box is droped
   *  @param {Box} droped
   */
  $private.notify = function notify(droped) {
    $pr.each(function(box) {
      if (box.inRangeOf(droped)) {
        $pr.changePosition(box, droped);
      }
    });
  };

  /**
   *  @desc change position between two boxes
   *  @param {Box} from
   *  @param {Box} to
   */
  $private.changePosition = function changePosition(from, to) {
    if ($pr.areNeighbors(from, to)) {

      var aux = Object.create(matrix[from.row][from.col]);

      matrix[from.row][from.col] = to;
      matrix[to.row][to.col] = aux;

      aux.row = to.row;
      aux.col = to.col;
      to.row = from.row;
      to.col = from.col;

      $pr.movements('add');
      $pr.draw();
      $pr.checkState();
    }
  };

  /**
   *  @desc check the current state of the game
   */
  $private.checkState = function checkState() {

    var prev = 0,
        i, j, box, value;

    for (i = 0; i < difficulty; i++) {
      for (j = 0; j < difficulty; j++) {

        box = matrix[i][j];
        value = box.value ? box.value : difficulty * difficulty;

        if (value > prev) {
          prev = value;
          continue;
        }

        return;
      }
    }
    $pr.endGame();
  };

  /**
   *  @desc prepare to end the game and show an message
   */
  $private.endGame = function endGame() {
    Modal.changeToTemplate('confirm', {
      title: 'Parabéns!',
      content: 'Você terminou o jogo com ' +
                '<strong>' + Config.get('movements', sessionHash) +
                ' movimentos</strong> no <strong>nível ' +
                (difficulty - 2) + '</strong>.',
      btnConfirmMessage: 'Jogar novamente',
      confirmCallback: $pr.startGame,
      btnDeclineMessage: 'Mudar dificuldade',
      btnDeclineColor: 'green',
      declineCallback: $pr.changeDifficulty
    }).show();
  };

  $private.changeDifficulty = function changeDifficulty() {
    if (zipzap.setup && zipzap.setup.changeDifficulty) {
      zipzap.setup.changeDifficulty();
    }
  };

  /**
   *  @desc check if two boxes are neighbors in all possibilities
   *  @param {Box} first
   *  @param {Box} second
   */
  $private.areNeighbors = function areNeighbors(first, second) {
    return $pr.checkNeighborhood(first, second) || $pr.checkNeighborhood(second, first);
  };

  /**
   *  @desc check if two boxes are neighbors
   *  @param {Box} first
   *  @param {Box} second
   */
  $private.checkNeighborhood = function checkNeighborhood(first, second) {

    var condX = first.col == (second.col - 1) || first.col == (second.col + 1),
        condY = first.row == second.row,
        condW = first.row == (second.row - 1) || first.row == (second.row + 1),
        condZ = first.col == second.col;

    return (condX && condY) || (condW && condZ);
  };

  /**
   *  @desc add a movement to counter or clear it
   *  @param {String} action
   *  @param {Number} num - optional
   */
  $private.movements = function movements(action, num) {

    var counter = document.querySelector('.' + Config.getStatic('counterClass')),
        movs = Config.get('movements', sessionHash);

    switch (action) {

      case 'add':
        movs = num ? movs + num : movs + 1;
        counter.innerText = movs;
        Config.set('movements', movs, true, sessionHash);
        break;

      case 'reset':
        Config.set('movements', 0, true, sessionHash);
        counter.innerText = 0;
        break;

    }
  };

  /**
   *  @desc setup text of the difficulty banner
   */
  $private.resetDifficultyBanner = function resetDifficultyBanner() {

    var elClass = Config.getStatic('app').difficultyNumberClass,
        $banner = document.querySelector('.' + elClass);

    $banner.innerText = difficulty - 2;
  };

  /**
   *  @desc get the pointer box
   *  @return {Box}
   */
  $private.getPointer = function getPointer() {
    var ret = null;
    $pr.each(function (box) {
      if (box.pointer) ret = box;
    });
    return ret;
  };

  /**
   *  @desc box factory
   *  @param {Object} options
   */
  $factory.Box = function Box(options) {
    if (!(this instanceof Box)) {
      return new $factory.Box(options);
    }
    this.e = document.createElement('div');
    this.row = options.row;
    this.col = options.col;
    this.observer = options.observer;
    this.target = null;
    this.pointer = options.pointer || false;
    this.value = !isNaN(options.value) ? options.value : null;

    this.init();
  };

  $factory.Box.prototype = {

    /**
     *  @desc helper properties ("varibles")
     */
    dif: null,
    touchStart: null,
    touchMove: null,
    touchEnd: null,

    /**
     *  @desc method called once to initialize a Box
     */
    init: function() {
      this.setupStyle();
      this.setupContent();
      this.touchMove = this.onTouchMove.bind(this);
      this.touchEnd = this.onTouchEnd.bind(this);
      this.touchStart = this.onTouchStart.bind(this);
      !this.pointer && this.addStartEvent();
    },

    /**
     *  @desc setup all the style of a Box
     */
    setupStyle: function setupStyle() {

      var classlist = this.e.classList;

      classlist.add(Config.getStatic('boxClass'));
      this.pointer && classlist.add(Config.getStatic('boxPointerClass'));
    },

    /**
     *  @desc setup the content of a Box
     */
    setupContent: function setupContent() {
      this.e.innerHTML = this.value;
    },

    /**
     *  @desc return position of the Box relative to window
     *  @return {Object}
     */
    getPosition: function getPosition() {
      return {
        x: parseFloat(this.e.offsetLeft),
        y: parseFloat(this.e.offsetTop)
      };
    },

    /**
     *  @desc return width and height
     *  @return {Object}
     */
    getBounds: function getBounds() {
      return {
        width: this.e.offsetWidth,
        height: this.e.offsetHeight
      };
    },

    /**
     *  @desc add mousedown/touchstart event to HTMLElement
     */
    addStartEvent: function addEvents() {
      this.e.addEventListener(Config.EventType.touchstart, this.touchStart);
    },

    /**
     *  @desc add mousemove/touchmove and mouseup/touchend event to document
     */
    addMovingEvents: function addMovingEvents() {
      document.addEventListener(Config.EventType.touchmove, this.touchMove);
      document.addEventListener(Config.EventType.touchend, this.touchEnd);
    },

    /**
     *  @desc remove mousemove/touchmove and mouseup/touchend event from document
     */
    removeEvents: function removeEvents() {
      document.removeEventListener(Config.EventType.touchmove, this.touchMove);
      document.removeEventListener(Config.EventType.touchend, this.touchEnd);
    },

    /**
     * @desc check if this box can move to another place
     */
    canMove: function canMove() {
      return this.observer.areNeighbors(this, this.observer.getPointer());
    },

    /**
     *  @desc handler for mousedown/touchstart event
     */
    onTouchStart: function onTouchStart(event) {
      if (!this.canMove()) {
        return;
      } else {
        return this.observer.changePosition(this.observer.getPointer(), this);
      }

      var touch = Config.translateEventPosition(event),
          position = this.getPosition();

      event.preventDefault();

      this.dif = {
        x: touch.x - position.x,
        y: touch.y - position.y
      };
      this.e.classList.add(Config.getStatic('boxMovingClass'));
      this.addMovingEvents();
    },

    /**
     *  @desc handler for mousemove/touchmove on document
     */
    onTouchMove: function onTouchMove(event) {

      var touch = Config.translateEventPosition(event),
          style = this.e.style;

      event.preventDefault();
      style.top = (touch.y - this.dif.y) + 'px';
      style.left = (touch.x - this.dif.x) + 'px';
    },

    /**
     *  @desc handler for mouseup/touchend on document
     */
    onTouchEnd: function onTouchEnd(event) {

      var touch = Config.translateEventPosition(event),
          style = this.e.style;

      event.preventDefault();

      this.target = {
        x: parseInt(touch.x),
        y: parseInt(touch.y)
      };
      this.e.classList.remove(Config.getStatic('boxMovingClass'));

      style.top = '';
      style.left = '';

      this.removeEvents();
      this.observer.notify(this);
    },

    /**
     *  @desc method called by the main observer to check if
     *        this box is in range of the mouseup/touchend event
     */
    inRangeOf: function inRangeOf(box) {
      return this.inMyRange(box) && this.pointer;
    },

    /**
     *  @desc method encapsulating the logic of inRangeOf method
     */
    inMyRange: function inMyRange(box) {

      var target = box.target,
          pos = this.getPosition(),
          bounds = this.getBounds(),
          ax = pos.x <= target.x && target.x <= (pos.x + bounds.width),
          ay = pos.y <= target.y && target.y <= (pos.y + bounds.height);

      return ax && ay;
    }
  };

  /**
   *  @desc export public methods to main namespace
   */
  zz.app = $public;

}(this.zipzap = this.zipzap || {}));

;(function SetupModule(zz, undefined) {
  'use strict';

  /**
   *  @desc instatiating modules
   */
  var Config = zz.cfg,
      Modal = zz.modal,
      App = zz.app,

  /**
   *  @desc main object of public methods
   */
      $public = {},
      $pu = $public,

  /**
   *  @desc main object of private methods
   */
      $private = {},
      $pr = $private,

  /**
   *  @desc allow user to setup the main app
   *  @type boolean
   */
      allowUserSetup = true,

  /**
   *  @desc game difficulty for future use
   */
      difficulty = null,

  /**
   *  @desc previous difficulty to handle style setup
   */
      previousDifficulty = null,

  /**
   *  @desc game max difficulty based on screen width
   */
      maxDifficulty = null;

  /**
   *  @desc setup status
   */
  $pu.done = false;

  /**
   *  @desc init setup flow
   */
  $public.init = function() {
    console.log('Initializing SetupModule');
    $pr.prepare();
    if (allowUserSetup) {
      $pr.initUserSetup();
    } else {
      $pr.configDifficulty();
    }
  };

  /**
   *  @desc public method to allow users to change the app difficulty
   *        during the game.
   */
  $public.changeDifficulty = function changeDifficulty() {
    previousDifficulty = Config.get('difficulty');
    $pr.configDifficulty({
      title: 'Modificar dificuldade',
      showCloseButton: true
    });
  };

  /**
   *  @desc prepare Setup to handle tutorial flow if was already viewed or not
   *        and calculate the maximum difficulty of the app.
   */
  $private.prepare = function prepare() {
    var viewed = localStorage.getItem('tutorial');
    if (viewed) {
      allowUserSetup = false;
    }
    maxDifficulty = ( Config.resolveAppBounds() / 40 ) - 2;
  };

  /**
   *  @desc setup events
   */
  $private.setupEvents = function setupEvents() {
    var elClass = '.' + Config.getStatic('app').difficultyChangeClass,
        $diffChange = document.querySelector(elClass);
    $diffChange.addEventListener(Config.EventType.touchstart, $pu.changeDifficulty);
  };

  /**
   *  @desc configure CSS of boxes and app wrapper relative to device width
   */
  $private.configBoundsAndStyles = function configBoundsAndStyles() {
    var difficulty = Config.get('difficulty'),
        maxAppWidth = Config.resolveAppBounds(),
        appWrapper = '.' + Config.getStatic('app').wrapperClass,
        boxWrapper = '.' + Config.getStatic('boxWrapperClass'),
        box = '.' + Config.getStatic('boxClass'),
        pointer = '.' + Config.getStatic('boxPointerClass'),
        size = maxAppWidth/difficulty,
        fontSize = size/2.5 > 32 ? 32 : size/2.5,
        $style = document.querySelector('style') || document.createElement('style'),
        padding = 2,
        css = '';
    css += appWrapper + '{' +
              'width: ' + maxAppWidth + 'px;' +
            '}';
    css += boxWrapper + '{' +
              'width: ' + size + 'px;' +
              'height: ' + size + 'px;' +
              'padding: 1px' +
            '}';
    css += box + ', ' + pointer + '{' +
              'width: ' + (size - padding) + 'px;' +
              'height: ' + (size - padding) + 'px;' +
              'font-size: ' + fontSize + 'px;' +
              'line-height: ' + (size - padding) + 'px;' +
            '}';
    $style.appendChild(document.createTextNode(css));
    document.head.appendChild($style);
  };
  /**
   *  @desc init setup flow - user can start a game or configure app difficulty
   */
  $private.initUserSetup = function initUserSetup() {
    Modal.changeToTemplate('confirm', {
      title: 'Bem vindo ao ZipZap!',
      content: '<strong>ZipZap</strong> é um simples jogo de ordenação de números.<br><br>' +
                'Quer saber mais sobre o jogo e até <strong>configurá-lo</strong>?',
      btnConfirmMessage: 'Sim',
      btnDeclineMessage: 'Não',
      confirmCallback: $pr.showTutorial,
      declineCallback: $pr.finishSetup
    }).show();
  };

  /**
   *  @desc shows a simple tutorial about the game
   */
  $private.showTutorial = function showTutorial() {
    Modal.setContent({
      title: 'Bem vindo ao ZipZap!',
      content: 'Seu objetivo será movimentar todos os <strong>tiles</strong> (quadrados) ' +
                'de maneira que fiquem <strong>ordenados</strong> a partir da esquerda ' +
                'para a direita, linha por linha. ' +
                'O tile <strong>curinga</strong> deve ficar no canto inferior direito.' +
                '<br><br>' +
                'Você ainda pode escolher o <strong>nível de dificuldade</strong> ' +
                'que deseja jogar. ' +
                'Por padrão, o jogo começa no primeiro nível de dificuldade, ' +
                'com um 9 tiles. Deseja modificar a dificuldade?',
      btnConfirmMessage: 'Sim',
      btnDeclineMessage: 'Não, quero jogar!',
      confirmCallback: $pr.configDifficulty,
      declineCallback: $pr.finishSetup
    }).show();
  };

  /**
   *  @desc show a combo box with based on maximum difficulty of the game
   */
  $private.configDifficulty = function configDifficulty(options) {
    var str = '';
    for (var i = 2; i < maxDifficulty; i++) {
      str += '<option value="' + i + '">Nível ' + i + '</option>';
    }
    Modal.changeToTemplate('alert', {
      title: options && options.title ? options.title : 'Dificuldade',
      showCloseButton: options && options.showCloseButton ? options.showCloseButton : false,
      content: 'Por favor, selecione o nível de dificuldade que deseja jogar: <br><br>' +
                '<select class="app-difficulty-select">' +
                  '<option value="1" selected>Nível 1</option>' +
                  str +
                '</select>',
      btnText: 'Jogar!',
      btnCallback: $pr.setDifficulty
    }).show();
  };

  /**
   *  @desc save the difficulty selected and a flag on localStorage the
   *        the user has done the tutorial
   */
  $private.setDifficulty = function setDifficulty() {
    var select = document.querySelector('.app-difficulty-select'),
        diff = Number(select.value) + 2;
    Config.set('difficulty', diff, true);
    localStorage.setItem('tutorial', true);
    $pr.finishSetup();
  };

  /**
   *  @desc finish Setup and init the App.
   */
  $private.finishSetup = function finishSetup() {
    Modal.reset().hide();
    if (!previousDifficulty || previousDifficulty !== Config.get('difficulty')) {
      $pr.configBoundsAndStyles();
    }
    App.init();
    $pr.setupEvents();
  };

  /**
   *  @desc export public methods to main namespace
   */
  zz.setup = $public;

}(this.zipzap = this.zipzap || {}));

;(function LoadModule(zz, undefined) {
  'use strict';

  /**
   *  @desc instatiating modules
   */
  var Modal = zz.modal,
      Config = zz.cfg,
      Setup = zz.setup,
      App = zz.app,

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
  };

  /**
   *  @desc export public methods to main namespace
   */
  zz.load = $public;

  /**
   *  @desc init application
   */
  $pr.init();

}(this.zipzap = this.zipzap || {}));
