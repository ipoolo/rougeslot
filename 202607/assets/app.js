const FORMULA_FIELDS = [
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

const TERM_KEYS = [
  "P_t",
  "Pool_Symbol",
  "Random",
  "SingleSpin_Symbol",
  "Put",
  "Show_TP",
  "Show_State",
  "Combo",
  "C1",
  "C2",
  "Spin_Result",
  "N",
  "BD"
];

const TERM_VISUAL_TYPES = {
  P_t: "context",
  Pool_Symbol: "object",
  Random: "operation",
  SingleSpin_Symbol: "object",
  Put: "operation",
  Show_TP: "object",
  Show_State: "object",
  Combo: "rule",
  C1: "rule",
  C2: "rule",
  Spin_Result: "object",
  N: "cycle",
  BD: "cycle"
};

const FIELD_LABELS = {
  P_t: "目标压力域",
  Pool_Symbol: "符号池",
  Random: "随机抽取",
  Put: "放置／安置",
  Show_TP: "承载拓扑",
  C1: "符号协同",
  C2: "结果演绎",
  N: "Spin 周期",
  BD: "构筑决策"
};

const TYPE_LABELS = {
  mechanism_archetype: "机制母型",
  category_prototype: "品类原型",
  category_variant: "品类变体"
};

const OPERATION_LABELS = {
  inherit: "继承",
  default: "默认",
  restrict: "收窄",
  fix: "固定",
  disable: "禁用",
  override: "覆写",
  extend: "扩展",
  compose: "组合"
};

const RELATION_LABELS = {
  source: "主要来源",
  representative: "代表产品",
  member: "归属产品",
  variant_instance: "变体实例"
};

const REVIEW_STATUS_LABELS = {
  draft: "草稿",
  pending: "待确认",
  confirmed: "已确认"
};

function formulaDisplayKey(field) {
  if (field === "P_t") return "P(t)";
  if (field === "C1") return "C₁";
  if (field === "C2") return "C₂?";
  return field;
}

const NODE_TYPE_ORDER = {
  mechanism_archetype: 1,
  category_prototype: 2,
  category_variant: 3
};

const DATA_VERSION = "20260726-29";

const DATA_FILES = {
  model: `./data/experience-model.json?v=${DATA_VERSION}`,
  terms: `./data/terms.json?v=${DATA_VERSION}`,
  mechanisms: `./data/mechanism-archetypes.json?v=${DATA_VERSION}`,
  prototypes: `./data/category-prototypes.json?v=${DATA_VERSION}`,
  variants: `./data/category-variants.json?v=${DATA_VERSION}`,
  products: `./data/products.json?v=${DATA_VERSION}`,
  productObservations: `./data/product-formula-observations.json?v=${DATA_VERSION}`,
  migrationReport: `./data/migration-report.json?v=${DATA_VERSION}`
};

const state = {
  data: null,
  selectedMechanismId: null,
  selectedPrototypeId: null,
  selectedVariantId: null,
  detailLevel: "variant",
  selectedTermKey: "P_t",
  query: "",
  filter: "all",
  libraryView: "products",
  libraryProductQuery: "",
  libraryProductFilter: "all",
  libraryLevelFilter: "all",
  libraryFieldFilter: "all",
  dataServiceOnline: false,
  editingField: null,
  selectedProductId: null
};

const elements = {
  luckLandlordCase: document.querySelector("#luck-landlord-case"),
  experienceTimeline: document.querySelector("#experience-timeline"),
  fieldFormulaMap: document.querySelector("#field-formula-map"),
  termControls: document.querySelector("#formula-controls"),
  termDetail: document.querySelector("#term-detail"),
  atlasFormulaMap: document.querySelector("#atlas-formula-map"),
  atlasStats: document.querySelector("#atlas-stats"),
  search: document.querySelector("#atlas-search"),
  filter: document.querySelector("#atlas-filter"),
  mechanismCount: document.querySelector("#mechanism-count"),
  prototypeCount: document.querySelector("#prototype-count"),
  variantCount: document.querySelector("#variant-count"),
  mechanismRail: document.querySelector("#mechanism-rail"),
  prototypeRail: document.querySelector("#prototype-rail"),
  variantRail: document.querySelector("#variant-rail"),
  breadcrumb: document.querySelector("#atlas-breadcrumb"),
  nodeDetail: document.querySelector("#node-detail"),
  libraryServiceBar: document.querySelector("#library-service-bar"),
  libraryStats: document.querySelector("#library-stats"),
  libraryViewButtons: [...document.querySelectorAll("[data-library-view]")],
  libraryPanels: [...document.querySelectorAll("[data-library-panel]")],
  productSearch: document.querySelector("#library-product-search"),
  productFilter: document.querySelector("#library-product-filter"),
  productResultSummary: document.querySelector("#product-result-summary"),
  productCatalog: document.querySelector("#product-catalog"),
  levelFilter: document.querySelector("#library-level-filter"),
  fieldFilter: document.querySelector("#library-field-filter"),
  formulaDataTable: document.querySelector("#formula-data-table"),
  reviewQueue: document.querySelector("#review-queue"),
  refreshReviewQueue: document.querySelector("#refresh-review-queue"),
  fieldEditor: document.querySelector("#field-editor"),
  fieldEditorForm: document.querySelector("#field-editor-form"),
  fieldEditorPath: document.querySelector("#field-editor-path"),
  fieldEditorTitle: document.querySelector("#field-editor-title"),
  fieldEditorParent: document.querySelector("#field-editor-parent"),
  fieldEditorOperation: document.querySelector("#field-editor-operation"),
  fieldEditorStatus: document.querySelector("#field-editor-status"),
  fieldEditorLabel: document.querySelector("#field-editor-label"),
  fieldEditorSummary: document.querySelector("#field-editor-summary"),
  fieldEditorNote: document.querySelector("#field-editor-note"),
  fieldEditorMessage: document.querySelector("#field-editor-message"),
  fieldEditorClose: document.querySelector("#field-editor-close"),
  fieldEditorCancel: document.querySelector("#field-editor-cancel"),
  fieldEditorSave: document.querySelector("#field-editor-save"),
  fieldEditorConfirm: document.querySelector("#field-editor-confirm"),
  productDetail: document.querySelector("#product-detail"),
  productDetailContent: document.querySelector("#product-detail-content"),
  productDetailClose: document.querySelector("#product-detail-close"),
  dataToast: document.querySelector("#data-toast"),
  fatalMessage: document.querySelector("#fatal-message")
};

const EXPERIENCE_STAGE_PRESETS = {
  all: {
    label: "完整循环",
    title: "P(t) 赋予结果目标意义；揭晓与结算形成双峰，连续 N 次后进入构筑。",
    copy: "目标压力域包裹完整循环，但不充当操作步骤；构筑通过 BD 修改可配置参数，再回到下一周期。"
  },
  pressure: {
    label: "外层条件 · P(t)",
    title: "目标、期限、当前差距与失败代价，让每一次结果产生“够不够”的判断。",
    copy: "P(t) 包裹 Spin 与 BD 的完整循环。它的检查周期独立于 N：N 只表示触发一次 BD 之前的连续 Spin 数量。"
  },
  reveal: {
    label: "阶段 01 · 揭晓",
    title: "第一峰：等待被答案替代，随机结果第一次成为可见事实。",
    copy: "Random 从 Pool_Symbol 抽取；Put 把结果写入 Show_TP。玩家关注“抽到了什么、怎样落下”。"
  },
  settle: {
    label: "阶段 02 · 结算",
    title: "第二峰：玩家识别协同，并看到规则把组合转换成结果。",
    copy: "Combo 先由 C₁ 产生基础协同结果，再由可选的 C₂ 完成修饰或结果转译，输出本次 Spin_Result。"
  },
  build: {
    label: "阶段 03 · 构筑",
    title: "周期边界：连续完成 N 次 Spin 后，调整下一周期的条件。",
    copy: "只有下层启用 BD 时才进入这一阶段；BD 可修改大部分可配置参数，然后回到下一周期。"
  }
};

const LUCK_LANDLORD_CASE_PRESETS = {
  all: {
    label: "完整案例",
    title: "房租压力 P(t) 包裹完整循环；一次 Spin 内完成揭晓与结算，再通过构筑更新随机条件。",
    copy: "上方是玩家实际经历，下方是同一流程在体验公式中的位置；P(t) 与 N=1 分别表示外层压力和构筑频率。",
    nodes: [],
    edges: [],
    zones: []
  },
  pressure: {
    label: "目标压力 · P(t)",
    title: "房租金额、剩余 Spin、当前金币缺口与失败后果，共同构成外层目标压力域。",
    copy: "房租检查赋予每次 Spin_Result 达标意义，并影响玩家的 BD 方向；它不等于 N，也不是 Random、Put、Combo 或 BD 旁边的第五个步骤。",
    nodes: ["pressure", "spin-result", "bd"],
    edges: ["c2-result", "pressure-result", "pressure-bd"],
    zones: ["pressure", "settle", "build"]
  },
  pool: {
    label: "当前符号池",
    title: "Pool_Symbol 是本次 Random 唯一直接读取的候选符号集合。",
    copy: "《幸运房东》的符号池不是固定库存：BD 可以加入或删除符号，从而改变下一次随机会抽到什么；它不负责决定符号怎样落位。",
    nodes: ["pool"],
    edges: ["pool-random"],
    zones: ["source"]
  },
  reveal: {
    label: "第一峰 · 揭晓",
    title: "Random 产生本次符号，自动 Put 把它们写入 2D Slot 网格。",
    copy: "该阶段从 Pool_Symbol 开始，到 Show_State 形成结束。玩家关心“抽到了什么、怎样落下”；协同判定尚未发生。",
    nodes: ["pool", "random", "spin-symbol", "put", "show-tp", "show-state"],
    edges: ["pool-random", "random-symbol", "symbol-put", "put-state"],
    zones: ["source", "reveal"]
  },
  settle: {
    label: "第二峰 · 结算",
    title: "C₁ 先产生基础数值，C₂ 再由道具增强或改变结果。",
    copy: "C₁ 读取直接产出、数量阈值和邻接关系；C₂ 位于基础结果之后，最终形成 Spin_Result。它不重新负责随机抽取或落位。",
    nodes: ["show-state", "show-tp", "c1", "c2", "spin-result"],
    edges: ["state-c1", "c1-c2", "c2-result"],
    zones: ["settle"]
  },
  build: {
    label: "构筑更新",
    title: "本案例主线采用 N = 1：每完成一次 Spin，就进入一次符号选择类 BD。",
    copy: "符号选择直接更新后续 Pool_Symbol；删除和道具继续修改 Pool_Symbol、C₁ 与 C₂。房租压力属于 P(t)，不与 N = 1 混用。",
    nodes: ["spin-result", "n", "bd", "next", "pool"],
    edges: ["result-n", "n-bd", "bd-next"],
    zones: ["build", "source"]
  }
};

function selectLuckLandlordCasePreset(key = "all") {
  const root = elements.luckLandlordCase;
  const preset = LUCK_LANDLORD_CASE_PRESETS[key] ?? LUCK_LANDLORD_CASE_PRESETS.all;
  if (!root) return;

  const focused = key !== "all";
  root.dataset.caseSelection = key;
  root.classList.toggle("is-case-focused", focused);

  root.querySelectorAll("[data-case-node]").forEach((node) => {
    node.classList.toggle("is-focused", focused && preset.nodes.includes(node.dataset.caseNode));
    node.classList.toggle("is-context", focused && !preset.nodes.includes(node.dataset.caseNode));
  });

  root.querySelectorAll("[data-case-edge]").forEach((edge) => {
    edge.classList.toggle("is-focused", focused && preset.edges.includes(edge.dataset.caseEdge));
    edge.classList.toggle("is-context", focused && !preset.edges.includes(edge.dataset.caseEdge));
  });

  root.querySelectorAll("[data-case-zone]").forEach((zone) => {
    const selectedZone = preset.zones.includes(zone.dataset.caseZone);
    const persistentOuterContext = zone.dataset.caseZone === "pressure" && key !== "pressure";
    zone.classList.toggle("is-focused", focused && selectedZone);
    zone.classList.toggle(
      "is-context",
      focused && !selectedZone && !persistentOuterContext
    );
  });

  root.querySelectorAll("[data-case-preset], [data-case-select]").forEach((control) => {
    const controlKey = control.dataset.casePreset ?? control.dataset.caseSelect;
    const selected = controlKey === key;
    control.classList.toggle("is-active", selected);
    control.setAttribute("aria-pressed", String(selected));
  });

  const label = root.querySelector("[data-case-info-label]");
  const title = root.querySelector("[data-case-info-title]");
  const copy = root.querySelector("[data-case-info-copy]");
  if (label) label.textContent = preset.label;
  if (title) title.textContent = preset.title;
  if (copy) copy.textContent = preset.copy;
}

function bindLuckLandlordCase() {
  const root = elements.luckLandlordCase;
  if (!root) return;

  root.querySelectorAll("[data-case-preset], [data-case-select]").forEach((control) => {
    control.addEventListener("click", () => {
      selectLuckLandlordCasePreset(
        control.dataset.casePreset ?? control.dataset.caseSelect
      );
    });
  });

  selectLuckLandlordCasePreset("all");
}

function selectExperienceStage(key = "all") {
  const root = elements.experienceTimeline;
  const preset = EXPERIENCE_STAGE_PRESETS[key] ?? EXPERIENCE_STAGE_PRESETS.all;
  if (!root) return;

  const focused = key !== "all";
  const focusedStages = key === "pressure"
    ? ["pressure", "reveal", "settle", "build"]
    : [key];
  root.dataset.experienceSelection = key;
  root.classList.toggle("is-stage-focused", focused);

  document.querySelectorAll("[data-experience-preset]").forEach((control) => {
    const selected = control.dataset.experiencePreset === key;
    control.classList.toggle("is-active", selected);
    control.setAttribute("aria-pressed", String(selected));
  });

  document.querySelectorAll("[data-experience-stage]").forEach((stage) => {
    const involved = focusedStages.includes(stage.dataset.experienceStage);
    stage.classList.toggle("is-focused", focused && involved);
    stage.classList.toggle("is-context", focused && !involved);
  });

  const label = root.querySelector("[data-experience-info-label]");
  const title = root.querySelector("[data-experience-info-title]");
  const copy = root.querySelector("[data-experience-info-copy]");
  if (label) label.textContent = preset.label;
  if (title) title.textContent = preset.title;
  if (copy) copy.textContent = preset.copy;
}

function bindExperienceTimeline() {
  const root = elements.experienceTimeline;
  if (!root) return;

  document.querySelectorAll("[data-experience-preset]").forEach((control) => {
    control.addEventListener("click", () => {
      selectExperienceStage(control.dataset.experiencePreset);
    });
  });

  selectExperienceStage("all");
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function loadData() {
  const entries = await Promise.all(
    Object.entries(DATA_FILES).map(async ([key, url]) => {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`${url}: ${response.status}`);
      }
      return [key, await response.json()];
    })
  );

  const loaded = Object.fromEntries(entries);
  loaded.mechanisms = loaded.mechanisms.items;
  loaded.prototypes = loaded.prototypes.items;
  loaded.variants = loaded.variants.items;
  loaded.products = loaded.products.items;
  loaded.productObservations = loaded.productObservations.items;
  loaded.termItems = loaded.terms.terms;
  loaded.termByKey = new Map(loaded.termItems.map((term) => [term.key, term]));
  loaded.mechanismById = new Map(
    loaded.mechanisms.map((item) => [item.id, item])
  );
  loaded.prototypeById = new Map(
    loaded.prototypes.map((item) => [item.id, item])
  );
  loaded.variantById = new Map(loaded.variants.map((item) => [item.id, item])
  );
  loaded.productById = new Map(loaded.products.map((item) => [item.id, item]));
  loaded.productObservationById = new Map(
    loaded.productObservations.map((item) => [item.product_id, item])
  );
  return loaded;
}

function productsFor(node) {
  const { products } = state.data;
  if (node.type === "mechanism_archetype") {
    return products.filter((product) => product.mother_ids.includes(node.id));
  }
  if (node.type === "category_prototype") {
    return products.filter((product) => product.prototype_ids.includes(node.id));
  }
  return products.filter((product) => product.variant_ids.includes(node.id));
}

function libraryNodes() {
  return [
    ...state.data.mechanisms,
    ...state.data.prototypes,
    ...state.data.variants
  ].sort((a, b) => {
    const typeDelta = NODE_TYPE_ORDER[a.type] - NODE_TYPE_ORDER[b.type];
    return typeDelta || a.order - b.order;
  });
}

function libraryNodeById(id) {
  return state.data.mechanismById.get(id)
    ?? state.data.prototypeById.get(id)
    ?? state.data.variantById.get(id)
    ?? null;
}

function reviewStatusFor(node, entry) {
  if (entry.review_status && REVIEW_STATUS_LABELS[entry.review_status]) {
    return entry.review_status;
  }
  if (node.status === "structure_ready_content_pending") {
    return "draft";
  }
  return "pending";
}

function productStatusCopy(product) {
  if (product.status === "reference_confirmed") {
    return { label: "来源已确认", className: "confirmed" };
  }
  if (product.status === "content_pending") {
    return { label: "待拆解", className: "pending" };
  }
  if (product.status === "legacy_imported") {
    return { label: "旧资料已迁移", className: "draft" };
  }
  return { label: "整理中", className: "draft" };
}

function classificationStatusCopy(product) {
  if (product.classification_status === "confirmed") {
    return { label: "分类已确认", className: "confirmed" };
  }
  if (product.classification_status === "partial") {
    return { label: "部分归类", className: "pending" };
  }
  return { label: "尚未归类", className: "draft" };
}

function safeHttpUrl(value = "") {
  return /^https?:\/\//.test(value) ? value : null;
}

function productClassification(product) {
  const mechanisms = product.mother_ids
    .map((id) => state.data.mechanismById.get(id)?.name)
    .filter(Boolean);
  const prototypes = product.prototype_ids
    .map((id) => state.data.prototypeById.get(id)?.name)
    .filter(Boolean);
  const variants = product.variant_ids
    .map((id) => state.data.variantById.get(id)?.name)
    .filter(Boolean);

  const path = [
    mechanisms.join(" + ") || "机制母型待确认",
    prototypes.join(" + ") || "品类原型待确认",
    variants.join(" + ") || (prototypes.length ? "无独立变体" : "品类变体待确认")
  ];

  return {
    path,
    depth: variants.length ? "variant" : prototypes.length ? "prototype" : mechanisms.length ? "mechanism" : "unclassified"
  };
}

function renderLibraryStats() {
  const nodes = libraryNodes();
  const reviewItems = nodes.flatMap((node) =>
    FORMULA_FIELDS.map((field) => ({
      node,
      field,
      status: reviewStatusFor(node, rawFingerprint(node)[field])
    }))
  );
  const pending = reviewItems.filter((item) => item.status !== "confirmed").length;
  const confirmed = reviewItems.length - pending;
  const values = [
    [state.data.products.length, "具体产品"],
    [nodes.length, "模型节点"],
    [reviewItems.length, "公式字段记录"],
    [confirmed, "已人工确认"],
    [pending, "待确认／草稿"]
  ];

  elements.libraryStats.innerHTML = values.map(([value, label]) => `
    <div>
      <strong>${value}</strong>
      <span>${escapeHtml(label)}</span>
    </div>
  `).join("");
}

function renderProductCatalog() {
  const query = state.libraryProductQuery.toLowerCase();
  const products = state.data.products
    .filter((product) => {
      const filter = state.libraryProductFilter;
      if (
        filter !== "all"
        && filter !== product.classification_status
        && !(filter === "legacy" && product.legacy_source)
      ) {
        return false;
      }
      if (!query) return true;
      const classification = productClassification(product);
      const observation = state.data.productObservationById.get(product.id);
      const haystack = [
        product.name,
        product.name_en,
        product.developer,
        product.summary,
        product.core_loop,
        product.classification_note,
        ...(product.tags ?? []),
        ...(product.observed_mechanics ?? []),
        ...classification.path,
        ...(observation
          ? Object.values(observation.fields).map((entry) => entry.value)
          : [])
      ].join(" ").toLowerCase();
      return haystack.includes(query);
    })
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, "zh-CN"));

  elements.productResultSummary.innerHTML = `
    <strong>${products.length}</strong>
    <span> / ${state.data.products.length} 款正式游戏</span>
    <small>
      旧版迁入 ${state.data.migrationReport.result.formal_legacy_games} 款；
      设计样例 ${state.data.migrationReport.result.design_samples} 条，不计入游戏数量。
    </small>
  `;

  elements.productCatalog.innerHTML = products.length
    ? products.map((product, index) => {
      const status = productStatusCopy(product);
      const classificationStatus = classificationStatusCopy(product);
      const classification = productClassification(product);
      const sourceUrl = safeHttpUrl(product.source_url);
      const coverUrl = safeHttpUrl(product.header_image_url);
      const tags = (product.tags ?? []).slice(0, 3);
      const hasModelRelation = product.mother_ids.length
        || product.prototype_ids.length
        || product.variant_ids.length;
      return `
        <article class="product-record product-depth-${classification.depth}">
          <div class="product-cover ${coverUrl ? "" : "no-image"}">
            ${coverUrl ? `
              <img src="${escapeHtml(coverUrl)}" alt="" loading="lazy" referrerpolicy="no-referrer">
            ` : `
              <span>${escapeHtml(product.name.slice(0, 2))}</span>
            `}
          </div>
          <header>
            <span class="product-sequence">${String(index + 1).padStart(2, "0")}</span>
            <span class="product-status-stack">
              <span class="review-badge ${status.className}">${escapeHtml(status.label)}</span>
              <span class="review-badge ${classificationStatus.className}">${escapeHtml(classificationStatus.label)}</span>
            </span>
          </header>
          <h4>${escapeHtml(product.name)}</h4>
          ${product.name_en ? `<span class="product-name-en">${escapeHtml(product.name_en)}</span>` : ""}
          <p>${escapeHtml(product.summary)}</p>
          <div class="product-classification" aria-label="${escapeHtml(product.name)}的分类路径">
            ${classification.path.map((part, pathIndex) => `
              ${pathIndex ? '<span aria-hidden="true">→</span>' : ""}
              <strong>${escapeHtml(part)}</strong>
            `).join("")}
          </div>
          ${tags.length ? `
            <div class="product-mechanics">
              ${tags.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
            </div>
          ` : ""}
          <footer>
            <button type="button" class="product-detail-button" data-product-detail="${escapeHtml(product.id)}">
              查看游戏资料
            </button>
            ${hasModelRelation ? `
              <button type="button" class="product-focus-button" data-product-focus="${escapeHtml(product.id)}">
                所属模型
              </button>
            ` : ""}
            ${sourceUrl ? `
              <a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noreferrer">Steam ↗</a>
            ` : ""}
          </footer>
        </article>
      `;
    }).join("")
    : '<div class="library-empty">没有符合当前搜索条件的产品。</div>';

  elements.productCatalog.querySelectorAll("[data-product-detail]").forEach((button) => {
    button.addEventListener("click", () => {
      openProductDetail(button.dataset.productDetail);
    });
  });

  elements.productCatalog.querySelectorAll("[data-product-focus]").forEach((button) => {
    button.addEventListener("click", () => {
      const product = state.data.productById.get(button.dataset.productFocus);
      if (!product) return;
      const variantId = product.variant_ids[0];
      const prototypeId = product.prototype_ids[0];
      const mechanismId = product.mother_ids[0];
      if (variantId) selectVariant(variantId);
      else if (prototypeId) selectPrototype(prototypeId);
      else if (mechanismId) selectMechanism(mechanismId);
      window.location.hash = "atlas";
    });
  });

  elements.productCatalog.querySelectorAll(".product-cover img").forEach((image) => {
    image.addEventListener("error", () => {
      image.closest(".product-cover")?.classList.add("image-failed");
      image.hidden = true;
    });
  });
}

function productMetaItem(label, value) {
  if (value === null || value === undefined || value === "") return "";
  return `
    <div>
      <small>${escapeHtml(label)}</small>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `;
}

function productFormulaObservationMarkup(observation) {
  if (!observation) {
    return `
      <div class="product-detail-empty">
        这款产品没有旧版 v5 观察记录；保留当前新版资料，等待后续正式拆解。
      </div>
    `;
  }

  return `
    <section class="product-detail-section">
      <div class="product-detail-section-head">
        <div>
          <p class="eyebrow">LEGACY → FORMULA</p>
          <h4>旧版资料映射到体验公式</h4>
        </div>
        <span class="review-badge draft">机械迁移 · 待确认</span>
      </div>
      <div class="product-formula-observations">
        ${FORMULA_FIELDS.map((field) => {
          const entry = observation.fields[field];
          return `
            <article>
              <header>
                <code>${escapeHtml(formulaDisplayKey(field))}</code>
                <span>${escapeHtml(FIELD_LABELS[field])}</span>
              </header>
              <p>${escapeHtml(entry.value)}</p>
              <small>旧版来源：${entry.source_fields.map(escapeHtml).join(" · ")}</small>
            </article>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function openProductDetail(productId) {
  const product = state.data.productById.get(productId);
  if (!product) return;
  const observation = state.data.productObservationById.get(productId);
  const classification = productClassification(product);
  const classificationStatus = classificationStatusCopy(product);
  const sourceUrl = safeHttpUrl(product.source_url);
  const coverUrl = safeHttpUrl(product.header_image_url);
  const tags = product.tags ?? [];
  state.selectedProductId = productId;

  const scoreLabels = {
    random: "Random",
    combo: "Combo",
    pool: "Pool",
    structure: "Structure"
  };

  elements.productDetailContent.innerHTML = `
    <header class="product-detail-hero">
      <div class="product-detail-cover ${coverUrl ? "" : "no-image"}">
        ${coverUrl
          ? `<img src="${escapeHtml(coverUrl)}" alt="" referrerpolicy="no-referrer">`
          : `<span>${escapeHtml(product.name.slice(0, 2))}</span>`}
      </div>
      <div>
        <div class="product-detail-badges">
          <span class="review-badge ${classificationStatus.className}">${escapeHtml(classificationStatus.label)}</span>
          ${product.legacy_source ? '<span class="review-badge draft">旧版 v5 资料</span>' : ""}
        </div>
        <p class="eyebrow">PRODUCT RECORD</p>
        <h3 id="product-detail-title">${escapeHtml(product.name)}</h3>
        ${product.name_en ? `<p class="product-detail-name-en">${escapeHtml(product.name_en)}</p>` : ""}
        <p class="product-detail-summary">${escapeHtml(product.summary)}</p>
      </div>
    </header>

    <div class="product-detail-meta">
      ${productMetaItem("开发者", product.developer || "旧资料未填写")}
      ${productMetaItem("发行年份", product.release_year || product.release_date || "待确认")}
      ${productMetaItem("旧版标识", product.legacy_source?.slug || "无")}
      ${productMetaItem("资料状态", product.legacy_source ? "已迁入独立快照" : "新版新增")}
    </div>

    ${tags.length ? `
      <div class="product-detail-tags">
        ${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
      </div>
    ` : ""}

    <section class="product-detail-section classification">
      <div class="product-detail-section-head">
        <div>
          <p class="eyebrow">CLASSIFICATION</p>
          <h4>当前分类路径</h4>
        </div>
        <span class="review-badge ${classificationStatus.className}">${escapeHtml(classificationStatus.label)}</span>
      </div>
      <div class="product-detail-path">
        ${classification.path.map((part, index) => `
          ${index ? '<span aria-hidden="true">→</span>' : ""}
          <strong>${escapeHtml(part)}</strong>
        `).join("")}
      </div>
      <p>${escapeHtml(product.classification_note || "当前分类关系已经记录。")}</p>
    </section>

    ${observation ? `
      <section class="product-detail-section">
        <div class="product-detail-section-head">
          <div>
            <p class="eyebrow">LEGACY V5</p>
            <h4>旧版分析摘要与评分</h4>
          </div>
        </div>
        <p class="legacy-analysis-summary">${escapeHtml(observation.legacy_summary)}</p>
        <div class="legacy-score-grid">
          ${Object.entries(scoreLabels).map(([key, label]) => `
            <div>
              <small>${escapeHtml(label)}</small>
              <strong>${escapeHtml(observation.legacy_scores[key] ?? "—")}</strong>
              <span>/ 10</span>
            </div>
          `).join("")}
        </div>
      </section>
    ` : ""}

    ${productFormulaObservationMarkup(observation)}

    ${observation?.supplemental?.pool_active_desc ? `
      <section class="product-detail-section supplemental">
        <p class="eyebrow">SUPPLEMENTAL</p>
        <h4>旧版第二池／修饰池资料</h4>
        <p>${escapeHtml(observation.supplemental.pool_active_desc)}</p>
        <small>此内容未被强行并入 Pool_Symbol，等待判断它属于 C₂、BD 或其他结构。</small>
      </section>
    ` : ""}

    <footer class="product-detail-footer">
      <span>
        ${product.legacy_source
          ? `旧版分析版本 ${escapeHtml(product.legacy_source.framework_version)} · ${escapeHtml(product.legacy_source.analysis_updated_at)}`
          : "新版产品记录"}
      </span>
      ${sourceUrl
        ? `<a class="button button-secondary" href="${escapeHtml(sourceUrl)}" target="_blank" rel="noreferrer">打开来源页面 ↗</a>`
        : ""}
    </footer>
  `;

  const detailImage = elements.productDetailContent.querySelector(".product-detail-cover img");
  detailImage?.addEventListener("error", () => {
    detailImage.closest(".product-detail-cover")?.classList.add("image-failed");
    detailImage.hidden = true;
  });

  if (typeof elements.productDetail.showModal === "function") {
    elements.productDetail.showModal();
  } else {
    elements.productDetail.setAttribute("open", "");
  }
}

function closeProductDetail() {
  state.selectedProductId = null;
  if (typeof elements.productDetail.close === "function") {
    elements.productDetail.close();
  } else {
    elements.productDetail.removeAttribute("open");
  }
}

function matrixCellMarkup(node, field) {
  const entry = rawFingerprint(node)[field];
  const status = reviewStatusFor(node, entry);
  const parent = parentNode(node);
  const parentValue = parent ? effectiveFingerprint(parent)[field] : null;
  const parentCopy = parentValue
    ? `${parentValue.label}：${parentValue.summary}`
    : "体验公式基础字段";
  return `
    <td>
      <button
        type="button"
        class="matrix-cell layer-${escapeHtml(node.type)} status-${escapeHtml(status)}"
        data-edit-node="${escapeHtml(node.id)}"
        data-edit-field="${escapeHtml(field)}"
        aria-label="编辑 ${escapeHtml(node.name)} 的 ${escapeHtml(field)}"
        title="父级有效结果：${escapeHtml(parentCopy)}"
      >
        <span class="matrix-cell-meta">
          <em class="operation-pill ${escapeHtml(entry.operation)}">
            ${escapeHtml(OPERATION_LABELS[entry.operation] ?? entry.operation)}
          </em>
          <i class="review-badge ${escapeHtml(status)}">${escapeHtml(REVIEW_STATUS_LABELS[status])}</i>
        </span>
        <strong>${escapeHtml(entry.constraint_label ?? FIELD_LABELS[field])}</strong>
        <small>${escapeHtml(entry.summary)}</small>
      </button>
    </td>
  `;
}

function renderFormulaMatrix() {
  const fields = state.libraryFieldFilter === "all"
    ? FORMULA_FIELDS
    : [state.libraryFieldFilter];
  const nodes = libraryNodes().filter((node) =>
    state.libraryLevelFilter === "all" || node.type === state.libraryLevelFilter
  );

  elements.formulaDataTable.innerHTML = `
    <thead>
      <tr>
        <th scope="col" class="matrix-node-column">
          <span>模型节点</span>
          <small>层级与继承位置</small>
        </th>
        ${fields.map((field) => `
          <th scope="col">
            <code>${escapeHtml(formulaDisplayKey(field))}</code>
            <small>${escapeHtml(FIELD_LABELS[field])}</small>
          </th>
        `).join("")}
      </tr>
    </thead>
    <tbody>
      ${nodes.map((node) => {
        const parent = parentNode(node);
        return `
          <tr>
            <th scope="row" class="matrix-node-column">
              <span class="node-type-label">${escapeHtml(TYPE_LABELS[node.type])}</span>
              <strong>${escapeHtml(node.name)}</strong>
              <small>${parent ? `继承自 ${escapeHtml(parent.name)}` : "体验公式下的第一层"}</small>
            </th>
            ${fields.map((field) => matrixCellMarkup(node, field)).join("")}
          </tr>
        `;
      }).join("")}
    </tbody>
  `;

  elements.formulaDataTable.querySelectorAll("[data-edit-node][data-edit-field]").forEach((button) => {
    button.addEventListener("click", () => {
      openFieldEditor(button.dataset.editNode, button.dataset.editField);
    });
  });
}

function reviewQueueItems() {
  return libraryNodes().flatMap((node) =>
    FORMULA_FIELDS.map((field) => {
      const entry = rawFingerprint(node)[field];
      return {
        node,
        field,
        entry,
        status: reviewStatusFor(node, entry)
      };
    })
  ).filter((item) => item.status !== "confirmed")
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === "pending" ? -1 : 1;
      const typeDelta = NODE_TYPE_ORDER[a.node.type] - NODE_TYPE_ORDER[b.node.type];
      return typeDelta || a.node.order - b.node.order
        || FORMULA_FIELDS.indexOf(a.field) - FORMULA_FIELDS.indexOf(b.field);
    });
}

function renderReviewQueue() {
  const items = reviewQueueItems();
  elements.reviewQueue.innerHTML = items.length
    ? items.map((item) => `
      <button
        type="button"
        class="review-item layer-${escapeHtml(item.node.type)}"
        data-review-node="${escapeHtml(item.node.id)}"
        data-review-field="${escapeHtml(item.field)}"
      >
        <span class="review-item-path">
          <small>${escapeHtml(TYPE_LABELS[item.node.type])}</small>
          <strong>${escapeHtml(item.node.name)}</strong>
        </span>
        <code>${escapeHtml(formulaDisplayKey(item.field))}</code>
        <span class="review-item-copy">
          <strong>${escapeHtml(item.entry.constraint_label ?? FIELD_LABELS[item.field])}</strong>
          <small>${escapeHtml(item.entry.summary)}</small>
        </span>
        <span class="review-badge ${escapeHtml(item.status)}">${escapeHtml(REVIEW_STATUS_LABELS[item.status])}</span>
      </button>
    `).join("")
    : '<div class="library-empty confirmed-empty">全部公式字段都已经完成人工确认。</div>';

  elements.reviewQueue.querySelectorAll("[data-review-node][data-review-field]").forEach((button) => {
    button.addEventListener("click", () => {
      openFieldEditor(button.dataset.reviewNode, button.dataset.reviewField);
    });
  });
}

function renderLibrary() {
  renderLibraryStats();
  renderProductCatalog();
  renderFormulaMatrix();
  renderReviewQueue();
}

function prototypesFor(mechanismId) {
  return state.data.prototypes
    .filter((item) => item.primary_mother_id === mechanismId)
    .sort((a, b) => a.order - b.order);
}

function variantsFor(prototypeId) {
  return state.data.variants
    .filter((item) => item.prototype_id === prototypeId)
    .sort((a, b) => a.order - b.order);
}

function descendantsFor(node) {
  if (node.type === "mechanism_archetype") {
    const prototypes = prototypesFor(node.id);
    return [
      ...prototypes,
      ...prototypes.flatMap((prototype) => variantsFor(prototype.id)),
      ...productsFor(node)
    ];
  }
  if (node.type === "category_prototype") {
    return [...variantsFor(node.id), ...productsFor(node)];
  }
  return productsFor(node);
}

function isWorkingStatus(status = "") {
  return /working|pending|draft/.test(status);
}

function nodeIsVisible(node) {
  if (state.filter === "ready" && isWorkingStatus(node.status)) {
    return false;
  }
  if (state.filter === "working" && !isWorkingStatus(node.status)) {
    return false;
  }
  if (!state.query) {
    return true;
  }

  const haystacks = [node, ...descendantsFor(node)]
    .map((item) => `${item.name ?? ""} ${item.summary ?? ""}`.toLowerCase())
    .join(" ");
  return haystacks.includes(state.query.toLowerCase());
}

function setDefaultSelection() {
  const firstMechanism = state.data.mechanisms
    .slice()
    .sort((a, b) => a.order - b.order)[0];
  state.selectedMechanismId = firstMechanism?.id ?? null;

  const firstPrototype = prototypesFor(state.selectedMechanismId)[0];
  state.selectedPrototypeId = firstPrototype?.id ?? null;

  const firstVariant = variantsFor(state.selectedPrototypeId)[0];
  state.selectedVariantId = firstVariant?.id ?? null;
  state.detailLevel = firstVariant ? "variant" : firstPrototype ? "prototype" : "mechanism";
}

function statusCopy(status) {
  if (status === "working" || status === "working_definition") {
    return {
      label: "工作定义",
      description: "结构可用，内容会随着实际拆解继续校准。",
      className: "working"
    };
  }
  if (status === "structure_ready_content_pending") {
    return {
      label: "结构已建立",
      description: "继承关系已经生效，具体变体差异等待正式拆解。",
      className: "working"
    };
  }
  if (status === "content_pending") {
    return {
      label: "内容待补充",
      description: "产品对象已经建立，分析内容尚未录入。",
      className: "working"
    };
  }
  return {
    label: "已确认",
    description: "当前关系或定义已确认，可以作为页面数据使用。",
    className: ""
  };
}

function renderTermControls() {
  elements.termControls.innerHTML = TERM_KEYS.map((key) => `
    <button
      class="term-button ${state.selectedTermKey === key ? "active" : ""}"
      type="button"
      data-term-key="${escapeHtml(key)}"
      aria-pressed="${state.selectedTermKey === key}"
    >
      ${escapeHtml(formulaDisplayKey(key))}
    </button>
  `).join("");

  elements.termControls.querySelectorAll("[data-term-key]").forEach((button) => {
    button.addEventListener("click", () => {
      selectTerm(button.dataset.termKey);
    });
  });
}

function formulaToken(key, label = key) {
  const active = state.selectedTermKey === key;
  return `
    <button
      class="formula-field-token type-${TERM_VISUAL_TYPES[key] ?? "object"} ${active ? "active" : ""}"
      type="button"
      data-formula-key="${escapeHtml(key)}"
      aria-pressed="${active}"
    >${escapeHtml(label)}</button>
  `;
}

function flowToken(key, label = key) {
  const active = state.selectedTermKey === key;
  return `
    <button
      class="flow-field-token type-${TERM_VISUAL_TYPES[key] ?? "object"} ${active ? "active" : ""}"
      type="button"
      data-flow-key="${escapeHtml(key)}"
      aria-pressed="${active}"
    >${escapeHtml(label)}</button>
  `;
}

function renderFieldFormulaMap() {
  const selected = state.selectedTermKey;
  const showTpSelected = selected === "Show_TP";
  const term = state.data.termByKey.get(selected);
  const activeStages = {
    P_t: ["random", "put", "combo", "bd"],
    Pool_Symbol: ["random"],
    Random: ["random"],
    SingleSpin_Symbol: ["random", "put"],
    Put: ["put"],
    Show_TP: ["put", "combo"],
    Show_State: ["put", "combo"],
    Combo: ["combo"],
    C1: ["combo"],
    C2: ["combo"],
    Spin_Result: ["combo"],
    N: ["random", "put", "combo"],
    BD: ["bd"]
  }[selected] ?? [];
  const activeEdges = {
    P_t: ["random-put", "put-combo", "cycle-bd"],
    SingleSpin_Symbol: ["random-put"],
    Put: ["random-put"],
    Show_TP: ["put-combo"],
    Show_State: ["put-combo"],
    Combo: ["put-combo"],
    BD: ["cycle-bd"]
  }[selected] ?? [];
  const locationCopies = {
    P_t: "包裹完整 Spin → BD 循环的外层边界条件",
    Pool_Symbol: "Random 的唯一直接内容域",
    Random: "单次 Spin 的第一步 · 第一峰",
    SingleSpin_Symbol: "Random 输出、Put 输入 · 流程中间数据",
    Put: "单次 Spin 的第二步 · 第一峰",
    Show_TP: "Put 与 Combo 共同承载域 · 公式中出现 2 次",
    Show_State: "Put 输出、Combo 输入 · 流程中间状态",
    Combo: "单次 Spin 的第三步 · 第二峰",
    C1: "Combo 的符号协同参数 · 第二峰",
    C2: "Combo 中位于 C₁ 之后的可选结果演绎层 · 第二峰",
    Spin_Result: "Combo 输出 · 单次 Spin 的可观察结果",
    N: "进入一次 BD 前的连续 Spin 数量",
    BD: "N 次 Spin 后的构筑决策"
  };
  const flowLocationCopies = {
    P_t: "外层包裹完整流程；依据 Spin_Result 判断目标差距，并影响 BD 方向",
    Pool_Symbol: "流程起点：候选符号池",
    Random: "Pool_Symbol → Random → SingleSpin_Symbol",
    SingleSpin_Symbol: "Random → SingleSpin_Symbol → Put",
    Put: "SingleSpin_Symbol → Put @ Show_TP → Show_State",
    Show_TP: "同时限定 Put 与 Combo 的承载空间",
    Show_State: "Put → Show_State → Combo",
    Combo: "Show_State → Combo(C₁ → C₂?) → Spin_Result",
    C1: "Show_State → C₁ 基础结果 → C₂?／Spin_Result",
    C2: "C₁ 基础结果 → C₂ 可选修饰或转译 → Spin_Result",
    Spin_Result: "Combo → Spin_Result → 累计 × N",
    N: "Spin_Result → 累计 × N → BD",
    BD: "累计 × N → BD → 修改参数 → 下一周期"
  };
  const activeFlowEdges = {
    P_t: [
      "pool-random",
      "random-single",
      "single-put",
      "put-state",
      "state-combo",
      "combo-result",
      "result-n",
      "n-bd",
      "bd-modify",
      "modify-next"
    ],
    Pool_Symbol: ["pool-random"],
    Random: ["pool-random", "random-single"],
    SingleSpin_Symbol: ["random-single", "single-put"],
    Put: ["single-put", "put-state"],
    Show_TP: ["single-put", "put-state", "state-combo", "combo-result"],
    Show_State: ["put-state", "state-combo"],
    Combo: ["state-combo", "combo-result"],
    C1: ["state-combo", "combo-result"],
    C2: ["state-combo", "combo-result"],
    Spin_Result: ["combo-result", "result-n"],
    N: ["result-n", "n-bd"],
    BD: ["n-bd", "bd-modify", "modify-next"]
  }[selected] ?? [];
  const flowArrow = (key) => `
    <span class="flow-arrow ${activeFlowEdges.includes(key) ? "active" : ""}" aria-hidden="true">→</span>
  `;
  const flowDownArrow = (key) => `
    <span class="flow-row-arrow ${activeFlowEdges.includes(key) ? "active" : ""}" aria-hidden="true">↓</span>
  `;

  elements.fieldFormulaMap.innerHTML = `
    <div class="model-view-label">
      <span>01 · 公式定位</span>
      <small>字段在体验公式中的结构位置</small>
    </div>
    <div class="model-type-legend" aria-label="节点类型颜色">
      <span class="context"><i></i>外层条件</span>
      <span class="object"><i></i>数据对象</span>
      <span class="operation"><i></i>操作步骤</span>
      <span class="rule"><i></i>协同／规则</span>
      <span class="cycle"><i></i>周期／构筑</span>
    </div>
    <div class="interactive-pressure-domain ${selected === "P_t" ? "has-active" : ""}">
      <div class="interactive-pressure-head">
        ${formulaToken("P_t", "P(t)")}
        <span>目标 · 期限 · 当前差距 · 失败代价</span>
        <small>包裹完整循环，不是第五个操作</small>
      </div>
      <div class="interactive-formula is-focused ${selected === "N" ? "cycle-is-active" : ""}">
        <div class="interactive-formula-track">
        <span class="interactive-bracket ${selected === "N" ? "active" : ""}">[</span>
        <div class="interactive-stage ${activeStages.includes("random") ? "has-active" : ""}">
          ${formulaToken("Random")}
          <span class="scope-mark">@</span>
          ${formulaToken("Pool_Symbol")}
        </div>
        <span class="interactive-arrow ${activeEdges.includes("random-put") ? "active" : ""}">→</span>
        <div class="interactive-stage ${activeStages.includes("put") ? "has-active" : ""}">
          ${formulaToken("Put")}
          <span class="scope-mark">@</span>
          ${formulaToken("Show_TP")}
        </div>
        <span class="interactive-arrow ${activeEdges.includes("put-combo") ? "active" : ""}">→</span>
        <div class="interactive-stage ${activeStages.includes("combo") ? "has-active" : ""}">
          ${formulaToken("Combo")}
          <span class="formula-fixed-label">(</span>
          ${formulaToken("C1", "C₁")}
          <span class="formula-separator">→</span>
          ${formulaToken("C2", "C₂?")}
          <span class="formula-fixed-label">)</span>
          <span class="scope-mark">@</span>
          ${formulaToken("Show_TP")}
        </div>
        <span class="interactive-bracket ${selected === "N" ? "active" : ""}">]</span>
        ${formulaToken("N", "ₙ")}
        <span class="interactive-arrow ${activeEdges.includes("cycle-bd") ? "active" : ""}">→</span>
        <div class="interactive-stage ${activeStages.includes("bd") ? "has-active" : ""}">
          ${formulaToken("BD")}
        </div>
        </div>
      </div>
    </div>
    <div class="model-view-label flow-label">
      <span>02 · 完整数据流程</span>
      <small>对象 → 操作 → 对象；与公式字段同步定位</small>
    </div>
    <div class="interactive-flow-scroll">
      <div class="flow-pressure-domain ${selected === "P_t" ? "has-active" : ""}">
        <div class="flow-pressure-head">
          ${flowToken("P_t", "P(t)")}
          <span>外层持续判断：当前结果离目标还有多远？下一次 BD 应该怎样回应？</span>
        </div>
        <div class="interactive-data-flow is-focused ${selected === "P_t" ? "pressure-is-active" : ""}" aria-label="目标压力域包裹的完整数据流程">
        <div class="flow-lane">
          <span class="flow-step flow-object ${selected === "Pool_Symbol" ? "has-active" : ""}">
            ${flowToken("Pool_Symbol")}
            <small>候选符号池</small>
          </span>
          ${flowArrow("pool-random")}
          <span class="flow-step flow-operation ${selected === "Random" ? "has-active" : ""}">
            ${flowToken("Random")}
            <small>随机抽取</small>
          </span>
          ${flowArrow("random-single")}
          <span class="flow-step flow-object ${selected === "SingleSpin_Symbol" ? "has-active" : ""}">
            ${flowToken("SingleSpin_Symbol")}
            <small>本次抽取结果</small>
          </span>
          ${flowArrow("single-put")}
          <span class="flow-step flow-operation ${["Put", "Show_TP"].includes(selected) ? "has-active" : ""}">
            <span>${flowToken("Put")} <i>@</i> ${flowToken("Show_TP")}</span>
            <small>写入／安置</small>
          </span>
          ${flowArrow("put-state")}
          <span class="flow-step flow-object ${selected === "Show_State" ? "has-active" : ""}">
            ${flowToken("Show_State")}
            <small>当前承载状态</small>
          </span>
        </div>
        ${flowDownArrow("state-combo")}
        <div class="flow-lane">
          <span class="flow-step flow-rule ${["Combo", "C1", "C2", "Show_TP"].includes(selected) ? "has-active" : ""}">
            <span>
              ${flowToken("Combo")}<b>(</b>${flowToken("C1", "C₁")}<b>→</b>${flowToken("C2", "C₂?")}<b>)</b>
              <i>@</i> ${flowToken("Show_TP")}
            </span>
            <small>协同判定与结算</small>
          </span>
          ${flowArrow("combo-result")}
          <span class="flow-step flow-object ${selected === "Spin_Result" ? "has-active" : ""}">
            ${flowToken("Spin_Result")}
            <small>单次结果</small>
          </span>
        </div>
        ${flowDownArrow("result-n")}
        <div class="flow-lane">
          <span class="flow-step flow-cycle ${selected === "N" ? "has-active" : ""}">
            <span><b>累计 ×</b> ${flowToken("N")}</span>
            <small>完成一个周期</small>
          </span>
          ${flowArrow("n-bd")}
          <span class="flow-step flow-cycle ${selected === "BD" ? "has-active" : ""}">
            ${flowToken("BD")}
            <small>构筑决策</small>
          </span>
          ${flowArrow("bd-modify")}
          <span class="flow-step flow-cycle ${selected === "BD" ? "has-active" : ""}">
            <strong>修改参数</strong>
            <small>影响后续循环</small>
          </span>
          ${flowArrow("modify-next")}
          <span class="flow-step flow-cycle">
            <strong>下一周期</strong>
            <small>重新进入 Random</small>
          </span>
        </div>
        </div>
      </div>
    </div>
    <div class="formula-selection-feedback">
      <span class="selection-badge">当前字段</span>
      <div>
        <strong>${escapeHtml(formulaDisplayKey(selected))} · ${escapeHtml(term?.name ?? "")}</strong>
        <p>${escapeHtml(term?.definition ?? "")}</p>
        <small>公式位置：${escapeHtml(locationCopies[selected])}</small>
        <small>流程位置：${escapeHtml(flowLocationCopies[selected])}</small>
      </div>
      ${showTpSelected ? "<em>公式与流程中的两个 Show_TP 位置已同时高亮</em>" : ""}
    </div>
  `;

  elements.fieldFormulaMap.querySelectorAll("[data-formula-key]").forEach((button) => {
    button.addEventListener("click", () => {
      selectTerm(button.dataset.formulaKey);
    });
  });
  elements.fieldFormulaMap.querySelectorAll("[data-flow-key]").forEach((button) => {
    button.addEventListener("click", () => {
      selectTerm(button.dataset.flowKey);
    });
  });
}

function selectTerm(key) {
  state.selectedTermKey = key;
  renderFieldFormulaMap();
  renderTermControls();
  renderTermDetail();
}

function renderTermDetail() {
  const term = state.data.termByKey.get(state.selectedTermKey);
  if (!term) {
    elements.termDetail.innerHTML = "<p>当前字段尚无定义。</p>";
    return;
  }

  const status = statusCopy(term.status);
  const inputs = term.inputs?.length ? term.inputs.join(" · ") : "无直接输入";
  const outputs = term.outputs?.length ? term.outputs.join(" · ") : "无直接输出";
  const details = [
    ...(term.boundaries ?? []),
    ...(term.contents ?? []),
    ...(term.possible_effects ?? [])
  ];
  const showTypes = state.data.terms.enums.show_tp_enum.values;
  const putTypes = state.data.terms.enums.put_control_enum.values;
  const detailSectionsMarkup = (term.detail_sections ?? []).map((section) => `
    <section class="field-detail-section">
      <h4 class="detail-section-title">${escapeHtml(section.title)}</h4>
      <div class="field-detail-grid">
        ${section.items.map((item) => `
          <article class="field-detail-card">
            <strong>${escapeHtml(item.name)}</strong>
            <p>${escapeHtml(item.description)}</p>
          </article>
        `).join("")}
      </div>
    </section>
  `).join("");

  elements.termDetail.innerHTML = `
    <div class="detail-kicker">
      <span class="detail-key">${escapeHtml(term.key)}</span>
      <span class="status-pill ${status.className}">${escapeHtml(status.label)}</span>
    </div>
    <h3>${escapeHtml(term.name)}</h3>
    <p class="detail-definition">${escapeHtml(term.definition)}</p>
    <div class="detail-meta-grid">
      <div class="meta-card">
        <span>输入</span>
        <strong>${escapeHtml(inputs)}</strong>
      </div>
      <div class="meta-card">
        <span>输出</span>
        <strong>${escapeHtml(outputs)}</strong>
      </div>
      <div class="meta-card">
        <span>公式位置</span>
        <strong>${escapeHtml(term.formula_location ?? "待补充")}</strong>
      </div>
      <div class="meta-card">
        <span>模型状态</span>
        <strong>${escapeHtml(status.description)}</strong>
      </div>
    </div>
    ${details.length ? `
      <strong>定义边界</strong>
      <ul class="boundary-list">
        ${details.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    ` : ""}
    ${term.key === "Put" ? `
      <section class="field-detail-section field-subsection">
        <div class="subsection-heading">
          <div>
            <p class="eyebrow">PUT · CONTROL TYPES</p>
            <h3>三种正式控制分类</h3>
          </div>
          <p>分类看的是谁决定主要安置结果，而不是玩家有没有点击或是否存在 BD。</p>
        </div>
        <div class="put-type-grid">
          ${putTypes.map((item, index) => `
            <article class="put-type-card">
              <span class="put-type-index">0${index + 1}</span>
              <div>
                <small>${escapeHtml(item.key)}</small>
                <h4>${escapeHtml(item.name)}</h4>
              </div>
              <p>${escapeHtml(item.definition)}</p>
              <strong>${escapeHtml(item.decision_boundary)}</strong>
            </article>
          `).join("")}
        </div>
      </section>
    ` : ""}
    ${term.key === "Show_TP" ? `
      <section class="show-types-block field-subsection">
        <div class="subsection-heading">
          <div>
            <p class="eyebrow">SHOW_TP · FORMAL TYPES</p>
            <h3>五种正式承载拓扑</h3>
          </div>
          <p>
            Put 与 Combo 共用同一个 Show_TP；
            SingleSpin_Symbol 不被强制规定为多重集。
          </p>
        </div>
        <div class="show-types">
          ${showTypes.map((item, index) => {
            const icons = ["{a×n}", "a—b—c", "a—b—c↻", "▦", "x,y"];
            return `
              <article class="show-type-card">
                <span class="topology-icon" aria-hidden="true">${escapeHtml(icons[index])}</span>
                <strong>${escapeHtml(item.name)}</strong>
                <small>${escapeHtml(item.key)}</small>
                <p>${escapeHtml(item.definition)}</p>
              </article>
            `;
          }).join("")}
        </div>
      </section>
    ` : ""}
    ${detailSectionsMarkup}
  `;
}

function renderStats() {
  const values = [
    [state.data.mechanisms.length, "机制母型"],
    [state.data.prototypes.length, "品类原型"],
    [state.data.variants.length, "品类变体"],
    [new Set(state.data.products.map((item) => item.id)).size, "具体产品"]
  ];
  elements.atlasStats.innerHTML = values.map(([value, label]) => `
    <div class="stat-card">
      <strong>${value}</strong>
      <span>${escapeHtml(label)}</span>
    </div>
  `).join("");
}

function cardCounts(node) {
  if (node.type === "mechanism_archetype") {
    const prototypes = prototypesFor(node.id);
    const variants = prototypes.flatMap((item) => variantsFor(item.id));
    return [
      `${prototypes.length} 原型`,
      `${variants.length} 变体`,
      `${productsFor(node).length} 产品`
    ];
  }
  if (node.type === "category_prototype") {
    return [
      `${variantsFor(node.id).length} 变体`,
      `${productsFor(node).length} 产品`
    ];
  }
  const changes = Object.values(node.formula_changes).filter(
    (item) => item.operation !== "inherit"
  ).length;
  return [
    `${FORMULA_FIELDS.length - changes} 继承`,
    `${changes} 变化`,
    `${productsFor(node).length} 产品`
  ];
}

function cardMarkup(node, inPath, current) {
  const status = statusCopy(node.status);
  const temporaryName = node.name_status === "temporary"
    ? '<span class="name-status">暂定名</span>'
    : "";

  return `
    <button
      class="atlas-card ${inPath ? "in-path" : ""} ${current ? "current" : ""}"
      type="button"
      data-node-id="${escapeHtml(node.id)}"
      aria-pressed="${current}"
    >
      <span class="card-type">
        ${escapeHtml(TYPE_LABELS[node.type])}
        <span class="card-state-stack">
          <span class="status-pill ${status.className}">${escapeHtml(status.label)}</span>
          ${current ? '<span class="current-node-badge"><i></i>当前查看</span>' : ""}
        </span>
      </span>
      <h4>${escapeHtml(node.name)}${temporaryName}</h4>
      <p>${escapeHtml(node.summary)}</p>
      <span class="card-counts">
        ${cardCounts(node).map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
      </span>
    </button>
  `;
}

function emptyRailMarkup(copy) {
  return `<div class="empty-rail">${escapeHtml(copy)}</div>`;
}

function renderRails() {
  const mechanisms = state.data.mechanisms
    .filter(nodeIsVisible)
    .sort((a, b) => a.order - b.order);
  const allPrototypes = prototypesFor(state.selectedMechanismId);
  const prototypes = allPrototypes.filter(nodeIsVisible);
  const allVariants = variantsFor(state.selectedPrototypeId);
  const variants = allVariants.filter(nodeIsVisible);

  elements.mechanismCount.textContent = `共 ${state.data.mechanisms.length} 种`;
  elements.prototypeCount.textContent = `包含 ${allPrototypes.length} 种`;
  elements.variantCount.textContent = `包含 ${allVariants.length} 种`;

  elements.mechanismRail.innerHTML = mechanisms.length
    ? mechanisms.map((node) => cardMarkup(
        node,
        node.id === state.selectedMechanismId,
        state.detailLevel === "mechanism" && node.id === state.selectedMechanismId
      )).join("")
    : emptyRailMarkup("没有符合条件的机制母型");

  elements.prototypeRail.innerHTML = prototypes.length
    ? prototypes.map((node) => cardMarkup(
        node,
        state.detailLevel !== "mechanism" && node.id === state.selectedPrototypeId,
        state.detailLevel === "prototype" && node.id === state.selectedPrototypeId
      )).join("")
    : emptyRailMarkup("当前母型下没有符合条件的品类原型");

  elements.variantRail.innerHTML = variants.length
    ? variants.map((node) => cardMarkup(
        node,
        state.detailLevel === "variant" && node.id === state.selectedVariantId,
        state.detailLevel === "variant" && node.id === state.selectedVariantId
      )).join("")
    : emptyRailMarkup("当前原型下没有符合条件的品类变体");

  elements.mechanismRail.querySelectorAll("[data-node-id]").forEach((button) => {
    button.addEventListener("click", () => selectMechanism(button.dataset.nodeId));
  });
  elements.prototypeRail.querySelectorAll("[data-node-id]").forEach((button) => {
    button.addEventListener("click", () => selectPrototype(button.dataset.nodeId));
  });
  elements.variantRail.querySelectorAll("[data-node-id]").forEach((button) => {
    button.addEventListener("click", () => selectVariant(button.dataset.nodeId));
  });
}

function selectMechanism(id) {
  state.selectedMechanismId = id;
  state.selectedPrototypeId = prototypesFor(id)[0]?.id ?? null;
  state.selectedVariantId = variantsFor(state.selectedPrototypeId)[0]?.id ?? null;
  state.detailLevel = "mechanism";
  renderAtlas();
}

function selectPrototype(id) {
  const prototype = state.data.prototypeById.get(id);
  state.selectedMechanismId = prototype.primary_mother_id;
  state.selectedPrototypeId = id;
  state.selectedVariantId = variantsFor(id)[0]?.id ?? null;
  state.detailLevel = "prototype";
  renderAtlas();
}

function selectVariant(id) {
  const variant = state.data.variantById.get(id);
  const prototype = state.data.prototypeById.get(variant.prototype_id);
  state.selectedMechanismId = prototype.primary_mother_id;
  state.selectedPrototypeId = prototype.id;
  state.selectedVariantId = id;
  state.detailLevel = "variant";
  renderAtlas();
}

function selectAtlasPathNode(id, type) {
  if (type === "mechanism_archetype") {
    selectMechanism(id);
    return;
  }
  if (type === "category_prototype") {
    selectPrototype(id);
    return;
  }
  if (type === "category_variant") {
    selectVariant(id);
  }
}

function selectedNode() {
  if (state.detailLevel === "mechanism") {
    return state.data.mechanismById.get(state.selectedMechanismId);
  }
  if (state.detailLevel === "prototype") {
    return state.data.prototypeById.get(state.selectedPrototypeId);
  }
  return state.data.variantById.get(state.selectedVariantId);
}

function parentNode(node) {
  if (node.type === "category_prototype") {
    return state.data.mechanismById.get(node.primary_mother_id);
  }
  if (node.type === "category_variant") {
    return state.data.prototypeById.get(node.prototype_id);
  }
  return null;
}

function rawFingerprint(node) {
  return node.formula_constraints ?? node.formula_changes;
}

function inheritancePath(node) {
  const path = [];
  let current = node;

  while (current) {
    path.unshift(current);
    current = parentNode(current);
  }
  return path;
}

function effectiveFingerprint(node) {
  const own = rawFingerprint(node);
  const parent = parentNode(node);
  const inherited = parent ? effectiveFingerprint(parent) : {};
  const result = {};

  for (const field of FORMULA_FIELDS) {
    const entry = own[field];
    const parentEntry = inherited[field];
    if (entry.operation === "inherit" && parentEntry) {
      result[field] = {
        operation: entry.operation,
        summary: parentEntry.summary,
        source: parentEntry.source,
        label: parentEntry.label,
        note: entry.summary
      };
    } else {
      result[field] = {
        operation: entry.operation,
        summary: entry.summary,
        source: entry.operation === "inherit" ? "体验公式" : node.name,
        label: entry.constraint_label ?? FIELD_LABELS[field],
        note: null
      };
    }
  }
  return result;
}

function atlasFormulaField(node, field, label = field) {
  const layers = inheritancePath(node);
  const currentEntry = rawFingerprint(node)[field];
  const hasParent = Boolean(parentNode(node));
  const currentChanged = hasParent && currentEntry.operation !== "inherit";
  const layerClass = {
    mechanism_archetype: "mechanism",
    category_prototype: "prototype",
    category_variant: "variant"
  };
  const title = layers.map((layerNode) => {
    const entry = rawFingerprint(layerNode)[field];
    return `${layerNode.name}：${entry.summary}`;
  }).join(" → ");

  return `
    <span
      class="atlas-formula-field ${hasParent ? (currentChanged ? "current-changed" : "current-inherited") : "base-defined"}"
      data-atlas-formula-field="${escapeHtml(field)}"
      data-current-operation="${escapeHtml(currentEntry.operation)}"
      title="${escapeHtml(title)}"
    >
      <span class="atlas-field-head">
        <code>${escapeHtml(label)}</code>
        ${currentChanged ? '<em>本层变化</em>' : ""}
      </span>
      <span class="atlas-constraint-stack">
        ${layers.map((layerNode) => {
          const entry = rawFingerprint(layerNode)[field];
          const isInherited = entry.operation === "inherit";
          const isCurrentLayer = layerNode.id === node.id;
          return `
            <span class="atlas-constraint-line ${layerClass[layerNode.type]} ${isInherited ? "is-inherit" : "is-change"} ${isCurrentLayer ? "is-current-layer" : ""}">
              <small>
                ${escapeHtml(TYPE_LABELS[layerNode.type])}
                · ${escapeHtml(OPERATION_LABELS[entry.operation] ?? entry.operation)}
              </small>
              <strong>${isInherited ? "↳ 同上" : escapeHtml(entry.constraint_label ?? entry.summary)}</strong>
            </span>
          `;
        }).join("")}
      </span>
    </span>
  `;
}

function renderAtlasFormula() {
  const node = selectedNode();
  if (!node) {
    elements.atlasFormulaMap.innerHTML = "<p>请选择一个图谱节点。</p>";
    return;
  }

  const path = inheritancePath(node);
  const pathCopy = path.map((item) => item.name).join(" → ");
  const parent = parentNode(node);
  const changedFields = FORMULA_FIELDS.filter(
    (field) => rawFingerprint(node)[field].operation !== "inherit"
  );
  const pathTypeClass = {
    mechanism_archetype: "mechanism",
    category_prototype: "prototype",
    category_variant: "variant"
  };

  elements.atlasFormulaMap.innerHTML = `
    <div class="atlas-formula-context" aria-label="当前节点的完整继承路径">
      <span class="atlas-path-caption">当前选择路径</span>
      <div class="atlas-inheritance-path">
        ${path.map((pathNode, index) => {
          const parentPathNode = path[index - 1];
          return `
          ${index > 0 ? '<span class="atlas-path-arrow" aria-hidden="true">→</span>' : ""}
          <span class="atlas-path-node ${pathTypeClass[pathNode.type]}">
            <small>${escapeHtml(TYPE_LABELS[pathNode.type])}</small>
            <strong>${escapeHtml(pathNode.name)}</strong>
            ${parentPathNode ? `
              <button
                type="button"
                class="atlas-path-remove"
                data-atlas-path-up="${escapeHtml(parentPathNode.id)}"
                data-atlas-path-up-type="${escapeHtml(parentPathNode.type)}"
                aria-label="取消 ${escapeHtml(pathNode.name)}，返回 ${escapeHtml(parentPathNode.name)}"
                title="取消本层，返回 ${escapeHtml(parentPathNode.name)}"
              >×</button>
            ` : ""}
          </span>
        `;
        }).join("")}
      </div>
    </div>
    <div class="atlas-delta-summary ${parent ? "" : "base"}">
      <span>${parent ? `相对上层 · ${escapeHtml(parent.name)}` : "机制母型基础定义"}</span>
      <strong>
        ${parent
          ? `本层改变 ${changedFields.length} / ${FORMULA_FIELDS.length} 个字段`
          : `定义 ${FORMULA_FIELDS.length} 个公式字段`}
      </strong>
      <p>
        ${parent
          ? (changedFields.length
            ? changedFields.map((field) => escapeHtml(formulaDisplayKey(field))).join(" · ")
            : "没有直接变化，全部继承上层")
          : "以下内容是下层品类原型继续约束的起点"}
      </p>
    </div>
    <div class="atlas-pressure-domain depth-${path.length}">
      <div class="atlas-pressure-domain-head">
        <span>
          <small>外层边界条件</small>
          <strong>目标压力域包裹完整循环，不参与单次符号运算</strong>
        </span>
        ${atlasFormulaField(node, "P_t", "P(t)")}
      </div>
      <div class="atlas-formula-scroll">
        <div class="atlas-constraint-formula depth-${path.length}" aria-label="${escapeHtml(node.name)}的逐层公式约束">
          <span class="atlas-formula-bracket">[</span>
          <span class="atlas-formula-stage">
            ${atlasFormulaField(node, "Random")}
            <span class="atlas-formula-scope">@</span>
            ${atlasFormulaField(node, "Pool_Symbol")}
          </span>
          <span class="atlas-formula-arrow">→</span>
          <span class="atlas-formula-stage">
            ${atlasFormulaField(node, "Put")}
            <span class="atlas-formula-scope">@</span>
            ${atlasFormulaField(node, "Show_TP")}
          </span>
          <span class="atlas-formula-arrow">→</span>
          <span class="atlas-formula-stage combo">
            <span class="atlas-formula-fixed">Combo(</span>
            ${atlasFormulaField(node, "C1", "C₁")}
            <span class="atlas-formula-fixed">→</span>
            ${atlasFormulaField(node, "C2", "C₂?")}
            <span class="atlas-formula-fixed">)</span>
            <span class="atlas-formula-scope">@</span>
            ${atlasFormulaField(node, "Show_TP")}
          </span>
          <span class="atlas-formula-bracket">]</span>
          ${atlasFormulaField(node, "N", "ₙ")}
          <span class="atlas-formula-arrow">→</span>
          <span class="atlas-formula-stage">
            ${atlasFormulaField(node, "BD")}
          </span>
        </div>
      </div>
      <p class="atlas-pressure-domain-note">
        P(t) 可以具有独立于 N 的目标检查周期；例如《幸运房东》的房租检查不等于每次 Spin 后触发 BD 的 N = 1。
      </p>
    </div>
    <div class="atlas-formula-note">
      <strong>正在查看：${escapeHtml(pathCopy)}</strong>
      <span>
        红色为机制母型，黄色为品类原型，绿色为品类变体。
        同一字段按继承顺序逐行显示；重复字段同步显示相同约束。
      </span>
    </div>
  `;

  elements.atlasFormulaMap.querySelectorAll("[data-atlas-path-up]").forEach((button) => {
    button.addEventListener("click", () => {
      selectAtlasPathNode(
        button.dataset.atlasPathUp,
        button.dataset.atlasPathUpType
      );
    });
  });
}

function relationMetrics(node) {
  if (node.type === "mechanism_archetype") {
    const prototypes = prototypesFor(node.id);
    return [
      [prototypes.length, "直接品类原型"],
      [prototypes.flatMap((item) => variantsFor(item.id)).length, "全部品类变体"],
      [productsFor(node).length, "关联产品"],
      [node.open_axes.length, "开放变量"]
    ];
  }
  if (node.type === "category_prototype") {
    const changes = Object.values(node.formula_changes);
    return [
      [1, "上级机制母型"],
      [variantsFor(node.id).length, "直接品类变体"],
      [productsFor(node).length, "关联产品"],
      [changes.filter((item) => item.operation !== "inherit").length, "自身约束字段"]
    ];
  }
  const changes = Object.values(node.formula_changes);
  return [
    [1, "上级品类原型"],
    [changes.filter((item) => item.operation === "inherit").length, "继承字段"],
    [changes.filter((item) => item.operation !== "inherit").length, "变化字段"],
    [productsFor(node).length, "关联产品"]
  ];
}

function renderBreadcrumb() {
  const mechanism = state.data.mechanismById.get(state.selectedMechanismId);
  const prototype = state.data.prototypeById.get(state.selectedPrototypeId);
  const variant = state.data.variantById.get(state.selectedVariantId);
  const parts = [
    mechanism && { level: "mechanism", node: mechanism },
    prototype && { level: "prototype", node: prototype },
    variant && { level: "variant", node: variant }
  ].filter(Boolean);

  elements.breadcrumb.innerHTML = parts.map((part, index) => `
    ${index ? "<span>/</span>" : ""}
    <button type="button" data-level="${part.level}">
      ${escapeHtml(part.node.name)}
    </button>
  `).join("");

  elements.breadcrumb.querySelectorAll("[data-level]").forEach((button) => {
    button.addEventListener("click", () => {
      state.detailLevel = button.dataset.level;
      renderAtlas();
    });
  });
}

function renderNodeDetail() {
  const node = selectedNode();
  if (!node) {
    elements.nodeDetail.innerHTML = "<p>请选择一个图谱节点。</p>";
    return;
  }

  const status = statusCopy(node.status);
  const metrics = relationMetrics(node);
  const fingerprint = effectiveFingerprint(node);
  const products = productsFor(node);
  const parent = parentNode(node);
  const identityRules = node.identity_rules ?? node.open_axes ?? [];

  elements.nodeDetail.innerHTML = `
    <div class="node-header">
      <div>
        <span class="node-type-label">${escapeHtml(TYPE_LABELS[node.type])}</span>
        <h3 class="node-title">
          ${escapeHtml(node.name)}
          ${node.name_status === "temporary"
            ? '<span class="name-status">暂定名</span>'
            : ""}
        </h3>
        <p class="node-summary">${escapeHtml(node.definition)}</p>
      </div>
      <div class="node-status-box">
        <strong>${escapeHtml(status.label)}</strong>
        <p>${escapeHtml(status.description)}</p>
        ${parent ? `<p>继承自：${escapeHtml(parent.name)}</p>` : "<p>体验公式下的第一层约束。</p>"}
      </div>
    </div>

    <div class="node-metrics">
      ${metrics.map(([value, label]) => `
        <div class="node-metric">
          <strong>${value}</strong>
          <span>${escapeHtml(label)}</span>
        </div>
      `).join("")}
    </div>

    <h4 class="detail-section-title">公式指纹 · 相对父级的操作</h4>
    <div class="fingerprint-grid">
      ${FORMULA_FIELDS.map((field) => {
        const item = fingerprint[field];
        return `
          <button class="fingerprint-card" type="button" data-field="${escapeHtml(field)}">
            <header>
              <code>${escapeHtml(field)}</code>
              <span class="operation-pill ${escapeHtml(item.operation)}">
                ${escapeHtml(OPERATION_LABELS[item.operation] ?? item.operation)}
              </span>
            </header>
            <p>${escapeHtml(item.summary)}</p>
            <span class="fingerprint-source">当前有效来源：${escapeHtml(item.source)}</span>
          </button>
        `;
      }).join("")}
    </div>

    ${identityRules.length ? `
      <h4 class="detail-section-title">
        ${node.type === "mechanism_archetype" ? "留给下层的开放变量" : "身份与继承规则"}
      </h4>
      <ul class="identity-list">
        ${identityRules.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    ` : ""}

    <h4 class="detail-section-title">关联具体产品</h4>
    <div class="product-chips">
      ${products.length
        ? products.map((product) => `
          <span class="product-chip">
            ${escapeHtml(product.name)}
            <small>${escapeHtml(product.relation_types
              .map((type) => RELATION_LABELS[type] ?? type)
              .join(" · "))}</small>
          </span>
        `).join("")
        : '<span class="product-chip">暂未关联产品</span>'}
    </div>
  `;

  elements.nodeDetail.querySelectorAll("[data-field]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedTermKey = button.dataset.field;
      renderTermControls();
      renderTermDetail();
      window.location.hash = "model-content";
      document.querySelector("#model-content").scrollIntoView({ behavior: "smooth" });
    });
  });
}

function renderAtlas() {
  renderAtlasFormula();
  renderStats();
  renderRails();
  renderBreadcrumb();
  renderNodeDetail();
}

function selectSearchResult() {
  if (!state.query) {
    return;
  }
  const query = state.query.toLowerCase();
  const allNodes = [
    ...state.data.variants,
    ...state.data.prototypes,
    ...state.data.mechanisms
  ];
  const match = allNodes.find((item) =>
    `${item.name} ${item.summary}`.toLowerCase().includes(query)
  );

  if (!match) {
    return;
  }
  if (match.type === "mechanism_archetype") selectMechanism(match.id);
  if (match.type === "category_prototype") selectPrototype(match.id);
  if (match.type === "category_variant") selectVariant(match.id);
}

function bindToolbar() {
  let searchTimer;
  elements.search.addEventListener("input", () => {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => {
      state.query = elements.search.value.trim();
      selectSearchResult();
      renderRails();
    }, 100);
  });

  elements.search.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      state.query = elements.search.value.trim();
      selectSearchResult();
      renderAtlas();
    }
  });

  elements.filter.addEventListener("change", () => {
    state.filter = elements.filter.value;
    renderRails();
  });
}

function updateServiceBar() {
  const online = state.dataServiceOnline;
  elements.libraryServiceBar.classList.toggle("online", online);
  elements.libraryServiceBar.classList.toggle("offline", !online);
  const title = elements.libraryServiceBar.querySelector("strong");
  const copy = elements.libraryServiceBar.querySelector("p");
  title.textContent = online ? "本地数据服务已连接" : "当前为只读查看模式";
  copy.textContent = online
    ? "字段调整、人工确认与变更记录会直接保存到 202607 数据文件。"
    : "请通过项目本地服务打开网页；直接使用 file:// 或普通静态服务无法保存修改。";
  elements.fieldEditorSave.disabled = !online;
  elements.fieldEditorConfirm.disabled = !online;
}

async function checkDataService() {
  if (!/^https?:$/.test(window.location.protocol)) {
    state.dataServiceOnline = false;
    updateServiceBar();
    return;
  }
  try {
    const response = await fetch("./api/status", { cache: "no-store" });
    const payload = await response.json();
    state.dataServiceOnline = response.ok && payload.ok === true;
  } catch {
    state.dataServiceOnline = false;
  }
  updateServiceBar();
}

function selectLibraryView(view) {
  if (!["products", "matrix", "review"].includes(view)) return;
  state.libraryView = view;
  elements.libraryViewButtons.forEach((button) => {
    const active = button.dataset.libraryView === view;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  elements.libraryPanels.forEach((panel) => {
    panel.hidden = panel.dataset.libraryPanel !== view;
  });
}

function showDataToast(message, kind = "success") {
  window.clearTimeout(state.toastTimer);
  elements.dataToast.textContent = message;
  elements.dataToast.className = `data-toast ${kind}`;
  elements.dataToast.hidden = false;
  state.toastTimer = window.setTimeout(() => {
    elements.dataToast.hidden = true;
  }, 3200);
}

function openFieldEditor(nodeId, field) {
  const node = libraryNodeById(nodeId);
  if (!node || !FORMULA_FIELDS.includes(field)) return;
  const entry = rawFingerprint(node)[field];
  const parent = parentNode(node);
  const parentEntry = parent ? effectiveFingerprint(parent)[field] : null;
  const path = inheritancePath(node).map((item) => item.name).join(" → ");
  state.editingField = { nodeId, field };

  elements.fieldEditorPath.textContent = `${TYPE_LABELS[node.type]} · ${path}`;
  elements.fieldEditorTitle.textContent = `${formulaDisplayKey(field)} · ${FIELD_LABELS[field]}`;
  elements.fieldEditorParent.textContent = parentEntry
    ? `${parentEntry.label}｜${parentEntry.summary}`
    : "体验公式基础字段；当前节点负责给出第一层约束。";

  const operationEntries = Object.entries(OPERATION_LABELS)
    .filter(([operation]) => parent || operation !== "inherit");
  elements.fieldEditorOperation.innerHTML = operationEntries.map(([value, label]) => `
    <option value="${escapeHtml(value)}">${escapeHtml(label)} · ${escapeHtml(value)}</option>
  `).join("");
  elements.fieldEditorOperation.value = entry.operation;
  elements.fieldEditorStatus.value = reviewStatusFor(node, entry);
  elements.fieldEditorLabel.value = entry.constraint_label ?? "";
  elements.fieldEditorSummary.value = entry.summary ?? "";
  elements.fieldEditorNote.value = entry.review_note ?? "";
  elements.fieldEditorMessage.textContent = state.dataServiceOnline
    ? "修改会写回当前节点的直接约束；继承后的有效结果将自动重新计算。"
    : "当前是只读模式。请使用本地数据服务打开页面后再保存。";
  elements.fieldEditorMessage.className = `field-editor-message ${state.dataServiceOnline ? "" : "warning"}`;

  if (typeof elements.fieldEditor.showModal === "function") {
    elements.fieldEditor.showModal();
  } else {
    elements.fieldEditor.setAttribute("open", "");
  }
}

function closeFieldEditor() {
  state.editingField = null;
  if (typeof elements.fieldEditor.close === "function") {
    elements.fieldEditor.close();
  } else {
    elements.fieldEditor.removeAttribute("open");
  }
}

function setEditorBusy(busy) {
  elements.fieldEditorSave.disabled = busy || !state.dataServiceOnline;
  elements.fieldEditorConfirm.disabled = busy || !state.dataServiceOnline;
  elements.fieldEditorCancel.disabled = busy;
  elements.fieldEditorClose.disabled = busy;
}

async function refreshDataFromFiles() {
  state.data = await loadData();
  renderFieldFormulaMap();
  renderTermControls();
  renderTermDetail();
  renderAtlas();
  renderLibrary();
}

async function saveEditedField(action = "update") {
  if (!state.dataServiceOnline || !state.editingField) return;
  const node = libraryNodeById(state.editingField.nodeId);
  if (!node) return;

  const payload = {
    node_id: state.editingField.nodeId,
    field: state.editingField.field,
    action,
    operation: elements.fieldEditorOperation.value,
    constraint_label: elements.fieldEditorLabel.value.trim(),
    summary: elements.fieldEditorSummary.value.trim(),
    review_status: action === "confirm"
      ? "confirmed"
      : elements.fieldEditorStatus.value,
    review_note: elements.fieldEditorNote.value.trim()
  };

  if (!payload.constraint_label || !payload.summary) {
    elements.fieldEditorMessage.textContent = "约束短标签和字段描述不能为空。";
    elements.fieldEditorMessage.className = "field-editor-message error";
    return;
  }

  setEditorBusy(true);
  elements.fieldEditorMessage.textContent = action === "confirm"
    ? "正在确认并写入数据…"
    : "正在保存调整…";
  elements.fieldEditorMessage.className = "field-editor-message";

  try {
    const response = await fetch("./api/update-field", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok || !result.ok) {
      throw new Error(result.error ?? "保存失败");
    }

    await refreshDataFromFiles();
    closeFieldEditor();
    showDataToast(action === "confirm"
      ? `${node.name} · ${payload.field} 已人工确认`
      : `${node.name} · ${payload.field} 已保存`);
  } catch (error) {
    elements.fieldEditorMessage.textContent = error.message;
    elements.fieldEditorMessage.className = "field-editor-message error";
  } finally {
    setEditorBusy(false);
  }
}

function bindLibrary() {
  elements.fieldFilter.innerHTML = `
    <option value="all">全部字段</option>
    ${FORMULA_FIELDS.map((field) => `
      <option value="${escapeHtml(field)}">${escapeHtml(formulaDisplayKey(field))} · ${escapeHtml(FIELD_LABELS[field])}</option>
    `).join("")}
  `;

  elements.libraryViewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectLibraryView(button.dataset.libraryView);
    });
  });

  elements.productSearch.addEventListener("input", () => {
    state.libraryProductQuery = elements.productSearch.value.trim();
    renderProductCatalog();
  });

  elements.productFilter.addEventListener("change", () => {
    state.libraryProductFilter = elements.productFilter.value;
    renderProductCatalog();
  });

  elements.levelFilter.addEventListener("change", () => {
    state.libraryLevelFilter = elements.levelFilter.value;
    renderFormulaMatrix();
  });

  elements.fieldFilter.addEventListener("change", () => {
    state.libraryFieldFilter = elements.fieldFilter.value;
    renderFormulaMatrix();
  });

  elements.refreshReviewQueue.addEventListener("click", async () => {
    try {
      await refreshDataFromFiles();
      showDataToast("待确认队列已刷新");
    } catch {
      showDataToast("刷新失败，请检查数据文件", "error");
    }
  });

  elements.fieldEditorClose.addEventListener("click", closeFieldEditor);
  elements.fieldEditorCancel.addEventListener("click", closeFieldEditor);
  elements.fieldEditor.addEventListener("click", (event) => {
    if (event.target === elements.fieldEditor) closeFieldEditor();
  });
  elements.fieldEditorForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveEditedField("update");
  });
  elements.fieldEditorConfirm.addEventListener("click", () => {
    elements.fieldEditorStatus.value = "confirmed";
    saveEditedField("confirm");
  });

  elements.productDetailClose.addEventListener("click", closeProductDetail);
  elements.productDetail.addEventListener("click", (event) => {
    if (event.target === elements.productDetail) closeProductDetail();
  });

  selectLibraryView(state.libraryView);
}

async function init() {
  try {
    bindLuckLandlordCase();
    bindExperienceTimeline();
    state.data = await loadData();
    setDefaultSelection();
    renderFieldFormulaMap();
    renderTermControls();
    renderTermDetail();
    renderAtlas();
    bindLibrary();
    renderLibrary();
    bindToolbar();
    await checkDataService();
  } catch (error) {
    console.error(error);
    elements.fatalMessage.hidden = false;
  }
}

init();
