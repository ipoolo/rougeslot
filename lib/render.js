/* R_RougeSlot · 共享渲染库
   ==========================
   依赖：
     - window.GAMES            (data/games.js)
     - window.FRAMEWORK_SCHEMA (framework/<current>/schema.js，路径以 framework/current.txt 为准)
   提供：游戏卡片、评分条、字段块、URL slug 解析、JSON↔JS 一致性提示

   方法论文档（人/Claude 消费，不在此文件中加载，路径以 framework/current.txt 为准）：
     - framework/<current>/README.md
     - framework/<current>/method-decompose.md  (拆解定性字段：v1=7、v2=9)
     - framework/<current>/scoring-rubric.md    (4 维评分校准)
     - framework/<current>/method-cluster.md    (单维聚类)
     - framework/<current>/method-cross-dim.md  (跨维差察)
     - framework/<current>/prompts.md           (5 个 session prompt 模板)
*/

(function () {
  'use strict';

  const RR = (window.RR = window.RR || {});

  /* ============ 数据访问 ============ */

  RR.getAllGames = function () {
    if (!window.GAMES || !Array.isArray(window.GAMES.games)) {
      console.error('[RR] window.GAMES 未加载');
      return [];
    }
    return window.GAMES.games;
  };

  RR.getGame = function (slug) {
    return RR.getAllGames().find(g => g.slug === slug) || null;
  };

  RR.getFramework = function () {
    if (!window.FRAMEWORK_SCHEMA) {
      console.warn('[RR] window.FRAMEWORK_SCHEMA 未加载');
      return null;
    }
    return window.FRAMEWORK_SCHEMA;
  };

  /* 从 query string 取 slug：?slug=luck-be-a-landlord */
  RR.getSlugFromUrl = function () {
    const params = new URLSearchParams(window.location.search);
    return params.get('slug');
  };

  /* ============ 渲染元件 ============ */

  /**
   * 渲染游戏卡片（用于 index.html 网格）
   * @param {object} game
   * @param {object} opts - { onEdit, onDelete, baseHref }
   */
  RR.renderGameCard = function (game, opts = {}) {
    const baseHref = opts.baseHref || './analysis/';
    const card = document.createElement('div');
    card.className = 'game-card';
    card.dataset.slug = game.slug;

    // header image
    const img = document.createElement('div');
    img.className = 'header-img';
    if (game.basic.header_url) {
      img.style.backgroundImage = `url('${game.basic.header_url}')`;
    } else {
      img.classList.add('placeholder');
      img.textContent = '无封面';
    }
    card.appendChild(img);

    // body
    const body = document.createElement('div');
    body.className = 'body';
    body.innerHTML = `
      <div class="name-cn">${escapeHtml(game.basic.name_cn || game.slug)}</div>
      <div class="name-en">${escapeHtml(game.basic.name_en || '')} · ${escapeHtml(game.basic.developer || '?')} · ${game.basic.release_year || '?'}</div>
      <div class="oneliner">${escapeHtml(game.basic.core_loop_oneliner || '')}</div>
      <div class="tags">${(game.basic.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
      <div class="scores-row">
        ${RR._renderScorePills(game.analysis)}
      </div>
    `;
    card.appendChild(body);

    // actions
    const act = document.createElement('div');
    act.className = 'actions';
    const detailUrl = `${baseHref}${encodeURIComponent(game.slug)}.html`;
    act.innerHTML = `
      <a href="${detailUrl}" title="详情">详情</a>
      <a href="${escapeHtml(game.basic.steam_url || '#')}" target="_blank" rel="noopener" title="Steam 商店">Steam</a>
    `;
    if (opts.onEdit) {
      const btn = document.createElement('button');
      btn.textContent = '编辑评分';
      btn.addEventListener('click', () => opts.onEdit(game.slug));
      act.appendChild(btn);
    }
    if (opts.onDelete) {
      const btn = document.createElement('button');
      btn.className = 'danger';
      btn.textContent = '删除';
      btn.addEventListener('click', () => opts.onDelete(game.slug));
      act.appendChild(btn);
    }
    card.appendChild(act);

    return card;
  };

  RR._renderScorePills = function (analysis) {
    if (!analysis || !analysis.scores) {
      return '<span class="score-pill empty">未分析</span>';
    }
    const s = analysis.scores;
    const total = (s.random || 0) + (s.combo || 0) + (s.pool || 0) + (s.structure || 0);
    return `
      <span class="score-pill" title="random">R<b>${s.random ?? '-'}</b></span>
      <span class="score-pill" title="combo">C<b>${s.combo ?? '-'}</b></span>
      <span class="score-pill" title="pool">P<b>${s.pool ?? '-'}</b></span>
      <span class="score-pill" title="structure">S<b>${s.structure ?? '-'}</b></span>
      <span class="score-pill" title="total">总<b>${total || '-'}</b></span>
    `;
  };

  /**
   * 渲染 4 维评分条
   * @param {object} scores - { random, combo, pool, structure }
   */
  RR.renderScoreBars = function (scores) {
    const container = document.createElement('div');
    container.className = 'score-bars';
    const fw = RR.getFramework();
    const dims = (fw && fw.score_dimensions) || [
      { key: 'random', name: 'random 表演' },
      { key: 'combo', name: 'combo 表演' },
      { key: 'pool', name: 'pool 设计' },
      { key: 'structure', name: '肉鸽底线/压力' }
    ];
    for (const dim of dims) {
      const v = scores ? scores[dim.key] : null;
      const row = document.createElement('div');
      row.className = 'score-row';
      const pct = v ? ((v - 5) / 5) * 100 : 0;  // 5-10 → 0-100%
      row.innerHTML = `
        <div class="lbl">${escapeHtml(dim.name)}</div>
        <div class="bar-bg"><div class="bar-fg" style="width:${pct}%"></div></div>
        <div class="val ${v == null ? 'empty' : ''}">${v == null ? '—' : v}</div>
      `;
      container.appendChild(row);
    }
    return container;
  };

  /**
   * 渲染定性字段块列表
   * @param {object} qualitative - { pool_base_desc, ... }
   */
  RR.renderQualitativeBlocks = function (qualitative) {
    const container = document.createElement('div');
    const fw = RR.getFramework();
    const fields = (fw && fw.qualitative_fields) || [];
    for (const f of fields) {
      const v = qualitative ? qualitative[f.key] : null;
      const display = formatQualitativeValue(v, f, fw);
      const isEmpty = !display;
      const block = document.createElement('div');
      block.className = 'field-block';
      block.innerHTML = `
        <div class="field-name">${escapeHtml(f.name)}</div>
        <div class="field-value ${isEmpty ? 'empty' : ''}">${isEmpty ? '（未填写）' : display}</div>
      `;
      container.appendChild(block);
    }
    return container;
  };

  /**
   * 把字段值格式化为可显示的 HTML 片段。
   * - 普通自由文本：HTML 转义后返回
   * - enum 单选 / enum_array 多选（v2+）：把英文 key 映射为 schema 中的中文 name；hover 显示原 key
   */
  function formatQualitativeValue(v, fieldDef, fw) {
    if (v === null || v === undefined || v === '') return '';
    const enumName = fieldDef && fieldDef.enum_ref;
    if (enumName) {
      const enumDef = (fw && Array.isArray(fw[enumName])) ? fw[enumName] : null;
      const lookup = (key) => {
        if (!enumDef) return null;
        return enumDef.find(e => e.key === key) || null;
      };
      const renderItem = (key) => {
        const item = lookup(key);
        if (item) return `<span title="${escapeHtml(key)}">${escapeHtml(item.name)}</span>`;
        return escapeHtml(String(key));
      };
      if (fieldDef.type === 'enum') return renderItem(v);
      if (fieldDef.type === 'enum_array') {
        const arr = Array.isArray(v) ? v : [v];
        return arr.map(renderItem).join(' · ');
      }
    }
    if (Array.isArray(v)) return escapeHtml(v.join(', '));
    return escapeHtml(String(v));
  }

  /**
   * 启发式：判定一款游戏的压力曲线类型
   * 优先看 pressure_params.r 数值/字符串，其次扫 checkpoint_mechanism + summary 中的关键词
   * 返回 { type: 'exponential'|'linear'|'jump'|'unknown', label, detail, rNumeric? }
   */
  RR.classifyPressureCurve = function (game) {
    if (!game || !game.analysis) return { type: 'unknown', label: '未识别', detail: '尚未分析' };
    const params = game.analysis.pressure_params || {};
    const q = game.analysis.qualitative || {};
    const text = [q.checkpoint_mechanism || '', game.analysis.summary || ''].join(' ');

    const r = params.r;
    let rNumeric = null;
    if (typeof r === 'number') rNumeric = r;
    else if (typeof r === 'string') {
      const m = r.match(/(\d+(?:\.\d+)?)/);
      if (m) rNumeric = parseFloat(m[1]);
      if (r.includes('指数')) return { type: 'exponential', label: '指数', detail: r, rNumeric };
      if (r.includes('线性')) return { type: 'linear',      label: '线性', detail: r, rNumeric };
      if (r.includes('跳跃')) return { type: 'jump',        label: '跳跃', detail: r, rNumeric };
    }
    if (rNumeric !== null) {
      if (rNumeric >= 1.4) return { type: 'exponential', label: '指数', detail: `r ≈ ${rNumeric}（每段 ×${rNumeric}）`, rNumeric };
      if (rNumeric >= 1.05) return { type: 'linear',      label: '线性', detail: `r ≈ ${rNumeric}（接近线性递增）`, rNumeric };
    }
    if (/指数/.test(text)) return { type: 'exponential', label: '指数', detail: '文本中提及"指数"递增' };
    if (/跳跃|跳一档|阶梯/.test(text)) return { type: 'jump', label: '跳跃', detail: '文本中提及"阶梯/跳跃"' };
    if (/线性/.test(text)) return { type: 'linear', label: '线性', detail: '文本中提及"线性"' };
    if (/血量爬塔|波次推进/.test(text)) return { type: 'linear', label: '线性偏跳跃', detail: '血量爬塔 / 波次推进型，通常是线性 + boss 加强' };
    return { type: 'unknown', label: '未识别', detail: 'r 字段缺失 + 文本无明确曲线提示' };
  };

  /**
   * 渲染"压力曲线分析"块（v2 详情页新增）
   * 内容：机制叙述 + 曲线类型识别 + 派生计算（如可能）+ 横向对比（同曲线类型的同侪）
   */
  RR.renderPressureAnalysis = function (game, allGames) {
    const wrap = document.createElement('div');
    wrap.style.marginTop = '12px';
    if (!game || !game.analysis) {
      wrap.innerHTML = '<div class="dim" style="font-size:12px; padding:12px;">尚未分析，无法生成压力曲线诊断。</div>';
      return wrap;
    }

    const params = game.analysis.pressure_params || {};
    const q = game.analysis.qualitative || {};
    const curve = RR.classifyPressureCurve(game);

    const curveColors = {
      exponential: '#f87171',
      linear:      '#60a5fa',
      jump:        '#fbbf24',
      unknown:     '#a3a3a3'
    };
    const color = curveColors[curve.type] || '#a3a3a3';

    /* —— 区块 A：机制叙述（来自 checkpoint_mechanism） —— */
    const mechHtml = q.checkpoint_mechanism
      ? `<div style="font-size:13px; line-height:1.7;">${escapeHtml(q.checkpoint_mechanism)}</div>`
      : '<div class="dim" style="font-size:12px;">checkpoint_mechanism 未填</div>';

    /* —— 区块 B：曲线类型识别 + 派生计算 —— */
    let derivedHtml = '';
    const M = parseInt(params.M, 10);
    const T0 = parseFloat(params.T0);
    const r = curve.rNumeric;
    const validForSeq = !isNaN(M) && !isNaN(T0) && !isNaN(r) && r > 1 && M > 0 && M <= 100;
    if (validForSeq) {
      const seq = [];
      for (let k = 0; k < M; k++) seq.push(T0 * Math.pow(r, k));
      const last = seq[seq.length - 1];
      const ratio = (last / T0).toFixed(1);
      const max = Math.max(...seq);
      const sparkW = 280, sparkH = 60;
      const points = seq.map((v, i) => {
        const x = (i / (seq.length - 1 || 1)) * sparkW;
        const y = sparkH - (Math.log(Math.max(v, 1)) / Math.log(Math.max(max, 1))) * (sparkH - 8) - 4;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' ');
      const tickHtml = [0, Math.floor(M/2), M-1].map(i => {
        const v = seq[i];
        const fmt = v >= 1e6 ? (v/1e6).toFixed(1) + 'M' : v >= 1e4 ? (v/1e4).toFixed(0) + 'k' : Math.round(v);
        return `第 ${i+1} 关：<b>${fmt}</b>`;
      }).join(' · ');
      derivedHtml = `
        <div style="margin-top:10px;">
          <div class="muted" style="font-size:11px; margin-bottom:6px;">📈 派生曲线（log 纵轴）— ${M} 关，T₀=${T0}，r=${r}</div>
          <svg width="${sparkW}" height="${sparkH}" style="display:block;">
            <polyline points="${points}" fill="none" stroke="${color}" stroke-width="2"/>
            ${seq.map((v, i) => {
              const x = (i / (seq.length - 1 || 1)) * sparkW;
              const y = sparkH - (Math.log(Math.max(v, 1)) / Math.log(Math.max(max, 1))) * (sparkH - 8) - 4;
              return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.5" fill="${color}"/>`;
            }).join('')}
          </svg>
          <div class="muted" style="font-size:12px; margin-top:6px;">${tickHtml} · 终关较首关 <b style="color:${color};">×${ratio}</b></div>
        </div>
      `;
    } else {
      derivedHtml = `<div class="dim" style="font-size:12px; margin-top:10px;">📈 数值不全（M / T₀ / r 至少一个未填或非数值），无法派生曲线序列。<br>建议：在 session 中补全 pressure_params 后重看。</div>`;
    }

    /* —— 区块 C：横向对比 —— */
    let peerHtml = '';
    if (Array.isArray(allGames)) {
      const peers = allGames
        .filter(g => g.slug !== game.slug && g.analysis)
        .map(g => ({ game: g, curve: RR.classifyPressureCurve(g) }))
        .filter(p => p.curve.type === curve.type && curve.type !== 'unknown');
      if (peers.length > 0) {
        const chips = peers.slice(0, 8).map(p => {
          const sc = p.game.analysis.scores || {};
          return `<a href="./${escapeHtml(p.game.slug)}.html"
                    title="structure ${sc.structure || '?'}/10"
                    style="display:inline-block; font-size:12px; padding:3px 9px; border-radius:12px; background:${color}22; color:${color}; text-decoration:none; margin:2px;">${escapeHtml(p.game.basic.name_cn)} <span style="opacity:.7;">S${sc.structure || '?'}</span></a>`;
        }).join('');
        peerHtml = `
          <div style="margin-top:10px;">
            <div class="muted" style="font-size:11px; margin-bottom:6px;">👥 同曲线类型的同侪（共 ${peers.length} 款）</div>
            <div>${chips}</div>
          </div>
        `;
      } else if (curve.type !== 'unknown') {
        peerHtml = `<div class="dim" style="font-size:12px; margin-top:10px;">👥 这是 12 款样本中唯一的「${escapeHtml(curve.label)}」型曲线 —— 孤族。</div>`;
      }
    }

    /* —— 区块 D：压力指纹（一句话总结） —— */
    const sc = game.analysis.scores || {};
    const fingerprint = [
      curve.label !== '未识别' ? `${curve.label}型曲线` : null,
      params.N ? `节奏 ${escapeHtml(String(params.N))}` : null,
      params.M ? `共 ${escapeHtml(String(params.M))} 关` : null,
      params.m_boss ? `boss 加强（${escapeHtml(String(params.m_boss))}）` : null,
      `structure 评分 <b>${sc.structure || '?'}</b>/10`
    ].filter(Boolean).join(' · ');

    /* —— 拼装 —— */
    wrap.innerHTML = `
      <div style="display:flex; gap:8px; align-items:center; margin-bottom:10px;">
        <span style="font-size:11px; padding:3px 10px; border-radius:10px; background:${color}22; color:${color}; font-weight:700;">${escapeHtml(curve.label)}型</span>
        <span class="muted" style="font-size:12px;">${escapeHtml(curve.detail)}</span>
      </div>
      <div class="card" style="margin-bottom:10px;">
        <div class="muted" style="font-size:11px; margin-bottom:6px;">📋 机制叙述（来自 checkpoint_mechanism）</div>
        ${mechHtml}
      </div>
      <div class="card" style="margin-bottom:10px; border-left: 3px solid ${color};">
        <div style="font-size:13px;">🔍 <b>压力指纹</b>　${fingerprint}</div>
        ${derivedHtml}
        ${peerHtml}
      </div>
    `;
    return wrap;
  };

  /**
   * 渲染单维聚类页（v2，按 method-cluster.md 4 步法）
   * @param {string} dimKey       - 维度 key: random / combo / pool / structure
   * @param {object} mountEl      - 挂载点
   * dependencies: window.RR_CLUSTER_DEFS（lib/cluster-definitions.js）
   *               window.RR_COMBO_CLUSTERS（仅 combo 维度需要）
   */
  RR.renderClusterPage = function (dimKey, mountEl) {
    const fw = RR.getFramework();
    const defs = window.RR_CLUSTER_DEFS && window.RR_CLUSTER_DEFS[dimKey];
    if (!fw || !defs) {
      mountEl.innerHTML = `<div class="empty-state">缺少 schema 或 cluster 定义（需 lib/cluster-definitions.js）</div>`;
      return;
    }
    const dim = fw.score_dimensions.find(d => d.key === dimKey);
    if (!dim) {
      mountEl.innerHTML = `<div class="empty-state">未找到维度 ${escapeHtml(dimKey)}</div>`;
      return;
    }

    /* v3 子层切面：?layer=combo1 / combo2 让 combo 维度页面切换聚焦层 */
    const params = new URLSearchParams(location.search);
    const layer = params.get('layer'); // 'combo1' | 'combo2' | null
    const layerBanner = (dimKey === 'combo' && layer)
      ? `<div class="card" style="border-left:3px solid var(--accent); margin-bottom:14px; padding:12px 16px; font-size:13px;">
          📌 当前聚焦切面：<b>${layer === 'combo1' ? 'combo 1：符号协同规则（基础池内元素互动 · combo_synergy + combo_predicate）' : 'combo 2：修饰协同规则（主动池对符号协同的强化 · combo_modifier）'}</b>
          <span class="muted" style="font-size:12px; display:block; margin-top:6px;">注：combo1 与 combo2 共用 schema 中的 <code>combo</code> 综合评分维度（散点条 + 簇定义按综合 combo 分聚），但 qualitative 文本切面独立——实际游戏的 combo 评分 = combo1 + combo2 复合表演。<a href="combo.html" style="color: var(--accent);">查看综合视图</a></span>
         </div>`
      : '';

    const games = RR.getAllGames();
    const analyzed = games.filter(g => g.analysis && g.analysis.scores && g.analysis.scores[dimKey] != null);
    const unanalyzed = games.filter(g => !g.analysis || !g.analysis.scores || g.analysis.scores[dimKey] == null);
    analyzed.sort((a, b) => b.analysis.scores[dimKey] - a.analysis.scores[dimKey]);

    /* ==== 头部 ==== */
    const titleSuffix = (dimKey === 'combo' && layer)
      ? (layer === 'combo1' ? '（聚焦：combo 1 符号协同规则）' : '（聚焦：combo 2 修饰协同规则）')
      : '';
    const head = `
      <div class="page-head">
        <h1>${escapeHtml(defs.title)}${escapeHtml(titleSuffix)} · 单维聚类</h1>
        <p class="lede">${escapeHtml(defs.one_liner)}</p>
        <p class="meta"><b>${analyzed.length}</b> / ${games.length} 款已分析 · 评分区间 ${dim.scale[0]}-${dim.scale[1]} · 框架 ${escapeHtml(fw.version)}</p>
      </div>
    `;

    /* ==== Step 1: 评分 + 评分理由（v3 改为表格视图，每行附该维度对应 qualitative 字段截断作为"为什么这个分数"）==== */
    const dimToReasonField = {
      random:    (q) => q.random_design || '',
      combo:     (q) => q.combo_synergy || '',
      pool:      (q) => [q.pool_base_desc, q.pool_active_desc].filter(Boolean).join(' · '),
      structure: (q) => q.checkpoint_mechanism || ''
    };
    const reasonGetter = dimToReasonField[dimKey] || (() => '');
    /* 颜色映射：5-6 红 / 7 黄 / 8 蓝 / 9 紫 / 10 绿 */
    const scoreColor = (v) => v >= 10 ? '#34d399' : v >= 9 ? '#a78bfa' : v >= 8 ? '#60a5fa' : v >= 7 ? '#fbbf24' : '#f87171';
    const scatter = `
      <h2 class="section-title">Step 1 · 评分 + 评分理由</h2>
      <p class="muted" style="font-size:12px; margin-bottom:8px;">每款游戏在该维度的分数（按降序）+ 该维度对应的 qualitative 字段截断（解释"为什么这个分数"）。点击行进入详情页看完整字段。</p>
      <div class="card" style="overflow-x:auto;">
        <table class="tbl" style="font-size:13px; width:100%;">
          <thead>
            <tr>
              <th style="width:200px;">游戏</th>
              <th style="width:70px; text-align:center;">分数</th>
              <th>评分理由（${escapeHtml(dim.name)} 维度对应字段截断）</th>
            </tr>
          </thead>
          <tbody>
            ${analyzed.map(g => {
              const v = g.analysis.scores[dimKey];
              const reason = reasonGetter(g.analysis.qualitative);
              const reasonShort = reason.length > 220 ? reason.slice(0, 220) + '…' : reason;
              const c = scoreColor(v);
              return `
                <tr style="cursor:pointer;" onclick="location.href='../analysis/${escapeHtml(g.slug)}.html'">
                  <td>
                    <b style="color: var(--accent);">${escapeHtml(g.basic.name_cn)}</b>
                    <span class="dim" style="font-size:11px; margin-left:6px;">${escapeHtml(g.basic.name_en)}</span>
                  </td>
                  <td style="text-align:center;"><span style="display:inline-block; min-width:36px; padding:4px 10px; border-radius:14px; background:${c}22; color:${c}; font-weight:700; font-size:15px;">${v}</span></td>
                  <td class="muted" style="font-size:12px; line-height:1.6;">${escapeHtml(reasonShort) || '<span class="dim">（该字段为空）</span>'}</td>
                </tr>
              `;
            }).join('')}
            ${unanalyzed.map(g => `
              <tr style="opacity:.4;">
                <td><i>${escapeHtml(g.basic.name_cn)}</i> <span class="dim" style="font-size:11px;">${escapeHtml(g.basic.name_en)}</span></td>
                <td style="text-align:center;"><span class="dim">—</span></td>
                <td class="dim" style="font-size:12px;"><i>未分析</i></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    /* ==== Step 2 + 3: 按定义的区间分簇 + 模式名 + 因果叙事 ==== */
    const findCluster = (score) => defs.clusters.find(c => score >= c.range[0] && score <= c.range[1]);
    const clusterMembers = defs.clusters.map(c => ({
      cluster: c,
      members: analyzed.filter(g => {
        const s = g.analysis.scores[dimKey];
        return s >= c.range[0] && s <= c.range[1];
      })
    }));

    const clusterCards = clusterMembers.map(({cluster: c, members}) => {
      const memberChips = members.map(g => {
        const s = g.analysis.scores[dimKey];
        return `<a href="../analysis/${escapeHtml(g.slug)}.html"
                  style="display:inline-flex; align-items:center; gap:6px; padding:3px 10px; border-radius:14px; background:${c.color}22; color:${c.color}; text-decoration:none; margin:2px; font-size:12px;">
                  <span style="color: var(--fg);">${escapeHtml(g.basic.name_cn)}</span>
                  <span style="font-weight:700;">${s}</span>
                </a>`;
      }).join('');
      return `
        <div class="card" style="border-left:3px solid ${c.color}; margin-bottom:14px;">
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
            <span style="font-size:22px;">${c.glyph}</span>
            <span style="font-size:16px; font-weight:700;">${escapeHtml(c.name)}</span>
            <span class="kbd" style="margin-left:auto; font-size:11px;">${c.range[0]} - ${c.range[1]} 分 · ${members.length} 款</span>
          </div>
          <div class="muted" style="font-size:12px; margin-bottom:8px;">📌 共性：${escapeHtml(c.pattern)}</div>
          <div style="font-size:13px; line-height:1.8; margin-bottom:10px;">${(c.rationale || '').replace(/\n/g, '<br>')}</div>
          <div>${memberChips || '<span class="dim" style="font-size:11px;">本数据快照中暂无成员</span>'}</div>
        </div>
      `;
    }).join('');

    /* ==== Step 4: 跨簇对比因果表 ==== */
    const compareTable = `
      <h2 class="section-title">Step 4 · 跨簇因果对比</h2>
      <div class="card" style="overflow-x:auto;">
        <table class="tbl">
          <thead>
            <tr>${defs.cross_compare.headers.map(h => `<th>${escapeHtml(h)}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${defs.cross_compare.rows.map(r => `
              <tr>
                <td><b>${escapeHtml(r.dim)}</b></td>
                ${r.cells.map(c => `<td class="muted" style="font-size:12px;">${escapeHtml(c)}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    /* ==== 设计建议 ==== */
    const adviceHtml = `
      <h2 class="section-title">设计实践建议</h2>
      <div class="card">
        <ul style="margin:0; padding-left:20px; line-height:1.9; font-size:13px;">
          ${defs.advice.map(a => `<li>${escapeHtml(a)}</li>`).join('')}
        </ul>
      </div>
    `;

    /* ==== combo 维度专属：v2 结构聚簇引流 ==== */
    let comboExtraHtml = '';
    if (dimKey === 'combo' && Array.isArray(window.RR_COMBO_CLUSTERS)) {
      const dist = {};
      for (const g of analyzed) {
        const c = window.RR_findCluster(g.analysis.qualitative);
        const k = c ? c.id : '_none';
        dist[k] = (dist[k] || 0) + 1;
      }
      const distChips = window.RR_COMBO_CLUSTERS.map(c => `
        <span style="display:inline-block; font-size:11px; padding:3px 9px; margin:2px; border-radius:10px; background:${c.color}22; color:${c.color};">
          ${c.glyph} ${escapeHtml(c.name)} <b>${dist[c.id] || 0}</b>
        </span>
      `).join('');
      comboExtraHtml = `
        <h2 class="section-title">v2 补充视角 · 结构聚簇（拓扑 × 判定）</h2>
        <div class="card" style="border-left:3px solid var(--accent);">
          <p style="margin:0 0 8px; font-size:13px;">v1 的"按评分聚簇"无法解释<b>同分但结构不同</b>的现象（如 LBL 8 vs 地牢掷骰 8 vs 哥布林弹球 8）。v2 加了结构聚簇维度，把 combo_synergy 压成「拓扑 × 判定」二维空间，可以看到：</p>
          <div style="margin: 8px 0;">${distChips}</div>
          <p class="muted" style="font-size:12px; margin:8px 0 0;">→ 完整的结构聚簇分析（6 集群卡片 + 5×8 矩阵 + 关键洞察）在主页的 <a href="../index.html#combo-synergy" style="color: var(--accent);">🧩 协同结构 tab</a> 中。</p>
        </div>
      `;
    }

    /* ==== structure 维度专属：曲线类型分布引流 ==== */
    let structExtraHtml = '';
    if (dimKey === 'structure' && typeof RR.classifyPressureCurve === 'function') {
      const dist = { exponential: [], linear: [], jump: [], unknown: [] };
      for (const g of analyzed) {
        const c = RR.classifyPressureCurve(g);
        if (dist[c.type]) dist[c.type].push(g);
      }
      const colorMap = { exponential: '#f87171', linear: '#60a5fa', jump: '#fbbf24', unknown: '#a3a3a3' };
      const labelMap = { exponential: '指数型', linear: '线性型', jump: '跳跃型', unknown: '未识别' };
      const blocks = ['exponential', 'linear', 'jump', 'unknown'].map(t => {
        const list = dist[t];
        if (list.length === 0) return '';
        return `
          <div style="margin: 6px 0;">
            <span style="display:inline-block; font-size:11px; padding:2px 9px; border-radius:10px; background:${colorMap[t]}22; color:${colorMap[t]}; font-weight:700;">${labelMap[t]} · ${list.length} 款</span>
            ${list.map(g => `<a href="../analysis/${escapeHtml(g.slug)}.html" class="kbd" style="font-size:11px; margin:1px 3px; text-decoration:none;">${escapeHtml(g.basic.name_cn)}<span style="opacity:.7;"> S${g.analysis.scores.structure}</span></a>`).join('')}
          </div>
        `;
      }).filter(Boolean).join('');
      structExtraHtml = `
        <h2 class="section-title">v2 补充视角 · 压力曲线类型分布</h2>
        <div class="card" style="border-left:3px solid var(--accent);">
          <p style="margin:0 0 8px; font-size:13px;">structure 评分和"曲线类型"是双轴的：同样 8 分，指数型曲线（青天井）和线性型曲线（哥布林弹球）的紧张感完全不同。</p>
          ${blocks}
          <p class="muted" style="font-size:12px; margin:8px 0 0;">→ 每款游戏的曲线分析（机制叙述 + 派生序列 + 同侪对比）在<b>详情页底部</b>的"压力曲线参数 + 分析"区。</p>
        </div>
      `;
    }

    mountEl.innerHTML = head
      + layerBanner
      + scatter
      + '<h2 class="section-title">Step 2 + 3 · 簇定义（模式名 + 因果叙事）</h2>'
      + clusterCards
      + compareTable
      + adviceHtml
      + comboExtraHtml
      + structExtraHtml;
  };

  /**
   * 渲染压力曲线参数表
   */
  RR.renderPressureParams = function (params) {
    const fw = RR.getFramework();
    const defs = (fw && fw.pressure_params) || [];
    const tbl = document.createElement('table');
    tbl.className = 'tbl';
    tbl.innerHTML = `
      <thead>
        <tr><th style="width:80px">参数</th><th style="width:120px">值</th><th>含义</th></tr>
      </thead>
    `;
    const tbody = document.createElement('tbody');
    for (const d of defs) {
      const v = params ? params[d.key] : null;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><b>${escapeHtml(d.name)}</b></td>
        <td>${v == null ? '<span class="dim">—</span>' : escapeHtml(String(v))}</td>
        <td class="muted">${escapeHtml(d.desc)}</td>
      `;
      tbody.appendChild(tr);
    }
    tbl.appendChild(tbody);
    return tbl;
  };

  /* ============ 一致性 / 完整性校验 ============ */

  /**
   * 校验 framework_version 一致性，将警告挂到顶部
   */
  RR.checkFrameworkConsistency = function () {
    const fw = RR.getFramework();
    const games = window.GAMES;
    if (!fw || !games) return;

    const fwVer = fw.version;
    const gamesVer = games.framework_version;
    const warnings = [];

    if (gamesVer !== fwVer) {
      warnings.push(`games.json 框架版本 (${gamesVer}) 与 framework/${fwVer}/schema.json (${fwVer}) 不一致`);
    }

    const stale = games.games.filter(g => g.analysis && g.analysis.framework_version && g.analysis.framework_version !== fwVer);
    if (stale.length > 0) {
      warnings.push(`${stale.length} 款游戏的 analysis 使用旧框架版本，建议重新分析：${stale.map(g => g.basic.name_cn).join('、')}`);
    }

    if (warnings.length > 0) {
      const banner = document.querySelector('#warn-banner');
      if (banner) {
        banner.classList.add('show');
        banner.innerHTML = '⚠ ' + warnings.join('；');
      }
    }
  };

  /* ============ 工具 ============ */

  function escapeHtml(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  RR.escapeHtml = escapeHtml;

  /* 把 GAMES 对象输出为漂亮 JSON 字符串 */
  RR.serializeGames = function () {
    return JSON.stringify(window.GAMES, null, 2);
  };

  /* 触发文件下载 */
  RR.downloadAsFile = function (filename, content, mime = 'application/json') {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };

  /* 复制到剪贴板（含降级） */
  RR.copyToClipboard = async function (text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      // 降级
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    }
  };

})();
