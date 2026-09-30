/*================================================
  Pong
  1 player: ten rounds against the computer, it speeds up every round and
  one lost round ends the run. 2 players: first to 7 on the same screen.
  All movement is in pixels per second, so it plays the same at 60Hz or 144Hz.
================================================*/

(function () {
    'use strict';

    const W = 1800, H = 1100;                 // court size in canvas pixels
    const ROUNDS = [5, 5, 5, 4, 4, 4, 3, 3, 3, 1];
    const VERSUS_TARGET = 7;
    const ROUND_COLOURS = ['#1ABC9C', '#16A085', '#2ECC71', '#27AE60', '#3498DB', '#2980B9',
        '#9B59B6', '#8E44AD', '#34495E', '#E74C3C', '#C0392B', '#D35400', '#E67E22'];
    const START_COLOUR = '#2C3E50';
    const PADDLE = { w: 20, h: 120, inset: 150 };
    const BALL = { size: 20, speed: 560, maxAngle: 0.9 }; // vy up to 0.9 * vx
    const SERVE_DELAY = 1000;

    const $ = id => document.getElementById(id);
    const canvas = $('pong-canvas');
    const ctx = canvas.getContext('2d', { alpha: false });
    canvas.width = W;
    canvas.height = H;

    function store(key, value) {
        try {
            if (value === undefined) return localStorage.getItem(key);
            localStorage.setItem(key, value);
        } catch (e) { return null; }
    }

    /*================ Sound (created on the first gesture) ================*/

    const Sound = {
        ctx: null,
        on: store('pong-sound') !== 'off',
        beep(freq, dur, type) {
            if (!this.on) return;
            try {
                this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
                if (this.ctx.state === 'suspended') this.ctx.resume();
                const osc = this.ctx.createOscillator(), gain = this.ctx.createGain(), t = this.ctx.currentTime;
                osc.type = type || 'square';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.08, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
                osc.connect(gain).connect(this.ctx.destination);
                osc.start(t);
                osc.stop(t + dur);
            } catch (e) { this.on = false; }
        },
        hit() { this.beep(440, .08); },
        score() { this.beep(220, .2); },
        level() { this.beep(880, .3, 'sine'); }
    };

    /*================ State ================*/

    let mode = 1;             // 1 = vs computer, 2 = two players
    let state = 'menu';       // menu | serving | playing | paused | over
    let round, colour, colours, serveAt, server, lastTime = 0, rafId = 0;
    const left = { x: PADDLE.inset, y: H / 2 - PADDLE.h / 2, score: 0, speed: 420, target: null };
    const right = { x: W - PADDLE.inset - PADDLE.w, y: H / 2 - PADDLE.h / 2, score: 0, speed: 300, target: null };
    const ball = { x: W / 2, y: H / 2, vx: 0, vy: 0, speed: BALL.speed, rally: 0 };
    const keys = new Set();

    function newGame(m) {
        mode = m;
        round = 0;
        colours = ROUND_COLOURS.slice();
        colour = START_COLOUR;
        left.score = right.score = 0;
        left.speed = 420;
        right.speed = mode === 1 ? 300 : 420;
        ball.speed = BALL.speed;
        left.y = right.y = H / 2 - PADDLE.h / 2;
        left.target = right.target = null;
        keys.clear();
        serve(right);
        showScreen(null);
        $('pause-btn').disabled = false;
        updateHud();
        start();
    }

    // the player who lost the point serves, from their own paddle
    function serve(from) {
        server = from;
        serveAt = performance.now() + SERVE_DELAY;
        ball.rally = 0;
        ball.x = W / 2;
        ball.y = H / 2;
        state = 'serving';
    }

    function launch() {
        const dir = server === left ? 1 : -1;
        ball.x = server === left ? left.x + PADDLE.w + BALL.size : right.x - BALL.size;
        ball.y = server.y + PADDLE.h / 2;
        ball.vx = dir * ball.speed;
        ball.vy = (Math.random() < .5 ? -1 : 1) * ball.speed * (0.35 + Math.random() * 0.3);
        state = 'playing';
    }

    /*================ Update ================*/

    function movePaddle(p, dir, dt) {
        if (p.target !== null) {
            // touch/mouse: glide towards the finger, a bit faster than keys
            const centre = p.y + PADDLE.h / 2, diff = p.target - centre, step = p.speed * 1.6 * dt;
            p.y += Math.abs(diff) < step ? diff : Math.sign(diff) * step;
        } else {
            p.y += dir * p.speed * dt;
        }
        p.y = Math.max(0, Math.min(H - PADDLE.h, p.y));
    }

    function cpu(dt) {
        const centre = right.y + PADDLE.h / 2;
        const coming = ball.vx > 0 && state === 'playing';
        const aim = coming ? ball.y : H / 2;
        const diff = aim - centre;
        if (Math.abs(diff) < 12) return;
        const speed = coming ? right.speed : right.speed / 4;
        right.y += Math.sign(diff) * Math.min(Math.abs(diff), speed * dt);
        right.y = Math.max(0, Math.min(H - PADDLE.h, right.y));
    }

    function dirFor(up, down) {
        return (down.some(k => keys.has(k)) ? 1 : 0) - (up.some(k => keys.has(k)) ? 1 : 0);
    }

    function update(dt) {
        if (mode === 1) {
            movePaddle(left, dirFor(['KeyW', 'ArrowUp'], ['KeyS', 'ArrowDown']), dt);
            cpu(dt);
        } else {
            movePaddle(left, dirFor(['KeyW'], ['KeyS']), dt);
            movePaddle(right, dirFor(['ArrowUp'], ['ArrowDown']), dt);
        }

        if (state === 'serving') {
            if (performance.now() >= serveAt) launch();
            return;
        }

        // sub-steps so a fast ball can't jump straight through a paddle
        const steps = Math.ceil(Math.max(Math.abs(ball.vx), Math.abs(ball.vy)) * dt / 8);
        for (let s = 0; s < steps && state === 'playing'; s++) stepBall(dt / steps);
    }

    function stepBall(dt) {
        const r = BALL.size / 2;
        ball.x += ball.vx * dt;
        ball.y += ball.vy * dt;

        if (ball.y - r < 0) { ball.y = r; ball.vy = Math.abs(ball.vy); }
        if (ball.y + r > H) { ball.y = H - r; ball.vy = -Math.abs(ball.vy); }

        const paddle = ball.vx < 0 ? left : right;
        if (ball.x + r > paddle.x && ball.x - r < paddle.x + PADDLE.w &&
            ball.y + r > paddle.y && ball.y - r < paddle.y + PADDLE.h) {
            // angle depends on where it hit: edges send it steep, centre sends it flat
            const offset = (ball.y - (paddle.y + PADDLE.h / 2)) / (PADDLE.h / 2 + r);
            const speed = ball.speed * Math.min(1.5, 1 + ball.rally * 0.03);
            ball.rally++;
            ball.vx = (paddle === left ? 1 : -1) * speed;
            ball.vy = offset * speed * BALL.maxAngle;
            ball.x = paddle === left ? paddle.x + PADDLE.w + r : paddle.x - r;
            Sound.hit();
        }

        if (ball.x + r < 0) point(right);
        else if (ball.x - r > W) point(left);
    }

    function point(winner) {
        winner.score++;
        Sound.score();
        const loser = winner === left ? right : left;

        if (mode === 2) {
            if (winner.score >= VERSUS_TARGET) {
                return finish((winner === left ? 'Left' : 'Right') + ' player wins!',
                    left.score + ' – ' + right.score);
            }
        } else if (winner === right && right.score >= ROUNDS[round]) {
            const best = Math.max(Number(store('pong-best')) || 0, round + 1);
            store('pong-best', best);
            return finish('Game over', 'The computer took round ' + (round + 1) + '. Your best: round ' + best + ' of ' + ROUNDS.length + '.');
        } else if (winner === left && left.score >= ROUNDS[round]) {
            if (round === ROUNDS.length - 1) {
                store('pong-best', ROUNDS.length);
                return finish('You win! 🏆', 'All ' + ROUNDS.length + ' rounds cleared.');
            }
            levelUp();
        }
        updateHud();
        serve(loser);
    }

    function levelUp() {
        round++;
        left.score = right.score = 0;
        left.speed += 18;
        right.speed += 12;
        ball.speed += 12;
        if (!colours.length) colours = ROUND_COLOURS.slice();
        colour = colours.splice(Math.floor(Math.random() * colours.length), 1)[0];
        Sound.level();
    }

    function finish(title, text) {
        state = 'over';
        $('pause-btn').disabled = true;
        $('resultTitle').textContent = title;
        $('resultText').textContent = text;
        draw();
        showScreen('resultScreen');
    }

    /*================ Drawing ================*/

    function draw() {
        ctx.fillStyle = colour;
        ctx.fillRect(0, 0, W, H);

        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#fff';
        ctx.setLineDash([2, 15]);
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(W / 2, H - 150);
        ctx.lineTo(W / 2, 150);
        ctx.stroke();

        ctx.font = '120px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(String(left.score), W / 2 - 300, 200);
        ctx.fillText(String(right.score), W / 2 + 300, 200);

        ctx.fillRect(left.x, left.y, PADDLE.w, PADDLE.h);
        ctx.fillRect(right.x, right.y, PADDLE.w, PADDLE.h);

        if (state === 'playing') {
            ctx.fillRect(ball.x - BALL.size / 2, ball.y - BALL.size / 2, BALL.size, BALL.size);
        }
    }

    function updateHud() {
        $('roundInfo').textContent = mode === 1
            ? 'Round ' + (round + 1) + ' of ' + ROUNDS.length + ' · first to ' + ROUNDS[round]
            : 'First to ' + VERSUS_TARGET;
    }

    /*================ Loop ================*/

    function frame(now) {
        const dt = Math.min(0.05, (now - lastTime) / 1000); // cap after a hitch
        lastTime = now;
        if (state === 'playing' || state === 'serving') {
            update(dt);
            draw();
            rafId = requestAnimationFrame(frame);
        } else {
            rafId = 0;
        }
    }

    function start() {
        if (rafId) return;
        lastTime = performance.now();
        rafId = requestAnimationFrame(frame);
    }

    /*================ Screens + pause ================*/

    function showScreen(id, focus = true) {
        ['menu', 'pausedScreen', 'resultScreen'].forEach(s => { $(s).hidden = s !== id; });
        const btn = focus && id && $(id).querySelector('button');
        if (btn) btn.focus({ preventScroll: true });
    }

    let resumeState = 'playing';
    function pause() {
        if (state !== 'playing' && state !== 'serving') return;
        resumeState = state;
        state = 'paused';
        keys.clear();
        setPauseIcon(true);
        showScreen('pausedScreen');
    }
    function resume() {
        if (state !== 'paused') return;
        // keep the serve countdown honest after a pause
        if (resumeState === 'serving') serveAt = performance.now() + SERVE_DELAY;
        state = resumeState;
        setPauseIcon(false);
        showScreen(null);
        start();
    }
    function setPauseIcon(paused) {
        document.querySelector('.icon-pause').hidden = paused;
        document.querySelector('.icon-play').hidden = !paused;
        $('pause-btn').setAttribute('aria-label', paused ? 'Resume' : 'Pause (Esc)');
    }

    function renderSound() {
        document.querySelector('.icon-sound-on').hidden = !Sound.on;
        document.querySelector('.icon-sound-off').hidden = Sound.on;
        $('sound-btn').setAttribute('aria-pressed', String(Sound.on));
    }

    function showMenu(firstLoad) {
        state = 'menu';
        $('pause-btn').disabled = true;
        const best = Number(store('pong-best'));
        $('bestInfo').hidden = !best;
        $('bestInfo').textContent = 'Your best vs the computer: round ' + best + ' of ' + ROUNDS.length;
        $('roundInfo').textContent = 'Pong';
        colour = START_COLOUR;
        left.score = right.score = 0;
        draw();
        showScreen('menu', !firstLoad); // no focus ring on arrival
    }

    /*================ Input ================*/

    const GAME_KEYS = ['KeyW', 'KeyS', 'ArrowUp', 'ArrowDown'];
    document.addEventListener('keydown', e => {
        if (e.code === 'Escape' || e.code === 'KeyP') {
            if (state === 'paused') resume(); else pause();
            return;
        }
        if (GAME_KEYS.includes(e.code)) {
            e.preventDefault(); // stop the page scrolling
            keys.add(e.code);
            left.target = right.target = null; // keys take over from touch
        }
    });
    document.addEventListener('keyup', e => keys.delete(e.code));

    // Touch/mouse: each pointer steers the paddle on its half of the court
    // (in 1 player mode anywhere steers yours).
    const pointers = new Map();
    function courtY(e) {
        const r = canvas.getBoundingClientRect();
        return (e.clientY - r.top) * (H / r.height);
    }
    function paddleFor(e) {
        if (mode === 1) return left;
        const r = canvas.getBoundingClientRect();
        return e.clientX - r.left < r.width / 2 ? left : right;
    }
    canvas.addEventListener('pointerdown', e => {
        if (state !== 'playing' && state !== 'serving') return;
        canvas.setPointerCapture(e.pointerId);
        const p = paddleFor(e);
        pointers.set(e.pointerId, p);
        p.target = courtY(e);
    });
    canvas.addEventListener('pointermove', e => {
        const p = pointers.get(e.pointerId);
        if (p) p.target = courtY(e);
    });
    ['pointerup', 'pointercancel'].forEach(t => canvas.addEventListener(t, e => {
        const p = pointers.get(e.pointerId);
        if (p) p.target = null;
        pointers.delete(e.pointerId);
    }));

    document.querySelectorAll('[data-mode]').forEach(b =>
        b.addEventListener('click', () => newGame(Number(b.dataset.mode))));
    $('againBtn').addEventListener('click', () => newGame(mode));
    $('menuBtn').addEventListener('click', () => showMenu(false));
    $('resumeBtn').addEventListener('click', resume);
    $('pause-btn').addEventListener('click', () => (state === 'paused' ? resume() : pause()));
    $('sound-btn').addEventListener('click', () => {
        Sound.on = !Sound.on;
        store('pong-sound', Sound.on ? 'on' : 'off');
        renderSound();
    });

    // never keep playing in a background tab
    document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
    window.addEventListener('blur', pause);

    renderSound();
    showMenu(true);
})();
