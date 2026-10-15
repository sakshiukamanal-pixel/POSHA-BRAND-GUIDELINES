# Posha Brand Guidelines Portal

A static web app — no build step, no server needed. Double-click `index.html` to open it.

```
posha web/
├── index.html            ← opens the portal (redirects to code/)
├── assets/               ← all media, one folder per page
│   ├── brand/            ← site logo (posha-wordmark.svg)
│   ├── fonts/            ← brand font files
│   ├── 02-logo/01-wordmark/ …
│   └── 07-gallery/01-essentials/01-food-shots/ …
├── code/                 ← the website itself
│   ├── index.html, css/, js/
│   └── tools/scan-media.bat   ← run after adding media
└── database/             ← all the content
    ├── site.js           ← site name, logo, section order
    ├── media.js          ← auto-generated file list (don't edit)
    └── sections/         ← one file per nav section
```

## Everyday tasks

**Add images to a page**
1. Drop files into that page's folder in `assets/` (the folder is shown under each page title while `showAssetPaths` is on).
2. Double-click `code/tools/scan-media.bat`.
3. Refresh the browser.

Files are sorted by name — prefix them `01-`, `02-` … to control order. The prefix is hidden in captions.

**Edit text / add content** — open the section file in `database/sections/` and edit its `blocks`.

**Add a sub-page** — add an entry to that section's `pages` list, then create its folder:
`assets/<section-file>/<NN>-<page-id>/` (e.g. 5th page `print` in Logo → `assets/02-logo/05-print/`).

**Add / reorder sections** — create a file in `database/sections/` and list it in `database/site.js`.

**Logo** — currently `assets/brand/posha-wordmark.png`. To switch to a crisp vector, export `assets/brand/posha-wordmark.svg` and update `logo` in `database/site.js` (and the image on the Logo page).

**Fonts** — Epika Serif Extra Condensed (H1 headers) and Roobert (everything else) live in `assets/fonts/` and are wired up at the top of `code/css/styles.css`.

## Search

The bar at the top of every page (Ctrl K or `/` to jump to it) searches sections, pages, tabs, colours (name or HEX), gallery images (name, code, tags) and individual icons — everything is indexed automatically from the database files and `media.js`.
Everyday words are mapped to guideline terms (icon → Iconography, font → Typography, photo → Gallery …): extend `SYNONYMS` in `code/js/app.js` to add more.

## Footer & playground

Every page ends with the footer set in `database/site.js` → `footer`: the note, website links (replace the `'#'` placeholders),
copyright, and the playground (`logo` + `icons` list). Physics tuning (gravity, drag, bounce, cursor push) lives at the
top of `mountPlayground` in `code/js/app.js`.

## Page layouts

- Default: all sub-pages on one long scrolling page; the sidebar follows as you scroll (Philosophy, Logo…).
- `layout: 'pages'`: each sub-page is its own page (Gallery, Iconography).
- A page can split into `parts: [{ id, title, summary, keywords, blocks }]` (Iconography, Gallery → Essentials / Others).
  A `gallerysearch` box on such a page filters across all its parts; a part's title or `keywords` jumps to it. Each part becomes a numbered section
  and a third level in the sidebar that opens while you're on that page; link to one with `#/iconography/line-icons/grid-construction`.

## Block types

Paths starting with `./` are relative to the page's own asset folder.

| type | example |
|---|---|
| `text` | `{ type: 'text', size: 'lg', body: ['Para 1', 'Para 2'] }` — sizes `sm` `md` `lg`; supports `**bold**` and `[link](url)` |
| `heading` | `{ type: 'heading', text: 'Title' }` |
| `image` | `{ type: 'image', src: './logo.svg', bg: '#f5f5f3', caption: '…', aspect: '16/9' }` |
| `video` | `{ type: 'video', src: './film.mp4' }` — or a YouTube / Vimeo URL |
| `grid` | `{ type: 'grid', folder: '.', columns: 4, style: 'card', ratio: '4/3', captions: 'filename' }` — styles `plain` `card` `cutout`; can also take `items: ['./a.png', …]` |
| `gallerysearch` | `{ type: 'gallerysearch', placeholder: '…' }` — place before a `tabs` block; category words (tab `keywords`) switch tabs, anything else filters images by code / title / tags |
| grid `items` with codes | `{ src, code: 'PSH-FS-01', title: 'Carrot Halwa', tags: ['top view', 'indian'], shape: 'circle' \| 'cover' }` — codes: PSH-FS (food), PSH-PR (renders), PSH-PC (components) |
| `tabs` | `{ type: 'tabs', style: 'bar', syncHeading: true, tabs: [{ id: 'food-shots', label: 'Food', heading: 'Food Shots', keywords: ['food'], blocks: [ … ] }] }` — styles `bar` `line`; `id` gives a link like `#/gallery/essentials/food-shots` |
| `columns` | `{ type: 'columns', columns: [[ …blocks ], [ …blocks ]] }` |
| `palette` | `{ type: 'palette', layout: 'weighted' \| 'grid', columns: 5, items: [{ name, hex, rgb, cmyk, weight }] }` — full-bleed brand swatches, click copies HEX |
| `gradients` | `{ type: 'gradients', items: [{ name, stops: ['#hex', …], src }] }` — click copies the CSS |
| `iconset` | `{ type: 'iconset', folder: './01-gradient-icons', columns: 4, labels: { '01-allergens': 'Allergens' } }` — one heading per sub-folder; click a card for Download as PNG / Download as SVG. Without a real `name.svg` next to the PNG, the SVG is generated with the PNG embedded; add the real file for true vector |
| `colors` | `{ type: 'colors', items: [{ name, hex, rgb, cmyk, pantone, note }] }` — click to copy |
| `type` | `{ type: 'type', items: [{ role, name, weights, family, sample }] }` |
| `typescale` | `{ type: 'typescale', items: [{ group: 'Headings' }, { role: 'H1', font: 'Epika', rem: 6, lh: 1.0 }, { role: 'H3 Epika Italics', font: 'Epika', italic: true, rem: 2.88, lh: 1.1 }] }` — fonts `Epika` `Roobert` `Roobert Mono` (mono rows are always caps) |
| `note` tones | `info` = sage "tip" band, `warn` = orange "alert" card (same as the app) |
| `dodont` | `{ type: 'dodont', items: [{ kind: 'do' \| 'dont', src, caption }] }` |
| `list` | `{ type: 'list', columns: 3, items: [{ title, body }] }` |
| `links` | `{ type: 'links', items: [{ label, note, href, download: true }] }` |
| `note` | `{ type: 'note', title, body, tone: 'info' \| 'warn' }` |
| `placeholder` | `{ type: 'placeholder', body: 'Coming soon' }` — empty `blocks: []` shows this too |
| `divider`, `html` | `{ type: 'html', html: '<p>anything</p>' }` |

Missing media shows as a dashed box with the exact path it expects, so it's easy to see what's left to add.

## Type & visual tokens

`code/css/styles.css` `:root` holds the type scale as tokens (`--fs-h1` … `--fs-micro`, with matching `--lh-*`) and the
app-derived surfaces: `--card` (container cards), `--track` (segmented controls), `--tip` / `--alert` (sage tip band and
orange alert card), `--lift` (raised white pills) and the radii `--r-card` `--r-inner` `--r-tag` `--r-pill`. Use these
instead of new pixel values. Roobert Mono is always set in caps: every mono rule includes `text-transform: uppercase`.

## Local preview

Opening `index.html` directly works. To preview exactly as it will behave when hosted, run
`powershell -ExecutionPolicy Bypass -File code/tools/serve.ps1` and open http://localhost:8080.

## Local settings (.env)

`.env` holds private local settings (preview port, deploy details). It is ignored by git (`.gitignore`) and the preview
server refuses to serve it. Copy `.env.example` to `.env` on a new machine. The site itself never reads `.env` —
never put secrets in `code/` or `database/`, since everything there is public once hosted.

## Hosting

Live on Vercel: **https://posha-brand-guidelines.vercel.app** (project `posha-brand-guidelines`, linked to GitHub
`sakshiukamanal-pixel/POSHA-BRAND-GUIDELINES`).

- **To publish: commit and push to `main`.** Vercel builds and goes live automatically (about a minute).
  Pushes to any other branch get their own preview link, without touching the live site.
- Media and fonts live on Cloudflare R2. `vercel.json` proxies `/assets/*` there, so the repo and deploy only carry the site code.
- New or changed media: `code/tools/upload-r2.ps1 -Changed` (needs `.env`) — live immediately, no deploy needed.
- `build.mjs` copies `code/` and `database/` into `public/`; `code/tools` stays out of the site.

Mac teammates can't run the `.bat` — run `pwsh code/tools/scan-media.ps1` instead, or ask whoever's on Windows.
