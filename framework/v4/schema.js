window.FRAMEWORK_SCHEMA = {
  "version": "v4",
  "name": "RPB 装置类统一设计模型",
  "updated_at": "2026-04-30",
  "formula": "spin[ 1.random@起点拓扑 → 2.put(自动|手动 × set|place) → combo[ combo1@目标拓扑 + combo2 ] ]_N → RPBD",
  "layers": {
    "L0": "spin（自动）⇄ RPBD（玩家）的双循环",
    "L1": "1.random → 2.put → 3.combo（3.1 combo1 符号协同 + 3.2 combo2 修饰协同）→ 4.RPBD",
    "L2": "put 拆解 = 自动/手动（执行者）× set/place（是否带空间映射）；combo 拆解 = combo1 符号协同 + combo2 修饰协同",
    "L3": "池映射：基础池 ⇒ random + put + combo1 符号协同；主动池 ⇒ combo2 修饰协同。Put 几何含义：起点拓扑 → 目标拓扑映射",
    "L4": "完整产出公式：(基础池 × random × put) + (基础池 × put × 符号协同) × (主动池 × 规则修饰)"
  },
  "score_dimensions": [
    { "key": "random",    "name": "random 表演",    "scale": [5, 10], "desc": "装置落位戏剧化、视觉爆发力（含 random + put 的第一峰多巴胺）" },
    { "key": "combo",     "name": "combo 表演",     "scale": [5, 10], "desc": "组合反馈的戏剧性、连锁数值/动画" },
    { "key": "pool",      "name": "pool 设计",      "scale": [5, 10], "desc": "双层池架构的清晰度与多样性" },
    { "key": "structure", "name": "肉鸽底线/压力",  "scale": [5, 10], "desc": "checkpoint 节奏、目标分、波次设计" }
  ],
  "qualitative_fields": [
    { "key": "pool_base_desc",      "name": "基础池描述",    "desc": "spin 中出现的元素池：内容、稀有度、规模" },
    { "key": "pool_active_desc",    "name": "主动池描述",    "desc": "全局修饰器池：内容、稀有度、强度梯度" },
    { "key": "random_design",       "name": "random 设计",   "desc": "落位机制 / 装置类型 / 节奏曲线（自由文本，结构化的目标拓扑选择见 symbol_topology，put 形式见 put_form）" },
    { "key": "symbol_topology",     "name": "符号拓扑（目标拓扑）", "desc": "v4 精确化语义：本字段填的是 combo1 判定时所在的拓扑（=目标拓扑），不是 random 起点拓扑。auto_place / manual_set 类游戏起点 = 目标无歧义；manual_place 类游戏起点 ≠ 目标（如吸血鬼爬行者起点 0D_multiset → 目标 1D_sequence；地牢掷骰起点 0D_multiset → 目标 2D_grid），本字段填目标。单选枚举，参考 symbol_topology_enum", "type": "enum", "enum_ref": "symbol_topology_enum" },
    { "key": "put_form",            "name": "Put 形式",      "desc": "v4 新增：random 与 combo 之间的安置/选择步骤的形式。判别规则：put 是否需要交付玩家产生的位置/顺序给 combo1。auto/manual 看执行者，set/place 看是否带空间映射。单选枚举，参考 put_form_enum", "type": "enum", "enum_ref": "put_form_enum" },
    { "key": "combo_synergy",       "name": "符号协同 (combo1)", "desc": "基础池内元素互动（在 symbol_topology 即目标拓扑上做的判定，邻接、链式、类别加成等）的自由文本描述；与 combo_modifier (combo2) 配套" },
    { "key": "combo_predicate",     "name": "协同判定",      "desc": "触发 combo1 的判定规则：作用于 symbol_topology（目标拓扑）上做的协同判定（即 combo1 层），多选数组，参考 combo_predicate_enum", "type": "enum_array", "enum_ref": "combo_predicate_enum" },
    { "key": "combo_modifier",      "name": "修饰协同 (combo2)", "desc": "主动池施加的全局修饰；与 combo_synergy (combo1) 配套" },
    { "key": "rpbd_construction",   "name": "RPBD 构筑",     "desc": "玩家在构筑阶段的决策维度（商店/选择/删除/升级）" },
    { "key": "checkpoint_mechanism","name": "压力机制",      "desc": "目标分/血量/限时/资源/波次的具体形式" }
  ],
  "symbol_topology_enum": [
    { "key": "0D_multiset",  "name": "0D 多重集",   "desc": "元素无序，只看类型/数量；位置不影响判定（如手牌、骰子集合、麻将牌）" },
    { "key": "1D_sequence",  "name": "1D 线序",     "desc": "位置有先后、开放式两端；前一个影响后一个（如 UNO 出牌链、按序触发槽）" },
    { "key": "1D_ring",      "name": "1D 圆环",     "desc": "一维但首尾相接（如自建轮盘、转盘）" },
    { "key": "2D_grid",      "name": "2D 离散网格", "desc": "整数坐标 + 邻接定义（如 3×5 slot、3×3 棋盘、5×5 宾果卡）" },
    { "key": "2D_physical",  "name": "2D 连续物理", "desc": "浮点坐标 + 物理引擎参与协同（如弹珠台、推币机）" }
  ],
  "put_form_enum": [
    { "key": "auto_place",   "name": "自动放置",   "desc": "v4 新增：装置/物理引擎/规则自动把 random 出来的元素放到目标拓扑（slot 自动落位、弹珠物理路径、推币物理）；起点池 → 装置自带空间，玩家不干预 put 步骤" },
    { "key": "manual_set",   "name": "手动选子集（无映射）", "desc": "v4 新增：玩家从 random 出的池中主动选子集，但子集内部无新位置/顺序映射——combo1 只看集合属性（如牌型、番数）；起点 = 目标，仍是 0D 多重集；典型如小丑牌选 5 张牌（顺子靠点数内禀属性自动排序，不读出牌顺序）" },
    { "key": "manual_place", "name": "手动放置/排序",       "desc": "v4 新增：玩家选 + 把子集映射到位置/序列/目标空间——combo1 用 adjacency / line_complete / path / chain 等位置敏感判定，必须读玩家产生的位置/顺序；起点 ≠ 目标，put 创造新拓扑（如吸血鬼爬行者：池 → 1D 出牌序列；地牢掷骰：池 → 2D 棋盘格；切骰：池 → 敌人目标集）" },
    { "key": "auto_set",     "name": "自动选子集（无映射）", "desc": "v4 新增：系统自动从 random 出的池里选子集，子集内部无空间映射；理论存在但 34 款样本中无实例（结构性空类）" }
  ],
  "combo_predicate_enum": [
    { "key": "threshold",     "name": "阈值",        "desc": "数量 ≥ N 即触发（作用于 symbol_topology 上的 combo1 判定）；如 3 樱桃 → 丰收" },
    { "key": "type_dict",     "name": "类型字典",    "desc": "属于有限类型集就触发（作用于 symbol_topology 上的 combo1 判定）；如扑克牌型、麻将番数、骰子图标技能字典" },
    { "key": "adjacency",     "name": "邻接",        "desc": "拓扑相邻关系（作用于 symbol_topology 上的 combo1 判定）；如 LBL 邻位 ⚡ 闪电链、地牢掷骰邻位骰加成" },
    { "key": "line_complete", "name": "连线",        "desc": "共线/连续段填满（作用于 symbol_topology 上的 combo1 判定）；如宾果卡行/列/对角填满、slot 连线赔付" },
    { "key": "chain",         "name": "链式约束",    "desc": "前一个约束后一个（作用于 symbol_topology 上的 combo1 判定）；如 UNO 同色/同数才能出" },
    { "key": "trigger_chain", "name": "触发链",      "desc": "按序激活，倍率累乘（作用于 symbol_topology 上的 combo1 判定）；如 Balatro Joker 槽触发链" },
    { "key": "path",          "name": "物理路径",    "desc": "连续轨迹穿过元素（作用于 symbol_topology 上的 combo1 判定）；如弹球碰撞钉子、推币穿过特殊币" },
    { "key": "cascade",       "name": "连锁反应",    "desc": "一个触发引爆下一个（作用于 symbol_topology 上的 combo1 判定）；如多米诺链、推币传导" }
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
    "structural": ["symbol_topology", "put_form", "combo_predicate"],
    "cross_dim": "对所有 4 维评分组合做不平衡模式发现（如 random 高 combo 低 → 哪类游戏？）"
  },
  "thresholds": {
    "blockbuster": "总分 ≥ 32 且 表演分 ≥ 8 且 结构分 ≥ 8（双 8 区间）"
  }
}
;
