/**
 * Formulaire de contact — fonction Cloudflare Pages.
 *
 * Le site est statique : cette fonction est le seul code qui s'exécute côté serveur.
 * Elle fait peu de choses, et chacune ferme une porte :
 *   - elle valide sans confiance ce qu'elle reçoit (longueurs, adresse, consentement) ;
 *   - elle refuse les robots sans widget tiers : un champ piège invisible, une limite de
 *     débit par adresse hachée, et Turnstile seulement s'il est configuré ;
 *   - elle écrit le message en base AVANT toute notification, pour qu'aucun message ne
 *     dépende d'un service de courriel qui n'existe peut-être pas encore ;
 *   - elle répond à un navigateur sans JavaScript par une redirection, et à un appel
 *     `fetch` par du JSON — le même formulaire sert les deux.
 *
 * Human-in-the-loop : rien n'est envoyé au visiteur. Kevin lit, puis répond lui-même.
 */

const LIMITES = { nom: 120, cabinet: 160, courriel: 254, message: 4000, messageMin: 20 };
const FENETRE_DEBIT_MS = 60 * 60 * 1000;
const MAX_MESSAGES_PAR_FENETRE = 3;
const CHAMP_PIEGE = 'site_web';
const PAGE = '/contact';

/** Une adresse « raisonnable » : on cherche à refuser l'évident, pas à réécrire la RFC. */
const COURRIEL = /^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/;

const texte = (valeur, maximum) => String(valeur ?? '').replace(/\r\n?/g, '\n').trim().slice(0, maximum);

/** Valide le formulaire ; rend une liste d'erreurs nommées, vide si tout va bien. */
export function valider(entree) {
  const erreurs = [];
  const champs = {
    nom: texte(entree.nom, LIMITES.nom),
    cabinet: texte(entree.cabinet, LIMITES.cabinet),
    courriel: texte(entree.courriel, LIMITES.courriel).toLowerCase(),
    message: texte(entree.message, LIMITES.message),
  };
  if (String(entree[CHAMP_PIEGE] ?? '').trim() !== '') erreurs.push('piege');
  if (champs.nom.length < 2) erreurs.push('nom');
  if (!COURRIEL.test(champs.courriel)) erreurs.push('courriel');
  if (champs.message.length < LIMITES.messageMin) erreurs.push('message');
  const consentement = entree.consentement;
  if (!(consentement === true || consentement === 'on' || consentement === 'oui' || consentement === '1')) erreurs.push('consentement');
  return { champs, erreurs };
}

async function sha256Hex(valeur) {
  const octets = new TextEncoder().encode(valeur);
  const empreinte = await crypto.subtle.digest('SHA-256', octets);
  return [...new Uint8Array(empreinte)].map((o) => o.toString(16).padStart(2, '0')).join('');
}

async function verifierTurnstile(env, jeton, ip) {
  if (!env.TURNSTILE_SECRET) return true; // Non configuré : on ne bloque pas sur une absence de widget.
  if (!jeton) return false;
  const reponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ secret: env.TURNSTILE_SECRET, response: jeton, remoteip: ip }),
  });
  const resultat = await reponse.json().catch(() => ({}));
  return resultat.success === true;
}

async function lireEntree(request) {
  const type = request.headers.get('content-type') || '';
  if (type.includes('application/json')) return await request.json();
  const formulaire = await request.formData();
  return Object.fromEntries(formulaire.entries());
}

function repondre(request, statut, code, corps) {
  const veutJson = (request.headers.get('accept') || '').includes('application/json');
  if (veutJson) return Response.json({ ok: statut < 400, code, ...corps }, { status: statut });
  // Sans JavaScript, la page est servie telle quelle : la réponse doit donc être une
  // page réelle, pas un paramètre que personne ne lira. Deux pages statiques, noindex.
  const url = new URL(statut < 400 ? `${PAGE}/merci` : `${PAGE}/erreur`, request.url);
  if (statut >= 400) url.searchParams.set('champ', code);
  return Response.redirect(url.toString(), 303);
}

export async function onRequestGet() {
  return new Response('Méthode non autorisée', { status: 405, headers: { allow: 'POST' } });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  let entree;
  try {
    entree = await lireEntree(request);
  } catch {
    return repondre(request, 400, 'illisible', {});
  }

  const { champs, erreurs } = valider(entree);
  // Un robot qui remplit le champ piège reçoit un succès : il n'apprend rien, rien n'est écrit.
  if (erreurs.includes('piege')) return repondre(request, 200, '1', {});
  if (erreurs.length > 0) return repondre(request, 422, erreurs[0], { erreurs });

  const ip = request.headers.get('cf-connecting-ip') || '';
  if (!(await verifierTurnstile(env, entree['cf-turnstile-response'], ip))) {
    return repondre(request, 422, 'verification', { erreurs: ['verification'] });
  }

  if (!env.DB) return repondre(request, 503, 'indisponible', {});
  const ipHash = ip ? await sha256Hex(`${env.CONTACT_SALT ?? ''}:${ip}`) : null;
  const maintenant = new Date();
  const depuis = new Date(maintenant.getTime() - FENETRE_DEBIT_MS).toISOString();

  if (ipHash) {
    const recents = await env.DB.prepare('SELECT COUNT(*) AS n FROM messages WHERE ip_hash = ?1 AND recu_le > ?2')
      .bind(ipHash, depuis).first('n');
    if (Number(recents) >= MAX_MESSAGES_PAR_FENETRE) return repondre(request, 429, 'trop-de-messages', {});
  }

  await env.DB.prepare(
    'INSERT INTO messages (recu_le, nom, cabinet, courriel, message, ip_hash, navigateur) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)',
  ).bind(
    maintenant.toISOString(), champs.nom, champs.cabinet || null, champs.courriel, champs.message,
    ipHash, texte(request.headers.get('user-agent'), 200) || null,
  ).run();

  // Notification si un expéditeur est branché ; le message est déjà en base quoi qu'il arrive.
  if (env.NOTIFIER && typeof env.NOTIFIER.send === 'function') {
    try {
      const { EmailMessage } = await import('cloudflare:email');
      const corps = [
        `From: Memlia <contact@memlia.fr>`, `To: contact@memlia.fr`, `Reply-To: ${champs.courriel}`,
        `Subject: Nouveau message de ${champs.nom}${champs.cabinet ? ` (${champs.cabinet})` : ''}`,
        'Content-Type: text/plain; charset=utf-8', '', champs.message, '', `— Reçu le ${maintenant.toISOString()} via memlia.fr/contact`,
      ].join('\r\n');
      await env.NOTIFIER.send(new EmailMessage('contact@memlia.fr', 'contact@memlia.fr', corps));
    } catch (erreur) {
      console.error('notification non envoyée', erreur?.message ?? erreur);
    }
  }

  return repondre(request, 200, '1', {});
}
