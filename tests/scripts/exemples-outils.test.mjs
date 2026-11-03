// Garde des chiffres des deux exemples publiés sur les outils : ils sont écrits en dur dans les composants,
// donc recalculés ici à partir du texte même de la page (une faute de frappe sur un total fait échouer).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const lire = (f) => readFileSync(new URL(`../../src/components/outils/${f}`, import.meta.url), 'utf8');
const centimes = (t) => {
  const m = t.replace(/[\s  ]/g, '').replace('−', '-').replace(',', '.').match(/^([+-]?)(\d+)\.(\d{2})$/);
  assert.ok(m, `montant illisible : « ${t} »`);
  return (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 100 + Number(m[3]));
};
const montants = (bloc) => [...bloc.matchAll(/<td class="montant">([^<]+)<\/td>/g)].map((x) => x[1]);

test('rapprochement : chaque tableau somme à son solde affiché, l’état de rapprochement concorde', () => {
  const src = lire('ExempleRapprochement.astro');
  const [releve, grandLivre, etat] = [...src.matchAll(/<table>([\s\S]*?)<\/table>/g)].map((x) => x[1]);
  const total = (t) => {
    const lignes = montants(t.split('<tfoot>')[0]).map(centimes);
    return { somme: lignes.reduce((a, b) => a + b, 0), affiche: centimes(montants(t.split('<tfoot>')[1])[0]) };
  };
  const r = total(releve), g = total(grandLivre);
  assert.equal(r.somme, r.affiche, 'solde du relevé');
  assert.equal(g.somme, g.affiche, 'solde du compte 512');
  const [soldeReleve, remises, paiements, banqueAjustee, solde512, frais, comptaAjustee, difference] = montants(etat).map(centimes);
  assert.equal(soldeReleve, r.affiche, 'l’état repart du solde du relevé');
  assert.equal(solde512, g.affiche, 'l’état repart du solde du compte 512');
  assert.equal(soldeReleve + remises + paiements, banqueAjustee, 'solde bancaire ajusté');
  assert.equal(solde512 + frais, comptaAjustee, 'solde comptable ajusté');
  assert.equal(banqueAjustee - comptaAjustee, difference);
  assert.equal(difference, 0, 'la différence doit être nulle');
  assert.equal(paiements, -(72000 + 134000), 'chèque 000413 (720,00) + virement en transit (1 340,00)');
  assert.equal(remises, 89000, 'remise n° 18');
  assert.equal(frais, -1840, 'frais de tenue de compte du relevé');
});

test('échéance : 45 jours fin de mois, deux méthodes, dates recalculées indépendamment', () => {
  const src = lire('ExempleEcheance.astro');
  const jour = (iso) => new Date(`${iso}T00:00:00Z`);
  const plus = (d, n) => new Date(d.getTime() + n * 86400000);
  const finDeMois = (d) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0));
  const iso = (d) => d.toISOString().slice(0, 10);
  const facture = jour('2026-01-20');
  assert.equal(iso(finDeMois(plus(facture, 45))), '2026-03-31');
  assert.equal(iso(plus(finDeMois(facture), 45)), '2026-03-17');
  assert.ok(src.includes('31 mars 2026') && src.includes('17 mars 2026') && src.includes('6 mars 2026'));
  assert.ok(src.includes('diffèrent de 14 jours'));
});
