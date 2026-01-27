/*================================================
  Tower Blocks - JavaScript
  Converted from TypeScript, Mobile-friendly
================================================*/

(function() {
    'use strict';

    /*================================================
      Stage Class - Handles Three.js Scene
    ================================================*/

    class Stage {
        constructor() {
            // Container
            this.container = document.getElementById('game');
            
            // Renderer
            this.renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: false
            });
            
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setClearColor('#D0CBC7', 1);
            this.container.appendChild(this.renderer.domElement);
            
            // Scene
            this.scene = new THREE.Scene();

            // Camera
            var aspect = window.innerWidth / window.innerHeight;
            var d = 20;
            this.camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, -100, 1000);
            this.camera.position.x = 2;
            this.camera.position.y = 2; 
            this.camera.position.z = 2; 
            this.camera.lookAt(new THREE.Vector3(0, 0, 0));
            
            // Lights
            this.light = new THREE.DirectionalLight(0xffffff, 0.5);
            this.light.position.set(0, 499, 0);
            this.scene.add(this.light);

            this.softLight = new THREE.AmbientLight(0xffffff, 0.4);
            this.scene.add(this.softLight);
            
            // Handle resize
            window.addEventListener('resize', () => this.onResize());
            this.onResize();
        }
        
        setCamera(y, speed) {
            speed = speed || 0.3;
            TweenLite.to(this.camera.position, speed, { y: y + 4, ease: Power1.easeInOut });
            TweenLite.to(this.camera.lookAt, speed, { y: y, ease: Power1.easeInOut });
        }
        
        onResize() {
            var viewSize = 30;
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.camera.left = window.innerWidth / -viewSize;
            this.camera.right = window.innerWidth / viewSize;
            this.camera.top = window.innerHeight / viewSize;
            this.camera.bottom = window.innerHeight / -viewSize;
            this.camera.updateProjectionMatrix();
        }
        
        render() {
            this.renderer.render(this.scene, this.camera);
        }

        add(elem) {
            this.scene.add(elem);
        }

        remove(elem) {
            this.scene.remove(elem);
        }
    }

    /*================================================
      Block Class - Individual Game Blocks
    ================================================*/

    class Block {
        static get STATES() {
            return { ACTIVE: 'active', STOPPED: 'stopped', MISSED: 'missed' };
        }
        
        static get MOVE_AMOUNT() {
            return 12;
        }

        constructor(block) {
            this.dimension = { width: 0, height: 0, depth: 0 };
            this.position = { x: 0, y: 0, z: 0 };
            
            // Set size and position
            this.targetBlock = block;
            
            this.index = (this.targetBlock ? this.targetBlock.index : 0) + 1;
            this.workingPlane = this.index % 2 ? 'x' : 'z';
            this.workingDimension = this.index % 2 ? 'width' : 'depth';
            
            // Set the dimensions from the target block, or defaults
            this.dimension.width = this.targetBlock ? this.targetBlock.dimension.width : 10;
            this.dimension.height = this.targetBlock ? this.targetBlock.dimension.height : 2;
            this.dimension.depth = this.targetBlock ? this.targetBlock.dimension.depth : 10;
            
            this.position.x = this.targetBlock ? this.targetBlock.position.x : 0;
            this.position.y = this.dimension.height * this.index;
            this.position.z = this.targetBlock ? this.targetBlock.position.z : 0;
            
            this.colorOffset = this.targetBlock ? this.targetBlock.colorOffset : Math.round(Math.random() * 100);
            
            // Set color
            if (!this.targetBlock) {
                this.color = 0x333344;
            } else {
                var offset = this.index + this.colorOffset;
                var r = Math.sin(0.3 * offset) * 55 + 200;
                var g = Math.sin(0.3 * offset + 2) * 55 + 200;
                var b = Math.sin(0.3 * offset + 4) * 55 + 200;
                this.color = new THREE.Color(r / 255, g / 255, b / 255);
            }
            
            // State
            this.state = this.index > 1 ? Block.STATES.ACTIVE : Block.STATES.STOPPED;
            
            // Set direction
            this.speed = -0.1 - (this.index * 0.005);
            if (this.speed < -4) this.speed = -4;
            this.direction = this.speed;
            
            // Create block
            var geometry = new THREE.BoxGeometry(this.dimension.width, this.dimension.height, this.dimension.depth);
            geometry.applyMatrix(new THREE.Matrix4().makeTranslation(this.dimension.width / 2, this.dimension.height / 2, this.dimension.depth / 2));
            this.material = new THREE.MeshToonMaterial({ color: this.color, shading: THREE.FlatShading });
            this.mesh = new THREE.Mesh(geometry, this.material);
            this.mesh.position.set(this.position.x, this.position.y + (this.state == Block.STATES.ACTIVE ? 0 : 0), this.position.z);
            
            if (this.state == Block.STATES.ACTIVE) {
                this.position[this.workingPlane] = Math.random() > 0.5 ? -Block.MOVE_AMOUNT : Block.MOVE_AMOUNT;
            }
        }

        reverseDirection() {
            this.direction = this.direction > 0 ? this.speed : Math.abs(this.speed);
        }

        place() {
            this.state = Block.STATES.STOPPED;
            
            var overlap = this.targetBlock.dimension[this.workingDimension] - Math.abs(this.position[this.workingPlane] - this.targetBlock.position[this.workingPlane]);
            
            var blocksToReturn = {
                plane: this.workingPlane,
                direction: this.direction
            };
            
            if (this.dimension[this.workingDimension] - overlap < 0.3) {
                overlap = this.dimension[this.workingDimension];
                blocksToReturn.bonus = true;
                this.position.x = this.targetBlock.position.x;
                this.position.z = this.targetBlock.position.z;
                this.dimension.width = this.targetBlock.dimension.width;
                this.dimension.depth = this.targetBlock.dimension.depth;
            }
            
            if (overlap > 0) {
                var choppedDimensions = { 
                    width: this.dimension.width, 
                    height: this.dimension.height, 
                    depth: this.dimension.depth 
                };
                choppedDimensions[this.workingDimension] -= overlap;
                this.dimension[this.workingDimension] = overlap;
                        
                var placedGeometry = new THREE.BoxGeometry(this.dimension.width, this.dimension.height, this.dimension.depth);
                placedGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(this.dimension.width / 2, this.dimension.height / 2, this.dimension.depth / 2));
                var placedMesh = new THREE.Mesh(placedGeometry, this.material);
                
                var choppedGeometry = new THREE.BoxGeometry(choppedDimensions.width, choppedDimensions.height, choppedDimensions.depth);
                choppedGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(choppedDimensions.width / 2, choppedDimensions.height / 2, choppedDimensions.depth / 2));
                var choppedMesh = new THREE.Mesh(choppedGeometry, this.material);
                
                var choppedPosition = {
                    x: this.position.x,
                    y: this.position.y,
                    z: this.position.z
                };
                
                if (this.position[this.workingPlane] < this.targetBlock.position[this.workingPlane]) {
                    this.position[this.workingPlane] = this.targetBlock.position[this.workingPlane];
                } else {
                    choppedPosition[this.workingPlane] += overlap;
                }
                
                placedMesh.position.set(this.position.x, this.position.y, this.position.z);
                choppedMesh.position.set(choppedPosition.x, choppedPosition.y, choppedPosition.z);
                
                blocksToReturn.placed = placedMesh;
                if (!blocksToReturn.bonus) blocksToReturn.chopped = choppedMesh;
            } else {
                this.state = Block.STATES.MISSED;
            }
            
            this.dimension[this.workingDimension] = overlap;

            return blocksToReturn;
        }
        
        tick() {
            if (this.state == Block.STATES.ACTIVE) {
                var value = this.position[this.workingPlane];
                if (value > Block.MOVE_AMOUNT || value < -Block.MOVE_AMOUNT) this.reverseDirection();
                this.position[this.workingPlane] += this.direction;
                this.mesh.position[this.workingPlane] = this.position[this.workingPlane];
            }
        }
    }

    /*================================================
      Game Class - Main Game Controller
    ================================================*/

    class Game {
        static get STATES() {
            return {
                'LOADING': 'loading',
                'PLAYING': 'playing',
                'READY': 'ready',
                'ENDED': 'ended',
                'RESETTING': 'resetting'
            };
        }

        constructor() {
            this.blocks = [];
            this.state = Game.STATES.LOADING;
            
            this.stage = new Stage();
            
            this.mainContainer = document.getElementById('container');
            this.scoreContainer = document.getElementById('score');
            this.startButton = document.getElementById('start-button');
            this.instructions = document.getElementById('instructions');
            this.scoreContainer.innerHTML = '0';
            
            this.newBlocks = new THREE.Group();
            this.placedBlocks = new THREE.Group();
            this.choppedBlocks = new THREE.Group();
            
            this.stage.add(this.newBlocks);
            this.stage.add(this.placedBlocks);
            this.stage.add(this.choppedBlocks);
            
            this.addBlock();
            this.tick();
            
            this.updateState(Game.STATES.READY);
            
            this.bindEvents();
        }

        bindEvents() {
            var self = this;
            
            // Keyboard controls
            document.addEventListener('keydown', function(e) {
                if (e.keyCode == 32) {
                    e.preventDefault();
                    self.onAction();
                }
            });
            
            // Mouse click
            document.addEventListener('click', function(e) {
                self.onAction();
            });
            
            // Touch support - properly handled to avoid double-firing
            var touchHandled = false;
            
            document.addEventListener('touchstart', function(e) {
                if (touchHandled) return;
                touchHandled = true;
                
                // Prevent the click event from also firing
                e.preventDefault();
                
                self.onAction();
                
                // Reset after a short delay
                setTimeout(function() {
                    touchHandled = false;
                }, 100);
            }, { passive: false });
            
            // Prevent default touch behaviors that might interfere
            document.addEventListener('touchmove', function(e) {
                e.preventDefault();
            }, { passive: false });
        }

        updateState(newState) {
            var self = this;
            for (var key in Game.STATES) {
                this.mainContainer.classList.remove(Game.STATES[key]);
            }
            this.mainContainer.classList.add(newState);
            this.state = newState;
        }

        onAction() {
            switch (this.state) {
                case Game.STATES.READY:
                    this.startGame();
                    break;
                case Game.STATES.PLAYING:
                    this.placeBlock();
                    break;
                case Game.STATES.ENDED:
                    this.restartGame();
                    break;
            }
        }
        
        startGame() {
            if (this.state != Game.STATES.PLAYING) {
                this.scoreContainer.innerHTML = '0';
                this.updateState(Game.STATES.PLAYING);
                this.addBlock();
            }
        }

        restartGame() {
            var self = this;
            this.updateState(Game.STATES.RESETTING);
            
            var oldBlocks = this.placedBlocks.children;
            var removeSpeed = 0.2;
            var delayAmount = 0.02;
            
            for (var i = 0; i < oldBlocks.length; i++) {
                TweenLite.to(oldBlocks[i].scale, removeSpeed, {
                    x: 0, y: 0, z: 0, 
                    delay: (oldBlocks.length - i) * delayAmount, 
                    ease: Power1.easeIn, 
                    onComplete: (function(block) {
                        return function() {
                            self.placedBlocks.remove(block);
                        };
                    })(oldBlocks[i])
                });
                TweenLite.to(oldBlocks[i].rotation, removeSpeed, {
                    y: 0.5, 
                    delay: (oldBlocks.length - i) * delayAmount, 
                    ease: Power1.easeIn
                });
            }
            
            var cameraMoveSpeed = removeSpeed * 2 + (oldBlocks.length * delayAmount);
            this.stage.setCamera(2, cameraMoveSpeed);
            
            var countdown = { value: this.blocks.length - 1 };
            TweenLite.to(countdown, cameraMoveSpeed, {
                value: 0, 
                onUpdate: function() {
                    self.scoreContainer.innerHTML = String(Math.round(countdown.value));
                }
            });
            
            this.blocks = this.blocks.slice(0, 1);
            
            setTimeout(function() {
                self.startGame();
            }, cameraMoveSpeed * 1000);
        }
        
        placeBlock() {
            var self = this;
            var currentBlock = this.blocks[this.blocks.length - 1];
            var newBlocks = currentBlock.place();
            this.newBlocks.remove(currentBlock.mesh);
            
            if (newBlocks.placed) this.placedBlocks.add(newBlocks.placed);
            
            if (newBlocks.chopped) {
                this.choppedBlocks.add(newBlocks.chopped);
                var positionParams = { 
                    y: '-=30', 
                    ease: Power1.easeIn, 
                    onComplete: function() {
                        self.choppedBlocks.remove(newBlocks.chopped);
                    }
                };
                var rotateRandomness = 10;
                var rotationParams = {
                    delay: 0.05,
                    x: newBlocks.plane == 'z' ? ((Math.random() * rotateRandomness) - (rotateRandomness / 2)) : 0.1,
                    z: newBlocks.plane == 'x' ? ((Math.random() * rotateRandomness) - (rotateRandomness / 2)) : 0.1,
                    y: Math.random() * 0.1,
                };
                
                if (newBlocks.chopped.position[newBlocks.plane] > newBlocks.placed.position[newBlocks.plane]) {
                    positionParams[newBlocks.plane] = '+=' + (40 * Math.abs(newBlocks.direction));
                } else {
                    positionParams[newBlocks.plane] = '-=' + (40 * Math.abs(newBlocks.direction));
                }
                TweenLite.to(newBlocks.chopped.position, 1, positionParams);
                TweenLite.to(newBlocks.chopped.rotation, 1, rotationParams);
            }
            
            this.addBlock();
        }
        
        addBlock() {
            var lastBlock = this.blocks[this.blocks.length - 1];
            
            if (lastBlock && lastBlock.state == Block.STATES.MISSED) {
                return this.endGame();
            }
            
            this.scoreContainer.innerHTML = String(this.blocks.length - 1);
            
            var newKidOnTheBlock = new Block(lastBlock);
            this.newBlocks.add(newKidOnTheBlock.mesh);
            this.blocks.push(newKidOnTheBlock);

            this.stage.setCamera(this.blocks.length * 2);
            
            if (this.blocks.length >= 5) {
                this.instructions.classList.add('hide');
            }
        }
        
        endGame() {
            this.updateState(Game.STATES.ENDED);
        }

        tick() {
            var self = this;
            this.blocks[this.blocks.length - 1].tick();
            this.stage.render();
            requestAnimationFrame(function() {
                self.tick();
            });
        }
    }

    /*================================================
      Initialize Game
    ================================================*/

    // Wait for DOM and scripts to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            new Game();
        });
    } else {
        new Game();
    }

})();
