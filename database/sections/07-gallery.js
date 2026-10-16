/* The Gallery uses layout: 'pages' — each sub-item is its own page.

   IMAGE CODES — PSH-<set>-<number>
     FS = Food Shots · PR = Product Renders · PC = Product Components · IG = Feature Infographics · VD = Videos
   Files are named after their code (e.g. psh-fs-07-beef-and-broccoli.jpg) so a code
   quoted in Slack / Figma maps straight to a file. `tags` feed the gallery search.
   shape: 'circle' (plated dish, cropped round) · 'cover' (rounded photo tile) · none (cut-out) */

{ // block scope keeps these shortcuts local to this file
const FS = './01-food-shots/', PR = './02-product-renders/', PC = './03-product-components/';
const IG = './01-feature-infographics/'; // used on the Others page (assets/07-gallery/04-others/)

// Product render sets: rnd('04', angle, background) → PSH-PR-04 …
const ANGLES = {
  'front-three-quarter': ['Front Three-Quarter', ['three-quarter', 'front view', 'screen', 'side view']],
  'front-elevation': ['Front Elevation', ['front view', 'elevation', 'straight on', 'side view']],
  'high-three-quarter': ['High Three-Quarter', ['three-quarter', 'top view', 'recipe screen', 'pan']],
  'spice-drawer-open': ['Spice Drawer Open', ['three-quarter', 'spice pods', 'spices', 'drawer', 'carousel']],
};
const BACKGROUNDS = {
  black: ['Black BG', ['dark background', 'black background'], 'cover'],
  white: ['White BG', ['white background', 'light background'], 'cover'],
  transparent: ['Transparent', ['transparent', 'cut-out', 'png', 'no background'], 'plain'],
};
const rnd = (n, angle, bg) => ({
  src: PR + `psh-pr-${n}-${angle}-${bg}-bg.${bg === 'transparent' ? 'png' : 'jpg'}`,
  code: `PSH-PR-${n}`,
  title: `${ANGLES[angle][0]} — ${BACKGROUNDS[bg][0]}`,
  tags: ['posha', 'device', 'render', 'studio', ...ANGLES[angle][1], ...BACKGROUNDS[bg][1]],
  shape: BACKGROUNDS[bg][2],
});

// Videos live once in assets/07-gallery/03-videos/ (web-sized MP4 + poster .jpg) and are shown
// both on the Videos page and inside the matching Essentials section.
const V = '07-gallery/03-videos/';
const vid = (slug, code, title, tags) => ({ src: V + slug + '.mp4', poster: V + slug + '.jpg', code, title, tags: ['video', 'film', ...tags], shape: 'cover' });
const VIDEOS = {
  recipe:        vid('psh-vd-01-recipe-montage', 'PSH-VD-01', 'Recipe Montage', ['food', 'recipes', 'mac and cheese', 'montage', 'with copy']),
  recipeClean:   vid('psh-vd-02-recipe-montage-no-copy', 'PSH-VD-02', 'Recipe Montage — No Copy', ['food', 'recipes', 'montage', 'no copy', 'clean']),
  how:           vid('psh-vd-03-how-posha-works', 'PSH-VD-03', 'How Posha Works', ['product', 'explainer', 'ingredient containers', 'with copy']),
  howClean:      vid('psh-vd-04-how-posha-works-no-copy', 'PSH-VD-04', 'How Posha Works — No Copy', ['product', 'explainer', 'ingredient containers', 'no copy', 'clean']),
  action:        vid('psh-vd-05-posha-in-action', 'PSH-VD-05', 'Posha in Action', ['product', 'device', 'hero film', '4k']),
  cleaning:      vid('psh-vd-06-cleaning-posha', 'PSH-VD-06', 'Cleaning Posha', ['product', 'pan', 'cleaning', 'how to', 'square']),
  vision:        vid('psh-vd-07-computer-vision', 'PSH-VD-07', 'Computer Vision', ['feature', 'camera', 'ai', 'colour change', 'with copy']),
  visionClean:   vid('psh-vd-08-computer-vision-no-copy', 'PSH-VD-08', 'Computer Vision — No Copy', ['feature', 'camera', 'ai', 'no copy', 'clean']),
  reviews:       vid('psh-vd-09-product-reviews', 'PSH-VD-09', 'Product Reviews', ['reviews', 'testimonials', 'customers', 'people', 'interview']),
  spicePods:     vid('psh-vd-10-spice-pod-carousel-clip', 'PSH-VD-10', 'Spice Pod Carousel — Clip', ['product', 'spice', 'spices', 'pods', 'carousel', 'close-up', 'clip', 'loop']),
  touchscreen:   vid('psh-vd-11-touchscreen-startup-clip', 'PSH-VD-11', 'Touchscreen Start-up — Clip', ['render', 'product', 'screen', 'touchscreen', 'logo', 'start-up', 'clip', 'loop']),
};

POSHA.section({
  id: 'gallery',
  title: 'Gallery',
  layout: 'pages',
  heroStyle: 'stacked',
  summary: 'Approved photography, renders and video, ready to use.',

  pages: [
    {
      // Shoot folders live on Google Drive; previews are in assets/07-gallery/05-faro-films/<part>/
      id: 'faro-films',
      title: 'Faro Films',
      assets: '05-faro-films',
      summary: 'Shoot 2: lifestyle and testimonials. Our only fully owned, rights-cleared family footage.',
      blocks: [
        {
          type: 'text',
          body: [
            'Faro Films Shoot 2 is our lifestyle and testimonial shoot. It pairs real Posha users talking about the product with a hired family of four acting out everyday moments at home: homework at the table with Posha cooking in the background, and dinner together.',
            'It is our only fully owned, rights-cleared family and lifestyle footage, so start here whenever a piece needs real people in a real home. Each folder below opens in Google Drive.',
          ],
        },
        {
          type: 'facts',
          items: [
            { k: 'Shoot', v: 'Faro Films · Shoot 2' },
            { k: 'Content', v: 'Lifestyle + testimonials' },
            { k: 'Rights', v: 'Fully owned · cleared' },
            { k: 'Files', v: 'Proxies · RAW originals' },
          ],
        },
        {
          type: 'note', title: 'These are proxies',
          body: 'Every file here is a proxy, not the original. Proxies are large enough for everyday use: social, web, decks and edits. The originals are RAW; request those only for print or a hero film.',
        },
      ],
      parts: [
        {
          id: 'lifestyle-photos', title: 'Lifestyle Photos', navTitle: 'Lifestyle Photos',
          summary: 'Every photo from the shoot: testimonial portraits and the family at home. Use this as the main photo source.',
          keywords: ['photos', 'lifestyle', 'family', 'portraits', 'full set'],
          blocks: [{
            type: 'collection', alt: 'Faro Films lifestyle photo',
            tags: ['Photos', 'Full set', { label: 'Main photo source', tone: 'key' }],
            link: { href: 'https://drive.google.com/drive/folders/1SvA3j4BVMhAdDoaNXh1gx_T1sSlWRZKU', label: 'Open in Google Drive' },
            items: [1, 2, 3, 4, 5, 6].map((n) => `./lifestyle-photos/frame-0${n}.jpg`),
          }],
        },
        {
          id: 'a-cam', title: 'A Cam',
          summary: 'The main footage, shot straight on. Includes 3–4 user testimonials and the family scenes — homework with Posha robot in the background and dinner together.',
          keywords: ['a cam', 'video', 'footage', 'testimonials', 'main'],
          blocks: [{
            type: 'collection', alt: 'Faro Films A Cam frame',
            tags: ['Video', 'Straight angle', 'Testimonials', { label: 'Main footage', tone: 'key' }],
            link: { href: 'https://drive.google.com/drive/folders/1zIsvF2lRbJjlYFFIAkw5wHLA7pNmfNEb', label: 'Open in Google Drive' },
            items: [1, 2, 3, 4, 5, 6].map((n) => `./a-cam/frame-0${n}.jpg`),
          }],
        },
        {
          id: 'b-cam', title: 'B Cam',
          summary: 'The same scenes from a three-quarter angle, plus B-roll of the testimonials. Use it to cut between angles or for reactions and cutaways.',
          keywords: ['b cam', 'video', 'footage', 'b-roll', 'angle'],
          blocks: [{
            type: 'collection', alt: 'Faro Films B Cam frame',
            tags: ['Video', '3/4 angle', 'B-roll'],
            link: { href: 'https://drive.google.com/drive/folders/1W0bhP197HBA-DsMN9PtwXESxg97cQSAQ', label: 'Open in Google Drive' },
            items: [1, 2, 3, 4, 5, 6].map((n) => `./b-cam/frame-0${n}.jpg`),
          }],
        },
        {
          id: 'killian-selects', title: 'Killian Selects',
          summary: 'The photographer’s preferred picks, unedited. Lower priority. Look in the full Lifestyle Photos set first.',
          keywords: ['killian', 'selects', 'photographer', 'picks', 'unedited'],
          blocks: [{
            type: 'collection', alt: 'Killian Selects photo',
            tags: ['Photos', 'Unedited', { label: 'Lower priority', tone: 'low' }],
            link: { href: 'https://drive.google.com/drive/folders/1dPVWehsY4kB_W--9xglro5CC3bLy4mpl', label: 'Open in Google Drive' },
            items: [1, 2, 3, 4, 5, 6].map((n) => `./killian-selects/frame-0${n}.jpg`),
          }],
        },
      ],
    },
    {
      id: 'essentials',
      title: 'Essentials',
      assets: '01-essentials', // folder names are pinned so reordering pages never breaks media paths
      summary: 'Art direction for food, lifestyle, product and render photography: what we shoot and how it feels.\nTo access this file, [Click here](#)',
      blocks: [
        {
          type: 'text',
          body: [
            'Essentials is the core library of approved Posha imagery: plated food, studio renders of the device and close-ups of the product in use. Use it for the website, the app, social, decks and sales material, so every touchpoint shows Posha the same way.',
            'Every file has a code, such as **PSH-FS-07**. Quote the code when you share or request an image, and download the original from here rather than reusing screenshots. Click any image to view it full size.',
          ],
        },
        { type: 'gallerysearch', placeholder: 'Search the gallery: try “renders”, “pad thai”, “spice pods” or a code like PSH-FS-07' },
      ],
      // Each part is a section on the page and a sub-item in the sidebar (#/gallery/essentials/<id>)
      parts: [
            {
              id: 'food-shots', title: 'Food Shots',
              summary: 'Dishes cooked by Posha robot, shot from above. Use cut-outs for layouts and menus, round plates for recipe tiles, and macro close-ups when texture should lead.',
              keywords: ['food', 'foods', 'food shot', 'dish', 'dishes', 'meal', 'recipe', 'recipes', 'cuisine', 'plated'],
              blocks: [{
                type: 'grid', folder: './01-food-shots', columns: 4,
                items: [
                  { src: FS + 'psh-fs-01-carrot-halwa.png', code: 'PSH-FS-01', title: 'Carrot Halwa', tags: ['top view', 'cut-out', 'dessert', 'sweet', 'indian', 'vegetarian', 'gajar'] },
                  { src: FS + 'psh-fs-02-rabdi.png', code: 'PSH-FS-02', title: 'Rabdi', tags: ['top view', 'cut-out', 'dessert', 'sweet', 'indian', 'vegetarian', 'pistachio', 'saffron'] },
                  { src: FS + 'psh-fs-03-paneer-tikka-masala.png', code: 'PSH-FS-03', title: 'Paneer Tikka Masala', tags: ['top view', 'cut-out', 'curry', 'indian', 'vegetarian', 'paneer'] },
                  { src: FS + 'psh-fs-04-phirni.png', code: 'PSH-FS-04', title: 'Phirni', tags: ['top view', 'cut-out', 'dessert', 'sweet', 'indian', 'vegetarian', 'rice pudding', 'saffron'] },
                  { src: FS + 'psh-fs-05-spaghetti-alfredo.png', code: 'PSH-FS-05', title: 'Spaghetti Alfredo with Mushrooms', tags: ['top view', 'cut-out', 'pasta', 'italian', 'vegetarian', 'mushroom', 'creamy'] },
                  { src: FS + 'psh-fs-06-creamy-veg-penne.png', code: 'PSH-FS-06', title: 'Creamy Veg Penne', tags: ['top view', 'cut-out', 'pasta', 'italian', 'vegetarian', 'penne'] },
                  { src: FS + 'psh-fs-07-beef-and-broccoli.jpg', code: 'PSH-FS-07', title: 'Beef & Broccoli', shape: 'circle', tags: ['top view', 'plated', 'chinese', 'asian', 'beef', 'meat', 'non-veg', 'stir fry'] },
                  { src: FS + 'psh-fs-08-beef-stew.jpg', code: 'PSH-FS-08', title: 'Beef Stew', shape: 'circle', tags: ['top view', 'plated', 'american', 'beef', 'meat', 'non-veg', 'stew', 'potato'] },
                  { src: FS + 'psh-fs-09-kung-pao-tofu.jpg', code: 'PSH-FS-09', title: 'Kung Pao Tofu', shape: 'circle', tags: ['top view', 'plated', 'chinese', 'asian', 'tofu', 'vegan', 'vegetarian', 'stir fry'] },
                  { src: FS + 'psh-fs-10-aloo-gobi.jpg', code: 'PSH-FS-10', title: 'Aloo Gobi', shape: 'circle', tags: ['top view', 'plated', 'indian', 'vegan', 'vegetarian', 'potato', 'cauliflower', 'sabzi'] },
                  { src: FS + 'psh-fs-11-buffalo-chicken-wings.jpg', code: 'PSH-FS-11', title: 'Buffalo Chicken Wings', shape: 'circle', tags: ['top view', 'plated', 'american', 'chicken', 'meat', 'non-veg', 'wings', 'starter'] },
                  { src: FS + 'psh-fs-12-chicken-tikka-masala.jpg', code: 'PSH-FS-12', title: 'Chicken Tikka Masala', shape: 'circle', tags: ['top view', 'plated', 'indian', 'curry', 'chicken', 'meat', 'non-veg'] },
                  { src: FS + 'psh-fs-13-shakshuka.jpg', code: 'PSH-FS-13', title: 'Shakshuka', shape: 'circle', tags: ['top view', 'plated', 'middle eastern', 'eggs', 'vegetarian', 'tomato', 'breakfast'] },
                  { src: FS + 'psh-fs-14-spaghetti-bolognese.jpg', code: 'PSH-FS-14', title: 'Spaghetti Bolognese', shape: 'circle', tags: ['top view', 'plated', 'italian', 'pasta', 'beef', 'meat', 'non-veg'] },
                  { src: FS + 'psh-fs-15-pad-thai.jpg', code: 'PSH-FS-15', title: 'Pad Thai', shape: 'circle', tags: ['top view', 'plated', 'thai', 'asian', 'noodles', 'peanut', 'vegetarian'] },
                  { src: FS + 'psh-fs-16-saag-paneer.jpg', code: 'PSH-FS-16', title: 'Saag Paneer', shape: 'circle', tags: ['top view', 'plated', 'indian', 'curry', 'paneer', 'spinach', 'vegetarian', 'palak'] },
                  { src: FS + 'psh-fs-17-mac-and-cheese.jpg', code: 'PSH-FS-17', title: 'Mac & Cheese', shape: 'circle', tags: ['top view', 'plated', 'american', 'pasta', 'cheese', 'vegetarian', 'macaroni'] },
                  { src: FS + 'psh-fs-18-spaghetti-bolognese-macro.jpg', code: 'PSH-FS-18', title: 'Spaghetti Bolognese — Macro', shape: 'cover', tags: ['close-up', 'macro', 'detail', 'italian', 'pasta', 'beef', 'meat', 'non-veg'] },
                  { src: FS + 'psh-fs-19-pad-thai-macro.jpg', code: 'PSH-FS-19', title: 'Pad Thai — Macro', shape: 'cover', tags: ['close-up', 'macro', 'detail', 'thai', 'asian', 'noodles', 'peanut', 'vegetarian'] },
                  { src: FS + 'psh-fs-20-saag-paneer-macro.jpg', code: 'PSH-FS-20', title: 'Saag Paneer — Macro', shape: 'cover', tags: ['close-up', 'macro', 'detail', 'indian', 'curry', 'paneer', 'spinach', 'vegetarian'] },
                  { src: FS + 'psh-fs-21-beef-and-broccoli-macro.jpg', code: 'PSH-FS-21', title: 'Beef & Broccoli — Macro', shape: 'cover', tags: ['close-up', 'macro', 'detail', 'chinese', 'asian', 'beef', 'meat', 'non-veg'] },
                  VIDEOS.recipe, VIDEOS.recipeClean,
                ],
              }],
            },
            {
              id: 'product-renders', title: 'Product Imagery',
              summary: 'Photos and studio renders of Posha robot. Lead with the hero photo; use the studio renders for four angles on black, white and transparent backgrounds. The transparent PNGs place Posha robot on your own backgrounds without a halo.',
              keywords: ['product imagery', 'product photo', 'hero', 'hero image', 'render', 'renders', '3d', 'cgi', 'device render', 'machine', 'studio render'],
              blocks: [{
                type: 'heading', text: 'Hero image',
              }, {
                type: 'image', src: PR + 'psh-pr-16-posha-in-kitchen-render.jpg', alt: 'Posha robot on a wooden kitchen counter',
                caption: 'PSH-PR-16 · Our best product image so far. A real photo, not a render: use it as the hero.',
              }, {
                type: 'heading', text: 'All product images',
              }, {
                type: 'grid', columns: 4, shape: 'cover',
                items: [
                  { src: PR + 'psh-pr-16-posha-in-kitchen-render.jpg', code: 'PSH-PR-16', title: 'Posha Robot in a Kitchen · Hero', tags: ['posha', 'device', 'hero', 'hero image', 'photo', 'front view', 'kitchen', 'counter', 'lifestyle', 'interior'] },
                  // 4 camera angles × black / white / transparent backgrounds (New Resources/Product Shots)
                  rnd('04', 'front-three-quarter', 'black'), rnd('05', 'front-elevation', 'black'), rnd('06', 'high-three-quarter', 'black'), rnd('07', 'spice-drawer-open', 'black'),
                  rnd('08', 'front-three-quarter', 'white'), rnd('09', 'front-elevation', 'white'), rnd('10', 'high-three-quarter', 'white'), rnd('11', 'spice-drawer-open', 'white'),
                  rnd('12', 'front-three-quarter', 'transparent'), rnd('13', 'front-elevation', 'transparent'), rnd('14', 'high-three-quarter', 'transparent'), rnd('15', 'spice-drawer-open', 'transparent'),
                  VIDEOS.touchscreen,
                ],
              }, {
                type: 'heading', text: 'Old renders (deprecated)',
              }, {
                type: 'note', tone: 'warn', title: 'Don’t use unless you really have to',
                body: 'These are older renders and are deprecated. Use the studio renders above instead, and only reach for these when nothing else works.',
              }, {
                type: 'grid', columns: 4, shape: 'cover',
                items: [
                  { src: PR + 'psh-pr-01-posha-render-dark.png', code: 'PSH-PR-01', title: 'Posha — Dark Studio', tags: ['posha', 'device', 'side view', 'three-quarter', 'dark background', 'studio', 'render', 'deprecated', 'old'] },
                  { src: PR + 'psh-pr-02-posha-render-grey.png', code: 'PSH-PR-02', title: 'Posha — Grey Studio', tags: ['posha', 'device', 'front view', 'three-quarter', 'grey background', 'studio', 'render', 'deprecated', 'old', 'screen'] },
                  { src: PR + 'psh-pr-03-posha-render-plinth.png', code: 'PSH-PR-03', title: 'Posha on Plinth', tags: ['posha', 'device', 'front view', 'three-quarter', 'warm background', 'plinth', 'studio', 'render', 'deprecated', 'old'] },
                ],
              }],
            },
            {
              id: 'product-components', title: 'Product Components',
              summary: 'The parts that make Posha robot work (ingredient containers, pan, spice pods, touchscreen and app) in close-up and in real kitchens. Use them to explain how Posha robot cooks.',
              keywords: ['component', 'components', 'parts', 'accessories', 'product shoot', 'product photography'],
              blocks: [{
                type: 'grid', folder: './03-product-components', columns: 4, ratio: '1.25', shape: 'cover',
                items: [
                  { src: PC + 'psh-pc-01-ingredient-containers-empty.jpg', code: 'PSH-PC-01', title: 'Ingredient Containers — Empty', tags: ['posha', 'containers', 'side view', 'in device', 'empty', 'detail'] },
                  { src: PC + 'psh-pc-02-ingredient-containers-filled.jpg', code: 'PSH-PC-02', title: 'Ingredient Containers — Filled', tags: ['posha', 'containers', 'front view', 'in device', 'filled', 'spinach', 'onion', 'cream', 'paneer'] },
                  { src: PC + 'psh-pc-03-ingredient-containers-full.jpg', code: 'PSH-PC-03', title: 'Ingredient Containers — Prepped Veg', tags: ['posha', 'containers', 'front view', 'in device', 'filled', 'paneer', 'peppers', 'spring onion'] },
                  { src: PC + 'psh-pc-04-cooking-pan.jpg', code: 'PSH-PC-04', title: 'Cooking Pan — Serving', tags: ['posha', 'pan', 'side view', 'hands', 'lifestyle', 'in use', 'cooked food'] },
                  { src: PC + 'psh-pc-05-loading-ingredient-containers.jpg', code: 'PSH-PC-05', title: 'Loading Ingredient Containers', tags: ['posha', 'containers', 'side view', 'hands', 'in use', 'paneer', 'lifestyle'] },
                  { src: PC + 'psh-pc-06-posha-on-table.jpg', code: 'PSH-PC-06', title: 'Posha on Dining Table', tags: ['posha', 'device', 'side view', 'lifestyle', 'table', 'food spread', 'flowers'] },
                  { src: PC + 'psh-pc-07-spice-pod-rack.jpg', code: 'PSH-PC-07', title: 'Spice Pod Rack', tags: ['spice', 'spices', 'pods', 'rack', 'front view', 'lifestyle', 'storage'] },
                  { src: PC + 'psh-pc-08-spice-pod-carousel-render.jpg', code: 'PSH-PC-08', title: 'Spice Pod Carousel', tags: ['spice', 'pods', 'carousel', 'top view', 'render', 'detail', 'dispenser'] },
                  { src: PC + 'psh-pc-09-spice-pods-macro.jpg', code: 'PSH-PC-09', title: 'Spice Pods — Macro', tags: ['spice', 'spices', 'pods', 'close-up', 'macro', 'chilli flakes', 'detail'] },
                  { src: PC + 'psh-pc-10-spice-pods-drawer.jpg', code: 'PSH-PC-10', title: 'Spice Pods in Drawer', tags: ['spice', 'spices', 'pods', 'drawer', 'top view', 'storage', 'kitchen'] },
                  { src: PC + 'psh-pc-11-posha-in-kitchen.jpg', code: 'PSH-PC-11', title: 'Posha in a Kitchen', tags: ['posha', 'device', 'wide view', 'lifestyle', 'kitchen', 'interior'] },
                  { src: PC + 'psh-pc-12-posha-kitchen-counter.jpg', code: 'PSH-PC-12', title: 'Posha on Kitchen Counter', tags: ['posha', 'device', 'front view', 'lifestyle', 'kitchen', 'counter', 'hero'] },
                  { src: PC + 'psh-pc-13-touchscreen-recipe.jpg', code: 'PSH-PC-13', title: 'Touchscreen — Recipe View', tags: ['posha', 'screen', 'touchscreen', 'ui', 'app', 'close-up', 'pad thai', 'front view'] },
                  { src: PC + 'psh-pc-14-mobile-app.jpg', code: 'PSH-PC-14', title: 'Posha Mobile App', tags: ['app', 'mobile', 'phone', 'ui', 'top view', 'hands', 'lifestyle', 'noodles'] },
                  VIDEOS.action, VIDEOS.how, VIDEOS.howClean, VIDEOS.cleaning, VIDEOS.spicePods,
                ],
              }],
            },
      ],
    },
    {
      id: 'photoshoots',
      title: 'Photoshoots',
      assets: '02-photoshoots',
      summary: 'Campaign and lifestyle shoots, newest first. Every photo shows its code and a short description. Search by what’s in it (wine glass, chess, unboxing). Click to view full size.',
      // Newest shoot goes first. Codes: PSH-PS<shoot>-<nn>  (PS1 = Shoot 01)
      blocks: [
        {
          type: 'shoot', number: '01', title: 'While Posha Cooks',
          brief: 'Posha robot takes care of dinner, so people get their time back. This shoot shows people simply being human: relaxing, playing, catching up, unwinding, while Posha robot cooks in the background. The product is present but never the centre of attention: the moment belongs to the people.',
          meta: ['Lifestyle', 'Home kitchens', '12 photos'],
        },
        {
          type: 'photoshoot',
          items: [
            {
              src: './01-while-posha-cooks/psh-ps1-01-father-and-daughter-drawing.jpg', code: 'PSH-PS1-01', title: 'Father & Daughter Drawing',
              desc: 'A dad and his laughing daughter paint and colour together at the kitchen counter while Posha robot cooks behind them.',
              tags: ['lifestyle', 'family', 'dad', 'father', 'daughter', 'child', 'kid', 'girl', 'drawing', 'painting', 'colouring', 'coloring', 'crayons', 'art', 'laughing', 'play', 'kitchen counter', 'warm light', 'golden hour', 'posha cooking'],
            },
            {
              src: './01-while-posha-cooks/psh-ps1-02-couple-at-posha.jpg', code: 'PSH-PS1-02', title: 'Couple at Posha',
              desc: 'A smiling couple take a first close look at Posha robot on a bright marble counter, the ingredient containers in view.',
              tags: ['lifestyle', 'couple', 'man', 'woman', 'device', 'robot', 'first look', 'exploring', 'ingredient containers', 'handle', 'marble counter', 'smiling', 'bright', 'white kitchen'],
            },
            {
              src: './01-while-posha-cooks/psh-ps1-03-friends-sharing-dinner.jpg', code: 'PSH-PS1-03', title: 'Friends Sharing Dinner',
              desc: 'Three friends pass plates of food across a long wooden dining table, with Posha robot on the counter behind them.',
              tags: ['lifestyle', 'friends', 'group', 'dinner', 'dining table', 'wooden table', 'sharing', 'passing plates', 'food', 'meal', 'social', 'laughing', 'portrait', 'posha in background'],
            },
            {
              src: './01-while-posha-cooks/psh-ps1-04-woman-with-bowl.jpg', code: 'PSH-PS1-04', title: 'Woman with Her Bowl',
              desc: 'A woman in a blue cardigan holds a bowl of food and smiles, a glass of red wine on the counter beside Posha robot.',
              tags: ['lifestyle', 'woman', 'portrait', 'eating', 'bowl', 'food', 'wine', 'wine glass', 'red wine', 'cardigan', 'kitchen', 'relaxed', 'smiling', 'warm light', 'posha screen'],
            },
            {
              src: './01-while-posha-cooks/psh-ps1-05-unwinding-on-the-counter.jpg', code: 'PSH-PS1-05', title: 'Unwinding on the Counter',
              desc: 'A woman sits barefoot on the kitchen island with a glass of red wine while Posha robot cooks dinner beside her.',
              tags: ['lifestyle', 'hero', 'woman', 'relax', 'unwind', 'me time', 'sitting on counter', 'kitchen island', 'barefoot', 'wine', 'wine glass', 'red wine', 'wine bottle', 'cardigan', 'wide', 'warm light', 'posha cooking'],
            },
            {
              src: './01-while-posha-cooks/psh-ps1-06-tasting-dinner.jpg', code: 'PSH-PS1-06', title: 'Tasting Dinner',
              desc: 'A man tastes a bowl of grain salad in a bright white kitchen, Posha robot on the counter next to fresh oranges.',
              tags: ['lifestyle', 'man', 'eating', 'tasting', 'bowl', 'grain bowl', 'salad', 'healthy', 'oranges', 'water bottle', 'coffee', 'french press', 'white kitchen', 'marble', 'bright', 'posha'],
            },
            {
              src: './01-while-posha-cooks/psh-ps1-07-video-call-while-cooking.jpg', code: 'PSH-PS1-07', title: 'Video Call While Posha Cooks',
              desc: 'A woman smiles on a video call from her phone while Posha robot cooks, a spice pod rack and chopping board beside it.',
              tags: ['lifestyle', 'woman', 'phone', 'video call', 'facetime', 'smartphone', 'selfie', 'mug', 'spice pod rack', 'spice pods', 'chopping board', 'oranges', 'limes', 'kitchen', 'warm light', 'posha cooking'],
            },
            {
              src: './01-while-posha-cooks/psh-ps1-08-couple-on-the-sofa.jpg', code: 'PSH-PS1-08', title: 'Couple on the Sofa',
              desc: 'A couple relax on the sofa. He eats noodles from a yellow plate, she holds a glass of red wine, and Posha robot is behind them.',
              tags: ['lifestyle', 'couple', 'man', 'woman', 'sofa', 'couch', 'living room', 'relax', 'eating', 'noodles', 'pasta', 'yellow plate', 'wine', 'wine glass', 'red wine', 'wine rack', 'plants', 'cosy', 'posha in background'],
            },
            {
              src: './01-while-posha-cooks/psh-ps1-09-friends-at-the-table.jpg', code: 'PSH-PS1-09', title: 'Friends at the Table',
              desc: 'Three friends eat and laugh around a wooden table, Posha robot and a spice pod rack on the counter behind.',
              tags: ['lifestyle', 'friends', 'group', 'dinner', 'dining table', 'wooden table', 'eating', 'laughing', 'food', 'meal', 'social', 'spice pod rack', 'spice pods', 'wide', 'posha in background'],
            },
            {
              src: './01-while-posha-cooks/psh-ps1-10-lunch-at-the-laptop.jpg', code: 'PSH-PS1-10', title: 'Lunch at the Laptop',
              desc: 'A woman eats lunch from a pink plate at her laptop, working from home while Posha robot sits on the counter behind her.',
              tags: ['lifestyle', 'woman', 'work from home', 'wfh', 'laptop', 'macbook', 'notebook', 'lunch', 'eating', 'salad', 'pink plate', 'plates', 'wooden table', 'plants', 'bananas', 'posha'],
            },
            {
              src: './01-while-posha-cooks/psh-ps1-11-couple-playing-chess.jpg', code: 'PSH-PS1-11', title: 'Couple Playing Chess',
              desc: 'A couple sit on poufs with wine and popcorn, playing games on the floor while Posha robot cooks in the kitchen.',
              tags: ['lifestyle', 'couple', 'man', 'woman', 'chess', 'board game', 'games', 'connect four', 'jenga', 'play', 'fun', 'wine', 'wine glass', 'popcorn', 'snacks', 'poufs', 'rug', 'blanket', 'living room', 'posha cooking'],
            },
            {
              src: './01-while-posha-cooks/psh-ps1-12-unboxing-posha.jpg', code: 'PSH-PS1-12', title: 'Unboxing Posha',
              desc: 'A couple set up their new Posha robot on the kitchen counter, following along on a phone, the cardboard box open beside them.',
              tags: ['lifestyle', 'couple', 'man', 'woman', 'unboxing', 'setup', 'set up', 'new', 'first use', 'cardboard box', 'box', 'packaging', 'phone', 'app', 'device', 'kitchen counter', 'white kitchen'],
            },
          ],
        },
      ],
    },
    {
      id: 'videos',
      title: 'Videos',
      assets: '03-videos',
      summary: 'Brand films and product videos. Hover to preview, click to watch with sound. "No copy" versions have no on-screen text.',
      blocks: [
        { type: 'heading', text: 'Food' },
        { type: 'grid', columns: 3, ratio: '16/9', items: [VIDEOS.recipe, VIDEOS.recipeClean] },
        { type: 'heading', text: 'Product' },
        { type: 'grid', columns: 3, ratio: '16/9', items: [VIDEOS.action, VIDEOS.how, VIDEOS.howClean, VIDEOS.cleaning, VIDEOS.spicePods, VIDEOS.touchscreen] },
        { type: 'heading', text: 'Features' },
        { type: 'grid', columns: 3, ratio: '16/9', items: [VIDEOS.vision, VIDEOS.visionClean] },
        { type: 'heading', text: 'Reviews' },
        { type: 'grid', columns: 3, ratio: '16/9', items: [VIDEOS.reviews] },
      ],
    },
    {
      // Files live in assets/07-gallery/04-others/<tab folder>/
      id: 'others',
      title: 'Others',
      assets: '04-others',
      summary: 'Feature infographics, the story of how Posha came to be, and moments from behind the scenes.',
      blocks: [
        {
          type: 'text',
          body: 'Imagery that tells the bigger Posha story: how its features work, where the product came from and the people who built it. Use these for decks, press, hiring and story-led content, and quote the image code when you share one.',
        },
        { type: 'gallerysearch', placeholder: 'Search: try “julia”, “2023”, “founders”, “team” or a code like PSH-OM-03' },
      ],
      parts: [
            {
              id: 'feature-infographics', title: 'Feature Infographics',
              summary: 'Ready-made explainers for Posha robot’s key features, for decks, the website and social. The “no copy” videos let you add your own on-screen text.',
              keywords: ['infographic', 'infographics', 'features', 'key features', 'explainer', 'feature'],
              blocks: [{
                type: 'grid', folder: './01-feature-infographics', columns: 3, shape: 'cover',
                items: [
                  { src: IG + 'psh-ig-01-computer-vision.png', code: 'PSH-IG-01', title: 'Computer Vision — Thinks & Cooks Like a Human', tags: ['posha', 'computer vision', 'camera', 'ai', 'stirrer', 'pan', 'top view', 'dark background', 'callouts'] },
                  { src: IG + 'psh-ig-02-customization.png', code: 'PSH-IG-02', title: 'Customization — Your Meals, Your Way', tags: ['app', 'mobile', 'phone', 'ui', 'recipe', 'pad thai', 'swap ingredient', 'plant-based', 'light background'] },
                  { src: IG + 'psh-ig-03-key-features.png', code: 'PSH-IG-03', title: 'Key Features — Main Parts of Posha', tags: ['posha', 'device', 'render', 'parts', 'spice pods', 'stirrer', 'induction', 'ingredient container', 'camera vision', 'white background'] },
                  VIDEOS.vision, VIDEOS.visionClean,
                ],
              }],
            },
            {
              id: 'old-models', title: 'Old Models',
              summary: 'From a $1,000 robotic arm to Posha robot: eight years of prototypes. Hover a model for its story; click to view or download.',
              keywords: ['old models', 'old model', 'history', 'prototypes', 'prototype', 'timeline', 'evolution', 'nymble'],
              blocks: [
                {
                  type: 'modeltimeline',
                  items: [
                    { year: '2017', model: 'Model 01', name: 'Beginning', code: 'PSH-OM-01', src: './02-old-models/psh-om-01-2017-beginning.png', tags: ['robotic arm', 'acrylic', 'first prototype'],
                      story: ['We started Nymble (now Posha) with just $1,000 saved as engineering undergrads in India. Our first prototype was a 6-DOF robotic arm built to prove a simple but ambitious idea: autonomously pick up ingredients, dispense them into a pan, and stir.', 'On a shoestring budget, we approximated its complex 3D structure using laser-cut acrylic sheets.'] },
                    { year: '2018', model: 'Model 02', name: 'Nymble ver01', code: 'PSH-OM-02', src: './02-old-models/psh-om-02-2018-nymble-ver01.png', tags: ['coffee machine', 'version 1'],
                      story: ['People loved the idea of a cooking robot, but a robotic arm in the kitchen felt intimidating: spills, burns and countertop chaos.', 'We replaced the industrial form with something familiar: a coffee machine. Add ingredients, tap a button, and let it do the rest.'] },
                    { year: '2020', model: 'Model 03', name: 'Julia', code: 'PSH-OM-03', src: './02-old-models/psh-om-03-2020-julia.png', tags: ['white', 'c-form', 'larger capacity'],
                      story: ['Users loved the coffee-machine form, but wanted larger portions and leftovers, so we scaled up the ingredient containers and the oil and water reservoirs.', 'That extra capacity reshaped the design into an elongated C-form.'] },
                    { year: '2021', model: 'Model 04', name: 'Nymble-Alpha', code: 'PSH-OM-04', src: './02-old-models/psh-om-04-2021-nymble-alpha.png', tags: ['alpha', 'home testing', '3d printed', 'cream'],
                      story: ['Codenamed Alpha, the first prototype to enter real homes for extended testing. A laser-cut metal chassis with 3D-printed enclosures.', 'Built for function over form, to prove the robot could reliably cook great food.'] },
                    { year: '2023', model: 'Model 05', name: 'Nymble-Beta', code: 'PSH-OM-05', src: './02-old-models/psh-om-05-2023-nymble-beta.png', tags: ['beta', 'sheet metal', '50 units', 'black'],
                      story: ['Codenamed Beta: 50 units deployed in homes for 18 months, at $50 a month with no upfront cost.', 'Made entirely from sheet metal, they gave us invaluable feedback on the hardware, the software and, most importantly, the food.'] },
                    { year: '2025', model: 'Model 06', name: 'Posha', code: 'PSH-OM-06', src: './02-old-models/psh-om-06-2025-posha.png', tags: ['posha', 'current', 'production', 'poshan'],
                      story: ['Named after the Sanskrit word Poshan, “to nourish”, Posha was shaped by years of real-world testing and customer feedback.', 'We moved beyond prototypes to a large-scale assembly line, building Posha with premium materials and advanced production processes.'] },
                  ],
                },
              ],
            },
            {
              id: 'behind-the-scenes', title: 'Behind the Scenes',
              summary: 'The people, prototypes and workbenches behind Posha. Use them for culture, hiring and founder-story content.',
              keywords: ['gallery', 'behind the scenes', 'bts', 'culture', 'old photos', 'company photos'],
              blocks: [{
                type: 'photoshoot',
                items: [
                  { src: './03-behind-the-scenes/psh-bts-01-holi-in-the-office.jpg', code: 'PSH-BTS-01', title: 'Holi in the Office', tags: ['team', 'people', 'celebration', 'holi', 'culture'] },
                  { src: './03-behind-the-scenes/psh-bts-02-induction-coil.jpg', code: 'PSH-BTS-02', title: 'Induction Coil', tags: ['hardware', 'engineering', 'close-up', 'electronics', 'induction'] },
                  { src: './03-behind-the-scenes/psh-bts-03-the-hardware-team.jpg', code: 'PSH-BTS-03', title: 'The Hardware Team', tags: ['team', 'people', 'engineers', 'lab', 'nymble t-shirts'] },
                  { src: './03-behind-the-scenes/psh-bts-04-the-founders.jpg', code: 'PSH-BTS-04', title: 'The Founders', tags: ['founders', 'people', 'portrait', 'wooden spoons'], rows: 2 },
                  { src: './03-behind-the-scenes/psh-bts-05-community-event.jpg', code: 'PSH-BTS-05', title: 'Nymble Community Event', tags: ['event', 'prototypes', 'alpha', 'beta', 'julia', 'your food on autopilot'], cols: 2, rows: 2 },
                  { src: './03-behind-the-scenes/psh-bts-06-the-whole-team.jpg', code: 'PSH-BTS-06', title: 'The Whole Team', tags: ['team', 'people', 'group photo', 'office'] },
                  { src: './03-behind-the-scenes/psh-bts-07-electronics-bench.jpg', code: 'PSH-BTS-07', title: 'Electronics Bench', tags: ['hardware', 'engineering', 'testing', 'electronics', 'lab'] },
                  { src: './03-behind-the-scenes/psh-bts-08-wiring-harnesses.jpg', code: 'PSH-BTS-08', title: 'Wiring Harnesses', tags: ['hardware', 'engineering', 'wires', 'parts', 'procurement'] },
                  { src: './03-behind-the-scenes/psh-bts-09-steel-prototype.jpg', code: 'PSH-BTS-09', title: 'Steel Prototype', tags: ['prototype', 'stainless steel', 'hardware', 'early design'] },
                  { src: './03-behind-the-scenes/psh-bts-10-first-curry-test.jpg', code: 'PSH-BTS-10', title: 'Curry Test', tags: ['prototype', 'cooking test', 'food', 'curry', 'screen'] },
                  { src: './03-behind-the-scenes/psh-bts-11-black-prototype.jpg', code: 'PSH-BTS-11', title: 'Black Prototype in the Kitchen', tags: ['prototype', 'kitchen', 'testing', 'screen'] },
                  { src: './03-behind-the-scenes/psh-bts-12-building-the-electronics.jpg', code: 'PSH-BTS-12', title: 'Building the Electronics', tags: ['hardware', 'engineering', 'assembly', 'electronics', 'people'] },
                  { src: './03-behind-the-scenes/psh-bts-13-desk-life.jpg', code: 'PSH-BTS-13', title: 'Desk Life', tags: ['people', 'office', 'laptop', 'software', 'team'] },
                  { src: './03-behind-the-scenes/psh-bts-14-power-board.jpg', code: 'PSH-BTS-14', title: 'Power Board', tags: ['hardware', 'pcb', 'electronics', 'close-up', 'induction'], rows: 2 },
                ],
              }],
            },
      ],
    },
  ],
});
}
