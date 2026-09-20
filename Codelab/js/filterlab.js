/* ============================================
   CSS Filter Showcase — Script
   ============================================ */

(() => {
    'use strict';

    // ── Filter Definitions ──────────────────────
    // Each entry: { name, css, description }
    const FILTERS = [
        // ── Original ────────────────────────────
        { name: 'Original',          css: 'none',                                              desc: 'No filter applied' },

        // ── blur() ──────────────────────────────
        { name: 'Blur (Light)',       css: 'blur(2px)',                                         desc: 'Subtle gaussian blur' },
        { name: 'Blur (Medium)',      css: 'blur(4px)',                                         desc: 'Medium gaussian blur' },
        { name: 'Blur (Heavy)',       css: 'blur(8px)',                                         desc: 'Strong gaussian blur' },

        // ── brightness() ────────────────────────
        { name: 'Brightness 40%',     css: 'brightness(0.4)',                                   desc: 'Darken to 40%' },
        { name: 'Brightness 75%',     css: 'brightness(0.75)',                                  desc: 'Slightly darker' },
        { name: 'Brightness 130%',    css: 'brightness(1.3)',                                   desc: 'Slightly brighter' },
        { name: 'Brightness 200%',    css: 'brightness(2)',                                     desc: 'Double brightness' },

        // ── contrast() ──────────────────────────
        { name: 'Contrast 25%',       css: 'contrast(25%)',                                     desc: 'Very low contrast' },
        { name: 'Contrast 50%',       css: 'contrast(50%)',                                     desc: 'Low contrast' },
        { name: 'Contrast 150%',      css: 'contrast(150%)',                                    desc: 'High contrast' },
        { name: 'Contrast 200%',      css: 'contrast(200%)',                                    desc: 'Extreme contrast' },

        // ── grayscale() ─────────────────────────
        { name: 'Grayscale 30%',      css: 'grayscale(30%)',                                    desc: 'Lightly desaturated' },
        { name: 'Grayscale 50%',      css: 'grayscale(50%)',                                    desc: 'Half grayscale' },
        { name: 'Grayscale 100%',     css: 'grayscale(100%)',                                   desc: 'Full grayscale' },

        // ── hue-rotate() ────────────────────────
        { name: 'Hue Rotate 45°',     css: 'hue-rotate(45deg)',                                 desc: 'Slight hue shift' },
        { name: 'Hue Rotate 90°',     css: 'hue-rotate(90deg)',                                 desc: 'Quarter rotation' },
        { name: 'Hue Rotate 180°',    css: 'hue-rotate(180deg)',                                desc: 'Half rotation' },
        { name: 'Hue Rotate 270°',    css: 'hue-rotate(270deg)',                                desc: 'Three-quarter rotation' },

        // ── invert() ────────────────────────────
        { name: 'Invert 25%',         css: 'invert(25%)',                                       desc: 'Slight inversion' },
        { name: 'Invert 50%',         css: 'invert(50%)',                                       desc: 'Half inverted' },
        { name: 'Invert 75%',         css: 'invert(75%)',                                       desc: 'Mostly inverted' },
        { name: 'Invert 100%',        css: 'invert(100%)',                                      desc: 'Fully inverted' },

        // ── opacity() ──────────────────────────
        { name: 'Opacity 25%',        css: 'opacity(25%)',                                      desc: 'Mostly transparent' },
        { name: 'Opacity 50%',        css: 'opacity(50%)',                                      desc: 'Half transparent' },
        { name: 'Opacity 75%',        css: 'opacity(75%)',                                      desc: 'Slightly transparent' },

        // ── saturate() ──────────────────────────
        { name: 'Saturate 0%',        css: 'saturate(0%)',                                      desc: 'Zero saturation' },
        { name: 'Saturate 50%',       css: 'saturate(50%)',                                     desc: 'Half saturation' },
        { name: 'Saturate 200%',      css: 'saturate(200%)',                                    desc: 'Double saturation' },
        { name: 'Saturate 400%',      css: 'saturate(400%)',                                    desc: 'Hyper saturated' },

        // ── sepia() ─────────────────────────────
        { name: 'Sepia 30%',          css: 'sepia(30%)',                                        desc: 'Light sepia tint' },
        { name: 'Sepia 60%',          css: 'sepia(60%)',                                        desc: 'Medium sepia' },
        { name: 'Sepia 100%',         css: 'sepia(100%)',                                       desc: 'Full sepia tone' },

        // ── drop-shadow() ───────────────────────
        { name: 'Drop Shadow',        css: 'drop-shadow(4px 4px 6px rgba(0,0,0,0.6))',          desc: 'Standard shadow' },
        { name: 'Shadow (Large)',      css: 'drop-shadow(8px 8px 16px rgba(0,0,0,0.8))',         desc: 'Deep diffused shadow' },
        { name: 'Shadow (Color)',      css: 'drop-shadow(0 4px 12px rgba(124,106,255,0.5))',     desc: 'Colored glow shadow' },

        // ── Combo Presets ───────────────────────
        { name: 'Warm Vintage',        css: 'sepia(60%) saturate(140%) brightness(0.9)',          desc: 'Sepia + saturate + dim' },
        { name: 'Cool Fade',           css: 'grayscale(30%) brightness(1.1) hue-rotate(200deg)', desc: 'Gray + bright + cool hue' },
        { name: 'High Impact',         css: 'contrast(150%) saturate(150%) brightness(1.1)',      desc: 'Contrast + vivid + bright' },
        { name: 'Noir',                css: 'grayscale(100%) contrast(140%) brightness(0.85)',    desc: 'B&W high contrast' },
        { name: 'Dreamy Glow',         css: 'blur(1px) brightness(1.2) saturate(130%)',           desc: 'Soft blur + luminous' },
        { name: 'Aged Photo',          css: 'sepia(80%) contrast(90%) brightness(0.85)',          desc: 'Old photograph look' },
        { name: 'Neon Pop',            css: 'saturate(300%) contrast(130%) hue-rotate(30deg)',    desc: 'Vivid neon colours' },
        { name: 'X-Ray',               css: 'invert(100%) hue-rotate(180deg) brightness(1.2)',    desc: 'Inverted x-ray effect' },
    ];

    // ── Image Source ────────────────────────────
    // Using a high-quality landscape from picsum
    const IMAGE_SRC = 'https://picsum.photos/seed/filterlab/600/450';

    // ── DOM References ─────────────────────────
    const grid = document.getElementById('filterGrid');
    const toast = document.getElementById('toast');

    let toastTimer = null;

    // ── Build Cards ────────────────────────────
    function renderCards() {
        const fragment = document.createDocumentFragment();

        FILTERS.forEach((filter, index) => {
            const card = document.createElement('article');
            card.className = 'filter-card';
            card.tabIndex = 0;
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `Copy CSS filter: ${filter.css}`);
            card.style.animationDelay = `${index * 45}ms`;

            const filterValue = filter.css === 'none' ? 'none' : filter.css;
            const copyText = filter.css === 'none'
                ? 'filter: none;'
                : `filter: ${filter.css};`;

            card.dataset.copyText = copyText;

            card.innerHTML = `
                <div class="card-image-wrap">
                    <img
                        src="${IMAGE_SRC}"
                        alt="Photo with ${filter.name} filter"
                        loading="lazy"
                        decoding="async"
                        style="filter: ${filterValue};"
                    />
                    <div class="card-overlay">
                        <span class="copy-hint">
                            <svg viewBox="0 0 16 16" fill="none">
                                <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
                                <path d="M3 10V3.5A1.5 1.5 0 0 1 4.5 2H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                            Click to copy
                        </span>
                    </div>
                </div>
                <div class="card-info">
                    <div class="card-filter-name">${filter.name}</div>
                    <code class="card-filter-code">${copyText}</code>
                </div>
            `;

            fragment.appendChild(card);
        });

        grid.appendChild(fragment);
    }

    // ── Copy to Clipboard ──────────────────────
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
            document.body.appendChild(textarea);
            textarea.select();
            let success = false;
            try {
                success = document.execCommand('copy');
            } catch {
                success = false;
            }
            document.body.removeChild(textarea);
            return success;
        }
    }

    // ── Show Toast ─────────────────────────────
    function showToast() {
        if (toastTimer) {
            clearTimeout(toastTimer);
            toast.classList.remove('visible');
            // Force reflow for re-animation
            void toast.offsetWidth;
        }

        toast.classList.add('visible');
        toastTimer = setTimeout(() => {
            toast.classList.remove('visible');
            toastTimer = null;
        }, 1800);
    }

    // ── Card Click / Activate ──────────────────
    function handleCardActivate(card) {
        const text = card.dataset.copyText;
        if (!text) return;

        copyToClipboard(text).then((success) => {
            if (success) {
                // Visual feedback on card
                card.classList.add('copied');
                const hint = card.querySelector('.copy-hint');
                if (hint) {
                    hint.innerHTML = `
                        <svg viewBox="0 0 16 16" fill="none">
                            <path d="M13.5 4.5L6.5 11.5L2.5 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Copied!
                    `;
                }

                showToast();

                // Reset after brief pause
                setTimeout(() => {
                    card.classList.remove('copied');
                    if (hint) {
                        hint.innerHTML = `
                            <svg viewBox="0 0 16 16" fill="none">
                                <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
                                <path d="M3 10V3.5A1.5 1.5 0 0 1 4.5 2H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                            Click to copy
                        `;
                    }
                }, 1500);
            }
        });
    }

    // ── Event Delegation ───────────────────────
    grid.addEventListener('click', (e) => {
        const card = e.target.closest('.filter-card');
        if (card) handleCardActivate(card);
    });

    grid.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const card = e.target.closest('.filter-card');
            if (card) {
                e.preventDefault();
                handleCardActivate(card);
            }
        }
    });

    // ── Initialize ─────────────────────────────
    renderCards();
})();
