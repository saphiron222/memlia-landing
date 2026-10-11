import { test, expect } from '@playwright/test';

// Système de page du 07/10/2026 : les cinq usages de l'accueil sont des définitions, non
// cliquables, donc des lignes et pas des cartes : aucune fiche, aucune surface propre ; le même
// pictogramme, de la même couleur et au même trait, ouvre chaque ligne ; aucune palette ni
// illustration propre à une capacité.
for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`usages : lignes du site et cinq pictogrammes uniformes à ${width}`, async ({ page }) => {
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
        icon: resolve('color', 'var(--accent-texte)'), title: resolve('color', 'var(--texte-fort)'),
        body: resolve('color', 'var(--texte-2)'), rule: resolve('color', 'var(--ligne-filet)'),
      };
      return {
        expected,
        background: getComputedStyle(section).backgroundColor,
        lines: [...section.querySelectorAll('[data-usage]')].map((el, i) => {
          const mark = el.querySelector('.ligne-picto')!;
          const svg = mark.querySelector('svg')!;
          const m = getComputedStyle(mark), s = getComputedStyle(svg), c = getComputedStyle(el);
          return { classes: el.className, background: c.backgroundColor, image: c.backgroundImage, shadow: c.boxShadow,
            radius: c.borderTopLeftRadius, rule: i === 0 ? null : [c.borderTopWidth, c.borderTopStyle, c.borderTopColor],
            title: getComputedStyle(el.querySelector('h3')!).color, body: getComputedStyle(el.querySelector('p')!).color,
            mark: { color: m.color, background: m.backgroundColor, image: m.backgroundImage,
              borders: [m.borderTopWidth, m.borderRightWidth, m.borderBottomWidth, m.borderLeftWidth],
              before: getComputedStyle(mark, '::before').content, after: getComputedStyle(mark, '::after').content },
            svg: { width: s.width, height: s.height, stroke: svg.getAttribute('stroke-width'), viewBox: svg.getAttribute('viewBox') },
          };
        }),
      };
    });
    expect(actual.lines).toHaveLength(5);
    // La section n'a pas de fond propre : la feuille du site, comme toutes les sections.
    expect(actual.background).toBe('rgba(0, 0, 0, 0)');
    for (const line of actual.lines) {
      // Une ligne n'est pas une carte : ni fiche, ni ombre, ni rayon.
      expect(line.classes.split(/\s+/)).not.toContain('carte');
      expect(line.classes.split(/\s+/)).toContain('ligne');
      expect(line.background).toBe('rgba(0, 0, 0, 0)');
      expect(line.image).toBe('none');
      expect(line.shadow).toBe('none');
      expect(line.radius).toBe('0px');
      // Un filet sépare deux lignes.
      if (line.rule) expect(line.rule).toEqual(['1px', 'solid', actual.expected.rule]);
      expect(line.title).toBe(actual.expected.title);
      expect(line.body).toBe(actual.expected.body);
      // Le même pictogramme pour les cinq : même couleur, sans pastille ni décor, même trait.
      expect(line.mark).toEqual(actual.lines[0].mark);
      expect(line.mark.color).toBe(actual.expected.icon);
      expect(line.mark.background).toBe('rgba(0, 0, 0, 0)');
      expect(line.mark.image).toBe('none');
      expect(line.mark.borders).toEqual(['0px', '0px', '0px', '0px']);
      expect(line.mark.before).toBe('none');
      expect(line.mark.after).toBe('none');
      expect(line.svg).toEqual({ width: '24px', height: '24px', stroke: '1.5', viewBox: '0 0 24 24' });
    }
  });
}
