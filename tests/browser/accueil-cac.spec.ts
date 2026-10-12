import { test, expect } from '@playwright/test';
import { CONTENU_CAC, FRONTIERE_CAC, SEO_CAC } from '../../src/data/accueil/cac';

for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`accueil CAC : copie, poster, frontière et ancres à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const errors: string[] = [];
    const mediaRequests: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => { if (/\.(mp4|vtt)(?:$|\?)/.test(request.url())) mediaRequests.push(request.url()); });
    const response = await page.goto(SEO_CAC.chemin);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText(CONTENU_CAC.hero.titre);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://memlia.fr${SEO_CAC.chemin}`);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', CONTENU_CAC.hero.titre);
    await expect(page.locator('[data-video-player] video')).toHaveAttribute('src', CONTENU_CAC.hero.video);
    await expect(page.locator('[data-video-player] video')).toHaveAttribute('poster', CONTENU_CAC.hero.poster);
    await expect(page.locator('[data-video-sound]')).toBeVisible();
    await expect(page.locator('#couverture-cac')).toHaveText('Ce que votre suite d’audit fait déjà');
    for (const id of ['usages', 'methode', 'preuves', 'questions', 'use-certification', 'use-interventions', 'use-sacc', 'use-durabilite', 'use-administration']) await expect(page.locator(`#${id}`)).toHaveCount(1);
    const table = page.locator('[data-frontiere-cac] table');
    await expect(table.locator('th')).toHaveText([...FRONTIERE_CAC.colonnes]);
    await expect(table.locator('tbody tr')).toHaveCount(3);
    await table.scrollIntoViewIfNeeded();
    const region = page.locator('[data-frontiere-cac] [data-table-scroll]');
    await expect(region).toHaveAttribute('tabindex', '0');
    await region.focus();
    if (width < 768) {
      await page.keyboard.press('ArrowRight');
      await expect.poll(() => region.evaluate(node => node.scrollLeft)).toBeGreaterThan(0);
    }
    const faq = page.locator('#faq-secret');
    await faq.locator('summary').click();
    await expect(faq).toHaveAttribute('open', '');
    const schemas = await page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.flatMap(node => JSON.parse(node.textContent ?? '{}')['@graph'] ?? []));
    const service = schemas.find(node => node['@type'] === 'Service');
    expect(service.url).toBe(`https://memlia.fr${SEO_CAC.chemin}`);
    expect(service.audience.audienceType).toBe('Cabinets de commissariat aux comptes');
    expect(schemas.find(node => node['@type'] === 'WebPage').headline).toBe(CONTENU_CAC.hero.titre);
    expect(schemas.find(node => node['@type'] === 'FAQPage').mainEntity.map((q: { name: string }) => q.name)).toEqual(CONTENU_CAC.faq.questions.map(q => q.question));
    expect(schemas.find(node => node['@type'] === 'BreadcrumbList').itemListElement.at(-1).item).toBe(`https://memlia.fr${SEO_CAC.chemin}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    // Les preuves sont chargées à la lecture, pas avant le défilement.
    for (const image of await page.locator('main img').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate(node => (node as HTMLImageElement).complete && (node as HTMLImageElement).naturalWidth > 0)).toBe(true);
    }
    expect(await page.locator('main img').evaluateAll(images => images.filter(image => !(image as HTMLImageElement).complete || !(image as HTMLImageElement).naturalWidth).map(image => image.getAttribute('src')))).toEqual([]);
    expect(errors).toEqual([]);
    expect(mediaRequests).toEqual([]);
    // Les références font partie des paragraphes, sans bibliographie ni boutons de source.
    await expect(page.locator('#sources-cac')).toHaveCount(0);
    for (const href of [
      'https://h2a-france.org/normes/connaissance-de-lentite-et-de-son-environnement-et-evaluation-du-risque-danomalies-significatives-dans-les-comptes/',
      'https://h2a-france.org/normes/demandes-de-confirmation-des-tiers/',
      'https://h2a-france.org/normes/documentation-de-laudit-des-comptes/',
      'https://doc.cncc.fr/docs/brochure-code-com-partie-legislative-2024/attachments/brochure-ccom-legislative-septembre-2024',
      'https://doc.cncc.fr/docs/codedeontologiemars2026/attachments/brochure-code-de-deontologie-mars-2026',
    ]) {
      const links = page.locator(`main a[href="${href}"]`);
      expect(await links.count()).toBeGreaterThan(0);
      for (const link of await links.all()) expect(await link.evaluate(node => Boolean(node.closest('p')))).toBe(true);
    }
    const fiche = page.locator('aside[aria-labelledby="fiche-outil-cac"]');
    expect(await fiche.evaluate(node => parseFloat(getComputedStyle(node).borderTopWidth))).toBeGreaterThan(0);
    expect(await fiche.evaluate(node => parseFloat(getComputedStyle(node).paddingTop))).toBeGreaterThan(0);
    await expect(fiche.locator('p a')).toHaveText('NEP 315 révisée');
    const reference = fiche.locator('p a');
    await reference.scrollIntoViewIfNeeded();
    await expect(reference).toBeVisible();
    await reference.focus();
    await expect(reference).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(reference).not.toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(reference).toBeFocused();
    const gap = await page.evaluate(() => {
      const questions = document.querySelector('#questions')!.closest('section')!.getBoundingClientRect();
      const final = document.querySelector('.appel-final') ?? document.querySelector('main .feuille > section:last-child');
      return final!.querySelector('h2')!.getBoundingClientRect().top - questions.bottom;
    });
    expect(gap).toBeGreaterThanOrEqual(80);
  });
}
