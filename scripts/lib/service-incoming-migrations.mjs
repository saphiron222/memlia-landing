/**
 * Maintenance des liens entrants historiques, sans réécrire les recettes scellées.
 * Une migration est liée aux octets de la recette et remplace un triplet précis.
 * Le seul rendu dynamique reconnu est le lien d'une tâche de fiche agent publiée.
 * Lecture des AST : un commentaire, une chaîne témoin ou un lien global ne compte pas.
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import ts from 'typescript';
import { parse as parseAstro } from '@astrojs/compiler/sync';

const LEDGER = 'config/service-publication-ledger.json';
const ROUTE = 'src/pages/agents-ia/[metier].astro';
const RENDERER = 'src/layouts/Agent.astro';
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const json = (root, path) => JSON.parse(readFileSync(join(root, path), 'utf8'));
const sameLink = (a, b) => ['url', 'sourcePath', 'anchor'].every((key) => a?.[key] === b?.[key]);
const compact = (value) => String(value).replace(/\s+/gu, '').replace(/"/gu, "'");
const astTs = (source) => ts.createSourceFile('source.ts', source, ts.ScriptTarget.Latest, true);
const attr = (node, name) => node.attributes?.find((a) => a.name === name);
const children = (node) => node.children ?? [];
const codeIs = (node, source, expected) => Boolean(node) && compact(node.getText(source)) === compact(expected);
const hasModifiers = (node, kind) => node.modifiers?.some((modifier) => modifier.kind === kind);

function variable(source, name) {
  return source.statements.filter(ts.isVariableStatement).flatMap((s) => [...s.declarationList.declarations])
    .find((d) => ts.isIdentifier(d.name) && d.name.text === name)?.initializer;
}

/** Seulement des littéraux de données ; aucun import, appel ou getter n'est exécuté. */
function literal(node) {
  if (!node) throw new Error('donnée absente');
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (node.kind === ts.SyntaxKind.NullKeyword) return null;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
  if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.map((property) => {
    if (!ts.isPropertyAssignment(property) || !(ts.isIdentifier(property.name) || ts.isStringLiteral(property.name))) throw new Error('donnée non littérale');
    return [property.name.text, literal(property.initializer)];
  }));
  throw new Error('donnée non littérale');
}

function imports(source, name, from) {
  return source.statements.some((s) => ts.isImportDeclaration(s) && s.moduleSpecifier.text === from &&
    (s.importClause?.name?.text === name || s.importClause?.namedBindings?.elements?.some((e) => e.name.text === name && (!e.propertyName || e.propertyName.text === name))));
}

function props(source, names) {
  return source.statements.filter(ts.isVariableStatement).flatMap((s) => [...s.declarationList.declarations])
    .some((d) => ts.isObjectBindingPattern(d.name) && codeIs(d.initializer, source, 'Astro.props') &&
      names.every((name) => d.name.elements.some((e) => ts.isIdentifier(e.name) && e.name.text === name && (!e.propertyName || e.propertyName.getText(source) === name))));
}

function astro(root, path) {
  const tree = parseAstro(readFileSync(join(root, path), 'utf8')).ast;
  const source = astTs(children(tree).find((n) => n.type === 'frontmatter')?.value ?? '');
  return { tree, source };
}

function nodes(node, predicate, ancestors = []) {
  return [...(predicate(node, ancestors) ? [node] : []), ...children(node).flatMap((child) => nodes(child, predicate, [...ancestors, node]))];
}

function assert(condition, message) { if (!condition) throw new Error(message); }

function verifyAgentLink(root, recipe, link) {
  assert(link.kind === 'agent-task' && /^[a-z][a-z-]+$/u.test(link.agent ?? ''), 'type ou identifiant d’agent invalide');
  assert(link.sourcePath === ROUTE && link.url === `/agents-ia/${link.agent}`, 'route de fiche incohérente');
  assert(link.family === recipe.family && typeof link.context === 'string' && link.context.trim(), 'famille ou contexte de tâche incohérent');
  const dataPath = `src/data/specialistes/${link.agent}.ts`;
  const dataSource = astTs(readFileSync(join(root, dataPath), 'utf8'));
  const exported = dataSource.statements.filter((s) => ts.isVariableStatement(s) && hasModifiers(s, ts.SyntaxKind.ExportKeyword))
    .flatMap((s) => [...s.declarationList.declarations]);
  const candidates = exported.map((d) => ({ name: d.name.getText(dataSource), data: literal(d.initializer) }));
  const found = candidates.find(({ data }) => data.slug === link.agent);
  assert(found && found.data.publie === true && found.data.destination?.type === 'fiche' && found.data.fiche, 'agent absent, non publié ou sans fiche');
  const agent = found.data;
  assert(agent.familles.includes(link.family) && agent.servicesLies.includes(recipe.slug), 'service ou famille non porté par l’agent');
  assert(agent.fiche.taches.some((t) => t.famille === link.family && t.geste === link.context), 'tâche contextuelle absente de la fiche');
  const service = readFileSync(join(root, `src/content/services/${recipe.slug}.md`), 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
  assert(new RegExp(`^family:\\s*["']?${link.family}["']?\\s*$`, 'mu').test(service) && /^status:\s*["']?publie["']?\s*$/mu.test(service), 'famille du service publié incohérente');

  const registry = astTs(readFileSync(join(root, 'src/data/specialistes.ts'), 'utf8'));
  assert(imports(registry, found.name, `./specialistes/${link.agent}.ts`), 'donnée de l’agent non importée par le registre');
  const agents = variable(registry, 'AGENTS');
  assert(agents && ts.isArrayLiteralExpression(agents) && agents.elements.some((e) => ts.isIdentifier(e) && e.text === found.name), 'agent absent du catalogue construit');
  assert(codeIs(variable(registry, 'FICHES'), registry, "AGENTS.filter((agent): agent is SpecialisteAFiche => agent.destination.type === 'fiche')"), 'sélection des fiches inconnue');

  const { tree: page, source: route } = astro(root, ROUTE);
  assert(imports(route, 'FICHES', '@/data/specialistes') && imports(route, 'Agent', '@/layouts/Agent.astro') && imports(route, 'getCollection', 'astro:content'), 'imports de la route inconnus');
  assert(props(route, ['agent']), 'agent de route non issu des propriétés construites');
  const paths = route.statements.find((s) => ts.isFunctionDeclaration(s) && s.name?.text === 'getStaticPaths' && hasModifiers(s, ts.SyntaxKind.ExportKeyword));
  assert(paths?.body?.statements.some((s) => ts.isReturnStatement(s) && codeIs(s.expression, route,
    'FICHES.filter((agent) => agent.publie === true).map((agent) => ({ params: { metier: agent.slug }, props: { agent } }))')), 'route publiée de l’agent non construite');
  assert(codeIs(variable(route, 'services'), route, "(await getCollection('services')).filter((entree) => entree.data.status === 'publie')"), 'sélection des services publiés inconnue');
  const loop = route.statements.find((s) => ts.isForOfStatement(s) && codeIs(s.expression, route, 'agent.familles'));
  assert(loop && ts.isBlock(loop.statement) && loop.statement.statements.some((s) => ts.isVariableStatement(s) && s.declarationList.declarations.some((d) => d.name.getText(route) === 'service' && codeIs(d.initializer, route, 'services.find((entree) => entree.data.family === id)'))) &&
    loop.statement.statements.some((s) => ts.isIfStatement(s) && codeIs(s.expression, route, 'service') && codeIs(s.thenStatement, route, 'liens[id] = { href: `/automatisation/${service.id}` };')), 'résolution de lien par famille absente');
  assert(nodes(page, (n, parents) => n.type === 'component' && n.name === 'Agent' && parents.every((p) => p.type === 'root') &&
    attr(n, 'agent')?.value === 'agent' && attr(n, 'liens')?.value === 'liens').length === 1, 'gabarit non appelé avec les données et liens résolus');

  const { tree: renderer, source: renderCode } = astro(root, RENDERER);
  assert(imports(renderCode, 'ficheDe', '@/data/specialistes') && props(renderCode, ['agent', 'liens']) &&
    codeIs(variable(renderCode, 'fiche'), renderCode, 'ficheDe(agent)'), 'fiche du gabarit non reliée à l’agent');
  const section = nodes(renderer, (n, parents) => n.name === 'section' && attr(n, 'data-agent-section')?.value === 'taches' &&
    !attr(n, 'hidden') && parents.every((p) => !attr(p, 'hidden') && (p.type === 'root' || p.type === 'component' && p.name === 'Base' || p.name === 'div')));
  assert(section.length === 1, 'section contextuelle des tâches absente ou conditionnelle');
  const maps = nodes(section[0], (n) => n.type === 'expression' && children(n)[0]?.type === 'text' && /^fiche\.taches\.map\((?:t|\(t(?:,i)?\))=>$/u.test(compact(children(n)[0].value)));
  assert(maps.length === 1, 'boucle des tâches absente du rendu');
  const row = children(maps[0]).find((n) => n.name === 'div');
  assert(row && nodes(row, (n) => n.type === 'expression' && children(n).length === 1 && children(n)[0].value === 't.geste').length === 1, 'contexte du geste absent du rendu');
  const renderedLinks = nodes(row, (n) => n.type === 'expression' && compact(children(n)[0]?.value) === 'liens[t.famille]&&')
    .flatMap((n) => children(n).filter((a) => a.name === 'a' && attr(a, 'href')?.kind === 'expression' && compact(attr(a, 'href').value) === 'liens[t.famille].href' &&
      children(a).filter((c) => c.type === 'text').map((c) => c.value).join('').trim() === link.anchor && !attr(a, 'hidden')));
  assert(renderedLinks.length === 1, 'ancre ou destination du lien contextuel absente du rendu');
  assert(!nodes(page, (n) => attr(n, 'noindex') && attr(n, 'noindex').value !== 'false').length &&
    !nodes(renderer, (n) => attr(n, 'noindex') && attr(n, 'noindex').value !== 'false').length, 'fiche source non indexable');
}

/** Renvoie les liens effectifs et leurs migrations validées ; tout écart garde l'ancien lien en échec. */
export function migrerLiensEntrantsService(root, recipe, errors) {
  const links = [...(Array.isArray(recipe.incomingLinks) ? recipe.incomingLinks : [])];
  const migrated = new Set();
  const ledgerPath = join(root, LEDGER);
  if (!existsSync(ledgerPath)) return { links, migrated };
  const ledger = json(root, LEDGER);
  const entries = ledger.incomingLinkMigrations ?? [];
  if (!Array.isArray(entries)) { errors.push('Migrations de liens entrants : liste invalide.'); return { links, migrated }; }
  for (const migration of entries.filter((entry) => entry?.service === recipe.slug)) {
    try {
      assert(/^[a-z][a-z0-9-]+$/u.test(recipe.slug ?? '') && recipe.path === `/automatisation/${recipe.slug}`, 'identité du service incohérente');
      assert(ledger.version === 1 && migration.version === 1 && /^\d{4}-\d{2}-\d{2}$/u.test(migration.date ?? '') &&
        !Number.isNaN(Date.parse(migration.date)) && new Date(migration.date).toISOString().slice(0, 10) === migration.date &&
        migration.date <= new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' }) &&
        String(migration.reason ?? '').trim().length >= 80, 'déclaration datée et motivée requise');
      const recipePath = `commercial/recettes/${recipe.slug}/recette.json`;
      const seal = json(root, `commercial/services/${recipe.slug}/preuves/scellement.json`);
      assert(migration.recipeSha256 === seal.files?.recipe?.sha256 && migration.recipeSha256 === sha256(readFileSync(join(root, recipePath))), 'empreinte de la recette scellée différente');
      assert(isDeepStrictEqual(recipe, json(root, recipePath)), 'recette contrôlée différente des octets scellés');
      const indexes = links.flatMap((link, i) => sameLink(link, migration.from) ? [i] : []);
      assert(indexes.length === 1 && !migrated.has(links[indexes[0]]), 'ancien lien exact absent ou migration en double');
      verifyAgentLink(root, recipe, migration.to);
      links[indexes[0]] = migration.to;
      migrated.add(migration.to);
    } catch (error) {
      errors.push(`${recipe.slug} : migration de lien entrant refusée (${error.message}).`);
    }
  }
  return { links, migrated };
}
