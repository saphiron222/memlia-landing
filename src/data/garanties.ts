import { ancreFaq } from './faq';

/**
 * Grille de garanties (spec S3) — remplace la grille de logos clients.
 * Chaque cellule est un lien vers la question de la FAQ qui la détaille.
 * `picto` : identifiant d'un tracé SVG maison (src/components/Picto.astro).
 */
export interface Garantie {
  picto: 'main' | 'fictif' | 'bouclier' | 'excel' | 'stop' | 'agregat';
  libelle: string;
  href: string;
}

export const GARANTIES: readonly Garantie[] = [
  { picto: 'main', libelle: 'L’IA prépare, l’humain décide', href: ancreFaq('ia-decide') },
  { picto: 'fictif', libelle: 'Aucune donnée client dans les démos', href: ancreFaq('donnees-reelles') },
  { picto: 'bouclier', libelle: 'RGPD et secret professionnel', href: ancreFaq('donnees-reelles') },
  { picto: 'excel', libelle: 'Vos classeurs, un périmètre cadré', href: ancreFaq('quitter-excel') },
  { picto: 'stop', libelle: 'Refuse d’écrire plutôt que d’écrire faux', href: ancreFaq('fichier-ambigu') },
  { picto: 'agregat', libelle: 'Agrégats, jamais nominatif', href: ancreFaq('surveillance') },
] as const;
