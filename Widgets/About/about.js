// ============================================================================
// about.js — animates the "Years Experience / Projects / Technologies /
// Commits" counters up from 0 once they scroll into view.
// ============================================================================

import { $$ } from '../core.js';

export function initAbout() {
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const target = parseInt(stat.dataset.count) || 0;
                animateNumber(stat, 0, target, 1500);
                statObserver.unobserve(stat);
            }
        });
    }, { threshold: 0.5 });

    $$('.stat-number').forEach(stat => statObserver.observe(stat));
}

function animateNumber(el, start, end, duration) {
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * easeProgress);
        el.textContent = current + (el.classList.contains('skill-percent') ? '%' : '');

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}
