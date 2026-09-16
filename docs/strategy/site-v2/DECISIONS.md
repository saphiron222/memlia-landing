# Décisions site v2 — 15 septembre 2026

Décisions de t_630c4a13. Ce registre est la copie transportable des arbitrages de la carte, pas un gate Kevin. Aucun site n’est publié par cette phase. Contexte canonique : ../../../.agents/product-marketing.md.

| ID | Décision | Raison et option fermée |
|---|---|---|
| D01 | Service d’automatisation du travail répétitif, résultat cadré et recette humaine | Ferme le catalogue de modules, le SaaS au siège et le positionnement « Excel seulement ». |
| D02 | Cinq nouvelles pages maintenant : service, méthode, garanties, à-propos, contact | Répondre au choix, au déroulement, aux objections, à l’identité et à l’action ; pas gonfler artificiellement le sitemap. |
| D03 | / cible la catégorie et la marque ; /automatisation-cabinet-comptable cible le service sur mesure et le cadrage | Éviter deux landing pages clones. L’accueil oriente, le service détaille livrables/limites/devis. |
| D04 | Blog = méthodes expliquées ; Ressources = orientation tâche/format ; conserver /blog et ses articles | Ne pas migrer le SEO ni recréer les hubs du chantier Ressources. /glossaire appartient à cette même chaîne. |
| D05 | Header : Automatisation, Méthode, Garanties, Ressources, Blog, Parlons de votre tâche | Six entrées dont CTA ; logo vers /. Mobile : liste visible sans ouverture, deux colonnes + CTA pleine largeur, pas hamburger obligatoire. |
| D06 | /a-propos contient le profil fondateur et l’identité auteur Kevin Kitanga | Pas de page /auteurs mince ni de qualification comptable inventée. |
| D07 | /contact expose attentes + rendez-vous + email existants, sans formulaire ni dépôt de fichier | Conversion compréhensible et minimisation des données ; pas de backend supplémentaire. |
| D08 | Preuves sur /methode et page service, pas de /cas-clients ou /demonstrations pour l’instant | Les illustrations existantes sont fictives ; elles ne prouvent ni ROI ni module livré. |
| D09 | Pas de pages /solutions/paie et /solutions/production-sociale maintenant | Deux articles répondent déjà aux intentions ; ouvrir une page commerciale seulement avec preuve distincte et besoin d’achat démontré. |
| D10 | Séquence code après release Ressources t_4cd25435 ; un seul propriétaire Nav/Footer/Base/site.mjs | Aucun conflit de chaînes ; le plan et la copy peuvent avancer avant. |
| D11 | Service + Organization + WebSite, types spécifiques selon contenu | Ne pas réintroduire SoftwareApplication pour décrire le service ; FAQ existante conservée sans promesse de rich result. |
| D12 | Pages HTML statiques, canonical sans slash sauf / ; ancres historiques conservées | Aucun déplacement d’URL existante et aucun redirect large vers l’accueil. |
| D13 | Benchmark de cinq sites officiels actuel ; SERP actuelle ND | Google CAPTCHA, Bing RSS hors sujet et backend de recherche indisponible : exclure les résultats invalides, ne pas escalader le budget. |
| D14 | SEO niveau international = clarté et qualité, pas traduction automatique | Site français, pas de /en, hreflang ou pages-villes sans clientèle et contenu distincts. |
| D15 | Seuil Lighthouse 95 par axe reste un objectif de recette, pas un état atteint | Accueil mesuré 87/92 en performance ; 100 SEO ne prouve pas le classement ni la conversion. |

## Maintenant / ensuite / refusé
Maintenant : les cinq nouvelles pages, liens contextuels des deux articles, nouveau chapeau Blog, navigation/footer cohérents, composants et SEO transversaux. Intégration de Ressources seulement après sa release, sans retoucher ses preuves métier.

Ensuite : un article sur la lecture des comptes rendus métier DSN si la recherche fraîche confirme son périmètre et si le lot Ressources ne le couvre pas déjà. Les namespaces guides et modèles restent conditionnels, détenus par le chantier Ressources ; aucun endpoint vide à créer. Une étude de cas seulement avec autorisation, mesures et source de preuve ; pas de slug réservé maintenant.

Refusé : catalogue de fonctionnalités, pages par intégration sans recette, tarifs fictifs, comparatifs « meilleur » non testés, FAQ dupliquée en page SEO, pages-villes, nouveaux glossaires doublons, croissance par contenu générique, nouveaux crons.

## Recouvrement assumé avec le corpus publié

Le contrôle de recouvrement rend un seul cas : le Glossaire définit « production sociale » et l'article
`/blog/suivre-la-production-sociale-dans-excel` traite du même sujet. **Décision : enrichir l'existant, ne rien
créer.** Les deux surfaces répondent à des questions différentes — le Glossaire dit ce que le terme désigne,
l'article dit comment tenir le suivi — et elles se renvoient l'une à l'autre. Aucune page du plan ne reprend
ce sujet.

Les deux routes `/ressources` et `/glossaire` appartiennent à la chaîne Ressources, publiée le 16 septembre.
Le plan les reprend telles quelles depuis le manifeste et ne redéfinit ni leur titre ni leur résumé.

## Ce qui ferait revoir le choix
- GSC memlia.fr montre une intention distincte avec impressions et clics : réexaminer la page cible, sans prendre les null pour zéro.
- Une page service reproduit l’accueil sans livrable/critère propre : fusionner avant publication.
- Une future étude possède une preuve client autorisée : ouvrir sa propre page, sans réutiliser le fictif comme témoignage.
- La release Ressources expose d’autres URL : conserver ses routes exactes, mettre à jour la matrice de liens avant de coder ; ne pas renommer sa taxonomie.
