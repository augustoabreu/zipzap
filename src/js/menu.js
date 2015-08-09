/**
 *  @desc instatiating modules
 */
var Config = require('./config'),
    Modal = require('./modal'),

/**
 *  @desc app menu - DOM element
 */
    $menu = null,

/**
 *  @desc main object of public methods and an alias to it
 */
    $public = {},
    $pu = $public,

/**
 *  @desc main object of private methods and an alias to it
 */
    $private = {},
    $pr = $private;

/**
 *  @desc init menu module
 */
$public.init = function init() {
  $menu = document.querySelector('.' + Config.getStatic('app').menuClass);

  $private.setupEvents();
};

/**
 *  @desc setup events for Menu Module
 */
$private.setupEvents = function setupEvents() {
  $menu.addEventListener('click', $pr.handleClick);
};

/**
 *  @desc method to handle click on menu
 *  @param {HTMLEvent} event
 */
$private.handleClick = function handleClick(event) {
  var menu = event.target.hash.replace('#', '');

  if (menu === 'instruction') $private.openInstructions();
  if (menu === 'configuration') $private.openConfiguration();
  if (menu === 'about') $private.openAbout();
};

/**
 *  @desc send instructions data to openModal method
 */
$private.openInstructions = function openInstructions() {
  $pr.showModal({
    title: 'Instruções',
    content: 'Seu objetivo será movimentar todos os <strong>tiles</strong> (quadrados) ' +
              'de maneira que fiquem <strong>ordenados</strong> a partir da esquerda ' +
              'para a direita, linha por linha. ' +
              'O tile <strong>curinga</strong> deve ficar no canto inferior direito.'
  });
};

/**
 *  @desc prepare and send configuration data to openModal method
 */
$private.openConfiguration = function openConfiguration() {
  var styles = Config.getStatic('touchStyles'),
      $p = document.createElement('p'),
      $radio, $text, $paragraph, $label;

  $text = '<strong>Selecione o estilo de movimentação: </strong>';
  $p.innerHTML = $text;

  styles.forEach(function(style) {
    $radio = document.createElement('input');
    $radio.type = 'radio';
    $radio.name = 'touch_style';
    $radio.id = 'touch_' + style.name;
    $radio.value = style.name;
    $radio.checked = style.name === Config.get('touchStyle');
    $radio.addEventListener('click', $pr.onRadioClick);

    $label = document.createElement('label');
    $label.setAttribute('for', 'touch_' + style.name);

    $text = document.createTextNode(' ' + style.fullName);
    $label.appendChild($text);

    $paragraph = document.createElement('p');
    $paragraph.appendChild($radio);
    $paragraph.appendChild($label);

    $p.appendChild($paragraph);
  });

  $pr.showModal({
    title: 'Configurações',
    content: $p
  });
};

/**
 *  @desc handler for radio button click that changes
 *        the behaviour of tiles' movements
 *  @param {HTMLEvent} event
 */
$private.onRadioClick = function onRadioClick(event) {
  var val = event.target.value,
      types = Config.getStatic('touchStyles'),
      check = types.some(function(type) {
        return type.name == val;
      });
  if (!check) return;
  Config.set('touchStyle', val, true);
};

/**
 *  @desc send about data to openModal method
 */
$private.openAbout = function openAbout() {
  $pr.showModal({
    title: 'ZipZap',
    content:  '<p></p>'
  });
};

/**
 *  @desc opens modal with data passed by
 *  @param {Object} content
 */
$private.showModal = function showModal(content) {
  Modal.changeToTemplate('modal', content).show();
};

/**
 *  @desc export public methods to main namespace
 */
module.exports = $public;
