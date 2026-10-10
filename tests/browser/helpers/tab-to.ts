import { type Locator, type Page } from '@playwright/test';

export async function tabTo(page: Page, target: Locator) {
  // Element identity detects a complete cycle without estimating the tab order.
  const visited = await page.evaluateHandle(() => new Set<Element>());
  try {
    while (!(await target.evaluate(element => element === document.activeElement))) {
      const repeated = await visited.evaluate(elements => {
        const active = document.activeElement;
        // Body also represents browser chrome between the last and first stop.
        if (!active || active === document.body || active === document.documentElement) return false;
        if (elements.has(active)) return true;
        elements.add(active);
        return false;
      });
      if (repeated) throw new Error('Cycle de tabulation terminé sans atteindre la cible');
      await page.keyboard.press('Tab');
    }
  } finally {
    await visited.dispose();
  }
}
