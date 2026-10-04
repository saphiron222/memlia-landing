/**
 * Ce que la page dit quand la fonction de contact refuse : un libellé par code renvoyé par
 * functions/api/contact.js. Partagé par l'envoi en place (contact.astro) et par la page de
 * réponse sans JavaScript (contact/erreur.astro), pour que les deux régimes disent la même chose.
 */
export const MESSAGES_CONTACT = Object.freeze({
  nom: 'Indiquez votre nom (au moins deux caractères).',
  courriel: 'L’adresse de courriel ne semble pas valide.',
  message: 'Décrivez la tâche en quelques phrases (vingt caractères au moins).',
  consentement: 'Cochez la case pour que nous puissions vous répondre.',
  'trop-de-messages': 'Plusieurs messages viennent de partir depuis cette connexion. Réessayez dans une heure, ou écrivez-nous par courriel.',
  'trop-long': 'Le message dépasse la taille acceptée. Raccourcissez-le, ou écrivez-nous par courriel.',
  verification: 'La vérification anti-abus a échoué ou expiré. Recommencez-la avant l’envoi, ou écrivez-nous par courriel.',
  illisible: 'Le navigateur a envoyé un formulaire que nous ne savons pas lire. Rechargez la page et réessayez.',
  indisponible: 'Le formulaire est indisponible pour le moment. Écrivez-nous par courriel.',
});

export const MESSAGE_CONTACT_DEFAUT = 'Le message n’a pas pu partir. Réessayez, ou écrivez-nous par courriel.';
