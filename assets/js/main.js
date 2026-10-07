/* File: marketing-portfolio/assets/js/main.js */
(function () {
  'use strict';
  var doc = document;
  var root = doc.documentElement;

  /* ── Year ── */
  var year = doc.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ── Dark / Light mode ── */
  var THEME_KEY = 'goda-theme';

  function getPreferred() {
    var saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    // Update toggle aria-label
    var toggleBtn = doc.getElementById('themeToggle');
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      toggleBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    }
  }

  // Apply on load (before render to avoid flash)
  applyTheme(getPreferred());

  doc.addEventListener('DOMContentLoaded', function () {
    var toggleBtn = doc.getElementById('themeToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        var current = root.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
      });
    }
  });

  /* ── Mobile menu ── */
  var btn = doc.getElementById('menuBtn');
  var nav = doc.getElementById('nav');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open
      ? (btn.dataset.labelClose || 'Close menu')
      : (btn.dataset.labelOpen || 'Open menu'));
  }
  if (btn && nav) {
    btn.addEventListener('click', function () {
      setMenu(btn.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); btn.focus(); }
    });
  }

  /* ── Header shadow + scroll progress ── */
  var header = doc.querySelector('.site-header');
  var bar    = doc.getElementById('progress');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var y   = window.scrollY;
      var max = doc.documentElement.scrollHeight - window.innerHeight;
      if (header) header.classList.toggle('scrolled', y > 8);
      if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Active nav link (scroll spy) ── */
  var navLinks = doc.querySelectorAll('.nav a[href^="#"]');
  if ('IntersectionObserver' in window) {
    var map = {};
    navLinks.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (l) { l.classList.remove('active'); l.removeAttribute('aria-current'); });
        var a = map[en.target.id];
        if (a) { a.classList.add('active'); a.setAttribute('aria-current', 'true'); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) {
      var s = doc.getElementById(id);
      if (s) spy.observe(s);
    });
  }

  /* ── Video modal ── */
  var modal    = doc.getElementById('videoModal');
  var body     = doc.getElementById('modalBody');
  var title    = doc.getElementById('modalTitle');
  var closeBtn = doc.getElementById('closeModal');
  var lastTrigger = null;

  function closeModal() { if (modal && modal.open) modal.close(); }

  function openVideo(trigger) {
    var id = trigger.getAttribute('data-video') || '';
    lastTrigger = trigger;
    title.textContent = trigger.getAttribute('data-title') || '';
    body.textContent  = '';
    if (!id || id.indexOf('YOUTUBE_ID') === 0) {
      body.textContent = body.dataset.soon || 'Video coming soon.';
    } else {
      var f = doc.createElement('iframe');
      f.src           = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0';
      f.title         = title.textContent;
      f.loading       = 'lazy';
      f.allow         = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      body.appendChild(f);
    }
    if (modal) {
      if (typeof modal.showModal === 'function') modal.showModal();
      else modal.setAttribute('open', '');
    }
  }

  if (modal) {
    doc.querySelectorAll('.watch').forEach(function (b) {
      b.addEventListener('click', function () { openVideo(b); });
    });
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
    modal.addEventListener('close', function () {
      body.textContent = '';
      if (lastTrigger) lastTrigger.focus();
    });
  }

  /* ── Section reveal ── */
  var items  = doc.querySelectorAll('.reveal');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

})();
