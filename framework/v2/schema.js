window.FRAMEWORK_SCHEMA = {
  "version": "v2",
  "name": "RPB 装置类统一设计模型",
  "updated_at": "2026-04-28",
  "formula": "产出 = (基础池 × random) + (基础池 × 符号协同) × (主动池 × 规则修饰)",
  "layers": {
    "L0": "spin（自动）⇄ RPBD（玩家）的双循环",
    "L1": "1.random 表演 → 2.combo（2.1 符号协同 + 2.2 规则修饰）→ 3.RPBD",
    "L2": "combo 拆解 = 符号协同（元素间互动） + 规则修饰（全局修改器）",
    "L3": "池映射：基础池 ⇒ random + 符号协同；主动池 ⇒ 规则修饰",
    "L4": "完整产出公式：(基础池 × random) + (基础池 × 符号协同) × (主动池 × 规则修饰)"
  },
  "score_dimensions": [
    { "key": "random",    "name": "random 表演",    "scale": [5, 10], "desc": "装置落位戏剧化、视觉爆发力" },
    { "key": "combo",     "name": "combo 表演",     "scale": [5, 10], "desc": "组合反馈的戏剧性、连锁数值/动画" },
    { "key": "pool",      "name": "pool 设计",      "scale": [5, 10], "desc": "双层池架构的清晰度与多样性" },
    { "key": "structure", "name": "肉鸽底线/压力",  "scale": [5, 10], "desc": "checkpoint 节奏、目标分、波次设计" }
  ],
  "qualitative_fields": [
    { "key": "pool_base_desc",      "name": "基础池描述",    "desc": "spin 中出现的元素池：内容、稀有度、规模" },
    { "key": "pool_active_desc",    "name": "主动池描述",    "desc": "全局修饰器池：内容、稀有度、强度梯度" },
    { "key": "random_design",       "name": "random 设计",   "desc": "落位机制 / 装置类型 / 节奏曲线" },
    { "key": "combo_synergy",       "name": "符号协同",      "desc": "基础池内元素互动（邻接、链式、类别加成）的自由文本描述" },
    { "key": "combo_topology",      "name": "协同拓扑",      "desc": "符号协同发生在的几何/拓扑空间（v2 新增，单选枚举，参考 combo_topology_enum）", "type": "enum", "enum_ref": "combo_topology_enum" },
    { "key": "combo_predicate",     "name": "协同判定",      "desc": "触发协同的判定规则（v2 新增，多选数组，参考 combo_predicate_enum）", "type": "enum_array", "enum_ref": "combo_predicate_enum" },
    { "key": "combo_modifier",      "name": "规则修饰",      "desc": "主动池施加的全局修改器" },
    { "key": "rpbd_construction",   "name": "RPBD 构筑",     "desc": "玩家在构筑阶段的决策维度（商店/选择/删除/升级）" },
    { "key": "checkpoint_mechanism","name": "压力机制",      "desc": "目标分/血量/限时/资源/波次的具体形式" }
  ],
  "combo_topology_enum": [
    { "key": "0D_multiset",  "name": "0D 多重集",   "desc": "元素无序，只看类型/数量；位置不影响判定（如手牌、骰子集合、麻将牌）" },
    { "key": "1D_sequence",  "name": "1D 线序",     "desc": "位置有先后、开放式两端；前一个影响后一个（如 Joker 槽触发顺序、UNO 出牌链）" },
    { "key": "1D_ring",      "name": "1D 圆环",     "desc": "一维但首尾相接（如轮盘、转盘）" },
    { "key": "2D_grid",      "name": "2D 离散网格", "desc": "整数坐标 + 邻接定义（如 3×5 slot、3×3 棋盘、5×5 宾果卡）" },
    { "key": "2D_physical",  "name": "2D 连续物理", "desc": "浮点坐标 + 物理引擎参与协同（如弹珠台、推币机）" }
  ],
  "combo_predicate_enum": [
    { "key": "threshold",     "name": "阈值",        "desc": "数量 ≥ N 即触发（如 3 樱桃 → 丰收）" },
    { "key": "type_dict",     "name": "类型字典",    "desc": "属于有限类型集就触发（如扑克牌型、麻将番数、骰子图标技能字典）" },
    { "key": "adjacency",     "name": "邻接",        "desc": "拓扑相邻关系（如 LBL 邻位 ⚡ 闪电链、地牢掷骰邻位骰加成）" },
    { "key": "line_complete", "name": "连线",        "desc": "共线/连续段填满（如宾果卡行/列/对角填满）" },
    { "key": "chain",         "name": "链式约束",    "desc": "前一个约束后一个（如 UNO 同色/同数才能出）" },
    { "key": "trigger_chain", "name": "触发链",      "desc": "按序激活，倍率累乘（如 Balatro Joker 槽触发链）" },
    { "key": "path",          "name": "物理路径",    "desc": "连续轨迹穿过元素（如弹球碰撞钉子、推币穿过特殊币）" },
    { "key": "cascade",       "name": "连锁反应",    "desc": "一个触发引爆下一个（如多米诺链、推币传导）" }
  ],
  "pressure_params": [
    { "key": "M",      "name": "M",      "desc": "checkpoint 数量（一局内总关卡数）" },
    { "key": "N",      "name": "N",      "desc": "每个 checkpoint 间的 spin 数（节奏）" },
    { "key": "T0",     "name": "T₀",     "desc": "起始压力值（首关目标分/血量）" },
    { "key": "r",      "name": "r",      "desc": "压力增长率（指数 / 线性 / 跳跃）" },
    { "key": "m_boss", "name": "m_boss", "desc": "boss 关倍率（高于普通关的强度系数）" }
  ],
  "clustering": {
    "single_dim": ["random", "combo", "pool", "structure"],
    "structural": ["combo_topology", "combo_predicate"],
    "cross_dim": "对所有 4 维评分组合做不平衡模式发现（如 random 高 combo 低 → 哪类游戏？）"
  },
  "thresholds": {
    "blockbuster": "总分 ≥ 32 且 表演分 ≥ 8 且 结构分 ≥ 8（双 8 区间）"
  }
}
;
