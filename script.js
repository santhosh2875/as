/* =====================================================
   A.S. BABU SAH — GOD LEVEL PARALLAX JAVASCRIPT
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);

  // ===== PRELOADER =====
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    if (preloader) {
      setTimeout(() => {
        requestAnimationFrame(() => {
          preloader.classList.add('loaded');
        });
        setTimeout(() => {
          if (typeof gsap !== 'undefined') initAllParallax();
          initScrollReveal();
          initCounters();
        }, 600);
      }, 1500); // Reduced from 2200ms
    } else {
      // If no preloader exists (on subpages), initialize immediately
      if (typeof gsap !== 'undefined') initAllParallax();
      initScrollReveal();
      initCounters();
    }
  });

  // ===== NAVBAR =====
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateScrollProgress();
    updateActiveNav();
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded',
      hamburger.classList.contains('active') ? 'true' : 'false'
    );
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.classList.remove('menu-open');
    });
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }
  });

  // Prevent background scroll when menu is open
  hamburger.addEventListener('click', () => {
    if (navLinks.classList.contains('open')) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  });

  // ===== SCROLL PROGRESS BAR =====
  function updateScrollProgress() {
    const scrollProgress = document.getElementById('scroll-progress');
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
  }

  // ===== ACTIVE NAV LINK =====
  function updateActiveNav() {
    // Only update hash-based active links on home page
    if (document.body.dataset.page !== 'home') return;

    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.querySelectorAll('a').forEach(a => {
          const href = a.getAttribute('href');
          if (href === `index.html#${id}` || href === `#${id}`) {
            // Find all current active hash links and remove
            navLinks.querySelectorAll('a[href*="#"]').forEach(h => h.classList.remove('active'));
            a.classList.add('active');
          }
        });
      }
    });
  }

  // ===== GOLD PARTICLES IN HERO =====
  function createParticles() {
    const container = document.getElementById('hero-particles');
    if (!container) return;

    const isMobile = window.innerWidth <= 768;
    const particleCount = isMobile ? 20 : 40;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('gold-particle');

      const x = Math.random() * 100;
      const size = Math.random() * 4 + 2;
      const duration = Math.random() * 8 + 6;
      const delay = Math.random() * 10;

      particle.style.left = x + '%';
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.setProperty('--dur', duration + 's');
      particle.style.setProperty('--delay', delay + 's');
      particle.style.boxShadow = `0 0 ${size * 2}px rgba(201, 168, 76, 0.4)`;

      container.appendChild(particle);
    }
  }
  createParticles();

  // ===== MAIN PARALLAX EFFECTS (GSAP ScrollTrigger) =====
  function initAllParallax() {
    // --- Hero multi-layer parallax ---
    const heroDeep = document.querySelector('.parallax-layer--deep img');
    const heroMid = document.querySelector('.parallax-layer--mid img');
    const heroFront = document.querySelector('.parallax-layer--front img');

    if (heroDeep) {
      gsap.to(heroDeep, {
        y: '30%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.parallax-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        }
      });
    }

    if (heroMid) {
      gsap.to(heroMid, {
        y: '20%',
        scale: 1.2,
        ease: 'none',
        scrollTrigger: {
          trigger: '.parallax-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.3,
        }
      });
    }

    if (heroFront) {
      gsap.to(heroFront, {
        y: '15%',
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: {
          trigger: '.parallax-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.2,
        }
      });
    }

    // Hero content parallax (moves up faster creating depth)
    const heroContent = document.querySelector('.parallax-hero-content');
    if (heroContent) {
      gsap.to(heroContent, {
        y: '-25%',
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.parallax-hero',
          start: 'top top',
          end: '70% top',
          scrub: 0.5,
        }
      });
    }

    // --- Section background parallax ---
    document.querySelectorAll('.parallax-bg img').forEach(bg => {
      gsap.fromTo(bg, {
        y: '-15%'
      }, {
        y: '15%',
        ease: 'none',
        scrollTrigger: {
          trigger: bg.closest('.parallax-section') || bg.closest('.parallax-divider'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        }
      });
    });

    // --- Parallax divider images ---
    document.querySelectorAll('.parallax-divider-bg img').forEach(bg => {
      gsap.fromTo(bg, {
        y: '-10%',
        scale: 1.1,
      }, {
        y: '10%',
        scale: 1.15,
        ease: 'none',
        scrollTrigger: {
          trigger: bg.closest('.parallax-divider'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });
    });

    // --- Divider quote text float-in ---
    document.querySelectorAll('.divider-quote').forEach(quote => {
      gsap.fromTo(quote, {
        opacity: 0,
        y: 40,
        scale: 0.95,
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: quote.closest('.parallax-divider'),
          start: 'top 70%',
          end: 'center center',
          scrub: 0.5,
        }
      });
    });

    // --- Heritage image parallax float ---
    const heritageImg = document.querySelector('.heritage-img-frame');
    if (heritageImg) {
      gsap.fromTo(heritageImg, {
        y: 40,
      }, {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: '.heritage-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });
    }

    // --- Collection cards stagger parallax ---
    const cards = document.querySelectorAll('.collection-card');
    cards.forEach((card, i) => {
      const yOffset = (i % 2 === 0) ? 30 : -30;
      gsap.fromTo(card, {
        y: yOffset,
      }, {
        y: -yOffset,
        ease: 'none',
        scrollTrigger: {
          trigger: '.collections-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        }
      });
    });

    // --- USP cards micro-parallax ---
    document.querySelectorAll('.usp-card').forEach((card, i) => {
      gsap.fromTo(card, {
        y: 20 + (i * 5),
      }, {
        y: -(10 + (i * 3)),
        ease: 'none',
        scrollTrigger: {
          trigger: '.usp-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        }
      });
    });

    // --- Director cards subtle float ---
    document.querySelectorAll('.director-card').forEach((card, i) => {
      gsap.fromTo(card, {
        y: 15,
      }, {
        y: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: '.management-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });
    });

    // --- Contact form wrapper parallax ---
    const contactForm = document.querySelector('.contact-form-wrapper');
    if (contactForm) {
      gsap.fromTo(contactForm, {
        y: 30,
      }, {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.contact-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });
    }

    // --- Floating year badge advanced float ---
    const yearBadge = document.querySelector('.heritage-year-badge');
    if (yearBadge) {
      gsap.fromTo(yearBadge, {
        rotation: -5,
        y: 20,
      }, {
        rotation: 5,
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: '.heritage-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });
    }
  }

  // ===== SCROLL REVEAL =====
  function initScrollReveal() {
    const reveals = document.querySelectorAll('[data-scroll-reveal]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add stagger delay for sibling elements
          const parent = entry.target.parentElement;
          const siblings = parent.querySelectorAll('[data-scroll-reveal]');
          let index = Array.from(siblings).indexOf(entry.target);

          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, index * 100);

          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px',
    });

    reveals.forEach(el => observer.observe(el));
  }

  // ===== COUNTER ANIMATION =====
  function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetAttr = el.getAttribute('data-target');
          if (!targetAttr) return; // Fix Issue 16: NaN guard
          
          const target = parseInt(targetAttr);
          const suffix = el.getAttribute('data-suffix') || '';
          let current = 0;
          const increment = target / 60;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = Math.floor(current) + suffix;
          }, 30);
          counterObserver.unobserve(el);
        }
      });
    }, {
      threshold: 0.5,
    });

    counters.forEach(c => counterObserver.observe(c));
  }

  // ===== CONTACT FORM =====
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('form-name');
      const phoneInput = document.getElementById('form-phone');
      const nameError = document.getElementById('error-name');
      const phoneError = document.getElementById('error-phone');
      
      const name = nameInput.value.trim();
      const phone = phoneInput.value.trim();
      let isValid = true;

      // Reset errors
      nameInput.classList.remove('input-error');
      phoneInput.classList.remove('input-error');
      if (nameError) nameError.style.display = 'none';
      if (phoneError) phoneError.style.display = 'none';

      if (!name) {
        isValid = false;
        nameInput.classList.add('input-error');
        if (nameError) nameError.style.display = 'block';
      }
      
      if (!phone) {
        isValid = false;
        phoneInput.classList.add('input-error');
        if (phoneError) phoneError.style.display = 'block';
      }

      if (!isValid) return;

      const formSuccess = document.getElementById('form-success');
      formSuccess.style.display = 'block';
      contactForm.reset();

      // Hide success after 5s
      setTimeout(() => {
        formSuccess.style.display = 'none';
      }, 5000);
    });
  }

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href*="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // Only intercept if it's a pure anchor on the current page OR it targets the current page
      const isHome = document.body.dataset.page === 'home';
      if (href.startsWith('#') || (href.startsWith('index.html#') && isHome)) {
        const targetId = href.substring(href.indexOf('#'));
        const target = document.querySelector(targetId);
        
        if (target) {
          e.preventDefault();
          const offset = navbar.offsetHeight;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  // ===== MOUSE-DRIVEN PARALLAX ON HERO (Desktop only) =====
  const heroSection = document.querySelector('.parallax-hero');
  if (heroSection && window.innerWidth > 1024) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const deepLayer = document.querySelector('.parallax-layer--deep img');
      const midLayer = document.querySelector('.parallax-layer--mid img');
      const particles = document.getElementById('hero-particles');

      if (deepLayer) {
        gsap.to(deepLayer, {
          x: x * -20,
          y: y * -20,
          duration: 1.5,
          ease: 'power2.out',
        });
      }

      if (midLayer) {
        gsap.to(midLayer, {
          x: x * -35,
          y: y * -35,
          duration: 1.2,
          ease: 'power2.out',
        });
      }

      if (particles) {
        gsap.to(particles, {
          x: x * 15,
          y: y * 15,
          duration: 1,
          ease: 'power2.out',
        });
      }
    });
  }

  // ===== TILT EFFECT ON COLLECTION CARDS =====
  document.querySelectorAll('.card-inner').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 768) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (y - 0.5) * -10;
      const rotateY = (x - 0.5) * 10;

      card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
    });
  });
  
  // Reset tilt on desktop-to-mobile resize
  window.addEventListener('resize', () => {
    if (window.innerWidth < 768) {
      document.querySelectorAll('.card-inner').forEach(card => {
        card.style.transform = '';
      });
    }
  });

  // ===== MAGNETIC BUTTON EFFECT =====
  document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 768) return;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translateY(-3px) translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
});
