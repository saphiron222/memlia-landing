// Jeu d'essai d'illustration uniquement, pas un outil de sélection pour une mission.
import { createHash } from 'node:crypto';
export const population = [
  { id: 'R01', solde: 50000, mouvement: 90000 },
  { id: 'R02', solde: 30000, mouvement: 40000 },
  { id: 'R03', solde: 10000, mouvement: 20000 },
  { id: 'R04', solde: 5000, mouvement: 8000 },
  { id: 'R05', solde: 3000, mouvement: 4000 },
  { id: 'R06', solde: 2000, mouvement: 3000 },
];
export const cloture = [...population, { id: 'R07', solde: 40000, mouvement: 85000 }];
export const regle = { mode: 'couverture', couverture: 70, nombre: 2, solde: 30000, mouvement: 80000, aleatoire: 1, graine: 'RIVES-7' };
export function selection(rows, rule = regle) {
  const total = rows.reduce((sum, row) => sum + Math.abs(row.solde), 0);
  const ranked = [...rows].sort((a, b) => Math.abs(b.solde) - Math.abs(a.solde) || a.id.localeCompare(b.id));
  const retenus = ranked.filter(row => Math.abs(row.solde) >= rule.solde || row.mouvement >= rule.mouvement).map(row => ({ ...row, raison: Math.abs(row.solde) >= rule.solde ? 'Solde' : 'Mouvement' }));
  const amount = () => retenus.reduce((sum, row) => sum + Math.abs(row.solde), 0);
  for (const row of ranked) {
    if (rule.mode === 'nombre' ? retenus.length >= rule.nombre : amount() / total * 100 >= rule.couverture) break;
    if (!retenus.some(item => item.id === row.id)) retenus.push({ ...row, raison: rule.mode === 'nombre' ? 'Nombre' : 'Couverture' });
  }
  const score = row => createHash('sha256').update(`${rule.graine}:${row.id}`).digest('hex');
  const random = rows.filter(row => !retenus.some(item => item.id === row.id)).sort((a, b) => score(a).localeCompare(score(b))).slice(0, rule.aleatoire);
  retenus.push(...random.map(row => ({ ...row, raison: 'Aléatoire' })));
  return { total, retenus, montant: amount(), couverture: amount() / total * 100 };
}
export const confirmations = [
  { id: 'R01', balance: 50000, reponse: 48000, reference: 'CONF-R01', statut: 'Écart à examiner' },
  { id: 'R02', balance: 30000, reponse: null, reference: 'ENC-R02', statut: 'Non-réponse ouverte' },
  { id: 'R07', balance: 40000, reponse: null, reference: 'CONF-R07', statut: 'Période incompatible' },
];
export const immobilisations = [
  { compte: '215', client: 120000, balance: 120000, origine: 'IMMO · lignes 2–4' },
  { compte: '2815', client: 45000, balance: 45000, origine: 'IMMO · lignes 2–4' },
  { compte: '68112', client: 15000, balance: 14500, origine: 'IMMO · lignes 2–4' },
];
