/* UI System — Posha's product design system, Culinary UI.
   Source: the "Culinary UI for Web: design team guide" (Notion) and the live playground
   https://culinary-ui-playground.pages.dev, which mirror the Flutter package julia_commons/packages/culinary_ui.
   Token values below are copied from culinary-ui/tokens.css (Flutter build of 12 Oct 2026). If Flutter changes a token,
   update the matching row here. `cui` blocks render the live components through code/cui-preview.html. */
const PLAYGROUND = 'https://culinary-ui-playground.pages.dev/playground/';
const CUI_GUIDE = 'https://app.notion.com/p/posha/Culinary-UI-for-Web-design-team-guide-3fa4a3248c4f81c7910ef821000a7076';

// "Build it" footer shared by every component page: the Flutter widget, the web call and a playground link.
const cuiBuild = (id, title, flutter, web) => [
  { type: 'heading', text: 'Build it' },
  { type: 'facts', items: [{ k: 'Flutter', v: flutter }, { k: 'Web', v: web }, { k: 'Source', v: `lib/src/components/${id}/cui_${id}.dart` }] },
  { type: 'links', items: [{ label: `${title} in the playground`, note: 'Every control, state and variant', href: `${PLAYGROUND}#/${id}` }] },
];

POSHA.section({
  id: 'ui-system',
  title: 'UI System',
  navTitle: 'UI System',
  layout: 'pages',
  heroStyle: 'stacked',
  summary: 'Culinary UI — the tokens and components behind the Posha app and the Posha device screen.',

  pages: [
    /* ---------------------------------------------------------------- Overview */
    {
      id: 'overview',
      title: 'Overview',
      heading: 'UI System',
      summary: 'Culinary UI is the design system behind every Posha screen. Start here, then pick a foundation or a component.',
      blocks: [
        {
          type: 'text',
          body: [
            'Culinary UI is the shared set of design tokens and components used to build the **Posha Companion app** (phone) and the **Posha Device** screen. It is built in Flutter, and Flutter is the source of truth: the tokens and components on these pages are copied from it, value for value.',
            'Every colour, size, space and type style is a named token. Components are built only from tokens, so a change to a token flows through every screen that uses it.',
          ],
        },
        {
          type: 'facts',
          items: [
            { k: 'Components', v: '29' },
            { k: 'Icons', v: '56' },
            { k: 'Tokens', v: '374' },
            { k: 'Apps', v: 'Companion · Device' },
            { k: 'Themes', v: 'Light · Dark' },
          ],
        },
        { type: 'heading', text: 'Two apps, two themes' },
        {
          type: 'list', columns: 2,
          items: [
            { title: 'App: Companion or Device', body: 'Each app has its own sizes, spacing and type. Companion is designed at 390 px wide (phone); Device at 1024 px (the Posha screen), where values are slightly larger.' },
            { title: 'Theme: Light or Dark', body: 'Colours belong to the theme and are shared by both apps. Everything else — space, radius, type — belongs to the app.' },
          ],
        },
        { type: 'heading', text: 'Rules for everyone' },
        {
          type: 'rules',
          do: [
            'Use tokens for every value: `var(--cui-color-…)`, `--cui-space-…`, `--cui-radius-…`',
            'Use the existing components, with the variants and states they already have',
            'Check designs in Companion and Device, in light and dark',
            'Ask for a missing token or component instead of inventing one',
          ],
          dont: [
            'Type in raw hex colours or pixel values',
            'Edit tokens.css — it is regenerated from Flutter and edits are lost',
            'Copy the browser’s easing presets — Culinary UI uses Flutter’s curves',
            'Make a web-only token change and expect the app to follow',
          ],
        },
        { type: 'heading', text: 'Building a web page with Culinary UI' },
        {
          type: 'list', columns: 3,
          items: [
            { title: 'Copy the package', body: 'Take only the `culinary-ui/` folder, with `fonts/` kept next to `tokens.css`.' },
            { title: 'Link the files', body: '`tokens.css` and `core.css` first, then each component’s css. Scripts: `core.js`, `icons/icons.js`, then each component’s js.' },
            { title: 'Set the look', body: 'Put `data-app` (companion | device) and `data-theme` (light | dark) on the `<html>` tag.' },
            { title: 'Add components', body: '`CUI.button.html({ … })` returns markup. Props are listed at the top of each component’s .js file.' },
            { title: 'Wire the behaviour', body: 'Call `CUI.mount(container)` after inserting markup, and again after every re-render.' },
          ],
        },
        {
          type: 'code',
          body: [
            '<html data-app="companion" data-theme="light">',
            '<link rel="stylesheet" href="culinary-ui/tokens.css">',
            '<link rel="stylesheet" href="culinary-ui/core.css">',
            '<link rel="stylesheet" href="culinary-ui/components/button/button.css">',
            '…',
            '<script src="culinary-ui/core.js"></script>',
            '<script src="culinary-ui/icons/icons.js"></script>',
            '<script src="culinary-ui/components/button/button.js"></script>',
            '<script>',
            "  app.innerHTML = CUI.button.html({ label: 'Add to cart', icon: 'bag_lined', variant: 'primary' });",
            '  CUI.mount(app);',
            '</script>',
          ],
        },
        {
          type: 'note', title: 'Status',
          body: 'The web package matches the Flutter tokens exactly and 94% of component renders pixel for pixel; a design review pass is still to come. Usage notes on the component pages are drawn from each component’s built-in variants and states — confirm anything new with the design team.',
        },
        {
          type: 'links',
          items: [
            { label: 'Live playground', note: 'Try every component, state and theme', href: PLAYGROUND },
            { label: 'Design team guide', note: 'Culinary UI for Web, on Notion', href: CUI_GUIDE },
          ],
        },
      ],
    },

    /* ---------------------------------------------------------- Grid & Layout */
    {
      id: 'grid-layout',
      group: 'Foundations',
      title: 'Grid & Layout',
      summary: 'Screen widths, corner radius, borders, elevation and icon sizes. Values are shown for Companion and Device.',
      blocks: [
        {
          type: 'facts',
          items: [
            { k: 'Companion', v: '390 px design width · phone' },
            { k: 'Device', v: '1024 px design width · Posha screen' },
          ],
        },
        {
          type: 'text',
          body: 'Lay screens out with the spacing scale and size every container from the tokens below. Device values are fractional (for example 17.06 px): use the token, never a rounded number.',
        },
        { type: 'heading', text: 'Corner radius' },
        {
          type: 'tokens', kind: 'radius', prefix: '--cui-radius-',
          items: [
            { name: 'xs', values: ['4px', '4.12px'] },
            { name: 'sm', values: ['8px', '8.82px'] },
            { name: 'md', values: ['12px', '12.94px'] },
            { name: 'lg', values: ['16px', '17.06px'] },
            { name: 'xl', values: ['20px', '21.18px'] },
            { name: '2xl', values: ['24px', '25.88px'] },
            { name: 'banner-outer', values: ['28px', '30px'], note: 'Outer corner of banner buttons' },
            { name: '3xl', values: ['32px', '34.12px'] },
            { name: '4xl', values: ['40px', '42.94px'] },
            { name: 'pill', values: ['9999px', '9999px'], note: 'Fully rounded ends' },
          ],
        },
        { type: 'heading', text: 'Borders' },
        {
          type: 'tokens', kind: 'border', prefix: '--cui-border-',
          items: [
            { name: 'hairline', values: ['0.5px', '0.54px'] },
            { name: 'default', values: ['1px', '1.07px'] },
            { name: 'thick', values: ['2px', '2.14px'] },
            { name: 'heavy', values: ['4px', '4.12px'] },
          ],
        },
        { type: 'heading', text: 'Elevation' },
        {
          type: 'tokens', kind: 'shadow', prefix: '--cui-shadow-', columns: ['Companion (x y blur)', 'Device (x y blur)'],
          // the visual uses the full Companion shadow
          css: {
            '1 0 5': '1px 0 5px 0 rgba(143, 128, 107, 0.851)',
            '0 9 16': '0 9px 16px 0 rgba(143, 128, 107, 0.698)',
            '0 16 28': '0 16px 28px 0 rgba(143, 128, 107, 0.698)',
            '1 2 4': '1px 2px 4px 0 rgba(143, 128, 107, 0.549)',
          },
          items: [
            { name: 'sm', values: ['1 0 5', '1.18 0 4.71'], note: 'Warm brown #8F806B at 85%' },
            { name: 'md', values: ['0 9 16', '0 9.41 17.06'], note: '#8F806B at 70%' },
            { name: 'lg', values: ['0 16 28', '0 17.06 30'], note: '#8F806B at 70%' },
            { name: 'icon', values: ['1 2 4', '1.18 2.35 4.12'], note: 'Under raised icons · #8F806B at 55%' },
          ],
        },
        { type: 'heading', text: 'Icon sizes' },
        {
          type: 'tokens', kind: 'size', prefix: '--cui-size-icon-',
          items: [
            { name: 'sm', values: ['16px', '14.12px'] },
            { name: 'md', values: ['20px', '17.65px'] },
            { name: 'lg', values: ['24px', '23.53px'] },
          ],
        },
        { type: 'heading', text: 'Image sizes' },
        {
          type: 'tokens', kind: 'size', prefix: '--cui-img-',
          items: [
            { name: 'xxs', values: ['12px', '12.94px'] },
            { name: 'xs', values: ['24px', '25.88px'] },
            { name: 'xs1', values: ['30px', '29.41px'] },
            { name: 'xs2', values: ['36px', '38.24px'] },
            { name: 'xs3', values: ['44px', '47.06px'] },
            { name: 'sm-naked-image', values: ['56px', '58.82px'] },
            { name: 'sm-modify-tile-image', values: ['56px', '70.59px'] },
            { name: 'sm2', values: ['66px', '70.59px'] },
            { name: 'md', values: ['80px', '85.29px'] },
            { name: 'lg', values: ['120px', '128.24px'] },
            { name: 'xl', values: ['160px', '171.18px'] },
          ],
        },
      ],
    },

    /* ----------------------------------------------------------------- Spacing */
    {
      id: 'spacing',
      group: 'Foundations',
      title: 'Spacing',
      summary: 'One spacing scale for padding, gaps and margins, from 2 px to 96 px.',
      blocks: [
        {
          type: 'text',
          body: 'Every gap, padding and margin comes from this scale. Pick the step by name — `md` rather than 16 px — so layouts adapt when the Device app scales the values up.',
        },
        {
          type: 'tokens', kind: 'space', prefix: '--cui-space-',
          items: [
            { name: 'none', values: ['0', '0'] },
            { name: '3xs', values: ['2px', '2.35px'] },
            { name: '2xs', values: ['4px', '4.12px'] },
            { name: 'xs', values: ['8px', '8.82px'] },
            { name: 'sm', values: ['12px', '12.94px'] },
            { name: 'md', values: ['16px', '17.06px'] },
            { name: 'lg', values: ['24px', '25.88px'] },
            { name: 'xl', values: ['32px', '34.12px'] },
            { name: '2xl', values: ['40px', '42.94px'] },
            { name: '3xl', values: ['48px', '51.18px'] },
            { name: '4xl', values: ['64px', '68.24px'] },
            { name: '5xl', values: ['96px', '102.94px'] },
            { name: 'neg-sm', values: ['-12px', '-12.94px'], note: 'Negative space for deliberate overlaps' },
          ],
        },
        {
          type: 'rules',
          do: ['Use the named steps for all padding, gaps and margins', 'Keep related items on smaller steps and separate groups with larger ones'],
          dont: ['Use values between steps, such as 10 px or 20 px', 'Round Device values — use the token'],
        },
      ],
    },

    /* ------------------------------------------------------------------ Colour */
    {
      id: 'color',
      group: 'Foundations',
      title: 'Colour',
      summary: 'Colour tokens by role — surfaces, text, icons and borders — with their light and dark values.',
      blocks: [
        {
          type: 'text',
          body: 'Product colours are named by what they do, not what they look like: `text-default`, `surface-bg-brand`, `border-danger`. Each token has a light and a dark value, and the theme picks one. Both apps share the same colours. Click a token name to copy it.',
        },
        {
          type: 'tabs', style: 'line',
          tabs: [
            {
              id: 'surface', label: 'Surface',
              blocks: [{
                type: 'tokens', kind: 'color', prefix: '--cui-color-surface-bg-', columns: ['Light', 'Dark'],
                items: [
                  { name: 'canvas', values: ['#fffcf8', '#141313'], note: 'Screen background' },
                  { name: 'default', values: ['#ffffff', '#232222'] },
                  { name: 'raised', values: ['#ffffff', '#333130'] },
                  { name: 'sunken', values: ['#f9f5f0', '#141313'] },
                  { name: 'overlay', values: ['#ffffff', '#484646'] },
                  { name: 'control', values: ['#f1ece4', '#232222'] },
                  { name: 'disabled', values: ['#f1ece4', '#484646'] },
                  { name: 'scrim', values: ['rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.6)'], note: 'Behind sheets and popovers' },
                  { name: 'brand', values: ['#232222', '#ffd582'] },
                  { name: 'brand-muted', values: ['#ededec', '#484646'] },
                  { name: 'brand-subtle', values: ['#f7f6f6', '#333130'] },
                  { name: 'accent', values: ['#ffd582', '#ffd582'] },
                  { name: 'accent-subtle', values: ['#fffef7', '#333130'] },
                  { name: 'accent-preptip', values: ['#edeede', '#333130'], note: 'Prep tip band' },
                  { name: 'success', values: ['#16a34a', '#22c55e'] },
                  { name: 'success-muted', values: ['#d8f9e3', '#052e16'] },
                  { name: 'success-subtle', values: ['#f0fdf4', '#052e16'] },
                  { name: 'warning', values: ['#fbbf24', '#fbbf24'] },
                  { name: 'warning-muted', values: ['#fef3cb', '#b45309'] },
                  { name: 'warning-subtle', values: ['#fffbeb', '#451a03'] },
                  { name: 'danger', values: ['#e11d48', '#f43f5e'] },
                  { name: 'danger-muted', values: ['#fedfe2', '#be123c'] },
                  { name: 'danger-subtle', values: ['#fff5ee', '#4c0519'] },
                  { name: 'info-subtle', values: ['#eff6ff', '#172554'] },
                ],
              }],
            },
            {
              id: 'text', label: 'Text',
              blocks: [{
                type: 'tokens', kind: 'color', prefix: '--cui-color-text-', columns: ['Light', 'Dark'],
                items: [
                  { name: 'default', values: ['#232222', '#fdfcf9'] },
                  { name: 'subtle', values: ['#484646', '#e3ddd3'] },
                  { name: 'muted', values: ['#7a7777', '#afa097'] },
                  { name: 'disabled', values: ['#cbbfb5', '#5e5b5a'] },
                  { name: 'inverse', values: ['#ffffff', '#232222'] },
                  { name: 'brand', values: ['#232222', '#ffd582'] },
                  { name: 'on-brand', values: ['#ffffff', '#232222'], note: 'On surface-bg-brand' },
                  { name: 'accent', values: ['#cc8b00', '#ffe682'] },
                  { name: 'on-accent', values: ['#232222', '#232222'], note: 'On surface-bg-accent' },
                  { name: 'success', values: ['#15803d', '#4ade80'] },
                  { name: 'warning', values: ['#b45309', '#fcd34d'] },
                  { name: 'danger', values: ['#be123c', '#fb7185'] },
                  { name: 'on-danger', values: ['#ffffff', '#ffffff'], note: 'On surface-bg-danger' },
                  { name: 'info', values: ['#1d4ed8', '#93c5fd'] },
                ],
              }],
            },
            {
              id: 'icon', label: 'Icon',
              blocks: [{
                type: 'tokens', kind: 'color', prefix: '--cui-color-icon-', columns: ['Light', 'Dark'],
                items: [
                  { name: 'default', values: ['#232222', '#fdfcf9'] },
                  { name: 'subtle', values: ['#484646', '#e3ddd3'] },
                  { name: 'disabled', values: ['#cbbfb5', '#5e5b5a'] },
                  { name: 'brand', values: ['#232222', '#ffd582'] },
                  { name: 'on-brand', values: ['#ffffff', '#232222'] },
                  { name: 'accent', values: ['#cc8b00', '#ffe682'] },
                  { name: 'danger', values: ['#e11d48', '#fb7185'] },
                  { name: 'on-danger', values: ['#ffffff', '#ffffff'] },
                ],
              }],
            },
            {
              id: 'border', label: 'Border',
              blocks: [{
                type: 'tokens', kind: 'color', prefix: '--cui-color-border-', columns: ['Light', 'Dark'],
                items: [
                  { name: 'default', values: ['#e3ddd3', '#484646'] },
                  { name: 'subtle', values: ['#f1ece4', '#333130'] },
                  { name: 'strong', values: ['#afa097', '#7a7777'] },
                  { name: 'hairline', values: ['rgba(82, 82, 82, 0.302)', 'rgba(255, 255, 255, 0.302)'] },
                  { name: 'disabled', values: ['#e3ddd3', '#484646'] },
                  { name: 'focus', values: ['#ffd582', '#ffd582'], note: 'Keyboard focus ring' },
                  { name: 'brand', values: ['#232222', '#ffd582'] },
                  { name: 'brand-muted', values: ['#9e9b9a', '#484646'] },
                  { name: 'brand-subtle', values: ['#dcdad9', '#5e5b5a'] },
                  { name: 'accent', values: ['#ffd582', '#ffd582'] },
                  { name: 'success', values: ['#15803d', '#22c55e'] },
                  { name: 'danger', values: ['#be123c', '#f43f5e'] },
                ],
              }],
            },
          ],
        },
        {
          type: 'rules',
          do: ['Pair `on-…` text and icon colours with their matching surface', 'Use success, warning and danger only for status'],
          dont: ['Pick a colour token because of how it looks in one theme', 'Use brand colours from the Color chapter directly in product UI'],
        },
      ],
    },

    /* -------------------------------------------------------------- Typography */
    {
      id: 'typography',
      group: 'Foundations',
      title: 'Typography',
      summary: 'The product type scale. Culinary UI sets everything in Roobert, with Roobert Mono for code.',
      blocks: [
        {
          type: 'text',
          body: 'Each style is a group of tokens: `--cui-type-<style>-size`, `-weight`, `-line`, `-spacing` and `-family`. Sizes below are Companion; Device sets each style slightly larger (Body MD is 17 px on Companion, 18.24 px on Device).',
        },
        {
          type: 'typescale', sample: 'Dinner, done.',
          items: [
            { group: 'Display & headings' },
            { role: 'Display · display', font: 'Roobert', rem: 3, lh: 52 / 48, weight: 600 },
            { role: 'Heading H1 · heading-h1', font: 'Roobert', rem: 2.75, lh: 48 / 44, weight: 600 },
            { role: 'Heading H2 · heading-h2', font: 'Roobert', rem: 2.375, lh: 42 / 38, weight: 600 },
            { role: 'Heading H3 · heading-h3', font: 'Roobert', rem: 2.125, lh: 38 / 34, weight: 600 },
            { role: 'Heading H4 · heading-h4', font: 'Roobert', rem: 1.875, lh: 34 / 30, weight: 600 },
            { group: 'Titles' },
            { role: 'Title LG · title-lg', font: 'Roobert', rem: 1.75, lh: 32 / 28, weight: 600 },
            { role: 'Title MD · title-md', font: 'Roobert', rem: 1.375, lh: 26 / 22, weight: 600 },
            { group: 'Body' },
            { role: 'Body LG · body-lg', font: 'Roobert', rem: 1.375, lh: 26 / 22, sample: 'Posha cooks dinner while you get on with your evening.' },
            { role: 'Body MD · body-md', font: 'Roobert', rem: 1.0625, lh: 22 / 17, sample: 'Posha cooks dinner while you get on with your evening.' },
            { role: 'Body MD Semi · body-md-semi', font: 'Roobert', rem: 1, lh: 22 / 16, weight: 600, sample: 'Soak the rice noodles before cooking.' },
            { role: 'Body SM · body-sm', font: 'Roobert', rem: 0.875, lh: 18 / 14, sample: 'Weigh the noodles while they’re still dry.' },
            { role: 'Body SM Semi · body-sm-semi', font: 'Roobert', rem: 0.875, lh: 18 / 14, weight: 600, sample: 'Weigh the noodles while they’re still dry.' },
            { group: 'Caption & code' },
            { role: 'Caption · caption', font: 'Roobert', rem: 0.75, lh: 16 / 12, sample: '54 mins · Serves 4' },
            { role: 'Caption MD · caption-md', font: 'Roobert', rem: 0.75, lh: 16 / 12, weight: 600, sample: '54 mins · Serves 4' },
            { role: 'Code MD · code-md', font: 'Roobert Mono', rem: 0.875, lh: 20 / 14, sample: 'PSH-FS-01' },
            { role: 'Code SM · code-sm', font: 'Roobert Mono', rem: 0.75, lh: 18 / 12, sample: 'PSH-FS-01' },
          ],
        },
        {
          type: 'note', title: 'Product type vs. brand type',
          body: 'Inside the app and on the device screen, use this scale. Epika and the brand type scale in the Typography chapter are for marketing and brand moments, not product UI.',
        },
      ],
    },

    /* =============================================================== Components */

    {
      id: 'buttons',
      group: 'Actions & Inputs',
      title: 'Buttons',
      summary: 'Buttons start actions. Four variants set emphasis; shapes cover quantities, banners and icon-only actions.',
      blocks: [
        { type: 'cui', component: 'button', variants: ['Primary', 'Secondary', 'Link', 'Disabled'] },
        { type: 'heading', text: 'Variants' },
        {
          type: 'list', columns: 4,
          items: [
            { title: 'Primary', body: 'The main action on a screen. Use one per view.' },
            { title: 'Secondary', body: 'Supporting actions next to a primary button.' },
            { title: 'Link', body: 'Low-emphasis actions inside content.' },
            { title: 'Danger', body: 'Destructive actions such as remove or delete.' },
          ],
        },
        { type: 'heading', text: 'Sizes' },
        { type: 'cui', component: 'button', variants: ['Small', 'Primary', 'Large', 'Full width'] },
        { type: 'heading', text: 'Shapes' },
        {
          type: 'text',
          body: '**Default** for most actions. **Banner** adds supporting text above the label. **Circular** and **Oval** are icon-only. **Split** pairs a label with a quantity or a second segment, as in Customise · 3.',
        },
        { type: 'cui', component: 'button', variants: ['With quantity', 'Banner', 'Circular', 'Oval (danger)', 'Split', 'Split with quantity', 'Split secondary', 'Split danger'] },
        {
          type: 'rules',
          do: ['Write labels as short verbs: Add to cart, Customise', 'Give icon-only buttons a semantic label for screen readers', 'Use the disabled state rather than hiding an unavailable action'],
          dont: ['Put two primary buttons side by side', 'Use Danger for anything that isn’t destructive', 'Set custom colours, radii or heights on a button'],
        },
        ...cuiBuild('button', 'Button', 'CUIButton(variant: …, size: …)', "CUI.button.html({ label, variant, size, shape, icon, quantity })"),
      ],
    },

    {
      id: 'text-fields',
      group: 'Actions & Inputs',
      title: 'Text Fields',
      summary: 'Single-line inputs with a label, hint, helper text and an error state.',
      blocks: [
        { type: 'cui', component: 'text_field', min: 300 },
        { type: 'heading', text: 'Anatomy' },
        {
          type: 'list', columns: 4,
          items: [
            { title: 'Label', body: 'Names the field. Keep it visible — don’t rely on the hint alone.' },
            { title: 'Hint', body: 'Example input shown while the field is empty.' },
            { title: 'Helper text', body: 'Extra guidance below the field.' },
            { title: 'Error text', body: 'Replaces the helper when input is invalid; the field shakes once.' },
          ],
        },
        {
          type: 'rules',
          do: ['Validate when the person leaves the field, not on every keystroke', 'Say how to fix an error: Enter a 6-digit code'],
          dont: ['Use the hint as the only label', 'Show an error before the person has typed'],
        },
        ...cuiBuild('text_field', 'Text field', 'CUITextField', 'CUI.text_field.html({ label, hintText, helperText, errorText, value, obscureText })'),
      ],
    },

    {
      id: 'toggles',
      group: 'Actions & Inputs',
      title: 'Toggles',
      summary: 'A segmented control for choosing one option from two or three.',
      blocks: [
        { type: 'cui', component: 'toggle', min: 300 },
        {
          type: 'text',
          body: 'Each item can lead with nothing, an **icon** or an **illustration**. Individual items can be disabled while the rest stay selectable.',
        },
        {
          type: 'rules',
          do: ['Use for two or three mutually exclusive options', 'Keep labels to one or two words of similar length'],
          dont: ['Use a toggle for actions — use a button', 'Mix icon and illustration leads in one toggle'],
        },
        ...cuiBuild('toggle', 'Toggle', 'CUIToggle', 'CUI.toggle.html({ items: [{ value, label, leading }], value })'),
      ],
    },

    {
      id: 'sliders',
      group: 'Actions & Inputs',
      title: 'Sliders',
      summary: 'A stepped slider for picking a level, such as spice or oil, from a few fixed stops.',
      blocks: [
        { type: 'cui', component: 'slider', min: 300 },
        {
          type: 'list', columns: 3,
          items: [
            { title: 'Stops', body: 'Two or more fixed stops (three by default), with start, optional middle and end labels.' },
            { title: 'Default marker', body: 'Marks the recipe’s default level and shows a warning while another stop is chosen.' },
            { title: 'Limited range', body: 'Stops outside the allowed range can be locked.' },
          ],
        },
        {
          type: 'rules',
          do: ['Label the ends in plain words: Mild · Hot', 'Show the default stop when people change a recipe setting'],
          dont: ['Use for free numeric input', 'Add more stops than people can tell apart'],
        },
        ...cuiBuild('slider', 'Slider', 'CUISlider', 'CUI.slider.html({ value, stopCount, startLabel, midLabel, endLabel, defaultStop })'),
      ],
    },

    {
      id: 'tags',
      group: 'Display & Layout',
      title: 'Tags',
      summary: 'Small labels for ingredient and recipe status: missing, optional, quantity, rating and more.',
      blocks: [
        { type: 'cui', component: 'tag', min: 200 },
        {
          type: 'text',
          body: 'Each tag type has a fixed meaning and colour. Pick the type by what it says — **Missing**, **Optional**, **Quantity**, **Important**, **Swap** — rather than by colour.',
        },
        {
          type: 'rules',
          do: ['Keep labels to a word or two', 'Use one tag per status'],
          dont: ['Restyle a tag type to mean something new', 'Use tags as buttons'],
        },
        ...cuiBuild('tag', 'Tag', 'CUITag(tagType: …)', 'CUI.tag.html({ tagType, label, icon })'),
      ],
    },

    {
      id: 'accordions',
      group: 'Display & Layout',
      title: 'Accordions',
      summary: 'Expandable rows that keep long content tidy, with an optional eyebrow, description and image.',
      blocks: [
        { type: 'cui', component: 'accordion', min: 320 },
        {
          type: 'rules',
          do: ['Write titles that make sense without opening the row', 'Use for secondary detail, such as tips or nutrition'],
          dont: ['Hide steps people must read', 'Nest accordions inside accordions'],
        },
        ...cuiBuild('accordion', 'Accordion', 'CUIAccordion', 'CUI.accordion.html({ eyebrow, title, description, image, expanded })'),
      ],
    },

    {
      id: 'dividers',
      group: 'Display & Layout',
      title: 'Dividers',
      summary: 'Rules that separate content, in four thicknesses and four colours.',
      blocks: [
        { type: 'cui', component: 'divider', min: 280 },
        {
          type: 'text',
          body: 'Thickness follows the border tokens: **hairline**, **default**, **thick** and **heavy**. Colour: **subtle**, **default**, **strong** or **brand**. Ends are pill-shaped unless set to square.',
        },
        ...cuiBuild('divider', 'Divider', 'CUIDivider', 'CUI.divider.html({ thickness, radius, color })'),
      ],
    },

    {
      id: 'glow',
      group: 'Display & Layout',
      title: 'Glow',
      summary: 'A soft light wash placed behind or over a surface to draw the eye.',
      blocks: [
        { type: 'cui', component: 'glow', min: 300 },
        { type: 'rules', do: ['Use one glow per screen, behind the thing that matters'], dont: ['Use glow as a background pattern'] },
        ...cuiBuild('glow', 'Glow', 'CUIGlow', 'CUI.glow.html({ width, height, stops, color })'),
      ],
    },

    {
      id: 'app-bars',
      group: 'Navigation & Overlays',
      title: 'App Bars',
      summary: 'The bar at the top of a screen: back, title and up to a few actions.',
      blocks: [
        { type: 'cui', component: 'app_bar', min: 360 },
        {
          type: 'list', columns: 2,
          items: [
            { title: 'Title', body: 'Back button, a title (centred by default) and icon actions. Long titles end with an ellipsis.' },
            { title: 'Serving', body: 'Shows the serving size first, for recipe screens, followed by any actions.' },
          ],
        },
        ...cuiBuild('app_bar', 'App bar', 'CUIAppBar', 'CUI.appBar.html({ variant, title, actions, servingLabel })'),
      ],
    },

    {
      id: 'tab-bars',
      group: 'Navigation & Overlays',
      title: 'Tab Bars',
      summary: 'The category rail: a row of illustrated tabs with selected and error states.',
      blocks: [
        { type: 'cui', component: 'tab_bar', min: 300 },
        {
          type: 'rules',
          do: ['Pair every tab with a short label', 'Use the error state to flag a category that needs attention'],
          dont: ['Use the rail for actions', 'Select more than one tab'],
        },
        ...cuiBuild('tab_bar', 'Tab bar', 'CUITabBar', 'CUI.tabBar.railHtml({ labels, icons, selectedIndex })'),
      ],
    },

    {
      id: 'bottom-sheets',
      group: 'Navigation & Overlays',
      title: 'Bottom Sheets',
      summary: 'Panels that slide up over the screen for focused tasks and choices.',
      blocks: [
        { type: 'cui', component: 'bottom_sheet', variants: ['Dismissable (drag handle)', 'Not dismissable', 'Title only'], min: 300 },
        {
          type: 'text',
          body: 'A **dismissable** sheet shows a drag handle and closes with a swipe down or a tap on the scrim. A sheet that is **not dismissable** must offer its own way out.',
        },
        {
          type: 'rules',
          do: ['Keep one task per sheet', 'Give non-dismissable sheets a clear close or confirm button'],
          dont: ['Stack a sheet on top of another sheet', 'Use a sheet for a short confirmation — use a snackbar'],
        },
        ...cuiBuild('bottom_sheet', 'Bottom sheet', 'CUIBottomSheet', 'CUI.bottomSheet.html({ title, subtitle, dismissable, showHandle })'),
      ],
    },

    {
      id: 'popovers',
      group: 'Navigation & Overlays',
      title: 'Popovers',
      summary: 'Small menus anchored to a control, opening above or below it.',
      blocks: [
        { type: 'cui', component: 'popover', variants: ['Top end (default)', 'Bottom start', 'Menu content'], min: 300 },
        {
          type: 'rules',
          do: ['Anchor the popover to the control that opened it', 'Keep menus short'],
          dont: ['Put forms or long content in a popover — use a bottom sheet'],
        },
        ...cuiBuild('popover', 'Popover', 'CUIPopover', 'CUI.popover.html({ alignment, content, barrierDismissible })'),
      ],
    },

    {
      id: 'snackbars',
      group: 'Navigation & Overlays',
      title: 'Snackbars',
      summary: 'Brief messages at the bottom of the screen that confirm an action or report a problem.',
      blocks: [
        { type: 'cui', component: 'snackbar', variants: ['Success', 'Failure', 'Neutral', 'With action and close'], min: 300 },
        {
          type: 'list', columns: 3,
          items: [
            { title: 'Success', body: 'Confirms something worked.' },
            { title: 'Failure', body: 'Something went wrong; offer a way to retry.' },
            { title: 'Neutral', body: 'Information that needs no action.' },
          ],
        },
        {
          type: 'rules',
          do: ['Keep the message to one line where possible', 'Add one action at most, such as Undo'],
          dont: ['Use a snackbar for errors that block the person', 'Show more than one at a time — they queue'],
        },
        ...cuiBuild('snackbar', 'Snackbar', 'CUISnackbar', 'CUI.snackbar.html({ variant, message, icon, actionLabel, duration })'),
      ],
    },

    {
      id: 'recipe-cards', group: 'Cards & Content', title: 'Recipe Cards',
      summary: 'A recipe with its photo, title and prep and cook times. Vertical for grids, horizontal for lists.',
      blocks: [
        { type: 'cui', component: 'recipe_card', min: 260 },
        ...cuiBuild('recipe_card', 'Recipe card', 'CUIRecipeCard', 'CUI.recipeCard.html({ variant, title, prepTime, cookTime, tag, trailingAction })'),
      ],
    },
    {
      id: 'image-cards', group: 'Cards & Content', title: 'Image Cards',
      summary: 'A framed photo of a dish or ingredient — large, small, cover or naked.',
      blocks: [
        { type: 'cui', component: 'image_card', min: 220 },
        ...cuiBuild('image_card', 'Image card', 'CUIImageCard', 'CUI.imageCard.html({ variant, tag, tagLabel })'),
      ],
    },
    {
      id: 'action-cards', group: 'Cards & Content', title: 'Action Cards',
      summary: 'An alert that asks for a decision, in neutral, warning or danger.',
      blocks: [
        { type: 'cui', component: 'action_card', min: 300 },
        { type: 'rules', do: ['Explain the issue in the title and the fix in the description', 'Offer a primary and a secondary action'], dont: ['Use danger for anything that isn’t urgent'] },
        ...cuiBuild('action_card', 'Action card', 'CUIActionCard', 'CUI.actionCard.html({ variant, title, description, primaryLabel, secondaryLabel })'),
      ],
    },
    {
      id: 'nudge-cards', group: 'Cards & Content', title: 'Nudge Cards',
      summary: 'A light prompt with a link, suggesting a next step.',
      blocks: [
        { type: 'cui', component: 'nudge_card', min: 300 },
        ...cuiBuild('nudge_card', 'Nudge card', 'CUINudgeCard', 'CUI.nudgeCard.html({ title, linkLabel })'),
      ],
    },
    {
      id: 'summary-cards', group: 'Cards & Content', title: 'Summary Cards',
      summary: 'Lists ingredient changes — in the AI summary of a customised recipe, or in recipe detail.',
      blocks: [
        { type: 'cui', component: 'summary_card', min: 300 },
        ...cuiBuild('summary_card', 'Summary card', 'CUISummaryCard', 'CUI.summaryCard.html({ variant, name, tagType, changeLabel })'),
      ],
    },
    {
      id: 'ingredient-tiles',
      group: 'Cards & Content',
      title: 'Ingredient Tiles',
      summary: 'Ingredient photos with actions to remove, swap or add — the building block of recipe customisation.',
      blocks: [
        { type: 'cui', component: 'ingredient_tile', min: 180 },
        {
          type: 'text',
          body: 'Tiles sit in a **justified tile grid** that reflows as ingredients are added and removed — see Motion.',
        },
        ...cuiBuild('ingredient_tile', 'Ingredient tile', 'CUIIngredientTile', 'CUI.ingredientTile.html({ variant, label, tagType, tagLabel })'),
      ],
    },

    {
      id: 'story-bar',
      group: 'Cards & Content',
      title: 'Story Bar',
      summary: 'Segmented progress for step-by-step content, filling as each step plays.',
      blocks: [
        { type: 'cui', component: 'story_bar', min: 300 },
        ...cuiBuild('story_bar', 'Story bar', 'CUIStoryBar', 'CUI.storyBar.html({ itemCount, activeIndex, activeProgress })'),
      ],
    },

    {
      id: 'motion', group: 'Motion', title: 'About Motion', heading: 'Motion',
      summary: 'Ready-made motion components. Each uses Flutter’s curves and timings, and respects reduced motion.',
      blocks: [
        { type: 'text', body: 'Use these instead of animating by hand. Durations scale with the playground’s Speed control — replay at 0.5× to check the easing. When the system asks for reduced motion, tiles land in place and sweeps don’t play.' },
        {
          type: 'links',
          items: [
            { label: 'Rolling Text', note: 'Odometer-style text that rolls up or down when a value changes, such as a serving count.', href: '#/ui-system/rolling-text' },
            { label: 'Word Reveal Text', note: 'Reveals AI-written text word by word, optionally after a thinking loader.', href: '#/ui-system/word-reveal-text' },
            { label: 'Wiggle', note: 'A gentle rocking that marks tiles as editable.', href: '#/ui-system/wiggle' },
            { label: 'Tile Motion', note: 'How tiles enter and leave: scale in, scale out and fade in.', href: '#/ui-system/tile-motion' },
            { label: 'Staggered Reveal', note: 'Brings a run of tiles in one after another, such as suggestions.', href: '#/ui-system/staggered-reveal' },
            { label: 'Justified Tile Grid', note: 'The ingredient grid that reflows smoothly as tiles are added and removed.', href: '#/ui-system/justified-tile-grid' },
            { label: 'Highlight', note: 'A light sweep across a tile that has just changed.', href: '#/ui-system/highlight' },
            { label: 'Dim', note: 'Fades the rest of the screen back while one item is in focus.', href: '#/ui-system/dim' },
            { label: 'Celebration', note: 'A short toast that celebrates a finished customisation.', href: '#/ui-system/celebration' },
          ],
        },
      ],
    },
    {
      id: 'rolling-text', group: 'Motion', title: 'Rolling Text',
      summary: 'Odometer-style text that rolls up or down when a value changes, such as a serving count.',
      blocks: [{ type: 'cui', component: 'rolling_text', min: 220 }, ...cuiBuild('rolling_text', 'Rolling text', 'CUIRollingText', 'CUI.rollingText.html({ value, text })')],
    },
    {
      id: 'word-reveal-text', group: 'Motion', title: 'Word Reveal Text',
      summary: 'Reveals AI-written text word by word, optionally after a thinking loader.',
      blocks: [{ type: 'cui', component: 'word_reveal_text', min: 300 }, ...cuiBuild('word_reveal_text', 'Word reveal text', 'CUIWordRevealText', 'CUI.wordRevealText.html({ text, loading })')],
    },
    {
      id: 'wiggle', group: 'Motion', title: 'Wiggle',
      summary: 'A gentle rocking that marks tiles as editable.',
      blocks: [{ type: 'cui', component: 'wiggle', min: 300 }, ...cuiBuild('wiggle', 'Wiggle', 'CUIWiggle', 'CUI.wiggle.html({ child, enabled })')],
    },
    {
      id: 'tile-motion', group: 'Motion', title: 'Tile Motion',
      summary: 'How tiles enter and leave: scale in, scale out and fade in.',
      blocks: [{ type: 'cui', component: 'tile_motion', min: 260 }, ...cuiBuild('tile_motion', 'Tile motion', 'CUIScaleIn · CUIScaleOut · CUIFadeIn', 'CUI.tileMotion.scaleIn(child) · .scaleOut(child) · .fadeIn(child)')],
    },
    {
      id: 'staggered-reveal', group: 'Motion', title: 'Staggered Reveal',
      summary: 'Brings a run of tiles in one after another, such as suggestions.',
      blocks: [{ type: 'cui', component: 'staggered_reveal', min: 300 }, ...cuiBuild('staggered_reveal', 'Staggered reveal', 'CUIStaggeredReveal', 'CUI.staggeredReveal.html({ child, index })')],
    },
    {
      id: 'justified-tile-grid', group: 'Motion', title: 'Justified Tile Grid',
      summary: 'The ingredient grid that reflows smoothly as tiles are added and removed.',
      blocks: [{ type: 'cui', component: 'justified_tile_grid', variants: ['Customisation beta (3-up)', 'Default (2-up min)', 'Mixed variants'], min: 340 }, ...cuiBuild('justified_tile_grid', 'Justified tile grid', 'CUIJustifiedTileGrid', 'CUI.justifiedTileGrid.html({ ingredients, minColumns, maxColumns })')],
    },
    {
      id: 'highlight', group: 'Motion', title: 'Highlight',
      summary: 'A light sweep across a tile that has just changed.',
      blocks: [{ type: 'cui', component: 'highlight', min: 220 }, ...cuiBuild('highlight', 'Highlight', 'CUIHighlight', 'CUI.highlight.html({ child, active })')],
    },
    {
      id: 'dim', group: 'Motion', title: 'Dim',
      summary: 'Fades the rest of the screen back while one item is in focus.',
      blocks: [{ type: 'cui', component: 'dim', min: 300 }, ...cuiBuild('dim', 'Dim', 'CUIDim', 'CUI.dim.html({ child, dimmed })')],
    },
    {
      id: 'celebration', group: 'Motion', title: 'Celebration',
      summary: 'A short toast that celebrates a finished customisation.',
      blocks: [{ type: 'cui', component: 'celebration', min: 300 }, ...cuiBuild('celebration', 'Celebration', 'CUICelebration', 'CUI.celebration.html({ toastLabel, label, count })')],
    },
  ],
});
