import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { parse, serializeOuter } from 'parse5';

const sections = { Hero: 'hero', Orientation: 'orientation', Quotidien: 'quotidien', Promesse: 'promesse', Usages: 'usages', Methode: 'methode', Integration: 'integration', Preuves: 'preuves', Garanties: 'garanties', Faq: 'faq', AppelFinal: 'appelFinal' };
function find(node, id) {
  if (node.attrs?.some(a => a.name === 'id' && a.value === id)) return node;
  for (const child of node.childNodes ?? []) { const found = find(child, id); if (found) return found; }
}

// Témoin main 4f42a88b : le chrome v3 est testé à part ; le contenu EC reste inchangé.
test('le contenu de / conserve le témoin EC hors lien d’orientation CAC', () => {
  const expected = 'e7e06c672844aa08566b59e6e8558dab59dbc7d9dd8227d3963dcdf1d129bf55';
  const html = readFileSync('dist/index.html', 'utf8');
  // Ajout volontaire du service publié dans le footer généré : le reste ne change pas.
  const link = /<li[^>]*><a[^>]*href="\/automatisation\/entrees-sorties-salaries"[^>]*>.*?<\/a><\/li>/g;
  assert.equal([...html.matchAll(link)].length, 1);
  const main = find(parse(html), 'main');
  assert.ok(main);
  const removeAudience = (node) => {
    node.childNodes = (node.childNodes ?? []).filter(child => !child.attrs?.some(a => a.name === 'data-accueil-cac'));
    node.childNodes.forEach(removeAudience);
  };
  removeAudience(main);
  assert.equal(createHash('sha256').update(serializeOuter(main).replace(/\s+/g, ' ')).digest('hex'), expected);
});

test('un vrai build Astro rend les onze sections avec le contenu fourni', { timeout: 120_000 }, () => {
  mkdirSync('.qa', { recursive: true });
  const dir = mkdtempSync(resolve('.qa/accueil-render-'));
  const src = resolve('src');
  try {
    mkdirSync(join(dir, 'src/pages'), { recursive: true });
    writeFileSync(join(dir, 'astro.config.mjs'), `import { defineConfig } from 'astro/config';\nexport default defineConfig({ vite: { resolve: { alias: { '@': ${JSON.stringify(src)} } } } });\n`);
    const imports = Object.keys(sections).map(name => `import ${name} from ${JSON.stringify(`${src}/components/sections/${name}.astro`)};`).join('\n');
    const cases = Object.entries(sections).map(([name, key]) => `<div id="default-${name}"><${name} /></div>\n<div id="explicit-${name}"><${name} contenu={ec.${key}} /></div>\n<div id="custom-${name}"><${name} contenu={{ ...ec.${key}, titre: ${JSON.stringify(`Texte fictif de contrôle ${name}`)} }} /></div>`).join('\n');
    writeFileSync(join(dir, 'src/pages/index.astro'), `---\n${imports}\nimport { contenuDe } from ${JSON.stringify(`${src}/data/accueil/contenu`)};\nimport assert from 'node:assert/strict';\nconst ec = contenuDe('ec');\nassert.throws(() => contenuDe('cac'), /indisponible/);\nassert.throws(() => contenuDe('inconnue' as never), /indisponible/);\n---\n<html><head></head><body>${cases}\n<div id="faq-override"><Faq contenu={{ ...ec.faq, questions: [{id: 'fictif', question: 'Question fictive injectée ?', reponse: 'Réponse fictive injectée.'}] }} /></div>\n<div id="appel-priority"><AppelFinal contenu={{ ...ec.appelFinal, titre: 'Titre fourni par audience' }} titre="Priorité au titre de la page" /></div></body></html>`);
    const bin = JSON.parse(readFileSync('node_modules/astro/package.json', 'utf8')).bin.astro;
    const result = spawnSync(process.execPath, [resolve('node_modules/astro', bin), 'build', '--root', dir], { cwd: dir, encoding: 'utf8', timeout: 110_000, env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' } });
    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
    const document = parse(readFileSync(join(dir, 'dist/index.html'), 'utf8'));
    for (const name of Object.keys(sections)) {
      const defaultNode = find(document, `default-${name}`);
      const explicitNode = find(document, `explicit-${name}`);
      // Astro émet les scripts partagés une fois, y compris dans les preuves imbriquées.
      const content = node => {
        const copy = parse(serializeOuter(node));
        const removeScripts = parent => {
          parent.childNodes = (parent.childNodes ?? []).filter(child => child.tagName !== 'script');
          parent.childNodes.forEach(removeScripts);
        };
        removeScripts(copy);
        return find(copy, node.attrs.find(a => a.name === 'id').value).childNodes.map(serializeOuter).join('');
      };
      assert.equal(content(defaultNode), content(explicitNode), `${name} : défaut = EC explicite`);
      const custom = content(find(document, `custom-${name}`));
      assert.ok(custom.includes(`Texte fictif de contrôle ${name}`), name);
      const originalTitle = content(defaultNode).match(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/)?.[1].trim();
      assert.ok(originalTitle && !custom.includes(originalTitle), `${name} : aucun titre EC résiduel`);
    }
    const faq = serializeOuter(find(document, 'faq-override'));
    assert.ok(faq.includes('faq-fictif'));
    assert.ok(faq.includes('Réponse fictive injectée.'));
    assert.ok(!faq.includes('Memlia est-il un logiciel à paramétrer seul'));
    const appel = serializeOuter(find(document, 'appel-priority'));
    assert.ok(appel.includes('Priorité au titre de la page'));
    assert.ok(!appel.includes('Titre fourni par audience'));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
