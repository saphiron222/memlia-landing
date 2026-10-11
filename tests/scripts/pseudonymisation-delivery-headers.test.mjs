import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const roi = '/outils-comptables-gratuits/preparer-pseudonymiser-fichier-csv-fec';
const csp = "default-src 'self'; base-uri 'self'; connect-src 'none'; font-src 'self'; form-action 'self'; frame-ancestors 'none'; img-src 'self' data: blob:; object-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'";

test('Pseudonymisation : aucune transformation edge sur la route, aucune règle globale, CSP inchangée', () => {
  const blocks = readFileSync(new URL('../../public/_headers', import.meta.url), 'utf8').trim().split(/\n\s*\n/).map(block => block.split('\n'));
  const scoped = blocks.find(([route]) => route === roi);
  assert.ok(scoped, 'une règle propre à la route Pseudonymisation doit prévenir l’injection edge');
  assert.ok(scoped.includes('  Cache-Control: public, max-age=0, must-revalidate, no-transform'));
  assert.ok(!blocks.filter(([route]) => route.includes('*')).some(block => block.some(line => line.includes('no-transform'))));
  assert.equal(blocks.find(([route]) => route === '/outils-comptables-gratuits/*')[1], `  Content-Security-Policy: ${csp}`);
});
