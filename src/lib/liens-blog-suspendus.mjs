import { isSuspendedBlogPath } from '../data/blog-visibility.mjs';

/** Retire les liens entrants au rendu sans modifier le Markdown scellé et ses preuves. */
export default function liensBlogSuspendus() {
  return {
    name: 'liens-blog-suspendus',
    element: {
      filter: ['a'],
      visit(node, ctx) {
        const href = node.properties?.href;
        if (typeof href === 'string' && isSuspendedBlogPath(href)) {
          ctx.setProperty(node, 'href', '/automatisation/saisie-comptable');
        }
      },
    },
  };
}
