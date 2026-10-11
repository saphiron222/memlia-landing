# Preuve fonctionnelle : relance de facture

La scène doit être générée depuis `demoInvoices()` et `prepareReminders()` du moteur de la page, jamais depuis une réponse synthétique. Le rejeu sélectionne une facture de 90 EUR de solde, une facture soldée et un litige ; la date est une entrée fictive fixée au 2026-10-06.

Recette : `node scripts/render-relance-facture-proof.mjs --adopt`, contrôle visuel, puis `node scripts/render-relance-facture-proof.mjs --check`.

Le renderer canonique `render-proofs-v2.mjs` contrôle dimensions, polices, texte masqué/tronqué, poids et empreintes. Sources : `index.html`, `styles.css`, `content-contract.json`, `replay.json` ; actifs dédiés `44-outil-relance-facture.webp` et `og/44-outil-relance-facture.webp`. Les données et messages sont fictifs. La proposition se valide avant envoi ; l’outil n’envoie rien et n’ajoute aucune règle juridique.
