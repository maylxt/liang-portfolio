/**
 * 上传作品集到腾讯云 COS
 *
 * 用法（在项目根目录）：
 *   export COS_SECRET_ID="你的SecretId"
 *   export COS_SECRET_KEY="你的SecretKey"
 *   export COS_BUCKET="liang-portfolio-1446728817"   # 你的桶名
 *   export COS_REGION="ap-beijing"                   # 北京
 *   node scripts/upload-cos.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const COS = require("cos-nodejs-sdk-v5");

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const secretId = process.env.COS_SECRET_ID;
const secretKey = process.env.COS_SECRET_KEY;
const bucket = process.env.COS_BUCKET || "liang-portfolio-1446728817";
const region = process.env.COS_REGION || "ap-beijing";

if (!secretId || !secretKey) {
  console.error(`
缺少密钥。请先在腾讯云创建 API 密钥：
  控制台 → 访问管理 → API 密钥管理 → 新建密钥

然后执行：
  export COS_SECRET_ID="AKID..."
  export COS_SECRET_KEY="..."
  export COS_BUCKET="liang-portfolio-1446728817"
  node scripts/upload-cos.mjs
`);
  process.exit(1);
}

const cos = new COS({ SecretId: secretId, SecretKey: secretKey });

const uploadFiles = [
  "index.html",
  "styles.css",
  "app.jsx",
  "robots.txt",
];

function walk(dir) {
  const base = path.join(root, dir);
  const out = [];
  for (const name of fs.readdirSync(base)) {
    const full = path.join(base, name);
    const rel = path.join(dir, name).replace(/\\/g, "/");
    if (fs.statSync(full).isDirectory()) out.push(...walk(rel));
    else out.push(rel);
  }
  return out;
}

const all = [
  ...uploadFiles,
  ...walk("components"),
  ...walk("assets"),
  ...walk("vendor"),
];

function metaFor(key) {
  const ext = path.extname(key).toLowerCase();
  const map = {
    ".html": { ContentType: "text/html; charset=utf-8", ContentDisposition: "inline" },
    ".css": { ContentType: "text/css; charset=utf-8", ContentDisposition: "inline" },
    ".js": { ContentType: "application/javascript; charset=utf-8", ContentDisposition: "inline" },
    ".jsx": { ContentType: "application/javascript; charset=utf-8", ContentDisposition: "inline" },
    ".json": { ContentType: "application/json; charset=utf-8", ContentDisposition: "inline" },
    ".svg": { ContentType: "image/svg+xml", ContentDisposition: "inline" },
    ".png": { ContentType: "image/png", ContentDisposition: "inline" },
    ".jpg": { ContentType: "image/jpeg", ContentDisposition: "inline" },
    ".jpeg": { ContentType: "image/jpeg", ContentDisposition: "inline" },
    ".webp": { ContentType: "image/webp", ContentDisposition: "inline" },
    ".mp4": { ContentType: "video/mp4", ContentDisposition: "inline" },
    ".pdf": {
      ContentType: "application/pdf",
      ContentDisposition: 'attachment; filename="梁小婷-简历.pdf"',
    },
    ".txt": { ContentType: "text/plain; charset=utf-8", ContentDisposition: "inline" },
    ".woff2": { ContentType: "font/woff2", ContentDisposition: "inline" },
  };
  return map[ext] || { ContentDisposition: "inline" };
}

function put(key) {
  const { ContentType, ContentDisposition } = metaFor(key);
  return new Promise((resolve, reject) => {
    cos.putObject(
      {
        Bucket: bucket,
        Region: region,
        Key: key,
        Body: fs.createReadStream(path.join(root, key)),
        ContentType,
        ContentDisposition,
      },
      (err, data) => {
        if (err) reject(err);
        else resolve(data);
      }
    );
  });
}

console.log(`上传到 cos://${bucket} (${region})，共 ${all.length} 个文件…`);

let done = 0;
for (const key of all) {
  await put(key);
  done += 1;
  if (done % 20 === 0 || done === all.length) {
    console.log(`  ${done}/${all.length} ${key}`);
  }
}

console.log("上传完成。");
