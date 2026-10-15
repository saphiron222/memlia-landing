import { existsSync } from 'node:fs';

export const CAC_PUBLIE = existsSync(new URL('../src/pages/commissaires-aux-comptes.astro', import.meta.url));
export const DESTINATIONS = [...(CAC_PUBLIE ? ['Expertise comptable', 'Commissaires aux comptes'] : []), 'Robots comptables', 'Outils gratuits', 'Blog'];
export const HREFS = [...(CAC_PUBLIE ? ['/', '/commissaires-aux-comptes'] : []), '/automatisation-cabinet-comptable', '/outils-comptables-gratuits', '/blog'];
