'use strict';

// Every stack is stored bottom → top. Offline-verified solution paths accompany
// the predefined boards; no random board generation takes place in the game.
const levels = [
  {
    colors: ["red","blue","yellow"],
    tubes: [
      ["blue","blue","blue","red"],
      ["yellow","yellow","red","blue"],
      ["red","yellow","red","yellow"],
      [],
      []
    ],
    solution: [[0,3],[1,0],[3,1],[2,3],[1,2],[1,4],[3,1],[2,4],[2,4],[2,1],[2,4]]
  },
  {
    colors: ["red","blue","yellow"],
    tubes: [
      ["yellow","blue","red","blue"],
      ["blue","red","yellow","blue"],
      ["red","yellow","yellow","red"],
      [],
      []
    ],
    solution: [[0,3],[2,0],[1,3],[1,2],[0,1],[0,1],[0,3],[2,0],[2,0],[2,0],[1,2],[1,2],[1,2],[1,3]]
  },
  {
    colors: ["red","blue","yellow"],
    tubes: [
      ["yellow","red","red","red"],
      ["yellow","blue","blue","blue"],
      ["red","yellow","blue","yellow"],
      [],
      []
    ],
    solution: [[0,3],[0,3],[0,3],[2,0],[1,2],[1,4],[2,1],[2,1],[0,2],[0,2],[1,4],[1,4],[1,4],[2,1],[2,1],[2,1],[2,3]]
  },
  {
    colors: ["red","blue","yellow","green"],
    tubes: [
      ["green","yellow","red","red"],
      ["blue","green","green","green"],
      ["red","blue","yellow","yellow"],
      ["yellow","blue","blue","red"],
      [],
      []
    ],
    solution: [[0,4],[3,0],[0,4],[0,4],[2,0],[2,0],[2,3],[2,4],[0,2],[0,2],[0,2],[1,0],[1,0],[1,0],[3,1],[3,1],[3,1],[3,2]]
  },
  {
    colors: ["red","blue","yellow","green"],
    tubes: [
      ["red","green","yellow","red"],
      ["blue","red","green","blue"],
      ["blue","yellow","green","yellow"],
      ["blue","green","red","yellow"],
      [],
      []
    ],
    solution: [[0,4],[2,0],[0,5],[3,0],[4,3],[0,5],[0,5],[0,2],[3,0],[3,0],[2,3],[2,3],[2,5],[1,2],[3,1],[1,4],[1,3],[1,0],[1,2],[3,4],[3,4],[3,4],[3,2]]
  },
  {
    colors: ["red","blue","yellow","green"],
    tubes: [
      ["blue","green","yellow","red"],
      ["green","yellow","blue","blue"],
      ["green","blue","yellow","red"],
      ["red","red","yellow","green"],
      [],
      []
    ],
    solution: [[0,4],[2,4],[0,2],[3,0],[2,3],[0,5],[3,2],[0,5],[2,3],[1,0],[3,2],[1,0],[1,3],[1,5],[2,1],[3,2],[2,1],[2,3],[2,0],[2,5],[3,1],[3,1],[3,4],[3,4]]
  },
  {
    colors: ["red","blue","yellow","green","purple"],
    tubes: [
      ["green","green","blue","purple"],
      ["yellow","red","green","yellow"],
      ["red","red","red","yellow"],
      ["purple","yellow","purple","purple"],
      ["green","blue","blue","blue"],
      [],
      []
    ],
    solution: [[0,5],[4,0],[3,5],[0,4],[3,5],[4,0],[1,3],[0,4],[2,3],[4,0],[0,6],[0,4],[0,1],[4,6],[4,6],[4,6],[0,4],[1,4],[1,4],[1,2],[3,1],[3,1],[3,1],[3,5]]
  },
  {
    colors: ["red","blue","yellow","green","purple"],
    tubes: [
      ["green","blue","green","blue"],
      ["red","yellow","yellow","blue"],
      ["purple","green","yellow","purple"],
      ["purple","red","red","yellow"],
      ["green","red","purple","blue"],
      [],
      []
    ],
    solution: [[0,5],[1,5],[3,1],[4,5],[2,4],[1,2],[0,6],[0,5],[2,1],[0,6],[1,2],[1,0],[2,1],[2,1],[2,6],[1,0],[1,0],[1,0],[1,3],[4,2],[4,2],[3,4],[3,4],[3,1],[3,2],[4,1],[4,1],[4,1],[4,6]]
  },
  {
    colors: ["red","blue","yellow","green","purple"],
    tubes: [
      ["yellow","green","yellow","red"],
      ["purple","green","purple","blue"],
      ["yellow","blue","red","blue"],
      ["green","yellow","red","purple"],
      ["blue","red","purple","green"],
      [],
      []
    ],
    solution: [[0,5],[0,6],[4,0],[3,4],[5,3],[0,5],[0,5],[0,6],[3,0],[3,0],[3,6],[3,5],[1,3],[4,1],[2,3],[0,2],[1,4],[2,0],[2,0],[4,1],[2,3],[1,4],[2,6],[4,1],[1,2],[1,4],[1,5],[1,2],[4,2],[4,2],[4,0],[4,3]]
  },
  {
    colors: ["red","blue","yellow","green","purple"],
    tubes: [
      ["purple","yellow","green","red"],
      ["green","blue","purple","green"],
      ["blue","red","purple","red"],
      ["yellow","blue","yellow","blue"],
      ["red","green","yellow","purple"],
      [],
      []
    ],
    solution: [[0,5],[1,0],[4,1],[2,5],[1,2],[0,6],[2,1],[0,6],[0,4],[0,2],[1,0],[1,0],[2,0],[2,0],[2,5],[2,1],[3,1],[4,3],[1,2],[3,4],[1,2],[4,3],[1,2],[3,4],[1,6],[4,3],[3,1],[3,4],[3,2],[1,3],[4,3],[4,3],[4,6],[4,5]]
  }
];
const CAPACITY = 4;
const colorInfo = {
  red: { name: 'merah', symbol: '•' }, blue: { name: 'biru', symbol: '−' },
  yellow: { name: 'kuning', symbol: '✦' }, green: { name: 'hijau', symbol: '▴' },
  purple: { name: 'ungu', symbol: '◆' }, orange: { name: 'oranye', symbol: '○' }
};
const state = {
  currentLevel: 0, tubes: [], selectedTube: null, moves: 0, moveHistory: [],
  startTime: null, elapsedTime: 0, isAnimating: false, isComplete: false,
  isHinting: false, version: 0
};
const $ = id => document.getElementById(id);
const copyTubes = tubes => tubes.map(tube => [...tube]);
let hintTimeout, instructionTimeout, previousFocus, modalKind;
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function createBall(color) {
  const ball = document.createElement('span');
  ball.className = 'ball';
  ball.dataset.color = color;
  ball.setAttribute('aria-hidden', 'true');
  const symbol = document.createElement('span');
  symbol.className = 'ball-symbol';
  symbol.textContent = colorInfo[color].symbol;
  ball.append(symbol);
  return ball;
}

function initGame() {
  $('help').addEventListener('click', openHelp);
  $('undo').addEventListener('click', undoMove);
  $('reset').addEventListener('click', resetLevel);
  $('hint').addEventListener('click', showHint);
  $('tubes').addEventListener('pointerup', event => {
    if (event.button !== 0) return;
    const tube = event.target.closest('.tube');
    if (tube) selectTube(Number(tube.dataset.index));
  });
  // Clicks synthesized by keyboard and assistive technologies have detail 0.
  $('tubes').addEventListener('click', event => {
    const tube = event.target.closest('.tube');
    if (tube && event.detail === 0) selectTube(Number(tube.dataset.index));
  });
  document.addEventListener('keydown', onKeyDown);
  $('overlay').addEventListener('click', event => {
    if (event.target === $('overlay') && modalKind !== 'win') closeModal();
  });
  window.addEventListener('resize', fitGame);
  window.visualViewport?.addEventListener('resize', fitGame);
  setInterval(updateTimer, 250);
  fitGame();
  loadLevel(0);
}

function fitGame() {
  const width = window.visualViewport?.width || window.innerWidth;
  const height = window.visualViewport?.height || window.innerHeight;
  const scale = Math.min(1, width / 340, height / 640);
  $('game-shell').style.width = `${340 * scale}px`;
  $('game-shell').style.height = `${640 * scale}px`;
  $('game').style.transform = `scale(${scale})`;
}

function loadLevel(index) {
  if (state.isAnimating) return;
  clearHint();
  clearTimeout(instructionTimeout);
  state.currentLevel = index;
  state.tubes = copyTubes(levels[index].tubes);
  state.selectedTube = null;
  state.moves = 0;
  state.moveHistory = [];
  state.startTime = null;
  state.elapsedTime = 0;
  state.isComplete = false;
  state.isHinting = false;
  state.version++;
  closeModal(false);
  renderTubes();
  updateStats();
  $('difficulty').textContent = index < 3 ? 'PEMANASAN' : index < 6 ? 'MULAI MENANTANG' : 'TANTANGAN WARNA';
  $('instruction').textContent = 'Pilih tabung, lalu tujuan bolanya.';
  announce(`Level ${index + 1}. ${levels[index].colors.length} warna. Pilih tabung untuk mulai.`);
}

function renderTubes(newlyComplete = []) {
  const focused = document.activeElement?.dataset.index;
  const fragment = document.createDocumentFragment();
  const count = state.tubes.length;
  state.tubes.forEach((balls, index) => {
    if (index === Math.ceil(count / 2)) {
      const rowBreak = document.createElement('div');
      rowBreak.className = 'tube-wrap row-break';
      rowBreak.setAttribute('aria-hidden', 'true');
      fragment.append(rowBreak);
    }
    const wrap = document.createElement('div');
    wrap.className = 'tube-wrap';
    const tube = document.createElement('button');
    tube.type = 'button';
    tube.className = 'tube';
    tube.dataset.index = index;
    tube.setAttribute('aria-pressed', String(index === state.selectedTube));
    tube.setAttribute('aria-label', `Tabung ${index + 1}, ${balls.length ? `dari bawah: ${balls.map(c => colorInfo[c].name).join(', ')}` : 'kosong'}${checkTubeComplete(balls) ? ', selesai' : ''}`);
    if (state.selectedTube === index) tube.classList.add('selected');
    balls.forEach(color => tube.append(createBall(color)));
    if (checkTubeComplete(balls)) {
      tube.classList.add('complete');
      const mark = document.createElement('span');
      mark.className = 'complete-mark';
      mark.textContent = '✓';
      mark.setAttribute('aria-hidden', 'true');
      wrap.append(mark);
    }
    if (newlyComplete.includes(index)) {
      tube.classList.add('just-completed');
      const sparkle = document.createElement('span');
      sparkle.className = 'sparkle';
      sparkle.textContent = '✦';
      sparkle.setAttribute('aria-hidden', 'true');
      wrap.append(sparkle);
    }
    wrap.prepend(tube);
    fragment.append(wrap);
  });
  $('tubes').replaceChildren(fragment);
  $('tubes').dataset.count = count;
  if (focused !== undefined) getTube(Number(focused))?.focus({ preventScroll: true });
}

function getTube(index) { return $('tubes').querySelector(`[data-index="${index}"]`); }
function canMoveBall(source, destination, tubes = state.tubes) {
  if (source === destination) return false;
  const from = tubes[source], to = tubes[destination];
  return Boolean(from?.length && to && to.length < CAPACITY && (!to.length || from.at(-1) === to.at(-1)));
}

function selectTube(index) {
  if (state.isAnimating || state.isHinting || state.isComplete || !$('overlay').hidden) return;
  clearHint();
  if (state.selectedTube === index) {
    state.selectedTube = null;
    renderTubes();
  } else if (state.selectedTube === null) {
    if (!state.tubes[index].length) return feedback('Tabung kosong. Pilih tabung berisi bola.', index);
    state.selectedTube = index;
    renderTubes();
    announce(`Tabung ${index + 1} dipilih. Bola ${colorInfo[state.tubes[index].at(-1)].name}.`);
  } else if (canMoveBall(state.selectedTube, index)) {
    moveBall(state.selectedTube, index);
  } else {
    feedback(state.tubes[index].length === CAPACITY ? 'Tabung penuh. Pilih tujuan lain.' : 'Warna paling atas harus sama.', index);
  }
}

async function moveBall(source, destination, undo = false) {
  if (state.isAnimating || (!undo && !canMoveBall(source, destination))) return;
  state.isAnimating = true;
  state.selectedTube = null;
  clearHint();
  updateControls();
  // Re-render before measurement to remove the selection lift consistently.
  renderTubes();
  const color = state.tubes[source].at(-1);
  const before = state.tubes.map(checkTubeComplete);
  try {
    await animateBallMove(source, destination, color);
    state.tubes[source].pop();
    state.tubes[destination].push(color);
    if (undo) {
      state.moveHistory.pop();
      state.moves--;
    } else {
      state.moveHistory.push({ source, destination, color });
      state.moves++;
      if (state.startTime === null) state.startTime = performance.now();
    }
    state.version++;
    const completed = state.tubes.map((tube, i) => !before[i] && checkTubeComplete(tube) ? i : -1).filter(i => i >= 0);
    renderTubes(completed);
    announce(`${undo ? 'Undo. ' : ''}Bola ${colorInfo[color].name} dipindahkan ke tabung ${destination + 1}.${completed.length ? ' Tabung selesai.' : ''}`);
    if (checkWin()) {
      state.elapsedTime = state.startTime === null ? 0 : performance.now() - state.startTime;
      state.isComplete = true;
    }
  } finally {
    state.isAnimating = false;
    updateStats();
  }
  if (state.isComplete) showWin();
}

async function animateBallMove(source, destination, color) {
  const sourceBall = getTube(source).querySelector('.ball:last-child');
  const target = getTube(destination);
  const gameRect = $('game').getBoundingClientRect();
  const scale = gameRect.width / 340;
  const start = sourceBall.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const x = (start.left - gameRect.left) / scale;
  const y = (start.top - gameRect.top) / scale;
  const targetX = (targetRect.left - gameRect.left) / scale + (targetRect.width / scale - 29) / 2;
  const targetY = (targetRect.bottom - gameRect.top) / scale - 6.5 - 29 - state.tubes[destination].length * 32;
  const flightY = Math.min(y, (targetRect.top - gameRect.top) / scale) - 33;
  const flying = createBall(color);
  flying.classList.add('flying-ball');
  flying.style.left = `${x}px`;
  flying.style.top = `${y}px`;
  $('game').append(flying);
  sourceBall.style.visibility = 'hidden';
  const step = async (dx, dy, duration) => {
    flying.style.transitionDuration = `${duration}ms`;
    // Force the initial position to be committed before the transform changes.
    void flying.offsetWidth;
    flying.style.transform = `translate(${dx}px, ${dy}px)`;
    await delay(duration + 15);
  };
  try {
    if (!reducedMotion.matches) {
      await step(0, flightY - y, 150);
      await step(targetX - x, flightY - y, 190);
      await step(targetX - x, targetY - y, 170);
    }
  } finally { flying.remove(); sourceBall.style.visibility = ''; }
}

function checkTubeComplete(tube) { return tube.length === CAPACITY && tube.every(color => color === tube[0]); }
function checkWin(tubes = state.tubes) { return tubes.every(tube => !tube.length || checkTubeComplete(tube)); }
function formatTime(ms) {
  const seconds = Math.floor(ms / 1000);
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}
function updateTimer() {
  if (state.startTime !== null && !state.isComplete) state.elapsedTime = performance.now() - state.startTime;
  $('timer').textContent = formatTime(state.elapsedTime);
}
function updateStats() {
  const completed = state.tubes.filter(checkTubeComplete).length;
  const total = levels[state.currentLevel].colors.length;
  $('level').innerHTML = `${String(state.currentLevel + 1).padStart(2, '0')} <small>/ 10</small>`;
  $('moves').textContent = state.moves;
  $('completed').innerHTML = `${completed} <small>/ ${total}</small>`;
  $('progress').style.width = `${completed / total * 100}%`;
  updateTimer();
  updateControls();
}
function updateControls() {
  const busy = state.isAnimating || state.isHinting;
  $('undo').disabled = busy || !state.moveHistory.length || state.isComplete;
  $('reset').disabled = busy;
  $('hint').disabled = busy || state.isComplete;
  $('help').disabled = busy;
  $('tubes').setAttribute('aria-busy', String(busy));
}
function undoMove() {
  if (state.isAnimating || state.isHinting || !state.moveHistory.length || state.isComplete) return;
  const last = state.moveHistory.at(-1);
  moveBall(last.destination, last.source, true);
}
function resetLevel() {
  if (state.isAnimating || state.isHinting) return;
  if (!state.moves) return loadLevel(state.currentLevel);
  openModal('reset', '<span class="modal-icon" aria-hidden="true">↻</span><h2 id="modal-title">Mulai lagi?</h2><p>Susunan bola dan langkah di level ini akan kembali ke awal.</p><button class="primary-button" id="confirm-reset">Ya, ulangi</button><button class="secondary-button" id="cancel-reset">Lanjut bermain</button>');
  $('confirm-reset').onclick = () => { loadLevel(state.currentLevel); getTube(0).focus(); };
  $('cancel-reset').onclick = closeModal;
}

// A bounded, yielding search returns a single useful move along a verified path.
// Equivalent tube permutations are deduplicated to keep mobile work small.
async function findSolution(tubes, version) {
  const initial = JSON.stringify(tubes);
  if (initial === JSON.stringify(levels[state.currentLevel].tubes)) return levels[state.currentLevel].solution;
  const seen = new Set();
  const stack = [{ tubes: copyTubes(tubes), path: [] }];
  let visits = 0;
  while (stack.length && visits < 120000) {
    if (state.version !== version) return null;
    const node = stack.pop();
    if (checkWin(node.tubes)) return node.path;
    const key = node.tubes.map(t => t.join(',')).sort().join('|');
    if (seen.has(key)) continue;
    seen.add(key);
    visits++;
    const options = [];
    node.tubes.forEach((from, source) => {
      if (!from.length || checkTubeComplete(from)) return;
      let emptyUsed = false;
      node.tubes.forEach((to, destination) => {
        if (!canMoveBall(source, destination, node.tubes)) return;
        if (!to.length) {
          if (emptyUsed || from.every(c => c === from[0])) return;
          emptyUsed = true;
        }
        options.push({ source, destination, score: to.length ? 10 + to.length : 0 });
      });
    });
    options.sort((a, b) => a.score - b.score);
    for (const { source, destination } of options) {
      const next = copyTubes(node.tubes);
      next[destination].push(next[source].pop());
      stack.push({ tubes: next, path: [...node.path, [source, destination]] });
    }
    if (visits % 300 === 0) await delay(0);
  }
  return null;
}

async function showHint() {
  if (state.isAnimating || state.isHinting || state.isComplete) return;
  clearHint();
  state.selectedTube = null;
  renderTubes();
  state.isHinting = true;
  updateControls();
  $('instruction').textContent = 'Mencari langkah yang membantu…';
  const version = state.version;
  const solution = await findSolution(state.tubes, version);
  state.isHinting = false;
  updateControls();
  if (version !== state.version) return;
  if (!solution?.length) {
    feedback('Coba Undo atau Ulangi untuk membuka jalan.');
    return;
  }
  const [source, destination] = solution[0];
  getTube(source).classList.add('hint-source');
  getTube(destination).classList.add('hint-target');
  $('instruction').textContent = `Tabung ${source + 1} → tabung ${destination + 1}. Coba langkah ini.`;
  announce(`Petunjuk: pindahkan bola dari tabung ${source + 1} ke tabung ${destination + 1}.`);
  hintTimeout = setTimeout(clearHint, 1500);
}
function clearHint() {
  clearTimeout(hintTimeout);
  $('tubes').querySelectorAll('.hint-source, .hint-target').forEach(tube => tube.classList.remove('hint-source', 'hint-target'));
  $('instruction').textContent = 'Pilih tabung, lalu tujuan bolanya.';
}
function feedback(message, index) {
  if (index !== undefined) {
    const tube = getTube(index);
    tube.classList.remove('invalid');
    void tube.offsetWidth;
    tube.classList.add('invalid');
  }
  $('instruction').textContent = message;
  announce(`Gerakan tidak valid. ${message}`);
  clearTimeout(instructionTimeout);
  instructionTimeout = setTimeout(() => { $('instruction').textContent = 'Pilih tabung, lalu tujuan bolanya.'; }, 2200);
}
function announce(message) { $('announcer').textContent = message; }

function openModal(kind, html) {
  clearHint();
  previousFocus = document.activeElement;
  modalKind = kind;
  $('modal').innerHTML = html;
  $('overlay').hidden = false;
  for (const child of $('game').children) if (child.id !== 'overlay' && child.id !== 'announcer') child.inert = true;
  $('modal').querySelector('button')?.focus({ preventScroll: true });
}
function closeModal(restoreFocus = true) {
  $('overlay').hidden = true;
  modalKind = null;
  for (const child of $('game').children) child.inert = false;
  if (restoreFocus && previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
}
function openHelp() {
  if (state.isAnimating || state.isHinting) return;
  openModal('help', '<span class="modal-icon" aria-hidden="true">?</span><h2 id="modal-title">Satu warna, satu tabung.</h2><div class="help-example" aria-hidden="true"><i class="ball" data-color="blue"><b class="ball-symbol">−</b></i><span>→</span><i class="ball" data-color="blue"><b class="ball-symbol">−</b></i></div><p>Pindahkan bola paling atas ke tabung kosong atau ke atas bola dengan warna yang sama.</p><p>Maksimal 4 bola per tabung.<br>Tabung penuh dengan satu warna berarti selesai. Tabung selesai tetap bisa dipindahkan.</p><p>Keyboard: panah untuk berpindah, Enter untuk memilih, Escape untuk batal.</p><button class="primary-button" id="close-help">Mengerti, ayo main</button>');
  $('close-help').onclick = closeHelp;
}
function closeHelp() { closeModal(); }
function showWin() {
  const final = state.currentLevel === levels.length - 1;
  openModal('win', `<span class="modal-icon" aria-hidden="true">🎉</span><h2 id="modal-title">${final ? 'Semua level selesai!' : 'Berhasil!'}</h2><p>Kamu sudah memisahkan semua warna.</p><div class="win-stats"><span>LEVEL<strong>${state.currentLevel + 1}</strong></span><span>LANGKAH<strong>${state.moves}</strong></span><span>WAKTU<strong>${formatTime(state.elapsedTime)}</strong></span></div><button class="primary-button" id="next-level">${final ? 'Main dari Awal' : 'Level Berikutnya'}</button><button class="secondary-button" id="replay">Main Lagi</button>`);
  $('next-level').onclick = nextLevel;
  $('replay').onclick = () => { loadLevel(state.currentLevel); getTube(0).focus(); };
  announce(final ? 'Semua level selesai!' : `Berhasil! Level ${state.currentLevel + 1} selesai dalam ${state.moves} langkah.`);
}
function nextLevel() { loadLevel((state.currentLevel + 1) % levels.length); getTube(0).focus(); }

function onKeyDown(event) {
  if (!$('overlay').hidden) {
    if (event.key === 'Escape' && modalKind !== 'win') { event.preventDefault(); closeModal(); }
    if (event.key === 'Tab') {
      const buttons = [...$('modal').querySelectorAll('button')];
      const first = buttons[0], last = buttons.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    return;
  }
  if (event.key === 'Escape') {
    state.selectedTube = null;
    clearHint();
    if (!state.isAnimating) renderTubes();
    return;
  }
  const current = document.activeElement.closest('.tube');
  if (!current || !event.key.startsWith('Arrow')) return;
  event.preventDefault();
  const index = Number(current.dataset.index);
  const split = Math.ceil(state.tubes.length / 2);
  let next = index;
  if (event.key === 'ArrowRight') next = (index + 1) % state.tubes.length;
  if (event.key === 'ArrowLeft') next = (index - 1 + state.tubes.length) % state.tubes.length;
  if (event.key === 'ArrowDown') next = index < split ? Math.min(index + split, state.tubes.length - 1) : index - split;
  if (event.key === 'ArrowUp') next = index >= split ? index - split : Math.min(index + split, state.tubes.length - 1);
  getTube(next).focus({ preventScroll: true });
}

initGame();
