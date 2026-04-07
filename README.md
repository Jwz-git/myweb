# Jwz's Blog

基于 Vue 3 + Vite 构建的个人博客，极简现代暗色主题。

## 技术栈

- **Vue 3** — Composition API + `<script setup>`
- **Vite 7** — 构建工具
- **Vue Router 4** — 客户端路由（Hash 模式）
- **markdown-it** — Markdown 渲染
- **highlight.js** — 代码语法高亮
- **KaTeX** — 数学公式渲染
- **纯手写 CSS** — 无 UI 框架依赖

## 本地开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
npm run preview
```

## 部署

推送到 `main` 或 `master` 分支后，GitHub Actions 会自动构建并部署到 GitHub Pages。

## 项目结构

```
src/
├── main.js              # 应用入口
├── App.vue              # 根组件
├── router.js            # 路由配置
├── styles/              # 全局样式
│   ├── variables.css    # CSS 变量（设计系统）
│   ├── global.css       # 全局重置与排版
│   └── article.css      # Markdown 文章样式
├── components/          # 可复用组件
│   ├── NavBar.vue       # 导航栏
│   ├── Footer.vue       # 页脚
│   └── MusicPlayer.vue  # 音乐播放器
├── pages/               # 页面组件
│   ├── Home.vue         # 首页
│   ├── ArticleList.vue  # 文章列表
│   ├── ArticleDetail.vue# 文章详情
│   ├── FriendLink.vue   # 友情链接
│   ├── About.vue        # 关于
│   └── NotFound.vue     # 404
└── data/                # 静态数据
    ├── articles.js      # 文章元数据
    ├── friendlink.js    # 友链数据
    └── music.js         # 音乐列表
```

## 添加新文章

1. 将 Markdown 文件放入 `public/md/` 目录
2. 在 `src/data/articles.js` 中添加对应的文章元数据
3. （可选）将封面图放入 `public/image/` 目录

## 添加新音乐

1. 将 MP3 文件放入 `public/music/` 目录
2. 在 `src/data/music.js` 中添加歌曲信息
