import { test, expect, type Page } from '@playwright/test';
import { INTEGRATIONS_INDEXABLES } from '../../src/data/integrations';
import { CONNECTEURS, DOMAINES, LOGOS_SUR_ENCRE, PAGE_OUTILS } from '../../src/data/connecteurs';
import { AGENTS, cheminAgent } from '../../src/data/specialistes';

/**
 * `/integrations`, page de compatibilité logiciels (tâche 8, porte 2) : tout se lit dans les données (`connecteurs.ts`,
 * `integrations.ts`), rien n'est recopié ici. Aucun statut d'outil, aucun total, aucun lien vers un éditeur ; le texte
 * fixe « Votre logiciel n'est pas listé ? Nous l'intégrons sur demande. » et la mention de marques sous la liste.
 * Les guides restent archivés ; seul le catalogue commun des logiciels est une surface publique.
 */
const ROUTE = PAGE_OUTILS.chemin;
const TEXTE_FIXE = "Votre logiciel n'est pas listé ? Nous l'intégrons sur demande.";
/** Un compte affiché : « 365 logiciels », « 500+ connecteurs », ou le compte réel nu (« Microsoft 365 » excepté). */
const TOTAL = /\b\d[\d\s.,]*\+?\s*(?:connecteurs?|logiciels?|outils?|intégrations?|solutions?|cartes?)\b/iu;
const COMPTE_REEL = new RegExp(`(?<!Microsoft\\s)(?<![\\p{L}\\p{N}])${CONNECTEURS.length}(?![\\p{N}])`, 'u');
const normaliser = (texte: string) => texte.replace(/[’‘]/gu, "'").replace(/\s+/gu, ' ').trim();
const octavie = AGENTS.find((agent) => cheminAgent(agent) === ROUTE)!;

async function texteDe(page: Page, selecteur: string) {
  return normaliser(await page.locator(selecteur).evaluate((el) => (el as HTMLElement).innerText));
}

for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`catalogue commun de compatibilité à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(ROUTE);
    await expect(page.locator('h1')).toHaveText(PAGE_OUTILS.h1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://memlia.fr${ROUTE}`);
    expect(INTEGRATIONS_INDEXABLES).toEqual([]);
    await expect(page.locator('[data-integration-cards], [data-guide-product], [data-guide-filters]')).toHaveCount(0);
    await expect(page.locator('[data-connecteur]')).toHaveCount(CONNECTEURS.length);
    await expect(page.locator('main')).not.toContainText(/moyeu|signal d.indexation|Mesurer, publier peu/i);
    await expect(page.locator('#suite a', { hasText: 'Confier une première tâche' })).toHaveAttribute('href', '/contact');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    if (width === 375 || width === 1440) {
      await page.evaluate(() => document.querySelectorAll('.rv, .rv-groupe').forEach((el) => el.classList.add('in')));
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.screenshot({ path: `.qa/integrations-hub-${width}.png`, fullPage: false });
    }
  });
}

test('une carte par logiciel, domaine par domaine, dans l’ordre des données ; l’État en nom seul, les variantes blanches sur encre', async ({ page }) => {
  await page.goto(ROUTE);
  const sections = await page.locator('main section[data-domaine]').evaluateAll((noeuds) => noeuds.map((n) => ({
    id: n.id, titre: n.querySelector('h2')?.textContent?.trim(), cartes: [...n.querySelectorAll('[data-connecteur]')].map((c) => c.id),
  })));
  expect(sections.map(({ id }) => id)).toEqual(DOMAINES.map(({ id }) => id));
  expect(sections.map(({ titre }) => titre)).toEqual(DOMAINES.map(({ libelle }) => libelle));
  for (const section of sections) expect(section.cartes, section.id).toEqual(CONNECTEURS.filter((c) => c.domaine === section.id).map(({ id }) => id));

  const cartes = await page.locator('[data-connecteur]').evaluateAll((noeuds) => noeuds.map((n) => ({
    id: n.id,
    nom: n.querySelector('h3')?.textContent?.trim(),
    img: n.querySelector('img')?.getAttribute('src') ?? null,
    alt: n.querySelector('img')?.getAttribute('alt') ?? null,
    surEncre: Boolean(n.querySelector('.connecteur-tuile img')),
    ligne: n.querySelector('.connecteur-ligne')?.textContent?.replace(/\s+/gu, ' ').trim(),
  })));
  expect(cartes.map(({ id }) => id)).toEqual(CONNECTEURS.map(({ id }) => id));
  for (const c of CONNECTEURS) {
    const rendue = cartes.find(({ id }) => id === c.id)!;
    expect(rendue.nom, c.id).toBe(c.nom);
    expect(rendue.ligne, c.id).toBe(c.faitAvec.replace(/\s+/gu, ' '));
    expect(rendue.img, c.id).toBe(c.logo?.src ?? null);
    if (c.logo) expect(rendue.alt, `${c.id} : logo décoratif, le nom suit en titre`).toBe('');
    expect(rendue.surEncre, `${c.id} : tuile encre`).toBe(LOGOS_SUR_ENCRE.has(c.id));
  }
  const etat = CONNECTEURS.filter((c) => c.etat);
  expect(etat).toHaveLength(4);
  for (const c of etat) await expect(page.locator(`[id="${c.id}"] img`)).toHaveCount(0);
});

test('aucun statut, aucun total, aucun lien vers un éditeur ; texte fixe sans annotations sous la liste', async ({ page }) => {
  await page.goto(ROUTE);
  const main = await texteDe(page, 'main');
  expect(main).not.toMatch(TOTAL);
  expect(main).not.toMatch(COMPTE_REEL);
  await expect(page.locator('[data-statut], [data-status]')).toHaveCount(0);
  const etiquettes = await page.locator('main *').evaluateAll((noeuds) => noeuds
    .filter((n) => n.children.length === 0 && /^(?:Éprouvé|Par export|Sur demande|Compatible|Partenaire)$/u.test((n.textContent ?? '').trim()))
    .map((n) => n.textContent));
  expect(etiquettes, 'étiquette de statut').toEqual([]);
  expect(main).not.toMatch(/\bmodules?\b|\bcompléments?\s+excel\b|Compléments greffés sur Excel|partenaire officiel|certifié par/iu);

  // Tout lien du contenu reste sur memlia.fr : ancre, chemin du site, ou l'URL du site.
  const sortants = await page.locator('main a[href]').evaluateAll((liens) => liens.map((a) => a.getAttribute('href')!)
    .filter((href) => !href.startsWith('#') && !href.startsWith('/') && !href.startsWith('https://memlia.fr/')));
  expect(sortants.every(href=>['https://www.impots.gouv.fr','https://www.urssaf.fr','https://www.inpi.fr','https://www.bodacc.fr','https://www.data.gouv.fr'].some(h=>href.startsWith(h)))).toBe(true);

  // Les cartes de logiciels ne réintroduisent aucun rayon de guides ou lien de vente éditeur.
  await expect(page.locator('[data-connecteur] a')).toHaveCount(0);
  await expect(page.locator('main a[href^="/integrations/"]')).toHaveCount(0);

  expect(await texteDe(page, '[data-sur-demande] .hub-autre')).toContain(TEXTE_FIXE);
  await expect(page.locator('[data-sur-demande] a[href="/contact"]')).toBeVisible();
  // Arbitrage Kevin du 16/10 : les marques restent sourcées dans la documentation, sans légende répétée.
  await expect(page.locator('[data-mention-marques]')).toHaveCount(0);
});

test('facturation électronique : une section sans carte ni nom de plateforme', async ({ page }) => {
  await page.goto(ROUTE);
  const section = page.locator('section[data-domaine="facturation-electronique"]');
  await expect(section.locator('[data-connecteur]')).toHaveCount(0);
  const texte = normaliser(await section.innerText()).toLocaleLowerCase('fr');
  const echapper = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
  const nommes = [...new Set(CONNECTEURS.flatMap((c) => [c.nom, c.editeur]))]
    .filter((nom) => nom.length > 2 && new RegExp(`(?<![\\p{L}\\p{N}])${echapper(normaliser(nom).toLocaleLowerCase('fr'))}(?![\\p{L}\\p{N}])`, 'u').test(texte));
  expect(nommes).toEqual([]);
});

test('le bandeau d’Octavie et, dessous, sa démonstration rejouée sur un dossier fictif', async ({ page }) => {
  await page.goto(ROUTE);
  const bandeau = page.locator(`[data-qui-prend="${octavie.slug}"]`);
  await expect(bandeau.locator('h2').first()).toHaveText(`${octavie.prenom}, agent IA informatique et outils`);
  await expect(bandeau).toContainText('Qui prend ce métier');
  await expect(bandeau.locator('a[href="/agents-ia"]')).toBeVisible();
  // Octavie mène à cette page : pas de lien vers elle-même.
  await expect(bandeau.locator(`a[href="${ROUTE}"]`)).toHaveCount(0);
  const rejeu = bandeau.locator('[data-agent-rejeu]');
  await expect(rejeu).toContainText('Rejoué sur un dossier fictif');
  await expect(rejeu.locator('tbody tr')).toHaveCount(octavie.demonstration.cas.length);
  await expect(rejeu.locator('tbody tr[data-issue="Arrêt"]')).toContainText('Motif');
  // La définition de l'agent IA précède sa première mention hors du titre.
  const avant = await page.evaluate(() => {
    const definition = [...document.querySelectorAll('main p')].find((p) => p.textContent?.includes('Nous y déployons les robots Memlia'));
    const bandeauEl = document.querySelector('[data-qui-prend]');
    return Boolean(definition && bandeauEl && definition.compareDocumentPosition(bandeauEl) & Node.DOCUMENT_POSITION_FOLLOWING);
  });
  expect(avant).toBe(true);
});

test('JSON-LD : un ListItem par logiciel vers son ancre présente dans la page, fil d’Ariane, aucun logiciel en SoftwareApplication', async ({ page }) => {
  await page.goto(ROUTE);
  const graphe = await page.locator('script[type="application/ld+json"]').first().evaluate((el) => JSON.parse(el.textContent!)['@graph']);
  const types = graphe.map((n: { '@type': string }) => n['@type']);
  expect(types).toEqual(expect.arrayContaining(['CollectionPage', 'ItemList', 'BreadcrumbList']));
  expect(JSON.stringify(graphe)).not.toMatch(/SoftwareApplication|"offers"|statut/u);
  const liste = graphe.find((n: { '@type': string }) => n['@type'] === 'ItemList');
  expect(liste.numberOfItems).toBe(CONNECTEURS.length);
  const ancres = liste.itemListElement.map((e: { url: string }) => new URL(e.url));
  expect(ancres.every((url: URL) => url.origin === 'https://memlia.fr' && url.pathname === ROUTE)).toBe(true);
  const ids = await page.locator('[data-connecteur]').evaluateAll((n) => n.map((e) => e.id));
  expect(ancres.map((url: URL) => url.hash.slice(1))).toEqual(ids);
});

test('chaque logo se charge, s’affiche à sa taille et reste dans sa carte', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(ROUTE);
  const bilan = await page.evaluate(async () => {
    const images = [...document.querySelectorAll<HTMLImageElement>('[data-connecteur] img')];
    for (const img of images) img.loading = 'eager';
    const echecs: string[] = [];
    await Promise.all(images.map((img) => img.decode().catch(() => { echecs.push(img.getAttribute('src')!); })));
    const debordent = images.filter((img) => {
      const carte = img.closest('[data-connecteur]')!.getBoundingClientRect();
      const r = img.getBoundingClientRect();
      return r.width === 0 || r.height === 0 || r.left < carte.left - 0.5 || r.right > carte.right + 0.5;
    }).map((img) => img.getAttribute('src'));
    const sansTaille = images.filter((img) => !img.getAttribute('width') || !img.getAttribute('height') || img.getAttribute('decoding') !== 'async' || img.getAttribute('loading') === null).map((img) => img.getAttribute('src'));
    return { total: images.length, echecs, debordent, sansTaille };
  });
  expect(bilan.total).toBe(CONNECTEURS.filter((c) => c.logo).length);
  expect(bilan.echecs, 'logo qui ne se décode pas').toEqual([]);
  expect(bilan.debordent, 'logo vide ou hors de sa carte').toEqual([]);
  expect(bilan.sansTaille, 'width, height, decoding et loading posés').toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
});

test('« Dans vos outils » d’une fiche mène à la carte du logiciel', async ({ page }) => {
  const fiche = AGENTS.find((agent) => agent.publie && agent.destination.type === 'fiche')!;
  await page.goto(cheminAgent(fiche));
  const lien = page.locator('[data-agent-outils] a').first();
  const href = await lien.getAttribute('href');
  const carte = CONNECTEURS.find((c) => c.nom === fiche.logiciels[0])!;
  expect(href).toBe(`${ROUTE}#${carte.id}`);
  await lien.click();
  await expect(page).toHaveURL(new RegExp(`${ROUTE}#${carte.id}$`));
  await expect(page.locator(`[id="${carte.id}"] h3`)).toBeInViewport();
});

test('le catalogue commun ouvre les robots, les agents et le contact sans ancien rayon de guides', async ({ page }) => {
  await page.goto(ROUTE);
  await expect(page.locator('[data-integration-cards], [data-guide-product]')).toHaveCount(0);
  await expect(page.locator('main')).not.toContainText('Guides par environnement');
  for (const path of ['/automatisation-cabinet-comptable', '/agents-ia']) {
    const link = page.locator(`#suite a[href="${path}"]`);
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.locator('main h1')).toBeVisible();
    await page.goto(ROUTE);
  }
  await page.locator('#suite a', { hasText: 'Confier une première tâche' }).click();
  await expect(page).toHaveURL(/\/contact$/);
});
