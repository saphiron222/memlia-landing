import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse } from 'yaml';

// Décision de Kevin du 08/10/2026 : les contrats navigateur ne passent plus un par un dans un seul
// job (près d'une heure d'attente par PR). Ils se répartissent sur des jobs parallèles, et le seul
// contrôle requis par la protection de main, « Repository gates », attend que tous aient réussi.
const workflow = parse(readFileSync(new URL('../../.github/workflows/pr-validation.yml', import.meta.url), 'utf8'));
const jobs = Object.entries(workflow.jobs);
const PARTS_MIN = 4;
// La navigation clavier des tableaux pèse à elle seule les trois quarts du temps de la suite (mesuré le 08/10/2026 :
// 1 961 s sur 2 642) : elle a sa propre matrice, et la suite générale l'écarte, ni oubliée ni jouée deux fois.
const LENT = 'table-keyboard';

test('les contrats navigateur sont répartis sur au moins quatre jobs parallèles', () => {
  const navigateur = workflow.jobs.verify;
  const parts = navigateur.strategy?.matrix?.part ?? [];
  assert.ok(parts.length >= PARTS_MIN, `${parts.length} part(s), ${PARTS_MIN} au moins`);
  assert.deepEqual(parts, parts.map((_, i) => i + 1), 'parts numérotées de 1 à N');
  assert.equal(navigateur.strategy['fail-fast'], false, 'une part en échec n’interrompt pas les autres');
  const commandes = navigateur.steps.map((etape) => etape.run ?? '').join('\n');
  assert.match(commandes, new RegExp(`npm run test -- --grep-invert '${LENT}\\\\\\.spec' --shard=\\$\\{\\{ matrix\\.part \\}\\}/${parts.length}(\\s|$)`));
  assert.equal(navigateur.needs, 'portes', 'les parts partagent le build validé');
});

test('la navigation clavier des tableaux a ses propres parts, partagées par test', () => {
  const clavier = workflow.jobs.clavier;
  const parts = clavier.strategy?.matrix?.part ?? [];
  assert.ok(parts.length >= PARTS_MIN, `${parts.length} part(s), ${PARTS_MIN} au moins`);
  assert.equal(clavier.strategy['fail-fast'], false);
  const commandes = clavier.steps.map((etape) => etape.run ?? '').join('\n');
  assert.match(commandes, new RegExp(`npm run test -- tests/browser/${LENT}\\.spec\\.ts --shard=\\$\\{\\{ matrix\\.part \\}\\}/${parts.length}(\\s|$)`));
  assert.equal(clavier.needs, 'portes', 'les parts partagent le build validé');
  // Le contrat fullyParallel est exercé par import réel dans ci-single-build.test.mjs.
});

test('« Repository gates » échoue si une seule porte n’a pas réussi, même sautée ou annulée', () => {
  const requis = jobs.filter(([, job]) => job.name === 'Repository gates');
  assert.equal(requis.length, 1, 'un seul job porte le nom du contrôle requis');
  const [cle, agregat] = requis[0];
  const autres = jobs.map(([nom]) => nom).filter((nom) => nom !== cle).sort();
  assert.deepEqual([agregat.needs].flat().sort(), autres, 'il attend tous les autres jobs');
  // Sans `always()`, une porte en échec le ferait sauter, et GitHub compte un contrôle requis sauté comme vert.
  assert.equal(agregat.if, 'always() && github.event.pull_request.draft == false');
  const script = agregat.steps.map((etape) => etape.run ?? '').join('\n');
  for (const nom of autres) assert.match(script, new RegExp(`needs\\.${nom}\\.result \\}\\}" = success`), nom);
});

// `continue-on-error` donnerait `success` à une porte en échec : l'agrégat la croirait réussie.
test('aucune porte ni étape ne tolère son propre échec', () => {
  for (const [nom, job] of jobs) {
    assert.equal(job['continue-on-error'], undefined, nom);
    for (const etape of job.steps ?? []) assert.equal(etape['continue-on-error'], undefined, `${nom} : ${etape.name}`);
  }
});

test('chaque job tourne sur un runner GitHub, jamais sur une machine auto-hébergée', () => {
  for (const [nom, job] of jobs) assert.equal(job['runs-on'], 'ubuntu-latest', nom);
});
