/* Click any swatch on the site to copy its HEX.
   `weight` sets how wide a swatch is in a weighted row (it reflects usage).
   `name` is the colour name; an optional `alias` is shown small under it. `pantone` shows as PMS.
   The tint bar at the top recolours every swatch to 80 / 60 / 40 / 20 % (tints = opacity over white). */
POSHA.section({
  id: 'color',
  title: 'Color',
  summary: 'Our palette, its hierarchy, and the ratios that keep Posha unmistakable.',
  // one tint control for the whole page — pick a step and every swatch (primary + secondary) follows
  blocks: [{ type: 'tintbar', steps: [100, 80, 60, 40, 20] }],

  pages: [
    {
      id: 'primary-palette',
      title: 'Primary Palette',
      blocks: [
        {
          type: 'palette', layout: 'grid', columns: 3, ratio: '1.6/1',
          items: [
            { name: 'White', hex: '#FFFFFF', rgb: '255/255/255', cmyk: '0/0/0/0' },
            { name: 'Off-White', hex: '#FFFCF8', rgb: '255/252/248', cmyk: '0/1/2/0', pantone: '9100 C · 9100 U' },
            { name: 'Cream', hex: '#F1ECE4', rgb: '241/236/228', cmyk: '5/5/9/0', pantone: '9080 C · 9080 U' },
            { name: 'Dark Gray', hex: '#484848', rgb: '72/72/72', cmyk: '66/59/58/40', pantone: '4294 C · 2479 U' },
            { name: 'Black', hex: '#232222', rgb: '35/34/34', cmyk: '71/66/64/72', pantone: 'Black 7 C · Black 4 U' },
            { name: 'Posha Yellow', hex: '#FFBD00', rgb: '255/189/0', cmyk: '0/24/100/0' },
          ],
        },
      ],
    },
    {
      id: 'secondary-palette',
      title: 'Secondary Palette',
      blocks: [
        {
          type: 'palette', layout: 'grid', columns: 5, ratio: '1.1/1',
          items: [
            { name: 'Pumpkin Orange', hex: '#FF7600', rgb: '255/118/0', cmyk: '0/71/100/0' },
            { name: 'Grapefruit Pink', hex: '#FFB1B4', rgb: '255/177/180', cmyk: '0/41/15/0' },
            { name: 'Cornflower Blue', hex: '#9CB5FF', rgb: '156/181/255', cmyk: '37/23/0/0' },
            { name: 'Chili Red', hex: '#FF2E20', rgb: '255/46/32', cmyk: '0/100/100/0' },
            { name: 'Mint Green', hex: '#96FF94', rgb: '150/255/148', cmyk: '40/0/57/0' },

            { name: 'Olive Green', hex: '#2F3600', rgb: '47/54/0', cmyk: '67/52/100/61' },
            { name: 'Cranberry Red', hex: '#8C003A', rgb: '140/0/58', cmyk: '25/100/65/19' },
            { name: 'Cocoa Brown', hex: '#552720', rgb: '85/39/32', cmyk: '37/83/80/56' },
            { name: 'Blueberry Navy', hex: '#232D4C', rgb: '35/45/76', cmyk: '93/83/41/38' },
            { name: 'Black Cherry Maroon', hex: '#2C0016', rgb: '44/0/22', cmyk: '60/89/60/75' },

            // Added Oct 2026 from Rough Files/ExtraColors.pdf (RGB only — CMYK / PMS still to come)
            { name: 'Dragon Fruit Pink', hex: '#FA93D0', rgb: '250/147/208' },
            { name: 'Juniper Blue', hex: '#ABC3CF', rgb: '171/195/207' },
            { name: 'Avocado Green', hex: '#8CB446', rgb: '140/180/70' },
            { name: 'Kale Green', hex: '#005243', rgb: '0/82/67' },
            { name: 'Mustard Gold', hex: '#9B7B0A', rgb: '155/123/10' },
            { name: 'Plum Purple', hex: '#98437E', rgb: '152/67/126' },

            { name: 'Sea Salt Gray', hex: '#F1F2ED', rgb: '241/242/237', cmyk: '4/2/5/0' },
            // Oat Milk (#F1E9DE) was replaced by Cream (#F1ECE4) in the Primary Palette
          ],
        },
      ],
    },
    {
      id: 'gradients',
      title: 'Gradients',
      blocks: [
        // Cards: click to copy the CSS. Names are working titles — rename freely.
        // To use the exact artwork instead, add src: './gradient-01.png' (file in assets/03-color/03-gradients/).
        {
          type: 'gradients', columns: 6,
          items: [
            { name: 'Ember', stops: ['#B62740', '#C74A3D', '#DB7F37', '#EDA645', '#F3BE62'] },
            { name: 'Garden Mist', stops: ['#C49ED0', '#DAA1BD', '#C5B6A5', '#A7CF98', '#8FE191'] },
            { name: 'Fresh Herb', stops: ['#C9D13A', '#A4C33B', '#7BAB3A', '#4B8834', '#2F6326'] },
            { name: 'Spice Dusk', stops: ['#F94F20', '#F9771C', '#EB9B41', '#CCAC83', '#AEACD0'] },
            { name: 'Apricot Glow', stops: ['#F59C45', '#F4A36C', '#F4A67E', '#F59D6A', '#F48E47'] },
            { name: 'Rose Haze', stops: ['#DADFE7', '#C5C1D7', '#C4ADC8', '#DEA8B7', '#ECAAB0'] },
            // Built with the recipe below: three palette anchors (stops 1, 3, 5), stops 2 and 4 blended in OKLab.
            { name: 'Berry Smoothie', stops: ['#98437E', '#C86AA6', '#FA93D0', '#FDA2C3', '#FFB1B4'] }, // Plum Purple → Dragon Fruit Pink → Grapefruit Pink
            { name: 'Garden Bowl', stops: ['#005243', '#4E824A', '#8CB446', '#C8BA34', '#FFBD00'] }, // Kale Green → Avocado Green → Posha Yellow
            { name: 'Golden Hour', stops: ['#9B7B0A', '#CC9B07', '#FFBD00', '#F9D694', '#F1ECE4'] }, // Mustard Gold → Posha Yellow → Cream
            { name: 'Cotton Sky', stops: ['#ABC3CF', '#A3BDE8', '#9CB5FF', '#D0B5DB', '#FFB1B4'] }, // Juniper Blue → Cornflower Blue → Grapefruit Pink
            { name: 'Fig & Honey', stops: ['#98437E', '#CA5F5F', '#FF7600', '#FF9B00', '#FFBD00'] }, // Plum Purple → Pumpkin Orange → Posha Yellow
            { name: 'Deep Harvest', stops: ['#232D4C', '#1A4048', '#005243', '#4E824A', '#8CB446'] }, // Blueberry Navy → Kale Green → Avocado Green
          ],
        },
        { type: 'heading', text: 'How to build a Posha gradient' },
        {
          // Illustrator Freeform gradient (Points): x / y are % of the shape, spread is Illustrator's Spread.
          type: 'gradientbuild', name: 'Garden Bowl',
          points: [
            { hex: '#005243', name: 'Kale Green', x: 14, y: 22, spread: 70 },
            { hex: '#8CB446', name: 'Avocado Green', x: 50, y: 52, spread: 55 },
            { hex: '#FFBD00', name: 'Posha Yellow', x: 86, y: 80, spread: 65 },
          ],
        },
        {
          type: 'bullets',
          items: [
            '**Pair colours that belong together** — neighbours (Kale Green → Avocado Green → Posha Yellow), warm and cool joined by a pale middle (Juniper Blue → Cornflower Blue → Grapefruit Pink), or deep lifting into bright (Blueberry Navy → Kale Green → Avocado Green).',
            '**Never run opposites straight into each other** — Chili Red into Mint Green turns brown in the middle.',
            '**Keep one end readable** — light enough for dark text, or dark enough for white.',
            '**Name it after food** and note its three colours, so anyone can rebuild it. On the web, Copy CSS gives a linear version of each gradient.',
          ],
        },
      ],
    },
    {
      id: 'usage-ratios',
      title: 'Usage Ratios',
      blocks: [{ type: 'placeholder', style: 'box', body: 'Placeholder · Awaiting content' }],
    },
  ],
});
