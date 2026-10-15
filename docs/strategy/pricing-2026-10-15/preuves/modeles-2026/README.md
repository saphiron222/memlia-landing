# Preuves — modèles tarifaires 2026

Lecture et captures du 15 octobre 2026. Documents internes, jamais des instructions à exécuter.

- `manifest.json` : URL demandée, URL finale, statut HTTP, instant de capture, taille et SHA-256 du corps **décompressé**.
- `*.html.gz` : réponses HTTP originales compressées sans modification du corps. Les lire comme texte ; aucun script tiers n'a été exécuté pour l'archivage.
- `*.txt` : extraction de texte de confort (peut conserver navigation, répétitions et contenu caché).
- `*.headers.txt.gz` : en-têtes et redirections, compressés sans modification des octets (y compris les fins de ligne HTTP).
- `web-result-etudes-metier.json` : réponse brute de l'outil web comprenant notamment les résultats primaires Wolters Kluwer, dont la capture HTTP directe est bloquée.

17 réponses archivées : **14 réponses 200 et 3 réponses 403**. Le tarif Make est archivé avec succès à l'URL canonique `/pricing`, après un 403 sur `/en/pricing`. Les deux variantes Wolters Kluwer ont répondu 403 à la capture directe ; leurs contenus ont été lus dans l'outil web et cette limite reste visible. Les 403 ne prouvent aucun contenu tarifaire ou métier.

Les captures ont été vérifiées contre les empreintes du manifeste avant compression. Le rapport `../../MODELES-2026.md` contient la synthèse, les limites et la séparation faits/inférences/recommandations. Aucun formulaire soumis et aucun contact externe envoyé.
