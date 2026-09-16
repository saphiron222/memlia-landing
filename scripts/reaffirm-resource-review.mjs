#!/usr/bin/env node
/**
 * Réaffirmation d'une revue métier scellée, quand le candidat a bougé.
 *
 * Le dossier éditorial est scellé sur les octets : la revue métier est épinglée au
 * sujet exact du candidat, empreinte du HTML rendu comprise. Toute modification du
 * chrome du site (navigation, pied de page) change donc ce sujet et invalide une revue
 * dont la matière n'a pourtant pas bougé d'un octet.
 *
 * Rescellier en effaçant la revue serait le pire des deux mondes : la perte est
 * silencieuse et le dossier repart à PENDING sans que rien ne rougisse. Re-épingler
 * automatiquement serait pire encore : une revue qui suit n'importe quel contenu ne
 * revoit plus rien.
 *
 * Ce script tient la troisième voie, explicite et fail-closed :
 *   ancrer      — enregistre le SUJET COMPLET de la revue en cours, après avoir vérifié
 *                 que son empreinte reproduit exactement celle que la revue a épinglée.
 *                 N'importe qui peut donc recalculer le sujet revu depuis cette ancre.
 *   reaffirmer  — compare le sujet courant à l'ancre FEUILLE PAR FEUILLE, refuse tout
 *                 écart qui n'est pas déclaré et justifié, revérifie que chaque
 *                 affirmation est encore rendue et chaque copie de source intacte,
 *                 puis re-épingle.
 *
 * Toute vérification manquante ou divergente refuse et n'écrit rien.
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { isAbsolute, join } from 'node:path';
import { digest, candidateDigestPayload, reviewSubjectDigestPayload } from './lib/resource-pipeline.mjs';

const root = process.cwd();
const sha256 = (value) => createHash('sha256').update(value).digest('hex');

const SURFACES = [
  { adapter: 'H', manifestPath: 'editorial/resources/hub/manifest.json', outputPath: 'dist/ressources.html' },
  { adapter: 'T', manifestPath: 'editorial/resources/glossaire/manifest.json', outputPath: 'dist/glossaire.html' },
];
const ANCRE = 'docs/qa/hub-ressources/metier-review-r4/sujet-ancre.json';
const DECLARATION = 'docs/qa/hub-ressources/metier-review-r4/reaffirmation-declaration.json';
const RAPPORT = 'docs/qa/hub-ressources/metier-review-r4/reaffirmation.json';
const REGISTRE = 'docs/qa/hub-ressources/metier-fix-c-register.json';

const resoudre = (chemin) => (isAbsolute(chemin) ? chemin : join(root, chemin));
const lireJson = (chemin) => JSON.parse(readFileSync(resoudre(chemin), 'utf8'));
const ecrireJson = (chemin, valeur) => writeFileSync(resoudre(chemin), `${JSON.stringify(valeur, null, 2)}\n`);

/** Refus immédiat : rien n'est écrit tant qu'une seule vérification manque. */
function refuser(motifs) {
  console.error('Réaffirmation refusée :');
  for (const motif of motifs) console.error(`  - ${motif}`);
  process.exit(1);
}

const ENTITES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', laquo: '«', raquo: '»', rsquo: '’', eacute: 'é', egrave: 'è', agrave: 'à', ccedil: 'ç', ugrave: 'ù', hellip: '…', ndash: '–', mdash: '—' };

/** Texte visible d'une page rendue : balises retirées, entités décodées, blancs normalisés. */
function texteRendu(chemin) {
  let html = readFileSync(resoudre(chemin), 'utf8');
  html = html.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ');
  html = html.replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)));
  html = html.replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number.parseInt(dec, 10)));
  html = html.replace(/&([a-z]+);/gi, (entier, nom) => ENTITES[nom.toLowerCase()] ?? entier);
  return html.replace(/\s+/g, ' ').trim();
}

const normaliser = (texte) => texte.replace(/\s+/g, ' ').trim();

/**
 * Chemins de feuille qui divergent entre deux sujets. Comparer clé par clé dirait
 * « skills a bougé » ; comparer feuille par feuille dit « skills.blog[8].checkedAt ».
 * Seule la seconde phrase permet d'autoriser un horodatage sans autoriser un verdict.
 */
function feuillesDivergentes(avant, apres, prefixe = '', sortie = []) {
  const estObjet = (valeur) => valeur !== null && typeof valeur === 'object';
  if (!estObjet(avant) || !estObjet(apres) || Array.isArray(avant) !== Array.isArray(apres)) {
    if (JSON.stringify(avant) !== JSON.stringify(apres)) sortie.push(prefixe || '(racine)');
    return sortie;
  }
  if (Array.isArray(avant)) {
    const longueur = Math.max(avant.length, apres.length);
    for (let rang = 0; rang < longueur; rang += 1) feuillesDivergentes(avant[rang], apres[rang], `${prefixe}[${rang}]`, sortie);
    return sortie;
  }
  for (const cle of [...new Set([...Object.keys(avant), ...Object.keys(apres)])].sort()) {
    feuillesDivergentes(avant[cle], apres[cle], prefixe ? `${prefixe}.${cle}` : cle, sortie);
  }
  return sortie;
}

const cleRacine = (chemin) => chemin.split(/[.[]/)[0];
/** Dernier segment nommé d'un chemin : « skills.blog[8].checkedAt » → « checkedAt ». */
const champTerminal = (chemin) => {
  const segments = chemin.split('.').filter((segment) => !/^\[\d+\]$/.test(segment));
  const dernier = segments[segments.length - 1] ?? chemin;
  return dernier.replace(/\[\d+\]$/, '');
};

function chargerSurface({ adapter, manifestPath, outputPath }, chemin = manifestPath) {
  const manifest = lireJson(chemin);
  const revue = manifest.claimsEvidence?.sensitiveMatter?.businessReview ?? null;
  return { adapter, manifestPath, outputPath, manifest, revue };
}

function commandeAncrer(options) {
  const motifs = [];
  const surfaces = {};
  for (const surface of SURFACES) {
    const source = options[`manifeste-${surface.adapter}`] ?? surface.manifestPath;
    const { adapter, manifest, revue } = chargerSurface(surface, source);
    if (!revue || revue.status === 'PENDING') {
      motifs.push(`${adapter} : aucune revue métier scellée à ancrer (status=${revue?.status ?? 'absent'}).`);
      continue;
    }
    const sujet = reviewSubjectDigestPayload(manifest);
    const empreinte = digest(sujet);
    if (revue.reviewedCandidateHash !== empreinte) {
      motifs.push(`${adapter} : ${source} n'est pas le candidat revu (revu=${revue.reviewedCandidateHash}, recalculé=${empreinte}). Ancrer ce fichier figerait un sujet que personne n'a revu.`);
      continue;
    }
    surfaces[adapter] = {
      ancreDepuis: source,
      status: revue.status,
      reviewerId: revue.reviewerId,
      evidenceRef: revue.evidenceRef,
      reviewedCandidateHash: empreinte,
      verdicts: (revue.claimSourceVerdicts ?? []).length,
      claims: (manifest.claimsEvidence?.claims ?? []).length,
      sujet,
    };
  }
  if (motifs.length > 0) refuser(motifs);
  ecrireJson(ANCRE, {
    schemaVersion: 2,
    revue: 'metier-review-r4',
    ancreLe: new Date().toISOString(),
    regle: "Sujet complet de la revue métier. Son empreinte reproduit le reviewedCandidateHash scellé ; toute feuille qui bouge doit être déclarée et justifiée avant une réaffirmation.",
    surfaces,
  });
  console.log(`Sujet de la revue ancré dans ${ANCRE} pour ${Object.keys(surfaces).join(' et ')}.`);
}

/** Une entrée de déclaration autorise soit toute la clé, soit des champs nommés sous elle. */
function autorisation(declaration, cle) {
  const entree = declaration.deltasAutorises?.[cle];
  if (typeof entree === 'string') return { raison: entree, champsAutorises: null };
  if (entree && typeof entree === 'object' && typeof entree.raison === 'string') {
    return { raison: entree.raison, champsAutorises: Array.isArray(entree.champsAutorises) ? entree.champsAutorises : null };
  }
  return null;
}

function commandeReaffirmer() {
  if (!existsSync(join(root, ANCRE))) refuser([`Ancre absente (${ANCRE}) : ancrer la revue avant de la réaffirmer.`]);
  if (!existsSync(join(root, DECLARATION))) refuser([`Déclaration absente (${DECLARATION}) : aucun écart n'est autorisé par défaut.`]);
  const ancre = lireJson(ANCRE);
  const declaration = lireJson(DECLARATION);
  if (ancre.schemaVersion !== 2) refuser([`Ancre au schéma ${ancre.schemaVersion} : réancrer avec la version courante du script.`]);

  const motifs = [];
  const aEcrire = [];
  const rapportSurfaces = {};

  for (const surface of SURFACES) {
    const { adapter, manifestPath, outputPath, manifest, revue } = chargerSurface(surface);
    const ancreSurface = ancre.surfaces?.[adapter];
    if (!ancreSurface) { motifs.push(`${adapter} : absent de l'ancre.`); continue; }
    if (digest(ancreSurface.sujet) !== ancreSurface.reviewedCandidateHash) {
      motifs.push(`${adapter} : l'ancre ne reproduit plus l'empreinte qu'elle déclare — elle a été modifiée après coup.`);
      continue;
    }
    if (!revue || revue.status !== ancreSurface.status) {
      motifs.push(`${adapter} : le verdict a changé depuis l'ancre (${ancreSurface.status} → ${revue?.status ?? 'absent'}).`);
      continue;
    }

    const sujetCourant = reviewSubjectDigestPayload(manifest);
    const empreinteCourante = digest(sujetCourant);
    if (empreinteCourante === ancreSurface.reviewedCandidateHash) {
      rapportSurfaces[adapter] = { action: 'aucune', motif: 'Le sujet courant est déjà celui de la revue.', reviewedCandidateHash: empreinteCourante };
      continue;
    }

    const feuilles = feuillesDivergentes(ancreSurface.sujet, sujetCourant);
    if (feuilles.length === 0) {
      motifs.push(`${adapter} : le sujet a changé sans qu'aucune feuille ne bouge — l'instrument de comparaison est faux, il ne peut rien autoriser.`);
      continue;
    }
    const refus = [];
    for (const chemin of feuilles) {
      const permis = autorisation(declaration, cleRacine(chemin));
      if (!permis || permis.raison.trim().length < 12) { refus.push(`${chemin} (non déclaré)`); continue; }
      if (permis.champsAutorises && !permis.champsAutorises.includes(champTerminal(chemin))) refus.push(`${chemin} (champ hors déclaration)`);
    }
    if (refus.length > 0) {
      motifs.push(`${adapter} : ${refus.length} écart(s) non couverts par la déclaration — ${[...new Set(refus)].slice(0, 5).join(', ')}. Une revue ne se re-épingle pas sur un changement que personne n'a nommé.`);
      continue;
    }

    // La matière revue doit être encore là : chaque affirmation, mot pour mot, dans la page rendue.
    const rendu = texteRendu(outputPath);
    const claims = manifest.claimsEvidence?.claims ?? [];
    const absents = claims.filter((claim) => !rendu.includes(normaliser(claim.text))).map((claim) => claim.id);
    if (absents.length > 0) {
      motifs.push(`${adapter} : ${absents.length} affirmation(s) revues ne sont plus rendues (${absents.slice(0, 3).join(', ')}).`);
      continue;
    }

    // Les copies de source jugées par la revue doivent être intactes, octet pour octet.
    const parSource = new Map((manifest.claimsEvidence?.sources ?? []).map((source) => [source.id, source]));
    const sourcesCassees = [];
    for (const verdict of revue.claimSourceVerdicts ?? []) {
      const chemin = parSource.get(verdict.sourceId)?.snapshotPath;
      if (!chemin || !existsSync(join(root, chemin))) { sourcesCassees.push(`${verdict.sourceId} (copie absente)`); continue; }
      if (sha256(readFileSync(join(root, chemin))) !== verdict.sourceContentSha256) sourcesCassees.push(`${verdict.sourceId} (copie modifiée)`);
    }
    if (sourcesCassees.length > 0) {
      motifs.push(`${adapter} : copies de source divergentes depuis la revue — ${[...new Set(sourcesCassees)].join(', ')}.`);
      continue;
    }

    // Les couples claim/source jugés doivent porter sur des affirmations encore présentes.
    const idsClaims = new Set(claims.map((claim) => claim.id));
    const couples = (revue.claimSourceVerdicts ?? []).map((verdict) => `${verdict.claimId}/${verdict.sourceId}`).sort();
    const orphelins = couples.filter((couple) => !idsClaims.has(couple.slice(0, couple.lastIndexOf('/'))));
    if (orphelins.length > 0) {
      motifs.push(`${adapter} : ${orphelins.length} verdict(s) portent sur une affirmation disparue (${orphelins.slice(0, 3).join(', ')}).`);
      continue;
    }

    aEcrire.push({ adapter, manifestPath, manifest, revue, empreinteCourante, feuilles, claims: claims.length, verdicts: couples.length, ancreSurface });
  }

  if (motifs.length > 0) refuser(motifs);
  if (aEcrire.length === 0) {
    ecrireJson(RAPPORT, { schemaVersion: 2, revue: ancre.revue, reaffirmeLe: new Date().toISOString(), surfaces: rapportSurfaces });
    console.log('Aucune surface à réaffirmer : les sujets courants sont déjà ceux de la revue.');
    return;
  }

  for (const entree of aEcrire) {
    const { adapter, manifestPath, manifest, revue, empreinteCourante, feuilles, ancreSurface } = entree;
    revue.reviewedCandidateHash = empreinteCourante;

    // La preuve durable doit retracer le verdict exact : elle est réécrite avec le nouveau sujet.
    const preuve = {
      required: revue.required,
      reviewerType: revue.reviewerType,
      reviewerProfile: revue.reviewerProfile,
      reviewerId: revue.reviewerId,
      reviewerRole: revue.reviewerRole,
      distinctFrom: revue.distinctFrom,
      reviewedCandidateHash: empreinteCourante,
      status: revue.status,
      claimSourceVerdicts: revue.claimSourceVerdicts,
    };
    ecrireJson(revue.evidenceRef, preuve);
    revue.evidenceSha256 = sha256(readFileSync(join(root, revue.evidenceRef)));

    // Les empreintes dérivées suivent, jamais l'inverse : candidat puis audit.
    const candidateHash = digest(candidateDigestPayload(manifest));
    manifest.integrity.candidateHash.value = candidateHash;
    manifest.audit = { ...manifest.audit, candidateHash, buildOutputDigest: manifest.integrity.buildOutput.digest, score: manifest.quality.recalculatedScore, result: 'PASS', p0: [...manifest.quality.p0], p1: [...manifest.quality.p1], auditHash: '' };
    const auditPayload = { ...manifest.audit };
    delete auditPayload.auditHash;
    manifest.audit.auditHash = digest(auditPayload);
    ecrireJson(manifestPath, manifest);

    const parChamp = {};
    for (const chemin of feuilles) {
      const cle = `${cleRacine(chemin)}.${champTerminal(chemin)}`;
      parChamp[cle] = (parChamp[cle] ?? 0) + 1;
    }
    rapportSurfaces[adapter] = {
      action: 'réaffirmée',
      sujetAncre: ancreSurface.reviewedCandidateHash,
      sujetReaffirme: empreinteCourante,
      feuillesEcartees: feuilles.length,
      feuillesParChamp: parChamp,
      justifications: Object.fromEntries([...new Set(feuilles.map(cleRacine))].map((cle) => [cle, autorisation(declaration, cle).raison])),
      affirmationsRenduesVerifiees: entree.claims,
      verdictsConserves: entree.verdicts,
      candidateHash,
      auditHash: manifest.audit.auditHash,
      manifestSha256: sha256(readFileSync(join(root, manifestPath))),
      preuveRef: revue.evidenceRef,
      preuveSha256: revue.evidenceSha256,
    };
    console.log(`${adapter} : revue réaffirmée sur ${empreinteCourante} (${feuilles.length} feuille(s) déclarée(s) : ${Object.keys(parChamp).join(', ')}).`);
  }

  // Le registre lisible par machine projette les manifestes et scelle leur empreinte :
  // re-épingler la revue la périme. On refuse plutôt que de recopier si sa matière a bougé.
  const registre = lireJson(REGISTRE);
  const projection = { units: [], claims: [], citations: [], sources: [] };
  const empreintesManifestes = new Map();
  for (const { manifestPath } of SURFACES) {
    const manifest = lireJson(manifestPath);
    empreintesManifestes.set(manifestPath, sha256(readFileSync(join(root, manifestPath))));
    for (const cle of Object.keys(projection)) {
      const source = cle === 'units' ? 'renderedUnitInventory' : cle;
      projection[cle].push(...manifest.claimsEvidence[source].map((ligne) => ({ ...ligne, surface: manifest.formatAdapter })));
    }
  }
  const divergences = Object.keys(projection).filter((cle) => JSON.stringify(registre[cle]) !== JSON.stringify(projection[cle]));
  if (divergences.length > 0) refuser([`Le registre ne projette plus les manifestes sur ${divergences.join(', ')} : la matière a bougé, la réaffirmation ne peut pas le recopier.`]);
  registre.generatedFrom = registre.generatedFrom.map((ligne) => ({ ...ligne, sha256: empreintesManifestes.get(ligne.path) ?? ligne.sha256 }));
  ecrireJson(REGISTRE, registre);

  ecrireJson(RAPPORT, {
    schemaVersion: 2,
    revue: ancre.revue,
    reaffirmeLe: new Date().toISOString(),
    registreRef: REGISTRE,
    registreSha256: sha256(readFileSync(join(root, REGISTRE))),
    declarationRef: DECLARATION,
    declarationSha256: sha256(readFileSync(join(root, DECLARATION))),
    ancreRef: ANCRE,
    ancreSha256: sha256(readFileSync(join(root, ANCRE))),
    regle: "Une réaffirmation ne vaut que pour les feuilles déclarées ; la matière jugée est revérifiée rendue et intacte.",
    surfaces: rapportSurfaces,
  });
  console.log(`Rapport écrit dans ${RAPPORT}.`);
}

const arguments_ = process.argv.slice(3);
const options = {};
for (let rang = 0; rang < arguments_.length; rang += 1) {
  if (arguments_[rang].startsWith('--')) { options[arguments_[rang].slice(2)] = arguments_[rang + 1]; rang += 1; }
}
const commande = process.argv[2];
if (commande === 'ancrer') commandeAncrer(options);
else if (commande === 'reaffirmer') commandeReaffirmer();
else {
  console.error('Usage : node scripts/reaffirm-resource-review.mjs <ancrer|reaffirmer> [--manifeste-H <chemin>] [--manifeste-T <chemin>]');
  process.exit(2);
}
