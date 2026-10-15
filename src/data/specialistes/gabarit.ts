import type { AgentId, Demonstration, Specialiste, Voisin } from '../specialistes.ts';
import { AGENTS, ficheDe, HUB } from '../specialistes.ts';

/**
 * Le gabarit des fiches `/agents-ia/<métier>` (spec §2, tâche 6) : les titres, intertitres et mentions communs à
 * toutes les fiches, composés avec le prénom, le métier et les voisins de l'agent. Ce que dit chaque agent vit dans ses
 * données (`AGENTS-CONTENU.md`) ; ce fichier ne porte que la charpente, passée par `marketing-skills:copywriting` puis
 * `copy-editing` le 15/10/2026. Lu par le gabarit Astro, par la spec navigateur et par le garde des mots interdits
 * (`specialistes-copy.test.mjs`), pour qu'aucune de ces chaînes n'échappe au garde.
 *
 * L'agent est toujours nommé par son prénom, jamais par un pronom : « il » ou « elle » se tromperait d'un agent à
 * l'autre (Salomé, Victoire, Colette, Prudence). Devant une voyelle ou un h muet, « que » et « de » s'élident.
 */

/** Les prénoms des douze commencent par une consonne, une voyelle ou un h muet (Honoré) : aucun h aspiré. */
const ELIDABLE = /^[aeiouyàâäéèêëîïôöùûüœh]/iu;

/** « que Balthazar », « qu’Émile », « d’Honoré » ; « à » ne s'élide pas. */
export function elider(mot: 'que' | 'de' | 'à', prenom: string): string {
  if (mot === 'à' || !ELIDABLE.test(prenom)) return `${mot} ${prenom}`;
  return `${mot.slice(0, -1)}’${prenom}`;
}

/** « Comptabilité » → « comptabilité » ; un sigle en tête (« RH du cabinet ») reste tel quel (comme la carte du hub). */
export function metierEnPhrase(libelle: string): string {
  return /^\p{Lu}\p{Lu}/u.test(libelle) ? libelle : libelle.charAt(0).toLocaleLowerCase('fr') + libelle.slice(1);
}

/** « A », « A et B », « A, B et C ». */
const enumerer = (noms: readonly string[]): string => (noms.length <= 1 ? noms.join('') : `${noms.slice(0, -1).join(', ')} et ${noms.at(-1)}`);

const VERBES: Record<Voisin['role'], readonly [singulier: string, pluriel: string]> = {
  avant: ['intervient avant', 'interviennent avant'],
  apres: ['prend le relais après', 'prennent le relais après'],
  'a-cote': ['travaille à côté', 'travaillent à côté'],
};

function prenomDe(id: AgentId): string {
  const agent = AGENTS.find(({ slug }) => slug === id);
  if (!agent) throw new Error(`gabarit : voisin inconnu « ${id} »`);
  return agent.prenom;
}

/**
 * La phrase des voisins, composée depuis les données : un groupe par rôle et par objet, dans l'ordre des voisins.
 * « Victoire intervient avant, sur l’entrée en relation ; Grégoire et Florent prennent le relais après. »
 */
export function phraseDesVoisins(voisins: readonly Voisin[]): string {
  if (voisins.length === 0) throw new Error('gabarit : une fiche sans voisin ne compose pas sa phrase');
  const groupes: { role: Voisin['role']; objet?: string; prenoms: string[] }[] = [];
  for (const voisin of voisins) {
    const groupe = groupes.find(({ role, objet }) => role === voisin.role && objet === voisin.objet);
    if (groupe) groupe.prenoms.push(prenomDe(voisin.agent));
    else groupes.push({ role: voisin.role, objet: voisin.objet, prenoms: [prenomDe(voisin.agent)] });
  }
  const propositions = groupes.map(({ role, objet, prenoms }) => {
    const verbe = VERBES[role][prenoms.length > 1 ? 1 : 0];
    return `${enumerer(prenoms)} ${verbe}${objet ? `, sur ${objet}` : ''}`;
  });
  return `${propositions.join(' ; ')}.`;
}

/** Les trois étapes de « Comment <prénom> travaille » : deux puces chacune (spec §2, section 5). */
export interface EtapeFiche {
  titre: string;
  puces: readonly [string, string];
}

export interface GabaritFiche {
  /** « Balthazar · agent IA comptabilité » : l'étiquette du héros, en casse de phrase. */
  etiquette: string;
  /** L'ancre du héros vers « Ce que <prénom> vous remet ». */
  ancreRemet: string;
  rejeu: TexteDuRejeu;
  livrables: { ancre: string; titre: string; texte: string; exemple: string; attente: string; aVenir: string };
  etapes: { titre: string; etapes: readonly [EtapeFiche, EtapeFiche, EtapeFiche] };
  taches: { titre: string; texte: string; aussi: string; aEcrire: string };
  outils: { titre: string; texte: string };
  avecSans: { titre: string; texte: string; colonnes: readonly [string, string]; legende: string };
  regle: { titre: string; texte: string; colonnes: readonly [string, string, string]; legende: string; arrets: { titre: string; texte: string }; envois: { titre: string } };
  voisins: { titre: string; phrase: string; derriere: { titre: string; texte: string }; action: { libelle: string; href: '/methode' } };
  questions: { titre: string; texte: string };
  depart: { titre: string; texte: string; mention: string; tous: string };
}

/** L'en-tête de toute démonstration rendue : le test de forme (`agents-rejeu-source.test.mjs`) le cherche tel quel. */
export const EN_TETE_REJEU = 'Rejoué sur un dossier fictif';

/** Les mots du rejeu (spec §2.1). Ne dépend que de la démonstration : `/integrations` le rend pour Octavie (tâche 8). */
export interface TexteDuRejeu {
  /** L’en-tête, le même sur toutes les fiches et sur /integrations. */
  entete: string;
  /** Le libellé de la règle rejouée : « La règle écrite : lecture et pré-imputation des pièces ». */
  regle: string;
  colonnes: readonly [string, string, string];
  legende: string;
  /** La phrase du pied, avant le lien vers la page où la règle est publiée (rendue seulement si elle existe). */
  source: string;
}

export function texteDuRejeu(demonstration: Demonstration): TexteDuRejeu {
  return {
    entete: EN_TETE_REJEU,
    regle: `La règle écrite : ${demonstration.tache}`,
    colonnes: ['Cas joué', 'Sortie obtenue', 'Décision'],
    legende: `${demonstration.cas.length} cas joués sur le dossier fictif : ${demonstration.tache}`,
    source: 'La règle de cette tâche est publiée sur sa page :',
  };
}

/** Le gabarit composé d'une fiche publiée ; lève pour une carte vers une page ou une fiche pas encore écrite. */
export function gabaritDe(agent: Specialiste): GabaritFiche {
  const fiche = ficheDe(agent);
  const { prenom } = agent;
  const metier = metierEnPhrase(agent.libelle);
  return {
    etiquette: `${prenom} · agent IA ${metier}`,
    ancreRemet: `Voir ce ${elider('que', prenom)} vous remet`,
    rejeu: texteDuRejeu(agent.demonstration),
    livrables: {
      ancre: 'remet',
      titre: `Ce ${elider('que', prenom)} vous remet`,
      texte: 'Chaque livrable arrive comme une proposition, que votre collaborateur relit et valide.',
      exemple: 'Exemple fictif',
      attente: 'En attente de votre validation',
      aVenir: 'Dès que vos accès sont branchés',
    },
    etapes: {
      titre: `Comment ${prenom} travaille`,
      etapes: [
        { titre: 'Vous montrez la tâche', puces: ['Un collaborateur nous montre le geste, dans les outils où il le fait.', 'Nous relevons les sources, les cas courants et les cas qui doivent arrêter la tâche.'] },
        { titre: 'Nous écrivons sa règle', puces: ['La frontière en trois colonnes, écrite dans vos mots.', 'Rejouée sur un dossier fictif, puis recettée par vos collaborateurs, qui la vérifient sur leurs propres cas.'] },
        { titre: `${prenom} propose, vous validez`, puces: ['Chaque proposition arrive avec sa source et la règle appliquée.', 'Votre collaborateur valide ou corrige ; un cas hors règle lui revient avec son motif.'] },
      ],
    },
    taches: {
      titre: `Les tâches ${elider('que', prenom)} prend en charge`,
      texte: 'Chaque tâche suit sa propre règle, écrite avec vous avant la première proposition.',
      aussi: 'Aussi dans son périmètre',
      aEcrire: 'À écrire avec vous',
    },
    outils: {
      titre: 'Dans vos outils',
      texte: `${prenom} prépare ces tâches dans les logiciels de votre cabinet, parmi lesquels :`,
    },
    avecSans: {
      titre: `Avec ou sans ${prenom}`,
      texte: 'Ce qui change pour vos collaborateurs, tâche par tâche.',
      colonnes: [`Sans ${prenom}`, `Avec ${prenom}`],
      legende: `Le travail sans ${prenom}, puis avec ${prenom}`,
    },
    regle: {
      titre: 'La règle écrite',
      texte: `Ce ${elider('que', prenom)} prépare seul, ce qui attend votre validation, ce qui reste humain. La même règle fixe les cas qui arrêtent ${prenom} et ce qui ne part jamais sans vous.`,
      colonnes: [HUB.metiers.colonnes[1], HUB.metiers.colonnes[2], HUB.metiers.colonnes[3]],
      legende: `La frontière de la règle écrite ${elider('de', prenom)}, en trois colonnes`,
      arrets: { titre: 'Conditions d’arrêt', texte: `Devant ces cas, ${prenom} s’arrête et nomme son motif.` },
      envois: { titre: 'Ce qui ne part jamais sans vous' },
    },
    voisins: {
      titre: `Avant et après ${prenom}`,
      phrase: phraseDesVoisins(fiche.voisins),
      derriere: {
        titre: `Derrière ${prenom}, nous.`,
        texte: 'Nous observons la tâche, écrivons sa règle, l’éprouvons sur un dossier fictif, la faisons recetter et la maintenons.',
      },
      action: { libelle: HUB.derriere.action.libelle, href: HUB.derriere.action.href },
    },
    questions: {
      titre: `Avant de confier une tâche ${elider('à', prenom)}`,
      texte: 'Les questions qu’un cabinet pose avant sa première tâche, et nos réponses.',
    },
    depart: {
      titre: 'Par quelle tâche commencer ?',
      texte: `Choisissez le geste que vos collaborateurs refont le plus souvent. Nous écrivons sa règle avec vous, puis ${prenom} le prépare dans vos outils.`,
      mention: 'Rien à envoyer : la description suffit.',
      tous: 'Tous les agents IA',
    },
  };
}
