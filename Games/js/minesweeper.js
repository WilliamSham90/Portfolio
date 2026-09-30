/*================================================
  Minesweeper
  First click is always safe. Right-click / long-press flags, clicking
  a number whose flags are all placed clears its neighbours (chording).
  Best time per difficulty is kept in localStorage.
================================================*/

(function () {
    'use strict';

    const LEVELS = {
        easy:   { rows: 9,  cols: 9,  mines: 10 },
        medium: { rows: 16, cols: 16, mines: 40 },
        hard:   { rows: 16, cols: 30, mines: 99 }
    };
    const FACE = { idle: '🙂', press: '😮', win: '😎', dead: '😵' };
    const LONG_PRESS_MS = 400;

    const $ = id => document.getElementById(id);
    const grid = $('grid');
    const face = $('face');
    const mineCountEl = $('mineCount');
    const timerEl = $('timerDisplay');
    const overlay = $('overlay');
    const modeMine = $('modeMine');
    const modeFlag = $('modeFlag');

    function store(key, value) {
        try {
            if (value === undefined) return localStorage.getItem(key);
            localStorage.setItem(key, value);
        } catch (e) { return null; }
    }

    let level = LEVELS[store('ms-level')] ? store('ms-level') : 'easy';
    let rows, cols, mines, board, revealed, flagged, cells;
    let safeLeft, flagsPlaced, started, over, flagMode = false;
    let startTime = 0, timerId = null, focusIndex = 0;

    /*================ Board ================*/

    function newGame() {
        const L = LEVELS[level];
        // the wide Hard board is turned on its side for portrait screens
        const turn = L.cols > L.rows && innerHeight > innerWidth;
        rows = turn ? L.cols : L.rows;
        cols = turn ? L.rows : L.cols;
        mines = L.mines;

        stopTimer();
        const total = rows * cols;
        board = new Int8Array(total);      // -1 mine, else neighbour count
        revealed = new Uint8Array(total);
        flagged = new Uint8Array(total);
        safeLeft = total - mines;
        flagsPlaced = 0;
        started = false;
        over = false;
        focusIndex = 0;

        grid.style.setProperty('--cols', cols);
        grid.style.setProperty('--rows', rows);
        const frag = document.createDocumentFragment();
        cells = [];
        for (let i = 0; i < total; i++) {
            const cell = document.createElement('button');
            cell.type = 'button';
            cell.className = 'cell';
            cell.dataset.i = i;
            cell.tabIndex = i === 0 ? 0 : -1;
            cells.push(cell);
            frag.appendChild(cell);
        }
        grid.replaceChildren(frag);
        cells.forEach((c, i) => label(i));

        face.textContent = FACE.idle;
        timerEl.textContent = '000';
        updateCounter();
        overlay.hidden = true;
        document.querySelectorAll('.level-btn').forEach(b =>
            b.setAttribute('aria-pressed', String(b.dataset.level === level)));
    }

    function neighbors(i) {
        const r = Math.floor(i / cols), c = i % cols, out = [];
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const nr = r + dr, nc = c + dc;
                if ((dr || dc) && nr >= 0 && nr < rows && nc >= 0 && nc < cols) out.push(nr * cols + nc);
            }
        }
        return out;
    }

    // Mines avoid the first click and its neighbours, so it always opens an area.
    function placeMines(safe) {
        const banned = new Set([safe, ...neighbors(safe)]);
        const pool = [];
        for (let i = 0; i < board.length; i++) if (!banned.has(i)) pool.push(i);
        for (let m = 0; m < mines; m++) {
            const r = m + Math.floor(Math.random() * (pool.length - m));
            [pool[m], pool[r]] = [pool[r], pool[m]];
            board[pool[m]] = -1;
        }
        for (let i = 0; i < board.length; i++) {
            if (board[i] !== -1) board[i] = neighbors(i).reduce((n, k) => n + (board[k] === -1), 0);
        }
    }

    /*================ Moves ================*/

    function reveal(i) {
        if (over || revealed[i] || flagged[i]) return;
        if (!started) {
            started = true;
            placeMines(i);
            startTimer();
        }
        if (board[i] === -1) {
            cells[i].classList.add('boom');
            return lose();
        }
        // flood fill with a stack, not recursion
        const stack = [i];
        while (stack.length) {
            const j = stack.pop();
            if (revealed[j] || flagged[j]) continue;
            revealed[j] = 1;
            safeLeft--;
            paint(j);
            if (board[j] === 0) neighbors(j).forEach(k => { if (!revealed[k]) stack.push(k); });
        }
        if (safeLeft === 0) win();
    }

    function chord(i) {
        const around = neighbors(i);
        if (board[i] <= 0 || around.filter(k => flagged[k]).length !== board[i]) return;
        for (const k of around) {
            if (!flagged[k] && !revealed[k]) reveal(k);
            if (over) return;
        }
    }

    function toggleFlag(i) {
        if (over || revealed[i]) return;
        flagged[i] ^= 1;
        flagsPlaced += flagged[i] ? 1 : -1;
        cells[i].classList.toggle('flagged', !!flagged[i]);
        label(i);
        updateCounter();
    }

    function act(i) {
        if (revealed[i]) chord(i);
        else if (flagMode) toggleFlag(i);
        else reveal(i);
    }

    /*================ Painting ================*/

    function paint(i) {
        const cell = cells[i];
        cell.classList.add('revealed');
        if (board[i] > 0) {
            cell.dataset.n = board[i];
            cell.textContent = board[i];
        }
        label(i);
    }

    function label(i) {
        const pos = 'Row ' + (Math.floor(i / cols) + 1) + ', column ' + (i % cols + 1) + ': ';
        let state = 'hidden';
        if (flagged[i]) state = 'flagged';
        else if (revealed[i]) state = board[i] > 0 ? board[i] + ' nearby' : 'empty';
        cells[i].setAttribute('aria-label', pos + state);
    }

    function updateCounter() {
        const left = mines - flagsPlaced;
        mineCountEl.textContent = (left < 0 ? '-' : '') + String(Math.abs(left)).padStart(left < 0 ? 2 : 3, '0');
    }

    /*================ Timer ================*/

    // Elapsed time comes from a start timestamp, so the display can't drift
    // and a restart can never leave an old interval running.
    function startTimer() {
        startTime = performance.now();
        timerId = setInterval(() => {
            timerEl.textContent = String(Math.min(999, Math.floor(elapsed()))).padStart(3, '0');
        }, 250);
    }
    function stopTimer() {
        clearInterval(timerId);
        timerId = null;
    }
    const elapsed = () => (performance.now() - startTime) / 1000;

    /*================ End of game ================*/

    function win() {
        over = true;
        stopTimer();
        const time = elapsed();
        board.forEach((v, i) => {
            if (v === -1 && !flagged[i]) { flagged[i] = 1; cells[i].classList.add('flagged'); }
        });
        flagsPlaced = mines;
        updateCounter();
        face.textContent = FACE.win;

        const key = 'ms-best-' + level;
        const best = parseFloat(store(key));
        const isBest = !(best <= time);
        if (isBest) store(key, time.toFixed(1));
        showOverlay('You cleared it! 🎉',
            'Time: ' + time.toFixed(1) + 's' + (isBest ? ' · New best!' : ' · Best: ' + best.toFixed(1) + 's'),
            true);
    }

    function lose() {
        over = true;
        stopTimer();
        board.forEach((v, i) => {
            if (v === -1 && !flagged[i]) cells[i].classList.add('revealed', 'mine');
            if (v !== -1 && flagged[i]) cells[i].classList.add('wrong-flag');
        });
        face.textContent = FACE.dead;
        showOverlay('Boom! 💥', 'That was a mine. Have another go?', false);
    }

    function showOverlay(title, text, won) {
        $('overlayTitle').textContent = title;
        $('overlayText').textContent = text;
        overlay.classList.toggle('victory', won);
        // a beat so the board can be seen before the message covers it
        setTimeout(() => {
            if (!over) return;
            overlay.hidden = false;
            $('overlayBtn').focus({ preventScroll: true });
        }, won ? 400 : 900);
    }

    /*================ Input ================*/

    function setFlagMode(on) {
        flagMode = on;
        modeMine.setAttribute('aria-pressed', String(!on));
        modeFlag.setAttribute('aria-pressed', String(on));
    }

    function focusCell(j) {
        cells[focusIndex].tabIndex = -1;
        focusIndex = j;
        cells[j].tabIndex = 0;
        cells[j].focus();
    }

    const cellIndex = e => {
        const cell = e.target.closest('.cell');
        return cell ? Number(cell.dataset.i) : -1;
    };

    // Touch: a long press flags. The click that follows it is swallowed.
    let pressTimer = null, suppressClick = false, lastPointer = 'mouse', pressX = 0, pressY = 0;

    grid.addEventListener('pointerdown', e => {
        lastPointer = e.pointerType;
        suppressClick = false; // in case a long press never produced its click
        pressX = e.clientX;
        pressY = e.clientY;
        const i = cellIndex(e);
        if (i < 0 || over || e.button !== 0) return;
        if (!revealed[i]) face.textContent = FACE.press;
        if (e.pointerType !== 'mouse') {
            clearTimeout(pressTimer);
            pressTimer = setTimeout(() => {
                suppressClick = true;
                toggleFlag(i);
                face.textContent = FACE.idle;
                if (navigator.vibrate) navigator.vibrate(30);
            }, LONG_PRESS_MS);
        }
    });

    function endPress() {
        clearTimeout(pressTimer);
        if (!over) face.textContent = FACE.idle;
    }
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(type => grid.addEventListener(type, endPress));
    // a finger that drifts is scrolling, not long-pressing
    grid.addEventListener('pointermove', e => {
        if (Math.hypot(e.clientX - pressX, e.clientY - pressY) > 10) clearTimeout(pressTimer);
    });

    grid.addEventListener('click', e => {
        if (suppressClick) { suppressClick = false; return; }
        const i = cellIndex(e);
        if (i >= 0 && !over) act(i);
    });

    grid.addEventListener('contextmenu', e => {
        e.preventDefault();
        // on touch the long-press timer already handled it
        const i = cellIndex(e);
        if (i >= 0 && lastPointer === 'mouse') toggleFlag(i);
    });

    grid.addEventListener('keydown', e => {
        const i = cellIndex(e);
        if (i < 0) return;
        const c = i % cols;
        const moves = {
            ArrowUp: i - cols,
            ArrowDown: i + cols,
            ArrowLeft: c > 0 ? i - 1 : -1,
            ArrowRight: c < cols - 1 ? i + 1 : -1
        };
        if (e.key in moves) {
            e.preventDefault();
            const j = moves[e.key];
            if (j >= 0 && j < cells.length) focusCell(j);
        } else if (e.key === 'f' || e.key === 'F') {
            e.preventDefault();
            e.stopPropagation();
            toggleFlag(i);
        }
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'F2') { e.preventDefault(); newGame(); }
        else if ((e.key === 'f' || e.key === 'F') && !e.ctrlKey && !e.metaKey && !e.altKey) setFlagMode(!flagMode);
    });

    modeMine.addEventListener('click', () => setFlagMode(false));
    modeFlag.addEventListener('click', () => setFlagMode(true));
    face.addEventListener('click', newGame);
    $('overlayBtn').addEventListener('click', () => { newGame(); cells[0].focus(); });

    document.querySelector('.levels').addEventListener('click', e => {
        const btn = e.target.closest('.level-btn');
        if (!btn) return;
        level = btn.dataset.level;
        store('ms-level', level);
        newGame();
    });

    newGame();
})();
