// ============================================================================
// navbar.js — smooth-scroll nav links, scroll-spy active state, mobile menu,
// and the language/theme toggle buttons (both toggles live in this fragment).
// ============================================================================

import { state, setLanguage, setTheme, $, $$, throttle } from '../core.js';

export function initNavbar() {
    $$('.nav-link[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = $(link.getAttribute('href'));
            if (target) {
                window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
                $$('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                if (state.menuOpen) toggleMenu();
            }
        });
    });

    const handleScroll = throttle(() => {
        const scrollY = window.scrollY;
        $('#header')?.classList.toggle('scrolled', scrollY > 50);

        const sections = $$('section[id]');
        for (const section of sections) {
            const top = section.offsetTop - 100;
            const bottom = top + section.offsetHeight;
            if (scrollY >= top && scrollY < bottom) {
                $$('.nav-link').forEach(l => l.classList.remove('active'));
                $(`.nav-link[href="#${section.id}"]`)?.classList.add('active');
                break;
            }
        }
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });

    $('#menuToggle')?.addEventListener('click', toggleMenu);

    $('#langToggle')?.addEventListener('click', () => {
        setLanguage(state.lang === 'en' ? 'af' : 'en');
    });

    $('#themeToggle')?.addEventListener('click', () => {
        setTheme(state.theme === 'dark' ? 'light' : 'dark');
    });

    // The theme may have been applied (by index.js) before this fragment
    // existed — reflect it on the icon now that #themeToggle is in the DOM.
    setTheme(state.theme);
}

function toggleMenu() {
    state.menuOpen = !state.menuOpen;
    $('#navMenu')?.classList.toggle('active', state.menuOpen);
    $('#menuToggle')?.classList.toggle('active', state.menuOpen);
    $('#menuToggle')?.setAttribute('aria-expanded', state.menuOpen);
}
