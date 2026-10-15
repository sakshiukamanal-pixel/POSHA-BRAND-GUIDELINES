/* Click any swatch on the site to copy its HEX.
   `weight` sets how wide a swatch is in a weighted row (it reflects usage).
   `name` is the Posha (food-inspired) colour name; `alias` is the old descriptive name, shown small.
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
          type: 'palette', layout: 'weighted', ratio: '2.6/1', align: 'end',
          items: [
            { name: 'Steamed Rice', alias: 'Posha White', hex: '#FFF9F5', rgb: '255/249/245', cmyk: '0/2/2/0', weight: 38 },
            { name: 'Oat Milk', alias: 'Warm Neutral', hex: '#F1E9DE', rgb: '241/233/222', cmyk: '3/6/11/0', weight: 22 },
            { name: 'Cast Iron', alias: 'Mid Grey', hex: '#484848', rgb: '72/72/72', cmyk: '65/58/57/38', weight: 29 },
            { name: 'Turmeric', alias: 'Posha Yellow', hex: '#FFBD00', rgb: '255/189/0', cmyk: '0/24/100/0', weight: 11, center: true },
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
            { name: 'Paprika', alias: 'Burnt Orange', hex: '#FF7600', rgb: '255/118/0', cmyk: '0/71/100/0' },
            { name: 'Rose Lassi', alias: 'Soft Rose', hex: '#FFB1B4', rgb: '255/177/180', cmyk: '0/41/15/0' },
            { name: 'Blue Pea', alias: 'Cool Blue', hex: '#9CB5FF', rgb: '156/181/255', cmyk: '37/23/0/0' },
            { name: 'Chilli', alias: 'Alert Red', hex: '#FF2E20', rgb: '255/46/32', cmyk: '0/100/100/0' },
            { name: 'Mint', alias: 'Active Green', hex: '#96FF94', rgb: '150/255/148', cmyk: '40/0/57/0' },

            { name: 'Olive', alias: 'Dark Olive', hex: '#2F3600', rgb: '47/54/0', cmyk: '67/52/100/61' },
            { name: 'Beetroot', alias: 'Magenta', hex: '#8C003A', rgb: '140/0/58', cmyk: '25/100/65/19' },
            { name: 'Cinnamon', alias: 'Deep Brown', hex: '#552720', rgb: '85/39/32', cmyk: '37/83/80/56' },
            { name: 'Blueberry', alias: 'Night Blue', hex: '#232D4C', rgb: '35/45/76', cmyk: '93/83/41/38' },
            { name: 'Kokum', alias: 'Rich Maroon', hex: '#2C0016', rgb: '44/0/22', cmyk: '60/89/60/75' },

            { name: 'Sea Salt', alias: 'Light Grey', hex: '#F1F2ED', rgb: '241/242/237', cmyk: '4/2/5/0' },
            // Oat Milk (Warm Neutral) moved up to the Primary Palette
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
          ],
        },
      ],
    },
    {
      id: 'usage-ratios',
      title: 'Usage Ratios',
      blocks: [{ type: 'placeholder', style: 'box', body: 'Placeholder · Awaiting content' }],
    },
    {
      id: 'accessibility',
      title: 'Accessibility',
      blocks: [{ type: 'placeholder', style: 'box', body: 'Placeholder · Awaiting content' }],
    },
  ],
});
