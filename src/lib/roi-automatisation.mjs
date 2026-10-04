// Percentages are entered as 0..100; cash savings are independent of time capacity.
export const ROI_FIELDS = [
  { key:'V', label:'Volume mensuel (tâches/mois)', max:1000000, integer:true },
  { key:'t', label:'Temps manuel (min/tâche)', max:100000 },
  { key:'p', label:'Part automatisable (%)', max:100 },
  { key:'a', label:'Adoption (%)', max:100 },
  { key:'c', label:'Contrôle et reprise (min/tâche adoptée)', max:100000 },
  { key:'H', label:'Coût horaire (€ / heure)', max:1000000 },
  { key:'I', label:'Investissement initial (€)', max:1000000000 },
  { key:'M', label:'Maintenance mensuelle (€ / mois actif)', max:1000000000 },
  { key:'E', label:'Dépenses réellement évitables (€ / mois actif)', max:1000000000, optional:true },
  { key:'d', label:'Délai de démarrage (mois)', max:1200 },
  { key:'n', label:'Horizon depuis le début (mois)', max:1200, min:0.01 },
];
export const ROI_FORMULAS = [
  'T = V × (a/100) × (t × p/100 − c) / 60 ; heures par mois actif, négatives possibles.',
  'Capacité valorisée = T × H ; cette valeur ne constitue pas une économie de trésorerie.',
  'k = max(0, n − d) ; mois actifs sur l’horizon.',
  'Bénéfice cash = k × E ; coût C = I + k × M ; net = k × E − C.',
  'ROI cash = net / C × 100 si C > 0 et E connu ; sinon ND.',
  'Récupération après démarrage = I / (E − M) si I > 0 et E > M ; depuis le début = d + récupération.',
  'Si I > 0 et E ≤ M : récupération impossible. Si I = 0 : non applicable, aucun investissement initial.',
];
export const ROI_CONVENTION = 'Hypothèses constantes, approximation continue des mois (pas un échéancier). Maintenance et dépenses évitables commencent après le délai ; investissement engagé au début. Calculs sans arrondi intermédiaire, affichage à deux décimales. Aucune actualisation, fiscalité ou inflation. E vide : inconnu, jamais déduit du temps.';
export const ROI_EXAMPLES = [
  { V:100,t:12,p:50,a:80,c:1,H:40,I:1000,M:50,E:200,d:0,n:12 },
  { V:100,t:12,p:30,a:60,c:2,H:40,I:1000,M:50,E:100,d:2,n:12 },
  { V:100,t:12,p:60,a:90,c:1,H:40,I:1000,M:50,E:null,d:1,n:12 },
];
function validate(value, field) {
  if (field.optional && value === null) return value;
  if (typeof value !== 'number' || !Number.isFinite(value) || value < (field.min ?? 0) || value > field.max || (field.integer && !Number.isInteger(value))) {
    throw new Error(`${field.label} : valeur attendue entre ${field.min ?? 0} et ${field.max}${field.integer ? ', entière' : ''}.`);
  }
  return value;
}
export function parseRoiValue(raw, key) {
  const field = ROI_FIELDS.find(f => f.key === key);
  if (!field) throw new Error('Champ inconnu.');
  const text = raw.trim();
  if (field.optional && text === '') return null;
  if (!/^\d+(?:[,.]\d{1,2})?$/.test(text)) throw new Error(`${field.label} : nombre positif ou nul, sans milliers, deux décimales au maximum.`);
  return validate(Number(text.replace(',','.')),field);
}
export function calculateRoi(inputs) {
  for (const field of ROI_FIELDS) validate(inputs[field.key],field);
  const {V,t,p,a,c,H,I,M,E,d,n} = inputs;
  const hours = V*(a/100)*(t*p/100-c)/60;
  const capacity = hours*H;
  const activeMonths = Math.max(0,n-d);
  const cost = I+activeMonths*M;
  const cashBenefit = E === null ? null : activeMonths*E;
  const net = cashBenefit === null ? null : cashBenefit-cost;
  const roi = net === null || cost === 0 ? null : net/cost*100;
  const paybackState = I === 0 ? 'non-applicable' : E === null ? 'inconnu' : E <= M ? 'impossible' : 'calculable';
  const payback = paybackState === 'calculable' ? I/(E-M) : null;
  const totalPayback = payback === null ? null : d+payback;
  return { hours,capacity,activeMonths,cost,cashBenefit,net,roi,paybackState,payback,totalPayback,withinHorizon:totalPayback === null ? null : totalPayback <= n };
}
const decimal = value => new Intl.NumberFormat('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2}).format(value);
const formatted = (value,unit) => value === null ? 'ND (hypothèse inconnue ou ratio non défini)' : `${decimal(value)} ${unit}`;
function displayResults(r) {
  const payback = r.paybackState === 'non-applicable' ? 'Non applicable : aucun investissement initial' : r.paybackState === 'impossible' ? 'Impossible : dépenses évitables ≤ maintenance' : r.paybackState === 'inconnu' ? 'ND : dépenses évitables inconnues' : `${decimal(r.payback)} mois après démarrage ; ${decimal(r.totalPayback)} mois depuis le début (${r.withinHorizon ? 'dans' : 'hors'} l’horizon)`;
  return { hours:formatted(r.hours,'h / mois actif'),capacity:formatted(r.capacity,'€ / mois actif (pas du cash)'),activeMonths:formatted(r.activeMonths,'mois actifs'),cost:formatted(r.cost,'€'),cashBenefit:formatted(r.cashBenefit,'€'),net:formatted(r.net,'€'),roi:formatted(r.roi,'%'),payback };
}
export const ROI_RESULT_LABELS = { hours:'Capacité nette mensuelle',capacity:'Valorisation de capacité',activeMonths:'Mois actifs',cost:'Coût sur l’horizon',cashBenefit:'Dépenses évitées sur l’horizon',net:'Trésorerie nette sur l’horizon',roi:'ROI cash',payback:'Récupération (approximation continue)' };
/** @param {Array<Record<string, number|null>>} scenarios */
export function buildRoiReport(scenarios) {
  if (scenarios.length !== 3) throw new Error('Trois scénarios sont requis.');
  return { version:1,convention:ROI_CONVENTION,formulas:[...ROI_FORMULAS],scenarios:scenarios.map((inputs,index) => {
    const results = calculateRoi(inputs);
    return { name:`Scénario ${index+1}`,inputs:{...inputs},results,display:displayResults(results) };
  }) };
}
export function roiCsv(report) {
  const rows = [['Scénario','Nature','Champ','Valeur'],['','Convention','',report.convention]];
  for (const formula of report.formulas) rows.push(['','Formule','',formula]);
  for (const scenario of report.scenarios) {
    for (const field of ROI_FIELDS) rows.push([scenario.name,'Hypothèse',field.label,scenario.inputs[field.key] === null ? 'ND' : String(scenario.inputs[field.key]).replace('.',',')]);
    for (const [key,value] of Object.entries(scenario.display)) rows.push([scenario.name,'Résultat affiché',ROI_RESULT_LABELS[key],value]);
    for (const [key,value] of Object.entries(scenario.results)) rows.push([scenario.name,'Calcul non arrondi',key,value === null ? 'ND' : String(value)]);
  }
  // Quoting alone does not neutralize spreadsheet formula injection (notably negative results).
  const cell = value => `"${(/^[=+\-@\t\r\n]/.test(value) ? "'" : '') + value.replaceAll('"','""')}"`;
  return '\uFEFF'+rows.map(row=>row.map(cell).join(';')).join('\r\n');
}
