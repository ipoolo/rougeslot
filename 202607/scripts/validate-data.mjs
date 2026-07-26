import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const files = {
  mechanisms: "data/mechanism-archetypes.json",
  prototypes: "data/category-prototypes.json",
  variants: "data/category-variants.json",
  products: "data/products.json",
  observations: "data/product-formula-observations.json",
  samples: "data/design-samples.json"
};

const data = {};
for (const [key, path] of Object.entries(files)) {
  data[key] = JSON.parse(await readFile(new URL(path, root), "utf8")).items;
}

const errors = [];
const ids = new Map();
const allowedOperations = new Set([
  "inherit",
  "default",
  "restrict",
  "fix",
  "disable",
  "override",
  "extend",
  "compose"
]);
const allowedReviewStatuses = new Set(["draft", "pending", "confirmed"]);
const formulaFields = [
  "Pool_Symbol",
  "Random",
  "Put",
  "Show_TP",
  "C1",
  "C2",
  "N",
  "BD"
];

for (const [collection, items] of Object.entries(data)) {
  for (const item of items) {
    if (collection === "observations" || collection === "samples") continue;
    if (ids.has(item.id)) {
      errors.push(`重复 ID：${item.id}`);
    }
    ids.set(item.id, { collection, item });
  }
}

for (const prototype of data.prototypes) {
  const parent = ids.get(prototype.primary_mother_id);
  if (!parent) {
    errors.push(`${prototype.id} 缺失机制母型：${prototype.primary_mother_id}`);
  } else if (parent.collection !== "mechanisms") {
    errors.push(`${prototype.id} 的 primary_mother_id 必须指向机制母型`);
  }
}

for (const variant of data.variants) {
  const parent = ids.get(variant.prototype_id);
  if (!parent) {
    errors.push(`${variant.id} 缺失品类原型：${variant.prototype_id}`);
  } else if (parent.collection !== "prototypes") {
    errors.push(`${variant.id} 的 prototype_id 必须指向品类原型`);
  }
}

for (const product of data.products) {
  for (const [collection, relationIds] of [
    ["mechanisms", product.mother_ids],
    ["prototypes", product.prototype_ids],
    ["variants", product.variant_ids]
  ]) {
    for (const relationId of relationIds) {
      const target = ids.get(relationId);
      if (!target) {
        errors.push(`${product.id} 的关系指向不存在：${relationId}`);
      } else if (target.collection !== collection) {
        errors.push(`${product.id} 的关系类型错误：${relationId}`);
      }
    }
  }
}

const productIds = new Set(data.products.map((product) => product.id));
const observationProductIds = new Set();
for (const observation of data.observations) {
  if (!productIds.has(observation.product_id)) {
    errors.push(`产品公式观察指向不存在：${observation.product_id}`);
  }
  if (observationProductIds.has(observation.product_id)) {
    errors.push(`产品公式观察重复：${observation.product_id}`);
  }
  observationProductIds.add(observation.product_id);
  for (const field of formulaFields) {
    if (!observation.fields?.[field]?.value) {
      errors.push(`${observation.product_id} 缺少产品公式观察：${field}`);
    }
  }
}

for (const node of [
  ...data.mechanisms.map((item) => ({
    id: item.id,
    fingerprint: item.formula_constraints
  })),
  ...data.prototypes.map((item) => ({
    id: item.id,
    fingerprint: item.formula_changes
  })),
  ...data.variants.map((item) => ({
    id: item.id,
    fingerprint: item.formula_changes
  }))
]) {
  for (const field of formulaFields) {
    if (!node.fingerprint?.[field]) {
      errors.push(`${node.id} 缺少公式字段：${field}`);
    } else if (!allowedOperations.has(node.fingerprint[field].operation)) {
      errors.push(
        `${node.id}.${field} 使用未知约束操作：${node.fingerprint[field].operation}`
      );
    } else if (
      node.fingerprint[field].review_status
      && !allowedReviewStatuses.has(node.fingerprint[field].review_status)
    ) {
      errors.push(
        `${node.id}.${field} 使用未知确认状态：${node.fingerprint[field].review_status}`
      );
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

const counts = {
  mechanism_archetypes: data.mechanisms.length,
  category_prototypes: data.prototypes.length,
  category_variants: data.variants.length,
  products: productIds.size,
  product_formula_observations: data.observations.length,
  design_samples: data.samples.length
};

console.log(JSON.stringify({ valid: true, counts }, null, 2));
