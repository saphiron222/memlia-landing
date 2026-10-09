import test from 'node:test';
import assert from 'node:assert/strict';
import { serviceNode, withBreadcrumb } from '../../src/data/schema.mjs';
import { SITE } from '../../src/data/site.mjs';

test('un service peut décrire un autre public sans modifier le service EC', () => {
  const before = serviceNode();
  const cac = serviceNode({ audienceType: 'Cabinets de commissariat aux comptes', chemin: '/commissaires-aux-comptes', name: 'Automatisation des tâches du CAC', serviceType: 'Préparation des tâches répétitives', description: 'Le cabinet conserve le jugement.' });
  assert.equal(cac.audience.audienceType, 'Cabinets de commissariat aux comptes');
  assert.equal(cac.url, `${SITE.url}/commissaires-aux-comptes`);
  assert.equal(cac['@id'], `${cac.url}#service`);
  assert.deepEqual(serviceNode(), before);
  assert.notEqual(cac['@id'], before['@id']);
});

test('le fil de repli décrit la page et conserve les fils éditoriaux', () => {
  const page = { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Guides' };
  const graph = withBreadcrumb(page, { chemin: '/integrations', name: 'Guides' });
  const crumb = graph['@graph'].find(n => n['@type'] === 'BreadcrumbList');
  assert.equal(crumb.itemListElement.at(-1).item, `${SITE.url}/integrations`);
  assert.equal(graph['@graph'][0].breadcrumb['@id'], crumb['@id']);
  assert.deepEqual(withBreadcrumb(graph, { chemin: '/integrations', name: 'Guides' }), graph);
  assert.deepEqual(page, { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Guides' });
});

test('accueil : fil minimal ; noindex : aucun ajout', () => {
  const page = { '@type': 'WebPage' };
  assert.equal(withBreadcrumb(page, { chemin: '/', name: 'Accueil' })['@graph'][1].itemListElement.length, 1);
  assert.deepEqual(withBreadcrumb(page, { chemin: '/404', name: 'Erreur', noindex: true }), page);
});
