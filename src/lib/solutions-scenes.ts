/** Scènes d’illustration : aucun appel réseau, aucun faux résultat produit. */
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
for (const scene of document.querySelectorAll<HTMLElement>('[data-os-workspace]')) {
  const steps=[...scene.querySelectorAll<HTMLButtonElement>('[data-os-step]')];
  const details=[...scene.querySelectorAll<HTMLElement>('[data-os-detail]')];
  const zones=[...scene.querySelectorAll<HTMLElement>('[data-os-zone]')];
  const controls=scene.querySelector<HTMLElement>('[data-os-controls]');
  if(!controls)continue;
  const show=(index:number)=>{steps.forEach((step,i)=>step.setAttribute('aria-pressed',String(i===index)));details.forEach((detail,i)=>{detail.hidden=i!==index;});zones.forEach(zone=>zone.toggleAttribute('data-active',Number(zone.dataset.osZone)===index));};
  controls.hidden=false;scene.dataset.enhanced='';show(0);
  steps.forEach((step,i)=>step.addEventListener('click',()=>show(i)));
}
for (const scene of document.querySelectorAll<HTMLElement>('[data-model-scene]')) {
  const frames=[...scene.querySelectorAll<HTMLElement>('[data-model-frame]')];
  const steps=[...scene.querySelectorAll<HTMLButtonElement>('[data-model-step]')];
  const controls=scene.querySelector<HTMLElement>('[data-model-controls]');
  const pause=scene.querySelector<HTMLButtonElement>('[data-model-pause]');
  if (!controls || !pause || !frames.length) continue;
  let index=0, paused=reduced.matches, visible=false, timer: ReturnType<typeof setInterval>|undefined;
  const show=(next:number)=>{index=next;frames.forEach((frame,i)=>{frame.hidden=i!==index;});steps.forEach((step,i)=>step.setAttribute('aria-pressed',String(i===index)));};
  const sync=()=>{
    clearInterval(timer);timer=undefined;
    pause.disabled=reduced.matches;
    pause.textContent=reduced.matches?'Mouvement réduit : étapes manuelles':paused?'Lancer l’animation':'Mettre en pause';
    if (!paused && !document.hidden && visible && !reduced.matches) timer=setInterval(()=>show((index+1)%frames.length),5500);
  };
  controls.hidden=false;scene.dataset.enhanced='';show(0);
  pause.addEventListener('click',()=>{paused=!paused;sync();});
  steps.forEach((step,i)=>step.addEventListener('click',()=>{paused=true;show(i);sync();}));
  scene.addEventListener('focusin',(event)=>{if(event.target!==pause){paused=true;sync();}});
  document.addEventListener('visibilitychange',sync);
  reduced.addEventListener('change',()=>{paused=reduced.matches;sync();});
  if ('IntersectionObserver' in window) new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.15}).observe(scene);
  else {visible=true;sync();}
}
