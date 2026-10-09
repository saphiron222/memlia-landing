/** Réinjecte des régressions dans le build jetable ; restaure les octets même en cas d'échec. */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
const file = 'dist/index.html';
const original = readFileSync(file);
const html = original.toString();
const out = '.qa/redesign/witnesses';
mkdirSync(out, { recursive: true });
const insert = text => html.replace(/(<section[^>]*id="usages"[^>]*>)/, `$1${text}`);
const cases = [
  ['phrase', insert('<p>Exemples non contractuels, à étudier selon vos sources, règles, exceptions et accès. Ils ne décrivent pas des fonctions prêtes à installer.</p>')],
  ['annotation', insert('<small>Exemple de parcours</small>')],
  ['bento', html.replace('</head>', '<style>#usages .cartes>*{flex-basis:100%!important}</style></head>')],
  ['quinconce', html.replace('</head>', '<style>.etape:nth-child(odd) .step-copy{grid-column:1!important}.etape:nth-child(odd) .functional-proof{grid-column:2!important}</style></head>')],
];
const results = [];
try {
  for (const [name, changed] of cases) {
    assert.notEqual(changed, html);
    writeFileSync(file, changed);
    const run = spawnSync('npx', ['playwright', 'test', 'tests/browser/sections-redesign.spec.ts', '--grep', '1440'], { encoding: 'utf8', env: process.env, timeout: 60000 });
    writeFileSync(`${out}/${name}.log`, run.stdout + run.stderr);
    assert.equal(run.status, 1, `${name} doit être rejeté par le test, pas une panne du harnais`);
    assert.match(run.stdout, /1 failed/);
    results.push({ name, rejected: true });
  }
} finally { writeFileSync(file, original); }
assert.deepEqual(readFileSync(file), original);
writeFileSync(`${out}/result.json`, JSON.stringify({ results, restoredSha256: createHash('sha256').update(readFileSync(file)).digest('hex') }, null, 2));
console.log(JSON.stringify(results));
