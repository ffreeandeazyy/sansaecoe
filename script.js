/* =========================================================
   . . . s a n s a e c o e . . .
   press a small thing, a sheet of paper comes up
   ========================================================= */

(function () {
  var body = document.body;
  var veil = document.getElementById('veil');
  var sheetBody = document.getElementById('sheetBody');
  var closeBtn = document.getElementById('closeBtn');
  var paper = document.querySelector('.paper');
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-sheet]'));
  var opener = null;
  var seq = 0;
  var currentId = null;

  if (!veil || !sheetBody) return;

  /* =========================
     the three languages
     ========================= */

  var I18N = window.SANSAECOE_I18N || {};
  var LANGS = ['ko', 'en', 'jp'];
  var PAGE_LANG = { ko: 'ko', en: 'en', jp: 'ja' };
  var STORE = 'sansaecoe:lang';

  /* the Korean wording as it is written in index.html */
  var koText = {};
  var koAria = {};
  var koAlt = {};

  function collect(root) {
    var nodes = root.querySelectorAll('[data-i18n]');
    var i, k;
    for (i = 0; i < nodes.length; i++) {
      k = nodes[i].getAttribute('data-i18n');
      if (!(k in koText)) koText[k] = nodes[i].innerHTML;
    }
    nodes = root.querySelectorAll('[data-i18n-aria]');
    for (i = 0; i < nodes.length; i++) {
      k = nodes[i].getAttribute('data-i18n-aria');
      if (!(k in koAria)) koAria[k] = nodes[i].getAttribute('aria-label') || '';
    }
    nodes = root.querySelectorAll('[data-i18n-alt]');
    for (i = 0; i < nodes.length; i++) {
      k = nodes[i].getAttribute('data-i18n-alt');
      if (!(k in koAlt)) koAlt[k] = nodes[i].getAttribute('alt') || '';
    }
  }

  collect(document);
  Array.prototype.forEach.call(document.querySelectorAll('template'), function (tpl) {
    collect(tpl.content);
  });

  function apply(root, lang) {
    var dict = I18N[lang] || {};
    var nodes = root.querySelectorAll('[data-i18n]');
    var i, el, k, v;

    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      k = el.getAttribute('data-i18n');
      v = dict[k];
      el.innerHTML = v != null ? v : koText[k] != null ? koText[k] : el.innerHTML;
    }

    nodes = root.querySelectorAll('[data-i18n-aria]');
    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      k = el.getAttribute('data-i18n-aria');
      v = dict[k];
      el.setAttribute('aria-label', v != null ? v : koAria[k] != null ? koAria[k] : el.getAttribute('aria-label'));
    }

    nodes = root.querySelectorAll('[data-i18n-alt]');
    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      k = el.getAttribute('data-i18n-alt');
      v = dict[k];
      el.setAttribute('alt', v != null ? v : koAlt[k] != null ? koAlt[k] : el.getAttribute('alt'));
    }
  }

  var lang = 'ko';
  try {
    var saved = window.localStorage.getItem(STORE);
    if (saved && LANGS.indexOf(saved) !== -1) lang = saved;
  } catch (e) {}
  var asked = /[?&]lang=(ko|en|jp)\b/.exec(window.location.search);
  if (asked) lang = asked[1];

  var langBtns = Array.prototype.slice.call(document.querySelectorAll('.lang [data-lang]'));

  function syncSheetLabel() {
    var title = sheetBody.querySelector('h2');
    var sheet = veil.querySelector('.sheet');
    if (title && sheet) sheet.setAttribute('aria-label', title.textContent.trim());
  }

  function setLang(next, persist) {
    if (LANGS.indexOf(next) === -1) next = 'ko';
    lang = next;

    document.documentElement.setAttribute('lang', PAGE_LANG[next] || 'ko');
    document.documentElement.setAttribute('data-lang', next);

    apply(document, next);

    langBtns.forEach(function (btn) {
      var on = btn.getAttribute('data-lang') === next;
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.classList.toggle('is-on', on);
    });

    syncSheetLabel();

    if (persist) {
      try {
        window.localStorage.setItem(STORE, next);
      } catch (e) {}
    }
  }

  langBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLang(btn.getAttribute('data-lang'), true);
    });
  });

  /* the objects settle in, one after another */
  window.setTimeout(function () {
    document.documentElement.classList.add('is-ready');
  }, 60);

  function loadDeferred(scope) {
    Array.prototype.forEach.call(scope.querySelectorAll('img[data-src]'), function (img) {
      if (!img.getAttribute('src')) img.setAttribute('src', img.getAttribute('data-src'));
    });
  }

  function open(id, trigger) {
    var tpl = document.getElementById('t-' + id);
    if (!tpl) return;

    /* switching from one sheet to another keeps the thing that opened
       the first one, so closing gives the focus back where it belongs */
    if (trigger) opener = trigger;
    currentId = id;
    seq += 1;

    sheetBody.innerHTML = '';
    sheetBody.appendChild(tpl.content.cloneNode(true));
    apply(sheetBody, lang);
    loadDeferred(sheetBody);

    /* a soft change of page when one sheet gives way to the next */
    sheetBody.classList.remove('is-swap');
    void sheetBody.offsetWidth;
    sheetBody.classList.add('is-swap');

    syncSheetLabel();

    veil.hidden = false;
    /* next frame, so the transition runs */
    window.requestAnimationFrame(function () {
      veil.classList.add('is-in');
    });

    if (paper) paper.inert = true;
    body.classList.add('is-locked');
    body.classList.add('has-opened');
    veil.querySelector('.sheet').scrollTop = 0;

    closeBtn.focus({ preventScroll: true });
  }

  function close() {
    veil.classList.remove('is-in');
    body.classList.remove('is-locked');
    if (paper) paper.inert = false;

    currentId = null;
    seq += 1;
    var mySeq = seq;
    window.setTimeout(function () {
      if (seq !== mySeq) return;
      veil.hidden = true;
      sheetBody.innerHTML = '';
    }, 380);

    if (opener) opener.focus({ preventScroll: true });
  }

  items.forEach(function (btn) {
    btn.addEventListener('click', function () {
      open(btn.getAttribute('data-sheet'), btn);
    });
  });

  closeBtn.addEventListener('click', close);

  /* a small thing inside an open sheet that leads to another sheet —
     the second cup, and the way back to the first story */
  sheetBody.addEventListener('click', function (e) {
    var link = e.target && e.target.closest ? e.target.closest('[data-sheet]') : null;
    if (!link || !sheetBody.contains(link)) return;

    var next = link.getAttribute('data-sheet');
    if (!next) return;

    e.preventDefault();
    if (next === currentId) return;
    if (!document.getElementById('t-' + next)) return;
    open(next, null);
  });

  veil.addEventListener('click', function (e) {
    if (e.target === veil) close();
  });

  veil.addEventListener('click', function (e) {
    if (e.target.closest('[data-close]')) close();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !veil.hidden) close();
  });

  /* =========================
     the first film
     the whole screen is one film; one touch takes it away
     and the sheet of paper is already there underneath
     ========================= */

  var intro = document.getElementById('intro');
  var introVideo = document.getElementById('introVideo');
  var introOpen = false;

  function endIntro() {
    if (!introOpen) return;
    introOpen = false;

    intro.classList.add('is-out');
    intro.setAttribute('aria-hidden', 'true');
    intro.removeAttribute('role');
    intro.tabIndex = -1;
    body.classList.remove('has-intro');

    if (document.activeElement === intro) intro.blur();

    window.setTimeout(function () {
      intro.hidden = true;
      if (introVideo) {
        try { introVideo.pause(); } catch (e) {}
      }
    }, 700);
  }

  if (intro && !intro.hidden) {
    introOpen = true;

    /* mobile browsers only play a film on their own when it is silent and inline */
    if (introVideo) {
      introVideo.muted = true;
      var playing = introVideo.play();
      if (playing && typeof playing.catch === 'function') playing.catch(function () {});
      introVideo.addEventListener('error', endIntro);
    }

    intro.addEventListener('click', endIntro);

    /* a tap is a tap — the film goes at the touch, not after the page's own delay */
    intro.addEventListener('touchend', function (e) {
      e.preventDefault();
      endIntro();
    }, { passive: false });

    intro.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        endIntro();
      }
    });

    /* Enter and space work even before anyone has tabbed to the film */
    document.addEventListener('keydown', function (e) {
      if (!introOpen) return;
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        endIntro();
      }
    });
  } else if (intro) {
    body.classList.remove('has-intro');
  }

  /* open by hash, e.g. index.html#hiyiko */
  if (window.location.hash) {
    var id = window.location.hash.replace('#', '');
    if (document.getElementById('t-' + id)) {
      window.setTimeout(function () { open(id, null); }, 200);
    }
  }

  /* the page starts in Korean unless another language was chosen before */
  setLang(lang, !!asked);
})();
