# prompts.md · 4 个标准 session prompt 模板

session 用户对 Claude 说话的 4 个标准入口。每个入口附带"Claude 应该读哪份方法论"的指引。

---

## ① 添加新游戏（仅 basic 信息）

**用户说**：
```
加一款新游戏：[中文名] [Steam URL]
```

**示例**：
> 加一款新游戏：宇宙骰场 https://store.steampowered.com/app/9999999/

**Claude 操作流程**：
1. 抓取 Steam 基础信息（中英名 / 开发商 / 发售年 / header URL）
2. 构造 slug（kebab-case 英文名）
3. 读 `data/games.json`，追加到 `games` 数组（仅 basic 部分，`analysis: null`）
4. 同步重写 `data/games.js`：
   ```bash
   { printf 'window.GAMES = '; cat data/games.json; printf ';\n'; } > data/games.js
   ```
5. 询问："基础信息已加。要立即按 v1 框架做拆解分析吗？"
6. 复制 `analysis/_template.html` 到 `analysis/<slug>.html`（即使 analysis 为空，详情页也能显示"未分析"提示）

**Claude 不需要读哪份方法论**：本流程不涉及评分或拆解，纯数据录入。

---

## ② 分析单款游戏（v1 框架拆解）

**用户说**：
```
分析 <slug>
# 或：分析幸运房东
# 或：分析 luck-be-a-landlord
```

**Claude 操作流程**：
1. **先读** `framework/v1/method-decompose.md` —— 拿 7 字段拆解方法
2. **再读** `framework/v1/scoring-rubric.md` —— 拿 4 维评分锚点
3. 读 `data/games.json[slug].basic` 拿到游戏基础信息
4. 如有需要，访问 Steam 页面或 SteamDB 补充信息
5. 按 `method-decompose.md` 的 7 字段框架填充 `qualitative`：
   - `pool_base_desc` / `pool_active_desc`
   - `random_design`
   - `combo_synergy` / `combo_modifier`
   - `rpbd_construction`
   - `checkpoint_mechanism`
6. 按 `scoring-rubric.md` 的 6 档锚点钉 4 维评分
7. 填 5 个压力参数（`M`, `N`, `T0`, `r`, `m_boss`），未知留 `null`
8. 写 1-2 句 `summary`（本游戏在 RPB 设计上的位置）
9. **用 method-decompose.md 末尾的 7 题验证清单自检**
10. 写回 `data/games.json[slug].analysis`，更新 `analysis.framework_version` 为 `current.txt` 内容
11. 同步重写 `data/games.js`
12. 确保 `analysis/<slug>.html` 存在（不存在就 `cp _template.html → <slug>.html`）

**输出反馈**：告诉用户 4 维评分 + 总分 + 在哪个等级，以及最值得提的 1-2 个观察。

---

## ③ 重做单维聚类

**用户说**：
```
重做 random 维度聚类
# 维度可选：random / combo / pool / structure（structure 也可叫"压力"或"肉鸽底线"）
```

**Claude 操作流程**：
1. **先读** `framework/v1/method-cluster.md` —— 拿聚类方法
2. **顺便读** `framework/v1/scoring-rubric.md` 中对应维度的子族划分（已经有完整的子族 → 评分映射）
3. 从 `data/games.json` 抽出所有 `analysis !== null` 游戏在该维度的：
   - `scores.<dim>` 评分
   - 对应 qualitative 字段
4. 按 `method-cluster.md` 的 4 步：
   - Step 1 抽取
   - Step 2 按区间分簇（≥9 / 7-8 / 5-6 / null）
   - Step 3 簇内提取核心模式（5-10 字模式名）
   - Step 4 跨簇对比因果叙事（不要虚词，做对比表）
5. 重写 `clusters/<dim>.html`，在基础模板生成的散点条之后追加：
   - 4-5 个簇卡片
   - 关键洞察（跨簇因果）
   - 设计实践建议
6. 用户可在 session 中说"再细一点"或"换一个角度"做迭代

**输出反馈**：告诉用户聚出多少簇、最有意思的发现是什么。

---

## ④ 跑跨维差察

**用户说**：
```
跑一遍跨维差察
```

**Claude 操作流程**：
1. **先读** `framework/v1/method-cross-dim.md` —— 拿差察方法
2. **顺便读** `framework/v1/scoring-rubric.md` 的"聚合指标"部分（4 象限 / 双 8 阈值定义）
3. 从 `data/games.json` 抽出所有 `analysis !== null` 游戏的全部 `scores`（4 维）+ 全部 `qualitative`
4. 按 `method-cross-dim.md` 的 5 步：
   - Step 1 计算表演分 / 结构分
   - Step 2 4 象限分类（双高 / 表演重 / 结构重 / 双低）
   - Step 3 找不平衡子模式（拉低/拉高的具体维度）
   - Step 4 因果归因（结构性 / 设计选择 / 执行问题）
   - Step 5 输出 2-4 个反例
5. 重写 `cross-dim.html`，在基础雷达图之后追加：
   - 4 象限分类
   - 子模式归因
   - 反例分析
   - 设计取舍模式总结
6. 在文件顶部写 `分析时间：YYYY-MM-DD · 数据快照：N 款已分析`

**输出反馈**：告诉用户最关键的 1-2 个发现 + 1 个反例。

---

## ⑤ 升级框架（v1 → v2）· 特殊流程

**用户说**：
```
升级框架到 v2，[变更说明]
# 例：升级框架到 v2，把压力曲线参数从 5 个扩到 7 个
# 例：升级框架到 v2，加一个"美术张力"维度
```

**Claude 操作流程**：
1. 在 `framework/` 下创建 `v2/` 目录，从 `v1/` 复制所有文件作为起点
2. 修改 `v2/schema.json`（新增/改字段 + 把 `version` 改为 "v2"）
3. 同步生成 `v2/schema.js`
4. 修改 `v2/README.md` 顶部的"v2 与 v1 的差异"章节，列出新增/改动
5. 修改 `v2/method-decompose.md` / `v2/scoring-rubric.md` / `v2/method-cluster.md` / `v2/method-cross-dim.md` / `v2/prompts.md` 中受影响的部分（保持其它原样）
6. 改 `framework/current.txt` 内容为 `v2`
7. 改所有 HTML 引用：`framework/v1/schema.js` → `framework/v2/schema.js`
8. 报告：
   - "升级到 v2 完成"
   - "现存 X 款 analysis 标记为 v1 过时（顶部黄条警告）"
   - "如需按 v2 重新分析，发：分析 <slug>"

**重要**：不删除 v1 目录，保留作为历史归档。

---

## 通用要求（所有 session 流程都要遵守）

### 数据同步

凡是改 `data/games.json`，**必须立刻同步**重写 `data/games.js`：

```bash
cd /Users/liupoolo/工作/Game/WorkSpace/R_RougeSlot
{ printf 'window.GAMES = '; cat data/games.json; printf ';\n'; } > data/games.js
```

凡是改 `framework/v1/schema.json`（极少发生），同样：

```bash
{ printf 'window.FRAMEWORK_SCHEMA = '; cat framework/v1/schema.json; printf ';\n'; } > framework/v1/schema.js
```

### 不能凭空编

- 评分必须按 `scoring-rubric.md` 的锚点对照
- 7 字段必须按 `method-decompose.md` 的取值范例参考（特别是 LBL 的 200+ 符号 / 100+ 道具 / 邻接互动 / 道具全局倍率这些已经验证的实例）
- 反例分析中游戏的"市场表现"如果不掌握，**直接写"市场表现：未追踪"**，不要瞎编

### 必须自检

- 分析游戏后跑 `method-decompose.md` 末尾的 7 题验证清单
- 聚类后检查每簇是否有 ≥ 1 个真实游戏作为锚点
- 差察后检查反例是否真实存在（不要把"假想游戏"当反例）

### 反馈

每次操作完成后告诉用户：
- 改了哪些文件
- 关键发现是什么（1-2 句）
- 下一步建议（如"现在还有 11 款未分析，要继续吗？"）
