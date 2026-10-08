import { test, expect } from '@playwright/test';

/** Le blog partage le contrat de positionnement des autres pages : aucun vocabulaire catalogue. */
const CATALOGUE = /\bmodules?\b|compléments?\s+(Excel|Memlia)|Office\.js|En pilote|Sur étude|Périmètre distinct/i;
const PREVIEW_SLUGS = new Set((process.env.BLOG_PREVIEW_SLUGS ?? '').split(',').filter(Boolean));

const textesPublics = (page: import('@playwright/test').Page) =>
  page.evaluate(() => [
    document.body.innerText,
    document.title,
    ...Array.from(document.querySelectorAll('meta[content], [alt], [aria-label]')).flatMap(el =>
      ['content', 'alt', 'aria-label'].map(attr => el.getAttribute(attr) ?? '')),
  ]);

test('liste du blog : articles, auteur, flux et navigation courante', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  const response = await page.goto('/blog');
  expect(response?.status()).toBe(200);
  await expect(page.locator('h1')).toHaveCount(1);
  const cartes = page.locator('[data-article]');
  expect(await cartes.count()).toBeGreaterThanOrEqual(2);
  // `data-articles` compte les cartes de la liste, pas celles de la page : le pilier a son propre
  // bloc au-dessus et n'y figure plus.
  expect(await page.locator('.blog-liste').getAttribute('data-articles')).toBe(String(await page.locator('.blog-liste [data-article]').count()));
  await expect(page.locator('#auteur-kevin')).toContainText('Kevin Kitanga');
  const rssLink = page.locator('link[rel="alternate"][type="application/rss+xml"]');
  if (PREVIEW_SLUGS.size) await expect(rssLink).toHaveCount(0);
  else await expect(rssLink).toHaveAttribute('href', '/blog/rss.xml');
  await page.setViewportSize({ width: 1440, height: 900 });
  // Le hub Blog indique la rubrique courante, y compris dans ses articles.
  await expect(page.locator('.nav-centre a[aria-current]')).toHaveCount(1);
  await expect(page.locator('.nav-centre a[aria-current]')).toHaveAttribute('href', '/blog');
  for (const text of await textesPublics(page)) expect(text).not.toMatch(CATALOGUE);
  expect(errors).toEqual([]);
});

test('flux RSS servi en XML et cohérent avec la liste', async ({ page, request }) => {
  await page.goto('/blog');
  const slugs = await page.locator('[data-article]').evaluateAll(els => els.map(el => el.getAttribute('data-article')));
  const rss = await request.get('/blog/rss.xml');
  expect(rss.status()).toBe(200);
  expect(rss.headers()['content-type']).toMatch(/xml/);
  const xml = await rss.text();
  for (const slug of slugs) {
    const articleUrl = `https://memlia.fr/blog/${slug}`;
    if (slug && PREVIEW_SLUGS.has(slug)) expect(xml).not.toContain(articleUrl);
    else expect(xml).toContain(articleUrl);
  }
  expect(xml).not.toMatch(CATALOGUE);
});

test('article : en-tête, fil d’Ariane, schéma, sources et retour à la liste', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/blog');
  const slug = await page.locator('[data-article]').first().getAttribute('data-article');
  await page.setViewportSize({ width: 1440, height: 900 });
  const response = await page.goto(`/blog/${slug}`);
  expect(response?.status()).toBe(200);
  await expect(page.locator('h1')).toHaveCount(1);
  // Ancres de titres en ASCII (plugin rehype local) : partageables et stables.
  for (const id of await page.locator('.article-corps h2, .article-corps h3').evaluateAll(els => els.map(el => el.id))) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  await expect(page.locator('.en-bref')).toBeVisible();
  await expect(page.locator('.article-couverture img')).toBeVisible();
  const couverture = await page.locator('.article-couverture img').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0);
  expect(couverture).toBe(true);
  await expect(page.locator('.article-corps h2').first()).toBeVisible();
  // Décision de Kevin du 06/10/2026 : les sources se citent dans le texte (une section ne reste que pour les sources pas encore citées).
  expect(await page.locator('.article-corps a[href^="https://"], .article-sources li').count()).toBeGreaterThan(0);
  await expect(page.locator('.article-pont .btn-principal')).toHaveCount(1);
  const report = await page.evaluate(() => {
    const graph = JSON.parse(document.querySelector('script[type="application/ld+json"]')!.textContent!);
    const types = graph['@graph'].map((n: { '@type': string }) => n['@type']);
    const posting = graph['@graph'].find((n: { '@type': string }) => n['@type'] === 'BlogPosting');
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')!.href;
    const broken = [...document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')].filter(a => !document.getElementById(a.hash.slice(1))).map(a => a.hash);
    const h1 = document.querySelector('h1')!.textContent!.trim();
    return { types, headline: posting.headline, url: posting.url, canonical, broken, h1 };
  });
  expect(report.types).toEqual(['BlogPosting', 'BreadcrumbList', 'Person', 'Organization', 'WebSite']);
  await expect(page.locator('.nav-centre a[aria-current]')).toHaveCount(1);
  await expect(page.locator('.nav-centre a[aria-current]')).toHaveAttribute('href', '/blog');
  expect(report.headline).toBe(report.h1);
  expect(report.canonical).toBe(report.url);
  expect(report.broken).toEqual([]);
  for (const text of await textesPublics(page)) expect(text).not.toMatch(CATALOGUE);
  await page.locator('.ariane a', { hasText: 'Blog' }).click();
  await expect(page).toHaveURL(/\/blog$/);
  expect(errors).toEqual([]);
});

for (const width of [320, 375, 768, 1024, 1440]) {
  test(`blog et article sans débordement à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/blog');
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    const slug = await page.locator('[data-article]').first().getAttribute('data-article');
    await page.goto(`/blog/${slug}`);
    await page.evaluate(() => document.fonts.ready);
    for (const figure of await page.locator('.article-corps figure, .article-corps table').all()) {
      await figure.scrollIntoViewIfNeeded();
      await expect(figure).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });
}

test('article sans JavaScript : contenu et navigation visibles', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  await page.goto('/blog');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('[data-article]').first()).toBeVisible();
  await expect(page.locator('[data-mobile-visible] a[href="/#methode"]')).toBeVisible();
  await context.close();
});

test('le pilier ouvre la page dans son propre bloc, et ne figure pas dans la liste', async ({ page }) => {
  await page.goto('/blog');
  const PILIER = 'automatiser-un-cabinet-comptable-la-carte-des-taches';
  const tous = await page.locator('[data-article]').evaluateAll((items) => items.map((i) => i.getAttribute('data-article')));
  test.skip(!tous.includes(PILIER), 'pilier non publié dans ce rendu');
  // Il ouvre la page : première carte du document, dans le bloc de départ.
  expect(tous[0]).toBe(PILIER);
  await expect(page.locator(`.blog-depart [data-article="${PILIER}"]`)).toHaveCount(1);
  // Et il sort de la liste, pour que celle-ci se lise strictement du plus récent au plus ancien.
  await expect(page.locator(`.blog-liste [data-article="${PILIER}"]`)).toHaveCount(0);
  const liste = await page.locator('.blog-liste [data-article]').evaluateAll((items) => items.map((i) => i.getAttribute('data-article')));
  expect(liste.length).toBe(tous.length - 1);
});
