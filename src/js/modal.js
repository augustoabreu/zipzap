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
   *  @param <options> : object - optional
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
