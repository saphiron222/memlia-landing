import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { auditArticleInventory, validateDossier } from '../../scripts/lib/blog-pipeline.mjs';
import { ADOPTION_PATH, PUBLISHED_BLOG_HASHES, validatePublishedAdoption, sha256 } from '../../scripts/lib/blog-published-authority.mjs';
import { preparePreview } from '../../scripts/prepare-preview.mjs';

const slugs = Object.keys(PUBLISHED_BLOG_HASHES);
let root;
before(() => {
  root = mkdtempSync(join(tmpdir(), 'memlia-published-audit-'));
  for (const path of ['editorial/articles', 'src/content/blog', 'src/data', 'src/pages', 'public/images']) {
    cpSync(path, join(root, path), { recursive: true });
  }
});
after(() => rmSync(root, {recursive:true, force:true}));
const dossier = (slug=slugs[0]) => join(root,'editorial/articles',slug);
const readJson = (path) => JSON.parse(readFileSync(path));
const writeJson = (path, value) => writeFileSync(path, JSON.stringify(value,null,2)+'\n');
const validate = (slug=slugs[0], gateMode='published-audit') => validateDossier({root,slug,gateMode,renderedBlogHtml:`<li data-article="${slug}"><a href="/blog/${slug}">Article</a></li>`});
async function mutated(path, transform, check) {
  const original=readFileSync(path);
  try { writeFileSync(path,transform(original.toString())); await check(); }
  finally { writeFileSync(path,original); }
}
for (const slug of slugs) {
  test(`dossier publié complet validé sans nouveau fact-check ni autorisation : ${slug}`, async () => {
    const result=await validate(slug);
    assert.equal(result.pass,true,JSON.stringify(result.errors));
    assert.equal(result.auditMode,'published-preservation');
    assert.equal(result.publicationAuthorized,false);
    assert.equal(result.freshFactCheck,false);
    assert.equal(sha256(readFileSync(join(root,'src/content/blog',slug+'.md'))),PUBLISHED_BLOG_HASHES[slug]);
  });
  test(`les gates de preview et production restent fermés : ${slug}`, async () => {
    for (const mode of ['protected-preview','production']) {
      const result=await validate(slug,mode);
      assert.equal(result.pass,false);
      assert.ok(result.errors.some((e)=>/revue métier|businessReview|Frontmatter brouillon/.test(e)));
    }
  });
}
for (const [name, replace] of [
  ['article', (s)=>s+'\nContenu ajouté sans preuve.\n'],
  ['auteur', (s)=>s.replace('auteur: kevin','auteur: autre')],
  ['brouillon', (s)=>s.replace('brouillon: false','brouillon: true')],
  ['lien croisé', (s)=>s.replace(`/blog/${slugs[1]}`,'/blog/cible-absente')],
]) {
  test(`mutation ${name} rejetée sur les octets exacts`, async () => {
    await mutated(join(root,'src/content/blog',slugs[0]+'.md'),replace,async()=>{
      const result=await validate();
      assert.equal(result.pass,false);
      assert.ok(result.errors.some((e)=>e.includes('Autorité publiée')));
    });
  });
}
test('reçu absent et inventaire falsifié sont refusés', async()=>{
  await mutated(join(dossier(),ADOPTION_PATH),()=>'{',async()=>assert.equal((await validate()).pass,false));
  await mutated(join(dossier(),ADOPTION_PATH),(s)=>{const p=JSON.parse(s);p.files=[];return JSON.stringify(p);},async()=>assert.equal((await validate()).pass,false));
});
test('une migration ne peut pas dater à neuf une ancienne collecte, même avec table de hashes recalculée', async()=>{
  const manifest=readJson(join(dossier(),'manifest.json'));
  const path=join(dossier(),manifest.sources[0].verificationEvidence);
  const receiptPath=join(dossier(),ADOPTION_PATH);
  const receiptBytes=readFileSync(receiptPath);
  try {
    await mutated(path,(s)=>{const p=JSON.parse(s);p.checkedAt='2026-09-15';return JSON.stringify(p);},async()=>{
      const receipt=readJson(receiptPath);
      const row=receipt.files.find((r)=>r.path===manifest.sources[0].verificationEvidence);
      const bytes=readFileSync(path);row.sha256=sha256(bytes);row.bytes=bytes.length;
      writeJson(receiptPath,receipt);
      const errors=validatePublishedAdoption(dossier(),manifest,PUBLISHED_BLOG_HASHES[slugs[0]]);
      assert.ok(errors.some((e)=>e.includes('date/provenance historique modifiée')));
    });
  } finally { writeFileSync(receiptPath,receiptBytes); }
});
test('supprimer la table de provenance ferme le reçu', async()=>{
  await mutated(join(dossier(),ADOPTION_PATH),(s)=>{const p=JSON.parse(s);p.adoptedEvidence=[];return JSON.stringify(p);},async()=>{
    const result=await validate();assert.ok(result.errors.some((e)=>e.includes('preuves héritées incomplet')));
  });
});
test('un résultat historique modifié reste refusé même après recalcul du reçu', async()=>{
  const manifest=readJson(join(dossier(),'manifest.json'));
  const path=join(dossier(),manifest.sources[0].verificationEvidence);
  const receiptPath=join(dossier(),ADOPTION_PATH);
  const receiptBytes=readFileSync(receiptPath);
  try {
    await mutated(path,(s)=>{const p=JSON.parse(s);p.observations=['Nouvelle recherche inventée.'];return JSON.stringify(p);},async()=>{
      const receipt=readJson(receiptPath);
      const row=receipt.files.find((r)=>r.path===manifest.sources[0].verificationEvidence);
      const bytes=readFileSync(path);row.sha256=sha256(bytes);row.bytes=bytes.length;writeJson(receiptPath,receipt);
      assert.ok(validatePublishedAdoption(dossier(),manifest,PUBLISHED_BLOG_HASHES[slugs[0]]).some((e)=>e.includes('résultat/provenance historique modifié')));
    });
  } finally {writeFileSync(receiptPath,receiptBytes);}
});
test('aucun dossier publié absent ne peut devenir legacy-preserved', async()=>{
  const path=join(dossier(),'manifest.json');const bytes=readFileSync(path);
  try {rmSync(path);const result=auditArticleInventory({root});assert.ok(result.errors.length);assert.equal(result.articles.find((a)=>a.slug===slugs[0]).status,'blocked');}
  finally{writeFileSync(path,bytes);}
});
test('un rapport de conservation ne peut pas servir de gate de préparation de preview', async()=>{
  const report=await validate();
  assert.equal(report.pass,true,JSON.stringify(report.errors));
  const path=join(root,'audit-pass.json');writeJson(path,report);
  const source=join(root,'build-empty');mkdirSync(source);
  assert.throws(()=>preparePreview({source,target:join(root,'preview'),candidateSlug:slugs[0],gateReport:path}),/gate PASS/);
});
