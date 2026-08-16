# Copenhagen Connect

A mobile-first Copenhagen guide for friends and family, available in English and Italian.

The site is a static Vite + React application. Its guide content lives in YAML files, and the
interactive map runs entirely in the browser.

## Local development

Use pnpm for all package management commands.

```bash
pnpm install
pnpm dev
```

The editable guide content is stored in:

- `src/locales/en/guide.yaml`
- `src/locales/it/guide.yaml`
- `src/data/locations.yaml`

## Production build

```bash
pnpm build
```

The deployable static site is generated in `dist/`.

To check the production build locally:

```bash
pnpm preview
```

## Cloudflare Pages

For a Git-connected Pages project, use:

- Build command: `pnpm build`
- Build output directory: `dist`
- Root directory: leave empty

For a manual direct upload, upload the contents generated in `dist/`. No Worker entry point,
server bundle, compatibility flag, or Wrangler configuration is required.

The files in `public/` are copied into the root of `dist/`. This includes the Cloudflare Pages
redirect and caching rules in `public/_redirects` and `public/_headers`.
