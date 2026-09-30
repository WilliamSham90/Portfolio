/*================================================
  Word Guess
  Ten lives, an optional hint, and a win streak kept in localStorage.
  Physical keyboard and the on-screen keys both play.
================================================*/

(function () {
    'use strict';

    const MAX_WRONG = 10;

    function store(key, value) {
        try {
            if (value === undefined) return localStorage.getItem(key);
            localStorage.setItem(key, value);
        } catch (e) { return null; }
    }

    /*================ Sound (created on first use, after a gesture) ================*/

    const Sound = {
        ctx: null,
        on: store('wg-sound') !== 'off',
        tone(freq, dur, type, vol) {
            if (!this.on) return;
            try {
                this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
                if (this.ctx.state === 'suspended') this.ctx.resume();
                const osc = this.ctx.createOscillator(), gain = this.ctx.createGain(), t = this.ctx.currentTime;
                osc.type = type || 'sine';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(vol || 0.12, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
                osc.connect(gain).connect(this.ctx.destination);
                osc.start(t);
                osc.stop(t + dur);
            } catch (e) { this.on = false; }
        },
        good() { this.tone(523.25, .15); setTimeout(() => this.tone(659.25, .15), 100); },
        bad() { this.tone(200, .2, 'sawtooth', .08); },
        win() { [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => setTimeout(() => this.tone(f, .3), i * 150)); },
        lose() { [392, 349.23, 329.63, 293.66].forEach((f, i) => setTimeout(() => this.tone(f, .3), i * 200)); }
    };

    /*================ Words ================*/

    const wordList = [
        { word: "chrome", hint: "Google's speedy browser" },
        { word: "firefox", hint: "Mozilla's foxy browser" },
        { word: "codepen", hint: "Online playground for front-end code" },
        { word: "javascript", hint: "The language that makes websites interactive" },
        { word: "jquery", hint: "Write less, do more - a JS library" },
        { word: "twitter", hint: "Social platform now called X" },
        { word: "github", hint: "Where developers store and share code" },
        { word: "wordpress", hint: "Popular blogging and CMS platform" },
        { word: "opera", hint: "Browser named after a musical performance" },
        { word: "sass", hint: "CSS with superpowers - a preprocessor" },
        { word: "layout", hint: "How elements are arranged on a page" },
        { word: "standards", hint: "W3C creates web ___" },
        { word: "semantic", hint: "HTML that describes meaning, not just appearance" },
        { word: "designer", hint: "Creates the visual look of websites" },
        { word: "developer", hint: "Writes the code that builds websites" },
        { word: "module", hint: "A self-contained piece of code" },
        { word: "component", hint: "Reusable building block in React or Vue" },
        { word: "website", hint: "A collection of web pages" },
        { word: "creative", hint: "Thinking outside the box" },
        { word: "banner", hint: "Large image often at the top of a page" },
        { word: "browser", hint: "Software used to view websites" },
        { word: "screen", hint: "The display you're looking at" },
        { word: "mobile", hint: "Phones and tablets are ___ devices" },
        { word: "footer", hint: "Section at the bottom of a webpage" },
        { word: "header", hint: "Section at the top of a webpage" },
        { word: "typography", hint: "The art of arranging text and fonts" },
        { word: "responsive", hint: "Design that adapts to different screen sizes" },
        { word: "programmer", hint: "Someone who writes code" },
        { word: "css", hint: "Styles the look of HTML elements" },
        { word: "border", hint: "Line around an element's edge" },
        { word: "compass", hint: "CSS authoring framework for Sass" },
        { word: "grunt", hint: "JavaScript task runner" },
        { word: "pixel", hint: "Smallest unit of a digital image" },
        { word: "document", hint: "The entire HTML page object" },
        { word: "object", hint: "Data structure with properties and methods" },
        { word: "ruby", hint: "Programming language, gem of the web" },
        { word: "modernizr", hint: "Detects browser feature support" },
        { word: "bootstrap", hint: "Popular CSS framework by Twitter" },
        { word: "python", hint: "Snake-named programming language" },
        { word: "php", hint: "Server-side scripting language" },
        { word: "pattern", hint: "Repeatable solution to common problems" },
        { word: "ajax", hint: "Load data without refreshing the page" },
        { word: "node", hint: "JavaScript runtime for servers" },
        { word: "element", hint: "A single HTML tag and its contents" },
        { word: "android", hint: "Google's mobile operating system" },
        { word: "application", hint: "Software program or app" },
        { word: "adobe", hint: "Company behind Photoshop and Illustrator" },
        { word: "apple", hint: "Tech company with a fruity logo" },
        { word: "google", hint: "Search engine giant" },
        { word: "microsoft", hint: "Windows and Office creator" },
        { word: "bookmark", hint: "Save a webpage for later" },
        { word: "internet", hint: "Global network of connected computers" },
        { word: "icon", hint: "Small image representing an action or app" },
        { word: "svg", hint: "Scalable vector graphics format" },
        { word: "background", hint: "What's behind the content" },
        { word: "property", hint: "CSS attribute like color or width" },
        { word: "syntax", hint: "Rules for writing code correctly" },
        { word: "flash", hint: "Retired plugin once used for animations" },
        { word: "html", hint: "Markup language for web structure" },
        { word: "font", hint: "Typeface used for text" },
        { word: "blog", hint: "Online journal or diary" },
        { word: "network", hint: "Connected computers sharing resources" },
        { word: "server", hint: "Computer that hosts websites" },
        { word: "content", hint: "Text, images, and media on a page" },
        { word: "database", hint: "Organized collection of data" },
        { word: "socket", hint: "Real-time two-way communication" },
        { word: "function", hint: "Reusable block of code" },
        { word: "variable", hint: "Container that stores a value" },
        { word: "link", hint: "Clickable connection to another page" },
        { word: "apache", hint: "Popular open-source web server" },
        { word: "query", hint: "Request for data from a database" },
        { word: "proxy", hint: "Intermediary server between client and destination" },
        { word: "backbone", hint: "MVC framework for JavaScript" },
        { word: "angular", hint: "Google's TypeScript framework" },
        { word: "email", hint: "Electronic mail messages" },
        { word: "underscore", hint: "JavaScript utility library (_)" },
        { word: "cloud", hint: "Remote servers accessed via internet" },
        { word: "react", hint: "Facebook's UI component library" },
        { word: "vue", hint: "Progressive JavaScript framework" },
        { word: "webpack", hint: "Module bundler for JavaScript" },
        { word: "npm", hint: "Node package manager" },
        { word: "api", hint: "Interface for software communication" },
        { word: "json", hint: "Lightweight data format from JavaScript" },
        { word: "terminal", hint: "Command line interface" },
        { word: "cursor", hint: "Pointer that shows mouse position" },
        { word: "margin", hint: "Space outside an element's border" },
        { word: "padding", hint: "Space inside an element's border" },
        { word: "flexbox", hint: "CSS layout for flexible containers" },
        { word: "grid", hint: "CSS layout with rows and columns" },
        { word: "animation", hint: "Making elements move over time" },
        { word: "transform", hint: "CSS property to rotate, scale, or move" },
        { word: "gradient", hint: "Smooth transition between colors" },
        { word: "shadow", hint: "Effect that adds depth to elements" },
        { word: "opacity", hint: "How transparent an element is" },
        { word: "cookies", hint: "Small data stored by websites in your browser" },
        { word: "cache", hint: "Temporary storage for faster loading" },
        { word: "domain", hint: "Website address like example.com" },
        { word: "hosting", hint: "Service that stores your website files" },
        { word: "encryption", hint: "Scrambling data for security" },
        { word: "firewall", hint: "Security barrier for networks" },
        { word: "bandwidth", hint: "Amount of data that can be transferred" },
        { word: "download", hint: "Transfer files from the internet" },
        { word: "upload", hint: "Send files to the internet" },
        { word: "streaming", hint: "Watch or listen without downloading" },
        { word: "hashtag", hint: "Symbol (#) used to tag topics" },
        { word: "viral", hint: "Content spreading rapidly online" },
        { word: "router", hint: "Device that directs internet traffic" },
        { word: "localhost", hint: "Your own computer as a server (127.0.0.1)" },
        { word: "debugging", hint: "Finding and fixing code errors" }
    ];

    /*================ State + DOM ================*/

    const $ = id => document.getElementById(id);
    const guessEl = document.querySelector('.guess');
    const keyboard = $('keyboard');
    const message = $('message');
    const hintBtn = $('hintBtn');
    const hintEl = $('hint');
    const soundBtn = $('soundBtn');

    let current, guessed, wrong, over, lastIndex = -1;
    let stats = {
        streak: Number(store('wg-streak')) || 0,
        best: Number(store('wg-best')) || 0,
        wins: Number(store('wg-wins')) || 0
    };

    // build the on-screen keyboard once
    ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].forEach((row, r) => {
        keyboard.children[r].innerHTML = [...row].map(l =>
            '<button class="key" type="button" data-letter="' + l.toLowerCase() + '">' + l + '</button>').join('');
    });
    const keyFor = l => keyboard.querySelector('.key[data-letter="' + l + '"]');

    /*================ Game ================*/

    function newWord() {
        // never the same word twice in a row
        let i;
        do { i = Math.floor(Math.random() * wordList.length); } while (i === lastIndex && wordList.length > 1);
        lastIndex = i;
        current = wordList[i];
        guessed = new Set();
        wrong = [];
        over = false;

        guessEl.innerHTML = '<ul class="word" aria-label="' + current.word.length + ' letter word">' +
            [...current.word].map(() => '<li class="letter"><span></span></li>').join('') + '</ul>';
        keyboard.querySelectorAll('.key').forEach(k => {
            k.classList.remove('correct-key', 'wrong-key');
            k.disabled = false;
        });
        hintEl.hidden = true;
        hintEl.textContent = current.hint;
        hintBtn.hidden = false;
        hintBtn.setAttribute('aria-expanded', 'false');
        message.hidden = true;
        renderLives();
        renderStats();
    }

    function guess(letter) {
        if (over || !/^[a-z]$/.test(letter)) return;
        const key = keyFor(letter);
        if (guessed.has(letter)) {
            shake(key);
            return;
        }
        guessed.add(letter);
        if (key) key.disabled = true;

        if (current.word.includes(letter)) {
            if (key) key.classList.add('correct-key');
            guessEl.querySelectorAll('.letter').forEach((li, i) => {
                if (current.word[i] === letter) {
                    li.firstChild.textContent = letter;
                    li.classList.add('correct');
                }
            });
            Sound.good();
            if ([...current.word].every(l => guessed.has(l))) setTimeout(win, 350);
        } else {
            if (key) key.classList.add('wrong-key');
            wrong.push(letter);
            renderLives();
            if (wrong.length >= MAX_WRONG) lose();
            else Sound.bad();
        }
    }

    function win() {
        over = true;
        stats.wins++;
        stats.streak++;
        stats.best = Math.max(stats.best, stats.streak);
        saveStats();
        const tries = guessed.size;
        const accuracy = Math.round(((tries - wrong.length) / tries) * 100);
        showMessage('🎉 You got it!',
            'The word was <span class="highlight">' + current.word + '</span>.<br>' +
            tries + ' guesses · ' + accuracy + '% accuracy · streak ' + stats.streak);
        Sound.win();
    }

    function lose() {
        over = true;
        stats.streak = 0;
        saveStats();
        // show the answer on the board too
        guessEl.querySelectorAll('.letter').forEach((li, i) => {
            if (!li.classList.contains('correct')) {
                li.firstChild.textContent = current.word[i];
                li.classList.add('missed');
            }
        });
        showMessage('😢 Out of lives',
            'The word was <span class="highlight">' + current.word + '</span>.<br>You\'ll get the next one!');
        Sound.lose();
    }

    function showMessage(title, html) {
        $('msgTitle').textContent = title;
        $('msgText').innerHTML = html;
        setTimeout(() => {
            message.hidden = false;
            $('restartBtn').focus();
        }, 300);
    }

    /*================ Rendering ================*/

    function renderLives() {
        const left = MAX_WRONG - wrong.length;
        $('lives').innerHTML = Array.from({ length: MAX_WRONG }, (_, i) =>
            '<i class="' + (i < left ? 'on' : '') + '"></i>').join('');
        $('livesText').textContent = left === 1 ? 'Last life!' : left + ' lives left';
        $('livesText').classList.toggle('danger', left <= 3);
    }

    function renderStats() {
        $('streak').textContent = stats.streak;
        $('bestStreak').textContent = stats.best;
        $('wins').textContent = stats.wins;
    }

    function saveStats() {
        store('wg-streak', stats.streak);
        store('wg-best', stats.best);
        store('wg-wins', stats.wins);
        renderStats();
    }

    function shake(el) {
        if (!el) return;
        el.classList.remove('shake');
        void el.offsetWidth; // restart the animation
        el.classList.add('shake');
    }

    function renderSound() {
        soundBtn.textContent = Sound.on ? '🔊' : '🔇';
        soundBtn.setAttribute('aria-pressed', String(Sound.on));
    }

    /*================ Input ================*/

    keyboard.addEventListener('click', e => {
        const key = e.target.closest('.key');
        if (key) guess(key.dataset.letter);
    });

    document.addEventListener('keydown', e => {
        if (e.ctrlKey || e.metaKey || e.altKey) return; // leave shortcuts alone
        if (over) {
            if (e.key === 'Enter' && !message.hidden) {
                e.preventDefault();
                newWord();
            }
            return;
        }
        const letter = e.key.toLowerCase();
        if (/^[a-z]$/.test(letter)) {
            guess(letter);
            const key = keyFor(letter);
            if (key) {
                key.classList.add('pressed');
                setTimeout(() => key.classList.remove('pressed'), 120);
            }
        }
    });

    hintBtn.addEventListener('click', () => {
        hintEl.hidden = false;
        hintBtn.hidden = true;
        hintBtn.setAttribute('aria-expanded', 'true');
    });

    soundBtn.addEventListener('click', () => {
        Sound.on = !Sound.on;
        store('wg-sound', Sound.on ? 'on' : 'off');
        renderSound();
    });

    $('restartBtn').addEventListener('click', newWord);

    renderSound();
    newWord();
})();
