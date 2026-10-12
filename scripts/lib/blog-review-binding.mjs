import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'parse5';
import { isResponsiveProofSelection } from './responsive-proofs.mjs';

export const reviewSha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

// La logistique et les références techniques ne sont pas un nouvel avis de fond.
const logistics = new Set(['date', 'updatedAt', 'checkedAt', 'capturedAt', 'retrievedAt', 'verifiedAt', 'sha256', 'recipeSha256', 'bodySha256', 'renderedSha256']);
export function recipeSubstanceSha256(bytes) {
  const project = (value) => {
    if (Array.isArray(value)) return value.map(project);
    if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort()
      .filter((key) => !logistics.has(key)).map((key) => [key, project(value[key])]));
    if (typeof value === 'string' && /^(?:https?:\/\/|\/)/.test(value)) return '__reference_url__';
    return value;
  };
  return reviewSha256(JSON.stringify(project(JSON.parse(String(bytes)))));
}

export function recipeReviewMatches(expectedHash, bytes, root, substanceHash) {
  if (expectedHash === reviewSha256(bytes)) return true;
  if (substanceHash && substanceHash === recipeSubstanceSha256(bytes)) return true;
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
      if (location?.startTag && location?.endTag) {
        let body = source.slice(location.startTag.endOffset, location.endTag.startOffset);
        const wrappers = [];
        const collect = (child) => {
          // Only the generated, single-table accessibility envelope is logistical.
          // Keep all cells, captions, figures and any other surrounding content bound.
          const children = (child.childNodes ?? []).filter((item) => item.nodeName !== '#text' || item.value.trim());
          const attributes = Object.fromEntries((child.attrs ?? []).map(item => [item.name, item.value]));
          if (child.tagName === 'img' && isResponsiveProofSelection(attributes.src, attributes.srcset,
            attributes.sizes, attributes.loading === 'lazy')) {
            // Les variantes canoniques ne changent pas le fond : src, alt et dimensions restent liés.
            for (const name of ['srcset', 'sizes']) {
              const attribute = child.sourceCodeLocation.attrs[name];
              wrappers.push({ startOffset: attribute.startOffset - 1, endOffset: attribute.endOffset });
            }
          }
          if (child.tagName === 'div' && child.attrs?.some((attr) => attr.name === 'data-table-scroll')
            && children.length === 1 && children[0].tagName === 'table') {
            const tags = child.sourceCodeLocation;
            if (tags?.startTag && tags?.endTag) wrappers.push(tags.startTag, tags.endTag);
          }
          for (const item of child.childNodes ?? []) collect(item);
        };
        collect(node);
        for (const tag of wrappers.sort((a, b) => b.startOffset - a.startOffset)) {
          const start = tag.startOffset - location.startTag.endOffset;
          const end = tag.endOffset - location.startTag.endOffset;
          body = body.slice(0, start) + body.slice(end);
        }
        return reviewSha256(body);
      }
    }
    for (const child of node.childNodes ?? []) {
      const hash = visit(child);
      if (hash) return hash;
    }
    return null;
  };
  return visit(document);
}

// Inverse projection: never normalize all links or reissue an independent opinion.
// Only explicitly added, plain-text links to existing blog candidates are undone.
function projectLinkReview(review, slug, body, recipeBytes, renderedHtml, root) {
  const path = root && join(root, 'editorial/recettes', slug, 'review-link-projection.json');
  if (!path || !existsSync(path)) return { body, recipeBytes, renderedHtml };
  const projection = JSON.parse(readFileSync(path));
  if (projection.version !== 1 || projection.reviewSha256 !== reviewSha256(JSON.stringify(review))
    || !Array.isArray(projection.additions) || !projection.additions.length) throw new Error('projection ou avis divergent');
  const recipe = JSON.parse(String(recipeBytes));
  const seen = new Set();
  for (const { text, url } of projection.additions) {
    if (typeof text !== 'string' || !/^[\p{L}\p{N} -]+$/u.test(text)
      || typeof url !== 'string' || !/^\/blog\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(url)
      || seen.has(url) || url === `/blog/${slug}`
      || !existsSync(join(root, 'src/content/blog', `${url.slice(6)}.md`))) throw new Error('cible ou libellé invalide');
    seen.add(url);
    const link = `[${text}](${url})`;
    if (body.split(link).length !== 2 || recipe.links?.outgoing?.filter(item => item === url).length !== 1) throw new Error('ajout absent, répété ou non déclaré');
    body = body.replace(link, text);
    recipe.links.outgoing = recipe.links.outgoing.filter(item => item !== url);
    if (renderedHtml !== undefined) {
      const source = String(renderedHtml);
      const document = parse(source, { sourceCodeLocationInfo: true });
      const matches = [];
      const visit = (node, inBody = false) => {
        inBody ||= node.tagName === 'div' && node.attrs?.some(attr => attr.name === 'class' && attr.value.split(/\s+/).includes('article-corps'));
        if (inBody && node.tagName === 'a' && node.attrs?.length === 1 && node.attrs[0].name === 'href' && node.attrs[0].value === url
          && node.childNodes?.length === 1 && node.childNodes[0].nodeName === '#text' && node.childNodes[0].value === text) matches.push(node.sourceCodeLocation);
        for (const child of node.childNodes ?? []) visit(child, inBody);
      };
      visit(document);
      if (matches.length !== 1) throw new Error('lien rendu divergent');
      const location = matches[0];
      renderedHtml = source.slice(0, location.startOffset) + source.slice(location.startTag.endOffset, location.endTag.startOffset) + source.slice(location.endOffset);
    }
  }
  return { body, recipeBytes: JSON.stringify(recipe), renderedHtml };
}

export function reviewBindingErrors(review, slug, body, recipeBytes, renderedHtml, root) {
  const errors = [];
  try {
    ({ body, recipeBytes, renderedHtml } = projectLinkReview(review, slug, body, recipeBytes, renderedHtml, root));
  } catch (error) {
    errors.push(`review-link-projection.json : ${error.message} ; projection de maillage refusée.`);
  }
  if (review?.subject?.slug !== slug || review?.subject?.bodySha256 !== reviewSha256(body.trim())) {
    errors.push('revues.json : empreinte du corps ou slug divergent ; nouvelle revue indépendante requise.');
  }
  if (!recipeReviewMatches(review?.subject?.recipeSha256, recipeBytes, root, review?.subject?.recipeSubstanceSha256)) {
    errors.push('revues.json : empreinte de la recette divergente ; nouvelle revue indépendante requise.');
  }
  if (!/^[a-f0-9]{64}$/.test(review?.subject?.renderedSha256 ?? '')) {
    errors.push('revues.json : empreinte du rendu HTML absente ou invalide ; nouvelle revue indépendante requise.');
  } else if (renderedHtml !== undefined && review.subject.renderedSha256 !== renderedBodySha256(renderedHtml)) {
    errors.push('revues.json : empreinte du rendu HTML divergente ; nouvelle revue indépendante requise.');
  }
  return errors;
}
