# R_RougeSlot · RougeSlot 体验研究

RougeSlot 是一份围绕“双峰多巴胺体验”的 Slot、Slot 改玩法与肉鸽构筑研究。

- 当前定稿版本：`20260814`
- 阅读入口：`202607/index.html`
- 内容范围：体验模型、原型图谱、品类生态、46 款游戏库与核心洞察
- 在线版本：https://ipoolo.github.io/rougeslot/
- 发布方式：通过 GitHub Pages 自动发布 `202607/` 目录

## 在线版与本地版

GitHub Pages 提供只读浏览。页面会自动识别静态环境，关闭字段修改、人工确认和证据上传功能。

如需在本地编辑数据，请安装 Node.js，在仓库根目录运行：

```bash
node 202607/server.mjs
```

然后访问：

```text
http://localhost:8765/202607/
```

## 数据说明

当前游戏库包含 46 款产品。部分产品观察字段仍保留为研究草稿，用于后续补录，不影响定稿洞察的只读展示。

---

<details>
<summary>查看早期版本说明</summary>

# R_RougeSlot · RPB 装置类分析系统

个人用、HTML 产出、单一事实源驱动、Claude session 增量分析。

## 一句话使用

双击打开 `index.html`，看 12 款装置类 RPB。

要分析新游戏 / 改框架 / 跑聚类，直接在 Claude session 里说话。

---

## 系统架构

```
R_RougeSlot/
├── index.html                      # 总览（12 款卡片网格 + 管理面板 + 框架信息）
├── data/
│   ├── games.json                  # 单一事实源（12 款基础信息 + 分析）
│   └── games.js                    # JSON 包装壳（window.GAMES = ...）
├── framework/                      # ★ 分析框架（方法论 + schema）
│   ├── current.txt                 # 单行 "v1"——当前激活的框架版本
│   └── v1/
│       ├── README.md               # 框架总述（先读这个）
│       ├── schema.json             # 字段形状（程序消费）
│       ├── schema.js               # schema.json 的 JS 包装壳
│       ├── scoring-rubric.md       # 4 维评分校准（5/6/7/8/9/10 分锚点）
│       ├── method-decompose.md     # 7 字段拆解方法
│       ├── method-cluster.md       # 单维聚类方法
│       ├── method-cross-dim.md     # 跨维差察方法
│       └── prompts.md              # 4 个 session prompt 模板
├── lib/
│   ├── theme.css                   # 共享暗色主题
│   ├── render.js                   # 共享渲染函数（卡片、评分条、雷达图）
│   └── admin.js                    # HTML 表单逻辑（增删改 + 导出 JSON）
├── analysis/
│   ├── _template.html              # 单游戏详情页通用模板
│   └── <slug>.html                 # 各游戏的具体详情页（cp 自 _template.html）
├── clusters/
│   ├── _template.html              # 单维聚类通用模板
│   └── random.html / combo.html / pool.html / pressure.html
├── cross-dim.html                  # 跨维差察（雷达图 + 不平衡分类）
├── design-process/                 # v2 占位（设计流程 + 健壮性评估）
└── README.md                       # 本文件
```

## 数据同步规则（重要）

**两个事实源**，分别有同步壳：

| 事实源 (Claude 直接 Read/Edit) | JS 包装壳（HTML `<script>` 引入）|
|--------------------------------|-----------------------------------|
| `data/games.json`              | `data/games.js` (`window.GAMES`)              |
| `framework/v1/schema.json`     | `framework/v1/schema.js` (`window.FRAMEWORK_SCHEMA`) |

Claude 改完 JSON **必须立刻**同步重写对应 JS：

```bash
cd /Users/liupoolo/工作/Game/WorkSpace/R_RougeSlot
{ printf 'window.GAMES = '; cat data/games.json; printf ';\n'; } > data/games.js
# 框架 schema 极少变（只在 v1 → v2 升级时改）：
{ printf 'window.FRAMEWORK_SCHEMA = '; cat framework/v1/schema.json; printf ';\n'; } > framework/v1/schema.js
```

如果版本不一致（`games.json.framework_version` ≠ `framework/current.txt`），HTML 顶部会出现黄色警告条。

## 方法论（v1）

`framework/v1/` 下的 `.md` 不是给程序读的，是给 Claude 和人读的。

| 你想做什么                     | 先读哪份方法论 |
|-------------------------------|--------------|
| 第一次了解框架                  | `framework/v1/README.md` |
| 让 Claude 拆解一款新游戏        | `method-decompose.md` + `scoring-rubric.md` |
| 跑单维聚类                      | `method-cluster.md` |
| 跑跨维差察                      | `method-cross-dim.md` |
| 给 session 标准的提问句式         | `prompts.md` |

**维护规则**：
- **微调**（措辞 / 例子 / 锚点更细）：直接改 `framework/v1/` 内的 `.md`，不动版本号，存量数据不受影响
- **结构性变更**（加维度 / 改公式 / 改字段 key）：新建 `framework/v2/`，改 `framework/current.txt` 为 `v2`，render.js 自动给所有旧 analysis 顶部打"过时"角标

---

## Session Prompt 模板

### ① 添加新游戏（仅 basic 信息）

```
加一款新游戏：[中文名] [Steam URL]
```

Claude 会：
1. 抓 Steam 基础信息（名字 / 开发商 / 发售年 / header）
2. 追加到 `data/games.json` 的 games 数组（analysis = null）
3. 同步 `data/games.js`
4. 询问是否立即按 v1 框架做分析

### ② 分析单款游戏（v1 框架拆解）

```
分析 <slug>
# 或：分析 luck-be-a-landlord
```

Claude 会：
1. 读 `data/framework.json` 拿当前字段定义
2. 读 `data/games.json[slug].basic` 和 Steam 页面信息
3. 填充 4 维评分 + 7 个定性字段 + 5 个压力参数 + summary
4. 写回 `data/games.json` 并同步 games.js
5. 复制 `analysis/_template.html` 到 `analysis/<slug>.html`

### ③ 重做单维聚类

```
重做 random 维度聚类
# 维度可选：random / combo / pool / structure
```

Claude 会：
1. 读所有已分析游戏在该维度的评分 + 定性内容
2. 做簇划分（4 簇）+ 每簇说明 + 案例对比
3. 重写 `clusters/<dim>.html`

### ④ 跨维差察

```
跑一遍跨维差察
```

Claude 会：
1. 读所有已分析游戏的 4 维评分组合
2. 找不平衡模式（表演重 / 结构重 / 均衡）+ 设计模式归因 + 反例
3. 重写 `cross-dim.html`

### ⑤ 升级分析框架

```
升级框架到 v2，增加 [新维度名] 维度
# 或：v2 把压力曲线参数从 5 个扩到 7 个
```

Claude 会：
1. 改 `data/framework.json` 版本号 + 字段
2. 同步 framework.js
3. 标记所有 `games[*].analysis.framework_version` 为过时
4. README 提示哪些游戏需要按 v2 重新分析

---

## 增删改双路径

### 路径 A：Claude session（主路径，强烈推荐）

直接在对话里说："改幸运房东 random 评分为 9" / "删掉宾果贝蒂"，Claude 直接 Read/Edit JSON 并同步 JS。

### 路径 B：HTML 表单（辅助，应急用）

`index.html` 顶部"管理面板"折叠区可以：
- 添加新游戏（只填 basic）
- 编辑评分（4 维 prompt）
- 删除游戏

⚠ 浏览器无法直接写磁盘。修改后需要：
- 点 **下载 games.json** → 手动覆盖到 `data/games.json` → 重新生成 games.js
- 或点 **复制 JSON 到剪贴板** → 粘给 Claude："把这份 JSON 写回"

---

## 框架版本机制（v1）

每个游戏的 `analysis.framework_version` 字段记录它是按哪一版框架分析的。

- 框架升到 v2 时，所有 v1 的 analysis 自动标记为"过时"
- HTML 顶部显示黄色警告 + 列出需要重做的游戏
- 用户决定重做时机（不强制）

---

## 当前框架 · v1 概览

**公式**：`产出 = (基础池 × random) + (基础池 × 符号协同) × (主动池 × 规则修饰)`

**4 维评分**（5-10）：
- `random` —— random 表演（落位戏剧化）
- `combo` —— combo 表演（连锁数值/动画）
- `pool` —— pool 设计（双层池清晰度）
- `structure` —— 肉鸽底线 / 压力曲线

**7 个定性字段**：基础池 / 主动池 / random 设计 / 符号协同 / 规则修饰 / RPBD 构筑 / 压力机制

**5 个压力参数**：M（关数）/ N（每关 spin）/ T₀（起始）/ r（增长率）/ m_boss

**爆款阈值**：总分 ≥ 32 且 表演分 ≥ 8 且 结构分 ≥ 8

详见 `data/framework.json` 或 index.html 的"📐 当前分析框架"tab。

---

## 验证方式

- 双击 `index.html` 看到 12 款卡片网格
- 点幸运房东 → 跳转 `analysis/luck-be-a-landlord.html` 看完整拆解（已填）
- 其它 11 款 → 跳转后显示"尚未分析"提示
- `clusters/random.html` 等 4 个聚类页 → 显示按评分排序的散点图
- `cross-dim.html` → 已分析游戏的雷达图 + 不平衡分类

## 后续扩展

v1 完成后，按需触发：
- 在 session 里逐个补齐其他 11 款 analysis
- 数据全后跑各 cluster + cross-dim
- 启动 `design-process/` v2（设计 RPB 流程 + 阶段健壮性评估）

</details>
