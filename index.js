/**
 * GitHub 加速代理 — Cloudflare Worker
 * =====================================
 * 语法：ES Module（2026 年 Cloudflare 推荐格式，新版编辑器不会弹弃用警告）
 *
 * 支持两种链接格式：
 *   1. 域名前缀式：https://你的worker.workers.dev/github.com/user/repo/...
 *   2. 完整URL式：https://你的worker.workers.dev/https://github.com/user/repo/...
 *
 * 支持的 GitHub 域名：
 *   github.com（Release/Archive 下载、git clone）
 *   raw.githubusercontent.com（Raw 文件）
 *   gist.github.com / api.github.com（API，可配 Token 提升限额）
 *   codeload.github.com（git clone 实际数据通道）
 *   objects.githubusercontent.com（Release 文件实际存储）
 *
 * 首页特性：中英双语切换 + 深浅色主题跟随系统（可手动切换，sessionStorage 记忆）
 *
 * 可选环境变量（在控制台 Settings → Variables and Secrets 里配置，Type 选 Secret）：
 *   GITHUB_TOKEN — GitHub Personal Access Token，API 限额从 60次/小时 提升到 5000次/小时
 */

// 允许代理的域名白名单（防止被滥用为任意站点代理）
const ALLOWED_HOSTS = new Set([
  'github.com',
  'raw.githubusercontent.com',
  'gist.github.com',
  'api.github.com',
  'codeload.github.com',
  'objects.githubusercontent.com',
])

export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env)
  },
}


async function handleRequest(request, env) {
  const url = new URL(request.url)

  // ---- 首页 ----
  if (url.pathname === '/' || url.pathname === '') {
    return new Response(homePage(url.origin), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }

  // ---- 解析目标地址 ----
  let targetUrl = null

  if (url.pathname.startsWith('/https://') || url.pathname.startsWith('/http://')) {
    // 格式二：完整 URL 式 /https://github.com/user/repo/...
    targetUrl = url.pathname.slice(1) + url.search
  } else {
    // 格式一：域名前缀式 /github.com/user/repo/...
    const rest = url.pathname.slice(1)
    const host = rest.split('/')[0]
    if (ALLOWED_HOSTS.has(host)) {
      targetUrl = 'https://' + rest + url.search
    }
  }

  if (!targetUrl) {
    return jsonResponse(
      { error: '不支持的地址。用法：/github.com/user/repo/... 或 /https://github.com/user/repo/...' },
      400,
    )
  }

  // ---- 构造转发请求 ----
  const headers = new Headers(request.headers)
  headers.delete('CF-Connecting-IP')
  headers.delete('X-Forwarded-For')

  // 如果配置了 GITHUB_TOKEN，自动附加到 GitHub 请求（提升 API 限额）
  const targetHost = new URL(targetUrl).hostname
  if (env.GITHUB_TOKEN && targetHost.endsWith('github.com')) {
    headers.set('Authorization', `Bearer ${env.GITHUB_TOKEN}`)
  }

  const method = request.method
  const init = { method, headers, redirect: 'follow' }
  if (method !== 'GET' && method !== 'HEAD') {
    init.body = request.body
  }

  let response
  try {
    response = await fetch(new Request(targetUrl, init))
  } catch (err) {
    return jsonResponse({ error: '上游请求失败', detail: err.message }, 502)
  }

  // ---- 构建响应 ----
  const resHeaders = new Headers(response.headers)
  resHeaders.set('Access-Control-Allow-Origin', '*')
  resHeaders.set('X-Proxy-By', 'gh-proxy-worker')

  return new Response(response.body, {
    status: response.status,
    headers: resHeaders,
  })
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}


// ---- 首页 HTML（中英双语 + 深浅色主题跟随系统）----
function homePage(workerUrl) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <title>GitHub 加速代理</title>
  <style>
    :root {
      color-scheme: light;
      --bg-grad-a: #667eea; --bg-grad-b: #764ba2;
      --container-bg: #ffffff;
      --text-main: #333; --text-sub: #666; --footer: #999;
      --box-bg: #f6f8fa; --border: #e1e4e8;
      --code-bg: #e8eaed; --code-text: #24292f;
      --accent: #667eea; --accent-hover: #5568d3;
      --input-border: #d0d7de;
      --result-bg: #e8f5e9; --link: #2e7d32;
      --proxy-color: #d6336c;
    }
    :root.dark {
      color-scheme: dark;
      --bg-grad-a: #2b2e58; --bg-grad-b: #3d2a55;
      --container-bg: #1e2028;
      --text-main: #e6e6e6; --text-sub: #a0a0a8; --footer: #7a7a84;
      --box-bg: #2a2c36; --border: #3a3d48;
      --code-bg: #31343e; --code-text: #e6e6e6;
      --accent: #7c8cf8; --accent-hover: #9aa6ff;
      --input-border: #3a3d48;
      --result-bg: #1d2f21; --link: #7ee787;
      --proxy-color: #ff9ec4;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
      background: linear-gradient(135deg, var(--bg-grad-a) 0%, var(--bg-grad-b) 100%);
      min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px;
    }
    .container {
      background: var(--container-bg); border-radius: 16px; padding: 40px; max-width: 720px; width: 100%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .header-row { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 8px; flex-wrap: wrap; }
    h1 { color: var(--text-main); font-size: 24px; }
    .badge {
      display: inline-block; background: #28a745; color: white; font-size: 11px;
      padding: 2px 8px; border-radius: 12px; margin-left: 8px; vertical-align: middle;
    }
    .controls { display: flex; gap: 8px; }
    .pill {
      background: var(--box-bg); border: 1px solid var(--border); color: var(--text-sub);
      border-radius: 16px; padding: 4px 12px; font-size: 12px; cursor: pointer;
    }
    .pill:hover { border-color: var(--accent); color: var(--text-main); }
    .subtitle { color: var(--text-sub); margin-bottom: 24px; font-size: 14px; }
    .box { background: var(--box-bg); border: 1px solid var(--border); border-radius: 8px; padding: 16px; margin-bottom: 16px; }
    .box h3 { font-size: 14px; color: var(--text-main); margin-bottom: 8px; }
    .box p { color: var(--text-sub); font-size: 14px; margin-bottom: 8px; }
    code {
      background: var(--code-bg); color: var(--code-text); padding: 2px 6px; border-radius: 4px;
      font-size: 13px; font-family: 'SF Mono', 'Fira Code', Consolas, monospace; word-break: break-all;
    }
    .proxy-prefix { color: var(--proxy-color); font-weight: 700; }
    .url-input { display: flex; gap: 8px; margin-top: 12px; }
    .url-input input {
      flex: 1; min-width: 0; padding: 10px 14px; border: 2px solid var(--input-border); border-radius: 8px;
      font-size: 14px; outline: none; background: var(--container-bg); color: var(--text-main);
    }
    .url-input input:focus { border-color: var(--accent); }
    .url-input button {
      padding: 10px 20px; background: var(--accent); color: white; border: none;
      border-radius: 8px; cursor: pointer; font-size: 14px; white-space: nowrap;
    }
    .url-input button:hover { background: var(--accent-hover); }
    /* 窄屏：输入框与按钮改为上下堆叠，避免溢出卡片；16px 防止 iOS 聚焦自动放大 */
    @media (max-width: 480px) {
      .container { padding: 24px 20px; }
      .url-input { flex-direction: column; }
      .url-input input { font-size: 16px; }
      .url-input button { width: 100%; }
    }
    .result { margin-top: 12px; padding: 12px; background: var(--result-bg); border-radius: 8px; display: none; word-break: break-all; font-size: 14px; }
    .result a { color: var(--link); }
    ul { padding-left: 20px; color: var(--text-sub); font-size: 14px; line-height: 2; }
    .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border); font-size: 12px; color: var(--footer); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header-row">
      <h1><span data-i18n="title">🚀 GitHub 加速代理</span> <span class="badge">Free</span></h1>
      <div class="controls">
        <button class="pill" id="langBtn" onclick="toggleLang()">EN</button>
        <button class="pill" id="themeBtn" onclick="cycleTheme()">🌓</button>
      </div>
    </div>
    <p class="subtitle" data-i18n="subtitle">通过 Cloudflare 全球 CDN 加速 GitHub 文件下载</p>

    <div class="box">
      <h3 data-i18n="usageTitle">📋 使用方法</h3>
      <p data-i18n="usageDesc">在 GitHub 链接前加上代理地址（彩色部分就是要加的前缀）：</p>
      <code><span class="proxy-prefix">${workerUrl}</span>/github.com/user/repo/releases/download/v1.0/file.zip</code>
    </div>

    <div class="box">
      <h3 data-i18n="convertTitle">🔗 在线转换</h3>
      <div class="url-input">
        <input type="text" id="urlInput" data-i18n-ph="placeholder" placeholder="粘贴 GitHub 链接..." />
        <button onclick="convert()" data-i18n="convertBtn">加速</button>
      </div>
      <div class="result" id="result"></div>
    </div>

    <div class="box">
      <h3 data-i18n="scenesTitle">📦 支持的场景</h3>
      <ul>
        <li data-i18n="scene1">Release / Archive 下载</li>
        <li data-i18n="scene2">Raw 文件（raw.githubusercontent.com）</li>
        <li data-i18n="scene3">git clone 加速</li>
        <li data-i18n="scene4">API 请求代理（api.github.com）</li>
      </ul>
    </div>

    <div class="footer" data-i18n="footer">基于 Cloudflare Workers 构建 · 免费 · 10 万次请求/天</div>
  </div>

  <script>
    // ===== 多语言 =====
    var I18N = {
      zh: {
        title: '🚀 GitHub 加速代理',
        subtitle: '通过 Cloudflare 全球 CDN 加速 GitHub 文件下载',
        usageTitle: '📋 使用方法',
        usageDesc: '在 GitHub 链接前加上代理地址（彩色部分就是要加的前缀）：',
        convertTitle: '🔗 在线转换',
        placeholder: '粘贴 GitHub 链接...',
        convertBtn: '加速',
        scenesTitle: '📦 支持的场景',
        scene1: 'Release / Archive 下载',
        scene2: 'Raw 文件（raw.githubusercontent.com）',
        scene3: 'git clone 加速',
        scene4: 'API 请求代理（api.github.com）',
        footer: '基于 Cloudflare Workers 构建 · 免费 · 10 万次请求/天',
        resultPrefix: '✅ 加速链接：',
        themeAuto: '跟随系统', themeLight: '浅色', themeDark: '深色'
      },
      en: {
        title: '🚀 GitHub Acceleration Proxy',
        subtitle: 'Speed up GitHub file downloads via the Cloudflare global CDN',
        usageTitle: '📋 How to Use',
        usageDesc: 'Add the proxy address before your GitHub link (the colored part is the prefix to add):',
        convertTitle: '🔗 Online Converter',
        placeholder: 'Paste a GitHub link...',
        convertBtn: 'Accelerate',
        scenesTitle: '📦 Supported Scenarios',
        scene1: 'Release / Archive downloads',
        scene2: 'Raw files (raw.githubusercontent.com)',
        scene3: 'git clone acceleration',
        scene4: 'API request proxy (api.github.com)',
        footer: 'Built on Cloudflare Workers · Free · 100,000 requests/day',
        resultPrefix: '✅ Accelerated link: ',
        themeAuto: 'Auto', themeLight: 'Light', themeDark: 'Dark'
      }
    };

    var lang = sessionStorage.getItem('gh-lang') ||
      ((navigator.language || 'zh').toLowerCase().indexOf('zh') === 0 ? 'zh' : 'en');

    function t(key) { return I18N[lang][key] || key; }

    function applyLang() {
      var nodes = document.querySelectorAll('[data-i18n]');
      for (var i = 0; i < nodes.length; i++) {
        nodes[i].textContent = t(nodes[i].getAttribute('data-i18n'));
      }
      var phs = document.querySelectorAll('[data-i18n-ph]');
      for (var j = 0; j < phs.length; j++) {
        phs[j].placeholder = t(phs[j].getAttribute('data-i18n-ph'));
      }
      document.getElementById('langBtn').textContent = (lang === 'zh') ? 'EN' : '中文';
      document.documentElement.lang = (lang === 'zh') ? 'zh-CN' : 'en';
      applyTheme();
    }

    function toggleLang() {
      lang = (lang === 'zh') ? 'en' : 'zh';
      sessionStorage.setItem('gh-lang', lang);
      applyLang();
    }

    // ===== 主题（auto 跟随系统 → light → dark 循环）=====
    var mode = sessionStorage.getItem('gh-theme') || 'auto';
    var mq = window.matchMedia('(prefers-color-scheme: dark)');

    function isDark() { return mode === 'dark' || (mode === 'auto' && mq.matches); }

    function applyTheme() {
      document.documentElement.classList.toggle('dark', isDark());
      var label = (mode === 'auto') ? t('themeAuto') : (mode === 'light' ? t('themeLight') : t('themeDark'));
      document.getElementById('themeBtn').textContent = (isDark() ? '🌙 ' : '☀️ ') + label;
    }

    function cycleTheme() {
      mode = (mode === 'auto') ? 'light' : (mode === 'light' ? 'dark' : 'auto');
      sessionStorage.setItem('gh-theme', mode);
      applyTheme();
    }

    var mqListener = function () { if (mode === 'auto') applyTheme(); };
    if (mq.addEventListener) { mq.addEventListener('change', mqListener); }
    else if (mq.addListener) { mq.addListener(mqListener); }

    // ===== 在线转换 =====
    function convert() {
      var input = document.getElementById('urlInput').value.trim();
      if (!input) return;
      var proxyUrl = '${workerUrl}';
      var accelerated;
      if (input.indexOf('http://') === 0 || input.indexOf('https://') === 0) {
        var u = new URL(input);
        accelerated = proxyUrl + '/' + u.hostname + u.pathname + u.search;
      } else {
        accelerated = proxyUrl + '/' + input;
      }
      var head = accelerated.slice(0, proxyUrl.length);
      var tail = accelerated.slice(proxyUrl.length);
      var div = document.getElementById('result');
      div.style.display = 'block';
      div.innerHTML = t('resultPrefix') + '<a href="' + accelerated + '" target="_blank"><span class="proxy-prefix">' + head + '</span>' + tail + '</a>';
    }

    document.getElementById('urlInput').addEventListener('keypress', function (e) { if (e.key === 'Enter') convert(); });

    applyLang();
  </script>
</body>
</html>`
}
