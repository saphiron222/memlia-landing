import { test, expect } from '@playwright/test';

// Les cinq usages de l'accueil sont des cartes du site (Kevin, 07/10/2026) : une fiche qui se
// détache du fond, un bord visible, la même pastille de pictogramme pour les cinq, aucune
// palette ni illustration propre à une capacité.
for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`bento : cartes du site et cinq pictogrammes uniformes à ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.mouse.move(0, 0);
    const actual = await page.locator('#usages').evaluate(section => {
      // Résolution par le navigateur, y compris les alias et les couleurs alpha.
      const resolve = (property: string, value: string) => {
        const probe = document.createElement('span');
        probe.style.cssText = 'position:absolute;display:block;visibility:hidden;border-style:solid';
        probe.style.setProperty(property, value);
        section.append(probe);
        const computed = getComputedStyle(probe).getPropertyValue(property);
        probe.remove();
        return computed;
      };
      const expected = {
        page: resolve('color', 'var(--surface-page)'), card: resolve('color', 'var(--carte-fond)'),
        border: resolve('color', 'var(--carte-bord)'), radius: resolve('border-top-left-radius', 'var(--carte-rayon)'),
        icon: resolve('color', 'var(--accent-texte)'), iconSize: resolve('width', 'var(--carte-icone)'),
        title: resolve('color', 'var(--texte-fort)'), body: resolve('color', 'var(--texte-2)'),
      };
      return {
        expected,
        background: getComputedStyle(section).backgroundColor,
        cards: [...section.querySelectorAll('[data-usage]')].map(el => {
          const mark = el.querySelector('.carte-icone')!;
          const svg = mark.querySelector('svg')!;
          const m = getComputedStyle(mark), s = getComputedStyle(svg), c = getComputedStyle(el);
          return { classes: el.className, background: c.backgroundColor, image: c.backgroundImage,
            border: [c.borderTopWidth, c.borderTopStyle, c.borderTopColor], radius: c.borderTopLeftRadius,
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
    // La fiche se distingue du fond de la section : surface et bord différents du fond.
    expect(actual.expected.card).not.toBe(actual.expected.page);
    for (const card of actual.cards) {
      expect(card.classes.split(/\s+/)).toContain('carte');
      expect(card.background).toBe(actual.expected.card);
      expect(card.image).toBe('none');
      expect(card.border).toEqual(['1px', 'solid', actual.expected.border]);
      expect(card.radius).toBe(actual.expected.radius);
      expect(card.title).toBe(actual.expected.title);
      expect(card.body).toBe(actual.expected.body);
      expect(card.mark).toEqual(actual.cards[0].mark);
      expect(card.mark.color).toBe(actual.expected.icon);
      expect(card.mark.background).toBe(actual.expected.page);
      expect(card.mark.image).toBe('none');
      expect(card.mark.width).toBe(actual.expected.iconSize);
      expect(card.mark.height).toBe(actual.expected.iconSize);
      expect(card.mark.before).toBe('none');
      expect(card.mark.after).toBe('none');
      expect(card.svg).toEqual({ width: '24px', height: '24px', stroke: '1.5', viewBox: '0 0 24 24' });
    }
  });
}
