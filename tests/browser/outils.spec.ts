import { test, expect, type Page } from '@playwright/test';
import { OUTILS_DISPONIBLES, outilPath } from '../../src/data/outils';

const HUB = '/outils-comptables-gratuits';
const TEMOIN = `${HUB}/temoin-calcul-local`;
const H1_HUB = 'Outils comptables gratuits : calculer et vérifier';
const H1_TEMOIN = 'Témoin de calcul local';

async function graphFrom(page: Page) {
  const payloads = await page.locator('script[type="application/ld+json"]').allTextContents();
  return payloads.map((text) => JSON.parse(text)).find((payload) => Array.isArray(payload['@graph']))?.['@graph'] ?? [];
}

test('hub : quatre outils disponibles et schéma de collection', async ({ page }) => {
  const response = await page.goto(HUB);
  expect(response?.status()).toBe(200);
  await expect(page.locator('main h1')).toHaveText(H1_HUB);
  await expect(page.locator('main h1')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://memlia.fr${HUB}`);
  await expect(page.locator('[data-outil-card]')).toHaveCount(4);
  await expect(page.locator('[data-empty-category]')).toHaveCount(0);
  await expect(page.locator('[data-tool-media]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', '/proofs/v2/og/24-outils-hub.webp');
  await expect(page.locator(`a[href="${TEMOIN}"]`)).toHaveCount(0);


  const graph = await graphFrom(page);
  expect(graph.map((node: { '@type': string }) => node['@type'])).toEqual([
    'CollectionPage', 'ItemList', 'BreadcrumbList',
  ]);
  expect(graph.find((node: { '@type': string }) => node['@type'] === 'CollectionPage').headline).toBe(H1_HUB);
  expect(graph.find((node: { '@type': string }) => node['@type'] === 'ItemList').itemListElement).toHaveLength(4);
});

test('footer : le hub et les outils publiés sont générés, le témoin reste absent', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator(`footer a[href="${HUB}"]`)).toHaveCount(1);
  for (const outil of OUTILS_DISPONIBLES) {
    await expect(page.locator(`footer a[href="${outilPath(outil)}"]`)).toHaveCount(1);
  }
  await expect(page.locator(`footer a[href="${TEMOIN}"]`)).toHaveCount(0);
});

test('marge : calcul exact, marge négative et refus visibles', async ({ page }) => {
  await page.goto(`${HUB}/calculateur-marge-commerciale`);
  await page.getByLabel('Prix d’achat HT').fill('80,00');
  await page.getByLabel('Prix de vente HT').fill('100,00');
  await page.getByRole('button', { name: 'Calculer la marge' }).click();
  await expect(page.locator('[data-margin]')).toHaveText('20,00 €');
  await expect(page.locator('[data-rate-margin]')).toHaveText('25,00 %');
  await expect(page.locator('[data-rate-mark]')).toHaveText('20,00 %');
  await page.getByLabel('Prix d’achat HT').fill('100,00');
  await page.getByLabel('Prix de vente HT').fill('80,00');
  await page.getByRole('button', { name: 'Calculer la marge' }).click();
  await expect(page.locator('[data-margin]')).toHaveText('-20,00 €');
  await expect(page.locator('[data-rate-margin]')).toHaveText('-20,00 %');
  await expect(page.locator('[data-rate-mark]')).toHaveText('-25,00 %');
  await page.getByLabel('Prix d’achat HT').fill('0');
  await page.getByRole('button', { name: 'Calculer la marge' }).click();
  await expect(page.locator('[data-error]')).toContainText('supérieurs à zéro');
});

test('échéance : les deux conventions divergent et l’absence de convention est refusée', async ({ page }) => {
  await page.goto(`${HUB}/calculateur-date-echeance-facture`);
  await page.getByLabel('Règle générale').selectOption('eom45');
  await page.getByLabel('Date de facture', { exact: true }).fill('2026-01-20');
  await page.getByLabel(/Je confirme/).check();
  await page.getByRole('button', { name: 'Calculer l’échéance' }).click();
  await expect(page.locator('[data-error]')).toContainText('choisissez explicitement');
  await page.getByLabel(/Ajouter 45 jours/).check();
  await page.getByRole('button', { name: 'Calculer l’échéance' }).click();
  await expect(page.locator('[data-result]')).toContainText('31 mars 2026');
  await page.getByLabel(/Aller à la fin du mois/).check();
  await page.getByRole('button', { name: 'Calculer l’échéance' }).click();
  await expect(page.locator('[data-result]')).toContainText('17 mars 2026');
  await page.getByLabel('Règle générale').selectOption('default30');
  await page.getByLabel('Date de réception ou d’exécution', { exact: true }).fill('2026-02-01');
  await page.getByRole('button', { name: 'Calculer l’échéance' }).click();
  await expect(page.locator('[data-result]')).toContainText('03 mars 2026');
  await page.getByLabel('Règle générale').selectOption('invoice60');
  await page.getByLabel('Date de facture', { exact: true }).fill('2026-01-20');
  await page.getByRole('button', { name: 'Calculer l’échéance' }).click();
  await expect(page.locator('[data-result]')).toContainText('21 mars 2026');
});

test('amortissement : plan linéaire tracé, dégressif confirmé et entrées incohérentes refusées', async ({ page }) => {
  await page.goto(`${HUB}/calculateur-amortissement-comptable`);
  const result = page.locator('[data-amortization-result]');
  const confirmation = page.locator('[data-declining-confirmation]');
  const value = page.getByLabel('Valeur amortissable');
  const duration = page.getByLabel('Durée d’utilisation');
  const resultTitle = page.locator('#amortissement-resultat-titre');

  await expect(result).toBeHidden();
  await expect(confirmation).toBeHidden();
  await page.getByLabel('Valeur amortissable').fill('10000');
  await page.getByLabel('Date de mise en service').fill('2026-04-01');
  await duration.fill('5');
  await page.getByLabel('Méthode').selectOption('linear');
  await expect(confirmation).toBeHidden();
  await page.getByRole('button', { name: 'Calculer le plan' }).click();
  await expect(result).toBeVisible();
  await expect(resultTitle).toBeFocused();
  await expect(page.locator('[data-result-method]')).toHaveText('Linéaire comptable');
  await expect(page.locator('[data-result-rate]')).toHaveText('20,00 %');
  await expect(page.locator('[data-result-rows] tr').first()).toContainText('275/365');
  await expect(page.locator('[data-result-rows] tr').first()).toContainText('1 506,85 €');
  await expect(page.locator('[data-result-total]')).toHaveText('10 000,00 €');
  await expect(page.locator('[data-result-rows] tr')).toHaveCount(6);

  await duration.fill('0');
  await page.getByRole('button', { name: 'Calculer le plan' }).click();
  await expect(result).toBeHidden();
  await expect(page.locator('[data-error]')).toContainText('compris entre 1 et 50 ans');
  await expect(duration).toHaveAttribute('aria-invalid', 'true');
  await expect(duration).toHaveAttribute('aria-describedby', /amortissement-erreur/);
  await expect(duration).toBeFocused();

  for (const subCent of ['0.001', '0.004']) {
    await value.fill(subCent);
    await duration.fill('5');
    await page.getByRole('button', { name: 'Calculer le plan' }).click();
    await expect(result).toBeHidden();
    await expect(page.locator('[data-error]')).toContainText('centime');
    await expect(value).toBeFocused();
  }

  await value.fill('0.01');
  await page.getByRole('button', { name: 'Calculer le plan' }).click();
  await expect(result).toBeVisible();
  await expect(page.locator('[data-result-total]')).toHaveText('0,01 €');
  await expect(resultTitle).toBeFocused();

  await value.fill('10000');
  await page.getByLabel('Méthode').selectOption('declining');
  await expect(confirmation).toBeVisible();
  await page.getByRole('button', { name: 'Calculer le plan' }).click();
  await expect(result).toBeHidden();
  await expect(page.locator('[data-error]')).toContainText('éligibilité du bien');
  await expect(page.getByLabel(/Je confirme avoir vérifié/)).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel(/Je confirme avoir vérifié/)).toHaveAttribute('aria-describedby', 'amortissement-erreur');
  await expect(page.getByLabel(/Je confirme avoir vérifié/)).toBeFocused();
  await page.getByLabel(/Je confirme avoir vérifié/).check();
  await page.getByRole('button', { name: 'Calculer le plan' }).click();
  await expect(result).toBeVisible();
  await expect(resultTitle).toBeFocused();
  await expect(page.locator('[data-result-method]')).toHaveText('Dégressif fiscal');
  await expect(page.locator('[data-result-coefficient]')).toHaveText('1,75');
  await expect(page.locator('[data-result-rows] tr').first()).toContainText('2 625,00 €');
  await expect(page.locator('[data-result-total]')).toHaveText('10 000,00 €');
});

test('rapprochement : CSV exact et refus d’une différence', async ({ page }) => {
  await page.addInitScript(() => {
    const original = URL.revokeObjectURL.bind(URL);
    (window as unknown as { revokedUrls?: string[] }).revokedUrls = [];
    URL.revokeObjectURL = (url) => { (window as unknown as { revokedUrls: string[] }).revokedUrls.push(url); original(url); };
  });
  await page.goto(`${HUB}/modele-rapprochement-bancaire-excel-gratuit`);
  await page.getByLabel('Début de période').fill('2026-01-01'); await page.getByLabel('Fin de période').fill('2026-01-31');
  await page.getByLabel('Solde du relevé bancaire').fill('1000'); await page.getByLabel('Solde du compte 512').fill('950');
  await page.getByLabel('Frais bancaires à comptabiliser').fill('0'); await page.getByLabel('Intérêts à comptabiliser').fill('50');
  await page.getByRole('button', { name: 'Contrôler les soldes' }).click();
  await expect(page.locator('[data-difference]')).toHaveText('0,00 €');
  const download = page.waitForEvent('download'); await page.getByRole('button', { name: /Télécharger le CSV/ }).click();
  const downloaded = await download;
  expect(downloaded.suggestedFilename()).toBe('modele-rapprochement-bancaire-fictif.csv');
  const bytes = await (await import('node:fs/promises')).readFile(await downloaded.path() as string);
  expect(bytes.subarray(0, 3).toString('hex')).toBe('efbbbf');
  expect(bytes.toString('utf8')).toContain('CSV UTF-8 BOM, séparateur point-virgule, ouvrable dans Excel');
  expect(bytes.toString('utf8')).toContain('LIGNES EN CIRCULATION À DÉTAILLER');
  expect(bytes.toString('utf8')).toContain('À valider par le collaborateur — aucune écriture produite');
  await expect.poll(() => page.evaluate(() => (window as unknown as { revokedUrls?: string[] }).revokedUrls?.length ?? 0)).toBe(1);
  await page.getByLabel('Intérêts à comptabiliser').fill('0'); await page.getByRole('button', { name: 'Contrôler les soldes' }).click();
  await expect(page.locator('[data-error]')).toContainText('ne concordent pas');
  await expect(page.getByRole('button', { name: /Télécharger le CSV/ })).toBeDisabled();
});

test('contrat de liens : le registre borne les outils publiés et leurs sorties', async ({ page }) => {
  await page.goto(HUB);
  await expect(page.locator('[data-outil-card]')).toHaveCount(OUTILS_DISPONIBLES.length);

  for (const outil of OUTILS_DISPONIBLES) {
    const path = outilPath(outil);
    await page.goto(HUB);
    await expect(page.locator(`main a[href="${path}"]`)).toHaveCount(1);
    await page.goto(path);
    const expectedLinks = [HUB, ...(outil.articleExact ? [outil.articleExact] : []), outil.pageService, outil.cta];
    expect(await page.locator('[data-tool-links] a').evaluateAll((links) => links.map((link) => link.getAttribute('href')))).toEqual(expectedLinks);
    await expect(page.locator('[data-tool-links] a[href="/contact"]')).toHaveCount(1);
    await expect(page.locator('[data-tool-links] a[href^="/contact?"]')).toHaveCount(0);
  }
});

test('outils publiés : métadonnées, source datée et schémas concordent', async ({ page }) => {
  for (const outil of OUTILS_DISPONIBLES) {
    const path = outilPath(outil);
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('main h1')).toHaveText(outil.h1);
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', outil.h1);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', outil.h1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://memlia.fr${path}`);
    await expect(page.locator('[data-official-source]')).toContainText(
      new RegExp(`vérifiée le ${outil.source.verifieeLe}`, 'i'),
    );
    await expect(page.locator(`[data-official-source] a[href="${outil.source.url}"]`)).toHaveCount(1);
    await expect(page.getByRole('heading', { name: 'Ce que cette page ne fait pas' })).toBeVisible();
    await expect(page.locator(`[data-proof="${outil.proof}"] img`)).toBeVisible();
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', `/proofs/v2/og/${outil.proof?.slice(3)}.webp`);
    await expect(page.locator('[data-tool-section]')).toHaveCount(8);
    await expect(page.locator('[data-tool-section="garanties"]')).toBeVisible();
    await expect(page.locator('[data-tool-section="faq"] details')).toHaveCount(2);
    await expect(page.getByRole('link', { name: 'Confier une première tâche' })).toHaveCount(3);
    const graph = await graphFrom(page);
    expect(graph.map((node: { '@type': string }) => node['@type'])).toEqual(['WebPage', 'WebApplication', 'BreadcrumbList']);
    expect(graph.find((node: { '@type': string }) => node['@type'] === 'WebPage').headline).toBe(outil.h1);
    expect(graph.find((node: { '@type': string }) => node['@type'] === 'WebApplication').name).toBe(outil.h1);
  }
});

test('outils et services : les entrées respectent la préférence de mouvement réduit', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const route of [
    `${HUB}/calculateur-marge-commerciale`,
    '/automatisation/paie',
  ]) {
    await page.goto(route);
    const animated = page.locator(route.startsWith(HUB)
      ? '.outil-hero-copy h1, .outil-hero-copy p, .outil-hero-visual'
      : '.service-hero-copy h1, .service-hero-label, .service-hero-lead, .service-hero-action, .service-hero-visual');
    const count = await animated.count();
    expect(await animated.evaluateAll((elements) => elements.map((element) => getComputedStyle(element).animationName))).toEqual(
      Array(count).fill('none'),
    );
  }
});

test('maillage entrant : trois contextes rendus par outil, dont le hub et une ressource exacte', async ({ page }) => {
  const referrers = new Map<string, string[]>([
    [`${HUB}/calculateur-marge-commerciale`, [HUB, '/methode', '/automatisation-cabinet-comptable']],
    [`${HUB}/calculateur-date-echeance-facture`, [HUB, '/methode', '/automatisation/factures-fournisseurs']],
    [`${HUB}/calculateur-amortissement-comptable`, [HUB, '/methode', '/automatisation-cabinet-comptable']],
    [`${HUB}/modele-rapprochement-bancaire-excel-gratuit`, [HUB, '/methode', '/automatisation/rapprochement-bancaire']],
  ]);
  for (const [tool, routes] of referrers) {
    expect(routes).toHaveLength(3);
    for (const route of routes) {
      const [pathname, hash] = route.split('#');
      await page.goto(pathname);
      const scope = hash ? page.locator(`#${hash}`) : page.locator('main');
      await expect(scope.locator(`a[href="${tool}"]`)).toBeVisible();
    }
  }
});

test('outils publiés : zéro requête et zéro stockage après armement', async ({ page }) => {
  for (const outil of OUTILS_DISPONIBLES) {
    const requests: string[] = [];
    let armed = false;
    const listener = (request: { method(): string; url(): string }) => { if (armed) requests.push(`${request.method()} ${request.url()}`); };
    page.on('request', listener);
    await page.goto(outilPath(outil));
    await page.evaluate(() => document.fonts.ready);
    await page.waitForLoadState('networkidle');
    armed = true;
    if (outil.slug === 'calculateur-marge-commerciale') {
      await page.getByLabel('Prix d’achat HT').fill('80');
      await page.getByLabel('Prix de vente HT').fill('100');
      await page.getByRole('button', { name: 'Calculer la marge' }).click();
      await expect(page.locator('[data-margin]')).toHaveText('20,00 €');
    } else if (outil.slug === 'calculateur-date-echeance-facture') {
      await page.getByLabel('Règle générale').selectOption('invoice60');
      await page.getByLabel('Date de facture', { exact: true }).fill('2026-01-20');
      await page.getByLabel(/Je confirme/).check();
      await page.getByRole('button', { name: 'Calculer l’échéance' }).click();
      await expect(page.locator('[data-result]')).toContainText('21 mars 2026');
    } else if (outil.slug === 'calculateur-amortissement-comptable') {
      await page.getByLabel('Valeur amortissable').fill('10000');
      await page.getByLabel('Date de mise en service').fill('2026-04-01');
      await page.getByLabel('Durée d’utilisation').fill('5');
      await page.getByRole('button', { name: 'Calculer le plan' }).click();
      await expect(page.locator('[data-result-total]')).toHaveText('10 000,00 €');
    } else {
      await page.getByLabel('Début de période').fill('2026-01-01');
      await page.getByLabel('Fin de période').fill('2026-01-31');
      await page.getByLabel('Solde du relevé bancaire').fill('1000');
      await page.getByLabel('Solde du compte 512').fill('1000');
      await page.getByRole('button', { name: 'Contrôler les soldes' }).click();
      await expect(page.locator('[data-difference]')).toHaveText('0,00 €');
    }
    expect(await page.evaluate(async () => ({
      localStorage: localStorage.length,
      sessionStorage: sessionStorage.length,
      indexedDB: (await indexedDB.databases()).length,
    }))).toEqual({ localStorage: 0, sessionStorage: 0, indexedDB: 0 });
    expect(requests).toEqual([]);
    page.off('request', listener);
  }
});

test('témoin : noindex, CSP, quatre surfaces et liens sortants concordants', async ({ page }) => {
  const response = await page.goto(TEMOIN);
  expect(response?.status()).toBe(200);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  await expect(page.locator('meta[http-equiv="Content-Security-Policy"]')).toHaveAttribute('content', /connect-src 'none'/);
  await expect(page.locator('main h1')).toHaveText(H1_TEMOIN);
  await expect(page.locator('main h1')).toHaveCount(1);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', H1_TEMOIN);
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', H1_TEMOIN);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://memlia.fr${TEMOIN}`);
  await expect(page.getByText('Démonstration technique', { exact: true })).toBeVisible();
  await expect(page.locator('[data-local-notice]')).toContainText('aucune valeur n’est envoyée ni conservée');
  await expect(page.locator('.ariane [aria-current="page"]')).toHaveText(H1_TEMOIN);

  const graph = await graphFrom(page);
  expect(graph.map((node: { '@type': string }) => node['@type'])).toEqual([
    'WebPage', 'WebApplication', 'BreadcrumbList',
  ]);
  expect(graph.find((node: { '@type': string }) => node['@type'] === 'WebApplication').name).toBe(H1_TEMOIN);

  const links = page.locator('[data-tool-links] a');
  await expect(links).toHaveCount(3);
  expect(await links.evaluateAll((items) => items.map((item) => item.getAttribute('href')))).toEqual([
    HUB, '/methode', '/contact',
  ]);
  await expect(page.locator('[data-tool-links] a[href="/contact"]')).toHaveCount(1);
});

test('témoin : le garde détecte toute requête après armement, puis exige zéro', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const requests: string[] = [];
  let armed = false;
  page.on('request', (request) => {
    if (armed) requests.push(`${request.method()} ${request.url()}`);
  });
  if (process.env.NETWORK_GUARD_RED === '1') {
    // La CSP publique ferme déjà `connect-src`. Le mode rouge retire uniquement sa balise de la
    // réponse locale afin de prouver que le garde réseau, indépendamment de la CSP, voit l'appel.
    await page.route(`**${TEMOIN}`, async (route) => {
      const response = await route.fetch();
      const body = (await response.text()).replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/, '');
      const headers = { ...response.headers() };
      delete headers['content-security-policy'];
      delete headers['content-security-policy-report-only'];
      await route.fulfill({ response, headers, body });
    });
  }

  await page.goto(TEMOIN);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState('networkidle');
  armed = true;

  await page.getByLabel('Premier nombre').fill('10,5');
  await page.getByLabel('Deuxième nombre').fill('2,25');
  await page.getByRole('button', { name: 'Calculer' }).click();
  await expect(page.locator('[data-result]')).toHaveText('12,75');
  await page.getByRole('button', { name: 'Copier le résultat' }).click();
  await expect(page.locator('[data-copy-status]')).toHaveText('Résultat copié.');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Télécharger le résultat' }).click();
  expect((await download).suggestedFilename()).toBe('temoin-calcul-local.txt');
  expect(await page.evaluate(async () => ({
    localStorage: localStorage.length,
    sessionStorage: sessionStorage.length,
    indexedDB: (await indexedDB.databases()).length,
  }))).toEqual({ localStorage: 0, sessionStorage: 0, indexedDB: 0 });

  if (process.env.NETWORK_GUARD_RED === '1') {
    await page.evaluate(() => fetch('/robots.txt').catch(() => undefined));
  }
  expect(requests).toEqual([]);
});

test('outil vers contact : origine attribuée sans requête avant l’envoi volontaire', async ({ page }) => {
  const apiRequests: string[] = [];
  await page.route('**/api/contact', async (route) => {
    apiRequests.push(route.request().postData() ?? '');
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
  });

  await page.goto(TEMOIN);
  await page.locator('[data-tool-links] a[href="/contact"]').click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.locator('#origine')).toHaveValue(TEMOIN);
  expect(apiRequests).toEqual([]);

  await page.fill('#nom', 'Camille Fictive');
  await page.fill('#courriel', 'camille@exemple.test');
  await page.fill('#message', 'Chaque mois, une tâche fictive doit être contrôlée avant validation.');
  await page.check('#consentement');
  await page.click('form[data-contact] button[type="submit"]');
  await expect(page.locator('[data-etat]')).toContainText('Message envoyé');
  expect(apiRequests).toHaveLength(1);
  expect(apiRequests[0]).toContain(`\r\n\r\n${TEMOIN}\r\n`);
});

for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`hub, outils et témoin sans débordement à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [HUB, TEMOIN, ...OUTILS_DISPONIBLES.map(outilPath)]) {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await expect(page.locator('main h1')).toBeVisible();
    }
  });
}
