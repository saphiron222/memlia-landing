import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync,readdirSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {ROBOTS,ROBOT_CATEGORIES,comptesRobots,contactsRobots,cheminRobot} from '../../src/data/robots.ts';
import {verifierCatalogueRobots} from '../../src/data/robots-controle.ts';
import {grapheHubRobots,grapheFicheRobot,verifierGrapheRobots} from '../../src/data/schema-robots.ts';
import {valider} from '../../functions/api/contact.js';
test('21 robots couvrent les 12 automatisations et 18 robots concurrents, sans doublon de service',()=>{assert.equal(ROBOTS.length,21);assert.equal(verifierCatalogueRobots(ROBOTS),true);assert.equal(Object.values(comptesRobots()).reduce((a,b)=>a+b),ROBOTS.length);assert.equal(ROBOT_CATEGORIES.length,6);});
test('un témoin incomplet ou une entrée doublonnée fait échouer le catalogue',()=>{for(const mutate of [a=>a.pop(),a=>a[0].demonstration.cas.pop(),a=>a[0].demonstration.cas.forEach(c=>c.decision='Préparé'),a=>a[0].voisins.push('inconnu'),a=>a[0].faq.splice(0,3),a=>a[1].slug=a[0].slug]){const a=structuredClone(ROBOTS);mutate(a);assert.throws(()=>verifierCatalogueRobots(a));}});
test('aucune collision avec les services historiques et aucune modification de leurs routes',()=>{const services=readdirSync('src/content/services').filter(f=>f.endsWith('.md')).map(f=>f.replace(/\.md$/,''));for(const r of ROBOTS)assert.ok(!services.includes(r.slug),r.slug);const inventory=JSON.parse(readFileSync('docs/strategy/site-v3/hub-robots/migration.json'));assert.equal(inventory.services.length,services.length);assert.ok(inventory.services.every(s=>s.decision==='conserver'));});
test('hub et fiches ont le graphe attendu et le fournisseur existant',()=>{const hub=grapheHubRobots()['@graph'];assert.equal(hub.find(n=>n['@type']==='ItemList').numberOfItems,ROBOTS.length);assert.equal(hub.filter(n=>n['@type']==='Service').length,0);for(const r of ROBOTS){const graph=grapheFicheRobot(r)['@graph'];assert.equal(graph.filter(n=>n['@type']==='Service').length,1);assert.equal(graph.find(n=>n['@type']==='Service').provider['@id'],'https://memlia.fr/#organization');assert.equal(graph.find(n=>n['@type']==='BreadcrumbList').itemListElement.at(-1).item,'https://memlia.fr'+cheminRobot(r));}});
test('le garde refuse les schémas et propriétés inventés, y compris des types en liste',()=>{for(const n of [{'@type':'Person'},{'@type':['WebPage','SoftwareApplication']},{'@type':'FAQPage'},{'@type':'Service',offers:{}},{'@type':'Service',price:12},{'@type':'WebPage',url:'/relative'}])assert.throws(()=>verifierGrapheRobots({'@graph':[n]}));});
test('les présélections autorisées enrichissent le message sans dépendre du consentement de provenance',()=>{const c=contactsRobots();assert.equal(c.length,63);assert.equal(new Set(c.map(x=>x.id)).size,c.length);const base={nom:'Nom fictif',courriel:'test@exemple.test',message:'Une tâche fictive à cadrer avec notre équipe.',consentement:'on'};const valid=valider({...base,tache_robot:c[0].id});assert.match(valid.champs.message,/Tâche choisie/);assert.equal(valid.champs.origine,null);assert.equal(valider({...base,tache_robot:'<script>inconnu</script>'}).champs.message,base.message);});
test('les images de production et restitutions sont présentes et les preuves sociales à jour',()=>{const manifest=JSON.parse(readFileSync('docs/strategy/site-v3/hub-robots/social-manifest.json'));for(const r of ROBOTS){for(const size of [128,256,512])for(const ext of ['avif','webp']){const path=`public${r.image.src}-${size}.${ext}`;assert.ok(existsSync(path),r.id);assert.ok(statSync(path).size<70000,`${path} trop lourd`);}assert.equal(manifest.records.find(x=>x.robot===r.id)?.sourceHash,createHash('sha256').update(JSON.stringify(r.demonstration)).digest('hex'));assert.ok(existsSync(`public/robots/restitutions/${r.id}.webp`));}});
test('chaque figurine est distincte et les dimensions des variantes sont exactes',async()=>{
 const hashes=new Set();const manifest=JSON.parse(readFileSync('docs/strategy/site-v3/hub-robots/images-manifest.json'));assert.equal(manifest.records.length,ROBOTS.length);
 for(const r of ROBOTS){
  hashes.add(createHash('sha256').update(readFileSync(`public${r.image.src}-256.webp`)).digest('hex'));
  for(const size of [128,256,512])for(const ext of ['avif','webp']){const metadata=await sharp(`public${r.image.src}-${size}.${ext}`).metadata();assert.equal(metadata.width,size);assert.equal(metadata.height,size);}
 }
 assert.equal(hashes.size,ROBOTS.length);
});
