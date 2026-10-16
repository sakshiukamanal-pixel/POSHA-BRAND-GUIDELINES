/* ==========================================================================
   SITE SETTINGS
   `sections` controls the left navigation: each name is a file in
   database/sections/ (without .js). Reorder, add or remove lines here.
   ========================================================================== */
POSHA.site = {
  name: 'Posha Brand Guidelines',
  shortName: 'Posha',
  logoText: 'POSHA',                    // shown until the logo file exists
  // Media is served from Cloudflare R2 (same folder structure as /assets).
  // Upload new/changed files with: powershell -ExecutionPolicy Bypass -File code/tools/upload-r2.ps1 -Changed
  // Leave empty ('') to use the local /assets folder instead. Add ?assets=local to the URL to preview local files.
  assetBase: 'https://pub-61f336f5041247d4bd3e51e5fd3a1ffb.r2.dev/',
  logo: 'brand/posha-wordmark-black.svg',          // official wordmark (path inside /assets)
  logoOnDark: 'brand/posha-wordmark-off-white.svg', // used on the black sidebar
  homeTitle: 'Brand Guidelines',
  intro: 'Everything the team needs to design, write and build for Posha, in one place. Pick a chapter on the left, or press Ctrl K to search.',
  updated: 'Oct 2026',
  showAssetPaths: false,                // true shows each page's media folder under its title (handy while adding media)

  // Footer at the end of every page + the icon playground (drag / throw / cursor pushes things away)
  footer: {
    note: 'The single source of truth for how Posha looks, sounds and moves.',
    links: [
      { label: 'Website', href: 'https://www.posha.com/' },
      { label: 'Instagram', href: 'https://www.instagram.com/eatwithposha/' },
      { label: 'TikTok', href: 'https://www.tiktok.com/@eatwithposha' },
      { label: 'YouTube', href: 'https://www.youtube.com/@eatwithposha' },
    ],
    copyright: '© 2026 Posha',
    playground: {
      logo: 'brand/posha-wordmark-off-white.svg', // off-white wordmark on the black playground
      icons: [
        '05-iconography/01-icons/01-gradient-icons/01-allergens/10-eggs.png',
        '05-iconography/01-icons/01-gradient-icons/04-modify-icons/06-spicy-heat.png',
        '05-iconography/01-icons/01-gradient-icons/02-collection-icons/09-dessert.png',
        '05-iconography/01-icons/01-gradient-icons/02-collection-icons/08-pasta.png',
        '05-iconography/01-icons/01-gradient-icons/02-collection-icons/05-sides.png',
        '05-iconography/01-icons/01-gradient-icons/02-collection-icons/02-rice.png',
        '05-iconography/01-icons/01-gradient-icons/02-collection-icons/03-noodles.png',
        '05-iconography/01-icons/01-gradient-icons/02-collection-icons/06-soup.png',
        '05-iconography/01-icons/01-gradient-icons/02-collection-icons/04-lentils.png',
        '05-iconography/01-icons/01-gradient-icons/02-collection-icons/01-kid-friendly.png',
        '05-iconography/01-icons/01-gradient-icons/01-allergens/02-meat.png',
        '05-iconography/01-icons/01-gradient-icons/01-allergens/03-coconut.png',
        '05-iconography/01-icons/01-gradient-icons/01-allergens/01-sea-food.png',
        '05-iconography/01-icons/01-gradient-icons/01-allergens/08-wheat.png',
        '05-iconography/01-icons/01-gradient-icons/01-allergens/11-milk.png',
        '05-iconography/01-icons/01-gradient-icons/04-modify-icons/04-oiliness.png',
      ],
    },
  },

  sections: [
    '01-philosophy',
    '02-logo',
    '03-color',
    '04-typography',
    '05-iconography',
    '07-gallery',
    '06-ui-system',
    '08-motion',
    '09-data-visualization',
    '10-brand-expression',
    '11-ai',
  ],
};
