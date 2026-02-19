/* ============================================
   ParticleGen — Script
   Powered by tsParticles v3
   ============================================ */

(function () {
    'use strict';

    /* ── Theme Presets ───────────────────────── */
    /* All original themes kept exactly as-is, Fire added using official tsParticles preset colors */
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
            bg: '#000000',
            preview: 'linear-gradient(135deg,#1a0000,#4a0000)',
            bgImage: 'radial-gradient(ellipse at 50% 100%, #4a0000 0%, #000 70%)',
            particles: {
                color: { value: ['#fdcf58', '#757676', '#f27d0c', '#800909', '#f07f13'] },
                links: { enable: false },
                shape: { type: 'circle' },
                opacity: { value: { min: 0.1, max: 0.5 }, animation: { enable: true, speed: 3, startValue: 'random', minimumValue: 0 } },
                size: { value: { min: 1, max: 4 }, animation: { enable: true, speed: 5, startValue: 'random', minimumValue: 0.3, destroy: 'min' } },
                number: { value: 150, density: { enable: true, width: 800, height: 800 } },
                move: { enable: true, speed: { min: 3, max: 9 }, direction: 'top', outModes: { default: 'out', bottom: 'none' }, random: true, straight: false },
                life: { duration: { sync: false, value: { min: 1, max: 3 } }, count: 1 }
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
    var moveDir = 'none';
    var outMode = 'out';
    var shapeOverride = null;   // null = use theme default
    var imageUrl = '';
    var imageSize = 32;
    var customBg = null;        // null = use theme default
    var particleContainer = null;
    var engineReady = false;

    /* ── Wait for DOM ─────────────────────────── */
    document.addEventListener('DOMContentLoaded', function () {

        /* ── DOM refs ─────────────────────────────── */
        var byId = function (id) { return document.getElementById(id); };

        var themeGrid    = byId('themeGrid');
        var sidePanel    = byId('sidePanel');
        var panelToggle  = byId('panelToggle');
        var resetBtn     = byId('resetBtn');
        var downloadBtn  = byId('downloadBtn');
        var copyBtn      = byId('copyBtn');
        var toast        = byId('toast');
        var toastText    = byId('toastText');

        // Particle sliders
        var rangeCount    = byId('rangeCount');
        var rangeSize     = byId('rangeSize');
        var rangeOpacity  = byId('rangeOpacity');
        var rangeDensity  = byId('rangeDensity');
        var rangeSpeed    = byId('rangeSpeed');
        var rangeLinkDist = byId('rangeLinkDist');
        var rangeLinkOp   = byId('rangeLinkOp');
        var rangeLinkW    = byId('rangeLinkW');
        var rangeImgSize  = byId('rangeImgSize');
        var rangePolySides = byId('rangePolySides');
        var rangeStrokeW  = byId('rangeStrokeW');
        var rangeRepDist  = byId('rangeRepDist');
        var rangeGrabDist = byId('rangeGrabDist');
        var rangeBubSize  = byId('rangeBubSize');
        var rangePushCount = byId('rangePushCount');

        // Value displays
        var countVal    = byId('countVal');
        var sizeVal     = byId('sizeVal');
        var opacityVal  = byId('opacityVal');
        var densityVal  = byId('densityVal');
        var speedVal    = byId('speedVal');
        var linkDistVal = byId('linkDistVal');
        var linkOpVal   = byId('linkOpVal');
        var linkWVal    = byId('linkWVal');
        var imgSizeVal  = byId('imgSizeVal');
        var polySidesVal = byId('polySidesVal');
        var strokeWVal  = byId('strokeWVal');
        var repDistVal  = byId('repDistVal');
        var grabDistVal = byId('grabDistVal');
        var bubSizeVal  = byId('bubSizeVal');
        var pushCountVal = byId('pushCountVal');

        // Toggles & inputs
        var chkLinks      = byId('chkLinks');
        var chkDensity    = byId('chkDensity');
        var chkRandom     = byId('chkRandom');
        var chkStraight   = byId('chkStraight');
        var bgColorInput  = byId('bgColorInput');
        var imageUrlInput = byId('imageUrlInput');
        var applyImageBtn = byId('applyImageBtn');
        var imageSection  = byId('imageSection');
        var polygonSection = byId('polygonSection');

        /* ── Accordion toggle ─────────────────────── */
        document.querySelectorAll('.acc-header').forEach(function (hdr) {
            hdr.addEventListener('click', function () {
                var acc = this.closest('.accordion');
                var opening = !acc.classList.contains('open');
                acc.classList.toggle('open', opening);
                this.setAttribute('aria-expanded', String(opening));
            });
        });

        /* ── Build tsParticles Options ────────────── */
        function buildOptions(themeIdx) {
            var theme = THEMES[themeIdx];
            // Deep clone theme particles
            var p = JSON.parse(JSON.stringify(theme.particles));

            // ── Number / Density ──
            p.number = p.number || {};
            p.number.value = parseInt(rangeCount.value, 10);
            p.number.density = p.number.density || {};
            p.number.density.enable = chkDensity.checked;
            p.number.density.width = parseInt(rangeDensity.value, 10);
            p.number.density.height = parseInt(rangeDensity.value, 10);

            // ── Size ──
            var sz = parseFloat(rangeSize.value);
            p.size = p.size || {};
            p.size.value = { min: Math.max(0.5, sz * 0.25), max: sz };

            // ── Opacity (only override if theme doesn't animate) ──
            var op = parseFloat(rangeOpacity.value);
            if (!p.opacity || !p.opacity.animation || !p.opacity.animation.enable) {
                p.opacity = p.opacity || {};
                p.opacity.value = op;
            }

            // ── Movement ──
            p.move = p.move || {};
            p.move.enable = true;
            p.move.speed = parseFloat(rangeSpeed.value);
            p.move.direction = moveDir;
            p.move.outModes = { default: outMode };
            p.move.random = chkRandom.checked;
            p.move.straight = chkStraight.checked;

            // ── Links ──
            p.links = p.links || {};
            p.links.enable = chkLinks.checked;
            if (chkLinks.checked) {
                p.links.distance = parseInt(rangeLinkDist.value, 10);
                p.links.opacity = parseFloat(rangeLinkOp.value);
                p.links.width = parseFloat(rangeLinkW.value);
            }

            // ── Stroke ──
            var sw = parseFloat(rangeStrokeW.value);
            if (sw > 0) {
                p.stroke = { width: sw, color: p.color ? (Array.isArray(p.color.value) ? p.color.value[0] : p.color.value) : '#ffffff' };
            }

            // ── Shape override ──
            if (shapeOverride) {
                if (shapeOverride === 'image' && imageUrl) {
                    p.shape = {
                        type: 'image',
                        options: { image: { src: imageUrl, width: imageSize, height: imageSize } }
                    };
                } else if (shapeOverride === 'polygon') {
                    p.shape = { type: 'polygon', options: { polygon: { sides: parseInt(rangePolySides.value, 10) } } };
                } else if (shapeOverride !== 'image') {
                    p.shape = { type: shapeOverride };
                }
            }

            // ── Background ──
            var bgOpts = {};
            if (customBg) {
                bgOpts = { color: { value: customBg } };
            } else if (theme.bgImage) {
                bgOpts = { image: theme.bgImage };
            } else {
                bgOpts = { color: { value: theme.bg } };
            }

            return {
                fullScreen: { enable: true, zIndex: 0 },
                background: bgOpts,
                fpsLimit: 120,
                detectRetina: true,
                smooth: true,
                particles: p,
                interactivity: {
                    detectsOn: 'window',
                    events: {
                        onHover: { enable: true, mode: hoverMode },
                        onClick: { enable: true, mode: clickMode },
                        resize: { enable: true }
                    },
                    modes: {
                        repulse: { distance: parseInt(rangeRepDist.value, 10), duration: 0.4 },
                        grab: { distance: parseInt(rangeGrabDist.value, 10), links: { opacity: 1 } },
                        bubble: { distance: 400, size: parseInt(rangeBubSize.value, 10), duration: 2, opacity: 0.8, speed: 3 },
                        attract: { distance: 200, duration: 0.4 },
                        push: { quantity: parseInt(rangePushCount.value, 10) },
                        remove: { quantity: 2 }
                    }
                }
            };
        }

        /* ── Engine Init ──────────────────────────── */
        async function ensureEngine() {
            if (!engineReady) {
                try {
                    if (typeof loadFull === 'function') {
                        await loadFull(tsParticles);
                    }
                } catch (err) {
                    console.warn('[ParticleGen] loadFull unavailable, using bundle defaults:', err.message);
                }
                engineReady = true;
            }
        }

        /* ── Load / Reload ────────────────────────── */
        var loadDebounce = null;

        function loadTheme(idx) {
            activeTheme = idx;
            var opts;
            try {
                opts = buildOptions(idx);
            } catch (err) {
                console.error('[ParticleGen] Config build error:', err);
                showToast('Config error — check console');
                return;
            }

            ensureEngine().then(function () {
                return tsParticles.load({ id: 'tsparticles', options: opts });
            }).then(function (container) {
                particleContainer = container;
            }).catch(function (err) {
                console.error('[ParticleGen] Load error:', err);
                showToast('Error loading particles');
            });
        }

        function reload() {
            // Debounce rapid changes (sliders)
            clearTimeout(loadDebounce);
            loadDebounce = setTimeout(function () {
                loadTheme(activeTheme);
            }, 80);
        }

        /* ── Render Theme Grid ────────────────────── */
        function renderThemes() {
            THEMES.forEach(function (theme, i) {
                var btn = document.createElement('button');
                btn.className = 'theme-btn' + (i === 0 ? ' active' : '');
                btn.setAttribute('data-idx', String(i));
                btn.style.background = theme.preview;
                btn.setAttribute('aria-label', 'Theme: ' + theme.name);
                btn.innerHTML = '<span class="theme-label">' + theme.name + '</span>';
                themeGrid.appendChild(btn);
            });
        }

        /* ── Theme Click ──────────────────────────── */
        themeGrid.addEventListener('click', function (e) {
            var btn = e.target.closest('.theme-btn');
            if (!btn) return;
            var idx = parseInt(btn.getAttribute('data-idx'), 10);
            if (isNaN(idx) || idx < 0 || idx >= THEMES.length) return;

            themeGrid.querySelectorAll('.theme-btn').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            // Reset user overrides to let theme take control
            shapeOverride = null;
            imageSection.classList.add('hidden');
            polygonSection.classList.add('hidden');
            setPillActive('shapeRow', 'data-shape', 'circle');

            customBg = null;
            bgColorInput.value = THEMES[idx].bg;

            // Sync links toggle to theme
            var hasLinks = THEMES[idx].particles.links && THEMES[idx].particles.links.enable !== false;
            chkLinks.checked = hasLinks;

            loadTheme(idx);
        });

        /* ── Panel Toggle ─────────────────────────── */
        panelToggle.addEventListener('click', function () {
            sidePanel.classList.toggle('open');
        });

        /* ── Slider Binding Helper ────────────────── */
        function bindSlider(slider, display, onChangeFn) {
            if (!slider || !display) return;
            slider.addEventListener('input', function () { display.textContent = slider.value; });
            slider.addEventListener('change', onChangeFn || reload);
        }

        bindSlider(rangeCount, countVal);
        bindSlider(rangeSize, sizeVal);
        bindSlider(rangeOpacity, opacityVal);
        bindSlider(rangeDensity, densityVal);
        bindSlider(rangeSpeed, speedVal);
        bindSlider(rangeLinkDist, linkDistVal);
        bindSlider(rangeLinkOp, linkOpVal);
        bindSlider(rangeLinkW, linkWVal);
        bindSlider(rangePolySides, polySidesVal);
        bindSlider(rangeStrokeW, strokeWVal);
        bindSlider(rangeRepDist, repDistVal);
        bindSlider(rangeGrabDist, grabDistVal);
        bindSlider(rangeBubSize, bubSizeVal);
        bindSlider(rangePushCount, pushCountVal);
        bindSlider(rangeImgSize, imgSizeVal, function () {
            imageSize = parseInt(rangeImgSize.value, 10);
        });

        // Toggle checkboxes
        [chkLinks, chkDensity, chkRandom, chkStraight].forEach(function (chk) {
            if (chk) chk.addEventListener('change', reload);
        });

        /* ── Pill Group Helper ────────────────────── */
        function setPillActive(rowId, attr, val) {
            var row = byId(rowId);
            if (!row) return;
            row.querySelectorAll('.pill').forEach(function (p) {
                p.classList.toggle('active', p.getAttribute(attr) === val);
            });
        }

        function bindPills(rowId, attr, callback) {
            var row = byId(rowId);
            if (!row) return;
            row.addEventListener('click', function (e) {
                var pill = e.target.closest('.pill');
                if (!pill) return;
                row.querySelectorAll('.pill').forEach(function (p) { p.classList.remove('active'); });
                pill.classList.add('active');
                callback(pill.getAttribute(attr));
            });
        }

        bindPills('hoverRow', 'data-mode', function (v) { hoverMode = v; reload(); });
        bindPills('clickRow', 'data-click', function (v) { clickMode = v; reload(); });
        bindPills('directionRow', 'data-dir', function (v) { moveDir = v; reload(); });
        bindPills('outModeRow', 'data-out', function (v) { outMode = v; reload(); });

        /* ── Shape pills ──────────────────────────── */
        bindPills('shapeRow', 'data-shape', function (v) {
            shapeOverride = v;
            imageSection.classList.toggle('hidden', v !== 'image');
            polygonSection.classList.toggle('hidden', v !== 'polygon');
            if (v !== 'image') reload();
        });

        /* ── Apply Image URL ──────────────────────── */
        applyImageBtn.addEventListener('click', function () {
            var url = (imageUrlInput.value || '').trim();
            if (!url) {
                showToast('Enter a valid image URL');
                return;
            }
            // Basic URL validation
            try { new URL(url); } catch (_) {
                showToast('Invalid URL format');
                return;
            }
            imageUrl = url;
            imageSize = parseInt(rangeImgSize.value, 10);
            shapeOverride = 'image';
            reload();
            showToast('Image applied!');
        });

        /* ── Background Color ─────────────────────── */
        bgColorInput.addEventListener('input', function () {
            customBg = bgColorInput.value;
        });
        bgColorInput.addEventListener('change', reload);

        /* ── Reset Everything ─────────────────────── */
        resetBtn.addEventListener('click', function () {
            // Sliders
            rangeCount.value = 80;     countVal.textContent = '80';
            rangeSize.value = 4;       sizeVal.textContent = '4';
            rangeOpacity.value = 0.5;  opacityVal.textContent = '0.5';
            rangeDensity.value = 800;  densityVal.textContent = '800';
            rangeSpeed.value = 3;      speedVal.textContent = '3';
            rangeLinkDist.value = 150; linkDistVal.textContent = '150';
            rangeLinkOp.value = 0.4;   linkOpVal.textContent = '0.4';
            rangeLinkW.value = 1;      linkWVal.textContent = '1';
            rangePolySides.value = 5;  polySidesVal.textContent = '5';
            rangeStrokeW.value = 0;    strokeWVal.textContent = '0';
            rangeRepDist.value = 200;  repDistVal.textContent = '200';
            rangeGrabDist.value = 400; grabDistVal.textContent = '400';
            rangeBubSize.value = 40;   bubSizeVal.textContent = '40';
            rangePushCount.value = 4;  pushCountVal.textContent = '4';

            // Toggles
            chkLinks.checked = true;
            chkDensity.checked = true;
            chkRandom.checked = false;
            chkStraight.checked = false;

            // State
            hoverMode = 'repulse';
            clickMode = 'push';
            moveDir = 'none';
            outMode = 'out';
            shapeOverride = null;
            customBg = null;
            imageUrl = '';
            imageUrlInput.value = '';
            imageSection.classList.add('hidden');
            polygonSection.classList.add('hidden');
            bgColorInput.value = '#0a0a0f';

            // Pills
            setPillActive('hoverRow', 'data-mode', 'repulse');
            setPillActive('clickRow', 'data-click', 'push');
            setPillActive('directionRow', 'data-dir', 'none');
            setPillActive('outModeRow', 'data-out', 'out');
            setPillActive('shapeRow', 'data-shape', 'circle');

            // Theme
            themeGrid.querySelectorAll('.theme-btn').forEach(function (b, i) {
                b.classList.toggle('active', i === 0);
            });

            loadTheme(0);
        });

        /* ── Toast ────────────────────────────────── */
        var toastTimer = null;
        function showToast(msg) {
            toastText.textContent = msg;
            if (toastTimer) { clearTimeout(toastTimer); toast.classList.remove('show'); }
            void toast.offsetWidth; // force reflow for re-trigger
            toast.classList.add('show');
            toastTimer = setTimeout(function () { toast.classList.remove('show'); toastTimer = null; }, 2200);
        }

        /* ── Generate Standalone HTML ─────────────── */
        function generateStandaloneHTML() {
            var opts = buildOptions(activeTheme);
            var configJSON = JSON.stringify(opts, null, 4);
            var bgColor = customBg || THEMES[activeTheme].bg;
            var bgCSS = THEMES[activeTheme].bgImage && !customBg
                ? 'background-image: ' + THEMES[activeTheme].bgImage + ';'
                : 'background: ' + bgColor + ';';

            return [
                '<!DOCTYPE html>',
                '<html lang="en">',
                '<head>',
                '    <meta charset="UTF-8">',
                '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
                '    <title>Particle Scene — ParticleGen</title>',
                '    <style>',
                '        /* ParticleGen Exported Scene */',
                '        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }',
                '        html, body {',
                '            width: 100%; height: 100%; overflow: hidden;',
                '            ' + bgCSS,
                '        }',
                '        #tsparticles {',
                '            position: fixed; top: 0; left: 0;',
                '            width: 100%; height: 100%; z-index: 0;',
                '        }',
                '    </style>',
                '</head>',
                '<body>',
                '',
                '    <div id="tsparticles"></div>',
                '',
                '    <!-- tsParticles Library -->',
                '    <script src="https://cdn.jsdelivr.net/npm/tsparticles/tsparticles.bundle.min.js"><\/script>',
                '    <script>',
                '        /* ParticleGen Config — https://williamsham90.github.io/Portfolio/ */',
                '        (async function () {',
                '            try {',
                '                if (typeof loadFull === "function") await loadFull(tsParticles);',
                '                await tsParticles.load({',
                '                    id: "tsparticles",',
                '                    options: ' + configJSON.split('\n').map(function(line, i) {
                    return i === 0 ? line : '                    ' + line;
                }).join('\n'),
                '                });',
                '            } catch (err) {',
                '                console.error("tsParticles failed to load:", err);',
                '            }',
                '        })();',
                '    <\/script>',
                '',
                '</body>',
                '</html>'
            ].join('\n');
        }

        /* ── Copy Full Code ───────────────────────── */
        copyBtn.addEventListener('click', function () {
            var html;
            try { html = generateStandaloneHTML(); } catch (err) {
                console.error('[ParticleGen] Export error:', err);
                showToast('Export failed');
                return;
            }

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(html).then(function () {
                    showToast('Full HTML + CSS + JS copied!');
                }).catch(function () { fallbackCopy(html); });
            } else {
                fallbackCopy(html);
            }
        });

        function fallbackCopy(text) {
            var ta = document.createElement('textarea');
            ta.value = text;
            ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
            document.body.appendChild(ta);
            ta.select();
            try {
                document.execCommand('copy');
                showToast('Full HTML + CSS + JS copied!');
            } catch (e) {
                showToast('Copy failed — try downloading instead');
            }
            document.body.removeChild(ta);
        }

        /* ── Download Full Project ────────────────── */
        downloadBtn.addEventListener('click', function () {
            var html;
            try { html = generateStandaloneHTML(); } catch (err) {
                console.error('[ParticleGen] Export error:', err);
                showToast('Export failed');
                return;
            }

            var blob = new Blob([html], { type: 'text/html;charset=utf-8' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'particle-scene.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(function () { URL.revokeObjectURL(url); }, 100);
            showToast('particle-scene.html downloaded!');
        });

        /* ── Keyboard ─────────────────────────────── */
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') sidePanel.classList.toggle('open');
        });

        /* ── Init ─────────────────────────────────── */
        // Verify library loaded
        if (typeof tsParticles === 'undefined') {
            console.error('[ParticleGen] tsParticles library failed to load. Check internet connection or CDN.');
            document.body.insertAdjacentHTML('afterbegin',
                '<div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:999;' +
                'background:rgba(200,30,30,0.9);color:#fff;padding:1.5rem 2rem;border-radius:12px;font-family:sans-serif;' +
                'text-align:center;max-width:400px">' +
                '<strong>tsParticles failed to load</strong><br><br>' +
                'Check your internet connection and refresh the page.</div>'
            );
            return;
        }

        renderThemes();
        loadTheme(0);

    }); // end DOMContentLoaded

})();
