# 🚀 gh-proxy-lite

English | [中文](README.md)

A lightweight GitHub acceleration proxy — a single-file Cloudflare Worker.
**Zero config, zero bindings, zero build step.** Deploy by copy & paste; ~190 lines of readable code you can actually tweak.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/YowYow2023/gh-proxy-lite)

## ✨ Features

- 🪶 **Lightweight**: one file, no dependencies, no build step — deploy and forget
- ⚡ **One-click deploy**: click the button and Cloudflare clones the repo into **your own** GitHub account, then deploys
- 🌍 **Global acceleration**: requests are relayed through Cloudflare's edge network, bypassing congested direct routes to GitHub
- 🔗 **Full coverage**: Release / Archive downloads, raw files, `git clone`, and the GitHub API
- 🛡️ **Domain allowlist**: only GitHub domains are proxied — it can't be abused as an open proxy
- 🌐 **Bilingual homepage**: Chinese/English toggle + light/dark theme following your system, with a built-in link converter
- 🆓 **Free**: runs on the Cloudflare Workers free plan (100,000 requests/day)

## 🚀 One-Click Deploy (Recommended)

> Prerequisites: a GitHub account + a Cloudflare account (free plan is fine). No credit card required.

1. Click the **Deploy to Cloudflare** button above
2. Authorize Cloudflare to access your GitHub account
3. Cloudflare clones this repository into **your own** GitHub account (you can rename it)
4. Confirm the Worker name on the setup page, then deploy
5. Done 🎉 From now on, pushing updates to your cloned repo automatically redeploys the Worker

## ✋ Manual Deploy (No Button)

1. Log in at [dash.cloudflare.com](https://dash.cloudflare.com)
2. In the left sidebar, find the **Compute & AI** group → **Workers & Pages**
3. Click **Create application** (top right) and pick the **Create Worker** card
4. Change the name (e.g. `gh-proxy-lite`) → click **Deploy**
5. Once deployed, click **Edit Code**
6. Delete the default code and paste the entire contents of [`index.js`](index.js) from this repo
7. Click **Deploy** (top right)
8. Open `https://<your-worker>.workers.dev` — seeing the homepage means it works

## 📖 Usage

### Two URL formats

| Format | Pattern | Note |
|---|---|---|
| Domain-prefix | `https://your-worker.workers.dev/github.com/user/repo/...` | Recommended |
| Full-URL | `https://your-worker.workers.dev/https://github.com/user/repo/...` | Just prepend the worker URL |

### Examples

```bash
# Release downloads (wget / curl)
wget https://your-worker.workers.dev/github.com/user/repo/releases/download/v1.0/app.zip

# Raw files
curl -O https://your-worker.workers.dev/raw.githubusercontent.com/user/repo/main/config.json

# Faster git clone
git clone https://your-worker.workers.dev/github.com/user/repo.git
```

Or open the Worker homepage and use the built-in converter (supports Chinese/English and light/dark themes).

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
2. In the Cloudflare dashboard: your Worker → **Settings** → **Variables and Secrets** → **Add**
3. Choose Type **Secret**, Name `GITHUB_TOKEN`, Value = your token
4. Redeploy to apply

## 🆚 Need more?

This repo focuses on "just enough, readable, zero-config". If you need **edge caching, IP rate limiting, private repos (PAT), or Git Smart HTTP**, take a look at the larger [Aethersailor/cf-ghproxy-worker](https://github.com/Aethersailor/cf-ghproxy-worker) (~1500 lines). Pick whatever fits.

## ❓ FAQ

| Question | Answer |
|---|---|
| What's the free quota? | The Workers free plan allows 100,000 requests/day — plenty for personal use |
| Are large-file resumable downloads supported? | Yes (Range requests are passed through) |
| Can I use my own domain? | Host the domain on Cloudflare, then: Worker → **Settings** → **Domains & Routes** → **Add** → **Custom Domain** |
| How do I update the code later? | One-click deploy users: just push to your cloned repo (auto redeploys). Manual deploy users: open Edit Code and paste the new code |
| Is it safe? | The allowlist means it only proxies GitHub domains; your token is stored as a Secret, never in code |

## ⚠️ Notes

- For personal learning and acceleration only — please don't use it for heavy traffic or commercial purposes
- GitHub's own limits (e.g. release attachment sizes) are unchanged by proxying

## 📄 License

[MIT](LICENSE) — use it, change it, keep the copyright notice.
