import { test, expect, type Page } from '@playwright/test';

/**
 * Kevin, 07/10/2026 : « toutes les cartes du site pareilles », sans carte orpheline, une carte
 * qui se détache du fond et un séparateur visible.
 *
 * Mesuré dans le navigateur, page par page et largeur par largeur :
 *   - un seul dessin : bord, rayon, surface, ombre et marges identiques pour chaque `.carte`,
 *     même pastille, même titre, même texte ; cellules de bande à la même enseigne ;
 *   - une grille sans trou : chaque rangée occupe toute la largeur ; une colonne en mobile ;
 *     2 ou 4 cartes sur deux colonnes ; un multiple de trois sur trois colonnes quand la place
 *     le permet ; jamais trois colonnes pour un autre compte ;
 *   - contrastes : texte AA (4,5:1) sur la carte, bord et filets perceptibles (≥ 1,3:1) ;
 *   - cartes cliquables : cliquables en entier, même survol, même focus ;
 *   - le blog, laissé tel quel, ne porte ni grille ni carte du site.
 */
const ROUTES = [
  '/',
  '/automatisation-cabinet-comptable',
  '/automatisation/rapprochement-bancaire',
  '/automatisation/factures-fournisseurs',
  '/methode',
  '/garanties',
  '/a-propos',
  '/contact',
  '/integrations',
  '/integrations/rapprochement-bancaire-sage',
  '/outils-comptables-gratuits',
  '/outils-comptables-gratuits/calculateur-date-echeance-facture',
  '/outils-comptables-gratuits/bibliotheque-prompts-comptables',
];
/** Le blog garde son propre dessin (Kevin, 07/10/2026 : « les blogs pas besoin de toucher »). */
const BLOG = [
  '/blog',
  '/blog/rubrique/paie-dsn-cabinet-comptable',
  '/blog/rubrique/gestion-pieces-comptables',
  '/blog/automatiser-un-cabinet-comptable-la-carte-des-taches',
  '/blog/controler-les-bulletins-de-paie-avant-la-dsn',
];
const LARGEURS = [375, 768, 1024, 1440];
/** Seuils de la grille, en px : ceux des requêtes de conteneur de global.css (36rem, 56rem). */
const DEUX_COLONNES = 576;
const TROIS_COLONNES = 896;

type Mesure = Awaited<ReturnType<typeof mesurer>>;

async function mesurer(page: Page) {
  return page.evaluate(() => {
    type Rgba = { r: number; g: number; b: number; a: number };
    const rgba = (valeur: string): Rgba => {
      const m = valeur.match(/rgba?\(([^)]+)\)/);
      if (!m) throw new Error(`couleur illisible : ${valeur}`);
      const [r, g, b, a = 1] = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
      return { r, g, b, a };
    };
    const sur = (haut: Rgba, bas: Rgba): Rgba => ({
      r: haut.r * haut.a + bas.r * (1 - haut.a), g: haut.g * haut.a + bas.g * (1 - haut.a), b: haut.b * haut.a + bas.b * (1 - haut.a), a: 1,
    });
    const luminance = ({ r, g, b }: Rgba) => {
      const canal = (v: number) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
      return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
    };
    const contraste = (a: Rgba, b: Rgba) => {
      const [clair, sombre] = [luminance(a), luminance(b)].sort((x, y) => y - x);
      return (clair + 0.05) / (sombre + 0.05);
    };
    /** Le fond réellement peint derrière un élément : on remonte jusqu'au premier fond opaque. */
    const fond = (el: Element | null): Rgba => {
      const pile: Rgba[] = [];
      for (let n = el; n; n = n.parentElement) {
        const c = rgba(getComputedStyle(n).backgroundColor);
        if (c.a > 0) pile.push(c);
        if (c.a >= 1) break;
      }
      return pile.reverse().reduce((bas, haut) => sur(haut, bas), { r: 255, g: 255, b: 255, a: 1 });
    };
    const visible = (el: Element) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden';
    };
    const signature = (el: Element, proprietes: string[]) => {
      const s = getComputedStyle(el);
      return proprietes.map((p) => s.getPropertyValue(p)).join(' | ');
    };
    const cartes = [...document.querySelectorAll('.carte')].filter(visible);
    const cellules = [...document.querySelectorAll('.cellule')].filter(visible);
    const textesAA: { texte: string; ratio: number }[] = [];
    for (const surface of [...cartes, ...cellules]) {
      const support = fond(surface);
      for (const el of surface.querySelectorAll('.carte-titre, .carte-texte, .carte-meta, .carte-action, .carte-texte a')) {
        if (!visible(el)) continue;
        textesAA.push({ texte: (el.textContent ?? '').trim().slice(0, 40), ratio: contraste(sur(rgba(getComputedStyle(el).color), support), support) });
      }
    }
    const separations = [...cartes.map((el) => ({ el, bord: getComputedStyle(el).borderTopColor })),
      ...[...document.querySelectorAll('.bande > .cartes')].filter(visible).map((el) => ({ el, bord: getComputedStyle(el).backgroundColor }))]
      .map(({ el, bord }) => {
        const surface = rgba(getComputedStyle(el.closest('.bande') ? el.querySelector('.cellule') ?? el : el).backgroundColor);
        const derriere = fond(el.parentElement);
        const plein = (c: Rgba) => (c.a >= 1 ? c : sur(c, derriere));
        return {
          contreCarte: contraste(sur(rgba(bord), plein(surface)), plein(surface)),
          contreFond: contraste(sur(rgba(bord), derriere), derriere),
        };
      });
    // Toutes les grilles rendues, même réduites à zéro : une grille écrasée par sa requête de
    // conteneur (largeur tirée de son contenu) doit rougir, pas disparaître du contrôle.
    const grilles = [...document.querySelectorAll('.cartes')].filter((el) => el.getClientRects().length > 0).map((grille) => {
      const boite = grille.getBoundingClientRect();
      const parent = grille.parentElement!;
      const ps = getComputedStyle(parent);
      const pistes = ps.display.includes('grid') ? ps.gridTemplateColumns.split(' ').filter(Boolean).length : 1;
      const contenu = parent.clientWidth - parseFloat(ps.paddingLeft) - parseFloat(ps.paddingRight);
      // Hors grille à plusieurs pistes, la grille de cartes occupe toute la largeur de son parent.
      const pleineLargeur = pistes > 1 ? true : Math.abs(boite.width - contenu) <= 1;
      const enfants = [...grille.children].filter(visible).map((e) => e.getBoundingClientRect());
      const rangees = new Map<number, DOMRect[]>();
      for (const r of enfants) {
        const cle = [...rangees.keys()].find((y) => Math.abs(y - r.top) <= 1) ?? r.top;
        rangees.set(cle, [...(rangees.get(cle) ?? []), r]);
      }
      const trous = [...rangees.values()].filter((rangee) => {
        const gauche = Math.min(...rangee.map((r) => r.left));
        const droite = Math.max(...rangee.map((r) => r.right));
        return Math.abs(gauche - boite.left) > 1.5 || Math.abs(droite - boite.right) > 1.5;
      }).length;
      return {
        nom: grille.className,
        largeur: boite.width,
        nombre: enfants.length,
        colonnes: Math.max(0, ...[...rangees.values()].map((rangee) => rangee.length)),
        trous,
        pleineLargeur,
      };
    });
    return {
      cartes: cartes.map((el) => signature(el, ['border-top-width', 'border-top-style', 'border-top-color', 'border-right-color', 'border-top-left-radius', 'background-color', 'box-shadow', 'padding-top', 'padding-left'])),
      cellules: cellules.map((el) => signature(el, ['background-color', 'padding-top', 'padding-left'])),
      cellulesComme: cartes[0] ? signature(cartes[0], ['background-color', 'padding-top', 'padding-left']) : null,
      filets: [...document.querySelectorAll('.bande > .cartes')].filter(visible).map((el) => getComputedStyle(el).backgroundColor),
      bordsDeBande: [...document.querySelectorAll('.bande')].filter(visible).map((el) => `${getComputedStyle(el).borderTopWidth} ${getComputedStyle(el).borderTopColor}`),
      bordDeCarte: cartes[0] ? getComputedStyle(cartes[0]).borderTopColor : null,
      titres: [...document.querySelectorAll('.carte-titre')].filter(visible).map((el) => signature(el, ['font-family', 'font-size', 'font-weight', 'line-height', 'color'])),
      textes: [...document.querySelectorAll('.carte-texte')].filter(visible).map((el) => signature(el, ['font-size', 'color'])),
      icones: [...document.querySelectorAll('.carte-icone')].filter(visible).map((el) => signature(el, ['width', 'height', 'border-top-width', 'border-top-color', 'border-top-left-radius', 'background-color', 'color'])),
      textesAA,
      separations,
      grilles,
    };
  });
}

const reference = new Map<number, Mesure>();

for (const largeur of LARGEURS) {
  test.describe(`cartes à ${largeur}px`, () => {
    test.beforeAll(async ({ browser }, testInfo) => {
      const page = await browser.newPage({ viewport: { width: largeur, height: 900 }, reducedMotion: 'reduce' });
      await page.goto(new URL('/', testInfo.project.use.baseURL).href);
      await page.evaluate(() => document.fonts.ready);
      await page.mouse.move(0, 0);
      reference.set(largeur, await mesurer(page));
      await page.close();
    });

    for (const route of ROUTES) {
      test(`${route} : un seul dessin, grilles pleines, contrastes`, async ({ page }) => {
        await page.setViewportSize({ width: largeur, height: 900 });
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.goto(route);
        await page.evaluate(() => document.fonts.ready);
        await page.mouse.move(0, 0);
        const m = await mesurer(page);
        const ref = reference.get(largeur)!;

        // Un seul dessin : chaque carte, titre, texte et pastille a la signature de l'accueil.
        expect(m.cartes.length + m.cellules.length, 'la page porte des cartes ou une bande').toBeGreaterThan(0);
        for (const carte of m.cartes) expect.soft(carte, 'carte').toBe(ref.cartes[0]);
        for (const titre of m.titres) expect.soft(titre, 'titre de carte').toBe(ref.titres[0]);
        for (const texte of m.textes) expect.soft(texte, 'texte de carte').toBe(ref.textes[0]);
        for (const icone of m.icones) expect.soft(icone, 'pastille de carte').toBe(ref.icones[0]);
        // La bande parle la même langue : surface et marges de la carte, filets de son bord.
        for (const cellule of m.cellules) expect.soft(cellule, 'cellule de bande').toBe(ref.cellulesComme);
        for (const filet of m.filets) expect.soft(filet, 'filet de bande').toBe(ref.bordDeCarte);
        for (const bord of m.bordsDeBande) expect.soft(bord, 'bord de bande').toBe(`1px ${ref.bordDeCarte}`);

        // Grilles : aucune rangée incomplète, et le nombre de colonnes suit le nombre de cartes.
        for (const g of m.grilles) {
          const nom = `${g.nom} (${g.nombre} cartes, ${Math.round(g.largeur)} px)`;
          expect.soft(g.pleineLargeur, `${nom} : grille plus étroite que son parent`).toBe(true);
          expect.soft(g.largeur, `${nom} : grille écrasée`).toBeGreaterThan(Math.min(280, largeur - 80));
          expect.soft(g.trous, `${nom} : rangée incomplète`).toBe(0);
          if (g.largeur < DEUX_COLONNES) expect.soft(g.colonnes, nom).toBe(1);
          else if (g.nombre % 3 === 0 && g.largeur >= TROIS_COLONNES) expect.soft(g.colonnes, nom).toBe(3);
          else if (g.nombre > 1) expect.soft(g.colonnes, nom).toBe(2);
        }
        if (largeur <= 400) for (const g of m.grilles) expect.soft(g.colonnes, `${g.nom} en mobile`).toBe(1);

        // Contrastes : texte AA sur la carte ; bord et filets perceptibles contre la carte et le fond.
        for (const t of m.textesAA) expect.soft(t.ratio, `contraste « ${t.texte} »`).toBeGreaterThanOrEqual(4.5);
        for (const s of m.separations) {
          expect.soft(s.contreCarte, 'bord contre la surface').toBeGreaterThanOrEqual(1.3);
          expect.soft(s.contreFond, 'bord contre le fond').toBeGreaterThanOrEqual(1.3);
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
      });
    }
  });
}

/** Cartes cliquables : la carte entière mène au lien, avec le même survol et le même focus. */
const CLIQUABLES: [string, string][] = [
  ['/', '/automatisation-cabinet-comptable'],
  ['/automatisation-cabinet-comptable', '/outils-comptables-gratuits/diagnostic-maturite-ia-cabinet'],
  ['/integrations', '/integrations/rapprochement-bancaire-sage'],
  ['/outils-comptables-gratuits', '/outils-comptables-gratuits/bibliotheque-prompts-comptables'],
  ['/outils-comptables-gratuits/calculateur-date-echeance-facture', '/outils-comptables-gratuits'],
];
for (const [route, cible] of CLIQUABLES) {
  test(`${route} : carte cliquable en entier, survol et focus du site`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(route);
    const couleurs = await page.evaluate(() => {
      const sonde = document.createElement('span');
      sonde.style.cssText = 'position:absolute;visibility:hidden;color:var(--carte-bord-survol);outline-color:var(--focus)';
      document.body.append(sonde);
      const s = getComputedStyle(sonde);
      const resultat = { survol: s.color, focus: s.outlineColor };
      sonde.remove();
      return resultat;
    });
    const lien = page.locator(`main .carte-lien[href="${cible}"], main a.carte[href="${cible}"]`).first();
    const carte = lien.locator('xpath=ancestor-or-self::*[contains(concat(" ", normalize-space(@class), " "), " carte ")][1]');
    await carte.scrollIntoViewIfNeeded();
    const boite = (await carte.boundingBox())!;

    // Survol : le bord passe au vert d'appui, comme sur toutes les cartes cliquables.
    await page.mouse.move(boite.x + boite.width - 12, boite.y + boite.height - 12);
    await expect(carte).toHaveCSS('border-top-color', couleurs.survol);
    await page.mouse.move(0, 0);

    // Focus clavier : l'anneau se pose sur la carte entière.
    await page.keyboard.press('Tab');
    await lien.focus();
    await expect(carte).toHaveCSS('outline-style', 'solid');
    await expect(carte).toHaveCSS('outline-color', couleurs.focus);

    // Un clic loin du libellé, dans le coin de la carte, suit le lien de la carte. Le focus a pu
    // faire défiler la page : la boîte se remesure juste avant le clic.
    await carte.scrollIntoViewIfNeeded();
    const coin = (await carte.boundingBox())!;
    await page.mouse.click(coin.x + coin.width - 12, coin.y + coin.height - 12);
    await expect(page).toHaveURL(new RegExp(`${cible.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`));
  });
}

test('le blog reste hors du dessin commun des cartes', async ({ page }) => {
  for (const route of BLOG) {
    await page.goto(route);
    await expect(page.locator('h1'), route).toHaveCount(1);
    await expect(page.locator('.cartes, .carte, .cellule, .bande'), route).toHaveCount(0);
  }
});
