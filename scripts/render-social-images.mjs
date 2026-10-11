import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'parse5';
import sharp from 'sharp';

async function htmlFiles(root) {
  const files = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) files.push(...await htmlFiles(path));
    else if (entry.name.endsWith('.html')) files.push(path);
  }
  return files;
}

/** Génère uniquement les variantes référencées par les cartes du build Astro. */
export async function renderSocialImages(dist = resolve('dist')) {
  const images = new Set();
  function visit(node) {
    if (node.nodeName === 'meta') {
      const attrs = Object.fromEntries(node.attrs.map(({ name, value }) => [name, value]));
      if (attrs.property === 'og:image' || attrs.name === 'twitter:image') {
        const path = new URL(attrs.content).pathname;
        if (path.startsWith('/social/') && path.endsWith('.jpg')) images.add(path);
      }
    }
    for (const child of node.childNodes ?? []) visit(child);
  }
  for (const path of await htmlFiles(dist)) visit(parse(await readFile(path, 'utf8')));
  for (const path of images) {
    const source = join(dist, path.slice('/social/'.length, -'.jpg'.length));
    const target = join(dist, path.slice(1));
    // « contain » préserve les preuves et les textes sans recadrage destructif.
    const image = sharp(source).resize(1200, 630, { fit: 'contain', background: '#fffefb' }).flatten({ background: '#fffefb' });
    let bytes;
    for (const quality of [85, 75, 65, 55, 45]) {
      bytes = await image.clone().jpeg({ quality, mozjpeg: true }).toBuffer();
      if (bytes.length <= 300_000) break;
    }
    if (bytes.length > 300_000) throw new Error(`Image sociale trop lourde : ${path}`);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, bytes);
  }
  return images.size;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(`${await renderSocialImages()} images sociales JPEG générées (1200 × 630, ≤ 300 Ko).`);
}
