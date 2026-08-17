(() => {
  'use strict';
  if (!window.MZV) return;

  const BUILD = '4.6.9.4-local-main-event-blackout';
  const PRELUDE_SECONDS = 5;
  const BLACKOUT_SECONDS = 1.72;
  const SILHOUETTE_SECONDS = 1.34;

  function pendingBossSilhouette(s) {
    if (s.pendingBossVariant === 'shadowDancer') return 'bosses.shadowDancer.down';
    if (s.pendingBossVariant === 'yellowThriller') return 'bosses.yellowThriller.down';
    if (s.pendingBossVariant === 'blackYellowThriller') return 'bosses.blackYellowThriller.down';
    if (s.pendingBoss === 'nocturnus') return 'bosses.redThriller.down';
    if (s.pendingBoss === 'powerBoss') return 'enemiesThriller.powerBoss.down';
    if (s.pendingBoss === 'vampire') return 'bosses.shadowDancer.down';
    return '';
  }

  function nextBossSilhouette(s) {
    const pending = pendingBossSilhouette(s);
    if (pending) return pending;
    const milestones = [
      { level: 5, key: 'bosses.yellowThriller.down' },
      { level: 9, key: 'bosses.shadowDancer.down' },
      { level: 13, key: 'bosses.yellowThriller.down' },
      { level: 17, key: 'enemiesThriller.powerBoss.down' },
      { level: 21, key: 'bosses.blackYellowThriller.down' },
      { level: 27, key: 'bosses.shadowDancer.down' },
      { level: 35, key: 'bosses.blackYellowThriller.down' },
      { level: 43, key: 'bosses.werewolfThriller.down' },
      { level: 50, key: 'bosses.redThriller.down' },
    ];
    const hit = milestones.find(m => s.level <= m.level);
    return hit?.key || 'bosses.werewolfThriller.down';
  }

  MZV.nextThrillerBossSilhouette = nextBossSilhouette;

  function resetPreludeState(s) {
    s.mainEventQueue = [];
    s.mainEventVisualBusyUntil = 0;
    s.mainEventBlackoutStart = 0;
    s.mainEventBlackoutUntil = 0;
    s.mainEventSilhouetteKey = '';
    s.mainEventSilhouetteStart = 0;
    s.mainEventSilhouetteUntil = 0;
    s.mainEventSilhouetteSide = 1;
    s.mainEventCurrentLabel = '';
    s.mainEventExecutingType = '';
    s.mainEventLastStartedType = '';
    s.mainEventLastStartedAt = -999;
    s.mainEventMegaLevelDone = 0;
  }

  function queueFor(s) {
    if (!Array.isArray(s.mainEventQueue)) s.mainEventQueue = [];
    return s.mainEventQueue;
  }

  function isQueued(s, key) {
    return queueFor(s).some(e => e.key === key && !e.done);
  }

  function recentlyStarted(s, type, seconds = 1.25) {
    return s.mainEventLastStartedType === type && s.elapsed - (s.mainEventLastStartedAt || -999) <= seconds;
  }

  function scheduleMainEvent(app, { key, type, label, silhouetteKey, callback }) {
    const s = app?.state;
    if (!s || s.mission !== 'thriller') return false;
    if (isQueued(s, key)) return true;

    const now = s.elapsed;
    const visualAt = Math.max(now, s.mainEventVisualBusyUntil || now);
    const due = visualAt + PRELUDE_SECONDS;
    s.mainEventVisualBusyUntil = visualAt + 2.05;
    queueFor(s).push({
      key, type, label,
      silhouetteKey: silhouetteKey || nextBossSilhouette(s),
      visualAt, due, callback,
      visualShown: false, done: false,
    });
    return true;
  }

  function showPrelude(app, event) {
    const s = app.state;
    const now = s.elapsed;
    s.mainEventBlackoutStart = now;
    s.mainEventBlackoutUntil = now + BLACKOUT_SECONDS;
    s.threatBlackoutStart = now;
    s.threatBlackoutUntil = Math.max(s.threatBlackoutUntil || 0, now + BLACKOUT_SECONDS);
    s.mainEventSilhouetteKey = event.silhouetteKey || nextBossSilhouette(s);
    s.mainEventSilhouetteStart = now + .16;
    s.mainEventSilhouetteUntil = now + .16 + SILHOUETTE_SECONDS;
    s.mainEventSilhouetteSide = Math.random() < .5 ? -1 : 1;
    s.mainEventCurrentLabel = event.label || 'MAIN EVENT';
    s.lightningAlpha = Math.max(s.lightningAlpha || 0, .25);
    app.audio?.playVariant?.('thunder', .72, MZV.rand(.94, 1.04));
    if (Math.random() < .72) {
      setTimeout(() => {
        if (app.state.running && app.state.mission === 'thriller') app.audio?.playVariant?.('laugh', .36, MZV.rand(.90, 1.06));
      }, 520);
    }
    app.notify('⚫ APAGÃO · ALGUMA COISA VEM AÍ...');
  }

  function processMainEvents(app) {
    const s = app.state;
    if (!s.running || s.mission !== 'thriller') return;
    const queue = queueFor(s);
    for (const event of queue) {
      if (event.done) continue;
      if (!event.visualShown && s.elapsed >= event.visualAt) {
        event.visualShown = true;
        showPrelude(app, event);
      }
      if (s.elapsed >= event.due) {
        event.done = true;
        s.mainEventExecutingType = event.type;
        try {
          event.callback?.();
        } catch (err) {
          console.error('[MZV] main-event callback failed', event.type, err);
        } finally {
          s.mainEventExecutingType = '';
          s.mainEventLastStartedType = event.type;
          s.mainEventLastStartedAt = s.elapsed;
        }
      }
    }
    if (queue.length > 12 || queue.some(e => e.done)) s.mainEventQueue = queue.filter(e => !e.done);
  }

  const baseReleaseBoss = MZV.HordeSystem.prototype.releaseBoss;
  MZV.HordeSystem.prototype.releaseBoss = function(...args) {
    const s = this.state;
    const app = window.__MZV_APP__;
    if (!app || s.mission !== 'thriller' || s._mainEventBypassBoss) return baseReleaseBoss.apply(this, args);
    if (!s.pendingBoss) return baseReleaseBoss.apply(this, args);
    if (s.mainEventExecutingType === 'carnage' || recentlyStarted(s, 'carnage', .9)) return baseReleaseBoss.apply(this, args);
    const type = s.pendingBoss;
    const variant = s.pendingBossVariant || '';
    const key = `boss:${s.level}:${type}:${variant}`;
    if (isQueued(s, key)) return;
    if (Number.isFinite(s.tensionForceBossAt) && s.tensionForceBossAt > 0) s.tensionForceBossAt = Number.POSITIVE_INFINITY;
    scheduleMainEvent(app, {
      key,
      type: 'boss',
      label: 'BOSS',
      silhouetteKey: pendingBossSilhouette(s) || nextBossSilhouette(s),
      callback: () => {
        s._mainEventBypassBoss = true;
        try { baseReleaseBoss.apply(this, args); }
        finally { s._mainEventBypassBoss = false; }
      }
    });
  };

  const baseCarnageStart = MZV.CarnageSystem.prototype.start;
  MZV.CarnageSystem.prototype.start = function(source, seekToStart) {
    const s = this.s;
    const app = window.__MZV_APP__;
    if (!app || s.mission !== 'thriller' || s._mainEventBypassCarnage || s.carnageActive) return baseCarnageStart.call(this, source, seekToStart);
    if (s.mainEventExecutingType === 'boss' || recentlyStarted(s, 'boss', 1.1)) return baseCarnageStart.call(this, source, seekToStart);
    const key = `carnage:${s.carnageSerial || 0}:${source || 'natural'}:${s.level}`;
    if (isQueued(s, key)) return;
    scheduleMainEvent(app, {
      key,
      type: 'carnage',
      label: 'CARNAGE',
      silhouetteKey: nextBossSilhouette(s),
      callback: () => {
        s._mainEventBypassCarnage = true;
        try { baseCarnageStart.call(this, source, seekToStart); }
        finally { s._mainEventBypassCarnage = false; }
      }
    });
  };

  const baseRageStart = MZV.RageSystem.prototype.start;
  MZV.RageSystem.prototype.start = function(duration = MZV.RULES.rageSeconds, source = 'level') {
    const s = this.s;
    const app = window.__MZV_APP__;
    if (!app || s.mission !== 'thriller' || source !== 'level' || s._mainEventBypassRage || this.isActive()) return baseRageStart.call(this, duration, source);
    const key = `rage:${s.level}`;
    if (isQueued(s, key)) return;
    scheduleMainEvent(app, {
      key,
      type: 'rage',
      label: 'RAGE',
      silhouetteKey: nextBossSilhouette(s),
      callback: () => {
        s._mainEventBypassRage = true;
        try { baseRageStart.call(this, duration, source); }
        finally { s._mainEventBypassRage = false; }
      }
    });
  };

  const baseReleasePendingHorde = MZV.HordeSystem.prototype.releasePendingHorde;
  MZV.HordeSystem.prototype.releasePendingHorde = function(fraction) {
    const s = this.state;
    const app = window.__MZV_APP__;
    if (!app || s.mission !== 'thriller' || s._mainEventBypassMega || !s.megaHorde || fraction < 1 || s.pendingHordeCount <= 0 || s.mainEventMegaLevelDone === s.level) return baseReleasePendingHorde.call(this, fraction);
    const key = `mega:${s.level}`;
    if (isQueued(s, key)) return;
    scheduleMainEvent(app, {
      key,
      type: 'megaHorde',
      label: 'MEGA HORDA',
      silhouetteKey: nextBossSilhouette(s),
      callback: () => {
        s._mainEventBypassMega = true;
        s.mainEventMegaLevelDone = s.level;
        try { baseReleasePendingHorde.call(this, fraction); }
        finally { s._mainEventBypassMega = false; }
      }
    });
  };

  const baseAppStart = MZV.GameApp.prototype.start;
  MZV.GameApp.prototype.start = function(...args) {
    const out = baseAppStart.apply(this, args);
    resetPreludeState(this.state);
    return out;
  };

  const baseAppUpdate = MZV.GameApp.prototype.update;
  MZV.GameApp.prototype.update = function(dt) {
    const out = baseAppUpdate.call(this, dt);
    processMainEvents(this);
    if (this.thrillerTension && !this.thrillerTension._mainEventHavocWrapped) {
      const director = this.thrillerTension;
      const baseStartHavoc = director.startHavoc.bind(director);
      director.startHavoc = () => {
        const s = this.state;
        if (s.mission !== 'thriller' || s._mainEventBypassHavoc || s.havocActive) return baseStartHavoc();
        if (!s.carnageActive || s.rageUntil <= s.elapsed) return baseStartHavoc();
        const key = `havoc:${s.level}:${Math.floor(s.carnageEnteredAt || 0)}:${Math.floor(s.rageUntil || 0)}`;
        if (isQueued(s, key)) return;
        scheduleMainEvent(this, {
          key,
          type: 'havoc',
          label: 'HAVOC',
          silhouetteKey: nextBossSilhouette(s),
          callback: () => {
            s._mainEventBypassHavoc = true;
            try { baseStartHavoc(); }
            finally { s._mainEventBypassHavoc = false; }
          }
        });
      };
      director._mainEventHavocWrapped = true;
    }
    return out;
  };

  const baseThrillerOverlay = MZV.Renderer.prototype.drawThrillerOverlay;
  MZV.Renderer.prototype.drawThrillerOverlay = function() {
    baseThrillerOverlay.call(this);
    const s = this.s;
    if (s.mission !== 'thriller') return;
    const now = s.elapsed;
    const c = this.ctx;
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    let key = '';
    let side = 1;
    let alpha = 0;
    if (s.mainEventSilhouetteKey && now >= s.mainEventSilhouetteStart && now < s.mainEventSilhouetteUntil) {
      key = s.mainEventSilhouetteKey;
      side = s.mainEventSilhouetteSide || 1;
      const dur = Math.max(.01, s.mainEventSilhouetteUntil - s.mainEventSilhouetteStart);
      const p = MZV.clamp((now - s.mainEventSilhouetteStart) / dur, 0, 1);
      alpha = Math.sin(p * Math.PI);
    } else if (s.threatBlackoutUntil > now) {
      key = nextBossSilhouette(s);
      side = s.threatApparitionSide || (Math.sin(now * 7) < 0 ? -1 : 1);
      const start = s.threatBlackoutStart || now;
      const dur = Math.max(.01, s.threatBlackoutUntil - start);
      const p = MZV.clamp((now - start) / dur, 0, 1);
      alpha = Math.sin(p * Math.PI);
    }
    if (key && alpha > .02) {
      const img = this.asset(key);
      if (img) {
        const hh = Math.min(h * .76, 420);
        const ratio = img.naturalHeight ? img.naturalWidth / img.naturalHeight : .7;
        const ww = hh * ratio;
        const x = side < 0 ? w * .22 : w * .78;
        const y = h * .54;
        c.save();
        const glow = c.createRadialGradient(x, y, hh * .05, x, y, hh * .62);
        glow.addColorStop(0, `rgba(235,238,228,${.17 * alpha})`);
        glow.addColorStop(.45, `rgba(120,15,18,${.12 * alpha})`);
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        c.fillStyle = glow;
        c.fillRect(Math.max(0, x - ww), Math.max(0, y - hh * .7), Math.min(w, ww * 2), Math.min(h, hh * 1.4));
        c.restore();
        c.save();
        c.globalAlpha = .42 + .55 * alpha;
        c.filter = 'brightness(0) contrast(180%)';
        c.shadowColor = `rgba(245,238,215,${.46 + .34 * alpha})`;
        c.shadowBlur = 20 + 18 * alpha;
        c.drawImage(img, x - ww / 2, y - hh / 2, ww, hh);
        c.restore();
        s.mainEventRenderedSilhouetteKey = key;
      }
    }
  };

  window.addEventListener('DOMContentLoaded', () => {
    const app = window.__MZV_APP__;
    if (app && !Array.isArray(app.state.mainEventQueue)) resetPreludeState(app.state);
    const footer = document.querySelector('footer');
    if (footer) footer.textContent = 'V4.6.9.4 LOCAL TEST · Main Event Blackout · Boss Silhouettes · Loot · Boss Hints · Thriller Tension';
    document.title = 'MENESES: ZOMBIES & VAMPIROS — V4.6.9.4 MAIN EVENT BLACKOUT';
  }, { once: true });

  console.info('[MZV]', BUILD, 'main-event blackout + next-boss silhouette loaded');
})();
