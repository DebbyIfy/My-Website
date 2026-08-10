// Runs automatically after `npm run build` (see package.json "postbuild").
// Renders the built SPA with headless Chrome and bakes the resulting DOM
// back into dist/index.html, so crawlers and link-preview bots that don't
// execute JS still see full page content. The client bundle still loads
// and re-renders on top for real visitors — this only affects the initial
// static payload.
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = join(root, "dist");
const port = 4321;

const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".webmanifest": "application/manifest+json",
  ".xml": "application/xml",
  ".txt": "text/plain",
};

const server = createServer(async (req, res) => {
  const urlPath = req.url.split("?")[0];
  const filePath = join(dist, urlPath === "/" ? "index.html" : urlPath);
  try {
    const data = await readFile(filePath);
    res.setHeader("Content-Type", MIME[extname(filePath)] || "application/octet-stream");
    res.end(data);
  } catch {
    const fallback = await readFile(join(dist, "index.html"));
    res.setHeader("Content-Type", "text/html");
    res.end(fallback);
  }
});

await new Promise(resolve => server.listen(port, resolve));

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(`http://localhost:${port}/`, { waitUntil: "networkidle" });
  await page.waitForSelector("#contact", { timeout: 15000 });
  const html = await page.content();
  await writeFile(join(dist, "index.html"), html);
  console.log("Prerendered dist/index.html with full app markup.");
} finally {
  await browser.close();
  server.close();
}
