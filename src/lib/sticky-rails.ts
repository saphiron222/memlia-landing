/** Rails courts ou hauts : le document reste l’unique zone de défilement. */
const rails = [...document.querySelectorAll<HTMLElement>('.faq-rail, .outil-faq-heading, .routine-faq > .tete, .routine-outils, .contact-aside')];
if (rails.length && 'ResizeObserver' in window) {
  const update = () => {
    const navHeight = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;
    for (const rail of rails) {
      // Un panneau haut descend jusqu’à ce que son bas soit visible, puis suit sa section.
      // Pas de hauteur plafonnée ni de barre de défilement imbriquée.
      rail.style.setProperty('--sticky-rail-top', `${Math.min(navHeight + 24, window.innerHeight - rail.getBoundingClientRect().height - 24)}px`);
      rail.dataset.stickyRail = '';
    }
  };
  const observer = new ResizeObserver(update);
  rails.forEach(rail => observer.observe(rail));
  window.addEventListener('resize', update, { passive: true });
  document.fonts.ready.then(update);
  update();
}
