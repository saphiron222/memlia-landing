# Outils simples et repères de défilement — 15 octobre 2026

Demande de Kevin : les repères de FAQ et les panneaux « Dans vos outils » suivent le défilement de leur section. Le hub et les outils gratuits adoptent la simplicité d’Outrank dans la famille visuelle des robots et agents Memlia. Base 3386ac21, même checkout isolé, prévisualisation seulement.

- [ ] Capturer le hub et les 27 outils Outrank ; inventorier les 21 outils Memlia et leurs contrôles.
- [ ] Documenter la sélection mise en avant et les regroupements proposés, sans suppression arbitraire de routes indexables.
- [ ] Corriger les rails collants partagés : desktop, petits écrans, panneaux hauts, limites de section et clavier.
- [ ] Refaire le hub et le gabarit d’outil : accès immédiat, quelques champs, options secondaires, résultat lisible, identité Memlia.
- [ ] Simplifier le ROI et les parcours à forte densité ; conserver les calculs, sources, validations et données en local.
- [ ] Vérifier fonctions, accessibilité, rendu, SEO et sécurité ; documenter et livrer une nouvelle prévisualisation.

## Direction et contrat

Crème/vert, Fraunces/Hanken Grotesk, espaces et cartes du catalogue validé. Hub : titre centré, trio discret de figurines existantes, cartes courtes et action explicite, trois colonnes maximum. Outil : titre court, formulaire avant le contenu documentaire, bouton unique principal, résultat après action. Paramètres spécialisés et explications dans des accordéons natifs. Les états vide, erreur, résultat et modification sont explicites. Aucun résultat n’est présenté comme acquis sans calcul ni comme avis professionnel.

Cibles : 375×812 et 1440×900 ; vérification complémentaire des rails en fenêtre basse et en zoom. Le sticky reste limité à la section ; un panneau trop haut doit rester entièrement parcourable. Pas de suivi animé du scroll. Sans JavaScript : contenu et limites restent lisibles, aucun formulaire ne transmet les données.

Compétences lues : copywriting et page-cro (Codex), frontend-design-direction et make-interfaces-feel-better (Claude), seo-images (Codex). motion-foundations a été consulté : ses prescriptions React ne s’appliquent pas à Astro ; aucun ajout React/motion ni animation de scroll.

## Arbitrage tarifaire demandé en cours de chantier

Kevin demande ensuite d’analyser Outils-EC, Factory 456 et les modèles de prix IA de 2026 avant de figer le ROI. Recherche réalisée avec les skills Claude `pricing`, `offers`, `market-research`, `deep-research` et les équivalents Codex `pricing-strategy` / `competitor-profiling`. Les trois volets concurrents, marché et économie sont terminés ; recommandation et preuves dans [pricing-2026-10-15](../../strategy/pricing-2026-10-15/README.md). Le 7 €/h est un repère Factory de 2025 dont les conditions ne sont pas publiques ; ne pas le publier comme prix Memlia acquis.

État de travail conservé : captures des 27 outils Outrank et du hub réalisées ; nouveau hub, gabarit allégé et rails mesurés implémentés mais pas encore validés visuellement ni livrés. Les 21 routes existantes sont conservées. La grille Memlia reste une proposition interne, sans modification des prix publics, de la charte ni du simulateur livré à ce stade. Le ROI doit séparer valeur du temps, coût de service et frais initiaux ; aucune performance concurrente ne devient une mesure Memlia.

Kevin valide ensuite le modèle tarifaire et demande le chiffrage complet des unités agents avec Mammouth. Le [dossier de coûts et la grille consolidée](../../strategy/pricing-2026-10-15/mammouth/GRILLE-AGENTS.md) fournissent désormais les unités, plafonds et frais de mise en service proposés ; le classeur recalcule trois scénarios. Aucun appel payant n’a été lancé : Kevin confirme le travail sur tarifs publics faute de clé. Les hypothèses de coûts restent distinguées des prix fournisseur observés.

Après lecture, Kevin refuse la complexité de la grille commerciale et précise **1 000 € HT/mois + 300 € HT/mois par pôle**, à adapter au catalogue actuel. La [proposition simplifiée](../../strategy/pricing-2026-10-15/offre-simple/OFFRE.md) remplace la recommandation agents ; l’étude Mammouth reste historique. Le simulateur ne doit pas reprendre les huit unités ni le socle de 99 € comme prix actif. Les enveloppes et suppléments de la nouvelle proposition ne sont pas encore validés ni publiés.
