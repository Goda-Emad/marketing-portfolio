/* File: marketing-portfolio/assets/js/motion.js */
(function () {
  'use strict';
  var doc = document;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var PATHS = {
    chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
    github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
    down: '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
    play: '<polygon points="7 4 20 12 7 20" fill="currentColor"/>',
    briefcase: '<rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    video: '<path d="m16 13 5.2 3.1a.5.5 0 0 0 .8-.4V8.3a.5.5 0 0 0-.8-.4L16 11"/><rect width="14" height="12" x="2" y="6" rx="2"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.5 13.1 17 22l-5-3-5 3 1.5-8.9"/>',
    check: '<circle class="draw" pathLength="1" cx="12" cy="12" r="10"/><path class="draw" pathLength="1" d="m9 12 2 2 4-4"/>'
  };

  function svg(name) {
    return '<svg class="i i-' + name + '" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + PATHS[name] + '</svg>';
  }
  function addIcon(el, name, atEnd) {
    if (!el || el.querySelector('.ico')) return;
    var s = doc.createElement('span');
    s.className = 'ico' + (atEnd ? ' ico-end' : '');
    s.setAttribute('aria-hidden', 'true');
    s.innerHTML = svg(name); // static strings only
    if (atEnd) el.appendChild(s); else el.insertBefore(s, el.firstChild);
  }

  // 1) Button icons
  doc.querySelectorAll('a.btn, button.watch').forEach(function (el) {
    var h = el.getAttribute('href') || '';
    if (h.indexOf('wa.me') > -1) addIcon(el, 'chat');
    else if (h.indexOf('mailto:') === 0) addIcon(el, 'mail');
    else if (h.indexOf('linkedin') > -1) addIcon(el, 'linkedin');
    else if (h.indexOf('github.com') > -1) addIcon(el, 'github');
    else if (el.hasAttribute('download')) addIcon(el, 'download');
    else if (h === '#work') addIcon(el, 'down', true);
    else if (el.classList.contains('watch')) addIcon(el, 'play');
  });
  addIcon(doc.querySelector('.fab'), 'chat');

  // 2) Stat card icons
  var statIcons = ['briefcase', 'video', 'award'];
  doc.querySelectorAll('.stats li').forEach(function (li, i) {
    var s = doc.createElement('span');
    s.className = 'stat-ico';
    s.setAttribute('aria-hidden', 'true');
    s.style.setProperty('--i', i);
    s.innerHTML = svg(statIcons[i] || 'award');
    li.insertBefore(s, li.firstChild);
  });

  // 3) Certification check icons
  doc.querySelectorAll('.certs li > span').forEach(function (sp) { addIcon(sp, 'check'); });

  // 4) Staggered reveal for items inside sections
  doc.querySelectorAll('.reveal').forEach(function (sec) {
    sec.querySelectorAll('.card, .cs-block, .gallery .shot, .chips li, .certs li, .timeline > li, .contact .actions .btn').forEach(function (el) {
      var idx = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.setAttribute('data-st', '');
      el.style.setProperty('--i', Math.min(idx, 8));
    });
  });

  // 5) Count-up for the numeric stats (same numbers, animated)
  function count(el) {
    var end = parseInt(el.dataset.n, 10), t0 = null, dur = 900;
    function step(t) {
      if (t0 === null) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (!reduce && 'IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        co.unobserve(en.target);
        count(en.target);
      });
    }, { threshold: 0.6 });
    doc.querySelectorAll('.stats strong').forEach(function (el) {
      var t = el.textContent.trim();
      if (/^\d+$/.test(t)) { el.dataset.n = t; el.textContent = '0'; co.observe(el); }
    });
  }

  // 6) Whole video thumbnail opens the video
  doc.querySelectorAll('.video-card .thumb').forEach(function (t) {
    t.addEventListener('click', function () {
      var b = t.closest('.video-card').querySelector('.watch');
      if (b) b.click();
    });
  });
})();
