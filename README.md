# 葉承均 ｜ Yeh Cheng Chun — Personal Site

個人網站，使用 **Astro 5 + Tailwind CSS v4** 建置。

---

## 🚀 第一次跑起來

### 1. 安裝 Node.js（如尚未安裝）

PowerShell（建議用 winget）：

```powershell
winget install OpenJS.NodeJS.LTS
```

或到 [nodejs.org](https://nodejs.org) 下載 LTS 版本。**安裝後請重啟終端機**。

驗證：

```powershell
node -v   # 應顯示 v20.x 或更新
npm -v
```

### 2. 安裝專案依賴

```powershell
npm install
```

### 3. 啟動開發伺服器

```powershell
npm run dev
```

瀏覽器開啟 [http://localhost:4321](http://localhost:4321)。修改任何檔案會自動 hot reload。

### 4. 建置靜態檔案（部署用）

```powershell
npm run build
```

產出在 `dist/` 資料夾，可直接拖去 Vercel / Netlify / Cloudflare Pages 等任何靜態主機。

```powershell
npm run preview   # 預覽建置結果
```

---

## 📁 專案結構

```
.
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro      共用 HTML 框架（head、header、footer、互動腳本）
│   ├── components/
│   │   ├── Header.astro          上方導覽列（自動標記目前頁）
│   │   └── Footer.astro          底部
│   ├── pages/                    每個 .astro 對應一個路由
│   │   ├── index.astro           /
│   │   ├── about.astro           /about
│   │   ├── portfolio.astro       /portfolio
│   │   ├── blog.astro            /blog
│   │   └── blog/welcome.astro    /blog/welcome
│   └── styles/
│       └── global.css            Tailwind v4 + 設計 token + 全部 component CSS
├── public/                       靜態檔（直接 serve，不經 build）
├── astro.config.mjs              Astro + Tailwind 設定
├── tsconfig.json                 TypeScript 嚴格模式
├── package.json
└── legacy 區（舊版 HTML）        index.html / about.html / portfolio.html
                                  blog.html / blog/welcome.html
                                  css/ js/  ← Astro 跑起來確認 OK 後可刪
```

---

## 🎨 設計系統

**字體**：Inter（拉丁）+ Noto Sans TC（繁中）+ JetBrains Mono（標籤 / 數字）

**色彩**（CSS 變數，皆暗色系）：
- `--color-bg` `#0a0a0c` 主背景
- `--color-surface` `#14141b` 卡片底
- `--color-text` `#f5f5f7` 主文字
- `--color-accent-1` `#fb923c`（橘）
- `--color-accent-2` `#ec4899`（粉）
- `--color-accent-3` `#8b5cf6`（紫）
- `--gradient`：上述三色 135° 線性漸層

修改方法：編輯 [src/styles/global.css](src/styles/global.css) 開頭的 `@theme { ... }` 區塊。

**互動**：
- Mobile 漢堡選單
- 滾動進場淡入（`.reveal` class + IntersectionObserver）
- 首頁 stats 數字滾動 count-up

腳本在 [src/layouts/BaseLayout.astro](src/layouts/BaseLayout.astro) 底部的 `<script>` 區。

---

## ✍️ 加新文章

1. 複製 [src/pages/blog/welcome.astro](src/pages/blog/welcome.astro) → `src/pages/blog/your-slug.astro`
2. 改 `title`、`description`、`<h1>`、日期、內文
3. 編輯 [src/pages/blog.astro](src/pages/blog.astro) 的 `posts` 陣列，把佔位符換成新文章資料：
   ```js
   {
     href: '/blog/your-slug',
     date: '2026.06.01',
     title: '新文章標題',
     excerpt: '一句話摘要。',
     placeholder: false,
   }
   ```
4. 也更新 [src/pages/index.astro](src/pages/index.astro) 的「最新文章」清單（最上面三筆）。

> 未來可改用 Astro Content Collections 自動管理。現階段檔案還少，手動陣列足夠。

---

## 🚢 部署

### Vercel（最推薦）

1. 把專案 push 到 GitHub
2. 到 [vercel.com](https://vercel.com) 登入 → Add New → Project → Import
3. Framework Preset 會自動偵測為 Astro，不需任何設定
4. Deploy

自訂網域：Dashboard → Project → Settings → Domains → 加入你的網域（例如 `me.dongyu.company`），按指示到 DNS 註冊商加 CNAME。

### Netlify

1. push 到 GitHub
2. [netlify.com](https://netlify.com) → Add new site → Import from GitHub
3. Build command：`npm run build`，Publish directory：`dist`
4. Deploy

### Cloudflare Pages / GitHub Pages

也都可以，build command 同上：`npm run build`，輸出 `dist/`。

---

## 🧹 舊檔清理（可選）

確認 Astro 版跑起來沒問題後，可移除舊的靜態 HTML：

```powershell
Remove-Item index.html, about.html, portfolio.html, blog.html
Remove-Item blog\welcome.html
Remove-Item css -Recurse
Remove-Item js -Recurse
```

---

## 🛠 常見指令速查

```powershell
npm install          # 安裝依賴
npm run dev          # 開發模式（localhost:4321）
npm run build        # 建置（產出 dist/）
npm run preview      # 預覽 build 結果
npm run astro check  # 型別檢查
```
