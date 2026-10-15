import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { auditerServiceDesign, servicesServis, servicesPublies } from '../../scripts/verify-service-design.mjs';

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'memlia-service-design-'));
  mkdirSync(join(root, 'src/content/services'), { recursive: true });
  mkdirSync(join(root, 'dist/automatisation/tache-test'), { recursive: true });
  mkdirSync(join(root, 'public/proofs/v2'), { recursive: true });
  mkdirSync(join(root, 'docs/qa/site-v2'), { recursive: true });
  writeFileSync(join(root, 'dist/automatisation-cabinet-comptable.html'), '<main data-service-catalog><a href="/automatisation/tache-test">Tâche</a></main>');
  writeFileSync(join(root, 'src/content/services/tache-test.md'), '---\nstatus: publie\n---\n');
  writeFileSync(join(root, 'public/proofs/v2/service-tache-test.webp'), 'preuve');
  writeFileSync(join(root, 'docs/qa/site-v2/proofs-manifest.json'), JSON.stringify({ entries: [{ target: 'public/proofs/v2/service-tache-test.webp' }] }));
  return root;
}

function pageComposee(preuve = 'v2/service-tache-test', liens = ['/automatisation-cabinet-comptable']) {
  const schema = JSON.stringify({ '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebPage', author: { '@id': 'https://memlia.fr/a-propos#kevin-kitanga' }, datePublished: '2026-09-20', dateModified: '2026-09-20' },
    { '@type': 'Person', '@id': 'https://memlia.fr/a-propos#kevin-kitanga', worksFor: { '@id': 'https://memlia.fr/#organization' } },
  ] });
  return `<script type="application/ld+json">${schema}</script><main data-service-layout="da-v1"><section data-service-hero class="rv in"><div data-service-media><figure data-proof="${preuve}"></figure></div><div data-service-media><figure data-proof="${preuve}"></figure></div></section><p data-page-byline>Par Kevin Kitanga · mis à jour le 20 septembre 2026</p><section data-service-sections></section><section data-service-section="couverture">Ce que votre logiciel fait déjà</section><footer>${liens.map((href) => `<a href="${href}">Tâche</a>`).join('')}</footer></main>`;
}

test('migration robots : un parcours contextuel documenté remplace le lien de grille, sans rendre les services orphelins',()=>{
 const root=fixture();
 try{
  mkdirSync(join(root,'config'),{recursive:true});
  writeFileSync(join(root,'config/service-publication-ledger.json'),JSON.stringify({catalogueMode:'robots-routines',catalogueDecision:{date:'2026-10-15',reason:'Le catalogue des routines remplace la grille des services historiques ; leurs liens contextuels publiés doivent rester présents.'}}));
  writeFileSync(join(root,'dist/automatisation/tache-test/index.html'),pageComposee().replace('<div data-service-media><figure data-proof="v2/service-tache-test"></figure></div>',''));
  writeFileSync(join(root,'dist/automatisation-cabinet-comptable.html'),'<main>Hub robots</main>');
  writeFileSync(join(root,'dist/metier.html'),'<main><a href="/automatisation/tache-test">Préparer la tâche du métier</a></main>');
  assert.equal(auditerServiceDesign({root}).pass,true);
  writeFileSync(join(root,'dist/metier.html'),'<main>Métier</main><footer><a href="/automatisation/tache-test">Tâche</a></footer>');
  assert.match(auditerServiceDesign({root}).erreurs.join('\n'),/catalogue des tâches : lien absent/);
  writeFileSync(join(root,'dist/metier.html'),'<main><a href="/automatisation/tache-test">Tâche</a></main>');
  writeFileSync(join(root,'config/service-publication-ledger.json'),'{}');
  assert.match(auditerServiceDesign({root}).erreurs.join('\n'),/catalogue des tâches : lien absent/);
 }finally{rmSync(root,{recursive:true,force:true});}
});

test('le footer donne accès au catalogue et celui-ci relie chaque tâche dans son contenu', () => {
  const root = fixture();
  try {
    const cible = join(root, 'dist/automatisation/tache-test/index.html');
    const valide = pageComposee().replace('<div data-service-media><figure data-proof="v2/service-tache-test"></figure></div>', '');
    writeFileSync(cible, valide);
    assert.equal(auditerServiceDesign({ root }).pass, true);
    writeFileSync(cible, valide.replace('href="/automatisation-cabinet-comptable"', 'href="/ailleurs"'));
    assert.match(auditerServiceDesign({ root }).erreurs.join('\n'), /lien de footer absent vers le catalogue/);
    writeFileSync(cible, valide);
    writeFileSync(join(root, 'dist/automatisation-cabinet-comptable.html'), '<main>Catalogue vide</main><footer><a href="/automatisation/tache-test">Tâche</a></footer>');
    assert.match(auditerServiceDesign({ root }).erreurs.join('\n'), /catalogue des tâches : lien absent/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('une page à plat échoue, une page composée passe', () => {
  const root = fixture();
  try {
    const cible = join(root, 'dist/automatisation/tache-test/index.html');
    writeFileSync(cible, '<main><h1>Page à plat</h1><p>Texte brut</p></main>');
    const rouge = auditerServiceDesign({ root });
    assert.equal(rouge.pass, false);
    assert.match(rouge.erreurs.join('\n'), /gabarit de direction artistique absent/);
    assert.match(rouge.erreurs.join('\n'), /0 média\(s\), 1 requis/);

    writeFileSync(cible, pageComposee().replace('<div data-service-media><figure data-proof="v2/service-tache-test"></figure></div>', ''));
    const vert = auditerServiceDesign({ root });
    assert.deepEqual(vert, { pass: true, services: 1, erreurs: [] });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('deux occurrences du même cadre sont refusées', () => {
  const root = fixture();
  try {
    writeFileSync(join(root, 'dist/automatisation/tache-test/index.html'), pageComposee());
    const rouge = auditerServiceDesign({ root });
    assert.equal(rouge.pass, false);
    assert.match(rouge.erreurs.join('\n'), /cadre répété/);
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

test('une dépublication déclarée retire seulement le service archivé du périmètre public', () => {
  const root = fixture();
  try {
    mkdirSync(join(root, 'config'), { recursive: true });
    const ledger = join(root, 'config/service-publication-ledger.json');
    const page = join(root, 'dist/automatisation/tache-test/index.html');
    // La recette reste présente, mais la route publique ne doit plus être réclamée par le garde DA.
    writeFileSync(join(root, 'src/content/services/tache-test.md'), '---\nstatus: a-valider\n---\n');
    writeFileSync(page, pageComposee());
    rmSync(page);
    writeFileSync(ledger, JSON.stringify({ services: [{ slug: 'tache-test', route: '/automatisation/tache-test', status: 'depublie' }] }));
    assert.deepEqual(servicesServis(root), []);
    assert.deepEqual(servicesPublies(root), []);
    assert.deepEqual(auditerServiceDesign({ root }), { pass: true, services: 0, erreurs: [] });

    // Retirer la décision, la rattacher à une autre identité ou remettre le service publié ne peut
    // pas masquer une page absente. Les futurs candidats a-valider gardent eux aussi le garde DA.
    for (const services of [[], [{ slug: 'autre-tache', status: 'depublie' }], [{ slug: 'tache-test', status: 'publie' }]]) {
      writeFileSync(ledger, JSON.stringify({ services }));
      assert.deepEqual(servicesServis(root), ['tache-test']);
      assert.match(auditerServiceDesign({ root }).erreurs.join('\n'), /page construite absente/);
    }
    writeFileSync(ledger, JSON.stringify({ services: [{ slug: 'tache-test', status: 'depublie' }] }));
    writeFileSync(join(root, 'src/content/services/tache-soeur.md'), '---\nstatus: a-valider\n---\n');
    assert.deepEqual(servicesServis(root), ['tache-soeur']);
    assert.match(auditerServiceDesign({ root }).erreurs.join('\n'), /tache-soeur : page construite absente/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('une page sans bloc de couverture ou Person reliée échoue la porte de confiance', () => {
  const root = fixture();
  try {
    const cible = join(root, 'dist/automatisation/tache-test/index.html');
    const sansConfiance = pageComposee()
      .replace(' data-service-section="couverture"', '')
      .replace('"@type":"Person"', '"@type":"Thing"')
      .replace('"worksFor":{"@id":"https://memlia.fr/#organization"}', '"worksFor":null');
    writeFileSync(cible, sansConfiance);
    const rouge = auditerServiceDesign({ root });
    assert.equal(rouge.pass, false);
    assert.match(rouge.erreurs.join('\n'), /bloc de couverture des logiciels absent/);
    assert.match(rouge.erreurs.join('\n'), /nœud Person absent/);
    assert.match(rouge.erreurs.join('\n'), /Person non reliée à Organization/);
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
