/**
 * La palette d'une couverture d'article : l'épingler dans le brief, puis la MESURER.
 *
 * Leçon du 18/09/2026 : la revue image ne mesurait pas la palette. Une couverture à 0,00 %
 * de graphite passait PASS depuis des mois, parce qu'aucun critère ne lisait les pixels.
 * Corrélation relevée le même jour : les trois briefs qui épinglent le hex ont sorti trois
 * images conformes sur trois ; les trois briefs flous, une sur trois.
 *
 * D'où deux contrôles distincts, à ne pas confondre :
 *   1. le BRIEF épingle chaque couleur nommée par son hex (contrôle de texte, ici) ;
 *   2. l'IMAGE porte vraiment ces couleurs, au-dessus du plancher de leur rôle (mesure des
 *      pixels, dans scripts/mesurer-palette.mjs, qui appelle `classerPixel` d'ici).
 *
 * Fonctions pures : aucune lecture de fichier, aucune mutation.
 */

const HEX = /#[0-9a-f]{6}\b/gi;
/** Mots de couleur du langage des briefs Memlia : nommer l'un d'eux sans son hex est le défaut. */
const MOTS_COULEUR = ['vert', 'verte', 'crème', 'creme', 'graphite', 'papier', 'encre', 'blanc', 'blanche', 'noir', 'noire', 'bleu', 'bleue', 'rouge', 'cuivre', 'pétrole', 'petrole', 'ocre', 'sable', 'ardoise'];
const MINIMUM_HEX = 3;

/**
 * Planchers calibrés sur les six couvertures livrées, mesurés le 19/09/2026 (le corpus AVANT de s'y fier) :
 * crème de 27 à 82 %, verts de 0,3 à 9,9 %, graphite de 0,03 à 8,5 %. Une « dominante » à 10 % serait
 * fausse : dans cette direction artistique, c'est le fond crème qui domine et le vert qui accentue.
 * Retenu : une couleur annoncée dominante doit être clairement visible (2 %), une touche présente (0,5 %).
 * Ces planchers n'absolvent personne — deux couvertures livrées les manquent, et c'est écrit en dette.
 */
export const SEUILS_PALETTE = Object.freeze({ dominante: 0.02, touche: 0.005, presente: 0.005 });

const pourcent = (part) => `${(part * 100).toFixed(3).replace(/\.?0+$/, '').replace('.', ',')} %`;

const roleDuSegment = (segment) => {
  const s = segment.toLowerCase();
  if (/dominant/.test(s)) return 'dominante';
  if (/touche|pointe|accent/.test(s)) return 'touche';
  return 'presente';
};

/** Les hex épinglés par le brief, chacun avec le rôle que lui donne son segment (dominante, touche, présente). */
export function couleursDuBrief(palette) {
  const texte = String(palette ?? '');
  if (!texte.trim()) return [];
  const couleurs = [];
  for (const segment of texte.split(/[,;]/)) {
    const role = roleDuSegment(segment);
    for (const hex of segment.match(HEX) ?? []) couleurs.push({ hex: hex.toLowerCase(), role });
  }
  return couleurs;
}

/** Ce qui manque au brief pour être mesurable : une couleur nommée sans hex, ou moins de trois hex. */
export function verifierBriefPalette(palette) {
  const texte = String(palette ?? '');
  const couleurs = couleursDuBrief(texte);
  if (couleurs.length === 0) return ['Palette du brief : aucune couleur épinglée par son code hex — une palette non épinglée ne se mesure pas (leçon du 18/09/2026).'];
  const erreurs = [];
  for (const segment of texte.split(/[,;]/)) {
    if ((segment.match(HEX) ?? []).length > 0) continue;
    const mot = MOTS_COULEUR.find((m) => new RegExp(`\\b${m}\\b`, 'i').test(segment));
    if (mot) erreurs.push(`Palette du brief : « ${segment.trim()} » nomme une couleur (${mot}) sans son code hex — l'épingler, sinon la revue image ne peut pas la mesurer.`);
  }
  if (couleurs.length < MINIMUM_HEX) erreurs.push(`Palette du brief : ${couleurs.length} couleur(s) épinglée(s), au moins trois attendues (fond, dominante, touche).`);
  return erreurs;
}

/** Le hex de la cible la plus proche du pixel dans la tolérance (distance RGB euclidienne), sinon null. */
export function classerPixel(r, g, b, cibles, tolerance) {
  let meilleur = null;
  let distance = tolerance;
  for (const cible of cibles) {
    const [cr, cg, cb] = cible.rgb;
    const d = Math.sqrt((r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2);
    if (d <= distance) { distance = d; meilleur = cible.hex; }
  }
  return meilleur;
}

/** Les couleurs épinglées qui manquent à l'image, avec la mesure et le plancher de leur rôle. */
export function verifierParts(couleurs, parts) {
  const rouges = [];
  for (const { hex, role } of couleurs) {
    const seuil = SEUILS_PALETTE[role] ?? SEUILS_PALETTE.presente;
    const part = parts[hex];
    if (part === undefined) { rouges.push(`Palette : ${hex} (${role}) épinglée au brief mais non mesurée sur l'image.`); continue; }
    if (part < seuil) rouges.push(`Palette : ${hex} (${role}) mesurée à ${pourcent(part)} sur l'image, plancher ${pourcent(seuil)} — le brief l'annonce, l'image ne la porte pas.`);
  }
  return rouges;
}

export const hexEnRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
