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
        crateRageSeconds: 60,
        rampageSeconds: 38,
        rampageScoreMultiplier: 3,
        mysteryEveryLevels: 7,
        extraLifeWindowLevels: 14,
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
            this.extraLives = 0;
            this.invulnerableUntil = 0;
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
            this.variant = null;
            this.isBoss = type === 'powerBoss' || type === 'nocturnus';
            this.bossName = type === 'nocturnus' ? 'LORD NOCTURNUS' : type === 'powerBoss' ? 'POWER BOSS' : '';
            this.form = null;
            this.specialAttack = null;
            this.specialStartedAt = 0;
            this.specialHitAt = 0;
            this.specialEndAt = 0;
            this.specialCooldown = MZV.rand(2.5, 4.5);
            this.specialDidHit = false;
            this.specialTargetX = 0;
            this.specialTargetY = 0;
            this.specialCycle = 0;
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
            this.radius = type === 'mystery' ? 38 : type === 'special' ? 35 : type === 'tactical' ? 31 : 27;
            this.required = type === 'mystery' ? 9 : MZV.SETTINGS.chestSeconds();
            this.life = type === 'mystery' ? 26 : type === 'special' ? 120 : type === 'tactical' ? 90 : 65;
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
            this.muzzleUntil = 0;
        }
    }
    MZV.Helicopter = Helicopter;
})(MZV || (MZV = {}));
var MZV;
(function (MZV) {
    MZV.ASSET_PATHS = {
        'battlefield': 'assets/images/battlefield.webp',
        'battlefield.thriller': 'assets/images/battlefield_thriller.webp',
        'bosses.yellowThriller.down': 'assets/images/bosses/yellowThriller/down.png',
        'bosses.yellowThriller.left': 'assets/images/bosses/yellowThriller/left.png',
        'bosses.yellowThriller.right': 'assets/images/bosses/yellowThriller/right.png',
        'bosses.yellowThriller.up': 'assets/images/bosses/yellowThriller/up.png',
        'bosses.shadowDancer.down': 'assets/images/bosses/shadowDancer/down.png',
        'bosses.shadowDancer.left': 'assets/images/bosses/shadowDancer/left.png',
        'bosses.shadowDancer.right': 'assets/images/bosses/shadowDancer/right.png',
        'bosses.shadowDancer.up': 'assets/images/bosses/shadowDancer/up.png',
        'bosses.redThriller.down': 'assets/images/bosses/redThriller/down.png',
        'bosses.redThriller.left': 'assets/images/bosses/redThriller/left.png',
        'bosses.redThriller.right': 'assets/images/bosses/redThriller/right.png',
        'bosses.redThriller.up': 'assets/images/bosses/redThriller/up.png',
        'bosses.blackYellowThriller.down': 'assets/images/bosses/blackYellowThriller/down.png',
        'bosses.blackYellowThriller.left': 'assets/images/bosses/blackYellowThriller/left.png',
        'bosses.blackYellowThriller.right': 'assets/images/bosses/blackYellowThriller/right.png',
        'bosses.blackYellowThriller.up': 'assets/images/bosses/blackYellowThriller/up.png',
        'bosses.werewolfThriller.down': 'assets/images/bosses/werewolfThriller/down.png',
        'bosses.werewolfThriller.left': 'assets/images/bosses/werewolfThriller/left.png',
        'bosses.werewolfThriller.right': 'assets/images/bosses/werewolfThriller/right.png',
        'bosses.werewolfThriller.up': 'assets/images/bosses/werewolfThriller/up.png',
        'npc.rescueWoman.down': 'assets/images/npc/rescueWoman/down.png',
        'npc.rescueWoman.left': 'assets/images/npc/rescueWoman/left.png',
        'npc.rescueWoman.right': 'assets/images/npc/rescueWoman/right.png',
        'npc.rescueWoman.up': 'assets/images/npc/rescueWoman/up.png',
        'npc.rescueWomanV2.idle': 'assets/images/npc/rescueWomanV2/idle.webp',
        'npc.rescueWomanV2.run_down': 'assets/images/npc/rescueWomanV2/run_down.webp',
        'npc.rescueWomanV2.run_right': 'assets/images/npc/rescueWomanV2/run_right.webp',
        'npc.rescueWomanV2.panic': 'assets/images/npc/rescueWomanV2/panic.webp',
        'npc.rescueWomanV2.cower': 'assets/images/npc/rescueWomanV2/cower.webp',
        'npc.rescueWomanV2.help': 'assets/images/npc/rescueWomanV2/help.webp',
        'npc.rescueWomanV2.relief': 'assets/images/npc/rescueWomanV2/relief.webp',
        'npc.rescueWomanV2.run_up': 'assets/images/npc/rescueWomanV2/run_up.webp',
        'props.helicopter.frame0': 'assets/images/props/helicopter/frame0.webp',
        'props.helicopter.frame1': 'assets/images/props/helicopter/frame1.webp',
        'props.helicopter.frame2': 'assets/images/props/helicopter/frame2.webp',
        'props.helicopter.frame3': 'assets/images/props/helicopter/frame3.webp',
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
            this.rampageUntil = 0;
            this.rampageKills = 0;
            this.rampageWaveNextAt = 0;
            this.mysterySpawnedLevels = new Set();
            this.mysteryLifeLevels = new Set();
            this.helicopterDeployments = 0;
            this.lastHelicopterLevel = 0;
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
            this.carnageActive = false;
            this.carnageSource = 'none';
            this.carnageFlashUntil = 0;
            this.carnageTitleStart = 0;
            this.carnageTitleUntil = 0;
            this.carnageNextWaveAt = 0;
            this.carnageNextLaughAt = 0;
            this.carnageEnteredAt = 0;
            this.carnageSerial = 0;
            this.pendingBossVariant = null;
            this.yellowApparitionShown = false;
            this.yellowApparitionStart = 0;
            this.yellowApparitionUntil = 0;
            this.rescueNpc = null;
            this.rescueSpawnedSerial = 0;
            this.rescuePendingAt = 0;
            this.rescuesCompleted = 0;
            this.rescuesFailed = 0;
            this.rescueAlertUntil = 0;
            this.werewolfScareStart = 0;
            this.werewolfScareUntil = 0;
            this.werewolfScareSoundedLevel = 0;
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
            this.rampageUntil = 0;
            this.rampageKills = 0;
            this.rampageWaveNextAt = 0;
            this.mysterySpawnedLevels = new Set();
            this.mysteryLifeLevels = new Set([Math.random()<.5?7:14, Math.random()<.5?21:28, Math.random()<.5?35:42]);
            this.helicopterDeployments = 0;
            this.lastHelicopterLevel = 0;
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
            this.carnageActive = false;
            this.carnageSource = 'none';
            this.carnageFlashUntil = 0;
            this.carnageTitleStart = 0;
            this.carnageTitleUntil = 0;
            this.carnageNextWaveAt = 0;
            this.carnageNextLaughAt = 0;
            this.carnageEnteredAt = 0;
            this.carnageSerial = 0;
            this.pendingBossVariant = null;
            this.yellowApparitionShown = false;
            this.yellowApparitionStart = 0;
            this.yellowApparitionUntil = 0;
            this.rescueNpc = null;
            this.rescueSpawnedSerial = 0;
            this.rescuePendingAt = 0;
            this.rescuesCompleted = 0;
            this.rescuesFailed = 0;
            this.rescueAlertUntil = 0;
            this.werewolfScareStart = 0;
            this.werewolfScareUntil = 0;
            this.werewolfScareSoundedLevel = 0;
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
                down: 'revive_alarm.wav', revive: 'revive_success.wav', boss: 'boss_roar.wav', nocturnus: 'nocturnus.wav', rage: 'rage.wav', level: 'level.wav', gameover: 'gameover.wav', victory: 'victory.wav', laugh: 'thriller_laugh.ogg', scream: 'grito.ogg', thunder: 'thunder_carnage.ogg'
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
                this.gameplayMusic.currentTime = 45;
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
            try { window.dispatchEvent(new CustomEvent('mzv-audio-cue', { detail: { name } })); } catch { }
            const p = this.pools.get(name);
            if (!p)
                return;
            const i = this.cursor.get(name) ?? 0;
            const a = p[i % p.length];
            this.cursor.set(name, i + 1);
            try {
                a.pause();
                a.currentTime = 0;
                a.playbackRate = 1;
                a.volume = Math.max(0, Math.min(1, vol));
                void a.play().catch(() => { });
            }
            catch { }
        }
        playVariant(name, vol = .45, rate = 1) {
            if (!this.enabled)
                return;
            try { window.dispatchEvent(new CustomEvent('mzv-audio-cue', { detail: { name } })); } catch { }
            const p = this.pools.get(name);
            if (!p)
                return;
            const i = this.cursor.get(name) ?? 0;
            const a = p[i % p.length];
            this.cursor.set(name, i + 1);
            try {
                a.pause();
                a.currentTime = 0;
                a.playbackRate = Math.max(.82, Math.min(1.18, rate));
                a.volume = Math.max(0, Math.min(1, vol));
                void a.play().catch(() => { });
            }
            catch { }
        }
        seekGameplay(seconds) {
            try {
                const max = Number.isFinite(this.gameplayMusic.duration) && this.gameplayMusic.duration > .2 ? this.gameplayMusic.duration - .08 : MZV.MUSIC.duration - .08;
                this.gameplayMusic.currentTime = Math.max(0, Math.min(max, seconds));
                if (this.enabled && this.musicMode === 'gameplay' && this.gameplayMusic.paused)
                    void this.gameplayMusic.play().catch(() => { });
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
        constructor(input, state) {
            this.input = input;
            this.state = state;
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
                const rampageSpeed = this.state && this.state.elapsed < this.state.rampageUntil ? 1.18 : 1;
                p.x = MZV.clamp(p.x + x * p.speed * rampageSpeed * dt, 24, MZV.WORLD.width - 24);
                p.y = MZV.clamp(p.y + y * p.speed * rampageSpeed * dt, 24, MZV.WORLD.height - 24);
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
            s.pendingBossVariant = null;
            if (s.mission === 'thriller' && [9,23,37,47].includes(s.level)) {
                s.werewolfScareStart = s.elapsed + MZV.rand(1.5, 2.8);
                s.werewolfScareUntil = s.werewolfScareStart + 2.35;
                s.werewolfScareSoundedLevel = 0;
            }
            if (s.mission === 'thriller' && s.level === 5 && !s.yellowApparitionShown) {
                s.yellowApparitionShown = true;
                s.yellowApparitionStart = s.elapsed + .45;
                s.yellowApparitionUntil = s.yellowApparitionStart + 3.35;
                s.lightningAlpha = Math.max(s.lightningAlpha || 0, .72);
                this.audio.playVariant('laugh', .74, MZV.rand(.95, 1.04));
                this.notify('👁 YELLOW THRILLER · ALGO ATRAVESSOU A RUA...');
            }
            if (s.level === MZV.RULES.finalBossLevel) {
                s.pendingBoss = 'nocturnus';
                s.pendingBossSince = s.elapsed;
                this.notify(s.mission === 'thriller' ? `🕺 NÍVEL ${s.level} · THRILLER BOSS FINAL A APROXIMAR-SE · aguarda o próximo PEAK` : `🧛 NÍVEL ${s.level} · LORD NOCTURNUS A APROXIMAR-SE · aguarda o próximo PEAK`);
            }
            else if (s.mission === 'thriller' && s.level === 13) {
                s.pendingBoss = 'vampire';
                s.pendingBossVariant = 'shadowDancer';
                s.pendingBossSince = s.elapsed;
                this.notify('🌑 NÍVEL 13 · SHADOW DANCER DETECTADO · prepara-te para CARNAGE');
            }
            else if (s.mission === 'thriller' && s.level === 15) {
                s.pendingBoss = 'powerBoss';
                s.pendingBossVariant = 'yellowThriller';
                s.pendingBossSince = s.elapsed;
                this.notify('⚡ NÍVEL 15 · YELLOW THRILLER · FIRST FORM A APROXIMAR-SE');
            }
            else if (s.mission === 'thriller' && s.level === 40) {
                s.pendingBoss = 'powerBoss';
                s.pendingBossVariant = 'blackYellowThriller';
                s.pendingBossSince = s.elapsed;
                this.notify('🟨⬛ NÍVEL 40 · BLACK/YELLOW THRILLER · FORMA INTERMÉDIA');
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
            // Helicopter pity system: primeiro apoio garantido até ao nível 12; depois não deixa passar 12 níveis sem nova entrada.
            if (MZV.SETTINGS.current.specialLoot.helicopter && ((s.level === 12 && (s.helicopterDeployments || 0) === 0) || ((s.helicopterDeployments || 0) > 0 && s.level - (s.lastHelicopterLevel || 0) >= 12))) {
                if (s.pendingHelicopter <= 0 && !s.helicopters.length) {
                    s.pendingHelicopter = 1;
                    this.notify('🚁 AIR SUPPORT READY · GARANTIDO · entra no próximo DROP/PEAK');
                }
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
                if (s.pendingBoss) {
                    const label = s.pendingBossVariant === 'shadowDancer' ? 'SHADOW DANCER' : s.pendingBossVariant === 'yellowThriller' ? 'YELLOW THRILLER' : s.pendingBossVariant === 'blackYellowThriller' ? 'BLACK/YELLOW THRILLER' : s.mission === 'thriller' ? 'THRILLER BOSS' : (s.pendingBoss === 'nocturnus' ? 'LORD NOCTURNUS' : 'POWER BOSS');
                    this.notify(`⚠ ${label} · aproximação detectada`);
                }
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
            const s = this.state, type = s.pendingBoss, variant = s.pendingBossVariant;
            if (!type)
                return;
            s.pendingBoss = null;
            s.pendingBossVariant = null;
            s.pendingBossSince = 0;
            if (variant === 'shadowDancer') {
                const z = new MZV.Enemy('vampire', MZV.WORLD.width / 2, 240, s.level, true, s.mode === 'single');
                z.variant = 'shadowDancer'; z.isBoss = true; z.bossName = 'SHADOW DANCER';
                z.lives = 4; z.maxLives = 4;
                z.maxHp = (s.mode === 'single' ? 780 : 980); z.hp = z.maxHp;
                z.baseSpeed = 145; z.speed = 145; z.damage = 22; z.radius = 34;
                z.dashCooldown = .55; z.teleportCooldown = 2.6; z.summonCooldown = 5.8;
                s.enemies.push(z); s.airstrikeCharges++;
                this.audio.playVariant('laugh', .62, 1.07); this.audio.play('boss', .58);
                this.notify('🌑 SHADOW DANCER · 4 VIDAS · DASH + SOMBRAS · CARNAGE');
                return;
            }
            if (variant === 'yellowThriller') {
                const z = new MZV.Enemy('powerBoss', MZV.WORLD.width / 2, 240, s.level, true, s.mode === 'single');
                z.variant = 'yellowThriller'; z.isBoss = true; z.bossName = 'YELLOW THRILLER';
                z.lives = 4; z.maxLives = 4;
                z.maxHp = s.mode === 'single' ? 950 : 1220; z.hp = z.maxHp;
                z.baseSpeed = 112; z.speed = 112; z.damage = 27; z.radius = 45;
                z.dashCooldown = 1.0; z.summonCooldown = 5.2;
                s.enemies.push(z); s.airstrikeCharges++;
                this.audio.playVariant('laugh', .82, .98); this.audio.play('boss', .64);
                this.notify('🟡 YELLOW THRILLER · FIRST FORM · 4 VIDAS · CARNAGE');
                return;
            }
            if (variant === 'blackYellowThriller') {
                const z = new MZV.Enemy('powerBoss', MZV.WORLD.width / 2, 235, s.level, true, s.mode === 'single');
                z.variant = 'blackYellowThriller'; z.form = 'blackYellow'; z.isBoss = true; z.bossName = 'BLACK/YELLOW THRILLER';
                z.lives = 7; z.maxLives = 7;
                z.maxHp = s.mode === 'single' ? 1350 : 1750; z.hp = z.maxHp;
                z.baseSpeed = 124; z.speed = 124; z.damage = 31; z.radius = 46;
                z.dashCooldown = .75; z.teleportCooldown = 2.3; z.summonCooldown = 4.5; z.specialCooldown = 1.8;
                s.enemies.push(z); s.airstrikeCharges += 2;
                this.audio.playVariant('laugh', .86, .94); this.audio.play('boss', .68);
                this.notify('🟨⬛ BLACK/YELLOW THRILLER · 7 VIDAS · BLACKOUT STEP + SUMMONS');
                return;
            }
            if (type === 'nocturnus') {
                if (s.mission !== 'thriller') this.spawn('powerBoss');
                const z = new MZV.Enemy('nocturnus', MZV.WORLD.width / 2, 220, s.level, true, s.mode === 'single');
                s.enemies.push(z);
                s.airstrikeCharges += 2;
                if (s.mission === 'thriller') {
                    z.variant = 'thrillerFinal'; z.form = 'red'; z.isBoss = true; z.bossName = 'THRILLER BOSS';
                    z.lives = 10; z.maxLives = 10;
                    z.maxHp = s.mode === 'single' ? 1850 : 2400; z.hp = z.maxHp;
                    z.baseSpeed = 108; z.speed = 108; z.damage = 32; z.radius = 48;
                    z.teleportCooldown = 4.2; z.summonCooldown = 5.2; z.specialCooldown = 1.6;
                    this.audio.play('laugh', .82); this.audio.play('boss', .72);
                    this.notify('🔴 THRILLER BOSS · 10 VIDAS · RED FORM · CARNAGE FINAL');
                } else {
                    this.audio.play('nocturnus', .72);
                    this.notify('🧛 LORD NOCTURNUS · ENTRADA SINCRONIZADA NO PEAK');
                }
            }
            else {
                const before = s.enemies.length;
                this.spawn('powerBoss');
                const z = s.enemies.slice(before).find(q => q.type === 'powerBoss');
                if (z && s.mission === 'thriller') {
                    // O primeiro boss da Thriller já deve ser uma parede real, mesmo em CARNAGE.
                    z.maxHp *= s.level === 10 ? 1.85 : 1.35; z.hp = z.maxHp;
                    z.baseSpeed *= s.level === 10 ? 1.12 : 1.06; z.speed = z.baseSpeed;
                    z.damage *= s.level === 10 ? 1.18 : 1.10;
                    z.bossName = s.level === 10 ? 'GRAVEDIGGER BRUTE' : 'THRILLER BRUTE';
                }
                this.audio.play('boss', .68);
                this.notify(s.mission === 'thriller' && s.level === 10 ? '⚰ GRAVEDIGGER BRUTE · 7 VIDAS · PRIMEIRO TESTE A SÉRIO' : '💪 POWER BOSS · 7 VIDAS · ENTRADA NO BEAT');
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
        start(duration = MZV.RULES.rageSeconds, source = 'level') {
            if (source === 'level') {
                this.s.lastRageLevel = this.s.level;
                this.s.pendingRageLevel = 0;
            }
            this.s.rageUntil = Math.max(this.s.rageUntil, this.s.elapsed + duration);
            this.s.combo = 0;
            this.s.comboUntil = 0;
            this.s.rageKills = 0;
            const scaledBase = MZV.levelBaseCount(this.s.level) * (this.s.mode === 'single' ? MZV.RULES.singleEnemyScale : 1);
            const bonus = this.s.mode === 'single' ? MZV.RULES.rageSingleEnemyBonus : MZV.RULES.rageTwoEnemyBonus;
            const waveCount = source === 'crate' ? 3 : MZV.RULES.rageWaveCount;
            const extra = Math.max(waveCount, Math.ceil(scaledBase * bonus * (source === 'crate' ? .72 : 1)));
            this.s.rageWaveSize = Math.max(1, Math.ceil(extra / waveCount));
            this.s.rageWavesRemaining = waveCount;
            this.s.rageWaveNextAt = this.s.elapsed + (source === 'crate' ? 18 : 28);
            if (!this.s.reinforcement) this.spawnReinforcement();
            this.audio.play('rage', .72);
            const who = this.s.reinforcement?.name ?? 'ALIADO';
            this.notify(source === 'crate' ? `❓⚡ MYSTERY: MODO RAIVA · ${duration}s · ${who.toUpperCase()} · SCORE ×2` : `⚡ MODO RAIVA · NÍVEL ${this.s.level} · ${who.toUpperCase()} REINFORCEMENT · SCORE ×2 · NO DROP`);
            this.releaseWave();
        }
        startFromCrate() {
            if (this.isActive()) { this.startRampage(); return 'rampage'; }
            this.start(MZV.RULES.crateRageSeconds, 'crate');
            return 'rage';
        }
        startRampage() {
            const duration = MZV.RULES.rampageSeconds;
            this.start(duration, 'crate');
            this.s.rampageUntil = this.s.elapsed + duration;
            this.s.rampageKills = 0;
            this.s.rampageWaveNextAt = this.s.elapsed + 2.2;
            this.audio.playVariant('laugh', .88, .94);
            this.notify(`❓🔥 RAMPAGE! · ${duration}s · 4 ARMAS · SCORE ×3 · A HORDA RESPONDE`);
            return 'rampage';
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
            if (s.rampageUntil > s.elapsed && s.elapsed >= s.rampageWaveNextAt) {
                const cap = s.mode === 'single' ? 145 : 190;
                if (s.enemies.filter(z=>z.alive).length < cap) this.spawnWave(Math.max(5, Math.min(18, Math.ceil(5 + s.level * .28))));
                s.rampageWaveNextAt = s.elapsed + MZV.rand(4.2, 6.3);
            }
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
                s.rampageUntil = 0;
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
            if (this.s.carnageActive) {
                this.s.musicTime = this.audio.gameplayPosition();
                this.s.musicCue = 'THRILLER PEAK';
                this.s.musicIntensity = 'PEAK';
                this.lastSongTime = this.s.musicTime;
                return;
            }
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
            const loopStart = 45;
            const loopSpan = MZV.MUSIC.duration - loopStart;
            let loop = 0, songTime = absolute;
            if (absolute >= MZV.MUSIC.duration) {
                const afterFirst = absolute - MZV.MUSIC.duration;
                loop = 1 + Math.floor(afterFirst / loopSpan);
                songTime = loopStart + (afterFirst % loopSpan);
            }
            if (loop > this.s.musicLoop) {
                for (let l = this.s.musicLoop + 1; l <= loop; l++) {
                    this.s.musicLoop = l;
                    this.audio.restartGameplayLoop();
                    this.notify(`🎵 SURVIVAL LOOP ${l + 1} · intro saltada · inimigos +${Math.round(l * MZV.MUSIC.loopDifficultyStep * 100)}% resistência`);
                }
                // Não disparamos cues da intro 0:00–0:45 quando o loop recomeça.
                this.lastSongTime = loopStart;
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
        syncExternalSeek(songTime) {
            this.lastSongTime = songTime;
            this.s.musicTime = songTime;
            this.s.musicCue = 'THRILLER PEAK';
            this.s.musicIntensity = 'PEAK';
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
    class CarnageSystem {
        constructor(s, audio, horde, music, notify) {
            this.s = s;
            this.audio = audio;
            this.horde = horde;
            this.music = music;
            this.notify = notify;
            this.START = 255;
            this.END = 296;
            this.nextThunderAt = 0;
        }
        bossAlive() {
            return this.s.enemies.some(z => z.alive && (z.isBoss || z.type === 'powerBoss' || z.type === 'nocturnus'));
        }
        normalTimeline() {
            const loopStart = 45, duration = MZV.MUSIC.duration, span = duration - loopStart, elapsed = this.s.elapsed;
            if (elapsed < duration)
                return elapsed;
            return loopStart + ((elapsed - duration) % span);
        }
        timelineInCarnage() {
            const t = this.normalTimeline();
            return t >= this.START && t < this.END;
        }
        audioInCarnage() {
            const t = this.audio.gameplayPosition();
            return t >= this.START && t < this.END;
        }
        triggerPresentation() {
            const s = this.s;
            s.carnageFlashUntil = s.elapsed + .14;
            s.carnageTitleStart = s.elapsed + .14;
            s.carnageTitleUntil = s.carnageTitleStart + 1.55;
        }
        start(source, seekToStart) {
            const s = this.s;
            if (s.carnageActive) {
                if (source === 'boss')
                    s.carnageSource = 'boss';
                return;
            }
            s.carnageActive = true;
            s.carnageSource = source;
            s.carnageEnteredAt = s.elapsed;
            s.carnageSerial = (s.carnageSerial || 0) + 1;
            if (s.carnageSerial === 1 && (s.rescuesCompleted || 0) === 0 && (s.rescuesFailed || 0) === 0) s.rescuePendingAt = s.elapsed + .75;
            s.carnageNextWaveAt = s.elapsed + .85;
            s.carnageNextLaughAt = s.elapsed + MZV.rand(6.5, 10.5);
            this.nextThunderAt = s.elapsed + MZV.rand(5.5, 9.5);
            this.triggerPresentation();
            this.audio.playVariant('thunder', .72, MZV.rand(.96, 1.04));
            if (source === 'boss')
                this.audio.playVariant('laugh', .68, MZV.rand(.94, 1.06));
            if (seekToStart) {
                this.audio.seekGameplay(this.START);
                this.music.syncExternalSeek(this.START);
            }
        }
        end(seekToTimeline = false) {
            const s = this.s;
            if (!s.carnageActive)
                return;
            s.carnageActive = false;
            s.carnageSource = 'none';
            const timeline = this.normalTimeline();
            if (seekToTimeline)
                this.audio.seekGameplay(timeline);
            this.music.syncExternalSeek(timeline);
        }
        spawnWave() {
            const s = this.s;
            if (s.enemies.length > (s.mode === 'single' ? 85 : 115))
                return;
            let count = (s.mode === 'single' ? 4 : 6) + Math.min(4, Math.floor(s.level / 12));
            if (s.level < 8)
                count = Math.max(3, count - 2);
            for (let i = 0; i < count; i++) {
                const r = Math.random();
                let type = 'normal';
                if (s.level >= 10 && r < .10)
                    type = 'commander';
                else if (s.level >= 8 && r < .18)
                    type = 'tank';
                else if (r < .62)
                    type = 'runner';
                this.horde.spawn(type);
            }
        }
        update(dt) {
            const s = this.s;
            if (s.mission !== 'thriller') {
                if (s.carnageActive)
                    this.end(false);
                return;
            }
            const boss = this.bossAlive();
            const naturalTimeline = this.timelineInCarnage();
            const naturalAudio = this.audio.gameplayPlaying() ? this.audioInCarnage() : naturalTimeline;
            const natural = s.carnageSource === 'boss' ? naturalTimeline : naturalAudio;
            if (!s.carnageActive) {
                if (boss)
                    this.start('boss', !naturalAudio);
                else if (naturalAudio)
                    this.start('natural', false);
            }
            else if (boss && s.carnageSource !== 'boss') {
                // Se o boss entrar durante o Carnage natural, não reiniciamos a música nem a apresentação.
                s.carnageSource = 'boss';
            }
            if (!s.carnageActive)
                return;
            if (s.carnageSource === 'boss') {
                const pos = this.audio.gameplayPosition();
                if (pos >= this.END - .10) {
                    this.audio.seekGameplay(this.START);
                    this.music.syncExternalSeek(this.START);
                }
                if (!boss) {
                    if (natural) {
                        s.carnageSource = 'natural';
                        const timeline = this.normalTimeline();
                        this.audio.seekGameplay(timeline);
                        this.music.syncExternalSeek(timeline);
                    }
                    else {
                        this.end(true);
                        return;
                    }
                }
            }
            else if (!natural) {
                this.end(false);
                return;
            }
            if (s.elapsed >= s.carnageNextWaveAt) {
                this.spawnWave();
                s.carnageNextWaveAt = s.elapsed + MZV.rand(4.2, 5.8);
            }
            if (s.elapsed >= s.carnageNextLaughAt) {
                if (Math.random() < .78)
                    this.audio.playVariant('laugh', MZV.rand(.28, .50), MZV.rand(.90, 1.10));
                s.carnageNextLaughAt = s.elapsed + MZV.rand(7.5, 13.5);
            }
            if (s.elapsed >= this.nextThunderAt) {
                if (Math.random() < .88) {
                    this.audio.playVariant('thunder', MZV.rand(.42, .68), MZV.rand(.92, 1.08));
                    s.lightningAlpha = Math.max(s.lightningAlpha || 0, .48);
                }
                this.nextThunderAt = s.elapsed + MZV.rand(7.0, 13.0);
            }
        }
    }
    MZV.CarnageSystem = CarnageSystem;
})(MZV || (MZV = {}));
var MZV;
(function (MZV) {
    class RescueSystem {
        constructor(s, audio, notify) {
            this.s=s; this.audio=audio; this.notify=notify;
            this.audioCueHandler=(e)=>{
                if(e?.detail?.name==='laugh') this.startleFromLaugh();
            };
            try { window.addEventListener('mzv-audio-cue', this.audioCueHandler); } catch { }
        }
        startleFromLaugh() {
            const s=this.s,n=s.rescueNpc;
            if(!n||!n.active)return;
            n.scaredUntil=Math.max(n.scaredUntil||0,s.elapsed+1.25);
            n.panicPoseUntil=Math.max(n.panicPoseUntil||0,s.elapsed+.32);
            n.state='panic';
            let nearest=null,best=1e9;
            for(const z of s.enemies){
                if(!z.alive)continue;
                const d=Math.hypot(z.x-n.x,z.y-n.y);
                if(d<best){best=d;nearest=z;}
            }
            if(nearest){
                const dx=n.x-nearest.x,dy=n.y-nearest.y,d=Math.hypot(dx,dy)||1;
                n.panicX=dx/d;n.panicY=dy/d;
            }else{
                const a=MZV.rand(0,Math.PI*2);n.panicX=Math.cos(a);n.panicY=Math.sin(a);
            }
            // A gargalhada assusta-a sempre; o grito tem cooldown para não se tornar ruído contínuo.
            if(s.elapsed >= (n.nextScreamAt||0)){
                n.nextScreamAt=s.elapsed+3.4;
                this.audio.playVariant('scream', .52, MZV.rand(.96,1.05));
            }
        }
        scheduleIfNeeded() {
            const s=this.s;
            if (s.mission!=='thriller' || !s.carnageActive) return;
            if ((s.rescueSpawnedSerial||0) >= (s.carnageSerial||0)) return;
            const first=(s.carnageSerial||0)===1 && (s.rescuesCompleted||0)===0 && (s.rescuesFailed||0)===0;
            if (!s.rescuePendingAt) s.rescuePendingAt=s.elapsed+(first?.75:2.3);
            if (s.elapsed < s.rescuePendingAt) return;
            s.rescueSpawnedSerial=s.carnageSerial; s.rescuePendingAt=0;
            const alive=s.players.filter(p=>p.alive&&!p.out), base=alive[0]||s.players[0];
            if(!base)return;
            const ang=MZV.rand(0,Math.PI*2), dist=first?MZV.rand(145,195):MZV.rand(190,260);
            const x=MZV.clamp(base.x+Math.cos(ang)*dist,120,MZV.WORLD.width-120), y=MZV.clamp(base.y+Math.sin(ang)*dist,120,MZV.WORLD.height-120);
            s.rescueNpc={
                x,y,hp:100,maxHp:100,progress:0,required:4.1,active:true,direction:'down',
                vx:0,vy:0,state:'flee',spawnedAt:s.elapsed,timeoutAt:s.elapsed+42,
                scaredUntil:0,panicPoseUntil:0,nextScreamAt:s.elapsed+.4,
                panicX:0,panicY:0,seed:Math.random()*99
            };
            // Cerco inicial: ela já entra a fugir, em vez de esperar parada.
            for(let i=0;i<8;i++){
                const a=i/8*Math.PI*2+MZV.rand(-.20,.20), dd=MZV.rand(115,195), type=i<4?'runner':'normal';
                s.enemies.push(new MZV.Enemy(type,MZV.clamp(x+Math.cos(a)*dd,30,MZV.WORLD.width-30),MZV.clamp(y+Math.sin(a)*dd,30,MZV.WORLD.height-30),s.level,true,s.mode==='single'));
            }
            s.rescueAlertUntil=s.elapsed+2.2;
            this.audio.play('down', .38);
            this.notify('🆘 SOBREVIVENTE EM FUGA · ABRE CAMINHO E PROTEGE-A!');
        }
        fail(reason='PERDESTE-A') {
            const s=this.s,n=s.rescueNpc;if(!n||!n.active)return;
            n.active=false; s.rescuesFailed=(s.rescuesFailed||0)+1;
            this.notify(`💀 RESGATE FALHADO · ${reason}`);
        }
        complete() {
            const s=this.s,n=s.rescueNpc;if(!n||!n.active)return;
            n.active=false; n.savedUntil=s.elapsed+1.55; n.state='relief'; s.rescuesCompleted=(s.rescuesCompleted||0)+1; s.score+=750; s.airstrikeCharges++;
            s.pickups.push(new MZV.Pickup('medkit',n.x+34,n.y,24));
            this.audio.play('revive',.62); this.notify('✅ RESGATE COMPLETO · +750 SCORE · AIRSTRIKE +1');
        }
        update(dt) {
            const s=this.s; this.scheduleIfNeeded(); const n=s.rescueNpc;
            if(!n||!n.active)return;
            if(s.elapsed>=n.timeoutAt){this.fail('TEMPO ESGOTADO');return;}

            const players=s.players.filter(p=>p.alive&&!p.out); let nearest=null,best=1e9;
            for(const p of players){const d=Math.hypot(p.x-n.x,p.y-n.y);if(d<best){best=d;nearest=p;}}

            let fx=0,fy=0,danger=0,closeDanger=0,nearestThreat=1e9;
            for(const z of s.enemies){
                if(!z.alive)continue;
                const dx=n.x-z.x,dy=n.y-z.y,d=Math.hypot(dx,dy)||1;
                if(d<440){
                    danger++;
                    nearestThreat=Math.min(nearestThreat,d);
                    const q=(440-d)/440;
                    const elite=(z.type==='nocturnus'||z.type==='powerBoss'||z.type==='tank')?1.65:(z.type==='runner'?1.18:1);
                    const w=q*q*elite;
                    fx+=dx/d*w;fy+=dy/d*w;
                }
                if(d<88)closeDanger++;
            }

            // Procura o jogador como "zona segura", mas nunca atravessa uma horda para chegar a ele.
            if(nearest){
                const dx=nearest.x-n.x,dy=nearest.y-n.y,d=Math.hypot(dx,dy)||1;
                const pull=danger===0?.90:danger<=4?.46:.18;
                fx+=dx/d*pull;fy+=dy/d*pull;
            }

            // A gargalhada provoca um arranque brusco de pânico.
            const scared=s.elapsed<(n.scaredUntil||0);
            if(scared){
                fx+=(n.panicX||0)*1.15;fy+=(n.panicY||0)*1.15;
            }

            // Mantém-se dentro do mapa e evita ficar prensada nos limites.
            const margin=145;
            if(n.x<margin)fx+=(margin-n.x)/margin*1.8;
            if(n.x>MZV.WORLD.width-margin)fx-=(n.x-(MZV.WORLD.width-margin))/margin*1.8;
            if(n.y<margin)fy+=(margin-n.y)/margin*1.8;
            if(n.y>MZV.WORLD.height-margin)fy-=(n.y-(MZV.WORLD.height-margin))/margin*1.8;

            let mag=Math.hypot(fx,fy);
            if(mag<.08){
                const a=s.elapsed*.85+n.seed;fx=Math.cos(a)*.18;fy=Math.sin(a)*.18;mag=Math.hypot(fx,fy);
            }
            fx/=mag||1;fy/=mag||1;

            let speed=danger?156:112;
            if(closeDanger>=2)speed=186;
            if(scared)speed=205;
            if(best<100&&danger<=2&&!scared)speed=72;
            const dvx=fx*speed,dvy=fy*speed;
            const steer=Math.min(1,dt*(scared?8.5:5.5));
            n.vx+=(dvx-n.vx)*steer;n.vy+=(dvy-n.vy)*steer;
            n.x=MZV.clamp(n.x+n.vx*dt,58,MZV.WORLD.width-58);
            n.y=MZV.clamp(n.y+n.vy*dt,58,MZV.WORLD.height-58);

            const vm=Math.hypot(n.vx,n.vy);
            if(vm>12){
                if(Math.abs(n.vx)>Math.abs(n.vy))n.direction=n.vx<0?'left':'right';
                else n.direction=n.vy<0?'up':'down';
            }
            if(s.elapsed<(n.panicPoseUntil||0))n.state='panic';
            else if(vm>32)n.state='run';
            else if(closeDanger>=3&&nearestThreat<72)n.state='cower';
            else if(best<125&&danger<=2)n.state='help';
            else n.state='idle';

            if(closeDanger>0)n.hp-=Math.min(20,2.9+closeDanger*2.05)*dt;
            if(n.hp<=0){n.hp=0;this.fail('FOI ALCANÇADA');return;}

            // O resgate progride quando o jogador consegue acompanhá-la e baixar a pressão da horda.
            if(best<118){
                const rate=danger<=1?1.45:danger<=3?.88:danger<=5?.42:.12;
                n.progress=Math.min(n.required,n.progress+dt*rate);
            } else n.progress=Math.max(0,n.progress-dt*.11);

            if(n.progress>=n.required)this.complete();
            if(!s.carnageActive && s.elapsed-n.spawnedAt>5 && n.active)this.fail('CARNAGE TERMINOU');
        }
    }
    MZV.RescueSystem=RescueSystem;
})(MZV || (MZV = {}));
var MZV;
(function (MZV) {
    class CombatSystem {
        constructor(s, audio, notify) {
            this.s = s;
            this.audio = audio;
            this.notify = notify;
            this.rageDamage = () => { };
            this.collisionCellSize = 96;
            this.enemyCollisionGrid = new Map();
        }
        collisionKey(cx, cy) { return `${cx},${cy}`; }
        buildEnemyCollisionGrid() {
            this.enemyCollisionGrid.clear();
            const cs = this.collisionCellSize;
            for (const z of this.s.enemies) {
                if (!z.alive) continue;
                const key = this.collisionKey(Math.floor(z.x / cs), Math.floor(z.y / cs));
                const bucket = this.enemyCollisionGrid.get(key);
                if (bucket) bucket.push(z); else this.enemyCollisionGrid.set(key, [z]);
            }
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
            const rampage = this.s.elapsed < this.s.rampageUntil;
            const rate = w.fireRate * (overdrive ? 1.35 : 1) * (rampage ? 1.65 : 1);
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
                    const speed = w.speed * (overdrive ? 1.2 : 1) * (rampage ? 1.12 : 1);
                    const projW = { ...w, damage: w.damage * (overdrive ? 1.10 : 1) * (rampage ? 1.15 : 1), speed };
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
            this.buildEnemyCollisionGrid();
            const cs = this.collisionCellSize;
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
                const gcx = Math.floor(b.x / cs), gcy = Math.floor(b.y / cs);
                projectileCells:
                for (let oy = -1; oy <= 1; oy++) {
                    for (let ox = -1; ox <= 1; ox++) {
                        const bucket = this.enemyCollisionGrid.get(this.collisionKey(gcx + ox, gcy + oy));
                        if (!bucket) continue;
                        for (const z of bucket) {
                            if (!z.alive) continue;
                            const dx = b.x - z.x, dy = b.y - z.y, rr = b.radius + z.radius;
                            if (dx * dx + dy * dy <= rr * rr) {
                                if (b.explosive)
                                    this.explode(b.x, b.y, b.explosionRadius, b.explosionDamage, '#ffad4e', b.source);
                                else
                                    this.damageEnemy(z, b.damage, b.source, b.vx, b.vy, b.kind);
                                b.penetration--;
                                if (b.penetration <= 0) b.dead = true;
                                if (b.dead) break projectileCells;
                            }
                        }
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
            if (z.isBoss && z.lives > 1) {
                z.lives--;
                z.phase = z.maxLives - z.lives + 1;
                if (z.variant === 'thrillerFinal') {
                    const prev = z.form;
                    z.form = z.lives >= 8 ? 'red' : z.lives >= 5 ? 'blackYellow' : z.lives >= 2 ? 'dual' : 'werewolf';
                    if (z.form !== prev) {
                        this.s.lightningAlpha = 1;
                        z.specialCooldown = .65;
                        if (z.form === 'blackYellow') {
                            z.baseSpeed *= 1.10; z.damage *= 1.08;
                            this.audio.playVariant('laugh', .92, .93);
                            this.notify('🟨⬛ BLACK/YELLOW FORM · MAIS RÁPIDO · BLACKOUT STEP');
                        } else if (z.form === 'dual') {
                            z.baseSpeed *= 1.10; z.damage *= 1.10;
                            this.audio.playVariant('laugh', .95, 1.05);
                            this.notify('🔴🟡 DUAL FORM · RED + BLACK/YELLOW · ATAQUES COMBINADOS');
                        } else if (z.form === 'werewolf') {
                            z.baseSpeed *= 1.22; z.damage *= 1.22; z.radius = 58;
                            this.audio.play('scream', .98); this.audio.playVariant('laugh', .96, .89);
                            this.s.carnageFlashUntil = this.s.elapsed + .18;
                            this.notify('🐺 THRILLER RAGE · WEREWOLF FORM · ÚLTIMA VIDA');
                        }
                    }
                }
                z.hp = z.maxHp;
                z.stunUntil = this.s.elapsed + .62;
                z.motionState = 'stunned';
                z.attackCooldown = .65;
                z.knockbackX *= .18;
                z.knockbackY *= .18;
                // Cada vida perdida acelera a luta e injeta pressão real, não apenas mais HP.
                z.baseSpeed *= 1.055; z.speed = z.baseSpeed; z.damage *= 1.025;
                if (this.s.mission === 'thriller') {
                    const adds = z.variant === 'shadowDancer' ? 5 : z.variant === 'yellowThriller' ? 6 : z.variant === 'blackYellowThriller' ? 8 : z.variant === 'thrillerFinal' ? (z.form === 'werewolf' ? 12 : z.form === 'dual' ? 10 : 8) : 7;
                    for (let i=0;i<adds;i++) {
                        const a=Math.random()*Math.PI*2, dist=MZV.rand(90,170);
                        const isClone=z.variant==='shadowDancer' && i<4;
                        const type = isClone ? 'runner' : (Math.random()<.58?'runner':'normal');
                        const e=new MZV.Enemy(type, MZV.clamp(z.x+Math.cos(a)*dist,30,MZV.WORLD.width-30), MZV.clamp(z.y+Math.sin(a)*dist,30,MZV.WORLD.height-30), this.s.level, true, this.s.mode==='single');
                        if(isClone){e.variant='shadowClone';e.hp=e.maxHp=Math.max(70,120+this.s.level*4);e.baseSpeed*=1.18;e.speed=e.baseSpeed;}
                        this.s.enemies.push(e);
                    }
                    this.audio.playVariant('laugh', .42, MZV.rand(.94,1.08));
                }
                this.audio.play('boss', .48);
                const name = z.bossName || (z.type === 'powerBoss' ? 'POWER BOSS' : 'BOSS');
                this.notify(`⚠ ${name} · ${z.lives}/${z.maxLives} VIDAS · FASE ${z.phase} · MAIS AGRESSIVO`);
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
            const rampage = this.s.elapsed < this.s.rampageUntil;
            if (rage) {
                this.s.combo++;
                this.s.comboUntil = this.s.elapsed + MZV.RULES.rageComboWindow;
                this.s.rageKills++;
                if (rampage) this.s.rampageKills++;
            }
            const comboBonus = rage ? 1 + Math.min(20, this.s.combo) * .05 : 1;
            const carnageMultiplier = this.s.carnageActive ? 1.5 : 1;
            const modeMultiplier = rampage ? MZV.RULES.rampageScoreMultiplier : rage ? MZV.RULES.rageScoreMultiplier : 1;
            const score = Math.round(MZV.killBaseScore(z.type) * modeMultiplier * comboBonus * carnageMultiplier);
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
            if (this.s.elapsed < (p.invulnerableUntil || 0)) return;
            if (p.shieldHp > 0 && this.s.elapsed < p.shieldUntil) {
                const q = Math.min(dmg, p.shieldHp);
                p.shieldHp -= q;
                dmg -= q;
            }
            if (dmg > 0)
                p.hp -= dmg;
            if (p.hp <= 0 && p.alive) {
                if ((p.extraLives || 0) > 0) {
                    p.extraLives--;
                    p.hp = Math.ceil(p.maxHp * .60);
                    p.alive = true; p.out = false; p.downSince = null;
                    p.invulnerableUntil = this.s.elapsed + 3.5;
                    this.s.explosions.push(new MZV.Explosion(p.x,p.y,125,'#fff4a6'));
                    this.audio.play('revive', .72);
                    this.notify(`❤️ SECOND CHANCE · ${p.name.toUpperCase()} VOLTOU · 60% HP · ${p.extraLives} VIDA(S) EXTRA`);
                    return;
                }
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
            this.s.helicopterDeployments = (this.s.helicopterDeployments || 0) + 1;
            this.s.lastHelicopterLevel = this.s.level;
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
                            h.muzzleUntil = this.s.elapsed + .055;
                            h.gunAngle = a;
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
            let best = null, bestD2 = Infinity;
            for (const q of this.s.players) {
                if (!q.alive || q.out) continue;
                const dx = q.x - z.x, dy = q.y - z.y, d2 = dx * dx + dy * dy;
                if (d2 < bestD2) { best = q; bestD2 = d2; }
            }
            const r = this.s.reinforcement;
            if (r && r.alive && r.state !== 'recovering' && r.state !== 'exiting') {
                const dx = r.x - z.x, dy = r.y - z.y, d2 = dx * dx + dy * dy;
                if (d2 < bestD2) best = r;
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
        bossSpecialKind(z) {
            if (!z.isBoss || z.variant === 'shadowClone') return null;
            if (z.variant === 'shadowDancer') return 'shadowNova';
            if (z.variant === 'yellowThriller') return 'danceShockwave';
            if (z.variant === 'blackYellowThriller') return 'blackoutStep';
            if (z.variant === 'thrillerFinal') {
                if (z.form === 'red') return 'redShockwave';
                if (z.form === 'blackYellow') return 'blackoutStep';
                if (z.form === 'dual') return (z.specialCycle++ % 2) ? 'blackoutStep' : 'redShockwave';
                if (z.form === 'werewolf') return 'werewolfPounce';
            }
            if (z.bossName === 'GRAVEDIGGER BRUTE') return 'graveSlam';
            if (z.type === 'powerBoss' && this.s.mission === 'thriller') return 'bruteRush';
            return null;
        }
        startBossSpecial(z, t, d) {
            if (!z.isBoss || z.specialAttack || z.specialCooldown > 0 || z.motionState !== 'move') return false;
            if (d < 70 || d > 560) return false;
            const kind = this.bossSpecialKind(z); if (!kind) return false;
            z.specialAttack = kind; z.specialDidHit = false; z.specialStartedAt = this.s.elapsed;
            z.specialTargetX = t.x; z.specialTargetY = t.y; z.vx = 0; z.vy = 0;
            const timings = {
                graveSlam:[.78,1.18], danceShockwave:[.66,1.05], redShockwave:[.58,.98],
                shadowNova:[.48,.90], blackoutStep:[.54,.92], werewolfPounce:[.62,1.03], bruteRush:[.52,.94]
            };
            const tm=timings[kind]||[.6,1.0]; z.specialHitAt=this.s.elapsed+tm[0]; z.specialEndAt=this.s.elapsed+tm[1];
            const labels={graveSlam:'⚰ GRAVE SLAM',danceShockwave:'🟡 DANCE SHOCKWAVE',redShockwave:'🔴 RED SHOCKWAVE',shadowNova:'🌑 SHADOW NOVA',blackoutStep:'⬛ BLACKOUT STEP',werewolfPounce:'🐺 WEREWOLF POUNCE',bruteRush:'💥 BRUTE RUSH'};
            this.notify(`${labels[kind]||'⚠ SPECIAL'} · ESQUIVA!`);
            return true;
        }
        damagePlayersInRadius(x,y,r,dmg) {
            for (const p of this.s.players) if (p.alive && !p.out && Math.hypot(p.x-x,p.y-y)<=r+p.radius) this.hitTarget(p,dmg);
            const rr=this.s.reinforcement; if(rr&&rr.alive&&rr.state!=='recovering'&&Math.hypot(rr.x-x,rr.y-y)<=r+rr.radius)this.hitTarget(rr,dmg*.75);
        }
        spawnBossAdds(z,count,fast=false) {
            for(let i=0;i<count;i++){
                const a=Math.PI*2*i/count+MZV.rand(-.18,.18),dist=MZV.rand(95,180);
                const e=new MZV.Enemy(fast||Math.random()<.58?'runner':'normal',MZV.clamp(z.x+Math.cos(a)*dist,30,MZV.WORLD.width-30),MZV.clamp(z.y+Math.sin(a)*dist,30,MZV.WORLD.height-30),this.s.level,true,this.s.mode==='single');
                if(z.variant==='shadowDancer'){e.variant='shadowClone';e.hp=e.maxHp=Math.max(80,120+this.s.level*4);e.baseSpeed*=1.2;e.speed=e.baseSpeed;}
                this.s.enemies.push(e);
            }
        }
        updateBossSpecial(z) {
            if (!z.specialAttack) return false;
            const kind=z.specialAttack, now=this.s.elapsed;
            if (!z.specialDidHit && now>=z.specialHitAt) {
                z.specialDidHit=true;
                if(kind==='graveSlam'){
                    this.damagePlayersInRadius(z.x,z.y,210,z.damage*1.25); this.spawnBossAdds(z,4,false); this.s.lightningAlpha=Math.max(this.s.lightningAlpha||0,.35);
                } else if(kind==='danceShockwave'){
                    this.damagePlayersInRadius(z.x,z.y,225,z.damage*1.05); this.spawnBossAdds(z,4,true);
                } else if(kind==='redShockwave'){
                    this.damagePlayersInRadius(z.x,z.y,250,z.damage*1.20); this.spawnBossAdds(z,z.variant==='thrillerFinal'?6:4,true); this.s.lightningAlpha=Math.max(this.s.lightningAlpha||0,.5);
                } else if(kind==='shadowNova'){
                    this.spawnBossAdds(z,6,true); const t=this.targetFor(z); if(t){z.x=MZV.clamp(t.x+MZV.rand(-190,190),50,MZV.WORLD.width-50);z.y=MZV.clamp(t.y+MZV.rand(-190,190),50,MZV.WORLD.height-50);} this.damagePlayersInRadius(z.x,z.y,145,z.damage*.9);
                } else if(kind==='blackoutStep'){
                    const t=this.targetFor(z); if(t){const ang=Math.atan2(t.y-z.y,t.x-z.x);z.x=MZV.clamp(t.x-Math.cos(ang)*95,50,MZV.WORLD.width-50);z.y=MZV.clamp(t.y-Math.sin(ang)*95,50,MZV.WORLD.height-50);} this.damagePlayersInRadius(z.x,z.y,135,z.damage*1.15); this.spawnBossAdds(z,5,true); this.s.lightningAlpha=Math.max(this.s.lightningAlpha||0,.7);
                } else if(kind==='werewolfPounce'){
                    z.x=MZV.clamp(z.specialTargetX,55,MZV.WORLD.width-55);z.y=MZV.clamp(z.specialTargetY,55,MZV.WORLD.height-55);this.damagePlayersInRadius(z.x,z.y,175,z.damage*1.35);this.spawnBossAdds(z,7,true);this.s.lightningAlpha=1;
                } else if(kind==='bruteRush'){
                    const t=this.targetFor(z);if(t){const dx=t.x-z.x,dy=t.y-z.y,n=Math.hypot(dx,dy)||1;z.x=MZV.clamp(z.x+dx/n*150,30,MZV.WORLD.width-30);z.y=MZV.clamp(z.y+dy/n*150,30,MZV.WORLD.height-30);}this.damagePlayersInRadius(z.x,z.y,120,z.damage*1.1);
                }
            }
            if(now>=z.specialEndAt){
                z.specialAttack=null;z.specialDidHit=false;
                const base=z.form==='werewolf'?2.15:z.form==='dual'?2.5:z.variant==='shadowDancer'?2.7:z.variant==='yellowThriller'?3.2:3.6;
                z.specialCooldown=base*(this.s.carnageActive?.78:1);
                return false;
            }
            return true;
        }
        separation(z) {
            let x = 0, y = 0, count = 0;
            const range = z.type === 'tank' || z.type === 'powerBoss' ? 70 : 52, range2 = range * range;
            const cx = Math.floor(z.x / this.cellSize), cy = Math.floor(z.y / this.cellSize);
            for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) {
                const bucket = this.grid.get(`${cx + ox},${cy + oy}`);
                if (!bucket) continue;
                for (const q of bucket) {
                    if (q === z) continue;
                    const dx = z.x - q.x, dy = z.y - q.y, d2 = dx * dx + dy * dy;
                    if (d2 < 4 || d2 > range2) continue;
                    const d = Math.sqrt(d2);
                    const strength = Math.min(.34, (range - d) / range * .34);
                    x += dx / d * strength; y += dy / d * strength; count++;
                }
            }
            if (count) { x /= count; y /= count; }
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
            z.teleportCooldown -= dt * (this.s.carnageActive ? 1.18 : 1);
            z.summonCooldown -= dt * (this.s.carnageActive ? 1.25 : 1);
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
                z.attackCooldown = Math.max(0, z.attackCooldown - dt * (this.s.carnageActive ? 1.25 : 1));
                z.dashCooldown = Math.max(0, z.dashCooldown - dt);
                z.specialCooldown = Math.max(0, (z.specialCooldown || 0) - dt * (this.s.carnageActive ? 1.12 : 1));
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
                if (this.updateBossSpecial(z)) continue;
                if (this.startBossSpecial(z, t, d)) continue;
                if (z.type === 'nocturnus' && z.variant !== 'thrillerFinal' && this.updateNocturnus(z, t, dt))
                    continue;
                if (z.motionState === 'dash') {
                    if (this.s.elapsed < z.dashUntil) {
                        const mult = z.type === 'powerBoss' ? 1.95 : 2.55;
                        z.vx = z.dashX;
                        z.vy = z.dashY;
                        this.setDirectionStable(z, z.vx, z.vy);
                        const carnageSpeed = this.s.carnageActive ? 1.15 : 1;
                        z.x = MZV.clamp(z.x + z.vx * z.baseSpeed * mult * carnageSpeed * dt, 20, MZV.WORLD.width - 20);
                        z.y = MZV.clamp(z.y + z.vy * z.baseSpeed * mult * carnageSpeed * dt, 20, MZV.WORLD.height - 20);
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
                const carnageSpeed = this.s.carnageActive ? 1.15 : 1;
                z.x = MZV.clamp(z.x + mvx * z.baseSpeed * desired.speedMul * carnageSpeed * dt, 20, MZV.WORLD.width - 20);
                z.y = MZV.clamp(z.y + mvy * z.baseSpeed * desired.speedMul * carnageSpeed * dt, 20, MZV.WORLD.height - 20);
            }
        }
    }
    MZV.EnemyMotionSystem = EnemyMotionSystem;
})(MZV || (MZV = {}));
var MZV;
(function (MZV) {
    class LootSystem {
        constructor(s, audio, notify, rage) {
            this.s = s;
            this.audio = audio;
            this.notify = notify;
            this.rage = rage;
        }
        update(dt) { this.spawnMilestones(); this.spawnMysteryForLevel(); this.updateChests(dt); this.trimChestOverflow(); this.updatePickups(dt); }
        spawnMilestones() {
            while (this.s.progressKills >= this.s.nextCampfireKill) {
                const p = this.rewardPos();
                this.s.pickups.push(new MZV.Pickup('campfire', p.x, p.y, 35, 0));
                this.s.nextCampfireKill += 10;
            }
            while (this.s.progressKills >= this.s.nextNormalChestKill) {
                if (this.s.chests.filter(c => !c.opened && c.type === 'normal').length < 3) {
                    const p = this.rewardPos();
                    this.s.chests.push(new MZV.Chest('normal', this.rarity(false), p.x, p.y));
                }
                this.s.nextNormalChestKill += 20;
            }
            while (this.s.progressKills >= this.s.nextTacticalKill) {
                if (this.s.chests.filter(c => !c.opened && c.type === 'tactical').length < 2) {
                    const p = this.rewardPos();
                    this.s.chests.push(new MZV.Chest('tactical', this.rarity(true), p.x, p.y));
                }
                this.s.nextTacticalKill += 75;
            }
            const milestone = Math.floor(this.s.progressKills / MZV.RULES.overdriveEveryKills);
            if (milestone > 0 && milestone > this.s.lastOverdriveMilestone) {
                this.s.lastOverdriveMilestone = milestone;
                this.s.overdriveUntil = Math.max(this.s.overdriveUntil, this.s.elapsed) + MZV.RULES.overdriveSeconds;
                this.notify('🔥 WEAPON OVERDRIVE · 60s · +cadência +velocidade +dano');
            }
        }
        spawnMysteryForLevel() {
            const s=this.s, level=s.level;
            if (level < 7 || level % MZV.RULES.mysteryEveryLevels !== 0 || s.mysterySpawnedLevels.has(level)) return;
            if (s.chests.some(c=>!c.opened&&c.type==='mystery')) return;
            s.mysterySpawnedLevels.add(level);
            const p=this.mysteryPos();
            let reward = s.mysteryLifeLevels.has(level) ? 'extraLife' : (Math.random()<.22 ? 'rampage' : 'rage');
            if (level===49 && Math.random()<.42) reward='extraLife';
            const c=new MZV.Chest('mystery','mystery',p.x,p.y,reward);
            s.chests.push(c);
            this.guardMystery(c);
            this.audio.play('tactical', .42);
            this.notify(`❓ MYSTERY CRATE · NÍVEL ${level} · 26s PARA A APANHAR · RECOMPENSA DESCONHECIDA`);
        }
        mysteryPos() {
            const a=this.s.players.filter(p=>p.alive&&!p.out), cx=a.reduce((q,p)=>q+p.x,0)/(a.length||1), cy=a.reduce((q,p)=>q+p.y,0)/(a.length||1), ang=Math.random()*Math.PI*2, d=MZV.rand(430,620);
            return {x:MZV.clamp(cx+Math.cos(ang)*d,80,MZV.WORLD.width-80),y:MZV.clamp(cy+Math.sin(ang)*d,80,MZV.WORLD.height-80)};
        }
        guardMystery(c) {
            const count=Math.min(12,6+Math.floor(this.s.level/10));
            for(let i=0;i<count;i++){const a=Math.PI*2*i/count+Math.random()*.35,d=MZV.rand(75,145),roll=Math.random();const type=this.s.level>=20&&roll<.18?'commander':roll<.48?'runner':roll<.70?'tank':'normal';const z=new MZV.Enemy(type,MZV.clamp(c.x+Math.cos(a)*d,30,MZV.WORLD.width-30),MZV.clamp(c.y+Math.sin(a)*d,30,MZV.WORLD.height-30),this.s.level,false,this.s.mode==='single');z.hp*=1.12;this.s.enemies.push(z);}
        }
        mysteryReward(p,c) {
            let reward=c.specialReward||'rage';
            if (reward==='extraLife') {
                p.extraLives=(p.extraLives||0)+1;
                this.audio.play('revive', .78);
                this.notify(`❓❤️ SECOND CHANCE! · ${p.name.toUpperCase()} GANHOU +1 VIDA EXTRA`);
                return;
            }
            if (reward==='rampage') { this.rage.startRampage(); return; }
            const result=this.rage.startFromCrate();
            if(result==='rampage') this.notify('❓⚠ A CAIXA ERA RAIVA... MAS JÁ ESTAVAS EM RAIVA · RAMPAGE!');
        }
        rarity(tactical) { const r = Math.random(); return tactical ? (r < .35 ? 'epic' : 'rare') : (r < .07 ? 'epic' : r < .32 ? 'rare' : 'common'); }
        rewardPos() { const a = this.s.players.filter(p => p.alive && !p.out); const cx = a.reduce((q, p) => q + p.x, 0) / (a.length || 1), cy = a.reduce((q, p) => q + p.y, 0) / (a.length || 1), ang = Math.random() * Math.PI * 2, d = MZV.rand(190, 360); return { x: MZV.clamp(cx + Math.cos(ang) * d, 70, MZV.WORLD.width - 70), y: MZV.clamp(cy + Math.sin(ang) * d, 70, MZV.WORLD.height - 70) }; }
        updateChests(dt) {
            for (const c of this.s.chests) {
                if (c.opened)
                    continue;
                c.life -= dt;
                if (c.life <= 0) {
                    c.opened = true;
                    continue;
                }
                if (c.type !== 'mystery') c.required = MZV.SETTINGS.chestSeconds();
                const touch = this.s.players.filter(p => p.alive && !p.out && Math.hypot(p.x - c.x, p.y - c.y) < p.radius + c.radius + 8);
                if (!touch.length)
                    continue;
                c.progress += dt * (touch.length >= 2 ? MZV.RULES.cooperativeMultiplier : 1);
                if (c.progress >= c.required) {
                    c.opened = true;
                    const order = MZV.SETTINGS.current.weaponOrder;
                    const receiver = touch.sort((a, b) => order.indexOf(a.weaponId) - order.indexOf(b.weaponId))[0];
                    if (c.type === 'mystery') {
                        this.audio.play('tactical', .68);
                        this.mysteryReward(receiver,c);
                    }
                    else if (c.type === 'normal') {
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
        trimChestOverflow() {
            const limits = { normal: 3, tactical: 2, special: 1, mystery: 1 };
            for (const type of ['normal', 'tactical', 'special', 'mystery']) {
                let active = this.s.chests.filter(c => !c.opened && c.type === type);
                while (active.length > limits[type]) {
                    const candidate = active.find(c => c.progress <= 0) || active[0];
                    candidate.opened = true;
                    active = this.s.chests.filter(c => !c.opened && c.type === type);
                }
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
            const mobile = this.mobileLayout();
            // CSS scale stays identical to desktop. Only backing-store density is capped on mobile
            // to avoid wasting fill-rate on 2x/3x phone displays during 200-enemy Carnage scenes.
            const dprCap = mobile ? 1.25 : 2;
            const dpr = Math.min(dprCap, devicePixelRatio || 1), r = this.canvas.getBoundingClientRect();
            const width = Math.max(1, Math.round(r.width)), height = Math.max(1, Math.round(r.height));
            this.canvas.width = Math.floor(width * dpr);
            this.canvas.height = Math.floor(height * dpr);
            this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        mobileLayout() { return document.documentElement.classList.contains('touch-device'); }
        cameraProfile() {
            const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
            // Mobile uses the exact same world-to-CSS-pixel scale as browser/desktop.
            // Touch controls are overlays; they never zoom the map in.
            return { zoom: 1, focusX: w / 2, focusY: h / 2 };
        }
        isVisible(x, y, margin = 90) {
            const vw = this.canvas.clientWidth / this.zoom, vh = this.canvas.clientHeight / this.zoom;
            return x >= this.s.camera.x - margin && x <= this.s.camera.x + vw + margin &&
                y >= this.s.camera.y - margin && y <= this.s.camera.y + vh + margin;
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
            this.drawRescueNpc();
            this.drawEnemies();
            this.drawPlayers();
            this.drawReinforcement();
            this.drawHelicopters();
            c.restore();
            this.drawMiniMap();
            this.drawRageHud();
            this.drawRevive();
            this.drawThrillerOverlay();
            this.drawCarnageOverlay();
        }
        asset(key) { const i = this.assets.get(key); return i && i.complete && i.naturalWidth > 0 ? i : null; }
        drawCentered(key, x, y, height, alpha = 1) {
            if (!this.isVisible(x, y, height + 90)) return true;
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
            if (!this.isVisible(x, y, height + 110)) return true;
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
                // Draw only the visible source rectangle instead of scaling the entire world image every frame.
                const visibleW = Math.min(MZV.WORLD.width - cam.x, w / zoom);
                const visibleH = Math.min(MZV.WORLD.height - cam.y, h / zoom);
                const sx = cam.x / MZV.WORLD.width * bg.naturalWidth;
                const sy = cam.y / MZV.WORLD.height * bg.naturalHeight;
                const sw = visibleW / MZV.WORLD.width * bg.naturalWidth;
                const sh = visibleH / MZV.WORLD.height * bg.naturalHeight;
                c.drawImage(bg, sx, sy, sw, sh, 0, 0, visibleW * zoom, visibleH * zoom);
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
            if (z.variant === 'yellowThriller') return 132;
            if (z.variant === 'blackYellowThriller') return 138;
            if (z.variant === 'thrillerFinal' && z.form === 'werewolf') return 175;
            if (z.variant === 'thrillerFinal') return 146;
            if (z.variant === 'shadowDancer') return 112;
            if (z.variant === 'shadowClone') return 86;
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
            const c = this.ctx, dir = this.enemyDirection(z);
            let key;
            if (z.variant === 'yellowThriller') key=`bosses.yellowThriller.${dir}`;
            else if (z.variant === 'blackYellowThriller') key=`bosses.blackYellowThriller.${dir}`;
            else if (z.variant === 'thrillerFinal') {
                const form=z.form||'red';
                if(form==='werewolf') key=`bosses.werewolfThriller.${dir}`;
                else if(form==='blackYellow') key=`bosses.blackYellowThriller.${dir}`;
                else if(form==='dual') key=(Math.floor(this.s.elapsed*5)%2===0)?`bosses.redThriller.${dir}`:`bosses.blackYellowThriller.${dir}`;
                else key=`bosses.redThriller.${dir}`;
            }
            else if (z.variant === 'shadowDancer' || z.variant === 'shadowClone') key=`bosses.shadowDancer.${dir}`;
            else key=this.s.mission === 'thriller' ? `enemiesThriller.${z.type === 'nocturnus' ? 'powerBoss' : z.type}.${dir}` : `enemies.${z.type}.${dir}`;
            const g = this.enemyGait(z);
            if(z.specialAttack){
                const now=this.s.elapsed, remain=Math.max(.001,z.specialHitAt-z.specialStartedAt), p=MZV.clamp((now-z.specialStartedAt)/remain,0,1);
                c.save();c.lineWidth=4;
                const danger=z.specialAttack==='werewolfPounce'?'#ff3b30':z.specialAttack==='shadowNova'?'#8d68ff':z.specialAttack==='blackoutStep'?'#ffd84d':'#ff5a3d';
                c.strokeStyle=danger;c.globalAlpha=.35+.55*p;c.setLineDash([10,7]);
                const rr=z.specialAttack==='graveSlam'?210:z.specialAttack==='danceShockwave'?225:z.specialAttack==='redShockwave'?250:z.specialAttack==='werewolfPounce'?175:145;
                if(z.specialAttack==='werewolfPounce'){c.beginPath();c.arc(z.specialTargetX,z.specialTargetY,rr,0,Math.PI*2);c.stroke();}
                else{c.beginPath();c.arc(z.x,z.y,rr*(.58+.42*p),0,Math.PI*2);c.stroke();}
                c.setLineDash([]);c.font='900 12px Segoe UI';c.textAlign='center';c.fillStyle=danger;c.fillText((z.specialAttack||'SPECIAL').replace(/([A-Z])/g,' $1').toUpperCase(),z.x,z.y-this.enemyHeight(z)/2-45);c.restore();
            }
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
        drawRescueNpc() {
            const n=this.s.rescueNpc;const saved=!!(n&& !n.active && (n.savedUntil||0)>this.s.elapsed);if(!n||(!n.active&&!saved))return;if(!this.isVisible(n.x,n.y,150))return;const c=this.ctx;
            const pulse=.5+.5*Math.sin(this.s.elapsed*7);
            c.save();
            c.strokeStyle=saved?`rgba(96,255,165,${.55+.35*pulse})`:`rgba(255,226,80,${.55+.35*pulse})`;c.lineWidth=4;c.beginPath();c.arc(n.x,n.y,55+5*pulse,0,Math.PI*2);c.stroke();

            let key=saved?'npc.rescueWomanV2.relief':'npc.rescueWomanV2.idle',flip=false,height=112;
            if(!saved && n.state==='panic')key='npc.rescueWomanV2.panic';
            else if(!saved && n.state==='cower')key='npc.rescueWomanV2.cower';
            else if(!saved && n.state==='help')key='npc.rescueWomanV2.help';
            else if(!saved && n.state==='run'){
                if(n.direction==='up')key='npc.rescueWomanV2.run_up';
                else if(n.direction==='down')key='npc.rescueWomanV2.run_down';
                else {key='npc.rescueWomanV2.run_right';flip=n.direction==='left';}
            }
            const img=this.asset(key);
            if(img){
                const w=height*(img.naturalWidth/img.naturalHeight);
                c.save();c.translate(n.x,n.y);if(flip)c.scale(-1,1);
                c.drawImage(img,-w/2,-height/2,w,height);c.restore();
            }else if(!this.drawCentered(`npc.rescueWoman.${n.direction||'down'}`,n.x,n.y,104)){
                c.fillStyle='#2982b1';c.fillRect(n.x-13,n.y-27,26,54);
            }

            c.textAlign='center';c.font='900 12px Segoe UI';c.fillStyle='#fff';
            const tag=saved?'SALVA!':n.state==='panic'?'ASSUSTADA!':n.state==='cower'?'CERCADA!':'SALVAR';
            c.fillText(tag,n.x,n.y-69);
            if(!saved){
                c.fillStyle='rgba(0,0,0,.72)';c.fillRect(n.x-48,n.y+61,96,8);c.fillStyle='#e04b57';c.fillRect(n.x-48,n.y+61,96*Math.max(0,n.hp/n.maxHp),8);
                c.fillStyle='rgba(0,0,0,.72)';c.fillRect(n.x-48,n.y+73,96,6);c.fillStyle='#ffe24f';c.fillRect(n.x-48,n.y+73,96*Math.min(1,n.progress/n.required),6);
            }
            c.restore();
        }
        drawEnemies() {
            const c = this.ctx;
            for (const z of this.s.enemies) {
                if (!z.alive)
                    continue;
                if (!this.isVisible(z.x, z.y, z.isBoss ? 260 : 125)) continue;
                this.drawEnemyShape(z);
                if (z.isBoss || z.type === 'powerBoss' || z.type === 'nocturnus') {
                    const bw = z.type === 'nocturnus' ? 160 : 148;
                    c.fillStyle = 'rgba(0,0,0,.68)';
                    c.fillRect(z.x - bw / 2, z.y - this.enemyHeight(z) / 2 - 20, bw, 9);
                    c.fillStyle = z.variant === 'yellowThriller' ? '#f3d344' : z.variant === 'blackYellowThriller' ? '#e6b92d' : z.variant === 'thrillerFinal' ? (z.form==='werewolf'?'#ff6a2e':z.form==='blackYellow'?'#e6b92d':z.form==='dual'?'#ff496d':'#e53c4d') : z.variant === 'shadowDancer' ? '#765be8' : z.type === 'nocturnus' ? '#d13d6c' : '#7cdb5b';
                    c.fillRect(z.x - bw / 2, z.y - this.enemyHeight(z) / 2 - 20, bw * Math.max(0, z.hp / z.maxHp), 9);
                    c.fillStyle = '#fff'; c.font = '900 12px Segoe UI'; c.textAlign = 'center';
                    const formName=z.variant==='thrillerFinal'?(z.form==='werewolf'?'THRILLER WEREWOLF':z.form==='dual'?'THRILLER · DUAL FORM':z.form==='blackYellow'?'THRILLER · BLACK/YELLOW':'THRILLER · RED FORM'):null;
                    const name=formName || z.bossName || (z.type==='nocturnus'?(this.s.mission==='thriller'?'THRILLER BOSS':'LORD NOCTURNUS'):'POWER BOSS');
                    const lives=z.maxLives>1?` · ${z.lives}/${z.maxLives} VIDAS`:'';
                    c.fillText(`${name}${lives} · FASE ${z.phase}`, z.x, z.y - this.enemyHeight(z) / 2 - 28);
                }
            }
        }
        projectileHeight(kind) { return kind === 'pistol' ? 13 : kind === 'machinegun' ? 10 : kind === 'shotgun' ? 9 : kind === 'rifle' ? 12 : 28; }
        drawProjectiles() {
            const c = this.ctx;
            for (const b of this.s.projectiles) {
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
                if (!this.isVisible(e.x, e.y, e.maxRadius + 80)) continue;
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
                if (!this.isVisible(a.x, a.y, 180)) continue;
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
            if (b.type === 'mystery') return 'props.chest_epic_closed';
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
                if (!this.isVisible(b.x, b.y, 110)) continue;
                const glow = b.type === 'mystery' ? `rgba(255,214,72,${.30+.20*(.5+.5*Math.sin(this.s.elapsed*7))})` : b.rarity === 'epic' ? 'rgba(190,95,255,.38)' : b.rarity === 'rare' ? 'rgba(70,175,255,.28)' : 'rgba(255,215,110,.14)';
                c.fillStyle = glow;
                c.beginPath();
                c.arc(b.x, b.y, b.radius + 20 + Math.sin(this.s.elapsed * 5) * 3, 0, Math.PI * 2);
                c.fill();
                if (!this.drawCentered(this.chestAsset(b), b.x, b.y, 75)) {
                    c.fillStyle = b.type === 'tactical' ? '#536239' : '#8b592d';
                    c.fillRect(b.x - 28, b.y - 20, 56, 40);
                }
                if (b.type === 'mystery') {
                    const pulse=.5+.5*Math.sin(this.s.elapsed*8);
                    c.save();c.textAlign='center';c.font=`1000 ${Math.round(34+6*pulse)}px Segoe UI`;c.fillStyle='#fff3a1';c.shadowColor='#ffb900';c.shadowBlur=18;c.fillText('?',b.x,b.y+12);c.shadowBlur=0;c.font='1000 11px Segoe UI';c.fillStyle='#ffe45f';c.fillText('❓ MYSTERY CRATE',b.x,b.y-50);c.restore();
                } else {
                    c.fillStyle = b.type === 'special' ? '#ffe45f' : '#fff';
                    c.font = '900 10px Segoe UI';
                    c.textAlign = 'center';
                    c.fillText(b.type === 'special' ? '⭐ SPECIAL CRATE' : `${b.type === 'tactical' ? 'TACTICAL ' : ''}${b.rarity.toUpperCase()}`, b.x, b.y - 46);
                }
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
                if (!this.isVisible(p.x, p.y, 105)) continue;
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
                if (!this.isVisible(t.x, t.y, 120)) continue;
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
                if (!this.isVisible(h.x, h.y, 260)) continue;
                const frame=Math.floor(this.s.elapsed*11)%4;
                const img=this.asset(`props.helicopter.frame${frame}`);
                const bob=Math.sin(this.s.elapsed*5.2+h.x*.01)*2.2;

                c.save();
                // sombra separada do helicóptero para dar altura.
                c.fillStyle='rgba(0,0,0,.24)';
                c.beginPath();c.ellipse(h.x+20,h.y+35,58,20,.12,0,Math.PI*2);c.fill();
                c.restore();

                if(img){
                    const height=158,w=height*(img.naturalWidth/img.naturalHeight);
                    c.save();
                    c.translate(h.x,h.y+bob);
                    // O asset aponta para baixo; compensação de 90° para acompanhar a trajectória.
                    c.rotate((h.angle||0)-Math.PI/2);
                    c.drawImage(img,-w/2,-height/2,w,height);
                    c.restore();
                }else{
                    c.save();c.translate(h.x,h.y);c.fillStyle='#53624b';c.beginPath();c.ellipse(4,0,43,25,0,0,Math.PI*2);c.fill();c.restore();
                }

                // Muzzle flash curto durante as rajadas.
                if((h.muzzleUntil||0)>this.s.elapsed){
                    const a=h.gunAngle||h.angle||0;
                    c.save();c.translate(h.x,h.y);c.rotate(a);
                    const g=c.createRadialGradient(58,0,1,58,0,16);
                    g.addColorStop(0,'rgba(255,255,220,.98)');g.addColorStop(.35,'rgba(255,188,55,.9)');g.addColorStop(1,'rgba(255,90,20,0)');
                    c.fillStyle=g;c.beginPath();c.arc(58,0,16,0,Math.PI*2);c.fill();c.restore();
                }

                c.fillStyle = '#fff';
                c.font = '900 11px Segoe UI';
                c.textAlign = 'center';
                c.fillText(`HELICOPTER SUPPORT · ${Math.max(0, Math.ceil(h.life))}s`, h.x, h.y - 88);
            }
        }
        drawMiniMap() {
            if (this.mobileLayout())
                return;
            const c = this.ctx, w = this.canvas.clientWidth, h = this.canvas.clientHeight, mw = 170, mh = 112, x = w - mw - 14, y = h - mh - 14, sx = mw / MZV.WORLD.width, sy = mh / MZV.WORLD.height;
            c.fillStyle = 'rgba(10,14,16,.78)';
            c.fillRect(x, y, mw, mh);
            c.strokeStyle = 'rgba(255,255,255,.22)';
            c.strokeRect(x, y, mw, mh);
            for (const z of this.s.enemies) {
                c.fillStyle = z.variant === 'yellowThriller' ? '#ffe14d' : z.variant === 'blackYellowThriller' ? '#f2c33a' : z.variant === 'thrillerFinal' ? (z.form==='werewolf'?'#ff6a2e':'#ff3f62') : (z.variant === 'shadowDancer' || z.variant === 'shadowClone') ? '#8b6cff' : z.type === 'nocturnus' ? '#ff4f86' : z.type === 'powerBoss' ? '#86ff68' : z.type === 'vampire' ? '#e152a4' : '#9abf76';
                c.fillRect(x + z.x * sx, y + z.y * sy, z.type === 'normal' ? 2 : 4, z.type === 'normal' ? 2 : 4);
            }
            for (const b of this.s.chests) {
                if (b.type === 'special' || b.type === 'mystery') {
                    c.fillStyle = b.type === 'mystery' ? '#fff3a1' : '#ffe44f';
                    c.fillRect(x + b.x * sx - 2, y + b.y * sy - 2, 5, 5);
                }
            }
            const rescue=this.s.rescueNpc;
            if(rescue&&rescue.active){c.fillStyle='#ffe44f';c.beginPath();c.arc(x+rescue.x*sx,y+rescue.y*sy,5,0,Math.PI*2);c.fill();c.strokeStyle='#ff4f5d';c.lineWidth=1.5;c.stroke();}
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
            if (this.s.elapsed >= this.s.rageUntil) return;
            const c=this.ctx,w=this.canvas.clientWidth,pulse=.5+.5*Math.sin(this.s.elapsed*6),rampage=this.s.elapsed<this.s.rampageUntil;
            c.save();c.textAlign='center';c.font=`1000 ${Math.round((rampage?43:36)+6*pulse)}px Segoe UI`;c.fillStyle=rampage?`rgba(255,79,35,${.55+.42*pulse})`:`rgba(255,231,65,${.45+.45*pulse})`;c.shadowColor=rampage?'#ff2400':'#ff9d00';c.shadowBlur=22;c.fillText(rampage?'RAMPAGE':'MODO RAIVA',w/2,62);c.shadowBlur=0;c.font='900 15px Segoe UI';c.fillStyle='#fff';const rr=this.s.reinforcement;c.fillText(`${rr?rr.name.toUpperCase()+' REINFORCEMENT · ':''}SCORE ×${rampage?3:2} · COMBO ×${Math.max(1,this.s.combo)} · ${rampage?'RAMPAGE':'RAGE'} KILLS ${rampage?this.s.rampageKills:this.s.rageKills}`,w/2,87);c.restore();
        }
        drawThrillerOverlay() {
            if (this.s.mission !== 'thriller') return;
            const c = this.ctx, w = this.canvas.clientWidth, h = this.canvas.clientHeight;
            if (this.s.elapsed >= this.s.yellowApparitionStart && this.s.elapsed < this.s.yellowApparitionUntil) {
                const dur=Math.max(.01,this.s.yellowApparitionUntil-this.s.yellowApparitionStart),p=MZV.clamp((this.s.elapsed-this.s.yellowApparitionStart)/dur,0,1);
                const img=this.asset('bosses.yellowThriller.left');
                const x=w+150-p*(w+330), y=h*.46+Math.sin(p*Math.PI*2)*18;
                c.save();c.globalAlpha=Math.sin(Math.min(1,p)*Math.PI)*.95;
                if(img){const hh=Math.min(190,h*.38),ww=hh*(img.naturalWidth/img.naturalHeight);c.drawImage(img,x-ww/2,y-hh/2,ww,hh);} 
                c.strokeStyle=`rgba(255,225,70,${.25+.35*Math.sin(p*Math.PI)})`;c.lineWidth=3;c.beginPath();c.arc(x,y,62+8*Math.sin(p*8),0,Math.PI*2);c.stroke();
                c.restore();
            }
            if (this.s.elapsed >= (this.s.werewolfScareStart||0) && this.s.elapsed < (this.s.werewolfScareUntil||0)) {
                const dur=Math.max(.01,this.s.werewolfScareUntil-this.s.werewolfScareStart),p=MZV.clamp((this.s.elapsed-this.s.werewolfScareStart)/dur,0,1),alpha=Math.sin(p*Math.PI);
                c.save();c.fillStyle=`rgba(0,0,0,${.16+.28*alpha})`;c.fillRect(0,0,w,h);
                const img=this.asset(`bosses.werewolfThriller.down`);
                if(img){const hh=Math.min(390,h*.72),ww=hh*(img.naturalWidth/img.naturalHeight);c.globalAlpha=.25+.75*alpha;c.drawImage(img,w*.5-ww/2,h*.5-hh/2,ww,hh);}
                c.textAlign='center';c.shadowColor='#000';c.shadowBlur=22;c.font=`1000 ${Math.round(24+18*alpha)}px Segoe UI`;c.fillStyle=`rgba(255,92,48,${.5+.5*alpha})`;c.fillText('O BIG BOSS ESTÁ À TUA ESPERA',w*.5,h*.84);c.restore();
            }
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
        drawCarnageOverlay() {
            if (this.s.mission !== 'thriller' || !this.s.carnageActive)
                return;
            const c = this.ctx, w = this.canvas.clientWidth, h = this.canvas.clientHeight;
            const pulse = .5 + .5 * Math.sin(this.s.elapsed * 5.4);
            c.save();
            const vignette = c.createRadialGradient(w * .5, h * .48, Math.min(w, h) * .12, w * .5, h * .48, Math.max(w, h) * .72);
            vignette.addColorStop(0, 'rgba(120,0,10,0)');
            vignette.addColorStop(.48, `rgba(155,0,14,${.045 + pulse * .025})`);
            vignette.addColorStop(.78, `rgba(165,0,14,${.13 + pulse * .045})`);
            vignette.addColorStop(1, `rgba(180,0,16,${.255 + pulse * .075})`);
            c.fillStyle = vignette;
            c.fillRect(0, 0, w, h);
            c.fillStyle = `rgba(70,0,7,${.055 + pulse * .025})`;
            c.fillRect(0, 0, w, h);
            if (this.s.elapsed >= this.s.carnageTitleStart && this.s.elapsed < this.s.carnageTitleUntil) {
                const duration = Math.max(.01, this.s.carnageTitleUntil - this.s.carnageTitleStart);
                const p = MZV.clamp((this.s.elapsed - this.s.carnageTitleStart) / duration, 0, 1);
                // Exactamente duas pulsações: duas expansões completas e desaparece.
                const wave = .5 - .5 * Math.cos(p * Math.PI * 4);
                const scale = 1 + wave * .22;
                const fade = p > .78 ? (1 - p) / .22 : 1;
                c.translate(w / 2, h * .44);
                c.scale(scale, scale);
                c.textAlign = 'center';
                c.textBaseline = 'middle';
                c.font = `1000 ${Math.round(Math.min(92, Math.max(48, w * .075)))}px Segoe UI`;
                c.shadowColor = 'rgba(0,0,0,.95)';
                c.shadowBlur = 30;
                c.fillStyle = `rgba(205,20,32,${Math.max(0, fade)})`;
                c.strokeStyle = `rgba(255,220,205,${Math.max(0, fade * .72)})`;
                c.lineWidth = 2.5;
                c.strokeText('CARNAGE', 0, 0);
                c.fillText('CARNAGE', 0, 0);
            }
            c.restore();
            if (this.s.elapsed < this.s.carnageFlashUntil) {
                c.save();
                const remain = Math.max(0, this.s.carnageFlashUntil - this.s.elapsed);
                const a = Math.min(1, remain / .14);
                c.fillStyle = `rgba(255,255,255,${.88 + .12 * a})`;
                c.fillRect(0, 0, w, h);
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
            this.movement = new MZV.MovementSystem(this.input, this.state);
            this.revive = new MZV.ReviveSystem(this.state, this.audio, s => this.notify(s));
            this.combat = new MZV.CombatSystem(this.state, this.audio, s => this.notify(s));
            this.horde = new MZV.HordeSystem(this.state, this.audio, s => this.notify(s));
            this.rage = new MZV.RageSystem(this.state, this.audio, s => this.notify(s), count => this.horde.spawnRageWave(count));
            this.loot = new MZV.LootSystem(this.state, this.audio, s => this.notify(s), this.rage);
            this.enemyMotion = new MZV.EnemyMotionSystem(this.state, (target, damage) => target instanceof MZV.Player ? this.combat.damagePlayer(target, damage) : this.rage.damage(target, damage), s => this.notify(s));
            this.music = new MZV.MusicDirector(this.state, this.audio, this.horde, this.rage, () => this.combat.deployHelicopter(), s => this.notify(s));
            this.carnage = new MZV.CarnageSystem(this.state, this.audio, this.horde, this.music, s => this.notify(s));
            this.rescue = new MZV.RescueSystem(this.state, this.audio, s => this.notify(s));
            this.last = performance.now();
            this.toastUntil = 0;
            this.autoTest = false;
            this.pendingP1 = 'marcio';
            this.pendingP2 = 'marco';
            this.pendingMode = 'single';
            this.pendingMission = 'deserto';
            this.settingsWasRunning = false;
            this.lastBeaconLevel = 0;
            this.levelBeaconTimer = 0;
            MZV.SETTINGS.load();
            this.combat.rageDamage = (r, d) => this.rage.damage(r, d);
            this.renderer = new MZV.Renderer(canvas, this.state, this.revive);
            this.renderer.resize();
            this.touch = new MZV.TouchControls(this.input, () => { if (this.state.running)
                this.combat.callAirstrike(); }, () => this.openSettings(), () => this.requestFullscreen());
            this.viewportTimer = 0;
            this.orientationPaused = false;
            this.nextHudAt = 0;
            this.lastRenderedFrame = 0;
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
            const portraitBlocked = !!this.touch?.enabled && height > width;
            document.documentElement.classList.toggle('mobile-portrait-blocked', portraitBlocked);
            const settingsOpen = !this.$('settingsOverlay')?.classList.contains('hidden');
            if (portraitBlocked && this.state.running) {
                this.orientationPaused = true;
                this.state.running = false;
                this.audio.pauseGameplayMusic();
                this.touch.hide();
            } else if (!portraitBlocked && this.orientationPaused && !this.state.gameOver && !settingsOpen) {
                this.orientationPaused = false;
                this.state.running = true;
                this.last = performance.now();
                this.audio.resumeGameplayMusic();
                this.touch.show();
            }
            requestAnimationFrame(() => this.renderer.resize());
            clearTimeout(this.viewportTimer);
            this.viewportTimer = setTimeout(() => this.renderer.resize(), 180);
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
            this.lastBeaconLevel = 0;
            this.syncViewport();
        }
        saveSettings() {
            MZV.SETTINGS.save(this.readSettingsForm());
            this.syncSettingsForm();
            this.$('settingsStatus').textContent = `GUARDADO · caixas ${MZV.SETTINGS.current.chestOpenSeconds}s · Rage a cada ${MZV.SETTINGS.current.rageEvery} níveis`;
            this.notify('⚙ DEFINIÇÕES GUARDADAS');
        }
        showPanel(id) { for (const x of ['modeMenu', 'missionMenu', 'bossBibleMenu', 'singleCharacterMenu', 'twoCharacterMenu'])
            this.$(x).classList.add('hidden'); this.$(id).classList.remove('hidden'); }
        bossBibleEntries(mission) {
            if (mission === 'thriller') return [
                { level:'5', name:'YELLOW THRILLER', type:'APARIÇÃO', img:'assets/images/bosses/yellowThriller/down.png', desc:'Passa pelo ecrã, gargalhada e desaparece.', cls:'apparition' },
                { level:'10', name:'POWER BOSS', type:'BOSS', img:'assets/images/enemies_thriller/powerBoss/down.png', desc:'Primeira parede de força da missão.' },
                { level:'13', name:'SHADOW DANCER', type:'BOSS', img:'assets/images/bosses/shadowDancer/down.png', desc:'4 vidas · dash · teleport · clones-sombra.' },
                { level:'15', name:'YELLOW THRILLER', type:'SUB-BOSS', img:'assets/images/bosses/yellowThriller/down.png', desc:'First Form · 4 vidas · CARNAGE.' },
                { level:'20', name:'POWER BOSS II', type:'BOSS', img:'assets/images/enemies_thriller/powerBoss/down.png', desc:'Mais HP, mais velocidade e mais adds.' },
                { level:'30', name:'POWER BOSS III', type:'BOSS', img:'assets/images/enemies_thriller/powerBoss/down.png', desc:'Pressão alta e summons mais frequentes.' },
                { level:'40', name:'BLACK/YELLOW THRILLER', type:'BOSS', img:'assets/images/bosses/blackYellowThriller/down.png', desc:'7 vidas · Blackout Step · summons · forma intermédia.' },
                { level:'50', name:'THRILLER BOSS FINAL', type:'FINAL BOSS', img:'assets/images/bosses/redThriller/down.png', desc:'10 vidas · Red 10–8 → Black/Yellow 7–5 → Dual 4–2 → Werewolf Rage 1.', cls:'final' }
            ];
            return [
                { level:'10', name:'POWER BOSS', type:'BOSS', img:'assets/images/enemies/powerBoss/down.png', desc:'7 vidas · primeira grande parede.' },
                { level:'20', name:'POWER BOSS II', type:'BOSS', img:'assets/images/enemies/powerBoss/down.png', desc:'Regressa mais resistente.' },
                { level:'30', name:'POWER BOSS III', type:'BOSS', img:'assets/images/enemies/powerBoss/down.png', desc:'Mais pressão e hordas maiores.' },
                { level:'40', name:'POWER BOSS IV', type:'BOSS', img:'assets/images/enemies/powerBoss/down.png', desc:'Último teste antes do final.' },
                { level:'50', name:'LORD NOCTURNUS', type:'FINAL BOSS', img:'assets/images/enemies/nocturnus/down.png', desc:'Vampire Overlord · batalha final.', cls:'final' }
            ];
        }
        renderBossBible() {
            const mission=this.pendingMission;
            this.$('bossBibleMission').textContent=mission==='thriller'?'THRILLER':'DESERTO';
            this.$('bossBibleTitle').textContent=mission==='thriller'?'BOSS BIBLE · THRILLER':'BOSS BIBLE · DESERTO';
            const host=this.$('bossBibleGrid');host.innerHTML='';
            for(const b of this.bossBibleEntries(mission)){
                const el=document.createElement('div');el.className=`boss-entry ${b.cls||''}`;
                const assetEntry=Object.entries(MZV.ASSET_PATHS).find(([,path])=>path===b.img);
                const imgSrc=assetEntry?MZV.assetUrl(assetEntry[0]):b.img;
                el.innerHTML=`<span class="boss-level">NÍVEL ${b.level}</span><img src="${imgSrc}" alt="${b.name}"><b>${b.name}</b><small>${b.desc}</small><span class="boss-type">${b.type}</span>`;
                host.appendChild(el);
            }
        }
        nextBossInfo(mission, level) {
            const entries=this.bossBibleEntries(mission).map(b=>({level:Number(b.level),name:b.name,type:b.type}));
            return entries.find(b=>b.level>=level) || null;
        }
        levelMotivation(mission, level) {
            const current=this.nextBossInfo(mission,level);
            if(current && current.level===level){
                if(current.type==='APARIÇÃO') return `${current.name} ESTÁ POR PERTO · NÃO BAIXES A GUARDA.`;
                if(current.type==='FINAL BOSS') return `FINAL BOSS · CHEGASTE ATÉ AQUI. ACABA COM ISTO.`;
                return `BOSS LEVEL · ${current.name} · MOSTRA O QUE VALES.`;
            }
            const next=this.bossBibleEntries(mission).map(b=>({level:Number(b.level),name:b.name})).find(b=>b.level>level);
            if(!next) return 'NÃO PARES AGORA · SOBREVIVE.';
            const d=next.level-level;
            if(d===1) return `SÓ MAIS 1 NÍVEL · ${next.name} ESTÁ À ESPERA.`;
            if(d<=3) return `AGUENTA · FALTAM ${d} NÍVEIS PARA ${next.name}.`;
            const phrases=[`PRÓXIMO MARCO: NÍVEL ${next.level} · CONTINUA.`,`NÃO PARES AGORA · NÍVEL ${next.level} É O PRÓXIMO TESTE.`,`MAIS ${d} NÍVEIS · A NOITE AINDA NÃO ACABOU.`];
            return phrases[level%phrases.length];
        }
        updateLevelBeacon(force=false) {
            const s=this.state;if(!s.running&&!force)return;
            if(!force&&this.lastBeaconLevel===s.level)return;
            this.lastBeaconLevel=s.level;
            const beacon=this.$('levelBeacon');beacon.classList.remove('hidden','level-up');void beacon.offsetWidth;beacon.classList.add('level-up');
            this.$('levelBeaconNumber').textContent=String(s.level);
            this.$('levelMotivation').textContent=this.levelMotivation(s.mission,s.level);
            if(this.levelBeaconTimer) clearTimeout(this.levelBeaconTimer);
            this.levelBeaconTimer=setTimeout(()=>beacon.classList.add('hidden'),3200);
        }
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
            this.$('mission_deserto').addEventListener('click', () => { this.pendingMission = 'deserto'; this.$('singleMissionLabel').textContent='DESERTO'; this.$('twoMissionLabel').textContent='DESERTO'; this.renderBossBible(); this.showPanel('bossBibleMenu'); });
            this.$('mission_thriller').addEventListener('click', () => { this.pendingMission = 'thriller'; this.$('singleMissionLabel').textContent='THRILLER'; this.$('twoMissionLabel').textContent='THRILLER'; this.renderBossBible(); this.showPanel('bossBibleMenu'); });
            this.$('bossBibleContinue').addEventListener('click', () => { if(this.pendingMode==='single') this.showPanel('singleCharacterMenu'); else { this.updateTwoSelection(); this.showPanel('twoCharacterMenu'); } });
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
            this.lastBeaconLevel=0; this.$('levelBeacon').classList.remove('hidden');
            document.documentElement.classList.add('game-playing');
            document.documentElement.classList.toggle('single-player', mode === 'single');
            this.orientationPaused = false;
            this.nextHudAt = 0;
            this.touch.setMode(mode);
            this.syncViewport();
            if (this.touch.enabled)
                void this.requestFullscreen(false);
            this.music.start();
            this.audio.play('laugh', .70);
            this.startLevel();
            this.$('rescueAlert')?.classList.remove('show');
            this.updateHud();
            this.last = performance.now();
            this.$('runtime-status').textContent = 'RUNNING';
        }
        notify(s) { const t = this.$('toast'); t.textContent = s; t.classList.add('show'); this.toastUntil = performance.now() + 2600; }
        skipLevel() { for (const z of this.state.enemies)
            z.alive = false; this.state.enemies = []; }
        loop(t) {
            try {
                const mobile = this.touch.enabled;
                const targetFps = 60;
                const minFrameMs = 1000 / targetFps;
                if (mobile && this.lastRenderedFrame && t - this.lastRenderedFrame < minFrameMs - .6) {
                    requestAnimationFrame(q => this.loop(q));
                    return;
                }
                this.lastRenderedFrame = t;
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
            this.carnage.update(dt);
            this.updateThrillerAtmosphere(dt);
            for (const p of s.players)
                this.movement.updatePlayer(p, dt);
            this.rage.update(dt);
            this.combat.update(dt);
            this.enemyMotion.update(dt);
            this.loot.update(dt);
            this.revive.update();
            this.rescue.update(dt);
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
            else if (!s.enemies.length && !s.victory && !this.horde.hasPendingLevelThreats() && !this.rage.blocksLevel() && !(s.rescueNpc && s.rescueNpc.active)) {
                s.level++;
                this.startLevel();
            }
            if (s.elapsed >= this.nextHudAt) {
                this.nextHudAt = s.elapsed + .10;
                this.updateHud();
            }
        }
        updateThrillerAtmosphere(dt) {
            const s = this.state;
            if (s.mission !== 'thriller') { s.lightningAlpha = 0; s.scareUntil = 0; return; }
            if (s.lightningAlpha > 0) s.lightningAlpha = Math.max(0, s.lightningAlpha - dt * 2.25);
            if (s.werewolfScareStart > 0 && s.elapsed >= s.werewolfScareStart && s.elapsed < s.werewolfScareUntil && s.werewolfScareSoundedLevel !== s.level) {
                s.werewolfScareSoundedLevel = s.level; s.lightningAlpha = 1;
                this.audio.playVariant('laugh', .92, MZV.rand(.88,.96));
                this.notify('🐺 ELE ESTÁ A OBSERVAR-TE...');
            }
            if (s.elapsed >= s.nextLightningAt) {
                s.lightningAlpha = .30 + Math.random() * .34;
                const bossPending = s.pendingBoss === 'powerBoss' || s.pendingBoss === 'nocturnus';
                if (s.carnageActive) s.nextLightningAt = s.elapsed + MZV.rand(3.2, 7.0);
                else s.nextLightningAt = s.elapsed + MZV.rand(bossPending ? 5.5 : 10.5, bossPending ? 10 : 23);
            }
            if (s.pendingBoss === 'nocturnus') {
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
            this.$('levelBeacon').classList.add('hidden');
            const box = this.$('gameOver');
            box.classList.remove('hidden');
            this.$('resultTitle').textContent = victory ? 'VITÓRIA' : 'GAME OVER';
            this.$('resultText').textContent = victory ? `${this.state.mission === 'thriller' ? 'Thriller Boss' : 'Lord Nocturnus'} foi derrotado · ${this.state.kills} kills · ${this.state.score.toLocaleString()} pontos.` : `Nível ${this.state.level} · ${this.state.kills} kills · ${this.state.score.toLocaleString()} pontos.`;
        }
        updateHud() {
            const s = this.state, p1 = s.players[0], p2 = s.players[1];
            this.updateLevelBeacon();
            const rescueAlert=this.$('rescueAlert');
            if(!(s.rescueNpc&&s.rescueNpc.active)) rescueAlert.classList.remove('show');
            else if(s.rescueAlertUntil>s.elapsed && !rescueAlert.classList.contains('show')){rescueAlert.classList.remove('show');void rescueAlert.offsetWidth;rescueAlert.classList.add('show');setTimeout(()=>rescueAlert.classList.remove('show'),2200);}
            const missionHud = this.$('mission'); if (missionHud) missionHud.textContent = s.mission === 'thriller' ? 'THRILLER' : 'DESERTO';
            const rescueHud=this.$('rescue'); if(rescueHud){const n=s.rescueNpc;rescueHud.textContent=n&&n.active?`${Math.ceil(n.hp)}HP · ${Math.round(100*n.progress/n.required)}%`:'—';}
            this.$('level').textContent = String(s.level);
            this.$('kills').textContent = String(s.kills);
            this.$('score').textContent = s.score.toLocaleString();
            this.$('remaining').textContent = String(s.enemies.length);
            this.$('air').textContent = String(s.airstrikeCharges);
            this.$('overdrive').textContent = s.elapsed < s.overdriveUntil ? Math.ceil(s.overdriveUntil - s.elapsed) + 's' : '—';
            this.$('rage').textContent = s.elapsed < s.rageUntil && s.elapsed >= s.rampageUntil ? Math.ceil(s.rageUntil - s.elapsed) + 's' : '—';
            this.$('rampage').textContent = s.elapsed < s.rampageUntil ? Math.ceil(s.rampageUntil - s.elapsed) + 's' : '—';
            this.$('extraLives').textContent = s.players.map(p=>`P${p.slot} ${p.extraLives||0}`).join(' · ');
            const hudNext=this.$('hudNext'); if(hudNext) hudNext.textContent=this.levelMotivation(s.mission,s.level);
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
