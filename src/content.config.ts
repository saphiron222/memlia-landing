import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { IMAGES } from './data/images.mjs';
import { IDS_AUTEURS } from './data/auteurs';

/**
 * Collection `blog` — articles Markdown de src/content/blog/*.md.
 * Le gabarit éditorial suit la copy validée : titre-question ou recadrage, réponse
 * directe en tête (`resume`), puis méthode, limites et pont vers le service.
 * Le blog ne porte aucun catalogue : pas de champ produit, des sujets métier bornés.
 */
const IDS_IMAGES = Object.keys(IMAGES) as [string, ...string[]];

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z
    .object({
      titre: z.string().min(10).max(90),
      /** Titre de l'onglet et des résultats de recherche quand `titre | Memlia` dépasse ~65 caractères. */
      titreOnglet: z.string().min(20).max(70).optional(),
      /** Réponse directe, affichée en tête d'article et en extrait de liste (« En bref »). */
      resume: z.string().min(40).max(300),
      /** Balise meta description ; à défaut, `resume` tronqué. */
      description: z.string().min(50).max(160).optional(),
      /* Toute valeur acceptée ici l'est aussi par `lireArticlesPublies()` (src/data/blog.mjs),
         qui date le sitemap avec le même `new Date(...)` : un seul contrat de date. */
      datePublication: z.coerce.date(),
      dateMiseAJour: z.coerce.date().optional(),
      /** Identifiant d'auteur (src/data/auteurs.ts) : jamais un nom libre. */
      auteur: z.enum(IDS_AUTEURS).default('kevin'),
      /** Sujets bornés au métier : pas de tag libre. */
      sujets: z
        .array(z.enum(['paie', 'dsn', 'excel', 'production-sociale', 'methode', 'securite', 'cabinet']))
        .min(1)
        .max(4),
      /** Mots-clés du schéma Article (six au plus, en français). */
      motsCles: z.array(z.string().min(3).max(60)).max(6).default([]),
      /** Un brouillon est construit en local mais jamais publié ni listé. */
      brouillon: z.boolean().default(true),
      /** Image d'en-tête : identifiant du manifeste src/data/images.mjs (srcset et alt maîtrisés). */
      image: z.enum(IDS_IMAGES),
      /** Sources citées, listées en fin d'article et vérifiables : éditeur, titre, URL, consultation. */
      sources: z
        .array(
          z.object({
            editeur: z.string().min(2),
            titre: z.string().min(3),
            url: z.string().regex(/^https:\/\/[^\s"<>]+$/, 'URL https attendue'),
            consulte: z.coerce.date(),
          })
        )
        .min(3),
    })
    .refine((d) => !d.dateMiseAJour || d.dateMiseAJour >= d.datePublication, {
      message: 'dateMiseAJour ne peut pas précéder datePublication',
      path: ['dateMiseAJour'],
    }),
});

export const collections = { blog };
