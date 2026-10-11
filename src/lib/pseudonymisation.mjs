/** Copie de travail seulement : aucun anonymat ni validité fiscale garantis. */
export const MAX_BYTES = 20 * 1024 * 1024;
export const MAX_ROWS = 100_000;
export const MAX_COLUMNS = 128;
const freeHeader = /libell|libre|comment|description|texte|memo|note/i;
const identifierHeader = /nom|prenom|email|mail|iban|siret|siren|adresse|telephone|client|fournisseur|auxiliaire|compteaux/i;
const indirectHeader = /date|montant|debit|credit|solde|quantite|codepostal/i;

export function decodeFile(bytes, encoding) {
  if (bytes.byteLength > MAX_BYTES) throw new Error('Fichier supérieur à 20 Mo : import refusé.');
  if (!['utf-8', 'windows-1252'].includes(encoding)) throw new Error('Choisissez UTF-8 ou Windows-1252.');
  if (bytes[0] === 0xff && bytes[1] === 0xfe || bytes[0] === 0xfe && bytes[1] === 0xff) throw new Error('UTF-16 non pris en charge : utilisez une copie UTF-8.');
  let text;
  try { text = new TextDecoder(encoding, { fatal: true }).decode(bytes); }
  catch { throw new Error('Encodage illisible : choisissez explicitement Windows-1252 ou une copie UTF-8.'); }
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\ufffd]/.test(text)) throw new Error('Fichier binaire ou caractères illisibles : import refusé.');
  return text;
}

/** Parse strict ; ligne indiquée = ligne physique source, même dans les cellules multilignes. */
export function parseDelimited(input, delimiter, { allowDuplicateHeaders = false, sourceLines = false, minimumColumns = 2 } = {}) {
  if (![',', ';', '\t', '|'].includes(delimiter)) throw new Error('Séparateur non pris en charge.');
  const text = input.replace(/^\uFEFF/, '');
  if (!text.trim() || /\u0000/.test(text)) throw new Error('Fichier vide ou binaire.');
  const records = [], lines = []; let row = [], cell = '', state = 'start', line = 1, recordLine = 1;
  const fail = (message) => { throw new Error(`Ligne ${line} : ${message}`); };
  const field = () => { row.push(cell); cell = ''; state = 'start'; if (row.length > MAX_COLUMNS) fail('plus de 128 colonnes.'); };
  const record = () => { field(); records.push(row); lines.push(recordLine); row = []; if (records.length > MAX_ROWS + 1) fail('plus de 100 000 lignes de données.'); };
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (state === 'quoted') {
      if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else state = 'closed'; }
      else { cell += c; if (c === '\n' || c === '\r' && text[i + 1] !== '\n') line++; }
    } else if (c === delimiter) field();
    else if (c === '\r' || c === '\n') { record(); if (c === '\r' && text[i + 1] === '\n') i++; line++; recordLine = line; }
    else if (c === '"' && state === 'start') state = 'quoted';
    else if (state === 'closed' || c === '"') fail('guillemets ou texte après une cellule citée invalides.');
    else { cell += c; state = 'plain'; }
    if (cell.length > 65_536) fail('cellule supérieure à 65 536 caractères.');
  }
  if (state === 'quoted') fail('guillemet non fermé.');
  if (cell || row.length || state !== 'start') record();
  const headers = records.shift();
  if (!headers || headers.length < minimumColumns) throw new Error('Au moins deux colonnes requises : vérifiez le séparateur.');
  if (headers.some(h => !h.trim()) || !allowDuplicateHeaders && new Set(headers).size !== headers.length) throw new Error('En-têtes vides ou dupliqués : import refusé.');
  if (!records.length) throw new Error('Aucune ligne de données.');
  for (const [i, r] of records.entries()) if (r.length !== headers.length) throw new Error(`Enregistrement ${i + 2} : nombre de colonnes différent des en-têtes.`);
  return { headers, rows: records, ...(sourceLines ? { lines: lines.slice(1) } : {}) };
}

export function defaultActions(headers) {
  // Rien n'est conservé implicitement. Les alias ne prétendent pas anonymiser.
  return headers.map(h => freeHeader.test(h) ? 'remove' : identifierHeader.test(h) ? 'alias' : 'remove');
}

export function transform(data, actions) {
  if (actions.length !== data.headers.length || actions.some(a => !['remove','alias','keep'].includes(a))) throw new Error('Choisissez une action valide pour chaque colonne.');
  const retained = actions.map((a, i) => a === 'remove' ? -1 : i).filter(i => i >= 0);
  if (!retained.length) throw new Error('Conservez ou remplacez au moins une colonne.');
  const maps = data.headers.map(() => new Map()); const mapping = [];
  const rows = data.rows.map(row => retained.map(i => {
    const value = row[i];
    if (actions[i] !== 'alias' || value === '') return value;
    if (!maps[i].has(value)) {
      const alias = `C${i + 1}_${String(maps[i].size + 1).padStart(6, '0')}`;
      maps[i].set(value, alias); mapping.push([data.headers[i], alias, value]);
    }
    return maps[i].get(value);
  }));
  const risks = ['Pseudonymisation seulement : réidentification possible par individualisation, corrélation ou inférence. La copie reste à examiner avant tout partage ; aucun transfert vers une IA n’est autorisé par cet outil.'];
  if (retained.some(i => actions[i] === 'keep')) risks.push('Colonnes conservées : des noms ou identifiants peuvent subsister. La détection est heuristique, elle ne reconnaît pas tous les noms.');
  if (retained.some(i => actions[i] === 'keep' && freeHeader.test(data.headers[i]))) risks.push('Champ libre conservé : relisez chaque cellule, pas seulement l’aperçu.');
  if (retained.some(i => actions[i] === 'keep' && indirectHeader.test(data.headers[i]))) risks.push('Dates, montants ou quasi-identifiants conservés : leurs combinaisons et les valeurs rares peuvent identifier une personne.');
  let emails = 0, ibans = 0, formulas = 0;
  for (const row of rows) for (const v of row) {
    if (/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(v)) emails++;
    if (/\b[A-Z]{2}\s?\d{2}(?:\s?[A-Z0-9]){11,30}\b/i.test(v)) ibans++;
    if (needsNeutralization(v)) formulas++;
  }
  if (emails || ibans) risks.push(`Détection heuristique : ${emails} cellule(s) avec email, ${ibans} avec IBAN possibles dans la copie.`);
  const tuples = new Map();
  for (const row of rows) { const key = JSON.stringify(row); tuples.set(key, (tuples.get(key) ?? 0) + 1); }
  const unique = [...tuples.values()].filter(n => n === 1).length;
  risks.push(`${unique} ligne(s) unique(s) sur les colonnes retenues : signal d’individualisation, pas un score d’anonymat.`);
  risks.push('Les en-têtes sont conservés : vérifiez qu’ils ne contiennent pas d’identité. Le mapping permet de retrouver les valeurs d’origine ; gardez-le séparé et protégé.');
  const headers = retained.map(i => data.headers[i]);
  const neutralized = formulas + headers.filter(needsNeutralization).length;
  return { headers, rows, mapping, risks, neutralized, transformations: data.headers.map((h,i) => ({ column: h, action: actions[i], aliases: maps[i].size })) };
}

export function needsNeutralization(value) { return /^\s*[=+\-@]/.test(value) || /^[\t\r\n]/.test(value); }
export function serializeCsv(records) {
  return '\uFEFF' + records.map(row => row.map(value => {
    const v = needsNeutralization(String(value)) ? "'" + value : String(value);
    return '"' + v.replaceAll('"', '""') + '"';
  }).join(';')).join('\r\n') + '\r\n';
}
