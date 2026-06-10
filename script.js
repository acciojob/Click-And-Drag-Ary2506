const LABELS    = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const CUBE_SIZE = 70;
const COLS      = 4;
const GAP       = 20;

const container = document.getElementById('container');
const statusEl  = document.getElementById('status');

function buildGrid() {
  container.innerHTML = '';

  // Use actual width, fallback to 300 if still 0
  const cw = container.clientWidth  || 300;
  const ch = container.clientHeight || 400;

  const rows   = Math.ceil(LABELS.length / COLS);
  const gridW  = COLS * CUBE_SIZE + (COLS - 1) * GAP;
  const gridH  = rows * CUBE_SIZE + (rows - 1) * GAP;
  const startX = Math.max(10, Math.floor((cw - gridW) / 2));
  const startY = Math.max(10, Math.floor((ch - gridH) / 2));

  LABELS.forEach(function(label, i) {
    const col  = i % COLS;
    const row  = Math.floor(i / COLS);
    const x    = startX + col * (CUBE_SIZE + GAP);
    const y    = startY + row * (CUBE_SIZE + GAP);

    const cube = document.createElement('div');
    cube.className   = 'cube c' + ((i % 8) + 1);
    cube.textContent = label;
    cube.style.left  = x + 'px';
    cube.style.top   = y + 'px';

    attachDrag(cube);
    container.appendChild(cube);
  });
}

function attachDrag(cube) {
  cube.addEventListener('mousedown', onDragStart);
  cube.addEventListener('touchstart', onDragStart, { passive: false });
}

function onDragStart(e) {
  e.preventDefault();

  const isTouch  = e.type === 'touchstart';
  const pointer  = isTouch ? e.touches[0] : e;
  const rect     = container.getBoundingClientRect();
  const startX   = parseInt(cube.style.left, 10);
  const startY   = parseInt(cube.style.top,  10);
  const offsetX  = pointer.clientX - rect.left - startX;
  const offsetY  = pointer.clientY - rect.top  - startY;

  var cube     = this;
  var moved    = false;

  cube.classList.add('dragging');
  setStatus('Dragging cube <span>' + cube.textContent + '</span>...');

  function onMove(ev) {
    moved       = true;
    var pt      = ev.touches ? ev.touches[0] : ev;
    var cx      = pt.clientX - rect.left;
    var cy      = pt.clientY - rect.top;
    var maxX    = container.clientWidth  - CUBE_SIZE;
    var maxY    = container.clientHeight - CUBE_SIZE;
    var newX    = Math.max(0, Math.min(cx - offsetX, maxX));
    var newY    = Math.max(0, Math.min(cy - offsetY, maxY));
    cube.style.left = newX + 'px';
    cube.style.top  = newY + 'px';
  }

  function onUp() {
    cube.classList.remove('dragging');
    if (moved) {
      setStatus('Cube <span>' + cube.textContent + '</span> dropped at (' +
        parseInt(cube.style.left) + ', ' + parseInt(cube.style.top) + ')');
    } else {
      setStatus('Ready — try dragging a cube!');
    }
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup',   onUp);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend',  onUp);
  }

  if (isTouch) {
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend',  onUp);
  } else {
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup',   onUp);
  }
}

function setStatus(html) {
  statusEl.innerHTML = html;
}

// THREE-LAYER safety net for iframe / slow environments
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(buildGrid,