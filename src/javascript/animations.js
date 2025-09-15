/**
 * AquaScriptCSS Animations & Interactions v2.0
 * High-level, advanced JS utilities for all components.
 * Modular, extensible, and beautiful.
 */

(function (window, document) {
    "use strict";

    // Animation helpers
    function animateCSS(element, animationName, { duration = 600, iteration = 1, callback } = {}) {
        return new Promise((resolve) => {
            element.style.animationDuration = duration + "ms";
            element.style.animationIterationCount = iteration;
            element.classList.add(animationName);

            function handleAnimationEnd(event) {
                element.classList.remove(animationName);
                element.style.animationDuration = "";
                element.style.animationIterationCount = "";
                element.removeEventListener("animationend", handleAnimationEnd);
                if (typeof callback === "function") callback(event);
                resolve(event);
            }
            element.addEventListener("animationend", handleAnimationEnd);
        });
    }

    // Ripple effect for buttons, badges, navbar links
    function createRipple(e) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'aq-ripple';
        ripple.style.left = (e.clientX - rect.left) + 'px';
        ripple.style.top = (e.clientY - rect.top) + 'px';
        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    function initRipple(selector) {
        document.querySelectorAll(selector).forEach(el => {
            el.style.position = 'relative';
            el.style.overflow = 'hidden';
            el.addEventListener('click', createRipple);
        });
    }

    // Alerts: close, progress bar, stacking, entrance/exit animations
    function initAlerts() {
        document.querySelectorAll('.aq-alert').forEach(alert => {
            // Close button
            const closeBtn = alert.querySelector('.aq-alert-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    animateCSS(alert, 'aq-alert-slide-out', { duration: 400 }).then(() => {
                        alert.remove();
                    });
                });
            }
            // Clickable alert
            if (alert.classList.contains('clickable')) {
                alert.addEventListener('click', () => {
                    animateCSS(alert, 'aq-alert-shake');
                });
            }
            // Progress bar
            if (alert.classList.contains('with-progress')) {
                const progressBar = alert.querySelector('.aq-alert-progress');
                if (progressBar) {
                    progressBar.addEventListener('animationend', () => {
                        animateCSS(alert, 'aq-alert-slide-out', { duration: 400 }).then(() => {
                            alert.remove();
                        });
                    });
                }
            }
            // Entrance
            if (!alert.classList.contains('aq-animated')) {
                animateCSS(alert, 'aq-alert-slide-in', { duration: 600 });
                alert.classList.add('aq-animated');
            }
        });
    }

    // Badges: animated counter, pulse, bounce, shake, spin
    function initBadges() {
        document.querySelectorAll('.aq-badge.counter').forEach(counter => {
            animateCSS(counter, 'aq-badge-counter-pop', { duration: 300 });
        });
        document.querySelectorAll('.aq-badge.pulse').forEach(badge => {
            animateCSS(badge, 'aq-badge-pulse', { duration: 2000, iteration: Infinity });
        });
        document.querySelectorAll('.aq-badge.bounce').forEach(badge => {
            animateCSS(badge, 'aq-badge-bounce', { duration: 2000, iteration: Infinity });
        });
        document.querySelectorAll('.aq-badge.shake').forEach(badge => {
            animateCSS(badge, 'aq-badge-shake', { duration: 500 });
        });
        document.querySelectorAll('.aq-badge.spin .aq-badge-icon').forEach(icon => {
            animateCSS(icon, 'aq-badge-spin', { duration: 1000, iteration: Infinity });
        });
    }

    // Buttons: ripple, pulse, bounce, shake, loading spinner
    function initButtons() {
        initRipple('.aq-btn.ripple');
        document.querySelectorAll('.aq-btn.pulse').forEach(btn => {
            animateCSS(btn, 'aq-btn-pulse', { duration: 2000, iteration: Infinity });
        });
        document.querySelectorAll('.aq-btn.bounce').forEach(btn => {
            animateCSS(btn, 'aq-btn-bounce', { duration: 2000, iteration: Infinity });
        });
        document.querySelectorAll('.aq-btn.shake').forEach(btn => {
            animateCSS(btn, 'aq-btn-shake', { duration: 500 });
        });
        document.querySelectorAll('.aq-btn .aq-btn-spinner').forEach(spinner => {
            animateCSS(spinner, 'aq-btn-spin', { duration: 750, iteration: Infinity });
        });
        // Button group focus
        document.querySelectorAll('.aq-btn-group .aq-btn').forEach(btn => {
            btn.addEventListener('focus', () => btn.classList.add('active'));
            btn.addEventListener('blur', () => btn.classList.remove('active'));
        });
    }

    // Cards: staggered child animation, hover reveal, flip, skeleton shimmer
    function initCards() {
        document.querySelectorAll('.aq-card.stagger').forEach(card => {
            card.addEventListener('mouseenter', () => {
                const children = [
                    ...card.querySelectorAll('.aq-card-header > *'),
                    ...card.querySelectorAll('.aq-card-body > *'),
                    ...card.querySelectorAll('.aq-card-footer > *')
                ];
                children.forEach((child, i) => {
                    setTimeout(() => {
                        animateCSS(child, 'aq-card-stagger', { duration: 600 });
                    }, i * 100);
                });
            });
        });
        document.querySelectorAll('.aq-card.hover-reveal').forEach(card => {
            card.addEventListener('mouseenter', () => {
                const content = card.querySelector('.aq-card-hover-content');
                if (content) animateCSS(content, 'aq-card-stagger', { duration: 600 });
            });
        });
        document.querySelectorAll('.aq-card.flip').forEach(card => {
            card.addEventListener('mouseenter', () => card.style.transform = 'rotateY(15deg) rotateX(5deg)');
            card.addEventListener('mouseleave', () => card.style.transform = '');
        });
        document.querySelectorAll('.aq-card.skeleton').forEach(card => {
            animateCSS(card, 'aq-card-shimmer', { duration: 1500, iteration: Infinity });
        });
    }

    // Forms: floating labels, shake on invalid, animated feedback
    function initForms() {
        // Floating labels
        document.querySelectorAll('.aq-form-floating .aq-form-control').forEach(input => {
            input.addEventListener('focus', () => {
                const label = input.nextElementSibling;
                if (label && label.classList.contains('aq-form-label')) {
                    label.classList.add('active');
                }
            });
            input.addEventListener('blur', () => {
                const label = input.nextElementSibling;
                if (label && label.classList.contains('aq-form-label') && !input.value) {
                    label.classList.remove('active');
                }
            });
        });
        // Shake invalid
        document.querySelectorAll('.aq-form-control.invalid').forEach(input => {
            animateCSS(input, 'aq-form-shake', { duration: 500 });
        });
        // Feedback animation
        document.querySelectorAll('.aq-form-feedback').forEach(feedback => {
            animateCSS(feedback, 'aq-form-fade-in', { duration: 200 });
        });
    }

    // Modals: open/close, dialog transitions, drawer/alert/flip/scale/bounce/fade
    function initModals() {
        document.querySelectorAll('.aq-modal').forEach(modal => {
            // Open/close logic
            const closeBtn = modal.querySelector('.aq-modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    modal.classList.remove('active');
                });
            }
            // Dialog entrance
            if (modal.classList.contains('active')) {
                const dialog = modal.querySelector('.aq-modal-dialog');
                if (dialog) {
                    if (modal.classList.contains('scale'))
                        animateCSS(dialog, 'aq-modal-scale', { duration: 500 });
                    else if (modal.classList.contains('flip'))
                        animateCSS(dialog, 'aq-modal-flip', { duration: 500 });
                    else if (modal.classList.contains('bounce'))
                        animateCSS(dialog, 'aq-modal-bounce-in', { duration: 500 });
                    else if (modal.classList.contains('fade'))
                        animateCSS(dialog, 'aq-modal-fade', { duration: 600 });
                    else if (modal.classList.contains('slide-top'))
                        animateCSS(dialog, 'aq-modal-slide-in-top', { duration: 500 });
                }
            }
        });
    }

    // Navbar: responsive toggle, dropdown animation, ripple, underline
    function initNavbar() {
        // Toggle button for mobile nav
        document.querySelectorAll('.aq-navbar-toggle').forEach(toggle => {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
                const collapse = document.querySelector('.aq-navbar-collapse');
                if (collapse) collapse.classList.toggle('active');
            });
        });
        // Dropdown animation
        document.querySelectorAll('.aq-navbar-item').forEach(item => {
            const dropdown = item.querySelector('.aq-navbar-dropdown');
            if (dropdown) {
                item.addEventListener('mouseenter', () => {
                    dropdown.classList.add('show');
                    animateCSS(dropdown, 'aq-navbar-scale-in', { duration: 400 });
                });
                item.addEventListener('mouseleave', () => {
                    dropdown.classList.remove('show');
                });
            }
        });
        // Ripple effect
        initRipple('.aq-navbar-link.ripple');
        // Underline
        document.querySelectorAll('.aq-navbar-link.underline').forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.classList.add('active');
            });
            link.addEventListener('mouseleave', () => {
                link.classList.remove('active');
            });
        });
    }

    // Accessibility: reduced motion support
    function respectsReducedMotion() {
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    function disableAnimationsForReducedMotion() {
        if (!respectsReducedMotion()) return;
        document.querySelectorAll('[class*="aq-"]').forEach(el => {
            el.style.transition = 'none';
            el.style.animation = 'none';
        });
    }

    // Responsive: auto-init on DOMContentLoaded
    document.addEventListener("DOMContentLoaded", function () {
        if (respectsReducedMotion()) {
            disableAnimationsForReducedMotion();
        } else {
            initAlerts();
            initBadges();
            initButtons();
            initCards();
            initForms();
            initModals();
            initNavbar();
        }
    });

    // Expose helpers globally for manual use as needed
    window.AquaScriptAnimations = {
        animateCSS,
        initRipple,
        initAlerts,
        initBadges,
        initButtons,
        initCards,
        initForms,
        initModals,
        initNavbar,
        disableAnimationsForReducedMotion
    };

})(window, document);
