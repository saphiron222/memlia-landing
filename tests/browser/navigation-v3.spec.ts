import { test, expect, type Locator, type Page } from '@playwright/test';
import { AUTOMATISE, CAC_PUBLIE } from '../navigation-attendue.mjs';

/**
 * Les deux groupes de la barre. Mêmes gestes pour chacun (souris, trajet continu, clavier) : la boucle
 * porte donc ce qui les distingue, leur intitulé et la page où mène leur première entrée.
 */
const GROUPES = [
  { id: 'cabinets', nom: 'Cabinets', premiere: /\/$/ },
  { id: 'automatise', nom: 'Ce qu’on automatise', premiere: /\/automatisation-cabinet-comptable$/ },
];

/**
 * Rend visible une destination de la barre. Un lien direct l'est déjà ; celui d'un sous-menu ne l'est
 * qu'une fois son groupe ouvert, ce que le clavier fait par le bouton puis Entrée. Le menu mobile
 * affiche tout : rien à ouvrir.
 */
async function rendreVisible(page: Page, nav: Locator, href: string) {
  const lien = nav.locator(`a[href="${href}"]`);
  if (await lien.isVisible()) return;
  await nav.locator('.nav-groupe', { has: page.locator(`a[href="${href}"]`) }).locator('[data-groupe-bouton]').focus();
  await page.keyboard.press('Enter');
}

for (const width of [1024, 1440]) for (const groupe of GROUPES) {
  test(`menu ${groupe.nom} : premier clic souris à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.mouse.move(width - 20, 500);
    const trigger = page.locator(`[aria-controls="sous-menu-${groupe.id}"]`);
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator(`#sous-menu-${groupe.id}`)).toBeVisible();
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await page.locator('h1').click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test(`menu ${groupe.nom} : trajet souris continu à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const trigger = page.locator(`[aria-controls="sous-menu-${groupe.id}"]`);
    const panel = page.locator(`#sous-menu-${groupe.id}`);
    await trigger.hover();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const buttonBox = (await trigger.boundingBox())!;
    const panelBox = (await panel.boundingBox())!;
    const x = buttonBox.x + buttonBox.width / 2;
    await page.mouse.move(x, buttonBox.y + buttonBox.height - 1);
    await page.mouse.move(x, (buttonBox.y + buttonBox.height + panelBox.y) / 2);
    await page.mouse.move(panelBox.x + 40, panelBox.y + 20);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(panel).toBeVisible();
    await panel.locator('a').first().click();
    await expect(page).toHaveURL(groupe.premiere);
  });
}

/** Les cinq destinations qui ne sont pas des entrées de Cabinets : toutes publiées, toutes servies. */
const HUBS = [...AUTOMATISE.map((entree) => entree.href), '/outils-comptables-gratuits', '/blog'];
/** Un guide publié, sous-page de « Dans vos outils ». */
const GUIDE = '/integrations/bulletin-de-paie-sage';

for (const width of [375, 1024, 1440]) {
  test(`hubs globaux et position courante à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of HUBS) {
      await page.goto(path);
      if (width < 1024) await page.locator('[data-burger]').click();
      const nav = page.locator(width < 1024 ? '#menu-mobile' : '.nav-centre');
      await expect(nav.locator(`a[href="${path}"]`)).toHaveAttribute('aria-current', 'page');
      for (const href of HUBS) {
        await rendreVisible(page, nav, href);
        await expect(nav.locator(`a[href="${href}"]`)).toBeVisible();
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
  });
}

test('« Ce qu’on automatise » se marque sur ses trois pages et sur une sous-page de « Dans vos outils »', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const bouton = page.locator('[aria-controls="sous-menu-automatise"]');
  for (const { href } of AUTOMATISE) {
    await page.goto(href);
    await expect(bouton).toHaveAttribute('aria-current', 'true');
  }
  // Un guide est dans la section « Dans vos outils » : le groupe et son entrée la signalent (« true », pas « page »).
  await page.goto(GUIDE);
  await expect(bouton).toHaveAttribute('aria-current', 'true');
  await expect(page.locator('.nav-centre a[href="/integrations"]')).toHaveAttribute('aria-current', 'true');
  await page.goto('/blog');
  await expect(bouton).not.toHaveAttribute('aria-current');
});

for (const groupe of GROUPES) {
  test(`menu ${groupe.nom} : Entrée, Tab, Échap et retour du focus`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const trigger = page.locator(`[aria-controls="sous-menu-${groupe.id}"]`);
    const panel = page.locator(`#sous-menu-${groupe.id}`);
    await trigger.focus();
    await expect(panel).toBeHidden();
    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Tab');
    await expect(panel.locator('a').first()).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(panel).toBeHidden();
    await page.keyboard.press('Tab');
    // L'entrée qui suit le groupe dans la barre : le groupe suivant, ou le premier lien direct.
    const suivante = page.locator('.nav-centre > ul > li', { has: trigger }).locator('xpath=following-sibling::li[1]');
    await expect(suivante.locator('a,button').first()).toBeFocused();
  });
}

test('menu Ce qu’on automatise : les trois entrées se parcourent au clavier dans l’ordre', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const trigger = page.locator('[aria-controls="sous-menu-automatise"]');
  await trigger.focus();
  await page.keyboard.press('Enter');
  for (const { libelle, href } of AUTOMATISE) {
    await page.keyboard.press('Tab');
    const lien = page.locator('#sous-menu-automatise a:focus');
    await expect(lien).toHaveText(libelle);
    await expect(lien).toHaveAttribute('href', href);
  }
  // Le groupe se referme dès que le focus en sort.
  await page.keyboard.press('Tab');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#sous-menu-automatise')).toBeHidden();
});

for (const width of [375, 1440]) {
  test(`pied de page : « Ce qu’on automatise » reprend les trois entrées du menu, une fois chacune, à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const rubrique = page.locator('footer .pied-col', { has: page.locator('.pied-titre', { hasText: 'Ce qu’on automatise' }) });
    await expect(rubrique).toHaveCount(1);
    // Sous 48 rem le pied replie ses rubriques derrière leur titre : un geste, comme le fait un lecteur.
    if (width < 768) await rubrique.getByRole('button', { name: 'Ce qu’on automatise' }).click();
    const liens = rubrique.locator('.pied-lien');
    await expect(liens).toHaveText(AUTOMATISE.map((entree) => entree.libelle));
    expect(await liens.evaluateAll((elements) => elements.map((element) => element.getAttribute('href')))).toEqual(AUTOMATISE.map((entree) => entree.href));
    for (const lien of await liens.all()) await expect(lien).toBeVisible();
    // Une seule fois dans tout le pied : plusieurs gabarits (strict mode) comptent sur un lien unique par destination.
    for (const { href } of AUTOMATISE) await expect(page.locator(`footer a[href="${href}"]`)).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });
}

test('pied de page : le menu et le pied portent les mêmes destinations de « Ce qu’on automatise »', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const lire = (selecteur: string) => page.locator(selecteur).evaluateAll((liens) => liens.map((lien) => ({ libelle: lien.textContent!.trim(), href: lien.getAttribute('href') })));
  expect(await lire('footer .pied-col:has(.pied-titre:has-text("Ce qu’on automatise")) .pied-lien')).toEqual(await lire('#sous-menu-automatise a'));
});

for (const width of [375, 1024, 1440]) {
  test(`activation CAC : entrée et contenu local conservés à ${width}px`, async ({ page }) => {
    test.skip(!CAC_PUBLIE, 'E4 n’a pas encore publié sa route ; le contrat de données couvre les deux états.');
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('.hero-texte a[href="/commissaires-aux-comptes"]')).toBeVisible();
    if (width >= 1024) {
      await page.locator('[aria-controls="sous-menu-cabinets"]').focus();
      await page.keyboard.press('Enter');
    }
    if (width < 1024) await page.locator('[data-burger]').click();
    const nav = page.locator(width < 1024 ? '#menu-mobile' : '.nav-centre');
    await nav.getByRole('link', { name: 'Commissaires aux comptes', exact: true }).press('Enter');
    await expect(page).toHaveURL(/\/commissaires-aux-comptes$/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await expect(page.locator('[aria-controls="sous-menu-lecture"]')).toHaveCount(0);
    for (const id of ['usages', 'methode', 'preuves', 'questions']) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
  });
}
