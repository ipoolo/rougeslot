import { readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const productsDocument = JSON.parse(
  await readFile(new URL("data/products.json", root), "utf8")
);

const fetchedAt = new Date().toISOString();
const reviewLabels = {
  0: "暂无用户评测",
  1: "差评如潮",
  2: "特别差评",
  3: "差评",
  4: "多半差评",
  5: "褒贬不一",
  6: "多半好评",
  7: "好评",
  8: "特别好评",
  9: "好评如潮"
};

function steamAppId(product) {
  const explicitId = String(product.steam_app_id ?? "").trim();
  const sourceId = String(product.source_url ?? "")
    .match(/store\.steampowered\.com\/app\/(\d+)/)?.[1];
  return /^\d+$/.test(explicitId) ? explicitId : sourceId ?? null;
}

function releaseDateIso(value) {
  const time = Date.parse(value ? `${value} 00:00:00 UTC` : "");
  return Number.isFinite(time) ? new Date(time).toISOString().slice(0, 10) : null;
}

async function fetchJson(url, retries = 3) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { "user-agent": "R_RougeSlot metadata updater" }
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return await response.json();
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 600 * attempt));
      }
    }
  }
  throw lastError;
}

async function fetchMetadata(product) {
  const appId = steamAppId(product);
  if (!appId) {
    return {
      product_id: product.id,
      status: "unavailable",
      reason: "missing_steam_app_id"
    };
  }

  try {
    const [detailsResponse, reviewsResponse] = await Promise.all([
      fetchJson(`https://store.steampowered.com/api/appdetails?appids=${appId}&cc=us&l=english`),
      fetchJson(`https://store.steampowered.com/appreviews/${appId}?json=1&language=all&purchase_type=all&num_per_page=0`)
    ]);
    const details = detailsResponse?.[appId]?.data;
    const reviews = reviewsResponse?.query_summary;
    const reviewScore = Number.isInteger(reviews?.review_score)
      ? reviews.review_score
      : 0;
    const totalPositive = Number.isInteger(reviews?.total_positive)
      ? reviews.total_positive
      : 0;
    const totalNegative = Number.isInteger(reviews?.total_negative)
      ? reviews.total_negative
      : 0;
    const totalReviews = Number.isFinite(reviews?.total_reviews)
      ? reviews.total_reviews
      : totalPositive + totalNegative;
    const positivePercentage = totalReviews > 0
      ? Math.round((totalPositive / totalReviews) * 100)
      : null;
    const isDemo = details?.type === "demo"
      || /\bdemo\b/i.test(`${product.name ?? ""} ${product.name_en ?? ""} ${details?.name ?? ""}`);

    return {
      product_id: product.id,
      steam_app_id: appId,
      status: details ? "available" : "unavailable",
      steam_name: details?.name ?? null,
      is_demo: isDemo,
      coming_soon: Boolean(details?.release_date?.coming_soon),
      release_date_iso: releaseDateIso(details?.release_date?.date),
      release_date_text: details?.release_date?.date || null,
      review_score: reviewScore,
      review_label: reviewLabels[reviewScore] ?? "暂无用户评测",
      total_positive: totalPositive,
      total_negative: totalNegative,
      total_reviews: totalReviews,
      positive_percentage: positivePercentage
    };
  } catch (error) {
    return {
      product_id: product.id,
      steam_app_id: appId,
      status: "unavailable",
      reason: "request_failed",
      error: error.message
    };
  }
}

const products = productsDocument.items ?? [];
const items = [];
const concurrency = 4;

for (let index = 0; index < products.length; index += concurrency) {
  const batch = products.slice(index, index + concurrency);
  items.push(...await Promise.all(batch.map(fetchMetadata)));
  if (index + concurrency < products.length) {
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
}

const available = items.filter((item) => item.status === "available").length;
const document = {
  version: "20260803.1",
  source: {
    name: "Steam",
    details_endpoint: "https://store.steampowered.com/api/appdetails",
    reviews_endpoint: "https://store.steampowered.com/appreviews/{appid}",
    review_scope: "all_languages_all_purchase_types",
    fetched_at: fetchedAt
  },
  summary: {
    total_products: products.length,
    available,
    unavailable: products.length - available
  },
  items
};

await writeFile(
  new URL("data/product-steam-metadata.json", root),
  `${JSON.stringify(document, null, 2)}\n`,
  "utf8"
);

console.log(`Steam 元数据已更新：${available}/${products.length} 款可用`);
