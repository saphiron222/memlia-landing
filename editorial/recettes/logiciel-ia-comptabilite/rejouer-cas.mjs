// Exercice éditorial déterministe et fictif, sans logiciel commercial ni écriture comptable.
import { writeFileSync } from 'node:fs';

export function classerPiece({ dossier, periode, periodeAttendue, empreinte, empreintesConnues }) {
  if (!dossier || !periode || !empreinte) return { statut: 'arret', motif: 'donnée absente', ecriture: 'aucune' };
  if (periode !== periodeAttendue) return { statut: 'exception', motif: 'période ambiguë', ecriture: 'aucune' };
  if (empreintesConnues.includes(empreinte)) return { statut: 'exception', motif: 'doublon probable', ecriture: 'aucune' };
  return { statut: 'proposition_a_valider', motif: 'contrôles humains requis', ecriture: 'aucune' };
}

const cas = [
  { nom: 'normal', entree: { dossier: 'D-001', periode: 'avril', periodeAttendue: 'avril', empreinte: 'A', empreintesConnues: [] } },
  { nom: 'doublon', entree: { dossier: 'D-001', periode: 'avril', periodeAttendue: 'avril', empreinte: 'A', empreintesConnues: ['A'] } },
  { nom: 'periode_ambigue', entree: { dossier: 'D-001', periode: 'mars', periodeAttendue: 'avril', empreinte: 'B', empreintesConnues: [] } },
  { nom: 'contexte_absent', entree: { dossier: 'D-001', periode: 'avril', periodeAttendue: 'avril', empreinte: '', empreintesConnues: [] } },
];

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  const journal = {
    nature: 'exécution locale déterministe sur données fictives, aucun éditeur interrogé',
    cas: cas.map(({ nom, entree }) => ({ nom, entree, sortie: classerPiece(entree) })),
  };
  writeFileSync(new URL('./journal-rejeu.json', import.meta.url), `${JSON.stringify(journal, null, 2)}\n`);
  console.log(JSON.stringify(journal, null, 2));
}
