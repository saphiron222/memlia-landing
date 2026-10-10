import test from 'node:test';
import assert from 'node:assert/strict';
import MarkdownIt from 'markdown-it';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { pageMarkdown, generateAgentMarkdown } from '../../scripts/generate-agent-markdown.mjs';
import { renderPublicSourceText } from '../../scripts/render-public-source-text.mjs';
import { verifyAgentMarkdown } from '../../scripts/verify-agent-markdown.mjs';

test('conserve le contenu principal, les liens absolus, les listes, le code et les tableaux', () => {
  const html = '<html><head><title>Titre SEO</title></head><body><header>Menu</header><main><h1>Titre &amp; sens</h1><nav>Sommaire</nav><aside><p>Limite utile</p></aside><p>Lire <a href="../source#preuve">la source</a>.</p><ol start="3"><li>Étape<ul><li>Sous-étape</li></ul></li></ol><table><thead><tr><th>Règle</th><th>Limite</th></tr></thead><tbody><tr><td>A | B</td><td>Une<br>Deux</td></tr></tbody></table><pre><code>a\nb</code></pre><p hidden>Secret</p><p aria-hidden="true">Décor</p><script>INTERNE</script><form>Formulaire</form></main><footer>Pied</footer></body></html>';
  const md = pageMarkdown(html, 'https://memlia.fr/blog/article');
  assert.match(md, /# Titre & sens/);
  assert.match(md, /Limite utile/);
  assert.match(md, /\[la source\]\(https:\/\/memlia.fr\/source#preuve\)/);
  assert.match(md, /3\. Étape\n\n   - Sous-étape/);
  assert.match(md, /\| Règle \| Limite \|\n\| --- \| --- \|\n\| A \\\| B \| Une<br>Deux \|/);
  assert.match(md, /```\na\nb\n```/);
  assert.doesNotMatch(md, /Menu|Sommaire|Secret|Décor|INTERNE|Formulaire|Pied|Titre SEO/);
});

test('génère uniquement les routes sitemap, après nettoyage des sources, de façon idempotente', async () => {
  const dist = mkdtempSync(join(tmpdir(), 'agent-markdown-'));
  try {
    mkdirSync(join(dist, 'blog'), { recursive: true });
    writeFileSync(join(dist, 'sitemap-pages.xml'), '<urlset><url><loc>https://memlia.fr/</loc></url><url><loc>https://memlia.fr/blog/article</loc></url></urlset>');
    writeFileSync(join(dist, 'index.html'), '<html><head></head><body><main><h1>Accueil</h1></main></body></html>');
    writeFileSync(join(dist, 'blog/article.html'), renderPublicSourceText('<html><head></head><body><main><h1>Article</h1><p>Source, consultée le 6 octobre 2026</p></main></body></html>'));
    writeFileSync(join(dist, 'llms.txt'), '# Memlia\n');
    writeFileSync(join(dist, '_headers'), '/contact\n  X-Test: intact\n');
    assert.equal(generateAgentMarkdown(dist), 2);
    const full = readFileSync(join(dist, 'llms-full.txt'), 'utf8');
    const llms = readFileSync(join(dist, 'llms.txt'), 'utf8');
    assert.match(llms, /https:\/\/memlia.fr\/markdown\/index.md/);
    assert.match(llms, /https:\/\/memlia.fr\/markdown\/blog\/article.md/);
    assert.match(llms, /https:\/\/memlia.fr\/llms-full.txt/);
    assert.doesNotMatch(full, /consultée le/);
    assert.match(full, /Source/);
    assert.match(readFileSync(join(dist, 'blog/article.html'), 'utf8'), /<link rel="alternate" type="text\/markdown" href="https:\/\/memlia.fr\/markdown\/blog\/article.md">/);
    assert.match(readFileSync(join(dist, '_headers'), 'utf8'), /\/markdown\/\*\n  Content-Type: text\/markdown; charset=utf-8/);
    generateAgentMarkdown(dist);
    assert.equal(readFileSync(join(dist, 'llms-full.txt'), 'utf8'), full);
    assert.equal(readFileSync(join(dist, 'llms.txt'), 'utf8'), llms);
    assert.equal(readFileSync(join(dist, 'index.html'), 'utf8').match(/rel="alternate"/g).length, 1);
    assert.equal(await verifyAgentMarkdown({ dist }), 2);
    writeFileSync(join(dist, 'markdown/blog/article.md'), '# Mauvaise version\n');
    await assert.rejects(verifyAgentMarkdown({ dist }), /texte divergent/);
  } finally { rmSync(dist, { recursive: true, force: true }); }
});

test('refuse un HTML sans main plutôt que de publier la navigation', () => {
  assert.throws(() => pageMarkdown('<html><body>Menu</body></html>', 'https://memlia.fr/'), /main/);
});

const markdownParser = new MarkdownIt();
test('le lien de repli sans JavaScript reste un lien Markdown, pas du HTML brut', () => {
  const md = pageMarkdown('<main><h1>Vidéo</h1><noscript><p><a href="/video.mp4">Télécharger la vidéo</a></p></noscript></main>', 'https://memlia.fr/');
  const links = markdownParser.parse(md, {}).flatMap(token => token.children ?? []).filter(token => token.type === 'link_open');
  assert.equal(links.length, 1);
  assert.equal(links[0].attrGet('href'), 'https://memlia.fr/video.mp4');
  assert.doesNotMatch(md, /<a|<p/);
});
test('R1 : un parseur indépendant retrouve le code littéral en prose et tableaux', () => {
  const values = ['proposition_a_valider', '[S21.G00]', 'C:\\dossier\\paie', '`champ`', 'a``b', 'a|b'];
  const codes = values.map(value => `<code>${value}</code>`).join(' ');
  const md = pageMarkdown(`<main><h1>Code</h1><p>${codes}</p><table><tr><th>Champ</th></tr><tr><td>${codes}</td></tr></table></main>`, 'https://memlia.fr/test');
  const parsed = markdownParser.parse(md, {}).flatMap(token => token.children ?? []);
  assert.deepEqual(parsed.filter(token => token.type === 'code_inline').map(token => token.content), [...values, ...values]);
});

test('R2 : cartes liées et listes multiparagraphes conservent titres, libellés et items', () => {
  const md = pageMarkdown('<main><h1>Guide</h1><a href="/outil"><h3>Outil utile</h3><p>Une règle précise.</p></a><ol><li><h3>Étape une</h3><p>Premier paragraphe.</p><p>Suite de la première étape.</p><ul><li>Sous-étape</li></ul></li><li><h3>Étape deux</h3><p>Second paragraphe.</p></li><li><h3>Étape trois</h3><p>Dernier paragraphe.</p></li></ol></main>', 'https://memlia.fr/test');
  const tokens = markdownParser.parse(md, {});
  assert.deepEqual(tokens.filter(token => token.type === 'heading_open').map(token => token.tag), ['h1', 'h3', 'h3', 'h3', 'h3']);
  const links = tokens.flatMap(token => token.children ?? []).filter(token => token.type === 'link_open');
  assert.equal(links.length, 1);
  assert.equal(links[0].attrGet('href'), 'https://memlia.fr/outil');
  assert.match(markdownParser.render(md), /<a href="https:\/\/memlia.fr\/outil">Outil utile Une règle précise\.<\/a>/);
  const items = tokens.filter(token => token.type === 'list_item_open');
  assert.equal(items.length, 4);
  assert.equal(items.filter(token => token.level === 1).length, 3);
  const continuation = tokens.find(token => token.type === 'inline' && token.content === 'Suite de la première étape.');
  assert.equal(continuation.level, 3);
});
