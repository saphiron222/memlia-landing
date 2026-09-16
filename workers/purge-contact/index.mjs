/**
 * Purge horaire de la base du formulaire de contact.
 *
 * La politique de confidentialité de memlia.fr promet deux durées : l'empreinte d'adresse est
 * « conservée vingt-quatre heures, puis effacée », et les messages sont « conservés au plus douze
 * mois ». Une promesse sans mécanisme n'est qu'un vœu : ce Worker, déclenché chaque heure, la tient.
 * Il ne lit rien, n'envoie rien ; il efface, et journalise combien.
 */
export const EMPREINTE_MS = 24 * 60 * 60 * 1000;
export const MESSAGES_MS = 365 * 24 * 60 * 60 * 1000; // « au plus douze mois » : 365 jours tiennent la promesse même en année bissextile.

export async function purger(db, maintenant = Date.now()) {
  const empreintes = await db.prepare('UPDATE messages SET ip_hash = NULL WHERE ip_hash IS NOT NULL AND recu_le < ?1')
    .bind(new Date(maintenant - EMPREINTE_MS).toISOString()).run();
  const messages = await db.prepare('DELETE FROM messages WHERE recu_le < ?1')
    .bind(new Date(maintenant - MESSAGES_MS).toISOString()).run();
  return { empreintesEffacees: empreintes?.meta?.changes ?? 0, messagesSupprimes: messages?.meta?.changes ?? 0 };
}

export default {
  async scheduled(_evenement, env) {
    const bilan = await purger(env.DB);
    console.log(JSON.stringify({ purge: 'memlia-contact', ...bilan }));
  },
  async fetch() {
    return new Response('memlia-contact-purge : rien à voir ici.', { status: 404 });
  },
};
