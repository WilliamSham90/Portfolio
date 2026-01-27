/*================================================
  Word Guessing Game - JavaScript
  Vanilla JS, Mobile-friendly with on-screen keyboard
================================================*/

(function() {
    'use strict';

    /*================================================
      Sound System (Web Audio API)
    ================================================*/

    const AudioSystem = {
        context: null,
        enabled: true,
        
        init: function() {
            try {
                this.context = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.log('Web Audio API not supported');
                this.enabled = false;
            }
        },
        
        resume: function() {
            if (this.context && this.context.state === 'suspended') {
                this.context.resume();
            }
        },
        
        playTone: function(frequency, duration, type, volume) {
            if (!this.enabled || !this.context) return;
            
            this.resume();
            
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.context.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = type || 'sine';
            
            const vol = volume || 0.1;
            gainNode.gain.setValueAtTime(vol, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);
            
            oscillator.start(this.context.currentTime);
            oscillator.stop(this.context.currentTime + duration);
        },
        
        goodSound: function() {
            this.playTone(523.25, 0.15, 'sine', 0.15); // C5
            setTimeout(() => this.playTone(659.25, 0.15, 'sine', 0.15), 100); // E5
        },
        
        badSound: function() {
            this.playTone(200, 0.2, 'sawtooth', 0.1);
        },
        
        winSound: function() {
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            notes.forEach((freq, i) => {
                setTimeout(() => this.playTone(freq, 0.3, 'sine', 0.15), i * 150);
            });
        },
        
        loseSound: function() {
            const notes = [392, 349.23, 329.63, 293.66]; // G4, F4, E4, D4
            notes.forEach((freq, i) => {
                setTimeout(() => this.playTone(freq, 0.3, 'sine', 0.12), i * 200);
            });
        },
        
        toggle: function() {
            this.enabled = !this.enabled;
            return this.enabled;
        }
    };

    // Initialize audio
    AudioSystem.init();

    /*================================================
      Word List with Hints
    ================================================*/

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
        // 15 new words
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

    /*================================================
      Hangman Game Object
    ================================================*/

    const Hangman = {
        maxWrong: 10,
        
        init: function(words) {
            this.words = words;
            this.hm = document.querySelector('.hangman');
            this.msg = document.querySelector('.message');
            this.msgTitle = document.querySelector('.title');
            this.msgText = document.querySelector('.text');
            this.restart = document.querySelector('.restart');
            this.wrd = this.randomWord();
            this.correct = 0;
            this.guess = document.querySelector('.guess');
            this.wrong = document.querySelector('.wrong');
            this.wrongGuesses = [];
            this.rightGuesses = [];
            this.guessForm = document.querySelector('.guessForm');
            this.guessLetterInput = document.querySelector('.guessLetter');
            this.keyboard = document.getElementById('keyboard');
            this.gameOver = false;
            
            this.setup();
        },

        setup: function() {
            this.binding();
            this.showGuess();
            this.showWrong();
            this.showHint();
            this.resetKeyboard();
            
            // Focus input on desktop
            if (this.guessLetterInput && window.matchMedia('(hover: hover)').matches) {
                this.guessLetterInput.focus();
            }
        },

        showHint: function() {
            const hintEl = document.querySelector('.hint');
            if (hintEl && this.wrd.hint) {
                hintEl.innerHTML = '💡 <strong>Hint:</strong> ' + this.wrd.hint;
            }
        },

        binding: function() {
            const self = this;
            
            // Form submission
            if (this.guessForm) {
                this.guessForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    self.handleFormGuess();
                });
            }
            
            // Restart button
            if (this.restart) {
                this.restart.addEventListener('click', function(e) {
                    e.preventDefault();
                    self.theRestart();
                });
            }
            
            // Keyboard buttons
            if (this.keyboard) {
                const keys = this.keyboard.querySelectorAll('.key');
                keys.forEach(function(key) {
                    key.addEventListener('click', function(e) {
                        e.preventDefault();
                        const letter = this.getAttribute('data-letter');
                        if (letter && !self.gameOver) {
                            AudioSystem.resume();
                            self.processGuess(letter.toLowerCase());
                        }
                    });
                    
                    // Touch events for better mobile response
                    key.addEventListener('touchstart', function(e) {
                        e.preventDefault();
                        this.click();
                    }, { passive: false });
                });
            }
            
            // Physical keyboard support
            document.addEventListener('keydown', function(e) {
                if (self.gameOver) return;
                
                const key = e.key.toLowerCase();
                if (key.match(/^[a-z]$/) && key.length === 1) {
                    // Don't process if typing in input
                    if (document.activeElement === self.guessLetterInput) return;
                    
                    AudioSystem.resume();
                    self.processGuess(key);
                }
            });
        },

        handleFormGuess: function() {
            const guess = this.guessLetterInput.value.toLowerCase();
            this.guessLetterInput.value = '';
            this.guessLetterInput.focus();
            
            if (guess.match(/[a-z]/) && guess.length === 1) {
                AudioSystem.resume();
                this.processGuess(guess);
            }
        },

        processGuess: function(guess) {
            if (this.gameOver) return;
            
            // Already guessed
            if (this.wrongGuesses.includes(guess) || this.rightGuesses.includes(guess)) {
                AudioSystem.badSound();
                this.shakeKey(guess);
                return;
            }
            
            const foundLetters = this.checkGuess(guess);
            
            if (foundLetters.length > 0) {
                this.setLetters(foundLetters);
                AudioSystem.goodSound();
                this.markKeyCorrect(guess);
            } else {
                this.wrongGuesses.push(guess);
                this.markKeyWrong(guess);
                
                if (this.wrongGuesses.length >= this.maxWrong) {
                    this.lose();
                } else {
                    this.showWrong();
                    AudioSystem.badSound();
                }
            }
        },

        randomWord: function() {
            const wordObj = this.words[Math.floor(Math.random() * this.words.length)];
            return this.wordData(wordObj.word, wordObj.hint);
        },

        wordData: function(word, hint) {
            return {
                letters: this.getLetters(word),
                word: word.toLowerCase(),
                totalLetters: word.length,
                hint: hint
            };
        },

        getLetters: function(word) {
            const letters = [];
            for (let i = 0; i < word.length; i++) {
                letters.push({
                    letter: word[i],
                    pos: i
                });
            }
            return letters;
        },

        showGuess: function() {
            let html = '<ul class="word">';
            this.wrd.letters.forEach(function(val, key) {
                html += '<li data-pos="' + key + '" class="letter">*</li>';
            });
            html += '</ul>';
            this.guess.innerHTML = html;
        },

        showWrong: function() {
            let html = '';
            
            if (this.wrongGuesses.length > 0) {
                html = '<ul class="wrongLetters">';
                html += '<p>Wrong (' + this.wrongGuesses.length + '/' + this.maxWrong + '):</p>';
                this.wrongGuesses.forEach(function(val) {
                    html += '<li>' + val.toUpperCase() + '</li>';
                });
                html += '</ul>';
            }
            
            this.wrong.innerHTML = html;
        },

        checkGuess: function(guessedLetter) {
            const self = this;
            const found = [];
            
            this.wrd.letters.forEach(function(val) {
                if (guessedLetter === val.letter.toLowerCase()) {
                    found.push(val);
                    self.rightGuesses.push(val.letter.toLowerCase());
                }
            });
            
            return found;
        },

        setLetters: function(letters) {
            const self = this;
            this.correct += letters.length;
            
            letters.forEach(function(val) {
                const letterEl = document.querySelector('li[data-pos="' + val.pos + '"]');
                if (letterEl) {
                    letterEl.textContent = val.letter.toUpperCase();
                    letterEl.classList.add('correct');
                }
            });
            
            // Check for win
            if (this.correct === this.wrd.letters.length) {
                setTimeout(function() {
                    self.win();
                }, 300);
            }
        },

        resetKeyboard: function() {
            if (!this.keyboard) return;
            
            const keys = this.keyboard.querySelectorAll('.key');
            keys.forEach(function(key) {
                key.classList.remove('correct-key', 'wrong-key');
                key.disabled = false;
            });
        },

        markKeyCorrect: function(letter) {
            const key = this.keyboard.querySelector('.key[data-letter="' + letter.toUpperCase() + '"]');
            if (key) {
                key.classList.add('correct-key');
            }
        },

        markKeyWrong: function(letter) {
            const key = this.keyboard.querySelector('.key[data-letter="' + letter.toUpperCase() + '"]');
            if (key) {
                key.classList.add('wrong-key');
            }
        },

        shakeKey: function(letter) {
            const key = this.keyboard.querySelector('.key[data-letter="' + letter.toUpperCase() + '"]');
            if (key) {
                key.style.animation = 'none';
                key.offsetHeight; // Trigger reflow
                key.style.animation = 'shake 0.3s ease';
            }
        },

        hideMsg: function() {
            this.msg.classList.remove('show');
            this.msgTitle.classList.remove('show');
            this.msgText.classList.remove('show');
            this.restart.classList.remove('show');
        },

        showMsg: function() {
            const self = this;
            
            this.msg.classList.add('show');
            
            setTimeout(function() {
                self.msgTitle.classList.add('show');
            }, 100);
            
            setTimeout(function() {
                self.msgText.classList.add('show');
            }, 400);
            
            setTimeout(function() {
                self.restart.classList.add('show');
            }, 700);
        },

        rating: function() {
            const right = this.rightGuesses.length;
            const wrong = this.wrongGuesses.length || 0;
            const total = right + wrong;
            
            return {
                rating: total > 0 ? Math.floor((right / total) * 100) : 0,
                guesses: total
            };
        },

        win: function() {
            this.gameOver = true;
            const rating = this.rating();
            
            this.msgTitle.innerHTML = '🎉 Awesome, You Won!';
            this.msgText.innerHTML = 
                'You solved "<span class="highlight">' + this.wrd.word + '</span>" in ' +
                '<span class="highlight">' + rating.guesses + '</span> guesses!<br>' +
                'Score: <span class="highlight">' + rating.rating + '%</span>';
            
            this.showMsg();
            AudioSystem.winSound();
        },

        lose: function() {
            this.gameOver = true;
            this.showWrong();
            
            this.msgTitle.innerHTML = 
                '😢 Game Over!<br>The word was "<span class="highlight">' + this.wrd.word + '</span>"';
            this.msgText.innerHTML = "Don't worry, you'll get the next one!";
            
            this.showMsg();
            AudioSystem.loseSound();
        },

        theRestart: function() {
            this.hideMsg();
            this.gameOver = false;
            this.wrd = this.randomWord();
            this.correct = 0;
            this.wrongGuesses = [];
            this.rightGuesses = [];
            this.showGuess();
            this.showWrong();
            this.showHint();
            this.resetKeyboard();
            
            // Focus input on desktop
            if (this.guessLetterInput && window.matchMedia('(hover: hover)').matches) {
                setTimeout(() => this.guessLetterInput.focus(), 100);
            }
        }
    };

    /*================================================
      Add shake animation
    ================================================*/

    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);

    /*================================================
      Initialize Game
    ================================================*/

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            Hangman.init(wordList);
        });
    } else {
        Hangman.init(wordList);
    }

})();
