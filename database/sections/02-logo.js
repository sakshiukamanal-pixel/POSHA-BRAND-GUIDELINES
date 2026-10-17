POSHA.section({
  id: 'logo',
  title: 'Logo',
  summary: 'How the Posha wordmark is constructed, sized, spaced and protected across every surface.',

  pages: [
    {
      id: 'wordmark',
      title: 'The Wordmark',
      navTitle: 'The wordmark',
      blocks: [
        // Official files from client snt/Brand Assets/Basics/Logos/01_Digital → assets/02-logo/01-wordmark/
        // padding 16.2% of the width = twice the clearspace x (half the wordmark's height) on every side, so it breathes
        { type: 'image', src: './posha-wordmark-black.svg', alt: 'Posha wordmark', bg: 'transparent', padding: '16.2%' },
        // Anatomy, drawn in code from the official wordmark (database/wordmark.js)
        { type: 'logodiagram', variant: 'anatomy' },
        {
          // click a box → Download as PNG / SVG
          type: 'logoset', columns: 2,
          items: [
            { name: 'Black', bg: '#FFFCF8', svg: './posha-wordmark-black.svg', png: './posha-wordmark-black.png' },
            { name: 'White', bg: '#231F20', svg: './posha-wordmark-white.svg', png: './posha-wordmark-white.png' },
            { name: 'Black · Transparent', bg: 'checker-light', svg: './posha-wordmark-black.svg', png: './posha-wordmark-black.png' },
            { name: 'White · Transparent', bg: 'checker-dark', svg: './posha-wordmark-white.svg', png: './posha-wordmark-white.png' },
          ],
        },
        {
          type: 'links',
          items: [
            { label: 'Download all', note: 'ZIP · SVG + PNG · all three colourways', href: './posha-wordmark-digital-pack.zip', download: true },
          ],
        },
      ],
    },
    {
      id: 'clearspace-minimum-size',
      title: 'Clearspace & Minimum Size',
      navTitle: 'Clearspace & Minimum size',
      blocks: [
        // Diagrams are drawn in code from the official wordmark (database/wordmark.js)
        { type: 'logodiagram', variant: 'clearspace' },
        {
          type: 'columns',
          columns: [
            [
              { type: 'heading', text: 'Clearspace' },
              { type: 'text', size: 'sm', body: 'Keep a clear area of **x** on every side of the wordmark, where **x** is half the height of the wordmark. No text, graphics or edges should enter this space.' },
            ],
            [
              { type: 'heading', text: 'Minimum size' },
              { type: 'text', size: 'sm', body: 'Digital: **56 px** wide · Print: **15 mm** wide. Never reproduce the wordmark smaller than this.\nTested on a standard (1×) screen: below 56 px the S and A start to blur and the O closes up. In print, 15 mm keeps the thinnest stroke at about 0.5 mm, which holds up on paper, packaging and labels.' },
            ],
          ],
        },
        { type: 'minsize', src: '02-logo/01-wordmark/posha-wordmark-black.svg', px: 56, mm: 15 },
      ],
    },
    {
      id: 'placement-lockups',
      title: 'Placement & Lockups',
      blocks: [
        { type: 'logodiagram', variant: 'lockup' },
        {
          type: 'columns',
          columns: [
            [
              { type: 'heading', text: 'Partner lockups' },
              { type: 'text', size: 'sm', body: 'Separate the wordmark and a partner logo with a **+**, leaving a gap of **2x** between them. The + sits centred in the gap.' },
            ],
            [
              { type: 'heading', text: 'Alignment' },
              { type: 'text', size: 'sm', body: 'Centre the partner logo on the wordmark’s middle line. It may extend up to **½x** above and below the wordmark, and the whole lockup keeps **x** clearspace.' },
            ],
          ],
        },
      ],
    },
    {
      id: 'misuse',
      title: 'Misuse',
      blocks: [
        { type: 'heading', text: 'Wordmark Don’ts' },
        { type: 'text', body: 'Below are examples of incorrect wordmark usage. It should not be altered, distorted, scaled beyond minimum size, or used on colors that are illegible or not part of our brand.' },
        {
          type: 'bullets',
          items: [
            'Do not rotate or place on an angle.',
            'Do not outline the wordmark.',
            'Do not add a stroke to wordmark.',
            'Do not alter the logo based on event or location.',
          ],
        },
        {
          type: 'misuse', columns: 2,
          items: [
            { art: 'rotate', caption: 'Don’t rotate or place on an angle.' },
            { art: 'outline', caption: 'Don’t outline the wordmark.' },
            { art: 'stroke', caption: 'Don’t add a stroke to wordmark.' },
            { art: 'pattern', caption: 'Don’t alter the logo based on event or location.' },
          ],
        },
      ],
    },
    {
      // Files from "Posha circle assets.zip" → assets/02-logo/05-posha-circle/
      id: 'posha-circle',
      title: 'Posha Circle',
      summary: 'Posha Circle is Posha’s premium subscription. Its lockup pairs the Posha wordmark with “Circle” and the gradient ring symbol.',
      blocks: [
        { type: 'image', src: './preview-lockup-black.png', alt: 'Posha Circle logo', bg: 'var(--card)', padding: 'clamp(32px, 7%, 80px)', maxWidth: '880px' },
        {
          type: 'logoset', columns: 2, label: 'Posha Circle',
          items: [
            { name: 'Lockup · Black', bg: '#FFFCF8', svg: './posha-circle-lockup-black.svg', png: './posha-circle-lockup-black.png', display: './preview-lockup-black.png' },
            { name: 'Lockup · White', bg: '#231F20', svg: './posha-circle-lockup-white.svg', png: './posha-circle-lockup-white.png', display: './preview-lockup-white.png' },
            { name: 'Symbol', bg: '#FFFCF8', svg: './posha-circle-symbol.svg', png: './posha-circle-symbol.png', display: './preview-symbol.png' },
            { name: 'Symbol · Dark', bg: '#231F20', svg: './posha-circle-symbol.svg', png: './posha-circle-symbol.png', display: './preview-symbol.png' },
          ],
        },
        {
          type: 'links',
          items: [
            { label: 'Download all', note: 'ZIP · SVG + PNG · lockups and symbols', href: './posha-circle-logo-pack.zip', download: true },
          ],
        },
        { type: 'heading', text: 'Compact symbol' },
        {
          type: 'note', tone: 'warn', title: 'For UI at tiny sizes only',
          body: 'Use the compact symbol only in product UI where the symbol appears very small: app icons, tab bars, badges and small avatars. It has less negative space inside the ring, so the opening doesn’t close up at tiny sizes. Everywhere else, use the standard Posha Circle symbol or lockup above.',
        },
        {
          // compact symbol for UI: thicker ring, less negative space — click for PNG / SVG
          type: 'logoset', columns: 1, size: 'small', label: 'Posha Circle',
          items: [
            { name: 'Symbol · Compact', note: 'UI · tiny sizes only', bg: '#FFFCF8', svg: './posha-circle-symbol-compact.svg', png: './posha-circle-symbol-compact.png', display: './preview-symbol-compact.png' },
          ],
        },
        { type: 'heading', text: 'Key visual' },
        { type: 'image', src: './posha-circle-key-visual.jpg', alt: 'Posha Circle key visual: hands sharing dishes around a table', caption: 'Posha Circle key visual', maxWidth: '640px' },
      ],
    },
  ],
});
