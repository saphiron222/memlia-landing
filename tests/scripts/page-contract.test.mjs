import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { auditerContratPages, auditerNavigationMobile } from '../../scripts/verify-page-contract.mjs';

function html({ route, h1, media, href, ogTitle = h1, headline = h1, description }) {
  const url = `https://memlia.fr${route}`;
  return `<!doctype html><html lang="fr"><head>
    <title>${h1} | Memlia</title>
    <meta name="description" content="${description}">
    <meta name="robots" content="index, follow">
    <meta property="og:title" content="${ogTitle}">
    <link rel="canonical" href="${url}">
    <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': [
      { '@type': 'WebPage', url, name: h1, headline, description },
    ] })}</script>
  </head><body><nav aria-label="Navigation principale"><a href="/contact">Contact</a></nav>
  <main id="main"><section><h1>${h1}</h1><img src="${media}" alt="Preuve propre à ${route}"><a href="${href}">Continuer</a></section></main></body></html>`;
}

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'memlia-page-contract-'));
  for (const path of ['src/pages', 'src/components/sections', 'src/styles', 'dist', 'public/proofs', 'docs/qa/site-v2']) {
    mkdirSync(join(root, path), { recursive: true });
  }
  writeFileSync(join(root, 'src/styles/tokens.css'), ':root { --surface-feuille: #fffefb; --r-carte: 16px; }');
  writeFileSync(join(root, 'src/components/sections/TestSection.astro'), '<section><slot /></section>');
  writeFileSync(join(root, 'src/components/Nav.astro'), '<nav data-mobile-visible></nav><style>.nav-principal { min-height: 44px; } .nav-mobile-visible a { min-height: 44px; }</style>');
  writeFileSync(join(root, 'src/pages/alpha.astro'), "import TestSection from '@/components/sections/TestSection.astro';\n<TestSection />\n");
  writeFileSync(join(root, 'src/pages/source.astro'), "import TestSection from '@/components/sections/TestSection.astro';\n<TestSection />\n");
  writeFileSync(join(root, 'public/proofs/alpha.webp'), 'alpha');
  writeFileSync(join(root, 'public/proofs/source.webp'), 'source');
  writeFileSync(join(root, 'docs/qa/site-v2/proofs-manifest.json'), JSON.stringify({
    entries: [
      { source: 'docs/design/test.html#alpha', target: 'public/proofs/alpha.webp' },
      { source: 'docs/design/test.html#source', target: 'public/proofs/source.webp' },
    ],
  }));
  const pages = {
    alpha: html({ route: '/alpha', h1: 'Automatisation alpha en cabinet', media: '/proofs/alpha.webp', href: '/source', description: 'Description alpha propre et suffisamment distincte pour le contrat universel.' }),
    source: html({ route: '/source', h1: 'Automatisation source en cabinet', media: '/proofs/source.webp', href: '/alpha', description: 'Description source propre et suffisamment distincte pour le contrat universel.' }),
  };
  writeFileSync(join(root, 'dist/alpha.html'), pages.alpha);
  writeFileSync(join(root, 'dist/source.html'), pages.source);
  return { root, pages };
}

function audit(root, copyVerifier = () => ({ pass: true, errors: [] })) {
  return auditerContratPages({ root, copyVerifier, exemptions: [], intentRoutes: new Set(['/alpha', '/source']) });
}

function afficherTemoin(resultat, clause) {
  const sortie = resultat.erreurs.filter((erreur) => erreur.clause === clause).map((erreur) => erreur.message).join('\n');
  console.log(`TÉMOIN ROUGE CLAUSE ${clause}\n${sortie}`);
  return sortie;
}

test('les cinq clauses rougissent avec la page et la clause, puis la fixture restaurée repasse au vert', () => {
  const { root, pages } = fixture();
  try {
    assert.equal(audit(root).pass, true);

    writeFileSync(join(root, 'src/pages/alpha.astro'), '<main><h1>Page brute</h1></main>');
    let rouge = audit(root);
    assert.match(afficherTemoin(rouge, 1), /\/alpha : clause 1 \(DA\)/);
    writeFileSync(join(root, 'src/pages/alpha.astro'), "import TestSection from '@/components/sections/TestSection.astro';\n<TestSection />\n");

    writeFileSync(join(root, 'dist/alpha.html'), html({ route: '/alpha', h1: 'Automatisation alpha en cabinet', media: '/proofs/source.webp', href: '/source', description: 'Description alpha propre et suffisamment distincte pour le contrat universel.' }));
    rouge = audit(root);
    assert.match(afficherTemoin(rouge, 2), /\/alpha : clause 2 \(IMAGES\)/);
    writeFileSync(join(root, 'dist/alpha.html'), pages.alpha);

    writeFileSync(join(root, 'dist/alpha.html'), html({ route: '/alpha', h1: 'Automatisation alpha en cabinet', ogTitle: 'Titre divergent', media: '/proofs/alpha.webp', href: '/source', description: 'Description alpha propre et suffisamment distincte pour le contrat universel.' }));
    rouge = audit(root);
    assert.match(afficherTemoin(rouge, 3), /\/alpha : clause 3 \(SEO\).*og:title/);
    writeFileSync(join(root, 'dist/alpha.html'), pages.alpha);

    rouge = auditerContratPages({
      root,
      copyVerifier: () => ({ pass: true, errors: [] }),
      exemptions: [],
      intentRoutes: new Set(['/source']),
    });
    assert.match(afficherTemoin(rouge, 3), /\/alpha : clause 3 \(SEO\).*aucune requête mesurée/);

    rouge = audit(root, () => ({ pass: false, errors: [{ route: '/alpha', message: 'lexique public interdit' }] }));
    assert.match(afficherTemoin(rouge, 4), /\/alpha : clause 4 \(COPIE\).*lexique public interdit/);

    writeFileSync(join(root, 'dist/source.html'), html({ route: '/source', h1: 'Automatisation source en cabinet', media: '/proofs/source.webp', href: '/source', description: 'Description source propre et suffisamment distincte pour le contrat universel.' }));
    rouge = audit(root);
    assert.match(afficherTemoin(rouge, 5), /\/alpha : clause 5 \(LIENS\).*aucune page servie ne pointe vers elle/);
    writeFileSync(join(root, 'dist/source.html'), pages.source);

    const vert = audit(root);
    assert.deepEqual(vert.erreurs, []);
    assert.equal(vert.pass, true);
    assert.equal(vert.pages, 2);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('une exemption doit être exacte, datée et motivée', () => {
  const { root } = fixture();
  try {
    rmSync(join(root, 'public/proofs/alpha.webp'));
    const invalide = auditerContratPages({
      root,
      copyVerifier: () => ({ pass: true, errors: [] }),
      exemptions: [{ route: '/alpha', clauses: [2], date: 'demain', reason: 'court' }],
    });
    assert.equal(invalide.pass, false);
    assert.match(invalide.erreurs.map((e) => e.message).join('\n'), /exemption invalide/);

    const valide = auditerContratPages({
      root,
      copyVerifier: () => ({ pass: true, errors: [] }),
      intentRoutes: new Set(['/alpha', '/source']),
      exemptions: [{
        route: '/alpha', clauses: [2], date: '2026-09-20',
        reason: 'Page textuelle explicitement bornée : aucun média fonctionnel n’est nécessaire à sa compréhension.',
      }],
    });
    assert.equal(valide.pass, true);
    assert.equal(valide.exemptionsAppliquees.length, 1);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('la clause DA refuse une navigation mobile cachée ou des cibles sous 44 px', () => {
  const { root } = fixture();
  try {
    const nav = join(root, 'src/components/Nav.astro');
    writeFileSync(nav, '<nav></nav><style>.nav-principal { min-height: 32px; } .nav-mobile-visible a { min-height: 0; }</style>');
    const rouge = auditerNavigationMobile({ root });
    const sortie = rouge.errors.join('\n');
    console.log(`TÉMOIN ROUGE CLAUSE 1 MOBILE\n${sortie}`);
    assert.equal(rouge.pass, false);
    assert.match(sortie, /navigation mobile immédiatement visible absente/);
    assert.match(sortie, /32px.*44px requis/);
    assert.match(sortie, /0px.*44px requis/);

    writeFileSync(nav, '<nav data-mobile-visible></nav><style>.nav-principal { min-height: 44px; } .nav-mobile-visible a { min-height: 44px; }</style>');
    assert.deepEqual(auditerNavigationMobile({ root }), { pass: true, errors: [] });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
