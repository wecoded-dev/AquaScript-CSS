/* =============================================================================
   AquaScriptCSS Ultra Advanced JavaScript System v1.0
   =============================================================================

   This file brings ultra-advanced, highly animated, beautiful, and world-class
   interactivity to AquaScriptCSS components: alerts, badges, buttons, cards,
   forms, modals, navbar, and containers. It provides accessibility, performance,
   and UX enhancements with modern JavaScript best practices.

   You can place this file anywhere in your repository and import as needed.
============================================================================= */

/* ============================= UTILITY FUNCTIONS ============================= */

/**
 * AquaScript Utility: Animation Helper
 * Adds/removes classes for animation with automatic cleanup.
 */
function aquaAnimate(element, animationClass, duration = 800) {
    if (!element) return;
    element.classList.add(animationClass);
    setTimeout(() => element.classList.remove(animationClass), duration);
}

/**
 * AquaScript Utility: Focus Trap for Modals
 */
function aquaTrapFocus(container) {
    const focusable = container.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    container.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) { // Shift + Tab
                if (document.activeElement === first) {
                    last.focus();
                    e.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === last) {
                    first.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

/**
 * AquaScript Utility: Scroll Lock (for modals)
 */
function aquaScrollLock(lock = true) {
    document.body.style.overflow = lock ? 'hidden' : '';
}

/**
 * AquaScript Utility: Ripple Effect
 */
function aquaRipple(event, color = "rgba(0,0,0,0.2)", duration = 600) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    ripple.className = 'aq-ripple';
    ripple.style.background = color;
    const rect = button.getBoundingClientRect();
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    ripple.style.width = ripple.style.height = `${Math.max(rect.width, rect.height)}px`;
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), duration);
}

/* ============================= ALERTS ============================= */

/**
 * AquaScript Alert System: Show/Dismiss Alerts
 */
function aquaShowAlert(selector, options = {}) {
    const alert = document.querySelector(selector);
    if (!alert) return;
    alert.classList.add('aq-alert', 'fade');
    alert.style.display = '';
    if (options.autoClose) {
        setTimeout(() => aquaDismissAlert(alert), options.autoClose);
    }
}

function aquaDismissAlert(alert) {
    if (!alert) return;
    alert.classList.add('closing');
    setTimeout(() => {
        alert.style.display = 'none';
        alert.classList.remove('closing');
    }, 400);
}

// Auto-bind close buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('aq-alert-close')) {
        const alert = e.target.closest('.aq-alert');
        aquaDismissAlert(alert);
    }
});

/* ============================= BADGES & BUTTONS ============================= */

// Ripple effect on buttons/badges
document.addEventListener('mousedown', function(e) {
    if (e.target.classList.contains('aq-btn') || e.target.classList.contains('aq-badge')) {
        aquaRipple(e, "rgba(255,255,255,0.3)", 600);
    }
});

/* ============================= MODALS ============================= */

/**
 * AquaScript Modal System: Open/Close, Animation, Focus Trap
 */
function aquaOpenModal(selector) {
    const modal = document.querySelector(selector);
    if (!modal) return;
    modal.classList.add('active');
    aquaTrapFocus(modal);
    aquaScrollLock(true);
}

function aquaCloseModal(selector) {
    const modal = document.querySelector(selector);
    if (!modal) return;
    modal.classList.remove('active');
    aquaScrollLock(false);
}

// Auto-bind modal close buttons/background
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('aq-modal-close') ||
        e.target.classList.contains('aq-modal-backdrop')) {
        const modal = e.target.closest('.aq-modal');
        if (modal) aquaCloseModal(`#${modal.id}`);
    }
});

/* ============================= NAVBAR ============================= */

/**
 * AquaScript Navbar: Mobile Toggle, Dropdowns
 */
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('aq-navbar-toggle')) {
        const collapse = document.querySelector('.aq-navbar-collapse');
        collapse.classList.toggle('active');
        e.target.classList.toggle('active');
    }
    // Dropdowns
    if (e.target.classList.contains('aq-navbar-link')) {
        const item = e.target.closest('.aq-navbar-item');
        if (!item) return;
        const dropdown = item.querySelector('.aq-navbar-dropdown');
        if (dropdown) {
            dropdown.classList.toggle('show');
        }
    }
});

/* ============================= CARDS ============================= */

/**
 * AquaScript Card System: Staggered animation, Draggable
 */
document.querySelectorAll('.aq-card.stagger').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.querySelectorAll('.aq-card-header > *, .aq-card-body > *, .aq-card-footer > *')
            .forEach((el, i) => aquaAnimate(el, 'aq-card-stagger', 600 + i * 80));
    });
});

document.querySelectorAll('.aq-card.draggable').forEach(card => {
    let isDragging = false, offset = {x:0, y:0};
    card.addEventListener('mousedown', e => {
        isDragging = true;
        offset.x = e.clientX - card.offsetLeft;
        offset.y = e.clientY - card.offsetTop;
        card.style.position = 'absolute';
        card.style.zIndex = 9999;
        aquaAnimate(card, 'draggable', 200);
    });
    document.addEventListener('mousemove', e => {
        if (!isDragging) return;
        card.style.left = `${e.clientX - offset.x}px`;
        card.style.top = `${e.clientY - offset.y}px`;
    });
    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        card.style.position = '';
        card.style.zIndex = '';
        card.style.left = '';
        card.style.top = '';
    });
});

/* ============================= FORMS ============================= */

/**
 * AquaScript Form: Floating Labels, Validation Animation
 */
document.querySelectorAll('.aq-form-floating .aq-form-control').forEach(input => {
    input.addEventListener('focus', () => {
        input.nextElementSibling.classList.add('active');
    });
    input.addEventListener('blur', () => {
        if (!input.value) input.nextElementSibling.classList.remove('active');
    });
});

// Shake invalid controls on submit
document.querySelectorAll('.aq-form').forEach(form => {
    form.addEventListener('submit', function(e) {
        let invalid = false;
        form.querySelectorAll('.aq-form-control').forEach(input => {
            if (input.classList.contains('invalid')) {
                aquaAnimate(input, 'shake', 500);
                invalid = true;
            }
        });
        if (invalid) e.preventDefault();
    });
});

/* ============================= CONTAINERS ============================= */

document.querySelectorAll('.aq-container.clickable').forEach(container => {
    container.addEventListener('mousedown', function(e) {
        aquaAnimate(container, 'interactive', 300);
    });
});

/* ============================= ACCESSIBILITY & PERFORMANCE ============================= */

// Reduced motion: Remove all AquaScript animations if user prefers reduced motion.
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('*').forEach(el => {
        el.style.transition = 'none';
        el.style.animation = 'none';
    });
}

/* ============================= DEMO: TOAST ALERT ============================= */
window.aquaToast = function(msg, opts = {}) {
    const container = document.createElement('div');
    container.className = 'aq-alert aq-alert-container top-right info';
    container.innerHTML = `
        <span class="aq-alert-icon">🔔</span>
        <div class="aq-alert-content">
            <div class="aq-alert-title">${opts.title || 'Notice'}</div>
            <div class="aq-alert-description">${msg}</div>
        </div>
        <button class="aq-alert-close" aria-label="Close">&times;</button>
    `;
    document.body.appendChild(container);
    aquaShowAlert(`.${container.className.split(' ').join('.')}`, {autoClose: opts.autoClose || 4000});
    container.querySelector('.aq-alert-close').onclick = () => aquaDismissAlert(container);
    if (opts.autoClose) setTimeout(() => aquaDismissAlert(container), opts.autoClose);
};

/* ============================= EXPORTS ============================= */
window.AquaScript = {
    showAlert: aquaShowAlert,
    dismissAlert: aquaDismissAlert,
    openModal: aquaOpenModal,
    closeModal: aquaCloseModal,
    toast: window.aquaToast,
    animate: aquaAnimate,
    ripple: aquaRipple,
    scrollLock: aquaScrollLock,
    trapFocus: aquaTrapFocus
};

// End of AquaScriptCSS Ultra Advanced JavaScript System v1.0
