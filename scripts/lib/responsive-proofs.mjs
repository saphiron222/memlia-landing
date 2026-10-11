import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'parse5';
import sharp from 'sharp';

export const PROOF_WIDTHS = [400, 800, 1200];
export const PROOF_SIZES = '(max-width: 767px) calc(100vw - 32px), (max-width: 1232px) calc(100vw - 64px), 1200px';
export const proofSizes = lazy => `${lazy ? 'auto, ' : ''}${PROOF_SIZES}`;
const proofSource = src => /^\/proofs\/(?!responsive\/|.*\/og\/)[a-zA-Z0-9/_-]+\.webp$/.test(src ?? '');
const hash = bytes => createHash('sha256').update(bytes).digest('hex').slice(0, 16);
export function proofSrcset(src, bytes) {
  return proofSrcsetWithHash(src, hash(bytes));
}
function proofSrcsetWithHash(src, digest) {
  const stem = src.slice('/proofs/'.length, -5);
  return [...PROOF_WIDTHS.map(width => `/proofs/responsive/${stem}-${digest}-${width}.webp ${width}w`), `${src} 1600w`].join(', ');
}
// Le contrat blog vérifie aussi le digest depuis les octets du master ; ici on reconnaît
// uniquement la forme de diffusion pour distinguer logistique et contenu éditorial.
export function isResponsiveProofSelection(src, srcset, sizes, lazy) {
  const digest = srcset?.match(/-([a-f0-9]{16})-400\.webp 400w/)?.[1];
  return proofSource(src) && Boolean(digest) && srcset === proofSrcsetWithHash(src, digest)
    && sizes === proofSizes(lazy);
}
const attr = (node, name) => node.attrs?.find(item => item.name === name)?.value;
function nodes(node) { return [node, ...(node.childNodes ?? []).flatMap(nodes)]; }
function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory()
    ? htmlFiles(join(dir, entry.name)) : entry.name.endsWith('.html') ? [join(dir, entry.name)] : []);
}

/** Enrichit seulement les balises rendues : sources éditoriales et masters restent intacts. */
export async function renderResponsiveProofs(dist) {
  const generated = new Map();
  for (const file of htmlFiles(dist)) {
    const html = readFileSync(file, 'utf8');
    const elements = nodes(parse(html, { sourceCodeLocationInfo: true }));
    const edits = [];
    for (const node of elements) {
      const preload = node.tagName === 'link' && attr(node, 'rel') === 'preload' && attr(node, 'as') === 'image';
      if (node.tagName !== 'img' && !preload) continue;
      const src = attr(node, preload ? 'href' : 'src');
      if (!proofSource(src)) continue;
      if (!generated.has(src)) {
        const bytes = readFileSync(join(dist, src));
        const meta = await sharp(bytes).metadata();
        if (meta.width !== 1600 || meta.height !== 900) throw new Error(`Master de preuve non canonique : ${src}`);
        const srcset = proofSrcset(src, bytes);
        for (const [i, width] of PROOF_WIDTHS.entries()) {
          const url = srcset.split(', ')[i].split(' ')[0];
          const target = join(dist, url);
          mkdirSync(dirname(target), { recursive: true });
          // Même qualité que le renderer des masters ; ni recadrage ni réécriture du master.
          await sharp(bytes).resize(width).webp({ quality: 90, effort: 4 }).toFile(target);
        }
        generated.set(src, srcset);
      }
      const location = node.sourceCodeLocation.startTag;
      let tag = html.slice(location.startOffset, location.endOffset);
      const additions = { [preload ? 'imagesrcset' : 'srcset']: generated.get(src),
        [preload ? 'imagesizes' : 'sizes']: proofSizes(!preload && attr(node, 'loading') === 'lazy') };
      for (const [name, value] of Object.entries(additions)) {
        if (attr(node, name) !== undefined) {
          const loc = node.sourceCodeLocation.attrs[name];
          tag = tag.replace(html.slice(loc.startOffset, loc.endOffset), `${name}="${value}"`);
        } else tag = tag.replace(/\/?\s*>$/, ` ${name}="${value}">`);
      }
      edits.push({ ...location, tag });
    }
    let output = html;
    for (const edit of edits.sort((a, b) => b.startOffset - a.startOffset)) {
      output = output.slice(0, edit.startOffset) + edit.tag + output.slice(edit.endOffset);
    }
    if (output !== html) writeFileSync(file, output);
  }
  return { masters: generated.size, variants: generated.size * PROOF_WIDTHS.length };
}

export default function responsiveProofs() {
  return { name: 'memlia-responsive-proofs', hooks: {
    'astro:build:done': async ({ dir, logger }) => {
      const report = await renderResponsiveProofs(fileURLToPath(dir));
      logger.info(`${report.masters} masters conservés, ${report.variants} variantes responsives`);
    },
  } };
}
