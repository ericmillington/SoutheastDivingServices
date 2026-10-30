// Contact card: live validation, character counter, and a pre-filled email on submit.
// GitHub Pages can't receive form posts, so sending opens the visitor's email app
// with everything filled in. To receive submissions directly, point the form at a
// service like Formspree and post to it here instead.
document.querySelectorAll('form[data-contact]').forEach(form => {
  const TO = 'southeastdiving@gmail.com';
  const fields = [...form.querySelectorAll('.fl input, .fl textarea')];
  const success = form.querySelector('.cc-success');
  form.noValidate = true;

  const problem = el => {
    const v = el.value.trim();
    if (el.required && !v) return 'This field is required.';
    if (el.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Please enter a valid email address.';
    if (el.type === 'tel' && v && v.replace(/\D/g, '').length < 10) return 'Please enter a 10-digit phone number.';
    return '';
  };

  const check = el => {
    const wrap = el.closest('.fl');
    const msg = problem(el);
    wrap.classList.toggle('invalid', !!msg);
    wrap.classList.toggle('valid', !msg && el.value.trim() !== '');
    el.setAttribute('aria-invalid', !!msg);
    wrap.querySelector('.err').textContent = msg;
    return !msg;
  };

  fields.forEach(el => {
    el.addEventListener('blur', () => { el.dataset.touched = '1'; check(el); });
    el.addEventListener('input', () => { if (el.dataset.touched) check(el); });
  });

  const msg = form.querySelector('textarea');
  const count = form.querySelector('.count');
  const updateCount = () => { count.textContent = `${msg.value.length} / ${msg.maxLength}`; };
  msg.addEventListener('input', updateCount);
  updateCount();

  form.addEventListener('submit', e => {
    e.preventDefault();
    fields.forEach(el => { el.dataset.touched = '1'; });
    const bad = fields.filter(el => !check(el));
    if (bad.length) { bad[0].focus(); return; }

    const val = name => form.elements[name].value.trim();
    const services = [...form.querySelectorAll('input[name="service"]:checked')].map(c => c.value);
    const name = `${val('first')} ${val('last')}`;
    const subject = `Website inquiry from ${name}` + (services.length ? ` (${services.join(', ')})` : '');
    const lines = [`Name: ${name}`, `Email: ${val('email')}`];
    if (val('phone')) lines.push(`Phone: ${val('phone')}`);
    if (services.length) lines.push(`Services: ${services.join(', ')}`);
    lines.push('', val('message'));
    const body = lines.join('\n');

    window.location.href = `mailto:${TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    form.classList.add('sent');
    success.hidden = false;
    success.querySelector('.tick').focus();
  });

  form.querySelector('.cc-edit').addEventListener('click', () => {
    form.classList.remove('sent');
    success.hidden = true;
    form.querySelector('textarea').focus();
  });
});
