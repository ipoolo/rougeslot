# RPB 装置类统一设计模型 · v4

R_RougeSlot 系统的当前分析框架版本。本目录是这一版本的"完整方法论快照"——程序消费 + 人/Claude 消费同源。

## v4 与 v3 的差异

**变更类型**：新增维度（spin 流程中识别出 put 步骤）+ 语义澄清（symbol_topology 字段含义精确化）

**核心洞察**：v3 把 spin 流程写成 `random → combo` 直通，但 34 款样本里大量游戏在 random 之后还有一步「**put**」——把 random 结果**放置/选择**到 combo 判定的拓扑空间。完备模型应是 `random → put(自动|手动 × set|place) → combo`。

**Put 的几何形式化**：

```
random@起点拓扑  ──put──▶  combo@目标拓扑
                          ↑
                      combo1 在这个空间上判定
```

put 不只是"选择/放置"，而是**两个拓扑空间之间的映射**。

**新公式叙述**：

```
spin[
  1.random: 装置抽出基础池元素到起点拓扑
  →
  2.put: 起点拓扑 → 目标拓扑映射（自动 / 手动 × set / place）
  →
  combo[
    combo1: 符号协同规则       ← 在目标拓扑上做判定
    combo2: 修饰协同规则       ← 主动池施加的修饰
  ]
]_N → RPBD
```

**新增字段 `put_form`**：4 枚举（auto_place / manual_set / manual_place / auto_set[结构性空类]），见 `put_form_enum`。

**澄清 `symbol_topology` 字段语义**：v3 字段实际指**目标拓扑**（combo1 判定时的拓扑），不是起点拓扑。v4 在 schema 中显式注明、在 method-decompose.md 中详细解释。manual_place 类游戏中如果 v3 把起点拓扑误标为 symbol_topology，v4 重审时会修正。

**不变的**：
- `combo_predicate` / `combo_synergy` / `combo_modifier` 字段保留
- 4 维评分锚点 + 6 档不变
- 5 压力参数规约不变
- `symbol_topology_enum` 枚举值不变

**数据迁移**：
- 所有 v3 analysis 升级到 v4：增加 `put_form` 字段 + `framework_version: v3 → v4`
- manual_place 类游戏中 symbol_topology 经审核如有错标则更正
- 不需要重做评分

## v3 与 v2 的差异（历史归档）

v3 把 v2 的 `combo_topology` 字段重命名为 `symbol_topology` 并移到 random 区。详见 `framework/v3/README.md`。

## 这是什么

一个用于拆解、评分、聚类、差察 **装置类 RPB 游戏**（Random-Pool Builder Roguelike）的标准化框架。把每一款游戏映射到下面这条公式上：

```
产出 = (基础池 × random × put) + (基础池 × put × 符号协同) × (主动池 × 规则修饰)
```

这条公式把"装置类 RPB"压缩为 3 类参与者（基础池 / 主动池 / RPBD 玩家）+ 5 个核心机制（random / **put** / 符号协同 / 规则修饰 / checkpoint）。每款游戏在这套公式上能被一致地拆解成 10 个定性字段 + 4 维评分 + 5 个压力参数。

## 为什么要框架化

在 v1 之前，分析散落在多个独立 HTML 里。不同场合对同一款游戏的评分会漂移、字段会缺失、聚类无法跨表对齐。框架化解决这三个问题：

1. **可复现** —— 同一款游戏，不同时间 / 不同人，评分稳定（依赖 `scoring-rubric.md` 的档位锚点）
2. **可对比** —— 34 款游戏在同一套字段上拆解，跨维度差察才有意义
3. **可演进** —— 框架本身有版本号，结构性变更触发存量数据"过时"标记，但旧分析不会丢

## 读者路径

| 角色 | 推荐路径 |
|------|----------|
| **第一次接触系统的人**             | 本文件 → `prompts.md` |
| **要分析新游戏的 Claude session** | `prompts.md` → `method-decompose.md`（拆 10 字段） → `scoring-rubric.md`（钉 4 维分数） |
| **要做单维聚类的 Claude session** | `method-cluster.md` |
| **要做跨维差察的 Claude session** | `method-cross-dim.md` |
| **想理解评分边界的人**             | `scoring-rubric.md` |
| **程序（render.js / index.html）** | `schema.json` / `schema.js` |

## 字段总览

### 4 维评分（5-10 分）

| key | 名称 | 衡量 |
|------|------|------|
| `random`    | random 表演    | 装置落位戏剧化、视觉爆发力 |
| `combo`     | combo 表演     | 连锁数值/动画爆发（含 combo1 + combo2） |
| `pool`      | pool 设计      | 双层池架构清晰度与多样性 |
| `structure` | 肉鸽底线/压力曲线 | checkpoint 节奏、目标分、波次 |

### 10 个定性字段（v4，新增 put_form）

| key | 名称 | 公式中位置 |
|------|------|-----------|
| `pool_base_desc`       | 基础池描述         | 基础池 × random / 协同 |
| `pool_active_desc`     | 主动池描述         | 主动池 × 修饰协同 |
| `random_design`        | random 设计        | random（第一峰多巴胺，自由文本）|
| `symbol_topology`      | **目标拓扑**       | combo1 判定的拓扑空间（枚举单选）|
| `put_form`             | **Put 形式（v4 新增）** | random → combo 之间的映射方式（4 枚举单选）|
| `combo_synergy`        | 符号协同 (combo1)  | 基础池 × 符号协同（自由文本）|
| `combo_predicate`      | 协同判定           | 在目标拓扑上做的 combo1 判定（枚举数组）|
| `combo_modifier`       | 修饰协同 (combo2)  | 主动池 × 修饰协同（乘法项）|
| `rpbd_construction`    | RPBD 构筑          | 不在公式内，决定下次的池参数 |
| `checkpoint_mechanism` | 压力机制           | 周期性检查产出 |

### Put 4 子类（v4 新增）

| put_form | 含义 | 起点拓扑 | 目标拓扑 | 例子 |
|---------|------|--------|--------|------|
| `auto_place`   | 装置自动放置       | 池 → 装置自带空间   | 装置自带（slot 网格 / 物理空间） | LBL（slot 自动落位）|
| `manual_set`   | 玩家选子集（无映射）| 池 → 同拓扑子集     | 同起点拓扑（0D 多重集）| balatro（选 5 张） |
| `manual_place` | 玩家选 + 映射到新空间 | 池 → 新拓扑     | put 创造的新空间（1D 序列 / 2D 网格 / 目标集）| 吸血鬼爬行者（UNO 序列）/ 地牢掷骰（5×5 网格）|
| `auto_set`     | 系统选子集无映射   | —                  | —                              | 结构性空类，34 款样本中无 |

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
- 也不需要重新分析任何游戏

**结构性变更**（加维度 / 改公式 / 改字段 key）：
- 新建 `framework/v5/` 目录
- 改 `framework/current.txt` 内容为 `v5`
- `lib/render.js` 自动给所有 `analysis.framework_version === "v4"` 的游戏数据顶部打"过时"角标
- 用户决定哪些游戏按 v5 重做，渐进迁移

## v4 的体验层因果（新增视角）

v4 文档显式引入"体验模型 → 设计完备模型"的因果推导：

```
体验模型层：双峰多巴胺  +  前额叶 BD
                ↓ 推出

设计完备模型：[ Random → Put → Combo(C₁,C₂) ]_N → RPBD
              └────双峰多巴胺──────┘   └─前额叶 BD─┘
```

- 双峰多巴胺：第一峰（random + put 即时反馈）+ 第二峰（combo 结算爆发）
- 前额叶 BD（Builder Decision）：RPBD 的认知决策

设计公式的形状是人类奖赏神经回路 + 认知回路的工程映射。put 步骤的引入让"第一峰"完整——random 输出的元素如何"安置"进 combo 评估空间，玩家有干预与否，本身就是体验设计的关键。
