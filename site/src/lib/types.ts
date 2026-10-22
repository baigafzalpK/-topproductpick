export type Product = {
  name: string;
  brand: string;
  asin?: string;
  searchQuery?: string;
  image?: string;
  blurb: string;
  strengths: string[];
  limitations: string[];
  bestFor?: string;
  badge?: string;
  features?: string[];
  noImage?: boolean;
};

export type Section = { h: string; p: string[]; list?: string[] };
export type Faq = { q: string; a: string };
export type Spec = { label: string; value: string };

export type PageType =
  | "department"
  | "category"
  | "roundup"
  | "review"
  | "comparison"
  | "buying-guide"
  | "howto"
  | "troubleshoot"
  | "page";

export type Page = {
  slug: string;
  type: PageType;
  title: string;
  h1: string;
  metaDescription: string;
  lede: string;
  updatedAt: string;
  category?: string;
  imported?: boolean;
  related?: string[];
  data: {
    products?: Product[];
    product?: Product;
    productA?: Product;
    productB?: Product;
    rows?: { label: string; a: string; b: string }[];
    specs?: Spec[];
    sections?: Section[];
    whoFor?: string[];
    notFor?: string[];
    verdict?: string;
    faqs?: Faq[];
    howWeChose?: string[];
    department?: string;
  };
};

export type ProductHub = {
  slug: string;
  product: Product;
  lists: { slug: string; title: string; badge?: string }[];
  reviewSlug?: string;
};
