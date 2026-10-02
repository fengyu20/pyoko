# Visual Acceptance Standard

Automated tests answer:

> “Is the interface broken?”

Visual acceptance answers:

> “Does the interface feel clear, natural, and mature?”

Playwright WebKit PASS does not equal real iOS Safari visual PASS. Browser
regression protects behavior, structure, and gross layout failures; visual
acceptance protects perception, hierarchy, ownership, and the quality of the
first impression.

## Density principle

Do not solve mobile density by repeatedly shrinking or rearranging persistent
controls. If a control is only needed while editing, move it into an explicit
edit state.

> 不要靠不断压缩、换行来让所有控件长期共存。仅在编辑时需要的控件应进入明确的
> 编辑态，而不是常驻浏览界面。

Narrower inputs, smaller padding, new grid ratios, and new breakpoints are
adjustments, not answers. When a phone toolbar keeps running out of room, the
question is which controls belong to browsing at all.

## Source-of-truth hierarchy

When evidence conflicts, use this order:

1. Product invariants
2. Real-device visual observation
3. Automated browser regression
4. Implementation convenience

If WebKit passes but a real iPhone shows an unnatural grouping, crowding, or
unclear hierarchy, the real-device evidence takes priority. Record the
observation, correct the composition, and then update the automated guard only
when the perceptual rule can be expressed without turning a visual judgment
into a brittle pixel lock.

## Mobile visual gate

The primary manual review widths are:

- 375px
- 390px
- 430px

320px is the narrow regression case. 480px is the upper bound for the phone
composition; 481–640px may use the wider-mobile/tablet adaptation when it has
enough room. Review the real iPhone equivalent of the primary widths, including
safe-area behavior and native control rendering where relevant.

For every important UI release, review JA, EN, and ZH with the same date, time,
visited state, and facility whenever possible. The required first-screen frame
is:

> Hero → controls → My Pass → Area heading → first Facility Card

## Hero

### Should

- Make the title the first visual focus.
- Own product identity, edition identity, and provenance only.
- Show `PASS 2026` clearly.
- Keep unofficial status, update date, and official site available but quiet.
- Treat supporting metadata as one semantic group that may naturally wrap to
  one or two lines on narrow screens.
- Keep the same brand hierarchy on desktop and mobile.
- Keep the language switch discoverable and usable without competing with the
  title.

### Should not

- Show the Pass price in the Hero.
- Show the absolute final-use date in the Hero.
- Present multiple equally weighted metadata rows.
- Make the official link look like the primary call to action.
- Shrink readable text, clip it, or force a single line merely to preserve
  the banner height.

## Date and time condition

Mobile browse state shows one concise DateTime condition.

Native date/time fields belong to DateTime edit state.

Return-to-now is a recovery action inside the editor, not persistent toolbar
chrome.

Current-year dates may use a compact locale-aware presentation.

At `<=640px` the toolbar carries a single date+time summary control such as
`8/13 · 17:53` (`Aug 13 · 17:53` in English). It reads as one condition, not as
two squeezed form fields, and it keeps a 44px or larger effective target while
staying visually secondary to Search. A target date outside the current Tokyo
year shows the year in the locale's own form, produced by a locale formatter
rather than by string slicing.

Tapping the summary opens the Date & time editor — a bottom sheet that reuses
the Filter sheet's backdrop, safe-area, focus, and scroll-locking language
while owning its own state. The editor holds the same single pair of
`#targetDate` and `#targetTime` inputs used everywhere else; there is never a
second synchronized set of inputs. The editor presents a title, the date field,
the time field, the return-to-now action in Custom mode only, and a Done
action.

Widths above `640px` keep the native fields inline in the toolbar, where there
is room for them.

## Mobile sticky controls

Normal mobile discovery controls should feel like search/navigation, not a
settings form.

Scrolled compact state must fit in one toolbar row.

Manual interaction must not permanently disable future auto-collapse.

Scrolling upward must never automatically reopen a large toolbar.

### Normal controls

At `<=640px` the browse state is three rows:

```text
Search
DateTime summary | Filter | List / Map
Quick filters
```

Quick filters own a full-width row. They may scroll horizontally, but no
sibling control may cover, compress, or clip them, and shortcuts must not be
shrunk, truncated, or renamed to cryptic abbreviations to make them fit.

### Compact controls

After the user browses past a stable top-page boundary, the sticky toolbar
becomes one row:

```text
[search] [8/13 · 17:53] [filter · count] [list] [map]
```

Every compact control acts directly: the summary opens the Date & time editor,
the filter icon opens the Filter sheet, and the view icons switch views. None
of them first restores the full controls.

Must:

- Full controls auto-collapse after a stable top-page threshold or sentinel.
- A user can explicitly reopen Search from the compact row, as often as they
  like.
- After a manual expansion, continued downward browsing collapses the toolbar
  again. Collapse is measured as downward travel from the expansion anchor,
  using a threshold large enough that neither a small nudge nor the browser's
  own scroll-anchoring adjustment triggers it.
- Expanded and compact states use the same List / Map controls and the same
  filter state.
- Active filters remain understandable in compact state.
- Editing controls do not disappear while Search, the Date & time editor, or a
  filter surface is active.

Must not:

- Keep full Search + Date + Time + Filters permanently occupying a large part
  of the mobile viewport while browsing.
- Base collapse on scroll-direction oscillation, or expand on upward travel.
- Let sticky-height changes create repeated collapse / expand flicker.
- Keep a manual collapse control that owns a whole empty toolbar row.

## Responsive view switch

Mobile may use icon-only List / Map controls when accessible names and clear
selected states are preserved.

Desktop retains text labels where space is available.

Each icon-only control keeps an explicit localized accessible name in JA, EN,
and ZH, an effective target of at least 44 × 44, and the existing
brand-green-tint / brand-green-deep selected treatment. Hiding the visible
label must never remove the accessible name.

## Time interaction

“Now” is a recovery action, not a primary input beside the Time field.

Must:

- The initial state visibly represents the current Tokyo date and time.
- Live mode continues updating the date, time, status, and relevant filters as
  real time advances, including across midnight.
- Any user change to Date or Time enters Custom mode and is never overwritten
  by the minute update.
- The return-to-now action appears only in Custom mode.
- Returning to now restores the Tokyo date and current Tokyo time, then hides
  the action again.
- Live / Custom mode is defined by interaction state, not by whether the
  selected minute happens to equal the current minute.

## Control hierarchy

Search is the primary lookup control.

The date+time condition provides temporal filtering context. Filter & Sort is a
secondary action. List / Map switches the view. Quick filters are tertiary
frequent shortcuts.

Borders, fills, and emphasis must not make every toolbar control look equally
important. When a control gains an invisible touch extension, its visible
weight and role should remain unchanged.

## Pass entitlement

The Pass section carries three layers, and none of them may stand in for
another: the **official entitlement** (what the Pass grants, in the brochure's
words), the **product interpretation** (our structured reading of it), and the
**derived reference value** (a comparable figure we compute).

- Facility Detail preserves the official entitlement wording. It is the anchor;
  a product paraphrase never replaces it.
- The structured interpretation may simplify for Browse, but it must not
  strengthen the source. If the wording says 「展覧会に入場」, the visible copy
  stays that broad even when the structured scope is narrower.
- Official clause labels (入場 / 割引) survive as content categories. Mixed
  benefits stay visibly separate — they are never compressed into one sentence.
- A Browse summary keeps benefit type, scope, and any explicit official
  discount amount or rate. Shortening may not drop a scope that changes when
  the benefit applies.
- Japanese reads the source directly. EN and ZH lead with the localized
  reading and keep the Japanese original as a low-weight secondary line — a
  small `原文` label, not a citation box.

## Reference value

- A derived monetary value is visually secondary to the entitlement, and always
  reads as a reference, never as an amount the visitor saved.
- It names the scope it was derived from whenever ambiguity is possible: ¥800
  at No.71 is 常設展の一般料金を基準, ¥200 at No.44 is 庭園の一般料金を基準.
- A source-stated fixed discount is not duplicated as a separate reference-value
  line. No.18's ¥300 is the entitlement itself, so it appears once.
- A variable benefit stays in its own units. A percentage stays a percentage;
  it is never forced into yen, and an unknown value is never shown as ¥0.
- One exhibition's price is never presented as the facility's regular price.

## Value confidence

Verified scoped values and legacy fallback values must not appear equally
authoritative. A verified value carries the 参考価値 / 参考 label; a legacy
fallback carries 概算 and is rendered at lower weight and lower contrast.

Display confidence is independent of computation: a value withheld from the
reference-value layer still reaches `data-benefit` for sorting, filtering and
My Pass. Presentation policy is never expressed by emptying the data contract.

## My Pass

The first-screen My Pass entry should answer in under three seconds:

- how many facilities were visited;
- how much reference value those visits represent;
- how much more reference value would match the pass price.

Visited-based totals are reference/estimated value, not an accounting of actual
savings. Marking a facility visited proves attendance — not which benefit was
used, which scope was seen, or what was actually paid. No My Pass string may
claim the visitor saved a specific amount, and the qualification is stated once,
where the total is claimed, in plain language rather than data-model vocabulary.

Keep the entry compact. Do not repeat the complete Pass metadata, deadline, or
a long explanation there. The full Pass price and edition final-use date belong
in the My Pass Drawer. The price must continue to come from
`CONFIG.passPriceYen`; the final-use date must continue to come from
`CONFIG.passEnd` and remain clearly an absolute edition date, not a personal
activation expiry.

## Area heading

An area heading such as `01 上野周辺エリア` must make the area name the anchor.
`01` is a navigation ordinal and remains secondary. It should help scanning,
not compete with the area name.

## Facility identity

`No. 1` is catalog identity. The Facility name is primary identity.

The number and the first line of the Facility title should look like members of
the same row. The number must not appear to float high above the title, become
bold or green, gain a badge/background, or compete with the Facility name.
Different sans/serif font metrics do not require mathematically identical
baselines; the acceptance question is whether the row reads naturally to a
person.

Touch targets must not be created by adding visible vertical padding that moves
the title typography. Use an invisible extension or an equivalent wrapper
strategy, and verify that the extension does not cover the status action,
exhibition link, neighboring button, or adjacent card interaction. Check
single-, double-, and three-digit catalog numbers, including No. 1, No. 9,
No. 52, No. 101, and the highest number present in the current source (No. 107
at the time of writing), for no wrapping, clipping, or x-axis drift. If a
future edition adds No. 108, it must be included in this representative check.

## Facility card

At first glance, a mobile card should communicate:

> Facility identity · Status · Short description · Pass benefit · Relevant exhibition

Do not box every item, add meaningless badge varieties, overuse green, or make
the action hierarchy unclear. The card should remain a calm comparison surface.

## Facility Card interaction

A Facility Card is one discoverable object.

- Its passive content — whitespace, the catalog number, the facility name,
  passive status text, the description, passive Pass text — opens the Facility
  Detail.
- Exhibitions, the Visited control, links, buttons, and form controls keep
  their own ownership and never open the Detail as a side effect. The whole
  `.enriched-item` belongs to the exhibition, not to the card.
- The title button remains the keyboard Detail trigger and the focus-return
  target. The card wrapper gains no tabindex and no role, so it never becomes a
  duplicate tab stop.
- Ownership is decided by one delegated guard, not by `stopPropagation()`
  scattered across descendants. Selecting text inside a card must not open the
  Detail.

## Map selection feedback

Selection feedback must be close to the action that caused it.

- A mobile marker selection must appear inside the current viewport. The user
  must never scroll past the map to discover what they just selected.
- Marker and selection surface always agree: one selected marker, one selection
  summary.
- Marker A then marker B is a replacement, never an append.
- Selecting a marker must not scroll the page or move the map away.

## Responsive Map architecture

- Desktop (`>=1200px`) = Map + the full selected-facility Detail panel.
- Mobile and tablet (`<1200px`) = Map canvas + a compact selection preview that
  leads into the existing full Drawer.
- Shared content and shared state do not require identical responsive
  presentation. The preview carries only the selection summary — number, name,
  current status, compact Pass benefit, and a clear Detail affordance. Access,
  introduction, exhibitions, contact, visit information, schedules, and map
  actions belong to the full Detail.
- Before a selection exists, the compact map shows a low-weight helper instead
  of a large empty Detail panel. When a filter excludes the selected facility,
  the preview disappears rather than showing stale facts.

## Map gesture ownership

Mobile Map Mode is an interactive map canvas.

- A gesture starting on the map pans the map; a gesture in the Drawer scrolls
  the Drawer; List Mode scrolls the document.
- Single-finger panning is preserved. No two-finger-only mode, no
  "tap to activate", no pointer-event workarounds.
- The map should be visibly the primary content at phone and tablet widths, and
  the selection preview must not cover the map's own attribution or the compact
  controls.

## Detail surfaces

The Facility Detail order is:

> Status → Access / route → Pass benefit → Facility introduction → Relevant exhibitions → Visit information

Access and Pass remain the highest-priority visit decisions. Introduction must
appear before exhibition detail so a user entering from a Map marker can
understand what the facility is without returning to List. Browse Card order
is independent and must not be changed by this Detail presentation order.

## Facility Drawer Header

Facility identity remains primary. The close button owns only the space it
actually needs in the first header row. Status belongs below the title and may
use the full header width, including the space that is not occupied by the
close button.

Status should wrap naturally when the device or locale requires it. Do not
force `white-space: nowrap` or reserve an invisible close-button column on the
status row merely to preserve one line.

## Detail vertical rhythm

Hidden browse-only content must not create visible Detail spacing. The first
visible Detail section must not inherit a separator, top margin, or top padding
from a hidden sibling. Section rhythm is owned by visible sections, so the
header should lead into Access with normal body spacing rather than an
artificial blank band.

Drawer and Map detail surfaces share the same prepared Detail ownership and
must keep the same visible section order and spacing rules.

## Language metadata

Language metadata belongs to the content it qualifies. A JP-only title marker
stays attached to that specific exhibition title and must not become an empty
standalone row or a right-aligned badge detached from the title.

Do not label the entire Exhibitions section as JP when only one item is
Japanese-only. A translated title must not receive a `(JP)` marker merely
because its summary, notice, or another supporting field remains in the
original language. Supporting-source disclosure may still describe that
untranslated content, with an accessible description such as “Japanese only”
in the active locale.

## Language behavior

JA, EN, and ZH may naturally occupy different line counts. Equal height across
languages is not a requirement. The requirements are shared hierarchy, shared
brand identity, and shared task priority.

When English or another locale becomes longer, wrapping is preferred to
shrinking, clipping, ellipsis, or forced nowrap. Verify that the resulting wrap
still reads as one semantic group where the product model requires one.

## Footer

The Footer is a product footer, not a disclaimer wall. Its visual hierarchy is
shared across JA / EN / ZH and across phone and desktop widths.

### Collapsed Footer

Should:

- Show a compact trust statement that clearly says the guide is unofficial and
  directs visitors to official sources for current information.
- Keep the official Grutto Pass link as a normal external text link, not a CTA
  button, filled control, or promotional banner.
- Keep `本サイトについて` / `About this site` and `データ・出典` / `Data &
  sources` as two independent disclosures using the same summary, chevron,
  focus, and spacing system.
- Keep the OSM credit visible at low visual weight when the Footer credit is
  retained; the active Map view must continue to provide its Leaflet
  attribution.

Should not:

- Show a centered multi-line bold disclaimer.
- Show a paragraph containing every monthly recommendation link.
- Repeat coverage statistics in another group without a user-facing purpose.
- Render source-policy or source-governance language such as “出典の役割”.

### Expanded About

The About disclosure explains how this product works through four scannable
groups: coverage, Pass basics, local visit records, and display methodology.
Coverage remains data-driven; the No.36 two-museum representation is explained
without repeating the same statistic in the Pass rules. Value methodology keeps
the admission price, discount amount, higher-of-two rule, and unknown-price
filter limitation. Opening status keeps the regular-hours estimation rule and
the limitation around unexpected closures and exhibition-specific changes.

The panel should use semantic section headings, body copy, and quieter notes.
It should not read as one enclosed legal card or a continuous disclaimer wall.

### Expanded Sources

Sources are owned separately from About and are rendered as three categories:
basic information, exhibition information, and official recommendations. A
monthly recommendation is a compact period row with Admission / Discount links;
one new month means one new structured data row in `CONFIG.sources`, with no
prose-template edit. Preserve historical rows and keep the list in a consistent
newest-first order. Source links retain normal link affordance and
`target="_blank" rel="noopener"` safety.

Long English labels and recommendation rows may wrap naturally at 375 / 390 /
430px. They must not overflow horizontally, become pills or cards, or force a
smaller font merely to preserve a single line.

Do not turn each source into a separate card or pill; the list should remain a
quiet utility surface.

## Visual QA checklist

- [ ] Hero attention starts at the title.
- [ ] Hero supporting metadata feels quiet and ownership is clear.
- [ ] The DateTime summary reads as one condition, not two form fields.
- [ ] The mobile toolbar does not resemble a settings page.
- [ ] No persistent return-to-now button sits in the mobile toolbar.
- [ ] List / Map icons remain understandable without labels.
- [ ] Quick filters are not clipped by the view controls.
- [ ] No toolbar control looks accidentally merged with another.
- [ ] My Pass is understandable in under three seconds.
- [ ] Area hierarchy is obvious and the ordinal stays secondary.
- [ ] Facility No. aligns naturally with the title first line.
- [ ] Card content does not feel over-boxed.
- [ ] Tapping passive card content opens the Detail.
- [ ] Exhibitions and Visited never open the Detail by accident.
- [ ] JA / EN / ZH wrap naturally without clipping.
- [ ] No accidental overlap, horizontal overflow, or clipped content is visible.
- [ ] Touch targets remain comfortable without distorting visible typography.
- [ ] Desktop and mobile feel like the same product.

## Real-device gate

Before visual acceptance is complete, use a real iPhone Safari session in JA,
EN, and ZH with the same representative state whenever possible. Review the
initial state, browsing past the discovery boundary, compact controls, Map
mode, and a representative Facility Detail in both Drawer and Map entry.

- [ ] Sticky controls become compact after browsing begins.
- [ ] The compact toolbar fits naturally in one row.
- [ ] The compact toolbar leaves substantially more room for content / map.
- [ ] Search can be reopened from the compact row repeatedly.
- [ ] A reopened Search collapses again after continued downward browsing.
- [ ] Controls never flicker when scrolling up and down.
- [ ] The Date & time editor opens directly from the summary in both states.
- [ ] Drawer header status uses available width naturally.
- [ ] No artificial blank band appears before Access.
- [ ] Facility introduction appears before exhibitions.
- [ ] The JP marker stays attached to the correct exhibition title.
- [ ] Passive card content opens the Detail on a real tap.
- [ ] Exhibition links and the Visited control keep their own behavior.
- [ ] A marker tap gives immediate feedback in the current viewport.
- [ ] Marker A to marker B reads as a clear replacement.
- [ ] The preview opens the full Drawer.
- [ ] Closing the Drawer returns to the same selection and the same marker.
- [ ] Map panning feels natural with one finger.
- [ ] The preview does not cover important map content or the attribution.
- [ ] The desktop split view shows no regression and no duplicate preview.

## Automated versus visual acceptance

Do not encode these perceptual rules as brittle release assertions:

- Header whitespace must not equal an exact pixel value.
- Status must not be required to stay on one line at every width and font
  metric.

Automated tests are responsible for state transitions, DOM ownership, section
order, overflow, collision, visibility, and focus safety. Real-device review
is responsible for density, vertical rhythm, natural wrapping, native control
rendering, and perceptual hierarchy.

This is a perceptual acceptance standard, not a CSS specification. It defines
outcomes, hierarchy, and ownership. It intentionally does not prescribe exact
margins, pixel baselines, or one implementation technique when several
techniques can produce the same mature result.

## Release reporting

Report these gates separately:

```text
Functional regression: PASS / FAIL
Automated responsive regression: PASS / FAIL
Playwright WebKit: PASS / FAIL
Ready for real-iPhone visual QA: YES / NO
Real-device visual acceptance: PENDING
```

Automated release tests may all pass while visual acceptance remains pending.
Do not call the release visually approved until the real-device gate has been
reviewed for JA, EN, and ZH.
