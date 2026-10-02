# Changelog

Tracks releases and the reasoning behind them. Newest first.

Entries retain accepted product changes and the rationale that explains them.
Private review and execution records are maintained separately.
Data-only monthly updates are recorded here too; see `README.md` → *Monthly data maintenance*
for the procedure and the release checklist.

Convention: every release bumps `CACHE_VERSION` in `sw.js`. The version in each heading
is the value shipped by that release.

## 2026-09-29 — v126: M3B public licensing boundary

Scoped the MIT grant to Yu-owned implementation and added separate terms for
eligible reserved PYOKO editorial and protectable compilation material. The
terms exclude underlying facts and third-party material, reserve the brand,
and grant the official Grutto Pass operator narrow royalty-free reuse of
eligible Yu-owned reserved material. Added an ODbL pointer for OSM-derived
coordinates and published the new terms through the explicit build allowlist.
The footer's "Full terms" link now opens the data and content terms, and the
shell cache advanced once from v125 to v126. Transformed public contributor,
release, brand and schema documents without changing runtime data, product
semantics, generated facility content or crawler directives.

## 2026-09-29 — v125: M2B public runtime / private evidence boundary

Separated internal review state from public runtime data. Access presentation
retains the accepted display values, and public source URLs, labels, dates,
page locators, roles, arbitration and Introduction attribution remain intact.
The shell cache advanced once from v124 to v125.

Accepted-main comparison preserves all 108 facilities, 211 exhibitions, 109
three-language Introductions, Pass/value/source behavior and 585 time-scope date
probes. Generated facility HTML remains byte-identical at the same reference
date; production privacy inspection excludes internal evidence files.
Validation included 318 public Node tests, public validators,
production/canary builds, and the sequential 181-test Chromium/WebKit release
gate. The actual v124 → v125 upgrade preserved three-language content
online/offline, matched every changed cached file and removed the old cache
with zero fatal JS errors.
Public validation remains self-contained. Recorded interim main → Cloudflare
production coupling: successful candidate Preview and explicit owner release
approval are required before merge. M2 transformation is complete; release,
repository publication and M3 licensing remain separate. No merge, manual
production deployment or Cloudflare setting change is authorized by this entry.

## 2026-09-29 — v124: M2A runtime code/data ownership separation

Moved the official-source, exhibition-meta, and Pass time-scope algorithms into
three root-level runtime code files. Their data files retain accepted constants
and curated records; exhibition metadata keys are identical literal keys.
Existing global APIs, data values, source ordering, fallback behavior and product
semantics are unchanged. Browser, service-worker, static renderer, validator,
and public test loaders now load data before code.
The production allowlist includes all three code files; the shell cache advances
once from v123 to v124.

Recorded the new files as future-public code in the boundary authority without
rewriting the historical classification baseline. M2 remains IN PROGRESS,
M2A is COMPLETE, and M2B is NOT STARTED. Updated only the current file/load
architecture notes. No M2B evidence cleanup, M3 licensing work, repository
publication, or production deployment.

Validation: all 40 moved algorithms match their original implementations
verbatim; retained constants serialize identically, including key/array order.
Deterministic baseline comparison preserves own keys and primitive values while
normalizing only VM prototypes: source outputs for all 108 facilities, resolved
and applied metadata for all 211 exhibitions, and all 19 time-scope records /
43 windows with 585 boundary and fallback date probes are equivalent.
All 317 public Node tests, public validators, and production/canary builds
passed. The sequential public release gate passed all 181 Chromium / WebKit
tests. Production inspection found all required assets, no duplicate algorithms,
and byte-identical unaffected assets and generated pages at the same build date.

## 2026-09-28 — M1 public/private validation decoupling

Completed M1 of the accepted repository boundary migration. Public Node test
discovery is limited to `test/*.test.js`, retaining accepted product, schema,
and behavior assertions without private source inputs.

The public release gate now runs Node tests → public validators → production
build → public Chromium/WebKit E2E, without brochure source reconciliation.
Existing CI commands therefore validate the public surface. Updated usage and
release documentation and recorded M1 complete in the boundary authority.
Corrected a stale browser assertion that assumed a PDF was the first source row;
all footer width/locale assertions now run as separate tests within normal deadlines.

Validation: 317 public Node tests and 181 public browser tests pass both in the
working repository and in an isolated public-input copy. Production output is
byte-identical to accepted main at the same build date. No runtime/data semantics, M2/M3,
licensing, robots, publication, or deployment changes.

## 2026-09-21 — Facility-confirmed exhibition titles

Finalized the runtime titles for No.11, No.34, and No.71 against their facility
pages; No.71 now links to its specific exhibition page. Existing exhibition
periods, the No.34 changeover interval, and Pass entitlements are unchanged.
No.89's provisional 2027-03-10 planetarium rerun remains unpromoted because the
facility confirms projections only through 2026-11-29. Bumped cache v122 → v123.
`npm test` (366 tests), `npm run validate` (passed with one existing No.17
closure-date warning), and `npm run build:pages` passed. Not deployed.

## 2026-09-19 — 2026 Grutto exhibition baseline refresh

Refreshed the 2026 Grutto exhibition baseline from the official August
revision: added the review-only 109-row/107-number/23-page snapshot and
promoted the reconciled September 2026–March 2027 schedule additions into
the existing runtime owners. A focused completeness remediation also promoted
No.1's confirmed title, No.22's 2026 Hall of Fame exhibition, and No.72's
後期企画展 while preserving No.72's later special exhibition. No.34 retains
the facility-page wording `関島寿子 バスケタリー展（仮称）` with the
confirmed 11/14 reopening. The all-109-row rescan found no other genuine
missed promotions; remaining differences are source notes, formatting/title
normalization, or current facility/runtime authority differences. No.47 and
No.98 confirmed identities were preserved; No.103 remains one runtime card
with two attributed source rows; and No.105's 10/5–10/6 gap remains explicit.
Operational boundaries for No.61, No.80, and No.102 were updated with current
official sources. Closure-date parsing now keeps reopening and exhibition dates
out of closure ranges, and stale release assertions follow the accepted CTA,
provenance, and config-driven copy semantics. Cache v122 was issued. The release
gate and production build passed; not deployed.

---

## 2026-09-06 — ABOUT-001: multilingual product identity and trust pages

Implemented the approved ABOUT-001 product-documentation surfaces at `/about/`,
`/about/data/`, and `/about/pass-tracker/` in Japanese, English, and Chinese,
using the approved copy packs. Each page is static, self-canonical, and linked
through a local-only language switch with query-string and browser-local
preference support; no external language service or runtime data layer was
introduced.

Production ownership is explicit in `scripts/build-pages.js` (the five About
files), and `scripts/facility-direct-url.js` owns the three sitemap entries.
The canary build excludes the About surface, and `sw.js` was not changed, so
these pages are not install-time precached. Contextual links were added from
the existing footer, Pass Tracker note, detail provenance area, and facility
source panel. These are presentation-only links: provenance ownership,
classification, arbitration, and semantics remain unchanged.

README, durable messaging guidance, and regression coverage were updated. The
full test suite (358 tests), data and Pass semantics validators, brochure audit,
production/canary builds, and direct artifact checks passed. Required exact
manual viewport acceptance was completed for `/about/?lang=ja` at 375px and
1440px, `/about/?lang=zh` at 375px, `/about/data/?lang=en` at 375px and
1440px, and `/about/pass-tracker/?lang=zh` at 375px and 1440px; no overflow or
clipping appeared. The Playwright e2e command remains environment-blocked here
because the repository's Playwright binary is not installed. Not deployed.

---

## 2026-09-05 — OWNED-GUIDE-001: one bounded owned guide

Implemented the approved OWNED-GUIDE-001 search-discovery experiment: one
static, hand-maintained Japanese page at `/guides/grutto-pass-before-you-go/`,
adapted from the published NOTE-001 note article but rewritten with a
different document intent — the reader's next-destination decision first,
rather than the owner's experience first — and not a mechanical copy of it.
The four repeated checks (休館日, 最終入館, 現在の展覧会, ぐるっとパスの対象条件)
and the retained first-person evidence (the owner's Tuesday near-miss and the
PYOKO build story) were rewritten rather than copied; the Shoto Museum of Art
closure/hours quotes and the 東京都美術館 exhibition-applicability example were
rechecked against their official sources on 2026-09-05 before publication and
remain current as of that date.

Build ownership stays an explicit two-file allowlist
(`guides/grutto-pass-before-you-go/index.html` and its one product screenshot)
in `scripts/build-pages.js`, not a copied `guides/` directory, so an unrelated
future file under `guides/` will not ship by default. The page carries exactly
one self-canonical (`https://pyoko.jp/guides/grutto-pass-before-you-go/`), no
`noindex`, and no `pages.dev` identity, and requires no JavaScript to render
its content. `scripts/facility-direct-url.js` gained a small explicit
`STATIC_INDEXABLE_PATHS` list so the single production `sitemap.xml` carries
the guide's URL exactly once (12 URLs total); the local canary-preview sitemap
is unaffected. The homepage gained one low-prominence footer link
(`ぐるっとパスの使い方ガイド`, styled identically to the existing
`/facilities/` discovery link) inside the existing "本サイトについて"
disclosure — no new primary-navigation item. `sw.js` was not changed, so the
guide is not install-time precached.

Owned guides remain evidence-gated individual artifacts, not an approved
content system.

No `/blog/`, `/guides/` index page, second guide, generator, structured data,
or multilingual guide tree was created. Focused tests
(`test/indexing-readiness.test.js`, `test/facility-direct-url.test.js`) plus
the full `npm test` (351 tests) passed; a fresh `npm run build:pages` artifact
was inspected directly. Not deployed — production exposure requires a
separate explicit owner-approved deployment.

**Remediation (same day):** three review findings closed. The roadmap entry's
status line was normalized from free-form lifecycle prose to the controlled
`ACTIVE` value, with the lifecycle qualification kept as separate prose.
`scripts/build-pages.js` copied the owned guide's two allowlisted files
unconditionally, so `npm run build:pages:canary` was leaking
`guides/grutto-pass-before-you-go/` into `.canary-preview/` even though the
canary sitemap already excluded it; the copy is now skipped when
`--canary-preview` is set, and a regression test asserts no canary-output file
starts with `guides/` and that the canary sitemap excludes the guide URL. The
article's discount sentence was softened from the overstated
`差額の支払いが必要です` to `割引適用後の料金がかかります`, and its check-3/4
material (current exhibition vs. Pass applicability, previously merged into
one section) was split into two independently scannable numbered sections so
the visible `1.`–`4.` headings match the four checks named in the opening;
the former numbered `4. 候補が増えるほど…` transition section is now
unnumbered. Canonical, title, H1, meta description, publication/update dates,
homepage link, screenshot, and OG identity were not changed.

---

## 2026-09-04 — Provisional Exhibition Identity Cleanup (No.47 / No.98)

Finalized two user-visible exhibition records that still carried early Grutto
provisional `(仮)` identities after current facility-official truth became
available. No.47 now shows the facility-confirmed `YUKI TORII 鳥居ユキの
ハッピー・パワー・アイデンティティ` (2026-09-01–12-20) instead of the
placeholder `TORII展(仮)`. No.98 no longer presents the unverified early plan
`開館5周年記念展 英治が愛した青梅(仮)` as current fact and instead shows the
facility-official running event `青梅市吉川英治記念館×文豪とアルケミストPART Ⅵ
Many thanks ～私たちと文アル～` (2026-07-18–11-29, official event page link); the
plan is recorded as not currently verified and not as cancelled. No Pass
semantic, schema, or architecture change; `CONFIG.lastUpdated`, the banner
date, September–October footer sources, and the v120 cache boundary are
preserved. Focused shared-projection regression coverage plus `npm test`,
`npm run validate` passed; no deployment
occurred.

---

## 2026-09-04 — Official September–October Recommendation Refresh (v120)

Refreshed the PYOKO exhibition data from the official 2026-08-27 Grutto Pass
admission and discount recommendations, retaining the earlier source records
and adding the admission provenance record `grutto_blog_20260827`. Reconciled
the five newly confirmed time-scoped admission windows for No.28, No.33, No.62,
No.94, and No.106, plus current exhibition dates, titles, prices, notices, and
official/listing links across the changed facilities. Kept discount-only
recommendations out of the Pass entitlement registry, preserved No.102's
operational closure state, updated `CONFIG.lastUpdated` to 2026-09-04, and
bumped `CACHE_VERSION` to v120. `npm test`, both validators, and 30 focused
Chromium E2E tests passed; no deployment occurred. The accepted remediation
then corrected No.13's autumn identity, No.38's autumn discounted price, and
the visible No.20 and No.69 exhibition records without changing the v120 cache
boundary; focused remediation coverage and final validation passed.

---

## 2026-08-25 — D2.2 JA-only Technical Canary Deployed (v119)

Deployed the exact nine-facility JA-only technical canary: `5`, `7`, `18`,
`36`, `36-2`, `44`, `71`, `103`, and `105`. Live Gate B passed for the
production homepage, `/facilities/` index, canonical facility pages, exact
11-URL sitemap, crawl path, robots behavior, true 404, public/internal
boundary, and Service Worker v119 boundary. Observation started at
2026-08-25 21:17:42 JST, with the approximate 14-day PYOKO decision checkpoint
on 2026-09-08. Broad rollout remains unauthorized; no EN/ZH facility pages,
language-specific canonical tree, or Card/Drawer facility links were added.

---

## 2026-08-25 — D2.2 Technical Canary Release Preparation (v119)

Explicitly approved the exact nine-facility technical-canary publication cohort
in the registry: `5`, `7`, `18`, `36`, `36-2`, `44`, `71`, `103`, and `105`.
The normal production build now emits the facility index, nine canonical pages,
the existing homepage crawl link, and the matching sitemap; publication remains
an explicit authority rather than automatic candidate expansion. Shared semantic
and exhibition safety remains intact, including the No.5 and No.71 date checks
and No.103's single page with two introductions. Bumped `CACHE_VERSION` to v119.
This is release preparation only: no merge, production deployment, live URL
publication, indexing, Gate B, or 14-day observation occurred.

---

## 2026-08-25 — D2.2 Static Exhibition Relevance Correction

Corrected static facility-page exhibition projection to consume the shared
runtime relevance rule with an explicit Tokyo reference date. Expired and
far-upcoming enriched records are no longer rendered merely because source
data exists; permanent, recurring, and unknown-date items retain neutral
labels, and facilities with no safe exhibition omit only that block. No merge,
publication, or deployment occurred.

---

## 2026-08-25 — D2.2 Canary Readiness Implementation

Implemented the activated D2.2 readiness architecture on a feature branch. Added
one stable card-key-to-slug registry, separate canary and publication cohorts,
the shared browser/Node semantic projection, deterministic static facility pages,
`/facilities/` index and generated sitemap ownership, and safe default production
output with no approved facility pages. The canary preview covers 9 cards
including both No.36 identities and No.103's two subordinate venues; high-risk
legacy reference values remain suppressed and facility HTML is not in the
Service Worker install precache. Updated README and tests. No merge or deploy.

---

## 2026-08-21 — Refined AI Crawler Discovery Policy

Separated AI search/discovery and user-directed retrieval from model-training and
model-development controls in `robots.txt`. Allowed verified OpenAI, Anthropic,
Perplexity, Apple, and Amazon search/user agents while retaining training,
scraping, and ambiguous-agent blocks. Preserved ordinary Google Search
crawlability while keeping `Google-Extended` blocked because its current control
combines Gemini training with certain grounding uses. Updated the README policy
note; no product/runtime semantics changed and no production deployment was
performed.

## 2026-08-20 — Risk-based Documentation Validation

Clarified that ordinary documentation-only changes use targeted
documentation validation rather than the application test suite, while
preserving focused or full validation for executable/machine-consumed docs,
runtime/data/build changes, and mixed changes. Validation is selected by
behavioral risk rather than file location; no runtime/product behavior changed.

---

## 2026-08-20 — Map Fallback Correction for Lazy Dependencies

The cold-load Map deferral loaded Leaflet and MarkerCluster as one failure
domain, so a MarkerCluster-only failure failed the whole Map request and sent
the user back to List. The pre-existing contract is that clustering is an
optional enhancement and only Leaflet core is required.

### What changed

- `map.js` separates required Leaflet core from the optional MarkerCluster
  enhancement. Core failure still fails the Map request safely and restores
  List; a MarkerCluster failure is recorded instead of propagated.
- A partial cluster failure — script only, or stylesheet only — now degrades to
  ordinary individual markers with a working Map, so clustering is never used
  on the strength of the plugin global alone.
- Map assets remain deferred from the initial List load, and the Service Worker
  precache and offline Map path are unchanged.

### Why not

- No asset-loader architecture, dependency registry, retry system, or Map
  loading UI: the contract needed one explicit required/optional distinction.

### Verification

- Node and browser tests cover the three boundaries separately: Leaflet core
  failure returns to List, MarkerCluster script-only failure keeps Map with
  ordinary markers, and MarkerCluster stylesheet-only failure does the same.
  Both browser partial-failure tests fail against the pre-correction loader.
- Offline: the Service Worker shell caches all four Map assets; an offline
  visit renders the List and opens Map with clustering from cache.
- Nine constrained cold runs per state against the pre-deferral baseline
  (`aa71398`) put median core UI readiness at 6,914 ms versus 7,861 ms, with
  24 versus 28 requests and 958,485 versus 1,152,310 response-body bytes before
  core. Median FCP 820 ms versus 900 ms and LCP 6,972 ms versus 7,920 ms; the
  FCP/LCP increase reported by the earlier five-run sample did not reproduce.
  These byte counts are the controlled local benchmark artifact, not Cloudflare
  production transfer.
- First Map activation reaches a usable map at a median 1,362 ms constrained
  and 54 ms unthrottled.
- Release acceptance is clean: `npm run test:release` passes all 168 browser
  checks. `npm test`, `npm run validate` and
  `npm run build:pages` also pass.

---

## 2026-08-20 — Cold-load Map Dependency Deferral

The default first-visit experience is List, but it synchronously loaded the
unused Leaflet and MarkerCluster assets. Under a repeatable mobile-style local
cold profile, this put 194,747 unnecessary bytes on the initial path and left
the first usable List state at a median 8.21 s.

### What changed

- Load the vendored Leaflet and MarkerCluster scripts/styles only when Map is
  requested; preserve their existing local copies and Service Worker precache
  entries for offline use.
- Keep List available if an optional Map asset fails, and verify the first Map
  transition, selection/focus, responsive location control, and offline Map
  path.

### Measurement

- The same five-run cold profile reduced median List core readiness to 7.84 s
  (370 ms / 4.5%), with initial request body bytes down from 1,152,310 to
  957,563 (16.9%).
- The seven-run unthrottled local comparison reduced core readiness from
  220 ms to 210 ms. The Service Worker cache contract and analytics baseline
  are unchanged.

---

## 2026-08-19 — PYOKO SNS First-pass Assets

Created the complete first production-ready 1080 × 1350 four-card social set
for the approved PYOKO Forest direction. The brand-establishing card and the
product-proof card were established first, then the two supporting narrative
frames were extended with the same controlled system.

### What changed

- Added `assets/social/pyoko-sns-01-next-stop.svg` and `.png` for the opening
  “通票买了，下一站去哪？” story.
- Added `assets/social/pyoko-sns-02-less-back-and-forth.svg` and `.png` for the
  two practical checks that reduce back-and-forth research.
- Added `assets/social/pyoko-sns-03-decision-card.svg` and `.png` for the
  product-proof story showing opening status, Pass information and exhibition
  context in one decision surface.
- Added `assets/social/pyoko-sns-04-next-stop-question.svg` and `.png` for the
  brand proposition that reframes discovery as a next-stop decision.
- Kept the existing PYOKO wordmark geometry, Forest / coral / lime token roles,
  product-green interaction roles and independent/unofficial hierarchy.
- Replaced the automatic paw/mascot language with the approved two-O movement,
  short hop dash and restrained route waypoints; no official Pass artwork or
  redrawn official logo is used.

### Verification

- All four SVGs render to RGB PNGs at exactly 1080 × 1350.
- Chinese headlines, descriptors and brand lockups were visually reviewed at
  full export size.
- `git diff --check`, `npm test`, `npm run validate` and `npm run build:pages`
  passed.
- No deployment performed.

---

## 2026-08-19 — PYOKO SNS Visual Guidelines

Documented the active Forest identity rules for SNS cards, carousels, social
previews and AI-assisted visual generation. This is a documentation-only
change; runtime UI, data semantics, analytics and deployment state are
unchanged.

### What changed

- Added `docs/brand/pyoko-sns-visual-guidelines.md` as the implementation-facing
  source of truth for social visuals.
- Locked the two-O / coral / lime movement language and explicitly rejected paw
  prints, mascot animals and an automatic literal-bird substitution.
- Recorded the current brand and product color tokens, descriptor hierarchy,
  localization rules, product-proof boundary and official Grutto Pass asset
  boundary.
- Added a deterministic image-generation workflow, negative prompt constraints
  and a pre-export QA checklist.
- Added pointers from `AGENTS.md` and `README.md` so future agents read the
  guide before creating branded social output.

### Verification

- Documentation references resolve to existing production files and assets.
- No runtime or production build files changed.
- No deployment performed.

---

## 2026-08-19 — Minimal GA4 Acquisition Measurement (v117)

Added the official Google Analytics 4 base measurement tag with Measurement ID
`G-Q7B7GYCV5L` for the first XHS-001 real acquisition experiment. The scope is
limited to source / medium / campaign, page/session information, and a basic
engagement baseline.

No custom behavioural events, personal-state tracking, session replay, Google
Tag Manager, or analytics dependency in core PYOKO functionality were added.
Analytics remains fail-open, and behavioural product analytics remains
`OBSERVING` in the roadmap.

### Verification

- `npm test`: 324 passed.
- `npm run validate`: passed with 0 errors and 0 warnings.
- `npm run build:pages`: passed; 49 files packaged with review/internal files
  excluded.
- Local browser smoke passed page load, List/Map switching, language switching,
  and no page error or warning logs.
- Bumped `CACHE_VERSION` from `grutto-pass-v116` to `grutto-pass-v117` for the
  shipped `index.html` shell and synced the offline-shell test expectation.
- No deployment was performed; GA4 Realtime and campaign attribution remain
  owner-side checks after deployment.

---

## 2026-08-19 — Agent Governance Push/Deploy Alignment

Aligned the durable Agent workflow with the accepted-work lifecycle.

### What changed

- Meaningful accepted tracked changes now normally proceed through
  `CHANGELOG → commit → push` so GitHub remains the latest durable project
  state.
- Preserved local-only/no-push exceptions, no-history behavior for no-change
  verification work, and the separate explicit approval requirement for
  deployment.

---

## 2026-08-19 — Repository Hygiene & Safe Corrections

Narrow ownership and release-hygiene pass. The buildless static architecture,
runtime semantics, and deployment state remain unchanged.

### What changed

- Established root `AGENTS.md` with durable architecture, data-boundary,
  semantic-scope, testing, deployment, and documentation-ownership rules.
- Moved the non-empty product roadmap intact from
  `docs/design/product-roadmap.md` to `docs/product-roadmap.md`.
- Removed the general crawler blocks for public runtime resources from
  `robots.txt`; retained the named AI/ML crawler rules and canonical sitemap.
- Corrected the maintainer documentation to describe
  `data/facility-brochure.js` as its required runtime projection, with brochure
  prose remaining review-only.
- Retained `data/facility-brochure.js` in the runtime and production allowlist
  because it supplies official English-name fallback/search, No.103 venue
  structure, and brochure PDF page locators used by provenance.

### Verification

- Fresh `.cloudflare-dist/` build verified the roadmap, `AGENTS.md`, review
  artifacts, scripts, tests, and source maps are excluded while required public
  runtime files remain present.
- No deployment, push, or cache-version bump was made because no cached shell
  asset changed.

---

## 2026-08-19 — Search Indexing Readiness — Phase 1 (v116)

Narrow production indexing-readiness pass for the current PYOKO homepage. No
information-architecture expansion, multilingual URL migration, structured-data
expansion, analytics, or deployment changed.

### What changed

- Removed the Pass final-use deadline from the browser document title while
  retaining the operational deadline in My Pass and other product UI.
- Verified the `https://pyoko.jp/` canonical, `og:url`, and absolute social-image
  metadata identity across source and fresh production output.
- Added the one-URL canonical `sitemap.xml` and aligned `robots.txt` with the
  canonical sitemap resource without blocking normal homepage indexing.
- Verified the indexability/noindex state, locale title behavior, production
  artifact contents, and exclusion of internal/review files.
- Added no facility URL architecture, multilingual path migration, hreflang,
  structured data, SEO landing pages, analytics, Search Console integration, or
  deployment.
- Bumped the service-worker cache version from v115 to v116 for the changed
  production shell.

### Verification

- Focused indexing-readiness tests cover title ownership, JA / EN / ZH title
  localization, canonical metadata, robots, sitemap, old public-domain leakage,
  and production artifact hygiene.
- No facility URLs or query/hash/filter-state URLs were added to the sitemap.
- No deployment was performed.

---

## 2026-08-19 — Footer Semantic Layout & Trust Refinement (v115)

Narrow Footer semantic layout and trust-row refinement. No redesign, product/data
semantics, LICENSE text, analytics, or deployment changed.

### What changed

- Aligned the Footer unofficial identity and official CTA with the Hero semantics;
  the CTA now communicates purchase/latest-information purpose in JA / EN / ZH.
- Removed the forced mobile trust-row line break so identity and CTA remain one
  flex-wrapping semantic row.
- Made About's Display methodology an explicit full-width semantic group and split
  Value / Opening Status into responsive internal columns.
- Made Data Terms span the full Sources grid while keeping its body at a readable
  measure.
- Preserved all existing Footer content meaning, methodology information, source
  links, recommendations, LICENSE link, OSM attribution, disclosures and external
  link safety. No Footer redesign or unrelated polish was included.
- Bumped the service-worker cache version from v114 to v115 for the changed
  production HTML shell.

### Verification

- Focused Footer and i18n tests cover the three locales, semantic placement hooks,
  Hero CTA parity, canonical destination, natural wrapping safeguards and retained
  disclosure structure.
- No deployment was performed.

---

## 2026-08-18 — Footer Trust & Feedback Layer (v114)

Narrow Footer refinement for site-wide trust, information freshness and user
corrections. No product surface, data semantics or deployment changed.

### What changed

- Added an always-visible Information accuracy block between the existing
  unofficial identity row and the existing About / Data & sources disclosures.
- Added an always-visible Questions or corrections block with the plain
  `mailto:hello@pyoko.jp` link. No form, backend, storage or analytics was added.
- Added the approved JA / EN / ZH accuracy and correction copy through the
  existing `data-i18n` architecture.
- Reduced `footer.unofficialShort` to identity-only wording so the new accuracy
  statement owns freshness/changeability while the existing official Grutto Pass
  link stays unchanged.
- Left Facility Detail official-source/provenance UI and the status-specific
  opening-hours methodology note unchanged.
- Bumped the service-worker cache version from v113 to v114 so the changed
  production HTML and i18n shell can refresh when this commit is deployed.

### Verification

- Focused Footer trust tests cover the three locales, DOM placement, mailto
  behavior, duplicate-copy removal and retained disclosures.
- No deployment was performed.

---

## 2026-08-18 — PYOKO Forest 404 Refinement (v113)

Narrow visual alignment pass for the static Cloudflare Pages not-found response.
The existing light card remains intact; this release brings the 404 into the
current PYOKO Forest identity system without changing the product UI.

### What changed

- Replaced the generic 404 eyebrow with the production PYOKO compact wordmark,
  preserving the existing P / Y / O / K / O geometry, coral O, lime O and hop
  tick.
- Added the `for Tokyo Museum Grutto Pass` descriptor and the localized
  `非公式` / `Unofficial` / `非官方` identity line while keeping PYOKO primary.
- Added a compact JA / EN / ZH language switch using the existing locale
  preference order: `?lang=`, `grutto-pass-lang`, then browser language.
- Mapped the standalone page to the Forest and product semantic tokens. Forest
  owns wordmark identity; product green remains limited to interactive states
  and the home recovery link.
- Fixed the weak 404 focus ring, added 44px interactive targets, and balanced
  the Japanese heading at narrow mobile widths.
- Bumped the service-worker cache version from v112 to v113 for the production
  release. The product UI, information architecture, map, cards and product
  green values are unchanged.

### Evidence

- The visual change retained the accepted Forest and product-green roles.
- `test/not-found.test.js` covers the lockup, semantic roles, all three locale
  copies, focus safeguards and responsive text-wrap rule.

---

## 2026-08-18 — Final Production Deploy & Live Smoke

Published the verified custom-domain canonicalization release through the existing
Cloudflare Pages Git integration. No source code, UI, data, content, project, DNS,
build setting or redirect configuration changed in this deploy pass.

### Production evidence

- Pushed `main` at `8b364a5` to the existing `origin`; the Pages production endpoint
  `https://grutto-pass.pages.dev/` and custom domain `https://pyoko.jp/` both serve
  the new canonical/OG identity.
- Live HTML has canonical and `og:url` set to `https://pyoko.jp/`, both share image
  fields set to the `pyoko.jp` PNG, and no `grutto-pass.pages.dev` public-identity
  reference.
- Live `config.js` reports `lastUpdated: '2026-08-17'`; live `robots.txt` has no
  `Sitemap:` directive. Required pages and assets returned 200 with expected MIME;
  the share image is a readable 1200×630 PNG.
- JA/EN/ZH routes rendered successfully with no console errors, failed same-origin
  resources or mixed-content resources in the controlled browser smoke.
- The controlled browser retained a pre-deploy cached `config.js` and displayed
  `Updated Aug 10` until reload; cache-independent production GETs returned the
  deployed 2026-08-17 config. No code change or cache-strategy change was made.
- The old Pages domain remains accessible with HTTP 200 and no redirect. A
  `grutto-pass.pages.dev` → `https://pyoko.jp/` redirect remains deferred.

---

## 2026-08-18 — Custom Domain Canonicalization

Narrow public-identity migration for the prepared PYOKO custom domain. No product
surface or hosting architecture was changed.

### What changed

- Migrated the public canonical domain to `https://pyoko.jp/` in `index.html`.
- Migrated absolute `og:url`, `og:image` and `twitter:image` URLs to `pyoko.jp`;
  the existing share image was not redesigned.
- Kept `grutto-pass.pages.dev` as the Cloudflare Pages hosting endpoint and did
  not configure a Pages-origin redirect.
- Kept `manifest.json` `start_url` and `scope` relative. No sitemap was invented;
  the source `robots.txt` remains without a `Sitemap:` directive.
- Changed no UI, data, Facility Introduction, Pass semantics, copy, or service-
  worker cache strategy.

### Verification

- Fresh `npm run build:pages`: **48 files, 1.8 MB**; the artifact contains no old
  public-domain references and contains the four expected `pyoko.jp` metadata
  references.
- `pyoko.jp` production access/asset smoke passed: HTTPS pages and required
  same-origin assets returned 200; the share image read as a 1200×630 PNG; no
  mixed-content resources or console errors were observed.
- `npm test` 310/310, `npm run validate`, `npm run validate:pass-benefits`,
  focused locale-metadata E2E, and `git diff --check`
  passed. The existing No.103 brochure structural warning remains expected.
- The current live Pages deployment was not changed in this commit, so the live
  HTML and Cloudflare-managed `robots.txt` still expose the previous metadata
  until this commit is deployed. Rendered-production metadata verification is
  therefore a post-deployment check.

### Deferred

- The `grutto-pass.pages.dev` → `https://pyoko.jp/` permanent redirect is
  intentionally deferred until the new metadata is deployed and re-smoked.

---

## 2026-08-18 — Pre-Launch Release Hygiene Fix

Remediation of the P1 and the publication-hygiene P2 findings from the pre-launch
public-surface audit. Narrow by design: no product semantics, no UI, no Facility
Introduction copy.

### What changed

- **Internal working documents no longer reach the Pages build.**
  `phase1/phase1-review.md`, `phase1/phase1-integration.md` and
  `phase2/phase2-integration.md` are now in `excludedPaths` in
  `scripts/build-pages.js`. They are internal review material:
  `phase1-review.md` records which facilities are under-modelled and which
  judgments are still provisional, which is the reasoning behind the data set
  rather than anything a visitor needs.
- **`phase2/build-coords.js` is excluded from the build.** It is a Node CLI, never
  loaded by the browser, and it carried a stale personal GitHub Pages URL. The file
  stays in the repository and remains runnable as the coordinate-generation tool;
  only publication stopped.
- **`LICENSE` corrected to the architecture that actually ships.** It claimed the
  facility introductions in `data/facility-brochure.js` are quoted verbatim from the
  official brochure. That stopped being true when the prose moved to the review-only
  artifact. The *NOT CLAIMED* bullet now names the verbatim material that really does
  ship — official entitlement wording and the opening/closure/fee/access lines — and
  states that the facility introductions are the project's own editorial summaries
  while `data/facility-brochure.js` carries only structural and page-locator
  metadata. No new claim, no licence-model change.
- **Hero `Updated` refreshed to 2026-08-17.** `CONFIG.lastUpdated` is the information
  verification date, not a build or commit date. The most recent substantive
  verification is the 2026-08-17 source-accuracy proofread of No.43 and No.103 against
  the operators' own pages, matching `approved_on: 2026-08-17` in
  `data/facility-summaries.js`. The 8/18 commits were presentation alignment, Detail
  information hierarchy, and a ZH display-name notation fix folded into the same v112
  release, so none of them moved the verification date forward.
- **False `Sitemap:` directive removed from `robots.txt`.** It pointed at the homepage,
  and no sitemap is generated. No sitemap was invented for this pass; all crawler
  rules are unchanged.
- **No.68 東洋文庫ミュージアム normalized to HTTPS.** `http://www.toyo-bunko.or.jp/`
  → `https://toyo-bunko.or.jp/` (the destination its own 301 names), in both the
  facility `urls` entry and the matching `exhibition_check.source_url`. The two
  Yokohama city sites stay on `http://` because they publish no HTTPS listener.
- `tests/release.e2e.spec.js` had the Hero date pinned as a literal; the assertion now
  reads `8月17日更新`. This is the assertion following the data, not the data being
  bent to the assertion.

### Evidence

- Fresh `npm run build:pages`: **48 files, 1.8 MB** (was 52 / 1.9 MB). The four
  excluded paths return nothing; internal review, scripts, tests, source files
  and `*.map` remain absent. Artifact scans find no secrets,
  no local development hosts or placeholder contact strings.
- `npm test` 310/310, `npm run validate`, `npm run validate:pass-benefits`,
  and `git diff --check` were clean.
- The release suite exposed a Hero date assertion mismatch; the assertion was
  corrected to follow the accepted data and the related tests passed.

### Not changed

- Deliberately deferred: Savings / お得度 / 优惠额 terminology, reference-value
  semantics, `manifest.json` `lang`, multilingual 404, ZH currency and spacing polish,
  the EN `events` → game-days wording, unused brand SVGs, stale `README.md` notes and
  source-only comments, `exhibition_check` and review-hash field cleanup, security
  headers and CSP, custom domain and canonical/OG migration.
- `canonical`, `og:url` and the robots host stay on `https://grutto-pass.pages.dev/`
  pending the custom-domain decision.
- Not deployed.

---

## 2026-08-18 — PYOKO Brand Epilogue — centered alignment refinement

### What changed

- Reframed the existing `#why-pyoko` section as a standalone centered brand epilogue above the Footer, with a 620px maximum measure and responsive side padding.
- Moved the existing decorative two-O motif above the heading within the same block and established a light vertical rhythm for motif, heading and description.
- Verified the Chinese rendering at 390px, 768px and 1280px: the brand block stays centered, the copy wraps naturally, and the page has no horizontal overflow.

### Not changed

- No wording, typography scale, colors, artwork, main content, controls, cards, navigation, Drawer or Footer information layout changed.
- Not deployed.

---

## 2026-08-18 — Facility Detail — Introduction Continuation IA

### What changed

- Browse remains the existing two-line Facility Introduction preview and keeps its card content order.
- Full Introduction now occupies the first Detail content position after Want to go / Visited, before Pass / Admission, Exhibitions and Access.
- Removed the visible `Facility introduction` heading and icon while preserving the Introduction section/container and plain editorial paragraph treatment.
- The change follows the product rationale `Browse preview → Detail full continuation → decision`; it is an information hierarchy refinement, not a copy-length change.
- Pass provenance ownership remains inside the Pass / Admission section, and Access remains intact later in the decision flow.
- Drawer and shared desktop map Detail preserve the same hierarchy through the existing single source / presentation-level clone architecture.

### Not changed

- No Facility Introduction JA/EN/ZH, No.28 targeted copy, Pass, Exhibition or Access copy changed.
- No Drawer or map redesign, no new renderer, and no UI copy remediation were performed.
- Not deployed.

---

## 2026-08-17 — Facility Introduction source-accuracy proofread (No.43, No.103)

`grutto-pass-v112`

### What changed



### Follow-up notation and language-parity pass included in v112

- **No.4 国立科学博物館.** Unified `シアター36〇` to U+3007 in JA/EN/ZH and
  expanded the introduction to name the two permanent-exhibition buildings and the
  360° spherical-screen experience.
- **No.6, No.25, No.53, No.91 and No.104.** Replaced the affected Japanese era
  references with Gregorian years or approximate Gregorian ranges, and kept EN/ZH
  on the same calendar notation. No.25 preserves the complete official scope:
  around 1935 through 1974.
- **No.15 森鷗外記念館 and No.58 NTT ICC.** Closed the recorded cross-language
  asymmetries by composing the three summaries from the same selected facts.
- Regenerated the approved production projection and review artifacts together;
  the independence and production-binding tests cover the corrected copy.

## 2026-08-17 — Hero decorative layer — removed and replaced by the hop mark

`grutto-pass-v111`

### What changed

- Removed the dead `.hero-route` artwork: the 420×220 dashed-curve SVG in the hero and its
  five style rules. The element had been `display:none` since the PYOKO header hierarchy pass,
  so the markup rendered nothing while the stylesheet still described a decorative system.
- Removed the two remaining `display:none` stubs for `.hero::before` (the retired 24s aurora)
  and `.hero::after` (the retired 18px scalloped band), the reduced-motion rule that silenced
  an animation on a pseudo-element that no longer exists, and the `.hero` padding comment that
  still explained the scalloped band as if it were painted.
- Added `.hero-hop`: a short dashed rise with three stops, the last one in coral, placed as the
  last child of `.hero-inner`. Its width is bound to the wordmark (`clamp(128px,16vw,188px)`,
  `clamp(112px,34vw,150px)` under 640px), not to the hero.
- Reduced `.hero` bottom padding from 26px to 18px. That allowance existed to clear the
  scalloped band; with the band gone it now covers the hop mark's clearance instead, so the
  hero grows by roughly one line rather than by the mark's full height.

### Why, and why not the obvious alternative

- The hero had been reduced to a flat Forest rectangle whose only brand gesture is the wordmark
  itself (lime orbit O, raised coral O, lime hop tick). The decorative layer was not
  under-weighted, it was switched off — and leaving switched-off decoration in the source
  invites a later pass to spend time deciding whether to restore it.
- **Restoring `.hero-route` was considered and rejected.** At `min(42vw,420px)` and `opacity:.82`
  it sat at the top right, behind the language switch and the hero title, and was the loudest
  element in the hero. On a hero that no longer carries any other decoration it would read as a
  marketing banner illustration — the graphic equivalent of the standing rule that brand copy may
  not add chrome to the Header, the Hero proposition or the task flow.
- The hop mark instead expresses "one place to the next" the way the wordmark already does, at
  wordmark scale, on the boundary with the search controls, where it reads as a transition into
  the task rather than as ornament above it. It echoes the `.brand-moment-mark` pair at the foot
  of the page, so the same gesture opens and closes the page.
- **Adding the brand line 「ぴょこ」っと、ひとつの場所から次の場所へ。 to the hero was considered
  and rejected.** It overlaps the hero title 「ぐるっとパスで、次はどこへ。」 in meaning, explains
  the name at the one point where the name is least needed, and pushes the search controls further
  down on narrow screens. It stays in `#why-pyoko` after the browse workflow, with the fuller
  version in the footer disclosure.

### Not changed

- No i18n string, no facility data, no renderer, and no change to Pass, Hours, Access,
  Exhibition, Want or Visited semantics. `--pyoko-coral`, `--pyoko-lime` and `--brand-mint`
  keep their values; no new brand asset was introduced.

---

## 2026-08-17 — Facility Introduction — No.28 Post-Final-QA Decision-Value Polish

### Scope and result

- Applied one narrow post-Final-QA correction to No.28 パナソニック汐留美術館 only. The prior copy was factually correct, independent and holdings/display-scope safe, but underrepresented the museum's changing exhibition programme as the primary visitor proposition.
- The revised JA/EN/ZH copy leads with the evergreen multi-theme exhibition programme and retains the dedicated Rouault Gallery, with selected works from the approximately 270-work collection, as the stable distinctive anchor.
- No current exhibition title or date was introduced. The approximately 270 works remain a collection-size fact; the Gallery wording remains limited to selected works displayed by theme.
- Updated the approved JA/EN/ZH copy and production projection together; no
  other facility changed and no new rubric or remediation batch was created.
- Targeted Browse Card and Detail Drawer checks covered the current JA/EN/ZH copy and the affected hierarchy/density; the final sentence architecture keeps both programme and Rouault Gallery cues in the existing two-line preview at 320px without changing the clamp or renderer. The existing responsive release setup passed once after this correction: 161/161 (Chromium + WebKit mobile, including 320/375/390px coverage).
- Real iPhone verification remains `PENDING`; No.28 is included in the final Safari manual checklist. No deployment was performed.

---

## 2026-08-17 — Facility Introduction — Release Candidate Verification

### Scope and result

- Verified the Final 109-record Content QA prerequisite as **PASS**: current approved JA/EN/ZH production copy, audit binding, provenance and brochure-runtime separation are intact; no pending Batch or content blocker remains.
- Verified the static production build with **52 files**. The runtime loads
  `data/facility-summaries.js`; internal review material and brochure prose are absent.
- Ran representative perceptual QA on Browse Cards and Detail Drawers at **320, 390, 768 and 1280px** across longest/shortest/high-clause copy, No.52, No.103, garden, zoo, science-museum and historic-house cases. No clipping, page-level horizontal overflow, hierarchy collision or drawer-scroll regression was found.
- Verified No.52 current JA/EN/ZH production loading, recreated-space wording, source metadata and natural EN wording (`trace his life and literary world`). Verified No.103 remains one combined UI card with two correctly mapped, separately audited venue introductions.
- Regression-level accessibility checks found no structural semantic regression: dialog role/labeling, focus return, readable/selectable introduction text and mobile zoom remain intact. Browser console error/warning spot-check: none.
- Real iPhone testing was not available in this environment. Automated release verification and desktop/mobile-browser perceptual checks pass; final status is **READY_PENDING_REAL_DEVICE**.

### Targeted verification correction

- Updated the two stale No.52 assertions in `tests/release.e2e.spec.js` from the pre-Final-QA Japanese sentence to the current approved copy beginning `夏目漱石が暮らし、執筆した`. No production content, renderer or editorial framework changed.
- The first release-suite attempt was blocked before E2E by the sandbox's local-port binding permission. After the targeted assertion correction and local-only Playwright access, `npm run test:release` passed **161/161 E2E tests**, with `npm test` **309/309** and both validators passing. The initial Want-to-go failures did not reproduce.
- No new content rubric, no Batch 6, no renderer/UI redesign and no deployment.

### Manual real-device gate

- On a real iPhone, check: No.64 longest-JA Browse Card, No.72 longest-EN Browse Card, No.89 longest-ZH Browse Card, No.52 Detail and drawer scroll, No.103 combined Detail mapping, one garden (No.66), one zoo (No.8), and source disclosure/readability at narrow width.

Deployment: **not performed**.

---

## 2026-08-17 — Facility Introduction — Final 109-record Content QA

### Scope and result

- Reviewed all **109 venue-level Facility Introduction records** at release-level integrity: JA/EN/ZH presence, authored audit judgment, source/provenance requirements, current approved copy, audit-to-production binding, stale-review protection and brochure-runtime separation.
- Confirmed the accepted 109 Introduction outcomes: **INDEPENDENT 100,
  BORDERLINE 9**, with no remaining paraphrase-like or source-derived copy.
- Reviewed all **9 BORDERLINE** records as `ACCEPT_BORDERLINE`. Each remains a defining or constrained identity/programme statement with explicit authored acceptance reasoning, no unsafe display/availability promise, and sufficient visitor decision value for its fact space. No borderline record was forced to `INDEPENDENT`, reopened for research or rewritten.
- Reviewed the **12 high-risk historical venue records**: No.23, No.25, No.28, No.44, No.52, No.57, No.62, No.64, No.70, No.97 and both No.103 venue records. Current copy, not old audit wording, was checked. No.57 remains accepted but not an exemplar; No.103-A/B remain separately sourced and separately audited.
- Risk-based localization and decision-value checks covered all BORDERLINE records, all high-risk records, the top 10 longest JA/EN/ZH introductions, and representative museum, garden, zoo, historic-house, literary-museum, science-museum and combined No.103 records. No broad rewrite was opened.

### Final Content QA Corrections

- **No.52 新宿区立漱石山房記念館:** EN `trace his living and literary world` → `trace his life and literary world`. This is a narrow natural-English correction; factual scope and JA/ZH model are unchanged. Source research: **NO**.
- **No.70 すみだ北斎美術館:** EN `a life-size studio model` → `a model of Hokusai’s studio`; ZH `画室等身模型` → `北斋画室模型`. The prior qualifiers were stronger than the frozen JA/source fact `アトリエ模型`; the correction applies the existing source-scope and language-parity gates. Source research: **NO**.
- Both corrections reached the approved production copy in all three languages;
  the internal editorial record retains the source-to-copy verification.

### Final classification and guardrails

- Final mutually exclusive classification: **RELEASE_READY 98, ACCEPTED_BORDERLINE 9, TARGETED_CORRECTION_APPLIED 2, BLOCKED 0 = 109**.
- No new remediation batch, no Batch 6, no new rubric, no renderer/UI change, and no changes to Pass, Hours, Access, Exhibition, Want or Visited semantics.
- Brochure prose remains absent from production runtime. No.52 uses current official primary pages; the 2013 planning PDF remains historical context only. No.103-A/B retain separate factual provenance.

### Verification

- Focused Facility Introduction tests: **30 passed, 0 failed**.
- `npm test`: **309 passed, 0 failed**.
- `npm run validate`: **PASS**.
- `git diff --check`: **PASS**.
- Release suite: **not run**. E2E: **not run**. Deployment: **not performed**.

Facility Introduction content is ready for Release Candidate Verification. Release Candidate Verification was not started in this pass.

## 2026-08-17 — Facility Introduction — No.52 Source Recovery and Final Remediation

### Scope and result

- Recovered and read the current official pages for 新宿区立漱石山房記念館: [Greetings](https://soseki-museum.jp/about-us/greetings/), [Summary](https://soseki-museum.jp/about-us/summary/), [Policy](https://soseki-museum.jp/about-us/policy/) and [Exhibition Room](https://soseki-museum.jp/exhibition-room/).
- Resolved the prior `BLOCKED_TECHNICAL` state using the current official fact pool; No.52 was the only remaining venue-level record.
- The 2013 municipal planning PDF remains historical provenance only and was not used as current display evidence.
- Remediated No.52 with an independent site + recreated-space + displayed-materials introduction. All editorial, decision-value, source-scope and JA/EN/ZH parity gates passed.
- Final arithmetic: **92 resolved entering the pass + 1 No.52 remediation = 93 resolved; 0 remaining**.

### Preserved scope and verification

- Reused the existing mature pipeline and introduced no new rubric, score, threshold or audit architecture.
- Preserved public source attribution and kept brochure prose out of runtime.
- No other Facility Introduction was modified or re-audited. No UI, Pass, Hours, Access, Exhibition, Want or Visited behavior changed.
- Final content QA was not started, the release suite was not run, and nothing was deployed.

### Verification

- Focused independence and production tests: **30 passed, 0 failed**.
- `npm test`, `npm run validate` and `git diff --check`: passed.
- E2E was not required because renderer/DOM did not change.

## 2026-08-17 — Facility Introduction — Blocked Official Source Resolution Pass

### Scope and result

- Reconfirmed the ordinary-remediation state from current artifacts: **93** original venue-level records, **85 resolved entering this pass**, and **8 remaining blocked venue records**.
- Investigated exactly **No.6, No.13, No.15, No.24, No.44, No.52, and both No.103 venue records**. No.103 was handled as two venue records while its combined app card remained unchanged.
- Frozen Phase A classifications: **7 `SOURCE_RESOLVED`**, **1 `BLOCKED_TECHNICAL` (No.52)**, and 0 each `PARTIALLY_RESOLVED`, `BLOCKED_IDENTITY_MAPPING` and `BLOCKED_INSUFFICIENT_OFFICIAL_FACT_POOL`.
- Remediated the 7 source-resolved records from official facility/operator destinations. **0 non-official sources**, **0 failed editorial gates**, **0 replacements**.
- Final queue: **92 resolved, 1 remaining** (No.52). Arithmetic: `92 + 1 = 93`.

### Source-resolution standards

- Reused the existing official-source → atomic fact pool → independent selection → isolated composition → core-frame → editorial-independence → decision-value → source-scope → language-parity → exact audit/production binding pipeline.
- Current official content for No.52 was not reliably readable; the readable official Shinjuku City **2013-03** planning PDF was retained as historical evidence only and was not used to assert current display availability.
- Each unresolved case retained a concrete source-resolution handoff in the
  internal editorial record.
- No new major rubric, scoring system, similarity threshold or audit architecture was introduced. Source-resolution status and handoff are workflow state only.

### Production and verification

- Every newly remediated record passes `CORE_FRAME_DERIVATION=INDEPENDENT`, `EDITORIAL_INDEPENDENCE=PASS`, `DECISION_VALUE=PASS`, `DISTANCE_SEEKING=NO`, `EXPECTATION_RISK=NO` and JA/EN/ZH semantic parity.
- Preserved public source attribution. Brochure prose remains absent from production runtime.
- No UI, Pass, Hours, Access, Exhibition, Want or Visited behavior changed. No new ordinary Batch 6 started. No deployment occurred.
- Focused blocked-pass contract: passed. `npm test`: **309 passed, 0 failed**.
  `npm run validate` and `git diff --check`: passed. E2E and release suite were
  not run because renderer/DOM did not change.

### Next stage

- Ordinary Facility Introduction remediation is complete. The remaining work is source resolution for No.52; the next separate phase may be the Blocked Official Source Resolution Pass continuation. It was not started beyond this pass.

## 2026-08-17 — Facility Introduction Independence Remediation — Batch 5

### Scope and result

- Recalculated the current artifacts before writing: **93** original remediation records, **71 resolved entering Batch 5** and **22 remaining**.
- Computed **14 ordinary unresolved** venue records after excluding the 8 known-blocker venue records; froze and processed all 14. The frozen set was No.17, 71, 72, 76, 81, 84, 86, 92, 93, 94, 97, 98, 102 and No.32 WHAT MUSEUM.
- Attempted 14; successfully researched 14 from official facility/operator/municipal pages; **0 newly blocked**, **0 replacements**, **14 resolved**.
- Final queue: **85 resolved, 8 remaining**. The remaining queue is the known blocker subset: No.6, 13, 15, 24, 44, 52 and the two No.103 venue records.
- `ORDINARY_REMEDIATION_COMPLETE=YES`: no ordinary unresolved record remains. The next phase is the separate Blocked Official Source Resolution Pass, which was not started.

### Out of scope

- Known blockers were not retried; no URL guessing or non-official source substitution was used.
- No resolved record was reopened, no Batch 6 or Blocked Official Source Resolution Pass was started, and no deployment occurred.
- No UI, Pass, Hours, Access, Exhibition, Want or Visited behavior changed.

### Verification

- Focused Batch 5 independence contract: **24 passed, 0 failed**.
- Required full checks are recorded in the Batch 5 audit report; no E2E or release suite was run because renderer/DOM did not change.

## 2026-08-17 — Why PYOKO brand moment (v110)

### What changed

- Added a tertiary brand layer explaining the PYOKO name: a one-line section (`#why-pyoko`)
  between the facility list and the footer on the home page, and a fuller `About PYOKO`
  paragraph as the first section inside the footer's existing *About this site* disclosure.
- New UI keys in all three languages: `brand.whyKicker`, `brand.whyLine`,
  `footer.pyokoHeading`, `footer.pyokoBody`.

### Why here, and why not in the Header

- The name is never needed to operate the product, so it must not compete with the Header,
  the proposition or the discovery controls. Placing it after the whole browse workflow and
  immediately above the footer means a reader meets it only with spare attention — the
  intended effect is a late "so that's why it's called that", not an extra banner. The
  Header, the Hero proposition, search, filters, map, Pass Tracker, Want to Go and Visited
  are untouched.
- Rejected: a second explanatory line in the Header/Hero, a full-width brand band, any
  mascot or illustration, and any placement inside the task flow (between search and
  filters, inside cards, in the drawer or the map panel). All of them turn a small moment
  of delight into a second Hero.
- Rejected: a separate `About PYOKO` footer link. The footer is not utility-only — it
  already carries an *About this site* disclosure — so the brand paragraph goes inside that
  existing disclosure rather than adding a competing entry point.

### Copy

- The site does **not** claim a dictionary definition. The copy presents 「ぴょこ」 as the
  association behind the name (a light hop from one place to the next), which echoes the
  Hero's 「次はどこへ。」 without repeating it. `PYOKO means museum hopping` was explicitly
  rejected as inaccurate.
- Home page and About differ in depth by design: the home page states only what the name
  means; the About paragraph adds the identity (independent, unofficial) and the pointer to
  the official site for purchase and current information.

### Visual

- Reuses the wordmark's own hop gesture — two O's, the second raised in coral with the lime
  tick — so the logo's gesture is explained rather than restated. No new brand asset, no
  change to logo geometry or to the coral/lime values.
- Colour roles are remapped for the light surface: in the Header the resting O is lime
  because it sits on Forest, but lime on paper fails legibility, so the resting O takes
  Forest here and coral keeps the hop. The mark is `aria-hidden` and carries no information
  the copy does not already give. The ZH kicker drops the Latin PYOKO face, which the CJK
  glyphs fall out of anyway.
- The section is hidden in map mode, alongside the area TOC and the empty state, because
  map view is a focused tool surface.

### Verification

- `npm test`: 307 passed, 0 failed. `git diff --check`: passed.
- Checked at 1440 / 1024 / 375 / 320 px in JA / EN / ZH: no horizontal overflow, no forced
  `nowrap`, copy wraps to 2–3 lines on mobile, no console errors, heading is a real `h2`.

---

## 2026-08-17 — Facility Introduction Independence Remediation — Batch 4

### Scope and result

- Recalculated the current artifacts before writing: 93 original remediation records, 56 resolved entering Batch 4 and 37 remaining.
- Froze 15 queued venue records: No.29, No.58 ICC, No.69, No.70, No.73, No.75, No.79, No.82, No.87, No.88, No.95, No.99, No.104, No.105 and No.107.
- Attempted 15; successfully researched 15 from official facility/operator/municipal pages; 0 blocked; 0 replacements; 15 resolved.
- Current queue: 71 resolved, 22 remaining. Known blocked facility subset remains No.6, 13, 15, 24, 44, 52 and 103; No.103 contains two venue records. No.17 was not selected.

### Verification

- Focused Batch 4 independence contract: 23 passed, 0 failed.
- `npm test`: 307 passed, 0 failed. `npm run validate`: ERROR 0 / WARN 0.
  `git diff --check`: passed.

### Out of scope

- No resolved record was reopened without evidence; known blockers were not retried; the remaining queue was not processed; Batch 5 was not started.
- No UI, Pass, Hours, Access, Exhibition, Want or Visited behavior changed. No release suite was run and nothing was deployed.

## 2026-08-17 — PYOKO Brand Copy + Metadata Consistency Pass

### Scope

- Narrow i18n, SEO, social metadata and installable-app identity pass; Header, logo geometry, palette, controls and product IA were left locked.

### Changed

- Separated `app.title`, `app.heroTitle`, `app.eyebrow` and `app.description`: the functional JA/EN/ZH page titles now carry the 2026 edition and PYOKO identity, while the existing Hero proposition remains unchanged.
- Replaced the three locale descriptions with source-aware, verification-date-aware copy; the Chinese terminology now uses `Grutto Pass` for the product name, `通票` for the generic category and `优惠内容` for benefit content. The stray `Pass 票价` was corrected to `通票票价`.
- Added locale-aware runtime updates for `meta[name="description"]`, Open Graph and Twitter title/description/alt metadata. The existing Forest PYOKO social PNG was inspected and retained unchanged.
- Added `manifest.json` with `PYOKO` install identity, standalone display, current Forest theme color and 192×192 / 512×512 exports of the existing compact mark; added it and the icons to the Pages build whitelist and service-worker shell (`v109`).
- Kept `展覧会ガイド` / its locale equivalents as visually hidden semantic page context rather than restoring it as the Hero title. Updated the 404 page identity minimally to PYOKO.

### Verification

- `npm test`: 306 passed, 0 failed.
- Playwright metadata/install test: 1 passed. Existing Hero responsive release test: 1 passed across JA/EN/ZH and 320/375/390/430/768/1024/1440 viewport checks; no horizontal overflow or browser errors.
- In-app browser smoke check: JA/EN/ZH metadata and language switching, manifest, both icon paths and console warnings/errors; all passed. `npm run build:pages` produced 52 files including the manifest and icons.
- `git diff --check` passed. Social image was not redesigned or modified. Not deployed.

### Out of scope

- Existing README, robots metadata and other internal documentation still use older generic Grutto Pass wording; they were not broadened into this narrow metadata pass.

---

## 2026-08-17 — Facility Introduction Core-Frame Backfill, Binding Guard and Batch 3

### Core-frame backfill

- Retroactively applied `CORE_FRAME_DERIVATION` to all 43 records previously counted as resolved, using only their existing brochure/source excerpts, official provenance, atomic pools, old copy and current copy—no new research or rewrites in this phase.
- Results: 42 `INDEPENDENT`, 1 `SOURCE_DERIVED`, 0 `UNCERTAIN`. No.90 多摩六都科学館 was reopened because the previous product retained the source’s planetarium-plus-rooms dominant proposition despite added facts. This was below the systemic stop threshold and did not block the next phases.

### Production-copy consistency

- The approved JA/EN/ZH copy and generated production summary were checked for
  exact agreement. No duplicate production source of truth was introduced.

### Batch 3

- Researched and remediated 14 frozen targets with official facility, operator or municipal pages only; 0 were blocked and 0 replacements were used. The known blocked facilities were not retried.
- Every Batch 3 production record has an atomic fact pool, selected-fact relevance, source/product core frames and an authored reason; all pass `CORE_FRAME_DERIVATION=INDEPENDENT`, `EDITORIAL_INDEPENDENCE=PASS`, `DECISION_VALUE=PASS`, source-scope/expectation checks and JA/EN/ZH parity.
- No.90’s reopened record was reselected around live planetarium explanation
  plus observation, experiment and making.
- Queue arithmetic is now 93 original remediation records = 56 resolved + 37 remaining. Known blocked facility numbers remain a subset of the remaining queue.

### Preserved

- No UI, Pass, Hours, Access, Exhibition, Want or Visited behavior changed. Brochure prose remains outside the production runtime. Batch 4 was not started, the release suite was not run, and nothing was deployed.

---

## 2026-08-17 — PYOKO Header Information Hierarchy Patch

### Scope

- Narrow header-only information hierarchy patch; logo geometry, Forest palette, interaction colors, header architecture and below-header product IA were left unchanged.
- Re-grouped the header as brand relationship → product proposition → utility metadata without increasing the intended desktop hero footprint.

### Changed

- Replaced the visual hero title `展覧会ガイド` with `ぐるっとパスで、次はどこへ。`; retained `展覧会ガイド` as document/page semantic context and existing title/description SEO language.
- Combined `for 東京・ミュージアム ぐるっとパス` with the single `非公式` relationship marker on desktop. Mobile keeps one `Unofficial` / `非公式` marker and does not repeat it in the descriptor.
- Replaced Header `PASS 2026` with the locale-aware applicability metadata `2026年版` / `2026 edition` / `2026版`; the existing My Pass `PASS {year}` label remains unchanged.
- Replaced the official-site link copy with `購入・最新情報は公式サイトへ ↗` / `Buy & check latest info on the official site ↗` / `购买及最新信息请查看官网 ↗`.
- Kept the year driven by `CONFIG.year` and the update date driven by `CONFIG.lastUpdated` plus the existing date formatter; no concrete date was hard-coded.
- Reduced language-switcher border and surface weight by approximately 10–15% while preserving active-state semantics, focus treatment and mobile hit areas.
- Added the corresponding JA/EN/ZH copy and regression assertions; metadata wraps naturally at narrow mobile widths.

### Verification

- Browser QA covered 1440px, 1024px, 375px and 320px, including JA/EN/ZH smoke checks; no horizontal overflow was observed.
- Browser console had no error or warning output. Logo, language-switcher and official-link keyboard focus states were verified; the official link retains its external target and `noopener` protection.
- Header UI unit tests: 81 passed, 0 failed. Header Playwright checks: 2 passed, 0 failed. The full Playwright run completed 156/160; all four timing-sensitive failures passed on isolated reruns.
- `git diff --check` passed. The final full `npm test` run was 296/298; the two failures are pre-existing data/review issues outside this Header patch.
- Not deployed.

---

## 2026-08-17 — Facility Introduction Core-Frame Independence Guard

### Scope

- Batch 2 exposed a remaining editorial blind spot: adding independent official facts does not make a source-derived dominant proposition independent. `CORE_FRAME_DERIVATION` is now an authored acceptance gate for remediation authored after this corrective patch.
- Reopened only No.23 印刷博物館 and No.64 紙の博物館 for core-frame review. Both initial Batch 2 openings were `SOURCE_DERIVED`; both were rewritten from strictly official permanent-exhibition evidence and now pass with `CORE_FRAME_DERIVATION=INDEPENDENT`.
- Corrected No.25 昭和館 EN period parity after verifying the official scope 「昭和10年頃から昭和40年代まで」: the EN and ZH now cover approximately 1935 through 1974.
- Applied one optional No.28 EN-only naturalness polish. The separate holdings and permanent-display claims retain their approved scope.

### Guard

- A remediation may receive `EDITORIAL_INDEPENDENCE=PASS` only when its source and product core frames plus an authored derivation reason are recorded, `CORE_FRAME_DERIVATION=INDEPENDENT`, `STRUCTURAL_PARAPHRASE!=YES`, and `SIDE_BY_SIDE_REACTION!=PARAPHRASE_LIKE`.
- `SOURCE_DERIVED` cannot pass; `UNCERTAIN` requires explicit Lead/human review. No numeric core-frame score was introduced.
- Batch 2 was temporarily reclassified as 13 confidently resolved / 2 reopened / 0 additional-research-needed. Both reopened records passed after the narrow correction, so the final Batch 2 result remains 15 resolved and the queue remains 43 resolved + 50 queued = 93.

### Preserved

- No UI, Pass, Hours, Access or Exhibition behavior changed. Brochure prose remains outside the production runtime. Batch 3 was not started, the release suite was not run, and nothing was deployed.

---

## 2026-08-17 — Facility Introduction Independence Remediation — Batch 2

### Scope

- Researched 15 queued facilities and successfully rewrote 15; 0 were blocked and 0 replacement records were used.
- Applied the official-source-only policy. Search located pages, but facts came from inspected official About, Collection, Permanent Exhibition, Architecture, History or operator pages recorded in the existing `FACILITY_OFFICIAL_SOURCES` registry.
- Used the isolated workflow: source → frozen atomic facts with provenance IDs → 1–3 selected decision facts → canonical JA → EN/ZH from the same selected-fact model → post-write factual, parity and independence verification.
- The ABC→BCA semantic paraphrase remains rejected. Lexical, anchor-order and fact-overlap metrics remain descriptive regression signals; `SUFFICIENT_INDEPENDENT_FACT_POOL` and the dual `EDITORIAL_INDEPENDENCE` + `DECISION_VALUE` gate remain the acceptance basis.
- Queue arithmetic after Batch 2: 28 resolved before + 15 resolved in Batch 2 + 50 remaining queued = 93 records requiring remediation. Known facility-level blockers remain No.6, 13, 15, 24, 44, 52 and 103; No.103 contains two venue records.
- No UI, Pass, Hours, Access or Exhibition semantics changed. No deployment, Batch 3 or release-suite run was performed.

### Changed

- Added 15 Batch 2 official-source fact pools, provenance, selected decision facts, old/new copy, authored judgments and JA/EN/ZH parity records to the independence audit and V2 review projection.
- Added 15 independent production summaries to `data/facility-summaries.js`; unaffected records were left as-is.
- Added 14 new official editorial fact sources to the existing `FACILITY_OFFICIAL_SOURCES` registry; No.74 uses its already-declared official homepage source, and no second source registry was created.
- Extended the decision-value guard to cover `see_do`, `distinctive`, selected-fact
  relevance, distance-seeking, expectation risk, source scope and low-fact justification.

### Verification

- Batch 2 focused independence contract: 16 passed, 0 failed.
- All 15 Batch 2 records: `EDITORIAL_INDEPENDENCE=PASS`, `DECISION_VALUE=PASS`, `STRUCTURAL_PARAPHRASE=NO`, `SIDE_BY_SIDE_REACTION=INDEPENDENT`.
- Not deployed.

### Final Phase A + Batch 2 state

- Phase A passed for all 14 Batch 1 records. Final dispositions: `KEEP 10`, `KEEP_BUT_NOT_EXEMPLAR 1` (No.57), `NARROW_POLISH 1` (No.28), `RESELECT_FACTS_FROM_EXISTING_POOL 2` (No.38 and No.63), `NEEDS_HUMAN_REVIEW 0`.
- No.28 now separates the approximately 270-work holding from the dedicated gallery’s permanent-display claim. No.38 and No.63 no longer spend introduction space on ordinary opening years. No.57’s ceiling-height facts remain accepted but are explicitly not an editorial exemplar.
- Batch 2 decision-value review passed for all 15 records: `SEE_DO=PASS`, `DISTINCTIVE=PASS`, `DISTANCE_SEEKING=NO`, `EXPECTATION_RISK=NO`; no selected Batch 2 fact is LOW.
- Current audit distribution: `INDEPENDENT 50`, `BORDERLINE 9`, `PARAPHRASE_LIKE 48`, `NEEDS_SOURCE_RESEARCH 2`.
- Descriptive Batch 2 detector changes: JA masked LCS `7.867 → 5.000`, EN LCS `5.600 → 2.933`, ZH LCS `10.867 → 5.267`, JA brochure fact coverage `0.516 → 0.238`. These remain regression signals, not acceptance thresholds.
- Final verification: focused independence tests `16/16`; `npm test` `298/298`;
  `npm run validate` `0 ERROR / 0 WARN`; `git diff --check` passed.
- E2E and release suite were not run. Phase A and Batch 2 are complete; Batch 3 has not started and the change is not deployed.

---

## 2026-08-17 — Batch 1 Corrective Product-Value Gate

### Scope

- Rechecked only the four targeted Batch 1 regression risks (No.28, No.38, No.57 and No.63) against their existing frozen official fact pools; no new research, source expansion, architecture change or 109-record re-audit was performed.
- No.28’s collection and permanent-display claims were separated to remove the expectation that all approximately 270 holdings are always on view.
- No.38 and No.63 removed generic opening years and reselected already researched, higher-value facts. No.57 remains accepted but is marked `KEEP_BUT_NOT_EXEMPLAR` because exact ceiling heights are useful physical context but not a general copy model.
- Current Phase A dispositions across the 14 Batch 1 records: `KEEP 10`, `KEEP_BUT_NOT_EXEMPLAR 1`, `NARROW_POLISH 1`, `RESELECT_FACTS_FROM_EXISTING_POOL 2`, `NEEDS_HUMAN_REVIEW 0`.
- Added a permanent LOW-fact justification guard plus source-scope and before/after expectation-risk fields. Remediation still requires both `EDITORIAL_INDEPENDENCE=PASS` and `DECISION_VALUE=PASS`.
- Phase A passed. Batch 2 research was not started in this corrective gate, and nothing was deployed.

---

## 2026-08-17 — Batch 1 Product-Value Regression Gate

### Scope

- Reviewed only the 14 Batch 1 rewrites against the existing V2 decision-value rubric; no new research, source expansion, 109-record re-audit or architecture change was performed.
- All 14 passed `SEE_DO` and `DISTINCTIVE`, with no expectation risk and no distance-seeking fact selection.
- No.28 received one narrow polish: removed the low-value 2003 opening and research-cooperation details; the Rouault collection and dedicated permanent gallery remain the visitor-facing identity.
- Final disposition: `KEEP 13`, `NARROW_POLISH 1`, `RESELECT_FACTS_FROM_EXISTING_POOL 0`, `NEEDS_HUMAN_REVIEW 0`.
- Added a permanent dual gate: remediation is complete only when `EDITORIAL_INDEPENDENCE=PASS` and `DECISION_VALUE=PASS`, with authored `see_do`, `distinctive`, `selected_fact_relevance`, `distance_seeking` and `expectation_risk` fields. No numeric threshold was introduced.
- Batch 2 was not started and nothing was deployed.

---

## 2026-08-17 — Facility Introduction Independence Remediation — Batch 1

### Scope

- Researched 14 queued facilities and successfully rewrote 14; 0 were blocked or replaced in this batch.
- Applied an official-source-only policy. Search located pages, but the editorial facts were taken from the official destination pages recorded in the existing `FACILITY_OFFICIAL_SOURCES` registry.
- Used the isolated workflow: source → frozen atomic facts with provenance IDs → 1–3 selected decision facts → canonical JA → EN/ZH from the same selected-fact model → post-write verification against source and brochure evidence.
- The ABC→BCA semantic paraphrase failure remains rejected. Lexical, anchor-order and fact-overlap metrics remain descriptive regression signals, not acceptance thresholds; `SUFFICIENT_INDEPENDENT_FACT_POOL` replaces any universal “add five facts” rule.
- Queue arithmetic after the batch: 14 resolved before + 14 resolved in Batch 1 + 65 remaining queued = 93 records requiring remediation. Known facility-level blockers remain No.6, 13, 15, 24, 44, 52 and 103; No.103 contains two venue records.
- No UI, Pass, Hours, Access or Exhibition semantics changed. No deployment or release-suite run was performed.

### Changed

- Recorded Batch 1 provenance, selected facts, authored judgments and parity
  checks in the internal editorial record.
- Added 14 independent production summaries to `data/facility-summaries.js` through the existing V2 generator; unaffected records were left as-is.
- Added the 14 official editorial fact sources to `data/facility-official-sources.js`; no second source registry was created.
- Replaced the obsolete universal `new_anchor_count >= 5` test assumption with sufficient-pool, 1–3-fact, parity, support and production-projection checks.
- The internal editorial record retains per-record rewrite evidence and queue state.

### Verification

- Focused independence contract: 12 passed, 0 failed.
- `npm test`: 294 passed, 0 failed.
- `npm run validate`: 0 ERROR / 0 WARN.
- Not deployed.

---

## 2026-08-17 — Brochure prose runtime decoupling (v106, corrective architecture)

### Why

The editorial-independence pass earlier today proved that the official brochure's
prose had no normal runtime path, and recommended removing it. This is that
removal, plus the coupling that made it impossible before.

Two problems, one of them structural:

1. **327 strings shipped and rendered nothing.** `data/facility-brochure.js`
   carried 109 Japanese blurbs and 218 reviewed EN/ZH translations of them. Every
   venue has approved product copy and both Browse and Detail prefer it, so the
   fallback that would have displayed them was unreachable. They were also the
   wrong thing to keep nearby: the independence audit found product EN/ZH copy
   drifting toward them.
2. **Venue existence was decided by "does official prose exist?"** —
   `entries.filter(entry => entry?.descriptionJa)`. That is why the prose could
   not simply be deleted: it would have silently deleted No.103's two venue
   labels along with it. Presentation data was acting as structural data.

### Changed

- **Venue structure is now structural.** `getFacilityBrochureVenues()` reads the
  `subfacilities` array and `nameJa`. A card with a non-empty subfacility array
  has those venues; every other card is itself one venue. No text is consulted.
- **Brochure prose left the runtime projection.** Internal source material
  remains outside the deploy allowlist; public pages use approved PYOKO-authored
  Introductions.
- **The runtime projection keeps only what production uses**: brochure metadata,
  and per card `nameJa`, `nameEn`, `sourcePage`, `subfacilities`. 71.6 KB → 16.5 KB.
- **The prose fallback renderer is gone.** `brochureDescription()` and
  `renderExistingBrochureIntroduction()` are deleted. A venue with no approved
  summary renders no Introduction section — it does not borrow official text and
  does not render an empty shell. The dead `facility.brochureSource` string and
  the attribution-row CSS went with them.
- **A missing approved summary is now an ERROR**, not silence.
  `validateIntroductionCoverage` in `scripts/validate-data.js` checks venue-level
  coverage and JA/EN/ZH presence; the combined card must carry two records.

### Proof

All 47 files of the built deploy were searched for each of the 327 brochure
sentences: **0/109 Japanese, 0/109 English, 0/109 Chinese present**. No brochure
introduction prose ships in any form.

### Preserved

No.103's two venue labels (now from `nameJa`, verified against the source JSON);
`sourcePage` and the Pass provenance deep links that read it; the official English
names `englishFacilityName()` and the search index take from the brochure; the
shared Card/Detail content resolution; JA/EN/ZH product summaries; the offline
shell. No change to Pass, Hours, Access, Exhibition, Want or Visited semantics.

### Not done

- **The 79-record research queue is untouched.** This patch is architecture only;
  no Facility Introduction copy changed.
- **`phase1/*.md`, `phase2/*.md` and `phase2/build-coords.js` still ship** — four
  pre-existing non-runtime files caught while proving the bundle. Same class of
  problem, different subtree; left for its own patch rather than widening this one.

### Verification

- `npm test`: 292 passed, 0 failed (2 new; `test/brochure.test.js` rewritten from
  fallback-contract tests to decoupling tests).
- `npm run validate`: 0 ERROR / 0 WARN. Guard confirmed to fire: removing a venue
  record and blanking one locale produced exactly the two expected errors.
- `sw.js` CACHE_VERSION v105 → v106.
- Renderer output for existing venues is byte-identical (only the unreachable
  branch was removed), and both generators reproduce their artifacts unchanged
  from the relocated prose — so no E2E re-run.
- Not deployed.

---

## 2026-08-17 — Facility Introduction editorial independence (v105, corrective content)

### Why

The V2 pass (2026-08-15) audited whether each Facility Introduction had **decision
value**. It did not ask whether the introduction was independently **derived**. Its
similarity guard rejected any 14-character verbatim run against the source excerpt,
and that guard cannot see the failure it needed to see: a brochure sentence that
says A, then B, then C, restated as B, then C, then A, contains no long verbatim
run and is still, to an ordinary reader, the same sentence put another way.

Re-auditing all 109 venue records against that standard found the problem is
structural rather than incidental. **102 of 109 records were brochure-only**: the
entire fact pool available to the writer was one brochure sentence, so
"independent composition" could only rearrange what that sentence had already
selected. Fact-selection overlap was HIGH on 102, framing overlap HIGH on 92,
relationship overlap HIGH on 93. The seven records that read as independent are
exactly the seven V2 had researched against an official page — independence
tracked the source pool, not the writing.

Comparing the product EN and ZH against the brochure's *own* EN and ZH
translations — which no guard had ever done — surfaced the closest matches in the
set: a 20-word English run at No.15, a 28-character Chinese run at No.1.

### Rule

ABC → BCA is now explicitly rejected. Independence requires the fact **selection**
to be ours, not just the wording, and it is established by source → atomic facts →
composition from the facts, in that order, with verification against the source
afterwards rather than during. Low lexical similarity is evidence of nothing on
its own; a disposition is only valid with a stated reason attached.

This refines, and does not overturn, the V2 rule. Decision value remains required.
A record can have good decision value and fail independence, and when it does it is
rewritten.

### Changed



Not touched: Pass benefit, opening hours, exhibition semantics, access, Want /
Visited, the Source Registry, the Detail IA, and the JA/EN/ZH localization
architecture. No UI change.

### Status

**Content: partially corrected. The audit is complete; the remediation is not.**
14 of 93 flagged records are fixed. 79 remain paraphrase-like in production and are
tracked in the internal editorial record.

### Verification

- `npm test`: 290 passed, 0 failed (9 new).
- `sw.js` CACHE_VERSION v104 → v105; the offline-shell version pin was updated with it.
- `npm run validate`: 0 ERROR / 0 WARN.
- No renderer, no data-shape and no runtime-contract change, so no E2E re-run.
- Not deployed.

---

## 2026-08-17 — Pass Tracker scroll restoration race (corrective patch)

### Navigation state

- Pass Tracker return scroll is restored only after the visible layout and focus restoration are ready.
- Saved scroll positions are clamped to the current scrollable range when a facility leaves the Want list.
- Want-tab continuity, focus fallback, and reduced-motion behavior remain intact.

This is a navigation-state correctness correction, not a new feature.

### Verification

- Focused navigation E2E: 6 passed.
- Related Chromium and WebKit mobile regression suite: 54 passed.

---

## 2026-08-16 — Personal State Feedback Polish (corrective patch)

### Mobile snackbar

- Mobile Toast now uses a predictable viewport width.
- Message and action have explicit responsive ownership; the action no longer breaks vertically.
- Safe-area and back-to-top collision handling are improved.

### Personal-state feedback

- Want and Visited ADD actions now share one feedback grammar.
- REMOVE remains normally silent.
- Want→Visited uses one combined feedback event.

This is an interaction correction, not a new feature.

---

## 2026-08-16 — Publish Only What the App Loads, and State the Terms (v104)

The data set is the expensive part of this project, and it was being published
more generously than intended. Nothing here pretends to prevent copying — every
byte the app reads is readable by any visitor, and that is a property of a
buildless static site, not a bug to be patched. The aim is narrower: stop giving
away work the site does not need to function, and make the terms explicit enough
to be cited.

### The leak: internal verification artifacts

`scripts/build-pages.js` copied `data/` **recursively**, so internal review
files shipped with every deploy — thirteen files including
`opening-hours-official-verification.json`, `pass-benefit-source-verification.json`
and `pass-time-scope-correction-audit.json`. None of them appear in `SHELL_ASSETS`,
so the application never requested one.

Those files are the worst thing to publish accidentally. They do not record what
the data says — the facts are public and anyone may gather them — they record
**how it was checked**: which source was consulted, on what date, why a record was
classified the way it was. That reasoning is the part a copier cannot reproduce
from the official materials.

### The fix is a guard, not a habit

Excluding the directory would have left the same trap for the next file added
under `data/`. The build now fails when anything published under `data/` is absent
from the Service Worker precache list:

```
Error: These files would be published but are never loaded by the app:
  data/.DS_Store
```

That is the guard's first real catch, on its first run — a macOS metadata file
that a local build was copying into the deploy. (It is gitignored, so a CI build
never saw it; local and production output now agree.)

`SHELL_ASSETS` was chosen as the authority because it is already the authoritative
statement of what the app loads, enforced by an existing test against the script
tags in `index.html`. No second list to keep in sync.

### Terms, scoped honestly

The repository had **no `LICENSE` at all**. The new one is deliberate about what it
does *not* claim, because overclaiming would be both wrong and self-defeating:

- **Not claimed** — the facts (hours, prices, closures, exhibition dates), the
  verbatim official brochure introductions reproduced in
  `data/facility-brochure.js`, third-party software, and OpenStreetMap data.
- **Claimed** — the selection and arrangement of the compilation (編集著作物,
  Copyright Act Article 12), the verification and provenance layer (PDF page
  locators, claim roles, source arbitration, `checked_at` metadata), the reviewed
  translations and editorial copy, and the application code.

The unofficial disclaimer is stated before any right is asserted, and a test pins
that ordering.

`robots.txt` disallows `/data/` and blocks the known machine-learning training
crawlers. It costs visitors nothing — the browser and Service Worker ignore
`robots.txt` — and the pages themselves stay indexable. A blanket
`User-agent: * / Disallow: /` is explicitly rejected by a test.

The same statement is shown to readers, in Japanese, English and Chinese, inside
the footer's *Data & sources* disclosure, next to the sources it concerns.

### Deliberately not done

- **Obfuscating or minifying the data.** It requires a build step, contradicting
  the project's buildless architecture, and is reversed in minutes.
- **Putting the data behind an API.** It would break the offline PWA, which is a
  core feature, in exchange for slowing a copier down.
- **Salting the data with canary records.** People use this guide to decide where
  to travel; deliberately wrong entries would harm them. The set is already
  distinctive enough to identify — the combination of per-facility page locators
  and dated verification metadata exists nowhere else.

### Verification

`npm test` 279 passing, `npm run validate` 0 ERROR / 0 WARN, `npm run test:release`
150 E2E passing.

---

## 2026-08-16 — Provenance as a Flat List of Peers (v103)

v102 removed the inner disclosure from Pass provenance but kept its shape: a
promoted **Primary source** with its own *Open source* action, then a labelled
*Other official sources* group whose entries were linked by their titles. Review
found three problems with that shape, and they compound.

### Ranking misdescribes the data

The records typically support **different claims**, not the same claim at
different strengths. A real No.26 case reads:

```
「ぐるっとパス2026」参加施設・対象の展覧会情報   Eligible exhibition & dates · p.6
「ぐるっとパス2026」パンフレット                 Base benefit · p.11
```

One carries the base benefit; the other carries the eligible exhibition and its
dates. Calling the first "primary" and the second "other" tells the reader the
second is a lesser version of the first, when it is the evidence for a different
statement. The per-record `claim_role` already says what each one backs — that is
the honest form of the distinction, and it is now the only one shown.

### The interaction was inconsistent

The promoted record was opened through a separate *Open source* link while every
other record was opened by clicking its title. Two affordances for one action, on
the same list.

### The grouping was one level too many

The outer 「公式情報に基づく」 disclosure already gates the whole block, and a reader
who opens it has said "show me which official documents were used". Splitting the
answer into a headline and a remainder adds structure without adding an answer.

### What ships

One flat `<ul>`, every entry rendered by the same branch:

```
ⓘ Based on official sources
  「ぐるっとパス2026」参加施設・対象の展覧会情報 ↗
  Eligible exhibition & dates · p.6
  Published Mar 1, 2026 · Checked Aug 16, 2026

  「ぐるっとパス2026」パンフレット ↗
  Base benefit · p.11
  Published Mar 1, 2026 · Checked Aug 14, 2026
```

Each entry prints two meta lines because they answer two different questions:
what the document supports (claim role + the page carrying it), and how current
it is (published / checked).

**Preserved from v98:** an entry with no openable URL still renders as plain text
rather than borrowing a neighbour's href — no link is better than a link to a
different document. Ordering is also unchanged: the claim-relevant document
resolved by `resolvePassProvenance` still leads the list and still carries
`data-pass-provenance-title`. That marker now states a position, not a rank.

**Preserved from v97:** the outer disclosure stays. It is what keeps evidence from
reading as a call to action next to the Pass headline.

**Also fixed:** provenance dates were the last raw ISO strings on the page
(`公開 2026-07-29`). They now use the shared `formatUiDate`, like every other
date — `公開 2026年7月29日`, `Published Jul 29, 2026`.

`pass.provenancePrimary`, `pass.provenanceOtherLabel`, `pass.provenanceRaw` and
`pass.provenanceRawAria` are retired in all three languages, with a test
asserting they leave no dead keys behind.

### Verification

`npm test` 277 passing, `npm run validate` 0 ERROR / 0 WARN, `npm run test:release`
149 E2E passing.

---

## 2026-08-16 — Inspectable Provenance, an Offer Instead of an Assumption, and Location on the Map (v102)

Three review findings on the browse and evidence surfaces. Each turned out to
have a measurable or structural answer rather than a matter of taste.

### 1. Supporting sources are listed, not folded a second time

Pass provenance had two levels of disclosure: 「公式情報に基づく」 opened to reveal
a primary source and a 「その他の公式資料 N件」 summary that had to be opened again.

Counting the resolved model across all 108 facilities settled it:

| supporting documents | facilities |
| --- | --- |
| **1** | **104** |
| 2 | 3 (No.33, No.58, No.68) |
| 4 | 1 (No.100 そごう美術館) |

For 104 of 108 the inner disclosure hid **a single row** — a click that buys no
information from a reader who has already opened the outer one specifically to
inspect the evidence. The inner `<details>` is now a plain labelled list; the
deepest case on the page is five rows.

This **strengthens** the v98 rule rather than reversing it. v98 said "a count the
reader cannot expand has no trust value, so the number and the list ship together
or not at all"; the list now simply ships open.

The outer disclosure stays. It is what keeps provenance from competing visually
with the Pass headline — the v97 "Evidence does not automatically become a CTA"
boundary — and nothing about that changed.

Because the list is always visible, the label no longer carries a count, which
also removes an English plural defect: `{count} other official sources` rendered
as "1 other official source**s**" on 104 facilities. `pass.provenanceOther` is
retired in favour of `pass.provenanceOtherLabel`.

### 2. A chosen time offers the filter; it never applies it

Considered and **rejected**: automatically switching the opening-status filter to
「その時間に開館」 when a date and time are selected.

The reading behind the suggestion is often right — people do pick a time to ask
"what is open then". Auto-applying is still the wrong mechanism, for two reasons:

- **It is backwards.** The case where "now" is most certainly the intent is live
  mode — the app opened at 19:00 — and that deliberately does not filter.
  Choosing a date is usually planning a *day*, the weaker signal, and that is
  precisely the case that would start filtering.
- **It breaks day planning.** The time field still holds the current minute, so
  changing only the date to 8/20 would filter to "open at 15:30 on 8/20" and drop
  a morning-only facility from a plan the reader never asked to narrow.

Every card already shows its opening state for the selected time, so filtering
removes results rather than adding information. What ships instead is a
dismissible offer in the results bar — 「19:00 に開館している施設だけ表示」 — shown
only when the time is not live and the filter is not already on. Pressing it
applies the existing filter; dismissing it is remembered for the page session, so
a reader who has said no once is not asked again on every later time change.

### 3. Map view has its own entry to the one location state

The only way to reach location was the 「現在地を使う」 button **inside the filter
panel**, so a reader on the Map had to open a filter sheet to find themselves.

Moving the control was rejected: location feeds four things and three of them are
list-view features — the radius filter, the 近い順 sort, and the per-card straight
line distance — so relocating it would strand them behind a trip to the Map.

A locate control is added to the map frame instead, as a second **entry** to the
same state, not a second implementation. `userPos`, `geoState` and the permission
prompt all stay in `phase2/phase2-nearby.js`; the new `syncMapLocateButton()`
renders that state and is called from `refreshLocationUi()` and from every
transition inside `requestLocation()`, so the two buttons cannot disagree or ask
twice. With a position already granted the control re-centres rather than
re-prompting, and its accessible name changes accordingly. The filter-panel entry
stays exactly where it was.

**Correction to an earlier review note:** the map was described as never showing
the reader's own position. That was wrong — `updateMapMarkers()` has always drawn
a current-location dot with a 現在地 tooltip, and `map.locationUnset` already
reported an unset position in the map summary. The missing piece was only the
control, which is what this release adds.

### Verification

`npm test` 277 passing, `npm run validate` 0 ERROR / 0 WARN, `npm run test:release`
149 E2E passing (7 new: 3 for the offer in `tests/filter-state.e2e.spec.js`, 4 in
the new `tests/map-locate.e2e.spec.js`).

---

## 2026-08-16 — Filter State, One Personal Dimension, and an Honest "Open Now" (v101)

Three observations from real use of the browse controls. They are unrelated as
symptoms but all resolve in the same layer, so they ship together.

### 1. Filters no longer evaporate on reload

Visited, Want to Go and the language choice have always been persisted; the
filters were not, so every reload — and every PWA relaunch — reset the conditions
a user had just set.

Only **preference-like** conditions are now stored, under a versioned key
`grutto-pass:<year>:filters:v1`: 開館状況, パスの種類, マイリスト, お得度, 並び替え and
最新展覧会情報ありのみ. Three are excluded deliberately, because restoring them
would state something untrue:

- **the search box** — a one-off intent, not a preference;
- **現在地から (radius)** — meaningless without a live geolocation grant, which a
  reload does not carry over, so a restored radius would hide everything or
  nothing;
- **日付・時刻** — live mode is the designed default, and a restored stale date
  would present an earlier day's opening status as today's.

Persistence is safe here only because a restored state is **never silent**: any
active condition already renders the results summary and the 条件をすべてクリア
button, so "why are there so few facilities?" is answered on screen and
reversible in one click. That existing affordance is a precondition of this
change, not a coincidence.

Stored values are validated against the controls actually present rather than
trusted. An option renamed or retired by a later monthly release falls back to
the shipped default instead of stranding the UI in an unreachable state — and
近い順, which stays disabled until a location is granted, is never restored into
a dead sort.

**Rejected:** persisting the date and time "for convenience". The opening-status
layer is the product's core claim; a filter that silently reports a stale day's
hours is worse than one that resets.

### 2. Want to Go joins the personal-state group

「行きたい施設のみ」 was a toggle switch beside the data-quality toggle
「最新展覧会情報ありのみ」, while 訪問状態 was a separate radio group. Two controls
over one exclusive dimension produced a combination that can never return a
result: the v97 invariant is `visited === true ⇒ wantToGo === false`, so
**訪問済みのみ + 行きたい施設のみ was always empty**.

Because 行きたい is a strict subset of 未訪問, folding it in as a fourth radio
value loses no expressible filter:

```
マイリスト：  すべて / 未訪問のみ / 行きたいのみ / 訪問済みのみ
```

The group label moves from 訪問状態 to マイリスト, since a plan is not a visit
state; `filters.visitStatus` and `filters.visitStatusAria` are retired and a test
asserts they leave no dead keys behind. 最新展覧会情報ありのみ stays where it is —
it describes the data, not the reader.

This **refines** the v99 Want to Go release, which introduced the filter as a
standalone toggle. The collection-level browse CTA in My Pass still drives the
one filter state; only its address changed.

### 3. 「いま開館中」 never meant "now"

The filter matches `card.dataset.nowState`, which the status layer computes
against the **selected** date and time — not the present moment. With a time
explicitly picked, or a future date, both the label 「いま開館中」 and the ⓘ wording
「今日現在、開館中または…」 described something the filter does not do.

The label and the description now follow `isLiveTimeMode()`, the flag already
behind the 「15:30 時点の状況」 chip:

| mode | label | ⓘ |
| --- | --- | --- |
| live | いま開館中 | 「いま開館中」：今日現在、開館中または最終入館間近の施設 |
| a date/time chosen | その時間に開館 | 「その時間に開館」：選択した日時に開館中、または最終入館が近い施設 |

The active key is written back onto `data-i18n`, so a later language switch
re-translates whichever variant is showing rather than the one the markup
shipped with. A test asserts the selected-time copy never claims "today" in any
of the three languages.

**Not changed:** the filter's matching behavior. It already read the selected
date and time correctly — the copy was the only thing lying about it.

### Verification

`npm test` 274 passing, `npm run validate` 0 ERROR / 0 WARN, `npm run test:release`
141 E2E passing (9 new in `tests/filter-state.e2e.spec.js`).

---

## 2026-08-16 — Hours That Do Not Apply Every Day (v100)

From a real-device observation on No.71 東京都江戸東京博物館: the status line read
`最終入館 19:00・閉館 19:30` with nothing to say that 19:30 is a **Saturday**
figure. On weekdays the museum closes at 17:30 — two hours earlier — so a reader
planning a Wednesday evening visit would arrive to a closed building.

### Two cases, not one

- **Day-of-week hours — 17 facilities.** No.2 上野の森美術館 and No.3 国立西洋美術館
  close 17:00/17:30 normally but 20:00 on Fri/Sat; No.71 is 17:30 → 19:30 on
  Saturdays.
- **Dated specials — 2 facilities.** No.19 国立映画アーカイブ (last Friday of the
  month, 20:00) and No.71 (8/7, 8/14, 8/21, 8/28 → 21:00).

The evaluator already computed `is_special_hours` for the second case and **no UI
consumed it**; the first case had no flag at all.

### Not always "open later"

Some variant days are **shorter**: No.36-2 東京シティビュー closes at 17:00 on
Tuesdays against 22:00 otherwise (five hours earlier), and No.54 文化学園服飾博物館
closes 15:00 on Saturdays against 16:30. Wording is therefore neutral — "Saturdays
only", never "open late today" — and a test asserts the copy never implies an
extension.

### What changed

`getHoursFor()` now returns a `variant` descriptor: `{kind:'date', date}` for a
dated special, `{kind:'dow', dow}` for a weekday override **that actually differs
from the facility's ordinary hours**. A weekday that matches the default is not
flagged, so the qualifier stays rare enough to mean something.

It travels through `computeNowState` → `localizeNowState` → the status renderer,
and appears as a quiet qualifier on the existing time line — no new row, no
layout change on Card, Detail or Map:

```
開館中 · 最終入館 19:00・閉館 19:30（土曜のみ）
開館中 · 最終入館 20:30・閉館 21:00（8/14 限定）
開館中 · 最終入館 16:30・閉館 17:00（火曜のみ）   ← a SHORTER Tuesday
```

The copy is assembled once in `i18n/ui.js` (`hoursVariantNote()`); the renderer
only places it, and a guard asserts the renderer never reaches for the string
keys itself. `getFacilityOpeningState()` also exposes `hours_variant` alongside
`is_special_hours`, so the documented shared evaluator stays the single answer.

### Temporal semantics unchanged

No opening/closing time, last-admission rule, closure rule or filter behavior
moved. This surfaces a fact the evaluator already computed and then discarded.

### Tests

`test/opening-hours-evaluator.test.js` 9 → 14, `test/status-i18n.test.js` 4 → 7,
`tests/time-scoped-pass.e2e.spec.js` 10 → 14. Coverage: an ordinary weekday
carrying no qualifier; a Saturday override and a dated special carrying the right
one; shorter variant days flagged just as neutrally; a uniform-schedule facility
never qualified; the qualifier reaching Card and Detail alike; and JA/EN/ZH copy.

`sw.js` CACHE_VERSION → `grutto-pass-v100`; `test/offline-shell.test.js` synced.

---

## 2026-08-16 — Per-facility PDF Page Locators (v99)

Follow-up to v98, from a real-device report on No.26 科学技術館: its provenance
linked the whole 20-page brochure, leaving the reader to hunt for the one row
that backs the claim.

### The page data already existed

`data/facility-brochure.js` has carried `cards[key].sourcePage` for **108/108**
facilities all along — used only by the Facility Introduction's source link and
never visible to provenance. Verified against the PDF: `sourcePage` is a 1-based
**viewer** page (not a printed folio), and 102/108 were confirmed by matching the
facility name on that exact page. The 6 unconfirmed are names set as outlined
type that the text layer cannot see at all, not contradicted page numbers.

So this was a wiring gap, not missing data.

### Why nothing showed

v98 read pages from two places: the registry's `pdf_page` (removed in v98,
correctly — "p.1" is where the table starts, not where a facility is) and
`FACILITY_PASS_TIME_SCOPE.source_pages`, which covered **19 facilities and only
the exhibition PDF**. The brochure matched neither, so 89 facilities rendered no
page and no fragment.

### One locator layer

- `FACILITY_SOURCE_PAGES` in `data/facility-official-sources.js` now records the
  exhibition PDF page for **all 108 cards** (extracted from the document itself;
  No.36's two cards share one row, so they share a page).
- The brochure is **deliberately absent** from that table: its pages stay in
  `data/facility-brochure.js`, their existing home. One fact, one place.
- `getFacilitySourcePages()` is the only thing that joins them.
- `FACILITY_PASS_TIME_SCOPE.source_pages` and `getPassTimeScopeSourcePage()` were
  removed — they covered a subset of what the new table covers, and keeping both
  would have been a drift hazard.

A locator belongs to the **document**, so the provenance model applies it to
whichever source carries that document. Claim sources no longer attach pages
themselves, and both primary and supporting entries get cited at their own page.

No.26 now reads:

```
主な参照資料
「ぐるっとパス2026」パンフレット
基本特典 · p.9 · 公開 2026-03-01 · 確認 2026-08-14
↗ 原資料を見る                → brochure_2026_01.pdf#page=9

その他の公式資料 1件 ▾
  「ぐるっとパス2026」参加施設・対象の展覧会情報 ↗
  対象展・会期 · p.4 · 2026-02時点   → exhibition_2026_01.pdf#page=4
```

All 108 facilities now cite a page on every PDF source; a sweep asserts no
whole-document `.pdf` link survives anywhere in provenance.

### Revision guard

`SOURCE_PAGE_DOCUMENTS` records each document's `page_count` (exhibition 22,
brochure 20) and check date. Grutto republishes under the same URL, so a swap
would silently shift every locator; the validator now rejects a page past the end
of its document — the loudest symptom a static check can catch — plus orphan
facility keys, non-integer pages, and brochure pages exceeding the same count.

### Unchanged

Page numbers are still never derived from a facility number, a URL, or an array
index; a facility with no recorded page still renders no label and no fragment.
`#page=N` remains best-effort — several mobile viewers ignore it, and the
brochure is 12.3 MB, so the visible `p.N` label stays authoritative.

### Tests

`test/facility-official-sources.test.js` 31 → 37,
`tests/official-source-cta.e2e.spec.js` 13 → 15. Coverage: the two locator homes
joined without duplication; a page reaching a source as primary *and* as
supporting at its own value; all 108 cards covered and in range; every PDF
primary carrying a page (the No.26 regression); no fragment when nothing is
recorded; and a browser sweep for surviving whole-document PDF links.

`sw.js` CACHE_VERSION → `grutto-pass-v99`; `test/offline-shell.test.js` synced.

---

## 2026-08-16 — Pass Provenance Integrity + Inspectable Sources (v98)

A narrow corrective patch on v97's provenance disclosure, from real-device use.
Evidence still does not become a CTA — but once the reader *opens* the
disclosure, the evidence has to be genuinely checkable, and it was not.

### Provenance integrity

The displayed source title and the raw-source link were resolved through two
different lookups: the href came from arbitration, while the title came from a
separate URL-keyed reverse lookup into the time-scope source table. When a
document was not in that table the title fell back to a generic heading, so
**90 of 108 facilities showed "公式情報" above a link to a document that heading
never named** — and the structure permitted a true mismatch, one source titled
and another opened.

Every rendered field of a source — title, role, published/checked dates, page
references, and the href — now comes from **one atomic record** built by
`toProvenanceRecord()`. There is no second title lookup to drift from.

### No fallback to a different document

If the primary evidence has no openable URL, `原資料を見る` is omitted. It never
falls back to the brochure, a global PDF, or a CONFIG source. No link beats a
link that silently opens something else.

### Inspectable supporting sources

`ほか4件の公式資料` told the reader a number they could not act on. The disclosure
is now two levels: the primary source, then a collapsed
`その他の公式資料 N件 ▾` that enumerates each document with its title, its role,
its page references and its own link. **The count and the list ship together** —
if the sources cannot be enumerated, no count is shown.

Supporting entries render as a quiet vertical provenance list, not as N more
call-to-action buttons.

### Source count semantics

`N` counts unique claim-relevant **documents**, not raw registry records:

- deduped by normalized document identity (`…pdf` and `…pdf#page=12` are one
  document; a fragment is stripped before comparison);
- one document cited under several relations counts once, with its page
  references aggregated (`p.12・p.18`) rather than becoming two "sources";
- opening-hours, access, About, Introduction, homepage and unrelated context
  sources are excluded — this is claim provenance, not every official link known
  for the facility.

### Source roles

Each source carries a short, localized role — `基本特典`, `対象展・会期`,
`割引額`, `施設側確認`, `最新の対象展情報` — resolved from data a human declared
(`claim_role`, the time-scope role, then the relation). Internal vocabulary
(`entitlement_evidence`, `pass_confirmation`) is never shown to the reader; a
test asserts it never leaks into the UI.

### PDF page handling

Per-facility page locators were read off the exhibition PDF itself and recorded
in `data/facility-pass-time-scope.js` → `source_pages` (19 facilities, 1-based as
a PDF viewer numbers them). The old document-level `pdf_page: 1` was removed: page
1 is where the table begins, not where any given facility's entry is, so showing
it per facility was wrong.

- A known page renders as `p.N` **and** the link attempts `#page=N`.
- An unknown page renders nothing and adds no fragment. Page numbers are never
  derived from the facility number, the URL, or an array index.
- Deep links are built in one helper, `getSourceOpenUrl()`, which strips an
  existing fragment, preserves query strings, and refuses non-positive pages. The
  Facility Introduction's brochure link — the one other place a `#page=` fragment
  was hand-concatenated — now routes through it too.

### Mobile caveat

`#page=N` is honored by desktop PDF viewers and ignored by several mobile and
in-app ones, so it is **best-effort convenience only**. The visible `p.N` label is
what the reader can rely on and is never hidden because deep linking happened to
work in the test browser.

### Dates

`published_at`, `checked_at` and `snapshot_as_of` stay distinct. A checked date is
never dressed up as a publication date; a source with only a snapshot horizon
shows `2026年2月時点`, not a fabricated exact date.

### Tests

`test/facility-official-sources.test.js` 21 → 31,
`tests/official-source-cta.e2e.spec.js` 7 → 13. Coverage: primary atomicity;
no-fallback when the primary has no URL; document-vs-edge counting with
fragment/relation duplicates; page aggregation; exclusion of non-Pass sources;
deep-link construction against existing queries and fragments; `p.N` visible for
No.7 (p.1) and No.106 (p.22) and absent for a brochure-primary facility; the
supporting list enumerating every document with distinct accessible names; nested
disclosure by keyboard; vertical stacking with no overflow at 320–430px; and
JA/EN/ZH labels including the role strings.

## 2026-08-16 — Evidence Presentation Policy + Detail Return Context (v97)

v91–v96 built the evidence pipeline. This release adds the missing last stage:
deciding whether the user actually needs to see a link. It also fixes two
Want-to-Go faults that real use exposed — an asymmetric state rule and a lost
parent context — neither of which is a redesign of the feature.

### Evidence presentation policy

The pipeline is now explicit end to end:

```
Official Source Registry   → what official evidence do we have?
        ↓
claim arbitration          → which evidence supports the current fact?
        ↓
product fact               → what we tell the user
        ↓
presentation policy        → does the user need a link at all?
        ├─ provenance disclosure   (how do you know?)
        └─ actionable CTA          (only with a real next step)
```

`source exists → render CTA` is retired. A record becomes a visible, actionable
CTA only when **all** of these hold: it is relevant to the exact content shown;
the destination adds information the product facts have not already given; it
supports a concrete next task; it does not duplicate another visible
destination; and its label truthfully describes what the destination can do.
Failing any one, it stays provenance — recorded and inspectable, not a permanent
navigation row.

### Pass presentation

- **Entitlement evidence is no longer a CTA.** The brochure, the exhibition PDF
  and later Grutto updates are the basis for facts the section already states;
  making the reader open a multi-page PDF to understand our own conclusion was
  never a next step.
- **`ⓘ 公式情報に基づく`** — a collapsed `<details>` disclosure naming the source,
  its snapshot date, PDF page where known, the checked date, and how many other
  sources contributed. It exposes **at most one** raw-source destination.
- **Which source that is reuses the existing claim arbitration**, not "newest" and
  not "prefer the PDF": when admission is time-scoped, the confirmed window
  covering the selected date supplies its own `source_ref`, so そごう美術館 in
  August cites the 2026-07-29 update rather than the February snapshot.
- **At most one actionable Pass link**, and only for a facility page that carries
  real Grutto instructions (`pass_confirmation`, or the new explicit
  `provides_pass_guidance` opt-in for a redemption/reservation page).
- **`対象展を公式サイトで確認` is removed.** A `context_confirmation` page says
  nothing about the Pass by definition, so that label promised a verification the
  destination could not perform. There is no fallback: no honest link is better
  than a misleading one. The i18n key was deleted rather than left dangling.

### Exhibition link dedupe

Exhibition destinations are now typed, per URL and human-declared — never guessed
from a pathname (`data/exhibition-links.js` → `EXHIBITION_LINK_TYPES`, with the
Official Source Registry's own `page_type` consulted first):

- **exact** — a page about this one exhibition; the title carries the link.
- **listing** — the facility's "what's on" index. The title must not link to it,
  because a title link promises a page about that exhibition; it is hoisted to
  one section-level CTA instead.
- **homepage-only** — no title link, no section CTA. The Header globe owns it.

Within one Exhibition section a normalized URL now renders **once**: a section CTA
whose URL a title link already reaches is dropped. When a listing coexists with
exact title links it is a genuinely different task, so it is labelled
`すべての展覧会を見る / View all exhibitions / 查看全部展览` instead of the ambiguous
`展覧会情報` — that wording is reserved for a listing that is the only destination.

### 東洋文庫 regression

The Pass section no longer offers `https://www.toyo-bunko.or.jp/museum/exhibition/`
as "check the eligible exhibition officially": the page contains no Grutto
information and cannot confirm eligibility. The Pass facts stay visible and the
Grutto evidence stays in provenance. The exhibition title keeps its exact page
(`museum-exhibition/2631/`, verified 2026-08-16), and the listing survives once,
as `すべての展覧会を見る`.

### Want-to-Go state invariant

`visited === true ⇒ wantToGo === false` is now **symmetric**. v95 enforced it only
on Want → Visited; Visited → Want silently produced an invalid pair that every
surface then had to cope with.

- Enforced in the single state layer (`setWantToGo`), not in click handlers, so
  no path — button, toggle, or direct call — can produce it.
- The Want affordance is **hidden** on a visited facility rather than left visible
  and silently inert. Want to go is a plan for a future visit.
- Legacy storage holding both is normalized on load **and re-persisted**, so the
  invalid state cannot outlive one page load.
- Unchanged: un-visiting never resurrects the plan (`visited=false, want=false`);
  the Want action simply becomes available again.

### Detail return context

Opening a Facility from the My Pass Want list is *nested* navigation: the opener
lives inside a surface that had to be hidden to show Detail, so plain focus
restoration landed on a detached node and dumped the user back in Browse having
lost their list.

A minimal origin record (`surface`, `tab`, `scrollTop`, `facilityKey`, invoker) —
not a router — now reinstates the parent. Closing via X, Escape, or the backdrop
all route through `closeFacilityDetail`, so they share the semantics:

- Browse → Detail → Close returns to Browse (unchanged).
- Map → Detail → Close returns to the Map (unchanged).
- Pass Tracker Want → Detail → Close reopens the tracker **as a restore**: the tab
  is forced, so `chooseDefaultPassTab()` never runs on the way back and the user
  is not silently moved to Visited because more facilities are visited than saved.
- Tracker scroll position is restored; focus returns to the originating row,
  looked up by facility key because the list re-renders. If that facility left the
  list (it was just marked visited) focus falls back to a surviving row, then to
  the close button — never to a node that is gone. If Want emptied, the existing
  tab-transition rule still applies.

### Want-to-Go feedback

Reuses the existing `showToast`; no second snackbar component.

- Saving (`false → true`) shows `「行きたい」に追加しました` with a
  `行きたいを見る` action. It matters most on the Card, where a bookmark icon alone
  never says where the collection lives. The action opens My Pass **on the Want
  tab** — an explicit user action owns its destination.
- Removal stays silent: the bookmark state change is feedback enough.
- Want → Visited shows `訪問済みに記録し、「行きたい」から削除しました`, so the
  disappearing plan reads as designed rather than as a bug. Only one toast fires;
  the nested `setWantToGo` is suppressed.

### Want-list opening summary

Rows now carry the shared status *reason* line (`最終入館 16:30・閉館 17:00`) under
the badge, taken **verbatim** from the Card's rendered `.status-reason-hours` —
the same `getFacilityOpeningState` output, projected, not re-derived. No
`getWantListOpeningState`, no second hours engine, no re-parsing; a test asserts
the list text is character-identical to the Card's.

### Tests

`test/want-to-go.test.js` 7 → 12, `test/exhibition-links.test.js` 5 → 9,
`test/facility-official-sources.test.js` → 21,
`tests/want-to-go.e2e.spec.js` 15 → 28,
`tests/official-source-cta.e2e.spec.js` 6 → 7,
`tests/time-scoped-pass.e2e.spec.js` 7 → 10. Coverage includes: evidence without
a CTA; a museum page never offered as Pass verification; exact-vs-listing title
behavior; same-URL dedupe; every ordering of the two state setters; legacy
normalization; return-to-tracker for X and Escape; scroll and focus restoration
including the facility-left-the-list case; toast strings in JA/EN/ZH; and
keyboard operability of the disclosure.

## 2026-08-16 — Pass Source Arbitration + Contextual CTA Wiring (v96)

A correction release, not a new feature. Real use surfaced a false negative:
そごう美術館 showed 対象展 未確認 and dropped out of the free-admission filter for the
whole summer, while official Grutto sources said the Pass admitted you for free.
The architecture built in v91–v95 is kept; what changed is the **semantics of the
source data** and the way sources are arbitrated.

### Root cause

v92 treated the Grutto exhibition PDF as a *time-scoping authority*: the last
exhibition listed under a facility ended that facility's entitlement. Three
different claims live in that document, and only one of them is an eligibility
boundary:

| Claim | Example | Boundary? |
| --- | --- | --- |
| facility entitlement baseline | `企画展入場` | No — says *what* the Pass grants, no dates. |
| exhibition information snapshot | `KAGAYA 天空の歌 4/11(土)～5/31(日)` | No — that is the exhibition's 会期. |
| explicit eligibility boundary | `※対象展覧会開催期間は7/23～10/7です。` | **Yes.** |

v92 conflated the second with the third. The PDF even declares its own horizon —
*「4月～9月までの「ぐるっとパス2026」対象の展覧会情報です。(2026年2月現在)」* — so the
misreading turned an admittedly incomplete snapshot into a hard expiry.

### New rule — supersedes the v92 "Rules locked" section below

> The Grutto exhibition PDF remains authoritative evidence, but a listed
> exhibition end date is **not** an entitlement end date unless official wording
> explicitly scopes eligibility. Later official Grutto updates may supplement
> older snapshots.

The v92 entry is left intact as the historical record of what was decided then;
this release explicitly refines it. Arbitration is now **per claim**, never a
global file ranking: authority and semantic relevance to the exact claim, then
scope specificity, then publication recency **only between sources speaking to
the same claim**, plus explicit supersession / non-exhaustiveness wording.
Consequences, both of which v92 got wrong:

- An official Grutto blog post is **not** demoted for being a blog. When it says
  `一般料金：1,400円がパスだけで入場できます`, it is entitlement evidence.
- The exhibition PDF is **not** a permanent top authority, and a newer source
  that says nothing about a facility never removes that facility's evidence.

### Canonical correction — No.100 そごう美術館

`企画展入場` + `KAGAYA 天空の歌 4/11～5/31` +
`※以降の展覧会の会期および詳細は決まり次第そごう美術館HPに掲載いたしますので、ご確認ください。`
5/31 is KAGAYA's end, not the entitlement's. The later official Grutto updates
([2026-06-26](https://www.rekibun.or.jp/grutto/blog/20260626-6804/),
[2026-07-29](https://www.rekibun.or.jp/grutto/blog/20260729-6866/)) confirm 葉山有樹
(6/6–7/17), OSAMU GOODS展 (8/1–8/31) and 鈴木信太郎 (9/12–10/12) with
`パスだけで入場できます`. **2026-08-15 and 2026-09-20 are now `available`.**

The facility's own pages were read and kept in their own roles: `ticket.jsp`
(「東京・ミュージアム ぐるっとパス2026」もご利用可能です) is `pass_confirmation`; the
exhibition pages name no Pass at all and are `context_confirmation` with
`confirms_pass_entitlement: false` — never independent Pass proof.

### Contrast — No.7 東京都美術館

No.7 is **not** relaxed. Its entry carries `※対象展覧会開催期間は7/23～10/7です。` —
the source scopes the entitlement itself — so 10/7 remains a real boundary and
2026-10-08 stays `unconfirmed`. No.83 (`※ぐるっとパス対象企画展期間は5/30～8/2です。`)
and No.40 (`展覧会入場(下記の展覧会のみ対象)`, an explicit closed set) are the same
kind of record. The two cases are locked against each other in the test suite.

### Added

- `entitlement_mode` (`explicit_period` / `enumerated_exhibitions` /
  `eligible_exhibitions` / `awaiting_schedule`), `entitlement_baseline`,
  `schedule_is_exhaustive`, and quoted `boundary_wording` /
  `non_exhaustive_wording` on every time-scope record — so the data says which
  of the three claims it encodes instead of leaving it to the reader.
- `FACILITY_PASS_TIME_SCOPE_SOURCES` with per-window `source_ref` /
  `corroborated_by` / `supersedes`: provenance now survives **per fact**, not per
  file, which is what makes "this window came from a later update" checkable.
- `getPassAdmissionMergedWindows()` / `getPassAdmissionActiveWindow()`.
- Internal correction records were derived from the production layer, never
  used as a source of runtime entitlement behavior.

### Changed — production data

Re-audited only the 19 records already in the time-scoped layer; no new
108-facility research. **3 CORRECT, 11 MISCLASSIFIED_SCOPE, 2 STALE_SOURCE,
2 MISSING_NEWER_UPDATE, 1 NEEDS_REVIEW.** Four records changed windows:

- **No.100 そごう美術館** — `MISSING_NEWER_UPDATE`: 1 window → 4.
- **No.58 ICC** — `MISSING_NEWER_UPDATE`: the snapshot deferred the schedule to
  the venue, so it had *zero* windows and could never be available. The
  2026-07-29 update names ICC アニュアル 2026 (6/20–11/8); `needs_review` →
  `deterministic`.
- **No.33 大倉集古館** — `STALE_SOURCE`: 祈りと救いの美 end 10/12 → 9/27 (later Grutto
  update and the museum's own schedule agree).
- **No.68 東洋文庫ミュージアム** — `STALE_SOURCE`: 「怖い」本 start 5/29 → 6/3.

The 11 `MISCLASSIFIED_SCOPE` records keep their dates; what changed is that they
no longer *mean* an entitlement boundary, and a later update may extend them.
The internal time-scope audit was marked superseded rather than rewritten.

### Changed — Source Registry and contextual CTAs

- Optional `source_scope` (`edition` / `facility`), `published_at`, `supersedes`
  on source records, and `pickBestSource()` arbitration inside the already
  relation-filtered candidate set. The Pass CTA is no longer nailed to the oldest
  registered PDF; a facility-scoped, newer entitlement source wins for that
  facility, while a zoo with no facility records still gets the edition brochure.
- The Pass section is capped at **two** links: Grutto evidence plus one
  facility-side link. The exhibition context link is now a **fallback** for a
  missing `pass_confirmation`, not an addition to it — arbitrating between
  sources is not the same as showing the user all of them.
- Exhibitions gained a section-level CTA resolved from the registry (specific
  exhibition page preferred over a listing; a homepage never fills it in).
  Per-item links still come from `data/exhibition-links.js`, unchanged.
- Opening Hours wiring was already correct and is left alone, now with the
  precedence documented and locked by test: the registry's `operational_source`
  always wins; the homepage fallback only fires while
  `needsHeaderVerification` is set, i.e. the app cannot determine the state and
  the status copy has just told the user to verify officially.
- Detail Header globe still owns the canonical homepage. Unchanged.

### Changed — Want to Go polish

- Number column: every `.my-pass-want-item` was its own grid with a `max-content`
  first column, so `No. 3` and `No. 107` sized independently and facility names
  started at different x positions. Both collection lists now share one
  `--my-pass-number-width` tabular identity column.
- The Want-list facility name is still a real `<button>` (keyboard / AT), but the
  native control chrome is now fully reset — it was rendering as a grey UA button
  rectangle.
- New low-weight collection action `一覧・地図で見る / View in list / map /
  在列表 / 地图中查看`: closes My Pass, ticks the **existing** "Want to go only"
  filter (no second filter state), preserves the current List/Map mode, and moves
  focus to the results surface. A row still inspects one facility; the collection
  CTA browses the whole saved set — the two tasks stay separate.
- `pass.periodSeparator`: the Detail 対象期間 label showed earliest→latest, so
  four separated exhibitions read as one continuous 4/11–10/12. Confirmed windows
  are now merged only where they actually overlap.

### Validators

`scripts/validate-data.js` now rejects: an unknown `entitlement_mode`;
`schedule_is_exhaustive: true` without quoted `boundary_wording`; a time-scoped
record with no `entitlement_baseline`; a window with a missing or unregistered
`source_ref` / `corroborated_by` / `supersedes`; duplicate windows; a malformed
`published_at` or `source_scope`; duplicate URLs within one facility's records;
an empty record array; and `context_confirmation` claiming
`confirms_pass_entitlement: true`.

### Tests

`test/facility-pass-time-scope.test.js` 8 → 17,
`test/facility-official-sources.test.js` → 21,
`tests/time-scoped-pass.e2e.spec.js` 3 → 7,
`tests/want-to-go.e2e.spec.js` 8 → 15. Coverage includes: SOGO 8/15 and 9/20
available; the No.7 boundary preserved; newer relevant evidence winning while a
newer *unrelated* source does not; a blog not demoted for being a blog; the
two-link Pass cap; name-column alignment measured at 320–1440px; and no native
button chrome.

## 2026-08-16 — Want to Go / 行きたい / 想去 (v95)

A planning-intent personal collection, distinct from the visited history. Users
save places they want to visit later and see them in My Grutto Pass, on the Card,
and through a "Want to go only" filter — without ever affecting Pass reference
value, break-even, or any monetary math.

### Added

- Want-to-go state layer next to the visited layer (`isWantToGo` / `setWantToGo`
  / `toggleWantToGo`), with a separate versioned `wantToGo` storage key so an
  existing visited-only install keeps working untouched. Stale/non-string keys
  are ignored and a missing key defaults empty.
- Card bookmark action (outline→filled, `aria-pressed`, ≥44px, independent of the
  Card → Detail click) in the Card header.
- Detail personal-action region (`[行きたい] [行った]`) at the top of Detail,
  cloned through the single shared Detail renderer (Drawer + desktop Map).
- My Grutto Pass tabs (`[行きたい n] [訪問済み m]`) with a deterministic default:
  Want to go when it has items, else Visited when it has items, else the
  Want-to-go empty state.
- Want-to-go list items (No. / name / area / opening status / remove bookmark)
  and a localized empty state.
- "Want to go only" filter in the full Filter & Sort panel (not in Quick Filters),
  consuming the existing filter engine and `window.filteredCards`.
- `test/want-to-go.test.js` (7 state-transition & persistence tests) and
  `tests/want-to-go.e2e.spec.js` (8 cross-surface / filter / responsive tests).

### Changed

- `setVisited(true)` now clears the planning intent through the single transition
  layer; un-visiting never restores it (`visited=true` and `wantToGo=true` are
  mutually exclusive).
- Compact My Pass summary now reads `行きたい 8 · 訪問済み 11` alongside the
  existing reference-value / estimate line (Want to Go never enters the amount).
- `updateStatuses` dispatches `status-updated` so the Want-to-go list keeps its
  per-item opening status fresh (date/time change, minute tick).
- `sw.js` CACHE_VERSION → `grutto-pass-v95`; `test/offline-shell.test.js` synced.

## 2026-08-15 — Facility Introduction V2: Decision-value Audit (v94)

Audited all 109 venue-level introductions for decision value (does it answer
"what is there to see?" and "why is this one different?"), not for style. Only
entries with a real decision-value gap were re-researched and rewritten;
everything else was left untouched.

### Added

- The approved production projection follows a facts-first editorial pipeline:
  official About / Collection facts → selected decision facts → independent
  composition. The internal editorial record retains generation details.
- The internal editorial record retains the 109-record classification,
  rationale, provenance and source-comparison evidence.
- `test/facility-introduction-v2.test.js` (7 tests): coverage, JA/EN/ZH
  presence, length bounds, no operational duplication, no marketing language,
  provenance completeness for researched records, and a longest-common-substring
  similarity guard against source excerpts.

### Changed

- `data/facility-summaries.js` — regenerated from the V2 audit. Classification:
  **94 KEEP, 8 GOOD_BUT_POLISH, 2 ENRICH, 5 REPLACE** (7 actually researched).
  No.50 世田谷文学館 graduated from `needs_review` to an approved, source-backed
  introduction.
- `data/facility-official-sources.js` — added `editorial_fact_source` records
  (internal provenance, never a UI CTA) for the 7 researched facilities:
  No.2, 33, 37, 48, 50, 83, 96.
- `test/facility-summary-production.test.js` — now reads the V2 review file and
  expects the 109-record approved subset (No.50 included).
- `sw.js` CACHE_VERSION → `grutto-pass-v94`; `test/offline-shell.test.js` synced.

## 2026-08-15 — Opening Hours Semantics Audit & Official Verification (v93)

Phase 1 (internal data audit) + Phase 2 (official verification), without an
indiscriminate 108-site crawl.

### Added

- `getFacilityOpeningState(facility, datetime)` — one shared evaluator
  (`phase1/phase1-open-now.js`) returning `status | time_state | opens_at |
  closes_at | last_admission_at | source_rule_type | is_special_hours |
  confidence`, wrapping `checkStatus` (date) + `getHoursFor` (time) so
  Card / Detail / Map / Filter no longer compute independently.
- Internal opening-hours records retain the per-facility rule taxonomy,
  confidence, risk assessment and official-source verification.
- `test/opening-hours-evaluator.test.js` (9 tests).

### Changed

- Verified + migrated the two canonical cases against their official pages:
  - No.40 東京都写真美術館 (`topmuseum.jp/guide/`): regular 10:00–18:00, Thu/Fri
    20:00, last 30 min. The 2026 summer extension is **not** on the official page
    (only the historical 2025 21:00 extension), so none was encoded.
  - No.71 東京都江戸東京博物館 (`edo-tokyo-museum.or.jp/information/hours/`):
    added Saturday 9:30–19:30 and explicit special dates Aug 7/14/21/28 (Fri) →
    21:00, last 30 min.
- Registered both as `operational_source` / `page_type=opening_hours` in the
  shared source registry; the status "check opening info" CTA now prefers the
  precise hours page over the homepage.

### Coverage

108/108 have runtime-supported hours; 2/108 officially verified (remainder
explicit `MANUAL_REVIEW`, no guessed data). HIGH unresolved: 11.

---

## 2026-08-15 — Time-scoped Pass Entitlement Audit & Runtime Migration (v92)

Separates the entitlement fact ("what the Pass grants") from availability ("is it
usable on the selected date"). Primary source is the Grutto Pass 2026
eligible-exhibition PDF (`exhibition_2026_01.pdf`, snapshot "2026年2月現在",
coverage "4月～9月まで").

### Added

- `data/facility-pass-time-scope.js` — the runtime time-scope data and
  `resolvePassAdmissionAvailability(scope, dateStr)` →
  `available | upcoming | inactive_ended | unconfirmed | none_confirmed`
  (default `persistent`). 19 facilities have time-scoped free admission; No.7
  東京都美術館 is the calibration (named exhibition この場所の風景, 7/23–10/7).
- Free-admission filter now gates time-scoped admission on
  `availability === available`; persistent admission is unchanged.
- Card browse headline shows `対象展 入場無料` / `対象展は{from}から` /
  `対象展 未確認` for time-scoped admission, updated on date change.
- Detail adds a `対象期間 from–to` block plus, after a known window,
  `現在の対象展は未確認 / 掲載されている対象展は{to}に終了しました`.
- Registered the exhibition PDF as a global `entitlement_evidence` source with
  `snapshot_as_of`, `coverage_label`, `pdf_page`.
- Internal time-scope records retain classification, coverage and risk evidence.
- `test/facility-pass-time-scope.test.js` (8 tests) and
  `tests/time-scoped-pass.e2e.spec.js` (3 tests).

### Rules locked

- PDF silence after September ≠ no eligible exhibition: a facility whose last
  known window has ended is `unconfirmed`, never "no exhibition".
- The existing `facility-pass-benefits.js` scopes were audited and are not the
  time-scoping authority — the PDF is (several scopes disagreed with the
  admission label).

### Remaining manual review

- No.34 智美術館 and No.58 ICC carry empty windows (`needs_review` → `unconfirmed`).
- Facility `pass_confirmation` / `context_confirmation` records are deferred
  (require reading the facility page; not fabricated from the PDF URL).

---

## 2026-08-15 — Official Source Registry & Contextual CTA ownership (v91)

Foundation task. Establishes one shared semantic model for "why a URL exists" on
a facility card, and makes the Detail Header own the canonical homepage while
contextual sections (Pass / Exhibitions / Opening Hours) only link precisely
classified sources. No 108-facility website research was done in this pass; the
per-facility data population is deferred to the Time-scoped Pass, Opening Hours,
and Facility Introduction audits.

### Added

- `data/facility-official-sources.js` — the single source registry: frozen
  `authority` / `page_type` / `relation` / `confidence` vocabularies, a global
  Grutto Pass `entitlement_evidence` source (the official brochure), a sparse
  facility-specific table, URL normalization / dedupe, and the
  `resolveContextualCtas` resolver (pure over a source list for testability).
- Detail Header globe (`syncFacilityHomepageAction`): an independent sibling
  action (never inside the `h2`) that opens the canonical homepage. 18–20px
  globe icon, ≥44×44px hit target, `aria-hidden` icon, localized accessible name
  (`facility.openHomepage`). Rendered in both the Facility Drawer and the desktop
  Map Detail header; no empty button when a homepage is absent.
- Pass section contextual CTA: `ぐるっとパス公式資料` (Grutto Pass official
  source), driven only by the classified `entitlement_evidence` record.
- `docs/design/official-source-cta-ownership.md` — the long-term spec.
- `test/facility-official-sources.test.js` (13 unit tests) and
  `tests/official-source-cta.e2e.spec.js` (6 e2e tests).
- `scripts/validate-data.js` now validates every source record's shape and
  vocabulary.

### Changed

- Contact section no longer emits the header-owned homepage URL (normalized
  comparison); telephone and genuinely distinct inquiry / reservation URLs
  remain. The legacy contextual "check official site" CTAs are retained as a
  compatibility adapter pending the Opening Hours audit.
- `sw.js` precaches the new registry and bumps `CACHE_VERSION` to `v91`.

### Not done (by design)

- No per-facility `pass_confirmation`, `opening_hours`, or
  `editorial_fact_source` records were inferred — URLs with uncertain meaning are
  left `unclassified` / `needs_review` rather than guessed from a URL string.

---

## 2026-08-14f — Facility name presentation & multilingual typography cleanup (v90)

EN/ZH cards mechanically appended the Japanese original name whenever the
localized string differed from the source. On the Chinese page this produced
near-duplicate second lines (东京都美术馆 / 東京都美術館), and the Japanese
secondary line inherited the active locale's serif stack (Georgia in EN,
Songti SC in ZH), producing inconsistent glyph fallback. This pass unifies the
title presentation instead of adding per-surface name logic.

### Changed

- Added one `getFacilityTitlePresentation(f)` helper in `i18n/ui.js`
  (exported as `window.getFacilityTitlePresentation`) and made the List card,
  Facility Drawer, and desktop Map Detail panel all consume it:
  - **JA**: only the official Japanese name (no second line).
  - **EN**: localized English name as primary, Japanese official name as the
    secondary line.
  - **ZH**: localized Chinese name as primary; the Japanese name repeats only
    when it contains non-Han identifying information (kana or Latin) or an
    overlay sets `showJapaneseName: true`. No fragile string-similarity
    heuristics.
- The secondary Japanese name now renders with `lang="ja"` in both the card
  source and the Drawer/Map clone.
- Added `--font-sans-ja` / `--font-serif-ja` tokens; `.original-name` now uses
  `--font-sans-ja` instead of `font-family: inherit`, with a slightly larger
  top margin, so the Japanese secondary line no longer falls back through the
  locale's serif stack.
- Title-cased 22 `nameEn`/`name_en` entries that were stored in ALL CAPS
  (e.g. `MINATO CITY LOCAL HISTORY MUSEUM` → `Minato City Local History
  Museum`) in `data/facility-brochure.js` and
  the official brochure fact layer. `WHAT MUSEUM` was left unchanged as a
  genuine Latin brand name.

## 2026-08-14e — Chinese facility-name overrides for English-fallback titles (v89)

A Chinese-page audit found 13 facilities whose localized title fell through to
the official brochure `nameEn` because the generic Japanese→Chinese name
conversion left kana behind (e.g. の, カメラ, ちひろ, たてもの). The Chinese page
then showed an English title — the wrong fallback for a Chinese reader.

### Root cause

`chineseFacilityName()` consults the reviewed overlay, a Chinese search alias,
then a fixed kana/hanzi replacement table. When a name still contains kana
after that pass it falls back to `englishFacilityName()`, which prefers
`nameEn` (No.79 → `Yumenoshima Tropical Greenhouse Dome`). The generic table is
a last resort for proper names, not an exhaustive translation layer.

### Changed

- Added explicit Chinese `name` overrides in `data/i18n/facilities.zh.js` for
  No.17, 24, 29, 46, 60, 63, 64, 69, 70, 79, 82, 89 and 91:
  - 17 ミュゼ浜口陽三・ヤマサコレクション → 滨口阳三·山佐收藏美术馆
  - 24 日本カメラ博物館 → 日本相机博物馆
  - 29 お茶の文化創造博物館 → 茶文化创造博物馆
  - 46 郷さくら美術館 → 乡樱花美术馆
  - 60 ちひろ美術館・東京 → 千寻美术馆·东京
  - 63 古代オリエント博物館 → 古代东方博物馆
  - 64 紙の博物館 → 纸博物馆
  - 69 たばこと塩の博物館 → 烟草与盐博物馆
  - 70 すみだ北斎美術館 → 墨田北斋美术馆
  - 79 夢の島熱帯植物館 → 梦之岛热带植物馆
  - 82 井の頭自然文化園 → 井之头自然文化园
  - 89 府中市郷土の森博物館 → 府中市乡土之森博物馆
  - 91 江戸東京たてもの園 → 江户东京建筑园

## 2026-08-14d — RC1.1 real-device fixes (v88)

RC1 passed the automated release gate, then a real-iPhone pass found a set of
defects the gate did not cover. This is a convergence release: it fixes those
findings, keeps the Phase 1–3 / RC1 architecture and data semantics frozen, and
produces a candidate ready for another real-iPhone verification. No Phase 4
work and no re-design.

### Root causes confirmed

- **Body scroll-lock leak (Footer "freeze").** Four independent surfaces
  (`my-pass-open`, `drawer-open`, `filters-open`, `datetime-open`) each
  toggled `overflow:hidden` on the body. A stale class after a close left the
  page unable to scroll past the Footer, which looked like a fixed Footer even
  though the Footer owns no fixed styling.
- **Drawer scroll session.** `openFacilityDetail()` re-populated the reused
  `#facilityDrawerBody` scroll container without resetting it, and the
  language-change path re-called `openFacilityDetail()`, so facility B began
  at A's scroll position and a language switch read as a reopen.
- **My Pass compact wording.** The full Drawer had already moved to the
  reference-value model, but the compact chip reused the long-form keys and
  showed no estimate confidence; on the device the entry could read like an
  actual-savings claim.
- **My Pass validity.** The Drawer header printed `CONFIG.passEnd` as
  最終利用日 / "until", i.e. an edition boundary posed as a personal expiry. No
  first-use date exists, so no personal expiry can be computed.
- **Clipped status help.** The 開館状況 help was an absolute `.info-popover`
  inside `.filters-panel-inner`, whose overflow/clipping boundaries truncated
  the bubble differently at every scroll position.
- **Filter / List-Map ambiguity.** The Filter glyph was three stacked lines
  (≈ the List icon), and the view switch had lost its shared segmented
  container, so two 44px squares read as the same role.
- **Exhibition green-line gap.** The exhibition title's visible
  `padding-top/bottom: 11.5px` pushed the text below the green border-left,
  leaving a blank green run above the title.
- **Meaningless note.** `renderVisitInfoRow()` had no placeholder
  suppression for the notes field, so a label-only value could render a
  high-weight warning row. (No.102's actual note is a genuine construction
  closure, so it is preserved.)
- **Hero separator.** The metadata separator was a painted 3×3px CSS circle,
  not a typographic character, so it sat off-baseline and asymmetric in JA/EN/ZH.

### Changed

- **Scroll lock (P0).** Added one derived owner, `syncBodyScrollLock()`,
  which toggles a single `body.scroll-locked` class from the actual open state
  of the four surfaces. The four per-surface classes remain as semantic state
  but no longer own overflow. The sync runs after every open/close, breakpoint
  and language transition. No `position:fixed`, no top-offset save/restore.
- **Drawer scroll session (P0).** `openFacilityDetail()` now resets
  `#facilityDrawerBody.scrollTop` only on a new session (drawer was closed, or
  the facility key changed); `refreshFacilityDrawer()` keeps the position, and
  the language-change handler calls `refreshFacilityDrawer()` instead of
  reopening.
- **My Pass compact (P0).** The compact summary now names estimate confidence
  (`pass.entrySummaryMixed` — 概算含む / incl. estimates / 含估算), and the
  compact right-side state uses short wording (`pass.matchesPassPrice` パス価格
  相当, `pass.remainingCompact` 参考価値であと{amount}) rather than the
  full-sentence keys. No surface claims saved / savings / paid off.
- **My Pass validity (P0).** The Drawer header now states the product rule
  (`pass.validityRule` 初回利用から2か月 / Valid for 2 months from first use /
  首次使用起2个月) and shows the edition final-use date only as an explicit
  edition-level secondary line (`pass.editionFinalUse`). No first-use date is
  inferred from Visited flags, the clock, or UI interaction.
- **Status help (P0).** The help became an inline `.status-info-help` block
  that sits in the filter panel's normal flow below the 開館状況 group, so the
  desktop panel and mobile sheet grow to fit it instead of clipping it.
  `aria-expanded` / `aria-controls` remain, Escape closes the innermost
  disclosure first (the help, not the sheet), closing the filter collapses the
  help, and reopening the filter starts collapsed.
- **Filter / List-Map (P1).** The Filter button uses a true funnel glyph, and
  List / Map restored a shared segmented group (ring + filled active tab +
  low-weight inactive) with a box-shadow ring so the compact toolbar keeps its
  one-row alignment and 44px targets.
- **Notes (P0/P1).** Added a label-only placeholder regex for the notes field;
  a suppressed placeholder renders nothing and does not mark the field for
  official verification, so it cannot alone trigger the contextual CTA. The
  two-role CTA architecture (contextual check vs Contact website) is unchanged.
- **Exhibition rhythm (P2).** Removed the visible title padding and moved the
  touch target to a transparent `::before` extension, matching the facility
  title's established pattern, so the green line aligns with the title text.
- **Hero separator (P2).** Replaced the painted circle with a real `·`
  interpunct that inherits the text font and baseline.
- **Area header (default).** Kept transparent + divider + typography; no
  background block, rounded container, or shadow was added.

### Why not

- No `body { position: fixed }` and no scroll-position save/restore: the
  reproduction and the four released suites confirm a single centralized
  overflow owner is enough.
- No personal activation tracking: `first_use_date` is still not stored, so
  no `min(first_use + 2 months, edition_end)` is computed.
- No hard-coded `facility === 102` suppression: the note rule is a general
  placeholder-only test, and No.102's genuine construction-closure note keeps
  rendering.
- No floating/portal help engine: the existing panel architecture allowed an
  inline disclosure, which is the simpler stable choice at RC.
- Area header: no change (not a release blocker; the existing boundary reads
  correctly at 390px).

### Tests

- `test/i18n.test.js`: compact My Pass copy asserts reference-value semantics
  and the validity rule across JA/EN/ZH with no savings or personal-expiry
  claims.
- `tests/rc11.e2e.spec.js` (new): overlay open/close scroll-lock sequences
  (Apply, backdrop, Done, drawer, My Pass, and cross-open ownership), Drawer
  new-session-vs-refresh scroll semantics, inline status help without clipping,
  meaningful-note suppression, and the compact Filter / List-Map distinction.
- Updated `test/offline-shell.test.js`, `test/layout.test.js` and
  `tests/release.e2e.spec.js` for the centralized scroll-lock owner, the
  typographic separator, and the My Pass header/compact wording.

---

## 2026-08-14c — Release Candidate hardening: legacy conditions & estimate risk (v87)

### Changed

- Audited all 108 facilities for use conditions that Phase 3's removal of the
  legacy `benefit_basis` / `pass_notes` paraphrase might have dropped. Result:
  100 REDUNDANT, 5 CONTRADICTS_SOURCE (legacy had over-stated a scope — kept
  removed), 3 UNIQUE_CONDITION, 0 unresolved. See
  the internal condition review.
- Re-homed the two source-backed conditions into the scoped model as verbatim
  `notes_ja`, shown as a low-weight line in the Detail Pass section: No.74
  「一部割引対象外の展示があります。」 (brochure price line) and No.36-2 森美術館
  「展覧会により割引対象外となる場合があります。」 (brochure note). No.87's legacy
  「通常時間内適用」 has no 2026 brochure source and stays removed.
- Risk-classified the 85 text-parsed legacy monetary fallbacks: 55 LOW_RISK keep
  the weakened 概算, 28 HIGH_RISK and 2 no-value show no yen estimate at all
  (entitlement still renders). HIGH_RISK values are also withheld from the
  reference-value layer, `data-regular-price` and My Pass so an unreliable
  figure never looks precise. The public risk classification remains in
  `data/facility-legacy-risk.js`.
- My Pass total now names its confidence: verified-only reads 参考価値の合計 /
  Total reference value / 参考价值合计; a mixed total (any low-risk estimate
  contributes) reads 参考価値の合計（概算を含む） / Total reference value
  (includes estimates) / 参考价值合计（含估算）.

### Why not

- No Phase 4: the 85 unverified prices were not manually re-priced, the legacy
  scalar fields and text-parsing fallbacks remain, and value filter/sort
  semantics are unchanged.
- No dead-i18n-key deletion. `pass.youSave`, `pass.valueTotal`, `pass.recovered`,
  `pass.chipProgress` and ten others are confirmed unreferenced, but cleanup is
  not a release blocker and was left for a later, non-release pass.

---

## 2026-08-14b — Pass Entitlement & Reference Value Presentation (v86)

### Changed

- Split the Pass section into the three layers the data model already had:
  the official entitlement wording, our structured reading of it, and the
  derived comparable value. Before this the three were fused into one sentence,
  so a facility granting free permanent-collection entry plus a variable
  special-exhibition discount could read as "free admission · ¥800 off" — a
  claim the brochure never makes about either benefit.
- Facility Detail now renders the official brochure clauses verbatim, keeping
  their 入場 / 割引 labels as content categories. No.71 reads
  「入場 常設展入場」 / 「割引 特別展：一般料金の20%引」, and No.44 keeps
  「建物公開展、庭園入場」 and 「企画展割引：一般料金の団体割引相当額」 intact.
  The only edit to the wording is rendering the brochure's `‥` separator as a
  colon.
- Browse cards now show a concise structured summary built from the scoped
  benefits — 「常設展 入場 · 特別展 20%引」 — which may simplify but never
  narrows the scope the source granted.
- The derived value became its own secondary layer that names its basis:
  「参考価値 ¥800 / 常設展の一般料金を基準」. A source-stated fixed discount is
  not duplicated there — No.18's ¥300 is the entitlement itself, so it appears
  once, in the entitlement phrase.
- Verified scoped values and legacy fallback values are no longer presented as
  equally trustworthy: verified reads 参考価値 / 参考, legacy reads 概算 at lower
  weight and contrast. Of 108 facilities, 10 now show a verified reference-value
  line, 13 carry their verified amount inside the entitlement phrase, 83 show a
  weakened estimate, and 2 with no parsable value show no amount at all rather
  than ¥0.
- My Pass stopped claiming actual savings. Visiting a facility proves attendance,
  not which benefit was used or what was paid, so the totals are now reference
  value: 「参考価値の合計」, 「参考価値では、あと¥1,070でパス価格相当」, with a
  single plain-language qualification where the total is claimed.
- EN and ZH Detail now lead with the localized reading and keep the Japanese
  official wording underneath as a low-weight `原文` line, rather than showing
  Japanese only or replacing the source with a translation.

### Removed

- The legacy `benefit_basis` / `pass_notes` / `admission_label` paraphrase lines
  on the Facility Detail. They were the pre-scoped rendering of the same
  brochure line, so beside the official clauses they repeated it — and where the
  paraphrase had drifted they contradicted it. No.71's note claimed
  「常設展・企画展入場無料」 against an official 「常設展入場」.
- `passValueCoversWholeEntitlement()`, the Phase 2 stopgap that suppressed an
  inline amount for mixed-scope facilities. The presentation model now decides
  per benefit, so the value is shown rather than hidden — just in its own layer.

### Why not

- No dynamic exhibition-price engine. Showing 「一般 ¥1,500 → Pass ¥1,200」 on a
  current exhibition needs both a reliable current price and explicit Pass
  applicability per exhibition; the stable fact today is 「¥300引」.
- No monetary research for the 85 unverified facilities, and no change to the
  frozen comparable values, the benefit taxonomy, or the scoped algorithm.
- Detail information architecture, filter and sort semantics, Visited
  persistence and the Map preview are unchanged. Only the Pass section's own
  internals moved.

---

## 2026-08-14a — Scoped Pass Benefit Runtime (v85)

### Changed

- Made the scoped Pass benefit data the runtime's monetary source of truth for
  the 23 price-verified facilities, behind three read-only accessors
  (`getFacilityEntitlements`, `getFacilityComparableValue`,
  `getFacilityRegularPriceForValueBasis`). `getKnownBenefit()` and
  `getRegularAdultPrice()` keep their names and now resolve through them; the
  old bodies remain as `legacyKnownBenefit()` / `legacyRegularAdultPrice()` for
  the 85 facilities whose prices are not yet verified.
- Monetary authority is `verification_status === 'priced'`, never `value == null`,
  so an authoritative null stays null instead of falling back to fee or
  exhibition-price parsing. Six flat-discount facilities now render an empty
  `data-regular-price` rather than an invented one.
- Shipped the corrected comparable values: No.44 ¥200, No.50 ¥220, No.70 ¥400,
  No.71 ¥800, No.105 ¥300. No.18's regular price also moved ¥1,500 → ¥1,200,
  the published 企画展 price rather than one exhibition's example.

---

## 2026-08-13c — List & Map Interaction Model (v84)

### Changed

- Made the Facility Card a discoverable object. The card looked like one
  facility but only its title opened the Detail, so tapping the name area, the
  number, the description or the pass line did nothing. The passive card
  surface now opens the Detail through the existing `openFacilityDetail()`.
- Decided card ownership in one delegated guard,
  `isIndependentCardInteraction()`, instead of `stopPropagation()` spread over
  descendants. Links, buttons, form controls, labels, summaries, `role=button`,
  `role=link`, the whole `.enriched-item`, the Visited control and the existing
  `data-*` actions keep their own behavior. An active text selection suppresses
  the open. The card wrapper gains no `tabindex` and no `role`, so it adds no
  duplicate tab stop, and the title button remains the keyboard entry point and
  the focus-return target for passive clicks too.
- Split the Map selection surface by width. Desktop (`>=1200px`) keeps the
  existing Selected Facility Detail + Map split view unchanged. Below 1200px
  the full `#mapFacilityPanel` leaves the document flow entirely and the map
  canvas answers a marker tap inside itself, with a compact preview carrying
  the facility number, name, current status, compact Pass benefit and a Detail
  affordance. The preview floats above the canvas bottom, clear of Leaflet's
  attribution.
- The preview opens the existing Drawer and is its focus-return target. Closing
  the Drawer keeps Map Mode, `selectedFacilityKey`, the selected marker and the
  preview. Marker A to marker B replaces the selection rather than appending.
- Replaced the large empty Detail panel on compact widths with a low-weight
  hint before a selection exists, and cleared the preview's content as well as
  its key when a filter excludes the selected facility, so no stale summary can
  flash into the next selection.
- Sized the compact map canvas from the sticky toolbar with `dvh` and a `vh`
  fallback so the map is visibly the primary content, and told Leaflet to
  re-measure when the toolbar height changes.

### Why not

- No gesture workaround. Map Mode is an interactive canvas: single-finger pan
  stays, with no two-finger-only mode, no tap-to-activate layer and no
  pointer-event hacks. The in-canvas preview removes the reason a user had to
  swipe across the map at all, which was the actual conflict.
- No second selection state, no second filter state and no third Detail
  renderer. `selectedFacilityKey` and `filteredCards` remain the only sources,
  and the preview is presentation-only: its facts are read from the same card
  the Drawer clones.
- No `scrollIntoView()` or `window.scrollTo()` on marker selection. Feedback
  moves to the user, not the user to the feedback.

### Tests

- Added `tests/interaction-model.e2e.spec.js`: passive card surface opens the
  Detail, title opens it exactly once with focus return, exhibition / Visited /
  link exclusions, no extra tab stop, marker tap answers in the same viewport
  without page movement, A-to-B replacement, preview to Drawer and back with
  the selection intact, List → Drawer → View on map, filtered-out selection
  leaves no stale preview, and the responsive split (preview below 1200px, the
  full panel at 1200/1440). A WebKit smoke covers the mobile marker tap and the
  preview-to-Drawer path; the WebKit project now takes any `*.webkit.e2e` spec.
- Updated two release tests that encoded the old architecture: the mobile
  visited-filter case reaches Visited through the preview and Drawer, and the
  dimensions case checks the split panel above 1200px and the preview below it.
  Its map-viewport invariant is expressed as distance, because a
  toolbar-sized canvas legitimately re-anchors the centre by a few metres.

---

## 2026-08-13b — Mobile Discovery Information Architecture (v83)

### Changed

- Restructured the mobile discovery controls instead of compressing them again.
  Real-iPhone use showed the problem was not whether the controls still fit but
  that controls needed only while editing were permanently exposed while
  browsing. At `<=640px` the browse state is now Search, one date+time
  condition, and a full-width quick-filter row.
- Moved the native `#targetDate` / `#targetTime` inputs, their labels, and the
  return-to-now action into an explicit Date & time editor presented as a
  bottom sheet. The editor reuses the Filter sheet's backdrop, focus handling,
  safe-area and scroll-lock language while owning its own state. There is still
  exactly one pair of inputs; only the presentation is responsive.
- Added a locale-aware date+time summary control. `formatUiCompactDate` renders
  `8/13 · 17:53` in JA/ZH and `Aug 13 · 17:53` in EN through `Intl`, and shows
  the year (`2027/3/31`, `Mar 31, 2027`) only when the target date leaves the
  current Tokyo year. The summary follows live mode minute by minute and across
  Tokyo midnight, and switches to the custom value when the user edits it.
- Gave quick filters their own full-width row. The previous layout let the view
  switch take width from the same grid column, which compressed and clipped the
  last shortcut (`未訪...`). Overflow now scrolls horizontally instead.
- Made List / Map icon-only at `<=640px` with explicit localized `aria-label`s
  and 44px targets, keeping the existing selected treatment. Desktop keeps its
  text labels and its inline date/time fields.
- Rebuilt the sticky collapse state. `mobileControlsManualExpanded` permanently
  blocked `maybeAutoCollapseMobileControls()` once a user expanded the toolbar,
  so auto-collapse worked exactly once per session. It is replaced by a
  boundary flag plus an expansion anchor: a manual expansion re-arms collapse
  from where it happened, and 64px of further downward travel collapses the
  toolbar again, on every cycle. Direction is still never used to expand.
- The compact row is now one real toolbar row whose controls act directly —
  search icon, date+time condition, filter icon with its count, List / Map. The
  standalone empty-row collapse button and the duplicate compact filter count
  were removed rather than kept for DOM continuity.

### Why not

- Not another round of narrower inputs, smaller padding, new grid ratios, or a
  new breakpoint. Those adjustments had already been spent; the remaining cost
  was structural.
- Not a second set of mobile-only date/time inputs synchronized with the
  desktop ones. Two sources of truth for the same condition is the more
  expensive bug.
- The anchor is re-read on the next frame after a manual expansion: restoring
  the toolbar grows the sticky header, and the browser's scroll-anchoring
  adjustment for that growth would otherwise be misread as the user browsing
  onward and collapse the toolbar they just opened.

### Tests

- Rewrote the mobile-controls suite for the new architecture: browse
  composition across JA/EN/ZH at 320/375/390/430, quick-filter collision and
  reachability, the one-row compact toolbar, direct compact actions, the
  localized summary and foreign-year form, editor ownership of the native
  fields and return-to-now, minute rollover, Tokyo midnight, and shared
  desktop/mobile state. The repeated expand → scroll → collapse regression
  fails against the old permanent lock and passes after the fix; it runs two
  full cycles. WebKit covers the same composition and the sheet over the
  compact row.
- `setDateTime` now drives the editor at phone widths, so release tests reach
  the date and time the same way a person does.
- `docs/visual-acceptance.md` gained a density principle, a date-and-time
  condition section, a responsive view-switch section, and rewritten sticky
  acceptance.

---

## 2026-08-13 — Mobile Discovery Controls, Live Time & Facility Detail Polish

### Changed

- Replaced the permanently expanded mobile discovery chrome at `<=640px` with
  an Expanded → Compact model. A stable discovery boundary drives the one-way
  automatic collapse; upward scrolling does not re-expand it, while the same
  existing List / Map switch, filter state, and ResizeObserver offset logic
  remain in use. Search / conditions and the low-emphasis collapse action are
  explicit user controls, and focused editing / an open filter sheet prevents
  an automatic collapse.
- Replaced the blank-Time-as-live sentinel with explicit Live Time / Custom
  Time state. The initial UI visibly shows the current Tokyo date and time;
  live mode continues across minute rollover and Tokyo midnight, while a user
  edit becomes custom and is no longer overwritten. The secondary Use now /
  現在に戻す action appears only in custom mode, and the custom-time context
  chip follows the same state.
- Prepared shared Drawer and Map Detail clones by removing browse-only nodes
  before insertion, so hidden content cannot create a false first-section
  separator or an artificial Header → Access gap.
- Changed the Facility Detail header to own title, close, and full-width status
  as separate grid areas. Status can use the width below the title without
  reserving the close-button column for its wrapped line.
- Reordered only the Detail presentation to Access → Pass → Facility
  Introduction → Exhibitions → Visit information; Browse Card hierarchy and
  source data remain unchanged.
- Attached the JP language marker inline to the specific untranslated Japanese
  exhibition title. A translated title with untranslated supporting content
  uses source disclosure instead of receiving an incorrect `(JP)` marker.

### Verified

- The implementation and documentation are split across the phase commits
  `2166da7` (`fix: compact mobile discovery controls`), `a995add`
  (`fix: refine facility detail hierarchy`), and `46af4da`
  (`test/docs: codify mobile visual acceptance`).
- Added and updated focused coverage for 390px Expanded / Compact transitions,
  one-way collapse, manual controls, filter-count synchronization, focus safety,
  overflow, deterministic Tokyo live/custom time behavior and minute rollover,
  cloned Detail ownership, section order, header ownership, shared Drawer / Map
  parity, and item-level JP marker semantics.
- `npm test`: 121/121 passed; `npm run validate`: 0 errors / 0 warnings;
  `npm run test:e2e`: 33/33 passed; `npm run test:release`: 33/33 passed;
  standalone WebKit smoke: 1/1 passed.
- Playwright / WebKit passing is recorded as functional and responsive
  regression evidence, not as final iOS Safari visual acceptance. Real-device
  JA / EN / ZH review remains pending.

### Deliberately unchanged

- Hero, Footer information architecture, My Pass calculations, Facility data,
  Summary copy / data, Access data, Pass benefits, exhibition date relevance,
  Visited logic, Area and Facility numbering, Search matching, Filter
  semantics, Map marker design, and poster / image support.
- Browse Card information architecture, status business logic, and the shared
  Drawer / Map content semantics remain unchanged apart from the requested
  Detail presentation cleanup and ordering.

---

## 2026-08-13 — Footer Information Architecture & Structured Sources

### Changed

- Reframed the Footer as a compact trust line plus two independent disclosures:
  About this site and Data & sources.
- Reorganized About into coverage, Pass basics, visit records, and display
  methodology, while retaining value and opening-status limitations.
- Replaced the flat monthly source prose with grouped
  `CONFIG.sources.core`, `exhibitions`, and machine-readable
  `recommendations` rows rendered newest first.
- Added complete JA / EN / ZH Footer copy and retained the Footer OSM credit at
  low visual weight alongside the existing Map attribution.

### Verified

- Added Footer unit, i18n, source-schema, external-link-safety, monthly
  maintainability, and responsive browser regressions.
- Updated the Footer visual-acceptance rules and release documentation.
- `npm test`: 121/121 passed; `npm run validate`: 0 errors / 0 warnings;
  `npm run test:e2e`: 28/28 passed; `npm run test:release`: passed.

### Deliberately unchanged

- Hero, Search, Date / Time, Filter, My Pass, Area, Facility cards, Drawer,
  Map interaction, Access, Summary, Pass benefit, exhibition relevance,
  Visited, status business logic, and the internal `sourcePolicy` metadata.

---

## 2026-08-13 — Mobile First-Screen Visual Correction

### Changed

- Reduced Hero ownership to product identity, `PASS 2026`, and quiet provenance;
  visible Pass price and absolute final-use date are no longer rendered in the
  Hero. The supporting metadata is one semantic row that may wrap naturally
  across JA / EN / ZH and desktop / mobile widths.
- Kept Pass price in the My Pass Drawer from `CONFIG.passPriceYen`, moved the
  edition final-use date into Drawer metadata from `CONFIG.passEnd`, and made
  the first-screen remaining amount explicit as “to break even” in all locales.
- Made Date / Time a true vertical stack at `<=480px`; Date is full width and
  Time shares its row with the flexible Now action. Wider mobile/tablet widths
  retain the existing horizontal adaptation.
- Restored the Facility title's natural visible line box and moved the 44px
  touch affordance into an invisible extension. The status layer remains above
  that extension so neighboring actions are not covered.
- Added the permanent [`docs/visual-acceptance.md`](docs/visual-acceptance.md)
  standard covering ownership, hierarchy, real-device review, multilingual
  wrapping, and the separate automated/visual release gates.
- Bumped the service-worker shell cache to `grutto-pass-v82`.

### Verified

- Added browser regression for stacked Date / Time at 320 / 375 / 390 / 430 /
  480px, wider 640px controls, collision-free Time + Now, and facility number /
  title gross alignment for No.1 / No.9 / No.52 / No.101 / No.107 (the current
  source has no No.108 identity).
- Added release coverage proving Hero no longer exposes price/deadline while
  My Pass still exposes price/deadline and the compact break-even message.
- `npm test`: 118/118 passed; `npm run validate`: passed with 0 errors and 0
  warnings; full Chromium/WebKit `npm run test:e2e`: 26/26 passed.

### Deliberately unchanged

- Pass business logic, `CONFIG.passPriceYen`, `CONFIG.passEnd`, visited state,
  Facility Detail IA, access / summary / exhibition data, search, filters,
  map behavior, status calculations, and catalog number semantics remain
  unchanged.
- Automated PASS is not treated as final visual approval; real iPhone review
  for JA / EN / ZH remains required.

---

## 2026-08-13 — Align Browse Facility Introductions with Detail Summaries

### Changed

- Unified the Browse/list facility introduction with the approved multilingual
  Summary already used by Facility Detail, so the outer and inner views no longer
  show different copy.
- Kept the same JA / EN / ZH language selection and the existing official-brochure
  fallback for facilities without an approved Summary, currently No.50.
- Bumped the service-worker shell cache to `grutto-pass-v81`; the existing
  precache list already contains the changed runtime and data assets.

### Verified

- Added runtime assertions for matching Browse and Detail Summary copy across all
  supported languages, including No.1 and the No.103 two-venue mapping.
- `npm test`, `npm run validate`, and the focused
  Playwright release test pass.

### Deliberately unchanged

- Official brochure data, Summary source metadata, fallback attribution, Access,
  Pass, Exhibition, and the shared Drawer / Map Detail DOM remain unchanged.

---

## 2026-08-13 — Favicon Exhibition Frame Refinement

### Changed

- Replaced the doorway-shaped favicon artwork with a simple framed exhibition
  image and gallery plinth, matching the framed artwork motif used in the
  social share card.
- Regenerated `favicon-32x32.png` and the 180×180 `apple-touch-icon.png` from
  the revised SVG source. The favicon no longer uses an arch or doorway shape,
  improving recognition at 16–32px browser-tab sizes.

### Deliberately unchanged

- Social share image, Open Graph/X metadata, runtime language switching, and
  all application UI remain unchanged.

---

## 2026-08-13 — Social Sharing Metadata and Branding Assets

### Changed

- Added language-neutral crawler fallback metadata with the static title `Grutto
  Pass 2026 — Museum & Exhibition Guide (Unofficial)`, a stable product
  description, canonical URL, and complete Open Graph fields.
- Added X/Twitter `summary_large_image` card metadata using the same title,
  description, and dedicated share image.
- Added the dedicated 1200×630 PNG social share image at
  `assets/social/grutto-pass-share.png`; it uses the site green / warm-white /
  muted-mint palette and does not include changing facility counts, dates, or
  pass price.
- Added an original doorway favicon plus `favicon-32x32.png` and the 180×180
  `apple-touch-icon.png`; the Cloudflare Pages packaging step now deploys all
  branding assets.
- Preserved the existing runtime-localized title and description for JA / EN /
  ZH browser sessions. Localized `/ja/`, `/en/`, and `/zh/` social metadata and
  routes remain a future enhancement.
- Bumped the service-worker shell cache to `grutto-pass-v80` and precached the
  favicon assets.

### Verified

- Raw `index.html` contains the fallback title, description, canonical, favicon
  links, Open Graph metadata, and X/Twitter metadata before JavaScript runs.
- The share image is an RGB, opaque 1200×630 PNG under 1 MB. Production URL
  availability still requires post-deploy verification.

---

## 2026-08-13 — Hero Metadata Hierarchy Polish

### Changed

- Split Hero supporting information into one shared visual hierarchy: the title
  remains the anchor, Pass facts use the secondary treatment, and provenance is
  a smaller, quieter block without a group-boundary separator.
- Shortened the JA / EN / ZH Hero provenance labels to `非公式` / `Unofficial` /
  `非官方`, localized the update display with a year-free month/day formatter,
  and changed the external action to `公式サイト ↗` / `Official site ↗` /
  `官方网站 ↗`.
- Kept the existing semantic `.pass-meta-group--pass` and
  `.pass-meta-group--guide` ownership. Responsive CSS changes wrapping and
  block arrangement only: Desktop / Tablet place the two groups side by side
  when space allows, while Mobile stacks them. The shared color, type, link,
  and spacing logic is used across all breakpoints.
- Preserved the existing language-switch pattern and touch target while
  preventing narrow JA labels from collapsing vertically.
- Bumped the service-worker shell cache to `grutto-pass-v79` so clients receive
  the updated Hero presentation.

### Verified

- Added i18n and offline-shell regressions for the short copy, localized short
  date, contrast-safe quiet color, group separation, and non-CTA link treatment.
- Added release E2E coverage for 320 / 375 / 390 / 430 / 768 / 1024 / 1440px in
  JA / EN / ZH, including overflow, wrapping, link semantics, and language-switch
  readability.
- `npm test`: 116/116 passed; `npm run validate`: passed. Full
  `npm run test:e2e`: 24/24 passed, including WebKit mobile smoke.

### Deliberately unchanged

- Hero green, serif title, eyebrow, language-switch pattern, content ownership,
  controls, cards, Drawer, Map, Pass, and all unrelated UI remain unchanged.
- `CONFIG.lastUpdated` and full-date `formatUiDate()` output remain intact for
  non-Hero metadata; only the Hero presentation omits the repeated year.

---

## 2026-08-13 — Mobile Toolbar Layout and Filter Copy

### Changed

- Stopped the mobile date and time controls from compressing into each other by
  reclaiming the hidden “now” button column until a target time is entered.
- Renamed the admission quick filter to the user-facing equivalent of
  “入場無料 / Free admission / 免费入场” and removed the redundant brand prefix.
- Bumped the service-worker shell cache to `grutto-pass-v78` so clients receive
  the toolbar and filter-copy update.

### Verified

- Added layout and offline-shell assertions for the responsive date/time grid and
  the clearer admission filter label.
- Added browser coverage for Japanese and Chinese at 320px and 375px widths;
  date/time boxes remain separated and the filter label is explicit.

### Deliberately unchanged

- The filter still uses the existing `passFilter=admission` data category; only
  its visible wording changed.
- Desktop date/time layout and the time-reference behavior remain unchanged.

---

## 2026-08-13 — Preserve Map Viewport During Visited Filtering

### Changed

- Kept the user's current map center and zoom when marking a facility as visited
  while the `未訪問のみ` / `Not visited` filter is active.
- Recorded genuine Leaflet pan and zoom gestures as user-owned map state, while
  keeping the initial marker fit, current-location centering, and explicit
  facility focus behavior unchanged.
- Bumped the service-worker shell cache to `grutto-pass-v77` so clients receive
  the map behavior fix.

### Verified

- Added a map regression test covering marker refresh after a manual viewport
  change; center and zoom remain unchanged.
- Existing map clustering/focus tests and the browser-level not-visited filter
  test continue to pass.

### Deliberately unchanged

- The first map render still fits the visible facilities automatically.
- Filtering still removes visited facilities from the marker layer and keeps the
  selected filter state; only the map viewport is preserved.

---

## 2026-08-12 — Approved Facility Summary Attribution Polish

### Changed

- Removed the visible brochure citation from Facility Detail introductions that
  use an approved production Summary. The production Summary `source` metadata
  remains intact for snapshot traceability.
- Kept the existing brochure attribution for fallback introductions, currently
  No.50, and kept No.103's two venue headings and independent Summary paragraphs.

### Verified

- No.20, No.52 and No.103 omit `.facility-intro-source`; No.50 retains it in the
  shared Detail content used by both Drawer and Map Detail.
- JA, EN and ZH follow the same approved-versus-fallback attribution rule.

### Deliberately unchanged

- Summary copy, Browse previews, review/audit source metadata, Access, Pass,
  Exhibition, Visit Information and Detail ordering remain unchanged.

---

## 2026-08-12 — Approved Access Presentation Production Integration

### Changed

- Promoted the 102 records that were complete, explicitly approved, and
  source-complete from the accepted Access review into the small
  JA-only `data/facility-access-presentation.js` projection.
- Added a source-preserving `getApprovedAccessPresentation(f)` adapter. JA uses
  structured display lines only when the current raw source is an exact match;
  otherwise the existing localized/raw access path remains in control.
- Kept the six unresolved records (11, 18, 21, 41, 51 and 87) entirely out of the
  structured production subset. EN and ZH continue to use their existing localized
  `tField()` access overlays; no localized route objects were generated.
- Added the production Access data to the offline shell and bumped the cache version
  to `grutto-pass-v76`.

### Verified

- All 102 production records satisfy `display_lines_ja.join('/') === source_text_ja`.
  No.97's quoted slash remains protected; No.20's `直結` wording and No.23's full
  composite line grouping are unchanged.
- No.52 renders three source-preserving JA lines; source drift returns `null` and
  falls back to raw access; internal review fields are absent from production.

### Deliberately unchanged

- `data/facilities.js` access, `data/i18n/facilities.en.js` access,
  `data/i18n/facilities.zh.js` access, and all Access review artifacts remain intact.
- Detail IA, Browse cards, Drawer/Map shared cloning, route order, and existing
  visit-row rendering remain unchanged.

---

## 2026-08-12 — Approved Facility Summary Production Integration

### Changed

- Promoted the 108 explicitly approved venue-level Summary records from the
  accepted Summary review into
  `data/facility-summaries.js`; No.50 remains intentionally absent from production.
- Updated Facility Detail introduction rendering to prefer the approved multilingual
  Summary projection while retaining the existing brochure introduction as fallback.
  Browse previews continue to use the existing brochure renderer unchanged, and the
  Drawer and Map Panel still clone the same detail DOM.
- Promoted only the approved Summary subset; the internal editorial record
  retains the promotion checks.
- Added the production Summary data to the offline shell and bumped the cache version
  to `grutto-pass-v75`.

### Verified

- Summary production count is 108; internal review fields are excluded; and
  36 / 36-2, 32-WHAT-MUSEUM, 58-NTT-ICC and the
  two No.103 venue records retain their identity mappings.
- No.52 uses approved JA / EN / ZH Detail copy; No.50 uses the brochure fallback; and
  Browse remains brochure-based.

### Deliberately unchanged

- `data/facilities.js`, `data/facility-brochure.js`, the existing EN / ZH overlays,
  Access data, and all review artifacts remain source layers and were not rewritten.
- No Access production presentation or localized route objects were created in this
  phase.

---

## 2026-08-12 — Number Semantics + Hero Hierarchy Polish (`v74`)

### Changed

- Kept Area ordinals (`01`, `02`, …) as decorative navigation aids while standardizing the
  shared catalog identity formatter to `No. 1`, `No. 52`, and `No. 101` in JA / EN / ZH. Browse,
  Drawer, Map Panel, and My Pass continue to use the same `facility.number` source; the underlying
  facility numbers and sort/filter behavior are unchanged.
- Added a fixed 52px card-number gutter after measuring the three-digit catalog values, with
  nowrap protection on card, Drawer / Map kicker, and My Pass number surfaces. Area headings now
  expose the area name as the semantic heading while the ordinal is `aria-hidden`.
- Removed the stale unofficial-guide copy from the HTML Hero fallback, clarified the edition-level
  absolute date as “Last use date / 最終利用日 / 最晚使用日”, and kept Pass facts and guide
  provenance in separate metadata groups. Hero mobile rules now have one clear owner for the
  Hero-related declarations; natural wrapping remains available at narrow widths.

### Verified

- `npm test`: all 99 tests pass; responsive browser checks passed at 320, 375, 390, 430, 768,
  1024, and 1440px across the requested language surfaces without horizontal overflow.
- Drawer, Map Panel, and My Pass all render the same `No. 1` convention; Map keeps only the
  external route action. The existing approved Detail IA, Pass / Visited behavior, and review-only
  summary safety remain unchanged.

### Deliberately unchanged

- Detail / Map information architecture, Access and route hierarchy, Browse Card density, Pass
  calculations, Visited, Filters, Search, Status, Exhibitions, and underlying facility data.

This release bumps `CACHE_VERSION` from `v73` to `v74` so clients receive the updated number
semantics, Hero copy, and responsive styles.

---

## 2026-08-12 — Facility Detail Decision-First Restructure (`v73`)

### Changed

- Reordered the shared Facility Detail source around the visit decision: Access / route
  actions, Pass benefit, relevant exhibitions, Facility introduction, then supporting Visit
  information. Drawer and Map Panel still clone the same `.facility-detail-content`.
- Split Access out of `visitRows`; the existing localized `renderVisitInfoRow()` and the
  existing `renderFacilityActions()` now share one detail-only Access section. Map context
  removes `[data-map-focus]` across the cloned detail body, leaving only the external route.
- Split the Introduction presentation wrapper so Browse keeps its original discovery preview
  position while the brochure introduction moves after Pass and exhibitions. Brochure source
  attribution is now inline and intentionally lower-weight, with the Japanese-source note kept.
- Added Detail-only exhibition relevance grouping: ongoing items are shown, future items start
  within 60 days of the selected date are shown as lower-weight Coming soon / 近日開催, and
  far-future items are omitted. The horizon is capped by `CONFIG.passEnd`; expired and
  undated items retain their existing semantics. Full-year `schedule_lines` remain available
  to data and search, but no longer render in Drawer / Map Detail.
- Scoped the rich exhibition treatment to Detail surfaces, reducing current exhibition cards to
  compact information rows without changing Browse previews or Visited behavior.

### Root cause / ownership

- The old IA treated `access` as one of four parallel `visitRows` fields and kept both map
  actions in `card-foot`, so route decisions were pushed below schedule and reference metadata.
- The new ownership is Access / Maps = decision layer, Pass = value layer, current / near
  exhibitions = temporal discovery, Introduction = context, and Visit information = supporting
  reference.

### Verified

- `npm test`: all 98 tests pass; responsive browser smoke checks passed at the tracked widths,
  with JA / EN / ZH detail hierarchy, Map route cleanup, ongoing / near-upcoming grouping, and
  far-future hiding checked locally.
- Review-only candidate copy was not promoted into production UI; the then-current
  brochure introduction source remained authoritative for that release.

### Deliberately unchanged

- Browse Card order and presentation-level filtering, Pass / Visited / My Pass state, Search,
  Filters, Date / Time, Status, Drawer focus lifecycle, Map selection, official URL dedupe,
  underlying facility facts, and annual schedule data.

This release bumps `CACHE_VERSION` from `v72` to `v73` so clients receive the new Detail source,
localized labels, styles, and relevance behavior.

---

## 2026-08-12 — Visited Toggle Density Fix (`v72`)

### Changed

- Removed the mobile `44px` visible-height and `10px 9px` padding overrides from the
  Visited toggle. Drawer / Map Detail keep the shared `36px` visual control, while Browse
  retains its existing `28px` compact card variant.
- Added a non-layout `::before` hit area on mobile. It expands vertically to `44px` for
  the 36px control and to `44px` for the compact Browse control without changing the
  Pass benefit row height or overlapping the benefit column horizontally.
- Kept the `minmax(0,1fr) max-content` Pass benefit grid, the `<=340px` complete-toggle
  fallback, all Visited labels/state logic, and all unrelated mobile accessibility targets
  unchanged.

### Verified

- Responsive and interaction checks cover Browse, Drawer, and Map Detail at the tracked
  breakpoints, including Japanese, English, and Chinese unchecked/checked labels.
- The service-worker shell cache was bumped from `v71` to `v72` so the CSS change reaches
  existing clients.

### Deliberately unchanged

- Pass copy and supporting detail content, Number / Semantic Polish, Visited persistence,
  filters, My Pass synchronization, and Exhibition rendering.

---

## 2026-08-12 — Step B — Detail & Card Information Density Polish (`v71`)

### Changed

- Applied the confirmed correction-layer fixes for No.51 (`¥200` → `¥220`, collection
  admission) and No.74 (`¥460` → `¥500`, MOT Collection admission). Their regular prices,
  Japanese source fields, and only the corresponding EN/ZH overlays now preserve the
  separate collection-admission and exhibition-dependent group-rate discount scopes.
- Kept Browse cards compact while restoring Pass benefit + Visited as a two-column grid.
  The Visited control remains `nowrap` with its existing touch target; only a genuinely
  narrow `<=340px` card moves the complete control to a second row.
- Removed the visible Drawer / Map Detail Pass kicker while retaining a localized
  accessible section label. Added localized exact-entitlement detail below the normalized
  summary, with mixed benefits showing both collection admission and exhibition conditions
  and without repeating identical summary/detail copy.
- Deduplicated official websites within the practical-information region by normalized URL.
  A contextual visit-verification CTA wins over the nearby canonical link; phone contact
  remains, distinct deep links remain allowed, and empty suppressed contact groups are not
  rendered. Drawer and Map Detail continue to use the same rendered facility source.
- Consolidated vertical rhythm under the shared adjacent-section rule. `card-foot` no
  longer adds a parent gap, Schedule owns no external margin, and Actions adds no second
  boundary or margin while the 44px summary touch target remains intact.

### Verified

- `npm test`: all 98 tests pass; inline script compilation, brochure data, i18n overlays,
  URL deduplication, responsive layout rules, Drawer accessibility, and rhythm ownership
  are covered.
- Browser smoke test on a fresh `v71` shell: JA / EN / ZH at `320 / 375 / 390 / 430px`
  for Browse cards, and `390 / 768 / 1024px` for Drawer / Map Detail. No horizontal
  overflow was observed; 390px and wider cards keep the controls on one row, while 320px
  safely stacks the complete Visited control.
- Representative checks: No.5 keeps its Tokyo National Museum Collection scope; No.51
  exposes ¥220 collection admission plus variable exhibition discount; No.74 exposes ¥500
  MOT Collection admission plus group-rate-equivalent conditions and exclusions; a fully
  free facility does not duplicate its summary; and a verification CTA suppresses only the
  matching canonical website.

### Deliberately unchanged

- Facility / Area IA, Number and Semantic Polish, search and filter behavior, Visited state
  logic, My Pass calculations, Typography, and the Phase 3 Drawer / Map Detail structure.
- No runtime translation or new translation batch was introduced; the UI consumes the
  existing JA source and Step A EN/ZH overlays only.

This release bumps `CACHE_VERSION` from v70 to v71 so clients receive the corrected data,
localized detail copy, and density polish.

## 2026-08-12 — Pass Benefit Translation & Semantic Coverage Audit (data-only)

### Changed

- Audited all 108 Pass facilities against the source hierarchy `benefit_basis` →
  `pass_notes` → `admission_label` → `pass_types` / amount fields. The source has
  `admission_label` and `pass_notes` for all 108 facilities, `benefit_basis` for 24,
  `pass_benefit_yen` for 23, and `regular_price_yen` for 22.
- Added reviewed EN/ZH overlays for `admission_label` and every `pass_notes` item for
  all 108 facilities, plus all 24 available `benefit_basis` values. Scope, amount,
  audience, regular-hours, exhibition eligibility, and mixed admission/discount
  conditions remain explicit. Browse-card summary copy remains a separate layer.
- Repaired the Tokyo National Museum entitlement so both languages retain the
  Tokyo National Museum Collection exhibition scope and the ¥100 general-price discount.
- Used the existing reviewed effective correction for No.80 (Miraikan): permanent
  collection admission at the general admission price of ¥630. No source correction
  was changed in this audit.

### Audit report

- Effective categories (overlap allowed): A free admission 85; B fixed-yen discount
  13; C percentage discount 4 (one discount-only and three mixed); D mixed admission
  and discount 9. Seven facilities have explicitly exhibition-dependent or group-rate
  conditions; two have additional audience qualifications (general/university or age
  25 and under).
- Amount consistency: 18 match; 4 remain unknown because the source gives no fixed
  discount amount (Nos. 40, 44, 50, 102); 2 conflict and are intentionally unresolved:
  No.51 has `pass_benefit_yen=200` vs `benefit_basis` collection admission valued at
  ¥220, and No.74 has `pass_benefit_yen=460` vs MOT Collection admission valued at ¥500.

### Representative semantic fixes

- No.5: added “Tokyo National Museum Collection exhibition” / “东博收藏展” to both
  the exact discount and basis translations; the old Pass overlay was absent.
- No.1: added “Free admission” / “免费入场” instead of leaving the Pass field to a
  generic runtime fallback.
- No.71: preserved mixed entitlement as permanent + temporary exhibition admission
  and a separate 20% special-exhibition discount in both languages.
- No.36: preserved the ¥200 same-day general-price discount and the condition that
  some exhibitions may be excluded.
- No.4: preserved the ¥100 amount and the general-visitor / university-student scope.

### Deliberately unchanged

- Japanese source data, UI/layout/rendering, Pass summary logic, and cache version.
  This is a data/localization-only follow-up; no shell cache bump is needed.

## 2026-08-12 — Mobile Responsive & Comprehension Polish / visit verification (`v70`)

### Changed

- Grouped Hero metadata into two explicit semantic units: Pass facts (`PASS`, price,
  and validity) and unofficial-guide provenance (guide note, update date, and the
  official-source CTA). Existing config bindings and accessible link focus behavior remain intact.
- Repaired mobile List / Map sizing by giving the View system intrinsic width,
  non-shrinking single-line labels, and a `max-content` grid track. Existing narrow-screen
  filter handling is reused at `<=374px` rather than splitting labels or removing them.
- Gave Browse-card Visited controls independent mobile breathing room. The Pass benefit
  and personal Visited action stack only at the narrow mobile breakpoint; tablet and desktop
  cards retain their compact inline presentation.
- Kept Filter & sort, Quick Filters, and List / Map as distinct control responsibilities
  while making the Filter System grouping and touch affordances explicit.
- Added localized, context-specific official-source actions for opening and visit information.
  Status reasons now distinguish current conditions from general-rule guidance, and duplicate
  facility source URLs are removed before rendering.

### Verified

- JA / EN / ZH responsive checks at `320 / 375 / 390 / 430 / 640 / 768 / 899 / 900 /
  1024 / 1200 / 1440px`, including no horizontal overflow, single-line List / Map labels,
  grouped Hero metadata, and comfortable Visited controls.
- List / Map switching, Facility Drawer open/close, Visited toggling, and the Not visited
  filter remain functional without changing the existing state or LocalStorage contracts.
- `npm test` passes all 94 tests; `git diff --check` is clean.

### Deliberately unchanged

- Numbering and status visual redesign, Search, Date / Time, Filter business logic,
  My Pass, Area accordion, Facility Drawer / Map Detail IA, and visited-state business logic.

This release bumps `CACHE_VERSION` from v69 to v70 so clients receive the updated shell,
styles, status presentation, and translations.

## 2026-08-12 — Phase 2 My Pass information architecture / global context cleanup

### Changed

- Split the stable global Discovery Context (`resultsSummary`, time reference, and clear action) from the global My Pass entry; neither is moved into an Area section during render, filtering, sorting, or language changes.
- Removed generated `.area-context` slots from Area and global-sort content. Default total-result copy is now hidden; active search/filter/sort states use a localized global feedback row such as `91 / 108 facilities · 1 active filter`.
- Replaced the old inline Pass tracker with a quiet global utility row and an independent accessible My Pass Drawer/Sheet. The detail surface includes break-even status, pass metrics, visited facilities, unknown-savings notes, and the existing clear-history undo flow.
- Reused `visitedKeys`, `getVisitedMetrics()`, the configured Pass price, unknown-value handling, LocalStorage persistence, and the existing Facility Drawer interaction language. No second visit or savings state was introduced.
- Added JA / EN / ZH copy for My Pass entry, metrics, status, visited-facility list, unknown savings, close, and global result feedback. Area Sans / Facility Serif typography roles and the Phase 1A control hierarchy remain unchanged.
- Bumped the offline shell cache from v68 to v69 so the new UI and translations reach offline clients.

### Verified

- Browser QA at `320 / 375 / 390 / 430 / 640 / 768 / 1024 / 1200 / 1440px`, including no horizontal overflow, mobile TOC absence, tablet TOC, desktop sticky Area rail, dual-column cards, Map Mode, Facility Drawer, and My Pass focus/ESC/scroll-lock handoff.
- State QA for zero visits, not paid off, exact break-even, paid off, unknown savings, active filter, global sort, Map Mode, language switching, reload persistence, and clear-history undo.

### Deliberately unchanged

- Facility / Area data, filters, sort engine, status engine, Map markers, Drawer content source, My Pass LocalStorage contract, typography resources, Hero structure, and all Phase 1A / 1B presentation roles.

---

## 2026-08-12 — v68 complete access translations

### Fixed

- Added direct English and Chinese access translations for all 108 facility cards,
  covering station names, exits, bus routes, stops, gates, and route-specific notes.
- Tokyo Opera City Art Gallery (No. 57) and NTT InterCommunication Center (No. 58)
  now display the translated Hatsudai Station access text instead of a generic
  official-site message or Japanese source fallback.
- Kept localized access overlays out of location-alias search matching so route names
  such as the Yokohama Line do not create unrelated city-search results.

This release bumps `CACHE_VERSION` from v67 to v68 so clients receive the completed
English and Chinese access translations.

---

## 2026-08-12 — Phase 1B typography system cleanup

### Changed

- Audited the existing type roles and kept Serif for brand display and Facility identity only: Hero title, List card title, Drawer title, and the shared Map selected-facility title.
- Moved Area rail numbers, Area numbers and names, Facility numbers, Map section heading, status, counts, Pass information, filters, controls, and detail section headings to the shared language-aware Sans stack.
- Kept the existing `--font-sans` / `--font-serif` resources and JA / EN / ZH fallback stacks; no external font, CDN, data, i18n, or interaction changes were introduced.
- Normalized the non-standard 650 / 750 / 800 weights to the existing 600 / 700 rhythm and made the information icon a Sans UI control.
- Verified the shared typography roles at `320 / 375 / 390 / 430 / 640 / 768 / 1024 / 1200 / 1440px` with JA, EN, and ZH coverage, including Drawer, Map, long English Area names, and no horizontal overflow.

This is a presentation-only phase; My Pass IA, Hero structure, Area/Card/Drawer/Map architecture, and the `No.17`-style facility number string remain unchanged.

---

## 2026-08-12 — Phase 1A mobile skeleton / mobile information architecture

### Changed

- Hidden the generated horizontal Area TOC at `<=768px`; its DOM and JS generation remain intact. Desktop/tablet layouts at `>=1024px` and the `>=1200px` Area rail remain unchanged.
- Tightened mobile Area accordion rhythm to a 12px section cadence while keeping expanded content, card spacing, focus behavior, and 44px header hit areas.
- Reorganized the shared Area header into a primary name/chevron row with a secondary facility-count row. Details counts remain available on desktop and are hidden on mobile.
- Kept the mobile control hierarchy explicit: full-width Search, quieter Date/Time context, a shared Filter + List/Map action row, and horizontally scrollable secondary quick filters.
- Removed obsolete responsive overrides for the previous controls structure and hidden mobile TOC; the existing filter bottom sheet, language switch, Map Mode, Drawer, and data/filter logic were not rebuilt.
- Verified at `320 / 375 / 390 / 430 / 640 / 768 / 1024 / 1200 / 1440px` in JA, EN, and ZH coverage, including English long Area names and control labels.

---

## 2026-08-12 — v67 access information fallback

### Fixed

- Added the shared route vocabulary needed to keep Tokyo Opera City Art Gallery
  (No. 57) and NTT InterCommunication Center (No. 58) access visible in English
  and Chinese, including Hatsudai Station and the Keio New Line route.
- Prevented access values from disappearing when an English/Chinese route has not
  yet been reviewed for translation. The detail view now labels and preserves the
  Japanese source route instead of hiding the row behind the official-site link.
- Audited the Japanese source data: all 108 facility cards already contain an
  `access` value, so no facility record was missing from `data/facilities.js`.

This release bumps `CACHE_VERSION` from v66 to v67 so clients receive the updated
language and detail rendering logic.

---

## 2026-08-12 — v66 map focus hotfix

### Fixed

- Fixed facility-to-map navigation leaving the map on the broad clustered viewport.
  The selected facility now cancels any pending map animation and applies its
  coordinate and close-up zoom before the cluster layer reveals the marker.
- Added a regression test covering focus precedence over the initial map fit.

This release bumps `CACHE_VERSION` from v65 to v66 so existing clients receive
the corrected map focus behavior.

---

## 2026-08-12 — v65 facility rendering hotfix

### Fixed

- Restored the `facilityNumber` declaration to `renderCard()`. A misplaced declaration
  made the initial card render throw before any facility content was created.
- Added a regression assertion that the first rendered card contains the localized
  facility number and its detail content.

This is a follow-up to v65 and does not change the service-worker cache version.

---

## 2026-08-12 — v65 presentation visibility hardening

### Fixed

- Scoped detail-level hiding to the source `.card`, so Browse visibility no longer
  depends on the active map or drawer body state; cloned Map and Drawer content keeps
  its complete detail sections while Browse cards remain compact.
- Removed the extra Browse divider and spacing before the Pass row so the card keeps
  the intended single boundary before current exhibitions.

This is a follow-up to v65 and does not change the service-worker cache version.

---

## 2026-08-12 — detail content hierarchy and browse-card pass slots (`v65`)

### Changed

- **Reordered facility detail content around the visit decision.** The introduction now
  leads the pass and current exhibitions; Visit information is permanently expanded,
  followed by contact, the collapsed annual schedule, and actions.
- **Made brochure introductions permanently readable in detail.** The reviewed brochure
  paragraphs, source marker, and page link no longer sit behind a second disclosure.
- **Moved presentation visibility into the shared DOM.** Facility sections now declare
  `browse`, `detail`, or `both`; the list and the two detail shells select those levels
  without the former `card-secondary-details` visibility patchwork.
- **Fixed Pass benefit slots.** Headline, confirmed saving, and eligible scope now have
  stable meanings; Browse combines only the first two, while Detail shows the full set.
  The Pass brand label is shared and no longer rewritten after cloning a card.
- **Aligned facility numbers with the existing area-number language.** Card numbers now
  use the serif family, a quieter secondary scale, and the shared short `facility.number`
  wording in both Browse and Detail.
- **Reduced Browse card metadata duplication.** The static exhibition label and wrapper
  are gone, the current exhibition keeps its green edge and period, opening-hour ranges
  are omitted only from Browse status text, and the `行った` control keeps its label in
  both Browse and Detail with the existing mobile touch target.

### Not changed

- No further UI scope changes are included in this v65 pass.

---

## 2026-08-12 — unify facility presentation hierarchy (`v64`)

### Changed

- **Defined consistent Browse / Detail / Expanded facility presentation levels.**
  Browse cards stay scan-oriented, shared detail content provides the complete
  facility view, and expanded Visit Information remains a section of that view.
- **Simplified browse-card Pass branding and emphasized actual benefits.** The
  compact card label is reduced to `Pass` while admission and savings remain the
  prominent decision information.
- **Added concise facility discovery copy to browse cards.** Existing facility
  introduction data is reused as a short, muted tagline when available.
- **Separated current exhibition from facility information.** Browse cards show at
  most one compact current/relevant exhibition with a lightweight secondary-object
  boundary; full metadata remains in Detail.
- **Unified Detail Drawer and Map Panel information hierarchy.** Both shells use
  the same Facility Detail content and section order, with only their context
  actions differing.
- **Unified Visit Information expanded-state styling.** The accordion now follows
  the same section, divider, typography, and icon language as the rest of Detail.
- **Preserved existing map selected-facility architecture.** Single selection,
  List → Map flow, selected markers, clustering, filters, and map state behavior
  remain unchanged.

### Not changed

- No marker redesign, clustering, filters, Hero, grid, Pass Tracker, search,
  business data, routing, or social metadata changes were included.

---

## 2026-08-12 — emphasize selected map marker (`v63`)

### Changed

- **Increased selected map marker prominence.** Selected facilities now use a
  substantially larger marker with a white separation and green outer ring.
- **Added stronger size and ring differentiation from normal markers.** Normal
  facility markers retain their muted treatment while the selected silhouette is
  easier to locate on a detailed map base.
- **Ensured selected markers render above surrounding markers.** Leaflet's
  marker z-index is synchronized whenever the selected facility changes, so the
  previous marker returns to the normal stack.
- **Preserved the existing selected-facility panel and map navigation flow.**
  List → Map, marker selection, filters, clustering, and the shared detail
  panel architecture remain unchanged.

### Not changed

- No marker animation, permanent labels, clustering behavior, Map Mode panel
  architecture, or Facility Browse Card content was added or redesigned.

---

## 2026-08-12 — clarify facility and exhibition hierarchy (`v62`)

### Changed

- **Added concise facility discovery copy to browse cards.** The preview is derived
  from the existing facility introduction data and is omitted when that data is absent.
- **Separated facility information from current exhibition information.** Browse cards
  now place exhibition content behind a lightweight secondary object label and divider.
- **Reduced exhibition previews to one compact current or relevant exhibition.** The
  browse view keeps the title and compact period only; detailed Fee and Hours metadata
  stays in the detail view.
- **Preserved complete facility and exhibition data in the drawer.** Full introductions,
  exhibition schedules, fees, hours, visit information, sources, and actions remain
  available through the existing detail flow.

### Not changed

- Map Mode, selected-facility rendering, marker selection and clustering, filters, Hero,
  Pass Tracker, visited state, and the existing two-column list grid were not changed.

---

## 2026-08-11 — single selected facility panel in Map Mode (`v61`)

### Fixed

- **Replaced the Map Mode facility feed with a single selected-facility detail panel.**
  The left side now renders only the currently selected facility instead of a second
  copy of the filtered browse results.
- **Fixed List → View on map positioning.** The drawer closes before Map Mode opens,
  the selected facility is passed through the shared detail renderer, and the panel
  resets to its top so the facility title and today's status are immediately visible.
- **Marker selection now replaces map-side detail instead of scrolling a card feed.**
  Switching from one marker to another updates the same panel and keeps the existing
  selected marker state.
- **Removed obsolete map-feed synchronization and selected-card scrolling logic.**
- **Removed the duplicate View on map action inside Map Mode.** Directions and the
  remaining facility actions stay available while List Mode retains its detail drawer.
- **Cleared the selected facility when filters exclude it.** Map Mode shows the
  localized empty state rather than leaving stale detail beside an unrelated map.

### Preserved

- List Mode detail drawer behavior and the shared full facility detail content remain
  intact. Marker clustering, browse cards, filters, Hero, Pass Tracker, and exhibition
  presentation were not changed in this fix.

---

## 2026-08-11 — map marker clustering by zoom (`v60`)

### Added

- **Added map marker clustering at low zoom levels.** The local Leaflet map now
  uses the self-hosted `Leaflet.markercluster` 1.5.3 plugin: low zoom groups
  facilities into restrained green count markers, medium zoom splits those into
  smaller groups and individual markers, and zoom 15+ shows individual facility
  markers. Cluster clicks retain the plugin's natural zoom-to-bounds and
  spiderfy interaction; no facility list popup was added.
- **Added the local clustering dependency and offline assets.**
  `vendor/leaflet.markercluster/leaflet.markercluster.js` and its base CSS are
  bundled with the app, precached by the Service Worker, copied by the Pages
  build, and recorded in `THIRD-PARTY-NOTICES.md`. The plugin's default
  multi-colour CSS is intentionally not loaded, so cluster colour continues to
  express neutral spatial density rather than facility status.

### Changed

- **Cluster counts now reflect filtered facilities.** Each safe filter update
  clears and rebuilds the map layer from `window.filteredCards`, so search,
  opening status, visit state, area/radius, pass, and value filters cannot
  contribute hidden facilities to a cluster count.
- **Preserved selected-facility detail interaction.** Clicking an individual
  marker still calls the existing `selectFacilityCard()` flow and updates the
  map-side facility panel. A cluster containing the selected facility receives
  the existing primary-green selected treatment without changing selection; the
  selected marker remains correct when the map is zoomed back in.
- **Added a graceful fallback.** If the clustering script is unavailable or
  cannot initialize, the map falls back to its existing Leaflet layer group of
  individual markers instead of failing to render.
- **Kept the mobile map usable.** In the existing stacked Map Mode layout at
  widths below 1200px, the map panel now explicitly fills its available width
  instead of shrinking around its contents.
- The shell cache was bumped from `v59` to `v60`.

### Not changed

- Facility Detail Panel information architecture, List Mode Cards, Hero,
  Filters, Pass Tracker, current location, viewport fitting, and List/Map
  switching remain on their existing flows.

---

## 2026-08-11 — reduced facility metadata chrome (`v59`)

### Changed

- **Reduced the facility number to secondary metadata.** Facility numbers now
  keep their existing values but no longer use a logo-like circle, border, or
  filled visited treatment.
- **Removed repetitive unvisited pill treatment.** Ordinary List Mode cards now
  use a quiet icon-only control for unvisited facilities; visited facilities
  retain a compact checked state.
- **Preserved visited behavior.** Visited toggling, Not visited / Visited only
  filtering, Pass Tracker and savings calculations, and persisted local state
  continue to use the existing shared state source.
- **Preserved accessibility behavior.** The existing checkbox, localized
  `aria-label`, keyboard focus ring, and mobile touch target remain available.

### Not changed

- Card content hierarchy, top controls, Hero, Map layout, marker behavior, and
  Drawer content were not changed in this task.
- The shell cache was bumped from `v58` to `v59`.

---

## 2026-08-11 — simplified facility browse cards (`v58`)

### Changed

- **Reduced facility list cards to browse-level information.** List Mode now
  gives the facility title the clearest weight, followed by one quiet status
  line, a compact Pass benefit, and a single featured exhibition summary.
- **Limited default exhibition content to one concise current exhibition.**
  Period and hours are compact metadata without repeated labels; language badges,
  source notes, and detailed fee copy no longer compete in the list card.
- **Moved detailed exhibition metadata to facility details.** The list keeps
  only compact period/hours context; full Fee/Hours fields, additional
  exhibitions, introductions, visit information, contact links, official site
  links, schedules, and brochure content remain available through the existing
  Detail Drawer.
- **Preserved complete detail data in the Drawer.** List-only presentation
  rules do not remove facility, Pass, status, exhibition, or visit data.

### Not changed

- Top controls, Quick Filters, Pass Tracker, Hero, Map Mode layout, marker
  behavior, and the existing Drawer interaction were not changed in this task.
- The shell cache was bumped from `v57` to `v58`.

---

## 2026-08-11 — reduced results and Pass Tracker prominence (`v57`)

### Changed

- **Moved result counts into lower-priority contextual metadata.** The live
  result summary now sits beside the current area or global results heading
  instead of occupying a separate toolbar band.
- **Reduced persistent Pass Tracker prominence.** The results-area summary now
  exposes a lightweight localized “My Grutto Pass” entry; the existing tracker
  opens on demand rather than presenting `0/total` as a permanent chip.
- **Preserved Pass progress and savings functionality.** Visited records,
  savings calculations, pass pricing, clear-history behavior, and the existing
  local storage mechanism remain unchanged.

### Not changed

- Quick Filters, search, date/time, List/Map, facility cards, Hero, map, and
  facility Drawer behavior were not changed in this task.
- The shell cache was bumped from `v56` to `v57`.

---

## 2026-08-11 — simplified default quick filters (`v56`)

### Changed

- **Simplified the default Quick Filters.** The toolbar now exposes only three
  toggle buttons: current open, Grutto Pass admission, and not visited. The
  previous All/Open/Closed/Open now, All/Admission/Discount, and
  All/Not visited/Visited only radio groups are no longer shown by default.
- **Kept full filters available in Filter & sort.** The existing opening-status,
  Pass-type, visit-status, location, value, sort, and latest-exhibition controls
  remain available in the existing panel without changing their filter meaning.
- **Synchronized quick and full filter state.** Quick buttons read and update
  the existing radio inputs, so selecting either surface updates the other and
  preserves the current filter state.
- **Kept the compact responsive behavior.** The three toggles remain inline on
  desktop, can scroll horizontally on narrower toolbars, and continue to use
  the existing mobile Filter & sort bottom sheet for the complete controls.
- The shell cache was bumped from `v55` to `v56`.

### Not changed

- Search, date/time, List/Map, filter logic, data meaning, URL/state/localStorage
  behavior, and all non-toolbar UI remain unchanged.

---

## 2026-08-11 — UI hierarchy simplification (`v55`)

### Changed

- **Reduced the default control surface to a compact two-level toolbar.** Search,
  date/time, view switching, and Filter & sort stay in the primary row; opening
  status, pass type, and visit status are the only always-visible quick filters.
  Location, savings threshold, sorting, and recent-exhibition-only remain in the
  existing filter panel. All labels and accessible names continue to resolve
  through the Japanese/English/Chinese UI dictionaries.
- **Unified the visual palette around Grutto Pass green.** The page now uses a
  warm off-white background, white cards, a solid green header, and green selected
  states. Area-specific accent colors, the large mint control band, navy selected
  controls, and high-saturation status fills were removed from the default path.
- **Converted facility cards into compact comparison summaries.** Cards now lead
  with facility identity, one quiet status line, the pass benefit, and one current
  or nearest exhibition. Phone, website, introduction, closed days, fees, access,
  schedules, brochure links, and map/route actions are retained in the existing
  detail Drawer; map mode reveals the same secondary content in its left panel.
- **Removed ticket-card decoration.** The perforation and side notches are gone;
  cards now use a simple border and spacing hierarchy.
- **Simplified map selection.** Markers use neutral/ muted colors with a green
  selected marker, the status legend and full popup were removed, and marker
  clicks select the corresponding left/stacked facility panel. A hover label keeps
  the facility name available, while directions remain in the facility action area.
- The shell cache was bumped from `v54` to `v55`.

### Not changed

- Facility data, schemas, search/filter behavior, visited tracking, exhibition
  data, and the existing Drawer/map routing functions were not rewritten.
- The map panel remains a split layout on desktop and stacks with the facility
  panel on smaller screens so marker selection still has one detail surface.

---

## 2026-08-11 — map selection uses the existing detail panel (`v54`)

### Changed

- **Removed `View details` / `查看详情` from map popups.** Clicking a marker still
  selects the matching facility card in the desktop map-side list, so that list is
  the single detail surface for map mode instead of opening a duplicate drawer.
- Map popups retain only the compact location/status confirmation and the route or
  map-search action. List mode continues to use the facility detail drawer.
- Added a regression assertion for the marker-to-list path. The shell cache was
  bumped from `v53` to `v54`.

---

## 2026-08-11 — readable time filter control (`v53`)

### Changed

- **The desktop search field now yields a bounded amount of toolbar space.** At
  ≥900px it stays within 320px, leaving room for the adjacent date/time controls
  in all three languages.
- **The native time input now has a 112px desktop track** so the full `HH:MM`
  value and its picker affordance remain visible. The existing narrow-screen
  toolbar layout is unchanged, and the toolbar remains free of horizontal overflow.
- Added a layout regression assertion. The shell cache was bumped from `v52` to `v53`.

---

## 2026-08-11 — equal-height collapsed card rows (`v52`)

### Changed

- **Normal desktop list rows now align their card frames.** At ≥641px the area list
  grid stretches a default collapsed row, while the existing flex footer remains at
  the card bottom and absorbs the extra space between the body and footer. Mobile
  cards remain natural-height.
- **Expanded exhibition cards opt their grid back into natural row heights.** Clicking
  “还有 N 条” records the facility's expanded state and marks its owning grid with
  `has-expanded-card`, so a three-or-more-exhibition card can grow without forcing a
  short same-row card to carry the expanded height. The default two-item policy and
  button wording are unchanged; map split lists are not equalized.
- **Expansion state is restored during language rerenders** and the grid state class
  is recomputed from the current active exhibition data, preventing stale layout
  state. No schema keys, exhibition titles, or `.perforation` rules changed.
- Added layout regression assertions. The shell cache was bumped from `v51` to `v52`.

---

## 2026-08-11 — long-text layout and opaque sticky controls (`v51`)

### Changed

- **English desktop area navigation now has a 240px rail at ≥1200px.** JA/ZH retain
  the existing 190px rail. At 1200px the English main column remains wide enough for
  two cards above the existing 400px minimum, and the longest English area labels fit
  within two lines at 1280px without truncation or horizontal overflow.
- **Exhibition Fee/Hours metadata now has a stable value node.** Period remains a full
  row. English Fee and Hours use one full-width row each with `max-content minmax(0,1fr)`
  label/value columns, so complete sentences do not get split across narrow equal
  columns. JA/ZH keep the compact two-column treatment where it fits, with the same
  `min-width: 0` and `overflow-wrap` protection on values. Japanese schema keys and
  Japanese exhibition titles are unchanged.
- **The sticky controls background is now opaque** (`--brand-green-tint`), preserving
  its border and shadow while preventing card text from showing through during scroll.
- Added layout regression assertions and rechecked the v42/v45 natural-wrapping
  behavior. The shell cache was bumped from `v50` to `v51`.

---

## 2026-08-11 — area contrast and visited-card simplification (`v50`)

### Changed

- **Area accents now have accessible foreground and border tokens.** The original seven
  area hues and their light tints remain the identity layer; each area now also supplies
  a darker `--area-accent-ink` for 13px numbers/chevrons and a `--area-accent-border` for
  circles, area bars, hover borders, and focus boundaries. The resulting small text is at
  least 4.5:1 against the card and area-tint backgrounds, and the meaningful non-text
  graphics are at least 3:1.
- **The warning badge foreground is now `#915000` on `#FEF7E0`.** This keeps the warm
  caution meaning while raising the 13px badge contrast above 4.5:1. The soon and closed
  badge palettes are unchanged.
- **Visited cards no longer receive a gray full-card overlay.** The green check and green
  solid official number remain the primary visited signals; links, titles, body copy, and
  route actions retain their normal enabled appearance and existing focus-visible styles.
  Persisted visited state is also re-synchronized after the initial render and language
  changes, so the solid number is present after reload as well as after a click.
- No data schema, area-to-color mapping, exhibition policy, or UI direction from v42's
  “Rejected after verification” section was revisited. The shell cache was bumped from
  `v49` to `v50`.

---

## 2026-08-11 — keyboard focus and landmark semantics (`v49`)

### Changed

- **Closed filter panels are now inert.** The initial closed state and every closed
  state after a resize remove the panel's controls from keyboard and assistive-technology
  navigation. Opening removes `inert` before the existing mobile bottom-sheet focus move;
  closing returns focus to `Filter & sort` and then restores `inert`. The shared `.open`
  state, existing animation, ≤640px focus trap, ESC handling, backdrop, scroll lock, and
  focus return are unchanged.
- **List / Map is now a named button group.** The controls use `aria-pressed`, while the
  list remains a native `main` landmark and the map remains a named `section`. This
  reflects the ≥1200px split view, where Map mode shows both the map and the list, while
  preserving the existing responsive visibility and layout.
- **The facility drawer exposes one modal dialog.** The outer element is now only the
  layout/backdrop container; `.facility-drawer-panel` remains the single dialog with its
  existing title, focus trap, ESC handling, backdrop, close button, and focus return.
- No data schema, exhibition title translation policy, exhibition folding logic, card
  visual layout, or other UI redesign was changed. The projects rejected in v42's
  “Rejected after verification” section were not redone. The shell cache was bumped from
  `v48` to `v49`.

---

## 2026-08-11 — visit information disclosure refresh (`v48`)

### Changed

- **The card-only `More facility details` disclosure is now `Visit information`** in
  English, `来館案内` in Japanese, and `参观信息` in Chinese. The existing native disclosure
  interaction, collapsed default, card structure, and accessibility behavior remain intact.
- Closed days, Fee, Access, and existing Note content now render as separate information
  groups with clearer label/body spacing. Closure and fee notes retain their original
  conditions, while a single facility-level `Check official site →` link replaces repeated
  generic website prose when a safe facility URL exists.
- Access values are still rendered as source entries with natural wrapping. The current
  source data stores each route as one unstructured string, so no slash-based route parsing
  was introduced.
- No source facility data, facility header, opening status, Grutto Pass benefit, exhibition,
  introduction, visited control, or card/masonry layout was changed. The shell cache was
  bumped from `v47` to `v48`.

---

## 2026-08-11 — compact pass benefit hierarchy (`v47`)

### Changed

- **The card-only Grutto Pass benefit area is now two-layered and more compact.**
  `GRUTTO PASS` and the visitor outcome share the first line with a subtle middle dot;
  the supporting line keeps the saving amount or admission scope and may wrap naturally.
- The existing presentation formatter still handles admission, discount, mixed, and
  generic fallback records without changing source data. English savings copy now uses the
  shorter `Save ¥X`, and the long combined scope is presented as `Permanent collection +
  eligible exhibitions` without changing its meaning.
- The first-line label remains a smaller brand-green category marker while the outcome is
  larger and more prominent. The visited control, card structure, exhibition content,
  opening status, and all other UI regions were left unchanged.
- The current data contains no structured special-price benefit type, so the formatter does
  not infer `Special price` from an admission or discount amount. The existing non-committal
  fallback remains in place for future records that cannot be classified safely.
- The service-worker shell cache was bumped from `v46` to `v47`.

---

## 2026-08-11 — pass benefit copy deduplication (`v46`)

### Changed

- **Card-only Grutto Pass benefit copy is now three-layered without repeating the pass name.**
  The existing `getPassCardSummary()` formatter and card markup remain unchanged; only its
  localized presentation strings were adjusted. The kicker still identifies `GRUTTO PASS`,
  the headline states the visitor outcome, and the supporting line keeps the value or scope.
- Admission benefits now read `Free admission` / `入場無料` / `免费入场`, followed by the
  existing savings or scope text. Discount benefits now read `¥100 off` / `100円引` /
  `优惠 ¥100`, followed by the admission basis. Mixed benefits keep both outcomes, and the
  generic fallback stays non-committal when a future record lacks a reliable type.
- No source data, card structure, visited control, exhibition content, or opening-status UI
  was changed. The service-worker shell cache was bumped from `v45` to `v46`.

---

## 2026-08-11 — narrow-screen layout fixes (`v45`)

### Changed

- **Wrapping pass summaries no longer orphan a divider.** At ≤899px, the summary now
  separates wrapped items with spacing only; the left border and padding are removed so a
  wrapped `Pass savings` / `预计优惠` item cannot leave a vertical line at the edge of its
  row. The ≤640px layout keeps the same rule with a 10px horizontal gap.
- **The enriched-facilities filter label can wrap.** Removed `.toggle`'s `white-space: nowrap`
  so the English label can use the available width. The switch remains non-shrinking via
  `.sw { flex-shrink: 0; }`.
- **Responsive verification:** at 375px with all 108 facilities marked visited, the English
  pass summary stays intact, the filter label ends in “info”, and the switch, select controls,
  and location note remain inside the panel. The narrower boundary case was also checked to
  confirm the fixes address the previously observed overflow and orphan-divider states.

The service-worker shell cache was bumped from `v44` to `v45` so deployed clients do not keep
the pre-fix stylesheet.

---

## 2026-08-11 — brochure introduction translations (`v44`)

Merge `56e6375`. Content-only pass: `descriptionEn` / `descriptionZh` written for all
**109/109** venue introductions (108 cards; No. 103 has two subfacility blurbs). No entry
was skipped. Brochure validation reported `en 109/109 · zh 109/109` with zero
"identical to descriptionJa" warnings; the one remaining WARN is the pre-existing
structural note about No. 103.

The facility introduction is no longer the one long-form field shown in Japanese to every
reader. The "Japanese source" note now disappears on these cards, which is what the
per-card resolver added in `v43` was for.

### Terminology decisions worth remembering

- **東洋 → "Asian" / 亚洲, never 东洋.** In Chinese 东洋 means *Japan*, so a literal
  carry-over inverts the meaning (cards 5, 18, 48). Cards 38 and 68 keep 东方 where the
  source contrasts China and Korea or quotes 「東洋」 as a concept.
- 企画展 → 专题展, 特別展 → 特别展, コレクション展 → 馆藏展 (avoids the
  character-converted 企划展). Cards 53, 69, 83 contain more than one and keep them distinct.
- Third-party names use the organisation's own English branding where it exists:
  寺田倉庫 → "Warehouse TERRADA", 旧横浜正金銀行 → "the former head office of the
  Yokohama Specie Bank".
- Era years are expanded parenthetically when the source gives only the era
  (昭和63年 → 1988), matching how card 5 already writes both.
- Card 49 keeps `《海螺小姐》（サザエさん）` — the only kana in any Chinese string.
  Deliberate: the work is signposted in Japan under the Japanese title.

### Source oddities found while reading all 109 (not fixed)

Cosmetic inconsistencies in the official brochure text, normalized in the translations
only: card 86 uses halfwidth `､` and `ｰ`; cards 6, 20, 37, 41, 81, 97 use full-width
digits where the rest of the file uses halfwidth; cards 22 and 54 use `“”` instead of
`「」`; card 32 writes `「WHATMUSEUM」` without the space its own `nameEn` uses.

### Checked and cleared

Card 71 (Edo-Tokyo Museum) reads as a normally operating museum. It was closed about four
years for renovation and **reopened 2026-03-31**, so the blurb is current. Its admission
changed 600 → 800 yen on reopening, which does not affect this app: `fee` for card 71 is
`※詳細はHPをご確認ください。` and has never hard-coded a price, so the savings calculation
falls back to "value unconfirmed" rather than showing a stale number.

---

## 2026-08-11 — brochure intro translation slot + honest i18n reporting (`v43`)

Merge `66a27e5`.

### Facility introduction can now be translated

The introduction blurb was the only long-form text rendered in Japanese in every
language (`descriptionJa`, present on all 108 cards / 109 venues).



### The i18n coverage report was misleading

The earlier `npm run i18n:report` line `馆名 12/108` counted overlay entries:

- The line counted **only the manual overlay dict** (`data/i18n/facilities.*.js`).
- Effective English facility-name coverage is **108/108**, because
  `englishFacilityName()` in `i18n/ui.js` falls back to the official brochure `nameEn`,
  which is present on every card.
- Chinese deliberately keeps the Japanese proper name where the name is not translatable
  (`chineseFacilityName()`).

The report now labels the overlay line for what it is, prints effective English name
coverage separately, adds a 简介 coverage line, and states in-band that untranslated
exhibition titles are policy rather than backlog.

### Not done, deliberately

**Exhibition titles and summaries stay untranslated.** `i18n:report` shows
`展览标题 6/158` — this is the intended state, not a backlog. Exhibition data updates
monthly, official links are Japanese-only, and a mistranslated 会期 or 料金 can send
someone on a wasted trip. The UI already marks these items 「日文」. Introductions are
treated differently because they come from the *annual* brochure, are descriptive rather
than decision-bearing, and a loose translation costs accuracy of flavour, not a trip.

---

## 2026-08-11 — external UI/UX review follow-up (`v42`)

Merge `074dc51`. Six fixes taken from an external design review; the rest of that
review was verified against the code and rejected.

### Changed

- **Japanese original name now shows in EN/ZH** (`722c542`). The condition was
  `getAppLanguage() === 'ja' && displayName !== f.name` — in Japanese those two are equal,
  so the branch could never fire and `.original-name` was dead code. Same dead condition
  fixed on exhibition titles.
  Regression surface: a second name node inside `.card-title` breaks every
  `textContent` read of the title. Added `facilityCardName()` / `facilityCardOriginalName()`
  and routed all call sites through them — visited-toggle aria-label, drawer title,
  `map.js` marker title / marker tooltip / popup title / `syncMapListCards()`.
  Note the pre-existing `childNodes[0]` idiom was *also* wrong: `childNodes[0]` of
  `.card-title` is the `<button>`, whose `textContent` is the whole title.
- **No hard-coded facility totals in static markup** (`2e5d889`). `#resultsSummary`,
  `#filtersApplyLabel`, `#passTrackerChipLabel` shipped literal `108件を表示` /
  `PASS ¥2,500 · 0/108` as pre-init placeholders. Emptied; JS is the sole writer.
  Their `data-i18n` attributes were removed too — those keys are `{count}` templates and
  `applyUiTranslations()` does a bare `textContent = uiText(key)`, which would have
  flashed a literal `{count}件を表示` on language switch.
- **Removed the duplicate pass price** (`bcd90b4`). `#passPriceSummary` restated
  `PASS ¥2,500` next to `#passResult`, which already expresses it usefully
  (`あと ¥740` / `+¥920`). Key `pass.priceLabel` dropped from all three languages.
  The results-bar chip is untouched — it and the tracker section are mutually exclusive.
- **One language switch per viewport** (`e619dd4`). `.filters-language-row` was
  `display:flex` at every width, so desktop showed it *and* the header switch whenever the
  filter panel was open. Now shown only in the ≤640px bottom sheet.
- **Map marker accessible name carries opening status** (`9160eed`). Open/closed was
  colour-only on the marker; the popup had to be opened to read it. Pass type already
  encodes shape (solid/dashed ring), so no colour scheme changed.
- **Long EN/ZH labels wrap instead of clipping** (`3eafaa0`). Worst case:
  `.pass-tracker-summary` was `flex-wrap:nowrap` + `white-space:nowrap` + `overflow:hidden`,
  so the English progress line was **silently truncated** with no scrollbar and no ellipsis.
  Also `.pass-tracker-head h2`, `.pass-unknown-note`, `.status-filter-label`, and the
  ≤899px `.date-picker-wrap` fixed `120px`/`70px` columns → `minmax(0,1.4fr)`/`minmax(0,1fr)`.

### Known residuals from this release (closed in `v45`)

These were browser-only residuals at the time of `v42`. They were later reproduced at the
narrow boundary and fixed in `v45`; the notes remain here as historical context.

1. `.pass-tracker-summary` could carry an orphan divider when `#valueSummary` wrapped.
   **Fixed in `v45`** by removing the divider at ≤899px and using spacing instead.
2. `.toggle` (`filters.onlyEnriched`) could clip the long English label at a narrower
   width or larger text size. **Fixed in `v45`** by allowing the label to wrap while keeping
   the switch non-shrinking. The related `.select-control` and `.geo-note` were checked and
   did not require a change.
