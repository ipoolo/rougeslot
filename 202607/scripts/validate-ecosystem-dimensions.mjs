import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(scriptDir, "../data/category-ecosystems.json");
const document = JSON.parse(await fs.readFile(dataPath, "utf8"));
const dimensions = ["cognitive_load", "spin_intervention", "c2_reveal_depth"];
const bandFor = (score) => score <= 1 ? "low" : score === 2 ? "mid" : "high";
const positions = document.items.flatMap((item) => item.positions ?? []);
const ids = positions.map((item) => item.product_id);
const errors = [];

for (const ecosystem of document.items ?? []) {
  if (ecosystem.coordinate_projection?.active_source !== "dimensions") {
    errors.push(`${ecosystem.prototype_id}.coordinate_projection.active_source 必须为 dimensions`);
  }
  if (ecosystem.coordinate_projection?.legacy_xy_status !== "retained_not_used") {
    errors.push(`${ecosystem.prototype_id} 未标记旧 x/y 为 retained_not_used`);
  }
}

if (positions.length !== 26) errors.push(`应有 26 款游戏，实际 ${positions.length} 款`);
if (new Set(ids).size !== ids.length) errors.push("存在重复游戏 ID");

for (const position of positions) {
  for (const key of dimensions) {
    const item = position.dimensions?.[key];
    if (!item) {
      errors.push(`${position.product_id} 缺少 ${key}`);
      continue;
    }
    if (!Number.isInteger(item.score) || item.score < 0 || item.score > 4) {
      errors.push(`${position.product_id}.${key}.score 不是 0—4 的整数`);
    }
    if (item.band !== bandFor(item.score)) errors.push(`${position.product_id}.${key}.band 映射错误`);
    if (!String(item.basis ?? "").trim()) errors.push(`${position.product_id}.${key}.basis 为空`);
  }
  if (!["confirmed", "needs_playtest"].includes(position.assessment_status)) {
    errors.push(`${position.product_id}.assessment_status 非法`);
  }
}

const needsPlaytest = positions.filter((item) => item.assessment_status === "needs_playtest").map((item) => item.product_id).sort();
if (needsPlaytest.length) errors.push(`当前三维评分均应为已确认状态，仍待复核：${needsPlaytest.join("、")}`);

const devilsDue = positions.find((item) => item.product_id === "product.devils-due");
if (!devilsDue || devilsDue.dimensions?.c2_reveal_depth?.score !== 2 || devilsDue.assessment_status !== "confirmed") {
  errors.push("Devils Due 的 C₂ 必须为 2 分且状态为已确认");
}

const spinTactics = positions.find((item) => item.product_id === "product.spin-tactics-demo");
if (!spinTactics || spinTactics.dimensions?.c2_reveal_depth?.score !== 1 || spinTactics.assessment_status !== "confirmed") {
  errors.push("Spin Tactics Demo 的 C₂ 必须为 1 分且状态为已确认");
}

const peglotto = positions.find((item) => item.product_id === "product.peglotto-demo");
if (!peglotto || peglotto.dimensions?.cognitive_load?.score !== 0 || peglotto.dimensions?.spin_intervention?.score !== 0 || peglotto.dimensions?.c2_reveal_depth?.score !== 3) {
  errors.push("PegLotto! Demo 必须为 0／0／3");
}
if (!peglotto?.risk_tags?.includes("c1_reset_risk")) errors.push("PegLotto! Demo 缺少 c1_reset_risk");
if (positions.some((item) => item.product_id !== "product.peglotto-demo" && (item.risk_tags ?? []).includes("c1_reset_risk"))) {
  errors.push("c1_reset_risk 只能属于 PegLotto! Demo");
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("生态评分校验通过：26 款游戏、三项 0—4 分、档位、状态与风险均一致。");
}
