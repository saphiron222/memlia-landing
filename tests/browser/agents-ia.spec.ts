import { test, expect, type Page } from '@playwright/test';
import { AGENTS, GROUPES, HUB, cheminAgent, comptesParGroupe, type GroupeId, type Specialiste } from '../../src/data/specialistes';
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
