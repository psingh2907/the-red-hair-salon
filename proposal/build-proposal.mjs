/**
 * Builds the owner proposal PDF.
 *
 *   1. Captures phone screenshots of the running website (hero + booking form)
 *   2. Prints proposal.html to proposal.pdf (A4, 2 pages)
 *   3. Saves PNG previews of each PDF page (for checking the layout)
 *
 * Usage (with the site running, e.g. `pnpm build && pnpm start -p 3001`):
 *   node proposal/build-proposal.mjs [siteUrl] [previewDir]
 *
 * Uses the installed Google Chrome over the DevTools protocol; no npm packages.
 */
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const SITE = process.argv[2] ?? "http://localhost:3001";
const PREVIEW_DIR = process.argv[3] ?? join(tmpdir(), "salon-proposal-preview");
const PORT = 9333;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const profile = mkdtempSync(join(tmpdir(), "salon-proposal-chrome-"));
const chrome = spawn(
  CHROME,
  ["--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, "--no-first-run", "--hide-scrollbars", "about:blank"],
  { stdio: "ignore" },
);

async function pageSocketUrl() {
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const page = targets.find((target) => target.type === "page");
      if (page) return page.webSocketDebuggerUrl;
    } catch {
      // Chrome is still starting.
    }
    await sleep(250);
  }
  throw new Error("Chrome did not start");
}

const socket = new WebSocket(await pageSocketUrl());
await new Promise((resolve, reject) => {
  socket.onopen = resolve;
  socket.onerror = reject;
});

let nextId = 0;
const pending = new Map();
socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  const callback = pending.get(message.id);
  if (!callback) return;
  pending.delete(message.id);
  callback(message);
};
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, (message) => (message.error ? reject(new Error(`${method}: ${message.error.message}`)) : resolve(message.result)));
    socket.send(JSON.stringify({ id, method, params }));
  });

const evaluate = (expression) => send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });

async function phoneShot(file, prepareScript) {
  await send("Page.navigate", { url: SITE });
  await sleep(4500);
  if (prepareScript) {
    await evaluate(prepareScript);
    await sleep(2000);
  }
  const { data } = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(join(HERE, file), Buffer.from(data, "base64"));
  console.log(`saved proposal/${file}`);
}

try {
  await send("Page.enable");
  await send("Runtime.enable");

  // 1. Phone screenshots (390×844 at 2×, animations off)
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  await phoneShot("shot-hero.png");
  await phoneShot(
    "shot-booking.png",
    `(() => {
      const title = document.getElementById("appointment-form-title");
      window.scrollTo(0, title.getBoundingClientRect().top + window.scrollY - 110);
      return true;
    })()`,
  );

  // 2. Proposal PDF
  await send("Emulation.clearDeviceMetricsOverride");
  await send("Emulation.setDeviceMetricsOverride", { width: 900, height: 1200, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: pathToFileURL(join(HERE, "proposal.html")).href });
  await sleep(1500);
  await evaluate("document.fonts.ready.then(() => Promise.all([...document.images].map((img) => img.decode().catch(() => null)))).then(() => true)");
  await sleep(500);

  const pdf = await send("Page.printToPDF", { printBackground: true, preferCSSPageSize: true, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0 });
  writeFileSync(join(HERE, "proposal.pdf"), Buffer.from(pdf.data, "base64"));
  console.log("saved proposal/proposal.pdf");

  // 3. Page previews
  mkdirSync(PREVIEW_DIR, { recursive: true });
  const rects = (await evaluate(
    `[...document.querySelectorAll(".page")].map((page) => { const r = page.getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height }; })`,
  )).result.value;
  for (const [index, rect] of rects.entries()) {
    const { data } = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { ...rect, scale: 1.5 } });
    const file = join(PREVIEW_DIR, `page-${index + 1}.png`);
    writeFileSync(file, Buffer.from(data, "base64"));
    console.log(`preview ${file}`);
  }
} finally {
  socket.close();
  chrome.kill();
  await sleep(500);
  rmSync(profile, { recursive: true, force: true });
}
