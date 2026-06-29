/**
 * Copy latin woff2 subsets into assets/fonts/ and emit assets/fonts/fonts.css.
 * Run after: npm install (fontsource devDependencies).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "assets", "fonts");

const copies = [
  ["@fontsource/inter/files/inter-latin-300-normal.woff2", "inter-latin-300.woff2"],
  ["@fontsource/inter/files/inter-latin-400-normal.woff2", "inter-latin-400.woff2"],
  ["@fontsource/inter/files/inter-latin-500-normal.woff2", "inter-latin-500.woff2"],
  ["@fontsource/inter/files/inter-latin-600-normal.woff2", "inter-latin-600.woff2"],
  ["@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2", "instrument-serif-latin-400.woff2"],
  ["@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2", "instrument-serif-latin-400-italic.woff2"],
  ["@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2", "fraunces-latin-wght-normal.woff2"],
  ["@fontsource-variable/fraunces/files/fraunces-latin-wght-italic.woff2", "fraunces-latin-wght-italic.woff2"],
  ["@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2", "jetbrains-mono-latin-400.woff2"],
  ["@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2", "jetbrains-mono-latin-500.woff2"],
];

fs.mkdirSync(outDir, { recursive: true });

for (const [rel, destName] of copies) {
  const src = path.join(root, "node_modules", rel);
  if (!fs.existsSync(src)) {
    console.error(`Missing font file: ${src}`);
    process.exit(1);
  }
  fs.copyFileSync(src, path.join(outDir, destName));
}

const css = `/* Self-hosted fonts — no Google Fonts CDN (China-friendly) */

@font-face {
  font-family: "Inter";
  font-style: normal;
  font-display: swap;
  font-weight: 300;
  src: url("./inter-latin-300.woff2") format("woff2");
}

@font-face {
  font-family: "Inter";
  font-style: normal;
  font-display: swap;
  font-weight: 400;
  src: url("./inter-latin-400.woff2") format("woff2");
}

@font-face {
  font-family: "Inter";
  font-style: normal;
  font-display: swap;
  font-weight: 500;
  src: url("./inter-latin-500.woff2") format("woff2");
}

@font-face {
  font-family: "Inter";
  font-style: normal;
  font-display: swap;
  font-weight: 600;
  src: url("./inter-latin-600.woff2") format("woff2");
}

@font-face {
  font-family: "Instrument Serif";
  font-style: normal;
  font-display: swap;
  font-weight: 400;
  src: url("./instrument-serif-latin-400.woff2") format("woff2");
}

@font-face {
  font-family: "Instrument Serif";
  font-style: italic;
  font-display: swap;
  font-weight: 400;
  src: url("./instrument-serif-latin-400-italic.woff2") format("woff2");
}

@font-face {
  font-family: "Fraunces";
  font-style: normal;
  font-display: swap;
  font-weight: 100 900;
  src: url("./fraunces-latin-wght-normal.woff2") format("woff2-variations");
}

@font-face {
  font-family: "Fraunces";
  font-style: italic;
  font-display: swap;
  font-weight: 100 900;
  src: url("./fraunces-latin-wght-italic.woff2") format("woff2-variations");
}

@font-face {
  font-family: "JetBrains Mono";
  font-style: normal;
  font-display: swap;
  font-weight: 400;
  src: url("./jetbrains-mono-latin-400.woff2") format("woff2");
}

@font-face {
  font-family: "JetBrains Mono";
  font-style: normal;
  font-display: swap;
  font-weight: 500;
  src: url("./jetbrains-mono-latin-500.woff2") format("woff2");
}
`;

fs.writeFileSync(path.join(outDir, "fonts.css"), css);
console.log(`Copied ${copies.length} font files → assets/fonts/`);
