(() => {
  'use strict';
  if (!window.MZV) return;

  const BUILD = '4.6.9.3-local';
  const SCHEDULE_START = 4;
  const SCHEDULE_EVERY = 3;
  const EMERGENCY_HP = 0.42;
  const EMERGENCY_COOLDOWN = 65;
  const EMERGENCY_LEVEL_GAP = 2;


  // 2 seconds is now a valid survival setting. Patch validation before GameApp loads settings.
  const oldSettingsValidate = MZV.SettingsSystem?.prototype?.validate;
  if (oldSettingsValidate && !MZV.SettingsSystem.prototype.__loot493ValidatePatched) {
    MZV.SettingsSystem.prototype.validate = function() {
      const requested = Number(this.current?.chestOpenSeconds);
      oldSettingsValidate.call(this);
      if (requested === 2) this.current.chestOpenSeconds = 2;
    };
    MZV.SettingsSystem.prototype.__loot493ValidatePatched = true;
  }

  const alivePlayers = s => s.players.filter(p => p.alive && !p.out);
  const averageHp = s => {
    const a = alivePlayers(s);
    if (!a.length) return 1;
    return a.reduce((q,p) => q + (p.hp / Math.max(1,p.maxHp)), 0) / a.length;
  };

  // All chests, including Mystery, obey the selected chest-opening time.
  const BaseChest = MZV.Chest;
  MZV.Chest = class TimedChest extends BaseChest {
    constructor(...args) {
      super(...args);
      this.required = MZV.SETTINGS.chestSeconds();
      if (this.type === 'mystery') this.life = Math.max(this.life, 34);
    }
  };

  const weightedPick = entries => {
    const total = entries.reduce((q,e) => q + Math.max(0,e[1]), 0);
    let r = Math.random() * total;
    for (const [id,w] of entries) {
      r -= Math.max(0,w);
      if (r <= 0) return id;
    }
    return entries[entries.length - 1]?.[0] || 'medic';
  };

  function chooseMysteryReward(s, emergency=false) {
    const hp = averageHp(s);
    const players = alivePlayers(s);
    const noLife = players.some(p => (p.extraLives || 0) <= 0);
    const heliActive = (s.helicopters || []).some(h => (h.life || 0) > 0);

    const entries = [
      ['secondChance', noLife ? 22 : 13],
      ['medic', emergency || hp < .50 ? 28 : 18],
      ['airCavalry', heliActive ? 10 : 17],
      ['guardian', hp < .60 ? 18 : 14],
      ['arsenal', 15],
      ['rampage', emergency ? 5 : 9],
      ['jackpot', 6],
    ];
    return weightedPick(entries);
  }

  function closeMysteryPos(s, emergency=false) {
    const a = alivePlayers(s);
    const cx = a.reduce((q,p)=>q+p.x,0)/(a.length||1);
    const cy = a.reduce((q,p)=>q+p.y,0)/(a.length||1);
    const ang = Math.random() * Math.PI * 2;
    const d = emergency ? MZV.rand(230,340) : MZV.rand(330,500);
    return {
      x: MZV.clamp(cx + Math.cos(ang)*d, 80, MZV.WORLD.width-80),
      y: MZV.clamp(cy + Math.sin(ang)*d, 80, MZV.WORLD.height-80),
    };
  }

  // More frequent Mystery Boxes: every 3 levels from level 4, plus a low-HP pity spawn.
  MZV.LootSystem.prototype.spawnMysteryForLevel = function() {
    const s = this.s;
    const level = s.level;
    if (!s.mysterySpawnedLevels) s.mysterySpawnedLevels = new Set();
    if (s.chests.some(c => !c.opened && c.type === 'mystery')) return;
    if (s.mysterySpawnedLevels.has(level)) return;

    const scheduled = level >= SCHEDULE_START && ((level - SCHEDULE_START) % SCHEDULE_EVERY === 0);
    const hp = averageHp(s);
    const lastAt = Number.isFinite(s.lastMysteryAt) ? s.lastMysteryAt : -999;
    const lastLevel = Number.isFinite(s.lastMysteryLevel) ? s.lastMysteryLevel : -999;
    const emergency = level >= 3 && hp <= EMERGENCY_HP && (s.elapsed - lastAt) >= EMERGENCY_COOLDOWN && (level - lastLevel) >= EMERGENCY_LEVEL_GAP;

    if (!scheduled && !emergency) return;

    s.mysterySpawnedLevels.add(level);
    s.lastMysteryAt = s.elapsed;
    s.lastMysteryLevel = level;

    const pos = closeMysteryPos(s, emergency);
    const reward = chooseMysteryReward(s, emergency);
    const c = new MZV.Chest('mystery', 'mystery', pos.x, pos.y, reward);
    c.emergency = emergency;
    c.life = emergency ? 38 : 34;
    s.chests.push(c);

    // Still risk/reward, but not another death sentence in the new survival balance.
    const guardCount = emergency ? 3 : Math.min(8, 4 + Math.floor(level / 12));
    for (let i=0;i<guardCount;i++) {
      const a = Math.PI*2*i/guardCount + Math.random()*.32;
      const d = MZV.rand(85,145);
      const roll = Math.random();
      const type = level >= 20 && roll < .12 ? 'commander' : roll < .45 ? 'runner' : roll < .65 ? 'tank' : 'normal';
      const z = new MZV.Enemy(
        type,
        MZV.clamp(c.x + Math.cos(a)*d, 30, MZV.WORLD.width-30),
        MZV.clamp(c.y + Math.sin(a)*d, 30, MZV.WORLD.height-30),
        level,
        false,
        s.mode === 'single'
      );
      z.hp *= emergency ? .92 : 1.04;
      s.enemies.push(z);
    }

    this.audio.play('tactical', .46);
    if (emergency) {
      this.notify(`❓❤️ EMERGENCY MYSTERY · HP DA EQUIPA BAIXO · ${c.life}s PARA CHEGAR`);
    } else {
      this.notify(`❓ MYSTERY BOX · NÍVEL ${level} · NOVA RECOMPENSA · ${c.life}s PARA APANHAR`);
    }
  };

  MZV.LootSystem.prototype.mysteryReward = function(p,c) {
    const s = this.s;
    const app = window.__MZV_APP__;
    const reward = c.specialReward || chooseMysteryReward(s, !!c.emergency);
    const team = alivePlayers(s);

    // Legacy compatibility with old crates already in a save/session.
    if (reward === 'extraLife') {
      p.extraLives = (p.extraLives || 0) + 1;
      this.audio.play('revive', .78);
      this.notify(`❓❤️ SECOND CHANCE · ${p.name.toUpperCase()} +1 VIDA EXTRA`);
      return;
    }
    if (reward === 'rage') {
      const result = this.rage.startFromCrate();
      if (result === 'rampage') this.notify('❓🔥 MYSTERY · RAMPAGE!');
      return;
    }

    if (reward === 'secondChance') {
      p.extraLives = (p.extraLives || 0) + 1;
      for (const q of team) q.hp = Math.min(q.maxHp, q.hp + 25);
      this.audio.play('revive', .82);
      this.notify(`❓❤️ SECOND CHANCE · ${p.name.toUpperCase()} +1 VIDA · EQUIPA +25 HP`);
      return;
    }

    if (reward === 'medic') {
      for (const q of team) {
        q.hp = Math.min(q.maxHp, q.hp + 65);
        q.shieldLevel = Math.max(q.shieldLevel || 0, 1);
        q.shieldHp = Math.max(q.shieldHp || 0, 55);
        q.shieldUntil = Math.max(q.shieldUntil || 0, s.elapsed + 24);
      }
      this.audio.play('heal', .62);
      this.notify('❓❤️ MEDIC JACKPOT · EQUIPA +65 HP · SHIELD 24s');
      return;
    }

    if (reward === 'airCavalry') {
      s.airstrikeCharges += 2;
      if ((s.helicopters || []).length) {
        for (const h of s.helicopters) h.life = Math.max(h.life || 0, 34);
      } else if (app?.combat?.deployHelicopter) {
        app.combat.deployHelicopter();
      } else {
        s.pendingHelicopter = (s.pendingHelicopter || 0) + 1;
      }
      this.audio.play('drone', .58);
      this.notify('❓🚁 AIR CAVALRY · HELICÓPTERO + 2 AIRSTRIKES');
      return;
    }

    if (reward === 'guardian') {
      for (const q of team) {
        q.shieldLevel = Math.max(q.shieldLevel || 0, 2);
        q.shieldHp = Math.max(q.shieldHp || 0, 95);
        q.shieldUntil = Math.max(q.shieldUntil || 0, s.elapsed + 45);
        q.droneLevel = Math.max(q.droneLevel || 0, 1);
        q.droneUntil = Math.max(q.droneUntil || 0, s.elapsed + 70);
        if (!s.drones.some(d => d.owner === q)) s.drones.push(new MZV.Drone(q));
      }
      this.audio.play('shield', .62);
      this.notify('❓🛡 GUARDIAN · EQUIPA SHIELD 45s + DRONES 70s');
      return;
    }

    if (reward === 'arsenal') {
      this.upgradeWeapon(p, 'epic');
      s.overdriveUntil = Math.max(s.overdriveUntil || 0, s.elapsed) + 90;
      s.airstrikeCharges += 1;
      this.audio.play('chest', .68);
      this.notify(`❓🔥 ARSENAL · ${p.name.toUpperCase()} UPGRADE ÉPICO · OVERDRIVE 90s · AIRSTRIKE +1`);
      return;
    }

    if (reward === 'rampage') {
      for (const q of team) q.hp = Math.min(q.maxHp, q.hp + 20);
      this.rage.startRampage();
      this.notify('❓🔥 RAMPAGE JACKPOT · +20 HP · 4 ARMAS · SCORE ×3');
      return;
    }

    // Rare top-tier recovery reward.
    if (reward === 'jackpot') {
      p.extraLives = (p.extraLives || 0) + 1;
      for (const q of team) {
        q.hp = q.maxHp;
        q.shieldLevel = Math.max(q.shieldLevel || 0, 2);
        q.shieldHp = Math.max(q.shieldHp || 0, 110);
        q.shieldUntil = Math.max(q.shieldUntil || 0, s.elapsed + 45);
      }
      s.airstrikeCharges += 2;
      s.overdriveUntil = Math.max(s.overdriveUntil || 0, s.elapsed) + 90;
      if ((s.helicopters || []).length) {
        for (const h of s.helicopters) h.life = Math.max(h.life || 0, 38);
      } else if (app?.combat?.deployHelicopter) {
        app.combat.deployHelicopter();
      }
      this.audio.play('revive', .88);
      this.notify('❓⭐ SURVIVAL JACKPOT · VIDA EXTRA · FULL HP · SHIELD · HELI · 2 AIRSTRIKES · OVERDRIVE');
      return;
    }
  };

  // Rebuild chest opening so the setting is live and applies to every chest type.
  // Also allows two players to open two separate crates at the same time.
  MZV.LootSystem.prototype.updateChests = function(dt) {
    const required = MZV.SETTINGS.chestSeconds();
    const order = MZV.SETTINGS.current.weaponOrder;

    for (const c of this.s.chests) {
      if (c.opened) continue;
      c.life -= dt;
      if (c.life <= 0) {
        c.opened = true;
        continue;
      }

      c.required = required;
      const touch = this.s.players.filter(p => p.alive && !p.out && Math.hypot(p.x-c.x,p.y-c.y) < p.radius+c.radius+8);
      if (!touch.length) continue;

      c.progress += dt * (touch.length >= 2 ? MZV.RULES.cooperativeMultiplier : 1);
      if (c.progress < c.required) continue;

      c.opened = true;
      const receiver = touch.sort((a,b) => order.indexOf(a.weaponId)-order.indexOf(b.weaponId))[0];
      if (c.type === 'mystery') {
        this.audio.play('tactical', .72);
        this.mysteryReward(receiver,c);
      } else if (c.type === 'normal') {
        this.audio.play('chest', .45);
        this.upgradeWeapon(receiver,c.rarity);
      } else if (c.type === 'tactical') {
        this.audio.play('tactical', .5);
        this.tactical(receiver,c);
      } else {
        this.audio.play('tactical', .62);
        this.special(receiver,c);
      }
    }
    this.s.chests = this.s.chests.filter(c => !c.opened);
  };

  window.addEventListener('DOMContentLoaded', () => {
    const label = document.querySelector('label[for="setChestTime"]');
    if (label) label.textContent = 'Tempo para abrir qualquer caixa';
    const select = document.getElementById('setChestTime');
    if (select && !select.querySelector('option[value="2"]')) {
      const opt = document.createElement('option');
      opt.value = '2';
      opt.textContent = '2 segundos';
      select.insertBefore(opt, select.firstChild);
    }
    const noteTarget = select?.closest('.settings-section')?.querySelector('.settings-note');
    if (noteTarget) noteTarget.textContent = 'Aplica-se a Normal, Tactical, Special e Mystery Box. Em cooperação, dois jogadores abrem aproximadamente 2× mais rápido.';

    const footer = document.querySelector('footer');
    if (footer) footer.textContent = 'V4.6.9.3 LOCAL TEST · Loot Rebalance · Mystery Survival Rewards · Boss Hints · Thriller Tension';
    document.title = 'MENESES: ZOMBIES & VAMPIROS — V4.6.9.3 LOCAL LOOT REBALANCE';
  }, { once:true });

  console.info('[MZV]', BUILD, 'loot + mystery rebalance loaded');
})();
