# Grutto Pass release test matrix

Status: public validation ownership updated 2026-09-28 (M1).

This matrix prioritizes user-visible release failures over implementation
coverage. The existing Node suite remains the source of truth for data and pure
status logic; the new browser suite covers the smallest set of real flows that
can regress through rendering, cloning, state synchronization, or responsive
layout.

## Audit summary

| Layer | Existing coverage | Gap carried into release suite |
| --- | --- | --- |
| Data validation | `npm run validate` checks 108 cards, keys, hours, coordinates, exhibitions, sources, overlays, and config | No browser proof that validated data boots and renders in all locales |
| Runtime projection validation | Public Node tests prove brochure structure, Access presentation, and approved Introduction behavior from committed product data | Source equivalence is outside the public release gate |
| Pure/unit | `npm test` runs public Node tests for open/closed status, closures, exhibition periods, i18n, brochure, Access/Summary production projections, and map clustering seams | No browser proof of date/time refresh, selected detail, or fallback presentation |
| DOM/source contracts | `test/offline-shell.test.js`, `test/layout.test.js`, `test/status-i18n.test.js` cover markup, CSS invariants, keyboard contracts, and offline asset wiring | Static assertions cannot catch runtime exceptions, failed clicks, duplicate cloned IDs, or actual overflow |
| Browser E2E | None before this audit | Add one Chromium Playwright suite with deterministic date/time, language, and storage state |
| Screenshot/visual | No screenshot runner; changelog records manual responsive checks | Keep gross structure assertions automated; retain a short manual visual checklist |
| Accessibility | Existing semantic/keyboard source contracts; no axe runner | Browser checks for dialog semantics, names, focus return, keyboard smoke, and drawer trap |

## Coverage matrix

| Flow / invariant | Risk | Existing coverage | New test | Layer |
| --- | --- | --- | --- | --- |
| Initial load in JA / EN / ZH | P0 | i18n key/data tests; no boot test | Yes: main, cards, filters, List/Map, page errors, unhandled rejections, console errors | Browser |
| No `[object Object]`, `undefined`, `null`, or `NaN` in user text | P0 | Renderer/source fragments only | Yes, all three locales and key detail surfaces | Browser |
| Facility card opens Drawer with No.52 identity, status, Access, Pass, Introduction | P0 | Access/Summary renderer unit seams | Yes | Browser |
| Drawer close button and Escape | P0 | Static close/focus contracts | Yes | Browser |
| Drawer focus returns to title trigger | P0 | Source contract mentions focus lifecycle | Yes | Browser |
| Drawer is one named modal dialog | P0 | Static `role`/`aria` assertions | Yes: role, `aria-modal`, name, close name | Browser |
| Drawer clone has no duplicate IDs | P0 | `stripIds` source contract only | Yes after opening | Browser |
| List → Map preserves selected facility | P0 | Map VM tests cover focus seam, not DOM flow | Yes | Browser |
| Map detail title/status/Access/Pass/Introduction match selected facility | P0 | Map/static hierarchy contracts | Yes for No.52 | Browser |
| Map detail has no duplicate `地図を見る`; route remains | P0 | Static map action assertion | Yes in rendered panel | Browser |
| Map selection changes to B and resets detail scroll | P0 | Map VM selection/focus tests | Yes where marker interaction is stable; use existing marker click path | Browser |
| Search in JA / EN / ZH uses names from production DOM/data | P0 | Search alias and i18n unit tests | Yes; query is derived from real rendered localized name | Browser |
| Empty search and clear action | P0 | Filter recovery source contract | Yes | Browser |
| Search followed by language change | P0 | i18n fallback tests | Yes; assert intended localized query/result behavior | Browser |
| Quick filter and Filter & sort state synchronize | P0 | Static quick-filter wiring | Yes for admission and not-visited | Browser |
| Filter result count changes and clear restores baseline | P0 | Filter logic source assertions | Yes | Browser |
| Mark visited while no visit filter is active keeps card visible | P0 | Static `visited-change` contract | Yes (historical v50/v70 risk) | Browser |
| Visited persists across rerender/language change and localStorage is isolated | P0 | Storage-key source contract | Yes with per-test reset | Browser |
| Not visited filter excludes a newly visited card without crash/jump | P0 | Filter predicate source assertion | Yes | Browser |
| My Pass reflects mark/unmark | P0 | i18n/markup contracts only | Yes | Browser |
| No.52 JA Access is three presentation lines with all route facts | P0 | `facility-access-production.test.js` accepted projection and rendering | Yes rendered line count and semantic fragments | Browser |
| No.52 EN/ZH use localized Access, not JA sidecar | P0 | i18n/access unit tests | Yes rendered language smoke | Browser |
| No.18 / No.87 raw JA fallback retains source facts | P0 | Access production fallback unit test | Yes rendered fallback semantics | Browser |
| No.97 protected slash remains one destination | P0 | Access production unit test | Yes rendered destination count/text | Browser |
| No.20 `直結` stays direct connection; no invented 徒歩0分 | P0 | Access production unit test | Yes rendered semantics | Browser |
| Approved Introduction (No.52 / No.50), No.103 two venues | P0 | Summary production unit tests | Yes Drawer detail rendering and venue paragraph count | Browser |
| Browse and Detail use the same approved Introduction copy | P0 | Summary renderer unit test | Yes card-vs-drawer text ownership | Browser |
| Approved Introduction attribution and missing-copy behavior | P1 | Current intended rule is locked in Summary unit tests | Yes browser confirmation; no production behavior change | Browser |
| Deterministic status: before/open/last admission/closed/long closure | P0 | Pure status tests cover representative transitions | Yes selected date/time updates card and Drawer | Browser |
| Date/time change refreshes open Drawer status | P0 | `refreshFacilityDrawer` source seam only | Yes | Browser |
| Current / near-upcoming / expired exhibition semantics | P0 | Exhibition period unit tests and renderer contracts | Yes: No.2 current/near-upcoming, No.8 expired, selected date; no far-future record exists in the current catalog window | Browser + Node |
| Global horizontal overflow at key states | P1 | CSS/source assertions and historical manual QA | Yes at 320, 375, 390, 1024, 1440 for List/Drawer/Map/Filters/My Pass | Browser |
| Mobile Hero metadata and List/Map controls visible | P1 | Responsive behavior recorded in changelog | Yes 320/375/390 structural smoke | Browser |
| Mobile List/Map labels, No.2/52/101/107, long facility name | P1 | Static nowrap/CSS contracts | Yes bounding-box/line-count assertions at 375; current catalog has no No.108 | Browser |
| Long JA Access and long EN/ZH Drawer copy stay usable | P1 | Layout source contracts | Yes 320/375/390 Drawer overflow and button visibility | Browser |
| Drawer body scroll and close reachability on mobile | P1 | Static drawer CSS/keyboard contracts | Yes at 375 with long facility | Browser |
| Map/panel both have non-zero layout at desktop | P1 | Map CSS/source contracts | Yes at 1024 and 1440 | Browser |
| Keyboard: Tab/Enter opens, Escape closes; Filter/List/Map operate | P1 | Static keyboard semantics | Yes | Browser |
| Drawer focus trap, if current design contract remains | P1 | Source trap implementation | Yes Tab cycle plus invoker return | Browser |
| Primary controls have accessible names | P1 | Partial static markup checks | Yes Search, Filter, List, Map, language, close, Visited, route, clear | Browser |
| Fine typography, color nuance, map tile appearance, touch feel | P2 | Manual changelog QA only | No brittle automation; retain checklist | Manual |

## Release gate

- `npm run test:release` must pass before release: public Node tests → public
  validators → production build → public E2E (Chromium and WebKit).
- Public Node discovery is limited to `test/*.test.js`.
- The gate uses only public repository inputs.
- Any P0 failure blocks release.
- Any P1 failure involving overflow, a broken primary interaction, or an
  inaccessible primary action also blocks release.
- Map tiles, Google Maps, official-site availability, external fonts, and
  third-party page content are outside this gate. Browser tests block map tile
  requests and inspect only our DOM and outbound URL/target contracts.
