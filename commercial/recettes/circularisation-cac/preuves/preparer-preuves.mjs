import { readFileSync, writeFileSync } from 'node:fs';
import { parse } from 'parse5';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
const root = process.cwd();
const dir = fileURLToPath(new URL('.', import.meta.url));
const recipe = JSON.parse(readFileSync(`${dir}../recette.json`, 'utf8'));
const measures = JSON.parse(readFileSync(`${root}/docs/strategy/site-v3/cac/mesures/autocomplete-cac-2026-10-06.json`, 'utf8'));
const entries = [recipe.primaryQuery, ...recipe.secondaryQueries].map(query => {
  const entry = measures.requetes.find(e => e.requete === query);
  assert.ok(entry?.ok, query);
  assert.equal(new Date(entry.mesureLe).toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' }), '2026-10-06');
  return entry;
});
const output = { date: '2026-10-06', instrument: measures.instrument, origine: 'docs/strategy/site-v3/cac/mesures/autocomplete-cac-2026-10-06.json', autocompletion: Object.fromEntries(entries.map(e => [e.requete, e.suggestions])), mesures: entries };
writeFileSync(`${root}/docs/strategy/site-v3/mesures/titres-intent-2026-10-06.json`, JSON.stringify(output, null, 2)+'\n');
function text(node) { return node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(text).join(' '); }
const compact = t => t.replace(/\s+/g, ' ').trim();
const sources = [
 { id: 'NEP505', url: 'https://h2a-france.org/normes/demandes-de-confirmation-des-tiers/', snapshot: `${root}/../nep505.html`, version: 'Arrêté 28/12/2023, JO 31/12/2023, A.821-76', excerpts: [
  { paragraph: '03', exact: 'La demande de confirmation des tiers consiste à obtenir de la part d’un tiers une déclaration directement adressée au commissaire aux comptes concernant une ou plusieurs informations.' },
  { paragraph: '09', exact: 'Le commissaire aux comptes a la maîtrise de la sélection des tiers à qui il souhaite adresser les demandes de confirmation, de la rédaction et de l’envoi de ces demandes, ainsi que de la réception des réponses.' },
  { paragraph: '13', exact: 'Lorsque le commissaire aux comptes n’obtient pas de réponse à une demande de confirmation, il met en œuvre des procédures d’audit alternatives permettant de collecter les éléments qu’il estime nécessaires pour vérifier les assertions faisant l’objet du contrôle.' }
 ] },
 { id: 'NEP315', url: 'https://h2a-france.org/normes/connaissance-de-lentite-et-de-son-environnement-et-evaluation-du-risque-danomalies-significatives-dans-les-comptes/', snapshot: `${root}/../nep315.html`, version: 'Arrêté 13/11/2024, JO 19/11/2024, A.821-72', excerpts: [
  { paragraph: '14', exact: 'Ces outils et techniques automatisés se distinguent des plateformes et logiciels d’audit utilisés pour documenter les travaux du commissaire aux comptes.' },
  { paragraph: '46', exact: 'la manière dont les outils fonctionnent' },
  { paragraph: '46', exact: 'le degré de pertinence et de fiabilité des informations qui sont intégrées dans ces outils' },
  { paragraph: '48 d)', exact: 'Les éléments d’appréciation des outils et techniques automatisés visés au paragraphe 46.' }
 ] }
];
for (const source of sources) {
 const html = readFileSync(source.snapshot, 'utf8');
 const plain = compact(text(parse(html)));
 for (const e of source.excerpts) assert.ok(plain.includes(compact(e.exact)), `${source.id} ${e.paragraph}`);
 writeFileSync(`${dir}${source.id.toLowerCase()}-source.html`, html);
 writeFileSync(`${dir}${source.id.toLowerCase()}-source.txt`, plain+'\n');
 source.snapshot = `preuves/${source.id.toLowerCase()}-source.html`;
 source.consultedAt = new Date().toISOString();
 source.authority = 'H2A';
 source.method = 'Page officielle ouverte avec web_extract puis HTML téléchargé par curl ; extraits confrontés au texte HTML via parse5.';
}
writeFileSync(`${dir}sources.json`, JSON.stringify({ status: 'PASS', sources }, null, 2)+'\n');
console.log('PASS : 4 mesures C2 reprises sans nouvelle recherche ; 7 extraits exacts vérifiés sur deux HTML officiels.');
console.log('Longueurs métadonnées :', recipe.tabTitle.length, recipe.description.length);
