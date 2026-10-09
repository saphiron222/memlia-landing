// CAC only: optional captions never change the shared R8 playback controller.
for (const button of document.querySelectorAll('[data-video-captions]')) {
  const video = button.closest('[data-video-player]')?.querySelector('video');
  if (!video) continue;
  button.hidden = false;
  button.addEventListener('click', () => {
    const track = video.textTracks[0];
    if (!track) return;
    const showing = track.mode !== 'showing';
    track.mode = showing ? 'showing' : 'disabled';
    button.setAttribute('aria-pressed', String(showing));
  });
}
