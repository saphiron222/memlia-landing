import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync,existsSync,readdirSync} from 'node:fs';import {createHash} from 'node:crypto';import sharp from 'sharp';
import {OUTILS_VITRINE,outilVoisin} from '../../src/data/outils-vitrine.ts';import {OUTILS_DISPONIBLES} from '../../src/data/outils.ts';
const hash=b=>createHash('sha256').update(b).digest('hex');
test('le hub conserve exactement les 21 outils et six essentiels',()=>{
 assert.deepEqual(OUTILS_VITRINE.map(o=>o.slug).sort(),OUTILS_DISPONIBLES.map(o=>o.slug).sort());
 assert.equal(new Set(OUTILS_VITRINE.map(o=>o.slug)).size,21);assert.equal(OUTILS_VITRINE.filter(o=>o.essentiel).length,6);
 for(const o of OUTILS_VITRINE)assert.ok(o.texte&&o.nom&&o.imageAgent);
});
test('22 images sociales propres, dimensions, poids, intégrité et fraîcheur des sources',async()=>{
 const manifest=JSON.parse(readFileSync('docs/qa/outils-simples-2026-10-15/social-manifest.json'));
 assert.equal(manifest.records.length,22);
 assert.deepEqual(manifest.records.map(r=>r.slug).sort(),['hub',...OUTILS_VITRINE.map(o=>o.slug)].sort());
 for(const [path,fingerprint] of Object.entries(manifest.sources))assert.equal(hash(readFileSync(path)),fingerprint,`Source modifiée : ${path}`);
 for(const r of manifest.records){const bytes=readFileSync(r.path),meta=await sharp(bytes).metadata();assert.equal(hash(bytes),r.sha256,r.path);assert.equal(meta.width,1200);assert.equal(meta.height,630);assert.ok(bytes.length<150000);}
});
test('les formulaires locaux ne disposent d’aucune soumission HTTP de repli',()=>{
 for(const file of readdirSync('src/components/outils').filter(f=>f.endsWith('.astro'))){const content=readFileSync(`src/components/outils/${file}`,'utf8');for(const tag of content.match(/<form\b[^>]*>/g)??[])assert.match(tag,/method="dialog"/,file);}
 assert.ok(existsSync('docs/strategy/pricing-2026-10-15/RECOMMANDATION.md'));assert.ok(existsSync('docs/strategy/pricing-2026-10-15/agents-individuels/GRILLE.md'));
 for(const obsolete of ['offre-simple','mammouth','ECONOMIE-OFFRE.md','grille-proposee.csv'])assert.ok(!existsSync(`docs/strategy/pricing-2026-10-15/${obsolete}`));
});

test('chaque outil a une suite publiée et reçoit un lien contextuel d’un autre outil',()=>{
 const slugs=OUTILS_VITRINE.map(o=>o.slug),incoming=new Set();
 for(const slug of slugs){const next=outilVoisin(slug);assert.ok(next&&next.slug!==slug&&slugs.includes(next.slug));incoming.add(next.slug);}
 assert.deepEqual([...incoming].sort(),slugs.sort());
 assert.equal(outilVoisin('temoin-calcul-local'),undefined);
});
