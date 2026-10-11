# Corrections R1–R3 — seuil de signification

Re-revue ciblée de PR139, sans fusion ni publication.

- R1 : `hasContent` protège les métadonnées seules, les scénarios, le formulaire modifié et l’import préparé avant démonstration, remplacement JSON, effacement et fermeture. Refuser une reprise conserve aussi les liens de téléchargement déjà produits. Neuf parcours couvrent chacun des trois champs seuls et chacun des trois remplacements (refus puis accord), avec vérification de la garde de fermeture.
- R2 : le Worker reste résident après annulation. Chaque requête et réponse porte un identifiant de traitement ; une réponse annulée ne peut pas alimenter le traitement suivant. L’annulation est logique : les calculs synchrones déjà commencés peuvent finir dans le Worker, sans application de leur résultat. Aucun nouveau Worker, aucune modification de CSP, aucune requête après chargement. Un parcours réel de 100 000 lignes annule, reprend un JSON puis le réexporte exactement ; l’oracle écoute BrowserContext (Worker inclus), sans exception GET, et contrôle tous les stockages.
- R3 : le scénario global des outils réalise le mapping CSV des dix champs, l’import validé, le choix explicite, l’export JSON, l’effacement confirmé, la reprise et le réexport comparé. Il garde le refus des outils sans scénario et ses assertions réseau/stockage. Ses requêtes sont désormais observées au niveau BrowserContext.

Tests rouges observés avant correction : aucune confirmation sur missionRef seul ; rechargement GET du Worker après annulation ; scénario global absent. Après correction : 61 parcours navigateur PASS, dont les neuf cas metadata-only, annulation/reprise/export, six largeurs, tous les parcours outils et prompt-qa-reprise.

La base main a été intégrée pour respecter la garde du plan éditorial. Les conflits ne portaient que sur les registres générés : version main conservée puis reconstruction et réaffirmation des revues existantes. Moteur, arrondis, sources et scène sont inchangés.
