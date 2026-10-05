import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'parse5';

export const reviewSha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

// La logistique et les références techniques ne sont pas un nouvel avis de fond.
const logistics = new Set(['date', 'updatedAt', 'checkedAt', 'capturedAt', 'retrievedAt', 'verifiedAt', 'sha256', 'recipeSha256', 'bodySha256', 'renderedSha256']);
export function recipeSubstanceSha256(bytes) {
  const project = (value) => {
    if (Array.isArray(value)) return value.map(project);
    if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort()
      .filter((key) => !logistics.has(key)).map((key) => [key, project(value[key])]));
    if (typeof value === 'string' && /^https?:\/\//.test(value)) return '__reference_url__';
    return value;
  };
  return reviewSha256(JSON.stringify(project(JSON.parse(String(bytes)))));
}

export function recipeReviewMatches(expectedHash, bytes, root) {
  if (expectedHash === reviewSha256(bytes)) return true;
  const path = root && join(root, 'editorial/review-substance-baseline.json');
  if (!path || !existsSync(path)) return false;
  try {
    const baseline = JSON.parse(readFileSync(path));
    return baseline.version === 1 && baseline.recipes?.[expectedHash] === recipeSubstanceSha256(bytes);
  } catch { return false; }
}

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

export function reviewBindingErrors(review, slug, body, recipeBytes, renderedHtml, root) {
  const errors = [];
  if (review?.subject?.slug !== slug || review?.subject?.bodySha256 !== reviewSha256(body.trim())) {
    errors.push('revues.json : empreinte du corps ou slug divergent ; nouvelle revue indépendante requise.');
  }
  if (!recipeReviewMatches(review?.subject?.recipeSha256, recipeBytes, root)) {
    errors.push('revues.json : empreinte de la recette divergente ; nouvelle revue indépendante requise.');
  }
  if (!/^[a-f0-9]{64}$/.test(review?.subject?.renderedSha256 ?? '')) {
    errors.push('revues.json : empreinte du rendu HTML absente ou invalide ; nouvelle revue indépendante requise.');
  } else if (renderedHtml !== undefined && review.subject.renderedSha256 !== renderedBodySha256(renderedHtml)) {
    errors.push('revues.json : empreinte du rendu HTML divergente ; nouvelle revue indépendante requise.');
  }
  return errors;
}
