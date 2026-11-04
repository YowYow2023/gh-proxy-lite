# 🚀 gh-proxy-lite

English | [中文](README.md)

A lightweight GitHub acceleration proxy — a single-file Cloudflare Worker / Pages application.
**Zero config, zero bindings, zero build step.** Deploy via copy & paste or Git connection; ~190 lines of readable code you can actually tweak.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/YowYow2023/gh-proxy-lite)

## ✨ Features

- 🪶 **Lightweight**: one file, no dependencies, no build step — deploy and forget
- ⚡ **Multiple Deployment Modes**: supports Cloudflare Pages (recommended for global direct access) and Workers one-click deploy
- 🌍 **Global acceleration**: requests are relayed through Cloudflare's edge network, bypassing congested direct routes to GitHub
- 🔗 **Full coverage**: Release / Archive downloads, raw files, `git clone`, and the GitHub API
- 🛡️ **Domain allowlist**: only GitHub domains are proxied — it cannot be abused as an open proxy
- 🌐 **Bilingual homepage**: Chinese/English toggle + light/dark theme following your system, with a built-in link converter
- 🆓 **Free**: runs on the Cloudflare free tier (100,000 requests/day)

## 🚀 Deployment Options

This project offers two deployment approaches to choose from:
- **Cloudflare Pages (Recommended)**: assigns a `*.pages.dev` domain, providing smoother direct connectivity across diverse network regions.
- **Cloudflare Workers**: assigns a `*.workers.dev` domain, supporting one-click template cloning and web-based copy-paste deployment.

---

### Option A: Cloudflare Pages Deployment (Recommended for Direct Global Access)

> Get a dedicated `https://your-project.pages.dev` URL with superior direct network connectivity.

1. Click **Fork** at the top right of this repository to copy it to your own GitHub account
2. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com)
3. In the left sidebar, expand the **Compute** menu and click **Workers & Pages**
4. Click **Create application** (top right)
5. ⚠️ **Locate the Pages option**: Scroll down to the bottom of the creation page, find and click **"Looking for Pages? Continue to Pages"**, then select **"Import an existing Git repository"**
6. Select **GitHub**, authorize, select your forked `gh-proxy-lite` repository, and click **Begin setup**
7. Configure the build settings (minimal & straightforward):
   - **Project name**: choose your desired name (e.g. `gh-proxy-lite`)
   - **Framework preset**: keep `None`
   - **Build command**: **Leave empty** (no build command needed)
   - **Build output directory**: Enter **`cloudflare-pages`**
8. Click **Save and Deploy**. In about a minute, your dedicated `https://your-project.pages.dev` URL is live 🎉

---

### Option B: Cloudflare Workers One-Click Deploy

> Get a dedicated `https://gh-proxy-lite.your-subdomain.workers.dev` URL.

1. Click the **Deploy to Cloudflare** button above
2. Authorize Cloudflare to access your GitHub account
3. Cloudflare clones this repository into **your own** GitHub account (you can rename it)
4. Confirm the Worker name on the setup page, then deploy
5. Done 🎉 Pushing updates to your cloned repo will automatically redeploy the Worker

---

### Option C: Cloudflare Workers Manual Deploy (No Git required)

> Browser only, about 3 minutes; a free account is enough, no credit card needed.

1. Sign up / log in at [dash.cloudflare.com](https://dash.cloudflare.com)
2. In the left sidebar, expand the **Compute** menu and click **Workers & Pages** (or use the [official direct link](https://dash.cloudflare.com/?to=/:account/workers-and-pages))
3. Click **Create application** (top right) → select **Start with Hello World** (creates a bare Worker with template code to be replaced)
4. Replace the random default name (like `bold-leaf-1234`) with something memorable (e.g. `gh-proxy-lite`) → click **Deploy**
5. Once deployed, click **Edit Code** to open the editor; if not visible, return to the Workers & Pages list, click your Worker, then click **Edit Code**
6. Select all default code (`Ctrl+A` or `Cmd+A` on Mac) and delete it
7. Open [`index.js`](index.js) in this repo, copy all code, and paste it into the Cloudflare editor
8. Click **Deploy** (top right)
9. Navigate to your Worker's **Settings → Domains & Routes** to view your dedicated URL, like `https://gh-proxy-lite.your-subdomain.workers.dev`
10. Open it in your browser — seeing this project's homepage confirms success 🎉

---

## 📖 Usage

> The examples use `https://your-domain/` as a placeholder (works identically with Pages `*.pages.dev` or Workers `*.workers.dev`).

### Two URL formats

| Format | Pattern | Note |
|---|---|---|
| Domain-prefix | `https://your-domain/github.com/user/repo/...` | Recommended, intuitive |
| Full-URL | `https://your-domain/https://github.com/user/repo/...` | Prepend the proxy URL |

### Examples

```bash
# Release downloads (wget / curl)
wget https://your-domain/github.com/user/repo/releases/download/v1.0/app.zip

# Raw files
curl -O https://your-domain/raw.githubusercontent.com/user/repo/main/config.json

# Faster git clone
git clone https://your-domain/github.com/user/repo.git
```

You can also open the homepage and use the built-in converter (supports Chinese/English and light/dark themes).

### Supported domains

| Domain | Used for |
|---|---|
| `github.com` | Release / Archive downloads, git clone |
| `raw.githubusercontent.com` | Raw files (configs, scripts, images) |
| `gist.github.com` | Gists |
| `api.github.com` | GitHub API (pair with a token for higher limits) |
| `codeload.github.com` | git clone data channel |
| `objects.githubusercontent.com` | Release asset storage |

## 🔧 Optional: GitHub Token

Only accelerating **public** repos? You don't need a token at all.

Calling `api.github.com` heavily? A token raises the rate limit from **60/hour** to **5000/hour**:

1. On GitHub: Settings → Developer settings → Personal access tokens → generate a read-only token
2. In Cloudflare Dashboard for your Worker or Pages project:
   - **Worker**: **Settings** → **Variables and Secrets** → **Add**
   - **Pages**: **Settings** → **Environment variables** → **Add variable**
3. Set Name to `GITHUB_TOKEN`, Value to your token
4. Save and redeploy to apply

## 🆚 Need more?

This repo focuses on "just enough, readable, zero-config". If you need **edge caching, IP rate limiting, private repos (PAT), or Git Smart HTTP**, take a look at the larger [Aethersailor/cf-ghproxy-worker](https://github.com/Aethersailor/cf-ghproxy-worker) (~1500 lines). Pick whatever fits.

## ❓ FAQ

| Question | Answer |
|---|---|
| What is the free quota? | The Cloudflare free tier allows 100,000 requests/day — plenty for personal use |
| What is the difference between `*.pages.dev` and `*.workers.dev`? | The core proxy functionality and code are identical. Due to regional network connectivity differences with `workers.dev`, Pages deployment is recommended for a smoother direct global access experience |
| Are large-file resumable downloads supported? | Yes (Range requests are passed through) |
| Can I use my own domain? | Yes. Host your domain on Cloudflare, then add a **Custom Domain** under Settings for maximum long-term stability |
| How do I update the code later? | Pages / One-click users: pushing to your GitHub repo automatically redeploys. Manual deploy users: open Edit Code and paste updated code |
| Is it safe? | The allowlist ensures only GitHub domains are proxied; tokens are stored as Secrets, never in plain code |

## ⚠️ Notes

- For personal learning and acceleration only — please don't use it for heavy traffic or commercial purposes
- GitHub's own limits (e.g. release attachment sizes) are unchanged by proxying

## 📄 License

[MIT](LICENSE) — use it, change it, keep the copyright notice.
