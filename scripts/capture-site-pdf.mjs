#!/usr/bin/env node
/**
 * Export portfolio PDF by capturing each section as image — no print pagination blanks.
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument, rgb } from "pdf-lib";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const port = 4173;
const outDir = path.join(root, "exports");
const outFile = path.join(outDir, "梁小婷-作品集-网站完整版-2026-v5.pdf");

const VIEWPORT_W = 1480;
const DPR = 2;
const PAGE_W = 1190.55;
const PAGE_H = 841.89;
const MARGIN = 14;
const CONTENT_SCALE = 0.94;

const BLOCKS = [
  { sel: "header#hero", label: "封面" },
  { sel: "section.about", label: "关于我" },
  { sel: "section#portrait", label: "AI 人像" },
  { sel: "section#case-ai-lighting", label: "AI 光影案例" },
  { sel: "section#vision", label: "AI 视觉探索" },
  { sel: "#fx .section-head", label: "抖音特效" },
  { sel: "#fx-minigame", label: "特效小游戏" },
  { sel: "#fx-douyin", label: "抖音道具" },
  { sel: ".fx-inline-case", label: "春节案例" },
  { sel: "#fx-stickers", label: "信息化贴纸" },
  { sel: "#fx-ops", label: "运营活动" },
  { sel: "section#contact", label: "联系" },
];

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jsx": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
  ".svg": "image/svg+xml",
};

function startServer() {
  return new Promise((resolve) => {
    const srv = createServer(async (req, res) => {
      try {
        let urlPath = decodeURIComponent(req.url.split("?")[0]);
        if (urlPath === "/") urlPath = "/index.html";
        const filePath = path.normalize(path.join(root, urlPath));
        if (!filePath.startsWith(root)) {
          res.writeHead(403);
          return res.end();
        }
        const buf = await readFile(filePath);
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
        res.end(buf);
      } catch {
        res.writeHead(404);
        res.end();
      }
    });
    srv.listen(port, "127.0.0.1", () => resolve(srv));
  });
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    const delay = (ms) => new Promise((r) => setTimeout(r, ms));
    const max = document.documentElement.scrollHeight;
    const step = Math.max(400, window.innerHeight * 0.85);
    for (let y = 0; y < max; y += step) {
      window.scrollTo(0, y);
      await delay(160);
    }
    window.scrollTo(0, 0);
    await delay(300);
  });
}

async function prepareForPdf(page) {
  await page.evaluate(() => {
    document.documentElement.classList.add("pdf-export-mode");
    document.querySelectorAll(".art-cursor").forEach((el) => el.remove());
    document.documentElement.classList.remove(
      "has-art-cursor",
      "art-cursor-hot",
      "art-cursor-press"
    );
    document.querySelectorAll(".twk-panel").forEach((el) => el.remove());

    document.querySelectorAll(".cmp").forEach((cmp) => {
      cmp.style.setProperty("--split", "100%");
      const after = cmp.querySelector(".layer.after");
      const before = cmp.querySelector(".layer.before");
      if (after) {
        after.style.clipPath = "inset(0 0 0 0)";
        after.style.opacity = "1";
      }
      if (before) before.style.opacity = "0";
    });

    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
  });
}

async function getBlockRect(page, selector) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      x: r.left + window.scrollX,
      y: r.top + window.scrollY,
      width: r.width,
      height: r.height,
    };
  }, selector);
}

async function captureSlices(page, rect) {
  const contentW = (PAGE_W - 2 * MARGIN) * CONTENT_SCALE;
  const contentH = (PAGE_H - 2 * MARGIN) * CONTENT_SCALE;
  const ptPerCssPx = contentW / rect.width;
  const maxSliceCssH = contentH / ptPerCssPx;

  const slices = [];
  let offset = 0;

  while (offset < rect.height - 0.5) {
    const sliceH = Math.min(maxSliceCssH, rect.height - offset);
    const png = await page.screenshot({
      type: "png",
      clip: {
        x: rect.x,
        y: rect.y + offset,
        width: rect.width,
        height: sliceH,
      },
    });
    slices.push({ png, cssW: rect.width, cssH: sliceH });
    offset += sliceH;
  }

  return slices;
}

async function addSlicesToPdf(pdfDoc, slices, bgColor) {
  const contentW = (PAGE_W - 2 * MARGIN) * CONTENT_SCALE;
  const contentH = (PAGE_H - 2 * MARGIN) * CONTENT_SCALE;
  const x = MARGIN + (PAGE_W - 2 * MARGIN - contentW) / 2;

  for (const slice of slices) {
    const image = await pdfDoc.embedPng(slice.png);
    const drawW = contentW;
    const drawH = (slice.cssH / slice.cssW) * drawW;

    const page = pdfDoc.addPage([PAGE_W, PAGE_H]);
    page.drawRectangle({
      x: 0,
      y: 0,
      width: PAGE_W,
      height: PAGE_H,
      color: bgColor,
    });
    page.drawImage(image, {
      x,
      y: PAGE_H - MARGIN - drawH,
      width: drawW,
      height: drawH,
    });
  }
}

async function main() {
  let puppeteer;
  try {
    puppeteer = await import("puppeteer");
  } catch {
    console.error("请先运行：npm install");
    process.exit(1);
  }

  await mkdir(outDir, { recursive: true });
  const server = await startServer();
  const url = `http://127.0.0.1:${port}/index.html`;

  const browser = await puppeteer.default.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: VIEWPORT_W, height: 900, deviceScaleFactor: DPR });

    console.log("加载网站…", url);
    await page.goto(url, { waitUntil: "networkidle0", timeout: 180000 });
    await page.waitForSelector("#contact .contact-list", { timeout: 120000 });
    await wait(3000);

    const exportCss = await readFile(path.join(root, "pdf-export.css"), "utf8");
    await page.addStyleTag({ content: exportCss });

    console.log("滚动加载资源…");
    await autoScroll(page);
    await prepareForPdf(page);
    await wait(600);

    const bgHex = await page.evaluate(() =>
      getComputedStyle(document.body).backgroundColor
    );
    const bgMatch = bgHex.match(/[\d.]+/g);
    const bgColor = bgMatch
      ? rgb(+bgMatch[0] / 255, +bgMatch[1] / 255, +bgMatch[2] / 255)
      : rgb(0.047, 0.047, 0.047);

    const pdfDoc = await PDFDocument.create();
    let pageCount = 0;

    for (const block of BLOCKS) {
      const rect = await getBlockRect(page, block.sel);
      if (!rect || rect.height < 8) {
        console.warn("跳过（未找到）：", block.label, block.sel);
        continue;
      }

      await page.evaluate((sel) => {
        document.querySelector(sel)?.scrollIntoView({ block: "start" });
      }, block.sel);
      await wait(400);

      const slices = await captureSlices(page, rect);
      await addSlicesToPdf(pdfDoc, slices, bgColor);
      pageCount += slices.length;
      console.log(`  ${block.label} → ${slices.length} 页`);
    }

    const pdfBytes = await pdfDoc.save();
    await import("node:fs/promises").then((fs) => fs.writeFile(outFile, pdfBytes));

    console.log(`PDF 已生成（${pageCount} 页，无空白分页）：`, outFile);
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
