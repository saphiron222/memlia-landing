# context_session_1 — SEO/GEO audit loop (memlia-landing)

**Started:** 2026-07-03 · **Mode:** `/loop` dynamic (self-paced) · **Model:** Opus 4.8
**Task:** Audit crawlability, indexation, page intent, titles, internal links, structured
data, source citations, answer-first content. Rank gaps by impact, fix the highest-leverage,
re-benchmark, repeat until no critical tech issue remains and every priority query maps to an
answer-ready page.

## Site snapshot
- Static mono-page landing (`index.html`) + 2 legal pages (`noindex`) + `llms.txt`,
  `robots.txt`, `sitemap.xml`, `og-memlia.png`. No build, no deps. Cloudflare Pages.
- Product: **Memlia** — IA opérationnelle pour cabinets d'expertise comptable (FR). Brand new.
- **Domain `memlia.fr` does NOT resolve yet** (not registered/deployed). ⇒ No live SERP/AI-engine
  benchmarking possible. Benchmark = **answer-readiness proxy** until launch.

## Foundations already SOLID (do not "fix")
Title/desc/canonical/robots-meta ✓ · OG + Twitter ✓ · JSON-LD Organization+WebSite+Software
(honest, no fake reviews) ✓ · llms.txt (excellent) ✓ · robots.txt (AI search bots allowed,
Bytespider blocked, sitemap declared) ✓ · semantic HTML, skip link, aria, reduced-motion ✓ ·
self-hosted fonts + font-display:swap ✓ · legal pages noindex+canonical ✓ · one H1, clean
heading hierarchy ✓.

## Gaps ranked by expected impact
| # | Gap | Dimension | Impact | Status |
|---|-----|-----------|--------|--------|
| 1 | **No answer-first / FAQ content** mapping priority NL queries to citable passages | answer-first, page intent, structured data | **HIGH** | FIX iter 1 |
| 2 | Organization schema thin — no `logo`/`email`/`contactPoint`/`sameAs` (weak brand entity) | structured data | MEDIUM | pending |
| 3 | `n°1` / "L'IA n°1" unverifiable superlative in title+H1 (AEO trust + FR ad-claim risk) | titles, citations | MEDIUM (needs owner sign-off, positioning) | flagged, not auto-changed |
| 4 | Legal pages: broken text `Retour à l'"'"'accueil` (shell-escape artifact leaked into HTML) | content quality | LOW (noindex, but visible defect) | flagged |
| 5 | index brand link `href="#"` should be `/` | internal links | LOW | pending |
| 6 | Legal internal links use `.html` while canonical is extensionless → redirect hop | internal links | LOW | pending |

No CRITICAL (nothing blocks indexing).

## Priority queries (FR, ICP = cabinets d'expertise comptable) + answer-readiness BEFORE
Score: ✅ answer-ready extractable passage · 🟡 implied by marketing prose · ❌ none
1. "IA pour cabinet d'expertise comptable" — 🟡 (hero prose, no direct definition passage)
2. "quelle IA / logiciel IA pour expert-comptable" — 🟡
3. "Memlia c'est quoi / Memlia avis" — 🟡 (schema desc only, no on-page Q&A)
4. "détecter opportunités de conseil cabinet comptable" — 🟡 (section exists, not Q-shaped)
5. "automatiser relances / pièces / échéances cabinet comptable" — 🟡
6. "IA expert-comptable RGPD / secret professionnel" — 🟡 (trustline chip only)
7. "IA cabinet comptable sans migration / au-dessus des outils" — 🟡 (trustline chip only)
8. "Memlia est-il un chatbot / différence chatbot" — ❌ (only in llms.txt, not on-page)
9. "l'IA agit-elle seule / envoie des mails automatiquement" (human-in-the-loop) — ❌ on-page
10. "prix / tarif Memlia" — ❌
**Before score: 0 ✅ / 7 🟡 / 3 ❌** — no query has a clean extractable answer passage on-page.

## Answer-readiness AFTER iter 1+2
All 10 priority queries → ✅ (self-contained extractable passage, mirrored verbatim in FAQPage
schema). **Before 0✅/7🟡/3❌ → After 10✅/0🟡/0❌.**

## Iteration log
- **Iter 1 (DONE):** Gap #1 fixed — added visible answer-first FAQ (8 Q&A grounded in
  already-published facts) at `#faq` + FAQPage JSON-LD (schema text = visible text, verified
  verbatim) + nav/footer `#faq` links + llms.txt FAQ pointer + sitemap lastmod → 2026-07-03.
  Verified: JSON-LD parses, 8 Q, 8 visible items, 1 H1.
- **Iter 2 (DONE):** Gap #2 fixed — enriched Organization schema (logo=apple-touch-icon.png,
  email + contactPoint contact@memlia.fr, areaServed FR). Gap #5 fixed — index brand link
  `href="#"` → `/`. Verified: @graph still parses, 4 nodes.
- **LOOP CONCLUDED (2026-07-03):** Terminal condition met — 0 critical tech issues, 10/10
  priority queries answer-ready, no HIGH gap remaining. Diff: index.html +~145, llms.txt +1,
  sitemap ±1. Not deployed (memlia.fr not live) — live SERP/AI-engine tracking deferred to launch.

## Iteration 3 (DONE 2026-07-03) — remaining points resolved via 6-agent workflow (wf_20d873d0)
- **#3 RESOLVED:** removed "n°1" (title l.6 + H1 l.295). 3-lens (SEO/GEO/compliance) + synthesis
  converged. Compliance verdict: "L'IA n°1" = allégation de supériorité invérifiable (Code conso
  art. L121-1), impossible à prouver pré-lancement, contredit la ligne rouge JSON-LD "aucune
  preuve inventée". New title = "Memlia — L'IA du conseil pour les experts-comptables" (54 char,
  now identical to og/twitter title). New H1 = "L'IA qui aide les cabinets comptables à proposer
  plus de <em>conseil</em>." Alternatives kept in workflow output if Kevin prefers a variant.
- **#4 RESOLVED** (earlier this session): legal back-link text fixed → "Retour à l'accueil".
- **#6 RESOLVED:** all 7 internal legal links → root-relative extensionless (`/mentions-legales`,
  `/politique-de-confidentialite`) across index + both legal pages. Matches canonical, hop-free on
  Cloudflare Pages default clean-URLs. NOTE: local static preview will 404 these (no clean-URL);
  they resolve only on Cloudflare Pages — that's the deploy target.
- Verified: 0 `n°1`, 0 `.html` legal links, JSON-LD parses (4 nodes), title==og==twitter.

## Correction to launch-agent advice
The launch checklist suggested adding the legal pages to sitemap.xml. **Do NOT** — they are
`noindex`; listing a noindex URL in the sitemap is self-contradictory. Keep sitemap = "/" only.

## Post-launch runbook (blocked on domain registration) — full detail in workflow output
Register memlia.fr as full Cloudflare zone → attach apex+www to Pages, HTTPS, 301 www→apex →
GSC Domain property (DNS TXT) + submit sitemap + request indexing → Bing WMT (import from GSC) →
IndexNow via Cloudflare Crawler Hints (Bing/Copilot, NOT Google) → add real Organization `sameAs`
once profiles exist → repeatable LIVE benchmark (Google/Perplexity/ChatGPT Search/Bing Copilot)
on the 7 priority queries, baseline at launch then D7/D30/monthly.

## Iteration 4 (DONE 2026-07-03) — FAQ design upgrade (/frontend-design + ui-ux-pro-max)
Flat centered hairline list → **asymmetric editorial**: sticky left rail (eyebrow + Fraunces
h2 + intro + "Parler à un humain" CTA) beside the visible Q&A list. Reuses the page's own 2-col
accordion rhythm; distinct from the 3-card grid. Signature = the pinned rail (`position:sticky;
top:88px`) that stays while you read — encodes the human-in-the-loop ethos + adds a useful CTA.
- **Deliberately NO 01/02 numbering** (frontend-design: numbering only honest for real sequences;
  a FAQ isn't one).
- Answers kept **visible in the DOM** (protects the GEO/answer-readiness win from iter 1).
- `text-wrap:pretty` on questions → no orphaned "?" (French punctuation), graceful fallback.
- Verified in preview: desktop sticky pins at 88px; mobile (≤820px) stacks 1-col + rail unsticks,
  no horizontal overflow; div-balanced (150/150); 8 answers intact; JSON-LD 4 nodes intact.
- Local preview server on :8788 (config .claude/launch.json).

## STATUS: all in-scope SEO/GEO gaps resolved + FAQ visually elevated. Only blocked-on-launch items remain (runbook above).

## LIVE AUDIT 2026-07-04 (/loop dynamic, Opus 4.8) — domain now LIVE
Full CLI audit of live memlia.fr. Re-runnable tools in scratchpad: `markup_audit.py` + `live.html`.
Results across the 10 requested check-categories:
- ✅ memlia.fr HTTP 200, TLS valid (CN=memlia.fr, Google Trust Services WE1, valid Jul3→Oct1 2026, ssl_verify=0)
- ✅ serves current markup (live == repo, 49545 B byte-identical)
- ✅ memlia.com + memlia.org → 301 → https://memlia.fr/ (both http AND https)
- ❌ SPF+DMARC on all 3 zones — **FAIL: memlia.fr has ZERO TXT** (no SPF, no DMARC, no MX),
     confirmed via 1.1.1.1 + 8.8.8.8. .com/.org carry `v=spf1 -all` + `v=DMARC1; p=reject;`.
- ✅ title no "n°1" & == og:title (== twitter:title)
- ✅ canonical https://memlia.fr/
- ✅ JSON-LD valid (@graph 4 nodes: Org+WebSite+SoftwareApplication+FAQPage), 8 Q, schema text == visible text VERBATIM
- ✅ single H1
- ✅ robots.txt/sitemap.xml/llms.txt reachable (200) AND well-formed (sitemap declared, single "/" URL lastmod 2026-07-03, AI search bots allowed, Bytespider blocked)
- ✅ FAQ answer-first, 8 Q/R visible in DOM
LOW/optional: www.memlia.fr does NOT resolve (NXDOMAIN) → no www→apex redirect.

### Classification by impact
- **Only real gap (MEDIUM):** memlia.fr missing SPF+DMARC → PRIMARY brand domain is spoofable while
  the two secondary domains are locked (inverted security posture). Cloudflare DNS gap → SIGNALLED, NOT touched.
- **LOW/optional:** www no redirect (Cloudflare DNS).
- **NO repo gap** — every file-based check green on both live and repo. Nothing to edit in-repo, so the
  loop's "fix the principal repo gap" has no target.

### Exact Cloudflare step signalled (memlia.fr zone → DNS → Records)
- TXT `@`      = `v=spf1 -all`
- TXT `_dmarc` = `v=DMARC1; p=reject;`   (identical to what .com/.org already have)
At launch (Brevo sending): SPF → `v=spf1 include:spf.brevo.com -all` + add Brevo DKIM + optional DMARC `rua=` once a mailbox exists.
NOTE: memlia.fr SPF/DMARC was DELIBERATELY deferred by Kevin on 2026-07-03 ("pour memlia.fr — pas pour l'instant").
Kevin chose LOCK NOW (2026-07-04) via AskUserQuestion. He applies the 2 TXT records in Cloudflare himself
(no CF access from CLI + task forbids touching infra); re-run the audit on his "c'est fait". Did NOT touch Cloudflare, did NOT commit/push.
**RESOLVED 2026-07-04:** Kevin added both TXT. Verified at authoritative Cloudflare NS + 1.1.1.1:
SPF `v=spf1 -all` + DMARC `v=DMARC1; p=reject;` present on memlia.fr. (8.8.8.8 apex SPF briefly
cache-lagged on a stale negative response — self-heals, not a config issue.) **AUDIT NOW 10/10 GREEN.**

### Loop terminal condition — REACHED → loop STOPPED
No repo gap is fixable by editing; the only red check is a user-gated Cloudflare DNS change. A 2nd pass brings
zero autonomous progress → no ScheduleWakeup. Re-run `python3 scratchpad/markup_audit.py` + the `dig` TXT checks
after Kevin adds the two records to confirm green.
