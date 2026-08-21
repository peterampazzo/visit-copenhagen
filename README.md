# Hygge i København

A small Copenhagen guide for friends and family, in English and Italian.

## Work locally

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

The production-ready static site is generated in `dist/`.

## Edit the guide

- Copy: `src/locales/en/guide.yaml` and `src/locales/it/guide.yaml`
- Map locations: `src/data/locations.yaml`

Keep English and Italian keys aligned. English is the fallback language.

## Deploys

GitHub Actions builds and uploads the static site to Cloudflare Pages:

| Event                    | Destination                               |
| ------------------------ | ----------------------------------------- |
| Push to `main`           | Cloudflare Pages preview branch `preview` |
| Published GitHub release | Cloudflare Pages production branch `main` |

One-time setup in GitHub repository **Settings → Secrets and variables → Actions**:

- Secret `CLOUDFLARE_API_TOKEN`: Cloudflare API token with **Account / Cloudflare Pages / Edit** permission.
- Variable `CLOUDFLARE_ACCOUNT_ID`: the Cloudflare account ID.
- Variable `CLOUDFLARE_PROJECT_NAME`: `visit-copenhagen`.

In Cloudflare Pages, disconnect the existing Git integration (or disable its automatic deployments); otherwise a push to `main` would also trigger Cloudflare’s normal production deploy, bypassing the preview workflow.

To publish, create a GitHub release from the commit you want to ship. The release workflow deploys that exact tag to production.
