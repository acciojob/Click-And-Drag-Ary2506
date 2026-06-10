var CUBE_SIZE = 80;
var COLS = 4;
var GAP = 20;

function init() {
  var container = document.getElementById('container');
  var cubes = document.querySelectorAll('.cube');
  var cw = container.offsetWidth;
  var ch = container.offsetHeight;
  var total = cubes.length;
  var rows = Math.ceil(total / COLS);
  var gridW = COLS * CUBE_SIZE + (COLS - 1) * GAP;
  var gridH = rows * CUBE_SIZE + (rows - 1) * GAP;
  var startX = Math.floor((cw - gridW) / 2);
  var startY = Math.floor((ch - gridH) / 2);

  for (var i = 0; i < cubes.length; i++) {
    var col = i % COLS;
    var row = Math.floor(i / COLS);
    var x = startX + col * (CUBE_SIZE + GAP);
    var y = startY + row * (CUBE_SIZE + GAP);
    cubes[i].style.left = x + 'px';
    cubes[i].style.top = y + 'px';
    addDrag(cubes[i], container);
  }
}

function addDrag(cube, container) {
  cube.addEventListener('mousedown', function(e) {
    e.preventDefault();

    var rect = container.getBoundingClientRect();
    var offsetX = e.clientX - rect.left - parseInt(cube.style.left);
    var offsetY = e.clientY - rect.top - parseInt(cube.style.top);

    cube.classList.add('dragging');

    function onMouseMove(e) {
      var x = e.clientX - rect.left - offsetX;
      var y = e.clientY - rect.top - offsetY;
      var maxX = container.offsetWidth - CUBE_SIZE;
      var maxY = container.offsetHeight - CUBE_SIZE;
      if (x < 0) x = 0;
      if (y < 0) y = 0;
      if (x > maxX) x = maxX;
      if (y > maxY) y = maxY;
      cube.style.left = x + 'px';
      cube.style.top = y + 'px';
    }

    function onMouseUp() {
      cube.classList.remove('dragging');
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
}

window.onload = init;