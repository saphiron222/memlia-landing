import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { IMAGES } from './data/images.mjs';
import { IDS_AUTEURS } from './data/auteurs';
import { IDS_FAMILLES } from './data/familles';

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
        .array(z.enum(['paie', 'dsn', 'excel', 'production-sociale', 'methode', 'securite', 'cabinet', 'automatisation', 'pieces', 'saisie', 'lettrage', 'revision', 'fiscal', 'facturation', 'courriels', 'ia', 'donnees', 'juridique', 'pilotage']))
        .min(1)
        .max(4),
      /** Mots-clés du schéma Article (six au plus, en français). */
      motsCles: z.array(z.string().min(3).max(60)).max(6).default([]),
      /** Un brouillon est construit en local mais jamais publié ni listé. */
      brouillon: z.boolean().default(true),
      /** Image d'en-tête : identifiant du manifeste src/data/images.mjs (srcset et alt maîtrisés). */
      image: z.enum(IDS_IMAGES),
      /** Contrat enrichi des candidats créés par le pipeline éditorial. Les articles historiques restent inchangés. */
      pipelineVersion: z.literal(1).optional(),
      primaryQuery: z.string().min(3).optional(),
      secondaryQueries: z.array(z.string().min(3)).default([]),
      intent: z.enum(['comprendre', 'executer', 'diagnostiquer', 'comparer-approches', 'evaluer-service', 'reduire-risque', 'decider']).optional(),
      fanOut: z.array(z.string().min(3)).default([]),
      cluster: z.enum(['production-comptable', 'portefeuille-echeances', 'paie-social', 'juridique-fiscal', 'audit-cac', 'administratif-secretariat', 'facturation-recouvrement', 'rh-formation', 'excel-outils-existants', 'numerique-it-data', 'methode-decision-humaine', 'conseil-missions']).optional(),
      /** Famille de tâches (src/data/familles.ts) : la maille éditoriale de la v3, plus fine que le cluster. */
      famille: z.enum(IDS_FAMILLES).optional(),
      rolePrincipal: z.enum(['direction-associes', 'chefs-mission-portefeuille', 'collaborateurs-comptables', 'assistants-comptables', 'paie-responsables-sociaux', 'juridique-fiscal', 'audit-cac', 'administratif-secretariat', 'facturation-recouvrement', 'rh-recrutement-formation', 'numerique-it-data', 'profils-formation', 'autre-role-documente']).optional(),
      rolesSecondaires: z.array(z.enum(['direction-associes', 'chefs-mission-portefeuille', 'collaborateurs-comptables', 'assistants-comptables', 'paie-responsables-sociaux', 'juridique-fiscal', 'audit-cac', 'administratif-secretariat', 'facturation-recouvrement', 'rh-recrutement-formation', 'numerique-it-data', 'profils-formation', 'autre-role-documente'])).default([]),
      tache: z.string().min(10).optional(),
      preuveRole: z.object({
        niveau: z.enum(['observe', 'indirect', 'hypothese', 'absent']),
        source: z.string().min(3),
        date: z.coerce.date(),
      }).optional(),
      funnel: z.enum(['TOFU', 'MOFU', 'BOFU']).optional(),
      contentType: z.enum(['searchable', 'shareable', 'experimental']).optional(),
      format: z.enum(['how-to-guide', 'faq-knowledge', 'tutorial', 'pillar-page', 'thought-leadership', 'listicle-checklist', 'case-study', 'data-research', 'resource-template']).optional(),
      rankability: z.enum(['forte', 'plausible', 'faible', 'bloquante']).optional(),
      businessRelevance: z.enum(['directe', 'adjacente', 'faible', 'hors-perimetre']).optional(),
      proofStatus: z.enum(['requise', 'a-produire', 'verifiee', 'non-applicable']).optional(),
      proofRequired: z.string().min(10).optional(),
      reviewRule: z.string().min(10).optional(),
      reviewer: z.string().min(2).optional(),
      sourcesVerifieesLe: z.coerce.date().optional(),
      cta: z.object({ label: z.string().min(2), destination: z.string().min(1), outcome: z.string().min(5) }).optional(),
      imageOg: z.string().regex(/^\/images\/[a-z0-9-]+\.(?:avif|webp)$/).optional(),
      imageAlt: z.string().min(10).max(125).optional(),
      statutEditorial: z.enum(['a-preparer', 'a-valider', 'bloque', 'pret-preview', 'go-production', 'publie', 'publie-non-atteste', 'a-maintenir', 'archive']).optional(),
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
        .default([]),
    })
    .superRefine((data, context) => {
      if (!data.brouillon && data.sources.length < 3) {
        context.addIssue({ code: 'custom', message: 'Un article publié exige au moins trois sources.', path: ['sources'] });
      }
      if (!data.pipelineVersion) return;
      const required = ['primaryQuery', 'intent', 'cluster', 'rolePrincipal', 'tache', 'preuveRole', 'funnel', 'contentType', 'format', 'rankability', 'businessRelevance', 'proofStatus', 'proofRequired', 'reviewRule', 'reviewer', 'sourcesVerifieesLe', 'cta', 'imageOg', 'imageAlt', 'statutEditorial'] as const;
      for (const field of required) {
        if (data[field] === undefined) context.addIssue({ code: 'custom', message: `${field} est requis pour pipelineVersion: 1.`, path: [field] });
      }
      if (data.fanOut.length === 0) context.addIssue({ code: 'custom', message: 'fanOut exige au moins une sous-intention pour pipelineVersion: 1.', path: ['fanOut'] });
    })
    .refine((d) => !d.dateMiseAJour || d.dateMiseAJour >= d.datePublication, {
      message: 'dateMiseAJour ne peut pas précéder datePublication',
      path: ['dateMiseAJour'],
    }),
});

/** Pages de service produites par la forge commerciale, distinctes de la collection blog. */
const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string().min(10).max(90),
    tabTitle: z.string().min(10).max(70),
    ogTitle: z.string().min(10).max(90),
    description: z.string().min(50).max(160),
    hero: z.string().refine((value) => {
      const words = value.trim().split(/\s+/).filter(Boolean).length;
      return words >= 40 && words <= 80;
    }, 'La réponse commerciale du héros doit contenir 40 à 80 mots.'),
    primaryQuery: z.string().min(3),
    secondaryQueries: z.array(z.string().min(3)).default([]),
    audience: z.discriminatedUnion('mode', [
      z.object({
        mode: z.literal('qualified'),
        qualifier: z.string().min(3),
        reason: z.string().min(40),
      }),
      z.object({
        mode: z.literal('exception'),
        qualifier: z.null(),
        reason: z.string().min(80),
      }),
    ]),
    intent: z.literal('evaluer-service'),
    family: z.string().min(3),
    verifiedAt: z.coerce.date(),
    status: z.enum(['a-valider', 'pret-preview', 'publie']),
    candidateFingerprint: z.string().regex(/^[a-f0-9]{64}$/),
    cta: z.object({
      label: z.literal('Confier une première tâche'),
      destination: z.literal('/contact'),
    }),
    schemaTypes: z.array(z.enum(['WebPage', 'Service', 'BreadcrumbList', 'Organization', 'WebSite'])).length(5),
    headline: z.string().min(10).max(90),
    proof: z.object({ replayedAt: z.coerce.date(), evidencePath: z.string().regex(/^preuves\/[a-z0-9-]+\.json$/) }),
  }).superRefine((data, context) => {
    if (data.title !== data.ogTitle || data.title !== data.headline) {
      context.addIssue({ code: 'custom', message: 'H1, og:title et headline doivent être identiques.', path: ['ogTitle'] });
    }
    if (new Set(data.schemaTypes).size !== 5) {
      context.addIssue({ code: 'custom', message: 'Les cinq types de schéma doivent être présents une fois chacun.', path: ['schemaTypes'] });
    }
  }),
});

export const collections = { blog, services };
