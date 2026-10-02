# Grutto Pass Exhibition Guide

A static list and map guide to facilities covered by Tokyo's Grutto Pass. It is designed for checking what is open right now while out and about, with PWA and offline support.

> Maintainer documentation. The public page supports Japanese, English, and Chinese. This README is written in English for operators and developers.

---

Accepted product and release history is in [`CHANGELOG.md`](CHANGELOG.md).

## What this is

- Includes **108 facility cards**. The official facility numbering has 107 numbers; No. 36 contains two facilities, Tokyo City View and Mori Art Museum. The brochure describes 109 venue entries because No. 103 also describes two museums; the app keeps those two at one combined card so its existing `_key` and map data remain stable. The 2026 Grutto Pass is valid from 2026-07-25 through 2027-03-31.
- Each facility includes **opening hours, closure days, exhibitions, and coordinates**. Based on the current time in Japan, facilities are color-coded as **open / last admission soon / closed**.
- Supports switching between a **map view** (Leaflet + OpenStreetMap tiles) and a **list view**.
- **Three-language UI:** Japanese, English, and Chinese share one buildless translation table. The language is selected from `?lang=`, `localStorage`, or the browser language.
- **Offline support:** the Service Worker caches the app shell and visited map tiles. The page uses system fonts and does not depend on an external font CDN.

---

## Architecture

**The application itself is a buildless static site.** Opening `index.html` through an HTTP server is enough to run it. Runtime data and logic are loaded through external `<script>` tags.

The optional `npm run build:pages` command packages the runtime files into
`.cloudflare-dist/` for Cloudflare Pages deployment. It also has an explicit
`npm run build:pages:canary` preview command; it writes `.canary-preview/` and
does not change the production publication cohort.

```
index.html                  Page markup, CSS, and initialization logic (no data)
404.html                    Explicit Cloudflare Pages not-found response
i18n/ui.js                  UI translations, language state, runtime copy, and overlay fallbacks
config.js                   Year, pass period, and sources (CONFIG); update this for each cycle
data/facilities.js          Facility data (facilities, exhibitions, closure data); main monthly update target
data/facility-corrections.js Reviewed overrides for brochure-confirmed corrections that have not yet been folded into the generated DATA blob
data/facility-brochure.js   Runtime projection of official names, card/venue structure, and brochure page locators (no prose)
data/facility-summaries.js   Approved PYOKO-authored Facility Introduction projection (the only public Introduction copy)
data/facility-access-presentation.js Approved source-matched Japanese access projection
data/facility-pass-benefits.js Scoped Pass entitlement and value authority
data/facility-official-sources.js Accepted official source-role registry and provenance/page constants
data/facility-pass-time-scope.js Time-scoped Pass admission windows
official-source-runtime.js Source lookup, provenance, PDF links, and contextual CTA resolution
pass-time-scope-runtime.js Pass admission-window and availability resolution
exhibition-meta-runtime.js Exhibition date inference, metadata resolution, and accepted overrides
data/exhibition-meta.js     Exhibition periods, exceptional fees, notes, and verification dates; monthly update target
data/i18n/facilities.en.js  Sparse reviewed English venue/area/exhibition overlays
data/i18n/facilities.zh.js  Sparse Chinese venue/area/exhibition overlays with safe localized fallbacks
data/search-aliases.js       English, Chinese, and romanized venue aliases
data/holidays.js            Japanese public holidays (HOLIDAYS), updated by year
coords.js                   Facility coordinate table (COORDS), sourced from OpenStreetMap / Nominatim
phase1/hours.js             Opening-hours table (HOURS)
status.js                   Opening-status rules (weekday, holiday, exhibition period, closures; checkStatus)
phase1/phase1-open-now.js  "Open now" logic (including computeNowState)
phase2/phase2-nearby.js    Distance from the current location and nearby sorting
map.js                     Map rendering (Leaflet, marker clusters when available)
facility-presentation-model.js DOM-free semantic facility projection shared by browser and static-page generation
sw.js                      Service Worker and offline cache
vendor/leaflet/            Bundled Leaflet 1.9.4 (local; no CDN)
vendor/leaflet.markercluster/ Bundled Leaflet.markercluster 1.5.3 (local; no CDN)
assets/social/              Dedicated social sharing image assets
about/                      Multilingual product identity and trust pages (ABOUT-001), explicitly allowlisted
guides/grutto-pass-before-you-go/index.html One explicitly allowlisted static owned guide (OWNED-GUIDE-001)
docs/brand/                 Brand and social visual guidelines
favicon.svg                 Original site favicon source
favicon-32x32.png          PNG favicon fallback
apple-touch-icon.png        180px Apple touch icon
test/*.test.js             Public product tests using Node's built-in node:test (zero dependencies; no build required)
scripts/validate-data.js   Data validation (structure checks plus opt-in link checks)
scripts/facility-direct-url-registry.js Stable card-key → canonical slug registry, canary candidates, and publication authority (build/test only)
scripts/facility-direct-url.js Static facility-page/index/sitemap renderer using the shared projection
scripts/build-pages.js     Packages the static runtime files and invokes the safe production/canary surface owner
.github/workflows/ci.yml   Runs npm test and npm run validate on every push
```

### Brand and social visual guidance

Branded social images, Open Graph variants, campaign cards and generated visual
directions must follow
[`docs/brand/pyoko-sns-visual-guidelines.md`](docs/brand/pyoko-sns-visual-guidelines.md).
The guide is intentionally separate from the runtime app: it protects the
PYOKO Forest identity, the two-O hopping language, the product-green semantic
boundary and the independent/unofficial relationship to Grutto Pass without
adding design files to the public build.

All runtime files assign globals through ordinary `.js` files, such as `const DATA = …`, and are loaded with `<script>` tags. There is no bundler and no runtime `fetch()` needed to assemble the application. The data files remain close to JSON in style, which keeps diffs easy to review. The official-source, exhibition-meta, and Pass time-scope data files declare accepted data/constants; each is followed immediately by its corresponding root-level runtime file before consumers load. Browser, static renderer, validator, and manual test loaders use this same data-before-code contract.

### Multilingual maintenance boundary

The project separates the stable UI shell from content data:

- `i18n/ui.js` contains stable buttons, filters, field labels, statuses, map text, and explanatory copy. Changing language re-renders the cards, so stale-language text is not left in runtime state or map dialogs.
- `data/facilities.js` and `data/exhibition-meta.js` remain the Japanese source of truth. Japanese keys such as `料金`, `時間`, and `概要` are schema keys and must not be renamed for display-language reasons. Amount calculations and status parsing continue to read the Japanese source values.
- `data/i18n/facilities.en.js` and `.zh.js` are sparse overlay files for venue names, areas, and exhibition content, with complete per-facility access translations maintained alongside them. Add only reviewed venue names, area names, access routes, and high-value exhibition titles or summaries. Each exhibition overlay key has the form `facility _key::official URL::Japanese title`. English and Chinese venue cards use the access overlays first and normalize other common closed-day and fee facts at runtime, showing a localized official-site message only if a safe translation is unavailable. Official English facility names from the brochure fact layer are used as the fallback when no reviewed display overlay exists. PYOKO-authored Facility Introductions stay visible on facility cards, while closed days, fees, access, and notes stay in the facility-details disclosure: Japanese shows the original, while English/Chinese label the original as a Japanese source only until a translation is reviewed. Exhibition cards currently follow a conservative Japanese-source policy: non-Japanese interfaces show the Japanese exhibition title, mark the details as Japanese-only, and do not display exhibition title/summary/notice overlays until both the translation and destination language have been reviewed. Existing exhibition overlays remain searchable and can be re-enabled as explicit verified exceptions. When a non-Japanese venue name is available, keep the Japanese original as well.
- `data/search-aliases.js` is the vocabulary for alternate English, Chinese, and romanized terms. Its first English facility alias also supplies the English-name fallback described above; the remaining aliases stay search-only. `scripts/validate-data.js` requires one facility alias record for every facility key and rejects orphaned keys.
- `data/facility-brochure.js` carries only the official brochure's runtime identity and structure projection: Japanese/English names, the No.103 subfacility split, and per-card PDF page locators. Official brochure prose is not a runtime Facility Introduction; `data/facility-summaries.js` owns the only public Facility Introduction copy. Public Node tests check the accepted projection structure and reject runtime prose fields.
- `facility-presentation-model.js` is the shared semantic boundary for Pass clauses/reference values, approved-or-raw access, approved Introductions, stable hours, exhibition facts, source roles, and `FULL` / `DEGRADED_SAFE` / `UNSAFE` state. It is DOM-free and is consumed by the browser and the Node static renderer, so a page cannot quietly invent a second interpretation.
- Direct facility URLs are identity-first: `scripts/facility-direct-url-registry.js` maps each current card `_key` to one stable `/facilities/<slug>/` path. `CANARY_CANDIDATES` remains the explicit nine-facility technical-preview authority, while `PUBLICATION_APPROVED` is a separate explicit nine-facility publication authority. Their membership currently matches by decision; neither authority is derived from the other, and no slug is derived from a display name during a build.
- The current release-preparation state makes the normal `npm run build:pages` output emit the homepage, `/facilities/`, the nine approved facility pages, the three explicitly allowlisted ABOUT-001 pages, the one explicitly allowlisted owned guide, the matching 15-URL sitemap, and the existing low-weight homepage crawl links. `npm run build:pages:canary` remains a deterministic review mechanism over `CANARY_CANDIDATES`; it does not change publication approval, and its sitemap omits the About pages and owned guide's static path. About pages, facility HTML and its stylesheet, and the owned guide HTML are never install-pre-cached by `sw.js`.
- `scripts/validate-data.js` reports orphaned overlay areas, venue keys, and exhibition keys as errors. Missing translations do not block validation. Run `npm run i18n:report` to review language coverage and decide the next translation scope. Note that its per-locale line counts **only the manual overlay files** — effective English facility-name coverage is higher because the official brochure `nameEn` is used as a fallback, and the report prints that separately. The low exhibition-title numbers are the deliberate Japanese-source policy described above, not a backlog.

For monthly updates, update the Japanese data and publish first, then add or revise the two overlay files as needed. Whenever i18n resources change, also bump `CACHE_VERSION` in `sw.js`; otherwise offline users may continue to use an old app shell.

### Operational notes

- The date picker covers 2026-07-25 through **2027-03-31**, the validity period of the 2026 pass. The 2027 public holidays are already registered in `data/holidays.js`. When moving to the next pass edition, update the period in `config.js` and replace the relevant holidays in `data/holidays.js`.
- **What ships is an allowlist, and it is enforced.** `scripts/build-pages.js` copies only the runtime files, and then fails the build if anything under `data/` was published that is absent from `SHELL_ASSETS` in `sw.js`. Directories are copied recursively, so the guard prevents an unused data file from becoming publicly retrievable by accident.
- **Explicit static page ownership.** ABOUT-001's three multilingual product identity/trust pages and the OWNED-GUIDE-001 guide are listed as individual files in `scripts/build-pages.js`, rather than copied directories. Their canonical paths are explicit entries in `STATIC_INDEXABLE_PATHS` in `scripts/facility-direct-url.js`; the canary preview publishes none of them. ABOUT-001 is product documentation, not an owned-guide system, content directory, or provenance-data layer.
- **One explicitly allowlisted owned guide.** `guides/grutto-pass-before-you-go/index.html` (plus its one image) is a static, hand-maintained public page, listed as explicit files in `scripts/build-pages.js` rather than a copied `guides/` directory, so a future unrelated file placed under `guides/` does not ship by default. This is one bounded, evidence-gated artifact accepted as OWNED-GUIDE-001; it does not imply generic content-directory publication or a guide-generation system.
- **Terms are stated, not assumed.** `LICENSE` grants MIT permission only for eligible PYOKO-owned implementation; the separate data/content terms reserve only eligible original expression and protectable compilation elements. Underlying facts and third-party expression are not claimed as PYOKO-owned. `robots.txt` leaves public runtime resources crawlable so normal web search remains available, and allows verified AI search/discovery and user-directed retrieval agents when providers expose separate controls. Known model-training/model-development agents remain blocked; when a provider's current control combines training with other uses, PYOKO preserves the no-training boundary. Robots is not a security boundary, and internal review/source material is excluded by the production build. The same statement is shown to readers in all three languages under the footer's *Data & sources*.
- **Browser-stored state** is versioned per pass year and never leaves the device: `…:visited:v1`, `…:wantToGo:v1`, `…:filters:v1`, plus `grutto-pass-lang`. The filters key holds only preference-like conditions — the search box, the geolocation radius and the date/time are deliberately excluded, because restoring them after a reload would assert something untrue (a stale date would report an earlier day's opening status as today's). Stored values are validated against the controls actually present, so renaming or retiring an option in a monthly release degrades to the shipped default rather than stranding the UI.

---

## Run locally

Because of the Service Worker and relative paths, serve the project over HTTP instead of opening it with `file://`:

```bash
python3 -m http.server 8000
# Open http://localhost:8000/index.html
```

After changing the Service Worker, open DevTools → Application → Service Workers and click **Unregister** before reloading, or open the page with a `?v=` query parameter.

---

## Cloudflare Pages deployment

The production branch is connected to Cloudflare Pages. Validate a candidate,
inspect its exact-head Preview, and obtain owner release approval before merge.
A push or PR does not itself authorize production deployment.

The repository includes a small packaging step for Cloudflare Pages:

```bash
npm run build:pages
```

The command recreates `.cloudflare-dist/` and copies the deployable runtime files there, including `index.html`, `404.html`, JavaScript, `i18n/`, `data/`, `phase1/`, `phase2/`, `assets/`, the favicon files, `vendor/leaflet/`, `vendor/leaflet.markercluster/`, `LICENSE`, `DATA_AND_CONTENT_TERMS.md`, `THIRD-PARTY-NOTICES.md`, `robots.txt`, the explicitly allowlisted About files, and the explicitly allowlisted `guides/grutto-pass-before-you-go/` owned guide. It generates the single production-owner `sitemap.xml` from the homepage, `/facilities/`, the nine explicit `PUBLICATION_APPROVED` facility URLs, the three About paths, and the owned guide's static path.

For a deterministic local canary preview, run `npm run build:pages:canary`. It recreates `.canary-preview/` with only the explicit `CANARY_CANDIDATES`, `/facilities/`, their generated pages, and the matching sitemap. This is a review artifact, not a deployment command; do not point the production Pages project at it. A pushed release-preparation branch is prepared for deployment review, not a production deployment.

The top-level `404.html` is intentional. Cloudflare Pages uses a top-level 404 page to distinguish this static site from a single-page application; without it, an unknown path such as an excluded review JSON file can fall back to `index.html` with a `200` response.

For a Pages project connected to GitHub, use:

```text
Production branch:       main
Framework preset:        None
Root directory:          /
Build command:           npm run build:pages
Build output directory:  .cloudflare-dist
```

Do not use `npx wrangler deploy` for this Pages setup. That is the Workers deployment flow. The local `.cloudflare-dist/` and `.canary-preview/` directories are ignored by Git because they are generated during local builds.

---

## Licence and reuse

- **Code:** PYOKO-owned software and functional implementation are under the
  scoped [MIT licence](LICENSE).
- **Curated data and authored content:** Protectable PYOKO-owned compilation
  elements and original prose are addressed by
  [Data and Content Terms](DATA_AND_CONTENT_TERMS.md). Public facts are not
  exclusively claimed; publication of data files is not a general open-data
  licence.
- **Third-party material:** Official wording, facility material,
  OpenStreetMap-derived coordinates, and bundled vendors retain their own
  rights. See [Third-Party Notices](THIRD-PARTY-NOTICES.md).
- **Brand:** The PYOKO name, logo and Forest identity are not granted by MIT.

A file extension is not a licence class. Runtime algorithms in `.js` may be MIT
code; curated records in `.js` follow the data/content and third-party terms.
Functional HTML/CSS implementation can be MIT while embedded prose and brand
material remain separately scoped. `vendor/**` follows upstream licences.
The combined terms also grant the official Grutto Pass operator a narrow,
royalty-free permission for eligible PYOKO-owned reserved material.

---

## Tests

Opening-status logic is made of pure functions, so it can be tested with Node alone (no build and no dependencies):

```bash
npm test        # = node --test test/*.test.js
```

`test/load.js` loads `hours.js`, `status.js`, and `phase1-open-now.js` into Node's `vm` without modifying the source. The `test/*.test.js` files check: before opening, open, within 60 minutes of last admission, last admission passed, closed for the day, weekday extensions, the 9/1 seasonal switch, reopening after a long closure, weekly closure, holiday closure, open-on-holiday plus next-weekday closure, and outside exhibition periods.

**Always run the tests before and after a data-related pull request**, especially when changing `hours.js` or `status.js`.

### Release safety suite

The public release gate runs Node product/schema/behavior tests, public
validators, the production build, then the Chromium and WebKit browser suite.
It runs without private source or review evidence:

```bash
npx playwright install chromium webkit   # first setup only (Node 20+)
npm run test:release
```

`npm run test:e2e` runs the browser layer alone. Playwright starts a local
Python HTTP server from `playwright.config.js`; tests clear browser storage,
set an explicit date/time and language, capture page errors and `console.error`,
and run without arbitrary sleeps. OpenStreetMap tile requests are fulfilled by
a transparent local test image. Google Maps and official-site links are
checked only as outbound URL/target contracts—the third-party pages are never
opened.

The release matrix and manual visual scope are documented in
[`docs/release-test-matrix.md`](docs/release-test-matrix.md) and
[`docs/release-smoke-checklist.md`](docs/release-smoke-checklist.md).

### Data validation

```bash
npm run validate         # Fast structural validation; exits 1 on errors
npm run validate:links   # Also checks official links; slow, warning-only, opt-in
npm run i18n:report      # Japanese/English/Chinese overlay coverage
```

`scripts/validate-data.js` checks facility-card counts, official-number counts, duplicate `_key` values, key alignment across `HOURS` / `COORDS` / `DATA`, opening-hours formats (`open < close`, `HH:MM`, weekday keys 0–6, seasons, and special dates), Japanese coordinate bounds, expired `closedUntil` values, holiday date formats, holiday coverage across the pass period, exhibition URL/period/verification formats, facility and exhibition source URLs, orphaned `EXHIBITION_META` keys, `checkedAt` / `source` format and freshness, `CONFIG` validity, and orphaned i18n overlay keys.

Exhibitions whose periods cannot be inferred are reported as warnings and displayed as “period unconfirmed”. Link checks are always **warning-only** because external HTTP behavior is unstable and many sites reject `HEAD` requests, which can create false positives. CI (`.github/workflows/ci.yml`) runs `npm test` and `npm run validate` on every push; it does not run link checks.

Public validation and CI use only public product inputs.

---

## Opening-hours data (`phase1/hours.js`)

Use one entry per facility. The runtime (`phase1-open-now.js`) only performs direct table lookups. Rules such as “the last Friday of each month” should be expanded into dates rather than interpreted by the runtime.

```js
"19": {
  d: [["11:00", "18:30"]],       // Default opening intervals
  w: { "5": [["11:00", "20:00"]] }, // Optional weekday override (0=Sun … 6=Sat)
  last: 30,                        // Minutes before closing for last admission
  closedUntil: "2026-10-31",      // Last closed date; opens again the next day
  seasons: […],                    // Optional seasonal hours
  special: [                       // Date-specific overrides; higher priority
    { dates: ["2026-07-31", "2026-08-28", …], ranges: [["11:00", "20:00"]], last: 30 }
  ],
  checkedAt: "2026-08-09",        // Date the source was checked
  source: "https://…"             // Source URL
}
```

**`special` (date-specific extensions and similar overrides)**

- `dates` is an array of concrete dates. The runtime checks exact matches only.
- Do not manually expand recurring rules such as “last Friday of the month” or “the day before a public holiday”. Generate the dates with the helper:

  ```bash
  node scripts/materialize-special.js
  ```

  Run it again after changing the period in `config.js`.
- Be conservative. Add extensions only when they are a standing facility policy, such as the National Film Archive's regular last-Friday extension to 20:00. Do not add exhibition-specific extensions. Omitting an uncertain extension produces a safe “closed” result; adding an incorrect extension can falsely report that a facility is open.

**`checkedAt` / `source`**

- These fields are optional, but recommended whenever opening hours or closures are edited, especially for time-limited information such as `closedUntil` and `special`.
- The validator checks their date/URL format and warns when `checkedAt` is more than 180 days old. Add them gradually to facilities as they are reviewed rather than trying to update all 108 at once.

---

## Monthly data maintenance

Keep the Japanese facility and exhibition data current against official Pass,
facility, and exhibition sources. The official Pass source determines entitlement
scope; facility sources determine current operating facts and prices for the
matching scope. Preserve source URLs and check dates in the public runtime
provenance fields. Update `data/exhibition-meta.js` only where ordinary schedule
lines cannot express the accepted period or an exceptional condition applies.

Run `npm test` and `npm run validate` after data changes. Bump `CACHE_VERSION`
in `sw.js` whenever an install-pre-cached shell asset changes, then check the
production build and affected pages. Internal source acquisition and evidence
review are maintained separately from this public development reference.

### Regenerating coordinates

`phase2/build-coords.js` is a maintenance-time Node CLI that geocodes facilities
through the public OpenStreetMap Nominatim service. It is not browser runtime
code and is excluded from the production build. Run it from the repository root
with your own contact URL or email address:

```bash
NOMINATIM_CONTACT="https://example.com/contact" node phase2/build-coords.js
```

The contact is sent in the User-Agent to identify you, the maintainer running the
tool, to the public service. There is no default: if `NOMINATIM_CONTACT` is
missing or blank, the tool exits before sending any request or writing
`coords.js` / `coords-review.md`. You remain responsible for following the
Nominatim usage policy.

---

## Roadmap

1. ~~Git / README / local Leaflet~~ ✅ Complete
2. ~~Tests for “open now” status~~ ✅ Complete (`status.js` split out + `test/`, `node --test`)
3. ~~Separate `DATA` and add config~~ ✅ Complete (`data/facilities.js`, `data/holidays.js`, `config.js`; no application bundler)
4. ~~`validate-data` script~~ ✅ Complete (`scripts/validate-data.js` + CI; link checks are warning-only and opt-in)
5. ~~Special-opening-date model and provenance (`checkedAt` / `source`)~~ ✅ Complete (`special` + `scripts/materialize-special.js`; validator support, with provenance added gradually as facilities are reviewed)
6. ~~Admin UI / automatic scraping~~ Deferred because the cost-benefit tradeoff is low.

The original roadmap is complete. Ongoing work is monthly data maintenance and gradually adding `checkedAt` / `source` as facilities are reviewed.

---

## Credits

- Map tiles and coordinates: **© OpenStreetMap contributors** (ODbL)
- Facility information: individual facility websites and the official Grutto Pass information from the [Tokyo Metropolitan Foundation for History and Culture](https://www.rekibun.or.jp/grutto/)

The information is for guidance only. Before visiting, check each facility's official website for the latest opening hours and closure information.
