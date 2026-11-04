# Colorteam Studio app

The Studio where clients make on-brand content. Lives at app.colorteam.io.

- `legacy/app/` the screens as they were written (one file per screen, shared globals). They are joined into one module at build time by the plugin in `vite.config.js`, so they can be edited exactly as before.
- `public/ds/` the Colorteam design-system bundle and tokens. `public/assets/` logos, imagery, the guidelines PDF.
- `globals.js` exposes React, Supabase, html-to-image and jsPDF under the global names the screens expect.

## Run

```
npm install
npm run dev      # http://localhost:5173
npm run build    # static site in dist/
```

Pushing to `main` builds and deploys through GitHub Actions.

Supabase project and anon key are in `legacy/app/config.js` (anon key only; never put a service key in this repo).
