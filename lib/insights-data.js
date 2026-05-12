/* R_RougeSlot · 核心洞察数据（v3 配套）
   ====================================================================
   "🧠 核心洞察" tab 的全部内容数据。
   - structuralFacts: 5 条品类结构性事实（基于 34 款样本归纳）
   - path1Clusters: 路径 1 · 4 个 R+C1 集群的 C2/pool 优化空间分析（Agent A 调研）
   - path2Priors: 路径 2 · 8 个潜在先验的严谨研究（Agent B 调研）
   - reverseWarnings: 反向警告（数据观察 + 假设性解释 + 反例可能性）
   - openQuestions: 开放讨论问题（不给答案）
*/
(function () {
  'use strict';

  window.RR_INSIGHTS_DATA = {

    /* ====================== 区块 ① · 5 条结构性事实 ====================== */
    structuralFacts: [
      {
        id: 'topo_caps_random',
        icon: '✦',
        title: '拓扑决定 random 评分上限',
        evidence: '34 款里 random ≥ 9 的 3 款（弹珠大亨 10 / 哥布林弹球 9 / 浣熊推币机 9）全部用 2D 物理拓扑；random ≤ 6 的 7 款全是 0D 多重集（骰子族）+ 双键解谜；2D 网格的 random 集中在 7-8（无 9 例）。',
        mechanism: 'random 评分本质衡量"装置落位的视觉戏剧化"。物理引擎天生提供轨迹随机 + 碰撞反馈 + 持续时长（0.5-3s），是数字翻动 / 卡牌翻面无法替代的。骰子族数字直显（< 0.5s）让玩家"只看到结果，没看到过程"，结构性卡 5-7。',
        implication: '<b>选拓扑就锁定 random 上限</b>。如果你的题材必须用骰子（如 D&D），random 不可能 ≥ 7，必须用 combo / pool 补总分（青天井就是这条路：random 7 + combo 9 + pool 8 + structure 8 = 32）。如果你想要 random ≥ 9，唯一路径是 2D 物理 —— 但物理引擎是 AAA 级开发成本。',
        thought: '为什么 2D 网格的 random 上限是 8？是机械落位的天花板，还是没人做出"网格拓扑下的物理感"？'
      },
      {
        id: 'chain_breaks_combo8',
        icon: '✦',
        title: 'trigger_chain / cascade 是 combo 破 9 的必要条件',
        evidence: '34 款里 combo ≥ 9 的 6 款（小丑牌 10 / 弹珠大亨 10 / 青天井 9 / 浣熊推币机 9 / 内幕交易 9 / 狗与哥布林 9）的 combo_predicate 全部含 trigger_chain 或 cascade。combo = 8 的 12 款里只有 path+cascade（哥布林弹球 / 推币勇者 / 幸运领主）能保留这个组合，邻接族 / 阈值族 / 类型字典族都没破 9。',
        mechanism: 'combo 评分的本质是"数字膨胀有没有指数感"。加性 +Mult / +Chips 最多到 8（线性叠加可枚举）；乘性 ×Mult 链 + 物理连锁是唯一的指数源。狗与哥布林是个例外（combo=9 但没 cascade，靠"slot×自走棋融合 + 类型字典叠加"突破），但需要多重判定叠加才行。',
        implication: '<b>选 combo_predicate 就锁定 combo 上限</b>。仅有"邻接 + 阈值 + 类型字典"的设计，combo 天花板就是 8。要破 9，必须额外引入触发链或连锁反应判定 —— 不能仅靠"加更多元素 + 更多稀有度"提升数字感。',
        thought: '邻接判定本身能否产生触发链？比如"邻接 ⚡ 触发后，被电到的格子也变成 ⚡，邻接传染"——这是邻接 + cascade 的混合，34 款里 0 例。'
      },
      {
        id: 'doublepool_caps_pool9',
        icon: '✦',
        title: '双层池 = pool ≥ 9 的必要条件（5/5 命中）',
        evidence: '34 款里 pool ≥ 9 的 5 款（幸运房东 / 小丑牌 / 骰号玩家 / 幸运市长 / 内幕交易）全部是清晰的双层池架构（基础池 30-300 + 主动池 50-150）。pool = 8 的 15 款里有大量"单层包池"（哥布林弹球 / 青天井 / 宾果贝蒂等）和"空间布局池"（弹珠大亨 / 地牢掷骰），都未做到双层独立演化。',
        mechanism: '双层池让"基础池保底 + 主动池颠覆"形成纵深 —— 玩家学会基础池后才学主动池，两层各自有稀有度梯度，重玩性指数增长。单层包池只能靠稀有度梯度撑深度，构筑路线受限于一组元素。',
        implication: '<b>MVP 用"双层池 + 目标分"公式 —— 34 款里 5/5 款 9 分游戏都是双层池</b>。题材跨度极大（卡牌 / slot / 骰子 / 城市经营都能撑双层 9），证明双层池不是某个题材的特性，而是设计原则。',
        thought: '空间布局池（弹珠大亨 trinket 摆位）能否升级到双层池？目前是"trinket = 基础 + 主动合一"，如果拆出"trinket 池 + Boon 修饰池"两层独立，pool 会从 8 涨到 9 吗？'
      },
      {
        id: 'targetscore_caps_struct9',
        icon: '✦',
        title: '目标分数族 = structure ≥ 9 的必要条件（3/3 命中）',
        evidence: '34 款里 structure ≥ 9 的 3 款（幸运房东 10 / 小丑牌 9 / 四叶草深渊 9）全部是"目标分数族"——一个具体数字作为失败点（房租 / Blind 目标分 / 还债额度），且压力指数膨胀。structure = 7-8 的 31 款里有血量爬塔（哥布林弹球 / 切骰）/ 限时连完（青天井）/ 资源平衡（六面神谕），都未达 9。',
        mechanism: '"一个数字 = 一个失败点"是最直接的紧张感来源 —— 玩家不需要解读复杂状态，只需对比"我的产出 vs 目标"。指数膨胀的目标分（5 → 10 → 20 → ... 翻倍递增）让每关都是新的紧张峰值，而不是线性磨血条。',
        implication: '<b>想拿 structure 9-10，第一选择是"还债 / 房租 / Blind 目标分"型机制</b>。血量爬塔最高只能到 8，且需要 boss 多样性 + 敌人字典维持 7-8。波次推进 / 资源平衡 = 17 款挤一档 7 分，证明这族最难调。',
        thought: '"还债指数 + 永久死亡 + 恐怖叙事"（四叶草深渊）是 LBL 房租机制的当代变体——这种"叙事化的目标分"是结构创新还是 polish？能否系统化？'
      },
      {
        id: 'topo_eq_theme',
        icon: '✦',
        title: '拓扑 ↔ 先验高度耦合（选拓扑 = 选题材家族）',
        evidence: '13 个先验聚类里，11 个先验只占据 1 种拓扑（slot 必 2D 网格 / 骰子必 0D 多重集 / 推币 / 弹珠必 2D 物理）。仅 2 个先验跨拓扑：UNO 卡牌战斗（吸血鬼 0D + Card Hog 2D）和 轮抽经营（猫神 / 轮作 2D + 幸运市长 0D）。',
        mechanism: '"先验玩法"是现实中已验证的玩家认知模式 —— slot 玩家天然期待"转动→连线"（2D 网格）；骰子玩家期待"摇骰→读字典"（0D 多重集）。拓扑是这种认知的几何投影，强行错配会造成玩家学习负担（"为什么这个 slot 要看邻接？"）。',
        implication: '<b>选拓扑前先选题材，反之亦然 —— 两者高度共变</b>。如果你的题材是赛车，拓扑必然是 1D 线序（赛道）；强行做成 2D 网格的赛车只会让玩家困惑。设计阶段第一个决策不是"我用什么拓扑"，而是"我的玩法原型是什么"。',
        thought: '"跨拓扑先验"（UNO / 轮抽）共有的特点 —— 它们的现实原型本来就有多种变体（UNO 既能在桌上多重集打也能在网格打）。这是不是一个识别"灵活先验"的信号？'
      }
    ],

    /* ====================== 区块 ② · 路径 1 · 4 个 R+C1 集群细读 ====================== */
    /* 来源：Agent A 调研 22 款 × 4 个 qualitative 字段（combo_synergy / combo_modifier / pool_base_desc / pool_active_desc）*/
    path1Clusters: [
      {
        id: 'multiset_dict_chain',
        glyph: '🃏',
        name: '多重集字典族 + 触发链',
        pattern: '0D_multiset × type_dict + trigger_chain',
        members: ['balatro', 'insider-trading'],
        verifiedMaxTotal: 35,
        oneLiner: 'Balatro 公式 —— 抽 N 选 M + 牌型字典 + 倍率链。题材换皮成本最低，C2 优化空间在"破坏型 modifier"和"判定字典玩家可写"。',
        c2Done: [
          '加性 +Chips / +Mult（balatro Joker 提供 +30 Chips/+8 Mult；insider-trading 药丸"某类卡 +X% 收益"）',
          '乘性 ×Mult 倍率链（balatro：乘性 Joker 是"最稀缺最关键的爆炸源"；insider-trading 连击系统"倍率累乘"）',
          '条件触发型修饰（balatro："手中 6 张以上"/"剩余出牌数 ≤1"/"当前手是同花"）',
          '全局规则改写型（balatro："每张牌额外触发一次"/"第一张牌算两次"/"所有花色视作同花"）',
          '玩家手动调度触发顺序（balatro Joker 槽可拖动；insider-trading 出牌顺序影响倍率）',
          '跨局元进展（balatro 凭证 vouchers）',
          '可堆叠的全局百分比修饰（insider-trading 60+ 药丸"非线性产出"）'
        ],
        c2Undone: [
          '<b>判定字典玩家可写</b> —— 两款都允许 Joker 改写"同花"语义（balatro），但没让玩家"新增一种自定义牌型"或"调换牌型 mult 基底"；牌型字典是只读的',
          '<b>破坏型 / 反向修饰</b> —— modifier 几乎全是"加分"方向，没有"主动消耗 / 销毁手牌换取大幅倍率"的赌博性 modifier 类目',
          '<b>modifier 自我演化路径</b> —— Joker 一旦获得几乎永久生效，缺乏"每用一次 -1 充能、归零后转化为更强稀有版本"',
          '<b>面向"未触发"的负向 modifier</b> —— 没有"本手没触发某条件就 +Mult"（防御型 / 反向触发链）',
          '<b>modifier 的位置感知扩展</b> —— Joker 槽位置只决定结算顺序，没有"第 1 槽与第 5 槽 Joker 是同名时获得 ×3"这类槽位拓扑'
        ],
        poolDone: [
          '基础池容量与稀有度梯度（balatro 52 张 + 改造卡/封印 4 类；insider-trading 120+）',
          '基础池可加 / 删 / 复制（balatro 单局 40-70 张可控）',
          '主动池显式四档稀有度（balatro 白/绿/红/紫）',
          '主动池显式分类（balatro 6 类：Joker / 塔罗 / 行星 / 灵气 / 凭证 / 牌包）',
          '主动池可主动卖出（balatro 手动售出换金币）',
          '槽位限制（balatro Joker 槽 5 格是核心稀缺资源）',
          '通过开包获取（balatro 牌包是基础池与主动池共用通道）'
        ],
        poolUndone: [
          '<b>基础池"垂直进化"</b> —— 改造卡只切换 4-5 种类型，没做"樱桃 → 黄金樱桃 → 钻石樱桃"的纵向升级阶梯',
          '<b>主动池槽位"类型限定"</b> —— 5 个 Joker 槽对所有 Joker 同质，没有"稀有槽 / 触发槽 / 倍率槽"的语义分化',
          '<b>主动池"组合解锁"获取通道</b> —— 没有"集齐 3 件低稀有合成 1 件高稀有"的炼成通道',
          '<b>基础池与主动池的"流动转换"</b> —— 两层完全分离，没有"烧 1 张牌换 1 个 Joker 槽"的可逆通道',
          '<b>主动池的"共生约束"</b> —— 全是独立加性体，没有"某 Joker 必须与另一类同时存在才生效"的拓扑约束'
        ],
        themeRecommendations: [
          {
            theme: '医疗诊断（症状 → 诊断牌型 → 处方 modifier）',
            mapping: '基础池 = 症状卡（咳嗽/发热/皮疹/罕见症状如紫癜，含改造态：急性/慢性/伴并发症）；random = 每回合从病历库抽 8 张到手；combo1 = 诊断牌型字典（"三高"="高血压+高血糖+高血脂" → 综合征 ×Mult）+ 触发链按医生写病历顺序结算；combo2 = 处方 / 检查项目（药物 +X% 病情控制、CT 报告改写诊断字典）',
            fillsGap: '玩家可主动"确诊一个新病"即新增牌型字典条目（c2_undone #1 玩家可写字典）；放化疗 modifier 是破坏型（c2_undone #2 赌博方向）；症状卡可"转阳/转阴"流入流出诊断池（pool_undone #4 流动转换）'
          },
          {
            theme: '刑侦审讯（线索 → 罪名牌型 → 审讯技巧 modifier）',
            mapping: '基础池 = 线索卡（凶器/动机/不在场证明/微量物证，含矛盾态：可信/伪证/反转）；random = 每回合从证据库抽 N 张；combo1 = 罪名牌型（"凶器+动机+现场" = 故意杀人；"伪证+反转+证人" = 共谋）+ 起诉书顺序触发链；combo2 = 审讯技巧 Joker（疲劳轰炸 → 反转线索 ×2；拷打 → 销毁 1 线索换全场 +Mult）',
            fillsGap: '拷打/逼供 = 破坏型 modifier（c2_undone #2）；"本案没用证人证言反而 +Mult" = 反向触发链（c2_undone #4）；好警察必须搭配坏警察 = Joker 拓扑约束（pool_undone #5 共生约束）'
          },
          {
            theme: '古籍修复 / 考据学（残卷 → 文本互证 → 考据派别 modifier）',
            mapping: '基础池 = 残卷碎片（甲骨/竹简/敦煌写本，按断代/字体/出处分类，含改造态：墨迹清晰 / 蠹蚀 / 伪作）；random = 每回合从书库抽 N 张；combo1 = 考据牌型（"三家注合参" = 三本相同段落不同版本；"通假字链" = 字形相通的字串触发链）；combo2 = 考据派别 Joker（朴学派 → 加性；今文派 → 乘性；疑古派 → 销毁 1 张换 +Mult）',
            fillsGap: 'endgame 自定义新牌型加入字典（c2_undone #1）；残卷"相邻同断代时 ×3" = 槽位拓扑（c2_undone #5）；残卷可纵向升级残片→缀合本→善本→孤本（pool_undone #1 垂直进化）'
          }
        ]
      },
      {
        id: 'physical_path',
        glyph: '🎯',
        name: '物理路径族',
        pattern: '2D_physical × path + cascade',
        members: ['ballionaire', 'peglin', 'raccoin', 'coin-push-rpg', 'lucky-lord'],
        verifiedMaxTotal: 35,
        oneLiner: '弹珠 / 推币物理引擎家族。combo 自动 ≥ 8，C2 优化空间在"路径长度阶梯"和"modifier 实体化进入物理空间"。',
        c2Done: [
          '家族 / 类型乘性倍率（ballionaire"金币 ×2"/"水果 ×2"；peglin"Crit 伤害 +50%"；raccoin"动物币 ×2"）',
          '加性 +N 产出（ballionaire"每经过一次倍率器 +0.5"；peglin"+1 命中伤害"）',
          '条件 / 局部触发改写（ballionaire"弹珠落入底洞时全场翻倍"；raccoin"被引爆的硬币再次结算"）',
          '物理参数修饰（ballionaire"弹珠多 1 次反弹机会"/"发射角度可控"；peglin"反弹后伤害 +25%"/"木钉变石钉"）',
          '状态附加 / DOT（peglin 燃烧 / 毒；coin-push-rpg buff 词条）',
          '数量层修饰（peglin"每次发射多 1 颗 Orb"；coin-push-rpg 编队站位影响触发频率）',
          '局部强化镀膜（raccoin plating +50% 价值，与全局乘数叠加）',
          '跨局元进展（lucky-lord 锻造武器；coin-push-rpg 260+ 天赋）'
        ],
        c2Undone: [
          '<b>路径长度阈值奖励</b> —— 5 款都用"撞了多少次"算产出，没把"路径长度 ≥ N 解锁阶梯倍率"做成显式 modifier（如"连续命中 ≥20 钉触发暴击潮"），现状是连续型增长无阶梯',
          '<b>路径回放 / 时间倒带</b> —— 弹珠落下结果即定，没有"本次路径不满意 → 用 1 资源回放 / 重投"',
          '<b>路径"记忆"与跨弹珠继承</b> —— 每次发射独立，没有"上一颗经过的格子，本颗经过时 ×2"',
          '<b>玩家对物理参数的主动调度</b> —— 只 ballionaire 给了角度可控；其他 4 款物理过程不可干预，缺"弹珠中途变向 / 减速 / 分裂"主动技能',
          '<b>障碍物 / 负值格的策略价值</b> —— 都把负面元素做边缘化，没有"故意制造障碍物→反弹更多次→更长路径" 反向构筑'
        ],
        poolDone: [
          '基础池规模公开（ballionaire 145+ Triggers；peglin 70+ Orb；raccoin 150 硬币；lucky-lord 150+ 卡 + 60+ 英雄）',
          '主动池规模公开（ballionaire 55+ Boons；peglin 100+ Relic；raccoin 150 power-up；coin-push-rpg 100+ 装备 + 260+ 天赋）',
          '基础池家族 / 类型分类（ballionaire 金币/水果/动物家族；peglin 攻击/Crit/效果/稀有）',
          '主动池稀有度梯度（peglin 普/非/稀/传四档）',
          '主动池获取通道多样（peglin Boss 必给 + 商店 + 事件 + 宝箱）',
          '角色化的初始构筑差异（raccoin 6 角色专属硬币；lucky-lord 6 种领主开局）',
          '局部修饰层（raccoin plating 给某币镀膜，与全局乘数分层）'
        ],
        poolUndone: [
          '<b>基础池元素的"空间属性"被纳入构筑</b> —— 只标榜"数值 / 触发规则"，没有"此硬币的物理重量 / 弹性 / 摩擦系数"做成池属性供选择',
          '<b>基础池的"消耗 / 损耗"机制</b> —— 放上去几乎永久存在，缺"用 N 次后磨损降级"纵深',
          '<b>主动池"物理布局型"修饰器</b> —— Boons/Relic 全是"数值乘数 / 规则改写"，没有"此 Boon 是一块板子，发射时挂在指定位置"的"modifier 实体化进入物理空间"',
          '<b>基础池与主动池的"流动转换"</b> —— 两层完全分离，缺"熔铸 3 个普通硬币 → 1 件 power-up"的纵向合成',
          '<b>临时禁用 / 暂时移除主动池</b> —— Boon/Relic 一旦获得就持续生效，缺"本回合主动停用某 Boon 换得一次性大爆发"的临时调度'
        ],
        themeRecommendations: [
          {
            theme: '古代水利 / 都江堰式分水（水流路径 + 闸门 cascade）',
            mapping: '基础池 = 河道砖块（窄河 / 急流 / 沉沙池 / 鱼嘴分水石 / 龙骨水车），玩家在 RPBD 阶段铺到等高线网格上；random = 每 turn 上游放下 N 桶水；combo1 = path（水按重力沿河道流过每一格触发产出）+ cascade（鱼嘴分水石让水分两路同时下游连锁）；combo2 = "水神祭祀"Boon 是一块加宽河道的板子，必须实体化挂到河道某段',
            fillsGap: '玩家闸门主动开关 = 主动调度物理参数（c2_undone #4）；沉沙池故意截流→水位累积→爆发释放（c2_undone #5 障碍物策略价值）；水神 Boon = 实体板子放进物理空间（pool_undone #3）'
          },
          {
            theme: '地下管道 / 化工炼制（流体路径 + 反应釜 cascade）',
            mapping: '基础池 = 管段砖（直管 / 弯管 / T 形分流 / 反应釜 / 冷凝器）；random = 每 turn 注入 N 单位原料（甲烷 / 苯 / 硫酸）；combo1 = 流体沿管道路径触发反应釜（path），反应釜产物又注入下游管道（cascade，可形成自反馈环路）；combo2 = 催化剂 Boon（Pt 催化 → 反应速率 ×3）+ 工程师天赋 + 管段磨损机制',
            fillsGap: '反应釜的"记忆"：上一波副产物是本波催化剂（c2_undone #3 跨弹珠继承）；管段磨损降级（pool_undone #2 消耗机制）；3 个普通管段 → 1 件高级反应釜（pool_undone #4 纵向合成）'
          },
          {
            theme: '登山 / 高山探险（登山者沿绳路径 + 滚石 cascade）',
            mapping: '基础池 = 山体地形砖（雪原 / 冰裂缝 / 岩壁 / 营地 / 风口），构筑成一座垂直山体；random = 每 turn 派 1 名登山者从底端出发，路径由地形决定（自动寻路 + 物理摔落）；combo1 = 登山者路径触发每个营地补给（path），冰裂缝塌陷连锁触发滚石（cascade，反向砸下）；combo2 = 装备 Boon（氧气瓶 +2 体力 / 冰镐让岩壁路径多 1 段）+ 路径回放机制',
            fillsGap: '登顶高度 ≥4000m / 6000m / 8000m 阶梯倍率（c2_undone #1 路径长度阶梯）；重新规划路线 = 路径回放（c2_undone #2）；高反期主动"忽略某件装备"换冲顶爆发（pool_undone #5 临时调度）'
          }
        ]
      },
      {
        id: 'grid_adjacency',
        glyph: '🟦',
        name: '网格邻接族',
        pattern: '2D_grid × adjacency',
        members: ['luck-be-a-landlord', 'die-in-the-dungeon', 'luckland', 'lucky-hero', 'crop-rotation', 'cat-god-ranch', 'lucky-hunter', 'card-hog', 'dog-and-goblin', 'endgame-of-devil', 'roulette-hero'],
        verifiedMaxTotal: 35,
        oneLiner: '34 款最大族（11 款）。已被深度开发，但"邻接关系本身（边）作为可购买对象"是 11 款全集都缺的设计空白。',
        c2Done: [
          '邻接加成 / 邻接放大（LBL"3 樱桃 → 丰收"；地牢掷骰"攻骰邻接攻骰 +1"；roulette-hero 邻位带动；dog-and-goblin"猎人+野兽相邻 +攻击"）',
          '类型字典触发（cat-god-ranch 食物链 + 7 大家族；dog-and-goblin 19 种类羁绊；endgame-of-devil 阵营羁绊）',
          '全局倍率类道具（LBL"水果 +50%"/"每个 ⭐ ×2"；roulette-hero"狼伤害 ×2"；endgame-of-devil 201+ 财宝）',
          '局部范围修饰（地牢掷骰"中心格 ×2"；luckland 区域棋子主题协同）',
          '三消 / 合成升级（lucky-hunter 三同名合成；dog-and-goblin"哥布林+白银=哥布林商人"）',
          '阈值触发（LBL 3 同种 → 丰收；dog-and-goblin 阈值激活羁绊）',
          '一次性消耗品（地牢掷骰 36 potions；lucky-hero 30+ 主动技能）',
          '邻接元规则放大（地牢掷骰 relic："邻接加成 +1"，直接修饰 predicate 强度）'
        ],
        c2Undone: [
          '<b>邻接关系（边）作为可购买对象</b> —— 11 款全部修饰节点（symbol/dice/coin），无任何 modifier 把"格 A 与格 B 的连线"做成实体（如"在 (2,3) 与 (3,3) 之间放置一根金线，使这条边的邻接加成 ×2"）。"边 modifier"整片缺失',
          '<b>邻接的"方向性"</b> —— 11 款邻接全是无向（A 邻 B = B 邻 A，加成对称），没有"有向邻接"（A 在 B 左侧时 +5，A 在 B 右侧时 -3）',
          '<b>网格几何 / 形状本身可被改写</b> —— 棋盘尺寸基本固定，没有"modifier：本局棋盘变成六边形 / L 形 / 加一行 +1 列"的几何级 modifier',
          '<b>邻接的"排他性 / 互斥性"</b> —— 全是"邻接则 +X"的合作型，没有"A 周围必须没有 B 才生效，否则归零"的反向 / 互斥邻接',
          '<b>modifier 的"网格内位置约束"</b> —— modifier 几乎都是抽象层全局生效，没有"此 relic 必须挂在某格上才生效，且占据格子争抢空间"的实体化 modifier'
        ],
        poolDone: [
          '基础池容量梯度从小（地牢掷骰 31）到大（lucky-hero 300+ / endgame-of-devil 240）',
          '稀有度梯度（LBL 普 60%/非 25%/稀 12%/极稀 3% 是公开数字最清楚的）',
          '基础池家族分类（cat-god-ranch 7 大家族；dog-and-goblin 19 种类；roulette-hero 13 动物种类）',
          '主动池显式分类与稀有度（LBL 100+ 道具普/非/稀/传）',
          '网格尺寸固定为可玩信息密度（3×3 / 3×5 / 4×5）',
          '三消 / 合成纵向升级（lucky-hunter 三同名；dog-and-goblin 合成棋）',
          '删除符号 / 重投工具（lucky-hero / die-shou-wei-cheng / 地牢掷骰）',
          '多角色起手差异（lucky-hero 3 职业；endgame-of-devil 多角色路线）',
          '主动池槽位限制公开（roulette-hero 卡带槽数有限）',
          '多类型主动池（地牢掷骰 relic 142 + potion 36；endgame-of-devil 财宝 201+19+13）'
        ],
        poolUndone: [
          '<b>网格本身（格子 / 边 / 区块）作为可购买 pool 资源</b> —— 11 款基础池都是"放进格子的元素"，没有任何一款把"第 6 行 / 一块 2×2 区域 / 一条对角线"做成商店里可买的 pool 条目',
          '<b>基础池元素的"位置标签"</b> —— 同一种符号没有"此符号只能 / 优先放在某行 / 某区域"的池属性',
          '<b>主动池条目"必须挂载到某格"的实体化</b> —— 11 款 relic / 道具 / 财宝几乎全部抽象生效，没有"此 relic 是一张贴纸，必须贴到 9 个格子里某 1 格才生效"',
          '<b>基础池与主动池的"同槽争抢"</b> —— 两层池在槽位上完全分离，缺"某些 relic 占用 1 个棋盘格"的双向占用',
          '<b>网格的"多层堆叠"</b> —— 全是单层 2D 网格，没有"底层 = 地形池 / 中层 = 符号池 / 上层 = 道具池"的 z 轴分层 pool'
        ],
        themeRecommendations: [
          {
            theme: '古代天文星象（星宿网格 + 连星方向 + 星宫赋格）',
            mapping: '基础池 = 100+ 星宿符号（按二十八宿 + 北斗 + 南斗等家族），玩家在天球网格（3×9 紫微/太微/天市三垣）布置；random = 每夜从星宿池抽出当晚可用星宿；combo1 = adjacency（同宿相邻聚集 + 五行相生方向加成，引入"东方青龙 → 南方朱雀"有向邻接，方向不同效果不同）+ type_dict（七政四余配合）；combo2 = 占星师符箓（道具）必须挂在某宿格上才生效；网格几何由皇极经世改写',
            fillsGap: '青龙朱雀有向邻接（c2_undone #2）；皇极经世改写网格几何（c2_undone #3）；符箓必须挂到星宿格争抢空间（c2_undone #5 + pool_undone #3）；紫微/太微/天市三垣 = 三层 z 轴 pool（pool_undone #5）'
          },
          {
            theme: '地铁线路调度（车站网格 + 换乘 + 路网拓扑）',
            mapping: '基础池 = 车站砖（普通站 / 换乘站 / 终点站 / 枢纽站），玩家在 4×6 城市网格上铺设；random = 每 turn 涌入 N 群乘客（OD 对随机）；combo1 = adjacency（相邻同色线路 +客流，但"A 线必须在 B 线右侧才能换乘" = 有向邻接）+ line_complete（铺通一条线触发奖励）；combo2 = 城建 modifier（"修一条隧道连接 (1,3) 与 (3,3)" = 显式购买边）',
            fillsGap: '隧道 = 边 modifier 可购买（c2_undone #1，11 款全集缺）；地铁路网天然有向（c2_undone #2）；"此站点 1km 内不能有竞品否则归零" = 互斥邻接（c2_undone #4）；商店里直接卖一块新区域（pool_undone #1 格子池）'
          },
          {
            theme: '蜂群养殖 / 蜂箱布局（蜂巢六边形邻接 + 蜂种舞蹈方向）',
            mapping: '基础池 = 100+ 蜂种 / 巢础 / 蜜源花卉，玩家在六边形蜂巢网格（替换正方形，引入新邻接拓扑）放置；random = 每 turn 蜜源开花种类随机；combo1 = 六邻接（每格 6 邻位，比正方形 4 邻位密度更高）+ 蜜蜂"8 字舞"有向通信（A 蜂朝向 B 蜂时传递信号）+ type_dict（工蜂/侦察蜂/蜂王羁绊）；combo2 = 蜂农道具必须挂到某蜂箱格',
            fillsGap: '六边形 = 改写网格几何，11 款全是正方形（c2_undone #3）；蜂舞方向性 = 有向邻接（c2_undone #2）；蜂箱 z 轴：底层育虫房 / 中层蜜库 / 上层蜂王台 = 多层网格池（pool_undone #5），同时避开了 11 款已用的"slot / 棋盘 / 推币 / 自走棋"美术框架'
          }
        ]
      },
      {
        id: 'grid_line',
        glyph: '🟩',
        name: '网格连线族',
        pattern: '2D_grid × line_complete',
        members: ['bingo-betty', 'cloverpit', 'spinera', 'die-shou-wei-cheng'],
        verifiedMaxTotal: 33,
        oneLiner: '4 款 slot 老虎机 / 宾果系。"线之间的拓扑组合"和"线作为触发链"是该集群完全没人做的方向。',
        c2Done: [
          '线奖励倍率（bingo-betty"对角线 ×3"/"每完成一行 +50%"；cloverpit 道具滚雪球；spinera 科技树乘性产出）',
          '卡面级局部修饰（bingo-betty blotter 某格预填 / 某列翻倍）',
          '全局百分比加成（bingo-betty 150+ 被动；cloverpit 150+ charms；spinera 科技树 +50%）',
          '类型字典 + 连线混合判定（cloverpit"同类阈值 + 连线"；spinera 符号 → 资源类型字典）',
          '跨回合记忆（bingo-betty"连续两回合连线则下回合双倍"，引入时间维度的 line 记忆）',
          '跨局元进展（cloverpit 跨局解锁；spinera 不同领袖差异化起手）',
          '线判定本身可改写（bingo-betty"5 连 = 触发两次"，直接修饰 line 判定语义）',
          '工具型一次性主动（die-shou-wei-cheng 重新滚动 / 删除 / 升级）',
          'cascade / 滚雪球（cloverpit"道具间互相引爆形成滚雪球"）'
        ],
        c2Undone: [
          '<b>玩家主动选择哪条线优先 / 顺序结算</b> —— 4 款多线同时完成是固定顺序叠加，没有"本回合手动指定主对角线先结算"的玩家调度',
          '<b>线之间的"拓扑组合" modifier</b> —— 只奖励单条线 / 双线叠加，没有"行+列+对角线 = T 形 → 触发 T 形特技"/"H 形=两列+一行 → 双倍"的多线几何字典',
          '<b>线 modifier 的"位置定向"</b> —— 4 款的线奖励对所有同类线无差别（任意一行 +50%），没有"第 3 行专属奖励 / 中央对角线专属规则"',
          '<b>未连成线的"威胁线" / 反向 line modifier</b> —— 都是"连完才奖励"，没有"4/5 即将连成的线 +Mult"/"故意打断对手潜在线"',
          '<b>线作为"路径"承载触发链</b> —— 连线只算一次性整体奖励，没有"连成的线就是一条触发链，符号按连线方向逐格触发"，把 line + chain 拼起来'
        ],
        poolDone: [
          '基础池标准化（bingo-betty 75 球 + 30+ 卡面；cloverpit 第一人称 slot 符号 15-25；spinera 30-50 符号）',
          '卡面 / 棋盘可定制化（bingo-betty 30+ blotters 永久卡面修饰；spinera 不同领袖；die-shou-wei-cheng 不同守卫初始符号集）',
          '主动池规模公开（bingo-betty 150+ 被动 + 10+ blotter；cloverpit 150+ charm；spinera 科技树 30-60 节点）',
          '主动池层级（bingo-betty 被动 + blotter 双层；spinera 科技树 + 领袖双层）',
          '工具型主动池（die-shou-wei-cheng 重新滚动 / 删除 / 升级 3 件套）',
          '跨局解锁（cloverpit 跨局元进展）'
        ],
        poolUndone: [
          '<b>线作为基础池条目</b> —— 4 款基础池都是"符号 / 球 / 卡面格子"，没有"购买一条专属对角线，本局额外计入"，line 不是 pool 单位',
          '<b>线模板池</b> —— 没有"X 形 / Z 形 / Y 形 / 心形 line shape 字典"作为商店可解锁的对象',
          '<b>卡面 / 棋盘的"纵向升级"</b> —— blotter 是平行选项，不是阶梯（"卡面 → 钻石卡面 → 传奇卡面"）',
          '<b>主动池"必须按线挂载"的实体化</b> —— 没有"此 charm 必须挂在某一行 / 某条对角线上才生效"',
          '<b>基础池与主动池的"线媒介"流通</b> —— 缺"用 1 张完成线 烧掉换 1 件 charm / 用 1 件 charm 换一条永久线模板"'
        ],
        themeRecommendations: [
          {
            theme: '纺织 / 织机经纬（经线 + 纬线 + 纹样字典）',
            mapping: '基础池 = 100+ 丝线符号（蚕丝/麻线/金线/染色丝）；random = 每回合织娘抽 N 缕丝放进经纬网格；combo1 = line_complete（一行经线 = 一组横向纹路；一列纬线 = 一组纵向纹路；按蜀锦字典识别"团花纹"/"回字纹"/"卐字纹"等纹样形状）+ 多线拓扑组合（"团花 = 行+列+中心对角形成 + 形 → 大幅倍率"）；combo2 = 染料 / 织机 modifier 必须挂在某行 / 列上才生效',
            fillsGap: '纹样字典 = 多线拓扑组合（c2_undone #2，4 款全集缺）；蜀锦"第 3 行金线纹专属奖励" = 位置型 line modifier（c2_undone #3）；一条经线就是一条触发链，按穿梭方向逐格（c2_undone #5 line+chain 拼接）；染料挂在线上 = 线级实体挂载（pool_undone #4）'
          },
          {
            theme: '古典园林 / 借景造园（视廊连线 + 框景 + 移步换景）',
            mapping: '基础池 = 园林元素（亭/榭/桥/假山/水池/花木），玩家在 5×5 园林网格布置；random = 每季客人来访视点随机；combo1 = line_complete（视廊连线：从某一亭出发能否一眼看穿到对面景元素 = 一条 line；多视廊形成的"借景拓扑"按园林学字典识别"框景 / 漏景 / 对景 / 障景"，多线几何字典）+ type_dict（移步换景：客人沿动线移动）；combo2 = 园林典籍 modifier 必须挂某一视廊；威胁线机制——4/5 即将通景但被假山障景打断 +Mult',
            fillsGap: '游园动线 = 玩家主动指定视廊优先级（c2_undone #1）；框景/漏景/对景/障景 = 多线几何字典（c2_undone #2）；障景 = 故意打断潜在线 +Mult（c2_undone #4 反向阅读）；《园冶》典籍解锁不同 line shape 模板池（pool_undone #2 线模板池）'
          },
          {
            theme: '棋谱 / 围棋定式（一局棋的连子线 + 死活线）',
            mapping: '基础池 = 黑白棋子 + 100+ 棋谱定式片段（小目挂角 / 三连星 / 二连星）；random = 对手落子位置随机；combo1 = line_complete（连成 4 子直线 / 斜线触发定式字典识别 → 大模样倍率）+ 死活线（眼形拓扑：两眼活棋 = 必须形成两个独立闭合区域，多线几何）+ 触发链（沿一条龙顺序结算）；combo2 = 棋谱 modifier"此谱式必须出现在角部 / 边部 / 中腹"',
            fillsGap: '角/边/腹位置型 line modifier（c2_undone #3，围棋天然有此差异）；一条龙就是触发链，line+chain 完美拼合（c2_undone #5）；购买"专属定式线"作为 pool 条目（pool_undone #1）。题材避开了 cloverpit/spinera 的"slot/帝国"美术'
          }
        ]
      }
    ],

    /* ====================== 区块 ③ · 路径 2 · 8 个潜在先验严谨研究 ====================== */
    /* 来源：Agent B 调研 8 个先验的现实热度 + 已有 RPB 化案例 + 矩阵格子状态 + 置信度评估 */
    path2Priors: [
      {
        id: 'snake_pacman',
        glyph: '🐍',
        name: '贪吃蛇 Snake / 吃豆人 Pac-Man',
        patternLabel: '2D 网格 × path + threshold',
        predictedScores: { random: 7, combo: 7, pool: 8, structure: 8 },
        recommendation: 'A',
        marketHeat: {
          steamTagCount: 'Steam Snake 标签数十至上百款，Pac-Man 类似；纯 RPB 化稀少（5-10 款估算）',
          famousWorks: ['SNKRX (Snake roguelite 爆款，3 美元神作)', 'Wormhole (2024 Snake roguelike 佳作)', 'Pac-Man 256 (无限 Pac-Man)'],
          playerFamiliarity: '顶级大众认知（与 Tetris 并列电子游戏国民玩法）'
        },
        existingRpb: [
          { name: 'SNKRX', steamUrl: 'https://store.steampowered.com/app/915310/SNKRX/', isTrueRpb: false, comment: 'Snake+roguelite+arcade shooter，英雄组队但非装置类 RPB；卡牌成分弱，更接近 autobattler' },
          { name: 'Wormhole', steamUrl: 'https://store.steampowered.com/ (2024)', isTrueRpb: false, comment: 'Snake roguelike + 可堆叠 perks 系统，关卡手工，更接近 perks roguelite 而非装置 RPB' },
          { name: 'Snakelike', steamUrl: 'https://store.steampowered.com/app/845110/Snakelike/', isTrueRpb: false, comment: 'Snake+turn-based roguelike，但牌组构建成分弱' },
          { name: 'Rogue Snake', steamUrl: 'https://store.steampowered.com/app/3207150/Rogue_Snake/', isTrueRpb: false, comment: '网格回合制 Snake + 升级，roguelite 但非牌组化' }
        ],
        matrixState: { membersIn34: 0, neighbors: '2D 网格 path 邻居：right-and-down (路径走格)；threshold 邻居：roulette-hero/ballionaire', isPotentialDesignSpace: true },
        rpbDesign: {
          basePool: '30-40 张身体节段（不同效果：火焰节/磁吸节/双倍节/穿墙节），稀有度梯度',
          activePool: '30 张地图修饰：豆点权重/陷阱/传送门/食物倍率；以及主动技能卡（瞬移/分裂/无敌一回合）',
          checkpoint: '吞食指定数量豆/达到长度阈值/在 N 步内完成关卡；Boss 即特定鬼怪',
          biggestRisk: 'Snake/Pac-Man 的"路径走格 path predicate"装置化空间被现有 SNKRX/Wormhole 部分占据但都不是真 RPB；机会窗口仍在，但需要明确证明"卡牌化"比 perks 化更好玩，否则容易做成 SNKRX 复刻'
        },
        confidence: { score: '中', market: '中', overall: 'A' }
      },
      {
        id: 'darts',
        glyph: '🎯',
        name: '飞镖 Darts',
        patternLabel: '1D 圆环 × path + type_dict',
        predictedScores: { random: 8, combo: 8, pool: 7, structure: 8 },
        recommendation: 'B',
        marketHeat: {
          steamTagCount: 'Steam 飞镖类游戏极少（10-30 款估算），多为模拟运动',
          famousWorks: ['PDC World Championship Darts (模拟)', 'Greedy Darts (RPB 化新作)'],
          playerFamiliarity: '欧美熟悉度高（酒吧文化），亚洲熟悉度中等；规则简单（中圈中点）易教学'
        },
        existingRpb: [
          { name: 'Greedy Darts', steamUrl: 'https://store.steampowered.com/app/3212590/Greedy_Darts/', isTrueRpb: true, comment: '2025/10/24 EA 上市，明确飞镖 roguelike deckbuilder，含 Count-Up/Zero-One/Cricket 多模式，主打 synergy 构建。是飞镖赛道唯一明确 RPB' }
        ],
        matrixState: { membersIn34: 1, neighbors: '1D 圆环已有成员：roulette-hero（轮盘 1D 圆环 × threshold）；type_dict 邻居：cloverpit/spinera/lucky-island', isPotentialDesignSpace: true },
        rpbDesign: {
          basePool: '30-40 张飞镖（不同投掷弧度/精度/特效），稀有度梯度（普通飞镖 → 弹跳镖/分裂镖/穿透镖）',
          activePool: '30 张靶盘修饰（重力区/双倍区/反转区）+ 投手技能卡（手感稳定/连投奖励）',
          checkpoint: 'Cricket 模式累计中靶；501/Zero-One 模式首达零；多 Boss 即多场对决',
          biggestRisk: 'Greedy Darts 已占赛道唯一位且新鲜，但飞镖玩法的拓扑空间偏窄（圆环 20 区+牛眼），长期组合深度可能不及 D&DG/Drop Duchy'
        },
        confidence: { score: '中', market: '中', overall: 'B' }
      },
      {
        id: 'match3',
        glyph: '🟦',
        name: '三消 Match-3 / 消除',
        patternLabel: '2D 网格 × cascade',
        predictedScores: { random: 7, combo: 9, pool: 8, structure: 8 },
        recommendation: 'B',
        marketHeat: {
          steamTagCount: "Steam Match 3 标签 1670-1748 款（确认数据）",
          famousWorks: ['Candy Crush (移动端国民级)', 'Puzzle Quest (经典 RPG+消除)'],
          playerFamiliarity: '大众认知（移动端教学最彻底的玩法之一，全年龄段熟悉）'
        },
        existingRpb: [
          { name: 'Match Morphosis', steamUrl: 'https://store.steampowered.com/ (Demo 阶段)', isTrueRpb: true, comment: '明确自我定位 "Slay the Spire + match-3"，50+ 瓦片 100+ 装备 5 角色，正在做 RPB 化' }
        ],
        matrixState: { membersIn34: 0, neighbors: '2D 网格邻居：crop-rotation/cat-god-ranch/lucky-mayor/right-and-down；cascade 邻居：peglin (cascade trigger)/balatro (chain)', isPotentialDesignSpace: true },
        rpbDesign: {
          basePool: '5-7 种基础宝石/瓦片 + 稀有度梯度（特殊瓦片：彩虹/炸弹/线性消除等 20-30 张），通过 RPBD 阶段加入',
          activePool: '30-40 张修饰：连锁倍率、消除奖励翻倍、特定颜色加成、跨格连锁、瓦片转化卡等',
          checkpoint: '经典关卡分阈值（Candy Crush 模型）+ 步数/血量限制；或 Boss 战目标分',
          biggestRisk: '市场对 match-3 印象固化为"微交易休闲"，硬核玩家可能本能排斥；Match Morphosis 占据先发，但赛道整体未饱和'
        },
        confidence: { score: '中', market: '中', overall: 'B' }
      },
      {
        id: 'tetris',
        glyph: '🧱',
        name: '俄罗斯方块 Tetris',
        patternLabel: '2D 网格 × line_complete + cascade',
        predictedScores: { random: 8, combo: 8, pool: 8, structure: 9 },
        recommendation: 'B',
        marketHeat: {
          steamTagCount: 'Steam 落块/方块类 100+ 款（估算），Tetris 官方授权稀缺但仿作众多',
          famousWorks: ['Tetris Effect', 'Drop Duchy (RPB 化标杆)', 'Emberward (塔防+方块)'],
          playerFamiliarity: '大众认知顶峰（被誉为"电子游戏祖父"）'
        },
        existingRpb: [
          { name: 'Drop Duchy', steamUrl: 'https://store.steampowered.com/app/2525310/Drop_Duchy/', isTrueRpb: true, comment: '硬核 RPB：1460 评价 90% 好评，30 天 97% 极度好评，110+ 卡牌 3 派系，城市建造×Tetris×牌组构建。已成赛道标杆' },
          { name: 'Dogpile', steamUrl: 'https://store.steampowered.com/ (开发中)', isTrueRpb: true, comment: 'Tetris+合成机制+Balatro-like 卡牌，狗主题，正在开发中' }
        ],
        matrixState: { membersIn34: 0, neighbors: '2D 网格邻居：crop-rotation/cat-god-ranch/right-and-down；line_complete 邻居：bingo-betty (bingo line)；cascade 邻居：peglin/balatro', isPotentialDesignSpace: true },
        rpbDesign: {
          basePool: '标准 7 种四连块 + 稀有度梯度（特殊形状：单块/巨块/带属性方块等 30-40 张）',
          activePool: '30-50 张修饰：旋转免费、清行翻倍、连续 Tetris 倍率、特殊行触发卡等',
          checkpoint: 'Boss 战目标行数/分数；或 Drop Duchy 式资源/单位生产关卡目标',
          biggestRisk: 'Drop Duchy 已占绝对标杆位（90% 好评 + 97% 近期），后来者必须有强差异化（如 Dogpile 的合成方向）；"Tetris+卡牌"空间已被市场快速消化'
        },
        confidence: { score: '高', market: '中', overall: 'B' }
      },
      {
        id: 'blackjack',
        glyph: '🃏',
        name: '21 点 Blackjack',
        patternLabel: '0D × threshold + type_dict',
        predictedScores: { random: 7, combo: 9, pool: 9, structure: 8 },
        recommendation: 'B',
        marketHeat: {
          steamTagCount: "Steam 'Card Game'/'Casino' 标签下数百款，Blackjack 专题约 50-100 款（估算）",
          famousWorks: ['Dungeons & Degenerate Gamblers (Balatro-like 21 点)', 'Black Jacket (2026 RPB 化新作)', 'RogueJack21 (程序生成赌场)'],
          playerFamiliarity: '大众认知（赌场标配，全球玩家熟悉度极高，规则即学即玩）'
        },
        existingRpb: [
          { name: 'Dungeons & Degenerate Gamblers', steamUrl: 'https://store.steampowered.com/app/2400510/', isTrueRpb: true, comment: '真 RPB：基础牌池+主动修饰卡，2032 评价 83% 好评，被 Balatro 作者本人点赞，是 21 点赛道标杆' },
          { name: 'Black Jacket', steamUrl: 'https://store.steampowered.com/app/3100370/Black_Jacket/', isTrueRpb: true, comment: '2026 即将发售，明确定位 21 点 roguelike deckbuilder' }
        ],
        matrixState: { membersIn34: 0, neighbors: '0D × threshold 邻居：cloverpit (0D × type_dict)；type_dict 邻居：spinera/spin-hero/lucky-island；threshold 邻居：roulette-hero/coin-push-rpg', isPotentialDesignSpace: true },
        rpbDesign: {
          basePool: '52 张标准牌 + 稀有度梯度（基础 A-K → 稀有特殊牌如 X 牌/分裂牌/质数牌等 30-40 张），需要 RPBD 阶段构筑',
          activePool: '30-50 张主动修饰：双倍下注、保险、再抽、上限突破（>21 仍合法）、计数器修正等',
          checkpoint: 'Boss 多回合对战，达成目标分阈值或击败 NPC 庄家；或债务还款模式',
          biggestRisk: 'D&DG 已占位标杆，2026 年 Black Jacket 即将上市进一步压缩窗口；同质竞争极激烈，差异化必须极强'
        },
        confidence: { score: '高', market: '中', overall: 'B' }
      },
      {
        id: 'bowling',
        glyph: '🎳',
        name: '保龄球 Bowling',
        patternLabel: '2D 物理 × path + threshold',
        predictedScores: { random: 9, combo: 8, pool: 7, structure: 8 },
        recommendation: 'B',
        marketHeat: {
          steamTagCount: "Steam 'Bowling' 标签数十款，纯保龄球+RPB 几乎为 0；但'物理弹球'范畴 100+ 款",
          famousWorks: ['Wii Sports Bowling (国民级保龄球)', 'Pinball FX 系列', 'Roundguard (弹珠+地牢)'],
          playerFamiliarity: '保龄球本身大众认知；但"保龄球 roguelike"尚无知名标杆，教学路径需依赖弹珠类联想'
        },
        existingRpb: [
          { name: 'Runix: Pinball Roguelike', steamUrl: 'https://store.steampowered.com/app/3617290/Runix_Pinball_Roguelike/', isTrueRpb: true, comment: '弹珠 RPB，构建球组击杀怪物；非保龄球但是同 topology' },
          { name: 'STICKER/BALL', steamUrl: 'https://store.steampowered.com/ (2026 May)', isTrueRpb: true, comment: '"pool pinball meets deckbuilder"' },
          { name: 'Pinball Blitz', steamUrl: 'https://store.steampowered.com/app/2828800/Pinball_Blitz/', isTrueRpb: true, comment: 'Arcade 弹珠+牌组+roguelike，明确 RPB 化' }
        ],
        matrixState: { membersIn34: 1, neighbors: '2D 物理 path 已有成员：peglin (球路径+弹反)；threshold 邻居：roulette-hero/coin-push-rpg/ballionaire', isPotentialDesignSpace: true },
        rpbDesign: {
          basePool: '30-40 张球种（不同重量/旋转/特效），稀有度梯度需要 RPBD 阶段构筑',
          activePool: '30 张球道修饰（油纹/障碍/感应器）+ 球员技能卡（瞄准辅助/连击补正）',
          checkpoint: '经典 10 局 Frame 总分阈值；或 Boss 战"击倒指定瓶位"',
          biggestRisk: '保龄球的"10 瓶"拓扑过于固定，组合空间相对弹珠类更窄；与 Peglin/Runix 相比物理变化少，可能显得"同类不如"'
        },
        confidence: { score: '中', market: '中', overall: 'B' }
      },
      {
        id: 'bullet_hell',
        glyph: '🔫',
        name: '弹幕射击 Bullet Hell',
        patternLabel: '2D 物理 × path + trigger_chain',
        predictedScores: { random: 9, combo: 9, pool: 8, structure: 7 },
        recommendation: 'B',
        marketHeat: {
          steamTagCount: "Steam 'Bullet Hell' 数百款，硬核圈活跃；'弹幕+RPB'极小众（5-15 款估算）",
          famousWorks: ['Vampire Survivors (弹幕生存爆款)', 'Touhou 系列 (弹幕鼻祖)', 'Barrel Roll / W.A.N.D Project (RPB 化新作)'],
          playerFamiliarity: '硬核玩家熟悉度高，大众玩家因 Vampire Survivors 拉低门槛后认知普及'
        },
        existingRpb: [
          { name: 'Barrel Roll', steamUrl: 'https://store.steampowered.com/ (2025/10/23)', isTrueRpb: true, comment: '"deckbuilder where your deck is a revolver"，6 槽弹仓即牌组' },
          { name: 'W.A.N.D Project', steamUrl: 'https://store.steampowered.com/ (2024/11/29)', isTrueRpb: true, comment: '深度攻击合成系统的弹幕 roguelike，偏 ARPG 但有牌组要素' }
        ],
        matrixState: { membersIn34: 0, neighbors: '2D 物理 path 邻居：peglin (球路径)；trigger_chain 邻居：balatro/ballionaire (chain)/aotenjo', isPotentialDesignSpace: true },
        rpbDesign: {
          basePool: '30-50 张子弹/法术（直线/扇形/追踪/反弹），稀有度梯度（普通 → 穿透/连锁/吸血）',
          activePool: '30 张修饰：弹道增幅/装填速度/暴击堆叠/被动光环',
          checkpoint: '回合内击退波次/Boss 血量阈值；或时间生存（弹幕生存模式）',
          biggestRisk: '<b>实时弹幕与回合制 RPB 哲学不兼容</b>（实时手感需求 vs. 回合可计算性），结构分预测 7 偏低反映此风险；若做"回合制弹幕"又可能丧失类型核心吸引力'
        },
        confidence: { score: '中', market: '中', overall: 'B' }
      },
      {
        id: 'racing',
        glyph: '🏎',
        name: '赛车 / 跑酷 Racing',
        patternLabel: '1D 线序 × path + chain',
        predictedScores: { random: 8, combo: 7, pool: 7, structure: 8 },
        recommendation: 'C',
        marketHeat: {
          steamTagCount: "Steam Racing 标签数千款，但'回合制+卡牌赛车'极小众（10-30 款估算）",
          famousWorks: ['Forza/Need for Speed (传统赛车)', 'Deck RX (RPB 化代表)', 'Bookie (赛马 RPB)'],
          playerFamiliarity: '传统赛车大众认知，但"卡牌化赛车"对玩家是陌生范式（教学成本中等）'
        },
        existingRpb: [
          { name: 'Deck RX', steamUrl: 'https://store.steampowered.com/app/1529180/Deck_RX_The_Deckbuilding_Racing_Game/', isTrueRpb: true, comment: '真 RPB：8 角色 6 世界 15-20 赛道，但 Steam 评价数偏少，市场反响一般' },
          { name: 'Bookie', steamUrl: 'https://store.steampowered.com/app/3735080/Bookie/', isTrueRpb: true, comment: '赛马 deckbuilder' }
        ],
        matrixState: { membersIn34: 0, neighbors: '1D 线序邻居：dice-tribes-ambitions (1D 路径)/luck-be-a-landlord (1D 卷轴)；path 邻居：peglin (球路径)/right-and-down', isPotentialDesignSpace: true },
        rpbDesign: {
          basePool: '30-40 张赛车动作牌（加速/转向/超车/防撞）+ 稀有度梯度（特殊机动：氮气/漂移连击）',
          activePool: '30 张车辆改装：引擎/轮胎/涂装等被动修饰；以及赛道事件卡（弯道/雨天/陷阱）',
          checkpoint: '完成圈数/超过对手数/规定时间内到达终点；多 Boss 即多场赛事',
          biggestRisk: '玩家对"回合制赛车"本能怀疑（违反速度感直觉），教学成本和首小时留存压力大；Deck RX 已尝试但市场反响平平，<b>提示玩法成立性存疑</b>'
        },
        confidence: { score: '中', market: '低', overall: 'C' }
      }
    ],

    /* ====================== 区块 ④ · 反向警告（补充信息，不说死）====================== */
    reverseWarnings: [
      {
        observation: '<b>网格邻接族 combo 长期在 7-8 之间徘徊</b>。11 款网格邻接族（含 LBL 8 / 地牢掷骰 8 / Card Hog 7 / 幸运勇者 7）combo 评分集中在 7-8，仅狗与哥布林破到 9（slot×自走棋融合 + 类型字典叠加）。',
        hypothesis: '这<b>可能</b>意味着邻接判定的指数倍率链难做 —— 邻接关系本身是线性可枚举的（一个符号最多 4-8 个邻居），缺乏 trigger_chain 的"按序累乘"结构。',
        counterExample: '但这只是基于现有样本的归纳，不是定律。如果你能设计出"邻接组合 → 触发跨格连锁 → 倍率累乘"的机制，可能突破这个观察。狗与哥布林证明了"叠加多重判定"是一条破 9 路径。'
      },
      {
        observation: '<b>1D 圆环作为主装置层在 34 款里只有 1 个（孤族）</b>。仅转啊转 Bingle Bingle 一款；曾被认为是圆环族的轮盘英雄 / 幸运勇者经玩家评测核实主装置层是 2D 网格（轮盘只是次级随机选择器）。',
        hypothesis: '这<b>可能</b>意味着 1D 圆环作为主装置缺乏"内容承载力"—— 圆环只有 N 个格子（典型 12-32 个），符号种类难超过格子数；圆环没有"二维方向"可供组合，邻接判定退化为左右两邻位。',
        counterExample: '飞镖 / 命运转盘 / 时钟主题等还未充分探索。如果加入"圆环可旋转 + 多层同心圆环 + 圆环上有动态指针"等机制，1D 圆环可能扩展成有效主装置。Greedy Darts 是一个测试案例。'
      },
      {
        observation: '<b>pool ≥ 9 全部是清晰双层池（5/5）</b>。34 款里 pool ≥ 9 的 5 款都明确划分"基础池保底 + 主动池修饰"两层，跨题材（卡牌 / slot / 骰子 / 城市经营）都成立。',
        hypothesis: '这<b>可能</b>意味着双层池是 pool 高分的必要条件。空间布局池（弹珠大亨 trinket 摆位 = 基础+主动合一）和单层包池（青天井 / 哥布林弹球）受限于"两层未拆分清晰"。',
        counterExample: '理论上"三层池"（基础+主动+地形 / 基础+主动+元进展）也可能创造 pool ≥ 9 的设计，但 34 款里没人尝试。多层池可能是下一代爆款的设计方向。'
      },
      {
        observation: '<b>0D 多重集 + 不带 type_dict 的判定 = 在 34 款里 0 例</b>。多重集字典族 10 款全部含 type_dict 判定，没有任何一款 0D 多重集只用 threshold / cascade 等判定。',
        hypothesis: '这<b>可能</b>意味着 0D 多重集的"无序集合 + 类型识别"几乎是必然搭配 —— 没有位置就只能靠类型字典做组合识别。骰子族 / 卡牌族都遵循这个模式。',
        counterExample: '"0D 多重集 × cascade"在矩阵里被标注为潜在设计空间（"抽到的牌触发连锁字典查询，把触发链机制从 1D 推回 0D"）。如果设计出这种机制，证明 0D 不必非配 type_dict。'
      }
    ],

    /* ====================== 区块 ⑤ · 开放讨论问题 ====================== */
    openQuestions: [
      {
        title: '1D 线序作为主装置层为什么是 0？',
        body: '34 款里没有任何一款的主装置层是 1D 线序（仅作为 Balatro Joker 槽这种次级层）。这是**理论盲区**（1D 线序不适合做主装置）还是**设计空白**（仍未有人想到合适的玩法原型）？8 个潜在先验里赛车（1D 线序 × path + chain）是这个空白的最强候选，但 Deck RX 已尝试且反响平平 —— 这是否暗示 1D 线序的主装置形态有结构性问题？'
      },
      {
        title: '路径 1 和路径 2 对小团队该怎么选？',
        body: '路径 1（既有 R+C1 上做 C2/pool 优化）风险低、周期短、收益上限受同行竞争影响；路径 2（新 R+C1 范式）风险高、周期长、独占细分市场。混合策略是否可能？例如：用路径 1 的 R+C1 + 路径 2 的题材 / pool 创新（如医疗诊断 = Balatro 公式 + 全新题材 + pool 流动转换创新）。这种"半开拓"策略是不是最优解？'
      },
      {
        title: 'v3 公式是否漏了"装置反馈强度"维度？',
        body: 'v3 公式有 random / combo / pool / structure 四维评分，但 random 维度同时包含了"装置类型 + 落位机制 + 反馈强度"。后两者其实是设计师可独立调优的子维度（同一 slot 装置可以有平淡反馈也可以有屏幕震动+音效爆发的强反馈）。v4 是否应该把 random 拆成"random 拓扑"+"反馈强度"两个独立评分维度？这会让评分更精确，但增加 schema 复杂度。'
      }
    ]

  };
})();
