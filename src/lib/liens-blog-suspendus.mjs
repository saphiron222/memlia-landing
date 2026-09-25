import { isSuspendedBlogPath } from '../data/blog-visibility.mjs';

/** Retire les liens entrants au rendu sans modifier le Markdown scellé et ses preuves. */
export default function liensBlogSuspendus() {
  return {
    name: 'liens-blog-suspendus',
    element: {
      filter: ['a', 'p'],
      visit(node, ctx) {
        // La recette de la page service est scellée : retirer au rendu la
        // promesse d'un guide suspendu, plutôt que créer un auto-renvoi trompeur.
        if (node.tagName === 'p') {
          const children = node.children ?? [];
          const index = children.findIndex((child) =>
            child.tagName === 'a' && isSuspendedBlogPath(child.properties?.href)
            && child.children?.some((text) => text.value === 'notre guide sur l’automatisation de la saisie comptable')
          );
          const before = children[index - 1];
          const suffix = ' Le détail des six contrôles est publié dans ';
          if (index > 0 && before?.type === 'text' && before.value.endsWith(suffix)) {
            const after = children[index + 1];
            ctx.replaceNode(node, {
              ...node,
              children: [
                ...children.slice(0, index - 1),
                { ...before, value: before.value.slice(0, -suffix.length) },
                ...(after?.type === 'text' && after.value.startsWith('.')
                  ? [{ ...after, value: after.value.slice(1) }, ...children.slice(index + 2)]
                  : children.slice(index + 1)),
              ],
            });
          }
          return;
        }
        const href = node.properties?.href;
        if (typeof href === 'string' && isSuspendedBlogPath(href)) {
          ctx.setProperty(node, 'href', '/automatisation/saisie-comptable');
        }
      },
    },
  };
}
