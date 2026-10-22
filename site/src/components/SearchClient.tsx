"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Entry = { slug: string; title: string; type: string; description: string; keywords: string };

const LABEL: Record<string, string> = { department: "Department", roundup: "Best of", review: "Review", comparison: "Comparison", "buying-guide": "Buying guide", howto: "How-to", category: "Category", product: "Product", page: "About" };

export function SearchClient() {
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [index, setIndex] = useState<Entry[] | null>(null);

  useEffect(() => {
    fetch("/search-index.json")
      .then((r) => r.json())
      .then(setIndex)
      .catch(() => setIndex([]));
  }, []);

  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length || !index) return [];
    return index
      .map((e) => {
        const title = e.title.toLowerCase();
        const hay = `${title} ${e.description.toLowerCase()} ${e.keywords}`;
        if (!terms.every((t) => hay.includes(t))) return null;
        const score = terms.reduce((s, t) => s + (title.includes(t) ? 3 : 1), 0);
        return { e, score };
      })
      .filter((r): r is { e: Entry; score: number } => r !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 40);
  }, [q, index]);

  return (
    <>
      <form className="search-form" role="search" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="q" className="skip">
          Search
        </label>
        <input id="q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Try “air fryer” or “espresso”" autoFocus />
      </form>
      {q && !index && <p className="small">Loading…</p>}
      {q && index && <p className="small">{results.length} result{results.length === 1 ? "" : "s"}</p>}
      <ul className="results">
        {results.map(({ e }) => (
          <li key={e.slug}>
            <span className="chip">{LABEL[e.type] ?? e.type}</span>
            <br />
            <Link href={`/${e.slug}`}>{e.title}</Link>
            <div className="small">{e.description}</div>
          </li>
        ))}
      </ul>
    </>
  );
}
