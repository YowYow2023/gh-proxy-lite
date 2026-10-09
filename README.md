# 🚀 gh-proxy-lite

[English](README_EN.md) | 中文

轻量的 GitHub 加速代理 —— 单文件 Cloudflare Worker。
**零配置、零绑定、零构建**，复制粘贴即可部署，代码约 190 行，小白也能读懂、能改。

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/YOUR_GITHUB_USERNAME/gh-proxy-lite)

## ✨ 特性

- 🪶 **轻量**：单文件、无依赖、无构建步骤，部署完不用管
- ⚡ **一键部署**：点一下按钮，Cloudflare 自动把仓库克隆到**你自己的** GitHub 账号并部署
- 🌍 **全球加速**：请求经 Cloudflare 边缘网络中转，绕开直连 GitHub 的拥堵链路
- 🔗 **全场景**：Release / Archive 下载、Raw 文件、`git clone`、GitHub API
- 🛡️ **域名白名单**：只代理 GitHub 系域名，不会被滥用成任意站点代理
- 🌐 **双语首页**：中英切换 + 深浅色主题跟随系统，带在线链接转换器
- 🆓 **免费**：跑在 Cloudflare Workers 免费套餐上（每天 10 万次请求）

## 🚀 一键部署（推荐）

> 前提：GitHub 账号 + Cloudflare 账号（免费版即可），全程无需信用卡。

1. 点击上方 **Deploy to Cloudflare** 按钮
2. 授权 Cloudflare 访问你的 GitHub 账号
3. Cloudflare 会把本仓库**克隆到你自己的 GitHub 账号下**（可以改名）
4. 在设置页确认 Worker 名称，点击部署
5. 完成 🎉 之后你往这个仓库推送更新，Worker 会自动重新部署

## ✋ 手动部署（不想点按钮也行）

1. 登录 [dash.cloudflare.com](https://dash.cloudflare.com)
2. 左侧菜单找到 **Compute & AI（计算与 AI）** 分组 → **Workers & Pages**
3. 点右上角 **Create application（创建应用程序）**，选 **Create Worker** 卡片
4. 修改名称（比如 `gh-proxy-lite`）→ 点击 **Deploy（部署）**
5. 部署成功后点击 **Edit Code（编辑代码）**
6. 删掉编辑器里的默认代码，粘贴本仓库 [`index.js`](index.js) 的全部内容
7. 点击右上角 **Deploy（部署）**
8. 打开 `https://<你的Worker名>.workers.dev` —— 看到首页即成功

## 📖 使用

### 两种链接格式

| 格式 | 写法 | 说明 |
|---|---|---|
| 域名前缀式 | `https://你的worker.workers.dev/github.com/user/repo/...` | 推荐，直观 |
| 完整 URL 式 | `https://你的worker.workers.dev/https://github.com/user/repo/...` | 整条链接直接拼 |

### 常用示例

```bash
# Release 下载（wget / curl）
wget https://你的worker.workers.dev/github.com/user/repo/releases/download/v1.0/app.zip

# Raw 文件
curl -O https://你的worker.workers.dev/raw.githubusercontent.com/user/repo/main/config.json

# git clone 加速
git clone https://你的worker.workers.dev/github.com/user/repo.git
```

也可以直接打开 Worker 首页，粘贴链接在线转换（首页支持中英切换和深浅色主题）。

### 支持的域名

| 域名 | 用途 |
|---|---|
| `github.com` | Release / Archive 下载、git clone |
| `raw.githubusercontent.com` | Raw 文件（配置、脚本、图片） |
| `gist.github.com` | Gist |
| `api.github.com` | GitHub API（可配 Token 提升限额） |
| `codeload.github.com` | git clone 数据通道 |
| `objects.githubusercontent.com` | Release 文件实际存储 |

## 🔧 可选：配置 GitHub Token

只加速**公开**仓库 → 什么都不用配。

需要高频调用 `api.github.com` → 配置 Token 可以把限额从 **60 次/小时** 提升到 **5000 次/小时**：

1. GitHub → Settings → Developer settings → Personal access tokens 生成一个只读 Token
2. Cloudflare 控制台 → 你的 Worker → **Settings** → **Variables and Secrets** → **Add**
3. Type 选 **Secret**，Name 填 `GITHUB_TOKEN`，Value 填 Token
4. 重新部署后生效

## 🆚 想要更多功能？

本仓库专注「够用、可读、零配置」。如果你需要**边缘缓存、IP 限流、私有仓库（PAT）、Git Smart HTTP** 等进阶能力，可以看看体量更大的 [Aethersailor/cf-ghproxy-worker](https://github.com/Aethersailor/cf-ghproxy-worker)（约 1500 行）。按需选择即可。

## ❓ 常见问题

| 问题 | 答案 |
|---|---|
| 免费额度是多少？ | Workers 免费套餐每天 10 万次请求，个人使用绰绰有余 |
| 下载大文件支持断点续传吗？ | 支持（Range 请求透传） |
| 想用自己的域名？ | 把域名托管到 Cloudflare 后：Worker → **Settings** → **Domains & Routes** → **Add** → **Custom Domain** |
| 部署后代码要更新怎么办？ | 一键部署用户：往你账号下克隆出来的仓库推送即可自动更新；手动部署用户：重新进 Edit Code 粘贴新代码 |
| 安全吗？ | 白名单机制保证它只能代理 GitHub 系域名；Token 是 Secret 存储，不会暴露在代码里 |

## ⚠️ 说明

- 仅供个人学习与加速用途，请勿用于大规模流量或商业场景
- GitHub 本身的限制（如 Release 附件大小）不因代理而改变

## 📄 许可证

[MIT](LICENSE) —— 随便用、随便改，保留版权声明即可。
