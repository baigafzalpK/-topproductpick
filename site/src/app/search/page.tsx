import { Suspense } from "react";
import { SearchClient } from "@/components/SearchClient";
import { buildMetadata } from "@/lib/seo";

export const metadata = { ...buildMetadata({ slug: "search", title: "Search", description: "Search every list, review and guide.", type: "website" }), robots: { index: false, follow: true } };

export default function SearchPage() {
  return (
    <div className="container narrow">
      <h1 style={{ marginTop: 32 }}>Search</h1>
      <Suspense fallback={<p>Loading search…</p>}>
        <SearchClient />
      </Suspense>
    </div>
  );
}
