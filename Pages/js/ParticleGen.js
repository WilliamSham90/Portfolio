/* ============================================
   ParticleGen — Script
   Powered by tsParticles v3
   ============================================ */

(function () {
    'use strict';

    /* ── Theme Presets ───────────────────────── */
    var THEMES = [
        {
            name: 'Classic',
            bg: '#0a0a0f',
            preview: 'linear-gradient(135deg,#0a0a0f,#1a1a2e)',
            particles: {
                color: { value: '#ffffff' },
                links: { enable: true, color: '#ffffff', opacity: 0.25, distance: 140, width: 1 },
                shape: { type: 'circle' },
                opacity: { value: 0.5 },
                size: { value: { min: 1, max: 4 } },
                number: { value: 80, density: { enable: true, width: 800, height: 800 } },
                move: { enable: true, speed: 3, outModes: { default: 'out' } }
            }
        },
        {
            name: 'Crimson',
            bg: '#0f0205',
            preview: 'linear-gradient(135deg,#0f0205,#3d0a0a)',
            particles: {
                color: { value: ['#ff2d55', '#ff6b6b', '#ff9a9e'] },
                links: { enable: true, color: '#ff2d55', opacity: 0.15, distance: 130, width: 1 },
                shape: { type: 'circle' },
                opacity: { value: { min: 0.3, max: 0.7 } },
                size: { value: { min: 1, max: 5 } },
                number: { value: 80, density: { enable: true, width: 800, height: 800 } },
                move: { enable: true, speed: 2.5, outModes: { default: 'out' } }
            }
        },
        {
            name: 'Ocean',
            bg: '#020c1b',
            preview: 'linear-gradient(135deg,#020c1b,#0a3d62)',
            particles: {
                color: { value: ['#00d2ff', '#3a7bd5', '#64ffda'] },
                links: { enable: true, color: '#3a7bd5', opacity: 0.2, distance: 150, width: 1 },
                shape: { type: 'circle' },
                opacity: { value: { min: 0.2, max: 0.6 } },
                size: { value: { min: 1, max: 5 } },
                number: { value: 80, density: { enable: true, width: 800, height: 800 } },
                move: { enable: true, speed: 2, outModes: { default: 'out' } }
            }
        },
        {
            name: 'Aurora',
            bg: '#050510',
            preview: 'linear-gradient(135deg,#050510,#1a0530)',
            particles: {
                color: { value: ['#7c6aff', '#00ffa3', '#ff6bcb', '#00d4ff'] },
                links: { enable: false },
                shape: { type: 'circle' },
                opacity: { value: { min: 0.15, max: 0.6 }, animation: { enable: true, speed: 0.8, startValue: 'random', minimumValue: 0.1 } },
                size: { value: { min: 2, max: 7 }, animation: { enable: true, speed: 3, startValue: 'random', minimumValue: 1 } },
                number: { value: 100, density: { enable: true, width: 800, height: 800 } },
                move: { enable: true, speed: 1.5, direction: 'top', outModes: { default: 'out' }, random: true }
            }
        },
        {
            name: 'Firefly',
            bg: '#050a05',
            preview: 'linear-gradient(135deg,#050a05,#0a2010)',
            particles: {
                color: { value: ['#ffff00', '#ccff00', '#88cc00'] },
                links: { enable: false },
                shape: { type: 'circle' },
                opacity: { value: { min: 0.1, max: 0.8 }, animation: { enable: true, speed: 1.5, startValue: 'random', minimumValue: 0.05 } },
                size: { value: { min: 1, max: 4 }, animation: { enable: true, speed: 2, startValue: 'random', minimumValue: 0.5 } },
                number: { value: 60, density: { enable: true, width: 1000, height: 1000 } },
                move: { enable: true, speed: 1, outModes: { default: 'out' }, random: true }
            }
        },
        {
            name: 'Galaxy',
            bg: '#05000a',
            preview: 'linear-gradient(135deg,#05000a,#1a0030)',
            particles: {
                color: { value: ['#ffffff', '#c8a2ff', '#ffd700', '#ff69b4'] },
                links: { enable: false },
                shape: { type: 'circle' },
                opacity: { value: { min: 0.1, max: 0.9 }, animation: { enable: true, speed: 0.5, startValue: 'random', minimumValue: 0.05 } },
                size: { value: { min: 0.5, max: 3 } },
                number: { value: 200, density: { enable: true, width: 800, height: 800 } },
                move: { enable: true, speed: 0.6, outModes: { default: 'out' }, random: true }
            }
        },
        {
            name: 'Neon',
            bg: '#080010',
            preview: 'linear-gradient(135deg,#080010,#1a0040)',
            particles: {
                color: { value: ['#ff00ff', '#00ffff', '#ff0080'] },
                links: { enable: true, color: '#ff00ff', opacity: 0.3, distance: 160, width: 1.5 },
                shape: { type: 'circle' },
                opacity: { value: { min: 0.4, max: 0.9 } },
                size: { value: { min: 1, max: 4 } },
                number: { value: 70, density: { enable: true, width: 800, height: 800 } },
                move: { enable: true, speed: 3.5, outModes: { default: 'out' } }
            }
        },
        {
            name: 'Snow',
            bg: '#0c1524',
            preview: 'linear-gradient(135deg,#0c1524,#1a2a44)',
            particles: {
                color: { value: '#ffffff' },
                links: { enable: false },
                shape: { type: 'circle' },
                opacity: { value: { min: 0.3, max: 0.8 } },
                size: { value: { min: 1, max: 6 } },
                number: { value: 120, density: { enable: true, width: 800, height: 800 } },
                move: { enable: true, speed: 1.5, direction: 'bottom', outModes: { default: 'out' }, straight: false, random: false }
            }
        },
        {
            name: 'Fire',
            bg: '#0a0200',
            preview: 'linear-gradient(135deg,#0a0200,#2a0800)',
            particles: {
                color: { value: ['#ff4500', '#ff6600', '#ff8c00', '#ffd700'] },
                links: { enable: false },
                shape: { type: 'circle' },
                opacity: { value: { min: 0.2, max: 0.9 }, animation: { enable: true, speed: 2, startValue: 'random', minimumValue: 0.05 } },
                size: { value: { min: 1, max: 6 }, animation: { enable: true, speed: 4, startValue: 'max', minimumValue: 0.5, destroy: 'min' } },
                number: { value: 100, density: { enable: true, width: 600, height: 600 } },
                move: { enable: true, speed: { min: 3, max: 8 }, direction: 'top', outModes: { default: 'out' }, random: true }
            }
        },
        {
            name: 'Matrix',
            bg: '#000800',
            preview: 'linear-gradient(135deg,#000800,#002200)',
            particles: {
                color: { value: '#00ff00' },
                links: { enable: false },
                shape: { type: 'char', options: { char: { value: ['0', '1', '|', ':', '.'], font: 'JetBrains Mono, monospace', weight: '400' } } },
                opacity: { value: { min: 0.1, max: 0.8 }, animation: { enable: true, speed: 1, startValue: 'random', minimumValue: 0 } },
                size: { value: { min: 6, max: 14 } },
                number: { value: 120, density: { enable: true, width: 800, height: 800 } },
                move: { enable: true, speed: { min: 2, max: 6 }, direction: 'bottom', outModes: { default: 'out' }, straight: true }
            }
        },
        {
            name: 'Bubbles',
            bg: '#030818',
            preview: 'linear-gradient(135deg,#030818,#0d1b3e)',
            particles: {
                color: { value: ['#4ecdc4', '#45b7d1', '#96f2d7', '#a8e6cf'] },
                links: { enable: false },
                shape: { type: 'circle' },
                opacity: { value: { min: 0.05, max: 0.35 } },
                size: { value: { min: 5, max: 25 }, animation: { enable: true, speed: 2, startValue: 'random', minimumValue: 3 } },
                number: { value: 50, density: { enable: true, width: 800, height: 800 } },
                move: { enable: true, speed: 1.2, direction: 'top', outModes: { default: 'out' }, random: true },
                stroke: { width: 1, color: '#4ecdc4' }
            }
        },
        {
            name: 'Polygon',
            bg: '#0a0a14',
            preview: 'linear-gradient(135deg,#0a0a14,#161628)',
            particles: {
                color: { value: ['#7c6aff', '#ff6b9d', '#ffd93d', '#6bcb77'] },
                links: { enable: true, color: '#7c6aff', opacity: 0.12, distance: 180, width: 1 },
                shape: { type: ['triangle', 'polygon'], options: { polygon: { sides: 6 } } },
                opacity: { value: { min: 0.3, max: 0.7 } },
                size: { value: { min: 2, max: 6 } },
                number: { value: 60, density: { enable: true, width: 800, height: 800 } },
                move: { enable: true, speed: 1.5, outModes: { default: 'bounce' } },
                rotate: { value: { min: 0, max: 360 }, animation: { enable: true, speed: 5 } }
            }
        }
    ];

    /* ── State ───────────────────────────────── */
    var activeTheme = 0;
    var hoverMode = 'repulse';
    var clickMode = 'push';
    var particleContainer = null;
    var engineReady = false;

    /* ── Wait for DOM ─────────────────────────── */
    document.addEventListener('DOMContentLoaded', function () {

        /* ── DOM ──────────────────────────────────── */
        var themeGrid   = document.getElementById('themeGrid');
        var sidePanel   = document.getElementById('sidePanel');
        var panelToggle = document.getElementById('panelToggle');
        var resetBtn    = document.getElementById('resetBtn');
        var downloadBtn = document.getElementById('downloadBtn');
        var copyBtn     = document.getElementById('copyBtn');
        var toast       = document.getElementById('toast');
        var toastText   = document.getElementById('toastText');

        var rangeCount  = document.getElementById('rangeCount');
        var rangeSpeed  = document.getElementById('rangeSpeed');
        var rangeSize   = document.getElementById('rangeSize');
        var countVal    = document.getElementById('countVal');
        var speedVal    = document.getElementById('speedVal');
        var sizeVal     = document.getElementById('sizeVal');

        /* ── Build Full Options Object ───────────── */
        function buildOptions(themeIdx) {
            var theme = THEMES[themeIdx];
            var p = JSON.parse(JSON.stringify(theme.particles));

            // Override with slider values
            p.number = p.number || {};
            p.number.value = parseInt(rangeCount.value, 10);

            p.move = p.move || {};
            p.move.enable = true;
            p.move.speed = parseFloat(rangeSpeed.value);

            var sz = parseFloat(rangeSize.value);
            p.size = p.size || {};
            p.size.value = { min: Math.max(0.5, sz * 0.25), max: sz };

            return {
                fullScreen: { enable: true, zIndex: 0 },
                background: { color: { value: theme.bg } },
                fpsLimit: 120,
                detectRetina: true,
                particles: p,
                interactivity: {
                    detectsOn: 'window',
                    events: {
                        onHover: { enable: true, mode: hoverMode },
                        onClick: { enable: true, mode: clickMode },
                        resize: { enable: true }
                    },
                    modes: {
                        repulse: { distance: 150, duration: 0.4 },
                        grab: { distance: 250, links: { opacity: 0.6 } },
                        bubble: { distance: 200, size: 14, duration: 0.3, opacity: 0.8 },
                        attract: { distance: 200, duration: 0.4 },
                        push: { quantity: 4 },
                        remove: { quantity: 2 }
                    }
                }
            };
        }

        /* ── Load / Reload Particles ─────────────── */
        async function ensureEngine() {
            if (!engineReady) {
                if (typeof loadFull === 'function') {
                    await loadFull(tsParticles);
                }
                engineReady = true;
            }
        }

        function loadTheme(idx) {
            activeTheme = idx;
            var opts = buildOptions(idx);

            ensureEngine().then(function () {
                return tsParticles.load({ id: 'tsparticles', options: opts });
            }).then(function (container) {
                particleContainer = container;
            }).catch(function (err) {
                console.error('tsParticles error:', err);
            });
        }

        function reload() {
            loadTheme(activeTheme);
        }

        /* ── Render Theme Buttons ────────────────── */
        function renderThemes() {
            THEMES.forEach(function (theme, i) {
                var btn = document.createElement('button');
                btn.className = 'theme-btn' + (i === 0 ? ' active' : '');
                btn.setAttribute('data-idx', i);
                btn.style.background = theme.preview;
                btn.setAttribute('aria-label', 'Theme: ' + theme.name);
                btn.innerHTML = '<span class="theme-label">' + theme.name + '</span>';
                themeGrid.appendChild(btn);
            });
        }

        /* ── Theme Click ─────────────────────────── */
        themeGrid.addEventListener('click', function (e) {
            var btn = e.target.closest('.theme-btn');
            if (!btn) return;
            var idx = parseInt(btn.getAttribute('data-idx'), 10);

            themeGrid.querySelectorAll('.theme-btn').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            loadTheme(idx);
        });

        /* ── Panel Toggle ────────────────────────── */
        panelToggle.addEventListener('click', function () {
            sidePanel.classList.toggle('open');
        });

        /* ── Sliders ─────────────────────────────── */
        function bindSlider(slider, display) {
            slider.addEventListener('input', function () { display.textContent = slider.value; });
            slider.addEventListener('change', reload);
        }

        bindSlider(rangeCount, countVal);
        bindSlider(rangeSpeed, speedVal);
        bindSlider(rangeSize, sizeVal);

        /* ── Hover Mode Pills ────────────────────── */
        document.getElementById('hoverRow').addEventListener('click', function (e) {
            var pill = e.target.closest('.pill');
            if (!pill) return;
            hoverMode = pill.getAttribute('data-mode');
            this.querySelectorAll('.pill').forEach(function (p) { p.classList.remove('active'); });
            pill.classList.add('active');
            reload();
        });

        /* ── Click Mode Pills ────────────────────── */
        document.getElementById('clickRow').addEventListener('click', function (e) {
            var pill = e.target.closest('.pill');
            if (!pill) return;
            clickMode = pill.getAttribute('data-click');
            this.querySelectorAll('.pill').forEach(function (p) { p.classList.remove('active'); });
            pill.classList.add('active');
            reload();
        });

        /* ── Reset ────────────────────────────────── */
        resetBtn.addEventListener('click', function () {
            rangeCount.value = 80;  countVal.textContent = '80';
            rangeSpeed.value = 3;   speedVal.textContent = '3';
            rangeSize.value  = 4;   sizeVal.textContent  = '4';

            hoverMode = 'repulse';
            clickMode = 'push';

            document.querySelectorAll('#hoverRow .pill').forEach(function (p) {
                p.classList.toggle('active', p.getAttribute('data-mode') === 'repulse');
            });
            document.querySelectorAll('#clickRow .pill').forEach(function (p) {
                p.classList.toggle('active', p.getAttribute('data-click') === 'push');
            });

            themeGrid.querySelectorAll('.theme-btn').forEach(function (b, i) {
                b.classList.toggle('active', i === 0);
            });

            loadTheme(0);
        });

        /* ── Export Helpers ───────────────────────── */
        function getCurrentConfig() {
            return JSON.stringify(buildOptions(activeTheme), null, 2);
        }

        /* ── Toast ────────────────────────────────── */
        var toastTimer = null;
        function showToast(msg) {
            toastText.textContent = msg;
            if (toastTimer) { clearTimeout(toastTimer); toast.classList.remove('show'); }
            void toast.offsetWidth;
            toast.classList.add('show');
            toastTimer = setTimeout(function () { toast.classList.remove('show'); toastTimer = null; }, 2000);
        }

        /* ── Copy Config ─────────────────────────── */
        copyBtn.addEventListener('click', function () {
            var json = getCurrentConfig();
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(json).then(function () {
                    showToast('Config copied!');
                }).catch(function () {
                    fallbackCopy(json);
                });
            } else {
                fallbackCopy(json);
            }
        });

        function fallbackCopy(text) {
            var ta = document.createElement('textarea');
            ta.value = text;
            ta.style.cssText = 'position:fixed;opacity:0';
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand('copy'); showToast('Config copied!'); }
            catch (e) { showToast('Copy failed'); }
            document.body.removeChild(ta);
        }

        /* ── Download Config ─────────────────────── */
        downloadBtn.addEventListener('click', function () {
            var json = getCurrentConfig();
            var blob = new Blob([json], { type: 'application/json' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'particles-config.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast('Config downloaded!');
        });

        /* ── Keyboard ─────────────────────────────── */
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') sidePanel.classList.toggle('open');
        });

        /* ── Init ─────────────────────────────────── */
        renderThemes();
        loadTheme(0);

    }); // end DOMContentLoaded

})();
