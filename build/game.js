"use strict";
var MZV;
(function (MZV) {
    MZV.WORLD = { width: 2600, height: 1800 };
    MZV.RULES = {
        normalChestOpen: 10,
        tacticalChestOpen: 5,
        cooperativeMultiplier: 2,
        reviveSeconds: 10,
        reviveHp: 30,
        megaHordeEvery: 5,
        powerBossEvery: 10,
        powerBossLives: 7,
        rageEvery: 15,
        rageSeconds: 120,
        rageSingleEnemyBonus: .65,
        rageTwoEnemyBonus: .45,
        rageWaveCount: 4,
        rageComboWindow: 4,
        rageScoreMultiplier: 2,
        reinforcementProgressFactor: .5,
        supportProgressFactor: .5,
        overdriveEveryKills: 50,
        overdriveSeconds: 60,
        finalBossLevel: 50,
        singleEnemyScale: .70,
        singleBossHpScale: .80,
        medkitHeal: 35,
        level10RocketSeconds: 45,
    };
    // Análise beat-aligned da faixa de gameplay fornecida.
    // BPM estimado: 117.453835. Os tempos abaixo foram alinhados aos beats detectados.
    MZV.MUSIC = {
        bpm: 117.45383522727273,
        duration: 360,
        beatsPerBar: 4,
        menuVolume: .48,
        gameplayVolume: .42,
        loopDifficultyStep: .25,
        cues: [
            { time: 0.000, type: 'INTRO', intensity: 'LOW', label: 'INTRO' },
            { time: 10.588, type: 'BUILD', intensity: 'BUILD', label: 'BUILD 1' },
            { time: 19.226, type: 'HORDE', intensity: 'HIGH', label: 'HORDE 1' },
            { time: 39.590, type: 'DROP', intensity: 'PEAK', label: 'DROP 1' },
            { time: 44.188, type: 'BOSS', intensity: 'PEAK', label: 'BOSS WINDOW 1' },
            { time: 59.954, type: 'HORDE', intensity: 'HIGH', label: 'HORDE 2' },
            { time: 75.697, type: 'RAGE', intensity: 'PEAK', label: 'RAGE WINDOW 1' },
            { time: 100.101, type: 'HORDE', intensity: 'HIGH', label: 'HORDE 3' },
            { time: 130.078, type: 'DROP', intensity: 'PEAK', label: 'DROP 2' },
            { time: 165.117, type: 'RAGE', intensity: 'PEAK', label: 'RAGE WINDOW 2' },
            { time: 179.839, type: 'BOSS', intensity: 'PEAK', label: 'BOSS WINDOW 2' },
            { time: 200.156, type: 'HORDE', intensity: 'HIGH', label: 'HORDE 4' },
            { time: 219.939, type: 'DROP', intensity: 'PEAK', label: 'DROP 3' },
            { time: 239.746, type: 'HORDE', intensity: 'HIGH', label: 'HORDE 5' },
            { time: 256.998, type: 'BREAK', intensity: 'BREAK', label: 'BREAK' },
            { time: 266.635, type: 'BOSS', intensity: 'PEAK', label: 'BOSS WINDOW 3' },
            { time: 274.762, type: 'RAGE', intensity: 'PEAK', label: 'RAGE WINDOW 3' },
            { time: 284.932, type: 'HORDE', intensity: 'HIGH', label: 'HORDE 6' },
            { time: 314.886, type: 'BUILD', intensity: 'BUILD', label: 'FINAL BUILD' },
            { time: 319.948, type: 'DROP', intensity: 'PEAK', label: 'FINAL DROP' },
            { time: 330.118, type: 'HORDE', intensity: 'HIGH', label: 'HORDE 7' },
            { time: 346.883, type: 'BOSS', intensity: 'PEAK', label: 'FINAL BOSS WINDOW' },
            { time: 357.007, type: 'END', intensity: 'LOW', label: 'LOOP END' },
        ]
    };
    MZV.CONTROLS = {
        WASD: { up: 'KeyW', down: 'KeyS', left: 'KeyA', right: 'KeyD' },
        ARROWS: { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' },
    };
    MZV.CHARACTERS = {
        marcio: { id: 'marcio', name: 'Marcio', vest: '#c7333c', minimap: '#ff5d67', description: 'Colete vermelho' },
        marco: { id: 'marco', name: 'Marco', vest: '#f2f2ec', minimap: '#f7fbff', description: 'Colete branco' },
        dany: { id: 'dany', name: 'Dany', vest: '#e83b86', minimap: '#ff5fba', description: 'Colete rosa' },
    };
    // A metralhadora é o topo permanente. Rocket Launcher é apenas temporário.
    MZV.WEAPON_ORDER = [
        'pistol', 'shotgun', 'rifle', 'machinegun', 'twinMachinegun', 'twinMachinegunOverdrive'
    ];
    MZV.WEAPONS = {
        pistol: { id: 'pistol', name: 'Pistola', fireRate: 2.2, damage: 14, speed: 700, range: 520, pellets: 1, spread: .03, projectile: 'pistol', penetration: 1, explosive: false, explosionRadius: 0, explosionDamage: 0, barrels: 1 },
        shotgun: { id: 'shotgun', name: 'Shotgun', fireRate: 1.25, damage: 10, speed: 650, range: 300, pellets: 6, spread: .58, projectile: 'shotgun', penetration: 1, explosive: false, explosionRadius: 0, explosionDamage: 0, barrels: 1 },
        rifle: { id: 'rifle', name: 'Rifle', fireRate: 1.9, damage: 29, speed: 1250, range: 850, pellets: 1, spread: .01, projectile: 'rifle', penetration: 2, explosive: false, explosionRadius: 0, explosionDamage: 0, barrels: 1 },
        machinegun: { id: 'machinegun', name: 'Metralhadora', fireRate: 8.5, damage: 8, speed: 930, range: 560, pellets: 1, spread: .065, projectile: 'machinegun', penetration: 1, explosive: false, explosionRadius: 0, explosionDamage: 0, barrels: 1 },
        twinMachinegun: { id: 'twinMachinegun', name: 'Metralhadora Dupla', fireRate: 7.0, damage: 8, speed: 960, range: 570, pellets: 1, spread: .06, projectile: 'machinegun', penetration: 1, explosive: false, explosionRadius: 0, explosionDamage: 0, barrels: 2 },
        twinMachinegunOverdrive: { id: 'twinMachinegunOverdrive', name: 'Metralhadora Dupla Ultra', fireRate: 11.0, damage: 8.5, speed: 1020, range: 590, pellets: 1, spread: .045, projectile: 'machinegun', penetration: 1, explosive: false, explosionRadius: 0, explosionDamage: 0, barrels: 2 },
        rocketLauncher: { id: 'rocketLauncher', name: 'Rocket Launcher', fireRate: .72, damage: 0, speed: 390, range: 620, pellets: 1, spread: .015, projectile: 'rocket', penetration: 1, explosive: true, explosionRadius: 112, explosionDamage: 110, barrels: 1 },
    };
    function levelBaseCount(level) {
        const table = [5, 10, 20, 30, 40, 50, 65, 80, 100];
        return table[level - 1] ?? Math.round(100 + (level - 9) * 25);
    }
    MZV.levelBaseCount = levelBaseCount;
    function killBaseScore(type) {
        if (type === 'runner')
            return 15;
        if (type === 'tank')
            return 40;
        if (type === 'commander')
            return 60;
        if (type === 'powerBoss')
            return 500;
        if (type === 'vampire')
            return 120;
        if (type === 'nocturnus')
            return 2500;
        return 10;
    }
    MZV.killBaseScore = killBaseScore;
})(MZV || (MZV = {}));
var MZV;
(function (MZV) {
    const SETTINGS_KEY = 'mzv.gameplay.settings.v1';
    class SettingsSystem {
        constructor() {
            this.current = this.defaults();
        }
        defaults() {
            return {
                chestOpenSeconds: 5,
                rageEvery: 15,
                musicSync: true,
                weaponOrder: ['pistol', 'shotgun', 'rifle', 'machinegun', 'twinMachinegun', 'twinMachinegunOverdrive'],
                tacticalLoot: { weapon: true, grenade: true, rocket: true, shield: true, drone: true, sam: true, airstrike: true },
                specialLoot: { rocket: true, helicopter: true }
            };
        }
        load() {
            try {
                const raw = localStorage.getItem(SETTINGS_KEY);
                if (!raw)
                    return this.current;
                const parsed = JSON.parse(raw);
                const d = this.defaults();
                this.current = {
                    ...d, ...parsed,
                    weaponOrder: this.normaliseWeaponOrder(parsed.weaponOrder),
                    tacticalLoot: { ...d.tacticalLoot, ...(parsed.tacticalLoot || {}) },
                    specialLoot: { ...d.specialLoot, ...(parsed.specialLoot || {}) }
                };
                this.validate();
            }
            catch {
                this.current = this.defaults();
            }
            return this.current;
        }
        save(next) {
            if (next)
                this.current = next;
            this.validate();
            try {
                localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.current));
            }
            catch { }
        }
        reset() { this.current = this.defaults(); this.save(); return this.current; }
        normaliseWeaponOrder(raw) {
            const allowed = ['pistol', 'shotgun', 'rifle', 'machinegun', 'twinMachinegun', 'twinMachinegunOverdrive'];
            const out = [];
            for (const id of raw || [])
                if (allowed.includes(id) && !out.includes(id))
                    out.push(id);
            for (const id of allowed)
                if (!out.includes(id))
                    out.push(id);
            return out;
        }
        validate() {
            if (![3, 5, 7, 10].includes(this.current.chestOpenSeconds))
                this.current.chestOpenSeconds = 5;
            if (![10, 15, 20, 25].includes(this.current.rageEvery))
                this.current.rageEvery = 15;
            this.current.weaponOrder = this.normaliseWeaponOrder(this.current.weaponOrder);
            if (!Object.values(this.current.tacticalLoot).some(Boolean))
                this.current.tacticalLoot.weapon = true;
            if (!Object.values(this.current.specialLoot).some(Boolean))
                this.current.specialLoot.rocket = true;
        }
        chestSeconds() { return this.current.chestOpenSeconds; }
        rageEvery() { return this.current.rageEvery; }
        nextWeapon(current) {
            const order = this.current.weaponOrder;
            const i = order.indexOf(current);
            if (i < 0)
                return order[0] || 'pistol';
            return order[Math.min(order.length - 1, i + 1)];
        }
        specialReward(level) {
            const available = [];
            if (this.current.specialLoot.rocket)
                available.push('rocket');
            if (this.current.specialLoot.helicopter)
                available.push('helicopter');
            if (level === 10 && available.includes('rocket'))
                return 'rocket';
            return available[Math.floor(Math.random() * available.length)] || 'rocket';
        }
    }
    MZV.SettingsSystem = SettingsSystem;
    MZV.SETTINGS = new SettingsSystem();
})(MZV || (MZV = {}));
var MZV;
(function (MZV) {
    class Player {
        constructor(def, x, y, controls, slot) {
            this.radius = 22;
            this.hp = 100;
            this.maxHp = 100;
            this.speed = 230;
            this.alive = true;
            this.out = false;
            this.downSince = null;
            this.direction = 'down';
            this.moveX = 0;
            this.moveY = 0;
            this.aimAngle = 0;
            this.weaponId = 'pistol';
            this.currentWeaponId = 'pistol';
            this.weaponLevel = 1;
            this.nextShot = 0;
            this.muzzleUntil = 0;
            this.temporaryWeaponUntil = 0;
            this.grenadeLevel = 0;
            this.nextGrenade = 0;
            this.rocketSupportLevel = 0;
            this.nextRocketSupport = 0;
            this.shieldLevel = 0;
            this.shieldHp = 0;
            this.shieldUntil = 0;
            this.droneLevel = 0;
            this.droneUntil = 0;
            this.id = def.id;
            this.name = def.name;
            this.vest = def.vest;
            this.minimap = def.minimap;
            this.controls = controls;
            this.slot = slot;
            this.x = x;
            this.y = y;
        }
        get weapon() { return MZV.WEAPONS[this.currentWeaponId]; }
        syncPermanentWeapon() { if (this.temporaryWeaponUntil <= 0)
            this.currentWeaponId = this.weaponId; }
        grantTemporaryWeapon(id, until) { this.currentWeaponId = id; this.temporaryWeaponUntil = until; }
        updateTemporaryWeapon(now) {
            if (this.temporaryWeaponUntil > 0 && now >= this.temporaryWeaponUntil) {
                this.temporaryWeaponUntil = 0;
                this.currentWeaponId = this.weaponId;
            }
        }
    }
    MZV.Player = Player;
    class Reinforcement {
        constructor(def, x, y, weaponId) {
            this.radius = 22;
            this.hp = 100;
            this.maxHp = 100;
            this.speed = 255;
            this.alive = true;
            this.direction = 'down';
            this.moveX = 0;
            this.moveY = 0;
            this.aimAngle = 0;
            this.nextShot = 0;
            this.muzzleUntil = 0;
            this.state = 'entering';
            this.recoverUntil = 0;
            this.exitTarget = { x: 0, y: 0 };
            this.id = def.id;
            this.name = def.name;
            this.vest = def.vest;
            this.minimap = def.minimap;
            this.x = x;
            this.y = y;
            this.weaponId = weaponId;
        }
        get weapon() { return MZV.WEAPONS[this.weaponId]; }
    }
    MZV.Reinforcement = Reinforcement;
    class Enemy {
        constructor(type, x, y, level, mega, single) {
            this.alive = true;
            this.vx = 0;
            this.vy = 1;
            this.direction = 'down';
            this.motionState = 'move';
            this.motionSeed = Math.random() * 1000;
            this.lateralBias = Math.random() < .5 ? -1 : 1;
            this.attackCooldown = 0;
            this.attackStartedAt = 0;
            this.attackHitAt = 0;
            this.attackEndAt = 0;
            this.attackDidHit = false;
            this.attackTarget = null;
            this.hitUntil = 0;
            this.stunUntil = 0;
            this.knockbackX = 0;
            this.knockbackY = 0;
            this.dashCooldown = MZV.rand(1.2, 3.4);
            this.dashUntil = 0;
            this.dashX = 0;
            this.dashY = 0;
            this.burstCooldown = MZV.rand(.6, 2.2);
            this.burstUntil = 0;
            this.teleportCooldown = 6;
            this.teleportPhaseEnd = 0;
            this.teleportTargetX = 0;
            this.teleportTargetY = 0;
            this.summonCooldown = 9;
            this.lives = 1;
            this.maxLives = 1;
            this.phase = 1;
            this.type = type;
            this.x = x;
            this.y = y;
            this.prevX = x;
            this.prevY = y;
            let hp = 28 + level * 4, speed = 62 + level * 2.2, r = 18, dmg = 9;
            if (type === 'runner') {
                hp *= .72;
                speed *= 1.6;
                r = 16;
            }
            if (type === 'tank') {
                hp *= 2.35;
                speed *= .68;
                r = 29;
                dmg = 14;
            }
            if (type === 'commander') {
                hp *= 2;
                speed *= .9;
                r = 26;
                dmg = 16;
            }
            if (type === 'vampire') {
                hp *= 2.4;
                speed *= 1.25;
                r = 25;
                dmg = 18;
            }
            if (type === 'powerBoss') {
                hp = 300 + level * 34;
                speed = 70 + level * .5;
                r = 50;
                dmg = 24 + level * .35;
                this.lives = MZV.RULES.powerBossLives;
                this.maxLives = MZV.RULES.powerBossLives;
            }
            if (type === 'nocturnus') {
                hp = 6200;
                speed = 92;
                r = 48;
                dmg = 24;
            }
            if (mega && type !== 'powerBoss' && type !== 'nocturnus') {
                hp *= 1.14;
                speed *= 1.08;
                dmg *= 1.08;
            }
            if (single && (type === 'powerBoss' || type === 'nocturnus'))
                hp *= MZV.RULES.singleBossHpScale;
            this.hp = hp;
            this.maxHp = hp;
            this.speed = speed;
            this.baseSpeed = speed;
            this.radius = r;
            this.damage = dmg;
        }
    }
    MZV.Enemy = Enemy;
    class Projectile {
        constructor(x, y, vx, vy, life, w, owner, source = 'support') {
            this.dead = false;
            this.x = x;
            this.y = y;
            this.vx = vx;
            this.vy = vy;
            this.life = life;
            this.damage = w.damage;
            this.kind = w.projectile;
            this.radius = w.projectile === 'rocket' ? 7 : w.projectile === 'shotgun' ? 3 : 4;
            this.penetration = w.penetration;
            this.explosive = w.explosive;
            this.explosionRadius = w.explosionRadius;
            this.explosionDamage = w.explosionDamage;
            this.owner = owner;
            this.source = source;
        }
    }
    MZV.Projectile = Projectile;
    class Chest {
        constructor(type, rarity, x, y, specialReward = null) {
            this.progress = 0;
            this.opened = false;
            this.type = type;
            this.rarity = rarity;
            this.x = x;
            this.y = y;
            this.specialReward = specialReward;
            this.radius = type === 'special' ? 35 : type === 'tactical' ? 31 : 27;
            this.required = MZV.SETTINGS.chestSeconds();
        }
    }
    MZV.Chest = Chest;
    class Pickup {
        constructor(type, x, y, life = 28, value = 0) {
            this.type = type;
            this.x = x;
            this.y = y;
            this.life = life;
            this.value = value;
        }
    }
    MZV.Pickup = Pickup;
    class Drone {
        constructor(owner) {
            this.owner = owner;
            this.nextShot = 0;
            this.x = owner.x + 45;
            this.y = owner.y - 35;
        }
    }
    MZV.Drone = Drone;
    class SamTurret {
        constructor(x, y, level) {
            this.x = x;
            this.y = y;
            this.level = level;
            this.life = 45;
            this.nextShot = 0;
            this.angle = 0;
        }
    }
    MZV.SamTurret = SamTurret;
    class Explosion {
        constructor(x, y, maxRadius, color) {
            this.x = x;
            this.y = y;
            this.maxRadius = maxRadius;
            this.color = color;
            this.life = .35;
            this.maxLife = .35;
        }
    }
    MZV.Explosion = Explosion;
    class Airstrike {
        constructor(x, y, maxDrops = 7) {
            this.x = x;
            this.y = y;
            this.maxDrops = maxDrops;
            this.elapsed = 0;
            this.nextDrop = .45;
            this.drops = 0;
            this.done = false;
        }
    }
    MZV.Airstrike = Airstrike;
    class Helicopter {
        constructor(x, y) {
            this.life = 30;
            this.nextShot = 0;
            this.nextRocket = 0;
            this.angle = 0;
            this.phase = 'entering';
            this.x = x - 360;
            this.y = y - 170;
        }
    }
    MZV.Helicopter = Helicopter;
})(MZV || (MZV = {}));
var MZV;
(function (MZV) {
    MZV.ASSET_PATHS = {
        'battlefield': 'assets/images/battlefield.png',
        'battlefield.deserto': 'assets/images/battlefield_deserto.png',
        'battlefield.thriller': 'assets/images/battlefield_thriller.png',
        'characters.dany.idle_down': 'assets/images/characters/dany/idle_down.png',
        'characters.dany.idle_left': 'assets/images/characters/dany/idle_left.png',
        'characters.dany.idle_right': 'assets/images/characters/dany/idle_right.png',
        'characters.dany.idle_up': 'assets/images/characters/dany/idle_up.png',
        'characters.dany.walk_down': 'assets/images/characters/dany/walk_down.png',
        'characters.dany.walk_left': 'assets/images/characters/dany/walk_left.png',
        'characters.dany.walk_right': 'assets/images/characters/dany/walk_right.png',
        'characters.dany.walk_up': 'assets/images/characters/dany/walk_up.png',
        'characters.marcio.idle_down': 'assets/images/characters/marcio/idle_down.png',
        'characters.marcio.idle_left': 'assets/images/characters/marcio/idle_left.png',
        'characters.marcio.idle_right': 'assets/images/characters/marcio/idle_right.png',
        'characters.marcio.idle_up': 'assets/images/characters/marcio/idle_up.png',
        'characters.marcio.walk_down': 'assets/images/characters/marcio/walk_down.png',
        'characters.marcio.walk_left': 'assets/images/characters/marcio/walk_left.png',
        'characters.marcio.walk_right': 'assets/images/characters/marcio/walk_right.png',
        'characters.marcio.walk_up': 'assets/images/characters/marcio/walk_up.png',
        'characters.marco.idle_down': 'assets/images/characters/marco/idle_down.png',
        'characters.marco.idle_left': 'assets/images/characters/marco/idle_left.png',
        'characters.marco.idle_right': 'assets/images/characters/marco/idle_right.png',
        'characters.marco.idle_up': 'assets/images/characters/marco/idle_up.png',
        'characters.marco.walk_down': 'assets/images/characters/marco/walk_down.png',
        'characters.marco.walk_left': 'assets/images/characters/marco/walk_left.png',
        'characters.marco.walk_right': 'assets/images/characters/marco/walk_right.png',
        'characters.marco.walk_up': 'assets/images/characters/marco/walk_up.png',
        'effects.explosion_large': 'assets/images/effects/explosion_large.png',
        'effects.explosion_small': 'assets/images/effects/explosion_small.png',
        'effects.grenade': 'assets/images/effects/grenade.png',
        'effects.muzzle_machinegun': 'assets/images/effects/muzzle_machinegun.png',
        'effects.muzzle_pistol': 'assets/images/effects/muzzle_pistol.png',
        'effects.muzzle_rifle': 'assets/images/effects/muzzle_rifle.png',
        'effects.muzzle_rocketLauncher': 'assets/images/effects/muzzle_rocketLauncher.png',
        'effects.muzzle_shotgun': 'assets/images/effects/muzzle_shotgun.png',
        'effects.smoke': 'assets/images/effects/smoke.png',
        'effects.thriller_logo': 'assets/images/effects/thriller_logo.png',
        'effects.thriller_apparition': 'assets/images/effects/thriller_apparition.png',
        'enemies.commander.down': 'assets/images/enemies/commander/down.png',
        'enemies.commander.left': 'assets/images/enemies/commander/left.png',
        'enemies.commander.right': 'assets/images/enemies/commander/right.png',
        'enemies.commander.up': 'assets/images/enemies/commander/up.png',
        'enemies.nocturnus.down': 'assets/images/enemies/nocturnus/down.png',
        'enemies.nocturnus.left': 'assets/images/enemies/nocturnus/left.png',
        'enemies.nocturnus.right': 'assets/images/enemies/nocturnus/right.png',
        'enemies.nocturnus.up': 'assets/images/enemies/nocturnus/up.png',
        'enemies.normal.down': 'assets/images/enemies/normal/down.png',
        'enemies.normal.left': 'assets/images/enemies/normal/left.png',
        'enemies.normal.right': 'assets/images/enemies/normal/right.png',
        'enemies.normal.up': 'assets/images/enemies/normal/up.png',
        'enemies.powerBoss.down': 'assets/images/enemies/powerBoss/down.png',
        'enemies.powerBoss.left': 'assets/images/enemies/powerBoss/left.png',
        'enemies.powerBoss.right': 'assets/images/enemies/powerBoss/right.png',
        'enemies.powerBoss.up': 'assets/images/enemies/powerBoss/up.png',
        'enemies.runner.down': 'assets/images/enemies/runner/down.png',
        'enemies.runner.left': 'assets/images/enemies/runner/left.png',
        'enemies.runner.right': 'assets/images/enemies/runner/right.png',
        'enemies.runner.up': 'assets/images/enemies/runner/up.png',
        'enemies.tank.down': 'assets/images/enemies/tank/down.png',
        'enemies.tank.left': 'assets/images/enemies/tank/left.png',
        'enemies.tank.right': 'assets/images/enemies/tank/right.png',
        'enemies.tank.up': 'assets/images/enemies/tank/up.png',
        'enemies.vampire.down': 'assets/images/enemies/vampire/down.png',
        'enemies.vampire.left': 'assets/images/enemies/vampire/left.png',
        'enemies.vampire.right': 'assets/images/enemies/vampire/right.png',
        'enemies.vampire.up': 'assets/images/enemies/vampire/up.png',
        'enemiesThriller.commander.down': 'assets/images/enemies_thriller/commander/down.png',
        'enemiesThriller.commander.left': 'assets/images/enemies_thriller/commander/left.png',
        'enemiesThriller.commander.right': 'assets/images/enemies_thriller/commander/right.png',
        'enemiesThriller.commander.up': 'assets/images/enemies_thriller/commander/up.png',
        'enemiesThriller.normal.down': 'assets/images/enemies_thriller/normal/down.png',
        'enemiesThriller.normal.left': 'assets/images/enemies_thriller/normal/left.png',
        'enemiesThriller.normal.right': 'assets/images/enemies_thriller/normal/right.png',
        'enemiesThriller.normal.up': 'assets/images/enemies_thriller/normal/up.png',
        'enemiesThriller.powerBoss.down': 'assets/images/enemies_thriller/powerBoss/down.png',
        'enemiesThriller.powerBoss.left': 'assets/images/enemies_thriller/powerBoss/left.png',
        'enemiesThriller.powerBoss.right': 'assets/images/enemies_thriller/powerBoss/right.png',
        'enemiesThriller.powerBoss.up': 'assets/images/enemies_thriller/powerBoss/up.png',
        'enemiesThriller.runner.down': 'assets/images/enemies_thriller/runner/down.png',
        'enemiesThriller.runner.left': 'assets/images/enemies_thriller/runner/left.png',
        'enemiesThriller.runner.right': 'assets/images/enemies_thriller/runner/right.png',
        'enemiesThriller.runner.up': 'assets/images/enemies_thriller/runner/up.png',
        'enemiesThriller.tank.down': 'assets/images/enemies_thriller/tank/down.png',
        'enemiesThriller.tank.left': 'assets/images/enemies_thriller/tank/left.png',
        'enemiesThriller.tank.right': 'assets/images/enemies_thriller/tank/right.png',
        'enemiesThriller.tank.up': 'assets/images/enemies_thriller/tank/up.png',
        'enemiesThriller.vampire.down': 'assets/images/enemies_thriller/vampire/down.png',
        'enemiesThriller.vampire.left': 'assets/images/enemies_thriller/vampire/left.png',
        'enemiesThriller.vampire.right': 'assets/images/enemies_thriller/vampire/right.png',
        'enemiesThriller.vampire.up': 'assets/images/enemies_thriller/vampire/up.png',
        'projectiles.machinegun': 'assets/images/projectiles/machinegun.png',
        'projectiles.pistol': 'assets/images/projectiles/pistol.png',
        'projectiles.rifle': 'assets/images/projectiles/rifle.png',
        'projectiles.rocket': 'assets/images/projectiles/rocket.png',
        'projectiles.shotgun': 'assets/images/projectiles/shotgun.png',
        'props.airstrike_target': 'assets/images/props/airstrike_target.png',
        'props.airstrike_target_alt': 'assets/images/props/airstrike_target_alt.png',
        'props.campfire': 'assets/images/props/campfire.png',
        'props.campfire_heal': 'assets/images/props/campfire_heal.png',
        'props.chest_common_closed': 'assets/images/props/chest_common_closed.png',
        'props.chest_common_open': 'assets/images/props/chest_common_open.png',
        'props.chest_epic_closed': 'assets/images/props/chest_epic_closed.png',
        'props.chest_epic_open': 'assets/images/props/chest_epic_open.png',
        'props.chest_tactical_closed': 'assets/images/props/chest_tactical_closed.png',
        'props.chest_tactical_open': 'assets/images/props/chest_tactical_open.png',
        'props.drone': 'assets/images/props/drone.png',
        'props.drone_powered': 'assets/images/props/drone_powered.png',
        'props.explosion_support': 'assets/images/props/explosion_support.png',
        'props.medkit': 'assets/images/props/medkit.png',
        'props.sam': 'assets/images/props/sam.png',
        'props.sam_firing': 'assets/images/props/sam_firing.png',
        'props.shield_core': 'assets/images/props/shield_core.png',
        'props.shield_dome': 'assets/images/props/shield_dome.png',
        'weapons.machinegun': 'assets/images/weapons/machinegun.png',
        'weapons.pistol': 'assets/images/weapons/pistol.png',
        'weapons.rifle': 'assets/images/weapons/rifle.png',
        'weapons.rocketLauncher': 'assets/images/weapons/rocketLauncher.png',
        'weapons.shotgun': 'assets/images/weapons/shotgun.png',
    };
    function assetUrl(key) {
        const embedded = window.__MZV_ASSETS__;
        return embedded?.[key] ?? MZV.ASSET_PATHS[key] ?? '';
    }
    MZV.assetUrl = assetUrl;
    class AssetStore {
        constructor() {
            this.images = new Map();
            for (const key of Object.keys(MZV.ASSET_PATHS)) {
                const img = new Image();
                img.src = assetUrl(key);
                this.images.set(key, img);
            }
        }
        get(key) { return this.images.get(key) ?? null; }
        ready(key) { const i = this.get(key); return !!i && i.complete && i.naturalWidth > 0; }
    }
    MZV.AssetStore = AssetStore;
})(MZV || (MZV = {}));
var MZV;
(function (MZV) {
    class GameState {
        constructor() {
            this.mode = 'two';
            this.selectedP1 = 'marcio';
            this.selectedP2 = 'marco';
            this.level = 1;
            this.kills = 0;
            this.progressKills = 0;
            this.levelKills = 0;
            this.score = 0;
            this.combo = 0;
            this.comboUntil = 0;
            this.rageKills = 0;
            this.elapsed = 0;
            this.running = false;
            this.gameOver = false;
            this.victory = false;
            this.nextNormalChestKill = 15;
            this.nextCampfireKill = 10;
            this.nextTacticalKill = 75;
            this.overdriveUntil = 0;
            this.rageUntil = 0;
            this.lastRageLevel = 0;
            this.lastOverdriveMilestone = 0;
            this.rageWaveNextAt = 0;
            this.rageWavesRemaining = 0;
            this.rageWaveSize = 0;
            this.airstrikeCharges = 0;
            this.megaHorde = false;
            this.pendingHordeCount = 0;
            this.pendingBoss = null;
            this.pendingBossSince = 0;
            this.pendingRageLevel = 0;
            this.pendingHelicopter = 0;
            this.musicTime = 0;
            this.musicLoop = 0;
            this.musicCue = 'INTRO';
            this.musicIntensity = 'LOW';
            this.camera = { x: 0, y: 0 };
            this.mission = 'deserto';
            this.nextLightningAt = 0;
            this.lightningAlpha = 0;
            this.scareUntil = 0;
            this.nextScareAt = 0;
            this.players = [];
            this.reinforcement = null;
            this.enemies = [];
            this.projectiles = [];
            this.helicopters = [];
            this.chests = [];
            this.pickups = [];
            this.drones = [];
            this.sams = [];
            this.explosions = [];
            this.airstrikes = [];
        }
        reset(mode, selectedP1, selectedP2 = 'marco', mission = 'deserto') {
            this.mode = mode;
            this.selectedP1 = selectedP1;
            this.selectedP2 = selectedP2;
            this.mission = mission;
            this.level = 1;
            this.kills = 0;
            this.progressKills = 0;
            this.levelKills = 0;
            this.score = 0;
            this.combo = 0;
            this.comboUntil = 0;
            this.rageKills = 0;
            this.elapsed = 0;
            this.running = true;
            this.gameOver = false;
            this.victory = false;
            this.nextNormalChestKill = 15;
            this.nextCampfireKill = 10;
            this.nextTacticalKill = 75;
            this.overdriveUntil = 0;
            this.rageUntil = 0;
            this.lastRageLevel = 0;
            this.lastOverdriveMilestone = 0;
            this.rageWaveNextAt = 0;
            this.rageWavesRemaining = 0;
            this.rageWaveSize = 0;
            this.airstrikeCharges = 0;
            this.megaHorde = false;
            this.pendingHordeCount = 0;
            this.pendingBoss = null;
            this.pendingBossSince = 0;
            this.pendingRageLevel = 0;
            this.pendingHelicopter = 0;
            this.musicTime = 0;
            this.musicLoop = 0;
            this.musicCue = 'INTRO';
            this.musicIntensity = 'LOW';
            this.camera = { x: 0, y: 0 };
            this.nextLightningAt = MZV.rand(8, 16);
            this.lightningAlpha = 0;
            this.scareUntil = 0;
            this.nextScareAt = 0;
            this.players = [];
            this.reinforcement = null;
            this.enemies = [];
            this.projectiles = [];
            this.helicopters = [];
            this.chests = [];
            this.pickups = [];
            this.drones = [];
            this.sams = [];
            this.explosions = [];
            this.airstrikes = [];
        }
    }
    MZV.GameState = GameState;
})(MZV || (MZV = {}));
var MZV;
(function (MZV) {
    class InputSystem {
        constructor() {
            this.keys = new Set();
            this.virtual = new Map([[1, { x: 0, y: 0 }], [2, { x: 0, y: 0 }]]);
            addEventListener('keydown', e => {
                this.keys.add(e.code);
                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code))
                    e.preventDefault();
            });
            addEventListener('keyup', e => this.keys.delete(e.code));
            addEventListener('blur', () => { this.keys.clear(); this.clearVirtual(); });
        }
        down(code) { return this.keys.has(code); }
        setVirtual(slot, x, y) {
            const n = Math.hypot(x, y);
            if (n > 1) {
                x /= n;
                y /= n;
            }
            this.virtual.set(slot, { x, y });
        }
        clearVirtual(slot) {
            if (slot)
                this.virtual.set(slot, { x: 0, y: 0 });
            else {
                this.virtual.set(1, { x: 0, y: 0 });
                this.virtual.set(2, { x: 0, y: 0 });
            }
        }
        movement(slot, c) {
            let kx = 0, ky = 0;
            if (this.down(c.left))
                kx--;
            if (this.down(c.right))
                kx++;
            if (this.down(c.up))
                ky--;
            if (this.down(c.down))
                ky++;
            if (kx || ky) {
                const n = Math.hypot(kx, ky) || 1;
                return { x: kx / n, y: ky / n };
            }
            return this.virtual.get(slot) ?? { x: 0, y: 0 };
        }
    }
    MZV.InputSystem = InputSystem;
})(MZV || (MZV = {}));
var MZV;
(function (MZV) {
    class TouchControls {
        constructor(input, onAirstrike, onSettings, onFullscreen) {
            this.input = input;
            this.onAirstrike = onAirstrike;
            this.onSettings = onSettings;
            this.onFullscreen = onFullscreen;
            this.enabled = false;
            this.activeMode = 'single';
            this.joysticks = new Map();
            this.enabled = this.detectTouch();
            this.bindJoystick(1, 'touchJoy1');
            this.bindJoystick(2, 'touchJoy2');
            const air = document.getElementById('touchAirstrike');
            air?.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); this.onAirstrike(); });
            const settings = document.getElementById('touchSettings');
            settings?.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); this.onSettings(); });
            const fullscreen = document.getElementById('touchFullscreen');
            fullscreen?.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); this.onFullscreen(); });
            addEventListener('pointerup', e => this.releasePointer(e.pointerId));
            addEventListener('pointercancel', e => this.releasePointer(e.pointerId));
            addEventListener('blur', () => this.reset());
            document.addEventListener('visibilitychange', () => { if (document.hidden)
                this.reset(); });
            this.applyTouchClass();
        }
        detectTouch() {
            try {
                return new URLSearchParams(location.search).get('touch') === '1' ||
                    navigator.maxTouchPoints > 0 ||
                    ('ontouchstart' in window) ||
                    (typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches);
            }
            catch {
                return false;
            }
        }
        applyTouchClass() {
            document.documentElement.classList.toggle('touch-device', this.enabled);
        }
        setMode(mode) {
            this.activeMode = mode;
            this.reset();
            const root = document.getElementById('touchControls');
            if (!root)
                return;
            root.classList.toggle('hidden', !this.enabled);
            root.classList.toggle('two-player-touch', mode === 'two');
            const j2 = document.getElementById('touchJoy2Wrap');
            if (j2)
                j2.classList.toggle('hidden', mode !== 'two');
            const p1 = document.getElementById('touchP1Label');
            if (p1)
                p1.textContent = mode === 'two' ? 'P1' : 'MOVE';
        }
        hide() {
            document.getElementById('touchControls')?.classList.add('hidden');
            this.reset();
        }
        show() {
            if (!this.enabled)
                return;
            document.getElementById('touchControls')?.classList.remove('hidden');
            this.setMode(this.activeMode);
        }
        reset() {
            this.input.clearVirtual();
            for (const [, j] of this.joysticks) {
                j.pointer = null;
                j.knob.style.transform = 'translate3d(0px,0px,0)';
            }
        }
        bindJoystick(slot, id) {
            const base = document.getElementById(id);
            const knob = document.getElementById(id + 'Knob');
            if (!base || !knob)
                return;
            const state = { base, knob, pointer: null, centerX: 0, centerY: 0, radius: 45 };
            this.joysticks.set(slot, state);
            const start = (e) => {
                if (state.pointer !== null)
                    return;
                e.preventDefault();
                e.stopPropagation();
                state.pointer = e.pointerId;
                try {
                    base.setPointerCapture(e.pointerId);
                }
                catch { }
                this.recalc(state);
                this.move(slot, state, e.clientX, e.clientY);
            };
            const move = (e) => {
                if (state.pointer !== e.pointerId)
                    return;
                e.preventDefault();
                e.stopPropagation();
                this.move(slot, state, e.clientX, e.clientY);
            };
            const end = (e) => {
                if (state.pointer !== e.pointerId)
                    return;
                e.preventDefault();
                e.stopPropagation();
                this.release(slot, state);
            };
            base.addEventListener('pointerdown', start);
            base.addEventListener('pointermove', move);
            base.addEventListener('pointerup', end);
            base.addEventListener('pointercancel', end);
        }
        recalc(j) {
            const r = j.base.getBoundingClientRect();
            j.centerX = r.left + r.width / 2;
            j.centerY = r.top + r.height / 2;
            j.radius = Math.max(28, Math.min(r.width, r.height) * .34);
        }
        move(slot, j, x, y) {
            let dx = x - j.centerX, dy = y - j.centerY;
            const d = Math.hypot(dx, dy);
            if (d > j.radius) {
                dx = dx / d * j.radius;
                dy = dy / d * j.radius;
            }
            j.knob.style.transform = `translate3d(${dx}px,${dy}px,0)`;
            const dead = .12;
            let vx = dx / j.radius, vy = dy / j.radius;
            if (Math.hypot(vx, vy) < dead) {
                vx = 0;
                vy = 0;
            }
            this.input.setVirtual(slot, vx, vy);
        }
        release(slot, j) {
            j.pointer = null;
            j.knob.style.transform = 'translate3d(0px,0px,0)';
            this.input.clearVirtual(slot);
        }
        releasePointer(pointerId) {
            for (const [slot, j] of this.joysticks)
                if (j.pointer === pointerId)
                    this.release(slot, j);
        }
    }
    MZV.TouchControls = TouchControls;
})(MZV || (MZV = {}));
var MZV;
(function (MZV) {
    class AudioSystem {
        constructor() {
            this.enabled = true;
            this.pools = new Map();
            this.cursor = new Map();
            this.musicMode = 'none';
            this.files = {
                pistol: 'pistol.wav', machinegun: 'machinegun.wav', shotgun: 'shotgun.wav', rifle: 'rifle.wav', rocket: 'rocket_launch.wav', explosion: 'explosion.wav',
                chest: 'chest.wav', tactical: 'tactical.wav', heal: 'heal.wav', shield: 'shield.wav', drone: 'drone.wav', sam: 'sam.wav', airstrike: 'airstrike.wav',
                down: 'revive_alarm.wav', revive: 'revive_success.wav', boss: 'boss_roar.wav', nocturnus: 'nocturnus.wav', rage: 'rage.wav', level: 'level.wav', gameover: 'gameover.wav', victory: 'victory.wav', laugh: 'thriller_laugh.ogg'
            };
            for (const [k, f] of Object.entries(this.files)) {
                const pool = [];
                for (let i = 0; i < 4; i++) {
                    const embedded = window.__MZV_AUDIO__?.[f];
                    const a = new Audio(embedded || `assets/audio/${f}`);
                    a.preload = 'auto';
                    pool.push(a);
                }
                this.pools.set(k, pool);
                this.cursor.set(k, 0);
            }
            this.menuMusic = this.musicElement('menu_spooky_loop.mp3', 'assets/audio/music/menu_spooky_loop.mp3', true);
            this.gameplayMusic = this.musicElement('gameplay_reference.mp3', 'assets/audio/music/gameplay_reference.mp3', false);
            this.menuMusic.volume = MZV.MUSIC.menuVolume;
            this.gameplayMusic.volume = 0;
        }
        musicElement(file, fallback, loop) {
            const embedded = window.__MZV_AUDIO__?.[file];
            const a = new Audio(embedded || fallback);
            a.preload = 'auto';
            a.loop = loop;
            return a;
        }
        setEnabled(v) {
            this.enabled = v;
            if (!v) {
                this.menuMusic.pause();
                this.gameplayMusic.pause();
            }
            else if (this.musicMode === 'gameplay')
                void this.gameplayMusic.play().catch(() => { });
            else if (this.musicMode === 'menu')
                void this.menuMusic.play().catch(() => { });
        }
        startMenuMusic() {
            this.musicMode = 'menu';
            if (!this.enabled)
                return;
            try {
                if (!this.gameplayMusic.paused) {
                    this.gameplayMusic.pause();
                    this.gameplayMusic.currentTime = 0;
                }
                if (this.menuMusic.paused) {
                    this.menuMusic.volume = MZV.MUSIC.menuVolume;
                    void this.menuMusic.play().catch(() => { });
                }
            }
            catch { }
        }
        transitionToGameplay() {
            this.musicMode = 'gameplay';
            if (!this.enabled)
                return;
            try {
                this.gameplayMusic.pause();
                this.gameplayMusic.currentTime = 0;
                this.gameplayMusic.loop = false;
                this.gameplayMusic.volume = .02;
                void this.gameplayMusic.play().catch(() => { });
                const start = performance.now(), dur = 900, menuStart = this.menuMusic.volume;
                const tick = () => {
                    const q = Math.min(1, (performance.now() - start) / dur);
                    this.menuMusic.volume = Math.max(0, menuStart * (1 - q));
                    this.gameplayMusic.volume = MZV.MUSIC.gameplayVolume * q;
                    if (q < 1)
                        requestAnimationFrame(tick);
                    else {
                        this.menuMusic.pause();
                        this.menuMusic.currentTime = 0;
                        this.menuMusic.volume = MZV.MUSIC.menuVolume;
                    }
                };
                requestAnimationFrame(tick);
            }
            catch { }
        }
        restartGameplayLoop() {
            if (!this.enabled)
                return;
            try {
                this.gameplayMusic.currentTime = 0;
                this.gameplayMusic.volume = MZV.MUSIC.gameplayVolume;
                void this.gameplayMusic.play().catch(() => { });
            }
            catch { }
        }
        pauseGameplayMusic() { try {
            this.gameplayMusic.pause();
        }
        catch { } }
        resumeGameplayMusic() { if (this.enabled && this.musicMode === 'gameplay')
            try {
                void this.gameplayMusic.play().catch(() => { });
            }
            catch { } }
        stopGameplayMusic() {
            this.musicMode = 'none';
            try {
                this.gameplayMusic.pause();
            }
            catch { }
        }
        gameplayPosition() { return Number.isFinite(this.gameplayMusic.currentTime) ? this.gameplayMusic.currentTime : 0; }
        gameplayPlaying() { return this.enabled && !this.gameplayMusic.paused; }
        play(name, vol = .45) {
            if (!this.enabled)
                return;
            const p = this.pools.get(name);
            if (!p)
                return;
            const i = this.cursor.get(name) ?? 0;
            const a = p[i % p.length];
            this.cursor.set(name, i + 1);
            try {
                a.pause();
                a.currentTime = 0;
                a.volume = Math.max(0, Math.min(1, vol));
                void a.play().catch(() => { });
            }
            catch { }
        }
        weapon(id) { const key = id === 'rocketLauncher' ? 'rocket' : (id === 'twinMachinegun' || id === 'twinMachinegunOverdrive') ? 'machinegun' : id; this.play(key, (id === 'machinegun' || id === 'twinMachinegun' || id === 'twinMachinegunOverdrive') ? .22 : .42); }
    }
    MZV.AudioSystem = AudioSystem;
})(MZV || (MZV = {}));
var MZV;
(function (MZV) {
    class MovementSystem {
        constructor(input) {
            this.input = input;
        }
        updatePlayer(p, dt) {
            if (!p.alive || p.out) {
                p.moveX = 0;
                p.moveY = 0;
                return;
            }
            const v = this.input.movement(p.slot, p.controls);
            let x = v.x, y = v.y;
            const mag = Math.hypot(x, y);
            if (mag > .04) {
                if (mag > 1) {
                    x /= mag;
                    y /= mag;
                }
                p.moveX = x;
                p.moveY = y;
                p.x = MZV.clamp(p.x + x * p.speed * dt, 24, MZV.WORLD.width - 24);
                p.y = MZV.clamp(p.y + y * p.speed * dt, 24, MZV.WORLD.height - 24);
                if (Math.abs(x) > Math.abs(y))
                    p.direction = x < 0 ? 'left' : 'right';
                else
                    p.direction = y < 0 ? 'up' : 'down';
            }
            else {
                p.moveX = 0;
                p.moveY = 0;
            }
        }
    }
    MZV.MovementSystem = MovementSystem;
})(MZV || (MZV = {}));
var MZV;
(function (MZV) {
    class HordeSystem {
        constructor(state, audio, notify) {
            this.state = state;
            this.audio = audio;
            this.notify = notify;
        }
        startLevel() {
            const s = this.state;
            s.levelKills = 0;
            s.megaHorde = s.level % MZV.RULES.megaHordeEvery === 0;
            let count = MZV.levelBaseCount(s.level);
            if (s.mode === 'single')
                count = Math.max(1, Math.ceil(count * MZV.RULES.singleEnemyScale));
            if (s.megaHorde) {
                count = Math.ceil(count * 1.25);
                s.airstrikeCharges++;
                this.audio.play('airstrike', .38);
            }
            // Mantemos pressão ambiental, mas a entrada principal fica pendente para um cue musical.
            const initialRatio = s.level === MZV.RULES.finalBossLevel ? .28 : s.megaHorde ? .25 : .40;
            const initial = Math.max(1, Math.ceil(count * initialRatio));
            s.pendingHordeCount = Math.max(0, count - initial);
            for (let i = 0; i < initial; i++)
                this.spawnRandom();
            if (s.level === MZV.RULES.finalBossLevel) {
                s.pendingBoss = 'nocturnus';
                s.pendingBossSince = s.elapsed;
                this.notify(s.mission === 'thriller' ? `🕺 NÍVEL ${s.level} · THRILLER BOSS FINAL A APROXIMAR-SE · aguarda o próximo PEAK` : `🧛 NÍVEL ${s.level} · LORD NOCTURNUS A APROXIMAR-SE · aguarda o próximo PEAK`);
            }
            else if (s.level % MZV.RULES.powerBossEvery === 0) {
                s.pendingBoss = 'powerBoss';
                s.pendingBossSince = s.elapsed;
                this.notify(`⚠ NÍVEL ${s.level} · POWER BOSS A APROXIMAR-SE · sincronizado com a música`);
            }
            else if (s.megaHorde) {
                this.notify(`🚨 MEGA HORDA PREPARADA · ${s.pendingHordeCount} entram no próximo DROP · AIRSTRIKE +1`);
            }
            else {
                this.audio.play('level', .25);
                this.notify(`NÍVEL ${s.level} · pressão inicial ${initial} · horda principal sincronizada`);
            }
            // Special Crate a cada 10 níveis.
            if (s.level % 10 === 0) {
                const c = this.specialCratePos();
                const reward = MZV.SETTINGS.specialReward(s.level);
                s.chests.push(new MZV.Chest('special', 'epic', c.x, c.y, reward));
                this.notify(`⭐ SPECIAL CRATE DETECTADO · ${Math.round(Math.hypot(c.x - s.players[0].x, c.y - s.players[0].y))}m`);
            }
        }
        hasPendingLevelThreats() { return this.state.pendingHordeCount > 0 || this.state.pendingBoss !== null; }
        onMusicCue(cue) {
            const s = this.state;
            if (cue.type === 'BUILD') {
                if (s.pendingBoss)
                    this.notify(`⚠ ${s.mission === 'thriller' ? 'THRILLER BOSS' : (s.pendingBoss === 'nocturnus' ? 'LORD NOCTURNUS' : 'POWER BOSS')} · aproximação detectada`);
                else if (s.pendingHordeCount > 0)
                    this.notify(`⚠ HORDA A APROXIMAR-SE · ${s.pendingHordeCount} inimigos`);
                return;
            }
            const bossEligible = cue.type === 'BOSS' || (cue.type === 'DROP' && s.pendingBoss !== null && s.elapsed - s.pendingBossSince >= 8);
            if (bossEligible && s.pendingBoss) {
                this.releasePendingHorde(.35);
                this.releaseBoss();
                return;
            }
            if (cue.type === 'HORDE' || cue.type === 'DROP' || cue.type === 'RAGE' || cue.type === 'BOSS') {
                this.releasePendingHorde(1);
            }
        }
        releasePendingHorde(fraction) {
            const s = this.state;
            if (s.pendingHordeCount <= 0)
                return;
            const n = fraction >= 1 ? s.pendingHordeCount : Math.max(1, Math.ceil(s.pendingHordeCount * fraction));
            for (let i = 0; i < n; i++)
                this.spawnRandom();
            s.pendingHordeCount = Math.max(0, s.pendingHordeCount - n);
            const intensity = s.musicIntensity === 'PEAK' ? '🔥 DROP' : 'HORDE';
            this.notify(`🧟 ${intensity} · +${n} inimigos NO BEAT`);
        }
        releaseBoss() {
            const s = this.state, type = s.pendingBoss;
            if (!type)
                return;
            s.pendingBoss = null;
            s.pendingBossSince = 0;
            if (type === 'nocturnus') {
                if (s.mission !== 'thriller') this.spawn('powerBoss');
                const z = new MZV.Enemy('nocturnus', MZV.WORLD.width / 2, 220, s.level, true, s.mode === 'single');
                s.enemies.push(z);
                s.airstrikeCharges += 2;
                if (s.mission === 'thriller') {
                    this.audio.play('laugh', .78); this.audio.play('boss', .64);
                    this.notify('🕺 THRILLER BOSS · BATALHA FINAL · ENTRADA NO PEAK');
                } else {
                    this.audio.play('nocturnus', .72);
                    this.notify('🧛 LORD NOCTURNUS · ENTRADA SINCRONIZADA NO PEAK');
                }
            }
            else {
                this.spawn('powerBoss');
                this.audio.play('boss', .68);
                this.notify('💪 POWER BOSS · 7 VIDAS · ENTRADA NO BEAT');
            }
        }
        specialCratePos() {
            const a = this.state.players.filter(p => p.alive && !p.out);
            const cx = a.reduce((q, p) => q + p.x, 0) / (a.length || 1), cy = a.reduce((q, p) => q + p.y, 0) / (a.length || 1);
            const ang = Math.random() * Math.PI * 2, d = MZV.rand(280, 430);
            return { x: MZV.clamp(cx + Math.cos(ang) * d, 80, MZV.WORLD.width - 80), y: MZV.clamp(cy + Math.sin(ang) * d, 80, MZV.WORLD.height - 80) };
        }
        spawnRandom() {
            const r = Math.random(), lvl = this.state.level;
            let t = 'normal';
            if (lvl >= 6 && r < .075)
                t = 'commander';
            else if (r < Math.min(.16, .04 + lvl * .008))
                t = 'tank';
            else if (r < Math.min(.42, .16 + lvl * .012))
                t = 'runner';
            this.spawn(t);
        }
        spawn(type) {
            let x = 0, y = 0;
            for (let tries = 0; tries < 20; tries++) {
                x = MZV.rand(70, MZV.WORLD.width - 70);
                y = MZV.rand(70, MZV.WORLD.height - 70);
                if (this.state.players.every(p => Math.hypot(p.x - x, p.y - y) > 340))
                    break;
            }
            const z = new MZV.Enemy(type, x, y, this.state.level, this.state.megaHorde, this.state.mode === 'single');
            const musicScale = 1 + this.state.musicLoop * MZV.MUSIC.loopDifficultyStep;
            if (type !== 'powerBoss' && type !== 'nocturnus' && musicScale > 1) {
                z.hp *= musicScale;
                z.maxHp *= musicScale;
                const sm = 1 + this.state.musicLoop * .04;
                z.speed *= sm;
                z.baseSpeed *= sm;
            }
            this.state.enemies.push(z);
        }
        spawnRageWave(count) {
            const loopScale = 1 + this.state.musicLoop * MZV.MUSIC.loopDifficultyStep;
            const scaled = Math.max(1, Math.ceil(count * loopScale));
            for (let i = 0; i < scaled; i++) {
                const roll = Math.random();
                const type = this.state.level >= 10 && roll < .10 ? 'commander' : roll < .28 ? 'tank' : roll < .58 ? 'runner' : 'normal';
                this.spawn(type);
            }
        }
    }
    MZV.HordeSystem = HordeSystem;
})(MZV || (MZV = {}));
var MZV;
(function (MZV) {
    class RageSystem {
        constructor(s, audio, notify, spawnWave) {
            this.s = s;
            this.audio = audio;
            this.notify = notify;
            this.spawnWave = spawnWave;
        }
        armForLevel() {
            if (this.s.level % MZV.SETTINGS.rageEvery() !== 0 || this.s.lastRageLevel === this.s.level || this.s.pendingRageLevel === this.s.level)
                return;
            this.s.pendingRageLevel = this.s.level;
            this.notify(`⚡ RAGE READY · NÍVEL ${this.s.level} · entra no próximo DROP/PEAK musical`);
        }
        hasPending() { return this.s.pendingRageLevel > 0; }
        isActive() { return this.s.rageUntil > this.s.elapsed; }
        blocksLevel() { return this.hasPending() || this.isActive(); }
        onMusicCue(cue) {
            const high = cue.type === 'RAGE' || cue.type === 'DROP' || cue.type === 'BOSS';
            if (this.s.pendingRageLevel === this.s.level && high) {
                this.start();
                return true;
            }
            if (this.isActive() && (cue.type === 'HORDE' || cue.type === 'DROP' || cue.type === 'RAGE' || cue.type === 'BOSS')) {
                this.releaseWave();
                return true;
            }
            return false;
        }
        start() {
            this.s.lastRageLevel = this.s.level;
            this.s.pendingRageLevel = 0;
            this.s.rageUntil = this.s.elapsed + MZV.RULES.rageSeconds;
            this.s.combo = 0;
            this.s.comboUntil = 0;
            this.s.rageKills = 0;
            const scaledBase = MZV.levelBaseCount(this.s.level) * (this.s.mode === 'single' ? MZV.RULES.singleEnemyScale : 1);
            const bonus = this.s.mode === 'single' ? MZV.RULES.rageSingleEnemyBonus : MZV.RULES.rageTwoEnemyBonus;
            const extra = Math.max(MZV.RULES.rageWaveCount, Math.ceil(scaledBase * bonus));
            this.s.rageWaveSize = Math.max(1, Math.ceil(extra / MZV.RULES.rageWaveCount));
            this.s.rageWavesRemaining = MZV.RULES.rageWaveCount;
            this.s.rageWaveNextAt = this.s.elapsed + 28;
            this.spawnReinforcement();
            this.audio.play('rage', .72);
            const who = this.s.reinforcement?.name ?? 'ALIADO';
            this.notify(`⚡ MODO RAIVA · NÍVEL ${this.s.level} · ${who.toUpperCase()} REINFORCEMENT · SCORE ×2 · NO DROP`);
            this.releaseWave();
        }
        releaseWave() {
            if (this.s.rageWavesRemaining <= 0)
                return;
            this.spawnWave(this.s.rageWaveSize);
            this.s.rageWavesRemaining--;
            const waveNo = MZV.RULES.rageWaveCount - this.s.rageWavesRemaining;
            this.s.rageWaveNextAt = this.s.elapsed + 28;
            this.notify(`⚡ RAGE WAVE ${waveNo}/${MZV.RULES.rageWaveCount} · +${this.s.rageWaveSize} base · sincronizada`);
        }
        reinforcementId() {
            const used = new Set(this.s.players.map(p => p.id));
            if (this.s.mode === 'two')
                return ['marcio', 'marco', 'dany'].find(id => !used.has(id)) ?? 'dany';
            const current = this.s.players[0]?.id ?? 'marcio';
            if (current === 'marcio')
                return 'marco';
            if (current === 'marco')
                return 'dany';
            return 'marcio';
        }
        reinforcementWeapon(id) { if (id === 'marco')
            return 'rifle'; return 'machinegun'; }
        teamCenter() { const a = this.s.players.filter(p => p.alive && !p.out); return { x: a.reduce((q, p) => q + p.x, 0) / (a.length || 1), y: a.reduce((q, p) => q + p.y, 0) / (a.length || 1) }; }
        spawnReinforcement() { const id = this.reinforcementId(), def = MZV.CHARACTERS[id], c = this.teamCenter(); this.s.reinforcement = new MZV.Reinforcement(def, MZV.clamp(c.x - 280, 45, MZV.WORLD.width - 45), MZV.clamp(c.y + MZV.rand(-120, 120), 45, MZV.WORLD.height - 45), this.reinforcementWeapon(id)); }
        nearestEnemy(r, range) { let best = null, d0 = Infinity; for (const z of this.s.enemies) {
            if (!z.alive)
                continue;
            const d = Math.hypot(z.x - r.x, z.y - r.y);
            if (d < d0 && d <= range) {
                best = z;
                d0 = d;
            }
        } return best; }
        moveToward(r, x, y, dt) { const dx = x - r.x, dy = y - r.y, d = Math.hypot(dx, dy) || 1; if (d < 8) {
            r.moveX = 0;
            r.moveY = 0;
            return;
        } const vx = dx / d, vy = dy / d; r.moveX = vx; r.moveY = vy; r.x = MZV.clamp(r.x + vx * r.speed * dt, 20, MZV.WORLD.width - 20); r.y = MZV.clamp(r.y + vy * r.speed * dt, 20, MZV.WORLD.height - 20); if (Math.abs(vx) > Math.abs(vy))
            r.direction = vx < 0 ? 'left' : 'right';
        else
            r.direction = vy < 0 ? 'up' : 'down'; }
        fire(r) { if (!r.alive || r.state === 'recovering' || r.state === 'exiting' || this.s.elapsed < r.nextShot)
            return; const w = r.weapon, target = this.nearestEnemy(r, w.range); if (!target)
            return; r.nextShot = this.s.elapsed + 1 / w.fireRate; r.aimAngle = Math.atan2(target.y - r.y, target.x - r.x); r.muzzleUntil = this.s.elapsed + .07; this.audio.weapon(r.weaponId); const barrels = w.barrels, a = r.aimAngle, px = -Math.sin(a), py = Math.cos(a); for (let b = 0; b < barrels; b++) {
            const side = barrels === 2 ? (b === 0 ? -6 : 6) : 0;
            for (let k = 0; k < w.pellets; k++) {
                const ang = a + (Math.random() - .5) * w.spread, sx = r.x + px * side + Math.cos(ang) * 25, sy = r.y + py * side + Math.sin(ang) * 25;
                this.s.projectiles.push(new MZV.Projectile(sx, sy, Math.cos(ang) * w.speed, Math.sin(ang) * w.speed, w.range / w.speed, w, r, 'reinforcement'));
            }
        } }
        damage(r, dmg) { if (!r.alive || r.state === 'recovering' || r.state === 'exiting')
            return; r.hp -= dmg; if (r.hp <= 0) {
            r.hp = 0;
            r.alive = false;
            r.state = 'recovering';
            r.recoverUntil = this.s.elapsed + 5;
            this.notify(`⚡ ${r.name.toUpperCase()} RECUOU · REGRESSA EM 5s`);
        } }
        startExtraction() { const r = this.s.reinforcement; if (!r || r.state === 'exiting')
            return; r.state = 'exiting'; r.alive = true; r.hp = Math.max(1, r.hp); const dists = [{ d: r.x, x: -70, y: r.y }, { d: MZV.WORLD.width - r.x, x: MZV.WORLD.width + 70, y: r.y }, { d: r.y, x: r.x, y: -70 }, { d: MZV.WORLD.height - r.y, x: r.x, y: MZV.WORLD.height + 70 }].sort((a, b) => a.d - b.d); r.exitTarget = { x: dists[0].x, y: dists[0].y }; this.notify(`⚡ MODO RAIVA TERMINOU · ${r.name.toUpperCase()} EXTRACTION`); }
        update(dt) {
            const s = this.s;
            if (this.isActive()) {
                if (s.combo > 0 && s.elapsed > s.comboUntil)
                    s.combo = 0;
                // Fallback: se a próxima grande batida demorar demasiado, não deixamos o Rage vazio.
                if (s.rageWavesRemaining > 0 && s.elapsed >= s.rageWaveNextAt)
                    this.releaseWave();
                const r = s.reinforcement;
                if (r) {
                    if (r.state === 'recovering') {
                        if (s.elapsed >= r.recoverUntil) {
                            const c = this.teamCenter();
                            r.x = MZV.clamp(c.x - 90, 30, MZV.WORLD.width - 30);
                            r.y = MZV.clamp(c.y + 80, 30, MZV.WORLD.height - 30);
                            r.hp = 60;
                            r.alive = true;
                            r.state = 'active';
                            this.notify(`⚡ ${r.name.toUpperCase()} REGRESSOU À BATALHA`);
                        }
                    }
                    else {
                        const c = this.teamCenter(), target = this.nearestEnemy(r, 470);
                        if (r.state === 'entering' && Math.hypot(r.x - c.x, r.y - c.y) < 150)
                            r.state = 'active';
                        if (target && r.state === 'active') {
                            const d = Math.hypot(target.x - r.x, target.y - r.y);
                            if (d < 155) {
                                const dx = r.x - target.x, dy = r.y - target.y, n = Math.hypot(dx, dy) || 1;
                                this.moveToward(r, r.x + dx / n * 70, r.y + dy / n * 70, dt);
                            }
                            else if (d > 330)
                                this.moveToward(r, target.x, target.y, dt);
                            else {
                                r.moveX = 0;
                                r.moveY = 0;
                            }
                            r.aimAngle = Math.atan2(target.y - r.y, target.x - r.x);
                        }
                        else {
                            const orbit = (r.id === 'dany' ? 1 : -1) * 95;
                            this.moveToward(r, c.x + orbit, c.y + 70, dt);
                        }
                        this.fire(r);
                    }
                }
                return;
            }
            if (s.rageUntil > 0 && s.elapsed >= s.rageUntil) {
                s.rageUntil = 0;
                s.rageWavesRemaining = 0;
                s.combo = 0;
                this.startExtraction();
            }
            const r = s.reinforcement;
            if (r && r.state === 'exiting') {
                const d = Math.hypot(r.exitTarget.x - r.x, r.exitTarget.y - r.y);
                if (d < 20) {
                    s.reinforcement = null;
                    return;
                }
                this.moveToward(r, r.exitTarget.x, r.exitTarget.y, dt);
            }
        }
    }
    MZV.RageSystem = RageSystem;
})(MZV || (MZV = {}));
var MZV;
(function (MZV) {
    class MusicDirector {
        constructor(s, audio, horde, rage, deployHelicopter, notify) {
            this.s = s;
            this.audio = audio;
            this.horde = horde;
            this.rage = rage;
            this.deployHelicopter = deployHelicopter;
            this.notify = notify;
            this.lastSongTime = 0;
            this.lastAbsolute = 0;
            this.nextUnsyncedCue = 8;
        }
        start() {
            this.lastSongTime = 0;
            this.lastAbsolute = 0;
            this.s.musicTime = 0;
            this.s.musicLoop = 0;
            this.s.musicCue = 'INTRO';
            this.s.musicIntensity = 'LOW';
            this.audio.transitionToGameplay();
        }
        update() {
            if (!MZV.SETTINGS.current.musicSync) {
                if (this.s.elapsed >= this.nextUnsyncedCue) {
                    this.nextUnsyncedCue = this.s.elapsed + 12;
                    const cue = { time: this.s.elapsed, type: 'HORDE', intensity: 'HIGH', label: 'GAME DIRECTOR' };
                    this.s.musicCue = 'GAME DIRECTOR';
                    this.s.musicIntensity = 'HIGH';
                    const rageHandled = this.rage.onMusicCue(cue);
                    if (!rageHandled)
                        this.horde.onMusicCue(cue);
                    if (this.s.pendingHelicopter > 0) {
                        this.s.pendingHelicopter--;
                        this.deployHelicopter();
                    }
                }
                return;
            }
            const absolute = this.s.elapsed;
            const loop = Math.floor(absolute / MZV.MUSIC.duration);
            const songTime = absolute % MZV.MUSIC.duration;
            if (loop > this.s.musicLoop) {
                for (let l = this.s.musicLoop + 1; l <= loop; l++) {
                    this.s.musicLoop = l;
                    this.audio.restartGameplayLoop();
                    this.notify(`🎵 SURVIVAL LOOP ${l + 1} · inimigos +${Math.round(l * MZV.MUSIC.loopDifficultyStep * 100)}% resistência`);
                }
                this.lastSongTime = 0;
            }
            this.s.musicTime = songTime;
            const cues = MZV.MUSIC.cues;
            if (songTime >= this.lastSongTime) {
                for (const cue of cues)
                    if (cue.time > this.lastSongTime && cue.time <= songTime)
                        this.fire(cue);
            }
            else {
                for (const cue of cues)
                    if (cue.time > this.lastSongTime)
                        this.fire(cue);
                for (const cue of cues)
                    if (cue.time <= songTime)
                        this.fire(cue);
            }
            this.lastSongTime = songTime;
            this.lastAbsolute = absolute;
        }
        fire(cue) {
            this.s.musicCue = cue.label;
            this.s.musicIntensity = cue.intensity;
            if (cue.type === 'BREAK') {
                this.notify('🎵 BREAK · respira, recarrega e reposiciona');
                return;
            }
            if (cue.type === 'BUILD') {
                this.horde.onMusicCue(cue);
                return;
            }
            const rageHandled = this.rage.onMusicCue(cue);
            if (this.s.pendingHelicopter > 0 && (cue.type === 'DROP' || cue.type === 'BOSS' || cue.type === 'RAGE')) {
                this.s.pendingHelicopter--;
                this.deployHelicopter();
            }
            if (!rageHandled)
                this.horde.onMusicCue(cue);
        }
    }
    MZV.MusicDirector = MusicDirector;
})(MZV || (MZV = {}));
var MZV;
(function (MZV) {
    class CombatSystem {
        constructor(s, audio, notify) {
            this.s = s;
            this.audio = audio;
            this.notify = notify;
            this.rageDamage = () => { };
        }
        nearest(p, range) { let best = null, d0 = Infinity; for (const z of this.s.enemies) {
            if (!z.alive)
                continue;
            const d = Math.hypot(z.x - p.x, z.y - p.y);
            if (d < d0 && d <= range) {
                best = z;
                d0 = d;
            }
        } return best; }
        firePlayer(p) {
            const w = p.weapon;
            if (!p.alive || p.out || this.s.elapsed < p.nextShot)
                return;
            const target = this.nearest(p, w.range);
            if (!target)
                return;
            const overdrive = this.s.elapsed < this.s.overdriveUntil;
            const rate = w.fireRate * (overdrive ? 1.35 : 1);
            p.nextShot = this.s.elapsed + 1 / rate;
            p.aimAngle = Math.atan2(target.y - p.y, target.x - p.x);
            p.muzzleUntil = this.s.elapsed + .07;
            this.audio.weapon(p.currentWeaponId);
            // Modo Raiva = quatro armas visuais/físicas, independentemente da arma permanente.
            const guns = this.s.elapsed < this.s.rageUntil ? 4 : w.barrels;
            const offsets = guns === 4 ? [-11, -4, 4, 11] : guns === 2 ? [-6, 6] : [0];
            const px = -Math.sin(p.aimAngle), py = Math.cos(p.aimAngle);
            for (const side of offsets) {
                for (let k = 0; k < w.pellets; k++) {
                    const a = p.aimAngle + (Math.random() - .5) * w.spread;
                    const speed = w.speed * (overdrive ? 1.2 : 1);
                    const projW = { ...w, damage: w.damage * (overdrive ? 1.10 : 1), speed };
                    const sx = p.x + px * side + Math.cos(a) * 26, sy = p.y + py * side + Math.sin(a) * 26;
                    this.s.projectiles.push(new MZV.Projectile(sx, sy, Math.cos(a) * speed, Math.sin(a) * speed, projW.range / speed, projW, p, 'player'));
                }
            }
        }
        update(dt) {
            for (const p of this.s.players) {
                p.updateTemporaryWeapon(this.s.elapsed);
                this.firePlayer(p);
                this.updateSupports(p);
            }
            for (const b of this.s.projectiles) {
                if (b.dead)
                    continue;
                b.x += b.vx * dt;
                b.y += b.vy * dt;
                b.life -= dt;
                if (b.life <= 0) {
                    b.dead = true;
                    continue;
                }
                for (const z of this.s.enemies) {
                    if (!z.alive)
                        continue;
                    if (Math.hypot(b.x - z.x, b.y - z.y) <= b.radius + z.radius) {
                        if (b.explosive)
                            this.explode(b.x, b.y, b.explosionRadius, b.explosionDamage, '#ffad4e', b.source);
                        else
                            this.damageEnemy(z, b.damage, b.source, b.vx, b.vy, b.kind);
                        b.penetration--;
                        if (b.penetration <= 0)
                            b.dead = true;
                        if (b.dead)
                            break;
                    }
                }
            }
            this.s.projectiles = this.s.projectiles.filter(b => !b.dead);
            this.updateExplosions(dt);
            this.updateDrones(dt);
            this.updateSams(dt);
            this.updateHelicopters(dt);
            this.updateAirstrikes(dt);
            // HOTFIX V4.4.2: enemies killed by bullets/supports must not remain as frozen corpses.
            this.s.enemies = this.s.enemies.filter(z => z.alive);
        }
        damageEnemy(z, dmg, source = 'support', impactX = 0, impactY = 0, kind = 'pistol') {
            const n = Math.hypot(impactX, impactY) || 1;
            let force = kind === 'machinegun' ? 75 : kind === 'pistol' ? 105 : kind === 'rifle' ? 150 : kind === 'shotgun' ? 235 : kind === 'rocket' ? 310 : 100;
            if (z.type === 'tank')
                force *= .35;
            if (z.type === 'commander')
                force *= .62;
            if (z.type === 'powerBoss')
                force *= .16;
            if (z.type === 'nocturnus')
                force *= .12;
            z.knockbackX += impactX / n * force;
            z.knockbackY += impactY / n * force;
            z.hitUntil = this.s.elapsed + (kind === 'shotgun' || kind === 'rocket' ? .18 : .10);
            z.hp -= dmg;
            if (z.hp > 0)
                return;
            if (z.type === 'powerBoss' && z.lives > 1) {
                z.lives--;
                z.phase = z.maxLives - z.lives + 1;
                z.hp = z.maxHp;
                z.stunUntil = this.s.elapsed + .72;
                z.motionState = 'stunned';
                z.attackCooldown = .9;
                z.knockbackX *= .2;
                z.knockbackY *= .2;
                this.audio.play('boss', .48);
                this.notify(`💪 POWER BOSS · ${z.lives}/7 VIDAS · FASE ${z.phase} · MAIS AGRESSIVO`);
                return;
            }
            this.killEnemy(z, source);
        }
        killEnemy(z, source = 'support') {
            if (!z.alive)
                return;
            z.alive = false;
            this.s.kills++;
            this.s.levelKills++;
            const progressFactor = source === 'reinforcement' ? MZV.RULES.reinforcementProgressFactor : source === 'support' ? MZV.RULES.supportProgressFactor : 1;
            this.s.progressKills += progressFactor;
            const rage = this.s.elapsed < this.s.rageUntil;
            if (rage) {
                this.s.combo++;
                this.s.comboUntil = this.s.elapsed + MZV.RULES.rageComboWindow;
                this.s.rageKills++;
            }
            const comboBonus = rage ? 1 + Math.min(20, this.s.combo) * .05 : 1;
            const score = Math.round(MZV.killBaseScore(z.type) * (rage ? MZV.RULES.rageScoreMultiplier : 1) * comboBonus);
            this.s.score += score;
            if (z.type === 'nocturnus')
                this.s.victory = true;
            if (z.type === 'powerBoss') {
                this.s.chests.push(new MZV.Chest('tactical', 'epic', z.x, z.y));
                this.s.pickups.push(new MZV.Pickup('medkit', z.x - 35, z.y + 20, 28, 40), new MZV.Pickup('medkit', z.x + 35, z.y + 20, 28, 40));
                this.s.airstrikeCharges++;
            }
            else if (z.type === 'commander') {
                if (Math.random() < .35)
                    this.s.chests.push(new MZV.Chest('tactical', Math.random() < .35 ? 'epic' : 'rare', z.x, z.y));
            }
            this.medkitDrop(z);
        }
        medkitDrop(z) {
            const alive = this.s.players.filter(p => !p.out), ratio = alive.length ? alive.reduce((a, p) => a + p.hp / p.maxHp, 0) / alive.length : 1;
            let chance = 0;
            if (z.type === 'commander')
                chance = ratio < .75 ? .30 : .12;
            else if (z.type === 'tank')
                chance = ratio < .70 ? .12 : .04;
            else if (ratio < .45)
                chance = .03;
            if (Math.random() < chance)
                this.s.pickups.push(new MZV.Pickup('medkit', z.x, z.y, 28, MZV.RULES.medkitHeal));
        }
        explode(x, y, r, dmg, color, source = 'support') {
            this.audio.play('explosion', .55);
            this.s.explosions.push(new MZV.Explosion(x, y, r, color));
            for (const z of this.s.enemies) {
                if (!z.alive)
                    continue;
                const d = Math.hypot(z.x - x, z.y - y);
                if (d <= r + z.radius)
                    this.damageEnemy(z, dmg * (1 - Math.min(.65, d / (r + z.radius + 1)) * .5), source, z.x - x, z.y - y, 'rocket');
            }
        }
        damagePlayer(p, dmg) {
            if (p.shieldHp > 0 && this.s.elapsed < p.shieldUntil) {
                const q = Math.min(dmg, p.shieldHp);
                p.shieldHp -= q;
                dmg -= q;
            }
            if (dmg > 0)
                p.hp -= dmg;
            if (p.hp <= 0 && p.alive) {
                p.hp = 0;
                p.alive = false;
                p.downSince = this.s.elapsed;
                this.audio.play('down', .65);
                this.notify(`☠ ${p.name} CAIU · 10s PARA REVIVER`);
            }
        }
        updateSupports(p) {
            if (!p.alive || p.out)
                return;
            if (p.grenadeLevel > 0 && this.s.elapsed >= p.nextGrenade) {
                const t = this.nearest(p, 520);
                if (t) {
                    p.nextGrenade = this.s.elapsed + Math.max(3, 7 - p.grenadeLevel * .8);
                    this.explode(t.x, t.y, 80 + p.grenadeLevel * 10, 42 + p.grenadeLevel * 18, '#ff9c42', 'player');
                }
            }
            if (p.rocketSupportLevel > 0 && this.s.elapsed >= p.nextRocketSupport) {
                const t = this.nearest(p, 700);
                if (t) {
                    p.nextRocketSupport = this.s.elapsed + Math.max(4.2, 10 - p.rocketSupportLevel);
                    const w = { ...MZV.WEAPONS.rocketLauncher, explosionDamage: 85 + p.rocketSupportLevel * 28, explosionRadius: 100 + p.rocketSupportLevel * 12 };
                    const a = Math.atan2(t.y - p.y, t.x - p.x);
                    this.s.projectiles.push(new MZV.Projectile(p.x, p.y, Math.cos(a) * w.speed, Math.sin(a) * w.speed, 4, w, p, 'player'));
                }
            }
        }
        updateDrones(dt) {
            for (const d of this.s.drones) {
                const p = d.owner;
                if (!p.alive || p.out || this.s.elapsed >= p.droneUntil)
                    continue;
                const a = this.s.elapsed * .9 + (p.slot === 1 ? 0 : Math.PI), tx = p.x + Math.cos(a) * 54, ty = p.y - 38 + Math.sin(a) * 18;
                d.x += (tx - d.x) * Math.min(1, dt * 7);
                d.y += (ty - d.y) * Math.min(1, dt * 7);
                if (this.s.elapsed >= d.nextShot) {
                    let best = null, bestD = Infinity;
                    for (const z of this.s.enemies) {
                        const q = Math.hypot(z.x - d.x, z.y - d.y);
                        if (q < bestD && q < 470) {
                            best = z;
                            bestD = q;
                        }
                    }
                    if (best) {
                        d.nextShot = this.s.elapsed + Math.max(.3, .8 - p.droneLevel * .1);
                        const a2 = Math.atan2(best.y - d.y, best.x - d.x);
                        const w = { ...MZV.WEAPONS.pistol, damage: 7 + p.droneLevel * 4, speed: 760, range: 480, projectile: 'machinegun' };
                        this.s.projectiles.push(new MZV.Projectile(d.x, d.y, Math.cos(a2) * w.speed, Math.sin(a2) * w.speed, w.range / w.speed, w, p, 'player'));
                    }
                }
            }
        }
        updateSams(dt) {
            for (const t of this.s.sams) {
                t.life -= dt;
                if (t.life <= 0)
                    continue;
                let best = null, bestD = Infinity;
                for (const z of this.s.enemies) {
                    const d = Math.hypot(z.x - t.x, z.y - t.y);
                    if (d < bestD && d < 650) {
                        best = z;
                        bestD = d;
                    }
                }
                if (best) {
                    t.angle = Math.atan2(best.y - t.y, best.x - t.x);
                    if (this.s.elapsed >= t.nextShot) {
                        t.nextShot = this.s.elapsed + Math.max(.9, 2.5 - t.level * .28);
                        this.audio.play('sam', .32);
                        const w = { ...MZV.WEAPONS.rocketLauncher, explosionDamage: 88 + t.level * 32, explosionRadius: 100 + t.level * 14 };
                        this.s.projectiles.push(new MZV.Projectile(t.x, t.y, Math.cos(t.angle) * 360, Math.sin(t.angle) * 360, 4, w, null, 'support'));
                    }
                }
            }
            this.s.sams = this.s.sams.filter(t => t.life > 0);
        }
        deployHelicopter() {
            const alive = this.s.players.filter(p => p.alive && !p.out);
            const cx = alive.reduce((q, p) => q + p.x, 0) / (alive.length || 1), cy = alive.reduce((q, p) => q + p.y, 0) / (alive.length || 1);
            this.s.helicopters.push(new MZV.Helicopter(cx, cy));
            this.audio.play('drone', .60);
            this.notify('🚁 AIR SUPPORT INBOUND · ENTRADA NO PEAK · 30s');
        }
        helicopterTarget(h) {
            let best = null, bestScore = -Infinity;
            for (const z of this.s.enemies) {
                if (!z.alive)
                    continue;
                const d = Math.hypot(z.x - h.x, z.y - h.y);
                const priority = z.type === 'nocturnus' ? 10000 : z.type === 'powerBoss' ? 7000 : z.type === 'tank' ? 3000 : z.type === 'commander' ? 2500 : 0;
                const score = priority - d;
                if (score > bestScore && d < 850) {
                    best = z;
                    bestScore = score;
                }
            }
            return best;
        }
        updateHelicopters(dt) {
            const alive = this.s.players.filter(p => p.alive && !p.out);
            const cx = alive.reduce((q, p) => q + p.x, 0) / (alive.length || 1), cy = alive.reduce((q, p) => q + p.y, 0) / (alive.length || 1);
            for (const h of this.s.helicopters) {
                h.life -= dt;
                if (h.life <= 4)
                    h.phase = 'exiting';
                else if (h.phase === 'entering' && Math.hypot(h.x - cx, h.y - cy) < 240)
                    h.phase = 'active';
                let tx = cx + Math.cos(this.s.elapsed * .55) * 210, ty = cy - 150 + Math.sin(this.s.elapsed * .55) * 95;
                if (h.phase === 'exiting') {
                    tx = MZV.WORLD.width + 180;
                    ty = MZV.clamp(cy - 200, 80, MZV.WORLD.height - 80);
                }
                const dx = tx - h.x, dy = ty - h.y, d = Math.hypot(dx, dy) || 1;
                const sp = h.phase === 'exiting' ? 420 : 300;
                h.x += dx / d * sp * dt;
                h.y += dy / d * sp * dt;
                h.angle = Math.atan2(dy, dx);
                if (h.phase === 'active') {
                    const target = this.helicopterTarget(h);
                    if (target) {
                        const a = Math.atan2(target.y - h.y, target.x - h.x);
                        if (this.s.elapsed >= h.nextShot) {
                            h.nextShot = this.s.elapsed + .095;
                            const w = { ...MZV.WEAPONS.machinegun, damage: 10, range: 800, speed: 1080, spread: .035, barrels: 1 };
                            const ang = a + (Math.random() - .5) * w.spread;
                            this.s.projectiles.push(new MZV.Projectile(h.x, h.y, Math.cos(ang) * w.speed, Math.sin(ang) * w.speed, w.range / w.speed, w, null, 'support'));
                        }
                        if (this.s.elapsed >= h.nextRocket) {
                            h.nextRocket = this.s.elapsed + 6;
                            const w = { ...MZV.WEAPONS.rocketLauncher, explosionDamage: 125, explosionRadius: 125, speed: 460 };
                            this.s.projectiles.push(new MZV.Projectile(h.x, h.y, Math.cos(a) * w.speed, Math.sin(a) * w.speed, 4, w, null, 'support'));
                            this.audio.play('rocket', .40);
                        }
                    }
                }
            }
            this.s.helicopters = this.s.helicopters.filter(h => h.life > 0 && h.x < MZV.WORLD.width + 220);
        }
        updateExplosions(dt) { for (const e of this.s.explosions)
            e.life -= dt; this.s.explosions = this.s.explosions.filter(e => e.life > 0); }
        callAirstrike() { if (this.s.airstrikeCharges <= 0)
            return; let best = null, bestScore = -1; for (const z of this.s.enemies) {
            let score = 0;
            for (const o of this.s.enemies)
                if (Math.hypot(z.x - o.x, z.y - o.y) < 120)
                    score++;
            if (score > bestScore) {
                best = z;
                bestScore = score;
            }
        } if (!best)
            return; this.s.airstrikeCharges--; this.s.airstrikes.push(new MZV.Airstrike(best.x, best.y)); this.audio.play('airstrike', .55); this.notify('✈ AIRSTRIKE A CAMINHO'); }
        updateAirstrikes(dt) { for (const a of this.s.airstrikes) {
            a.elapsed += dt;
            if (a.drops < a.maxDrops && a.elapsed >= a.nextDrop) {
                this.explode(a.x + MZV.rand(-130, 130), a.y + MZV.rand(-95, 95), 105, 115, '#ffc44f', 'support');
                a.drops++;
                a.nextDrop += .34;
            }
            if (a.drops >= a.maxDrops && a.elapsed > a.nextDrop + .6)
                a.done = true;
        } this.s.airstrikes = this.s.airstrikes.filter(a => !a.done); }
    }
    MZV.CombatSystem = CombatSystem;
})(MZV || (MZV = {}));
var MZV;
(function (MZV) {
    class EnemyMotionSystem {
        constructor(s, hitTarget, notify) {
            this.s = s;
            this.hitTarget = hitTarget;
            this.notify = notify;
            this.cellSize = 88;
            this.grid = new Map();
        }
        cellKey(x, y) { return `${Math.floor(x / this.cellSize)},${Math.floor(y / this.cellSize)}`; }
        buildGrid() {
            this.grid.clear();
            for (const z of this.s.enemies) {
                if (!z.alive)
                    continue;
                const k = this.cellKey(z.x, z.y);
                const a = this.grid.get(k);
                if (a)
                    a.push(z);
                else
                    this.grid.set(k, [z]);
            }
        }
        neighbours(z) {
            const out = [];
            const cx = Math.floor(z.x / this.cellSize), cy = Math.floor(z.y / this.cellSize);
            for (let oy = -1; oy <= 1; oy++)
                for (let ox = -1; ox <= 1; ox++) {
                    const a = this.grid.get(`${cx + ox},${cy + oy}`);
                    if (a)
                        for (const q of a)
                            if (q !== z)
                                out.push(q);
                }
            return out;
        }
        targetFor(z) {
            const candidates = [...this.s.players.filter(p => p.alive && !p.out)];
            const r = this.s.reinforcement;
            if (r && r.alive && r.state !== 'recovering' && r.state !== 'exiting')
                candidates.push(r);
            if (!candidates.length)
                return null;
            let best = candidates[0], bd = Math.hypot(best.x - z.x, best.y - z.y);
            for (let i = 1; i < candidates.length; i++) {
                const q = candidates[i], d = Math.hypot(q.x - z.x, q.y - z.y);
                if (d < bd) {
                    best = q;
                    bd = d;
                }
            }
            return best;
        }
        setDirectionStable(z, dx, dy) {
            const ax = Math.abs(dx), ay = Math.abs(dy);
            if (ax + ay < .08)
                return;
            const horizontal = z.direction === 'left' || z.direction === 'right';
            const chooseHorizontal = horizontal ? ax >= ay * .82 : ax > ay * 1.18;
            if (chooseHorizontal)
                z.direction = dx < 0 ? 'left' : 'right';
            else
                z.direction = dy < 0 ? 'up' : 'down';
        }
        attackTiming(z) {
            if (z.type === 'runner')
                return { windup: .13, recover: .18, cooldown: .58, reach: 5 };
            if (z.type === 'tank')
                return { windup: .52, recover: .40, cooldown: 1.25, reach: 18 };
            if (z.type === 'commander')
                return { windup: .28, recover: .28, cooldown: .82, reach: 10 };
            if (z.type === 'vampire')
                return { windup: .18, recover: .20, cooldown: .68, reach: 9 };
            if (z.type === 'powerBoss')
                return { windup: .48, recover: .40, cooldown: .88, reach: 28 };
            if (z.type === 'nocturnus')
                return { windup: .28, recover: .24, cooldown: .58, reach: 25 };
            return { windup: .30, recover: .27, cooldown: .88, reach: 5 };
        }
        beginAttack(z, t) {
            const a = this.attackTiming(z);
            z.motionState = 'attack_windup';
            z.attackTarget = t;
            z.attackDidHit = false;
            z.attackStartedAt = this.s.elapsed;
            z.attackHitAt = this.s.elapsed + a.windup;
            z.attackEndAt = z.attackHitAt + a.recover;
            const dx = t.x - z.x, dy = t.y - z.y, n = Math.hypot(dx, dy) || 1;
            z.vx = dx / n;
            z.vy = dy / n;
            this.setDirectionStable(z, dx, dy);
        }
        updateAttack(z) {
            const t = z.attackTarget, a = this.attackTiming(z);
            if (!t) {
                z.motionState = 'move';
                return;
            }
            const d = Math.hypot(t.x - z.x, t.y - z.y);
            if (z.motionState === 'attack_windup' && !z.attackDidHit && this.s.elapsed >= z.attackHitAt) {
                z.attackDidHit = true;
                z.motionState = 'attack_recover';
                if (d <= z.radius + t.radius + a.reach + 10)
                    this.hitTarget(t, z.damage);
            }
            if (this.s.elapsed >= z.attackEndAt) {
                z.motionState = 'move';
                z.attackTarget = null;
                z.attackCooldown = a.cooldown;
            }
        }
        separation(z) {
            let x = 0, y = 0, count = 0;
            const range = z.type === 'tank' || z.type === 'powerBoss' ? 70 : 52;
            for (const q of this.neighbours(z)) {
                const dx = z.x - q.x, dy = z.y - q.y, d2 = dx * dx + dy * dy;
                if (d2 < 4 || d2 > range * range)
                    continue;
                const d = Math.sqrt(d2);
                const strength = Math.min(.34, (range - d) / range * .34);
                x += dx / d * strength;
                y += dy / d * strength;
                count++;
            }
            if (count) {
                x /= count;
                y /= count;
            }
            return { x, y };
        }
        startVampireDash(z, t, d) {
            if (z.type !== 'vampire' || z.dashCooldown > 0 || d < 150 || d > 390)
                return false;
            const dx = t.x - z.x, dy = t.y - z.y, n = Math.hypot(dx, dy) || 1;
            z.motionState = 'dash';
            z.dashUntil = this.s.elapsed + .34;
            z.dashX = dx / n;
            z.dashY = dy / n;
            z.dashCooldown = MZV.rand(2.5, 3.8);
            return true;
        }
        startBossCharge(z, t, d) {
            if (z.type !== 'powerBoss' || z.lives > 3 || z.dashCooldown > 0 || d < 200 || d > 520)
                return false;
            const dx = t.x - z.x, dy = t.y - z.y, n = Math.hypot(dx, dy) || 1;
            z.motionState = 'dash';
            z.dashUntil = this.s.elapsed + .52;
            z.dashX = dx / n;
            z.dashY = dy / n;
            z.dashCooldown = MZV.rand(3.4, 4.8);
            this.notify(`💪 POWER BOSS · INVESTIDA · ${z.lives}/7 VIDAS`);
            return true;
        }
        beginNocturnusTeleport(z, t) {
            z.motionState = 'teleport_out';
            z.teleportPhaseEnd = this.s.elapsed + .34;
            z.teleportTargetX = MZV.clamp(t.x + MZV.rand(-250, 250), 60, MZV.WORLD.width - 60);
            z.teleportTargetY = MZV.clamp(t.y + MZV.rand(-250, 250), 60, MZV.WORLD.height - 60);
            z.vx = 0;
            z.vy = 0;
        }
        updateNocturnus(z, t, dt) {
            const hpRatio = z.hp / z.maxHp;
            z.phase = hpRatio > .66 ? 1 : hpRatio > .33 ? 2 : 3;
            z.teleportCooldown -= dt;
            z.summonCooldown -= dt;
            if (z.motionState === 'teleport_out') {
                if (this.s.elapsed >= z.teleportPhaseEnd) {
                    z.x = z.teleportTargetX;
                    z.y = z.teleportTargetY;
                    z.prevX = z.x;
                    z.prevY = z.y;
                    z.motionState = 'teleport_in';
                    z.teleportPhaseEnd = this.s.elapsed + .30;
                }
                return true;
            }
            if (z.motionState === 'teleport_in') {
                if (this.s.elapsed >= z.teleportPhaseEnd) {
                    z.motionState = 'move';
                    z.teleportCooldown = z.phase === 1 ? 6 : z.phase === 2 ? 4.6 : 3.25;
                }
                return true;
            }
            if (z.teleportCooldown <= 0 && z.motionState === 'move') {
                this.beginNocturnusTeleport(z, t);
                return true;
            }
            if (z.summonCooldown <= 0) {
                for (let i = 0; i < 4 + z.phase * 2; i++) {
                    this.s.enemies.push(new MZV.Enemy('normal', MZV.clamp(z.x + MZV.rand(-120, 120), 30, MZV.WORLD.width - 30), MZV.clamp(z.y + MZV.rand(-120, 120), 30, MZV.WORLD.height - 30), this.s.level, true, this.s.mode === 'single'));
                }
                z.summonCooldown = 9 - z.phase;
                this.notify(`🧛 NOCTURNUS · INVOCAÇÃO · FASE ${z.phase}`);
            }
            return false;
        }
        desiredVelocity(z, t, d, dt) {
            // Stable path: approach vector is always dominant. Species differences are small,
            // deterministic offsets rather than frame-by-frame oscillations.
            const dx = (t.x - z.x) / (d || 1), dy = (t.y - z.y) / (d || 1);
            const px = -dy, py = dx;
            const sep = this.separation(z);
            let side = 0, speedMul = 1, sepMul = 1;
            if (z.type === 'normal') {
                side = z.lateralBias * .055;
                sepMul = .75;
            }
            else if (z.type === 'runner') {
                side = z.lateralBias * .025;
                sepMul = .55;
                z.burstCooldown = Math.max(0, z.burstCooldown - dt);
                if (z.burstCooldown <= 0 && d > 150 && d < 410) {
                    z.burstUntil = this.s.elapsed + .42;
                    z.burstCooldown = MZV.rand(1.9, 3.2);
                }
                if (this.s.elapsed < z.burstUntil)
                    speedMul = 1.42;
            }
            else if (z.type === 'tank') {
                side = 0;
                sepMul = 1.15;
                speedMul = .98;
            }
            else if (z.type === 'commander') {
                side = z.lateralBias * (d > 120 ? .13 : .06);
                sepMul = .95;
                if (d < 80)
                    speedMul = .7;
            }
            else if (z.type === 'vampire') {
                side = z.lateralBias * .04;
                sepMul = .48;
                speedMul = 1.06;
            }
            else if (z.type === 'powerBoss') {
                sepMul = 1.25;
                speedMul = 1 + (z.maxLives - z.lives) * .07;
            }
            else if (z.type === 'nocturnus') {
                side = z.lateralBias * .05;
                sepMul = .42;
                speedMul = 1 + Math.max(0, z.phase - 1) * .10;
            }
            let vx = dx + px * side + sep.x * sepMul;
            let vy = dy + py * side + sep.y * sepMul;
            const n = Math.hypot(vx, vy) || 1;
            return { vx: vx / n, vy: vy / n, speedMul };
        }
        update(dt) {
            this.buildGrid();
            const smooth = 1 - Math.exp(-dt * 8.5);
            for (const z of this.s.enemies) {
                if (!z.alive)
                    continue;
                z.prevX = z.x;
                z.prevY = z.y;
                z.attackCooldown = Math.max(0, z.attackCooldown - dt);
                z.dashCooldown = Math.max(0, z.dashCooldown - dt);
                const kbDecay = Math.exp(-dt * 7.5);
                if (Math.abs(z.knockbackX) + Math.abs(z.knockbackY) > .5) {
                    z.x = MZV.clamp(z.x + z.knockbackX * dt, 20, MZV.WORLD.width - 20);
                    z.y = MZV.clamp(z.y + z.knockbackY * dt, 20, MZV.WORLD.height - 20);
                    z.knockbackX *= kbDecay;
                    z.knockbackY *= kbDecay;
                }
                else {
                    z.knockbackX = 0;
                    z.knockbackY = 0;
                }
                if (z.stunUntil > this.s.elapsed) {
                    z.motionState = 'stunned';
                    z.vx *= .7;
                    z.vy *= .7;
                    continue;
                }
                else if (z.motionState === 'stunned')
                    z.motionState = 'move';
                if (z.motionState === 'attack_windup' || z.motionState === 'attack_recover') {
                    this.updateAttack(z);
                    continue;
                }
                const t = this.targetFor(z);
                if (!t)
                    continue;
                const dx = t.x - z.x, dy = t.y - z.y, d = Math.hypot(dx, dy) || 1;
                this.setDirectionStable(z, dx, dy);
                if (z.type === 'nocturnus' && this.updateNocturnus(z, t, dt))
                    continue;
                if (z.motionState === 'dash') {
                    if (this.s.elapsed < z.dashUntil) {
                        const mult = z.type === 'powerBoss' ? 1.95 : 2.55;
                        z.vx = z.dashX;
                        z.vy = z.dashY;
                        this.setDirectionStable(z, z.vx, z.vy);
                        z.x = MZV.clamp(z.x + z.vx * z.baseSpeed * mult * dt, 20, MZV.WORLD.width - 20);
                        z.y = MZV.clamp(z.y + z.vy * z.baseSpeed * mult * dt, 20, MZV.WORLD.height - 20);
                        continue;
                    }
                    z.motionState = 'move';
                }
                if (this.startVampireDash(z, t, d) || this.startBossCharge(z, t, d))
                    continue;
                const atk = this.attackTiming(z);
                if (d <= z.radius + t.radius + atk.reach && z.attackCooldown <= 0) {
                    this.beginAttack(z, t);
                    continue;
                }
                const desired = this.desiredVelocity(z, t, d, dt);
                z.vx += (desired.vx - z.vx) * smooth;
                z.vy += (desired.vy - z.vy) * smooth;
                const vn = Math.hypot(z.vx, z.vy) || 1;
                const mvx = z.vx / vn, mvy = z.vy / vn;
                z.x = MZV.clamp(z.x + mvx * z.baseSpeed * desired.speedMul * dt, 20, MZV.WORLD.width - 20);
                z.y = MZV.clamp(z.y + mvy * z.baseSpeed * desired.speedMul * dt, 20, MZV.WORLD.height - 20);
            }
        }
    }
    MZV.EnemyMotionSystem = EnemyMotionSystem;
})(MZV || (MZV = {}));
var MZV;
(function (MZV) {
    class LootSystem {
        constructor(s, audio, notify) {
            this.s = s;
            this.audio = audio;
            this.notify = notify;
        }
        update(dt) { this.spawnMilestones(); this.updateChests(dt); this.updatePickups(dt); }
        spawnMilestones() {
            while (this.s.progressKills >= this.s.nextCampfireKill) {
                const p = this.rewardPos();
                this.s.pickups.push(new MZV.Pickup('campfire', p.x, p.y, 35, 0));
                this.s.nextCampfireKill += 10;
            }
            while (this.s.progressKills >= this.s.nextNormalChestKill) {
                const p = this.rewardPos();
                this.s.chests.push(new MZV.Chest('normal', this.rarity(false), p.x, p.y));
                this.s.nextNormalChestKill += 10;
            }
            while (this.s.progressKills >= this.s.nextTacticalKill) {
                const p = this.rewardPos();
                this.s.chests.push(new MZV.Chest('tactical', this.rarity(true), p.x, p.y));
                this.s.nextTacticalKill += 75;
            }
            const milestone = Math.floor(this.s.progressKills / MZV.RULES.overdriveEveryKills);
            if (milestone > 0 && milestone > this.s.lastOverdriveMilestone) {
                this.s.lastOverdriveMilestone = milestone;
                this.s.overdriveUntil = Math.max(this.s.overdriveUntil, this.s.elapsed) + MZV.RULES.overdriveSeconds;
                this.notify('🔥 WEAPON OVERDRIVE · 60s · +cadência +velocidade +dano');
            }
        }
        rarity(tactical) { const r = Math.random(); return tactical ? (r < .35 ? 'epic' : 'rare') : (r < .07 ? 'epic' : r < .32 ? 'rare' : 'common'); }
        rewardPos() { const a = this.s.players.filter(p => p.alive && !p.out); const cx = a.reduce((q, p) => q + p.x, 0) / (a.length || 1), cy = a.reduce((q, p) => q + p.y, 0) / (a.length || 1), ang = Math.random() * Math.PI * 2, d = MZV.rand(190, 360); return { x: MZV.clamp(cx + Math.cos(ang) * d, 70, MZV.WORLD.width - 70), y: MZV.clamp(cy + Math.sin(ang) * d, 70, MZV.WORLD.height - 70) }; }
        updateChests(dt) {
            for (const c of this.s.chests) {
                if (c.opened)
                    continue;
                c.required = MZV.SETTINGS.chestSeconds();
                const touch = this.s.players.filter(p => p.alive && !p.out && Math.hypot(p.x - c.x, p.y - c.y) < p.radius + c.radius + 8);
                if (!touch.length)
                    continue;
                c.progress += dt * (touch.length >= 2 ? MZV.RULES.cooperativeMultiplier : 1);
                if (c.progress >= c.required) {
                    c.opened = true;
                    const order = MZV.SETTINGS.current.weaponOrder;
                    const receiver = touch.sort((a, b) => order.indexOf(a.weaponId) - order.indexOf(b.weaponId))[0];
                    if (c.type === 'normal') {
                        this.audio.play('chest', .45);
                        this.upgradeWeapon(receiver, c.rarity);
                    }
                    else if (c.type === 'tactical') {
                        this.audio.play('tactical', .5);
                        this.tactical(receiver, c);
                    }
                    else {
                        this.audio.play('tactical', .62);
                        this.special(receiver, c);
                    }
                }
                break;
            }
            this.s.chests = this.s.chests.filter(c => !c.opened);
        }
        upgradeWeapon(p, rarity) {
            const order = MZV.SETTINGS.current.weaponOrder;
            const i = order.indexOf(p.weaponId);
            const next = MZV.SETTINGS.nextWeapon(p.weaponId);
            if (i < 0 || next !== p.weaponId) {
                p.weaponId = next;
                p.weaponLevel = 1;
                this.notify(`📦 ${p.name}: ${MZV.WEAPONS[p.weaponId].name} · ${rarity.toUpperCase()}`);
            }
            else {
                p.weaponLevel++;
                this.notify(`📦 ${p.name}: ${MZV.WEAPONS[p.weaponId].name} Lv.${p.weaponLevel}`);
            }
            if (p.temporaryWeaponUntil <= this.s.elapsed) {
                p.temporaryWeaponUntil = 0;
                p.currentWeaponId = p.weaponId;
            }
            if (rarity === 'rare')
                p.weaponLevel++;
            if (rarity === 'epic')
                p.weaponLevel += 2;
        }
        tactical(p, c) {
            const allowed = MZV.SETTINGS.current.tacticalLoot;
            const options = ['weapon', 'grenade', 'rocket', 'shield', 'drone', 'sam', 'airstrike'].filter(k => allowed[k]);
            const r = options[Math.floor(Math.random() * options.length)] || 'weapon';
            if (r === 'weapon')
                this.upgradeWeapon(p, c.rarity);
            else if (r === 'grenade') {
                p.grenadeLevel = Math.min(4, p.grenadeLevel + 1);
                this.notify(`💣 ${p.name}: Granadas Lv.${p.grenadeLevel}`);
            }
            else if (r === 'rocket') {
                p.rocketSupportLevel = Math.min(4, p.rocketSupportLevel + 1);
                this.notify(`🚀 ${p.name}: Rocket Support Lv.${p.rocketSupportLevel}`);
            }
            else if (r === 'shield') {
                p.shieldLevel = Math.min(4, p.shieldLevel + 1);
                p.shieldHp = [0, 50, 70, 90, 110][p.shieldLevel];
                p.shieldUntil = this.s.elapsed + [0, 25, 30, 35, 40][p.shieldLevel];
                this.audio.play('shield', .45);
                this.notify(`🛡️ ${p.name}: Shield Lv.${p.shieldLevel}`);
            }
            else if (r === 'drone') {
                p.droneLevel = Math.min(4, p.droneLevel + 1);
                p.droneUntil = this.s.elapsed + [0, 60, 70, 80, 90][p.droneLevel];
                if (!this.s.drones.some(d => d.owner === p))
                    this.s.drones.push(new MZV.Drone(p));
                this.audio.play('drone', .35);
                this.notify(`🚁 ${p.name}: Drone Lv.${p.droneLevel}`);
            }
            else if (r === 'sam') {
                const lvl = Math.min(4, 1 + this.s.sams.length);
                this.s.sams.push(new MZV.SamTurret(c.x, c.y, lvl));
                this.notify(`🛡️ SAM TURRET Mk.${lvl}`);
            }
            else {
                this.s.airstrikeCharges++;
                this.notify('✈ AIRSTRIKE +1');
            }
        }
        special(p, c) {
            const reward = c.specialReward ?? (Math.random() < .5 ? 'rocket' : 'helicopter');
            if (reward === 'rocket') {
                const until = this.s.elapsed + MZV.RULES.level10RocketSeconds;
                p.grantTemporaryWeapon('rocketLauncher', until);
                this.audio.play('rocket', .58);
                this.notify(`🚀 ${p.name}: ROCKET LAUNCHER · ${MZV.RULES.level10RocketSeconds}s`);
            }
            else {
                this.s.pendingHelicopter++;
                this.audio.play('drone', .38);
                this.notify('🚁 AIR SUPPORT READY · entrada no próximo DROP/PEAK musical');
            }
        }
        updatePickups(dt) { for (const it of this.s.pickups) {
            it.life -= dt;
            if (it.type === 'campfire') {
                for (const p of this.s.players)
                    if (p.alive && Math.hypot(p.x - it.x, p.y - it.y) < 60)
                        p.hp = Math.min(p.maxHp, p.hp + 5 * dt);
                continue;
            }
            for (const p of this.s.players) {
                if (!p.alive || p.out || Math.hypot(p.x - it.x, p.y - it.y) > p.radius + 25)
                    continue;
                if (it.type === 'medkit' && p.hp < p.maxHp) {
                    p.hp = Math.min(p.maxHp, p.hp + (it.value || MZV.RULES.medkitHeal));
                    it.life = 0;
                    this.audio.play('heal', .35);
                    this.notify(`❤️ ${p.name} +${it.value || MZV.RULES.medkitHeal} HP`);
                }
                else if (it.type === 'shield') {
                    p.shieldLevel = Math.max(1, p.shieldLevel);
                    p.shieldHp = 50;
                    p.shieldUntil = this.s.elapsed + 25;
                    it.life = 0;
                    this.audio.play('shield', .4);
                }
            }
        } this.s.pickups = this.s.pickups.filter(i => i.life > 0); }
    }
    MZV.LootSystem = LootSystem;
})(MZV || (MZV = {}));
var MZV;
(function (MZV) {
    class ReviveSystem {
        constructor(s, audio, notify) {
            this.s = s;
            this.audio = audio;
            this.notify = notify;
            this.active = null;
            this.timeLeft = 0;
        }
        update() {
            this.active = null;
            this.timeLeft = 0;
            if (this.s.mode !== 'two')
                return;
            for (const down of this.s.players) {
                if (down.alive || down.out || down.downSince === null)
                    continue;
                const left = MZV.RULES.reviveSeconds - (this.s.elapsed - down.downSince);
                if (left <= 0) {
                    down.out = true;
                    continue;
                }
                this.active = down;
                this.timeLeft = left;
                const rescue = this.s.players.find(p => p !== down && p.alive && !p.out);
                if (rescue && Math.hypot(rescue.x - down.x, rescue.y - down.y) <= rescue.radius + down.radius + 10) {
                    down.hp = MZV.RULES.reviveHp;
                    down.alive = true;
                    down.downSince = null;
                    this.audio.play('revive', .6);
                    this.notify(`❤️ ${down.name} REVIVIDO por ${rescue.name}`);
                    this.active = null;
                    this.timeLeft = 0;
                }
            }
        }
    }
    MZV.ReviveSystem = ReviveSystem;
})(MZV || (MZV = {}));
var MZV;
(function (MZV) {
    class Renderer {
        constructor(canvas, s, revive) {
            this.canvas = canvas;
            this.s = s;
            this.revive = revive;
            this.assets = new MZV.AssetStore();
            const c = canvas.getContext('2d');
            if (!c)
                throw new Error('Canvas 2D indisponível');
            this.ctx = c;
            this.zoom = 1;
        }
        resize() {
            const dprCap = this.mobileLayout() ? 1.35 : 2;
            const dpr = Math.min(dprCap, devicePixelRatio || 1), r = this.canvas.getBoundingClientRect();
            const width = Math.max(1, Math.round(r.width)), height = Math.max(1, Math.round(r.height));
            this.canvas.width = Math.floor(width * dpr);
            this.canvas.height = Math.floor(height * dpr);
            this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        mobileLayout() { return document.documentElement.classList.contains('touch-device'); }
        cameraProfile() {
            const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
            if (!this.mobileLayout())
                return { zoom: 1, focusX: w / 2, focusY: h / 2 };
            const landscape = w >= h;
            const zoom = 1;
            const safeTop = landscape ? 42 : 48;
            const safeBottom = landscape ? 104 : 126;
            const usableBottom = Math.max(safeTop + 80, h - safeBottom);
            return { zoom, focusX: w / 2, focusY: (safeTop + usableBottom) / 2 };
        }
        camera() {
            const alive = this.s.players.filter(p => p.alive && !p.out);
            const cx = alive.reduce((a, p) => a + p.x, 0) / (alive.length || 1), cy = alive.reduce((a, p) => a + p.y, 0) / (alive.length || 1);
            const profile = this.cameraProfile(), visibleWidth = this.canvas.clientWidth / profile.zoom, visibleHeight = this.canvas.clientHeight / profile.zoom;
            this.zoom = profile.zoom;
            this.s.camera.x = MZV.clamp(cx - profile.focusX / profile.zoom, 0, Math.max(0, MZV.WORLD.width - visibleWidth));
            this.s.camera.y = MZV.clamp(cy - profile.focusY / profile.zoom, 0, Math.max(0, MZV.WORLD.height - visibleHeight));
        }
        draw() {
            this.camera();
            const c = this.ctx, w = this.canvas.clientWidth, h = this.canvas.clientHeight;
            c.clearRect(0, 0, w, h);
            this.drawBackground();
            c.save();
            c.scale(this.zoom, this.zoom);
            c.translate(-this.s.camera.x, -this.s.camera.y);
            this.drawPickups();
            this.drawChests();
            this.drawSams();
            this.drawProjectiles();
            this.drawExplosions();
            this.drawEnemies();
            this.drawPlayers();
            this.drawReinforcement();
            this.drawHelicopters();
            c.restore();
            this.drawMiniMap();
            this.drawRageHud();
            this.drawRevive();
            this.drawThrillerOverlay();
        }
        asset(key) { const i = this.assets.get(key); return i && i.complete && i.naturalWidth > 0 ? i : null; }
        visibleOnMobile(x, y, padding = 80) {
            if (!this.mobileLayout())
                return true;
            const cam = this.s.camera, width = this.canvas.clientWidth / this.zoom, height = this.canvas.clientHeight / this.zoom;
            return x + padding >= cam.x && x - padding <= cam.x + width && y + padding >= cam.y && y - padding <= cam.y + height;
        }
        drawCentered(key, x, y, height, alpha = 1) {
            const c = this.ctx, img = this.asset(key);
            if (!img)
                return false;
            const w = height * (img.naturalWidth / img.naturalHeight);
            c.save();
            c.globalAlpha *= alpha;
            c.drawImage(img, x - w / 2, y - height / 2, w, height);
            c.restore();
            return true;
        }
        drawRotated(key, x, y, angle, height, forward = 0, alpha = 1) {
            const c = this.ctx, img = this.asset(key);
            if (!img)
                return false;
            const w = height * (img.naturalWidth / img.naturalHeight);
            c.save();
            c.translate(x, y);
            c.rotate(angle);
            c.globalAlpha *= alpha;
            c.drawImage(img, forward, -height / 2, w, height);
            c.restore();
            return true;
        }
        drawBackground() {
            const c = this.ctx, w = this.canvas.clientWidth, h = this.canvas.clientHeight, cam = this.s.camera, zoom = this.zoom;
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
        }
        characterFrame(p) {
            const moving = Math.abs(p.moveX) + Math.abs(p.moveY) > .05;
            const walkPhase = Math.floor(this.s.elapsed * 7) % 2 === 1;
            const pose = moving && walkPhase ? 'walk' : 'idle';
            return `characters.${p.id}.${pose}_${p.direction}`;
        }
        drawPlayerBody(p) {
            const c = this.ctx;
            if (p.shieldHp > 0 && this.s.elapsed < p.shieldUntil) {
                const dome = this.asset('props.shield_dome');
                if (dome) {
                    const h = 98, w = h * (dome.naturalWidth / dome.naturalHeight);
                    c.save();
                    c.globalAlpha = .52;
                    c.drawImage(dome, p.x - w / 2, p.y - h / 2 + 4, w, h);
                    c.restore();
                }
                else {
                    c.strokeStyle = 'rgba(100,225,255,.85)';
                    c.fillStyle = 'rgba(80,190,240,.10)';
                    c.lineWidth = 3;
                    c.beginPath();
                    c.arc(p.x, p.y, 36, 0, Math.PI * 2);
                    c.fill();
                    c.stroke();
                }
            }
            const key = this.characterFrame(p);
            if (!this.drawCentered(key, p.x, p.y, 106)) {
                c.fillStyle = p.vest;
                c.fillRect(p.x - 12, p.y - 20, 24, 40);
            }
        }
        weaponAsset(id) { return `weapons.${id === 'twinMachinegun' || id === 'twinMachinegunOverdrive' ? 'machinegun' : id}`; }
        muzzleAsset(id) { return `effects.muzzle_${id === 'twinMachinegun' || id === 'twinMachinegunOverdrive' ? 'machinegun' : id}`; }
        weaponHeight(id) { return id === 'pistol' ? 24 : id === 'rocketLauncher' ? 35 : id === 'shotgun' ? 30 : 28; }
        barrelOffset(id) { return id === 'pistol' ? 30 : (id === 'machinegun' || id === 'twinMachinegun' || id === 'twinMachinegunOverdrive') ? 46 : id === 'shotgun' ? 52 : id === 'rifle' ? 58 : 60; }
        drawWeapon(p) {
            const id = p.currentWeaponId, w = p.weapon;
            const count = this.s.elapsed < this.s.rageUntil ? 4 : w.barrels;
            const offsets = count === 4 ? [-11, -4, 4, 11] : count === 2 ? [-6, 6] : [0];
            const a = p.aimAngle, perpX = -Math.sin(a), perpY = Math.cos(a);
            for (const off of offsets) {
                const x = p.x + perpX * off, y = p.y + perpY * off;
                if (!this.drawRotated(this.weaponAsset(id), x, y, a, this.weaponHeight(id), 5)) {
                    const c = this.ctx;
                    c.save();
                    c.translate(x, y);
                    c.rotate(a);
                    c.fillStyle = '#263038';
                    c.fillRect(5, -4, 34, 8);
                    c.restore();
                }
                if (this.s.elapsed < p.muzzleUntil) {
                    const b = this.barrelOffset(id);
                    this.drawRotated(this.muzzleAsset(id), x + Math.cos(a) * b, y + Math.sin(a) * b, a, 30, -2, .95);
                }
            }
        }
        drawPlayers() {
            const c = this.ctx;
            for (const p of this.s.players) {
                c.save();
                c.globalAlpha = p.out ? .28 : p.alive ? 1 : .72;
                if (!p.alive && !p.out) {
                    c.strokeStyle = 'rgba(255,50,50,.92)';
                    c.lineWidth = 4;
                    c.beginPath();
                    c.arc(p.x, p.y, 46 + Math.sin(this.s.elapsed * 10) * 4, 0, Math.PI * 2);
                    c.stroke();
                }
                if (this.s.elapsed < this.s.rageUntil) {
                    const g = c.createRadialGradient(p.x, p.y, 12, p.x, p.y, 66);
                    g.addColorStop(0, 'rgba(255,236,70,.28)');
                    g.addColorStop(1, 'rgba(255,185,0,0)');
                    c.fillStyle = g;
                    c.beginPath();
                    c.arc(p.x, p.y, 66, 0, Math.PI * 2);
                    c.fill();
                }
                this.drawPlayerBody(p);
                this.drawWeapon(p);
                c.fillStyle = '#fff';
                c.font = '800 13px Segoe UI';
                c.textAlign = 'center';
                c.fillText(p.name, p.x, p.y - 58);
                c.fillStyle = 'rgba(5,8,10,.86)';
                c.font = '800 10px Segoe UI';
                const temp = p.temporaryWeaponUntil > this.s.elapsed ? ` · ${Math.ceil(p.temporaryWeaponUntil - this.s.elapsed)}s` : '';
                c.fillText(`${p.weapon.name} Lv.${p.weaponLevel}${temp}`, p.x, p.y + 58);
                c.restore();
            }
            for (const d of this.s.drones) {
                const p = d.owner;
                if (this.s.elapsed >= p.droneUntil || !p.alive)
                    continue;
                if (!this.drawCentered('props.drone_powered', d.x, d.y, 52))
                    this.drawCentered('props.drone', d.x, d.y, 46);
            }
        }
        reinforcementFrame(p) {
            const moving = Math.abs(p.moveX) + Math.abs(p.moveY) > .05;
            const walkPhase = Math.floor(this.s.elapsed * 7) % 2 === 1;
            const pose = moving && walkPhase ? 'walk' : 'idle';
            return `characters.${p.id}.${pose}_${p.direction}`;
        }
        drawReinforcement() {
            const p = this.s.reinforcement;
            if (!p)
                return;
            const c = this.ctx;
            c.save();
            c.globalAlpha = p.state === 'recovering' ? .35 : 1;
            if (this.s.elapsed < this.s.rageUntil) {
                const g = c.createRadialGradient(p.x, p.y, 10, p.x, p.y, 72);
                g.addColorStop(0, 'rgba(255,238,82,.36)');
                g.addColorStop(1, 'rgba(255,180,0,0)');
                c.fillStyle = g;
                c.beginPath();
                c.arc(p.x, p.y, 72, 0, Math.PI * 2);
                c.fill();
            }
            const key = this.reinforcementFrame(p);
            if (!this.drawCentered(key, p.x, p.y, 106)) {
                c.fillStyle = p.vest;
                c.fillRect(p.x - 12, p.y - 20, 24, 40);
            }
            const id = p.weaponId, a = p.aimAngle;
            if (!this.drawRotated(this.weaponAsset(id), p.x, p.y, a, this.weaponHeight(id), 5)) {
                c.save();
                c.translate(p.x, p.y);
                c.rotate(a);
                c.fillStyle = '#263038';
                c.fillRect(5, -4, 34, 8);
                c.restore();
            }
            if (this.s.elapsed < p.muzzleUntil) {
                const b = this.barrelOffset(id);
                this.drawRotated(this.muzzleAsset(id), p.x + Math.cos(a) * b, p.y + Math.sin(a) * b, a, 30, -2, .95);
            }
            c.fillStyle = '#fff36a';
            c.font = '900 13px Segoe UI';
            c.textAlign = 'center';
            c.fillText(`${p.name} · REINFORCEMENT`, p.x, p.y - 60);
            c.fillStyle = 'rgba(5,8,10,.86)';
            c.font = '800 10px Segoe UI';
            c.fillText(`${p.weapon.name}${p.state === 'recovering' ? ' · REAGRUPAR' : ''}`, p.x, p.y + 58);
            c.restore();
        }
        enemyDirection(z) { return z.direction; }
        enemyHeight(z) {
            if (z.type === 'runner')
                return 72;
            if (z.type === 'tank')
                return 104;
            if (z.type === 'commander')
                return 86;
            if (z.type === 'powerBoss')
                return 142;
            if (z.type === 'vampire')
                return 92;
            if (z.type === 'nocturnus')
                return 138;
            return 78;
        }
        enemyGait(z) {
            if (z.type === 'runner')
                return { freq: 10, amp: 2.3, sway: 0 };
            if (z.type === 'tank')
                return { freq: 3.0, amp: 1.0, sway: 0 };
            if (z.type === 'commander')
                return { freq: 5.0, amp: 1.2, sway: 0 };
            if (z.type === 'powerBoss')
                return { freq: 3.4, amp: 1.5, sway: 0 };
            if (z.type === 'vampire')
                return { freq: 7.5, amp: 1.4, sway: 0 };
            if (z.type === 'nocturnus')
                return { freq: 4.0, amp: .8, sway: 0 };
            return { freq: 5.5, amp: 1.4, sway: 0 };
        }
        drawEnemyTransformed(key, z, x, y, height, alpha, scaleX, scaleY, rotation, filter = 'none') {
            const c = this.ctx, img = this.asset(key);
            if (!img)
                return false;
            const w = height * (img.naturalWidth / img.naturalHeight);
            c.save();
            c.translate(x, y);
            c.rotate(rotation);
            c.scale(scaleX, scaleY);
            c.globalAlpha *= alpha;
            c.filter = filter;
            c.drawImage(img, -w / 2, -height / 2, w, height);
            c.restore();
            return true;
        }
        drawEnemyShape(z) {
            const c = this.ctx, dir = this.enemyDirection(z), key = this.s.mission === 'thriller' ? `enemiesThriller.${z.type === 'nocturnus' ? 'powerBoss' : z.type}.${dir}` : `enemies.${z.type}.${dir}`, g = this.enemyGait(z);
            const moving = Math.abs(z.vx) + Math.abs(z.vy) > .05 && z.motionState === 'move';
            const phase = this.s.elapsed * g.freq + z.motionSeed;
            let bob = moving ? Math.sin(phase) * g.amp : 0;
            let sway = 0;
            let sx = 1, sy = 1, ox = 0, oy = bob, alpha = 1;
            if (z.type === 'runner' && moving) {
                sy = 1.035;
                sx = .985;
                oy += Math.sin(phase) * 1.6;
            }
            if (z.type === 'tank' && moving) {
                sy = 1 + Math.sin(phase) * .018;
                sx = 1 - Math.sin(phase) * .012;
                c.fillStyle = 'rgba(166,145,103,.16)';
                c.beginPath();
                c.ellipse(z.x - 11, z.y + 38, 13, 6, 0, 0, Math.PI * 2);
                c.ellipse(z.x + 12, z.y + 38, 13, 6, 0, 0, Math.PI * 2);
                c.fill();
            }
            if (z.type === 'powerBoss') {
                const lost = z.maxLives - z.lives;
                const aura = 34 + lost * 5 + Math.sin(this.s.elapsed * 5) * 4;
                c.fillStyle = `rgba(130,255,80,${.04 + lost * .018})`;
                c.beginPath();
                c.arc(z.x, z.y, aura, 0, Math.PI * 2);
                c.fill();
            }
            if (z.motionState === 'attack_windup' || z.motionState === 'attack_recover') {
                const total = Math.max(.01, z.attackEndAt - z.attackStartedAt), p = MZV.clamp((this.s.elapsed - z.attackStartedAt) / total, 0, 1);
                const lunge = Math.sin(p * Math.PI) * (z.type === 'tank' || z.type === 'powerBoss' ? 18 : 11);
                ox = z.vx * lunge;
                oy += z.vy * lunge;
                sy = 1 + Math.sin(p * Math.PI) * .07;
                sx = 1 - Math.sin(p * Math.PI) * .035;
                if (z.motionState === 'attack_windup' && (z.type === 'tank' || z.type === 'powerBoss' || z.type === 'nocturnus')) {
                    c.strokeStyle = z.type === 'nocturnus' ? 'rgba(255,67,145,.72)' : 'rgba(255,112,55,.68)';
                    c.lineWidth = 3;
                    c.beginPath();
                    c.arc(z.x, z.y, z.radius + 18 + Math.sin(this.s.elapsed * 12) * 3, 0, Math.PI * 2);
                    c.stroke();
                }
            }
            if (z.motionState === 'dash') {
                const ghostAlpha = z.type === 'vampire' ? .24 : .12;
                this.drawEnemyTransformed(key, z, z.x - (z.x - z.prevX) * 3, z.y - (z.y - z.prevY) * 3, this.enemyHeight(z), ghostAlpha, 1, 1, 0);
                this.drawEnemyTransformed(key, z, z.x - (z.x - z.prevX) * 1.5, z.y - (z.y - z.prevY) * 1.5, this.enemyHeight(z), ghostAlpha * .75, 1, 1, 0);
                sy = 1.05;
                sx = .96;
            }
            if (z.motionState === 'teleport_out') {
                const rem = MZV.clamp((z.teleportPhaseEnd - this.s.elapsed) / .34, 0, 1);
                alpha = rem;
                sx = sy = .82 + .18 * rem;
                c.strokeStyle = `rgba(214,55,136,${.7 * (1 - rem)})`;
                c.lineWidth = 4;
                c.beginPath();
                c.arc(z.x, z.y, 28 + (1 - rem) * 42, 0, Math.PI * 2);
                c.stroke();
            }
            else if (z.motionState === 'teleport_in') {
                const p = 1 - MZV.clamp((z.teleportPhaseEnd - this.s.elapsed) / .30, 0, 1);
                alpha = p;
                sx = sy = .82 + .18 * p;
                c.strokeStyle = `rgba(214,55,136,${.65 * (1 - p)})`;
                c.lineWidth = 4;
                c.beginPath();
                c.arc(z.x, z.y, 65 - p * 35, 0, Math.PI * 2);
                c.stroke();
            }
            if (z.motionState === 'stunned') {
                ox += Math.sin(this.s.elapsed * 36) * 3;
                alpha = .82;
            }
            const hit = this.s.elapsed < z.hitUntil;
            const filter = hit ? 'brightness(1.75) saturate(.55)' : 'none';
            if (this.drawEnemyTransformed(key, z, z.x + ox, z.y + oy, this.enemyHeight(z), alpha, sx, sy, 0, filter))
                return;
            c.fillStyle = hit ? '#d9e5c7' : '#71885d';
            c.beginPath();
            c.arc(z.x + ox, z.y + oy, z.radius, 0, Math.PI * 2);
            c.fill();
        }
        drawEnemies() {
            const c = this.ctx;
            for (const z of this.s.enemies) {
                if (!z.alive || !this.visibleOnMobile(z.x, z.y, 180))
                    continue;
                this.drawEnemyShape(z);
                if (z.type === 'powerBoss' || z.type === 'nocturnus') {
                    const bw = z.type === 'nocturnus' ? 160 : 140;
                    c.fillStyle = 'rgba(0,0,0,.65)';
                    c.fillRect(z.x - bw / 2, z.y - this.enemyHeight(z) / 2 - 20, bw, 9);
                    c.fillStyle = z.type === 'nocturnus' ? '#d13d6c' : '#7cdb5b';
                    c.fillRect(z.x - bw / 2, z.y - this.enemyHeight(z) / 2 - 20, bw * Math.max(0, z.hp / z.maxHp), 9);
                    c.fillStyle = '#fff';
                    c.font = '900 12px Segoe UI';
                    c.textAlign = 'center';
                    c.fillText(z.type === 'nocturnus' ? `${this.s.mission === 'thriller' ? 'THRILLER BOSS' : 'LORD NOCTURNUS'} · FASE ${z.phase}` : `${this.s.mission === 'thriller' ? 'THRILLER BOSS' : 'POWER BOSS'} · ${z.lives}/7 · FASE ${z.phase}`, z.x, z.y - this.enemyHeight(z) / 2 - 28);
                }
            }
        }
        projectileHeight(kind) { return kind === 'pistol' ? 13 : kind === 'machinegun' ? 10 : kind === 'shotgun' ? 9 : kind === 'rifle' ? 12 : 28; }
        drawProjectiles() {
            const c = this.ctx;
            for (const b of this.s.projectiles) {
                if (!this.visibleOnMobile(b.x, b.y, 40))
                    continue;
                const a = Math.atan2(b.vy, b.vx), key = `projectiles.${b.kind}`;
                if (!this.drawRotated(key, b.x, b.y, a, this.projectileHeight(b.kind), -6)) {
                    c.save();
                    c.translate(b.x, b.y);
                    c.rotate(a);
                    c.fillStyle = b.kind === 'rifle' ? '#c9f8ff' : '#ffe38a';
                    c.fillRect(-6, -2, 12, 4);
                    c.restore();
                }
            }
        }
        drawExplosions() {
            const c = this.ctx;
            for (const e of this.s.explosions) {
                if (!this.visibleOnMobile(e.x, e.y, Math.max(120, e.maxRadius)))
                    continue;
                const p = 1 - e.life / e.maxLife, r = e.maxRadius * p, key = r < 70 ? 'effects.explosion_small' : 'effects.explosion_large';
                const img = this.asset(key);
                if (img) {
                    const h = Math.max(20, r * 2.1), w = h * (img.naturalWidth / img.naturalHeight);
                    c.save();
                    c.globalAlpha = Math.max(.18, e.life / e.maxLife);
                    c.drawImage(img, e.x - w / 2, e.y - h / 2, w, h);
                    c.restore();
                }
                else {
                    c.fillStyle = `rgba(255,170,65,${Math.max(0, e.life / e.maxLife) * .42})`;
                    c.beginPath();
                    c.arc(e.x, e.y, r, 0, Math.PI * 2);
                    c.fill();
                }
            }
            for (const a of this.s.airstrikes) {
                if (!this.visibleOnMobile(a.x, a.y, 160))
                    continue;
                if (!this.drawCentered('props.airstrike_target', a.x, a.y, 150, .72)) {
                    const p = .5 + .5 * Math.sin(this.s.elapsed * 10);
                    c.strokeStyle = `rgba(255,65,45,${.4 + .4 * p})`;
                    c.lineWidth = 4;
                    c.beginPath();
                    c.arc(a.x, a.y, 90 + 10 * p, 0, Math.PI * 2);
                    c.stroke();
                }
            }
        }
        chestAsset(b) {
            if (b.type === 'special')
                return 'props.chest_epic_closed';
            if (b.rarity === 'epic')
                return 'props.chest_epic_closed';
            if (b.type === 'tactical')
                return 'props.chest_tactical_closed';
            return 'props.chest_common_closed';
        }
        drawChests() {
            const c = this.ctx;
            for (const b of this.s.chests) {
                if (!this.visibleOnMobile(b.x, b.y, 100))
                    continue;
                const glow = b.rarity === 'epic' ? 'rgba(190,95,255,.38)' : b.rarity === 'rare' ? 'rgba(70,175,255,.28)' : 'rgba(255,215,110,.14)';
                c.fillStyle = glow;
                c.beginPath();
                c.arc(b.x, b.y, b.radius + 20 + Math.sin(this.s.elapsed * 5) * 3, 0, Math.PI * 2);
                c.fill();
                if (!this.drawCentered(this.chestAsset(b), b.x, b.y, 75)) {
                    c.fillStyle = b.type === 'tactical' ? '#536239' : '#8b592d';
                    c.fillRect(b.x - 28, b.y - 20, 56, 40);
                }
                c.fillStyle = b.type === 'special' ? '#ffe45f' : '#fff';
                c.font = '900 10px Segoe UI';
                c.textAlign = 'center';
                c.fillText(b.type === 'special' ? '⭐ SPECIAL CRATE' : `${b.type === 'tactical' ? 'TACTICAL ' : ''}${b.rarity.toUpperCase()}`, b.x, b.y - 46);
                if (b.progress > 0) {
                    c.fillStyle = 'rgba(0,0,0,.62)';
                    c.fillRect(b.x - 36, b.y + 39, 72, 7);
                    c.fillStyle = '#f1bd43';
                    c.fillRect(b.x - 36, b.y + 39, 72 * Math.min(1, b.progress / b.required), 7);
                }
            }
        }
        drawPickups() {
            const c = this.ctx;
            for (const p of this.s.pickups) {
                if (!this.visibleOnMobile(p.x, p.y, 100))
                    continue;
                if (p.type === 'campfire') {
                    if (!this.drawCentered('props.campfire_heal', p.x, p.y, 92, .9))
                        this.drawCentered('props.campfire', p.x, p.y, 78);
                    continue;
                }
                if (p.type === 'medkit') {
                    if (!this.drawCentered('props.medkit', p.x, p.y, 48)) {
                        c.fillStyle = '#f0f1ec';
                        c.fillRect(p.x - 16, p.y - 12, 32, 24);
                    }
                    continue;
                }
                if (!this.drawCentered('props.shield_core', p.x, p.y, 50)) {
                    c.strokeStyle = '#79eaff';
                    c.beginPath();
                    c.arc(p.x, p.y, 18, 0, Math.PI * 2);
                    c.stroke();
                }
            }
        }
        drawSams() {
            const c = this.ctx;
            for (const t of this.s.sams) {
                if (!this.visibleOnMobile(t.x, t.y, 120))
                    continue;
                const key = this.s.elapsed + 0.15 >= t.nextShot ? 'props.sam_firing' : 'props.sam';
                if (!this.drawCentered(key, t.x, t.y, 92)) {
                    c.save();
                    c.translate(t.x, t.y);
                    c.rotate(t.angle);
                    c.fillStyle = '#20272a';
                    c.fillRect(5, -10, 38, 7);
                    c.fillRect(5, 3, 38, 7);
                    c.restore();
                }
            }
        }
        drawHelicopters() {
            const c = this.ctx;
            for (const h of this.s.helicopters) {
                if (!this.visibleOnMobile(h.x, h.y, 180))
                    continue;
                c.save();
                c.translate(h.x, h.y);
                // sombra
                c.fillStyle = 'rgba(0,0,0,.22)';
                c.beginPath();
                c.ellipse(22, 28, 62, 22, .08, 0, Math.PI * 2);
                c.fill();
                // cauda
                c.save();
                c.rotate(h.angle);
                c.fillStyle = '#475342';
                c.fillRect(-66, -7, 65, 14);
                c.fillStyle = '#2d352d';
                c.fillRect(-75, -17, 18, 34);
                c.restore();
                // fuselagem
                c.fillStyle = '#53624b';
                c.strokeStyle = '#222b25';
                c.lineWidth = 3;
                c.beginPath();
                c.ellipse(4, 0, 43, 25, 0, 0, Math.PI * 2);
                c.fill();
                c.stroke();
                c.fillStyle = '#26343a';
                c.beginPath();
                c.ellipse(25, 0, 18, 16, 0, 0, Math.PI * 2);
                c.fill();
                c.fillStyle = '#92dded';
                c.globalAlpha = .6;
                c.beginPath();
                c.ellipse(28, -3, 11, 9, 0, 0, Math.PI * 2);
                c.fill();
                c.globalAlpha = 1;
                // rotor principal
                const spin = this.s.elapsed * 15;
                c.save();
                c.rotate(spin);
                c.strokeStyle = 'rgba(218,232,230,.62)';
                c.lineWidth = 4;
                c.beginPath();
                c.moveTo(-70, 0);
                c.lineTo(70, 0);
                c.moveTo(0, -70);
                c.lineTo(0, 70);
                c.stroke();
                c.restore();
                c.fillStyle = '#1d2522';
                c.beginPath();
                c.arc(0, 0, 7, 0, Math.PI * 2);
                c.fill();
                // luz de apoio
                c.fillStyle = '#ffcf4d';
                c.beginPath();
                c.arc(36, 2, 4, 0, Math.PI * 2);
                c.fill();
                c.restore();
                c.fillStyle = '#fff';
                c.font = '900 11px Segoe UI';
                c.textAlign = 'center';
                c.fillText(`HELICOPTER SUPPORT · ${Math.max(0, Math.ceil(h.life))}s`, h.x, h.y - 54);
            }
        }
        drawMiniMap() {
            const mobile = this.mobileLayout();
            const c = this.ctx, w = this.canvas.clientWidth, h = this.canvas.clientHeight;
            const mw = mobile ? 104 : 170, mh = mobile ? 68 : 112;
            const x = mobile ? Math.max(8, w - mw - 62) : w - mw - 14;
            const y = mobile ? 8 : h - mh - 14, sx = mw / MZV.WORLD.width, sy = mh / MZV.WORLD.height;
            c.fillStyle = 'rgba(10,14,16,.78)';
            c.fillRect(x, y, mw, mh);
            c.strokeStyle = 'rgba(255,255,255,.22)';
            c.strokeRect(x, y, mw, mh);
            for (const z of this.s.enemies) {
                c.fillStyle = z.type === 'nocturnus' ? '#ff4f86' : z.type === 'powerBoss' ? '#86ff68' : z.type === 'vampire' ? '#e152a4' : '#9abf76';
                c.fillRect(x + z.x * sx, y + z.y * sy, z.type === 'normal' ? 2 : 4, z.type === 'normal' ? 2 : 4);
            }
            for (const b of this.s.chests) {
                if (b.type === 'special') {
                    c.fillStyle = '#ffe44f';
                    c.fillRect(x + b.x * sx - 2, y + b.y * sy - 2, 5, 5);
                }
            }
            for (const h2 of this.s.helicopters) {
                c.fillStyle = '#72ddff';
                c.fillRect(x + h2.x * sx - 2, y + h2.y * sy - 2, 5, 5);
            }
            for (const p of this.s.players) {
                c.fillStyle = p.minimap;
                c.beginPath();
                c.arc(x + p.x * sx, y + p.y * sy, 4, 0, Math.PI * 2);
                c.fill();
                c.fillStyle = '#111';
                c.font = '800 7px Segoe UI';
                c.textAlign = 'center';
                c.fillText(`P${p.slot}`, x + p.x * sx, y + p.y * sy + 2);
            }
            const rr = this.s.reinforcement;
            if (rr) {
                c.fillStyle = '#ffe54f';
                c.beginPath();
                c.arc(x + rr.x * sx, y + rr.y * sy, 4, 0, Math.PI * 2);
                c.fill();
                c.fillStyle = '#111';
                c.font = '900 6px Segoe UI';
                c.textAlign = 'center';
                c.fillText('AI', x + rr.x * sx, y + rr.y * sy + 2);
            }
        }
        drawRageHud() {
            if (this.s.elapsed >= this.s.rageUntil)
                return;
            const c = this.ctx, w = this.canvas.clientWidth, h = this.canvas.clientHeight;
            const pulse = .5 + .5 * Math.sin(this.s.elapsed * 6);
            c.save();
            c.textAlign = 'center';
            c.font = `1000 ${Math.round(36 + 5 * pulse)}px Segoe UI`;
            c.fillStyle = `rgba(255,231,65,${.45 + .45 * pulse})`;
            c.shadowColor = '#ff9d00';
            c.shadowBlur = 18;
            c.fillText('MODO RAIVA', w / 2, 62);
            c.shadowBlur = 0;
            c.font = '900 15px Segoe UI';
            c.fillStyle = '#fff';
            const rr = this.s.reinforcement;
            c.fillText(`${rr ? rr.name.toUpperCase() + ' REINFORCEMENT · ' : ''}SCORE ×2 · COMBO ×${Math.max(1, this.s.combo)} · RAGE KILLS ${this.s.rageKills}`, w / 2, 87);
            c.restore();
        }
        drawThrillerOverlay() {
            if (this.s.mission !== 'thriller') return;
            const c = this.ctx, w = this.canvas.clientWidth, h = this.canvas.clientHeight;
            if (this.s.scareUntil > this.s.elapsed) {
                const total = 2.4, remain = this.s.scareUntil - this.s.elapsed, p = MZV.clamp(1 - remain / total, 0, 1), alpha = Math.sin(p * Math.PI) * .92;
                c.save();
                c.fillStyle = `rgba(8,6,18,${.10 + .15 * alpha})`; c.fillRect(0,0,w,h);
                const img = this.asset('effects.thriller_apparition');
                if (img) { const hh = Math.min(h * .58, 330), ww = hh * (img.naturalWidth / img.naturalHeight); c.globalAlpha = alpha; c.drawImage(img, w - ww - 24, h * .12, ww, hh); }
                c.textAlign='center'; c.font=`1000 ${Math.round(28 + 9*alpha)}px Segoe UI`; c.fillStyle=`rgba(255,72,96,${.55+.38*alpha})`; c.shadowColor='rgba(0,0,0,.9)'; c.shadowBlur=18; c.fillText('THRILLER',w*.5,44);
                c.restore();
            }
            if (this.s.lightningAlpha > 0) {
                const a=this.s.lightningAlpha; c.save();
                c.fillStyle=`rgba(224,232,255,${a})`; c.fillRect(0,0,w,h);
                c.strokeStyle=`rgba(255,255,255,${Math.min(1,a*1.5)})`; c.lineWidth=2.5; c.beginPath();
                let x=w*.18; c.moveTo(x,0); c.lineTo(x+18,h*.13); c.lineTo(x-7,h*.24); c.lineTo(x+21,h*.37); c.stroke();
                c.restore();
            }
        }
        drawRevive() {
            if (!this.revive.active)
                return;
            const c = this.ctx, w = this.canvas.clientWidth, h = this.canvas.clientHeight, p = .5 + .5 * Math.sin(this.s.elapsed * 12);
            c.save();
            c.textAlign = 'center';
            c.font = `1000 ${Math.round(48 + 8 * p)}px Segoe UI`;
            c.fillStyle = `rgba(255,243,85,${.35 + .65 * p})`;
            c.shadowColor = '#ff3c32';
            c.shadowBlur = 24;
            c.fillText('REVIVER! REVIVER! REVIVER!', w / 2, h * .25);
            c.shadowBlur = 0;
            c.font = '900 25px Segoe UI';
            c.fillStyle = '#fff';
            c.fillText(`${this.revive.active.name.toUpperCase()} CAIU · ${Math.ceil(this.revive.timeLeft)}s`, w / 2, h * .25 + 42);
            c.restore();
        }
    }
    MZV.Renderer = Renderer;
})(MZV || (MZV = {}));
var MZV;
(function (MZV) {
    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
    MZV.clamp = clamp;
    function rand(a, b) { return a + Math.random() * (b - a); }
    MZV.rand = rand;
    class GameApp {
        constructor(canvas) {
            this.canvas = canvas;
            this.state = new MZV.GameState();
            this.input = new MZV.InputSystem();
            this.audio = new MZV.AudioSystem();
            this.movement = new MZV.MovementSystem(this.input);
            this.revive = new MZV.ReviveSystem(this.state, this.audio, s => this.notify(s));
            this.combat = new MZV.CombatSystem(this.state, this.audio, s => this.notify(s));
            this.loot = new MZV.LootSystem(this.state, this.audio, s => this.notify(s));
            this.horde = new MZV.HordeSystem(this.state, this.audio, s => this.notify(s));
            this.rage = new MZV.RageSystem(this.state, this.audio, s => this.notify(s), count => this.horde.spawnRageWave(count));
            this.enemyMotion = new MZV.EnemyMotionSystem(this.state, (target, damage) => target instanceof MZV.Player ? this.combat.damagePlayer(target, damage) : this.rage.damage(target, damage), s => this.notify(s));
            this.music = new MZV.MusicDirector(this.state, this.audio, this.horde, this.rage, () => this.combat.deployHelicopter(), s => this.notify(s));
            this.last = performance.now();
            this.toastUntil = 0;
            this.autoTest = false;
            this.pendingP1 = 'marcio';
            this.pendingP2 = 'marco';
            this.pendingMode = 'single';
            this.pendingMission = 'deserto';
            this.settingsWasRunning = false;
            MZV.SETTINGS.load();
            this.combat.rageDamage = (r, d) => this.rage.damage(r, d);
            this.renderer = new MZV.Renderer(canvas, this.state, this.revive);
            this.renderer.resize();
            this.touch = new MZV.TouchControls(this.input, () => { if (this.state.running)
                this.combat.callAirstrike(); }, () => this.openSettings(), () => this.requestFullscreen());
            this.viewportTimer = 0;
            this.handleViewportChange = () => this.syncViewport();
            addEventListener('resize', this.handleViewportChange);
            addEventListener('orientationchange', this.handleViewportChange);
            if (window.visualViewport)
                window.visualViewport.addEventListener('resize', this.handleViewportChange);
            document.addEventListener('fullscreenchange', () => { this.updateFullscreenUi(); this.syncViewport(); });
            this.syncViewport();
            this.bindUi();
            this.bindCharacterPreviews();
            this.buildSettingsWeaponOrder();
            this.syncSettingsForm();
            requestAnimationFrame(t => this.loop(t));
        }
        $(id) { return document.getElementById(id); }
        bindCharacterPreviews() { for (const id of ['marcio', 'marco', 'dany']) {
            const url = MZV.assetUrl(`characters.${id}.idle_down`);
            document.querySelectorAll(`[data-preview="${id}"]`).forEach(el => { el.src = url; });
        } }
        buildSettingsWeaponOrder() {
            const host = this.$('weaponOrderSettings');
            host.innerHTML = '';
            const ids = ['pistol', 'shotgun', 'rifle', 'machinegun', 'twinMachinegun', 'twinMachinegunOverdrive'];
            ids.forEach((_, i) => {
                const row = document.createElement('div');
                row.className = 'weapon-order-row';
                const label = document.createElement('span');
                label.textContent = `${i + 1}.`;
                const select = document.createElement('select');
                select.id = `weaponOrder_${i}`;
                for (const id of ids) {
                    const o = document.createElement('option');
                    o.value = id;
                    o.textContent = MZV.WEAPONS[id].name;
                    select.appendChild(o);
                }
                row.append(label, select);
                host.appendChild(row);
            });
        }
        syncSettingsForm() {
            const q = MZV.SETTINGS.current;
            this.$('setChestTime').value = String(q.chestOpenSeconds);
            this.$('setRageEvery').value = String(q.rageEvery);
            this.$('setMusicSync').checked = q.musicSync;
            for (const [k, v] of Object.entries(q.tacticalLoot))
                this.$(`tactical_${k}`).checked = v;
            for (const [k, v] of Object.entries(q.specialLoot))
                this.$(`special_${k}`).checked = v;
            q.weaponOrder.forEach((id, i) => { const e = this.$(`weaponOrder_${i}`); if (e)
                e.value = id; });
            this.$('settingsStatus').textContent = '';
        }
        readSettingsForm() {
            const current = MZV.SETTINGS.current;
            const order = [];
            for (let i = 0; i < 6; i++)
                order.push(this.$(`weaponOrder_${i}`).value);
            return {
                chestOpenSeconds: Number(this.$('setChestTime').value),
                rageEvery: Number(this.$('setRageEvery').value),
                musicSync: this.$('setMusicSync').checked,
                weaponOrder: order,
                tacticalLoot: {
                    weapon: this.$('tactical_weapon').checked,
                    grenade: this.$('tactical_grenade').checked,
                    rocket: this.$('tactical_rocket').checked,
                    shield: this.$('tactical_shield').checked,
                    drone: this.$('tactical_drone').checked,
                    sam: this.$('tactical_sam').checked,
                    airstrike: this.$('tactical_airstrike').checked
                },
                specialLoot: {
                    rocket: this.$('special_rocket').checked,
                    helicopter: this.$('special_helicopter').checked
                }
            };
        }
        syncViewport() {
            const viewport = window.visualViewport;
            const width = Math.round(viewport?.width || innerWidth), height = Math.round(viewport?.height || innerHeight);
            document.documentElement.style.setProperty('--app-width', `${width}px`);
            document.documentElement.style.setProperty('--app-height', `${height}px`);
            requestAnimationFrame(() => this.renderer.resize());
            clearTimeout(this.viewportTimer);
            this.viewportTimer = setTimeout(() => this.renderer.resize(), 220);
        }
        updateFullscreenUi() {
            const button = this.$('touchFullscreen');
            if (!button)
                return;
            button.innerHTML = document.fullscreenElement ? '↙<small>SAIR</small>' : '⛶<small>FULL</small>';
            button.setAttribute('aria-label', document.fullscreenElement ? 'Sair do ecrã inteiro' : 'Ecrã inteiro');
        }
        async requestFullscreen(toggle = true) {
            try {
                if (toggle && document.fullscreenElement && document.exitFullscreen) {
                    await document.exitFullscreen();
                    return;
                }
                if (!document.fullscreenElement) {
                    const request = document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen;
                    if (!request) {
                        this.notify('No iPhone: Partilhar → Adicionar ao ecrã principal');
                        return;
                    }
                    try {
                        await request.call(document.documentElement, { navigationUI: 'hide' });
                    }
                    catch {
                        await request.call(document.documentElement);
                    }
                }
            }
            catch { }
            try {
                const orientation = screen.orientation;
                if (orientation && typeof orientation.lock === 'function')
                    await orientation.lock('landscape');
            }
            catch { }
            this.updateFullscreenUi();
            this.syncViewport();
        }
        openSettings() {
            this.settingsWasRunning = this.state.running;
            if (this.state.running) {
                this.state.running = false;
                this.audio.pauseGameplayMusic();
                this.touch.hide();
            }
            this.syncSettingsForm();
            this.$('settingsOverlay').classList.remove('hidden');
        }
        closeSettings() {
            this.$('settingsOverlay').classList.add('hidden');
            if (this.settingsWasRunning && !this.state.gameOver) {
                this.state.running = true;
                this.last = performance.now();
                this.audio.resumeGameplayMusic();
                this.touch.show();
            }
            this.settingsWasRunning = false;
        }
        saveSettings() {
            MZV.SETTINGS.save(this.readSettingsForm());
            this.syncSettingsForm();
            this.$('settingsStatus').textContent = `GUARDADO · caixas ${MZV.SETTINGS.current.chestOpenSeconds}s · Rage a cada ${MZV.SETTINGS.current.rageEvery} níveis`;
            this.notify('⚙ DEFINIÇÕES GUARDADAS');
        }
        showPanel(id) { for (const x of ['modeMenu', 'missionMenu', 'singleCharacterMenu', 'twoCharacterMenu'])
            this.$(x).classList.add('hidden'); this.$(id).classList.remove('hidden'); }
        updateTwoSelection() {
            const ids = ['marcio', 'marco', 'dany'];
            for (const id of ids) {
                const p1 = this.$(`p1_${id}`), p2 = this.$(`p2_${id}`);
                p1.classList.toggle('selected', this.pendingP1 === id);
                p2.classList.toggle('selected', this.pendingP2 === id);
                p1.disabled = this.pendingP2 === id;
                p2.disabled = this.pendingP1 === id;
            }
            this.$('p1Choice').textContent = MZV.CHARACTERS[this.pendingP1].name;
            this.$('p2Choice').textContent = MZV.CHARACTERS[this.pendingP2].name;
            this.$('startTwo').disabled = this.pendingP1 === this.pendingP2;
        }
        bindUi() {
            let menuMusicArmed = false;
            const startMenuAudio = () => { if (!menuMusicArmed) {
                menuMusicArmed = true;
                this.audio.startMenuMusic();
            } };
            addEventListener('pointerdown', startMenuAudio);
            this.$('onePlayer').addEventListener('click', () => { startMenuAudio(); this.pendingMode = 'single'; this.showPanel('missionMenu'); });
            this.$('twoPlayers').addEventListener('click', () => { startMenuAudio(); this.pendingMode = 'two'; this.pendingP1 = 'marcio'; this.pendingP2 = 'marco'; this.updateTwoSelection(); this.showPanel('missionMenu'); });
            this.$('mission_deserto').addEventListener('click', () => { this.pendingMission = 'deserto'; this.$('singleMissionLabel').textContent='DESERTO'; this.$('twoMissionLabel').textContent='DESERTO'; if (this.pendingMode === 'single') this.showPanel('singleCharacterMenu'); else { this.updateTwoSelection(); this.showPanel('twoCharacterMenu'); } });
            this.$('mission_thriller').addEventListener('click', () => { this.pendingMission = 'thriller'; this.$('singleMissionLabel').textContent='THRILLER'; this.$('twoMissionLabel').textContent='THRILLER'; if (this.pendingMode === 'single') this.showPanel('singleCharacterMenu'); else { this.updateTwoSelection(); this.showPanel('twoCharacterMenu'); } });
            for (const id of ['marcio', 'marco', 'dany']) {
                this.$(`single_${id}`).addEventListener('click', () => this.start('single', id, 'marco', this.pendingMission));
                this.$(`p1_${id}`).addEventListener('click', () => { if (this.pendingP2 !== id) {
                    this.pendingP1 = id;
                    this.updateTwoSelection();
                } });
                this.$(`p2_${id}`).addEventListener('click', () => { if (this.pendingP1 !== id) {
                    this.pendingP2 = id;
                    this.updateTwoSelection();
                } });
            }
            this.$('startTwo').addEventListener('click', () => this.start('two', this.pendingP1, this.pendingP2, this.pendingMission));
            document.querySelectorAll('[data-back-to]').forEach(el => el.addEventListener('click', () => this.showPanel(el.getAttribute('data-back-to') || 'modeMenu')));
            this.$('restart').addEventListener('click', () => this.start(this.state.mode, this.state.selectedP1, this.state.selectedP2, this.state.mission));
            this.$('sound').addEventListener('click', () => { this.audio.setEnabled(!this.audio.enabled); this.$('sound').textContent = this.audio.enabled ? '🔊 SOM' : '🔇 SOM'; });
            this.$('settingsMenu').addEventListener('click', () => this.openSettings());
            this.$('settingsHud').addEventListener('click', () => this.openSettings());
            this.$('settingsCancel').addEventListener('click', () => this.closeSettings());
            this.$('settingsSave').addEventListener('click', () => this.saveSettings());
            this.$('settingsDefaults').addEventListener('click', () => { MZV.SETTINGS.reset(); this.syncSettingsForm(); this.$('settingsStatus').textContent = 'STANDARD RESTAURADO'; });
            this.$('rotateFullscreen').addEventListener('click', () => this.requestFullscreen(false));
            this.$('rotateDismiss').addEventListener('click', () => this.$('rotateHint').classList.add('dismissed'));
            addEventListener('keydown', e => {
                if (e.code === 'Escape' && !e.repeat) {
                    if (!this.$('settingsOverlay').classList.contains('hidden'))
                        this.closeSettings();
                    else
                        this.openSettings();
                }
                if (e.code === 'Space' && this.state.running && !e.repeat)
                    this.combat.callAirstrike();
                if (e.code === 'KeyM' && !e.repeat) {
                    this.audio.setEnabled(!this.audio.enabled);
                    this.$('sound').textContent = this.audio.enabled ? '🔊 SOM' : '🔇 SOM';
                }
                if (this.autoTest && e.code === 'KeyN')
                    this.skipLevel();
            });
            if (location.search.includes('autotest=1')) {
                this.autoTest = true;
                setTimeout(() => this.start('two', 'dany', 'marco', 'thriller'), 50);
                setTimeout(() => { const st = document.getElementById('runtime-status'); if (st)
                    st.textContent = this.state.running ? 'AUTOTEST_OK' : 'AUTOTEST_FAIL'; }, 1800);
            }
        }
        startLevel() { this.horde.startLevel(); this.rage.armForLevel(); }
        start(mode, p1, p2 = 'marco', mission = 'deserto') {
            if (mode === 'two' && p1 === p2)
                throw new Error('Os dois jogadores não podem escolher a mesma personagem.');
            this.state.reset(mode, p1, p2, mission);
            const midX = MZV.WORLD.width / 2, midY = MZV.WORLD.height / 2;
            if (mode === 'single')
                this.state.players.push(new MZV.Player(MZV.CHARACTERS[p1], midX, midY, MZV.CONTROLS.WASD, 1));
            else
                this.state.players.push(new MZV.Player(MZV.CHARACTERS[p1], midX - 65, midY, MZV.CONTROLS.WASD, 1), new MZV.Player(MZV.CHARACTERS[p2], midX + 65, midY, MZV.CONTROLS.ARROWS, 2));
            const startingWeapon = MZV.SETTINGS.current.weaponOrder[0] || 'pistol';
            for (const p of this.state.players) {
                p.weaponId = startingWeapon;
                p.currentWeaponId = startingWeapon;
                p.weaponLevel = 1;
            }
            this.$('menu').classList.add('hidden');
            this.$('gameOver').classList.add('hidden');
            this.$('hud').classList.remove('hidden');
            document.documentElement.classList.add('game-playing');
            document.documentElement.classList.toggle('single-player', mode === 'single');
            this.$('rotateHint').classList.remove('dismissed');
            this.touch.setMode(mode);
            this.syncViewport();
            if (this.touch.enabled)
                void this.requestFullscreen(false);
            this.music.start();
            this.audio.play('laugh', .70);
            this.startLevel();
            this.updateHud();
            this.last = performance.now();
            this.$('runtime-status').textContent = 'RUNNING';
        }
        notify(s) { const t = this.$('toast'); t.textContent = s; t.classList.add('show'); this.toastUntil = performance.now() + 2600; }
        skipLevel() { for (const z of this.state.enemies)
            z.alive = false; this.state.enemies = []; }
        loop(t) {
            try {
                const dt = Math.min(.033, (t - this.last) / 1000 || 0);
                this.last = t;
                if (this.state.running)
                    this.update(dt);
                this.renderer.draw();
                if (performance.now() > this.toastUntil)
                    this.$('toast').classList.remove('show');
                requestAnimationFrame(q => this.loop(q));
            }
            catch (err) {
                console.error(err);
                this.$('runtime-status').textContent = 'ERROR: ' + (err instanceof Error ? err.message : String(err));
                this.state.running = false;
            }
        }
        update(dt) {
            const s = this.state;
            s.elapsed += dt;
            this.music.update();
            this.updateThrillerAtmosphere(dt);
            for (const p of s.players)
                this.movement.updatePlayer(p, dt);
            this.rage.update(dt);
            this.combat.update(dt);
            this.enemyMotion.update(dt);
            this.loot.update(dt);
            this.revive.update();
            if (s.overdriveUntil > 0 && s.elapsed >= s.overdriveUntil)
                s.overdriveUntil = 0;
            if (s.mode === 'single') {
                const p = s.players[0];
                if (!p.alive) {
                    p.out = true;
                    s.gameOver = true;
                }
            }
            if (s.victory) {
                s.running = false;
                s.gameOver = true;
                this.audio.stopGameplayMusic();
                this.audio.play('victory', .65);
                this.showGameOver(true);
            }
            else if (s.players.every(p => p.out || !p.alive) && !this.revive.active) {
                s.running = false;
                s.gameOver = true;
                this.audio.stopGameplayMusic();
                this.audio.play('gameover', .6);
                this.showGameOver(false);
            }
            else if (!s.enemies.length && !s.victory && !this.horde.hasPendingLevelThreats() && !this.rage.blocksLevel()) {
                s.level++;
                this.startLevel();
            }
            this.updateHud();
        }
        updateThrillerAtmosphere(dt) {
            const s = this.state;
            if (s.mission !== 'thriller') { s.lightningAlpha = 0; s.scareUntil = 0; return; }
            if (s.lightningAlpha > 0) s.lightningAlpha = Math.max(0, s.lightningAlpha - dt * 2.25);
            if (s.elapsed >= s.nextLightningAt) {
                s.lightningAlpha = .30 + Math.random() * .34;
                const bossPending = s.pendingBoss === 'powerBoss' || s.pendingBoss === 'nocturnus';
                s.nextLightningAt = s.elapsed + MZV.rand(bossPending ? 5.5 : 10.5, bossPending ? 10 : 23);
            }
            if (s.pendingBoss === 'powerBoss' || s.pendingBoss === 'nocturnus') {
                if (s.nextScareAt <= 0) s.nextScareAt = s.elapsed + 2.2;
                if (s.elapsed >= s.nextScareAt) {
                    s.scareUntil = s.elapsed + 2.4;
                    s.nextScareAt = s.elapsed + MZV.rand(7.5, 12.5);
                    this.audio.play('laugh', .72);
                    this.notify('👻 THRILLER BOSS A OBSERVAR...');
                }
            } else if (s.scareUntil > 0 && s.elapsed >= s.scareUntil) {
                s.scareUntil = 0;
            }
        }
        showGameOver(victory) {
            document.documentElement.classList.remove('game-playing');
            document.documentElement.classList.remove('single-player');
            this.touch.hide();
            const box = this.$('gameOver');
            box.classList.remove('hidden');
            this.$('resultTitle').textContent = victory ? 'VITÓRIA' : 'GAME OVER';
            this.$('resultText').textContent = victory ? `Lord Nocturnus foi derrotado · ${this.state.kills} kills · ${this.state.score.toLocaleString()} pontos.` : `Nível ${this.state.level} · ${this.state.kills} kills · ${this.state.score.toLocaleString()} pontos.`;
        }
        updateHud() {
            const s = this.state, p1 = s.players[0], p2 = s.players[1];
            const missionHud = this.$('mission'); if (missionHud) missionHud.textContent = s.mission === 'thriller' ? 'THRILLER' : 'DESERTO';
            this.$('level').textContent = String(s.level);
            this.$('kills').textContent = String(s.kills);
            this.$('score').textContent = s.score.toLocaleString();
            this.$('remaining').textContent = String(s.enemies.length);
            this.$('air').textContent = String(s.airstrikeCharges);
            this.$('overdrive').textContent = s.elapsed < s.overdriveUntil ? Math.ceil(s.overdriveUntil - s.elapsed) + 's' : '—';
            this.$('rage').textContent = s.elapsed < s.rageUntil ? Math.ceil(s.rageUntil - s.elapsed) + 's' : '—';
            this.$('combo').textContent = s.elapsed < s.rageUntil && s.combo > 0 ? '×' + s.combo : '—';
            this.$('reinforcement').textContent = s.reinforcement ? `${s.reinforcement.name} ${s.reinforcement.state === 'exiting' ? '↗' : 'AI'}` : '—';
            this.$('musicCue').textContent = `${s.musicCue} · ${Math.floor(s.musicTime / 60)}:${String(Math.floor(s.musicTime % 60)).padStart(2, '0')}`;
            this.$('musicIntensity').textContent = s.musicIntensity;
            this.$('p1').textContent = p1 ? `P1 · ${p1.name} ❤️ ${Math.ceil(p1.hp)} · ${p1.weapon.name}` : '—';
            this.$('p2').textContent = p2 ? `P2 · ${p2.name} ❤️ ${Math.ceil(p2.hp)} · ${p2.weapon.name}` : 'SINGLE PLAYER';
            const airLabel = this.$('touchAirstrike')?.querySelector('small');
            if (airLabel)
                airLabel.textContent = `AIR · ${s.airstrikeCharges}`;
        }
    }
    MZV.GameApp = GameApp;
})(MZV || (MZV = {}));
var MZV;
(function (MZV) {
    window.addEventListener('DOMContentLoaded', () => {
        const canvas = document.getElementById('game');
        const app = new MZV.GameApp(canvas);
        window.__MZV_APP__ = app;
    });
})(MZV || (MZV = {}));
