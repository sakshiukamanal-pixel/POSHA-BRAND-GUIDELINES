/* The Gallery uses layout: 'pages' — one page per shoot or event:
   Faro Films · 4Burner Shoot · China Assembly Footage · Demo Events · Essentials (core food, product and render library) · Primary Lifestyle (described photos, first in the list).

   Each page: an overview (text, `facts`, notes), then `parts` (sidebar sub-items) and,
   where needed, `sections` inside a part (a fourth sidebar level). Every folder is a
   `collection` block: tags, a button to its Google Drive / Photos / gallery link, and
   preview frames from assets/07-gallery/<NN-page>/<folder>/frame-NN.jpg (on Cloudflare R2).
   Use account-neutral Drive links (…/drive/folders/<id>, no /u/N/). */

// Shortcuts for the Essentials page (product renders, food shots, videos)
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
  summary: 'Our shoot and event libraries — what each one holds, how to use it, and where to find it.',

  pages: [
    // Brought back from the old Photoshoots page: each photo with a searchable description
    {
      id: 'lifestyle',
      title: 'Primary Lifestyle',
      assets: '02-photoshoots', // media stays in its original folder
      summary: 'Lifestyle shoots, newest first. Every photo shows its code and a short description. Search by what’s in it (wine glass, chess, unboxing). Click to view full size.',
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
      // Previews in assets/07-gallery/06-4burner-shoot/<folder>/. Drive links use the account-neutral
      // /drive/folders/<id> form so they open for anyone with access, whichever Google account they're on.
      id: '4burner-shoot',
      title: '4Burner Shoot',
      assets: '06-4burner-shoot',
      summary: 'Food + product. Top-down cooking footage of 10 recipes, product set-up, and the photoshoot from the same days.',
      blocks: [
        {
          type: 'text',
          body: [
            'The 4Burner shoot is our food and product library. The cameras sit directly above the pan to film 10 recipes from raw ingredients to finished dish, with close-ups of the moments that make food look good — onions softening, sauces thickening, the stirrer working through the pan. It also covers setting Posha up and cooking with it: navigating the screen, attaching the fan, filling the oil and water containers.',
            'The website homepage footage comes from this shoot, and the stills from the same days are in the Photoshoot folders below.',
          ],
        },
        {
          type: 'facts',
          items: [
            { k: 'Content', v: 'Food + product' },
            { k: 'Recipes', v: '10 · filmed top-down' },
            { k: 'Device', v: 'Pre-rebrand · “Nimble”' },
            { k: 'Used on', v: 'Website homepage' },
          ],
        },
        {
          type: 'note', tone: 'warn', title: 'Videos still show the old Nimble logo',
          body: 'The device was called Nimble when this was shot. The logo has been retouched out of every photo, but it is still visible in the video wherever the front of the device is in frame. Use the top-down pan and ingredient shots freely; for any shot that shows the device, crop, reframe or cover the logo so “Nimble” never appears. If that isn’t possible, don’t use the shot.',
        },
      ],
      parts: [
        {
          id: 'videos', title: 'Videos',
          summary: 'Top-down cooking footage of all 10 recipes, ingredient close-ups, and product set-up clips.',
          keywords: ['videos', 'footage', 'top-down', 'cooking', 'recipes', 'b-roll', 'homepage'],
          blocks: [
            {
              type: 'collection', alt: '4Burner top-down cooking frame',
              tags: ['Video', 'MP4', 'Top-down', { label: 'Nimble logo in some shots', tone: 'warn' }],
              link: { href: 'https://drive.google.com/drive/folders/1ubWP4KXEUkj9-A37i8f-g-9GUYhnYJLR', label: 'Open in Google Drive' },
              items: [1, 2, 3, 4, 5].map((n) => `./videos/frame-0${n}.jpg`),
              footnote: 'Each clip comes with a matching **.XML** file — camera metadata, not footage. Use the **.MP4** files only.',
            },
            {
              type: 'rules',
              do: [
                'Use the top-down pan shots for recipe content, social and ads — they never show the logo',
                'Use the short ingredient close-ups (onions reducing, sauce thickening) as cutaways and texture B-roll',
                'Use the set-up clips for how-to, onboarding and support content, once the logo is handled',
                'Check the homepage cut first — it may already be cropped to what you need',
              ],
              dont: [
                'Don’t use any shot where the Nimble logo is readable',
                'Don’t present Nimble-era screens as the current Posha interface without checking them',
                'Don’t import the .XML sidecar files into edits',
              ],
            },
            {
              type: 'note', title: 'Website homepage cut',
              body: 'The homepage footage was cut from this shoot. Kawal has a cropped version ready to reuse — link to be added here.',
            },
          ],
        },
        {
          id: 'photoshoot', title: 'Photoshoot',
          summary: 'Stills from the same shoot. The Nimble logo has been retouched out of every photo, so these are safe to use as they are.',
          keywords: ['photos', 'photoshoot', 'stills'],
          sections: [
            {
              id: 'recipes-on-posha', title: 'Recipes on Posha',
              summary: 'Finished Posha dishes on a clean backdrop — plated from above, plus close-up crops. Use for menus, recipe cards and the app.',
              blocks: [{
                type: 'collection', alt: 'Recipe cooked on Posha',
                tags: ['Photos', 'Top-down', 'Plated + close-ups'],
                link: { href: 'https://drive.google.com/drive/folders/1QDIpuw-mrHTAgpxAUuF03DLk-6O1sEMY', label: 'Open in Google Drive' },
                items: [1, 2, 3, 4, 5, 6].map((n) => `./recipes-on-posha/frame-0${n}.jpg`),
              }],
            },
            {
              id: 'product-renders', title: 'Product Renders',
              summary: 'Posha the product: device and screen details, ingredient containers, spice pods, the app, and the device in a kitchen.',
              blocks: [{
                type: 'collection', alt: 'Posha product image',
                tags: ['Photos', 'Renders', 'Product'],
                link: { href: 'https://drive.google.com/drive/folders/1UTgzv0Q6Sbn6O9SkL2aLdRXfGJhkL5Qw', label: 'Open in Google Drive' },
                items: [1, 2, 3, 4, 5, 6].map((n) => `./product-renders/frame-0${n}.jpg`),
              }],
            },
            {
              id: 'lifestyle', title: 'Lifestyle',
              summary: 'Posha dishes being eaten — hands, tables and real moments. Use when the food should feel shared and lived-in.',
              blocks: [{
                type: 'collection', alt: '4Burner lifestyle photo',
                tags: ['Photos', 'Lifestyle', 'Food + people'],
                link: { href: 'https://drive.google.com/drive/folders/1GxwHxkChXe3aagn3_kDqXOB1I4ErRZ1O', label: 'Open in Google Drive' },
                items: [1, 2, 3, 4].map((n) => `./lifestyle/frame-0${n}.jpg`),
              }],
            },
          ],
        },
      ],
    },
    {
      // Previews in assets/07-gallery/07-china-assembly/<folder>/
      id: 'china-assembly',
      title: 'China Assembly Footage',
      navTitle: 'China Assembly',
      assets: '07-china-assembly',
      summary: 'Two weeks on the factory floor, assembling the first 50 Posha units.',
      blocks: [
        {
          type: 'text',
          body: [
            'Footage from the two weeks we spent assembling the first 50 Posha units in China: general assembly footage, people working on the manufacturing floor, and phone time-lapses of the line. It shows that Posha is a real product, built carefully by real people — use it for brand films, investor and press decks, and behind-the-scenes content.',
            'The short 2–3 second clips make the best cutaways.',
          ],
        },
        {
          type: 'facts',
          items: [
            { k: 'Content', v: 'Assembly + factory floor' },
            { k: 'Shot over', v: '2 weeks · first 50 units' },
            { k: 'Device', v: '~90% current' },
            { k: 'State', v: 'Needs sorting' },
          ],
        },
        {
          type: 'note', tone: 'warn', title: 'Avoid the old screen and the old logo',
          body: 'The product here is about 90% current, but the screen is the older power-button shape rather than today’s horizontal oval O, and some shots show older branding. Skip any shot where the old screen or the old logo can be seen.',
        },
        {
          type: 'rules',
          do: [
            'Work from the folders below',
            'Cut the short 2–3 second clips in as cutaways',
            'Use wide shots of the line to show real, careful manufacturing at scale',
            'Use hands-at-work close-ups (wiring, panels, packing) for detail and pace',
          ],
          dont: [
            'Don’t use the loose files at the top level of the Drive folder',
            'Don’t use shots showing the old screen or the old logo',
            'Don’t use the separate China lifestyle footage (colleagues, etc.)',
            'Don’t import the .XML sidecar files — they’re camera metadata',
          ],
        },
        {
          type: 'note', title: 'Not well organised yet',
          body: 'This library still needs sorting, so expect to dig a little. If you sort a folder, tell the brand team so the links here can be updated.',
        },
      ],
      parts: [
        {
          id: 'travel-assembly', title: 'Travel & Assembly',
          summary: 'General assembly footage from the two weeks on site — machines, components and the line at work.',
          keywords: ['travel', 'assembly', 'factory', 'line', 'machines', 'components', 'units'],
          sections: [
            {
              id: 'folder-1', title: 'Folder 1', navTitle: '1',
              summary: 'Machines and materials up close — the production line, cable reels, electronics and parts in motion.',
              blocks: [{
                type: 'collection', alt: 'China assembly footage', columns: 4,
                tags: ['Video', 'MP4', 'Machines + components'],
                link: { href: 'https://drive.google.com/drive/folders/1Gn8qevBW7BDHcri1N12CbGwOCuhkYg4A', label: 'Open in Google Drive' },
                items: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `./travel-1/frame-0${n}.jpg`),
                footnote: 'Use the **.MP4** files — the matching **.XML** files are camera metadata.',
              }],
            },
            {
              id: 'folder-2', title: 'Folder 2', navTitle: '2',
              summary: 'The assembly line in action — workers on the floor, finished units in rows, spice pods and screens.',
              blocks: [{
                type: 'collection', alt: 'China assembly footage', columns: 4,
                tags: ['Video', 'MP4', 'People + finished units'],
                link: { href: 'https://drive.google.com/drive/folders/1qXzjcnIFmlTzDcLQTxNHlZUBei2vM267', label: 'Open in Google Drive' },
                items: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `./travel-2/frame-0${n}.jpg`),
                footnote: 'Use the **.MP4** files — the matching **.XML** files are camera metadata. Check screens for the old power-button shape before using a shot.',
              }],
            },
          ],
        },
        {
          id: 'factory-shots', title: 'Factory Shots',
          summary: 'Hand-held footage on the factory floor, with a thumbnail for every clip.',
          keywords: ['factory', 'floor', 'clips', 'thumbnails', 'hands'],
          sections: [
            {
              id: 'clips', title: 'Clips',
              summary: 'Hands at work — screens, wiring, panels and packing. Ideal as quick 2–3 second cutaways.',
              blocks: [{
                type: 'collection', alt: 'Factory clip frame',
                tags: ['Video', 'MP4', 'Close-ups'],
                link: { href: 'https://drive.google.com/drive/folders/1B0Q0aelYPRIzg71JWA8--GC4c3EMveIq', label: 'Open in Google Drive' },
                items: [1, 2, 3, 4, 5].map((n) => `./factory-clips/frame-0${n}.jpg`),
              }],
            },
            {
              id: 'thumbnails', title: 'Thumbnails',
              summary: 'A still from each clip — browse here to find the shot you need, then pull the matching clip.',
              blocks: [{
                type: 'collection', alt: 'Factory clip thumbnail',
                tags: ['Stills', 'JPG', 'Clip index'],
                link: { href: 'https://drive.google.com/drive/folders/1xcM8OndKCQigYYKtVa7KHIe3dGvb7DlI', label: 'Open in Google Drive' },
                items: [1, 2, 3, 4, 5, 6].map((n) => `./factory-thumbnails/frame-0${n}.jpg`),
                footnote: 'Some thumbnails show the device screen — check it’s not the older power-button shape before using the clip.',
              }],
            },
          ],
        },
        {
          id: 'timelapse', title: 'Timelapse',
          summary: 'Phone footage and time-lapses of the assembly floor — wide views of the line, plus close-ups of the induction base and wiring.',
          keywords: ['timelapse', 'time-lapse', 'phone', 'floor', 'wide'],
          blocks: [{
            type: 'collection', alt: 'Assembly floor timelapse frame',
            tags: ['Phone', 'MOV + JPG', 'Time-lapse'],
            link: { href: 'https://drive.google.com/drive/folders/1a2XvEOvtd8xtiF_lOxqAVetTne8GrVxp', label: 'Open in Google Drive' },
            items: [1, 2, 3, 4, 5, 6].map((n) => `./timelapse/frame-0${n}.jpg`),
          }],
        },
      ],
    },
    {
      // Previews in assets/07-gallery/08-demo-events/<city>-<folder>/
      id: 'demo-events',
      title: 'Demo Events',
      assets: '08-demo-events',
      summary: 'Professionally filmed live demos — real guests meeting Posha for the first time.',
      blocks: [
        {
          type: 'text',
          body: [
            'Five professionally filmed demo events: Seattle (two events), LA, Dallas and Houston. Guests gather round, watch Posha cook, try the screen and taste the food — and many tell us what they thought on camera.',
            'Each event has photos, B-roll of the demo in progress, and interview clips the videographer has already cut and labelled by the question asked. It is one of our best-organised libraries, and the first place to look for real reactions and testimonials.',
          ],
        },
        {
          type: 'facts',
          items: [
            { k: 'Events', v: '5 demos · 4 cities' },
            { k: 'Filmed by', v: 'Professional videographer' },
            { k: 'Includes', v: 'Photos · B-roll · interviews' },
            { k: 'Testimonials', v: 'Clipped + labelled by question' },
          ],
        },
        {
          type: 'note', title: 'Open with your Posha account',
          body: 'Some of this material is shared from a Posha workspace, and it can’t be opened while you’re signed in with a personal Google or Notion account. If a link asks for access, switch to your Posha account first.',
        },
      ],
      parts: [
        {
          id: 'seattle', title: 'Seattle',
          summary: 'Two demo events in Seattle — photos, B-roll, guest interviews and demo photography.',
          keywords: ['seattle', 'demo', 'event', 'guests'],
          sections: [
            {
              id: 'photos', title: 'Photos',
              summary: 'Professional photos of guests meeting Posha — watching it cook, trying the screen, and the families and kids who came along.',
              blocks: [{
                type: 'collection', alt: 'Seattle demo photo',
                tags: ['Photos', 'Google Photos album', { label: 'Professional', tone: 'key' }],
                link: { href: 'https://photos.google.com/share/AF1QipMMvLlYuu5zeWcY4-cMMdJw2e8mkvkqduwWPsVL_xet9t1crwOqSDsVXXwXSzTZcg?key=eFZ5Sm9UQ0pNMzJzZklBRlVEZ2x5NmI3eTlFcGRn', label: 'Open in Google Photos' },
                items: [1, 2, 3, 4, 5, 6].map((n) => `./seattle-photos/frame-0${n}.jpg`),
              }],
            },
            {
              id: 'b-roll', title: 'B-roll',
              summary: 'The demo in progress in a home kitchen — guests gathered round, Posha cooking, the host explaining.',
              blocks: [{
                type: 'collection', alt: 'Seattle demo B-roll frame',
                tags: ['Video', 'MP4', 'B-roll'],
                link: { href: 'https://drive.google.com/drive/folders/1uv2rdo0Vmk3NdbnkVsqck7-M23R0x919', label: 'Open in Google Drive' },
                items: [1, 2, 3, 4, 5, 6].map((n) => `./seattle-b-roll/frame-0${n}.jpg`),
              }],
            },
            {
              id: 'interviews', title: 'Interviews',
              summary: 'Guest testimonials, already clipped by the videographer. Each clip opens on a title card with the question asked, so you can find answers by question.',
              blocks: [{
                type: 'collection', alt: 'Interview title card',
                tags: ['Video', 'MP4', 'Testimonials', { label: 'Labelled by question', tone: 'key' }],
                link: { href: 'https://drive.google.com/drive/folders/1JC0aMnCI8v9yQxERI5sLsEHY6PApSYH5', label: 'Open in Google Drive' },
                items: [1, 2].map((n) => `./seattle-interviews/frame-0${n}.jpg`),
                footnote: 'Questions include **“Would you have guessed that this was made by a robot?”** and **“What’s your name and what brought you here?”**',
              }],
            },
            {
              id: 'demo-shots', title: 'Demo Shots',
              summary: 'Photos taken during the demo — guests’ reactions, the host at work, and Posha on the counter.',
              blocks: [{
                type: 'collection', alt: 'Seattle demo shot',
                tags: ['Photos', 'JPG', 'Reactions'],
                link: { href: 'https://drive.google.com/drive/folders/16WVCDrhs3YC7BeVeiOHv5GH9CJ9wKPTE', label: 'Open in Google Drive' },
                items: [1, 2, 3, 4, 5, 6].map((n) => `./seattle-demo-shots/frame-0${n}.jpg`),
              }],
            },
          ],
        },
        {
          id: 'la', title: 'LA',
          summary: 'An outdoor demo in a garden — guests tasting, Posha set up outside, and short video reactions.',
          keywords: ['la', 'demo', 'event', 'outdoor', 'garden', 'guests'],
          sections: [
            {
              id: 'photos', title: 'Photos',
              summary: 'Guests loading and tasting from Posha outdoors, plus product details — the pan, the spice pod rack and the POSHA flyer. The album also holds short phone clips.',
              blocks: [{
                type: 'collection', alt: 'LA demo photo',
                tags: ['Photos', 'Short clips', 'Google Photos album'],
                link: { href: 'https://photos.google.com/share/AF1QipNgCjqsBfeu26pzHHGh9JqxBUmxDyUQsUFsj9MQfqN6qQvwayr6bI_CCT3pqw7hwg?key=RTdzYXE5eXQ2aGRSMUpMY1hJVFUzb1RybGJES3dR', label: 'Open in Google Photos' },
                items: [1, 2, 3, 4, 5, 6].map((n) => `./la-photos/frame-0${n}.jpg`),
              }],
            },
            {
              id: 'videos', title: 'Videos',
              summary: 'Guests filmed face-to-camera after tasting — quick, natural reactions to use as testimonials.',
              blocks: [{
                type: 'collection', alt: 'LA guest video frame',
                tags: ['Video', 'MOV', 'Reactions'],
                link: { href: 'https://drive.google.com/drive/folders/1UwH20YZl9BA6yWAcSI4Cn6vPZJINX4_v', label: 'Open in Google Drive' },
                items: [1, 2, 3, 4].map((n) => `./la-videos/frame-0${n}.jpg`),
              }],
            },
          ],
        },
        {
          id: 'dallas', title: 'Dallas',
          summary: 'A home demo on a covered patio — the host walking guests through Posha, loading spice pods, and guests filming on their phones.',
          keywords: ['dallas', 'demo', 'event', 'patio', 'guests'],
          sections: [
            {
              id: 'photos-videos', title: 'Photos & Videos',
              summary: 'Phone clips from the day: guests arriving, the host demonstrating at the counter, close-ups of the pan, and the house and pool around it.',
              blocks: [{
                type: 'collection', alt: 'Dallas demo frame',
                tags: ['Video', 'MOV', 'Phone'],
                link: { href: 'https://drive.google.com/drive/folders/1YgOrdke-vf_WBM8qnriQ6cSGnIp_e4_e', label: 'Open in Google Drive' },
                items: [],
                footnote: 'Preview frames coming soon — open the folder to browse the clips.',
              }],
            },
          ],
        },
        {
          id: 'houston', title: 'Houston',
          summary: 'A home demo in Houston, Texas, on 21 June 2025 — guests trying Posha in the kitchen, with the team in Posha aprons and tees.',
          keywords: ['houston', 'texas', 'demo', 'event', 'guests', 'testimonials'],
          sections: [
            {
              id: 'photos', title: 'Photos',
              summary: 'The photographer’s gallery: guests tapping the screen and watching Posha cook, and the team in “Sous-Chef” aprons and “Relief Cook” tees.',
              blocks: [{
                type: 'collection', alt: 'Houston demo photo',
                tags: ['Photos', 'Photographer’s gallery', { label: 'Professional', tone: 'key' }],
                link: { href: 'https://eduardoverastegui.pixieset.com/poshademoinhouston/', label: 'Open the gallery' },
                items: [1, 2, 3, 4, 5, 6].map((n) => `./houston-photos/frame-0${n}.jpg`),
                footnote: 'Hosted on the photographer’s Pixieset site — download originals from there.',
              }],
            },
            {
              id: 'videos', title: 'Videos',
              summary: 'Two edited files from the videographer. **B Roll** covers the setting and scenery, the product demo and guests engaging. **Testimonials** covers four key questions.',
              blocks: [{
                type: 'collection', alt: 'Houston video title card',
                tags: ['Video', 'MP4', 'B-roll', { label: 'Testimonials · 4 questions', tone: 'key' }],
                link: { href: 'https://drive.google.com/drive/folders/1WevFPFvT52mftK1_ikfIW1XB_542yPN1', label: 'Open in Google Drive' },
                items: [1, 2].map((n) => `./houston-videos/frame-0${n}.jpg`),
              }],
            },
          ],
        },
      ],
    },
    // Brought back from before the Oct 2026 Gallery clean-up: the core library of food, product and render imagery
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

  ],
});
} // end of block scope
