# 🍪 Abigail Cookies

A mobile-first recipe app for following cookie recipes hands-free while you bake —
built for starting and running a cookie business. It's a **Progressive Web App (PWA)**,
so it runs in your iPhone's browser, installs to your home screen like a native app,
and works **offline** in the kitchen. No App Store, no Mac required.

## Features

- **9 business-ready recipes** with tested measurements, prep/bake times, oven temps,
  and pro tips.
- **Step-by-step baking mode** — large, swipeable instruction cards you can read from
  across the kitchen; tap or swipe to advance, check off each step, and the screen
  stays awake while you bake.
- **Built-in timers** — bake steps have a one-tap countdown that beeps and vibrates
  when time's up.
- **Batch scaling** — scale any recipe ½×, 2×, 3×, or enter a target number of cookies,
  and every ingredient amount recalculates automatically (shown as friendly baking
  fractions like ¾ and 1½).
- **Search & categories** — find recipes by name or filter by category (Classic,
  Chocolate, Holiday, Specialty).
- **Offline & installable** — works without a connection once loaded.

## Run it on your iPhone

1. Deploy the app (see below) to get a public URL — or, on the same Wi‑Fi, use the
   dev server URL.
2. Open the URL in **Safari** on your iPhone.
3. Tap the **Share** button → **Add to Home Screen**.
4. Launch it from your home screen — it opens full-screen with the cookie icon.

## Develop locally

Requires Node 18+.

```bash
npm install      # install dependencies
npm run dev      # start the dev server (open the printed URL)
npm run build    # type-check + build to dist/
npm run preview  # preview the production build locally
```

The app icons in `public/icons/` and `public/apple-touch-icon.png` are generated
(not committed) by `scripts/generate-icons.mjs`, which runs automatically before
`dev` and `build`. Run `npm run icons` to regenerate them on demand.

## Deploy (free options)

The build output in `dist/` is a static site — host it anywhere:

- **Netlify** — drag-and-drop the `dist/` folder at app.netlify.com, or connect this
  repo and set build command `npm run build`, publish directory `dist`.
- **Vercel** — import the repo; it auto-detects Vite.
- **GitHub Pages** — push `dist/` to a `gh-pages` branch (the app uses relative paths,
  so it works from a subpath).

## Add or edit recipes

All recipes live in **`src/data/recipes.ts`**. Copy an existing entry and edit the
fields:

```ts
{
  id: 'my-new-cookie',            // unique, url-safe
  name: 'My New Cookie',
  category: 'Specialty',          // groups it under a filter chip
  description: 'Short pitch shown on the card.',
  yield: 24,                      // cookies per base batch (used for scaling)
  prepMinutes: 15,
  bakeMinutes: 11,
  ovenTempF: 350,
  difficulty: 'Easy',             // 'Easy' | 'Medium'
  ingredients: [
    { quantity: 2.25, unit: 'cups', name: 'all-purpose flour' },
    { quantity: 1, unit: '', name: 'egg', note: 'large' }, // unit can be empty
  ],
  steps: [
    { instruction: 'Preheat the oven to 350°F.' },
    { instruction: 'Bake until golden.', timerMinutes: 11 }, // adds a timer to this step
  ],
  tips: ['Optional helpful tips shown at the bottom.'],
}
```

`quantity` is always a number so batch scaling can recompute it. Use an empty `unit`
(`''`) for count-based items like eggs.

## Tech

Vite + React + TypeScript, `vite-plugin-pwa` (offline/installable), and
`react-router-dom`. No backend — recipes ship with the app and your progress/scale
preferences are saved in the browser.

## Ideas for later

In-app recipe editing, photos, shopping-list generation, and a per-batch cost &
pricing calculator for the business side.
