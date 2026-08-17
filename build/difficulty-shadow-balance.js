(() => {
  'use strict';
  if (!window.MZV) return;

  const BUILD = '4.6.9-test';
  const STORAGE_KEY = 'mzv.difficulty.v1';
  const DIFFICULTIES = {
    easy:      { label:'EASY',      desc:'A experiência actual, equilibrada.', horde:1.00, hp:1.00, speed:1.00, damage:1.00, bossHp:1.00, bossDamage:1.00, score:1.00, shadowActive:18, shadowPending:8 },
    hard:      { label:'HARD',      desc:'Mais pressão, bosses mais resistentes.', horde:1.18, hp:1.12, speed:1.07, damage:1.12, bossHp:1.30, bossDamage:1.12, score:1.50, shadowActive:24, shadowPending:12 },
    nightmare: { label:'NIGHTMARE', desc:'Hordas densas e pouca margem para erro.', horde:1.40, hp:1.25, speed:1.14, damage:1.30, bossHp:1.70, bossDamage:1.30, score:2.50, shadowActive:32, shadowPending:16 },
    thriller:  { label:'THRILLER',  desc:'O Director deixa de ser simpático.', horde:1.65, hp:1.40, speed:1.20, damage:1.45, bossHp:2.10, bossDamage:1.45, score:4.00, shadowActive:40, shadowPending:20 },
  };

  let selected = 'easy';
  try { selected = localStorage.getItem(STORAGE_KEY) || 'easy'; } catch {}
  if (!DIFFICULTIES[selected]) selected = 'easy';
  window.MZV_SELECTED_DIFFICULTY = selected;
  const cfg = () => DIFFICULTIES[window.MZV_SELECTED_DIFFICULTY] || DIFFICULTIES.easy;

  // Difficulty affects real gameplay, not just the menu label.
  const baseCount = MZV.levelBaseCount;
  MZV.levelBaseCount = level => Math.max(1, Math.round(baseCount(level) * cfg().horde));
  const baseScore = MZV.killBaseScore;
  MZV.killBaseScore = type => Math.round(baseScore(type) * cfg().score);

  const OriginalEnemy = MZV.Enemy;
  MZV.Enemy = class DifficultyEnemy extends OriginalEnemy {
    constructor(...args) {
      super(...args);
      const boss = !!args[4];
      const d = cfg();
      // Normal enemies scale here. Bosses are scaled only after releaseBoss(),
      // because the boss director replaces their final HP/speed/damage after construction.
      if (!boss) {
        this.maxHp *= d.hp;
        this.hp = this.maxHp;
        this.baseSpeed *= d.speed;
        this.speed = this.baseSpeed;
        this.damage *= d.damage;
      }
      this._difficultyApplied = !boss;
    }
  };

  // Boss variants overwrite their stats after Enemy construction; apply difficulty once more after release.
  const originalReleaseBoss = MZV.HordeSystem.prototype.releaseBoss;
  MZV.HordeSystem.prototype.releaseBoss = function(...args) {
    const before = new Set(this.state.enemies);
    const out = originalReleaseBoss.apply(this, args);
    const d = cfg();
    for (const z of this.state.enemies) {
      if (before.has(z) || !z.isBoss || z._variantDifficultyApplied) continue;
      // Variant code already replaced base numbers, so scale from those final values.
      z.maxHp *= d.bossHp;
      z.hp = z.maxHp;
      z.baseSpeed *= d.speed;
      z.speed = z.baseSpeed;
      z.damage *= d.bossDamage;
      z._variantDifficultyApplied = true;
    }
    return out;
  };

  // Level 9: the challenge must be Shadow Dancer, not an already saturated screen.
  const originalStartLevel = MZV.HordeSystem.prototype.startLevel;
  MZV.HordeSystem.prototype.startLevel = function(...args) {
    const out = originalStartLevel.apply(this, args);
    const s = this.state;
    if (s.mission === 'thriller' && s.level === 9) {
      const d = cfg();
      s.pendingHordeCount = Math.min(s.pendingHordeCount || 0, d.shadowPending);
      const nonBoss = s.enemies.filter(z => z.alive && !z.isBoss);
      if (nonBoss.length > d.shadowActive) {
        const players = s.players.filter(p => p.alive && !p.out);
        const cx = players.reduce((q,p)=>q+p.x,0)/(players.length||1);
        const cy = players.reduce((q,p)=>q+p.y,0)/(players.length||1);
        nonBoss.sort((a,b) => Math.hypot(a.x-cx,a.y-cy) - Math.hypot(b.x-cx,b.y-cy));
        for (let i=d.shadowActive; i<nonBoss.length; i++) nonBoss[i].alive = false;
      }
      s.shadowPrepUntil = s.elapsed + 15;
      s.shadowPrepReleased = false;
      const app = window.__MZV_APP__;
      if (app) {
        if (s.helicopters?.length) {
          for (const h of s.helicopters) h.life = Math.max(h.life || 0, 32);
        } else {
          app.combat.deployHelicopter();
        }
        app.notify('🚁 SHADOW DANCER EM 15s · AIR SUPPORT INBOUND · LIMPA A ZONA!');
      }
    }
    return out;
  };

  // Hold the boss through the 15-second preparation window, even if the song hits a BOSS/DROP cue sooner.
  const originalHordeCue = MZV.HordeSystem.prototype.onMusicCue;
  MZV.HordeSystem.prototype.onMusicCue = function(cue) {
    const s = this.state;
    if (s.mission === 'thriller' && s.level === 9 && s.pendingBossVariant === 'shadowDancer' && s.shadowPrepUntil > s.elapsed) {
      if (cue && ['BOSS','DROP','RAGE'].includes(cue.type)) return;
    }
    return originalHordeCue.call(this, cue);
  };



  // Mobile FOV: use the desktop screenshot as the visual reference, not 1 world unit = 1 CSS px.
  // On a typical landscape phone this lands around 0.60–0.66 zoom, showing roughly the same world depth as desktop.
  const originalCameraProfile = MZV.Renderer.prototype.cameraProfile;
  const mobileZoom = (w,h) => MZV.clamp(Math.min(w / 1720, h / 760), 0.55, 0.72);
  MZV.Renderer.prototype.cameraProfile = function() {
    if (!this.mobileLayout()) return originalCameraProfile.call(this);
    const w=this.canvas.clientWidth, h=this.canvas.clientHeight, zoom=mobileZoom(w,h);
    return { zoom, focusX:w/2, focusY:h/2 };
  };

  // On mobile, auto-fire only locks targets that are actually at least partially visible.
  const originalNearest = MZV.CombatSystem.prototype.nearest;
  MZV.CombatSystem.prototype.nearest = function(p, range) {
    if (!document.documentElement.classList.contains('touch-device')) return originalNearest.call(this,p,range);
    const canvas=document.getElementById('game');
    if(!canvas) return originalNearest.call(this,p,range);
    const w=canvas.clientWidth||innerWidth,h=canvas.clientHeight||innerHeight,zoom=mobileZoom(w,h),cam=this.s.camera||{x:0,y:0};
    const maxX=cam.x+w/zoom,maxY=cam.y+h/zoom;
    let best=null,d0=Infinity;
    for(const z of this.s.enemies){
      if(!z.alive)continue;
      const r=Math.max(16,z.radius||20);
      if(z.x+r<cam.x||z.x-r>maxX||z.y+r<cam.y||z.y-r>maxY)continue;
      const d=Math.hypot(z.x-p.x,z.y-p.y);
      if(d<d0&&d<=range){best=z;d0=d;}
    }
    return best;
  };

  function installDifficultyMenu(app) {
    const card = document.querySelector('#menu .card');
    if (!card || document.getElementById('difficultyMenu')) return;

    const panel = document.createElement('div');
    panel.id = 'difficultyMenu';
    panel.className = 'hidden';
    panel.innerHTML = `
      <h1>ESCOLHE A DIFICULDADE</h1>
      <div class="mission-choice-line">MISSÃO: <b id="difficultyMission">THRILLER</b></div>
      <div class="sub">A dificuldade altera hordas, resistência, velocidade, dano dos bosses e multiplicador de score.</div>
      <div class="difficulty-grid">
        ${Object.entries(DIFFICULTIES).map(([id,d]) => `
          <button class="difficulty-card" data-difficulty="${id}">
            <b>${d.label}</b><small>${d.desc}</small><span>SCORE ×${d.score}</span>
          </button>`).join('')}
      </div>
      <div class="actions"><button id="difficultyBack">← MUDAR MISSÃO</button><span class="sub">Escolhe antes de veres o Boss Bible.</span></div>`;
    card.appendChild(panel);

    const style = document.createElement('style');
    style.textContent = `
      .difficulty-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:14px}
      .difficulty-card{border-radius:16px!important;padding:18px 13px!important;text-align:left;background:linear-gradient(180deg,#1a252d,#10171c);border:1px solid #36464f}
      .difficulty-card b{display:block;font-size:22px;margin-bottom:7px}.difficulty-card small{display:block;min-height:42px;color:#aeb9b4;line-height:1.35}.difficulty-card span{display:inline-block;margin-top:12px;color:#f3c74f;font-weight:1000}
      .difficulty-card[data-difficulty="thriller"]{border-color:#9b3339;background:linear-gradient(180deg,#28191d,#11161a)}
      .difficulty-card.selected{outline:3px solid #f3c74f;box-shadow:0 0 25px rgba(243,199,79,.18)}
      #bossBibleDifficulty{display:inline-block;margin-left:7px;padding:4px 8px;border-radius:999px;background:#5c2025;color:#fff;font-size:11px;font-weight:1000}
      @media(max-width:850px){.difficulty-grid{grid-template-columns:repeat(2,1fr)}.difficulty-card{padding:11px!important}.difficulty-card b{font-size:17px}.difficulty-card small{font-size:10px;min-height:28px}}
    `;
    document.head.appendChild(style);

    const originalShowPanel = app.showPanel.bind(app);
    app.showPanel = id => {
      for (const x of ['modeMenu','missionMenu','difficultyMenu','bossBibleMenu','singleCharacterMenu','twoCharacterMenu']) {
        const el = document.getElementById(x); if (el) el.classList.add('hidden');
      }
      const el = document.getElementById(id); if (el) el.classList.remove('hidden'); else originalShowPanel(id);
    };

    const selectDifficulty = id => {
      window.MZV_SELECTED_DIFFICULTY = id;
      try { localStorage.setItem(STORAGE_KEY, id); } catch {}
      document.querySelectorAll('.difficulty-card').forEach(b => b.classList.toggle('selected', b.dataset.difficulty === id));
      app.renderBossBible();
      const title = document.getElementById('bossBibleTitle');
      if (title) {
        let badge = document.getElementById('bossBibleDifficulty');
        if (!badge) { badge = document.createElement('span'); badge.id='bossBibleDifficulty'; title.appendChild(badge); }
        badge.textContent = DIFFICULTIES[id].label;
      }
      app.showPanel('bossBibleMenu');
    };

    for (const id of ['mission_deserto','mission_thriller']) {
      document.getElementById(id)?.addEventListener('click', () => {
        setTimeout(() => {
          document.getElementById('difficultyMission').textContent = (app.pendingMission || 'deserto').toUpperCase();
          document.querySelectorAll('.difficulty-card').forEach(b => b.classList.toggle('selected', b.dataset.difficulty === window.MZV_SELECTED_DIFFICULTY));
          app.showPanel('difficultyMenu');
        }, 0);
      });
    }
    document.getElementById('difficultyBack')?.addEventListener('click', () => app.showPanel('missionMenu'));
    panel.querySelectorAll('.difficulty-card').forEach(btn => btn.addEventListener('click', () => selectDifficulty(btn.dataset.difficulty)));
  }

  window.addEventListener('DOMContentLoaded', () => {
    const app = window.__MZV_APP__;
    if (!app) return;
    installDifficultyMenu(app);

    // Exact 15-second Shadow Dancer countdown. Game time pauses naturally with the game.
    setInterval(() => {
      const s = app.state;
      if (!s.running || s.mission !== 'thriller' || s.level !== 9) return;
      if (s.pendingBossVariant === 'shadowDancer' && s.shadowPrepUntil && !s.shadowPrepReleased && s.elapsed >= s.shadowPrepUntil) {
        s.shadowPrepReleased = true;
        s.shadowPrepUntil = 0;
        app.notify('🌑 SHADOW DANCER · ENTRA AGORA!');
        app.horde.releaseBoss();
      }
    }, 120);

    // Make the selected difficulty visible during play without adding HUD clutter.
    const missionLine = document.querySelector('.hud-mission-line');
    if (missionLine && !document.getElementById('hudDifficulty')) {
      const span = document.createElement('span'); span.id='hudDifficulty';
      span.textContent = DIFFICULTIES[window.MZV_SELECTED_DIFFICULTY].label;
      missionLine.appendChild(document.createElement('i')); missionLine.appendChild(span);
      const refresh = () => span.textContent = DIFFICULTIES[window.MZV_SELECTED_DIFFICULTY].label;
      document.querySelectorAll('.difficulty-card').forEach(b => b.addEventListener('click', refresh));
    }
  }, { once:true });

  console.info('[MZV]', BUILD, 'difficulty + Shadow Dancer balance loaded');
})();
