// ============================================================================
// playground.js — orchestrator for the Playground page.
//
// Same fetch-and-mount pattern as Pages/Home/home.js, trimmed to only the
// sections this page actually uses: Navbar, Playground (Demos/Widgets/Games),
// Games & Hosting, Footer. Nothing in Widgets/ was changed to make this page
// possible — it just assembles a smaller slice of the same reusable
// fragments used on the Home page.
// ============================================================================

import { state, setTheme, setLanguage, $ } from '../../Widgets/core.js';

const WIDGETS = '../../Widgets';

const PAGE_SECTIONS = [
    { slot: 'navbar-slot',       html: `${WIDGETS}/Navbar/navbar.html`,             js: `${WIDGETS}/Navbar/navbar.js`,             init: 'initNavbar' },
    { slot: 'playground-slot',   html: `${WIDGETS}/Playground/playground.html`,     js: `${WIDGETS}/Playground/playground.js`,     init: 'initPlayground' },
    { slot: 'gameshosting-slot', html: `${WIDGETS}/GamesHosting/gameshosting.html`, js: `${WIDGETS}/GamesHosting/gameshosting.js`, init: 'initGamesHosting' },
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
    setTheme(state.theme);
    await Promise.all([runFakeLoaderProgress(), mountPage()]);
    setLanguage(state.lang);
    hideLoader();
});
