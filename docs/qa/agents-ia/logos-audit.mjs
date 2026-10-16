/** Audit ciblé des logos, sans navigateur ni exécution du contenu SVG tiers.
 * Usage : node docs/qa/agents-ia/logos-audit.mjs <dossier-de-reprise> [--planches]
 * Les SVG ne sont décodés par sharp/librsvg qu'après contrôle statique.
 */
import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, basename } from 'node:path';
import sharp from 'sharp';
import { CONNECTEURS, LOGOS_SUR_ENCRE } from '../../../src/data/connecteurs.ts';
import { tailleAffichee } from '../../../src/data/connecteurs-rendu.ts';

const source = process.argv[2];
if (!source) throw new Error('Préciser le dossier de reprise contenant logos-manifest.json et logos-bruts/');
const out = join(source, 'audit-codex');
await mkdir(out, { recursive: true });
const sha = (b) => createHash('sha256').update(b).digest('hex');
const originaux = JSON.parse(await readFile(join(source, 'logos-manifest.json'), 'utf8'));
const bruts = [...new Map(originaux.filter((e) => e.fichier && e.sha256).map((e) => [e.fichier, e])).values()];
const verificationsBruts = [];
for (const e of bruts) {
  const b = await readFile(join(source, 'logos-bruts', basename(e.fichier)));
  verificationsBruts.push({ fichier: e.fichier, attendu: e.sha256, observe: sha(b), conforme: sha(b) === e.sha256 });
}
const risques = [
  [/<\s*(?:script|foreignObject|iframe|embed|object|audio|video)\b/iu, 'élément actif'],
  [/\son[^\s=/>]+\s*=/iu, 'attribut événement'],
  [/(?:xlink:)?href\s*=\s*["'](?!#|data:image\/(?:png|jpe?g|gif|webp);base64,)/iu, 'href externe'],
  [/@import|javascript:|<!ENTITY|<!DOCTYPE/iu, 'import, script ou entité'],
  [/url\(\s*['"]?\s*(?!#|data:image\/)[^\s)'"#]/iu, 'url externe'],
];
const fichiers = await readdir('public/logos');
const declares = new Set(CONNECTEURS.filter((e) => e.logo).map((e) => basename(e.logo.src)));
const erreurs = verificationsBruts.filter((e) => !e.conforme).map((e) => `SHA brut : ${e.fichier}`);
for (const f of fichiers) if (!declares.has(f)) erreurs.push(`orphelin : ${f}`);
const cartes = [];
for (const c of CONNECTEURS) {
  if (!c.logo) { cartes.push({ id: c.id, nom: c.nom, etat: !!c.etat, logo: null }); continue; }
  const fichier = basename(c.logo.src);
  const b = await readFile(join('public', c.logo.src));
  const problemes = [];
  const avertissements = [];
  if (basename(c.logo.src).replace(/\.(svg|webp)$/u, '') !== c.id) problemes.push('id incohérent');
  if (c.etat) problemes.push('carte État avec logo');
  if (b.length > 40000) problemes.push('plus de 40 Ko');
  if (fichier.endsWith('.svg')) {
    const s = b.toString('utf8');
    for (const [rx, message] of risques) if (rx.test(s)) problemes.push(message);
    if (!/<svg\b[^>]*\sxmlns=["']http:\/\/www.w3.org\/2000\/svg["']/u.test(s)) problemes.push('xmlns absent');
    if (/var\(--/u.test(s)) avertissements.push('variable CSS');
    if (/\bclass=/u.test(s) && !/<style[\s>]/u.test(s)) avertissements.push('classes sans style interne');
    if (/currentColor/iu.test(s)) avertissements.push('currentColor');
    if (/data:image\//u.test(s)) avertissements.push('raster embarqué');
  } else if (b.subarray(0, 4).toString() !== 'RIFF' || b.subarray(8, 12).toString() !== 'WEBP') problemes.push('pas un WebP');
  let mesure = {};
  if (!problemes.length) {
    try {
      const m = await sharp(b, { limitInputPixels: 40_000_000 }).metadata();
      const { data, info } = await sharp(b).resize({ width: 320, height: 100, fit: 'inside' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      let visible = 0, clair = 0;
      for (let i=0; i<data.length; i+=4) if (data[i+3] > 100) { visible++; if (Math.min(data[i],data[i+1],data[i+2]) > 210) clair++; }
      const fond = LOGOS_SUR_ENCRE.has(c.id) ? 'encre' : 'clair';
      mesure = { largeur: m.width, hauteur: m.height, affiche: tailleAffichee(m.width,m.height,fond==='encre'?32:40), fond, pixelsClairs: visible ? +(clair/visible).toFixed(3) : null, pixelsVisibles: visible };
      if (!visible) problemes.push('aucun pixel visible');
      if (clair/visible > .8 && fond !== 'encre') avertissements.push('logo clair sur fond clair');
    } catch (e) { problemes.push(`décodage : ${e.message}`); }
  }
  cartes.push({ id:c.id, nom:c.nom, editeur:c.editeur, fichier, octets:b.length, sha256:sha(b), ...mesure, avertissements, problemes });
  erreurs.push(...problemes.map((p) => `${fichier} : ${p}`));
}
const hashes = new Map();
for (const c of cartes.filter((e) => e.sha256)) { if (!hashes.has(c.sha256)) hashes.set(c.sha256, []); hashes.get(c.sha256).push(c.id); }
const rapport = { date:'2026-10-15', source, methode:'SHA-256 avant lecture des bruts ; contrôle statique des SVG ; décodage sharp/librsvg des fichiers publics contrôlés, sans navigateur', bruts:{ fichiers:bruts.length, conformes:verificationsBruts.filter((e)=>e.conforme).length, verifications:verificationsBruts }, resume:{ cartes:cartes.length, avecLogo:cartes.filter((e)=>e.fichier).length, sansLogo:cartes.filter((e)=>!e.fichier).length, etat:cartes.filter((e)=>e.etat).length, octets:cartes.reduce((s,e)=>s+(e.octets||0),0), svg:cartes.filter((e)=>e.fichier?.endsWith('.svg')).length, webp:cartes.filter((e)=>e.fichier?.endsWith('.webp')).length }, erreurs, doublons:[...hashes.values()].filter((a)=>a.length>1), cartes };
await writeFile(join(out,'logos-audit.json'),JSON.stringify(rapport,null,2)+'\n');
if (process.argv.includes('--planches')) {
  const logos = cartes.filter((e) => e.fichier && !e.problemes.length);
  const esc = (s) => s.replace(/[&<>"']/gu,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
  for (let start=0; start<logos.length; start+=60) {
    const lot = logos.slice(start,start+60), layers=[];
    for (let i=0;i<lot.length;i++) {
      const c=lot[i], x=(i%5)*240, y=Math.floor(i/5)*105;
      const bg=c.fond==='encre'?'#231f20':'#fffefb';
      const tile = Buffer.from(`<svg width="240" height="105" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="234" height="70" fill="${bg}" stroke="#d0cec8"/><text x="6" y="91" font-family="sans-serif" font-size="11">${esc(c.id)}</text></svg>`);
      layers.push({ input:tile, left:x, top:y });
      const img=await sharp(join('public/logos',c.fichier)).resize({ width:c.affiche.largeur, height:c.affiche.hauteur, fit:'inside' }).png().toBuffer();
      const m=await sharp(img).metadata();
      layers.push({ input:img, left:x+Math.round((240-m.width)/2), top:y+Math.round((73-m.height)/2) });
    }
    await sharp({ create:{width:1200,height:Math.ceil(lot.length/5)*105,channels:4,background:'#f3f1ec'} }).composite(layers).png().toFile(join(out,`logos-planche-${start/60+1}.png`));
  }
}
console.log(JSON.stringify({ ...rapport.resume, bruts:rapport.bruts.conformes+'/'+rapport.bruts.fichiers, erreurs, avertissements:cartes.filter((e)=>e.avertissements?.length).map(({id,avertissements})=>({id,avertissements})), cartesSansLogo:cartes.filter((e)=>!e.fichier).map(({id,etat})=>({id,etat})), doublons:rapport.doublons },null,2));
if (erreurs.length) process.exitCode=1;
