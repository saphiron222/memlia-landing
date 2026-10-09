export function initPseudonymisation() {
  const root = document.querySelector('[data-pseudo]');
  if (!root) return;
  const q = (s) => root.querySelector(s);
  const form = q('form'), error = q('[data-error]'), status = q('[data-status]');
  const fileInput = q('#pseudo-file'), columns = q('[data-columns]');
  let active = null, pending = null, requestId = 0, latest = 0, ready = false;
  const buttons = [...root.querySelectorAll('[data-export]')];
  const updateExports = () => buttons.forEach(b => { b.disabled = !ready || !q('[data-reviewed]').checked || b.dataset.export === 'mapping' && !q('[data-mapping]').checked; });
  const invalidate = () => { ready = false; q('[data-result]').hidden = true; q('[data-reviewed]').checked = false; q('[data-mapping]').checked = false; q('[data-after]').replaceChildren(); q('[data-risks]').replaceChildren(); q('[data-transformations]').replaceChildren(); updateExports(); };
  const clearError = () => { error.hidden = true; error.textContent = ''; fileInput.removeAttribute('aria-invalid'); };
  const fail = (message) => { error.textContent = message; error.hidden = false; fileInput.setAttribute('aria-invalid', 'true'); error.focus(); };
  const table = (target, captionText, headers, rows) => {
    target.replaceChildren();
    const caption = document.createElement('caption'); caption.textContent = captionText; target.append(caption);
    const head = document.createElement('thead'), tr = document.createElement('tr');
    for (const h of headers) { const th = document.createElement('th'); th.scope = 'col'; th.textContent = h; tr.append(th); }
    head.append(tr); target.append(head);
    const body = document.createElement('tbody');
    for (const row of rows) { const tr = document.createElement('tr'); for (const v of row) { const td = document.createElement('td'); td.textContent = v; tr.append(td); } body.append(tr); }
    target.append(body);
  };
  const list = (target, items) => { target.replaceChildren(); for (const text of items) { const li = document.createElement('li'); li.textContent = text; target.append(li); } };
  const stopPending = () => { pending?.terminate(); pending = null; q('[data-cancel]').hidden = true; };
  // Vite émet un Worker autonome (IIFE) pour le site statique.
  const makeWorker = () => new Worker(new URL('../workers/pseudonymisation.worker.mjs', import.meta.url), { name: 'memlia-pseudonymisation' });
  const receive = (worker, message) => {
    if (worker !== active || message.id !== latest) return;
    if (message.kind === 'error') { invalidate(); fail(message.error); status.textContent = 'Traitement refusé. Les choix et l’original importé restent disponibles.'; return; }
    if (message.kind === 'preview') {
      table(q('[data-after]'), `Copie transformée — ${message.count} lignes au total`, message.headers, message.preview);
      list(q('[data-risks]'), message.risks);
      list(q('[data-transformations]'), message.transformations.map(t => `${t.column} : ${ { remove:'supprimer', alias:'alias', keep:'conserver' }[t.action]}${t.action === 'alias' ? ` (${t.aliases} alias distincts)` : ''}`));
      q('[data-neutralization]').textContent = `${message.neutralized} cellule(s) ou en-tête(s) seront neutralisés dans la copie CSV. Le mapping est neutralisé séparément à l’export.`;
      q('[data-result]').hidden = false; ready = true; updateExports();
      status.textContent = `Copie préparée : ${message.count} lignes. Relisez les risques avant l’export.`;
    } else if (message.kind === 'export') {
      const blob = new Blob([message.content], { type: message.type });
      const url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = message.filename; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      status.textContent = 'Fichier créé localement. Aucun envoi à une IA.';
    }
  };
  const load = (file, delimiter, encoding) => {
    clearError();
    if (!file) { fail('Choisissez un fichier à importer.'); return; }
    if (file.size > 20 * 1024 * 1024) { fail('Fichier supérieur à 20 Mo : import refusé. L’import précédent reste disponible.'); return; }
    stopPending(); pending = makeWorker(); const candidate = pending;
    const id = ++requestId;
    status.textContent = 'Lecture locale en cours. Vous pouvez annuler.'; q('[data-cancel]').hidden = false;
    candidate.onerror = () => { if (pending !== candidate) return; stopPending(); fail('Le traitement local a échoué. Réessayez avec un fichier plus petit.'); };
    candidate.onmessage = ({ data: m }) => {
      if (pending !== candidate || m.id !== id) return;
      if (m.kind === 'error') { stopPending(); fail(m.error); status.textContent = 'Import refusé ; aucun remplacement du fichier précédent.'; return; }
      active?.terminate(); active = candidate; pending = null; latest = id;
      active.onmessage = ({ data }) => receive(candidate, data);
      active.onerror = () => { invalidate(); fail('Le traitement local a échoué. Réimportez le fichier.'); };
      q('[data-cancel]').hidden = true; invalidate(); columns.replaceChildren();
      for (const [i, h] of m.headers.entries()) {
        const div = document.createElement('div'), label = document.createElement('label'), select = document.createElement('select');
        select.id = `pseudo-col-${i}`; label.htmlFor = select.id; label.textContent = h;
        for (const [value, text] of [['remove','Supprimer'], ['alias','Remplacer par alias'], ['keep','Conserver']]) { const option = document.createElement('option'); option.value = value; option.textContent = text; select.append(option); }
        select.value = m.actions[i]; select.addEventListener('change', () => { latest = ++requestId; invalidate(); status.textContent = 'Choix modifiés : préparez à nouveau l’aperçu.'; });
        div.append(label,select); columns.append(div);
      }
      table(q('[data-before]'), `Original inchangé — ${m.count} lignes au total`, m.headers, m.preview);
      q('[data-selection]').hidden = false;
      status.textContent = `${m.count} lignes importées localement. Choisissez les colonnes.`;
    };
    candidate.postMessage({ id, kind:'load', file, delimiter, encoding });
  };
  form.addEventListener('submit', e => { e.preventDefault(); const separator = q('#pseudo-separator').value; load(fileInput.files[0], separator === 'tab' ? '\t' : separator, q('#pseudo-encoding').value); });
  fileInput.addEventListener('change', () => { q('[data-file-name]').textContent = `Fichier choisi : ${fileInput.files[0]?.name ?? 'aucun'}. Ce choix ne remplace l’original importé qu’après un import réussi.`; });
  q('[data-example]').addEventListener('click', () => {
    if (active || pending || fileInput.files.length) { fail('Réinitialisez explicitement avant de remplacer votre fichier par l’exemple fictif.'); return; }
    load(new File(['Nom;Libelle;Date;Montant\nAlice;Contact alice@example.test;20261004;9876\nAlice;Facture;20261005;10\nBob;Facture;20261006;20'], 'exemple-fictif.csv'), ';', 'utf-8');
  });
  q('[data-preview]').addEventListener('click', () => {
    clearError(); invalidate(); if (!active) return;
    latest = ++requestId; status.textContent = 'Préparation locale de la copie…';
    active.postMessage({ id: latest, kind:'preview', actions:[...columns.querySelectorAll('select')].map(s => s.value) });
  });
  q('[data-reviewed]').addEventListener('change', updateExports); q('[data-mapping]').addEventListener('change', updateExports);
  for (const b of buttons) b.addEventListener('click', () => {
    if (b.disabled || !active) return;
    latest = ++requestId; active.postMessage({ id:latest, kind:'export', format:b.dataset.export });
  });
  q('[data-cancel]').addEventListener('click', () => { stopPending(); status.textContent = 'Import annulé. Aucun remplacement du fichier précédent.'; });
  const reset = () => {
    stopPending(); active?.terminate(); active = null; latest = ++requestId; invalidate(); form.reset();
    columns.replaceChildren(); q('[data-before]').replaceChildren(); q('[data-selection]').hidden = true; q('[data-neutralization]').textContent = '';
    q('[data-file-name]').textContent = 'Fichier choisi : aucun.';
    clearError(); status.textContent = 'Réinitialisé : contenu et mapping retirés de cette page et Worker terminé.';
  };
  q('[data-reset]').addEventListener('click', reset);
  window.addEventListener('pagehide', reset);
}
