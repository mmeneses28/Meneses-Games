(() => {
  'use strict';
  const BUILD = '4.6.8.1';
  const hotfixScript = document.currentScript;
  let baseHref = document.baseURI;
  try {
    if (hotfixScript && hotfixScript.src) baseHref = new URL('../', hotfixScript.src).href;
  } catch {}

  function resolvedAssetUrl(key, retry = false) {
    const embedded = window.__MZV_ASSETS__;
    if (embedded && embedded[key]) return embedded[key];
    const path = window.MZV?.ASSET_PATHS?.[key] || '';
    if (!path) return '';
    try {
      const u = new URL(path, baseHref);
      if (u.protocol === 'http:' || u.protocol === 'https:') {
        u.searchParams.set('v', BUILD);
        if (retry) u.searchParams.set('retry', String(Date.now()));
      }
      return u.href;
    } catch {
      return path;
    }
  }

  if (!window.MZV) return;
  MZV.assetUrl = resolvedAssetUrl;

  class MobileSafeAssetStore {
    constructor() {
      this.images = new Map();
      this.started = new Set();
      this.retried = new Set();
      for (const key of Object.keys(MZV.ASSET_PATHS || {})) {
        const img = new Image();
        img.decoding = 'async';
        this.images.set(key, img);
      }
    }
    start(key, high = false) {
      const img = this.images.get(key);
      if (!img || this.started.has(key)) return img || null;
      this.started.add(key);
      try { img.fetchPriority = high ? 'high' : 'auto'; } catch {}
      img.onerror = () => {
        if (this.retried.has(key)) return;
        this.retried.add(key);
        setTimeout(() => { img.src = resolvedAssetUrl(key, true); }, 180);
      };
      img.src = resolvedAssetUrl(key);
      return img;
    }
    get(key) { return this.start(key, false); }
    ready(key) {
      const img = this.images.get(key);
      return !!img && img.complete && img.naturalWidth > 0;
    }
    waitFor(keys, timeoutMs = 9000) {
      const unique = [...new Set(keys)].filter(k => this.images.has(k));
      if (!unique.length) return Promise.resolve(true);
      const waits = unique.map(key => new Promise(resolve => {
        const img = this.start(key, true);
        if (!img) return resolve(false);
        if (img.complete && img.naturalWidth > 0) return resolve(true);
        let settled = false;
        const finish = ok => {
          if (settled) return;
          settled = true;
          img.removeEventListener('load', onLoad);
          img.removeEventListener('error', onError);
          resolve(ok);
        };
        const onLoad = () => finish(true);
        const onError = () => setTimeout(() => finish(img.complete && img.naturalWidth > 0), 700);
        img.addEventListener('load', onLoad, { once: true });
        img.addEventListener('error', onError, { once: true });
      }));
      return Promise.race([
        Promise.all(waits).then(v => v.every(Boolean)),
        new Promise(resolve => setTimeout(() => resolve(false), timeoutMs))
      ]);
    }
  }
  MZV.AssetStore = MobileSafeAssetStore;

  MZV.Renderer.prototype.drawBackground = function () {
    const c = this.ctx;
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    const cam = this.s.camera;
    const zoom = this.zoom;
    c.fillStyle = '#89956d';
    c.fillRect(0, 0, w, h);
    const bg = this.asset(`battlefield.${this.s.mission}`) || this.asset('battlefield');
    if (bg) {
      c.save();
      c.globalAlpha = .78;
      c.drawImage(bg, -cam.x * zoom, -cam.y * zoom, MZV.WORLD.width * zoom, MZV.WORLD.height * zoom);
      c.fillStyle = 'rgba(255,246,218,.10)';
      c.fillRect(0, 0, w, h);
      c.restore();
    }
  };

  const originalStart = MZV.GameApp.prototype.start;
  MZV.GameApp.prototype._mobileCriticalAssetKeys = function (mode, p1, p2, mission) {
    const keys = [`battlefield.${mission}`, 'battlefield', 'weapons.pistol', 'projectiles.pistol'];
    const chars = mode === 'two' ? [p1, p2] : [p1];
    for (const id of chars) {
      for (const pose of ['idle_down','idle_up','idle_left','idle_right','walk_down','walk_up','walk_left','walk_right']) {
        keys.push(`characters.${id}.${pose}`);
      }
    }
    const prefix = mission === 'thriller' ? 'enemiesThriller' : 'enemies';
    for (const d of ['down','up','left','right']) keys.push(`${prefix}.normal.${d}`);
    return keys;
  };
  MZV.GameApp.prototype._showGraphicsLoader = function (show) {
    let el = document.getElementById('mobileGraphicsLoader');
    if (!el) {
      el = document.createElement('div');
      el.id = 'mobileGraphicsLoader';
      Object.assign(el.style, {
        position:'fixed', inset:'0', zIndex:'9999', display:'none', alignItems:'center', justifyContent:'center',
        background:'rgba(4,7,9,.96)', color:'#fff', textAlign:'center', padding:'24px',
        font:'900 17px Segoe UI,Arial,sans-serif', letterSpacing:'.06em'
      });
      el.innerHTML = '<div><div style="font-size:34px;color:#f3c74f;margin-bottom:10px">MENESES</div><div>A CARREGAR MAPA E PERSONAGENS…</div></div>';
      document.body.appendChild(el);
    }
    el.style.display = show ? 'flex' : 'none';
  };
  MZV.GameApp.prototype.start = async function (mode, p1, p2 = 'marco', mission = 'deserto') {
    if (mode === 'two' && p1 === p2) throw new Error('Os dois jogadores não podem escolher a mesma personagem.');
    this._showGraphicsLoader(true);
    const keys = this._mobileCriticalAssetKeys(mode, p1, p2, mission);
    let ok = await this.renderer.assets.waitFor(keys, 9000);
    if (!ok) ok = await this.renderer.assets.waitFor(keys, 3500);
    this._showGraphicsLoader(false);
    return originalStart.call(this, mode, p1, p2, mission);
  };

  console.info('[MZV] Mobile graphics hotfix', BUILD, 'active');
})();