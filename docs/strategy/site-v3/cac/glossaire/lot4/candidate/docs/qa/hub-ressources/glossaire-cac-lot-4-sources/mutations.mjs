import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
const base='docs/qa/hub-ressources/glossaire-cac-lot-4-sources';
const original=JSON.parse(readFileSync('docs/strategy/site-v3/glossaire-cac-lot-4.json'));
const directory=mkdtempSync(join(tmpdir(),'glossary-lot-4-'));
const cases=[
  ['terme manquant',p=>p.entries.pop()],
  ['citation inventée',p=>p.evidence.units.find(u=>u.sourceId).citations[0].text='Une citation inventée ne doit jamais être tenue pour une preuve officielle.'],
  ['source périmée',p=>{p.sources['h2a-nep-230'].checkedAt='2026-09-01'; p.evidence.sources['h2a-nep-230'].retrievedAt='2026-09-01T12:00:00Z';}],
  ['lien futur exposé',p=>p.entries[0].internalLinks.push({label:'Article futur',href:p.deferredLinks[0].href})],
  ['terme lié absent',p=>p.entries[0].relatedTerms.push('terme-invente')],
  ['empreinte divergente',p=>p.evidence.sources['dila-a821-66'].dilaCopySha256='0'.repeat(64)],
  ['fausse revue',p=>p.entries[0].businessReviewer='PASS inventé'],
  ['alias déplacé',p=>p.aliases['lettre d’affirmation']='lettre-affirmation'],
  ['ancienne numérotation',p=>p.evidence.sources['h2a-nep-300'].versionAttestation='Article A.823-13'],
  ['ALPE ancienne version',p=>p.evidence.sources['dila-a821-94'].version='LEGIARTI000050693100'],
  ['classement transformé en obligation',p=>p.evidence.units.filter(u=>u.entryId==='dossier-permanent-audit' && u.field==='definition').forEach(u=>u.type='legal-reglementaire')],
  ['frontière amputée',p=>p.entries[0].automationBoundary='Tout peut être préparé automatiquement.'],
  ['unité dupliquée',p=>p.evidence.units.push(p.evidence.units[0])],
];
const results=[];
try {
  for(const [name,change] of cases){
    const candidate=structuredClone(original); change(candidate);
    const path=join(directory,'candidate.json'); writeFileSync(path,JSON.stringify(candidate));
    const result=spawnSync(process.execPath,[`${base}/validate.mjs`,path],{encoding:'utf8'});
    assert.equal(result.status,1,`${name} non refusé : ${result.stdout}`);
    results.push({name,rejected:true,exitCode:result.status});
  }
  writeFileSync(`${base}/mutations-result.json`,JSON.stringify({pass:true,cases:results},null,2)+'\n');
  console.log(JSON.stringify({pass:true,cases:results},null,2));
} finally {rmSync(directory,{recursive:true,force:true});}
