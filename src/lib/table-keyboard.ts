// WebKit does not reliably scroll a focused region with horizontal arrows.
// Leave links, modifiers, vertical scrolling and Tab to their native behavior.
document.querySelectorAll<HTMLElement>('[data-table-scroll]').forEach((region) => {
  region.addEventListener('keydown', (event) => {
    if (event.target !== region || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey
      || !['ArrowLeft', 'ArrowRight'].includes(event.key)
      || region.scrollWidth <= region.clientWidth) return;
    event.preventDefault();
    region.scrollBy({ left: event.key === 'ArrowRight' ? 80 : -80, behavior: 'instant' });
  });
});
