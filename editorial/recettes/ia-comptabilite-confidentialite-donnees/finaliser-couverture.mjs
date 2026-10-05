import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
const d='editorial/recettes/ia-comptabilite-confidentialite-donnees';
const m=JSON.parse(readFileSync(`${d}/couverture-skills.json`));
const a='AUDIT-EDITORIAL.md', v='verification-candidat.json', r='recette.json';
const groups={
 editorial:['blog','blog-audit','blog-brand','blog-brief','blog-cannibalization','blog-cluster','blog-flow','blog-outline','blog-persona','blog-strategy','blog-taxonomy','blog-write','seo','seo-cluster','seo-content','seo-content-brief','seo-flow','seo-plan','seo-sxo'],
 tech:['blog-schema','blog-seo-check','seo-audit','seo-images','seo-page','seo-schema','seo-technical'],
 image:['blog-image'],
 style:['blog-style'],
 geo:['blog-geo','seo-geo'],
 calendar:['blog-calendar'],
 review:['blog-analyze','blog-factcheck'],
 served:['seo-sitemap','seo-drift']
};
for(const row of m.lignes){
 if(row.etat==='N/A'||row.etat==='indisponible')continue;
 const g=Object.entries(groups).find(([,names])=>names.includes(row.skill))?.[0];
 if(g==='editorial'){row.etat='execute';row.preuves=[a,r,'corps.md',v];row.constat='Audit propre à cette intention, corps et recette appliqués ; contrôles techniques reliés au HTML. Pas de métrique Google attribuée.';}
 else if(g==='tech'){row.etat='execute';row.preuves=[v,a];row.constat='HTML réellement construit : métadonnées, schema, figures, liens et navigateur contrôlés. Alternative native au runtime SEO indisponible, portée candidat uniquement.';}
 else if(g==='image'){row.etat='execute';row.preuves=['image-source.json',a,'../../articles/ia-comptabilite-confidentialite-donnees/preuves/image/visual-review.json'];row.constat='Deux générations ; première rejetée par palette ; seconde mesurée et regardée, deux figures HTML figées et contrôlées.';}
 else if(g==='style'){row.etat='execute';row.preuves=['style.json',a];row.constat='cognitive_load.py réellement exécuté : Healthy, 5,2, zéro surcharge ; analyseur heuristique français.';}
 else if(g==='geo'){row.etat='execute';row.preuves=['geo.json',v,a];row.constat='Structure extractible, réponse directe et définitions ; ai_citation_score exécuté sur HTML, heuristique pas visibilité IA mesurée.';}
 else if(g==='calendar'){row.etat='execute';row.preuves=[r,a,'../../../docs/strategy/site-v3/CONTENT-CALENDAR.md','../../../docs/strategy/site-v3/backlog-v3.json'];row.constat='Réservation explicite réelle 05/10 ; build-cluster-plan.py et --slot verts, plafonds conservés.';}
 else if(g==='review'){row.etat='partiel';row.preuves=[r,a,v,'analyse-blog.json'];row.constat='Sources/claims préparés et analyse technique exécutée ; jugement indépendant encore à exécuter sur carte metier.';}
 else if(g==='served'){row.etat='a-executer';row.preuves=[];row.constat='Publication réelle non faite : contrôle sitemap/baseline différé à reprise après revue.';}
 else {row.etat='partiel';row.preuves=[a];row.constat='Diagnostic parent daté et limites décrites ; aucune mesure directe nouvelle ni résultat inventé.';}
 row.changement='Application bornée documentée dans AUDIT-EDITORIAL ; voir preuves et limites de phase.';
}
m.stade='candidat-prepare-avant-revue';
m.observed_at=new Date().toISOString();
m.verification_structurelle={union:m.lignes.length,doublons:[],portee:'63 lignes reprises de l’inventaire chargé ; existence des preuves vérifiée, pas verdict métier.'};
assert.equal(m.lignes.length,63);assert.equal(new Set(m.lignes.map(x=>x.skill)).size,63);
for(const row of m.lignes){if(row.etat==='execute')assert.ok(row.preuves.length);for(const p of row.preuves)assert.ok(existsSync(`${d}/${p}`),`${row.skill}: ${p}`);}
m.preuves_candidat_observees=[r,'corps.md','journal-rejeu.json',v,a];
m.constat_presence='Checkpoint de lecture antérieur conservé ; présente matrice porte les preuves du candidat préparé et les contrôles encore différés.';
m.regle_etats='execute = application locale bornée par les preuves ; partiel = mesures ou jugement incomplets ; publication a-executer avant reprise ; aucun PASS indépendant revendiqué.';
writeFileSync(`${d}/couverture-candidat.json`,JSON.stringify(m,null,2)+'\n');
writeFileSync(`${d}/COUVERTURE-CANDIDAT.md`,'# Couverture du candidat avant revue\n\nMatrice finale de phase : couverture-candidat.json ; checkpoint lectures : couverture-skills.json.\n\n| Compétence | État | Preuves | Constat |\n|---|---|---|---|\n'+m.lignes.map(x=>`| ${x.skill} | ${x.etat} | ${x.preuves.join(', ')} | ${x.constat.replaceAll('|','/')} |`).join('\n')+'\n');
console.log(JSON.stringify(m.lignes.reduce((a,x)=>(a[x.etat]=(a[x.etat]??0)+1,a),{})));
