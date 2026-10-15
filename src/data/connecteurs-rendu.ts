/**
 * La taille d'affichage des logos de `/integrations` (tâche 8), lue au build dans les fichiers de `public/logos`.
 *
 * Un logo s'affiche à surface à peu près constante : un mot-symbole très large descend vers 20 px de haut, une icône
 * carrée monte jusqu'à la hauteur maximale de son cadre, et aucune image ne dépasse la largeur d'une carte étroite.
 * La page pose `width` et `height` (aucun décalage au chargement paresseux) ; le fichier lui-même n'est jamais retouché.
 *
 * Hors de la feuille de données : ce module lit le disque et décode les images (sharp), au build seulement.
 */
import { join } from 'node:path';
import sharp from 'sharp';

export interface TailleLogo {
  largeur: number;
  hauteur: number;
}

/** Surface visée, en px² : 32 px de haut pour un logo trois fois plus large que haut. */
const AIRE = 3200;
const HAUTEUR_MIN = 20;
const LARGEUR_MAX = 176;
/** Hauteur maximale sur la carte ; sur une tuile encre, la marge de la tuile en prend une part. */
export const HAUTEUR_MAX = { clair: 40, encre: 32 } as const;

/** La taille d'affichage d'une image de `largeur` × `hauteur` px intrinsèques. */
export function tailleAffichee(largeur: number, hauteur: number, hauteurMax: number): TailleLogo {
  if (!(largeur > 0) || !(hauteur > 0)) throw new Error(`logo : dimensions illisibles (${largeur} × ${hauteur})`);
  const rapport = largeur / hauteur;
  let h = Math.min(hauteurMax, Math.max(HAUTEUR_MIN, Math.sqrt(AIRE / rapport)));
  let l = h * rapport;
  if (l > LARGEUR_MAX) {
    l = LARGEUR_MAX;
    h = l / rapport;
  }
  return { largeur: Math.max(1, Math.round(l)), hauteur: Math.max(1, Math.round(h)) };
}

const cache = new Map<string, Promise<TailleLogo>>();

/** La taille d'affichage du logo publié à `src` (`/logos/<id>.svg|webp`). Lève si le fichier ne se lit pas. */
export function tailleDuLogo(src: string, hauteurMax: number): Promise<TailleLogo> {
  const cle = `${src}@${hauteurMax}`;
  const connue = cache.get(cle);
  if (connue) return connue;
  const mesure = sharp(join(process.cwd(), 'public', src)).metadata().then(({ width, height }) => {
    if (!width || !height) throw new Error(`${src} : dimensions absentes du fichier`);
    return tailleAffichee(width, height, hauteurMax);
  });
  cache.set(cle, mesure);
  return mesure;
}
