const DATE_PREMIER_DECLENCHEMENT = '2026-10-21';
const DATE_VERDICT_LIENS = '2026-12-19';

const ENTITES_HTML = new Map([
  ['amp', '&'],
  ['apos', "'"],
  ['gt', '>'],
  ['lt', '<'],
  ['nbsp', ' '],
  ['quot', '"'],
]);

function decoderEntites(texte) {
  return String(texte ?? '')
    .replace(/&#(\d+);/g, (_, nombre) => String.fromCodePoint(Number(nombre)))
    .replace(/&#x([0-9a-f]+);/gi, (_, nombre) => String.fromCodePoint(Number.parseInt(nombre, 16)))
    .replace(/&([a-z]+);/gi, (entite, nom) => ENTITES_HTML.get(nom.toLowerCase()) ?? entite);
}

export function normaliserTexte(texte) {
  return decoderEntites(String(texte ?? '').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' '))
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function verifierSignatures(texte, signatures) {
  const normalise = normaliserTexte(texte);
  const manquantes = signatures.filter((signature) => !normalise.includes(normaliserTexte(signature)));
  return { ok: manquantes.length === 0, manquantes };
}

export function deciderEtatSource(tentatives, signatures) {
  for (let index = 0; index < tentatives.length; index += 1) {
    const tentative = tentatives[index];
    if (tentative?.ok && verifierSignatures(tentative.texte, signatures).ok) {
      return { etat: 'disponible', motif: null, tentatives: index + 1 };
    }
  }
  return {
    etat: 'suspendre',
    motif: `signature primaire absente après ${tentatives.length} tentatives`,
    tentatives: tentatives.length,
  };
}

export function lireResumeBacklinks(reponse) {
  const tache = reponse?.tasks?.[0];
  if (!tache) {
    return { ok: false, cout: 0, backlinks: null, domainesReferents: null, domainesPrincipaux: null, etat: 'erreur', erreur: 'réponse sans tâche' };
  }
  const cout = Number(tache.cost ?? 0);
  if (Number(tache.status_code) !== 20000) {
    return {
      ok: false,
      cout,
      backlinks: null,
      domainesReferents: null,
      domainesPrincipaux: null,
      etat: 'erreur',
      erreur: `${tache.status_code ?? 'sans-code'} ${tache.status_message ?? ''}`.trim(),
    };
  }
  const resultat = tache.result?.[0] ?? null;
  if (!resultat) {
    return { ok: true, cout, backlinks: 0, domainesReferents: 0, domainesPrincipaux: 0, etat: 'aucun-resultat-dans-index', erreur: null };
  }
  return {
    ok: true,
    cout,
    backlinks: Number(resultat.backlinks ?? 0),
    domainesReferents: Number(resultat.referring_domains ?? 0),
    domainesPrincipaux: Number(resultat.referring_main_domains ?? resultat.referring_domains ?? 0),
    etat: 'mesure',
    erreur: null,
  };
}

function nombreFini(valeur, defaut = 0) {
  const nombre = Number(valeur);
  return Number.isFinite(nombre) ? nombre : defaut;
}

export function evaluerVague({ date, outils }) {
  if (date < DATE_PREMIER_DECLENCHEMENT) {
    return { etat: 'trop-tot', places: 0, datePremierDeclenchement: DATE_PREMIER_DECLENCHEMENT };
  }

  const signaux = (outils ?? []).map((outil) => ({
    autorite: nombreFini(outil.domainesNouveaux) >= 1,
    demande: nombreFini(outil.clics) >= 3 || (nombreFini(outil.impressions) >= 50 && Number.isFinite(Number(outil.position)) && Number(outil.position) <= 20),
    contact: nombreFini(outil.contacts) >= 1,
  }));
  const domaineGagne = signaux.some((signal) => signal.autorite);
  const seuilPasse = signaux.some((signal) => signal.autorite || signal.demande || signal.contact);

  if (date >= DATE_VERDICT_LIENS && !domaineGagne) {
    return { etat: 'hypothese-lien-non-confirmee', places: 0, signaux };
  }
  if (seuilPasse) {
    return { etat: 'ouvrir-une-place', places: 1, signaux, remesurerVivierApresConstruction: true };
  }
  return { etat: 'attendre', places: 0, signaux, prochaineDecision: DATE_VERDICT_LIENS };
}
