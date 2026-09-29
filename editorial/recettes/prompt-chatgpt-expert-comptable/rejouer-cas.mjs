// Démonstrateur éditorial local sur données fictives, pas une requête à ChatGPT.
import { writeFileSync } from 'node:fs';

export function preparerDemande({ societe, periode, piece, destinataire, dejaDemandee = false }) {
  if (!piece?.trim() || !periode?.trim()) return { statut: 'arret', motif: 'contexte incomplet', message: null, envoi: false };
  if (dejaDemandee) return { statut: 'arret', motif: 'demande déjà partie', message: null, envoi: false };
  return {
    statut: 'proposition_a_valider',
    objet: `Pièce manquante · ${periode}`,
    message: `Bonjour, pouvez-vous nous transmettre la ${piece} pour ${societe}, période ${periode} ? Si elle n’est pas disponible, indiquez-nous pourquoi. Merci.`,
    destinataire: destinataire || 'à confirmer',
    envoi: false,
  };
}

const cas = [
  { nom: 'nominal', entree: { societe: 'Atelier Fictif', periode: 'avril 2026', piece: 'facture d’achat de matériel', destinataire: null } },
  { nom: 'piece_absente', entree: { societe: 'Atelier Fictif', periode: 'avril 2026', piece: '', destinataire: null } },
  { nom: 'demande_deja_partie', entree: { societe: 'Atelier Fictif', periode: 'avril 2026', piece: 'facture d’achat de matériel', destinataire: null, dejaDemandee: true } },
];

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  const sorties = cas.map(({ nom, entree }) => ({ nom, entree, sortie: preparerDemande(entree) }));
  const journal = { nature: 'exécution locale déterministe, sans modèle ni données client', cas: sorties };
  const path = new URL('./journal-rejeu.json', import.meta.url);
  writeFileSync(path, `${JSON.stringify(journal, null, 2)}\n`);
  console.log(JSON.stringify(journal, null, 2));
}
