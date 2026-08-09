# Jwz's Blog

一个以 Markdown 为内容源的 Vue 3 博客，支持两种部署形态：

- **GitHub Pages**：纯静态阅读、搜索、筛选、主题、RSS 与 SEO。
- **VPS**：在静态功能之上增加 GitHub 登录、评论、点赞、浏览统计、写作界面和管理后台。

文章长期保存在 Git 仓库中。构建脚本负责校验 Front Matter，并生成文章数据、搜索索引、RSS、站点地图和 SEO 文件。项目未集成 AI、向量检索或问答功能。

## 技术栈

| 模块 | 技术 |
| --- | --- |
| Web | Vue 3、Vue Router、Vite、Markdown-it、KaTeX、Highlight.js |
| API | Node.js、TypeScript、Fastify |
| 数据库 | PostgreSQL 16 |
| 部署 | GitHub Actions、Nginx、Docker Compose |
| 测试 | Vitest、Playwright、ESLint |

## 项目结构

```text
apps/
├── web/                 # Vue/Vite 前端
└── api/                 # Fastify API、数据库访问和迁移
packages/
├── content/             # Front Matter 校验、索引与 SEO 生成工具
└── shared/              # 前后端共享类型
content/
└── articles/            # Markdown 文章
deploy/
├── nginx/               # Nginx 配置
└── compose/             # Compose、数据库备份脚本
e2e/                     # Playwright 端到端测试
```

## 环境要求

- Node.js 20
- npm 10 或更高版本
- Docker Desktop / Docker Engine（完整 VPS 模式需要）
- GitHub OAuth App（登录功能需要）

## 安装

```bash
npm install
```

## 本地开发

### 纯静态模式

```bash
npm run dev
```

默认地址为 `http://localhost:4000`。该模式与 GitHub Pages 功能范围一致，不显示登录、评论、点赞、写作和管理入口。

### 仅预览 VPS 前端界面

PowerShell：

```powershell
$env:VITE_BASE_PATH = "/"
$env:VITE_SERVER_FEATURES = "true"
npm run content:build
npm run dev -w @jwz/web -- --host 0.0.0.0
```

此命令只启用 VPS 专属界面，**不会启动 API 和 PostgreSQL**。登录、评论、点赞、统计及管理请求需要完整服务栈。

### 完整 VPS 模式

先创建环境配置：

```bash
cp .env.example .env
```

Windows PowerShell：

```powershell
Copy-Item .env.example .env
```

填写 `.env` 后启动：

```bash
docker compose -f deploy/compose/docker-compose.yml up -d --build
```

查看状态和日志：

```bash
docker compose -f deploy/compose/docker-compose.yml ps
docker compose -f deploy/compose/docker-compose.yml logs -f
```

停止服务：

```bash
docker compose -f deploy/compose/docker-compose.yml down
```

Compose 会启动：

```text
浏览器 → Nginx :80
          ├── Vue 静态文件
          └── /api/* → Fastify :3000 → PostgreSQL
```

## 环境变量

```env
# PostgreSQL 密码，请使用长随机字符串
POSTGRES_PASSWORD=replace-with-a-long-random-password

# GitHub OAuth App
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# 以逗号分隔的管理员 GitHub 数字 ID
ADMIN_GITHUB_IDS=

# 生产环境公开地址
API_PUBLIC_URL=https://example.com
WEB_PUBLIC_URL=https://example.com
ALLOWED_ORIGINS=https://example.com
```

GitHub OAuth App 的回调地址应设置为：

```text
https://example.com/api/v1/auth/github/callback
```

生产环境应启用 HTTPS，因为登录会话使用 `HttpOnly`、`Secure`、`SameSite=Lax` Cookie。

当前端与 API 分开部署时，再为 Web 构建设置：

```env
VITE_API_BASE_URL=https://api.example.com
```

同域部署时保持为空，请求会通过 Nginx 的 `/api/` 反向代理转发。

## 添加文章

在 `content/articles/` 中创建 Markdown 文件：

```yaml
---
title: 文章标题
slug: article-slug
date: 2026-08-09
updated: 2026-08-09
type: 知识
tags:
  - Vue
  - 笔记
cover: /image/cover.png
coverPosition: center
summary: 可选手写摘要
draft: false
featured: false
series: null
---
```

正文直接写在 Front Matter 之后。公开路由为：

```text
/articles/:slug
```

注意事项：

- `slug` 是文章唯一公开标识，只能包含小写字母、数字和连字符。
- 图片放在 `apps/web/public/image/`，Front Matter 使用 `/image/文件名` 引用。
- 未填写 `summary` 时，构建脚本会从正文自动提取摘要。
- `draft: true` 的文章会在生产构建中排除。
- 必填字段缺失、日期错误、slug 重复或资源不存在都会终止构建。

## 内容构建

```bash
# 生成开发环境内容数据
npm run content:build

# 只执行内容校验
npm run content:check
```

内容管线会生成：

- 文章、标签、分类和系列索引
- 客户端全文搜索索引
- RSS
- `sitemap.xml`
- `robots.txt`
- GitHub Pages 的 `404.html`
- 页面 SEO 元数据和文章 JSON-LD 所需数据

## 构建

```bash
# GitHub Pages，base path 为 /Blog/
npm run build:pages

# VPS，base path 为 /，并启用服务端功能入口
npm run build:vps
```

构建产物位于 `apps/web/dist/`。

## 质量检查

```bash
npm run lint
npm run typecheck
npm test
npx playwright test
```

建议提交前执行：

```bash
npm run content:check
npm run lint
npm run typecheck
npm test
npm run build:pages
npm run build:vps
npx playwright test
```

## VPS 功能

- GitHub OAuth 登录与退出
- HttpOnly Cookie 会话
- 文章浏览统计
- 登录用户点赞与评论
- 评论编辑和删除
- 管理员评论审核、用户封禁与数据概览
- VPS 专属写作界面、Markdown 预览和文章包导出
- API 限流、Origin 校验、评论清理和请求体限制

API 统一使用 `/api/v1`。健康检查地址为：

```text
GET /api/v1/health
```

## 数据库备份

备份脚本位于：

```text
deploy/compose/backup.sh
```

生产环境建议每日执行备份，将文件同步到独立存储，并定期在空数据库中验证恢复流程。数据库迁移前也应先生成备份。

## 部署说明

### GitHub Pages

推送到 `main` 后，GitHub Actions 使用 `/Blog/` 子路径构建并发布。Pages 版本保持纯静态运行，API 缺席时不会显示服务端功能入口。

### VPS

Nginx 负责静态资源、History 路由回退和 `/api/` 反向代理。生产部署还应配置：

- TLS 证书和 HTTPS 跳转
- 数据库备份任务
- 日志轮转
- 防火墙，仅公开 80/443
- 上一版本静态产物或镜像，用于快速回滚

## 常见问题

### VPS 专属入口出现了，但接口返回 404

只设置 `VITE_SERVER_FEATURES=true` 会显示 VPS 界面，并不会启动 API。使用 Docker Compose 启动完整服务栈，或在本地开发服务器中配置 `/api` 到 Fastify 的代理。

### 刷新文章页后由服务器返回 404

History 路由需要服务器回退到 `index.html`。仓库中的 Nginx 配置已经包含该规则；其他 Web 服务器需要配置等价的 SPA fallback。

### GitHub 登录后没有会话

检查 OAuth 回调地址、公开域名和 HTTPS，并确认 `API_PUBLIC_URL`、`WEB_PUBLIC_URL`、`ALLOWED_ORIGINS` 与实际域名一致。
