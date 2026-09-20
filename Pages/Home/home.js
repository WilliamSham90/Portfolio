// ============================================================================
// home.js — orchestrator for the Home page.
//
// Identical pattern to the site-root index.js: fetch each section's HTML
// fragment, inject it into its slot, then boot that section's own JS module.
// The only difference from the root version is the relative path prefix
// (../../) needed to reach Widgets/ and core.js from Pages/Home/.
//
// To build a NEW page: copy this whole Pages/Home/ folder, rename it, trim
// PAGE_SECTIONS (and the matching slots/<link> tags in index.html) down to
// only the sections that page needs. Every section stays reusable because it
// only ever touches elements inside its own fragment.
// ============================================================================

import { state, setTheme, setLanguage, $ } from '../../Widgets/core.js';

const WIDGETS = '../../Widgets';

// Order = mount order = document order, so layout doesn't jump as fragments
// arrive. `js`/`init` are null for sections with no behaviour of their own.
const PAGE_SECTIONS = [
    { slot: 'navbar-slot',       html: `${WIDGETS}/Navbar/navbar.html`,             js: `${WIDGETS}/Navbar/navbar.js`,             init: 'initNavbar' },
    { slot: 'hero-slot',         html: `${WIDGETS}/Hero/hero.html`,                 js: `${WIDGETS}/Hero/hero.js`,                 init: 'initHero' },
    { slot: 'about-slot',        html: `${WIDGETS}/About/about.html`,               js: `${WIDGETS}/About/about.js`,               init: 'initAbout' },
    { slot: 'skills-slot',       html: `${WIDGETS}/Skills/skills.html`,             js: `${WIDGETS}/Skills/skills.js`,             init: 'initSkills' },
    { slot: 'experience-slot',   html: `${WIDGETS}/Experience/experience.html`,     js: null,                                      init: null },
    { slot: 'projects-slot',     html: `${WIDGETS}/Projects/projects.html`,         js: `${WIDGETS}/Projects/projects.js`,         init: 'initProjects' },
    { slot: 'playground-slot',   html: `${WIDGETS}/Playground/playground.html`,     js: `${WIDGETS}/Playground/playground.js`,     init: 'initPlayground' },
    { slot: 'gameshosting-slot', html: `${WIDGETS}/GamesHosting/gameshosting.html`, js: `${WIDGETS}/GamesHosting/gameshosting.js`, init: 'initGamesHosting' },
    { slot: 'contact-slot',      html: `${WIDGETS}/Contact/contact.html`,           js: `${WIDGETS}/Contact/contact.js`,           init: 'initContact' },
    { slot: 'footer-slot',       html: `${WIDGETS}/Footer/footer.html`,             js: null,                                      init: null }
];

async function loadFragment(path) {
    const res = await fetch(path, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status} ${res.statusText}`);
    return res.text();
}

async function mountSection(section) {
    const slot = document.getElementById(section.slot);
    if (!slot) return;

    try {
        slot.innerHTML = await loadFragment(section.html);
    } catch (err) {
        console.error(err);
        return; // Leave the slot empty rather than breaking the rest of the page.
    }

    if (section.js) {
        try {
            const mod = await import(section.js);
            mod[section.init]?.();
        } catch (err) {
            console.error(`Failed to initialize ${section.js}:`, err);
        }
    }
}

async function mountPage() {
    // Sequential, in document order: keeps the page from jumping as
    // fragments arrive and keeps behaviour predictable to reason about.
    for (const section of PAGE_SECTIONS) {
        await mountSection(section);
    }
}

function runFakeLoaderProgress() {
    const loaderPercent = $('#loaderPercent');
    return new Promise(resolve => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 25 + 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                resolve();
            }
            if (loaderPercent) loaderPercent.textContent = Math.floor(progress) + '%';
        }, 80);
    });
}

function hideLoader() {
    const loader = $('#loader');
    setTimeout(() => loader?.classList.add('hidden'), 200);
}

document.addEventListener('DOMContentLoaded', async () => {
    // Apply the saved theme immediately so the page under the loader is never
    // the wrong color. navbar.js re-applies it to the toggle icon once that
    // fragment (and #themeToggle) actually exists in the DOM.
    setTheme(state.theme);

    // Run the loading-screen animation and fetch+mount every section in
    // parallel; only reveal the page once both are actually finished.
    await Promise.all([runFakeLoaderProgress(), mountPage()]);

    // Sweep the now-complete DOM for data-text-en/af once everything is mounted.
    setLanguage(state.lang);
    hideLoader();
});
