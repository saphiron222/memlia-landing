import { readFileSync, writeFileSync } from 'node:fs';
import { parse } from 'parse5';
import assert from 'node:assert/strict';
const dir = new URL('./', import.meta.url);
const file = new URL('./sources.json', dir);
const data = JSON.parse(readFileSync(file));
const text = node => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(text).join(' ');
const compact = s => s.replace(/\s+/g, ' ').trim();
const post = 'Lorsque le commissaire aux comptes intervient plusieurs semaines après la clôture de l’exercice, il peut estimer pertinent de contrôler les créances clients par les encaissements intervenus sur la période subséquente et les dettes fournisseurs par rapport aux factures reçues ou aux règlements effectués postérieurement à la clôture.';
const entries = [
 ['NEP530', 'https://h2a-france.org/normes/selection-des-elements-a-controler/', 'Arrêté 13/11/2024, JO 19/11/2024, A.821-78', '04', 'Lors de la conception des procédures d’audit à mettre en œuvre, le commissaire aux comptes détermine, sur la base de son jugement professionnel, les méthodes appropriées de sélection des éléments à contrôler.'],
 ['NEP911', 'https://h2a-france.org/normes/mission-du-commissaire-aux-comptes-nomme-pour-trois-exercices-prevue-a-larticle-l-823-12-1-du-code-de-commerce/', 'Arrêté 24/07/2026, JO 26/07/2026, A.821-94', '24', post],
 ['NEP912', 'https://h2a-france.org/normes/mission-du-commissaire-aux-comptes-nomme-pour-six-exercices-dans-des-petites-entreprises/', 'Arrêté 24/07/2026, JO 26/07/2026, A.821-94', '23', post],
 ['CIRCIT', 'https://www.circit.io/fr/platform/confirm', 'Déclaration éditeur consultée le 06/10/2026, non testée', 'Confirmations de comptes clients/fournisseurs', 'Téléchargez les soldes, faites correspondre les réponses aux documents de travail et signalez automatiquement les exceptions pour examen.'],
 ['ECIRCU', 'https://www.gestonline.com/blog/circularisation-audit', 'Déclaration éditeur consultée le 06/10/2026, non testée', 'Dématérialiser sa circularisation', 'Le processus devient donc beaucoup plus fluide pour sélectionner les tiers à circulariser, relancer automatiquement, centraliser les justificatifs et assurer le suivi des réponses.'],
];
for (const [id, url, version, paragraph, exact] of entries) {
 const response = await fetch(url); assert.ok(response.ok, `${url}: ${response.status}`);
 const html = await response.text(); const plain = compact(text(parse(html)));
 assert.ok(plain.includes(compact(exact)), `${id}: extrait absent`);
 const stem = id.toLowerCase();
 writeFileSync(new URL(`${stem}-source.html`, dir), html);
 writeFileSync(new URL(`${stem}-source.txt`, dir), plain+'\n');
 const entry = { id, url, version, snapshot: `preuves/${stem}-source.html`, consultedAt: new Date().toISOString(), authority: id.startsWith('NEP') ? 'H2A' : 'éditeur', excerpts: [{ paragraph, exact }], method: 'Téléchargement HTTP officiel et comparaison exacte du texte HTML via parse5 ; aucune fonction éditeur testée.' };
 data.sources = data.sources.filter(s => s.id !== id); data.sources.push(entry);
}
writeFileSync(file, JSON.stringify(data, null, 2)+'\n');
console.log(`PASS : ${entries.length} nouvelles sources, extraits exacts confrontés aux pages ouvertes.`);
