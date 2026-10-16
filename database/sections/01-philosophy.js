/* Philosophy — who Posha is and how we talk about it.
   Sources (Oct 2026): posha.com (home, About, Culinary AI, Buy), the brand team's vision statements,
   and the earlier brand deck (only where it still matches how we describe Posha today). */
POSHA.section({
  id: 'philosophy',
  title: 'Brand Philosophy',
  summary: 'The future we’re building, who we are, and how we talk about Posha. The starting point for everything we make.',
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
          text: ['In ten years, no one will cook because they have to.', 'They will only cook because they want to.'],
        },
        {
          type: 'statement', font: 'ui',
          text: 'Cooking will become a leisure activity, like driving is becoming today.',
        },
      ],
    },

    /* ------------------------------------------------------------ Who we are */
    {
      id: 'who-we-are',
      title: 'Who We Are',
      blocks: [
        {
          type: 'text', size: 'lg',
          body: 'We are an AI and robotics company building the future of autonomous cooking and setting the foundation for modern culinary artificial intelligence.',
        },
        {
          type: 'facts',
          items: [
            { k: 'Started', v: '2017, as Nymble' },
            { k: 'Became Posha', v: '2025' },
            { k: 'Name', v: 'From the Sanskrit Poshan, “to nourish”' },
            { k: 'First product', v: 'Posha robot, a robot chef' },
          ],
        },
        {
          type: 'note', title: 'One name, two meanings',
          body: 'Posha is our company. Our first product is Posha robot. Say **Posha robot** whenever you mean the device, and **Posha** for the company. As we make new products, the company name stays the same.',
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
          sub: 'Our most-used line. Lead with it to start the conversation: on the website, in ads, on packaging and on social.',
        },
        {
          type: 'list', columns: 2,
          items: [
            { title: 'Introducing the robot', body: '“Meet Posha, your private robot chef that cooks you delicious home-made meals while you do something else.”' },
            { title: 'Introducing the company', body: '“Making dinner cook itself.” For About pages, press, careers and investor material.' },
          ],
        },
        {
          type: 'note', title: 'In that order',
          body: 'Tagline first, then the robot, then the company. “See dinner cook itself.” opens; the introduction explains; the company line is for when people want to know who’s behind it.',
        },
      ],
    },

    /* ------------------------------------------------------ What Posha robot is */
    {
      id: 'what-posha-is',
      title: 'What Posha Robot Is',
      blocks: [
        {
          type: 'text', size: 'lg',
          body: 'Posha robot is an intelligent robot chef. It sees, stirs, times and adjusts as it cooks. Fresh meals from real ingredients, made at home, while you do something else.',
        },
        { type: 'image', src: '07-gallery/01-essentials/02-product-renders/psh-pr-16-posha-in-kitchen-render.jpg', alt: 'Posha robot on a wooden kitchen counter' },
        {
          type: 'list', columns: 3,
          items: [
            { title: 'Pick a recipe', body: 'Choose from 1,000+ recipes from around the world, from cozy favourites to showstoppers and vegan to high-protein, and tune spice and doneness to taste.' },
            { title: 'Add ingredients', body: 'Load fresh produce and spices. The Posha app and the screen guide every prep step, down to what “diced” looks like.' },
            { title: 'Let Posha robot cook', body: 'Walk away. Posha robot adds each ingredient at the right moment, stirs, controls the heat and tells you when dinner’s ready.' },
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
            '**Time back.** Home-cooked meals without standing at the stove, and one pan that goes in the dishwasher.',
            '**Better food at home.** Cook dishes you love and ones you never thought you could.',
            '**For every cook.** Guided prep makes it easy for anyone in the family to help.',
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
          text: 'Busy, dual-income households across the US, mostly in the suburbs, who love a home-cooked meal and don’t have the evenings to make one.',
        },
        {
          type: 'facts',
          items: [
            { k: 'Household income', v: '$150K+' },
            { k: 'Where', v: 'Mostly the suburbs, also cities' },
            { k: 'Work', v: 'Dual income' },
            { k: 'Market', v: 'USA only, for now' },
          ],
        },
        {
          type: 'list', columns: 2,
          items: [
            { title: 'With kids', body: 'Weeknights pulled between work, school runs and activities. Posha robot puts a fresh, home-cooked family dinner on the table without someone stuck at the stove.' },
            { title: 'Without kids', body: 'Couples who care about good food and want to eat better at home without giving up their evenings to cook it.' },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------ Culinary AI */
    {
      id: 'culinary-ai',
      title: 'Culinary AI',
      // Source: posha.com/culinaryai (“To Cook is to See”)
      blocks: [
        {
          type: 'statement', label: 'Culinary AI',
          text: 'To cook is to see.',
          sub: 'Culinary AI (cAI) is a new class of AI that doesn’t just read recipes, but sees, understands and reasons about food as it cooks.',
        },
        {
          type: 'text',
          body: 'Language models changed desk work. Physical AI is next: robots that do real work in the real world, and to act they first have to see. A self-driving car reads lanes, signs and people. A great chef reads food. Posha robot is built on the same idea, so it can cook a great meal every time, at scale.',
        },
        { type: 'heading', text: 'What it reads before cooking' },
        {
          type: 'list', columns: 3,
          items: [
            { title: 'Ingredient', body: 'Tells one ingredient from another: broccoli from cabbage, shiitake from potato, penne from rice.' },
            { title: 'Prep style', body: 'Beef in strips, mince or chunks. The cut changes how much heat it needs and what “done” looks like.' },
            { title: 'Size', body: 'A large broccoli floret cooks longer than a small one. Size sets the timing.' },
            { title: 'Volume', body: 'How much there is shapes the rest of the recipe: the amount of tomato balances sweet and sour, the amount of rice sets the water.' },
            { title: 'Variant', body: 'Glass noodles, rice noodles or a noodle cake. Thigh or breast. Each needs different water, heat and stirring.' },
          ],
        },
        { type: 'heading', text: 'What it watches while cooking' },
        {
          type: 'list', columns: 3,
          items: [
            { title: 'Colour', body: 'Raw to cooked, pale to golden, golden to brown. Posha robot knows lightly sautéed onions from caramelised ones, and when chicken has turned from pink to white.' },
            { title: 'Texture', body: 'A potato starts firm, softens, then breaks down into a mash. Structure changes as much as colour.' },
            { title: 'Size', body: 'Food shrinks, wilts and breaks apart as it heats. Tracking it in real time shows how far along it is.' },
          ],
        },
        { type: 'heading', text: 'Moments it catches' },
        {
          type: 'bullets',
          items: [
            'Still water turning to a rolling boil.',
            'Rice or pasta soaking up the last free water, leaving the pan dry.',
            'Frozen or clumped meat breaking up into even pieces.',
            'A noodle cake or dry spaghetti softening and sinking into the liquid.',
          ],
        },
        { type: 'heading', text: 'Built on real cooking data' },
        {
          type: 'text',
          body: 'There’s very little research on how food changes as it cooks, because there’s never been enough fine-grained data. So we’re building it: the **Culinary Vision Dataset**, the world’s largest collection of real-world cooking data, tracking colour, size, texture and structure.',
        },
        {
          type: 'facts',
          items: [
            { k: 'Datapoints', v: '5 million' },
            { k: 'Cooking sessions', v: 'Thousands' },
            { k: 'Tracks', v: 'Colour, size, texture, structure' },
          ],
        },
        {
          type: 'note', tone: 'info', title: 'How to talk about it',
          body: 'Say **Culinary AI**, with **(cAI)** the first time. In customer copy, explain it through what a chef does: “Built to cook like a human, Posha has a chef’s eyes.” Keep the bigger picture (Physical AI, datasets, self-driving cars) for press, investors and careers.',
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
            { title: '2017 · Beginning', image: '07-gallery/04-others/02-old-models/psh-om-01-2017-beginning.png', alt: 'The 2017 robotic-arm prototype', body: 'Started with $1,000 saved as engineering undergrads in India. The first prototype was a robotic arm that picked up ingredients, added them to a pan and stirred.' },
            { title: '2018 · Nymble ver01', image: '07-gallery/04-others/02-old-models/psh-om-02-2018-nymble-ver01.png', alt: 'Nymble ver01, 2018', body: 'A robot arm felt intimidating in a kitchen, so the design became something familiar: a coffee machine. Add ingredients, tap a button, let it do the rest.' },
            { title: '2020 · Julia', image: '07-gallery/04-others/02-old-models/psh-om-03-2020-julia.png', alt: 'Julia, 2020', body: 'People wanted bigger portions and leftovers. Larger containers and reservoirs reshaped it into an elongated C-form.' },
            { title: '2021 · Alpha', image: '07-gallery/04-others/02-old-models/psh-om-04-2021-nymble-alpha.png', alt: 'Nymble Alpha, 2021', body: 'The first prototype to live in real homes for extended testing, built to prove it could reliably cook great food.' },
            { title: '2023 · Beta', image: '07-gallery/04-others/02-old-models/psh-om-05-2023-nymble-beta.png', alt: 'Nymble Beta, 2023', body: '50 units in real homes for 18 months, shaping the hardware, the software and, above all, the food.' },
            { title: '2025 · Posha robot', image: '07-gallery/04-others/02-old-models/psh-om-06-2025-posha.png', alt: 'Posha robot, 2025', body: 'Named after the Sanskrit Poshan, “to nourish.” Built on years of trials, now made on a large-scale assembly line with premium materials.' },
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
          sub: 'Warm, sure of itself, a little cheeky, and always on your side at dinnertime. Posha talks about food and evenings, not features and specs.',
        },
        { type: 'heading', text: 'Lines from posha.com' },
        {
          type: 'quotes',
          items: [
            { text: 'See dinner cook itself.', trait: 'Confident', source: 'Tagline' },
            { text: 'Your dish is my command.', trait: 'Playful', source: 'Homepage' },
            { text: 'Built to cook like a human, Posha has a chef’s eyes.', trait: 'Confident', source: 'Culinary AI' },
            { text: 'Setup: Easy-peasy, lemon squeezy.', trait: 'Playful', source: 'How it works' },
            { text: 'You crave it. Posha cooks it.', trait: 'Confident', source: 'Homepage' },
            { text: 'Now it’s time to sit back, share a meal and enjoy the part that matters.', trait: 'Warm', source: 'How it works' },
            { text: 'No junk food. No junk mail.', trait: 'Playful', source: 'Newsletter' },
            { text: 'Not the dinner experience you had in mind? We’ve got you covered.', trait: 'Honest', source: 'Returns' },
          ],
        },
        { type: 'heading', text: 'Four traits' },
        {
          type: 'list', columns: 2,
          items: [
            { title: 'Warm', body: 'We love food and want you to eat well. We talk about the part that matters: the meal, the table, the people. **Not** sugary or salesy.' },
            { title: 'Confident', body: 'Short, sure sentences. We say what Posha does and let it land. **Not** hype, superlatives or jargon.' },
            { title: 'Playful', body: 'A wink and a food pun where it fits. **Not** jokes that get in the way when someone needs help.' },
            { title: 'Honest', body: 'Plain English about real life and how Posha robot really works. **Not** overpromising or dodging the details. “Working at Posha is extremely hard. And incredibly fun.”' },
          ],
        },
        { type: 'heading', text: 'Tone by moment' },
        {
          type: 'list', columns: 3,
          items: [
            { title: 'Headlines & ads', body: 'Most confident, most playful. One idea, short rhythm, often a full stop. “Your dish is my command.”' },
            { title: 'App & device', body: 'Calm, clear, step by step. Tell people exactly what to do next. “Load it into Posha robot.”' },
            { title: 'Help & orders', body: 'Reassuring and plain; a light touch at most. “It’s fully refundable, so there’s nothing to lose and lots of great meals ahead.”' },
            { title: 'Culinary AI & press', body: 'Precise and expert, still in plain words. Explain how Posha robot sees and adjusts, without the jargon.' },
            { title: 'Stories & social', body: 'Relatable and real: weeknights, school runs, holidays. “The first week of school is undefeated. Dinner doesn’t have to be.”' },
            { title: 'Careers', body: 'Candid and ambitious. We say it’s hard and why it’s worth it. “Let us do hard work together.”' },
          ],
        },
        { type: 'heading', text: 'Say this, not that' },
        {
          type: 'rewrites',
          items: [
            { not: 'Posha robot is a self-cooking stove with advanced AI-powered features.', say: 'Meet Posha, your private robot chef.', why: 'An intelligent robot, not an appliance. Introduce Posha like a name.' },
            { not: 'Select any recipe and the device will prepare it automatically.', say: 'Your dish is my command.', why: 'Let Posha speak as a character, with a wink.' },
            { not: 'Our computer vision system monitors the cooking process in real time.', say: 'Built to cook like a human, Posha has a chef’s eyes.', why: 'Explain Culinary AI (cAI) through what a chef does.' },
            { not: 'Installation is quick and requires minimal effort.', say: 'Setup: Easy-peasy, lemon squeezy.', why: 'A light touch, where it doesn’t get in the way.' },
            { not: 'Save time on meal preparation with automated cooking.', say: 'You crave it. Posha cooks it.', why: 'Short and sure. Two beats, then a full stop.' },
            { not: 'Error 404: the requested page could not be found.', say: 'Page not on the menu.', why: 'Even an error page sounds like us.' },
            { not: 'Returns are accepted within 30 days, subject to terms and conditions.', say: 'It’s fully refundable, so there’s nothing to lose and lots of great meals ahead.', why: 'Plain and reassuring when trust is on the line.' },
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
            'Call Posha robot an **intelligent robot** or a **robot chef**: “your private robot chef”',
            'Say **Posha robot** for the device and **Posha** for the company. Use it like a name, not “the Posha”',
            'Talk about **fresh, home-made meals** and **real ingredients**',
            'Say **Culinary AI (cAI)** for the intelligence behind it',
            'Show what people get back: time, better food, “while you do something else”',
          ],
          dont: [
            'Call it a **self-cooking stove**, an appliance or a gadget',
            'Compare it directly to a meal kit or a microwave',
            'Lead with specs. Lead with dinner',
            'Promise it replaces cooking for people who love to cook',
          ],
        },
      ],
    },
  ],
});
