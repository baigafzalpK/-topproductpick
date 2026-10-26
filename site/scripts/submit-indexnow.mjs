import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const API_KEY = "d80cafa4b191455a9eb0997f997f4387";
const HOST_WWW = "www.topproductpick.com";
const HOST_APEX = "topproductpick.com";

// Endpoints to notify (IndexNow shares across all participating search engines automatically)
const ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
];

async function loadUrls() {
  const sitemapPath = path.join(rootDir, "out", "sitemap.xml");
  let urls = [];

  if (fs.existsSync(sitemapPath)) {
    const xml = fs.readFileSync(sitemapPath, "utf-8");
    const matches = xml.matchAll(/<loc>(.*?)<\/loc>/g);
    for (const m of matches) {
      if (m[1]) urls.push(m[1].trim());
    }
  }

  // Fallback to minimal essential URLs if sitemap was not parsed
  if (urls.length === 0) {
    urls = [
      `https://${HOST_WWW}/`,
      `https://${HOST_WWW}/categories`,
      `https://${HOST_WWW}/about`,
    ];
  }

  return urls;
}

async function submitBatch(endpoint, payload) {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text().catch(() => "");
    return {
      status: res.status,
      statusText: res.statusText,
      body: text,
      ok: res.status === 200 || res.status === 202,
    };
  } catch (err) {
    return {
      status: 0,
      statusText: err.message,
      body: "",
      ok: false,
    };
  }
}

async function main() {
  console.log(`[IndexNow] Loading URLs for TopProductPick...`);
  const rawUrls = await loadUrls();
  console.log(`[IndexNow] Found ${rawUrls.length} URLs to submit.`);

  // Prepare URL lists for both www and apex domain
  const wwwUrls = rawUrls.map((u) => u.replace("https://topproductpick.com", "https://www.topproductpick.com"));
  const apexUrls = rawUrls.map((u) => u.replace("https://www.topproductpick.com", "https://topproductpick.com"));

  // Batch URLs in chunks of 5,000 (IndexNow maximum is 10,000)
  const CHUNK_SIZE = 5000;

  for (let i = 0; i < wwwUrls.length; i += CHUNK_SIZE) {
    const chunkWww = wwwUrls.slice(i, i + CHUNK_SIZE);
    const chunkApex = apexUrls.slice(i, i + CHUNK_SIZE);

    console.log(`\n[IndexNow] Submitting batch ${Math.floor(i / CHUNK_SIZE) + 1} (${chunkWww.length} URLs)...`);

    for (const endpoint of ENDPOINTS) {
      // 1. Submit www version
      const payloadWww = {
        host: HOST_WWW,
        key: API_KEY,
        keyLocation: `https://${HOST_WWW}/${API_KEY}.txt`,
        urlList: chunkWww,
      };

      console.log(` -> Sending to ${endpoint} (host: ${HOST_WWW})...`);
      const resWww = await submitBatch(endpoint, payloadWww);
      if (resWww.ok) {
        console.log(`    ✓ Success (${resWww.status} ${resWww.statusText})`);
      } else {
        console.log(`    ⚠ Response: ${resWww.status} ${resWww.statusText} ${resWww.body ? `(${resWww.body})` : ""}`);
      }

      // 2. Submit apex version
      const payloadApex = {
        host: HOST_APEX,
        key: API_KEY,
        keyLocation: `https://${HOST_APEX}/${API_KEY}.txt`,
        urlList: chunkApex,
      };

      console.log(` -> Sending to ${endpoint} (host: ${HOST_APEX})...`);
      const resApex = await submitBatch(endpoint, payloadApex);
      if (resApex.ok) {
        console.log(`    ✓ Success (${resApex.status} ${resApex.statusText})`);
      } else {
        console.log(`    ⚠ Response: ${resApex.status} ${resApex.statusText} ${resApex.body ? `(${resApex.body})` : ""}`);
      }
    }
  }

  console.log(`\n[IndexNow] Complete! All ${rawUrls.length} pages notified to Bing and IndexNow network.`);
}

main().catch((err) => {
  console.error("[IndexNow] Fatal error:", err);
  process.exit(1);
});
