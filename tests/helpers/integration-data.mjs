import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync('src/data/integrations.ts', 'utf8');
export const generatedGuides = JSON.parse(readFileSync('src/data/guides.generated.json', 'utf8'));
const compiled = ts.transpileModule(source.replace("import generatedGuides from './guides.generated.json' with { type: 'json' };", `const generatedGuides = ${JSON.stringify(generatedGuides)};`), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
export const { INTEGRATIONS, INTEGRATIONS_HISTORIQUES } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
