/* ═══════════════════════════════════════════
   PATTERN ASSESSMENT — MAIN PAGE LOGIC
   Manages popup window + receives postMessage
═══════════════════════════════════════════ */

'use strict';

let gameWindow  = null;
let pollInterval = null;

// ─── ELEMENTS ───────────────────────────────
const btnLaunch    = document.getElementById('btn-launch');
const statusDot    = document.getElementById('status-dot');
const statusMsg    = document.getElementById('status-msg');
const resultsSection = document.getElementById('results-section');

// ─── HELPERS ────────────────────────────────
function setStatus(state, text) {
  statusMsg.textContent = text;
  statusDot.className = 'status-dot' + (state ? ` ${state}` : '');
}

function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return m > 0 ? `${m}m ${s.toString().padStart(2, '0')}s` : `${s}s`;
}

function formatAvgSpeed(ms) {
  if (!ms || ms <= 0) return 'N/A';
  return (ms / 1000).toFixed(2) + 's';
}

// ─── OPEN POPUP ─────────────────────────────
function openGameWindow() {
  if (gameWindow && !gameWindow.closed) {
    gameWindow.focus();
    return;
  }

  const W = 920, H = 720;
  const left = Math.round((screen.width  - W) / 2);
  const top  = Math.round((screen.height - H) / 2);

  const features = [
    `width=${W}`,
    `height=${H}`,
    `left=${left}`,
    `top=${top}`,
    'resizable=no',
    'scrollbars=no',
    'toolbar=no',
    'menubar=no',
    'location=no',
    'status=no',
  ].join(',');

  gameWindow = window.open('patternassesment_game.html', 'PatternAssessment', features);

  if (!gameWindow || gameWindow.closed) {
    alert(
      'Popup blocked!\n\n' +
      'Please allow popups for this page in your browser settings, then try again.'
    );
    return;
  }

  btnLaunch.disabled = true;
  setStatus('active', 'ASSESSMENT IN PROGRESS…');

  // Fallback: detect if window was closed without sending data
  clearInterval(pollInterval);
  pollInterval = setInterval(() => {
    if (gameWindow && gameWindow.closed) {
      clearInterval(pollInterval);
      gameWindow = null;
      btnLaunch.disabled = false;
      setStatus('', 'WINDOW CLOSED — NO DATA RECEIVED');
    }
  }, 600);
}

// ─── RECEIVE MESSAGE ────────────────────────
window.addEventListener('message', (event) => {
  // Accept messages from same origin OR null (local file://)
  const allowedOrigin = window.location.origin;
  if (event.origin !== allowedOrigin && event.origin !== 'null') return;

  const msg = event.data;
  if (!msg || msg.type !== 'PATTERN_GAME_RESULT') return;

  // Clean up polling
  clearInterval(pollInterval);
  gameWindow = null;
  btnLaunch.disabled = false;

  displayResults(msg.payload);
});

// ─── DISPLAY RESULTS ────────────────────────
function displayResults(payload) {
  const {
    levelReached,
    wrongAnswers,
    avgSpeedMs,
    totalTimeMs,
    completedAllLevels,
    correctAnswers,
    sentAt,
  } = payload;

  // Populate result cards
  document.getElementById('r-level').textContent  = levelReached;
  document.getElementById('r-wrong').textContent  = wrongAnswers;
  document.getElementById('r-speed').textContent  = formatAvgSpeed(avgSpeedMs);
  document.getElementById('r-time').textContent   = formatTime(totalTimeMs);

  // Timestamp
  const ts = new Date(sentAt);
  document.getElementById('r-timestamp').textContent =
    `Received: ${ts.toLocaleDateString()} at ${ts.toLocaleTimeString()}`;

  // Status badge
  const badge = document.getElementById('r-status-badge');
  if (completedAllLevels) {
    badge.className = 'status-badge complete';
    badge.textContent = '✓  ALL 15 LEVELS COMPLETED';
  } else {
    badge.className = 'status-badge timeout';
    badge.textContent = '⏱  SESSION ENDED — TIME EXPIRED';
  }

  // Raw payload
  const rawDisplay = {
    type:               'PATTERN_GAME_RESULT',
    levelReached,
    correctAnswers,
    wrongAnswers,
    avgSpeedMs:         avgSpeedMs ? avgSpeedMs.toFixed(0) + 'ms' : 'N/A',
    totalTimeMs:        totalTimeMs + 'ms',
    completedAllLevels,
    sentAt,
  };
  document.getElementById('r-raw').textContent =
    JSON.stringify(rawDisplay, null, 2);

  // Reveal results
  resultsSection.setAttribute('aria-hidden', 'false');
  resultsSection.classList.add('visible');
  setStatus('done', 'DATA RECEIVED');

  // Scroll to results
  setTimeout(() => {
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

// ─── INIT ────────────────────────────────────
btnLaunch.addEventListener('click', openGameWindow);
setStatus('', 'READY');
