# Grutto Pass release smoke checklist

Run `npm run test:release` first. This checklist is intentionally limited to
visual and device behavior that is not stable or valuable enough for a brittle
automated assertion.

Use the built production artifact or a production-like local server. These
checks require only public runtime pages and assets.

- [ ] Open the production-like local page on an iPhone-sized viewport (320–390 px) and confirm the Hero has balanced spacing, readable title/metadata, and visible language controls.
- [ ] Switch JA → EN → ZH and scan the Hero, cards, Drawer headings, Access, Pass copy, and status text for natural wrapping and any untranslated or clipped fragment.
- [ ] Tap the List/Map controls with a real touch device or touch emulation; confirm the controls feel easy to hit and do not shift the surrounding layout.
- [ ] Open a long-content Drawer on mobile. Confirm the information hierarchy is clear, the body scrolls independently, the header/close control remains reachable, and no content is hidden behind the bottom edge.
- [ ] Check a long facility name and a long Access route at 320 px and 375 px. Confirm the visited control, text, and action links do not overlap.
- [ ] Open and close the Filter & sort panel on mobile. Confirm the backdrop, panel edge, close/apply affordance, and return to the list feel intentional.
- [ ] Mark a facility visited with the filter off, then with Not visited on. Confirm the card does not jump unexpectedly and the visible state is understandable.
- [ ] Open My Pass after marking and unmarking a facility. Confirm the list, count/savings copy, and empty state are visually synchronized.
- [ ] Open Map at desktop width (1024 px and 1440 px). Confirm real tiles, markers, zoom controls, and the selected-facility panel are visually legible and neither pane collapses.
- [ ] In Map, select two different facilities. Confirm the panel content visibly replaces the first facility rather than appending or retaining stale detail.
- [ ] Check a facility with ongoing and upcoming exhibitions, then change the selected date. Confirm the section labels and ordering communicate current versus upcoming content naturally.
- [ ] Follow one official-site and one Google Maps route link in a disposable tab only if needed, verifying the destination is correct without treating third-party availability as a release result.

Record any finding as one of: product bug, data/content issue, browser/device
issue, or manual-only polish. Do not waive an overflow or inaccessible primary
action as a typography detail.
