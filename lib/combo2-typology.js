/**
 * R_RougeSlot · combo2 修饰协同 typology（独立分析页专用）
 * --------------------------------------------------------------------
 * 由 combo2-modifier.html 独立加载。基于 34 款游戏的 combo_modifier
 * 自由文本归纳出 5 类机制，每款游戏标注 primary（必选）+ secondary（可选）。
 *
 * 注意：此 typology 不入 schema、不改框架版本号——是分析侧的约定。
 * 若 games.js 后续新增游戏，需要在 RR_COMBO2_TAGS 中追加对应 slug。
 */

window.RR_COMBO2_TYPES = [
  {
    key: 'multiplicative_chain',
    name: '乘性链爆发族',
    glyph: '✖',
    color: '#f87171',
    short: '乘性链',
    definition: '多个 ×N 修饰按位置/顺序串行累乘，单局产出指数爆炸',
    stacking: 'output = base × m₁ × m₂ × m₃ × … （位置/顺序敏感）',
    score_signature: '高分必要条件：avg 8.9，跨度 8–10',
    quote: 'Balatro：「再依次乘上每个乘性 Mult Joker，因此乘性 Joker 的位置和数量是构筑核心」'
  },
  {
    key: 'hybrid_addmult',
    name: '混合加乘族',
    glyph: '➕✖',
    color: '#a78bfa',
    short: '加→乘',
    definition: '先把所有加性修饰求和（+X），再乘上乘性修饰（×Y），分阶段结算',
    stacking: 'output = (base + Σaᵢ) × Πmⱼ （加乘分离，可控）',
    score_signature: '主流稳定派：avg 8.0，跨度 7–10',
    quote: '弹珠大亨：「先把所有加性 Boon 做加和，再按家族顺序乘上乘性 Boon，最后路径上的倍率器按弹珠经过顺序串行累乘」'
  },
  {
    key: 'additive_linear',
    name: '加性线性族',
    glyph: '➕',
    color: '#34d399',
    short: '纯加和',
    definition: '道具/装备只给固定 +X 数值或低 +Y%，多道具线性求和，无乘法链',
    stacking: 'output = base + Σaᵢ （线性，无指数）',
    score_signature: '浅但稳定：avg 6.9，跨度 5–8',
    quote: '切骰：「多装备并存按加法叠加，无指数倍率链」'
  },
  {
    key: 'rule_rewrite',
    name: '规则改写族',
    glyph: '🔀',
    color: '#fbbf24',
    short: '改逻辑',
    definition: '修饰改的不是数值而是结算逻辑——条件触发 / 棋面位置改写 / 物理规则变更',
    stacking: '非数值叠加：每条规则各自生效，可能与数值族复合',
    score_signature: '极少作 primary（仅 2 款），常作 secondary 与乘性/混合族复合',
    quote: '骰号玩家：「锻造工坊允许玩家定向编辑骰面（复制/删除）」'
  },
  {
    key: 'status_condition',
    name: '状态条件族',
    glyph: '🔥',
    color: '#60a5fa',
    short: '状态层',
    definition: '靠燃烧/冰冻/强化等状态层 + 条件触发提供修饰，没有倍率乘法链',
    stacking: '状态附加 + 条件判定（依赖触发丰富度而非倍数）',
    score_signature: '锚定 6–7：avg 6.8，跨度 6–7',
    quote: '骰子地下城：「状态主要是加减点数和状态附加，无倍率乘法链」'
  }
];

/**
 * 每款游戏的 combo2 类型标注（primary 必填，secondary 可选）。
 * 来源：分析 34 款 games.js 中的 combo_modifier 文本。
 * 维护：新增游戏时追加；修订分类时直接编辑。
 */
window.RR_COMBO2_TAGS = {
  'balatro':                  { primary: 'multiplicative_chain' },
  'ballionaire':              { primary: 'hybrid_addmult', secondary: 'rule_rewrite' },
  'aotenjo-infinite-hands':   { primary: 'multiplicative_chain' },
  'raccoin':                  { primary: 'multiplicative_chain' },
  'insider-trading':          { primary: 'multiplicative_chain' },
  'dog-and-goblin':           { primary: 'multiplicative_chain' },
  'cloverpit':                { primary: 'multiplicative_chain' },
  'endgame-of-devil':         { primary: 'multiplicative_chain' },

  'luck-be-a-landlord':       { primary: 'hybrid_addmult' },
  'peglin':                   { primary: 'hybrid_addmult', secondary: 'rule_rewrite' },
  'die-in-the-dungeon':       { primary: 'hybrid_addmult' },
  'bingo-betty':              { primary: 'hybrid_addmult' },
  'coin-push-rpg':            { primary: 'hybrid_addmult' },
  'luckland':                 { primary: 'hybrid_addmult', secondary: 'rule_rewrite' },
  'vampire-crawlers':         { primary: 'hybrid_addmult' },
  'astrea-six-sided-oracles': { primary: 'hybrid_addmult' },
  'roulette-hero':            { primary: 'hybrid_addmult' },

  'lucky-lord':               { primary: 'additive_linear' },
  'cat-god-ranch':            { primary: 'additive_linear' },
  'spinera':                  { primary: 'additive_linear' },
  'spin-hero':                { primary: 'additive_linear' },
  'lucky-hunter':             { primary: 'additive_linear' },
  'lucky-mayor':              { primary: 'additive_linear' },
  'card-hog':                 { primary: 'additive_linear' },
  'right-and-down':           { primary: 'additive_linear' },
  'slice-and-dice':           { primary: 'additive_linear' },
  'crop-rotation':            { primary: 'additive_linear' },

  'dice-player-one':          { primary: 'rule_rewrite', secondary: 'multiplicative_chain' },
  'dice-tribes-ambitions':    { primary: 'rule_rewrite', secondary: 'additive_linear' },

  'lucky-island':             { primary: 'status_condition' },
  'lucky-hero':               { primary: 'status_condition' },
  'bingle-bingle':            { primary: 'status_condition' },
  'die-shou-wei-cheng':       { primary: 'status_condition' },
  'dicey-dungeons':           { primary: 'status_condition' }
};
