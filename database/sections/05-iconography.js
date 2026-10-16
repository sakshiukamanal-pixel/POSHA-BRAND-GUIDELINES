/* Icons are read from assets/05-iconography/01-icons/<family>/<category>/.
   Drop a .svg with the same name next to a .png (e.g. 01-sea-food.svg) to enable SVG download,
   then run code/tools/scan-media.bat.
   Each page's `parts` become its sections and the third level in the sidebar
   (link to one with #/iconography/<page>/<part>). */
const ICONS = '05-iconography/01-icons';

POSHA.section({
  id: 'iconography',
  title: 'Iconography',
  layout: 'pages',
  heroStyle: 'stacked',
  summary: 'Icon families, how they’re drawn and sized, and every icon ready to download.',

  pages: [
    {
      id: 'overview',
      title: 'Overview',
      heading: 'Iconography',
      assets: '03-stroke-style', // "In use" images
      summary: 'Why Posha uses icons, how they are drawn, and how to size them.',
      blocks: [
        {
          type: 'text',
          body: [
            'Icons are the shorthand of the Posha experience. They help people scan a recipe, understand a setting or spot a dietary need at a glance, often faster than words can. Across the app, the device screen, the website and marketing, they carry the same warm, rounded character as our food and our type.',
            'Posha has four icon families, each with its own job. **Gradient icons** describe food and preferences. **Container icons** map ingredients to Posha’s four containers. **Line icons** handle navigation and everyday actions in the interface. **Illustrations** mark the bigger moments, such as confirmations and empty screens.',
          ],
        },
        {
          type: 'note', title: 'How to use icons',
          body: [
            'Pair an icon with a short label wherever there is room. Icons support words, they rarely replace them. Use one family per context, so gradient and line icons never sit side by side in the same row or component.',
            'Choose a size from the sizing scale below and use the files exactly as supplied: never stretch, crop, recolour, outline or redraw an icon. Download icons from their family pages rather than copying screenshots.',
          ],
        },
      ],
      parts: [
        {
          id: 'families',
          title: 'Icon Families',
          summary: 'Four families, each with its own job. Open a family to see and download every icon.',
          blocks: [
            {
              type: 'list', columns: 4,
              items: [
                { title: 'Gradient Icons', icon: `${ICONS}/01-gradient-icons/02-collection-icons/08-pasta.png`, body: 'Food and preferences: allergens, collections, diets and recipe controls. [See all](#/iconography/gradient-icons)' },
                { title: 'Container Icons', icon: `${ICONS}/02-container-icons/01-container-icons/01-container-a.png`, body: 'Map ingredients to Posha’s four containers, A to D. [See all](#/iconography/container-icons)' },
                { title: 'Line Icons', icon: `${ICONS}/03-line-icons/01-line-icons/10-home.png`, body: 'Navigation and everyday actions in the app, with filled and tiny versions. [See all](#/iconography/line-icons)' },
                { title: 'Illustrations', icon: `${ICONS}/04-illustrations/01-large-icons-illustrations/05-completed.png`, body: 'The bigger moments, like confirmations, status and empty screens, plus debug diagrams. [See all](#/iconography/illustrations)' },
              ],
            },
          ],
        },
        {
          id: 'stroke-style',
          title: 'Stroke & Style',
          summary: 'Three principles keep every gradient icon recognisably Posha.',
          blocks: [
            {
              type: 'principles2',
              items: [
                { num: '01', title: 'The soft and bulgy geometry', src: `${ICONS}/01-gradient-icons/01-allergens/10-eggs.png`, overlay: 'arc',
                  body: 'Shapes are full and rounded, with swelling curves instead of sharp corners, so every icon feels soft, friendly and edible.' },
                { num: '02', title: 'The absence of outlines', src: `${ICONS}/01-gradient-icons/04-modify-icons/06-spicy-heat.png`, overlay: 'outline',
                  body: 'No strokes around the forms. Shape is carried by colour and gradient alone, keeping silhouettes clean at every size.' },
                { num: '03', title: 'The unified gradient behaviour', src: `${ICONS}/01-gradient-icons/02-collection-icons/09-dessert.png`, overlay: 'ring',
                  body: 'Every icon shares the same light direction and gradient logic, so a whole set reads as one family side by side.' },
              ],
            },
            { type: 'displayheading', text: 'In use' },
            {
              type: 'mosaic',
              items: [
                { src: './in-use-pattern.png', span: 6, caption: 'Pattern: gradient icons as a repeat' },
                { src: './in-use-type-poster.png', span: 6, caption: 'Poster: icons set within Epika type' },
                { src: './in-use-ui-and-order-card.png', span: 5, caption: 'Product UI: collection chips and order card' },
                { src: './line-icon-system.png', span: 7, caption: 'Line icon system' },
              ],
            },
          ],
        },
        {
          id: 'sizing',
          title: 'Sizing',
          summary: 'Icons are produced at four sizes. Pick the size by role, never by scaling an icon freely.',
          blocks: [
            {
              // slider: true adds the drag-to-resize explorer above the chart
              type: 'scalematrix', scale: 2, slider: true,
              items: [
                { size: 24, src: `${ICONS}/03-line-icons/03-tiny-icons/02-kosher.png`, alt: 'Kosher' },
                { size: 32, src: `${ICONS}/01-gradient-icons/04-modify-icons/06-spicy-heat.png`, alt: 'Spicy heat' },
                { size: 48, src: `${ICONS}/01-gradient-icons/01-allergens/10-eggs.png`, alt: 'Eggs' },
                { size: 48, src: `${ICONS}/01-gradient-icons/03-dietary-choices/04-vegetarian-1.png`, alt: 'Vegetarian' },
                { size: 48, src: `${ICONS}/01-gradient-icons/01-allergens/02-meat.png`, alt: 'Meat' },
                { size: 64, src: `${ICONS}/02-container-icons/01-container-icons/01-container-a.png`, alt: 'Container' },
                { size: 64, src: `${ICONS}/04-illustrations/01-large-icons-illustrations/10-order-confirmed.png`, alt: 'Order confirmed' },
              ],
              groups: [
                { label: 'Tiny', from: 1, to: 1 },
                { label: 'Small', from: 2, to: 2 },
                { label: 'Medium', from: 3, to: 5 },
                { label: 'Large', from: 6, to: 7 },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'gradient-icons',
      title: 'Gradient Icons',
      assets: '01-icons',
      summary: 'Soft, outline-free icons for food, diet and preferences. Click any icon to download it as PNG or SVG.',
      blocks: [
        {
          type: 'text',
          body: 'Gradient icons are Posha’s most expressive icons. Full, rounded shapes with no outlines and one shared light source make them feel friendly and edible, with the same warmth as our food photography. They label food and preferences: allergens, recipe collections, dietary choices and the ways a dish can be adjusted.',
        },
        {
          type: 'note', title: 'How to use',
          body: 'Use them at Small (32px) and above, on light, plain backgrounds, beside a short label. Keep the gradient exactly as supplied. Never recolour it, flatten it or add an outline, and don’t place them on busy photography.',
        },
      ],
      parts: [
        { id: 'allergens', title: 'Allergens', summary: 'Flag the common allergens in a recipe. Always show them with their name, never on their own.', blocks: [{ type: 'iconset', folder: './01-gradient-icons/01-allergens', columns: 4 }] },
        { id: 'collection-icons', title: 'Collection Icons', summary: 'Represent recipe collections (rice, noodles, soups, desserts and more) in browsing and filters.', blocks: [{ type: 'iconset', folder: './01-gradient-icons/02-collection-icons', columns: 4 }] },
        { id: 'dietary-choices', title: 'Dietary Choices', summary: 'Show the eating preferences a person sets, such as vegan, vegetarian or pescatarian.', blocks: [{ type: 'iconset', folder: './01-gradient-icons/03-dietary-choices', columns: 4 }] },
        { id: 'modify-icons', title: 'Modify Icons', summary: 'Sit beside the controls that adjust a recipe: spice, salt, sweetness, oil, consistency and doneness.', blocks: [{ type: 'iconset', folder: './01-gradient-icons/04-modify-icons', columns: 4 }] },
        { id: 'website-icons', title: 'Website Icons', summary: 'Highlight recipe qualities on the website, such as high protein or quick to cook.', blocks: [{ type: 'iconset', folder: './01-gradient-icons/05-website-icons', columns: 4 }] },
      ],
    },
    {
      id: 'container-icons',
      title: 'Container Icons',
      assets: '01-icons',
      summary: 'The four Posha containers, as used in recipes and the app. Click any icon to download it as PNG or SVG.',
      blocks: [
        {
          type: 'text',
          body: 'Posha cooks from four ingredient containers, A to D. These icons show each container so people know exactly where every ingredient goes when they prep a recipe: in the app, on the device screen and on printed recipe cards.',
        },
        {
          type: 'note', title: 'How to use',
          body: 'Always match the icon to its container letter and keep the order A, B, C, D. Use them at the Large size (64px) so the fill and contents stay readable, and show the ingredients for that container right beside the icon.',
        },
        { type: 'iconset', folder: './02-container-icons', columns: 4 },
      ],
    },
    {
      id: 'line-icons',
      title: 'Line Icons',
      assets: '01-icons',
      summary: 'Interface icons drawn on a shared grid with one stroke weight. Click any icon to download it as PNG or SVG.',
      blocks: [
        {
          type: 'text',
          body: 'Line icons are the working icons of the interface: navigation, settings, account and support. Drawn on a 24 × 24 grid with a single stroke weight and rounded terminals, they stay calm and legible at small sizes, so the food and the content can lead.',
        },
        {
          type: 'note', title: 'How to use',
          body: 'Use the outline icons by default and the filled versions to show a selected or active state. Set an icon in the same colour as the text beside it, and keep tiny icons for compact labels such as dietary badges.',
        },
      ],
      parts: [
        { id: 'line', title: 'Line Icons', summary: 'Outline icons for navigation and everyday actions across the app.', blocks: [{ type: 'iconset', folder: './03-line-icons/01-line-icons', columns: 6 }] },
        { id: 'line-filled', title: 'Line Filled Icons', summary: 'Filled versions of the line icons, for selected and active states.', blocks: [{
          type: 'iconset', folder: './03-line-icons/02-line-filled-icons', columns: 6,
          // the exported files are named "artboard-…", so give each icon its real name (matches the line icon set)
          names: {
            'artboard-10-copy': 'Search', 'artboard-11-copy': 'Grocery', 'artboard-12-copy': 'My recipes', 'artboard-13-copy': 'Profile',
            'artboard-14-copy': 'Dietary choices', 'artboard-15-copy': 'Allergens', 'artboard-16-copy': 'Cuisines', 'artboard-17-copy': 'Cooking',
            'artboard-18-copy': 'Measurements', 'artboard-19-copy': 'FAQs', 'artboard-20-copy': 'Terms', 'artboard-21-copy': 'Privacy policy',
            'artboard-22-copy': 'Log out', 'artboard-23-copy': 'Delete account', 'artboard-26': 'Prep', 'artboard-27': 'Information',
            'artboard-9-copy': 'Home', 'favourite-filled': 'Favourite', 'notes': 'Notes', 'support-contact-filled': 'Support',
          },
        }] },
        { id: 'tiny', title: 'Tiny Icons', summary: 'Compact badges for dietary and nutrition labels, such as gluten-free or vegan, at the Tiny size (24px).', blocks: [{ type: 'iconset', folder: './03-line-icons/03-tiny-icons', columns: 6 }] },
        {
          id: 'grid-construction',
          title: 'Grid & Construction',
          summary: 'Line icons are drawn on a 24 × 24 grid with shared keylines, so every icon carries the same weight and proportion.',
          blocks: [
            { type: 'iconconstruction', labels: ['Bulgy shape language', 'Stroke width 1pt', 'Rounded terminals'] },
            {
              type: 'columns',
              columns: [
                [{ type: 'heading', text: 'Grid' }, { type: 'text', size: 'sm', body: 'A 24 × 24 artboard with a half-unit pixel grid. Keylines (the rounded square, two circles and diagonals) set the live area so square, round and tall icons feel the same size.' }],
                [{ type: 'heading', text: 'Stroke' }, { type: 'text', size: 'sm', body: 'One stroke weight across the set, with rounded caps and joins. Corners are generously rounded for the soft, bulgy Posha character.' }],
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'illustrations',
      title: 'Illustrations',
      assets: '01-icons',
      summary: 'Larger illustrated icons for app states, confirmations and diagrams. Click any one to download it as PNG or SVG.',
      blocks: [
        {
          type: 'text',
          body: 'Illustrations are larger, more detailed drawings for the moments that deserve a pause: an order confirmed, a payment completed, a lost connection, an empty screen. They share the soft, rounded style of the gradient icons at a bigger scale, so they feel like part of the same family.',
        },
        {
          type: 'note', title: 'How to use',
          body: 'Use one illustration per screen, centred above a short headline and a supporting line. Show them at the Large size (64px) or bigger, on a plain background with plenty of space around them.',
        },
      ],
      parts: [
        { id: 'large-icons', title: 'Large Icons & Illustrations', summary: 'For status screens, confirmations and empty states in the app.', blocks: [{ type: 'iconset', folder: './04-illustrations/01-large-icons-illustrations', columns: 4 }] },
        { id: 'debug-diagrams', title: 'Debug Diagrams', summary: 'Step-by-step diagrams for troubleshooting and support flows.', blocks: [{ type: 'iconset', folder: './04-illustrations/02-debug-diagrams', columns: 4 }] },
      ],
    },
  ],
});
