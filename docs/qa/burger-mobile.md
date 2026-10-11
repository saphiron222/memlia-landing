# Menu mobile — burger en haut à droite

Demande Kevin du 08/10/2026 : remplacer les rangées de navigation mobile par un burger en haut à droite.

Sous 1024 px, le bandeau contient le logo et un bouton de 48 × 48 px. Le panneau contient toutes les destinations publiées et l’action « Confier une première tâche ». Sans JavaScript, les liens et l’action restent accessibles en clair avec des cibles d’au moins 44 px.

Le panneau se ferme par la croix, Échap ou un lien. Le fond devient inerte pendant son ouverture ; le clavier reste dans le menu et la position de lecture est restaurée à la fermeture. Le passage au bureau libère le fond et rend le focus à une entrée visible.

Validation locale : contrat de page 18/18, témoin du contenu de l’accueil inchangé. Tests de menu 38/38 PASS sur cinq largeurs de 320 à 768 px, trois hauteurs de 360 à 844 px ; parcours, clavier, fragments, CTA, repli sans JavaScript et passage au bureau. Les tests des pages, des outils, du blog et des polices complètent la vérification.

Les sondes utilisent un clic réel sur le burger déjà visible pour mesurer la restauration du scroll et centrent les liens dans le panneau défilant pour éviter l’arrondi du défilement au plus près de Chromium. Les seuils tactiles et les hit-tests restent inchangés.

Captures et journaux locaux dans `.qa/burger-mobile/`. Fusion conditionnée à une revue indépendante PASS et à Repository gates vert ; vérification du menu après publication automatique Cloudflare.
