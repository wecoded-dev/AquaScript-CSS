/**
 * AquaScriptCSS Ultra Advanced Components System v2.0
 * The world's most comprehensive, full-featured modular JS for AquaScript-CSS
 * Covers: Alerts, Badges, Buttons, Cards, Forms, Modals, Navbar
 * Author: wecoded-dev | MIT
 */

/* =======================================================================
   UTILITY FUNCTIONS
======================================================================= */
const AquaUtils = {
    // Animation Utility
    animateCSS: (element, animationName, callback) => {
        element.classList.add(animationName);
        function handleAnimationEnd() {
            element.classList.remove(animationName);
            element.removeEventListener('animationend', handleAnimationEnd);
            if (typeof callback === 'function') callback();
        }
        element.addEventListener('animationend', handleAnimationEnd);
    },
    // Focus Trap for Modals
    trapFocus: (modal) => {
        const focusableEls = modal.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
        const firstEl = focusableEls[0];
        const lastEl = focusableEls[focusableEls.length - 1];
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstEl) {
                        lastEl.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastEl) {
                        firstEl.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    },
    // ARIA Utility
    setAria: (el, attrs) => {
        Object.entries(attrs).forEach(([key, val]) => el.setAttribute('aria-' + key, val));
    },
    // Custom Event Utility
    triggerEvent: (el, name, detail = {}) => {
        el.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));
    }
};

/* =======================================================================
   ALERTS COMPONENT
======================================================================= */
const AquaAlerts = (() => {
    function closeAlert(alert, options = {}) {
        if (alert.classList.contains('closing')) return;
        alert.classList.add('closing');
        AquaUtils.animateCSS(alert, 'aq-alert-slide-out', () => {
            alert.remove();
            AquaUtils.triggerEvent(document, 'aq-alert-closed', { alert });
        });
    }
    function init() {
        document.querySelectorAll('.aq-alert-close').forEach(btn => {
            btn.addEventListener('click', e => {
                const alert = btn.closest('.aq-alert');
                if (alert) closeAlert(alert);
            });
        });
        document.querySelectorAll('.aq-alert.clickable').forEach(alert => {
            alert.addEventListener('click', e => {
                AquaUtils.triggerEvent(alert, 'aq-alert-clicked');
            });
        });
        document.querySelectorAll('.aq-alert[data-autoclose]').forEach(alert => {
            const ms = parseInt(alert.dataset.autoclose, 10) || 5000;
            setTimeout(() => closeAlert(alert), ms);
        });
    }
    function show({ title = '', description = '', type = 'info', style = '', actions = [], autoclose = 0, icon = '', container = null, onClose = null }) {
        // Create alert element
        const alert = document.createElement('div');
        alert.className = `aq-alert ${type} ${style}`.trim();
        alert.role = 'alert';
        alert.innerHTML = `
            ${icon ? `<span class="aq-alert-icon">${icon}</span>` : ''}
            <div class="aq-alert-content">
                ${title ? `<div class="aq-alert-title">${title}</div>` : ''}
                ${description ? `<div class="aq-alert-description">${description}</div>` : ''}
                ${actions.length ? `<div class="aq-alert-actions">${actions.map(a => `<button type="button" class="aq-btn ${a.class || ''}">${a.label}</button>`).join('')}</div>` : ''}
            </div>
            <button type="button" class="aq-alert-close" aria-label="Close">&times;</button>
        `;
        if (autoclose) alert.dataset.autoclose = autoclose;
        if (!container) container = document.querySelector('.aq-alert-container.top-right') || document.body;
        container.appendChild(alert);
        AquaUtils.triggerEvent(alert, 'aq-alert-shown');
        // Attach close
        alert.querySelector('.aq-alert-close').onclick = () => {
            closeAlert(alert);
            if (onClose) onClose();
        };
        // Attach actions
        actions.forEach((a, i) => {
            alert.querySelectorAll('.aq-alert-actions .aq-btn')[i].onclick = a.onClick || (() => {});
        });
        // Autoclose
        if (autoclose) setTimeout(() => closeAlert(alert), autoclose);
        return alert;
    }
    return { init, show, close: closeAlert };
})();

/* =======================================================================
   BADGES COMPONENT
======================================================================= */
const AquaBadges = (() => {
    function init() {
        document.querySelectorAll('.aq-badge.clickable').forEach(badge => {
            badge.addEventListener('click', e => {
                badge.classList.toggle('active');
                AquaUtils.triggerEvent(badge, 'aq-badge-clicked');
            });
        });
        document.querySelectorAll('.aq-badge.ripple').forEach(badge => {
            badge.addEventListener('mousedown', e => {
                badge.classList.add('aq-badge-pulse');
                setTimeout(() => badge.classList.remove('aq-badge-pulse'), 600);
            });
        });
    }
    function setStatus(badge, status) {
        badge.classList.remove('online', 'offline', 'busy', 'away');
        badge.classList.add(status);
    }
    function updateCounter(badge, count) {
        let counter = badge.querySelector('.aq-badge.counter');
        if (!counter) {
            counter = document.createElement('span');
            counter.className = 'aq-badge counter';
            badge.appendChild(counter);
        }
        counter.textContent = count;
        AquaUtils.animateCSS(counter, 'aq-badge-counter-pop');
    }
    return { init, setStatus, updateCounter };
})();

/* =======================================================================
   BUTTONS COMPONENT
======================================================================= */
const AquaButtons = (() => {
    function init() {
        document.querySelectorAll('.aq-btn.clickable').forEach(btn => {
            btn.addEventListener('click', e => {
                btn.classList.toggle('active');
                AquaUtils.triggerEvent(btn, 'aq-btn-clicked');
            });
        });
        document.querySelectorAll('.aq-btn.shake').forEach(btn => {
            btn.addEventListener('click', e => {
                AquaUtils.animateCSS(btn, 'aq-btn-shake');
            });
        });
        document.querySelectorAll('.aq-btn-group').forEach(group => {
            group.querySelectorAll('.aq-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    group.querySelectorAll('.aq-btn').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    AquaUtils.triggerEvent(group, 'aq-btn-group-selected', { button: btn });
                });
            });
        });
    }
    function setLoading(btn, loading = true) {
        if (loading) {
            btn.disabled = true;
            btn.classList.add('loading');
            let spinner = btn.querySelector('.aq-btn-spinner');
            if (!spinner) {
                spinner = document.createElement('span');
                spinner.className = 'aq-btn-spinner';
                btn.prepend(spinner);
            }
        } else {
            btn.disabled = false;
            btn.classList.remove('loading');
            const spinner = btn.querySelector('.aq-btn-spinner');
            if (spinner) spinner.remove();
        }
    }
    return { init, setLoading };
})();

/* =======================================================================
   CARDS COMPONENT
======================================================================= */
const AquaCards = (() => {
    function init() {
        document.querySelectorAll('.aq-card.clickable').forEach(card => {
            card.addEventListener('click', e => {
                AquaUtils.triggerEvent(card, 'aq-card-clicked');
            });
        });
        document.querySelectorAll('.aq-card.draggable').forEach(card => {
            card.draggable = true;
            card.addEventListener('dragstart', e => {
                card.classList.add('dragging');
                AquaUtils.triggerEvent(card, 'aq-card-dragstart', { card });
            });
            card.addEventListener('dragend', e => {
                card.classList.remove('dragging');
                AquaUtils.triggerEvent(card, 'aq-card-dragend', { card });
            });
        });
    }
    function shimmer(card, enable = true) {
        if (enable) card.classList.add('skeleton');
        else card.classList.remove('skeleton');
    }
    function setProgress(card, percent) {
        let bar = card.querySelector('.aq-card-progress-bar');
        if (!bar) {
            let progress = card.querySelector('.aq-card-progress');
            if (!progress) {
                progress = document.createElement('div');
                progress.className = 'aq-card-progress';
                card.appendChild(progress);
            }
            bar = document.createElement('div');
            bar.className = 'aq-card-progress-bar';
            progress.appendChild(bar);
        }
        bar.style.width = percent + '%';
    }
    return { init, shimmer, setProgress };
})();

/* =======================================================================
   FORMS COMPONENT
======================================================================= */
const AquaForms = (() => {
    function init() {
        // Floating labels
        document.querySelectorAll('.aq-form-floating .aq-form-control').forEach(input => {
            input.addEventListener('input', () => {
                if (input.value) input.classList.add('has-value');
                else input.classList.remove('has-value');
            });
        });
        // Validation
        document.querySelectorAll('.aq-form-control').forEach(input => {
            input.addEventListener('blur', () => {
                if (input.checkValidity()) {
                    input.classList.add('valid');
                    input.classList.remove('invalid');
                } else {
                    input.classList.add('invalid');
                    input.classList.remove('valid');
                    AquaUtils.animateCSS(input, 'shake');
                }
            });
        });
        // Custom checkbox/radio/switch
        document.querySelectorAll('.aq-form-check-input').forEach(input => {
            input.addEventListener('change', () => {
                AquaUtils.triggerEvent(input, 'aq-form-check-changed', { checked: input.checked });
            });
        });
    }
    function validate(form) {
        let isValid = true;
        form.querySelectorAll('.aq-form-control').forEach(input => {
            if (!input.checkValidity()) {
                input.classList.add('invalid');
                input.classList.remove('valid');
                isValid = false;
            } else {
                input.classList.add('valid');
                input.classList.remove('invalid');
            }
        });
        return isValid;
    }
    function setLoading(form, loading = true) {
        form.classList.toggle('aq-form-loading', loading);
        form.querySelectorAll('.aq-form-control').forEach(input => {
            input.disabled = loading;
        });
    }
    return { init, validate, setLoading };
})();

/* =======================================================================
   MODALS COMPONENT
======================================================================= */
const AquaModals = (() => {
    let openModal = null;
    function open(selectorOrEl, opts = {}) {
        let modal = typeof selectorOrEl === 'string' ? document.querySelector(selectorOrEl) : selectorOrEl;
        if (!modal) return;
        modal.classList.add('active');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('role', 'dialog');
        AquaUtils.trapFocus(modal);
        openModal = modal;
        AquaUtils.triggerEvent(modal, 'aq-modal-opened');
        if (opts.onOpen) opts.onOpen(modal);
    }
    function close(modal = openModal, opts = {}) {
        if (!modal) return;
        modal.classList.remove('active');
        AquaUtils.triggerEvent(modal, 'aq-modal-closed');
        openModal = null;
        if (opts.onClose) opts.onClose(modal);
    }
    function init() {
        document.querySelectorAll('.aq-modal-close').forEach(btn => {
            btn.addEventListener('click', e => {
                close(btn.closest('.aq-modal'));
            });
        });
        document.querySelectorAll('.aq-modal').forEach(modal => {
            modal.addEventListener('click', e => {
                if (e.target === modal) close(modal);
            });
        });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && openModal) close(openModal);
        });
    }
    function setLoading(modal, loading = true) {
        let loadingEl = modal.querySelector('.aq-modal-loading');
        if (!loadingEl) {
            loadingEl = document.createElement('div');
            loadingEl.className = 'aq-modal-loading';
            loadingEl.innerHTML = '<div class="aq-modal-spinner"></div>';
            modal.appendChild(loadingEl);
        }
        loadingEl.classList.toggle('active', loading);
    }
    function show(options = {}) {
        // Dynamic modal creation
        const modal = document.createElement('div');
        modal.className = 'aq-modal active';
        modal.setAttribute('role', 'dialog');
        AquaUtils.setAria(modal, { modal: 'true', labelledby: 'aq-modal-title' });
        modal.innerHTML = `
            <div class="aq-modal-dialog">
                <div class="aq-modal-header">
                    <span class="aq-modal-title" id="aq-modal-title">${options.title || ''}</span>
                    <button type="button" class="aq-modal-close" aria-label="Close">&times;</button>
                </div>
                <div class="aq-modal-content">
                    <div class="aq-modal-body">
                        <div class="aq-modal-body-content">${options.content || ''}</div>
                    </div>
                    ${options.footer ? `<div class="aq-modal-footer">${options.footer}</div>` : ''}
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        open(modal);
        modal.querySelector('.aq-modal-close').onclick = () => close(modal);
        return modal;
    }
    return { init, open, close, setLoading, show };
})();

/* =======================================================================
   NAVBAR COMPONENT
======================================================================= */
const AquaNavbar = (() => {
    function toggleMobileNav(navbar) {
        const toggle = navbar.querySelector('.aq-navbar-toggle');
        const collapse = navbar.querySelector('.aq-navbar-collapse');
        if (!toggle || !collapse) return;
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            collapse.classList.toggle('active');
            AquaUtils.triggerEvent(navbar, 'aq-navbar-toggled', { expanded: collapse.classList.contains('active') });
        });
    }
    function handleDropdown(navbar) {
        navbar.querySelectorAll('.aq-navbar-item').forEach(item => {
            const dropdown = item.querySelector('.aq-navbar-dropdown');
            if (dropdown) {
                item.addEventListener('mouseenter', () => dropdown.classList.add('show'));
                item.addEventListener('mouseleave', () => dropdown.classList.remove('show'));
            }
        });
    }
    function init() {
        document.querySelectorAll('.aq-navbar').forEach(navbar => {
            toggleMobileNav(navbar);
            handleDropdown(navbar);
        });
    }
    return { init };
})();

/* =======================================================================
   COMPONENTS INITIALIZER
======================================================================= */
const AquaScriptComponents = {
    init: function () {
        AquaAlerts.init();
        AquaBadges.init();
        AquaButtons.init();
        AquaCards.init();
        AquaForms.init();
        AquaModals.init();
        AquaNavbar.init();
        // Optionally: add global event listeners, theme switching, etc.
        document.body.classList.add('aqua-components-initialized');
        AquaUtils.triggerEvent(document, 'aqua-components-initialized');
    },
    Alerts: AquaAlerts,
    Badges: AquaBadges,
    Buttons: AquaButtons,
    Cards: AquaCards,
    Forms: AquaForms,
    Modals: AquaModals,
    Navbar: AquaNavbar,
    Utils: AquaUtils
};

// Auto-initialize if DOM is ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => AquaScriptComponents.init(), 1);
} else {
    document.addEventListener('DOMContentLoaded', AquaScriptComponents.init);
}

// Expose globally
window.AquaScriptComponents = AquaScriptComponents;

/**
 * For full docs, advanced usage, API, and extensibility, visit:
 * https://github.com/wecoded-dev/AquaScript-CSS
 * 
 * This file is designed for enterprise, open-source, and creative projects.
 * You may extend, override, or customize any part of the AquaScriptComponents object.
 */
