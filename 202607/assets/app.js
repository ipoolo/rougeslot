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

const DATA_VERSION = "20260813-124";
const DEFAULT_ATLAS_VARIANT_ID = "variant.custom-ms4430m6-dycxc";

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
  selectedC2DepthScore: 2,
  query: "",
  filter: "all",
  atlasVariantViewMode: "compact",
  libraryView: "products",
  libraryProductQuery: "",
  libraryProductScope: "current",
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
  selectedEcosystemCoordinateView: "operation-c2",
  selectedEcosystemNicheId: null,
  ecosystemCoordinateExpanded: false,
  ecosystemCoordinateReturnAnchor: null,
  ecosystemCoordinateReturnPending: false,
  expandedEcosystemCoordinateGroupKey: null,
  ecosystemCoordinatePlotSize: { width: 1060, height: 680 },
  ecosystemScoreTableSortKey: null,
  ecosystemScoreTableSortDirection: "asc",
  ecosystemMapFilters: {
    topology: null,
    color: null,
    secondary_badge: null,
    c1_synergy: null,
    sales_tier: null,
    branch: null
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
  c2DepthPage: document.querySelector("#c2-reveal-depth"),
  c2DepthInfo: document.querySelector("[data-c2-depth-info]"),
  insightModel: document.querySelector("#insight-model"),
  cognitionScoreDialog: document.querySelector("#cognition-score-dialog"),
  cognitionScoreDialogTitle: document.querySelector("#cognition-score-dialog-title"),
  cognitionScoreDialogSummary: document.querySelector("#cognition-score-dialog-summary"),
  cognitionScoreDialogContent: document.querySelector("#cognition-score-dialog-content"),
  cognitionScoreDialogClose: document.querySelector("#cognition-score-dialog-close"),
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
  productScopeButtons: [...document.querySelectorAll("[data-library-product-scope]")],
  productCatalogEyebrow: document.querySelector("#product-catalog-eyebrow"),
  productCatalogTitle: document.querySelector("#product-catalog-title"),
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
    label: "阶段 01 · 揭晓与识别",
    title: "第一峰：随机结果成为可见事实，并通过 C₁ 被即时读懂。",
    copy: "Random 从 Pool_Symbol 抽取，Put 把结果写入 Show_TP；玩家借助 C₁ 符号协同形成“这次大概好不好”的即时判断。"
  },
  settle: {
    label: "阶段 02 · 二次揭晓与结算",
    title: "第二峰：C₂ 依托 C₁ 协同继续释放信息，并将结果封闭为 Spin_Result。",
    copy: "Combo 组合应用 C₁ 与 C₂；C₂ 可以接续、并行或嵌入 C₁，通过二次揭晓形成最终结果。"
  },
  build: {
    label: "阶段 03 · 构筑",
    title: "周期边界：连续完成 N 次 Spin 后，调整下一周期的条件。",
    copy: "只有下层启用 BD 时才进入这一阶段；BD 可修改大部分可配置参数，然后回到下一周期。"
  }
};

const CORE_INSIGHT_PRESETS = {
  all: {
    label: "洞察 1 · 总纲",
    title: "C₁ 让价值立即可读，C₂ 继续揭晓；决策节奏与有效池共同决定这一循环能否持续。",
    copy: "P(t) 作为外层目标压力，持续赋予结果“够不够”的意义；连续 N 次 Spin 后，BD 在周期边界调整下一轮条件。单轮只保留少量低复杂度操作；C、T、P、D 则约束关键关系能否稳定出现并保持可读。",
    boundary: "边界：复杂策略与新规则学习集中在阶段性构筑节点，不阻塞“主动 Spin → 第一峰 → 第二峰 → 再次操作”的最小爽环；逐轮主动触发的要求适用于依赖离散双峰体验的 Slot 改玩法。",
    nodes: [],
    edges: [],
    zones: []
  },
  c1: {
    label: "洞察 2 · 认、知与内化",
    title: "玩家应先认出 C₁ 的结果价值，再按需理解其原因。",
    copy: "Slot+ 继承传统 Slot 的 C₁ 识别先验；Slot改 必须为新 C₁ 重新建立可被图形化的即时可读性。初期不可避免的理解，应能随学习被压缩为自动完成的识别。",
    boundary: "分析边界：只评估当前 Spin 的 C₁；C₂ 的结果演绎、BD 与长期策略不进入本洞察评分。",
    nodes: ["prior", "reveal", "c1"],
    edges: ["prior-reveal", "reveal-c1"],
    zones: ["first-peak"]
  },
  c2: {
    label: "洞察 3 · 峰型与 C₂ 演绎节奏",
    title: "先判断 C₂ 是否延续 C₁ 的价值锚点，再观察信息如何随时间释放。",
    copy: "有效 C₂ 不是已知答案动画，也不是独立重新开奖；它可以接续、并行或嵌入 C₁，并通过时长、信息烈度与演绎结构把同一结果推向更高的第二峰。",
    boundary: "检查边界：成立性看价值锚点是否延续；演绎质量再看深度、时长、信息烈度、结构及其跨 Spin 的变化。目标是否达标仍由 P(t) 判断。",
    nodes: ["c1", "c2", "result"],
    edges: ["c1-c2", "c1-c2-combo", "c2-result"],
    zones: ["first-peak", "second-peak"]
  },
  c3: {
    label: "洞察 4 · 主动节奏与决策预算",
    title: "同时控制决策数与单次复杂度，并让玩家亲自开启每一轮结果。",
    copy: "双峰循环依赖短操作窗口与表演窗口持续交替。复杂策略应集中在阶段边界；自动 Spin 会删除期待的主动起点，并把离散双峰压成没有边界的连续结果流。",
    boundary: "限制的是单个双峰循环必须支付的决策成本，而不是游戏整体的策略上限；对于依赖逐轮决策与离散双峰体验的 Slot 改玩法，可以减少操作，但不能移除玩家对下一次 Spin 的主动触发权。",
    nodes: ["operate", "perform", "repeat", "manual-spin", "anticipation", "double-peak", "c1", "c2", "result"],
    edges: ["operate-perform", "perform-repeat", "manual-anticipation", "anticipation-peaks", "peaks-return", "c1-c2", "c2-result"],
    zones: ["rhythm", "autospin", "first-peak", "second-peak"]
  },
  pool: {
    label: "洞察 5 · 有效池与盘面容量",
    title: "盘面扩大时，优先增加重复实例和品质跨度，不要按面积同比增加符号种类。",
    copy: "C 决定一次承载多少内容，T 决定玩家需要区分多少类型，P 决定副本、权重与构筑长度，D = C ÷ T 用于观察同类机会是否被种类扩张稀释。",
    boundary: "分析边界：D 是比较同屏机会的粗略指标，不替代真实抽取权重、匹配规则与玩家的锁定、重抽或候选池修正能力。",
    nodes: ["pool-capacity", "pool-types", "pool-total", "pool-density"],
    edges: [],
    zones: ["pool"]
  },
  hybrid: {
    label: "高风险组合 · Slot改+战斗",
    title: "同时保护 C₁ 的大奖识别，并让 C₂ 的战斗结果保持悬念。",
    copy: "这种组合既改写基础协同，又通过战斗过程二次揭晓 C₁ 的兑现程度，最容易让两个体验阶段相互侵占。棋盘过大、符号过多或关系过深，会先削弱第一峰；结果过早可计算，又会削弱第二峰。",
    boundary: "设计约束：控制棋盘大小、符号类型、关系层数与跨区域依赖；让 C₁ 保持即时可读，并让 C₂ 的战斗时序紧凑。",
    nodes: ["reveal", "c1", "c2", "result", "pool-capacity", "pool-types", "pool-density"],
    edges: ["reveal-c1", "c1-c2", "c2-result"],
    zones: ["first-peak", "second-peak", "pool"]
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
    label: "第一峰 · 揭晓与协同",
    title: "Random 与 Put 形成可见盘面，玩家借助 C₁ 立即读懂大致价值。",
    copy: "该阶段从 Pool_Symbol 开始，到 Show_State 被 C₁ 即时识别结束。玩家关心“抽到了什么、怎样落下、这次大概好不好”。",
    nodes: ["pool", "random", "spin-symbol", "put", "show-tp", "show-state", "c1"],
    edges: ["pool-random", "random-symbol", "symbol-put", "put-state", "state-c1"],
    zones: ["source", "reveal"]
  },
  settle: {
    label: "第二峰 · 二次揭晓",
    title: "C₂ 依托 C₁ 协同，由道具增强、转译或继续揭晓结果。",
    copy: "C₁ 读取直接产出、数量阈值和邻接关系；C₂ 可以接续、并行或嵌入协同结算，最终形成 Spin_Result。它不重新负责随机抽取或落位。",
    nodes: ["show-state", "show-tp", "c1", "c2", "spin-result"],
    edges: ["state-c1", "c1-settle", "c1-c2", "c2-result"],
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

const COGNITION_SCORE_CASES = {
  slot: {
    name: "传统 Slot",
    role: "基准样本",
    summary: "相同符号、支付线与数量关系能够直接形成稳定图形；完整理解可以继续涉及赔率和特殊符号，但不阻塞中奖识别。",
    conclusion: "看见图形 → 直接认出价值",
    recognition: {
      score: 1,
      rawTotal: 1,
      denominator: 8,
      formula: "1 ÷ 8 × 10 = 1.25，四舍五入为 1",
      items: [
        ["图形压缩成本", 0, "相同符号与支付线直接形成整体图形。"],
        ["特征整合成本", 0, "依靠同类连续这一显著模式即可判断。"],
        ["视觉搜索成本", 1, "需要扫描支付线覆盖的盘面，但不必跨多个区域反复比对。"],
        ["映射稳定成本", 0, "相同支付线与符号数量长期表达相同价值方向。"]
      ]
    },
    knowledge: {
      necessaryScore: 2,
      completeScore: 4,
      necessaryTotal: 2,
      completeTotal: 5,
      necessaryFormula: "2 ÷ 12 × 10 = 1.67，四舍五入为 2",
      completeFormula: "5 ÷ 12 × 10 = 4.17，四舍五入为 4",
      items: [
        ["规则调用", 0, 1, "必要：成熟 Slot 先验即可。完整：还需理解 Wild、Scatter 等少量稳定规则。"],
        ["关系跨越", 1, 1, "必要与完整解释都只需理解一层支付线关系。"],
        ["状态保持", 0, 1, "必要：当前盘面已包含信息。完整：可能还需同时查看赔率表或符号价值表。"],
        ["因果推演", 0, 0, "组合成立便直接产生价值，完整解释也无需继续推演。"],
        ["时间跨度", 0, 0, "当前静态盘面足够，无需追踪前后状态。"],
        ["数值计算", 1, 2, "必要：简单计算连续符号数量。完整：需汇总赔率、特殊符号和多个收益来源。"]
      ]
    },
    internalization: {
      score: 1,
      rawTotal: 1,
      formula: "0 + 0 + 0 + 0 + 1 = 1",
      items: [
        ["图形压缩难度", 0, "支付线天然对应稳定的连线和连续图形。"],
        ["映射不稳定性", 0, "相同支付线图形长期表达相同价值方向。"],
        ["关系非局部性", 0, "相关符号连续并同时可见。"],
        ["反馈不清晰度", 0, "基础中奖与价值方向会被立即、明确地反馈。"],
        ["例外密度", 1, "Wild、Scatter 等带来少量特殊符号和例外条件。"]
      ]
    }
  },
  cloverpit: {
    name: "《四叶草深渊》",
    role: "继承样本",
    summary: "传统支付线、同类与连线仍承担当前 Spin 的 C₁ 即时识别；倍率、连击与债务压力属于 C₂ 或外层循环，不计入本节的 C₁ 入口评分。",
    conclusion: "看见支付线与同类 → 认出基础 C₁；倍率与连击留到 C₂",
    recognition: {
      score: 1,
      rawTotal: 1,
      denominator: 8,
      formula: "1 ÷ 8 × 10 = 1.25，四舍五入为 1",
      items: [
        ["图形压缩成本", 0, "相同符号与支付线仍能直接形成整体图形。"],
        ["特征整合成本", 0, "依靠同类连续这一成熟模式即可判断，基础识别入口没有被重写。"],
        ["视觉搜索成本", 1, "需要沿支付线扫描 5×4 盘面，但不必跨多个区域反复匹配。"],
        ["映射稳定成本", 0, "基础 C₁ 的价值方向稳定；倍率与连击属于 C₂，不计入本项。"]
      ]
    },
    knowledge: {
      necessaryScore: 2,
      completeScore: 4,
      necessaryTotal: 2,
      completeTotal: 5,
      necessaryFormula: "2 ÷ 12 × 10 = 1.67，四舍五入为 2",
      completeFormula: "5 ÷ 12 × 10 = 4.17，四舍五入为 4",
      items: [
        ["规则调用", 0, 1, "必要：成熟 Slot 先验即可。完整：还需理解少量特殊符号规则。"],
        ["关系跨越", 1, 1, "必要与完整解释都只需理解一层支付线关系。"],
        ["状态保持", 0, 1, "必要：当前盘面已包含信息。完整：可能还需同时查看赔率表。"],
        ["因果推演", 0, 0, "组合成立便直接产生价值，完整解释也无需继续推演。"],
        ["时间跨度", 0, 0, "当前静态盘面足够；C₂ 与外层循环不计入当前 C₁。"],
        ["数值计算", 1, 2, "必要：简单计算同类数量。完整：需汇总赔率与特殊符号收益。"]
      ]
    },
    internalization: {
      score: 1,
      rawTotal: 1,
      formula: "0 + 0 + 0 + 0 + 1 = 1",
      items: [
        ["图形压缩难度", 0, "支付线和同类符号天然形成稳定图形。"],
        ["映射不稳定性", 0, "基础 C₁ 的相同图形长期表达相同价值方向。"],
        ["关系非局部性", 0, "支付线范围清楚、连续并且同时可见。"],
        ["反馈不清晰度", 0, "基础命中反馈明确，能够与后续 C₂ 演绎区分。"],
        ["例外密度", 1, "特殊符号带来少量需要学习的例外。"]
      ]
    }
  },
  landlord: {
    name: "《幸运房东》",
    role: "良好样本",
    summary: "邻接和现实语义让新 C₁ 仍可被压缩为局部图形；知的入口浅，但完整解释符号、道具和收益关系可以较深。",
    conclusion: "理解局部关系 → 压缩为图形 → 直接认出价值",
    recognition: {
      score: 5,
      rawTotal: 4,
      denominator: 8,
      formula: "4 ÷ 8 × 10 = 5",
      items: [
        ["图形压缩成本", 1, "需要读取少量符号后，才能把猫与牛奶、蜜蜂与花等组合成局部图形块。"],
        ["特征整合成本", 1, "需要同时识别符号语义与邻接关系。"],
        ["视觉搜索成本", 1, "需要扫描盘面寻找局部组合，但不必跨多个独立区域反复比对。"],
        ["映射稳定成本", 1, "基础关系稳定，但少量公开道具会修改组合价值。"]
      ]
    },
    knowledge: {
      necessaryScore: 2,
      completeScore: 7,
      necessaryTotal: 2,
      completeTotal: 8,
      necessaryFormula: "2 ÷ 12 × 10 = 1.67，四舍五入为 2",
      completeFormula: "8 ÷ 12 × 10 = 6.67，四舍五入为 7",
      items: [
        ["规则调用", 0, 2, "必要：基础关系可借助广泛熟悉的现实语义。完整：需调用大量符号、道具、条件和特殊规则。"],
        ["关系跨越", 1, 1, "必要与完整解释主要都发生在一层局部邻接关系中。"],
        ["状态保持", 0, 1, "必要：只看当前盘面。完整：需同时保持少量公开道具修饰。"],
        ["因果推演", 0, 2, "必要：基础语义关系成立即可判断。完整：包含生成、消除和转换等多阶段因果链。"],
        ["时间跨度", 0, 0, "当前盘面和公开构筑状态足以解释本次 C₁。"],
        ["数值计算", 1, 2, "必要：简单计数组合数量。完整：需汇总多个符号、道具和触发来源的收益。"]
      ]
    },
    internalization: {
      score: 4,
      rawTotal: 4,
      formula: "1 + 1 + 0 + 1 + 1 = 4",
      items: [
        ["图形压缩难度", 1, "需要学习后，才能把符号语义和邻接关系压缩成局部图形块。"],
        ["映射不稳定性", 1, "少量可见道具会改变基础组合的价值。"],
        ["关系非局部性", 0, "多数核心关系位于一个局部邻接范围。"],
        ["反馈不清晰度", 1, "收益反馈可见，但多个同时触发的来源需要辨认。"],
        ["例外密度", 1, "道具和特殊符号构成少量公开例外。"]
      ]
    }
  },
  mayor: {
    name: "《幸运市长》",
    role: "问题样本",
    summary: "C₁ 同时要求识别四个 0D 集合并推演跨集合资源产销；必要理解已接近完整理解，且动态供需难以压缩成一个稳定图形。",
    conclusion: "四集合识别 → 检查状态 → 推演资源产销 → 得出价值",
    recognition: {
      score: 9,
      rawTotal: 7,
      denominator: 8,
      formula: "7 ÷ 8 × 10 = 8.75，四舍五入为 9",
      items: [
        ["图形压缩成本", 2, "四个集合与跨集合关系无法形成单一局部图形。"],
        ["特征整合成本", 2, "需同时整合集合归属、资源类型和产销关系。"],
        ["视觉搜索成本", 2, "必须在四个区域之间反复查找与匹配。"],
        ["映射稳定成本", 1, "符号价值会随其他集合的供需状态变化。"]
      ]
    },
    knowledge: {
      necessaryScore: 8,
      completeScore: 9,
      necessaryTotal: 10,
      completeTotal: 11,
      necessaryFormula: "10 ÷ 12 × 10 = 8.33，四舍五入为 8",
      completeFormula: "11 ÷ 12 × 10 = 9.17，四舍五入为 9",
      items: [
        ["规则调用", 2, 2, "必要：判断方向已需理解多个集合的职能与产销规则。完整：还需覆盖建筑、道具和外部修饰。"],
        ["关系跨越", 2, 2, "必须跨越多个 0D 集合重建关系。"],
        ["状态保持", 2, 2, "必须同时保持四个集合及多类资源状态。"],
        ["因果推演", 2, 2, "生产、消耗、修饰和兑现形成多阶段链条。"],
        ["时间跨度", 1, 2, "必要：当前判断需参考累积状态。完整：还需追踪多个 Spin 或阶段的持续变化。"],
        ["数值计算", 1, 1, "需要比较供需与兑现关系，但未达到多来源复杂换算。"]
      ]
    },
    internalization: {
      score: 9,
      rawTotal: 9,
      formula: "2 + 2 + 2 + 1 + 2 = 9",
      items: [
        ["图形压缩难度", 2, "跨集合因果链无法稳定映射成一个可见静态图形。"],
        ["映射不稳定性", 2, "同一符号价值会随动态供需和其他集合状态频繁反转。"],
        ["关系非局部性", 2, "关系跨四个集合、多个时刻和多跳链条。"],
        ["反馈不清晰度", 1, "最终产出可见，但多个贡献来源需要辨认。"],
        ["例外密度", 2, "建筑、道具和外部规则持续改写已经形成的判断模式。"]
      ]
    }
  }
};

let cognitionScoreDialogTrigger = null;
let cognitionScoreDialogCase = "slot";

function scoreItemsMarkup(items, mode = "single") {
  return items.map((item) => {
    const label = item[0];
    const first = item[1];
    const second = mode === "knowledge" ? item[2] : null;
    const copy = mode === "knowledge" ? item[3] : item[2];
    const scores = mode === "knowledge"
      ? `<span><b>${first}<em>/2</em></b><small>必要</small></span><span><b>${second}<em>/2</em></b><small>完整</small></span>`
      : `<span><b>${first}<em>/2</em></b><small>单项分</small></span>`;
    return `<li><div><strong>${escapeHtml(label)}</strong><p>${escapeHtml(copy)}</p></div><div class="cognition-raw-scores">${scores}</div></li>`;
  }).join("");
}

function renderCognitionScoreDialog(caseKey, focus = "recognition") {
  const entry = COGNITION_SCORE_CASES[caseKey];
  if (!entry || !elements.cognitionScoreDialogContent) return;
  cognitionScoreDialogCase = caseKey;
  elements.cognitionScoreDialogTitle.textContent = `${entry.name} · 评分详细计算`;
  elements.cognitionScoreDialogSummary.textContent = `${entry.role}｜${entry.summary}`;
  elements.cognitionScoreDialog.querySelectorAll("[data-cognition-dialog-focus]").forEach((button) => {
    const selected = button.dataset.cognitionDialogFocus === focus;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  const recognition = entry.recognition;
  const knowledge = entry.knowledge;
  const internalization = entry.internalization;
  elements.cognitionScoreDialogContent.innerHTML = `
    <section class="cognition-score-detail ${focus === "recognition" ? "is-focused" : ""}" data-cognition-detail="recognition">
      <header><div><span>认</span><h4>即时识别成本</h4></div><strong>${recognition.score}<small>/10</small></strong></header>
      <ol>${scoreItemsMarkup(recognition.items)}</ol>
      <p class="cognition-score-formula">${escapeHtml(recognition.formula)}</p>
    </section>
    <section class="cognition-score-detail ${focus === "knowledge" ? "is-focused" : ""}" data-cognition-detail="knowledge">
      <header><div><span>知</span><h4>必要理解 → 完整理解</h4></div><strong>${knowledge.necessaryScore} → ${knowledge.completeScore}<small>/10</small></strong></header>
      <ol>${scoreItemsMarkup(knowledge.items, "knowledge")}</ol>
      <div class="cognition-knowledge-formulas"><p><b>必要</b>${escapeHtml(knowledge.necessaryFormula)}</p><p><b>完整</b>${escapeHtml(knowledge.completeFormula)}</p></div>
    </section>
    <section class="cognition-score-detail ${focus === "internalization" ? "is-focused" : ""}" data-cognition-detail="internalization">
      <header><div><span>内化</span><h4>认知内化难度</h4></div><strong>${internalization.score}<small>/10</small></strong></header>
      <ol>${scoreItemsMarkup(internalization.items)}</ol>
      <p class="cognition-score-formula">${escapeHtml(internalization.formula)}</p>
    </section>
    <aside><b>案例路径</b><p>${escapeHtml(entry.conclusion)}</p></aside>
  `;
  requestAnimationFrame(() => {
    elements.cognitionScoreDialogContent
      .querySelector(`[data-cognition-detail="${CSS.escape(focus)}"]`)
      ?.scrollIntoView({ block: "start", behavior: "instant" });
  });
}

function openCognitionScoreDialog(trigger) {
  cognitionScoreDialogTrigger = trigger;
  const caseKey = trigger.dataset.cognitionScoreCase;
  const focus = trigger.dataset.cognitionScoreFocus || "recognition";
  renderCognitionScoreDialog(caseKey, focus);
  if (typeof elements.cognitionScoreDialog.showModal === "function") {
    elements.cognitionScoreDialog.showModal();
  } else {
    elements.cognitionScoreDialog.setAttribute("open", "");
  }
}

function closeCognitionScoreDialog() {
  if (typeof elements.cognitionScoreDialog.close === "function") {
    elements.cognitionScoreDialog.close();
  } else {
    elements.cognitionScoreDialog.removeAttribute("open");
  }
}

function bindCognitionScoreDialog() {
  if (!elements.cognitionScoreDialog) return;
  document.querySelectorAll("[data-cognition-score-case]").forEach((trigger) => {
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-controls", "cognition-score-dialog");
    trigger.addEventListener("click", () => openCognitionScoreDialog(trigger));
  });
  elements.cognitionScoreDialogClose.addEventListener("click", closeCognitionScoreDialog);
  elements.cognitionScoreDialog.addEventListener("click", (event) => {
    if (event.target === elements.cognitionScoreDialog) closeCognitionScoreDialog();
  });
  elements.cognitionScoreDialog.addEventListener("close", () => {
    cognitionScoreDialogTrigger?.focus();
  });
  elements.cognitionScoreDialog.querySelectorAll("[data-cognition-dialog-focus]").forEach((button) => {
    button.addEventListener("click", () => {
      renderCognitionScoreDialog(cognitionScoreDialogCase, button.dataset.cognitionDialogFocus);
    });
  });
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
  if (
    value === "ecosystem"
    || value === "ecosystem-content"
    || value === "ecosystem-baseline"
  ) {
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
      libraryProductScope: state.libraryProductScope,
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
      selectedEcosystemCoordinateView: state.selectedEcosystemCoordinateView,
      selectedEcosystemNicheId: state.selectedEcosystemNicheId,
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
  loaded.variantByProductId = new Map(
    loaded.variants.flatMap((variant) =>
      (variant.product_ids ?? []).map((productId) => [productId, variant])
    )
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

function isCurrentLibraryProduct(product) {
  return (product.prototype_ids ?? []).length > 0;
}

function currentLibraryProducts() {
  return state.data.products.filter(isCurrentLibraryProduct);
}

function historicalLibraryProducts() {
  return state.data.products.filter((product) => !isCurrentLibraryProduct(product));
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
  if (
    product.status === "reference_confirmed"
    || product.status === "reference_confirmed_content_unprocessed"
  ) {
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

const ECOSYSTEM_SALES_TIERS = [
  { min: 1000000, key: "gte-1000k", label: "100万+", rank: 7 },
  { min: 500000, key: "gte-500k", label: "50万+", rank: 6 },
  { min: 200000, key: "gte-200k", label: "20万+", rank: 5 },
  { min: 100000, key: "gte-100k", label: "10万+", rank: 4 },
  { min: 50000, key: "gte-50k", label: "5万+", rank: 3 },
  { min: 10000, key: "gte-10k", label: "1万+", rank: 2 },
  { min: 0, key: "lt-10k", label: "1万-", rank: 1 }
];

const ECOSYSTEM_SALES_FILTER_OPTIONS = [
  ["unknown", "未知"],
  ["lt-10k", "< 1 万"],
  ["gte-10k", "> 1 万"],
  ["gte-50k", "> 5 万"],
  ["gte-100k", "> 10 万"],
  ["gte-200k", "> 20 万"],
  ["gte-500k", "> 50 万"],
  ["gte-1000k", "> 100 万"]
];

function ecosystemSalesFilterMatches(sales, filterValue) {
  if (!sales || !filterValue) return false;
  if (filterValue === "unknown") return sales.tierKey === "unknown";
  if (filterValue === "lt-10k") return sales.tierKey === "lt-10k";
  const threshold = ECOSYSTEM_SALES_TIERS.find((tier) => tier.key === filterValue)?.min;
  return Number.isFinite(threshold)
    && Number.isFinite(sales.salesEstimate)
    && sales.salesEstimate >= threshold;
}

function ecosystemSalesSnapshot(product) {
  const record = state.data.salesEstimateByProductId.get(product.id);
  const source = String(state.data.salesEstimatesSource?.name ?? "").trim() || "未知";
  const updatedAt = String(state.data.salesEstimatesSource?.fetched_at ?? "").slice(0, 10) || "未知";
  const hasEstimate = record?.status === "estimated"
    && Number.isFinite(record?.units_estimate)
    && record.units_estimate >= 0;

  if (!hasEstimate) {
    return {
      salesEstimate: null,
      salesSource: source,
      salesUpdatedAt: updatedAt,
      salesStatus: "unknown",
      displayTier: "未知",
      displayEstimate: "未知",
      calculationValue: 0,
      tierRank: 0,
      tierKey: "unknown",
      nodeLabel: "销量 未知"
    };
  }

  const salesEstimate = record.units_estimate;
  const tier = ECOSYSTEM_SALES_TIERS.find((item) => salesEstimate >= item.min)
    ?? ECOSYSTEM_SALES_TIERS.at(-1);
  return {
    salesEstimate,
    salesSource: source,
    salesUpdatedAt: updatedAt,
    salesStatus: "estimated",
    displayTier: tier.label,
    displayEstimate: `约 ${compactChineseCount(salesEstimate)}`,
    calculationValue: salesEstimate,
    tierRank: tier.rank,
    tierKey: tier.key,
    nodeLabel: `销量 ${tier.label}`
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
  const reviewPercentage = Number.isInteger(metadata?.positive_percentage)
    ? metadata.positive_percentage
    : null;

  return {
    dateLabel,
    dateValue,
    reviewLabel,
    reviewCount,
    reviewTone,
    reviewPercentage
  };
}

function ecosystemSteamReviewSnapshot(product) {
  const metadata = steamMetadataCopy(product);
  const hasReview = metadata.reviewPercentage !== null
    && metadata.reviewLabel !== "暂无用户评测";
  return {
    display: hasReview
      ? `${metadata.reviewLabel}-${metadata.reviewPercentage}%`
      : "评价未知",
    tone: hasReview ? metadata.reviewTone : "none"
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
  if (!isCurrentLibraryProduct(product)) {
    return {
      path: ["历史资料", "未分类", "未建立游戏变体"],
      depth: "unclassified"
    };
  }

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
  const currentProducts = currentLibraryProducts();
  const historicalProducts = historicalLibraryProducts();
  const unprocessedProducts = currentProducts.filter((product) => (
    product.status === "reference_confirmed_content_unprocessed"
  ));
  const values = [
    [currentProducts.length, "当前游戏"],
    [historicalProducts.length, "历史资料／未分类"],
    [unprocessedProducts.length, "资料暂未处理"],
    [nodes.length, "模型节点"],
    [`${confirmed}/${reviewItems.length}`, pending ? `已确认 · ${pending} 项待确认` : "公式字段均已确认"]
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
  const currentScope = state.libraryProductScope === "current";
  const scopedProducts = currentScope ? currentLibraryProducts() : historicalLibraryProducts();
  const currentCount = currentLibraryProducts().length;
  const historicalCount = historicalLibraryProducts().length;
  elements.productScopeButtons.forEach((button) => {
    const active = button.dataset.libraryProductScope === state.libraryProductScope;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
    const count = button.dataset.libraryProductScope === "current" ? currentCount : historicalCount;
    const countElement = button.querySelector("b");
    if (countElement) countElement.textContent = String(count);
  });
  elements.productCatalogEyebrow.textContent = currentScope ? "当前游戏" : "历史资料／未分类";
  elements.productCatalogTitle.textContent = currentScope ? "当前品类生态游戏" : "历史资料／未分类";
  elements.motherFilter.hidden = !currentScope;
  elements.prototypeFilter.closest("label").hidden = !currentScope;
  elements.productFilter.closest("label").hidden = !currentScope;
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

  const slotMotherProductCount = currentLibraryProducts().filter((product) =>
    product.mother_ids?.includes("mechanism.slot")
  ).length;
  const prototypeProductCount = state.libraryPrototypeFilter === "all"
    ? 0
    : currentLibraryProducts().filter((product) =>
      product.prototype_ids?.includes(state.libraryPrototypeFilter)
    ).length;
  const products = scopedProducts
    .filter((product) => {
      if (
        currentScope
        &&
        state.librarySlotMotherOnly
        && !product.mother_ids?.includes("mechanism.slot")
      ) {
        return false;
      }
      if (
        currentScope
        &&
        state.libraryPrototypeFilter !== "all"
        && !product.prototype_ids?.includes(state.libraryPrototypeFilter)
      ) {
        return false;
      }
      const filter = state.libraryProductFilter;
      if (
        currentScope
        &&
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
    <span> / ${scopedProducts.length} 款${currentScope ? "当前游戏" : "历史资料"}</span>
    <small>
      ${currentScope
        ? `${state.librarySlotMotherOnly ? `Slot 母体共 ${slotMotherProductCount} 款；` : "当前显示全部母体；"}
          ${state.libraryPrototypeFilter !== "all"
            ? `${escapeHtml(selectedPrototype?.name ?? "所选品类原型")}共 ${prototypeProductCount} 款；`
            : "全部品类原型；"}`
        : "旧版迁入且尚未归入当前四个品类；不进入主游戏库和待确认队列；"}
      ${state.libraryProductSort === "sales_desc" ? "按销量数据从高到低排列；" : "默认排序；"}
      ${currentScope ? "6 款游戏摘要等资料暂未处理。" : "仅供历史回溯。"}
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
        : isCurrentLibraryProduct(product)
          ? "变体游戏"
          : "历史资料";
      const prototypeIdentity = classification.path[1] ?? "未分类";
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

function productFormulaObservationMarkup(observation, variant) {
  if (!observation) {
    return `
      <div class="product-detail-empty">
        这款产品没有旧版 v5 观察记录；保留当前新版资料，等待后续正式拆解。
      </div>
    `;
  }

  const mechanical = observation.mapping_status === "mechanical_import_unconfirmed";
  const confirmed = observation.review_status === "confirmed";
  const reviewClass = confirmed ? "confirmed" : (mechanical ? "draft" : "pending");
  const reviewLabel = confirmed
    ? "已确认"
    : (mechanical ? "机械迁移 · 待确认" : "工作定义 · 待确认");
  return `
    <section class="product-detail-section product-detail-formula-section">
      <div class="product-detail-section-head">
        <div>
          <p class="eyebrow">${mechanical ? "旧资料 → 公式" : "游戏 → 公式"}</p>
          <h4>${mechanical ? "旧版资料映射到体验公式" : "产品工作定义映射到体验公式"}</h4>
        </div>
        <span class="review-badge ${reviewClass}">
          ${reviewLabel}
        </span>
      </div>
      <div class="product-formula-observations">
        ${FORMULA_FIELDS.map((field) => {
          const entry = observation.fields[field];
          const evidenceEntry = variant?.formula_changes?.[field];
          const evidenceImages = fieldEvidenceImages(evidenceEntry);
          return `
            <article class="${evidenceImages.length ? "has-evidence-images" : ""}">
              <header>
                <code>${escapeHtml(formulaDisplayKey(field))}</code>
                <span>${escapeHtml(FIELD_LABELS[field])}</span>
              </header>
              <p>${escapeHtml(entry.value)}</p>
              <small>${mechanical ? "旧版来源" : "当前依据"}：${entry.source_fields.map(escapeHtml).join(" · ")}</small>
              ${evidenceImages.length ? `
                <div class="product-formula-evidence">
                  <span>相关实机配图 · 点击放大</span>
                  ${fieldEvidencePreviewMarkup(evidenceImages, {
                    className: "product-detail-field-evidence",
                    label: `${formulaDisplayKey(field)} · ${FIELD_LABELS[field]}配图`
                  })}
                </div>
              ` : ""}
            </article>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function productDetailDimensionMarkup(position) {
  if (!position?.dimensions) return "";
  return `
    <section class="product-detail-section product-detail-dimensions">
      <div class="product-detail-section-head">
        <div>
          <p class="eyebrow">三维评分</p>
          <h4>当前品类观察坐标</h4>
        </div>
      </div>
      <div class="product-detail-dimension-grid">
        ${ECOSYSTEM_DIMENSION_KEYS.map((key, index) => {
          const dimension = position.dimensions[key];
          const band = ecosystemDimensionBand(dimension.score);
          return `
            <article class="band-${escapeHtml(band.key)}">
              <span>维度 ${index + 1}</span>
              <header>
                <strong>${escapeHtml(ECOSYSTEM_DIMENSIONS[key].label)}</strong>
                <b>${dimension.score}<i>/ 4</i><em>${escapeHtml(band.label)}</em></b>
              </header>
              <p>${escapeHtml(dimension.basis)}</p>
            </article>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function productDetailLegacyMarkup(observation) {
  const hasLegacyAnalysis = observation?.legacy_summary || observation?.legacy_scores;
  const hasSupplemental = observation?.supplemental?.pool_active_desc;
  if (!hasLegacyAnalysis && !hasSupplemental) return "";

  const scoreLabels = {
    random: "Random",
    combo: "Combo",
    pool: "Pool",
    structure: "Structure"
  };
  return `
    <details class="product-detail-legacy">
      <summary>历史资料 · 旧版 V5</summary>
      ${hasLegacyAnalysis ? `
        <section>
          <h4>旧版分析摘要与评分</h4>
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
      ${hasSupplemental ? `
        <section>
          <h4>旧版第二池／修饰池资料</h4>
          <p>${escapeHtml(observation.supplemental.pool_active_desc)}</p>
          <small>历史资料仅供回溯；当前正式判断以本页已确认公式字段为准。</small>
        </section>
      ` : ""}
    </details>
  `;
}

function openProductDetail(productId) {
  const product = state.data.productById.get(productId);
  if (!product) return;
  const observation = state.data.productObservationById.get(productId);
  const variant = state.data.variantByProductId.get(productId);
  const classification = productClassification(product);
  const classificationStatus = classificationStatusCopy(product);
  const sourceUrl = safeHttpUrl(product.source_url);
  const coverUrl = safeHttpUrl(product.header_image_url);
  const tags = product.tags ?? [];
  const prototypeConfig = (product.prototype_ids ?? [])
    .map((prototypeId) => state.data.ecosystemByPrototypeId.get(prototypeId))
    .find(Boolean);
  const position = ecosystemPosition(prototypeConfig, product.id);
  const sales = ecosystemSalesSnapshot(product);
  const steam = steamMetadataCopy(product);
  const steamReview = ecosystemSteamReviewSnapshot(product);
  const formulaConfirmed = observation?.review_status === "confirmed";
  state.selectedProductId = productId;

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
          <span class="review-badge ${formulaConfirmed ? "confirmed" : "pending"}">
            ${formulaConfirmed ? "公式已确认" : "公式待确认"}
          </span>
        </div>
        <p class="eyebrow">游戏资料</p>
        <h3 id="product-detail-title">${escapeHtml(product.name)}</h3>
        ${product.name_en ? `<p class="product-detail-name-en">${escapeHtml(product.name_en)}</p>` : ""}
        <p class="product-detail-summary">${escapeHtml(product.summary)}</p>
      </div>
    </header>

    <div class="product-detail-meta">
      ${productMetaItem("开发者", product.developer || "旧资料未填写")}
      ${productMetaItem(steam.dateLabel, steam.dateValue)}
      ${productMetaItem("销量估算", sales.displayEstimate)}
      ${productMetaItem("Steam 用户评价", steamReview.display)}
    </div>

    ${tags.length ? `
      <div class="product-detail-tags">
        ${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
      </div>
    ` : ""}

    ${productDetailDimensionMarkup(position)}

    <section class="product-detail-section classification">
      <div class="product-detail-section-head">
        <div>
          <p class="eyebrow">分类路径</p>
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

    ${productFormulaObservationMarkup(observation, variant)}

    ${productDetailLegacyMarkup(observation)}

    <footer class="product-detail-footer">
      <span>${formulaConfirmed ? "当前公式资料已确认" : "当前公式资料仍待确认"}</span>
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

const ECOSYSTEM_DIMENSION_KEYS = ["cognitive_load", "spin_intervention", "c2_reveal_depth"];

const ECOSYSTEM_DIMENSIONS = {
  cognitive_load: {
    label: "认知负担",
    shortLabel: "认知",
    low: "依靠先验，立即读懂",
    high: "需要持续计算或系统学习",
    boundary: "只评价 Random → Put → C₁ 中对本次结果好坏的即时理解；不计 BD、长期资源规划或多轮策略深度。",
    scores: {
      0: { title: "立即读懂", copy: "依靠 Slot 或装置先验，看到结果即可判断本轮好坏。" },
      1: { title: "少量直观关系", copy: "只需识别一种新增规则或少量直观关系，不需要持续推理。" },
      2: { title: "多项关系组合", copy: "需要理解若干自定义符号、角色或协同关系，才能判断本轮好坏。" },
      3: { title: "多状态持续追踪", copy: "需要同时追踪多类状态、资源或关系，并在最小爽环中持续修正判断。" },
      4: { title: "系统化学习或计算", copy: "最小爽环本身就要求系统学习或持续计算，无法依靠局部直觉判断。" }
    }
  },
  spin_intervention: {
    label: "单次介入强度",
    shortLabel: "操作",
    low: "从 Spin 到结果自动运行",
    high: "精细连续控制成为主体",
    boundary: "只统计启动本次 Spin 到 Spin_Result 封闭之间的操作；不计 BD、下一轮准备或长期构筑。",
    scores: {
      0: { title: "全程自动运行", copy: "Spin 启动后自动运行到结果封闭，玩家不介入。" },
      1: { title: "一次有限介入", copy: "只有一次或极少量可选操作，不持续改变主流程。" },
      2: { title: "数次离散操作", copy: "存在数次分散操作，玩家会改变局部结果、落位或顺序。" },
      3: { title: "连续多步选择", copy: "需要连续作出有意义的选择，或多次移动、释放与确认。" },
      4: { title: "精细连续控制", copy: "精细、连续控制成为单 Spin 主体，操作贯穿结果封闭过程。" }
    }
  },
  c2_reveal_depth: {
    label: "二次揭晓深度",
    shortLabel: "演绎",
    low: "基础结果立即或快速封闭",
    high: "结果链式持续生成",
    boundary: "衡量围绕 C₁ 协同的关键结果信息如何继续释放；C₂ 可接续、并行或嵌套，不按动画时长、攻击次数或战斗系统复杂度计分。",
    scores: {
      0: { title: "无独立 C₂", copy: "仅由 C₁ 直接产生 Spin_Result，没有新的信息释放阶段。" },
      1: { title: "确定结果展示", copy: "答案在协同判定过程中已经封闭，后续只播放已知结果。" },
      2: { title: "单次关键揭晓", copy: "至少释放一个此前未知的关键信息，使玩家明显更新一次预测。" },
      3: { title: "多阶段递进揭晓", copy: "前段结果改变后段条件，玩家需要多次修正预测。" },
      4: { title: "链式持续揭晓", copy: "结果继续生成新的结果节点，链长或结束时间事前可能未知。" }
    }
  }
};

const ECOSYSTEM_COORDINATE_VIEWS = {
  "operation-c2": {
    label: "操作 × 演绎",
    x: "spin_intervention",
    y: "c2_reveal_depth",
    auxiliary: "cognitive_load"
  },
  "cognition-operation": {
    label: "认知 × 操作",
    x: "cognitive_load",
    y: "spin_intervention",
    auxiliary: "c2_reveal_depth"
  },
  "cognition-c2": {
    label: "认知 × 演绎",
    x: "cognitive_load",
    y: "c2_reveal_depth",
    auxiliary: "spin_intervention"
  }
};

function ecosystemDimensionBand(score) {
  if (!Number.isInteger(score)) return { key: "unknown", label: "未知" };
  if (score <= 1) return { key: "low", label: "低" };
  if (score === 2) return { key: "mid", label: "中" };
  return { key: "high", label: "高" };
}

function ecosystemAxisScoreTicks(dimensionKey, axis) {
  const dimension = ECOSYSTEM_DIMENSIONS[dimensionKey];
  const scores = axis === "y" ? [4, 3, 2, 1, 0] : [0, 1, 2, 3, 4];
  if (!dimension) return "";
  return `
    <span class="ecosystem-coordinate-ticks">
      ${scores.map((score) => {
        const info = dimension.scores?.[score];
        const band = ecosystemDimensionBand(score);
        const popoverId = `ecosystem-axis-${axis}-${dimensionKey}-${score}`;
        return `
          <span class="ecosystem-coordinate-axis-score" data-axis-score="${score}">
            <b>${score}</b>
            <button type="button" class="ecosystem-coordinate-axis-help"
              data-ecosystem-axis-help
              aria-label="查看${escapeHtml(dimension.label)} ${score} 分说明"
              aria-expanded="false"
              aria-describedby="${escapeHtml(popoverId)}">?</button>
            <span class="ecosystem-coordinate-axis-popover" id="${escapeHtml(popoverId)}" role="tooltip">
              <small>${axis === "x" ? "横轴" : "纵轴"} · ${escapeHtml(dimension.shortLabel)} · ${score} 分 · ${escapeHtml(band.label)}档</small>
              <strong>${escapeHtml(info?.title ?? "分值说明")}</strong>
              <span>${escapeHtml(info?.copy ?? "暂无详细说明。")}</span>
              <i>评分边界：${escapeHtml(dimension.boundary)}</i>
            </span>
          </span>
        `;
      }).join("")}
    </span>
  `;
}

function ecosystemCoordinateScoreTableMarkup(products, positionedProducts, view) {
  const positionByProductId = new Map(
    positionedProducts.map((item) => [item.product.id, item.position])
  );
  const axisRole = (key) => {
    if (key === view.x) return { label: "横轴", className: "is-x-axis" };
    if (key === view.y) return { label: "纵轴", className: "is-y-axis" };
    return { label: "辅助", className: "is-auxiliary" };
  };
  const scoredCount = products.filter((product) => {
    const position = positionByProductId.get(product.id);
    return ECOSYSTEM_DIMENSION_KEYS.every((key) => Number.isInteger(position?.dimensions?.[key]?.score));
  }).length;
  const sortKey = ECOSYSTEM_DIMENSION_KEYS.includes(state.ecosystemScoreTableSortKey)
    ? state.ecosystemScoreTableSortKey
    : null;
  const sortDirection = state.ecosystemScoreTableSortDirection === "desc" ? "desc" : "asc";
  const sourceIndexByProductId = new Map(products.map((product, index) => [product.id, index]));
  const tableProducts = sortKey
    ? [...products].sort((a, b) => {
        const aScore = positionByProductId.get(a.id)?.dimensions?.[sortKey]?.score;
        const bScore = positionByProductId.get(b.id)?.dimensions?.[sortKey]?.score;
        const aMissing = !Number.isInteger(aScore);
        const bMissing = !Number.isInteger(bScore);
        if (aMissing !== bMissing) return aMissing ? 1 : -1;
        if (!aMissing && aScore !== bScore) {
          return sortDirection === "asc" ? aScore - bScore : bScore - aScore;
        }
        return sourceIndexByProductId.get(a.id) - sourceIndexByProductId.get(b.id);
      })
    : products;

  return `
    <section class="ecosystem-coordinate-score-table" aria-labelledby="ecosystem-coordinate-score-table-title">
      <header>
        <div>
          <span>当前品类查分表</span>
          <h4 id="ecosystem-coordinate-score-table-title">品类游戏三维评分</h4>
        </div>
        <p>${products.length} 款游戏 · ${scoredCount} 款已完成三维评分；悬停分数查看定位依据，点击游戏查看完整详情。</p>
      </header>
      <div class="ecosystem-coordinate-score-table-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col" class="${sortKey ? "" : "is-default-order"}">
                <button type="button" class="ecosystem-coordinate-score-default"
                  data-ecosystem-score-sort="default"
                  title="${sortKey ? "清除当前排序，恢复默认顺序" : "当前为默认顺序"}"
                  aria-label="${sortKey ? "清除当前排序，恢复游戏默认顺序" : "游戏当前按默认顺序排列"}"
                  aria-pressed="${!sortKey}">
                  <strong>游戏</strong>
                  <i aria-hidden="true">${sortKey ? "↶" : "✓"}</i>
                </button>
              </th>
              ${ECOSYSTEM_DIMENSION_KEYS.map((key) => {
                const dimension = ECOSYSTEM_DIMENSIONS[key];
                const role = axisRole(key);
                const active = sortKey === key;
                const nextDirection = active && sortDirection === "asc" ? "倒序" : "正序";
                return `
                  <th scope="col" class="${escapeHtml(role.className)} ${active ? "is-sorted" : ""}"
                    aria-sort="${active ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}">
                    <button type="button" class="ecosystem-coordinate-score-sort"
                      data-ecosystem-score-sort="${escapeHtml(key)}"
                      title="按${escapeHtml(dimension.label)}${nextDirection}排列"
                      aria-label="按${escapeHtml(dimension.label)}${nextDirection}排列">
                      <span>${escapeHtml(role.label)}</span>
                      <strong>${escapeHtml(dimension.label)}</strong>
                      <i aria-hidden="true">${active ? (sortDirection === "asc" ? "↑" : "↓") : "↕"}</i>
                    </button>
                  </th>
                `;
              }).join("")}
            </tr>
          </thead>
          <tbody>
            ${tableProducts.map((product) => {
              const position = positionByProductId.get(product.id);
              const status = ecosystemAssessmentStatus(position);
              const sales = ecosystemSalesSnapshot(product);
              const steamReview = ecosystemSteamReviewSnapshot(product);
              const isActive = product.id === state.selectedEcosystemProductId;
              return `
                <tr class="${isActive ? "is-active" : ""}">
                  <th scope="row">
                    <button type="button" data-ecosystem-product="${escapeHtml(product.id)}"
                      aria-pressed="${isActive}">
                      ${ecosystemProductIcon(product)}
                      <span>
                        <strong>${escapeHtml(product.name)}</strong>
                        <small class="ecosystem-coordinate-score-product-metadata">
                          ${position?.role === "cornerstone" ? "<b>品类基石</b>" : ""}
                          <span>销量 ${escapeHtml(sales.displayTier)}</span>
                          <span class="tone-${escapeHtml(ecosystemClassToken(steamReview.tone))}">${escapeHtml(steamReview.display)}</span>
                        </small>
                        ${status.className !== "confirmed" ? `<small class="ecosystem-position-status ${escapeHtml(status.className)}">${escapeHtml(status.label)}</small>` : ""}
                      </span>
                    </button>
                  </th>
                  ${ECOSYSTEM_DIMENSION_KEYS.map((key) => {
                    const score = position?.dimensions?.[key]?.score;
                    const basis = position?.dimensions?.[key]?.basis ?? "尚未补录评分依据。";
                    const band = ecosystemDimensionBand(score);
                    const role = axisRole(key);
                    return `
                      <td class="${escapeHtml(role.className)}" title="${escapeHtml(basis)}">
                        ${Number.isInteger(score) ? `
                          <span class="ecosystem-coordinate-table-score band-${escapeHtml(band.key)}">
                            <strong>${score}<small>/ 4</small></strong><em>${escapeHtml(band.label)}</em>
                          </span>
                        ` : `<span class="ecosystem-coordinate-table-score is-missing">待评分</span>`}
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

function ecosystemAssessmentStatus(position) {
  if (!position?.dimensions) return { label: "待评分", className: "pending" };
  if (position.assessment_status === "needs_playtest") return { label: "待实机复核", className: "draft" };
  return { label: "评分已确认", className: "confirmed" };
}

function ecosystemCurrentCoordinateView() {
  return ECOSYSTEM_COORDINATE_VIEWS[state.selectedEcosystemCoordinateView]
    ?? ECOSYSTEM_COORDINATE_VIEWS["operation-c2"];
}

function ecosystemProjectedPositions(positionedProducts, view) {
  // positions.x / positions.y 仅保留给旧版对照与回滚；当前坐标只读取 dimensions。
  const located = [];
  const unlocated = [];
  positionedProducts.forEach(({ product, position }) => {
    const missing = [view.x, view.y].filter((key) => !Number.isInteger(position.dimensions?.[key]?.score));
    if (missing.length) {
      unlocated.push({ product, position, missing });
      return;
    }
    located.push({
      product,
      position,
      xScore: position.dimensions[view.x].score,
      yScore: position.dimensions[view.y].score
    });
  });

  const groups = new Map();
  located.forEach((item) => {
    const key = `${item.xScore}:${item.yScore}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  });
  const coordinateGroups = [];
  groups.forEach((items, key) => {
    const x = 8 + items[0].xScore * 21;
    const y = 8 + items[0].yScore * 21;
    items.forEach((item, index) => {
      item.x = x;
      item.y = y;
      item.groupIndex = index;
      item.groupSize = items.length;
    });
    coordinateGroups.push({
      key,
      x,
      y,
      xScore: items[0].xScore,
      yScore: items[0].yScore,
      items
    });
  });
  return { located, groups: coordinateGroups, unlocated };
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
  return ecosystemAssessmentStatus(position);
}

function ecosystemFieldState(config, product, field) {
  const variant = state.data.variantByProductId.get(product.id);
  const entry = variant ? rawFingerprint(variant)[field] : null;
  if (!entry || entry.review_status !== "confirmed") {
    return { label: "待确认", className: "pending" };
  }
  if (entry.operation === "inherit") {
    return { label: "同原型", className: "inherited" };
  }
  return { label: "相对原型变化", className: "changed" };
}

function ecosystemFieldComparison(config, selectedProduct, field) {
  const prototype = state.data.prototypeById.get(config.prototype_id);
  const variant = state.data.variantByProductId.get(selectedProduct?.id);
  const prototypeEntry = prototype ? rawFingerprint(prototype)[field] : null;
  const variantEntry = variant ? rawFingerprint(variant)[field] : null;
  const fieldState = ecosystemFieldState(config, selectedProduct, field);
  return {
    field,
    state: fieldState,
    before: prototypeEntry?.summary
      ?? prototypeEntry?.constraint_label
      ?? "品类原型字段待补充",
    after: variantEntry?.summary
      ?? variantEntry?.constraint_label
      ?? "游戏变体字段待补充",
    beforeEvidence: fieldEvidenceImages(prototypeEntry),
    afterEvidence: fieldEvidenceImages(variantEntry),
    prototypeName: prototype?.name ?? "品类原型",
    productName: selectedProduct?.name ?? "当前游戏",
    reviewStatus: variantEntry?.review_status ?? "draft"
  };
}

const ecosystemComparisonPopoverState = {
  trigger: null,
  pinned: false,
  showTimer: null,
  hideTimer: null,
  initialized: false
};

function ensureEcosystemComparisonPopover() {
  let popover = document.querySelector("#ecosystem-field-comparison-popover");
  if (!popover) {
    popover = document.createElement("section");
    popover.id = "ecosystem-field-comparison-popover";
    popover.className = "ecosystem-field-comparison-popover";
    popover.setAttribute("role", "dialog");
    popover.setAttribute("aria-label", "品类原型与当前游戏字段对比");
    popover.hidden = true;
    popover.innerHTML = `
      <header>
        <span>字段变化</span>
        <strong data-comparison-popover-title></strong>
        <button type="button" data-comparison-popover-close aria-label="关闭字段变化浮窗">×</button>
      </header>
      <div class="ecosystem-field-comparison-columns">
        <article>
          <small>品类原型</small>
          <b data-comparison-popover-prototype></b>
          <p data-comparison-popover-before></p>
        </article>
        <i aria-hidden="true">→</i>
        <article>
          <small>当前游戏</small>
          <b data-comparison-popover-product></b>
          <p data-comparison-popover-after></p>
        </article>
      </div>
      <footer>悬停可快速查看；点击可固定浮窗。</footer>
    `;
    document.body.append(popover);
  }

  if (!ecosystemComparisonPopoverState.initialized) {
    ecosystemComparisonPopoverState.initialized = true;
    popover.querySelector("[data-comparison-popover-close]")?.addEventListener("click", () => {
      hideEcosystemComparisonPopover(true);
    });
    popover.addEventListener("mouseenter", () => {
      window.clearTimeout(ecosystemComparisonPopoverState.hideTimer);
    });
    popover.addEventListener("mouseleave", () => {
      scheduleEcosystemComparisonPopoverHide();
    });
    document.addEventListener("pointerdown", (event) => {
      if (!ecosystemComparisonPopoverState.pinned || popover.hidden) return;
      if (popover.contains(event.target) || ecosystemComparisonPopoverState.trigger?.contains(event.target)) return;
      hideEcosystemComparisonPopover(true);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !popover.hidden) {
        hideEcosystemComparisonPopover(true);
      }
    });
    document.addEventListener("scroll", () => {
      if (popover.hidden) return;
      if (!ecosystemComparisonPopoverState.trigger?.isConnected) {
        hideEcosystemComparisonPopover(true);
        return;
      }
      positionEcosystemComparisonPopover(popover, ecosystemComparisonPopoverState.trigger);
    }, true);
    window.addEventListener("resize", () => {
      if (!popover.hidden && ecosystemComparisonPopoverState.trigger?.isConnected) {
        positionEcosystemComparisonPopover(popover, ecosystemComparisonPopoverState.trigger);
      }
    });
  }

  return popover;
}

function positionEcosystemComparisonPopover(popover, trigger) {
  if (!popover || !trigger) return;
  const triggerRect = trigger.getBoundingClientRect();
  const popoverRect = popover.getBoundingClientRect();
  const viewportGap = 14;
  const preferredLeft = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
  const left = Math.min(
    window.innerWidth - popoverRect.width - viewportGap,
    Math.max(viewportGap, preferredLeft)
  );
  const spaceAbove = triggerRect.top - viewportGap;
  const spaceBelow = window.innerHeight - triggerRect.bottom - viewportGap;
  const placeAbove = spaceAbove >= popoverRect.height + 12 || spaceAbove > spaceBelow;
  const preferredTop = placeAbove
    ? triggerRect.top - popoverRect.height - 12
    : triggerRect.bottom + 12;
  const maxTop = Math.max(viewportGap, window.innerHeight - popoverRect.height - viewportGap);
  const top = Math.min(maxTop, Math.max(viewportGap, preferredTop));
  popover.style.left = `${Math.round(left)}px`;
  popover.style.top = `${Math.round(top)}px`;
  popover.dataset.placement = placeAbove ? "top" : "bottom";
}

function showEcosystemComparisonPopover(trigger, pinned = false) {
  if (!trigger?.matches(".ecosystem-matrix-cell.is-changed")) return;
  const config = state.data.ecosystemByPrototypeId.get(trigger.dataset.ecosystemPrototype);
  const product = state.data.productById.get(trigger.dataset.ecosystemProduct);
  const field = trigger.dataset.ecosystemField;
  if (!config || !product || !FORMULA_FIELDS.includes(field)) return;

  const comparison = ecosystemFieldComparison(config, product, field);
  const prototype = state.data.prototypeById.get(config.prototype_id);
  const popover = ensureEcosystemComparisonPopover();
  window.clearTimeout(ecosystemComparisonPopoverState.showTimer);
  window.clearTimeout(ecosystemComparisonPopoverState.hideTimer);

  if (ecosystemComparisonPopoverState.trigger && ecosystemComparisonPopoverState.trigger !== trigger) {
    ecosystemComparisonPopoverState.trigger.setAttribute("aria-expanded", "false");
  }
  ecosystemComparisonPopoverState.trigger = trigger;
  ecosystemComparisonPopoverState.pinned = pinned;
  trigger.setAttribute("aria-expanded", "true");
  popover.querySelector("[data-comparison-popover-title]").textContent = `${formulaDisplayKey(field)} · ${FIELD_LABELS[field]}`;
  popover.querySelector("[data-comparison-popover-prototype]").textContent = prototype?.name ?? "品类原型";
  popover.querySelector("[data-comparison-popover-product]").textContent = product.name;
  popover.querySelector("[data-comparison-popover-before]").textContent = comparison.before;
  popover.querySelector("[data-comparison-popover-after]").textContent = comparison.after;
  popover.classList.toggle("is-pinned", pinned);
  popover.hidden = false;
  window.requestAnimationFrame(() => positionEcosystemComparisonPopover(popover, trigger));
}

function hideEcosystemComparisonPopover(force = false) {
  if (ecosystemComparisonPopoverState.pinned && !force) return;
  window.clearTimeout(ecosystemComparisonPopoverState.showTimer);
  window.clearTimeout(ecosystemComparisonPopoverState.hideTimer);
  const popover = document.querySelector("#ecosystem-field-comparison-popover");
  ecosystemComparisonPopoverState.trigger?.setAttribute("aria-expanded", "false");
  ecosystemComparisonPopoverState.trigger = null;
  ecosystemComparisonPopoverState.pinned = false;
  if (popover) {
    popover.hidden = true;
    popover.classList.remove("is-pinned");
  }
}

function scheduleEcosystemComparisonPopoverShow(trigger) {
  window.clearTimeout(ecosystemComparisonPopoverState.showTimer);
  window.clearTimeout(ecosystemComparisonPopoverState.hideTimer);
  if (ecosystemComparisonPopoverState.pinned) return;
  ecosystemComparisonPopoverState.showTimer = window.setTimeout(() => {
    ecosystemComparisonPopoverState.showTimer = null;
    if (!trigger?.isConnected || ecosystemComparisonPopoverState.pinned) return;
    showEcosystemComparisonPopover(trigger, false);
  }, 500);
}

function cancelEcosystemComparisonPopoverShow() {
  window.clearTimeout(ecosystemComparisonPopoverState.showTimer);
  ecosystemComparisonPopoverState.showTimer = null;
}

function scheduleEcosystemComparisonPopoverHide() {
  cancelEcosystemComparisonPopoverShow();
  window.clearTimeout(ecosystemComparisonPopoverState.hideTimer);
  ecosystemComparisonPopoverState.hideTimer = window.setTimeout(() => {
    hideEcosystemComparisonPopover(false);
  }, 120);
}

function bindEcosystemComparisonPopoverTriggers(root) {
  root.querySelectorAll(".ecosystem-matrix-cell.is-changed").forEach((button) => {
    button.addEventListener("mouseenter", () => scheduleEcosystemComparisonPopoverShow(button));
    button.addEventListener("mouseleave", scheduleEcosystemComparisonPopoverHide);
    button.addEventListener("focus", () => showEcosystemComparisonPopover(button, false));
    button.addEventListener("blur", scheduleEcosystemComparisonPopoverHide);
  });
}

function ecosystemPrototypeChangedFields(prototype) {
  const fingerprint = rawFingerprint(prototype);
  return FORMULA_FIELDS.filter((field) => fingerprint[field]?.operation !== "inherit");
}

function selectEcosystemProduct(productId, field = null) {
  if (!state.data.productById.has(productId)) return;
  state.selectedEcosystemNicheId = null;
  state.selectedEcosystemProductId = productId;
  state.selectedEcosystemField = field && FORMULA_FIELDS.includes(field) ? field : null;
  state.selectedEcosystemMapPreset = `product:${productId}`;
  renderEcosystemWorkbench();
}

function clearEcosystemProductSelection() {
  state.selectedEcosystemNicheId = null;
  state.selectedEcosystemProductId = null;
  state.selectedEcosystemField = null;
  state.expandedEcosystemCoordinateGroupKey = null;
  if ((state.selectedEcosystemMapPreset ?? "").startsWith("product:")) {
    state.selectedEcosystemMapPreset = "all";
  }
  renderEcosystemWorkbench();
}

function selectEcosystemCoordinateView(viewKey) {
  if (!ECOSYSTEM_COORDINATE_VIEWS[viewKey]) return;
  state.selectedEcosystemCoordinateView = viewKey;
  state.expandedEcosystemCoordinateGroupKey = null;
  renderEcosystemWorkbench();
}

function selectEcosystemScoreTableSort(dimensionKey) {
  if (dimensionKey === "default") {
    if (state.ecosystemScoreTableSortKey === null) return;
    state.ecosystemScoreTableSortKey = null;
    state.ecosystemScoreTableSortDirection = "asc";
    renderEcosystemWorkbench();
    return;
  }
  if (!ECOSYSTEM_DIMENSION_KEYS.includes(dimensionKey)) return;
  if (state.ecosystemScoreTableSortKey === dimensionKey) {
    state.ecosystemScoreTableSortDirection = state.ecosystemScoreTableSortDirection === "asc"
      ? "desc"
      : "asc";
  } else {
    state.ecosystemScoreTableSortKey = dimensionKey;
    state.ecosystemScoreTableSortDirection = "asc";
  }
  renderEcosystemWorkbench();
}

function captureEcosystemCoordinateReturnAnchor(element = null) {
  const branchId = element?.dataset?.ecosystemOpenCoordinateExpanded ?? null;
  const anchorElement = element
    ?? elements.ecosystemWorkbench?.querySelector("[data-ecosystem-coordinate-expand]")
    ?? elements.ecosystemWorkbench?.querySelector(".ecosystem-coordinate-map");
  if (!anchorElement) return;
  state.ecosystemCoordinateReturnAnchor = {
    type: branchId ? "branch" : "map",
    branchId,
    viewportTop: anchorElement.getBoundingClientRect().top
  };
}

function ecosystemCoordinateReturnAnchorElement(anchor) {
  if (!anchor) return null;
  if (anchor.type === "branch") {
    return [...elements.ecosystemWorkbench.querySelectorAll("[data-ecosystem-open-coordinate-expanded]")]
      .find((button) => button.dataset.ecosystemOpenCoordinateExpanded === anchor.branchId) ?? null;
  }
  return elements.ecosystemWorkbench.querySelector("[data-ecosystem-coordinate-expand]")
    ?? elements.ecosystemWorkbench.querySelector(".ecosystem-coordinate-map");
}

function restoreEcosystemCoordinateReturnAnchor() {
  if (!state.ecosystemCoordinateReturnPending) return;
  const anchor = state.ecosystemCoordinateReturnAnchor;
  const element = ecosystemCoordinateReturnAnchorElement(anchor);
  state.ecosystemCoordinateReturnPending = false;
  state.ecosystemCoordinateReturnAnchor = null;
  if (!element || !Number.isFinite(anchor?.viewportTop)) return;
  const offset = element.getBoundingClientRect().top - anchor.viewportTop;
  if (Math.abs(offset) > 1) window.scrollBy(0, offset);
  element.focus?.({ preventScroll: true });
}

function toggleEcosystemCoordinateExpanded(force = null, returnElement = null) {
  const nextExpanded = typeof force === "boolean"
    ? force
    : !state.ecosystemCoordinateExpanded;
  if (nextExpanded && !state.ecosystemCoordinateExpanded) {
    captureEcosystemCoordinateReturnAnchor(returnElement);
  }
  if (!nextExpanded && state.ecosystemCoordinateExpanded) {
    state.ecosystemCoordinateReturnPending = true;
  }
  state.ecosystemCoordinateExpanded = nextExpanded;
  renderEcosystemWorkbench();
  scheduleEcosystemCoordinatePlotMeasurement({ resetViewport: true });
}

function revealEcosystemCoordinateSectionForExpandedMode() {
  enhanceDynamicEcosystemSections();
  if (!state.ecosystemCoordinateExpanded) return;
  const section = elements.ecosystemWorkbench.querySelector(".ecosystem-coordinate-map");
  if (section?.classList.contains("is-major-collapsed")) {
    setMajorSectionCollapsed(section, false, { persist: false });
  }
}

function openEcosystemCoordinateExpandedForBranch(branchId, returnElement = null) {
  const config = state.data.ecosystemByPrototypeId.get(state.selectedEcosystemPrototypeId);
  if (config?.niche_map?.presets?.[branchId]?.kind !== "BRANCH") return;
  state.ecosystemMapFilters = {
    topology: null,
    color: null,
    secondary_badge: null,
    c1_synergy: null,
    sales_tier: null,
    branch: branchId
  };
  state.selectedEcosystemMapPreset = "all";
  state.selectedEcosystemNicheId = null;
  state.selectedEcosystemBdMode = "all";
  state.selectedEcosystemField = null;
  state.expandedEcosystemBranches = [
    ...new Set([...state.expandedEcosystemBranches, branchId])
  ];
  toggleEcosystemCoordinateExpanded(true, returnElement);
}

function toggleEcosystemCoordinateGroup(groupKey) {
  state.expandedEcosystemCoordinateGroupKey = state.expandedEcosystemCoordinateGroupKey === groupKey
    ? null
    : groupKey;
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
  state.ecosystemMapFilters = { topology: null, color: null, secondary_badge: null, c1_synergy: null, sales_tier: null, branch: null };
  state.selectedEcosystemNicheId = null;
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
  state.selectedEcosystemNicheId = null;
  state.ecosystemMapFilters = { topology: null, color: null, secondary_badge: null, c1_synergy: null, sales_tier: null, branch: null };
  renderEcosystemWorkbench();
}

function selectEcosystemMapFilter(dimension, value) {
  const config = state.data.ecosystemByPrototypeId.get(state.selectedEcosystemPrototypeId);
  if (!config?.niche_map) return;
  const encoding = ecosystemMapFilterDimensions(config)[dimension];
  const validValues = new Set((encoding?.legend ?? Object.entries(encoding?.labels ?? {}))
    .map(([key]) => key));
  if (!encoding || !validValues.has(value)) return;

  const currentFilters = state.ecosystemMapFilters ?? {};
  state.ecosystemMapFilters = {
    topology: currentFilters.topology ?? null,
    color: currentFilters.color ?? null,
    secondary_badge: currentFilters.secondary_badge ?? null,
    c1_synergy: currentFilters.c1_synergy ?? null,
    sales_tier: currentFilters.sales_tier ?? null,
    branch: currentFilters.branch ?? null,
    [dimension]: currentFilters[dimension] === value ? null : value
  };
  state.selectedEcosystemMapPreset = "all";
  state.selectedEcosystemNicheId = null;
  state.selectedEcosystemBdMode = "all";
  state.selectedEcosystemField = null;
  renderEcosystemWorkbench();
}

function clearEcosystemMapFilters() {
  state.ecosystemMapFilters = { topology: null, color: null, secondary_badge: null, c1_synergy: null, sales_tier: null, branch: null };
  state.selectedEcosystemMapPreset = "all";
  state.selectedEcosystemNicheId = null;
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

function selectEcosystemPrototype(prototypeId) {
  if (!state.data.prototypeById.has(prototypeId)) return false;
  state.selectedEcosystemPrototypeId = prototypeId;
  const config = state.data.ecosystemByPrototypeId.get(prototypeId);
  state.selectedEcosystemProductId = config?.cornerstone_product_id
    ?? ecosystemProducts(prototypeId)[0]?.id
    ?? null;
  state.selectedEcosystemField = null;
  state.selectedEcosystemNicheId = null;
  state.selectedEcosystemMapPreset = "all";
  state.ecosystemMapFilters = {
    topology: null,
    color: null,
    secondary_badge: null,
    c1_synergy: null,
    sales_tier: null,
    branch: null
  };
  state.selectedEcosystemBdMode = "all";
  state.expandedEcosystemBranches = config?.four_layer_architecture?.branch_ids?.slice(0, 1) ?? [];
  return true;
}

function openPrototypeEcosystemBaseline(prototypeId) {
  if (!state.data.prototypeById.has(prototypeId)) return;
  rememberCrossTabOrigin();
  selectEcosystemPrototype(prototypeId);
  renderEcosystem();
  window.location.hash = "ecosystem-baseline";
  window.requestAnimationFrame(() => {
    document.getElementById("ecosystem-baseline")?.scrollIntoView({
      block: "start",
      behavior: "instant"
    });
    renderCrossTabTrail();
  });
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
      const positionedCount = products.filter((product) => {
        const position = ecosystemPosition(config, product.id);
        return ECOSYSTEM_DIMENSION_KEYS.every((key) => Number.isInteger(position?.dimensions?.[key]?.score));
      }).length;
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
          <span>${products.length} 款产品</span>
          <i><b style="--progress:${products.length ? positionedCount / products.length : 0}"></b></i>
        </button>
      `;
    }).join("");

  elements.ecosystemPrototypeList
    .querySelectorAll("[data-ecosystem-prototype]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        selectEcosystemPrototype(button.dataset.ecosystemPrototype);
        renderEcosystem();
      });
    });
}

function ecosystemDeltaCards(config, selectedProduct, focusedField = null) {
  const changedFields = FORMULA_FIELDS.filter((field) =>
    ecosystemFieldState(config, selectedProduct, field).className === "changed"
  );
  const fields = focusedField
    ? [focusedField]
    : changedFields;

  if (!fields.length) {
    return `
      <div class="ecosystem-delta-empty">
        这款游戏当前没有已确认的相对品类原型变化；点击上方字段可逐项查看继承关系。
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
          <small>
            <b>品类原型</b>
            <span class="ecosystem-delta-copy">${escapeHtml(comparison.before)}</span>
            ${fieldEvidencePreviewMarkup(comparison.beforeEvidence, {
              limit: 3,
              className: "ecosystem-delta-evidence",
              label: `${comparison.prototypeName} · ${FIELD_LABELS[field]}截图说明`
            })}
          </small>
          <small>
            <b>当前游戏</b>
            <span class="ecosystem-delta-copy">${escapeHtml(comparison.after)}</span>
            ${fieldEvidencePreviewMarkup(comparison.afterEvidence, {
              limit: 3,
              className: "ecosystem-delta-evidence",
              label: `${comparison.productName} · ${FIELD_LABELS[field]}截图说明`
            })}
          </small>
        </div>
      </article>
    `;
  }).join("");
}

function ecosystemAssessmentMarkup(config, product, position) {
  if (!position?.dimensions) {
    return '<p class="ecosystem-position-note">这款游戏尚未补齐三维评分，当前视图无法定位。</p>';
  }
  const view = ecosystemCurrentCoordinateView();
  const nodeEncodings = ecosystemNodeEncodings(config);
  const sales = ecosystemSalesSnapshot(product);
  const steamReview = ecosystemSteamReviewSnapshot(product);
  const evidenceTags = [
    [nodeEncodings.topology.title, position[nodeEncodings.topology.position_key]],
    [nodeEncodings.color.title, position[nodeEncodings.color.position_key]],
    [nodeEncodings.secondary_badge.title, position[nodeEncodings.secondary_badge.position_key]]
  ].map(([title, value], index) => {
    const encoding = [nodeEncodings.topology, nodeEncodings.color, nodeEncodings.secondary_badge][index];
    return `<span><b>${escapeHtml(title)}</b>${escapeHtml(encoding.labels?.[value] ?? value ?? "待确认")}</span>`;
  }).join("");
  const riskLabels = { c1_reset_risk: "C₁ 重置风险" };
  const status = ecosystemAssessmentStatus(position);

  return `
    <section class="ecosystem-assessment" aria-label="${escapeHtml(product.name)}三维评分详情">
      <div class="ecosystem-current-projection">
        <span>当前投影</span>
        <strong>X · ${escapeHtml(ECOSYSTEM_DIMENSIONS[view.x].label)}</strong>
        <strong>Y · ${escapeHtml(ECOSYSTEM_DIMENSIONS[view.y].label)}</strong>
      </div>
      <div class="ecosystem-dimension-detail-grid">
        ${ECOSYSTEM_DIMENSION_KEYS.map((key) => {
          const dimension = position.dimensions[key];
          const band = ecosystemDimensionBand(dimension.score);
          return `
            <article class="band-${escapeHtml(band.key)}">
              <header><span>${escapeHtml(ECOSYSTEM_DIMENSIONS[key].label)}</span><strong>${dimension.score}<i>/ 4</i><em>${band.label}</em></strong></header>
              <p>${escapeHtml(dimension.basis)}</p>
            </article>
          `;
        }).join("")}
      </div>
      ${status.className !== "confirmed" || (position.risk_tags ?? []).length || position.assessment_note ? `
        <div class="ecosystem-assessment-flags">
          ${status.className !== "confirmed" ? `<span class="ecosystem-position-status ${escapeHtml(status.className)}">${escapeHtml(status.label)}</span>` : ""}
          ${(position.risk_tags ?? []).map((risk) => `<span class="is-risk">${escapeHtml(riskLabels[risk] ?? risk)}</span>`).join("")}
          ${position.assessment_note ? `<p>${escapeHtml(position.assessment_note)}</p>` : ""}
        </div>
      ` : ""}
      <div class="ecosystem-evidence-tags" aria-label="筛选与解释证据">
        ${evidenceTags}
        <span><b>销量档位</b>${escapeHtml(sales.displayTier)}</span>
        <span><b>Steam 用户评价</b>${escapeHtml(steamReview.display)}</span>
      </div>
    </section>
  `;
}

function ecosystemBasisMarkup(config, prototype, mechanism, cornerstone) {
  const basis = config.analysis_basis ?? {};
  const differentiationFields = ecosystemPrototypeChangedFields(prototype);
  return `
    <section class="ecosystem-baseline" id="ecosystem-baseline" aria-labelledby="ecosystem-baseline-title">
      <div class="ecosystem-panel-head">
        <div>
          <span class="ecosystem-kicker">02 · 品类分析基准</span>
          <h3 id="ecosystem-baseline-title">先说明品类边界，再进入三维评分投影</h3>
        </div>
        <span class="ecosystem-baseline-path">
          ${escapeHtml(mechanism?.name ?? "机制母型")} → ${escapeHtml(prototype.name)}
        </span>
      </div>
      <div class="ecosystem-basis-grid">
        <article>
          <small>品类公式边界</small>
          <strong>相对机制母体保留与改动什么</strong>
          <p>${escapeHtml(basis.inheritance_summary ?? prototype.summary)}</p>
        </article>
        <article class="is-cornerstone">
          <small>基石游戏 · 案例锚点</small>
          <strong>${escapeHtml(cornerstone?.name ?? "基石待确认")}</strong>
          <p>${escapeHtml(basis.cornerstone_role ?? "基石游戏用于展示品类公式的一种具体实现；品类定义以正式公式字段为准。")}</p>
        </article>
        <article>
          <small>相对母体改动字段</small>
          <strong>${differentiationFields.map((field) => escapeHtml(formulaDisplayKey(field))).join(" · ") || "待确认"}</strong>
          <p>从品类原型的正式公式字段自动生成；下方逐项比较具体游戏与品类原型。</p>
        </article>
        <article>
          <small>三维评分基准</small>
          <strong>认知负担 · 单次介入强度 · 二次揭晓深度</strong>
          <p>三项分数只评价最小爽环与单次结果封闭过程；Show_TP、C₁、敌方空间、销量和评价只负责筛选与解释。</p>
        </article>
      </div>
      <div class="ecosystem-axis-definitions">
        ${ECOSYSTEM_DIMENSION_KEYS.map((key, index) => {
          const dimension = ECOSYSTEM_DIMENSIONS[key];
          return `
            <details class="ecosystem-axis-definition">
              <summary>
                <span class="ecosystem-axis-index">维度 ${index + 1}</span>
                <span class="ecosystem-axis-copy">
                  <strong>${escapeHtml(dimension.label)}</strong>
                  <small>0 · ${escapeHtml(dimension.low)} → 4 · ${escapeHtml(dimension.high)}</small>
                </span>
                <span class="ecosystem-axis-toggle">评分标准<i aria-hidden="true"></i></span>
              </summary>
              <div class="ecosystem-axis-rubric">
                <p>${escapeHtml(dimension.boundary)}</p>
                <ol>
                  ${Object.entries(dimension.scores).map(([score, item]) => `
                    <li>
                      <b>${escapeHtml(score)}</b>
                      <span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.copy)}</small></span>
                    </li>
                  `).join("")}
                </ol>
              </div>
            </details>
          `;
        }).join("")}
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
          <h3 id="ecosystem-comparison-title">变化的字段</h3>
        </div>
      </div>
      <div class="ecosystem-matrix-legend" aria-label="公式差异图例">
        <span class="changed">相对原型变化</span>
        <span class="inherited">同原型</span>
        <span class="pending">待确认</span>
      </div>
      <div class="ecosystem-matrix-scroll">
        <table class="ecosystem-matrix">
          <thead>
            <tr>
              <th>具体游戏</th>
              ${FORMULA_FIELDS.map((field) => {
                const fieldSelected = state.selectedEcosystemField === field;
                return `
                  <th class="${fieldSelected ? "is-field-selected" : ""}"
                    data-ecosystem-field-column="${escapeHtml(field)}"
                    ${fieldSelected ? 'aria-current="true"' : ""}>
                    <code>${escapeHtml(formulaDisplayKey(field))}</code>
                    <small>${escapeHtml(FIELD_LABELS[field])}</small>
                  </th>
                `;
              }).join("")}
            </tr>
          </thead>
          <tbody>
            ${products.map((product) => {
              const active = product.id === state.selectedEcosystemProductId;
              const position = ecosystemPosition(config, product.id);
              const status = ecosystemPositionStatus(position);
              const sales = ecosystemSalesSnapshot(product);
              const steamReview = ecosystemSteamReviewSnapshot(product);
              return `
                <tr class="${active ? "is-active" : ""}">
                  <th>
                    <button type="button" class="ecosystem-matrix-product"
                      data-ecosystem-product="${escapeHtml(product.id)}"
                      aria-pressed="${active}">
                      ${ecosystemProductIcon(product)}
                      <span>
                        <strong>${escapeHtml(product.name)}</strong>
                        <small class="ecosystem-matrix-product-metadata">
                          ${position?.role === "cornerstone" ? "<b>基石</b>" : ""}
                          <span>销量 ${escapeHtml(sales.displayTier)}</span>
                          <span class="tone-${escapeHtml(ecosystemClassToken(steamReview.tone))}">${escapeHtml(steamReview.display)}</span>
                        </small>
                        ${status.className !== "confirmed" ? `<small class="${escapeHtml(status.className)}">${escapeHtml(status.label)}</small>` : ""}
                      </span>
                    </button>
                  </th>
                  ${FORMULA_FIELDS.map((field) => {
                    const fieldState = ecosystemFieldState(config, product, field);
                    const fieldSelected = state.selectedEcosystemField === field;
                    const fieldActive = active && fieldSelected;
                    const comparisonEnabled = fieldState.className === "changed";
                    return `
                      <td class="${fieldSelected ? "is-field-selected" : ""}"
                        data-ecosystem-field-column="${escapeHtml(field)}">
                        <button type="button"
                          class="ecosystem-matrix-cell is-${escapeHtml(fieldState.className)} ${fieldActive ? "is-active" : ""}"
                          data-ecosystem-prototype="${escapeHtml(config.prototype_id)}"
                          data-ecosystem-product="${escapeHtml(product.id)}"
                          data-ecosystem-field="${escapeHtml(field)}"
                          aria-pressed="${fieldActive}"
                          ${comparisonEnabled ? 'aria-haspopup="dialog" aria-expanded="false" aria-controls="ecosystem-field-comparison-popover"' : ""}>
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
          <h3 id="ecosystem-innovations-title">记录具体游戏改了什么，以及为什么值得继续观察</h3>
        </div>
        <p>点击创新卡，产品详情与公式字段同步聚焦</p>
      </div>
      <div class="ecosystem-innovation-list">
        ${innovations.map((innovation) => {
          const product = state.data.productById.get(innovation.product_id);
          const active = innovation.product_id === state.selectedEcosystemProductId
            && innovation.primary_field === state.selectedEcosystemField;
          const imageUrl = safeFieldEvidenceUrl(innovation.image_url);
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
              <span class="ecosystem-innovation-body ${imageUrl ? "has-media" : ""}">
                ${imageUrl ? `
                  <span class="ecosystem-innovation-media">
                    <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(innovation.image_caption ?? `${product?.name ?? "游戏"}创新配图`)}">
                    <small>${escapeHtml(innovation.image_caption ?? "游戏实机配图")}</small>
                  </span>
                ` : ""}
                <span class="ecosystem-innovation-copy">
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
                </span>
              </span>
            </button>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function ecosystemClassToken(value = "pending") {
  return String(value).toLowerCase().replace(/[^a-z0-9-]+/g, "-");
}

const ECOSYSTEM_STRUCTURE_LABELS = {
  ALL: "全部",
  CORE: "原型核心",
  BRANCH: "改动分支",
  CASE: "代表游戏",
  BOUNDARY: "设计风险",
  POOL: "符号池",
  CONTROL: "抽取控制",
  QUALITY: "品质控制",
  RULE: "规则构筑"
};

function ecosystemStructureLabel(value = "") {
  return ECOSYSTEM_STRUCTURE_LABELS[value] ?? value;
}

function ecosystemChineseStructureText(value = "") {
  return String(value)
    .replace(/\bBOUNDARY\b/g, ECOSYSTEM_STRUCTURE_LABELS.BOUNDARY)
    .replace(/\bBRANCH\b/g, ECOSYSTEM_STRUCTURE_LABELS.BRANCH)
    .replace(/\bCASE\b/g, ECOSYSTEM_STRUCTURE_LABELS.CASE)
    .replace(/\bCORE\b/g, ECOSYSTEM_STRUCTURE_LABELS.CORE)
    .replace(/\bALL\b/g, ECOSYSTEM_STRUCTURE_LABELS.ALL);
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

function ecosystemMapFilterDimensions(config) {
  const branchLegend = (config?.four_layer_architecture?.branch_ids ?? [])
    .map((branchId) => [branchId, config?.niche_map?.presets?.[branchId]?.label])
    .filter(([, label]) => label);
  const c1SynergyLegend = (state.data.terms.enums.c1_synergy_enum?.values ?? [])
    .map((item) => [item.key, item.name]);
  return {
    ...ecosystemNodeEncodings(config),
    c1_synergy: {
      title: "C₁ 协同",
      position_key: "c1_tags",
      labels: Object.fromEntries(c1SynergyLegend),
      legend: c1SynergyLegend,
      source: "tags"
    },
    sales_tier: {
      title: "销量门槛",
      labels: Object.fromEntries(ECOSYSTEM_SALES_FILTER_OPTIONS),
      legend: ECOSYSTEM_SALES_FILTER_OPTIONS,
      source: "sales"
    },
    branch: {
      title: "分支",
      labels: Object.fromEntries(branchLegend),
      legend: branchLegend,
      source: "branch"
    }
  };
}

function ecosystemNicheMapFocus(config) {
  const nicheMap = config.niche_map;
  const filterDimensions = ecosystemMapFilterDimensions(config);
  const activeFilters = Object.entries(state.ecosystemMapFilters ?? {})
    .filter(([dimension, value]) => value && filterDimensions[dimension]);

  if (activeFilters.length) {
    const matchingPositions = config.positions.filter((position) => activeFilters.every(
      ([dimension, value]) => {
        const filter = filterDimensions[dimension];
        if (filter.source === "sales") {
          const product = state.data.productById.get(position.product_id);
          return product && ecosystemSalesFilterMatches(ecosystemSalesSnapshot(product), value);
        }
        if (filter.source === "branch") {
          return (config.niche_map.presets?.[value]?.products ?? []).includes(position.product_id);
        }
        if (filter.source === "tags") {
          return (position[filter.position_key] ?? []).includes(value);
        }
        return position[filter.position_key] === value;
      }
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
      const encoding = filterDimensions[dimension];
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
        secondary_badge: "C1",
        c1_synergy: "C1",
        sales_tier: "销量估算",
        branch: "分支"
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
          ? `待确认维度：${pendingDimensions.join("、")}。`
          : position.status === "confirmed"
            ? "三维评分与视觉编码已确认。"
            : "三维评分与视觉编码仍待确认。",
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

function ecosystemLegacyNicheMapMarkup(config, prototype, products, positionedProducts, unpositioned) {
  const nicheMap = config.niche_map;
  const focus = ecosystemNicheMapFocus(config);
  const infoCollapsed = state.ecosystemNicheInfoCollapsed;
  const nodeEncodings = ecosystemNodeEncodings(config);
  const topologyEncoding = nodeEncodings.topology;
  const colorEncoding = nodeEncodings.color;
  const secondaryEncoding = nodeEncodings.secondary_badge;
  const filterDimensions = ecosystemMapFilterDimensions(config);
  const c1SynergyEncoding = filterDimensions.c1_synergy;
  const salesEncoding = filterDimensions.sales_tier;
  const topologyLegend = topologyEncoding.legend ?? Object.entries(topologyEncoding.labels ?? {});
  const colorLegend = colorEncoding.legend ?? Object.entries(colorEncoding.labels ?? {});
  const secondaryLegend = secondaryEncoding.legend ?? Object.entries(secondaryEncoding.labels ?? {});
  const c1SynergyLegend = c1SynergyEncoding.legend;
  const salesLegend = salesEncoding.legend;
  const activeFilterMap = new Map((focus.activeFilters ?? []).map((item) => [item.dimension, item.value]));
  const coordinateById = new Map();
  nicheMap.anchors.forEach((anchor) => coordinateById.set(`anchor:${anchor.id}`, anchor));
  positionedProducts.forEach(({ product, position }) => coordinateById.set(product.id, position));
  const presetEntries = Object.entries(nicheMap.presets);

  return `
    <section class="ecosystem-panel ecosystem-niche-map" aria-labelledby="ecosystem-niche-map-title">
      <div class="ecosystem-panel-head ecosystem-niche-map-head">
        <div>
          <span class="ecosystem-kicker">03-1 · 品类生态位图</span>
          <h3 id="ecosystem-niche-map-title">品类原型生态位图</h3>
        </div>
        <p>切换分析镜头只改变聚焦；点击图中空白处返回全部生态</p>
      </div>
      <div class="ecosystem-niche-map-presets" role="toolbar" aria-label="生态位图分析镜头">
        ${presetEntries.map(([key, preset]) => `
          <button type="button"
            class="is-${escapeHtml(ecosystemClassToken(preset.kind))} ${focus.key === key ? "is-active" : ""}"
            data-ecosystem-map-preset="${escapeHtml(key)}"
            aria-pressed="${focus.key === key}">
            <small>${escapeHtml(ecosystemStructureLabel(preset.kind))}</small>
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
              const labelPlacement = ecosystemClassToken(zone.label_placement ?? "top-left");
              return `
                <span class="ecosystem-model-zone tone-${escapeHtml(ecosystemClassToken(zone.tone))} label-${escapeHtml(labelPlacement)} ${isFocused ? "is-focused" : "is-dimmed"}"
                  style="--x:${zone.x};--y:${zone.y};--w:${zone.width};--h:${zone.height}"
                  data-model-zone="${escapeHtml(zone.id)}"
                  title="${escapeHtml(zone.description)}">
                  <span class="ecosystem-model-zone-copy">
                    <b>${escapeHtml(zone.label)}</b>
                    <small>${escapeHtml(zone.description)}</small>
                  </span>
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
                  <small>原型核心</small><strong>${escapeHtml(ecosystemChineseStructureText(anchor.label))}</strong>
                </button>
              `;
            }).join("")}
            ${positionedProducts.map(({ product, position }) => {
              const isFocused = focus.isAll || focus.productIds.has(product.id);
              const sales = ecosystemSalesSnapshot(product);
              const steamReview = ecosystemSteamReviewSnapshot(product);
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
                  aria-label="${escapeHtml(product.name)}，Steam 用户评价：${escapeHtml(steamReview.display)}，销量档位：${escapeHtml(sales.displayTier)}，${escapeHtml(topologyEncoding.title)}：${escapeHtml(topologyLabel)}，${escapeHtml(colorEncoding.title)}：${escapeHtml(colorLabel)}，${escapeHtml(secondaryEncoding.title)}：${escapeHtml(secondaryLabel)}"
                  aria-pressed="${focus.key === `product:${product.id}`}">
                  <span class="ecosystem-node-badges" aria-hidden="true">
                    <i class="ecosystem-node-badge is-topology badge-topology-${escapeHtml(ecosystemClassToken(topology))}" title="${escapeHtml(topologyEncoding.title)} · ${escapeHtml(topologyLabel)}">${escapeHtml(topologyLabel)}</i>
                    <i class="ecosystem-node-badge is-c1 badge-c1-${escapeHtml(ecosystemClassToken(secondaryValue))}" title="${escapeHtml(secondaryEncoding.title)} · ${escapeHtml(secondaryLabel)}">${escapeHtml(secondaryLabel)}</i>
                  </span>
                  ${ecosystemProductIcon(product)}
                  <span class="ecosystem-model-node-copy"><strong>${escapeHtml(product.name)}</strong></span>
                  <span class="ecosystem-model-node-review tone-${escapeHtml(ecosystemClassToken(steamReview.tone))}"
                    title="Steam 用户评价 · ${escapeHtml(steamReview.display)}">${escapeHtml(steamReview.display)}</span>
                  <span class="ecosystem-model-node-sales tier-${escapeHtml(ecosystemClassToken(sales.tierKey))}"
                    title="销量档位 · ${escapeHtml(sales.displayTier)}">销量 ${escapeHtml(sales.displayTier)}</span>
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
            <header><span>${escapeHtml(ecosystemStructureLabel(focus.kind))}</span><small>${escapeHtml(focus.label)}</small></header>
            <h4>${escapeHtml(ecosystemChineseStructureText(focus.title))}</h4>
            <p>${escapeHtml(ecosystemChineseStructureText(focus.summary))}</p>
            <div><b>分析边界</b><span>${escapeHtml(ecosystemChineseStructureText(focus.boundary))}</span></div>
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
        <div role="group" aria-label="按 ${escapeHtml(c1SynergyEncoding.title)} 筛选">
          <b>${escapeHtml(c1SynergyEncoding.title)}</b>
          ${c1SynergyLegend.map(([value, label]) => {
            const active = activeFilterMap.get("c1_synergy") === value;
            return `<button type="button" class="${active ? "is-active" : ""}" data-ecosystem-map-filter-dimension="c1_synergy" data-ecosystem-map-filter-value="${escapeHtml(value)}" aria-pressed="${active}">${escapeHtml(label)}</button>`;
          }).join("")}
        </div>
        <div class="ecosystem-sales-tier-filters" role="group" aria-label="按 ${escapeHtml(salesEncoding.title)} 筛选">
          <b>${escapeHtml(salesEncoding.title)}</b>
          ${salesLegend.map(([value, label]) => {
            const active = activeFilterMap.get("sales_tier") === value;
            return `<button type="button" class="legend-sales-tier tier-${escapeHtml(ecosystemClassToken(value))} ${active ? "is-active" : ""}" data-ecosystem-map-filter-dimension="sales_tier" data-ecosystem-map-filter-value="${escapeHtml(value)}" aria-pressed="${active}">${escapeHtml(label)}</button>`;
          }).join("")}
        </div>
        <div class="ecosystem-map-filter-status" aria-live="polite">
          ${focus.isFilter
            ? `<strong>已筛选 ${focus.productIds.size} / ${positionedProducts.length} 款</strong><span>${focus.activeFilters.map((item) => escapeHtml(item.label)).join(" · ")}</span><button type="button" data-ecosystem-map-filter-clear>清除筛选</button>`
            : `<span>点击标签筛选上方生态图；跨维度组合时，只强调同时满足的游戏。</span>`}
        </div>
        <p>每个节点右上角依次显示 ${escapeHtml(topologyEncoding.title)} 与 ${escapeHtml(secondaryEncoding.title)} 角标，文字和颜色共同区分类别。箭头表示同一改动分支中的案例展开路径，聚焦时在线上显示分支名；不表示产品继承、时间先后或优劣。节点大小不代表销量。</p>
      </div>
      ${unpositioned.length ? `
        <p class="ecosystem-unpositioned"><strong>已归类、待定位：</strong>${unpositioned.map((product) => escapeHtml(product.name)).join(" · ")}</p>
      ` : ""}
    </section>
  `;
}

function ecosystemNicheMapMarkup(config, prototype, products, positionedProducts) {
  const singleCaseMechanisms = config.four_layer_architecture?.presentation_mode === "single_case_mechanisms";
  const view = ecosystemCurrentCoordinateView();
  const viewKey = state.selectedEcosystemCoordinateView in ECOSYSTEM_COORDINATE_VIEWS
    ? state.selectedEcosystemCoordinateView
    : "operation-c2";
  const projection = ecosystemProjectedPositions(positionedProducts, view);
  const focus = ecosystemNicheMapFocus(config);
  const filterDimensions = ecosystemMapFilterDimensions(config);
  const activeFilters = new Map((focus.activeFilters ?? []).map((item) => [item.dimension, item.value]));
  const xDimension = ECOSYSTEM_DIMENSIONS[view.x];
  const yDimension = ECOSYSTEM_DIMENSIONS[view.y];
  const auxiliaryDimension = ECOSYSTEM_DIMENSIONS[view.auxiliary];
  const nodeEncodings = ecosystemNodeEncodings(config);
  const rankingScopeLabel = focus.isFilter ? "当前筛选范围" : "当前品类";
  const rankingCandidates = products.filter((product) => {
    const metadata = state.data.steamMetadataByProductId.get(product.id);
    return (!focus.isFilter || focus.productIds.has(product.id))
      && !metadata?.is_demo
      && !/\bdemo\b/i.test(`${product.name ?? ""} ${product.name_en ?? ""}`)
      && product.exclude_from_market_ranking !== true;
  });
  const salesLeaderId = [...rankingCandidates]
    .filter((product) => Number.isFinite(ecosystemSalesSnapshot(product).salesEstimate))
    .sort(compareProductsBySalesDescending)[0]?.id ?? null;
  const reviewLeaderId = [...rankingCandidates]
    .filter((product) => Number.isInteger(
      state.data.steamMetadataByProductId.get(product.id)?.positive_percentage
    ))
    .sort((a, b) => {
      const aMetadata = state.data.steamMetadataByProductId.get(a.id);
      const bMetadata = state.data.steamMetadataByProductId.get(b.id);
      const percentageDifference = bMetadata.positive_percentage - aMetadata.positive_percentage;
      if (percentageDifference) return percentageDifference;
      const reviewCountDifference = (bMetadata.total_reviews ?? 0) - (aMetadata.total_reviews ?? 0);
      return reviewCountDifference || a.order - b.order || a.name.localeCompare(b.name, "zh-CN");
    })[0]?.id ?? null;

  // 同分组在折叠时由后绘制的卡片占据视觉前层：普通产品先放，
  // 当前评比范围内的单项第一随后，双第一最后；同级保持原始顺序。
  const coordinateRankingPriority = (product) => (
    Number(product.id === salesLeaderId) + Number(product.id === reviewLeaderId)
  );
  projection.groups.forEach((group) => {
    if (group.items.length < 2) return;
    group.items.sort((a, b) => (
      coordinateRankingPriority(a.product) - coordinateRankingPriority(b.product)
      || a.groupIndex - b.groupIndex
    ));
    group.items.forEach((item, index) => {
      item.groupIndex = index;
    });
  });

  const coordinateEncodingItems = (position) => ([
    ["topology", nodeEncodings.topology],
    ["color", nodeEncodings.color],
    ["secondary", nodeEncodings.secondary_badge]
  ].map(([type, encoding]) => {
    const value = position[encoding.position_key] ?? "pending";
    return {
      type,
      title: encoding.title,
      value,
      label: encoding.labels?.[value] ?? value
    };
  }));

  const coordinateEncodingTags = (position, compact = false) => `
    <span class="ecosystem-coordinate-encoding-tags ${compact ? "is-compact" : ""}" aria-hidden="true">
      ${coordinateEncodingItems(position).map((item) => `
        <em class="is-${escapeHtml(item.type)}"
          title="${escapeHtml(item.title)} · ${escapeHtml(item.label)}">${escapeHtml(item.label)}</em>
      `).join("")}
    </span>
  `;

  const coordinateEncodingDescription = (position) => coordinateEncodingItems(position)
    .map((item) => `${item.title}：${item.label}`)
    .join("，");

  const coordinateScoreStrip = (position, compact = false) => {
    const scoreItems = [
      ["spin_intervention", "操"],
      ["c2_reveal_depth", "演"],
      ["cognitive_load", "认"]
    ];
    return `
      <span class="ecosystem-coordinate-score-strip ${compact ? "is-compact" : ""}" aria-hidden="true">
        ${scoreItems.map(([key, label]) => {
          const score = position.dimensions?.[key]?.score;
          const roleClass = key === view.x
            ? "is-axis is-x-axis"
            : key === view.y
              ? "is-axis is-y-axis"
              : "is-auxiliary";
          return `<i class="is-${escapeHtml(ecosystemClassToken(key))} ${roleClass}"
            title="${escapeHtml(ECOSYSTEM_DIMENSIONS[key].label)} · ${Number.isInteger(score) ? score : "待评分"}">${escapeHtml(label)}<b>${Number.isInteger(score) ? score : "—"}</b></i>`;
        }).join("")}
      </span>
    `;
  };

  const coordinateRankBadgesMarkup = (product) => {
    const badges = [];
    if (product.id === salesLeaderId) {
      badges.push(`<em class="is-sales" title="${escapeHtml(rankingScopeLabel)}销量第一 · 排名不含 Demo 及退出评比的产品"><i aria-hidden="true">♛</i>销量第一</em>`);
    }
    if (product.id === reviewLeaderId) {
      badges.push(`<em class="is-review" title="${escapeHtml(rankingScopeLabel)} Steam 好评率第一 · 排名不含 Demo 及退出评比的产品"><i aria-hidden="true">★</i>好评第一</em>`);
    }
    return badges.length
      ? `<span class="ecosystem-coordinate-rank-badges" aria-hidden="true">${badges.join("")}</span>`
      : "";
  };

  const coordinateProductCardMarkup = (item, {
    grouped = false,
    fanOffsetX = 0,
    fanOffsetY = 0,
    stackOffsetX = 0,
    stackOffsetY = 0,
    groupKey = ""
  } = {}) => {
    const { product, position, x, y, xScore, yScore } = item;
    const auxiliary = position.dimensions[view.auxiliary];
    const band = ecosystemDimensionBand(auxiliary?.score);
    const sales = ecosystemSalesSnapshot(product);
    const steamReview = ecosystemSteamReviewSnapshot(product);
    const isSalesLeader = product.id === salesLeaderId;
    const isReviewLeader = product.id === reviewLeaderId;
    const hasRanking = isSalesLeader || isReviewLeader;
    const rankingDescription = [
      isSalesLeader ? `${rankingScopeLabel}销量第一（不含 Demo 及退出评比的产品）` : "",
      isReviewLeader ? `${rankingScopeLabel} Steam 好评率第一（不含 Demo 及退出评比的产品）` : ""
    ].filter(Boolean).join("，");
    const isFocused = focus.isAll || focus.productIds.has(product.id);
    const isActive = product.id === state.selectedEcosystemProductId;
    const style = grouped
      ? `--fan-offset-x:${fanOffsetX}px;--fan-offset-y:${fanOffsetY}px;--stack-offset-x:${stackOffsetX}px;--stack-offset-y:${stackOffsetY}px`
      : `--x:${x};--y:${y}`;
    return `
      <button type="button"
        class="ecosystem-coordinate-node ${grouped ? "is-grouped" : ""} ${hasRanking ? "has-ranking" : ""} band-${escapeHtml(band.key)} ${isFocused ? "is-focused" : "is-dimmed"} ${isActive ? "is-active" : ""}"
        style="${style}"
        ${grouped ? `data-coordinate-group="${escapeHtml(groupKey)}"` : ""}
        data-model-node="${escapeHtml(product.id)}"
        data-ecosystem-product="${escapeHtml(product.id)}"
        aria-pressed="${isActive}"
        aria-label="${escapeHtml(product.name)}，${escapeHtml(xDimension.shortLabel)} ${xScore} 分，${escapeHtml(yDimension.shortLabel)} ${yScore} 分，${escapeHtml(auxiliaryDimension.shortLabel)} ${auxiliary.score} 分${band.label}档，${escapeHtml(coordinateEncodingDescription(position))}，销量${escapeHtml(sales.displayTier)}，Steam ${escapeHtml(steamReview.display)}${rankingDescription ? `，${escapeHtml(rankingDescription)}` : ""}">
        ${coordinateEncodingTags(position)}
        ${ecosystemProductIcon(product)}
        <span class="ecosystem-coordinate-node-copy">
          <strong>${escapeHtml(product.name)}</strong>
          <small class="ecosystem-coordinate-sales">销量 ${escapeHtml(sales.displayTier)}</small>
        </span>
        ${coordinateRankBadgesMarkup(product)}
        <span class="ecosystem-coordinate-node-meta">
          <i class="ecosystem-coordinate-review tone-${escapeHtml(ecosystemClassToken(steamReview.tone))}">${escapeHtml(steamReview.display)}</i>
          ${coordinateScoreStrip(position)}
        </span>
      </button>
    `;
  };

  const coordinateGroupStackOffsets = (group) => {
    const midpoint = (group.items.length - 1) / 2;
    return group.items.map((item, index) => ({
      item,
      x: (index - midpoint) * 12,
      y: (index - midpoint) * 9
    }));
  };

  const coordinateGroupFanCandidates = (group) => {
    const midpoint = (group.items.length - 1) / 2;
    const vertical = group.items.map((item, index) => ({
      item,
      x: 0,
      y: (index - midpoint) * 104
    }));
    const horizontal = group.items.map((item, index) => ({
      item,
      x: (index - midpoint) * 162,
      y: 0
    }));
    const columnCount = group.items.length <= 4 ? 2 : 3;
    const rowCount = Math.ceil(group.items.length / columnCount);
    const grid = group.items.map((item, index) => {
      const row = Math.floor(index / columnCount);
      const rowStart = row * columnCount;
      const cardsInRow = Math.min(columnCount, group.items.length - rowStart);
      const column = index - rowStart;
      return {
        item,
        x: (column - (cardsInRow - 1) / 2) * 158,
        y: (row - (rowCount - 1) / 2) * 102
      };
    });
    return [
      { direction: "vertical", penalty: 0, offsets: vertical },
      { direction: "grid", penalty: 1600, offsets: grid },
      { direction: "horizontal", penalty: 4200, offsets: horizontal }
    ];
  };

  const coordinateFitGroupOffsets = (group, baseOffsets, trialX = 0, trialY = 0) => {
    const plotWidth = Math.max(720, Number(state.ecosystemCoordinatePlotSize?.width) || 1060);
    const plotHeight = Math.max(560, Number(state.ecosystemCoordinatePlotSize?.height) || 680);
    const anchorX = plotWidth * group.x / 100;
    const anchorY = plotHeight * (1 - group.y / 100);
    const minCenterX = 82;
    const maxCenterX = plotWidth - minCenterX;
    const minCenterY = 52;
    const maxCenterY = plotHeight - minCenterY;
    const offsets = baseOffsets.map((offset) => ({
      ...offset,
      x: offset.x + trialX,
      y: offset.y + trialY
    }));
    const minX = Math.min(...offsets.map((offset) => offset.x));
    const maxX = Math.max(...offsets.map((offset) => offset.x));
    const minY = Math.min(...offsets.map((offset) => offset.y));
    const maxY = Math.max(...offsets.map((offset) => offset.y));
    let adjustmentX = 0;
    let adjustmentY = 0;
    if (anchorX + minX < minCenterX) adjustmentX = minCenterX - anchorX - minX;
    if (anchorX + maxX + adjustmentX > maxCenterX) {
      adjustmentX += maxCenterX - anchorX - maxX - adjustmentX;
    }
    if (anchorY + minY < minCenterY) adjustmentY = minCenterY - anchorY - minY;
    if (anchorY + maxY + adjustmentY > maxCenterY) {
      adjustmentY += maxCenterY - anchorY - maxY - adjustmentY;
    }
    offsets.forEach((offset) => {
      offset.x += adjustmentX;
      offset.y += adjustmentY;
    });
    return offsets;
  };

  const coordinateGroupLayouts = (() => {
    const plotWidth = Math.max(720, Number(state.ecosystemCoordinatePlotSize?.width) || 1060);
    const plotHeight = Math.max(560, Number(state.ecosystemCoordinatePlotSize?.height) || 680);
    const halfWidth = 78;
    const halfHeight = 51;
    const singletonRectangles = projection.groups
      .filter((group) => group.items.length === 1)
      .map((group) => ({
        left: plotWidth * group.x / 100 - halfWidth,
        right: plotWidth * group.x / 100 + halfWidth,
        top: plotHeight * (1 - group.y / 100) - halfHeight,
        bottom: plotHeight * (1 - group.y / 100) + halfHeight
      }));
    const compactRectanglesByGroup = new Map(
      projection.groups
        .filter((group) => group.items.length > 1)
        .map((group) => {
          const anchorX = plotWidth * group.x / 100;
          const anchorY = plotHeight * (1 - group.y / 100);
          const offsets = coordinateFitGroupOffsets(group, coordinateGroupStackOffsets(group));
          return [group.key, offsets.map((offset) => ({
            left: anchorX + offset.x - halfWidth,
            right: anchorX + offset.x + halfWidth,
            top: anchorY + offset.y - halfHeight,
            bottom: anchorY + offset.y + halfHeight
          }))];
        })
    );
    const layouts = new Map();
    const expandedOccupied = [...singletonRectangles];
    const trialShifts = [
      [0, 0],
      [-18, 0], [18, 0], [-36, 0], [36, 0], [-54, 0], [54, 0],
      [-72, 0], [72, 0], [-108, 0], [108, 0], [-162, 0], [162, 0],
      [-216, 0], [216, 0], [-270, 0], [270, 0],
      [0, -36], [0, 36], [0, -72], [0, 72], [0, -108], [0, 108],
      [0, -144], [0, 144], [0, -180], [0, 180],
      [-54, -58], [54, -58], [-54, 58], [54, 58],
      [-108, -116], [108, -116], [-108, 116], [108, 116],
      [-180, -116], [180, -116], [-180, 116], [180, 116]
    ];
    const overlapArea = (a, b) => (
      Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left))
      * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top))
    );

    [...projection.groups]
      .filter((group) => group.items.length > 1)
      .sort((a, b) => b.yScore - a.yScore || a.xScore - b.xScore)
      .forEach((group) => {
        const anchorX = plotWidth * group.x / 100;
        const anchorY = plotHeight * (1 - group.y / 100);
        const occupied = state.ecosystemCoordinateExpanded
          ? expandedOccupied
          : [
              ...singletonRectangles,
              ...[...compactRectanglesByGroup.entries()]
                .filter(([key]) => key !== group.key)
                .flatMap(([, rectangles]) => rectangles)
            ];
        let best = null;
        coordinateGroupFanCandidates(group).forEach((candidate) => {
          trialShifts.forEach(([trialX, trialY]) => {
            const offsets = coordinateFitGroupOffsets(group, candidate.offsets, trialX, trialY);
            const rectangles = offsets.map((offset) => ({
              left: anchorX + offset.x - halfWidth,
              right: anchorX + offset.x + halfWidth,
              top: anchorY + offset.y - halfHeight,
              bottom: anchorY + offset.y + halfHeight
            }));
            const overlaps = rectangles.flatMap((rectangle) => (
              occupied.map((other) => overlapArea(rectangle, other)).filter((area) => area > 0)
            ));
            const collisionArea = overlaps.reduce((sum, area) => sum + area, 0);
            const actualShiftX = offsets.reduce((sum, offset, index) => (
              sum + offset.x - candidate.offsets[index].x
            ), 0) / offsets.length;
            const actualShiftY = offsets.reduce((sum, offset, index) => (
              sum + offset.y - candidate.offsets[index].y
            ), 0) / offsets.length;
            const spreadX = Math.max(...offsets.map((offset) => offset.x))
              - Math.min(...offsets.map((offset) => offset.x));
            const score = overlaps.length * 1000000
              + collisionArea * 100
              + candidate.penalty
              + spreadX * 8
              + Math.abs(actualShiftY) * 10
              + Math.abs(actualShiftX) * 4;
            if (!best || score < best.score) {
              best = { score, offsets, rectangles, direction: candidate.direction };
            }
          });
        });
        layouts.set(group.key, best.offsets);
        if (state.ecosystemCoordinateExpanded) expandedOccupied.push(...best.rectangles);
      });
    return layouts;
  })();

  const legendGroup = (dimensionKey, label) => {
    const encoding = filterDimensions[dimensionKey];
    const legend = encoding.legend ?? Object.entries(encoding.labels ?? {});
    return `
      <div class="ecosystem-coordinate-filter-group is-${escapeHtml(ecosystemClassToken(dimensionKey))}" role="group" aria-label="按${escapeHtml(label)}筛选">
        <b>${escapeHtml(label)}</b>
        ${legend.map(([value, valueLabel]) => {
          const active = activeFilters.get(dimensionKey) === value;
          return `<button type="button" class="${active ? "is-active" : ""}"
            data-ecosystem-map-filter-dimension="${escapeHtml(dimensionKey)}"
            data-ecosystem-map-filter-value="${escapeHtml(value)}"
            aria-pressed="${active}">${escapeHtml(valueLabel)}</button>`;
        }).join("")}
      </div>
    `;
  };

  return `
    <section class="ecosystem-panel ecosystem-coordinate-map ${state.ecosystemCoordinateExpanded ? "is-expanded" : ""}"
      aria-labelledby="ecosystem-coordinate-map-title">
      <div class="ecosystem-panel-head ecosystem-coordinate-map-head">
        <div>
          <span class="ecosystem-kicker">03-1 · 三维评分投影</span>
          <h3 id="ecosystem-coordinate-map-title">同一组三维评分，切换三个二维观察面</h3>
        </div>
        <p>坐标只读取正式评分；销量、评价和公式标签仅用于筛选与解释。点击绘图区空白处可清除当前选择。</p>
      </div>
      <div class="ecosystem-coordinate-toolbar">
        <div class="ecosystem-coordinate-views" role="group" aria-label="选择二维投影视图">
          ${Object.entries(ECOSYSTEM_COORDINATE_VIEWS).map(([key, item]) => `
            <button type="button" class="${viewKey === key ? "is-active" : ""}"
              data-ecosystem-coordinate-view="${escapeHtml(key)}"
              aria-pressed="${viewKey === key}">
              <span>${escapeHtml(item.label)}</span>
            </button>
          `).join("")}
        </div>
        <div class="ecosystem-coordinate-axis-summary" aria-live="polite">
          <span><b>X</b>${escapeHtml(xDimension.label)}</span>
          <span><b>Y</b>${escapeHtml(yDimension.label)}</span>
        </div>
      </div>
      <div class="ecosystem-niche-product-nav" aria-label="当前品类游戏">
        ${products.map((product) => `
          <button type="button" class="${product.id === state.selectedEcosystemProductId ? "is-active" : ""}"
            data-ecosystem-product="${escapeHtml(product.id)}"
            aria-pressed="${product.id === state.selectedEcosystemProductId}">
            ${ecosystemProductIcon(product)}<span>${escapeHtml(product.name)}</span>
          </button>
        `).join("")}
      </div>
      <div class="ecosystem-coordinate-stage">
        <div class="ecosystem-coordinate-scroll">
          <div class="ecosystem-coordinate-plot ${focus.isAll ? "is-all" : "has-focus"} ${state.selectedEcosystemProductId ? "has-selection" : ""} ${state.expandedEcosystemCoordinateGroupKey ? "has-pinned-group" : ""}"
          aria-label="${escapeHtml(prototype.name)}：横轴${escapeHtml(xDimension.label)}，纵轴${escapeHtml(yDimension.label)}，均使用零到四分；点击空白处清除当前产品选择"
          title="点击空白处清除当前产品选择">
          <div class="ecosystem-coordinate-grid" aria-hidden="true">
            ${[0, 1, 2, 3, 4].map((score) => `<i style="--index:${score}"></i>`).join("")}
          </div>
          <div class="ecosystem-coordinate-axis x">
            <strong>${escapeHtml(xDimension.label)}</strong>
            ${ecosystemAxisScoreTicks(view.x, "x")}
            <small><i>${escapeHtml(xDimension.low)}</i><i>${escapeHtml(xDimension.high)}</i></small>
          </div>
          <div class="ecosystem-coordinate-axis y">
            <strong>${escapeHtml(yDimension.label)}</strong>
            ${ecosystemAxisScoreTicks(view.y, "y")}
            <small><i>${escapeHtml(yDimension.high)}</i><i>${escapeHtml(yDimension.low)}</i></small>
          </div>
          ${projection.groups.map((group) => {
            if (group.items.length === 1) {
              return coordinateProductCardMarkup(group.items[0]);
            }

            const fanOffsets = coordinateGroupLayouts.get(group.key)
              ?? coordinateFitGroupOffsets(group, coordinateGroupFanCandidates(group)[0].offsets);
            const stackOffsets = coordinateFitGroupOffsets(group, coordinateGroupStackOffsets(group));
            const hullFor = (offsets) => {
              const minOffsetX = Math.min(...offsets.map((offset) => offset.x));
              const maxOffsetX = Math.max(...offsets.map((offset) => offset.x));
              const minOffsetY = Math.min(...offsets.map((offset) => offset.y));
              const maxOffsetY = Math.max(...offsets.map((offset) => offset.y));
              return {
                left: minOffsetX - 88,
                top: minOffsetY - 62,
                width: maxOffsetX - minOffsetX + 176,
                height: maxOffsetY - minOffsetY + 124
              };
            };
            const fanHull = hullFor(fanOffsets);
            const stackHull = hullFor(stackOffsets);
            const focusedCount = group.items.filter(({ product }) => (
              focus.isAll || focus.productIds.has(product.id)
            )).length;
            const hasActiveProduct = group.items.some(({ product }) => (
              product.id === state.selectedEcosystemProductId
            ));
            const groupIsPinned = state.expandedEcosystemCoordinateGroupKey === group.key;
            const groupIsExpanded = state.ecosystemCoordinateExpanded || groupIsPinned;
            return `
              <div class="ecosystem-coordinate-anchor-group ${focusedCount ? "is-focused" : "is-dimmed"} ${hasActiveProduct ? "has-active" : ""} ${groupIsPinned ? "is-pinned" : ""}"
                style="--x:${group.x};--y:${group.y};--stack-hull-left:${stackHull.left}px;--stack-hull-top:${stackHull.top}px;--stack-hull-width:${stackHull.width}px;--stack-hull-height:${stackHull.height}px;--fan-hull-left:${fanHull.left}px;--fan-hull-top:${fanHull.top}px;--fan-hull-width:${fanHull.width}px;--fan-hull-height:${fanHull.height}px"
                role="group"
                aria-label="${escapeHtml(xDimension.shortLabel)} ${group.xScore} 分、${escapeHtml(yDimension.shortLabel)} ${group.yScore} 分，共 ${group.items.length} 款同分游戏">
                <span class="ecosystem-coordinate-anchor-hull" aria-hidden="true"></span>
                <span class="ecosystem-coordinate-anchor-point" aria-hidden="true"></span>
                <button type="button" class="ecosystem-coordinate-anchor-count"
                  data-ecosystem-coordinate-group-toggle="${escapeHtml(group.key)}"
                  aria-pressed="${groupIsExpanded}"
                  aria-label="${state.ecosystemCoordinateExpanded ? `全屏模式已展开${group.items.length}款同分游戏` : `${groupIsPinned ? "收起" : "展开"}${group.items.length}款同分游戏`}"
                  ${state.ecosystemCoordinateExpanded ? "disabled" : ""}>同分 × ${group.items.length}</button>
                ${fanOffsets.map((fanOffset, index) => {
                  const stackOffset = stackOffsets[index];
                  const fanLength = Math.hypot(fanOffset.x, fanOffset.y);
                  const stackLength = Math.hypot(stackOffset.x, stackOffset.y);
                  const isFocused = focus.isAll || focus.productIds.has(fanOffset.item.product.id);
                  return `<span class="ecosystem-coordinate-anchor-line ${isFocused ? "is-focused" : "is-dimmed"}"
                    style="--stack-line-length:${stackLength}px;--stack-line-angle:${Math.atan2(stackOffset.y, stackOffset.x)}rad;--fan-line-length:${fanLength}px;--fan-line-angle:${Math.atan2(fanOffset.y, fanOffset.x)}rad"
                    aria-hidden="true"></span>`;
                }).join("")}
                ${fanOffsets.map((fanOffset, index) => coordinateProductCardMarkup(fanOffset.item, {
                  grouped: true,
                  fanOffsetX: fanOffset.x,
                  fanOffsetY: fanOffset.y,
                  stackOffsetX: stackOffsets[index].x,
                  stackOffsetY: stackOffsets[index].y,
                  groupKey: group.key
                })).join("")}
              </div>
            `;
          }).join("")}
          </div>
        </div>
        <button type="button" class="ecosystem-coordinate-expand-toggle"
          data-ecosystem-coordinate-expand
          aria-pressed="${state.ecosystemCoordinateExpanded}"
          aria-label="${state.ecosystemCoordinateExpanded ? "退出图表全屏" : "放大图表查看"}"
          title="${state.ecosystemCoordinateExpanded ? "退出全屏（Esc）" : "放大图表查看"}">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            ${state.ecosystemCoordinateExpanded
              ? '<path d="M9 3v6H3M15 3v6h6M9 21v-6H3M15 21v-6h6"></path>'
              : '<path d="M9 3H3v6M15 3h6v6M9 21H3v-6M15 21h6v-6"></path>'}
          </svg>
          <span>${state.ecosystemCoordinateExpanded ? "退出全屏" : "放大查看"}</span>
        </button>
      </div>
      <div class="ecosystem-coordinate-filters" aria-label="生态图筛选与解释标签">
        ${legendGroup("topology", `Show_TP · ${nodeEncodings.topology.title}`)}
        ${legendGroup("color", nodeEncodings.color.title)}
        ${legendGroup("secondary_badge", `C₁ · ${nodeEncodings.secondary_badge.title}`)}
        ${legendGroup("c1_synergy", "C₁ 协同")}
        ${legendGroup("sales_tier", "销量门槛")}
        ${legendGroup("branch", singleCaseMechanisms ? "机制" : "分支")}
        ${focus.isFilter ? `
          <div class="ecosystem-map-filter-status is-filtering" aria-live="polite">
            <strong>已筛选 ${focus.productIds.size} / ${positionedProducts.length} 款</strong>
            <span>${focus.activeFilters.map((item) => escapeHtml(item.label)).join(" · ")}</span>
            <button type="button" data-ecosystem-map-filter-clear>清除筛选</button>
          </div>
        ` : ""}
      </div>
      ${ecosystemCoordinateScoreTableMarkup(products, positionedProducts, view)}
      ${projection.unlocated.length ? `
        <section class="ecosystem-unlocated" aria-label="待定位游戏">
          <header><strong>待定位游戏</strong><span>${projection.unlocated.length} 款</span></header>
          ${projection.unlocated.map(({ product, missing }) => `
            <button type="button" data-ecosystem-product="${escapeHtml(product.id)}">
              ${ecosystemProductIcon(product)}
              <span><strong>${escapeHtml(product.name)}</strong><small>${missing.map((key) => `缺${ECOSYSTEM_DIMENSIONS[key].shortLabel}评分`).join(" · ")}</small></span>
            </button>
          `).join("")}
        </section>
      ` : ""}
    </section>
  `;
}

function ecosystemFourLayerArchitectureMarkup(config, prototype) {
  const architecture = config.four_layer_architecture;
  const nicheMap = config.niche_map;
  if (!architecture || !nicheMap) return "";

  const singleCaseMechanisms = architecture.presentation_mode === "single_case_mechanisms";
  const core = nicheMap.presets[architecture.core_preset_id ?? "core"];
  const branchEntries = (architecture.branch_ids ?? [])
    .map((branchId) => [branchId, nicheMap.presets[branchId]])
    .filter(([, branch]) => branch?.kind === "BRANCH");
  const expandedBranches = new Set(state.expandedEcosystemBranches);
  const risks = architecture.boundaries ?? [];
  const allGameBranchRows = (config.positions ?? [])
    .map((position) => {
      const product = state.data.productById.get(position.product_id);
      if (!product) return null;
      const branches = branchEntries
        .filter(([, branch]) => (branch.products ?? []).includes(product.id))
        .map(([branchId, branch]) => ({ id: branchId, label: branch.label }));
      return { product, branches };
    })
    .filter(Boolean);

  const fieldChips = (fields = []) => fields.map((field) =>
    `<code>${escapeHtml(formulaDisplayKey(field))}</code>`
  ).join("");

  return `
    <section class="ecosystem-four-layer" aria-labelledby="ecosystem-four-layer-title">
      <div class="ecosystem-panel-head ecosystem-four-layer-head">
        <div>
          <span class="ecosystem-kicker">${singleCaseMechanisms ? "04 · 当前案例的机制改动" : "04 · 品类改动方向"}</span>
          <h3 id="ecosystem-four-layer-title">${singleCaseMechanisms ? "当前案例观察到的机制改动" : "从原型核心分化出的改动方向"}</h3>
        </div>
        ${singleCaseMechanisms
          ? "<p>以当前唯一案例拆解公式中发生变化的位置；这些机制可以组合，但暂不作为已验证的品类分支。</p>"
          : ""}
      </div>

      <div class="ecosystem-layer-core">
        <button type="button"
          class="${state.selectedEcosystemMapPreset === (architecture.core_preset_id ?? "core") ? "is-active" : ""}"
          data-ecosystem-map-preset="${escapeHtml(architecture.core_preset_id ?? "core")}"
          aria-pressed="${state.selectedEcosystemMapPreset === (architecture.core_preset_id ?? "core")}">
          <span class="ecosystem-layer-index">01 · 原型核心</span>
          <strong>${escapeHtml(core?.title ?? prototype.name)}</strong>
          <p>${escapeHtml(core?.summary ?? config.analysis_basis?.inheritance_summary ?? "")}</p>
          <span class="ecosystem-layer-fields">${fieldChips(core?.fields ?? [])}</span>
        </button>
      </div>

      <div class="ecosystem-layer-connector" aria-hidden="true"><i></i><span>${singleCaseMechanisms ? "拆解" : "分支"}</span></div>

      <div class="ecosystem-layer-branches">
        <header>
          <span class="ecosystem-layer-index">02 · ${singleCaseMechanisms ? "机制改动" : "改动分支"}</span>
          <div>
            <strong>${branchEntries.length} ${singleCaseMechanisms ? "个机制改动维度" : "条改动分支"}</strong>
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
                  <span class="ecosystem-branch-number">${singleCaseMechanisms ? "改动 " : "B"}${String(index + 1).padStart(2, "0")}</span>
                  <span class="ecosystem-branch-copy">
                    <small>${escapeHtml(branch.label)}</small>
                    <strong>${escapeHtml(branch.title)}</strong>
                    <i>${escapeHtml(branch.summary)}</i>
                  </span>
                  <span class="ecosystem-branch-meta">
                    <b>${singleCaseMechanisms ? "当前案例" : `${cases.length} 款代表游戏`}</b>
                    <span>${fieldChips(branch.fields ?? [])}</span>
                  </span>
                  <em aria-hidden="true">${expanded ? "−" : "+"}</em>
                </button>
                <div class="ecosystem-branch-cases" id="ecosystem-branch-cases-${escapeHtml(branchId)}" ${expanded ? "" : "hidden"}>
                  <div class="ecosystem-case-layer-label">
                    <span class="ecosystem-layer-index">03 · ${singleCaseMechanisms ? "案例证据" : "代表游戏"}</span>
                    <p>${escapeHtml(ecosystemChineseStructureText(architecture.case_evidence_policy))}</p>
                  </div>
                  <div class="ecosystem-case-grid">
                    ${cases.map(({ product, position }) => {
                      const productActive = state.selectedEcosystemProductId === product.id;
                      const evidenceFields = branch.fields ?? [];
                      const sales = ecosystemSalesSnapshot(product);
                      const steamReview = ecosystemSteamReviewSnapshot(product);
                      return `
                        <article class="ecosystem-case-card ${productActive ? "is-active" : ""}">
                          <header>
                            <button type="button" data-ecosystem-product="${escapeHtml(product.id)}"
                              aria-label="查看 ${escapeHtml(product.name)} 的全部产品定位证据">
                              ${ecosystemProductIcon(product)}
                              <span><small>${singleCaseMechanisms ? "当前案例" : "代表游戏"}</small><strong>${escapeHtml(product.name)}</strong></span>
                            </button>
                            <span class="ecosystem-case-market-meta">
                              <i>销量 ${escapeHtml(sales.displayTier)}</i>
                              <i class="tone-${escapeHtml(ecosystemClassToken(steamReview.tone))}">${escapeHtml(steamReview.display)}</i>
                            </span>
                            <b>${position?.role === "cornerstone" ? "基石" : `${evidenceFields.length} 字段`}</b>
                          </header>
                          <p>${escapeHtml(position?.position_note ?? "该案例已进入分支，位置说明待补充。")}</p>
                          <div class="ecosystem-case-evidence" aria-label="${escapeHtml(product.name)}的字段证据">
                            ${evidenceFields.map((field) => {
                              const comparison = ecosystemFieldComparison(config, product, field);
                              const reviewStatusLabel = comparison.reviewStatus === "confirmed"
                                ? ""
                                : ` · ${REVIEW_STATUS_LABELS[comparison.reviewStatus] ?? "草稿"}`;
                              return `
                                <button type="button"
                                  class="is-${escapeHtml(comparison.state.className)}"
                                  data-ecosystem-product="${escapeHtml(product.id)}"
                                  data-ecosystem-field="${escapeHtml(field)}"
                                  aria-label="查看 ${escapeHtml(product.name)} 的 ${escapeHtml(formulaDisplayKey(field))} 字段证据">
                                  <span>
                                    <code>${escapeHtml(formulaDisplayKey(field))}</code>
                                    <small>${escapeHtml(comparison.state.label)}${escapeHtml(reviewStatusLabel)}</small>
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
                  <p class="ecosystem-branch-boundary"><b>${singleCaseMechanisms ? "机制边界" : "分支边界"}</b>${escapeHtml(branch.boundary)}</p>
                  <button type="button" class="ecosystem-branch-map-expand"
                    data-ecosystem-open-coordinate-expanded="${escapeHtml(branchId)}"
                    aria-label="在交互图中查看${escapeHtml(branch.label)}${singleCaseMechanisms ? "机制" : "分支"}">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3H3v6M15 3h6v6M9 21H3v-6M15 21h6v-6"></path></svg>
                    <span>放大查看交互图</span>
                  </button>
                </div>
              </article>
            `;
          }).join("")}
        </div>
        <section class="ecosystem-branch-membership" aria-labelledby="ecosystem-branch-membership-title">
          <header>
            <div>
              <strong id="ecosystem-branch-membership-title">${singleCaseMechanisms ? "当前案例的机制改动" : "全部游戏分支归属"}</strong>
              <p>${singleCaseMechanisms ? "点击案例聚焦产品；点击机制同步切换上方交互图。" : "点击游戏聚焦对应案例；点击分支同步切换上方交互图。"}</p>
            </div>
            <span>${allGameBranchRows.length} 款游戏</span>
          </header>
          <div class="ecosystem-branch-membership-table-wrap">
            <table>
              <thead>
                <tr><th scope="col">${singleCaseMechanisms ? "案例" : "游戏"}</th><th scope="col">${singleCaseMechanisms ? "涉及机制" : "所属分支"}</th></tr>
              </thead>
              <tbody>
                ${allGameBranchRows.map(({ product, branches }) => `
                  <tr class="${state.selectedEcosystemProductId === product.id ? "is-active" : ""}">
                    <td>
                      <button type="button" class="ecosystem-branch-membership-product"
                        data-ecosystem-product="${escapeHtml(product.id)}"
                        aria-label="聚焦 ${escapeHtml(product.name)}">
                        ${ecosystemProductIcon(product)}
                        <strong>${escapeHtml(product.name)}</strong>
                      </button>
                    </td>
                    <td>
                      <div class="ecosystem-branch-membership-chips">
                        ${branches.length ? branches.map((branch) => `
                          <button type="button"
                            class="${state.selectedEcosystemMapPreset === branch.id ? "is-active" : ""}"
                            data-ecosystem-map-preset="${escapeHtml(branch.id)}"
                            aria-pressed="${state.selectedEcosystemMapPreset === branch.id}">${escapeHtml(branch.label)}</button>
                        `).join("") : `<span>${singleCaseMechanisms ? "暂无机制改动" : "暂无改动分支"}</span>`}
                      </div>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div class="ecosystem-layer-connector is-boundary" aria-hidden="true"><i></i><span>${singleCaseMechanisms ? "跨机制检查组合风险" : "跨分支检查组合风险"}</span></div>

      <div class="ecosystem-layer-boundaries">
        <header>
          <span class="ecosystem-layer-index">04 · 设计风险</span>
          <div>
            <strong>独立风险</strong>
            <p>设计风险不是游戏优劣结论；点击任一风险，会在上方生态位图同步聚焦对应案例。</p>
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
                  <span><small>风险 ${String(index + 1).padStart(2, "0")}</small><b>${escapeHtml(risk.label)}</b></span>
                  <strong>${escapeHtml(risk.title)}</strong>
                </button>
                <dl>
                  <div><dt>触发</dt><dd>${escapeHtml(risk.trigger)}</dd></div>
                  <div><dt>后果</dt><dd>${escapeHtml(risk.consequence)}</dd></div>
                  <div><dt>应对</dt><dd>${escapeHtml(risk.mitigation)}</dd></div>
                  ${risk.solution_example ? `<div class="is-solution"><dt>解法案例</dt><dd>${escapeHtml(risk.solution_example)}</dd></div>` : ""}
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
  const modeCard = (mode) => {
    return `
      <article class="ecosystem-bd-mode tone-${escapeHtml(ecosystemClassToken(mode.kind))}">
        <span><small>${escapeHtml(ecosystemStructureLabel(mode.kind))}</small><b>${escapeHtml(mode.label)}</b></span>
        <strong>${escapeHtml(mode.title)}</strong>
        <p>${escapeHtml(mode.description)}</p>
        <em>${escapeHtml(mode.boundary)}</em>
        <span class="ecosystem-bd-fields">${(mode.fields ?? []).map((field) => `<code>${escapeHtml(formulaDisplayKey(field))}</code>`).join("")}</span>
      </article>
    `;
  };

  return `
    <section class="ecosystem-bd-analysis" aria-labelledby="ecosystem-bd-analysis-title">
      <div class="ecosystem-panel-head ecosystem-bd-analysis-head">
        <div>
          <span class="ecosystem-kicker">05 · BD 构筑分析</span>
          <h3 id="ecosystem-bd-analysis-title">${escapeHtml(analysis.title ?? "BD 设计分类：围绕符号池与结算规则建立控制")}</h3>
        </div>
      </div>

      <div class="ecosystem-bd-formula">
        <span>分析公式</span>
        <strong>${escapeHtml(analysis.formula)}</strong>
        <p>${escapeHtml(analysis.principle)}</p>
      </div>

      ${analysis.control_model ? `
        <div class="ecosystem-bd-control-model">
          <header>
            <div><small>品质控制门槛</small><strong>${escapeHtml(analysis.control_model.formula)}</strong></div>
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

      <div class="ecosystem-bd-mode-grid" aria-label="BD 设计分类">
        ${modes.map((mode) => modeCard(mode)).join("")}
      </div>

      <p class="ecosystem-bd-conclusion"><b>${escapeHtml(analysis.conclusion_label ?? "集中趋势")}</b>${escapeHtml(analysis.conclusion)}</p>
    </section>
  `;
}

function ecosystemGenericMapMarkup(config, prototype, products, positionedProducts, unpositioned) {
  return `
    <section class="ecosystem-panel">
      <div class="ecosystem-panel-head">
        <div><span class="ecosystem-kicker">03-1 · 生态位图</span><h3>产品定位与潜在生态位</h3></div>
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

let ecosystemCoordinatePlotMeasureFrame = null;

function scheduleEcosystemCoordinatePlotMeasurement({ resetViewport = false } = {}) {
  window.cancelAnimationFrame(ecosystemCoordinatePlotMeasureFrame);
  ecosystemCoordinatePlotMeasureFrame = window.requestAnimationFrame(() => {
    const plot = elements.ecosystemWorkbench?.querySelector(".ecosystem-coordinate-plot");
    if (!plot) {
      window.requestAnimationFrame(restoreEcosystemCoordinateReturnAnchor);
      return;
    }
    if (resetViewport) {
      const scroll = plot.closest(".ecosystem-coordinate-scroll");
      if (scroll) {
        scroll.scrollLeft = 0;
        scroll.scrollTop = 0;
      }
    }
    const nextSize = {
      width: Math.round(plot.clientWidth),
      height: Math.round(plot.clientHeight)
    };
    const currentSize = state.ecosystemCoordinatePlotSize ?? {};
    if (
      Math.abs(nextSize.width - Number(currentSize.width || 0)) <= 1
      && Math.abs(nextSize.height - Number(currentSize.height || 0)) <= 1
    ) {
      window.requestAnimationFrame(restoreEcosystemCoordinateReturnAnchor);
      return;
    }
    state.ecosystemCoordinatePlotSize = nextSize;
    renderEcosystemWorkbench();
  });
}

window.addEventListener("resize", () => {
  positionEcosystemNicheEdges();
  scheduleEcosystemCoordinatePlotMeasurement();
});

function renderEcosystemWorkbench() {
  const prototype = state.data.prototypeById.get(state.selectedEcosystemPrototypeId);
  if (!prototype) {
    elements.ecosystemWorkbench.innerHTML = '<div class="library-empty">暂无品类原型。</div>';
    return;
  }
  const products = ecosystemProducts(prototype.id);
  const config = state.data.ecosystemByPrototypeId.get(prototype.id);
  if (
    state.selectedEcosystemProductId
    && !products.some((product) => product.id === state.selectedEcosystemProductId)
  ) {
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
          <div class="ecosystem-panel-head"><div><span class="ecosystem-kicker">当前成员</span><h3>当前成员</h3></div></div>
          <div class="ecosystem-product-list">
            ${products.length
              ? products.map((product) => `<button type="button" class="ecosystem-product-button">${escapeHtml(product.name)}</button>`).join("")
              : "尚无产品；可在游戏库详情中设置归属。"}
          </div>
        </section>
        <aside class="ecosystem-panel ecosystem-detail">
          <span class="ecosystem-kicker">下一步</span>
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
      </div>
      <div class="ecosystem-summary-stat" aria-label="当前品类共 ${products.length} 款游戏">
        <strong>${products.length}</strong>
        <span>款游戏</span>
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
            <span class="ecosystem-kicker">03-2 · 产品定位详情</span>
            <div class="ecosystem-detail-title">
              ${selectedProduct ? ecosystemProductIcon(selectedProduct) : ""}
              <div>
                <h3>${escapeHtml(selectedProduct?.name ?? "请选择产品")}</h3>
                ${selectedProduct && positionStatus.className !== "confirmed" ? `
                  <span class="ecosystem-position-status ${escapeHtml(positionStatus.className)}">
                    ${escapeHtml(positionStatus.label)}
                  </span>
                ` : ""}
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
          ${selectedProduct ? ecosystemAssessmentMarkup(config, selectedProduct, selectedPosition) : ""}
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
  `;

  revealEcosystemCoordinateSectionForExpandedMode();

  const axisDefinitions = Array.from(
    elements.ecosystemWorkbench.querySelectorAll(".ecosystem-axis-definition")
  );
  let axisRubricAlignmentFrame = null;
  const alignAxisRubrics = (shouldOpen) => {
    window.cancelAnimationFrame(axisRubricAlignmentFrame);
    const rubrics = axisDefinitions
      .map((definition) => definition.querySelector(".ecosystem-axis-rubric"))
      .filter(Boolean);
    rubrics.forEach((rubric) => {
      rubric.style.minHeight = "";
    });
    if (!shouldOpen) return;
    axisRubricAlignmentFrame = window.requestAnimationFrame(() => {
      const maxHeight = Math.max(
        ...rubrics.map((rubric) => rubric.getBoundingClientRect().height)
      );
      rubrics.forEach((rubric) => {
        rubric.style.minHeight = `${maxHeight}px`;
      });
    });
  };
  axisDefinitions.forEach((definition) => {
    definition.addEventListener("toggle", () => {
      const shouldOpen = definition.open;
      axisDefinitions.forEach((peer) => {
        if (peer.open !== shouldOpen) peer.open = shouldOpen;
      });
      alignAxisRubrics(shouldOpen);
    });
  });

  elements.ecosystemWorkbench.querySelectorAll("[data-ecosystem-product]").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.ecosystemProduct;
      const field = button.dataset.ecosystemField ?? null;
      if (button.dataset.coordinateGroup) {
        state.expandedEcosystemCoordinateGroupKey = button.dataset.coordinateGroup;
      }
      const shouldPinComparison = button.matches(".ecosystem-matrix-cell.is-changed");
      selectEcosystemProduct(productId, field);
      if (!shouldPinComparison || !field) {
        hideEcosystemComparisonPopover(true);
        return;
      }
      window.requestAnimationFrame(() => {
        const replacement = Array.from(
          elements.ecosystemWorkbench.querySelectorAll(".ecosystem-matrix-cell.is-changed")
        ).find((candidate) => (
          candidate.dataset.ecosystemProduct === productId
          && candidate.dataset.ecosystemField === field
        ));
        if (replacement) showEcosystemComparisonPopover(replacement, true);
      });
    });
  });
  bindEcosystemComparisonPopoverTriggers(elements.ecosystemWorkbench);
  elements.ecosystemWorkbench.querySelectorAll("[data-ecosystem-map-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      selectEcosystemMapPreset(button.dataset.ecosystemMapPreset);
    });
  });
  elements.ecosystemWorkbench.querySelectorAll("[data-ecosystem-coordinate-view]").forEach((button) => {
    button.addEventListener("click", () => {
      selectEcosystemCoordinateView(button.dataset.ecosystemCoordinateView);
    });
  });
  elements.ecosystemWorkbench.querySelectorAll("[data-ecosystem-score-sort]").forEach((button) => {
    button.addEventListener("click", () => {
      selectEcosystemScoreTableSort(button.dataset.ecosystemScoreSort);
    });
  });
  elements.ecosystemWorkbench.querySelector("[data-ecosystem-coordinate-expand]")?.addEventListener("click", (event) => {
    toggleEcosystemCoordinateExpanded(null, event.currentTarget);
  });
  elements.ecosystemWorkbench.querySelectorAll("[data-ecosystem-open-coordinate-expanded]").forEach((button) => {
    button.addEventListener("click", () => {
      openEcosystemCoordinateExpandedForBranch(
        button.dataset.ecosystemOpenCoordinateExpanded,
        button
      );
    });
  });
  elements.ecosystemWorkbench.querySelectorAll("[data-ecosystem-coordinate-group-toggle]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleEcosystemCoordinateGroup(button.dataset.ecosystemCoordinateGroupToggle);
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
  elements.ecosystemWorkbench.querySelector(".ecosystem-niche-map-plot")?.addEventListener("click", (event) => {
    if (event.target.closest("button, [data-model-node], [data-ecosystem-map-preset]")) return;
    selectEcosystemMapPreset("all");
  });
  const coordinatePlot = elements.ecosystemWorkbench.querySelector(".ecosystem-coordinate-plot");
  const axisHelpButtons = coordinatePlot?.querySelectorAll("[data-ecosystem-axis-help]") ?? [];
  const closeAxisScoreHelp = (except = null) => {
    axisHelpButtons.forEach((button) => {
      if (button === except) return;
      button.closest(".ecosystem-coordinate-axis-score")?.classList.remove("is-open", "is-pinned");
      button.setAttribute("aria-expanded", "false");
    });
  };
  axisHelpButtons.forEach((button) => {
    const score = button.closest(".ecosystem-coordinate-axis-score");
    const openHelp = () => {
      closeAxisScoreHelp(button);
      score?.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
    };
    const closeHoverHelp = () => {
      if (score?.classList.contains("is-pinned")) return;
      score?.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
    };
    score?.addEventListener("mouseenter", openHelp);
    score?.addEventListener("mouseleave", closeHoverHelp);
    button.addEventListener("focus", openHelp);
    button.addEventListener("blur", closeHoverHelp);
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      closeAxisScoreHelp(button);
      score?.classList.add("is-open", "is-pinned");
      button.setAttribute("aria-expanded", "true");
    });
  });
  coordinatePlot?.addEventListener("click", (event) => {
    closeAxisScoreHelp();
    if (event.target.closest("button")) return;
    clearEcosystemProductSelection();
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
  scheduleEcosystemCoordinatePlotMeasurement();
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
  const preferredVariant = state.data.variantById.get(DEFAULT_ATLAS_VARIANT_ID)
    ?? state.data.variants.find((variant) => variant.name === "猫神牧场");
  const preferredPrototype = preferredVariant
    ? state.data.prototypeById.get(preferredVariant.prototype_id)
    : null;
  const preferredMechanism = preferredPrototype
    ? state.data.mechanismById.get(preferredPrototype.primary_mother_id)
    : null;

  if (preferredVariant && preferredPrototype && preferredMechanism) {
    state.selectedMechanismId = preferredMechanism.id;
    state.selectedPrototypeId = preferredPrototype.id;
    state.selectedVariantId = preferredVariant.id;
    state.detailLevel = "variant";
    return;
  }

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
    P_t: ["random", "put", "c1-reference", "combo", "bd"],
    Pool_Symbol: ["random"],
    Random: ["random"],
    SingleSpin_Symbol: ["random", "put"],
    Put: ["put"],
    Show_TP: ["put", "combo"],
    Show_State: ["put", "c1-reference", "combo"],
    Combo: ["combo"],
    C1: ["c1-reference", "combo"],
    C2: ["combo"],
    Spin_Result: ["combo"],
    N: ["random", "put", "c1-reference", "combo"],
    BD: ["bd"]
  }[selected] ?? [];
  const activeEdges = {
    P_t: ["random-put", "put-c1-reference", "c1-reference-combo", "cycle-bd"],
    SingleSpin_Symbol: ["random-put"],
    Put: ["random-put", "put-c1-reference"],
    Show_TP: ["put-c1-reference", "c1-reference-combo"],
    Show_State: ["put-c1-reference", "c1-reference-combo"],
    Combo: ["c1-reference-combo"],
    C1: ["put-c1-reference", "c1-reference-combo"],
    C2: ["c1-reference-combo"],
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
    Combo: "单次 Spin 的第三步 · 横跨第一峰即时识别与第二峰二次揭晓",
    C1: "Combo 的符号协同参数 · 第一峰即时识别",
    C2: "Combo 中依托 C₁ 工作的二次揭晓层 · 第二峰",
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
    Show_State: "Put → Show_State → C₁ 即时识别 → Combo",
    Combo: "C₁ 即时识别 → Combo(C₁ + C₂) → Spin_Result",
    C1: "Show_State → C₁ 即时识别；同一 C₁ 同时作为 Combo 的符号协同参数",
    C2: "Combo 内依托 C₁ 的二次揭晓、修饰或转译 → Spin_Result",
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
      "state-c1-reference",
      "c1-reference-combo",
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
    Show_TP: ["single-put", "put-state", "state-c1-reference", "c1-reference-combo", "combo-result"],
    Show_State: ["put-state", "state-c1-reference"],
    Combo: ["c1-reference-combo", "combo-result"],
    C1: ["state-c1-reference", "c1-reference-combo", "combo-result"],
    C2: ["c1-reference-combo", "combo-result"],
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
        <span class="interactive-arrow ${activeEdges.includes("put-c1-reference") ? "active" : ""}">→</span>
        <div class="interactive-stage interactive-c1-reference ${activeStages.includes("c1-reference") ? "has-active" : ""}">
          ${formulaToken("C1", "C₁")}
          <small>即时识别</small>
        </div>
        <span class="interactive-arrow ${activeEdges.includes("c1-reference-combo") ? "active" : ""}">→</span>
        <div class="interactive-stage ${activeStages.includes("combo") ? "has-active" : ""}">
          ${formulaToken("Combo")}
          <span class="formula-fixed-label">(</span>
          ${formulaToken("C1", "C₁")}
          <span class="formula-separator">+</span>
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
        ${flowDownArrow("state-c1-reference")}
        <div class="flow-lane">
          <span class="flow-step flow-rule flow-c1-reference ${selected === "C1" ? "has-active" : ""}">
            ${flowToken("C1", "C₁")}
            <small>即时识别</small>
          </span>
          ${flowArrow("c1-reference-combo")}
          <span class="flow-step flow-rule ${["Combo", "C1", "C2", "Show_TP"].includes(selected) ? "has-active" : ""}">
            <span>
              ${flowToken("Combo")}<b>(</b>${flowToken("C1", "C₁")}<b>+</b>${flowToken("C2", "C₂")}<b>)</b>
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

const C2_DEPTH_INFO = {
  0: {
    label: "0 分 · 无独立 C₂",
    title: "仅由 C₁ 直接产生 Spin_Result，没有新的信息释放阶段。",
    copy: "20 点基础攻击在 C₁ 建立时就已经成为最终答案，结果立即封闭。",
    boundary: "边界：不把必要的数值落盘或界面刷新算作 C₂。"
  },
  1: {
    label: "1 分 · 确定结果展示",
    title: "答案已经封闭，后续过程只把已知结果播放出来。",
    copy: "20 点基础攻击已经确定；攻击动作、飞行轨迹或多次受击不再改变玩家预测。",
    boundary: "边界：动画再长、攻击次数再多，只要不释放新信息，仍是 1 分。"
  },
  2: {
    label: "2 分 · 单次关键揭晓",
    title: "一个此前未知的关键信息，使玩家明显更新一次预测。",
    copy: "同样从 20 点基础攻击开始；暴击是否成立通过 C₂ 揭晓，答案在这个关键节点之后封闭。",
    boundary: "边界：多次播放同一答案不会自动升到 3 分。"
  },
  3: {
    label: "3 分 · 多阶段递进揭晓",
    title: "前段结果改变后段条件，玩家需要多次修正预测。",
    copy: "20 点基础攻击先触发破甲，再出现追加目标；每个阶段都改变下一阶段可能兑现的结果。",
    boundary: "边界：阶段必须有信息依赖，不能只是把一个确定总伤害拆成多段。"
  },
  4: {
    label: "4 分 · 链式持续揭晓",
    title: "结果继续生成新的结果节点，链长或结束时间事前可能未知。",
    copy: "20 点基础攻击触发新目标、再次结算与后续触发，玩家无法只凭 C₁ 预先封闭最终答案。",
    boundary: "边界：深度表示链式揭晓程度，不直接表示设计质量。"
  }
};

function selectC2DepthScore(score) {
  const value = Number(score);
  const info = C2_DEPTH_INFO[value];
  if (!info || !elements.c2DepthPage) return;
  state.selectedC2DepthScore = value;
  elements.c2DepthPage.querySelectorAll("[data-c2-depth-score]").forEach((button) => {
    const active = Number(button.dataset.c2DepthScore) === value;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  elements.c2DepthInfo.querySelector("[data-c2-depth-info-label]").textContent = info.label;
  elements.c2DepthInfo.querySelector("[data-c2-depth-info-title]").textContent = info.title;
  elements.c2DepthInfo.querySelector("[data-c2-depth-info-copy]").textContent = info.copy;
  elements.c2DepthInfo.querySelector("[data-c2-depth-info-boundary]").textContent = info.boundary;
}

function openC2DepthPage() {
  if (!elements.c2DepthPage) return;
  elements.c2DepthPage.hidden = false;
  selectC2DepthScore(state.selectedC2DepthScore);
  if (window.location.hash !== "#c2-reveal-depth") {
    window.location.hash = "c2-reveal-depth";
  } else {
    elements.c2DepthPage.scrollIntoView({ block: "start", behavior: "smooth" });
  }
}

function closeC2DepthPage() {
  if (!elements.c2DepthPage) return;
  elements.c2DepthPage.hidden = true;
  selectTerm("C2");
  window.location.hash = formulaTermAnchorId("C2");
}

function bindC2DepthPage() {
  if (!elements.c2DepthPage) return;
  elements.c2DepthPage.querySelectorAll("[data-c2-depth-score]").forEach((button) => {
    button.addEventListener("click", () => selectC2DepthScore(button.dataset.c2DepthScore));
  });
  elements.c2DepthPage.querySelector("[data-c2-depth-back]")?.addEventListener("click", closeC2DepthPage);
  if (window.location.hash === "#c2-reveal-depth") {
    elements.c2DepthPage.hidden = false;
  }
  window.addEventListener("hashchange", () => {
    elements.c2DepthPage.hidden = window.location.hash !== "#c2-reveal-depth";
  });
  selectC2DepthScore(state.selectedC2DepthScore);
}

function renderTermDetail() {
  const term = state.data.termByKey.get(state.selectedTermKey);
  if (!term) {
    elements.termDetail.innerHTML = "<p>当前字段尚无定义。</p>";
    return;
  }

  const inputs = term.inputs?.length ? term.inputs.join(" · ") : "无直接输入";
  const outputs = term.outputs?.length ? term.outputs.join(" · ") : "无直接输出";
  const details = [
    ...(term.boundaries ?? []),
    ...(term.contents ?? []),
    ...(term.possible_effects ?? [])
  ];
  const showTypes = state.data.terms.enums.show_tp_enum.values;
  const putTypes = state.data.terms.enums.put_control_enum.values;
  const classificationDimensionsMarkup = (term.classification_dimensions ?? []).length ? `
    <section class="field-classification-block field-subsection">
      <div class="subsection-heading">
        <div>
          <p class="eyebrow">${escapeHtml(formulaDisplayKey(term.key))} · 正式分类</p>
          <h3>${term.classification_dimensions.length > 1
            ? "分别记录多个维度"
            : term.classification_dimensions[0]?.multi_select
              ? "使用可组合标签"
              : "按单一维度判定"}</h3>
        </div>
        <p>${escapeHtml(term.classification_rule ?? "各项标签可以组合使用。")}</p>
      </div>
      <div class="field-classification-grid">
        ${term.classification_dimensions.map((dimension) => {
          const values = state.data.terms.enums[dimension.enum_ref]?.values ?? [];
          return `
            <article class="field-classification-card">
              <header><strong>${escapeHtml(dimension.name)}</strong>${dimension.multi_select ? "<span>可多选</span>" : ""}</header>
              <div class="field-classification-options">
                ${values.map((item) => `
                  <div>
                    <b>${escapeHtml(item.name)}</b>
                    <p>${escapeHtml(item.definition)}</p>
                  </div>
                `).join("")}
              </div>
            </article>
          `;
        }).join("")}
      </div>
      ${(term.classification_examples ?? []).length ? `
        <div class="field-classification-examples">
          <strong>组合示例</strong>
          ${(term.classification_examples ?? []).map((example) => `
            <div><b>${escapeHtml(example.name)}</b><span>${example.tags.map((tag) => `<i>${escapeHtml(tag)}</i>`).join("")}</span></div>
          `).join("")}
        </div>
      ` : ""}
    </section>
  ` : "";
  const detailSectionsMarkup = (term.detail_sections ?? []).map((section) => `
    <section class="field-detail-section ${section.status === "research_only" ? "is-research-only" : ""}">
      <h4 class="detail-section-title">${escapeHtml(section.title)}${section.status === "research_only" ? "<span>尚未冻结分类</span>" : ""}</h4>
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
    </div>
    ${details.length ? `
      <strong>定义边界</strong>
      <ul class="boundary-list">
        ${details.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    ` : ""}
    ${classificationDimensionsMarkup}
    ${term.key === "C2" ? `
      <section class="c2-depth-entry field-subsection">
        <div>
          <p class="eyebrow">C₂ · 深度评分工具</p>
          <h3>用同一条时间尺度比较 0—4 分</h3>
          <p>五行都从“20 点基础攻击”出发，只比较答案如何随时间封闭。</p>
        </div>
        <button type="button" data-open-c2-depth>进入 C₂ 二次揭晓深度说明 →</button>
      </section>
    ` : ""}
    ${term.key === "Put" ? `
      <section class="field-detail-section field-subsection">
        <div class="subsection-heading">
          <div>
            <p class="eyebrow">Put · 操作类型</p>
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
            <p class="eyebrow">Show_TP · 正式类型</p>
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
  elements.termDetail.querySelector("[data-open-c2-depth]")?.addEventListener("click", openC2DepthPage);
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
      ${node.type === "category_prototype" ? `
        <button
          type="button"
          class="node-ecosystem-jump"
          data-open-prototype-ecosystem="${escapeHtml(node.id)}"
          aria-label="前往 ${escapeHtml(node.name)} 的品类生态分析基准"
        >
          <span>前往品类生态</span>
          <strong>查看品类分析基准<i aria-hidden="true">→</i></strong>
          <small>自动选中 ${escapeHtml(node.name)}</small>
        </button>
      ` : `
        <div class="node-status-box">
          <strong>${escapeHtml(status.label)}</strong>
          <p>${escapeHtml(status.description)}</p>
          ${parent ? `<p>继承自：${escapeHtml(parent.name)}</p>` : "<p>体验公式下的第一层约束。</p>"}
        </div>
      `}
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

  elements.nodeDetail
    .querySelector("[data-open-prototype-ecosystem]")
    ?.addEventListener("click", (event) => {
      openPrototypeEcosystemBaseline(event.currentTarget.dataset.openPrototypeEcosystem);
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

  elements.productScopeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const scope = button.dataset.libraryProductScope;
      if (!['current', 'history'].includes(scope) || scope === state.libraryProductScope) return;
      state.libraryProductScope = scope;
      state.libraryProductQuery = "";
      elements.productSearch.value = "";
      renderProductCatalog();
    });
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
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !state.ecosystemCoordinateExpanded) return;
      toggleEcosystemCoordinateExpanded(false);
    });
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
    bindC2DepthPage();
    bindCoreInsights();
    bindCognitionScoreDialog();
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

const MAJOR_SECTION_STORAGE_KEY = "r-rougeslot-major-sections-v1";

function readMajorSectionState() {
  try {
    return JSON.parse(window.localStorage.getItem(MAJOR_SECTION_STORAGE_KEY) || "{}") || {};
  } catch {
    return {};
  }
}

function writeMajorSectionState(stateMap) {
  try {
    window.localStorage.setItem(MAJOR_SECTION_STORAGE_KEY, JSON.stringify(stateMap));
  } catch {
    // localStorage 不可用时仍保留本次页面内的折叠交互。
  }
}

const majorSectionState = readMajorSectionState();

function setMajorSectionCollapsed(section, collapsed, { persist = true } = {}) {
  const key = section.dataset.majorSectionKey;
  const content = section.querySelector(":scope > .major-section-content");
  const button = section.querySelector(":scope > .major-section-toggle-bar .major-section-toggle");
  if (!content || !button) return;

  section.classList.toggle("is-major-collapsed", collapsed);
  content.hidden = collapsed;
  button.setAttribute("aria-expanded", String(!collapsed));
  button.classList.toggle("is-collapsed", collapsed);
  const text = button.querySelector("span");
  if (text) text.textContent = collapsed ? "展开" : "折叠";
  const sectionLabel = section.dataset.majorSectionLabel;
  if (sectionLabel) {
    button.setAttribute("aria-label", `${collapsed ? "展开" : "折叠"}${sectionLabel}下的内容`);
  }

  if (persist && key) {
    majorSectionState[key] = collapsed;
    writeMajorSectionState(majorSectionState);
  }
}

function enhanceMajorSection(section, label, key) {
  if (!section || !label || section.dataset.majorSectionEnhanced === "true") return;

  section.dataset.majorSectionEnhanced = "true";
  section.dataset.majorSectionKey = key;
  section.dataset.majorSectionLabel = label.textContent.trim();
  section.classList.add("major-collapsible-section");

  const toolbar = document.createElement("div");
  toolbar.className = "major-section-toggle-bar";
  const labelSlot = document.createElement("div");
  labelSlot.className = "major-section-toggle-label";
  labelSlot.append(label);

  const content = document.createElement("div");
  content.className = "major-section-content";
  content.id = `major-section-content-${key.replace(/[^a-z0-9_-]+/gi, "-")}`;
  [...section.childNodes].forEach((node) => content.append(node));

  const button = document.createElement("button");
  button.type = "button";
  button.className = "major-section-toggle";
  button.setAttribute("aria-expanded", "true");
  button.setAttribute("aria-controls", content.id);
  button.setAttribute("aria-label", `折叠${label.textContent.trim()}下的内容`);
  button.innerHTML = '<span>折叠</span><i aria-hidden="true"></i>';
  button.addEventListener("click", () => {
    setMajorSectionCollapsed(section, !section.classList.contains("is-major-collapsed"));
  });

  toolbar.append(labelSlot, button);
  section.append(toolbar, content);
  setMajorSectionCollapsed(section, Boolean(majorSectionState[key]), { persist: false });
}

function wrapMajorSectionRange(parent, nodes, className = "") {
  if (!parent || !nodes.length) return null;
  const wrapper = document.createElement("section");
  wrapper.className = `major-section-range ${className}`.trim();
  parent.insertBefore(wrapper, nodes[0]);
  nodes.forEach((node) => wrapper.append(node));
  return wrapper;
}

function prepareAtlasMajorSections() {
  const parent = document.querySelector("#atlas-content");
  if (!parent || parent.dataset.majorRangesReady === "true") return;
  const children = [...parent.children];
  const secondHeading = parent.querySelector(".atlas-subsection-heading:not(.atlas-detail-heading)");
  const thirdHeading = parent.querySelector(".atlas-subsection-heading.atlas-detail-heading");
  const secondIndex = children.indexOf(secondHeading);
  const thirdIndex = children.indexOf(thirdHeading);
  if (secondIndex < 1 || thirdIndex <= secondIndex) return;

  parent.dataset.majorRangesReady = "true";
  const first = wrapMajorSectionRange(parent, children.slice(0, secondIndex), "atlas-major-section");
  const second = wrapMajorSectionRange(parent, children.slice(secondIndex, thirdIndex), "atlas-major-section");
  const third = wrapMajorSectionRange(parent, children.slice(thirdIndex), "atlas-major-section");
  enhanceMajorSection(first, first?.querySelector(".eyebrow"), "atlas-01-directory");
  enhanceMajorSection(second, second?.querySelector(".eyebrow"), "atlas-02-constraints");
  enhanceMajorSection(third, third?.querySelector(".eyebrow"), "atlas-03-detail");
}

function prepareEcosystemMajorSections() {
  const parent = document.querySelector("#ecosystem-content");
  if (!parent || parent.dataset.majorIntroReady === "true") return;
  const heading = parent.querySelector(":scope > .ecosystem-heading");
  if (!heading) return;
  parent.dataset.majorIntroReady = "true";
  const intro = wrapMajorSectionRange(parent, [heading], "ecosystem-major-intro");
  enhanceMajorSection(intro, intro?.querySelector(".eyebrow"), "ecosystem-00-intro");

  const picker = parent.querySelector(":scope > .ecosystem-prototype-picker");
  enhanceMajorSection(picker, picker?.querySelector(":scope > header > span"), "ecosystem-01-picker");
}

function enhanceDynamicEcosystemSections() {
  const workbench = document.querySelector("#ecosystem-workbench");
  if (!workbench) return;
  workbench.querySelectorAll(".ecosystem-kicker").forEach((label) => {
    const match = label.textContent.trim().match(/^(0[2-9](?:-[12])?)\s*·/);
    if (!match) return;
    const section = label.closest("section, aside");
    if (!section || !workbench.contains(section)) return;
    const prototypeKey = state.selectedEcosystemPrototypeId || "unknown";
    enhanceMajorSection(section, label, `ecosystem-${prototypeKey}-${match[1]}`);
  });
}

function expandMajorSectionForHash() {
  const hash = decodeURIComponent(window.location.hash.slice(1));
  if (!hash) return;
  const target = document.getElementById(hash);
  if (!target) return;
  let section = target.closest(".major-collapsible-section");
  let expanded = false;
  while (section) {
    if (section.classList.contains("is-major-collapsed")) {
      setMajorSectionCollapsed(section, false);
      expanded = true;
    }
    section = section.parentElement?.closest(".major-collapsible-section");
  }
  if (expanded) {
    window.requestAnimationFrame(() => target.scrollIntoView({ block: "start", behavior: "instant" }));
  }
}

function initMajorSectionCollapsibles() {
  const staticSections = [
    ["#top", ".eyebrow", "model-00-overview"],
    ["#model-case", ".eyebrow", "model-01-case"],
    ["#model-content", ":scope > .section-heading .eyebrow", "model-02-architecture"],
    ["#atlas-method", ":scope > .section-heading .eyebrow", "atlas-00-method"],
    ["#library-content", ":scope > .section-heading .eyebrow", "library-03"],
    ["#insights-content", ":scope .insights-hero .eyebrow", "insights-00-overview"],
    ["#insight-prior", ":scope > .section-heading .eyebrow", "insights-01-prior"],
    ["#insight-reveal", ":scope > .section-heading .eyebrow", "insights-03-reveal"],
    ["#insight-decision", ":scope > .section-heading .eyebrow", "insights-04-decision"],
    ["#insight-effective-pool", ":scope > .section-heading .eyebrow", "insights-05-effective-pool"],
    ["#insight-checks", ":scope > .section-heading .eyebrow", "insights-06-checks"]
  ];

  staticSections.forEach(([sectionSelector, labelSelector, key]) => {
    const section = document.querySelector(sectionSelector);
    enhanceMajorSection(section, section?.querySelector(labelSelector), key);
  });
  prepareAtlasMajorSections();
  prepareEcosystemMajorSections();
  enhanceDynamicEcosystemSections();

  const workbench = document.querySelector("#ecosystem-workbench");
  if (workbench) {
    new MutationObserver(() => enhanceDynamicEcosystemSections()).observe(workbench, {
      childList: true,
      subtree: true
    });
  }

  window.addEventListener("hashchange", () => window.setTimeout(expandMajorSectionForHash, 0));
  expandMajorSectionForHash();
}

initMajorSectionCollapsibles();
init();
