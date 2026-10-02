/*
 * Official Source Registry — the single shared source of truth for "why this
 * URL exists" on a facility card.
 *
 * A URL's meaning is decided here, during data preparation — never by the
 * renderer guessing from a pathname, domain, or file extension. The runtime
 * only consumes already-classified source records.
 *
 * Roles the Detail UI distinguishes (see docs/design/official-source-cta-ownership.md):
 *
 *   A. homepage                  — "I want the facility's official site." Global
 *                                  utility destination. Owned by the Detail
 *                                  Header globe, never a contextual section CTA.
 *   B. entitlement_evidence      — why the Pass benefit is believed to exist
 *                                  (Grutto Pass official PDF / page).
 *   C. pass_confirmation         — the facility's OWN page that explicitly names
 *                                  the Grutto Pass (ぐるっとパス / Grutto Pass)
 *                                  for the current year / facility / benefit.
 *   D. context_confirmation      — a page that does NOT prove the Pass benefit
 *                                  but helps verify the current exhibition /
 *                                  opening hours / admission
 *                                  (confirms_pass_entitlement = false).
 *   E. editorial_fact_source     — About / Collection / Architecture / Permanent
 *                                  exhibition provenance for the Facility
 *                                  Introduction. Public provenance, not a UI CTA.
 *
 * PRESENTATION POLICY (v97) — evidence is not automatically a CTA.
 *
 * Having a classified source says we can justify a fact. It does NOT say the
 * user needs a link. A record becomes a visible, actionable CTA only when ALL
 * of these hold, and official-source-runtime.js is the only place that decision is made:
 *
 *   1. relevance     — it is about the exact content the section shows;
 *   2. information gain — opening it tells the user something the product facts
 *                      have not already told them;
 *   3. next task     — it supports a concrete next step (verify, reserve, redeem);
 *   4. non-duplication — no other visible destination already goes there;
 *   5. truthful label — the label describes what the destination can actually do.
 *
 * Everything else stays *provenance*: still recorded, still inspectable through
 * the Pass provenance disclosure, but not a permanent navigation row. In
 * particular `entitlement_evidence` (the Grutto brochure / exhibition PDF / a
 * later official update) is provenance, because the product has already read it
 * and stated its conclusion — the user should not have to open a multi-page PDF
 * to understand a fact we are already showing them.
 *
 * Optional arbitration metadata (added by the v96 Pass Source Arbitration pass):
 *
 *   source_scope   'edition'  — applies to the whole Pass edition (a global record).
 *                  'facility' — assigned to THIS facility after reading the page.
 *   published_at   the source's own publication / update date (YYYY-MM-DD).
 *   supersedes     URLs whose claim this record replaces for this facility.
 *
 * These exist so a contextual CTA can pick the source most useful for the claim
 * at hand instead of always emitting the oldest registered record. They are
 * arbitration inputs, NOT a global authority ranking: recency only matters
 * between records that already carry the same `relation` for the same facility.
 *
 * This file is deliberately sparse. Nothing here is inferred from a URL.
 */

/* ---- semantic vocabularies (frozen; new values are a deliberate schema change) ---- */
const OFFICIAL_SOURCE_AUTHORITIES = Object.freeze([
  'facility',
  'grutto_pass',
  'operator',
  'municipality'
]);

const OFFICIAL_SOURCE_PAGE_TYPES = Object.freeze([
  'homepage',
  'official_pdf',
  'pass_guidance',
  'exhibition',
  'exhibition_listing',
  'opening_hours',
  'visit',
  'access',
  'admission',
  'about',
  'collection',
  'architecture'
]);

const OFFICIAL_SOURCE_RELATIONS = Object.freeze([
  'homepage',
  'entitlement_evidence',
  'pass_confirmation',
  'context_confirmation',
  'operational_source',
  'editorial_fact_source'
]);

const OFFICIAL_SOURCE_CONFIDENCE = Object.freeze([
  'verified',
  'reviewed',
  'unclassified'
]);

/*
 * Global sources that apply to every facility. The Grutto Pass official brochure
 * is the entitlement evidence for the whole edition; a facility does not need its
 * own copy of this record.
 */
const FACILITY_OFFICIAL_GLOBAL_SOURCES = [
  {
    url: 'https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf',
    title: '「ぐるっとパス2026」パンフレット',
    claim_role: 'baseBenefit',
    authority: 'grutto_pass',
    page_type: 'official_pdf',
    relation: 'entitlement_evidence',
    confirms_pass_entitlement: true,
    applicable_year: 2026,
    checked_at: '2026-08-14',
    confidence: 'verified',
    source_scope: 'edition',
    published_at: '2026-03-01'
  },
  // Time-scoped entitlement evidence: the eligible-exhibition snapshot that
  // decides whether an exhibition-scoped benefit is usable on a given date.
  // "4月～9月まで…(2026年2月現在)" — see docs/design/official-source-cta-ownership.md.
  {
    url: 'https://www.rekibun.or.jp/grutto/wp-content/uploads/sites/3/2026/03/exhibition_2026_01.pdf',
    title: '「ぐるっとパス2026」参加施設・対象の展覧会情報',
    claim_role: 'eligibleExhibition',
    authority: 'grutto_pass',
    page_type: 'official_pdf',
    relation: 'entitlement_evidence',
    confirms_pass_entitlement: true,
    applicable_year: 2026,
    checked_at: '2026-08-15',
    confidence: 'verified',
    snapshot_as_of: '2026-02',
    coverage_label: '2026-04..2026-09',
    // NB: no document-level `pdf_page`. A per-facility locator lives in
    // data/facility-pass-time-scope.js `source_pages`, because "page 1" is where
    // the table starts, not where any given facility's entry is.
    source_scope: 'edition',
    published_at: '2026-03-01'
  },
  // Time-scoped entitlement evidence: the August 2026 revision covers the
  // September 2026–March 2027 Pass window. Keep the earlier PDF above for
  // provenance history and old-page compatibility.
  {
    url: 'https://www.rekibun.or.jp/pdf/grutto/exhibition_2026_01.pdf',
    title: '「ぐるっとパス2026」参加施設・対象の展覧会情報',
    claim_role: 'eligibleExhibition',
    authority: 'grutto_pass',
    page_type: 'official_pdf',
    relation: 'entitlement_evidence',
    confirms_pass_entitlement: true,
    applicable_year: 2026,
    checked_at: '2026-09-19',
    confidence: 'verified',
    snapshot_as_of: '2026-08',
    coverage_label: '2026-09..2027-03',
    source_scope: 'edition'
  }
];

/*
 * Facility-specific records, keyed by facility `_key`. Sparse on purpose: the
 * Classified records describe pass_confirmation / opening_hours / visit /
 * context_confirmation / editorial_fact_source records here. A record is only
 * added when a human has actually read the page and assigned its role.
 */
const FACILITY_OFFICIAL_SOURCES = {
  // Verified official hours pages (2026-08-15).
  // relation = operational_source + page_type = opening_hours makes the precise
  // "開館時間を公式サイトで確認" CTA eligible (never the generic homepage).
  '40': [
    {
      url: 'https://www.topmuseum.jp/guide/',
      authority: 'facility',
      page_type: 'opening_hours',
      relation: 'operational_source',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-15',
      confidence: 'verified'
    }
  ],
  '71': [
    {
      url: 'https://www.edo-tokyo-museum.or.jp/information/hours/',
      authority: 'facility',
      page_type: 'opening_hours',
      relation: 'operational_source',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-15',
      confidence: 'verified'
    }
  ],
  '34': [
    {
      url: 'https://www.musee-tomo.or.jp/exhibition/schedule.html',
      title: '智美術館 今後のスケジュール',
      authority: 'facility',
      page_type: 'exhibition',
      relation: 'context_confirmation',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-09-19',
      confidence: 'verified',
      source_scope: 'facility'
    }
  ],
  '80': [
    {
      url: 'https://www.miraikan.jst.go.jp/visit/admission/',
      title: '日本科学未来館 開館時間・入館料',
      authority: 'facility',
      page_type: 'opening_hours',
      relation: 'operational_source',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-09-19',
      confidence: 'verified',
      source_scope: 'facility'
    },
    {
      url: 'https://www.miraikan.jst.go.jp/exhibitions/spexhibition/dainankyokuten.html',
      title: '特別展「大南極展」公式案内',
      authority: 'facility',
      page_type: 'exhibition',
      relation: 'context_confirmation',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-09-19',
      confidence: 'verified',
      source_scope: 'facility'
    }
  ],

  // Facility Introduction V2 — editorial fact sources for the ENRICH/REPLACE
  // records (2026-08-15). relation = editorial_fact_source is internal provenance
  // for the Facility Introduction only; it never becomes a UI CTA.
  '2': [
    {
      url: 'https://www.ueno-mori.org/about/',
      authority: 'facility',
      page_type: 'about',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-15',
      confidence: 'verified'
    }
  ],
  '33': [
    {
      url: 'https://www.shukokan.org/outline/',
      authority: 'facility',
      page_type: 'about',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-15',
      confidence: 'verified'
    },
    // Pass Source Arbitration (2026-08-16): the later Grutto update ends
    // 祈りと救いの美 on 9/27, not the snapshot's provisional 10/12.
    {
      url: 'https://www.rekibun.or.jp/grutto/blog/20260729-6866/',
      title: '8～9月のおすすめ展覧会（入場）',
      claim_role: 'latestEligibility',
      authority: 'grutto_pass',
      page_type: 'pass_guidance',
      relation: 'entitlement_evidence',
      confirms_pass_entitlement: true,
      applicable_year: 2026,
      checked_at: '2026-08-16',
      confidence: 'verified',
      source_scope: 'facility',
      published_at: '2026-07-29',
      supersedes: ['https://www.rekibun.or.jp/grutto/wp-content/uploads/sites/3/2026/03/exhibition_2026_01.pdf']
    },
    {
      url: 'https://www.shukokan.org/exhibition/',
      authority: 'facility',
      page_type: 'exhibition',
      relation: 'context_confirmation',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-16',
      confidence: 'verified',
      source_scope: 'facility'
    }
  ],
  '37': [
    {
      url: 'https://shoto-museum.jp/aboutthemuseum/outline/',
      authority: 'facility',
      page_type: 'about',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-15',
      confidence: 'verified'
    }
  ],
  '48': [
    {
      url: 'https://www.gotoh-museum.or.jp/collection/',
      authority: 'facility',
      page_type: 'collection',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-15',
      confidence: 'verified'
    }
  ],
  '50': [
    {
      url: 'https://www.setabun.or.jp/about/',
      authority: 'facility',
      page_type: 'about',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-15',
      confidence: 'verified'
    }
  ],
  '83': [
    {
      url: 'https://mitaka-sportsandculture.or.jp/gallery/dazaihouse/',
      authority: 'facility',
      page_type: 'about',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-15',
      confidence: 'verified'
    }
  ],
  '96': [
    {
      url: 'https://www.yumebi.com/perm.html',
      authority: 'facility',
      page_type: 'collection',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-15',
      confidence: 'verified'
    }
  ],

  // Facility Introduction Independence Remediation — Batch 1 (2026-08-17).
  // These are editorial fact sources only; they must never become contextual
  // CTAs or operational claims.
  '8': [
    {
      id: 'facility-8-about',
      url: 'https://www.tokyo-zoo.net/ueno/about/index.html',
      authority: 'operator',
      page_type: 'about',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    }
  ],
  '9': [
    {
      id: 'facility-9-collection',
      url: 'https://museum.geidai.ac.jp/collection/',
      authority: 'facility',
      page_type: 'collection',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    }
  ],
  '18': [
    {
      id: 'facility-18-overview',
      url: 'https://www.mitsui-museum.jp/overview/overview.html',
      authority: 'facility',
      page_type: 'about',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    }
  ],
  '21': [
    {
      id: 'facility-21-park',
      url: 'https://www.tokyo-park.or.jp/park/koishikawakorakuen/index.html',
      authority: 'operator',
      page_type: 'architecture',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    }
  ],
  '27': [
    {
      id: 'facility-27-profile',
      url: 'https://www.momat.go.jp/wp-content/uploads/2024/06/R6_toukinbi-gaiyou.pdf',
      authority: 'facility',
      page_type: 'official_pdf',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified',
      pdf_page: 3
    }
  ],
  '28': [
    {
      id: 'facility-28-about',
      url: 'https://panasonic.co.jp/ew/museum/about/',
      authority: 'facility',
      page_type: 'about',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    },
    {
      id: 'facility-28-collection',
      url: 'https://panasonic.co.jp/ew/museum/collection/',
      authority: 'facility',
      page_type: 'collection',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    }
  ],
  '30': [
    {
      id: 'facility-30-park',
      url: 'https://www.tokyo-park.or.jp/park/hama-rikyu/index.html',
      authority: 'operator',
      page_type: 'architecture',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    }
  ],
  '31': [
    {
      id: 'facility-31-park',
      url: 'https://www.tokyo-park.or.jp/park/kyu-shiba-rikyu/index.html',
      authority: 'operator',
      page_type: 'architecture',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    }
  ],
  '38': [
    {
      id: 'facility-38-about',
      url: 'https://toguri-museum.or.jp/about/',
      authority: 'facility',
      page_type: 'about',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    }
  ],
  '42': [
    {
      id: 'facility-42-building',
      url: 'https://www.minato-rekishi.com/building/index.html',
      authority: 'facility',
      page_type: 'architecture',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    }
  ],
  '57': [
    {
      id: 'facility-57-collection',
      url: 'https://www.operacity.jp/ag/about/index_02.php',
      authority: 'facility',
      page_type: 'collection',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    },
    {
      id: 'facility-57-architecture',
      url: 'https://www.operacity.jp/ag/about/index_03.php',
      authority: 'facility',
      page_type: 'architecture',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    }
  ],
  '63': [
    {
      id: 'facility-63-about',
      url: 'https://aom-tokyo.com/about/index.html',
      authority: 'facility',
      page_type: 'about',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    },
    {
      id: 'facility-63-permanent',
      url: 'https://aom-tokyo.sakura.ne.jp/permanent/index.html',
      authority: 'facility',
      page_type: 'exhibition',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    }
  ],
  '77': [
    {
      id: 'facility-77-message',
      url: 'https://www.chikahaku.jp/about/message.html',
      authority: 'facility',
      page_type: 'about',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    },
    {
      id: 'facility-77-facilities',
      url: 'https://www.chikahaku.jp/facilities/',
      authority: 'facility',
      page_type: 'visit',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    }
  ],
  '91': [
    {
      id: 'facility-91-overview',
      url: 'https://www.tatemonoen.jp/about/overview.php',
      authority: 'facility',
      page_type: 'architecture',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    }
  ],

  // Facility Introduction Independence Remediation — Batch 2 (2026-08-17).
  // Editorial fact sources only; these records must not become contextual
  // CTAs or operational claims.
  '11': [
    {
      id: 'facility-11-asakura-overview',
      url: 'https://www.taitogeibun.net/asakura/overview/',
      authority: 'facility',
      page_type: 'about',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    },
    {
      id: 'facility-11-asakura-building',
      url: 'https://www.taitogeibun.net/asakura/overview/tatemono/',
      authority: 'facility',
      page_type: 'architecture',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    },
    {
      id: 'facility-11-asakura-garden',
      url: 'https://www.taitogeibun.net/asakura/overview/garden/',
      authority: 'facility',
      page_type: 'architecture',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    }
  ],
  '12': [
    {
      id: 'facility-12-shodou-collection',
      url: 'https://www.taitogeibun.net/shodou/kannai/collection/',
      authority: 'facility',
      page_type: 'collection',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    }
  ],
  '16': [
    {
      id: 'facility-16-park',
      url: 'https://www.tokyo-park.or.jp/park/mukojima-hyakkaen/index.html',
      authority: 'operator',
      page_type: 'architecture',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    }
  ],
  '19': [
    {
      id: 'facility-19-nfaj-about',
      url: 'https://www.nfaj.go.jp/about-nfaj/',
      authority: 'facility',
      page_type: 'about',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    },
    {
      id: 'facility-19-nfaj-facilities',
      url: 'https://www.nfaj.go.jp/about-nfaj/shisetsu/',
      authority: 'facility',
      page_type: 'visit',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    }
  ],
  '22': [
    {
      id: 'facility-22-baseball-about',
      url: 'https://baseball-museum.or.jp/about-the-museum/',
      authority: 'facility',
      page_type: 'about',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    },
    {
      url: 'https://baseball-museum.or.jp/exhibitions/2026dendouten/',
      title: '2026年野球殿堂入り特別展',
      authority: 'facility',
      page_type: 'exhibition',
      relation: 'context_confirmation',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-09-19',
      confidence: 'verified',
      source_scope: 'facility'
    }
  ],
  '23': [
    {
      id: 'facility-23-printing-collection',
      url: 'https://www.printing-museum.org/collection/general/',
      authority: 'facility',
      page_type: 'collection',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    }
  ],
  '25': [
    {
      id: 'facility-25-showakan-7f',
      url: 'https://www.showakan.go.jp/information/floor/7f/',
      authority: 'facility',
      page_type: 'exhibition',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    },
    {
      id: 'facility-25-showakan-1f',
      url: 'https://www.showakan.go.jp/information/floor/1f/',
      authority: 'facility',
      page_type: 'exhibition',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    }
  ],
  '41': [
    {
      id: 'facility-41-matsuoka-about',
      url: 'https://www.matsuoka-museum.jp/about/',
      authority: 'facility',
      page_type: 'about',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    },
    {
      id: 'facility-41-matsuoka-collection',
      url: 'https://www.matsuoka-museum.jp/collection/',
      authority: 'facility',
      page_type: 'collection',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    },
    {
      id: 'facility-41-matsuoka-permanent',
      url: 'https://www.matsuoka-museum.jp/permanent_exhibition/',
      authority: 'facility',
      page_type: 'exhibition',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    }
  ],
  '43': [
    {
      id: 'facility-43-shizen-about',
      url: 'https://ins.kahaku.go.jp/about/',
      authority: 'facility',
      page_type: 'about',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    },
    {
      id: 'facility-43-shizen-research',
      url: 'https://www.kahaku.go.jp/kenkyu/shisetsu/huzoku.html',
      authority: 'operator',
      page_type: 'architecture',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    }
  ],
  '49': [
    {
      id: 'facility-49-hasegawa-art',
      url: 'https://www.hasegawamachiko.jp/art-museum/',
      authority: 'facility',
      page_type: 'collection',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    },
    {
      id: 'facility-49-hasegawa-memorial',
      url: 'https://www.hasegawamachiko.jp/memorial-museum/',
      authority: 'facility',
      page_type: 'exhibition',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    }
  ],
  '54': [
    {
      id: 'facility-54-bunka-database',
      url: 'https://museum.bunka.ac.jp/database/',
      authority: 'facility',
      page_type: 'collection',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    },
    {
      id: 'facility-54-bunka-policy',
      url: 'https://museum.bunka.ac.jp/welcome/activity_policy/',
      authority: 'facility',
      page_type: 'about',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    }
  ],
  '62': [
    {
      id: 'facility-62-eisei-collection',
      url: 'https://eiseibunko.com/collection.html',
      authority: 'facility',
      page_type: 'collection',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    },
    {
      id: 'facility-62-eisei-exhibition',
      url: 'https://eiseibunko.com/exhibition.html',
      authority: 'facility',
      page_type: 'exhibition',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    }
  ],
  '64': [
    {
      id: 'facility-64-paper-about',
      url: 'https://papermuseum.jp/ja/about/',
      authority: 'facility',
      page_type: 'about',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    },
    {
      id: 'facility-64-paper-permanent',
      url: 'https://papermuseum.jp/ja/exhibit/',
      authority: 'facility',
      page_type: 'exhibition',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    }
  ],
  '67': [
    {
      id: 'facility-67-park',
      url: 'https://www.tokyo-park.or.jp/park/rikugien/index.html',
      authority: 'operator',
      page_type: 'architecture',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      checked_at: '2026-08-17',
      confidence: 'verified'
    }
  ],

  /* ------------------------------------------------------------------------
   * Pass Source Arbitration (2026-08-16). Records added only where a later
   * official Grutto update actually changed what is known about the facility's
   * eligible exhibitions, plus the facility-side pages read while verifying it.
   * Facilities whose windows the February snapshot still describes correctly
   * keep the global PDF as their entitlement evidence and get no record here.
   * ---------------------------------------------------------------------- */

  // No.100 そごう美術館 — the canonical correction. The 2026-07-29 Grutto update
  // states outright 「一般料金：1,400円がパスだけで入場できます」 for the August and
  // September exhibitions the February snapshot could not yet list.
  '100': [
    {
      url: 'https://www.rekibun.or.jp/grutto/blog/20260729-6866/',
      title: '8～9月のおすすめ展覧会（入場）',
      claim_role: 'latestEligibility',
      authority: 'grutto_pass',
      page_type: 'pass_guidance',
      relation: 'entitlement_evidence',
      confirms_pass_entitlement: true,
      applicable_year: 2026,
      checked_at: '2026-08-16',
      confidence: 'verified',
      source_scope: 'facility',
      published_at: '2026-07-29'
    },
    {
      url: 'https://www.rekibun.or.jp/grutto/blog/20260626-6804/',
      title: '7～8月のおすすめ展覧会（入場）',
      claim_role: 'latestEligibility',
      authority: 'grutto_pass',
      page_type: 'pass_guidance',
      relation: 'entitlement_evidence',
      confirms_pass_entitlement: true,
      applicable_year: 2026,
      checked_at: '2026-08-16',
      confidence: 'verified',
      source_scope: 'facility',
      published_at: '2026-06-26'
    },
    // Facility-side confirmation: 「東京・ミュージアム ぐるっとパス2026」もご利用可能です。
    // Confirms the Pass is accepted here; it does not scope individual exhibitions.
    {
      url: 'https://sogo-museum.jp/about/ticket.jsp',
      title: 'そごう美術館 チケットのご案内',
      claim_role: 'facilityConfirmation',
      authority: 'facility',
      page_type: 'admission',
      relation: 'pass_confirmation',
      confirms_pass_entitlement: true,
      applicable_year: 2026,
      checked_at: '2026-08-16',
      confidence: 'verified',
      source_scope: 'facility'
    },
    // The exhibition pages name no Pass at all, so they confirm title/dates only.
    {
      url: 'https://sogo-museum.jp/exhibitions/details.jsp?id=2071',
      authority: 'facility',
      page_type: 'exhibition',
      relation: 'context_confirmation',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-16',
      confidence: 'verified',
      source_scope: 'facility'
    },
    {
      url: 'https://sogo-museum.jp/exhibitions/current.jsp',
      authority: 'facility',
      page_type: 'exhibition_listing',
      relation: 'context_confirmation',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-16',
      confidence: 'verified',
      source_scope: 'facility'
    }
  ],

  // No.58 ICC — the snapshot deferred the schedule to the venue, so the runtime had
  // no confirmed window at all. The later update names one.
  '58-NTT-ICC': [
    {
      url: 'https://www.rekibun.or.jp/grutto/blog/20260729-6866/',
      title: '8～9月のおすすめ展覧会（入場）',
      claim_role: 'latestEligibility',
      authority: 'grutto_pass',
      page_type: 'pass_guidance',
      relation: 'entitlement_evidence',
      confirms_pass_entitlement: true,
      applicable_year: 2026,
      checked_at: '2026-08-16',
      confidence: 'verified',
      source_scope: 'facility',
      published_at: '2026-07-29'
    },
    {
      url: 'https://www.ntticc.or.jp/ja/exhibitions/2026/icc-annual-2026/',
      authority: 'facility',
      page_type: 'exhibition',
      relation: 'context_confirmation',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-16',
      confidence: 'verified',
      source_scope: 'facility'
    },
    {
      url: 'https://www.ntticc.or.jp/ja/about/visit/floor/',
      title: 'フロア案内',
      authority: 'facility',
      page_type: 'architecture',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-17',
      confidence: 'verified',
      source_scope: 'facility'
    },
    {
      url: 'https://www.ntticc.or.jp/ja/About/introduction.html',
      title: 'ICCについて',
      authority: 'facility',
      page_type: 'about',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-17',
      confidence: 'verified',
      source_scope: 'facility'
    }
  ],

  '29': [
    {
      url: 'https://www.ochamuseum.jp/culture/area/',
      title: 'エリア紹介',
      authority: 'operator',
      page_type: 'collection',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-17',
      confidence: 'verified',
      source_scope: 'facility'
    }
  ],
  '69': [
    {
      url: 'https://www.tabashio.jp',
      title: 'たばこと塩の博物館 公式サイト',
      authority: 'facility',
      page_type: 'homepage',
      relation: 'homepage',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-17',
      confidence: 'verified',
      source_scope: 'facility'
    },
    {
      url: 'https://www.tabashio.jp/sp/map/index.html',
      title: '館内案内',
      authority: 'facility',
      page_type: 'collection',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-17',
      confidence: 'verified',
      source_scope: 'facility'
    }
  ],
  '70': [
    {
      url: 'https://hokusai-museum.jp/modules/Page/pages/view/1067',
      title: '北斎を学ぶ部屋',
      authority: 'facility',
      page_type: 'collection',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-17',
      confidence: 'verified',
      source_scope: 'facility'
    }
  ],
  '73': [
    {
      url: 'https://www.tokyo-park.or.jp/park/kiyosumi/index.html',
      title: '清澄庭園',
      authority: 'operator',
      page_type: 'architecture',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-17',
      confidence: 'verified',
      source_scope: 'facility'
    }
  ],
  '75': [
    {
      url: 'https://www.kcf.or.jp/fukagawa/josetsu/',
      title: '常設展示',
      authority: 'operator',
      page_type: 'collection',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-17',
      confidence: 'verified',
      source_scope: 'facility'
    }
  ],
  '79': [
    {
      url: 'https://www.yumenoshima.jp/botanicalhall/map',
      title: '温室マップ',
      authority: 'operator',
      page_type: 'architecture',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-17',
      confidence: 'verified',
      source_scope: 'facility'
    }
  ],
  '82': [
    {
      url: 'https://www.tokyo-zoo.net/inokashira/animals/index.html',
      title: '飼育動物',
      authority: 'operator',
      page_type: 'collection',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-17',
      confidence: 'verified',
      source_scope: 'facility'
    },
    {
      url: 'https://www.tokyo-zoo.net/inokashira/facilities/index.html',
      title: '施設案内',
      authority: 'operator',
      page_type: 'architecture',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-17',
      confidence: 'verified',
      source_scope: 'facility'
    }
  ],
  '87': [
    {
      url: 'https://www.tokyo-park.or.jp/park/jindai/',
      title: '神代植物公園 公式サイト',
      authority: 'facility',
      page_type: 'homepage',
      relation: 'homepage',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-17',
      confidence: 'verified',
      source_scope: 'facility'
    },
    {
      url: 'https://www.tokyo-park.or.jp/park/jindai/index.html',
      title: '神代植物公園',
      authority: 'operator',
      page_type: 'about',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-17',
      confidence: 'verified',
      source_scope: 'facility'
    },
    {
      url: 'https://www.tokyo-park.or.jp/special/jindai/summer.html',
      title: '大温室案内',
      authority: 'operator',
      page_type: 'architecture',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-17',
      confidence: 'verified',
      source_scope: 'facility'
    }
  ],
  '88': [
    {
      url: 'https://www.city.fuchu.tokyo.jp/shisetu/komyunite/gekijo/bijyutukan.html',
      title: '府中市美術館 施設案内',
      authority: 'municipality',
      page_type: 'about',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-17',
      confidence: 'verified',
      source_scope: 'facility'
    }
  ],
  '95': [
    {
      url: 'https://www.tokyo-zoo.net/tama/animals/index.html',
      title: '飼育動物',
      authority: 'operator',
      page_type: 'collection',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-17',
      confidence: 'verified',
      source_scope: 'facility'
    }
  ],
  '99': [
    {
      url: 'https://hanga-museum.jp/about/index',
      title: '美術館について',
      authority: 'facility',
      page_type: 'about',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-17',
      confidence: 'verified',
      source_scope: 'facility'
    }
  ],
  '104': [
    {
      url: 'https://www.kaikou.city.yokohama.jp/',
      title: '横浜開港資料館',
      authority: 'facility',
      page_type: 'about',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-17',
      confidence: 'verified',
      source_scope: 'facility'
    },
    {
      url: 'https://yokohama-archives.jp/about',
      title: 'デジタルアーカイブについて',
      authority: 'operator',
      page_type: 'about',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-17',
      confidence: 'verified',
      source_scope: 'facility'
    },
    {
      url: 'https://yokohama-archives.jp/available-documents',
      title: '所蔵資料',
      authority: 'operator',
      page_type: 'collection',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-17',
      confidence: 'verified',
      source_scope: 'facility'
    }
  ],
  '105': [
    {
      url: 'https://www.ccma-net.jp/about/greeting-history/',
      title: '沿革',
      authority: 'facility',
      page_type: 'about',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-17',
      confidence: 'verified',
      source_scope: 'facility'
    },
    {
      url: 'https://www.ccma-net.jp/facility/facilities-rental/',
      title: '館内施設',
      authority: 'facility',
      page_type: 'architecture',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-17',
      confidence: 'verified',
      source_scope: 'facility'
    },
    {
      url: 'https://www.ccma-net.jp/exhibitions/upcoming/',
      title: '千葉市美術館 開催予定',
      authority: 'facility',
      page_type: 'exhibition_listing',
      relation: 'context_confirmation',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-09-19',
      confidence: 'verified',
      source_scope: 'facility'
    }
  ],
  '107': [
    {
      url: 'https://saitama-rekimin.spec.ed.jp/tenjiannai/josetsuten',
      title: '常設展示',
      authority: 'facility',
      page_type: 'collection',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-17',
      confidence: 'verified',
      source_scope: 'facility'
    },
    {
      url: 'https://saitama-rekimin.spec.ed.jp/taiken-ibento/yumetaiken/',
      title: 'ゆめ・体験ひろば',
      authority: 'facility',
      page_type: 'about',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-17',
      confidence: 'verified',
      source_scope: 'facility'
    }
  ],

  // No.68 東洋文庫ミュージアム — the later update corrects the provisional start date
  // of 「怖い」本 (5/29 → 6/3); the museum's own schedule agrees.
  '68': [
    {
      url: 'https://www.rekibun.or.jp/grutto/blog/20260729-6866/',
      title: '8～9月のおすすめ展覧会（入場）',
      claim_role: 'latestEligibility',
      authority: 'grutto_pass',
      page_type: 'pass_guidance',
      relation: 'entitlement_evidence',
      confirms_pass_entitlement: true,
      applicable_year: 2026,
      checked_at: '2026-08-16',
      confidence: 'verified',
      source_scope: 'facility',
      published_at: '2026-07-29',
      supersedes: ['https://www.rekibun.or.jp/grutto/wp-content/uploads/sites/3/2026/03/exhibition_2026_01.pdf']
    },
    {
      url: 'https://www.toyo-bunko.or.jp/museum/exhibition/',
      authority: 'facility',
      page_type: 'exhibition_listing',
      relation: 'context_confirmation',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-16',
      confidence: 'verified',
      source_scope: 'facility'
    },
    {
      url: 'https://toyo-bunko.or.jp/museum/facility/',
      authority: 'facility',
      page_type: 'collection',
      relation: 'editorial_fact_source',
      confirms_pass_entitlement: false,
      applicable_year: 2026,
      checked_at: '2026-08-17',
      confidence: 'verified',
      source_scope: 'facility'
    }
  ],

  // Facility Introduction Independence Remediation — Batch 3 editorial provenance.
  '36': [{ url: 'https://tcv.roppongihills.com/jp/enjoy/intro/', authority: 'facility', page_type: 'about', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' }],
  '47': [{ url: 'https://acce-museum.main.jp/permanent/', authority: 'facility', page_type: 'collection', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' }],
  '53': [{ url: 'https://www.regasu-shinjuku.or.jp/rekihaku/exhibition-room/104/', authority: 'municipality', page_type: 'collection', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' }],
  '55': [
    { url: 'https://japan-olympicmuseum.jp/jp/', authority: 'facility', page_type: 'homepage', relation: 'homepage', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' },
    { url: 'https://www.joc.or.jp/olympism/experience/facility/', authority: 'operator', page_type: 'about', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' }
  ],
  '56': [{ url: 'https://www.koga.or.jp/information/', authority: 'facility', page_type: 'about', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' }],
  '59': [{ url: 'https://www.regasu-shinjuku.or.jp/regasu/wp-content/uploads/2014/11/202104_shisetuguide.pdf', authority: 'municipality', page_type: 'official_pdf', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' }],
  '61': [
    { url: 'https://kumagai-morikazu.jp/', authority: 'facility', page_type: 'homepage', relation: 'homepage', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-09-19', confidence: 'verified', source_scope: 'facility' },
    { url: 'https://www.city.toshima.lg.jp/129/bunka/bunka/jigyo/006112/index.html', authority: 'municipality', page_type: 'collection', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' }
  ],
  '65': [{ url: 'https://www.shibusawa.or.jp/museum/permanent/', authority: 'facility', page_type: 'collection', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' }],
  '66': [{ url: 'https://www.tokyo-park.or.jp/park/kyu-furukawa/index.html', authority: 'operator', page_type: 'architecture', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' }],
  '78': [{ url: 'https://www.tokyo-zoo.net/kasai/about/index.html', authority: 'operator', page_type: 'about', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' }],
  '89': [{ url: 'https://www.city.fuchu.tokyo.jp/shisetu/komyunite/gekijo/kyodo.html', authority: 'municipality', page_type: 'about', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' }],
  '90': [{ url: 'https://tamarokuto.or.jp/', authority: 'facility', page_type: 'about', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' }],
  '101': [
    { url: 'https://www.nippon-maru.or.jp/nipponmaru/', authority: 'facility', page_type: 'about', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' },
    { url: 'https://www.nippon-maru.or.jp/renewal/', authority: 'facility', page_type: 'collection', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' }
  ],

  // Facility Introduction Independence Remediation — Batch 5 editorial provenance.
  '17': [{ url: 'https://www.yamasa.com/musee/info/index.html', title: '浜口陽三ヤマサコレクション案内', authority: 'facility', page_type: 'about', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' }],
  '71': [{ url: 'https://www.edo-tokyo-museum.or.jp/p-exhibition/', title: '江戸東京博物館 常設展示', authority: 'facility', page_type: 'collection', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' }],
  '72': [
    { url: 'https://www.kcf.or.jp/basho/josetsu/', title: '芭蕉記念館 常設展示', authority: 'operator', page_type: 'collection', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' },
    { url: 'https://www.kcf.or.jp/basho/kikaku/detail/?id=159', title: '2026年度後期企画展「古池や」句 吟詠340年記念「蛙」が飛び込んだ地・深川-その歴史と文化-', authority: 'operator', page_type: 'exhibition', relation: 'context_confirmation', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-09-19', confidence: 'verified', source_scope: 'facility' }
  ],
  '76': [{ url: 'https://www.kcf.or.jp/nakagawa/josetsu/', title: '中川船番所資料館 常設展示', authority: 'operator', page_type: 'collection', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' }],
  '81': [{ url: 'https://www.musashino.or.jp/museum/1002040/index.html', title: '吉祥寺美術館 美術館概要', authority: 'facility', page_type: 'about', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' }],
  '84': [
    { url: 'https://mitaka-sportsandculture.or.jp/yuzo/info/', title: '山本有三記念館 施設案内', authority: 'facility', page_type: 'about', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' },
    { url: 'https://mitaka-sportsandculture.or.jp/yuzo/photo/', title: '山本有三記念館 建物案内', authority: 'facility', page_type: 'architecture', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' }
  ],
  '86': [
    { url: 'https://www.mushakoji.org/about/gaiyou.html', title: '武者小路実篤記念館 館概要', authority: 'facility', page_type: 'about', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' },
    { url: 'https://www.mushakoji.org/about/zaidan.html', title: '武者小路実篤記念館 運営情報', authority: 'operator', page_type: 'about', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' }
  ],
  '92': [{ url: 'https://www.city.kodaira.tokyo.jp/kurashi/061/061391.html', title: '小平市 平櫛田中彫刻美術館', authority: 'municipality', page_type: 'about', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' }],
  '93': [
    { url: 'https://www.tokyo-park.or.jp/park/tonogayato/index.html', title: '殿ヶ谷戸庭園 公式案内', authority: 'operator', page_type: 'about', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' },
    { url: 'https://www.tokyo-park.or.jp/park/tonogayato/facility/index.html', title: '殿ヶ谷戸庭園 施設案内', authority: 'operator', page_type: 'architecture', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' }
  ],
  '94': [
    { url: 'https://www.tamashinmuseum.org/', title: 'たましん美術館 公式サイト', authority: 'facility', page_type: 'homepage', relation: 'homepage', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' },
    { url: 'https://www.tamashinmuseum.org/post/megurucollection', title: 'たましんコレクション 公式案内', authority: 'facility', page_type: 'collection', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' }
  ],
  '97': [
    { url: 'https://www.fujibi.or.jp/exhibitions/8202510042/', title: '東京富士美術館 常設展示', authority: 'facility', page_type: 'collection', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' },
    { url: 'https://www.fujibi.or.jp/collection/overview/', title: '東京富士美術館 コレクション', authority: 'facility', page_type: 'collection', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' }
  ],
  '98': [{ url: 'https://ome-yoshikawaeiji.net/', title: '吉川英治記念館 公式サイト', authority: 'facility', page_type: 'homepage', relation: 'homepage', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' }],
  '102': [
    { url: 'https://ch.kanagawa-museum.jp/cultural-properties/building', title: '神奈川県立歴史博物館 建物案内', authority: 'facility', page_type: 'architecture', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' },
    { url: 'https://ch.kanagawa-museum.jp/permanent-exhibition', title: '神奈川県立歴史博物館 常設展示', authority: 'facility', page_type: 'collection', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' },
    { url: 'https://ch.kanagawa-museum.jp/news/11200', title: '2026年10月17日（土曜）に再開館を予定しています', authority: 'facility', page_type: 'visit', relation: 'operational_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-09-19', confidence: 'verified', source_scope: 'facility' },
    { url: 'https://ch.kanagawa-museum.jp/event/11193?instance_id=8204', title: '特別展「昭和100年 神奈川けんぱく60年のあゆみ」', authority: 'facility', page_type: 'exhibition', relation: 'context_confirmation', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-09-19', confidence: 'verified', source_scope: 'facility' }
  ],
  '32-WHAT-MUSEUM': [{ url: 'https://warehouseofart.org/facilities/', title: 'WHAT MUSEUM 運営者公式 施設案内', authority: 'operator', page_type: 'about', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' }],

  // Public Facility Introduction provenance. No.103 retains both official
  // venue destinations in the shared source registry.
  '6': [
    { url: 'https://www.taitogeibun.net/sougakudou/rekishi/', title: '奏楽堂 公式 沿革', authority: 'operator', page_type: 'about', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' },
    { url: 'https://www.taitogeibun.net/sougakudou/rekishi/collection/', title: '奏楽堂 公式 音楽資料', authority: 'operator', page_type: 'collection', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' }
  ],
  '13': [
    { url: 'https://www.taitogeibun.net/ichiyo/overview/', title: '一葉記念館 公式 概要', authority: 'operator', page_type: 'about', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' },
    { url: 'https://www.taitogeibun.net/ichiyo/kannai/collection/', title: '一葉記念館 公式 収蔵資料', authority: 'operator', page_type: 'collection', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' }
  ],
  '15': [
    { url: 'https://moriogai-kinenkan.jp/modules/contents/index.php?content_id=31', title: '森鷗外記念館 公式 常設展示', authority: 'facility', page_type: 'collection', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' },
    { url: 'https://moriogai-kinenkan.jp/modules/contents/index.php?content_id=2', title: '森鷗外記念館 公式 建物', authority: 'facility', page_type: 'architecture', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' }
  ],
  '24': [
    { url: 'https://www.jcii-cameramuseum.jp/museum/', title: '日本カメラ博物館 公式 博物館紹介', authority: 'facility', page_type: 'about', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' },
    { url: 'https://www.jcii-cameramuseum.jp/museum/permanent-exhibition/', title: '日本カメラ博物館 公式 常設展示', authority: 'facility', page_type: 'collection', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' }
  ],
  '44': [
    { url: 'https://www.teien-art-museum.ne.jp/en/museum/', title: '東京都庭園美術館 公式 建物・庭園', authority: 'facility', page_type: 'architecture', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' },
    { url: 'https://www.teien-art-museum.ne.jp/faq/', title: '東京都庭園美術館 公式 FAQ', authority: 'facility', page_type: 'visit', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' }
  ],
  '52': [
    { url: 'https://soseki-museum.jp/about-us/greetings/', title: '新宿区立漱石山房記念館 公式 ご挨拶', authority: 'facility', page_type: 'about', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' },
    { url: 'https://soseki-museum.jp/about-us/summary/', title: '新宿区立漱石山房記念館 公式 施設概要', authority: 'facility', page_type: 'architecture', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' },
    { url: 'https://soseki-museum.jp/about-us/policy/', title: '新宿区立漱石山房記念館 公式 基本方針', authority: 'facility', page_type: 'about', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' },
    { url: 'https://soseki-museum.jp/exhibition-room/', title: '新宿区立漱石山房記念館 公式 展示室', authority: 'facility', page_type: 'collection', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' },
  ],
  '103': [
    { url: 'https://tohatsu.yokohama-history.org/josetsuten/', title: '横浜都市発展記念館 公式 常設展', authority: 'facility', page_type: 'collection', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' },
    { url: 'https://eurasia.yokohama-history.org/josetsuten/info/', title: '横浜ユーラシア文化館 公式 常設展', authority: 'facility', page_type: 'collection', relation: 'editorial_fact_source', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-08-17', confidence: 'verified', source_scope: 'facility' },
    { url: 'https://tohatsu.yokohama-history.org/events/postwar-yokohama-photo-exhibition/', title: '昭和100年記念 五十嵐英壽・常盤とよ子・奥村泰宏写真展', authority: 'facility', page_type: 'exhibition', relation: 'context_confirmation', confirms_pass_entitlement: false, applicable_year: 2026, checked_at: '2026-09-19', confidence: 'verified', source_scope: 'facility' }
  ]
};

/*
 * Per-facility page locators inside a multi-page official PDF.
 *
 * A whole-document link makes the reader hunt through 20+ pages for the one row
 * that backs the claim, so provenance records where each facility actually
 * appears. Every number here was read off the document itself; none is derived
 * from a facility number, a URL, or an array index, and a facility with no
 * recorded page simply shows none.
 *
 * Pages are 1-based, as a PDF viewer numbers them — the same value that goes in
 * the visible "p.N" label and in the `#page=N` fragment.
 *
 * The brochure is deliberately ABSENT from this table: its per-facility pages
 * already live in `data/facility-brochure.js` (`cards[key].sourcePage`), and one
 * fact belongs in one place. `getFacilitySourcePages()` reads both.
 */
/*
 * `page_count` is the revision these locators were read from. Grutto republishes
 * under the same URL, so a swap would silently shift every page; recording the
 * count lets the validator catch a locator that has fallen off the end, which is
 * the loudest symptom a static check can see.
 */
const SOURCE_PAGE_DOCUMENTS = Object.freeze({
  exhibition_2026_01: Object.freeze({
    url: 'https://www.rekibun.or.jp/grutto/wp-content/uploads/sites/3/2026/03/exhibition_2026_01.pdf',
    page_count: 22,
    checked_at: '2026-08-16'
  }),
  exhibition_2026_08: Object.freeze({
    url: 'https://www.rekibun.or.jp/pdf/grutto/exhibition_2026_01.pdf',
    page_count: 23,
    checked_at: '2026-09-19'
  }),
  brochure_2026_01: Object.freeze({
    url: 'https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf',
    page_count: 20,
    checked_at: '2026-08-16'
  })
});

// Extracted 2026-08-16 from exhibition_2026_01.pdf (22 content pages). No.36 has
// two app cards sharing one brochure row, so both point at the same page.
const FACILITY_SOURCE_PAGES = {
  exhibition_2026_01: {
    '1': 1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1, '7': 1, '8': 1,
    '9': 2, '10': 2, '11': 2, '12': 2, '13': 2, '14': 2, '15': 2, '16': 2,
    '17': 3, '18': 3, '19': 3, '20': 3, '21': 3, '22': 3,
    '23': 4, '24': 4, '25': 4, '26': 4, '27': 4,
    '28': 5, '29': 5, '30': 5, '31': 5, '32-WHAT-MUSEUM': 5, '33': 5, '34': 5, '35': 5,
    '36': 6, '36-2': 6, '37': 6, '38': 6, '39': 6, '40': 6,
    '41': 7, '42': 7, '43': 7, '44': 7, '45': 7,
    '46': 8, '47': 8, '48': 8, '49': 8,
    '50': 9, '51': 9,
    '52': 10, '53': 10, '54': 10, '55': 10, '56': 10, '57': 10,
    '58-NTT-ICC': 11, '59': 11, '60': 11, '61': 11, '62': 11,
    '63': 12, '64': 12, '65': 12, '66': 12, '67': 12, '68': 12,
    '69': 13, '70': 13, '71': 13,
    '72': 14, '73': 14, '74': 14, '75': 14, '76': 14,
    '77': 15, '78': 15, '79': 15, '80': 15,
    '81': 16, '82': 16, '83': 16, '84': 16, '85': 16, '86': 16,
    '87': 17, '88': 17,
    '89': 18, '90': 18,
    '91': 19, '92': 19, '93': 19, '94': 19, '95': 19, '96': 19,
    '97': 20, '98': 20, '99': 20,
    '100': 21, '101': 21, '102': 21, '103': 21, '104': 21, '105': 21,
    '106': 22, '107': 22
  },
  // Extracted 2026-09-19 from the August 2026 revision (23 content pages).
  // No.36 and No.103 retain their existing multi-card / combined-card runtime
  // identities with their accepted per-facility page locators.
  exhibition_2026_08: {
    '1': 1, '2': 1, '3': 1, '4': 1, '5': 1,
    '6': 2, '7': 2, '8': 2, '9': 2, '10': 2, '11': 2, '12': 2, '13': 2,
    '14': 3, '15': 3, '16': 3,
    '17': 4, '18': 4, '19': 4, '20': 4, '21': 4, '22': 4, '23': 4,
    '24': 5, '25': 5, '26': 5, '27': 5,
    '28': 6, '29': 6, '30': 6, '31': 6, '32-WHAT-MUSEUM': 6, '33': 6, '34': 6,
    '35': 7, '36': 7, '36-2': 7, '37': 7, '38': 7,
    '39': 8, '40': 8, '41': 8, '42': 8,
    '43': 9, '44': 9, '45': 9, '46': 9, '47': 9, '48': 9,
    '49': 10, '50': 10, '51': 10,
    '52': 11, '53': 11, '54': 11, '55': 11, '56': 11, '57': 11,
    '58-NTT-ICC': 12, '59': 12, '60': 12, '61': 12, '62': 12,
    '63': 13, '64': 13, '65': 13, '66': 13, '67': 13, '68': 13,
    '69': 14, '70': 14, '71': 14,
    '72': 15, '73': 15, '74': 15, '75': 15, '76': 15,
    '77': 16, '78': 16, '79': 16, '80': 16,
    '81': 17, '82': 17, '83': 17, '84': 17, '85': 17, '86': 17,
    '87': 18, '88': 18,
    '89': 19, '90': 19,
    '91': 20, '92': 20, '93': 20, '94': 20, '95': 20, '96': 20, '97': 20, '98': 20, '99': 20,
    '100': 21, '101': 21, '102': 21, '103': 21, '104': 21,
    '105': 22, '106': 22,
    '107': 23
  }
};

window.OFFICIAL_SOURCE_AUTHORITIES = OFFICIAL_SOURCE_AUTHORITIES;
window.OFFICIAL_SOURCE_PAGE_TYPES = OFFICIAL_SOURCE_PAGE_TYPES;
window.OFFICIAL_SOURCE_RELATIONS = OFFICIAL_SOURCE_RELATIONS;
window.OFFICIAL_SOURCE_CONFIDENCE = OFFICIAL_SOURCE_CONFIDENCE;
window.FACILITY_OFFICIAL_GLOBAL_SOURCES = FACILITY_OFFICIAL_GLOBAL_SOURCES;
window.FACILITY_OFFICIAL_SOURCES = FACILITY_OFFICIAL_SOURCES;
window.SOURCE_PAGE_DOCUMENTS = SOURCE_PAGE_DOCUMENTS;
window.FACILITY_SOURCE_PAGES = FACILITY_SOURCE_PAGES;
