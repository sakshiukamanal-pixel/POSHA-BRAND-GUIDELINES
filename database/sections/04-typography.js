POSHA.section({
  id: 'typography',
  title: 'Typography',
  summary: 'Typefaces, a live type tester, the type scale and how to use them. This is our brand typography — for the website, marketing, packaging and other branded material. For the app and the device screen, use the [Culinary UI type scale](#/ui-system/typography).',

  pages: [
    {
      id: 'typefaces',
      title: 'Typefaces',
      blocks: [
        {
          type: 'type',
          items: [
            { role: 'H1 · H2 · Accents', name: 'Epika Serif Extra Condensed', weights: 'Light · Light Italic', family: "'Epika Condensed', serif", sample: 'Good food, shared.', size: 'min(6rem, 15.6vw)' },
            { role: 'Headings · Body', name: 'Roobert', weights: 'Regular', family: "'Roobert', sans-serif", sample: 'Aa Bb Cc 0123', size: 'min(4.5rem, 11.7vw)' },
            { role: 'Emphasis', name: 'Roobert', weights: 'Bold', family: "'Roobert', sans-serif", weight: 700, sample: 'Aa Bb Cc 0123', size: 'min(4.5rem, 11.7vw)' },
            { role: 'Labels · Data · All caps', name: 'Roobert Mono', weights: 'Medium', family: "'Roobert Mono', monospace", sample: 'PSH-01 · 0123', size: 'min(2.88rem, 7.5vw)' },
          ],
        },
      ],
    },
    {
      id: 'type-tester',
      title: 'Type Tester',
      blocks: [
        {
          type: 'typetester',
          size: 96, // the headline size; each font below shows at size × its `scale`, so the rows read by role
          sample: 'Dinner, done.',
          placeholder: 'Type here to preview Epika, Roobert and Roobert Mono…',
          samples: ['Dinner, done.', 'Good food, shared moments.', 'Aa Bb Cc Dd Ee Ff Gg', '0123456789 · ₹ $ % &'],
          fonts: [
            {
              name: 'Epika Serif Extra Condensed', role: 'H1 · H2 · Accents', family: "'Epika Condensed', serif", lineHeight: 1.02, scale: 1,
              styles: [{ label: 'Light', weight: 400 }, { label: 'Light Italic', weight: 400, style: 'italic' }],
            },
            {
              name: 'Roobert', role: 'Headings · Body', family: "'Roobert', sans-serif", lineHeight: 1.15, scale: 0.5,
              styles: [
                { label: 'Regular', weight: 400 }, { label: 'Regular Italic', weight: 400, style: 'italic' },
                { label: 'Bold', weight: 700 }, { label: 'Bold Italic', weight: 700, style: 'italic' },
              ],
            },
            {
              name: 'Roobert Mono', role: 'Labels · Data', family: "'Roobert Mono', monospace", upper: true, tracking: '0.06em', lineHeight: 1.2, scale: 0.25,
              styles: [{ label: 'Medium', weight: 500 }],
            },
          ],
        },
      ],
    },
    { id: 'hierarchy', title: 'Hierarchy & Pairing', blocks: [] },
    {
      id: 'type-scale',
      title: 'Type Scale',
      blocks: [
        {
          // size in rem (1rem = 16px) / line-height. The same values are CSS tokens (--fs-*, --lh-*) in code/css/styles.css.
          type: 'typescale', sample: 'Dinner, done.',
          items: [
            { group: 'Headings' },
            { role: 'H1', font: 'Epika', rem: 6, lh: 1.0 },
            { role: 'H2', font: 'Epika', rem: 4.5, lh: 1.1 },
            { role: 'H3', font: 'Roobert', rem: 2.88, lh: 1.1 },
            { role: 'H3 Epika Italics', font: 'Epika', italic: true, rem: 2.88, lh: 1.1 },
            { role: 'H4', font: 'Roobert', rem: 2.13, lh: 1.3 },
            { role: 'H4 Epika', font: 'Epika', rem: 2.13, lh: 1.3 },
            { role: 'H4 Epika Italics', font: 'Epika', italic: true, rem: 2.13, lh: 1.3 },
            { role: 'H5', font: 'Roobert', rem: 1.75, lh: 1.3 },
            { role: 'H5 Epika', font: 'Epika', rem: 1.75, lh: 1.3 },
            { group: 'Body' },
            { role: 'Lead', font: 'Roobert', rem: 1.38, lh: 1.3, sample: 'Good food, shared moments.' },
            { role: 'Base', font: 'Roobert', rem: 1.1, lh: 1.4, sample: 'Posha cooks dinner while you get on with your evening.' },
            { role: 'Small', font: 'Roobert', rem: 0.88, lh: 1.4, sample: 'Soak the rice noodles before cooking. Weigh them while they’re still dry.' },
            { group: 'Mono / Caption' },
            { role: 'Mono', font: 'Roobert Mono', rem: 0.88, lh: 1.4, sample: 'Per serving nutrients' },
            { role: 'Caption', font: 'Roobert Mono', rem: 0.75, lh: 1.3, sample: 'Choose serving size' },
            { role: 'Mono Caption', font: 'Roobert Mono', rem: 0.75, lh: 1.3, sample: '54 mins · 12 mins' },
            { role: 'Mono Micro', font: 'Roobert Mono', rem: 0.65, lh: 1.4, sample: 'Optional' },
          ],
        },
      ],
    },
    {
      id: 'usage-rules',
      title: 'Usage Rules',
      blocks: [
        {
          type: 'rules',
          do: [
            'Use Epika for H1 and H2; at H3–H5 use it as an accent (Epika or Epika Italic)',
            'Set body copy in Roobert: Lead 1.38rem, Base 1.1rem, Small 0.88rem',
            'Set Roobert Mono in ALL CAPS only, for labels, numbers, specs and data',
            'Stick to the scale; keep display lines short (2 to 6 words)',
          ],
          dont: [
            'Don’t set paragraphs in Epika',
            'Don’t use more than two weights in one layout',
            'Don’t letterspace body copy',
            'Don’t set Roobert Mono in lowercase or sentence case',
          ],
        },
      ],
    },
  ],
});
