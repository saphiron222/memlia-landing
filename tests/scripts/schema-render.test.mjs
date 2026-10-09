import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory()
    ? htmlFiles(join(dir, entry.name)) : entry.name.endsWith('.html') ? [join(dir, entry.name)] : []);
}

for (const file of htmlFiles('dist')) {
  const html = readFileSync(file, 'utf8');
  if (/<meta[^>]+name="robots"[^>]+content="noindex/.test(html)) continue;
  test(`JSON-LD indexable : ${file}`, () => {
    const blocks = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map(match => JSON.parse(match[1]));
    assert.ok(blocks.length);
    assert.ok(blocks.every(block => block['@context'] === 'https://schema.org'));
    const nodes = blocks.flatMap(block => block['@graph'] ?? [block]);
    const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/)[1];
    const crumbs = nodes.filter(node => node['@type'] === 'BreadcrumbList');
    assert.equal(crumbs.length, 1);
    assert.ok(crumbs[0].itemListElement.length > 0);
    crumbs[0].itemListElement.forEach((item, i) => {
      assert.equal(item['@type'], 'ListItem');
      assert.equal(item.position, i + 1);
      assert.ok(item.name.trim());
      assert.match(item.item, /^https:\/\//);
    });
    assert.equal(crumbs[0].itemListElement.at(-1).item, canonical);
    const services = nodes.filter(node => node['@type'] === 'Service');
    assert.ok(services.length <= 1);
    for (const node of services) {
      assert.ok(node.name && node.description && node.serviceType);
      assert.match(node.url, /^https:\/\//);
      assert.equal(node.audience['@type'], 'Audience');
      assert.ok(node.audience.audienceType.trim());
    }
    if (file.includes('/outils-comptables-gratuits/')) {
      const apps = nodes.filter(node => node['@type'] === 'WebApplication');
      assert.equal(apps.length, 1);
      assert.equal(apps[0].url, canonical);
      assert.equal(apps[0].isAccessibleForFree, true);
      assert.ok(apps[0].name && apps[0].description && apps[0].operatingSystem);
    }
  });
}
