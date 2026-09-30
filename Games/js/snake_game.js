/*================================================
  Snake
  One canvas instead of ~450 DOM tiles restyled every frame. Movement runs
  on a fixed time step (speed is the same on any refresh rate) and turns
  are queued, so two quick presses between steps both count.
  Look kept from the original: dark tiles, glowing white snake with a fading
  tail, pulsing green food, arrows along the food's row and column, and
  tiles that stay "pressed" for a moment after the tail leaves them.
================================================*/

(function () {
    'use strict';

    const LONG = 28, SHORT = 16;           // board is 28×16, turned for portrait
    const START_STEP = 160, MIN_STEP = 60, STEP_DROP = 3.5; // ms per move
    const PRESS_FADE = 3000;               // ms a vacated tile stays darker
    const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
    const OPPOSITE = { up: 'down', down: 'up', left: 'right', right: 'left' };

    const $ = id => document.getElementById(id);
    const canvas = $('board');
    const ctx = canvas.getContext('2d');
    const stage = $('stage');

    function store(key, value) {
        try {
            if (value === undefined) return localStorage.getItem(key);
            localStorage.setItem(key, value);
        } catch (e) { return null; }
    }

    let cols, rows, tile = 20, dpr = 1;
    let snake, dir, queue, food, foodBorn, score, best = Number(store('snake-best')) || 0;
    let stepMs, acc, lastTime, ateAt, pressed, state = 'ready', rafId = 0;

    /*================ Setup ================*/

    function chooseBoard() {
        const r = stage.getBoundingClientRect();
        const portrait = r.height > r.width;
        cols = portrait ? SHORT : LONG;
        rows = portrait ? LONG : SHORT;
    }

    function resize() {
        const r = stage.getBoundingClientRect();
        tile = Math.max(8, Math.floor(Math.min(r.width / cols, r.height / rows)));
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.style.width = tile * cols + 'px';
        canvas.style.height = tile * rows + 'px';
        canvas.width = tile * cols * dpr;
        canvas.height = tile * rows * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        draw(performance.now());
    }

    function reset() {
        chooseBoard();
        const row = 3, head = Math.min(8, cols - 2);
        snake = [];
        for (let i = 0; i < 5; i++) snake.push({ x: head - i, y: row });
        dir = 'right';
        queue = [];
        score = 0;
        stepMs = START_STEP;
        acc = 0;
        ateAt = -1e9;
        pressed = new Map();
        placeFood();
        $('score').textContent = '0';
        $('best').textContent = best;
        resize();
    }

    function placeFood() {
        const taken = new Set(snake.map(s => s.x + ',' + s.y));
        const free = [];
        for (let x = 0; x < cols; x++) for (let y = 0; y < rows; y++) if (!taken.has(x + ',' + y)) free.push({ x, y });
        food = free[Math.floor(Math.random() * free.length)];
        foodBorn = performance.now();
    }

    /*================ Rules ================*/

    function turn(d) {
        if (state === 'ready') start();
        if (state !== 'playing') return;
        const last = queue.length ? queue[queue.length - 1] : dir;
        if (d !== last && d !== OPPOSITE[last] && queue.length < 3) queue.push(d);
    }

    function step(now) {
        if (queue.length) dir = queue.shift();
        const [dx, dy] = DIRS[dir];
        const head = snake[0];
        const next = { x: (head.x + dx + cols) % cols, y: (head.y + dy + rows) % rows }; // walls wrap
        const eating = next.x === food.x && next.y === food.y;

        // the tail cell is free this step unless we're about to grow
        const body = eating ? snake : snake.slice(0, -1);
        if (body.some(s => s.x === next.x && s.y === next.y)) return gameOver();

        snake.unshift(next);
        if (eating) {
            score++;
            $('score').textContent = score;
            stepMs = Math.max(MIN_STEP, stepMs - STEP_DROP);
            ateAt = now;
            if (snake.length === cols * rows) return gameOver(true);
            placeFood();
        } else {
            const tail = snake.pop();
            pressed.set(tail.x + ',' + tail.y, now);
        }
    }

    function gameOver(filled) {
        state = 'over';
        $('pauseBtn').disabled = true;
        const isBest = score > best;
        if (isBest) {
            best = score;
            store('snake-best', best);
            $('best').textContent = best;
        }
        $('overText').textContent = (filled ? 'You filled the whole board! ' : '') +
            'Score ' + score + (isBest && score ? ' · New best!' : ' · Best ' + best);
        show('overScreen');
    }

    /*================ Drawing ================*/

    function roundRect(x, y, w, h, r) {
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
        else ctx.rect(x, y, w, h);
        ctx.fill();
    }

    function draw(now) {
        const gap = Math.max(1, Math.round(tile * 0.06));
        const size = tile - gap;
        ctx.clearRect(0, 0, cols * tile, rows * tile);

        // board tiles, darker where the tail recently left
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                const t = pressed.get(x + ',' + y);
                const fade = t ? Math.max(0, 1 - (now - t) / PRESS_FADE) : 0;
                if (t && !fade) pressed.delete(x + ',' + y);
                ctx.fillStyle = 'rgba(0, 0, 0, ' + (0.15 + fade * 0.2) + ')';
                ctx.fillRect(x * tile, y * tile, size, size);
            }
        }

        // little arrows along the food's row and column, pointing at it
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        const a = Math.max(2, tile * 0.12);
        for (let x = 0; x < cols; x++) if (x !== food.x) arrow(x, food.y, x < food.x ? 'right' : 'left', a, size);
        for (let y = 0; y < rows; y++) if (y !== food.y) arrow(food.x, y, y < food.y ? 'down' : 'up', a, size);

        // food: pulses and fades in
        const pulse = Math.sin(now / 200);
        const born = Math.min(1, (now - foodBorn) / 400);
        const fs = size * (0.8 + pulse * 0.2);
        ctx.save();
        ctx.globalAlpha = born;
        ctx.fillStyle = 'hsl(100, 100%, 60%)';
        ctx.shadowColor = 'hsl(100, 100%, 60%)';
        ctx.shadowBlur = tile * (0.6 + pulse * 0.3);
        ctx.fillRect(food.x * tile + (size - fs) / 2, food.y * tile + (size - fs) / 2, fs, fs);
        ctx.restore();

        // snake: tail fades out, head glows; it swells for a moment after eating
        const swell = Math.max(0, 1 - (now - ateAt) / 300);
        for (let i = snake.length - 1; i >= 0; i--) {
            const s = snake[i];
            const grow = size * swell * 0.25;
            ctx.fillStyle = 'rgba(255, 255, 255, ' + (1 - (i / snake.length) * 0.6) + ')';
            if (i === 0) {
                ctx.save();
                ctx.shadowColor = '#fff';
                ctx.shadowBlur = tile * (0.5 + pulse * 0.25);
                roundRect(s.x * tile - grow / 2, s.y * tile - grow / 2, size + grow, size + grow, headRadius(size));
                ctx.restore();
            } else {
                ctx.fillRect(s.x * tile - grow / 2, s.y * tile - grow / 2, size + grow, size + grow);
            }
        }
    }

    // rounded only on the side the head is facing
    function headRadius(size) {
        const r = size * 0.4;
        return { up: [r, r, 0, 0], right: [0, r, r, 0], down: [0, 0, r, r], left: [r, 0, 0, r] }[dir];
    }

    function arrow(x, y, d, a, size) {
        const cx = x * tile + size / 2, cy = y * tile + size / 2;
        ctx.beginPath();
        if (d === 'right') { ctx.moveTo(cx + a, cy); ctx.lineTo(cx - a / 2, cy - a); ctx.lineTo(cx - a / 2, cy + a); }
        if (d === 'left') { ctx.moveTo(cx - a, cy); ctx.lineTo(cx + a / 2, cy - a); ctx.lineTo(cx + a / 2, cy + a); }
        if (d === 'down') { ctx.moveTo(cx, cy + a); ctx.lineTo(cx - a, cy - a / 2); ctx.lineTo(cx + a, cy - a / 2); }
        if (d === 'up') { ctx.moveTo(cx, cy - a); ctx.lineTo(cx - a, cy + a / 2); ctx.lineTo(cx + a, cy + a / 2); }
        ctx.fill();
    }

    /*================ Loop ================*/

    function frame(now) {
        if (state === 'playing') {
            acc += Math.min(250, now - lastTime); // don't fast-forward after a hitch
            while (acc >= stepMs && state === 'playing') {
                acc -= stepMs;
                step(now);
            }
        }
        lastTime = now;
        draw(now);
        rafId = state === 'playing' || state === 'ready' ? requestAnimationFrame(frame) : 0;
    }

    function loop() {
        if (rafId) return;
        lastTime = performance.now();
        rafId = requestAnimationFrame(frame);
    }

    /*================ Screens ================*/

    function show(id) {
        ['startScreen', 'pauseScreen', 'overScreen'].forEach(s => { $(s).hidden = s !== id; });
        const btn = id && $(id).querySelector('button');
        if (btn && id !== 'startScreen') btn.focus({ preventScroll: true });
    }

    function start() {
        if (state === 'over') reset();
        state = 'playing';
        acc = 0;
        $('pauseBtn').disabled = false;
        show(null);
        loop();
    }

    function pause() {
        if (state !== 'playing') return;
        state = 'paused';
        show('pauseScreen');
    }
    function resume() {
        if (state !== 'paused') return;
        state = 'playing';
        show(null);
        loop();
    }

    /*================ Input ================*/

    const KEYS = {
        ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down',
        ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right'
    };
    document.addEventListener('keydown', e => {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        if (KEYS[e.code]) {
            e.preventDefault();
            if (state === 'paused') resume();
            if (state === 'over') start();
            turn(KEYS[e.code]);
        } else if (e.code === 'Space' || e.code === 'KeyP' || e.code === 'Escape') {
            if (document.activeElement && document.activeElement.tagName === 'BUTTON' && e.code === 'Space') return;
            e.preventDefault();
            if (state === 'playing') pause();
            else if (state === 'paused') resume();
        }
    });

    // swipe anywhere on the board
    let swipe = null;
    stage.addEventListener('pointerdown', e => {
        if (e.target.closest('button')) return;
        swipe = { x: e.clientX, y: e.clientY };
    });
    stage.addEventListener('pointermove', e => {
        if (!swipe) return;
        const dx = e.clientX - swipe.x, dy = e.clientY - swipe.y;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
        turn(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
        swipe = { x: e.clientX, y: e.clientY }; // allow chained swipes in one drag
    });
    ['pointerup', 'pointercancel'].forEach(t => stage.addEventListener(t, () => { swipe = null; }));

    document.querySelector('.mobile-controls').addEventListener('pointerdown', e => {
        const btn = e.target.closest('[data-dir]');
        if (!btn) return;
        e.preventDefault();
        if (state === 'paused') resume();
        if (state === 'over') start();
        turn(btn.dataset.dir);
    });

    $('startBtn').addEventListener('click', start);
    $('againBtn').addEventListener('click', start);
    $('resumeBtn').addEventListener('click', resume);
    $('pauseBtn').addEventListener('click', pause);

    document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
    window.addEventListener('blur', pause);
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 100);
    });

    reset();
    loop();
})();
