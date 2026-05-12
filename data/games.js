window.GAMES = {
  "framework_version": "v5",
  "updated_at": "2026-05-13",
  "games": [
    {
      "slug": "luck-be-a-landlord",
      "basic": {
        "name_cn": "幸运房东",
        "name_en": "Luck be a Landlord",
        "developer": "TrampolineTales",
        "release_year": 2022,
        "steam_url": "https://store.steampowered.com/app/1404850/",
        "header_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1404850/header.jpg",
        "tags": [
          "装置类",
          "老虎机",
          "符号 RPB"
        ],
        "core_loop_oneliner": "3×5 老虎机每回合 spin，符号 + 道具构筑应对房租压力"
      },
      "analysis": {
        "framework_version": "v5",
        "updated_at": "2026-04-29",
        "scores": {
          "random": 8,
          "combo": 8,
          "pool": 9,
          "structure": 10
        },
        "qualitative": {
          "pool_base_desc": "200+ 符号 · 3×5 slot 转动 · 稀有度梯度（普 60% / 非 25% / 稀 12% / 极稀 3%）",
          "pool_active_desc": "100+ 道具 · 永远生效的修饰 · 威力梯度（普温和 / 非中等 / 稀强力 / 传颠覆）",
          "random_design": "slot 机械装置 · 0.7-1.5s 转动落位 · 关键在转动加速→减速→定格的节奏曲线 + 符号清晰可读",
          "show_topology": "2D_grid",
          "put_form": "auto_place",
          "combo_synergy": "邻接互动（邻位加成）+ 单个符号直接产出 · 例：3 个樱桃 → 丰收 +5 · 空间布局的邻接联动",
          "combo_predicate": [
            "threshold",
            "adjacency"
          ],
          "combo_modifier": "道具应用全局倍率修饰 · 例：水果 +50% / 每个 ⭐ 倍率 ×2 · 修饰强度从普到传颠覆",
          "rpbd_construction": "商店三选一买符号 / 付费删符号 / 升级 · 玩家在主舞台直接看到变化",
          "checkpoint_mechanism": "房租机制：每 5 次 spin 触发 checkpoint · 达标分数才能继续 · 目标分数型 · 补充：M=17（共 17 个 floor 的房租 checkpoint）；N=5（每 5 spin 一关）；T0=5（首周房租 5 金币，scoring-rubric 实测）；r≈1.7（前期翻倍 5→10→20，后期略缓和到 ~1.5）；无显式 boss 关。"
        },
        "pressure_params": {
          "M": "17",
          "N": "5",
          "T0": "5",
          "r": "1.7",
          "m_boss": null
        },
        "summary": "MVP 爆款标杆（总分 35）：双层池 × 目标分数压力。表演 8 + 结构 9.5 落在右上象限，是新装置类优先复刻的公式。combo 落在「网格邻接族」(2D_grid × adjacency)，钉死 8 分天花板——邻接加成线性可枚举，无指数爆炸基础。"
      }
    },
    {
      "slug": "balatro",
      "basic": {
        "name_cn": "小丑牌",
        "name_en": "Balatro",
        "developer": "LocalThunk",
        "release_year": 2024,
        "steam_url": "https://store.steampowered.com/app/2379780/",
        "header_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2379780/header.jpg",
        "tags": [
          "装置类",
          "扑克",
          "倍率构筑"
        ],
        "core_loop_oneliner": "150+ Joker 与塔罗卡牌的倍率组合突破每个 Blind 的目标分数"
      },
      "analysis": {
        "framework_version": "v5",
        "updated_at": "2026-04-29",
        "scores": {
          "random": 7,
          "combo": 10,
          "pool": 9,
          "structure": 9
        },
        "qualitative": {
          "pool_base_desc": "基础池 = 52 张标准扑克牌库（可被改造卡/封印/版图等修饰），玩家每回合从牌库抽 8 张到手，从中选 1-5 张组成扑克手牌出牌；牌库可加牌/删牌/复制牌，单局规模 40-70 张。稀有度梯度由花色/点数/特殊改造（金/钢/玻璃/石头）和封印（红/紫/金/蓝）共同构成。",
          "pool_active_desc": "主动池 = 150+ Joker（核心修饰器）+ 消耗品（塔罗 22 / 行星 12 / 灵气 / 凭证 / 牌包）+ 凭证（每周目解锁的全局加成）。Joker 槽默认 5 格，每张 Joker 提供独立加分/倍率/特殊触发规则。稀有度梯度：普通（白）/ 非普通（绿）/ 稀有（红）/ 传奇（紫），稀有度越高效应越颠覆。获取：每个 Blind 后进商店三选购买 / 牌包开出 / 标签奖励；移除：手动售出换金币、被某些 Joker 自我消耗。",
          "random_design": "装置形式 = 抽牌+出牌（非物理落位）。每回合从 40-70 张牌库随机抽 8 张到手牌区（约 0.3-0.5s 翻牌动画），玩家手动选 1-5 张拖入出牌区，再点击 Play Hand 触发结算。random 弱在'抽'本身没有强戏剧化（无物理冲击），但补救点是把'选择权'交还玩家——抽 8 选 5 是 random 与玩家决策的混合层。",
          "show_topology": "0D_multiset",
          "put_form": "manual_set",
          "combo_synergy": "单符号产出：每张牌按点数提供 Chips（A=11 / J/Q/K=10 / 数字面值），扑克手型（高牌/对子/两对/三条/顺子/同花/葫芦/四条/同花顺/五条/同花五/同花葫芦）提供 Chips×Mult 基底（如对子 10×2、葫芦 40×4、同花顺 100×8）。互动规则：被打出的 5 张牌按从左到右顺序逐张结算 Chips 与触发，再依次激活 Joker 槽中的 Joker（trigger_chain），每次触发都会修改当前的 Chips 或 Mult。加成数值典型链：Chips 累加 → Mult 累加 → Mult 累乘（×Mult Joker 把加性 Mult 翻倍），最终 Chips × Mult 得到本手分数，单手百万到亿级是常态。",
          "combo_predicate": [
            "type_dict",
            "trigger_chain"
          ],
          "combo_modifier": "主要修饰来自 Joker 与凭证：(1) 加性 Chips（+30 Chips/+50 Chips）；(2) 加性 Mult（+4 Mult / +8 Mult）；(3) 乘性 Mult（×1.5 / ×2 / ×3，最稀缺最关键的爆炸源）；(4) 条件触发（手中 6 张以上、当前手是同花、剩余出牌数 ≤1 等）；(5) 全局规则改写（每张牌额外触发一次、第一张牌算两次、所有花色视作同花）。叠乘逻辑：先把所有加性 Chips 叠完 → 加性 Mult 叠完 → 再依次乘上每个乘性 Mult Joker，因此乘性 Joker 的位置和数量是构筑核心；同一手内 Joker 槽从左到右严格按序触发，左边 Joker 改造的状态会被右边 Joker 读到，玩家可手动拖动调序。",
          "rpbd_construction": "每个 Blind 击败后进入商店阶段：默认 2 个 Joker/消耗/卡牌槽位三选购买 + 1 个牌包 + 1 个凭证（首次出现）；刷新成本起始 5 金币每次刷新后翻倍，回合内累积。RPBD 操作：买 Joker（5-8 金）/ 买消耗品（3-6 金）/ 买改造卡 / 买卡包（4-6 金）/ 卖出 Joker 换半价金币 / 用塔罗或灵气改造手中扑克牌。决策周期 = 每打完 1 个 Blind（约 2-4 手牌）即一次商店，单局 8 个 Ante × 3 Blind = 约 24 次商店决策。",
          "checkpoint_mechanism": "触发周期 = 每个 Blind（小盲/大盲/Boss 盲）一次结算。达标条件 = 累计分数 ≥ 该 Blind 目标分（小盲 T₀，大盲 1.5×T₀，Boss 盲 2×T₀ 并附带 debuff 如'红牌不计分''首张丢弃'等）。未达标后果 = 直接 Game Over，整局重开。难度曲线：每 Ante 目标分按 r≈2.0 指数膨胀，从 Ante 1 的 300 分到 Ante 8 的数百万分；Boss 盲在每个 Ante 末尾叠加 m_boss 的特殊规则惩罚，是构筑被针对的主要压力源。 · 补充：M=24（8 Ante × 3 Blind 的小盲/大盲/Boss盲）；N=3（每 Blind 实际 2-4 手浮动均值）；T0=300（Ante 1 small blind 目标分）；r=2.0（每 Ante 翻倍）；m_boss=2.0（Boss Blind 目标 ×2 + 附带 debuff 如红牌不计分/首张丢弃）。"
        },
        "pressure_params": {
          "M": "24",
          "N": "3",
          "T0": "300",
          "r": "2.0",
          "m_boss": "2.0"
        },
        "summary": "总分 35（表演 8.5 / 结构 9.0），落在'多重集字典族（0D_multiset × type_dict）'集群上沿，并叠加'序列链式层（1D_sequence × trigger_chain）'作为 Joker 槽的次级层；最值得提的设计观察是把 random 的弱势（抽牌没有物理戏剧化）通过'抽 8 选 5 + Joker 触发链 + 乘性 Mult 指数爆炸'三段式补救，把 combo 钉到 10 分。"
      }
    },
    {
      "slug": "peglin",
      "basic": {
        "name_cn": "哥布林弹球",
        "name_en": "Peglin",
        "developer": "Red Nexus Games",
        "release_year": 2022,
        "steam_url": "https://store.steampowered.com/app/1296610/",
        "header_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1296610/header.jpg",
        "tags": [
          "装置类",
          "弹珠",
          "物理模拟"
        ],
        "core_loop_oneliner": "Plinko 弹珠台的物理弹射 + 弹珠类型与钉子效果的构筑战斗"
      },
      "analysis": {
        "framework_version": "v5",
        "updated_at": "2026-04-29",
        "scores": {
          "random": 9,
          "combo": 8,
          "pool": 8,
          "structure": 8
        },
        "qualitative": {
          "pool_base_desc": "基础池 = Orb（弹球）池，约 70+ 种 Orb（待校核 Steam 页未列具体数字，社区 wiki 数据）。每场 run 玩家从初始 4-5 个 Orb 起手，战斗中按顺序循环投出（不是真随机抽，而是有序队列 + 偶发洗牌），每次战斗回合投 1 颗 Orb 到弹球台上。Orb 分类：攻击型（普通伤害）、Crit 型（命中关键钉加倍）、效果型（毒/燃烧/护盾）、稀有型（特殊机制）；稀有度梯度普通/非普通/稀有/传说四档（待校核命名）。",
          "pool_active_desc": "主动池 = Relic（遗物），约 100+ 种（待校核），不出现在弹球台上，仅对全局战斗规则做修饰。威力梯度从普通的'+1 命中伤害'到传奇的'每场战斗首颗 Orb 双倍触发'。获取：Boss 击败后必给 / 商店购买 / 事件奖励 / 宝箱开启；移除：极少（部分负面 Relic 可在事件中清除）。Orb 池本身也可视作主动构筑，但放在基础池——Relic 才是真正的全局倍率层。",
          "random_design": "装置形式 = 2D 物理弹珠台（基于 Peggle 玩法）。回合开始玩家从队列取出下一个 Orb，旋转瞄准发射器（连续角度选择），按下后 Orb 在钉阵中物理碰撞约 1-3s，每次弹跳路径唯一。抽取规则：Orb 队列固定循环（一周后回到第一个），但'打哪些钉'完全由瞄准 + 物理混沌决定。视觉表演：钉子被命中变色/消失，命中关键钉（refresh peg）会刷新所有钉子，弹珠轨迹清晰可读。比 Ballionaire 少 1 分主因是框体小、可重复性略高。",
          "show_topology": "2D_physical",
          "put_form": "auto_place",
          "combo_synergy": "单 Orb 基础产出：每颗 Orb 撞击钉子积累伤害（每钉 +1 基础伤害），路径越长伤害越高；Crit 钉命中后倍率（typically ×2 ~ ×3）作用于本次落地伤害。互动规则：(1) path——单颗 Orb 的连续碰撞轨迹决定打多少钉；(2) cascade——某些特殊钉（Bomb peg、Refresh peg）被打到后会引爆周围、刷新已碎钉，形成连锁。一次典型 spin：Orb 命中 10-25 个钉，叠加 1-3 个 Crit 钉倍率，最终单 Orb 伤害从基础 10 攀升到 50-200。",
          "combo_predicate": [
            "path",
            "cascade"
          ],
          "combo_modifier": "Relic 修饰为主：(1) Orb 倍率（'所有 Crit 伤害 +50%'）；(2) 数量加成（'每次发射多 1 颗 Orb'）；(3) 状态附加（'命中触发燃烧 3 回合'）；(4) 物理改写（'Orb 反弹后伤害 +25%'、'木钉变石钉'）。叠乘逻辑：钉伤害 → Crit 倍率 → Relic 加性加成 → Relic 乘性加成 → 状态额外伤害（毒/燃烧）单独结算。多 Relic 叠乘是加性叠加为主、乘性少而珍贵，相比 Balatro 的乘性 Mult 链温和得多——这也是 combo 评 8 而非 10 的结构原因。",
          "rpbd_construction": "决策周期 = 经典 StS 节点地图，每个节点（普通战 / 精英战 / 商店 / 事件 / Boss）后做一次决策。RPBD 操作：战斗后从 3 选 1 加新 Orb 入池 / 商店买 Orb（约 50 金）/ 商店买 Relic（约 100-150 金）/ 商店付费删 Orb（约 75 金）/ 事件偶发 Orb 升级。商店刷新需付费（约 50 金，待校核），单局通常 6-10 次商店决策。",
          "checkpoint_mechanism": "触发周期 = 每个战斗节点一次。达标条件 = 在自身 HP > 0 时把所有敌人 HP 打到 0；未达标 = HP 归零直接 Game Over，整局重开。难度曲线：每章 3 章（act），每章末有 Boss，act 间敌人 HP 与伤害线性提升 + 新机制（中毒、护甲、召唤）；m_boss 体现为 Boss HP 显著高于普通敌人 + 特殊机制。属于经典'血量爬塔族'压力曲线，比纯目标分游戏（LBL/Balatro）压力曲线略平缓，但 boss 战的多机制叠加保证 8 分张力。 · 补充：M≈30（3 act × 约 10 战斗节点，估算待校核）；N=4（每场战斗约 3-5 回合均值）；T0≈15（首场敌人 HP，估算）；r≈1.05（线性递增）；m_boss≈3.0（Boss HP 与机制显著加强）。[M/T0 估算待校核]"
        },
        "pressure_params": {
          "M": "30",
          "N": "4",
          "T0": "15",
          "r": "1.05",
          "m_boss": "3.0"
        },
        "summary": "总分 33（表演 8.5 / 结构 8.0），落在'物理路径族（2D_physical × path+cascade）'集群中位，是该集群里把 RPBD 做得最像 StS 的样本；最值得提的设计观察是用'Orb 队列循环'代替真随机抽取，让 random 既保留物理混沌（瞄准+碰撞）又给玩家可预测的资源管理（下一颗投什么是已知的），这套'物理 random + 队列确定性'的混合设计是它能稳进 A 级的关键。"
      }
    },
    {
      "slug": "ballionaire",
      "basic": {
        "name_cn": "弹珠大亨",
        "name_en": "Ballionaire",
        "developer": "newobject",
        "release_year": 2024,
        "steam_url": "https://store.steampowered.com/app/2667120/",
        "header_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2667120/header.jpg",
        "tags": [
          "装置类",
          "弹球机",
          "物理美学"
        ],
        "core_loop_oneliner": "Trinket 小挂件布局优化弹球链路，达成每回合目标分"
      },
      "analysis": {
        "framework_version": "v5",
        "updated_at": "2026-04-29",
        "scores": {
          "random": 10,
          "combo": 10,
          "pool": 8,
          "structure": 8
        },
        "qualitative": {
          "pool_base_desc": "基础池 = 145+ Triggers（Steam 页确认数字），即玩家在 RPBD 阶段放置到棋盘上的功能格子（普通槽位、记分槽位、倍率槽位、特殊触发器），每次 spin 不'抽'而是把 1 颗弹珠从顶部投下，让物理引擎决定它依次撞击哪些 Triggers，每次 run 内棋盘上的 Trigger 数量会随构筑递增到约 20-40 个；分类含通用 Trigger / 主题 Trigger（金币/水果/动物等家族）/ 稀有 Trigger（待校核具体梯度）。",
          "pool_active_desc": "主动池 = 55+ Boons（Steam 页确认），属于不出现在棋盘上、对全局产出做修饰的恩赐（如'金币 Trigger 产出 ×2'、'每经过一次倍率器再加 +0.5'）。每场 run 通过事件/Boss 奖励/商店少量获取，威力梯度从普通的'某类 Trigger +1'到稀有的'整局规则改写'；获取主要靠通关一关后的奖励选择，移除一般通过覆盖式选择或负面 Boon 兑换（待校核）。",
          "random_design": "装置形式 = 2D 物理弹珠台（连续浮点坐标 + 物理引擎），玩家投下 1 颗钢珠从顶部下落，路径经由 Triggers 间的碰撞、反弹、滚动决定，单次落位时长约 1-3s（取决于弹跳次数和触发链长度）。抽取规则：random 不抽元素，只抽'本次落点偏移 + 物理混沌'，每场 spin 路径几乎不重复。中间反馈：撞击有声音和震屏，倍率器吃球瞬间数字飞出，连锁触发时屏幕底部字体放大。",
          "show_topology": "2D_physical",
          "put_form": "auto_place",
          "combo_synergy": "单 Trigger 基础产出：每个 Trigger 被撞击都会产出固定金币/分数（如基础币 +1、水果 +2、星 +5）。互动规则：(1) path——弹珠的连续轨迹依序激活每个被撞 Trigger；(2) cascade——某些 Trigger 被撞后会主动激活相邻或同家族 Trigger（如撞到一个樱桃，棋盘上所有樱桃集体 +1 产出），形成被动连锁；(3) 同家族协同（fruit family/coin family）按数量提供倍率加成。一次典型 spin：弹珠路径触发 8-15 个 Trigger，cascade 再额外触发 10-30 次产出事件，最终金币从基础 5 攀升到 50-500。",
          "combo_predicate": [
            "path",
            "cascade"
          ],
          "combo_modifier": "Boon 与少量倍率类 Trigger 共同承担规则修饰：(1) 加性产出加成（'所有金币 Trigger +1 产出'）；(2) 倍率类（'所有水果产出 ×2'）；(3) 条件触发改写（'弹珠落入底洞时全场金币翻倍'）；(4) 物理修饰（'弹珠多 1 次反弹机会''发射角度可控'）。多 Boon 叠乘逻辑：先把所有'加性 Boon'对每个 Trigger 的产出做加和，再按家族顺序乘上'乘性 Boon'，最后路径上的倍率器（×2 / ×3 物理格子）按弹珠经过顺序串行累乘——因此 Boon 选择和倍率器在棋盘上的物理位置共同决定本局上限。",
          "rpbd_construction": "决策周期 = 每完成一关（产够目标金额）后进入构筑阶段：从 3 选 1 / 5 选 1 中挑选新 Trigger 放入棋盘空槽 + 偶发 Boon 奖励 + Boss 后稀有奖励。RPBD 操作：选新 Trigger 摆位（位置决定弹珠路径概率）/ 在事件房使用金币交换 / 棋盘格子有限因此后期需要做覆盖与替换决策（待校核是否有显式删除）。商店刷新机制以'选择卡牌池'为主，不是开放式商店。",
          "checkpoint_mechanism": "触发周期 = 每关 N 次 spin（N 通常为 3-5 球），玩家需在 N 球内累计金币 ≥ 该关目标。未达标后果 = 直接出局结束 run。难度曲线：每关目标金额按指数递增（待校核 r 具体数值，体感 r≈1.6-1.8），关卡末段有 Boss/特殊关棋盘（如 Pyramid / Danger Wheel）施加全局负面规则；m_boss 体现为 Boss 关棋盘本身改写物理布局，不是数值倍率。 · 补充：M≈12（约 4 Stage × 3 Round，估算待校核）；N=4（每关 3-5 球均值）；T0≈200（首关目标金额估算）；r≈1.7（指数 1.6-1.8 区间均值）；m_boss≈1.5（Boss 关换棋盘 + 负面规则）。[M/T0 估算待校核]"
        },
        "pressure_params": {
          "M": "12",
          "N": "4",
          "T0": "200",
          "r": "1.7",
          "m_boss": "1.5"
        },
        "summary": "总分 36（表演 10.0 / 结构 8.0），样本里唯一表演分满分作品，落在'物理路径族（2D_physical × path+cascade）'集群上沿；最值得提的设计观察是把 path（弹珠主动穿过）和 cascade（同家族被动引爆）做成两层并行的协同机制，让物理 random 既有视觉戏剧性又有'家族协同'带来的策略深度，这是同集群中 Peglin/浣熊推币机没做满的部分。"
      }
    },
    {
      "slug": "dicey-dungeons",
      "basic": {
        "name_cn": "骰子地下城",
        "name_en": "Dicey Dungeons",
        "developer": "Terry Cavanagh",
        "release_year": 2019,
        "steam_url": "https://store.steampowered.com/app/861540/",
        "header_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/861540/header.jpg",
        "tags": [
          "装置类",
          "骰子",
          "职业差异化"
        ],
        "core_loop_oneliner": "6 个职业差异化的骰子投掷 + 装备格子配置爬塔战斗"
      },
      "analysis": {
        "framework_version": "v5",
        "updated_at": "2026-04-29",
        "scores": {
          "random": 6,
          "combo": 6,
          "pool": 7,
          "structure": 8
        },
        "qualitative": {
          "pool_base_desc": "基础池 = 当前角色的手骰集合，每回合开局摇 N 颗骰子（角色相关，约 2-6 颗，待校核）。骰面是标准 1-6（Robot 用 blackjack 累加获骰，Witch 把骰子塞进咒语槽产生不同效果）。无显式稀有度——骰子本身是消耗资源，差异在装备消耗骰子的方式上。",
          "pool_active_desc": "主动池 = 装备（Equipment）格子，每位英雄约 6 装备槽（待校核）。每件装备规定「需要 X 点数 / X 范围 / 偶数 / 奇数 / 任意」的骰子才能激活，激活后产出伤害、护盾、状态。装备有稀有度梯度（普通/稀有/传说），通过战斗奖励和商店获得，可丢弃。6 个职业各自装备池独立（战士/盗贼/机器人/小丑/发明家/女巫）。",
          "random_design": "回合开始摇全部手骰，3D 数字骰子落位 ~1s。玩家把骰子拖入装备槽激活效果。骰子可被装备消耗、被状态改造（变 1、+1、复制）；部分装备允许重投。表演朴素——数字直接显示，无物理弹跳爆发。",
          "show_topology": "0D_multiset",
          "put_form": "manual_place",
          "combo_synergy": "本质是「骰面 → 装备字典」匹配：投出 5 → 拖到「需要 ≥4」的剑装备 → 出 5 点伤害。多颗骰子同时拖入大装备做加和（如「任意 2 颗求和」装备）。Witch 把骰子放咒语槽产生组合咒语属于轻量子级触发。无邻接、无连锁——每颗骰子独立结算，靠装备字典分类触发。",
          "combo_predicate": [
            "type_dict"
          ],
          "combo_modifier": "状态效果作为修饰层：燃烧（每回合 -HP）、冰冻（骰子置 1）、震击（无法重投）、强化（+1 点数）、弱化（-1 点数）。装备升级（需带回工坊）提升数值。修饰主要是加减点数和状态附加，无倍率乘法链。",
          "rpbd_construction": "地牢式地图，节点含战斗/商店/事件/宝箱。商店买装备、买药水、卖装备换金币；事件提供骰子升级或换装备。每个职业有 6 个 episode（关卡剧本），每个 episode 约 10-15 战斗。决策粒度：每场战斗后（~2 分钟）。",
          "checkpoint_mechanism": "每个 episode 是一条层级链，沿层向下打怪到 boss（命运女神 Lady Luck）。每场战斗血量条作为 checkpoint，HP 归零 = 当局结束。难度按层数线性递增，最终层 boss 加强。M ≈ 6-7 层、N=1（每节点一战）、r 偏线性、m_boss 中等。 · 补充：M≈15（每个 episode 约 10-15 战斗，估算）；N=1（每节点 1 战）；T0≈15（首场敌人 HP 估算）；r≈1.05（线性血量爬塔）；m_boss≈1.5（命运女神 boss 加强）。[T0 估算待校核]"
        },
        "pressure_params": {
          "M": "15",
          "N": "1",
          "T0": "15",
          "r": "1.05",
          "m_boss": "1.5"
        },
        "summary": "总分 27（D 级临界，表演 6.0 / 结构 7.5），属多重集字典族（0D_multiset × type_dict）。设计观察：6 个职业的「骰子用法重写」是 pool 的最大亮点（Witch 把骰子塞咒语、Robot 玩 blackjack 摇骰），但 combo 始终是「骰面 → 装备字典」的单层映射，没有倍率爆炸——这是骰子族在 v2 集群里 combo 5-6 分的典型钉点位。"
      }
    },
    {
      "slug": "slice-and-dice",
      "basic": {
        "name_cn": "切骰",
        "name_en": "Slice & Dice",
        "developer": "Tann",
        "release_year": 2022,
        "steam_url": "https://store.steampowered.com/app/1775490/",
        "header_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1775490/header.jpg",
        "tags": [
          "装置类",
          "骰子",
          "团队编队"
        ],
        "core_loop_oneliner": "5 英雄团队骰子协同、骰面可替换的构筑爬层"
      },
      "analysis": {
        "framework_version": "v5",
        "updated_at": "2026-04-29",
        "scores": {
          "random": 5,
          "combo": 5,
          "pool": 7,
          "structure": 8
        },
        "qualitative": {
          "pool_base_desc": "基础池 = 当前队伍 5 个英雄的骰子集合，每回合 5 颗骰子（每英雄 1 颗）。每颗骰子 6 个面，骰面是技能图标（剑、盾、治疗、魔法、空白等），由英雄职业决定。128+ 英雄职业（含解锁），骰面随职业差异化；稀有度梯度通过英雄星级（普/稀/传说）。",
          "pool_active_desc": "473 物品（items）作为主动池：装备（绑定英雄、改一个骰面或加全局效果）、消耗品（药水、卷轴）。每个英雄 1-2 装备槽。物品通过战利品、商店、事件获得，可丢弃。每装备的作用范围：替换持有者的某个骰面 / 给持有者加属性 / 全队增益。",
          "random_design": "每回合点击「投掷」一次性摇 5 颗 3D 物理骰子，落位 ~1.5s。玩家可对任意子集重投（按需，不限次但每次重投保留更少骰子）。亮点：可无限撤销操作（Undo），降低误操作压力——但因此 random 表演被「数字解谜」气质覆盖，戏剧性最低。",
          "show_topology": "0D_multiset",
          "put_form": "manual_place",
          "combo_synergy": "每颗骰子按图标字典直接结算：剑 → 攻击、盾 → 格挡、心 → 治疗、星 → 转化为任意。部分骰面是「连击」「双倍」类合成图标，把当回合其他骰子翻倍或合并。骰子之间可手动合并（两颗剑 → 一颗双剑）触发组合判定。本质仍是 0D 多重集 × 图标字典。",
          "combo_predicate": [
            "type_dict"
          ],
          "combo_modifier": "装备/物品提供修饰：「这颗骰子的剑面变双剑」「全队治疗 +1」「每个空白面变星」；多装备并存按加法叠加，无指数倍率链。难度模式（含 +1、+2 …，「Too many modes」）整体调高敌方血量/伤害。",
          "rpbd_construction": "地图共 20 关卡，每关 1 场战斗 + 关后选择（升级英雄 / 商店买物品 / 治疗）。每 5 关左右一个 boss。商店三选一卖物品和英雄升级；可花金币替换队伍中的英雄（招募）。决策粒度：每关战斗后（~1-2 分钟）。",
          "checkpoint_mechanism": "20 关卡每关战斗为 checkpoint，全队血量 0 = 当局结束（Perma Death）。难度按关线性递增，第 20 关是最终 boss。多难度模式提供 m_boss 缩放。M=20、N=1、r 线性、m_boss 通过模式拉伸。结构紧凑，失败点清晰。 · 补充：M=20（20 关）；N=1（每关 1 战）；T0≈5（首关敌人 HP 估算）；r≈1.1（线性递增）；m_boss≈1.5（每 5 关一个 boss）。[T0 估算待校核]"
        },
        "pressure_params": {
          "M": "20",
          "N": "1",
          "T0": "5",
          "r": "1.1",
          "m_boss": "1.5"
        },
        "summary": "总分 25（D 级，表演 5.0 / 结构 7.5），属多重集字典族（0D_multiset × type_dict）。设计观察：切骰是 v2 表演分集群的下沿钉点——5 颗骰子+无限撤销让游戏向「数字解谜」漂移，random 5、combo 5 是骰子族不做爆炸补救的极限值；它靠 20 关线性结构 + 473 物品拉到 structure 8 维持长期玩家，但「快脑爽感」彻底缺席，是 D 级反例。"
      }
    },
    {
      "slug": "astrea-six-sided-oracles",
      "basic": {
        "name_cn": "六面神谕",
        "name_en": "Astrea: Six-Sided Oracles",
        "developer": "Little Leo Games",
        "release_year": 2023,
        "steam_url": "https://store.steampowered.com/app/1755830/",
        "header_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1755830/header.jpg",
        "tags": [
          "装置类",
          "骰子",
          "双资源平衡"
        ],
        "core_loop_oneliner": "350+ 骰子的净化/腐化双轴构筑，平衡伤敌与自损"
      },
      "analysis": {
        "framework_version": "v5",
        "updated_at": "2026-04-29",
        "scores": {
          "random": 7,
          "combo": 7,
          "pool": 8,
          "structure": 7
        },
        "qualitative": {
          "pool_base_desc": "基础池 = 玩家所选神谕的骰子集合（手骰），单局可从 350+ 骰子池中构筑。骰子按风险分 3 类：安全（低数值、稳定净化）、平衡（中庸双面）、高风险（高数值但可能腐化自身）。每位神谕初始骰子数约 5-6 颗（待校核），稀有度梯度普通/稀有/传说三档。",
          "pool_active_desc": "20 个可升级的支援哨卫（Support Sentinels）+ 170+ 祝福（Blessings，分 Star Blessings 增益、Black Hole Blessings 风险增益两轴）。哨卫提供主动技能；祝福提供被动修饰（净化值 +X、骰面替换、双骰重投等）。通过事件、boss 奖励、商店金币购买，可在节点出售/替换。",
          "random_design": "每回合从手骰池中投掷全部骰子（dice tray 一次性落位），骰面随机；落位时长约 1-1.5s，含 3D 物理骰子翻滚动画。投掷后玩家选择哪颗骰子用于哨卫技能槽或直接打净化/腐化。提供 1-2 次重投（视构筑而定）。",
          "show_topology": "0D_multiset",
          "put_form": "manual_place",
          "combo_synergy": "单骰即结算：每颗骰子的点数直接换算为净化值（打 boss 腐化条）或自身腐化值（自伤）。骰子图标技能字典：盾、净化、伤害、抽骰、再投、连击；同图标多颗叠加触发哨卫多段技能。无邻接概念——手骰池是位置无关的多重集，看的是“投出了哪些图标、各几颗”。",
          "combo_predicate": [
            "type_dict",
            "threshold"
          ],
          "combo_modifier": "祝福施加全局修饰：例如「所有净化骰 +1」「每翻出 ≥4 的骰子 +20% 净化」「哨卫技能消耗 -1 骰」；多祝福并存时按加法→乘法顺序结算（先类目加成，再全局倍率）。哨卫升级亦提供修饰（技能改写、骰子替换为更高数值）。",
          "rpbd_construction": "节点地图（StS 风格）含战斗/精英/事件/商店/休息。商店三选一买骰、买祝福、买哨卫升级；可付费删除骰子或祝福。事件可换骰、强化骰面、获得腐化代价的高数值骰。决策周期 = 每场战斗后（约 3-5 分钟一次）。",
          "checkpoint_mechanism": "每层 ~10 节点 × 3 层 = 单局 ~30 战斗节点（待校核）。达标条件 = 把 boss 的腐化条打满（净化胜利）；自身腐化值满则失败。Boss 难度按层级跳跃，最终 boss 腐化条 + 多阶段。M≈3、N≈8-10、r 接近线性偏跳跃；16 个难度等级控制 T0/m_boss 缩放。 · 补充：M=3（3 层）；N≈10（每层约 10 节点）；T0≈30（首场 boss 腐化条估算）；r≈1.2（层间跳跃）；m_boss≈2.0（最终 boss 多阶段）。[T0/r 估算待校核]"
        },
        "pressure_params": {
          "M": "3",
          "N": "10",
          "T0": "30",
          "r": "1.2",
          "m_boss": "2.0"
        },
        "summary": "总分 29（C 级，表演 7.0 / 结构 7.5），属多重集字典族（0D_multiset × type_dict+threshold）。设计观察：六面神谕用「净化/腐化双轴」给骰子族做了少见的资源平衡补救，把 structure 从 6 拉到 7，但 combo 仍受限于骰子族的结构性短板——单骰直接结算，缺少 Balatro 式的指数倍率链，combo 钉死 7。"
      }
    },
    {
      "slug": "die-in-the-dungeon",
      "basic": {
        "name_cn": "地牢掷骰",
        "name_en": "Die in the Dungeon",
        "developer": "Atico",
        "release_year": 2024,
        "steam_url": "https://store.steampowered.com/app/2026820/",
        "header_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2026820/header.jpg",
        "tags": [
          "装置类",
          "骰子",
          "空间摆位"
        ],
        "core_loop_oneliner": "3×3 棋盘上放置骰子，邻接加成推进地牢"
      },
      "analysis": {
        "framework_version": "v5",
        "updated_at": "2026-04-29",
        "scores": {
          "random": 7,
          "combo": 8,
          "pool": 8,
          "structure": 7
        },
        "qualitative": {
          "pool_base_desc": "基础池 = 31 种独特骰子（不同面值/技能字典，攻击/治疗/护甲/魔法等类）+ 约 3×3 棋盘格（待校核，主装置层是网格）。每回合先掷骰（多重集），再放入棋盘格执行邻位加成。稀有度梯度（普/稀/传，由 relic 解锁），新骰子来自层间事件和 boss 奖励。",
          "pool_active_desc": "主动池 = 142 件 relics（隐藏在地牢，永久 buff，如'攻击骰 +1 伤害'、'护甲骰邻接时额外 +1'）+ 36 种 potions（战中一次性消耗品）。Relics 通过事件/boss 获取，通常不可主动卖出。Potions 在战斗中按需使用，是即时手牌。",
          "random_design": "装置 = 骰子摇杯 + 3×3 棋盘。每回合先把手中所有骰子掷一次（数字 1-6 显示），玩家将每枚骰子放进棋盘格；放置完成后逐格结算。掷骰视觉爆发弱（骰子数字弹动 ~0.5s），但'掷出爆点 + 邻位加成最大化'瞬间有期待峰值。",
          "show_topology": "2D_grid",
          "put_form": "manual_place",
          "combo_synergy": "结算流程：每个棋格按其骰子类型执行效果（攻骰打敌、治骰回血等），并加上邻接加成——相邻同类/特定类骰子 +X 数值。例：攻骰邻接攻骰 +1、治骰邻接攻骰使该攻骰变为吸血等（具体规则字典待校核）。骰子选择是 0D_multiset，但布局到 3×3 网格让协同发生在 2D_grid 邻接层（这是主装置层）。",
          "combo_predicate": [
            "adjacency",
            "type_dict"
          ],
          "combo_modifier": "142 件 relics 提供全局/局部修饰：如'所有攻骰 +1 伤害'、'放在中心格的骰子效果 ×2'、'邻接加成 +1'（直接放大 adjacency predicate 的强度）。Potions 提供一次性插入效果（重投全部骰子、手动改某骰点数）。多 relic 叠加按 buff 字典串行结算。",
          "rpbd_construction": "类 StS 地牢推进：节点选择（战斗/事件/精英/商店/boss），战斗胜利后从 3 个奖励中选 1（新骰子 / relic / 金币）。商店可买 relic / potion / 删骰子。决策周期 = 每个节点一次，玩家根据棋盘协同方向（攻向/治向/混合）筛选骰子和 relic。",
          "checkpoint_mechanism": "3 幕 × 5 boss 的爬塔结构：每场战斗 = 一个 checkpoint，HP 归 0 即 GG。压力曲线为血量爬塔（敌人血量 + 伤害递增），boss 关 m_boss 显著加强。多样性靠敌人技能字典 + 3 幕环境差异。 · 补充：M=15（3 幕 × 5 boss + 战斗节点）；N=1（每节点 1 战）；T0≈15（首场敌人 HP 估算）；r≈1.1（线性血量爬塔）；m_boss=2.0（boss HP 翻倍）。[T0 估算待校核]"
        },
        "pressure_params": {
          "M": "15",
          "N": "1",
          "T0": "15",
          "r": "1.1",
          "m_boss": "2.0"
        },
        "summary": "总分 30（B 级），表演 7.5 / 结构 7.5——网格邻接族（2D_grid × adjacency），与 LBL 同集群但 random 因骰子数字弹动天然弱，combo 邻接加成钉死在 8 的结构性上限；亮点是把'掷骰多重集'和'网格邻接放置'两层 random 复合到同一回合，决策密度高。"
      }
    },
    {
      "slug": "aotenjo-infinite-hands",
      "basic": {
        "name_cn": "青天井",
        "name_en": "Aotenjo: Infinite Hands",
        "developer": null,
        "release_year": 2025,
        "steam_url": "https://store.steampowered.com/app/3066570/",
        "header_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3066570/header.jpg",
        "tags": [
          "装置类",
          "麻将",
          "东方题材"
        ],
        "core_loop_oneliner": "100+ 牌型 + 144 artifacts 融合多地域麻将规则突破目标分"
      },
      "analysis": {
        "framework_version": "v5",
        "updated_at": "2026-04-29",
        "scores": {
          "random": 7,
          "combo": 9,
          "pool": 8,
          "structure": 8
        },
        "qualitative": {
          "pool_base_desc": "基础池 = 麻将牌山（136 张标准牌 + 花/Dora 等扩展，按地域规则数百种构型，待校核）。每局起始抽 13 张手牌、每巡补 1 张；摸打节奏与日麻一致。稀有度梯度由番种字典提供（小番 1-2 番、中番 4-6 番、大番役满级），而非牌本身。",
          "pool_active_desc": "主动池 = 144 件 Artifacts（EA 阶段 185 件，正式版收敛到 144 件，对应麻将牌全数）+ 21 种牌升级 + 6→16 套起始牌组（每套自带专属 artifacts）。Artifact 范围从局部（某花色加倍）到颠覆（改判定/加 dora）；通过商店购买、可卖出换钱，永久生效到本局结束。",
          "random_design": "装置 = 麻将摸打台。每巡从牌山摸 1 张、可吃碰杠副露、最终凑成 14 张和牌型。落位戏剧化弱（牌图形较抽象、视觉爆发不及物理装置），但'听牌→自摸/荣和'瞬间有强烈期待峰值；表演时长由玩家节奏决定（约 1-3 秒/巡）。",
          "show_topology": "0D_multiset",
          "put_form": "manual_set",
          "combo_synergy": "和牌瞬间结算：将 14 张手牌按 102 种番型字典做匹配，命中的番数相加（如断幺 1 番 + 平和 1 番 + 立直 1 番 = 3 番），番数转倍率（约 2^番）后乘以基础符（30/40 符），跨地域规则混合（Riichi/MCR/Cantonese）让番型字典极其丰富。番型之间叠加而非排他，是数字爆炸的来源。",
          "combo_predicate": [
            "type_dict"
          ],
          "combo_modifier": "Artifacts 提供全局倍率/加成层：典型如'某花色额外 +1 番'、'每张 dora ×2 倍'、'役满分数 ×1.5'。多 artifact 叠乘顺序按番→倍率→艺术品乘数链行进，叠加 5+ artifact 时最终分可指数爆炸。",
          "rpbd_construction": "每完成一关（达成番数目标）后进入商店：3-4 选 1 购买 artifact / 升级牌 / 换牌组配方；金币来自超额番数。可付费删/换 artifact 控制构筑方向。决策周期 = 每关一次（约 5-10 分钟），玩家根据下一关番数门槛和已有 artifact 协同来选购。",
          "checkpoint_mechanism": "8 个 progression 层 + 每层多关 boss 关；每关有'本巡前必须达到 X 番'的硬性目标，未达成 = GG。压力曲线指数（番数门槛随关卡指数上扬），boss 关附加规则限制（禁某番型、限制副露等）。 · 补充：M=8（8 个 progression 层）；N≈5（每关约 5 巡）；T0≈1（首关番数门槛）；r=2.0（番数指数膨胀，2^番）；m_boss≈2.0（boss 关附加规则限制）。[T0/N 估算待校核]"
        },
        "pressure_params": {
          "M": "8",
          "N": "5",
          "T0": "1",
          "r": "2.0",
          "m_boss": "2.0"
        },
        "summary": "总分 32（A 级爆款候选），表演 8 / 结构 8 双 8 达标，落在多重集字典族（0D_multiset × type_dict）的上沿——靠'番数字典 + Artifact 倍率链'实现跨规则文化的指数倍率爆发，是 Balatro 公式在麻将题材下最成功的迁移。"
      }
    },
    {
      "slug": "raccoin",
      "basic": {
        "name_cn": "浣熊推币机",
        "name_en": "RACCOIN",
        "developer": null,
        "release_year": 2026,
        "steam_url": "https://store.steampowered.com/app/3784030/",
        "header_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3784030/441ff79feb6f3e92a5a6ed4a1d4b89c79e275644/header.jpg?t=1776154119",
        "tags": [
          "装置类",
          "推币机",
          "物理反馈"
        ],
        "core_loop_oneliner": "物理推币机 × 特殊币与道具构筑，多角色策略应对波次"
      },
      "analysis": {
        "framework_version": "v5",
        "updated_at": "2026-04-29",
        "scores": {
          "random": 9,
          "combo": 9,
          "pool": 7,
          "structure": 7
        },
        "qualitative": {
          "pool_base_desc": "基础池 = 150 种独特硬币（如 Seed Coin / Water Coin / Cat Coin / Rat Coin / MultiCoin / TNT Coin），每种自带特效。每局通过商店和事件逐步把硬币塞进自己的'投币机'（玩家牌组），每次投币一次性投入数枚到推币机面板。稀有度梯度（普/稀/史诗/传说）由商店 tier 控制（具体分布待校核）。",
          "pool_active_desc": "主动池 = 150 件 power-up 道具 + 'plating'（给某硬币镀膜强化）+ 6 角色（每角色解锁专属硬币）。Power-ups 提供全局修饰（'每个 Seed Coin 再触发一次'、'TNT 爆炸范围 +1'），通过商店购买、可卖出，永久生效到本局结束。",
          "random_design": "装置 = 物理推币机（2D 物理模拟）。玩家每回合从硬币库存中投放 N 枚到投币口（N 待校核），硬币物理下落、堆叠、互相挤压，前排硬币被推下边缘进入结算区；过程含碰撞、滑动、震动（玩家可主动'shake'扰动盘面）。落位时长长（3-8 秒物理结算），轨迹永不重复。",
          "show_topology": "2D_physical",
          "put_form": "auto_place",
          "combo_synergy": "硬币间通过位置和碰撞触发协同：Seed + Water 邻接 → 长出'摇钱树'硬币（cascade）；TNT 被推下 → 引爆周围硬币（cascade）；MultiCoin 推过特殊币 → 倍率沿路径累加（path）。物理推动是协同的载体——一枚币能把整列币顶出，链式引爆。",
          "combo_predicate": [
            "path",
            "cascade"
          ],
          "combo_modifier": "Power-ups + plating 提供倍率层：如'所有动物币产出 ×2'、'被引爆的硬币再次结算'。多道具叠乘按全局乘数顺序（基础产出 × power-up 1 × power-up 2…），plating 是局部硬币加成（某币 +50% 价值），与 power-up 全局乘数叠加。",
          "rpbd_construction": "每波次结束进入商店：3 选 1 买硬币 / 买 power-up / 卖硬币换钱 / 镀膜某硬币。决策周期 = 每波（约 1-3 分钟一次），玩家需在'增加投币库存的丰度'与'强化既有协同'之间权衡。可解锁 6 角色提供差异化起手。",
          "checkpoint_mechanism": "波次推进式：每波目标产出量（推下边缘的总价值），未达标 = GG。8 难度等级 + Endless 模式。压力曲线为分段递增（每幕跳一档），boss 波带额外约束（特定硬币失效、目标值翻倍，待校核）。 · 补充：M=8（8 难度等级 / 8 stages）；N≈3（每 stage 约 3 波）；T0≈50（首波目标产出值估算）；r≈1.4（分段递增，每幕跳一档）；m_boss≈2.0（boss 波带额外约束）。[T0/r 估算待校核]"
        },
        "pressure_params": {
          "M": "8",
          "N": "3",
          "T0": "50",
          "r": "1.4",
          "m_boss": "2.0"
        },
        "summary": "总分 32（A 级），表演 9 / 结构 7——物理路径族（2D_physical × path+cascade）下沿，靠物理推币的连锁视觉拿到顶级表演分，但波次推进型 structure 难调（节奏曲线和波间强度跳跃需长期打磨），结构性短板与弹珠类共病。"
      }
    },
    {
      "slug": "roulette-hero",
      "basic": {
        "name_cn": "轮盘英雄",
        "name_en": "Roulette Hero",
        "developer": "Amethyst",
        "release_year": 2025,
        "steam_url": "https://store.steampowered.com/app/3371510/",
        "header_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3371510/d8f4a3b61bf07def68ef77a2aab4d5d1fe8c1ff7/header.jpg?t=1772681037",
        "tags": [
          "装置类",
          "轮盘",
          "格子构筑"
        ],
        "core_loop_oneliner": "100+ 动物伙伴 + 90+ 强化在赌场轮盘格子上构筑战胜机械 boss"
      },
      "analysis": {
        "framework_version": "v5",
        "updated_at": "2026-04-29",
        "scores": {
          "random": 7,
          "combo": 7,
          "pool": 6,
          "structure": 7
        },
        "qualitative": {
          "pool_base_desc": "基础池 = 玩家轮盘上摆放的 100+ 动物瓷砖（Steam 页明确：13 个动物种类 × 100+ 瓷砖变体）。轮盘格数约 8-12 格（待校核），玩家从仓库选瓷砖填格。稀有度梯度通过动物等级（幼/成/王者三档，待校核）。每次旋转一个指针落位 1 格，但邻位会被附带触发。",
          "pool_active_desc": "100+ 强化卡带（power-up cartridges，原题写 90+，Steam 页是 100+），不参与旋转，作为全局修饰：「狼旁边有羊则双倍」「每次落位 +1 金币」「动物升级所需 -1」。通过商店买、战斗奖励获得；稀有度普通/稀有/传说梯度。卡带槽数有限（待校核）。",
          "random_design": "实体轮盘装置 + 单指针（pull the lever, spin the roulette），旋转 ~1.5-2s 加速→减速→定格。指针落位 1 格，但触发该格 + 左右邻位（共 3 格）。视觉表演中等——轮盘带物理减速感，但缺真物理冲击，钉在 7。",
          "show_topology": "2D_grid",
          "put_form": "auto_place",
          "combo_synergy": "落位格触发该动物的本体效果（按 13 种动物的图标字典：狼=攻击、兔=金币、鹰=多次触发等），同时左右邻位被「带动」触发——产生邻接协同：相同物种相邻 +倍率、捕食关系（狼-羊）相邻额外伤害、群居物种 ≥3 相邻触发群体技。每旋一次约 1-3 个动物结算，无连锁触发链。",
          "combo_predicate": [
            "adjacency",
            "type_dict",
            "trigger_chain"
          ],
          "combo_modifier": "强化卡带提供全局倍率/加成：「狼伤害 ×2」「邻接加成 +50%」「每旋一次 +1 金币」；多卡带并存按类目加法→全局乘法结算。无指数链——主因每次旋转只触发 ~3 格，时间窗口短。",
          "rpbd_construction": "节点地图含战斗、商店、事件。商店买动物瓷砖、买卡带、付费换瓷砖位；可丢弃瓷砖回收金币。事件可升级动物（幼→成→王）、组合两瓷砖。决策粒度：每场战斗后（~2-3 分钟）。100+ 瓷砖 + 100+ 卡带导致初见信息过载——这是 pool=6 的核心反例钉点。",
          "checkpoint_mechanism": "敌人血量 checkpoint：每场战斗给敌人血量目标，N 次旋转（每回合 1 旋）打到 0 即过。20 个难度等级缩放 T0 和 m_boss。Boss 缺位/弱（页面未强调 boss 多样性），导致后期磨血感强、紧张曲线平。M ≈ 6-10 战斗、N 浮动、r 偏线性、m_boss 弱。 · 补充：M≈10（约 10 战斗）；N≈5（每场 5 旋）；T0≈30（首战敌人 HP 估算）；r≈1.1（线性磨血条）；m_boss≈1.5（boss 弱化是 structure 7 的原因之一）。[全部估算待校核]"
        },
        "pressure_params": {
          "M": "10",
          "N": "5",
          "T0": "30",
          "r": "1.1",
          "m_boss": "1.5"
        },
        "summary": "总分 27（C/D 临界，表演 7.0 / 结构 6.5），属网格邻接族（1D_ring × adjacency+type_dict）的孤族成员。设计观察：轮盘英雄是 pool 维度的「过载反例标杆」——100+ 瓷砖 × 100+ 卡带在 MVP 阶段就上线，新手 5 分钟内无法识别 13 个动物的字典关系，pool 钉死 6；同时邻接协同每旋仅触发 ~3 格、无触发链，combo 上限钉 7（网格邻接族的天花板）。是「池容量必须匹配学习曲线」最清晰的反面教材。"
      }
    },
    {
      "slug": "bingo-betty",
      "basic": {
        "name_cn": "宾果贝蒂",
        "name_en": "Bingo Betty",
        "developer": "Elias Austin",
        "release_year": 2026,
        "steam_url": "https://store.steampowered.com/app/4045170/",
        "header_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/4045170/59305dbffba864e14d4f04e86a0603174a6cf73c/header.jpg?t=1776993346",
        "tags": [
          "装置类",
          "宾果",
          "连线反馈"
        ],
        "core_loop_oneliner": "28 回合内 150+ 被动道具 + 卡片自定义，让摇号填满宾果连线"
      },
      "analysis": {
        "framework_version": "v5",
        "updated_at": "2026-04-29",
        "scores": {
          "random": 7,
          "combo": 8,
          "pool": 8,
          "structure": 8
        },
        "qualitative": {
          "pool_base_desc": "基础池 = 宾果球库（标准 75 球，B/I/N/G/O 5 列各 15 球，待校核）+ 30+ 张可定制宾果卡（5×5 网格，含 free 格，待校核）。每回合从球库摸出若干球（每回合数量待校核），玩家可把球放在卡上对应数字位。",
          "pool_active_desc": "主动池 = 150+ 被动道具（passive items）+ 10+ 种 blotters（永久卡面修饰，如'某格预填'、'某列额外计分'）+ Bingo Brawl 模式可定制 loadouts。被动道具自动触发，通过商店购买；可层叠多件，威力梯度从普通微调到稀有颠覆（如'对角线得分 ×3'）。",
          "random_design": "装置 = 摇号机 + 宾果卡放球。每回合摇出几个球号（数量待校核），玩家选择把哪个球放在卡上的哪个匹配格（玩家二次决策让 random 转成战术）。视觉为传统摇号转盘 + 数字弹出，落位戏剧化中等（旋转→定格无物理冲击）。",
          "show_topology": "2D_grid",
          "put_form": "manual_place",
          "combo_synergy": "结算 = 共线判定：行/列/对角填满 → 触发该线的得分 + blotter 加成；多线同时连完时叠加结算。被动道具可改变线判定（如'5 连 = 触发两次'、'对角线得分 ×3'）。基础得分 = 每填一格的固定分 + 共线奖励。",
          "combo_predicate": [
            "line_complete"
          ],
          "combo_modifier": "150+ 被动道具提供全局倍率/加成：如'每完成一行 +50% 分数'、'对角线分数 ×3'、'连续两回合连线则下回合双倍'。Blotter 提供卡面级局部修饰（某格固定预填、某列计分翻倍）。多道具叠乘顺序按全局乘数链。",
          "rpbd_construction": "完成关卡后进商店：购买 blotter（永久改卡）/ 购买被动道具 / 定制 30+ 张卡的格子布局。决策周期 = 每关一次。玩家在'调整卡面分布以提高连线概率'与'购买后期爆发道具'间权衡，构筑深度由 blotter × passive item 的组合空间提供。",
          "checkpoint_mechanism": "21 回合制 + 每关目标分数；失败条件 = 抽球次数耗尽前未达标即 GG。压力曲线为目标分数递增（关卡进度推进，目标分阶梯上扬），boss 关附加约束（待校核）。 · 补充：M=21（21 回合）；N=1（每回合 1 摇号）；T0≈50（首关目标分估算）；r≈1.2（目标分阶梯上扬）；无明确 boss 关。[T0 估算待校核]"
        },
        "pressure_params": {
          "M": "21",
          "N": "1",
          "T0": "50",
          "r": "1.2",
          "m_boss": null
        },
        "summary": "总分 31（B 级），表演 7.5 / 结构 8——网格连线族（2D_grid × line_complete）唯一锚点，累积型 combo 快感（格子点亮 → 进度推进）配合 21 关明确的目标分压力，结构稳但表演分受'摇号无物理冲击'天花板限制。"
      }
    },
    {
      "slug": "spinera",
      "basic": {
        "name_cn": "帝国轮盘",
        "name_en": "Spinera",
        "developer": "Arvis Games",
        "release_year": 2026,
        "steam_url": "https://store.steampowered.com/app/3576520/",
        "header_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3576520/2d9f43ddbd134a25e0942e725ffca4c5ec0ca298/header.jpg?t=1777038565",
        "tags": [
          "装置类",
          "老虎机",
          "资源构筑",
          "帝国经营"
        ],
        "core_loop_oneliner": "老虎机 spin 产出资源，分配建造兵种与奇迹推动帝国科技树"
      },
      "analysis": {
        "framework_version": "v5",
        "updated_at": "2026-04-29",
        "scores": {
          "random": 8,
          "combo": 7,
          "pool": 7,
          "structure": 7
        },
        "qualitative": {
          "pool_base_desc": "老虎机符号池（具体规模约 30-50 种待校核）；符号代表帝国资源（食物、士兵、金币、人口等）；稀有度梯度未披露",
          "pool_active_desc": "科技树作为主动池：玩家解锁科技节点为帝国施加全局修饰（产量+%、新规则）；不同领袖提供差异化起手；具体科技数约 30-60 节点（待校核）",
          "random_design": "老虎机摇杆 spin（具体格子数待校核，倾向 3×3 或 3×5），落位 0.7-1.5s 标准 slot 节奏，每次产出有限资源",
          "show_topology": "2D_grid",
          "put_form": "auto_place",
          "combo_synergy": "符号匹配产出资源（如 3 食物 → +N 食物），通过类型字典映射；具体邻接/链式规则未披露——以 type_dict 为主",
          "combo_predicate": [
            "line_complete",
            "type_dict"
          ],
          "combo_modifier": "科技树解锁后对资源产出施加全局修饰（如\"农业 → 食物 +50%\"）；多科技叠加（具体叠乘 vs 叠加待校核）",
          "rpbd_construction": "时代结算后进入科技树点选（类似商店三选一或自由分配）；不同领袖在新局起手提供差异化；具体增删符号成本待校核",
          "checkpoint_mechanism": "时代分数 checkpoint：每个时代要求达到指定分数，未达标则\"帝国统治坍塌\"（GG）；具体周期/曲线待校核，倾向指数递增 · 补充：M≈5（约 5 个时代，估算）；N≈10（每时代约 10 spin）；T0≈100（首时代分数门槛估算）；r≈2.0（时代分指数）；无显式 boss 关。[全部估算待校核]"
        },
        "pressure_params": {
          "M": "5",
          "N": "10",
          "T0": "100",
          "r": "2.0",
          "m_boss": null
        },
        "summary": "总分 29（C 级），表演 7.5 / 结构 7.0，落在「网格邻接族」(2D_grid × line_complete+type_dict)。投影到锚点 luck-be-a-landlord，因主动池是科技树（线性养成）而非 100+ 道具池、且 combo 协同细节未显露邻接爆点而下调 1 分。亮点是\"帝国\"题材为时代分压力提供叙事承载，但 combo 维度需明确邻接/链式才能进入双 8 区间。"
      }
    },
    {
      "slug": "spin-hero",
      "basic": {
        "name_cn": "拉杆英雄",
        "name_en": "Spin Hero",
        "developer": "Sphere Studios",
        "release_year": 2024,
        "steam_url": "https://store.steampowered.com/app/2917350/",
        "header_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2917350/header.jpg?t=1760025570",
        "tags": [
          "装置类",
          "老虎机",
          "符号 RPB",
          "自动战斗"
        ],
        "core_loop_oneliner": "老虎机符号构筑驱动自动战斗，每局拉杆推进 roguelike 闯关"
      },
      "analysis": {
        "framework_version": "v5",
        "updated_at": "2026-04-29",
        "scores": {
          "random": 7,
          "combo": 7,
          "pool": 8,
          "structure": 8
        },
        "qualitative": {
          "pool_base_desc": "120+ 图标符号池；图标对应攻击/金币/技能/防御等类型；稀有度梯度未明确披露但 4 角色 × 120 图标暗示分级",
          "pool_active_desc": "4 个可玩角色（差异化起手 + 主动技能）作为元主动池；局内通过路线/事件获取的图标 buff 数（待校核）；50+ 敌人 + 8 boss 作为对手库",
          "random_design": "老虎机风格转轮 spin（具体格子待校核），符号落位后映射为本回合的攻击/收益动作，进入自动战斗结算",
          "show_topology": "2D_grid",
          "put_form": "auto_place",
          "combo_synergy": "图标按类型字典触发不同战斗效果（如剑图标→攻击 N、金币图标→收益、闪电→技能）；具体阈值/邻接规则待校核——以 type_dict 主导",
          "combo_predicate": [
            "type_dict",
            "threshold"
          ],
          "combo_modifier": "局内累积的图标升级/天赋为符号产出施加倍率（待校核具体叠乘逻辑）",
          "rpbd_construction": "路线节点间选择不同事件/商店；可获得新图标加入符号池、升级现有图标；4 角色提供元构筑变体",
          "checkpoint_mechanism": "敌人波次/路线节点推进，6 种关卡 + 8 boss 作为周期性硬 checkpoint；未达标 → 战斗失败 → roguelike 重开 · 补充：M=8（8 boss）；N≈5（每 boss 约 5 spin）；T0≈50（首关目标估算）；r≈1.3（线性偏跳跃）；m_boss≈1.8（boss 比普通敌人强）。[T0/N 估算待校核]"
        },
        "pressure_params": {
          "M": "8",
          "N": "5",
          "T0": "50",
          "r": "1.3",
          "m_boss": "1.8"
        },
        "summary": "总分 30（B 级），表演 7.0 / 结构 8.0，落在「网格邻接族」(2D_grid × type_dict+threshold) 偏多重集字典族。投影到锚点 luck-be-a-landlord，因 combo 是\"图标→自动战斗效果\"的字典映射而非邻接 + 道具的复合爆点，random/combo 各下调 1 分；但 8 boss + 50 敌人 + 6 关卡的肉鸽底线接近 LBL。亮点是 RPG 战斗壳层为 slot 提供清晰的失败感，落地难度低。"
      }
    },
    {
      "slug": "cloverpit",
      "basic": {
        "name_cn": "四叶草深渊",
        "name_en": "CLOVERPIT",
        "developer": "Panik Arcade",
        "release_year": 2025,
        "steam_url": "https://store.steampowered.com/app/3314790/",
        "header_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3314790/f9e9b212e2d5a11bb049e31639c80e49b231f427/header_alt_assets_1.jpg?t=1775754157",
        "tags": [
          "装置类",
          "老虎机",
          "恐怖向",
          "还债主题"
        ],
        "core_loop_oneliner": "第一人称操作老虎机连击吸金，护身符构筑应对无尽债务循环"
      },
      "analysis": {
        "framework_version": "v5",
        "updated_at": "2026-04-29",
        "scores": {
          "random": 8,
          "combo": 8,
          "pool": 8,
          "structure": 9
        },
        "qualitative": {
          "pool_base_desc": "第一人称老虎机符号池（约 3 列规格，符号种类待校核约 15-25 种），符号涵盖四叶草、$、数字、骷髅等主题元素；稀有度梯度未披露但页面强调\"运势如滚雪球\"暗示有等级",
          "pool_active_desc": "150+ 道具与协同效果（charms 护身符）：覆盖加成、新规则、连锁触发等多类型；跨局元进展解锁",
          "random_design": "第一人称视角拉杆老虎机，3 列符号落位（具体格子数待校核），第一人称沉浸感 + 恐怖氛围声效强化\"每次拉杆\"的戏剧性；落位 1-2s",
          "show_topology": "2D_grid",
          "put_form": "auto_place",
          "combo_synergy": "符号组合（同类阈值 + 连线）产出基础硬币；强调\"强力连锁组合\"——道具间互相引爆形成滚雪球；具体连线/阈值规则待校核",
          "combo_predicate": [
            "line_complete",
            "type_dict",
            "cascade"
          ],
          "combo_modifier": "150+ 道具对结算施加倍率/加成/新规则；多道具叠乘形成\"滚雪球\"——典型 Balatro 式爆炸结算",
          "rpbd_construction": "每轮结束在密室内的商店/抽卡获得新护身符（charms），可能存在弃置/替换机制（待校核）；跨局解锁系统提供元进展",
          "checkpoint_mechanism": "每轮还债 checkpoint：到期必须凑齐债务额，未达标则\"真实的毁灭\"（永久死亡 + 恐怖叙事惩罚）；债务指数递增，多结局路线 · 补充：M≈6（约 6 周还债，估算）；N≈3（每周 3 spin）；T0≈100（首周债务估算）；r≈2.0（指数还债压力）；无显式 boss 关，永久死亡 + 多结局路线。[全部估算待校核]"
        },
        "pressure_params": {
          "M": "6",
          "N": "3",
          "T0": "100",
          "r": "2.0",
          "m_boss": null
        },
        "summary": "总分 33（A 级），表演 8.0 / 结构 8.5，落在「多重集字典族 + 网格连线族」(2D_grid × line_complete+type_dict+cascade)。投影到锚点 luck-be-a-landlord+balatro 复合，因 150+ 道具的滚雪球和\"还债指数压力 + 永久毁灭\"叙事比 LBL 房租更具张力，structure 上调 1 分至 9；random 因第一人称沉浸感比标准 slot 高半档但物理弱仍钉 8。最强卖点是恐怖氛围 × 数学爆炸的化学反应，是双 8 候选爆款。"
      }
    },
    {
      "slug": "dice-player-one",
      "basic": {
        "name_cn": "骰号玩家",
        "name_en": "Dice Player One",
        "developer": "KDream",
        "release_year": 2024,
        "steam_url": "https://store.steampowered.com/app/2752720/",
        "header_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2752720/header.jpg?t=1743229533",
        "tags": [
          "装置类",
          "骰子",
          "roguelike 卡牌",
          "倍率构筑"
        ],
        "core_loop_oneliner": "骰子重投与卡牌组合构筑，将随机机会转化为闯关倍率"
      },
      "analysis": {
        "framework_version": "v5",
        "updated_at": "2026-04-29",
        "scores": {
          "random": 6,
          "combo": 8,
          "pool": 9,
          "structure": 7
        },
        "qualitative": {
          "pool_base_desc": "300 个不同技能的骰子构成基础池（顶级规模）；29 个起始骰组提供差异化开局；50 个律动骰子作为变体；骰面对应攻击/防御/技能图标——稀有度梯度通过技能强度隐式分级",
          "pool_active_desc": "50 个共鸣（resonance）作为骰子修饰器主动池 + 7 个加工技能（复制/删除/升级）；锻造工坊后期解锁——双层池非常清晰",
          "random_design": "投骰子机制（具体投几枚、重投几次待校核），骰面落位为纯数字/图标显示，缺乏物理戏剧化——骰子族 random 结构性短板",
          "show_topology": "0D_multiset",
          "put_form": "auto_place",
          "combo_synergy": "骰子技能字典触发不同效果（攻击 / 治疗 / 增益），通过组合骰子实现\"突破分数\"；共鸣对骰子施加属性增强；50 共鸣 × 300 骰子的搭配空间提供倍率链潜力",
          "combo_predicate": [
            "type_dict",
            "threshold",
            "trigger_chain"
          ],
          "combo_modifier": "共鸣作为修饰符对骰子产出施加倍率/规则改写；锻造工坊允许玩家定向编辑骰面（复制/删除）",
          "rpbd_construction": "20 个挑战关卡 + 每日刷新挑战中获取新骰子，加入骰子博物馆；锻造工坊允许复制/删除/升级骰面——RPBD 决策深度高",
          "checkpoint_mechanism": "20 个挑战关卡作为周期 checkpoint；分数达标推进，未达标失败重开；难度曲线由律动骰子自调节，可能偏温和——boss/指数压力描述弱 · 补充：M=20（20 个挑战关卡）；N≈3（每关约 3 投）；T0≈50（首关分数门槛估算）；r≈1.2（律动骰子自调节，温和递增）；m_boss≈2.0（最终 boss 估算）。[T0/N 估算待校核]"
        },
        "pressure_params": {
          "M": "20",
          "N": "3",
          "T0": "50",
          "r": "1.2",
          "m_boss": "2.0"
        },
        "summary": "总分 30（B 级），表演 7.0 / 结构 8.0，落在「多重集字典族」(0D_multiset × type_dict+trigger_chain)。投影到锚点 balatro+dicey-dungeons，pool 因 300 骰 + 50 共鸣双层规模超 LBL/Balatro 上调到 9；combo 因 trigger_chain 潜力存在但骰子动画的爆炸感不及小丑牌，钉在 8（高于骰子地下城 6）。random 是骰子族结构性短板钉 6。最强卖点是构筑深度，但缺物理表演限制爆款上限。"
      }
    },
    {
      "slug": "coin-push-rpg",
      "basic": {
        "name_cn": "推币勇者",
        "name_en": "Coin Push RPG",
        "developer": "RAmen",
        "release_year": 2025,
        "steam_url": "https://store.steampowered.com/app/3036010/",
        "header_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3036010/181928c99334a7b40dd435e9a701cb927cfd6df0/header.jpg?t=1773392771",
        "tags": [
          "装置类",
          "推币",
          "团队编队",
          "养成 RPG"
        ],
        "core_loop_oneliner": "推币机投币触发自动战斗，招募英雄与天赋构筑推进城镇升级"
      },
      "analysis": {
        "framework_version": "v5",
        "updated_at": "2026-04-29",
        "scores": {
          "random": 8,
          "combo": 8,
          "pool": 7,
          "structure": 7
        },
        "qualitative": {
          "pool_base_desc": "推币机硬币池：包含基础币 + 特殊币（转转乐、叠叠乐、JP123 触发币、全盘大奖币等）；稀有度由触发概率隐式分级；具体币种数待校核",
          "pool_active_desc": "100+ 装备 + 260+ 天赋 buff + 多角色勇者编队（约 20-50 角色待校核）；编队站位策略层进一步提供主动池纵深",
          "random_design": "1:1 物理推币机模拟，硬币投掷后物理引擎决定碰撞、堆叠、掉落——物理过程戏剧化；可挂机自动投币加快节奏",
          "show_topology": "2D_physical",
          "put_form": "auto_place",
          "combo_synergy": "硬币穿过特殊孔位/碰撞特殊币触发奖励（path + cascade）；多枚币堆叠达到边缘后批量掉落形成连锁——典型物理路径族",
          "combo_predicate": [
            "path",
            "cascade",
            "threshold"
          ],
          "combo_modifier": "勇者天赋（260+ buff）对推币机奖励倍率施加修饰；装备词条进一步增强；编队站位影响触发频率",
          "rpbd_construction": "招募勇者 → 选择天赋 → 装备洗炼/强化/重铸 → 编队站位调整；冒险模式下每个关卡/村庄升级为 RPBD 决策点",
          "checkpoint_mechanism": "冒险模式节点推进 + 讨伐魔王作为终极 boss；战斗失败重开；具体波次密度和压力曲线偏平缓——挂机属性可能稀释紧张感 · 补充：M≈10（约 10 关 + 终极 boss）；N≈5（每关多波）；T0≈100（首关目标产出估算）；r≈1.3（线性偏挂机化）；m_boss≈3.0（讨伐魔王 boss 强）。[全部估算待校核]"
        },
        "pressure_params": {
          "M": "10",
          "N": "5",
          "T0": "100",
          "r": "1.3",
          "m_boss": "3.0"
        },
        "summary": "总分 30（B 级），表演 8.0 / 结构 7.0，落在「物理路径族」(2D_physical × path+cascade+threshold)。投影到锚点 raccoin（浣熊推币机），random 因物理推币装置同族钉 8（比浣熊低 1 分，因更聚焦推币模拟而非创新瀑布表演）；combo 同 8；pool 7 同浣熊（多角色 RPG 池但缺双层精度）；structure 7 同浣熊（节奏挂机化稀释紧张）。亮点是 RPG 编队 × 推币的题材融合，但需在 boss/压力曲线上发力才能突破双 8。"
      }
    },
    {
      "slug": "luckland",
      "basic": {
        "name_cn": "幸运大陆",
        "name_en": "LuckLand",
        "developer": "e-Jade",
        "release_year": 2023,
        "steam_url": "https://store.steampowered.com/app/2516820/",
        "header_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2516820/header.jpg?t=1726290426",
        "tags": [
          "装置类",
          "网格",
          "roguelike 卡牌",
          "格子构筑"
        ],
        "core_loop_oneliner": "旋转棋盘格子蓄能触发卡牌效果，构筑卡组推进 roguelike 闯关"
      },
      "analysis": {
        "framework_version": "v5",
        "updated_at": "2026-04-29",
        "scores": {
          "random": 7,
          "combo": 8,
          "pool": 7,
          "structure": 7
        },
        "qualitative": {
          "pool_base_desc": "4×5 棋盘格子，棋子来自不同区域（彩色工坊/宝藏海湾/命运赌场等），约 30-50 种棋子和宝物（待校核）；具体稀有度梯度未公开",
          "pool_active_desc": "天赋系统 + 解锁专属宝物 + 区域奖励道具，规模约 30+（待校核）；通过完成订单、开宝箱、赌场 all-in 获取，部分永久解锁",
          "random_design": "旋转棋盘装置，玩家转动棋盘后系统自动结算棋子组合落位；表演节奏接近 slot 但呈现为格子转动而非滚轴，落位戏剧化弱于物理类",
          "show_topology": "2D_grid",
          "put_form": "auto_place",
          "combo_synergy": "棋盘上不同棋子的位置组合会自动结算能量产出，区域棋子形成主题协同（彩色工坊重产出、海湾重宝物、赌场重高风险）；具体邻接/类型规则未详述但属于网格族",
          "combo_predicate": [
            "adjacency",
            "type_dict"
          ],
          "combo_modifier": "天赋和宝物对全局结算施加倍率/加成，部分宝物改变特定棋子产出规则（待校核具体数值）",
          "rpbd_construction": "段间在彩色工坊接订单换奖励、宝藏海湾开箱、命运赌场博弈；玩家选择不同区域路径决定下一段补什么棋子和宝物，形成卡牌构筑+地图选路的双层决策",
          "checkpoint_mechanism": "段末生死对决（boss 战），敌人随推进逐渐增强；线性/指数难度递增（待校核），失败结束本局 · 补充：M≈8（约 8 段，估算）；N≈5（每段约 5 旋转）；T0≈50（首段目标估算）；r≈1.5（段间递增）；m_boss≈2.0（段末生死对决）。[全部估算待校核]"
        },
        "pressure_params": {
          "M": "8",
          "N": "5",
          "T0": "50",
          "r": "1.5",
          "m_boss": "2.0"
        },
        "summary": "总分 29（C 级），表演 7.5 / 结构 7.0，落在「网格邻接族」(2D_grid × adjacency+type_dict)。投影到锚点游戏 luck-be-a-landlord，因装置是旋转棋盘而非 slot 落位（random 表演降级，combo 也非典型 LBL 邻接互动那么直观）+ 池规模和稀有度梯度未充分公开（pool 下调）+ 段间路径选择有创新但 checkpoint 节奏未标准化（structure 下调）。最大观察点：用「旋转棋盘」替代滚轴是装置创新，但落位戏剧化弱化，需要在 combo 视觉化和路径选择深度上补强。"
      }
    },
    {
      "slug": "lucky-island",
      "basic": {
        "name_cn": "幸运岛",
        "name_en": "Lucky Island",
        "developer": "Just L Studio",
        "release_year": 2024,
        "steam_url": "https://store.steampowered.com/app/2195650/",
        "header_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2195650/header.jpg?t=1716624493",
        "tags": [
          "装置类",
          "老虎机",
          "海岛经营",
          "符号 RPB"
        ],
        "core_loop_oneliner": "老虎机分派岛民工作产出资源，规划海岛建设应对 roguelike 事件"
      },
      "analysis": {
        "framework_version": "v5",
        "updated_at": "2026-04-29",
        "scores": {
          "random": 8,
          "combo": 7,
          "pool": 8,
          "structure": 8
        },
        "qualitative": {
          "pool_base_desc": "拉霸机符号池（岛民/资源/建筑符号），规模约 40-60 种（待校核）；分普通/稀有度梯度未公开但牌组系统暗示存在分级",
          "pool_active_desc": "技能池（多种效果各异的技能）+ 建筑系统作为长期修饰器，规模约 30-50（待校核）；通过日夜循环的探索与建造获取",
          "random_design": "经典老虎机滚轴落位，3×N 格子（具体未公开），转动 → 加速 → 减速 → 定格的标准 slot 表演，约 0.7-1.5s",
          "show_topology": "2D_grid",
          "put_form": "auto_place",
          "combo_synergy": "符号落位后分派给岛民工作，符号间协同通过技能搭配触发；缺失明确的邻接/连线判定描述，更偏向类型字典（不同符号对应不同岛民职业的产出加成）",
          "combo_predicate": [
            "type_dict",
            "threshold"
          ],
          "combo_modifier": "建筑和技能对岛民产出做全局/局部修饰；Rogue 风格的触发事件正负影响产出",
          "rpbd_construction": "白天指挥岛民工作（消化 spin 产出），晚上规划小岛（购买建筑/选技能）；商店/事件机制提供构筑选择",
          "checkpoint_mechanism": "日夜循环作为 checkpoint 节奏；推测有阶段性目标（资源/进度），失败条件未公开（待校核） · 补充：M≈10（约 10 天）；N≈3（每天约 3 spin）；T0≈50（首日目标资源估算）；r≈1.4（日夜循环递增）；无明确 boss 关。[全部估算待校核]"
        },
        "pressure_params": {
          "M": "10",
          "N": "3",
          "T0": "50",
          "r": "1.4",
          "m_boss": null
        },
        "summary": "总分 31（B 级），表演 7.5 / 结构 8.0，落在「网格邻接族」近邻（2D_grid × type_dict+threshold，更偏字典）。投影到锚点游戏 luck-be-a-landlord，因装置是同款 slot（random 同档 8）+ 加入岛屿建造作为主动池长效修饰（pool 接近 LBL 但缺 100+ 道具梯度证据，下调 1）+ combo 是岛民职业类型字典而非 LBL 邻接闪电链（爽感弱化，combo 下调 1）+ 日夜循环替代房租做 checkpoint（structure 接近但节奏标准化未验证，下调 1.5）。最大观察点：把 slot 跨界到岛屿经营是题材创新，但牺牲了 LBL 邻接 combo 的视觉爽感。"
      }
    },
    {
      "slug": "lucky-lord",
      "basic": {
        "name_cn": "幸运领主：命运的推币机",
        "name_en": "Lucky Lord: The Coin Pusher of Fate",
        "developer": "Star Seeker Studio",
        "release_year": 2025,
        "steam_url": "https://store.steampowered.com/app/3408410/",
        "header_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3408410/header_schinese.jpg?t=1768181635",
        "tags": [
          "装置类",
          "推币",
          "中世纪",
          "roguelike 卡牌"
        ],
        "core_loop_oneliner": "推币机 × 老虎机随机 × roguelike 卡牌的中世纪奇幻构筑"
      },
      "analysis": {
        "framework_version": "v5",
        "updated_at": "2026-04-29",
        "scores": {
          "random": 8,
          "combo": 8,
          "pool": 8,
          "structure": 7
        },
        "qualitative": {
          "pool_base_desc": "150+ 卡牌 + 60+ 英雄卡，含冒险者/法师/野兽/建筑等类型分组；6 种领主开局配置作为初始构筑差异；稀有度梯度未公开（待校核）",
          "pool_active_desc": "英雄卡和建筑卡作为半主动池修饰器，规模约 60+（待校核）；玩家通过卡牌随机抽取和领主选择形成构筑",
          "random_design": "推币机为主装置 + slot 风格的卡牌随机入场；卡牌随机落到棋盘上的过程含物理推送元素，落位约 1-3s",
          "show_topology": "2D_physical",
          "put_form": "auto_place",
          "combo_synergy": "卡牌间的链式反应：猎人带兽群、法师释放连锁法术、盗贼偷敌方宝藏、祭司给小孩赋祝福扩村；类型字典 + 物理路径 + 连锁触发并存",
          "combo_predicate": [
            "path",
            "cascade",
            "type_dict"
          ],
          "combo_modifier": "锻造武器、建造家园等系统对英雄产出施加修饰；卡牌升级机制提供威力梯度",
          "rpbd_construction": "段间从牌库中抽卡构筑、6 种领主开局选择、锻造与建造决策；roguelike 抽卡而非传统商店",
          "checkpoint_mechanism": "击败强敌作为段末 boss 战，推进结构隐含波次推进；具体血量/目标数值未公开（待校核） · 补充：M≈8（约 8 段，估算）；N≈5（每段约 5 spin）；T0≈50（首段目标估算）；r≈1.4（中世纪推进递增）；m_boss≈2.0（段末强敌）。[全部估算待校核]"
        },
        "pressure_params": {
          "M": "8",
          "N": "5",
          "T0": "50",
          "r": "1.4",
          "m_boss": "2.0"
        },
        "summary": "总分 31（B 级），表演 8.0 / 结构 7.5，落在「物理路径族 + 类型字典复合」(2D_physical × path+cascade+type_dict)。投影到锚点游戏 raccoin（浣熊推币机）+ luck-be-a-landlord 之间，因装置主层是推币机（random 同 raccoin 9 但混合 slot 卡牌入场使物理纯度稀释，下调 1）+ 加入卡牌类型协同（combo 比纯物理 raccoin 更复杂但视觉链不如纯物理直观，combo 8 持平）+ 双层池（卡牌 + 英雄）是 LBL 黄金结构的近似（pool 8 但稀有度未公开，比 LBL 9 下调）+ 中世纪题材的肉鸽推进（structure 接近 raccoin 7）。最大观察点：推币机 + slot + 卡牌的三装置混合是高风险设计，主装置层定位（物理 vs 类型字典）会决定它最终落到哪个集群。"
      }
    },
    {
      "slug": "lucky-hero",
      "basic": {
        "name_cn": "幸运勇者",
        "name_en": "Lucky Hero",
        "developer": "mora churrasco studio",
        "release_year": 2023,
        "steam_url": "https://store.steampowered.com/app/2404510/",
        "header_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2404510/header.jpg",
        "tags": [
          "装置类",
          "轮盘",
          "符号 RPB",
          "roguelike 卡牌"
        ],
        "core_loop_oneliner": "武器装备化为符号，转动命运轮盘构筑组合击败敌人"
      },
      "analysis": {
        "framework_version": "v5",
        "updated_at": "2026-04-29",
        "scores": {
          "random": 7,
          "combo": 7,
          "pool": 7,
          "structure": 7
        },
        "qualitative": {
          "pool_base_desc": "300+ 神秘符号（武器和装备化为符号），规模庞大；3 个职业各自起手不同，稀有度梯度未公开但池规模暗示有分级（待校核）",
          "pool_active_desc": "30+ 主动和被动技能 + 区域效果道具；通过随机事件、商店购买符号、删除符号获取与剔除，构筑灵活度高",
          "random_design": "命运轮盘旋转装置，类似轮盘英雄的圆环旋转 → 减速 → 定格停在符号位；旋转节奏 1-2s，缺少物理冲击但等待感强",
          "show_topology": "2D_grid",
          "put_form": "auto_place",
          "combo_synergy": "符号间通过武器化设定形成协同（如同类武器叠加伤害、装备符号触发被动技能），与 30+ 技能配合构筑流派；判定包含轮盘邻接和类型字典双层",
          "combo_predicate": [
            "adjacency",
            "type_dict"
          ],
          "combo_modifier": "30+ 主动/被动技能对符号产出施加修饰，区域效果作为局部全局修饰器，事件提供随机正负影响",
          "rpbd_construction": "商店购买/删除符号 + 技能选择 + 随机事件抉择 + 区域风险收益选择；构筑维度多但池过载风险高（300+ 符号 vs 轮盘英雄 100+ 反例）",
          "checkpoint_mechanism": "对抗各种强大敌人，3 职业 + 区域效果 + 随机事件构成 roguelike 推进；敌人有独特能力，具体血量/目标未公开（待校核） · 补充：M≈10（约 10 战斗，估算）；N≈3（每战 3 旋）；T0≈30（首战敌人 HP 估算）；r≈1.2（roguelike 推进）；m_boss≈1.5（区域 boss）。[全部估算待校核]"
        },
        "pressure_params": {
          "M": "10",
          "N": "3",
          "T0": "30",
          "r": "1.2",
          "m_boss": "1.5"
        },
        "summary": "总分 28（C 级），表演 7.0 / 结构 7.0，落在「网格邻接族」(2D_grid × adjacency+type_dict)。投影到锚点游戏 roulette-hero，因装置同为命运轮盘（random 同档 7）+ 武器化符号 + 30+ 技能的双层池设计接近 LBL 黄金结构但池规模 300+ 触及轮盘英雄\"过载池\"反例（pool 持平 7 不下调，因符号删除机制缓解了过载）+ combo 仍是单元独立结算 + 类型字典叠加，缺少触发链（combo 钉死 7）+ 3 职业 + 随机事件给出基础肉鸽框架（structure 持平 7）。最大观察点：池规模 300+ 是双刃剑——若新手前 30 分钟接触不到 30 种以上符号则池设计实际有效；否则会复刻轮盘英雄的过载困境，没有突破圆环族 7 分天花板的关键设计。"
      }
    },
    {
      "slug": "bingle-bingle",
      "basic": {
        "name_cn": "转啊转",
        "name_en": "Bingle Bingle",
        "developer": "Knitting Games",
        "release_year": 2024,
        "steam_url": "https://store.steampowered.com/app/2789810/",
        "header_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2789810/header.jpg?t=1775412277",
        "tags": [
          "装置类",
          "轮盘",
          "符号 RPB",
          "赌场分数"
        ],
        "core_loop_oneliner": "自建轮盘，组合下注与特殊球的协同冲击高分对抗赌场"
      },
      "analysis": {
        "framework_version": "v5",
        "updated_at": "2026-04-29",
        "scores": {
          "random": 7,
          "combo": 7,
          "pool": 7,
          "structure": 7
        },
        "qualitative": {
          "pool_base_desc": "10+ 种球（不同效果）+ 玩家自建的轮盘格子（数字、颜色可改、可冻结/吃掉）+ 50+ 种下注选项；池规模中等，球种数量明显少于 LBL 这类",
          "pool_active_desc": "近 70 件物品 + 徽章系统（'各种独特效果'）+ 职业专长，构成主动池修饰层；玩家通过每轮后的决策选入",
          "random_design": "1D 圆环轮盘旋转 + 投出球 → 球落入轮盘格子结算；旋转有等待感但缺乏物理冲击，节奏接近轮盘英雄",
          "show_topology": "1D_ring",
          "put_form": "auto_place",
          "combo_synergy": "球的效果与轮盘格子（数字/颜色）触发协同，自建轮盘允许玩家预设触发条件；页面强调'协同效应可达数百万积分'，存在倍率链潜力但具体规则未公开",
          "combo_predicate": [
            "adjacency",
            "type_dict"
          ],
          "combo_modifier": "徽章和职业专长在结算时施加全局倍率/加成；具体叠乘规则未公开",
          "rpbd_construction": "每轮后做决定升级牌组：选球、改轮盘格子、买徽章、选职业专长；玩家对装置本体可改是与轮盘英雄的关键差异",
          "checkpoint_mechanism": "15 位 Boss 分为 5 个类别（每类 3 关），失败重开；具体目标值/增长率未公开 · 补充：M=15（15 位 Boss × 5 类别）；N≈3（每 boss 约 3 旋）；T0≈50（首关目标估算）；r≈1.3（boss 间递增）；m_boss≈1.5（每类末 boss 加强）。[T0/N 估算待校核]"
        },
        "pressure_params": {
          "M": "15",
          "N": "3",
          "T0": "50",
          "r": "1.3",
          "m_boss": "1.5"
        },
        "summary": "总分 28（C 级），表演 7.0 / 结构 7.0，落在「圆环复合族」(1D_ring × adjacency+type_dict)。投影到 roulette-hero，因允许玩家自建轮盘+球的双层修改而 combo 略高，但 random 仍受圆环装置无物理冲击限制钉死 7。轮盘自定义是相对原 IP 的关键创新点，但 pool 描述深度不足，承担'过载池'风险。"
      }
    },
    {
      "slug": "die-shou-wei-cheng",
      "basic": {
        "name_cn": "死守危城",
        "name_en": "",
        "developer": "3P Studios",
        "release_year": 2022,
        "steam_url": "https://store.steampowered.com/app/1863170/",
        "header_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1863170/header.jpg",
        "tags": [
          "装置类",
          "卡牌",
          "符号 RPB",
          "自动战斗"
        ],
        "core_loop_oneliner": "构筑符号组合产出防御值抵挡僵尸潮的牌组构建塔防"
      },
      "analysis": {
        "framework_version": "v5",
        "updated_at": "2026-04-29",
        "scores": {
          "random": 7,
          "combo": 7,
          "pool": 7,
          "structure": 7
        },
        "qualitative": {
          "pool_base_desc": "从仓库'最多随机选择 15 个符号'落到黑板上；不同守卫拥有不同的初始符号集和最佳组合策略；具体符号种类数和稀有度梯度页面未公开",
          "pool_active_desc": "守护者英雄（多职业/多流派）+ 重新滚动/删除工具 + 升级；规模中等，主动池层级清楚但梯度细节缺失",
          "random_design": "点击旋转按钮 → 黑板上随机生成 15 个符号 → 按规则自动结算防御值；视觉接近 slot 落位但页面未强调表演时长/锁定动画",
          "show_topology": "2D_grid",
          "put_form": "manual_place",
          "combo_synergy": "符号之间产生协同生成防御值（'构建你的符号组合以产生更多的防御值'）；具体规则（邻接/阈值/类型字典）未公开但格子化结构暗示 2D_grid + adjacency",
          "combo_predicate": [
            "line_complete",
            "type_dict"
          ],
          "combo_modifier": "守护者英雄被动 + 工具效果作为全局修饰；具体倍率/范围未公开",
          "rpbd_construction": "每回合可使用'重新滚动''删除'工具调整符号组合 + 选择守护者英雄 + 在阶段间增删符号；决策粒度比 LBL 更细（局内可重抽）",
          "checkpoint_mechanism": "回合数倒计时为 0 时僵尸进攻；防御值 < 僵尸数则 GG；类塔防波次结构，每波难度递增，具体增长率/M 数页面未公开 · 补充：M≈10（约 10 波塔防，估算）；N=1（每回合 1 spin）；T0≈30（首波僵尸数估算）；r≈1.3（每波难度递增）；无明确 boss 关。[全部估算待校核]"
        },
        "pressure_params": {
          "M": "10",
          "N": "1",
          "T0": "30",
          "r": "1.3",
          "m_boss": null
        },
        "summary": "总分 28（C 级），表演 7.0 / 结构 7.0，落在「网格邻接族」(2D_grid × line_complete+type_dict)。投影到 luck-be-a-landlord，因塔防外壳引入资源对抗维度但页面未公开稀有度梯度和爆款级数值爆炸，各维度都比 LBL 低 1-2 分。塔防 + slot 是结构性创新点，但 'roll/删除' 工具实质是 LBL 的简化变体，缺新颖触发机制。"
      }
    },
    {
      "slug": "crop-rotation",
      "basic": {
        "name_cn": "轮作法",
        "name_en": "Crop Rotation",
        "developer": "Sprouting Potato",
        "release_year": 2023,
        "steam_url": "https://store.steampowered.com/app/2348090/",
        "header_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2348090/header.jpg?t=1756122377",
        "tags": [
          "装置类",
          "种田",
          "自动战斗",
          "还债主题"
        ],
        "core_loop_oneliner": "drafting 卡牌组建自动农场，自动结算还清贷款"
      },
      "analysis": {
        "framework_version": "v5",
        "updated_at": "2026-04-29",
        "scores": {
          "random": 6,
          "combo": 7,
          "pool": 7,
          "structure": 8
        },
        "qualitative": {
          "pool_base_desc": "作物/卡牌池（具体数量未公开）；通过 drafting 进入玩家牌组，每张牌代表一种作物/操作；稀有度分级页面未提及",
          "pool_active_desc": "升级/被动卡（具体数量未公开）；属于卡组中长期生效的修饰层",
          "random_design": "卡牌自动打出（玩家不操作）；视觉上是卡牌依次出场结算，缺少落位戏剧化；接近骰子地下城/切骰这一档的低视觉爆发",
          "show_topology": "2D_grid",
          "put_form": "manual_place",
          "combo_synergy": "牌组构建强调'卡牌之间的协同效果'，存在类型字典式触发（如某类作物 + 某类工具）；具体规则未公开但以多重集结构为主",
          "combo_predicate": [
            "adjacency",
            "type_dict"
          ],
          "combo_modifier": "升级卡 + 被动加成施加在结算时；详细叠乘规则未公开",
          "rpbd_construction": "drafting 选卡（季末/段末加入新卡）+ 移除卡 + 升级卡；自动结算让 RPBD 时长成为主要游戏时间",
          "checkpoint_mechanism": "还贷压力：每段需赚到目标金额还贷；'债务高得吓人'暗示指数级增长但具体 r 值未公开；目标分族结构清晰 · 补充：M≈8（约 8 段还贷期，估算）；N≈5（每段约 5 季）；T0≈100（首段贷款估算）；r≈1.8（指数还贷压力，'债务高得吓人'）；无显式 boss 关。[全部估算待校核]"
        },
        "pressure_params": {
          "M": "8",
          "N": "5",
          "T0": "100",
          "r": "1.8",
          "m_boss": null
        },
        "summary": "总分 28（C 级），表演 6.5 / 结构 7.5，落在「网格邻接族」(2D_grid × adjacency+type_dict)。投影到 dicey-dungeons，因自动结算让玩家完全失去 spin 阶段的操作介入而 random 略低（6），但还贷目标分压力曲线清晰让 structure 提到 8。卡牌自动打出节省决策成本同时也牺牲了爽感峰值，是设计上'纯构筑流'的取舍。"
      }
    },
    {
      "slug": "cat-god-ranch",
      "basic": {
        "name_cn": "猫神牧场",
        "name_en": "Cat God Ranch",
        "developer": "CrazyPotato Studio",
        "release_year": 2024,
        "steam_url": "https://store.steampowered.com/app/2797340/",
        "header_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2797340/d1e3697fb2ed8e4e885d9be93d4d85eafa1426e9/header_schinese.jpg?t=1773415538",
        "tags": [
          "装置类",
          "卡牌",
          "自动战斗",
          "种田"
        ],
        "core_loop_oneliner": "构筑动物牌组每日产出货币向猫神进贡的牧场 roguelike"
      },
      "analysis": {
        "framework_version": "v5",
        "updated_at": "2026-04-29",
        "scores": {
          "random": 7,
          "combo": 8,
          "pool": 8,
          "structure": 7
        },
        "qualitative": {
          "pool_base_desc": "100+ 动物（每只独特能力）+ 7 大动物家族（流派分类）+ 10+ 地形卡 + 20+ 玩具；基础池规模偏大，存在'过载池'风险，但家族流派分类减轻信息密度",
          "pool_active_desc": "100+ 道具卡 + 玩具；每阶段选入；规模与小丑牌相当，是双层池架构",
          "random_design": "夜晚动物回窝 → 次日早晨随机重新落位到牧场格子上（每日格子站位都不同）；落位戏剧化温和（无物理冲击但有'今天会落到哪'的期待感），整体节奏接近 slot 的机械落位但视觉爆发偏弱",
          "show_topology": "2D_grid",
          "put_form": "auto_place",
          "combo_synergy": "结算 = 邻接 + 食物链双层判定：(1) 相邻动物协同（如母鸡旁边有公鸡 +X 分）；(2) 食物链触发（火鸡被食肉动物吃掉 +X 分；如该食肉动物本身有'食鸡 +Y'特性则叠加）；(3) 7 大家族流派组合提供宏观字典层。基础得分 = 每只动物的固定产出，邻接 + 食物链事件叠加在结算时",
          "combo_predicate": [
            "adjacency",
            "type_dict"
          ],
          "combo_modifier": "道具卡 + 玩具在每日产出时叠乘加成；地形卡为局部场地修饰",
          "rpbd_construction": "玩家主动管理动物牌组（添加/移除）+ 每阶段选道具/地形/玩具；不是传统 drafting 而是持续管理",
          "checkpoint_mechanism": "周期性给猫神'上贡'：每段达标金币才能继续；'是持续压榨还是早日解放'暗示玩家可选不同结束节奏，结构性 GG 阈值清晰但增长曲线未公开 · 补充：M≈10（约 10 段进贡周期，估算）；N≈7（每段约 7 天）；T0≈100（首段进贡金币估算）；r≈1.5（递增）；无明确 boss 关。[全部估算待校核]"
        },
        "pressure_params": {
          "M": "10",
          "N": "7",
          "T0": "100",
          "r": "1.5",
          "m_boss": null
        },
        "summary": "总分 30（C 级），表演 7.5 / 结构 7.5，落在「网格邻接族」(2D_grid × adjacency+type_dict)。投影到 die-in-the-dungeon（地牢掷骰，同 2D_grid × adjacency 集群），因 7 家族 × 流派组合的协同字典深度接近麻将番数，但卡牌产出动画弱于麻将番数累加而 random/combo 各低 1 分；池规模 100+ 接近轮盘英雄过载池警戒线，靠家族分类才稳住 pool 8。'是否给猫神上贡'的玩家自主结束节奏是结构性创新。"
      }
    },
    {
      "slug": "lucky-hunter",
      "basic": {
        "name_cn": "幸运猎人",
        "name_en": "Lucky Hunter",
        "developer": "159 Studio",
        "release_year": 2024,
        "steam_url": "https://store.steampowered.com/app/2824310/",
        "header_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2824310/header_schinese.jpg?t=1770639208",
        "tags": [
          "装置类",
          "自走棋",
          "三消合并",
          "自动战斗"
        ],
        "core_loop_oneliner": "三消合并构筑棋子阵容，自走棋自动战斗对抗灾变怪物"
      },
      "analysis": {
        "framework_version": "v5",
        "updated_at": "2026-04-29",
        "scores": {
          "random": 7,
          "combo": 7,
          "pool": 8,
          "structure": 8
        },
        "qualitative": {
          "pool_base_desc": "100+ 棋子 + 圣物，按等级/职业分类；每回合从池抽取若干棋子放入战场格子",
          "pool_active_desc": "圣物系统（约 N 待校核），通过商店/事件节点获取，提供全局协同/属性增益",
          "random_design": "格子上放置棋子 + 三个相同棋子相邻自动合成升级；落位本身无物理戏剧化，戏剧性来自合成连锁动画与自动战斗回放",
          "show_topology": "2D_grid",
          "put_form": "auto_place",
          "combo_synergy": "网格相邻三消合成（3 同名 → 1 高级），合成后单位在自动战斗中按职业/种族协同；战场为自走棋自动结算",
          "combo_predicate": [
            "adjacency",
            "threshold",
            "type_dict"
          ],
          "combo_modifier": "圣物全局加成（如某职业攻击 +X、合成产出额外棋子），自动战斗阶段对全单位结算",
          "rpbd_construction": "回合间在地图节点选择（战斗/商店/附魔/事件），商店购买棋子和圣物，附魔升级单位；每回合获得新棋子",
          "checkpoint_mechanism": "随机生成的狩猎地图，4 章节，每章末 Boss 战；战败后退出本局 · 补充：M=4（4 章节）；N≈10（每章约 10 战）；T0≈30（首战敌人 HP 估算）；r≈1.5（章节间跳跃）；m_boss=2.0（章末 Boss）。[T0/N 估算待校核]"
        },
        "pressure_params": {
          "M": "4",
          "N": "10",
          "T0": "30",
          "r": "1.5",
          "m_boss": "2.0"
        },
        "summary": "总分 30（B 级），表演 7.0 / 结构 8.0，落在「网格邻接族」(2D_grid × adjacency+threshold)。投影到 luck-be-a-landlord，因装置层去掉了 spin 落位戏剧化、靠合成动画与自走棋回放替代而 random 低 1 分；100+ 单位双层池与 4 章节 boss 结构与 LBL 接近。三消+自走棋的双层装置是设计创新，但 random 缺乏物理冲击是结构性短板。"
      }
    },
    {
      "slug": "lucky-mayor",
      "basic": {
        "name_cn": "幸运市长",
        "name_en": "Lucky Mayor",
        "developer": "MadGoat Game Studio",
        "release_year": 2023,
        "steam_url": "https://store.steampowered.com/app/2659970/",
        "header_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2659970/header_schinese.jpg?t=1720252883",
        "tags": [
          "装置类",
          "卡牌",
          "城市管理",
          "轻装置"
        ],
        "core_loop_oneliner": "招募市民卡牌构筑产业链，roguelike 经营繁荣都市"
      },
      "analysis": {
        "framework_version": "v5",
        "updated_at": "2026-04-29",
        "scores": {
          "random": 7,
          "combo": 7,
          "pool": 9,
          "structure": 8
        },
        "qualitative": {
          "pool_base_desc": "150+ 市民卡，每个有独特能力与喜好；按职业/类型分类，稀有度梯度（待校核）",
          "pool_active_desc": "大量道具（约 N 待校核），全局修饰市民产出/需求满足",
          "random_design": "卡牌抽取 → 选择招募/安置；无物理落位，戏剧化来自市民进入城市的反馈与金币结算",
          "show_topology": "0D_multiset",
          "put_form": "auto_place",
          "combo_synergy": "市民间能力协同（如生产链：A 产出物喂给 B 产生金币）；按市民类型字典触发组合加成",
          "combo_predicate": [
            "type_dict"
          ],
          "combo_modifier": "道具全局加成（如某类市民产出 +50%、所有市民需求降低）",
          "rpbd_construction": "回合内招募市民、建设产业链、购买道具；最终期限前不断扩充和优化卡组",
          "checkpoint_mechanism": "最终期限内累积金币达目标 → 通过；典型目标分族（资金条曲线待校核） · 补充：M≈10（约 10 回合期限，估算）；N≈3（每回合约 3 招募）；T0≈100（首回合金币目标估算）；r≈1.3（线性递增）；无明确 boss 关。[全部估算待校核]"
        },
        "pressure_params": {
          "M": "10",
          "N": "3",
          "T0": "100",
          "r": "1.3",
          "m_boss": null
        },
        "summary": "总分 31（B 级），表演 7.0 / 结构 8.5，落在「多重集字典族」(0D_multiset × type_dict)。投影到 balatro，因 150+ 市民独立能力靠 type_dict 协同但缺乏指数倍率链而 combo 低 2 分；池容量与构筑深度跟 Balatro 同档（pool 9）。题材换皮 Balatro 但缺爆炸性数字反馈，落入第二梯队。"
      }
    },
    {
      "slug": "insider-trading",
      "basic": {
        "name_cn": "内幕交易",
        "name_en": "Insider Trading",
        "developer": "Naiive",
        "release_year": 2026,
        "steam_url": "https://store.steampowered.com/app/3166810/",
        "header_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3166810/f630edf3f73d0b98ab76b4118d7d35f7f700c0c3/header_schinese.jpg?t=1776280182",
        "tags": [
          "装置类",
          "卡牌",
          "炒股roguelike"
        ],
        "core_loop_oneliner": "卡牌构筑操纵股价 + 周目目标的炒股 roguelike"
      },
      "analysis": {
        "framework_version": "v5",
        "updated_at": "2026-04-29",
        "scores": {
          "random": 7,
          "combo": 9,
          "pool": 9,
          "structure": 8
        },
        "qualitative": {
          "pool_base_desc": "120+ 操作卡牌（拉升/抛售/操纵），按效果分类；不同角色初始牌组差异",
          "pool_active_desc": "60+ 可堆叠药丸与特性，提供全局修饰与意外搭配组合",
          "random_design": "出牌 → 股价波动反馈，市场随机波动 + 经济衰退等突发事件构成 random 来源；无物理落位，戏剧化来自 K 线数字跳动",
          "show_topology": "0D_multiset",
          "put_form": "auto_place",
          "combo_synergy": "卡牌按类型触发组合（牌型字典）+ 连击系统（按序激活，倍率累乘）；玩家选打的卡顺序影响倍率链",
          "combo_predicate": [
            "type_dict",
            "trigger_chain"
          ],
          "combo_modifier": "药丸/特性全局修饰（如某类卡 +X% 收益、连击额外加倍），可堆叠出非线性产出",
          "rpbd_construction": "盘后交易市场不同卡池抽取手牌，购买卡牌和药丸；周间调整牌组应对下周财务目标",
          "checkpoint_mechanism": "周财务目标制（每周需达标资金），未达标 GG；目标曲线待校核 · 补充：M≈10（约 10 周财务期，估算）；N≈5（每周约 5 出牌）；T0≈1000（首周资金目标估算）；r≈1.5（周间递增）；无明确 boss 关。[全部估算待校核]"
        },
        "pressure_params": {
          "M": "10",
          "N": "5",
          "T0": "1000",
          "r": "1.5",
          "m_boss": null
        },
        "summary": "总分 33（A 级），表演 8.0 / 结构 8.5，落在「多重集字典族」(0D_multiset × type_dict+trigger_chain)。投影到 balatro，因 120+ 卡 + 60+ 药丸双层 + 连击倍率链与 Balatro 几乎同构而总分接近；random 因股票题材的 K 线跳动不及扑克手牌的视觉爆发而低 1 分。'披着华尔街外衣的 Balatro' 是开发者自述，是高完成度的题材换装爆款候选。"
      }
    },
    {
      "slug": "vampire-crawlers",
      "basic": {
        "name_cn": "吸血鬼爬行者：屠戮地牢的吸血鬼幸存者",
        "name_en": "Vampire Crawlers",
        "developer": "Poncle, Nosebleed Interactive",
        "release_year": 2026,
        "steam_url": "https://store.steampowered.com/app/3265700/",
        "header_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3265700/5590e42cab09dacabee973dd2c3e27ef12ed4950/header.jpg?t=1776925935",
        "tags": [
          "装置类",
          "卡牌",
          "第一人称地牢"
        ],
        "core_loop_oneliner": "卡牌构筑 + 第一人称网格地牢的回合制 combo 战斗"
      },
      "analysis": {
        "framework_version": "v5",
        "updated_at": "2026-04-29",
        "scores": {
          "random": 7,
          "combo": 8,
          "pool": 7,
          "structure": 7
        },
        "qualitative": {
          "pool_base_desc": "卡牌池（约 N 待校核），按法力消耗分类，可通过升级解锁新卡",
          "pool_active_desc": "宝石与强化系统（自定义），单层修饰主体，缺明确双层结构信息",
          "random_design": "回合制抽牌 → 按法力从低到高依次出牌；第一人称视角下卡牌 UI 弹出，落位戏剧化弱",
          "show_topology": "1D_sequence",
          "put_form": "manual_place",
          "combo_synergy": "卡牌按法力顺序连锁触发，前序卡为后序卡叠加伤害/状态；牌型/效果字典 + 触发链",
          "combo_predicate": [
            "type_dict",
            "trigger_chain"
          ],
          "combo_modifier": "宝石强化全局修饰卡效果（如某类卡 +X 伤害、连锁额外触发）",
          "rpbd_construction": "地牢探索中拾取卡牌和宝石；遇到宝箱/事件节点扩充牌组；铲子等道具影响地图通路",
          "checkpoint_mechanism": "多层地牢血量爬塔，每层有敌人战斗 + boss；HP 归零 GG · 补充：M≈10（约 10 层地牢，估算）；N≈3（每层约 3 战）；T0≈30（首层敌人 HP 估算）；r≈1.3（层间血量爬塔）；m_boss≈2.0（层末 boss）。[全部估算待校核]"
        },
        "pressure_params": {
          "M": "10",
          "N": "3",
          "T0": "30",
          "r": "1.3",
          "m_boss": "2.0"
        },
        "summary": "总分 29（C 级），表演 7.5 / 结构 7.0，落在「多重集字典族」(0D_multiset × type_dict+trigger_chain)，叠加第一人称网格探索的装饰层。投影到 peglin，因卡牌战斗替代了弹球物理使 random 缺乏物理爆发而低 2 分；combo 连锁叠加略高于切骰但不及 Balatro 的指数倍率。第一人称地牢是题材创新但不构成装置层主导，结构性上限受卡牌单层池限制。"
      }
    },
    {
      "slug": "card-hog",
      "basic": {
        "name_cn": "Card Hog",
        "name_en": "Card Hog",
        "developer": "SnoutUp",
        "release_year": 2023,
        "steam_url": "https://store.steampowered.com/app/1163740/",
        "header_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1163740/header.jpg",
        "tags": [
          "装置类",
          "卡牌网格",
          "地牢爬行"
        ],
        "core_loop_oneliner": "100+ 卡牌构筑 + 网格地牢的回合制 combo 战斗"
      },
      "analysis": {
        "framework_version": "v5",
        "updated_at": "2026-04-29",
        "scores": {
          "random": 6,
          "combo": 7,
          "pool": 8,
          "structure": 7
        },
        "qualitative": {
          "pool_base_desc": "100+ 张卡牌池 · 每次进入地牢翻开网格中的卡牌（敌人/物品/陷阱/事件） · 卡牌按稀有度分级（普通/稀有/传说，待校核）",
          "pool_active_desc": "可收集的零件 + 卡牌升级 + 加入牌组的新卡牌；具体 Joker 类全局修饰道具数量未明示（约 30-50 待校核）",
          "random_design": "网格翻牌：每个地牢房间是若干卡牌组成的网格，玩家依次翻开；落位无加速度物理表演，类似翻牌而非 slot spin",
          "show_topology": "2D_grid",
          "put_form": "auto_place",
          "combo_synergy": "卡牌之间通过组合产生'惊喜效果'，相邻或同时存在的卡牌触发协同（如某些怪物+物品出现化学反应）；具体协同字典未在 Steam 文案展开",
          "combo_predicate": [
            "adjacency",
            "type_dict"
          ],
          "combo_modifier": "升级卡牌 + 获取的零件提供全局加成，作用于翻开后的产出（待校核具体倍率结构）",
          "rpbd_construction": "段间商店购买/升级卡牌、收集零件、调整牌组；多角色多模式提供构筑分支",
          "checkpoint_mechanism": "地牢分章节推进 + 多种 boss 关；失败 GG 进入下一周目；难度曲线由 boss 多样性提供 · 补充：M≈8（约 8 章节地牢，估算）；N≈3（每章约 3 房间）；T0≈20（首层敌人 HP 估算）；r≈1.2（线性递增）；m_boss≈1.5（章末 boss）。[全部估算待校核]"
        },
        "pressure_params": {
          "M": "8",
          "N": "3",
          "T0": "20",
          "r": "1.2",
          "m_boss": "1.5"
        },
        "summary": "总分 28（C 级），表演 6.5 / 结构 7.5，落在「网格邻接族」(2D_grid × adjacency+type_dict)。投影到 LBL，因装置是翻牌而非 slot 落位、且 pool 双层结构未明确，random 和 structure 均低 1-2 分。卡牌网格地牢的'惊喜组合'是核心爽点，但缺少 spin 表演的戏剧化峰值。"
      }
    },
    {
      "slug": "dice-tribes-ambitions",
      "basic": {
        "name_cn": "骰子部落：野心",
        "name_en": "Dice Tribes: Ambitions",
        "developer": "Sprouting Potato",
        "release_year": 2022,
        "steam_url": "https://store.steampowered.com/app/1965800/",
        "header_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1965800/header.jpg",
        "tags": [
          "装置类",
          "骰子",
          "工人放置"
        ],
        "core_loop_oneliner": "骰子工人放置 + 部落抱负的策略经营"
      },
      "analysis": {
        "framework_version": "v5",
        "updated_at": "2026-04-29",
        "scores": {
          "random": 6,
          "combo": 7,
          "pool": 7,
          "structure": 8
        },
        "qualitative": {
          "pool_base_desc": "起始少量村民（骰子工人）+ 多种工人类型；每回合骰子点数随机决定可用动作（数值 1-6 标准骰）",
          "pool_active_desc": "20+ 不同建筑结构（建造后提供持久增益）+ 多种 ambition 目标作为构筑方向",
          "random_design": "骰子投掷：每回合所有工人骰子重新投掷，玩家根据点数选择放置到建筑/动作槽；表演是数字弹跳，非物理爆发",
          "show_topology": "0D_multiset",
          "put_form": "manual_place",
          "combo_synergy": "工人放置类游戏：建筑之间产生资源链协同（A 建筑产 X，X 喂给 B 建筑产 Y），骰子点数与建筑槽位的匹配触发动作字典",
          "combo_predicate": [
            "type_dict",
            "threshold"
          ],
          "combo_modifier": "建筑/科技/ambition 提供全局规则修改（如某类骰子 +1 点、某资源 +50%）",
          "rpbd_construction": "每回合根据骰子结果决策：建造哪个建筑、放置哪个工人、走哪条 ambition；含 Draft 模式增加构筑限制",
          "checkpoint_mechanism": "ambition（目标达成）作为胜利条件 + 多种隐藏 ambition；回合数限制提供压力曲线 · 补充：M≈10（约 10 回合限制，估算）；N=1（每回合 1 投骰）；T0≈10（首回合资源目标估算）；r≈1.1（线性递增）；无明确 boss 关。[全部估算待校核]"
        },
        "pressure_params": {
          "M": "10",
          "N": "1",
          "T0": "10",
          "r": "1.1",
          "m_boss": null
        },
        "summary": "总分 28（C 级），表演 6.5 / 结构 7.5，落在「多重集字典族」(0D_multiset × type_dict+threshold)。投影到 dicey-dungeons / slice-and-dice，因部落经营深度和 ambition 多目标系统比纯战斗骰子更扎实，structure 高 1 分；但骰子表演结构性短板使 random/combo 卡在 6-7。96% 好评说明小众扎实但难破圈。"
      }
    },
    {
      "slug": "right-and-down",
      "basic": {
        "name_cn": "右与下",
        "name_en": "Right and Down",
        "developer": "mc2games",
        "release_year": 2022,
        "steam_url": "https://store.steampowered.com/app/2008050/",
        "header_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2008050/header.jpg",
        "tags": [
          "装置类",
          "卡牌",
          "极简双键"
        ],
        "core_loop_oneliner": "仅两键操作 + 卡牌构筑的 50 层地牢爬行"
      },
      "analysis": {
        "framework_version": "v5",
        "updated_at": "2026-04-29",
        "scores": {
          "random": 5,
          "combo": 6,
          "pool": 8,
          "structure": 8
        },
        "qualitative": {
          "pool_base_desc": "卡牌网格中的元素（敌人/金币/buff/陷阱）；玩家每回合只能向右或向下移动一格；'制胜之道无随机'宣言意味着布局可见、抽取确定",
          "pool_active_desc": "100+ 件神器（如'一路向下每回合 +5 金币'类条件触发型）",
          "random_design": "每层关卡布局是预生成（含一定随机播种），玩家用'右/下'两键移动 ; 装置层无 spin/翻牌的爆发表演；爽点在路径决策而非视觉随机",
          "show_topology": "2D_grid",
          "put_form": "manual_place",
          "combo_synergy": "路径选择上元素累加：触发某条件后神器产生加成（如连续向下、收集特定符号集合）",
          "combo_predicate": [
            "path",
            "chain"
          ],
          "combo_modifier": "100+ 神器作用于全局产出/触发条件，叠乘形成构筑（待校核具体叠乘公式）",
          "rpbd_construction": "段间在层间商店选神器/升级；解锁更多神器作为元进度",
          "checkpoint_mechanism": "9 个地牢 × 50 层结构，每个地牢引入新规则；失败回起点；boss 关作为章节末 · 补充：M=50（50 层）；N=1（每层 1 路径）；T0≈10（首层难度估算）；r≈1.05（线性递增）；m_boss≈1.3（章节末 boss 适度加强）。[T0 估算待校核]"
        },
        "pressure_params": {
          "M": "50",
          "N": "1",
          "T0": "10",
          "r": "1.05",
          "m_boss": "1.3"
        },
        "summary": "总分 27（C 级），表演 5.5 / 结构 8.0，落在「网格邻接族」边缘但更接近 path 极简（2D_grid × path+threshold）。投影到 slice-and-dice，因 50 层 9 地牢的递进结构和 100+ 神器使 pool/structure 高 1 分；但'两键玩法'和'无随机'宣言使 random/combo 显著低于切骰外的所有锚点——这是一款主打'纯策略'的反类型作品。"
      }
    },
    {
      "slug": "dog-and-goblin",
      "basic": {
        "name_cn": "狗与哥布林",
        "name_en": "Dog And Goblin",
        "developer": "Zony",
        "release_year": 2024,
        "steam_url": "https://store.steampowered.com/app/2666230/",
        "header_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2666230/header_schinese.jpg?t=1749176310",
        "tags": [
          "装置类",
          "slot",
          "自走棋融合"
        ],
        "core_loop_oneliner": "spin 随机出棋子位置 + 150 棋子 combo 自动战斗"
      },
      "analysis": {
        "framework_version": "v5",
        "updated_at": "2026-04-29",
        "scores": {
          "random": 8,
          "combo": 9,
          "pool": 8,
          "structure": 7
        },
        "qualitative": {
          "pool_base_desc": "150 棋子 · 19 种类（斗士/法师/野兽/恶魔等）· 含合成棋（哥布林+白银=哥布林商人，兽人步兵+狼=狼骑士）;稀有度梯度待校核",
          "pool_active_desc": "战斗前可获得物品/buff（如'肉'喂养野兽提升攻击）+ 阶段性遗物（数量待校核）",
          "random_design": "战斗准备阶段通过 slot/spin 式装置随机产出棋子到战场格位（用户确认）;落位伴随 slot 转动表演 0.7-1.5s,接近 LBL 节奏",
          "show_topology": "2D_grid",
          "put_form": "manual_place",
          "combo_synergy": "双层协同：(1) 类型字典——同种族/职业棋子达到阈值激活羁绊（斗士抗性/法师 AOE）;(2) 邻接——某些棋子（如猎人+野兽）相邻获得攻击加成;(3) 化学合成——特定棋子组合升级为新棋子",
          "combo_predicate": [
            "type_dict",
            "adjacency",
            "threshold"
          ],
          "combo_modifier": "buff 物品（肉/装备）作用于特定棋子类别;遗物提供全局倍率（待校核）",
          "rpbd_construction": "战斗间 reroll/选择保留棋子 + 物品商店 + 合成决策;多角色提供起手分支",
          "checkpoint_mechanism": "波次推进 + 自动战斗结算;失败 GG;具体 boss 关数和难度曲线待校核 · 补充：M≈10（约 10 波次，估算）；N=1（每波 1 spin 出棋）；T0≈30（首波敌人血量估算）；r≈1.3（波次推进）；m_boss≈1.5（boss 关加强）。[全部估算待校核]"
        },
        "pressure_params": {
          "M": "10",
          "N": "1",
          "T0": "30",
          "r": "1.3",
          "m_boss": "1.5"
        },
        "summary": "总分 32（A 级），表演 8.5 / 结构 7.5，落在「网格邻接族」(2D_grid × type_dict+adjacency+threshold) 与自走棋融合。投影到 LBL，因 slot 出位 + 自走棋羁绊字典的双判定让 combo 高 1 分（达 Balatro 级数字爆炸潜力），但 structure 因压力曲线/boss 设计不如 LBL 房租机制扎实而低 2-3 分。slot×自走棋的融合是该集群的设计创新点。"
      }
    },
    {
      "slug": "endgame-of-devil",
      "basic": {
        "name_cn": "魔王终局",
        "name_en": "Endgame of Devil",
        "developer": "MiniWhale",
        "release_year": 2023,
        "steam_url": "https://store.steampowered.com/app/2343600/",
        "header_url": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2343600/header_schinese.jpg?t=1771846080",
        "tags": [
          "装置类",
          "slot",
          "自走棋融合"
        ],
        "core_loop_oneliner": "spin 随机出棋子位置 + 240 随从一键自动战斗"
      },
      "analysis": {
        "framework_version": "v5",
        "updated_at": "2026-04-29",
        "scores": {
          "random": 8,
          "combo": 8,
          "pool": 7,
          "structure": 7
        },
        "qualitative": {
          "pool_base_desc": "240 种随从（极大池）· 战斗前随机出现到阵营槽位（用户确认 slot/spin 装置）· 稀有度梯度未明示;池规模接近轮盘英雄过载风险线",
          "pool_active_desc": "201 财宝 + 19 传奇财宝 + 13 难度财宝 = 233 道具池;通过击败冒险者后选择获得",
          "random_design": "战斗前 slot/spin 式装置随机产出随从到战场（用户确认）;一键自动战斗后结算;装置表演接近 LBL slot 节奏",
          "show_topology": "2D_grid",
          "put_form": "auto_place",
          "combo_synergy": "阵营协同——'相辅相成的强大阵容',通过随从类型组合触发羁绊（具体羁绊字典待校核）;一键自动战斗后展示连锁结算",
          "combo_predicate": [
            "type_dict",
            "adjacency"
          ],
          "combo_modifier": "201+ 财宝作用于全局：某类随从攻击 +N、回合开始触发 X 等;传奇财宝颠覆规则",
          "rpbd_construction": "战斗后选财宝（基于阵容） + 重新 spin 随从池（待校核 reroll 机制）;'魔王视角'反派叙事",
          "checkpoint_mechanism": "回合制：在限定回合内击败冒险者保住宝石;否则宝石被偷;每波冒险者强度递增 · 补充：M≈10（约 10 回合保护宝石期，估算）；N=1（每回合 1 spin 出随从）；T0≈30（首波冒险者强度估算）；r≈1.2（每波递增）；m_boss≈1.5（高难度冒险者 boss）。[全部估算待校核]"
        },
        "pressure_params": {
          "M": "10",
          "N": "1",
          "T0": "30",
          "r": "1.2",
          "m_boss": "1.5"
        },
        "summary": "总分 30（B 级），表演 8.0 / 结构 7.0，落在「网格邻接族」(2D_grid × type_dict+adjacency)。投影到 LBL，因 slot 装置使 random/combo 持平 LBL 锚点，但 pool 240+201 接近过载（参考轮盘英雄反例）使 pool 低 2 分;'保护宝石'回合制压力比房租温和，structure 低。slot×反派自走棋的题材独特，但池容量是隐忧。"
      }
    },
    {
      "slug": "dice-eight-poker-proposal",
      "basic": {
        "name_cn": "骰子德州·提案",
        "name_en": "Dice Eight Poker (Sample Design)",
        "developer": "R_RougeSlot · 提案作品",
        "release_year": null,
        "steam_url": "sample-designs/dice-eight-poker.html",
        "header_url": "",
        "tags": [
          "假设作品",
          "提案",
          "装置类",
          "骰子",
          "肉鸽",
          "修饰器构筑"
        ],
        "core_loop_oneliner": "掷 8 骰用德州扩展牌型计分，charms 乘性链滚雪球还债 · 首次填补 auto_set 结构性空类"
      },
      "is_proposal": true,
      "analysis": {
        "framework_version": "v5",
        "updated_at": "2026-05-13",
        "scores": {
          "random": 8,
          "combo": 9,
          "pool": 8,
          "structure": 9
        },
        "qualitative": {
          "pool_base_desc": "基础池 18 骰种（6 点数 × 3 颜色 R/G/B）；每局掷 8 颗骰子；颜色分布随机；骰盅+骰桌物理装置；点数与颜色双重 random，无稀有度梯度（所有骰均等概率）",
          "pool_active_desc": "主动池 150 charms（90 普 + 38 罕 + 18 史诗 + 4 传奇）；6 大类：① 点数概率（30）② 颜色概率（25）③ 牌型倍率（35）④ 结构改造（20）⑤ 触发链（20）⑥ 颠覆规则（20）；玩家可挂 5-8 装备槽，按位置 1→N 顺序触发",
          "random_design": "骰盅震动 → 倒出 8 颗骰子 → 在圆桌上滚动 1-2s → 落定后逐颗高亮（动画节奏匹配 Cloverpit）；点数和颜色同时随机产生戏剧化（VR 触发不可预测 + 视觉锁定明确）。v0.2 升级：combo1 结算时逐牌型顺序触发（800ms→150ms 速度递增）+ 贡献骰子金色高亮 + Web Audio 合成音效（Tier 1-5 频率/和弦递增）",
          "show_topology": "0D_multiset",
          "put_form": "auto_set",
          "combo_synergy": "德州扑克扩展牌型字典 24 种。v0.2 计分公式 4 乘性维度：单牌型得分 = Σ(组成骰子的价值 × 符号倍率) × 图形分 × 图形倍率。基础 4（对子/两对/三对/三条）+ 进阶 5（葫芦/顺子/同色对/同色组5/双葫芦）+ 中阶 4（四条/同色三条/大顺/同色组6）+ 高级 5（五条/同色顺子/同色四条/同色组7/六条/同色大顺）+ 传奇 4（全同色8/同色五条/七条/八条 figure_score 25-50）。符号价值表（决策 1A 按点数 6 档）：1-2 价值 2 / 3-4 价值 3 / 5 价值 5 / 6 价值 7（Cloverpit 同构）。1M 次 Monte Carlo 仿真：一对自然概率 100%（保底），五条 2.77%，六条 0.26%，八条 0.0006%（必须靠传奇 charm wild dice 达成）",
          "combo_predicate": [
            "type_dict"
          ],
          "combo_modifier": "150 charms 按位置 1→8 严格顺序触发乘性链。v0.2 起作用于 4 乘性维度的各通道：① 概率类（改 random 分布，如「幸运六」6 点 +50%）② 符号倍率类（如「6 点高徒」6 点 ×3，让高点价值进一步放大）③ 图形倍率类（如「葫芦升华」葫芦图形 ×3）④ 全局倍率（如「黄金骰盅」全局 ×1.5）+ 颠覆规则（百搭骰/牌型升档/无视破产等传奇）。倍率范围 ×1.2（普）→ ×50（传奇）",
          "rpbd_construction": "密室商店/抽卡获得新 charms；不动基础骰池（保持养概率纯粹）；跨局解锁系统提供元进展（新角色 / 新主题 / 新难度）",
          "checkpoint_mechanism": "6 周还债 checkpoint，每周 3 spin；T₀=100，r=2.0 指数递增；最终债务 ≈ 3200；未达标永久死亡 + 多结局叙事；推荐题材：东方占卜师 / 中式古风赌场（差异化 Cloverpit 西方恐怖路线） · 补充：M=6 / N=3 / T₀=100 / r=2.0 / 无显式 boss（最后一局做高强度收尾）"
        },
        "pressure_params": {
          "M": "6",
          "N": "3",
          "T0": "100",
          "r": "2.0",
          "m_boss": null
        },
        "summary": "【提案作品 · 非已发售】总分 34（A 级），表演 8.5 / 结构 8.5。设计指纹：[0D_multiset × auto_set × type_dict + multiplicative_chain]，**首次填补 v5 框架的 auto_set 结构性空类**（34 已分析样本无此格）。投影到锚点 Cloverpit + Aotenjo + Dice A Million 复合：继承 Cloverpit charms 乘性链 + 还债压力，但装置层换为骰盅+8 骰，判定层换为德州扑克扩展牌型 × 3 色花色。差异化 3 条：① 填空 auto_set ② 颜色花色 × 德州牌型扩大组合空间 ③ 骰盅物理戏剧化第一峰多巴胺。设计风险：30 牌型心智负担需教学渐进；自然 8 条概率 6/1M 必须靠传奇 charms。基于 1M Monte Carlo 仿真期望单局基础分 351 → 8 charms 乘性链放大 ×50-100 → 单局产出 17000-35000 匹配第 5-6 周还债额度（6400 → 19200）。"
      }
    }
  ]
}
;
