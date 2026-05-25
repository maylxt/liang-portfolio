# GitHub + Vercel 部署指南

## 一、在 GitHub 创建仓库

1. 打开 [github.com/new](https://github.com/new)
2. **Repository name**：例如 `liang-portfolio`（自定）
3. 选 **Private** 或 **Public**
4. **不要**勾选 “Add a README”
5. 点 **Create repository**
6. 记下仓库地址，例如：`https://github.com/你的用户名/liang-portfolio.git`

---

## 二、把本地项目推到 GitHub

在终端执行（把 `你的用户名/仓库名` 换成你的）：

```bash
cd "/Users/bytedance/Desktop/网页设计0511-2 (6)"

# 若尚未初始化（本项目已可跳过 init）
git init
git add .
git status
git commit -m "Portfolio site ready for deploy"

git branch -M main
git remote add origin https://github.com/你的用户名/liang-portfolio.git
git push -u origin main
```

第一次 `git push` 会要求登录 GitHub（浏览器或 Personal Access Token）。

> **说明**：`assets/` 约 230MB，首次上传可能需几分钟，属正常情况。

---

## 三、在 Vercel 部署

1. 打开 [vercel.com](https://vercel.com) → 用 GitHub 登录
2. **Add New…** → **Project**
3. **Import** 你刚创建的仓库
4. 配置保持默认即可：
   - **Framework Preset**：Other
   - **Root Directory**：`./`（根目录）
   - **Build Command**：留空
   - **Output Directory**：留空或 `.`
5. 点 **Deploy**
6. 约 1–3 分钟后得到地址：`https://xxx.vercel.app`

---

## 四、部署后必做

1. 浏览器打开 Vercel 给的链接，全站走查一遍
2. 编辑 `index.html`，把两处 `YOUR-DOMAIN` 改成你的 Vercel 域名或自定义域名，例如：
   - `https://liang-portfolio.vercel.app/`
   - `https://liang-portfolio.vercel.app/assets/case-ai-lighting-cover.png`
3. 保存后 `git add index.html && git commit -m "Fix OG URLs" && git push`
4. Vercel 会自动重新部署（约 1 分钟）

---

## 五、以后如何更新网站

```bash
# 改完本地文件后
git add .
git commit -m "更新说明"
git push
```

Vercel 会自动构建并上线，无需手动上传。

更新简历 PDF 后，记得把新 PDF 一并 `git add assets/` 再 push。

---

## 六、绑定自己的域名（可选）

1. Vercel 项目 → **Settings** → **Domains**
2. 填入你的域名，按提示在域名服务商添加 DNS 记录
3. 生效后，把 `index.html` 里 `YOUR-DOMAIN` 改成该域名

---

## 常见问题

| 问题 | 处理 |
|------|------|
| `git push` 很慢 | `assets` 较大，等完成即可 |
| 页面空白 | 确认 Root Directory 为仓库根目录，且含 `index.html` |
| 改代码线上没变 | 强刷 `Cmd+Shift+R`，或等 Vercel 部署完成 |
| 下载简历 404 | 确认 `assets/resume-liangxiaoting-13522341227.pdf` 已提交并 push |
