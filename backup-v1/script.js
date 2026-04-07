/* ============================================
   A.S. BABU SAH — script.js
   3D Effects · Animations · Interactivity
   ============================================ */

'use strict';

// ============================================
// PRELOADER
// ============================================
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  setTimeout(() => {
    preloader.classList.add('hidden');
    document.body.style.overflow = 'visible';
    // Kick off hero animations after preloader
    initHeroParticles();
    initThreeJSHero();
  }, 1200);
});

// ============================================
// NAVBAR — Scroll & Mobile Toggle
// ============================================
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks  = document.getElementById('nav-links');
  const allLinks  = navLinks ? navLinks.querySelectorAll('a') : [];

  // Scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = current;
    updateActiveNav();
  }, { passive: true });

  // Hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    allLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Active nav section tracking
  function updateActiveNav() {
    const sections = ['home', 'heritage', 'collections', 'showroom', 'contact'];
    let current = 'home';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 120) current = id;
    });
    allLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${current}`);
    });
  }
})();

// ============================================
// SMOOTH SCROLL for anchor links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ============================================
// TICKER ANIMATION (pure CSS fallback + JS)
// Inject ticker styles dynamically
// ============================================
(function initTicker() {
  // Inject ticker CSS
  const style = document.createElement('style');
  style.textContent = `
    .ticker-wrap {
      width: 100%;
      background: var(--gold);
      overflow: hidden;
      padding: 12px 0;
      position: relative;
      z-index: 10;
    }
    .ticker-track {
      display: inline-flex;
      gap: 0;
      white-space: nowrap;
      animation: tickerScroll 40s linear infinite;
    }
    .ticker-item {
      font-family: var(--font-body);
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--bg-primary);
      padding: 0 40px;
    }
    @keyframes tickerScroll {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
    .ticker-wrap:hover .ticker-track {
      animation-play-state: paused;
    }
  `;
  document.head.appendChild(style);
})();

// ============================================
// INTERSECTION OBSERVER — Scroll Reveals
// ============================================
(function initReveal() {
  const options = {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Respect transition-delay set inline
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, options);

  const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  targets.forEach((el, i) => {
    // Stagger collection cards automatically
    if (el.closest('#collections-grid')) {
      el.style.transitionDelay = `${i * 0.08}s`;
    }
    observer.observe(el);
  });
})();

// ============================================
// COUNTER ANIMATION
// ============================================
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
})();

// ============================================
// 3D TILT EFFECT on Collection Cards
// ============================================
(function initTiltEffect() {
  const cards = document.querySelectorAll('[data-tilt]');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      card.style.transition = 'transform 0.6s cubic-bezier(0.25,1,0.5,1)';
      setTimeout(() => { card.style.transition = ''; }, 600);
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s linear';
    });
  });
})();

// ============================================
// HERO FLOATING PARTICLES
// ============================================
function initHeroParticles() {
  const container = document.getElementById('particles-container');
  if (!container) return;
  const count = 40;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size  = Math.random() * 3 + 1;
    const left  = Math.random() * 100;
    const delay = Math.random() * 10;
    const dur   = Math.random() * 15 + 8;
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

// ============================================
// THREE.JS HERO — Flowing Silk Plane
// ============================================
function initThreeJSHero() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  // Dynamically load Three.js from CDN
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  script.onload = () => {
    try { setupThreeScene(canvas); }
    catch(e) { console.warn('Three.js scene setup failed:', e); }
  };
  script.onerror = () => console.warn('Three.js CDN load failed. Falling back to static hero.');
  document.head.appendChild(script);
}

function setupThreeScene(canvas) {
  const THREE = window.THREE;
  if (!THREE) return;

  const W = canvas.offsetWidth || window.innerWidth;
  const H = canvas.offsetHeight || window.innerHeight;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.setClearColor(0x000000, 0);

  // Scene & Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
  camera.position.set(0, 0, 5);

  // Geometry — a subdivided plane to wave like silk
  const geometry = new THREE.PlaneGeometry(14, 8, 80, 50);
  const posAttr = geometry.attributes.position;
  const originalY = new Float32Array(posAttr.count);
  for (let i = 0; i < posAttr.count; i++) {
    originalY[i] = posAttr.getY(i);
  }

  // Material — gold-tinted wireframe shimmer
  const material = new THREE.MeshBasicMaterial({
    color: 0xc9a84c,
    wireframe: true,
    opacity: 0.07,
    transparent: true,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.z = -1;
  scene.add(mesh);

  // Mouse-influenced wave
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  // Animate
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

  // Resize handler
  window.addEventListener('resize', () => {
    const W2 = canvas.offsetWidth;
    const H2 = canvas.offsetHeight;
    camera.aspect = W2 / H2;
    camera.updateProjectionMatrix();
    renderer.setSize(W2, H2);
  }, { passive: true });
}

// ============================================
// PARALLAX on Showroom BG
// ============================================
(function initParallax() {
  const showroomBg = document.querySelector('.showroom-bg img');
  if (!showroomBg) return;

  window.addEventListener('scroll', () => {
    const section = document.getElementById('showroom');
    if (!section) return;
    const rect = section.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
    const translateY = (progress - 0.5) * 60;
    showroomBg.style.transform = `translateY(${translateY}px) scale(1.15)`;
  }, { passive: true });
})();

// ============================================
// CONTACT FORM — WhatsApp redirect
// ============================================
(function initContactForm() {
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = (document.getElementById('form-name')?.value   || '').trim();
    const phone   = (document.getElementById('form-phone')?.value  || '').trim();
    const saree   = (document.getElementById('form-saree')?.value  || '').trim();
    const message = (document.getElementById('form-message')?.value || '').trim();

    if (!name || !phone) {
      alert('Please enter your name and phone number.');
      return;
    }

    // Compose WhatsApp message
    let waMsg = `Hello A.S. Babu Sah,\n\nI am ${name}.`;
    if (saree)   waMsg += `\n\nInterested in: ${saree}`;
    if (message) waMsg += `\n\nMessage: ${message}`;
    waMsg += `\n\nMy phone: ${phone}`;
    waMsg += `\n\n— Enquiry from website`;

    const encodedMsg = encodeURIComponent(waMsg);
    const waNumber = '919566644426';

    // Open WhatsApp
    window.open(`https://wa.me/${waNumber}?text=${encodedMsg}`, '_blank');

    // Show success
    if (success) {
      success.style.display = 'block';
      setTimeout(() => { success.style.display = 'none'; }, 6000);
    }
    form.reset();
  });
})();

// ============================================
// COLLECTION CARD — Enquiry shortcut click
// ============================================
(function initCollectionEnquiry() {
  const cards = document.querySelectorAll('.collection-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const name = card.querySelector('.collection-card-name')?.textContent;
      const contact = document.getElementById('contact');
      if (contact) {
        const offset = 80;
        const top = contact.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });

        // Pre-fill the form
        setTimeout(() => {
          const sareeInput = document.getElementById('form-saree');
          if (sareeInput && name) {
            sareeInput.value = name;
            sareeInput.focus();
          }
        }, 700);
      }
    });
  });
})();

// ============================================
// PAGE ENTER ANIMATIONS — initial stagger
// ============================================
(function initPageEnter() {
  // Animate hero badge on first render
  document.querySelectorAll('.hero-badge, .hero-description, .hero-buttons, .hero-scroll-indicator').forEach((el, i) => {
    el.style.animationDelay = `${0.5 + i * 0.15}s`;
  });
})();

// ============================================
// CURSOR GLOW (Desktop only)
// ============================================
(function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // Skip touch devices

  const style = document.createElement('style');
  style.textContent = `
    .cursor-dot {
      position: fixed;
      top: 0; left: 0;
      width: 8px; height: 8px;
      background: var(--gold);
      border-radius: 50%;
      pointer-events: none;
      z-index: 99999;
      transform: translate(-50%, -50%);
      transition: transform 0.1s ease;
      mix-blend-mode: difference;
    }
    .cursor-ring {
      position: fixed;
      top: 0; left: 0;
      width: 36px; height: 36px;
      border: 1.5px solid rgba(201,168,76,0.6);
      border-radius: 50%;
      pointer-events: none;
      z-index: 99998;
      transform: translate(-50%, -50%);
      transition: width 0.3s ease, height 0.3s ease, border-color 0.3s ease;
    }
    body:has(a:hover) .cursor-ring,
    body:has(button:hover) .cursor-ring {
      width: 56px; height: 56px;
      border-color: var(--gold);
    }
  `;
  document.head.appendChild(style);

  const dot  = document.createElement('div'); dot.className  = 'cursor-dot';
  const ring = document.createElement('div'); ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
  }, { passive: true });

  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();
})();

// ============================================
// BACK TO TOP on double-click logo
// ============================================
document.querySelector('.nav-logo')?.addEventListener('dblclick', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================
// GOLD DUST TRAIL on mouse move in hero
// ============================================
(function initGoldTrail() {
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
      left: ${e.clientX - size/2}px;
      top: ${e.clientY - size/2}px;
      width: ${size}px;
      height: ${size}px;
    `;
    document.body.appendChild(trail);
    setTimeout(() => trail.remove(), 800);
  }, { passive: true });
})();

// ============================================
// IMAGE LAZY LOAD fallback (native is set but double-ensure)
// ============================================
(function initLazyImages() {
  if ('loading' in HTMLImageElement.prototype) return;
  const imgs = document.querySelectorAll('img[loading="lazy"]');
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        imgObserver.unobserve(img);
      }
    });
  });
  imgs.forEach(img => imgObserver.observe(img));
})();

console.log(
  '%cA.S. BABU SAH\n%cKanchipuram Silk Sarees · Since 1974',
  'color: #c9a84c; font-size: 22px; font-weight: bold; font-family: Georgia, serif;',
  'color: #a89e8c; font-size: 12px; font-family: sans-serif;'
);
