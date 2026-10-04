import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { apresPublication, inscrireArticle, liensCandidats } from '../../scripts/seo/forge-seo.mjs';

import {
  ajouterAuRegistre,
  ajouterTache,
  articlesPublies,
  cloturerTache,
  ecarterTache,
  maintenanceVide,
  marquerRequetesVues,
  reconcilierRegistre,
  registreVide,
  tachesAFaire,
} from '../../scripts/lib/seo-registres.mjs';

const sha256 = (contenu) => createHash('sha256').update(contenu).digest('hex');

const entree = (slug, extra = {}) => ({
  slug,
  url: `https://memlia.fr/blog/${slug}`,
  requete: `requete ${slug}`,
  secondaires: [],
  famille: 'collecte-pieces',
  publieLe: '2026-09-16',
  source: 'test',
  ...extra,
});

test('un registre vide porte la marque et aucun article', () => {
  const registre = registreVide();
  assert.deepEqual(registre.marque, ['memlia']);
  assert.deepEqual(registre.articles, []);
});

test('un outil local garde son type et son intention propre', () => {
  const tool = entree('charte-ia', { type: 'outil', url: 'https://memlia.fr/outils-comptables-gratuits/generateur-charte-ia-cabinet', requete: 'générateur charte ia cabinet comptable', publieLe: null });
  const registre = ajouterAuRegistre(registreVide(), tool);
  assert.equal(registre.articles[0].type, 'outil');
  assert.throws(() => ajouterAuRegistre(registreVide(), { ...tool, type: 'inconnu' }), /type inconnu/);
});

test('ajouter un article ne mute pas le registre reçu', () => {
  const avant = registreVide();
  const apres = ajouterAuRegistre(avant, entree('a'));
  assert.equal(avant.articles.length, 0);
  assert.equal(apres.articles.length, 1);
});

test('ajouter deux fois le même slug remplace la requête et unit les secondaires', () => {
  let registre = ajouterAuRegistre(registreVide(), entree('a', { secondaires: ['x'] }));
  registre = ajouterAuRegistre(registre, entree('a', { requete: 'nouvelle', secondaires: ['y'] }));
  assert.equal(registre.articles.length, 1);
  assert.equal(registre.articles[0].requete, 'nouvelle');
  assert.deepEqual(registre.articles[0].secondaires, ['x', 'y']);
});

test('ajouter une entrée sans requête est refusé', () => {
  assert.throws(() => ajouterAuRegistre(registreVide(), entree('a', { requete: '' })), /requete/);
});

test('une requête primaire ne peut appartenir à deux URL indexables, même de types différents', () => {
  const blog = entree('article', { type: 'blog', requete: 'automatisation saisie comptable' });
  const registre = ajouterAuRegistre(registreVide(), blog);
  assert.throws(
    () => ajouterAuRegistre(registre, entree('service', {
      type: 'service',
      url: 'https://memlia.fr/automatisation/saisie-comptable',
      requete: ' Automatisation   saisie comptable ',
    })),
    /requête primaire.*déjà.*article/i,
  );
});

test('un même slug sur deux types ne remplace pas une autre URL', () => {
  const blog = entree('paie', { type: 'blog', requete: 'comprendre la paie' });
  let registre = ajouterAuRegistre(registreVide(), blog);
  registre = ajouterAuRegistre(registre, entree('paie', {
    type: 'service',
    url: 'https://memlia.fr/automatisation/paie',
    requete: 'automatisation paie',
  }));
  assert.equal(registre.articles.length, 2);
  assert.deepEqual(registre.articles.map((item) => item.type), ['blog', 'service']);
});

test('réconcilier ajoute les articles publiés absents et rend leurs slugs', () => {
  const registre = ajouterAuRegistre(registreVide(), entree('a'));
  const { registre: apres, ajoutes } = reconcilierRegistre(registre, [entree('a'), entree('b')]);
  assert.deepEqual(ajoutes, ['b']);
  assert.equal(apres.articles.length, 2);
});

test('réconcilier ne réécrit pas la requête d’un article déjà inscrit', () => {
  const registre = ajouterAuRegistre(registreVide(), entree('a', { requete: 'choisie par l’audit' }));
  const { registre: apres, ajoutes } = reconcilierRegistre(registre, [entree('a', { requete: 'du backlog' })]);
  assert.deepEqual(ajoutes, []);
  assert.equal(apres.articles[0].requete, 'choisie par l’audit');
});

const tache = (extra = {}) => ({
  slug: 'a',
  type: 'recaler-titre',
  cle: 'requete a',
  motif: 'position 12 avec 9 impressions',
  mesure: { valeur: '12', instrument: 'GSC', date: '2026-09-21' },
  gravite: 'moyenne',
  cron: 'C2',
  ...extra,
});

test('ajouter une tâche lui donne un identifiant daté et le statut à faire', () => {
  const { file, ajoutee, tache: t } = ajouterTache(maintenanceVide(), tache(), { aujourdhui: '2026-09-21' });
  assert.equal(ajoutee, true);
  assert.equal(file.taches.length, 1);
  assert.equal(t.statut, 'a-faire');
  assert.equal(t.creeLe, '2026-09-21');
  assert.match(t.id, /^2026-09-21-recaler-titre-a/);
});

test('une tâche à faire de même slug, type et clé n’est pas dupliquée, sa mesure est mise à jour', () => {
  const { file } = ajouterTache(maintenanceVide(), tache(), { aujourdhui: '2026-09-21' });
  const { file: apres, ajoutee } = ajouterTache(
    file,
    tache({ mesure: { valeur: '9', instrument: 'GSC', date: '2026-09-28' } }),
    { aujourdhui: '2026-09-28' }
  );
  assert.equal(ajoutee, false);
  assert.equal(apres.taches.length, 1);
  assert.equal(apres.taches[0].mesure.valeur, '9');
  assert.equal(apres.taches[0].misAJourLe, '2026-09-28');
});

test('une tâche faite ne bloque pas la création d’une nouvelle tâche de même clé', () => {
  let { file, tache: t } = ajouterTache(maintenanceVide(), tache(), { aujourdhui: '2026-09-21' });
  file = cloturerTache(file, t.id, { commit: 'abc1234', aujourdhui: '2026-09-25' });
  const { file: apres, ajoutee } = ajouterTache(file, tache(), { aujourdhui: '2026-10-05' });
  assert.equal(ajoutee, true);
  assert.equal(apres.taches.length, 2);
});

test('une tâche invalide est refusée : type inconnu, gravité inconnue, slug absent', () => {
  assert.throws(() => ajouterTache(maintenanceVide(), tache({ type: 'autre' }), { aujourdhui: '2026-09-21' }), /type/);
  assert.throws(() => ajouterTache(maintenanceVide(), tache({ gravite: 'urgente' }), { aujourdhui: '2026-09-21' }), /gravite/);
  assert.throws(() => ajouterTache(maintenanceVide(), tache({ slug: '' }), { aujourdhui: '2026-09-21' }), /slug/);
});

test('clôturer enregistre la date, le commit et le statut fait sans muter la file reçue', () => {
  const { file, tache: t } = ajouterTache(maintenanceVide(), tache(), { aujourdhui: '2026-09-21' });
  const apres = cloturerTache(file, t.id, { commit: 'abc1234', aujourdhui: '2026-09-25' });
  assert.equal(apres.taches[0].statut, 'fait');
  assert.equal(apres.taches[0].traiteLe, '2026-09-25');
  assert.equal(apres.taches[0].commit, 'abc1234');
  assert.equal(file.taches[0].statut, 'a-faire');
});

test('clôturer une tâche inconnue ou déjà close est une erreur', () => {
  const { file, tache: t } = ajouterTache(maintenanceVide(), tache(), { aujourdhui: '2026-09-21' });
  assert.throws(() => cloturerTache(file, 'inconnue', { commit: 'a', aujourdhui: '2026-09-25' }), /inconnue/);
  const close = cloturerTache(file, t.id, { commit: 'a', aujourdhui: '2026-09-25' });
  assert.throws(() => cloturerTache(close, t.id, { commit: 'b', aujourdhui: '2026-09-26' }), /fait/);
});

test('écarter exige un motif et garde la trace', () => {
  const { file, tache: t } = ajouterTache(maintenanceVide(), tache(), { aujourdhui: '2026-09-21' });
  assert.throws(() => ecarterTache(file, t.id, { motif: '', aujourdhui: '2026-09-25' }), /motif/);
  const apres = ecarterTache(file, t.id, { motif: 'décision de Kevin', aujourdhui: '2026-09-25' });
  assert.equal(apres.taches[0].statut, 'ecarte');
  assert.equal(apres.taches[0].motifEcart, 'décision de Kevin');
});

test('les tâches à faire sortent par gravité puis par date de création', () => {
  let { file } = ajouterTache(maintenanceVide(), tache({ slug: 'b', gravite: 'basse' }), { aujourdhui: '2026-09-20' });
  ({ file } = ajouterTache(file, tache({ slug: 'c', gravite: 'haute' }), { aujourdhui: '2026-09-22' }));
  ({ file } = ajouterTache(file, tache({ slug: 'd', gravite: 'haute' }), { aujourdhui: '2026-09-21' }));
  ({ file } = ajouterTache(file, tache({ slug: 'e', gravite: 'moyenne' }), { aujourdhui: '2026-09-19' }));
  assert.deepEqual(tachesAFaire(file).map((t) => t.slug), ['d', 'c', 'e', 'b']);
});

test('marquer les requêtes vues rend les nouvelles et conserve la première date', () => {
  const { vues, nouvelles } = marquerRequetesVues({}, ['crm dsn', 'emlia'], { aujourdhui: '2026-09-21' });
  assert.deepEqual(nouvelles, ['crm dsn', 'emlia']);
  const suite = marquerRequetesVues(vues, ['emlia', 'lettrage'], { aujourdhui: '2026-09-28' });
  assert.deepEqual(suite.nouvelles, ['lettrage']);
  assert.equal(suite.vues['emlia'].premiereVue, '2026-09-21');
  assert.equal(suite.vues['emlia'].derniereVue, '2026-09-28');
});

test('inscrireArticle (F1) inscrit un article publié depuis son frontmatter, refuse un brouillon, et reste idempotent', () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-seo-'));
  try {
    mkdirSync(join(root, 'src/content/blog'), { recursive: true });
    writeFileSync(join(root, 'src/content/blog/x.md'), '---\ntitre: "X"\ndatePublication: 2026-09-10\nbrouillon: false\nfamille: saisie-ocr\nprimaryQuery: "requete x"\nsecondaryQueries: ["a", "b"]\nformat: how-to-guide\n---\ncorps\n');
    writeFileSync(join(root, 'src/content/blog/y.md'), '---\ntitre: "Y"\ndatePublication: 2026-09-10\nbrouillon: true\nprimaryQuery: "requete y"\n---\ncorps\n');
    const r = inscrireArticle(root, 'x', { aujourdhui: '2026-09-17' });
    assert.equal(r.ok, true);
    assert.equal(r.ajoute, true);
    const registre = JSON.parse(readFileSync(join(root, 'docs/strategy/site-v3/mesures/registre-requetes.json'), 'utf8'));
    assert.equal(registre.articles[0].requete, 'requete x');
    assert.deepEqual(registre.articles[0].secondaires, ['a', 'b']);
    assert.equal(registre.articles[0].famille, 'saisie-ocr');
    assert.equal(inscrireArticle(root, 'y', { aujourdhui: '2026-09-17' }).ok, false);
    assert.equal(inscrireArticle(root, 'x', { aujourdhui: '2026-09-17' }).ajoute, false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('la phase après-publication admet un article futur uniquement quand sa publication exacte est scellée', () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-seo-futur-'));
  const slug = 'article-futur';
  try {
    const article = '---\ntitre: "Article futur"\ntitreOnglet: "Article futur | Memlia"\ndatePublication: 2026-10-01\nbrouillon: false\nstatutEditorial: publie\nprimaryQuery: "requete future"\n---\ncorps\n';
    const dossier = join(root, 'editorial/articles', slug);
    mkdirSync(join(root, 'src/content/blog'), { recursive: true });
    mkdirSync(join(dossier, 'preuves'), { recursive: true });
    writeFileSync(join(root, 'src/content/blog', `${slug}.md`), article);

    assert.deepEqual(articlesPublies(root, { aujourdhui: '2026-09-19', inclureScellesFuturs: true }), []);

    const manifest = JSON.stringify({
      editorialStatus: 'publie',
      publishedAt: '2026-09-19',
      publicationEvidence: 'preuves/publication.json',
      kevin: { productionApproved: true },
    }, null, 2) + '\n';
    writeFileSync(join(dossier, 'manifest.json'), manifest);
    writeFileSync(join(dossier, 'preuves/publication.json'), JSON.stringify({
      version: 1,
      kind: 'publication-scellee',
      candidateSlug: slug,
      articleSha256: sha256(article),
      manifestSha256: sha256(manifest),
      publishedAt: '2026-09-19',
      files: [{ path: 'manifest.json', bytes: Buffer.byteLength(manifest), sha256: sha256(manifest) }],
    }, null, 2) + '\n');

    assert.deepEqual(articlesPublies(root, { aujourdhui: '2026-09-19' }), []);
    assert.deepEqual(
      articlesPublies(root, { aujourdhui: '2026-09-19', inclureScellesFuturs: true }).map((a) => a.slug),
      [slug]
    );

    writeFileSync(join(root, 'src/content/blog', `${slug}.md`), article.replace('corps', 'corps modifié'));
    assert.deepEqual(articlesPublies(root, { aujourdhui: '2026-09-19', inclureScellesFuturs: true }), []);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('après-publication reste sans effet quand un article futur scellé échoue au contrôle HTTP', async () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-seo-http-ko-'));
  const slug = 'article-futur';
  try {
    const article = '---\ntitre: "Article futur"\ntitreOnglet: "Article futur | Memlia"\ndatePublication: 2026-10-01\nbrouillon: false\nstatutEditorial: publie\nprimaryQuery: "requete future"\n---\ncorps\n';
    const dossier = join(root, 'editorial/articles', slug);
    mkdirSync(join(root, 'src/content/blog'), { recursive: true });
    mkdirSync(join(dossier, 'preuves'), { recursive: true });
    writeFileSync(join(root, 'src/content/blog', `${slug}.md`), article);
    const manifest = JSON.stringify({
      editorialStatus: 'publie',
      publishedAt: '2026-09-19',
      publicationEvidence: 'preuves/publication.json',
      kevin: { productionApproved: true },
    }, null, 2) + '\n';
    writeFileSync(join(dossier, 'manifest.json'), manifest);
    writeFileSync(join(dossier, 'preuves/publication.json'), JSON.stringify({
      version: 1,
      kind: 'publication-scellee',
      candidateSlug: slug,
      articleSha256: sha256(article),
      manifestSha256: sha256(manifest),
      publishedAt: '2026-09-19',
      files: [{ path: 'manifest.json', bytes: Buffer.byteLength(manifest), sha256: sha256(manifest) }],
    }, null, 2) + '\n');

    const appels = { attente: 0, baseline: 0, indexnow: 0 };
    const rapport = await apresPublication(root, [slug], {
      attenteMaxS: 0,
      attendreProduction: async () => {
        appels.attente += 1;
        return { servie: false, apresS: 0, status: 404 };
      },
      derivePoser: () => {
        appels.baseline += 1;
        return { ok: true, baselineId: 'interdit' };
      },
      indexNow: () => {
        appels.indexnow += 1;
        return { ok: true, statut: 'interdit' };
      },
      commitDistant: () => 'fixture',
    });

    assert.deepEqual(appels, { attente: 1, baseline: 0, indexnow: 0 });
    assert.equal(rapport.indexnow, null);
    assert.equal(existsSync(join(root, 'docs/strategy/site-v3/mesures/registre-requetes.json')), false);
    assert.equal(existsSync(join(root, '.qa/seo/etat-sentinelle.json')), false);
    assert.equal(existsSync(join(root, 'editorial/maintenance.json')), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('liensCandidats (F3) : propose le lien là où la requête est déjà nommée, dans les deux sens, et écarte ce qui est déjà lié', () => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-seo-liens-'));
  try {
    mkdirSync(join(root, 'src/content/blog'), { recursive: true });
    const article = (slug, requete, secondaires) =>
      writeFileSync(join(root, `src/content/blog/${slug}.md`), `---\ntitre: "${slug}"\ndatePublication: 2026-09-10\nbrouillon: false\nfamille: f\nprimaryQuery: "${requete}"\nsecondaryQueries: ${JSON.stringify(secondaires)}\nformat: how-to-guide\n---\ncorps\n`);
    const corps = (slug, texte) => {
      mkdirSync(join(root, 'editorial/recettes', slug), { recursive: true });
      writeFileSync(join(root, 'editorial/recettes', slug, 'corps.md'), texte);
    };
    article('ancien', 'relance des pièces manquantes', []);
    article('nouveau', 'contrôle bulletin de paie', ['écarts du bulletin']);
    article('deja-lie', 'suivi de production sociale', []);
    corps('ancien', '## Titre\n\nLe contrôle des bulletins avant la paie se rejoue chaque mois.\n\nLa relance des pièces est une autre tâche.\n');
    corps('nouveau', '## Titre\n\nUn suivi de la production sociale se tient par dossier et par période.\n\nRien sur les pièces ici.\n');
    corps('deja-lie', '## Titre\n\nLe contrôle des bulletins de paie est décrit dans [cet autre guide](/blog/nouveau).\n');

    const r = liensCandidats(root, 'nouveau');
    // Entrant : « ancien » nomme la tâche du nouvel article sans le lier ; « deja-lie » le lie déjà.
    assert.deepEqual(r.entrants.map((e) => e.slug), ['ancien']);
    assert.match(r.entrants[0].passages[0].paragraphe, /^Le contrôle des bulletins avant la paie/);
    // Sortant : le nouvel article nomme la tâche de « deja-lie » sans le lier.
    assert.deepEqual(r.sortants.map((e) => e.slug), ['deja-lie']);
    assert.match(r.sortants[0].passages[0].paragraphe, /^Un suivi de la production sociale/);
    // Les tâches ne portent que le sens entrant : le sens sortant se traite dans la recette avant publication.
    assert.deepEqual(r.taches.map((t) => [t.slug, t.type, t.cle]), [['ancien', 'inserer-lien', 'lien-vers-nouveau']]);

    // Témoin : une fois le lien posé dans « ancien », il n'est plus candidat et aucune tâche ne reste.
    corps('ancien', '## Titre\n\nLe contrôle des bulletins avant la paie se rejoue chaque mois, voir [le contrôle avant la DSN](/blog/nouveau).\n');
    const apres = liensCandidats(root, 'nouveau');
    assert.deepEqual(apres.entrants, []);
    assert.deepEqual(apres.taches, []);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
