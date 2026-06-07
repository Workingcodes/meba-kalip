// ── Navbar scroll ──
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Mobile hamburger (a11y: aria-expanded + aria-label) ──
const hamburger = document.querySelector('.nav-hamburger');
const mobileMenu = document.querySelector('.nav-mobile');
if (hamburger) {
  hamburger.setAttribute('aria-label', 'Menüyü aç');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-controls', 'navMobile');
}
hamburger?.addEventListener('click', () => {
  const isOpen = hamburger.classList.contains('active');
  mobileMenu?.classList.toggle('open');
  hamburger.classList.toggle('active');
  hamburger.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
  hamburger.setAttribute('aria-label', isOpen ? 'Menüyü aç' : 'Menüyü kapat');
  const spans = hamburger.querySelectorAll('span');
  if (!isOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});
mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  if (hamburger) {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Menüyü aç');
  }
}));

// ── Scroll animations ──
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in, .slide-left, .slide-right, .slide-up').forEach(el => obs.observe(el));

// ── Counter animation ──
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const start = performance.now();
  const duration = 1600;
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(ease * target) + suffix;
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const cObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); cObs.unobserve(e.target); } });
}, { threshold: 0.5 });
document.querySelectorAll('[data-target]').forEach(el => cObs.observe(el));

// ── Active nav ──
(function() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a, .nav-mobile a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
})();

// ── FAQ accordion (a11y: aria-expanded) ──
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.setAttribute('aria-expanded', 'false');
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling || btn.closest('.faq-item')?.querySelector('.faq-a');
    const isOpen = btn.classList.contains('open');
    document.querySelectorAll('.faq-q').forEach(b => {
      b.classList.remove('open');
      b.setAttribute('aria-expanded', 'false');
      const a = b.nextElementSibling || b.closest('.faq-item')?.querySelector('.faq-a');
      a?.classList.remove('open');
    });
    if (!isOpen) {
      btn.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      answer?.classList.add('open');
    }
  });
});

// ── Lightbox (a11y: focus trap + focus restore) ──
let _lbPrevFocus = null;

function openLb(src, caption) {
  const lb = document.getElementById('lb');
  if (!lb) return;
  _lbPrevFocus = document.activeElement;
  lb.querySelector('img').src = src;
  lb.querySelector('img').alt = caption || '';
  const cap = lb.querySelector('.lb-caption');
  if (cap) cap.textContent = caption || '';
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
  lb.setAttribute('aria-hidden', 'false');
  // Focus the close button
  const closeBtn = lb.querySelector('.lb-x');
  if (closeBtn) setTimeout(() => closeBtn.focus(), 50);
}

function closeLb() {
  const lb = document.getElementById('lb');
  if (!lb) return;
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  // Restore focus
  if (_lbPrevFocus) { _lbPrevFocus.focus(); _lbPrevFocus = null; }
}

// Focus trap inside lightbox
document.getElementById('lb')?.addEventListener('keydown', function(e) {
  if (e.key === 'Tab') {
    const focusable = this.querySelectorAll('button, [tabindex="0"]');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
      e.preventDefault();
      (e.shiftKey ? last : first)?.focus();
    }
  }
});

document.getElementById('lb')?.addEventListener('click', function(e) {
  if (e.target === this || e.target.classList.contains('lb-x')) closeLb();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });
