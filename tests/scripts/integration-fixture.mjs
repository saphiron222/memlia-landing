import { readFileSync } from 'node:fs';
import ts from 'typescript';

export async function loadIntegrationFixture({
  generatedGuides = JSON.parse(readFileSync('src/data/guides.generated.json', 'utf8')),
} = {}) {
  const source = readFileSync('src/data/integrations.ts', 'utf8');
  const compiled = ts.transpileModule(source.replace("import generatedGuides from './guides.generated.json' with { type: 'json' };", `const generatedGuides = ${JSON.stringify(generatedGuides)};`), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
  const data = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
  return {
    ...data,
    INTEGRATION_CANDIDATES: [
      ...data.INTEGRATION_CANDIDATES,
      ...generatedGuides.map(({ task, vendor, suggestions }) => ({ task, vendor, suggestions, status: 'forte' })),
    ],
  };
}
