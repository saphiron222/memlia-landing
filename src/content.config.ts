import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * Collection `blog` — prête pour les premiers articles (src/content/blog/*.md).
 * Le gabarit éditorial suit la copy validée : titre-question ou recadrage, réponse
 * directe en tête (`resume`), puis méthode, limites et pont vers le produit.
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z
    .object({
      titre: z.string().min(10).max(90),
      /** Réponse directe, affichée en tête d'article et en extrait de liste (TL;DR). */
      resume: z.string().min(40).max(300),
      /** Balise meta description ; à défaut, `resume` tronqué. */
      description: z.string().max(160).optional(),
      datePublication: z.coerce.date(),
      dateMiseAJour: z.coerce.date().optional(),
      auteur: z.string().default('Memlia'),
      /** Sujets bornés au métier : pas de tag libre. */
      sujets: z
        .array(z.enum(['paie', 'dsn', 'excel', 'supervision', 'methode', 'securite', 'cabinet']))
        .min(1)
        .max(4),
      /** Module concerné, s'il y en a un (identifiant de src/data/modules.ts). */
      module: z.enum(['suivi-social', 'supervision-sociale', 'flux-compta', 'synthese-salaires', 'bulletins-dsn', 'conseil-fiscal', 'memlia-desk']).optional(),
      /** Un brouillon est construit en local mais jamais publié ni listé. */
      brouillon: z.boolean().default(true),
      /** Image d'en-tête : aucune génération par article au lancement (spec 7 bis). */
      image: z
        .object({ src: z.string().min(1), alt: z.string().min(1), largeur: z.number().int().positive(), hauteur: z.number().int().positive() })
        .optional(),
    })
    .refine((d) => !d.dateMiseAJour || d.dateMiseAJour >= d.datePublication, {
      message: 'dateMiseAJour ne peut pas précéder datePublication',
      path: ['dateMiseAJour'],
    }),
});

export const collections = { blog };
