# 作品集上线部署说明

## 上线前检查清单

- [x] React 生产版（`index.html`）
- [x] 已移除 Tweaks 调试面板
- [x] 简历 PDF：`assets/resume-liangxiaoting-13522341227.pdf`
- [ ] 本地预览：`python3 -m http.server 8080` → `http://localhost:8080`
- [ ] 部署后把 `index.html` 里 `og:url`、`og:image` 的域名改成你的正式地址

## 需要上传的文件

```
index.html
styles.css
app.jsx
components/
assets/
robots.txt
```

**不要上传：** `node_modules/`、`scripts/`、`exports/`、`tweaks-panel.jsx`、`resume-download.html`、`package.json`

## 方式一：Vercel（推荐，免费 HTTPS）

1. 把项目推到 GitHub（或 GitLab）
2. 打开 [vercel.com](https://vercel.com) → Import 仓库
3. **Framework Preset** 选 **Other**，**Root Directory** 保持项目根目录
4. **Build Command** 留空，**Output Directory** 填 `.` 或留空（静态根目录）
5. Deploy → 获得 `https://xxx.vercel.app`
6. 可在 Vercel 设置里绑定自己的域名

## 方式二：Cloudflare Pages

1. 连接 Git 仓库
2. Build command：留空  
3. Build output directory：`/`（项目根目录即站点根目录）
4. 部署后绑定域名

## 方式三：国内静态托管（阿里云 OSS / 腾讯云 COS）

1. 把上述文件上传到 Bucket
2. 开启「静态网站托管」，默认首页 `index.html`
3. 绑定 CDN + 域名，开启 HTTPS
4. 注意：国外 CDN 访问 Google Fonts 可能慢，必要时改自托管字体

## 部署后必做

1. 用正式域名打开全站，测导航、下载简历、手机端
2. 修改 `index.html` 中 Open Graph 绝对地址（搜索 `YOUR-DOMAIN`）：
   - `og:url`
   - `og:image`
3. 微信分享预览：把链接发到文件传输助手，看标题/摘要/封面是否正常

## 更新简历 PDF

```bash
npm run pdf:resume
```

生成后重新上传 `assets/resume-liangxiaoting-13522341227.pdf`。

## 更新完整作品集 PDF（可选）

```bash
npm run pdf
```

输出见 `EXPORT-PDF.md`。
