# TopProductPick: Amazon affiliate research site

Built from the BuyOnceRight blueprint: a **Next.js 16 static export** for Cloudflare Workers, with all content kept as JSON.

## Run it

```bash
cd site
npm install
npm run dev          # http://localhost:3000
npm run build:cf     # static export to site/out
npm run deploy       # build + wrangler deploy
```

## Change before launch

| What | File |
|---|---|
| Brand, URL, **Amazon tag**, disclosures | `site/src/lib/site.ts` and `site/.env.local` |
| Logo and favicon | Replace `site/assets/brand/logo-original.jpg`, then run `node scripts/make-logo.mjs` (makes transparent light/dark logos and the icons) |
| Colors and fonts | `site/src/app/globals.css`, `site/src/app/layout.tsx` |
| Cloudflare name and domain | `site/wrangler.jsonc` |
| Header department bar (order of departments) | `site/src/data/navigation.json` (department slugs; labels come from `short` in departments.json) |
| Departments (Home & Kitchen, Electronics…) | `site/src/data/departments.json` + a `type: "department"` page with the same slug |
| Categories (each belongs to one department) | `site/src/data/categories.json` |
| Hand-written titles | `site/src/data/seo-overrides.json` |

## Adding content

1. Add a JSON file to `site/src/data/pages/` (copy an existing one of the same `type`: `category`, `roundup`, `review`, `comparison`, `buying-guide`, `howto`, `page`).
2. Run `npm run index` (it also runs automatically before `dev` and `build`). It rebuilds manifest, search index, sitemap and category counts, and **fails the build** if a page says "we tested", "hands-on" or "our lab".
3. Run `npm run audit:links`.

Product hub pages (`/<product-name>-review`) are generated automatically from every list.

## Imported products (from BuyOnceRight)

About 600 roundups and 1,870 products were imported from buyonceright.com with `site/scripts/import-products.mjs`. Every imported page has `"imported": true`.

- Re-import (after re-crawling): `node scripts/import-products.mjs <crawl-dir>`
- Remove all imported pages and categories: `node scripts/import-products.mjs --remove`
- Products still without an image are listed in `site/missing_images.csv` (columns `product_id, product_name, amazon_url, image_url`; recreate it with `node scripts/missing-images.mjs export`). Open each Amazon link, right-click the main photo, choose "Copy image address" and paste it in `image_url`. Then run `node scripts/missing-images.mjs check` (read-only report), and `node scripts/missing-images.mjs apply` once the report looks right.
- After any import or new ASINs, run `node scripts/check-images.mjs`. It marks products whose Amazon image doesn't exist (`"noImage": true`), so the site shows a brand tile instead of a blank box.

The text is the same as on BuyOnceRight, so Google may treat it as duplicate content. Rewrite it before you index this site.

## Amazon links

All links go through `site/src/lib/affiliate.ts` with `rel="sponsored nofollow noopener"`.
The sample products have **no ASIN yet**, so their buttons open an Amazon search with your tag. After you check a product on a live Amazon listing, add `"asin": "B0..."` to it. The button then links straight to `/dp/<ASIN>` and the product image appears.

Notes:
- The content pipeline uses Node scripts (`site/scripts/*.mjs`) instead of the blueprint's Python scripts, because Python isn't installed on this machine.
- No prices, star ratings or test claims are published, as the blueprint's editorial rules require.
