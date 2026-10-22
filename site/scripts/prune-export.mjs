// Removes files from ./out that Cloudflare doesn't need to serve.
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "out");
let removed = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    // RSC payload files are only used for client-side navigation prefetch; keep .txt files that aren't RSC (e.g. llms.txt, IndexNow key).
    else if (entry.name.endsWith(".map")) {
      fs.rmSync(full);
      removed++;
    }
  }
}

if (!fs.existsSync(OUT)) {
  console.error("out/ not found. Run next build first.");
  process.exit(1);
}
walk(OUT);
console.log(`prune-export: removed ${removed} files`);
