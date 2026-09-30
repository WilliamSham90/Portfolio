/*================================================
  Tower Blocks
  three.js r83 + GSAP 3. Blocks slide at a speed measured per second (not
  per frame), every mesh's geometry/material is freed when it leaves the
  scene, and perfect drops build a streak. Best height is saved locally.
================================================*/

(function () {
    'use strict';

    function store(key, value) {
        try {
            if (value === undefined) return localStorage.getItem(key);
            localStorage.setItem(key, value);
        } catch (e) { return null; }
    }

    function disposeMesh(mesh) {
        if (mesh && mesh.geometry) mesh.geometry.dispose();
    }

    /*================================================
      Stage — renderer, camera, lights
    ================================================*/

    class Stage {
        constructor() {
            this.container = document.getElementById('game');

            this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
            // sharp on retina, capped so big 3x screens don't cook the GPU
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
            this.renderer.setClearColor('#D0CBC7', 1);
            this.container.appendChild(this.renderer.domElement);

            this.scene = new THREE.Scene();
            this.camera = new THREE.OrthographicCamera(-20, 20, 20, -20, -100, 1000);
            this.camera.position.set(2, 2, 2);
            this.camera.lookAt(new THREE.Vector3(0, 0, 0));

            this.light = new THREE.DirectionalLight(0xffffff, 0.5);
            this.light.position.set(0, 499, 0);
            this.scene.add(this.light);
            this.scene.add(new THREE.AmbientLight(0xffffff, 0.4));

            window.addEventListener('resize', () => this.onResize());
            this.onResize();
        }

        setCamera(y, speed) {
            gsap.to(this.camera.position, { duration: speed || 0.3, y: y + 4, ease: 'power1.inOut' });
        }

        onResize() {
            const viewSize = 30, w = window.innerWidth, h = window.innerHeight;
            this.renderer.setSize(w, h);
            this.camera.left = w / -viewSize;
            this.camera.right = w / viewSize;
            this.camera.top = h / viewSize;
            this.camera.bottom = h / -viewSize;
            this.camera.updateProjectionMatrix();
        }

        render() { this.renderer.render(this.scene, this.camera); }
        add(elem) { this.scene.add(elem); }
    }

    /*================================================
      Block
    ================================================*/

    const STATES = { ACTIVE: 'active', STOPPED: 'stopped', MISSED: 'missed' };
    const MOVE_AMOUNT = 12;

    function boxMesh(dim, material) {
        const geometry = new THREE.BoxGeometry(dim.width, dim.height, dim.depth);
        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(dim.width / 2, dim.height / 2, dim.depth / 2));
        return new THREE.Mesh(geometry, material);
    }

    class Block {
        constructor(target) {
            this.targetBlock = target;
            this.index = (target ? target.index : 0) + 1;
            this.workingPlane = this.index % 2 ? 'x' : 'z';
            this.workingDimension = this.index % 2 ? 'width' : 'depth';

            this.dimension = {
                width: target ? target.dimension.width : 10,
                height: target ? target.dimension.height : 2,
                depth: target ? target.dimension.depth : 10
            };
            this.position = {
                x: target ? target.position.x : 0,
                y: this.dimension.height * this.index,
                z: target ? target.position.z : 0
            };

            this.colorOffset = target ? target.colorOffset : Math.round(Math.random() * 100);
            if (!target) {
                this.color = 0x333344;
            } else {
                const o = this.index + this.colorOffset;
                this.color = new THREE.Color(
                    (Math.sin(0.3 * o) * 55 + 200) / 255,
                    (Math.sin(0.3 * o + 2) * 55 + 200) / 255,
                    (Math.sin(0.3 * o + 4) * 55 + 200) / 255);
            }

            this.state = this.index > 1 ? STATES.ACTIVE : STATES.STOPPED;

            // speed in world units per 60Hz frame, as tuned originally; tick() scales it by real time
            this.speed = Math.max(-4, -0.1 - this.index * 0.005);
            this.direction = this.speed;

            this.material = new THREE.MeshToonMaterial({ color: this.color, shading: THREE.FlatShading });
            this.mesh = boxMesh(this.dimension, this.material);
            this.mesh.position.set(this.position.x, this.position.y, this.position.z);

            if (this.state === STATES.ACTIVE) {
                this.position[this.workingPlane] = Math.random() > 0.5 ? -MOVE_AMOUNT : MOVE_AMOUNT;
            }
        }

        reverseDirection() {
            this.direction = this.direction > 0 ? this.speed : Math.abs(this.speed);
        }

        place() {
            this.state = STATES.STOPPED;
            const plane = this.workingPlane, dimKey = this.workingDimension, target = this.targetBlock;
            let overlap = target.dimension[dimKey] - Math.abs(this.position[plane] - target.position[plane]);
            const result = { plane, direction: this.direction };

            if (this.dimension[dimKey] - overlap < 0.3) {
                // close enough: snap it and keep the full size
                overlap = this.dimension[dimKey];
                result.bonus = true;
                this.position.x = target.position.x;
                this.position.z = target.position.z;
                this.dimension.width = target.dimension.width;
                this.dimension.depth = target.dimension.depth;
            }

            if (overlap > 0) {
                const chopped = { width: this.dimension.width, height: this.dimension.height, depth: this.dimension.depth };
                chopped[dimKey] -= overlap;
                this.dimension[dimKey] = overlap;

                const placedMesh = boxMesh(this.dimension, this.material);
                const choppedPos = { x: this.position.x, y: this.position.y, z: this.position.z };
                if (this.position[plane] < target.position[plane]) this.position[plane] = target.position[plane];
                else choppedPos[plane] += overlap;

                placedMesh.position.set(this.position.x, this.position.y, this.position.z);
                result.placed = placedMesh;
                if (!result.bonus) {
                    const choppedMesh = boxMesh(chopped, this.material);
                    choppedMesh.position.set(choppedPos.x, choppedPos.y, choppedPos.z);
                    result.chopped = choppedMesh;
                }
            } else {
                this.state = STATES.MISSED;
            }
            this.dimension[dimKey] = overlap;
            return result;
        }

        tick(dt) {
            if (this.state !== STATES.ACTIVE) return;
            const value = this.position[this.workingPlane];
            if (value > MOVE_AMOUNT || value < -MOVE_AMOUNT) this.reverseDirection();
            this.position[this.workingPlane] += this.direction * dt * 60;
            this.mesh.position[this.workingPlane] = this.position[this.workingPlane];
        }
    }

    /*================================================
      Game
    ================================================*/

    const GAME = { LOADING: 'loading', PLAYING: 'playing', READY: 'ready', ENDED: 'ended', RESETTING: 'resetting' };

    class Game {
        constructor() {
            this.blocks = [];
            this.state = GAME.LOADING;
            this.streak = 0;
            this.best = Number(store('tower-best')) || 0;
            this.stage = new Stage();

            this.mainContainer = document.getElementById('container');
            this.scoreContainer = document.getElementById('score');
            this.instructions = document.getElementById('instructions');
            this.perfect = document.getElementById('perfect');

            this.newBlocks = new THREE.Group();
            this.placedBlocks = new THREE.Group();
            this.choppedBlocks = new THREE.Group();
            this.stage.add(this.newBlocks);
            this.stage.add(this.placedBlocks);
            this.stage.add(this.choppedBlocks);

            this.addBlock();
            this.lastTime = performance.now();
            this.tick();
            this.updateState(GAME.READY);
            this.showBest();
            this.bindEvents();
        }

        bindEvents() {
            // one pointerdown covers mouse, touch and pen with no double-firing;
            // the Back link is left to do its own job
            this.mainContainer.addEventListener('pointerdown', e => {
                if (e.button !== 0 || e.target.closest('.back-btn')) return;
                e.preventDefault();
                this.onAction();
            });
            document.getElementById('start-button').addEventListener('click', e => e.preventDefault());
            document.addEventListener('keydown', e => {
                if ((e.code === 'Space' || e.code === 'Enter') && !e.repeat) {
                    if (e.target.closest && e.target.closest('.back-btn')) return;
                    e.preventDefault();
                    this.onAction();
                }
            });
        }

        updateState(newState) {
            Object.values(GAME).forEach(s => this.mainContainer.classList.remove(s));
            this.mainContainer.classList.add(newState);
            this.state = newState;
        }

        onAction() {
            if (this.state === GAME.READY) this.startGame();
            else if (this.state === GAME.PLAYING) this.placeBlock();
            else if (this.state === GAME.ENDED) this.restartGame();
        }

        startGame() {
            if (this.state === GAME.PLAYING) return;
            this.scoreContainer.textContent = '0';
            this.streak = 0;
            this.instructions.classList.remove('hide');
            this.updateState(GAME.PLAYING);
            this.addBlock();
        }

        restartGame() {
            this.updateState(GAME.RESETTING);
            const oldBlocks = this.placedBlocks.children.slice();
            const removeSpeed = 0.2, delayAmount = 0.02;

            oldBlocks.forEach((block, i) => {
                const delay = (oldBlocks.length - i) * delayAmount;
                gsap.to(block.scale, {
                    duration: removeSpeed, x: 0, y: 0, z: 0, delay, ease: 'power1.in',
                    onComplete: () => {
                        this.placedBlocks.remove(block);
                        disposeMesh(block);
                        block.material.dispose();
                    }
                });
                gsap.to(block.rotation, { duration: removeSpeed, y: 0.5, delay, ease: 'power1.in' });
            });

            const cameraMoveSpeed = removeSpeed * 2 + oldBlocks.length * delayAmount;
            this.stage.setCamera(2, cameraMoveSpeed);

            const countdown = { value: this.blocks.length - 1 };
            gsap.to(countdown, {
                duration: cameraMoveSpeed, value: 0,
                onUpdate: () => { this.scoreContainer.textContent = String(Math.round(countdown.value)); }
            });

            // placed blocks free their material above; the missed one never got placed
            this.blocks[this.blocks.length - 1].material.dispose();
            this.blocks = this.blocks.slice(0, 1);
            setTimeout(() => this.startGame(), cameraMoveSpeed * 1000);
        }

        placeBlock() {
            const current = this.blocks[this.blocks.length - 1];
            const result = current.place();
            this.newBlocks.remove(current.mesh);
            disposeMesh(current.mesh);

            if (result.placed) this.placedBlocks.add(result.placed);

            if (result.bonus) this.showPerfect();
            else if (current.state !== STATES.MISSED) this.streak = 0;

            if (result.chopped) {
                const chopped = result.chopped;
                this.choppedBlocks.add(chopped);
                const pos = {
                    duration: 1, y: '-=30', ease: 'power1.in',
                    onComplete: () => {
                        this.choppedBlocks.remove(chopped);
                        disposeMesh(chopped);
                    }
                };
                const spin = 10;
                const rot = {
                    duration: 1, delay: 0.05,
                    x: result.plane === 'z' ? Math.random() * spin - spin / 2 : 0.1,
                    z: result.plane === 'x' ? Math.random() * spin - spin / 2 : 0.1,
                    y: Math.random() * 0.1
                };
                const push = 40 * Math.abs(result.direction);
                pos[result.plane] = chopped.position[result.plane] > result.placed.position[result.plane] ? '+=' + push : '-=' + push;
                gsap.to(chopped.position, pos);
                gsap.to(chopped.rotation, rot);
            }

            this.addBlock();
        }

        showPerfect() {
            this.streak++;
            this.perfect.textContent = this.streak > 1 ? 'Perfect ×' + this.streak : 'Perfect!';
            this.perfect.classList.remove('pop');
            void this.perfect.offsetWidth; // restart the animation
            this.perfect.classList.add('pop');
        }

        addBlock() {
            const last = this.blocks[this.blocks.length - 1];
            if (last && last.state === STATES.MISSED) return this.endGame();

            this.scoreContainer.textContent = String(this.blocks.length - 1);
            const block = new Block(last);
            this.newBlocks.add(block.mesh);
            this.blocks.push(block);
            this.stage.setCamera(this.blocks.length * 2);
            if (this.blocks.length >= 5) this.instructions.classList.add('hide');
        }

        endGame() {
            const score = this.blocks.length - 2; // base block and the missed one don't count
            const isBest = score > this.best;
            if (isBest) {
                this.best = score;
                store('tower-best', score);
            }
            document.getElementById('final-text').textContent =
                'Height ' + score + (isBest && score > 0 ? ' · New best!' : ' · Best ' + this.best);
            this.showBest();
            this.updateState(GAME.ENDED);
        }

        showBest() {
            document.getElementById('best-text').textContent = this.best ? 'Best: ' + this.best : '';
        }

        tick() {
            const now = performance.now();
            const dt = Math.min(0.05, (now - this.lastTime) / 1000); // cap after a hitch
            this.lastTime = now;
            this.blocks[this.blocks.length - 1].tick(dt);
            this.stage.render();
            requestAnimationFrame(() => this.tick());
        }
    }

    new Game();
})();
