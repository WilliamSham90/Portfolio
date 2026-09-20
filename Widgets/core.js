// ============================================================================
// core.js — shared state, DOM helpers and reusable UI infrastructure.
//
// Every section module (Widgets/<Section>/<section>.js) imports what it needs
// from here instead of duplicating logic. This file has no knowledge of any
// specific section — only generic concerns: language/theme state, small DOM
// helpers, the "Load More" pagination engine, and the lazy-loading iframe
// observer shared by the game-style cards in Playground.
// ============================================================================

// ----- Shared state -----
export const state = {
    lang: localStorage.getItem('portfolio-lang') || 'en',
    theme: localStorage.getItem('portfolio-theme') || 'dark',
    menuOpen: false
};

// ----- Asset base URLs (single source of truth — update here if a folder on
// GitHub is ever renamed again) -----
export const IMG_BASE = 'https://raw.githubusercontent.com/WilliamSham90/Portfolio/main/Images/';
export const GAMES_BASE = 'https://williamsham90.github.io/Portfolio/Games/';
export const CODELAB_BASE = 'https://williamsham90.github.io/Portfolio/Codelab/'; // formerly "Pages"

// ----- DOM helpers -----
export const $ = (sel, scope = document) => scope.querySelector(sel);
export const $$ = (sel, scope = document) => scope.querySelectorAll(sel);

// Returns the right-language string at creation time. Elements should still
// carry data-text-en/af (and data-placeholder-en/af) attributes so a later
// call to setLanguage() can retranslate them without a page reload.
export const t = (en, af) => (state.lang === 'en' ? en : af);

export function debounce(fn, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}

export function throttle(fn, limit) {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            fn(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ----- Language -----
export function setLanguage(lang) {
    state.lang = lang;
    $$('[data-text-en], [data-text-af]').forEach(el => {
        const text = el.getAttribute(`data-text-${lang}`);
        if (text) el.textContent = text;
    });
    $$('[data-placeholder-en], [data-placeholder-af]').forEach(el => {
        const ph = el.getAttribute(`data-placeholder-${lang}`);
        if (ph) el.placeholder = ph;
    });
    const langText = $('.lang-text');
    if (langText) langText.textContent = lang === 'en' ? 'AF' : 'EN';
    localStorage.setItem('portfolio-lang', lang);
}

// ----- Theme -----
export function setTheme(theme) {
    state.theme = theme;
    document.body.setAttribute('data-theme', theme);
    const icon = $('#themeToggle i');
    if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('portfolio-theme', theme);
}

// ----- Pagination ("Load More") -----
// Desktop loads 9 cards at a time; mobile loads 3. The breakpoint matches the
// single-column grid media query each section's own stylesheet defines.
export const PAGINATION = {
    desktopBatchSize: 9,
    mobileBatchSize: 3,
    mobileQuery: '(max-width: 768px)'
};

export function currentBatchSize() {
    return window.matchMedia(PAGINATION.mobileQuery).matches
        ? PAGINATION.mobileBatchSize
        : PAGINATION.desktopBatchSize;
}

/**
 * Wires up a grid + "Load More" button pair to progressively render items.
 * @param {Object} config
 * @param {string} config.gridId - id of the grid container element
 * @param {string} config.buttonId - id of the load-more button element
 * @param {Array}  config.items - full data array for this grid
 * @param {(item: any) => HTMLElement} config.renderCard - builds one card element
 * @param {(cards: HTMLElement[]) => void} [config.onCardsAdded] - called with newly appended cards
 */
export function createPaginatedGrid({ gridId, buttonId, items, renderCard, onCardsAdded }) {
    const grid = document.getElementById(gridId);
    const button = document.getElementById(buttonId);
    if (!grid) return null;

    let rendered = 0;

    function updateButton() {
        if (!button) return;
        button.classList.toggle('is-hidden', rendered >= items.length);
    }

    function renderNextBatch() {
        const batchSize = currentBatchSize();
        const slice = items.slice(rendered, rendered + batchSize);
        if (slice.length === 0) {
            updateButton();
            return;
        }

        const fragment = document.createDocumentFragment();
        const newCards = [];
        slice.forEach(item => {
            const card = renderCard(item);
            fragment.appendChild(card);
            newCards.push(card);
        });

        grid.appendChild(fragment);
        rendered += slice.length;
        updateButton();

        if (onCardsAdded) onCardsAdded(newCards);
    }

    if (button) {
        button.addEventListener('click', () => {
            button.classList.add('is-loading');
            renderNextBatch();
            button.classList.remove('is-loading');
        });
    }

    renderNextBatch();

    return { renderNextBatch, updateButton };
}

// ----- Shared iframe lazy-load (Games / Demos / Widgets cards in Playground) -----
export const gameIframeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const card = entry.target;
            const iframe = card.querySelector('.game-iframe');
            const loader = card.querySelector('.game-loader');
            const src = iframe?.getAttribute('data-src');

            if (src && !iframe.src) {
                iframe.src = src;
                iframe.addEventListener('load', () => {
                    setTimeout(() => loader?.classList.add('hidden'), 500);
                });
                setTimeout(() => loader?.classList.add('hidden'), 5000);
            }

            gameIframeObserver.unobserve(card);
        }
    });
}, { threshold: 0.1, rootMargin: '100px 0px' });

export function observeGameCards(cards) {
    cards.forEach(card => gameIframeObserver.observe(card));
}

// ----- Shared card builders -----

/**
 * Builds a game-style card (iframe preview) — used by Playground's Games,
 * Demos and Widgets sub-sections.
 */
export function buildGameLikeCard(entry, options) {
    const { basePath, ctaIcon, ctaTextEn, ctaTextAf, loadingTextEn, loadingTextAf } = options;
    const fileUrl = `${basePath}${entry.file}`;

    const card = document.createElement('article');
    card.className = 'game-card';
    card.innerHTML = `
        <div class="game-preview">
            <div class="game-loader">
                <i class="${entry.icon} game-loader-icon" aria-hidden="true"></i>
                <div class="game-loader-spinner"></div>
                <span class="game-loader-text" data-text-en="${loadingTextEn}" data-text-af="${loadingTextAf}">${t(loadingTextEn, loadingTextAf)}</span>
            </div>
            <div class="game-iframe-wrapper">
                <iframe
                    class="game-iframe"
                    data-src="${fileUrl}"
                    title="${entry.title}"
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin"
                    aria-label="Preview of ${entry.title}"
                ></iframe>
            </div>
            <div class="game-overlay">
                <a href="${fileUrl}" target="_blank" rel="noopener noreferrer" class="game-play-btn">
                    <i class="${ctaIcon}" aria-hidden="true"></i>
                    <span data-text-en="${ctaTextEn}" data-text-af="${ctaTextAf}">${t(ctaTextEn, ctaTextAf)}</span>
                </a>
            </div>
        </div>
        <div class="game-content">
            <h3 class="game-title"><i class="${entry.icon}" aria-hidden="true"></i>${entry.title}</h3>
            <p class="game-description" data-text-en="${entry.descEn}" data-text-af="${entry.descAf}">${t(entry.descEn, entry.descAf)}</p>
            <div class="game-tags">${entry.tags.map(tag => `<span class="game-tag">${tag}</span>`).join('')}</div>
        </div>
    `;
    return card;
}

/** Builds an image-preview card — used by Projects and Games & Hosting. */
export function buildProjectCard(project) {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.innerHTML = `
        <div class="project-image">
            <img src="${IMG_BASE}${project.img}" alt="${project.title}" loading="lazy" decoding="async">
            <div class="project-overlay">
                <a href="${project.url}" ${project.url !== '#' ? 'target="_blank" rel="noopener noreferrer"' : ''} class="project-link" aria-label="View ${project.title}">
                    <i class="${project.icon || 'fas fa-external-link-alt'}"></i>
                </a>
            </div>
        </div>
        <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description" data-text-en="${project.descEn}" data-text-af="${project.descAf}">${t(project.descEn, project.descAf)}</p>
            <div class="project-tags">${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
        </div>
    `;
    return card;
}
