/* ============================================
   Particle Generator — Script
   Powered by tsParticles v3.9.1
   ============================================ */

(() => {
    'use strict';

    // ── Theme Definitions ───────────────────────
    const THEMES = [
        {
            name: 'Classic',
            bg: '#0a0a0f',
            preview: 'linear-gradient(135deg, #0a0a0f, #1a1a2e)',
            config: {
                particles: {
                    color: { value: '#ffffff' },
                    links: { enable: true, color: '#ffffff', opacity: 0.25, distance: 140, width: 1 },
                    shape: { type: 'circle' },
                    opacity: { value: { min: 0.2, max: 0.6 } },
                    size: { value: { min: 1, max: 4 } },
                    move: { enable: true, speed: 3, direction: 'none', outModes: 'out' },
                    number: { value: 80, density: { enable: true, area: 800 } },
                },
            },
        },
        {
            name: 'Crimson',
            bg: '#0f0205',
            preview: 'linear-gradient(135deg, #0f0205, #3d0a0a)',
            config: {
                particles: {
                    color: { value: ['#ff2d55', '#ff6b6b', '#ff9a9e'] },
                    links: { enable: true, color: '#ff2d55', opacity: 0.15, distance: 130, width: 1 },
                    shape: { type: 'circle' },
                    opacity: { value: { min: 0.3, max: 0.7 } },
                    size: { value: { min: 1, max: 5 } },
                    move: { enable: true, speed: 2.5, direction: 'none', outModes: 'out' },
                    number: { value: 80, density: { enable: true, area: 800 } },
                },
            },
        },
        {
            name: 'Ocean',
            bg: '#020c1b',
            preview: 'linear-gradient(135deg, #020c1b, #0a3d62)',
            config: {
                particles: {
                    color: { value: ['#00d2ff', '#3a7bd5', '#64ffda'] },
                    links: { enable: true, color: '#3a7bd5', opacity: 0.2, distance: 150, width: 1 },
                    shape: { type: 'circle' },
                    opacity: { value: { min: 0.2, max: 0.6 } },
                    size: { value: { min: 1, max: 5 } },
                    move: { enable: true, speed: 2, direction: 'none', outModes: 'out',
                        attract: { enable: true, rotateX: 600, rotateY: 1200 }
                    },
                    number: { value: 80, density: { enable: true, area: 800 } },
                },
            },
        },
        {
            name: 'Aurora',
            bg: '#050510',
            preview: 'linear-gradient(135deg, #050510, #1a0530, #051030)',
            config: {
                particles: {
                    color: { value: ['#7c6aff', '#00ffa3', '#ff6bcb', '#00d4ff'] },
                    links: { enable: false },
                    shape: { type: 'circle' },
                    opacity: { value: { min: 0.15, max: 0.6 }, animation: { enable: true, speed: 0.8, minimumValue: 0.1, sync: false } },
                    size: { value: { min: 2, max: 7 }, animation: { enable: true, speed: 3, minimumValue: 1, sync: false } },
                    move: { enable: true, speed: 1.5, direction: 'top', outModes: 'out', random: true, straight: false },
                    number: { value: 100, density: { enable: true, area: 800 } },
                },
            },
        },
        {
            name: 'Firefly',
            bg: '#050a05',
            preview: 'linear-gradient(135deg, #050a05, #0a2010)',
            config: {
                particles: {
                    color: { value: ['#ffff00', '#ccff00', '#88cc00'] },
                    links: { enable: false },
                    shape: { type: 'circle' },
                    opacity: { value: { min: 0.1, max: 0.8 }, animation: { enable: true, speed: 1.5, minimumValue: 0.05, sync: false } },
                    size: { value: { min: 1, max: 4 }, animation: { enable: true, speed: 2, minimumValue: 0.5, sync: false } },
                    move: { enable: true, speed: 1, direction: 'none', outModes: 'out', random: true,
                        wobble: { enable: true, distance: 10, speed: 3 }
                    },
                    number: { value: 60, density: { enable: true, area: 1000 } },
                },
            },
        },
        {
            name: 'Galaxy',
            bg: '#05000a',
            preview: 'linear-gradient(135deg, #05000a, #1a0030)',
            config: {
                particles: {
                    color: { value: ['#ffffff', '#c8a2ff', '#ffd700', '#ff69b4'] },
                    links: { enable: false },
                    shape: { type: ['circle', 'star'] },
                    opacity: { value: { min: 0.1, max: 0.9 }, animation: { enable: true, speed: 0.5, minimumValue: 0.05, sync: false } },
                    size: { value: { min: 0.5, max: 4 } },
                    move: { enable: true, speed: 0.6, direction: 'none', outModes: 'out', random: true },
                    number: { value: 200, density: { enable: true, area: 800 } },
                    twinkle: { particles: { enable: true, frequency: 0.03, opacity: 1 } },
                },
            },
        },
        {
            name: 'Neon',
            bg: '#080010',
            preview: 'linear-gradient(135deg, #080010, #1a0040)',
            config: {
                particles: {
                    color: { value: ['#ff00ff', '#00ffff', '#ff0080'] },
                    links: { enable: true, color: { value: ['#ff00ff', '#00ffff'] }, opacity: 0.3, distance: 160, width: 1.5 },
                    shape: { type: 'circle' },
                    opacity: { value: { min: 0.4, max: 0.9 } },
                    size: { value: { min: 1, max: 4 } },
                    move: { enable: true, speed: 3.5, direction: 'none', outModes: 'out' },
                    number: { value: 70, density: { enable: true, area: 800 } },
                    shadow: { enable: true, blur: 10, color: '#ff00ff' },
                },
            },
        },
        {
            name: 'Snow',
            bg: '#0c1524',
            preview: 'linear-gradient(135deg, #0c1524, #1a2a44)',
            config: {
                particles: {
                    color: { value: '#ffffff' },
                    links: { enable: false },
                    shape: { type: 'circle' },
                    opacity: { value: { min: 0.3, max: 0.8 } },
                    size: { value: { min: 1, max: 6 }, animation: { enable: false } },
                    move: { enable: true, speed: 1.5, direction: 'bottom', outModes: 'out', random: false, straight: false,
                        gravity: { enable: true, acceleration: 0.3 },
                        wobble: { enable: true, distance: 20, speed: 5 }
                    },
                    number: { value: 120, density: { enable: true, area: 800 } },
                },
            },
        },
        {
            name: 'Fire',
            bg: '#0a0200',
            preview: 'linear-gradient(135deg, #0a0200, #2a0800)',
            config: {
                particles: {
                    color: { value: ['#ff4500', '#ff6600', '#ff8c00', '#ffd700'] },
                    links: { enable: false },
                    shape: { type: 'circle' },
                    opacity: { value: { min: 0.2, max: 0.9 }, animation: { enable: true, speed: 2, minimumValue: 0.05, sync: false } },
                    size: { value: { min: 1, max: 6 }, animation: { enable: true, speed: 4, minimumValue: 0.5, sync: false, startValue: 'max', destroy: 'min' } },
                    move: { enable: true, speed: { min: 3, max: 8 }, direction: 'top', outModes: { top: 'destroy', default: 'out' }, random: true, straight: false },
                    number: { value: 100, density: { enable: true, area: 600 } },
                    life: { duration: { value: 3 }, count: 0 },
                },
                emitters: {
                    position: { x: 50, y: 100 },
                    rate: { quantity: 5, delay: 0.15 },
                    size: { width: 100, height: 0 },
                },
            },
        },
        {
            name: 'Matrix',
            bg: '#000800',
            preview: 'linear-gradient(135deg, #000800, #002200)',
            config: {
                particles: {
                    color: { value: '#00ff00' },
                    links: { enable: false },
                    shape: { type: 'char', options: { char: { value: ['0', '1', ':', '.', '|'], font: 'JetBrains Mono, monospace', weight: '400' } } },
                    opacity: { value: { min: 0.1, max: 0.8 }, animation: { enable: true, speed: 1, minimumValue: 0, sync: false } },
                    size: { value: { min: 6, max: 14 } },
                    move: { enable: true, speed: { min: 2, max: 6 }, direction: 'bottom', outModes: 'out', straight: true },
                    number: { value: 120, density: { enable: true, area: 800 } },
                },
            },
        },
        {
            name: 'Bubbles',
            bg: '#030818',
            preview: 'linear-gradient(135deg, #030818, #0d1b3e)',
            config: {
                particles: {
                    color: { value: ['#4ecdc4', '#45b7d1', '#96f2d7', '#a8e6cf'] },
                    links: { enable: false },
                    shape: { type: 'circle' },
                    opacity: { value: { min: 0.05, max: 0.35 } },
                    size: { value: { min: 5, max: 25 }, animation: { enable: true, speed: 2, minimumValue: 3, sync: false } },
                    move: { enable: true, speed: 1.2, direction: 'top', outModes: 'out', random: true },
                    number: { value: 50, density: { enable: true, area: 800 } },
                    stroke: { width: 1, color: { value: '#4ecdc4', animation: { enable: true, speed: 3, sync: false } } },
                },
            },
        },
        {
            name: 'Polygon',
            bg: '#0a0a14',
            preview: 'linear-gradient(135deg, #0a0a14, #161628)',
            config: {
                particles: {
                    color: { value: ['#7c6aff', '#ff6b9d', '#ffd93d', '#6bcb77'] },
                    links: { enable: true, color: '#7c6aff', opacity: 0.12, distance: 180, width: 1 },
                    shape: { type: ['triangle', 'polygon'], options: { polygon: { sides: 6 } } },
                    opacity: { value: { min: 0.3, max: 0.7 } },
                    size: { value: { min: 2, max: 6 } },
                    rotate: { value: { min: 0, max: 360 }, animation: { enable: true, speed: 5, sync: false } },
                    move: { enable: true, speed: 1.5, direction: 'none', outModes: 'bounce' },
                    number: { value: 60, density: { enable: true, area: 800 } },
                },
            },
        },
    ];

    // ── State ───────────────────────────────────
    let currentThemeIndex = 0;
    let currentInteraction = 'repulse';
    let container = null;

    // ── DOM References ──────────────────────────
    const themeGrid = document.getElementById('themeGrid');
    const panelBody = document.getElementById('panelBody');
    const panelToggle = document.getElementById('panelToggle');
    const resetBtn = document.getElementById('resetBtn');

    const countSlider = document.getElementById('particleCount');
    const speedSlider = document.getElementById('particleSpeed');
    const sizeSlider = document.getElementById('particleSize');
    const countValue = document.getElementById('particleCountValue');
    const speedValue = document.getElementById('particleSpeedValue');
    const sizeValue = document.getElementById('particleSizeValue');

    // ── Build Theme Buttons ─────────────────────
    function renderThemeButtons() {
        THEMES.forEach((theme, index) => {
            const btn = document.createElement('button');
            btn.className = `theme-btn${index === 0 ? ' active' : ''}`;
            btn.dataset.index = index;
            btn.style.background = theme.preview;
            btn.setAttribute('aria-label', `Theme: ${theme.name}`);
            btn.innerHTML = `<span class="theme-btn-label">${theme.name}</span>`;
            themeGrid.appendChild(btn);
        });
    }

    // ── Build Full Config ───────────────────────
    function buildConfig(themeIndex) {
        const theme = THEMES[themeIndex];
        const base = JSON.parse(JSON.stringify(theme.config));

        // Merge slider overrides
        if (base.particles) {
            base.particles.number = base.particles.number || {};
            base.particles.number.value = parseInt(countSlider.value, 10);
            base.particles.number.density = { enable: true, area: 800 };

            base.particles.move = base.particles.move || {};
            base.particles.move.enable = true;
            base.particles.move.speed = parseFloat(speedSlider.value);

            base.particles.size = base.particles.size || {};
            const sizeVal = parseFloat(sizeSlider.value);
            base.particles.size.value = { min: Math.max(0.5, sizeVal * 0.25), max: sizeVal };
        }

        // Interaction
        const interactionConfig = {
            detectsOn: 'window',
            events: {
                onHover: { enable: true, mode: currentInteraction },
                onClick: { enable: true, mode: 'push' },
                resize: { enable: true },
            },
            modes: {
                repulse: { distance: 150, duration: 0.4 },
                grab: { distance: 200, links: { opacity: 0.6 } },
                bubble: { distance: 200, size: 12, duration: 0.3, opacity: 0.8 },
                attract: { distance: 200, duration: 0.4 },
                push: { quantity: 4 },
            },
        };

        base.interactivity = interactionConfig;

        // Global settings
        base.background = { color: { value: theme.bg } };
        base.fpsLimit = 120;
        base.detectRetina = true;
        base.smooth = true;

        return base;
    }

    // ── Load Particles ──────────────────────────
    async function loadParticles(themeIndex) {
        currentThemeIndex = themeIndex;
        const config = buildConfig(themeIndex);

        // Destroy existing
        if (container) {
            container.destroy();
            container = null;
        }

        try {
            container = await tsParticles.load({
                id: 'tsparticles',
                options: config,
            });
        } catch (err) {
            console.error('tsParticles load error:', err);
        }
    }

    // ── Refresh (keeps current theme, applies slider/interaction changes) ──
    function refreshParticles() {
        loadParticles(currentThemeIndex);
    }

    // ── Panel Toggle ────────────────────────────
    let panelOpen = false;

    panelToggle.addEventListener('click', () => {
        panelOpen = !panelOpen;
        panelBody.classList.toggle('open', panelOpen);
    });

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
        if (panelOpen && !e.target.closest('.theme-panel')) {
            panelOpen = false;
            panelBody.classList.remove('open');
        }
    });

    // ── Theme Selection ─────────────────────────
    themeGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('.theme-btn');
        if (!btn) return;

        const index = parseInt(btn.dataset.index, 10);

        themeGrid.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        loadParticles(index);
    });

    // ── Slider Controls ─────────────────────────
    function handleSlider(slider, display, refreshFn) {
        slider.addEventListener('input', () => {
            display.textContent = slider.value;
        });
        slider.addEventListener('change', refreshFn);
    }

    handleSlider(countSlider, countValue, refreshParticles);
    handleSlider(speedSlider, speedValue, refreshParticles);
    handleSlider(sizeSlider, sizeValue, refreshParticles);

    // ── Interaction Toggles ─────────────────────
    document.querySelectorAll('.toggle-btn[data-interact]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.toggle-btn[data-interact]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentInteraction = btn.dataset.interact;
            refreshParticles();
        });
    });

    // ── Reset Button ────────────────────────────
    resetBtn.addEventListener('click', () => {
        countSlider.value = 80;
        countValue.textContent = '80';
        speedSlider.value = 3;
        speedValue.textContent = '3';
        sizeSlider.value = 4;
        sizeValue.textContent = '4';

        currentInteraction = 'repulse';
        document.querySelectorAll('.toggle-btn[data-interact]').forEach(b => {
            b.classList.toggle('active', b.dataset.interact === 'repulse');
        });

        // Reset to Classic theme
        themeGrid.querySelectorAll('.theme-btn').forEach((b, i) => {
            b.classList.toggle('active', i === 0);
        });

        loadParticles(0);
    });

    // ── Keyboard: Escape to close panel ─────────
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panelOpen) {
            panelOpen = false;
            panelBody.classList.remove('open');
        }
    });

    // ── Initialize ──────────────────────────────
    renderThemeButtons();
    loadParticles(0);
})();
