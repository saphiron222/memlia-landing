import { existsSync } from 'node:fs';

export const CAC_PUBLIE = existsSync(new URL('../src/pages/commissaires-aux-comptes.astro', import.meta.url));
export const DESTINATIONS = ['Tâches', 'Méthode', 'Contrôle humain', 'Questions', ...(CAC_PUBLIE ? ['Expertise comptable', 'Commissaires aux comptes'] : []), 'Ce qu’on automatise', 'Outils gratuits', 'Blog'];
export const HREFS = ['/#usages', '/#methode', '/#preuves', '/#questions', ...(CAC_PUBLIE ? ['/', '/commissaires-aux-comptes'] : []), '/automatisation-cabinet-comptable', '/outils-comptables-gratuits', '/blog'];
