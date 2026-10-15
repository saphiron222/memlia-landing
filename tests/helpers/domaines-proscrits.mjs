/**
 * Domaines qui ne se lient et ne se livrent jamais. Relevé du 06/10/2026 (revisaudit.fr, demande de Kevin),
 * complété le 15/10/2026 (docs/strategy/site-v3/hub-agents-ia/CONNECTEURS.md §17).
 *
 * Les écrire ici sous leur forme claire est voulu : ce fichier est un test, il ne se livre pas. Partout
 * ailleurs, un domaine proscrit s'écrit neutralisé (`revisaudit[.]fr`).
 */
export const DOMAINES_PROSCRITS = Object.freeze([
  { domaine: 'revisaudit.fr', raison: 'contenu de casino injecté' },
  { domaine: 'ibizasoftware.fr', raison: "ancien domaine de l'éditeur Ibiza, devenu un site d'affiliation de paris sportifs et de casino" },
  { domaine: 'ibiza.fr', raison: 'pas de HTTPS ; une liste de répertoire vide en HTTP' },
  { domaine: 'formalis.io', raison: 'redirige vers survey-smiles.com et vers un traceur publicitaire' },
  { domaine: 'sirene.fr', raison: 'le DNS ne répond plus ; un domaine abandonné peut être racheté' },
  { domaine: 'survey-smiles.com', raison: 'cible de la redirection de formalis.io' },
  { domaine: 'sandh-zvg.com', raison: 'traceur publicitaire derrière formalis.io' },
]);

const echapper = (texte) => texte.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const ALTERNATIVES = DOMAINES_PROSCRITS.map(({ domaine }) => echapper(domaine)).join('|');
/** Le domaine doit être un domaine entier ou le parent d'un sous-domaine : `monibiza.fr` n'est pas `ibiza.fr`. */
const DOMAINE_ENTIER = `(?<![a-z0-9-])(?:${ALTERNATIVES})(?![a-z0-9-])`;

/** N'importe quelle mention du domaine, neutralisée exceptée (`revisaudit[.]fr` ne correspond pas). */
export const DOMAINE = new RegExp(DOMAINE_ENTIER, 'iu');

/**
 * Ce qui se clique dans un Markdown (autolien), un HTML ou un JSON : un schéma, une adresse sans schéma
 * (`//hôte`), « www. » ou « mailto: », jusqu'au domaine. La course s'arrête aux blancs, parenthèses, crochets,
 * chevrons et guillemets : deux chaînes voisines d'un JSON ne se lisent pas comme une seule adresse.
 */
export const LIEN = new RegExp(`(?:[a-z][a-z0-9+.-]*:\\/\\/|\\/\\/|www\\.|mailto:)[^\\s)>\\]"'<]*?${DOMAINE_ENTIER}`, 'iu');

/** La forme neutralisée d'un domaine, celle que les notes ont le droit d'écrire. */
export const neutralise = (domaine) => domaine.replace('.', '[.]');
