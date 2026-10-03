/** Le gabarit émet le H1 depuis title : seule l'enveloppe source identique est retirée. */
export function corpsSansTitreDuplique(corps, title) {
  const entete = /^# ([^\n]+)\r?\n(?:\r?\n)?/u.exec(corps);
  if (!entete) return corps;
  if (entete[1] !== title) throw new Error(`H1 divergent du titre de recette : ${entete[1]}`);
  return corps.slice(entete[0].length);
}
