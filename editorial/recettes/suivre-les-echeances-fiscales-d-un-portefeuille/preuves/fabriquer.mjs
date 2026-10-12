import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { fetch } from 'undici';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { construireClaims, verifierRegleEcrite, injecterPreuvesInline } from '../../../../scripts/blog-forge.mjs';

const dir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const root = resolve(dir, '../../..');
const slug = 'suivre-les-echeances-fiscales-d-un-portefeuille';
const jour = '2026-10-12';
const json = (p, data) => {mkdirSync(dirname(p), {recursive:true});writeFileSync(p, JSON.stringify(data,null,2)+'\n');};
const hash = (v) => createHash('sha256').update(v).digest('hex');
const body = readFileSync(join(dir, 'corps.md'), 'utf8');
const attachments = '/Users/kevinkitanga/.hermes/kanban/attachments/t_e488b89b';
const provenance = JSON.parse(readFileSync(join(attachments, slug+'-openai-v2-provenance.json')));
copyFileSync(join(attachments,slug+'-openai-v2.png'),join(dir,'image-source.png'));
copyFileSync(join(attachments,slug+'-openai-v2-provenance.json'),join(dir,'image-source.json'));
const alt = 'Calendrier vierge et dossiers en diorama 3D vert, avec un disque graphite dans un bac séparé.';
const sources = [
 {id:'dgfip-calendrier',publisher:'DGFiP',title:'Calendrier fiscal professionnel, octobre 2026',url:'https://www.impots.gouv.fr/professionnel/calendrier-fiscal',excerpt:'Entre les 15 et 24 octobre 2026, dépôt et paiement de la déclaration mensuelle ou trimestrielle de TVA à la date figurant dans votre espace professionnel.'},
 {id:'dgfip-echeances',publisher:'DGFiP',title:'Comment connaître les dates d’échéance de mes obligations fiscales ?',url:'https://www.impots.gouv.fr/professionnel/questions/comment-connaitre-les-dates-decheance-de-mes-obligations-fiscales',excerpt:'Retrouvez les échéanciers de vos obligations en matière de TVA et d’impôt sur les sociétés dans les rubriques'},
 {id:'cnil-minimisation',publisher:'CNIL',title:'RGPD, chapitre II, article 5',url:'https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2',excerpt:'adéquates, pertinentes et limitées à ce qui est nécessaire au regard des finalités pour lesquelles elles sont traitées'},
].map(s=>({...s, level:'tier-1',official:true,classificationReason:'Page officielle primaire de l’administration compétente, portée limitée au passage cité.'}));
const recette = {
 slug,title:"Calendrier fiscal d’un cabinet comptable : suivre les échéances d’un portefeuille",
 tabTitle:'Calendrier fiscal cabinet comptable : suivi du portefeuille | Memlia',
 summary:'Une ligne par obligation et période, une date confirmée et des états séparés pour préparation, retour et paiement. Douze lignes fictives montrent les exceptions et les totaux sans comparer les collaborateurs.',
 description:'Calendrier fiscal cabinet comptable : qualifier les dates par dossier, séparer dépôt et paiement, suivre les exceptions et les totaux du portefeuille.',
 date:jour,topics:['cabinet','automatisation'],keywords:['calendrier fiscal cabinet comptable','suivi échéances fiscales cabinet comptable','suivi TVA portefeuille'],
 primaryQuery:'calendrier fiscal cabinet comptable',secondaryQueries:['suivi échéances fiscales cabinet comptable'],intent:'executer',
 fanOut:['quelle date retenir par dossier','quand une déclaration est-elle déposée','comment suivre les exceptions sans classement nominatif'],
 role:{primary:'chefs-mission-portefeuille',secondary:['collaborateurs-comptables'],proofLevel:'indirect',proofNote:'Rôle et besoin du backlog v3 ; aucune observation client ni mesure d’usage revendiquée.'},
 funnel:'MOFU',cluster:'production-comptable',famille:'echeances-fiscales',contentType:'searchable',format:'how-to-guide',
 task:'Suivre chaque obligation qualifiée du portefeuille et présenter les exceptions sans attribuer une date supposée.',rankability:'plausible',businessRelevance:'directe',
 proofRequired:'Douze lignes fictives classées, onze clés uniques, agrégats et exceptions ; calendrier DGFiP daté dans les preuves privées.',
 reviewRule:'Relire au changement de calendrier ou de situation déclarative ; confirmer les informations au jour réel de publication.',
 cta:{label:'Confier cette tâche',destination:'/contact',outcome:'Nous écrivons la règle du suivi dans vos mots, automatisons sa mécanique dans vos outils et la faisons recetter par vos équipes. Vous gardez la qualification fiscale et les décisions. Rien à envoyer : la description de la tâche suffit.'},
 inlineProofs:[
  {id:'fiscal-registre-portefeuille',insertBeforeHeading:'Étape 3 : séparer préparation, retour et paiement',alt:'Registre fictif des lignes F-01 à F-07, avec leurs dates à qualifier et leurs états de préparation ou de retour.',source:'Reconstitution depuis le jeu fictif exécuté, preuves/rejeu.json.',capturedAt:jour},
  {id:'fiscal-files-agregees',insertBeforeHeading:'La règle écrite',alt:'Vue fictive des quatre files : sept lignes à reprendre, deux en préparation, deux en attente et une confirmée.',source:'Totaux exacts du classement fictif exécuté, preuves/rejeu.json.',capturedAt:jour},
 ],
 image:{heroId:'img-art-echeances-fiscales',alt,source:{path:'image-source.png',generationId:provenance.generationId,provider:provenance.provider,model:provenance.model,generatedAt:provenance.generatedAt,credits:null},
 brief:{sujet:provenance.subject,composition:'Calendrier vierge central, dossiers à gauche et bac séparé à droite ; cadrage horizontal.',style:'Diorama 3D isométrique, objets mats, lumière du haut gauche, ombres courtes.',palette:'Crème #fcfbf7, papier #fffefb, accents verts #27b657 et #1c8a41, graphite #231f20 ; parts mesurées en observation.',interdits:'Aucun texte, chiffre, personnage, main, logo, interface, alerte rouge ou symbole d’envoi automatique.',alt,prompt:provenance.prompt,reviewCriteria:['brief-six-components','generation-constraints','fictive-provenance','recognizable-subject','technical-derivatives','alt-information']},
 provenance:{type:'openai-native-codex',decision:'Master OpenAI fourni par le propriétaire, recette du 12/10/2026 ; aucun nouvel achat.',createdAt:jour}},
 sources,links:{outgoing:['/blog/automatiser-un-cabinet-comptable-la-carte-des-taches','/glossaire#piece-justificative','/blog/automatiser-la-relance-des-pieces-clients','/methode','/glossaire#cas-de-refus','/automatisation-cabinet-comptable'],incoming:['/blog','/blog/automatiser-un-cabinet-comptable-la-carte-des-taches']},
 cannibalization:{risk:'faible',comparedWith:['/blog/automatiser-un-cabinet-comptable-la-carte-des-taches','/blog/suivre-la-production-sociale-dans-excel','/blog/automatiser-la-relance-des-pieces-clients'],decision:'Le pilier cartographie, le suivi social concerne paie/DSN, la relance collecte les pièces ; cette page qualifie les dates et sépare les faits de suivi fiscal.'},
 serp:{requete:'calendrier fiscal cabinet comptable',date:jour,volume:'ND',acteurs:['Pennylane','ECMA','Wize Expert','KIMISUITE','JLB Expert'],formats:'Aide produit de suivi, calendrier annuel et pages commerciales.',note:'Relevé outil web_search ; Pennylane ouvert et décrit des tableaux déjà disponibles. Aucun constat direct des surfaces AI Overview/AI Mode ni de volumes.'},
 gsc:{requete:'calendrier fiscal cabinet comptable',date:jour,periode:'non relevée',impressions:null,clics:null,note:'Page nouvelle non publiée ; aucun relevé GSC ni crédit métrique revendiqué.'},
 claims:sources.map((s,i)=>({unite:["Pour octobre 2026, le calendrier professionnel indique","La DGFiP précise aussi","Pour les données personnelles éventuellement présentes"][i],claim:s.excerpt,type:i===2?'legal-reglementaire':'fiscal',sourceId:s.id,excerpt:s.excerpt,explanation:'Citation littérale de la page officielle ; la portée est conservée dans le paragraphe et ses conditions.'})),
 businessReview:{reviewerId:'relecteur-metier-ia-memlia',role:'chefs-mission-portefeuille'},preuvesSkills:{},
};
if (existsSync(join(dir,'recette.json'))) recette.preuvesSkills = JSON.parse(readFileSync(join(dir,'recette.json'), 'utf8')).preuvesSkills ?? {};
json(join(dir,'recette.json'),recette);
assert.deepEqual(verifierRegleEcrite(body,{date:jour}),[]);
const evidence = [];
for (const s of sources) {
 const p=join(dir,`preuves/sources/${s.id}`);mkdirSync(dirname(p),{recursive:true});
 const response=await fetch(s.url,{headers:{'User-Agent':'MemliaBlogSourceVerifier/1.0 (+https://memlia.fr)'},redirect:'error',signal:AbortSignal.timeout(30000)});
 assert.equal(response.status,200,`${s.id} HTTP`);
 const raw=await response.text();assert.ok(Buffer.byteLength(raw)<3000000);
 writeFileSync(p+'.source.txt',raw);
 // L’extrait doit être présent dans les octets de la réponse, pas seulement dans une extraction reconstituée.
 assert.ok(raw.includes(s.excerpt),`${s.id} : extrait exact absent`);
 const retrievedAt=new Date().toISOString();
 const proof={version:1,candidateSlug:slug,sourceId:s.id,requestedUrl:s.url,finalUrl:response.url,upstreamUrl:s.url,httpStatus:response.status,retrievedAt,checkedAt:jour,contentSha256:hash(raw),excerpt:s.excerpt,status:'ouverte',provenance:'primary',level:'tier-1',official:true};
 json(p+'.json',proof);evidence.push(proof);
}
const native=construireClaims({recette,corps:body,dossier:dir,sujet:{slug,articleHash:hash(body.trim())},jour});
json(join(dir,'preuves/claims-techniques.json'),native.claims);
assert.deepEqual(native.erreurs,[]);
const imageDir=join(dir,'preuves/image');mkdirSync(imageDir,{recursive:true});
await sharp(join(dir,'image-source.png')).resize(1920,1080,{fit:'cover'}).png().toFile(join(imageDir,'master.png'));
await sharp(join(imageDir,'master.png')).resize(1200,630,{fit:'cover'}).webp({quality:88}).toFile(join(imageDir,'og.webp'));
for(const w of [768,1200,1600]) {
 await sharp(join(imageDir,'master.png')).resize(w).webp({quality:85}).toFile(join(imageDir,`hero-${w}.webp`));
 await sharp(join(imageDir,'master.png')).resize(w).avif({quality:60}).toFile(join(imageDir,`hero-${w}.avif`));
}
const dimensions=[];
for(const name of ['master.png','og.webp',...['webp','avif'].flatMap(ext=>[768,1200,1600].map(w=>`hero-${w}.${ext}`))]) {
 const path=join(imageDir,name);const m=await sharp(path).metadata();dimensions.push({name,width:m.width,height:m.height,bytes:readFileSync(path).length,sha256:hash(readFileSync(path))});
}
json(join(imageDir,'derives.json'),dimensions);
writeFileSync(join(dir,'preuves/corps-figures.md'),injecterPreuvesInline(body,recette.inlineProofs));
json(join(dir,'preuves/controle-fabrication.json'),{date:jour,statut:'contrôles techniques de fabrication, pas de revue indépendante ni de publication',sources:evidence.map(s=>({id:s.sourceId,http:s.httpStatus,excerptExact:true})),claims:recette.claims.length,regleErreurs:[],claimsErreurs:native.erreurs,bodySha256:hash(body.trim()),imageOriginalSha256:hash(readFileSync(join(dir,'image-source.png'))),sourceDecision:'Diorama OpenAI natif ; modèle et coût non communiqués',forge:'preparer non exécuté : créneau planned non actionnable au 12/10 ; aucun garde modifié',next:'Réservation de livraison et matérialisation par platform après avis indépendant'});
console.log('Paquet natif : 3 sources HTTP200 avec extraits exacts, claims cohérents, règle écrite complète et 8 actifs image.');
