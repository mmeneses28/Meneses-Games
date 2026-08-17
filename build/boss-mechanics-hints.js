(() => {
  'use strict';
  if (!window.MZV) return;

  const BUILD = '4.6.9.2-local-boss-mechanics';
  const diffId = () => window.MZV_SELECTED_DIFFICULTY || 'easy';
  const SHADOW = {
    easy:      { cap:3, cooldown:8.0, cloneHp:62,  cloneLife:10.0, exposed:2.7, damage:1.85 },
    hard:      { cap:4, cooldown:7.0, cloneHp:78,  cloneLife:10.5, exposed:2.6, damage:1.80 },
    nightmare: { cap:5, cooldown:6.0, cloneHp:94,  cloneLife:11.0, exposed:2.5, damage:1.75 },
    thriller:  { cap:6, cooldown:5.5, cloneHp:110, cloneLife:12.0, exposed:2.4, damage:1.70 },
  };
  const shadowCfg = boss => {
    const base = SHADOW[diffId()] || SHADOW.easy;
    // Prime is allowed one extra clone, but never uncontrolled multiplication.
    return boss?.bossName === 'SHADOW DANCER PRIME' ? { ...base, cap:base.cap+1, cloneHp:Math.round(base.cloneHp*1.18) } : base;
  };

  function activeShadowBoss(s) {
    return s.enemies.find(z => z.alive && z.isBoss && z.variant === 'shadowDancer') || null;
  }
  function shadowClones(s, boss=null) {
    return s.enemies.filter(z => z.alive && z.variant === 'shadowClone' && (!boss || !z.shadowOwner || z.shadowOwner === boss));
  }
  function profileFor(z) {
    if (!z || z.isMiniBoss) return null;
    if (z.variant === 'shadowDancer') return {
      id:'shadow', title:z.bossName||'SHADOW DANCER',
      intro:'DESTRÓI 2 CLONES · O ORIGINAL TEM AURA PÚRPURA',
      emergency:'NÃO PERSIGAS AS SOMBRAS · LIMPA 2 CLONES PARA O EXPOR'
    };
    if (z.variant === 'yellowThriller') return {
      id:'yellow', title:z.bossName||'YELLOW THRILLER',
      intro:'OBSERVA O CÍRCULO · ESQUIVA DO DANCE SHOCKWAVE',
      emergency:'DEPOIS DO SHOCKWAVE ELE FICA EXPOSTO · ATACA AÍ'
    };
    if (z.variant === 'blackYellowThriller') return {
      id:'blackYellow', title:z.bossName||'BLACK/YELLOW THRILLER',
      intro:'NO APAGÃO CONTINUA EM MOVIMENTO · ESPERA O FLASH',
      emergency:'SOBREVIVE AO BLACKOUT STEP · ATACA QUANDO ELE REAPARECER'
    };
    if (z.variant === 'thrillerFinal') {
      const form=z.form||'red';
      if (form === 'werewolf') return { id:'werewolf', title:'THRILLER WEREWOLF', intro:'QUANDO ELE BAIXAR O CORPO, MOVE-TE!', emergency:'FAZ O POUNCE FALHAR · ELE FICA EXPOSTO DEPOIS DO SALTO' };
      if (form === 'blackYellow') return { id:'finalBlack', title:'BLACK/YELLOW FORM', intro:'NO APAGÃO NÃO PARES · ATACA DEPOIS DO FLASH', emergency:'O BLACKOUT STEP TEM RECUPERAÇÃO · USA ESSA JANELA' };
      if (form === 'dual') return { id:'dual', title:'DUAL FORM', intro:'ALTERNA SHOCKWAVE E BLACKOUT · MUDA A TUA RESPOSTA', emergency:'ESQUIVA PRIMEIRO · CASTIGA A RECUPERAÇÃO DE CADA ATAQUE' };
      return { id:'red', title:'RED FORM', intro:'SAI DO CÍRCULO VERMELHO · ATACA NA RECUPERAÇÃO', emergency:'O RED SHOCKWAVE ABRE UMA JANELA CURTA · APROVEITA-A' };
    }
    if ((z.type === 'powerBoss' || z.bossName === 'GRAVEDIGGER BRUTE') && window.__MZV_APP__?.state?.mission === 'thriller') return {
      id:'brute', title:z.bossName||'THRILLER BRUTE',
      intro:'FAZ A INVESTIDA FALHAR · ATACA DURANTE A RECUPERAÇÃO',
      emergency:'NÃO TROQUES DANO DE FRENTE · ESQUIVA E CASTIGA O RECOVERY'
    };
    return null;
  }

  class BossHintSystem {
    constructor(app) {
      this.app=app; this.s=app.state; this.currentBoss=null; this.seen=new Set();
      this.overlay=this.ensureOverlay();
    }
    ensureOverlay() {
      let el=document.getElementById('bossHintOverlay');
      if (el) return el;
      const wrap=document.getElementById('gameWrap') || document.body;
      el=document.createElement('div'); el.id='bossHintOverlay';
      el.innerHTML='<div class="boss-hint-title"></div><div class="boss-hint-body"></div>';
      wrap.appendChild(el);
      if (!document.getElementById('bossHintStyles')) {
        const st=document.createElement('style'); st.id='bossHintStyles';
        st.textContent=`
          #bossHintOverlay{position:absolute;left:50%;top:72px;transform:translate(-50%,-10px);z-index:24;min-width:min(560px,78vw);max-width:78vw;padding:10px 16px;border-radius:14px;border:1px solid rgba(255,255,255,.22);background:rgba(6,8,12,.88);box-shadow:0 10px 32px rgba(0,0,0,.42);text-align:center;pointer-events:none;opacity:0;transition:opacity .16s,transform .16s;backdrop-filter:blur(3px)}
          #bossHintOverlay.show{opacity:1;transform:translate(-50%,0)}
          #bossHintOverlay.exposed{border-color:rgba(255,223,78,.9);box-shadow:0 0 28px rgba(255,198,43,.28)}
          .boss-hint-title{font:1000 13px/1 Segoe UI,Arial,sans-serif;letter-spacing:.12em;color:#f6c94c;margin-bottom:5px}
          .boss-hint-body{font:900 15px/1.25 Segoe UI,Arial,sans-serif;color:#fff}
          .touch-device #bossHintOverlay{top:54px;min-width:min(520px,72vw);max-width:72vw;padding:7px 11px}.touch-device .boss-hint-title{font-size:10px}.touch-device .boss-hint-body{font-size:12px}
        `;
        document.head.appendChild(st);
      }
      return el;
    }
    show(title,body,duration=2.9,key='',exposed=false,force=false) {
      if (key && this.seen.has(key) && !force) return;
      if (key) this.seen.add(key);
      const el=this.overlay||this.ensureOverlay();
      el.querySelector('.boss-hint-title').textContent=title;
      el.querySelector('.boss-hint-body').textContent=body;
      el.classList.toggle('exposed',!!exposed); el.classList.add('show');
      const token=(el._hintToken||0)+1; el._hintToken=token;
      setTimeout(()=>{ if(el._hintToken===token) el.classList.remove('show','exposed'); },Math.round(duration*1000));
    }
    intro(z) {
      const p=profileFor(z); if(!p)return;
      z._bossHintStartedAt=this.s.elapsed; z._bossHintLife=z.lives; z._bossHintEmergencyAt=this.s.elapsed+20;
      if(z.variant==='thrillerFinal')z._bossHintFormKey=z.form||'red';
      this.show(`HINT · ${p.title}`,p.intro,3.4,`intro:${p.id}:${this.s.level}`);
    }
    contextual(z,kind) {
      const p=profileFor(z); if(!p)return;
      const map={
        danceShockwave:'O CÍRCULO É O AVISO · SAI ANTES DO IMPACTO',
        redShockwave:'SHOCKWAVE · SAI DO CÍRCULO · DEPOIS ATACA',
        blackoutStep:'BLACKOUT STEP · CONTINUA EM MOVIMENTO · ESPERA O FLASH',
        werewolfPounce:'POUNCE · SAI DO ALVO · ELE FICA VULNERÁVEL AO FALHAR',
        bruteRush:'INVESTIDA · DESVIA PARA O LADO · ATACA NA RECUPERAÇÃO',
        graveSlam:'GRAVE SLAM · AFASTA-TE · ATACA QUANDO ELE RECUPERAR',
        shadowNova:'SHADOW NOVA · NÃO CORRAS ATRÁS DE TODOS · LIMPA OS CLONES'
      };
      if(map[kind])this.show(`MECÂNICA · ${p.title}`,map[kind],2.8,`special:${p.id}:${kind}:${this.s.level}`);
    }
    exposed(z,duration,label='EXPOSTO!') {
      const p=profileFor(z); if(!p)return;
      this.show(`${label} · ${p.title}`,'ATACA AGORA · DANO AUMENTADO',Math.min(2.6,duration),`exposed:${p.id}:${Math.floor(this.s.elapsed/3)}`,true,true);
    }
    cloneProgress(boss,count) {
      const cfg=shadowCfg(boss);
      if(count%2===1)this.show('SHADOW DANCER','1/2 CLONES · DESTRÓI MAIS 1 PARA O EXPOR',2.0,'',false,true);
    }
    update() {
      const s=this.s;if(!s.running||s.mission!=='thriller')return;
      const bosses=s.enemies.filter(z=>z.alive&&z.isBoss&&!z.isMiniBoss);
      const boss=bosses[0]||null;
      if(boss!==this.currentBoss){this.currentBoss=boss;if(boss)this.intro(boss);}
      if(!boss)return;
      const p=profileFor(boss);
      // Final boss form changes deserve a fresh, very short strategy cue.
      const formKey=boss.variant==='thrillerFinal'?(boss.form||'red'):'';
      if(formKey && boss._bossHintFormKey!==formKey){boss._bossHintFormKey=formKey;const fp=profileFor(boss);if(fp)this.show(`FORMA · ${fp.title}`,fp.intro,2.9,`form:${formKey}`);}
      if(boss.lives!==undefined && boss._bossHintLife!==boss.lives){boss._bossHintLife=boss.lives;boss._bossHintEmergencyAt=s.elapsed+18;}
      if(s.elapsed>=(boss._bossHintEmergencyAt||Infinity)){
        boss._bossHintEmergencyAt=Infinity;
        if(p)this.show(`HINT · ${p.title}`,p.emergency,3.2,`emergency:${p.id}:${s.level}:${boss.lives}`);
      }
    }
  }

  function setupClone(e,boss) {
    const c=shadowCfg(boss);
    e.variant='shadowClone'; e.shadowOwner=boss; e.shadowSpawnAt=window.__MZV_APP__?.state?.elapsed||0;
    e.shadowExpiresAt=e.shadowSpawnAt+c.cloneLife;
    e.maxHp=c.cloneHp; e.hp=c.cloneHp;
    e.baseSpeed=Math.min(e.baseSpeed*1.06,185); e.speed=e.baseSpeed;
    e.damage*=.72;
    return e;
  }
  function enforceCloneCap(s,boss) {
    if(!boss)return;
    const cap=shadowCfg(boss).cap;
    const list=shadowClones(s,boss).sort((a,b)=>(a.shadowSpawnAt||0)-(b.shadowSpawnAt||0));
    // If legacy code spawned too many at once, remove the newest excess without awarding score.
    while(list.length>cap){const e=list.pop();e.alive=false;}
  }
  function normalizeNewClones(s,boss,beforeSet=null) {
    if(!boss)return;
    for(const e of s.enemies){
      if(!e.alive||e.variant!=='shadowClone')continue;
      if(beforeSet && beforeSet.has(e))continue;
      setupClone(e,boss);
    }
    enforceCloneCap(s,boss);
  }
  function grantExposed(z,duration,mult,label='EXPOSTO!') {
    const s=window.__MZV_APP__?.state;if(!z||!s)return;
    z.exposedUntil=Math.max(z.exposedUntil||0,s.elapsed+duration); z.exposedDamageMultiplier=Math.max(z.exposedDamageMultiplier||1,mult);
    z.stunUntil=Math.max(z.stunUntil||0,s.elapsed+Math.min(.55,duration*.24));
    const hints=window.__MZV_APP__?.bossHints;if(hints)hints.exposed(z,duration,label);
  }

  // Shadow clone creation is now capped and paced. Only the real boss can create them.
  const baseSpawnBossAdds=MZV.EnemyMotionSystem.prototype.spawnBossAdds;
  MZV.EnemyMotionSystem.prototype.spawnBossAdds=function(z,count,fast=false){
    if(z?.variant!=='shadowDancer')return baseSpawnBossAdds.call(this,z,count,fast);
    const s=this.s,c=shadowCfg(z),existing=shadowClones(s,z).length,room=Math.max(0,c.cap-existing);
    if(room<=0)return;
    const before=new Set(s.enemies);
    baseSpawnBossAdds.call(this,z,Math.min(count,room),fast);
    normalizeNewClones(s,z,before);
  };

  // Exposed Shadow Dancer cannot instantly dash/special out of the punish window.
  const baseVampireDash=MZV.EnemyMotionSystem.prototype.startVampireDash;
  MZV.EnemyMotionSystem.prototype.startVampireDash=function(z,t,d){
    if(z?.variant==='shadowDancer' && (z.exposedUntil||0)>this.s.elapsed)return false;
    return baseVampireDash.call(this,z,t,d);
  };
  const baseStartBossSpecial=MZV.EnemyMotionSystem.prototype.startBossSpecial;
  MZV.EnemyMotionSystem.prototype.startBossSpecial=function(z,t,d){
    if((z?.exposedUntil||0)>this.s.elapsed)return false;
    const ok=baseStartBossSpecial.call(this,z,t,d);
    if(ok)window.__MZV_APP__?.bossHints?.contextual(z,z.specialAttack);
    return ok;
  };
  const baseUpdateBossSpecial=MZV.EnemyMotionSystem.prototype.updateBossSpecial;
  MZV.EnemyMotionSystem.prototype.updateBossSpecial=function(z){
    const kind=z?.specialAttack;
    const was=!!kind;
    const out=baseUpdateBossSpecial.call(this,z);
    if(was && !z.specialAttack){
      if(kind==='shadowNova'){
        const c=shadowCfg(z); z.specialCooldown=Math.max(z.specialCooldown||0,c.cooldown);
      } else if(kind==='danceShockwave' || kind==='redShockwave'){
        grantExposed(z,2.15,1.55,'RECUPERAÇÃO');
      } else if(kind==='blackoutStep'){
        grantExposed(z,2.0,1.60,'FLASH · EXPOSTO');
      } else if(kind==='werewolfPounce'){
        grantExposed(z,2.55,1.78,'POUNCE FALHOU');
      } else if(kind==='bruteRush' || kind==='graveSlam'){
        grantExposed(z,2.25,1.65,'DESEQUILIBRADO');
      }
    }
    return out;
  };

  // Apply exposed damage multiplier and normalize the legacy life-loss clone burst.
  const baseDamageEnemy=MZV.CombatSystem.prototype.damageEnemy;
  MZV.CombatSystem.prototype.damageEnemy=function(z,dmg,...rest){
    const s=this.s;
    if((z?.exposedUntil||0)>s.elapsed)dmg*=z.exposedDamageMultiplier||1.5;
    const bossWasShadow=z?.alive&&z.isBoss&&z.variant==='shadowDancer';
    const before=bossWasShadow?new Set(s.enemies):null;
    const oldLives=z?.lives;
    const out=baseDamageEnemy.call(this,z,dmg,...rest);
    if(bossWasShadow && z.alive){
      normalizeNewClones(s,z,before);
      // Every life loss gets the same controlled cooldown instead of a clone explosion.
      if(oldLives!==z.lives)z.specialCooldown=Math.max(z.specialCooldown||0,shadowCfg(z).cooldown*.65);
    }
    return out;
  };

  const baseKillEnemy=MZV.CombatSystem.prototype.killEnemy;
  MZV.CombatSystem.prototype.killEnemy=function(z,source='support'){
    const wasClone=!!(z?.alive&&z.variant==='shadowClone');
    const owner=wasClone?(z.shadowOwner||activeShadowBoss(this.s)):null;
    const out=baseKillEnemy.call(this,z,source);
    if(wasClone && owner?.alive){
      owner.shadowCloneDefeated=(owner.shadowCloneDefeated||0)+1;
      const n=owner.shadowCloneDefeated;
      if(n%2===0){
        const c=shadowCfg(owner); grantExposed(owner,c.exposed,c.damage,'2 CLONES · EXPOSTO');
      }
      window.__MZV_APP__?.bossHints?.cloneProgress(owner,n);
    }
    return out;
  };

  // Original Shadow Dancer is always identifiable. Exposure becomes unmistakable.
  const baseDrawEnemyShape=MZV.Renderer.prototype.drawEnemyShape;
  MZV.Renderer.prototype.drawEnemyShape=function(z){
    const c=this.ctx,now=this.s.elapsed;
    if(z?.variant==='shadowDancer'){
      const exposed=(z.exposedUntil||0)>now,p=.5+.5*Math.sin(now*(exposed?10:5));
      c.save();
      c.strokeStyle=exposed?`rgba(255,222,70,${.72+.25*p})`:`rgba(153,103,255,${.38+.28*p})`;
      c.lineWidth=exposed?6:4;c.shadowColor=exposed?'rgba(255,205,50,.8)':'rgba(116,65,255,.7)';c.shadowBlur=exposed?24:16;
      c.beginPath();c.arc(z.x,z.y,(z.radius||34)+(exposed?23:16)+p*4,0,Math.PI*2);c.stroke();c.restore();
    } else if((z?.exposedUntil||0)>now && z.isBoss){
      const p=.5+.5*Math.sin(now*10);c.save();c.strokeStyle=`rgba(255,222,70,${.58+.32*p})`;c.lineWidth=5;c.shadowColor='rgba(255,200,40,.7)';c.shadowBlur=20;c.beginPath();c.arc(z.x,z.y,(z.radius||40)+20+p*3,0,Math.PI*2);c.stroke();c.restore();
    }
    const out=baseDrawEnemyShape.call(this,z);
    if((z?.exposedUntil||0)>now && z.isBoss){
      c.save();c.textAlign='center';c.font='1000 12px Segoe UI';c.fillStyle='#ffe24d';c.shadowColor='#000';c.shadowBlur=5;c.fillText('EXPOSTO',z.x,z.y-this.enemyHeight(z)/2-58);c.restore();
    }
    return out;
  };

  // Local lifecycle: expire clones, install hints, and keep caps valid even after phase transitions.
  const baseAppStart=MZV.GameApp.prototype.start;
  MZV.GameApp.prototype.start=function(...args){
    const out=baseAppStart.apply(this,args);
    if(!this.bossHints)this.bossHints=new BossHintSystem(this); else {this.bossHints.s=this.state;this.bossHints.currentBoss=null;this.bossHints.seen.clear();}
    return out;
  };
  const baseAppUpdate=MZV.GameApp.prototype.update;
  MZV.GameApp.prototype.update=function(dt){
    const out=baseAppUpdate.call(this,dt);
    const s=this.state;
    if(s.mission==='thriller'){
      const boss=activeShadowBoss(s);
      for(const e of s.enemies){
        if(e.alive&&e.variant==='shadowClone'&&(e.shadowExpiresAt||Infinity)<=s.elapsed)e.alive=false;
      }
      if(boss){
        // Adopt any legacy clone that was created by core phase code before our wrapper saw it.
        for(const e of s.enemies)if(e.alive&&e.variant==='shadowClone'&&!e.shadowOwner)setupClone(e,boss);
        enforceCloneCap(s,boss);
      }
      this.bossHints?.update();
    }
    return out;
  };

  // Update Boss Bible descriptions with the counter-play language used in combat.
  const baseBible=MZV.GameApp.prototype.bossBibleEntries;
  MZV.GameApp.prototype.bossBibleEntries=function(mission){
    const rows=baseBible.call(this,mission);
    if(mission!=='thriller')return rows;
    return rows.map(r=>{
      const n=(r.name||'').toUpperCase();
      if(n.includes('SHADOW DANCER'))return {...r,desc:`${r.desc} Estratégia: destrói 2 clones para o expor; o original tem aura púrpura.`};
      if(n.includes('BLACK/YELLOW'))return {...r,desc:`${r.desc} Estratégia: mantém-te em movimento no blackout e ataca depois do flash.`};
      if(n.includes('YELLOW'))return {...r,desc:`${r.desc} Estratégia: sai do Dance Shockwave e ataca na recuperação.`};
      if(n.includes('BRUTE'))return {...r,desc:`${r.desc} Estratégia: esquiva da investida e castiga a recuperação.`};
      if(n.includes('FINAL'))return {...r,desc:`${r.desc} Cada forma recupera uma mecânica anterior; esquiva primeiro e ataca nas janelas EXPOSTO.`};
      return r;
    });
  };

  window.addEventListener('DOMContentLoaded',()=>{
    const app=window.__MZV_APP__;
    if(app&&!app.bossHints)app.bossHints=new BossHintSystem(app);
    const footer=document.querySelector('footer');if(footer)footer.textContent='V4.6.9.2 LOCAL TEST · Boss Mechanics + Hints · Shadow Clone Balance · Thriller Tension';
    document.title='MENESES: ZOMBIES & VAMPIROS — V4.6.9.2 LOCAL BOSS MECHANICS';
  },{once:true});

  console.info('[MZV]',BUILD,'boss mechanics + combat hints loaded');
})();
