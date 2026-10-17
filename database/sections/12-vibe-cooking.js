// Vibe Cooking — its own chapter, after Culinary UI. Work in progress.
// Source: the Vibe Cook mascot prototype (Vibe Cooking/Selected Route Coding/vibe-cook-mascot: CLAUDE.md, HANDOFF.md)
// The live prototype is copied to code/vibe-cook/mascot.html.
POSHA.section({
  id: 'vibe-cooking',
  title: 'Vibe Cooking',
  summary: 'Change any recipe in your own words, and watch Posha’s Vibe Cook mascot make it yours. A first draft of how the prototype looks, behaves and talks.',

  pages: [
    /* ---------------------------------------------------------------- What it is */
    {
      id: 'what-it-is',
      title: 'What It Is',
      blocks: [
        {
          type: 'text', size: 'lg',
          body: 'Vibe Cooking lets anyone change a recipe the way they’d tell a friend: “make it spicier”, “swap the onion”, “bean chili, but Italian”. Posha robot works out the changes, shows them through the Vibe Cook mascot, and cooks the result.',
        },
        {
          type: 'list', columns: 3,
          items: [
            { title: 'Say it your way', body: 'Type, tap a suggestion or speak. Posha understands everyday requests: add, remove, swap, spicier, creamier, higher protein, kid-friendly, quicker.' },
            { title: 'See it change', body: 'The Vibe Cook mascot acts out every change: ingredients drop in, get plucked out or turn into something else, right in its eyes.' },
            { title: 'Review, then send', body: 'Nothing is cooked until you’ve seen a summary and committed it. Then it goes to Posha robot.' },
          ],
        },
        { type: 'heading', text: 'The prototype' },
        {
          type: 'html',
          html: '<div class="vc-warn" role="note"><span class="vc-warn-tag">In development</span><strong>This is a first prototype</strong><p>An early, internal exploration of how Vibe Cooking could look and behave. Not final and not production UI: everything here will change.</p></div>',
        },
        { type: 'vibeproto', src: '/code/vibe-cook/mascot.html' },
      ],
    },

    /* ---------------------------------------------------------------- The mascot */
    {
      id: 'mascot',
      title: 'The Vibe Cook Mascot',
      blocks: [
        {
          type: 'text', size: 'lg',
          body: 'The mascot is a face built from the Posha wordmark. It’s how Vibe Cooking shows you what it understood, and it should feel like a friend who’s a great cook: curious, quick and happy to help.',
        },
        { type: 'heading', text: 'Anatomy' },
        {
          type: 'list', columns: 3,
          items: [
            { title: 'Eyes that dream of food', body: 'It only has food on its mind: each eye is one of our gradient food icons, showing what it’s cooking up. At rest the two eyes dream of two different ingredients from the recipe.' },
            { title: 'One line for brow and nose', body: 'A single line, taken from the O of the wordmark. It bends into a pot, a clock hand or a ribbon as the mascot works. Its ends stay square.' },
            { title: 'A loop for a mouth', body: 'A structured loop that smiles, grins and reacts. It only appears once the line is at rest, and the two never touch.' },
          ],
        },
        { type: 'heading', text: 'Sizes' },
        {
          type: 'facts',
          items: [
            { k: 'Hero', v: 'Large, on its own: campaigns, onboarding, demos' },
            { k: 'Chat', v: 'The avatar beside each reply' },
            { k: 'Chat, phone', v: 'In the app; also at 2× above the latest reply' },
            { k: 'Micro', v: 'Inside the chat field’s circle, with a closed smile' },
          ],
        },
        { type: 'heading', text: 'Mood and backdrop' },
        {
          type: 'bullets',
          items: [
            '**Mood:** Normal, Cheery, **Confident** (the default) or Master chef. Mood changes the resting mouth, where the brow sits, how the head is carried, how far the eyes roam and how hard it nods.',
            '**Backdrops:** Light, Dark or Gradient. On Gradient the glows are soft and slow, with a dark centre. Light-on-dark reads heavier, so on Dark and Gradient the line and mouth are drawn 5% thinner.',
            '**Organic motion:** the mascot moves at about 14 drawings a second, each held a slightly different time, so it feels hand-drawn. Only the mascot moves this way, never the rest of the interface.',
          ],
        },
      ],
    },

    /* ---------------------------------------------------------------- How it behaves */
    {
      id: 'behaviour',
      title: 'How It Behaves',
      blocks: [
        {
          type: 'text', size: 'lg',
          body: 'Every change to a recipe has its own small performance, so people can see exactly what happened without reading a list.',
        },
        {
          type: 'list', columns: 2,
          items: [
            { title: 'Add', body: 'Loose food is stirred in: the line closes into a pot, a stirrer rises, and the new ingredient is tossed in and lands in an eye with a grin. Spices and anything in a bottle, bowl, carton or jar are imagined instead: a circle opens with one empty place and the new item pops into it.' },
            { title: 'Remove', body: 'A pluck: the ingredient dips, pops up out of its place at full size, lifts away and fades. The eye fills again from the recipe.' },
            { title: 'Swap', body: 'The old item sits in the left eye, the new one appears smaller in the right. The face looks from one to the other, then the old one morphs into the new one in place.' },
            { title: 'Levels', body: 'Spicier, creamier, richer, thicker: the loop curls into a pill round an eye and the level is drawn as one continuous line, never a segmented ring.' },
            { title: 'Cook time', body: 'The face becomes a clock: the line swings into the hand, the eyes sit at 9 and 3, the mouth is drawn round them as the dial. The hand ticks back for a shorter cook, forward for a longer one.' },
            { title: 'Thinking', body: 'Only for requests it has to puzzle over. A status line runs through food puns with a seconds counter, then collapses to “Simmered for 2s”. Requests it understands are answered at once.' },
            { title: 'Review', body: 'The loop becomes the wordmark’s O lying on its side, a looking glass, and the face reads the summary line by line.' },
            { title: 'Commit and send', body: 'Commit gets three small hops and a smile. Send is the hero moment: the line winds into a spiral, unwinds into a waving ribbon and rises out of the top, the recipe’s icons following in two tidy streams. Then “Sent to Posha”.' },
          ],
        },
        { type: 'heading', text: 'At rest' },
        {
          type: 'bullets',
          items: [
            'Before anyone types, the eyes drift through the five taste icons, never showing the same one twice.',
            'Idle life is glances, look-arounds, tilts, brow lifts and the eyes gently changing size. Blinks are rare (every 5 to 10 seconds). No winks.',
            'While someone types, it’s happy and curious: it watches the field, follows the caret and glances up now and then.',
            'While listening to voice, it leans in and cocks its head. Nothing is drawn round it: no halo, ring or level meter.',
          ],
        },
        { type: 'heading', text: 'Rules' },
        {
          type: 'rules',
          do: [
            'Show only the recipe’s own food once a recipe is in play',
            'Keep the two eyes in their own places, always',
            'Let the mouth appear only once the line is at rest',
            'Keep the whole mascot inside its box at every size',
            'Answer clear requests at once; think only when puzzled',
            'Play combined requests in order, one beat after another',
          ],
          dont: [
            'Swap the eyes’ positions or cross them over each other',
            'Let the line overlap or touch the mouth',
            'Put anything from a bottle, bowl, carton, jar or shaker in the pot',
            'Use organic motion anywhere except the mascot',
            'Round the line’s ends or add shakes, grain or jitter',
            'Grow the mascot beyond its avatar in chat, except the welcome, commit and send moments',
          ],
        },
      ],
    },

    /* ---------------------------------------------------------------- Chat and copy */
    {
      id: 'chat',
      title: 'Chat & Copy',
      blocks: [
        {
          type: 'list', columns: 2,
          items: [
            { title: 'Welcome', body: 'Before the first message: the mascot large and centred over “Let’s vibe cook!”, with the field reading “Start here”. The first message turns it into a regular chat.' },
            { title: 'Messages', body: 'Replies sit in a light beige box with a short line length. The person’s message is a flat, darker beige bubble with a tail corner: it must never look like a button.' },
            { title: 'Quick replies', body: 'Bottom right, above the chat field: suggestions that fit the recipe, or ways forward after an unclear request.' },
            { title: 'Guided changes', body: 'Requests with choices in them (kid-friendly, less spicy, quicker) become a short numbered list of small changes, decided one at a time with Skip and Confirm.' },
          ],
        },
        { type: 'heading', text: 'How it talks' },
        {
          type: 'bullets',
          items: [
            '**Short and plain.** Say what changes and why, in a few words.',
            '**A pun while it thinks, never in the answer.** “Let me chew on that.” “Whisking up some ideas.” “Simmered for 2s.”',
            '**No dead ends.** Only offer a change that can actually be made.',
            '**Show what changed:** chips with + added, − removed and → swapped in.',
          ],
        },
        {
          type: 'rewrites',
          items: [
            { not: 'Processing your request. Please wait.', say: 'Let me chew on that.', why: 'A food pun for the wait, and only for the wait.' },
            { not: 'Ingredient modification applied successfully.', say: 'Swapped the onion for green onion and turned up the heat.', why: 'Say what changed, plainly.' },
            { not: 'Are you sure you want to submit these changes?', say: 'Here’s your dish now. Commit changes?', why: 'Show the result, then ask one clear question.' },
          ],
        },
        { type: 'note', tone: 'warn', title: 'Still open', body: 'Doneness has no symbol or animation yet. The richness treatment is experimental. Requests are read with simple keyword rules for now.' },
      ],
    },
  ],
});
