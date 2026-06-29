# 阿里云部署指南（OSS + CDN）

作品集国内访问方案：**阿里云 OSS 存文件 + CDN 加速 + 备案域名 HTTPS**。

海外地址继续用：https://liang-portfolio-five.vercel.app/

---

## 总览（你要做的事）

```
① 注册阿里云 + 实名认证
② 购买域名（万网）
③ ICP 备案（7～20 工作日，可同步上传测试）
④ 创建 OSS Bucket → 上传网站文件
⑤ 开启静态网站托管
⑥ CDN 绑定域名 + 免费 HTTPS 证书
⑦ 改 index.html 分享地址 → 国内自测
```

预计费用：**域名 ~60 元/年 + OSS/CDN 流量几元～几十元/月**（视频约 40MB，访问量不大时很便宜）。

---

## 第一步：账号与域名

### 1.1 注册与实名

1. 打开 https://www.aliyun.com/ 注册账号
2. 控制台右上角 → **实名认证**（个人：身份证；需与备案信息一致）

### 1.2 购买域名

1. 打开 [阿里云域名](https://wanwang.aliyun.com/)
2. 搜索并购买，例如 `liangxiaoting.design` 或 `liangxiaoting.cn`
3. 购买后在 **域名控制台** → 该域名 → **解析设置**（备案通过后再改 CDN 的 CNAME）

### 1.3 ICP 备案（必做，否则不能正式绑 HTTPS 域名）

1. 控制台搜索 **ICP 备案** → 进入备案系统
2. 选择 **首次备案**
3. 填写：
   - 主体：个人
   - 网站名称：如「梁小婷作品集」（避免纯个人姓名，按页面提示填）
   - 域名：刚买的域名
   - 服务器：**选阿里云 OSS / 云产品**（静态站选「阿里云 OSS」或按向导选「不在阿里云购买服务器」→ 对象存储）
4. 按指引完成 **阿里云 App 人脸核验**
5. 等待管局审核（通常 **7～20 个工作日**）

> 备案审核期间可以先把文件传到 OSS，用**测试域名**自己预览，不要对外发链接。

---

## 第二步：创建 OSS 并上传网站

### 2.1 创建 Bucket

1. 打开 [OSS 控制台](https://oss.console.aliyun.com/)
2. **创建 Bucket**，建议设置：

| 配置项 | 建议值 |
|--------|--------|
| Bucket 名称 | 全局唯一，如 `liang-portfolio-cn` |
| 地域 | **华东 1（杭州）** 或离你最常待的城市 |
| 存储类型 | 标准存储 |
| 读写权限 | **公共读**（静态网站必须） |
| 版本控制 | 关闭（个人站够用） |

### 2.2 开启静态网站托管

1. 进入 Bucket → 左侧 **数据管理** → **静态页面**
2. **开通** 静态页面功能
3. **默认首页**：`index.html`
4. **默认 404 页**：`index.html`（可选，防止深链 404）
5. 记下页面上的 **访问 Endpoint**（测试用，形如 `http://liang-portfolio-cn.oss-cn-hangzhou.aliyuncs.com`）

### 2.3 上传文件

**方式 A：控制台（最简单）**

1. Bucket → **文件管理** → **上传**
2. 上传以下内容，**保持目录结构**（`index.html` 在根目录，不要多一层文件夹）：

```
index.html
styles.css
app.jsx
robots.txt
components/     （整个文件夹）
assets/         （整个文件夹，约 277MB）
vendor/         （整个文件夹）
```

**方式 B：ossutil 命令行（适合以后更新）**

```bash
# 1. 安装 ossutil（Mac）
brew install ossutil

# 2. 配置（按提示填 AccessKey，在 RAM 控制台创建）
ossutil config

# 3. 在项目目录执行（把 BUCKET 换成你的桶名）
cd "/Users/bytedance/Desktop/网页设计0511-2 (6)"

ossutil cp index.html oss://BUCKET/
ossutil cp styles.css oss://BUCKET/
ossutil cp app.jsx oss://BUCKET/
ossutil cp robots.txt oss://BUCKET/
ossutil cp -r components oss://BUCKET/components
ossutil cp -r assets oss://BUCKET/assets
ossutil cp -r vendor oss://BUCKET/vendor
```

**本地一键打包（可选）：**

```bash
cd "/Users/bytedance/Desktop/网页设计0511-2 (6)"
zip -r site-cn.zip index.html styles.css app.jsx robots.txt components assets vendor -x "*.DS_Store"
```

解压后按目录上传到 OSS 根目录。

### 2.4 备案前自测

用静态网站 Endpoint 在浏览器打开，确认：

- 首页能加载（不是白屏）
- 视频能播放
- 简历能下载

---

## 第三步：CDN 加速 + 正式域名

> **备案通过后**再做本节。

### 3.1 添加 CDN 域名

1. 打开 [CDN 控制台](https://cdn.console.aliyun.com/)
2. **域名管理** → **添加域名**
3. 填写：

| 配置项 | 建议值 |
|--------|--------|
| 加速域名 | `www.你的域名.com`（或直接用根域名，见下） |
| 业务类型 | **全站加速** 或 **图片小文件** |
| 源站信息 | **OSS 域名**，选择刚创建的 Bucket |
| 端口 | 80 / 443 |
| 加速区域 | **仅中国内地**（省钱；海外仍走 Vercel） |

4. 提交后 CDN 会给你一个 **CNAME**，形如 `www.xxx.w.kunlunaq.com`

### 3.2 DNS 解析

1. [域名控制台](https://dc.console.aliyun.com/) → 你的域名 → **解析设置**
2. 添加记录：

| 记录类型 | 主机记录 | 记录值 |
|----------|----------|--------|
| CNAME | `www` | CDN 分配的 CNAME |
| CNAME 或 A | `@` | 根域名：按 CDN 向导配置（可用「域名转发」或 CDN 根域名方案） |

> 建议正式分享用 **`https://www.你的域名`**，配置最简单。

### 3.3 HTTPS 证书（免费）

1. CDN 控制台 → 你的加速域名 → **HTTPS 配置**
2. **开启 HTTPS**
3. 证书来源选 **免费证书**（阿里云 SSL 或与 CDN 联动的 DV 证书）
4. 按向导申请并部署
5. 开启 **强制跳转 HTTPS**

等待 DNS 生效（几分钟～几小时），访问 `https://www.你的域名` 应能看到作品集。

---

## 第四步：部署后配置

### 4.1 修改微信分享地址

编辑 `index.html`，把三处改成国内域名后重新上传：

```html
<meta property="og:url" content="https://www.你的域名/" />
<meta property="og:image" content="https://www.你的域名/assets/case-ai-lighting-cover.png" />
<link rel="canonical" href="https://www.你的域名/" />
```

### 4.2 简历 PDF 下载优化（可选）

阿里云 CDN → 域名 → **缓存配置** → **HTTP 响应头** → 添加规则：

- 路径：`/assets/resume-liangxiaoting-13522341227.pdf`
- 响应头：`Content-Disposition: attachment; filename="梁小婷-简历.pdf"`

### 4.3 全站检查清单

- [ ] 国内手机 4G 打开首页
- [ ] 主题切换、各区块滚动
- [ ] AIGC 视频播放
- [ ] 简历 PDF 下载
- [ ] 微信发链接给文件传输助手，预览正常

---

## 以后怎么更新网站

1. 本地改代码
2. 只上传有变动的文件到 OSS（或 ossutil 覆盖）
3. CDN 控制台 → **刷新预热** → **URL 刷新**，提交：
   - `https://www.你的域名/`
   - `https://www.你的域名/index.html`
   - `https://www.你的域名/styles.css`
   - 以及改过的 `*.jsx`
4. Vercel 海外站：push GitHub 即自动部署（两边分开维护）

---

## 常见问题

**备案还没过，能给别人看吗？**  
只用 OSS 测试域名自己看；正式链接等备案 + CDN + HTTPS 完成后再发。

**AccessKey 安全**  
不要用主账号 Key。到 **RAM 访问控制** 创建子用户，只授 OSS 读写 + CDN 刷新权限。

**上传很慢**  
`assets/` 约 277MB，控制台上传耐心等待；大文件可用 ossutil 断点续传。

**根域名 `liangxiaoting.design` 和 `www` 都要吗？**  
至少配好 `www`；根域名可在域名解析里做 **URL 转发** 到 `https://www.xxx`。

**和 Vercel 的关系**  
国内阿里云、海外 Vercel，互不影响。简历里国内写阿里云域名即可。

---

## 相关文件

| 文件 | 说明 |
|------|------|
| `DEPLOY.md` | 通用部署说明 |
| `DEPLOY-CN.md` | 国内方案对比（含腾讯云） |
| `GITHUB-VERCEL.md` | 海外自动部署 |
