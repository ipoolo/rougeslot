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
  C2: "二次揭晓",
  N: "Spin 周期",
  BD: "构筑决策"
};

const TYPE_LABELS = {
  mechanism_archetype: "机制母型",
  category_prototype: "品类原型",
  category_variant: "游戏变体"
};

const OPERATION_LABELS = {
  inherit: "继承",
  override: "覆写",
  extend: "扩展"
};

const OPERATION_DESCRIPTIONS = {
  inherit: "与父类完全一样",
  override: "完全改动父级定义",
  extend: "继承父级并拓展"
};

function operationLabelForNode(node, operation) {
  if (node?.type === "mechanism_archetype") return "本层定义";
  return OPERATION_LABELS[operation] ?? operation;
}

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

const DATA_VERSION = "20260802-1";

const DATA_FILES = {
  model: `./data/experience-model.json?v=${DATA_VERSION}`,
  terms: `./data/terms.json?v=${DATA_VERSION}`,
  mechanisms: `./data/mechanism-archetypes.json?v=${DATA_VERSION}`,
  prototypes: `./data/category-prototypes.json?v=${DATA_VERSION}`,
  variants: `./data/category-variants.json?v=${DATA_VERSION}`,
  products: `./data/products.json?v=${DATA_VERSION}`,
  salesEstimates: `./data/product-sales-estimates.json?v=${DATA_VERSION}`,
  steamMetadata: `./data/product-steam-metadata.json?v=${DATA_VERSION}`,
  productObservations: `./data/product-formula-observations.json?v=${DATA_VERSION}`,
  ecosystems: `./data/category-ecosystems.json?v=${DATA_VERSION}`,
  migrationReport: `./data/migration-report.json?v=${DATA_VERSION}`
};

const state = {
  data: null,
  selectedMechanismId: null,
  selectedPrototypeId: null,
  selectedVariantId: null,
  selectedFingerprintField: null,
  selectedAtlasFormulaField: null,
  atlasFormulaSelectionNodeId: null,
  detailLevel: "variant",
  selectedTermKey: "P_t",
  query: "",
  filter: "all",
  atlasVariantViewMode: "compact",
  libraryView: "products",
  libraryProductQuery: "",
  libraryProductFilter: "all",
  libraryProductSort: "default",
  librarySlotMotherOnly: true,
  libraryPrototypeFilter: "all",
  libraryMatrixParentId: "mechanism.slot",
  libraryFieldFilter: "all",
  libraryMatrixNodeFilter: null,
  dataServiceOnline: false,
  editingField: null,
  editingFieldImages: [],
  fieldEditorBusy: false,
  fieldImageViewerItems: [],
  fieldImageViewerIndex: 0,
  fieldImageViewerZoom: 1,
  fieldImageViewerPanX: 0,
  fieldImageViewerPanY: 0,
  fieldImageViewerDrag: null,
  selectedProductId: null,
  editingProductId: null,
  selectedEcosystemPrototypeId: "prototype.slot-transform-combat",
  selectedEcosystemProductId: "product.endgame-of-devil",
  selectedEcosystemField: null,
  selectedEcosystemMapPreset: "all",
  ecosystemMapFilters: {
    topology: null,
    color: null,
    secondary_badge: null
  },
  selectedEcosystemBdMode: "all",
  expandedEcosystemBranches: ["numeric-check"],
  ecosystemNicheInfoCollapsed: false,
  crossTabHistory: [],
  creatingNodeType: null,
  editingNodeId: null
};

const elements = {
  crossTabTrail: document.querySelector("#cross-tab-trail"),
  crossTabTrailItems: document.querySelector("#cross-tab-trail-items"),
  crossTabTrailClear: document.querySelector("#cross-tab-trail-clear"),
  productDetailCrossTabTrail: document.querySelector("#product-detail-cross-tab-trail"),
  productDetailCrossTabTrailItems: document.querySelector("#product-detail-cross-tab-trail-items"),
  productDetailCrossTabTrailClear: document.querySelector("#product-detail-cross-tab-trail-clear"),
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
  productSort: document.querySelector("#library-product-sort"),
  motherFilter: document.querySelector("#library-mother-filter"),
  prototypeFilter: document.querySelector("#library-prototype-filter"),
  productResultSummary: document.querySelector("#product-result-summary"),
  productCatalog: document.querySelector("#product-catalog"),
  matrixParentFilter: document.querySelector("#library-matrix-parent"),
  fieldFilter: document.querySelector("#library-field-filter"),
  matrixScopeSummary: document.querySelector("#matrix-scope-summary"),
  matrixNodeFocus: document.querySelector("#matrix-node-focus"),
  matrixNodeFocusName: document.querySelector("#matrix-node-focus-name"),
  matrixNodeFocusClear: document.querySelector("#matrix-node-focus-clear"),
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
  fieldEditorEvidence: document.querySelector("#field-editor-evidence"),
  fieldEditorImageInput: document.querySelector("#field-editor-image-input"),
  fieldEditorEvidenceList: document.querySelector("#field-editor-evidence-list"),
  fieldEditorNote: document.querySelector("#field-editor-note"),
  fieldEditorMessage: document.querySelector("#field-editor-message"),
  fieldEditorClose: document.querySelector("#field-editor-close"),
  fieldEditorCancel: document.querySelector("#field-editor-cancel"),
  fieldEditorSave: document.querySelector("#field-editor-save"),
  fieldEditorConfirm: document.querySelector("#field-editor-confirm"),
  fieldImageViewer: document.querySelector("#field-image-viewer"),
  fieldImageViewerImage: document.querySelector("#field-image-viewer-image"),
  fieldImageViewerTitle: document.querySelector("#field-image-viewer-title"),
  fieldImageViewerCount: document.querySelector("#field-image-viewer-count"),
  fieldImageViewerCaption: document.querySelector("#field-image-viewer-caption"),
  fieldImageViewerClose: document.querySelector("#field-image-viewer-close"),
  fieldImageViewerStage: document.querySelector(".field-image-viewer-stage"),
  fieldImageViewerZoomOut: document.querySelector("#field-image-viewer-zoom-out"),
  fieldImageViewerZoomIn: document.querySelector("#field-image-viewer-zoom-in"),
  fieldImageViewerZoomReset: document.querySelector("#field-image-viewer-zoom-reset"),
  fieldImageViewerZoomLevel: document.querySelector("#field-image-viewer-zoom-level"),
  fieldImageViewerPrevious: document.querySelector("#field-image-viewer-previous"),
  fieldImageViewerNext: document.querySelector("#field-image-viewer-next"),
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
    copy: "Combo 先由 C₁ 建立基础结果的价值锚点，再由可选的 C₂ 沿该结果逐步完成二次揭晓，输出本次 Spin_Result。"
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
    title: "C₁ 负责立即可读，C₂ 负责二次揭晓，轻决策与手动 Spin 让双峰持续成立。",
    copy: "学习、构筑和压力验证位于结果之后或循环外层，用来放大体验；单轮只保留少量、低复杂度操作，并由玩家主动开启。",
    boundary: "边界：复杂策略可以进入阶段性构筑，但不应占满两次表演之间的操作窗口；系统也不能替玩家触发下一次 Spin。",
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
  c3: {
    label: "洞察 3 · 决策复杂度",
    title: "同时控制决策数与单次复杂度，让玩家尽快从操作回到下一次表演。",
    copy: "双峰多巴胺循环依赖短操作窗口与表演窗口持续交替。每次操作也可以成为低复杂度、带技巧的短开奖，但要控制持续输入造成的疲劳；复杂策略应在阶段边界集中处理。",
    boundary: "检查边界：限制的是单个双峰循环必须支付的决策成本，而不是游戏整体的策略上限。",
    nodes: ["operate", "perform", "repeat"],
    edges: ["operate-perform", "perform-repeat"],
    zones: ["rhythm"]
  },
  c4: {
    label: "洞察 4 · 禁止自动 Spin",
    title: "每一次 Spin 都必须由玩家明确触发，主动操作为期待建立清晰起点。",
    copy: "自动 Spin 把离散的“操作 → 期待 → C₁／C₂ 揭晓”压成无边界结果流，使双峰失去起点与间隔，并滑向依赖变动奖励维持重复行为的斯金纳箱式循环。",
    boundary: "不可妥协：可以减少单次操作成本，但不能移除玩家对下一次 Spin 的主动触发权。",
    nodes: ["manual-spin", "anticipation", "double-peak", "c1", "c2", "result"],
    edges: ["manual-anticipation", "anticipation-peaks", "peaks-return", "c1-c2", "c2-result"],
    zones: ["autospin", "first-peak", "second-peak"]
  },
  hybrid: {
    label: "高风险组合 · Slot改+战斗",
    title: "同时保护 C₁ 的大奖识别，并让 C₂ 的战斗结果保持悬念。",
    copy: "这种组合既改写基础协同，又通过战斗过程二次揭晓 C₁ 的兑现程度，最容易让两个体验阶段相互侵占。棋盘过大、符号过多或关系过深，会先削弱第一峰；结果过早可计算，又会削弱第二峰。",
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

function topTabForHash(hash = window.location.hash) {
  const value = hash.replace(/^#/, "");
  if (value === "atlas" || value === "atlas-content" || value === "atlas-method") {
    return "atlas";
  }
  if (value === "ecosystem" || value === "ecosystem-content") {
    return "ecosystem";
  }
  if (value === "library") {
    return "library";
  }
  if (
    value === "insights" ||
    value === "insights-content" ||
    value.startsWith("insight-")
  ) {
    return "insights";
  }
  return "model";
}

function currentCrossTabLabel(hash = window.location.hash) {
  const tab = topTabForHash(hash);
  if (!state.data) {
    return {
      model: "体验模型",
      atlas: "原型图谱",
      ecosystem: "品类生态",
      library: "游戏库",
      insights: "核心洞察"
    }[tab];
  }

  if (tab === "atlas") {
    const fullPath = [
      state.data.mechanismById.get(state.selectedMechanismId)?.name,
      state.data.prototypeById.get(state.selectedPrototypeId)?.name,
      state.data.variantById.get(state.selectedVariantId)?.name
    ];
    const depth = {
      mechanism: 1,
      prototype: 2,
      variant: 3
    }[state.detailLevel] ?? 1;
    const path = fullPath.slice(0, depth).filter(Boolean);
    return `原型图谱${path.length ? ` · ${path.join(" → ")}` : ""}`;
  }

  if (tab === "library") {
    const selectedProduct = elements.productDetail?.open
      ? state.data.productById.get(state.selectedProductId)
      : null;
    const viewLabels = {
      products: "游戏目录",
      matrix: "公式数据表",
      review: "待确认队列",
      graph: "图谱管理"
    };
    return `游戏库 · ${selectedProduct?.name ?? viewLabels[state.libraryView] ?? "游戏目录"}`;
  }

  if (tab === "ecosystem") {
    const prototype = state.data.prototypeById.get(state.selectedEcosystemPrototypeId);
    const product = state.data.productById.get(state.selectedEcosystemProductId);
    return `品类生态${prototype ? ` · ${prototype.name}` : ""}${product ? ` → ${product.name}` : ""}`;
  }

  if (tab === "insights") {
    return "核心洞察";
  }

  const term = state.data.termByKey.get(state.selectedTermKey);
  return `体验模型${term ? ` · ${formulaDisplayKey(state.selectedTermKey)} ${term.name}` : ""}`;
}

function captureCrossTabContext() {
  return {
    hash: window.location.hash || "#model",
    label: currentCrossTabLabel(),
    scrollY: window.scrollY,
    productDetailOpen: Boolean(elements.productDetail?.open && state.selectedProductId),
    state: {
      selectedMechanismId: state.selectedMechanismId,
      selectedPrototypeId: state.selectedPrototypeId,
      selectedVariantId: state.selectedVariantId,
      selectedFingerprintField: state.selectedFingerprintField,
      detailLevel: state.detailLevel,
      selectedTermKey: state.selectedTermKey,
      atlasVariantViewMode: state.atlasVariantViewMode,
      libraryView: state.libraryView,
      libraryProductQuery: state.libraryProductQuery,
      libraryProductFilter: state.libraryProductFilter,
      libraryProductSort: state.libraryProductSort,
      librarySlotMotherOnly: state.librarySlotMotherOnly,
      libraryPrototypeFilter: state.libraryPrototypeFilter,
      libraryMatrixParentId: state.libraryMatrixParentId,
      libraryFieldFilter: state.libraryFieldFilter,
      libraryMatrixNodeFilter: state.libraryMatrixNodeFilter,
      selectedProductId: state.selectedProductId,
      selectedEcosystemPrototypeId: state.selectedEcosystemPrototypeId,
      selectedEcosystemProductId: state.selectedEcosystemProductId,
      selectedEcosystemField: state.selectedEcosystemField,
      selectedEcosystemMapPreset: state.selectedEcosystemMapPreset,
      ecosystemMapFilters: { ...state.ecosystemMapFilters },
      selectedEcosystemBdMode: state.selectedEcosystemBdMode,
      expandedEcosystemBranches: [...state.expandedEcosystemBranches],
      ecosystemNicheInfoCollapsed: state.ecosystemNicheInfoCollapsed
    }
  };
}

function rememberCrossTabOrigin() {
  const context = captureCrossTabContext();
  const previous = state.crossTabHistory[state.crossTabHistory.length - 1];
  if (previous?.hash === context.hash && previous?.label === context.label) return;
  state.crossTabHistory.push(context);
  if (state.crossTabHistory.length > 6) {
    state.crossTabHistory.shift();
  }
  renderCrossTabTrail();
}

function restoreCrossTabContext(index) {
  const context = state.crossTabHistory[index];
  if (!context) return;
  state.crossTabHistory = state.crossTabHistory.slice(0, index);

  if (elements.productDetail?.open) {
    closeProductDetail();
  }
  Object.assign(state, context.state);
  renderFieldFormulaMap();
  renderTermControls();
  renderTermDetail();
  renderAtlas();
  renderEcosystem();
  renderLibrary();

  window.location.hash = context.hash.replace(/^#/, "");
  if (context.productDetailOpen && context.state.selectedProductId) {
    openProductDetail(context.state.selectedProductId);
  }

  window.requestAnimationFrame(() => {
    window.scrollTo({
      top: context.scrollY,
      behavior: "instant"
    });
    renderCrossTabTrail();
  });
}

function renderCrossTabTrail() {
  const trailMarkup = state.crossTabHistory.length ? `
    ${state.crossTabHistory.map((item, index) => `
      <button
        type="button"
        data-cross-tab-history="${index}"
        title="返回 ${escapeHtml(item.label)}"
      >
        <span>←</span>
        ${escapeHtml(item.label)}
      </button>
      <i aria-hidden="true">›</i>
    `).join("")}
    <strong title="${escapeHtml(currentCrossTabLabel())}">
      当前 · ${escapeHtml(currentCrossTabLabel())}
    </strong>
  ` : "";

  [
    [elements.crossTabTrail, elements.crossTabTrailItems],
    [elements.productDetailCrossTabTrail, elements.productDetailCrossTabTrailItems]
  ].forEach(([trail, items]) => {
    if (!trail || !items) return;
    trail.hidden = state.crossTabHistory.length === 0;
    items.innerHTML = trailMarkup;
    items
      .querySelectorAll("[data-cross-tab-history]")
      .forEach((button) => {
        button.addEventListener("click", () => {
          restoreCrossTabContext(Number(button.dataset.crossTabHistory));
        });
      });
  });
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
  loaded.salesEstimatesSource = loaded.salesEstimates.source;
  loaded.salesEstimates = loaded.salesEstimates.items;
  loaded.steamMetadataSource = loaded.steamMetadata.source;
  loaded.steamMetadata = loaded.steamMetadata.items;
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
  loaded.salesEstimateByProductId = new Map(
    loaded.salesEstimates.map((item) => [item.product_id, item])
  );
  loaded.steamMetadataByProductId = new Map(
    loaded.steamMetadata.map((item) => [item.product_id, item])
  );
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

function steamDbUrlForProduct(product) {
  const explicitId = String(product?.steam_app_id ?? "").trim();
  const sourceId = String(product?.source_url ?? "")
    .match(/store\.steampowered\.com\/app\/(\d+)/)?.[1];
  const appId = explicitId || sourceId;
  return /^\d+$/.test(appId) ? `https://steamdb.info/app/${appId}/` : null;
}

function compactChineseCount(value) {
  if (!Number.isFinite(value)) return "";
  if (value >= 10000) {
    const tenThousands = value / 10000;
    return `${Number.isInteger(tenThousands) ? tenThousands : tenThousands.toFixed(1)} 万`;
  }
  return new Intl.NumberFormat("zh-CN").format(value);
}

function salesEstimateCopy(product) {
  const estimate = state.data.salesEstimateByProductId.get(product.id);
  const fetchedAt = String(state.data.salesEstimatesSource?.fetched_at ?? "").slice(0, 10);

  if (!estimate) {
    return {
      value: "暂无数据",
      detail: "未找到销量记录",
      title: "当前游戏还没有关联销量参考记录。"
    };
  }

  if (estimate.status === "estimated" && Number.isFinite(estimate.units_estimate)) {
    const hasRange = Number.isFinite(estimate.units_lower) && Number.isFinite(estimate.units_upper);
    return {
      value: `约 ${compactChineseCount(estimate.units_estimate)}`,
      detail: `${hasRange
        ? `区间 ${compactChineseCount(estimate.units_lower)}–${compactChineseCount(estimate.units_upper)}`
        : "Gamalytic 估算"}${fetchedAt ? ` · ${fetchedAt}` : ""}`,
      title: "Gamalytic Copies sold 估算：表示直接在 Steam 购买的预估份数，不包含通过 Steam Key 激活的份数；不是官方销量。",
      sourceUrl: safeHttpUrl(estimate.source_url)
    };
  }

  return {
    value: "暂无 Gamalytic 数据",
    detail: `未收录或暂未提供${fetchedAt ? ` · ${fetchedAt}` : ""}`,
    title: "Gamalytic 当前未提供这款游戏的 Copies sold 估算。",
    sourceUrl: safeHttpUrl(estimate.source_url)
  };
}

function steamMetadataCopy(product) {
  const metadata = state.data.steamMetadataByProductId.get(product.id);
  const isDemo = Boolean(metadata?.is_demo)
    || /\bdemo\b/i.test(`${product.name ?? ""} ${product.name_en ?? ""}`);
  const dateLabel = metadata?.coming_soon
    ? (isDemo ? "Demo 预计上线" : "预计上市")
    : (isDemo ? "Demo 上线" : "上市时间");
  const rawDateText = String(metadata?.release_date_text ?? "").trim();
  const dateValue = (
    metadata?.release_date_iso
    ?? (/^coming soon$/i.test(rawDateText) ? "日期待公布" : rawDateText)
  ) || (product.release_year ? String(product.release_year) : "日期待公布");
  const reviewScore = Number.isInteger(metadata?.review_score)
    ? metadata.review_score
    : 0;
  const reviewTone = reviewScore >= 8
    ? "excellent"
    : reviewScore >= 6
      ? "positive"
      : reviewScore === 5
        ? "mixed"
        : reviewScore > 0
          ? "negative"
          : "none";
  const reviewLabel = reviewScore === 0 && Number(metadata?.total_reviews) > 0
    ? "评价较少"
    : (metadata?.review_label ?? "暂无用户评测");
  const reviewCount = Number.isFinite(metadata?.total_reviews)
    ? `${new Intl.NumberFormat("zh-CN").format(metadata.total_reviews)} 条评价`
    : "评价数待更新";

  return {
    dateLabel,
    dateValue,
    reviewLabel,
    reviewCount,
    reviewTone
  };
}

function compareProductsBySalesDescending(a, b) {
  const aEstimate = state.data.salesEstimateByProductId.get(a.id);
  const bEstimate = state.data.salesEstimateByProductId.get(b.id);
  const aPoint = Number.isFinite(aEstimate?.units_estimate) ? aEstimate.units_estimate : -1;
  const bPoint = Number.isFinite(bEstimate?.units_estimate) ? bEstimate.units_estimate : -1;
  if (aPoint !== bPoint) return bPoint - aPoint;

  const aUpper = Number.isFinite(aEstimate?.units_upper) ? aEstimate.units_upper : aPoint;
  const bUpper = Number.isFinite(bEstimate?.units_upper) ? bEstimate.units_upper : bPoint;
  if (aUpper !== bUpper) return bUpper - aUpper;

  return a.order - b.order || a.name.localeCompare(b.name, "zh-CN");
}

function safeFieldEvidenceUrl(value = "") {
  if (/^\.\/assets\/uploads\/formula-fields\/[A-Za-z0-9._-]+$/.test(value)) {
    return value;
  }
  if (/^data:image\/(?:png|jpeg|webp);base64,/.test(value)) {
    return value;
  }
  return safeHttpUrl(value);
}

function fieldEvidenceImages(entry) {
  return Array.isArray(entry?.evidence_images)
    ? entry.evidence_images.filter((item) => safeFieldEvidenceUrl(item?.url ?? item?.data_url))
    : [];
}

function fieldEvidencePreviewMarkup(input, options = {}) {
  const images = Array.isArray(input)
    ? fieldEvidenceImages({ evidence_images: input })
    : fieldEvidenceImages(input);
  if (!images.length) return "";

  const limit = Math.max(1, options.limit ?? images.length);
  const visibleImages = images.slice(0, limit);
  const label = options.label ?? "字段配图";
  const className = options.className ? ` ${options.className}` : "";

  return `
    <span class="field-evidence-thumbnails${className}" data-field-evidence-group
      aria-label="${escapeHtml(label)}">
      ${visibleImages.map((image, index) => {
        const imageUrl = safeFieldEvidenceUrl(image.url ?? image.data_url);
        const caption = image.caption || image.name || `${label} ${index + 1}`;
        return `
          <button type="button" class="field-evidence-thumb"
            data-field-image-preview
            data-field-image-caption="${escapeHtml(caption)}"
            aria-label="放大查看：${escapeHtml(caption)}"
            title="点击放大查看"
          >
            <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(caption)}" loading="lazy">
            <span aria-hidden="true">↗</span>
          </button>
        `;
      }).join("")}
      ${images.length > visibleImages.length
        ? `<span class="field-evidence-more">+${images.length - visibleImages.length}</span>`
        : ""}
    </span>
  `;
}

const FIELD_IMAGE_VIEWER_MIN_ZOOM = 0.5;
const FIELD_IMAGE_VIEWER_MAX_ZOOM = 5;
const FIELD_IMAGE_VIEWER_ZOOM_STEP = 0.25;

function updateFieldImageViewerTransform() {
  const zoom = state.fieldImageViewerZoom;
  elements.fieldImageViewerImage.style.transform =
    `translate(${state.fieldImageViewerPanX}px, ${state.fieldImageViewerPanY}px) scale(${zoom})`;
  elements.fieldImageViewerZoomLevel.value = `${Math.round(zoom * 100)}%`;
  elements.fieldImageViewerZoomLevel.textContent = `${Math.round(zoom * 100)}%`;
  elements.fieldImageViewerZoomOut.disabled = zoom <= FIELD_IMAGE_VIEWER_MIN_ZOOM;
  elements.fieldImageViewerZoomIn.disabled = zoom >= FIELD_IMAGE_VIEWER_MAX_ZOOM;
  elements.fieldImageViewerStage.classList.toggle("is-zoomed", zoom > 1);
}

function resetFieldImageViewerZoom() {
  state.fieldImageViewerZoom = 1;
  state.fieldImageViewerPanX = 0;
  state.fieldImageViewerPanY = 0;
  state.fieldImageViewerDrag = null;
  elements.fieldImageViewerStage.classList.remove("is-dragging");
  updateFieldImageViewerTransform();
}

function setFieldImageViewerZoom(value) {
  const nextZoom = Math.min(
    FIELD_IMAGE_VIEWER_MAX_ZOOM,
    Math.max(FIELD_IMAGE_VIEWER_MIN_ZOOM, value)
  );
  state.fieldImageViewerZoom =
    Math.round(nextZoom / FIELD_IMAGE_VIEWER_ZOOM_STEP) * FIELD_IMAGE_VIEWER_ZOOM_STEP;
  if (state.fieldImageViewerZoom <= 1) {
    state.fieldImageViewerPanX = 0;
    state.fieldImageViewerPanY = 0;
  }
  updateFieldImageViewerTransform();
}

function renderFieldImageViewer() {
  const items = state.fieldImageViewerItems;
  const item = items[state.fieldImageViewerIndex];
  if (!item) return;

  resetFieldImageViewerZoom();
  elements.fieldImageViewerImage.src = item.src;
  elements.fieldImageViewerImage.alt = item.caption;
  elements.fieldImageViewerTitle.textContent = item.caption || "字段配图";
  elements.fieldImageViewerCaption.textContent = item.caption || "字段配图";
  elements.fieldImageViewerCount.textContent =
    `字段配图 · ${state.fieldImageViewerIndex + 1} / ${items.length}`;
  elements.fieldImageViewerPrevious.hidden = items.length < 2;
  elements.fieldImageViewerNext.hidden = items.length < 2;
}

function openFieldImageViewer(trigger) {
  const group = trigger.closest("[data-field-evidence-group]");
  const triggers = group
    ? [...group.querySelectorAll("[data-field-image-preview]")]
    : [trigger];
  const items = triggers.map((button) => {
    const image = button.querySelector("img");
    return {
      trigger: button,
      src: image?.currentSrc || image?.getAttribute("src") || "",
      caption: button.dataset.fieldImageCaption || image?.alt || "字段配图"
    };
  }).filter((item) => safeFieldEvidenceUrl(item.src));
  if (!items.length) return;

  state.fieldImageViewerItems = items;
  state.fieldImageViewerIndex = Math.max(0, triggers.indexOf(trigger));
  renderFieldImageViewer();
  if (typeof elements.fieldImageViewer.showModal === "function") {
    elements.fieldImageViewer.showModal();
  } else {
    elements.fieldImageViewer.setAttribute("open", "");
  }
}

function closeFieldImageViewer() {
  if (typeof elements.fieldImageViewer.close === "function") {
    elements.fieldImageViewer.close();
  } else {
    elements.fieldImageViewer.removeAttribute("open");
  }
}

function stepFieldImageViewer(delta) {
  const count = state.fieldImageViewerItems.length;
  if (count < 2) return;
  state.fieldImageViewerIndex = (state.fieldImageViewerIndex + delta + count) % count;
  renderFieldImageViewer();
}

function bindFieldImageViewer() {
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-field-image-preview]");
    if (!trigger) return;
    event.preventDefault();
    event.stopPropagation();
    openFieldImageViewer(trigger);
  });
  elements.fieldImageViewerClose.addEventListener("click", closeFieldImageViewer);
  elements.fieldImageViewerZoomOut.addEventListener("click", () => {
    setFieldImageViewerZoom(state.fieldImageViewerZoom - FIELD_IMAGE_VIEWER_ZOOM_STEP);
  });
  elements.fieldImageViewerZoomIn.addEventListener("click", () => {
    setFieldImageViewerZoom(state.fieldImageViewerZoom + FIELD_IMAGE_VIEWER_ZOOM_STEP);
  });
  elements.fieldImageViewerZoomReset.addEventListener("click", resetFieldImageViewerZoom);
  elements.fieldImageViewerPrevious.addEventListener("click", () => stepFieldImageViewer(-1));
  elements.fieldImageViewerNext.addEventListener("click", () => stepFieldImageViewer(1));
  elements.fieldImageViewerStage.addEventListener("wheel", (event) => {
    event.preventDefault();
    const direction = event.deltaY < 0 ? 1 : -1;
    setFieldImageViewerZoom(
      state.fieldImageViewerZoom + direction * FIELD_IMAGE_VIEWER_ZOOM_STEP
    );
  }, { passive: false });
  elements.fieldImageViewerStage.addEventListener("dblclick", (event) => {
    if (event.target.closest(".field-image-viewer-nav")) return;
    setFieldImageViewerZoom(state.fieldImageViewerZoom === 1 ? 2 : 1);
  });
  elements.fieldImageViewerStage.addEventListener("pointerdown", (event) => {
    if (
      state.fieldImageViewerZoom <= 1
      || event.target.closest(".field-image-viewer-nav")
    ) return;
    event.preventDefault();
    state.fieldImageViewerDrag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      panX: state.fieldImageViewerPanX,
      panY: state.fieldImageViewerPanY
    };
    elements.fieldImageViewerStage.classList.add("is-dragging");
    elements.fieldImageViewerStage.setPointerCapture?.(event.pointerId);
  });
  elements.fieldImageViewerStage.addEventListener("pointermove", (event) => {
    const drag = state.fieldImageViewerDrag;
    if (!drag || drag.pointerId !== event.pointerId) return;
    state.fieldImageViewerPanX = drag.panX + event.clientX - drag.startX;
    state.fieldImageViewerPanY = drag.panY + event.clientY - drag.startY;
    updateFieldImageViewerTransform();
  });
  const endImageDrag = (event) => {
    const drag = state.fieldImageViewerDrag;
    if (!drag || drag.pointerId !== event.pointerId) return;
    state.fieldImageViewerDrag = null;
    elements.fieldImageViewerStage.classList.remove("is-dragging");
    elements.fieldImageViewerStage.releasePointerCapture?.(event.pointerId);
  };
  elements.fieldImageViewerStage.addEventListener("pointerup", endImageDrag);
  elements.fieldImageViewerStage.addEventListener("pointercancel", endImageDrag);
  elements.fieldImageViewer.addEventListener("click", (event) => {
    if (event.target === elements.fieldImageViewer) closeFieldImageViewer();
  });
  elements.fieldImageViewer.addEventListener("keydown", (event) => {
    if (["+", "=", "Add"].includes(event.key)) {
      event.preventDefault();
      setFieldImageViewerZoom(state.fieldImageViewerZoom + FIELD_IMAGE_VIEWER_ZOOM_STEP);
      return;
    }
    if (["-", "Subtract"].includes(event.key)) {
      event.preventDefault();
      setFieldImageViewerZoom(state.fieldImageViewerZoom - FIELD_IMAGE_VIEWER_ZOOM_STEP);
      return;
    }
    if (event.key === "0") {
      event.preventDefault();
      resetFieldImageViewerZoom();
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      stepFieldImageViewer(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      stepFieldImageViewer(1);
    }
  });
  elements.fieldImageViewer.addEventListener("close", () => {
    state.fieldImageViewerItems = [];
    state.fieldImageViewerIndex = 0;
    resetFieldImageViewerZoom();
    elements.fieldImageViewerImage.removeAttribute("src");
  });
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
    variants.join(" + ") || (prototypes.length ? "无独立变体" : "游戏变体待确认")
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
    [state.data.products.length, "具体游戏"],
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
    .sort(state.libraryProductSort === "sales_desc"
      ? compareProductsBySalesDescending
      : (a, b) => a.order - b.order || a.name.localeCompare(b.name, "zh-CN"));

  elements.productSort.value = state.libraryProductSort;

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
      ${state.libraryProductSort === "sales_desc" ? "按销量数据从高到低排列；" : "默认排序；"}
      旧版迁入 ${state.data.migrationReport.result.formal_legacy_games} 款；
      设计样例 ${state.data.migrationReport.result.design_samples} 条，不计入游戏数量。
    </small>
  `;

  elements.productCatalog.innerHTML = products.length
    ? products.map((product, index) => {
      const classification = productClassification(product);
      const sourceUrl = safeHttpUrl(product.source_url);
      const steamDbUrl = steamDbUrlForProduct(product);
      const coverUrl = safeHttpUrl(product.header_image_url);
      const tags = (product.tags ?? []).slice(0, 3);
      const relationRole = roleForProduct(product);
      const roleLabel = relationRole === "cornerstone"
        ? "基石游戏"
        : product.prototype_ids.length
          ? "变体游戏"
          : "待归类游戏";
      const prototypeIdentity = classification.path[1] ?? "品类原型待确认";
      const salesEstimate = salesEstimateCopy(product);
      const steamMetadata = steamMetadataCopy(product);
      return `
        <article class="product-record product-depth-${classification.depth}">
          <div class="product-cover ${coverUrl ? "" : "no-image"}">
            ${coverUrl ? `
              <img src="${escapeHtml(coverUrl)}" alt="" loading="lazy" referrerpolicy="no-referrer">
            ` : `
              <span>${escapeHtml(product.name.slice(0, 2))}</span>
            `}
          </div>
          <header class="product-record-head">
            <div class="product-record-title">
              <h4>${escapeHtml(product.name)}</h4>
              ${product.name_en ? `<span class="product-name-en">${escapeHtml(product.name_en)}</span>` : ""}
              <div class="product-steam-meta" aria-label="${escapeHtml(product.name)}的 Steam 上市与评价信息">
                <span class="product-release-date">
                  ${escapeHtml(steamMetadata.dateLabel)} · ${escapeHtml(steamMetadata.dateValue)}
                </span>
                <span class="product-review-text review-${escapeHtml(steamMetadata.reviewTone)}">
                  ${escapeHtml(steamMetadata.reviewLabel)} · ${escapeHtml(steamMetadata.reviewCount)}
                </span>
              </div>
            </div>
            <div class="product-record-side">
              <span class="product-sequence">${String(index + 1).padStart(2, "0")}</span>
            </div>
          </header>
          <section class="product-category-band" aria-label="${escapeHtml(product.name)}的当前品类身份">
            <div>
              <small>当前品类身份</small>
              <strong>${escapeHtml(prototypeIdentity)}</strong>
            </div>
            <span class="product-taxonomy-role role-${escapeHtml(relationRole)}">${escapeHtml(roleLabel)}</span>
          </section>
          <p class="product-summary">${escapeHtml(product.summary)}</p>
          <section class="product-info-row product-sales-row" title="${escapeHtml(salesEstimate.title)}">
            <small>销量估算</small>
            <div class="product-sales-estimate">
              <strong>${escapeHtml(salesEstimate.value)}</strong>
            </div>
          </section>
          <section class="product-info-row product-path-row">
            <small>完整路径</small>
            <div class="product-classification" aria-label="${escapeHtml(product.name)}的完整分类路径">
              ${classification.path.map((part, pathIndex) => `
                ${pathIndex ? '<span aria-hidden="true">→</span>' : ""}
                <strong>${escapeHtml(part)}</strong>
              `).join("")}
            </div>
          </section>
          <section class="product-info-row product-tags-row">
            <small>分析标签</small>
            ${tags.length ? `
              <div class="product-mechanics">
                ${tags.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
              </div>
            ` : '<span class="product-tags-empty">待补充</span>'}
          </section>
          <footer>
            <button type="button" class="product-detail-button" data-product-detail="${escapeHtml(product.id)}">
              查看游戏资料
            </button>
            ${sourceUrl ? `
              <a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noreferrer">Steam ↗</a>
            ` : ""}
            ${steamDbUrl ? `
              <a href="${escapeHtml(steamDbUrl)}" target="_blank" rel="noreferrer">SteamDB ↗</a>
            ` : ""}
            ${salesEstimate.sourceUrl ? `
              <a href="${escapeHtml(salesEstimate.sourceUrl)}" target="_blank" rel="noreferrer">Gamalytic ↗</a>
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
  renderCrossTabTrail();
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
    ? `${mechanism.name} → ${prototype.name} → 当前游戏（系统自动建立游戏变体）`
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

function matrixCellMarkup(node, field, options = {}) {
  const entry = rawFingerprint(node)[field];
  const evidenceImages = fieldEvidenceImages(entry);
  const status = reviewStatusFor(node, entry);
  const parent = parentNode(node);
  const parentValue = parent ? effectiveFingerprint(parent)[field] : null;
  const parentCopy = parentValue
    ? `${parentValue.label}：${parentValue.summary}`
    : "体验公式基础字段";
  return `
    <td class="${options.isParent ? "matrix-parent-data-column" : ""} ${options.isFocused ? "is-focused-node" : ""}">
      <div class="matrix-cell-shell ${evidenceImages.length ? "has-evidence" : ""}">
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
              ${escapeHtml(operationLabelForNode(node, entry.operation))}
            </em>
            <i class="review-badge ${escapeHtml(status)}">${escapeHtml(REVIEW_STATUS_LABELS[status])}</i>
          </span>
          <strong>${escapeHtml(entry.constraint_label ?? FIELD_LABELS[field])}</strong>
          <small>${escapeHtml(entry.summary)}</small>
        </button>
        ${fieldEvidencePreviewMarkup(evidenceImages, {
          className: "matrix-field-evidence",
          limit: 4,
          label: `${node.name} · ${formulaDisplayKey(field)} 配图`
        })}
      </div>
    </td>
  `;
}

function matrixParentCandidates() {
  return [
    ...state.data.mechanisms,
    ...state.data.prototypes
  ].sort((a, b) => {
    const typeDelta = NODE_TYPE_ORDER[a.type] - NODE_TYPE_ORDER[b.type];
    return typeDelta || a.order - b.order;
  });
}

function matrixChildrenFor(parent) {
  if (!parent) return [];
  if (parent.type === "mechanism_archetype") return prototypesFor(parent.id);
  if (parent.type === "category_prototype") return variantsFor(parent.id);
  return [];
}

function matrixParentOptionLabel(node) {
  const childCount = matrixChildrenFor(node).length;
  const childLabel = node.type === "mechanism_archetype" ? "品类原型" : "游戏变体";
  return `${TYPE_LABELS[node.type]} · ${node.name}（${childCount} 个${childLabel}）`;
}

function matrixNodeHeadingMarkup(node) {
  if (node.type !== "category_variant") {
    return `<strong>${escapeHtml(node.name)}</strong>`;
  }

  const product = productsFor(node)[0] ?? null;
  const imageUrl = safeHttpUrl(product?.header_image_url);
  const fallback = (product?.name ?? node.name).slice(0, 2);

  return `
    <span class="matrix-game-heading">
      <span class="matrix-game-icon ${imageUrl ? "has-image" : "no-image"}" aria-hidden="true">
        <span>${escapeHtml(fallback)}</span>
        ${imageUrl ? `
          <img
            src="${escapeHtml(imageUrl)}"
            alt=""
            loading="lazy"
            referrerpolicy="no-referrer"
          >
        ` : ""}
      </span>
      <strong>${escapeHtml(node.name)}</strong>
    </span>
  `;
}

function syncMatrixParentOptions() {
  const candidates = matrixParentCandidates();
  if (!candidates.some((node) => node.id === state.libraryMatrixParentId)) {
    state.libraryMatrixParentId = candidates[0]?.id ?? null;
  }
  elements.matrixParentFilter.innerHTML = candidates.map((node) => `
    <option value="${escapeHtml(node.id)}">
      ${escapeHtml(matrixParentOptionLabel(node))}
    </option>
  `).join("");
  elements.matrixParentFilter.value = state.libraryMatrixParentId ?? "";
}

function renderFormulaMatrix() {
  const fields = state.libraryFieldFilter === "all"
    ? FORMULA_FIELDS
    : [state.libraryFieldFilter];
  syncMatrixParentOptions();
  const parent = libraryNodeById(state.libraryMatrixParentId);
  const children = matrixChildrenFor(parent);
  const focusedNode = state.libraryMatrixNodeFilter
    ? libraryNodeById(state.libraryMatrixNodeFilter)
    : null;

  elements.matrixNodeFocus.hidden = !focusedNode;
  elements.matrixNodeFocusName.textContent = focusedNode
    ? `${TYPE_LABELS[focusedNode.type]} · ${focusedNode.name}`
    : "";
  const childTypeLabel = parent?.type === "mechanism_archetype" ? "品类原型" : "游戏变体";
  elements.matrixScopeSummary.textContent = parent
    ? `当前父类型：${parent.name}；横向对照 ${children.length} 个直接${childTypeLabel}，纵向展示 ${fields.length} 个公式字段。`
    : "暂无可比较的父类型。";

  elements.formulaDataTable.innerHTML = `
    <thead>
      <tr>
        <th scope="col" class="matrix-field-column">
          <span>公式字段</span>
          <small>字段与含义</small>
        </th>
        ${parent ? `
          <th scope="col" class="matrix-parent-heading layer-${escapeHtml(parent.type)}">
            <span>${escapeHtml(TYPE_LABELS[parent.type])} · 父类型</span>
            <strong>${escapeHtml(parent.name)}</strong>
          </th>
        ` : ""}
        ${children.map((node) => `
          <th scope="col" class="matrix-child-heading layer-${escapeHtml(node.type)} ${focusedNode?.id === node.id ? "is-focused-node" : ""}">
            <span>${escapeHtml(TYPE_LABELS[node.type])}</span>
            ${matrixNodeHeadingMarkup(node)}
          </th>
        `).join("")}
        ${parent && !children.length ? `
          <th scope="col" class="matrix-empty-heading">
            <span>直接子类型</span>
            <strong>尚未建立</strong>
          </th>
        ` : ""}
      </tr>
    </thead>
    <tbody>
      ${fields.map((field) => `
        <tr data-matrix-field-row="${escapeHtml(field)}">
          <th scope="row" class="matrix-field-column">
            <code>${escapeHtml(formulaDisplayKey(field))}</code>
            <strong>${escapeHtml(FIELD_LABELS[field])}</strong>
          </th>
          ${parent ? matrixCellMarkup(parent, field, { isParent: true }) : ""}
          ${children.map((node) => matrixCellMarkup(node, field, {
            isFocused: focusedNode?.id === node.id
          })).join("")}
          ${parent && !children.length ? `
            <td class="matrix-empty-child-column">
              <span>该父类型下暂时没有直接子类型</span>
            </td>
          ` : ""}
        </tr>
      `).join("")}
    </tbody>
  `;

  elements.formulaDataTable.querySelectorAll("[data-edit-node][data-edit-field]").forEach((button) => {
    button.addEventListener("click", () => {
      openFieldEditor(button.dataset.editNode, button.dataset.editField);
    });
  });

  elements.formulaDataTable.querySelectorAll(".matrix-game-icon img").forEach((image) => {
    image.addEventListener("error", () => {
      image.closest(".matrix-game-icon")?.classList.add("image-failed");
      image.hidden = true;
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
    ? items.map((item) => {
      const evidenceImages = fieldEvidenceImages(item.entry);
      return `
        <article class="review-item layer-${escapeHtml(item.node.type)}">
          <button
            type="button"
            class="review-item-open"
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
          ${fieldEvidencePreviewMarkup(evidenceImages, {
            className: "review-field-evidence",
            limit: 4,
            label: `${item.node.name} · ${formulaDisplayKey(item.field)} 配图`
          })}
        </article>
      `;
    }).join("")
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
  state.selectedEcosystemMapPreset = `product:${productId}`;
  state.ecosystemMapFilters = { topology: null, color: null, secondary_badge: null };
  state.selectedEcosystemBdMode = "all";
  renderEcosystemWorkbench();
}

function selectEcosystemMapPreset(presetKey) {
  const config = state.data.ecosystemByPrototypeId.get(state.selectedEcosystemPrototypeId);
  if (!config?.niche_map) return;
  const riskId = presetKey.startsWith("risk:") ? presetKey.slice("risk:".length) : null;
  const isRisk = riskId
    && (config.four_layer_architecture?.boundaries ?? []).some((risk) => risk.id === riskId);
  const bdModeId = presetKey.startsWith("bd:") ? presetKey.slice("bd:".length) : null;
  const isBdMode = bdModeId
    && (config.bd_analysis?.modes ?? []).some((mode) => mode.id === bdModeId);
  state.selectedEcosystemMapPreset = config.niche_map.presets[presetKey] || isRisk || isBdMode
    ? presetKey
    : "all";
  state.ecosystemMapFilters = { topology: null, color: null, secondary_badge: null };
  state.selectedEcosystemBdMode = isBdMode ? bdModeId : "all";
  if (config.niche_map.presets[presetKey]?.kind === "BRANCH") {
    state.expandedEcosystemBranches = [
      ...new Set([...state.expandedEcosystemBranches, presetKey])
    ];
  }
  if (state.selectedEcosystemMapPreset === "all") {
    state.selectedEcosystemField = null;
  }
  renderEcosystemWorkbench();
}

function selectEcosystemBdMode(modeId) {
  const config = state.data.ecosystemByPrototypeId.get(state.selectedEcosystemPrototypeId);
  const validMode = modeId === "all"
    || (config?.bd_analysis?.modes ?? []).some((mode) => mode.id === modeId);
  state.selectedEcosystemBdMode = validMode ? modeId : "all";
  if (config?.niche_map) {
    state.selectedEcosystemMapPreset = state.selectedEcosystemBdMode === "all"
      ? "all"
      : `bd:${state.selectedEcosystemBdMode}`;
  }
  state.selectedEcosystemField = null;
  state.ecosystemMapFilters = { topology: null, color: null, secondary_badge: null };
  renderEcosystemWorkbench();
}

function selectEcosystemMapFilter(dimension, value) {
  const config = state.data.ecosystemByPrototypeId.get(state.selectedEcosystemPrototypeId);
  if (!config?.niche_map) return;
  const encoding = ecosystemNodeEncodings(config)[dimension];
  const validValues = new Set((encoding?.legend ?? Object.entries(encoding?.labels ?? {}))
    .map(([key]) => key));
  if (!encoding || !validValues.has(value)) return;

  const currentFilters = state.ecosystemMapFilters ?? {};
  state.ecosystemMapFilters = {
    topology: currentFilters.topology ?? null,
    color: currentFilters.color ?? null,
    secondary_badge: currentFilters.secondary_badge ?? null,
    [dimension]: currentFilters[dimension] === value ? null : value
  };
  state.selectedEcosystemMapPreset = "all";
  state.selectedEcosystemBdMode = "all";
  state.selectedEcosystemField = null;
  renderEcosystemWorkbench();
}

function clearEcosystemMapFilters() {
  state.ecosystemMapFilters = { topology: null, color: null, secondary_badge: null };
  state.selectedEcosystemMapPreset = "all";
  renderEcosystemWorkbench();
}

function toggleEcosystemBranch(branchId) {
  const config = state.data.ecosystemByPrototypeId.get(state.selectedEcosystemPrototypeId);
  if (config?.niche_map?.presets?.[branchId]?.kind !== "BRANCH") return;
  const expanded = new Set(state.expandedEcosystemBranches);
  if (expanded.has(branchId)) expanded.delete(branchId);
  else expanded.add(branchId);
  state.expandedEcosystemBranches = [...expanded];
  if (expanded.has(branchId)) {
    selectEcosystemMapPreset(branchId);
    return;
  }
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
        state.selectedEcosystemMapPreset = "all";
        state.ecosystemMapFilters = { topology: null, color: null, secondary_badge: null };
        state.selectedEcosystemBdMode = "all";
        state.expandedEcosystemBranches = config?.four_layer_architecture?.branch_ids?.slice(0, 1) ?? [];
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
        <header class="ecosystem-delta-card-head">
          <div>
            <code>${escapeHtml(formulaDisplayKey(field))}</code>
            <strong>
              ${escapeHtml(FIELD_LABELS[field])}
              <span>${escapeHtml(comparison.state.label)}</span>
            </strong>
          </div>
          <em class="ecosystem-review-status ${escapeHtml(comparison.reviewStatus)}">
            ${escapeHtml(REVIEW_STATUS_LABELS[comparison.reviewStatus] ?? "草稿")}
          </em>
        </header>
        <div class="ecosystem-delta-comparison">
          <small><b>基石</b>${escapeHtml(comparison.before)}</small>
          <small><b>当前</b>${escapeHtml(comparison.after)}</small>
        </div>
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
          <span class="ecosystem-kicker">08 · 值得关注的变体创新</span>
          <h3 id="ecosystem-innovations-title">记录具体游戏改了什么，以及为什么值得继续观察</h3>
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
          <span class="ecosystem-kicker">09 · 生态位假设</span>
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

function ecosystemClassToken(value = "pending") {
  return String(value).toLowerCase().replace(/[^a-z0-9-]+/g, "-");
}

const ECOSYSTEM_MAP_LABELS = {
  topology: {
    "2d-fixed": "固定 2D",
    "2d-split": "分区 2D",
    "2d-grow": "成长 2D",
    "1d": "1D 序列"
  },
  enemySpace: {
    external: "敌方盘外",
    fixed: "固定敌方区",
    shared: "敌方入盘",
    pending: "敌方位置待确认"
  },
  c1Mode: {
    formation: "阵容／邻接",
    payline: "支付线",
    hybrid: "混合协同"
  },
  pending: {
    defense: "防御状态",
    enemy_put: "敌方 Put",
    combat_relation: "战斗关系",
    single_axis_control: "单轴操作",
    c1_output: "C₁ 输出"
  }
};

function ecosystemNodeEncodings(config) {
  const configured = config?.niche_map?.node_encodings ?? {};
  return {
    topology: configured.topology ?? {
      title: "Show_TP",
      position_key: "topology",
      labels: ECOSYSTEM_MAP_LABELS.topology
    },
    color: configured.color ?? {
      title: "敌方空间",
      position_key: "enemy_space",
      labels: ECOSYSTEM_MAP_LABELS.enemySpace
    },
    secondary_badge: configured.secondary_badge ?? {
      title: "C₁",
      position_key: "c1_mode",
      labels: ECOSYSTEM_MAP_LABELS.c1Mode
    }
  };
}

function ecosystemNicheMapFocus(config) {
  const nicheMap = config.niche_map;
  const nodeEncodings = ecosystemNodeEncodings(config);
  const activeFilters = Object.entries(state.ecosystemMapFilters ?? {})
    .filter(([dimension, value]) => value && nodeEncodings[dimension]);

  if (activeFilters.length) {
    const matchingPositions = config.positions.filter((position) => activeFilters.every(
      ([dimension, value]) => position[nodeEncodings[dimension].position_key] === value
    ));
    const productIds = new Set(matchingPositions.map((position) => position.product_id));
    const edgeIds = new Set();
    const anchorIds = new Set();
    nicheMap.edges.forEach((edge) => {
      const productEndpoints = [edge.from, edge.to]
        .filter((endpoint) => endpoint.startsWith("product."));
      if (!productEndpoints.length || !productEndpoints.every((endpoint) => productIds.has(endpoint))) return;
      edgeIds.add(edge.id);
      [edge.from, edge.to].forEach((endpoint) => {
        if (endpoint.startsWith("anchor:")) anchorIds.add(endpoint.slice("anchor:".length));
      });
    });
    const zoneIds = new Set(
      matchingPositions.flatMap((position) => position.branch_ids ?? [])
        .filter((branchId) => nicheMap.zones.some((zone) => zone.id === branchId))
    );
    const filterLabels = activeFilters.map(([dimension, value]) => {
      const encoding = nodeEncodings[dimension];
      return {
        dimension,
        value,
        title: encoding.title,
        label: encoding.labels?.[value] ?? value
      };
    });
    return {
      key: `filter:${filterLabels.map((item) => `${item.dimension}=${item.value}`).join("|")}`,
      kind: "FILTER",
      label: `匹配 ${productIds.size} / ${config.positions.length} 款`,
      title: filterLabels.map((item) => item.label).join(" × "),
      summary: `同时满足${filterLabels.map((item) => `${item.title}“${item.label}”`).join("、")}的游戏变体。`,
      boundary: "筛选只改变聚焦状态；未匹配节点仍保留在原位置，便于观察它们与当前结果的生态关系。",
      fields: filterLabels.map((item) => ({
        topology: "Show_TP",
        color: "C2",
        secondary_badge: "C1"
      })[item.dimension]).filter(Boolean),
      productIds,
      edgeIds,
      zoneIds,
      anchorIds,
      activeFilters: filterLabels,
      isFilter: true,
      isAll: false
    };
  }

  const requestedKey = state.selectedEcosystemMapPreset ?? "all";
  const riskId = requestedKey.startsWith("risk:")
    ? requestedKey.slice("risk:".length)
    : null;
  const risk = riskId
    ? (config.four_layer_architecture?.boundaries ?? []).find((item) => item.id === riskId)
    : null;
  const productId = requestedKey.startsWith("product:")
    ? requestedKey.slice("product:".length)
    : null;
  const bdModeId = requestedKey.startsWith("bd:")
    ? requestedKey.slice("bd:".length)
    : null;
  const bdMode = bdModeId
    ? (config.bd_analysis?.modes ?? []).find((item) => item.id === bdModeId)
    : null;

  if (bdMode) {
    const matchingCases = (config.bd_analysis?.cases ?? [])
      .filter((item) => (item.mode_ids ?? []).includes(bdMode.id));
    const productIds = new Set(matchingCases.map((item) => item.product_id));
    const edgeIds = new Set(
      nicheMap.edges
        .filter((edge) => productIds.has(edge.from) || productIds.has(edge.to))
        .map((edge) => edge.id)
    );
    const zoneIds = new Set();
    const anchorIds = new Set();
    matchingCases.forEach((item) => {
      const position = ecosystemPosition(config, item.product_id);
      (position?.branch_ids ?? []).forEach((branchId) => {
        if (nicheMap.zones.some((zone) => zone.id === branchId)) zoneIds.add(branchId);
      });
    });
    nicheMap.edges
      .filter((edge) => edgeIds.has(edge.id))
      .forEach((edge) => {
        [edge.from, edge.to].forEach((endpoint) => {
          if (endpoint.startsWith("anchor:")) anchorIds.add(endpoint.slice("anchor:".length));
        });
      });
    return {
      key: requestedKey,
      kind: "BD",
      label: bdMode.label,
      title: bdMode.title,
      summary: bdMode.description,
      boundary: bdMode.boundary,
      fields: bdMode.fields ?? [],
      productIds,
      edgeIds,
      zoneIds,
      anchorIds,
      isAll: false
    };
  }

  if (risk) {
    const productIds = new Set(risk.product_ids ?? []);
    const branchIds = new Set(risk.branch_ids ?? []);
    const edgeIds = new Set();
    const anchorIds = new Set();
    nicheMap.edges.forEach((edge) => {
      if (!branchIds.has(edge.branch)) return;
      const endpoints = [edge.from, edge.to];
      const productEndpoints = endpoints.filter((endpoint) => endpoint.startsWith("product."));
      const connectsRiskCases = productEndpoints.length
        ? productEndpoints.every((endpoint) => productIds.has(endpoint))
        : false;
      const connectsCoreToRisk = endpoints.some((endpoint) => endpoint.startsWith("anchor:"))
        && productEndpoints.some((endpoint) => productIds.has(endpoint));
      if (!connectsRiskCases && !connectsCoreToRisk) return;
      edgeIds.add(edge.id);
      endpoints.forEach((endpoint) => {
        if (endpoint.startsWith("anchor:")) anchorIds.add(endpoint.slice("anchor:".length));
      });
    });
    const zoneIds = new Set(
      [...branchIds].flatMap((branchId) => nicheMap.presets[branchId]?.zones ?? [])
    );
    return {
      key: requestedKey,
      kind: "BOUNDARY",
      label: risk.label,
      title: risk.title,
      summary: `${risk.trigger} ${risk.consequence}`,
      boundary: `应对方向：${risk.mitigation}`,
      fields: risk.fields ?? [],
      productIds,
      edgeIds,
      zoneIds,
      anchorIds,
      isAll: false
    };
  }

  if (productId) {
    const product = state.data.productById.get(productId);
    const position = ecosystemPosition(config, productId);
    if (product && position) {
      const incidentEdges = nicheMap.edges
        .filter((edge) => edge.from === productId || edge.to === productId)
        .map((edge) => edge.id);
      const zoneIds = (position.branch_ids ?? [])
        .filter((branchId) => nicheMap.zones.some((zone) => zone.id === branchId));
      const pendingDimensions = (position.pending_dimensions ?? [])
        .map((key) => ECOSYSTEM_MAP_LABELS.pending[key] ?? key);
      return {
        key: requestedKey,
        kind: "CASE",
        label: "游戏变体",
        title: product.name,
        summary: position.position_note,
        boundary: pendingDimensions.length
          ? `待确认维度：${pendingDimensions.join("、")}。其余坐标与编码也仍是第一版分析草稿。`
          : "坐标与视觉编码来自当前字段资料，仍作为第一版分析草稿等待逐点确认。",
        fields: position.changed_fields ?? [],
        productIds: new Set([productId]),
        edgeIds: new Set(incidentEdges),
        zoneIds: new Set(zoneIds),
        anchorIds: new Set(),
        isAll: false
      };
    }
  }

  const preset = nicheMap.presets[requestedKey] ?? nicheMap.presets.all;
  const key = nicheMap.presets[requestedKey] ? requestedKey : "all";
  if (key !== requestedKey) state.selectedEcosystemMapPreset = key;
  const isAll = key === "all";
  const edgeIds = new Set(isAll ? nicheMap.edges.map((edge) => edge.id) : (preset.edges ?? []));
  const productIds = new Set(isAll ? config.positions.map((position) => position.product_id) : (preset.products ?? []));
  const anchorIds = new Set(isAll ? nicheMap.anchors.map((anchor) => anchor.id) : (preset.anchors ?? []));

  if (!isAll) {
    nicheMap.edges
      .filter((edge) => edgeIds.has(edge.id))
      .forEach((edge) => {
        [edge.from, edge.to].forEach((endpoint) => {
          if (endpoint.startsWith("product.")) productIds.add(endpoint);
          if (endpoint.startsWith("anchor:")) anchorIds.add(endpoint.slice("anchor:".length));
        });
      });
  }

  return {
    key,
    kind: preset.kind,
    label: preset.label,
    title: preset.title,
    summary: preset.summary,
    boundary: preset.boundary,
    fields: preset.fields ?? [],
    productIds,
    edgeIds,
    zoneIds: new Set(isAll ? nicheMap.zones.map((zone) => zone.id) : (preset.zones ?? [])),
    anchorIds,
    isAll
  };
}

function ecosystemNicheMapMarkup(config, prototype, products, positionedProducts, unpositioned) {
  const nicheMap = config.niche_map;
  const focus = ecosystemNicheMapFocus(config);
  const infoCollapsed = state.ecosystemNicheInfoCollapsed;
  const nodeEncodings = ecosystemNodeEncodings(config);
  const topologyEncoding = nodeEncodings.topology;
  const colorEncoding = nodeEncodings.color;
  const secondaryEncoding = nodeEncodings.secondary_badge;
  const topologyLegend = topologyEncoding.legend ?? Object.entries(topologyEncoding.labels ?? {});
  const colorLegend = colorEncoding.legend ?? Object.entries(colorEncoding.labels ?? {});
  const secondaryLegend = secondaryEncoding.legend ?? Object.entries(secondaryEncoding.labels ?? {});
  const activeFilterMap = new Map((focus.activeFilters ?? []).map((item) => [item.dimension, item.value]));
  const coordinateById = new Map();
  nicheMap.anchors.forEach((anchor) => coordinateById.set(`anchor:${anchor.id}`, anchor));
  positionedProducts.forEach(({ product, position }) => coordinateById.set(product.id, position));
  const presetEntries = Object.entries(nicheMap.presets);

  return `
    <section class="ecosystem-panel ecosystem-niche-map" aria-labelledby="ecosystem-niche-map-title">
      <div class="ecosystem-panel-head ecosystem-niche-map-head">
        <div>
          <span class="ecosystem-kicker">04 · ECOSYSTEM NICHE MAP</span>
          <h3 id="ecosystem-niche-map-title">品类原型生态位图 · 第一版</h3>
        </div>
        <p>切换分析镜头只改变聚焦；点击图中空白处返回全部生态</p>
      </div>
      <div class="ecosystem-niche-map-presets" role="toolbar" aria-label="生态位图分析镜头">
        ${presetEntries.map(([key, preset]) => `
          <button type="button"
            class="is-${escapeHtml(ecosystemClassToken(preset.kind))} ${focus.key === key ? "is-active" : ""}"
            data-ecosystem-map-preset="${escapeHtml(key)}"
            aria-pressed="${focus.key === key}">
            <small>${escapeHtml(preset.kind)}</small>
            <span>${escapeHtml(preset.label)}</span>
          </button>
        `).join("")}
      </div>
      <div class="ecosystem-niche-product-nav" aria-label="生态位图游戏变体">
        ${products.map((product) => {
          const isProductSelection = focus.key === `product:${product.id}`;
          const isFilterSelection = !focus.isAll && !focus.key.startsWith("product:");
          const isFilterMatch = isFilterSelection && focus.productIds.has(product.id);
          return `
            <button type="button"
              class="${isProductSelection ? "is-active" : ""} ${isFilterMatch ? "is-filter-match" : ""} ${isFilterSelection && !isFilterMatch ? "is-filter-context" : ""}"
              data-ecosystem-product="${escapeHtml(product.id)}"
              aria-pressed="${isProductSelection}"
              aria-label="${escapeHtml(product.name)}${isFilterMatch ? `，属于当前筛选：${focus.label}` : ""}">
              ${ecosystemProductIcon(product)}
              <span>${escapeHtml(product.name)}</span>
              ${isFilterMatch ? `<i aria-hidden="true">${escapeHtml(focus.label)}</i>` : ""}
            </button>
          `;
        }).join("")}
      </div>
      <div class="ecosystem-niche-map-layout ${infoCollapsed ? "is-info-collapsed" : ""}">
        <div class="ecosystem-niche-map-scroll">
          <div class="ecosystem-niche-map-plot ${focus.isAll ? "is-all" : "has-focus"}"
            aria-label="${escapeHtml(prototype.name)}生态位图：横轴${escapeHtml(config.axes.x.label)}，纵轴${escapeHtml(config.axes.y.label)}；点击空白处返回全部生态"
            title="点击图中空白处返回全部生态">
            <div class="ecosystem-niche-axis x">
              <b>${escapeHtml(config.axes.x.label)}</b>
              <span><i>${escapeHtml(config.axes.x.low)}</i><i>${escapeHtml(config.axes.x.high)}</i></span>
            </div>
            <div class="ecosystem-niche-axis y">
              <b>${escapeHtml(config.axes.y.label)}</b>
              <span><i>${escapeHtml(config.axes.y.high)}</i><i>${escapeHtml(config.axes.y.low)}</i></span>
            </div>
            ${nicheMap.zones.map((zone) => {
              const isFocused = focus.isAll || focus.zoneIds.has(zone.id);
              return `
                <span class="ecosystem-model-zone tone-${escapeHtml(ecosystemClassToken(zone.tone))} ${isFocused ? "is-focused" : "is-dimmed"} ${zone.status === "hypothesis" ? "is-hypothesis" : ""}"
                  style="--x:${zone.x};--y:${zone.y};--w:${zone.width};--h:${zone.height}"
                  data-model-zone="${escapeHtml(zone.id)}"
                  title="${escapeHtml(zone.description)}">
                  <b>${escapeHtml(zone.label)}</b>
                  <small>${escapeHtml(zone.description)}</small>
                </span>
              `;
            }).join("")}
            ${nicheMap.edges.map((edge) => {
              const from = coordinateById.get(edge.from);
              const to = coordinateById.get(edge.to);
              if (!from || !to) return "";
              const isFocused = focus.isAll || focus.edgeIds.has(edge.id);
              const showLabel = !focus.isAll && focus.edgeIds.has(edge.id);
              const branchLabel = nicheMap.presets[edge.branch]?.label ?? edge.branch;
              return `
                <span class="ecosystem-model-edge ${isFocused ? "is-focused" : "is-dimmed"}"
                  data-model-edge="${escapeHtml(edge.id)}"
                  data-model-from="${escapeHtml(edge.from)}"
                  data-model-to="${escapeHtml(edge.to)}"
                  data-x1="${from.x}" data-y1="${from.y}" data-x2="${to.x}" data-y2="${to.y}">
                </span>
                ${showLabel ? `
                  <span class="ecosystem-model-edge-label"
                    style="--x:${(from.x + to.x) / 2};--y:${(from.y + to.y) / 2}"
                    data-model-edge-label="${escapeHtml(edge.id)}">
                    <i aria-hidden="true">→</i>${escapeHtml(branchLabel)}
                  </span>
                ` : ""}
              `;
            }).join("")}
            ${nicheMap.anchors.map((anchor) => {
              const isFocused = focus.isAll || focus.anchorIds.has(anchor.id);
              return `
                <button type="button"
                  class="ecosystem-model-anchor ${isFocused ? "is-focused" : "is-dimmed"}"
                  style="--x:${anchor.x};--y:${anchor.y}"
                  data-ecosystem-map-preset="core"
                  aria-label="聚焦原型核心：${escapeHtml(anchor.summary)}">
                  <small>CORE</small><strong>${escapeHtml(anchor.label)}</strong>
                </button>
              `;
            }).join("")}
            ${positionedProducts.map(({ product, position }) => {
              const isFocused = focus.isAll || focus.productIds.has(product.id);
              const topology = position[topologyEncoding.position_key] ?? "pending";
              const colorValue = position[colorEncoding.position_key] ?? "pending";
              const secondaryValue = position[secondaryEncoding.position_key] ?? "formation";
              const topologyLabel = topologyEncoding.labels?.[topology] ?? topology;
              const colorLabel = colorEncoding.labels?.[colorValue] ?? colorValue;
              const secondaryLabel = secondaryEncoding.labels?.[secondaryValue] ?? secondaryValue;
              return `
                <button type="button"
                  class="ecosystem-model-node topology-${escapeHtml(ecosystemClassToken(topology))} enemy-${escapeHtml(ecosystemClassToken(colorValue))} c1-${escapeHtml(ecosystemClassToken(secondaryValue))} ${position.role === "cornerstone" ? "is-cornerstone" : ""} ${position.status === "confirmed" ? "is-confirmed" : "is-draft"} ${isFocused ? "is-focused" : "is-dimmed"} ${focus.key === `product:${product.id}` ? "is-active" : ""}"
                  style="--x:${position.x};--y:${position.y}"
                  data-model-node="${escapeHtml(product.id)}"
                  data-ecosystem-product="${escapeHtml(product.id)}"
                  aria-label="${escapeHtml(product.name)}，${escapeHtml(topologyEncoding.title)}：${escapeHtml(topologyLabel)}，${escapeHtml(colorEncoding.title)}：${escapeHtml(colorLabel)}，${escapeHtml(secondaryEncoding.title)}：${escapeHtml(secondaryLabel)}"
                  aria-pressed="${focus.key === `product:${product.id}`}">
                  <span class="ecosystem-node-badges" aria-hidden="true">
                    <i class="ecosystem-node-badge is-topology badge-topology-${escapeHtml(ecosystemClassToken(topology))}" title="${escapeHtml(topologyEncoding.title)} · ${escapeHtml(topologyLabel)}">${escapeHtml(topologyLabel)}</i>
                    <i class="ecosystem-node-badge is-c1 badge-c1-${escapeHtml(ecosystemClassToken(secondaryValue))}" title="${escapeHtml(secondaryEncoding.title)} · ${escapeHtml(secondaryLabel)}">${escapeHtml(secondaryLabel)}</i>
                  </span>
                  ${ecosystemProductIcon(product)}
                  <span class="ecosystem-model-node-copy"><strong>${escapeHtml(product.name)}</strong></span>
                </button>
              `;
            }).join("")}
            ${positionedProducts
              .filter(({ position }) => (position.pending_dimensions ?? []).length)
              .map(({ product, position }) => {
                const pendingLabels = position.pending_dimensions
                  .map((key) => ECOSYSTEM_MAP_LABELS.pending[key] ?? key);
                const tooltip = `待确认：${pendingLabels.join("、")}`;
                const isFocused = focus.isAll || focus.productIds.has(product.id);
                return `
                  <button type="button"
                    class="ecosystem-model-pending ${position.y > 82 ? "tooltip-below" : ""} ${isFocused ? "is-focused" : "is-dimmed"} ${focus.key === `product:${product.id}` ? "is-active" : ""}"
                    style="--x:${position.x};--y:${position.y}"
                    data-ecosystem-product="${escapeHtml(product.id)}"
                    data-tooltip="${escapeHtml(tooltip)}"
                    aria-label="选择${escapeHtml(product.name)}并查看${escapeHtml(tooltip)}"
                    aria-pressed="${focus.key === `product:${product.id}`}">?</button>
                `;
              }).join("")}
          </div>
        </div>
        <aside class="ecosystem-niche-map-info ${infoCollapsed ? "is-collapsed" : ""}"
          aria-label="当前生态位分析说明">
          <button type="button" class="ecosystem-niche-info-toggle"
            data-ecosystem-info-toggle
            aria-expanded="${!infoCollapsed}"
            aria-controls="ecosystem-niche-map-info-content"
            title="${infoCollapsed ? "展开右侧说明" : "收起右侧说明"}">
            <i aria-hidden="true">${infoCollapsed ? "‹" : "›"}</i>
            <span>${infoCollapsed ? "展开说明" : "收起说明"}</span>
          </button>
          <div class="ecosystem-niche-map-info-content" id="ecosystem-niche-map-info-content"
            aria-live="polite" ${infoCollapsed ? "hidden" : ""}>
            <header><span>${escapeHtml(focus.kind)}</span><small>${escapeHtml(focus.label)}</small></header>
            <h4>${escapeHtml(focus.title)}</h4>
            <p>${escapeHtml(focus.summary)}</p>
            <div><b>分析边界</b><span>${escapeHtml(focus.boundary)}</span></div>
            <footer>
              <b>证据字段</b>
              <span>${focus.fields.length
                ? focus.fields.map((field) => `<code>${escapeHtml(formulaDisplayKey(field))}</code>`).join("")
                : "全部字段共同观察"}</span>
            </footer>
          </div>
        </aside>
      </div>
      <div class="ecosystem-niche-map-legend" aria-label="生态位图筛选与视觉编码图例">
        <div role="group" aria-label="按 ${escapeHtml(topologyEncoding.title)} 筛选">
          <b>右上角标 · ${escapeHtml(topologyEncoding.title)}</b>
          ${topologyLegend.map(([value, label]) => {
            const active = activeFilterMap.get("topology") === value;
            return `<button type="button" class="legend-badge badge-topology-${escapeHtml(ecosystemClassToken(value))} ${active ? "is-active" : ""}" data-ecosystem-map-filter-dimension="topology" data-ecosystem-map-filter-value="${escapeHtml(value)}" aria-pressed="${active}">${escapeHtml(label)}</button>`;
          }).join("")}
        </div>
        <div role="group" aria-label="按 ${escapeHtml(colorEncoding.title)} 筛选">
          <b>颜色 · ${escapeHtml(colorEncoding.title)}</b>
          ${colorLegend.map(([value, label]) => {
            const active = activeFilterMap.get("color") === value;
            return `<button type="button" class="enemy-${escapeHtml(ecosystemClassToken(value))} ${active ? "is-active" : ""}" data-ecosystem-map-filter-dimension="color" data-ecosystem-map-filter-value="${escapeHtml(value)}" aria-pressed="${active}">${escapeHtml(label)}</button>`;
          }).join("")}
        </div>
        <div role="group" aria-label="按 ${escapeHtml(secondaryEncoding.title)} 筛选">
          <b>右上角标 · ${escapeHtml(secondaryEncoding.title)}</b>
          ${secondaryLegend.map(([value, label]) => {
            const active = activeFilterMap.get("secondary_badge") === value;
            return `<button type="button" class="legend-badge badge-c1-${escapeHtml(ecosystemClassToken(value))} ${active ? "is-active" : ""}" data-ecosystem-map-filter-dimension="secondary_badge" data-ecosystem-map-filter-value="${escapeHtml(value)}" aria-pressed="${active}">${escapeHtml(label)}</button>`;
          }).join("")}
        </div>
        <div class="ecosystem-map-filter-status" aria-live="polite">
          ${focus.isFilter
            ? `<strong>已筛选 ${focus.productIds.size} / ${positionedProducts.length} 款</strong><span>${focus.activeFilters.map((item) => escapeHtml(item.label)).join(" · ")}</span><button type="button" data-ecosystem-map-filter-clear>清除筛选</button>`
            : `<span>点击标签筛选上方生态图；跨维度组合时，只强调同时满足的游戏。</span>`}
        </div>
        <p>每个节点右上角依次显示 ${escapeHtml(topologyEncoding.title)} 与 ${escapeHtml(secondaryEncoding.title)} 角标，文字和颜色共同区分类别。箭头表示同一改动分支中的案例展开路径，聚焦时在线上显示分支名；不表示产品继承、时间先后或优劣。问号表示存在待确认维度，可悬停或点击查看。节点大小暂不代表销量。</p>
      </div>
      ${unpositioned.length ? `
        <p class="ecosystem-unpositioned"><strong>已归类、待定位：</strong>${unpositioned.map((product) => escapeHtml(product.name)).join(" · ")}</p>
      ` : ""}
    </section>
  `;
}

function ecosystemFourLayerArchitectureMarkup(config, prototype) {
  const architecture = config.four_layer_architecture;
  const nicheMap = config.niche_map;
  if (!architecture || !nicheMap) return "";

  const core = nicheMap.presets[architecture.core_preset_id ?? "core"];
  const branchEntries = (architecture.branch_ids ?? [])
    .map((branchId) => [branchId, nicheMap.presets[branchId]])
    .filter(([, branch]) => branch?.kind === "BRANCH");
  const expandedBranches = new Set(state.expandedEcosystemBranches);
  const risks = architecture.boundaries ?? [];

  const fieldChips = (fields = []) => fields.map((field) =>
    `<code>${escapeHtml(formulaDisplayKey(field))}</code>`
  ).join("");

  return `
    <section class="ecosystem-four-layer" aria-labelledby="ecosystem-four-layer-title">
      <div class="ecosystem-panel-head ecosystem-four-layer-head">
        <div>
          <span class="ecosystem-kicker">06 · FOUR-LAYER EVIDENCE ARCHITECTURE</span>
          <h3 id="ecosystem-four-layer-title">CORE → BRANCH → CASE → BOUNDARY</h3>
        </div>
        <p>分支负责组织变化方向，案例与字段描述负责提供证据，边界风险独立判断。</p>
      </div>

      <div class="ecosystem-layer-core">
        <button type="button"
          class="${state.selectedEcosystemMapPreset === (architecture.core_preset_id ?? "core") ? "is-active" : ""}"
          data-ecosystem-map-preset="${escapeHtml(architecture.core_preset_id ?? "core")}"
          aria-pressed="${state.selectedEcosystemMapPreset === (architecture.core_preset_id ?? "core")}">
          <span class="ecosystem-layer-index">01 · CORE</span>
          <strong>${escapeHtml(core?.title ?? prototype.name)}</strong>
          <p>${escapeHtml(core?.summary ?? config.analysis_basis?.inheritance_summary ?? "")}</p>
          <span class="ecosystem-layer-fields">${fieldChips(core?.fields ?? [])}</span>
        </button>
        <small>${escapeHtml(core?.boundary ?? "CORE 只定义品类不可缺失的共同身份。")}</small>
      </div>

      <div class="ecosystem-layer-connector" aria-hidden="true"><i></i><span>分化为可比较的改动方向</span></div>

      <div class="ecosystem-layer-branches">
        <header>
          <span class="ecosystem-layer-index">02 · BRANCH</span>
          <div>
            <strong>${branchEntries.length} 条改动分支</strong>
            <p>展开分支查看代表 CASE 与公式字段证据；分支之间允许交叉。</p>
          </div>
        </header>
        <div class="ecosystem-branch-accordion">
          ${branchEntries.map(([branchId, branch], index) => {
            const expanded = expandedBranches.has(branchId);
            const active = state.selectedEcosystemMapPreset === branchId;
            const cases = (branch.products ?? [])
              .map((productId) => ({
                product: state.data.productById.get(productId),
                position: ecosystemPosition(config, productId)
              }))
              .filter(({ product }) => product);
            return `
              <article class="ecosystem-branch-item ${expanded ? "is-expanded" : ""} ${active ? "is-active" : ""}">
                <button type="button" class="ecosystem-branch-toggle"
                  data-ecosystem-branch-toggle="${escapeHtml(branchId)}"
                  aria-expanded="${expanded}"
                  aria-controls="ecosystem-branch-cases-${escapeHtml(branchId)}">
                  <span class="ecosystem-branch-number">B${String(index + 1).padStart(2, "0")}</span>
                  <span class="ecosystem-branch-copy">
                    <small>${escapeHtml(branch.label)}</small>
                    <strong>${escapeHtml(branch.title)}</strong>
                    <i>${escapeHtml(branch.summary)}</i>
                  </span>
                  <span class="ecosystem-branch-meta">
                    <b>${cases.length} CASE</b>
                    <span>${fieldChips(branch.fields ?? [])}</span>
                  </span>
                  <em aria-hidden="true">${expanded ? "−" : "+"}</em>
                </button>
                <div class="ecosystem-branch-cases" id="ecosystem-branch-cases-${escapeHtml(branchId)}" ${expanded ? "" : "hidden"}>
                  <div class="ecosystem-case-layer-label">
                    <span class="ecosystem-layer-index">03 · CASE</span>
                    <p>${escapeHtml(architecture.case_evidence_policy)}</p>
                  </div>
                  <div class="ecosystem-case-grid">
                    ${cases.map(({ product, position }) => {
                      const productActive = state.selectedEcosystemProductId === product.id;
                      const evidenceFields = branch.fields ?? [];
                      return `
                        <article class="ecosystem-case-card ${productActive ? "is-active" : ""}">
                          <header>
                            <button type="button" data-ecosystem-product="${escapeHtml(product.id)}"
                              aria-label="查看 ${escapeHtml(product.name)} 的全部产品定位证据">
                              ${ecosystemProductIcon(product)}
                              <span><small>CASE</small><strong>${escapeHtml(product.name)}</strong></span>
                            </button>
                            <b>${position?.role === "cornerstone" ? "基石" : `${evidenceFields.length} 字段`}</b>
                          </header>
                          <p>${escapeHtml(position?.position_note ?? "该案例已进入分支，位置说明待补充。")}</p>
                          <div class="ecosystem-case-evidence" aria-label="${escapeHtml(product.name)}的字段证据">
                            ${evidenceFields.map((field) => {
                              const comparison = ecosystemFieldComparison(config, product, field);
                              return `
                                <button type="button"
                                  class="is-${escapeHtml(comparison.state.className)}"
                                  data-ecosystem-product="${escapeHtml(product.id)}"
                                  data-ecosystem-field="${escapeHtml(field)}"
                                  aria-label="查看 ${escapeHtml(product.name)} 的 ${escapeHtml(formulaDisplayKey(field))} 字段证据">
                                  <span>
                                    <code>${escapeHtml(formulaDisplayKey(field))}</code>
                                    <small>${escapeHtml(comparison.state.label)} · ${escapeHtml(REVIEW_STATUS_LABELS[comparison.reviewStatus] ?? "草稿")}</small>
                                  </span>
                                  <p>${escapeHtml(comparison.after)}</p>
                                </button>
                              `;
                            }).join("")}
                          </div>
                        </article>
                      `;
                    }).join("")}
                  </div>
                  <p class="ecosystem-branch-boundary"><b>分支边界</b>${escapeHtml(branch.boundary)}</p>
                </div>
              </article>
            `;
          }).join("")}
        </div>
      </div>

      <div class="ecosystem-layer-connector is-boundary" aria-hidden="true"><i></i><span>跨分支检查组合风险</span></div>

      <div class="ecosystem-layer-boundaries">
        <header>
          <span class="ecosystem-layer-index">04 · BOUNDARY</span>
          <div>
            <strong>四类独立风险</strong>
            <p>风险不是游戏优劣结论；点击任一风险，会在上方生态位图同步聚焦对应案例。</p>
          </div>
        </header>
        <div class="ecosystem-boundary-grid">
          ${risks.map((risk, index) => {
            const focusKey = `risk:${risk.id}`;
            const active = state.selectedEcosystemMapPreset === focusKey;
            return `
              <article class="ecosystem-boundary-card risk-${index + 1} ${active ? "is-active" : ""}">
                <button type="button" class="ecosystem-boundary-focus"
                  data-ecosystem-map-preset="${escapeHtml(focusKey)}"
                  aria-pressed="${active}">
                  <span><small>RISK ${String(index + 1).padStart(2, "0")}</small><b>${escapeHtml(risk.label)}</b></span>
                  <strong>${escapeHtml(risk.title)}</strong>
                </button>
                <dl>
                  <div><dt>触发</dt><dd>${escapeHtml(risk.trigger)}</dd></div>
                  <div><dt>后果</dt><dd>${escapeHtml(risk.consequence)}</dd></div>
                  <div><dt>应对</dt><dd>${escapeHtml(risk.mitigation)}</dd></div>
                </dl>
                <div class="ecosystem-boundary-evidence">
                  <span>${(risk.product_ids ?? []).map((productId) => {
                    const product = state.data.productById.get(productId);
                    if (!product) return "";
                    return `<button type="button" data-ecosystem-product="${escapeHtml(product.id)}">${escapeHtml(product.name)}</button>`;
                  }).join("")}</span>
                  <span>${fieldChips(risk.fields ?? [])}</span>
                </div>
              </article>
            `;
          }).join("")}
        </div>
      </div>
    </section>
  `;
}

function ecosystemBdAnalysisMarkup(config) {
  const analysis = config.bd_analysis;
  if (!analysis) return "";

  const modes = analysis.modes ?? [];
  const cases = analysis.cases ?? [];
  const modeById = new Map(modes.map((mode) => [mode.id, mode]));
  const requestedMode = state.selectedEcosystemBdMode ?? "all";
  const selectedMode = requestedMode === "all" || modeById.has(requestedMode)
    ? requestedMode
    : "all";
  const statusLabels = { confirmed: "已确认", draft: "草稿", pending: "待确认" };

  const modeButton = (mode, count) => {
    const active = selectedMode === mode.id;
    return `
      <button type="button"
        class="ecosystem-bd-mode tone-${escapeHtml(ecosystemClassToken(mode.kind))} ${active ? "is-active" : ""}"
        data-ecosystem-bd-mode="${escapeHtml(mode.id)}"
        aria-pressed="${active}">
        <span><small>${escapeHtml(mode.kind)}</small><b>${escapeHtml(mode.label)}</b><i>${count} CASE</i></span>
        <strong>${escapeHtml(mode.title)}</strong>
        <p>${escapeHtml(mode.description)}</p>
        <em>${escapeHtml(mode.boundary)}</em>
        <span class="ecosystem-bd-fields">${(mode.fields ?? []).map((field) => `<code>${escapeHtml(formulaDisplayKey(field))}</code>`).join("")}</span>
      </button>
    `;
  };

  return `
    <section class="ecosystem-bd-analysis" aria-labelledby="ecosystem-bd-analysis-title">
      <div class="ecosystem-panel-head ecosystem-bd-analysis-head">
        <div>
          <span class="ecosystem-kicker">07 · BD DESIGN ANALYSIS</span>
          <h3 id="ecosystem-bd-analysis-title">BD 实现谱系：同一 CORE，不同品质构筑路径</h3>
        </div>
        <p>点击路径只聚焦匹配案例，不隐藏其余样本；字段证据可继续进入产品定位详情。</p>
      </div>

      <div class="ecosystem-bd-formula">
        <span>分析公式</span>
        <strong>${escapeHtml(analysis.formula)}</strong>
        <p>${escapeHtml(analysis.principle)}</p>
      </div>

      ${analysis.control_model ? `
        <div class="ecosystem-bd-control-model">
          <header>
            <div><small>QUALITY CONTROL GATE</small><strong>${escapeHtml(analysis.control_model.formula)}</strong></div>
            <p>${escapeHtml(analysis.control_model.scope_note)}</p>
          </header>
          <div class="ecosystem-bd-control-grid">
            ${(analysis.control_model.cells ?? []).map((cell) => `
              <article class="tone-${escapeHtml(ecosystemClassToken(cell.tone))}">
                <span><small>Show_TP ${escapeHtml(cell.show_tp)}</small><i>×</i><small>有效池 ${escapeHtml(cell.pool)}</small></span>
                <strong>${escapeHtml(cell.value)}</strong>
                <p>${escapeHtml(cell.recommendation)}</p>
              </article>
            `).join("")}
          </div>
        </div>
      ` : ""}

      <div class="ecosystem-bd-mode-grid" role="toolbar" aria-label="BD 实现路径筛选">
        <button type="button"
          class="ecosystem-bd-mode is-all ${selectedMode === "all" ? "is-active" : ""}"
          data-ecosystem-bd-mode="all"
          aria-pressed="${selectedMode === "all"}">
          <span><small>ALL</small><b>全部路径</b><i>${cases.length} CASE</i></span>
          <strong>保持完整 BD 生态</strong>
          <p>${escapeHtml(analysis.conclusion)}</p>
          <em>同一产品可以同时属于多条路径；主路径只表示当前最能解释其 BD 特征的实现。</em>
        </button>
        ${modes.map((mode) => modeButton(
          mode,
          cases.filter((item) => (item.mode_ids ?? []).includes(mode.id)).length
        )).join("")}
      </div>

      <div class="ecosystem-bd-case-list">
        ${cases.map((item) => {
          const product = state.data.productById.get(item.product_id);
          if (!product) return "";
          const matches = selectedMode === "all" || (item.mode_ids ?? []).includes(selectedMode);
          const dominantMode = modeById.get(item.dominant_mode_id);
          const observation = state.data.productObservationById.get(product.id);
          return `
            <article class="ecosystem-bd-case ${matches ? "is-match" : "is-context"} ${state.selectedEcosystemProductId === product.id ? "is-selected" : ""}">
              <header>
                <button type="button" data-ecosystem-product="${escapeHtml(product.id)}">
                  ${ecosystemProductIcon(product)}
                  <span><small>CASE</small><strong>${escapeHtml(product.name)}</strong></span>
                </button>
                <span class="ecosystem-bd-case-status is-${escapeHtml(item.status)}">${escapeHtml(statusLabels[item.status] ?? "草稿")}</span>
              </header>
              <div class="ecosystem-bd-case-route">
                <span>当前主路径</span>
                <strong>${escapeHtml(dominantMode?.label ?? "待拆解")}</strong>
                <div>${(item.mode_ids ?? []).map((modeId) => {
                  const mode = modeById.get(modeId);
                  return mode ? `<i>${escapeHtml(mode.label)}</i>` : "";
                }).join("") || "<i>证据待补</i>"}</div>
              </div>
              <p>${escapeHtml(item.summary)}</p>
              <div class="ecosystem-bd-case-evidence" aria-label="${escapeHtml(product.name)}的 BD 字段证据">
                ${(item.evidence_fields ?? []).map((field) => {
                  const evidence = observation?.fields?.[field];
                  return `
                    <button type="button"
                      data-ecosystem-product="${escapeHtml(product.id)}"
                      data-ecosystem-field="${escapeHtml(field)}"
                      title="${escapeHtml(evidence?.value ?? "字段证据待补充")}">
                      <span><code>${escapeHtml(formulaDisplayKey(field))}</code><small>${escapeHtml(REVIEW_STATUS_LABELS[evidence?.review_status] ?? "待确认")}</small></span>
                      <p>${escapeHtml(evidence?.value ?? "字段证据待补充")}</p>
                    </button>
                  `;
                }).join("")}
              </div>
            </article>
          `;
        }).join("")}
      </div>
      <p class="ecosystem-bd-gap"><b>当前证据边界</b>${escapeHtml(analysis.evidence_boundary)}</p>
    </section>
  `;
}

function ecosystemGenericMapMarkup(config, prototype, products, positionedProducts, unpositioned) {
  return `
    <section class="ecosystem-panel">
      <div class="ecosystem-panel-head">
        <div><span class="ecosystem-kicker">04 · ECOSYSTEM MAP</span><h3>产品定位与潜在生态位</h3></div>
        <p>选择只改变焦点，不隐藏完整品类地图</p>
      </div>
      <div class="ecosystem-product-list">
        ${products.map((product) => `
          <button type="button"
            class="ecosystem-product-button ${product.id === state.selectedEcosystemProductId ? "is-active" : ""}"
            data-ecosystem-product="${escapeHtml(product.id)}"
            aria-pressed="${product.id === state.selectedEcosystemProductId}">
            ${ecosystemProductIcon(product)}<span>${escapeHtml(product.name)}</span>
          </button>
        `).join("")}
      </div>
      <div class="ecosystem-plot ${state.selectedEcosystemProductId ? "has-selection" : ""}"
        aria-label="${escapeHtml(prototype.name)}产品二维定位图">
        <div class="ecosystem-axis x"><b>${escapeHtml(config.axes.x.label)}</b><span><i>${escapeHtml(config.axes.x.low)}</i><i>${escapeHtml(config.axes.x.high)}</i></span></div>
        <div class="ecosystem-axis y"><b>${escapeHtml(config.axes.y.label)}</b><span><i>${escapeHtml(config.axes.y.high)}</i><i>${escapeHtml(config.axes.y.low)}</i></span></div>
        ${(config.niches ?? []).map((niche) => `
          <span class="ecosystem-niche" style="--x:${niche.x};--y:${niche.y}" title="${escapeHtml(niche.hypothesis)}">${escapeHtml(niche.label)}</span>
        `).join("")}
        ${positionedProducts.map(({ product, position }) => `
          <button type="button"
            class="ecosystem-dot ${position.role === "cornerstone" ? "is-cornerstone" : ""} ${position.status === "confirmed" ? "is-confirmed" : "is-draft"} ${product.id === state.selectedEcosystemProductId ? "is-active" : ""}"
            style="--x:${position.x};--y:${position.y}"
            data-ecosystem-product="${escapeHtml(product.id)}"
            aria-pressed="${product.id === state.selectedEcosystemProductId}">
            ${ecosystemProductIcon(product)}<span>${escapeHtml(product.name)}</span>
          </button>
        `).join("")}
      </div>
      ${unpositioned.length ? `
        <p class="ecosystem-unpositioned"><strong>已归类、待定位：</strong>${unpositioned.map((product) => escapeHtml(product.name)).join(" · ")}</p>
      ` : ""}
    </section>
  `;
}

function positionEcosystemNicheEdges() {
  const plot = elements.ecosystemWorkbench?.querySelector(".ecosystem-niche-map-plot");
  if (!plot) return;
  const width = plot.clientWidth;
  const height = plot.clientHeight;
  if (!width || !height) return;
  plot.querySelectorAll("[data-model-edge]").forEach((edge) => {
    const x1 = width * Number(edge.dataset.x1) / 100;
    const y1 = height * (100 - Number(edge.dataset.y1)) / 100;
    const x2 = width * Number(edge.dataset.x2) / 100;
    const y2 = height * (100 - Number(edge.dataset.y2)) / 100;
    const dx = x2 - x1;
    const dy = y2 - y1;
    edge.style.left = `${x1}px`;
    edge.style.top = `${y1}px`;
    edge.style.width = `${Math.hypot(dx, dy)}px`;
    edge.style.transform = `rotate(${Math.atan2(dy, dx)}rad)`;
  });
}

window.addEventListener("resize", positionEcosystemNicheEdges);

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
    <div class="ecosystem-body ${config.niche_map ? "has-niche-map" : ""}">
      ${config.niche_map
        ? ecosystemNicheMapMarkup(config, prototype, products, positionedProducts, unpositioned)
        : ecosystemGenericMapMarkup(config, prototype, products, positionedProducts, unpositioned)}
      <aside class="ecosystem-panel ecosystem-detail ecosystem-detail-compact">
        <header class="ecosystem-detail-head">
          <div class="ecosystem-detail-identity">
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
          </div>
          ${selectedProduct ? `
            <button type="button" class="button button-secondary ecosystem-detail-open-product"
              data-ecosystem-open-product="${escapeHtml(selectedProduct.id)}">
              打开游戏资料与归属编辑
            </button>
          ` : ""}
        </header>
        <div class="ecosystem-detail-context">
          ${selectedPosition
            ? `<p class="ecosystem-position-note">${escapeHtml(selectedPosition.position_note)}</p>`
            : '<p class="ecosystem-position-note">这款产品已完成品类归属，但二维位置和变化字段仍等待人工确认。</p>'}
          ${state.selectedEcosystemField ? `
            <button type="button" class="ecosystem-clear-field" data-ecosystem-clear-field>
              当前聚焦 ${escapeHtml(formulaDisplayKey(state.selectedEcosystemField))} · 查看全部变化 ×
            </button>
          ` : ""}
        </div>
        <div class="ecosystem-delta-grid">
          ${selectedProduct ? ecosystemDeltaCards(config, selectedProduct, state.selectedEcosystemField) : ""}
        </div>
      </aside>
    </div>
    ${ecosystemFourLayerArchitectureMarkup(config, prototype)}
    ${ecosystemBdAnalysisMarkup(config)}
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
  elements.ecosystemWorkbench.querySelectorAll("[data-ecosystem-map-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      selectEcosystemMapPreset(button.dataset.ecosystemMapPreset);
    });
  });
  elements.ecosystemWorkbench.querySelectorAll("[data-ecosystem-map-filter-dimension]").forEach((button) => {
    button.addEventListener("click", () => {
      selectEcosystemMapFilter(
        button.dataset.ecosystemMapFilterDimension,
        button.dataset.ecosystemMapFilterValue
      );
    });
  });
  elements.ecosystemWorkbench.querySelector("[data-ecosystem-map-filter-clear]")?.addEventListener("click", () => {
    clearEcosystemMapFilters();
  });
  elements.ecosystemWorkbench.querySelectorAll("[data-ecosystem-branch-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      toggleEcosystemBranch(button.dataset.ecosystemBranchToggle);
    });
  });
  elements.ecosystemWorkbench.querySelectorAll("[data-ecosystem-bd-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      selectEcosystemBdMode(button.dataset.ecosystemBdMode);
    });
  });
  elements.ecosystemWorkbench.querySelector(".ecosystem-niche-map-plot")?.addEventListener("click", (event) => {
    if (event.target.closest("button, [data-model-node], [data-ecosystem-map-preset]")) return;
    selectEcosystemMapPreset("all");
  });
  elements.ecosystemWorkbench.querySelector("[data-ecosystem-info-toggle]")?.addEventListener("click", () => {
    state.ecosystemNicheInfoCollapsed = !state.ecosystemNicheInfoCollapsed;
    renderEcosystemWorkbench();
  });
  elements.ecosystemWorkbench.querySelector("[data-ecosystem-clear-field]")?.addEventListener("click", () => {
    state.selectedEcosystemField = null;
    renderEcosystemWorkbench();
  });
  elements.ecosystemWorkbench.querySelector("[data-ecosystem-open-product]")?.addEventListener("click", (event) => {
    openProductDetail(event.currentTarget.dataset.ecosystemOpenProduct);
  });
  window.requestAnimationFrame(positionEcosystemNicheEdges);
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
                        data-edit-formula-node="${escapeHtml(prototype.id)}">
                        编辑公式字段
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
  elements.graphManager.querySelectorAll("[data-edit-formula-node]").forEach((button) => {
    button.addEventListener("click", () => {
      focusFormulaMatrixForNode(button.dataset.editFormulaNode);
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
    ? `选择游戏并设置为基石或变体；系统会自动建立“${state.data.prototypeById.get(prototypeId)?.name ?? "当前原型"} → 游戏”的游戏变体映射。`
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
    C2: "Combo 中位于 C₁ 之后的可选二次揭晓层 · 第二峰",
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

function formulaTermAnchorId(key) {
  return `formula-term-${key}`;
}

function formulaTermKeyFromHash() {
  const prefix = "#formula-term-";
  if (!window.location.hash.startsWith(prefix)) return null;
  const key = decodeURIComponent(window.location.hash.slice(prefix.length));
  return FORMULA_FIELDS.includes(key) ? key : null;
}

function navigateToFormulaTerm(key) {
  if (topTabForHash() !== "model") {
    rememberCrossTabOrigin();
  }
  selectTerm(key);
  const anchorId = formulaTermAnchorId(key);
  const targetHash = `#${anchorId}`;

  if (window.location.hash !== targetHash) {
    window.location.hash = anchorId;
    window.requestAnimationFrame(renderCrossTabTrail);
    return;
  }

  window.requestAnimationFrame(() => {
    document.getElementById(anchorId)?.scrollIntoView({
      block: "start",
      behavior: "smooth"
    });
  });
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
    <span
      class="formula-term-anchor"
      id="${escapeHtml(formulaTermAnchorId(state.selectedTermKey))}"
      aria-hidden="true"
    ></span>
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
    [state.data.variants.length, "游戏变体"],
    [new Set(state.data.products.map((item) => item.id)).size, "具体游戏"]
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
      ${escapeHtml(selected.formula_changes.C2.constraint_label)}负责二次揭晓；
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
      ${compactVariant ? `aria-label="查看游戏变体：${escapeHtml(node.name)}"` : ""}
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
  elements.variantRail.classList.toggle(
    "is-detail-view",
    allowsVariantViewToggle && state.atlasVariantViewMode === "detail"
  );

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
    : emptyRailMarkup("当前原型下没有符合条件的游戏变体");

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
  state.selectedFingerprintField = null;
  state.detailLevel = "mechanism";
  renderAtlas();
}

function selectPrototype(id) {
  const prototype = state.data.prototypeById.get(id);
  state.selectedMechanismId = prototype.primary_mother_id;
  state.selectedPrototypeId = id;
  state.selectedVariantId = variantsFor(id)[0]?.id ?? null;
  state.selectedFingerprintField = null;
  state.detailLevel = "prototype";
  renderAtlas();
}

function selectVariant(id) {
  const variant = state.data.variantById.get(id);
  const prototype = state.data.prototypeById.get(variant.prototype_id);
  state.selectedMechanismId = prototype.primary_mother_id;
  state.selectedPrototypeId = prototype.id;
  state.selectedVariantId = id;
  state.selectedFingerprintField = null;
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
      const ownEvidence = fieldEvidenceImages(entry);
      result[field] = {
        operation: entry.operation,
        summary: parentEntry.summary,
        source: parentEntry.source,
        label: parentEntry.label,
        note: entry.summary,
        evidence_images: ownEvidence.length
          ? ownEvidence
          : fieldEvidenceImages(parentEntry)
      };
    } else {
      result[field] = {
        operation: entry.operation,
        summary: entry.summary,
        source: entry.operation === "inherit" ? "体验公式" : node.name,
        label: entry.constraint_label ?? FIELD_LABELS[field],
        note: null,
        evidence_images: fieldEvidenceImages(entry)
      };
    }
  }
  return result;
}

const ATLAS_FIELD_LOCATIONS = {
  P_t: "公式外层：目标、期限与失败代价",
  Pool_Symbol: "Random 的唯一直接输入",
  Random: "从 Pool_Symbol 生成 SingleSpin_Symbol",
  Put: "把抽取结果写入 Show_TP",
  Show_TP: "Put 与 Combo 共同使用的承载空间",
  C1: "Combo 的基础价值锚点",
  C2: "沿 C₁ 结果二次揭晓兑现程度",
  N: "触发一次 BD 前的连续 Spin 数量",
  BD: "修改下一周期的可配置参数"
};

const ATLAS_LAYER_CLASS = {
  mechanism_archetype: "mechanism",
  category_prototype: "prototype",
  category_variant: "variant"
};

function atlasFormulaField(node, field, label = field) {
  const layers = inheritancePath(node);
  const currentEntry = rawFingerprint(node)[field];
  const hasParent = Boolean(parentNode(node));
  const currentChanged = hasParent && currentEntry.operation !== "inherit";
  const selected = state.selectedAtlasFormulaField === field;
  const title = layers.map((layerNode) => {
    const entry = rawFingerprint(layerNode)[field];
    return `${layerNode.name}：${entry.summary}`;
  }).join(" → ");

  return `
    <span
      class="atlas-formula-field ${hasParent ? (currentChanged ? "current-changed" : "current-inherited") : "base-defined"} ${selected ? "is-selected" : ""}"
      data-atlas-formula-field="${escapeHtml(field)}"
      data-atlas-formula-select="${escapeHtml(field)}"
      data-current-operation="${escapeHtml(currentEntry.operation)}"
      role="button"
      tabindex="0"
      aria-pressed="${selected}"
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
            <span class="atlas-constraint-line ${ATLAS_LAYER_CLASS[layerNode.type]} ${isInherited ? "is-inherit" : "is-change"} ${isCurrentLayer ? "is-current-layer" : ""}">
              <small>
                ${escapeHtml(TYPE_LABELS[layerNode.type])}
                · ${escapeHtml(operationLabelForNode(layerNode, entry.operation))}
              </small>
              <strong>${isInherited ? "↳ 同上" : escapeHtml(entry.constraint_label ?? entry.summary)}</strong>
            </span>
          `;
        }).join("")}
      </span>
    </span>
  `;
}

function atlasFormulaDetailLayer(layerNode, field, index) {
  const rawEntry = rawFingerprint(layerNode)[field];
  const effectiveEntry = effectiveFingerprint(layerNode)[field];
  const evidenceImages = fieldEvidenceImages(rawEntry);
  const evidenceId = `atlas-field-evidence-${field}-${index}`;

  return `
    <article class="atlas-detail-layer ${ATLAS_LAYER_CLASS[layerNode.type]}">
      <header class="atlas-detail-layer-head">
        <span class="atlas-detail-layer-index">0${index + 1}</span>
        <div>
          <small>${escapeHtml(TYPE_LABELS[layerNode.type])}</small>
          <strong>${escapeHtml(layerNode.name)}</strong>
        </div>
        <span class="atlas-detail-operation ${escapeHtml(rawEntry.operation)}">
          ${escapeHtml(operationLabelForNode(layerNode, rawEntry.operation))}
        </span>
      </header>
      <div class="atlas-detail-layer-copy">
        <strong>${escapeHtml(effectiveEntry.label ?? FIELD_LABELS[field] ?? field)}</strong>
        <p>${escapeHtml(effectiveEntry.summary)}</p>
        ${rawEntry.operation === "inherit" && effectiveEntry.source !== layerNode.name
          ? `<small>有效定义来源：${escapeHtml(effectiveEntry.source)}</small>`
          : ""}
      </div>
      ${evidenceImages.length ? `
        <button
          type="button"
          class="atlas-detail-evidence-toggle"
          data-atlas-evidence-toggle="${escapeHtml(evidenceId)}"
          aria-expanded="true"
        >
          <span>查看图片证据</span>
          <strong>${evidenceImages.length} 张</strong>
          <i aria-hidden="true">⌄</i>
        </button>
        <div class="atlas-detail-evidence" id="${escapeHtml(evidenceId)}">
          ${fieldEvidencePreviewMarkup(evidenceImages, {
            className: "atlas-detail-evidence-images",
            label: `${layerNode.name} · ${formulaDisplayKey(field)} 图片证据`
          })}
        </div>
      ` : ""}
    </article>
  `;
}

function atlasFormulaDetail(node, field) {
  const term = state.data.termByKey.get(field);
  const layers = inheritancePath(node);

  return `
    <section class="atlas-formula-detail" aria-live="polite">
      <header class="atlas-formula-detail-head">
        <div>
          <span>CURRENT FIELD · 当前字段</span>
          <h4>${escapeHtml(formulaDisplayKey(field))} · ${escapeHtml(term?.name ?? FIELD_LABELS[field] ?? field)}</h4>
        </div>
        <p>${escapeHtml(ATLAS_FIELD_LOCATIONS[field] ?? "体验公式字段")}</p>
      </header>
      <div class="atlas-formula-detail-layers">
        ${layers.map((layerNode, index) => atlasFormulaDetailLayer(layerNode, field, index)).join("")}
      </div>
    </section>
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
  if (state.atlasFormulaSelectionNodeId !== node.id) {
    state.atlasFormulaSelectionNodeId = node.id;
    state.selectedAtlasFormulaField = changedFields[0] ?? null;
  }
  const selectedField = FORMULA_FIELDS.includes(state.selectedAtlasFormulaField)
    ? state.selectedAtlasFormulaField
    : null;
  state.selectedAtlasFormulaField = selectedField;

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
    ${selectedField ? atlasFormulaDetail(node, selectedField) : ""}
    <div class="atlas-formula-note">
      <strong>正在查看：${escapeHtml(pathCopy)}</strong>
      <span>
        红色为机制母型，黄色为品类原型，绿色为游戏变体。
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

  elements.atlasFormulaMap.querySelectorAll("[data-atlas-formula-select]").forEach((fieldElement) => {
    const selectField = (event) => {
      if (event.target.closest("[data-field-image-preview]")) return;
      state.selectedAtlasFormulaField = fieldElement.dataset.atlasFormulaSelect;
      renderAtlasFormula();
    };
    fieldElement.addEventListener("click", selectField);
    fieldElement.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      selectField(event);
    });
  });

  elements.atlasFormulaMap.querySelectorAll("[data-atlas-evidence-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const panel = document.getElementById(button.dataset.atlasEvidenceToggle);
      if (!panel) return;
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      panel.hidden = expanded;
    });
  });
}

function relationMetrics(node) {
  if (node.type === "mechanism_archetype") {
    const prototypes = prototypesFor(node.id);
    return [
      [prototypes.length, "直接品类原型"],
      [prototypes.flatMap((item) => variantsFor(item.id)).length, "全部游戏变体"],
      [productsFor(node).length, "关联产品"],
      [node.open_axes.length, "开放变量"]
    ];
  }
  if (node.type === "category_prototype") {
    const changes = Object.values(node.formula_changes);
    return [
      [1, "上级机制母型"],
      [variantsFor(node.id).length, "直接游戏变体"],
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

function renderFingerprintDetail(field) {
  const node = selectedNode();
  const panel = elements.nodeDetail.querySelector("#fingerprint-detail-panel");
  if (!node || !panel || !FORMULA_FIELDS.includes(field)) return;

  const item = effectiveFingerprint(node)[field];
  const parent = parentNode(node);
  const parentItem = parent ? effectiveFingerprint(parent)[field] : null;
  const term = state.data.termByKey.get(field);
  const operationLabel = operationLabelForNode(node, item.operation);
  const evidenceImages = fieldEvidenceImages(item);

  panel.classList.remove("is-empty");
  panel.innerHTML = `
    <header class="fingerprint-detail-head">
      <div>
        <span>FIELD DETAIL · 当前节点字段</span>
        <h5>${escapeHtml(formulaDisplayKey(field))} · ${escapeHtml(term?.name ?? field)}</h5>
      </div>
      <div class="fingerprint-detail-actions">
        <button
          type="button"
          class="button button-primary"
          data-edit-current-formula-field="${escapeHtml(field)}"
        >
          修改当前字段 →
        </button>
        <button
          type="button"
          class="button button-secondary"
          data-view-formula-field="${escapeHtml(field)}"
        >
          查看体验模型通用定义 →
        </button>
      </div>
    </header>

    <div class="fingerprint-detail-meta">
      <div>
        <small>相对父级操作</small>
        <strong class="operation-pill ${escapeHtml(item.operation)}">
          ${escapeHtml(operationLabel)}
        </strong>
      </div>
      <div>
        <small>当前有效来源</small>
        <strong>${escapeHtml(item.source)}</strong>
      </div>
      <div>
        <small>当前节点</small>
        <strong>${escapeHtml(node.name)}</strong>
      </div>
    </div>

    <div class="fingerprint-detail-copy">
      <small>当前节点中的具体定义</small>
      <p>${escapeHtml(item.summary)}</p>
    </div>

    ${evidenceImages.length ? `
      <section class="fingerprint-evidence">
        <header>
          <strong>字段配图</strong>
          <span>${evidenceImages.length} 张</span>
        </header>
        <div class="fingerprint-evidence-grid" data-field-evidence-group>
          ${evidenceImages.map((image, index) => {
            const imageUrl = safeFieldEvidenceUrl(image.url ?? image.data_url);
            const caption = image.caption || image.name || `字段配图 ${index + 1}`;
            return `
              <figure>
                <button
                  type="button"
                  class="fingerprint-evidence-preview"
                  data-field-image-preview
                  data-field-image-caption="${escapeHtml(caption)}"
                  aria-label="放大查看：${escapeHtml(caption)}"
                >
                  <img
                    src="${escapeHtml(imageUrl)}"
                    alt="${escapeHtml(caption)}"
                    loading="lazy"
                  >
                  <span aria-hidden="true">点击放大</span>
                </button>
                <figcaption>
                  <strong>${escapeHtml(caption)}</strong>
                  ${image.caption && image.name
                    ? `<small>${escapeHtml(image.name)}</small>`
                    : ""}
                </figcaption>
              </figure>
            `;
          }).join("")}
        </div>
      </section>
    ` : ""}

    ${parentItem ? `
      <div class="fingerprint-parent-copy ${fieldEvidenceImages(parentItem).length ? "has-evidence" : ""}">
        <small>父级有效定义 · ${escapeHtml(parent.name)}</small>
        <p>${escapeHtml(parentItem.summary)}</p>
        ${fieldEvidencePreviewMarkup(fieldEvidenceImages(parentItem), {
          className: "fingerprint-parent-evidence",
          label: `${parent.name} · ${formulaDisplayKey(field)} 配图`
        })}
      </div>
    ` : `
      <div class="fingerprint-parent-copy">
        <small>父级有效定义</small>
        <p>这是体验公式下的第一层约束，没有更上层的原型节点。</p>
      </div>
    `}
  `;

  elements.nodeDetail.querySelectorAll("[data-field]").forEach((button) => {
    const selected = button.dataset.field === field;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  panel
    .querySelector("[data-edit-current-formula-field]")
    ?.addEventListener("click", () => {
      openFieldEditor(node.id, field);
    });

  panel
    .querySelector("[data-view-formula-field]")
    ?.addEventListener("click", () => {
      navigateToFormulaTerm(field);
    });
}

function selectFingerprintField(field) {
  if (!FORMULA_FIELDS.includes(field)) return;
  state.selectedFingerprintField = field;
  renderFingerprintDetail(field);
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
        const evidenceImages = fieldEvidenceImages(item);
        return `
          <article class="fingerprint-card-shell ${evidenceImages.length ? "has-evidence" : ""}">
            <button
              class="fingerprint-card"
              type="button"
              data-field="${escapeHtml(field)}"
              aria-controls="fingerprint-detail-panel"
              aria-pressed="false"
            >
              <header>
                <code>${escapeHtml(field)}</code>
                <span class="operation-pill ${escapeHtml(item.operation)}">
                  ${escapeHtml(operationLabelForNode(node, item.operation))}
                </span>
              </header>
              <p>${escapeHtml(item.summary)}</p>
              <span class="fingerprint-source">当前有效来源：${escapeHtml(item.source)}</span>
            </button>
            ${fieldEvidencePreviewMarkup(evidenceImages, {
              className: "fingerprint-card-evidence",
              limit: 4,
              label: `${node.name} · ${formulaDisplayKey(field)} 配图`
            })}
          </article>
        `;
      }).join("")}
    </div>

    <section
      class="fingerprint-detail-panel is-empty"
      id="fingerprint-detail-panel"
      aria-live="polite"
    >
      <span>字段详情</span>
      <p>点击上方任一公式指纹，查看它在当前节点中的具体定义及其与父级的差异。</p>
    </section>

    ${identityRules.length ? `
      <h4 class="detail-section-title">
        ${node.type === "mechanism_archetype" ? "留给下层的开放变量" : "身份与继承规则"}
      </h4>
      <ul class="identity-list">
        ${identityRules.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    ` : ""}

    <h4 class="detail-section-title">关联具体游戏</h4>
    <div class="product-chips">
      ${products.length
        ? products.map((product) => `
          <button
            type="button"
            class="product-chip is-interactive"
            data-related-product="${escapeHtml(product.id)}"
            aria-label="在游戏库中查看 ${escapeHtml(product.name)}"
            title="切换到游戏库并查看产品详情"
          >
            ${escapeHtml(product.name)}
            <small>${escapeHtml(product.relation_types
              .map((type) => RELATION_LABELS[type] ?? type)
              .join(" · "))}</small>
            <i aria-hidden="true">→</i>
          </button>
        `).join("")
        : '<span class="product-chip">暂未关联产品</span>'}
    </div>
  `;

  elements.nodeDetail.querySelectorAll("[data-field]").forEach((button) => {
    button.addEventListener("click", () => {
      selectFingerprintField(button.dataset.field);
    });
  });

  if (state.selectedFingerprintField) {
    renderFingerprintDetail(state.selectedFingerprintField);
  }

  elements.nodeDetail.querySelectorAll("[data-related-product]").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.relatedProduct;
      if (!state.data.productById.has(productId)) return;
      rememberCrossTabOrigin();
      selectLibraryView("products");
      window.location.hash = "library";
      openProductDetail(productId);
      window.requestAnimationFrame(renderCrossTabTrail);
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

function focusFormulaMatrixForNode(nodeId) {
  const node = libraryNodeById(nodeId);
  if (!node) return;

  const matrixParent = node.type === "category_variant"
    ? parentNode(node)
    : node;
  state.libraryMatrixParentId = matrixParent?.id ?? state.libraryMatrixParentId;
  state.libraryMatrixNodeFilter = node.type === "category_variant" ? node.id : null;
  state.libraryFieldFilter = "all";
  elements.fieldFilter.value = "all";

  selectLibraryView("matrix");
  renderFormulaMatrix();

  requestAnimationFrame(() => {
    elements.formulaDataTable.closest(".formula-matrix-scroll").scrollLeft = 0;
    elements.matrixNodeFocus.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
}

function clearFormulaMatrixNodeFocus() {
  state.libraryMatrixNodeFilter = null;
  state.libraryFieldFilter = "all";
  elements.fieldFilter.value = "all";
  renderFormulaMatrix();
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

function renderFieldEditorEvidence() {
  const images = state.editingFieldImages;
  const remaining = Math.max(0, 4 - images.length);
  elements.fieldEditorImageInput.disabled =
    state.fieldEditorBusy || !state.dataServiceOnline || remaining === 0;
  elements.fieldEditorImageInput.closest(".field-editor-upload")
    ?.classList.toggle("is-disabled", elements.fieldEditorImageInput.disabled);
  elements.fieldEditorEvidence.classList.toggle(
    "is-drop-disabled",
    elements.fieldEditorImageInput.disabled
  );

  elements.fieldEditorEvidenceList.innerHTML = images.length
    ? images.map((item, index) => {
      const imageUrl = safeFieldEvidenceUrl(item.url ?? item.data_url);
      return `
        <article class="field-editor-evidence-item">
          <button type="button" class="field-editor-evidence-image"
            data-field-image-preview
            data-field-image-caption="${escapeHtml(item.caption || item.name || `字段配图 ${index + 1}`)}"
            aria-label="放大查看：${escapeHtml(item.caption || item.name || `字段配图 ${index + 1}`)}"
          >
            <img
              src="${escapeHtml(imageUrl)}"
              alt="${escapeHtml(item.caption || item.name || `字段配图 ${index + 1}`)}"
            >
            <span aria-hidden="true">点击放大</span>
          </button>
          <div class="field-editor-evidence-body">
            <div>
              <strong>${escapeHtml(item.name || `字段配图 ${index + 1}`)}</strong>
              <button
                type="button"
                data-remove-field-image="${index}"
                aria-label="删除 ${escapeHtml(item.name || `字段配图 ${index + 1}`)}"
              >删除</button>
            </div>
            <label>
              <span>图片说明（可选）</span>
              <input
                type="text"
                maxlength="160"
                value="${escapeHtml(item.caption ?? "")}"
                data-field-image-caption="${index}"
                placeholder="说明截图中与当前字段相关的部分"
              >
            </label>
          </div>
        </article>
      `;
    }).join("")
    : `
      <div class="field-editor-evidence-empty">
        <strong>当前字段还没有配图</strong>
        <span>将图片拖到这里，或复制图片后按 ⌘V / Ctrl+V。</span>
      </div>
    `;

  elements.fieldEditorEvidenceList.querySelectorAll("[data-remove-field-image]").forEach((button) => {
    button.addEventListener("click", () => {
      state.editingFieldImages.splice(Number(button.dataset.removeFieldImage), 1);
      renderFieldEditorEvidence();
    });
  });

  elements.fieldEditorEvidenceList.querySelectorAll("[data-field-image-caption]").forEach((input) => {
    input.addEventListener("input", () => {
      const item = state.editingFieldImages[Number(input.dataset.fieldImageCaption)];
      if (item) item.caption = input.value;
    });
  });
}

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", () => reject(new Error(`无法读取图片：${file.name}`)));
    reader.readAsDataURL(file);
  });
}

function createClientId(prefix) {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return `${prefix}-${globalThis.crypto.randomUUID()}`;
  }
  if (typeof globalThis.crypto?.getRandomValues === "function") {
    const values = new Uint32Array(4);
    globalThis.crypto.getRandomValues(values);
    return `${prefix}-${[...values].map((value) => value.toString(36)).join("-")}`;
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

async function addFieldEditorImages(fileList, source = "upload") {
  const allowedTypes = new Set(["image/png", "image/jpeg", "image/webp"]);
  const typeByExtension = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp"
  };
  const files = [...fileList].filter(Boolean);
  const sourceLabels = {
    upload: "上传",
    drop: "拖入",
    paste: "粘贴"
  };
  const sourceLabel = sourceLabels[source] ?? "添加";
  let added = 0;
  let warning = "";

  if (!state.dataServiceOnline) {
    warning = "当前是只读模式，无法添加字段配图。";
  } else if (state.fieldEditorBusy) {
    warning = "字段正在保存，请稍后再添加配图。";
  }

  const blocked = Boolean(warning);
  for (const file of files) {
    if (blocked) break;
    if (state.editingFieldImages.length >= 4) {
      warning = "每个字段最多保存 4 张图片。";
      break;
    }
    const fileName = file.name || `${sourceLabel}图片`;
    const extension = fileName.toLowerCase().split(".").pop();
    const normalizedType = file.type === "image/jpg"
      ? "image/jpeg"
      : allowedTypes.has(file.type)
        ? file.type
        : typeByExtension[extension];
    if (!normalizedType) {
      warning = `${fileName} 不是支持的图片格式。`;
      continue;
    }
    if (file.size > 5 * 1024 * 1024) {
      warning = `${fileName} 超过 5MB，未加入。`;
      continue;
    }

    const dataUrl = await readImageFile(file);
    state.editingFieldImages.push({
      id: createClientId("pending"),
      name: fileName,
      caption: "",
      data_url: dataUrl.replace(
        /^data:[^;,]*;base64,/,
        `data:${normalizedType};base64,`
      )
    });
    added += 1;
  }

  elements.fieldEditorImageInput.value = "";
  renderFieldEditorEvidence();
  if (warning || added) {
    elements.fieldEditorMessage.textContent = [
      added ? `已${sourceLabel} ${added} 张图片，保存字段后写入。` : "",
      warning
    ].filter(Boolean).join(" ");
    elements.fieldEditorMessage.className =
      `field-editor-message ${warning ? "warning" : ""}`;
  }
  return added;
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

  const operationEntries = parent
    ? Object.entries(OPERATION_LABELS)
    : [["override", "本层定义"]];
  elements.fieldEditorOperation.innerHTML = operationEntries.map(([value, label]) => `
    <option value="${escapeHtml(value)}">${escapeHtml(label)} · ${escapeHtml(
      parent ? OPERATION_DESCRIPTIONS[value] : "当前层的基础定义"
    )}</option>
  `).join("");
  elements.fieldEditorOperation.value = entry.operation;
  elements.fieldEditorStatus.value = reviewStatusFor(node, entry);
  elements.fieldEditorLabel.value = entry.constraint_label ?? "";
  elements.fieldEditorSummary.value = entry.summary ?? "";
  elements.fieldEditorNote.value = entry.review_note ?? "";
  state.editingFieldImages = fieldEvidenceImages(entry).map((item) => ({ ...item }));
  renderFieldEditorEvidence();
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
  state.editingFieldImages = [];
  elements.fieldEditorEvidence.classList.remove("is-dragover");
  elements.fieldEditorImageInput.value = "";
  if (typeof elements.fieldEditor.close === "function") {
    elements.fieldEditor.close();
  } else {
    elements.fieldEditor.removeAttribute("open");
  }
}

function setEditorBusy(busy) {
  state.fieldEditorBusy = busy;
  elements.fieldEditorSave.disabled = busy || !state.dataServiceOnline;
  elements.fieldEditorConfirm.disabled = busy || !state.dataServiceOnline;
  elements.fieldEditorCancel.disabled = busy;
  elements.fieldEditorClose.disabled = busy;
  elements.fieldEditorImageInput.disabled = busy
    || !state.dataServiceOnline
    || state.editingFieldImages.length >= 4;
  elements.fieldEditorImageInput.closest(".field-editor-upload")
    ?.classList.toggle("is-disabled", elements.fieldEditorImageInput.disabled);
  elements.fieldEditorEvidence.classList.toggle(
    "is-drop-disabled",
    elements.fieldEditorImageInput.disabled
  );
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

function editedFieldPayload(action = "update", savedEntry = null) {
  const evidenceImages = savedEntry
    ? fieldEvidenceImages(savedEntry)
    : state.editingFieldImages;
  return {
    node_id: state.editingField.nodeId,
    field: state.editingField.field,
    action,
    operation: savedEntry?.operation ?? elements.fieldEditorOperation.value,
    constraint_label: savedEntry?.constraint_label
      ?? elements.fieldEditorLabel.value.trim(),
    summary: savedEntry?.summary ?? elements.fieldEditorSummary.value.trim(),
    review_status: action === "confirm"
      ? "confirmed"
      : savedEntry?.review_status ?? elements.fieldEditorStatus.value,
    review_note: savedEntry?.review_note
      ?? elements.fieldEditorNote.value.trim(),
    evidence_images: evidenceImages.map((item) => ({
      id: item.id,
      name: item.name,
      caption: item.caption?.trim() ?? "",
      url: item.url,
      created_at: item.created_at,
      data_url: item.data_url
    }))
  };
}

function validateEditedFieldPayload(payload) {
  if (!payload.constraint_label || !payload.summary) {
    elements.fieldEditorMessage.textContent = "约束短标签和字段描述不能为空。";
    elements.fieldEditorMessage.className = "field-editor-message error";
    return false;
  }
  return true;
}

async function submitEditedField(payload) {
  const response = await fetch("./api/update-field", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const result = await response.json();
  if (!response.ok || !result.ok) {
    throw new Error(result.error ?? "保存失败");
  }
  return result;
}

async function saveEditedField(action = "update") {
  if (!state.dataServiceOnline || !state.editingField) return false;
  const node = libraryNodeById(state.editingField.nodeId);
  if (!node) return false;
  const payload = editedFieldPayload(action);
  if (!validateEditedFieldPayload(payload)) return false;

  setEditorBusy(true);
  elements.fieldEditorMessage.textContent = action === "confirm"
    ? "正在确认并写入数据…"
    : "正在保存调整…";
  elements.fieldEditorMessage.className = "field-editor-message";

  try {
    await submitEditedField(payload);
    await refreshDataFromFiles();
    closeFieldEditor();
    showDataToast(action === "confirm"
      ? `${node.name} · ${payload.field} 已人工确认`
      : `${node.name} · ${payload.field} 已保存`);
    return true;
  } catch (error) {
    elements.fieldEditorMessage.textContent = error.message;
    elements.fieldEditorMessage.className = "field-editor-message error";
    return false;
  } finally {
    setEditorBusy(false);
  }
}

async function confirmEditedField() {
  if (!state.dataServiceOnline || !state.editingField) return false;
  const node = libraryNodeById(state.editingField.nodeId);
  if (!node) return false;

  const savePayload = editedFieldPayload("update");
  if (!validateEditedFieldPayload(savePayload)) return false;

  let savedEntry = null;
  setEditorBusy(true);
  elements.fieldEditorMessage.textContent = "第 1 步：正在保存当前修改…";
  elements.fieldEditorMessage.className = "field-editor-message";

  try {
    const saveResult = await submitEditedField(savePayload);
    savedEntry = saveResult.entry;
    state.editingFieldImages = fieldEvidenceImages(savedEntry).map((item) => ({ ...item }));
    renderFieldEditorEvidence();

    elements.fieldEditorMessage.textContent = "第 2 步：修改已保存，正在人工确认…";
    const confirmPayload = editedFieldPayload("confirm", savedEntry);
    await submitEditedField(confirmPayload);

    await refreshDataFromFiles();
    closeFieldEditor();
    showDataToast(`${node.name} · ${savePayload.field} 已先保存并人工确认`);
    return true;
  } catch (error) {
    if (savedEntry) {
      try {
        await refreshDataFromFiles();
      } catch {
        // 保留原始确认错误，数据可在下次刷新时重新载入。
      }
    }
    elements.fieldEditorMessage.textContent = savedEntry
      ? `修改已保存，但人工确认失败：${error.message}`
      : `保存修改失败，尚未人工确认：${error.message}`;
    elements.fieldEditorMessage.className = "field-editor-message error";
    return false;
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

  elements.productSort.addEventListener("change", () => {
    state.libraryProductSort = elements.productSort.value;
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

  elements.matrixParentFilter.addEventListener("change", () => {
    state.libraryMatrixNodeFilter = null;
    state.libraryMatrixParentId = elements.matrixParentFilter.value;
    renderFormulaMatrix();
    elements.formulaDataTable.closest(".formula-matrix-scroll").scrollLeft = 0;
  });

  elements.fieldFilter.addEventListener("change", () => {
    state.libraryFieldFilter = elements.fieldFilter.value;
    renderFormulaMatrix();
  });

  elements.matrixNodeFocusClear.addEventListener("click", clearFormulaMatrixNodeFocus);

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
  elements.fieldEditor.addEventListener("dblclick", (event) => {
    if (event.target === elements.fieldEditor) closeFieldEditor();
  });
  elements.fieldEditorImageInput.addEventListener("change", async () => {
    try {
      await addFieldEditorImages(elements.fieldEditorImageInput.files, "upload");
    } catch (error) {
      elements.fieldEditorMessage.textContent = error.message;
      elements.fieldEditorMessage.className = "field-editor-message error";
    }
  });
  elements.fieldEditorEvidence.addEventListener("dragenter", (event) => {
    if (![...(event.dataTransfer?.types ?? [])].includes("Files")) return;
    event.preventDefault();
    if (!elements.fieldEditorImageInput.disabled) {
      elements.fieldEditorEvidence.classList.add("is-dragover");
    }
  });
  elements.fieldEditorEvidence.addEventListener("dragover", (event) => {
    if (![...(event.dataTransfer?.types ?? [])].includes("Files")) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = elements.fieldEditorImageInput.disabled ? "none" : "copy";
  });
  elements.fieldEditorEvidence.addEventListener("dragleave", (event) => {
    if (event.relatedTarget && elements.fieldEditorEvidence.contains(event.relatedTarget)) {
      return;
    }
    elements.fieldEditorEvidence.classList.remove("is-dragover");
  });
  elements.fieldEditorEvidence.addEventListener("drop", async (event) => {
    if (![...(event.dataTransfer?.types ?? [])].includes("Files")) return;
    event.preventDefault();
    elements.fieldEditorEvidence.classList.remove("is-dragover");
    try {
      await addFieldEditorImages(event.dataTransfer.files, "drop");
    } catch (error) {
      elements.fieldEditorMessage.textContent = error.message;
      elements.fieldEditorMessage.className = "field-editor-message error";
    }
  });
  elements.fieldEditor.addEventListener("paste", async (event) => {
    const clipboardFiles = [...(event.clipboardData?.items ?? [])]
      .filter((item) => item.kind === "file")
      .map((item) => item.getAsFile())
      .filter((file) => file && (
        file.type.startsWith("image/")
        || /\.(?:png|jpe?g|webp)$/i.test(file.name)
      ));
    if (!clipboardFiles.length) return;

    event.preventDefault();
    try {
      await addFieldEditorImages(clipboardFiles, "paste");
    } catch (error) {
      elements.fieldEditorMessage.textContent = error.message;
      elements.fieldEditorMessage.className = "field-editor-message error";
    }
  });
  elements.fieldEditorForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveEditedField("update");
  });
  elements.fieldEditorConfirm.addEventListener("click", () => {
    confirmEditedField();
  });

  elements.productDetailClose.addEventListener("click", closeProductDetail);
  elements.productDetailCrossTabTrailClear.addEventListener("click", () => {
    state.crossTabHistory = [];
    renderCrossTabTrail();
  });
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
    elements.crossTabTrailClear.addEventListener("click", () => {
      state.crossTabHistory = [];
      renderCrossTabTrail();
    });
    window.addEventListener("hashchange", () => {
      window.requestAnimationFrame(renderCrossTabTrail);
    });
    elements.atlasSummaryClose.addEventListener("click", closeAtlasSummaryDialog);
    elements.atlasSummaryDialog.addEventListener("click", (event) => {
      if (event.target === elements.atlasSummaryDialog) closeAtlasSummaryDialog();
    });
    bindLuckLandlordCase();
    bindExperienceTimeline();
    bindCoreInsights();
    bindFieldImageViewer();
    state.data = await loadData();
    setDefaultSelection();
    const deepLinkedTermKey = formulaTermKeyFromHash();
    if (deepLinkedTermKey && state.data.termByKey.has(deepLinkedTermKey)) {
      state.selectedTermKey = deepLinkedTermKey;
    }
    renderFieldFormulaMap();
    renderTermControls();
    renderTermDetail();
    renderAtlas();
    renderEcosystem();
    bindLibrary();
    renderLibrary();
    bindToolbar();
    await checkDataService();
    renderCrossTabTrail();
  } catch (error) {
    console.error(error);
    elements.fatalMessage.hidden = false;
  }
}

init();
