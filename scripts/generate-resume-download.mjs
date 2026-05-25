#!/usr/bin/env node
/**
 * Generate resume PDF (About + Contact merged) for hero download link.
 * Does not modify the main portfolio site.
 * Output: assets/resume-liangxiaoting-13522341227.pdf
 */
import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const htmlPath = path.join(root, "resume-download.html");
const outDir = path.join(root, "assets");
const outFile = path.join(outDir, "resume-liangxiaoting-13522341227.pdf");

async function main() {
  let puppeteer;
  try {
    puppeteer = await import("puppeteer");
  } catch {
    console.error(
      "未安装 puppeteer。请在项目目录运行：npm install\n然后：npm run pdf:resume"
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
    await page.setViewport({ width: 1400, height: 990, deviceScaleFactor: 2 });
    await page.goto(pathToFileURL(htmlPath).href, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });
    // Wait for web fonts to be ready so layout doesn't shift mid-render
    await page.evaluate(async () => {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
    });
    await page.emulateMediaType("print");
    await page.pdf({
      path: outFile,
      width: "297mm",
      height: "210mm",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
    console.log("简历 PDF 已生成：", outFile);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
