/// <reference types="astro/client" />
// E4 apporte la route : son prochain build active tous les liens, sans lien 404 préalable.
export const cacDisponible = Object.keys(import.meta.glob('/src/pages/commissaires-aux-comptes.astro')).length > 0;
