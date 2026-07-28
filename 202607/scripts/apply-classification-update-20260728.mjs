import { readFile, writeFile } from "node:fs/promises";

const dataRoot = new URL("../data/", import.meta.url);
const paths = {
  products: new URL("products.json", dataRoot),
  prototypes: new URL("category-prototypes.json", dataRoot),
  variants: new URL("category-variants.json", dataRoot),
  observations: new URL("product-formula-observations.json", dataRoot),
  ecosystems: new URL("category-ecosystems.json", dataRoot),
  changeLog: new URL("change-log.json", dataRoot)
};

const documents = Object.fromEntries(await Promise.all(
  Object.entries(paths).map(async ([key, path]) => [
    key,
    JSON.parse(await readFile(path, "utf8"))
  ])
));

const timestamp = "2026-07-28T14:30:00.000Z";
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

const prototypeNames = new Map(
  documents.prototypes.items.map((item) => [item.id, item.name])
);

const newProducts = [
  {
    id: "product.devils-due",
    name: "Devils Due",
    name_en: "Devils Due",
    prototype_id: "prototype.slot-plus-numeric"
  },
  {
    id: "product.peglotto-demo",
    name: "PegLotto! Demo",
    name_en: "PegLotto! Demo",
    prototype_id: "prototype.slot-plus-numeric"
  },
  {
    id: "product.spin-tactics-demo",
    name: "Spin Tactics Demo",
    name_en: "Spin Tactics Demo",
    prototype_id: "prototype.slot-plus-numeric"
  },
  {
    id: "product.lever-warrior-bow-and-magic",
    name: "拉杆战士：弓箭与魔法",
    name_en: "",
    prototype_id: "prototype.slot-transform-combat"
  },
  {
    id: "product.hoptale-demo",
    name: "Hoptale Demo",
    name_en: "Hoptale Demo",
    prototype_id: "prototype.slot-transform-combat"
  },
  {
    id: "product.re-spin-die-repeat-demo",
    name: "Re: Spin. Die. Repeat. Demo",
    name_en: "Re: Spin. Die. Repeat. Demo",
    prototype_id: "prototype.slot-numeric"
  }
];

const classificationGroups = {
  "prototype.slot-plus-combat": [
    "product.slotbound-demo"
  ],
  "prototype.slot-plus-numeric": [
    "product.spinera",
    "product.runeborn",
    "product.cloverpit",
    "product.devils-due",
    "product.peglotto-demo",
    "product.spin-tactics-demo"
  ],
  "prototype.slot-transform-combat": [
    "product.dog-and-goblin",
    "product.spin-hero",
    "product.lever-warrior-bow-and-magic",
    "product.slots-and-daggers",
    "product.endgame-of-devil",
    "product.lucky-hunter",
    "product.lucky-hero",
    "product.hoptale-demo",
    "product.rogue-slots",
    "product.slot-or-not",
    "product.spinny-dungeon"
  ],
  "prototype.slot-numeric": [
    "product.crop-rotation",
    "product.cat-god-ranch",
    "product.die-shou-wei-cheng",
    "product.luckland",
    "product.lucky-island",
    "product.luck-be-a-landlord",
    "product.lucky-mayor",
    "product.re-spin-die-repeat-demo"
  ]
};

const cornerstoneIds = new Set(
  documents.prototypes.items.flatMap((prototype) =>
    prototype.representative_product_ids ?? []
  )
);

let nextProductOrder = Math.max(
  0,
  ...documents.products.items.map((item) => Number(item.order) || 0)
) + 10;
const newlyAddedProductIds = new Set();

for (const input of newProducts) {
  if (documents.products.items.some((item) => item.id === input.id)) continue;
  const prototypeName = prototypeNames.get(input.prototype_id);
  documents.products.items.push({
    id: input.id,
    name: input.name,
    name_en: input.name_en,
    type: "product",
    record_type: "game",
    status: "classification_confirmed_content_pending",
    order: nextProductOrder,
    relation_types: ["variant_instance"],
    mother_ids: ["mechanism.slot"],
    prototype_ids: [input.prototype_id],
    variant_ids: [`variant.${input.id.replace("product.", "")}`],
    classification_status: "confirmed",
    summary: `已依据最新分类清单归入“${prototypeName}”；具体玩法与公式字段等待补录。`,
    source_url: "",
    header_image_url: "",
    developer: "",
    release_year: null,
    tags: ["Slot", "待补充资料"],
    core_loop: "待补录",
    observed_mechanics: [],
    classification_note: `用户于 2026-07-28 通过最新分类清单确认该游戏属于“${prototypeName}”。`,
    evidence: ["用户提供的 2026-07-28 最新品类分类截图。"],
    last_classified_at: timestamp
  });
  newlyAddedProductIds.add(input.id);
  nextProductOrder += 10;
}

const targetPrototypeByProduct = new Map(
  Object.entries(classificationGroups).flatMap(([prototypeId, productIds]) =>
    productIds.map((productId) => [productId, prototypeId])
  )
);
const productsById = new Map(
  documents.products.items.map((item) => [item.id, item])
);
const variantsByProductId = new Map(
  documents.variants.items.flatMap((variant) =>
    (variant.product_ids ?? []).map((productId) => [productId, variant])
  )
);

function inheritedFormula(productName, prototypeName) {
  return Object.fromEntries(formulaFields.map((field) => [
    field,
    {
      operation: "inherit",
      constraint_label: "继承品类原型",
      summary: `${productName}暂时继承“${prototypeName}”的 ${field} 有效结果；等待人工拆解与确认。`,
      review_status: "pending",
      review_note: "依据最新分类清单建立结构，具体公式差异尚未人工确认。"
    }
  ]));
}

let nextVariantOrder = Math.max(
  0,
  ...documents.variants.items.map((item) => Number(item.order) || 0)
) + 10;
const changes = [];

for (const [productId, prototypeId] of targetPrototypeByProduct) {
  const product = productsById.get(productId);
  if (!product) throw new Error(`分类清单中的游戏不存在：${productId}`);
  const prototypeName = prototypeNames.get(prototypeId);
  const before = {
    prototype_ids: [...(product.prototype_ids ?? [])],
    variant_ids: [...(product.variant_ids ?? [])],
    relation_types: [...(product.relation_types ?? [])]
  };
  const isCornerstone = cornerstoneIds.has(productId);
  let variant = variantsByProductId.get(productId);

  if (!variant) {
    variant = {
      id: `variant.${productId.replace("product.", "")}`,
      name: product.name,
      type: "category_variant",
      variant_role: isCornerstone ? "cornerstone" : "product_variant",
      status: "structure_ready_content_pending",
      order: nextVariantOrder,
      prototype_id: prototypeId,
      product_ids: [productId],
      summary: isCornerstone
        ? `“${prototypeName}”的基石变体：作为品类公式比较基准，默认继承品类原型约束。`
        : `“${prototypeName}”下的具体游戏变体：具体公式差异等待人工拆解。`,
      definition: `本节点以《${product.name}》作为“${prototypeName}”下的具体游戏变体。默认继承品类原型的全部公式字段；请在公式数据表中逐项确认它相对原型的变化。`,
      formula_changes: inheritedFormula(product.name, prototypeName),
      inheritance_summary: {
        inherited_fields: 9,
        changed_fields: 0,
        note: "依据最新分类清单建立结构，默认继承全部父级字段，等待人工比较。"
      },
      created_at: timestamp
    };
    documents.variants.items.push(variant);
    variantsByProductId.set(productId, variant);
    nextVariantOrder += 10;
  } else if (variant.prototype_id !== prototypeId) {
    variant.prototype_id = prototypeId;
    variant.summary = `“${prototypeName}”下的具体游戏变体：已按最新分类清单调整父级，公式差异等待重新确认。`;
    variant.definition = `本节点以《${product.name}》作为“${prototypeName}”下的具体游戏变体。其父级已按最新分类调整，请重新确认相对原型的公式变化。`;
    variant.updated_at = timestamp;
    for (const [field, entry] of Object.entries(variant.formula_changes ?? {})) {
      entry.review_status = "pending";
      entry.review_note = [
        entry.review_note,
        `2026-07-28 调整所属品类为“${prototypeName}”，需要重新确认。`
      ].filter(Boolean).join(" ");
      if (entry.operation === "inherit") {
        entry.constraint_label = "继承新原型";
        entry.summary = `${product.name}暂时继承“${prototypeName}”的 ${field} 有效结果；等待人工复核。`;
      }
    }
  }

  variant.variant_role = isCornerstone ? "cornerstone" : "product_variant";
  product.relation_types = isCornerstone
    ? ["source", "representative"]
    : ["variant_instance"];
  product.mother_ids = ["mechanism.slot"];
  product.prototype_ids = [prototypeId];
  product.variant_ids = [variant.id];
  product.classification_status = "confirmed";
  product.classification_note = `用户于 2026-07-28 通过最新分类清单确认该游戏属于“${prototypeName}”。`;
  product.last_classified_at = timestamp;

  const changed = before.prototype_ids[0] !== prototypeId
    || before.variant_ids[0] !== variant.id;
  if (changed || newlyAddedProductIds.has(productId)) {
    changes.push({
      id: `change.202607281430.${productId.replace("product.", "")}`,
      timestamp,
      action: "apply_latest_category_classification",
      product_id: productId,
      product_name: product.name,
      before,
      after: {
        prototype_ids: product.prototype_ids,
        variant_ids: product.variant_ids,
        relation_types: product.relation_types
      },
      note: "依据用户提供的最新四组分类截图同步。"
    });
  }
}

function pendingObservation(product) {
  return {
    product_id: product.id,
    mapping_status: "classification_confirmed_content_pending",
    review_status: "draft",
    fields: Object.fromEntries(formulaFields.map((field) => [
      field,
      {
        value: `待拆解：已确认《${product.name}》的品类归属，${field} 的具体表现尚待补录。`,
        source_fields: ["用户提供的 2026-07-28 最新品类分类截图"],
        review_status: "pending"
      }
    ])),
    source: {
      framework_version: "202607",
      analysis_updated_at: "2026-07-28"
    }
  };
}

for (const input of newProducts) {
  if (documents.observations.items.some((item) => item.product_id === input.id)) continue;
  documents.observations.items.push(pendingObservation(productsById.get(input.id)));
}

const ecosystemPositions = {
  "prototype.slot-plus-combat": {
    "product.slotbound-demo": [82, 82, "cornerstone", "confirmed"]
  },
  "prototype.slot-plus-numeric": {
    "product.cloverpit": [88, 90, "cornerstone", "confirmed"],
    "product.spinera": [28, 48, "member", "draft"],
    "product.runeborn": [74, 72, "member", "draft"],
    "product.devils-due": [52, 58, "member", "pending"],
    "product.peglotto-demo": [18, 66, "member", "pending"],
    "product.spin-tactics-demo": [46, 34, "member", "pending"]
  },
  "prototype.slot-transform-combat": {
    "product.endgame-of-devil": [78, 55, "cornerstone", "confirmed"],
    "product.spin-hero": [18, 84, "member", "confirmed"],
    "product.lucky-hero": [48, 78, "member", "draft"],
    "product.lucky-hunter": [68, 34, "member", "draft"],
    "product.dog-and-goblin": [88, 16, "member", "draft"],
    "product.slots-and-daggers": [26, 56, "member", "draft"],
    "product.spinny-dungeon": [88, 84, "member", "draft"],
    "product.slot-or-not": [68, 58, "member", "draft"],
    "product.rogue-slots": [44, 46, "member", "pending"],
    "product.lever-warrior-bow-and-magic": [34, 70, "member", "pending"],
    "product.hoptale-demo": [58, 66, "member", "pending"]
  },
  "prototype.slot-numeric": {
    "product.luck-be-a-landlord": [44, 74, "cornerstone", "confirmed"],
    "product.lucky-mayor": [62, 14, "member", "confirmed"],
    "product.cat-god-ranch": [88, 88, "member", "confirmed"],
    "product.luckland": [70, 76, "member", "draft"],
    "product.lucky-island": [54, 46, "member", "draft"],
    "product.die-shou-wei-cheng": [24, 58, "member", "draft"],
    "product.crop-rotation": [80, 28, "member", "draft"],
    "product.re-spin-die-repeat-demo": [38, 34, "member", "pending"]
  }
};

for (const ecosystem of documents.ecosystems.items) {
  const desired = ecosystemPositions[ecosystem.prototype_id];
  if (!desired) continue;
  const existingByProduct = new Map(
    (ecosystem.positions ?? []).map((position) => [position.product_id, position])
  );
  ecosystem.positions = Object.entries(desired).map(
    ([productId, [x, y, role, status]]) => {
      const existing = existingByProduct.get(productId);
      return {
        product_id: productId,
        x,
        y,
        role,
        status,
        changed_fields: existing?.changed_fields ?? [],
        position_note: existing?.position_note
          ?? "依据最新分类清单进入当前品类；二维生态坐标为待确认的初始占位。"
      };
    }
  );
}

documents.products.version = "202607-draft.8";
documents.variants.version = "202607-draft.8";
documents.observations.version = "202607-draft.4";
documents.ecosystems.version = "202607-draft.4";
const existingChangeIds = new Set(documents.changeLog.items.map((item) => item.id));
documents.changeLog.items.unshift(
  ...changes.filter((item) => !existingChangeIds.has(item.id))
);

for (const [key, path] of Object.entries(paths)) {
  await writeFile(path, `${JSON.stringify(documents[key], null, 2)}\n`, "utf8");
}

console.log(JSON.stringify({
  products: documents.products.items.length,
  variants: documents.variants.items.length,
  observations: documents.observations.items.length,
  group_counts: Object.fromEntries(
    Object.entries(classificationGroups).map(([prototypeId, productIds]) => [
      prototypeNames.get(prototypeId),
      productIds.length
    ])
  ),
  changed_records: changes.length
}, null, 2));
