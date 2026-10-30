// Homepage motion: reveal sections as they scroll into view and count up the stats.
// Elements start hidden only when <html> has the "js" class, so content stays
// visible if this script never runs.
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hero arrow: release a burst of bubbles and glide down to the welcome section.
  const cue = document.querySelector('.scroll-cue');
  const welcome = document.getElementById('welcome');
  const easeInOutQuart = t => (t < .5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2);

  const glideTo = (y, duration) => {
    const root = document.documentElement;
    const from = scrollY;
    const start = performance.now();
    root.style.scrollBehavior = 'auto';
    const step = now => {
      const t = Math.min((now - start) / duration, 1);
      scrollTo(0, from + (y - from) * easeInOutQuart(t));
      if (t < 1) requestAnimationFrame(step);
      else root.style.scrollBehavior = '';
    };
    requestAnimationFrame(step);
  };

  const bubbleBurst = (x, y) => {
    const layer = document.createElement('div');
    layer.className = 'bubble-burst';
    layer.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 34; i++) {
      const b = document.createElement('span');
      const size = 6 + Math.random() * 22;
      b.style.cssText = [
        `--x:${x + (Math.random() - .5) * 160}px`,
        `--y:${y + Math.random() * 40}px`,
        `--s:${size.toFixed(1)}px`,
        `--dx:${((Math.random() - .5) * 46).toFixed(1)}vw`,
        `--d:${(1.1 + Math.random() * 1.1).toFixed(2)}s`,
        `--w:${(Math.random() * .35).toFixed(2)}s`,
      ].join(';');
      layer.appendChild(b);
    }
    document.body.appendChild(layer);
    setTimeout(() => layer.remove(), 2800);
  };

  cue?.addEventListener('click', e => {
    e.preventDefault();
    // The sticky header slims to 56px once scrolled, pulling the page up by the
    // difference, so subtracting its current height lands the section just below it.
    const headerH = document.querySelector('header').offsetHeight;
    const target = welcome.getBoundingClientRect().top + scrollY - headerH;
    welcome.setAttribute('tabindex', '-1');
    if (reduced) {
      scrollTo(0, target);
    } else {
      const r = cue.getBoundingClientRect();
      cue.classList.remove('pressed');
      void cue.offsetWidth;
      cue.classList.add('pressed');
      bubbleBurst(r.left + r.width / 2, r.top + r.height / 2);
      setTimeout(() => glideTo(target, 1300), 120);
    }
    welcome.focus({ preventScroll: true });
  });

  document.querySelector('.contact .contact-card')?.setAttribute('data-reveal', 'right');
  const targets = document.querySelectorAll('[data-reveal]');
  const counters = document.querySelectorAll('[data-count]');

  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('in'));
    return;
  }

  const countUp = el => {
    const end = +el.dataset.count;
    const duration = 1400;
    const start = performance.now();
    const tick = now => {
      const t = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  counters.forEach(el => { el.textContent = '0'; });

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      entry.target.querySelectorAll('[data-count]').forEach(countUp);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => io.observe(el));
})();
