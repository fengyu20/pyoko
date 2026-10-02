/*
 * Shared semantic facility projection for the buildless browser and the
 * static facility-page generator.
 *
 * The factory is CommonJS-loadable for Node build/tests. In the browser the
 * classic-script bootstrap below receives the same already-loaded authorities
 * and exposes one immutable model object. The functions inside the factory do
 * not read the DOM, current time, browser storage, or HTML.
 */
(function bootstrapFacilityPresentationModel(root, createModel) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = createModel;
    return;
  }

  root.FACILITY_PRESENTATION = createModel({
    DATA: typeof DATA !== 'undefined' ? DATA : [],
    CONFIG: typeof CONFIG !== 'undefined' ? CONFIG : {},
    FACILITY_BROCHURE: typeof FACILITY_BROCHURE !== 'undefined' ? FACILITY_BROCHURE : null,
    FACILITY_PRODUCT_SUMMARIES: typeof FACILITY_PRODUCT_SUMMARIES !== 'undefined' ? FACILITY_PRODUCT_SUMMARIES : null,
    FACILITY_ACCESS_PRESENTATION: typeof FACILITY_ACCESS_PRESENTATION !== 'undefined' ? FACILITY_ACCESS_PRESENTATION : null,
    FACILITY_PASS_BENEFITS: typeof FACILITY_PASS_BENEFITS !== 'undefined' ? FACILITY_PASS_BENEFITS : {},
    FACILITY_LEGACY_HIGH_RISK: typeof FACILITY_LEGACY_HIGH_RISK !== 'undefined'
      ? FACILITY_LEGACY_HIGH_RISK
      : (root.FACILITY_LEGACY_HIGH_RISK || {}),
    FACILITY_PASS_TIME_SCOPE: typeof FACILITY_PASS_TIME_SCOPE !== 'undefined'
      ? FACILITY_PASS_TIME_SCOPE
      : (root.FACILITY_PASS_TIME_SCOPE || {}),
    HOURS: typeof HOURS !== 'undefined' ? HOURS : {},
    getFacilityOfficialSources: typeof getFacilityOfficialSources === 'function'
      ? getFacilityOfficialSources
      : root.getFacilityOfficialSources,
    getFacilityHomepageSource: typeof getFacilityHomepageSource === 'function'
      ? getFacilityHomepageSource
      : root.getFacilityHomepageSource,
    resolveContextualCtas: typeof resolveContextualCtas === 'function'
      ? resolveContextualCtas
      : root.resolveContextualCtas,
    getPassTimeScope: typeof getPassTimeScope === 'function'
      ? getPassTimeScope
      : root.getPassTimeScope,
    getEnrichedMeta: typeof getEnrichedMeta === 'function' ? getEnrichedMeta : root.getEnrichedMeta,
    getSourceOpenUrl: typeof getSourceOpenUrl === 'function' ? getSourceOpenUrl : root.getSourceOpenUrl
  });
})(typeof globalThis !== 'undefined' ? globalThis : this, function createFacilityPresentationModel(sources) {
  'use strict';

  sources = sources || {};

  const DATA = Array.isArray(sources.DATA) ? sources.DATA : [];
  const CONFIG = sources.CONFIG || {};
  const BROCHURE = sources.FACILITY_BROCHURE || { cards: {} };
  const SUMMARIES = sources.FACILITY_PRODUCT_SUMMARIES || { entries: [] };
  const ACCESS = sources.FACILITY_ACCESS_PRESENTATION || { entries: [] };
  const PASS_BENEFITS = sources.FACILITY_PASS_BENEFITS || {};
  const LEGACY_HIGH_RISK = sources.FACILITY_LEGACY_HIGH_RISK || {};
  const PASS_TIME_SCOPE = sources.FACILITY_PASS_TIME_SCOPE || {};
  const HOURS = sources.HOURS || {};

  const officialSourcesFor = typeof sources.getFacilityOfficialSources === 'function'
    ? sources.getFacilityOfficialSources
    : () => [];
  const homepageSourceFor = typeof sources.getFacilityHomepageSource === 'function'
    ? sources.getFacilityHomepageSource
    : facility => officialSourcesFor(facility).find(source => source?.relation === 'homepage') || null;
  const contextualCtasFor = typeof sources.resolveContextualCtas === 'function'
    ? sources.resolveContextualCtas
    : () => [];
  const passTimeScopeFor = typeof sources.getPassTimeScope === 'function'
    ? sources.getPassTimeScope
    : facility => PASS_TIME_SCOPE[facilityKey(facility)] || null;
  const enrichedMetaFor = typeof sources.getEnrichedMeta === 'function'
    ? sources.getEnrichedMeta
    : () => ({});
  const sourceOpenUrl = typeof sources.getSourceOpenUrl === 'function'
    ? sources.getSourceOpenUrl
    : source => String(source?.url || '');

  const DAY_NAMES = ['日', '月', '火', '水', '木', '金', '土'];
  const DETAIL_EXHIBITION_HORIZON_DAYS = 60;
  const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
  const PASS_SCOPE_LABELS = {
    whole_facility_admission: '施設全体',
    permanent_collection: '常設展',
    collection: 'コレクション',
    special_exhibition: '特別展',
    temporary_exhibition: '企画展',
    named_exhibition: '対象展',
    garden: '庭園',
    building: '建物',
    unknown: ''
  };

  function normalizeReferenceDate(value) {
    const date = String(value == null ? '' : value).trim();
    if (!ISO_DATE_RE.test(date)) {
      throw new TypeError(`Exhibition relevance requires an explicit YYYY-MM-DD reference date: ${date || '(missing)'}`);
    }
    return date;
  }

  function addIsoDays(referenceDate, days) {
    const date = new Date(`${referenceDate}T00:00:00Z`);
    if (Number.isNaN(date.getTime())) return referenceDate;
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  }

  function exhibitionHorizon(referenceDate) {
    const horizon = addIsoDays(referenceDate, DETAIL_EXHIBITION_HORIZON_DAYS);
    const passEnd = String(CONFIG.passEnd || '');
    return passEnd && passEnd < horizon ? passEnd : horizon;
  }

  /*
   * This is the pure counterpart of the browser detail surface's existing
   * getDetailExhibitionState rule. It deliberately receives the selected/build
   * date instead of reading the wall clock. The browse surface can still show
   * far-upcoming items when that is its existing behavior; detail/static
   * consumers use `displayable` to retain only ongoing, near-upcoming, and
   * unknown/permanent/recurring items.
   */
  function exhibitionRelevance(item, referenceDate) {
    const targetDate = normalizeReferenceDate(referenceDate);
    const from = String(item?.valid_from ?? item?.validFrom ?? '').trim();
    const to = String(item?.valid_to ?? item?.validTo ?? '').trim();
    const dateState = String(item?.date_state ?? item?.dateState ?? 'unknown');
    let state = 'unknown';

    if (to && to < targetDate) {
      state = 'expired';
    } else if (!from && !to) {
      state = dateState === 'permanent' ? 'ongoing' : 'unknown';
    } else if ((!from || from <= targetDate) && (!to || targetDate <= to)) {
      state = 'ongoing';
    } else if (from && from > targetDate) {
      state = from <= exhibitionHorizon(targetDate) ? 'near-upcoming' : 'far-upcoming';
    }

    return {
      state,
      displayable: state !== 'expired' && state !== 'far-upcoming',
      reference_date: targetDate
    };
  }

  function asList(value) {
    return (Array.isArray(value) ? value : value == null ? [] : [value])
      .map(entry => String(entry == null ? '' : entry).trim())
      .filter(Boolean);
  }

  function finiteNumber(value) {
    return value === null || value === undefined || value === '' || !Number.isFinite(Number(value))
      ? null
      : Number(value);
  }

  function facilityKey(facility) {
    if (!facility) return '';
    if (typeof facility === 'string' || typeof facility === 'number') return String(facility);
    return String(facility._key || `${facility.no || ''}-${facility.name || ''}`);
  }

  function allFacilities() {
    return DATA.flatMap(area => Array.isArray(area?.facilities) ? area.facilities : []);
  }

  function resolveFacility(value) {
    if (value && typeof value === 'object') return value;
    const key = facilityKey(value);
    return allFacilities().find(facility => facilityKey(facility) === key) || { _key: key };
  }

  function areaNameFor(facility) {
    const key = facilityKey(facility);
    return DATA.find(area => (area.facilities || []).some(candidate => facilityKey(candidate) === key))?.name || '';
  }

  function cloneSource(source) {
    if (!source?.url) return null;
    return {
      url: String(source.url),
      title: String(source.title || source.label || '').trim(),
      relation: String(source.relation || ''),
      page_type: String(source.page_type || '')
    };
  }

  function clonePassRecord(record) {
    if (!record) return null;
    return {
      official_clauses: asList(record.official_clauses).length
        ? record.official_clauses.map(clause => ({
          label_ja: String(clause?.label_ja || ''),
          wording_ja: String(clause?.wording_ja || '')
        }))
        : [],
      notes_ja: asList(record.notes_ja),
      benefits: Array.isArray(record.benefits) ? record.benefits.map(benefit => ({
        clause_index: benefit?.clause_index,
        type: String(benefit?.type || ''),
        scopes: Array.isArray(benefit?.scopes) ? [...benefit.scopes] : [],
        scope_source_ja: String(benefit?.scope_source_ja || ''),
        official_wording: { ja: String(benefit?.official_wording?.ja || '') },
        interprets_ja: benefit?.interprets_ja == null ? null : String(benefit.interprets_ja),
        price_mode: String(benefit?.price_mode || ''),
        regular_price_yen: benefit?.regular_price_yen == null ? null : Number(benefit.regular_price_yen),
        saving_yen: benefit?.saving_yen == null ? null : Number(benefit.saving_yen),
        discount_rate: benefit?.discount_rate == null ? null : Number(benefit.discount_rate),
        price_source: benefit?.price_source?.url ? {
          label: String(benefit.price_source.label || ''),
          url: String(benefit.price_source.url),
          checked_at: String(benefit.price_source.checked_at || '')
        } : null
      })) : [],
      comparable_value_yen: finiteNumber(record.comparable_value_yen),
      value_basis: record.value_basis ? {
        benefit_index: record.value_basis.benefit_index,
        benefit_type: String(record.value_basis.benefit_type || ''),
        scope: String(record.value_basis.scope || ''),
        regular_price_yen: record.value_basis.regular_price_yen == null
          ? null
          : Number(record.value_basis.regular_price_yen),
        derivation: String(record.value_basis.derivation || '')
      } : null,
      verification_status: String(record.verification_status || '')
    };
  }

  function getPassRecord(key) {
    return PASS_BENEFITS[String(key || '')] || null;
  }

  function getPassTypes(facility, record = getPassRecord(facilityKey(facility))) {
    if (Array.isArray(record?.benefits) && record.benefits.length) {
      return [...new Set(record.benefits.map(benefit => benefit.type === 'admission' ? 'admission' : 'discount'))];
    }
    if (Array.isArray(facility?.pass_types) && facility.pass_types.length) return [...facility.pass_types];
    return /割引/.test(facility?.admission_label || '') ? ['discount'] : ['admission'];
  }

  function extractYenNumbers(text) {
    const values = [];
    const re = /([0-9０-９][0-9０-９,，]*)\s*円/g;
    let match;
    while ((match = re.exec(String(text || '')))) {
      const value = Number(match[1]
        .replace(/[０-９]/g, character => String(character.charCodeAt(0) - 0xFEE0))
        .replace(/[,，]/g, ''));
      if (Number.isFinite(value)) values.push(value);
    }
    return values;
  }

  function legacyRegularAdultPrice(facility) {
    if (facility?.regular_price_yen !== null
      && facility?.regular_price_yen !== undefined
      && facility?.regular_price_yen !== ''
      && Number.isFinite(Number(facility.regular_price_yen))) {
      return Number(facility.regular_price_yen);
    }

    const text = [
      ...asList(facility?.fee),
      ...(facility?.enriched || []).map(item => item?.fields?.['料金'] || '')
    ].join(' ');
    const preferred = [];
    const re = /(?:一般|大人)(?:当日)?(?:料金)?[^0-9０-９]{0,18}([0-9０-９][0-9０-９,，]*)\s*円/g;
    let match;
    while ((match = re.exec(text))) {
      const value = extractYenNumbers(`${match[1]}円`)[0];
      if (Number.isFinite(value)) preferred.push(value);
    }
    if (preferred.length) return Math.max(...preferred);
    const all = extractYenNumbers(text).filter(value => value >= 50 && value <= 10000);
    return all.length ? Math.max(...all) : null;
  }

  function legacyKnownBenefit(facility) {
    if (facility?.pass_benefit_yen !== null
      && facility?.pass_benefit_yen !== undefined
      && facility?.pass_benefit_yen !== ''
      && Number.isFinite(Number(facility.pass_benefit_yen))) {
      return Number(facility.pass_benefit_yen);
    }

    const types = getPassTypes(facility, null);
    const label = [facility?.admission_label || '', ...asList(facility?.pass_notes)].join(' ');
    const candidates = [];
    if (types.includes('admission')) {
      const price = legacyRegularAdultPrice(facility);
      if (Number.isFinite(price)) candidates.push(price);
    }
    const fixed = [...label.matchAll(/([0-9０-９][0-9０-９,，]*)\s*円引/g)]
      .map(match => extractYenNumbers(`${match[1]}円`)[0])
      .filter(Number.isFinite);
    candidates.push(...fixed);
    const percentages = [...label.matchAll(/([0-9０-９]+)\s*%引/g)]
      .map(match => Number(match[1].replace(/[０-９]/g, character => String(character.charCodeAt(0) - 0xFEE0))))
      .filter(Number.isFinite);
    const price = legacyRegularAdultPrice(facility);
    if (Number.isFinite(price) && percentages.length) {
      candidates.push(...percentages.map(rate => Math.round(price * rate / 100)));
    }
    return candidates.length ? Math.max(...candidates) : null;
  }

  function comparableValueFor(facility) {
    const key = facilityKey(facility);
    const record = getPassRecord(key);
    if (record?.verification_status === 'priced') {
      return {
        value_yen: finiteNumber(record.comparable_value_yen),
        value_basis: record.value_basis ? {
          benefit_index: record.value_basis.benefit_index,
          benefit_type: String(record.value_basis.benefit_type || ''),
          scope: String(record.value_basis.scope || ''),
          regular_price_yen: record.value_basis.regular_price_yen == null
            ? null
            : Number(record.value_basis.regular_price_yen),
          derivation: String(record.value_basis.derivation || '')
        } : null,
        source: 'scoped',
        risk: 'none'
      };
    }

    const highRisk = Object.prototype.hasOwnProperty.call(LEGACY_HIGH_RISK, key);
    const legacy = legacyKnownBenefit(facility);
    return {
      value_yen: highRisk ? null : (Number.isFinite(legacy) ? legacy : null),
      value_basis: null,
      source: 'legacy',
      risk: highRisk ? 'high' : (Number.isFinite(legacy) ? 'low' : 'none')
    };
  }

  function regularPriceForValueBasis(facility) {
    const key = facilityKey(facility);
    const record = getPassRecord(key);
    if (record?.verification_status === 'priced') {
      const value = record.value_basis?.regular_price_yen;
      return finiteNumber(value);
    }
    if (Object.prototype.hasOwnProperty.call(LEGACY_HIGH_RISK, key)) return null;
    return legacyRegularAdultPrice(facility);
  }

  function passProjection(facility) {
    const key = facilityKey(facility);
    const record = getPassRecord(key);
    const entitlements = clonePassRecord(record);
    const comparable = comparableValueFor(facility);
    const timeScope = passTimeScopeFor(facility) || null;
    return {
      record_status: record?.verification_status || 'missing',
      entitlements,
      pass_types: getPassTypes(facility, record),
      comparable,
      regular_price_yen: regularPriceForValueBasis(facility),
      notes_ja: entitlements?.notes_ja || [],
      time_scope: timeScope ? {
        admission_time_scoped: Boolean(timeScope.admission_time_scoped),
        named_exhibition: String(timeScope.named_exhibition || ''),
        boundary_wording: String(timeScope.boundary_wording || ''),
        windows: Array.isArray(timeScope.windows) ? timeScope.windows.map(window => ({
          valid_from: String(window?.valid_from || ''),
          valid_to: String(window?.valid_to || ''),
          title: String(window?.title || '')
        })).filter(window => window.valid_from && window.valid_to) : []
      } : null
    };
  }

  function getApprovedAccessPresentation(facility) {
    const key = facilityKey(facility);
    const entries = Array.isArray(ACCESS.entries) ? ACCESS.entries : [];
    const approved = entries.find(entry => String(entry?.key || '') === key);
    if (!approved) return null;
    const rawSource = Array.isArray(facility?.access) ? facility.access[0] : facility?.access;
    const sourceTextJa = Array.isArray(approved.display_lines_ja) ? approved.display_lines_ja.join('/') : '';
    return String(rawSource || '') === sourceTextJa
      ? {
        key,
        source_text_ja: sourceTextJa,
        display_lines_ja: asList(approved.display_lines_ja)
      }
      : null;
  }

  const PLACEHOLDER_VALUE_RE = /^(?:[-—–−_]+|なし|特になし|該当なし|none|n\/a|na)$/i;
  const GENERIC_OFFICIAL_RE = /^(?:※|\*|注：|Note:\s*)?(?:詳細は)?(?:公式サイト|ホームページ|HP)(?:等)?(?:で|を)?(?:ご)?確認(?:ください|願います)?[。．.]?$/i;
  const OFFICIAL_TAIL_RE = /(?:[。．.]\s*)?(?:詳細は)?(?:公式サイト|ホームページ|HP)(?:等)?(?:で|を)?(?:ご)?確認(?:ください|願います)?[。．.]?$/i;

  function normalizeVisitValues(values, fieldKey = '') {
    return asList(values).map(value => value.replace(/\s+/g, ' ').trim())
      .map(value => value.replace(OFFICIAL_TAIL_RE, '').trim())
      .filter(value => value && !PLACEHOLDER_VALUE_RE.test(value) && !GENERIC_OFFICIAL_RE.test(value))
      .filter((value, index, list) => list.indexOf(value) === index)
      .map(value => fieldKey === 'notes' ? value.replace(/^(?:※|\*|注：|Note:)\s*/i, '').trim() : value)
      .filter(Boolean);
  }

  function accessProjection(facility) {
    const approved = getApprovedAccessPresentation(facility);
    const raw = normalizeVisitValues(facility?.access, 'access');
    if (approved?.display_lines_ja.length) {
      return {
        state: 'APPROVED',
        display_lines_ja: [...approved.display_lines_ja],
        raw_lines_ja: raw,
        source_matches: true
      };
    }
    return {
      state: raw.length ? 'RAW_FALLBACK' : 'NO_SAFE_ACCESS_VALUE',
      display_lines_ja: raw,
      raw_lines_ja: raw,
      source_matches: false
    };
  }

  function introductionProjection(facility) {
    const key = facilityKey(facility);
    const entries = (Array.isArray(SUMMARIES.entries) ? SUMMARIES.entries : [])
      .filter(entry => String(entry?.facility_key || '') === key);
    const card = BROCHURE.cards?.[key] || null;
    const venues = Array.isArray(card?.subfacilities) && card.subfacilities.length
      ? card.subfacilities
      : card ? [card] : [];
    const descriptions = entries.map((entry, index) => ({
      venue_key: String(entry?.venue_key || ''),
      venue_name_ja: entries.length > 1 ? String(venues[index]?.nameJa || '') : '',
      summary_ja: String(entry?.summary?.ja || ''),
      summary_en: String(entry?.summary?.en || ''),
      summary_zh: String(entry?.summary?.zh || '')
    })).filter(entry => entry.summary_ja);
    return {
      state: descriptions.length ? 'APPROVED' : 'NO_SAFE_INTRODUCTION',
      descriptions
    };
  }

  function formatRange(range) {
    if (!Array.isArray(range) || range.length < 2) return '';
    return `${range[0]}–${range[1]}`;
  }

  function formatRanges(ranges) {
    return (Array.isArray(ranges) ? ranges : []).map(formatRange).filter(Boolean).join(' / ');
  }

  function seasonLabel(season) {
    const from = String(season?.from || '').replace('-', '/');
    const to = String(season?.to || '').replace('-', '/');
    return from && to ? `${from}–${to}` : '';
  }

  function daysLabel(days) {
    const list = [...days].sort((a, b) => a - b);
    if (!list.length) return '';
    if (list.length === 7) return '毎日';
    if (list.length === 1) return `${DAY_NAMES[list[0]]}曜`;
    return `${list.map(day => DAY_NAMES[day]).join('・')}曜`;
  }

  function stableHoursProjection(facility) {
    const key = facilityKey(facility);
    const entry = HOURS[key];
    if (!entry) return { state: 'NO_SAFE_HOURS_VALUE', lines_ja: [], source: null };
    const lines = [];

    if (Array.isArray(entry.seasons) && entry.seasons.length) {
      entry.seasons.forEach(season => {
        const label = seasonLabel(season);
        const value = formatRanges(season.d);
        if (label && value) lines.push(`${label}: ${value}`);
      });
    } else {
      const base = formatRanges(entry.d);
      const overrides = entry.w && typeof entry.w === 'object' ? entry.w : {};
      const overriddenDays = new Set(Object.keys(overrides).map(Number).filter(Number.isInteger));
      const baseDays = [0, 1, 2, 3, 4, 5, 6].filter(day => !overriddenDays.has(day));
      if (base) lines.push(`${daysLabel(baseDays) || '毎日'}: ${base}`);

      const groups = new Map();
      Object.entries(overrides).forEach(([day, ranges]) => {
        const value = formatRanges(ranges);
        if (!value) return;
        const current = groups.get(value) || [];
        current.push(Number(day));
        groups.set(value, current);
      });
      groups.forEach((days, value) => lines.push(`${daysLabel(days)}: ${value}`));
    }

    return {
      state: lines.length ? 'STABLE' : 'NO_SAFE_HOURS_VALUE',
      lines_ja: lines,
      source: entry.source ? String(entry.source) : null
    };
  }

  function exhibitionProjection(facility, referenceDate) {
    const targetDate = normalizeReferenceDate(referenceDate);
    const items = (Array.isArray(facility?.enriched) ? facility.enriched : []).map(item => {
      const fields = item?.fields || {};
      const meta = enrichedMetaFor(facility, item) || {};
      const validFrom = String(meta.validFrom || item?.validFrom || '');
      const validTo = String(meta.validTo || item?.validTo || '');
      const dateState = String(meta.dateState || item?.dateState || 'unknown');
      const relevance = exhibitionRelevance({
        valid_from: validFrom,
        valid_to: validTo,
        date_state: dateState
      }, targetDate);
      return {
        title: String(item?.title || '').trim(),
        url: /^https?:\/\//i.test(String(item?.url || '')) ? String(item.url) : '',
        fee_ja: normalizeVisitValues(fields['料金'], 'fee'),
        hours_ja: normalizeVisitValues(fields['時間'], 'hours'),
        summary_ja: normalizeVisitValues(fields['概要'], 'summary'),
        notice_ja: normalizeVisitValues(item?.notice, 'notes'),
        valid_from: validFrom,
        valid_to: validTo,
        date_state: dateState,
        checked_at: String(meta.checkedAt || item?.checkedAt || ''),
        relevance_state: relevance.state
      };
    }).filter(item => item.title && exhibitionRelevance(item, targetDate).displayable);

    return {
      state: items.length ? 'AVAILABLE' : 'NO_SAFE_EXHIBITION',
      reference_date: targetDate,
      items
    };
  }

  function sourceProjection(facility) {
    const records = officialSourcesFor(facility);
    const list = Array.isArray(records) ? records : [];
    const homepage = cloneSource(homepageSourceFor(facility)
      || list.find(source => source?.relation === 'homepage'));
    const passEvidence = cloneSource(list.find(source => source?.relation === 'entitlement_evidence'));
    const passConfirmation = cloneSource(list.find(source => source?.relation === 'pass_confirmation'));
    const passCta = contextualCtasFor('pass', facility)?.[0];
    const hoursCta = contextualCtasFor('hours', facility)?.[0];
    const exhibitionCta = contextualCtasFor('exhibition', facility)?.[0];
    const contextual = [
      passCta ? { kind: 'pass_confirmation', url: String(passCta.source?.url || '') } : null,
      hoursCta ? { kind: 'opening_hours', url: String(hoursCta.source?.url || '') } : null,
      exhibitionCta ? { kind: String(exhibitionCta.kind || ''), url: String(exhibitionCta.source?.url || '') } : null
    ].filter(entry => entry?.url);

    const seen = new Set();
    const links = [];
    const add = (kind, url, label) => {
      const href = String(url || '').trim();
      if (!/^https?:\/\//i.test(href)) return;
      if (seen.has(href)) return;
      seen.add(href);
      links.push({ kind, url: href, label });
    };
    add('facility_homepage', homepage?.url, '施設公式サイト');
    add('pass_entitlement', passEvidence ? sourceOpenUrl(passEvidence) : '', `ぐるっとパス${CONFIG.year || ''} 公式資料`);
    add('pass_confirmation', passConfirmation?.url, '施設公式の案内');
    contextual.forEach(entry => {
      const label = entry.kind === 'opening_hours'
        ? '開館時間を公式サイトで確認'
        : entry.kind === 'exhibition_page'
          ? '展覧会ページ'
          : entry.kind === 'exhibition_listing'
            ? '展覧会情報'
            : '公式案内';
      add(entry.kind, entry.url, label);
    });

    return {
      homepage,
      pass_evidence: passEvidence,
      pass_confirmation: passConfirmation,
      contextual,
      links,
      has_verification_route: links.length > 0
    };
  }

  function facilityProjection(facility, referenceDate) {
    const key = facilityKey(facility);
    const intro = introductionProjection(facility);
    const pass = passProjection(facility);
    const access = accessProjection(facility);
    const visit = {
      closed_ja: normalizeVisitValues(facility?.closed, 'closed'),
      fee_ja: normalizeVisitValues(facility?.fee, 'fee'),
      notes_ja: normalizeVisitValues(facility?.notes, 'notes')
    };
    const hours = stableHoursProjection(facility);
    const exhibitions = exhibitionProjection(facility, referenceDate);
    const sourcesProjection = sourceProjection(facility);
    const reasons = [];
    const degradedBlocks = [];

    if (intro.state !== 'APPROVED') reasons.push('NO_SAFE_INTRODUCTION');
    if (!pass.entitlements || !pass.entitlements.official_clauses.length) reasons.push('NO_SAFE_PASS_ENTITLEMENT');
    const hasOperationalInfo = Boolean(
      hours.lines_ja.length
      || access.display_lines_ja.length
      || visit.closed_ja.length
      || visit.fee_ja.length
      || visit.notes_ja.length
    );
    if (!hasOperationalInfo || !sourcesProjection.has_verification_route) reasons.push('NO_SAFE_OPERATIONAL_ROUTE');
    if (!sourcesProjection.has_verification_route) reasons.push('NO_SAFE_OFFICIAL_SOURCE');

    if (pass.comparable.risk === 'high') {
      degradedBlocks.push('reference_value');
      reasons.push('HIGH_RISK_REFERENCE_SUPPRESSED');
    }
    if (access.state === 'RAW_FALLBACK') {
      degradedBlocks.push('normalized_access');
      reasons.push('ACCESS_NORMALIZED_FALLBACK');
    } else if (access.state === 'NO_SAFE_ACCESS_VALUE') {
      degradedBlocks.push('access');
      reasons.push('ACCESS_UNAVAILABLE');
    }
    if (exhibitions.state !== 'AVAILABLE') degradedBlocks.push('exhibitions');

    const unsafe = reasons.includes('NO_SAFE_INTRODUCTION')
      || reasons.includes('NO_SAFE_PASS_ENTITLEMENT')
      || reasons.includes('NO_SAFE_OPERATIONAL_ROUTE')
      || reasons.includes('NO_SAFE_OFFICIAL_SOURCE');
    const state = unsafe ? 'UNSAFE' : degradedBlocks.length ? 'DEGRADED_SAFE' : 'FULL';

    return {
      key,
      no: String(facility?.no || ''),
      name_ja: String(facility?.name || ''),
      area_name_ja: areaNameFor(facility),
      facility,
      introduction: intro,
      pass,
      access,
      visit,
      hours,
      exhibitions,
      sources: sourcesProjection,
      state,
      reasons: [...new Set(reasons)],
      degraded_blocks: [...new Set(degradedBlocks)]
    };
  }

  return Object.freeze({
    allFacilities,
    facilityKey,
    areaNameFor,
    getPassRecord,
    getPassTypes,
    getFacilityEntitlements: facility => clonePassRecord(getPassRecord(facilityKey(resolveFacility(facility)))),
    getFacilityComparableValue: facility => comparableValueFor(resolveFacility(facility)),
    getFacilityRegularPriceForValueBasis: facility => regularPriceForValueBasis(resolveFacility(facility)),
    getLegacyRegularAdultPrice: legacyRegularAdultPrice,
    getLegacyKnownBenefit: legacyKnownBenefit,
    hasAuthoritativeScopedMonetaryRecord: facility => getPassRecord(facilityKey(resolveFacility(facility)))?.verification_status === 'priced',
    isLegacyHighRisk: facility => Object.prototype.hasOwnProperty.call(LEGACY_HIGH_RISK, facilityKey(resolveFacility(facility))),
    getFacilityPassProjection: passProjection,
    getApprovedAccessPresentation,
    normalizeVisitValues,
    getFacilityAccessProjection: accessProjection,
    getFacilityIntroductionProjection: introductionProjection,
    getFacilityHoursProjection: stableHoursProjection,
    getFacilityExhibitionProjection: exhibitionProjection,
    getExhibitionRelevance: exhibitionRelevance,
    projectFacility: facilityProjection,
    projectAllFacilities: referenceDate => allFacilities().map(facility => facilityProjection(facility, referenceDate)),
    getFacilitySourceProjection: sourceProjection,
    passScopeLabel: scope => PASS_SCOPE_LABELS[String(scope || '')] || ''
  });
});
