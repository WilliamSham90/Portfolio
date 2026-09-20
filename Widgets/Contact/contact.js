// ============================================================================
// contact.js — handles the contact form's async submit (FormSubmit.co) with
// inline button-state feedback instead of a page reload.
// ============================================================================

import { $ } from '../core.js';

export function initContact() {
    const form = $('#contactForm');
    if (!form) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = form.querySelector('.btn-submit');
        const originalText = btn.innerHTML;

        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                form.reset();
                btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
                setTimeout(() => btn.innerHTML = originalText, 3000);
            } else {
                throw new Error('Failed');
            }
        } catch {
            btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
            setTimeout(() => btn.innerHTML = originalText, 3000);
        } finally {
            btn.disabled = false;
        }
    });
}
