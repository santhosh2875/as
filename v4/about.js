/**
 * About page — navbar, scroll progress, reveal, counters, GSAP parallax.
 * Standalone so the page works when served from /v4/ (no dependency on ../script.js).
 */
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const ticker = document.getElementById('ticker');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const scrollProgressEl = document.getElementById('scroll-progress');

  function updateScrollProgress() {
    if (!scrollProgressEl) return;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    scrollProgressEl.style.width = `${pct}%`;
  }

  function onScroll() {
    const scrollY = window.pageYOffset;
    if (navbar) {
      navbar.classList.toggle('scrolled', scrollY > 80);
    }
    if (navbar && ticker) {
      if (scrollY > 40) {
        ticker.style.transform = 'translateY(-100%)';
        ticker.style.opacity = '0';
        navbar.style.top = '0';
      } else {
        ticker.style.transform = 'translateY(0)';
        ticker.style.opacity = '1';
        navbar.style.top = '';
      }
    }
    updateScrollProgress();
  }

  if (ticker) {
    ticker.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  function initScrollReveal() {
    const reveals = document.querySelectorAll('[data-scroll-reveal]');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const parent = entry.target.parentElement;
          const siblings = parent ? parent.querySelectorAll('[data-scroll-reveal]') : [];
          const index = Array.from(siblings).indexOf(entry.target);
          setTimeout(() => entry.target.classList.add('revealed'), Math.max(0, index) * 100);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    reveals.forEach(el => observer.observe(el));
  }

  function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    const counterObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const targetAttr = el.getAttribute('data-target');
          if (!targetAttr) return;
          const target = parseInt(targetAttr, 10);
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
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(c => counterObserver.observe(c));
  }

  function initAboutParallax() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('.parallax-bg img').forEach(bg => {
      const trigger = bg.closest('.parallax-section') || bg.closest('.parallax-divider');
      if (!trigger) return;
      gsap.fromTo(
        bg,
        { y: '-15%' },
        {
          y: '15%',
          ease: 'none',
          scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
        }
      );
    });

    document.querySelectorAll('.parallax-divider-bg img').forEach(bg => {
      const trigger = bg.closest('.parallax-divider');
      if (!trigger) return;
      gsap.fromTo(
        bg,
        { y: '-10%', scale: 1.1 },
        {
          y: '10%',
          scale: 1.15,
          ease: 'none',
          scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: 1 },
        }
      );
    });

    document.querySelectorAll('.divider-quote').forEach(quote => {
      const trigger = quote.closest('.parallax-divider');
      if (!trigger) return;
      gsap.fromTo(
        quote,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: 'power2.out',
          scrollTrigger: { trigger, start: 'top 70%', end: 'center center', scrub: 0.5 },
        }
      );
    });

    const heritageImg = document.querySelector('.heritage-img-frame');
    if (heritageImg) {
      gsap.fromTo(
        heritageImg,
        { y: 40 },
        {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: '.heritage-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );
    }

    document.querySelectorAll('.usp-card').forEach((card, i) => {
      gsap.fromTo(
        card,
        { y: 20 + i * 5 },
        {
          y: -(10 + i * 3),
          ease: 'none',
          scrollTrigger: {
            trigger: '.usp-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        }
      );
    });

    document.querySelectorAll('.director-card').forEach(card => {
      gsap.fromTo(
        card,
        { y: 15 },
        {
          y: -15,
          ease: 'none',
          scrollTrigger: {
            trigger: '.management-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );
    });

    const yearBadge = document.querySelector('.heritage-year-badge');
    if (yearBadge) {
      gsap.fromTo(
        yearBadge,
        { rotation: -5, y: 20 },
        {
          rotation: 5,
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: '.heritage-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );
    }
  }

  window.addEventListener('load', () => {
    initScrollReveal();
    initCounters();
    initAboutParallax();
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });
});
