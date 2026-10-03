#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { projectReviews } from './lib/blog-review-projection.mjs';
import { reviewSha256, renderedBodySha256 } from './lib/blog-review-binding.mjs';

export function projectFiles({ root, slug, html, qaPath, businessPath, output }) {
  const dir = join(root, 'editorial/recettes', slug);
  const subject = {
    slug,
    bodySha256: reviewSha256(readFileSync(join(dir, 'corps.md'), 'utf8').trim()),
    recipeSha256: reviewSha256(readFileSync(join(dir, 'recette.json'))),
    renderedSha256: renderedBodySha256(readFileSync(html, 'utf8')),
  };
  const projected = projectReviews({ qa: JSON.parse(readFileSync(qaPath)), business: JSON.parse(readFileSync(businessPath)), subject });
  const bytes = `${JSON.stringify(projected, null, 2)}\n`;
  if (existsSync(output)) {
    if (readFileSync(output, 'utf8') !== bytes) throw new Error('La projection refuse de remplacer un avis existant différent.');
  } else {
    writeFileSync(output, bytes, { flag: 'wx' });
  }
  return projected;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const args = process.argv.slice(2);
    if (args.length !== 6) throw new Error('Usage : project-blog-reviews <root> <slug> <html> <qa.json> <metier.json> <output.json>');
    const [root, slug, html, qaPath, businessPath, output] = args;
    projectFiles({ root: resolve(root), slug, html: resolve(html), qaPath: resolve(qaPath), businessPath: resolve(businessPath), output: resolve(output) });
    console.log(`Projection écrite : ${resolve(output)} (aucune nouvelle revue).`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
