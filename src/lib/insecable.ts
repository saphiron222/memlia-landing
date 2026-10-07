/**
 * Système de page, § 2 : dans un titre, un mot composé ne se coupe pas à son trait d'union
 * (« savoir-/faire », « refont-/ils »). Le texte reste identique, caractère pour caractère :
 * seuls les mots composés sont repérés pour être rendus d'un seul tenant.
 */
export interface Segment {
  texte: string;
  insecable: boolean;
}

const MOT_COMPOSE = /[\p{L}\p{N}’']+(?:-[\p{L}\p{N}’']+)+/gu;

export function segmentsInsecables(texte: string): Segment[] {
  const segments: Segment[] = [];
  let curseur = 0;
  for (const trouve of texte.matchAll(MOT_COMPOSE)) {
    const debut = trouve.index ?? 0;
    if (debut > curseur) segments.push({ texte: texte.slice(curseur, debut), insecable: false });
    segments.push({ texte: trouve[0], insecable: true });
    curseur = debut + trouve[0].length;
  }
  if (curseur < texte.length) segments.push({ texte: texte.slice(curseur), insecable: false });
  return segments;
}
