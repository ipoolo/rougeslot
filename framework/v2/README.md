# RPB 装置类统一设计模型 · v2

R_RougeSlot 系统的当前分析框架版本。本目录是这一版本的"完整方法论快照"——程序消费 + 人/Claude 消费同源。

## v2 与 v1 的差异

**变更类型**：结构性变更（新增 2 个 qualitative 字段 + 2 个枚举集）

**新增字段**（在 `qualitative_fields` 中）：

| key | 名称 | 类型 | 含义 |
|-----|------|------|------|
| `combo_topology` | 协同拓扑 | enum（单选）| 符号协同发生的几何空间：`0D_multiset` / `1D_sequence` / `1D_ring` / `2D_grid` / `2D_physical` |
| `combo_predicate` | 协同判定 | enum_array（多选）| 触发协同的判定规则：`threshold` / `type_dict` / `adjacency` / `line_complete` / `chain` / `trigger_chain` / `path` / `cascade` |

**为什么加**：v1 的 `combo_synergy` 是自由文本，描述虽然完整但**不可机器对齐**——12 款游戏跑 combo 维度聚类时，必须靠人工读自由文本归簇。v2 把"协同发生在哪个拓扑空间 × 用什么规则判定"显式结构化，让 combo 维度聚类可以直接 `group by topology + predicate`。

**v1 自由文本字段保留**：`combo_synergy` 字段不删，作为自由描述继续承载"具体加成数值"等不便枚举的细节。v2 是**叠加**而非替换。

**衍生集群**（已在 12 款样本上验证）：

| 集群名 | (topology, predicate) | combo 分跨度 | 成员数 |
|-------|----------------------|-------------|------|
| 多重集字典族 | `0D_multiset` × `type_dict` | 5–10 | 5 |
| 序列链式族（复合层） | `1D_sequence` × `trigger_chain` | 仅作为放大器 | 1 |
| 网格邻接族 | `2D_grid` × `adjacency` | 8–8（钉死）| 2 |
| 网格连线族 | `2D_grid` × `line_complete` | 8 | 1 |
| 圆环复合族 | `1D_ring` × `(adjacency + type_dict)` | 7 | 1 |
| 物理路径族 | `2D_physical` × `(path + cascade)` | 8–10 | 3 |

**对存量数据的影响**：

- 所有 `analysis.framework_version === "v1"` 的游戏在详情页顶部显示"过时"角标（由 `lib/render.js` 自动检测）
- v1 字段全部兼容；v2 渲染时新字段缺失则显示"未填（v1 数据）"
- 不强制重做分析；用户决定哪些游戏按 v2 重跑（发"分析 \<slug\>"即按 v2 重做）

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

### 9 个定性字段（v2，新增 combo_topology / combo_predicate）

| key | 名称 | 公式中位置 |
|------|------|-----------|
| `pool_base_desc`       | 基础池描述   | 基础池 × random / 协同 |
| `pool_active_desc`     | 主动池描述   | 主动池 × 规则修饰 |
| `random_design`        | random 设计  | random（第一峰多巴胺）|
| `combo_synergy`        | 符号协同     | 基础池 × 符号协同（加法项，自由文本）|
| `combo_topology`       | 协同拓扑     | 基础池 × 符号协同（v2 新增，几何空间枚举）|
| `combo_predicate`      | 协同判定     | 基础池 × 符号协同（v2 新增，判定规则枚举数组）|
| `combo_modifier`       | 规则修饰     | 主动池 × 规则修饰（乘法项）|
| `rpbd_construction`    | RPBD 构筑    | 不在公式内，决定下次的池参数 |
| `checkpoint_mechanism` | 压力机制     | 周期性检查产出 |

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
