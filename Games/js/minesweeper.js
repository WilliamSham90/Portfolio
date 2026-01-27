/*================================================
  Minesweeper - JavaScript
  Mobile-friendly version with touch support
================================================*/

(function() {
    'use strict';

    // Game configuration
    const CONFIG = {
        rows: 9,
        cols: 9,
        mines: 10
    };

    // Game state
    let gameState = {
        board: [],
        revealed: [],
        flagged: [],
        mines: [],
        gameOver: false,
        gameWon: false,
        gameStarted: false,
        flagMode: false,
        minesRemaining: CONFIG.mines,
        timerInterval: null,
        seconds: 0
    };

    // DOM Elements
    const elements = {
        grid: document.getElementById('grid'),
        mineCount: document.getElementById('mineCount'),
        face: document.getElementById('face'),
        timerDisplay: document.getElementById('timerDisplay'),
        overlay: document.getElementById('overlay'),
        overlayMessage: document.getElementById('overlayMessage'),
        overlayBtn: document.getElementById('overlayBtn'),
        modeMine: document.getElementById('modeMine'),
        modeFlag: document.getElementById('modeFlag'),
        restartBtn: document.getElementById('restartBtn')
    };

    // Faces for different states
    const FACES = {
        normal: '🤔',
        nervous: '😓',
        progress1: '😐',
        progress2: '😏',
        progress3: '🙂',
        progress4: '😊',
        progress5: '😃',
        almostThere: '🤓',
        confused: '😕',
        annoyed: '😒',
        angry: '😠',
        dead: '😣',
        win: '😎'
    };

    /*================================================
      Initialization
    ================================================*/

    function init() {
        createBoard();
        bindEvents();
        updateDisplay();
    }

    function createBoard() {
        // Reset game state
        gameState = {
            board: [],
            revealed: [],
            flagged: [],
            mines: [],
            gameOver: false,
            gameWon: false,
            gameStarted: false,
            flagMode: false,
            minesRemaining: CONFIG.mines,
            timerInterval: null,
            seconds: 0
        };

        // Clear timer
        if (gameState.timerInterval) {
            clearInterval(gameState.timerInterval);
        }

        // Initialize arrays
        for (let i = 0; i < CONFIG.rows * CONFIG.cols; i++) {
            gameState.board[i] = 0;
            gameState.revealed[i] = false;
            gameState.flagged[i] = false;
        }

        // Create grid HTML
        elements.grid.innerHTML = '';
        elements.grid.style.gridTemplateColumns = `repeat(${CONFIG.cols}, 1fr)`;
        elements.grid.style.width = `${CONFIG.cols * 24}px`;

        for (let i = 0; i < CONFIG.rows * CONFIG.cols; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = i;
            
            const content = document.createElement('span');
            content.className = 'cell-content';
            cell.appendChild(content);
            
            elements.grid.appendChild(cell);
        }

        // Reset UI
        elements.overlay.classList.remove('visible', 'victory');
        elements.face.textContent = FACES.normal;
        elements.mineCount.textContent = CONFIG.mines;
        elements.timerDisplay.textContent = '00:00';
        
        // Reset mode buttons
        elements.modeMine.classList.add('active');
        elements.modeFlag.classList.remove('active');
        gameState.flagMode = false;
    }

    function placeMines(excludeIndex) {
        // Place mines randomly, excluding the first clicked cell and its neighbors
        const excludeSet = new Set([excludeIndex, ...getNeighbors(excludeIndex)]);
        
        let placed = 0;
        while (placed < CONFIG.mines) {
            const index = Math.floor(Math.random() * CONFIG.rows * CONFIG.cols);
            if (!gameState.mines.includes(index) && !excludeSet.has(index)) {
                gameState.mines.push(index);
                gameState.board[index] = -1; // -1 represents a mine
                placed++;
            }
        }

        // Calculate neighbor counts
        for (let i = 0; i < CONFIG.rows * CONFIG.cols; i++) {
            if (gameState.board[i] !== -1) {
                const neighbors = getNeighbors(i);
                let count = 0;
                neighbors.forEach(n => {
                    if (gameState.board[n] === -1) count++;
                });
                gameState.board[i] = count;
            }
        }
    }

    function getNeighbors(index) {
        const neighbors = [];
        const row = Math.floor(index / CONFIG.cols);
        const col = index % CONFIG.cols;

        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const newRow = row + dr;
                const newCol = col + dc;
                if (newRow >= 0 && newRow < CONFIG.rows && newCol >= 0 && newCol < CONFIG.cols) {
                    neighbors.push(newRow * CONFIG.cols + newCol);
                }
            }
        }
        return neighbors;
    }

    /*================================================
      Event Handling
    ================================================*/

    function bindEvents() {
        // Grid events
        elements.grid.addEventListener('click', handleCellClick);
        elements.grid.addEventListener('contextmenu', handleRightClick);
        
        // Touch events for long press (flag on mobile)
        let longPressTimer = null;
        let touchStartTime = 0;
        let touchMoved = false;

        elements.grid.addEventListener('touchstart', function(e) {
            const cell = e.target.closest('.cell');
            if (!cell) return;
            
            touchStartTime = Date.now();
            touchMoved = false;
            
            // Long press for flagging (if not in flag mode)
            if (!gameState.flagMode) {
                longPressTimer = setTimeout(function() {
                    if (!touchMoved) {
                        e.preventDefault();
                        const index = parseInt(cell.dataset.index);
                        toggleFlag(index);
                        // Vibrate on flag if supported
                        if (navigator.vibrate) {
                            navigator.vibrate(50);
                        }
                    }
                }, 500);
            }
        }, { passive: false });

        elements.grid.addEventListener('touchmove', function() {
            touchMoved = true;
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
        });

        elements.grid.addEventListener('touchend', function(e) {
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
            
            // Short tap - handle normally via click event
            const touchDuration = Date.now() - touchStartTime;
            if (touchDuration >= 500 && !touchMoved && !gameState.flagMode) {
                e.preventDefault(); // Prevent click from firing after long press flag
            }
        });

        // Mode buttons
        elements.modeMine.addEventListener('click', function() {
            gameState.flagMode = false;
            elements.modeMine.classList.add('active');
            elements.modeFlag.classList.remove('active');
        });

        elements.modeFlag.addEventListener('click', function() {
            gameState.flagMode = true;
            elements.modeFlag.classList.add('active');
            elements.modeMine.classList.remove('active');
        });

        // Restart button
        elements.restartBtn.addEventListener('click', createBoard);
        elements.overlayBtn.addEventListener('click', createBoard);

        // Keyboard shortcut for flag mode
        document.addEventListener('keydown', function(e) {
            if (e.key === 'f' || e.key === 'F') {
                gameState.flagMode = !gameState.flagMode;
                elements.modeMine.classList.toggle('active', !gameState.flagMode);
                elements.modeFlag.classList.toggle('active', gameState.flagMode);
            }
        });

        // Mouse down face change
        elements.grid.addEventListener('mousedown', function(e) {
            if (!gameState.gameOver && e.button === 0 && !gameState.flagMode) {
                elements.face.textContent = FACES.nervous;
            }
        });

        elements.grid.addEventListener('mouseup', function() {
            if (!gameState.gameOver) {
                updateFace();
            }
        });

        elements.grid.addEventListener('mouseleave', function() {
            if (!gameState.gameOver) {
                updateFace();
            }
        });
    }

    function handleCellClick(e) {
        const cell = e.target.closest('.cell');
        if (!cell || gameState.gameOver) return;

        const index = parseInt(cell.dataset.index);

        if (gameState.flagMode) {
            toggleFlag(index);
        } else {
            revealCell(index);
        }
    }

    function handleRightClick(e) {
        e.preventDefault();
        const cell = e.target.closest('.cell');
        if (!cell || gameState.gameOver) return;

        const index = parseInt(cell.dataset.index);
        toggleFlag(index);
    }

    /*================================================
      Game Logic
    ================================================*/

    function revealCell(index) {
        if (gameState.revealed[index] || gameState.flagged[index] || gameState.gameOver) {
            return;
        }

        // First click - place mines and start timer
        if (!gameState.gameStarted) {
            gameState.gameStarted = true;
            placeMines(index);
            startTimer();
        }

        gameState.revealed[index] = true;
        const cell = elements.grid.children[index];
        cell.classList.add('revealed');

        // Hit a mine
        if (gameState.board[index] === -1) {
            cell.classList.add('mine');
            gameOver(false);
            return;
        }

        // Show number or reveal neighbors if empty
        const value = gameState.board[index];
        if (value > 0) {
            cell.dataset.neighbors = value;
            cell.querySelector('.cell-content').textContent = value;
        } else {
            // Flood fill for empty cells
            const neighbors = getNeighbors(index);
            neighbors.forEach(n => revealCell(n));
        }

        // Check for win
        checkWin();
    }

    function toggleFlag(index) {
        if (gameState.revealed[index] || gameState.gameOver) return;

        const cell = elements.grid.children[index];
        
        if (gameState.flagged[index]) {
            gameState.flagged[index] = false;
            cell.classList.remove('flagged');
            gameState.minesRemaining++;
        } else {
            gameState.flagged[index] = true;
            cell.classList.add('flagged');
            gameState.minesRemaining--;
        }

        updateDisplay();
        updateFace();
        checkWin();
    }

    function checkWin() {
        // Win condition: all non-mine cells revealed
        let allRevealed = true;
        for (let i = 0; i < CONFIG.rows * CONFIG.cols; i++) {
            if (gameState.board[i] !== -1 && !gameState.revealed[i]) {
                allRevealed = false;
                break;
            }
        }

        if (allRevealed) {
            gameOver(true);
        }
    }

    function gameOver(won) {
        gameState.gameOver = true;
        gameState.gameWon = won;
        
        // Stop timer
        if (gameState.timerInterval) {
            clearInterval(gameState.timerInterval);
        }

        if (won) {
            // Flag all remaining mines
            gameState.mines.forEach(index => {
                if (!gameState.flagged[index]) {
                    gameState.flagged[index] = true;
                    elements.grid.children[index].classList.add('flagged');
                }
            });
            gameState.minesRemaining = 0;
            updateDisplay();
            
            elements.face.textContent = FACES.win;
            elements.overlay.classList.add('visible', 'victory');
            elements.overlayMessage.innerHTML = '👌👀✔💯💯💯<br>You win!';
        } else {
            // Reveal all mines
            gameState.mines.forEach(index => {
                const cell = elements.grid.children[index];
                cell.classList.add('revealed', 'mine');
            });
            
            // Show wrongly placed flags
            for (let i = 0; i < CONFIG.rows * CONFIG.cols; i++) {
                if (gameState.flagged[i] && !gameState.mines.includes(i)) {
                    elements.grid.children[i].classList.add('wrong-flag');
                }
            }
            
            elements.face.textContent = FACES.dead;
            elements.overlay.classList.add('visible');
            elements.overlayMessage.innerHTML = 'Ooohhh 🙁<br>Game Over';
        }
    }

    /*================================================
      UI Updates
    ================================================*/

    function updateDisplay() {
        elements.mineCount.textContent = Math.max(0, gameState.minesRemaining);
    }

    function updateFace() {
        if (gameState.gameOver) return;
        
        const flaggedCount = gameState.flagged.filter(f => f).length;
        const ratio = flaggedCount / CONFIG.mines;
        
        if (flaggedCount === 0) {
            elements.face.textContent = FACES.normal;
        } else if (ratio < 0.33) {
            elements.face.textContent = FACES.progress1;
        } else if (ratio < 0.5) {
            elements.face.textContent = FACES.progress2;
        } else if (ratio < 0.66) {
            elements.face.textContent = FACES.progress3;
        } else if (ratio < 0.75) {
            elements.face.textContent = FACES.progress4;
        } else if (ratio < 1) {
            elements.face.textContent = FACES.progress5;
        } else if (flaggedCount === CONFIG.mines - 1) {
            elements.face.textContent = FACES.almostThere;
        } else if (flaggedCount === CONFIG.mines) {
            elements.face.textContent = FACES.confused;
        } else if (flaggedCount > CONFIG.mines) {
            elements.face.textContent = FACES.annoyed;
        }
    }

    function startTimer() {
        gameState.seconds = 0;
        gameState.timerInterval = setInterval(function() {
            gameState.seconds++;
            const minutes = Math.floor(gameState.seconds / 60);
            const secs = gameState.seconds % 60;
            elements.timerDisplay.textContent = 
                String(minutes).padStart(2, '0') + ':' + 
                String(secs).padStart(2, '0');
            
            // Cap at 99:59
            if (gameState.seconds >= 5999) {
                clearInterval(gameState.timerInterval);
            }
        }, 1000);
    }

    /*================================================
      Initialize on DOM Ready
    ================================================*/

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
