/* ═══════════════════════════════════════════
   PATTERN ASSESSMENT — GAME LOGIC
   15 levels, 5-min timer, postMessage transfer
═══════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const TOTAL_TIME_MS = 5 * 60 * 1000;  // 5 minutes
const MAX_LEVEL     = 15;
const GRID_SIZE     = 8;

/* ─────────────────────────────────────────
   COLOUR PALETTE
───────────────────────────────────────── */
// Clearly distinct hues used in easy levels
const VIVID_COLORS = [
  '#E53935', // red
  '#1E88E5', // blue
  '#43A047', // green
  '#FB8C00', // orange
  '#8E24AA', // purple
  '#00897B', // teal
  '#E91E63', // pink
  '#C0CA33', // lime
  '#F4511E', // deep orange
  '#039BE5', // light blue
  '#6D4C41', // brown
  '#00ACC1', // cyan
];

// Similar-hue groups used in hard levels
const SIMILAR_HUE_GROUPS = [
  // Blues
  ['#1565C0', '#1976D2', '#1E88E5', '#2196F3', '#42A5F5'],
  // Reds
  ['#B71C1C', '#C62828', '#D32F2F', '#E53935', '#EF5350'],
  // Greens
  ['#1B5E20', '#2E7D32', '#388E3C', '#43A047', '#4CAF50'],
  // Oranges
  ['#E65100', '#EF6C00', '#F57C00', '#FB8C00', '#FFA726'],
  // Purples
  ['#4A148C', '#6A1B9A', '#7B1FA2', '#8E24AA', '#AB47BC'],
];

/* ─────────────────────────────────────────
   PATTERN TYPES
───────────────────────────────────────── */
const PATTERN_TYPES = [
  'solid',
  'hstripe',
  'vstripe',
  'diagonal',
  'diagonal2',
  'dots',
  'checker',
  'grid',
];

const LEVEL_NAMES = {
  1:  'COLOUR RECOGNITION — EASY',
  2:  'COLOUR RECOGNITION',
  3:  'COLOUR RECOGNITION — MIXED',
  4:  'PATTERN DETECTION — BASIC',
  5:  'PATTERN DETECTION',
  6:  'PATTERN DETECTION — ADVANCED',
  7:  'COLOUR + PATTERN — MODERATE',
  8:  'COLOUR + PATTERN',
  9:  'COLOUR + PATTERN — HARD',
  10: 'DENSITY DISCRIMINATION — HARD',
  11: 'DENSITY DISCRIMINATION',
  12: 'DENSITY DISCRIMINATION — EXPERT',
  13: 'SUBTLE SHADE VARIANCE — EXPERT',
  14: 'SUBTLE SHADE VARIANCE',
  15: 'MASTER LEVEL — EXTREME',
};

/* ─────────────────────────────────────────
   COLOUR UTILITIES
───────────────────────────────────────── */
function hsl(h, s, l) {
  return `hsl(${h},${s}%,${l}%)`;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickTwo(arr) {
  const a = Math.floor(Math.random() * arr.length);
  let b;
  do { b = Math.floor(Math.random() * arr.length); } while (b === a);
  return [arr[a], arr[b]];
}

/* ─────────────────────────────────────────
   PATTERN STYLE GENERATOR
   Returns a CSS style object for one block
───────────────────────────────────────── */
function makeStyle(type, c1, c2, sz) {
  switch (type) {
    case 'solid':
      return { background: c1 };

    case 'hstripe':
      return {
        background:
          `repeating-linear-gradient(0deg,` +
          `${c1} 0px,${c1} ${sz}px,` +
          `${c2} ${sz}px,${c2} ${sz * 2}px)`,
      };

    case 'vstripe':
      return {
        background:
          `repeating-linear-gradient(90deg,` +
          `${c1} 0px,${c1} ${sz}px,` +
          `${c2} ${sz}px,${c2} ${sz * 2}px)`,
      };

    case 'diagonal':
      return {
        background:
          `repeating-linear-gradient(45deg,` +
          `${c1} 0px,${c1} ${sz}px,` +
          `${c2} ${sz}px,${c2} ${sz * 2}px)`,
      };

    case 'diagonal2':
      return {
        background:
          `repeating-linear-gradient(-45deg,` +
          `${c1} 0px,${c1} ${sz}px,` +
          `${c2} ${sz}px,${c2} ${sz * 2}px)`,
      };

    case 'dots': {
      const dot = Math.max(2, Math.floor(sz * 0.6));
      return {
        backgroundColor: c2,
        backgroundImage: `radial-gradient(${c1} ${dot}px, transparent ${dot}px)`,
        backgroundSize:  `${sz * 3}px ${sz * 3}px`,
      };
    }

    case 'checker':
      return {
        background:
          `repeating-conic-gradient(${c1} 0% 25%, ${c2} 0% 50%) ` +
          `0 0 / ${sz * 2}px ${sz * 2}px`,
      };

    case 'grid':
      return {
        backgroundColor:   c1,
        backgroundImage:
          `linear-gradient(${c2} 1px, transparent 1px),` +
          `linear-gradient(90deg, ${c2} 1px, transparent 1px)`,
        backgroundSize: `${sz * 4}px ${sz * 4}px`,
      };

    default:
      return { background: c1 };
  }
}

function applyStyle(el, styleObj) {
  // Reset any previous pattern properties first
  el.style.cssText = '';
  for (const [prop, val] of Object.entries(styleObj)) {
    el.style[prop] = val;
  }
}

/* ─────────────────────────────────────────
   ROUND GENERATOR
   Returns { baseStyle, oddStyle, oddIndex }
───────────────────────────────────────── */
function generateRound(level) {
  const oddIndex = Math.floor(Math.random() * GRID_SIZE);
  let baseStyle, oddStyle;

  /* ── TIER 1 (L1-3): Solid colours, clearly different hue ── */
  if (level <= 3) {
    const [c1, c2] = pickTwo(VIVID_COLORS);
    baseStyle = makeStyle('solid', c1, '#0A0A0A', 8);
    oddStyle  = makeStyle('solid', c2, '#0A0A0A', 8);

  /* ── TIER 2 (L4-6): Same colour, different pattern type ── */
  } else if (level <= 6) {
    const color   = pickRandom(VIVID_COLORS);
    const bg      = '#0A0A0A';
    const types   = PATTERN_TYPES.filter(t => t !== 'solid');
    const basePat = pickRandom(types);
    let   oddPat;
    do { oddPat = pickRandom(types); } while (oddPat === basePat);
    baseStyle = makeStyle(basePat, color, bg, 7);
    oddStyle  = makeStyle(oddPat,  color, bg, 7);

  /* ── TIER 3 (L7-9): Similar colours, different pattern ── */
  } else if (level <= 9) {
    const group = pickRandom(SIMILAR_HUE_GROUPS);
    const [c1, c2] = pickTwo(group);
    const bg = '#0A0A0A';
    // Pick two similar pattern types for extra challenge
    const pairPool = [
      ['hstripe','vstripe'],
      ['hstripe','diagonal'],
      ['vstripe','diagonal2'],
      ['dots','checker'],
      ['grid','checker'],
    ];
    const [basePat, oddPat] = pickRandom(pairPool);
    baseStyle = makeStyle(basePat, c1, bg, 6);
    oddStyle  = makeStyle(oddPat,  c2, bg, 6);

  /* ── TIER 4 (L10-12): Same colour + same pattern, different SIZE ── */
  } else if (level <= 12) {
    const hue    = Math.floor(Math.random() * 360);
    const c1     = hsl(hue, 70, 52);
    const bg     = '#0A0A0A';
    const stripeTypes = ['hstripe', 'vstripe', 'diagonal', 'diagonal2'];
    const pat    = pickRandom(stripeTypes);
    const baseSz = 5 + (level - 10) * 1;   // 5, 6, 7
    const oddSz  = baseSz + 3 + (level - 10); // clearly-ish different density
    baseStyle = makeStyle(pat, c1, bg, baseSz);
    oddStyle  = makeStyle(pat, c1, bg, oddSz);

  /* ── TIER 5 (L13-15): Same pattern, very subtle shade difference ── */
  } else {
    const hue   = Math.floor(Math.random() * 360);
    const sat   = 60 + Math.floor(Math.random() * 20);
    const baseL = 42 + Math.floor(Math.random() * 10);
    const delta = 15 - level; // 2 at L13, 1 at L14, 0 would be too hard so min 2
    const shift = Math.max(2, 17 - level * 1);
    const c1 = hsl(hue, sat, baseL);
    const c2 = hsl(hue, sat, baseL + shift);
    const bg = '#0A0A0A';
    const patTypes = ['checker', 'dots', 'hstripe', 'vstripe'];
    const pat = pickRandom(patTypes);
    baseStyle = makeStyle(pat, c1, bg, 6);
    oddStyle  = makeStyle(pat, c2, bg, 6);
  }

  return { baseStyle, oddStyle, oddIndex };
}

/* ─────────────────────────────────────────
   GAME STATE
───────────────────────────────────────── */
const state = {
  level:           1,
  wrongAnswers:    0,
  correctAnswers:  0,
  roundTimes:      [],   // ms per correct answer
  roundStart:      0,    // timestamp when current round pattern was shown
  gameStartTime:   0,    // timestamp when game began
  timeLeft:        TOTAL_TIME_MS,
  timerInterval:   null,
  oddIndex:        -1,
  inputEnabled:    false,
  gameOver:        false,
};

/* ─────────────────────────────────────────
   DOM REFS
───────────────────────────────────────── */
const hudLevel    = document.getElementById('hud-level');
const hudTimer    = document.getElementById('hud-timer');
const hudWrong    = document.getElementById('hud-wrong');
const timerBar    = document.getElementById('timer-bar');
const feedbackEl  = document.getElementById('feedback-strip');
const feedbackTxt = document.getElementById('feedback-text');
const grid        = document.getElementById('pattern-grid');
const levelLabel  = document.getElementById('level-name');
const overlay     = document.getElementById('result-overlay');

// Overlay refs
const rsLevel   = document.getElementById('rs-level');
const rsCorrect = document.getElementById('rs-correct');
const rsWrong   = document.getElementById('rs-wrong');
const rsSpeed   = document.getElementById('rs-speed');
const resHeadline = document.getElementById('result-headline');
const resSub      = document.getElementById('result-sub');
const transferStatus = document.getElementById('transfer-status');
const btnClose    = document.getElementById('btn-close');

/* ─────────────────────────────────────────
   BUILD GRID (once)
───────────────────────────────────────── */
const blockEls = [];

(function buildGrid() {
  for (let i = 0; i < GRID_SIZE; i++) {
    const btn = document.createElement('button');
    btn.className  = 'pattern-block';
    btn.setAttribute('role', 'gridcell');
    btn.setAttribute('aria-label', `Block ${i + 1}`);
    btn.setAttribute('tabindex', '0');
    btn.dataset.index = i;

    // Index debug label
    const idx = document.createElement('span');
    idx.className = 'block-index';
    idx.textContent = i;
    btn.appendChild(idx);

    btn.addEventListener('click', () => handleBlockClick(i));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleBlockClick(i);
      }
    });

    grid.appendChild(btn);
    blockEls.push(btn);
  }
})();

/* ─────────────────────────────────────────
   TIMER
───────────────────────────────────────── */
function formatTimerDisplay(ms) {
  const totalSec = Math.ceil(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function startTimer() {
  state.gameStartTime = Date.now();

  state.timerInterval = setInterval(() => {
    const elapsed  = Date.now() - state.gameStartTime;
    state.timeLeft  = Math.max(0, TOTAL_TIME_MS - elapsed);

    // Update display
    hudTimer.textContent = formatTimerDisplay(state.timeLeft);

    // Timer bar width
    const pct = (state.timeLeft / TOTAL_TIME_MS) * 100;
    timerBar.style.width = pct + '%';

    // Warning state under 60 s
    const warning = state.timeLeft <= 60000;
    hudTimer.classList.toggle('warning', warning);
    timerBar.classList.toggle('warning', warning);

    if (state.timeLeft <= 0) {
      clearInterval(state.timerInterval);
      endGame(false);
    }
  }, 250);
}

/* ─────────────────────────────────────────
   ROUND MANAGEMENT
───────────────────────────────────────── */
function loadRound(level, feedback = null) {
  state.inputEnabled = false;

  // Update HUD level
  hudLevel.textContent = String(level).padStart(2, '0');
  levelLabel.textContent = LEVEL_NAMES[level] || `LEVEL ${level}`;

  // Feedback strip
  if (feedback) {
    feedbackEl.className  = `feedback-strip ${feedback.type}`;
    feedbackTxt.textContent = feedback.msg;
  } else {
    feedbackEl.className = 'feedback-strip';
    feedbackTxt.textContent = 'SELECT THE ODD ONE OUT';
  }

  // Brief pause then show new pattern
  const delay = feedback ? 500 : 0;

  setTimeout(() => {
    const { baseStyle, oddStyle, oddIndex } = generateRound(level);
    state.oddIndex   = oddIndex;

    // Apply styles to blocks
    blockEls.forEach((btn, i) => {
      btn.className = 'pattern-block'; // reset flash classes
      applyStyle(btn, i === oddIndex ? oddStyle : baseStyle);
    });

    state.roundStart   = Date.now();
    state.inputEnabled = true;

    // Reset feedback after showing new pattern
    if (feedback) {
      setTimeout(() => {
        feedbackEl.className = 'feedback-strip';
        feedbackTxt.textContent = 'SELECT THE ODD ONE OUT';
      }, 400);
    }
  }, delay);
}

/* ─────────────────────────────────────────
   INPUT HANDLER
───────────────────────────────────────── */
function handleBlockClick(index) {
  if (!state.inputEnabled || state.gameOver) return;
  state.inputEnabled = false;

  const btn = blockEls[index];

  if (index === state.oddIndex) {
    // ── CORRECT ──
    const elapsed = Date.now() - state.roundStart;
    state.roundTimes.push(elapsed);
    state.correctAnswers++;

    blockEls[state.oddIndex].classList.add('flash-correct');

    if (state.level >= MAX_LEVEL) {
      // Won the game!
      clearInterval(state.timerInterval);
      state.level = MAX_LEVEL;
      setTimeout(() => endGame(true), 500);
    } else {
      state.level++;
      loadRound(state.level, {
        type: 'correct',
        msg: `✓  CORRECT — ADVANCING TO LEVEL ${state.level}`,
      });
    }
  } else {
    // ── WRONG ──
    state.wrongAnswers++;
    btn.classList.add('flash-wrong');
    hudWrong.textContent = String(state.wrongAnswers).padStart(2, '0');

    loadRound(state.level, {
      type: 'wrong',
      msg: `✗  INCORRECT — TRY A NEW PATTERN`,
    });
  }
}

/* ─────────────────────────────────────────
   END GAME
───────────────────────────────────────── */
function endGame(completed) {
  if (state.gameOver) return;
  state.gameOver     = true;
  state.inputEnabled = false;

  clearInterval(state.timerInterval);

  const totalTimeUsed  = TOTAL_TIME_MS - state.timeLeft;
  const avgSpeedMs     = state.roundTimes.length > 0
    ? state.roundTimes.reduce((a, b) => a + b, 0) / state.roundTimes.length
    : 0;

  // Build result payload
  const payload = {
    levelReached:       state.level,
    correctAnswers:     state.correctAnswers,
    wrongAnswers:       state.wrongAnswers,
    avgSpeedMs:         Math.round(avgSpeedMs),
    totalTimeMs:        Math.round(totalTimeUsed),
    completedAllLevels: completed,
    sentAt:             new Date().toISOString(),
  };

  showResultOverlay(payload, completed);
}

/* ─────────────────────────────────────────
   RESULT OVERLAY
───────────────────────────────────────── */
function showResultOverlay(payload, completed) {
  const { levelReached, correctAnswers, wrongAnswers, avgSpeedMs, totalTimeMs } = payload;

  // Headline
  if (completed) {
    resHeadline.textContent = 'ASSESSMENT COMPLETE';
    resHeadline.style.color = 'var(--success)';
    resSub.textContent =
      `Outstanding. You completed all 15 levels in ` +
      `${formatTime(totalTimeMs)} with ${wrongAnswers} incorrect ` +
      `selection${wrongAnswers !== 1 ? 's' : ''}.`;
  } else {
    resHeadline.textContent = 'TIME EXPIRED';
    resHeadline.style.color = 'var(--accent)';
    resSub.textContent =
      `You reached Level ${levelReached} of 15, with ` +
      `${correctAnswers} correct and ${wrongAnswers} incorrect ` +
      `selection${wrongAnswers !== 1 ? 's' : ''}.`;
  }

  // Stats
  rsLevel.textContent   = levelReached;
  rsCorrect.textContent = correctAnswers;
  rsWrong.textContent   = wrongAnswers;
  rsSpeed.textContent   = avgSpeedMs > 0
    ? (avgSpeedMs / 1000).toFixed(2) + 's'
    : 'N/A';

  // Show overlay
  overlay.classList.remove('hidden');

  // Send to parent after short delay (let overlay render)
  setTimeout(() => sendToParent(payload), 700);
}

/* ─────────────────────────────────────────
   POST MESSAGE TO PARENT
───────────────────────────────────────── */
function sendToParent(payload) {
  if (!window.opener || window.opener.closed) {
    transferStatus.textContent = 'Parent window unavailable — data not transferred.';
    return;
  }

  try {
    window.opener.postMessage(
      { type: 'PATTERN_GAME_RESULT', payload },
      '*'   // '*' required for local file:// protocol; tighten for production
    );
    transferStatus.textContent = '✓  Data sent successfully to parent window.';
    transferStatus.classList.add('sent');
  } catch (err) {
    transferStatus.textContent = `Transfer failed: ${err.message}`;
  }
}

/* ─────────────────────────────────────────
   TIME FORMATTER (result overlay)
───────────────────────────────────────── */
function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return m > 0 ? `${m}m ${s.toString().padStart(2, '0')}s` : `${s}s`;
}

/* ─────────────────────────────────────────
   CLOSE BUTTON
───────────────────────────────────────── */
btnClose.addEventListener('click', () => window.close());

/* ─────────────────────────────────────────
   START GAME
───────────────────────────────────────── */
function startGame() {
  startTimer();
  loadRound(state.level);
}

startGame();
