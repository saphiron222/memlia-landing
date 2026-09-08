/**
 * Modules Memlia — la liste affichée est une décision de Kevin, pas une déduction.
 * Règle (consigne du 08/09/2026) : aucune promesse au-delà des modules livrés, aucune
 * entrée « bientôt ». Les sept statuts éditoriaux M1 ont été validés sur t_349fa3eb.
 * Seul le module disponible porte une capture ; les autres restent des périmètres bornés.
 */
export type StatutModule = 'disponible' | 'pilote' | 'etude' | 'distinct';

export interface Module {
  id: 'suivi-social' | 'supervision-sociale' | 'flux-compta' | 'synthese-salaires' | 'bulletins-dsn' | 'conseil-fiscal' | 'memlia-desk';
  nom: string;
  /** Teinte de tuile : identifie le module ; l'interface reste verte. */
  tuile: string;
  /** Couleur de l'icône posée sur la tuile (contraste ≥ 4:1 vérifié dans la spec 2.1). */
  encreTuile: 'encre' | 'creme';
  statut: StatutModule;
  affiche: boolean;
  /** Une phrase de problème métier (titre de bande). */
  titre: string;
  /** Paragraphe de bande, 65 ch max par ligne. */
  texte: string;
  /** Identifiant de l'image de bande (voir src/data/images.mjs). */
  image?: 'img-04-onglet-suivi-social';
}

export const MODULES: readonly Module[] = [
  {
    id: 'suivi-social',
    nom: 'Suivi de production sociale',
    tuile: '#27b657',
    encreTuile: 'encre',
    statut: 'disponible',
    affiche: true,
    titre: 'Voir ce qui avance, bloque ou manque à l’échelle du portefeuille.',
    texte:
      'Un panneau latéral greffé sur le classeur de suivi que le cabinet utilise déjà, sans macro. Les lignes proposées se distinguent des lignes saisies ; les agrégats ne sont jamais nominatifs.',
    image: 'img-04-onglet-suivi-social',
  },
  {
    id: 'supervision-sociale',
    nom: 'Supervision sociale',
    tuile: '#1e63d4',
    encreTuile: 'creme',
    statut: 'pilote',
    affiche: true,
    titre: 'Préparer une vue de contrôle du portefeuille sans surveiller les personnes.',
    texte:
      'Une vue de contrôle du portefeuille de production sociale, en agrégats, sans transformer l’outil en surveillance individuelle.',

  },
  {
    id: 'flux-compta',
    nom: 'Flux comptables',
    tuile: '#b86b2e',
    encreTuile: 'creme',
    statut: 'etude',
    affiche: true,
    titre: 'Contrôler et préparer certains flux avant leur exploitation comptable.',
    texte:
      'Contrôler et préparer certains flux issus des outils métier avant leur exploitation comptable.',

  },
  {
    id: 'synthese-salaires',
    nom: 'Synthèse salaires',
    tuile: '#1f6b78',
    encreTuile: 'creme',
    statut: 'etude',
    affiche: true,
    titre: 'Préparer une synthèse à partir des sources et versions couvertes.',
    texte:
      'Préparer une synthèse à partir des sources et versions couvertes, sans promettre une compatibilité universelle.',
  },
  {
    id: 'bulletins-dsn', nom: 'Contrôle des bulletins avant DSN',
    tuile: '#27b657', encreTuile: 'encre', statut: 'etude', affiche: true,
    titre: 'Contrôler une liste définie de règles et isoler les écarts.',
    texte: 'Le module ne garantit pas à lui seul la conformité de la paie ou de la DSN, qui reste validée par le cabinet.',
  },
  {
    id: 'conseil-fiscal', nom: 'Conseil fiscal',
    tuile: '#27b657', encreTuile: 'encre', statut: 'etude', affiche: true,
    titre: 'Structurer des calculs et hypothèses bornés.',
    texte: 'Structurer des calculs et hypothèses bornés, puis soumettre la proposition au professionnel.',
  },
  {
    id: 'memlia-desk', nom: 'memlia-desk',
    tuile: '#27b657', encreTuile: 'encre', statut: 'distinct', affiche: true,
    titre: 'Un périmètre distinct pour la finance et la banque.',
    texte: 'Appliquer le même contrat de preuve aux traitements Excel de la finance et de la banque.',
  },
] as const;

export const MODULES_AFFICHES = MODULES.filter((m) => m.affiche);

export const LIBELLE_STATUT: Record<StatutModule, string> = {
  disponible: 'Disponible',
  pilote: 'En pilote',
  etude: 'Sur étude',
  distinct: 'Périmètre distinct',
};

/** Ancre d'un module sur l'accueil tant que sa page dédiée n'existe pas (spec 7 bis). */
export const ancreModule = (m: Pick<Module, 'id'>) => `#module-${m.id}`;
