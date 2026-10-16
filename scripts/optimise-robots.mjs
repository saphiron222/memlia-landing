/** Dérivés des originaux imagegen : aucun remplacement graphique ou fond inventé. */
import {mkdirSync,readFileSync,writeFileSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {join,resolve} from 'node:path';
import sharp from 'sharp';
import {ROBOTS} from '../src/data/robots.ts';
const root=resolve(process.env.ROBOT_ASSET_ROOT ?? '../../../memlia-landing-sources/hub-robots/2026-10-15');
for(const dir of ['png','webp'])mkdirSync(join(root,dir),{recursive:true});
mkdirSync('public/robots',{recursive:true});
const records=[];
for(const robot of ROBOTS){
 const original=join(root,'originaux',`${robot.id}.png`);
 const prompt=JSON.parse(readFileSync(join(root,'prompts',`${robot.id}.json`),'utf8'));
 const png=join(root,'png',`${robot.id}.png`);
 await sharp(original).resize(1024,1024,{fit:'contain',background:'#fffefb'}).png().toFile(png);
 await sharp(png).webp({quality:90}).toFile(join(root,'webp',`${robot.id}-1024.webp`));
 const variants=[];
 for(const size of [128,256,512])for(const ext of ['avif','webp']){
  const path=`public/robots/${robot.id}-${size}.${ext}`;
  await sharp(png).resize(size,size)[ext]({quality:ext==='avif'?60:82}).toFile(path);
  variants.push({path,width:size,height:size,bytes:statSync(path).size});
 }
 records.push({id:robot.id,nom:robot.nom,palette:prompt.palette,description:robot.image.alt,objet:prompt.objet,original,png,prompt:join(root,'prompts',`${robot.id}.json`),reference:prompt.reference,referenceArchive:prompt.referenceArchive,sha256:createHash('sha256').update(readFileSync(png)).digest('hex'),variants});
}
const cells=[];
for(let i=0;i<records.length;i++){
 const r=records[i],left=(i%4)*300,top=Math.floor(i/4)*340;
 cells.push({input:await sharp(r.png).resize(280,280).png().toBuffer(),left:left+10,top});
 const label=r.nom.replaceAll('&','&amp;');
 cells.push({input:Buffer.from(`<svg width="300" height="60"><rect width="300" height="60" fill="#fffefb"/><text x="150" y="22" text-anchor="middle" font-family="Arial" font-size="13">${label}</text><text x="150" y="42" text-anchor="middle" font-family="Arial" font-size="12" fill="#666">${r.palette}</text></svg>`),left,top:top+280});
}
await sharp({create:{width:1200,height:Math.ceil(records.length/4)*340,channels:3,background:'#fffefb'}}).composite(cells).png().toFile(join(root,'planche-contact.png'));
const trio=[];
for(const [i,id] of ['taxes-foncieres','cfe','suivi-urssaf'].entries())trio.push({input:await sharp(join(root,'png',`${id}.png`)).resize(400,400).toBuffer(),left:i*400,top:115});
await sharp({create:{width:1200,height:630,channels:3,background:'#fffefb'}}).composite(trio).webp({quality:88}).toFile('public/robots/hub.webp');
const manifest={date:'2026-10-15',generator:'imagegen intégré Codex ; aucun choix de modèle exposé',normalizer:'scripts/optimise-robots.mjs',records};
writeFileSync(join(root,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
writeFileSync('docs/strategy/site-v3/hub-robots/images-manifest.json',JSON.stringify(manifest,null,2)+'\n');
console.log(`${records.length} maîtres 1024 × 1024, ${records.flatMap(r=>r.variants).length} dérivés et planche contact.`);
