import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const MOTS_FAIBLES = new Set([
  'avant', 'avec', 'cabinet', 'cabinet comptable', 'comment', 'dans', 'des', 'du', 'elle', 'est',
  'les', 'leur', 'leurs', 'mais', 'methode', 'pour', 'pourquoi', 'que', 'quel', 'quelle', 'sans',
  'sur', 'une', 'votre',
]);

export function normaliserJetons(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('fr')
    .replace(/[’']/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter((mot) => mot.length >= 3 && !MOTS_FAIBLES.has(mot));
}

function racineCommune(a, b) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i += 1;
  return i;
}

export function jetonsCompatibles(a, b) {
  if (a === b) return true;
  if (Math.min(a.length, b.length) <= 3) return false;
  return racineCommune(a, b) >= Math.min(5, a.length, b.length);
}

export function titrePorteRequete(titre, requete) {
  const titreJetons = normaliserJetons(titre);
  const requeteJetons = [...new Set(normaliserJetons(requete))];
  if (requeteJetons.length === 0) return false;
  const correspondances = requeteJetons.filter((mot) => titreJetons.some((titreMot) => jetonsCompatibles(mot, titreMot)));
  const minimum = requeteJetons.length === 1 ? 1 : 2;
  return correspondances.length >= minimum && correspondances.length / requeteJetons.length >= 0.5;
}

export function titrePorteUneRequeteMesuree(titre, requetes, autocompletion) {
  return requetes
    .filter((requete) => Object.hasOwn(autocompletion, requete))
    .some((requete) => titrePorteRequete(titre, requete));
}

const DOSSIER_MESURES = 'docs/strategy/site-v3/mesures';
const RELEVE_TITRES = /^(?:questions|titres-intent)-(\d{4}-\d{2}-\d{2})\.json$/;
// Le relevé de demande du lundi (scripts/seo/releve-demande.mjs, cron memlia-releve-demande) autocomplète la
// requête primaire de chaque article du registre. Sa date est dans le fichier ; ses pannes ne sont pas des mesures.
const RELEVE_DEMANDE = /^semaine-\d{4}-W\d{2}-demande\.json$/;
const DATE_ISO = /^\d{4}-\d{2}-\d{2}$/;

function ecartJours(debut, fin) {
  return Math.floor((Date.parse(`${fin}T00:00:00Z`) - Date.parse(`${debut}T00:00:00Z`)) / 86_400_000);
}

const estDictionnaire = (valeur) => Boolean(valeur) && typeof valeur === 'object' && !Array.isArray(valeur);

/** Un fichier de mesures : sa date, et la lecture de ses mesures, faite seulement s'il est frais. */
function releveDuFichier(dossier, nom) {
  const date = nom.match(RELEVE_TITRES)?.[1];
  if (date) {
    return [{ nom, date, mesures: () => {
      const releve = JSON.parse(readFileSync(join(dossier, nom), 'utf8'));
      if (!estDictionnaire(releve.autocompletion)) throw new Error(`relevé d’autocomplétion invalide : ${nom}`);
      return releve.autocompletion;
    } }];
  }
  if (!RELEVE_DEMANDE.test(nom)) return [];
  const releve = JSON.parse(readFileSync(join(dossier, nom), 'utf8'));
  if (!DATE_ISO.test(String(releve.date ?? ''))) throw new Error(`relevé de demande sans date valide : ${nom}`);
  return [{ nom, date: releve.date, mesures: () => {
    if (!estDictionnaire(releve.autocompletion?.mesuree)) throw new Error(`relevé de demande sans autocomplétion mesurée : ${nom}`);
    return releve.autocompletion.mesuree;
  } }];
}

/**
 * Charge les relevés produits par l'autocomplétion Google : ceux de la forge (questions, titres-intent) et le
 * relevé de demande du lundi. Une liste vide est une mesure valide ; seule l'absence de la requête signifie
 * « non mesurée ». La valeur la plus récente de chaque requête gagne et une mesure future ou vieille de plus
 * de huit jours est ignorée. L'audit d'un dossier scellé peut fournir sa date de publication comme borne :
 * les candidats non scellés restent soumis au relevé hebdomadaire frais.
 */
export function chargerAutocompletionMesuree(root, { au = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()), ageMaxJours = 8 } = {}) {
  const dossier = join(root, DOSSIER_MESURES);
  if (!existsSync(dossier)) throw new Error(`relevés d’autocomplétion absents : ${DOSSIER_MESURES}`);
  const fichiers = readdirSync(dossier)
    .flatMap((nom) => releveDuFichier(dossier, nom))
    .filter(({ date }) => date <= au && ecartJours(date, au) <= ageMaxJours)
    .sort((a, b) => a.date.localeCompare(b.date) || a.nom.localeCompare(b.nom));
  if (fichiers.length === 0) throw new Error(`aucun relevé d’autocomplétion frais au ${au} (âge maximal : ${ageMaxJours} jours)`);

  const autocompletion = {};
  const mesureParRequete = {};
  for (const fichier of fichiers) {
    for (const [requete, suggestions] of Object.entries(fichier.mesures())) {
      if (!Array.isArray(suggestions)) throw new Error(`mesure d’autocomplétion invalide pour « ${requete} » dans ${fichier.nom}`);
      autocompletion[requete] = suggestions;
      mesureParRequete[requete] = { date: fichier.date, fichier: fichier.nom, suggestions: suggestions.length };
    }
  }
  return { autocompletion, mesureParRequete, fichiers: fichiers.map(({ nom }) => nom), au, ageMaxJours };
}

/** Refuse un titre qui ne porte aucune des requêtes réellement mesurées et fraîches. */
export function verifierTitreIntentMesure({ root, titre, requetes, au, surface = 'H1' }) {
  const mesure = chargerAutocompletionMesuree(root, { au });
  const candidates = [...new Set((requetes ?? []).filter((requete) => Object.hasOwn(mesure.autocompletion, requete)))];
  if (candidates.length === 0) {
    throw new Error(`${surface} sans requête mesurée par l’autocomplétion : ${(requetes ?? []).join(' ; ') || 'aucune requête déclarée'}`);
  }
  const portee = candidates.find((requete) => titrePorteRequete(titre, requete));
  if (!portee) {
    throw new Error(`${surface} narratif sans intention mesurée — ${titre}`);
  }
  return { requete: portee, mesure: mesure.mesureParRequete[portee] };
}
