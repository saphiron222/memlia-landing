import test from 'node:test';
import assert from 'node:assert/strict';
import { renderLlmsInventory } from '../../scripts/lib/llms-inventory.mjs';

const page = (path, title, nodes = []) => ({ url: `https://memlia.fr${path}`, html: `<html><head><meta name="description" content="Préparation et validation humaine."><script type="application/ld+json">${JSON.stringify({ '@graph': nodes })}</script></head><main><h1>${title}</h1></main></html>` });
const inventory = () => [page('/glossaire', 'Glossaire', [{ '@type': 'DefinedTermSet', hasDefinedTerm: [{}, {}] }]), page('/integrations', 'Guides'), page('/integrations/fictif', 'Guide fictif'), page('/outils-comptables-gratuits', 'Outils'), page('/outils-comptables-gratuits/fictif', 'Outil fictif'), page('/blog', 'Blog'), page('/blog/fictif', 'Article', [{ '@type': 'BlogPosting' }]), page('/automatisation/fictif', 'Service fictif'), page('/commissaires-aux-comptes', 'CAC')];
const template = '# Memlia\n- [Glossaire](https://memlia.fr/glossaire) : définitions du vocabulaire de cabinet.\n- [CAC](https://memlia.fr/commissaires-aux-comptes) : sélection des tiers, écarts de confirmation et rapprochements. Votre équipe garde ses contrôles et son jugement.\n';

test('compte la sortie des inventaires canoniques et conserve la description CAC', () => {
  const result = renderLlmsInventory(template, inventory());
  assert.match(result, /2 définitions/);
  assert.match(result, /1 guides, 1 articles, 1 outils et 1 services/);
  assert.match(result, /\[Service fictif\]\(https:\/\/memlia.fr\/automatisation\/fictif\)/);
  assert.ok(result.includes(template.split('\n')[2]));
  assert.doesNotMatch(result, /candidat/);
  assert.equal(renderLlmsInventory(result, inventory()), result);
});

test('un ajout fictif suit les données sans plafond ni compteur recopié', () => {
  const pages = inventory();
  pages[0] = page('/glossaire', 'Glossaire', [{ '@type': 'DefinedTermSet', hasDefinedTerm: [{}, {}, {}] }]);
  pages.push(page('/automatisation/nouveau', 'Nouveau service'));
  const result = renderLlmsInventory(template, pages);
  assert.match(result, /3 définitions/);
  assert.match(result, /2 services/);
  assert.ok(result.includes('https://memlia.fr/automatisation/nouveau'));
});

test('refuse une route candidate ou un glossaire sans inventaire rendu', () => {
  assert.throws(() => renderLlmsInventory(`${template}- [Absent](https://memlia.fr/automatisation/candidat)\n`, inventory()), /absent/);
  assert.throws(() => renderLlmsInventory(template, inventory().map(p => p.url.endsWith('/glossaire') ? page('/glossaire', 'Glossaire') : p)), /DefinedTermSet/);
});
