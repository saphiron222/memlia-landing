import { test, expect } from '@playwright/test';

for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`bento : palette et cinq pictogrammes uniformes à ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const actual = await page.locator('#usages').evaluate(section => {
      // Résolution par le navigateur, y compris les alias et les couleurs alpha.
      const resolve = (name: string) => {
        const probe = document.createElement('span');
        probe.style.color = `var(${name})`;
        section.append(probe);
        const value = getComputedStyle(probe).color;
        probe.remove();
        return value;
      };
      return {
        expected: { page: resolve('--surface-page'), card: resolve('--surface-feuille'), icon: resolve('--picto-repos'), title: resolve('--texte-fort'), body: resolve('--texte-2') },
        background: getComputedStyle(section).backgroundColor,
        cards: [...section.querySelectorAll('[data-usage]')].map(el => {
          const mark = el.querySelector('.use-mark')!;
          const svg = mark.querySelector('svg')!;
          const m = getComputedStyle(mark), s = getComputedStyle(svg), c = getComputedStyle(el);
          return { background: c.backgroundColor, image: c.backgroundImage,
            title: getComputedStyle(el.querySelector('h3')!).color, body: getComputedStyle(el.querySelector('p')!).color,
            mark: { width: m.width, height: m.height, color: m.color, background: m.backgroundColor, image: m.backgroundImage,
              borders: [m.borderTop, m.borderRight, m.borderBottom, m.borderLeft], radius: m.borderRadius, alignment: m.placeItems,
              before: getComputedStyle(mark, '::before').content, after: getComputedStyle(mark, '::after').content },
            svg: { width: s.width, height: s.height, stroke: svg.getAttribute('stroke-width'), viewBox: svg.getAttribute('viewBox') },
          };
        }),
      };
    });
    expect(actual.cards).toHaveLength(5);
    expect(actual.background).toBe(actual.expected.page);
    for (const card of actual.cards) {
      expect(card.background).toBe(actual.expected.card);
      expect(card.image).toBe('none');
      expect(card.title).toBe(actual.expected.title);
      expect(card.body).toBe(actual.expected.body);
      expect(card.mark).toEqual(actual.cards[0].mark);
      expect(card.mark.color).toBe(actual.expected.icon);
      expect(card.mark.background).toBe(actual.expected.page);
      expect(card.mark.image).toBe('none');
      expect(card.mark.width).toBe('48px');
      expect(card.mark.height).toBe('48px');
      expect(card.mark.before).toBe('none');
      expect(card.mark.after).toBe('none');
      expect(card.svg).toEqual({ width: '24px', height: '24px', stroke: '1.5', viewBox: '0 0 24 24' });
    }
  });
}
