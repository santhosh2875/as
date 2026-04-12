/* ============================================
   A.S. BABU SAH — V3 GOD LEVEL Scripts
   Robust: Content always visible, GSAP enhances
   ============================================ */

'use strict';

// ============================================
// BACKUP-V1 HERO — floating particles + Three.js silk plane
// ============================================
function initHeroParticles() {
  const container = document.getElementById('particles-container');
  if (!container) return;
  const count = 40;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size = Math.random() * 3 + 1;
    const left = Math.random() * 100;
    const delay = Math.random() * 10;
    const dur = Math.random() * 15 + 8;
    const opacity = Math.random() * 0.6 + 0.1;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: 0;
      animation-delay: ${delay}s;
      animation-duration: ${dur}s;
      opacity: ${opacity};
      border-radius: 50%;
    `;
    container.appendChild(p);
  }
}

function initThreeJSHero() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  script.onload = () => {
    try {
      setupThreeScene(canvas);
    } catch (e) {
      console.warn('Three.js scene setup failed:', e);
    }
  };
  script.onerror = () => console.warn('Three.js CDN load failed. Hero stays static.');
  document.head.appendChild(script);
}

function setupThreeScene(canvas) {
  const THREE = window.THREE;
  if (!THREE) return;

  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const wireOpacity = coarsePointer ? 0.11 : 0.07;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 5);

  function sizeRenderer() {
    const W = canvas.offsetWidth || window.innerWidth;
    const H = canvas.offsetHeight || window.innerHeight;
    if (W < 1 || H < 1) return;
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    renderer.setSize(W, H);
  }
  sizeRenderer();

  const geometry = new THREE.PlaneGeometry(14, 8, 80, 50);
  const posAttr = geometry.attributes.position;
  const originalY = new Float32Array(posAttr.count);
  for (let i = 0; i < posAttr.count; i++) {
    originalY[i] = posAttr.getY(i);
  }

  const material = new THREE.MeshBasicMaterial({
    color: 0xc9a84c,
    wireframe: true,
    opacity: wireOpacity,
    transparent: true,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.z = -1;
  scene.add(mesh);

  let mouseX = 0;
  let mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  const heroForTouch = canvas.closest('.hero');
  if (heroForTouch) {
    heroForTouch.addEventListener('touchmove', (e) => {
      const t = e.touches[0];
      if (!t) return;
      mouseX = (t.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (t.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
    heroForTouch.addEventListener('touchend', () => {
      mouseX = 0;
      mouseY = 0;
    }, { passive: true });
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(sizeRenderer);
  });

  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.012;

    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = originalY[i];
      const wave =
        Math.sin(x * 0.5 + time) * 0.3 +
        Math.sin(y * 0.8 + time * 1.3) * 0.2 +
        Math.sin((x + y) * 0.4 + time * 0.7) * 0.15 +
        mouseX * 0.1 * Math.sin(x * 0.5) +
        mouseY * 0.08 * Math.cos(y * 0.5);
      posAttr.setZ(i, wave);
    }
    posAttr.needsUpdate = true;

    mesh.rotation.z = Math.sin(time * 0.15) * 0.02;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', sizeRenderer, { passive: true });
}

function initGoldTrail() {
  const hero = document.getElementById('home');
  if (!hero) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const style = document.createElement('style');
  style.textContent = `
    .gold-trail {
      position: fixed;
      pointer-events: none;
      z-index: 9997;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(201,168,76,0.8) 0%, transparent 70%);
      animation: trailFade 0.8s ease forwards;
    }
    @keyframes trailFade {
      0%   { opacity: 0.8; transform: scale(1); }
      100% { opacity: 0; transform: scale(2.5); }
    }
  `;
  document.head.appendChild(style);

  let lastTrail = 0;
  hero.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastTrail < 60) return;
    lastTrail = now;

    const trail = document.createElement('div');
    trail.className = 'gold-trail';
    const size = Math.random() * 8 + 4;
    trail.style.cssText = `
      left: ${e.clientX - size / 2}px;
      top: ${e.clientY - size / 2}px;
      width: ${size}px;
      height: ${size}px;
    `;
    document.body.appendChild(trail);
    setTimeout(() => trail.remove(), 800);
  }, { passive: true });
}

let backupHeroBooted = false;
function bootBackupHero() {
  if (backupHeroBooted) return;
  if (window.matchMedia('(min-width: 1025px)').matches) return;
  if (!document.getElementById('particles-container')) return;
  backupHeroBooted = true;
  initHeroParticles();
  initThreeJSHero();
}

let desktopHeroParticlesDone = false;
function createDesktopParallaxParticles() {
  if (desktopHeroParticlesDone) return;
  if (window.matchMedia('(max-width: 1024px)').matches) return;
  const container = document.getElementById('hero-particles');
  if (!container) return;
  desktopHeroParticlesDone = true;
  const particleCount = 40;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('gold-particle');
    const x = Math.random() * 100;
    const size = Math.random() * 4 + 2;
    const duration = Math.random() * 8 + 6;
    const delay = Math.random() * 10;
    particle.style.left = `${x}%`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.setProperty('--dur', `${duration}s`);
    particle.style.setProperty('--delay', `${delay}s`);
    particle.style.boxShadow = `0 0 ${size * 2}px rgba(201, 168, 76, 0.4)`;
    container.appendChild(particle);
  }
}

function initDesktopParallaxHeroGsap() {
  const root = document.querySelector('.parallax-hero--v3-desktop');
  if (!root || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  if (window.matchMedia('(max-width: 1024px)').matches) return;

  const heroDeep = root.querySelector('.parallax-layer--deep img');
  const heroMid = root.querySelector('.parallax-layer--mid img');
  const heroFront = root.querySelector('.parallax-layer--front img');
  const heroContent = root.querySelector('.parallax-hero-content');

  if (heroDeep) {
    gsap.to(heroDeep, {
      y: '30%',
      ease: 'none',
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
      },
    });
  }
  if (heroMid) {
    gsap.to(heroMid, {
      y: '20%',
      scale: 1.2,
      ease: 'none',
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.3,
      },
    });
  }
  if (heroFront) {
    gsap.to(heroFront, {
      y: '15%',
      opacity: 0.3,
      ease: 'none',
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.2,
      },
    });
  }
  if (heroContent) {
    gsap.to(heroContent, {
      y: '-25%',
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: '70% top',
        scrub: 0.5,
      },
    });
  }
}

function initDesktopParallaxMouse() {
  const heroSection = document.querySelector('.parallax-hero--v3-desktop');
  if (!heroSection) return;

  heroSection.addEventListener('mousemove', (e) => {
    if (window.innerWidth <= 1024 || typeof gsap === 'undefined') return;
    const rect = heroSection.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    const deepLayer = heroSection.querySelector('.parallax-layer--deep img');
    const midLayer = heroSection.querySelector('.parallax-layer--mid img');
    const particles = document.getElementById('hero-particles');

    if (deepLayer) {
      gsap.to(deepLayer, { x: x * -20, y: y * -20, duration: 1.5, ease: 'power2.out' });
    }
    if (midLayer) {
      gsap.to(midLayer, { x: x * -35, y: y * -35, duration: 1.2, ease: 'power2.out' });
    }
    if (particles) {
      gsap.to(particles, { x: x * 15, y: y * 15, duration: 1, ease: 'power2.out' });
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('.hero-bg-video').forEach((v) => {
    v.setAttribute('playsinline', '');
    const backdrop = v.closest('.hero-video-backdrop');
    function handOffToStaticHero() {
      if (!backdrop || backdrop.classList.contains('hero-video-ended')) return;
      backdrop.classList.add('hero-video-ended');
      try {
        v.pause();
      } catch (e) { /* ignore */ }
    }
    v.addEventListener('ended', handOffToStaticHero);
    v.addEventListener('error', handOffToStaticHero);
    const p = v.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  });

  bootBackupHero();

  initGoldTrail();
  createDesktopParallaxParticles();
  initDesktopParallaxMouse();

  // ============================================
  // 2. GOLDEN PARTICLES
  // ============================================
  const canvas = document.getElementById('particlesCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 35;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class GoldenParticle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.fadeDir = Math.random() > 0.5 ? 1 : -1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity += this.fadeDir * 0.003;
        if (this.opacity <= 0.05 || this.opacity >= 0.5) this.fadeDir *= -1;
        if (this.x < -10 || this.x > canvas.width + 10 || this.y < -10 || this.y > canvas.height + 10) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
        ctx.fill();
      }
    }
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new GoldenParticle());
    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // ============================================
  // 3. CUSTOM CURSOR (desktop only)
  // ============================================
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  if (window.innerWidth > 1024 && cursorDot && cursorRing) {
    document.addEventListener('mousemove', e => {
      cursorDot.style.left = (e.clientX - 3) + 'px';
      cursorDot.style.top = (e.clientY - 3) + 'px';
      cursorRing.style.left = e.clientX + 'px';
      cursorRing.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('a, button, .collection-card, .video-card, .insta-item').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
    });
  }

  // ============================================
  // 4. NAVBAR & TICKER
  // ============================================
  const navbar = document.getElementById('navbar');
  const ticker = document.getElementById('ticker');

  if (navbar && ticker) {
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;
      navbar.classList.toggle('scrolled', scrollY > 80);
      if (scrollY > 40) {
        ticker.style.transform = 'translateY(-100%)';
        ticker.style.opacity = '0';
        navbar.style.top = '0';
      } else {
        ticker.style.transform = 'translateY(0)';
        ticker.style.opacity = '1';
        navbar.style.top = '';
      }
    }, { passive: true });
    ticker.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
  }

  // ============================================
  // 5. MOBILE NAVIGATION
  // ============================================
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

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
  }

  // ============================================
  // 6. SCROLL REVEAL (CSS-based, always works)
  // ============================================
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  // ============================================
  // 7. GSAP SCROLL ANIMATIONS (Enhancement only)
  // ============================================
  let scrollEnhancementsStarted = false;

  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // Parallax backgrounds
    document.querySelectorAll('[data-speed]').forEach(bg => {
      const speed = parseFloat(bg.dataset.speed);
      gsap.to(bg, {
        yPercent: speed * 25,
        ease: 'none',
        scrollTrigger: {
          trigger: bg.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5
        }
      });
    });

    initDesktopParallaxHeroGsap();
  }

  function runScrollEnhancements() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!scrollEnhancementsStarted) {
          scrollEnhancementsStarted = true;
          initGSAP();
        }
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      });
    });
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(runScrollEnhancements);
  });

  window.addEventListener('load', () => {
    setTimeout(runScrollEnhancements, 50);
  });

  // ============================================
  // 8. TESTIMONIALS CAROUSEL
  // ============================================
  const track = document.querySelector('.testimonials-track');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');

  if (track && prevBtn && nextBtn) {
    let currentSlide = 0;
    const totalSlides = 3;

    function goToSlide(index) {
      currentSlide = index;
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
    }

    prevBtn.addEventListener('click', () => goToSlide(currentSlide === 0 ? totalSlides - 1 : currentSlide - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlide === totalSlides - 1 ? 0 : currentSlide + 1));
    dots.forEach(dot => dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.index))));

    let autoSlide = setInterval(() => goToSlide(currentSlide === totalSlides - 1 ? 0 : currentSlide + 1), 7000);
    const carousel = document.getElementById('testimonialCarousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', () => clearInterval(autoSlide));
      carousel.addEventListener('mouseleave', () => {
        autoSlide = setInterval(() => goToSlide(currentSlide === totalSlides - 1 ? 0 : currentSlide + 1), 7000);
      });
    }
  }

  // ============================================
  // 9. FAQ ACCORDION
  // ============================================
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (btn) {
      btn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    }
  });

  // ============================================
  // 10. SMOOTH SCROLL
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight + 20 : 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ============================================
  // 11. TILT EFFECT ON COLLECTION CARDS
  // ============================================
  if (window.innerWidth > 1024) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotateX = (0.5 - y) * 5;
        const rotateY = (x - 0.5) * 5;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        card.style.transition = 'transform 0.1s ease-out';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        card.style.transition = 'transform 0.5s ease-out';
      });
    });
  }

  // ============================================
  // 12. DARK / LIGHT THEME (reference palette, localStorage)
  // ============================================
  const THEME_KEY = 'asbabusah-v3-theme';
  const themeToggle = document.getElementById('themeToggle');
  const metaTheme = document.getElementById('meta-theme-color');

  function syncThemeUi() {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      themeToggle.setAttribute('title', dark ? 'Light mode' : 'Dark mode');
    }
    if (metaTheme) {
      metaTheme.setAttribute('content', dark ? '#0a0708' : '#C9922A');
    }
  }

  if (themeToggle) {
    syncThemeUi();
    themeToggle.addEventListener('click', () => {
      const dark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (dark) {
        document.documentElement.removeAttribute('data-theme');
        try {
          localStorage.setItem(THEME_KEY, 'light');
        } catch (e) { /* ignore */ }
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        try {
          localStorage.setItem(THEME_KEY, 'dark');
        } catch (e) { /* ignore */ }
      }
      syncThemeUi();
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    });
  }

});
