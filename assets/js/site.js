/* Jacob Little — small enhancements. Every page works without this file. */
(function () {
  document.documentElement.classList.add('js');

  /* ---------- Rotating reviews (home) ---------- */
  var list = document.querySelector('[data-quotes]');
  if (list) {
    var items = Array.prototype.slice.call(list.querySelectorAll('li'));
    var dotsBox = document.querySelector('[data-dots]');
    var prev = document.querySelector('[data-prev]');
    var next = document.querySelector('[data-next]');
    var region = document.querySelector('[data-carousel]');
    var i = 0, timer = null, paused = false;
    var DELAY = 12000;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var dots = items.map(function (_, k) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Show review ' + (k + 1) + ' of ' + items.length);
      b.appendChild(document.createElement('span'));
      b.addEventListener('click', function () { show(k); restart(); });
      dotsBox.appendChild(b);
      return b;
    });

    function show(n) {
      i = (n + items.length) % items.length;
      items.forEach(function (li, k) {
        var on = k === i;
        li.classList.toggle('is-active', on);
        li.setAttribute('aria-hidden', on ? 'false' : 'true');
        dots[k].setAttribute('aria-current', on ? 'true' : 'false');
      });
    }
    function restart() {
      clearInterval(timer);
      if (reduce) return;
      timer = setInterval(function () { if (!paused) show(i + 1); }, DELAY);
    }
    prev.addEventListener('click', function () { show(i - 1); restart(); });
    next.addEventListener('click', function () { show(i + 1); restart(); });
    region.addEventListener('mouseenter', function () { paused = true; });
    region.addEventListener('mouseleave', function () { paused = false; });
    region.addEventListener('focusin', function () { paused = true; });
    region.addEventListener('focusout', function () { paused = false; });
    show(0);
    restart();
  }

  /* ---------- Genre filters (publications) ---------- */
  var filterBox = document.querySelector('[data-filters]');
  if (filterBox) {
    var buttons = Array.prototype.slice.call(filterBox.querySelectorAll('button'));
    var sections = Array.prototype.slice.call(document.querySelectorAll('[data-genre]'));
    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        var key = b.getAttribute('data-filter');
        buttons.forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
        sections.forEach(function (s) { s.hidden = !(key === 'all' || s.getAttribute('data-genre') === key); });
      });
    });
  }

  /* ---------- Contact form (Formspree) ---------- */
  var form = document.querySelector('[data-contact]');
  if (form && window.fetch) {
    var status = document.querySelector('[data-status]');
    var send = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      send.disabled = true;
      send.textContent = 'Sending…';
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error('send failed');
          form.reset();
          status.textContent = 'Thanks — your message is on its way. I’ll write back soon.';
        })
        .catch(function () {
          status.textContent = 'Sorry, that didn’t go through. Please try again in a moment.';
        })
        .then(function () {
          status.hidden = false;
          send.disabled = false;
          send.textContent = 'Send message';
          status.focus();
        });
    });
  }
})();
