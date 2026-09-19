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
 * La tolérance de la mesure des pixels, et donc le pouvoir de séparation de l'instrument.
 * Calibrée le 19/09/2026 sur les six couvertures livrées : elle doit rester SOUS la plus petite
 * distance entre deux couleurs de la marque, sinon l'instrument ne sait pas les distinguer. Les
 * deux verts Memlia sont distants de 50,4 : à 60 ils se confondaient, à 45 ils se séparent, et
 * une matière mate reste comptée (verts de 0,2 à 6,2 %, crème de 17 à 80 % selon la couverture).
 */
export const TOLERANCE_MESURE = 45;
export const distanceRgb = ([r, g, b], [r2, g2, b2]) => Math.sqrt((r - r2) ** 2 + (g - g2) ** 2 + (b - b2) ** 2);

/**
 * Planchers calibrés sur les six couvertures livrées, mesurées AVANT de s'y fier (tolérance 45) :
 * le fond crème occupe 17 à 80 % de l'image, les verts de la marque 0,2 à 6,2 %, le graphite 0 à
 * 6,1 %. Dans cette direction artistique, c'est le fond qui domine et la couleur de marque qui
 * accentue : un brief qui annonce le vert « dominant » décrit une image qui n'existe pas.
 * Retenu : une dominante couvre au moins 10 % de l'image, une touche au moins 0,5 %.
 */
export const SEUILS_PALETTE = Object.freeze({ dominante: 0.1, touche: 0.005, presente: 0.005 });

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
  // Deux couleurs plus proches que la tolérance de mesure ne se partagent pas : le classement au
  // plus proche leur attribue les mêmes pixels de façon arbitraire, et l'une des deux échoue son
  // plancher sans que l'image soit en cause. Mesuré le 19/09/2026 sur deux couvertures livrées.
  for (let i = 0; i < couleurs.length; i += 1) {
    for (let j = i + 1; j < couleurs.length; j += 1) {
      const d = distanceRgb(hexEnRgb(couleurs[i].hex), hexEnRgb(couleurs[j].hex));
      if (d < TOLERANCE_MESURE) erreurs.push(`Palette du brief : ${couleurs[i].hex} et ${couleurs[j].hex} sont distantes de ${d.toFixed(1)}, sous la tolérance de mesure (${TOLERANCE_MESURE}) — indiscernables, n'en épingler qu'une.`);
    }
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
