# Cloudflare Pages 部署支持

本目录专为部署至 **Cloudflare Pages**（获取不受干扰的 `*.pages.dev` 域名）而准备，保持主根目录纯净无多余构建配置。

## 部署说明

在 Cloudflare 控制台连接 GitHub 仓库创建 Pages 项目时，只需设置：

1. **Framework preset（框架预设）**：`None`
2. **Build command（构建命令）**：留空
3. **Build output directory（构建输出目录）**：`cloudflare-pages`
4. **Environment variables（可选）**：如有需要可添加 `GITHUB_TOKEN`

内部通过 `_worker.js` 直接复用项目根目录的 [`index.js`](../index.js)，无需重复维护核心代码。
