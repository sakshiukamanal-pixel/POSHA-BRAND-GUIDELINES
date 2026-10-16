/* The Gallery uses layout: 'pages' — one page per shoot or event:
   Faro Films · 4Burner Shoot · China Assembly Footage · Demo Events.

   Each page: an overview (text, `facts`, notes), then `parts` (sidebar sub-items) and,
   where needed, `sections` inside a part (a fourth sidebar level). Every folder is a
   `collection` block: tags, a button to its Google Drive / Photos / gallery link, and
   preview frames from assets/07-gallery/<NN-page>/<folder>/frame-NN.jpg (on Cloudflare R2).
   Use account-neutral Drive links (…/drive/folders/<id>, no /u/N/). */

POSHA.section({
  id: 'gallery',
  title: 'Gallery',
  layout: 'pages',
  heroStyle: 'stacked',
  summary: 'Our shoot and event libraries — what each one holds, how to use it, and where to find it.',

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
  ],
});
