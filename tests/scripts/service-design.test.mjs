import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { auditerServiceDesign } from '../../scripts/verify-service-design.mjs';

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'memlia-service-design-'));
  mkdirSync(join(root, 'src/content/services'), { recursive: true });
  mkdirSync(join(root, 'dist/automatisation/tache-test'), { recursive: true });
  writeFileSync(join(root, 'src/content/services/tache-test.md'), '---\nstatus: publie\n---\n');
  return root;
}

test('une page à plat échoue, une page composée passe', () => {
  const root = fixture();
  try {
    const cible = join(root, 'dist/automatisation/tache-test/index.html');
    writeFileSync(cible, '<main><h1>Page à plat</h1><p>Texte brut</p></main>');
    const rouge = auditerServiceDesign({ root });
    assert.equal(rouge.pass, false);
    assert.match(rouge.erreurs.join('\n'), /gabarit de direction artistique absent/);
    assert.match(rouge.erreurs.join('\n'), /0 média\(s\), 2 requis/);

    writeFileSync(cible, '<main data-service-layout="da-v1"><section data-service-hero class="rv in"><div data-service-media></div><div data-service-media></div></section><section data-service-sections></section><footer><a href="/automatisation/tache-test">Tâche</a></footer></main>');
    const vert = auditerServiceDesign({ root });
    assert.deepEqual(vert, { pass: true, services: 1, erreurs: [] });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('une future page non publiée ne peut pas contourner la porte DA', () => {
  const root = fixture();
  try {
    writeFileSync(join(root, 'src/content/services/tache-test.md'), '---\nstatus: a-valider\n---\n');
    writeFileSync(join(root, 'dist/automatisation/tache-test/index.html'), '<main><h1>Page à plat</h1></main>');
    const resultat = auditerServiceDesign({ root });
    assert.equal(resultat.services, 1);
    assert.equal(resultat.pass, false);
    assert.match(resultat.erreurs.join('\n'), /hero éditorial absent/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
