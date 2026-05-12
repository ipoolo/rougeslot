/* R_RougeSlot · 管理面板逻辑
   ==========================
   依赖：window.RR (lib/render.js), window.GAMES (data/games.js)

   行为：
   - 添加新游戏（仅 basic 部分）→ 写到内存中的 window.GAMES
   - 编辑评分 → 弹窗 4 个滑块
   - 删除游戏 → 弹窗确认
   - 任一变更 → 标记 dirty 状态 → 顶部红条提示
   - 导出：下载 games.json / 复制 JSON 到剪贴板

   ⚠ 浏览器无法直接写磁盘。所有变更只在内存里。导出的 JSON 需要用户手动覆盖到 data/games.json，
      或者复制到剪贴板让 Claude session 同步写回。
*/

(function () {
  'use strict';

  const RR = window.RR;
  if (!RR) {
    console.error('[admin] RR 未加载，先引入 lib/render.js');
    return;
  }

  const Admin = (RR.Admin = {});

  let _dirty = false;
  function markDirty() {
    _dirty = true;
    const banner = document.querySelector('#dirty-banner');
    if (banner) banner.classList.add('show');
  }
  function clearDirty() {
    _dirty = false;
    const banner = document.querySelector('#dirty-banner');
    if (banner) banner.classList.remove('show');
  }

  Admin.isDirty = () => _dirty;

  /* ============ 添加游戏 ============ */

  Admin.addGame = function (input) {
    if (!input || !input.slug) {
      alert('slug 不能为空');
      return false;
    }
    const slug = input.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
    if (RR.getGame(slug)) {
      alert(`slug "${slug}" 已存在`);
      return false;
    }
    const newGame = {
      slug,
      basic: {
        name_cn: input.name_cn || '',
        name_en: input.name_en || '',
        developer: input.developer || null,
        release_year: input.release_year ? Number(input.release_year) : null,
        steam_url: input.steam_url || null,
        header_url: input.header_url || null,
        tags: (input.tags || '').split(',').map(s => s.trim()).filter(Boolean),
        core_loop_oneliner: input.core_loop_oneliner || ''
      },
      analysis: null
    };
    window.GAMES.games.push(newGame);
    markDirty();
    return newGame;
  };

  /* ============ 编辑评分 ============ */

  Admin.editScores = function (slug) {
    const game = RR.getGame(slug);
    if (!game) return;

    const fw = RR.getFramework();
    const dims = (fw && fw.score_dimensions) || [];
    const cur = (game.analysis && game.analysis.scores) || {};

    // 简易 prompt 链
    const newScores = {};
    let ok = true;
    for (const dim of dims) {
      const raw = prompt(`${dim.name}（${dim.scale[0]}-${dim.scale[1]}，留空跳过）`, cur[dim.key] != null ? cur[dim.key] : '');
      if (raw === null) { ok = false; break; }  // 取消
      const trimmed = raw.trim();
      if (trimmed === '') { newScores[dim.key] = null; continue; }
      const n = Number(trimmed);
      if (Number.isNaN(n) || n < dim.scale[0] || n > dim.scale[1]) {
        alert(`${dim.name} 必须是 ${dim.scale[0]}-${dim.scale[1]} 的数字`);
        ok = false;
        break;
      }
      newScores[dim.key] = n;
    }
    if (!ok) return;

    if (!game.analysis) {
      game.analysis = {
        framework_version: fw ? fw.version : 'v1',
        updated_at: new Date().toISOString().slice(0, 10),
        scores: newScores,
        qualitative: {},
        pressure_params: {},
        summary: ''
      };
    } else {
      game.analysis.scores = newScores;
      game.analysis.updated_at = new Date().toISOString().slice(0, 10);
    }
    markDirty();
    return game;
  };

  /* ============ 删除游戏 ============ */

  Admin.deleteGame = function (slug) {
    const game = RR.getGame(slug);
    if (!game) return false;
    if (!confirm(`确定删除「${game.basic.name_cn || slug}」？此变更需要导出 JSON 才会持久化。`)) {
      return false;
    }
    const idx = window.GAMES.games.findIndex(g => g.slug === slug);
    if (idx >= 0) {
      window.GAMES.games.splice(idx, 1);
      markDirty();
      return true;
    }
    return false;
  };

  /* ============ 导出 ============ */

  Admin.downloadJson = function () {
    // 更新顶层时间戳
    window.GAMES.updated_at = new Date().toISOString().slice(0, 10);
    const text = RR.serializeGames();
    RR.downloadAsFile('games.json', text);
  };

  Admin.copyJsonToClipboard = async function () {
    window.GAMES.updated_at = new Date().toISOString().slice(0, 10);
    const text = RR.serializeGames();
    const ok = await RR.copyToClipboard(text);
    if (ok) {
      alert('已复制 games.json 到剪贴板。\n\n粘贴给 Claude session 并说：\n"把这份 JSON 写回 data/games.json 并同步 games.js"');
    } else {
      alert('复制失败，请改用"下载 JSON"按钮');
    }
  };

  /* ============ 渲染管理面板（挂在 index.html） ============ */

  Admin.renderPanel = function (containerEl) {
    containerEl.innerHTML = `
      <details class="panel" id="admin-panel">
        <summary>⚙ 管理面板（增删改 · 导出 JSON）</summary>
        <div class="panel-body">

          <h3 style="font-size:14px; margin-bottom:10px;">添加新游戏（仅基础信息）</h3>
          <div class="form-row"><label>slug</label><input id="ag-slug" placeholder="kebab-case，如 game-name"></div>
          <div class="form-row"><label>中文名</label><input id="ag-name-cn"></div>
          <div class="form-row"><label>英文名</label><input id="ag-name-en"></div>
          <div class="form-row"><label>开发商</label><input id="ag-developer"></div>
          <div class="form-row"><label>发售年</label><input id="ag-year" type="number" min="2010" max="2030"></div>
          <div class="form-row"><label>Steam URL</label><input id="ag-steam-url" placeholder="https://store.steampowered.com/app/..."></div>
          <div class="form-row"><label>Header URL</label><input id="ag-header-url" placeholder="https://shared.fastly.steamstatic.com/.../header.jpg"></div>
          <div class="form-row"><label>标签（逗号分隔）</label><input id="ag-tags" placeholder="装置类, 老虎机"></div>
          <div class="form-row"><label>一句话核心循环</label><textarea id="ag-oneliner"></textarea></div>
          <div class="btn-row">
            <button class="btn btn-primary" id="ag-submit">添加到内存</button>
            <span class="dim" style="font-size:12px; line-height:32px;">添加后请点下方"导出 JSON"才能持久化</span>
          </div>

          <div class="divider"></div>

          <h3 style="font-size:14px; margin-bottom:10px;">导出（持久化）</h3>
          <div class="btn-row">
            <button class="btn btn-primary" id="ad-download">⬇ 下载 games.json（手动覆盖到 data/games.json）</button>
            <button class="btn" id="ad-copy">📋 复制 JSON 到剪贴板（交给 Claude 同步）</button>
          </div>
          <p class="muted" style="font-size:12px; margin-top:10px;">
            ⚠ 浏览器无法直接写磁盘。任何在此页修改的内容（添加 / 编辑评分 / 删除）都需要导出后手动同步到 <span class="kbd">data/games.json</span>，并让 Claude 重写 <span class="kbd">data/games.js</span>。
          </p>
        </div>
      </details>
    `;

    document.querySelector('#ag-submit').addEventListener('click', () => {
      const ok = Admin.addGame({
        slug: document.querySelector('#ag-slug').value,
        name_cn: document.querySelector('#ag-name-cn').value,
        name_en: document.querySelector('#ag-name-en').value,
        developer: document.querySelector('#ag-developer').value,
        release_year: document.querySelector('#ag-year').value,
        steam_url: document.querySelector('#ag-steam-url').value,
        header_url: document.querySelector('#ag-header-url').value,
        tags: document.querySelector('#ag-tags').value,
        core_loop_oneliner: document.querySelector('#ag-oneliner').value
      });
      if (ok) {
        // 触发列表重渲染
        if (typeof Admin.onChange === 'function') Admin.onChange();
        // 清空表单
        document.querySelectorAll('#admin-panel input, #admin-panel textarea').forEach(el => el.value = '');
      }
    });

    document.querySelector('#ad-download').addEventListener('click', Admin.downloadJson);
    document.querySelector('#ad-copy').addEventListener('click', Admin.copyJsonToClipboard);
  };

})();
