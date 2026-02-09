// Global Interactive Logic for PT Akses Legal Indonesia

// Load I18n Script Dynamically
(function () {
    if (!window.I18n) {
        const script = document.createElement('script');
        script.src = 'assets/js/i18n.js';
        document.head.appendChild(script);
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    // 1. Reveal Animations (Universal)
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);
    document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));

    // 2. Mobile Menu Logic
    const toggle = document.getElementById('mobile-menu-toggle');
    const close = document.getElementById('mobile-menu-close');
    const menu = document.getElementById('mobile-menu');

    if (toggle && close && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.remove('translate-x-full');
            document.body.style.overflow = 'hidden'; // Prevent scroll
        });

        close.addEventListener('click', () => {
            menu.classList.add('translate-x-full');
            document.body.style.overflow = '';
        });

        // Close on link click
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.add('translate-x-full');
                document.body.style.overflow = '';
            });
        });
    }

    // 3. Animated Stats Counter
    const stats = document.querySelectorAll('[data-counter]');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.started) {
                animateCounter(entry.target);
                entry.target.dataset.started = "true";
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(el => statsObserver.observe(el));

    function animateCounter(el) {
        const targetValue = el.getAttribute('data-counter');
        const isFloat = targetValue.includes('.');
        const target = parseFloat(targetValue);
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuad = progress * (2 - progress);
            const current = easeOutQuad * target;

            if (isFloat) {
                el.textContent = current.toFixed(1);
            } else {
                el.textContent = Math.floor(current);
            }

            if (el.getAttribute('data-plus') === 'true') {
                el.textContent += '+';
            }

            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    // 4. Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId.startsWith('#')) return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (menu && !menu.classList.contains('translate-x-full')) {
                    menu.classList.add('translate-x-full');
                    document.body.style.overflow = '';
                }
            }
        });
    });
});
