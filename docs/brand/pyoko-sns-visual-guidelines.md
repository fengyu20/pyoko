# PYOKO SNS Visual Guidelines

Status: **Active**
Version: **1.4**
Updated: **2026-08-21**
Scope: SNS carousels, feed cards, social previews and other editorial sharing images.

This document is the implementation-facing source of truth for branded social
visuals. Read it before creating a new PYOKO social image, asking an image model
for a visual, or adapting a product screenshot into a campaign card.

It extends the existing PYOKO Forest identity. It does not create a new logo,
mascot, color palette, product UI, or Grutto Pass co-brand.

## Non-negotiable decisions

1. **PYOKO is the only primary brand.** The Grutto Pass descriptor explains
   compatibility; it is not a second logo.
2. **Use the approved PYOKO wordmark or compact mark.** Never recreate the
   wordmark as plain spaced letters, with an emoji, or with an image-model
   approximation.
3. **The hop is abstract.** Use the two-O movement, the short dash, a route
   line, or waypoints. Do not use a dog paw, paw print, animal mascot, or
   literal bird as part of the base identity.
4. **Brand and product colors keep separate jobs.** Forest and the PYOKO
   accents communicate ownership. Product green communicates UI action,
   selection and state.
5. **Official Grutto Pass assets are not decorative brand assets.** Do not
   redraw, imitate or prominently reproduce official logos, ticket artwork,
   official typography, or official visual motifs.
6. **Text and the final logo are composited outside image generation.** Use
   image generation only for approved background or illustration work; add
   production copy and the actual mark in Figma, HTML, SVG or another
   deterministic layout tool.

The current answer to “should hopping become a bird?” is **no**. A literal
bird would introduce a new character language and make PYOKO feel mascot-led.
If a campaign later needs a bird-related illustration, it requires a separate
visual decision and must remain an abstract, non-logo editorial motif.

## Source of truth

When this document conflicts with an implementation detail, verify the current
production source before changing the system:

- [Production Forest and product tokens](../../index.html#L40-L105)
- [Production PYOKO wordmark geometry](../../index.html#L177-L185)
- [Current compact mark](../../assets/brand/pyoko-symbol.svg)
- [Current 1200 × 630 share lockup](../../assets/brand/pyoko-share.svg)

The existing SVG assets are preferred over manually reconstructed text. If a
new size or locale variant is required, preserve the same geometry and role
mapping rather than inventing a new mark.

## Brand hierarchy

Every social image must be readable in this order:

```text
PYOKO
for Tokyo Museum Grutto Pass · Unofficial guide
```

The content headline may be larger than the footer lockup because the image is
an editorial story, but the bottom lockup must still look like a real brand
signature rather than a caption.

### Approved descriptor language

Use the current product terminology and keep the descriptor visually below
PYOKO. Do not mix languages inside one localized lockup.

| Locale | Descriptor | Identity note |
| --- | --- | --- |
| JA | `for 東京・ミュージアム ぐるっとパス` | `非公式ガイド` or `非公式` |
| EN | `for Tokyo Museum Grutto Pass` | `Unofficial guide` or `Unofficial` |
| ZH | `for 东京·博物馆 Grutto Pass` | `非官方指南` or `非官方` |

Do not use `×`, `collaboration`, `official partner`, `by Grutto Pass`, or a
same-size `GRUTTO PASS` wordmark. The relationship is “PYOKO for users of a
third-party pass”, not a partnership lockup.

## Color system

These values are copied from the current production semantic tokens. Use the
token role, not an arbitrary near-match selected by an image generator.

| Role | Token | Value | SNS use |
| --- | --- | --- | --- |
| PYOKO brand surface | `--brand-surface` / `--brand-primary` | `#143D33` | Primary brand field, dark social card, wordmark ownership |
| Light brand text | `--brand-on-primary` | `#FFF9F0` | Wordmark and essential copy on Forest |
| PYOKO coral accent | `--brand-accent-coral` | `#F28B78` | Hopping O / personality accent |
| PYOKO lime accent | `--brand-accent-lime` | `#B7CF71` | Resting/orbit O, hop dash, waypoint accent |
| Shared paper | `--paper` | `#F5F5F1` | Light editorial social surface |
| Shared card | `--paper-card` | `#FFFFFF` | Evidence card or product screenshot frame |
| Primary ink | `--ink` | `#24352F` | Headline and readable dark text on paper |
| Secondary ink | `--ink-soft` | `#5F6D66` | Supporting copy and metadata |
| Border | `--line` | `#D6DED8` | Quiet card and section boundary |
| Product interaction | `--product-primary` | `#1F6B48` | Actual buttons, selected states and product UI |
| Product hover | `--product-primary-hover` | `#164C35` | Interaction-only hover or pressed state |
| Product soft state | `--product-primary-soft` | `#DDEEE2` | Selected chip, status tint or evidence UI tint |

### Color rules

- Forest, ivory and ink should carry most of the image.
- Coral and lime are recognition accents, not competing headline colors.
- Use product green when showing a real product control or state; do not make
  it the default PYOKO wordmark color.
- Do not add purple, blue, cyan, neon green, orange, pink, gradient or glow
  systems to make a card feel more social.
- On a light paper surface, use the existing light-surface lockup if lime is
  too weak. Never lower body-copy contrast to preserve a decorative accent.
- Meaningful text should meet at least 4.5:1 contrast. A decorative lime
  route or accent may be quieter, but it must not be the only way to understand
  the message.

## Wordmark and compact mark

### Full wordmark

The approved geometry is:

```text
P Y O K O
    ↑   /
```

More precisely:

- the first O is the quiet/orbit O and uses the lime family on a suitable
  surface;
- the final O is the coral personality/hop O and is slightly raised;
- the final O may carry the short lime dash;
- the P / Y / K remain the stable reading frame;
- the wordmark must read as `PYOKO` before the viewer notices the accents.

On Forest, use the production dark-surface relationship: ivory wordmark,
lime first O, coral raised final O and lime dash. On paper, use the existing
light-surface adaptation when needed for contrast; this is a responsive color
variant, not a new logo.

### Compact mark

Use `assets/brand/pyoko-symbol.svg` for favicon, avatar, bookmark and small
share placements. It is derived from P + offset OO + dash.

Do not replace it with:

- `G`, `GP`, a museum building, ticket, map pin or Tokyo Tower;
- a dog paw, bird, footprint or mascot face;
- a newly invented icon that only happens to use the same colors.

At 16–32px, simplify only by removing nonessential detail from the existing
mark. Do not change the underlying symbol relationship.

## Hopping language

### Approved motifs

Use one of these, usually only once per card:

- two offset circles derived from the two O's;
- a short curved route with two or three waypoints;
- a coral landing point and a lime hop dash;
- a light dotted path between two content states;
- the `P + offset OO` compact mark.

The route should feel like a small, quiet move, not navigation chrome. It
should not look like a workflow diagram or a map legend.

### Avoid

- literal animal footprints;
- cartoon birds, wings, eyes, beaks or feathers;
- large arrows on every card;
- multiple unrelated hand-drawn squiggle styles;
- decorative blobs with no relationship to the O / route grammar;
- “cute” character poses that make the mascot more memorable than PYOKO.

If an editorial campaign uses a human illustration, it must be treated as a
separate campaign layer: consistent line weight, limited Forest/ivory/green
fills, no random doodle vocabulary, and never in place of the wordmark.

## Deterministic SNS production system

> **Template controls consistency; content controls variation.**

Future PYOKO social work reuses one stable visual system. Each new carousel
changes its editorial content and approved evidence inside the template; it
does not redesign PYOKO's brand grammar for every post. Keep the shared visual hierarchy and layout system intact while changing
approved content and assets. A publication-specific template may implement
these rules, but is not required to understand this public guide.

When multiple approved or prepared publication payloads must remain
reproducible at once, keep them as named payloads in the same shared source and
select the intended payload with its documented campaign query parameter. Keep
the existing payload as the default unless the campaign explicitly changes it.

### Production contract

- Compose final copy, factual UI, optional page indices and PYOKO marks deterministically
  in HTML/CSS/SVG or another controlled layout tool. They must not be generated
  as pixels by an image model.
- If image generation is used, limit it to approved non-text background or
  editorial illustration layers. Replace generated logos, text and factual UI
  with controlled assets and data before export.
- Keep one shared carousel grid, safe inset, typography roles, spacing rhythm,
  card treatment, page-index treatment and footer-signature system. The PYOKO
  footer hierarchy and approved brand assets remain stable across the carousel.
- Let content control variation: give each card one clear idea, use an
  approved evidence layer, and make the carousel communicate a coherent
  editorial progression rather than a collection of unrelated branded posters.
- Prefer real, current PYOKO product evidence when explaining product value.
  If a simplified UI is necessary, make it deterministic and clearly framed;
  do not substitute generic fabricated SaaS UI that could be mistaken for the
  product.
- Human editorial illustration may support a campaign story, but it remains a
  campaign layer and must not become a mascot or identity element.
- Review locale-specific CJK typography and line breaking independently for
  each produced locale. Review both the full-size export and the 20% /
  216 × 270 thumbnail version before acceptance.

Paw motifs, mascot reinterpretations, AI-generated logos, AI-generated
production CJK text and invented official-looking Grutto Pass assets remain
prohibited.

### Recommended canvases

- Feed portrait: `1080 × 1350` (4:5)
- Square: `1080 × 1080`
- Social preview: `1200 × 630`

Use a consistent safe inset. For a 1080px-wide canvas, start with 64–80px and
do not place essential copy or the lockup against the edge. Use a single grid
and repeat the same positions across a carousel.

### Carousel anatomy

```text
[optional page index / 4]

[one clear editorial headline]
[short supporting sentence]

[proof: real product UI, source-backed fact, or simple explanation]

[PYOKO full lockup or compact mark]
[descriptor]
[Unofficial / 非公式 / 非官方]
```

Rules:

- Page index is optional platform metadata, not a required content element.
  Xiaohongshu publication exports omit it because the platform provides
  carousel position; standalone / off-platform formats may show it.
- When shown, keep the page index in one stable position and use it as
  metadata, not a second brand badge.
- Give each card one main idea. Do not make the page index, headline, UI,
  illustration and logo all compete at the same scale.
- Keep the footer lockup position and size stable across the carousel.
- Use the same card radius, border, shadow and line weight throughout one set.
- A warm ivory editorial background is allowed as a Forest-compatible social
  surface; it is not a new Warm Neutral brand direction.
- Use the existing share composition in `assets/brand/pyoko-share.svg` as the
  baseline for OG-like cards before inventing a new composition.

### Canonical editorial archetypes

The reusable carousel progression is a four-role editorial system. The roles
are durable; campaign copy, examples and product evidence may change.

#### P1 — Visitor Question / Hook

Establish the user's immediate tension or question using the strongest
approved hook for the campaign. The hook may be a question, a concrete
observed situation, or a number-led contrast. Keep one clear entry point; do
not make any single campaign's copy a permanent requirement.

#### P2 — Friction / Before

Show why the visitor's current way of answering the P1 question is incomplete,
fragmented or effortful. Use before-side evidence and friction, not a PYOKO
solution or feature list. Opening hours, last admission, exhibitions and Pass
eligibility remain valid XHS-001 examples, not the archetype definition.

#### P3 — Product Proof

Show real or controlled PYOKO evidence that directly answers the specific
friction introduced in P2. Prefer current product evidence or the existing
deterministic product-proof representation. Do not reduce this role to a
generic feature list.

#### P4 — Positioning / Resolution

Resolve the specific campaign tension and connect it back to PYOKO's durable
proposition without overclaiming. “东京有哪些馆” versus “我下一站去哪？”
remains a valid positioning example, not a required sentence for every
carousel.

The canonical sequence is therefore:

```text
P1 visitor question → P2 previous friction → P3 product proof →
P4 positioning / resolution
```

### Semantic route progression

The route uses one shared PYOKO motion grammar while changing meaning by
archetype. It should read as one evolving path, not four unrelated squiggles:

- **P1 / question:** a lime origin moves toward an unresolved coral landing
  point, leaving open space for the campaign's unresolved question.
- **P2 / friction:** a quiet, meandering track passes relevant friction points
  before the answer; it supports the before-state without becoming a workflow
  diagram.
- **P3 / consolidation:** separate evidence inputs converge into one product
  view, then move toward the takeaway. This is consolidation, not a sequence.
- **P4 / resolution:** the route becomes continuous and lands on the resolved
  campaign answer; supporting evidence remains input rather than a linear
  workflow.

Keep the lime origin / active movement, restrained neutral track and coral
landing point. Do not add arrows, map pins, footprints, paws or navigation
chrome.

### 20% thumbnail acceptance gate

The canonical `?mode=thumb` review renders four cards at exactly 20% of the
1080 × 1350 canvas: `216 × 270 px`, arranged for side-by-side comparison. The
thumbnail gate does not depend on a visible page-index pill.
At this scale, accept hierarchy rather than requiring every supporting line to
remain readable:

- **P1:** the campaign hook is immediately identifiable.
- **P2:** the friction or contrast is immediately identifiable.
- **P3:** one real product-proof block is clearly identifiable.
- **P4:** the resolution and PYOKO ownership are clearly identifiable.

Supporting copy does not need to remain readable at 20% / 216 × 270.

### Typography

- Use the production font roles: `--pyoko-font` for the Latin wordmark and
  `--font-sans` / locale-specific sans stacks for UI and CJK copy.
- Keep Chinese and Japanese display text readable before making it expressive.
- Do not use a decorative “Japanese” font to create cultural flavor.
- Avoid body copy below 16px at final 1× export; for 1080px social cards,
  20–28px is a safer starting range for supporting copy.
- Keep line-height generous enough for CJK; do not compress Chinese or
  Japanese text to preserve a decorative layout.
- Never rely on coral or lime alone to communicate a product state.

## Product proof and official boundary

The most trustworthy social cards show the real PYOKO product:

- use a current screenshot or a deterministic simplified UI fragment;
- preserve real product green for controls and selected states;
- do not fabricate facility hours, exhibition names, Pass benefits or status;
- do not make a generated browser mockup look like a source-backed screenshot;
- if a screenshot is illustrative, label it as a concept or use a clearly
  simplified frame without false factual detail.

The official Grutto Pass can be named as the supported product, but its logo,
ticket, cover, typography and official visual motifs must not become PYOKO
decoration. When a source image is necessary, use it only as evidence with
appropriate permission and clear context; otherwise use a neutral document or
app representation.

## Localization

Before export, check each locale independently:

- JA: `東京・ミュージアム ぐるっとパス` / `非公式ガイド`
- EN: `Tokyo Museum Grutto Pass` / `Unofficial guide`
- ZH: `东京·博物馆 Grutto Pass` / `非官方指南`

Do not mix Japanese descriptor text into a Chinese or English card unless the
official Japanese name is intentionally shown as a quoted source label.

Check for:

- correct line breaks at 320px-equivalent preview width;
- no isolated final glyphs or orphaned punctuation;
- natural spacing around Latin words such as `PYOKO`, `Pass` and `Grutto Pass`;
- correct `非公式`, `Unofficial` and `非官方` hierarchy;
- no accidental claim that PYOKO is official.

## Image-generation workflow

### Safe positive direction

```text
PYOKO editorial cultural guide social card, warm ivory paper or deep Forest
surface, restrained museum-catalogue composition, bold readable CJK typography
added later in a layout tool, real product UI evidence, one subtle curved route
with two or three waypoints, PYOKO two-O movement language, coral and lime
accents only, calm contemporary Japanese digital product, generous whitespace.
```

### Required negative constraints

```text
no dog paw, no paw print, no cat, no literal bird, no bird mascot, no animal
character, no kawaii mascot, no official Grutto Pass logo, no recreated ticket
cover, no Tokyo Tower logo, no museum-column logo, no passport icon, no map-pin
logo, no generic SaaS gradient, no glow, no random blobs, no AI-generated logo,
no AI-generated Chinese/Japanese/English text.
```

After generation, replace every generated text, logo and factual UI element
with production-controlled assets. Treat image-model output as a visual draft,
not a shippable brand asset.

## Pre-export checklist

### Brand

- [ ] PYOKO is the clearest identity in the lockup.
- [ ] The wordmark is an approved asset or production-derived geometry.
- [ ] The two-O relationship is present but does not overpower the wordmark.
- [ ] No paw, bird, animal or mascot has been introduced.
- [ ] The descriptor is visibly secondary and `Unofficial` is tertiary.

### Color and semantics

- [ ] Only the Forest, ivory, coral, lime, shared neutral and product-green
      roles are used.
- [ ] Product green is limited to real interaction/state meaning or real UI.
- [ ] Body copy and essential metadata remain readable at reduced preview size.
- [ ] No gradient, glow or new accent family has been added.

### Content and provenance

- [ ] Product screenshots are current or explicitly marked illustrative.
- [ ] No official Grutto Pass visual asset has been redrawn or used as PYOKO
      identity.
- [ ] Facts, Pass benefits, hours and exhibition details match the reviewed
      product data or are clearly framed as general explanation.
- [ ] The image does not imply official affiliation.

### Localization and output

- [ ] JA, EN and ZH are checked separately where produced.
- [ ] Text is composited outside image generation and manually proofread.
- [ ] Essential content passes the 20% / 216 × 270 thumbnail gate.
- [ ] The lockup survives both portrait and square crops.
- [ ] Alt text or an accessible text equivalent exists when the image is used
      in a webpage or campaign post.

## Deliberately out of scope

This guide does not authorize:

- a new mascot or bird character system;
- a new logo geometry;
- a new product UI palette;
- a Grutto Pass co-brand or official partnership claim;
- a new illustration library without a separate design decision;
- changes to facility data, Pass semantics, provenance or product IA.
