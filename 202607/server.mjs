import { createServer } from "node:http";
import { readFile, rename, stat, writeFile } from "node:fs/promises";
import { dirname, extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const host = "127.0.0.1";
const port = Number(process.env.PORT ?? 8765);
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataRoot = join(projectRoot, "202607", "data");
const changeLogPath = join(dataRoot, "change-log.json");
const productsPath = join(dataRoot, "products.json");
const migrationReportPath = join(dataRoot, "migration-report.json");
const apiPrefix = "/202607/api/";

const FORMULA_FIELDS = new Set([
  "Pool_Symbol",
  "Random",
  "Put",
  "Show_TP",
  "C1",
  "C2",
  "N",
  "BD"
]);

const OPERATIONS = new Set([
  "inherit",
  "default",
  "restrict",
  "fix",
  "disable",
  "override",
  "extend",
  "compose"
]);

const REVIEW_STATUSES = new Set(["draft", "pending", "confirmed"]);

const collections = [
  {
    file: "mechanism-archetypes.json",
    type: "mechanism_archetype",
    fingerprintKey: "formula_constraints"
  },
  {
    file: "category-prototypes.json",
    type: "category_prototype",
    fingerprintKey: "formula_changes"
  },
  {
    file: "category-variants.json",
    type: "category_variant",
    fingerprintKey: "formula_changes"
  }
];

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp"
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  response.end(JSON.stringify(payload));
}

function text(value, name, maxLength) {
  if (typeof value !== "string") {
    throw new Error(`${name} 必须是文本`);
  }
  const trimmed = value.trim();
  if (!trimmed && name !== "review_note") {
    throw new Error(`${name} 不能为空`);
  }
  if (trimmed.length > maxLength) {
    throw new Error(`${name} 超过 ${maxLength} 字符`);
  }
  return trimmed;
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function atomicWriteJson(path, value) {
  const temporaryPath = `${path}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(temporaryPath, path);
}

async function readRequestJson(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 64 * 1024) {
      throw new Error("请求内容过大");
    }
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new Error("请求不是有效 JSON");
  }
}

async function locateNode(nodeId) {
  for (const collection of collections) {
    const path = join(dataRoot, collection.file);
    const document = await readJson(path);
    const index = document.items.findIndex((item) => item.id === nodeId);
    if (index >= 0) {
      return { ...collection, path, document, index, node: document.items[index] };
    }
  }
  return null;
}

function changeId() {
  return `change.${new Date().toISOString().replace(/\D/g, "").slice(0, 17)}.${Math.random().toString(36).slice(2, 8)}`;
}

async function appendChange(change) {
  let log;
  try {
    log = await readJson(changeLogPath);
  } catch {
    log = { version: "202607-draft.1", items: [] };
  }
  log.items.unshift(change);
  await atomicWriteJson(changeLogPath, log);
}

async function updateFormulaField(request, response) {
  try {
    const input = await readRequestJson(request);
    const nodeId = text(input.node_id, "node_id", 120);
    const field = text(input.field, "field", 40);
    const action = input.action === "confirm" ? "confirm" : "update";
    const operation = text(input.operation, "operation", 40);
    const constraintLabel = text(input.constraint_label, "constraint_label", 80);
    const summary = text(input.summary, "summary", 1200);
    const reviewNote = text(input.review_note ?? "", "review_note", 600);
    const reviewStatus = action === "confirm"
      ? "confirmed"
      : text(input.review_status, "review_status", 40);

    if (!FORMULA_FIELDS.has(field)) {
      throw new Error(`未知公式字段：${field}`);
    }
    if (!OPERATIONS.has(operation)) {
      throw new Error(`未知约束操作：${operation}`);
    }
    if (!REVIEW_STATUSES.has(reviewStatus)) {
      throw new Error(`未知确认状态：${reviewStatus}`);
    }

    const target = await locateNode(nodeId);
    if (!target) {
      throw new Error(`找不到模型节点：${nodeId}`);
    }

    const fingerprint = target.node[target.fingerprintKey];
    if (!fingerprint?.[field]) {
      throw new Error(`${nodeId} 缺少字段 ${field}`);
    }

    const before = structuredClone(fingerprint[field]);
    const timestamp = new Date().toISOString();
    const after = {
      ...before,
      operation,
      constraint_label: constraintLabel,
      summary,
      review_status: reviewStatus,
      review_note: reviewNote,
      last_modified_at: timestamp
    };

    if (reviewStatus === "confirmed") {
      after.confirmed_at = timestamp;
    } else {
      delete after.confirmed_at;
    }

    target.document.items[target.index][target.fingerprintKey][field] = after;
    await atomicWriteJson(target.path, target.document);
    await appendChange({
      id: changeId(),
      timestamp,
      action,
      node_id: nodeId,
      node_name: target.node.name,
      node_type: target.type,
      field,
      before,
      after,
      note: reviewNote
    });

    sendJson(response, 200, {
      ok: true,
      node_id: nodeId,
      node_type: target.type,
      field,
      entry: after
    });
  } catch (error) {
    sendJson(response, 400, { ok: false, error: error.message });
  }
}

async function serveStatic(url, response) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(url.pathname);
  } catch {
    sendJson(response, 400, { ok: false, error: "URL 编码无效" });
    return;
  }

  const relativePath = normalize(decodedPath).replace(/^[/\\]+/, "");
  let filePath = resolve(projectRoot, relativePath || "202607/index.html");
  if (filePath !== projectRoot && !filePath.startsWith(`${projectRoot}${sep}`)) {
    sendJson(response, 403, { ok: false, error: "禁止访问" });
    return;
  }

  try {
    const metadata = await stat(filePath);
    if (metadata.isDirectory()) {
      filePath = join(filePath, "index.html");
    }
    const body = await readFile(filePath);
    const extension = extname(filePath).toLowerCase();
    response.writeHead(200, {
      "Content-Type": mimeTypes[extension] ?? "application/octet-stream",
      "Cache-Control": [".html", ".css", ".js", ".mjs", ".json"].includes(extension)
        ? "no-store"
        : "public, max-age=3600",
      "X-Content-Type-Options": "nosniff"
    });
    response.end(body);
  } catch (error) {
    if (error.code === "ENOENT") {
      sendJson(response, 404, { ok: false, error: "文件不存在" });
      return;
    }
    sendJson(response, 500, { ok: false, error: "读取文件失败" });
  }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host ?? `${host}:${port}`}`);

  if (url.pathname === `${apiPrefix}status` && request.method === "GET") {
    try {
      const [products, migration] = await Promise.all([
        readJson(productsPath),
        readJson(migrationReportPath)
      ]);
      sendJson(response, 200, {
        ok: true,
        writable: true,
        root: "202607/data",
        products: products.items.length,
        migration_version: migration.version,
        legacy_formula_observations: migration.result.formula_observation_records
      });
    } catch {
      sendJson(response, 200, { ok: true, writable: true, root: "202607/data" });
    }
    return;
  }

  if (url.pathname === `${apiPrefix}changes` && request.method === "GET") {
    try {
      sendJson(response, 200, await readJson(changeLogPath));
    } catch {
      sendJson(response, 200, { version: "202607-draft.1", items: [] });
    }
    return;
  }

  if (url.pathname === `${apiPrefix}update-field` && request.method === "POST") {
    await updateFormulaField(request, response);
    return;
  }

  if (url.pathname.startsWith(apiPrefix)) {
    sendJson(response, 404, { ok: false, error: "API 不存在" });
    return;
  }

  if (!["GET", "HEAD"].includes(request.method)) {
    sendJson(response, 405, { ok: false, error: "请求方法不支持" });
    return;
  }

  await serveStatic(url, response);
});

server.listen(port, host, () => {
  console.log(`202607 数据管理服务已启动：http://${host}:${port}/202607/index.html#library`);
});
