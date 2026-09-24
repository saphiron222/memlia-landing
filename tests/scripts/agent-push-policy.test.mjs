import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('la consigne du dépôt autorise le push de branche sans autoriser la publication', () => {
  const policy = readFileSync(new URL('../../CLAUDE.md', import.meta.url), 'utf8');
  assert.match(policy, /un agent peut\s+pousser sans nouvelle validation sa propre branche/i);
  assert.match(policy, /git push` non destructif/i);
  assert.match(policy, /push forcé,[\s\S]*refspec destructive restent interdits/i);
  assert.match(policy, /ne\s+vaut\s+\*\*pas\*\* fusion,[\s\S]*déploiement de production/i);
  assert.doesNotMatch(policy, /`git push` sont \*\*interdits\*\*/i);
});
