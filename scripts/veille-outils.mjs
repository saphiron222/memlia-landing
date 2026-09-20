#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { normaliserTexte, verifierSignatures } from './lib/outils-boucle.mjs';

const SORTIE_PAR_DEFAUT = '.qa/veille-outils-latest.json';
const UA = 'MemliaOutilsSourceWatch/1.0 (+https://memlia.fr)';

export const SOURCES_OUTILS = [
  {
    slug: 'calculateur-marge-commerciale',
    alternatives: [
      { url: 'https://www.insee.fr/fr/metadonnees/definition/c1774', signatures: ['marge commerciale', 'difference', 'hors taxes'] },
    ],
  },
  {
    slug: 'calculateur-date-echeance-facture',
    alternatives: [
      { url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038414392', signatures: ['soixante jours', 'quarante cinq jours fin de mois'] },
      { url: 'https://entreprendre.service-public.gouv.fr/vosdroits/F23211', signatures: ['60 jours', '45 jours fin de mois'] },
    ],
  },
  {
    slug: 'modele-rapprochement-bancaire-excel-gratuit',
    alternatives: [
      { url: 'https://www.anc.gouv.fr/plan-comptable-general-0', signatures: ['plan comptable general'] },
    ],
  },
];

async function lire(url) {
  try {
    const reponse = await fetch(url, {
      headers: { Accept: 'text/html,application/xhtml+xml', 'Cache-Control': 'no-cache', 'User-Agent': UA },
      redirect: 'follow',
      signal: AbortSignal.timeout(25_000),
    });
    const texte = await reponse.text();
    return { ok: reponse.ok, status: reponse.status, urlFinale: reponse.url, texte };
  } catch (erreur) {
    return { ok: false, status: null, urlFinale: url, texte: '', erreur: erreur instanceof Error ? erreur.message : String(erreur) };
  }
}

const attendre = (ms) => new Promise((resolvePromise) => setTimeout(resolvePromise, ms));

export async function verifierOutil(outil, { lireSource = lire, attendreMs = 1_000 } = {}) {
  const tentatives = [];
  for (let index = 0; index < 3; index += 1) {
    const alternative = outil.alternatives[Math.min(index, outil.alternatives.length - 1)];
    const resultat = await lireSource(alternative.url);
    const signatures = resultat.ok ? verifierSignatures(resultat.texte, alternative.signatures) : { ok: false, manquantes: alternative.signatures };
    tentatives.push({
      numero: index + 1,
      urlDemandee: alternative.url,
      urlFinale: resultat.urlFinale,
      statusHttp: resultat.status,
      reponseOk: resultat.ok,
      signaturesOk: signatures.ok,
      signaturesAttendues: alternative.signatures,
      signaturesManquantes: signatures.manquantes,
      erreur: resultat.erreur ?? null,
      empreinteTexte: normaliserTexte(resultat.texte).slice(0, 120),
    });
    if (resultat.ok && signatures.ok) {
      return { slug: outil.slug, etat: 'disponible', motif: null, tentatives };
    }
    if (index < 2 && attendreMs > 0) await attendre(attendreMs);
  }
  return {
    slug: outil.slug,
    etat: 'suspendre',
    motif: 'La règle n’est plus vérifiable dans une source officielle après trois lectures réseau.',
    tentatives,
  };
}

async function main() {
  const argumentSortie = process.argv.indexOf('--output');
  const sortie = resolve(argumentSortie >= 0 ? process.argv[argumentSortie + 1] : SORTIE_PAR_DEFAUT);
  const outils = [];
  for (const outil of SOURCES_OUTILS) outils.push(await verifierOutil(outil));
  const rapport = {
    schemaVersion: 1,
    checkedAt: new Date().toISOString(),
    politique: { maxLecturesReseauParOutil: 3, failClosed: true, reactivationAutomatique: false },
    outils,
    verdict: outils.some((outil) => outil.etat === 'suspendre') ? 'SUSPENDRE' : 'PASS',
  };
  mkdirSync(dirname(sortie), { recursive: true });
  writeFileSync(sortie, `${JSON.stringify(rapport, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({ verdict: rapport.verdict, sortie, outils: outils.map(({ slug, etat }) => ({ slug, etat })) })}\n`);
  process.exitCode = rapport.verdict === 'PASS' ? 0 : 2;
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
