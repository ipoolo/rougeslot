import { readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const productsUrl = new URL("data/products.json", root);
const outputUrl = new URL("data/product-sales-estimates.json", root);
const products = JSON.parse(await readFile(productsUrl, "utf8")).items;

const PUBLIC_SNAPSHOT_DATE = "2026-08-01";
const USE_PUBLIC_SNAPSHOT = process.argv.includes("--use-public-snapshot");
const apiKey = process.env.GAMALYTIC_API_KEY?.trim();

// Public Gamalytic detail pages expose a point estimate and an estimated range.
// This dated snapshot is the value set reviewed in the browser on 2026-08-01.
const PUBLIC_SNAPSHOT = new Map([
  [1404850, [767600, 474600, 1000000]],
  [2659970, [7300, 4800, 9800]],
  [4906570, null],
  [2379780, [6200000, 4600000, 7900000]],
  [1296610, [987800, 722500, 1200000]],
  [2667120, [359700, 215900, 503600]],
  [861540, [793200, 529100, 1000000]],
  [1775490, [127800, 82700, 172800]],
  [1755830, [249900, 160300, 339500]],
  [2026820, [188300, 124700, 251800]],
  [3066570, [84800, 55000, 114700]],
  [3784030, [755300, 448900, 1000000]],
  [3371510, [21900, 13700, 30200]],
  [4045170, [1, 1, 2]],
  [3576520, [2600, 1400, 3800]],
  [2917350, [70400, 46200, 94700]],
  [3314790, [1700000, 1100000, 2400000]],
  [2752720, [21400, 13500, 29200]],
  [3036010, [88600, 53900, 123200]],
  [2516820, [10300, 6400, 14100]],
  [2195650, [656, 312, 1000]],
  [3408410, [4000, 2600, 5400]],
  [2404510, [5200, 3700, 6700]],
  [2789810, [77900, 48600, 107100]],
  [1863170, [168, 84, 252]],
  [2348090, [33200, 21500, 44900]],
  [2797340, [224100, 134700, 313400]],
  [2824310, [28400, 19000, 37800]],
  [3166810, [73800, 46000, 101500]],
  [3265700, [1200000, 795300, 1600000]],
  [1163740, [13100, 8200, 18000]],
  [1965800, [4200, 2600, 5800]],
  [2008050, [5800, 3600, 8100]],
  [2666230, [8600, 6000, 11300]],
  [2343600, [70700, 47000, 94500]],
  [3073990, [23500, 15400, 31600]],
  [3631290, [291000, 209200, 372900]],
  [2462430, null],
  [2837790, [4700, 3000, 6400]],
  [3496890, [4700, 3200, 6300]],
  [3907520, null],
  [4372270, null],
  [3856990, null],
  [3343940, [825, 459, 1100]],
  [4094560, null],
  [3345680, null]
]);

function steamAppId(product) {
  const explicit = String(product.steam_app_id ?? "").trim();
  const fromUrl = String(product.source_url ?? "").match(/\/app\/(\d+)/)?.[1] ?? "";
  return /^\d+$/.test(explicit || fromUrl) ? Number(explicit || fromUrl) : null;
}

function gamalyticUrl(appId) {
  return `https://gamalytic.com/game/${appId}?utm_source=SteamDB`;
}

function unavailableItem(product, appId, reason) {
  return {
    product_id: product.id,
    steam_app_id: appId,
    status: "unavailable",
    metric: "gamalytic_copies_sold",
    source_url: appId ? gamalyticUrl(appId) : "",
    reason
  };
}

function publicSnapshotItem(product, appId) {
  const values = PUBLIC_SNAPSHOT.get(appId);
  if (!values) {
    return unavailableItem(product, appId, "gamalytic_record_unavailable");
  }
  const [unitsEstimate, unitsLower, unitsUpper] = values;
  return {
    product_id: product.id,
    steam_app_id: appId,
    status: "estimated",
    estimate_method: "gamalytic_public_page",
    metric: "gamalytic_copies_sold",
    units_estimate: unitsEstimate,
    units_lower: unitsLower,
    units_upper: unitsUpper,
    source_url: gamalyticUrl(appId)
  };
}

async function fetchApiItem(product, appId) {
  const response = await fetch(`https://api.gamalytic.com/game/${appId}`, {
    headers: {
      Accept: "application/json",
      "api-key": apiKey
    }
  });
  if (response.status === 404) {
    return unavailableItem(product, appId, "gamalytic_record_unavailable");
  }
  if (!response.ok) {
    throw new Error(`Gamalytic API HTTP ${response.status} · ${product.name}`);
  }
  const payload = await response.json();
  const copiesSold = Number(payload.copiesSold);
  if (!Number.isFinite(copiesSold) || copiesSold < 0) {
    return unavailableItem(product, appId, "gamalytic_copies_sold_unavailable");
  }
  return {
    product_id: product.id,
    steam_app_id: appId,
    status: "estimated",
    estimate_method: "gamalytic_api",
    metric: "gamalytic_copies_sold",
    units_estimate: Math.round(copiesSold),
    units_lower: null,
    units_upper: null,
    source_url: gamalyticUrl(appId)
  };
}

if (!USE_PUBLIC_SNAPSHOT && !apiKey) {
  throw new Error(
    "需要设置 GAMALYTIC_API_KEY；若只想重建 2026-08-01 的已核对公开页快照，请添加 --use-public-snapshot。"
  );
}

const items = [];
for (const [index, product] of products.entries()) {
  const appId = steamAppId(product);
  if (!appId) {
    items.push(unavailableItem(product, null, "missing_steam_app_id"));
  } else if (USE_PUBLIC_SNAPSHOT) {
    items.push(publicSnapshotItem(product, appId));
  } else {
    items.push(await fetchApiItem(product, appId));
  }
  console.log(`[${index + 1}/${products.length}] ${product.name}`);
}

const fetchedAt = USE_PUBLIC_SNAPSHOT
  ? `${PUBLIC_SNAPSHOT_DATE}T00:00:00.000Z`
  : new Date().toISOString();

const snapshot = {
  version: `gamalytic-${fetchedAt.slice(0, 10)}`,
  source: {
    name: "Gamalytic",
    page_url: "https://gamalytic.com/",
    api_url: "https://api.gamalytic.com/game/{steamId}",
    metric: "copiesSold",
    fetched_at: fetchedAt,
    note: "统一采用 Gamalytic 的 Copies sold 估算。该指标表示直接在 Steam 购买的预估份数，不包含通过 Steam Key 激活的份数；公开页区间不是官方销量或统计置信区间。"
  },
  items
};

await writeFile(outputUrl, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
console.log(`Saved ${items.length} Gamalytic sales records to ${outputUrl.pathname}`);
