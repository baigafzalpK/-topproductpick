import { getAllPages, TYPE_LABEL } from "@/lib/content";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const pages = getAllPages();
  const lines = [`# ${siteConfig.name}`, "", `> ${siteConfig.description}`, ""];
  for (const type of ["department", "category", "roundup", "review", "comparison", "buying-guide", "page"]) {
    const list = pages.filter((p) => p.type === type);
    if (!list.length) continue;
    lines.push(`## ${TYPE_LABEL[type]}`, "");
    for (const p of list) lines.push(`- [${p.h1}](${absoluteUrl(`/${p.slug}`)}): ${p.metaDescription}`);
    lines.push("");
  }
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
