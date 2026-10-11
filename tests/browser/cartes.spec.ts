import { test, expect, type Page } from '@playwright/test';

/**
 * Kevin, 07/10/2026 : « toutes les cartes du site pareilles », sans carte orpheline ni étirée, une
 * carte qui se détache du fond et un séparateur visible. Système de page du 07/10/2026
 * (docs/design/2026-10-07-systeme-de-page.md, § 5).
 *
 * Mesuré dans le navigateur, page par page et largeur par largeur :
 *   - un seul dessin : bord, rayon, surface, ombre et marges identiques pour chaque `.carte`,
 *     même pastille, même titre, même texte que la carte témoin dessinée par global.css ;
 *     cellules de bande à la même enseigne ;
 *   - une grille sans carte étirée ni orpheline : toutes les cartes d'un groupe ont la même
 *     largeur ; chaque rangée est pleine, sauf la dernière, qui se centre et ne porte jamais une
 *     carte seule ; le nombre de colonnes suit le nombre de cartes (trois au plus) ; une bande
 *     remplit toujours ses rangées ;
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
/** Seuils de la grille, en px : ceux des requêtes de conteneur de global.css (36, 48 et 56 rem). */
const DEUX_COLONNES = 576;
const BANDE_TROIS = 768;
const TROIS_COLONNES = 896;

/** Colonnes attendues pour un groupe, selon le système de page (§ 5). */
function colonnesAttendues(nombre: number, largeur: number, bande: boolean): number {
  if (largeur < DEUX_COLONNES || nombre === 1) return 1;
  if (bande) {
    if (nombre === 3) return largeur >= BANDE_TROIS ? 3 : 1;
    return 2;
  }
  if (largeur < TROIS_COLONNES) return nombre % 2 === 0 ? 2 : 1;
  return nombre === 2 || nombre === 4 ? 2 : 3;
}

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
    const PROPRIETES_CARTE = ['border-top-width', 'border-top-style', 'border-top-color', 'border-right-color', 'border-top-left-radius', 'background-color', 'box-shadow', 'padding-top', 'padding-left'];
    const PROPRIETES_TITRE = ['font-family', 'font-size', 'font-weight', 'line-height', 'color'];
    const PROPRIETES_TEXTE = ['font-size', 'color'];
    const PROPRIETES_ICONE = ['width', 'height', 'border-top-width', 'border-top-color', 'border-top-left-radius', 'background-color', 'color'];

    // Carte témoin : le dessin unique tel que global.css le rend, indépendamment du contenu des pages.
    const temoin = document.createElement('div');
    temoin.className = 'carte';
    temoin.setAttribute('aria-hidden', 'true');
    temoin.style.cssText = 'position:absolute;left:-9999px;top:0;width:320px';
    temoin.innerHTML = '<span class="carte-icone"><svg viewBox="0 0 24 24" width="24" height="24"></svg></span>'
      + '<div class="carte-corps"><h3 class="carte-titre">Témoin</h3><p class="carte-texte">Témoin</p></div>';
    (document.querySelector('main') ?? document.body).append(temoin);
    const reference = {
      carte: signature(temoin, PROPRIETES_CARTE),
      cellule: signature(temoin, ['background-color', 'padding-top', 'padding-left']),
      bord: getComputedStyle(temoin).borderTopColor,
      titre: signature(temoin.querySelector('.carte-titre')!, PROPRIETES_TITRE),
      texte: signature(temoin.querySelector('.carte-texte')!, PROPRIETES_TEXTE),
      icone: signature(temoin.querySelector('.carte-icone')!, PROPRIETES_ICONE),
    };
    temoin.remove();

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
      return {
        nom: grille.className,
        bande: !!grille.closest('.bande'),
        largeur: boite.width,
        nombre: enfants.length,
        largeurs: enfants.map((r) => r.width),
        pleineLargeur,
        rangees: [...rangees.values()].map((rangee) => ({
          nombre: rangee.length,
          gauche: Math.min(...rangee.map((r) => r.left)) - boite.left,
          droite: boite.right - Math.max(...rangee.map((r) => r.right)),
        })),
      };
    });
    return {
      reference,
      cartes: cartes.map((el) => signature(el, PROPRIETES_CARTE)),
      cellules: cellules.map((el) => signature(el, ['background-color', 'padding-top', 'padding-left'])),
      filets: [...document.querySelectorAll('.bande > .cartes')].filter(visible).map((el) => getComputedStyle(el).backgroundColor),
      bordsDeBande: [...document.querySelectorAll('.bande')].filter(visible).map((el) => `${getComputedStyle(el).borderTopWidth} ${getComputedStyle(el).borderTopColor}`),
      titres: [...document.querySelectorAll('.carte-titre')].filter(visible).map((el) => signature(el, PROPRIETES_TITRE)),
      textes: [...document.querySelectorAll('.carte-texte')].filter(visible).map((el) => signature(el, PROPRIETES_TEXTE)),
      icones: [...document.querySelectorAll('.carte-icone')].filter(visible).map((el) => signature(el, PROPRIETES_ICONE)),
      textesAA,
      separations,
      grilles,
    };
  });
}

for (const largeur of LARGEURS) {
  test.describe(`cartes à ${largeur}px`, () => {
    for (const route of ROUTES) {
      test(`${route} : un seul dessin, grilles sans carte étirée ni orpheline, contrastes`, async ({ page }) => {
        await page.setViewportSize({ width: largeur, height: 900 });
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.goto(route);
        await page.evaluate(() => document.fonts.ready);
        await page.mouse.move(0, 0);
        const m: Mesure = await mesurer(page);
        const ref = m.reference;

        // Un seul dessin : chaque carte, titre, texte et pastille a la signature de la carte témoin.
        expect(m.cartes.length + m.cellules.length, 'la page porte des cartes ou une bande').toBeGreaterThan(0);
        for (const carte of m.cartes) expect.soft(carte, 'carte').toBe(ref.carte);
        for (const titre of m.titres) expect.soft(titre, 'titre de carte').toBe(ref.titre);
        for (const texte of m.textes) expect.soft(texte, 'texte de carte').toBe(ref.texte);
        for (const icone of m.icones) expect.soft(icone, 'pastille de carte').toBe(ref.icone);
        // La bande parle la même langue : surface et marges de la carte, filets de son bord.
        for (const cellule of m.cellules) expect.soft(cellule, 'cellule de bande').toBe(ref.cellule);
        for (const filet of m.filets) expect.soft(filet, 'filet de bande').toBe(ref.bord);
        for (const bord of m.bordsDeBande) expect.soft(bord, 'bord de bande').toBe(`1px ${ref.bord}`);

        // Grilles : même largeur pour toutes les cartes d'un groupe ; rangées pleines sauf la
        // dernière, centrée et jamais réduite à une carte ; colonnes selon le nombre de cartes.
        for (const g of m.grilles) {
          const nom = `${g.nom} (${g.nombre} cartes, ${Math.round(g.largeur)} px)`;
          expect.soft(g.pleineLargeur, `${nom} : grille plus étroite que son parent`).toBe(true);
          expect.soft(g.largeur, `${nom} : grille écrasée`).toBeGreaterThan(Math.min(280, largeur - 80));
          const colonnes = Math.max(0, ...g.rangees.map((r) => r.nombre));
          expect.soft(colonnes, `${nom} : colonnes`).toBe(colonnesAttendues(g.nombre, g.largeur, g.bande));
          expect.soft(Math.max(...g.largeurs) - Math.min(...g.largeurs), `${nom} : carte étirée`).toBeLessThanOrEqual(1.5);
          g.rangees.forEach((rangee, i) => {
            const derniere = i === g.rangees.length - 1;
            if (g.nombre === 1) {
              // Une destination seule (phase 2 : lien d'action) se range à gauche.
              expect.soft(rangee.gauche, `${nom} : carte seule à gauche`).toBeLessThanOrEqual(1.5);
            } else if (!derniere || g.bande) {
              expect.soft(rangee.gauche, `${nom} : rangée ${i + 1} incomplète`).toBeLessThanOrEqual(1.5);
              expect.soft(rangee.droite, `${nom} : rangée ${i + 1} incomplète`).toBeLessThanOrEqual(1.5);
            } else {
              expect.soft(Math.abs(rangee.gauche - rangee.droite), `${nom} : dernière rangée centrée`).toBeLessThanOrEqual(1.5);
              if (colonnes > 1) expect.soft(rangee.nombre, `${nom} : carte orpheline`).toBeGreaterThanOrEqual(2);
            }
          });
        }
        if (largeur <= 400) for (const g of m.grilles) expect.soft(Math.max(...g.rangees.map((r) => r.nombre)), `${g.nom} en mobile`).toBe(1);

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
