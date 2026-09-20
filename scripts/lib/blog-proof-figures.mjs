const PREUVE_INLINE = /<figure\b[^>]*\bdata-blog-proof=(?:"[^"]*"|'[^']*')[^>]*>[\s\S]*?<\/figure>/gi;

/**
 * Retire les attestations visuelles du candidat pour retrouver les octets
 * éditoriaux scellés. Les figures ont leur propre contrat de rendu ; elles ne
 * changent ni les phrases, ni les affirmations, ni les sources déjà revues.
 */
export function retirerPreuvesInline(contenu) {
  return String(contenu ?? '')
    .replace(PREUVE_INLINE, '')
    .replace(/\n{3,}/g, '\n\n');
}
