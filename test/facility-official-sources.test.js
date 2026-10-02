// Official Source Registry & Contextual CTA contract — unit tests.
//
// These tests lock the semantic model behind the Detail Header globe and every
// contextual section CTA: a URL's meaning is decided in data preparation, the
// runtime only consumes classified records, and a homepage is never reused as a
// contextual CTA.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');

const BROCHURE_URL = 'https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf';

function loadRegistry() {
  const window = {
    location: { href: 'https://example.test/index.html?lang=ja' },
    navigator: { language: 'ja' },
    localStorage: { getItem: () => null, setItem: () => {} }
  };
  const context = vm.createContext({ window, URL });
  let src = ['config.js', 'data/facilities.js', 'data/facility-brochure.js', 'data/facility-official-sources.js', 'official-source-runtime.js']
    .map(f => fs.readFileSync(path.join(root, f), 'utf8'))
    .join('\n;\n');
  src += ';globalThis.__api = { DATA, FACILITY_OFFICIAL_GLOBAL_SOURCES, FACILITY_OFFICIAL_SOURCES, normalizeSourceUrl, dedupeSources, getFacilityOfficialSources, getFacilityHomepageSource, legacyFacilityHomepageSources, resolveCtasFromSources, resolveContextualCtas, pickBestSource, sourceIsActionablePassGuidance, resolvePassProvenance, resolvePassProvenanceFromSources, provenanceDocumentId, getSourceOpenUrl, passSourceRoleKey, toProvenanceRecord, getFacilitySourcePages, FACILITY_SOURCE_PAGES, SOURCE_PAGE_DOCUMENTS, FACILITY_BROCHURE };';
  vm.runInContext(src, context, { filename: 'registry-bundle.js' });
  return { api: context.__api, window };
}

function loadUi() {
  const window = {
    location: { href: 'https://example.test/index.html?lang=ja' },
    navigator: { language: 'ja' },
    localStorage: { getItem: () => null, setItem: () => {} }
  };
  const context = vm.createContext({ window, URL });
  vm.runInContext(fs.readFileSync(path.join(root, 'i18n/ui.js'), 'utf8'), context, { filename: 'ui.js' });
  return window;
}

const { api } = loadRegistry();
const facilities = api.DATA.flatMap(area => area.facilities || []);
const facilityByKey = key => facilities.find(f => f._key === key);

const makeSource = overrides => ({
  url: 'https://example.test/page',
  authority: 'facility',
  page_type: 'homepage',
  relation: 'homepage',
  confirms_pass_entitlement: false,
  applicable_year: 2026,
  checked_at: null,
  confidence: 'reviewed',
  ...overrides
});

/* ---- Header homepage ownership ---- */

test('every facility with a homepage resolves one canonical homepage source', () => {
  for (const f of facilities) {
    const home = api.getFacilityHomepageSource(f);
    assert.ok(home, `${f._key} should have a homepage`);
    assert.equal(home.relation, 'homepage');
    assert.equal(home.page_type, 'homepage');
    assert.equal(home.authority, 'facility');
    assert.equal(home.confirms_pass_entitlement, false);
    assert.equal(api.normalizeSourceUrl(home.url), api.normalizeSourceUrl((f.urls || [])[0]));
  }
});

test('a facility without a homepage yields null (no empty globe)', () => {
  assert.equal(api.getFacilityHomepageSource({ _key: 'x', name: 'X', urls: [] }), null);
  assert.equal(api.getFacilityHomepageSource({ _key: 'x', name: 'X' }), null);
  assert.equal(api.getFacilityHomepageSource({ _key: 'x', name: 'X', urls: ['javascript:alert(1)'] }), null);
});

test('legacy homepage adapter keeps only http(s) URLs and marks them legacy', () => {
  const sources = api.legacyFacilityHomepageSources({ urls: ['javascript:alert(1)', 'https://example.test/'] });
  assert.equal(sources.length, 1);
  assert.equal(sources[0].url, 'https://example.test/');
  assert.equal(sources[0].relation, 'homepage');
  assert.equal(sources[0].legacy, true);
});

/* ---- URL normalization & dedupe ---- */

test('normalized URL equivalents collapse to a single source record', () => {
  assert.equal(api.normalizeSourceUrl('https://example.test/'), api.normalizeSourceUrl('https://example.test'));
  assert.equal(api.normalizeSourceUrl('https://example.test/a/'), api.normalizeSourceUrl('https://example.test/a'));
  assert.notEqual(api.normalizeSourceUrl('https://example.test/a'), api.normalizeSourceUrl('https://example.test/b'));

  const deduped = api.dedupeSources([
    makeSource({ url: 'https://example.test/' }),
    makeSource({ url: 'https://example.test', relation: 'operational_source' })
  ]);
  assert.equal(deduped.length, 1);
});

/* ---- Contextual CTA contract ---- */

test('entitlement evidence is provenance, not an actionable Pass CTA', () => {
  // v97 presentation policy: having the source does not mean showing a link.
  const f = facilityByKey('1');
  assert.equal(api.resolveContextualCtas('pass', f).length, 0);

  // …but it is still fully recorded and inspectable.
  const provenance = api.resolvePassProvenance(f);
  assert.equal(provenance.primary.url, BROCHURE_URL);
  assert.equal(provenance.primary.title, '「ぐるっとパス2026」パンフレット');
  assert.equal(provenance.primary.role_key, 'baseBenefit');
  assert.ok(Array.isArray(provenance.supporting));
});

test('hours and exhibition sections stay empty when only a homepage exists', () => {
  const f = facilityByKey('1');
  assert.equal(api.resolveContextualCtas('hours', f).length, 0);
  assert.equal(api.resolveContextualCtas('exhibition', f).length, 0);
});

test('only a facility-side page carrying Pass guidance becomes an actionable CTA', () => {
  // Evidence: recorded, never a CTA — the product already read it for the user.
  assert.equal(api.resolveCtasFromSources('pass', [makeSource({ relation: 'entitlement_evidence', page_type: 'official_pdf' })]).length, 0);
  // Facility guidance: information gain, so it earns the link.
  assert.equal(api.resolveCtasFromSources('pass', [makeSource({ relation: 'pass_confirmation', page_type: 'pass_guidance' })])[0].kind, 'pass_confirmation');
  // Context: the page says nothing about the Pass, so it cannot verify anything.
  assert.equal(api.resolveCtasFromSources('pass', [makeSource({ relation: 'context_confirmation', page_type: 'exhibition' })]).length, 0);
  // Explicit opt-in for a page with redemption / reservation instructions.
  const optIn = makeSource({ relation: 'context_confirmation', page_type: 'admission', provides_pass_guidance: true });
  assert.equal(api.resolveCtasFromSources('pass', [optIn])[0].kind, 'pass_confirmation');
});

test('a context_confirmation source is never promoted to Pass guidance', () => {
  // The relation decides, not the flag: even a mislabelled confirms_pass_entitlement
  // cannot turn a generic museum page into Pass verification.
  const honest = makeSource({ relation: 'context_confirmation', page_type: 'exhibition', confirms_pass_entitlement: false });
  const mislabelled = makeSource({ relation: 'context_confirmation', page_type: 'exhibition', confirms_pass_entitlement: true });
  assert.equal(api.sourceIsActionablePassGuidance(honest), false);
  assert.equal(api.sourceIsActionablePassGuidance(mislabelled), false);
  assert.equal(api.resolveCtasFromSources('pass', [honest, mislabelled]).length, 0);
});

test('homepage-relation records never become a contextual section CTA', () => {
  const homepage = makeSource({ relation: 'homepage', page_type: 'homepage' });
  assert.equal(api.resolveCtasFromSources('pass', [homepage]).length, 0);
  assert.equal(api.resolveCtasFromSources('hours', [homepage]).length, 0);
  assert.equal(api.resolveCtasFromSources('exhibition', [homepage]).length, 0);
});

test('Hours section uses only an opening_hours / visit operational source', () => {
  assert.equal(
    api.resolveCtasFromSources('hours', [makeSource({ relation: 'operational_source', page_type: 'opening_hours' })])[0].kind,
    'opening_hours'
  );
  assert.equal(
    api.resolveCtasFromSources('hours', [makeSource({ relation: 'operational_source', page_type: 'visit' })])[0].kind,
    'opening_hours'
  );
  // admission is operational but not an opening-hours answer
  assert.equal(api.resolveCtasFromSources('hours', [makeSource({ relation: 'operational_source', page_type: 'admission' })]).length, 0);
});

test('Exhibition section prefers a specific page over a listing page', () => {
  const listing = makeSource({ relation: 'context_confirmation', page_type: 'exhibition_listing' });
  const specific = makeSource({ relation: 'context_confirmation', page_type: 'exhibition' });
  assert.equal(api.resolveCtasFromSources('exhibition', [listing])[0].kind, 'exhibition_listing');
  const both = api.resolveCtasFromSources('exhibition', [listing, specific]);
  assert.equal(both.length, 1);
  assert.equal(both[0].kind, 'exhibition_page');
});

/* ---- Localized accessible names & CTA labels ---- */

test('header globe and CTA labels localize in JA / EN / ZH', () => {
  const window = loadUi();
  const expectLabel = (language, key, expected) => {
    window.setAppLanguage(language);
    assert.equal(window.t(key), expected, `${language}/${key}`);
  };

  expectLabel('ja', 'facility.openHomepage', '{name}の公式サイトを開く');
  expectLabel('en', 'facility.openHomepage', 'Open {name} official website');
  expectLabel('zh', 'facility.openHomepage', '打开{name}官网');

  expectLabel('ja', 'source.cta.passConfirmation', '施設公式の案内');
  expectLabel('en', 'source.cta.passConfirmation', 'Facility official guidance');
  expectLabel('zh', 'source.cta.passConfirmation', '场馆官方说明');

  expectLabel('ja', 'source.cta.exhibitionViewAll', 'すべての展覧会を見る');
  expectLabel('en', 'source.cta.exhibitionViewAll', 'View all exhibitions');
  expectLabel('zh', 'source.cta.exhibitionViewAll', '查看全部展览');

  expectLabel('ja', 'pass.provenanceSummary', '公式情報に基づく');
  expectLabel('en', 'pass.provenanceSummary', 'Based on official sources');
  expectLabel('zh', 'pass.provenanceSummary', '基于官方资料');


  // The flat provenance list has no primary/other ranking, so its copy is gone.
  for (const key of ['pass.provenancePrimary', 'pass.provenanceOtherLabel', 'pass.provenanceRaw', 'pass.provenanceRawAria']) {
    for (const language of ['ja', 'en', 'zh']) {
      const window = loadUi();
      window.setAppLanguage(language);
      assert.equal(window.UI_STRINGS[language][key], undefined, `${language}/${key} should be retired`);
    }
  }

  for (const role of ['baseBenefit', 'eligibleExhibition', 'discountAmount', 'facilityConfirmation', 'latestEligibility']) {
    for (const language of ['ja', 'en', 'zh']) {
      const window = loadUi();
      window.setAppLanguage(language);
      const value = window.t(`pass.sourceRole.${role}`);
      assert.notEqual(value, `pass.sourceRole.${role}`, `${language}/${role} missing`);
      assert.ok(value.trim().length > 0, `${language}/${role} empty`);
    }
  }
  for (const key of ['pass.provenancePublished', 'pass.provenanceChecked', 'pass.provenancePage', 'pass.provenanceSourceAria']) {
    for (const language of ['ja', 'en', 'zh']) {
      const window = loadUi();
      window.setAppLanguage(language);
      assert.notEqual(window.t(key), key, `${language}/${key} missing`);
    }
  }

  expectLabel('ja', 'source.cta.exhibitionPage', '展覧会ページ');
  expectLabel('en', 'source.cta.exhibitionPage', 'Exhibition page');
  expectLabel('zh', 'source.cta.exhibitionPage', '展览页面');

  expectLabel('ja', 'source.cta.exhibitionListing', '展覧会情報');
  expectLabel('en', 'source.cta.exhibitionListing', 'Exhibition information');
  expectLabel('zh', 'source.cta.exhibitionListing', '展览信息');

  expectLabel('ja', 'source.cta.openingHours', '開館時間を公式サイトで確認');
  expectLabel('en', 'source.cta.openingHours', 'Check opening hours on the official site');
  expectLabel('zh', 'source.cta.openingHours', '在官网确认开放时间');
});

/* ---- v96 claim-aware entitlement-evidence arbitration ---- */

const SOGO_BLOG_0729 = 'https://www.rekibun.or.jp/grutto/blog/20260729-6866/';
const SOGO_TICKET = 'https://sogo-museum.jp/about/ticket.jsp';

test('a facility-scoped entitlement source outranks the edition-wide one', () => {
  // Arbitration is unchanged by the presentation policy — it now decides which
  // source the PROVENANCE names, instead of which link is permanently shown.
  const provenance = api.resolvePassProvenance(facilityByKey('100'));
  assert.equal(provenance.primary.url, SOGO_BLOG_0729);
  assert.equal(provenance.primary.published_at, '2026-07-29');
  assert.equal(provenance.primary.title, '8～9月のおすすめ展覧会（入場）');
});

test('recency only decides between records carrying the same relation', () => {
  const older = makeSource({ url: 'https://a.test/pdf', relation: 'entitlement_evidence', page_type: 'official_pdf', source_scope: 'edition', published_at: '2026-03-01' });
  const newerRelevant = makeSource({ url: 'https://b.test/blog', relation: 'entitlement_evidence', page_type: 'pass_guidance', source_scope: 'facility', published_at: '2026-07-29' });
  // A newer source about a DIFFERENT claim must not displace older evidence.
  const newerUnrelated = makeSource({ url: 'https://c.test/about', relation: 'editorial_fact_source', page_type: 'about', source_scope: 'facility', published_at: '2026-08-10' });
  const newerContext = makeSource({ url: 'https://d.test/exh', relation: 'context_confirmation', page_type: 'exhibition', source_scope: 'facility', published_at: '2026-08-12' });

  const onlyUnrelated = api.resolvePassProvenanceFromSources([older, newerUnrelated]);
  assert.equal(onlyUnrelated.primary.url, 'https://a.test/pdf');

  const withRelevant = api.resolvePassProvenanceFromSources([older, newerUnrelated, newerRelevant, newerContext]);
  assert.equal(withRelevant.primary.url, 'https://b.test/blog');
});

test('an official blog is not demoted for being a blog', () => {
  const pdf = makeSource({ url: 'https://a.test/pdf', authority: 'grutto_pass', relation: 'entitlement_evidence', page_type: 'official_pdf', source_scope: 'facility', published_at: '2026-03-01' });
  const blog = makeSource({ url: 'https://b.test/blog', authority: 'grutto_pass', relation: 'entitlement_evidence', page_type: 'pass_guidance', source_scope: 'facility', published_at: '2026-07-29' });
  assert.equal(api.pickBestSource([pdf, blog]).url, 'https://b.test/blog');
  assert.equal(api.pickBestSource([blog, pdf]).url, 'https://b.test/blog');
});

test('the Pass section shows at most ONE actionable link, plus provenance', () => {
  // No.100 has five registered sources (2 blogs, ticket page, 2 exhibition pages).
  const records = api.FACILITY_OFFICIAL_SOURCES['100'];
  assert.equal(records.length, 5);

  // Exactly one of them is an actionable next step.
  const ctas = api.resolveContextualCtas('pass', facilityByKey('100'));
  assert.equal(ctas.length, 1);
  assert.equal(ctas[0].kind, 'pass_confirmation');
  assert.equal(ctas[0].source.url, SOGO_TICKET);

  // The rest survive as provenance rather than disappearing.
  const provenance = api.resolvePassProvenance(facilityByKey('100'));
  assert.ok(provenance.supporting.length >= 3);
});

test('a generic museum page is never offered as Pass verification', () => {
  const evidence = makeSource({ url: 'https://a.test/pdf', relation: 'entitlement_evidence', page_type: 'official_pdf' });
  const confirmation = makeSource({ url: 'https://b.test/ticket', relation: 'pass_confirmation', page_type: 'admission' });
  const context = makeSource({ url: 'https://c.test/exh', relation: 'context_confirmation', page_type: 'exhibition' });

  const withConfirmation = api.resolveCtasFromSources('pass', [evidence, confirmation, context]);
  assert.equal(withConfirmation.map(c => c.kind).join(','), 'pass_confirmation');

  // Without a real Pass page there is NO fallback: an exhibition listing cannot
  // answer "is this a Grutto-eligible exhibition?", so it must not claim to.
  assert.equal(api.resolveCtasFromSources('pass', [evidence, context]).length, 0);
  // Pass facts stay visible regardless; provenance still exposes the evidence.
  assert.equal(api.resolvePassProvenanceFromSources([evidence, context]).primary.url, 'https://a.test/pdf');
});

test('a facility page without a Grutto mention is never independent Pass proof', () => {
  // No.100's exhibition pages name no Pass at all, so they stay context-only.
  const records = api.FACILITY_OFFICIAL_SOURCES['100'];
  const exhibition = records.find(r => r.url.includes('details.jsp'));
  assert.equal(exhibition.relation, 'context_confirmation');
  assert.equal(exhibition.confirms_pass_entitlement, false);
  // The ticket page DOES name it, so it is facility-side confirmation.
  const ticket = records.find(r => r.url === SOGO_TICKET);
  assert.equal(ticket.relation, 'pass_confirmation');
  assert.equal(ticket.applicable_year, 2026);
});

test('exhibition section prefers a specific exhibition page over a listing', () => {
  const ctas = api.resolveContextualCtas('exhibition', facilityByKey('100'));
  assert.equal(ctas.length, 1);
  assert.equal(ctas[0].kind, 'exhibition_page');
  assert.ok(ctas[0].source.url.includes('details.jsp'));

  // Listing-only falls back to the listing label.
  const listingOnly = api.resolveCtasFromSources('exhibition', [
    makeSource({ url: 'https://x.test/list', relation: 'context_confirmation', page_type: 'exhibition_listing' })
  ]);
  assert.equal(listingOnly.map(c => c.kind).join(','), 'exhibition_listing');
});

test('the Detail Header globe still owns the homepage for a corrected facility', () => {
  const homepage = api.getFacilityHomepageSource(facilityByKey('100'));
  assert.ok(homepage);
  assert.equal(homepage.relation, 'homepage');
  // and no contextual section ever emits it
  for (const section of ['pass', 'hours', 'exhibition']) {
    const urls = api.resolveContextualCtas(section, facilityByKey('100')).map(c => c.source.url);
    assert.ok(!urls.includes(homepage.url), `${section} must not emit the homepage`);
  }
});

/* ---- v98 provenance integrity ---- */

const provRecord = overrides => ({
  url: 'https://a.test/doc.pdf',
  title: 'Doc A',
  relation: 'entitlement_evidence',
  page_type: 'official_pdf',
  checked_at: '2026-08-16',
  ...overrides
});

test('every rendered primary field comes from ONE source record', () => {
  const primary = provRecord({
    url: 'https://a.test/blog/', title: 'Blog A', page_type: 'pass_guidance',
    published_at: '2026-07-29', checked_at: '2026-08-16', source_scope: 'facility'
  });
  const other = provRecord({ url: 'https://b.test/brochure.pdf', title: 'Brochure B', published_at: '2026-03-01' });

  const model = api.resolvePassProvenanceFromSources([other, primary]);
  const record = model.primary;
  // Title, dates and href all describe the same document.
  assert.equal(record.title, 'Blog A');
  assert.equal(record.url, 'https://a.test/blog/');
  assert.equal(record.open_url, 'https://a.test/blog/');
  assert.equal(record.published_at, '2026-07-29');
  assert.equal(record.checked_at, '2026-08-16');
  // …and the other document is not silently substituted anywhere.
  assert.notEqual(record.open_url, 'https://b.test/brochure.pdf');
  assert.equal(model.supporting.length, 1);
  assert.equal(model.supporting[0].title, 'Brochure B');
});

test('a claim source sets the primary without re-running authority arbitration', () => {
  const brochure = provRecord({ url: 'https://b.test/brochure.pdf', title: 'Brochure' });
  const claim = { url: 'https://a.test/update/', title: 'Later update', role: 'later_grutto_update', published_at: '2026-07-29' };
  const model = api.resolvePassProvenanceFromSources([brochure], [claim]);
  assert.equal(model.primary.title, 'Later update');
  assert.equal(model.primary.open_url, 'https://a.test/update/');
  assert.equal(model.primary.role_key, 'latestEligibility');
  // The brochure stays as supporting provenance rather than being dropped.
  assert.equal(model.supporting.length, 1);
  assert.equal(model.supporting[0].title, 'Brochure');
});

test('a primary with no openable URL yields no raw-source action', () => {
  const titleOnly = { title: 'Unpublished notice', relation: 'entitlement_evidence' };
  const brochure = provRecord({ url: 'https://b.test/brochure.pdf', title: 'Brochure' });
  // A record with no URL cannot become a document, so it never becomes primary
  // and — crucially — never borrows the brochure's URL as its link.
  const model = api.resolvePassProvenanceFromSources([brochure], [titleOnly]);
  assert.equal(model.primary.url, 'https://b.test/brochure.pdf');
  assert.equal(model.primary.title, 'Brochure');
  assert.equal(api.toProvenanceRecord(titleOnly, []), null);
});

test('supporting count is documents, not evidence edges', () => {
  const pdf = 'https://a.test/doc.pdf';
  const model = api.resolvePassProvenanceFromSources(
    [
      provRecord({ url: 'https://primary.test/x/', title: 'Primary', source_scope: 'facility', published_at: '2026-07-29', page_type: 'pass_guidance' }),
      // The same document cited three ways: bare, with a fragment, and again as a
      // different relation. That is one source, not three.
      provRecord({ url: pdf, title: 'Doc' }),
      provRecord({ url: `${pdf}#page=12`, title: 'Doc' }),
      provRecord({ url: pdf, title: 'Doc', relation: 'pass_confirmation' })
    ]
  );
  assert.equal(model.primary.title, 'Primary');
  assert.equal(model.supporting.length, 1, 'one document, however many citations');
  assert.equal(model.supporting[0].id, api.provenanceDocumentId(pdf));
});

test('page references from several citations aggregate onto one document', () => {
  const pdf = 'https://a.test/doc.pdf';
  const model = api.resolvePassProvenanceFromSources(
    [provRecord({ url: 'https://primary.test/x/', title: 'Primary', page_type: 'pass_guidance', source_scope: 'facility', published_at: '2026-07-29' })],
    [
      { url: 'https://primary.test/x/', title: 'Primary' },
      { url: pdf, title: 'Doc', pages: [18] },
      { url: pdf, title: 'Doc', pages: [12] }
    ]
  );
  assert.equal(model.supporting.length, 1);
  assert.deepEqual([...model.supporting[0].pages], [12, 18]);
});

test('non-Pass official sources are excluded from Pass provenance', () => {
  const model = api.resolvePassProvenanceFromSources([
    provRecord({ url: 'https://a.test/brochure.pdf', title: 'Brochure' }),
    { url: 'https://a.test/hours/', title: 'Hours', relation: 'operational_source', page_type: 'opening_hours' },
    { url: 'https://a.test/about/', title: 'About', relation: 'editorial_fact_source', page_type: 'about' },
    { url: 'https://a.test/', title: 'Home', relation: 'homepage', page_type: 'homepage' },
    { url: 'https://a.test/exh/', title: 'Exhibition', relation: 'context_confirmation', page_type: 'exhibition' }
  ]);
  assert.equal(model.supporting.length, 0, 'hours / about / homepage / context are not Pass evidence');
  assert.equal(model.primary.title, 'Brochure');
});

test('a single-source facility reports no supporting documents', () => {
  const model = api.resolvePassProvenanceFromSources([provRecord({ title: 'Only' })]);
  assert.equal(model.supporting.length, 0);
});

test('PDF deep links are best-effort and never fabricated', () => {
  const pdf = { url: 'https://a.test/doc.pdf', page_type: 'official_pdf' };
  assert.equal(api.getSourceOpenUrl({ ...pdf, pages: [12] }), 'https://a.test/doc.pdf#page=12');
  // Existing query strings survive; an existing fragment is replaced, not appended.
  assert.equal(api.getSourceOpenUrl({ url: 'https://a.test/d.pdf?v=1', page_type: 'official_pdf', pages: [3] }), 'https://a.test/d.pdf?v=1#page=3');
  assert.equal(api.getSourceOpenUrl({ url: 'https://a.test/d.pdf#page=9', page_type: 'official_pdf', pages: [3] }), 'https://a.test/d.pdf#page=3');
  // Unknown or invalid pages are never guessed into existence.
  assert.equal(api.getSourceOpenUrl(pdf), 'https://a.test/doc.pdf');
  assert.equal(api.getSourceOpenUrl({ ...pdf, pages: [0] }), 'https://a.test/doc.pdf');
  assert.equal(api.getSourceOpenUrl({ ...pdf, pages: [-2] }), 'https://a.test/doc.pdf');
  // A non-PDF never gets a page fragment even if a page is recorded.
  assert.equal(api.getSourceOpenUrl({ url: 'https://a.test/page/', pages: [12] }), 'https://a.test/page/');
});

test('source roles resolve from declared data, never from a URL', () => {
  assert.equal(api.passSourceRoleKey({ claim_role: 'discountAmount' }), 'discountAmount');
  assert.equal(api.passSourceRoleKey({ role: 'exhibition_information_snapshot' }), 'eligibleExhibition');
  assert.equal(api.passSourceRoleKey({ role: 'later_grutto_update' }), 'latestEligibility');
  assert.equal(api.passSourceRoleKey({ relation: 'pass_confirmation' }), 'facilityConfirmation');
  assert.equal(api.passSourceRoleKey({ relation: 'entitlement_evidence' }), 'baseBenefit');
  assert.equal(api.passSourceRoleKey({ url: 'https://x.test/discount.pdf' }), '');
});

test('SOGO provenance names the later update and lists the rest', () => {
  const model = api.resolvePassProvenance(facilityByKey('100'));
  assert.equal(model.primary.title, '8～9月のおすすめ展覧会（入場）');
  assert.equal(model.primary.open_url, SOGO_BLOG_0729);
  const titles = model.supporting.map(record => record.title);
  assert.ok(titles.includes('「ぐるっとパス2026」パンフレット'));
  assert.ok(titles.includes('「ぐるっとパス2026」参加施設・対象の展覧会情報'));
  assert.ok(titles.includes('そごう美術館 チケットのご案内'));
  // Every listed source is nameable and openable — a count with nothing behind it
  // is what this release exists to remove.
  for (const record of model.supporting) {
    assert.ok(record.title, 'supporting source must have a title');
    assert.ok(record.open_url, 'supporting source must be openable');
  }
});

/* ---- v99 per-facility PDF page locators ---- */

const EXHIBITION_PDF = 'https://www.rekibun.or.jp/grutto/wp-content/uploads/sites/3/2026/03/exhibition_2026_01.pdf';

test('page locators are joined from both declared homes, never duplicated', () => {
  // No.26 科学技術館: brochure p.9 (data/facility-brochure.js) and exhibition
  // PDF p.4 (FACILITY_SOURCE_PAGES). Neither table copies the other.
  const pages = api.getFacilitySourcePages(facilityByKey('26'));
  assert.equal(pages[api.provenanceDocumentId(BROCHURE_URL)], 9);
  assert.equal(pages[api.provenanceDocumentId(EXHIBITION_PDF)], 4);
  // The brochure is deliberately absent from the locator table.
  assert.equal(api.FACILITY_SOURCE_PAGES.brochure_2026_01, undefined);
  assert.equal(api.FACILITY_BROCHURE.cards['26'].sourcePage, 9);
});

test('a recorded page reaches the source whether it is primary or supporting', () => {
  const model = api.resolvePassProvenance(facilityByKey('26'));
  // Primary is the brochure, so its own page and deep link show.
  assert.equal(model.primary.url, BROCHURE_URL);
  assert.deepEqual([...model.primary.pages], [9]);
  assert.equal(model.primary.open_url, `${BROCHURE_URL}#page=9`);
  // …and the supporting exhibition PDF is cited at ITS page, not the primary's.
  const exhibition = model.supporting.find(record => record.url === EXHIBITION_PDF);
  assert.deepEqual([...exhibition.pages], [4]);
  assert.equal(exhibition.open_url, `${EXHIBITION_PDF}#page=4`);
});

test('every facility cites the exhibition PDF at its own page', () => {
  const table = api.FACILITY_SOURCE_PAGES.exhibition_2026_01;
  const count = api.SOURCE_PAGE_DOCUMENTS.exhibition_2026_01.page_count;
  assert.equal(Object.keys(table).length, facilities.length, 'all 108 cards covered');
  for (const facility of facilities) {
    const page = table[facility._key];
    assert.ok(Number.isInteger(page) && page > 0, `${facility._key} needs a positive page`);
    assert.ok(page <= count, `${facility._key} page ${page} exceeds ${count}`);
  }
  // Locators spread across the document — a single value everywhere would mean
  // the extraction collapsed rather than found each facility.
  assert.ok(new Set(Object.values(table)).size > 10);
});

test('a PDF primary always carries a page for every facility', () => {
  // This is the regression the release exists for: No.26 shipped a whole-document
  // brochure link because nothing joined the page data that already existed.
  for (const facility of facilities) {
    const model = api.resolvePassProvenance(facility);
    if (!model?.primary?.is_pdf) continue;
    assert.ok(model.primary.pages.length, `${facility._key} PDF primary has no page`);
    assert.match(model.primary.open_url, /#page=\d+$/);
  }
});

test('locator pages stay inside the recorded revision of each document', () => {
  for (const [name, table] of Object.entries(api.FACILITY_SOURCE_PAGES)) {
    const count = api.SOURCE_PAGE_DOCUMENTS[name].page_count;
    for (const [key, page] of Object.entries(table)) {
      assert.ok(page <= count, `${name}[${key}] = ${page} > ${count}`);
    }
  }
  for (const [key, card] of Object.entries(api.FACILITY_BROCHURE.cards)) {
    if (card.sourcePage == null) continue;
    assert.ok(card.sourcePage <= api.SOURCE_PAGE_DOCUMENTS.brochure_2026_01.page_count, key);
  }
});

test('a facility with no recorded page gets no fragment', () => {
  const pages = api.getFacilitySourcePages({ _key: 'no-such-facility' });
  assert.equal(Object.keys(pages).length, 0);
  const model = api.resolvePassProvenanceFromSources(
    [provRecord({ url: 'https://a.test/doc.pdf', title: 'Doc' })],
    null,
    {}
  );
  assert.deepEqual([...model.primary.pages], []);
  assert.equal(model.primary.open_url, 'https://a.test/doc.pdf');
});

test('the globe accessible name interpolates the facility name', () => {
  const window = loadUi();
  window.setAppLanguage('ja');
  assert.equal(window.t('facility.openHomepage', { name: '東京都写真美術館' }), '東京都写真美術館の公式サイトを開く');
  window.setAppLanguage('en');
  assert.equal(window.t('facility.openHomepage', { name: 'Tokyo Photographic Art Museum' }), 'Open Tokyo Photographic Art Museum official website');
});
