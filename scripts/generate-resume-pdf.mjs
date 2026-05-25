#!/usr/bin/env node
/**
 * Generate portfolio PDF from resume-pdf.html (does not touch main site).
 * Usage: npm run pdf   OR   node scripts/generate-resume-pdf.mjs
 */
import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const htmlPath = path.join(root, "resume-pdf.html");
const outDir = path.join(root, "exports");
const outFile = path.join(outDir, "梁小婷-作品集简历-2026.pdf");

async function main() {
  let puppeteer;
  try {
    puppeteer = await import("puppeteer");
  } catch {
    console.error(
      "未安装 puppeteer。请在项目目录运行：npm install\n然后：npm run pdf"
    );
    process.exit(1);
  }

  await mkdir(outDir, { recursive: true });

  const browser = await puppeteer.default.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(htmlPath).href, {
      waitUntil: "networkidle0",
      timeout: 120000,
    });
    await page.emulateMediaType("print");
    await page.pdf({
      path: outFile,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
    console.log("PDF 已生成：", outFile);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
