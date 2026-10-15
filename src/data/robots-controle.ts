import type { Robot } from './robots';
const required = [...Array.from({length:12},(_,i)=>`EC${String(i+1).padStart(2,'0')}`),...Array.from({length:18},(_,i)=>`XI${String(i+1).padStart(2,'0')}`)];
export function verifierCatalogueRobots(robots: readonly Robot[]) {
  const erreurs:string[]=[];
  const ids=new Set(robots.map(r=>r.id)),slugs=new Set(robots.map(r=>r.slug));
  if(ids.size!==robots.length||slugs.size!==robots.length)erreurs.push('Identifiant ou slug dupliqué');
  const couvertures=robots.flatMap(r=>r.couverture);
  for(const id of required)if(couvertures.filter(c=>c===id).length!==1)erreurs.push(`Couverture absente ou dupliquée : ${id}`);
  for(const r of robots){
    if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(r.slug))erreurs.push(`${r.id}: slug invalide`);
    if(r.demonstration.cas.length!==4||!r.demonstration.cas.some(c=>c.decision==='Arrêt'&&/motif/i.test(c.sortie)))erreurs.push(`${r.id}: quatre cas et un arrêt motivé requis`);
    if(!r.demonstration.cas.every(c=>['Préparé','À valider','Arrêt'].includes(c.decision)))erreurs.push(`${r.id}: décision inconnue`);
    if(!/fictif|fictive/i.test(r.demonstration.dossier))erreurs.push(`${r.id}: mention fictive requise`);
    if(r.faq.length<5||r.faq.length>6||new Set(r.faq.map(([q])=>q)).size!==r.faq.length)erreurs.push(`${r.id}: FAQ incomplète ou dupliquée`);
    if(r.livrables.length<3||r.taches.length<4||r.comparaison.length!==4)erreurs.push(`${r.id}: tâches ou livrables incomplets`);
    for(const key of ['besoin','declencheur','rythme','usage','h1','introduction'] as const)if(!r[key]?.trim())erreurs.push(`${r.id}: ${key} absent`);
    if(r.contact.length!==3||r.contact.some(v=>!v.trim()))erreurs.push(`${r.id}: trois tâches de départ requises`);
    if(r.voisins.length<2||r.voisins.some(id=>!ids.has(id)||id===r.id)||new Set(r.voisins).size!==r.voisins.length)erreurs.push(`${r.id}: voisins invalides`);
    if(!r.frontiere.automatique.length||!r.frontiere.validation.length||!r.frontiere.humain.length||!r.frontiere.arrets.length)erreurs.push(`${r.id}: frontière incomplète`);
    if(!r.image.src.startsWith('/robots/')||!r.image.alt||!/^#[0-9a-f]{6}$/i.test(r.image.couleur))erreurs.push(`${r.id}: image incomplète`);
    if(!r.seo.titre||!r.seo.description||!r.seo.requete)erreurs.push(`${r.id}: SEO incomplet`);
    if(/PilotGuard|Emails & actions|Veille prospect|Recrutement LinkedIn|Prospection LinkedIn|Onboarding clients|Optimisation période fiscale/i.test(r.nom))erreurs.push(`${r.id}: entrée hors périmètre`);
  }
  if(new Set(robots.map(r=>r.seo.description)).size!==robots.length)erreurs.push('Descriptions dupliquées');
  if(erreurs.length)throw new Error(erreurs.join('\n'));
  return true;
}
