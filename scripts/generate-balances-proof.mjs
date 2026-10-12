import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { parseBalance, compareBalances, EXAMPLE_PREVIOUS, EXAMPLE_CURRENT } from '../src/lib/outils/comparateur-balances.mjs';
const parse=(text,name)=>parseBalance(text,{mapping:{account:0,label:1,balance:2},name});
const result=compareBalances(parse(EXAMPLE_PREVIOUS,'Exemple fictif N−1'),parse(EXAMPLE_CURRENT,'Exemple fictif N'),{periodPrevious:{start:'2025-01-01',end:'2025-12-31'},periodCurrent:{start:'2026-01-01',end:'2026-12-31'},sameCurrency:true,comparable:true,absoluteThreshold:'20'});
const money=s=>{const n=BigInt(s),a=n<0n?-n:n;return `${n<0n?'−':''}${a/100n},${String(a%100n).padStart(2,'0')}`};
const rows=result.rows.map(r=>`<tr><td>${r.account}</td><td>${money(r.previous)}</td><td>${money(r.current)}</td><td>${money(r.delta)}</td><td>${r.percent===null?'Non calculable':r.percent.replace('.',',')+' %'}</td><td>${r.status}</td></tr>`).join('');
const html=`<!doctype html><html lang="fr"><head><meta charset="utf-8"><link rel="stylesheet" href="styles.css"><title>Comptes alignés et variations</title></head><body><main><section class="frame" id="outil-balances" data-og aria-label="Trois comptes fictifs alignés avec variation et référence zéro"><div class="calc-window"><header>Comptes alignés <span>N−1 → N · EUR</span></header><div class="body"><div class="entries"><div><p>Seuil absolu saisi</p><b>20,00 EUR</b></div><div><p>Comptes à examiner</p><b>${result.rows.filter(r=>r.selected).length} / ${result.rows.length}</b></div><div><p>Comparabilité</p><b>Confirmée</b></div></div><table><thead><tr><th>Compte</th><th>N−1</th><th>N</th><th>Delta</th><th>Variation</th><th>Statut</th></tr></thead><tbody>${rows}</tbody></table><div class="decision"><b>Delta / valeur absolue N−1</b><p>Référence zéro : non calculable. Solde −100 → −80 : delta +20.</p></div></div></div></section></main></body></html>\n`;
const folder='docs/design/comparateur-balances-proof';
if(process.argv.includes('--check'))assert.equal(readFileSync(`${folder}/index.html`,'utf8'),html,'Scène différente du moteur testé');
else{mkdirSync(folder,{recursive:true});writeFileSync(`${folder}/index.html`,html)}
console.log('Scène cohérente avec les trois comptes calculés.');
