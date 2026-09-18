import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  SEUILS,
  analyserSerp,
  chercherExtrait,
  detecterDemande,
  fenetres,
  jugerIndexation,
  jugerSources,
  jugerVitesse,
  chercherPassages,
  liensEntrants,
  normaliserTexte,
  semaineIso,
  verifierAncres,
  verifierMaillage,
  verifierRoutes,
} from '../../scripts/lib/seo-regles.mjs';

// ---------------------------------------------------------------- C1 : indexation et dérive

const inspection = (url, extra = {}) => ({
  url,
  verdict: 'PASS',
  coverage_state: 'Submitted and indexed',
  indexing_state: 'INDEXING_ALLOWED',
  last_crawl_time: '2026-09-16T23:47:58Z',
  canonical: { match: true, google_canonical: url, user_canonical: url },
  error: null,
  ...extra,
});

const sitemapSain = { path: 'https://memlia.fr/sitemap-0.xml', last_submitted: '2026-09-20T13:14:40Z', last_downloaded: '2026-09-21T02:00:00Z', is_pending: false, errors: 0, warnings: 0 };

const base = (extra = {}) => ({
  inspections: [inspection('https://memlia.fr/blog/a')],
  sitemaps: [sitemapSain],
  premieresVues: { 'https://memlia.fr/blog/a': '2026-09-10' },
  etatPrecedent: {},
  derive: [{ url: 'https://memlia.fr/blog/a', statut: 'ok', critical: 0, warning: 0, info: 0, commitBaseline: 'c1', findings: [] }],
  indexabilite: { passed: true, message: 'PASS' },
  variantes: [{ url: 'http://memlia.fr/', status: 301, location: 'https://memlia.fr/', impressions28j: 0 }],
  aujourdhui: '2026-09-21',
  commitDeploye: 'c1',
  ...extra,
});

test('une URL indexée avec canonique conforme ne produit ni rouge ni action', () => {
  const v = jugerIndexation(base());
  assert.deepEqual(v.rouges, []);
  assert.deepEqual(v.actions.demanderIndexation, []);
  assert.equal(v.resume.indexees, 1);
  assert.equal(v.etat['https://memlia.fr/blog/a'], 'indexee');
});

test('une URL non indexée vue depuis moins de 7 jours est en attente et part à IndexNow, sans rouge', () => {
  const v = jugerIndexation(base({
    inspections: [inspection('https://memlia.fr/blog/a', { coverage_state: 'URL is unknown to Google', verdict: 'NEUTRAL' })],
    premieresVues: { 'https://memlia.fr/blog/a': '2026-09-18' },
  }));
  assert.deepEqual(v.rouges, []);
  assert.equal(v.resume.enAttente, 1);
  assert.deepEqual(v.actions.indexnow, ['https://memlia.fr/blog/a']);
  assert.deepEqual(v.actions.demanderIndexation, []);
});

test('une URL non indexée depuis 7 jours ou plus est rouge et demande une indexation manuelle', () => {
  const v = jugerIndexation(base({
    inspections: [inspection('https://memlia.fr/blog/a', { coverage_state: 'Discovered - currently not indexed', verdict: 'NEUTRAL' })],
    premieresVues: { 'https://memlia.fr/blog/a': '2026-09-14' },
  }));
  assert.equal(v.rouges.length, 1);
  assert.equal(v.rouges[0].code, 'non-indexee-7j');
  assert.deepEqual(v.actions.demanderIndexation, ['https://memlia.fr/blog/a']);
});

test('une canonique divergente est rouge', () => {
  const v = jugerIndexation(base({
    inspections: [inspection('https://memlia.fr/blog/a', { canonical: { match: false, google_canonical: 'https://memlia.fr/blog/b', user_canonical: 'https://memlia.fr/blog/a' } })],
  }));
  assert.equal(v.rouges[0].code, 'canonique-divergente');
});

test('une URL indexée hier et absente de l’index aujourd’hui est rouge : sortie de l’index', () => {
  const v = jugerIndexation(base({
    inspections: [inspection('https://memlia.fr/blog/a', { coverage_state: 'Crawled - currently not indexed', verdict: 'NEUTRAL' })],
    etatPrecedent: { 'https://memlia.fr/blog/a': 'indexee' },
  }));
  assert.ok(v.rouges.some((r) => r.code === 'sortie-index'));
});

test('un sitemap en erreur ou non relu depuis plus de 72 h est rouge', () => {
  const erreur = jugerIndexation(base({ sitemaps: [{ ...sitemapSain, errors: 2 }] }));
  assert.equal(erreur.rouges[0].code, 'sitemap-erreur');
  const nonRelu = jugerIndexation(base({ sitemaps: [{ ...sitemapSain, last_downloaded: '2026-09-17T02:00:00Z' }] }));
  assert.equal(nonRelu.rouges[0].code, 'sitemap-non-relu');
});

test('une dérive sur le commit de la baseline est rouge, sur un autre commit une info et une baseline à reposer', () => {
  const derive = { url: 'https://memlia.fr/blog/a', statut: 'derive', critical: 1, warning: 0, info: 0, commitBaseline: 'c1', findings: [{ rule: 'title_changed', severity: 'CRITICAL', message: 'Title changed' }] };
  const rouge = jugerIndexation(base({ derive: [derive] }));
  assert.equal(rouge.rouges[0].code, 'derive');
  const attendue = jugerIndexation(base({ derive: [derive], commitDeploye: 'c2' }));
  assert.deepEqual(attendue.rouges, []);
  assert.deepEqual(attendue.actions.poserBaseline, ['https://memlia.fr/blog/a']);
});

test('une URL sans baseline demande la pose d’une baseline sans rougir', () => {
  const v = jugerIndexation(base({ derive: [{ url: 'https://memlia.fr/blog/a', statut: 'sans-baseline' }] }));
  assert.deepEqual(v.rouges, []);
  assert.deepEqual(v.actions.poserBaseline, ['https://memlia.fr/blog/a']);
});

test('un oracle d’indexabilité en échec est rouge', () => {
  const v = jugerIndexation(base({ indexabilite: { passed: false, message: 'noindex sur l’accueil' } }));
  assert.equal(v.rouges[0].code, 'indexabilite');
});

test('une variante qui ne redirige pas est rouge, une variante avec impressions une info', () => {
  const v = jugerIndexation(base({
    variantes: [
      { url: 'https://www.memlia.fr/', status: 200, location: null, impressions28j: 0 },
      { url: 'http://memlia.fr/', status: 301, location: 'https://memlia.fr/', impressions28j: 3 },
    ],
  }));
  assert.equal(v.rouges.length, 1);
  assert.equal(v.rouges[0].code, 'variante-non-redirigee');
  assert.ok(v.infos.some((i) => i.code === 'variante-avec-impressions'));
});

test('une variante qui arrive au site canonique par deux redirections permanentes est un avertissement, pas un rouge', () => {
  const v = jugerIndexation(base({
    variantes: [{ url: 'http://www.memlia.fr/', status: 301, location: 'https://www.memlia.fr/', finalUrl: 'https://memlia.fr/', redirections: 2, impressions28j: 0 }],
  }));
  assert.deepEqual(v.rouges, []);
  assert.equal(v.avertissements[0].code, 'variante-chaine-de-redirections');
});

test('une variante qui redirige ailleurs que sur le site canonique est rouge même en 301', () => {
  const v = jugerIndexation(base({
    variantes: [{ url: 'https://www.memlia.fr/', status: 301, location: 'https://autre.example/', finalUrl: 'https://autre.example/', redirections: 1, impressions28j: 0 }],
  }));
  assert.equal(v.rouges[0].code, 'variante-non-redirigee');
});

test('quand toutes les inspections échouent, l’instrument est muet et c’est rouge', () => {
  const v = jugerIndexation(base({ inspections: [inspection('https://memlia.fr/blog/a', { error: 'quota', verdict: null, coverage_state: null })] }));
  assert.equal(v.rouges[0].code, 'instrument-muet');
  assert.equal(v.resume.indexees, 0);
});

test('les premières vues sont conservées et complétées, jamais reculées', () => {
  const v = jugerIndexation(base({
    inspections: [inspection('https://memlia.fr/blog/a'), inspection('https://memlia.fr/blog/b')],
    premieresVues: { 'https://memlia.fr/blog/a': '2026-09-10' },
  }));
  assert.equal(v.premieresVues['https://memlia.fr/blog/a'], '2026-09-10');
  assert.equal(v.premieresVues['https://memlia.fr/blog/b'], '2026-09-21');
});

// ---------------------------------------------------------------- C2 : demande

test('les fenêtres se terminent trois jours avant aujourd’hui et couvrent 7, 28 et les 28 jours précédents', () => {
  const f = fenetres({ aujourdhui: '2026-09-21' });
  assert.deepEqual(f.semaine, { debut: '2026-09-12', fin: '2026-09-18' });
  assert.deepEqual(f.mois, { debut: '2026-08-22', fin: '2026-09-18' });
  assert.deepEqual(f.moisPrecedent, { debut: '2026-07-25', fin: '2026-08-21' });
});

const serpMemlia = {
  keyword: 'memlia',
  spell: { keyword: 'mellia', type: 'did_you_mean' },
  se_results_count: 107,
  items: [
    { type: 'knowledge_graph', rank_absolute: 1 },
    { type: 'organic', rank_absolute: 2, domain: 'www.instagram.com', url: 'https://www.instagram.com/sebmellia', title: 'Seb Mellia' },
    { type: 'organic', rank_absolute: 3, domain: 'fr.wikipedia.org', url: 'https://fr.wikipedia.org/wiki/Seb_Mellia', title: 'Seb Mellia' },
    { type: 'organic', rank_absolute: 20, domain: 'memlia.fr', url: 'https://memlia.fr/contact', title: 'Contact | Memlia' },
  ],
};

test('analyserSerp lit la correction orthographique, le rang de memlia et les blocs', () => {
  const a = analyserSerp(serpMemlia, { domaine: 'memlia.fr' });
  assert.deepEqual(a.spell, { mot: 'mellia', type: 'did_you_mean' });
  assert.equal(a.rangMemlia, 20);
  assert.equal(a.urlMemlia, 'https://memlia.fr/contact');
  assert.equal(a.blocs.knowledgeGraph, true);
  assert.equal(a.blocs.aiOverview, false);
  assert.deepEqual(a.top.map((t) => t.domaine), ['www.instagram.com', 'fr.wikipedia.org', 'memlia.fr']);
});

test('analyserSerp rend absent quand memlia n’est pas dans les résultats et voit l’AI Overview', () => {
  const a = analyserSerp({ keyword: 'x', spell: null, items: [{ type: 'ai_overview', rank_absolute: 1 }, { type: 'organic', rank_absolute: 2, domain: 'a.fr', url: 'https://a.fr/', title: 'A' }] }, { domaine: 'memlia.fr' });
  assert.equal(a.rangMemlia, null);
  assert.equal(a.spell, null);
  assert.equal(a.blocs.aiOverview, true);
});

const registre = {
  version: 1,
  marque: ['memlia'],
  articles: [
    { slug: 'a', url: 'https://memlia.fr/blog/a', requete: 'requete a', secondaires: [], famille: 'f1', publieLe: '2026-09-01' },
    { slug: 'b', url: 'https://memlia.fr/blog/b', requete: 'requete b', secondaires: [], famille: 'f1', publieLe: '2026-09-02' },
    { slug: 'c', url: 'https://memlia.fr/blog/c', requete: 'requete c', secondaires: [], famille: 'f1', publieLe: '2026-09-03' },
    { slug: 'd', url: 'https://memlia.fr/blog/d', requete: 'requete d', secondaires: [], famille: 'f2', publieLe: '2026-09-03' },
    { slug: 'e', url: 'https://memlia.fr/blog/e', requete: 'requete e', secondaires: [], famille: 'f2', publieLe: '2026-09-04' },
  ],
};
const ligne = (keys, clicks, impressions, position) => ({ keys, clicks, impressions, ctr: impressions ? (clicks / impressions) * 100 : 0, position });
const gscVide = () => ({ semaine: { pages: [], requetes: [], pagesRequetes: [] }, mois: { pages: [], requetes: [], pagesRequetes: [] }, moisPrecedent: { pages: [] } });

test('une requête en position 5 à 20 avec assez d’impressions est à portée et crée une tâche recaler-titre', () => {
  const gsc = gscVide();
  gsc.semaine.pagesRequetes = [ligne(['https://memlia.fr/blog/d', 'requete d'], 0, 9, 12.3)];
  const d = detecterDemande({ registre, gsc, requetesVues: {}, aujourdhui: '2026-09-21' });
  assert.equal(d.portee.length, 1);
  assert.equal(d.portee[0].slug, 'd');
  assert.equal(d.taches[0].type, 'recaler-titre');
  assert.equal(d.taches[0].slug, 'd');
});

test('un CTR sous 1 % à 20 impressions ou plus est une anomalie, à 19 impressions non', () => {
  const gsc = gscVide();
  gsc.mois.pagesRequetes = [ligne(['https://memlia.fr/blog/d', 'requete d'], 0, 20, 3), ligne(['https://memlia.fr/blog/e', 'requete e'], 0, 19, 3)];
  const d = detecterDemande({ registre, gsc, requetesVues: {}, aujourdhui: '2026-09-21' });
  assert.deepEqual(d.ctr.map((x) => x.slug), ['d']);
});

test('une page qui perd la moitié de ses impressions à 20 ou plus est une chute et crée une tâche rafraichir', () => {
  const gsc = gscVide();
  gsc.mois.pages = [ligne(['https://memlia.fr/blog/d'], 1, 10, 4)];
  gsc.moisPrecedent.pages = [ligne(['https://memlia.fr/blog/d'], 3, 24, 4)];
  const d = detecterDemande({ registre, gsc, requetesVues: {}, aujourdhui: '2026-09-21' });
  assert.equal(d.chutes.length, 1);
  assert.ok(d.taches.some((t) => t.type === 'rafraichir' && t.slug === 'd'));
});

test('une famille à trois satellites publiés et zéro impression est signalée, une famille à deux ne l’est pas', () => {
  const d = detecterDemande({ registre, gsc: gscVide(), requetesVues: {}, aujourdhui: '2026-09-21' });
  assert.deepEqual(d.famillesSansImpression, ['f1']);
});

test('la requête de marque hors rang 1 est signalée, absente aussi', () => {
  const gsc = gscVide();
  gsc.mois.requetes = [ligne(['memlia'], 2, 30, 3.4)];
  const d = detecterDemande({ registre, gsc, requetesVues: {}, aujourdhui: '2026-09-21' });
  assert.equal(d.marque[0].statut, 'hors-rang-1');
  const absente = detecterDemande({ registre, gsc: gscVide(), requetesVues: {}, aujourdhui: '2026-09-21' });
  assert.equal(absente.marque[0].statut, 'absente');
});

test('les lignes GSC sont agrégées par article via le registre et les pages hors registre comptées à part', () => {
  const gsc = gscVide();
  gsc.mois.pages = [ligne(['https://memlia.fr/blog/d'], 1, 10, 4), ligne(['https://memlia.fr/'], 3, 15, 1.8)];
  gsc.mois.pagesRequetes = [ligne(['https://memlia.fr/blog/d', 'requete d'], 1, 6, 4), ligne(['https://memlia.fr/blog/d', 'autre'], 0, 4, 9)];
  const d = detecterDemande({ registre, gsc, requetesVues: {}, aujourdhui: '2026-09-21' });
  const art = d.parArticle.find((x) => x.slug === 'd');
  assert.equal(art.impressions28, 10);
  assert.deepEqual(art.requetes.map((r) => r.requete), ['requete d', 'autre']);
  assert.deepEqual(d.horsRegistre.map((h) => h.page), ['https://memlia.fr/']);
  assert.deepEqual(d.nouvelles, ['requete d', 'autre']);
});

// ---------------------------------------------------------------- C3 : maillage, vitesse, sources

const page = (main, hors = '') => `<html><body><nav><a href="/blog/a">nav</a>${hors}</nav><main>${main}</main><footer><a href="/blog/a">pied</a></footer></body></html>`;

test('liensEntrants compte les pages distinctes qui lient un article dans leur main, hors la page elle-même', () => {
  const pages = {
    '/blog': page('<a href="/blog/a">a</a><a href="/blog/b">b</a>'),
    '/blog/a': page('<a href="/blog/b">b</a><a href="/blog/a">moi</a>'),
    '/blog/b': page('<a href="/blog/a#section">a</a><a href="/blog/a?x=1">a bis</a>'),
    '/glossaire': page('<a href="/blog/abc">pas a</a>'),
  };
  const liens = liensEntrants({ pages, cibles: ['/blog/a', '/blog/b'] });
  assert.deepEqual(liens.find((l) => l.cible === '/blog/a').entrants, ['/blog', '/blog/b']);
  assert.equal(liens.find((l) => l.cible === '/blog/b').nombre, 2);
});

test('liensEntrants ignore la navigation et le pied de page', () => {
  const pages = { '/blog': page(''), '/blog/a': page('') };
  const liens = liensEntrants({ pages, cibles: ['/blog/a'] });
  assert.equal(liens[0].nombre, 0);
});

test('verifierMaillage rougit un article sous trois liens entrants et crée une tâche inserer-lien', () => {
  const pages = {
    '/blog': page('<a href="/blog/p">p</a><a href="/blog/a">a</a>'),
    '/blog/p': page('<a href="/blog/a">a</a>'),
    '/blog/a': page('<a href="/blog/p">pilier</a>'),
    '/glossaire': page(''),
  };
  const v = verifierMaillage({ pages, pilier: '/blog/p', satellites: ['/blog/a'], seuil: 3 });
  assert.ok(v.rouges.some((r) => r.code === 'liens-entrants-insuffisants' && r.cible === '/blog/a'));
  assert.ok(v.taches.some((t) => t.type === 'inserer-lien' && t.slug === 'a'));
});

test('verifierMaillage exige le lien satellite vers pilier et pilier vers satellite', () => {
  const pages = {
    '/blog': page('<a href="/blog/p">p</a><a href="/blog/a">a</a>'),
    '/blog/p': page('rien'),
    '/blog/a': page('rien non plus'),
    '/glossaire': page(''),
  };
  const v = verifierMaillage({ pages, pilier: '/blog/p', satellites: ['/blog/a'], seuil: 1 });
  assert.ok(v.rouges.some((r) => r.code === 'satellite-sans-lien-pilier'));
  assert.ok(v.rouges.some((r) => r.code === 'pilier-sans-lien-satellite'));
});

test('un satellite qui ne lie pas le pilier reçoit une tâche inserer-lien vers le pilier', () => {
  const pages = {
    '/blog': page('<a href="/blog/p">p</a><a href="/blog/a">a</a>'),
    '/blog/p': page('<a href="/blog/a">a</a>'),
    '/blog/a': page('rien'),
    '/glossaire': page(''),
  };
  const v = verifierMaillage({ pages, pilier: '/blog/p', satellites: ['/blog/a'], seuil: 1 });
  assert.ok(v.taches.some((t) => t.type === 'inserer-lien' && t.slug === 'a' && t.cle === 'lien-vers-pilier' && t.gravite === 'haute'));
});

test('verifierMaillage signale une ancre de glossaire qui ne résout pas', () => {
  const pages = {
    '/blog': page('<a href="/blog/p">p</a>'),
    '/blog/p': page('<a href="/glossaire#ocr">ocr</a><a href="/glossaire#absente">x</a>'),
    '/glossaire': page('<h3 id="ocr">OCR</h3>'),
  };
  const v = verifierMaillage({ pages, pilier: '/blog/p', satellites: [], seuil: 1 });
  const ancres = v.rouges.filter((r) => r.code === 'ancre-glossaire-absente');
  assert.equal(ancres.length, 1);
  assert.equal(ancres[0].ancre, 'absente');
});

const psi = (url, performance, extra = {}) => ({ url, scores: { performance, accessibility: 100, bestPractices: 100, seo: 100 }, labo: { lcpMs: 2400, cls: 0.02, tbtMs: 0 }, ...extra });

test('jugerVitesse ne rougit qu’au second relevé consécutif sous le plancher', () => {
  const premier = jugerVitesse({ resultats: [psi('https://memlia.fr/', 93)], precedent: [], plancher: 95 });
  assert.deepEqual(premier.rouges, []);
  assert.equal(premier.aSurveiller.length, 1);
  const second = jugerVitesse({ resultats: [psi('https://memlia.fr/', 92)], precedent: [psi('https://memlia.fr/', 93)], plancher: 95 });
  assert.equal(second.rouges[0].code, 'score-sous-plancher');
});

test('jugerVitesse rougit un CLS au-dessus de 0,1 dès le premier relevé', () => {
  const v = jugerVitesse({ resultats: [psi('https://memlia.fr/', 99, { labo: { lcpMs: 2400, cls: 0.14, tbtMs: 0 } })], precedent: [], plancher: 95 });
  assert.equal(v.rouges[0].code, 'cls');
});

const essai = (extra = {}) => ({ ok: true, status: 200, finalUrl: 'https://www.cnil.fr/fr/x', extraitTrouve: true, dureeMs: 800, erreur: null, ...extra });
const verif = (essais, extra = {}) => ({ slug: 'a', sourceId: 'cnil-x', url: 'https://www.cnil.fr/fr/x', essais, ...extra });

test('jugerSources : une source morte après trois essais est rouge et crée une tâche haute', () => {
  const mort = essai({ ok: false, status: 404, extraitTrouve: false });
  const v = jugerSources({ verifications: [verif([mort, mort, mort])] });
  assert.equal(v.rouges[0].code, 'source-morte');
  assert.equal(v.taches[0].type, 'reverifier-source');
  assert.equal(v.taches[0].gravite, 'haute');
});

test('jugerSources : un extrait absent d’une page en 200 est rouge', () => {
  const v = jugerSources({ verifications: [verif([essai({ extraitTrouve: false })])] });
  assert.equal(v.rouges[0].code, 'extrait-absent');
});

test('jugerSources : une redirection vers une autre page est un avertissement avec tâche', () => {
  const v = jugerSources({ verifications: [verif([essai({ finalUrl: 'https://www.cnil.fr/fr/autre-page' })])] });
  assert.deepEqual(v.rouges, []);
  assert.equal(v.avertissements[0].code, 'source-redirigee');
  assert.equal(v.taches[0].type, 'reverifier-source');
});

test('jugerSources : une réponse lente est comptée lente, pas morte, et un essai réussi suffit', () => {
  const lent = essai({ dureeMs: 26000 });
  const v = jugerSources({ verifications: [verif([essai({ ok: false, status: 0, erreur: 'timeout', extraitTrouve: false }), lent])] });
  assert.deepEqual(v.rouges, []);
  assert.equal(v.ok, 1);
  assert.equal(v.lents.length, 1);
});

test('les seuils publics portent les valeurs du document CRONS-SEO', () => {
  assert.equal(SEUILS.indexationJours, 7);
  assert.equal(SEUILS.sitemapHeures, 72);
  assert.equal(SEUILS.liensEntrantsMin, 3);
  assert.equal(SEUILS.plancherVitesse, 95);
});

test('semaineIso rend l’année et la semaine ISO, y compris autour du nouvel an', () => {
  assert.equal(semaineIso('2026-09-21'), '2026-W39');
  assert.equal(semaineIso('2026-01-01'), '2026-W01');
  assert.equal(semaineIso('2027-01-01'), '2026-W53');
});

test('normaliserTexte efface les balises, les entités et les variantes typographiques', () => {
  assert.equal(normaliserTexte('<p>L&rsquo;outil&nbsp;de   contrôle « Dsn-Val »</p>'), 'l\'outil de contrôle "dsn-val"');
});

test('chercherExtrait distingue la citation brute, retrouvée après normalisation, ou absente', () => {
  const corps = '<p>Cependant, de manière générale, trois conditions cumulatives s’imposent.</p>';
  assert.equal(chercherExtrait(corps, 'trois conditions cumulatives s’imposent'), 'brut');
  assert.equal(chercherExtrait(corps, "trois conditions cumulatives s'imposent"), 'normalise');
  assert.equal(chercherExtrait(corps, 'quatre conditions'), 'absent');
});

test('jugerSources : une citation retrouvée après normalisation est un avertissement, pas un rouge', () => {
  const v = jugerSources({ verifications: [verif([essai({ extraitTrouve: true, extrait: 'normalise' })])] });
  assert.deepEqual(v.rouges, []);
  assert.equal(v.ok, 1);
  assert.equal(v.avertissements[0].code, 'extrait-forme-changee');
});

test('jugerSources : une source sans citation enregistrée compte comme ouverte et non vérifiable', () => {
  const v = jugerSources({ verifications: [verif([essai({ extraitTrouve: null, extrait: 'non-verifiable' })])] });
  assert.deepEqual(v.rouges, []);
  assert.equal(v.ok, 1);
  assert.equal(v.nonVerifiables, 1);
});

// ---------------------------------------------------------------- C3 : ancres et routes

const servie = (liens) => `<main>${liens.map(([href, texte]) => `<a href="${href}">${texte}</a>`).join(' ')}</main>`;

test('verifierAncres : une ancre qui ne décrit rien rougit et dépose une tâche ; une ancre descriptive passe', () => {
  const pages = {
    '/blog/a': servie([['/methode', 'la méthode'], ['/blog/b', 'cliquez ici']]),
    '/blog/b': servie([['/methode', 'notre façon de travailler']]),
  };
  const r = verifierAncres({ pages, aujourdhui: '2026-09-18' });
  assert.deepEqual(r.rouges.map((x) => x.code), ['ancre-generique']);
  assert.equal(r.rouges[0].depuis, '/blog/a');
  assert.equal(r.rouges[0].ancre, 'cliquez ici');
  assert.deepEqual(r.taches.map((t) => [t.slug, t.type, t.gravite]), [['a', 'varier-ancre', 'moyenne']]);
});

test('verifierAncres : la même ancre vers la même page n’est pas un défaut, vers deux pages elle l’est', () => {
  // Témoin : six articles qui écrivent « la méthode » pour lier /methode ne déclenchent rien.
  // Répéter l'ancre la plus claire est voulu ; c'est l'ambiguïté qui trompe le lecteur.
  const fidele = Object.fromEntries('abcdef'.split('').map((s) => [`/blog/${s}`, servie([['/methode', 'la méthode']])]));
  const rFidele = verifierAncres({ pages: fidele, aujourdhui: '2026-09-18' });
  assert.deepEqual(rFidele.rouges, []);
  assert.deepEqual(rFidele.taches, []);
  const compte = rFidele.infos.find((i) => i.code === 'ancres-par-destination').destinations.find((d) => d.cible === '/methode');
  assert.deepEqual([compte.liens, compte.ancres], [6, 1]);

  const ambigu = { ...fidele, '/blog/g': servie([['/garanties', 'la méthode']]) };
  const r = verifierAncres({ pages: ambigu, aujourdhui: '2026-09-18' });
  assert.deepEqual(r.rouges.map((x) => x.code), ['ancre-ambigue']);
  assert.deepEqual(r.rouges[0].cibles, ['/garanties', '/methode']);
  // La tâche va sur la page minoritaire : c'est elle qui doit changer de mots.
  assert.deepEqual(r.taches.map((t) => t.slug), ['g']);
});

test('verifierRoutes : un article que seul le blog atteint est signalé ; une route depuis le glossaire lève le signal', () => {
  const sansRoute = {
    '/blog': servie([['/blog/a', 'Article A']]),
    '/blog/a': servie([['/methode', 'la méthode']]),
    '/blog/b': servie([['/blog/a', 'l’article A']]),
    '/glossaire': servie([['/blog/b', 'suivre la production']]),
    '/methode': servie([['/blog/b', 'notre méthode appliquée']]),
  };
  const r = verifierRoutes({ pages: sansRoute, articles: ['/blog/a', '/blog/b'] });
  assert.deepEqual(r.avertissements.filter((a) => a.code === 'article-sans-route-hors-blog').map((a) => a.cible), ['/blog/a']);
  assert.deepEqual(r.taches, []); // le correctif vit hors de la forge : on mesure, on ne déclare pas de tâche
});

test('verifierRoutes : une page qui nomme des tâches sans route vers un article est signalée, la page de conversion non', () => {
  const pages = {
    '/': servie([['/methode', 'la méthode']]),
    '/methode': servie([['/blog/a', 'le contrôle avant la DSN']]),
    '/garanties': servie([['/contact', 'confier une tâche']]),
    '/contact': servie([['/methode', 'la méthode']]),
    '/blog/a': servie([['/methode', 'la méthode']]),
  };
  const r = verifierRoutes({ pages, articles: ['/blog/a'] });
  const sansRoute = r.avertissements.filter((a) => a.code === 'page-sans-route-vers-article').map((a) => a.cible);
  assert.deepEqual(sansRoute.sort(), ['/', '/garanties']);
  assert.ok(!sansRoute.includes('/contact'));
});

test('chercherPassages : un paragraphe qui porte tous les mots de la requête, ni un partiel ni un tableau', () => {
  const corps = [
    '## Un titre qui contient bulletin et paie et contrôle',
    'Le contrôle des bulletins avant la paie se rejoue chaque mois dans le cabinet.',
    'Les bulletins arrivent du logiciel, sans contrôle particulier à cette étape.',
    '| Contrôle | Bulletin | Paie |',
  ].join('\n\n');
  const trouves = chercherPassages(corps, ['contrôle bulletin de paie']);
  assert.equal(trouves.length, 1);
  assert.match(trouves[0].paragraphe, /^Le contrôle des bulletins avant la paie/);
  assert.equal(trouves[0].expression, 'contrôle bulletin de paie');
  assert.deepEqual(chercherPassages(corps, ['relance des pièces manquantes']), []);
});

test('chercherPassages : un seul mot significatif ne propose rien, et un sigle doit correspondre exactement', () => {
  const corps = [
    'Les anomalies de la file se relisent chaque semaine, sans rapport avec le dépôt.',
    'Le CRM d’un organisme arrive après le dépôt de la DSN et porte son propre statut.',
    'Un contrôle conjoint des comptes.',
  ].join('\n\n');
  // Mesuré le 18/09/2026 sur le corpus réel : « anomalies dsn » se réduisait au seul mot
  // « anomalies » et proposait six paragraphes d'un article qui ne parle pas de DSN.
  assert.deepEqual(chercherPassages(corps, ['anomalies dsn']), []);
  assert.deepEqual(chercherPassages(corps, ['les anomalies']), []);
  // Un sigle porte le sens : « crm dsn » doit trouver le paragraphe qui porte les deux.
  assert.equal(chercherPassages(corps, ['crm dsn']).length, 1);
  // Mais un sigle ne se laisse pas préfixer : « con » ne vaut pas « contrôle ».
  assert.deepEqual(chercherPassages(corps, ['con comptes']), []);
});

test('verifierAncres : un lien décoratif masqué au lecteur ne compte pas, l’alt d’une image tient lieu d’ancre', () => {
  // Mesuré le 18/09/2026 sur la production : la liste du blog double chaque carte d'un lien
  // d'image « aria-hidden », voulu pour ne pas annoncer deux fois la même destination. Six
  // rouges « ancre vide » accusaient cette pratique correcte, pas le site.
  const pages = {
    '/blog': `<main>
      <a href="/blog/a" class="carte-image" aria-hidden="true" tabindex="-1"><img src="/i.webp" alt=""></a>
      <a href="/blog/a">Contrôler les bulletins avant la DSN</a>
      <a href="/blog/b"><img src="/j.webp" alt="Le suivi de production dans un classeur"></a>
    </main>`,
  };
  const r = verifierAncres({ pages, aujourdhui: '2026-09-18' });
  assert.deepEqual(r.rouges, []);
  const vers = (cible) => r.liens.filter((l) => l.cible === cible);
  assert.deepEqual(vers('/blog/a').map((l) => l.ancre), ['Contrôler les bulletins avant la DSN']);
  assert.deepEqual(vers('/blog/b').map((l) => l.ancre), ['Le suivi de production dans un classeur']);
});
