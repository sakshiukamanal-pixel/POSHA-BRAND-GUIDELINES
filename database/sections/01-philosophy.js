/* Philosophy — who Posha is and how we talk about it.
   Sources (Oct 2026): posha.com (home, About, Culinary AI, Buy), the brand team's vision statements,
   and the earlier brand deck (only where it still matches how we describe Posha today). */
POSHA.section({
  id: 'philosophy',
  title: 'Philosophy',
  summary: 'The future we’re building, who we are, and how we talk about Posha — the starting point for everything we make.',
  // shown between the contents and the first section
  afterToc: [
    { type: 'image', src: '07-gallery/02-photoshoots/01-while-posha-cooks/psh-ps1-05-unwinding-on-the-counter.jpg', alt: 'Posha cooking on a kitchen counter while a woman relaxes beside it with a glass of wine' },
  ],

  pages: [
    /* ------------------------------------------------------------ The future */
    {
      id: 'future',
      title: 'The Future We’re Building',
      blocks: [
        {
          type: 'statement', font: 'ui',
          text: ['In **ten years**,', 'no one will cook because they **have to.**', 'They will only cook because they **want to.**'],
        },
        {
          type: 'statement', font: 'ui',
          text: 'Cooking will become a **leisure activity**, like driving is becoming today.',
        },
        {
          type: 'text', size: 'lg',
          body: 'We’re building a future where the kitchen takes care of cooking, so you can focus on living.',
        },
      ],
    },

    /* ------------------------------------------------------------ Who we are */
    {
      id: 'who-we-are',
      title: 'Who We Are',
      blocks: [
        {
          type: 'statement',
          text: 'Making dinner cook itself.',
          sub: 'We are an AI and robotics company building the future of autonomous cooking and setting the foundation for modern culinary artificial intelligence.',
        },
        {
          type: 'facts',
          items: [
            { k: 'Started', v: '2017, as Nymble' },
            { k: 'Became Posha', v: '2025' },
            { k: 'Name', v: 'From the Sanskrit Poshan — to nourish' },
            { k: 'First product', v: 'Posha, the robot chef' },
          ],
        },
        {
          type: 'note', title: 'One name, two meanings',
          body: 'Posha is our company and the name of our first product, the robot. As we make new products the company name stays the same. Where it could be unclear, say “Posha the robot” or “the team at Posha”.',
        },
      ],
    },

    /* ---------------------------------------------- Tagline & how we introduce Posha */
    {
      id: 'tagline',
      title: 'Tagline & Introductions',
      blocks: [
        {
          type: 'statement', label: 'Tagline · use everywhere',
          text: 'See dinner cook itself.',
          sub: 'Our most-used line. Lead with it to start the conversation — on the website, in ads, on packaging and on social.',
        },
        {
          type: 'list', columns: 2,
          items: [
            { title: 'Introducing the robot', body: '“Meet Posha, your private robot chef that cooks you delicious home-made meals while you do something else.”' },
            { title: 'Introducing the company', body: '“Making dinner cook itself.” — for About pages, press, careers and investor material.' },
          ],
        },
        {
          type: 'note', title: 'In that order',
          body: 'Tagline first, then the robot, then the company. “See dinner cook itself.” opens; the introduction explains; the company line is for when people want to know who’s behind it.',
        },
      ],
    },

    /* ------------------------------------------------------------ What Posha is */
    {
      id: 'what-posha-is',
      title: 'What Posha Is',
      blocks: [
        {
          type: 'text', size: 'lg',
          body: 'Posha is an intelligent robot chef. It sees, stirs, times and adjusts as it cooks — fresh meals from real ingredients, made at home, while you do something else.',
        },
        {
          type: 'list', columns: 3,
          items: [
            { title: 'Pick a recipe', body: 'Choose from 1,000+ recipes from around the world — cozy favourites to showstoppers, vegan to high-protein — and tune spice and doneness to taste.' },
            { title: 'Add ingredients', body: 'Load fresh produce and spices. The Posha app and the screen guide every prep step, down to what “diced” looks like.' },
            { title: 'Let Posha cook', body: 'Walk away. Posha adds each ingredient at the right moment, stirs, controls the heat and tells you when dinner’s ready.' },
          ],
        },
        {
          type: 'facts',
          items: [
            { k: 'Recognition', v: 'TIME Best Inventions of 2025' },
            { k: 'Trusted in', v: '1,000+ homes' },
            { k: 'Recipes', v: '1,000+, all cuisines and diets' },
            { k: 'Available in', v: 'The USA' },
          ],
        },
        { type: 'heading', text: 'Why it matters' },
        {
          type: 'bullets',
          items: [
            '**Time back** — home-cooked meals without standing at the stove, and one pan that goes in the dishwasher.',
            '**Better food at home** — cook dishes you love and ones you never thought you could.',
            '**For every cook** — guided prep makes it easy for anyone in the family to help.',
          ],
        },
      ],
    },

    /* ------------------------------------------------------------ Who it's for */
    {
      id: 'who-its-for',
      title: 'Who It’s For',
      blocks: [
        {
          type: 'statement', font: 'ui', label: 'Our ideal customer',
          text: 'Busy, dual-income households across the US — mostly in the suburbs — who love a home-cooked meal and don’t have the evenings to make one.',
        },
        {
          type: 'facts',
          items: [
            { k: 'Household income', v: '$150K+' },
            { k: 'Where', v: 'Mostly the suburbs, also cities — USA' },
            { k: 'Work', v: 'Dual income' },
            { k: 'Market', v: 'USA only, for now' },
          ],
        },
        {
          type: 'list', columns: 2,
          items: [
            { title: 'With kids', body: 'Weeknights pulled between work, school runs and activities. Posha puts a fresh, home-cooked family dinner on the table without someone stuck at the stove.' },
            { title: 'Without kids', body: 'Couples who care about good food and want to eat better at home — without giving up their evenings to cook it.' },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------ Culinary AI */
    {
      id: 'culinary-ai',
      title: 'Culinary AI',
      blocks: [
        {
          type: 'statement', label: 'Culinary AI',
          text: 'To cook is to see.',
          sub: 'Culinary AI (cAI) is a new class of AI that doesn’t just read recipes, but sees, understands and reasons about food as it cooks.',
        },
        {
          type: 'list', columns: 3,
          items: [
            { title: 'It knows the ingredients', body: 'What each ingredient is, how it’s been prepped, how big it’s cut, how much there is and which variant it is — penne or spaghetti, thigh or breast.' },
            { title: 'It watches food change', body: 'Colour, texture and size shift as food heats. Posha tracks them in real time to know when onions are golden or chicken is cooked through.' },
            { title: 'It catches the moments', body: 'Water coming to a boil, rice absorbing its water, noodles softening — the cues a chef watches for, every time.' },
          ],
        },
        {
          type: 'text',
          body: 'It’s built on the Culinary Vision Dataset — the world’s largest collection of real-world cooking data, with 5 million datapoints from thousands of cooking sessions.',
        },
      ],
    },

    /* ------------------------------------------------------------ Our story */
    {
      id: 'our-story',
      title: 'Our Story',
      blocks: [
        {
          type: 'list', columns: 3,
          items: [
            { title: '2017 · Beginning', body: 'Started with $1,000 saved as engineering undergrads in India. The first prototype was a robotic arm that picked up ingredients, added them to a pan and stirred.' },
            { title: '2018 · Nymble ver01', body: 'A robot arm felt intimidating in a kitchen, so the design became something familiar: a coffee machine. Add ingredients, tap a button, let it do the rest.' },
            { title: '2020 · Julia', body: 'People wanted bigger portions and leftovers. Larger containers and reservoirs reshaped it into an elongated C-form.' },
            { title: '2021 · Alpha', body: 'The first prototype to live in real homes for extended testing — built to prove it could reliably cook great food.' },
            { title: '2023 · Beta', body: '50 units in real homes for 18 months, shaping the hardware, the software and, above all, the food.' },
            { title: '2025 · Posha', body: 'From the Sanskrit Poshan, “to nourish”. Built on years of trials, now made on a large-scale assembly line with premium materials.' },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------ Tone of voice */
    {
      id: 'tone-of-voice',
      title: 'Tone of Voice',
      blocks: [
        {
          type: 'statement', label: 'Our voice in one line',
          text: 'A friend who’s a great cook.',
          sub: 'Warm, sure of itself, a little cheeky — and always on your side at dinnertime. Posha talks about food and evenings, not features and specs.',
        },
        { type: 'heading', text: 'Four traits' },
        {
          type: 'list', columns: 2,
          items: [
            { title: 'Warm', body: 'We love food and want you to eat well. We talk about the part that matters — the meal, the table, the people. **Not** sugary or salesy. “Now it’s time to sit back, share a meal and enjoy the part that matters.”' },
            { title: 'Confident', body: 'Short, sure sentences. We say what Posha does and let it land. **Not** hype, superlatives or jargon. “See dinner cook itself.” “You crave it. Posha cooks it.”' },
            { title: 'Playful', body: 'A wink and a food pun where it fits. **Not** jokes that get in the way when someone needs help. “Page not on the menu.” “No junk food. No junk mail.” “Easy-peasy, lemon squeezy.”' },
            { title: 'Honest', body: 'Plain English about real life and how Posha really works. **Not** overpromising or dodging the details. “A weekly dinner plan that survives real weeknights.” “Working at Posha is extremely hard. And incredibly fun.”' },
          ],
        },
        { type: 'heading', text: 'Tone by moment' },
        {
          type: 'list', columns: 3,
          items: [
            { title: 'Headlines & ads', body: 'Most confident, most playful. One idea, short rhythm, often a full stop. “Your dish is my command.”' },
            { title: 'App & device', body: 'Calm, clear, step by step. Tell people exactly what to do next. “Load it into Posha.”' },
            { title: 'Help & orders', body: 'Reassuring and plain; a light touch at most. “It’s fully refundable, so there’s nothing to lose and lots of great meals ahead.”' },
            { title: 'Culinary AI & press', body: 'Precise and expert, still in plain words. Explain how Posha sees and adjusts, without the jargon.' },
            { title: 'Stories & social', body: 'Relatable and real — weeknights, school runs, holidays. “The first week of school is undefeated. Dinner doesn’t have to be.”' },
            { title: 'Careers', body: 'Candid and ambitious. We say it’s hard and why it’s worth it. “Let us do hard work together.”' },
          ],
        },
        { type: 'heading', text: 'How we write' },
        {
          type: 'bullets',
          items: [
            '**Talk to “you”.** Second person, about your evening, your table, your time.',
            '**Let Posha be a character.** “Meet Posha.” “Posha takes over.” “Your dish is my command.”',
            '**Lead with dinner, then explain.** The outcome first; how it works second.',
            '**Keep it short.** Short sentences, built in pairs and threes. “Pick a recipe. Add ingredients. Let Posha cook.”',
            '**Sentence case**, and a full stop on taglines: “See dinner cook itself.”',
            '**Numbers as digits**: 1,000+ recipes, 30-day returns.',
          ],
        },
        { type: 'heading', text: 'Words we use' },
        {
          type: 'rules',
          do: [
            'Call Posha an **intelligent robot** or a **robot chef** — “your private robot chef”',
            'Say **Posha**, like a name — not “the Posha”. It’s both the company and the robot',
            'Talk about **fresh, home-made meals** and **real ingredients**',
            'Say **Culinary AI (cAI)** for the intelligence behind it',
            'Show what people get back: time, better food, “while you do something else”',
          ],
          dont: [
            'Call it a **self-cooking stove**, an appliance or a gadget',
            'Compare it directly to a meal kit or a microwave',
            'Lead with specs — lead with dinner',
            'Promise it replaces cooking for people who love to cook',
          ],
        },
      ],
    },
  ],
});
