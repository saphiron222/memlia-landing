/** Prépare une copie de déploiement noindex sans modifier le candidat indexable ni la production. */
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROBOTS_META = /<meta\s+name=["']robots["'][^>]*>/gi;
const PREVIEW_META = '<meta name="robots" content="noindex, nofollow">';

function listHtmlFiles(directory) {
  return readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.endsWith('.html'))
    .map(entry => join(entry.parentPath, entry.name));
}

export function preparePreview({
  source = 'dist',
  target = '.qa/preview-dist',
  candidateSlug = process.env.BLOG_PREVIEW_SLUG,
  gateReport = candidateSlug ? `.qa/blog/${candidateSlug}/gate-preview.json` : undefined,
  candidateSlugs = candidateSlug ? [candidateSlug] : [],
  gateReports = candidateSlug ? { [candidateSlug]: gateReport } : {},
} = {}) {
  const sourcePath = resolve(source);
  const targetPath = resolve(target);
  if (sourcePath === targetPath) throw new Error('La cible preview doit être distincte du dist de production.');
  const uniqueCandidateSlugs = [...new Set(candidateSlugs)];
  if (uniqueCandidateSlugs.some((slug) => typeof slug !== 'string' || !slug)) {
    throw new Error('Chaque candidat preview doit avoir un slug non vide.');
  }
  for (const slug of uniqueCandidateSlugs) {
    let gate;
    try {
      gate = JSON.parse(readFileSync(resolve(gateReports[slug]), 'utf8'));
    } catch {
      throw new Error(`Un rapport de gate PASS est requis pour le candidat ${slug}.`);
    }
    if (gate.slug !== slug || gate.pass !== true || gate.auditMode === 'published-preservation' || gate.publicationAuthorized === false) {
      throw new Error(`Un rapport de gate PASS correspondant à ${slug} est requis.`);
    }
  }
  if (!existsSync(join(sourcePath, 'index.html'))) {
    throw new Error('Construire et vérifier dist avant de préparer une preview.');
  }

  const htmlFiles = listHtmlFiles(sourcePath);
  const transformed = new Map();
  for (const path of htmlFiles) {
    const html = readFileSync(path, 'utf8');
    const matches = html.match(ROBOTS_META) ?? [];
    if (matches.length !== 1) {
      throw new Error(`${path} doit contenir une meta robots unique (trouvé : ${matches.length}).`);
    }
    transformed.set(path.slice(sourcePath.length + 1), html.replace(ROBOTS_META, PREVIEW_META));
  }

  rmSync(targetPath, { recursive: true, force: true });
  mkdirSync(dirname(targetPath), { recursive: true });
  cpSync(sourcePath, targetPath, { recursive: true });
  for (const [relative, html] of transformed) writeFileSync(join(targetPath, relative), html);
  writeFileSync(join(targetPath, '_headers'), '/*\n  X-Robots-Tag: noindex, nofollow\n');
  return { htmlFiles: htmlFiles.length, target };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const result = preparePreview();
  console.log(`Preview noindex, nofollow prête dans ${result.target} (${result.htmlFiles} HTML). Déployer uniquement ce dossier sur une branche preview, jamais main.`);
}
