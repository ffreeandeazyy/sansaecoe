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

  if (!veil || !sheetBody) return;

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

    opener = trigger || null;
    seq += 1;

    sheetBody.innerHTML = '';
    sheetBody.appendChild(tpl.content.cloneNode(true));
    loadDeferred(sheetBody);

    var title = sheetBody.querySelector('h2');
    var sheet = veil.querySelector('.sheet');
    if (title && sheet) sheet.setAttribute('aria-label', title.textContent.trim());

    veil.hidden = false;
    /* next frame, so the transition runs */
    window.requestAnimationFrame(function () {
      veil.classList.add('is-in');
    });

    if (paper) paper.inert = true;
    body.classList.add('is-locked');
    body.classList.add('has-opened');
    sheet.scrollTop = 0;

    closeBtn.focus({ preventScroll: true });
  }

  function close() {
    veil.classList.remove('is-in');
    body.classList.remove('is-locked');
    if (paper) paper.inert = false;

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

  veil.addEventListener('click', function (e) {
    if (e.target === veil) close();
  });

  veil.addEventListener('click', function (e) {
    if (e.target.closest('[data-close]')) close();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !veil.hidden) close();
  });

  /* open by hash, e.g. index.html#hiyiko */
  if (window.location.hash) {
    var id = window.location.hash.replace('#', '');
    if (document.getElementById('t-' + id)) {
      window.setTimeout(function () { open(id, null); }, 200);
    }
  }
})();
