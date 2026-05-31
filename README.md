# MEDIHUB Website

Marketing + admin website for MEDIHUB, built as a fast static single-page app.
Admin content (doctors, services, announcements, etc.) is managed in-browser and
stored in the visitor's `localStorage` — there is no backend to deploy.

## Tech stack

- Vite
- TypeScript
- React + React Router
- Tailwind CSS + shadcn/ui
- Framer Motion

## Run locally

Requires Node.js & npm.

```sh
npm install        # install dependencies
npm run dev        # start dev server at http://localhost:8080
```

## Build for production

```sh
npm run build      # outputs the finished site into the dist/ folder
npm run preview    # (optional) preview the production build locally
```

Everything you upload to your web host lives inside **`dist/`** after the build.

## Deploy to shared hosting (cPanel / LiteSpeed / Apache)

1. Run `npm run build`.
2. Open the **contents** of the `dist/` folder (not the folder itself).
3. Upload everything inside `dist/` into your host's web root (usually
   `public_html`), including the hidden `.htaccess` file.
4. The included `.htaccess` makes deep links (e.g. `/about`, `/services`,
   `/admin`) work and keeps the admin area out of search engines.

To update the live site later: change the code, run `npm run build` again, and
re-upload the new `dist/` contents.
