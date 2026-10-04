import { decodeFile, parseDelimited, transform, serializeCsv, defaultActions, MAX_BYTES } from '../lib/pseudonymisation.mjs';
let data = null, result = null;
self.onmessage = async ({ data: message }) => {
  const { id, kind } = message;
  try {
    if (kind === 'load') {
      if (message.file.size > MAX_BYTES) throw new Error('Fichier supérieur à 20 Mo : import refusé.');
      const bytes = new Uint8Array(await message.file.arrayBuffer());
      data = parseDelimited(decodeFile(bytes, message.encoding), message.delimiter);
      const actions = defaultActions(data.headers);
      self.postMessage({ id, kind, headers: data.headers, preview: data.rows.slice(0, 5), count: data.rows.length, actions });
    } else if (kind === 'preview') {
      result = null;
      if (!data) throw new Error('Importez un fichier.');
      result = transform(data, message.actions);
      self.postMessage({ id, kind, headers: result.headers, preview: result.rows.slice(0,5), risks: result.risks, neutralized: result.neutralized, count: result.rows.length, transformations: result.transformations });
    } else if (kind === 'export') {
      if (!result) throw new Error('Préparez et relisez le résultat.');
      let content, filename, type;
      if (message.format === 'mapping') {
        content = serializeCsv([['Colonne', 'Alias', 'Valeur originale'], ...result.mapping]); filename = 'mapping-separe-confidentiel.csv'; type = 'text/csv;charset=utf-8';
      } else if (message.format === 'report') {
        content = JSON.stringify({ type: 'Copie de travail non fiscale, non anonyme', lignes: result.rows.length, transformations: result.transformations, risques: result.risks, neutralisations: result.neutralized, conventionCsv: 'UTF-8 BOM, point-virgule, apostrophe devant formules ou contrôles initiaux ; les nombres négatifs sont donc exportés comme texte.' }, null, 2);
        filename = 'rapport-pseudonymisation.json'; type = 'application/json';
      } else {
        content = serializeCsv([result.headers, ...result.rows]); filename = 'copie-pseudonymisee.csv'; type = 'text/csv;charset=utf-8';
      }
      self.postMessage({ id, kind, content, filename, type });
    }
  } catch (error) { self.postMessage({ id, kind: 'error', error: error.message }); }
};
