import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(scriptDir, "../data");
const variantsPath = path.join(dataDir, "category-variants.json");
const prototypesPath = path.join(dataDir, "category-prototypes.json");

const variants = JSON.parse(fs.readFileSync(variantsPath, "utf8"));
const prototypes = JSON.parse(fs.readFileSync(prototypesPath, "utf8"));
const prototypeById = new Map(prototypes.items.map((item) => [item.id, item]));
const now = new Date().toISOString();

const confirmedInheritance = {
  "variant.cloverpit": {
    P_t: "继承数值目标压力，以逐步上涨的债务、偿还期限与未达标后果判断累计 Spin_Result 是否达标。",
    Pool_Symbol: "继承固定符号池，核心 Slot 符号类型由游戏预设，不通过 BD 增删。",
    Random: "继承 Slot Random，每次 Spin 从预设符号池中按装置概率产生本次结果。",
    Put: "继承自动 Put，由装置完成转轴停止与符号落位，玩家不决定主要安置结果。",
    Show_TP: "继承 2D Slot 网格，以盘面承载符号位置、支付线关系与本次结果。",
    C1: "继承支付线、同符号与连续符号等 Slot 先验规则，由支付线匹配建立本次结果的基础价值。",
    C2: "继承数值二次揭晓，沿 C₁ 的基础结果通过倍率、连击与护身符效果逐步揭晓最终数值。",
    N: "继承数值阶段构筑周期，以连续 Spin 与阶段目标作为进入下一次构筑决策前的周期单位。",
    BD: "继承规则、倍率与概率构筑，通过护身符、倍率和概率选择持续影响后续 C₂ 二次揭晓与目标达成能力。"
  },
  "variant.endgame-of-devil": {
    P_t: "继承战斗目标压力，以敌我生命、战斗波次、Boss 与失败后果判断本轮战斗是否达标。",
    Pool_Symbol: "继承可构筑棋子／随从池，玩家获得、删除、升级或调整后续可以抽取的单位与符号。",
    Random: "继承从当前构筑池抽取的职责，每次 Spin 从当前棋子／随从池产生本次结果。",
    Put: "继承自动 Put，由装置把本次抽取结果写入主要承载空间，玩家不决定主要安置结果。",
    Show_TP: "继承 2D 装置舞台，以棋盘承载棋子位置、阵容关系与后续战斗表现。",
    C1: "继承符号协同，由棋子类型、位置、阵营、羁绊或阵容关系建立本次结果的基础价值。",
    C2: "继承战斗二次揭晓，沿 C₁ 建立的阵容价值，通过攻击、防御、技能与敌我状态变化逐步揭晓最终兑现程度。",
    N: "继承战斗间构筑周期，以连续 Spin、战斗或波次作为进入下一次构筑决策前的周期单位。",
    BD: "继承符号池、规则与数值构筑，通过棋子选择、升级和阵容调整持续改变后续战斗能力。"
  },
  "variant.luck-be-a-landlord": {
    Pool_Symbol: "继承可构筑符号池，玩家能够持续增加、删除或调整后续 Spin 可以抽到的符号。",
    Random: "继承从当前构筑池抽取的职责，每次 Spin 从玩家当前符号池产生本次结果。",
    Put: "继承自动 Put，由装置把本次抽取结果写入 2D Slot 网格，玩家不决定主要落位。"
  }
};

const exactChanges = {
  "variant.slotbound-demo": {
    Pool_Symbol: {
      operation: "extend",
      constraint_label: "扩展 BD 概率",
      summary:
        "继承：固定符号池身份，核心抽取对象来自预设的单位与符号配置，不通过 BD 增删 Slot 的核心符号类型。\n扩展：BD 可以影响符号触发概率。"
    },
    Put: {
      operation: "extend",
      constraint_label: "扩展 BD 转动与交换",
      summary:
        "继承：自动 Put，由装置把本次 Spin 结果自动写入 3×3 Slot 盘面，玩家不决定主要落位。\n扩展：BD 可以提供额外转动与位置互换能力。"
    },
    C2: {
      operation: "extend",
      constraint_label: "扩展多兵种战斗模拟",
      summary:
        "继承：沿 C₁ 已建立的支付线与单位基础结果进行战斗二次揭晓。\n扩展：通过召唤与稀有度、伤害、防御、单位等级／种类／阶级和自动战斗过程，逐步揭晓最终兑现程度。"
    },
    BD: {
      operation: "extend",
      constraint_label: "扩展兵种养成",
      summary:
        "继承：在传统 Slot 之外加入战斗相关内容、规则、倍率、概率或编队等构筑决策，影响后续 C₂ 二次揭晓与战斗结果。\n扩展：通过单位吸收、升星与分支职业进化调整概率、单位属性和后续战斗表现。"
    }
  },
  "variant.luck-be-a-landlord": {
    P_t: {
      operation: "extend",
      constraint_label: "扩展房租目标压力",
      summary:
        "继承：以目标值、剩余周期、当前数值差距和未达标后果构成目标数值压力。\n扩展：落实为逐阶段上涨的房租、付款期限与未达标失败后果。"
    },
    Show_TP: {
      operation: "override",
      constraint_label: "覆写为 2D Slot 网格",
      summary:
        "覆写：从品类原型允许的自有数值承载拓扑中确定使用 2D 离散 Slot 网格，使符号位置与邻接关系可以被 C₁ 读取。"
    },
    C1: {
      operation: "override",
      constraint_label: "覆写为直接产出 · 阈值 · 邻接",
      summary:
        "覆写：把品类原型的通用符号协同落实为符号直接产出，并通过数量阈值与网格邻接形成额外产出。"
    },
    C2: {
      operation: "extend",
      constraint_label: "扩展道具数值二次揭晓",
      summary:
        "继承：沿自有 C₁ 已建立的价值锚点进行数值二次揭晓。\n扩展：加入道具对 C₁ 结果的全局／局部增强、修饰与结果映射。"
    },
    N: {
      operation: "override",
      constraint_label: "覆写为 N = 1",
      summary:
        "覆写：把品类原型动态决定的数值阶段构筑周期落实为 N = 1，即每次 Spin 后进入一次符号选择类 BD。"
    },
    BD: {
      operation: "extend",
      constraint_label: "扩展选符号 · 删符号 · 获得道具",
      summary:
        "继承：通过符号池、规则与数值构筑持续影响后续结果。\n扩展：具体加入选择新符号、删除符号和获得道具等操作。"
    }
  },
  "variant.slot-or-not": {
    Random: {
      operation: "override",
      constraint_label: "覆写为候选池式 Random",
      summary:
        "覆写：将品类原型从当前构筑池直接产生结果的 Random，改为“随机生成 Choice_Pool → 玩家主动选择 → 形成 SingleSpin_Symbol”。"
    }
  },
  "variant.custom-ms4ag70p-7b1s4": {
    C2: {
      operation: "override",
      constraint_label: "覆写为策略经营结算",
      summary:
        "覆写：将品类原型沿 C₁ 结果展开的数值二次揭晓，改为资源分配与类文明策略经营；后续过程偏向规划决策，没有继续揭晓本次 C₁ 结果的兑现程度。"
    }
  },
  "variant.custom-ms4atumz-i0j6x": {
    C2: {
      operation: "override",
      constraint_label: "覆写为确定性战斗结算",
      summary:
        "覆写：将品类原型沿 C₁ 结果展开的战斗二次揭晓，改为依据已知血量与攻击力直接播放确定性战斗结果；过程没有持续改变玩家对本次兑现程度的预测。"
    }
  },
  "variant.peglotto-demo": {
    C2: {
      operation: "override",
      constraint_label: "覆写为弹珠机重新开奖",
      summary:
        "覆写：将品类原型沿 C₁ 结果展开的数值二次揭晓，改为时间与路径不确定性更高的弹珠机过程；该过程会重置或推翻 C₁ 已建立的价值锚点，体验上接近重新开奖。"
    }
  }
};

const placeholderPattern =
  /暂时继承|见产品公式观察|等待人工(?:调整|复核|拆解与确认)|具体变化待拆解/;

function isUnconfirmedField(variant, field) {
  const status = field.review_status
    ?? (variant.status === "structure_ready_content_pending" ? "draft" : "pending");
  return status === "draft" || status === "pending";
}

function cleanInheritedSummary(summary = "") {
  return summary
    .replace(/^当前按继承原型处理\s*[：:]\s*/, "继承：")
    .replace(/^继承：继承\s*/, "继承：")
    .replace(/\n?待确认：[^\n]*是否在该字段上存在扩展或覆写。?/g, "")
    .trim();
}

let changedFields = 0;

for (const variant of variants.items) {
  const parent = prototypeById.get(variant.prototype_id);
  if (!parent) continue;

  for (const [fieldKey, field] of Object.entries(variant.formula_changes ?? {})) {
    const before = JSON.stringify(field);

    if (field.operation === "inherit") {
      field.constraint_label = "继承原型";

      const customSummary = confirmedInheritance[variant.id]?.[fieldKey];
      if (customSummary) {
        field.summary = customSummary;
      } else if (placeholderPattern.test(field.summary ?? "")) {
        const parentField = parent.formula_changes?.[fieldKey];
        if (parentField?.summary) {
          field.summary = `继承：${parentField.summary}`;
        }
      }

      if (isUnconfirmedField(variant, field)) {
        field.summary = cleanInheritedSummary(field.summary);
      }
    }

    const replacement = exactChanges[variant.id]?.[fieldKey];
    if (replacement && field.review_status !== "confirmed") {
      Object.assign(field, replacement);
    }

    if (JSON.stringify(field) !== before) {
      field.last_modified_at = now;
      changedFields += 1;
    }
  }

  if (Object.values(variant.formula_changes ?? {}).some((field) => field.last_modified_at === now)) {
    variant.updated_at = now;
  }
}

fs.writeFileSync(variantsPath, `${JSON.stringify(variants, null, 2)}\n`);
console.log(`Normalized ${changedFields} variant formula fields.`);
