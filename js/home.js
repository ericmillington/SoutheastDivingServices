// Homepage motion: reveal sections as they scroll into view and count up the stats.
// Elements start hidden only when <html> has the "js" class, so content stays
// visible if this script never runs.
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

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
