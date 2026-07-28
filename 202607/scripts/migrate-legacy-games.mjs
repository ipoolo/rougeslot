import { readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const scriptRoot = dirname(fileURLToPath(import.meta.url));
const paths = {
  legacy: new URL("../../data/games.json", import.meta.url),
  products: new URL("../data/products.json", import.meta.url),
  observations: new URL("../data/product-formula-observations.json", import.meta.url),
  snapshot: new URL("../data/legacy-v5-snapshot.json", import.meta.url),
  samples: new URL("../data/design-samples.json", import.meta.url),
  report: new URL("../data/migration-report.json", import.meta.url)
};

const dryRun = process.argv.includes("--check");
const importedAt = "2026-07-25";
const designSampleSlugs = new Set(["dice-eight-poker-proposal"]);

async function readJson(url) {
  return JSON.parse(await readFile(url, "utf8"));
}

async function writeJson(url, value) {
  const target = fileURLToPath(url);
  const temporary = `${target}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(temporary, target);
}

function productId(slug) {
  return `product.${slug}`;
}

function productClassificationStatus(product) {
  if (product.variant_ids?.length || product.prototype_ids?.length) {
    return "confirmed";
  }
  if (product.mother_ids?.length) {
    return "partial";
  }
  return "unreviewed";
}

function normalizeLegacyProduct(game, order, existing) {
  const { basic, analysis } = game;
  const observedMechanics = [
    basic.core_loop_oneliner,
    analysis.qualitative.show_topology
      ? `Show_TP：${analysis.qualitative.show_topology}`
      : null,
    analysis.qualitative.put_form
      ? `Put：${analysis.qualitative.put_form}`
      : null,
    analysis.qualitative.combo_predicate?.length
      ? `C₁：${analysis.qualitative.combo_predicate.join(" + ")}`
      : null
  ].filter(Boolean);

  const imported = {
    id: productId(game.slug),
    name: basic.name_cn || basic.name_en,
    name_en: basic.name_en || "",
    type: "product",
    record_type: "game",
    status: "legacy_imported",
    order,
    relation_types: [],
    mother_ids: [],
    prototype_ids: [],
    variant_ids: [],
    classification_status: "unreviewed",
    summary: basic.core_loop_oneliner || analysis.summary,
    source_url: basic.steam_url,
    header_image_url: basic.header_url || "",
    developer: basic.developer || "",
    release_year: basic.release_year ?? null,
    tags: basic.tags ?? [],
    core_loop: basic.core_loop_oneliner || "",
    observed_mechanics: observedMechanics,
    classification_note: "从旧版 v5 游戏库导入；尚未按“机制母型 → 品类原型 → 品类变体”完成人工分类。",
    legacy_source: {
      slug: game.slug,
      framework_version: analysis.framework_version,
      analysis_updated_at: analysis.updated_at,
      imported_at: importedAt
    },
    evidence: [
      "基础资料与分析内容来自旧版 data/games.json。",
      "旧版字段已机械映射到新版公式观察表，但映射结果尚未人工确认。"
    ]
  };

  if (!existing) return imported;

  const merged = {
    ...imported,
    ...existing,
    name_en: existing.name_en || imported.name_en,
    source_url: existing.source_url || imported.source_url,
    header_image_url: existing.header_image_url || imported.header_image_url,
    developer: existing.developer || imported.developer,
    release_year: existing.release_year ?? imported.release_year,
    tags: existing.tags?.length ? existing.tags : imported.tags,
    core_loop: existing.core_loop || imported.core_loop,
    observed_mechanics: existing.observed_mechanics?.length
      ? existing.observed_mechanics
      : imported.observed_mechanics,
    legacy_source: imported.legacy_source
  };
  merged.classification_status = productClassificationStatus(merged);
  return merged;
}

function formulaObservations(game) {
  const { qualitative, pressure_params: pressure, scores, summary } = game.analysis;
  const checkpoint = qualitative.checkpoint_mechanism;
  const field = (value, sourceFields) => ({
    value: value || "旧版资料未记录；等待按新版字段人工拆解。",
    source_fields: sourceFields,
    review_status: "draft"
  });
  const pressureSummary = Object.entries(pressure ?? {})
    .filter(([, value]) => value !== null && value !== undefined && value !== "")
    .map(([key, value]) => `${key}=${typeof value === "object" ? JSON.stringify(value) : value}`)
    .join(" · ");

  return {
    product_id: productId(game.slug),
    legacy_slug: game.slug,
    mapping_status: "mechanical_import_unconfirmed",
    review_status: "draft",
    fields: {
      P_t: field(
        [
          checkpoint ? `目标检查：${checkpoint}` : null,
          pressureSummary ? `旧版压力参数：${pressureSummary}` : null,
          "注意：旧版 pressure_params.N 属于压力检查资料，不直接等于新版公式中触发 BD 的 N。"
        ].filter(Boolean).join("；"),
        [
          "analysis.qualitative.checkpoint_mechanism",
          "analysis.pressure_params"
        ]
      ),
      Pool_Symbol: field(
        qualitative.pool_base_desc,
        ["analysis.qualitative.pool_base_desc"]
      ),
      Random: field(
        qualitative.random_design,
        ["analysis.qualitative.random_design"]
      ),
      Put: field(
        qualitative.put_form,
        ["analysis.qualitative.put_form"]
      ),
      Show_TP: field(
        qualitative.show_topology,
        ["analysis.qualitative.show_topology"]
      ),
      C1: field(
        [
          qualitative.combo_synergy,
          qualitative.combo_predicate?.length
            ? `判定：${qualitative.combo_predicate.join("、")}`
            : null
        ].filter(Boolean).join("；"),
        [
          "analysis.qualitative.combo_synergy",
          "analysis.qualitative.combo_predicate"
        ]
      ),
      C2: field(
        qualitative.combo_modifier,
        ["analysis.qualitative.combo_modifier"]
      ),
      N: field(
        "待按新版定义确认：N 只表示触发一次 BD 之前连续发生的 Spin 数量；旧版目标压力检查周期不再直接映射到 N。",
        [
          "新版迁移规则：N 与 P(t) 分离"
        ]
      ),
      BD: field(
        qualitative.rpbd_construction,
        [
          "analysis.qualitative.rpbd_construction"
        ]
      )
    },
    legacy_scores: scores,
    legacy_summary: summary,
    supplemental: {
      pool_active_desc: qualitative.pool_active_desc,
      pressure_params: game.analysis.pressure_params
    },
    source: {
      framework_version: game.analysis.framework_version,
      analysis_updated_at: game.analysis.updated_at
    }
  };
}

function normalizeDesignSample(game) {
  return {
    id: `sample.${game.slug}`,
    record_type: "design_sample",
    name: game.basic.name_cn || game.basic.name_en,
    name_en: game.basic.name_en || "",
    source_url: game.basic.steam_url,
    summary: game.basic.core_loop_oneliner || game.analysis.summary,
    legacy_source: {
      slug: game.slug,
      framework_version: game.analysis.framework_version
    },
    legacy_analysis: game.analysis
  };
}

const legacyDocument = await readJson(paths.legacy);
const currentProductsDocument = await readJson(paths.products);
const currentObservationsDocument = await readJson(paths.observations);
const sourceGames = legacyDocument.games;
const formalGames = sourceGames.filter((game) => !designSampleSlugs.has(game.slug));
const designSamples = sourceGames.filter((game) => designSampleSlugs.has(game.slug));
const existingById = new Map(
  currentProductsDocument.items.map((product) => [product.id, product])
);

const importedProducts = formalGames.map((game, index) => {
  const existing = existingById.get(productId(game.slug));
  return normalizeLegacyProduct(game, existing?.order ?? 100 + index * 10, existing);
});

const sourceProductIds = new Set(importedProducts.map((product) => product.id));
const newOnlyProducts = currentProductsDocument.items.filter(
  (product) => !sourceProductIds.has(product.id)
);

const products = [...importedProducts, ...newOnlyProducts]
  .map((product) => ({
    ...product,
    record_type: product.record_type ?? "game",
    classification_status: product.classification_status
      ?? productClassificationStatus(product)
  }))
  .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, "zh-CN"));

const importedObservations = formalGames.map(formulaObservations);
const importedObservationProductIds = new Set(
  importedObservations.map((observation) => observation.product_id)
);
const retainedNewObservations = currentObservationsDocument.items.filter(
  (observation) => !importedObservationProductIds.has(observation.product_id)
);
const observations = [...importedObservations, ...retainedNewObservations];
const samples = designSamples.map(normalizeDesignSample);

const missingMetadata = {
  developer: sourceGames.filter((game) => !game.basic.developer).map((game) => game.slug),
  release_year: sourceGames.filter((game) => !game.basic.release_year).map((game) => game.slug),
  header_image_url: sourceGames.filter((game) => !game.basic.header_url).map((game) => game.slug)
};

const report = {
  version: "202607-migration.1",
  generated_at: importedAt,
  source: {
    path: "data/games.json",
    framework_version: legacyDocument.framework_version,
    updated_at: legacyDocument.updated_at,
    total_records: sourceGames.length
  },
  result: {
    formal_legacy_games: formalGames.length,
    design_samples: samples.length,
    merged_existing_products: importedProducts.filter(
      (product) => product.status !== "legacy_imported"
    ).length,
    newly_imported_products: importedProducts.filter(
      (product) => product.status === "legacy_imported"
    ).length,
    retained_new_products: newOnlyProducts.length,
    final_formal_products: products.length,
    retained_new_formula_observations: retainedNewObservations.length,
    formula_observation_records: observations.length
  },
  classification: {
    confirmed: products.filter((product) => product.classification_status === "confirmed").length,
    partial: products.filter((product) => product.classification_status === "partial").length,
    unreviewed: products.filter((product) => product.classification_status === "unreviewed").length,
    note: "迁移程序不会根据旧版标签自动确认任何新的原型分类。"
  },
  missing_metadata: missingMetadata,
  deduplication: [
    {
      legacy_slug: "luck-be-a-landlord",
      target_product_id: "product.luck-be-a-landlord",
      action: "merge",
      note: "保留新版已确认的 Slot母体 → Slot改·数值型 → 幸运房东关系，并补入旧版基础资料与分析来源。"
    },
    {
      legacy_slug: "lucky-mayor",
      target_product_id: "product.lucky-mayor",
      action: "merge_alias",
      note: "将早期占位名称“幸运城市”并入 Steam 官方名称《幸运市长》，保留旧版完整资料并确认其为 0D 多重集品类变体实例。"
    }
  ],
  output_files: [
    "202607/data/products.json",
    "202607/data/product-formula-observations.json",
    "202607/data/legacy-v5-snapshot.json",
    "202607/data/design-samples.json",
    "202607/data/migration-report.json"
  ]
};

const output = {
  products: {
    version: "202607-draft.7",
    migration: {
      source: "data/games.json",
      imported_at: importedAt,
      policy: "legacy_snapshot_copy_no_runtime_dependency"
    },
    items: products
  },
  observations: {
    version: "202607-draft.3",
    mapping_policy: "legacy_mechanical_import_plus_retained_new_product_observations",
    formula_fields: [
      "P_t",
      "Pool_Symbol",
      "Random",
      "Put",
      "Show_TP",
      "C1",
      "C2",
      "N",
      "BD"
    ],
    items: observations
  },
  snapshot: {
    snapshot_version: "202607-legacy-v5.1",
    source_path: "data/games.json",
    copied_at: importedAt,
    source_document: legacyDocument
  },
  samples: {
    version: "202607-draft.1",
    items: samples
  },
  report
};

if (!dryRun) {
  await Promise.all([
    writeJson(paths.products, output.products),
    writeJson(paths.observations, output.observations),
    writeJson(paths.snapshot, output.snapshot),
    writeJson(paths.samples, output.samples),
    writeJson(paths.report, output.report)
  ]);
}

console.log(JSON.stringify({
  valid: true,
  dry_run: dryRun,
  script_root: scriptRoot,
  ...report.result,
  classification: report.classification,
  missing_metadata: report.missing_metadata
}, null, 2));
