(() => {
  'use strict';
  if (!window.MZV) return;

  const BUILD = '4.6.9.5-local-rampage-rescue';

  const bonusActive = s => !!(
    s &&
    s.elapsed < (s.rampageUntil || 0) &&
    s.elapsed < (s.rampageRescueBonusUntil || 0)
  );

  // Saving the survivor DURING Rampage immediately doubles the rescue reward and
  // doubles every score gain for the rest of that same Rampage window.
  const baseRescueComplete = MZV.RescueSystem.prototype.complete;
  MZV.RescueSystem.prototype.complete = function(...args) {
    const s = this.s;
    const rampageWasActive = !!(s && s.elapsed < (s.rampageUntil || 0));
    const before = s?.score || 0;
    const out = baseRescueComplete.apply(this, args);

    if (rampageWasActive && s && s.elapsed < (s.rampageUntil || 0)) {
      // Double the rescue reward itself (+750 -> +1500) without touching points
      // earned before the rescue.
      const rescueDelta = Math.max(0, (s.score || 0) - before);
      if (rescueDelta > 0) s.score += rescueDelta;

      s.rampageRescueBonusUntil = s.rampageUntil;
      s.rampageRescueBonusTriggeredAt = s.elapsed;
      const seconds = Math.max(1, Math.ceil(s.rampageRescueBonusUntil - s.elapsed));
      this.notify?.(`❤️ RAMPAGE RESCUE · SCORE ×2 DURANTE ${seconds}s · NÃO PARES!`);
    }
    return out;
  };

  // Loaded last: this doubles the FINAL score delta after difficulty, combo,
  // Carnage and HAVOC modifiers have already been applied by earlier systems.
  const baseKillEnemy = MZV.CombatSystem.prototype.killEnemy;
  MZV.CombatSystem.prototype.killEnemy = function(z, source = 'support') {
    const s = this.s;
    const active = bonusActive(s);
    const before = s?.score || 0;
    const out = baseKillEnemy.call(this, z, source);
    if (active && s && s.score > before) {
      s.score += (s.score - before);
    }
    return out;
  };

  // Keep the existing Rage/Rampage HUD and add one very clear line only while
  // the rescue bonus is active. Base Rampage is x3, therefore the visible
  // effective Rampage multiplier becomes x6 before other situational modifiers.
  const baseDrawRageHud = MZV.Renderer.prototype.drawRageHud;
  MZV.Renderer.prototype.drawRageHud = function() {
    baseDrawRageHud.call(this);
    const s = this.s;
    if (!bonusActive(s)) return;
    const c = this.ctx;
    const w = this.canvas.clientWidth;
    const pulse = .5 + .5 * Math.sin(s.elapsed * 8);
    c.save();
    c.textAlign = 'center';
    c.font = '1000 16px Segoe UI, Arial, sans-serif';
    c.fillStyle = `rgba(255,245,140,${.78 + .22 * pulse})`;
    c.shadowColor = '#ff4f23';
    c.shadowBlur = 16;
    c.fillText(`❤️ RESCUE BONUS ×2 · RAMPAGE SCORE ×${MZV.RULES.rampageScoreMultiplier * 2}`, w / 2, 110);
    c.restore();
  };

  window.addEventListener('DOMContentLoaded', () => {
    const footer = document.querySelector('footer');
    if (footer) footer.textContent = 'V4.6.9.5 LOCAL TEST · Rampage Rescue ×2 · Main Event Blackout · Loot · Boss Hints · Thriller Tension';
    document.title = 'MENESES: ZOMBIES & VAMPIROS — V4.6.9.5 RAMPAGE RESCUE BONUS';
  }, { once: true });

  console.info('[MZV]', BUILD, 'loaded');
})();
