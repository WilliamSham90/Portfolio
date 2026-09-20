// ============================================================================
// hero.js — generates the floating code-symbol particles in the hero
// background. Skipped on narrow viewports (matches the .particle display:none
// rule in hero.css at 768px) so we don't build DOM nodes nobody will see.
// ============================================================================

import { $ } from '../core.js';

export function initHero() {
    const container = $('#particles');
    if (!container || window.innerWidth < 768) return;

    const symbols = ['{', '}', '[', ']', '<', '>', '/', '=', ';'];
    const fragment = document.createDocumentFragment();
    const count = window.innerWidth > 1024 ? 12 : 6;

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        particle.style.cssText = `left:${Math.random() * 100}%;animation-delay:${Math.random() * 20}s;animation-duration:${15 + Math.random() * 10}s`;
        fragment.appendChild(particle);
    }

    container.appendChild(fragment);
}
