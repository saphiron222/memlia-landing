import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const robots = readFileSync(new URL('../../public/robots.txt', import.meta.url), 'utf8');
const groups = [...robots.matchAll(/^User-agent: (.+)\n([\s\S]*?)(?=^User-agent: |$(?![\s\S]))/gm)]
  .map(([, agent, body]) => ({ agent, lines: body.split('\n').filter((line) => line && !line.startsWith('#')) }));
const signal = 'Content-Signal: search=yes, ai-input=yes, ai-train=yes';

test('chaque groupe autorisé déclare ses propres Content Signals, sans héritage de *', () => {
  assert.deepEqual(groups.map(({ agent }) => agent), [
    '*', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Perplexity-User',
    'Claude-SearchBot', 'Claude-User', 'Bytespider',
  ]);
  for (const { agent, lines } of groups.filter(({ agent }) => agent !== 'Bytespider')) {
    assert.ok(lines.includes('Allow: /'), `${agent} reste autorisé`);
    assert.equal(lines.filter((line) => line.startsWith('Content-Signal:')).length, 1, agent);
    assert.ok(lines.includes(signal), `${agent} déclare les trois usages autorisés`);
    assert.ok(!lines.includes('Disallow: /'), agent);
  }
});

test('Bytespider reste bloqué sans déclaration positive de Content Signals', () => {
  const { lines } = groups.find(({ agent }) => agent === 'Bytespider');
  assert.ok(lines.includes('Disallow: /'));
  assert.ok(!lines.some((line) => line.startsWith('Allow:') || line.startsWith('Content-Signal:')));
  assert.match(robots, /^Sitemap: https:\/\/memlia\.fr\/sitemap\.xml$/m);
});

test('l’accueil expose llms.txt via Link sans étendre la règle aux autres routes', () => {
  const headers = readFileSync(new URL('../../public/_headers', import.meta.url), 'utf8');
  const blocks = headers.trim().split(/\n\s*\n/);
  const home = blocks.filter((block) => block.split('\n')[0] === '/');
  assert.equal(home.length, 1);
  assert.ok(home[0].split('\n').includes('  Link: </llms.txt>; rel="describedby"; type="text/plain"'));
  assert.equal(blocks.filter((block) => /\n\s+Link:/.test(block)).length, 1);
  assert.ok(readFileSync(new URL('../../public/llms.txt', import.meta.url), 'utf8').length > 0);
});
