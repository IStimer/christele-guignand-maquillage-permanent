/**
 * Christèle Guignand - Landing Page
 * Main JavaScript with Lenis Smooth Scroll + GSAP Animations
 * Version 3 - Enhanced animations with parallax and text split
 */

(function() {
    'use strict';

    // ===================================
    // CONFIGURATION
    // ===================================
    const CONFIG = {
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        isMobile: window.matchMedia('(max-width: 768px)').matches,
        isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0
    };

    // ===================================
    // LENIS SMOOTH SCROLL
    // ===================================
    let lenis = null;

    function initLenis() {
        if (CONFIG.reducedMotion) return;

        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            infinite: false,
        });

        // Sync Lenis with GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        // Handle anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    lenis.scrollTo(target, {
                        offset: -80,
                        duration: 1.5
                    });

                    // Close mobile menu if open
                    closeMobileMenu();
                }
            });
        });
    }

    // ===================================
    // TEXT SPLIT UTILITY
    // ===================================
    function splitTextIntoLines(element) {
        const text = element.textContent.trim();
        const words = text.split(/\s+/);

        if (words.length === 0 || (words.length === 1 && words[0] === '')) {
            return [];
        }

        // Clear element
        element.innerHTML = '';

        // Create a temporary container to measure
        const tempContainer = document.createElement('div');
        tempContainer.style.cssText = `
            position: absolute;
            visibility: hidden;
            white-space: nowrap;
            font: ${getComputedStyle(element).font};
            letter-spacing: ${getComputedStyle(element).letterSpacing};
        `;
        document.body.appendChild(tempContainer);

        const containerWidth = element.offsetWidth;
        const lines = [];
        let currentLine = [];

        words.forEach(word => {
            currentLine.push(word);
            tempContainer.textContent = currentLine.join(' ');

            if (tempContainer.offsetWidth > containerWidth && currentLine.length > 1) {
                currentLine.pop();
                lines.push(currentLine.join(' '));
                currentLine = [word];
            }
        });

        if (currentLine.length > 0) {
            lines.push(currentLine.join(' '));
        }

        document.body.removeChild(tempContainer);

        // Create line elements
        lines.forEach(lineText => {
            const lineWrapper = document.createElement('span');
            lineWrapper.className = 'line';

            const lineInner = document.createElement('span');
            lineInner.className = 'line-inner';
            lineInner.textContent = lineText;

            lineWrapper.appendChild(lineInner);
            element.appendChild(lineWrapper);
        });

        return element.querySelectorAll('.line-inner');
    }

    // Split text into words for word-by-word animation
    function splitTextIntoWords(element) {
        const text = element.textContent.trim();
        const words = text.split(/\s+/);

        if (words.length === 0 || (words.length === 1 && words[0] === '')) {
            return [];
        }

        // Clear element
        element.innerHTML = '';

        // Create word elements
        words.forEach((word, index) => {
            const wordWrapper = document.createElement('span');
            wordWrapper.className = 'word';

            const wordInner = document.createElement('span');
            wordInner.className = 'word-inner';
            wordInner.textContent = word;

            wordWrapper.appendChild(wordInner);
            element.appendChild(wordWrapper);

            // Add space after word (except last)
            if (index < words.length - 1) {
                element.appendChild(document.createTextNode(' '));
            }
        });

        return element.querySelectorAll('.word-inner');
    }

    // ===================================
    // GSAP ANIMATIONS
    // ===================================
    function initGSAPAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        if (CONFIG.reducedMotion) {
            // Show all elements without animation
            gsap.set('.js-fade-up, .js-timeline-item, .prestation-image-wrapper, .prestation-link', {
                opacity: 1,
                y: 0,
                x: 0
            });
            gsap.set('.js-line-draw', { scaleX: 1 });
            gsap.set('.hero-content', { opacity: 1 });
            return;
        }

        // Hero Animations
        initHeroAnimations();

        // Parallax Effect
        initParallax();

        // Text Split Animations
        initTextSplitAnimations();

        // Scroll Triggered Animations
        initScrollAnimations();

        // Prestation Lines Animation
        initPrestationLines();

        // Timeline specific animation
        initTimelineAnimation();

        // Counter Animation
        initCounterAnimation();
    }

    function initHeroAnimations() {
        const heroTl = gsap.timeline({
            defaults: { ease: 'power2.out' }
        });

        // Split and animate hero texts
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroTagline = document.querySelector('.hero-tagline');

        // Make hero content visible
        heroTl.set('.hero-content', { opacity: 1 }, 0);

        // Animate subtitle with word stagger
        if (heroSubtitle) {
            const subtitleWords = splitTextIntoWords(heroSubtitle);
            if (subtitleWords.length > 0) {
                heroTl.fromTo(subtitleWords,
                    { y: '110%' },
                    {
                        y: '0%',
                        duration: 1.2,
                        stagger: 0.05,
                        ease: 'power2.out'
                    },
                    0.3
                );
            }
        }

        // Line draw
        heroTl.fromTo('.hero-line',
            { scaleX: 0 },
            { scaleX: 1, duration: 1, ease: 'power2.inOut' },
            '-=0.5'
        );

        // Animate tagline with line animation
        if (heroTagline) {
            const taglineLines = splitTextIntoLines(heroTagline);
            if (taglineLines.length > 0) {
                heroTl.fromTo(taglineLines,
                    { y: '110%' },
                    {
                        y: '0%',
                        duration: 1,
                        stagger: 0.12,
                        ease: 'power2.out'
                    },
                    '-=0.6'
                );
            }
        }

        // CTA Button
        heroTl.fromTo('.hero .btn',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
            '-=0.4'
        );

        // Scroll indicator
        heroTl.fromTo('.scroll-indicator',
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
            '-=0.3'
        );
    }

    // ===================================
    // PARALLAX EFFECT
    // ===================================
    function initParallax() {
        const parallaxContainers = document.querySelectorAll('.js-parallax-container');

        parallaxContainers.forEach(container => {
            const image = container.querySelector('.js-parallax-image');
            if (!image) return;

            // Set initial position
            gsap.set(image, { yPercent: -10 });

            gsap.to(image, {
                yPercent: 10,
                ease: 'none',
                scrollTrigger: {
                    trigger: container,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        });
    }

    // ===================================
    // TEXT SPLIT ANIMATIONS
    // ===================================
    function initTextSplitAnimations() {
        // Section titles with word-by-word reveal (stagger from first to last word)
        gsap.utils.toArray('.section-title').forEach(title => {
            if (title.closest('.hero')) return; // Skip hero

            const words = splitTextIntoWords(title);
            if (words.length === 0) return;

            gsap.fromTo(words,
                { y: '110%' },
                {
                    y: '0%',
                    duration: 1,
                    stagger: 0.06,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: title,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // Section intros and quote with line-by-line reveal
        gsap.utils.toArray('.section-intro, .quote-text').forEach(text => {
            const lines = splitTextIntoLines(text);
            if (lines.length === 0) return;

            gsap.fromTo(lines,
                { y: '110%' },
                {
                    y: '0%',
                    duration: 1,
                    stagger: 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: text,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // Apropos text paragraphs
        gsap.utils.toArray('.apropos-text p').forEach(text => {
            const lines = splitTextIntoLines(text);
            if (lines.length === 0) return;

            gsap.fromTo(lines,
                { y: '110%' },
                {
                    y: '0%',
                    duration: 1,
                    stagger: 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: text,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // Also animate js-text-reveal elements
        gsap.utils.toArray('.js-text-reveal').forEach(el => {
            const words = splitTextIntoWords(el);
            if (words.length === 0) return;

            gsap.fromTo(words,
                { y: '110%' },
                {
                    y: '0%',
                    duration: 0.8,
                    stagger: 0.04,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });
    }

    function initScrollAnimations() {
        // Section labels with word animation
        gsap.utils.toArray('.section-label').forEach(label => {
            const words = splitTextIntoWords(label);
            if (words.length === 0) return;

            gsap.fromTo(words,
                { y: '110%' },
                {
                    y: '0%',
                    duration: 0.9,
                    stagger: 0.04,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: label,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // Fade up elements
        gsap.utils.toArray('.js-fade-up').forEach(el => {
            if (el.closest('.hero')) return; // Hero elements handled separately

            gsap.fromTo(el,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // Prestations reveal - animate the whole item container
        const prestationItems = document.querySelectorAll('.js-prestation-reveal');
        prestationItems.forEach((item) => {
            // Animate the image wrapper
            const imageWrapper = item.querySelector('.prestation-image-wrapper');
            if (imageWrapper) {
                gsap.fromTo(imageWrapper,
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1.2,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: item,
                            start: 'top 80%',
                            toggleActions: 'play none none none'
                        }
                    }
                );
            }

            // Animate the prestation title with word stagger
            const title = item.querySelector('.prestation-title');
            if (title) {
                const words = splitTextIntoWords(title);
                if (words.length > 0) {
                    gsap.fromTo(words,
                        { y: '110%' },
                        {
                            y: '0%',
                            duration: 1,
                            stagger: 0.05,
                            ease: 'power2.out',
                            scrollTrigger: {
                                trigger: item,
                                start: 'top 75%',
                                toggleActions: 'play none none none'
                            }
                        }
                    );
                }
            }

            // Animate the prestation text with line stagger
            const text = item.querySelector('.prestation-text');
            if (text) {
                const lines = splitTextIntoLines(text);
                if (lines.length > 0) {
                    gsap.fromTo(lines,
                        { y: '110%' },
                        {
                            y: '0%',
                            duration: 1,
                            stagger: 0.08,
                            ease: 'power2.out',
                            scrollTrigger: {
                                trigger: item,
                                start: 'top 72%',
                                toggleActions: 'play none none none'
                            }
                        }
                    );
                }
            }

            // Animate CTA link
            const link = item.querySelector('.prestation-link');
            if (link) {
                gsap.fromTo(link,
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.9,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: item,
                            start: 'top 70%',
                            toggleActions: 'play none none none'
                        }
                    }
                );
            }
        });
    }

    // ===================================
    // PRESTATION LINES ANIMATION
    // ===================================
    function initPrestationLines() {
        const prestationItems = document.querySelectorAll('.prestation-item');

        prestationItems.forEach((item, index) => {
            // Skip the last item (no line after it)
            if (index === prestationItems.length - 1) return;

            const isOdd = index % 2 === 0; // First item is index 0, so odd in visual terms
            const originX = isOdd ? 'left' : 'right';

            // Create the line element dynamically
            const line = document.createElement('div');
            line.className = 'prestation-line';
            line.style.cssText = `
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 1px;
                background-color: var(--rose-poudre);
                transform-origin: ${originX} center;
                transform: scaleX(0);
            `;
            item.appendChild(line);

            // Animate the line
            gsap.to(line, {
                scaleX: 1,
                duration: 1,
                ease: 'power2.inOut',
                scrollTrigger: {
                    trigger: item,
                    start: 'bottom 70%',
                    toggleActions: 'play none none none'
                }
            });
        });
    }

    function initTimelineAnimation() {
        const timeline = document.querySelector('.timeline');
        if (!timeline) return;

        const timelineLine = timeline.querySelector('.timeline-line');
        const items = timeline.querySelectorAll('.js-timeline-item');

        // Create progress bar for the timeline line
        const progressBar = document.createElement('div');
        progressBar.className = 'timeline-progress';
        progressBar.style.cssText = `
            position: absolute;
            left: 0;
            top: 0;
            width: 2px;
            height: 0%;
            background-color: var(--rose-blush);
            z-index: 1;
        `;

        if (window.innerWidth >= 768) {
            progressBar.style.left = '50%';
            progressBar.style.transform = 'translateX(-50%)';
        }

        timelineLine.appendChild(progressBar);

        gsap.to(progressBar, {
            height: '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: timeline,
                start: 'top 60%',
                end: 'bottom 40%',
                scrub: 1
            }
        });

        // Timeline items
        items.forEach((item, index) => {
            const isEven = index % 2 === 1;
            const xStart = CONFIG.isMobile ? -30 : (isEven ? 30 : -30);

            // Animate the whole item
            gsap.fromTo(item,
                {
                    opacity: 0,
                    x: xStart
                },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    }
                }
            );

            // Animate the timeline title with word stagger
            const title = item.querySelector('.timeline-title');
            if (title) {
                const words = splitTextIntoWords(title);
                if (words.length > 0) {
                    gsap.fromTo(words,
                        { y: '110%' },
                        {
                            y: '0%',
                            duration: 0.6,
                            stagger: 0.04,
                            ease: 'power2.out',
                            scrollTrigger: {
                                trigger: item,
                                start: 'top 75%',
                                toggleActions: 'play none none none'
                            }
                        }
                    );
                }
            }

            // Animate timeline text with line reveal
            const text = item.querySelector('.timeline-text');
            if (text) {
                const lines = splitTextIntoLines(text);
                if (lines.length > 0) {
                    gsap.fromTo(lines,
                        { y: '110%' },
                        {
                            y: '0%',
                            duration: 0.6,
                            stagger: 0.06,
                            ease: 'power2.out',
                            scrollTrigger: {
                                trigger: item,
                                start: 'top 70%',
                                toggleActions: 'play none none none'
                            }
                        }
                    );
                }
            }
        });
    }

    function initCounterAnimation() {
        const counter = document.querySelector('.js-counter');
        if (!counter) return;

        const target = parseInt(counter.dataset.target, 10);
        const numberEl = counter.querySelector('.experience-number');

        if (!numberEl) return;

        gsap.fromTo(numberEl,
            { innerText: 0 },
            {
                innerText: target,
                duration: 2,
                ease: 'power2.out',
                snap: { innerText: 1 },
                scrollTrigger: {
                    trigger: counter,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }

    // ===================================
    // CUSTOM CURSOR
    // ===================================
    function initCustomCursor() {
        if (CONFIG.isTouch || CONFIG.reducedMotion) return;

        const cursor = document.querySelector('.cursor');
        if (!cursor) return;

        const cursorDot = cursor.querySelector('.cursor-dot');
        const cursorOutline = cursor.querySelector('.cursor-outline');

        let mouseX = 0;
        let mouseY = 0;
        let dotX = 0;
        let dotY = 0;
        let outlineX = 0;
        let outlineY = 0;

        // Track mouse position
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Animate cursor
        function animateCursor() {
            // Dot follows immediately
            dotX += (mouseX - dotX) * 0.5;
            dotY += (mouseY - dotY) * 0.5;
            cursorDot.style.left = `${dotX}px`;
            cursorDot.style.top = `${dotY}px`;

            // Outline follows with delay
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover states
        const hoverElements = document.querySelectorAll('a, button, .js-magnetic');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
        });

        // Click states
        document.addEventListener('mousedown', () => cursor.classList.add('cursor-active'));
        document.addEventListener('mouseup', () => cursor.classList.remove('cursor-active'));

        // Hide when leaving window
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
        });
    }

    // ===================================
    // MAGNETIC BUTTONS
    // ===================================
    function initMagneticButtons() {
        if (CONFIG.isTouch || CONFIG.reducedMotion) return;

        const magneticElements = document.querySelectorAll('.js-magnetic');
        const strength = 0.3;

        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const deltaX = (e.clientX - centerX) * strength;
                const deltaY = (e.clientY - centerY) * strength;

                gsap.to(el, {
                    x: deltaX,
                    y: deltaY,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            el.addEventListener('mouseleave', () => {
                gsap.to(el, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.5)'
                });
            });
        });
    }

    // ===================================
    // HEADER - White background after 100vh
    // ===================================
    function initHeader() {
        const header = document.querySelector('.header');
        const hero = document.querySelector('.hero');
        if (!header || !hero) return;

        // Get hero height (100vh)
        const heroHeight = hero.offsetHeight;

        function updateHeader() {
            const currentScroll = window.scrollY || document.documentElement.scrollTop;

            // Add/remove scrolled class after 100vh
            if (currentScroll > heroHeight) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Use Lenis scroll event if available, otherwise use native
        if (lenis) {
            lenis.on('scroll', updateHeader);
        } else {
            window.addEventListener('scroll', updateHeader, { passive: true });
        }

        // Initial check
        updateHeader();

        // Update on resize
        window.addEventListener('resize', () => {
            // Recalculate hero height on resize
            updateHeader();
        });
    }

    // ===================================
    // MOBILE MENU
    // ===================================
    let isMobileMenuOpen = false;

    function initMobileMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileLinks = document.querySelectorAll('.mobile-nav-link');

        if (!menuToggle || !mobileMenu) return;

        menuToggle.addEventListener('click', () => {
            isMobileMenuOpen = !isMobileMenuOpen;

            menuToggle.classList.toggle('active', isMobileMenuOpen);
            menuToggle.setAttribute('aria-expanded', isMobileMenuOpen);

            mobileMenu.classList.toggle('active', isMobileMenuOpen);
            mobileMenu.setAttribute('aria-hidden', !isMobileMenuOpen);

            // Prevent body scroll when menu is open
            if (lenis) {
                isMobileMenuOpen ? lenis.stop() : lenis.start();
            } else {
                document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
            }
        });

        // Close menu when clicking a link
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMobileMenuOpen) {
                closeMobileMenu();
            }
        });
    }

    function closeMobileMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');

        if (!menuToggle || !mobileMenu) return;

        isMobileMenuOpen = false;
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', false);
        mobileMenu.classList.remove('active');
        mobileMenu.setAttribute('aria-hidden', true);

        if (lenis) {
            lenis.start();
        } else {
            document.body.style.overflow = '';
        }
    }

    // ===================================
    // FOOTER YEAR
    // ===================================
    function initFooterYear() {
        const yearEl = document.getElementById('current-year');
        if (yearEl) {
            yearEl.textContent = new Date().getFullYear();
        }
    }

    // ===================================
    // INITIALIZATION
    // ===================================
    function init() {
        // Wait for DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', onDOMReady);
        } else {
            onDOMReady();
        }
    }

    function onDOMReady() {
        // Initialize all modules
        initLenis();
        initGSAPAnimations();
        initCustomCursor();
        initMagneticButtons();
        initHeader();
        initMobileMenu();
        initFooterYear();

        // Log initialization
        console.log('Christèle Guignand - Landing Page initialized');

        if (CONFIG.reducedMotion) {
            console.log('Reduced motion preference detected - animations disabled');
        }
    }

    // Handle resize for mobile detection update
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            CONFIG.isMobile = window.matchMedia('(max-width: 768px)').matches;
        }, 250);
    });

    // Start
    init();

})();
