// ============================================================================
// index.js — site layout/shell.
//
// This is the one script every page of the site loads. It fetches the shared
// chrome (navbar, footer) and each page section as an HTML fragment, injects
// it into its slot, then boots that section's own JS module (if it has one).
//
// To build a NEW page: copy index.html, edit its slot <div>s and <link> tags
// to only the sections that page needs, then edit PAGE_SECTIONS below (or in
// a copy of this file) to match. Every section stays reusable because it
// only ever touches elements inside its own fragment.
// ============================================================================

import { state, setTheme, setLanguage, $ } from './Widgets/core.js';

// Order = mount order = document order, so layout doesn't jump as fragments
// arrive. `js`/`init` are null for sections with no behaviour of their own.
const PAGE_SECTIONS = [
    { slot: 'navbar-slot',       html: 'Widgets/Navbar/navbar.html',             js: 'Widgets/Navbar/navbar.js',             init: 'initNavbar' },
    { slot: 'hero-slot',         html: 'Widgets/Hero/hero.html',                 js: 'Widgets/Hero/hero.js',                 init: 'initHero' },
    { slot: 'about-slot',        html: 'Widgets/About/about.html',               js: 'Widgets/About/about.js',               init: 'initAbout' },
    { slot: 'skills-slot',       html: 'Widgets/Skills/skills.html',             js: 'Widgets/Skills/skills.js',             init: 'initSkills' },
    { slot: 'experience-slot',   html: 'Widgets/Experience/experience.html',     js: null,                                   init: null },
    { slot: 'projects-slot',     html: 'Widgets/Projects/projects.html',         js: 'Widgets/Projects/projects.js',         init: 'initProjects' },
    { slot: 'playground-slot',   html: 'Widgets/Playground/playground.html',     js: 'Widgets/Playground/playground.js',     init: 'initPlayground' },
    { slot: 'gameshosting-slot', html: 'Widgets/GamesHosting/gameshosting.html', js: 'Widgets/GamesHosting/gameshosting.js', init: 'initGamesHosting' },
    { slot: 'contact-slot',      html: 'Widgets/Contact/contact.html',           js: 'Widgets/Contact/contact.js',           init: 'initContact' },
    { slot: 'footer-slot',       html: 'Widgets/Footer/footer.html',             js: null,                                   init: null }
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
            const mod = await import(`./${section.js}`);
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
