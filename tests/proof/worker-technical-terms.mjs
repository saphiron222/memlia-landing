import { readFileSync } from 'node:fs';
import ts from 'typescript';

// Parse only: never execute a published bundle to decide whether it is copy.
const source = readFileSync(0, 'utf8');
const file = ts.createSourceFile('surface.js', source, ts.ScriptTarget.Latest, false, ts.ScriptKind.JS);
const replacements = [];
const replaceLiteral = (node, value) => replacements.push({ start: node.getStart(file), end: node.end, value });

function visit(node) {
  if (ts.isNewExpression(node) && ts.isIdentifier(node.expression)) {
    const args = node.arguments ?? [];
    if (node.expression.text === 'Worker' && args.length === 2 && ts.isObjectLiteralExpression(args[1])) {
      for (const property of args[1].properties) {
        if (ts.isPropertyAssignment(property)
            && (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name))
            && property.name.text === 'type'
            && ts.isStringLiteral(property.initializer) && property.initializer.text === 'module') {
          replaceLiteral(property.initializer, '"worker-kind"');
        }
      }
    }
    if (node.expression.text === 'Error' && args.length === 1
        && ts.isStringLiteral(args[0]) && args[0].text === 'Module Worker indisponible') {
      replaceLiteral(args[0], '"Worker indisponible"');
    }
  }
  ts.forEachChild(node, visit);
}

// An incomplete or invalid script never gains a technical exemption.
if (file.parseDiagnostics.length === 0) ts.forEachChild(file, visit);
let normalized = source;
for (const { start, end, value } of replacements.sort((a, b) => b.start - a.start)) {
  normalized = normalized.slice(0, start) + value + normalized.slice(end);
}
process.stdout.write(normalized);
