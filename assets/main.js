/* Cloud Learn & Media — shared interactions */
(function () {
  var doc = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Mobile menu ----
  var burger = document.querySelector('.burger');
  function closeMenu() {
    document.body.classList.remove('menu-open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
  }
  if (burger) {
    burger.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = document.body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('nav.links a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('header.site')) closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // ---- Header state on scroll ----
  var header = document.querySelector('header.site');
  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Count-up numbers ----
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target) || reduceMotion) return;
    var start = null, dur = 1400;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    el.textContent = '0';
    requestAnimationFrame(step);
  }

  // ---- Reveal on scroll ----
  var revealEls = document.querySelectorAll('.reveal');
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('visible');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });

    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        countUp(e.target);
        co.unobserve(e.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  // ---- Footer year ----
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  // ---- Contact form -> opens the visitor's email app addressed to contact@cloudlm.in ----
  var form = document.getElementById('contactForm');
  if (form) {
    var fields = {
      name: document.getElementById('cf-name'),
      email: document.getElementById('cf-email'),
      topic: document.getElementById('cf-topic'),
      msg: document.getElementById('cf-msg')
    };
    var status = document.getElementById('cf-status');

    function setInvalid(input, bad) {
      var field = input.closest('.field');
      field.classList.toggle('invalid', bad);
      input.setAttribute('aria-invalid', bad ? 'true' : 'false');
    }
    function emailOk(v) { return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

    [fields.name, fields.msg, fields.email].forEach(function (input) {
      input.addEventListener('input', function () {
        if (input.closest('.field').classList.contains('invalid')) {
          var v = input.value.trim();
          setInvalid(input, input === fields.email ? !emailOk(v) : !v);
        }
      });
    });

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var name = fields.name.value.trim();
      var email = fields.email.value.trim();
      var topic = fields.topic.value;
      var msg = fields.msg.value.trim();

      setInvalid(fields.name, !name);
      setInvalid(fields.email, !emailOk(email));
      setInvalid(fields.msg, !msg);
      var firstBad = form.querySelector('.field.invalid input, .field.invalid textarea');
      if (firstBad) { firstBad.focus(); return; }

      var subject = '[' + topic + '] Message from ' + name + ' via cloudlm.in';
      var body = msg + '\n\n—\nName: ' + name + (email ? '\nEmail: ' + email : '');
      window.location.href = 'mailto:contact@cloudlm.in?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

      if (status) {
        status.textContent = 'Your email app should open with the message ready to send. If nothing happens, write to contact@cloudlm.in directly.';
        status.classList.add('show');
      }
    });
  }
})();
