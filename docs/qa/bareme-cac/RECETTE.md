# Barème d’heures CAC — construction pour revue métier

Route : `/outils-comptables-gratuits/bareme-heures-cac`. Aucun déploiement de production effectué.

## Règle et décisions à relire

Les cinq extraits exacts, ouverts sur Légifrance à la date réelle du 6 octobre 2026, sont versionnés dans `docs/strategy/site-v3/cac/outils/sources/`. La grille D.821-188 contient huit lignes, jusqu’à 122 millions d’euros. R.821-194 contient bien le 7° associations/fondations : ne pas reprendre le résultat de recherche qui omettait cette ligne.

La somme est réalisée en centimes entiers BigInt, jamais en flottants. Tous les cas 2° à 14° de R.821-194 sont interrogés séparément ; le 1° est calculé. Une réponse inconnue suspend le résultat. Les autres missions, les comptes consolidés et l’audit petite entreprise sont hors couverture de cet outil : ce n’est pas une affirmation d’exclusion juridique générale.

Aux sept bornes communes (305 000 à 45 735 000), le texte officiel juxtapose « jusqu’à » et « de … à … » sans préciser une exclusivité. Choix conservateur : suspension de l’affectation et affichage des deux lignes adjacentes. Les centimes immédiatement avant/après sont évalués ; 122 000 000 exact reste dans la dernière tranche, puisque R.821-194 dit « excède ». Ce choix est explicitement visible ; métier peut demander une autre lecture étayée, aucune convention cachée n’est ajoutée.

D.821-189 augmente les heures du programme saisi, pas les bornes de la grille : taux volontaire, maximum un tiers, fraction exacte sans arrondi dépassant le plafond. Dérogation, accord et situation inconnue suspendent la restitution applicable ; l’outil ne réalise aucune démarche D.821-190. Budget et commentaire saisis sont préservés ; aucune rémunération ni suffisance des diligences déduite.

## Produit local

Saisie scalaire de trois montants : pas de population CSV à mapper ni de traitement de 100 000 lignes. La reprise de dossier est JSON, limitée à 20 Mo avant lecture et à 10 000 caractères par champ après validation ; le format de version est fermé. Aucun CSV d’entrée ni XLSX annoncé. Le CSV exporté comporte BOM et neutralisation des cellules-formules ; le rapport HTML échappe tout texte saisi et contient la fiche outil. Chaque export porte méthode, limites, source, version et date réelle ; le JSON inclut les contrôles et le résultat, recalculé à la reprise plutôt que cru sur parole.

Le remplacement par fichier ou exemple exige le consentement si la session a été modifiée. L’effacement demande confirmation. Un refus conserve les saisies et désactive les exports. Aucun stockage navigateur ni requête après chargement pendant la recette nominale, refus et exports ; CSP `connect-src 'none'` au gabarit et à l’en-tête générique. Route `no-transform` ajoutée pour Cloudflare ; ces en-têtes devront être relus sur le déploiement par la carte de publication.

## Preuves techniques

- Test rouge initial : import du moteur absent, puis sept tests Node verts. Huit bornes exactes et leurs centimes voisins, zéro, base fictive 260 000, exclusions/inconnues, plafond d’alerte, unités/négatifs/ambiguïtés, reprise et exports sécurisés, transcription officielle et scène sans branding.
- Sept tests Playwright : nominal, notes conservées, refus, reprise JSON, CSV/HTML, absence réseau/stockages, puis 320/375/768/1024/1440/1920. Reduced-motion. Défaut découvert et corrigé : l’événement change tardif au blur invalidait un calcul juste avant export ; le test de reprise l’exerce désormais.
- Complément `supplement.json` : focus clavier visible, trois liens entrants contextuels (hub, méthode, garanties), WebPage/WebApplication/BreadcrumbList, reflow 320 CSS px équivalent à 400 % sur 1280, borne commune au navigateur.
- Astro check : zéro erreur, zéro warning, onze hints préexistants.
- Une chaîne complète `npm run build` a déjà rendu exit 0 ; rejeu du candidat de livraison engagé, résultat à transmettre dans le handoff. Les tests Node/proof sont exécutés par cette chaîne.
- Lighthouse final : mobile 99/100/100/100, desktop 100/100/100/100 ; CLS 0, rapports résumés dans `lighthouse-summary.json`. Première mesure mobile 69 pendant charge locale, TBT non attribué ; elle n’est pas présentée comme un résultat vert.
- Image HTML propre : renderer du dépôt, 1600×900, WebP 31 848 octets, OG 1200×630 20 372 octets ; `--check` vert et contenu figé. Aucun visuel d’une autre page réutilisé.

Captures pleine page et hero 375/1440 avec le calculateur historique d’amortissement voisin. Le grand formulaire explique la densité supplémentaire ; sections communes préservées. La première capture prise après clic comportait la nav sticky au milieu : reprise depuis scroll 0, sans modification du chrome. Dernier examen plein écran : aucune superposition.

## Livraison et suite

Fiches F2 et cadrage commun présents dans `docs/strategy/site-v3/cac/outils/`. Contrat de requête promu et architecture régénérée avec état « construite-en-revue ». Pied de page et hub se génèrent depuis OUTILS. Sources compactes, CTA commun conservé.

Une seule revue, par métier (t_bd2b676a), puis publication sur t_855c3fb1 après PASS et CI. Ne pas ouvrir une revue QA supplémentaire. Les fichiers de registre, de données outils et de preuves sont des hotspots communs aux autres cartes CAC ; préserver les ajouts de chaque branche et régénérer les données dérivées après intégration.
