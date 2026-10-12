import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { fetch } from 'undici';
import { BLOG_SKILLS, SEO_SKILLS } from '../../../../scripts/lib/blog-pipeline.mjs';
import { unitesRendues, verifierRegleEcrite, injecterPreuvesInline } from '../../../../scripts/blog-forge.mjs';
const dir=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const root=resolve(dir,'../../..');
const read=(p)=>JSON.parse(readFileSync(p,'utf8'));
const hash=(v)=>createHash('sha256').update(v).digest('hex');
const recipe=read(join(dir,'recette.json'));const body=readFileSync(join(dir,'corps.md'),'utf8');
const replay=read(join(dir,'preuves/rejeu.json'));const reviews=read(join(dir,'revues.json'));const claims=read(join(dir,'preuves/claims-techniques.json'));
const controls=[];
function check(name,fn){fn();controls.push({name,status:'vérifié'});}
check('Règle écrite native',()=>assert.deepEqual(verifierRegleEcrite(body,{date:recipe.date}),[]));
check('Corps revu inchangé',()=>assert.equal(reviews.subject.bodySha256,hash(body.trim())));
check('Claims natifs liés au corps',()=>assert.equal(claims.articleSha256,hash(body.trim())));
check('Claims sensibles et verdicts indépendants',()=>{assert.equal(claims.claims.length,3);assert.deepEqual(Object.keys(reviews.business.claims).sort(),claims.claims.map(c=>c.id).sort());assert.ok(Object.values(reviews.business.claims).every(c=>c.verdict==='soutient'));});
check('Chaque citation et copie intègre',()=>{for(const s of recipe.sources){const raw=readFileSync(join(dir,`preuves/sources/${s.id}.source.txt`));const proof=read(join(dir,`preuves/sources/${s.id}.json`));assert.equal(hash(raw),proof.contentSha256);assert.ok(raw.toString().includes(s.excerpt));assert.equal(proof.httpStatus,200);}});
check('Citations intégrées et aucune section Sources',()=>{assert.equal((body.match(/\]\(https:/g)||[]).length,3);assert.ok(!/^## Sources?\s*$/m.test(body));});
check('12 lignes, 11 clés, 1 doublon',()=>{assert.equal(replay.cas.length,12);assert.equal(new Set(replay.cas.map(c=>c.cle)).size,11);assert.equal(replay.cas.filter(c=>c.entree.doublon).length,1);});
check('Agrégats 7/2/2/1',()=>assert.deepEqual(Object.values(replay.agrege),[7,2,2,1]));
check('Cas attendus = obtenus = tableau publié',()=>{for(const c of replay.cas){assert.equal(c.attendu,c.obtenu);assert.ok(body.includes(`| ${c.obtenu} |`));}});
check('Deux ancrages de figures natifs',()=>assert.equal((injecterPreuvesInline(body,recipe.inlineProofs).match(/data-blog-proof/g)||[]).length,2));
check('Alts dans la borne125',()=>assert.ok([recipe.image.alt,...recipe.inlineProofs.map(p=>p.alt)].every(t=>[...t].length<=125)));
check('Charte sans mot catalogue ni tiret cadratin',()=>assert.ok(!/(?:\bmodule\b|complément Excel|\u2014|revue métier|fact-check|non attesté)/i.test(body)));
check('Métadonnées déclarées bornées',()=>{assert.ok(recipe.tabTitle.length<=70);assert.ok(recipe.description.length<=160);assert.ok(recipe.description.length>=50);assert.equal(recipe.cta.label,'Confier cette tâche');assert.equal(recipe.cta.destination,'/contact');});
check('Score indépendant additionné, pas inventé',()=>assert.equal(Object.values(reviews.qualite.categories).reduce((n,c)=>n+c.score,0),reviews.qualite.score));
const titles=[];
for(const name of readdirSync(join(root,'src/content/blog')).filter(n=>n.endsWith('.md'))){const content=readFileSync(join(root,'src/content/blog',name),'utf8');const title=/^titre:\s*(.+)$/m.exec(content)?.[1];const query=/^primaryQuery:\s*(.+)$/m.exec(content)?.[1];titles.push({slug:name.replace(/\.md$/,''),title,query});}
check('Pas de page concurrente locale sur la requête exacte',()=>assert.ok(!titles.some(t=>t.slug!==recipe.slug&&t.query?.replaceAll('"','')===recipe.primaryQuery)));
const links=[];
for(const path of recipe.links.outgoing){assert.ok(body.includes(`](${path})`));const url='https://memlia.fr'+path.split('#')[0];const r=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 MemliaLinkCheck'},signal:AbortSignal.timeout(30000)});const html=await r.text();const fragment=path.split('#')[1];const anchor=fragment?html.includes(`id="${fragment}"`):true;assert.equal(r.status,200,url);assert.ok(anchor,path);links.push({path,http:r.status,finalUrl:r.url,anchorFound:anchor});}
writeFileSync(join(dir,'preuves/verification.json'),JSON.stringify({checkedAt:new Date().toISOString(),controls,links,inventory:titles,cannibalisation:'Pas de requête primaire identique dans les sources locales ; similarité pilier/social/relance différenciée par intention. Aucun classement Google revendiqué.',publication_completed:false},null,2)+'\n');
const executed={
 'blog-brief':'BRIEF.md : lectorat, requêtes du backlog, recherche qualitative et limites observées.',
 'blog-outline':'BRIEF.md : how-to-guide lu, plan et quatre étapes avec critère concret.',
 'blog-write':'corps.md : réponse70mots, définitions, frontière, douze lignes rejouées, FAQ et maillage.',
 'blog-factcheck':'preuves/claims-techniques.json, sources et revues.json : trois citations soutenues dans leur contexte.',
 'blog-image':'Provenance OpenAI exacte, huit dérivés, palette observée et revue indépendante six critères.',
 'blog-cannibalization':'preuves/verification.json : inventaire local et absence de requête primaire égale ; intentions proches différenciées.',
 'blog-analyze':'revues.json et revue-independante.md : score conseil83 calculé, réserves techniques distinctes du fond.',
 'blog-seo-check':'preuves/rendu-controles.json et verification.json : hiérarchie, métadonnées déclarées, liens HTTP/ancres, figures. Métadonnées finales à platform.',
 'blog-geo':'Réponse et définitions autonomes, tableaux thead, citations exactes ; revue ai-citability. Crawler public non qualifié.',
 'seo-content-brief':'BRIEF.md : guide opérationnel, trois pages concurrentes ouvertes, aucun score concurrent fabriqué.',
 'seo-content':'Corps, style.json et revue indépendante : auteur nommé, méthode fictive traçable, besoin du portefeuille.',
 'seo-images':'Dérivés réels AVIF/WebP et deux figures, tailles et alts vérifiés ; insertion picture finale par forge.',
 'memlia-blog-strategie':'Charte v5 et runbook main frais lus ; fabrication isolée et passage à platform sans modifier le garde.',
};
const pending={
 'blog-schema':'Gabarit ArticleJsonLd canonique à matérialiser : pas de JSON-LD fabriqué dans l’aperçu.',
 'seo-schema':'Validation du graphe final dans le HTML public à platform, non prouvée dans l’aperçu NOINDEX.',
 'seo-page':'Contrôles locaux effectués ; canonical, OG/Twitter, indexabilité et page publique restent phase livraison.',
 'seo-technical':'Chromium sans débordement ni erreur sur aperçu ; robots, sitemap, en-têtes, CI et production restent à contrôler.',
 'seo-sitemap':'Pas de route publiée encore ; entrée réelle à vérifier après matérialisation/publication.',
 'seo-drift':'Baseline article, /blog et pilier à poser après publication, pas maintenant.',
 'seo-google':'GSC non relevé ; aucune métrique déduite de l’absence de page.',
 'blog-google':'GSC non relevé ; aucun zéro synthétique présenté comme mesure.',
};
const na={
 'blog-style':'Pas d’apprentissage de voix sur cinq articles : charte stable ; diagnostic cognitive_load réellement joué dans style.json.',
 'blog-audit':'Audit complet du blog hors périmètre : candidat unique, analyse indépendante et inventaire local seulement.',
 'seo-audit':'Audit complet multisurface hors périmètre : fabrication d’un seul article.',
 'blog-rewrite':'Nouveau candidat adapté d’une proposition privée, pas republication d’un article public.',
 'blog-chart':'Pas de série statistique ni graphique ; états et totaux fictifs dans écrans HTML.',
 'blog-repurpose':'Aucun canal externe mandaté pour cette fabrication.',
 'blog-notebooklm':'Absent du catalogue fourni ; lecture primaire directe, aucun notebook nécessaire.',
 'blog-audio':'Absent du catalogue fourni ; aucune version audio demandée.',
 'seo-dataforseo':'Recherche qualitative et mesure backlog réutilisées ; pas de nouvel achat ni de volume revendiqué.',
 'seo-image-gen':'Couverture native OpenAI déjà fournie ; aucune nouvelle génération.',
 'seo-local':'Aucune intention géographique pour le suivi fiscal d’un portefeuille.',
 'seo-maps':'Aucune fiche locale concernée.',
 'seo-hreflang':'Article français, aucune version linguistique supplémentaire.',
 'seo-ecommerce':'Ni produit marchand ni catalogue de prix.',
 'seo-programmatic':'Article unique rédigé, pas de série de variantes.',
 'blog-multilingual':'Français uniquement.',
 'blog-translate':'Aucune traduction demandée.',
 'blog-localize':'Un seul marché, France.',
 'blog-locale-audit':'Pas de variantes linguistiques.',
 'blog-decay':'Article non publié, aucun déclin mesurable.',
 'seo-backlinks':'Pas de campagne de liens externes dans cette carte.',
 'seo-competitor-pages':'Lecture concurrentielle dans le brief, pas de comparatif fournisseur public.',
};
const skills=[...BLOG_SKILLS,...SEO_SKILLS,'memlia-blog-strategie'];
const rows=skills.map(skill=>({skill,applicability:executed[skill]||pending[skill]?'applicable':'N/A',execution:executed[skill]?'exécuté sur fabrication':pending[skill]?'partiel, suite platform':'N/A motivé',evidence:executed[skill]||pending[skill]||na[skill]||'Décisions de stratégie, marque, persona, calendrier, cluster, taxonomie et workflow déjà définies par le backlog et la charte ; pas de nouveau livrable distinct dans cette carte.',independentReview:skill==='blog-analyze'||skill==='blog-factcheck'||skill==='blog-image'}));
writeFileSync(join(dir,'preuves/matrice-skills.json'),JSON.stringify({date:'2026-10-12',registry:{blog:BLOG_SKILLS.length,seo:SEO_SKILLS.length},scope:'Lecture du registre complet existant ; état honnête par phase, aucun RUN généré automatiquement ne tient lieu de preuve.',referenceCampaign:'docs/qa/cac-f4-livraison/catalogue-skills-2026-10-12.json ; matrice lue mais aucun avis CAC transféré.',rows},null,2)+'\n');
console.log(`${controls.length} contrôles exécutés, ${links.length} liens HTTP200/ancres, matrice ${rows.length} entrées (${BLOG_SKILLS.length}Blog/${SEO_SKILLS.length}SEO).`);
