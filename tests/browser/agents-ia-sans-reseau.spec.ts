import { test, expect, type Page } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';
import { FICHES, HUB } from '../../src/data/specialistes';
import { entetesDe, lireBlocs } from '../helpers/pages-headers.mjs';

/**
 * Les agents IA sans réseau, JavaScript actif, sous leur vraie CSP (plan du 15/10/2026, tâche 7 ; annexe I11).
 *
 * La CSP est lue dans `public/_headers`, la source que la Function recopie mot pour mot. Quand le serveur la sert
 * lui-même (Wrangler ou un déploiement : QA_PAGES_DELIVERY=1, comme local-surfaces-delivery.spec.ts) elle doit être
 * exactement celle-là, une seule fois ; sur la preview Astro, qui ne lance pas les Functions, elle est injectée sur la
 * réponse du document. Dans les deux cas le navigateur la fait respecter : un `fetch`, un script inline ou une image
 * tierce deviennent une violation que `securitypolicyviolation` rapporte, et le test les compte.
 *
 * Un « 0 violation » ne prouve que ce que l'instrument voit : les témoins ci-dessous font naître chacune des trois
 * violations attendues, et le test de chargement exige que les scripts de la page se soient exécutés sous la CSP
 * (la classe `js` posée par le script de base), sinon des scripts bloqués rendraient aussi « 0 ».
 */

const BLOCS = lireBlocs(readFileSync('public/_headers', 'utf8'));
const cspDe = (route: string): string => {
  const valeurs = entetesDe(BLOCS, route).get('content-security-policy');
  if (valeurs?.length !== 1) throw new Error(`${route} : une CSP exactement dans _headers (${valeurs?.length ?? 0})`);
  return valeurs[0];
};
const SERVIE_PAR_PAGES = process.env.QA_PAGES_DELIVERY === '1';

const FICHE_PILOTE = '/agents-ia/comptabilite';
/** Le hub et la fiche pilote toujours, puis toute autre fiche dont la page est dans `dist` : celles de la tâche 9 entrent dès qu'elles existent. */
const ROUTES = [HUB.chemin, FICHE_PILOTE, ...FICHES.map((fiche) => `/agents-ia/${fiche.slug}`).filter((route) => route !== FICHE_PILOTE && existsSync(`dist${route}.html`))];
const FORMATS = [{ nom: 'bureau', largeur: 1440, hauteur: 900 }, { nom: 'mobile', largeur: 375, hauteur: 812 }];

interface Sonde {
  servie: string | undefined;
  requetes: { url: string; methode: string }[];
  /** Requêtes parties puis refusées (CSP comprise) : Chromium annonce une requête bloquée par la CSP avant de la refuser. */
  echecs: { url: string; erreur: string }[];
  console: string[];
  erreursPage: string[];
}
type FenetreSondee = Window & { __violations: string[]; __pwn?: number };

/** Branche les instruments avant la navigation : violations CSP, requêtes, console, erreurs de page, CSP du document. */
async function sonder(page: Page, route: string): Promise<Sonde> {
  const csp = cspDe(route);
  const sonde: Sonde = { servie: undefined, requetes: [], echecs: [], console: [], erreursPage: [] };
  await page.addInitScript(() => {
    const fenetre = window as unknown as FenetreSondee;
    fenetre.__violations = [];
    document.addEventListener('securitypolicyviolation', (e) => fenetre.__violations.push(`${e.violatedDirective} ${e.blockedURI}`));
  });
  await page.route('**/*', async (itineraire) => {
    const requete = itineraire.request();
    if (requete.resourceType() !== 'document' || requete.frame() !== page.mainFrame()) return itineraire.continue();
    const reponse = await itineraire.fetch();
    const entetes = reponse.headers();
    sonde.servie = entetes['content-security-policy'];
    return itineraire.fulfill({ response: reponse, headers: { ...entetes, 'content-security-policy': SERVIE_PAR_PAGES ? (sonde.servie ?? csp) : csp } });
  });
  page.on('request', (requete) => sonde.requetes.push({ url: requete.url(), methode: requete.method() }));
  page.on('requestfailed', (requete) => sonde.echecs.push({ url: requete.url(), erreur: requete.failure()?.errorText ?? '' }));
  page.on('console', (message) => { if (message.type() === 'error') sonde.console.push(message.text()); });
  page.on('pageerror', (erreur) => sonde.erreursPage.push(erreur.message));
  return sonde;
}

const violations = (page: Page) => page.evaluate(() => (window as unknown as FenetreSondee).__violations);

/** Parcourt la page de haut en bas, pour que les images paresseuses et l'apparition au défilement s'exécutent. */
async function parcourir(page: Page) {
  await page.evaluate(async () => {
    const image = () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    // `behavior: 'instant'` : global.css lisse le défilement, et un défilement lissé interrompu par le suivant n'atteint rien.
    const vers = (top: number) => window.scrollTo({ top, behavior: 'instant' });
    for (let y = 0; y < document.documentElement.scrollHeight; y += Math.max(innerHeight / 2, 200)) {
      vers(y);
      await image();
    }
    vers(document.documentElement.scrollHeight);
    await image();
    vers(0);
  });
  await page.waitForLoadState('networkidle');
}

async function verifierSansReseau(page: Page, sonde: Sonde, route: string, etape: string) {
  const origine = new URL(page.url()).origin;
  const dehors = sonde.requetes.filter(({ url }) => /^(?:https?|wss?):/.test(url) && new URL(url).origin !== origine);
  expect(dehors, `${route} (${etape}) : requêtes hors origine`).toEqual([]);
  expect(sonde.requetes.filter(({ methode }) => methode !== 'GET'), `${route} (${etape}) : aucune requête qui envoie`).toEqual([]);
  expect(sonde.echecs, `${route} (${etape}) : requêtes refusées ou en échec`).toEqual([]);
  expect(await violations(page), `${route} (${etape}) : violations CSP`).toEqual([]);
  expect(sonde.console, `${route} (${etape}) : erreurs console`).toEqual([]);
  expect(sonde.erreursPage, `${route} (${etape}) : exceptions de la page`).toEqual([]);
}

test('les pages jugées : le hub, la fiche pilote (qui est bien une fiche des données), plus chaque fiche construite', () => {
  expect(FICHES.map((fiche) => `/agents-ia/${fiche.slug}`)).toContain(FICHE_PILOTE);
  expect(ROUTES.slice(0, 2)).toEqual([HUB.chemin, FICHE_PILOTE]);
  expect(new Set(ROUTES).size).toBe(ROUTES.length);
});

for (const route of ROUTES) {
  for (const format of FORMATS) {
    test(`${route} (${format.nom}) : 0 violation CSP, 0 requête hors origine, 0 erreur console, scripts exécutés sous la CSP`, async ({ page }) => {
      await page.setViewportSize({ width: format.largeur, height: format.hauteur });
      const sonde = await sonder(page, route);
      const reponse = await page.goto(route);
      expect(reponse?.status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      await parcourir(page);

      // Le document porte la CSP de _headers, une seule fois quand c'est le serveur qui la sert.
      if (SERVIE_PAR_PAGES) expect(sonde.servie, `${route} : CSP servie par la Function`).toBe(cspDe(route));
      else if (sonde.servie !== undefined) expect(sonde.servie).toBe(cspDe(route));
      await expect(page.locator('main h1')).toHaveCount(1);
      await expect(page.locator('script[src*="cloudflareinsights.com"]')).toHaveCount(0);

      // Témoin que les scripts ont tourné : le script de base pose `js`, puis son observateur fait apparaître ce qui défile.
      await expect(page.locator('html.js')).toHaveCount(1);
      // Le catalogue garde ses contenus visibles sans animation d’apparition.
      await expect(page.locator('main h1')).toBeVisible();
      await verifierSansReseau(page, sonde, route, 'chargement');

      // La navigation survit à la CSP : groupes du menu au bureau, burger sur mobile.
      if (format.nom === 'bureau') {
        const bouton = page.locator('[data-groupe-bouton]').first();
        await bouton.click();
        await expect(bouton).toHaveAttribute('aria-expanded', 'true');
        await page.keyboard.press('Escape');
        await expect(bouton).toHaveAttribute('aria-expanded', 'false');
      } else {
        const burger = page.locator('[data-burger]');
        await burger.click();
        await expect(burger).toHaveAttribute('aria-expanded', 'true');
        await expect(page.locator('[data-menu-mobile]')).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(burger).toHaveAttribute('aria-expanded', 'false');
        const bascule = page.locator('.pied-bascule').first();
        await bascule.scrollIntoViewIfNeeded();
        await bascule.click();
        await expect(bascule).toHaveAttribute('aria-expanded', 'true');
      }
      await verifierSansReseau(page, sonde, route, 'navigation');
    });
  }
}

test.describe('la FAQ de la fiche, JavaScript actif', () => {
  test('elle se replie au chargement, s’ouvre au clic et à l’ancre, sous la CSP', async ({ page }) => {
    const sonde = await sonder(page, FICHE_PILOTE);
    await page.goto(FICHE_PILOTE);
    await page.waitForLoadState('networkidle');
    const items = page.locator('[data-faq] details');
    const total = await items.count();
    expect(total, 'la fiche porte une FAQ').toBeGreaterThanOrEqual(3);
    for (let i = 0; i < total; i += 1) {
      await expect(items.nth(i), `question ${i + 1} repliée`).not.toHaveAttribute('open', /.*/);
      await expect(items.nth(i).locator('.faq-r'), `réponse ${i + 1} masquée tant que repliée`).toBeHidden();
    }
    const premier = items.first();
    await premier.locator('summary').click();
    await expect(premier).toHaveAttribute('open', '');
    await expect(premier.locator('.faq-r')).toBeVisible();
    await expect(premier.locator('.faq-r')).not.toHaveText('');
    await premier.locator('summary').click();
    await expect(premier).not.toHaveAttribute('open', /.*/);

    // Une ancre vers une question l'ouvre, elle seule.
    const cible = await items.nth(2).getAttribute('id');
    expect(cible).toMatch(/^faq-/);
    await page.goto(`${FICHE_PILOTE}#${cible}`);
    await expect(items.nth(2)).toHaveAttribute('open', '');
    await expect(page.locator('[data-faq] details[open]')).toHaveCount(1);
    await verifierSansReseau(page, sonde, FICHE_PILOTE, 'FAQ');
  });

  test('si son script n’arrive pas, la FAQ native reste utilisable', async ({ page }) => {
    await page.route(/Agent\.astro_astro_type_script.*\.js$/, (itineraire) => itineraire.abort());
    await page.goto(FICHE_PILOTE);
    await page.waitForLoadState('networkidle');
    const items = page.locator('[data-faq] details');
    const total = await items.count();
    expect(total).toBeGreaterThanOrEqual(3);
    for (let i = 0; i < total; i += 1) {await items.nth(i).locator('summary').click();await expect(items.nth(i).locator('.faq-r')).toBeVisible();}
  });
});

test.describe('la FAQ de la fiche, sans JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('chaque question native s’ouvre et sa réponse devient lisible', async ({ page }) => {
    await page.goto(FICHE_PILOTE);
    const items = page.locator('[data-faq] details');
    const total = await items.count();
    expect(total).toBeGreaterThanOrEqual(3);
    for (let i = 0; i < total; i += 1) {
      await items.nth(i).locator('summary').click();
      await expect(items.nth(i), `question ${i + 1} ouverte`).toHaveAttribute('open', '');
      const reponse = items.nth(i).locator('.faq-r');
      await expect(reponse).toBeVisible();
      await expect(reponse).not.toHaveText('');
    }
  });
});

test.describe('les témoins : sous cette CSP, ce qui ouvrirait le réseau devient une violation que l’instrument voit', () => {
  test('un fetch du même origine est refusé par connect-src', async ({ page }) => {
    await sonder(page, HUB.chemin);
    await page.goto(HUB.chemin);
    const issue = await page.evaluate(() => fetch('/agents-ia').then(() => 'reçu', () => 'refusé'));
    expect(issue).toBe('refusé');
    expect((await violations(page)).some((v) => v.startsWith('connect-src'))).toBe(true);
  });

  test('un script inline injecté dans la page ne s’exécute pas (script-src)', async ({ page }) => {
    await sonder(page, HUB.chemin);
    await page.goto(HUB.chemin);
    await page.evaluate(() => {
      const script = document.createElement('script');
      script.textContent = 'window.__pwn = 1';
      document.head.append(script);
    });
    expect(await page.evaluate(() => (window as unknown as FenetreSondee).__pwn)).toBeUndefined();
    expect((await violations(page)).some((v) => v.startsWith('script-src'))).toBe(true);
  });

  test('une image d’un tiers n’est pas demandée (img-src)', async ({ page }) => {
    const sonde = await sonder(page, HUB.chemin);
    await page.goto(HUB.chemin);
    await page.evaluate(() => {
      const image = new Image();
      image.src = 'https://tiers.invalid/pixel.png';
      document.body.append(image);
    });
    await expect.poll(async () => (await violations(page)).some((v) => v.startsWith('img-src'))).toBe(true);
    // Chromium annonce la requête puis la refuse (« csp » pour le motif de blocage) : elle n'aboutit jamais.
    await expect.poll(() => sonde.echecs.find(({ url }) => url.includes('tiers.invalid'))?.erreur).toMatch(/csp/i);
  });
});
