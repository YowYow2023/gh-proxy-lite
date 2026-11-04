# Cloudflare Pages 部署支持

本目录专为部署至 **Cloudflare Pages**（获取直连访问的 `*.pages.dev` 域名）而准备，保持主根目录纯净无多余构建配置。

## 部署说明

1. 登录 Cloudflare 控制台，展开左侧 **Compute（计算）** 菜单进入 **Workers & Pages**。
2. 点击 **Create application（创建应用程序）**，滑到底部点击 **“继续前往 Pages（Continue to Pages）”**，选择 **Connect to Git** 关联你的仓库。
3. 构建参数设置：
   - **Framework preset（框架预设）**：`None`
   - **Build command（构建命令）**：留空
   - **Build output directory（构建输出目录）**：`cloudflare-pages`
   - **Environment variables（可选）**：如有需要可添加 `GITHUB_TOKEN`

内部通过 `_worker.js` 直接复用项目根目录的 [`index.js`](../index.js)，无需重复维护核心代码。
