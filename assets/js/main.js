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

  // --- Nav: live Surat clock badge ----------------------------------------
  const navList = document.querySelector('.main-nav ul');
  if (navList) {
    const li = document.createElement('li');
    li.className = 'nav-status';
    li.innerHTML = '<span class="dot"></span><span class="nav-time"></span>';
    navList.appendChild(li);

    const timeEl = li.querySelector('.nav-time');
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });
    const tick = () => { timeEl.textContent = 'IN ' + fmt.format(new Date()); };
    tick();
    setInterval(tick, 1000);
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
});
