import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {demoSession,compareResponse,reminderEligible} from '../../src/lib/circularisation.mjs';
const contract=JSON.parse(readFileSync(new URL('../../docs/design/circularisation-proof/content-contract.json',import.meta.url),'utf8'));
function cleanFrame(text){assert.doesNotMatch(text,/Memlia|CNCC|H2A|partenari|indépendant de|démonstration non|\b20\d{2}\b|confier une première tâche/i);}
test('la scène propre rejoue le résultat et refuse les annotations promotionnelles',()=>{
 const s=demoSession();assert.equal(compareResponse(s.tiers[0]).difference,'20');assert.equal(compareResponse(s.tiers[1]).evaluated,false);assert.equal(reminderEligible(s.tiers[2]).eligible,false);
 assert.equal(contract.length,1);assert.equal(contract[0].id,'outil-circularisation');assert.match(contract[0].centralText,/\+20 EUR/);assert.match(contract[0].centralText,/relance suspendue/);cleanFrame(contract[0].centralText);
 for(const annotation of ['Memlia','CNCC','partenariat','2026','Confier une première tâche'])assert.throws(()=>cleanFrame(contract[0].centralText+' '+annotation));
 const html=readFileSync(new URL('../../docs/design/circularisation-proof/index.html',import.meta.url),'utf8');assert.match(html,/data-og/);assert.doesNotMatch(html,/display:\s*none|aria-hidden|<img|<svg|logo/i);
});
