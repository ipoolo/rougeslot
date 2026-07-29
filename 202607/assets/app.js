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
  if (field === "C2") return "C₂";
  return field;
}

const NODE_TYPE_ORDER = {
  mechanism_archetype: 1,
  category_prototype: 2,
  category_variant: 3
};

const DATA_VERSION = "20260728-23";

const DATA_FILES = {
  model: `./data/experience-model.json?v=${DATA_VERSION}`,
  terms: `./data/terms.json?v=${DATA_VERSION}`,
  mechanisms: `./data/mechanism-archetypes.json?v=${DATA_VERSION}`,
  prototypes: `./data/category-prototypes.json?v=${DATA_VERSION}`,
  variants: `./data/category-variants.json?v=${DATA_VERSION}`,
  products: `./data/products.json?v=${DATA_VERSION}`,
  productObservations: `./data/product-formula-observations.json?v=${DATA_VERSION}`,
  ecosystems: `./data/category-ecosystems.json?v=${DATA_VERSION}`,
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
  atlasVariantViewMode: "compact",
  libraryView: "products",
  libraryProductQuery: "",
  libraryProductFilter: "all",
  librarySlotMotherOnly: true,
  libraryPrototypeFilter: "all",
  libraryLevelFilter: "all",
  libraryFieldFilter: "all",
  dataServiceOnline: false,
  editingField: null,
  selectedProductId: null,
  editingProductId: null,
  selectedEcosystemPrototypeId: "prototype.slot-numeric",
  selectedEcosystemProductId: "product.luck-be-a-landlord",
  selectedEcosystemField: null,
  creatingNodeType: null,
  editingNodeId: null
};

const elements = {
  luckLandlordCase: document.querySelector("#luck-landlord-case"),
  experienceTimeline: document.querySelector("#experience-timeline"),
  fieldFormulaMap: document.querySelector("#field-formula-map"),
  termControls: document.querySelector("#formula-controls"),
  termDetail: document.querySelector("#term-detail"),
  insightModel: document.querySelector("#insight-model"),
  slotPrototypeMatrix: document.querySelector("#slot-prototype-matrix"),
  slotPrototypeMatrixInfo: document.querySelector("#slot-prototype-matrix-info"),
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
  variantViewToggle: document.querySelector("#atlas-variant-view-toggle"),
  variantViewButtons: [...document.querySelectorAll("[data-variant-view-mode]")],
  atlasSummaryDialog: document.querySelector("#atlas-summary-dialog"),
  atlasSummaryTitle: document.querySelector("#atlas-summary-title"),
  atlasSummaryType: document.querySelector("#atlas-summary-type"),
  atlasSummaryCopy: document.querySelector("#atlas-summary-copy"),
  atlasSummaryClose: document.querySelector("#atlas-summary-close"),
  breadcrumb: document.querySelector("#atlas-breadcrumb"),
  nodeDetail: document.querySelector("#node-detail"),
  libraryServiceBar: document.querySelector("#library-service-bar"),
  libraryStats: document.querySelector("#library-stats"),
  libraryViewButtons: [...document.querySelectorAll("[data-library-view]")],
  libraryPanels: [...document.querySelectorAll("[data-library-panel]")],
  productSearch: document.querySelector("#library-product-search"),
  productFilter: document.querySelector("#library-product-filter"),
  motherFilter: document.querySelector("#library-mother-filter"),
  prototypeFilter: document.querySelector("#library-prototype-filter"),
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
  ecosystemPrototypeList: document.querySelector("#ecosystem-prototype-list"),
  ecosystemWorkbench: document.querySelector("#ecosystem-workbench"),
  graphManager: document.querySelector("#graph-manager"),
  classificationEditor: document.querySelector("#classification-editor"),
  classificationEditorForm: document.querySelector("#classification-editor-form"),
  classificationEditorTitle: document.querySelector("#classification-editor-title"),
  classificationEditorMechanism: document.querySelector("#classification-editor-mechanism"),
  classificationEditorPrototype: document.querySelector("#classification-editor-prototype"),
  classificationEditorRole: document.querySelector("#classification-editor-role"),
  classificationEditorStatus: document.querySelector("#classification-editor-status"),
  classificationEditorNote: document.querySelector("#classification-editor-note"),
  classificationEditorMessage: document.querySelector("#classification-editor-message"),
  classificationEditorClose: document.querySelector("#classification-editor-close"),
  classificationEditorCancel: document.querySelector("#classification-editor-cancel"),
  classificationEditorSave: document.querySelector("#classification-editor-save"),
  nodeCreator: document.querySelector("#node-creator"),
  nodeCreatorForm: document.querySelector("#node-creator-form"),
  nodeCreatorTitle: document.querySelector("#node-creator-title"),
  nodeCreatorType: document.querySelector("#node-creator-type"),
  nodeCreatorParentField: document.querySelector("#node-creator-parent-field"),
  nodeCreatorParentLabel: document.querySelector("#node-creator-parent-label"),
  nodeCreatorParent: document.querySelector("#node-creator-parent"),
  nodeCreatorProductField: document.querySelector("#node-creator-product-field"),
  nodeCreatorProduct: document.querySelector("#node-creator-product"),
  nodeCreatorRoleField: document.querySelector("#node-creator-role-field"),
  nodeCreatorRole: document.querySelector("#node-creator-role"),
  nodeCreatorNameField: document.querySelector("#node-creator-name-field"),
  nodeCreatorName: document.querySelector("#node-creator-name"),
  nodeCreatorSummaryField: document.querySelector("#node-creator-summary-field"),
  nodeCreatorSummary: document.querySelector("#node-creator-summary"),
  nodeCreatorDefinitionField: document.querySelector("#node-creator-definition-field"),
  nodeCreatorDefinition: document.querySelector("#node-creator-definition"),
  nodeCreatorMessage: document.querySelector("#node-creator-message"),
  nodeCreatorClose: document.querySelector("#node-creator-close"),
  nodeCreatorCancel: document.querySelector("#node-creator-cancel"),
  nodeCreatorSave: document.querySelector("#node-creator-save"),
  nodeCreatorDelete: document.querySelector("#node-creator-delete"),
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

const CORE_INSIGHT_PRESETS = {
  all: {
    label: "总原则",
    title: "C₁ 负责立即可读，C₂ 负责保留不确定性并二次揭晓。",
    copy: "学习、构筑和压力验证位于结果之后或循环外层，用来放大体验，不应成为进入最小爽环的通行证。",
    boundary: "边界：C₂ 负责结果如何被演绎；P(t) 负责判断最终结果是否足够。",
    nodes: [],
    edges: [],
    zones: []
  },
  c1: {
    label: "洞察 1 · C₁ 先验可读性",
    title: "玩家不依赖新教学，也应能判断这次抽取的基础价值。",
    copy: "Slot改 可以替换支付线和基础协同，但新规则必须继续借用常识、物理关系或成熟的品类先验。学习应该在结果之后解释怎样变强，而不是在结果之前解释有没有中奖。",
    boundary: "检查边界：决定基础协同是否成立的规则属于 C₁；只在基础结果之上修饰或转译的规则应优先放入 C₂。",
    nodes: ["prior", "reveal", "c1", "learning"],
    edges: ["prior-reveal", "reveal-c1", "learning-next"],
    zones: ["first-peak", "long-cycle"]
  },
  c2: {
    label: "洞察 2 · C₂ 二次揭晓",
    title: "C₂ 不是播放确定答案，而是让最终答案在过程中逐步封闭。",
    copy: "C₁结束时玩家可以知道“大概不错”，但仍不能精确算完结果；C₂通过位置、顺序、局部交互与连续反馈，让玩家持续预测并修正预测。",
    boundary: "检查边界：只有动画而没有主观不确定性，只是结算展示；目标是否达标仍由 P(t) 判断，不属于 C₂。",
    nodes: ["c1", "c2", "result"],
    edges: ["c1-c2", "c2-result"],
    zones: ["first-peak", "second-peak"]
  },
  hybrid: {
    label: "高风险组合 · Slot改+战斗",
    title: "同时保护 C₁ 的大奖识别，并让 C₂ 的战斗结果保持悬念。",
    copy: "这种组合既改写基础协同，又把结果演绎成战斗，最容易让两个体验阶段相互侵占。棋盘过大、符号过多或关系过深，会先削弱第一峰；结果过早可计算，又会削弱第二峰。",
    boundary: "设计约束：控制棋盘大小、符号类型、关系层数与跨区域依赖；先让基础协同清晰成立，再进入紧凑的战斗时序。",
    nodes: ["reveal", "c1", "c2", "result"],
    edges: ["reveal-c1", "c1-c2", "c2-result"],
    zones: ["first-peak", "second-peak"]
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

function selectCoreInsight(key = "all") {
  const root = elements.insightModel;
  const preset = CORE_INSIGHT_PRESETS[key] ?? CORE_INSIGHT_PRESETS.all;
  if (!root) return;

  const focused = key !== "all";
  root.dataset.insightSelection = key;
  root.classList.toggle("is-insight-focused", focused);

  root.querySelectorAll("[data-insight-node]").forEach((node) => {
    const involved = preset.nodes.includes(node.dataset.insightNode);
    node.classList.toggle("is-focused", focused && involved);
    node.classList.toggle("is-context", focused && !involved);
  });

  root.querySelectorAll("[data-insight-edge]").forEach((edge) => {
    const involved = preset.edges.includes(edge.dataset.insightEdge);
    edge.classList.toggle("is-focused", focused && involved);
    edge.classList.toggle("is-context", focused && !involved);
  });

  root.querySelectorAll("[data-insight-zone]").forEach((zone) => {
    const involved = preset.zones.includes(zone.dataset.insightZone);
    zone.classList.toggle("is-focused", focused && involved);
    zone.classList.toggle("is-context", focused && !involved);
  });

  root.querySelectorAll("[data-insight-preset]").forEach((control) => {
    const selected = control.dataset.insightPreset === key;
    control.classList.toggle("is-active", selected);
    control.setAttribute("aria-pressed", String(selected));
  });

  root.querySelectorAll("[data-insight-select]").forEach((control) => {
    const selected = focused && control.dataset.insightSelect === key;
    control.classList.toggle("is-active", selected);
    control.setAttribute("aria-pressed", String(selected));
  });

  const label = root.querySelector("[data-insight-info-label]");
  const title = root.querySelector("[data-insight-info-title]");
  const copy = root.querySelector("[data-insight-info-copy]");
  const boundary = root.querySelector("[data-insight-info-boundary]");
  if (label) label.textContent = preset.label;
  if (title) title.textContent = preset.title;
  if (copy) copy.textContent = preset.copy;
  if (boundary) boundary.textContent = preset.boundary;
}

function bindCoreInsights() {
  const root = elements.insightModel;
  if (!root) return;

  root.querySelectorAll("[data-insight-preset], [data-insight-select]").forEach((control) => {
    control.addEventListener("click", () => {
      selectCoreInsight(
        control.dataset.insightPreset ?? control.dataset.insightSelect
      );
    });
  });

  selectCoreInsight("all");
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
  loaded.ecosystems = loaded.ecosystems.items;
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
  loaded.ecosystemByPrototypeId = new Map(
    loaded.ecosystems.map((item) => [item.prototype_id, item])
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
  const availablePrototypes = state.data.prototypes
    .filter((prototype) => (
      !state.librarySlotMotherOnly
      || prototype.primary_mother_id === "mechanism.slot"
    ))
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, "zh-CN"));
  const selectedPrototype = state.data.prototypeById.get(state.libraryPrototypeFilter);
  if (
    state.libraryPrototypeFilter !== "all"
    && !availablePrototypes.some((prototype) => prototype.id === state.libraryPrototypeFilter)
  ) {
    state.libraryPrototypeFilter = "all";
  }
  elements.prototypeFilter.innerHTML = `
    <option value="all">全部品类原型</option>
    ${availablePrototypes.map((prototype) => `
      <option value="${escapeHtml(prototype.id)}">${escapeHtml(prototype.name)}</option>
    `).join("")}
  `;
  elements.prototypeFilter.value = state.libraryPrototypeFilter;

  const slotMotherProductCount = state.data.products.filter((product) =>
    product.mother_ids?.includes("mechanism.slot")
  ).length;
  const prototypeProductCount = state.libraryPrototypeFilter === "all"
    ? 0
    : state.data.products.filter((product) =>
      product.prototype_ids?.includes(state.libraryPrototypeFilter)
    ).length;
  const products = state.data.products
    .filter((product) => {
      if (
        state.librarySlotMotherOnly
        && !product.mother_ids?.includes("mechanism.slot")
      ) {
        return false;
      }
      if (
        state.libraryPrototypeFilter !== "all"
        && !product.prototype_ids?.includes(state.libraryPrototypeFilter)
      ) {
        return false;
      }
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

  elements.motherFilter.classList.toggle("is-active", state.librarySlotMotherOnly);
  elements.motherFilter.setAttribute("aria-pressed", String(state.librarySlotMotherOnly));
  elements.motherFilter.setAttribute(
    "aria-label",
    state.librarySlotMotherOnly
      ? "取消 Slot 母体筛选，显示全部游戏"
      : "筛选 Slot 母体所属游戏"
  );
  elements.motherFilter.querySelector(".product-mother-filter-state").textContent =
    state.librarySlotMotherOnly ? "✓" : "+";

  elements.productResultSummary.innerHTML = `
    <strong>${products.length}</strong>
    <span> / ${state.data.products.length} 款正式游戏</span>
    <small>
      ${state.librarySlotMotherOnly ? `Slot 母体共 ${slotMotherProductCount} 款；` : "当前显示全部母体；"}
      ${state.libraryPrototypeFilter !== "all"
        ? `${escapeHtml(selectedPrototype?.name ?? "所选品类原型")}共 ${prototypeProductCount} 款；`
        : "全部品类原型；"}
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

  const mechanical = observation.mapping_status === "mechanical_import_unconfirmed";
  return `
    <section class="product-detail-section">
      <div class="product-detail-section-head">
        <div>
          <p class="eyebrow">${mechanical ? "LEGACY → FORMULA" : "PRODUCT → FORMULA"}</p>
          <h4>${mechanical ? "旧版资料映射到体验公式" : "产品工作定义映射到体验公式"}</h4>
        </div>
        <span class="review-badge ${mechanical ? "draft" : "pending"}">
          ${mechanical ? "机械迁移 · 待确认" : "工作定义 · 待确认"}
        </span>
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
              <small>${mechanical ? "旧版来源" : "当前依据"}：${entry.source_fields.map(escapeHtml).join(" · ")}</small>
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
        <div class="product-detail-badges">
          <span class="review-badge ${classificationStatus.className}">${escapeHtml(classificationStatus.label)}</span>
          <button type="button" class="button button-secondary"
            data-edit-product-classification="${escapeHtml(product.id)}">
            查看／修改归属
          </button>
        </div>
      </div>
      <div class="product-detail-path">
        ${classification.path.map((part, index) => `
          ${index ? '<span aria-hidden="true">→</span>' : ""}
          <strong>${escapeHtml(part)}</strong>
        `).join("")}
      </div>
      <p>${escapeHtml(product.classification_note || "当前分类关系已经记录。")}</p>
    </section>

    ${observation?.legacy_summary || observation?.legacy_scores ? `
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
              <strong>${escapeHtml(observation.legacy_scores?.[key] ?? "—")}</strong>
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

  elements.productDetailContent
    .querySelector("[data-edit-product-classification]")
    ?.addEventListener("click", () => {
      openClassificationEditor(product.id);
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

function roleForProduct(product) {
  if (product.relation_types.includes("source") && product.relation_types.includes("representative")) {
    return "cornerstone";
  }
  return "variant_instance";
}

function updateClassificationPrototypePreview() {
  const prototypeId = elements.classificationEditorPrototype.value;
  const prototype = state.data.prototypeById.get(prototypeId);
  const mechanism = prototype
    ? state.data.mechanismById.get(prototype.primary_mother_id)
    : null;

  elements.classificationEditorMechanism.textContent = mechanism
    ? `${mechanism.name} → ${prototype.name} → 当前游戏（系统自动建立品类变体）`
    : "未选择品类原型；保存后会清除模型归属";
  elements.classificationEditorRole.disabled = !prototype;
}

function openClassificationEditor(productId, preferredPrototypeId = "") {
  const product = state.data.productById.get(productId);
  if (!product) return;
  state.editingProductId = productId;
  closeProductDetail();

  elements.classificationEditorTitle.textContent = `设置《${product.name}》的品类归属`;
  elements.classificationEditorPrototype.innerHTML = `
    <option value="">暂不归类／清除归属</option>
    ${state.data.mechanisms.flatMap((mechanism) => {
      const options = prototypesFor(mechanism.id).map((prototype) => `
        <option value="${escapeHtml(prototype.id)}">
          ${escapeHtml(mechanism.name)} → ${escapeHtml(prototype.name)}
        </option>
      `).join("");
      return options
        ? `<optgroup label="${escapeHtml(mechanism.name)}">${options}</optgroup>`
        : "";
    }).join("")}
  `;
  elements.classificationEditorPrototype.value =
    preferredPrototypeId || product.prototype_ids[0] || "";
  elements.classificationEditorRole.value = roleForProduct(product);
  updateClassificationPrototypePreview();
  elements.classificationEditorStatus.value = product.classification_status ?? "unreviewed";
  elements.classificationEditorNote.value = product.classification_note ?? "";
  elements.classificationEditorMessage.textContent = state.dataServiceOnline
    ? "机制母型会由品类原型自动推导，避免出现不一致路径。"
    : "当前为只读模式；请通过本地数据服务打开后再保存。";
  elements.classificationEditorMessage.className =
    `field-editor-message ${state.dataServiceOnline ? "" : "warning"}`;
  elements.classificationEditorSave.disabled = !state.dataServiceOnline;

  if (typeof elements.classificationEditor.showModal === "function") {
    elements.classificationEditor.showModal();
  } else {
    elements.classificationEditor.setAttribute("open", "");
  }
}

function closeClassificationEditor() {
  state.editingProductId = null;
  if (typeof elements.classificationEditor.close === "function") {
    elements.classificationEditor.close();
  } else {
    elements.classificationEditor.removeAttribute("open");
  }
}

async function saveProductClassification() {
  if (!state.dataServiceOnline || !state.editingProductId) return;
  const payload = {
    product_id: state.editingProductId,
    prototype_id: elements.classificationEditorPrototype.value,
    relation_role: elements.classificationEditorRole.value,
    classification_status: elements.classificationEditorStatus.value,
    note: elements.classificationEditorNote.value.trim()
  };

  if (!payload.prototype_id) payload.relation_role = "member";
  elements.classificationEditorSave.disabled = true;
  elements.classificationEditorMessage.textContent = "正在保存分类并重算图谱关系…";
  elements.classificationEditorMessage.className = "field-editor-message";

  try {
    const response = await fetch("./api/update-product-classification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.error ?? "分类保存失败");
    const productName = state.data.productById.get(payload.product_id)?.name ?? "游戏";
    await refreshDataFromFiles();
    closeClassificationEditor();
    showDataToast(`${productName}的品类归属已保存`);
  } catch (error) {
    elements.classificationEditorMessage.textContent = error.message;
    elements.classificationEditorMessage.className = "field-editor-message error";
  } finally {
    elements.classificationEditorSave.disabled = !state.dataServiceOnline;
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

function matrixInheritanceTreeMarkup(node) {
  if (node.type !== "category_variant") {
    const parent = parentNode(node);
    return `<small>${parent ? `继承自 ${escapeHtml(parent.name)}` : "体验公式下的第一层"}</small>`;
  }

  const path = inheritancePath(node);
  return `
    <div class="matrix-inheritance-tree"
      aria-label="${escapeHtml(path.map((item) => item.name).join(" 到 "))}">
      <small class="matrix-tree-title">完整继承树</small>
      ${path.map((item, index) => `
        ${index ? '<span class="matrix-tree-edge" aria-hidden="true"></span>' : ""}
        <span class="matrix-tree-node layer-${escapeHtml(item.type)} ${item.id === node.id ? "is-current" : ""}">
          <i aria-hidden="true"></i>
          <span>
            <small>${escapeHtml(TYPE_LABELS[item.type])}</small>
            <strong>${escapeHtml(item.name)}</strong>
          </span>
          ${item.id === node.id ? "<em>当前</em>" : ""}
        </span>
      `).join("")}
    </div>
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
        return `
          <tr>
            <th scope="row" class="matrix-node-column">
              <span class="node-type-label">${escapeHtml(TYPE_LABELS[node.type])}</span>
              <strong>${escapeHtml(node.name)}</strong>
              ${matrixInheritanceTreeMarkup(node)}
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

function ecosystemProducts(prototypeId) {
  return state.data.products
    .filter((product) => product.prototype_ids.includes(prototypeId))
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, "zh-CN"));
}

function ecosystemPosition(config, productId) {
  return config?.positions?.find((item) => item.product_id === productId) ?? null;
}

function ecosystemProductIcon(product) {
  const imageUrl = product?.header_image_url;
  const fallback = (product?.name ?? "?").replace(/[《》\s]/g, "").slice(0, 2);
  return `
    <span class="ecosystem-product-icon ${imageUrl ? "has-image" : ""}" aria-hidden="true">
      <span>${escapeHtml(fallback)}</span>
      ${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : ""}
    </span>
  `;
}

function ecosystemPositionStatus(position) {
  if (!position) return { label: "待定位", className: "pending" };
  if (position.status === "confirmed") return { label: "已确认", className: "confirmed" };
  return { label: "暂定位置", className: "draft" };
}

function ecosystemFieldState(config, product, field) {
  const position = ecosystemPosition(config, product.id);
  if (product.id === config.cornerstone_product_id) {
    return { label: "基准", className: "baseline" };
  }
  if (!position) return { label: "待定位", className: "pending" };
  if ((position.changed_fields ?? []).includes(field)) {
    return { label: "变化", className: "changed" };
  }
  return { label: "同基石", className: "inherited" };
}

function ecosystemFieldComparison(config, selectedProduct, field) {
  const cornerstone = state.data.productById.get(config.cornerstone_product_id);
  const cornerstoneObservation = state.data.productObservationById.get(cornerstone?.id);
  const selectedObservation = state.data.productObservationById.get(selectedProduct?.id);
  const fieldState = ecosystemFieldState(config, selectedProduct, field);
  return {
    field,
    state: fieldState,
    before: cornerstoneObservation?.fields?.[field]?.value
      ?? rawFingerprint(state.data.prototypeById.get(config.prototype_id))?.[field]?.constraint_label
      ?? "基石定义待补",
    after: selectedObservation?.fields?.[field]?.value ?? "产品字段待补充",
    reviewStatus: selectedObservation?.fields?.[field]?.review_status ?? "draft"
  };
}

function selectEcosystemProduct(productId, field = null) {
  if (!state.data.productById.has(productId)) return;
  state.selectedEcosystemProductId = productId;
  state.selectedEcosystemField = field && FORMULA_FIELDS.includes(field) ? field : null;
  renderEcosystemWorkbench();
}

function renderEcosystemPrototypeList() {
  const selectedExists = state.data.prototypeById.has(state.selectedEcosystemPrototypeId);
  if (!selectedExists) {
    state.selectedEcosystemPrototypeId = state.data.prototypes[0]?.id ?? null;
  }

  elements.ecosystemPrototypeList.innerHTML = state.data.prototypes
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((prototype) => {
      const products = ecosystemProducts(prototype.id);
      const config = state.data.ecosystemByPrototypeId.get(prototype.id);
      const active = prototype.id === state.selectedEcosystemPrototypeId;
      const positionedCount = products.filter((product) => ecosystemPosition(config, product.id)).length;
      const confirmedCount = products.filter(
        (product) => ecosystemPosition(config, product.id)?.status === "confirmed"
      ).length;
      const cornerstone = state.data.productById.get(config?.cornerstone_product_id);
      return `
        <button type="button"
          class="ecosystem-prototype-button ${active ? "is-active" : ""}"
          data-ecosystem-prototype="${escapeHtml(prototype.id)}"
          aria-pressed="${active}">
          <strong>${escapeHtml(prototype.name)}</strong>
          <span class="ecosystem-prototype-cornerstone">
            基石 · ${escapeHtml(cornerstone?.name ?? "待确认")}
          </span>
          <span>${products.length} 款产品 · ${positionedCount} 款已定位 · ${confirmedCount} 款已确认</span>
          <i><b style="--progress:${products.length ? positionedCount / products.length : 0}"></b></i>
        </button>
      `;
    }).join("");

  elements.ecosystemPrototypeList
    .querySelectorAll("[data-ecosystem-prototype]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        state.selectedEcosystemPrototypeId = button.dataset.ecosystemPrototype;
        const config = state.data.ecosystemByPrototypeId.get(state.selectedEcosystemPrototypeId);
        state.selectedEcosystemProductId = config?.cornerstone_product_id
          ?? ecosystemProducts(state.selectedEcosystemPrototypeId)[0]?.id
          ?? null;
        state.selectedEcosystemField = null;
        renderEcosystem();
      });
    });
}

function ecosystemDeltaCards(config, selectedProduct, focusedField = null) {
  const cornerstone = state.data.productById.get(config.cornerstone_product_id);
  const position = ecosystemPosition(config, selectedProduct.id);
  const changedFields = position?.changed_fields ?? [];
  const fields = focusedField
    ? [focusedField]
    : changedFields;

  if (selectedProduct.id === cornerstone?.id && !focusedField) {
    return `
      <div class="ecosystem-delta-empty">
        这是品类基石产品。点击上方公式字段，可以查看它作为比较基准的完整定义。
      </div>
    `;
  }
  if (!fields.length) {
    return `
      <div class="ecosystem-delta-empty">
        这款产品已经归入本品类，但尚未人工确认相对基石修改的公式字段。
      </div>
    `;
  }
  return fields.map((field) => {
    const comparison = ecosystemFieldComparison(config, selectedProduct, field);
    return `
      <article class="ecosystem-delta-card is-${escapeHtml(comparison.state.className)}">
        <code>${escapeHtml(formulaDisplayKey(field))}</code>
        <strong>
          ${escapeHtml(FIELD_LABELS[field])}
          <span>${escapeHtml(comparison.state.label)}</span>
        </strong>
        <small><b>基石</b>${escapeHtml(comparison.before)}</small>
        <small><b>当前</b>${escapeHtml(comparison.after)}</small>
        <em class="ecosystem-review-status ${escapeHtml(comparison.reviewStatus)}">
          ${escapeHtml(REVIEW_STATUS_LABELS[comparison.reviewStatus] ?? "草稿")}
        </em>
      </article>
    `;
  }).join("");
}

function ecosystemBasisMarkup(config, prototype, mechanism, cornerstone) {
  const basis = config.analysis_basis ?? {};
  const differentiationFields = basis.differentiation_fields ?? [];
  return `
    <section class="ecosystem-baseline" aria-labelledby="ecosystem-baseline-title">
      <div class="ecosystem-panel-head">
        <div>
          <span class="ecosystem-kicker">02 · 品类分析基准</span>
          <h3 id="ecosystem-baseline-title">先说明比较什么，再进入二维坐标</h3>
        </div>
        <span class="ecosystem-baseline-path">
          ${escapeHtml(mechanism?.name ?? "机制母型")} → ${escapeHtml(prototype.name)}
        </span>
      </div>
      <div class="ecosystem-basis-grid">
        <article>
          <small>继承边界</small>
          <strong>品类共同保留什么</strong>
          <p>${escapeHtml(basis.inheritance_summary ?? prototype.summary)}</p>
        </article>
        <article class="is-cornerstone">
          <small>比较基准</small>
          <strong>${escapeHtml(cornerstone?.name ?? "基石待确认")}</strong>
          <p>${escapeHtml(basis.cornerstone_role ?? "基石产品负责提供公式比较基准。")}</p>
        </article>
        <article>
          <small>主要分化字段</small>
          <strong>${differentiationFields.map((field) => escapeHtml(formulaDisplayKey(field))).join(" · ") || "待确认"}</strong>
          <p>横向表格优先强调这些字段，但仍保留完整九字段作为共同底座。</p>
        </article>
        <article>
          <small>坐标推导</small>
          <strong>${escapeHtml(config.axes.x.label)} × ${escapeHtml(config.axes.y.label)}</strong>
          <p>${escapeHtml(basis.axis_rationale ?? "坐标轴来自最能区分品类成员的公式变化。")}</p>
        </article>
      </div>
      <div class="ecosystem-axis-definitions">
        <div>
          <span>横轴</span>
          <strong>${escapeHtml(config.axes.x.label)}</strong>
          <small>${escapeHtml(config.axes.x.low)} → ${escapeHtml(config.axes.x.high)}</small>
          <code>${config.axes.x.source_fields.map((field) => escapeHtml(formulaDisplayKey(field))).join(" · ")}</code>
        </div>
        <div>
          <span>纵轴</span>
          <strong>${escapeHtml(config.axes.y.label)}</strong>
          <small>${escapeHtml(config.axes.y.low)} → ${escapeHtml(config.axes.y.high)}</small>
          <code>${config.axes.y.source_fields.map((field) => escapeHtml(formulaDisplayKey(field))).join(" · ")}</code>
        </div>
      </div>
    </section>
  `;
}

function ecosystemMatrixMarkup(config, products) {
  return `
    <section class="ecosystem-comparison" aria-labelledby="ecosystem-comparison-title">
      <div class="ecosystem-panel-head">
        <div>
          <span class="ecosystem-kicker">03 · 横向公式差异表</span>
          <h3 id="ecosystem-comparison-title">只强调相对基石发生变化的字段</h3>
        </div>
        <p>点击游戏或字段，地图和右侧解释同步聚焦</p>
      </div>
      <div class="ecosystem-matrix-legend" aria-label="公式差异图例">
        <span class="baseline">基准</span>
        <span class="changed">相对基石变化</span>
        <span class="inherited">同基石</span>
        <span class="pending">待定位</span>
      </div>
      <div class="ecosystem-matrix-scroll">
        <table class="ecosystem-matrix">
          <thead>
            <tr>
              <th>具体游戏</th>
              ${FORMULA_FIELDS.map((field) => `
                <th><code>${escapeHtml(formulaDisplayKey(field))}</code><small>${escapeHtml(FIELD_LABELS[field])}</small></th>
              `).join("")}
            </tr>
          </thead>
          <tbody>
            ${products.map((product) => {
              const active = product.id === state.selectedEcosystemProductId;
              const position = ecosystemPosition(config, product.id);
              const status = ecosystemPositionStatus(position);
              return `
                <tr class="${active ? "is-active" : ""}">
                  <th>
                    <button type="button" class="ecosystem-matrix-product"
                      data-ecosystem-product="${escapeHtml(product.id)}"
                      aria-pressed="${active}">
                      ${ecosystemProductIcon(product)}
                      <span>
                        <strong>${escapeHtml(product.name)}</strong>
                        <small class="${escapeHtml(status.className)}">
                          ${position?.role === "cornerstone" ? "基石 · " : ""}${escapeHtml(status.label)}
                        </small>
                      </span>
                    </button>
                  </th>
                  ${FORMULA_FIELDS.map((field) => {
                    const fieldState = ecosystemFieldState(config, product, field);
                    const fieldActive = active && state.selectedEcosystemField === field;
                    return `
                      <td>
                        <button type="button"
                          class="ecosystem-matrix-cell is-${escapeHtml(fieldState.className)} ${fieldActive ? "is-active" : ""}"
                          data-ecosystem-product="${escapeHtml(product.id)}"
                          data-ecosystem-field="${escapeHtml(field)}"
                          aria-pressed="${fieldActive}">
                          <span>${escapeHtml(fieldState.label)}</span>
                        </button>
                      </td>
                    `;
                  }).join("")}
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function ecosystemInnovationsMarkup(config) {
  const innovations = config.innovations ?? [];
  if (!innovations.length) return "";
  return `
    <section class="ecosystem-innovations" aria-labelledby="ecosystem-innovations-title">
      <div class="ecosystem-panel-head">
        <div>
          <span class="ecosystem-kicker">06 · 值得关注的变体创新</span>
          <h3 id="ecosystem-innovations-title">记录具体产品改了什么，以及为什么值得继续观察</h3>
        </div>
        <p>点击创新卡，产品详情与公式字段同步聚焦</p>
      </div>
      <div class="ecosystem-innovation-list">
        ${innovations.map((innovation) => {
          const product = state.data.productById.get(innovation.product_id);
          const active = innovation.product_id === state.selectedEcosystemProductId
            && innovation.primary_field === state.selectedEcosystemField;
          return `
            <button type="button"
              class="ecosystem-innovation-card ${active ? "is-active" : ""}"
              data-ecosystem-product="${escapeHtml(innovation.product_id)}"
              data-ecosystem-field="${escapeHtml(innovation.primary_field)}"
              aria-pressed="${active}">
              <span class="ecosystem-innovation-head">
                ${ecosystemProductIcon(product)}
                <span>
                  <small>${escapeHtml(product?.name ?? "未知产品")} · ${escapeHtml(formulaDisplayKey(innovation.primary_field))}</small>
                  <strong>${escapeHtml(innovation.title)}</strong>
                </span>
                <em>${innovation.status === "worth_following" ? "值得关注" : "观察中"}</em>
              </span>
              <span class="ecosystem-innovation-flow">
                <span><b>常规流程</b><code>${escapeHtml(innovation.baseline_flow)}</code></span>
                <i aria-hidden="true">→</i>
                <span><b>创新流程</b><code>${escapeHtml(innovation.variant_flow)}</code></span>
              </span>
              <span class="ecosystem-innovation-summary">${escapeHtml(innovation.summary)}</span>
              <span class="ecosystem-innovation-evaluation">
                <span><b>体验价值</b>${escapeHtml(innovation.experience_value)}</span>
                <span><b>设计风险</b>${escapeHtml(innovation.design_risk)}</span>
                <span><b>待验证</b>${escapeHtml(innovation.validation_question)}</span>
              </span>
            </button>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function ecosystemOpportunitiesMarkup(config) {
  const niches = config.niches ?? [];
  return `
    <section class="ecosystem-opportunities">
      <div class="ecosystem-panel-head">
        <div>
          <span class="ecosystem-kicker">07 · 生态位假设</span>
          <h3>空白不是结论，需要写明机制假设与验证风险</h3>
        </div>
        <p>这里只记录人工提出的设计假设，不把地图空白自动视为机会。</p>
      </div>
      <div class="ecosystem-niche-list">
        ${niches.length ? niches.map((niche) => `
          <article>
            <span>${escapeHtml(niche.status === "sparse" ? "稀疏区域" : "待验证假设")}</span>
            <strong>${escapeHtml(niche.label)}</strong>
            <p>${escapeHtml(niche.hypothesis)}</p>
          </article>
        `).join("") : `
          <div class="ecosystem-delta-empty">本品类尚未提出经过描述的生态位假设。</div>
        `}
      </div>
    </section>
  `;
}

function renderEcosystemWorkbench() {
  const prototype = state.data.prototypeById.get(state.selectedEcosystemPrototypeId);
  if (!prototype) {
    elements.ecosystemWorkbench.innerHTML = '<div class="library-empty">暂无品类原型。</div>';
    return;
  }
  const products = ecosystemProducts(prototype.id);
  const config = state.data.ecosystemByPrototypeId.get(prototype.id);
  if (!products.some((product) => product.id === state.selectedEcosystemProductId)) {
    state.selectedEcosystemProductId = config?.cornerstone_product_id ?? products[0]?.id ?? null;
    state.selectedEcosystemField = null;
  }
  const selectedProduct = state.data.productById.get(state.selectedEcosystemProductId);
  const mechanism = state.data.mechanismById.get(prototype.primary_mother_id);

  if (!config) {
    elements.ecosystemWorkbench.innerHTML = `
      <div class="ecosystem-summary">
        <div>
          <span class="ecosystem-kicker">02 · ${escapeHtml(prototype.name)}</span>
          <h2>产品目录已可比较，二维轴尚未人工定义</h2>
          <p>${escapeHtml(prototype.summary)}</p>
        </div>
        <div class="ecosystem-summary-stat"><strong>${products.length}</strong><span>已归类产品</span></div>
      </div>
      <div class="ecosystem-body">
        <section class="ecosystem-panel">
          <div class="ecosystem-panel-head"><div><span class="ecosystem-kicker">PRODUCTS</span><h3>当前成员</h3></div></div>
          <div class="ecosystem-product-list">
            ${products.length
              ? products.map((product) => `<button type="button" class="ecosystem-product-button">${escapeHtml(product.name)}</button>`).join("")
              : "尚无产品；可在游戏库详情中设置归属。"}
          </div>
        </section>
        <aside class="ecosystem-panel ecosystem-detail">
          <span class="ecosystem-kicker">NEXT</span>
          <h3>先确认基石与两个坐标轴</h3>
          <p>轴必须来自能够区分产品的公式变化；不为了画图强行选择无解释力的指标。</p>
        </aside>
      </div>
    `;
    return;
  }

  const positionedProducts = config.positions
    .map((position) => ({
      position,
      product: state.data.productById.get(position.product_id)
    }))
    .filter((item) => item.product && item.product.prototype_ids.includes(prototype.id));
  const unpositioned = products.filter(
    (product) => !config.positions.some((position) => position.product_id === product.id)
  );
  const selectedPosition = selectedProduct ? ecosystemPosition(config, selectedProduct.id) : null;
  const positionStatus = ecosystemPositionStatus(selectedPosition);
  const cornerstone = state.data.productById.get(config.cornerstone_product_id);

  elements.ecosystemWorkbench.innerHTML = `
    <div class="ecosystem-summary">
      <div>
        <span class="ecosystem-kicker">当前品类比较空间</span>
        <h2>${escapeHtml(mechanism?.name ?? "机制母型")} → ${escapeHtml(prototype.name)}</h2>
        <p>${escapeHtml(config.summary)}</p>
      </div>
      <div class="ecosystem-summary-stat">
        <strong>${products.length}</strong>
        <span>已归类产品 · ${positionedProducts.length} 款已定位 · ${positionedProducts.filter((item) => item.position.status === "confirmed").length} 款已确认</span>
      </div>
    </div>
    ${ecosystemBasisMarkup(config, prototype, mechanism, cornerstone)}
    ${ecosystemMatrixMarkup(config, products)}
    <div class="ecosystem-body">
      <section class="ecosystem-panel">
        <div class="ecosystem-panel-head">
          <div>
            <span class="ecosystem-kicker">04 · ECOSYSTEM MAP</span>
            <h3>产品定位与潜在生态位</h3>
          </div>
          <p>选择只改变焦点，不隐藏完整品类地图</p>
        </div>
        <div class="ecosystem-product-list">
          ${products.map((product) => `
            <button type="button"
              class="ecosystem-product-button ${product.id === state.selectedEcosystemProductId ? "is-active" : ""}"
              data-ecosystem-product="${escapeHtml(product.id)}"
              aria-pressed="${product.id === state.selectedEcosystemProductId}">
              ${ecosystemProductIcon(product)}
              <span>${escapeHtml(product.name)}</span>
            </button>
          `).join("")}
        </div>
        <div class="ecosystem-plot ${state.selectedEcosystemProductId ? "has-selection" : ""}"
          aria-label="${escapeHtml(prototype.name)}产品二维定位图">
          <div class="ecosystem-axis x">
            <b>${escapeHtml(config.axes.x.label)}</b>
            <span><i>${escapeHtml(config.axes.x.low)}</i><i>${escapeHtml(config.axes.x.high)}</i></span>
          </div>
          <div class="ecosystem-axis y">
            <b>${escapeHtml(config.axes.y.label)}</b>
            <span><i>${escapeHtml(config.axes.y.high)}</i><i>${escapeHtml(config.axes.y.low)}</i></span>
          </div>
          ${config.niches.map((niche) => `
            <span class="ecosystem-niche" style="--x:${niche.x};--y:${niche.y}"
              title="${escapeHtml(niche.hypothesis)}">${escapeHtml(niche.label)}</span>
          `).join("")}
          ${positionedProducts.map(({ product, position }) => `
            <button type="button"
              class="ecosystem-dot ${position.role === "cornerstone" ? "is-cornerstone" : ""} ${position.status === "confirmed" ? "is-confirmed" : "is-draft"} ${product.id === state.selectedEcosystemProductId ? "is-active" : ""}"
              style="--x:${position.x};--y:${position.y}"
              data-ecosystem-product="${escapeHtml(product.id)}"
              aria-pressed="${product.id === state.selectedEcosystemProductId}">
              ${ecosystemProductIcon(product)}
              <span>${escapeHtml(product.name)}</span>
            </button>
          `).join("")}
        </div>
        ${unpositioned.length ? `
          <p class="ecosystem-unpositioned">
            <strong>已归类、待定位：</strong>
            ${unpositioned.map((product) => escapeHtml(product.name)).join(" · ")}
          </p>
        ` : ""}
      </section>
      <aside class="ecosystem-panel ecosystem-detail">
        <span class="ecosystem-kicker">05 · 产品定位详情</span>
        <div class="ecosystem-detail-title">
          ${selectedProduct ? ecosystemProductIcon(selectedProduct) : ""}
          <div>
            <h3>${escapeHtml(selectedProduct?.name ?? "请选择产品")}</h3>
            <span class="ecosystem-position-status ${escapeHtml(positionStatus.className)}">
              ${escapeHtml(positionStatus.label)}
            </span>
          </div>
        </div>
        <p class="ecosystem-detail-path">
          ${escapeHtml(mechanism?.name ?? "机制母型")} → ${escapeHtml(prototype.name)} → ${escapeHtml(selectedProduct?.name ?? "请选择产品")}
        </p>
        ${selectedPosition
          ? `<p class="ecosystem-position-note">${escapeHtml(selectedPosition.position_note)}</p>`
          : '<p class="ecosystem-position-note">这款产品已完成品类归属，但二维位置和变化字段仍等待人工确认。</p>'}
        ${state.selectedEcosystemField ? `
          <button type="button" class="ecosystem-clear-field" data-ecosystem-clear-field>
            当前聚焦 ${escapeHtml(formulaDisplayKey(state.selectedEcosystemField))} · 查看全部变化 ×
          </button>
        ` : ""}
        <div class="ecosystem-delta-grid">
          ${selectedProduct ? ecosystemDeltaCards(config, selectedProduct, state.selectedEcosystemField) : ""}
        </div>
        ${selectedProduct ? `
          <button type="button" class="button button-secondary"
            data-ecosystem-open-product="${escapeHtml(selectedProduct.id)}">
            打开游戏资料与归属编辑
          </button>
        ` : ""}
      </aside>
    </div>
    ${ecosystemInnovationsMarkup(config)}
    ${ecosystemOpportunitiesMarkup(config)}
  `;

  elements.ecosystemWorkbench.querySelectorAll("[data-ecosystem-product]").forEach((button) => {
    button.addEventListener("click", () => {
      selectEcosystemProduct(
        button.dataset.ecosystemProduct,
        button.dataset.ecosystemField ?? null
      );
    });
  });
  elements.ecosystemWorkbench.querySelector("[data-ecosystem-clear-field]")?.addEventListener("click", () => {
    state.selectedEcosystemField = null;
    renderEcosystemWorkbench();
  });
  elements.ecosystemWorkbench.querySelector("[data-ecosystem-open-product]")?.addEventListener("click", (event) => {
    openProductDetail(event.currentTarget.dataset.ecosystemOpenProduct);
  });
}

function renderEcosystem() {
  renderEcosystemPrototypeList();
  renderEcosystemWorkbench();
}

function renderGraphManager() {
  elements.graphManager.innerHTML = state.data.mechanisms
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((mechanism) => {
      const prototypes = prototypesFor(mechanism.id);
      return `
        <section class="graph-manager-branch">
          <div class="graph-manager-node-head">
            <div>
              <small>${escapeHtml(TYPE_LABELS[mechanism.type])}</small>
              <h4>${escapeHtml(mechanism.name)}</h4>
            </div>
            <div class="graph-manager-actions">
              <button type="button" class="button button-secondary"
                data-edit-graph-node="${escapeHtml(mechanism.id)}">
                编辑母型
              </button>
              <button type="button" class="button button-secondary"
                data-create-node="category_prototype"
                data-parent-node="${escapeHtml(mechanism.id)}">
                + 新建品类原型
              </button>
            </div>
          </div>
          <div class="graph-manager-prototypes">
            ${prototypes.length ? prototypes.map((prototype) => {
              const variants = variantsFor(prototype.id);
              return `
                <article class="graph-manager-prototype">
                  <div class="graph-manager-child-head">
                    <div>
                      <small>${escapeHtml(TYPE_LABELS[prototype.type])}</small>
                      <strong>${escapeHtml(prototype.name)}</strong>
                    </div>
                    <div class="graph-manager-actions">
                      <button type="button" class="button button-secondary"
                        data-edit-graph-node="${escapeHtml(prototype.id)}">
                        编辑品类原型
                      </button>
                      <button type="button" class="button button-secondary"
                        data-configure-product="${escapeHtml(prototype.id)}">
                        + 配置游戏归属
                      </button>
                    </div>
                  </div>
                  <div class="graph-manager-variants">
                    ${variants.length
                      ? variants.map((variant) => {
                          const product = productsFor(variant)[0];
                          return `
                            <button type="button"
                              class="${variant.variant_role === "cornerstone" ? "is-cornerstone" : "is-variant"}"
                              data-edit-product-classification="${escapeHtml(product?.id ?? "")}"
                              ${product ? "" : "disabled"}>
                              <span>${escapeHtml(variant.name)}</span>
                              <small>${variant.variant_role === "cornerstone" ? "基石游戏" : "变体游戏"}</small>
                            </button>
                          `;
                        }).join("")
                      : "<span>暂无归属游戏</span>"}
                  </div>
                </article>
              `;
            }).join("") : '<div class="library-empty">这个机制母型还没有品类原型。</div>'}
          </div>
        </section>
      `;
    }).join("");

  elements.graphManager.querySelectorAll("[data-create-node]").forEach((button) => {
    button.addEventListener("click", () => {
      openNodeCreator(button.dataset.createNode, button.dataset.parentNode ?? "");
    });
  });
  elements.graphManager.querySelectorAll("[data-edit-graph-node]").forEach((button) => {
    button.addEventListener("click", () => {
      openNodeEditor(button.dataset.editGraphNode);
    });
  });
  elements.graphManager.querySelectorAll("[data-configure-product]").forEach((button) => {
    button.addEventListener("click", () => {
      openProductAssignment(button.dataset.configureProduct);
    });
  });
  elements.graphManager.querySelectorAll("[data-edit-product-classification]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.editProductClassification) {
        openClassificationEditor(button.dataset.editProductClassification);
      }
    });
  });
}

function availableAssignmentProducts() {
  return state.data.products
    .slice()
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, "zh-CN"));
}

function renderNodeCreatorProductOptions(prototypeId) {
  const products = availableAssignmentProducts();
  elements.nodeCreatorProduct.innerHTML = products.length
    ? products.map((product) => `
        <option value="${escapeHtml(product.id)}">
          ${escapeHtml(product.name)}
          ${product.prototype_ids[0]
            ? ` · 当前：${escapeHtml(state.data.prototypeById.get(product.prototype_ids[0])?.name ?? "未知原型")}`
            : " · 尚未归类"}
        </option>
      `).join("")
    : '<option value="">暂无可选游戏</option>';
  elements.nodeCreatorSave.disabled = !state.dataServiceOnline || products.length === 0;
  elements.nodeCreatorMessage.textContent = products.length
    ? `选择游戏并设置为基石或变体；系统会自动建立“${state.data.prototypeById.get(prototypeId)?.name ?? "当前原型"} → 游戏”的品类变体映射。`
    : "游戏库中暂无可配置产品。";
  elements.nodeCreatorMessage.className =
    `field-editor-message ${products.length ? "" : "warning"}`;
}

function openNodeCreator(type, preferredParentId = "") {
  const labels = {
    mechanism_archetype: "机制母型",
    category_prototype: "品类原型"
  };
  state.editingNodeId = null;
  state.creatingNodeType = type;
  elements.nodeCreatorType.value = type;
  elements.nodeCreatorTitle.textContent = `新建${labels[type] ?? "图谱节点"}`;
  elements.nodeCreatorSave.textContent = "创建并进入公式定义";
  elements.nodeCreatorDelete.hidden = true;
  elements.nodeCreatorName.value = "";
  elements.nodeCreatorSummary.value = "";
  elements.nodeCreatorDefinition.value = "";
  elements.nodeCreatorProductField.hidden = true;
  elements.nodeCreatorRoleField.hidden = true;
  elements.nodeCreatorNameField.hidden = false;
  elements.nodeCreatorSummaryField.hidden = false;
  elements.nodeCreatorDefinitionField.hidden = false;
  elements.nodeCreatorName.disabled = false;
  elements.nodeCreatorSummary.disabled = false;
  elements.nodeCreatorDefinition.disabled = false;
  elements.nodeCreatorMessage.textContent = state.dataServiceOnline
    ? "新节点会先生成九个公式字段；随后可在公式数据表中逐项定义并确认。"
    : "当前为只读模式；请通过本地数据服务打开后再创建。";
  elements.nodeCreatorMessage.className =
    `field-editor-message ${state.dataServiceOnline ? "" : "warning"}`;
  elements.nodeCreatorSave.disabled = !state.dataServiceOnline;

  if (type === "mechanism_archetype") {
    elements.nodeCreatorParentField.hidden = true;
    elements.nodeCreatorParent.innerHTML = "";
  } else {
    const parents = state.data.mechanisms;
    elements.nodeCreatorParentField.hidden = false;
    elements.nodeCreatorParentLabel.textContent = "所属机制母型";
    elements.nodeCreatorParent.innerHTML = parents.map((parent) => `
      <option value="${escapeHtml(parent.id)}">${escapeHtml(parent.name)}</option>
    `).join("");
    if (parents.some((parent) => parent.id === preferredParentId)) {
      elements.nodeCreatorParent.value = preferredParentId;
    }
  }
  if (typeof elements.nodeCreator.showModal === "function") elements.nodeCreator.showModal();
  else elements.nodeCreator.setAttribute("open", "");
}

function openNodeEditor(nodeId) {
  const node = libraryNodeById(nodeId);
  if (!node || !["mechanism_archetype", "category_prototype"].includes(node.type)) return;
  openNodeCreator(node.type, node.primary_mother_id ?? "");
  state.editingNodeId = node.id;
  elements.nodeCreatorTitle.textContent =
    `编辑${TYPE_LABELS[node.type]} · ${node.name}`;
  elements.nodeCreatorName.value = node.name;
  elements.nodeCreatorSummary.value = node.summary;
  elements.nodeCreatorDefinition.value = node.definition;
  elements.nodeCreatorSave.textContent = "保存节点";
  elements.nodeCreatorDelete.hidden = false;
  elements.nodeCreatorMessage.textContent = node.type === "category_prototype"
    ? "可以修改名称、说明与所属机制母型；更换父级后，公式字段会标记为待重新确认。"
    : "可以修改机制母型名称与工作定义；存在下级节点时不能删除。";
}

function openProductAssignment(prototypeId) {
  const prototype = state.data.prototypeById.get(prototypeId);
  if (!prototype) return;
  state.editingNodeId = null;
  state.creatingNodeType = "product_assignment";
  elements.nodeCreatorType.value = "product_assignment";
  elements.nodeCreatorTitle.textContent = `配置“${prototype.name}”的游戏归属`;
  elements.nodeCreatorSave.textContent = "保存游戏归属";
  elements.nodeCreatorDelete.hidden = true;
  elements.nodeCreatorParentField.hidden = false;
  elements.nodeCreatorParentLabel.textContent = "所属品类原型";
  elements.nodeCreatorParent.innerHTML = state.data.prototypes.map((item) => `
    <option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>
  `).join("");
  elements.nodeCreatorParent.value = prototypeId;
  elements.nodeCreatorProductField.hidden = false;
  elements.nodeCreatorRoleField.hidden = false;
  elements.nodeCreatorNameField.hidden = true;
  elements.nodeCreatorSummaryField.hidden = true;
  elements.nodeCreatorDefinitionField.hidden = true;
  elements.nodeCreatorName.disabled = true;
  elements.nodeCreatorSummary.disabled = true;
  elements.nodeCreatorDefinition.disabled = true;
  elements.nodeCreatorRole.value = "variant_instance";
  renderNodeCreatorProductOptions(prototypeId);
  if (typeof elements.nodeCreator.showModal === "function") elements.nodeCreator.showModal();
  else elements.nodeCreator.setAttribute("open", "");
}

function closeNodeCreator() {
  state.creatingNodeType = null;
  state.editingNodeId = null;
  if (typeof elements.nodeCreator.close === "function") elements.nodeCreator.close();
  else elements.nodeCreator.removeAttribute("open");
}

async function createModelNode() {
  if (!state.dataServiceOnline || !state.creatingNodeType) return;
  if (state.creatingNodeType === "product_assignment") {
    const productId = elements.nodeCreatorProduct.value;
    if (!productId) {
      elements.nodeCreatorMessage.textContent = "请先选择一款游戏库产品。";
      elements.nodeCreatorMessage.className = "field-editor-message error";
      return;
    }
    elements.nodeCreatorSave.disabled = true;
    elements.nodeCreatorMessage.textContent = "正在保存归属并同步图谱映射…";
    try {
      const response = await fetch("./api/update-product-classification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          prototype_id: elements.nodeCreatorParent.value,
          relation_role: elements.nodeCreatorRole.value,
          classification_status: "confirmed",
          note: "从图谱管理配置游戏归属。"
        })
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error ?? "游戏归属保存失败");
      const productName = state.data.productById.get(productId)?.name ?? "游戏";
      await refreshDataFromFiles();
      closeNodeCreator();
      selectLibraryView("graph");
      showDataToast(`${productName}的品类归属与变体映射已同步`);
    } catch (error) {
      elements.nodeCreatorMessage.textContent = error.message;
      elements.nodeCreatorMessage.className = "field-editor-message error";
    } finally {
      elements.nodeCreatorSave.disabled = !state.dataServiceOnline;
    }
    return;
  }

  const payload = {
    type: state.creatingNodeType,
    parent_id: elements.nodeCreatorParent.value,
    name: elements.nodeCreatorName.value.trim(),
    summary: elements.nodeCreatorSummary.value.trim(),
    definition: elements.nodeCreatorDefinition.value.trim()
  };
  if (!payload.name || !payload.summary || !payload.definition) {
    elements.nodeCreatorMessage.textContent = "名称、摘要与工作定义都不能为空。";
    elements.nodeCreatorMessage.className = "field-editor-message error";
    return;
  }
  elements.nodeCreatorSave.disabled = true;
  elements.nodeCreatorMessage.textContent = state.editingNodeId
    ? "正在保存节点与层级关系…"
    : "正在创建节点与九个公式字段…";
  elements.nodeCreatorMessage.className = "field-editor-message";
  try {
    const response = await fetch(
      state.editingNodeId ? "./api/update-node" : "./api/create-node",
      {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        ...(state.editingNodeId ? { node_id: state.editingNodeId } : {})
      })
    });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.error ?? "节点创建失败");
    await refreshDataFromFiles();
    const wasEditing = Boolean(state.editingNodeId);
    closeNodeCreator();
    if (wasEditing) {
      selectLibraryView("graph");
      showDataToast(`${result.node.name}已更新`);
    } else {
      selectLibraryView("matrix");
      openFieldEditor(result.node.id, "P_t");
      showDataToast(`${result.node.name}已创建，请继续定义公式字段`);
    }
  } catch (error) {
    elements.nodeCreatorMessage.textContent = error.message;
    elements.nodeCreatorMessage.className = "field-editor-message error";
  } finally {
    elements.nodeCreatorSave.disabled = !state.dataServiceOnline;
  }
}

async function deleteEditedNode() {
  if (!state.dataServiceOnline || !state.editingNodeId) return;
  const node = libraryNodeById(state.editingNodeId);
  if (!node) return;
  if (!window.confirm(`确定删除“${node.name}”吗？存在下级关系时系统会拒绝删除。`)) return;

  elements.nodeCreatorDelete.disabled = true;
  elements.nodeCreatorMessage.textContent = "正在检查下级关系并删除…";
  elements.nodeCreatorMessage.className = "field-editor-message";
  try {
    const response = await fetch("./api/delete-node", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ node_id: node.id })
    });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.error ?? "删除失败");
    await refreshDataFromFiles();
    closeNodeCreator();
    selectLibraryView("graph");
    showDataToast(`${node.name}已删除`);
  } catch (error) {
    elements.nodeCreatorMessage.textContent = error.message;
    elements.nodeCreatorMessage.className = "field-editor-message error";
  } finally {
    elements.nodeCreatorDelete.disabled = false;
  }
}

function renderLibrary() {
  renderLibraryStats();
  renderProductCatalog();
  renderFormulaMatrix();
  renderReviewQueue();
  renderGraphManager();
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
    Combo: "Show_State → Combo(C₁ → C₂) → Spin_Result",
    C1: "Show_State → C₁ 基础结果 → C₂／Spin_Result",
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
          ${formulaToken("C2", "C₂")}
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
              ${flowToken("Combo")}<b>(</b>${flowToken("C1", "C₁")}<b>→</b>${flowToken("C2", "C₂")}<b>)</b>
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
                <em class="show-type-example"><b>例</b>${escapeHtml(item.example)}</em>
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

function representativeProductForPrototype(prototype) {
  const representativeId = prototype.representative_product_ids?.[0];
  return representativeId
    ? state.data.productById.get(representativeId) ?? null
    : null;
}

function prototypeMatrixCard(prototype, strategy, mode, activeId) {
  if (!prototype) {
    return `
      <div class="prototype-matrix-card is-missing strategy-${escapeHtml(strategy)} mode-${escapeHtml(mode)}">
        <small>未来扩展位置</small>
        <h4>等待建立</h4>
        <p>这一格尚未建立正式品类原型。</p>
      </div>
    `;
  }

  const representative = representativeProductForPrototype(prototype);
  const inheritedFields = FORMULA_FIELDS.filter(
    (field) => prototype.formula_changes[field].operation === "inherit"
  );
  const changedFields = FORMULA_FIELDS.filter(
    (field) => prototype.formula_changes[field].operation !== "inherit"
  );
  const active = prototype.id === activeId;
  const c2 = prototype.formula_changes.C2.constraint_label;
  const pressure = prototype.formula_changes.P_t.constraint_label;

  return `
    <button
      type="button"
      class="prototype-matrix-card strategy-${escapeHtml(strategy)} mode-${escapeHtml(mode)} ${active ? "is-active" : ""}"
      data-prototype-matrix-id="${escapeHtml(prototype.id)}"
      aria-pressed="${active}"
    >
      <small>${escapeHtml(prototype.classification_axes.inheritance_label)} × ${escapeHtml(prototype.classification_axes.result_label)}</small>
      <h4>${escapeHtml(prototype.name)}</h4>
      <span class="prototype-matrix-representative">
        基石游戏 · ${escapeHtml(representative?.name ?? "待指定")}
      </span>
      <p>${escapeHtml(prototype.summary)}</p>
      <span class="prototype-matrix-delta">
        <span>
          <b>继承</b>
          <i>${inheritedFields.length
            ? inheritedFields.map(formulaDisplayKey).join(" · ")
            : "无直接继承字段"}</i>
        </span>
        <span>
          <b>变化</b>
          <i>${changedFields.map(formulaDisplayKey).join(" · ")}</i>
        </span>
        <span>
          <b>C₂／P(t)</b>
          <i>${escapeHtml(c2)}／${escapeHtml(pressure)}</i>
        </span>
      </span>
    </button>
  `;
}

function renderSlotPrototypeMatrix() {
  if (!elements.slotPrototypeMatrix || !elements.slotPrototypeMatrixInfo) return;

  const prototypes = prototypesFor("mechanism.slot");
  const byAxes = new Map(
    prototypes
      .filter((prototype) => prototype.classification_axes)
      .map((prototype) => [
        `${prototype.classification_axes.inheritance_strategy}:${prototype.classification_axes.result_mode}`,
        prototype
      ])
  );
  const activeId = state.detailLevel === "mechanism"
    ? null
    : state.selectedPrototypeId;
  const plusCombat = byAxes.get("slot_plus:combat");
  const plusNumeric = byAxes.get("slot_plus:numeric");
  const transformCombat = byAxes.get("slot_transform:combat");
  const transformNumeric = byAxes.get("slot_transform:numeric");

  elements.slotPrototypeMatrix.innerHTML = `
    <div class="prototype-matrix-grid">
      <div class="prototype-matrix-corner">
        <small>纵轴 × 横轴</small>
        <strong>继承方式 × 结果模式</strong>
      </div>
      <div class="prototype-matrix-column combat">
        <small>结果模式</small>
        <strong>战斗表现</strong>
      </div>
      <div class="prototype-matrix-column numeric">
        <small>结果模式</small>
        <strong>数值表现</strong>
      </div>

      <div class="prototype-matrix-row plus">
        <small>保留 Slot 核心</small>
        <strong>Slot+扩展</strong>
      </div>
      ${prototypeMatrixCard(plusCombat, "plus", "combat", activeId)}
      ${prototypeMatrixCard(plusNumeric, "plus", "numeric", activeId)}

      <div class="prototype-matrix-row transform">
        <small>改写 Pool 或 C₁</small>
        <strong>Slot改写</strong>
      </div>
      ${prototypeMatrixCard(transformCombat, "transform", "combat", activeId)}
      ${prototypeMatrixCard(transformNumeric, "transform", "numeric", activeId)}
    </div>
  `;

  const selected = activeId
    ? state.data.prototypeById.get(activeId)
    : null;
  const representative = selected
    ? representativeProductForPrototype(selected)
    : null;

  elements.slotPrototypeMatrixInfo.innerHTML = selected ? `
    <span>当前选择 · ${escapeHtml(selected.name)}</span>
    <p>
      基石游戏《${escapeHtml(representative?.name ?? "待指定")}》。
      ${escapeHtml(selected.formula_changes.C2.constraint_label)}负责结果演绎；
      ${escapeHtml(selected.formula_changes.P_t.constraint_label)}负责目标验证。
    </p>
    <button type="button" data-prototype-matrix-inspect="${escapeHtml(selected.id)}">
      查看逐层公式约束
    </button>
  ` : `
    <span>Slot 母体 · 四个品类原型</span>
    <p>选择任一格，比较它保留了哪些 Slot 核心，又在哪些公式字段上扩展或覆写。</p>
  `;

  elements.slotPrototypeMatrix
    .querySelectorAll("[data-prototype-matrix-id]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        selectPrototype(button.dataset.prototypeMatrixId);
      });
    });

  elements.slotPrototypeMatrixInfo
    .querySelector("[data-prototype-matrix-inspect]")
    ?.addEventListener("click", (event) => {
      selectPrototype(event.currentTarget.dataset.prototypeMatrixInspect);
      document.querySelector("#atlas-content")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
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
    `${changes} 变化`
  ];
}

function cardMarkup(node, inPath, current, options = {}) {
  const status = statusCopy(node.status);
  const linksToDefinition = status.label === "工作定义";
  const temporaryName = node.name_status === "temporary"
    ? '<span class="name-status">暂定名</span>'
    : "";
  const cornerstoneVariant = node.type === "category_variant"
    && node.variant_role === "cornerstone";
  const representative = node.type === "category_prototype"
    ? representativeProductForPrototype(node)
    : null;
  const variantProduct = node.type === "category_variant"
    ? productsFor(node)[0] ?? null
    : null;
  const variantIconUrl = safeHttpUrl(variantProduct?.header_image_url);
  const variantIconFallback = (variantProduct?.name ?? node.name).slice(0, 2);
  const compactVariant = node.type === "category_variant" && options.compact;

  return `
    <button
      class="atlas-card atlas-card-${escapeHtml(node.type)} ${cornerstoneVariant ? "cornerstone-variant" : ""} ${inPath ? "in-path" : ""} ${current ? "current" : ""} ${compactVariant ? "is-compact" : ""}"
      type="button"
      data-node-id="${escapeHtml(node.id)}"
      aria-pressed="${current}"
      ${compactVariant ? `aria-label="查看品类变体：${escapeHtml(node.name)}"` : ""}
    >
      <span class="card-type">
        ${escapeHtml(TYPE_LABELS[node.type])}
        <span class="card-state-stack">
          <span
            class="status-pill ${status.className} ${linksToDefinition ? "definition-jump" : ""}"
            ${linksToDefinition ? 'data-definition-jump="true" title="查看下方工作定义"' : ""}
          >
            ${escapeHtml(status.label)}
          </span>
          ${cornerstoneVariant ? '<span class="cornerstone-badge">基石游戏</span>' : ""}
          ${current ? '<span class="current-node-badge"><i></i>当前查看</span>' : ""}
        </span>
      </span>
      ${node.type === "category_variant" ? `
        <span class="atlas-variant-identity">
          <span class="atlas-variant-icon ${variantIconUrl ? "has-image" : "no-image"}" aria-hidden="true">
            <span>${escapeHtml(variantIconFallback)}</span>
            ${variantIconUrl ? `
              <img
                src="${escapeHtml(variantIconUrl)}"
                alt=""
                loading="lazy"
                referrerpolicy="no-referrer"
              >
            ` : ""}
          </span>
          <h4>${escapeHtml(node.name)}${temporaryName}</h4>
        </span>
      ` : `
        <h4>${escapeHtml(node.name)}${temporaryName}</h4>
      `}
      ${representative ? `
        <span class="atlas-card-representative">
          基石游戏 · ${escapeHtml(representative.name)}
        </span>
      ` : ""}
      ${node.type === "category_variant" ? `
        <span class="atlas-card-representative atlas-variant-role ${cornerstoneVariant ? "is-cornerstone" : "is-derived"}">
          ${cornerstoneVariant ? "品类公式比较基准" : "相对基石的变化"}
        </span>
      ` : ""}
      <p data-card-summary="${escapeHtml(node.id)}">${escapeHtml(node.summary)}</p>
      <span class="atlas-card-more" data-card-summary="${escapeHtml(node.id)}" hidden>全文</span>
      <span class="card-counts">
        ${cardCounts(node).map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
      </span>
    </button>
  `;
}

function emptyRailMarkup(copy) {
  return `<div class="empty-rail">${escapeHtml(copy)}</div>`;
}

function updateAtlasSummaryOverflow() {
  requestAnimationFrame(() => {
    [elements.mechanismRail, elements.prototypeRail, elements.variantRail].forEach((rail) => {
      rail.querySelectorAll(".atlas-card p[data-card-summary]").forEach((summary) => {
        const overflow = summary.scrollHeight > summary.clientHeight + 1;
        summary.classList.toggle("has-overflow", overflow);
        const marker = summary.parentElement.querySelector(
          `.atlas-card-more[data-card-summary="${CSS.escape(summary.dataset.cardSummary)}"]`
        );
        if (marker) marker.hidden = !overflow;
        if (overflow) summary.title = "点击查看完整说明";
        else summary.removeAttribute("title");
      });
    });
  });
}

function openAtlasSummaryDialog(nodeId) {
  const node = libraryNodeById(nodeId);
  if (!node) return;
  elements.atlasSummaryType.textContent = TYPE_LABELS[node.type] ?? "图谱节点";
  elements.atlasSummaryTitle.textContent = node.name;
  elements.atlasSummaryCopy.textContent = node.summary;
  if (typeof elements.atlasSummaryDialog.showModal === "function") {
    elements.atlasSummaryDialog.showModal();
  } else {
    elements.atlasSummaryDialog.setAttribute("open", "");
  }
}

function closeAtlasSummaryDialog() {
  if (typeof elements.atlasSummaryDialog.close === "function") {
    elements.atlasSummaryDialog.close();
  } else {
    elements.atlasSummaryDialog.removeAttribute("open");
  }
}

function handleAtlasCardClick(event, button, select) {
  const summaryTrigger = event.target.closest("[data-card-summary]");
  if (summaryTrigger && !summaryTrigger.hidden) {
    const summary = button.querySelector("p[data-card-summary]");
    if (summary?.classList.contains("has-overflow")) {
      openAtlasSummaryDialog(summaryTrigger.dataset.cardSummary);
      return;
    }
  }
  const jumpToDefinition = Boolean(event.target.closest("[data-definition-jump]"));
  select(button.dataset.nodeId);
  if (jumpToDefinition) scrollToSelectedNodeDefinition();
}

function scrollToSelectedNodeDefinition() {
  requestAnimationFrame(() => {
    elements.nodeDetail?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
}

function renderRails() {
  const mechanisms = state.data.mechanisms
    .filter(nodeIsVisible)
    .sort((a, b) => a.order - b.order);
  const allPrototypes = prototypesFor(state.selectedMechanismId);
  const prototypes = allPrototypes.filter(nodeIsVisible);
  const allVariants = state.detailLevel === "mechanism"
    ? allPrototypes.flatMap((prototype) => variantsFor(prototype.id))
    : variantsFor(state.selectedPrototypeId);
  const variants = allVariants.filter(nodeIsVisible);
  const allowsVariantViewToggle = allVariants.length >= 4;
  const compactVariantView = allowsVariantViewToggle
    && state.atlasVariantViewMode === "compact";

  elements.mechanismCount.textContent = `共 ${state.data.mechanisms.length} 种`;
  elements.prototypeCount.textContent = `包含 ${allPrototypes.length} 种`;
  elements.variantCount.textContent = `包含 ${allVariants.length} 种`;
  elements.variantViewToggle.hidden = !allowsVariantViewToggle;
  elements.variantViewButtons.forEach((button) => {
    const active = button.dataset.variantViewMode === state.atlasVariantViewMode;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  elements.variantRail.classList.toggle("is-compact-view", compactVariantView);

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
        state.detailLevel === "variant" && node.id === state.selectedVariantId,
        {
          compact: compactVariantView
            && !(state.detailLevel === "variant" && node.id === state.selectedVariantId)
        }
      )).join("")
    : emptyRailMarkup("当前原型下没有符合条件的品类变体");

  updateAtlasSummaryOverflow();

  elements.mechanismRail.querySelectorAll("[data-node-id]").forEach((button) => {
    button.addEventListener("click", (event) => {
      handleAtlasCardClick(event, button, selectMechanism);
    });
  });
  elements.prototypeRail.querySelectorAll("[data-node-id]").forEach((button) => {
    button.addEventListener("click", (event) => {
      handleAtlasCardClick(event, button, selectPrototype);
    });
  });
  elements.variantRail.querySelectorAll("[data-node-id]").forEach((button) => {
    button.addEventListener("click", (event) => {
      handleAtlasCardClick(event, button, selectVariant);
    });
  });

  if (state.detailLevel === "variant") {
    requestAnimationFrame(() => {
      elements.variantRail.querySelector(".atlas-card.current")?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      });
    });
  }
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
            ${atlasFormulaField(node, "C2", "C₂")}
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
  const parts = [];

  if (mechanism) {
    parts.push({ level: "mechanism", node: mechanism });
  }
  if (
    prototype
    && (state.detailLevel === "prototype" || state.detailLevel === "variant")
  ) {
    parts.push({ level: "prototype", node: prototype });
  }
  if (variant && state.detailLevel === "variant") {
    parts.push({ level: "variant", node: variant });
  }

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

function nodeVisualEvidenceMarkup(node) {
  const evidence = node.visual_evidence ?? [];
  const sequence = node.prior_recognition_sequence ?? [];
  if (!evidence.length) return "";

  return `
    <section class="node-visual-evidence" aria-label="${escapeHtml(node.name)}的先验认知证据">
      <header class="node-evidence-heading">
        <div>
          <span>PRIOR KNOWLEDGE EVIDENCE</span>
          <h4>为什么它能成为强先验母型</h4>
        </div>
        <p>
          装置外观和媒介不断变化，但玩家熟悉的操作与判读顺序长期保持稳定。
          母型继承的是这套大众认知，不是某一台具体机器的外观。
        </p>
      </header>

      <div class="node-evidence-gallery">
        ${evidence.map((item) => {
          const sourceUrl = safeHttpUrl(item.source_url);
          const fitClass = item.image_fit === "contain" ? "is-contain" : "is-cover";
          return `
            <figure class="node-evidence-card">
              <div class="node-evidence-image ${fitClass}">
                <img
                  src="${escapeHtml(item.image_url)}"
                  alt="${escapeHtml(item.alt)}"
                  loading="lazy"
                >
                <span>${escapeHtml(item.eyebrow)}</span>
              </div>
              <figcaption>
                <strong>${escapeHtml(item.title)}</strong>
                <p>${escapeHtml(item.caption)}</p>
                ${sourceUrl ? `
                  <a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noreferrer">
                    ${escapeHtml(item.source_name)} · ${escapeHtml(item.license)} ↗
                  </a>
                ` : ""}
              </figcaption>
            </figure>
          `;
        }).join("")}
      </div>

      ${sequence.length ? `
        <div class="node-prior-sequence" aria-label="Slot 的共同先验认知顺序">
          <span class="node-prior-sequence-label">共同保留下来的认知</span>
          <div>
            ${sequence.map((item, index) => `
              <span class="node-prior-step">
                <small>0${index + 1}</small>
                <strong>${escapeHtml(item.label)}</strong>
                <em>${escapeHtml(item.detail)}</em>
              </span>
            `).join("")}
          </div>
        </div>
      ` : ""}
    </section>
  `;
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

    ${nodeVisualEvidenceMarkup(node)}

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
  renderSlotPrototypeMatrix();
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

  elements.variantViewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.atlasVariantViewMode = button.dataset.variantViewMode;
      renderRails();
    });
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
  elements.classificationEditorSave.disabled = !online;
  elements.nodeCreatorSave.disabled = !online;
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
  if (!["products", "matrix", "review", "graph"].includes(view)) return;
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
  const selectedPrototype = state.data.prototypeById.get(state.selectedPrototypeId);
  const selectedVariant = state.data.variantById.get(state.selectedVariantId);
  if (!state.data.mechanismById.has(state.selectedMechanismId)) {
    setDefaultSelection();
  } else if (selectedVariant) {
    const parentPrototype = state.data.prototypeById.get(selectedVariant.prototype_id);
    state.selectedPrototypeId = parentPrototype?.id ?? null;
    state.selectedMechanismId = parentPrototype?.primary_mother_id ?? state.selectedMechanismId;
  } else if (selectedPrototype) {
    state.selectedMechanismId = selectedPrototype.primary_mother_id;
    state.selectedVariantId = variantsFor(selectedPrototype.id)[0]?.id ?? null;
    if (state.detailLevel === "variant" && !state.selectedVariantId) {
      state.detailLevel = "prototype";
    }
  } else {
    setDefaultSelection();
  }
  renderFieldFormulaMap();
  renderTermControls();
  renderTermDetail();
  renderAtlas();
  renderEcosystem();
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

  elements.motherFilter.addEventListener("click", () => {
    state.librarySlotMotherOnly = !state.librarySlotMotherOnly;
    renderProductCatalog();
  });

  elements.prototypeFilter.addEventListener("change", () => {
    state.libraryPrototypeFilter = elements.prototypeFilter.value;
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

  elements.classificationEditorPrototype.addEventListener("change", () => {
    updateClassificationPrototypePreview();
  });
  elements.classificationEditorClose.addEventListener("click", closeClassificationEditor);
  elements.classificationEditorCancel.addEventListener("click", closeClassificationEditor);
  elements.classificationEditor.addEventListener("click", (event) => {
    if (event.target === elements.classificationEditor) closeClassificationEditor();
  });
  elements.classificationEditorForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveProductClassification();
  });

  document.querySelectorAll("[data-create-node]").forEach((button) => {
    if (button.closest("#graph-manager")) return;
    button.addEventListener("click", () => {
      openNodeCreator(button.dataset.createNode, button.dataset.parentNode ?? "");
    });
  });
  elements.nodeCreatorClose.addEventListener("click", closeNodeCreator);
  elements.nodeCreatorCancel.addEventListener("click", closeNodeCreator);
  elements.nodeCreator.addEventListener("click", (event) => {
    if (event.target === elements.nodeCreator) closeNodeCreator();
  });
  elements.nodeCreatorParent.addEventListener("change", () => {
    if (state.creatingNodeType === "product_assignment") {
      renderNodeCreatorProductOptions(elements.nodeCreatorParent.value);
    }
  });
  elements.nodeCreatorForm.addEventListener("submit", (event) => {
    event.preventDefault();
    createModelNode();
  });
  elements.nodeCreatorDelete.addEventListener("click", deleteEditedNode);

  selectLibraryView(state.libraryView);
}

async function init() {
  try {
    elements.atlasSummaryClose.addEventListener("click", closeAtlasSummaryDialog);
    elements.atlasSummaryDialog.addEventListener("click", (event) => {
      if (event.target === elements.atlasSummaryDialog) closeAtlasSummaryDialog();
    });
    bindLuckLandlordCase();
    bindExperienceTimeline();
    bindCoreInsights();
    state.data = await loadData();
    setDefaultSelection();
    renderFieldFormulaMap();
    renderTermControls();
    renderTermDetail();
    renderAtlas();
    renderEcosystem();
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
