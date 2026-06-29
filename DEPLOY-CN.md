# 国内部署指南（腾讯云 / 阿里云）

让作品集在**国内网络**稳定访问。海外可继续用 [Vercel](https://liang-portfolio-five.vercel.app/)，国内用本指南部署到腾讯云或阿里云。

> **已选腾讯云？** 直接看 **[DEPLOY-TENCENT.md](./DEPLOY-TENCENT.md)**（逐步操作清单，从买域名到 CDN HTTPS）。  
> 备选阿里云见 [DEPLOY-ALIYUN.md](./DEPLOY-ALIYUN.md)。

---

## 上线前准备

### 1. 域名 + ICP 备案（必做）

国内 CDN / 对象存储绑定**自己的域名**并提供 HTTPS，需要先在服务商完成 **ICP 备案**（约 7–20 个工作日）。

| 步骤 | 说明 |
|------|------|
| 购买域名 | 阿里云万网、腾讯云 DNSPod 等，建议 `.com` / `.cn` |
| 发起备案 | 在对应云控制台 → **备案** → 按指引提交身份证、核验 |
| 备案通过 | 获得备案号，才能绑定域名到国内 CDN |

> 未备案时只能先用存储桶的**默认域名**（测试用），不适合正式分享。

### 2. 项目已做的国内优化

- 字体：自托管在 `assets/fonts/`（不再依赖 Google Fonts）
- React / Babel：自托管在 `vendor/`（不再依赖 unpkg）
- 上传后**不依赖任何境外 CDN**，国内可正常打开

### 3. 需要上传的文件

```
index.html
styles.css
app.jsx
robots.txt
components/
assets/          ← 含图片、PDF、视频（约 40MB+）
vendor/
```

**不要上传：** `node_modules/`、`scripts/`、`.tmp_mv_frames/`、`package.json`

本地打包上传（可选）：

```bash
cd "网页设计0511-2 (6)"
zip -r site-cn.zip index.html styles.css app.jsx robots.txt components assets vendor -x "*.DS_Store"
```

---

## 方案 A：腾讯云 COS + CDN（推荐）

适合：已有或打算用腾讯云账号、备案在腾讯云。

### 步骤 1：创建存储桶

1. 登录 [腾讯云 COS 控制台](https://console.cloud.tencent.com/cos)
2. **创建存储桶**
   - 地域：选离用户近的（如 **北京** / **上海**）
   - 访问权限：**公有读私有写**
   - 版本：标准存储

### 步骤 2：开启静态网站

1. 进入桶 → **基础配置** → **静态网站**
2. 开启，**索引文档**：`index.html`
3. **错误文档**（可选）：`index.html`（单页应用式回退）

### 步骤 3：上传文件

- 控制台 **文件列表** → 上传上述目录
- 或使用 [COSCLI](https://cloud.tencent.com/document/product/436/63143)：

```bash
coscli cp -r ./index.html ./styles.css ./app.jsx ./robots.txt cos://你的桶名/
coscli cp -r ./components cos://你的桶名/components
coscli cp -r ./assets cos://你的桶名/assets
coscli cp -r ./vendor cos://你的桶名/vendor
```

保持目录结构与本地一致（`index.html` 在桶根目录）。

### 步骤 4：绑定 CDN + 域名 + HTTPS

1. [CDN 控制台](https://console.cloud.tencent.com/cdn) → **添加域名**
2. **加速域名**：如 `www.liangxiaoting.design`
3. **源站类型**：COS 源 → 选择刚创建的桶
4. **回源协议**：HTTPS（若 COS 未开 HTTPS，先用 HTTP）
5. 按提示在 DNS 添加 **CNAME** 到 CDN 分配的域名
6. CDN → **HTTPS 配置** → 申请免费 SSL 证书并开启强制 HTTPS

### 步骤 5：简历 PDF 下载（可选）

Vercel 用 `vercel.json` 设置了 PDF 附件头。腾讯云可在 CDN **回源配置** 或 **边缘函数** 中对路径  
`/assets/resume-liangxiaoting-13522341227.pdf` 添加响应头：

```
Content-Disposition: attachment; filename="梁小婷-简历.pdf"
```

若未配置，PDF 仍可在浏览器内打开，只是下载体验略差。

### 费用参考

- COS 存储 + 流量：静态站每月通常 **几元～几十元**（视频较大时流量为主）
- CDN 按流量计费，可买流量包

---

## 方案 B：阿里云 OSS + CDN

适合：备案在阿里云，或已有 OSS 使用经验。

### 步骤 1：创建 Bucket

1. [OSS 控制台](https://oss.console.aliyun.com/) → **创建 Bucket**
2. 地域：华东 / 华北等
3. **读写权限**：公共读
4. **版本控制**：按需

### 步骤 2：静态网站托管

1. Bucket → **基础设置** → **静态页面**
2. 默认首页：`index.html`
3. 默认 404 页：`index.html`（可选）

### 步骤 3：上传文件

控制台上传，或 [ossutil](https://help.aliyun.com/document_detail/120075.html)：

```bash
ossutil cp -r index.html styles.css app.jsx robots.txt oss://你的桶名/
ossutil cp -r components oss://你的桶名/components
ossutil cp -r assets oss://你的桶名/assets
ossutil cp -r vendor oss://你的桶名/vendor
```

### 步骤 4：CDN 加速 + 域名

1. [CDN 控制台](https://cdn.console.aliyun.com/) → **添加域名**
2. **业务类型**：图片小文件 / 全站加速均可
3. **源站**：OSS 域名（外网 Endpoint）
4. DNS 添加 CNAME → 开启 **HTTPS**（免费证书）

### 步骤 5：跨域（一般不需要）

本站为纯静态，同源加载 JSX，通常无需 CORS。若控制台有报错再按需配置。

---

## 部署后必做

### 1. 修改 `index.html` 中的分享地址

把 `og:url`、`og:image`、`canonical` 改成**国内正式 HTTPS 域名**：

```html
<meta property="og:url" content="https://www.你的域名/" />
<meta property="og:image" content="https://www.你的域名/assets/case-ai-lighting-cover.png" />
<link rel="canonical" href="https://www.你的域名/" />
```

重新上传 `index.html`（或整站同步）。

### 2. 全站自测清单

- [ ] 国内 4G / WiFi 打开首页（无白屏）
- [ ] 切换主题、滚动各区块
- [ ] AIGC 视频可播放
- [ ] 手机端布局正常
- [ ] 简历 PDF 可下载
- [ ] 微信「文件传输助手」发链接，预览图/标题正常

### 3. 双线路策略（推荐）

| 受众 | 地址 |
|------|------|
| 国内 HR / 微信分享 | `https://www.你的备案域名` |
| 海外 | `https://liang-portfolio-five.vercel.app` |

简历、作品集简介里可写国内域名；GitHub / LinkedIn 可继续用 Vercel。

更新站点后：**两边都要重新上传**（或只维护 GitHub → Vercel 自动部署，国内手动同步 zip）。

---

## 更新站点

1. 本地改代码
2. 若改过字体依赖：`npm run vendor:fonts`
3. 重新上传变更文件到 COS / OSS（或全量覆盖）
4. CDN 控制台 **刷新 URL 缓存**（尤其 `index.html`、`*.jsx`、`styles.css`）

---

## 常见问题

**Q：备案期间能先测吗？**  
可以用 COS/OSS **默认测试域名**（控制台静态网站地址），仅自己访问，不要对外正式推广。

**Q：视频 40MB+ 会不会很慢？**  
首次加载会慢一些。可在 CDN 开 **Range 请求**、压缩图片；长远可考虑视频放腾讯视频 / B 站外链（需改代码）。

**Q：腾讯云和阿里云选哪个？**  
备案在哪边就优先用哪边，流程更顺。两者对静态站都够用。

**Q：还要买 `liangxiaoting.design` 吗？**  
可以。在域名注册商购买后，把 DNS 解析到国内 CDN 的 CNAME，并在备案里填写该域名即可。

---

## 相关文档

- 海外部署：`DEPLOY.md`、`GITHUB-VERCEL.md`
- 简历 PDF 更新：`npm run pdf:resume`
