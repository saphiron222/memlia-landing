import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { readDilaCopy, dilaDay } from '../../../../scripts/lib/dila-source-copy.mjs';
const root = process.cwd();
const hash = (b) => createHash('sha256').update(b).digest('hex');
const file = process.argv[2] ?? 'docs/strategy/site-v3/glossaire-cac-lot-4.json';
const pack = JSON.parse(readFileSync(file));
assert.equal(pack.lot, 'cac-audit-4');
assert.equal(pack.canonical, '/glossaire');
assert.equal(pack.entries.length, 10);
const expected = ['dossier-travail-audit','dossier-permanent-audit','feuille-maitresse-audit','plan-mission-audit','programme-travail-audit','declarations-ecrites-direction','evenements-posterieurs-cloture','continuite-exploitation','rapport-sur-comptes','alpe'];
assert.equal(new Set(pack.evidence.units.map(u => u.id)).size, pack.evidence.units.length);
assert.deepEqual(pack.aliases, { 'lettre d’affirmation': 'declarations-ecrites-direction', 'dossier de travail': 'dossier-travail-audit' });
assert.equal(pack.review.status, 'pending');
assert.equal(pack.review.publicationAuthorized, false);
const normativeArticles = { '230': '66', '300': '69', '580': '79', '570': '83', '560': '85', '700': '92', '911': '94', '912': '94' };
for (const [nep, article] of Object.entries(normativeArticles)) {
  const h2a = pack.evidence.sources[`h2a-nep-${nep}`];
  assert.ok(new RegExp(`821-\\s*${article}`).test(h2a.versionAttestation));
  assert.ok(readFileSync(h2a.snapshotPath, 'utf8').includes(`NEP ${nep}`));
  const dila = JSON.parse(readFileSync(pack.evidence.sources[`dila-a821-${article}`].dilaCopyPath));
  assert.equal(dila.number, `A821-${article}`);
}
const existing = [...readFileSync('src/data/glossary.ts','utf8').matchAll(/anchor: '([^']+)'/g)].map(m=>m[1]);
const all = new Set([...existing, ...expected]);
for (const entry of pack.entries) {
  assert.equal(entry.id, entry.anchor);
  assert.equal(entry.routeDecision, 'anchor');
  assert.equal(entry.status, 'preview-only');
  assert.equal(entry.businessReviewer, null);
  assert.equal(entry.reviewedAt, null);
  assert.equal(entry.author, 'Memlia');
  assert.equal(entry.editorialReviewer, 'Équipe éditoriale Memlia');
  assert.ok(!existing.includes(entry.anchor), `Collision ${entry.anchor} : réutiliser le propriétaire`);
  assert.ok(['Réglementaire','Professionnelle','Éditoriale Memlia','Technique'].includes(entry.nature));
  for (const field of ['term','definition','context','exampleFictitious','commonConfusion','automationBoundary','owner']) {
    assert.ok(typeof entry[field] === 'string' && entry[field].length >= (field === 'term' ? 2 : 4), `${entry.id}:${field}`);
    assert.ok(!entry[field].includes("'"), `Apostrophe droite ${entry.id}:${field}`);
  }
  assert.match(entry.exampleFictitious, /fictif|fictive/);
  assert.ok(entry.relatedTerms.length >= 2);
  entry.relatedTerms.forEach(id => assert.ok(all.has(id), `Terme absent ${id}`));
  assert.ok(entry.sourceIds.length);
  entry.sourceIds.forEach(id => {
    assert.ok(pack.sources[id]);
    assert.ok(pack.evidence.sources[id]);
    assert.ok(entry.motsSources[id] && `${entry.definition} ${entry.context}`.includes(entry.motsSources[id]), `Mot de source absent ${entry.id}:${id}`);
  });
  for (const link of entry.internalLinks) {
    assert.ok(pack.linkChecks.some(check => check.href === link.href && check.httpStatus === 200 && check.inMain && check.hasArticleBody), `Lien non attesté ${link.href}`);
    assert.ok(!pack.deferredLinks.some(d=>d.href===link.href));
  }
  for (const field of ['definition','context','commonConfusion']) {
    assert.ok(pack.evidence.units.some(u=>u.entryId===entry.id && u.field===field), `Unité non tracée ${entry.id}:${field}`);
  }
  assert.match(entry.sourceCheckedAt,/^\d{4}-\d{2}-\d{2}$/);
  assert.match(entry.nextReviewAt,/^\d{4}-\d{2}-\d{2}$/);
}
for (const check of pack.linkChecks) {
  assert.equal(hash(readFileSync(check.snapshotPath)), check.sha256);
  assert.match(readFileSync(check.sourcePath, 'utf8'), /brouillon: false/);
  assert.match(readFileSync(check.snapshotPath, 'utf8'), /<article[\s>]/);
}
for (const [id, source] of Object.entries(pack.sources)) {
  assert.equal(source.id,id);
  assert.ok(source.publisher && source.title && source.url.startsWith('https://'));
  const e=pack.evidence.sources[id];
  assert.equal(hash(readFileSync(e.snapshotPath)),e.contentSha256);
  assert.equal(source.checkedAt,dilaDay(e.retrievedAt));
  assert.ok(Date.parse(e.retrievedAt) <= Date.parse(pack.preparedAt), `${id} collecte future`);
  const age = (Date.parse(dilaDay(pack.preparedAt))-Date.parse(source.checkedAt))/86400000;
  assert.ok(age>=0 && age<=7, `${id} périmé`);
  if (e.accessMode==='dila-copy') {
    assert.equal(e.httpStatus,null);
    const result=readDilaCopy({root,path:e.dilaCopyPath,url:source.url,excerpt:readFileSync(e.snapshotPath,'utf8'),expectedSha256:e.dilaCopySha256,asOf:pack.preparedAt});
    assert.equal(result.version,e.version);
  } else {
    assert.equal(e.httpStatus,200);
    assert.equal(hash(readFileSync(e.rawPath)),e.rawSha256);
  }
}
for (const unit of pack.evidence.units) {
  const entry=pack.entries.find(e=>e.id===unit.entryId);
  assert.ok(entry[unit.field].includes(unit.text));
  if (unit.unitText) assert.equal(unit.unitText, entry[unit.field]);
  assert.ok(unit.type && unit.applicability && unit.regime && unit.exceptions);
  assert.equal(unit.businessVerdict,null);
  if(unit.sourceId) {
    const source=pack.evidence.sources[unit.sourceId];
    const text=readFileSync(source.snapshotPath,'utf8');
    assert.ok(unit.citations.length);
    unit.citations.forEach(c=>{
      assert.ok(c.text.length>=40 && text.includes(c.text), `Citation inexacte ${unit.id}`);
      const line = Number(c.locator.match(/ligne-(\d+)$/)?.[1]);
      assert.ok(line > 0 && text.split('\n')[line - 1].trim() === c.text.split('\n')[0].trim(), `Localisation inexacte ${unit.id}`);
    });
  } else assert.equal(unit.type,'methode-memlia');
}
assert.equal(pack.evidence.sources['dila-a821-94'].version, 'LEGIARTI000054491781');
assert.equal(pack.evidence.sources['dila-a821-94'].versionDate, '2026-07-27');
for (const id of ['cncc-nep-911','cncc-nep-912']) {
  assert.ok(readFileSync(pack.evidence.sources[id].snapshotPath,'utf8').includes('24 juillet 2026'));
  assert.ok(readFileSync(pack.evidence.sources[id].snapshotPath,'utf8').includes('Elle remplace'));
}
for (const id of ['dossier-permanent-audit','feuille-maitresse-audit']) {
  assert.ok(pack.evidence.units.some(u=>u.entryId===id && u.field==='definition' && u.type==='methode-memlia'));
}
for(const entry of pack.entries) assert.match(entry.automationBoundary,/Préparation :.*Validation :.*Jugement :/);
console.log(JSON.stringify({pass:true,entries:pack.entries.length,sources:Object.keys(pack.sources).length,units:pack.evidence.units.length,links:pack.linkChecks.length,existingAnchors:existing.length,asOf:pack.preparedAt,review:'pending; format/source control only'},null,2));
