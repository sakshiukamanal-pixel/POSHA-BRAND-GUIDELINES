// Poshword gate: a snooker table. No gravity, very little friction, bouncy cushions.
// The wordmark and the entry sit still in the centre, like cushions the icons bounce off.
// Icons can be flicked like a cue ball. The Poshword is checked on the server (middleware.js).
(function () {
  // Working locally (serve.py / serve.ps1)? The site is never locked there, so go straight in.
  // To look at the gate itself locally, open /code/gate/?preview
  if (/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) && !/[?&]preview\b/.test(location.search)) { location.replace('/code/index.html' + location.hash); return; }

  const R2 = 'https://pub-61f336f5041247d4bd3e51e5fd3a1ffb.r2.dev/05-iconography/01-icons/01-gradient-icons/';
  const ICONS = [
    '01-allergens/10-eggs', '04-modify-icons/06-spicy-heat', '02-collection-icons/09-dessert', '02-collection-icons/08-pasta',
    '02-collection-icons/05-sides', '02-collection-icons/02-rice', '02-collection-icons/03-noodles', '02-collection-icons/06-soup',
    '02-collection-icons/04-lentils', '02-collection-icons/01-kid-friendly', '01-allergens/02-meat', '01-allergens/03-coconut',
    '01-allergens/01-sea-food', '01-allergens/08-wheat', '01-allergens/11-milk', '04-modify-icons/04-oiliness',
  ];

  const table = document.getElementById('table');
  const form = document.getElementById('entry');
  const input = document.getElementById('word');
  const msg = document.getElementById('msg');
  const ack = document.getElementById('ack');
  // the promise is remembered on this browser, so it's ticked next time
  try { ack.checked = localStorage.getItem('posha:gate-ack') === '1'; } catch (e) { /* private mode */ }
  ack.addEventListener('change', () => {
    try { localStorage.setItem('posha:gate-ack', ack.checked ? '1' : '0'); } catch (e) { /* private mode */ }
    if (ack.checked) { say('', ''); if (input.value && !typed) autoSend(); }
  });
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const FRICTION = 0.12;  // cloth: share of speed lost per second
  const CRUISE = 70;      // nothing drifts slower than this (px/s), so the table never goes still
  const MAX_V = 1600;
  const CUSHION = 0.92;   // wall bounciness
  const BALL = 0.96;      // bounciness between bodies

  const bodies = [];
  const add = (el, kind, m) => { const b = { el, kind, m, x: 0, y: 0, vx: 0, vy: 0, a: 0, va: 0 }; bodies.push(b); return b; };
  const logo = add(document.getElementById('logo'), 'box', 10);
  const entry = add(form, 'box', 14);
  logo.fixed = entry.fixed = true; // centred and still; icons bounce off them
  ICONS.forEach((p, i) => {
    const el = document.createElement('img');
    el.src = R2 + p + '.png'; el.alt = ''; el.className = 'body icon'; el.draggable = false;
    table.appendChild(el);
    add(el, 'circle', 1).base = 1; // every icon the same size
  });

  let W = 0, H = 0, small = false;
  function layout() {
    W = innerWidth; H = innerHeight; small = W < 700;
    bodies.forEach((b, i) => {
      if (b === logo) { b.w = Math.min(W * (small ? 0.78 : 0.52), 760); b.h = b.w * (373.3 / 1920); b.el.style.width = b.w + 'px'; }
      else if (b === entry) { b.w = Math.min(W - 40, 440); b.el.style.width = b.w + 'px'; b.h = b.el.offsetHeight; } // entry box + promise
      else {
        b.size = (small ? 64 : 96) * b.base; b.r = b.size * 0.44; b.m = b.base * b.base;
        b.el.style.width = b.size + 'px';
        b.off = small && i > 11; b.el.style.display = b.off ? 'none' : '';
      }
      if (b.kind === 'box') {
        b.dw = b.w / 2; b.dh = b.h / 2; // drawn size
        // the wordmark's clearspace from the Logo guidelines: x = half its height, kept clear on every side,
        // so icons bounce off the edge of that space, not the letters
        const pad = b === logo ? b.h / 2 : 0;
        b.hw = b.dw + pad; b.hh = b.dh + pad;
      }
      const hx = b.kind === 'box' ? b.hw : b.r, hy = b.kind === 'box' ? b.hh : b.r;
      b.x = Math.min(Math.max(b.x, hx), W - hx); b.y = Math.min(Math.max(b.y, hy), H - hy);
    });
    // wordmark + entry as one block, centred on the screen
    // the entry sits exactly at the edge of the wordmark's clearspace (x below it)
    const x = logo.h / 2, total = logo.h + x + entry.h;
    logo.x = entry.x = W / 2;
    logo.y = (H - total) / 2 + logo.dh;
    entry.y = logo.y + logo.dh + x + entry.hh;
  }
  const live = () => bodies.filter((b) => !b.off);

  function rack() {
    // logo across the middle, entry under it, icons scattered around and already rolling
    const rnd = (k) => { const s = Math.sin(k * 99.13) * 43758.5; return s - Math.floor(s); };
    live().forEach((b, i) => {
      const ang = rnd(i + 1) * Math.PI * 2, sp = CRUISE * (1.4 + rnd(i + 7) * 1.6);
      b.vx = Math.cos(ang) * sp; b.vy = Math.sin(ang) * sp;
      if (b.fixed) { b.vx = b.vy = 0; return; }
      let tries = 0;
      do { b.x = b.r + rnd(i * 3 + tries + 2) * (W - 2 * b.r); b.y = b.r + rnd(i * 5 + tries + 3) * (H - 2 * b.r); tries++; }
      while (tries < 40 && live().some((o) => o !== b && overlaps(b, o)));
    });
  }
  function overlaps(c, o) {
    if (o.kind === 'box') return Math.abs(c.x - o.x) < o.hw + c.r + 8 && Math.abs(c.y - o.y) < o.hh + c.r + 8;
    return o.x !== 0 && Math.hypot(c.x - o.x, c.y - o.y) < c.r + o.r + 6;
  }

  // ---- cue: drag an icon (or the wordmark) and let go to send it rolling
  let grabbed = null, gx = 0, gy = 0, px = 0, py = 0, lx = 0, ly = 0, lt = 0, tvx = 0, tvy = 0;
  table.addEventListener('pointerdown', (e) => {
    const b = bodies.find((x) => x.el === e.target && !x.fixed);
    if (!b) return;
    e.preventDefault();
    grabbed = b; b.el.classList.add('is-grabbed'); b.el.setPointerCapture(e.pointerId);
    px = lx = e.clientX; py = ly = e.clientY; gx = px - b.x; gy = py - b.y; lt = performance.now(); tvx = tvy = 0;
  });
  table.addEventListener('pointermove', (e) => {
    if (!grabbed) return;
    const t = performance.now(), dt = Math.max(1, t - lt) / 1000;
    px = e.clientX; py = e.clientY;
    tvx = tvx * 0.5 + ((px - lx) / dt) * 0.5; tvy = tvy * 0.5 + ((py - ly) / dt) * 0.5;
    lx = px; ly = py; lt = t;
  });
  const release = () => {
    if (!grabbed) return;
    const s = Math.hypot(tvx, tvy), k = s > MAX_V ? MAX_V / s : 1;
    grabbed.vx = tvx * k; grabbed.vy = tvy * k;
    grabbed.el.classList.remove('is-grabbed'); grabbed = null;
  };
  table.addEventListener('pointerup', release);
  table.addEventListener('pointercancel', release);


  // ---- physics
  function walls(b) {
    const hx = b.kind === 'box' ? b.hw : b.r, hy = b.kind === 'box' ? b.hh : b.r;
    if (b.x - hx < 0) { b.x = hx; b.vx = Math.abs(b.vx) * CUSHION; }
    if (b.x + hx > W) { b.x = W - hx; b.vx = -Math.abs(b.vx) * CUSHION; }
    if (b.y - hy < 0) { b.y = hy; b.vy = Math.abs(b.vy) * CUSHION; }
    if (b.y + hy > H) { b.y = H - hy; b.vy = -Math.abs(b.vy) * CUSHION; }
  }
  const inv = (b) => (b === grabbed || b.fixed ? 0 : 1 / b.m);
  function resolve(a, b, nx, ny, overlap) {
    const ia = inv(a), ib = inv(b), sum = ia + ib;
    if (!sum) return;
    a.x -= nx * overlap * (ia / sum); a.y -= ny * overlap * (ia / sum);
    b.x += nx * overlap * (ib / sum); b.y += ny * overlap * (ib / sum);
    const vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
    if (vn >= 0) return;
    const j = (-(1 + BALL) * vn) / sum;
    a.vx -= j * nx * ia; a.vy -= j * ny * ia; b.vx += j * nx * ib; b.vy += j * ny * ib;
  }
  function collide(a, b) {
    if (a.kind === 'box' && b.kind === 'box') {
      const ox = a.hw + b.hw - Math.abs(a.x - b.x), oy = a.hh + b.hh - Math.abs(a.y - b.y);
      if (ox <= 0 || oy <= 0) return;
      if (ox < oy) resolve(a, b, Math.sign(b.x - a.x) || 1, 0, ox); else resolve(a, b, 0, Math.sign(b.y - a.y) || 1, oy);
      return;
    }
    if (a.kind === 'box' || b.kind === 'box') {
      const box = a.kind === 'box' ? a : b, c = box === a ? b : a;
      const cx = Math.max(box.x - box.hw, Math.min(c.x, box.x + box.hw)), cy = Math.max(box.y - box.hh, Math.min(c.y, box.y + box.hh));
      const dx = c.x - cx, dy = c.y - cy, d = Math.hypot(dx, dy);
      let nx, ny, overlap;
      if (d > 0) { if (d >= c.r) return; nx = dx / d; ny = dy / d; overlap = c.r - d; }
      else {
        const qx = box.hw - Math.abs(c.x - box.x), qy = box.hh - Math.abs(c.y - box.y);
        if (qx < qy) { nx = Math.sign(c.x - box.x) || 1; ny = 0; overlap = qx + c.r; } else { nx = 0; ny = Math.sign(c.y - box.y) || 1; overlap = qy + c.r; }
      }
      if (box === a) resolve(box, c, nx, ny, overlap); else resolve(c, box, -nx, -ny, overlap);
      return;
    }
    const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy), min = a.r + b.r;
    if (d >= min || d === 0) return;
    resolve(a, b, dx / d, dy / d, min - d);
  }

  function step(dt) {
    const list = live();
    for (const b of list) {
      if (b === grabbed) { b.vx = (px - gx - b.x) / dt * 0.4; b.vy = (py - gy - b.y) / dt * 0.4; }
      else if (b.fixed) { b.vx = b.vy = 0; continue; }
      else {
        const k = 1 - FRICTION * dt; b.vx *= k; b.vy *= k;
        const s = Math.hypot(b.vx, b.vy), floor = b.kind === 'box' ? CRUISE * 0.45 : CRUISE;
        if (s < floor) { const ang = s ? Math.atan2(b.vy, b.vx) : Math.random() * Math.PI * 2; const ns = s + (floor - s) * Math.min(1, dt * 1.5); b.vx = Math.cos(ang) * ns; b.vy = Math.sin(ang) * ns; }
        if (s > MAX_V) { b.vx *= MAX_V / s; b.vy *= MAX_V / s; }
      }
      b.x += b.vx * dt; b.y += b.vy * dt;
    }
    for (let it = 0; it < 3; it++) {
      for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) collide(list[i], list[j]);
      list.forEach(walls);
    }
  }
  function draw() {
    for (const b of live()) {
      const w = b.kind === 'box' ? b.dw : b.size / 2, h = b.kind === 'box' ? b.dh : b.size / 2;
      b.el.style.transform = `translate3d(${(b.x - w).toFixed(1)}px, ${(b.y - h).toFixed(1)}px, 0)`;
    }
  }

  let last = 0, raf = 0;
  function frame(t) {
    const dt = Math.min(0.033, (t - (last || t)) / 1000); last = t;
    if (dt > 0) { step(dt / 2); step(dt / 2); }
    draw();
    raf = requestAnimationFrame(frame);
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else if (!raf && !reduced) { last = 0; raf = requestAnimationFrame(frame); } });

  // ---- unlocking
  const say = (t, kind) => { msg.textContent = t; msg.className = 'entry-msg' + (kind ? ' is-' + kind : ''); };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const word = input.value.trim();
    if (!word) return say('Enter the Poshword first.', 'error');
    if (!ack.checked) {
      const box = ack.closest('.ack');
      box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake');
      sent = false;
      return say('Tick the promise first. It’s part of the recipe.', 'error');
    }
    say('Checking…');
    try {
      const r = await fetch('/__unlock', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ word }), credentials: 'same-origin' });
      if (r.ok) {
        form.classList.add('is-open'); say('You’re in. Dinner is served.');
        live().forEach((b) => { if (!b.fixed) { const d = Math.hypot(b.x - entry.x, b.y - entry.y) || 1; b.vx += ((b.x - entry.x) / d) * 1200; b.vy += ((b.y - entry.y) / d) * 1200; } });
        const quick = sent; // filled in by the browser: skip the show and go straight in
        if (!quick) setTimeout(() => table.classList.add('is-leaving'), 200);
        setTimeout(() => { location.pathname.startsWith('/code/gate/') ? location.replace('/' + location.hash) : location.reload(); }, quick ? 150 : 1300);
      } else if (r.status === 401) {
        say('That’s not the Poshword. Try again.', 'error');
        sent = false; typed = true;
        form.classList.remove('shake'); void form.offsetWidth; form.classList.add('shake');
        input.select();
      } else {
        say('Couldn’t check the Poshword right now. Try again in a moment.', 'error');
      }
    } catch (err) {
      say('Couldn’t reach the site. Check your connection and try again.', 'error');
    }
  });

  // A Poshword saved in the browser (Safari / Chrome / 1Password…) is filled in without typing: send it straight away
  let typed = false;
  input.addEventListener('keydown', () => { typed = true; });
  input.addEventListener('input', (e) => { if (!typed || e.inputType === 'insertReplacementText' || !e.inputType) autoSend(); });
  input.addEventListener('animationstart', (e) => { if (e.animationName === 'autofilled') autoSend(); }); // Chrome's autofill hook
  let sent = false;
  function autoSend() { if (sent || !input.value || typed || !ack.checked) return; sent = true; form.requestSubmit(); }
  let polls = 0; const poll = setInterval(() => { if (input.value && !typed) autoSend(); if (++polls > 20 || sent) clearInterval(poll); }, 150);

  addEventListener('resize', layout);
  const start = () => {
    layout(); rack(); layout();
    if (reduced) { draw(); return; }
    raf = requestAnimationFrame(frame);
  };
  if (logo.el.complete) start(); else { logo.el.addEventListener('load', start, { once: true }); logo.el.addEventListener('error', start, { once: true }); }
})();
