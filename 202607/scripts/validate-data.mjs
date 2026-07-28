import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const files = {
  mechanisms: "data/mechanism-archetypes.json",
  prototypes: "data/category-prototypes.json",
  variants: "data/category-variants.json",
  products: "data/products.json",
  observations: "data/product-formula-observations.json",
  ecosystems: "data/category-ecosystems.json",
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
  "P_t",
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
    if (collection === "observations" || collection === "ecosystems" || collection === "samples") continue;
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
  if ((product.prototype_ids ?? []).length > 1) {
    errors.push(`${product.id} 同时归属于多个品类原型；当前规则要求一个游戏只属于一个品类原型`);
  }
  if ((product.prototype_ids ?? []).length > 0 && (product.variant_ids ?? []).length !== 1) {
    errors.push(`${product.id} 已归类但没有且仅有一个对应的游戏变体`);
  }
  if ((product.prototype_ids ?? []).length === 0 && (product.variant_ids ?? []).length > 0) {
    errors.push(`${product.id} 没有品类原型却仍关联品类变体`);
  }
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
  const variant = data.variants.find((item) => item.id === (product.variant_ids ?? [])[0]);
  if (variant) {
    if (!(variant.product_ids ?? []).includes(product.id)) {
      errors.push(`${product.id} 指向的品类变体没有反向关联该游戏：${variant.id}`);
    }
    if (variant.prototype_id !== (product.prototype_ids ?? [])[0]) {
      errors.push(`${product.id} 的品类原型与品类变体父级不一致`);
    }
  }
}

const productIds = new Set(data.products.map((product) => product.id));

for (const prototype of data.prototypes) {
  for (const productId of prototype.representative_product_ids ?? []) {
    const product = ids.get(productId);
    if (!product || product.collection !== "products") {
      errors.push(`${prototype.id} 的代表产品不存在：${productId}`);
    } else if (!product.item.prototype_ids.includes(prototype.id)) {
      errors.push(`${prototype.id} 的代表产品未反向关联该品类原型：${productId}`);
    } else {
      const cornerstoneVariant = data.variants.find((variant) =>
        variant.prototype_id === prototype.id
        && variant.variant_role === "cornerstone"
        && (variant.product_ids ?? []).includes(productId)
      );
      if (!cornerstoneVariant) {
        errors.push(`${prototype.id} 的基石产品必须作为基石变体计入品类变体：${productId}`);
      } else if (!product.item.variant_ids.includes(cornerstoneVariant.id)) {
        errors.push(`${prototype.id} 的基石产品未反向关联基石变体：${productId}`);
      }
    }
  }
}

for (const variant of data.variants) {
  if ((variant.product_ids ?? []).length !== 1) {
    errors.push(`${variant.id} 必须且只能对应一款具体游戏`);
  }
  for (const productId of variant.product_ids ?? []) {
    const product = ids.get(productId);
    if (!product || product.collection !== "products") {
      errors.push(`${variant.id} 的变体产品不存在：${productId}`);
    } else if (!product.item.variant_ids.includes(variant.id)) {
      errors.push(`${variant.id} 的产品未反向关联该品类变体：${productId}`);
    } else if (!product.item.prototype_ids.includes(variant.prototype_id)) {
      errors.push(`${variant.id} 的产品没有归属于该变体的品类原型：${productId}`);
    }
  }
  if (variant.variant_role === "cornerstone") {
    const prototype = data.prototypes.find((item) => item.id === variant.prototype_id);
    for (const productId of variant.product_ids ?? []) {
      if (!(prototype?.representative_product_ids ?? []).includes(productId)) {
        errors.push(`${variant.id} 的基石产品未被所属品类原型标记为代表产品：${productId}`);
      }
    }
  }
}

const ecosystemPrototypeIds = new Set();
for (const ecosystem of data.ecosystems) {
  const prototype = ids.get(ecosystem.prototype_id);
  if (!prototype || prototype.collection !== "prototypes") {
    errors.push(`品类生态指向不存在的品类原型：${ecosystem.prototype_id}`);
  }
  if (ecosystemPrototypeIds.has(ecosystem.prototype_id)) {
    errors.push(`品类生态重复定义品类原型：${ecosystem.prototype_id}`);
  }
  ecosystemPrototypeIds.add(ecosystem.prototype_id);
  if (!productIds.has(ecosystem.cornerstone_product_id)) {
    errors.push(`${ecosystem.prototype_id} 的基石产品不存在：${ecosystem.cornerstone_product_id}`);
  } else {
    const cornerstone = data.products.find((product) => product.id === ecosystem.cornerstone_product_id);
    if (!(cornerstone?.prototype_ids ?? []).includes(ecosystem.prototype_id)) {
      errors.push(`${ecosystem.prototype_id} 的基石产品没有归属于该品类原型`);
    }
  }
  for (const axisKey of ["x", "y"]) {
    const axis = ecosystem.axes?.[axisKey];
    if (!axis?.label || !axis.low || !axis.high) {
      errors.push(`${ecosystem.prototype_id} 缺少完整的 ${axisKey} 轴定义`);
    }
    for (const field of axis?.source_fields ?? []) {
      if (!formulaFields.includes(field)) {
        errors.push(`${ecosystem.prototype_id}.${axisKey} 轴使用未知公式字段：${field}`);
      }
    }
  }
  const positionedProductIds = new Set();
  for (const position of ecosystem.positions ?? []) {
    if (!productIds.has(position.product_id)) {
      errors.push(`${ecosystem.prototype_id} 的定位产品不存在：${position.product_id}`);
    } else {
      const product = data.products.find((item) => item.id === position.product_id);
      if (!(product?.prototype_ids ?? []).includes(ecosystem.prototype_id)) {
        errors.push(`${ecosystem.prototype_id} 定位了不属于本品类的产品：${position.product_id}`);
      }
    }
    if (positionedProductIds.has(position.product_id)) {
      errors.push(`${ecosystem.prototype_id} 重复定位产品：${position.product_id}`);
    }
    positionedProductIds.add(position.product_id);
    if (
      !Number.isFinite(position.x)
      || !Number.isFinite(position.y)
      || position.x < 0
      || position.x > 100
      || position.y < 0
      || position.y > 100
    ) {
      errors.push(`${ecosystem.prototype_id}.${position.product_id} 的二维坐标必须位于 0–100`);
    }
    for (const field of position.changed_fields ?? []) {
      if (!formulaFields.includes(field)) {
        errors.push(`${ecosystem.prototype_id}.${position.product_id} 使用未知变化字段：${field}`);
      }
    }
  }
  const categoryProductIds = data.products
    .filter((product) => (product.prototype_ids ?? []).includes(ecosystem.prototype_id))
    .map((product) => product.id);
  for (const productId of categoryProductIds) {
    if (!positionedProductIds.has(productId)) {
      errors.push(`${ecosystem.prototype_id} 尚未记录产品定位状态：${productId}`);
    }
  }
  for (const niche of ecosystem.niches ?? []) {
    if (
      !Number.isFinite(niche.x)
      || !Number.isFinite(niche.y)
      || niche.x < 0
      || niche.x > 100
      || niche.y < 0
      || niche.y > 100
    ) {
      errors.push(`${ecosystem.prototype_id}.${niche.id} 的生态位坐标必须位于 0–100`);
    }
  }
  const innovationIds = new Set();
  for (const innovation of ecosystem.innovations ?? []) {
    if (innovationIds.has(innovation.id)) {
      errors.push(`${ecosystem.prototype_id} 重复定义创新记录：${innovation.id}`);
    }
    innovationIds.add(innovation.id);
    if (!productIds.has(innovation.product_id)) {
      errors.push(`${ecosystem.prototype_id} 的创新记录指向不存在的产品：${innovation.product_id}`);
    } else {
      const product = data.products.find((item) => item.id === innovation.product_id);
      if (!(product?.prototype_ids ?? []).includes(ecosystem.prototype_id)) {
        errors.push(`${ecosystem.prototype_id} 的创新产品不属于当前品类：${innovation.product_id}`);
      }
    }
    if (!formulaFields.includes(innovation.primary_field)) {
      errors.push(`${ecosystem.prototype_id}.${innovation.id} 使用未知主要字段：${innovation.primary_field}`);
    }
    for (const field of innovation.related_fields ?? []) {
      if (!formulaFields.includes(field)) {
        errors.push(`${ecosystem.prototype_id}.${innovation.id} 使用未知关联字段：${field}`);
      }
    }
    if (!innovation.baseline_flow || !innovation.variant_flow || !innovation.summary) {
      errors.push(`${ecosystem.prototype_id}.${innovation.id} 缺少完整创新对比内容`);
    }
  }
}

for (const prototype of data.prototypes) {
  if (!ecosystemPrototypeIds.has(prototype.id)) {
    errors.push(`品类原型缺少品类生态分析配置：${prototype.id}`);
  }
}

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
  category_ecosystems: data.ecosystems.length,
  design_samples: data.samples.length
};

console.log(JSON.stringify({ valid: true, counts }, null, 2));
