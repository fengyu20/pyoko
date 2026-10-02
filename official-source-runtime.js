// Executable runtime consuming data/facility-official-sources.js; load the data file first.

/* ---- URL normalization (must stay equivalent to normalizeFacilityUrl) ---- */
function normalizeSourceUrl(url) {
  const value = String(url == null ? '' : url).trim();
  if (!value) return '';
  try {
    const parsed = new URL(value);
    const pathname = parsed.pathname.replace(/\/+$/, '') || '/';
    return `${parsed.protocol}//${parsed.host}${pathname}${parsed.search}`;
  } catch {
    return value.replace(/#.*$/, '').replace(/\/+$/, '');
  }
}

function facilitySourceKey(facility) {
  return String(facility?._key || `${facility?.no || ''}-${facility?.name || ''}`);
}

/*
 * Compatibility adapter: the legacy `urls` array is the declared facility
 * homepage. It is mapped to a `homepage` relation record so the renderer has one
 * semantic shape to read, and so a future explicit homepage record can take over
 * without touching the renderer. This is the ONLY URL meaning inferred from an
 * existing, already-declared field (urls === the facility homepage), not from a
 * URL string.
 */
function legacyFacilityHomepageSources(facility) {
  const urls = Array.isArray(facility?.urls) ? facility.urls : [];
  const year = typeof CONFIG !== 'undefined' ? CONFIG.year : null;
  return urls
    .filter(url => /^https?:\/\//i.test(String(url || '')))
    .map(url => ({
      url: String(url).trim(),
      authority: 'facility',
      page_type: 'homepage',
      relation: 'homepage',
      confirms_pass_entitlement: false,
      applicable_year: year,
      checked_at: null,
      confidence: 'reviewed',
      legacy: true
    }));
}

function dedupeSources(sources) {
  const seen = new Set();
  const result = [];
  (Array.isArray(sources) ? sources : []).forEach(source => {
    if (!source?.url) return;
    const key = normalizeSourceUrl(source.url);
    if (!key || seen.has(key)) return;
    seen.add(key);
    result.push(source);
  });
  return result;
}

function getFacilityOfficialSources(facility) {
  const explicit = FACILITY_OFFICIAL_SOURCES[facilitySourceKey(facility)] || [];
  return dedupeSources([
    ...FACILITY_OFFICIAL_GLOBAL_SOURCES,
    ...explicit,
    ...legacyFacilityHomepageSources(facility)
  ]);
}

function getFacilityHomepageSource(facility) {
  return getFacilityOfficialSources(facility)
    .find(source => source.relation === 'homepage' && source.page_type === 'homepage') || null;
}

function getSourcesForRelation(facility, relation) {
  return getFacilityOfficialSources(facility).filter(source => source.relation === relation);
}

/*
 * Entitlement-evidence arbitration.
 *
 * Several official Grutto sources can be registered for one facility: the
 * edition-wide brochure and exhibition PDF, plus any later update read for THIS
 * facility. The Pass CTA should point at whichever of them best answers the
 * facility's current eligibility question, not at whichever was registered first.
 *
 * The ranking is deliberately narrow, and applies ONLY inside the already
 * relation-filtered candidate set:
 *
 *   1. scope specificity — a record a human assigned to this facility
 *      (`source_scope: 'facility'`) beats an edition-wide record.
 *   2. recency — among equally scoped records, the later `published_at`.
 *   3. registry order — stable fallback.
 *
 * A newer record with a DIFFERENT relation never enters this comparison, so an
 * unrelated recent page (an editorial fact source, an exhibition context page)
 * cannot displace older evidence just by being newer.
 */
function pickBestSource(candidates) {
  const list = (Array.isArray(candidates) ? candidates : []).filter(Boolean);
  if (!list.length) return null;
  const scopeRank = source => (source.source_scope === 'facility' ? 0 : 1);
  return list.reduce((best, source) => {
    const scopeDiff = scopeRank(source) - scopeRank(best);
    if (scopeDiff !== 0) return scopeDiff < 0 ? source : best;
    const a = String(source.published_at || '');
    const b = String(best.published_at || '');
    if (a && b && a !== b) return a > b ? source : best;
    if (a && !b) return source;
    return best;
  }, list[0]);
}

/*
 * Does this source earn an ACTIONABLE Pass CTA?
 *
 * Only a facility-side page that actually carries Grutto Pass instructions does.
 * `pass_confirmation` means a human read the page and found it naming the Pass,
 * so opening it can answer "how do I use this here?" — real information gain.
 *
 * `context_confirmation` never qualifies: by definition that page says nothing
 * about the Pass. Labelling a generic museum exhibition page
 * "check the eligible exhibition on the official site" promises a verification
 * the destination cannot perform. `provides_pass_guidance` is the explicit opt-in
 * for a page that carries redemption / reservation instructions without being a
 * plain Pass confirmation; nothing is ever inferred from a URL.
 */
function sourceIsActionablePassGuidance(source) {
  if (!source?.url) return false;
  return source.relation === 'pass_confirmation' || source.provides_pass_guidance === true;
}

/* ---- provenance document identity & deep links ---- */

/*
 * A provenance DOCUMENT, not an evidence edge.
 *
 * The same PDF can be cited twice — once as the edition baseline, once as the
 * page carrying a facility's eligible exhibitions — and `…pdf` / `…pdf#page=12`
 * are the same document. Counting those as two "official sources" would inflate
 * the number the disclosure shows, so identity strips the fragment and reuses the
 * registry's own URL normalization.
 */
function provenanceDocumentId(url) {
  return normalizeSourceUrl(String(url == null ? '' : url).replace(/#.*$/, ''));
}

/*
 * Every recorded page for this facility, keyed by normalized document id.
 *
 * Two declared homes, one assembler: the exhibition PDF's locators live in the
 * data/facility-official-sources.js table, the brochure's in `data/facility-brochure.js` where another
 * feature already reads them. Duplicating either would create a drift hazard, so
 * neither is copied — this is the only place they are joined.
 */
function getFacilitySourcePages(facility) {
  const key = facilitySourceKey(facility);
  const pages = {};
  const record = (docUrl, page) => {
    const value = Number(page);
    if (!docUrl || !Number.isInteger(value) || value <= 0) return;
    pages[provenanceDocumentId(docUrl)] = value;
  };
  Object.entries(FACILITY_SOURCE_PAGES).forEach(([document, table]) => {
    record(SOURCE_PAGE_DOCUMENTS[document]?.url, table[key]);
  });
  const brochure = typeof FACILITY_BROCHURE !== 'undefined' ? FACILITY_BROCHURE : null;
  if (brochure) record(brochure.metadata?.source, brochure.cards?.[key]?.sourcePage);
  return pages;
}

function isPdfSource(source) {
  if (!source) return false;
  if (source.page_type === 'official_pdf') return true;
  return /\.pdf(?:$|[?#])/i.test(String(source.url || ''));
}

/*
 * Best-effort deep link into a PDF.
 *
 * `#page=N` is honored by desktop viewers and ignored by several mobile ones, so
 * it is a convenience only — the visible "p.N" label is what the reader can rely
 * on, and it is never omitted just because the fragment worked in one browser.
 * Centralized here so no renderer hand-concatenates a fragment onto a URL that
 * may already carry a query string or one of its own.
 */
function getSourceOpenUrl(source) {
  const url = String(source?.url || '');
  if (!url) return '';
  const page = Number(Array.isArray(source?.pages) ? source.pages[0] : source?.pdf_page);
  if (!isPdfSource(source) || !Number.isInteger(page) || page <= 0) return url;
  return `${url.replace(/#.*$/, '')}#page=${page}`;
}

/*
 * Role of a source with respect to the Pass claim, as a localization KEY. The
 * user sees "基本特典", never `entitlement_evidence` — internal vocabulary is not
 * user-facing copy. Resolved from data a human already declared, never guessed:
 * an explicit `claim_role` wins, then the time-scope role, then the relation.
 */
function passSourceRoleKey(source) {
  if (source?.claim_role) return source.claim_role;
  if (source?.role === 'exhibition_information_snapshot') return 'eligibleExhibition';
  if (source?.role === 'later_grutto_update') return 'latestEligibility';
  if (source?.relation === 'pass_confirmation') return 'facilityConfirmation';
  if (source?.relation === 'entitlement_evidence') return 'baseBenefit';
  return '';
}

/*
 * Normalize one raw record into an atomic provenance record.
 *
 * Every field the disclosure renders for a source — title, dates, page, and the
 * href it opens — is produced HERE, from one input record. The previous
 * implementation resolved the title through a separate URL-keyed lookup while the
 * href came from the arbitration result, so the two could describe different
 * documents; 90 of 108 facilities ended up showing a generic "公式情報" heading
 * above a link to a document that heading did not name.
 */
function toProvenanceRecord(source, pages) {
  const url = String(source?.url || '');
  if (!url) return null;
  const list = (Array.isArray(pages) ? pages : [])
    .map(Number)
    .filter(page => Number.isInteger(page) && page > 0);
  const record = {
    id: provenanceDocumentId(url),
    url,
    // The registry calls a document's name `title`; the time-scope source table
    // calls it `label`. Both mean the same thing, so the adapter accepts either
    // rather than letting a renderer fall back to showing a raw URL.
    title: String(source.title || source.label || '').trim(),
    role_key: passSourceRoleKey(source),
    published_at: source.published_at || '',
    checked_at: source.checked_at || '',
    snapshot_as_of: source.snapshot_as_of || '',
    is_pdf: isPdfSource(source),
    pages: [...new Set(list)].sort((a, b) => a - b)
  };
  record.open_url = getSourceOpenUrl(record.is_pdf ? { ...record, page_type: 'official_pdf' } : record);
  return record;
}

// Merge a record into the accumulator by DOCUMENT identity, unioning page refs
// and filling in fields the first sighting lacked.
function mergeProvenanceRecord(map, record) {
  if (!record?.id) return;
  const existing = map.get(record.id);
  if (!existing) {
    map.set(record.id, record);
    return;
  }
  existing.title = existing.title || record.title;
  existing.role_key = existing.role_key || record.role_key;
  existing.published_at = existing.published_at || record.published_at;
  existing.checked_at = existing.checked_at || record.checked_at;
  existing.snapshot_as_of = existing.snapshot_as_of || record.snapshot_as_of;
  existing.is_pdf = existing.is_pdf || record.is_pdf;
  existing.pages = [...new Set([...existing.pages, ...record.pages])].sort((a, b) => a - b);
  existing.open_url = getSourceOpenUrl({ ...existing, page_type: existing.is_pdf ? 'official_pdf' : '' });
}

/*
 * Pass provenance — "what official material is this conclusion based on?"
 *
 * `claimSources` (optional) are the records the time-scope layer says support the
 * CURRENTLY VISIBLE claim, most relevant first. They set the primary; the registry
 * supplies the rest. Presentation does not re-run authority arbitration — it only
 * picks, among evidence arbitration already accepted, the one closest to what the
 * user is looking at right now.
 *
 * Returns { primary, supporting } of atomic records. `supporting` is deduped by
 * document, so the count the UI shows is a number of DOCUMENTS, never a number of
 * evidence edges, and every entry can be listed.
 */
function resolvePassProvenance(facility, claimSources) {
  return resolvePassProvenanceFromSources(
    getFacilityOfficialSources(facility),
    claimSources,
    getFacilitySourcePages(facility)
  );
}

function resolvePassProvenanceFromSources(sources, claimSources, sourcePages) {
  const list = Array.isArray(sources) ? sources : [];
  const homepageKeys = new Set(
    list.filter(source => source.relation === 'homepage').map(source => normalizeSourceUrl(source.url))
  );
  // Claim provenance, not "every official link known for this facility": opening
  // hours, access, About and Introduction sources support other facts and are not
  // evidence for what the Pass grants.
  const contributing = list.filter(source =>
    (source.relation === 'entitlement_evidence' || source.relation === 'pass_confirmation')
    && Boolean(source.url)
    && !homepageKeys.has(normalizeSourceUrl(source.url))
  );
  const claims = (Array.isArray(claimSources) ? claimSources : []).filter(entry => entry?.url);
  if (!contributing.length && !claims.length) return null;

  const map = new Map();
  const order = [];
  const pageMap = sourcePages || {};
  const add = (source, pages) => {
    const record = toProvenanceRecord(source, pages);
    if (!record) return;
    // A recorded locator applies to the DOCUMENT, so it reaches the source
    // whether it arrived as the primary claim or as supporting evidence.
    const recorded = pageMap[record.id];
    if (Number.isInteger(recorded) && recorded > 0 && !record.pages.includes(recorded)) {
      record.pages = [...record.pages, recorded].sort((a, b) => a - b);
      record.open_url = getSourceOpenUrl({ ...record, page_type: record.is_pdf ? 'official_pdf' : '' });
    }
    if (!map.has(record.id)) order.push(record.id);
    mergeProvenanceRecord(map, record);
  };
  // Claim-relevant records first so the primary is the one supporting what is
  // actually on screen; the registry then enriches or appends.
  claims.forEach(entry => add(entry, entry.pages));
  contributing.forEach(source => add(source, source.pdf_page ? [source.pdf_page] : []));

  const records = order.map(id => map.get(id));
  const preferred = claims.length ? map.get(provenanceDocumentId(claims[0].url)) : null;
  const primary = preferred || (() => {
    const evidence = contributing.filter(source => source.relation === 'entitlement_evidence');
    const best = pickBestSource(evidence.length ? evidence : contributing);
    return best ? map.get(provenanceDocumentId(best.url)) : null;
  })();
  if (!primary) return null;
  return { primary, supporting: records.filter(record => record.id !== primary.id) };
}

/*
 * Contextual CTA resolver.
 *
 * Pure over an explicit source list so tests can feed synthetic records without
 * touching the production registry. Returns an array of { kind, source } CTA
 * descriptors, never a homepage-derived CTA for a contextual section.
 *
 * kind vocabulary:
 *   pass_confirmation         Pass -> "Facility official guidance"
 *   exhibition_page           Exhibitions -> "Exhibition page"
 *   exhibition_listing        Exhibitions -> "Exhibition information"
 *   exhibition_view_all       Exhibitions -> "View all exhibitions"
 *   opening_hours             Opening Hours -> "Check opening hours"
 *
 * Guards:
 *   - A context_confirmation source is never promoted to Pass guidance, whatever
 *     its confirms_pass_entitlement flag says — the relation decides.
 *   - Homepage-relation records are excluded from every contextual section.
 *   - The Pass section emits at most ONE actionable link, and only when a
 *     facility-side page carries real Pass guidance. Entitlement evidence is
 *     provenance (see resolvePassProvenance), not navigation.
 */
function resolveCtasFromSources(section, sources) {
  const list = Array.isArray(sources) ? sources : [];
  const homepageKeys = new Set(
    list.filter(source => source.relation === 'homepage').map(source => normalizeSourceUrl(source.url))
  );
  const nonHomepage = source => Boolean(source?.url) && !homepageKeys.has(normalizeSourceUrl(source.url));
  const ctas = [];

  if (section === 'pass') {
    // Evidence is deliberately absent here. The Grutto brochure / PDF / later
    // update justify the facts the section already states, so they are shown as
    // provenance rather than as a permanent link out to a document the user
    // would have to re-read to learn what we have already told them.
    const guidance = pickBestSource(
      list.filter(source => sourceIsActionablePassGuidance(source) && nonHomepage(source))
    );
    if (guidance) ctas.push({ kind: 'pass_confirmation', source: guidance });
    return ctas;
  }

  if (section === 'hours') {
    const operational = list.find(source =>
      source.relation === 'operational_source'
      && (source.page_type === 'opening_hours' || source.page_type === 'visit')
      && nonHomepage(source)
    );
    if (operational) ctas.push({ kind: 'opening_hours', source: operational });
    return ctas;
  }

  if (section === 'exhibition') {
    const specific = list.find(source =>
      source.relation === 'context_confirmation' && source.page_type === 'exhibition' && nonHomepage(source)
    );
    if (specific) {
      ctas.push({ kind: 'exhibition_page', source: specific });
      return ctas;
    }
    const listing = list.find(source =>
      source.relation === 'context_confirmation' && source.page_type === 'exhibition_listing' && nonHomepage(source)
    );
    if (listing) ctas.push({ kind: 'exhibition_listing', source: listing });
    return ctas;
  }

  return ctas;
}

function resolveContextualCtas(section, facility) {
  return resolveCtasFromSources(section, getFacilityOfficialSources(facility));
}

window.normalizeSourceUrl = normalizeSourceUrl;
window.facilitySourceKey = facilitySourceKey;
window.legacyFacilityHomepageSources = legacyFacilityHomepageSources;
window.dedupeSources = dedupeSources;
window.pickBestSource = pickBestSource;
window.sourceIsActionablePassGuidance = sourceIsActionablePassGuidance;
window.resolvePassProvenance = resolvePassProvenance;
window.resolvePassProvenanceFromSources = resolvePassProvenanceFromSources;
window.getFacilitySourcePages = getFacilitySourcePages;
window.provenanceDocumentId = provenanceDocumentId;
window.getSourceOpenUrl = getSourceOpenUrl;
window.passSourceRoleKey = passSourceRoleKey;
window.toProvenanceRecord = toProvenanceRecord;
window.getFacilityOfficialSources = getFacilityOfficialSources;
window.getFacilityHomepageSource = getFacilityHomepageSource;
window.getSourcesForRelation = getSourcesForRelation;
window.resolveCtasFromSources = resolveCtasFromSources;
window.resolveContextualCtas = resolveContextualCtas;
