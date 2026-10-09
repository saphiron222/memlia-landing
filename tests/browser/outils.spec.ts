import { test, expect, type Page } from '@playwright/test';
import { OUTILS_DISPONIBLES, outilPath } from '../../src/data/outils';
import { readFile } from 'node:fs/promises';
import { INPUT_FIELDS } from '../../src/lib/signification.mjs';

const HUB = '/outils-comptables-gratuits';
const TEMOIN = `${HUB}/temoin-calcul-local`;
const H1_HUB = 'Outils comptables gratuits : calculer, vérifier et préparer';
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
  for (const outil of OUTILS_DISPONIBLES) {
    await expect(page.locator(`[data-outil-card] a[href="${outilPath(outil)}"]`)).toHaveCount(1);
    const card = page.locator('[data-outil-card]').filter({ has: page.locator(`a[href="${outilPath(outil)}"]`) });
    await expect(card.locator('dt')).toHaveText(['Entrée', 'Résultat', 'Limite']);
    await expect(card.locator('dd').nth(0)).toHaveText(outil.promesse.entree);
    await expect(card.locator('dd').nth(1)).toHaveText(outil.promesse.resultat);
    await expect(card.locator('dd').nth(2)).toHaveText(outil.limites[outil.slug === 'modele-rapprochement-bancaire-excel-gratuit' ? 1 : 0]);
    await expect(card).toContainText('Gratuit, sans inscription.');
    await expect(card.locator('a')).not.toHaveText(/Utiliser sans compte|Ouvrir l’outil/);
  }
  await expect(page.locator('#hub-confier a')).toHaveText('Confier une première tâche');
  await expect(page.locator('#hub-confier a')).toHaveAttribute('href', '/contact');
  expect(await page.evaluate(() => [...document.querySelectorAll('[data-outil-card]')].every(card => Boolean(card.compareDocumentPosition(document.querySelector('#hub-confier')!) & Node.DOCUMENT_POSITION_FOLLOWING)))).toBe(true);
  await expect(page.locator('[data-outil-card] h3').filter({ hasText: 'Suivi de circularisation' })).not.toContainText('Excel');
  await expect(page.locator('#outils-titre').locator('..')).not.toContainText('Les valeurs restent dans votre navigateur');
  await expect(page.locator('[data-tool-media]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://memlia.fr/proofs/v2/og/24-outils-hub.webp');
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', 'https://memlia.fr/proofs/v2/og/24-outils-hub.webp');
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
    // Les trois suites (explorer, comprendre, passer à votre tâche) sont trois cartes de même rang ;
    // la ressource associée, quand elle existe, suit en lien d'action (système de page, 07/10/2026).
    const expectedLinks = [HUB, outil.pageService, outil.cta, ...(outil.articleExact ? [outil.articleExact] : [])];
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
    // Un seul bouton principal en fin de page, celui de l'appel final : dans la suite, l'appel à
    // passer à sa tâche garde ses mots et son lien, en lien d'action de carte (système de page).
    await expect(suite.getByRole('link', { name: 'Confier une première tâche' })).toHaveClass(/carte-action/);
    await expect(page.locator('#outil-confier').getByRole('link', { name: 'Confier une première tâche' })).toHaveClass(/btn-principal/);
    await expect(suite.getByRole('link', { name: /Voir le cadrage des factures fournisseurs/ })).toHaveAttribute('href', '/automatisation/factures-fournisseurs');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);

    await links.nth(0).focus();
    await expect(links.nth(0)).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(links.nth(1)).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(links.nth(2)).toBeFocused();
    // Le focus d'un lien de carte se dessine sur la carte entière (global.css).
    await expect(suite.locator('.carte:has(.carte-lien:focus-visible)')).toHaveCSS('outline-style', 'solid');
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
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', `https://memlia.fr/proofs/v2/og/${outil.proof?.slice(3)}.webp`);
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', `https://memlia.fr/proofs/v2/og/${outil.proof?.slice(3)}.webp`);
    await expect(page.locator('[data-tool-section]')).toHaveCount(8);
    await expect(page.locator('[data-tool-section="garanties"]')).toBeVisible();
    await expect(page.locator('[data-tool-section="faq"] details')).toHaveCount(2);
    // L'appel « Confier une première tâche » : deux fois dans la page (suite et appel final), au pied,
    // et au bouton de la navigation, qui porte le même libellé depuis le 07/10/2026 (décision de Kevin).
    await expect(page.locator('main').getByRole('link', { name: 'Confier une première tâche' })).toHaveCount(2);
    await expect(page.locator('header .nav-principal')).toHaveText('Confier une première tâche');
    await expect(page.getByRole('link', { name: 'Confier une première tâche' })).toHaveCount(4);
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

test('outils publiés : zéro requête et zéro stockage après armement', async ({ page, context }) => {
  // Le registre grandit : toutes les navigations et attentes réseau partagent ce budget.
  test.setTimeout(60_000);
  for (const outil of OUTILS_DISPONIBLES) {
    const requests: string[] = [];
    let armed = false;
    const listener = (request: { method(): string; url(): string }) => { if (armed) requests.push(`${request.method()} ${request.url()}`); };
    context.on('request', listener);
    await page.goto(outilPath(outil));
    await page.evaluate(() => document.fonts.ready);
    await page.waitForLoadState('networkidle');
    armed = true;
    if (outil.slug === 'comparateur-balances-comptables') {
      await page.getByRole('button', { name: 'Charger les deux CSV fictifs', exact: true }).click();
      await page.locator('#same-currency').check();
      await page.locator('#comparable').check();
      await page.getByRole('button', { name: 'Comparer les balances', exact: true }).click();
      await expect(page.locator('[data-result]')).toBeVisible();
      await expect(page.locator('[data-table]')).toContainText('00123');
      await expect(page.locator('[data-table]')).toContainText('30,00');
      const downloading = page.waitForEvent('download');
      await page.getByRole('button', { name: 'Exporter le rapport CSV complet', exact: true }).click();
      const csv = await readFile((await (await downloading).path())!, 'utf8');
      expect(csv).toContain('00123');
      expect(csv).toContain('comparateur-balances-1');
    } else if (outil.slug === 'calculateur-marge-commerciale') {
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

    } else if (outil.slug === 'generateur-prompt-ia-gratuit') {
      await page.getByRole('button', { name: 'Préparer une réunion', exact: true }).click();
      await page.getByLabel(/Je confirme une description/).check();
      await page.getByRole('button', { name: 'Assembler le prompt' }).click();
      await expect(page.locator('[data-editor]')).toHaveValue(/action \/ responsable \/ délai/);
      await page.getByLabel('Format de la future réponse').selectOption('json');
      await expect(page.locator('[data-preview]')).toContainText('"additionalProperties": false');
      const downloading = page.waitForEvent('download');
      await page.getByRole('button', { name: 'Exporter en JSON (.json)', exact: true }).click();
      await downloading;
    } else if (outil.slug === 'verificateur-prompt-ia') {
      await page.getByRole('button', { name: 'Charger l’exemple fictif', exact: true }).click();
      await page.getByLabel(/Je confirme que la consigne/).check();
      await page.getByRole('button', { name: 'Analyser la structure', exact: true }).click();
      await expect(page.locator('[data-findings]')).toContainText('Arrêt : manquant');
    } else if (outil.slug === 'generateur-prompt-expert-comptable') {
      await page.getByRole('button', { name: 'Demande de pièces', exact: true }).click();
      await page.getByLabel(/Je confirme que cette description/).check();
      await page.getByRole('button', { name: 'Assembler le prompt' }).click();
      await expect(page.locator('[data-output]')).toBeVisible();

    } else if (outil.slug === 'bibliotheque-prompts-comptables') {
      await page.getByLabel('Pôle', { exact: true }).selectOption('relation-client');
      await page.getByLabel('Format attendu', { exact: true }).selectOption('mail');
      await expect(page.locator('[data-model]:visible')).toHaveCount(3);
      await page.getByLabel('Rechercher un modèle').fill('relance');
      await expect(page.locator('[data-model]:visible')).toHaveCount(1);
      await page.getByRole('button', { name: 'Effacer les filtres' }).click();
      await expect(page.locator('[data-model]:visible')).toHaveCount(12);

    } else if (outil.slug === 'preparer-pseudonymiser-fichier-csv-fec') {
      await page.locator('[data-example]').click();
      await expect(page.locator('[data-selection]')).toBeVisible();
      await page.locator('[data-preview]').click();
      await expect(page.locator('[data-after]')).toContainText('C1_000001');

    } else if (outil.slug === 'calculateur-roi-automatisation') {
      await page.getByRole('button', { name: 'Charger trois exemples fictifs' }).click();
      await page.getByRole('button', { name: 'Comparer les trois scénarios' }).click();
      await expect(page.locator('[data-results]')).toContainText('266,67');
    } else if (outil.slug === 'verificateur-fec-local') {
      await page.getByRole('button', { name: 'Analyser l’exemple fictif' }).click();
      await expect(page.locator('[data-summary]')).toContainText('1 anomalie');

    } else if (outil.slug === 'diagnostic-maturite-ia-cabinet') {
      await page.locator('#usages_1').selectOption('formalise');
      await page.getByRole('button', { name: 'Voir ma synthèse' }).click();
      await expect(page.locator('[data-summary]')).toContainText('Usages : Incomplet');

    } else if (outil.slug === 'generateur-charte-ia-cabinet') {
      await page.getByRole('button', { name: 'Charger un exemple fictif' }).click();
      await page.getByRole('button', { name: 'Préparer la charte', exact: true }).click();
      await expect(page.locator('[data-editor]')).toHaveValue(/Relance de pièces/);
    } else if (outil.slug === 'suivi-circularisation') {
      await page.getByText('Importer un CSV : mapping, aperçu et sélection', { exact: true }).click();
      await page.locator('#circ-csv').setInputFiles({
        name: 'fictif.csv', mimeType: 'text/csv',
        buffer: Buffer.from('id;category;recipient;contact;referenceDate;currency;requestedAmount;confirmationType\n0007;client;Tiers fictif;Contact fictif;2026-01-01;EUR;100;open'),
      });
      await page.getByRole('button', { name: 'Lire le CSV', exact: true }).click();
      await expect(page.locator('[data-circ-mapping] select')).toHaveCount(10);
      for (const field of ['id', 'category', 'recipient', 'contact', 'referenceDate', 'currency', 'requestedAmount', 'confirmationType']) {
        await page.locator(`[data-circ-mapping] select[name="${field}"]`).selectOption(field);
      }
      await page.getByRole('button', { name: 'Voir l’aperçu mappé', exact: true }).click();
      await expect(page.locator('[data-circ-import-summary]')).toContainText('1 lignes au total');
      await page.locator('[data-circ-preview-rows] input').check();
      await page.locator('#circ-import-valid').check();
      await page.getByRole('button', { name: 'Ajouter la sélection validée', exact: true }).click();
      await expect(page.locator('[data-circ-summary]')).toContainText('1 tiers');
      const downloading = page.waitForEvent('download');
      await page.locator('[data-circ-export="json"]').click();
      await downloading;
    } else if (outil.slug === 'bareme-heures-cac') {
      await page.locator('[data-demo]').click();
      await expect(page.locator('[data-result]')).toContainText('20 à 35');
      const downloading = page.waitForEvent('download');
      await page.locator('[data-export="json"]').click();
      await downloading;
    } else if (outil.slug === 'seuil-signification-audit') {
      await page.getByText('Importer des scénarios CSV', { exact: true }).click();
      await page.locator('#sig-csv').setInputFiles({
        name: 'fictif.csv', mimeType: 'text/csv',
        buffer: Buffer.from(INPUT_FIELDS.join(';') + '\n0007;Scénario fictif;CA;1000000;1;2026;Balance;Motif;rate;70'),
      });
      await page.getByRole('button', { name: 'Lire le CSV', exact: true }).click();
      await expect(page.locator('[data-mapping]')).toHaveCount(10);
      for (let i = 0; i < INPUT_FIELDS.length; i++) {
        await page.locator(`[data-mapping="${INPUT_FIELDS[i]}"]`).selectOption(String(i));
      }
      await page.locator('[data-sig-preview]').click();
      await expect(page.locator('[data-sig-import-summary]')).toContainText('1 lignes');
      await page.locator('[data-sig-import-valid]').check();
      await page.locator('[data-sig-import-confirm]').click();
      await expect(page.locator('[data-sig-table]')).toContainText('10000.00');
      await page.getByRole('button', { name: 'Retenir 0007', exact: true }).click();
      const downloading = page.waitForEvent('download');
      await page.locator('[data-sig-export="json"]').click();
      const raw = await readFile((await (await downloading).path())!, 'utf8');
      expect(JSON.parse(raw).retainedId).toBe('0007');
      page.once('dialog', dialog => dialog.accept());
      await page.locator('[data-sig-reset]').click();
      await expect(page.locator('[data-sig-summary]')).toContainText('0 scénario');
      await page.getByText('Reprendre une sauvegarde JSON', { exact: true }).click();
      await page.locator('#sig-json').setInputFiles({name: 'reprise.json', mimeType: 'application/json', buffer: Buffer.from(raw)});
      await page.locator('[data-sig-restore] button').click();
      await expect(page.locator('[data-sig-summary]')).toContainText('Retenu : 0007');
      const exporting = page.waitForEvent('download');
      await page.locator('[data-sig-export="json"]').click();
      expect(JSON.parse(await readFile((await (await exporting).path())!, 'utf8'))).toEqual(JSON.parse(raw));
    } else if (outil.slug === 'fusionner-fichiers-csv') {
      await page.locator('#fusion-files').setInputFiles([
        { name: 'a.csv', mimeType: 'text/csv', buffer: Buffer.from('ID;Montant\n00123;10\n002;20') },
        { name: 'b.csv', mimeType: 'text/csv', buffer: Buffer.from('Montant;ID\n30;003') },
      ]);
      await page.getByRole('button', { name: 'Importer les fichiers', exact: true }).click();
      await expect(page.locator('[data-mapping]')).toBeVisible();
      await page.locator('[data-provenance]').check();
      await page.locator('[data-confirmed]').check();
      await page.locator('[data-merge]').click();
      await expect(page.locator('[data-summary]')).toContainText('3 lignes consolidées');
      await expect(page.locator('[data-table]')).toContainText('00123');
      await page.locator('[data-reviewed]').check();
      const csvDownload = page.waitForEvent('download');
      await page.locator('[data-export="csv"]').click();
      expect(await readFile((await (await csvDownload).path())!, 'utf8')).toContain('"003";"30";"b.csv";"2"');
      const reportDownload = page.waitForEvent('download');
      await page.locator('[data-export="report"]').click();
      const report = JSON.parse(await readFile((await (await reportDownload).path())!, 'utf8'));
      expect(report.outputRows).toBe(3);
      expect(report.origins).toHaveLength(3);
      await page.locator('[data-reset]').click();
      await expect(page.locator('[data-mapping]')).toBeHidden();
      await expect(page.locator('[data-table]')).toBeEmpty();
    } else if (outil.slug === 'checklist-pieces-comptables') {
      await page.getByRole('button', { name: 'Charger l’exemple fictif', exact: true }).click();
      await expect(page.locator('[data-cl-item]')).toHaveCount(4);
      await expect(page.locator('#cl-message')).toHaveValue(/Relevé bancaire de septembre/);
      expect(await page.locator('#cl-message').inputValue()).not.toMatch(/Factures d’achat|Récapitulatif de paie/);
      await expect(page.locator('[data-cl-unknown]')).toContainText('Récapitulatif de paie');
      const downloading = page.waitForEvent('download');
      await page.locator('[data-cl-export="json"]').click();
      const raw = await readFile((await (await downloading).path())!, 'utf8');
      await page.locator('#cl-period').fill('Octobre 2026');
      await page.locator('details').filter({ has: page.locator('#cl-file') }).evaluate(element => element.setAttribute('open', ''));
      await page.locator('#cl-file').setInputFiles({ name: 'reprise.json', mimeType: 'application/json', buffer: Buffer.from(raw) });
      await page.getByRole('button', { name: 'Vérifier la reprise', exact: true }).click();
      await expect(page.locator('[data-cl-apply]')).toBeEnabled();
      await expect(page.locator('#cl-period')).toHaveValue('Octobre 2026');
      page.once('dialog', dialog => dialog.accept());
      await page.locator('[data-cl-apply]').click();
      await expect(page.locator('#cl-period')).toHaveValue('Septembre 2026');
      const exporting = page.waitForEvent('download');
      await page.locator('[data-cl-export="json"]').click();
      expect(JSON.parse(await readFile((await (await exporting).path())!, 'utf8'))).toEqual(JSON.parse(raw));
    } else if (outil.slug === 'modele-rapprochement-bancaire-excel-gratuit') {
      await page.getByLabel('Début de période').fill('2026-01-01');
      await page.getByLabel('Fin de période').fill('2026-01-31');
      await page.getByLabel('Solde du relevé bancaire').fill('1000');
      await page.getByLabel('Solde du compte 512').fill('1000');
      await page.getByRole('button', { name: 'Contrôler les soldes' }).click();
      await expect(page.locator('[data-difference]')).toHaveText('0,00 €');
    } else {
      throw new Error(`Scénario réseau à définir pour l’outil ${outil.slug}`);
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
    } else if (outil.slug === 'preparer-pseudonymiser-fichier-csv-fec') {
      const asset = new RegExp(`^GET ${new URL(page.url()).origin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/_astro/pseudonymisation\\.worker-[a-zA-Z0-9_-]+\\.js$`);
      expect(requests.filter(request => !asset.test(request))).toEqual([]);
    } else if (outil.slug === 'suivi-circularisation') {
      const asset = new RegExp(`^GET ${new URL(page.url()).origin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/_astro/circularisation-worker-[a-zA-Z0-9_-]+\\.js$`);
      // Parsing, preview and validated selection each create their own local Worker.
      expect(requests).toHaveLength(3);
      expect(requests.filter(request => !asset.test(request))).toEqual([]);
    } else if (outil.slug === 'comparateur-balances-comptables') {
      const asset = new RegExp(`^GET ${new URL(page.url()).origin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/_astro/comparateur-balances\\.worker-[a-zA-Z0-9_-]+\\.js$`);
      // Un seul Worker local traite les deux balances et leur comparaison.
      expect(requests).toHaveLength(1);
      expect(requests.filter(request => !asset.test(request))).toEqual([]);
    } else if (outil.slug === 'fusionner-fichiers-csv') {
      const asset = new RegExp(`^GET ${new URL(page.url()).origin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/_astro/fusion-csv\\.worker-[a-zA-Z0-9_-]+\\.js$`);
      // Import and confirmed consolidation create two local Workers; exports reuse the second.
      expect(requests).toHaveLength(2);

      expect(requests.filter(request => !asset.test(request))).toEqual([]);
    } else expect(requests).toEqual([]);
    context.off('request', listener);
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

test('contact : accord saisi avant le chargement JavaScript conservé et appliqué', async ({ page, baseURL }) => {
  let releaseScripts!: () => void;
  const scriptsReady = new Promise<void>((resolve) => { releaseScripts = resolve; });
  let delayedScripts = 0;
  const posts: string[] = [];
  await page.route('**/_astro/*.js', async (route) => {
    delayedScripts += 1;
    await scriptsReady;
    await route.continue();
  });
  await page.route('**/api/contact', async (route) => {
    if (route.request().method() === 'POST') posts.push(route.request().postData() ?? '');
    await route.fulfill({ status: 503, body: '{}' });
  });
  await page.goto('/contact', { waitUntil: 'commit', referer: new URL(TEMOIN, baseURL).href });
  try {
    await page.locator('#nom').fill('Camille Fictive');
    await page.check('#consentement_origine');
    await expect(page.locator('#origine')).toHaveValue('');
    expect(delayedScripts).toBeGreaterThan(0);
  } finally {
    releaseScripts();
  }
  await page.waitForLoadState('load');
  await expect(page.locator('#consentement_origine')).toBeChecked();
  await expect(page.locator('#origine')).toHaveValue(TEMOIN);
  await expect(page.locator('#nom')).toHaveValue('Camille Fictive');
  await page.uncheck('#consentement_origine');
  await expect(page.locator('#origine')).toHaveValue('');
  expect(posts).toEqual([]);
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
