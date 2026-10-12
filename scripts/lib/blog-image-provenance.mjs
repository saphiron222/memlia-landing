/** Le régime HTML est explicite ; un nom de modèle seul ne dispense jamais du contrat IA. */
export function erreursProvenanceHtml(source, provenance) {
  const erreurs = [];
  if (source?.provider !== 'html-original-local' || source?.model !== 'playwright-chromium' || source?.credits !== 0) erreurs.push('Provenance HTML : fournisseur local, Chromium et zéro crédit requis.');
  if (provenance?.type !== 'html-original' || typeof provenance?.template !== 'string' || !provenance.template.trim() || typeof provenance?.decision !== 'string' || provenance.decision.trim().length < 20 || !/^\d{4}-\d{2}-\d{2}$/.test(provenance?.createdAt ?? '')) erreurs.push('Provenance HTML : type, cadre source, date et décision éditoriale explicites requis.');
  return erreurs;
}

export function moteurImage(image) {
  const html = image?.source?.provider === 'html-original-local' || image?.provenance?.type === 'html-original';
  if (!html) return 'image_generate';
  const erreurs = erreursProvenanceHtml(image?.source, image?.provenance);
  if (erreurs.length) throw new Error(erreurs.join('\n'));
  return 'html-original';
}
