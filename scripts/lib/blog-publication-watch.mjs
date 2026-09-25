// C1 observes publication slots without publishing or claiming that a sitemap entry proves deployment.
const ROW = /^\| (\d{4}-\d{2}-\d{2}) \| \[[^\]]+\]\(\/blog\/([a-z0-9-]+)\) \|.*\| (planned|published) \|$/;
const DATE_ROW = /^\| \d{4}-\d{2}-\d{2} \|/;

export function publicationAlerts({ calendar, date, urls, previous = [], afterSlot = false }) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Array.isArray(urls) || !Array.isArray(previous)) {
    throw new Error('calendrier : date, sitemap ou état de sentinelle invalide');
  }
  const rows = calendar.split('\n').filter((line) => DATE_ROW.test(line));
  if (!rows.length || rows.some((line) => !ROW.test(line))) throw new Error('calendrier éditorial absent ou invalide');
  const live = new Set(urls);
  const current = rows.map((line) => ROW.exec(line)).filter((m) => (m[1] < date || (m[1] === date && afterSlot)) && !live.has(`https://memlia.fr/blog/${m[2]}`) && !live.has(`https://memlia.fr/blog/${m[2]}/`))
    .map((m) => ({ date: m[1], slug: m[2], status: m[3], observation: 'absent-du-sitemap', message: `URL /blog/${m[2]} manquante du sitemap de production après le créneau ${m[1]} ; vérifier la forge, la QA, le sceau et le déploiement exact avant de conclure.` }));
  const seen = new Set(previous.map((x) => `${x.date}/${x.slug}/${x.status}`));
  return { current, newAlerts: current.filter((x) => !seen.has(`${x.date}/${x.slug}/${x.status}`)) };
}
