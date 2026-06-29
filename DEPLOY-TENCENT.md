# 腾讯云部署指南（COS + CDN）

作品集国内访问方案：**腾讯云 COS 存文件 + CDN 加速 + 备案域名 HTTPS**。

海外地址继续用：https://liang-portfolio-five.vercel.app/

---

## 总览（你要做的事）

```
① 注册腾讯云 + 实名认证
② 购买域名（DNSPod / 腾讯云域名注册）
③ ICP 备案（7～20 工作日，可同步上传测试）
④ 创建 COS 存储桶 → 上传网站文件
⑤ 开启静态网站托管
⑥ CDN 绑定域名 + 免费 HTTPS 证书
⑦ 改 index.html 分享地址 → 国内自测
```

预计费用：**域名 ~60 元/年 + COS/CDN 流量几元～几十元/月**（视频约 40MB，访问量不大时很便宜）。

---

## 第一步：账号与域名

### 1.1 注册与实名

1. 打开 https://cloud.tencent.com/ 注册账号
2. 控制台 → **账号信息** → **实名认证**（个人：身份证；需与备案信息一致）

### 1.2 购买域名

1. 打开 [腾讯云域名注册](https://dnspod.cloud.tencent.com/) 或控制台搜 **域名注册**
2. 搜索并购买，例如 `liangxiaoting.design` 或 `liangxiaoting.cn`
3. 购买后在 **DNSPod** → **我的域名** → 该域名 → **解析**（备案通过后再加 CDN 的 CNAME）

### 1.3 ICP 备案（必做，否则不能正式绑 HTTPS 域名）

1. 控制台搜索 **网站备案** → 进入备案系统
2. 选择 **开始备案** → **首次备案**
3. 填写：
   - 主体：个人
   - 网站名称：如「梁小婷作品集」（按页面提示，避免违规用词）
   - 域名：刚买的域名
   - 云服务：选 **对象存储 COS**（静态站无需买 CVM 服务器）
4. 按指引完成 **小程序 / App 人脸核验**
5. 等待管局审核（通常 **7～20 个工作日**）

> 备案审核期间可以先把文件传到 COS，用**静态网站测试地址**自己预览，不要对外发链接。

---

## 第二步：创建 COS 并上传网站

### 2.1 创建存储桶

1. 打开 [COS 控制台](https://console.cloud.tencent.com/cos)
2. **创建存储桶**，建议设置：

| 配置项 | 建议值 |
|--------|--------|
| 名称 | 全局唯一 + 后缀，如 `liang-portfolio-1250000000` |
| 所属地域 | **北京** / **上海** / **广州**（选离你近的） |
| 访问权限 | **公有读私有写**（静态网站必须） |
| 多 AZ | 关闭（个人站够用） |

### 2.2 开启静态网站

1. 进入存储桶 → **基础配置** → **静态网站**
2. **当前状态**：开启
3. **索引文档**：`index.html`
4. **错误文档**（可选）：`index.html`
5. 记下 **节点域名**（测试用，形如 `https://liang-portfolio-xxxxx.cos.ap-beijing.myqcloud.com`）

### 2.3 上传文件

**方式 A：控制台（最简单）**

1. 存储桶 → **文件列表** → **上传文件**
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

**方式 B：COSCLI 命令行（适合以后更新）**

```bash
# 1. 安装 COSCLI（Mac）
# 见 https://cloud.tencent.com/document/product/436/63143

# 2. 配置（按提示填 SecretId / SecretKey，在「访问管理」创建子账号密钥）
coscli config init

# 3. 在项目目录执行（把 BUCKET 换成你的桶名-APPID）
cd "/Users/bytedance/Desktop/网页设计0511-2 (6)"

coscli cp index.html cos://BUCKET/
coscli cp styles.css cos://BUCKET/
coscli cp app.jsx cos://BUCKET/
coscli cp robots.txt cos://BUCKET/
coscli cp -r components cos://BUCKET/components
coscli cp -r assets cos://BUCKET/assets
coscli cp -r vendor cos://BUCKET/vendor
```

**本地一键打包（可选）：**

```bash
cd "/Users/bytedance/Desktop/网页设计0511-2 (6)"
zip -r site-cn.zip index.html styles.css app.jsx robots.txt components assets vendor -x "*.DS_Store"
```

解压后按目录上传到 COS 根目录。

### 2.4 备案前自测

用静态网站节点域名在浏览器打开，确认：

- 首页能加载（不是白屏）
- 视频能播放
- 简历能下载

---

## 第三步：CDN 加速 + 正式域名

> **备案通过后**再做本节。

### 3.1 添加 CDN 域名

1. 打开 [CDN 控制台](https://console.cloud.tencent.com/cdn)
2. **域名管理** → **添加域名**
3. 填写：

| 配置项 | 建议值 |
|--------|--------|
| 加速域名 | `www.你的域名.com` |
| 加速区域 | **中国境内**（海外仍走 Vercel） |
| 源站类型 | **COS 源** → 选择刚创建的存储桶 |
| 回源协议 | HTTP（COS 静态站默认即可） |

4. 提交后 CDN 会给你一个 **CNAME**，形如 `www.xxx.cdn.dnsv1.com`

### 3.2 DNS 解析

1. [DNSPod 控制台](https://console.dnspod.cn/) → 你的域名 → **解析**
2. 添加记录：

| 记录类型 | 主机记录 | 记录值 |
|----------|----------|--------|
| CNAME | `www` | CDN 分配的 CNAME |

> 建议正式分享用 **`https://www.你的域名`**。根域名 `@` 可在 DNSPod 做 **URL 转发** 到 `https://www.xxx`。

### 3.3 HTTPS 证书（免费）

1. CDN 控制台 → 你的加速域名 → **HTTPS 配置**
2. **配置证书** → 选择 **腾讯云托管证书**（免费 DV）
3. 按向导申请并部署到该域名
4. 开启 **HTTP 2.0**（可选）和 **强制跳转 HTTPS**

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

CDN 控制台 → 域名 → **高级配置** → **HTTP 响应头配置** → 添加规则：

- 类型：文件后缀或路径
- 路径：`/assets/resume-liangxiaoting-13522341227.pdf`
- 响应头：`Content-Disposition: attachment; filename="梁小婷-简历.pdf"`

未配置时 PDF 仍可在浏览器打开，只是下载体验略差。

### 4.3 全站检查清单

- [ ] 国内手机 4G 打开首页
- [ ] 主题切换、各区块滚动
- [ ] AIGC 视频播放
- [ ] 简历 PDF 下载
- [ ] 微信发链接给文件传输助手，预览正常

---

## 以后怎么更新网站

1. 本地改代码
2. 只上传有变动的文件到 COS（或 coscli 覆盖）
3. CDN 控制台 → **刷新预热** → **URL 刷新**，提交：
   - `https://www.你的域名/`
   - `https://www.你的域名/index.html`
   - `https://www.你的域名/styles.css`
   - 以及改过的 `*.jsx`
4. Vercel 海外站：push GitHub 即自动部署（两边分开维护）

---

## 常见问题

**备案还没过，能给别人看吗？**  
只用 COS 静态网站测试域名自己看；正式链接等备案 + CDN + HTTPS 完成后再发。

**SecretId / SecretKey 安全**  
到 **访问管理 CAM** 创建子用户，只授 COS 读写 + CDN 刷新权限，不要用主账号密钥。

**上传很慢**  
`assets/` 约 277MB，控制台上传耐心等待；大文件建议用 COSCLI 断点续传。

**COS 和 CDN 要开两个产品吗？**  
是。COS 存文件，CDN 加速 + 绑备案域名 + HTTPS。备案时选 COS 即可，不必买云服务器。

**和 Vercel 的关系**  
国内腾讯云、海外 Vercel，互不影响。简历里国内写腾讯云域名即可。

---

## 相关文件

| 文件 | 说明 |
|------|------|
| `DEPLOY.md` | 通用部署说明 |
| `DEPLOY-CN.md` | 国内方案对比（含阿里云） |
| `DEPLOY-ALIYUN.md` | 阿里云版（备选） |
| `GITHUB-VERCEL.md` | 海外自动部署 |
