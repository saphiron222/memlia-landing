# Pilier commercial EC — passe de copy du 08/10/2026

Carte : t_8a32eafa. Route : /automatisation-cabinet-comptable.
Base : origin/main, 8c9eb848. Charte : v5.

## Décision et périmètre

H1, titre, description, chapeau, gabarit, neuf sections, preuves et destinations de liens conservés. H1/H4 et pilier du blog/H5 restent hors de cette passe. L’audit H1 classe la copy « Conserver » : nous renforçons les explications de l’offre, sans reconstruire la page. B2 est terminée : PR129 fusionnée et production relue dans sa carte. La frontière CAC existante est conservée ; les missions d’un cabinet mixte sont cadrées séparément.

La page déroule maintenant le geste → la règle relisible → les livrables → la vérification par l’équipe → la maintenance et le prix. Elle précise que les fonctions déjà utilisées dans le logiciel restent en place et que nous prenons les gestes restants. Aucun éditeur, fonction particulière ni compatibilité livrée n’est revendiqué dans ce nouveau passage. Les guides ne prouvent pas une compatibilité avec toutes les versions.

Les questions déjà présentes en H2 sont conservées (décision, qualification, livraison, changement d’outil). Aucune nouvelle FAQ générique ne rallonge la page ; aucun schéma FAQ n’est ajouté artificiellement.

## Sources sensibles ouvertes le 08/10/2026

### Données nécessaires et accès

CNIL, RGPD, chapitre II, article 5 :
https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2

Extrait exact : « adéquates, pertinentes et limitées à ce qui est nécessaire au regard des finalités pour lesquelles elles sont traitées ».

Extrait exact : « traitées de façon à garantir une sécurité appropriée des données à caractère personnel, y compris la protection contre le traitement non autorisé ou illicite et contre la perte, la destruction ou les dégâts d'origine accidentelle ».

La copy décrit un engagement de cadrage : données nécessaires, personnes autorisées, lieu du traitement, essais fictifs avant accès aux dossiers. Elle ne déduit de la source ni conformité générale Memlia, ni traitement exclusivement local, ni certification. Aucun lieu d’hébergement ou destinataire universel n’est inventé.

### Frontière du commissariat aux comptes

H2A, NEP 200, paragraphes 01, 06 et 07 :
https://h2a-france.org/normes/audit-des-comptes-mis-en-oeuvre-dans-le-cadre-de-la-certification-des-comptes/

Extrait exact (§01) : « Pour répondre à ces obligations légales, le commissaire aux comptes formule une opinion sur les comptes annuels et, le cas échéant, une opinion sur les comptes consolidés, après avoir mis en œuvre un audit des comptes. »

Extrait exact (§06) : « A ce titre, le commissaire aux comptes évalue de façon critique la validité des éléments collectés au cours de ses travaux, et reste attentif aux informations qui contredisent ou remettent en cause la fiabilité des éléments obtenus. »

Extrait exact (§07) : « Par ailleurs, tout au long de ses travaux, le commissaire aux comptes exerce son jugement professionnel, notamment pour décider de la nature, du calendrier et de l’étendue des procédures d’audit à mettre en œuvre, et pour conclure à partir des éléments collectés. »

La source étaye la frontière conservée : sélection des travaux, appréciation et opinion au CAC. La séparation des accès par mission est notre engagement de cadrage ; elle n’atteste pas l’indépendance du cabinet. Aucun jugement de conformité aux NEP n’est présenté. Les deux références publiques sont compactes ; les dates d’ouverture restent internes.

## Contrôles exécutés

- npm ci : PASS.
- npm run regen:generated : PASS, puis rejoué après les deux reformulations finales.
- npm run build : PASS, puis rejoué après les deux reformulations finales. Premier run : 150 tests Python ; suite scripts 813 PASS, 8 SKIP, aucun FAIL. Les autres portes de construction passent également.
- test_positioning.py ciblé : 8 PASS.
- Navigateur : copy-pilier-ec (6 largeurs : 320, 375, 768, 1024, 1440, 1920) et positioning (3 parcours) : 9 PASS sur le candidat final. CTA /contact, six liens de services, canonical, H1, frontière CAC/données et absence de débordement vérifiés.
- Comparaison source avec la base : neuf sections, six ProofRow, neuf ancres H2 et dix-neuf destinations éditoriales dans le même ordre.
- git diff --check : PASS.
- Captures pleines pages 375 et 1440 : mode réduit des animations du site, polices prêtes et images chargées. La première tentative avait capturé des apparitions inachevées ; la seconde méthode utilise le mode réduit canonique, sans changer le CSS du site. Un blocage de décodage des images différées a été corrigé dans le test par chargement eager des images pour la seule capture.

## Base et suivi

Lecture HTTP réelle de la production avant modification : HTTP 200, copie sauvegardée dans baseline-production.html de la carte. Aucun trafic, taux de conversion ou gain n’est disponible dans cette livraison. Le rang qualitatif 6/11 reste une hypothèse, pas une mesure. Les clics de test locaux ne sont pas des demandes.

Après la revue métier PASS : intégrer la même PR, vérifier les nouveaux passages et les destinations sur la production avec Cache-Control: no-cache. Consigner la date effective. Suivis J+7 et J+28 à dater à partir de cette publication, avec comparaison des impressions/clics Search Console et demandes qualifiées réellement attribuables ; si ces données restent indisponibles, le dire. Ne pas conclure à un gain à partir d’une seule capture ou d’un clic.

## État de livraison

Implémentation et vérifications locales terminées. Revue métier unique à demander sur cette carte. CI distante, fusion et publication non revendiquées à ce stade. Une intégration dev pourra reprendre le verdict acquis et les fichiers générés, sans seconde revue du fond.
