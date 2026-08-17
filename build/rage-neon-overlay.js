(() => {
  'use strict';
  if (!window.MZV) return;

  const BUILD = '4.6.9.6-local-rage-neon-overlay';

  const isRage = s => !!(s && s.elapsed < (s.rageUntil || 0));
  const isRampage = s => !!(s && s.elapsed < (s.rampageUntil || 0));
  const rescueBoost = s => !!(s && s.elapsed < (s.rampageUntil || 0) && s.elapsed < (s.rampageRescueBonusUntil || 0));
  const visibleMultiplier = s => rescueBoost(s)
    ? (MZV.RULES.rampageScoreMultiplier * 2)
    : isRampage(s)
      ? MZV.RULES.rampageScoreMultiplier
      : isRage(s)
        ? MZV.RULES.rageScoreMultiplier
        : 1;

  function resetBonusHud(s) {
    if (!s) return;
    s.rageBonusBank = 0;
    s.rageBonusDisplay = 0;
    s.rageBonusLastGain = 0;
    s.rageBonusFlashUntil = 0;
    s.rageBonusIntroUntil = (s.elapsed || 0) + 1.1;
  }

  const baseStart = MZV.RageMode.prototype.start;
  MZV.RageMode.prototype.start = function(...args) {
    const out = baseStart.apply(this, args);
    resetBonusHud(this.s);
    return out;
  };

  const baseStartRampage = MZV.RageMode.prototype.startRampage;
  MZV.RageMode.prototype.startRampage = function(...args) {
    const out = baseStartRampage.apply(this, args);
    resetBonusHud(this.s);
    return out;
  };

  const baseKillEnemy = MZV.CombatSystem.prototype.killEnemy;
  MZV.CombatSystem.prototype.killEnemy = function(z, source = 'support') {
    const s = this.s;
    const rage = isRage(s);
    const rampage = isRampage(s);
    const before = s?.score || 0;
    let baseline = 0;
    if (rage || rampage) {
      const nextCombo = rage ? ((s.combo || 0) + 1) : (s.combo || 0);
      const comboBonus = rage ? (1 + Math.min(20, nextCombo) * 0.05) : 1;
      const carnageMultiplier = s.carnageActive ? 1.5 : 1;
      baseline = Math.round(MZV.killBaseScore(z.type) * comboBonus * carnageMultiplier);
    }
    const out = baseKillEnemy.call(this, z, source);
    if ((rage || rampage) && s && s.score > before) {
      const delta = s.score - before;
      const bonus = Math.max(0, delta - baseline);
      if (bonus > 0) {
        s.rageBonusBank = (s.rageBonusBank || 0) + bonus;
        s.rageBonusLastGain = bonus;
        s.rageBonusFlashUntil = (s.elapsed || 0) + 0.55;
      }
    }
    return out;
  };

  const baseDrawRageHud = MZV.Renderer.prototype.drawRageHud;
  MZV.Renderer.prototype.drawRageHud = function() {
    baseDrawRageHud.call(this);
    const s = this.s;
    if (!isRage(s)) return;
    if (typeof s.rageBonusBank !== 'number') resetBonusHud(s);
    const c = this.ctx;
    const w = this.canvas.clientWidth;
    const elapsed = s.elapsed || 0;
    const pulse = 0.5 + 0.5 * Math.sin(elapsed * 8.5);
    const pulse2 = 0.5 + 0.5 * Math.sin(elapsed * 12.5 + 0.7);
    const mult = visibleMultiplier(s);
    const rr = s.reinforcement;
    const bank = Math.max(0, s.rageBonusBank || 0);
    let display = Math.max(0, s.rageBonusDisplay || 0);
    if (display < bank) {
      const gap = bank - display;
      display += Math.max(16, gap * 0.22);
      if (display > bank) display = bank;
    } else display = bank;
    s.rageBonusDisplay = display;

    const panelW = Math.min(290, Math.max(220, w * 0.24));
    const panelH = 134;
    const x = w - panelW - 16;
    const y = 102;
    c.save();
    c.globalAlpha = 0.96;
    c.fillStyle = 'rgba(8, 12, 22, 0.78)';
    c.strokeStyle = `rgba(65, 180, 255, ${0.74 + 0.18 * pulse})`;
    c.lineWidth = 2.5;
    c.shadowColor = '#2ec8ff';
    c.shadowBlur = 18;
    c.beginPath(); c.roundRect(x, y, panelW, panelH, 18); c.fill(); c.stroke();
    c.shadowBlur = 0;
    c.strokeStyle = `rgba(255, 230, 80, ${0.65 + 0.25 * pulse2})`;
    c.lineWidth = 1.4;
    c.beginPath(); c.roundRect(x + 6, y + 6, panelW - 12, panelH - 12, 14); c.stroke();
    c.textAlign = 'left';
    c.fillStyle = '#7be0ff';
    c.font = '900 13px Segoe UI, Arial, sans-serif';
    c.fillText(rr ? `${rr.name.toUpperCase()} SUPPORT` : 'SURVIVAL SUPPORT', x + 16, y + 22);
    c.fillStyle = '#ffe456';
    c.shadowColor = '#ffe456'; c.shadowBlur = 12;
    c.font = `1000 ${isRampage(s) ? 32 : 28}px Segoe UI, Arial, sans-serif`;
    c.fillText(`×${mult}`, x + 16, y + 58);
    c.shadowColor = '#2ec8ff'; c.shadowBlur = 16; c.fillStyle = '#2ec8ff';
    c.font = '900 14px Segoe UI, Arial, sans-serif';
    c.fillText(isRampage(s) ? 'RAMPAGE MULTI' : 'RAGE MULTI', x + 76, y + 44);
    c.font = '1000 22px Segoe UI, Arial, sans-serif'; c.fillStyle = '#9af4ff';
    c.fillText(`+${Math.round(display).toLocaleString()}`, x + 16, y + 92);
    c.shadowBlur = 0; c.fillStyle = 'rgba(255,255,255,0.92)'; c.font = '800 12px Segoe UI, Arial, sans-serif';
    c.fillText('BÓNUS A ACUMULAR', x + 16, y + 110);
    if ((s.rageBonusFlashUntil || 0) > elapsed && (s.rageBonusLastGain || 0) > 0) {
      const a = MZV.clamp((s.rageBonusFlashUntil - elapsed) / 0.55, 0, 1);
      c.fillStyle = `rgba(255, 232, 105, ${0.55 + 0.45 * a})`;
      c.shadowColor = '#fff06a'; c.shadowBlur = 14; c.textAlign = 'right';
      c.font = `1000 ${Math.round(18 + 5 * (1 - a))}px Segoe UI, Arial, sans-serif`;
      c.fillText(`+${Math.round(s.rageBonusLastGain)}`, x + panelW - 16, y + 38);
    }
    if ((s.rageBonusIntroUntil || 0) > elapsed) {
      const a = MZV.clamp((s.rageBonusIntroUntil - elapsed) / 1.1, 0, 1);
      c.textAlign = 'center'; c.shadowBlur = 22; c.shadowColor = '#2ec8ff';
      c.fillStyle = `rgba(46, 200, 255, ${0.22 + 0.5 * a})`;
      c.font = '900 12px Segoe UI, Arial, sans-serif';
      c.fillText('80s BONUS FEVER', x + panelW * 0.65, y + panelH - 14);
    }
    c.restore();
  };

  window.addEventListener('DOMContentLoaded', () => {
    document.title = 'MENESES: ZOMBIES & VAMPIROS — V4.6.9.6 RAGE BONUS MULTIPLIER';
    const footer = document.querySelector('footer');
    if (footer) footer.textContent = 'V4.6.9.6 LOCAL TEST · Rage Neon Multiplier · Rampage Rescue ×2 · Main Event Blackout · Loot · Boss Hints · Thriller Tension';
  }, { once: true });

  console.info('[MZV]', BUILD, 'loaded');
})();
