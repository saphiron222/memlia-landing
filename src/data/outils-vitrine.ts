import { OUTILS_DISPONIBLES } from './outils.ts';
import type { NomPicto } from '@/components/Picto.astro';

export const GROUPES_OUTILS = [
  { id:'ia', nom:'Préparer avec l’IA' },
  { id:'calculs', nom:'Faire un calcul' },
  { id:'dossiers', nom:'Préparer un dossier' },
] as const;
type Groupe = typeof GROUPES_OUTILS[number]['id'];
type Presentation = { nom:string; texte:string; groupe:Groupe; picto:NomPicto };
const PRESENTATIONS:Record<string,Presentation> = {
  'bibliotheque-prompts-comptables': {nom:'Prompts comptables',texte:'Choisissez un modèle de consigne, adaptez-le et copiez-le.',groupe:'ia',picto:'feuilles'},
  'generateur-prompt-expert-comptable': {nom:'Générateur de prompt comptable',texte:'Préparez une consigne à partir de la tâche que vous décrivez.',groupe:'ia',picto:'regle'},
  'calculateur-roi-automatisation': {nom:'Simulateur de ROI',texte:'Estimez le temps valorisé et le budget d’un robot ou d’un agent IA.',groupe:'calculs',picto:'agregat'},
  'generateur-relance-facture-impayee': {nom:'Relance de facture impayée',texte:'Préparez un message amiable à relire avant de l’envoyer.',groupe:'dossiers',picto:'feuilles'},
  'checklist-pieces-comptables': {nom:'Checklist des pièces comptables',texte:'Retrouvez les pièces manquantes et préparez votre demande.',groupe:'dossiers',picto:'recette'},
  'verificateur-fec-local': {nom:'Vérificateur FEC',texte:'Importez un fichier et obtenez les anomalies de structure.',groupe:'dossiers',picto:'bouclier'},
  'calculateur-marge-commerciale': {nom:'Marge commerciale',texte:'Deux montants pour calculer la marge et les deux taux.',groupe:'calculs',picto:'agregat'},
  'calculateur-date-echeance-facture': {nom:'Échéance de facture',texte:'Retrouvez une date à partir du délai convenu.',groupe:'calculs',picto:'regle'},
  'calculateur-amortissement-comptable': {nom:'Amortissement linéaire',texte:'Préparez un tableau à partir de vos hypothèses.',groupe:'calculs',picto:'excel'},
  'generateur-charte-ia-cabinet': {nom:'Trame de charte IA',texte:'Posez les usages et les validations retenus par votre cabinet.',groupe:'ia',picto:'regle'},
  'verificateur-prompt-ia': {nom:'Vérificateur de prompt',texte:'Repérez les rubriques à compléter dans une consigne.',groupe:'ia',picto:'recette'},
  'generateur-prompt-ia-gratuit': {nom:'Générateur de prompt texte',texte:'Assemblez une consigne pour une tâche de rédaction générale.',groupe:'ia',picto:'feuilles'},
  'diagnostic-maturite-ia-cabinet': {nom:'Diagnostic IA du cabinet',texte:'Faites le point sur vos usages et vos premiers besoins.',groupe:'ia',picto:'grille'},
  'preparer-pseudonymiser-fichier-csv-fec': {nom:'Pseudonymiser un fichier',texte:'Choisissez les colonnes à retirer ou à remplacer dans une copie.',groupe:'dossiers',picto:'bouclier'},
  'fusionner-fichiers-csv': {nom:'Fusion de fichiers CSV',texte:'Réunissez plusieurs exports dans un fichier téléchargeable.',groupe:'dossiers',picto:'flux'},
  'comparateur-balances-comptables': {nom:'Comparateur de balances',texte:'Repérez les comptes nouveaux et les variations entre deux périodes.',groupe:'dossiers',picto:'excel'},
  'assistant-lettrage-comptable-local': {nom:'Préparation du lettrage',texte:'Retrouvez les paires exactes et les cas à examiner.',groupe:'dossiers',picto:'flux'},
  'modele-rapprochement-bancaire-excel-gratuit': {nom:'Rapprochement bancaire',texte:'Préparez un tableau des mouvements et des écarts à valider.',groupe:'dossiers',picto:'excel'},
  'bareme-heures-cac': {nom:'Barème d’heures CAC',texte:'Calculez la fourchette après vérification du champ applicable.',groupe:'calculs',picto:'regle'},
  'seuil-signification-audit': {nom:'Seuil de signification',texte:'Calculez un seuil avec la base et le taux que vous choisissez.',groupe:'calculs',picto:'agregat'},
  'suivi-circularisation': {nom:'Suivi de circularisation',texte:'Préparez les courriers et organisez les retours de vos tiers.',groupe:'dossiers',picto:'feuilles'},
};
const ESSENTIELS = new Set(['bibliotheque-prompts-comptables','calculateur-roi-automatisation','generateur-relance-facture-impayee','checklist-pieces-comptables','verificateur-fec-local','fusionner-fichiers-csv']);
// Ordre éditorial : les premiers outils prolongent directement les robots et agents IA.
export const OUTILS_VITRINE = Object.entries(PRESENTATIONS).map(([slug,presentation]) => {
  const outil=OUTILS_DISPONIBLES.find(o=>o.slug===slug);
  if(!outil) throw new Error(`Présentation d’outil sans page : ${slug}`);
  return {...outil,...presentation,essentiel:ESSENTIELS.has(slug),imageAgent:['bareme-heures-cac','seuil-signification-audit','suivi-circularisation'].includes(slug)?'missions-audit':presentation.groupe==='calculs'?'finance':presentation.groupe==='ia'?'comptabilite':'informatique-outils'};
});
if (OUTILS_VITRINE.length !== OUTILS_DISPONIBLES.length) throw new Error('Chaque outil publié doit rester accessible depuis le hub.');

/** Suites courtes par intention : un seul lien voisin, sans nouvelle section de cartes. */
const PARCOURS_OUTILS = [
 ['bibliotheque-prompts-comptables','generateur-prompt-expert-comptable','verificateur-prompt-ia','generateur-prompt-ia-gratuit','generateur-charte-ia-cabinet','diagnostic-maturite-ia-cabinet'],
 ['calculateur-roi-automatisation','calculateur-marge-commerciale','calculateur-amortissement-comptable','comparateur-balances-comptables','seuil-signification-audit','bareme-heures-cac'],
 ['calculateur-date-echeance-facture','generateur-relance-facture-impayee','checklist-pieces-comptables','suivi-circularisation','modele-rapprochement-bancaire-excel-gratuit','assistant-lettrage-comptable-local','verificateur-fec-local','preparer-pseudonymiser-fichier-csv-fec','fusionner-fichiers-csv'],
] as const;
export function outilVoisin(slug:string) {
 const parcours=PARCOURS_OUTILS.find(group=>group.some(id=>id===slug));
 if(!parcours) return undefined;
 const index=parcours.findIndex(id=>id===slug);
 return OUTILS_VITRINE.find(outil=>outil.slug===parcours[(index+1)%parcours.length])!;
}
