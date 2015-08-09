/**
 *  @desc instatiating modules
 */
var Config = require('./config'),
    Modal = require('./modal'),
    App = require('./app'),

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
  var viewed;
  try {
    viewed = localStorage.getItem('tutorial');
  } catch(e) {
    console.log('error on localstorage', e);
  }
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
    str += '<option value="' + i + '"' +
            (i === previousDifficulty - 2 ? 'selected="selected"' : '') +
            '>Nível ' + i + '</option>';
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
  try {
    localStorage.setItem('tutorial', true);
  } catch(e) {
    console.log('error on localstorage', e);
  }
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
module.exports = $public;
