/** Recette A choisie par Kevin le 15 octobre 2026. Une scène propre par page. */
export const SCENES = {
 accueil:{route:'/',alt:'Un robot abricot et un agent sauge préparent plusieurs dossiers, avec une pièce mise à part.',legende:'Des dossiers préparés selon vos règles. Les exceptions restent à votre équipe.'},
 cac:{route:'/commissaires-aux-comptes',alt:'Une figurine d’audit sable, un dossier ouvert, une loupe et une pièce séparée pour la revue.',legende:'La mécanique du dossier se prépare. Le choix des travaux et les conclusions restent au CAC.'},
 methode:{route:'/methode',alt:'Un robot et un agent autour d’un registre ouvert, de pièces classées et d’une exception séparée.',legende:'Une règle qui se relit, un résultat qui se vérifie, une exception qui se voit.'},
 apropos:{route:'/a-propos',alt:'Deux figurines Memlia autour d’un carnet de travail et de pièces à éprouver.',legende:'Nos figurines représentent les tâches que nous construisons et maintenons avec vous.'},
 garanties:{route:'/garanties',alt:'Un robot devant des pièces classées, une clé d’accès et une pièce qui attend une décision.',legende:'Les accès sont définis. Le cas hors règle reste visible et attend votre décision.'},
 contact:{route:'/contact',alt:'Un robot et un agent autour d’un dossier ouvert pour définir une première tâche.',legende:'Un robot, un agent IA ou une tâche sur mesure : commençons par le travail à prendre en charge.'},
} as const;
export type SceneId = keyof typeof SCENES;
export const sceneSociale = (id:SceneId) => ({url:`https://memlia.fr/illustrations/figurines/${id}-1200.webp`,width:1200,height:800,alt:SCENES[id].alt});
