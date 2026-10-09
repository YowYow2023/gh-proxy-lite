# AGENTS.md

Guidance for AI coding assistants (and humans) working on this repository.

## What this is

**gh-proxy-lite** — a single-file GitHub acceleration proxy running as a Cloudflare Worker.

Positioning is deliberate: **minimal** (~190 lines, one file, zero dependencies, zero bindings, zero config). It is the lightweight alternative to heavyweight projects like Aethersailor/cf-ghproxy-worker (~1500 lines). Feature requests that add weight (caching, rate limiting, smart HTTP, PAT auth flows) should be declined by default — that's the other project's territory. Copy-paste deploy must keep working.

## Architecture

- `index.js` — the entire codebase. Two halves:
  - **Proxy logic** (top of file): ES Module `fetch` handler. Parses the path (two accepted formats: domain-prefix `/github.com/...` and full-URL `/https://github.com/...`), validates the target host against the `ALLOWED_HOSTS` allowlist, fetches upstream with `redirect: 'follow'` (release downloads 302 to `objects.githubusercontent.com`), streams the body back.
  - **`homePage()`** (bottom): bilingual (zh/en) homepage with light/dark themes following the system. i18n via the `I18N` dict + `data-i18n` / `data-i18n-ph` attributes; themes via CSS variables (`:root` / `:root.dark`); link converter highlights the proxy prefix with `span.proxy-prefix`.
- `wrangler.jsonc` — deploy config; intentionally has **no bindings**.
- `README.md` (Chinese) + `README_EN.md` (English) — mirrored content, must stay in sync.
- `package.json` — metadata + `GITHUB_TOKEN` binding description for the deploy button flow, not a build system.

## Hard rules

1. **One file, no dependencies, no build step.** Do not introduce npm packages, bundlers, or extra source files.
2. **The allowlist is a security feature.** Only GitHub domains may be proxied. Never widen it to arbitrary hosts.
3. **Zero config must always work.** `env.GITHUB_TOKEN` is the only optional binding (stored as a Secret). Everything must function with no configuration at all.
4. **i18n parity.** The zh and en dictionaries must have identical keys; every visible homepage string goes through i18n, not hardcoded text.
5. **Verify before committing:** `node --check index.js` must pass. If homepage HTML/JS changed, also check both languages and both themes render correctly (dark-mode prefix color `#ff9ec4`, light `#d6336c`, no background on the highlight so underlines stay continuous).
6. **Deployment docs must match the real current Cloudflare dashboard** — never write UI steps from memory. The dashboard changes frequently (e.g. old "Triggers" is now Settings → Domains & Routes; creation is Compute & AI → Workers & Pages → Create application → Create Worker). Verify online against current official docs before writing or updating deploy instructions.
7. **Bilingual READMEs update together.** Any change to one requires the mirrored change to the other.
8. Commit style: short imperative subject line. Push to `origin main` when a change is complete.

## Deployment context

- The **Deploy to Cloudflare** button (in both READMEs) clones this repo into the deployer's own GitHub account and builds via Workers Builds — future pushes to that clone auto-redeploy.
- The owner's own live worker was deployed **manually** (paste code in Edit Code); it does **not** auto-sync with this repo. After changes here, remind the owner to update their live worker manually (or set up Workers Builds).
- Runs on the Cloudflare Workers **free plan**: 100,000 requests/day. Avoid paid-only features.
