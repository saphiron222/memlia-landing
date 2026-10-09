import { createHash } from 'node:crypto';
import { readFileSync, realpathSync } from 'node:fs';
import { isAbsolute, relative, resolve } from 'node:path';

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const HASH = /^[a-f0-9]{64}$/;
const COMMIT = /^[a-f0-9]{40}$/;
const dateValid = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date ?? '') && Number.isFinite(Date.parse(date)) && new Date(date).toISOString().slice(0, 10) === date;
const instant = (value) => {
  const match = typeof value === 'string' && /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,6})?(?:Z|[+-]\d{2}:\d{2})$/.exec(value);
  return Boolean(match && dateValid(match[1]) && Number(match[2]) < 24 && Number(match[3]) < 60 && Number(match[4]) < 60 && Number.isFinite(Date.parse(value)));
};
export const dilaDay = (value) => new Date(value).toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' });
const requireThat = (condition, message) => { if (!condition) throw new Error(`Copie DILA : ${message}.`); };

/** Lit les données A4, pas une page Légifrance. Ne redater ni l'export ni la consolidation. */
export function readDilaCopy({ root, path, url, excerpt, expectedSha256, asOf = new Date().toISOString() }) {
  requireThat(typeof path === 'string' && path.length > 0 && !isAbsolute(path), 'chemin relatif requis');
  const base = realpathSync(root);
  const file = realpathSync(resolve(base, path));
  const rel = relative(base, file);
  requireThat(rel !== '..' && !rel.startsWith('../') && !isAbsolute(rel), 'chemin hors du dossier');
  const bytes = readFileSync(file);
  const contentHash = sha256(bytes);
  if (expectedSha256 !== undefined) requireThat(HASH.test(expectedSha256) && expectedSha256 === contentHash, 'empreinte de la copie divergente');
  const copy = JSON.parse(bytes);
  const p = copy.provenance;
  requireThat(copy.schema_version === 1 && p && copy.version === copy.id, 'version ou provenance absente/incohérente');
  requireThat(instant(p.retrieved_at) && instant(asOf) && Date.parse(p.retrieved_at) <= Math.min(Date.parse(asOf), Date.now()), 'collecte invalide ou future');
  const age = (Date.parse(`${dilaDay(asOf)}T00:00:00Z`) - Date.parse(`${dilaDay(p.retrieved_at)}T00:00:00Z`)) / 86400000;
  requireThat(age >= 0 && age <= 7, 'collecte périmée (fenêtre 0 à 7 jours)');
  requireThat(typeof copy.warning === 'string' && copy.warning.trim().length > 12, 'réserve de fraîcheur juridique absente');
  let text, versionDate, id;
  if (copy.source_type === 'LEGI_DINUM') {
    requireThat(/^LEGIARTI\d{12}$/.test(copy.id), 'identifiant LEGI invalide');
    requireThat(p.dataset_id === '6883417e592dee0d5beed92a' && p.publisher === 'DINUM/AgentPublic depuis DILA LEGI'
      && HASH.test(p.sha256) && COMMIT.test(p.repository_sha) && COMMIT.test(p.file_commit?.id) && instant(p.file_commit?.date)
      && Date.parse(p.file_commit.date) <= Date.parse(p.retrieved_at)
      && typeof p.url === 'string' && p.url.startsWith(`https://huggingface.co/datasets/AgentPublic/legi/resolve/${p.repository_sha}/data/legi-latest/`), 'provenance du jeu LEGI invalide');
    requireThat(dateValid(copy.valid_from) && dateValid(copy.valid_to_exclusive) && copy.valid_from < copy.valid_to_exclusive && copy.validity_anomaly === false, 'période de version invalide');
    requireThat(Array.isArray(copy.chunks) && copy.chunks.length > 0 && copy.chunks.every((chunk, i) => chunk.index === i + 1 && typeof chunk.text === 'string')
      && copy.chunks.map((chunk) => chunk.text).join('\n') === copy.text, 'texte différent des morceaux A4');
    requireThat(copy.url === `https://www.legifrance.gouv.fr/codes/article_lc/${copy.id}` && url === copy.url, 'URL ou identifiant LEGI divergent');
    text = copy.text; versionDate = copy.valid_from; id = copy.id;
  } else if (copy.source_type === 'DILA_JORFSIMPLE') {
    requireThat(/^JORFTEXT\d{12}$/.test(copy.id) && dateValid(copy.publication_date) && dateValid(copy.signature_date)
      && copy.signature_date <= copy.publication_date, 'identifiant ou date JORF invalide');
    requireThat(p.publisher === 'DILA' && HASH.test(p.archive_sha256)
      && /^https:\/\/echanges\.dila\.gouv\.fr\/OPENDATA\/JORFSIMPLE\//.test(p.archive_url ?? '')
      && typeof p.member === 'string' && p.member.endsWith(`${copy.id}.xml`), 'provenance du jeu JORF invalide');
    requireThat(copy.url === `https://www.legifrance.gouv.fr/jorf/id/${copy.id}` && Array.isArray(copy.articles) && copy.articles.length > 0
      && copy.articles.every((a) => /^JORFARTI\d{12}$/.test(a.id) && typeof a.number === 'string' && typeof a.text === 'string')
      && new Set(copy.articles.map((a) => a.id)).size === copy.articles.length
      && copy.articles.map((a) => `Article ${a.number}\n${a.text}`).join('\n\n') === copy.text, 'acte JORF incohérent');
    const article = copy.articles.find((a) => /^JORFARTI\d{12}$/.test(a.id) && url === `https://www.legifrance.gouv.fr/jorf/article_jo/${a.id}`);
    requireThat(url === copy.url || article, 'URL ou identifiant JORF divergent');
    text = article ? article.text : copy.text; id = article ? article.id : copy.id; versionDate = copy.publication_date;
  } else throw new Error('Copie DILA : fonds non reconnu.');
  requireThat(typeof text === 'string' && text.length >= 12, 'texte absent');
  requireThat(typeof excerpt === 'string' && excerpt.trim().length >= 12 && text.includes(excerpt), 'extrait exact absent');
  return { text, url, id, version: copy.version, versionDate, retrievedAt: p.retrieved_at, checkedAt: dilaDay(p.retrieved_at),
    copySha256: contentHash, textSha256: sha256(text), sourceType: copy.source_type, provenance: p, warning: copy.warning };
}
