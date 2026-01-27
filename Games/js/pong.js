/*================================================
  Pong Game - JavaScript
  Mobile-friendly with touch controls
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
        
        play: function(frequency, duration, type) {
            if (!this.enabled || !this.context) return;
            
            this.resume();
            
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.context.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = type || 'square';
            
            gainNode.gain.setValueAtTime(0.1, this.context.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);
            
            oscillator.start(this.context.currentTime);
            oscillator.stop(this.context.currentTime + duration);
        },
        
        toggle: function() {
            this.enabled = !this.enabled;
            return this.enabled;
        }
    };

    // Initialize audio system
    AudioSystem.init();

    // Sound effect functions
    const beep1 = { play: () => AudioSystem.play(440, 0.1, 'square') };  // Paddle hit
    const beep2 = { play: () => AudioSystem.play(220, 0.2, 'square') };  // Score
    const beep3 = { play: () => AudioSystem.play(880, 0.3, 'sine') };    // Level up

    /*================================================
      Game Constants
    ================================================*/

    const ROUNDS = [5, 5, 5, 4, 4, 4, 3, 3, 3, 1];

    const ROUND_COLOURS = [
        "#1ABC9C", "#16A085", "#2ECC71", "#27AE60",
        "#3498DB", "#2980B9", "#9B59B6", "#8E44AD",
        "#34495E", "#E74C3C", "#C0392B", "#D35400", "#E67E22"
    ];

    const COLOURS = {
        DEFAULT: "#2C3E50",
        WHITE: "#FFFFFF"
    };

    const DIRECTION = {
        IDLE: "IDLE",
        UP: "UP",
        DOWN: "DOWN",
        LEFT: "LEFT",
        RIGHT: "RIGHT"
    };

    /*================================================
      Paddle Class
    ================================================*/

    class Paddle {
        constructor({ x, y }) {
            this.x = x;
            this.y = y;
            this.width = 20;
            this.height = 100;
            this.score = 0;
            this.speed = 5;
            this.move = DIRECTION.IDLE;
        }

        addScore() {
            this.score += 1;
        }

        getScore() {
            return this.score;
        }

        getX() {
            return this.x;
        }

        getY() {
            return this.y;
        }

        draw(context) {
            context.fillStyle = COLOURS.WHITE;
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    /*================================================
      PaddleBot Class (AI Opponent)
    ================================================*/

    class PaddleBot extends Paddle {
        constructor(parameters) {
            super(parameters);
            this.SPEED_INCREMENT = 0.2;
        }

        levelUp() {
            this.score = 0;
            this.speed += this.SPEED_INCREMENT;
        }

        handleUpMovement(target) {
            if (this.y > target.y - this.height / 2) {
                if (target.moveX === DIRECTION.RIGHT) {
                    this.y -= this.speed;
                } else {
                    this.y -= this.speed / 4;
                }
            }
        }

        handleDownMovement(target) {
            if (this.y < target.y - this.height / 2) {
                if (target.moveX === DIRECTION.RIGHT) {
                    this.y += this.speed;
                } else {
                    this.y += this.speed / 4;
                }
            }
        }

        handleWallCollision(canvas) {
            if (this.y >= canvas.height - this.height) {
                this.y = canvas.height - this.height;
            } else if (this.y <= 0) {
                this.y = 0;
            }
        }

        update(canvas, target) {
            this.handleUpMovement(target);
            this.handleDownMovement(target);
            this.handleWallCollision(canvas);
        }
    }

    /*================================================
      Player Class
    ================================================*/

    class Player extends Paddle {
        constructor(parameters) {
            super(parameters);
            this.SPEED_INCREMENT = 0.3;
            this.speed = 7;
        }

        levelUp() {
            this.score = 0;
            this.speed += this.SPEED_INCREMENT;
        }

        handleMovement() {
            if (this.move === DIRECTION.UP) {
                this.y -= this.speed;
            } else if (this.move === DIRECTION.DOWN) {
                this.y += this.speed;
            }
        }

        handleWallCollision(canvas) {
            if (this.y <= 0) {
                this.y = 0;
            } else if (this.y >= canvas.height - this.height) {
                this.y = canvas.height - this.height;
            }
        }

        update(canvas) {
            this.handleMovement();
            this.handleWallCollision(canvas);
        }
    }

    /*================================================
      Ball Class
    ================================================*/

    class Ball {
        constructor({ x, y }) {
            this.BALL_SIZE = 20;
            this.BALL_SPEED = 9;
            this.BALL_SPEED_LEVEL_INCREMENT = 0.2;
            
            this.x = x;
            this.y = y;
            this.initialX = x;
            this.initialY = y;
            this.width = this.BALL_SIZE;
            this.height = this.BALL_SIZE;
            this.speedX = this.BALL_SPEED;
            this.speedY = this.BALL_SPEED * (2 / 3);
            this.moveX = DIRECTION.IDLE;
            this.moveY = DIRECTION.IDLE;
        }

        reset() {
            this.x = this.initialX;
            this.y = this.initialY;
            this.moveX = DIRECTION.IDLE;
            this.moveY = DIRECTION.IDLE;
        }

        levelUp() {
            this.speedX += this.BALL_SPEED_LEVEL_INCREMENT;
            this.speedY += this.BALL_SPEED_LEVEL_INCREMENT;
        }

        isOutOfLeftBounds() {
            return this.x < 0;
        }

        isOutOfRightBounds(canvas) {
            return this.x >= canvas.width - this.width;
        }

        handlePaddleCollision(paddle) {
            if (this.moveX === DIRECTION.LEFT) {
                this.x = paddle.getX() + this.width;
                this.moveX = DIRECTION.RIGHT;
            } else {
                this.x = paddle.getX() - this.width;
                this.moveX = DIRECTION.LEFT;
            }

            beep1.play();
        }

        handleWallCollision(canvas) {
            if (this.y <= 0) {
                this.moveY = DIRECTION.DOWN;
            } else if (this.y >= canvas.height - this.height) {
                this.moveY = DIRECTION.UP;
            }
        }

        handleVerticalMovement() {
            if (this.moveY === DIRECTION.UP) {
                this.y -= this.speedY;
            } else if (this.moveY === DIRECTION.DOWN) {
                this.y += this.speedY;
            }
        }

        handleHorizontalMovement() {
            if (this.moveX === DIRECTION.LEFT) {
                this.x -= this.speedX;
            } else if (this.moveX === DIRECTION.RIGHT) {
                this.x += this.speedX;
            }
        }

        getRandomDirection() {
            const directions = [DIRECTION.UP, DIRECTION.DOWN];
            const index = Math.round(Math.random());
            return directions[index];
        }

        handleServe(server, direction) {
            this.moveX = direction;
            this.moveY = this.getRandomDirection();
            this.y = server.y + server.height / 2;
            this.x = server.x + (direction === DIRECTION.LEFT ? -server.width : server.width);
        }

        update(canvas) {
            this.handleVerticalMovement();
            this.handleHorizontalMovement();
            this.handleWallCollision(canvas);
        }

        draw(context) {
            context.fillRect(
                this.x - this.width / 2,
                this.y - this.height / 2,
                this.width,
                this.height
            );
        }
    }

    /*================================================
      Game Class
    ================================================*/

    class Game {
        constructor() {
            this.SCREEN_WIDTH = 1800;
            this.SCREEN_HEIGHT = 1100;
            this.TURN_DELAY_MS = 1000;
            this.MENU_DELAY_MS = 1000;
            this.WALL_OFFSET = 150;

            this.canvas = document.getElementById('pong-canvas');
            this.context = this.canvas.getContext('2d', { alpha: false });

            this.canvas.width = this.SCREEN_WIDTH;
            this.canvas.height = this.SCREEN_HEIGHT;

            // Responsive sizing
            this.updateCanvasSize();
            window.addEventListener('resize', () => this.updateCanvasSize());

            this.initialize();
            this.listen();
            this.setupUI();
        }

        updateCanvasSize() {
            const maxWidth = Math.min(900, window.innerWidth - 20);
            const maxHeight = Math.min(550, window.innerHeight - 200);
            
            const aspectRatio = this.SCREEN_WIDTH / this.SCREEN_HEIGHT;
            let width = maxWidth;
            let height = width / aspectRatio;
            
            if (height > maxHeight) {
                height = maxHeight;
                width = height * aspectRatio;
            }
            
            this.canvas.style.width = `${width}px`;
            this.canvas.style.height = `${height}px`;
        }

        setupUI() {
            // Pause button
            const pauseBtn = document.getElementById('pause-btn');
            if (pauseBtn) {
                pauseBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (this.running) {
                        this.togglePause();
                    }
                });
            }
            
            // Sound button
            const soundBtn = document.getElementById('sound-btn');
            if (soundBtn) {
                soundBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const enabled = AudioSystem.toggle();
                    this.updateSoundIcon(enabled);
                });
            }
        }

        updateSoundIcon(enabled) {
            const soundBtn = document.getElementById('sound-btn');
            if (soundBtn) {
                const iconOn = soundBtn.querySelector('.icon-sound-on');
                const iconOff = soundBtn.querySelector('.icon-sound-off');
                if (iconOn && iconOff) {
                    iconOn.style.display = enabled ? 'block' : 'none';
                    iconOff.style.display = enabled ? 'none' : 'block';
                }
            }
        }

        updatePauseIcon(paused) {
            const pauseBtn = document.getElementById('pause-btn');
            if (pauseBtn) {
                const iconPause = pauseBtn.querySelector('.icon-pause');
                const iconPlay = pauseBtn.querySelector('.icon-play');
                if (iconPause && iconPlay) {
                    iconPause.style.display = paused ? 'none' : 'block';
                    iconPlay.style.display = paused ? 'block' : 'none';
                }
            }
        }

        initialize() {
            this.availableColours = [...ROUND_COLOURS];

            this.playerA = new Player({
                x: this.WALL_OFFSET,
                y: this.canvas.height / 2
            });

            this.playerB = new PaddleBot({
                x: this.canvas.width - this.WALL_OFFSET,
                y: this.canvas.height / 2
            });

            this.ball = new Ball({
                x: this.canvas.width / 2,
                y: this.canvas.height / 2
            });

            this.round = 0;
            this.running = false;
            this.gameOver = false;
            this.paused = false;
            this.playerTurn = this.playerB;
            this.timer = performance.now();
            this.colour = COLOURS.DEFAULT;

            this.showMenuScreen("Press key or tap to start");
            this.updatePauseIcon(false);
        }

        showMenuScreen(text, callback) {
            const RECTANGLE_WIDTH = 800;
            const RECTANGLE_HEIGHT = 120;
            const MENU_TIMEOUT_MS = 3000;

            this.draw();

            this.context.font = "50px Courier New";
            this.context.fillStyle = this.colour;

            this.context.fillRect(
                this.canvas.width / 2 - RECTANGLE_WIDTH / 2,
                this.canvas.height / 2 - RECTANGLE_HEIGHT / 2,
                RECTANGLE_WIDTH,
                RECTANGLE_HEIGHT
            );

            this.context.fillStyle = COLOURS.WHITE;
            this.context.textAlign = "center";
            this.context.textBaseline = "middle";

            this.context.fillText(text, this.canvas.width / 2, this.canvas.height / 2);

            if (callback) {
                setTimeout(callback.bind(this), MENU_TIMEOUT_MS);
            }
        }

        hasCollision(ball, player) {
            return (
                ball.x < player.x + player.width &&
                ball.x + ball.width > player.x &&
                ball.y < player.y + player.height &&
                ball.y + ball.height > player.y
            );
        }

        levelUp() {
            this.round += 1;
            this.playerA.levelUp();
            this.playerB.levelUp();
            this.ball.levelUp();
            this.colour = this.getRandomColour();

            beep3.play();
        }

        hasWonRound(object) {
            return object.getScore() >= ROUNDS[this.round];
        }

        hasNextRound() {
            return ROUNDS[this.round + 1];
        }

        getServeDirection() {
            return this.playerTurn === this.playerA ? DIRECTION.RIGHT : DIRECTION.LEFT;
        }

        update() {
            this.ball.update(this.canvas);
            this.playerB.update(this.canvas, this.ball);
            this.playerA.update(this.canvas);

            if (this.ball.isOutOfLeftBounds()) {
                this.resetTurn(this.playerB, this.playerA);
            } else if (this.ball.isOutOfRightBounds(this.canvas)) {
                this.resetTurn(this.playerA, this.playerB);
            }

            if (this.isTurnDelayOver() && this.playerTurn) {
                const direction = this.getServeDirection();
                this.ball.handleServe(this.playerTurn, direction);
                this.playerTurn = null;
            }

            if (this.hasCollision(this.ball, this.playerA)) {
                this.ball.handlePaddleCollision(this.playerA);
            }

            if (this.hasCollision(this.ball, this.playerB)) {
                this.ball.handlePaddleCollision(this.playerB);
            }

            if (this.hasWonRound(this.playerA)) {
                if (!this.hasNextRound()) {
                    this.gameOver = true;
                    const showMenuScreen = this.showMenuScreen.bind(
                        this,
                        "You Win!",
                        this.initialize
                    );
                    setTimeout(showMenuScreen, this.MENU_DELAY_MS);
                } else {
                    this.levelUp();
                }
            } else if (this.hasWonRound(this.playerB)) {
                this.gameOver = true;
                const showMenuScreen = this.showMenuScreen.bind(
                    this,
                    "Game Over!",
                    this.initialize
                );
                setTimeout(showMenuScreen, this.MENU_DELAY_MS);
            }
        }

        drawCourtNet() {
            this.context.beginPath();
            this.context.setLineDash([2, 15]);
            this.context.moveTo(this.canvas.width / 2, this.canvas.height - this.WALL_OFFSET);
            this.context.lineTo(this.canvas.width / 2, this.WALL_OFFSET);
            this.context.lineWidth = 10;
            this.context.strokeStyle = COLOURS.WHITE;
            this.context.stroke();
        }

        drawPlayerScores() {
            const SCORE_X_PADDING = 300;
            const SCORE_Y_PADDING = 200;

            this.context.font = "100px Courier New";
            this.context.textAlign = "center";

            this.context.fillText(
                this.playerA.getScore().toString(),
                this.canvas.width / 2 - SCORE_X_PADDING,
                SCORE_Y_PADDING
            );

            this.context.fillText(
                this.playerB.getScore().toString(),
                this.canvas.width / 2 + SCORE_X_PADDING,
                SCORE_Y_PADDING
            );
        }

        drawRoundCount() {
            const ROUND_Y_PADDING = 45;

            this.context.font = "25px Courier New";

            this.context.fillText(
                `ROUND ${this.round + 1} OF ${ROUNDS.length}`,
                this.canvas.width / 2,
                ROUND_Y_PADDING
            );
        }

        drawRoundScore() {
            const GOAL_Y_PADDING = 100;

            this.context.font = "30px Courier New";

            this.context.fillText(
                `${ROUNDS[this.round]} TO WIN`,
                this.canvas.width / 2,
                GOAL_Y_PADDING
            );
        }

        draw() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.context.fillStyle = this.colour;
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.playerA.draw(this.context);
            this.playerB.draw(this.context);

            if (this.isTurnDelayOver()) {
                this.ball.draw(this.context);
            }

            this.drawCourtNet();
            this.drawPlayerScores();
            this.drawRoundCount();
            this.drawRoundScore();
        }

        loop() {
            if (this.paused) {
                return;
            }

            this.update();
            this.draw();

            if (!this.gameOver) {
                requestAnimationFrame(this.loop.bind(this));
            }
        }

        togglePause() {
            if (this.paused) {
                window.requestAnimationFrame(this.loop.bind(this));
                this.paused = false;
                this.updatePauseIcon(false);
            } else {
                this.showMenuScreen("Paused");
                this.paused = true;
                this.updatePauseIcon(true);
            }
        }

        startGame() {
            if (this.running === false) {
                this.running = true;
                AudioSystem.resume();
                window.requestAnimationFrame(this.loop.bind(this));
            }
        }

        listen() {
            const self = this;
            
            // Keyboard controls
            document.addEventListener("keydown", function(e) {
                const key = e.key;
                
                self.startGame();

                if (key === "w" || key === "ArrowUp") {
                    e.preventDefault();
                    self.playerA.move = DIRECTION.UP;
                }

                if (key === "s" || key === "ArrowDown") {
                    e.preventDefault();
                    self.playerA.move = DIRECTION.DOWN;
                }

                if (key === "Escape") {
                    if (self.running) {
                        self.togglePause();
                    }
                }
            });

            document.addEventListener("keyup", function() {
                self.playerA.move = DIRECTION.IDLE;
            });
            
            // Canvas tap to start
            this.canvas.addEventListener('click', function() {
                self.startGame();
            });
            
            this.canvas.addEventListener('touchstart', function(e) {
                e.preventDefault();
                self.startGame();
            }, { passive: false });
        }

        resetTurn(winner, loser) {
            this.ball.reset();
            this.playerTurn = loser;
            this.timer = performance.now();

            winner.addScore();
            beep2.play();
        }

        isTurnDelayOver() {
            return performance.now() - this.timer >= this.TURN_DELAY_MS;
        }

        getRandomColour() {
            if (this.availableColours.length === 0) {
                this.availableColours = [...ROUND_COLOURS];
            }
            const index = Math.floor(Math.random() * this.availableColours.length);
            const colour = this.availableColours[index];
            this.availableColours.splice(index, 1);
            return colour;
        }
    }

    /*================================================
      Initialize Game
    ================================================*/

    const game = new Game();

    /*================================================
      Mobile Controls
    ================================================*/

    function initMobileControls() {
        const btnUp = document.getElementById('btn-up');
        const btnDown = document.getElementById('btn-down');

        if (!btnUp || !btnDown) {
            return;
        }

        function addActiveClass(btn) {
            btn.classList.add('active');
        }

        function removeActiveClass(btn) {
            btn.classList.remove('active');
        }

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        // Setup touch and mouse events for a button
        function setupButton(btn, direction) {
            // Touch events
            btn.addEventListener('touchstart', function(e) {
                preventDefaults(e);
                addActiveClass(btn);
                game.startGame();
                game.playerA.move = direction;
            }, { passive: false });

            btn.addEventListener('touchend', function(e) {
                preventDefaults(e);
                removeActiveClass(btn);
                game.playerA.move = DIRECTION.IDLE;
            }, { passive: false });

            btn.addEventListener('touchcancel', function(e) {
                removeActiveClass(btn);
                game.playerA.move = DIRECTION.IDLE;
            }, { passive: false });

            // Mouse events (for testing)
            btn.addEventListener('mousedown', function(e) {
                preventDefaults(e);
                addActiveClass(btn);
                game.startGame();
                game.playerA.move = direction;
            });

            btn.addEventListener('mouseup', function(e) {
                preventDefaults(e);
                removeActiveClass(btn);
                game.playerA.move = DIRECTION.IDLE;
            });

            btn.addEventListener('mouseleave', function(e) {
                removeActiveClass(btn);
                game.playerA.move = DIRECTION.IDLE;
            });
        }

        // Setup buttons
        setupButton(btnUp, DIRECTION.UP);
        setupButton(btnDown, DIRECTION.DOWN);

        // Prevent context menu on long press
        var mobileControls = document.querySelector('.mobile-controls');
        if (mobileControls) {
            mobileControls.addEventListener('contextmenu', function(e) {
                e.preventDefault();
            });
        }
    }

    // Initialize mobile controls when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileControls);
    } else {
        initMobileControls();
    }

})();
