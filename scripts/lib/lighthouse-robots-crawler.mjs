/**
 * Collecte robots comme un crawler HTTP, hors du document soumis à connect-src.
 * L’audit Lighthouse seo/robots-txt reste celui de la dépendance, sans score forcé.
 * Mode explicite et opt-in ; le rapport de collecte accompagne le LHR brut.
 */
import BaseGatherer from 'lighthouse/core/gather/base-gatherer.js';
export default class CrawlerRobots extends BaseGatherer {
  meta = { supportedModes: ['snapshot', 'navigation'] };
  evidence = null;
  async getArtifact(context) {
    const url = new URL('/robots.txt', context.baseArtifacts.URL.finalDisplayedUrl).href;
    let artifact;
    let finalUrl = null;
    try {
      const response = await fetch(url, {headers:{'Cache-Control':'no-cache'},credentials:'omit',signal:AbortSignal.timeout(10_000)});
      finalUrl = response.url;
      artifact = {status:response.status,content:await response.text()};
    } catch (error) {
      artifact = {status:null,content:null,errorMessage:error.message};
    }
    this.evidence = {collector:'http-outside-document',url,finalUrl,fetchedAt:new Date().toISOString(),artifact};
    return artifact;
  }
}
