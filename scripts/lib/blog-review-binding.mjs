import { createHash } from 'node:crypto';
import { parse } from 'parse5';

export const reviewSha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

// L'empreinte du contenu rendu exclut le chrome et le témoin preview qui changent
// entre pret-preview, go-production et publie ; elle inclut les figures inline.
export function renderedBodySha256(html) {
  const source = String(html ?? '');
  const document = parse(source, { sourceCodeLocationInfo: true });
  const visit = (node) => {
    if (node.tagName === 'div' && node.attrs?.some((attr) => attr.name === 'class' && attr.value.split(/\s+/).includes('article-corps'))) {
      const location = node.sourceCodeLocation;
      if (location?.startTag && location?.endTag) return reviewSha256(source.slice(location.startTag.endOffset, location.endTag.startOffset));
    }
    for (const child of node.childNodes ?? []) {
      const hash = visit(child);
      if (hash) return hash;
    }
    return null;
  };
  return visit(document);
}

export function reviewBindingErrors(review, slug, body, recipeBytes, renderedHtml) {
  const errors = [];
  if (review?.subject?.slug !== slug || review?.subject?.bodySha256 !== reviewSha256(body.trim())) {
    errors.push('revues.json : empreinte du corps ou slug divergent ; nouvelle revue indépendante requise.');
  }
  if (review?.subject?.recipeSha256 !== reviewSha256(recipeBytes)) {
    errors.push('revues.json : empreinte de la recette divergente ; nouvelle revue indépendante requise.');
  }
  if (!/^[a-f0-9]{64}$/.test(review?.subject?.renderedSha256 ?? '')) {
    errors.push('revues.json : empreinte du rendu HTML absente ou invalide ; nouvelle revue indépendante requise.');
  } else if (renderedHtml !== undefined && review.subject.renderedSha256 !== renderedBodySha256(renderedHtml)) {
    errors.push('revues.json : empreinte du rendu HTML divergente ; nouvelle revue indépendante requise.');
  }
  return errors;
}
