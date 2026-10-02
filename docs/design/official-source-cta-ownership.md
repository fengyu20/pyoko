# Official Source Registry & Contextual CTA Ownership

**Status:** foundation (the semantic model and renderer contract are live; the
per-facility data population is delegated to the follow-up audits).

**Source of truth:** `data/facility-official-sources.js` is the single shared
registry for "why a URL exists" on a facility card. A URL's meaning is decided
during data preparation — never by the renderer guessing from a pathname,
domain, or file extension. The runtime only consumes already-classified source
records.

---

## 1. Frozen decisions

1. **Facility homepage = global utility destination.** It answers "I want to go
   straight to this facility's official site." It is owned by the Detail Header
   globe and is never a contextual section's evidence source.
2. **Contextual CTA = the most specific official page** that supports or expands
   the current section (Pass, Exhibition, Opening Hours). A section CTA exists
   only when a source record with a matching semantic `relation` exists.
3. **Homepage-only must not be duplicated inside contextual sections.** "No
   precise contextual source is better than a misleading generic homepage CTA."
   When only a homepage exists, the globe is responsible and the contextual CTA
   is omitted.
4. **Pass entitlement evidence and facility operational confirmation are
   separate semantic roles.** `entitlement_evidence` (Grutto Pass's own source)
   and `pass_confirmation` (the facility's own page naming the Grutto Pass) are
   distinct relations and never share a label.

---

## 2. Semantic roles

| Concept | Question it answers | Default in UI |
| --- | --- | --- |
| A. `homepage` | "Take me to the facility's official site." | Detail Header globe |
| B. `entitlement_evidence` | "Why does the site believe this Pass benefit exists?" | Pass section CTA |
| C. `pass_confirmation` | "Does the facility's own page name the Grutto Pass for the current year / facility / benefit?" | Pass section CTA |
| D. `context_confirmation` | "Which page helps verify the current exhibition / hours / admission (without proving the Pass)?" | Exhibition / Hours CTA |
| E. `editorial_fact_source` | "Where did the Facility Introduction facts come from?" | Internal provenance only (no UI CTA) |

`context_confirmation` always has `confirms_pass_entitlement = false`. The
relation — never the flag — selects the label, so a `context_confirmation`
source can never be described as "Facility confirms Grutto Pass".

`pass_confirmation` requires the facility's own page to explicitly name one of:
`ぐるっとパス`, `ぐるっとパス2026`, `東京・ミュージアム ぐるっとパス`,
`Grutto Pass` — applicable to the current year, facility, and benefit. A page
that only lists admission/hours is `context_confirmation` or
`operational_source`, not `pass_confirmation`.

---

## 3. Source record schema

```js
{
  url,                         // required
  authority,                   // facility | grutto_pass | operator | municipality
  page_type,                   // homepage | official_pdf | pass_guidance | exhibition |
                               // exhibition_listing | opening_hours | visit | access |
                               // admission | about | collection | architecture
  relation,                    // homepage | entitlement_evidence | pass_confirmation |
                               // context_confirmation | operational_source | editorial_fact_source
  confirms_pass_entitlement,   // boolean (false for context/operational/editorial)
  applicable_year,             // integer or null
  checked_at,                  // 'YYYY-MM-DD' or null
  confidence                   // verified | reviewed | unclassified
}
```

Allowed values are frozen in `data/facility-official-sources.js`
(`OFFICIAL_SOURCE_*`). `scripts/validate-data.js` enforces them.

Global sources (`FACILITY_OFFICIAL_GLOBAL_SOURCES`) apply to every facility —
today that is the Grutto Pass official brochure (the edition-wide entitlement
evidence). Facility-specific records live in `FACILITY_OFFICIAL_SOURCES` keyed by
`_key`.

---

## 4. Compatibility adapter (legacy fields)

Legacy fields are not deleted. The runtime bridges them into the shared model:

- `facility.urls` → `legacyFacilityHomepageSources()` emits `homepage` records
  (`legacy: true`). This is the only URL meaning inferred from an existing,
  already-declared field (`urls` **is** the facility homepage), not from a URL
  string.
- `facility.exhibition_check.source_url`, `facility-pass-benefits.js`
  `price_source.url`, and the legacy status/visit "check official site" CTAs
  remain for now. Their URLs are **unclassified / needs_review** until the
  Time-scoped Pass and Opening Hours audits assign a `relation`; the renderer
  never guesses their meaning from the URL.

The legacy "check opening information / visit information on the official site"
CTAs that currently point at the homepage are intentionally out of scope for
this foundation. They are retired/migrated to precise `opening_hours` / `visit`
sources in the Opening Hours audit.

---

## 5. Renderer contract

- **Header globe** (`syncFacilityHomepageAction`): renders when a `homepage`
  source exists, and not otherwise (no empty button). It is a sibling of the
  title and close button (never inside the `h2`), uses a globe icon, a visible
  icon of 18–20px, a ≥44×44px hit target, `aria-hidden` on the icon, and a
  localized accessible name (`facility.openHomepage`, e.g.
  `東京都写真美術館の公式サイトを開く` / `Open … official website` /
  `打开…官网`).
- **Contact dedupe**: the header-owned homepage is never emitted in Contact.
  Telephone and genuinely distinct inquiry / reservation URLs remain. URLs are
  compared after normalization (`normalizeSourceUrl`).
- **Contextual CTA** (`resolveContextualCtas`): a section CTA appears only from a
  matched source record. Pass → `entitlement_evidence` /
  `pass_confirmation` / `context_exhibition`; Hours → `opening_hours`
  (operational + `opening_hours`/`visit`); Exhibition → `exhibition_page` or
  `exhibition_listing` (`context_confirmation`). A homepage-relation record is
  never a contextual CTA.

| Section | relation / page_type | JA | EN | ZH |
| --- | --- | --- | --- | --- |
| Pass | `entitlement_evidence` | ぐるっとパス公式資料 | Grutto Pass official source | Grutto Pass 官方资料 |
| Pass | `pass_confirmation` | 施設公式の案内 | Facility official guidance | 场馆官方说明 |
| Pass | `context_confirmation` + exhibition | 対象展を公式サイトで確認 | Check the exhibition on the official site | 在官网确认适用展览 |
| Exhibitions | specific page | 展覧会ページ | Exhibition page | 展览页面 |
| Exhibitions | listing only | 展覧会情報 | Exhibition information | 展览信息 |
| Hours | `opening_hours` / `visit` | 開館時間を公式サイトで確認 | Check opening hours on the official site | 在官网确认开放时间 |
| Introduction | `editorial_fact_source` | (not rendered) | (not rendered) | (not rendered) |

---

## 6. Fallback discipline

If only a `homepage` exists, the Header globe is responsible and Pass,
Exhibitions, and Opening Hours omit their CTA. A generic homepage link is never
substituted for a missing precise contextual source.

---

## 7. Follow-up ownership

- **Time-scoped Pass Entitlement Audit** populates `pass_confirmation` and any
  per-facility `entitlement_evidence` (and re-classifies `price_source` facility
  URLs with `confirms_pass_entitlement` evidence).
- **Opening Hours Semantics Audit** populates `opening_hours` / `visit`
  `operational_source` records and migrates the legacy status/visit "check
  official site" CTAs off the homepage.
- **Facility Introduction V2** populates `editorial_fact_source` records
  (About / Collection / Architecture / Permanent exhibition) as internal
  provenance.
