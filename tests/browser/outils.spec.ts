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

test('hub : outils disponibles et schéma de collection', async ({ page }) => {
  const response = await page.goto(HUB);
  expect(response?.status()).toBe(200);
  await expect(page.locator('main h1')).toHaveText(H1_HUB);
  await expect(page.locator('main h1')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://memlia.fr${HUB}`);
  await expect(page.locator('[data-outil-card]')).toHaveCount(OUTILS_DISPONIBLES.length);
  await expect(page.locator('[data-empty-category]')).toHaveCount(0);
  await expect(page.locator('[data-tool-media]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', '/proofs/v2/og/24-outils-hub.webp');
  await expect(page.locator(`a[href="${TEMOIN}"]`)).toHaveCount(0);


  const graph = await graphFrom(page);
  expect(graph.map((node: { '@type': string }) => node['@type'])).toEqual([
    'CollectionPage', 'ItemList', 'BreadcrumbList',
  ]);
  expect(graph.find((node: { '@type': string }) => node['@type'] === 'CollectionPage').headline).toBe(H1_HUB);
  expect(graph.find((node: { '@type': string }) => node['@type'] === 'ItemList').itemListElement).toHaveLength(OUTILS_DISPONIBLES.length);
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
  await expect(page.getByLabel('Prix d’achat HT')).toBeFocused();
});

test('marge : exemple, copie, export, effacement et événements de mesure', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.addInitScript(() => {
    (window as unknown as { outilEvents: Array<Record<string, string>> }).outilEvents = [];
    window.addEventListener('memlia:outil', (event) => {
      const detail = (event as CustomEvent<Record<string, string>>).detail;
      (window as unknown as { outilEvents: Array<Record<string, string>> }).outilEvents.push(detail);
    });
  });
  await page.goto(`${HUB}/calculateur-marge-commerciale`);
  await page.getByRole('button', { name: 'Charger un exemple fictif' }).click();
  await expect(page.getByLabel('Prix d’achat HT')).toHaveValue('80,00');
  await page.getByRole('button', { name: 'Calculer la marge' }).click();
  await page.getByRole('button', { name: 'Copier le résultat et la trace' }).click();
  await expect(page.locator('[data-status]')).toHaveText('Résultat et trace copiés.');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('Taux de marge');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Télécharger le CSV' }).click();
  expect((await download).suggestedFilename()).toBe('calcul-marge-commerciale.csv');
  await page.getByLabel('Prix d’achat HT').fill('81');
  await expect(page.locator('[data-output]')).toBeHidden();
  await page.getByRole('button', { name: 'Effacer' }).click();
  await expect(page.getByLabel('Prix d’achat HT')).toHaveValue('');
  expect(await page.evaluate(() => (window as unknown as { outilEvents: Array<Record<string, string>> }).outilEvents)).toEqual([
    { action: 'demarrage', outil: 'calculateur-marge-commerciale' },
    { action: 'exemple', outil: 'calculateur-marge-commerciale' },
    { action: 'reussite', outil: 'calculateur-marge-commerciale' },
    { action: 'copie', outil: 'calculateur-marge-commerciale' },
    { action: 'export', outil: 'calculateur-marge-commerciale' },
    { action: 'effacer', outil: 'calculateur-marge-commerciale' },
  ]);
});

test('échéance : les deux conventions divergent et l’absence de convention est refusée', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(`${HUB}/calculateur-date-echeance-facture`);
  await page.getByRole('button', { name: 'Charger un exemple fictif' }).click();
  await expect(page.getByLabel('Date de facture', { exact: true })).toHaveValue('2026-01-20');
  await page.getByRole('button', { name: 'Effacer' }).click();
  await expect(page.getByLabel('Délai applicable ou convenu')).toHaveValue('');
  await page.getByLabel('Délai applicable ou convenu').selectOption('eom45');
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
  await page.getByLabel('Délai applicable ou convenu').selectOption('default30');
  await page.getByLabel('Date de réception ou d’exécution', { exact: true }).fill('2026-02-01');
  await page.getByRole('button', { name: 'Calculer l’échéance' }).click();
  await expect(page.locator('[data-result]')).toContainText('03 mars 2026');
  await page.getByLabel('Délai applicable ou convenu').selectOption('invoice60');
  await page.getByLabel('Date de facture', { exact: true }).fill('2026-01-20');
  await page.getByRole('button', { name: 'Calculer l’échéance' }).click();
  await expect(page.locator('[data-result]')).toContainText('21 mars 2026');
  await page.getByRole('button', { name: 'Copier la date et la trace' }).click();
  await expect(page.locator('[data-status]')).toHaveText('Date et trace copiées.');
  const calendar = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Ajouter au calendrier (.ics)' }).click();
  expect((await calendar).suggestedFilename()).toBe('echeance-facture-fictive.ics');
});

test('amortissement : plan linéaire tracé, dégressif confirmé et entrées incohérentes refusées', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(`${HUB}/calculateur-amortissement-comptable`);
  await page.getByRole('button', { name: 'Recharger l’exemple fictif' }).click();
  await expect(page.getByLabel('Valeur amortissable')).toHaveValue('10000');
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
  const csvDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Télécharger le plan en CSV' }).click();
  expect((await csvDownload).suggestedFilename()).toBe('plan-amortissement-comptable-fictif.csv');

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
  await page.getByRole('button', { name: 'Copier le résumé' }).click();
  await expect(page.locator('[data-status]')).toHaveText('Résumé copié.');
});

test('rapprochement : CSV exact et refus d’une différence', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.addInitScript(() => {
    const original = URL.revokeObjectURL.bind(URL);
    (window as unknown as { revokedUrls?: string[] }).revokedUrls = [];
    URL.revokeObjectURL = (url) => { (window as unknown as { revokedUrls: string[] }).revokedUrls.push(url); original(url); };
  });
  await page.goto(`${HUB}/modele-rapprochement-bancaire-excel-gratuit`);
  await page.getByRole('button', { name: 'Charger un exemple fictif' }).click();
  await expect(page.getByLabel('Solde du relevé bancaire')).toHaveValue('1000,00');
  await page.getByRole('button', { name: 'Effacer' }).click();
  await expect(page.getByLabel('Solde du relevé bancaire')).toHaveValue('');
  await page.getByLabel('Début de période').fill('2026-01-01'); await page.getByLabel('Fin de période').fill('2026-01-31');
  await page.getByLabel('Solde du relevé bancaire').fill('1000'); await page.getByLabel('Solde du compte 512').fill('950');
  await page.getByLabel('Frais bancaires à comptabiliser').fill('0'); await page.getByLabel('Intérêts à comptabiliser').fill('50');
  await page.getByRole('button', { name: 'Contrôler les soldes' }).click();
  await expect(page.locator('[data-difference]')).toHaveText('0,00 €');
  await page.getByRole('button', { name: 'Copier le contrôle' }).click();
  await expect(page.locator('[data-status]')).toHaveText('Contrôle copié.');
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
  await expect(page.getByRole('button', { name: /Télécharger le CSV/ })).toBeEnabled();
  const exceptionDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: /Télécharger le CSV/ }).click();
  const exceptionBytes = await (await import('node:fs/promises')).readFile(await (await exceptionDownload).path() as string);
  expect(exceptionBytes.toString('utf8')).toContain('NON VALIDÉ');
});

test('contrat de liens : le registre borne les outils publiés et leurs sorties', async ({ page }) => {
  await page.goto(HUB);
  await expect(page.locator('[data-outil-card]')).toHaveCount(OUTILS_DISPONIBLES.length);

  for (const outil of OUTILS_DISPONIBLES) {
    const path = outilPath(outil);
    await page.goto(HUB);
    await expect(page.locator(`main a[href="${path}"]`)).toHaveCount(1);
    await page.goto(path);
    const expectedLinks = [HUB, outil.pageService, ...(outil.articleExact ? [outil.articleExact] : []), outil.cta];
    expect(await page.locator('[data-tool-links] a').evaluateAll((links) => links.map((link) => link.getAttribute('href')))).toEqual(expectedLinks);
    await expect(page.locator('[data-tool-links] a[href="/contact"]')).toHaveCount(1);
    await expect(page.locator('[data-tool-links] a[href^="/contact?"]')).toHaveCount(0);
  }
});

test('pour continuer : trois niveaux lisibles, clavier et responsive sans débordement', async ({ page }) => {
  const path = `${HUB}/calculateur-date-echeance-facture`;
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(path);
    const suite = page.locator('[data-tool-section="suite"]');
    const links = suite.locator('[data-tool-links] a');

    await expect(suite.getByRole('heading', { name: 'Choisissez la suite qui vous est utile.' })).toBeVisible();
    await expect(suite.getByText('Explorer', { exact: true })).toBeVisible();
    await expect(suite.getByText('Comprendre', { exact: true })).toBeVisible();
    await expect(suite.getByText('Passer à votre tâche', { exact: true })).toBeVisible();
    await expect(suite.getByRole('link', { name: 'Confier une première tâche' })).toHaveClass(/btn-principal/);
    await expect(suite.getByRole('link', { name: /Voir le cadrage des factures fournisseurs/ })).toHaveAttribute('href', '/automatisation/factures-fournisseurs');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);

    await links.nth(0).focus();
    await expect(links.nth(0)).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(links.nth(1)).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(links.nth(2)).toBeFocused();
    await expect(links.nth(2)).not.toHaveCSS('box-shadow', 'none');
  }
});

test('outils publiés : métadonnées, source liée et schémas concordent', async ({ page }) => {
  for (const outil of OUTILS_DISPONIBLES) {
    const path = outilPath(outil);
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('main h1')).toHaveText(outil.h1);
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', outil.h1);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', outil.h1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://memlia.fr${path}`);
    await expect(page.locator('[data-official-source]')).toContainText(outil.source.extrait);
    await expect(page.locator('[data-official-source]')).not.toContainText(/vérifiée le|consultée le/i);
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
      await page.getByLabel('Délai applicable ou convenu').selectOption('invoice60');
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
    } else if (outil.slug === 'calculateur-roi-automatisation') {
      await page.getByRole('button', { name: 'Charger trois exemples fictifs' }).click();
      await page.getByRole('button', { name: 'Comparer les trois scénarios' }).click();
      await expect(page.locator('[data-results]')).toContainText('266,67');
    } else if (outil.slug === 'verificateur-fec-local') {
      await page.getByRole('button', { name: 'Analyser l’exemple fictif' }).click();
      await expect(page.locator('[data-summary]')).toContainText('1 anomalie');
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
    // Le Worker charge exclusivement son script statique local, sans donnée saisie ni query string.
    if (outil.slug === 'verificateur-fec-local') {
      const asset = new RegExp(`^GET ${new URL(page.url()).origin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/_astro/fec-worker-[a-zA-Z0-9_-]+\\.js$`);
      expect(requests.filter(request => !asset.test(request))).toEqual([]);
    } else expect(requests).toEqual([]);
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

test('outil vers contact : origine attribuée après accord distinct, sans envoi avant validation volontaire', async ({ page }) => {
  const apiRequests: string[] = [];
  await page.route('**/api/contact', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"sitekey":"cle-test"}' });
      return;
    }
    apiRequests.push(route.request().postData() ?? '');
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
  });
  await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit', (route) => route.fulfill({
    status: 200, contentType: 'application/javascript',
    body: 'window.turnstile={render:()=>{const input=document.createElement("input");input.type="hidden";input.name="cf-turnstile-response";input.value="jeton-test";document.querySelector("[data-contact]").append(input)},reset:()=>{}}',
  }));

  await page.goto(TEMOIN);
  await page.locator('[data-tool-links] a[href="/contact"]').click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.locator('#origine')).toHaveValue('');
  await expect(page.locator('#consentement_origine')).not.toBeChecked();
  expect(apiRequests).toEqual([]);
  await page.check('#consentement_origine');
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
