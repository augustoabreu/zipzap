//
//  ZIP ZAP GAME
//  V 0.0.9
//

(function(window) {
  'use strict';

  window.zipzap = window.zipzap || {};
  
  //
  // Variables declarations
  var difficulty = 3,
    matrix = [],
    currentZeroPosition = {
      line: null,
      collum: null
    },
    movimentsCounter = 0,
    currentDrag = null;
  //
  // App

  zipzap.test = function test() {
    printMatrix();
    changePosition('left', {
      line: 0,
      collum: 1
    });
    printMatrix();
    changePosition('left', {
      line: 0,
      collum: 2
    });
    printMatrix();
    changePosition('top', {
      line: 1,
      collum: 2
    });
    printMatrix();
    changePosition('top', {
      line: 2,
      collum: 2
    });
    printMatrix();
    changePosition('right', {
      line: 2,
      collum: 1
    });
    printMatrix();
    changePosition('bottom', {
      line: 1,
      collum: 1
    });
    printMatrix();
    changePosition('right', {
      line: 1,
      collum: 0
    });
    printMatrix();
    changePosition('top', {
      line: 2,
      collum: 0
    });
    printMatrix();
    changePosition('left', {
      line: 2,
      collum: 1
    });
    printMatrix();
  };

  zipzap.makeMatrix = makeMatrix;
  zipzap.printMatrix = printMatrix;
  zipzap.makeDOMElements = makeDOMElements;
  zipzap.attachEvents = attachEvents;
  zipzap.init = init;
  init();

  //
  // Functions declarations

  function init() {
    makeMatrix();
    makeDOMElements();
    attachEvents();
  };

  function locationOnMatrix(val) {
    if(!val) return;
    for (var i = 0; i < difficulty; i++) {
      for (var j = 0; j < difficulty; j++) {
        if (matrix[i][j] === val) {
          return {
            line: i,
            collum: j
          };
        }
      }
    }
  };

  function compareMoviment(to, from) {
    if (!to || !from || typeof to !== 'object' || typeof from !== 'object') return;
    if (to.line === from.line) {
      if (to.collum < from.collum) {
        return 'left';
      } else {
        return 'right';
      }
    }
    if (to.collum === from.collum) {
      if (to.line < from.line) {
        return 'top';
      } else {
        return 'bottom';
      }
    }
  };

  var encloseEvents = {
      handleDragStart: function handleDragStart(e) {
        var el = e.target;
        currentDrag = el;
      },
      handleDragEnd: function handleDragEnd(e) {},
      handleDrop: function handleDrop(e) {
        var number = Number(e.target.innerHTML);
        if (number === 0) {
          var location = locationOnMatrix(Number(currentDrag.innerHTML)),
            direction = compareMoviment(currentZeroPosition, location);
          changePosition(direction, location);
        } else {
          console.log('Ops! Wrong moviment!');
        }
        currentDrag = null;
        attachEvents();
      },
      handleDragOver: function handleDragOver(e) {
        e.preventDefault();
      }
  };

  function attachEvents() {
    var boxes = document.querySelectorAll('.matrix-box'),
      l = boxes.length;
    [].forEach.call(boxes, function(e, i) {
      e.addEventListener('dragstart', encloseEvents.handleDragStart);
      e.addEventListener('dragend', encloseEvents.handleDragEnd);
      e.addEventListener('drop', encloseEvents.handleDrop);
      e.addEventListener('dragover', encloseEvents.handleDragOver);
    });
  };

  function makeMatrix() {
    var aux = [],
      rand = function rand(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
      };
    for (var i = 0; i < difficulty; i++) {
      matrix[i] = [];
      for (var j = 0; j < difficulty; j++) {
        var number = rand(0, (difficulty * difficulty));
        if (aux.indexOf(number) !== -1) {
          j--;
          continue;
        }
        aux.push(number);
        matrix[i][j] = number;
        if (number === 0) {
          currentZeroPosition = {
            line: i,
            collum: j
          };
        }
      }
    }
  };

  function makeDOMElements() {
    var wrapper = document.querySelector('.matrix-wrap'),
      htmlCache = '';
    for (var i = 0; i < difficulty; i++) {
      var newLine = document.createElement('div');
      newLine.setAttribute('class', 'matrix-line');
      for (var j = 0; j < difficulty; j++) {
        var newBox = document.createElement('div');
        newBox.setAttribute('class', 'matrix-box');
        newBox.setAttribute('draggable', 'true');
        newBox.innerHTML = matrix[i][j];
        newLine.innerHTML += newBox.outerHTML;
      }
      htmlCache += newLine.outerHTML;
    }
    wrapper.innerHTML = htmlCache;
    document.querySelector('.moviments').innerHTML = movimentsCounter;
  };

  function printMatrix() {
    var str = '',
      l = matrix.length;
    for (var i = 0; i < l; i++) {
      str += '#' + i + '|';
      for (var j = 0; j < l; j++) {
        str += matrix[i][j] + ' ';
      }
      console.log(str);
      str = '';
    }
  };

  function changePosition(to, pos) {
    if (!to || !pos || typeof pos !== 'object') return;
    if (to === 'left') {
      var futurePosition = {
        line: pos.line,
        collum: (pos.collum - 1)
      };
      move(futurePosition, moveLeft);
      return;
    }
    if (to === 'right') {
      var futurePosition = {
        line: pos.line,
        collum: (pos.collum + 1)
      }
      move(futurePosition, moveRight);
      return;
    }
    if (to === 'top') {
      var futurePosition = {
        line: (pos.line - 1),
        collum: pos.collum
      }
      move(futurePosition, moveTop);
      return;
    }
    if (to === 'bottom') {
      var futurePosition = {
        line: (pos.line + 1),
        collum: pos.collum
      }
      move(futurePosition, moveBottom);
      return;
    }
  };

  function move(pos, callback) {
    var check = checkLimits(pos);
    if (check.stats) {
      callback(pos);
      return;
    } else {
      console.log('Can\'t move to ' + pos + '. Reason: ' + check.error);
    }
  };

  function checkLimits(pos) {
    if (pos.line >= difficulty || pos.line < 0) {
      return {
        stats: false,
        error: 'Line out of bounds'
      };
    }
    if (pos.collum >= difficulty || pos.collum < 0) {
      return {
        stats: false,
        error: 'Collum out of bounds'
      };
    }
    return {
      stats: true
    };
  };

  function changeValue(to, from) {
    if (typeof to !== 'object' || typeof from !== 'object') return;
    if (to.value === 0) {
      matrix[to.line][to.collum] = from.value;
      matrix[from.line][from.collum] = to.value;
      currentZeroPosition = {
        line: from.line,
        collum: from.collum
      };
      movimentsCounter++;
      makeDOMElements();
    } else {
      console.log('Oops! Changing position to occuping space');
    }
  };

  function moveLeft(pos) {
    if (typeof pos !== 'object') return;
    var pastPosition = {
      line: pos.line,
      collum: pos.collum + 1,
      value: matrix[pos.line][(pos.collum + 1)]
    };
    pos.value = matrix[pos.line][pos.collum];
    changeValue(pos, pastPosition);
  };

  function moveRight(pos) {
    if (typeof pos !== 'object') return;
    var pastPosition = {
      line: pos.line,
      collum: pos.collum - 1,
      value: matrix[pos.line][(pos.collum - 1)]
    };
    pos.value = matrix[pos.line][pos.collum];
    changeValue(pos, pastPosition);
  };

  function moveTop(pos) {
    if (typeof pos !== 'object') return;
    var pastPosition = {
      line: pos.line + 1,
      collum: pos.collum,
      value: matrix[(pos.line + 1)][pos.collum]
    };
    pos.value = matrix[pos.line][pos.collum];
    changeValue(pos, pastPosition);
  };

  function moveBottom(pos) {
    if (typeof pos !== 'object') return;
    var pastPosition = {
      line: (pos.line - 1),
      collum: pos.collum,
      value: matrix[(pos.line - 1)][pos.collum]
    };
    pos.value = matrix[pos.line][pos.collum];
    changeValue(pos, pastPosition);
  };
}(window));
