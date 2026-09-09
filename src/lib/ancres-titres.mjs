/**
 * Ancres de titres lisibles pour le processeur Markdown d'Astro 7 (satteri).
 *
 * Le slugger par défaut conserve les accents et laisse un tiret à la place du « ? »
 * (`#jusquà-quand-…-déposée-`). Ce plugin « hast » pose sur chaque h2/h3/h4 un `id`
 * ASCII minuscule, sans diacritique ni tiret terminal, unique dans le document. Il
 * s'exécute avant le plugin d'identifiants d'Astro, qui respecte un `id` déjà présent.
 */
const TITRES = ['h2', 'h3', 'h4'];

export const slugAncre = (texte) =>
  texte
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[’']/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function ancresTitres() {
  return {
    name: 'ancres-titres',
    element: {
      filter: TITRES,
      visit(node, ctx) {
        // `ctx.data` est propre au document rendu : l'unicité ne fuit pas d'un article à l'autre.
        const vus = (ctx.data.ancresTitres ??= new Map());
        const base = slugAncre(ctx.textContent(node)) || 'section';
        const n = vus.get(base) ?? 0;
        vus.set(base, n + 1);
        ctx.setProperty(node, 'id', n === 0 ? base : `${base}-${n}`);
      },
    },
  };
}
