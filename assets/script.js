// ── Navbar scroll ──
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Mobile hamburger ──
const hamburger = document.querySelector('.nav-hamburger');
const mobileMenu = document.querySelector('.nav-mobile');
hamburger?.addEventListener('click', () => {
  mobileMenu?.classList.toggle('open');
  hamburger.classList.toggle('active');
  const spans = hamburger.querySelectorAll('span');
  if (hamburger.classList.contains('active')) {
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
  hamburger?.classList.remove('active');
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
