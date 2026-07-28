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
const mechanismsPath = join(dataRoot, "mechanism-archetypes.json");
const prototypesPath = join(dataRoot, "category-prototypes.json");
const variantsPath = join(dataRoot, "category-variants.json");
const migrationReportPath = join(dataRoot, "migration-report.json");
const apiPrefix = "/202607/api/";

const FORMULA_FIELDS = new Set([
  "P_t",
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
const CLASSIFICATION_STATUSES = new Set(["unreviewed", "partial", "confirmed"]);
const RELATION_ROLES = new Set([
  "member",
  "representative",
  "cornerstone",
  "variant_instance"
]);

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

function nodeId(type) {
  const prefix = {
    mechanism_archetype: "mechanism",
    category_prototype: "prototype",
    category_variant: "variant"
  }[type];
  return `${prefix}.custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function nextOrder(items) {
  return Math.max(0, ...items.map((item) => Number(item.order) || 0)) + 10;
}

function emptyFingerprint(operation, nodeName) {
  return Object.fromEntries([...FORMULA_FIELDS].map((field) => [
    field,
    {
      operation,
      constraint_label: operation === "inherit" ? "继承父级" : "待定义",
      summary: operation === "inherit"
        ? `${nodeName}暂时继承父级的 ${field} 有效结果；等待人工调整。`
        : `${nodeName}的 ${field} 第一层约束等待人工定义。`,
      review_status: "draft",
      review_note: ""
    }
  ]));
}

function createVariantFromProduct(prototype, product, role, timestamp) {
  return {
    id: nodeId("category_variant"),
    name: product.name,
    type: "category_variant",
    variant_role: role === "cornerstone" ? "cornerstone" : "product_variant",
    status: "structure_ready_content_pending",
    order: Date.now(),
    prototype_id: prototype.id,
    product_ids: [product.id],
    summary: role === "cornerstone"
      ? `“${prototype.name}”的基石变体：作为品类公式比较基准，默认继承品类原型约束。`
      : `“${prototype.name}”下的具体游戏变体：${product.summary}`.slice(0, 240),
    definition: `本节点以《${product.name}》作为“${prototype.name}”下的具体游戏变体。默认继承品类原型的全部公式字段；请在公式数据表中逐项标记它相对原型的继承、收窄、扩展、覆写或禁用。`,
    formula_changes: emptyFingerprint("inherit", product.name),
    inheritance_summary: {
      inherited_fields: FORMULA_FIELDS.size,
      changed_fields: 0,
      note: "由游戏库归属自动建立，默认继承全部父级字段，等待人工比较和调整。"
    },
    created_at: timestamp
  };
}

function rebaseVariantToPrototype(variant, prototype, role, timestamp) {
  const parentChanged = variant.prototype_id !== prototype.id;
  variant.name = variant.name.trim();
  variant.prototype_id = prototype.id;
  variant.variant_role = role === "cornerstone" ? "cornerstone" : "product_variant";
  variant.updated_at = timestamp;
  if (!parentChanged) return;

  for (const [field, entry] of Object.entries(variant.formula_changes ?? {})) {
    entry.review_status = "pending";
    entry.review_note = [
      entry.review_note,
      `父级已调整为“${prototype.name}”，需要重新确认本字段相对新父级的关系。`
    ].filter(Boolean).join(" ");
    if (entry.operation === "inherit") {
      entry.constraint_label = "继承新原型";
      entry.summary = `${variant.name}暂时继承“${prototype.name}”的 ${field} 有效结果；等待人工复核。`;
    }
  }
}

async function updateProductClassification(request, response) {
  try {
    const input = await readRequestJson(request);
    const productId = text(input.product_id, "product_id", 120);
    const prototypeId = typeof input.prototype_id === "string"
      ? input.prototype_id.trim()
      : "";
    const relationRole = text(input.relation_role ?? "member", "relation_role", 40);
    const classificationStatus = text(
      input.classification_status ?? "confirmed",
      "classification_status",
      40
    );
    const note = text(input.note ?? "", "review_note", 600);

    if (!RELATION_ROLES.has(relationRole)) {
      throw new Error(`未知产品角色：${relationRole}`);
    }
    if (!CLASSIFICATION_STATUSES.has(classificationStatus)) {
      throw new Error(`未知分类状态：${classificationStatus}`);
    }

    const [products, mechanisms, prototypes, variants] = await Promise.all([
      readJson(productsPath),
      readJson(mechanismsPath),
      readJson(prototypesPath),
      readJson(variantsPath)
    ]);
    const productIndex = products.items.findIndex((item) => item.id === productId);
    if (productIndex < 0) throw new Error(`找不到产品：${productId}`);
    const product = products.items[productIndex];
    const before = structuredClone({
      relation_types: product.relation_types,
      mother_ids: product.mother_ids,
      prototype_ids: product.prototype_ids,
      variant_ids: product.variant_ids,
      classification_status: product.classification_status,
      classification_note: product.classification_note
    });

    let prototype = null;
    let mechanism = null;
    if (prototypeId) {
      prototype = prototypes.items.find((item) => item.id === prototypeId);
      if (!prototype) throw new Error(`找不到品类原型：${prototypeId}`);
      mechanism = mechanisms.items.find((item) => item.id === prototype.primary_mother_id);
      if (!mechanism) throw new Error(`${prototype.name} 缺少所属机制母型`);
    }
    const normalizedRole = prototype && relationRole === "cornerstone"
      ? "cornerstone"
      : prototype
        ? "variant_instance"
        : "member";

    for (const item of prototypes.items) {
      item.representative_product_ids = (item.representative_product_ids ?? [])
        .filter((id) => id !== productId);
    }
    const previousVariant = variants.items.find((item) =>
      item.id === (product.variant_ids ?? [])[0]
      || (item.product_ids ?? []).includes(productId)
    );
    for (const item of variants.items) {
      item.product_ids = (item.product_ids ?? []).filter((id) => id !== productId);
    }

    let variant = null;
    if (prototype) {
      if (previousVariant && previousVariant.product_ids.length === 0) {
        variant = previousVariant;
        variant.product_ids = [productId];
        variant.name = product.name;
        rebaseVariantToPrototype(variant, prototype, normalizedRole, new Date().toISOString());
      } else {
        variant = createVariantFromProduct(
          prototype,
          product,
          normalizedRole,
          new Date().toISOString()
        );
        variants.items.push(variant);
      }
      variant.summary = normalizedRole === "cornerstone"
        ? `“${prototype.name}”的基石变体：作为品类公式比较基准，默认继承品类原型约束。`
        : `“${prototype.name}”下的具体游戏变体：${product.summary}`.slice(0, 240);
      variant.definition = `本节点以《${product.name}》作为“${prototype.name}”下的具体游戏变体。默认继承品类原型的全部公式字段；请在公式数据表中逐项标记它相对原型的继承、收窄、扩展、覆写或禁用。`;

      if (normalizedRole === "cornerstone") {
        const previousCornerstones = new Set(prototype.representative_product_ids ?? []);
        prototype.representative_product_ids = [productId];
        for (const item of variants.items) {
          if (item.prototype_id === prototype.id && item.id !== variant.id) {
            item.variant_role = "product_variant";
          }
        }
        for (const otherProduct of products.items) {
          if (
            previousCornerstones.has(otherProduct.id)
            && otherProduct.id !== productId
          ) {
            otherProduct.relation_types = ["variant_instance"];
          }
        }
      }
    }

    variants.items = variants.items.filter((item) =>
      (item.product_ids ?? []).length > 0
    );

    const relationTypes = normalizedRole === "cornerstone"
      ? ["source", "representative"]
      : normalizedRole === "variant_instance"
          ? ["variant_instance"]
          : [];

    const timestamp = new Date().toISOString();
    const after = {
      relation_types: relationTypes,
      mother_ids: mechanism ? [mechanism.id] : [],
      prototype_ids: prototype ? [prototype.id] : [],
      variant_ids: variant ? [variant.id] : [],
      classification_status: prototype ? classificationStatus : "unreviewed",
      classification_note: note || (prototype
        ? `人工归类到“${prototype.name}”，角色为${normalizedRole === "cornerstone" ? "基石游戏" : "变体游戏"}；所属机制母型与品类变体映射由系统自动维护。`
        : "人工清除模型归属，等待重新分类。")
    };
    Object.assign(product, after);
    product.last_classified_at = timestamp;

    await Promise.all([
      atomicWriteJson(productsPath, products),
      atomicWriteJson(prototypesPath, prototypes),
      atomicWriteJson(variantsPath, variants)
    ]);
    await appendChange({
      id: changeId(),
      timestamp,
      action: "update_product_classification",
      product_id: productId,
      product_name: product.name,
      before,
      after,
      note
    });

    sendJson(response, 200, {
      ok: true,
      product_id: productId,
      variant_id: variant?.id ?? null,
      classification: after
    });
  } catch (error) {
    sendJson(response, 400, { ok: false, error: error.message });
  }
}

async function createModelNode(request, response) {
  try {
    const input = await readRequestJson(request);
    const type = text(input.type, "type", 40);
    const parentId = typeof input.parent_id === "string" ? input.parent_id.trim() : "";
    const timestamp = new Date().toISOString();
    let path;
    let document;
    let item;
    let linkedProduct = null;
    let productsDocument = null;

    if (type === "mechanism_archetype") {
      const name = text(input.name, "name", 80);
      const summary = text(input.summary, "summary", 240);
      const definition = text(input.definition, "definition", 1200);
      path = mechanismsPath;
      document = await readJson(path);
      item = {
        id: nodeId(type),
        name,
        type,
        status: "working",
        order: nextOrder(document.items),
        summary,
        definition,
        formula_constraints: emptyFingerprint("default", name),
        open_axes: ["等待通过公式字段编辑器补充开放变量。"],
        created_at: timestamp
      };
    } else if (type === "category_prototype") {
      const name = text(input.name, "name", 80);
      const summary = text(input.summary, "summary", 240);
      const definition = text(input.definition, "definition", 1200);
      const mechanisms = await readJson(mechanismsPath);
      if (!mechanisms.items.some((entry) => entry.id === parentId)) {
        throw new Error("创建品类原型前必须选择有效的机制母型");
      }
      path = prototypesPath;
      document = await readJson(path);
      item = {
        id: nodeId(type),
        name,
        name_status: "working",
        type,
        status: "working",
        order: nextOrder(document.items),
        primary_mother_id: parentId,
        composed_mother_ids: [],
        representative_product_ids: [],
        classification_axes: {},
        summary,
        definition,
        formula_changes: emptyFingerprint("inherit", name),
        identity_rules: ["等待通过公式字段编辑器补充身份规则。"],
        created_at: timestamp
      };
    } else if (type === "category_variant") {
      throw new Error("品类变体由具体游戏的品类归属自动生成，请在游戏库或图谱管理中配置游戏");
    } else {
      throw new Error(`未知节点类型：${type}`);
    }

    document.items.push(item);
    await Promise.all([
      atomicWriteJson(path, document),
      ...(productsDocument ? [atomicWriteJson(productsPath, productsDocument)] : [])
    ]);
    await appendChange({
      id: changeId(),
      timestamp,
      action: "create_model_node",
      node_id: item.id,
      node_name: item.name,
      node_type: item.type,
      parent_id: parentId || null,
      product_id: linkedProduct?.id ?? null,
      product_name: linkedProduct?.name ?? null,
      after: item
    });
    sendJson(response, 201, { ok: true, node: item });
  } catch (error) {
    sendJson(response, 400, { ok: false, error: error.message });
  }
}

async function updateModelNode(request, response) {
  try {
    const input = await readRequestJson(request);
    const nodeIdValue = text(input.node_id, "node_id", 120);
    const name = text(input.name, "name", 80);
    const summary = text(input.summary, "summary", 240);
    const definition = text(input.definition, "definition", 1200);
    const parentId = typeof input.parent_id === "string" ? input.parent_id.trim() : "";
    const target = await locateNode(nodeIdValue);
    if (!target || !["mechanism_archetype", "category_prototype"].includes(target.type)) {
      throw new Error("只有机制母型与品类原型支持手动编辑");
    }

    const before = structuredClone(target.node);
    const timestamp = new Date().toISOString();
    target.node.name = name;
    target.node.summary = summary;
    target.node.definition = definition;
    target.node.updated_at = timestamp;

    let products = null;
    if (target.type === "category_prototype") {
      const mechanisms = await readJson(mechanismsPath);
      if (!mechanisms.items.some((item) => item.id === parentId)) {
        throw new Error("品类原型必须选择有效的机制母型");
      }
      const parentChanged = target.node.primary_mother_id !== parentId;
      target.node.primary_mother_id = parentId;
      if (parentChanged) {
        products = await readJson(productsPath);
        for (const product of products.items) {
          if ((product.prototype_ids ?? []).includes(target.node.id)) {
            product.mother_ids = [parentId];
          }
        }
        for (const entry of Object.values(target.node.formula_changes ?? {})) {
          entry.review_status = "pending";
          entry.review_note = [
            entry.review_note,
            "所属机制母型发生变化，需要重新确认相对父级的字段关系。"
          ].filter(Boolean).join(" ");
        }
      }
    }

    await Promise.all([
      atomicWriteJson(target.path, target.document),
      ...(products ? [atomicWriteJson(productsPath, products)] : [])
    ]);
    await appendChange({
      id: changeId(),
      timestamp,
      action: "update_model_node",
      node_id: target.node.id,
      node_name: target.node.name,
      node_type: target.type,
      before,
      after: target.node
    });
    sendJson(response, 200, { ok: true, node: target.node });
  } catch (error) {
    sendJson(response, 400, { ok: false, error: error.message });
  }
}

async function deleteModelNode(request, response) {
  try {
    const input = await readRequestJson(request);
    const nodeIdValue = text(input.node_id, "node_id", 120);
    const target = await locateNode(nodeIdValue);
    if (!target || !["mechanism_archetype", "category_prototype"].includes(target.type)) {
      throw new Error("只有机制母型与品类原型支持手动删除");
    }

    const [prototypes, variants, products] = await Promise.all([
      readJson(prototypesPath),
      readJson(variantsPath),
      readJson(productsPath)
    ]);

    if (target.type === "mechanism_archetype") {
      const children = prototypes.items.filter((item) => item.primary_mother_id === target.node.id);
      const linkedProducts = products.items.filter((item) =>
        (item.mother_ids ?? []).includes(target.node.id)
      );
      if (children.length || linkedProducts.length) {
        throw new Error(
          `无法删除“${target.node.name}”：仍有 ${children.length} 个品类原型、${linkedProducts.length} 款游戏。请先移动下级关系。`
        );
      }
    } else {
      const childVariants = variants.items.filter((item) => item.prototype_id === target.node.id);
      const linkedProducts = products.items.filter((item) =>
        (item.prototype_ids ?? []).includes(target.node.id)
      );
      if (childVariants.length || linkedProducts.length) {
        throw new Error(
          `无法删除“${target.node.name}”：仍有 ${childVariants.length} 个游戏变体、${linkedProducts.length} 款游戏。请先调整游戏归属。`
        );
      }
    }

    const removed = target.document.items.splice(target.index, 1)[0];
    const timestamp = new Date().toISOString();
    await atomicWriteJson(target.path, target.document);
    await appendChange({
      id: changeId(),
      timestamp,
      action: "delete_model_node",
      node_id: removed.id,
      node_name: removed.name,
      node_type: target.type,
      before: removed,
      after: null
    });
    sendJson(response, 200, { ok: true, deleted: removed.id });
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

  if (url.pathname === `${apiPrefix}update-product-classification` && request.method === "POST") {
    await updateProductClassification(request, response);
    return;
  }

  if (url.pathname === `${apiPrefix}create-node` && request.method === "POST") {
    await createModelNode(request, response);
    return;
  }

  if (url.pathname === `${apiPrefix}update-node` && request.method === "POST") {
    await updateModelNode(request, response);
    return;
  }

  if (url.pathname === `${apiPrefix}delete-node` && request.method === "POST") {
    await deleteModelNode(request, response);
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
