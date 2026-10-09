import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {demoSession,result,STATES} from '../../src/lib/checklist-pieces.mjs';
test('preuve HTML canonique : quatre états et mail issus du moteur',()=>{
 const source=readFileSync(new URL('../../docs/design/checklist-pieces-proof/index.html',import.meta.url),'utf8');
 const s=demoSession();for(const i of s.items)assert.ok(source.includes(`<tr><td>${i.label}</td><td>${STATES[i.state]}</td></tr>`));
 const mail=source.match(/<div class="mail">([\s\S]*?)<\/div>/)[1];assert.ok(mail.includes(result(s).missing[0].label));
 for(const i of s.items.filter(i=>i.state!=='missing'))assert.ok(!mail.includes(i.label));
 assert.ok(!/logo|Memlia|partenariat|certifié/.test(source));
});
