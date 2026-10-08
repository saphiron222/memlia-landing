/**
 * Ce que les logiciels des cabinets font déjà, tâche par tâche, et ce qui reste à la main.
 *
 * Règle (Kevin, 06/10/2026) : une page service ne présente jamais comme un gain un geste que le
 * logiciel du cabinet fait déjà ; elle le dit, puis montre ce qui reste. Chaque page de
 * src/content/services/ a son entrée ici : tests/scripts/service-couverture.test.mjs refuse une
 * page sans entrée, une source non datée ou une entrée orpheline.
 *
 * Les gestes sont ceux que documentent les pages des éditeurs, lues le 06/10/2026. Preuves :
 * chantier cac-site-niveau-superieur, sorties/couverture-logiciels-2026-10-06/ (coffre Memlia).
 */

/**
 * @typedef {{ url: string, libelle: string, consulteLe: string }} SourceEditeur
 * @typedef {{ outil: string, geste: string, source: SourceEditeur }} GesteOutille
 * @typedef {{ dejaFait: GesteOutille[], reste: string[] }} Couverture
 */

const LU_LE = '2026-10-06';

/** @type {Readonly<Record<string, Couverture>>} */
export const COUVERTURE_SERVICES = Object.freeze({
  'circularisation-cac': {
    dejaFait: [
      {
        outil: 'e-Circu',
        geste: 'prépare les courriers, facilite la sélection des tiers, relance et centralise les justificatifs et le suivi des réponses',
        source: { url: 'https://www.gestonline.com/blog/circularisation-audit', libelle: 'Gest On Line, circularisation avec e-Circu', consulteLe: LU_LE },
      },
      {
        outil: 'Circit',
        geste: 'envoie, suit et reçoit les confirmations, rapproche les réponses des documents de travail et signale les exceptions',
        source: { url: 'https://www.circit.io/fr/platform/confirm', libelle: 'Circit, Confirm', consulteLe: LU_LE },
      },
    ],
    reste: [
      'la proposition de tiers selon la règle de votre cabinet, si elle n’est pas déjà couverte : soldes, mouvements, tirage reproductible, couverture ou nombre de comptes, deux passes et feuille de couverture ;',
      'la préparation des pièces et rapprochements postérieurs choisis par le CAC pour les écarts ou non-réponses, avec conclusion laissée à son examen.',
    ],
  },
  'entrees-sorties-salaries': {
    "dejaFait": [
      {
        "outil": "mySilae",
        "geste": "crée la fiche salarié et transmet la DPAE quand l’embauche passe par le portail",
        "source": {
          "url": "https://www.silae.fr/solution-rh-paie/gestion-des-salaries/",
          "libelle": "Silae, gérer les salariés de A à Z",
          "consulteLe": "2026-10-06"
        }
      },
      {
        "outil": "mySilae",
        "geste": "collecte les pièces sur le portail, relance et outille les documents de sortie et leur signature",
        "source": {
          "url": "https://www.silae.fr/solution-rh-paie/gestion-des-salaries/",
          "libelle": "Silae, gérer les salariés de A à Z",
          "consulteLe": "2026-10-06"
        }
      },
      {
        "outil": "PayFit",
        "geste": "génère les contrats, les fait signer avec Yousign et rappelle les pièces attendues dans son espace salarié",
        "source": {
          "url": "https://payfit.com/fr/gestion-du-personnel/",
          "libelle": "PayFit, gestion du personnel",
          "consulteLe": "2026-10-06"
        }
      }
    ],
    "reste": [
      "les annonces reçues par e-mail ou dans un compte rendu d’appel, hors du circuit déjà utilisé ;",
      "les informations à réunir et les contradictions à présenter au gestionnaire ;",
      "les champs de DPAE et de fiche salarié préparés à valider, seulement pour une entrée hors portail ;",
      "le dossier de sortie hors portail préparé, sans calcul de droits ni génération de documents finaux."
    ]
  },

  'saisie-comptable': {
    dejaFait: [
      {
        outil: 'Pennylane',
        geste: 'lit les pièces et pré-remplit les écritures à valider',
        source: { url: 'https://www.pennylane.com/fr/expert-comptable/saisie', libelle: 'Pennylane, la saisie pour les experts-comptables', consulteLe: LU_LE },
      },
      {
        outil: 'Cegid Loop',
        geste: 'reconnaît une partie des écritures et les pré-saisit',
        source: { url: 'https://www.shine.fr/experts-comptables/produits/cegid-loop', libelle: 'Cegid, Loop pour les experts-comptables', consulteLe: LU_LE },
      },
      {
        outil: 'Agiris AMICOMPTA',
        geste: 'automatise la saisie détaillée des pièces',
        source: { url: 'https://www.agiris.fr/logiciel/amicompta', libelle: 'Agiris, AMICOMPTA', consulteLe: LU_LE },
      },
      {
        outil: 'Dext',
        geste: 'extrait les données des factures et des reçus, puis affecte les comptes selon vos règles fournisseurs',
        source: { url: 'https://dext.com/fr/cabinet/produits/saisie-comptable', libelle: 'Dext, la saisie comptable pour les cabinets', consulteLe: LU_LE },
      },
    ],
    reste: [
      'les pièces que votre outil ne sait pas lire ou ne sait pas imputer ;',
      'les factures atypiques et les doublons sans numéro, chacun présenté avec son motif.',
    ],
  },
  'factures-fournisseurs': {
    dejaFait: [
      {
        outil: 'Dext',
        geste: 'extrait les données des factures d’achat',
        source: { url: 'https://dext.com/fr/cabinet/produits/saisie-comptable', libelle: 'Dext, la saisie comptable pour les cabinets', consulteLe: LU_LE },
      },
      {
        outil: 'Pennylane',
        geste: 'reçoit les factures et pré-remplit leur imputation',
        source: { url: 'https://www.pennylane.com/fr/expert-comptable/saisie', libelle: 'Pennylane, la saisie pour les experts-comptables', consulteLe: LU_LE },
      },
      {
        outil: 'Cegid Conciliator',
        geste: 'contrôle chaque facture reçue et génère les écritures',
        source: { url: 'https://www.shine.fr/experts-comptables/cegid-conciliator/', libelle: 'Cegid, Conciliator', consulteLe: LU_LE },
      },
    ],
    reste: [
      'les exceptions : doublon probable, avoir, facture illisible ou incomplète ;',
      'le motif écrit de chaque exception, pour que le collaborateur tranche vite ;',
      'les dossiers dont les factures arrivent par plusieurs canaux à la fois.',
    ],
  },
  'rapprochement-bancaire': {
    dejaFait: [
      {
        outil: 'Pennylane',
        geste: 'propose les rapprochements entre mouvements et pièces',
        source: { url: 'https://www.pennylane.com/fr/expert-comptable/saisie', libelle: 'Pennylane, la saisie pour les experts-comptables', consulteLe: LU_LE },
      },
      {
        outil: 'Tiime',
        geste: 'rapproche automatiquement les transactions bancaires',
        source: { url: 'https://www.tiime.fr/ec/pre-compta', libelle: 'Tiime, la pré-comptabilité pour les cabinets', consulteLe: LU_LE },
      },
      {
        outil: 'Dext',
        geste: 'propose la facture qui correspond à une transaction bancaire',
        source: { url: 'https://help.dext.com/fr/articles/215760-rapprocher-une-transaction-avec-une-ou-plusieurs-factures-dans-dext-cabinets', libelle: 'Dext, rapprocher une transaction', consulteLe: LU_LE },
      },
      {
        outil: 'fulll',
        geste: 'réconcilie les mouvements selon des règles',
        source: { url: 'https://aide.fulll.io/fr/articles/540478-comprendre-la-reconciliation', libelle: 'fulll, comprendre la réconciliation', consulteLe: LU_LE },
      },
    ],
    reste: [
      'les lignes que votre outil ne reconnaît pas ;',
      'les paiements groupés, qui admettent plusieurs combinaisons ;',
      'les frais non identifiés, chacun avec son motif.',
    ],
  },
  'notes-de-frais': {
    dejaFait: [
      {
        outil: 'N2F',
        geste: 'lit les justificatifs, calcule les indemnités kilométriques, fait suivre l’approbation et repère les doublons',
        source: { url: 'https://www.n2f.com/', libelle: 'N2F, notes de frais', consulteLe: LU_LE },
      },
    ],
    reste: [
      'les notes qui arrivent hors de l’outil : photos, e-mails, tableurs du client ;',
      'les dépenses hors de la règle du client, à trancher ;',
      'le justificatif manquant, à réclamer en le nommant.',
    ],
  },
  paie: {
    dejaFait: [
      {
        outil: 'mySilae',
        geste: 'recueille les variables saisies par le client et envoie la DPAE à l’embauche',
        source: { url: 'https://www.silae.fr/solution-rh-paie/', libelle: 'Silae, mySilae', consulteLe: LU_LE },
      },
      {
        outil: 'Cegid',
        geste: 'reçoit les éléments variables déposés par le client dans son portail',
        source: { url: 'https://www.cegid.com/fr/produits/portail-collaboratif/', libelle: 'Cegid, portail collaboratif', consulteLe: LU_LE },
      },
      {
        outil: 'ACD i-PAIE',
        geste: 'fait saisir les variables par le client dans le portail du cabinet',
        source: { url: 'https://www.acd-groupe.fr/solution-collaborative/modules-social/', libelle: 'ACD, i-PAIE et i-SALARIÉ', consulteLe: LU_LE },
      },
      {
        outil: 'Silae',
        geste: 'reçoit les comptes rendus DSN, dont le CRM de rappel',
        source: { url: 'https://www.silae.fr/crm-de-rappel-traitement/', libelle: 'Silae, le CRM de rappel en 2026', consulteLe: LU_LE },
      },
    ],
    reste: [
      'les variables envoyées par e-mail, dans le tableur du client ou par téléphone ;',
      'les questions à poser au client avant de lancer la paie ;',
      'les retours DSN du portefeuille, quand votre outil ne les trie pas par date limite : une fiche par retour, la correction préparée.',
    ],
  },
});

/** La couverture d'une page service, ou `undefined` si elle n'en a pas. */
export function couvertureDe(slug) {
  return COUVERTURE_SERVICES[slug];
}
