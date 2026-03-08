document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       Initialize Plugins
       ========================================================================== */
    gsap.registerPlugin(ScrollTrigger);

    /* ==========================================================================
       Lenis Smooth Scrolling
       ========================================================================== */
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    /* ==========================================================================
       Creative Preloader Sequence
       ========================================================================== */
    const loaderWrapper = document.querySelector('.loader-wrapper');

    if (loaderWrapper) {
        // Page has a loader — run the full logo reveal sequence
        const tlLoader = gsap.timeline({
            onComplete: () => {
                document.body.classList.remove('loading');
                loaderWrapper.style.display = 'none';
                initCreativeAnimations();
            }
        });

        // Option B: SVG Paw Draw → Logo Reveal
        tlLoader.to('.loader-paw-svg', {
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out'
        })
            .to('.paw-stroke', {
                strokeDashoffset: 0,
                duration: 1.2,
                stagger: 0.1,
                ease: 'power2.inOut'
            })
            .to('.paw-stroke', {
                fill: 'rgba(243, 156, 18, 0.6)',
                stroke: 'rgba(243, 156, 18, 0.9)',
                duration: 0.4,
                ease: 'power2.out'
            })
            .to('.loader-logo', {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'power3.out'
            }, '-=0.2')
            .to('.loader-tagline', {
                opacity: 1,
                duration: 0.4,
                ease: 'power2.out'
            }, '-=0.2')
            .to({}, { duration: 0.4 })
            .to('.loader-content', {
                opacity: 0,
                scale: 0.9,
                duration: 0.4,
                ease: 'power2.in'
            })
            .to('.loader-panel', {
                scaleY: 0,
                duration: 0.8,
                ease: 'power4.inOut'
            })
            .from('.title-line', {
                y: 50,
                opacity: 0,
                rotation: 2,
                duration: 1,
                stagger: 0.1,
                ease: 'power3.out'
            }, "-=0.3")
            .from('.floating-layer', {
                opacity: 0,
                duration: 1,
                ease: 'power2.out'
            }, "-=0.5")
            .from('.header', {
                y: -100,
                duration: 1,
                ease: 'power3.out',
                clearProps: "all"
            }, "-=0.8")
            .to('.hero-trust-badges', {
                opacity: 1,
                duration: 1,
                ease: 'power2.out'
            }, "-=0.5");
    } else {
        // No loader on this page — initialize immediately
        document.body.classList.remove('loading');
        initCreativeAnimations();
    }

    /* ==========================================================================
       Custom Magnetic/Hover Cursor
       ========================================================================== */
    const cursor = document.querySelector('.cursor');
    const cursorGlow = document.querySelector('.cursor-glow');

    if (window.matchMedia("(pointer: fine)").matches) {

        let mouseX = 0, mouseY = 0;
        let dotX = 0, dotY = 0, glowX = 0, glowY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const animateCursor = () => {
            // Dot snaps fast
            dotX += (mouseX - dotX) * 0.55;
            dotY += (mouseY - dotY) * 0.55;
            cursor.style.transform = `translate(${dotX}px, ${dotY}px)`;
            // Glow lags behind
            glowX += (mouseX - glowX) * 0.1;
            glowY += (mouseY - glowY) * 0.1;
            if (cursorGlow) cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px)`;
            requestAnimationFrame(animateCursor);
        };
        requestAnimationFrame(animateCursor);

        // Click pulse
        document.addEventListener('mousedown', () => {
            cursor.classList.add('clicking');
            if (cursorGlow) cursorGlow.classList.add('clicking');
        });
        document.addEventListener('mouseup', () => {
            cursor.classList.remove('clicking');
            if (cursorGlow) cursorGlow.classList.remove('clicking');
        });

        const clearCursor = () => {
            const states = ['link-hover', 'btn-hover', 'cart-hover', 'on-input', 'text-invert'];
            cursor.classList.remove(...states);
            if (cursorGlow) {
                cursorGlow.classList.remove(...states);
                cursorGlow.dataset.text = '';
            }
        };

        // Add-to-cart → cart pill "ADD +"
        document.querySelectorAll('.add-to-cart-sq, .add-to-bag-btn').forEach(el => {
            el.addEventListener('mouseenter', () => {
                clearCursor();
                cursor.classList.add('cart-hover');
                if (cursorGlow) {
                    cursorGlow.classList.add('cart-hover');
                    cursorGlow.classList.add('text-invert');
                }
            });
            el.addEventListener('mouseleave', clearCursor);
        });

        // Buttons → label pill (context text from data-label or default)
        document.querySelectorAll('.btn, .cart-btn, [data-magnetic]').forEach(el => {
            el.addEventListener('mouseenter', () => {
                clearCursor();
                cursor.classList.add('btn-hover');
                if (cursorGlow) {
                    cursorGlow.classList.add('btn-hover');
                    if (el.classList.contains('btn-primary')) cursorGlow.classList.add('text-invert');
                    cursorGlow.dataset.text = el.dataset.cursorLabel || 'SHOP →';
                }
            });
            el.addEventListener('mouseleave', clearCursor);
        });

        // Links → expand glow
        document.querySelectorAll('a:not(.btn, .cart-btn, [data-magnetic])').forEach(el => {
            el.addEventListener('mouseenter', () => {
                clearCursor();
                cursor.classList.add('link-hover');
                if (cursorGlow) cursorGlow.classList.add('link-hover');
            });
            el.addEventListener('mouseleave', clearCursor);
        });

        // Inputs → hide both
        document.querySelectorAll('input, textarea, select').forEach(el => {
            el.addEventListener('mouseenter', () => {
                clearCursor();
                if (cursor) cursor.classList.add('on-input');
                if (cursorGlow) cursorGlow.classList.add('on-input');
            });
            el.addEventListener('mouseleave', clearCursor);
        });

        // Detect elements that should invert the cursor (green backgrounds)
        document.querySelectorAll('[data-cursor-invert="true"]').forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (cursor) cursor.classList.add('cursor-invert');
                if (cursorGlow) cursorGlow.classList.add('cursor-invert');
            });
            el.addEventListener('mouseleave', () => {
                if (cursor) cursor.classList.remove('cursor-invert');
                if (cursorGlow) cursorGlow.classList.remove('cursor-invert');
            });
        });

    } else {
        if (cursor) cursor.style.display = 'none';
        if (cursorGlow) cursorGlow.style.display = 'none';
        document.body.style.cursor = 'auto';
    }

    /* ==========================================================================
       Creative Global Animations (Post-Load)
       ========================================================================== */
    function initCreativeAnimations() {

        // 1. Navbar Scroll Effect (Glassmorphism on scroll)
        const header = document.querySelector('.header');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // 2. Initial Scroll Check for Header
        window.dispatchEvent(new Event('scroll'));

        // Reduced GSAP Hero Parallax (Relying mostly on pure CSS keyframes now for smoothness)
        // Removed heavy mousemove logic per user request to simplify and improve the feel.

        // 3. Staggered Entrance for Creative Categories
        gsap.from('.creative-cat-card', {
            scrollTrigger: {
                trigger: '.cat-grid-creative',
                start: 'top 80%',
            },
            y: 100,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out",
            clearProps: "all" // Fixes the opacity/transform getting stuck
        });

        // 4. Staggered Entrance for Trending Carousel Items
        gsap.from('.ecommerce-card', {
            scrollTrigger: {
                trigger: '.trending-products',
                start: 'top 85%', // trigger a bit earlier
            },
            y: 50,
            opacity: 0,
            scale: 0.9,
            duration: 0.6,
            stagger: 0.15,
            ease: "power3.out",
            clearProps: "all" // Fixes the opacity/transform getting stuck
        });

        // 5. Smooth Scroll links
        document.querySelectorAll('a.explore-scroll').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                if (lenis) lenis.scrollTo(this.getAttribute('href'), { offset: -100 });
            });
        });
    }

    /* ==========================================================================
       Mobile Menu Logic
       ========================================================================== */
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const menuBtns = document.querySelectorAll('.menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');

    function openMobileMenu(e) {
        if (e) e.preventDefault();
        if (mobileMenu && mobileOverlay) {
            mobileMenu.classList.add('open');
            mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (lenis) lenis.stop();
        }
    }

    function closeMobileMenu() {
        if (mobileMenu && mobileOverlay) {
            mobileMenu.classList.remove('open');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
            if (lenis) lenis.start();
        }
    }

    menuBtns.forEach(btn => btn.addEventListener('click', openMobileMenu));
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMobileMenu);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

    /* ==========================================================================
       Cart Drawer & Toast Logic
       ========================================================================== */
    let cartItems = window.cartItems = [];
    const cartOverlay = document.getElementById('cart-overlay');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartDrawerItemsContainer = document.getElementById('cart-drawer-items');
    const cartSubtotalPrice = document.getElementById('cart-subtotal-price');
    const openCartBtns = document.querySelectorAll('#open-cart-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const badgeCounters = document.querySelectorAll('.cart-count');
    const toastContainer = document.getElementById('toast-container');

    // Open/Close
    function openCart(e) {
        if (e) e.preventDefault();
        if (cartOverlay && cartDrawer) {
            cartOverlay.classList.add('active');
            cartDrawer.classList.add('open');
            document.body.style.overflow = 'hidden';
            if (lenis) lenis.stop();
        }
    }
    function closeCart() {
        if (cartOverlay && cartDrawer) {
            cartOverlay.classList.remove('active');
            cartDrawer.classList.remove('open');
            document.body.style.overflow = '';
            if (lenis) lenis.start();
        }
    }
    openCartBtns.forEach(btn => btn.addEventListener('click', openCart));
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    // Toast
    window.showToast = function showToast(message) {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<div class="toast-icon"><i class="fas fa-check"></i></div> <span>${message}</span>`;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }
    const showToast = window.showToast;

    window.renderCart = function renderCart() {

        if (!cartDrawerItemsContainer) return;

        let subtotal = 0;
        cartDrawerItemsContainer.innerHTML = ''; // Clear

        if (cartItems.length === 0) {
            cartDrawerItemsContainer.innerHTML = `
                <div class="cart-empty-state">
                    <i class="fas fa-shopping-basket" style="font-size: 3rem; opacity: 0.2; margin-bottom: 1rem; display: block;"></i>
                    Your cart is empty.
                </div>
            `;
        } else {
            cartItems.forEach((item, index) => {
                subtotal += (item.price * item.quantity);
                cartDrawerItemsContainer.innerHTML += `
                    <div class="cart-drawer-item">
                        <img src="${item.img}" alt="${item.title}" class="cart-item-img">
                        <div class="cart-item-info">
                            <h4 class="cart-item-title">${item.title}</h4>
                            <div class="cart-item-price">৳${item.price.toFixed(2)}</div>
                            <div class="cart-item-controls">
                                <div class="qty-selector">
                                    <button onclick="window.updateCartQuantity(${index}, -1)">-</button>
                                    <span>${item.quantity}</span>
                                    <button onclick="window.updateCartQuantity(${index}, 1)">+</button>
                                </div>
                                <button class="cart-item-remove" onclick="window.removeCartItem(${index})">Remove</button>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        if (cartSubtotalPrice) cartSubtotalPrice.innerText = `৳${subtotal.toFixed(2)}`;

        // Update badges
        let totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
        badgeCounters.forEach(badge => {
            badge.innerText = totalItems;
            gsap.fromTo(badge, { scale: 1.3 }, { scale: 1, duration: 0.5, ease: 'power3.out' });
        });
    }

    // Global remove/update functions
    window.removeCartItem = function (index) {
        cartItems.splice(index, 1);
        window.renderCart();
    };

    window.updateCartQuantity = function (index, delta) {
        if (cartItems[index].quantity + delta > 0) {
            cartItems[index].quantity += delta;
        } else {
            cartItems.splice(index, 1);
        }
        window.renderCart();
    };

    // Add to Cart — event delegation so it works inside <a> card wrappers
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.add-to-cart-sq, .add-to-bag-btn');
        if (!btn) return;

        e.preventDefault();
        e.stopImmediatePropagation();

        // Visual feedback
        gsap.fromTo(btn, { scale: 0.9 }, { scale: 1, duration: 0.35, ease: 'power3.out' });

        // Extract product data from the card
        const card = btn.closest('.ecommerce-card, .product-content');
        let title = 'Premium Pet Product';
        let price = 85.00;
        let img = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=200&auto=format&fit=crop';

        if (card) {
            const titleEl = card.querySelector('.product-title') || document.querySelector('.prod-title');
            if (titleEl) title = titleEl.innerText.trim();

            const imgEl = card.querySelector('img.main-prod-img') || card.querySelector('img');
            if (imgEl) img = imgEl.src;

            // Get price — skip the strikethrough del price
            const priceEl = card.querySelector('.price');
            if (priceEl) {
                const raw = (priceEl.lastChild || priceEl).textContent.replace(/[^\d.]/g, '');
                if (!isNaN(parseFloat(raw))) price = parseFloat(raw);
            }
        }

        const existingItem = cartItems.find(item => item.title === title);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({ title, price, img, quantity: 1 });
        }

        window.renderCart();
        showToast('🛒 Added to Cart!');
    }, true); // capture phase — fires before the <a> link navigation

    window.renderCart();

    /* ==========================================================================
       Scroll-to-Top Button Logic
       ========================================================================== */
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.id = 'scroll-top-btn';
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollTopBtn);

    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 500) {
                    scrollTopBtn.classList.add('visible');
                } else {
                    scrollTopBtn.classList.remove('visible');
                }
                isScrolling = false;
            });
            isScrolling = true;
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        if (lenis) {
            lenis.scrollTo(0, { duration: 1.5 });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // Force ScrollTrigger to recalculate after all images finish loading
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });

    // Initialize Featured Product Swiper
    if (document.querySelector('.featured-swiper')) {
        new Swiper('.featured-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            grabCursor: true, // Show grab hand on hover
            effect: 'fade', // Smooth fading instead of harsh sliding
            fadeEffect: {
                crossFade: true
            }
        });
    }

});
