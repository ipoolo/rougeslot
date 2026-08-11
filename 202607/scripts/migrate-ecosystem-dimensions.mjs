import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(scriptDir, "../data/category-ecosystems.json");

const assessments = {
  "product.slotbound-demo": [0, 1, 3, "Slot 结果立即可读，不需要额外学习本轮好坏。", "玩家可在单 Spin 内让某一轴整体向下移动一格。", "多兵种、位置与局部交互使战果分阶段揭晓。"],
  "product.cloverpit": [0, 0, 4, "Slot 基础结果可直接识别。", "从 Spin 到结果封闭均由系统自动运行。", "倍率与连锁持续生成新的结果节点，形成链式揭晓。"],
  "product.spinera": [0, 0, 1, "Slot 结果容易判断。", "单 Spin 过程由系统自动完成。", "答案在 C₁ 后基本封闭，后续经营与策略决策不构成独立揭晓。"],
  "product.runeborn": [1, 1, 2, "基础 Slot 上增加少量符文关系。", "单 Spin 内存在少量结果干预。", "结果通过一次进一步的数值或效果兑现更新预测。"],
  "product.devils-due": [0, 0, 2, "暂按保留 Slot 即时认知处理。", "暂按单 Spin 自动运行处理。", "暂按两阶段数值兑现处理，具体揭晓结构待实机复核。"],
  "product.peglotto-demo": [0, 0, 3, "第一阶段结果容易识别。", "弹珠过程由系统自动运行。", "弹珠机形成多阶段反馈，但可能明显重置 C₁ 的价值锚点。"],
  "product.spin-tactics-demo": [1, 0, 1, "存在少量额外战术含义。", "单 Spin 主要自动运行。", "结果更接近确定性转译，具体结构待实机复核。"],
  "product.endgame-of-devil": [2, 0, 4, "需要理解自定义棋子协同，才能即时判断本轮好坏。", "从 Spin 到结果封闭均由系统自动运行。", "相邻战斗持续生成新的结果节点，形成链式反馈。"],
  "product.spin-hero": [1, 0, 1, "改动较直观，只需少量额外理解。", "单 Spin 基本自动运行。", "攻击与血量结果过早可计算，后续接近确定答案播放。"],
  "product.lucky-hero": [2, 3, 3, "需要理解角色与战斗协同。", "Spin 内存在连续且有意义的能量操作。", "操作后产生多段反馈，玩家多次修正预测。"],
  "product.lucky-hunter": [2, 0, 3, "需要理解自定义符号和战斗关系。", "一次 Spin 内没有玩家操作。", "战斗结果分阶段展开。"],
  "product.dog-and-goblin": [2, 3, 3, "自定义棋子关系需要学习。", "可在单 Spin 内多次移动我方布阵符号。", "战斗分阶段揭晓并持续更新预测。"],
  "product.slots-and-daggers": [2, 4, 4, "需要理解轮盘及武器关系。", "精细的单轴控制构成单 Spin 的主要操作。", "战果形成链式、多阶段持续揭晓。"],
  "product.rogue-slots": [1, 0, 2, "敌我符号关系较直观。", "单 Spin 主要自动运行。", "敌我交互使结果至少发生一次关键更新。"],
  "product.spinny-dungeon": [3, 1, 3, "需要识别武器、食物、魔法等关系，食物不足的即时风险也必须同时判断。", "可在单 Spin 内释放魔法。", "结果通过多个战斗阶段逐步展示。"],
  "product.slot-or-not": [2, 3, 2, "候选池与牌组规则需要理解。", "连续进行有意义的 choice_symbol 选择。", "战斗产生一次主要的后续兑现。"],
  "product.lever-warrior-bow-and-magic": [2, 1, 2, "多类战斗符号需要少量学习。", "单 Spin 内存在有限操作。", "战斗通过一次关键过程继续兑现 C₁。"],
  "product.hoptale-demo": [2, 1, 2, "自定义角色和关系产生学习成本。", "单 Spin 内存在有限介入。", "结果通过一次主要战斗过程继续揭晓。"],
  "product.luck-be-a-landlord": [1, 0, 2, "邻接、数量等关系符合直觉。", "Spin 过程自动运行。", "道具与连锁在 C₁ 后继续放大基础产出。"],
  "product.lucky-mayor": [3, 0, 2, "需要同时追踪多个区域和资源协同。", "Spin 过程全自动，外层安置不计入本维度。", "生产关系使结果发生一次主要更新。"],
  "product.cat-god-ranch": [2, 0, 2, "动物、产出链和资源网络提高即时判断成本。", "单 Spin 自动运行。", "产出链形成一次主要的后续兑现。"],
  "product.crop-rotation": [3, 0, 1, "轮作和生产关系需要学习并同时判断。", "单 Spin 主要自动运行。", "结果展开偏短，C₁ 后很快封闭。"],
  "product.die-shou-wei-cheng": [2, 0, 1, "自定义资源与防守关系需要理解。", "单 Spin 自动运行。", "数值结果较快封闭。"],
  "product.luckland": [2, 0, 1, "需要理解自定义符号关系。", "单 Spin 自动运行。", "C₂ 展开有限，答案较快封闭。"],
  "product.lucky-island": [3, 0, 2, "资源、区域与转化关系需要同时学习和判断。", "单 Spin 自动运行。", "结果通过多步转换发生一次主要更新。"],
  "product.re-spin-die-repeat-demo": [2, 0, 1, "自定义循环规则需要理解。", "单 Spin 主要自动运行。", "结果以短链形式封闭。"]
};

const bandFor = (score) => score <= 1 ? "low" : score === 2 ? "mid" : "high";
const document = JSON.parse(await fs.readFile(dataPath, "utf8"));
const seen = new Set();

for (const ecosystem of document.items) {
  for (const position of ecosystem.positions ?? []) {
    const assessment = assessments[position.product_id];
    if (!assessment) throw new Error(`缺少评分迁移配置：${position.product_id}`);
    if (seen.has(position.product_id)) throw new Error(`重复产品：${position.product_id}`);
    seen.add(position.product_id);
    const [cognitive, intervention, c2, cognitiveBasis, interventionBasis, c2Basis] = assessment;
    position.dimensions = {
      cognitive_load: { score: cognitive, band: bandFor(cognitive), basis: cognitiveBasis },
      spin_intervention: { score: intervention, band: bandFor(intervention), basis: interventionBasis },
      c2_reveal_depth: { score: c2, band: bandFor(c2), basis: c2Basis }
    };
    position.risk_tags = position.product_id === "product.peglotto-demo" ? ["c1_reset_risk"] : [];
    position.assessment_status = ["product.devils-due", "product.spin-tactics-demo"].includes(position.product_id)
      ? "needs_playtest"
      : "confirmed";
    position.assessment_note = position.assessment_status === "needs_playtest"
      ? "当前评分依据已有资料形成，需实机复核单 Spin 与 C₂ 的实际边界。"
      : "";
  }
}

if (seen.size !== 26 || Object.keys(assessments).length !== 26) {
  throw new Error(`评分数量异常：数据 ${seen.size}，配置 ${Object.keys(assessments).length}`);
}

document.version = "20260803-draft.10";
await fs.writeFile(dataPath, `${JSON.stringify(document, null, 2)}\n`);
console.log(`已写入 ${seen.size} 款游戏的三维评分。`);
