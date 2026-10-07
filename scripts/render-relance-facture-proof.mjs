/** Rejeu réel du moteur, HTML canonique puis renderer historique. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {demoInvoices,prepareReminders} from '../src/lib/relance-facture.mjs';
const folder='docs/design/relance-facture-proof';
const manifestPath='docs/qa/relance-facture/proofs-manifest.json';
const check=process.argv.includes('--check');
const options={preparationDate:'2026-10-06',currency:'EUR',groupConfirmed:true,level:'first',signature:''};
const inputs=demoInvoices().slice(0,3);
const report=prepareReminders(inputs,options);
assert.equal(report.invoices.length,3,'La preuve joue trois factures');
assert.equal(report.messages.length,1,'Seul le solde échu sans litige produit un message');
assert.match(report.invoices[1].reason,/sold|régl|regl|pay/i,'La deuxième facture doit être soldée');
assert.match(report.invoices[2].reason,/litige|contest/i,'La troisième facture doit être en litige');
const message=report.messages[0];
assert.match(message.body,/90[,.]00|90\s*(?:EUR|€)/,'Le message doit porter le solde réel de 90 EUR');
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rows=report.invoices.map((invoice,index)=>`<article class="invoice ${index===2?'pending':''}"><h2>${escape(invoice.reference)}</h2><p>${escape(invoice.client)}</p><p>${escape(invoice.reason)}</p><strong>${escape(invoice.balance)} EUR</strong><p class="state">${index===0?'Relance à valider':index===1?'Facture soldée · exclue':'Litige · à examiner'}</p></article>`).join('\n');
const html=`<!doctype html>
<html lang="fr"><meta charset="utf-8"><title>Préparation amiable sur trois factures fictives</title><link rel="stylesheet" href="styles.css">
<body><main><section class="frame hatch" id="outil-relance-facture" data-og aria-label="Trois factures fictives : relance de 90 euros, facture soldée et litige à examiner">
<div class="relance-scene"><div class="window"><div class="window-bar">Factures et décisions</div><div class="invoice-list">${rows}</div></div>
<div class="window"><div class="window-bar">Message amiable à relire</div><div class="message"><p class="subject">${escape(message.subject)}</p><p class="body">${escape(message.body)}</p><p class="validation">Proposition à valider · aucun envoi</p></div></div></div>
</section></main></body></html>
`;
for(const [name,content] of [['index.html',html],['replay.json',JSON.stringify(report,null,2)+'\n'],['replay-input.json',JSON.stringify({inputs,options},null,2)+'\n']]) {
 if(check) assert.equal(readFileSync(`${folder}/${name}`,'utf8'),content,`Rejeu divergent : ${name}`);
 else writeFileSync(`${folder}/${name}`,content);
}
const result=spawnSync(process.execPath,['scripts/render-proofs-v2.mjs',`--source=${folder}`,`--manifest=${manifestPath}`,'--start=44',check?'--check':'--adopt'],{stdio:'inherit'});
assert.equal(result.status,0,'Renderer canonique');
const provenance=['scripts/render-relance-facture-proof.mjs','src/lib/relance-facture.mjs',`${folder}/replay.json`,`${folder}/replay-input.json`];
const hash=path=>createHash('sha256').update(readFileSync(path)).digest('hex');
const manifest=JSON.parse(readFileSync(manifestPath,'utf8'));
if(check) for(const path of provenance) assert.equal(manifest.sources.find(s=>s.path===path)?.sha256,hash(path),`Provenance périmée : ${path}`);
else {manifest.sources.push(...provenance.map(path=>({path,sha256:hash(path)})));writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');}
console.log('PASS : trois factures rejouées, une relance à 90 EUR, deux exceptions ; preuve et OG scellées.');
