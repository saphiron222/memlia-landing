import { test, expect, type Page } from '@playwright/test';
import { AGENTS, FICHES, GROUPES, HUB, cheminAgent, comptesParGroupe, type GroupeId, type Specialiste } from '../../src/data/specialistes';
import { decouperArret, gabaritDe } from '../../src/data/specialistes/gabarit';
import { POLES } from '../../src/data/familles';

/**
 * Le hub `/agents-ia` (plan du 15/10/2026, tâche 4 ; spec §1 ; annexe E1, I4, I5, I6).
 *
 * Tout ce que la page affiche se lit dans les données : les douze cartes, leur ordre et leur destination, le compte
 * de chaque filtre, le trio du héros. Rien n'est recopié ici (« douze », « 5 + 3 + 4 ») : un agent ajouté ou déplacé
 * doit trouver sa carte, son compte et sa disposition sans retoucher ce fichier.
 *
 * Les filtres sont jugés sans JavaScript : ce qui marche ici marche par le seul CSS (radios + `:has()`). La disposition
 * de chaque état se mesure dans le navigateur, carte par carte, contre la règle du système de page (§ 5) : les règles
 * de grille de global.css comptent les cartes masquées (E1, mesuré dans Chromium le 15/10/2026), seule la surcharge
 * par filtre tient 3 + 2, 3 et 2 × 2.
 */
const ROUTE = HUB.chemin;
const COMPTES = comptesParGroupe();
/** Seuils de la grille, en px de largeur de grille : ceux de global.css (36 et 56 rem). */
const DEUX_COLONNES = 576;
const TROIS_COLONNES = 896;
const LARGEURS = [375, 768, 1440];

/** « Comptabilité » → « comptabilité » ; « RH du cabinet » garde son sigle. */
const metierEnPhrase = (libelle: string) => (/^\p{Lu}\p{Lu}/u.test(libelle) ? libelle : libelle.charAt(0).toLocaleLowerCase('fr') + libelle.slice(1));
const nomAccessible = (agent: Specialiste) => `${agent.prenom}, agent IA ${metierEnPhrase(agent.libelle)}`;

/** Colonnes attendues pour n cartes dans une grille de cette largeur (système de page, § 5). */
function colonnesAttendues(nombre: number, largeurGrille: number): number {
  if (largeurGrille < DEUX_COLONNES || nombre === 1) return 1;
  if (largeurGrille < TROIS_COLONNES) return nombre % 2 === 0 ? 2 : 1;
  return nombre === 2 || nombre === 4 ? 2 : 3;
}
function rangeesAttendues(nombre: number, colonnes: number): number[] {
  return Array.from({ length: Math.ceil(nombre / colonnes) }, (_, i) => Math.min(colonnes, nombre - i * colonnes));
}

/** Les cartes visibles, groupées par rangée, mesurées contre leur grille. */
async function disposition(page: Page) {
  return page.locator('[data-annuaire] .cartes').evaluate((grille) => {
    const boite = grille.getBoundingClientRect();
    const visibles = [...grille.children].filter((e) => getComputedStyle(e).display !== 'none').map((e) => ({
      slug: (e as HTMLElement).dataset.carteAgent ?? '',
      rect: e.getBoundingClientRect(),
    }));
    const rangees = new Map<number, DOMRect[]>();
    for (const { rect } of visibles) {
      const cle = [...rangees.keys()].find((y) => Math.abs(y - rect.top) <= 1) ?? rect.top;
      rangees.set(cle, [...(rangees.get(cle) ?? []), rect]);
    }
    return {
      largeurGrille: boite.width,
      slugs: visibles.map((v) => v.slug),
      largeurs: visibles.map((v) => v.rect.width),
      rangees: [...rangees.values()].map((r) => ({
        nombre: r.length,
        gauche: Math.min(...r.map((x) => x.left)) - boite.left,
        droite: boite.right - Math.max(...r.map((x) => x.right)),
      })),
    };
  });
}

/** Un état de filtre : ses cartes, dans l'ordre des données, et sa disposition selon la règle du nombre. */
async function verifierEtat(page: Page, attendus: readonly Specialiste[], etat: string) {
  const d = await disposition(page);
  expect(d.slugs, `${etat} : cartes visibles, dans l'ordre des données`).toEqual(attendus.map((a) => a.slug));
  const colonnes = colonnesAttendues(attendus.length, d.largeurGrille);
  expect(d.rangees.map((r) => r.nombre), `${etat} : rangées à ${Math.round(d.largeurGrille)} px de grille`).toEqual(rangeesAttendues(attendus.length, colonnes));
  expect(Math.max(...d.largeurs) - Math.min(...d.largeurs), `${etat} : même largeur pour toutes les cartes`).toBeLessThanOrEqual(1.5);
  d.rangees.forEach((r, i) => {
    if (i < d.rangees.length - 1) {
      expect(r.gauche, `${etat} : rangée ${i + 1} pleine à gauche`).toBeLessThanOrEqual(1.5);
      expect(r.droite, `${etat} : rangée ${i + 1} pleine à droite`).toBeLessThanOrEqual(1.5);
    } else {
      expect(Math.abs(r.gauche - r.droite), `${etat} : dernière rangée centrée`).toBeLessThanOrEqual(1.5);
      if (colonnes > 1) expect(r.nombre, `${etat} : aucune carte orpheline`).toBeGreaterThanOrEqual(2);
    }
  });
}

const groupe = (id: GroupeId) => AGENTS.filter((agent) => agent.groupe === id);
const echapper = (texte: string) => texte.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test.describe('le hub sans JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('un seul h1, celui des données, repris par og:title ; le héros définit l’agent IA et mène à l’annuaire', async ({ page }) => {
    await page.goto(ROUTE);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText(HUB.h1);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', HUB.h1);
    await expect(page).toHaveTitle(HUB.titreOnglet);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', HUB.description);
    expect(HUB.description.startsWith(HUB.descriptionLead)).toBe(true);
    await expect(page.locator('main .page-chapeau')).toHaveText(HUB.definition);
    await expect(page.locator('main a[href="#annuaire"]')).toHaveCount(1);
    await expect(page.locator('#annuaire')).toHaveCount(1);
  });

  test('le média du héros nomme le trio des données', async ({ page }) => {
    await page.goto(ROUTE);
    const media = page.locator('main .page-hero img');
    await expect(media).toHaveAttribute('src', '/proofs/v2/49-hero-agents-ia.webp');
    const alt = (await media.getAttribute('alt')) ?? '';
    for (const slug of HUB.trio) {
      const agent = AGENTS.find((a) => a.slug === slug)!;
      expect(alt, `alt du héros : ${agent.prenom}`).toContain(agent.prenom);
      expect(alt, `alt du héros : ${agent.libelle}`).toContain(metierEnPhrase(agent.libelle));
    }
  });

  test('chaque agent a sa carte, dans l’ordre des données ; la carte entière mène à sa destination', async ({ page }) => {
    await page.goto(ROUTE);
    const cartes = page.locator('[data-carte-agent]');
    await expect(cartes).toHaveCount(AGENTS.length);
    for (const [i, agent] of AGENTS.entries()) {
      const carte = cartes.nth(i);
      await expect(carte).toBeVisible();
      await expect(carte).toHaveAttribute('data-carte-agent', agent.slug);
      const lien = carte.locator('a');
      await expect(lien, `${agent.slug} : un seul lien, la carte entière`).toHaveCount(1);
      await expect(lien).toHaveClass(/\bcarte\b/);
      await expect(lien).toHaveAttribute('href', cheminAgent(agent));
      await expect(lien).toHaveAccessibleName(nomAccessible(agent));
      await expect(lien).toHaveAccessibleDescription(agent.ligne);
      await expect(carte).toContainText(POLES[agent.teinte].libelle);
      await expect(carte.locator('.carte-titre')).toHaveText(agent.prenom);
      await expect(carte).toContainText(agent.libelle);
      await expect(carte).toContainText(agent.ligne);
      await expect(carte).toContainText(`Rencontrer ${agent.prenom}`);
    }
  });

  test('le compteur et le compte de chaque filtre viennent des données ; « Tous » est l’état par défaut', async ({ page }) => {
    await page.goto(ROUTE);
    await expect(page.locator('[data-annuaire-compteur]')).toHaveText(`${AGENTS.length} agents IA`);
    const filtres = page.getByRole('group', { name: HUB.annuaire.legende });
    await expect(filtres).toHaveCount(1);
    const tous = page.getByRole('radio', { name: new RegExp(`^Tous, ${AGENTS.length} agents$`) });
    await expect(tous).toBeChecked();
    for (const { id, libelle } of GROUPES) {
      const radio = page.getByRole('radio', { name: `${libelle}, ${COMPTES[id]} agents` });
      await expect(radio, libelle).toHaveCount(1);
      await expect(radio).not.toBeChecked();
    }
    await expect(page.getByRole('radio')).toHaveCount(GROUPES.length + 1);
  });

  for (const largeur of LARGEURS) {
    test(`à ${largeur} px, chaque filtre montre son groupe, disposé selon le nombre de ses cartes`, async ({ page }) => {
      await page.setViewportSize({ width: largeur, height: 900 });
      await page.goto(ROUTE);
      await verifierEtat(page, AGENTS, 'Tous');
      for (const { id, libelle } of GROUPES) {
        await page.locator(`label[for="filtre-${id}"]`).click();
        await expect(page.getByRole('radio', { name: new RegExp(`^${libelle}, `) })).toBeChecked();
        await verifierEtat(page, groupe(id), libelle);
      }
      await page.locator('label[for="filtre-tous"]').click();
      await verifierEtat(page, AGENTS, 'Tous, de retour');
    });
  }

  test('à 1440 px, les dispositions de la spécification : 3 × 4, 3 + 2 centrées, 3, 2 × 2', async ({ page }) => {
    // Témoin lisible de la règle ci-dessus sur les données du 15/10/2026 : il échoue si un agent change de groupe,
    // ce qui est voulu (la spécification se relit alors).
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(ROUTE);
    expect((await disposition(page)).rangees.map((r) => r.nombre)).toEqual([3, 3, 3, 3]);
    const attendu: Record<GroupeId, number[]> = { 'production-conseil': [3, 2], 'relation-client': [3], 'vie-cabinet': [2, 2] };
    for (const { id } of GROUPES) {
      await page.locator(`label[for="filtre-${id}"]`).click();
      expect((await disposition(page)).rangees.map((r) => r.nombre), id).toEqual(attendu[id]);
    }
  });

  test('aucun script de filtre : l’annuaire n’en porte aucun, aucun script de la page ne le pilote', async ({ page, request }) => {
    await page.goto(ROUTE);
    await expect(page.locator('[data-annuaire]'), 'l’annuaire existe : le contrôle ne lit pas une page vide').toHaveCount(1);
    await expect(page.locator('[data-annuaire] script')).toHaveCount(0);
    const sources = await page.locator('script').evaluateAll((scripts) => scripts.map((s) => ({ src: s.getAttribute('src'), texte: s.textContent ?? '' })));
    for (const { src, texte } of sources) {
      const code = src ? await (await request.get(src)).text() : texte;
      expect(code, `script ${src ?? 'en ligne'}`).not.toMatch(/filtre-|data-agent-groupe|carteAgent|data-carte-agent/);
    }
  });

  test('à 375 px, les filtres passent à la ligne sans défilement horizontal, cibles de 44 px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(ROUTE);
    const fieldset = page.locator('[data-annuaire] fieldset');
    const mesure = await fieldset.evaluate((el) => ({ scroll: el.scrollWidth, client: el.clientWidth }));
    expect(mesure.scroll).toBeLessThanOrEqual(mesure.client);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
    const libelles = fieldset.locator('label');
    const hauts = new Set<number>();
    for (const libelle of await libelles.all()) {
      const boite = (await libelle.boundingBox())!;
      expect(boite.x).toBeGreaterThanOrEqual(0);
      expect(boite.x + boite.width).toBeLessThanOrEqual(375);
      expect(boite.height).toBeGreaterThanOrEqual(44);
      hauts.add(Math.round(boite.y));
    }
    expect(hauts.size, 'les puces passent à la ligne').toBeGreaterThan(1);
  });

  test('au clavier : les flèches parcourent les filtres, le focus se voit, le compte est lu dans le libellé', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(ROUTE);
    const ordre = [{ id: 'tous', libelle: 'Tous', nombre: AGENTS.length }, ...GROUPES.map((g) => ({ ...g, nombre: COMPTES[g.id] }))];
    await page.locator('#filtre-tous').focus();
    await page.keyboard.press('ArrowRight');
    for (const [i, filtre] of ordre.slice(1).entries()) {
      const radio = page.locator(`#filtre-${filtre.id}`);
      await expect(radio).toBeFocused();
      await expect(radio).toBeChecked();
      await expect(radio).toHaveAccessibleName(`${filtre.libelle}, ${filtre.nombre} agents`);
      const libelle = page.locator(`label[for="filtre-${filtre.id}"]`);
      // Le nom dit ce que la puce montre : son libellé et son compte.
      await expect(libelle).toHaveText(new RegExp(`^\\s*${echapper(filtre.libelle)}\\s*${filtre.nombre}\\s*$`));
      await expect(libelle).toHaveCSS('outline-style', 'solid');
      expect(parseFloat(await libelle.evaluate((el) => getComputedStyle(el).outlineWidth))).toBeGreaterThanOrEqual(2);
      expect((await disposition(page)).slugs).toEqual(groupe(filtre.id as GroupeId).map((a) => a.slug));
      if (i < ordre.length - 2) await page.keyboard.press('ArrowRight');
    }
    // La flèche revient au premier filtre : « Tous » rend l'annuaire entier.
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#filtre-tous')).toBeFocused();
    expect((await disposition(page)).slugs).toEqual(AGENTS.map((a) => a.slug));
  });

  test('aucune capitale calculée dans la page (text-transform, petites capitales)', async ({ page }) => {
    await page.goto(ROUTE);
    await expect(page.locator('h1'), 'la page du hub, pas une page d’erreur').toHaveText(HUB.h1);
    const fautes = await page.locator('main').evaluate((main) => [main, ...main.querySelectorAll('*')].flatMap((el) => {
      const style = getComputedStyle(el);
      const motifs = [];
      if (style.textTransform === 'uppercase') motifs.push('text-transform: uppercase');
      if (/small-caps|all-small-caps|petite-caps|unicase|titling-caps/.test(style.fontVariantCaps)) motifs.push(`font-variant-caps: ${style.fontVariantCaps}`);
      return motifs.map((m) => `${el.tagName.toLowerCase()}.${el.className} : ${m}`);
    }));
    expect(fautes).toEqual([]);
  });

  test('monogramme quand l’avatar manque : l’initiale teintée, masquée aux lecteurs d’écran, jamais une image cassée', async ({ page }) => {
    await page.goto(ROUTE);
    for (const agent of AGENTS) {
      const carte = page.locator(`[data-carte-agent="${agent.slug}"]`);
      if (agent.avatar === null) {
        await expect(carte.locator('img'), `${agent.slug} : aucune image sans avatar`).toHaveCount(0);
        const monogramme = carte.locator('[data-monogramme]');
        await expect(monogramme).toHaveCount(1);
        await expect(monogramme).toHaveAttribute('aria-hidden', 'true');
        await expect(monogramme).toHaveText(agent.prenom.charAt(0));
        await expect(monogramme).toBeVisible();
      } else {
        await expect(carte.locator('img')).toHaveAttribute('alt', agent.avatar.alt);
      }
    }
    for (const image of await page.locator('main img').all()) {
      expect((await image.getAttribute('alt'))?.trim(), 'aucun alt vide').toBeTruthy();
      expect(await image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0), 'aucune image cassée').toBe(true);
    }
  });

  test('sous l’annuaire : la définition détaillée, le tableau des métiers et la règle de chacun, depuis les données', async ({ page }) => {
    await page.goto(ROUTE);
    await expect(page.locator('main h2', { hasText: HUB.derriere.titre })).toHaveCount(1);
    await expect(page.locator('[data-derriere] li')).toHaveText(HUB.derriere.gestes.map((g) => new RegExp(`${echapper(g.terme)}[\\s\\S]*${echapper(g.texte)}`)));
    await expect(page.locator('[data-derriere] a[href="/methode"]')).toHaveText(HUB.derriere.action.libelle);
    await expect(page.locator('[data-definition] .ligne')).toHaveCount(HUB.definitionDetaillee.lignes.length);
    const lignes = page.locator('[data-metiers] tbody tr');
    await expect(lignes).toHaveCount(AGENTS.length);
    for (const [i, agent] of AGENTS.entries()) {
      await expect(lignes.nth(i).locator('th[scope="row"]')).toContainText(agent.prenom);
      await expect(lignes.nth(i).locator('th[scope="row"]')).toContainText(agent.libelle);
      await expect(lignes.nth(i).locator('td')).toHaveText([...agent.frontiereEnBref]);
    }
    await expect(page.locator('[data-metiers] thead th')).toHaveText([...HUB.metiers.colonnes]);
    await expect(page.locator('main a[href="/contact"]', { hasText: HUB.sansAgent.action.libelle })).toHaveCount(1);
    await expect(page.locator('#suite h2')).toHaveText(HUB.appel.titre);
  });

  test('à 375 px, le tableau empilé aligne chaque valeur sur un seul bord gauche, aucune bribe sous son libellé', async ({ page }) => {
    // Revue de la tâche 4 (I1) : une cellule dont le texte se découpait en plusieurs éléments de grille laissait
    // « LCB-FT » ou « sous-traitants » seul sous la colonne du libellé. Chaque ligne de texte de chaque valeur doit
    // commencer au même bord gauche, le même pour toutes les cellules.
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(ROUTE);
    const bords = await page.locator('[data-metiers] tbody td').evaluateAll((cellules) => cellules.map((td) => {
      const plage = document.createRange();
      plage.selectNodeContents(td);
      const lignes = new Map<number, number>();
      for (const r of plage.getClientRects()) {
        if (r.width === 0 || r.height === 0) continue;
        const cle = [...lignes.keys()].find((y) => Math.abs(y - r.top) <= 2) ?? r.top;
        lignes.set(cle, Math.min(lignes.get(cle) ?? Infinity, r.left));
      }
      return { texte: (td.textContent ?? '').trim(), bords: [...lignes.values()].map(Math.round) };
    }));
    expect(bords.length).toBe(AGENTS.length * 3);
    const reference = bords[0].bords[0];
    for (const { texte, bords: b } of bords) {
      expect(b.length, `« ${texte} » : au moins une ligne`).toBeGreaterThan(0);
      for (const bord of b) expect(Math.abs(bord - reference), `« ${texte} » : une ligne hors de la colonne des valeurs`).toBeLessThanOrEqual(1);
    }
  });

  for (const largeur of [320, 375, 640, 768, 1024, 1440]) {
    test(`à ${largeur} px, le libellé du pôle et la tuile de l’avatar ne se croisent sur aucune carte`, async ({ page }) => {
      // Revue de la tâche 4 (I2) : « Facturation et recouvrement du cabinet » passait sur deux lignes, sous la tuile.
      await page.setViewportSize({ width: largeur, height: 900 });
      await page.goto(ROUTE);
      const cartes = await page.locator('[data-carte-agent]').evaluateAll((items) => items.map((li) => {
        const p = li.querySelector('.agent-pole')!.getBoundingClientRect();
        const t = li.querySelector('.agent-tuile')!.getBoundingClientRect();
        const entete = li.querySelector('.agent-entete')!.getBoundingClientRect();
        return {
          slug: (li as HTMLElement).dataset.carteAgent,
          croisent: p.left < t.right && p.right > t.left && p.top < t.bottom && p.bottom > t.top,
          dansLeBandeau: p.top >= entete.top - 0.5 && p.bottom <= entete.bottom + 0.5 && p.right <= entete.right + 0.5,
        };
      }));
      expect(cartes).toHaveLength(AGENTS.length);
      for (const carte of cartes) {
        expect(carte.croisent, `${carte.slug} : libellé du pôle sous la tuile`).toBe(false);
        expect(carte.dansLeBandeau, `${carte.slug} : libellé du pôle hors du bandeau`).toBe(true);
      }
    });
  }

  test('JSON-LD : CollectionPage et ItemList des cartes du DOM, dans leur ordre ; aucun Service, aucune FAQPage', async ({ page }) => {
    await page.goto(ROUTE);
    const blocs = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(blocs).toHaveLength(1);
    const graphe = JSON.parse(blocs[0])['@graph'] as Record<string, unknown>[];
    const types = graphe.map((n) => n['@type']);
    expect(types).toContain('CollectionPage');
    expect(types).not.toContain('Service');
    expect(types).not.toContain('FAQPage');
    const liste = graphe.find((n) => n['@type'] === 'ItemList') as { numberOfItems: number; itemListElement: { url: string; position: number }[] };
    const hrefs = await page.locator('[data-carte-agent] a').evaluateAll((liens) => liens.map((a) => a.getAttribute('href')));
    expect(liste.numberOfItems).toBe(hrefs.length);
    expect(liste.itemListElement.map((e) => e.url)).toEqual(hrefs.map((h) => `https://memlia.fr${h}`));
    const pageNode = graphe.find((n) => n['@type'] === 'CollectionPage') as { headline: string; url: string };
    expect(pageNode.headline).toBe(HUB.h1);
    expect(pageNode.url).toBe(`https://memlia.fr${ROUTE}`);
  });
});

test.describe('le hub avec JavaScript', () => {
  test('les apparitions et la navigation ne masquent aucune carte, les filtres restent du CSS', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(ROUTE);
    await verifierEtat(page, AGENTS, 'Tous, avec JavaScript');
    const [premier] = GROUPES;
    await page.locator(`label[for="filtre-${premier.id}"]`).click();
    await verifierEtat(page, groupe(premier.id), `${premier.libelle}, avec JavaScript`);
    for (const slug of groupe(premier.id).map((a) => a.slug)) {
      await expect(page.locator(`[data-carte-agent="${slug}"] a`)).toBeVisible();
    }
  });
});

/**
 * Les fiches `/agents-ia/<métier>` (tâche 6 ; spec §2 et §2.1). Une boucle sur les fiches publiées : la tâche 6 n'en
 * publie qu'une (Comptabilité), la tâche 9 les neuf, sans retoucher ce fichier. Tout ce qui est attendu se lit dans les
 * données de l'agent et dans le gabarit composé (`gabaritDe`), jamais recopié ici.
 */
const FICHES_PUBLIEES = FICHES.filter((agent) => agent.publie === true);

test('au moins une fiche est publiée : les tests des fiches ne tournent pas à vide', () => {
  expect(FICHES_PUBLIEES.length).toBeGreaterThan(0);
});

for (const agent of FICHES_PUBLIEES) {
  const fiche = agent.fiche!;
  const g = gabaritDe(agent);
  const chemin = cheminAgent(agent);

  test.describe(`la fiche ${chemin} sans JavaScript`, () => {
    test.use({ javaScriptEnabled: false });

    test('un seul h1, celui des données, repris par og:title et le headline ; titre, description et fil à trois niveaux', async ({ page }) => {
      await page.goto(chemin);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).toHaveText(fiche.h1);
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', fiche.h1);
      await expect(page).toHaveTitle(fiche.titreOnglet);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', fiche.description);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://memlia.fr${chemin}`);
      const fil = page.locator('main nav[aria-label="Fil d’Ariane"] li');
      await expect(fil).toHaveText(['Accueil', HUB.ariane, agent.libelle]);
      await expect(fil.nth(1).locator('a')).toHaveAttribute('href', HUB.chemin);
      await expect(fil.nth(2)).toHaveAttribute('aria-current', 'page');
      const blocs = await page.locator('script[type="application/ld+json"]').allTextContents();
      expect(blocs).toHaveLength(1);
      const graphe = JSON.parse(blocs[0])['@graph'] as Record<string, any>[];
      const deType = (type: string) => graphe.filter((n) => [].concat(n['@type']).includes(type as never));
      expect(deType('Service')).toHaveLength(1);
      expect(deType('Service')[0].alternateName).toContain(agent.prenom);
      expect(deType('FAQPage')).toHaveLength(0);
      expect(deType('BreadcrumbList')).toHaveLength(1);
      expect(deType('BreadcrumbList')[0].itemListElement).toHaveLength(3);
      expect(deType('WebPage')[0].headline).toBe(fiche.h1);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', `https://memlia.fr/social${new URL(fiche.image.url).pathname}.jpg`);
    });

    test('le menu marque « Par métier » et son groupe : la fiche est dans la section des agents IA', async ({ page }) => {
      await page.goto(chemin);
      await expect(page.locator('.nav-centre a[href="/agents-ia"]')).toHaveAttribute('aria-current', 'true');
      await expect(page.locator('[aria-controls="sous-menu-automatise"]')).toHaveAttribute('aria-current', 'true');
    });

    test('le héros : l’étiquette de l’agent, le chapeau, le bouton vers /contact et l’ancre vers ce qu’il remet ; aucun prix', async ({ page }) => {
      await page.goto(chemin);
      const heros = page.locator('[data-agent-heros]');
      await expect(heros.locator('[data-agent-etiquette]')).toHaveText(g.etiquette);
      await expect(heros.locator('[data-agent-chapeau]')).toHaveText(fiche.chapeau);
      await expect(heros.locator('a.btn-principal[href="/contact"]')).toHaveText(/Confier une première tâche/);
      await expect(heros.locator(`a[href="#${g.livrables.ancre}"]`)).toHaveText(g.ancreRemet);
      await expect(page.locator(`#${g.livrables.ancre}`)).toHaveCount(1);
      const texte = (await page.locator('main').innerText()).replace(/\s+/g, ' ');
      expect(texte, 'aucun montant').not.toMatch(/€|\d\s*euros?\b|\bEUR\b/i);
    });

    test('le rejeu : en-tête, dossier fictif, règle, tableau accessible, une puce par ligne, la ligne Arrêt barrée et son motif lisible', async ({ page }) => {
      await page.goto(chemin);
      const rejeu = page.locator('[data-agent-rejeu]');
      await expect(rejeu).toHaveCount(1);
      await expect(rejeu.locator('h2, h3').first()).toHaveText(g.rejeu.entete);
      await expect(rejeu).toContainText(agent.demonstration.dossier);
      await expect(rejeu).toContainText(agent.demonstration.regle);
      await expect(rejeu.locator('table caption')).toHaveCount(1);
      await expect(rejeu.locator('thead th')).toHaveText([...g.rejeu.colonnes]);
      const lignes = rejeu.locator('tbody tr');
      await expect(lignes).toHaveCount(agent.demonstration.cas.length);
      for (const [i, unCas] of agent.demonstration.cas.entries()) {
        const ligne = lignes.nth(i);
        await expect(ligne).toHaveAttribute('data-issue', unCas.issue);
        await expect(ligne.locator('th[scope="row"]')).toHaveText(unCas.cas);
        await expect(ligne.locator('[data-issue-puce]')).toHaveText(unCas.issue);
        const barres = ligne.locator('[data-barre]');
        if (unCas.issue === 'Arrêt') {
          const { barre: avant, motif } = decouperArret(unCas.sortie);
          await expect(barres, 'le cas et ce qui n’a pas été proposé sont barrés').toHaveCount(2);
          for (const barre of await barres.all()) expect(await barre.evaluate((el) => getComputedStyle(el).textDecorationLine)).toContain('line-through');
          await expect(barres.nth(1)).toHaveText(avant);
          const raison = ligne.locator('[data-motif]');
          await expect(raison).toHaveText(motif);
          await expect(raison).toBeVisible();
          // Un trait se propage aux descendants sans paraître dans leur style calculé : le motif et chacun de ses
          // ancêtres jusqu'à la ligne doivent être sans trait.
          const traits = await raison.evaluate((el) => {
            const vus: string[] = [];
            for (let n: Element | null = el; n && n.tagName !== 'TR'; n = n.parentElement) vus.push(getComputedStyle(n).textDecorationLine);
            return vus;
          });
          expect(traits.filter((trait) => trait.includes('line-through')), 'le motif reste lisible, sans trait, lui ni ses ancêtres').toEqual([]);
        } else {
          await expect(barres, `${unCas.issue} : rien de barré`).toHaveCount(0);
          await expect(ligne.locator('td').first()).toHaveText(unCas.sortie);
        }
      }
      // Aucun minuteur, compteur ni champ simulé ; aucun script dans le rejeu (rendu au build).
      await expect(rejeu.locator('input, textarea, select, button, script, progress, meter, time')).toHaveCount(0);
      const source = rejeu.locator('a');
      if (fiche.pageDeLaRegle) {
        await expect(source).toHaveCount(1);
        await expect(source).toHaveAttribute('href', fiche.pageDeLaRegle);
      } else {
        await expect(source).toHaveCount(0);
      }
    });

    test('ce que l’agent remet : deux exemples fictifs en attente de validation, puis ce qui vient avec les accès', async ({ page }) => {
      await page.goto(chemin);
      const cellules = page.locator(`#${g.livrables.ancre} .cellule`);
      await expect(cellules).toHaveCount(fiche.livrables.length);
      for (const [i, livrable] of fiche.livrables.entries()) {
        await expect(cellules.nth(i)).toContainText(livrable.titre);
        await expect(cellules.nth(i)).toContainText(livrable.texte);
        if (i < 2) {
          await expect(cellules.nth(i)).toContainText(g.livrables.exemple);
          await expect(cellules.nth(i)).toContainText(g.livrables.attente);
        } else {
          await expect(cellules.nth(i)).toContainText(g.livrables.aVenir);
          await expect(cellules.nth(i)).not.toContainText(g.livrables.attente);
        }
      }
    });

    test('les tâches, la règle écrite, ce qui ne part jamais sans vous, avec ou sans, les voisins et les questions viennent des données', async ({ page }) => {
      await page.goto(chemin);
      const taches = page.locator('[data-agent-taches] .ligne');
      await expect(taches).toHaveCount(fiche.taches.length);
      for (const [i, tache] of fiche.taches.entries()) {
        await expect(taches.nth(i).locator('dt')).toHaveText(tache.geste);
        await expect(taches.nth(i).locator('dd')).toContainText(tache.prepare);
      }
      // Chaque page service liée à l'agent est atteinte depuis sa fiche, ancrée sur le geste.
      for (const slug of agent.servicesLies) await expect(page.locator(`main a[href="/automatisation/${slug}"]`).first()).toBeVisible();
      await expect(page.locator('[data-agent-outils] li')).toHaveText([...agent.logiciels]);
      const regle = page.locator('[data-agent-regle]');
      await expect(regle.locator('h2')).toHaveText(g.regle.titre);
      await expect(regle.locator('table tbody tr')).toHaveCount(fiche.frontiere.length);
      // R25 : la frontière en bref du hub est un extrait de la règle, chaque cellule dans sa colonne.
      const colonnes = await regle.locator('table tbody tr').evaluateAll((lignes) => [0, 1, 2].map((i) => lignes.map((tr) => (tr.querySelectorAll('td')[i]?.textContent ?? '').trim())));
      agent.frontiereEnBref.forEach((cellule, i) => expect(colonnes[i], `colonne ${i + 1}`).toContain(cellule));
      await expect(regle.locator('[data-agent-arrets] li')).toHaveText([...fiche.arrets]);
      await expect(regle.locator('h3', { hasText: 'Ce qui ne part jamais sans vous' })).toHaveCount(1);
      await expect(regle.locator('[data-agent-envois] li')).toHaveCount(fiche.neJamaisSansVous.length);
      for (const [i, envoi] of fiche.neJamaisSansVous.entries()) {
        await expect(regle.locator('[data-agent-envois] li').nth(i)).toContainText(envoi.envoi);
        await expect(regle.locator('[data-agent-envois] li').nth(i)).toContainText(envoi.validation);
      }
      const avecSans = page.locator('[data-agent-avec-sans] tbody tr');
      await expect(avecSans).toHaveCount(fiche.avecSans.length);
      for (const [i, ligne] of fiche.avecSans.entries()) await expect(avecSans.nth(i).locator('td')).toHaveText([ligne.sans, ligne.avec]);
      const voisins = page.locator('[data-agent-voisins] [data-carte-agent]');
      await expect(voisins).toHaveCount(fiche.voisins.length);
      for (const [i, voisin] of fiche.voisins.entries()) {
        const autre = AGENTS.find((a) => a.slug === voisin.agent)!;
        await expect(voisins.nth(i).locator('a')).toHaveAttribute('href', cheminAgent(autre));
      }
      await expect(page.locator('[data-agent-voisins]')).toContainText(g.voisins.phrase);
      await expect(page.locator('[data-agent-voisins] a[href="/methode"]')).toHaveCount(1);
      const questions = page.locator('[data-faq] details');
      await expect(questions).toHaveCount(fiche.faq.questions.length);
      for (const [i, q] of fiche.faq.questions.entries()) {
        await expect(questions.nth(i).locator('summary')).toHaveText(q.question);
        await expect(questions.nth(i)).toContainText(q.reponse);
      }
      await expect(page.locator('#faq-titre')).toHaveText(g.questions.titre);
      // Le rail des questions ne répète pas l'appel : la fiche en porte déjà deux (héros, départ).
      await expect(page.locator('#questions .faq-humain')).toHaveCount(0);
      await expect(page.locator('[data-agent-etapes] .surtitre')).toHaveText(g.etapes.etapes.map((etape) => etape.rang));
      expect(g.etapes.etapes.map((etape) => etape.rang)).toEqual(['01', '02', '03']);
    });

    test('par quelle tâche commencer : trois tâches vers /contact, chacune avec sa famille ; le bouton, la mention, tous les agents', async ({ page }) => {
      await page.goto(chemin);
      const depart = page.locator('[data-agent-depart]');
      await expect(depart.locator('h2')).toHaveText(g.depart.titre);
      const taches = depart.locator('a[data-tache]');
      await expect(taches).toHaveCount(fiche.tachesDepart.length);
      for (const [i, famille] of fiche.tachesDepart.entries()) {
        await expect(taches.nth(i)).toHaveAttribute('data-tache', famille);
        await expect(taches.nth(i)).toHaveAttribute('href', '/contact');
      }
      await expect(depart.locator('a.btn-principal[href="/contact"]')).toHaveCount(1);
      await expect(depart).toContainText(g.depart.mention);
      await expect(page.locator('main a[href="/agents-ia"]', { hasText: g.depart.tous })).toHaveCount(1);
    });

    test('à 1440 px, le H1 tient sur une rangée pleine largeur en 4 lignes au plus, au-dessus du chapeau et du rejeu ; le rejeu garde ses colonnes', async ({ page }) => {
      // Arbitrage R23 : un titre d'intention long ne s'écrase plus dans une demi-colonne.
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(chemin);
      const mesure = await page.evaluate(() => {
        const boite = (sel: string) => document.querySelector(sel)!.getBoundingClientRect();
        const h1 = document.querySelector('main h1')!;
        const style = getComputedStyle(h1);
        const tailles = [...document.querySelectorAll('main h2')].map((h2) => parseFloat(getComputedStyle(h2).fontSize));
        const tableau = document.querySelector('[data-agent-rejeu] .agent-rejeu-tableau')!;
        return {
          lignes: Math.round(h1.getBoundingClientRect().height / parseFloat(style.lineHeight)),
          tailleH1: parseFloat(style.fontSize),
          tailleH2Max: Math.max(...tailles),
          h1: boite('main h1'),
          heros: boite('[data-agent-heros]'),
          chapeau: boite('[data-agent-chapeau]'),
          rejeu: boite('[data-agent-rejeu]'),
          largeurTableau: tableau.getBoundingClientRect().width,
          enteteVisible: getComputedStyle(tableau.querySelector('thead')!).display !== 'none',
        };
      });
      expect(mesure.lignes, 'lignes du H1').toBeLessThanOrEqual(4);
      expect(mesure.tailleH1, 'le H1 n’est pas plus petit qu’un H2').toBeGreaterThanOrEqual(mesure.tailleH2Max);
      expect(mesure.h1.bottom, 'H1 au-dessus du chapeau').toBeLessThanOrEqual(mesure.chapeau.top);
      expect(mesure.h1.bottom, 'H1 au-dessus du rejeu').toBeLessThanOrEqual(mesure.rejeu.top);
      expect(mesure.h1.width, 'H1 sur la largeur du héros, pas dans une colonne').toBeGreaterThan(mesure.rejeu.width);
      expect(mesure.rejeu.left, 'le rejeu à droite du chapeau').toBeGreaterThan(mesure.chapeau.right);
      expect(mesure.largeurTableau, 'tableau du rejeu à 34 rem au moins').toBeGreaterThanOrEqual(544);
      expect(mesure.enteteVisible, 'le rejeu garde ses colonnes, sans s’empiler').toBe(true);
    });

    test('à 375 px, le héros s’empile dans le même ordre : l’agent, le H1, le chapeau, les actions, le rejeu', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(chemin);
      const hauts = await page.evaluate(() => ['[data-agent-etiquette]', 'main h1', '[data-agent-chapeau]', '[data-agent-heros] .btn-principal', '[data-agent-rejeu]']
        .map((sel) => document.querySelector(sel)!.getBoundingClientRect().top));
      expect([...hauts].sort((a, b) => a - b)).toEqual(hauts);
    });

    for (const largeur of [375, 1440]) {
      test(`à ${largeur} px, aucun défilement horizontal ; le rejeu et les tableaux tiennent dans la page`, async ({ page }) => {
        await page.setViewportSize({ width: largeur, height: 900 });
        await page.goto(chemin);
        await expect(page.locator('h1')).toHaveText(fiche.h1);
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
        const debords = await page.locator('main table').evaluateAll((tables) => tables.map((t) => t.getBoundingClientRect().right).filter((droite) => droite > innerWidth + 0.5));
        expect(debords, 'tableau hors de la page').toEqual([]);
      });
    }

    test('aucune capitale calculée dans la fiche', async ({ page }) => {
      await page.goto(chemin);
      await expect(page.locator('h1')).toHaveText(fiche.h1);
      const fautes = await page.locator('main').evaluate((main) => [main, ...main.querySelectorAll('*')].flatMap((el) => {
        const style = getComputedStyle(el);
        return style.textTransform === 'uppercase' || /small-caps|unicase|titling-caps/.test(style.fontVariantCaps) ? [`${el.tagName.toLowerCase()}.${el.className}`] : [];
      }));
      expect(fautes).toEqual([]);
    });
  });
}
