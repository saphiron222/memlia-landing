# Ajustement des étapes — 15 octobre 2026

Demande de Kevin après la prévisualisation `a9bf1faf` : petites cartes comme dans la capture Outils-EC, retrait du paragraphe de Méthode sur les appels de facture électronique et retrait de la légende des figurines sur À propos.

## Réalisation

Cinq cartes HTML numérotées, trois puis deux centrées sur ordinateur, deux colonnes sur tablette, une sur téléphone. Palette Memlia, fond vert continu, Fraunces et Hanken. Un paragraphe court par étape, sans répétition de « Ce que nous vous remettons ». Ancres `etapes`, `observer`, `cadrer`, `eprouver`, `valider`, `maintenir` et `etapes-titre` conservées. Aucun effet interactif sur ces cartes de lecture.

Le paragraphe demandé est supprimé sans déplacement. La scène À propos garde son image A et son texte alternatif, sans légende ni espace réservé. Les autres légendes et les blocs verts précédemment corrigés restent inchangés.

## Vérification de ce candidat

- Régénération Astro et ressources : PASS, 108 pages. Types : aucune erreur ni avertissement, 40 indications existantes.
- 11 tests Node ciblés PASS : scènes, liens et ancres, métadonnées, contact et témoin de contenu de l’accueil.
- 11 scénarios navigateur PASS : six pages à 375/768/1440, surface verte identique au hub, cinq cartes de même largeur, paire finale centrée, absence de débordement, ancres directes, sans JavaScript, retrait des deux textes, alt conservé et lien de Garanties conservé.
- Inspection réelle dans le navigateur intégré à 1440 et 375 px : texte lisible, cinq étapes en ordre, vert continu, pas de moitié droite laissée vide. Captures complémentaires à 768 px.
- Lighthouse Méthode mobile : 100/100/100/100. Rapport `mobile-2026-10-15T12-30-03-591Z.json`.
- Markdown : 100 pages et `llms-full.txt` générés et vérifiés. Preview préparée avec noindex/nofollow et canonical de production.

Preuves : `/Users/kevinkitanga/dev/interne/memlia-landing-sources/coherence-figurines/2026-10-15/qa/etapes-cartes/`.

## Validateur global conservé

La forge de services conserve ses 24 erreurs historiques d’intention des titres. Elle relève également la déclaration historique du lien entrant depuis Méthode vers `facture-electronique`, désormais retiré explicitement par Kevin. Le test de préservation des six pages reconnaît ce seul retrait, mais la recette scellée du service et le validateur global ne sont pas modifiés pour masquer l’écart. Le service reste accessible depuis Garanties et depuis les fiches de robots liées à la facturation électronique. Aucun blocage pour cette prévisualisation ; la publication de production reste hors de ce chantier.

## Livraison

Lien de la nouvelle prévisualisation et vérification distante consignés après déploiement. Aucun déploiement de production, aucune fusion.
