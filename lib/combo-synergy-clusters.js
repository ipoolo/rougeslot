/* R_RougeSlot · combo_synergy 集群定义（v3 配套）
   ============================================================
   把 34 款样本按"舞台拓扑 × 协同判定"压成 8 个真实集群。
   方法论同源：framework/v3/method-cluster.md Step 5、scoring-rubric.md "v3 结构聚簇参考"。

   v3 字段重命名：q.combo_topology → q.show_topology（拓扑属于 random 阶段，不是 combo 属性）。

   每个集群对象：
     - id          : 唯一标识（用于 DOM 锚点）
     - name        : 中文集群名
     - glyph       : 单字符 emoji，用作视觉锚
     - pattern     : 形如 "2D_grid × adjacency" 的拓扑×判定标签
     - test(q)     : 给定一款游戏的 qualitative 对象，返回是否属于该集群
     - span        : combo 分跨度的诊断短语
     - color       : 主色（用于 chip / 卡片角标）
     - diagnosis   : 1-2 句钉点诊断（来自 scoring-rubric.md v3 结构聚簇参考）
     - empty_note  : 当本集群在数据中无成员时显示的说明

   规则：
     - 一款游戏从上往下找到第一个 match 的集群即归属该集群（main cluster）
     - 矩阵视图（5×8）则按每个 (topology, predicate) 二元组分别展示，所以一款游戏可能出现在多格里
*/
(function () {
  'use strict';

  const has = (arr, k) => Array.isArray(arr) && arr.includes(k);

  window.RR_COMBO_CLUSTERS = [
    {
      id: 'multiset_dict',
      name: '多重集字典族',
      glyph: '🃏',
      pattern: '0维 多重集 × 类型字典',
      test: (q) => q && q.show_topology === '0D_multiset' && has(q.combo_predicate, 'type_dict'),
      span: '5 – 10（高方差陷阱）',
      color: '#a78bfa',
      diagnosis: '跨度由"是否做指数倍率 / 字典深度"决定。Balatro/内幕交易用 mult 链拉到 10/9；切骰/骰子地下城没做爆炸掉到 5–6。新作若选此族，必须做指数倍率才有破圈机会。34 款扩展后该族成员稳定，是公式最容易复刻的"题材换皮 Balatro"赛道。'
    },
    {
      id: 'grid_adjacency',
      name: '网格邻接族',
      glyph: '🟦',
      pattern: '2维 离散网格 × 邻接',
      test: (q) => q && q.show_topology === '2D_grid' && has(q.combo_predicate, 'adjacency'),
      span: '7 – 9（下沿打开）',
      color: '#60a5fa',
      diagnosis: '12 款锚点期 LBL/地牢掷骰双双钉 8（"邻接加成线性可枚举，结构性上限 8"），但 34 款扩展后下沿被打开——幸运勇者/轮盘英雄 7 分（缺触发链），狗与哥布林 9 分（slot×自走棋融合 + 类型字典叠加）。新结论：网格邻接族是诊断系数最高的族，combo 跨度由"是否补 类型字典 + 触发链"决定。'
    },
    {
      id: 'grid_line',
      name: '网格连线族',
      glyph: '🟩',
      pattern: '2维 离散网格 × 连线',
      test: (q) => q && q.show_topology === '2D_grid' && has(q.combo_predicate, 'line_complete'),
      span: '7 – 8',
      color: '#34d399',
      diagnosis: '"几何段完成"判定族（行/列/对角线连完）。34 款扩展后含宾果贝蒂/帝国轮盘/四叶草深渊/拉杆英雄/幸运岛/死守危城/Card Hog/狗与哥布林/魔王终局/幸运大陆/幸运猎人——多数是 slot 老虎机连线赔付。累积型快感、峰值温和。'
    },
    {
      id: 'grid_threshold',
      name: '网格阈值族（slot 数量赔付）',
      glyph: '🎰',
      pattern: '2维 离散网格 × 阈值/类型字典（无连线无邻接）',
      test: (q) => q && q.show_topology === '2D_grid' && (has(q.combo_predicate, 'threshold') || has(q.combo_predicate, 'type_dict')),
      span: '7 – 8',
      color: '#06b6d4',
      diagnosis: '装置是 2 维网格 + 经典 slot 老虎机的"数量阈值/类型字典"判定（如 3 个相同图标即触发，无关连线/邻接）。34 款扩展后含拉杆英雄 / 幸运岛，是"slot 数量赔付"的子模式。'
    },
    {
      id: 'grid_path',
      name: '网格路径族',
      glyph: '🧭',
      pattern: '2维 离散网格 × 物理路径',
      test: (q) => q && q.show_topology === '2D_grid' && has(q.combo_predicate, 'path'),
      span: '5 – 6（极简策略）',
      color: '#ec4899',
      diagnosis: '玩家主动按方向序列在网格上走（物理路径）+ 神器条件触发（链式约束）。与物理弹珠的"被动路径"不同——"主动路径"靠玩家选路线触发。34 款扩展后含右与下，是"反类型纯策略"作品的代表。'
    },
    {
      id: 'ring_composite',
      name: '圆环复合族',
      glyph: '🎡',
      pattern: '1维 圆环 ×（邻接 + 类型字典）',
      test: (q) => q && q.show_topology === '1D_ring',
      span: '7（真·孤族）',
      color: '#fbbf24',
      diagnosis: '34 款扩展后这族实际上**只剩转啊转 Bingle Bingle 1 款**——之前归在此族的轮盘英雄 / 幸运勇者经玩家评测核实，主装置层都是 2 维网格（轮盘只是次级随机选择器），已迁移到网格邻接族。1 维圆环作为主装置层极罕见，钉死 7 分。'
    },
    {
      id: 'physical_path',
      name: '物理路径族',
      glyph: '🎯',
      pattern: '2维 连续物理 ×（物理路径 + 连锁反应）',
      test: (q) => q && q.show_topology === '2D_physical',
      span: '8 – 10（下限即 8）',
      color: '#f87171',
      diagnosis: '唯一下限就是 8 的族。物理过程本身就是协同表演，combo 自动 ≥ 8，天花板取决于物理引擎质量（弹珠大亨 10 = AAA 物理）。开发成本最高，但收益最稳。'
    }
    // 注：原"序列链式层（复合层）"集群在 34 款样本中无独立主装置成员（小丑牌 Joker 槽是叠加在多重集字典族之上的次级 1 维线序层）已删除
  ];

  /** 给一款游戏找到所属的主集群 */
  window.RR_findCluster = function (qualitative) {
    if (!qualitative) return null;
    for (const c of window.RR_COMBO_CLUSTERS) {
      if (c.test(qualitative)) return c;
    }
    return null;
  };

  /** "潜在设计空间" 提示 —— 用于 5×8 矩阵的空格 hover */
  window.RR_DESIGN_SPACE_HINTS = {
    '1D_ring|trigger_chain':       '轮盘指针落位激活相邻槽位的连锁倍率，能把轮盘从 7 拉到 8–9',
    '2D_grid|cascade':             '网格 + 多米诺爆炸，把消除游戏的链式爆发放进 RPB 框架',
    '0D_multiset|cascade':         '抽到的牌触发连锁字典查询，把"触发链"机制从 1 维线序推回 0 维多重集',
    '2D_physical|type_dict':       '物理浮点坐标按字典分类损失信息，可行性低',
    '1D_sequence|adjacency':       '序列上的相邻位置触发，多见于扫雷类，但 RPB 装置框架内待开发',
    '1D_ring|cascade':             '圆环上的连锁反应——指针落位引爆整圈某花色',
    '2D_grid|trigger_chain':       '网格上从指定起点触发的链式倍率累乘'
  };

  /** 先验游戏映射：每款 R_RougeSlot 游戏 → 它的现实/桌游/街机原型
      用户给的样例：小丑牌→德州扑克 / 幸运房东→slot / 吸血鬼爬行者→UNO
      用法：在协同结构 tab 末尾按"先验原型"做二次聚类，让玩家一眼看出"这游戏其实就是 X 加了 RPB 外壳" */
  window.RR_PRIOR_GAME_CLUSTERS = [
    {
      id: 'slot',
      name: 'slot 老虎机',
      glyph: '🎰',
      description: '旋转转轴 → 符号落位 → 连线/数量赔付。现代 slot RPB 的最大族。',
      members: [
        'luck-be-a-landlord',  // 幸运房东 = LBL slot 标杆
        'spinera',             // 帝国轮盘
        'spin-hero',           // 拉杆英雄
        'cloverpit',           // 四叶草深渊
        'die-shou-wei-cheng',  // 死守危城（slot + 塔防）
        'lucky-island',        // 幸运岛
        'lucky-hero',          // 幸运勇者（命运转盘 + 4×5 老虎机）
        'luckland',            // 幸运大陆（旋转棋盘）
        'roulette-hero'        // 轮盘英雄（命运转盘 + 6×4 网格）
      ]
    },
    {
      id: 'yahtzee',
      name: 'Yahtzee 骰子',
      glyph: '🎲',
      description: '一次性摇 N 颗骰子 → 骰面图标对应字典 → 选用/重投。骰子 RPB 的经典原型。',
      members: [
        'slice-and-dice',         // 切骰（5 骰队伍）
        'dicey-dungeons',         // 骰子地下城
        'astrea-six-sided-oracles', // 六面神谕
        'dice-player-one',        // 骰号玩家
        'dice-tribes-ambitions'   // 骰子部落（dice 工人放置桌游）
      ]
    },
    {
      id: 'coin_pusher',
      name: '推币机 Coin Pusher',
      glyph: '🪙',
      description: '物理推币机街机原型 → 投币 → 物理碰撞 + 边缘掉落。',
      members: [
        'raccoin',         // 浣熊推币机
        'coin-push-rpg',   // 推币勇者
        'lucky-lord'       // 幸运领主（推币 + slot + 卡牌）
      ]
    },
    {
      id: 'pinball',
      name: '弹珠台 Pinball / Pachinko',
      glyph: '🎯',
      description: 'Plinko / Peggle / Pachinko 物理弹球原型 → 球落物理碰撞钉子。',
      members: [
        'ballionaire', // 弹珠大亨
        'peglin'       // 哥布林弹球
      ]
    },
    {
      id: 'poker',
      name: '德州扑克 / 牌型构筑',
      glyph: '🃏',
      description: '抽 N 张评估牌型（同花/对子/顺子）+ 倍率链 → 数字爆炸。',
      members: [
        'balatro',         // 小丑牌
        'insider-trading'  // 内幕交易（披着华尔街外衣的 Balatro）
      ]
    },
    {
      id: 'mahjong',
      name: '麻将',
      glyph: '🀄',
      description: '摸打凑牌 + 番数字典叠加 → 指数倍率。',
      members: ['aotenjo-infinite-hands']  // 青天井
    },
    {
      id: 'bingo',
      name: '宾果 Bingo',
      glyph: '🎟',
      description: '5×5 卡 + 摇号 + 行/列/对角线连完 → 累积赢分。',
      members: ['bingo-betty']  // 宾果贝蒂
    },
    {
      id: 'roulette',
      name: '轮盘赌 Roulette',
      glyph: '🎡',
      description: '圆环 + 球 + 押注 → 真正的 1D 圆环主装置。',
      members: ['bingle-bingle']  // 转啊转 Bingle Bingle
    },
    {
      id: 'card_combat',
      name: 'UNO / 卡牌战斗',
      glyph: '♠',
      description: '抽牌 + 出牌链 + 触发链。卡牌战斗的经典原型（含 UNO 链式约束、StS 法力链）。',
      members: [
        'vampire-crawlers',  // 吸血鬼爬行者（按法力出牌 + 连锁）
        'card-hog'           // Card Hog（卡牌网格地牢）
      ]
    },
    {
      id: 'puzzle_2key',
      name: '双键解谜（Threes / 2048 类）',
      glyph: '🧱',
      description: '只用 2 键移动 + 路径累加 → 反类型纯策略。',
      members: ['right-and-down']  // 右与下
    },
    {
      id: 'autochess',
      name: '自走棋 Auto Chess',
      glyph: '♟',
      description: '棋子摆位自动战斗 + 阵容协同 + 商店刷新。slot 出位是这族的"装置化变体"。',
      members: [
        'dog-and-goblin',  // 狗与哥布林（slot + 自走棋）
        'endgame-of-devil', // 魔王终局（slot + 自走棋）
        'lucky-hunter'      // 幸运猎人（三消合并 + 自走棋）
      ]
    },
    {
      id: 'drafting_farm',
      name: '轮抽卡牌经营（Drafting）',
      glyph: '🌾',
      description: '"Drafting 轮抽" = 从公共池/商店里"三选一"挑卡进自己牌组（类似桌游《Dominion 皇舆争霸》《7 Wonders》《MTG 轮抽》的核心机制）。每段加新卡 → 自动结算产出 → 凑目标分。这族的特点是"玩家完全失去 spin 阶段操作"，全靠 RPBD 阶段的牌组优化。',
      members: [
        'crop-rotation',  // 轮作法
        'cat-god-ranch',  // 猫神牧场
        'lucky-mayor'     // 幸运市长（城市管理）
      ]
    },
    {
      id: 'dnd_board',
      name: '棋盘 + 骰子（D&D 桌游）',
      glyph: '🗺',
      description: '骰子集合 + 网格放置 + 邻接加成。Dicey Dungeons 之外的"装置化"骰子。',
      members: ['die-in-the-dungeon']  // 地牢掷骰（3×3 棋盘 + 骰子）
    }
  ];

  /** 给 slug 找先验游戏聚类 */
  window.RR_findPriorGame = function (slug) {
    if (!Array.isArray(window.RR_PRIOR_GAME_CLUSTERS)) return null;
    for (const c of window.RR_PRIOR_GAME_CLUSTERS) {
      if (c.members.includes(slug)) return c;
    }
    return null;
  };
})();
