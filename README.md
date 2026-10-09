# 🚀 gh-proxy-lite

[English](README_EN.md) | 中文

轻量的 GitHub 加速代理 —— 单文件 Cloudflare Worker。
**零配置、零绑定、零构建**，复制粘贴即可部署，代码约 190 行，小白也能读懂、能改。

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/YowYow2023/gh-proxy-lite)

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

> 只需浏览器，全程约 3 分钟；免费账号即可，无需信用卡。

1. 注册并登录 [Cloudflare 控制台](https://dash.cloudflare.com)
2. 在左侧菜单点击 **Workers & Pages**（入口位于 **Compute & AI** 分组下；新版控制台可能改叫 **Compute (Workers)**，是同一个地方；实在找不到就直接打开[官方直达链接](https://dash.cloudflare.com/?to=/:account/workers-and-pages)）
3. 点右上角 **Create application（创建应用程序）** → 会出现 5 个选项：**Connect GitHub**、**Connect GitLab**、**Start with Hello World**、**Select a template**、**Upload your static files**，选 **Start with Hello World**（即创建一个带默认代码的空白 Worker，下一步把代码整个换成我们的）；如果你看到的还是旧版的 **Create Worker** 卡片，直接点它即可
4. 在命名页把默认的随机名（形如 `bold-leaf-1234`）改成好记的名字（例如 `gh-proxy-lite`）→ 点击 **Deploy（部署）**
5. 部署完成后点击 **Edit Code（编辑代码）** 进入编辑器；没看到这个按钮就回到 Workers & Pages 列表，点你的 Worker 名进入，再点右上角 **Edit Code**
6. 在编辑器里按 `Ctrl+A`（Mac 为 `Cmd+A`）全选默认代码，删除
7. 打开本仓库的 [`index.js`](index.js) 文件页，点右上角 **Raw** 按钮旁的复制图标 **Copy raw contents（复制原始文件）** 复制全部代码（或点 Raw 打开后 `Ctrl+A` → `Ctrl+C`），粘贴到编辑器
8. 点编辑器右上角 **Deploy（部署）**，等待出现部署成功的提示（若弹出确认窗口，再点一次 Deploy 确认即可）
9. 回到 Workers & Pages 列表，点你的 Worker 名 → **Settings（设置）→ Domains & Routes（域与路由）**，可以看到你的专属地址，形如 `https://gh-proxy-lite.你的子域名.workers.dev`——注意中间一段是注册账号时自动分配的**账号子域名**，所以网址不是只有 `workers.dev`
10. 在浏览器打开这个地址，看到本项目的首页即部署成功 🎉

## 📖 使用

> 下文示例统一用 `https://gh-proxy-lite.你的子域名.workers.dev` 代表你的代理地址。请替换成你自己的完整域名（形如 `https://gh-proxy-lite.abc123.workers.dev`，可在 Worker 的 **Settings → Domains & Routes** 页面看到），中间一段是账号注册时自动分配的子域名。

### 两种链接格式

| 格式 | 写法 | 说明 |
|---|---|---|
| 域名前缀式 | `https://gh-proxy-lite.你的子域名.workers.dev/github.com/user/repo/...` | 推荐，直观 |
| 完整 URL 式 | `https://gh-proxy-lite.你的子域名.workers.dev/https://github.com/user/repo/...` | 整条链接直接拼 |

### 常用示例

```bash
# Release 下载（wget / curl）
wget https://gh-proxy-lite.你的子域名.workers.dev/github.com/user/repo/releases/download/v1.0/app.zip

# Raw 文件
curl -O https://gh-proxy-lite.你的子域名.workers.dev/raw.githubusercontent.com/user/repo/main/config.json

# git clone 加速
git clone https://gh-proxy-lite.你的子域名.workers.dev/github.com/user/repo.git
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
