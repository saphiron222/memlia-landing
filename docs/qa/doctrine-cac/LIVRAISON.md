# B2 — retrait de la fermeture générale du commissariat aux comptes

Le service et le pilier présentent désormais les préparations répétitives CAC : demandes de documents, suivi des réponses, comparaisons entre exercices. Sélection des travaux, appréciation et opinion restent au commissaire aux comptes. Aucun audit autonome, aucune conformité NEP promise.

## Décisions

- Les comptes de l’accueil concernent exclusivement l’expertise comptable et viennent de `famillesDeLaProfession('ec')` ; le nombre de pôles vient des pôles distincts de ces familles. Les familles CAC ne gonflent pas ce compte.
- L’identifiant historique `audit-legal` demeure inactif pour éviter un cluster doublon. Sa description renvoie aux familles CAC effectivement ouvertes ; elle ne dit plus qu’aucun besoin n’est documenté.
- L’article initial du 16/09 est republié par la forge, mise à jour au 06/10. Son tableau conserve un repère transversal CAC, pas une seconde taxonomie.
- La figure d’inventaire faisait partie du défaut : « Non ouvert » est remplacé par la tâche fictive « Demandes de documents », état « À cadrer », orientation « Carte CAC ». Image revue indépendamment avec cinq réponses oui.
- Aucun lien vers un pilier CAC absent. F4/H5 devra poser le lien lors de sa publication ; cette condition ne retarde pas le retrait de la fermeture actuelle.
- Les journaux, sauvegardes et anciennes revues qui décrivent un état daté ne sont pas réécrits. Le `git grep` intégral conserve donc des mentions historiques ; la vérification de non-régression porte sur les surfaces publiques et leurs sources courantes. La clause de charte est dans B1, pas reprise ici.
- Hotspots : `public/llms.txt`, `src/data/familles.ts`, recette du pilier et manifeste des figures. Préserver les liens d’H4 et ne pas modifier les 25 familles CAC.

## Vérification effectuée avant livraison

- Revue indépendante unique : `REVUE.md`, PASS métier et figure. Six claims inchangés soutenus par leurs copies archivées.
- `blog-forge sceller` : PASS. Premier refus sur une base origin/main avancée ; intégration non destructive de PR126 puis succès, sans retirer le garde.
- `blog-forge publier` : succès, statut publié et sceau émis. Aucune édition manuelle du Markdown matérialisé ni du sceau.
- `npm run lastmod:sync`, scellement Ressources, réaffirmation : succès. Seules les pages accueil et service prennent une nouvelle date.
- `npm run build` : succès ; 149 tests Python, 715 tests Node de scripts dont 707 PASS et 8 SKIP, audit Ressources PASS.
- Playwright `site-copy-b` sur le dist construit : 13 tests PASS, six largeurs 320/375/768/1024/1440/1920 et glossaire sans JavaScript. Un lancement via webServer reconstruisait tout et a dépassé la durée du tool ; reprise sur un serveur local dédié, réponse HTTP vérifiée, avec `QA_URL`, sans retirer de contrôle.

La CI et la preuve publique sont à consigner après livraison ; ce document ne les déclare pas réalisées par avance.
