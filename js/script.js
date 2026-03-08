document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       Custom Cursor Logic
       ========================================================================== */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    // Only enable custom cursor if not on a touch device
    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows exactly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Outline follows with slight delay using animate
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Add hover effects for interactive elements
        const iterables = document.querySelectorAll('a, button, .category-card, .product-card');
        
        iterables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.classList.remove('cursor-hover');
            });
        });
    } else {
        // Hide custom cursors on touch devices
        cursorDot.style.display = 'none';
        cursorOutline.style.display = 'none';
        
        // Reset cursor property for all elements
        document.body.style.cursor = 'auto';
        const resetElems = document.querySelectorAll('*');
        resetElems.forEach(el => {
            if (window.getComputedStyle(el).cursor === 'none') {
                el.style.cursor = 'pointer';
            }
        });
    }

    /* ==========================================================================
       Navbar Scroll Effect
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       Mobile Menu Toggle
       ========================================================================== */
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuOverlay.classList.add('active');
    });

    mobileMenuClose.addEventListener('click', () => {
        mobileMenuOverlay.classList.remove('active');
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuOverlay.classList.remove('active');
        });
    });

    /* ==========================================================================
       Scroll Animations (Intersection Observer)
       ========================================================================== */
    const scrollElements = document.querySelectorAll('[data-scroll]');

    const elementInView = (el, percentageScroll = 100) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= 
            ((window.innerHeight || document.documentElement.clientHeight) * (percentageScroll/100))
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('is-visible');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 85)) {
                displayScrollElement(el);
            }
        })
    }

    // Initialize
    handleScrollAnimation();

    // Listen for scroll
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });

    /* ==========================================================================
       Smooth Scrolling for Anchor Links
       ========================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        if (anchor.getAttribute('href') !== '#') {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                
                if (target) {
                    // Adjust offset for navbar
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            });
        }
    });
});
