import sharp from 'sharp';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const escape = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
function lines(text, width, max) {
  const out = []; let line = '';
  for (const word of String(text).split(/\s+/)) {
    if (word.length > width) throw Error('Mot trop long pour le rendu de preuve.');
    if ((line + ' ' + word).trim().length > width) { out.push(line); line = word; } else line = (line + ' ' + word).trim();
  }
  if (line) out.push(line);
  if (out.length > max) throw Error(`Texte trop long pour la scène (${out.length}/${max} lignes) : raccourcir la recette, jamais tronquer.`);
  return out;
}
function block(text, x, y, width, max, size = 25, color = '#231f20') {
  return `<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="${size}" fill="${color}">${lines(text, width, max).map((line, i) => `<tspan x="${x}" dy="${i ? size * 1.4 : 0}">${escape(line)}</tspan>`).join('')}</text>`;
}
/** Simulation documentaire propre au guide, pas une capture ni un essai éditeur. */
export async function renderGuideProof({ root, integration: d }) {
  const source = `guides/etats/${d.slug}/preuve.svg`;
  const target = `public/proofs/integrations/${d.slug}.webp`;
  if (existsSync(join(root, source)) || existsSync(join(root, target))) throw Error('Rendu déjà présent : écrasement interdit.');
  const colors = { 'Préparé': '#1c8a41', 'À valider': '#8a5e16', 'Arrêt': '#a33d32' };
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
<rect width="1600" height="900" rx="24" fill="#fcfbf7"/>
<rect x="40" y="40" width="1520" height="820" rx="18" fill="#fffefb" stroke="#dedbd4"/>
${block(d.product, 80, 100, 75, 1, 30)}
${block(d.task, 80, 165, 70, 2, 38)}
${block('Simulation documentaire · ' + d.slug, 80, 240, 100, 1, 21, '#615c56')}
<path d="M80 275H1520" stroke="#dedbd4"/>
${d.replay.map((c, i) => { const y = 330 + i * 135; return `<rect x="80" y="${y - 30}" width="1440" height="116" rx="12" fill="#f5f4ef"/>${block(c.input, 105, y, 49, 3, 23)}${block(c.rule, 780, y, 34, 3, 23)}${block(c.outcome, 1320, y, 14, 1, 23, colors[c.outcome])}`; }).join('')}
<path d="M80 735H1520" stroke="#dedbd4"/>
${block('La décision reste humaine. Aucun essai dans le logiciel éditeur.', 80, 790, 95, 2, 24)}
</svg>`;
  const bytes = await sharp(Buffer.from(svg)).webp({ quality: 85, effort: 0 }).toBuffer();
  const meta = await sharp(bytes).metadata();
  if (meta.width !== 1600 || meta.height !== 900 || bytes.length >= 150000) throw Error('Dimensions ou poids de preuve hors contrat.');
  mkdirSync(dirname(join(root, source)), { recursive: true });
  mkdirSync(dirname(join(root, target)), { recursive: true });
  writeFileSync(join(root, source), svg + '\n'); writeFileSync(join(root, target), bytes);
  return { source, target, proof: { title: d.h1, alt: `Simulation documentaire ${d.product} : ${d.task}, trois cas illustratifs, préparation, validation et arrêt.`, detail: 'Simulation locale des cas illustratifs de la règle écrite ; aucune exécution dans le logiciel éditeur.' } };
}
