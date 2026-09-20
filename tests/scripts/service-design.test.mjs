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
  mkdirSync(join(root, 'public/proofs/v2'), { recursive: true });
  mkdirSync(join(root, 'docs/qa/site-v2'), { recursive: true });
  writeFileSync(join(root, 'src/content/services/tache-test.md'), '---\nstatus: publie\n---\n');
  writeFileSync(join(root, 'public/proofs/v2/service-tache-test.webp'), 'preuve');
  writeFileSync(join(root, 'docs/qa/site-v2/proofs-manifest.json'), JSON.stringify({ entries: [{ target: 'public/proofs/v2/service-tache-test.webp' }] }));
  return root;
}

function pageComposee(preuve = 'v2/service-tache-test', liens = ['/automatisation/tache-test']) {
  return `<main data-service-layout="da-v1"><section data-service-hero class="rv in"><div data-service-media><figure data-proof="${preuve}"></figure></div><div data-service-media><figure data-proof="${preuve}"></figure></div></section><section data-service-sections></section><footer>${liens.map((href) => `<a href="${href}">Tâche</a>`).join('')}</footer></main>`;
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

    writeFileSync(cible, pageComposee());
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

test('un média partagé par deux pages échoue en nommant les deux routes', () => {
  const root = fixture();
  try {
    mkdirSync(join(root, 'dist/automatisation/tache-soeur'), { recursive: true });
    writeFileSync(join(root, 'src/content/services/tache-soeur.md'), '---\nstatus: publie\n---\n');
    const liens = ['/automatisation/tache-test', '/automatisation/tache-soeur'];
    writeFileSync(join(root, 'dist/automatisation/tache-test/index.html'), pageComposee('v2/service-tache-test', liens));
    writeFileSync(join(root, 'dist/automatisation/tache-soeur/index.html'), pageComposee('v2/service-tache-test', liens));

    const rouge = auditerServiceDesign({ root });
    assert.equal(rouge.pass, false);
    assert.match(rouge.erreurs.join('\n'), /média v2\/service-tache-test partagé entre \/automatisation\/tache-soeur et \/automatisation\/tache-test|média v2\/service-tache-test partagé entre \/automatisation\/tache-test et \/automatisation\/tache-soeur/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('une page sans recette scellée échoue', () => {
  const root = fixture();
  try {
    writeFileSync(join(root, 'dist/automatisation/tache-test/index.html'), pageComposee('v2/inconnue'));
    const rouge = auditerServiceDesign({ root });
    assert.equal(rouge.pass, false);
    assert.match(rouge.erreurs.join('\n'), /média rendu absent pour v2\/inconnue/);
    assert.match(rouge.erreurs.join('\n'), /recette scellée absente pour v2\/inconnue/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
