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

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

// Split hero title chars for stagger reveal
const heroTitle = document.querySelector('.hero-title');
if (heroTitle && !prefersReduced) {
  let i = 0;
  const splitNode = (node) => {
    if (node.nodeType === 3) {
      const text = node.textContent;
      const frag = document.createDocumentFragment();
      for (const ch of text) {
        if (/\s/.test(ch)) {
          frag.appendChild(document.createTextNode(ch));
        } else {
          const span = document.createElement('span');
          span.className = 'split-char';
          span.textContent = ch;
          span.style.setProperty('--i', String(i++));
          frag.appendChild(span);
        }
      }
      node.replaceWith(frag);
    } else if (node.nodeType === 1 && node.tagName !== 'BR') {
      if (node.classList.contains('gradient-text')) {
        const wrap = document.createElement('span');
        wrap.className = 'split-char';
        wrap.style.setProperty('--i', String(i));
        wrap.style.display = 'inline-block';
        node.parentNode.insertBefore(wrap, node);
        wrap.appendChild(node);
        i += node.textContent.length;
        return;
      }
      [...node.childNodes].forEach(splitNode);
    }
  };
  [...heroTitle.childNodes].forEach(splitNode);
  heroTitle.classList.add('split-ready');
}

// Hero cursor spotlight + background blob parallax
const hero = document.querySelector('.hero');
if (hero && !prefersReduced && finePointer) {
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  hero.prepend(glow);
  let rafId = null;
  let nextX = 50, nextY = 40, bx = 0, by = 0;
  const apply = () => {
    rafId = null;
    hero.style.setProperty('--mx', nextX + '%');
    hero.style.setProperty('--my', nextY + '%');
    hero.style.setProperty('--blob-x', bx + 'px');
    hero.style.setProperty('--blob-y', by + 'px');
  };
  hero.addEventListener('pointermove', (e) => {
    const rect = hero.getBoundingClientRect();
    const rx = (e.clientX - rect.left) / rect.width;
    const ry = (e.clientY - rect.top) / rect.height;
    nextX = rx * 100;
    nextY = ry * 100;
    bx = (rx - 0.5) * 40;
    by = (ry - 0.5) * 30;
    hero.classList.add('is-hovering');
    if (rafId === null) rafId = requestAnimationFrame(apply);
  });
  hero.addEventListener('pointerleave', () => {
    hero.classList.remove('is-hovering');
    bx = 0; by = 0;
    if (rafId === null) rafId = requestAnimationFrame(apply);
  });
}

// Magnetic primary buttons
if (!prefersReduced && finePointer) {
  document.querySelectorAll('.btn-primary').forEach((btn) => {
    btn.classList.add('is-magnetic');
    let frame = null;
    let mx = 0, my = 0;
    const apply = () => {
      frame = null;
      btn.style.transform = `translate(${mx}px, ${my}px)`;
    };
    btn.addEventListener('pointermove', (e) => {
      const rect = btn.getBoundingClientRect();
      mx = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
      my = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
      if (frame === null) frame = requestAnimationFrame(apply);
    });
    btn.addEventListener('pointerleave', () => {
      mx = 0; my = 0;
      btn.style.transform = '';
    });
  });
}

// Scroll progress bar
if (!prefersReduced) {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);
  let pframe = null;
  const update = () => {
    pframe = null;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const r = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    bar.style.transform = `scaleX(${r})`;
  };
  window.addEventListener('scroll', () => {
    if (pframe === null) pframe = requestAnimationFrame(update);
  }, { passive: true });
  update();
}

// Header shrink on scroll
const header = document.querySelector('.site-header');
if (header) {
  const onScroll = () => {
    if (window.scrollY > 32) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Page fade transition on internal nav clicks
document.addEventListener('click', (e) => {
  const a = e.target.closest('a');
  if (!a) return;
  const href = a.getAttribute('href');
  if (!href) return;
  if (/^(#|mailto:|tel:|https?:\/\/|\/\/)/.test(href)) return;
  if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) return;
  if (a.target && a.target !== '_self') return;
  e.preventDefault();
  document.body.classList.add('is-leaving');
  setTimeout(() => { window.location.href = href; }, 220);
});

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
