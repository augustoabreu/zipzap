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
    $pr.moviments('reset');
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

      $pr.moviments('add');
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
                '<strong>' + Config.get('moviments', sessionHash) +
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
   *  @desc {Box} first
   *  @desc {Box} second
   */
  $private.areNeighbors = function areNeighbors(first, second) {
    return $pr.checkNeighborhood(first, second) || $pr.checkNeighborhood(second, first);
  };

  /**
   *  @desc check if two boxes are neighbors
   *  @desc {Box} first
   *  @desc {Box} second
   */
  $private.checkNeighborhood = function checkNeighborhood(first, second) {

    var condX = first.col == (second.col - 1) || first.col == (second.col + 1),
        condY = first.row == second.row,
        condW = first.row == (second.row - 1) || first.row == (second.row + 1),
        condZ = first.col == second.col;

    return (condX && condY) || (condW && condZ);
  };

  /**
   *  @desc add a moviment to counter or clear it
   */
  $private.moviments = function moviments(action, num) {

    var counter = document.querySelector('.' + Config.getStatic('counterClass')),
        movs = Config.get('moviments', sessionHash);

    switch (action) {

      case 'add':
        movs = num ? movs + num : movs + 1;
        counter.innerText = movs;
        Config.set('moviments', movs, true, sessionHash);
        break;

      case 'reset':
        Config.set('moviments', 0, true, sessionHash);
        counter.innerText = 0;
        break;

    }
  };

  $private.resetDifficultyBanner = function resetDifficultyBanner() {

    var elClass = Config.getStatic('app').difficultyNumberClass,
        $banner = document.querySelector('.' + elClass);

    $banner.innerText = difficulty - 2;
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
     *  @desc handler for mousedown/touchstart event
     */
    onTouchStart: function onTouchStart(event) {

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
     *   this box is in range of the mouseup/touchend event
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
