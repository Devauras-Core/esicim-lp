/* ============================================================
   ESICIM Academy — Landing Page JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll behavior ──────────────────────────────────
  const navbar = document.querySelector('.navbar');
  const backToTop = document.querySelector('.back-to-top');

  function onScroll() {
    const scrolled = window.scrollY > 100;
    navbar.classList.toggle('scrolled', scrolled);
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Active nav link highlight ──────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a[href^="#"]');

  function highlightNav() {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) current = section.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', highlightNav, { passive: true });

  // ── Mobile menu ─────────────────────────────────────────────
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileOverlay = document.querySelector('.mobile-overlay');

  function toggleMobile() {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    mobileOverlay.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  }
  function closeMobile() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', toggleMobile);
  mobileOverlay.addEventListener('click', closeMobile);
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobile));

  // ── Scroll reveal (Intersection Observer) ───────────────────
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  // ── Count-up animation for stats ────────────────────────────
  const statValues = document.querySelectorAll('.stat-value');

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 1800;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(target * ease);
      el.textContent = prefix + current + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statValues.forEach(el => statsObserver.observe(el));

  // ── Timeline animation ──────────────────────────────────────
  const timeline = document.querySelector('.timeline');
  if (timeline) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          timeline.classList.add('animated');
          timelineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    timelineObserver.observe(timeline);
  }

  // ── Programme card modals ───────────────────────────────────
  const modalOverlay = document.getElementById('programmeModal');
  const modalContent = modalOverlay.querySelector('.modal-body');
  const modalClose = modalOverlay.querySelector('.modal-close');

  const programmeData = {
    informatique: {
      title: 'Pôle Informatique & Cybersécurité',
      programs: [
        { name: 'BTS SIO (SISR & SLAM)', duration: '2 ans', level: 'Bac+2', debouches: 'Administrateur réseau, Développeur web, Technicien support' },
        { name: 'Bachelor Administrateur d\'infrastructures sécurisées', duration: '1 an', level: 'Bac+3', debouches: 'Administrateur systèmes, Responsable sécurité IT' },
        { name: 'Bachelor Concepteur développeur d\'application', duration: '1 an', level: 'Bac+3', debouches: 'Développeur full-stack, Chef de projet digital' }
      ],
      certifications: ['Cisco CCNA', 'Microsoft Azure', 'Power BI'],
      tarif: 'Formation en alternance : prise en charge par l\'OPCO. Formation initiale : nous consulter.'
    },
    commerce: {
      title: 'Pôle Commerce & Management',
      programs: [
        { name: 'BTS NDRC', duration: '2 ans', level: 'Bac+2', debouches: 'Chargé de clientèle, Commercial terrain, Conseiller commercial' },
        { name: 'BTS MCO', duration: '2 ans', level: 'Bac+2', debouches: 'Manager de rayon, Responsable de boutique, Chef des ventes' },
        { name: 'BTS GPME', duration: '2 ans', level: 'Bac+2', debouches: 'Assistant de gestion, Office manager, Attaché de direction' },
        { name: 'Bachelor Responsable Développement Commercial', duration: '1 an', level: 'Bac+3', debouches: 'Responsable commercial, Business developer' }
      ],
      certifications: ['Alternance possible', 'Stage en entreprise'],
      tarif: 'Formation en alternance : prise en charge par l\'OPCO. Formation initiale : nous consulter.'
    },
    comptabilite: {
      title: 'Pôle Comptabilité & Gestion',
      programs: [
        { name: 'BTS Comptabilité et Gestion', duration: '2 ans', level: 'Bac+2', debouches: 'Comptable, Assistant comptable, Gestionnaire de paie' }
      ],
      certifications: ['Diplôme d\'État', 'Examen préparé'],
      tarif: 'Formation en alternance : prise en charge par l\'OPCO. Formation initiale : nous consulter.'
    }
  };

  function openModal(pole) {
    const data = programmeData[pole];
    if (!data) return;

    let html = `<h3>${data.title}</h3>`;
    data.programs.forEach(p => {
      html += `
        <div class="modal-section">
          <h4>${p.name} — ${p.level} (${p.duration})</h4>
          <p><strong>Débouchés :</strong> ${p.debouches}</p>
        </div>`;
    });
    html += `
      <div class="modal-section">
        <h4>Certifications</h4>
        <ul>${data.certifications.map(c => `<li>${c}</li>`).join('')}</ul>
      </div>
      <div class="modal-section">
        <h4>Tarifs & Financement</h4>
        <p>${data.tarif}</p>
      </div>`;

    modalContent.innerHTML = html;
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.programme-card').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.pole));
  });
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  // ── Hero lead-capture form ──────────────────────────────────
  const heroForm = document.getElementById('heroForm');
  const heroSubmitBtn = heroForm.querySelector('.hf-submit');

  heroForm.addEventListener('submit', e => {
    e.preventDefault();
    const required = heroForm.querySelectorAll('[required]');
    let valid = true;
    required.forEach(input => {
      if (!input.value.trim()) {
        valid = false;
        input.style.borderColor = '#DC2626';
        input.addEventListener('input', () => { input.style.borderColor = ''; }, { once: true });
        input.addEventListener('change', () => { input.style.borderColor = ''; }, { once: true });
      }
    });
    if (!valid) { showToast('Veuillez remplir tous les champs obligatoires.', 'error'); return; }

    heroSubmitBtn.classList.add('loading');
    heroSubmitBtn.disabled = true;

    setTimeout(() => {
      heroSubmitBtn.classList.remove('loading');
      heroSubmitBtn.disabled = false;
      heroForm.reset();
      showToast('Brochure envoyée ! Un conseiller vous contactera sous 48h.', 'success');
    }, 1500);
  });


  // ── Toast ───────────────────────────────────────────────────
  const toast = document.getElementById('toast');

  function showToast(message, type = '') {
    toast.textContent = message;
    toast.className = 'toast ' + type;
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  // ── Back to top ─────────────────────────────────────────────
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Smooth scroll for anchor links ──────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 8;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── Subtle parallax on hero decorative elements ─────────────
  const heroDeco = document.querySelector('.hero-deco');
  const heroVisual = document.querySelector('.hero-visual');

  if (heroDeco && heroVisual) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroDeco.style.transform = `translateY(${y * 0.08}px)`;
      }
    }, { passive: true });
  }

  // ── Timeline steps stagger reveal ──────────────────────────
  const timelineSteps = document.querySelectorAll('.timeline-step');
  if (timelineSteps.length) {
    const stepObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const steps = entry.target.parentElement.querySelectorAll('.timeline-step');
          steps.forEach((step, i) => {
            step.style.opacity = '0';
            step.style.transform = 'translateY(24px)';
            step.style.transition = `opacity 0.5s ease ${i * 0.15}s, transform 0.5s ease ${i * 0.15}s`;
            requestAnimationFrame(() => {
              step.style.opacity = '1';
              step.style.transform = 'translateY(0)';
            });
          });
          stepObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    stepObserver.observe(timelineSteps[0]);
  }

  // ── Programme card tilt micro-interaction ───────────────────
  document.querySelectorAll('.programme-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-10px) perspective(600px) rotateX(${y * -3}deg) rotateY(${x * 3}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

});
