import { expect, test } from '@playwright/test';

// Kevin, 07/10/2026 : « rien qu'au scroll mon site met beaucoup de temps à charger ». Un bloc
// à révéler (.rv) restait invisible jusqu'à ce qu'il soit déjà à l'écran, puis mettait 0,3 à
// 0,8 s à apparaître. Pendant une lecture (molette à 1 000 px/s), il doit être lisible dès son
// entrée à l'écran.
const RETARD_MAX_MS = 150;

for (const chemin of ['/', '/automatisation-cabinet-comptable', '/methode']) {
  test(`${chemin} : un bloc révélé est lisible dès son entrée à l'écran`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(chemin);
    await page.evaluate(() => {
      const suivi = [...document.querySelectorAll('.rv')].map((bloc) => ({ bloc, entree: -1, lisible: -1 }));
      Object.assign(window, { __suiviRevelation: suivi });
      const observer = () => {
        const maintenant = performance.now();
        for (const s of suivi) {
          const cadre = s.bloc.getBoundingClientRect();
          if (s.entree < 0 && cadre.top < innerHeight && cadre.bottom > 0) s.entree = maintenant;
          if (s.lisible < 0 && Number(getComputedStyle(s.bloc).opacity) > 0.95) s.lisible = maintenant;
        }
        requestAnimationFrame(observer);
      };
      requestAnimationFrame(observer);
    });
    await page.mouse.move(720, 450);
    const hauteur = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < hauteur; y += 100) {
      await page.mouse.wheel(0, 100);
      await page.waitForTimeout(100);
    }
    await page.waitForTimeout(1_000);
    const retards = await page.evaluate(() => {
      const suivi = (window as unknown as { __suiviRevelation: { bloc: Element; entree: number; lisible: number }[] }).__suiviRevelation;
      return suivi
        .filter((s) => s.entree >= 0)
        .map((s) => ({ bloc: s.bloc.className, retardMs: s.lisible < 0 ? Infinity : Math.round(s.lisible - s.entree) }));
    });
    expect(retards.length).toBeGreaterThan(0);
    expect(retards.filter((r) => r.retardMs > RETARD_MAX_MS)).toEqual([]);
  });
}
