(() => {
  'use strict';
  if (!window.MZV) return;

  const BUILD = '4.6.9.1-local-tension';

  // Runtime-only balancing profile. The real difficulty multipliers continue to live
  // in difficulty-shadow-balance.js; this table only controls event density/caps.
  const TENSION = {
    easy:      { carnageCap1:120, carnageCap2:145, carnageWave:10, carnageBurst:34, rageCap1:125, rageCap2:155, rageBurst:34, rageSurge:12, ambush:20, elite:4, threatMin:24, threatMax:34, pressureMax:58 },
    hard:      { carnageCap1:145, carnageCap2:175, carnageWave:13, carnageBurst:44, rageCap1:150, rageCap2:185, rageBurst:46, rageSurge:16, ambush:26, elite:5, threatMin:21, threatMax:30, pressureMax:76 },
    nightmare: { carnageCap1:170, carnageCap2:205, carnageWave:16, carnageBurst:54, rageCap1:178, rageCap2:215, rageBurst:60, rageSurge:20, ambush:32, elite:7, threatMin:18, threatMax:27, pressureMax:96 },
    thriller:  { carnageCap1:195, carnageCap2:225, carnageWave:19, carnageBurst:64, rageCap1:205, rageCap2:235, rageBurst:74, rageSurge:24, ambush:40, elite:9, threatMin:16, threatMax:24, pressureMax:116 },
  };
  const difficultyId = () => window.MZV_SELECTED_DIFFICULTY || 'easy';
  const tc = () => TENSION[difficultyId()] || TENSION.easy;
  const aliveEnemies = s => s.enemies.reduce((n,z)=>n+(z.alive?1:0),0);
  const aliveBosses = s => s.enemies.filter(z => z.alive && (z.isBoss || z.type === 'powerBoss' || z.type === 'nocturnus'));
  const averageHp = s => {
    const p=s.players.filter(q=>!q.out); if(!p.length) return 0;
    return p.reduce((a,q)=>a+Math.max(0,q.hp)/Math.max(1,q.maxHp),0)/p.length;
  };
  const tierForLevel = level => level < 9 ? 1 : level < 17 ? 2 : level < 29 ? 3 : level < 41 ? 4 : 5;

  function teamCenter(s) {
    const p=s.players.filter(q=>q.alive&&!q.out);
    return {
      x:p.reduce((a,q)=>a+q.x,0)/(p.length||1),
      y:p.reduce((a,q)=>a+q.y,0)/(p.length||1),
    };
  }

  function spawnAt(app,type,x,y,mega=true) {
    const s=app.state;
    const z=new MZV.Enemy(type,MZV.clamp(x,35,MZV.WORLD.width-35),MZV.clamp(y,35,MZV.WORLD.height-35),s.level,mega,s.mode==='single');
    s.enemies.push(z);
    return z;
  }

  function spawnPerimeterAmbush(app,count,fourSides=false,eliteBias=false) {
    const s=app.state,c=teamCenter(s),distance=MZV.rand(430,610);
    const sides=fourSides?4:2;
    const chosen=[];
    const start=Math.floor(Math.random()*4);
    for(let i=0;i<sides;i++) chosen.push((start+i*(fourSides?1:2))%4);
    for(let i=0;i<count;i++) {
      const side=chosen[i%chosen.length],spread=MZV.rand(-230,230),d=distance+MZV.rand(-55,85);
      let x=c.x,y=c.y;
      if(side===0){x+=spread;y-=d;}
      if(side===1){x+=d;y+=spread;}
      if(side===2){x+=spread;y+=d;}
      if(side===3){x-=d;y+=spread;}
      const r=Math.random();
      let type='normal';
      if(eliteBias && s.level>=10 && r<.18) type='commander';
      else if(r<(eliteBias?.38:.20)) type='tank';
      else if(r<(eliteBias?.78:.62)) type='runner';
      spawnAt(app,type,x,y,true);
    }
  }

  function spawnRageMiniBoss(app,count=1,label='RAGE BRUTE') {
    const s=app.state,c=teamCenter(s);
    for(let i=0;i<count;i++) {
      const a=(Math.PI*2*i/Math.max(1,count))+MZV.rand(-.45,.45),d=MZV.rand(380,520);
      const z=spawnAt(app,'tank',c.x+Math.cos(a)*d,c.y+Math.sin(a)*d,true);
      z.variant='rageBrute'; z.isMiniBoss=true; z.bossName=label;
      z.maxHp*=difficultyId()==='thriller'?5.2:difficultyId()==='nightmare'?4.5:difficultyId()==='hard'?3.9:3.4;
      z.hp=z.maxHp; z.radius=Math.max(z.radius||28,35); z.baseSpeed*=1.06;z.speed=z.baseSpeed;z.damage*=1.28;
    }
  }

  function armBoss(s,type,variant,delay=7) {
    s.pendingBoss=type;
    s.pendingBossVariant=variant||null;
    s.pendingBossSince=s.elapsed;
    s.tensionForceBossAt=s.elapsed+delay;
  }

  function setThreatApparition(s,key,duration=2.0,side=null) {
    s.threatApparitionKey=key;
    s.threatApparitionStart=s.elapsed;
    s.threatApparitionUntil=s.elapsed+duration;
    s.threatApparitionSide=side ?? (Math.random()<.5?-1:1);
  }

  // -----------------------------
  // Thriller milestone progression
  // -----------------------------
  const baseStartLevel = MZV.HordeSystem.prototype.startLevel;
  MZV.HordeSystem.prototype.startLevel = function(...args) {
    const out=baseStartLevel.apply(this,args);
    const s=this.state;
    if(s.mission!=='thriller') return out;

    // Remove the legacy Thriller schedule so there are no accidental back-to-back old bosses.
    if([10,15,20,30,40].includes(s.level)) {
      s.pendingBoss=null;s.pendingBossVariant=null;s.pendingBossSince=0;
    }

    if(s.level===3) {
      s.yellowApparitionShown=true;
      s.yellowApparitionStart=s.elapsed+.45;
      s.yellowApparitionUntil=s.yellowApparitionStart+3.1;
      s.lightningAlpha=Math.max(s.lightningAlpha||0,.72);
      this.audio.playVariant('laugh',.72,MZV.rand(.95,1.04));
      this.notify('👁 YELLOW THRILLER · PRIMEIRO AVISO');
    }
    else if(s.level===5) {
      armBoss(s,'powerBoss','yellowThriller',6.0);
      s.tensionFirstCarnageBoss=true;
      this.notify('🟡 NÍVEL 5 · PRIMEIRO CARNAGE · ELE VEM AÍ');
    }
    else if(s.level===9) {
      // difficulty-shadow-balance.js gives this level the 15s cleanup window + helicopter.
      armBoss(s,'vampire','shadowDancer',15.0);
      s.werewolfScareStart=0;s.werewolfScareUntil=0;
      this.notify('🌑 NÍVEL 9 · SHADOW DANCER DETECTADO · 15s PARA LIMPAR A ZONA');
    }
    else if(s.level===13) {
      armBoss(s,'powerBoss','yellowThriller',7.5);
      this.notify('⚡ NÍVEL 13 · YELLOW THRILLER · FIRST FORM');
    }
    else if(s.level===17) {
      armBoss(s,'powerBoss',null,7.0);
      this.notify('⚰ NÍVEL 17 · THRILLER BRUTE · PRESSÃO A SUBIR');
    }
    else if(s.level===21) {
      // Reveal only. A natural Carnage at this point still gets its own boss via the Carnage hook below.
      setThreatApparition(s,'bosses.blackYellowThriller.down',2.5,1);
      s.lightningAlpha=1;
      this.audio.playVariant('laugh',.78,.94);
      this.notify('🟨⬛ BLACK/YELLOW · AGORA SABES QUE ELE ESTÁ AQUI');
    }
    else if(s.level===27) {
      armBoss(s,'vampire','shadowDancer',8.0);
      s.tensionShadowPrime=true;
      this.notify('🌑 NÍVEL 27 · SHADOW DANCER PRIME');
    }
    else if(s.level===35) {
      armBoss(s,'powerBoss','blackYellowThriller',7.0);
      this.notify('🟨⬛ NÍVEL 35 · BLACK/YELLOW THRILLER');
    }
    else if(s.level===43) {
      armBoss(s,'powerBoss',null,6.0);
      setThreatApparition(s,'bosses.werewolfThriller.down',2.25,-1);
      this.audio.playVariant('laugh',.9,.91);
      this.notify('🐺 NÍVEL 43 · PRELUDE FINAL · ELE ESTÁ PERTO');
    }
    else if(s.level===50) {
      s.tensionForceBossAt=s.elapsed+7.5;
    }
    return out;
  };

  // Boss tuning after the existing difficulty wrapper has applied its multipliers.
  const baseReleaseBoss = MZV.HordeSystem.prototype.releaseBoss;
  MZV.HordeSystem.prototype.releaseBoss = function(...args) {
    const s=this.state,before=new Set(s.enemies),level=s.level,variant=s.pendingBossVariant;
    const out=baseReleaseBoss.apply(this,args);
    const added=s.enemies.filter(z=>!before.has(z)&&z.alive&&(z.isBoss||z.type==='powerBoss'||z.type==='nocturnus'));
    for(const z of added) {
      if(level===5 && variant==='yellowThriller') {
        const d=difficultyId();
        const hpSingle={easy:620,hard:800,nightmare:980,thriller:1200}[d]||620;
        const hpTwo={easy:780,hard:980,nightmare:1200,thriller:1450}[d]||780;
        z.bossName='YELLOW THRILLER · CARNAGE I';
        z.lives=(d==='nightmare'||d==='thriller')?4:3;z.maxLives=z.lives;
        z.maxHp=s.mode==='single'?hpSingle:hpTwo;z.hp=z.maxHp;
        z.damage={easy:20,hard:23,nightmare:25,thriller:28}[d]||20;
        z.baseSpeed=Math.min(z.baseSpeed,112);z.speed=z.baseSpeed;
      }
      if(level===27 && variant==='shadowDancer') {
        z.bossName='SHADOW DANCER PRIME';z.lives=6;z.maxLives=6;
        z.maxHp*=1.28;z.hp=z.maxHp;z.baseSpeed*=1.06;z.speed=z.baseSpeed;z.damage*=1.08;
      }
      if(level===43 && !variant && z.type==='powerBoss') {
        z.bossName='THRILLER EXECUTIONER';z.maxHp*=1.35;z.hp=z.maxHp;z.damage*=1.12;
      }
    }
    s.tensionForceBossAt=0;
    return out;
  };

  // ---------------------------------
  // Carnage: every one gets a boss face
  // ---------------------------------
  function carnageBossVariant(s) {
    const tier=tierForLevel(s.level);
    if(tier===1) return ['powerBoss','yellowThriller'];
    if(tier===2) return ['powerBoss',null];
    if(tier===3) return ['vampire','shadowDancer'];
    if(tier===4) return ['powerBoss','blackYellowThriller'];
    return ['powerBoss',null];
  }

  function ensureCarnageBoss(app) {
    const s=app.state;
    if(aliveBosses(s).length) return;
    if(s.pendingBoss) { app.horde.releaseBoss(); return; }
    const [type,variant]=carnageBossVariant(s);
    s.pendingBoss=type;s.pendingBossVariant=variant;s.pendingBossSince=s.elapsed-10;
    if(s.level>=41) setThreatApparition(s,'bosses.werewolfThriller.down',1.8);
    app.horde.releaseBoss();
  }

  const baseCarnageStart = MZV.CarnageSystem.prototype.start;
  MZV.CarnageSystem.prototype.start = function(source,seekToStart) {
    const was=this.s.carnageActive;
    const out=baseCarnageStart.call(this,source,seekToStart);
    const s=this.s;
    if(s.mission==='thriller' && !was && s.carnageActive) {
      const app=window.__MZV_APP__;
      if(app) {
        ensureCarnageBoss(app);
        const c=tc(),burst=c.carnageBurst+Math.max(0,tierForLevel(s.level)-1)*5;
        const cap=s.mode==='single'?c.carnageCap1:c.carnageCap2;
        const room=Math.max(0,cap-aliveEnemies(s));
        const n=Math.min(room,burst);
        for(let i=0;i<n;i++) app.horde.spawnRandom();
        s.carnageNextWaveAt=Math.min(s.carnageNextWaveAt||Infinity,s.elapsed+.72);
        app.notify(`🔥 CARNAGE ${Math.min(5,tierForLevel(s.level))} · BOSS + HORDA · SOBREVIVE`);
      }
      if(s.rageUntil>s.elapsed && window.__MZV_APP__?.thrillerTension) window.__MZV_APP__.thrillerTension.startHavoc();
    }
    return out;
  };

  MZV.CarnageSystem.prototype.spawnWave = function() {
    const s=this.s;if(s.mission!=='thriller')return;
    const c=tc(),tier=tierForLevel(s.level),cap=(s.mode==='single'?c.carnageCap1:c.carnageCap2)+Math.max(0,tier-1)*8;
    if(aliveEnemies(s)>=Math.min(cap,s.mode==='single'?220:240)) return;
    let count=c.carnageWave+Math.max(0,tier-1)*2;
    count=Math.min(count,Math.max(0,Math.min(cap,s.mode==='single'?220:240)-aliveEnemies(s)));
    for(let i=0;i<count;i++) {
      const r=Math.random();let type='normal';
      if(s.level>=10&&r<.13)type='commander';else if(s.level>=7&&r<.29)type='tank';else if(r<.72)type='runner';
      this.horde.spawn(type);
    }
  };

  // -----------------------------
  // Rage becomes deliberate chaos
  // -----------------------------
  const baseRageStart=MZV.RageSystem.prototype.start;
  MZV.RageSystem.prototype.start=function(...args){
    const was=this.isActive();
    const out=baseRageStart.apply(this,args);
    if(!was&&this.isActive()) {
      const app=window.__MZV_APP__,s=this.s,c=tc();
      if(app) {
        const cap=s.mode==='single'?c.rageCap1:c.rageCap2;
        const n=Math.min(c.rageBurst,Math.max(0,cap-aliveEnemies(s)));
        spawnPerimeterAmbush(app,n,true,true);
        spawnRageMiniBoss(app,difficultyId()==='thriller'?2:1,'RAGE BRUTE');
        s.tensionRageNextSurge=s.elapsed+4.4;
        s.tensionRageMiniBossAt=s.elapsed+18;
        this.notify(`⚡ RAGE CHAOS · +${n} INIMIGOS · MINI-BOSS · NÃO PARES`);
        if(s.carnageActive&&app.thrillerTension)app.thrillerTension.startHavoc();
      }
    }
    return out;
  };

  // Score reaches x5 territory when Rage and Carnage genuinely overlap.
  const baseKillEnemy=MZV.CombatSystem.prototype.killEnemy;
  MZV.CombatSystem.prototype.killEnemy=function(z,source='support'){
    const before=this.s.score;
    const havoc=!!this.s.havocActive;
    const rampage=this.s.elapsed<this.s.rampageUntil;
    const out=baseKillEnemy.call(this,z,source);
    if(havoc&&this.s.score>before) {
      const delta=this.s.score-before;
      const current=(rampage?MZV.RULES.rampageScoreMultiplier:MZV.RULES.rageScoreMultiplier)*1.5;
      const target=5;
      if(current<target)this.s.score+=Math.round(delta*(target/current-1));
    }
    return out;
  };

  // Fake Calm temporarily holds non-boss music drops; pending enemies are not deleted.
  const tensionCue=MZV.HordeSystem.prototype.onMusicCue;
  MZV.HordeSystem.prototype.onMusicCue=function(cue){
    const s=this.state;
    if(s.mission==='thriller'&&s.threatFakeCalmUntil>s.elapsed&&!s.pendingBoss&&['HORDE','DROP','RAGE'].includes(cue?.type))return;
    return tensionCue.call(this,cue);
  };

  class ThrillerTensionDirector {
    constructor(app){this.app=app;this.s=app.state;this.lastEvents=[];this.reset();}
    reset(){
      const s=this.s;
      s.threatIntroAt=5.8;s.threatIntroDone=false;s.threatIntroFlashDone=false;s.threatIntroLaughDone=false;
      s.threatBlackoutStart=0;s.threatBlackoutUntil=0;s.threatFlickerUntil=0;
      s.threatApparitionKey='';s.threatApparitionStart=0;s.threatApparitionUntil=0;s.threatApparitionSide=1;
      s.threatFakeCalmUntil=0;s.threatFakeCalmBurstAt=0;s.threatFakeCalmBurstDone=false;
      s.threatEventUntil=0;s.nextThreatAt=22;s.havocActive=false;s.havocNextWaveAt=0;s.havocMiniBossAt=0;
      s.tensionRageNextSurge=0;s.tensionRageMiniBossAt=0;
      this.lastEvents=[];
    }
    scheduleNext(){
      const c=tc(),tier=tierForLevel(this.s.level),reduction=Math.min(4,(tier-1)*1.1);
      this.s.nextThreatAt=this.s.elapsed+MZV.rand(Math.max(12,c.threatMin-reduction),Math.max(17,c.threatMax-reduction));
    }
    canThreat(){
      const s=this.s,c=tc();
      if(s.carnageActive||s.rageUntil>s.elapsed||s.havocActive)return false;
      if(s.pendingBoss||aliveBosses(s).length)return false;
      if(s.rescueNpc?.active)return false;
      if(s.threatEventUntil>s.elapsed||s.threatFakeCalmUntil>s.elapsed)return false;
      if(aliveEnemies(s)>c.pressureMax+Math.max(0,tierForLevel(s.level)-1)*8)return false;
      if(averageHp(s)<.34)return false;
      return true;
    }
    triggerIntro(){
      const s=this.s;s.threatIntroDone=true;
      s.threatBlackoutStart=s.elapsed;s.threatBlackoutUntil=s.elapsed+1.55;
      s.threatIntroFlashAt=s.elapsed+.62;s.threatIntroLaughAt=s.elapsed+.78;
      s.threatEventUntil=s.elapsed+1.75;
      this.app.audio.playVariant('thunder',.78,.98);
      this.app.notify('⚡ AS LUZES APAGARAM...');
      this.scheduleNext();
    }
    pickEvent(){
      const tier=tierForLevel(this.s.level);
      let pool=['flicker','apparition','ambush'];
      if(tier>=2)pool.push('elite','fakeCalm','apparition');
      if(tier>=3)pool.push('rescueEcho','ambush','apparition');
      if(tier>=4)pool.push('werewolf','elite','fakeCalm');
      if(tier>=5)pool.push('werewolf','ambush','elite','apparition');
      const recent=new Set(this.lastEvents.slice(-2));
      const eligible=pool.filter(e=>!recent.has(e));
      return (eligible.length?eligible:pool)[Math.floor(Math.random()*(eligible.length?eligible.length:pool.length))];
    }
    record(name){this.lastEvents.push(name);if(this.lastEvents.length>5)this.lastEvents.shift();this.scheduleNext();}
    trigger(name){
      const s=this.s,c=tc(),tier=tierForLevel(s.level);s.threatEventUntil=s.elapsed+3;
      if(name==='flicker'){
        s.threatFlickerUntil=s.elapsed+2.3;this.app.audio.playVariant('thunder',.42,MZV.rand(.95,1.06));
        this.app.notify('⚡ AS LUZES ESTÃO A FALHAR...');
      }else if(name==='apparition'){
        const choices=tier>=4?['bosses.redThriller.down','bosses.blackYellowThriller.down','bosses.werewolfThriller.down']:tier>=2?['bosses.yellowThriller.down','bosses.redThriller.down','effects.thriller_apparition']:['bosses.yellowThriller.down','effects.thriller_apparition'];
        setThreatApparition(s,choices[Math.floor(Math.random()*choices.length)],MZV.rand(1.65,2.35));
        s.lightningAlpha=Math.max(s.lightningAlpha||0,.72);this.app.audio.playVariant('laugh',MZV.rand(.55,.82),MZV.rand(.9,1.08));
        this.app.notify(Math.random()<.5?'👁 NÃO ESTÁS SOZINHO...':'👁 ELE DESAPARECEU OUTRA VEZ');
      }else if(name==='werewolf'){
        setThreatApparition(s,'bosses.werewolfThriller.down',2.15);s.lightningAlpha=1;
        this.app.audio.playVariant('laugh',.9,MZV.rand(.88,.96));this.app.notify('🐺 ELE ESTÁ A OBSERVAR-TE...');
      }else if(name==='ambush'){
        const n=c.ambush+Math.max(0,tier-1)*3;spawnPerimeterAmbush(this.app,n,tier>=4,tier>=3);
        this.app.audio.playVariant('laugh',.52,MZV.rand(.93,1.08));this.app.notify(`🚨 AMBUSH · +${n} UNDEAD NAS RUAS`);
      }else if(name==='elite'){
        const n=c.elite+Math.floor((tier-1)/2);
        for(let i=0;i<n;i++){
          const center=teamCenter(s),a=Math.PI*2*i/n+MZV.rand(-.2,.2),d=MZV.rand(390,520);
          spawnAt(this.app,i%3===0&&s.level>=10?'commander':i%2===0?'tank':'runner',center.x+Math.cos(a)*d,center.y+Math.sin(a)*d,true);
        }
        this.app.audio.playVariant('thunder',.52,1);this.app.notify(`☠ ELITE PACK · ${n} AMEAÇAS A ENTRAR`);
      }else if(name==='fakeCalm'){
        s.threatFakeCalmUntil=s.elapsed+4.8;s.threatFakeCalmBurstAt=s.threatFakeCalmUntil;s.threatFakeCalmBurstDone=false;
        s.threatEventUntil=s.threatFakeCalmUntil+1.5;this.app.notify('… SILÊNCIO …');
      }else if(name==='rescueEcho'){
        this.app.audio.playVariant('scream',.48,MZV.rand(.96,1.04));setThreatApparition(s,'effects.thriller_apparition',1.25);
        this.app.notify('🆘 OUVISTE UM GRITO AO FUNDO DA RUA');
      }
      this.record(name);
    }
    startHavoc(){
      const s=this.s;if(s.havocActive||!s.carnageActive||s.rageUntil<=s.elapsed)return;
      s.havocActive=true;s.havocEnteredAt=s.elapsed;s.havocNextWaveAt=s.elapsed+.35;s.havocMiniBossAt=s.elapsed+8;
      s.lightningAlpha=1;this.app.audio.playVariant('thunder',.88,.95);this.app.audio.playVariant('laugh',.9,.92);
      spawnRageMiniBoss(this.app,difficultyId()==='thriller'?2:1,'HAVOC BRUTE');
      this.app.notify('💀🔥 HAVOC · RAGE + CARNAGE · SCORE ×5');
    }
    updateRageChaos(){
      const s=this.s;if(s.rageUntil<=s.elapsed)return;
      const c=tc(),cap=s.mode==='single'?c.rageCap1:c.rageCap2;
      if(s.elapsed>=(s.tensionRageNextSurge||0)){
        const room=Math.max(0,cap-aliveEnemies(s)),n=Math.min(c.rageSurge+Math.max(0,tierForLevel(s.level)-1)*2,room);
        if(n>0)spawnPerimeterAmbush(this.app,n,Math.random()<.55,true);
        s.tensionRageNextSurge=s.elapsed+MZV.rand(4.6,6.4);
      }
      if(s.elapsed>=(s.tensionRageMiniBossAt||Infinity)){
        if(!s.enemies.some(z=>z.alive&&z.isMiniBoss))spawnRageMiniBoss(this.app,difficultyId()==='thriller'?2:1,'RAGE BRUTE');
        s.tensionRageMiniBossAt=s.elapsed+MZV.rand(17,23);
      }
    }
    updateHavoc(){
      const s=this.s;
      if(!s.havocActive){if(s.carnageActive&&s.rageUntil>s.elapsed)this.startHavoc();return;}
      if(!s.carnageActive||s.rageUntil<=s.elapsed){s.havocActive=false;return;}
      const c=tc(),cap=Math.min(s.mode==='single'?220:240,(s.mode==='single'?c.rageCap1:c.rageCap2)+28);
      if(s.elapsed>=s.havocNextWaveAt){
        const room=Math.max(0,cap-aliveEnemies(s));const n=Math.min(room,Math.round(c.rageSurge*1.35));
        if(n>0)spawnPerimeterAmbush(this.app,n,true,true);
        s.havocNextWaveAt=s.elapsed+MZV.rand(3.2,4.4);
      }
      if(s.elapsed>=s.havocMiniBossAt){
        spawnRageMiniBoss(this.app,difficultyId()==='thriller'?2:1,'HAVOC BRUTE');s.havocMiniBossAt=s.elapsed+14;
      }
    }
    update(){
      const s=this.s;if(!s.running||s.mission!=='thriller')return;
      if(!s.threatIntroDone&&s.elapsed>=s.threatIntroAt)this.triggerIntro();
      if(s.threatIntroDone&&!s.threatIntroFlashDone&&s.elapsed>=s.threatIntroFlashAt){
        s.threatIntroFlashDone=true;s.lightningAlpha=1;setThreatApparition(s,'effects.thriller_apparition',.85,1);
      }
      if(s.threatIntroDone&&!s.threatIntroLaughDone&&s.elapsed>=s.threatIntroLaughAt){
        s.threatIntroLaughDone=true;this.app.audio.playVariant('laugh',.82,.96);this.app.notify('👁 ALGUMA COISA ESTÁ A OBSERVAR-TE');
      }
      if(s.threatFakeCalmBurstAt&&!s.threatFakeCalmBurstDone&&s.elapsed>=s.threatFakeCalmBurstAt){
        s.threatFakeCalmBurstDone=true;s.threatFakeCalmUntil=0;
        const n=Math.round(tc().ambush*1.15);spawnPerimeterAmbush(this.app,n,true,true);s.lightningAlpha=.82;
        this.app.audio.playVariant('thunder',.66,1.02);this.app.notify(`🚨 O SILÊNCIO ACABOU · +${n} UNDEAD`);
      }
      if(s.tensionForceBossAt>0&&s.pendingBoss&&s.elapsed>=s.tensionForceBossAt){
        if(!(s.pendingBossVariant==='shadowDancer'&&s.shadowPrepUntil>s.elapsed)){
          this.app.horde.releasePendingHorde(.28);this.app.horde.releaseBoss();
        }
      }
      this.updateRageChaos();this.updateHavoc();
      if(s.elapsed>=s.nextThreatAt){
        if(this.canThreat())this.trigger(this.pickEvent());else s.nextThreatAt=s.elapsed+5;
      }
    }
  }

  // Visual layer for blackout/flicker/apparitions/HAVOC. No asset loading is replaced.
  const baseThrillerOverlay=MZV.Renderer.prototype.drawThrillerOverlay;
  MZV.Renderer.prototype.drawThrillerOverlay=function(){
    baseThrillerOverlay.call(this);
    const s=this.s;if(s.mission!=='thriller')return;
    const c=this.ctx,w=this.canvas.clientWidth,h=this.canvas.clientHeight,now=s.elapsed;
    let darkness=0;
    if(s.threatBlackoutUntil>now){const p=(now-s.threatBlackoutStart)/Math.max(.01,s.threatBlackoutUntil-s.threatBlackoutStart);darkness=.93*(1-Math.max(0,(p-.72)/.28));if(s.threatIntroFlashAt&&Math.abs(now-s.threatIntroFlashAt)<.13)darkness=.06;}
    if(s.threatFlickerUntil>now){const pulse=(Math.sin(now*23)>0?.55:.12)+(Math.sin(now*41)>.6?.22:0);darkness=Math.max(darkness,pulse);}
    if(s.threatFakeCalmUntil>now)darkness=Math.max(darkness,.18);
    if(darkness>0){c.save();c.fillStyle=`rgba(0,0,0,${Math.min(.96,darkness)})`;c.fillRect(0,0,w,h);c.restore();}
    if(s.threatApparitionKey&&now>=s.threatApparitionStart&&now<s.threatApparitionUntil){
      const dur=Math.max(.01,s.threatApparitionUntil-s.threatApparitionStart),p=MZV.clamp((now-s.threatApparitionStart)/dur,0,1),alpha=Math.sin(p*Math.PI);
      const img=this.asset(s.threatApparitionKey);if(img){
        const hh=Math.min(h*.68,360),ww=hh*(img.naturalWidth/img.naturalHeight),side=s.threatApparitionSide||1;
        const x=side<0?w*.18:w*.82,y=h*.52;
        c.save();c.globalAlpha=.12+.82*alpha;c.shadowColor='rgba(0,0,0,.9)';c.shadowBlur=28;c.drawImage(img,x-ww/2,y-hh/2,ww,hh);c.restore();
      }
    }
    if(s.havocActive){
      c.save();const pulse=.5+.5*Math.sin(now*7);const g=c.createRadialGradient(w/2,h/2,Math.min(w,h)*.18,w/2,h/2,Math.max(w,h)*.72);g.addColorStop(0,'rgba(80,0,0,0)');g.addColorStop(1,`rgba(130,0,0,${.18+.12*pulse})`);c.fillStyle=g;c.fillRect(0,0,w,h);c.restore();
    }
  };

  const baseRageHud=MZV.Renderer.prototype.drawRageHud;
  MZV.Renderer.prototype.drawRageHud=function(){
    if(!this.s.havocActive){baseRageHud.call(this);return;}
    const c=this.ctx,w=this.canvas.clientWidth,p=.5+.5*Math.sin(this.s.elapsed*8);
    c.save();c.textAlign='center';c.font=`1000 ${Math.round(45+9*p)}px Segoe UI`;c.fillStyle=`rgba(255,66,32,${.72+.28*p})`;c.shadowColor='#ff1d00';c.shadowBlur=30;c.fillText('HAVOC',w/2,65);c.shadowBlur=0;c.font='1000 15px Segoe UI';c.fillStyle='#fff';c.fillText(`RAGE + CARNAGE · SCORE ×5 · ${aliveEnemies(this.s)} AMEAÇAS`,w/2,91);c.restore();
  };

  // Updated Boss Bible schedule for Thriller.
  const baseBible=MZV.GameApp.prototype.bossBibleEntries;
  MZV.GameApp.prototype.bossBibleEntries=function(mission){
    if(mission!=='thriller')return baseBible.call(this,mission);
    return [
      {level:'3',name:'YELLOW THRILLER',type:'APARIÇÃO',img:'assets/images/bosses/yellowThriller/down.png',desc:'Primeiro aviso. Flash, gargalhada e desaparece.',cls:'apparition'},
      {level:'5',name:'CARNAGE I · YELLOW',type:'BOSS',img:'assets/images/bosses/yellowThriller/down.png',desc:'Primeiro Carnage real: boss + horda agressiva.'},
      {level:'9',name:'SHADOW DANCER',type:'BOSS',img:'assets/images/bosses/shadowDancer/down.png',desc:'15s de preparação com helicóptero; depois 4 vidas, dash e sombras.'},
      {level:'13',name:'YELLOW FIRST FORM',type:'BOSS',img:'assets/images/bosses/yellowThriller/down.png',desc:'Forma completa; Dance Shockwave e adds.'},
      {level:'17',name:'THRILLER BRUTE',type:'BOSS',img:'assets/images/enemies_thriller/powerBoss/down.png',desc:'Força bruta e pressão crescente.'},
      {level:'21',name:'BLACK/YELLOW',type:'REVEAL',img:'assets/images/bosses/blackYellowThriller/down.png',desc:'A nova forma revela-se antes da fase seguinte.',cls:'apparition'},
      {level:'27',name:'SHADOW DANCER PRIME',type:'BOSS',img:'assets/images/bosses/shadowDancer/down.png',desc:'Regressa mais rápido, com 6 vidas.'},
      {level:'35',name:'BLACK/YELLOW THRILLER',type:'BOSS',img:'assets/images/bosses/blackYellowThriller/down.png',desc:'Forma intermédia avançada; blackout step.'},
      {level:'43',name:'PRELUDE FINAL',type:'BOSS',img:'assets/images/bosses/werewolfThriller/down.png',desc:'Executioner + aparições do Werewolf.'},
      {level:'50',name:'THRILLER FINAL',type:'FINAL',img:'assets/images/bosses/redThriller/down.png',desc:'Red → Black/Yellow → Dual → Werewolf.',cls:'final'},
    ];
  };

  // Attach director to every local GameApp instance. Deserto remains untouched by Threat Events.
  const baseAppStart=MZV.GameApp.prototype.start;
  MZV.GameApp.prototype.start=function(...args){
    const out=baseAppStart.apply(this,args);
    if(!this.thrillerTension)this.thrillerTension=new ThrillerTensionDirector(this);
    this.thrillerTension.s=this.state;this.thrillerTension.reset();
    return out;
  };
  const baseAppUpdate=MZV.GameApp.prototype.update;
  MZV.GameApp.prototype.update=function(dt){
    const out=baseAppUpdate.call(this,dt);
    if(this.thrillerTension)this.thrillerTension.update(dt);
    return out;
  };

  window.addEventListener('DOMContentLoaded',()=>{
    const app=window.__MZV_APP__;
    if(app&&!app.thrillerTension){app.thrillerTension=new ThrillerTensionDirector(app);}
    const footer=document.querySelector('footer');if(footer)footer.textContent='V4.6.9.1 LOCAL TEST · Thriller Tension Director · Difficulty · Mobile FOV · HAVOC';
    document.title='MENESES: ZOMBIES & VAMPIROS — V4.6.9.1 LOCAL THRILLER TENSION';
  },{once:true});

  console.info('[MZV]',BUILD,'Thriller Tension Director loaded');
})();
