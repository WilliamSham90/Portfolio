// ============================================================================
// skills.js — animates each skill bar filling to its data-percent, and the
// accompanying percentage counter, once it scrolls into view.
// ============================================================================

import { $$ } from '../core.js';

export function initSkills() {
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const item = entry.target;
                const percent = parseInt(item.dataset.percent) || 0;
                const bar = item.querySelector('.skill-progress');
                const text = item.querySelector('.skill-percent');

                requestAnimationFrame(() => {
                    bar.style.width = percent + '%';
                    animateNumber(text, 0, percent, 1500);
                });

                skillObserver.unobserve(item);
            }
        });
    }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });

    $$('.skill-item').forEach(item => skillObserver.observe(item));
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
