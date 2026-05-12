# RPB 装置类统一设计模型 · v5

R_RougeSlot 系统的当前分析框架版本。本目录是这一版本的"完整方法论快照"——程序消费 + 人/Claude 消费同源。

## v5 与 v4 的差异

**变更类型**：概念精确化 + 字段重命名 + 起点拓扑概念消除

**核心洞察**：v4 把 `symbol_topology` 描述为"目标拓扑"，跟"起点拓扑"对照。但严格审视后发现——

- random 输出的本质是一个**多重集**（无序、不带位置），所以 v4 的"起点拓扑"概念本身就是冗余的（任何游戏的起点都是隐式 0D 多重集）
- 拓扑空间是 **put 与 combo 共享的舞台**——put 把元素安置到舞台上，combo 在同一个舞台上做判定
- 因此 v5 把字段重命名为 `show_topology`（**舞台拓扑/表演拓扑**），强调它的"共享舞台"语义；同时消除"起点拓扑"概念

**Put 的几何形式化（v5 版）**：

```
            ┌──── show_topology（舞台拓扑 · 共享舞台）────┐
            │                                          │
            ↓                                          ↓
random ──→ put ────────────────────→ combo(C₁, C₂)
   ↑          ↑                            ↑
抽多重集    在舞台上安置元素                  在舞台上做判定
```

**新公式叙述**：

```
spin[
  1.random: 基础池随机取出 → 多重集（无序、不带位置）
  →
  2.put: 自动 / 手动 × set / place（把多重集安置进 show_topology）
  →
  combo[
    combo1: 符号协同规则       ← 在 show_topology 上做判定
    combo2: 修饰协同规则       ← 主动池施加的修饰
  ] @ show_topology
]_N → RPBD
```

**字段重命名（v5）**：
- `symbol_topology` → **`show_topology`**
- `symbol_topology_enum` → **`show_topology_enum`**
- 中文名"符号拓扑" → **"舞台拓扑"**

**枚举值不变**：5 个（0D_multiset / 1D_sequence / 1D_ring / 2D_grid / 2D_physical）。

**不变的**：
- 字段总数仍为 10（仅 symbol_topology 重命名为 show_topology）
- `combo_predicate` / `combo_synergy` / `combo_modifier` / `put_form` 等字段保留
- 4 维评分锚点 + 6 档不变
- 5 压力参数规约不变

**数据迁移（v4 → v5）**：
- 全部 analysis 字段 key 重命名：`symbol_topology` → `show_topology` + `framework_version: v4 → v5`
- 字段值不变（5 个枚举对应不变）
- 不需要重做评分

## v4 与 v3 的差异（历史归档）

v4 在 spin 流程中识别出 `put` 步骤，新增 `put_form` 字段（4 枚举），并显式区分起点/目标拓扑。详见 `framework/v4/README.md`。

## v3 与 v2 的差异（历史归档）

v3 把 v2 的 `combo_topology` 重命名为 `symbol_topology` 并移到 random 区。详见 `framework/v3/README.md`。

## 这是什么

一个用于拆解、评分、聚类、差察 **装置类 RPB 游戏**（Random-Pool Builder Roguelike）的标准化框架。把每一款游戏映射到下面这条公式上：

```
产出 = (基础池 × random × put@show_topology) + (基础池 × put × 符号协同@show_topology) × (主动池 × 规则修饰)
```

## 字段总览

### 4 维评分（5-10 分）

| key | 名称 | 衡量 |
|------|------|------|
| `random`    | random 表演    | 装置抽取戏剧化、视觉爆发力（含 random + put 的第一峰多巴胺） |
| `combo`     | combo 表演     | 连锁数值/动画爆发（含 combo1 + combo2） |
| `pool`      | pool 设计      | 双层池架构清晰度与多样性 |
| `structure` | 肉鸽底线/压力曲线 | checkpoint 节奏、目标分、波次 |

### 10 个定性字段（v5）

| key | 名称 | 公式中位置 |
|------|------|-----------|
| `pool_base_desc`       | 基础池描述         | 基础池 × random / 协同 |
| `pool_active_desc`     | 主动池描述         | 主动池 × 修饰协同 |
| `random_design`        | random 设计        | random（输出多重集，自由文本） |
| `show_topology`        | **舞台拓扑（v5 重命名）** | put 的目标空间 = combo1 的判定空间（枚举单选）|
| `put_form`             | Put 形式           | random → combo 之间的安置/选择映射方式（4 枚举单选）|
| `combo_synergy`        | 符号协同 (combo1)  | 基础池 × 符号协同（自由文本）|
| `combo_predicate`      | 协同判定           | 在 show_topology 上做的 combo1 判定（枚举数组）|
| `combo_modifier`       | 修饰协同 (combo2)  | 主动池 × 修饰协同（乘法项）|
| `rpbd_construction`    | RPBD 构筑          | 不在公式内，决定下次的池参数 |
| `checkpoint_mechanism` | 压力机制           | 周期性检查产出 |

### Put 4 子类（沿用 v4）

| put_form | 含义 | 与 show_topology 关系 | 例子 |
|---------|------|--------------------|------|
| `auto_place`   | 装置自动放置         | 装置自带空间（slot 网格 / 物理空间） | LBL（slot 自动落位）|
| `manual_set`   | 玩家选子集（无映射） | put 不升维，show_topology = 0D_multiset | balatro（选 5 张）|
| `manual_place` | 玩家选 + 映射到新空间 | put 升维到 show_topology | 吸血鬼爬行者（→1D 序列）/ 地牢掷骰（→2D 网格）|
| `auto_set`     | 系统选子集无映射     | — | 结构性空类，34 款样本中无 |

### 5 个压力参数

| key | 名称 | 含义 |
|------|------|------|
| `M`      | M       | checkpoint 数量（一局总关卡数）|
| `N`      | N       | 每个 checkpoint 间的 spin 数 |
| `T0`     | T₀      | 起始压力值（首关目标）|
| `r`      | r       | 压力增长率（指数/线性/跳跃）|
| `m_boss` | m_boss  | boss 关倍率 |

## 维护规则

**微调**（措辞 / 例子 / 评分粒度澄清 / 加新锚点）：
- 直接改本目录内的 `.md` 文件
- 不动 `framework/current.txt`，不影响存量数据

**结构性变更**（加维度 / 改公式 / 改字段 key）：
- 新建 `framework/v6/` 目录
- 改 `framework/current.txt` 内容为 `v6`
- `lib/render.js` 自动给 `analysis.framework_version === "v5"` 的旧数据顶部打"过时"角标

## v5 体验层因果（沿用 v4）

```
体验模型层：双峰多巴胺  +  前额叶 BD
                ↓ 推出

设计完备模型：spin[ Random → Put @ show_topology → Combo(C₁,C₂) @ show_topology ]_N → RPBD
                  └────第一峰多巴胺────┘   └─第二峰─┘    └─前额叶 BD─┘
```

- 双峰多巴胺：第一峰（random + put 即时反馈）+ 第二峰（combo 结算爆发）
- 前额叶 BD（Builder Decision）：RPBD 的认知决策

设计公式的形状是人类奖赏神经回路 + 认知回路的工程映射。show_topology 作为 put 与 combo 共享的"舞台"，是玩家可见的表演空间——既是 put 安置元素的目标，也是 combo 判定的载体。
