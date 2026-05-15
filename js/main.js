// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const navList = document.getElementById('primary-nav');

if (toggle && navList) {
  toggle.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// Auto year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// Count-up for .stat-value[data-count]
const counters = document.querySelectorAll('.stat-value[data-count]');
if (counters.length && 'IntersectionObserver' in window) {
  const animate = (el) => {
    const end = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(eased * end) + suffix;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const co = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        co.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach((el) => co.observe(el));
}
