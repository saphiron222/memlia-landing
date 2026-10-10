import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { analyseLettrage, importLettrage, EXAMPLE_CSV } from '../src/lib/lettrage.mjs';
const result=analyseLettrage(importLettrage(EXAMPLE_CSV));
assert.equal(result.pairs.length,1);assert.equal(result.ambiguous.length,1);assert.equal(result.remaining.length,1);
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const rows=result.lines.map(l=>`<tr><td>${esc(l.id)}</td><td>${esc(l.reference)}</td><td>${esc(l.debit)}</td><td>${esc(l.credit)}</td><td class="state">${esc(l.state)} ${esc(l.pairKey??l.groupKey??'')}</td></tr>`).join('');
const html=`<!doctype html><html lang="fr"><head><meta charset="utf-8"><link rel="stylesheet" href="styles.css"><title>Paires et ambiguïtés</title></head><body><main><section class="frame" id="outil-lettrage" data-og aria-label="Une paire exacte, un groupe ambigu et une ligne restante"><div class="window"><header><span>Mouvements et propositions</span><span>EUR · même compte et tiers par paire</span></header><div class="body"><table><thead><tr><th>Identifiant</th><th>Référence</th><th>Débit</th><th>Crédit</th><th>État</th></tr></thead><tbody>${rows}</tbody></table><div class="decision"><b>1 paire · 1 groupe ambigu · 1 ligne restante</b><p>F-001 / R-001 : référence identique, 100,00 EUR · à valider</p><p>F-002 : R-002 ou R-003 ? Aucun règlement choisi.</p></div></div></div></section></main></body></html>
`;
const path='docs/design/lettrage-proof/index.html';
if(process.argv.includes('--check'))assert.equal(readFileSync(path,'utf8'),html,'Scène divergente du moteur');else writeFileSync(path,html);
const run=spawnSync(process.execPath,['scripts/render-proofs-v2.mjs',process.argv.includes('--check')?'--check':'--adopt','--source=docs/design/lettrage-proof','--manifest=docs/qa/lettrage/proofs-manifest.json','--start=46'],{stdio:'inherit'});process.exit(run.status??1);
