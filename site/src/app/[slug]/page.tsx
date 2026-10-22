import { notFound } from "next/navigation";
import { CategoryTemplate } from "@/components/templates/CategoryTemplate";
import { DepartmentTemplate } from "@/components/templates/DepartmentTemplate";
import { ComparisonTemplate } from "@/components/templates/ComparisonTemplate";
import { GuideTemplate } from "@/components/templates/GuideTemplate";
import { ProductTemplate } from "@/components/templates/ProductTemplate";
import { ReviewTemplate } from "@/components/templates/ReviewTemplate";
import { RoundupTemplate } from "@/components/templates/RoundupTemplate";
import { getAllSlugs, getPage } from "@/lib/content";
import { getProductHub, getProductHubs } from "@/lib/products";
import { buildMetadata } from "@/lib/seo";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return [...getAllSlugs(), ...getProductHubs().map((h) => h.slug)].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const page = getPage(slug);
  if (page) return buildMetadata({ slug, title: page.title, description: page.metaDescription, type: page.type === "page" ? "website" : "article" });
  const hub = getProductHub(slug);
  if (hub) {
    const p = hub.product;
    return buildMetadata({ slug, title: `${p.name}: Pros, Cons and Who It Suits`, description: `${p.blurb ? `${p.blurb} ` : ""}Strengths, limitations and where the ${p.name} ranks in our lists.` });
  }
  return {};
}

export default async function SlugPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const page = getPage(slug);
  if (page) {
    switch (page.type) {
      case "department":
        return <DepartmentTemplate page={page} />;
      case "category":
        return <CategoryTemplate page={page} />;
      case "roundup":
        return <RoundupTemplate page={page} />;
      case "review":
        return <ReviewTemplate page={page} />;
      case "comparison":
        return <ComparisonTemplate page={page} />;
      default:
        return <GuideTemplate page={page} />;
    }
  }
  const hub = getProductHub(slug);
  if (hub) return <ProductTemplate hub={hub} />;
  notFound();
}
