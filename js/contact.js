// Contact card: live validation, character counter, and sending.
//
// FORMSPREE_ID: paste the ID from your Formspree form (the part after /f/ in its
// endpoint, e.g. https://formspree.io/f/xyzabcde -> 'xyzabcde'). Messages are then
// delivered straight to your inbox. Left empty, sending falls back to opening the
// visitor's email app with the message pre-filled.
const FORMSPREE_ID = 'mbggayer';

document.querySelectorAll('form[data-contact]').forEach(form => {
  const TO = 'southeastdiving@gmail.com';
  const fields = [...form.querySelectorAll('.fl input, .fl textarea')];
  const success = form.querySelector('.cc-success');
  const error = form.querySelector('.cc-error');
  const button = form.querySelector('.cc-submit');
  form.noValidate = true;

  const showSuccess = (title, text) => {
    if (title) {
      success.querySelector('.cc-success-title').textContent = title;
      success.querySelector('.cc-success-text').textContent = text;
    }
    success.querySelector('.cc-edit').textContent = title ? 'Send another message' : 'Edit message';
    form.classList.add('sent');
    success.hidden = false;
    success.querySelector('.tick').focus();
  };

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

  form.addEventListener('submit', async e => {
    e.preventDefault();
    error.hidden = true;
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

    if (!FORMSPREE_ID) {
      window.location.href = `mailto:${TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      showSuccess();
      return;
    }

    const data = new FormData();
    data.append('name', name);
    data.append('email', val('email'));
    if (val('phone')) data.append('phone', val('phone'));
    if (services.length) data.append('services', services.join(', '));
    data.append('message', val('message'));
    data.append('_subject', subject);
    data.append('_gotcha', form.elements._gotcha.value);

    button.disabled = true;
    button.classList.add('sending');
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(`Formspree responded ${res.status}`);
      form.reset();
      fields.forEach(el => { delete el.dataset.touched; el.closest('.fl').classList.remove('valid', 'invalid'); });
      updateCount();
      showSuccess('Message sent!', 'Thanks for reaching out. Our team will get back to you soon. Need a diver right away? Call (954) 650-6931, 24/7.');
    } catch (err) {
      error.hidden = false;
    } finally {
      button.disabled = false;
      button.classList.remove('sending');
    }
  });

  form.querySelector('.cc-edit').addEventListener('click', () => {
    form.classList.remove('sent');
    success.hidden = true;
    form.querySelector('textarea').focus();
  });
});
