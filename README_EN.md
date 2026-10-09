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

> Browser only, about 3 minutes; a free account is enough, no credit card needed.

1. Sign up / log in at [dash.cloudflare.com](https://dash.cloudflare.com)
2. In the left sidebar, click **Workers & Pages** (it sits under the **Compute & AI** group; the newest dashboard may label the group **Compute (Workers)** — same place; if you can't find it, just open the [official direct link](https://dash.cloudflare.com/?to=/:account/workers-and-pages))
3. Click **Create application** (top right) → you'll see 5 options: **Connect GitHub**, **Connect GitLab**, **Start with Hello World**, **Select a template**, **Upload your static files** — pick **Start with Hello World** (it just creates a bare Worker with default code, which we'll replace entirely in the next step); if your dashboard still shows the older **Create Worker** card, click that instead
4. On the naming screen, replace the random default name (like `bold-leaf-1234`) with something memorable (e.g. `gh-proxy-lite`) → click **Deploy**
5. Once deployed, click **Edit Code** to open the editor; if you don't see the button, go back to the Workers & Pages list, click your Worker's name, then click **Edit Code** (top right)
6. In the editor, select all the default code (`Ctrl+A`, or `Cmd+A` on Mac) and delete it
7. Open [`index.js`](index.js) in this repo and click the **Copy raw contents** icon next to the **Raw** button (top right of the file view) to copy everything — or click **Raw**, then `Ctrl+A` → `Ctrl+C` — and paste it into the editor
8. Click **Deploy** (top right) and wait for the success message (if a confirmation dialog pops up, just click **Deploy** once more)
9. Go back to the Workers & Pages list, click your Worker's name → **Settings → Domains & Routes** — you'll see your dedicated URL, like `https://gh-proxy-lite.your-subdomain.workers.dev` (the middle part is the subdomain auto-assigned to your account, so the address is *not* just `workers.dev`)
10. Open it in a browser — seeing this project's homepage means it works 🎉

## 📖 Usage

> The examples use `https://gh-proxy-lite.your-subdomain.workers.dev` as a stand-in for your proxy address. Replace it with your own full URL (like `https://gh-proxy-lite.abc123.workers.dev` — visible in **Settings → Domains & Routes** on your Worker's page; the middle part is the subdomain auto-assigned to your account).

### Two URL formats

| Format | Pattern | Note |
|---|---|---|
| Domain-prefix | `https://gh-proxy-lite.your-subdomain.workers.dev/github.com/user/repo/...` | Recommended |
| Full-URL | `https://gh-proxy-lite.your-subdomain.workers.dev/https://github.com/user/repo/...` | Just prepend the worker URL |

### Examples

```bash
# Release downloads (wget / curl)
wget https://gh-proxy-lite.your-subdomain.workers.dev/github.com/user/repo/releases/download/v1.0/app.zip

# Raw files
curl -O https://gh-proxy-lite.your-subdomain.workers.dev/raw.githubusercontent.com/user/repo/main/config.json

# Faster git clone
git clone https://gh-proxy-lite.your-subdomain.workers.dev/github.com/user/repo.git
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
