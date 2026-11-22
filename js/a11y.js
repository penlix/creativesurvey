/* Accessibility behaviour on top of the original 2015 scripts. */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Links that act as buttons respond to Space as well as Enter.
  document.addEventListener('keydown', function (e) {
    var t = e.target;
    if ((e.key === ' ' || e.key === 'Spacebar') && t && t.getAttribute && t.getAttribute('role') === 'button') {
      e.preventDefault();
      t.click();
    }
  });

  function ready(fn) {
    if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    // Header video: pause/play control, paused from the start with reduced motion.
    var video = document.querySelector('.topbar video');
    var header = document.querySelector('.topbar');
    if (video && header) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'a11y-pause';
      var icons = {
        pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="4" width="5" height="16" rx="1"/><rect x="14" y="4" width="5" height="16" rx="1"/></svg>',
        play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5z"/></svg>'
      };
      var render = function () {
        var playing = !video.paused;
        btn.innerHTML = playing ? icons.pause : icons.play;
        btn.setAttribute('aria-label', playing ? 'Παύση βίντεο' : 'Αναπαραγωγή βίντεο');
      };
      btn.addEventListener('click', function () { if (video.paused) { video.play(); } else { video.pause(); } });
      video.addEventListener('play', render);
      video.addEventListener('pause', render);
      if (reduceMotion) { video.removeAttribute('autoplay'); video.pause(); }
      header.appendChild(btn);
      render();
      // On small and touch screens the original script hides the video and shows a poster.
      window.addEventListener('load', function () {
        setTimeout(function () { btn.hidden = window.getComputedStyle(video).display === 'none'; }, 0);
      });
    }

    // Privacy terms overlay behaves as a dialog.
    var terms = document.querySelector('.terms');
    var opener = document.querySelector('.data');
    var close = terms && terms.querySelector('.close');
    if (terms && opener && close) {
      terms.setAttribute('role', 'dialog');
      terms.setAttribute('aria-modal', 'true');
      terms.setAttribute('aria-label', 'Προστασία προσωπικών δεδομένων');
      opener.addEventListener('click', function () { setTimeout(function () { close.focus(); }, 0); });
      close.addEventListener('click', function () { setTimeout(function () { opener.focus(); }, 0); });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && window.getComputedStyle(terms).display !== 'none') close.click();
      });
    }

    // Menu buttons report whether the menu is open (the original script toggles the "open" class).
    Array.prototype.forEach.call(document.querySelectorAll('.burger'), function (b) {
      var sync = function () { b.setAttribute('aria-expanded', b.classList.contains('open') ? 'false' : 'true'); };
      sync();
      b.addEventListener('click', function () { setTimeout(sync, 50); });
    });
  });
})();
