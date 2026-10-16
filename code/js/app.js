/* ==========================================================================
   Posha Brand Portal — runtime
   Content lives in /database (one file per section), media in /assets.
   You shouldn't need to touch this file to add or edit content.
   ========================================================================== */
(function () {
  'use strict';

  // Where media files come from. Defaults to the local /assets folder; set `assetBase` in
  // database/site.js (e.g. the Cloudflare R2 public URL) to serve them from there instead.
  let ASSETS = '../assets/';
  const DB = '../database/';
  const VIDEO_EXT = ['mp4', 'webm', 'mov', 'm4v'];

  /* ---- Public API used by the database files ---------------------------- */
  const POSHA = (window.POSHA = { site: {}, media: {}, list: [] });
  let loadingFile = null;
  POSHA.section = (s) => {
    s._file = loadingFile;
    POSHA.list.push(s);
  };

  /* ---- Helpers ----------------------------------------------------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const pad = (n) => String(n).padStart(2, '0');
  const esc = (s) =>
    String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const store = {
    get(k, d) { try { const v = localStorage.getItem('posha:' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('posha:' + k, JSON.stringify(v)); } catch (e) { /* private mode */ } },
  };

  // Markdown-lite for inline text: [label](url), **bold**, `code`, line breaks
  function inline(s) {
    let h = esc(s);
    h = h.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, u) => {
      const ext = /^https?:/.test(u);
      return `<a href="${href(u)}"${ext ? ' target="_blank" rel="noopener"' : ''}>${t}</a>`;
    });
    h = h.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    h = h.replace(/`([^`]+)`/g, '<code>$1</code>');
    return h.replace(/\n/g, '<br>');
  }
  function paras(body) {
    if (!body) return '';
    const list = Array.isArray(body) ? body : String(body).split(/\n\s*\n/);
    return list.map((p) => `<p>${inline(p.trim())}</p>`).join('');
  }
  function plain(x) { return Array.isArray(x) ? x.join(' ') : x || ''; }

  // Asset paths: "./x.png" = relative to the current page's asset folder,
  // "brand/x.svg" = relative to /assets, "https://…" = as is.
  function resolve(p, ctx) {
    if (!p) return p;
    if (p === '.') return ctx.dir;
    if (p.startsWith('./')) return ctx.dir + '/' + p.slice(2);
    return p;
  }
  function asset(p) {
    if (/^(https?:|data:|blob:|\/)/.test(p)) return p;
    return ASSETS + p.split('/').map(encodeURIComponent).join('/');
  }
  function href(u) {
    if (/^(https?:|mailto:|tel:|#)/.test(u)) return u;
    return asset(u);
  }
  // Picks readable text on a swatch: true when the colour is light.
  function isLight(hex) {
    const h = String(hex).replace('#', '');
    if (h.length < 6) return true;
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.substr(i, 2), 16));
    return 0.299 * r + 0.587 * g + 0.114 * b > 150;
  }
  // Tint = the colour at p% opacity over white, as a solid HEX
  function tintHex(hex, p) {
    const n = parseInt(String(hex).replace('#', ''), 16);
    return '#' + [(n >> 16) & 255, (n >> 8) & 255, n & 255]
      .map((v) => Math.round(255 + (v - 255) * (p / 100)).toString(16).padStart(2, '0')).join('').toUpperCase();
  }
  // Page-wide tint control: recolours every palette swatch to the chosen tint and updates its values
  function applyTint(p) {
    $$('.chip[data-hex]').forEach((chip) => {
      const base = chip.dataset.hex, h = p === 100 ? base : tintHex(base, p);
      const n = parseInt(h.slice(1), 16), rgbTxt = [(n >> 16) & 255, (n >> 8) & 255, n & 255].join('/');
      chip.style.background = h;
      chip.dataset.copy = h;
      chip.dataset.copyLabel = p === 100 ? h : `${chip.dataset.name} ${p}% · ${h}`;
      chip.classList.toggle('chip--light', isLight(h));
      chip.classList.toggle('chip--dark', !isLight(h));
      const set = (cls, v) => { const el = $(cls, chip); if (el) el.textContent = v; };
      set('.cv-hex', h);
      set('.cv-rgb', rgbTxt);
      // print tints scale each ink by the same percentage
      if (chip.dataset.cmyk) set('.cv-cmyk', chip.dataset.cmyk.split('/').map((v) => Math.round(parseFloat(v) * p / 100)).join('/'));
    });
  }
  // Vertical tint scale: fixed beside the colour blocks (shown only while a palette is on screen).
  // Top = full colour, bottom = lightest tint. Drag, click a value, or use the arrow keys.
  function mountTintBar(bar) {
    bar.dataset.mounted = '1';
    const view = bar.closest('.view');
    if (view) view.classList.add('has-trail'); // leaves room on the right so the scale never covers a swatch
    const steps = $$('.trail-mark', bar).map((m) => +m.dataset.p);
    const n = steps.length, track = $('.trail-track', bar);
    let cur = -1;
    const setT = (t) => bar.style.setProperty('--t', Math.max(0, Math.min(1, t)));
    const tOf = (i) => 1 - i / (n - 1);

    function select(i, snap = true) {
      i = Math.max(0, Math.min(n - 1, i));
      if (snap) setT(tOf(i));
      if (i === cur) return;
      cur = i;
      const p = steps[i];
      $$('.trail-mark', bar).forEach((m, j) => m.classList.toggle('is-on', j === i));
      $('.trail-value', bar).textContent = p === 100 ? 'Full' : p + '%';
      track.setAttribute('aria-valuenow', p);
      track.setAttribute('aria-valuetext', p === 100 ? 'Full colour' : `${p}% tint`);
      applyTint(p);
    }

    const tFromY = (y) => { const r = track.getBoundingClientRect(), pad = 14; return 1 - (y - r.top - pad) / (r.height - pad * 2); };
    track.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      track.focus();
      track.setPointerCapture(e.pointerId);
      bar.classList.add('is-dragging');
      const move = (ev) => { const t = Math.max(0, Math.min(1, tFromY(ev.clientY))); setT(t); select(Math.round((1 - t) * (n - 1)), false); };
      const up = () => {
        bar.classList.remove('is-dragging');
        setT(tOf(cur));
        track.removeEventListener('pointermove', move);
        track.removeEventListener('pointerup', up);
        track.removeEventListener('pointercancel', up);
      };
      move(e);
      track.addEventListener('pointermove', move);
      track.addEventListener('pointerup', up);
      track.addEventListener('pointercancel', up);
    });
    track.addEventListener('keydown', (e) => {
      const d = { ArrowUp: -1, ArrowRight: -1, PageUp: -1, ArrowDown: 1, ArrowLeft: 1, PageDown: 1 }[e.key];
      if (d) { e.preventDefault(); select(cur + d); }
      else if (e.key === 'Home') { e.preventDefault(); select(0); }
      else if (e.key === 'End') { e.preventDefault(); select(n - 1); }
    });
    bar.addEventListener('click', (e) => { const m = e.target.closest('.trail-mark'); if (m) select(+m.dataset.i); });

    // only while colour blocks are on screen
    const palettes = view ? $$('.palette', view) : [];
    if ('IntersectionObserver' in window && palettes.length) {
      const seen = new Set();
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => (en.isIntersecting ? seen.add(en.target) : seen.delete(en.target)));
        bar.classList.toggle('is-shown', seen.size > 0);
      }, { rootMargin: '-15% 0px -15% 0px' });
      palettes.forEach((p) => io.observe(p));
    } else bar.classList.add('is-shown');

    select(0);
  }
  const fileName = (p) => p.split('/').pop();
  const prettyName = (p) => fileName(p).replace(/\.[^.]+$/, '').replace(/^\d+[-_ ]*/, '').replace(/[-_]+/g, ' ');
  const extOf = (p) => (p.split('?')[0].split('.').pop() || '').toLowerCase();

  function embedUrl(u) {
    let m = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    if (m) return 'https://www.youtube.com/embed/' + m[1];
    m = u.match(/vimeo\.com\/(\d+)/);
    if (m) return 'https://player.vimeo.com/video/' + m[1];
    return null;
  }

  function loadScript(src) {
    return new Promise((res) => {
      const el = document.createElement('script');
      el.src = src;
      el.onload = () => res(true);
      el.onerror = () => { console.warn('[posha] could not load', src); res(false); };
      document.head.appendChild(el);
    });
  }

  /* ---- Media ------------------------------------------------------------- */
  const licon = (k) => `<span class="licon licon--${k}" aria-hidden="true"></span>`; // our line icons (see .licon in styles.css)
  function placeholder(path) {
    return `<div class="ph"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.4"/></svg>
      <span class="ph-label">Add media</span>${path ? `<code>assets/${esc(path)}</code>` : ''}</div>`;
  }

  function mediaEl(path, o = {}) {
    if (!path) return placeholder('');
    const embed = embedUrl(path);
    if (embed) return `<iframe src="${embed}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
    const url = asset(path);
    const style = o.fit ? ` style="object-fit:${esc(o.fit)}"` : '';
    if (VIDEO_EXT.includes(extOf(path))) {
      const mode = o.controls ? 'controls' : o.hover ? 'muted loop playsinline data-hover' : 'muted loop playsinline autoplay';
      return `<video src="${url}" data-path="${esc(path)}" ${mode} preload="metadata"${o.poster ? ` poster="${asset(o.poster)}"` : ''}${style}></video>`;
    }
    return `<img src="${url}" data-path="${esc(path)}" alt="${esc(o.alt || prettyName(path))}" loading="lazy"${style}>`;
  }

  // Missing files become a dashed placeholder that shows where the file should go.
  document.addEventListener('error', (e) => {
    const el = e.target;
    if (!el || !el.dataset || !el.dataset.path) return;
    const tmp = document.createElement('div');
    tmp.innerHTML = placeholder(el.dataset.path);
    el.replaceWith(tmp.firstElementChild);
  }, true);

  /* ---- Blocks ------------------------------------------------------------ */
  let uid = 0;
  const cap = (c) => (c ? `<figcaption>${inline(c)}</figcaption>` : '');

  const R = {
    text: (b) => `<div class="text text--${b.size || 'md'}">${paras(b.body)}</div>`,

    heading: (b) => `<h3 class="block-heading">${inline(b.text)}</h3>`,

    image: (b, c) => {
      const style = [b.bg && `--bg:${b.bg}`, b.aspect && `--aspect:${b.aspect}`, b.padding && `--pad:${b.padding}`, b.maxWidth && `max-width:${b.maxWidth}`].filter(Boolean).join(';');
      return `<figure class="figure${b.bg ? ' figure--bg' : ''}${b.aspect ? ' figure--aspect' : ''}" style="${esc(style)}">
        <div class="figure-media">${mediaEl(resolve(b.src, c), { alt: b.alt, fit: b.fit })}</div>${cap(b.caption)}</figure>`;
    },

    video: (b, c) => `<figure class="figure figure--video" style="--aspect:${esc(b.aspect || '16/9')}">
        <div class="figure-media">${mediaEl(resolve(b.src, c), { controls: b.controls !== false, poster: b.poster && resolve(b.poster, c) })}</div>${cap(b.caption)}</figure>`,

    grid: (b, c) => {
      const folder = b.folder ? resolve(b.folder, c) : null;
      const seen = new Set();
      let items = (b.items || []).map((it) => (typeof it === 'string' ? { src: it } : it)).map((it) => ({ ...it, src: resolve(it.src, c) }));
      if (folder) items = items.concat((POSHA.media[folder] || []).map((f) => ({ src: folder + '/' + f })));
      items = items.filter((it) => (seen.has(it.src) ? false : seen.add(it.src)));
      if (!items.length) return emptyState(folder);
      const cols = b.columns || 4;
      const vars = `--cols:${cols};--cols-md:${Math.min(cols, 3)};--cols-sm:${Math.min(cols, 2)};--ratio:${b.ratio || '1'}`;
      return `<div class="grid grid--${b.style || 'plain'}" style="${esc(vars)}" data-gallery>
        ${items.map((it) => {
          // Coded images: { code: 'PSH-FS-01', title: 'Carrot Halwa', tags: [...], shape: 'circle' | 'cover' }
          const caption = it.code || it.title
            ? `<figcaption class="tile-cap">${it.code ? `<span class="tile-code">${esc(it.code)}</span>` : ''}<span class="tile-title">${esc(it.title || '')}</span></figcaption>`
            : cap(it.caption || (b.captions === 'filename' ? prettyName(it.src) : ''));
          const search = [it.code, it.title, (it.tags || []).join(' '), prettyName(it.src)].join(' ').toLowerCase();
          const shape = it.shape || b.shape;
          const isVideo = VIDEO_EXT.includes(extOf(it.src));
          return `<figure class="tile${shape ? ' tile--' + shape : ''}${isVideo ? ' tile--video' : ''}" data-search="${esc(search)}"${it.code ? ` data-code="${esc(it.code)}"` : ''}>
            <div class="tile-media">${mediaEl(it.src, { hover: true, fit: b.fit, alt: it.title, poster: it.poster && resolve(it.poster, c) })}</div>${caption}</figure>`;
        }).join('')}</div>`;
    },

    // Tabs. Optional per tab: id (deep link #/section/page/<id>), heading (replaces the page H1), keywords (for gallery search).
    tabs: (b, c) => {
      const id = 'tabs' + ++uid;
      return `<div class="tabs tabs--${b.style || 'line'}" data-tabs${b.syncHeading ? ' data-sync-heading' : ''}>
        <div class="tab-bar" role="tablist">${b.tabs.map((t, i) =>
          `<button class="tab${i ? '' : ' is-active'}" role="tab" data-tab="${i}"${t.id ? ` data-tab-id="${esc(t.id)}"` : ''}${t.heading ? ` data-heading="${esc(t.heading)}"` : ''} aria-controls="${id}-${i}" aria-selected="${!i}">${esc(t.label)}</button>`).join('')}</div>
        ${b.tabs.map((t, i) => `<div class="tab-panel blocks" id="${id}-${i}" role="tabpanel" data-panel="${i}" data-label="${esc(t.label)}" data-keywords="${esc([t.label, t.heading, (t.keywords || []).join(' ')].join(' ').toLowerCase())}"${i ? ' hidden' : ''}>${blocks(t.blocks, c)}</div>`).join('')}
      </div>`;
    },

    // Search box for the tabs below it: category words switch tabs, anything else filters images by code/name/tags.
    gallerysearch: (b) => `<div class="gsearch" data-gsearch>
        <label class="gsearch-box">
          ${licon('search')}
          <input type="search" placeholder="${esc(b.placeholder || 'Search the gallery')}" aria-label="Search the gallery" autocomplete="off">
          <button type="button" class="gsearch-clear" aria-label="Clear search" hidden>&times;</button>
        </label>
        <div class="gsearch-status" aria-live="polite"></div>
      </div>`,

    columns: (b, c) => `<div class="columns" style="--cols:${b.columns.length}">${b.columns.map((col) => `<div class="blocks">${blocks(col, c)}</div>`).join('')}</div>`,

    colors: (b) => `<div class="swatches" style="--cols:${b.columns || 4}">${b.items.map((s) => `
        <button class="swatch" type="button" data-copy="${esc(s.hex || '')}" title="Click to copy ${esc(s.hex || '')}">
          <span class="swatch-chip" style="background:${esc(s.hex)}"></span>
          <span class="swatch-meta"><strong>${esc(s.name)}</strong>
            ${['hex', 'rgb', 'cmyk', 'pantone'].filter((k) => s[k]).map((k) => `<span><em>${k.toUpperCase()}</em>${esc(s[k])}</span>`).join('')}
            ${s.note ? `<span class="swatch-note">${inline(s.note)}</span>` : ''}
          </span></button>`).join('')}</div>`,

    // Full-bleed colour blocks; click copies HEX. layout: 'weighted' (widths from `weight`) or 'grid'.
    palette: (b) => {
      const row = b.layout === 'weighted';
      const style = row ? `--ratio:${b.ratio || '2.6/1'}` : `--cols:${b.columns || 5};--ratio:${b.ratio || '1.1/1'}`;
      const chip = (s) => `
        <button class="chip ${isLight(s.hex) ? 'chip--light' : 'chip--dark'}${s.center ? ' chip--center' : ''}" type="button"
          style="background:${esc(s.hex)}" data-copy="${esc(s.hex)}" data-hex="${esc(s.hex)}" data-cmyk="${esc(s.cmyk || '')}" data-name="${esc(s.name)}" aria-label="${esc(s.name)} ${esc(s.hex)} — click to copy">
          <span class="chip-head"><span class="chip-name">${esc(s.name)}</span>${s.alias ? `<span class="chip-alias">${esc(s.alias)}</span>` : ''}</span>
          <span class="chip-copy">Copy</span>
          <span class="chip-values">${[['RGB', s.rgb, 'rgb'], ['CMYK', s.cmyk, 'cmyk'], ['HEX', s.hex, 'hex'], ['PMS', s.pantone, 'pms']].filter((v) => v[1]).map((v) =>
            `<span><em>${v[0]}</em><b class="cv-${v[2]}">${esc(v[1])}</b></span>`).join('')}</span>
        </button>`;
      // weighted rows size each colour by usage; the page-wide tint bar recolours every swatch
      return `<div class="palette palette--${row ? 'weighted' : 'grid'}${b.align === 'end' ? ' palette--end' : ''}" style="${esc(style)}">${b.items.map((s) =>
        `<div class="pitem"${row ? ` style="flex:${s.weight || 1} 1 0"` : ''}>${chip(s)}</div>`).join('')}</div>`;
    },

    // One tint control for the whole page: { type: 'tintbar', steps: [100, 80, 60, 40, 20] }
    // A vertical scale fixed beside the colour blocks; full colour at the top.
    tintbar: (b) => {
      const steps = b.steps || [100, 80, 60, 40, 20], n = steps.length;
      return `<div class="trail" data-tintbar role="group" aria-label="Colour tint">
        <span class="trail-k">Tint</span>
        <div class="trail-scale">
          <div class="trail-marks">${steps.map((p, i) =>
            `<button type="button" class="trail-mark" style="--p:${1 - i / (n - 1)}" data-i="${i}" data-p="${p}" tabindex="-1" aria-label="${p === 100 ? 'Full colour' : p + '% tint'}"><em>${p}</em></button>`).join('')}</div>
          <div class="trail-track" role="slider" tabindex="0" aria-label="Colour tint" aria-orientation="vertical" aria-valuemin="${Math.min(...steps)}" aria-valuemax="${Math.max(...steps)}">
            <span class="trail-fill"><span class="trail-handle"></span></span>
          </div>
        </div>
        <span class="trail-value">Full</span>
      </div>`;
    },

    // Gradient cards: soft, mesh-like swatches with number, stop colours and name. Click copies the CSS.
    gradients: (b, c) => `<div class="gcards" style="--cols:${b.columns || b.items.length}">${b.items.map((g, i) => {
        const css = `linear-gradient(${g.angle || 135}deg, ${g.stops.join(', ')})`;
        const first = g.stops[0], last = g.stops[g.stops.length - 1];
        // a soft highlight + a deeper corner make the flat gradient feel dimensional
        const mesh = `radial-gradient(120% 90% at 18% 12%, ${first}cc 0%, transparent 60%), radial-gradient(90% 80% at 90% 95%, ${last} 0%, transparent 65%), ${css}`;
        return `<figure class="gcard">
          <button class="gcard-swatch" type="button" style="background:${esc(mesh)}" data-copy="${esc(css)}" data-copy-label="${esc(g.name)} CSS" aria-label="${esc(g.name)} — click to copy CSS">
            ${g.src ? `<img src="${asset(resolve(g.src, c))}" alt="" onerror="this.remove()">` : ''}<span class="chip-copy">Copy CSS</span>
          </button>
          <figcaption>
            <span class="gcard-num">${pad(i + 1)}</span>
            <span class="gcard-stops">${g.stops.filter((_, k, a) => k === 0 || k === a.length - 1 || k === Math.floor(a.length / 2)).map(esc).join(' · ')}</span>
            <span class="gcard-name">${esc(g.name)}</span>
          </figcaption>
        </figure>`;
      }).join('')}</div>`,

    // Icon cards grouped by sub-folder. PNG + SVG with the same name pair up for download.
    iconset: (b, c) => {
      const base = resolve(b.folder, c);
      const keys = Object.keys(POSHA.media).filter((k) => k === base || k.startsWith(base + '/')).sort();
      if (!keys.length) return emptyState(base);
      const labels = b.labels || {};
      return keys.map((k) => {
        const slug = fileName(k);
        const title = keys.length > 1 && k !== base ? labels[slug] || sentence(prettyName(k)) : '';
        // optional `names`: { 'file-slug': 'Readable name' } for files whose names don't read well (e.g. artboard exports)
        const icons = pairIcons(k, POSHA.media[k]).map((i) => (b.names && b.names[i.slug] ? { ...i, name: b.names[i.slug], file: 'posha-' + b.names[i.slug].toLowerCase().replace(/[^a-z0-9]+/g, '-') } : i));
        return `<section class="icon-group">
          ${title ? `<h3 class="icon-group-title">${esc(title)}</h3>` : ''}
          <div class="icon-grid" style="--cols:${b.columns || 4};--cols-md:${Math.min(b.columns || 4, 3)};--cols-sm:${Math.min(b.columns || 4, 2)}">${icons.map(iconCard).join('')}</div>
        </section>`;
      }).join('');
    },

    // Downloadable logo variants: { name, png, svg, bg, note } — click a card for PNG / SVG
    // bg: a colour, or 'checker-light' / 'checker-dark' to show the logo on a transparency checkerboard
    logoset: (b, c) => `<div class="logo-grid${b.size === 'small' ? ' logo-grid--small' : ''}" style="--cols:${b.columns || 3}">${b.items.map((it) => iconCard({
        name: it.name, note: it.note,
        bg: /^checker/.test(it.bg || '') ? null : it.bg,
        cls: 'logo-card' + (it.bg === 'checker-light' ? ' checker' : it.bg === 'checker-dark' ? ' checker checker--dark is-dark' : ''),
        slug: it.file || ((b.label || 'wordmark').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + it.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')),
        file: it.file || fileName(it.svg || it.png).replace(/\.[^.]+$/, ''), // download keeps the real file name
        png: it.png && resolve(it.png, c), svg: it.svg && resolve(it.svg, c),
        display: resolve(it.display || it.svg || it.png, c), // on-page image (defaults to the vector); downloads stay full-size
      })).join('')}</div>`,

    // Key facts in a row (the app's "per serving nutrients" style): { type: 'facts', items: [{ k: 'Rights', v: 'Fully owned' }] }
    facts: (b) => `<dl class="facts">${b.items.map((f) => `<div><dt>${esc(f.k)}</dt><dd>${inline(f.v)}</dd></div>`).join('')}</dl>`,

    // A shared folder (Drive / zip) with tags, a button to open it and a strip of preview frames.
    // { type: 'collection', tags: ['Photos', { label: 'Main source', tone: 'key' | 'low' | 'warn' }], link: { href, label }, items: ['./a/frame-01.jpg', …], columns: 4 (optional; default = one row), footnote }
    collection: (b, c) => {
      const tag = (t) => (typeof t === 'string' ? { label: t } : t);
      const link = b.link || {};
      const ext = /^https?:/.test(link.href || '');
      return `<div class="coll">
        <div class="coll-head">
          <div class="coll-tags">${(b.tags || []).map(tag).map((t) => `<span class="coll-tag${t.tone ? ' coll-tag--' + t.tone : ''}">${esc(t.label)}</span>`).join('')}</div>
          ${link.href ? `<a class="coll-link" href="${esc(href(resolve(link.href, c)))}"${ext ? ' target="_blank" rel="noopener"' : ' download'}>
            <span>${esc(link.label || 'Open in Google Drive')}</span><span class="coll-arrow" aria-hidden="true">${licon('right')}</span></a>` : ''}
        </div>
        <div class="coll-grid" data-gallery style="--n:${b.columns || Math.min((b.items || []).length, 6) || 6};--n-sm:${b.columns && b.columns % 3 ? 2 : 3}">${(b.items || []).map((it) => {
          const src = resolve(typeof it === 'string' ? it : it.src, c);
          return `<figure class="tile coll-item" data-search="${esc((b.search || '') + ' ' + prettyName(src))}"><div class="tile-media">${mediaEl(src, { alt: it.alt || b.alt || '' })}</div></figure>`;
        }).join('')}</div>
        ${b.footnote ? `<p class="coll-foot">${inline(b.footnote)}</p>` : ''}
      </div>`;
    },

    // Minimum size, shown at actual size: { type: 'minsize', src, px: 56, mm: 15, ratio: 373.3 / 1920 }
    minsize: (b, c) => {
      const tall = (b.px * (b.ratio || 373.3 / 1920)).toFixed(0), mmTall = (b.mm * (b.ratio || 373.3 / 1920)).toFixed(1);
      return `<div class="minsize">
        <div class="minsize-cell">
          <span class="minsize-k">Digital minimum</span>
          <div class="minsize-art"><img src="${asset(resolve(b.src, c))}" alt="Wordmark at its minimum digital size" style="width:${b.px}px"><span class="minsize-dim" style="width:${b.px}px"></span></div>
          <strong class="minsize-v">${b.px} px wide</strong><span class="minsize-sub">≈ ${tall} px tall · shown at actual size</span>
        </div>
        <div class="minsize-cell">
          <span class="minsize-k">Print minimum</span>
          <div class="minsize-art"><img src="${asset(resolve(b.src, c))}" alt="Wordmark at its minimum print size" style="width:${b.mm}mm"><span class="minsize-dim" style="width:${b.mm}mm"></span></div>
          <strong class="minsize-v">${b.mm} mm wide</strong><span class="minsize-sub">≈ ${mmTall} mm tall · thinnest stroke ≈ ${(b.mm * 0.033).toFixed(1)} mm</span>
        </div>
      </div>`;
    },

    // { type: 'logodiagram', variant: 'clearspace' | 'lockup', caption }
    logodiagram: (b) => `<figure class="figure diagram-figure${b.variant === 'anatomy' ? ' diagram-figure--wide' : ''}">${b.variant === 'lockup' ? lockupSvg() : b.variant === 'anatomy' ? anatomySvg() : clearspaceSvg()}${cap(b.caption)}</figure>`,

    // { type: 'misuse', items: [{ art: 'rotate' | 'outline' | 'stroke' | 'pattern', caption }] }
    misuse: (b) => `<div class="misuse" style="--cols:${b.columns || 2}">${b.items.map((it) => `
        <figure class="misuse-item">
          <div class="misuse-card"><span class="misuse-x" aria-label="Don’t"></span>${misuseSvg(it.art)}</div>
          <figcaption>${inline(it.caption)}</figcaption>
        </figure>`).join('')}</div>`,

    bullets: (b) => `<ul class="bullets">${b.items.map((t) => `<li>${inline(t)}</li>`).join('')}</ul>`,

    // Section title in Epika italic: { type: 'displayheading', text }
    displayheading: (b) => `<h3 class="display-heading">${inline(b.text)}</h3>`,

    // Scaling matrix: items [{ src, size }] shown at size × scale; groups [{ label, from, to }] (1-based columns)
    scalematrix: (b, c) => {
      const scale = b.scale || 2;
      const cols = b.items.map((it) => `${it.size + 44}fr`).join(' ');
      // icons share one unit so they stay true to scale, and shrink together to fit the column (no sideways scroll)
      const units = b.items.reduce((t, it) => t + it.size + 44, 0);
      const icons = b.items.map((it, i) => `<div class="smx-icon" style="grid-column:${i + 1}"><img src="${asset(resolve(it.src, c))}" alt="${esc(it.alt || '')}" style="--sz:${it.size}" loading="lazy"></div>`).join('');
      const ticks = b.items.map((_, i) => `<div class="smx-tick${i === b.items.length - 1 ? ' is-last' : ''}" style="grid-column:${i + 1}"></div>`).join('');
      const sizes = b.items.map((it, i) => `<div class="smx-size" style="grid-column:${i + 1}">${it.size}×${it.size}</div>`).join('');
      const groups = (b.groups || []).map((g) => `<div class="smx-group" style="grid-column:${g.from} / ${g.to + 1}"><span>${esc(g.label)}</span></div>`).join('');
      return `${b.slider ? sizeSlider(b, c) : ''}<div class="smx-wrap"><div class="smx" style="grid-template-columns:${cols};--units:${units};--scale:${scale}px">${icons}${ticks}${sizes}${groups}</div></div>`;
    },

    // { type: 'iconconstruction', labels: [three callouts], caption }
    iconconstruction: (b) => `<figure class="figure construct-figure">${iconConstructionSvg(b.labels || ['Bulgy shape language', 'Stroke width 1pt', 'Rounded terminals'])}${cap(b.caption)}</figure>`,

    // Style principles: items [{ num, title, body, src, overlay: 'arc' | 'ring' | 'outline' }]
    principles2: (b, c) => `<div class="iprinciples">${b.items.map((it) => `
        <figure class="iprinciple">
          <div class="iprinciple-art">${principleArt(resolve(it.src, c), it.overlay)}</div>
          <figcaption>
            <span class="iprinciple-num">${esc(it.num)}</span>
            <strong class="iprinciple-title">${esc(it.title)}</strong>
            <p>${inline(it.body)}</p>
          </figcaption>
        </figure>`).join('')}</div>`,

    // Photoshoot grid: 3 columns, tiles can be wide (cols: 2) and/or tall (rows: 2).
    // items [{ src, code, title, tags, cols, rows }] — hover shows the code, click opens full size.
    photoshoot: (b, c) => `<div class="pshoot" data-gallery>${b.items.map((it) => {
        const search = [it.code, it.title, it.desc, (it.tags || []).join(' ')].join(' ').toLowerCase();
        // photos keep their own proportions (masonry columns); the caption sits underneath with a short description
        return `<figure class="tile pshoot-item" data-search="${esc(search)}"${it.code ? ` data-code="${esc(it.code)}"` : ''}>
          <div class="tile-media">${mediaEl(resolve(it.src, c), { alt: it.desc || it.title })}</div>
          <figcaption class="tile-cap pshoot-cap"><span class="tile-code">${esc(it.code || '')}</span><span class="tile-title">${esc(it.title || '')}</span>${it.desc ? `<span class="pshoot-desc">${esc(it.desc)}</span>` : ''}</figcaption>
        </figure>`;
      }).join('')}</div>`,

    // Product timeline: items [{ year, model, name, src, code, story: [p1, p2] }]
    // Models sit on a rail; hovering one fades in its story. Each model is downloadable.
    modeltimeline: (b, c) => `<div class="mtl" data-gallery style="--n:${b.items.length}">${b.items.map((it, i) => {
        const src = resolve(it.src, c);
        const search = [it.code, it.year, it.model, it.name, 'old model prototype history evolution', (it.tags || []).join(' ')].join(' ').toLowerCase();
        const pos = i === 0 ? ' is-first' : i === b.items.length - 1 ? ' is-last' : '';
        return `<figure class="mtl-item tile${pos}" tabindex="0" data-search="${esc(search)}"${it.code ? ` data-code="${esc(it.code)}"` : ''}>
          <div class="mtl-media tile-media">${mediaEl(src, { alt: `${it.name} (${it.year})` })}</div>
          <div class="mtl-rail" aria-hidden="true"><span class="mtl-dot"></span></div>
          <figcaption class="mtl-cap"><span class="mtl-year">${esc(it.year)}</span><span class="mtl-model">${esc(it.model)} · ${esc(it.name)}</span></figcaption>
          <div class="mtl-pop" role="tooltip">
            <span class="mtl-pop-head">${esc(it.year)} — ${esc(it.name)}</span>
            ${paras(it.story)}
            <a class="mtl-dl" href="${asset(src)}" download="${esc(fileName(src))}">Download PNG <span aria-hidden="true">↓</span></a>
          </div>
        </figure>`;
      }).join('')}</div>`,

    // Shoot header: { type: 'shoot', number: '01', title, brief, meta: ['Lifestyle', '12 photos'] }
    shoot: (b) => `<header class="shoot-head">
        <span class="shoot-num">Shoot ${esc(b.number || '')}</span>
        <h3 class="display-heading">${inline(b.title)}</h3>
        ${b.brief ? `<div class="shoot-brief">${paras(b.brief)}</div>` : ''}
        ${b.meta ? `<div class="shoot-meta">${b.meta.map((m) => `<span>${esc(m)}</span>`).join('')}</div>` : ''}
      </header>`,

    // 12-column image layout: items [{ src, span, caption }]
    mosaic: (b, c) => `<div class="mosaic" data-gallery>${b.items.map((it) => `
        <figure class="mosaic-item tile" style="grid-column:span ${it.span || 6}" data-search="${esc((it.caption || '').toLowerCase())}">
          <div class="mosaic-media">${mediaEl(resolve(it.src, c), { alt: it.caption })}</div>
          ${it.caption ? `<figcaption>${inline(it.caption)}</figcaption>` : ''}
        </figure>`).join('')}</div>`,

    // Live type tester. fonts: [{ name, role, family, styles: [{ label, weight, style }], upper, tracking }]
    typetester: (b) => {
      const size = b.size || 72;
      const btn = (attr, label, title, on) => `<button type="button" class="tt-btn${on ? ' is-on' : ''}" ${attr} title="${title}" aria-label="${title}">${label}</button>`;
      const alignIcon = (lines) => `<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">${lines.map((l, i) => `<line x1="${l[0]}" y1="${5 + i * 3.5}" x2="${l[1]}" y2="${5 + i * 3.5}" stroke="currentColor" stroke-width="1.5"/>`).join('')}</svg>`;
      return `<div class="tt" data-tester data-sample="${esc(b.sample || 'Dinner, done.')}">
        <div class="tt-bar">
          <label class="tt-input">
            <input type="text" placeholder="${esc(b.placeholder || 'Type here to preview the fonts…')}" maxlength="140" aria-label="Preview text" autocomplete="off" spellcheck="false">
            <button type="button" class="tt-clear" aria-label="Clear text" hidden>&times;</button>
          </label>
          <div class="tt-controls">
            <div class="tt-size">
              ${btn('data-tt="smaller"', '−', 'Smaller')}
              <input type="range" min="32" max="160" step="1" value="${size}" aria-label="Font size">
              ${btn('data-tt="bigger"', '+', 'Bigger')}
              <output>${size}px</output>
            </div>
            <div class="tt-group" role="group" aria-label="Alignment">
              ${btn('data-align="left"', alignIcon([[3, 17], [3, 13], [3, 17], [3, 11]]), 'Align left', true)}
              ${btn('data-align="center"', alignIcon([[3, 17], [5, 15], [3, 17], [6, 14]]), 'Align centre')}
              ${btn('data-align="right"', alignIcon([[3, 17], [7, 17], [3, 17], [9, 17]]), 'Align right')}
            </div>
            ${btn('data-tt="theme" aria-pressed="false"', '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><circle cx="10" cy="10" r="6.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10 3.5a6.5 6.5 0 0 1 0 13z" fill="currentColor"/></svg>', 'Light / dark')}
          </div>
          ${(b.samples || []).length ? `<div class="tt-samples">${b.samples.map((s) => `<button type="button" class="tt-chip" data-sample="${esc(s)}">${esc(s)}</button>`).join('')}</div>` : ''}
        </div>
        <div class="tt-rows">${b.fonts.map((f) => `
          <section class="tt-row">
            <header class="tt-head">
              <span class="tt-role">${esc(f.role)}</span>
              <strong class="tt-name">${esc(f.name)}</strong>
              ${f.styles.length > 1
                ? `<select class="tt-style" aria-label="${esc(f.name)} style">${f.styles.map((st) => `<option value="${st.weight}|${st.style || 'normal'}">${esc(st.label)}</option>`).join('')}</select>`
                : `<span class="tt-style tt-style--fixed">${esc(f.styles[0].label)}</span>`}
            </header>
            <div class="tt-preview" data-scale="${f.scale || 1}" style="font-family:${esc(f.family)};font-weight:${f.styles[0].weight};font-style:${f.styles[0].style || 'normal'};font-size:${Math.round(size * (f.scale || 1))}px;${f.upper ? 'text-transform:uppercase;' : ''}${f.tracking ? `letter-spacing:${esc(f.tracking)};` : ''}${f.lineHeight ? `line-height:${f.lineHeight};` : ''}"></div>
          </section>`).join('')}
        </div>
      </div>`;
    },

    // Type scale: [{ group } | { role, font: 'Epika' | 'Roobert' | 'Roobert Mono', italic, rem, lh, weight, sample }]
    // Roobert Mono rows are always set in caps; big sizes shrink on narrow screens.
    typescale: (b) => `<div class="tscale">${b.items.map((r) => {
        if (r.group) return `<h4 class="ts-group">${esc(r.group)}</h4>`;
        const mono = r.font === 'Roobert Mono';
        const family = { Epika: 'var(--font-display)', 'Roobert Mono': 'var(--font-mono)' }[r.font] || 'var(--font-ui)';
        const fs = r.rem > 2.5 ? `min(${r.rem}rem, ${(r.rem * 2.6).toFixed(2)}vw)` : `${r.rem}rem`;
        const stat = (k, v) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`;
        return `<div class="ts-row">
          <div class="ts-meta">
            <span class="ts-role">${esc(r.role)}</span>
            <span class="ts-font">${esc(r.font)}${r.italic ? ' Italic' : ''}</span>
            <dl class="ts-stats">${stat('Size', r.rem + 'rem')}${stat('Px', Math.round(r.rem * 16))}${stat('Line', r.lh.toFixed(1))}</dl>
          </div>
          <div class="ts-sample" style="font-family:${family};font-size:${fs};line-height:${r.lh};${r.italic ? 'font-style:italic;' : ''}${r.weight ? `font-weight:${r.weight};` : ''}${mono ? 'text-transform:uppercase;letter-spacing:.06em;' : ''}">${esc(r.sample || b.sample || 'Dinner, done.')}</div>
        </div>`;
      }).join('')}</div>`,

    // Design tokens with a visual: { type: 'tokens', kind: 'space' | 'radius' | 'border' | 'size' | 'shadow' | 'color',
    //   prefix: '--cui-space-', columns: ['Companion', 'Device'], items: [{ name: 'md', values: ['16px', '17.06px'], note }] }
    // The first value drives the visual (for colours, every value gets a chip). Click a name to copy var(--token).
    tokens: (b) => {
      const cols = b.columns || ['Companion', 'Device'];
      const vis = (vals) => {
        const v = esc(vals[0]);
        switch (b.kind) {
          case 'space': return `<span class="tk-bar" style="width:min(${v}, 100%)"></span>`;
          case 'radius': return `<span class="tk-radius" style="border-top-left-radius:min(${v}, 64px)"></span>`;
          case 'border': return `<span class="tk-border" style="border-top-width:${v}"></span>`;
          case 'size': return `<span class="tk-size" style="width:${v};height:${v}"></span>`;
          case 'shadow': return `<span class="tk-shadow" style="box-shadow:${esc(b.css ? b.css[vals[0]] || vals[0] : vals[0])}"></span>`;
          case 'color': return vals.map((c) => `<span class="tk-chip" style="background:${esc(c)}"></span>`).join('');
          default: return '';
        }
      };
      return `<div class="tokens tokens--${esc(b.kind || 'plain')}" style="--n:${cols.length}">
        <div class="tk-row tk-head"><span>Token</span><span></span>${cols.map((c) => `<span>${esc(c)}</span>`).join('')}</div>
        ${b.items.map((t) => {
          const name = `${b.prefix || ''}${t.name}`;
          return `<div class="tk-row">
            <span class="tk-id"><button class="tk-name" type="button" data-copy="var(${esc(name)})" title="Click to copy var(${esc(name)})">${esc(name)}</button>${t.note ? `<span class="tk-note">${inline(t.note)}</span>` : ''}</span>
            <span class="tk-vis">${vis(t.values)}</span>
            ${t.values.map((v) => `<span class="tk-val">${esc(v)}</span>`).join('')}
          </div>`;
        }).join('')}
      </div>`;
    },

    // Live Culinary UI component, rendered by code/cui-preview.html from the live playground:
    // { type: 'cui', component: 'button', variants: ['Primary', 'Secondary'] (default: all), min: 240 (card width, px) }
    // The Companion / Device and Light / Dark switches reload the preview in that app and theme.
    cui: (b) => {
      const qs = (app, theme) => `cui-preview.html?c=${encodeURIComponent(b.component)}${b.variants ? `&v=${encodeURIComponent(b.variants.join(','))}` : ''}${b.min ? `&min=${b.min}` : ''}&app=${app}&theme=${theme}`;
      const seg = (key, opts) => `<div class="cui-seg" role="group">${opts.map(([v, l], i) => `<button type="button" data-cui-${key}="${v}" aria-pressed="${i === 0}">${l}</button>`).join('')}</div>`;
      return `<div class="cui-embed" data-cui-src="${esc(qs('{app}', '{theme}'))}">
        <div class="cui-bar">${seg('app', [['companion', 'Companion'], ['device', 'Device']])}${seg('theme', [['light', 'Light'], ['dark', 'Dark']])}
          <a class="cui-open" href="https://culinary-ui-playground.pages.dev/playground/#/${esc(b.component)}" target="_blank" rel="noopener">Open in playground &#8599;</a></div>
        <iframe class="cui-frame" src="${esc(qs('companion', 'light'))}" title="Culinary UI ${esc(b.component)} variants" loading="lazy"></iframe>
      </div>`;
    },

    // How a Posha gradient is built in Illustrator: Freeform gradient, Points mode.
    // { type: 'gradientbuild', name, points: [{ hex, name, x, y, spread }] } — x / y in % of the shape, spread in % (Illustrator's Spread).
    gradientbuild: (b) => {
      // a CSS stand-in for Illustrator's freeform blend: one soft radial wash per point over a diagonal base
      const fill = `${b.points.map((p) => `radial-gradient(circle at ${p.x}% ${p.y}%, ${p.hex} 0%, ${p.hex}00 ${p.spread || 60}%)`).join(', ')}, linear-gradient(135deg, ${b.points.map((p) => p.hex).join(', ')})`;
      const sel = b.points.length - 1; // the "selected" point, whose Spread shows in the panel
      const icon = {
        linear: '<svg viewBox="0 0 20 14"><defs><linearGradient id="gbl"><stop offset="0" stop-color="currentColor" stop-opacity=".15"/><stop offset="1" stop-color="currentColor"/></linearGradient></defs><rect x="1" y="1" width="18" height="12" rx="1.5" fill="url(#gbl)"/></svg>',
        radial: '<svg viewBox="0 0 20 14"><defs><radialGradient id="gbr"><stop offset="0" stop-color="currentColor" stop-opacity=".15"/><stop offset="1" stop-color="currentColor"/></radialGradient></defs><rect x="1" y="1" width="18" height="12" rx="1.5" fill="url(#gbr)"/></svg>',
        freeform: '<svg viewBox="0 0 20 14"><rect x="1" y="1" width="18" height="12" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.2"/><circle cx="5" cy="4.5" r="1.8" fill="currentColor"/><circle cx="11" cy="8" r="1.8" fill="currentColor"/><circle cx="15.5" cy="10" r="1.8" fill="currentColor"/></svg>',
      };
      return `<div class="gb">
        <figure class="gb-step">
          <figcaption><span class="num">01</span>Pick three palette colours</figcaption>
          <div class="gb-anchors">${b.points.map((p) => `<div class="gb-anchor"><span class="gb-chip" style="background:${esc(p.hex)}"></span><strong>${esc(p.name)}</strong><span class="num">${esc(p.hex)}</span></div>`).join('')}</div>
        </figure>
        <figure class="gb-step gb-step--panel">
          <figcaption><span class="num">02</span>Freeform gradient · place the points</figcaption>
          <div class="gb-panel">
            <div class="gb-panel-head"><span>Gradient</span>
              <span class="gb-field"><em>Type</em><span class="gb-types"><i title="Linear">${icon.linear}</i><i title="Radial">${icon.radial}</i><i class="is-on" title="Freeform">${icon.freeform}</i></span></span>
              <span class="gb-field"><em>Draw</em><span class="gb-radio is-on">Points</span><span class="gb-radio">Lines</span></span>
            </div>
            <div class="gb-canvas" style="background:${esc(fill)}">
              ${b.points.map((p, i) => `<span class="gb-point${i === sel ? ' is-sel' : ''}" style="left:${p.x}%;top:${p.y}%;background:${esc(p.hex)}" title="${esc(p.name)}"></span>`).join('')}
              <span class="gb-spread" style="left:${b.points[sel].x}%;top:${b.points[sel].y}%;--r:${b.points[sel].spread || 60}%"></span>
            </div>
            <div class="gb-panel-foot"><span class="gb-field"><em>Spread</em>${b.points[sel].spread || 60}%</span><span class="gb-field"><em>Points</em>${b.points.length}</span></div>
          </div>
          <p class="gb-note">Select the shape, set Type to Freeform and Draw to Points, then click on the shape to drop a point. Double-click a point to give it a palette colour.</p>
        </figure>
        <figure class="gb-step">
          <figcaption><span class="num">03</span>Adjust and apply</figcaption>
          <div class="gb-result" style="background:${esc(fill)}"><span>${esc(b.name)}</span></div>
          <p class="gb-note">Drag points to move the light; Spread widens a point’s reach. Darkest colour top left, lightest bottom right.</p>
        </figure>
      </div>`;
    },

    // A big brand line set straight on the page: { type: 'statement', label, text, sub, font: 'display' | 'ui', align: 'center' | 'left' }
    // text supports **bold** (use with font: 'ui'); an array of lines sets one line each.
    statement: (b) => `<figure class="statement statement--${b.font || 'display'} statement--${b.align || 'left'} statement--${b.tone || 'cream'}">
        ${b.label ? `<figcaption class="statement-label">${esc(b.label)}</figcaption>` : ''}
        <p class="statement-text">${[].concat(b.text).map(inline).join('<br>')}</p>
        ${b.sub ? `<p class="statement-sub">${inline(b.sub)}</p>` : ''}
      </figure>`,

    // Lines in the wild: { type: 'quotes', items: [{ text, trait, source }] } — set large in Epika, with the trait as a chip
    quotes: (b) => `<div class="quotes">${b.items.map((q) => `<figure class="quote">
        <blockquote>${inline(q.text)}</blockquote>
        <figcaption>${q.trait ? `<span class="quote-trait">${esc(q.trait)}</span>` : ''}${q.source ? `<span class="quote-source">${esc(q.source)}</span>` : ''}</figcaption>
      </figure>`).join('')}</div>`,

    // Say this, not that: { type: 'rewrites', items: [{ not, say, why }] }
    rewrites: (b) => `<div class="rewrites">${b.items.map((r) => `<div class="rewrite">
        <div class="rw-not"><span class="rw-label">Not</span><p>${inline(r.not)}</p></div>
        <div class="rw-say"><span class="rw-label">Say</span><p>${inline(r.say)}</p>${r.why ? `<em>${inline(r.why)}</em>` : ''}</div>
      </div>`).join('')}</div>`,

    // Code sample: { type: 'code', body: '…' }
    code: (b) => `<pre class="code-sample"><code>${esc([].concat(b.body).join('\n'))}</code></pre>`,

    // Do / Don't boxes: { do: [...], dont: [...] }
    rules: (b) => `<div class="rules">
        <div class="rule-box"><span class="rule-label">Do</span><ul>${b.do.map((t) => `<li>${inline(t)}</li>`).join('')}</ul></div>
        <div class="rule-box rule-box--dont"><span class="rule-label">Don’t</span><ul>${b.dont.map((t) => `<li>${inline(t)}</li>`).join('')}</ul></div>
      </div>`,

    type: (b) => `<div class="specimens">${b.items.map((t) => `
        <div class="specimen">
          <div class="specimen-meta"><span class="num">${esc(t.role || '')}</span><strong>${esc(t.name)}</strong><span>${esc(t.weights || '')}</span>${t.note ? `<span>${inline(t.note)}</span>` : ''}</div>
          <div class="specimen-sample" style="font-family:${esc(t.family)};${t.weight ? `font-weight:${esc(t.weight)};` : ''}${t.size ? `font-size:${esc(t.size)};` : ''}">${esc(t.sample || 'Aa Bb Cc 0123')}</div>
        </div>`).join('')}</div>`,

    dodont: (b, c) => `<div class="dodont" style="--cols:${b.columns || 2}">${b.items.map((it) => `
        <figure class="dd dd--${it.kind === 'do' ? 'do' : 'dont'}">
          <div class="dd-media">${mediaEl(resolve(it.src, c))}</div>
          <figcaption><span class="dd-label">${it.kind === 'do' ? 'Do' : 'Don’t'}</span>${inline(it.caption || '')}</figcaption>
        </figure>`).join('')}</div>`,

    // Numbered cards. Optional `icon`: a path inside /assets (e.g. one of the gradient icons), shown beside the number.
    // Optional `image`: a path inside /assets, shown at the top of the card (best for cut-out product shots).
    list: (b) => `<ol class="principles" style="--cols:${b.columns || 3}">${b.items.map((it, i) => `
        <li>${it.image ? `<span class="p-media"><img src="${asset(it.image)}" alt="${esc(it.alt || '')}" loading="lazy"></span>` : ''}${it.icon ? `<span class="p-head"><img class="p-icon" src="${asset(it.icon)}" alt="" loading="lazy"><span class="num">${pad(i + 1)}</span></span>` : `<span class="num">${pad(i + 1)}</span>`}<strong>${inline(it.title)}</strong>${it.body ? `<p>${inline(it.body)}</p>` : ''}</li>`).join('')}</ol>`,

    links: (b, c) => `<div class="links">${b.items.map((l) => {
        const u = href(resolve(l.href, c));
        const ext = /^https?:/.test(l.href) || !/^#/.test(l.href);
        return `<a class="link-card" href="${esc(u)}"${ext ? ' target="_blank" rel="noopener"' : ''}${l.download ? ' download' : ''}>
          <span><strong>${esc(l.label)}</strong>${l.note ? `<em>${esc(l.note)}</em>` : ''}</span><span class="arrow">${l.download ? '&#8595;' : licon('right')}</span></a>`;
      }).join('')}</div>`,

    note: (b) => `<div class="note note--${b.tone || 'info'}">${b.title ? `<strong>${inline(b.title)}</strong>` : ''}${paras(b.body)}</div>`,

    placeholder: (b) => b.style === 'box'
      ? `<div class="todo-box"><span class="num">${esc(b.body || 'Placeholder · Awaiting content')}</span></div>`
      : `<div class="todo"><span class="num">To be added</span>${paras(b.body || 'Content for this section is coming soon.')}</div>`,

    divider: () => '<hr class="divider">',

    html: (b) => b.html || '',
  };

  const sentence = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  // Size explorer (scalematrix with `slider: true`): a vertical scale, smallest at the bottom.
  // Each stop is one icon from the chart; the icon pops to its real size (× scale) on a fixed, faint grid.
  function sizeSlider(b, c) {
    const items = b.items.map((it, i) => ({
      src: asset(resolve(it.src, c)), size: it.size, name: it.alt || prettyName(it.src),
      group: ((b.groups || []).find((g) => i + 1 >= g.from && i + 1 <= g.to) || {}).label || '',
    }));
    const n = items.length;
    // one label per size (the first stop of each size), a small tick for every stop
    const marks = items.map((it, i) => {
      const first = !i || items[i - 1].size !== it.size;
      return `<button type="button" class="ssl-mark${first ? ' has-label' : ''}" style="--p:${i / (n - 1)}" data-i="${i}" tabindex="-1" aria-label="${it.size} × ${it.size} · ${esc(it.name)}">${first ? `<em>${it.size}</em>` : ''}</button>`;
    }).join('');
    return `<div class="ssl" data-sizeslider data-items="${esc(JSON.stringify(items))}">
      <div class="ssl-stage">
        <div class="ssl-frame"><span class="ssl-dim"></span></div>
        <div class="ssl-read" aria-live="polite"><span class="ssl-k">Size</span><strong class="ssl-num"></strong><span class="ssl-meta"></span></div>
        <span class="ssl-hint">Drag the scale</span>
      </div>
      <div class="ssl-control">
        <button type="button" class="ssl-step" data-d="1" aria-label="Bigger icon">+</button>
        <div class="ssl-scale">
          <div class="ssl-marks">${marks}</div>
          <div class="ssl-track" role="slider" tabindex="0" aria-label="Icon size" aria-orientation="vertical" aria-valuemin="${items[0].size}" aria-valuemax="${items[n - 1].size}">
            <span class="ssl-fill"><span class="ssl-handle"></span></span>
          </div>
        </div>
        <button type="button" class="ssl-step" data-d="-1" aria-label="Smaller icon">−</button>
      </div>
    </div>`;
  }

  function mountSizeSlider(root) {
    root.dataset.mounted = '1';
    const items = JSON.parse(root.dataset.items);
    const n = items.length;
    items.forEach((it) => { new Image().src = it.src; }); // preload so every swap is instant
    const stage = $('.ssl-stage', root), frame = $('.ssl-frame', root), track = $('.ssl-track', root);
    let cur = -1, k = 3;

    const fit = () => {
      k = stage.clientWidth < 380 ? 2.2 : 3;
      stage.style.setProperty('--k', k);
      if (cur >= 0) frame.style.width = frame.style.height = items[cur].size * k + 'px';
    };
    const setT = (t) => root.style.setProperty('--t', Math.max(0, Math.min(1, t)));

    function show(i, snap = true) {
      i = Math.max(0, Math.min(n - 1, i));
      if (snap) setT(i / (n - 1));
      if (i === cur) return;
      const up = i > cur, it = items[i];
      // outgoing icon shrinks/grows away and fades; incoming pops in from the other direction
      $$('.ssl-icon', frame).forEach((old) => {
        old.classList.remove('is-in');
        old.classList.add('is-out');
        setTimeout(() => old.remove(), 420);
      });
      const img = document.createElement('img');
      img.className = 'ssl-icon is-in';
      img.alt = it.name;
      img.src = it.src;
      img.style.setProperty('--from', cur < 0 ? 0.9 : up ? 0.6 : 1.35);
      frame.appendChild(img);
      frame.style.width = frame.style.height = it.size * k + 'px';
      $('.ssl-dim', frame).textContent = `${it.size}`;
      const read = $('.ssl-read', root);
      $('.ssl-num', read).textContent = `${it.size} × ${it.size}`;
      $('.ssl-meta', read).textContent = [it.group, it.name].filter(Boolean).join(' · ');
      read.classList.remove('is-swap'); void read.offsetWidth; read.classList.add('is-swap');
      $$('.ssl-mark', root).forEach((m) => m.classList.toggle('is-on', +m.dataset.i === i));
      track.setAttribute('aria-valuenow', it.size);
      track.setAttribute('aria-valuetext', `${it.size} by ${it.size}, ${it.name}`);
      cur = i;
    }

    // drag anywhere on the track: the fill follows the pointer, the icon changes at each stop, release snaps
    const tFromY = (y) => {
      const r = track.getBoundingClientRect(), pad = 16;
      return 1 - (y - r.top - pad) / (r.height - pad * 2);
    };
    track.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      track.focus();
      track.setPointerCapture(e.pointerId);
      root.classList.add('is-dragging');
      const move = (ev) => { const t = Math.max(0, Math.min(1, tFromY(ev.clientY))); setT(t); show(Math.round(t * (n - 1)), false); };
      const up = () => {
        root.classList.remove('is-dragging');
        setT(cur / (n - 1));
        track.removeEventListener('pointermove', move);
        track.removeEventListener('pointerup', up);
        track.removeEventListener('pointercancel', up);
      };
      move(e);
      track.addEventListener('pointermove', move);
      track.addEventListener('pointerup', up);
      track.addEventListener('pointercancel', up);
    });
    track.addEventListener('keydown', (e) => {
      const step = { ArrowUp: 1, ArrowRight: 1, PageUp: 1, ArrowDown: -1, ArrowLeft: -1, PageDown: -1 }[e.key];
      if (step) { e.preventDefault(); show(cur + step); }
      else if (e.key === 'Home') { e.preventDefault(); show(0); }
      else if (e.key === 'End') { e.preventDefault(); show(n - 1); }
    });
    // + / − and the size labels
    root.addEventListener('click', (e) => {
      const btn = e.target.closest('.ssl-step');
      if (btn) show(cur + +btn.dataset.d);
      const mark = e.target.closest('.ssl-mark');
      if (mark) show(+mark.dataset.i);
    });

    fit();
    show(0);
    if ('ResizeObserver' in window) new ResizeObserver(fit).observe(stage);
  }

  function pairIcons(folder, files) {
    const map = new Map();
    files.forEach((f) => {
      const ext = extOf(f);
      if (ext !== 'png' && ext !== 'svg') return;
      const key = f.replace(/\.[^.]+$/, '');
      if (!map.has(key)) map.set(key, { name: prettyName(f), slug: key.replace(/^\d+[-_ ]*/, '') });
      map.get(key)[ext] = folder + '/' + f;
    });
    return Array.from(map.values());
  }

  const DL_ICON = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19h14" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // i: { name, slug, png, svg } + optional bg (card background), file (download name), cls (extra class), note
  function iconCard(i) {
    const file = i.file || 'posha-' + i.slug;
    const png = i.png
      ? `<a role="menuitem" href="${asset(i.png)}" download="${esc(file)}.png"><span>Download as PNG</span><em>.png</em></a>`
      : `<button role="menuitem" type="button" data-svg2png="${esc(i.svg)}" data-file="${esc(file)}.png"><span>Download as PNG</span><em>.png</em></button>`;
    // Real .svg → direct download. PNG only → generate an SVG that wraps the PNG.
    const svg = i.svg
      ? `<a role="menuitem" href="${asset(i.svg)}" download="${esc(file)}.svg"><span>Download as SVG</span><em>.svg</em></a>`
      : `<button role="menuitem" type="button" data-dl-svg="${esc(i.png)}" data-file="${esc(file)}.svg"><span>Download as SVG</span><em>.svg</em></button>`;
    const dark = i.bg && !isLight(i.bg);
    return `<div class="icon-card${i.cls ? ' ' + i.cls : ''}${dark ? ' is-dark' : ''}" data-icon data-search="${esc(i.slug + ' ' + i.name.toLowerCase())}" tabindex="0" aria-label="${esc(i.name)} — click to download"${i.bg ? ` style="background:${esc(i.bg)}"` : ''}>
      <span class="icon-name">${esc(i.name)}${i.note ? `<em>${esc(i.note)}</em>` : ''}</span>
      <div class="icon-art">${mediaEl(i.display || i.png || i.svg, { alt: i.name })}</div>
      <button class="icon-dl" type="button" aria-label="Download ${esc(i.name)}" aria-haspopup="menu">${DL_ICON}</button>
      <div class="icon-menu" role="menu" hidden>${png}${svg}</div>
    </div>`;
  }

  // Rasterises an SVG to a 1024px PNG (used when only the SVG exists).
  function svgToPng(path, name) {
    const img = new Image();
    img.onload = () => {
      const size = 1024, r = img.naturalWidth / img.naturalHeight || 1;
      const cv = document.createElement('canvas');
      cv.width = r >= 1 ? size : Math.round(size * r);
      cv.height = r >= 1 ? Math.round(size / r) : size;
      cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
      cv.toBlob((blob) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = name;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      }, 'image/png');
    };
    img.onerror = () => toast('Couldn’t convert this SVG');
    img.src = asset(path);
  }

  // Builds SVG markup for an icon: the file itself if it's an SVG, otherwise the PNG embedded in an SVG.
  async function iconSvgMarkup(path) {
    const res = await fetch(asset(path));
    if (!res.ok) throw new Error('fetch failed');
    if (extOf(path) === 'svg') return res.text();
    const blob = await res.blob();
    const dataUrl = await new Promise((ok, fail) => {
      const fr = new FileReader();
      fr.onload = () => ok(fr.result);
      fr.onerror = fail;
      fr.readAsDataURL(blob);
    });
    const size = await new Promise((ok) => {
      const img = new Image();
      img.onload = () => ok([img.naturalWidth, img.naturalHeight]);
      img.onerror = () => ok([512, 512]);
      img.src = dataUrl;
    });
    const [w, h] = size;
    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
      `<image width="${w}" height="${h}" href="${dataUrl}" xlink:href="${dataUrl}"/></svg>`;
  }

  function downloadSvg(path, file) {
    iconSvgMarkup(path).then((s) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([s], { type: 'image/svg+xml' }));
      a.download = file;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }, () => toast(/^https?:/.test(ASSETS) ? 'Couldn’t create the SVG — the asset bucket needs CORS enabled' : 'Couldn’t create the SVG — open the site from its web address, not as a file'));
  }

  /* ---- Footer + icon playground ---------------------------------------- */
  function renderFooter() {
    const f = POSHA.site.footer;
    const el = $('#siteFooter');
    if (!f || !el) return;
    el.innerHTML = `
      <div class="sf-top">
        <div class="sf-brand">
          <span class="sf-label">${esc(POSHA.site.name || 'Brand Guidelines')}</span>
          ${f.note ? `<p>${inline(f.note)}</p>` : ''}
        </div>
        <nav class="sf-links" aria-label="Posha online">${(f.links || []).map((l) => l.href && l.href !== '#'
          ? `<a href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)} ${licon('right')}</a>`
          : `<span class="sf-todo" title="Link to be added">${esc(l.label)} ${licon('right')}</span>`).join('')}</nav>
        <div class="sf-meta">
          <button type="button" class="sf-top-btn" data-scroll-top>Back to top ${licon('up')}</button>
          <button type="button" class="sf-top-btn" data-feedback>Send feedback</button>
          ${f.copyright ? `<span>${esc(f.copyright)}</span>` : ''}
        </div>
      </div>
      ${f.playground ? `<div class="pg-stage" aria-label="Playground — drag and throw the icons and the logo"><span class="pg-hint">Drag · throw · play</span></div>` : ''}`;
    $('[data-scroll-top]', el).addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
    if (f.playground) mountPlayground($('.pg-stage', el), f.playground);
  }

  // A tiny 2D physics world: circles (icons) + one box (the logo), soft gravity, air drag,
  // cursor repulsion, drag-and-throw. Runs only while the footer is on screen.
  function mountPlayground(stage, cfg) {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Feather-like: low gravity + strong air drag → slow, steady drifting (top speed ≈ G / AIR ≈ 120 px/s)
    const G = 260;          // gravity (px/s²)
    const AIR = 2.1;        // air drag per second
    const SWAY = 70;        // side-to-side drift while floating (px/s²)
    const REST = 0.25;      // bounciness
    const REPEL_R = 150;    // cursor influence radius (px)
    const REPEL = 6500;     // cursor push strength
    const MAX_V = 1200;
    const TILT_EASE = 1.2;  // how slowly icons lean / settle back (lower = slower, smoother)

    const bodies = [];
    const mk = (el, kind, base) => { stage.appendChild(el); const b = { el, kind, base, x: 0, y: 0, vx: 0, vy: 0, a: 0, va: 0, inside: false }; bodies.push(b); return b; };

    const logoEl = document.createElement('img');
    logoEl.src = asset(cfg.logo); logoEl.alt = 'Posha'; logoEl.className = 'pg-body pg-logo'; logoEl.draggable = false;
    const logo = mk(logoEl, 'box', 1);
    (cfg.icons || []).forEach((src, i) => {
      const el = document.createElement('img');
      el.src = asset(src); el.alt = ''; el.className = 'pg-body pg-icon'; el.draggable = false;
      mk(el, 'circle', 0.8 + ((i * 37) % 10) / 22); // varied sizes, deterministic
    });

    let W = 0, H = 0, small = false;
    function layout() {
      W = stage.clientWidth; H = stage.clientHeight;
      small = W < 700;
      const k = small ? 0.62 : 1;
      bodies.forEach((b, i) => {
        if (b.kind === 'box') {
          b.w = Math.min(W * 0.62, 380 * k); b.h = b.w * (373.3 / 1920);
          b.hw = b.w / 2; b.hh = b.h / 2; b.m = 7;
          b.el.style.width = b.w + 'px';
        } else {
          b.size = 92 * b.base * k; b.r = b.size * 0.42; b.m = b.base * b.base;
          b.el.style.width = b.size + 'px';
          // fewer icons on small screens
          b.off = small && i > 10;
          b.el.style.display = b.off ? 'none' : '';
        }
      });
    }
    const live = () => bodies.filter((b) => !b.off);

    function spawn() {
      const list = live();
      list.forEach((b, i) => {
        const half = b.kind === 'box' ? b.hw : b.r;
        b.x = half + ((i * 0.618) % 1) * (W - half * 2);
        b.y = -half - i * (H * 0.045) - (b.kind === 'box' ? H * 0.2 : 0);
        b.vx = (Math.random() - 0.5) * 30; b.vy = 40;
        b.tilt = (Math.random() - 0.5) * 0.5; // resting tilt, about ±14°
        b.a = b.tilt;
        b.phase = Math.random() * Math.PI * 2; // each one sways on its own rhythm
        b.inside = false;
      });
    }
    function settleStatic() { // reduced motion: a calm resting arrangement
      const list = live(); let x = 20;
      list.forEach((b) => {
        if (b.kind === 'box') { b.x = W / 2; b.y = H - b.hh - 8; b.a = 0; return; }
        b.x = x + b.r; b.y = H - b.r - (b.x > W / 2 - logo.hw - b.r && b.x < W / 2 + logo.hw + b.r ? logo.h + 8 : 0); b.a = 0;
        x += b.r * 2 + 6; if (x > W - 40) x = 30;
      });
    }

    // pointer state (stage coordinates)
    const ptr = { x: 0, y: 0, over: false };
    let grabbed = null, gx = 0, gy = 0, lastX = 0, lastY = 0, lastT = 0, throwVX = 0, throwVY = 0;
    const toLocal = (e) => { const r = stage.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };

    stage.addEventListener('pointermove', (e) => { const p = toLocal(e); ptr.x = p.x; ptr.y = p.y; ptr.over = true; wake(); });
    stage.addEventListener('pointerleave', () => { ptr.over = false; });
    stage.addEventListener('pointerdown', (e) => {
      const b = bodies.find((x) => x.el === e.target);
      if (!b) return;
      e.preventDefault();
      grabbed = b; b.el.classList.add('is-grabbed'); b.el.setPointerCapture(e.pointerId);
      const p = toLocal(e); gx = p.x - b.x; gy = p.y - b.y; lastX = p.x; lastY = p.y; lastT = performance.now(); throwVX = throwVY = 0;
      wake();
    });
    stage.addEventListener('pointermove', (e) => {
      if (!grabbed) return;
      const p = toLocal(e), t = performance.now(), dt = Math.max(1, t - lastT) / 1000;
      throwVX = throwVX * 0.6 + ((p.x - lastX) / dt) * 0.4; throwVY = throwVY * 0.6 + ((p.y - lastY) / dt) * 0.4;
      lastX = p.x; lastY = p.y; lastT = t;
    });
    const release = () => {
      if (!grabbed) return;
      const s = Math.hypot(throwVX, throwVY), k = s > MAX_V ? MAX_V / s : 1;
      grabbed.vx = throwVX * k; grabbed.vy = throwVY * k;
      grabbed.el.classList.remove('is-grabbed'); grabbed = null;
    };
    stage.addEventListener('pointerup', release);
    stage.addEventListener('pointercancel', release);

    function collideWalls(b) {
      const hx = b.kind === 'box' ? b.hw : b.r, hy = b.kind === 'box' ? b.hh : b.r;
      if (!b.inside && b.y - hy > 0) b.inside = true;
      if (b.y + hy > H) {
        b.y = H - hy;
        if (b.vy > 0) b.vy = b.vy < 40 ? 0 : -b.vy * REST;
        b.vx *= 0.985; // floor friction
      }
      if (b.inside && b.y - hy < 0) { b.y = hy; if (b.vy < 0) b.vy = -b.vy * REST; }
      if (b.x - hx < 0) { b.x = hx; if (b.vx < 0) b.vx = -b.vx * REST; }
      if (b.x + hx > W) { b.x = W - hx; if (b.vx > 0) b.vx = -b.vx * REST; }
    }

    function resolve(a, b, nx, ny, overlap) {
      const ia = a === grabbed ? 0 : 1 / a.m, ib = b === grabbed ? 0 : 1 / b.m, sum = ia + ib;
      if (!sum) return;
      a.x -= nx * overlap * (ia / sum); a.y -= ny * overlap * (ia / sum);
      b.x += nx * overlap * (ib / sum); b.y += ny * overlap * (ib / sum);
      const vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
      if (vn >= 0) return;
      // slow contacts don't bounce at all, so a resting pile stays still instead of jittering
      const e = vn < -60 ? REST : 0;
      const j = (-(1 + e) * vn) / sum;
      a.vx -= j * nx * ia; a.vy -= j * ny * ia; b.vx += j * nx * ib; b.vy += j * ny * ib;
      // contact friction: damp sliding along the touching surfaces
      const tx = -ny, ty = nx, vt = (b.vx - a.vx) * tx + (b.vy - a.vy) * ty;
      const jt = (vt * 0.15) / sum;
      a.vx += jt * tx * ia; a.vy += jt * ty * ia; b.vx -= jt * tx * ib; b.vy -= jt * ty * ib;
    }
    function collide(a, b) {
      if (a.kind === 'box' || b.kind === 'box') {
        const box = a.kind === 'box' ? a : b, c = box === a ? b : a;
        const cx = Math.max(box.x - box.hw, Math.min(c.x, box.x + box.hw));
        const cy = Math.max(box.y - box.hh, Math.min(c.y, box.y + box.hh));
        const dx = c.x - cx, dy = c.y - cy, d = Math.hypot(dx, dy);
        let nx, ny, overlap; // normal points from the box towards the circle
        if (d > 0) {
          if (d >= c.r) return;
          nx = dx / d; ny = dy / d; overlap = c.r - d;
        } else {
          // circle centre is inside the box: push it out the shortest way
          const px = box.hw - Math.abs(c.x - box.x), py = box.hh - Math.abs(c.y - box.y);
          if (px < py) { nx = Math.sign(c.x - box.x) || 1; ny = 0; overlap = px + c.r; }
          else { nx = 0; ny = Math.sign(c.y - box.y) || 1; overlap = py + c.r; }
        }
        if (box === a) resolve(box, c, nx, ny, overlap); else resolve(c, box, -nx, -ny, overlap);
        return;
      }
      const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy), min = a.r + b.r;
      if (d >= min || d === 0) return;
      resolve(a, b, dx / d, dy / d, min - d);
    }

    let simT = 0;
    function step(dt) {
      simT += dt;
      const list = live();
      for (const b of list) {
        if (b === grabbed) {
          // follow the pointer (velocity-based so it shoves whatever it touches)
          b.vx = (ptr.x - gx - b.x) / dt * 0.35; b.vy = (ptr.y - gy - b.y) / dt * 0.35;
        } else {
          b.vy += G * dt;
          // feather sway while airborne (not resting on the floor)
          const hy = b.kind === 'box' ? b.hh : b.r;
          if (b.y + hy < H - 2 && b.vy > 0) {
            const s = Math.sin(simT * 1.3 + (b.phase || 0));
            b.vx += s * SWAY * dt * (b.kind === 'box' ? 0.4 : 1);
          }
          if (ptr.over && !grabbed) {
            const dx = b.x - ptr.x, dy = b.y - ptr.y, d = Math.hypot(dx, dy) || 1;
            const reach = REPEL_R + (b.kind === 'box' ? b.hh : b.r);
            if (d < reach) { const f = (REPEL * (1 - d / reach) ** 2) / b.m; b.vx += (dx / d) * f * dt; b.vy += (dy / d) * f * dt; }
          }
          const drag = 1 - AIR * dt; b.vx *= drag; b.vy *= drag;
        }
        b.x += b.vx * dt; b.y += b.vy * dt;
        if (b.kind === 'box') {
          // the wordmark leans gently with its motion and levels out at rest
          const target = Math.max(-0.14, Math.min(0.14, b.vx * 0.00035));
          b.a += (target - b.a) * Math.min(1, 5 * dt);
        } else {
          // No free spinning: each icon keeps its own slight tilt and only leans a little
          // while it moves, easing slowly back — calm, never windmilling.
          const lean = Math.max(-0.3, Math.min(0.3, b.vx * 0.0012));
          b.a += ((b.tilt || 0) + lean - b.a) * Math.min(1, TILT_EASE * dt);
        }
      }
      for (let it = 0; it < 2; it++) {
        for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) collide(list[i], list[j]);
        list.forEach(collideWalls);
      }
    }

    function draw() {
      for (const b of live()) {
        const hx = b.kind === 'box' ? b.hw : b.size / 2, hy = b.kind === 'box' ? b.hh : b.size / 2;
        b.el.style.transform = `translate3d(${(b.x - hx).toFixed(1)}px, ${(b.y - hy).toFixed(1)}px, 0) rotate(${b.a}rad)`;
      }
    }

    let raf = 0, last = 0, visible = false, started = false, quiet = 0;
    function frame(t) {
      raf = 0;
      if (!visible) return;
      const dt = Math.min(0.033, (t - (last || t)) / 1000); last = t;
      for (let s = 0; s < 3; s++) step(dt / 3);
      draw();
      // stop the loop once everything has come to rest (and nothing is interacting)
      const moving = live().some((b) => Math.abs(b.vx) + Math.abs(b.vy) > 6 || !b.inside);
      quiet = moving || grabbed || ptr.over ? 0 : quiet + 1;
      if (quiet < 30) raf = requestAnimationFrame(frame);
    }
    function wake() { if (!raf && visible && !reduced) { last = 0; quiet = 0; raf = requestAnimationFrame(frame); } }

    layout();
    if (reduced) { settleStatic(); draw(); }
    new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !started && !reduced) { started = true; spawn(); }
      if (visible) wake();
    }, { threshold: 0.15 }).observe(stage);
    addEventListener('resize', () => {
      const oldW = W; layout();
      live().forEach((b) => { b.x = (b.x / (oldW || W)) * W; });
      if (reduced) { settleStatic(); draw(); } else wake();
    });
  }

  /* ---- Type tester ------------------------------------------------------ */
  // Each preview keeps a list of live character spans. On every change we diff the old
  // and new text: shared start/end stay put, removed letters fade + close up, new ones rise in.
  function setTesterText(row, text) {
    const next = Array.from(text);
    const old = row.chars;
    let p = 0;
    while (p < old.length && p < next.length && old[p] === next[p]) p++;
    let s = 0;
    while (s < old.length - p && s < next.length - p && old[old.length - 1 - s] === next[next.length - 1 - s]) s++;

    const gone = row.live.splice(p, old.length - p - s);
    gone.forEach((n) => {
      n.style.maxWidth = n.getBoundingClientRect().width + 'px';
      n.classList.remove('in');
      n.classList.add('out');
      const kill = () => n.remove();
      n.addEventListener('animationend', kill, { once: true });
      setTimeout(kill, 500);
    });

    const ref = row.live[p] || null;
    const added = next.slice(p, next.length - s).map((ch, i) => {
      const span = document.createElement('span');
      span.className = 'ch in';
      span.textContent = ch;
      span.style.animationDelay = Math.min(i * 16, 260) + 'ms';
      span.addEventListener('animationend', () => span.classList.remove('in'), { once: true });
      row.el.insertBefore(span, ref);
      return span;
    });
    row.live.splice(p, 0, ...added);
    row.chars = next;
  }

  function mountTester(root) {
    root.dataset.mounted = '1';
    const input = $('.tt-input input', root);
    const range = $('.tt-size input', root);
    const output = $('.tt-size output', root);
    const sample = root.dataset.sample;
    const rows = $$('.tt-preview', root).map((el) => ({ el, live: [], chars: [] }));

    const render = () => {
      rows.forEach((r) => setTesterText(r, input.value || sample));
      $('.tt-clear', root).hidden = !input.value;
    };
    const setSize = (v) => {
      v = Math.max(+range.min, Math.min(+range.max, v));
      range.value = v;
      output.textContent = v + 'px';
      // each font keeps its role's proportion: `scale` on the font (headline 1, body 0.5, caption 0.25…)
      rows.forEach((r) => (r.el.style.fontSize = Math.round(v * (+r.el.dataset.scale || 1)) + 'px'));
    };

    input.addEventListener('input', render);
    range.addEventListener('input', () => setSize(+range.value));
    root.addEventListener('click', (e) => {
      const t = e.target.closest('button');
      if (!t || !root.contains(t)) return;
      if (t.dataset.tt === 'smaller') setSize(+range.value - 8);
      if (t.dataset.tt === 'bigger') setSize(+range.value + 8);
      if (t.dataset.tt === 'theme') {
        const on = root.classList.toggle('tt--dark');
        t.classList.toggle('is-on', on);
        t.setAttribute('aria-pressed', on);
      }
      if (t.dataset.align) {
        $$('[data-align]', root).forEach((b) => b.classList.toggle('is-on', b === t));
        rows.forEach((r) => (r.el.style.textAlign = t.dataset.align));
      }
      if (t.dataset.sample) { input.value = t.dataset.sample; render(); input.focus(); }
      if (t.classList.contains('tt-clear')) { input.value = ''; render(); input.focus(); }
    });
    $$('.tt-style', root).forEach((sel) => sel.addEventListener('change', () => {
      const [weight, style] = sel.value.split('|');
      const el = $('.tt-preview', sel.closest('.tt-row'));
      el.style.fontWeight = weight;
      el.style.fontStyle = style;
      el.animate([{ opacity: 0.35 }, { opacity: 1 }], { duration: 420, easing: 'ease-out' });
    }));
    render();
  }

  function mountWidgets() {
    $$('[data-tester]:not([data-mounted])').forEach(mountTester);
    $$('[data-tintbar]:not([data-mounted])').forEach(mountTintBar);
    $$('[data-sizeslider]:not([data-mounted])').forEach(mountSizeSlider);
  }

  function closeIconMenus(except) {
    $$('.icon-card.is-open').forEach((card) => {
      if (card === except) return;
      card.classList.remove('is-open');
      $('.icon-menu', card).hidden = true;
    });
  }

  /* ---- Wordmark diagrams (drawn from the official wordmark path) -------- */
  // Units are wordmark units: W = 1920, H = 373.3, x = H / 2 (the clearspace unit)
  function wm(attrs = '') {
    const m = POSHA.wordmark;
    return m ? `<path d="${m.d}" ${attrs}/>` : '';
  }
  const C = { ink: '#231F20', grey: '#484848', paper: '#FFFCF8', light: '#F1F2ED', warm: '#F1E9DE', yellow: '#FFBD00', red: '#FF2E20', navy: '#232D4C' };

  function clearspaceSvg() {
    const W = 1920, H = 373.3, x = H / 2;
    const L = -x, T = -x, R = W + x, B = H + x;           // the clearspace zone
    const m = x * 0.9, mr = x * 1.45;                      // canvas margin (more on the right for the 2x bracket)
    const vx = L - m, vy = T - m, vw = R + mr - vx, vh = B + m - vy;
    const nss = 'vector-effect="non-scaling-stroke"';
    const r = x * 0.2;                                     // yellow "x" marker radius
    // a dimension line with end ticks and a Posha Yellow "x" marker at its middle
    const dim = (x1, y1, x2, y2) => {
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, v = x1 === x2, t = x * 0.09;
      const ticks = v
        ? `<line x1="${x1 - t}" y1="${y1}" x2="${x1 + t}" y2="${y1}" ${nss}/><line x1="${x2 - t}" y1="${y2}" x2="${x2 + t}" y2="${y2}" ${nss}/>`
        : `<line x1="${x1}" y1="${y1 - t}" x2="${x1}" y2="${y1 + t}" ${nss}/><line x1="${x2}" y1="${y2 - t}" x2="${x2}" y2="${y2 + t}" ${nss}/>`;
      return `<g stroke="${C.ink}" stroke-width="1.2"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${nss}/>${ticks}</g>
        <circle cx="${mx}" cy="${my}" r="${r}" fill="${C.yellow}"/>
        <text x="${mx}" y="${my}" class="dg-x" style="text-transform:none;font-size:${r * 1.25}px" fill="${C.ink}">x</text>`;
    };
    const bx = R + x * 0.55, t = x * 0.09;                 // "2x" height bracket, outside the zone
    return `<svg class="diagram" viewBox="${vx} ${vy} ${vw} ${vh}" role="img" aria-label="Clearspace: keep x clear on every side of the wordmark, where x is half its height">
      <rect x="${vx}" y="${vy}" width="${vw}" height="${vh}" rx="${x * 0.1}" fill="#F1ECE4"/>
      <rect x="${L}" y="${T}" width="${R - L}" height="${B - T}" fill="${C.paper}" stroke="${C.ink}" stroke-width="1" stroke-dasharray="6 5" ${nss}/>
      <rect x="0" y="0" width="${W}" height="${H}" fill="none" stroke="${C.ink}" stroke-opacity=".22" stroke-width="1" ${nss}/>
      ${wm(`fill="${C.ink}"`)}
      ${dim(W * 0.5, T, W * 0.5, 0)}${dim(W * 0.5, H, W * 0.5, B)}${dim(L, H / 2, 0, H / 2)}${dim(W, H / 2, R, H / 2)}
      <g stroke="${C.ink}" stroke-width="1.2"><line x1="${bx}" y1="0" x2="${bx}" y2="${H}" ${nss}/><line x1="${bx - t}" y1="0" x2="${bx + t}" y2="0" ${nss}/><line x1="${bx - t}" y1="${H}" x2="${bx + t}" y2="${H}" ${nss}/></g>
      <text x="${bx + x * 0.22}" y="${H / 2}" style="text-transform:none;text-anchor:start;font-size:${r * 1.25}px" fill="${C.ink}">2x</text>
    </svg>`;
  }

  // Anatomy: why the wordmark looks the way it does — guides, alignment and the extended O
  function anatomySvg() {
    const W = 1920, H = 373.3;
    const bg = '#232222', fg = C.paper, line = 'rgba(255, 252, 248, .55)';
    const nss = 'vector-effect="non-scaling-stroke"';
    const L = -300, R = W + 300;                         // guide lines run past the wordmark
    const vx = -620, vw = W + 1900, vy = -560, vh = H + 1260;  // generous margins so the callouts breathe
    const t = (x, y, lines, size = 58) => `<text x="${x}" y="${y}" fill="${fg}" style="text-transform:none;text-anchor:start;dominant-baseline:auto;font-family:var(--font-ui);font-size:${size}px;letter-spacing:0">${lines.map((l, i) => `<tspan x="${x}" dy="${i ? size * 1.3 : 0}">${esc(l)}</tspan>`).join('')}</text>`;
    const d1 = H * 0.463, d2 = H * 0.633;                // the two alignment guides (crossbars and counters)
    const sx = 1063, ox = 648;                           // callout positions: top of the S, foot of the O
    return `<svg class="diagram" viewBox="${vx} ${vy} ${vw} ${vh}" role="img" aria-label="Wordmark anatomy: consistent letterform thickness, precise alignment, and an extended O inspired by the product's rounded corners">
      <rect x="${vx}" y="${vy}" width="${vw}" height="${vh}" rx="44" fill="${bg}"/>
      <g stroke="${line}" stroke-width="1">
        <line x1="${L}" y1="0" x2="${R}" y2="0" ${nss}/><line x1="${L}" y1="${H}" x2="${R}" y2="${H}" ${nss}/>
        <line x1="${L}" y1="${d1}" x2="${R}" y2="${d1}" stroke-dasharray="2 4" ${nss}/><line x1="${L}" y1="${d2}" x2="${R}" y2="${d2}" stroke-dasharray="2 4" ${nss}/>
        <line x1="${sx}" y1="${H * 0.06}" x2="${sx}" y2="-300" ${nss}/>
        <line x1="${ox}" y1="${H * 0.97}" x2="${ox}" y2="${H + 590}" ${nss}/>
      </g>
      ${wm(`fill="${fg}"`)}
      ${t(sx + 40, -270, ['Visually consistent', 'letterform thickness'])}
      ${t(R + 60, (d1 + d2) / 2 + 15, ['Precise alignment'])}
      ${t(ox + 40, H + 200, ['•  The ‘O’ is intentionally extended to aid pronunciation,', '    as this is a new word for people.', '•  Its shape is inspired by the robot’s rounded corners —', '    a detail carried through the whole identity,', '    including UI cards and other elements.'])}
    </svg>`;
  }

  function lockupSvg() {
    const W = 1920, H = 373.3, x = H / 2, D = H + x, gap = 2 * x;
    const px = W + gap, cx = px + D / 2, cy = H / 2;
    // bottom leaves room under the "2x" label so it never gets cropped
    const left = -x * 2.2, right = px + D + x * 0.9, top = -x * 1.5, bottom = H + x * 2.9;
    const dash = `stroke="${C.grey}" stroke-width="1.2" stroke-dasharray="5 5" vector-effect="non-scaling-stroke"`;
    const solid = `stroke="${C.ink}" stroke-width="1.5" vector-effect="non-scaling-stroke"`;
    const hl = (y) => `<line x1="${left + x * 0.4}" y1="${y}" x2="${right - x * 0.2}" y2="${y}" ${dash}/>`;
    const vl = (vx) => `<line x1="${vx}" y1="${top + x * 0.2}" x2="${vx}" y2="${H + x * 1.5}" ${dash}/>`;
    const bx = -x * 1.25, by = H + x * 1.75, plus = x * 0.55, t = x * 0.12;
    return `<svg class="diagram" viewBox="${left} ${top} ${right - left} ${bottom - top}" role="img" aria-label="Lockup: wordmark, plus sign and partner logo separated by 2x">
      <rect x="${left}" y="${top}" width="${right - left}" height="${bottom - top}" fill="${C.paper}"/>
      ${hl(-x)}${hl(0)}${hl(H / 2)}${hl(H)}${hl(H + x)}
      ${vl(0)}${vl(W)}${vl(px)}${vl(px + D)}
      <path d="M${bx + x * 0.2} 0 H${bx} V${H} H${bx + x * 0.2}" fill="none" ${solid}/>
      <line x1="${bx - x * 0.08}" y1="${H / 2}" x2="${bx + x * 0.08}" y2="${H / 2}" ${solid}/>
      <text x="${bx - x * 0.35}" y="${H / 4}" class="dg-label">x</text>
      <text x="${bx - x * 0.35}" y="${(H * 3) / 4}" class="dg-label">x</text>
      <path d="M${W} ${by - x * 0.2} V${by} H${px} V${by - x * 0.2}" fill="none" ${solid}/>
      <text x="${W + x}" y="${by + x * 0.45}" class="dg-label">2x</text>
      ${wm(`fill="${C.ink}"`)}
      <rect x="${W + x - plus / 2}" y="${cy - t / 2}" width="${plus}" height="${t}" fill="${C.ink}"/>
      <rect x="${W + x - t / 2}" y="${cy - plus / 2}" width="${t}" height="${plus}" fill="${C.ink}"/>
      <circle cx="${cx}" cy="${cy}" r="${D / 2}" fill="${C.grey}"/>
      <text x="${cx}" y="${cy - x * 0.12}" class="dg-label dg-small" fill="${C.paper}" style="fill:${C.paper}">Partner</text>
      <text x="${cx}" y="${cy + x * 0.32}" class="dg-label dg-small" style="fill:${C.paper}">logo</text>
    </svg>`;
  }

  // Misuse examples, each in a square artboard
  function misuseSvg(kind) {
    const W = 1920, H = 373.3, S = W * 1.25, ox = (S - W) / 2, oy = (S - H) / 2;
    let art;
    if (kind === 'rotate') art = `<g transform="rotate(-28 ${S / 2} ${S / 2}) translate(${ox} ${oy})">${wm(`fill="${C.ink}"`)}</g>`;
    else if (kind === 'outline') art = `<g transform="translate(${ox} ${oy})">${wm(`fill="none" stroke="${C.ink}" stroke-width="12"`)}</g>`;
    else if (kind === 'stroke') art = `<g transform="translate(${ox} ${oy})">${wm(`fill="${C.ink}" stroke="${C.ink}" stroke-width="34" stroke-linejoin="round"`)}</g>`;
    else {
      // "themed" fill — stripes and a starred canton, drawn in brand colours
      const id = 'mis' + ++uid, band = H / 7;
      const stripes = Array.from({ length: 7 }, (_, i) => `<rect x="0" y="${i * band}" width="${W}" height="${band}" fill="${i % 2 ? C.paper : C.red}"/>`).join('');
      const stars = Array.from({ length: 12 }, (_, i) => `<circle cx="${70 + (i % 6) * 120}" cy="${55 + Math.floor(i / 6) * 95}" r="16" fill="${C.paper}"/>`).join('');
      art = `<defs><clipPath id="${id}">${wm()}</clipPath></defs>
        <g transform="translate(${ox} ${oy})"><g clip-path="url(#${id})">${stripes}<rect x="0" y="0" width="760" height="${band * 4}" fill="${C.navy}"/>${stars}</g></g>`;
    }
    return `<svg class="diagram" viewBox="0 0 ${S} ${S}" role="img" aria-hidden="true">${art}</svg>`;
  }

  /* ---- Icon construction (24-unit grid, lock example) ------------------ */
  function iconConstructionSvg(labels) {
    const U = 24, labelW = 13, pad = 1.2;
    const g = 'stroke="#484848" stroke-opacity=".22" stroke-width="1" vector-effect="non-scaling-stroke" fill="none"';
    const fine = 'stroke="#484848" stroke-opacity=".08" stroke-width="1" vector-effect="non-scaling-stroke"';
    let px = '';
    for (let i = 0.5; i < U; i += 0.5) px += `<line x1="${i}" y1="0" x2="${i}" y2="${U}" ${fine}/><line x1="0" y1="${i}" x2="${U}" y2="${i}" ${fine}/>`;
    const keys = [1.5, 7.5, 12, 16.5, 22.5];
    const keyLines = keys.map((k) => `<line x1="${k}" y1="0" x2="${k}" y2="${U}" ${g}/><line x1="0" y1="${k}" x2="${U}" y2="${k}" ${g}/>`).join('');
    const ink = 'stroke="#231F20" stroke-width="1" fill="none" stroke-linecap="round" stroke-linejoin="round"';
    const lead = 'stroke="#231F20" stroke-width="1" vector-effect="non-scaling-stroke"';
    const L = U + labelW;
    // callouts: [y on the icon, x where the line starts, label]
    const calls = [[4.6, 17.3, labels[0]], [10.6, 22.6, labels[1]], [18.7, 12.9, labels[2]]];
    return `<svg class="diagram construct" viewBox="${-pad} ${-pad} ${L + pad * 2} ${U + pad * 2}" role="img" aria-label="Line icon construction on a 24 unit grid">
      <rect x="0" y="0" width="${U}" height="${U}" fill="#FFFCF8"/>
      ${px}
      <rect x="0" y="0" width="${U}" height="${U}" ${g}/>
      <rect x="1.5" y="1.5" width="21" height="21" rx="4.5" ${g}/>
      <circle cx="12" cy="12" r="10.5" ${g}/>
      <circle cx="12" cy="12" r="6.2" ${g}/>
      <line x1="0" y1="0" x2="${U}" y2="${U}" ${g}/><line x1="${U}" y1="0" x2="0" y2="${U}" ${g}/>
      ${keyLines}
      <path d="M6.6 10.1 V7.4 A2.9 2.9 0 0 1 9.5 4.5 H14.5 A2.9 2.9 0 0 1 17.4 7.4 V10.1" ${ink}/>
      <rect x="1.9" y="10.1" width="20.2" height="11.9" rx="2.6" ${ink}/>
      <circle cx="12" cy="15.1" r="1.15" fill="#231F20"/>
      <rect x="11.2" y="15.1" width="1.6" height="3.7" rx=".8" fill="#231F20"/>
      ${calls.map(([y, x, t]) => `<line x1="${x}" y1="${y}" x2="${L}" y2="${y}" ${lead}/>
        <text x="${L}" y="${y + 0.85}" class="construct-label">${esc(t)}</text>`).join('')}
    </svg>`;
  }

  // Style principle illustration: real icon + a light annotation (arc / ring / ghost outline)
  function principleArt(src, overlay) {
    const url = asset(src), id = 'pr' + ++uid;
    const grey = '#484848';
    const img = (extra = '') => `<image href="${url}" x="40" y="34" width="320" height="320" preserveAspectRatio="xMidYMid meet" ${extra}/>`;
    let under = '', over = '';
    if (overlay === 'arc') over = `<path d="M118 352 Q200 398 282 352" fill="none" stroke="${grey}" stroke-width="1.5"/><path d="M114 346 v12 M286 346 v12" stroke="${grey}" stroke-width="1.5"/>`;
    if (overlay === 'ring') over = `<ellipse cx="200" cy="268" rx="168" ry="24" fill="none" stroke="${grey}" stroke-opacity=".7" stroke-width="1.5"/>`;
    if (overlay === 'outline') {
      under = `<defs><filter id="${id}" x="-10%" y="-10%" width="120%" height="120%">
          <feMorphology in="SourceAlpha" operator="dilate" radius="2" result="d"/>
          <feComposite in="d" in2="SourceAlpha" operator="out" result="ring"/>
          <feFlood flood-color="${grey}" flood-opacity=".7"/><feComposite in2="ring" operator="in"/>
        </filter></defs>
        <g transform="translate(34 26)">${img(`filter="url(#${id})"`)}</g>`;
    }
    return `<svg class="principle-art" viewBox="0 0 400 400" role="img" aria-hidden="true">${under}${img()}${over}</svg>`;
  }

  function emptyState(folder) {
    return `<div class="empty"><strong>No media yet</strong>
      <p>Drop files into <code>assets/${esc(folder || '…')}</code>, then run <code>code/tools/scan-media.bat</code> and refresh.</p></div>`;
  }

  function blocks(list, ctx) {
    if (!list || !list.length) return R.placeholder({});
    return list.map((b) => {
      const fn = R[b.type];
      if (!fn) return `<div class="note note--warn">Unknown block type “${esc(b.type)}”</div>`;
      return fn(b, ctx);
    }).join('');
  }

  /* ---- Model ------------------------------------------------------------- */
  let sections = [];
  let routes = []; // flat list for prev/next

  function prepare() {
    sections = POSHA.list.filter((s) => !s.hidden);
    sections.forEach((s, si) => {
      s.number = s.number || pad(si + 1);
      s.assets = s.assets || s._file || s.id;
      s.pages = (s.pages || []).filter((p) => !p.hidden);
      s.pages.forEach((p, pi) => {
        p.assets = p.assets || pad(pi + 1) + '-' + p.id;
        p._num = `${s.number}.${pi + 1}`; // sub-sections read 01.1, 01.2 …
        p._dir = s.assets + '/' + p.assets;
      });
    });
    routes = [];
    sections.forEach((s) => {
      if (s.layout === 'pages' && s.pages.length) s.pages.forEach((p) => routes.push({ s, p, label: `${s.title} — ${p.title}`, href: `#/${s.id}/${p.id}` }));
      else routes.push({ s, label: s.title, href: `#/${s.id}` });
    });
  }

  /* ---- Shell ------------------------------------------------------------- */
  const chevron = '<span class="licon licon--down" aria-hidden="true"></span>';
  let openSet;

  const wip = (t) => /\(WIP\)/i.test(t || '') ? ' is-wip' : '';

  function renderShell() {
    const site = POSHA.site;
    $$('[data-brand]').forEach((el) => {
      const logo = el.dataset.brand === 'on-dark' && site.logoOnDark ? site.logoOnDark : site.logo;
      el.innerHTML = `<span class="logo-text">${esc(site.logoText || site.shortName || 'Brand')}</span>` +
        (logo ? `<img class="logo-img" src="${asset(logo)}" alt="${esc(site.logoText || '')}" onload="this.parentNode.classList.add('has-logo')" onerror="this.remove()">` : '') +
        `<span class="brand-sub">${esc(site.homeTitle || 'Brand Guidelines')}</span>`;
    });
    $('#sidebarFoot').innerHTML = site.updated ? `<span class="num">Updated ${esc(site.updated)}</span>` : '';

    openSet = new Set(store.get('open', []));
    $('#nav').innerHTML = sections.map((s) => `
      <div class="nav-group${openSet.has(s.id) ? ' open' : ''}" data-sid="${s.id}">
        <div class="nav-head">
          <a class="nav-title${wip(s.navTitle || s.title)}" href="#/${s.id}"><span class="num nav-num">${esc(s.number)}</span>${esc(s.navTitle || s.title)}</a>
          ${s.pages.length ? `<button class="nav-toggle" type="button" aria-label="Toggle ${esc(s.title)}" aria-expanded="${openSet.has(s.id)}">${chevron}</button>` : ''}
        </div>
        ${s.pages.length ? `<div class="nav-sub-wrap"><ul class="nav-sub">${navPages(s)}</ul></div>` : ''}
      </div>`).join('');
  }

  // A section's page links. Pages with `parts` get a third level that opens while you're on that page.
  // Consecutive pages with the same `group` are nested under a collapsible group heading.
  function navPages(s) {
    const item = (p) => {
      const kids = (p.parts || []).filter((pt) => pt.title);
      return `<li${kids.length ? ' class="has-kids"' : ''} data-pid="${p.id}"><a href="#/${s.id}/${p.id}" data-pid="${p.id}"${wip(p.navTitle || p.title) ? ' class="is-wip"' : ''}>${esc(p.navTitle || p.title)}</a>${kids.length
        ? `<div class="nav-sub2-wrap"><ul class="nav-sub2">${kids.map((pt) =>
          // a part's `sections` nest one level deeper (e.g. Photoshoot → Recipes / Renders / Lifestyle)
          `<li><a href="#/${s.id}/${p.id}/${pt.id}" data-part="${pt.id}">${esc(pt.navTitle || pt.title)}</a>${(pt.sections || []).length
            ? `<ul class="nav-sub3">${pt.sections.map((sec) => `<li><a href="#/${s.id}/${p.id}/${pt.id}--${sec.id}" data-part="${pt.id}--${sec.id}">${esc(sec.navTitle || sec.title)}</a></li>`).join('')}</ul>` : ''}</li>`).join('')}</ul></div>` : ''}</li>`;
    };
    const runs = [];
    s.pages.forEach((p) => {
      const last = runs[runs.length - 1];
      if (p.group && last && last.group === p.group) last.pages.push(p);
      else runs.push({ group: p.group, pages: [p] });
    });
    return runs.map((r) => {
      if (!r.group) return r.pages.map(item).join('');
      const key = `${s.id}:${r.group}`;
      return `<li class="nav-grp${openSet.has(key) ? ' is-open' : ''}" data-grp="${esc(key)}">
        <button class="nav-grp-head" type="button" aria-expanded="${openSet.has(key)}">${esc(r.group)}</button>
        <div class="nav-grp-wrap"><ul class="nav-sub">${r.pages.map(item).join('')}</ul></div></li>`;
    }).join('');
  }

  function setGroupOpen(li, on) {
    li.classList.toggle('is-open', on);
    $('.nav-grp-head', li).setAttribute('aria-expanded', on);
    on ? openSet.add(li.dataset.grp) : openSet.delete(li.dataset.grp);
    store.set('open', Array.from(openSet));
  }

  function setOpen(sid, on) {
    const g = $(`.nav-group[data-sid="${sid}"]`);
    if (!g) return;
    g.classList.toggle('open', on);
    const btn = $('.nav-toggle', g);
    if (btn) btn.setAttribute('aria-expanded', on);
    on ? openSet.add(sid) : openSet.delete(sid);
    store.set('open', Array.from(openSet));
  }

  function markNav(sid, pid, part) {
    $$('.nav-group').forEach((g) => g.classList.toggle('current', g.dataset.sid === sid));
    $$('.nav-sub > li > a').forEach((a) => a.classList.toggle('active', a.closest('.nav-group').dataset.sid === sid && a.dataset.pid === pid));
    $$('.nav-sub > li.has-kids').forEach((li) => li.classList.toggle('is-open', li.closest('.nav-group').dataset.sid === sid && li.dataset.pid === pid));
    markPart(part);
    if (sid) setOpen(sid, true);
    const cur = $('.nav-sub > li > a.active');
    const grp = cur && cur.closest('.nav-grp');
    if (grp && !grp.classList.contains('is-open')) setGroupOpen(grp, true);
    const active = $('.nav-sub2 a.active') || $('.nav-sub > li > a.active') || $('.nav-group.current');
    if (active) {
      const r = active.getBoundingClientRect();
      if (r.top < 0 || r.bottom > innerHeight) active.scrollIntoView({ block: 'nearest' });
    }
  }

  // Third-level link for the part you're reading (only inside the open page)
  function markPart(part) {
    $$('.nav-sub2 a').forEach((a) => {
      const open = !!part && !!a.closest('li.is-open');
      a.classList.toggle('active', open && a.dataset.part === part);
      a.classList.toggle('is-parent', open && part.startsWith(a.dataset.part + '--')); // part of the open sub-section
    });
  }

  /* ---- Views ------------------------------------------------------------- */
  function hero(num, crumb, title, summary, style) {
    return `<header class="hero hero--${style || 'split'}">
      <div class="hero-head"><div class="num">${esc(num)}${crumb ? ` <span class="crumb">/ ${esc(crumb)}</span>` : ''}</div><h1 class="display">${esc(title)}</h1></div>
      ${summary ? `<div class="hero-summary">${paras(summary)}</div>` : ''}
    </header>`;
  }

  function pager(currentHref) {
    const i = routes.findIndex((r) => r.href === currentHref);
    const prev = routes[i - 1], next = routes[i + 1];
    const cell = (r, dir) => r ? `<a class="pager-${dir}" href="${r.href}"><span class="num">${dir === 'prev' ? `${licon('left')} Previous` : `Next ${licon('right')}`}</span><span>${esc(r.label)}</span></a>` : '<span></span>';
    return `<nav class="pager">${cell(prev, 'prev')}${cell(next, 'next')}</nav>`;
  }

  function assetHint(dir) {
    return POSHA.site.showAssetPaths ? `<div class="asset-hint" title="Media folder for this page">assets/${esc(dir)}/</div>` : '';
  }

  function renderHome() {
    const site = POSHA.site;
    return `<article class="view view--home">
      ${hero('00', '', site.homeTitle || 'Brand Guidelines', site.intro, 'split')}
      <div class="home-grid">${sections.map((s) => `
        <a class="home-card" href="#/${s.id}">
          <span class="home-head"><span class="num">${esc(s.number)}</span></span>
          <span class="home-title">${esc(s.title)}</span>
          ${s.summary ? `<span class="home-summary">${esc(plain(s.summary).split(/\n/)[0].replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/\*\*|`/g, ''))}</span>` : ''}
          <span class="num home-meta">${s.pages.length} ${s.pages.length === 1 ? 'page' : 'pages'}${s.status ? ' · ' + esc(s.status) : ''}</span>
        </a>`).join('')}</div>
    </article>`;
  }

  function renderSection(s) {
    const toc = s.pages.length > 1 && s.toc !== false
      ? `<ol class="toc">${s.pages.map((p) => `<li><a href="#/${s.id}/${p.id}"><span class="num">${p._num}</span>${esc(p.title)}</a></li>`).join('')}</ol>` : '';
    return `<article class="view view--${esc(s.id)}">
      ${hero(s.number, '', s.title, s.summary, s.heroStyle)}
      ${s.blocks ? `<div class="blocks section-intro">${blocks(s.blocks, { dir: s.assets })}</div>` : ''}
      ${toc}
      ${s.afterToc ? `<div class="blocks section-lead">${blocks(s.afterToc, { dir: s.assets })}</div>` : ''}
      ${s.pages.map((p) => `
        <section class="sub" id="${s.id}--${p.id}" data-pid="${p.id}">
          <h2 class="sub-title"><span class="num">${p._num}</span>${esc(p.title)}</h2>
          ${assetHint(p._dir)}
          ${p.summary ? `<div class="sub-summary">${paras(p.summary)}</div>` : ''}
          <div class="blocks">${blocks(p.blocks, { dir: p._dir })}</div>
        </section>`).join('')}
      ${pager(`#/${s.id}`)}
    </article>`;
  }

  function renderPage(s, p) {
    return `<article class="view view--${esc(s.id)}">
      ${hero(p._num, `${s.title} / ${p.group ? p.group + ' / ' : ''}${p.title}`, p.heading || p.title, p.summary != null ? p.summary : s.summary, p.heroStyle || s.heroStyle)}
      ${assetHint(p._dir)}
      ${p.blocks && p.blocks.length ? `<div class="blocks page-blocks">${blocks(p.blocks, { dir: p._dir })}</div>` : ''}
      ${(p.parts || []).map((pt, i) => `
        <section class="part" id="part-${pt.id}" data-part="${pt.id}" data-label="${esc(pt.title || p.title)}" data-keywords="${esc([pt.title, (pt.keywords || []).join(' ')].join(' ').toLowerCase())}">
          ${pt.title ? `<h2 class="sub-title"><span class="num">${p._num}.${i + 1}</span>${esc(pt.title)}</h2>` : ''}
          ${pt.summary ? `<div class="sub-summary">${paras(pt.summary)}</div>` : ''}
          ${(pt.blocks || []).length ? `<div class="blocks">${blocks(pt.blocks, { dir: pt.assets ? s.assets + '/' + pt.assets : p._dir })}</div>` : ''}
          ${(pt.sections || []).map((sec, j) => `
            <section class="part-sec" id="part-${pt.id}--${sec.id}" data-part="${pt.id}--${sec.id}">
              <h3 class="part-sec-title"><span class="num">${p._num}.${i + 1}.${j + 1}</span>${esc(sec.title)}</h3>
              ${sec.summary ? `<div class="sub-summary">${paras(sec.summary)}</div>` : ''}
              <div class="blocks">${blocks(sec.blocks, { dir: p._dir })}</div>
            </section>`).join('')}
        </section>`).join('')}
      ${pager(`#/${s.id}/${p.id}`)}
    </article>`;
  }

  /* ---- Tabs + gallery search ------------------------------------------- */
  function activateTab(wrap, i, opts = {}) {
    i = String(i);
    let active;
    $$(':scope > .tab-bar .tab', wrap).forEach((b) => {
      const on = b.dataset.tab === i;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on);
      if (on) active = b;
    });
    $$(':scope > .tab-panel', wrap).forEach((p) => (p.hidden = p.dataset.panel !== i));
    if (!active) return;
    if (wrap.hasAttribute('data-sync-heading') && active.dataset.heading) {
      const h1 = $('.hero .display');
      if (h1) h1.textContent = active.dataset.heading;
    }
    // Keep the URL shareable: #/section/page/<tab-id>
    if (active.dataset.tabId && !opts.keepHash) {
      const { sid, pid } = parseHash();
      if (sid && pid) history.replaceState(null, '', `#/${sid}/${pid}/${active.dataset.tabId}`);
    }
  }

  // Works with tabs below the box, or with the page's parts (the sections listed in the sidebar).
  function runGallerySearch(box) {
    const input = $('input', box);
    const q = input.value.trim().toLowerCase();
    const status = $('.gsearch-status', box);
    const view = box.closest('.view');
    const wrap = $('[data-tabs]', view);
    $('.gsearch-clear', box).hidden = !q;
    const panels = wrap ? $$(':scope > .tab-panel', wrap) : $$('.part[data-part]', view);
    if (!panels.length) return;
    const tiles = (p) => $$('.tile', p);
    const chip = (p, i, n, on) => `<button type="button" class="gsearch-chip${on ? ' is-on' : ''}" ${wrap ? `data-goto-tab="${p.dataset.panel}"` : `data-goto-part="${p.dataset.part}"`}>${esc(p.dataset.label)} <em>${n}</em></button>`;
    panels.forEach((p) => { tiles(p).forEach((t) => (t.hidden = false)); if (!wrap) p.hidden = false; });
    if (!q) { status.innerHTML = ''; return; }

    const words = q.split(/\s+/);
    const has = (text) => words.every((w) => text.includes(w) || text.includes(w.replace(/s$/, '')));

    // 1. A category word ("renders", "food") → go to that tab / section and show everything in it
    const tabHit = panels.find((p) => has(p.dataset.keywords || ''));
    if (tabHit) {
      if (wrap) activateTab(wrap, tabHit.dataset.panel);
      else scrollToPinned(tabHit, true);
      status.innerHTML = `Showing all <strong>${tiles(tabHit).length}</strong> in <strong>${esc(tabHit.dataset.label)}</strong>`;
      return;
    }

    // 2. Otherwise filter images by code / name / tags everywhere (sections with no match fold away)
    const counts = panels.map((p) => {
      let n = 0;
      tiles(p).forEach((t) => { const ok = has(t.dataset.search || ''); t.hidden = !ok; if (ok) n++; });
      return n;
    });
    const total = counts.reduce((a, b) => a + b, 0);
    if (!total) {
      panels.forEach((p) => tiles(p).forEach((t) => (t.hidden = false)));
      status.innerHTML = `No images match “${esc(input.value.trim())}” — showing everything`;
      return;
    }
    let best = counts.indexOf(Math.max(...counts));
    if (wrap) {
      const currentIdx = panels.findIndex((p) => !p.hidden);
      if (counts[currentIdx] === counts[best]) best = currentIdx;
      activateTab(wrap, panels[best].dataset.panel);
    } else panels.forEach((p, i) => (p.hidden = !counts[i]));
    status.innerHTML = `<strong>${total}</strong> ${total === 1 ? 'image' : 'images'} · ` +
      panels.map((p, i) => (counts[i] ? chip(p, i, counts[i], wrap && i === best) : '')).join('');
  }

  // Applies #/section/page/<tab>?q=… after a page renders (or when only the tab/query changed)
  function applyPageState(tab, q) {
    const box = $('[data-gsearch]');
    if (q && box) {
      $('input', box).value = q;
      runGallerySearch(box);
      return;
    }
    if (box && $('input', box).value) { $('input', box).value = ''; runGallerySearch(box); }
    if (tab) {
      const btn = $(`.tab[data-tab-id="${CSS.escape(tab)}"]`);
      if (btn) activateTab(btn.closest('[data-tabs]'), btn.dataset.tab, { keepHash: true });
    }
    // No filter box on this page (e.g. icons): scroll to the matching item and flash it
    if (q) {
      const needle = q.toLowerCase();
      const hit = $$('[data-search]').find((el) => el.offsetParent && (el.dataset.search || '').split(' ').includes(needle))
        || $$('[data-search]').find((el) => el.offsetParent && (el.dataset.search || '').includes(needle));
      if (hit) {
        setTimeout(() => hit.scrollIntoView({ block: 'center', behavior: 'smooth' }), 60);
        hit.classList.remove('is-flash');
        void hit.offsetWidth;
        hit.classList.add('is-flash');
        setTimeout(() => hit.classList.remove('is-flash'), 2600);
      }
    }
  }

  /* ---- Router ------------------------------------------------------------ */
  let current = { view: null };
  let spy = null;

  function parseHash() {
    const raw = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
    const [path, query] = raw.split('?');
    const [sid, pid, tab] = path.split('/');
    const q = query ? new URLSearchParams(query).get('q') : null;
    return { sid, pid, tab, q };
  }

  // Full results for a query: media first, then icons, logos, colours, fonts, then sections and pages
  const SEARCH_GROUPS = [
    ['Images & video', ['Image', 'Video']],
    ['Icons', ['Icon']],
    ['Logos', ['Logo']],
    ['Colours', ['Colour']],
    ['Fonts', ['Font']],
    ['Sections & pages', ['Section', 'Page', 'Tab']],
  ];
  function renderSearch(q) {
    const { list } = scoreAll(q);
    const secs = sections.map((s) => ({ s, n: list.filter((r) => r.sid === s.id).length })).filter((x) => x.n);
    const item = (r) => {
      const at = `data-ssec="${esc(r.sid)}"`;
      const where = `<span class="srp-crumb">${esc(r.code ? r.code + ' · ' + r.crumb : r.crumb)}</span>`;
      if (r.kind === 'Image' || r.kind === 'Video') return `<a class="srp-media" href="${r.href}" ${at}><span class="srp-thumb">${r.thumb ? `<img src="${asset(r.thumb)}" alt="" loading="lazy">` : ''}${r.kind === 'Video' ? '<span class="srp-tag">Video</span>' : ''}</span><strong>${esc(r.label)}</strong>${where}</a>`;
      if (r.kind === 'Icon' || r.kind === 'Logo') return `<a class="srp-icon" href="${r.href}" ${at}><span class="srp-thumb">${r.thumb ? `<img src="${asset(r.thumb)}" alt="" loading="lazy">` : ''}</span><strong>${esc(r.label)}</strong>${where}</a>`;
      if (r.kind === 'Colour') return `<a class="srp-colour" href="${r.href}" ${at}><i style="background:${esc(r.swatch)}"></i><span><strong>${esc(r.label)}</strong><span class="srp-crumb">${esc(r.swatch)} · ${esc(r.sec)}</span></span></a>`;
      if (r.kind === 'Font') return `<a class="srp-font" href="${r.href}" ${at}><span class="srp-sample" style="font-family:${esc(r.family)}">Aa</span><span><strong>${esc(r.label)}</strong>${where}</span></a>`;
      return `<a class="srp-page" href="${r.href}" ${at}><span class="srp-kind">${esc(r.kind)}</span><span><strong>${esc(r.label)}</strong>${where}${r.snippet ? `<em>${esc(r.snippet)}</em>` : ''}</span>${licon('right')}</a>`;
    };
    const groups = SEARCH_GROUPS.map(([title, kinds]) => {
      const rs = list.filter((r) => kinds.includes(r.kind));
      return rs.length ? `<section class="srp-group" data-sgroup>
        <h2 class="srp-head">${esc(title)} <span class="num">${rs.length}</span></h2>
        <div class="srp-list srp-list--${kinds[0].toLowerCase()}">${rs.map(item).join('')}</div>
      </section>` : '';
    }).join('');
    const summary = !q.trim() ? 'Type in the search bar above to search every section.'
      : list.length ? `${list.length} result${list.length === 1 ? '' : 's'} across ${secs.length} section${secs.length === 1 ? '' : 's'}.`
      : `Nothing found for “${q.trim()}”. Try a section name like “logo” or “color”.`;
    return `<article class="view view--search">
      ${hero('Search', '', q.trim() ? `“${q.trim()}”` : 'Search', summary, 'split')}
      ${secs.length > 1 ? `<div class="srp-filter" role="group" aria-label="Filter by section">
        <button type="button" class="is-on" data-sfilter="">All <span>${list.length}</span></button>
        ${secs.map(({ s, n }) => `<button type="button" data-sfilter="${esc(s.id)}">${esc(s.title)} <span>${n}</span></button>`).join('')}
      </div>` : ''}
      <div class="srp" data-srp>${groups}</div>
    </article>`;
  }
  function filterSearch(sid) {
    $$('[data-sfilter]').forEach((b) => b.classList.toggle('is-on', b.dataset.sfilter === sid));
    $$('[data-srp] [data-ssec]').forEach((el) => { el.hidden = !!sid && el.dataset.ssec !== sid; });
    $$('[data-sgroup]').forEach((g) => {
      const vis = $$('[data-ssec]', g).filter((el) => !el.hidden).length;
      g.hidden = !vis;
      $('.srp-head .num', g).textContent = vis;
    });
  }

  function route(force) {
    const { sid, pid, tab, q } = parseHash();
    const main = $('#main');
    const s = sections.find((x) => x.id === sid);
    closeMenu();

    if (sid === 'search') {
      main.innerHTML = renderSearch(q || '');
      current = { view: 'search' };
      scrollTo(0, 0);
      setupSpy(null);
      setupPartSpy();
      markNav(null, null);
      $('#searchInput').value = q || '';
      document.title = `${q ? `“${q}” · ` : ''}Search — ${POSHA.site.name}`;
      return;
    }

    if (!s) {
      if (current.view !== 'home' || force) {
        main.innerHTML = renderHome(); mountWidgets();
        current = { view: 'home' };
        scrollTo(0, 0);
      }
      setupSpy(null);
      setupPartSpy();
      markNav(null, null);
      document.title = POSHA.site.name || 'Brand Guidelines';
      return;
    }

    if (s.layout === 'pages' && s.pages.length) {
      // old links like #/iconography/icons/line-icons land on the page named by the last segment
      const p = s.pages.find((x) => x.id === pid) || s.pages.find((x) => x.id === tab) || s.pages[0];
      const key = s.id + '/' + p.id;
      const same = current.view === key && !force;
      if (!same) {
        main.innerHTML = renderPage(s, p); mountWidgets();
        current = { view: key };
        scrollTo(0, 0);
      }
      const part = tab && document.getElementById('part-' + tab);
      if (part) scrollToPinned(part, same);
      else if (same && !tab && !q) scrollTo({ top: 0, behavior: 'smooth' }); // page link clicked while reading a part
      applyPageState(part ? null : tab, q);
      setupSpy(null);
      setupPartSpy(s, p);
      markNav(s.id, p.id, part ? tab : null);
      document.title = `${p.title} · ${s.title} — ${POSHA.site.name}`;
      return;
    }

    const same = current.view === s.id && !force;
    if (!same) {
      main.innerHTML = renderSection(s); mountWidgets();
      current = { view: s.id };
    }
    const target = pid && document.getElementById(`${s.id}--${pid}`);
    if (target) scrollToPinned(target, same);
    else if (!same) scrollTo(0, 0);
    markNav(s.id, pid || null);
    if (q) applyPageState(null, q);
    setupSpy(s);
    setupPartSpy();
    document.title = `${s.title} — ${POSHA.site.name}`;
  }

  // Highlights the sub-page you're reading in the sidebar and keeps the URL shareable.
  function setupSpy(s) {
    if (spy) spy.disconnect();
    spy = null;
    if (!s || !('IntersectionObserver' in window)) return;
    spy = new IntersectionObserver((entries) => {
      const hit = entries.filter((e) => e.isIntersecting)[0];
      if (!hit) return;
      const pid = hit.target.dataset.pid;
      $$('.nav-sub > li > a').forEach((a) => a.classList.toggle('active', a.closest('.nav-group').dataset.sid === s.id && a.dataset.pid === pid));
      const h = `#/${s.id}/${pid}`;
      if (location.hash !== h) history.replaceState(null, '', h);
    }, { rootMargin: '-10% 0px -80% 0px' });
    $$('.sub').forEach((el) => spy.observe(el));
  }

  // On a page with parts: follow the part you're reading in the sidebar's third level
  // Jump to a deep-linked section and keep it pinned while images above it load and shift the layout
  // (stops after ~3s or as soon as the reader scrolls themselves).
  let unpin = null;
  function scrollToPinned(el, smooth) {
    if (unpin) unpin();
    // 'instant', not 'auto': the page's CSS smooth-scrolling would otherwise animate every re-pin
    el.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant', block: 'start' });
    if (smooth || !('ResizeObserver' in window)) return;
    const ro = new ResizeObserver(() => el.isConnected && el.scrollIntoView({ behavior: 'instant', block: 'start' }));
    const stop = () => { ro.disconnect(); clearTimeout(timer); ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((t) => removeEventListener(t, stop)); unpin = null; };
    const timer = setTimeout(stop, 3000);
    ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((t) => addEventListener(t, stop, { passive: true }));
    ro.observe($('#main'));
    unpin = stop;
  }

  // (the current part = the last one whose top has passed the line under the search bar, so short parts count too)
  let partSpy = null;
  function setupPartSpy(s, p) {
    if (partSpy) removeEventListener('scroll', partSpy);
    partSpy = null;
    const parts = $$('.part[data-part], .part-sec[data-part]'); // document order, so a sub-section wins over its part
    if (!s || !parts.length) return;
    let last;
    const check = () => {
      const line = innerWidth <= 900 ? 170 : 130;
      let id = null;
      parts.forEach((el) => { if (el.getBoundingClientRect().top <= line) id = el.dataset.part; });
      if (id === last) return;
      last = id;
      markPart(id);
      const h = `#/${s.id}/${p.id}${id ? '/' + id : ''}`;
      if (location.hash !== h) history.replaceState(null, '', h);
    };
    partSpy = check; // a handful of rect reads per scroll event — cheap enough to run directly
    addEventListener('scroll', partSpy, { passive: true });
  }

  /* ---- Interactions ------------------------------------------------------ */
  // Feedback dialog → Google Sheet (Apps Script web app). Sent as a plain form post, so no CORS setup is needed;
  // the reply can't be read (no-cors), so a finished request counts as sent.
  // Example notes typed into the empty feedback box, one after another, until someone starts writing their own
  const FB_EXAMPLES = [
    'I want to post a new recipe on Instagram, and food shots with transparent backgrounds will help me do it.',
    'I want to design a new app screen, and Culinary UI spacing tokens in Figma will help me do it.',
    'I want to brief an agency on how we sound, and more “say this, not that” examples will help me do it.',
    'I want to put the logo on packaging, and print-ready files with CMYK values will help me do it.',
    'I want to pick a gradient for a campaign, and seeing each one on a real layout will help me do it.',
    'I want to write a push notification, and a list of words we never use will help me do it.',
  ];
  let fbTimer = null;
  function stopExamples() { clearTimeout(fbTimer); fbTimer = null; }
  function playExamples(box) {
    stopExamples();
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let i = Math.floor(Math.random() * FB_EXAMPLES.length), n = 0, dir = 1;
    const tick = () => {
      if (box.value || document.activeElement === box) { box.placeholder = FB_EXAMPLES[i]; return stopExamples(); }
      const ex = FB_EXAMPLES[i];
      if (still) { box.placeholder = ex; i = (i + 1) % FB_EXAMPLES.length; fbTimer = setTimeout(tick, 4500); return; }
      n += dir * (dir > 0 ? 1 : 4);
      if (n >= ex.length) { n = ex.length; dir = -1; box.placeholder = ex; fbTimer = setTimeout(tick, 2600); return; }
      if (n <= 0) { n = 0; dir = 1; i = (i + 1) % FB_EXAMPLES.length; box.placeholder = ''; fbTimer = setTimeout(tick, 350); return; }
      box.placeholder = ex.slice(0, n) + '▍';
      fbTimer = setTimeout(tick, dir > 0 ? 28 : 12);
    };
    tick();
  }
  function openFeedback() {
    const d = $('#feedback');
    if (!d) return;
    const f = $('#fbForm');
    $('.fb-status', f).textContent = '';
    $('.fb-status', f).className = 'fb-status';
    d.showModal();
    $('[name="name"]', f).focus();
    playExamples($('textarea', f));
  }
  function closeFeedback() { stopExamples(); const d = $('#feedback'); if (d && d.open) d.close(); }
  async function sendFeedback(e) {
    e.preventDefault();
    const f = e.target, status = $('.fb-status', f), btn = $('.fb-send', f);
    const say = (msg, kind) => { status.textContent = msg; status.className = 'fb-status' + (kind ? ' is-' + kind : ''); };
    const endpoint = ((POSHA.site.feedback || {}).endpoint || '').trim();
    const data = new FormData(f);
    const name = String(data.get('name') || '').trim(), email = String(data.get('email') || '').trim(), text = String(data.get('feedback') || '').trim();
    if (!name || !text || !/^\S+@\S+\.\S+$/.test(email)) return say('Almost there. Add your name, your email and a note.', 'error');
    if (!endpoint) return say('Feedback isn’t connected yet. Add the Google Sheet link in database/site.js → feedback.endpoint.', 'error');
    btn.disabled = true;
    say('Sending…');
    try {
      const body = new URLSearchParams({ name, email, feedback: text, website: String(data.get('website') || ''), page: location.href });
      await fetch(endpoint, { method: 'POST', mode: 'no-cors', body });
      f.reset();
      say('Thank you. Your note is on its way to the brand team.', 'ok');
      setTimeout(closeFeedback, 1800);
    } catch (err) {
      say('That didn’t go through. Check your connection and try again.', 'error');
    } finally {
      btn.disabled = false;
    }
  }

  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove('show'), 1600);
  }

  // Clipboard API needs https/localhost and permission; fall back to execCommand otherwise (e.g. file://)
  function copyText(v) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(v).catch(() => legacyCopy(v));
    return legacyCopy(v);
  }
  function legacyCopy(v) {
    return new Promise((res, rej) => {
      const ta = document.createElement('textarea');
      ta.value = v;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      ok ? res() : rej();
    });
  }

  function openMenu() { document.body.classList.add('nav-open'); }
  function closeMenu() { document.body.classList.remove('nav-open'); }

  // Lightbox
  let lb = { items: [], i: 0 };
  function openLightbox(tile) {
    const grid = tile.closest('[data-gallery]');
    lb.items = $$('.tile', grid).filter((t) => !t.hidden).map((t) => $('img, video', t)).filter(Boolean);
    lb.i = lb.items.indexOf($('img, video', tile));
    if (lb.i < 0) return;
    $('#lightbox').hidden = false;
    document.body.classList.add('no-scroll');
    showLightbox();
  }
  function showLightbox() {
    const el = lb.items[lb.i];
    const path = el.dataset.path;
    const url = asset(path);
    $('#lbStage').innerHTML = el.tagName === 'VIDEO'
      ? `<video src="${url}" controls autoplay playsinline></video>`
      : `<img src="${url}" alt="${esc(el.alt)}">`;
    const tile = el.closest('.tile');
    const fc = $('figcaption', tile);
    const label = fc ? $$('span', fc).map((s) => s.textContent).filter(Boolean).join(' · ') || fc.textContent : fileName(path);
    $('#lbCaption').textContent = `${lb.i + 1} / ${lb.items.length} · ${label}`;
    $('#lbOpen').href = url;
    $('.lb-prev').hidden = $('.lb-next').hidden = lb.items.length < 2;
  }
  function closeLightbox() {
    $('#lightbox').hidden = true;
    $('#lbStage').innerHTML = '';
    document.body.classList.remove('no-scroll');
  }
  function stepLightbox(d) {
    lb.i = (lb.i + d + lb.items.length) % lb.items.length;
    showLightbox();
  }

  /* ---- Site search (the bar at the top of every page) ------------------ */
  let index = [];
  let results = [];
  let sel = 0;

  // Everyday words → the words the guidelines actually use
  const SYNONYMS = {
    icon: 'iconography', icons: 'iconography', symbol: 'iconography', symbols: 'iconography',
    colour: 'color', colours: 'color', palette: 'color', hex: 'color', swatch: 'color',
    font: 'typography', fonts: 'typography', type: 'typography', typeface: 'typography', text: 'typography',
    photo: 'gallery', photos: 'gallery', image: 'gallery', images: 'gallery', picture: 'gallery', pictures: 'gallery', pics: 'gallery', shoot: 'gallery',
    render: 'renders', video: 'videos', film: 'videos', animation: 'motion', animate: 'motion',
    chart: 'data visualization', charts: 'data visualization', graph: 'data visualization', graphs: 'data visualization',
    wordmark: 'logo', mission: 'philosophy', values: 'philosophy', tone: 'voice', ui: 'culinary ui', cui: 'culinary ui', cai: 'culinary ai', button: 'components',
  };

  function textOf(node) {
    const out = [];
    (function walk(n) {
      if (!n) return;
      if (typeof n === 'string') return out.push(n);
      if (Array.isArray(n)) return n.forEach(walk);
      if (typeof n === 'object') {
        for (const k in n) if (!['type', 'src', 'folder', 'href', 'poster', 'family', 'style', 'bg', 'fit', 'aspect', 'tags', 'stops', 'placeholder'].includes(k)) walk(n[k]);
      }
    })(node);
    return out.join(' ');
  }

  function buildIndex() {
    index = [];
    let cur = null;
    const add = (e) => index.push({ text: '', sid: cur.id, sec: cur.title, ...e, hay: [e.label, e.crumb, e.text || ''].join(' ').toLowerCase() });
    const seenCodes = new Set(), seenFonts = new Set();
    sections.forEach((s) => {
      cur = s;
      add({ kind: 'Section', label: s.title, crumb: s.number, href: `#/${s.id}`, text: textOf(s.summary) });
      s.pages.forEach((p) => {
        const base = `#/${s.id}/${p.id}`;
        add({ kind: 'Page', label: p.title, crumb: `${s.number} · ${s.title}`, href: base, text: [s.title, textOf([p.summary, p.blocks, p.parts])].join(' ') });
        const walkBlocks = function walk(list, tab) {
          (list || []).forEach((b) => {
            const where = tab && tab.id ? `${base}/${tab.id}` : base;
            if (b.type === 'tabs') b.tabs.forEach((t) => {
              if (t.id) add({ kind: 'Tab', label: t.heading || t.label, crumb: `${s.title} · ${p.title}`, href: `${base}/${t.id}`, text: [s.title, (t.keywords || []).join(' ')].join(' ') });
              walk(t.blocks, t);
            });
            if (b.type === 'columns') b.columns.forEach((col) => walk(col, tab));
            if (b.type === 'grid' || b.type === 'photoshoot' || b.type === 'modeltimeline') (b.items || []).forEach((it) => {
              if (!it.code || seenCodes.has(it.code)) return; // an item shown on two pages is listed once
              seenCodes.add(it.code);
              const isVideo = VIDEO_EXT.includes(extOf(it.src));
              add({ kind: isVideo ? 'Video' : 'Image', label: `${it.title || prettyName(it.src)}`, code: it.code, crumb: `${s.title} · ${tab ? tab.label : p.title}`, href: `${where}?q=${encodeURIComponent(it.code)}`, text: [it.code, isVideo ? 'video film clip' : 'image photo', it.desc || '', (it.tags || []).join(' ')].join(' '), thumb: resolve(isVideo ? it.poster || '' : it.src, { dir: p._dir }) || null });
            });
            if (b.type === 'logoset') b.items.forEach((it) => {
              add({ kind: 'Logo', label: `${b.label || 'Wordmark'} — ${it.name}`, crumb: `${s.title} · ${p.title}`, href: `${base}?q=${encodeURIComponent((b.label || 'wordmark').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + it.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}`, text: 'logo wordmark download png svg ' + (it.note || ''), thumb: resolve(it.png || it.svg, { dir: p._dir }) });
            });
            if (b.type === 'type') b.items.forEach((t) => {
              if (seenFonts.has(t.name)) return;
              seenFonts.add(t.name);
              add({ kind: 'Font', label: t.name, crumb: `${s.title} · ${p.title}`, href: base, text: ['font typeface type', t.role, t.weights].join(' '), family: t.family });
            });
            if (b.type === 'palette') b.items.forEach((c) => {
              add({ kind: 'Colour', label: c.name, crumb: `${s.title} · ${p.title}${c.alias ? ' · ' + c.alias : ''}`, href: base, text: ['colour color', c.alias, c.hex, c.rgb, c.cmyk].join(' '), swatch: c.hex });
            });
            if (b.type === 'iconset') {
              const folder = resolve(b.folder, { dir: p._dir });
              Object.keys(POSHA.media).filter((k) => k === folder || k.startsWith(folder + '/')).forEach((k) => {
                const group = (b.labels || {})[fileName(k)] || sentence(prettyName(k));
                pairIcons(k, POSHA.media[k]).forEach((ic) => add({
                  kind: 'Icon', label: sentence((b.names && b.names[ic.slug]) || ic.name), crumb: `Icons · ${p.title} · ${group}`,
                  href: `${where}?q=${encodeURIComponent(ic.slug)}`, text: `icon iconography ${group}`, thumb: ic.png || ic.svg,
                }));
              });
            }
          });
        };
        walkBlocks(p.blocks, null);
        // parts index like tabs: a link to the part, and their contents link back into it
        (p.parts || []).forEach((pt) => {
          const tab = { id: pt.id, label: pt.title || p.title, heading: pt.title, blocks: pt.blocks, keywords: pt.keywords };
          if (pt.title) add({ kind: 'Tab', label: pt.title, crumb: `${s.title} · ${p.title}`, href: `${base}/${pt.id}`, text: [s.title, p.title, textOf([pt.summary, pt.blocks])].join(' ') });
          (pt.sections || []).forEach((sec) => add({ kind: 'Tab', label: sec.title, crumb: `${s.title} · ${p.title} · ${pt.title}`, href: `${base}/${pt.id}--${sec.id}`, text: [s.title, p.title, pt.title, textOf([sec.summary, sec.blocks])].join(' ') }));
          walkBlocks(tab.blocks, tab);
        });
      });
    });
  }

  const KIND_RANK = { Section: 4, Tab: 3, Page: 3, Logo: 2, Colour: 2, Font: 2, Video: 1, Image: 1, Icon: 1 };
  const searchHref = (q) => `#/search?q=${encodeURIComponent(q.trim())}`;

  // Every entry matching all the words, best first
  function scoreAll(raw) {
    const words = raw.toLowerCase().split(/[\s\-–—,/]+/).filter((w) => w.length > 0);
    if (!words.length) return { words, list: [] };
    {
      // Each word: what was typed (full weight) + its synonym (counts a little less)
      const alts = words.map((w) => [[w, 1], [w.replace(/s$/, ''), 1], ...(SYNONYMS[w] ? [[SYNONYMS[w], 0.6]] : [])].filter((x) => x[0]));
      const full = raw.trim().toLowerCase();
      results = index.map((r) => {
        const label = r.label.toLowerCase(), crumb = r.crumb.toLowerCase();
        let score = 0;
        for (const opts of alts) {
          let best = 0;
          for (const [a, wgt] of opts) {
            if (label.includes(a)) best = Math.max(best, (label.startsWith(a) ? 8 : 6) * wgt);
            else if (crumb.includes(a)) best = Math.max(best, 3 * wgt);
            // a coded asset's own tags/description are curated, so they beat a word buried in a page's text
            else if (r.hay.includes(a)) best = Math.max(best, (r.code ? 3 : 1) * wgt);
          }
          if (!best) return null; // every word has to match somewhere
          score += best;
        }
        if (label === full || (r.code && r.code.toLowerCase() === full) || (r.swatch && r.swatch.toLowerCase() === full)) score += 20;
        score += KIND_RANK[r.kind] || 0;
        let snippet = '';
        if (/Page|Tab|Section/.test(r.kind) && score < 8 && r.text) {
          const t = r.text.toLowerCase(), at = t.indexOf(words[0]);
          if (at > -1) snippet = (at > 30 ? '…' : '') + r.text.slice(Math.max(0, at - 30), at + 60).trim() + '…';
        }
        return { ...r, score, snippet };
      }).filter(Boolean).sort((a, b) => b.score - a.score);
      return { words, list: results };
    }
  }

  function runSearch(raw) {
    const { words, list: all } = scoreAll(raw);
    results = words.length ? all.slice(0, 10) : index.filter((r) => r.kind === 'Section');
    sel = -1; // nothing picked yet: Enter opens the full results page
    const list = $('#searchResults');
    list.innerHTML = results.length
      ? (!words.length ? '<li class="search-hint">Jump to a section — or type “icons”, “posha yellow”, “renders”, “pad thai”…</li>' : '') +
        results.map((r) => `<li role="option"><a href="${r.href}">
          <span class="sr-thumb">${r.thumb ? `<img src="${asset(r.thumb)}" alt="" loading="lazy">` : r.swatch ? `<i style="background:${esc(r.swatch)}"></i>` : `<b>${esc(r.kind === 'Section' ? r.crumb : r.label.charAt(0))}</b>`}</span>
          <span class="sr-text"><strong>${esc(r.label)}</strong><span class="sr-crumb">${esc(r.code ? r.code + ' · ' + r.crumb : r.crumb)}</span>${r.snippet ? `<em>${esc(r.snippet)}</em>` : ''}</span>
          <span class="sr-kind">${esc(r.kind)}</span></a></li>`).join('') +
        (words.length ? `<li class="sr-all"><a href="${searchHref(raw)}"><span>See all ${all.length} result${all.length === 1 ? '' : 's'} for “${esc(raw.trim())}”</span>${licon('right')}</a></li>` : '')
      : `<li class="search-empty">Nothing found for “${esc(raw.trim())}”. Try a section name like “logo” or “color”.</li>`;
    list.hidden = false;
    $('#searchInput').setAttribute('aria-expanded', 'true');
  }
  function moveSel(d) {
    const links = $$('#searchResults a');
    if (!links.length) return;
    sel = sel < 0 ? (d > 0 ? 0 : links.length - 1) : (sel + d + links.length) % links.length;
    links.forEach((a, i) => a.classList.toggle('is-sel', i === sel));
    links[sel].scrollIntoView({ block: 'nearest' });
  }
  function openSearch() {
    closeMenu();
    const inp = $('#searchInput');
    inp.focus();
    inp.select();
    runSearch(inp.value);
  }
  function closeSearch() {
    $('#searchResults').hidden = true;
    $('#searchInput').setAttribute('aria-expanded', 'false');
  }
  function goToResult(href, keep) {
    const inp = $('#searchInput');
    inp.value = keep || '';
    closeSearch();
    inp.blur();
    if (href === location.hash) route();
    else location.hash = href;
  }

  function bindEvents() {
    addEventListener('hashchange', () => route());

    // Live Culinary UI previews report their height so the iframe fits its content.
    addEventListener('message', (e) => {
      if (!e.data || !e.data.cuiPreview) return;
      document.querySelectorAll('.cui-frame').forEach((f) => {
        if (f.contentWindow === e.source) f.style.height = `${Math.ceil(e.data.height)}px`;
      });
    });

    document.addEventListener('click', (e) => {
      const t = e.target;

      // Culinary UI preview: switch app (Companion / Device) or theme (Light / Dark)
      const cuiBtn = t.closest('[data-cui-app], [data-cui-theme]');
      if (cuiBtn) {
        const wrap = cuiBtn.closest('.cui-embed');
        cuiBtn.parentElement.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', b === cuiBtn));
        const pick = (k) => wrap.querySelector(`[data-cui-${k}][aria-pressed="true"]`).dataset[k === 'app' ? 'cuiApp' : 'cuiTheme'];
        wrap.querySelector('.cui-frame').src = wrap.dataset.cuiSrc.replace('{app}', pick('app')).replace('{theme}', pick('theme'));
        return;
      }

      // Icon cards: click anywhere on a card to open its download menu
      const card = t.closest('[data-icon]');
      if (card) {
        const conv = t.closest('[data-svg2png]');
        if (conv) svgToPng(conv.dataset.svg2png, conv.dataset.file);
        const dl = t.closest('[data-dl-svg]');
        if (dl) { downloadSvg(dl.dataset.dlSvg, dl.dataset.file); closeIconMenus(); toast('Downloading…'); return; }
        if (t.closest('.icon-menu')) {
          if (t.closest('a, [data-svg2png]')) { closeIconMenus(); toast('Downloading…'); }
          return;
        }
        const open = !card.classList.contains('is-open');
        closeIconMenus(card);
        card.classList.toggle('is-open', open);
        const menu = $('.icon-menu', card);
        menu.hidden = !open;
        if (open) {
          // Open towards whichever side has room (never under the sidebar or off-screen)
          menu.classList.remove('icon-menu--left');
          const main = $('#main').getBoundingClientRect();
          if (menu.getBoundingClientRect().left < main.left + 8) menu.classList.add('icon-menu--left');
        }
        return;
      }
      closeIconMenus();

      // Sidebar: hide it for a full-width page, or bring it back (remembered between visits)
      if (t.closest('[data-menu-hide]') || t.closest('[data-menu-show]')) {
        const hide = !!t.closest('[data-menu-hide]');
        document.body.classList.toggle('menu-hidden', hide);
        store.set('menuHidden', hide);
        return;
      }

      // Sidebar: expand or collapse every chapter (and nested page group) at once
      const navAll = t.closest('[data-nav-all]');
      if (navAll) {
        const on = navAll.dataset.navAll === 'open';
        $$('.nav-group').forEach((g) => { if ($('.nav-toggle', g)) setOpen(g.dataset.sid, on); });
        $$('.nav-grp').forEach((li) => setGroupOpen(li, on));
        return;
      }

      const grpHead = t.closest('.nav-grp-head');
      if (grpHead) { const li = grpHead.closest('.nav-grp'); setGroupOpen(li, !li.classList.contains('is-open')); return; }

      const toggle = t.closest('.nav-toggle');
      if (toggle) {
        const sid = toggle.closest('.nav-group').dataset.sid;
        setOpen(sid, !openSet.has(sid));
        return;
      }

      // Clicking a link to the URL we're already on should still scroll there.
      const a = t.closest('a[href^="#/"]');
      if (a && t.closest('#searchResults')) { e.preventDefault(); goToResult(a.getAttribute('href')); return; }
      if (!t.closest('#siteSearch')) closeSearch();
      if (a && a.getAttribute('href') === location.hash) { e.preventDefault(); route(); }

      const tab = t.closest('.tab');
      if (tab) { activateTab(tab.closest('[data-tabs]'), tab.dataset.tab); return; }

      const chip = t.closest('[data-goto-tab], [data-goto-part]');
      if (chip) {
        if (chip.dataset.gotoTab) activateTab($('[data-tabs]', chip.closest('.view')), chip.dataset.gotoTab);
        else { const part = document.getElementById('part-' + chip.dataset.gotoPart); if (part) scrollToPinned(part, true); }
        $$('.gsearch-chip', chip.parentNode).forEach((c) => c.classList.toggle('is-on', c === chip));
        return;
      }
      if (t.closest('.gsearch-clear')) {
        const box = t.closest('[data-gsearch]');
        $('input', box).value = '';
        runGallerySearch(box);
        $('input', box).focus();
        return;
      }

      const tile = t.closest('.tile');
      if (tile && !t.closest('a, button') && $('img, video', tile)) { openLightbox(tile); return; }

      const sw = t.closest('[data-copy]');
      if (sw && sw.dataset.copy) {
        const v = sw.dataset.copy;
        const label = sw.dataset.copyLabel || v;
        copyText(v).then(() => {
          toast(`Copied ${label}`);
          sw.classList.add('is-copied');
          setTimeout(() => sw.classList.remove('is-copied'), 1200);
        }, () => toast(`Couldn’t copy — ${v}`));
        return;
      }

      if (t.closest('[data-feedback]')) { openFeedback(); return; }
      if (t.closest('[data-fb-close]') || t.id === 'feedback') { closeFeedback(); return; }
      const sf = t.closest('[data-sfilter]');
      if (sf) { filterSearch(sf.dataset.sfilter); return; }
      if (t.closest('[data-search-go]')) { const v = $('#searchInput').value; if (v.trim()) goToResult(searchHref(v), v); return; }

      const lbBtn = t.closest('[data-lb]');
      if (lbBtn) { const k = lbBtn.dataset.lb; k === 'close' ? closeLightbox() : stepLightbox(k === 'next' ? 1 : -1); return; }
      if (t.id === 'lightbox' || t.id === 'lbStage') closeLightbox();
    });

    // Hover-to-play videos inside grids
    document.addEventListener('mouseover', (e) => {
      const v = e.target.closest && e.target.closest('video[data-hover]');
      if (v) v.play().catch(() => {});
    });
    document.addEventListener('mouseout', (e) => {
      const v = e.target.closest && e.target.closest('video[data-hover]');
      if (v && !v.contains(e.relatedTarget)) v.pause();
    });

    if ($('#fbForm')) {
      const box = $('#fbForm textarea');
      $('#fbForm').addEventListener('submit', sendFeedback);
      box.addEventListener('focus', stopExamples);
      box.addEventListener('blur', () => { if (!box.value && $('#feedback').open) playExamples(box); });
      $('#feedback').addEventListener('close', stopExamples);
    }
    $('#menuBtn').addEventListener('click', openMenu);
    $('#scrim').addEventListener('click', closeMenu);
    $('#searchBtn').addEventListener('click', openSearch);
    const sInput = $('#searchInput');
    sInput.addEventListener('input', () => runSearch(sInput.value));
    sInput.addEventListener('focus', () => runSearch(sInput.value));
    sInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); moveSel(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); moveSel(-1); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        const a = sel >= 0 && $$('#searchResults a')[sel];
        if (a) goToResult(a.getAttribute('href'));
        else if (sInput.value.trim()) goToResult(searchHref(sInput.value), sInput.value);
      }
      else if (e.key === 'Escape') { closeSearch(); sInput.blur(); }
    });
    // Tabbing away from the bar closes the results
    $('#siteSearch').addEventListener('focusout', (e) => { if (!$('#siteSearch').contains(e.relatedTarget)) closeSearch(); });

    let gTimer;
    document.addEventListener('input', (e) => {
      const box = e.target.closest && e.target.closest('[data-gsearch]');
      if (!box) return;
      clearTimeout(gTimer);
      gTimer = setTimeout(() => runGallerySearch(box), 120);
    });

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); return; }
      if (e.key === '/' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); return; }
      if (e.target === $('#searchInput')) return;
      if (!$('#lightbox').hidden) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') stepLightbox(1);
        if (e.key === 'ArrowLeft') stepLightbox(-1);
        return;
      }
      if (e.key === 'Escape') { closeMenu(); closeIconMenus(); }
      if (e.key === 'Enter' && document.activeElement.matches('[data-icon]')) document.activeElement.click();
    });
  }

  /* ---- Boot -------------------------------------------------------------- */
  async function boot() {
    const ok = await loadScript(DB + 'site.js');
    // ?assets=local forces the local folder (handy while adding new files before they're uploaded)
    const useLocal = new URLSearchParams(location.search).get('assets') === 'local';
    if (ok && POSHA.site.assetBase && !useLocal) ASSETS = POSHA.site.assetBase.replace(/\/?$/, '/');
    if (!ok) {
      $('#main').innerHTML = '<div class="note note--warn"><strong>Could not load database/site.js</strong><p>Make sure the <code>code</code> and <code>database</code> folders sit side by side.</p></div>';
      return;
    }
    await loadScript(DB + 'media.js');
    await loadScript(DB + 'wordmark.js');
    for (const f of POSHA.site.sections || []) {
      loadingFile = f;
      await loadScript(DB + 'sections/' + f + '.js');
    }
    loadingFile = null;
    prepare();
    renderShell();
    buildIndex();
    bindEvents();
    if (store.get('menuHidden', false)) document.body.classList.add('menu-hidden');
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; // the router places the scroll itself
    route(true);
    // after the first page is in place, so the footer (and its icon rain) starts below the content
    setTimeout(() => {
      renderFooter();
      // a deep link to the last part of a page can only reach the top once the footer adds height below it
      const { sid, pid, tab } = parseHash();
      const target = (tab && document.getElementById('part-' + tab)) || (pid && document.getElementById(`${sid}--${pid}`));
      if (target) scrollToPinned(target, false);
    }, 0);
  }

  boot();
})();
