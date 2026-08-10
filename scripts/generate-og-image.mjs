// One-off script to generate public/og-image.png for social link previews.
// Run manually with: node scripts/generate-og-image.mjs
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const profileB64 = readFileSync(join(root, "src/assets/profile.png")).toString("base64");

const html = `
<!doctype html>
<html>
<head>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px;
    font-family: 'Sora', system-ui, sans-serif;
    background: #FAFAF9;
    position: relative;
    overflow: hidden;
  }
  .glow-1 {
    position: absolute; top: -120px; left: -100px;
    width: 480px; height: 480px; border-radius: 50%;
    background: radial-gradient(circle, rgba(79,70,229,0.18) 0%, rgba(79,70,229,0) 70%);
  }
  .glow-2 {
    position: absolute; bottom: -140px; right: 260px;
    width: 420px; height: 420px; border-radius: 50%;
    background: radial-gradient(circle, rgba(15,23,42,0.08) 0%, rgba(15,23,42,0) 72%);
  }
  .content {
    position: relative; z-index: 1;
    display: flex; align-items: center; height: 100%;
    padding: 0 64px;
  }
  .text { max-width: 660px; }
  .badge {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 14px; color: #6B7280; letter-spacing: 0.02em;
    padding: 6px 14px; border: 1px solid #E5E7EB; border-radius: 20px;
    background: #fff; margin-bottom: 28px;
  }
  .dot { width: 7px; height: 7px; border-radius: 50%; background: #22C55E; }
  h1 {
    font-size: 58px; font-weight: 800; letter-spacing: -0.03em;
    color: #0F172A; line-height: 1.08; margin-bottom: 18px;
  }
  h2 {
    font-size: 24px; font-weight: 600; color: #4F46E5;
    letter-spacing: -0.01em; margin-bottom: 20px;
  }
  p {
    font-size: 19px; color: #6B7280; line-height: 1.55; max-width: 560px;
  }
  .photo-wrap {
    position: absolute; right: 40px; bottom: 0;
    width: 480px; height: 630px;
    display: flex; align-items: flex-end; justify-content: center;
  }
  .photo-wrap img {
    height: 640px; object-fit: contain; object-position: bottom;
  }
</style>
</head>
<body>
  <div class="glow-1"></div>
  <div class="glow-2"></div>
  <div class="content">
    <div class="text">
      <div class="badge"><span class="dot"></span>Open to select collaborations</div>
      <h1>Ifeoma O. Anyanwu</h1>
      <h2>Product Designer, Founder &amp; Systems Thinker</h2>
      <p>8+ years designing clarity for products, teams, and the people building them — across fintech, SaaS, travel, and media.</p>
    </div>
  </div>
  <div class="photo-wrap">
    <img src="data:image/png;base64,${profileB64}" />
  </div>
</body>
</html>
`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: "networkidle" });
await page.waitForTimeout(300);
await page.screenshot({ path: join(root, "public/og-image.png") });
await browser.close();

console.log("Wrote public/og-image.png");
