// devanghacks.in — shared behaviour for every page (incl. article pages)

(function () {
  // Fallback theme init (the inline <head> script normally sets this before paint).
  const root = document.documentElement;
  if (!root.getAttribute('data-theme')) {
    let t;
    try { t = localStorage.getItem('theme'); } catch (e) { /* ignore */ }
    if (t !== 'light' && t !== 'dark') {
      t = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    root.setAttribute('data-theme', t);
  }

  // Article pages only load JetBrains Mono; make sure the display font is there too.
  if (!document.querySelector('link[href*="Space+Grotesk"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
  }
})();

document.addEventListener('DOMContentLoaded', function () {
  // --- Nav: [key] hints + keyboard shortcuts -------------------------------
  const KEYS = {
    'index.html': 'D',
    'blogs.html': 'B',
    'tools.html': 'T'
  };

  const shortcuts = {};

  document.querySelectorAll('.main-nav a').forEach(a => {
    const page = (a.getAttribute('href') || '').split('/').pop();
    const key = KEYS[page];
    if (!key) return;
    shortcuts[key.toLowerCase()] = a;
    if (a.classList.contains('nav-home')) return; // brackets come from CSS
    const hint = document.createElement('span');
    hint.className = 'key';
    hint.textContent = '[' + key + ']';
    a.prepend(hint);
  });

  document.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    const link = shortcuts[e.key.toLowerCase()];
    if (link) window.location.href = link.href;
  });

  // --- Nav: availability · Surat clock · timezone offset (separate pills) --
  const navList = document.querySelector('.main-nav ul');
  if (navList) {
    // how far Surat (IST, UTC+5:30) is ahead of the visitor's timezone
    const diffMin = 330 - (-new Date().getTimezoneOffset());
    const togglable = diffMin !== 0; // no toggle / offset when in the same timezone

    const group = document.createElement('div');
    group.className = 'nav-status';

    // pill 1 — availability
    const avail = document.createElement('span');
    avail.className = 'nav-pill nav-avail';
    avail.innerHTML = '<span class="dot"></span><span class="stat-word"></span>';
    group.appendChild(avail);

    // pill 2 — the clock (a button that toggles IST ⇄ your local time)
    const clock = document.createElement(togglable ? 'button' : 'span');
    clock.className = 'nav-pill nav-clock';
    if (togglable) clock.type = 'button';
    const timeEl = document.createElement('span');
    timeEl.className = 'stat-time';
    clock.appendChild(timeEl);
    group.appendChild(clock);

    // pill 3 — timezone offset, only when the visitor is elsewhere
    if (togglable) {
      const a = Math.abs(diffMin), h = Math.floor(a / 60), mm = a % 60;
      const mag = mm === 0 ? h + 'h' : mm === 30 ? h + '.5h' : h + 'h' + mm + 'm';
      const off = document.createElement('span');
      off.className = 'nav-pill nav-off';
      off.textContent = (diffMin > 0 ? '+' : '−') + mag;
      off.title = 'Surat is ' + off.textContent + ' ' + (diffMin > 0 ? 'ahead of' : 'behind') + ' your timezone';
      group.appendChild(off);
    }

    navList.appendChild(group);

    const wordEl = avail.querySelector('.stat-word');
    const istClock = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const youClock = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

    // availability from the IST time: awake 08:00 → 22:30, asleep otherwise
    const statusOf = mins =>
      (mins >= 8 * 60 && mins < 22 * 60 + 30) ? ['online', 'ONLINE'] : ['asleep', 'ASLEEP'];

    let mode = 'ist';
    try { mode = localStorage.getItem('clockMode') === 'local' ? 'local' : 'ist'; } catch (e) { /* ignore */ }

    const tick = () => {
      const now = new Date();
      const istStr = istClock.format(now);                  // "HH:MM:SS"
      const mins = (+istStr.slice(0, 2)) * 60 + (+istStr.slice(3, 5));
      const s = statusOf(mins);
      group.classList.remove('s-online', 's-asleep');
      group.classList.add('s-' + s[0]);
      wordEl.textContent = s[1];
      timeEl.textContent = (togglable && mode === 'local') ? 'YOU ' + youClock.format(now) : 'IN ' + istStr;
    };
    tick();
    setInterval(tick, 1000);

    if (togglable) {
      clock.title = 'Click to switch between Surat time and your local time';
      clock.setAttribute('aria-label', clock.title);
      clock.addEventListener('click', () => {
        mode = mode === 'ist' ? 'local' : 'ist';
        try { localStorage.setItem('clockMode', mode); } catch (e) { /* ignore */ }
        tick();
      });
    }
  }

  // --- Nav: animated day/night theme switch --------------------------------
  if (navList) {
    const root = document.documentElement;
    // local copies (see assets/images/theme-switch/); path is relative to page depth
    const base = document.querySelector('link[href*="assets/css/custom.css"]');
    const prefix = base ? base.getAttribute('href').replace('assets/css/custom.css', '') : '';
    const CLOUD = prefix + 'assets/images/theme-switch/clouds.png';
    const BALLOON = prefix + 'assets/images/theme-switch/balloon.png';
    const SHIP = prefix + 'assets/images/theme-switch/spaceship.png';

    const wrap = document.createElement('div');
    wrap.className = 'theme-switch-wrap';
    wrap.title = 'Toggle light / dark theme';
    wrap.innerHTML =
      '<label class="switch">' +
        '<input type="checkbox" aria-label="Toggle light and dark theme">' +
        '<div class="slider round white">' +
          '<img class="clouds cloud1" src="' + CLOUD + '" alt="">' +
          '<img class="clouds cloud2" src="' + CLOUD + '" alt="">' +
          '<div class="night"></div>' +
          '<img class="balloon" src="' + BALLOON + '" alt="">' +
          '<p class="star">✦</p><p class="star">✦</p><p class="star">✦</p>' +
          '<p class="star">✦</p><p class="star">✦</p>' +
          '<img class="spaceship" src="' + SHIP + '" alt="">' +
        '</div>' +
      '</label>';

    const input = wrap.querySelector('input');
    input.checked = root.getAttribute('data-theme') === 'dark'; // checked = night = dark
    input.addEventListener('change', () => {
      const next = input.checked ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
    });

    // Pin the switch beside the link list so it stays visible while links scroll.
    (navList.closest('.main-nav') || navList).appendChild(wrap);
  }

  // --- Nav: encrypt/decrypt scramble on the name --------------------------
  const nameEl = document.querySelector('.main-nav .nav-home');
  if (nameEl) {
    const original = nameEl.textContent;
    const chars = '!<>-_/[]{}=+*^?#%$&0123456789ABCDEF';
    const rnd = () => chars[Math.floor(Math.random() * chars.length)];
    let queue = [], frame = 0, req, resolveFn;

    const update = () => {
      let out = '', done = 0;
      for (let i = 0; i < queue.length; i++) {
        const q = queue[i];
        if (frame >= q.end) { done++; out += q.to; }
        else if (frame >= q.start) {
          if (!q.char || Math.random() < 0.28) q.char = q.to === ' ' ? ' ' : rnd();
          out += '<span class="dud">' + q.char + '</span>';
        } else { out += q.from; }
      }
      nameEl.innerHTML = out;
      if (done === queue.length) { if (resolveFn) resolveFn(); }
      else { frame++; req = requestAnimationFrame(update); }
    };

    const setText = newText => {
      const oldText = nameEl.textContent;
      const len = Math.max(oldText.length, newText.length);
      queue = [];
      for (let i = 0; i < len; i++) {
        const start = Math.floor(Math.random() * 18);
        const end = start + 10 + Math.floor(Math.random() * 22);
        queue.push({ from: oldText[i] || '', to: newText[i] || '', start: start, end: end, char: '' });
      }
      cancelAnimationFrame(req);
      frame = 0;
      return new Promise(res => { resolveFn = res; update(); });
    };

    const cipher = () => Array.from(original).map(c => (c === ' ' ? ' ' : rnd())).join('');

    nameEl.addEventListener('mouseenter', () => setText(cipher()));
    nameEl.addEventListener('mouseleave', () => setText(original));
    nameEl.addEventListener('focus', () => setText(cipher()));
    nameEl.addEventListener('blur', () => setText(original));
  }

  // --- Unified writing index: search + tag filter -------------------------
  const list = document.getElementById('writingList');
  if (list) {
    const rows = Array.from(list.querySelectorAll('.row'));
    const search = document.querySelector('.search');
    const pills = Array.from(document.querySelectorAll('.filter-pills button'));
    const empty = document.querySelector('.no-results');
    let type = 'all';

    const normalize = h => (h || '').replace(/^#/, '').replace(/-/g, '');

    const apply = () => {
      const q = (search ? search.value : '').trim().toLowerCase();
      let shown = 0;
      rows.forEach(r => {
        const okType = type === 'all' || r.dataset.type === type;
        const hay = (r.textContent + ' ' + (r.dataset.tags || '')).toLowerCase();
        const okText = !q || hay.includes(q);
        const show = okType && okText;
        r.style.display = show ? '' : 'none';
        if (show) shown++;
      });
      if (empty) empty.hidden = shown !== 0;
    };

    const setType = t => {
      type = t;
      pills.forEach(p => p.classList.toggle('active', p.dataset.filter === t));
      apply();
    };

    pills.forEach(p => p.addEventListener('click', () => setType(p.dataset.filter)));
    if (search) search.addEventListener('input', apply);

    // per-type counts on pills
    pills.forEach(p => {
      const t = p.dataset.filter;
      const n = t === 'all' ? rows.length : rows.filter(r => r.dataset.type === t).length;
      const c = document.createElement('span');
      c.className = 'count';
      c.textContent = n;
      p.appendChild(c);
    });

    const fromHash = () => {
      const h = normalize(location.hash);
      setType(pills.some(p => p.dataset.filter === h) ? h : 'all');
    };
    window.addEventListener('hashchange', fromHash);
    fromHash();
  }

  // --- Copy buttons (contact email etc.) ----------------------------------
  document.querySelectorAll('.copy-btn[data-copy]').forEach(btn => {
    const original = btn.textContent;
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(btn.dataset.copy);
      btn.textContent = '[ COPIED ]';
      setTimeout(() => { btn.textContent = original; }, 1600);
    });
  });

  // --- Copy button on article code blocks ---------------------------------
  document.querySelectorAll('pre code').forEach(block => {
    const button = document.createElement('button');
    button.className = 'copy-code';
    button.textContent = 'Copy';
    button.addEventListener('click', () => {
      navigator.clipboard.writeText(block.textContent);
      button.textContent = 'Copied!';
      setTimeout(() => { button.textContent = 'Copy'; }, 2000);
    });
    block.parentNode.appendChild(button);
  });

  // --- Back to top ---------------------------------------------------------
  const backToTop = document.getElementById('backToTop');
  if (backToTop && !backToTop.dataset.bound) {
    backToTop.dataset.bound = '1';
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.pageYOffset > 300);
    });
    backToTop.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Smooth scroll for in-page anchors ----------------------------------
  document.querySelectorAll('a[href^="#"]:not(.back-to-top)').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Custom cursor: block caret + lagging reticle + terminal labels ------
  (function customCursor() {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || reduce.matches) return; // desktop mouse only, respect a11y

    const root = document.documentElement;
    const cur = document.createElement('div'); cur.className = 'cursor';
    const caret = document.createElement('div'); caret.className = 'cursor-caret';
    const label = document.createElement('span'); label.className = 'cursor-label';
    cur.appendChild(caret);
    cur.appendChild(label);
    document.body.appendChild(cur);

    let idle, armed = false, lastX = null, lastY = null;
    const POS_KEY = 'cursorPos';
    const arm = () => { if (!armed) { armed = true; root.classList.add('cursor-on'); } };

    // Restore the last pointer position across a same-tab navigation so the caret
    // appears instantly where you clicked — no native-cursor flash between pages.
    try {
      const saved = sessionStorage.getItem(POS_KEY);
      if (saved) {
        const parts = saved.split(',');
        const sx = +parts[0], sy = +parts[1];
        if (isFinite(sx) && isFinite(sy)) {
          lastX = sx; lastY = sy;
          cur.style.transform = 'translate(' + sx + 'px,' + sy + 'px)';
          arm();
        }
      }
    } catch (e) { /* ignore */ }

    window.addEventListener('mousemove', e => {
      lastX = e.clientX; lastY = e.clientY;
      cur.style.transform = 'translate(' + lastX + 'px,' + lastY + 'px)';
      // arm only once we have a real position, so the caret never flashes at a corner
      arm();
      root.classList.add('cursor-moving'); // solid while moving; blinks when idle
      clearTimeout(idle);
      idle = setTimeout(() => root.classList.remove('cursor-moving'), 650);
    }, { passive: true });

    // persist position right before a navigation so the next page can restore it
    const savePos = () => {
      try { if (lastX !== null) sessionStorage.setItem(POS_KEY, lastX + ',' + lastY); } catch (e) {}
    };
    window.addEventListener('pagehide', savePos);
    window.addEventListener('beforeunload', savePos);

    // what the reticle "says" over a given target
    const labelFor = el => {
      if (el.closest('.copy-btn')) return 'copy';
      if (el.closest('.nav-clock')) return 'tz';
      if (el.closest('.theme-switch-wrap')) return 'flip';
      if (el.closest('.filter-pills button')) return 'filter';
      if (el.closest('summary')) {
        const d = el.closest('details');
        return d && d.open ? 'close' : 'expand';
      }
      const a = el.closest('a');
      if (a) return a.target === '_blank' ? 'open ↗' : 'read';
      if (el.closest('button')) return 'go';
      return '';
    };

    const INTERACTIVE = 'a, button, summary, [role="button"], .row';

    document.addEventListener('mouseover', e => {
      const el = e.target;
      // text fields keep a native caret; hide the custom cursor there
      if (el.closest('input, textarea, [contenteditable="true"]')) {
        root.classList.add('cursor-text');
        return;
      }
      const hit = el.closest(INTERACTIVE);
      if (hit) {
        root.classList.add('cursor-hover');
        const txt = labelFor(el);
        label.textContent = txt;
        cur.classList.toggle('has-label', !!txt);
      }
    });

    document.addEventListener('mouseout', e => {
      if (e.target.closest('input, textarea, [contenteditable="true"]')) {
        root.classList.remove('cursor-text');
      }
      if (e.target.closest(INTERACTIVE)) {
        root.classList.remove('cursor-hover');
        cur.classList.remove('has-label');
      }
    });

    document.addEventListener('mousedown', () => root.classList.add('cursor-down'));
    document.addEventListener('mouseup', () => root.classList.remove('cursor-down'));
    document.addEventListener('mouseleave', () => root.classList.add('cursor-hidden'));
    document.addEventListener('mouseenter', () => root.classList.remove('cursor-hidden'));
  })();
});
