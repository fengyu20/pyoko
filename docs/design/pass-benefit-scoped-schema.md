# Scoped Pass Benefit Schema — Design

Status: Phase 1–3 shipped. `data/facility-pass-benefits.js` is the runtime
monetary source of truth for the 23 price-verified facilities and the official
entitlement source for all 108; the Detail renders official clauses verbatim,
Browse shows the structured interpretation, and the derived value is its own
reference layer. Phase 4 (retire the legacy scalar fields and text-parsing
fallbacks) remains a proposal — 85 facilities still fall back to text-parsed
legacy estimates, now risk-classified in `data/facility-legacy-risk.js`.

## 1. Current problem

`data/facilities.js` describes a Pass entitlement with three fields:

```js
pass_types: ['admission', 'discount'],
pass_benefit_yen: 320,
regular_price_yen: 1600,
```

The entitlement it is describing (No.71) is two independent grants:

```text
常設展入場                    ← admission, permanent collection, ¥800
特別展‥一般料金の20%引        ← 20% off, special exhibition, price varies per show
```

Neither scalar can say which grant it belongs to. Both, in fact, describe the
second one: `1600` is the current special exhibition's same-day price and `320`
is 20% of it. The card then renders "free admission · save ¥320", which is two
true statements joined into a false one.

This is structural, not local: a facility-level scalar cannot identify which
of several independent benefits its value describes. The accepted scoped
benefit model below keeps the entitlement and value layers separate.

The official Pass source may grant admission to one scope and a discount for
another. Flattening these into two facility-level scalars loses that meaning.

## 2. Source-of-truth hierarchy

Two questions, two sources, never mixed:

| Question | Authority | Never used for this |
| --- | --- | --- |
| What does the Pass grant, in what scope? | Grutto Pass official brochure / official Pass source | A facility price page must not redefine scope |
| What is that grant worth? | Facility official website, for the exact scope the brochure names | The brochure price line is a dated fallback |

A price with no scope is not evidence. A scope with no price is still valid data
and must be representable.

## 3. Schema as built

Three layers are kept apart on purpose, because conflating them is what produced
the original defect:

| Layer | Field | Owner |
| --- | --- | --- |
| **A. Official entitlement fact** | `official_clauses[].wording_ja` | The Pass source, verbatim |
| **B. Structured interpretation** | `benefits[].type` / `scopes` / `price_mode` | Us; may never rewrite, widen or narrow A |
| **C. Product-derived value** | `comparable_value_yen` + `value_basis` | Derived from verified prices only |

`data/facility-pass-benefits.js` is keyed by the app facility key (so `36` and
`36-2` stay distinct):

```js
const FACILITY_PASS_BENEFITS = {
  "71": {
    facility_no: "71",
    name_ja: "東京都江戸東京博物館",
    source: { type: "grutto_brochure", edition: "2026", information_date: "2026-02",
              url: "…brochure_2026_01.pdf", source_page: 15 },

    // Layer A — verbatim, in the brochure's own presentation order.
    official_clauses: [
      { label_ja: "入場", wording_ja: "常設展入場" },
      { label_ja: "割引", wording_ja: "特別展‥一般料金の20%引" }
    ],

    // Layer B — one entry per scoped benefit, each pointing back at its clause.
    benefits: [
      {
        clause_index: 0,
        type: "admission",
        scopes: ["permanent_collection"],
        official_wording: { ja: "常設展入場" },
        interprets_ja: null,
        price_mode: "fixed",
        regular_price_yen: 800,
        saving_yen: 800,
        discount_rate: null,
        price_source: { label: "facility official website",
                        url: "https://www.edo-tokyo-museum.or.jp/information/guide/",
                        checked_at: "2026-08-14" }
      },
      {
        clause_index: 1,
        type: "discount_percent",
        scopes: ["special_exhibition"],
        official_wording: { ja: "特別展‥一般料金の20%引" },
        interprets_ja: null,
        price_mode: "exhibition_variable",
        regular_price_yen: null,
        saving_yen: null,
        discount_rate: 0.2,
        price_source: null
      }
    ],

    // Layer C — derived, and it says what from.
    comparable_value_yen: 800,
    value_basis: { benefit_index: 0, benefit_type: "admission",
                   scope: "permanent_collection", regular_price_yen: 800,
                   derivation: "free admission at the published price for this scope" },

    verification_status: "priced"
  }
};
```

Four properties matter more than the field names:

- **Every number sits inside a benefit.** There is no facility-level yen or
  scope field, and the validator rejects one if it ever appears.
- **Every benefit carries its official wording**, copied verbatim from the
  clause it interprets, so the Detail UI never has to join anything to show the
  official entitlement, and drift is detectable by string comparison.
- **`comparable_value_yen` is derived and says so** through a `value_basis` that
  names the benefit, the scope, the price and the derivation.
- **A variable benefit is complete with no number at all.**
  `discount_rate: 0.2` + `price_mode: "exhibition_variable"` says "20% off"
  without inventing yen.

### One clause, several scopes

A single official clause sometimes grants more than one thing. No.44's
`建物公開展、庭園入場` is one clause covering a rotating exhibition and a garden
with its own standing ¥200 ticket. Both benefits keep `clause_index: 0` and the
same verbatim `official_wording`, and each adds `interprets_ja` naming the
literal fragment it covers:

```js
{ clause_index: 0, scopes: ["garden"],            interprets_ja: "庭園入場",   regular_price_yen: 200,  saving_yen: 200 },
{ clause_index: 0, scopes: ["named_exhibition"], interprets_ja: "建物公開展", regular_price_yen: null, saving_yen: null }
```

`interprets_ja` is only emitted when a clause is read as more than one benefit,
and the validator requires it to be a literal substring of the clause. A
paraphrase there would be layer-B language leaking into layer A.

### Coverage: entitlement shells

All 108 facility cards have a record. The 23 with verified pricing are
`verification_status: "priced"`; the other 85 are `"entitlement_only"` —
official wording plus structured interpretation, with every monetary field null.

This was chosen over migrating only the 23 with legacy scalars. The file's
long-term job is to be the Pass entitlement source of truth, and the Detail UI
will need official wording for every facility, not only the ones that happen to
carry a number today. Generation is deterministic from the committed brochure
extraction, so covering all 108 costs nothing in review effort, and shells carry
no money, so an imperfect scope reading cannot create false precision.

Valuing the remaining 85 is a later verification pass, not a data-entry task:
each one needs the same official-price check the 23 received.

## 4. Benefit taxonomy

Extends the brochure's `type` field rather than replacing it (the brochure's
`admission` / `discount` split maps onto the first four rows).

| `type` | Meaning |
| --- | --- |
| `admission` | The Pass admits the holder to this scope at no charge. |
| `discount_fixed` | A flat yen reduction stated by the Pass source. |
| `discount_percent` | A percentage reduction; needs a price basis to become yen. |
| `discount_to_group_rate` | The holder pays the group rate; the amount is rarely published. |
| `other` | A benefit that is none of the above and is described in prose. |
| `unclear` | The source wording does not resolve to a type. |

## 5. Scope taxonomy

`scopes` is an array because the source frequently names two at once
(`常設展・企画展割引`). `scope_source_ja` always keeps the original wording, so a
reviewer can check the mapping.

`whole_facility_admission`, `permanent_collection`, `collection`,
`special_exhibition`, `temporary_exhibition`, `named_exhibition`, `garden`,
`building`, `unknown`.

`unknown` is a legitimate value, not a gap. No.9 東京藝術大学大学美術館 states a
¥200 discount and names no scope; recording `unknown` is correct, and guessing
`企画展` would recreate the defect this schema exists to remove. Likewise, source
wording is never rewritten: `展覧会` does not silently become `常設展` or `企画展`.

## 6. Price-mode taxonomy

| `price_mode` | Meaning | May carry `saving_yen`? |
| --- | --- | --- |
| `fixed` | A standing published price for this scope. | Yes |
| `current_fixed_but_may_change` | Published as a single price today, but not guaranteed for the edition. | Yes, recomputable |
| `exhibition_variable` | The source says the price differs per exhibition. | No |
| `exhibition_specific` | A named exhibition's own price. | Only inside `exhibition_example` |
| `unknown` | No price statement found. | No |

A `discount_fixed` is the one case where `saving_yen` survives an
`exhibition_variable` price: the Pass source states the yen amount directly, so
it does not depend on the price at all. This exception is explicit in the
validator rules below.

## 7. Comparable-value algorithm

```text
candidates = []
for each benefit:
    if type == admission and price_mode in (fixed, current_fixed_but_may_change)
        and regular_price_yen is not null:
            candidates.append(regular_price_yen)
    if type == discount_fixed and saving_yen is not null:
            candidates.append(saving_yen)
    if type == discount_percent and price_mode in (fixed, current_fixed_but_may_change)
        and regular_price_yen is not null:
            candidates.append(round(regular_price_yen * discount_rate))
    otherwise: contributes nothing

comparable_value_yen = max(candidates) or null
value_basis          = the benefit that produced the maximum
```

Rules that are part of the algorithm, not implementation detail:

1. Scopes are **never summed**. Nothing in the Pass source proves one visit
   collects both a collection admission and an exhibition discount.
2. A summation is permitted only if an official rule explicitly says the
   benefits stack; no such case exists in the 2026 edition.
3. `comparable_value_yen` is a **derived product value** for sorting and
   break-even estimation. It is not the entitlement and must never be rendered
   as one.
4. `null` is a valid answer and must render as "value varies", not as ¥0.

## 8. Mixed-benefit example

No.105 千葉市美術館 — `常設展入場` + `企画展割引‥一般料金の50%引`:

```js
benefits: [
  { type: "admission",        scopes: ["permanent_collection"],  price_mode: "fixed",
    regular_price_yen: 300, saving_yen: 300 },
  { type: "discount_percent", scopes: ["temporary_exhibition"], price_mode: "exhibition_variable",
    regular_price_yen: null, saving_yen: null, discount_rate: 0.5 }
],
comparable_value_yen: 300,
value_basis: { benefit_index: 0, scope: "permanent_collection", … }
```

Production today says ¥750 — 50% of a ¥1,500 exhibition. The entitlement renderer
can now say "常設展は無料、企画展は50%引" while the comparable value stays ¥300.

## 9. Variable-exhibition example

No.44 東京都庭園美術館 shows why `saving_yen: null` must be a first-class state:

```js
benefits: [
  { type: "admission", scopes: ["garden"], price_mode: "fixed",
    regular_price_yen: 200, saving_yen: 200 },
  { type: "admission", scopes: ["named_exhibition"], scope_source_ja: "建物公開展",
    price_mode: "exhibition_variable", regular_price_yen: null, saving_yen: null },
  { type: "discount_to_group_rate", scopes: ["temporary_exhibition"],
    price_mode: "exhibition_variable", saving_yen: null }
]
```

The Pass genuinely grants building-exhibition admission, and its worth genuinely
cannot be stated as one number. The schema records both facts instead of
resolving the tension with an invented figure.

## 10. No.71 worked example

| | Legacy | Scoped schema |
| --- | --- | --- |
| Entitlement | `pass_types: [admission, discount]` | two benefits with their own scopes |
| Admission value | absent | ¥800, `permanent_collection`, `fixed`, official source |
| Discount | absent | 20%, `special_exhibition`, `exhibition_variable`, no yen |
| Facility scalar | `320` / `1600` | none |
| Comparable value | `320` (20% of one show) | `800` with `value_basis` |
| Exhibition context | silently promoted to facility level | `exhibition_example`, clearly labelled |

Verified 2026-08-14: 常設展 一般800円 (団体640円); 特別展の料金は展覧会毎に定めます,
current show 一般1,600円 same-day.

## 11. Migration phases

**Phase 1 — data exists, runtime unchanged. Done.**
`data/facility-pass-benefits.js` is generated and semantically validated
(`npm run validate` now runs `scripts/validate-pass-benefits.js`). It is
deliberately *not* registered in `sw.js` `SHELL_ASSETS` and not loaded by
`index.html`: nothing reads it, so there is no cache bump and no release risk.
Registration belongs to Phase 2, together with the first reader.

**Phase 2 — runtime prefers scoped data.** `getKnownBenefit()` and
`getRegularAdultPrice()` consult `FACILITY_PASS_BENEFITS` first and fall back to
the legacy scalars for any facility not yet covered. The Pass renderer gains a
separate entitlement path so benefit copy stops being assembled from
`pass_types` + a scalar. Values change for the four sign-off facilities here.

**Phase 3 — scoped data is the only source of truth.** Legacy scalars become
generated projections (or are removed from `data/facilities.js` for covered
facilities). `null` comparable values render as "value varies" everywhere,
including the value filter, sorting and My Pass.

**Phase 4 — retire unsafe fields.** Remove `pass_benefit_yen` /
`regular_price_yen` from the schema, and remove the text-parsing fallbacks in
`getRegularAdultPrice()` that scrape prices out of `fee[]` and exhibition
`料金` strings — those are the mechanism that let an exhibition price become a
facility price in the first place.

No big-bang rewrite: each phase is independently shippable and reversible.

## 12. Backward compatibility per consumer

| Consumer | Today | Phase 2 | Phase 3+ |
| --- | --- | --- | --- |
| `pass_types` | drives the benefit summary | still drives copy; scoped data drives detail | derived from `benefits[].type` |
| `pass_benefit_yen` | the saving | fallback only | removed |
| `regular_price_yen` | reference price | fallback only | removed; scoped price replaces it |
| `getKnownBenefit()` | scalar, then text parsing | scoped `comparable_value_yen`, then fallback | scoped only |
| `getRegularAdultPrice()` | scalar, then `fee[]`/exhibition parsing | scoped `value_basis.regular_price_yen` | scoped only; parsing removed |
| value filter (`#valueFilter`) | filters on `data-benefit` | unchanged input, scoped source | `null` becomes an explicit "unknown value" bucket |
| sorting (`sortMode`) | sorts on `data-benefit` | unchanged input, scoped source | unknown values sort last, never as 0 |
| My Pass (`getVisitedMetrics`) | sums `data-benefit`, tracks unknowns | unchanged shape | sums comparable values; the existing unknown handling already fits |
| Card renderer | `data-benefit` / `data-regular-price` attributes | unchanged attribute contract | attributes come from the scoped record |
| i18n `benefit_basis` overlays | per-facility prose | unchanged | may be generated per benefit clause |

The card's `data-benefit` / `data-regular-price` attribute contract does not
change in any phase, which is what keeps filtering, sorting and My Pass working
untouched while the source underneath moves.

## 13. Phase 2 adapter contract

Phase 2 introduces three read-only accessors and nothing else. They are the only
place that knows the scoped shape, so every legacy consumer keeps its current
input contract:

```text
FACILITY_PASS_BENEFITS
        │
        ├── getFacilityEntitlements(key)          → official clauses + structured benefits
        ├── getFacilityComparableValue(key)       → { value_yen, value_basis } | null
        └── getFacilityRegularPriceForValueBasis(key) → number | null
        │
        ▼
   card data-benefit / data-regular-price   (attribute contract unchanged)
        │
        ▼
   value filter · sorting · My Pass · Pass renderer
```

| Accessor | Returns | Replaces |
| --- | --- | --- |
| `getFacilityEntitlements(key)` | `{ official_clauses, benefits }` | benefit copy assembled from `pass_types` + a scalar |
| `getFacilityComparableValue(key)` | `{ value_yen, value_basis }` or `null` | `getKnownBenefit()` |
| `getFacilityRegularPriceForValueBasis(key)` | the price the comparable value was derived from, or `null` | `getRegularAdultPrice()` |

Rules for the adapter layer:

- `null` is returned as `null`, never `0`. The existing unknown-value handling in
  `getVisitedMetrics()` already distinguishes the two and is the model.
- A facility with `verification_status: "entitlement_only"` returns `null` for
  value and falls back to the legacy scalar until it is verified.
- The accessors never format copy. Rendering decisions (Browse summary vs Detail
  official wording) stay in the renderer.

### Legacy consumers still to migrate

| Consumer | Depends on today |
| --- | --- |
| `getKnownBenefit()` | `pass_benefit_yen`, then `admission_label` / `pass_notes` text parsing |
| `getRegularAdultPrice()` | `regular_price_yen`, then `fee[]` and exhibition `料金` string parsing |
| Card renderer | `data-benefit`, `data-regular-price` attributes |
| Value filter (`#valueFilter`) | `data-benefit` |
| Sorting (`sortMode`) | `data-benefit` |
| My Pass (`getVisitedMetrics`) | `data-benefit`, with an existing unknown bucket |
| Pass renderer (`renderPassSummary` / `getPassPresentation`) | `getFacilityEntitlements()` + `getFacilityComparableValue()`, with `pass_types` as the no-record fallback |
| i18n overlays | `benefit_basis`, `admission_label`, `pass_notes` — superseded on the Detail by the official clauses since Phase 3 |

The text-parsing fallbacks in `getRegularAdultPrice()` are the mechanism that let
an exhibition price become a facility price in the first place, so they are
removed in Phase 4, not earlier — they are still the only source for the 85
unverified facilities.

## 14. Validator requirements

The current `scripts/validate-data.js` performs no check on either scalar, and
never loads the brochure extraction. A semantic validator must load it and
reject or warn on:

1. **Mixed benefits with an unscoped scalar** — brochure clauses in more than
   one scope while production carries a facility-level yen value. ERROR once
   Phase 2 lands.
2. **Percent discount with a permanent yen value and no scoped price basis** —
   ERROR.
3. **Variable-exhibition admission with a permanent scalar** — ERROR.
4. **`comparable_value_yen` without `value_basis`**, or a `value_basis` pointing
   at a benefit that cannot produce that number — ERROR.
5. **A price without a scope**, wherever more than one priced scope exists —
   ERROR.
6. **Production scope stronger or narrower than the brochure clause** — WARN,
   with an explicit allow-list for reviewed divergences.
7. **Verification note contradicting numeric data** — ERROR, using a
   machine-readable `source.checked_at` rather than prose in `CHANGELOG.md`.
8. **Stale price** — WARN when `source.checked_at` predates the current edition's
   information date.

Implemented in Phase 1 by `scripts/validate-pass-benefits.js`: scope-per-value,
variable-percentage, comparable-value basis, basis recomputation, cross-scope
sum rejection, verbatim official wording, and provenance on every number.

Rules 1-3 are only possible because the validator loads scoped source data. That
single change — teaching the validator what the brochure already knows — is what
turns this from a style rule into a semantic one.
