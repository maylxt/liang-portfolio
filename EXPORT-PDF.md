# 作品集 PDF 导出说明

**网站文件不会被修改。** PDF 由脚本打开本地网站并导出，保留封面、关于我、作品与排版。

## 推荐：网站完整版（与网页一致）

```bash
cd "/Users/bytedance/Desktop/网页设计0511-2 (6)"
npm install
npm run pdf
```

输出文件：

`exports/梁小婷-作品集-网站完整版-2026-v5.pdf`（按区块截图拼接，避免页底空白黑页）

- 横版 A4 分页
- 含 Hero 封面、简历、AI 人像、案例、视觉探索、特效、联系
- 对比图导出为 After 效果

## 首页「下载简历」PDF（关于我 + 联系）

合并网站「关于我」与「联系」区块，**不改动主站页面**，输出到右上角下载链接：

```bash
npm run pdf:resume
```

输出：`assets/resume-liangxiaoting-13522341227.pdf`（横版 A4 · 深色 editorial 风格 · 关于我 + 底部微信/电话/邮箱，供 `下载简历` 按钮使用）

## 备用：精简文字版

```bash
npm run pdf:simple
```

输出：`exports/梁小婷-作品集简历-2026.pdf`（独立排版页，非网站截图）

## 手动导出网站

1. 在项目目录启动本地服务，例如：`python3 -m http.server 8080`
2. 浏览器打开 `http://localhost:8080`
3. 等待页面完全加载后 `⌘P` → 存储为 PDF → 勾选「背景图形」

## 说明

- 动图/GIF 在 PDF 中为静态首帧
- 视频区域显示当前帧或 poster
- 首次 `npm install` 需联网下载 Chromium（约 3 分钟）
