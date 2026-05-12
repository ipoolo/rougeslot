# RPB 装置类统一设计模型 · v3

R_RougeSlot 系统的当前分析框架版本。本目录是这一版本的"完整方法论快照"——程序消费 + 人/Claude 消费同源。

## v3 与 v2 的差异

**变更类型**：语义清理（字段重命名 + 字段位置调整 + 公式重述），无新增维度

**核心洞察**：v2 的 `combo_topology` 字段是历史命名瑕疵——"拓扑"描述的是符号怎么被随机摆放到几何空间，属于 **random 阶段**的设计选择，不是 combo 阶段的属性。v3 把它改名 `symbol_topology` 并移到 random 区。

**字段重命名**：
- `combo_topology` → `symbol_topology`（基础池符号在 random 阶段的几何拓扑）
- `combo_topology_enum` → `symbol_topology_enum`
- 字段顺序：紧跟 `random_design`，从 combo 区移到 random 区

**新公式叙述**：

```
spin[
  1.random: 符号拓扑设计       ← 装置类型 + 落位机制 + 拓扑空间
  →
  combo[
    combo1: 符号协同规则       ← 基础池内元素互动（在拓扑上做判定）
    combo2: 修饰协同规则       ← 主动池施加的修饰
  ]
] → RPBD
```

**不变的**：
- `combo_predicate` / `combo_synergy` / `combo_modifier` 字段名保留
- 4 维评分锚点 + 6 档不变
- 5 压力参数规约不变（v2 已规约）

**数据迁移**（自动 + 无损）：
- 所有 v2 analysis 一次性改名：`combo_topology` → `symbol_topology` + `framework_version: v2 → v3`
- 因为是无损改名，数据值完全保留
- **不需要重做分析**

## v2 与 v1 的差异（历史归档）

v2 在 v1 7 字段基础上增加 `combo_topology` + `combo_predicate` 两个枚举字段，把 `combo_synergy` 自由文本进一步结构化。v3 在 v2 基础上把 `combo_topology` 改名 `symbol_topology`（语义清理）。详情见 `framework/v2/README.md`。

## 这是什么

一个用于拆解、评分、聚类、差察 **装置类 RPB 游戏**（Random-Pool Builder Roguelike）的标准化框架。把每一款游戏映射到下面这条公式上：

```
产出 = (基础池 × random) + (基础池 × 符号协同) × (主动池 × 规则修饰)
```

这条公式把"装置类 RPB"压缩为 3 类参与者（基础池 / 主动池 / RPBD 玩家）+ 4 个核心机制（random / 符号协同 / 规则修饰 / checkpoint）。每款游戏在这套公式上能被一致地拆解成 7 个定性字段 + 4 维评分 + 5 个压力参数。

## 为什么要框架化

在 v1 之前，分析散落在多个独立 HTML 里。不同场合对同一款游戏的评分会漂移、字段会缺失、聚类无法跨表对齐。框架化解决这三个问题：

1. **可复现** —— 同一款游戏，不同时间 / 不同人，评分稳定（依赖 `scoring-rubric.md` 的档位锚点）
2. **可对比** —— 12 款游戏在同一套字段上拆解，跨维度差察才有意义
3. **可演进** —— 框架本身有版本号，结构性变更触发存量数据"过时"标记，但旧分析不会丢

## 读者路径

不同角色按需阅读：

| 角色 | 推荐路径 |
|------|----------|
| **第一次接触系统的人**             | 本文件 → `prompts.md`（看怎么用） |
| **要分析新游戏的 Claude session** | `prompts.md` → `method-decompose.md`（拆 7 字段） → `scoring-rubric.md`（钉 4 维分数） |
| **要做单维聚类的 Claude session** | `method-cluster.md` |
| **要做跨维差察的 Claude session** | `method-cross-dim.md` |
| **想理解评分边界的人**             | `scoring-rubric.md`（每档位都有 12 款实例锚点） |
| **程序（render.js / index.html）** | `schema.json` / `schema.js` |

## v1 的字段总览

### 4 维评分（5-10 分）

| key | 名称 | 衡量 |
|------|------|------|
| `random`    | random 表演    | 装置落位戏剧化、视觉爆发力 |
| `combo`     | combo 表演     | 连锁数值/动画爆发 |
| `pool`      | pool 设计      | 双层池架构清晰度与多样性 |
| `structure` | 肉鸽底线/压力曲线 | checkpoint 节奏、目标分、波次 |

聚合：
- 表演分 = (random + combo) / 2
- 结构分 = (pool + structure) / 2
- 总分 = 4 维之和（最高 40）
- 爆款阈值：总分 ≥ 32 且 双 8（表演 ≥ 8 且 结构 ≥ 8）

### 9 个定性字段（v3，重排顺序：symbol_topology 紧跟 random_design）

| key | 名称 | 公式中位置 |
|------|------|-----------|
| `pool_base_desc`       | 基础池描述         | 基础池 × random / 协同 |
| `pool_active_desc`     | 主动池描述         | 主动池 × 修饰协同 |
| `random_design`        | random 设计        | random（第一峰多巴胺，自由文本）|
| `symbol_topology`      | 符号拓扑           | random（v3 重命名 · 几何空间枚举，紧跟 random_design）|
| `combo_synergy`        | 符号协同 (combo1)  | 基础池 × 符号协同（自由文本）|
| `combo_predicate`      | 协同判定           | 在 symbol_topology 上做的 combo1 判定（枚举数组）|
| `combo_modifier`       | 修饰协同 (combo2)  | 主动池 × 修饰协同（乘法项）|
| `rpbd_construction`    | RPBD 构筑          | 不在公式内，决定下次的池参数 |
| `checkpoint_mechanism` | 压力机制           | 周期性检查产出 |

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
- 新建 `framework/v2/` 目录
- 改 `framework/current.txt` 内容为 `v2`
- `lib/render.js` 自动给所有 `analysis.framework_version === "v1"` 的游戏数据顶部打"过时"角标
- 用户决定哪些游戏按 v2 重做，渐进迁移

## v1 与既有 HTML 的对应

v1 框架是从 4 份既有 HTML 中提炼的（不是凭空设计）：

- `RPB装置类统一设计模型.html` — 公式 + 4 层递进 + 7 字段定义
- `双层池-spin流程可视化.html` — 基础池 vs 主动池 / 协同 vs 修饰 的实例（幸运房东 spin 案例）
- `12款装置RPB-MVP聚类分布.html` — 4 维评分实例 + 总分聚类范式
- `12款装置RPB-4维度独立聚类.html` — 单维度聚类方法 + 评分校准刻度

`scoring-rubric.md` 的 6 档锚点、`method-decompose.md` 的字段范例、`method-cluster.md` 的簇模式，全部从这 4 份 HTML 提炼。
