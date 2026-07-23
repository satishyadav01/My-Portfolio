/* ==========================================================================
   SATISH CHANDRA YADAV — PORTFOLIO
   Vanilla JS: loader, cursor, scroll fx, reveal, counters, tilt, forms
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------
     LOADER
  ------------------------------------------------------------------ */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 900);
  });
  // fallback in case 'load' already fired
  setTimeout(() => loader && loader.classList.add('hidden'), 2500);

  /* ------------------------------------------------------------------
     CUSTOM CURSOR
  ------------------------------------------------------------------ */
  const cursorDot = document.getElementById('cursorDot');
  const cursorGlow = document.getElementById('cursorGlow');
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  if (!isTouch && cursorDot && cursorGlow) {
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
    });

    function animateGlow() {
      glowX += (mouseX - glowX) * 0.15;
      glowY += (mouseY - glowY) * 0.15;
      cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%,-50%)`;
      requestAnimationFrame(animateGlow);
    }
    animateGlow();

    const hoverables = document.querySelectorAll('a, button, .tilt-el, input, textarea');
    hoverables.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('hover');
        cursorGlow.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hover');
        cursorGlow.classList.remove('hover');
      });
    });
  }

  /* ------------------------------------------------------------------
     SCROLL PROGRESS BAR
  ------------------------------------------------------------------ */
  const scrollProgress = document.getElementById('scrollProgress');
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = pct + '%';
  }

  /* ------------------------------------------------------------------
     HEADER SCROLL STATE + ACTIVE LINK
  ------------------------------------------------------------------ */
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('main section[id], .hero[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTop = document.getElementById('backToTop');

  function updateHeaderAndActiveLink() {
    header.classList.toggle('scrolled', window.scrollY > 40);
    backToTop.classList.toggle('show', window.scrollY > 500);

    let currentId = '';
    sections.forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 140 && rect.bottom >= 140) currentId = sec.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.dataset.section === currentId);
    });
  }

  window.addEventListener('scroll', () => {
    updateScrollProgress();
    updateHeaderAndActiveLink();
  }, { passive: true });

  updateScrollProgress();
  updateHeaderAndActiveLink();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ------------------------------------------------------------------
     MOBILE MENU
  ------------------------------------------------------------------ */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    const isActive = hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active', isActive);
    hamburger.setAttribute('aria-expanded', isActive);
  });

  document.querySelectorAll('.mobile-link').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ------------------------------------------------------------------
     TYPING EFFECT (Hero subtitle)
  ------------------------------------------------------------------ */
  const typingEl = document.getElementById('typingText');
  const roles = [
    'Frontend Developer',
    'Python Developer',
  ];
  let roleIndex = 0, charIndex = 0, typingDeleting = false;

  function typeLoop() {
    const current = roles[roleIndex];

    if (!typingDeleting) {
      charIndex++;
      typingEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        typingDeleting = true;
        setTimeout(typeLoop, 1600);
        return;
      }
    } else {
      charIndex--;
      typingEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        typingDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, typingDeleting ? 35 : 65);
  }
  typeLoop();

  /* ------------------------------------------------------------------
     PARTICLE BACKGROUND
  ------------------------------------------------------------------ */
  const particleContainer = document.getElementById('particles');
  const particleCount = window.innerWidth < 700 ? 18 : 36;
  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.bottom = -20 + 'px';
    p.style.animationDuration = (10 + Math.random() * 14) + 's';
    p.style.animationDelay = (Math.random() * 12) + 's';
    p.style.opacity = (0.2 + Math.random() * 0.5).toFixed(2);
    particleContainer.appendChild(p);
  }

  /* ------------------------------------------------------------------
     REVEAL ON SCROLL (IntersectionObserver)
  ------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal-up');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ------------------------------------------------------------------
     COUNTER ANIMATION (About stats)
  ------------------------------------------------------------------ */
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1400;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach((c) => counterObserver.observe(c));

  /* ------------------------------------------------------------------
     SKILL BAR ANIMATION
  ------------------------------------------------------------------ */
  const skillRows = document.querySelectorAll('.skill-row');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const row = entry.target;
      const level = row.dataset.level;
      const fill = row.querySelector('.skill-fill');
      requestAnimationFrame(() => { fill.style.width = level + '%'; });
      skillObserver.unobserve(row);
    });
  }, { threshold: 0.4 });
  skillRows.forEach((row) => skillObserver.observe(row));

  /* ------------------------------------------------------------------
     PROJECT FILTERING
  ------------------------------------------------------------------ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      projectCards.forEach((card) => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hide', !match);
      });
    });
  });

  /* ------------------------------------------------------------------
     TILT EFFECT (mouse-follow 3D tilt)
  ------------------------------------------------------------------ */
  const tiltEls = document.querySelectorAll('.tilt-el');
  if (!isTouch) {
    tiltEls.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(0)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
      });
    });
  }

  /* ------------------------------------------------------------------
     MAGNETIC BUTTONS
  ------------------------------------------------------------------ */
  const magneticEls = document.querySelectorAll('.magnetic');
  if (!isTouch) {
    magneticEls.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0,0)';
      });
    });
  }

  /* ------------------------------------------------------------------
     RIPPLE CLICK EFFECT
  ------------------------------------------------------------------ */
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ------------------------------------------------------------------
     TESTIMONIAL SLIDER
  ------------------------------------------------------------------ */
  const track = document.getElementById('testimonialTrack');
  const dotsWrap = document.getElementById('testimonialDots');
  const slides = track ? track.children.length : 0;
  let activeSlide = 0;

  if (track && slides > 0) {
    for (let i = 0; i < slides; i++) {
      const dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsWrap.appendChild(dot);
    }

    function goToSlide(i) {
      activeSlide = i;
      track.style.transform = `translateX(-${i * 100}%)`;
      [...dotsWrap.children].forEach((d, idx) => d.classList.toggle('active', idx === i));
    }

    setInterval(() => {
      activeSlide = (activeSlide + 1) % slides;
      goToSlide(activeSlide);
    }, 5000);
  }

  /* ------------------------------------------------------------------
     CONTACT FORM VALIDATION
  ------------------------------------------------------------------ */
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  function validateField(field) {
    const group = field.closest('.input-group');
    let valid = field.value.trim().length > 0;

    if (field.type === 'email' && valid) {
      valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
    }
    group.classList.toggle('error', !valid);
    return valid;
  }

  if (form) {
    form.querySelectorAll('input, textarea').forEach((field) => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.closest('.input-group').classList.contains('error')) validateField(field);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fields = form.querySelectorAll('input, textarea');
      let allValid = true;
      fields.forEach((f) => { if (!validateField(f)) allValid = false; });

      if (allValid) {
        formSuccess.classList.add('show');
        form.reset();
        setTimeout(() => formSuccess.classList.remove('show'), 5000);
      } else {
        formSuccess.classList.remove('show');
      }
    });
  }

  /* ------------------------------------------------------------------
     FOOTER YEAR
  ------------------------------------------------------------------ */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});