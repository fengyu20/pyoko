#!/usr/bin/env node
// データ検証: 毎月の更新後に走らせる。ビルド不要・依存ゼロ。
//   node scripts/validate-data.js              構造チェックのみ（高速・CI 向け）
//   node scripts/validate-data.js --check-links 公式リンクの死活も見る（warn のみ・低速）
//
// ERROR が 1 件でもあれば exit code 1（＝ CI を落とす）。WARN は落とさない。
// リンク死活は外部 HTTP が不安定なので常に WARN 扱い。

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');

// --- データファイルを vm で読み込む（ソース無改変） -----------------------
function loadData() {
  const files = ['config.js', 'data/holidays.js', 'data/facilities.js', 'data/facility-corrections.js', 'data/exhibition-meta.js', 'exhibition-meta-runtime.js', 'phase1/hours.js', 'coords.js'];
  let src = files.map(f => fs.readFileSync(path.join(root, f), 'utf8')).join('\n;\n');
  src += `;globalThis.__d = { CONFIG, HOLIDAYS, DATA, HOURS, COORDS, EXHIBITION_META, enrichedMetaKey, getEnrichedMeta };`;
  const overlayFiles = ['data/i18n/facilities.en.js', 'data/i18n/facilities.zh.js', 'data/search-aliases.js', 'data/exhibition-links.js', 'data/facility-brochure.js', 'data/facility-summaries.js', 'data/facility-official-sources.js', 'official-source-runtime.js', 'data/facility-pass-time-scope.js', 'pass-time-scope-runtime.js'];
  const overlays = overlayFiles.map(f => fs.readFileSync(path.join(root, f), 'utf8')).join('\n;\n');
  const ctx = vm.createContext({ window: {} });
  vm.runInContext(src, ctx, { filename: 'data-bundle.js' });
  vm.runInContext(overlays + ';globalThis.__i18n = window.FACILITY_I18N || {}; globalThis.__search = window.SEARCH_INDEX_CONFIG || {}; globalThis.__links = window.EXHIBITION_LINKS || {}; globalThis.__summaries = typeof FACILITY_PRODUCT_SUMMARIES !== "undefined" ? FACILITY_PRODUCT_SUMMARIES : null;', ctx, { filename: 'i18n-bundle.js' });
  ctx.__d.FACILITY_I18N = ctx.__i18n;
  ctx.__d.SEARCH_INDEX_CONFIG = ctx.__search;
  ctx.__d.EXHIBITION_LINKS = ctx.__links;
  ctx.__d.FACILITY_BROCHURE = ctx.FACILITY_BROCHURE || ctx.window?.FACILITY_BROCHURE;
  ctx.__d.FACILITY_PRODUCT_SUMMARIES = ctx.__summaries;
  ctx.__d.FACILITY_OFFICIAL_GLOBAL_SOURCES = ctx.window?.FACILITY_OFFICIAL_GLOBAL_SOURCES || [];
  ctx.__d.FACILITY_OFFICIAL_SOURCES = ctx.window?.FACILITY_OFFICIAL_SOURCES || {};
  ctx.__d.FACILITY_SOURCE_PAGES = ctx.window?.FACILITY_SOURCE_PAGES || {};
  ctx.__d.SOURCE_PAGE_DOCUMENTS = ctx.window?.SOURCE_PAGE_DOCUMENTS || {};
  ctx.__d.OFFICIAL_SOURCE_AUTHORITIES = ctx.window?.OFFICIAL_SOURCE_AUTHORITIES || [];
  ctx.__d.OFFICIAL_SOURCE_PAGE_TYPES = ctx.window?.OFFICIAL_SOURCE_PAGE_TYPES || [];
  ctx.__d.OFFICIAL_SOURCE_RELATIONS = ctx.window?.OFFICIAL_SOURCE_RELATIONS || [];
  ctx.__d.OFFICIAL_SOURCE_CONFIDENCE = ctx.window?.OFFICIAL_SOURCE_CONFIDENCE || [];
  ctx.__d.FACILITY_PASS_TIME_SCOPE = ctx.window?.FACILITY_PASS_TIME_SCOPE || {};
  ctx.__d.FACILITY_PASS_TIME_SCOPE_META = ctx.window?.FACILITY_PASS_TIME_SCOPE_META || {};
  ctx.__d.FACILITY_PASS_TIME_SCOPE_SOURCES = ctx.window?.FACILITY_PASS_TIME_SCOPE_SOURCES || {};
  return ctx.__d;
}

// --- レポート収集 ---------------------------------------------------------
const errors = [];
const warns = [];
const err = m => errors.push(m);
const warn = m => warns.push(m);

const isDate = s => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));
const isTime = s => /^\d{1,2}:\d{2}$/.test(s);
const toMin = s => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
const daysBetween = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
const STALE_DAYS = 180;
const todayTokyo = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit'
}).format(new Date());

function validateUrl(label, url) {
  if (typeof url !== 'string' || !/^https?:\/\//.test(url)) err(`${label}: URL でない ${url}`);
}

function validateUrlList(label, values) {
  if (values == null) return;
  if (!Array.isArray(values)) { err(`${label}: URL 配列でない`); return; }
  values.forEach((url, i) => validateUrl(`${label}[${i}]`, url));
}

function validateFooterSources(sources) {
  if (!sources || typeof sources !== 'object' || Array.isArray(sources)) {
    err('CONFIG.sources は core/exhibitions/recommendations を持つオブジェクトであること');
    return;
  }
  for (const group of ['core', 'exhibitions']) {
    const entries = sources[group];
    if (!Array.isArray(entries)) {
      err(`CONFIG.sources.${group} は配列であること`);
      continue;
    }
    entries.forEach((source, index) => {
      const label = `CONFIG.sources.${group}[${index}]`;
      if (!source || typeof source.id !== 'string' || !source.id) err(`${label}.id が無い`);
      if (!source || typeof source.type !== 'string' || !source.type) err(`${label}.type が無い`);
      if (source?.url != null) validateUrl(`${label}.url`, source.url);
    });
  }
  if (!Array.isArray(sources.recommendations)) {
    err('CONFIG.sources.recommendations は配列であること');
    return;
  }
  sources.recommendations.forEach((source, index) => {
    const label = `CONFIG.sources.recommendations[${index}]`;
    if (!source || typeof source.id !== 'string' || !source.id) err(`${label}.id が無い`);
    for (const field of ['periodStart', 'periodEnd']) {
      if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(String(source?.[field] || ''))) {
        err(`${label}.${field} が YYYY-MM でない`);
      }
    }
    const urls = ['admissionUrl', 'discountUrl'].filter(field => source?.[field] != null);
    if (!urls.length) err(`${label}: admissionUrl または discountUrl が必要`);
    urls.forEach(field => validateUrl(`${label}.${field}`, source[field]));
  });
}

// checkedAt / source（出典）は任意。あれば形式を検証する。
function validateProvenance(label, obj) {
  if (obj.checkedAt != null) {
    if (!isDate(obj.checkedAt)) err(`${label}: checkedAt が日付でない ${obj.checkedAt}`);
    else if (obj.checkedAt > todayTokyo) err(`${label}: checkedAt が未来 ${obj.checkedAt}`);
    else if (daysBetween(obj.checkedAt, todayTokyo) > STALE_DAYS) warn(`${label}: checkedAt が古い（${obj.checkedAt}・${STALE_DAYS}日超、再確認推奨）`);
  }
  if (obj.source != null && !/^https?:\/\//.test(obj.source)) err(`${label}: source が URL でない ${obj.source}`);
  if (obj.checked_on != null) {
    if (!isDate(obj.checked_on)) err(`${label}: checked_on が日付でない ${obj.checked_on}`);
    else if (obj.checked_on > todayTokyo) err(`${label}: checked_on が未来 ${obj.checked_on}`);
    else if (daysBetween(obj.checked_on, todayTokyo) > STALE_DAYS) warn(`${label}: checked_on が古い（${obj.checked_on}・${STALE_DAYS}日超、再確認推奨）`);
  }
  if (obj.source_url != null) validateUrl(`${label}.source_url`, obj.source_url);
}

function validateRanges(key, ranges, where) {
  if (!Array.isArray(ranges) || !ranges.length) { err(`HOURS[${key}] ${where}: 時間帯が空です`); return; }
  for (const r of ranges) {
    if (!Array.isArray(r) || r.length !== 2 || !isTime(r[0]) || !isTime(r[1])) {
      err(`HOURS[${key}] ${where}: 時刻の形式が不正 ${JSON.stringify(r)}`); continue;
    }
    if (toMin(r[0]) >= toMin(r[1])) err(`HOURS[${key}] ${where}: 開館 >= 閉館 ${r[0]}-${r[1]}`);
  }
}

function validateHoursEntry(key, h, ctx) {
  if (h.seasons) {
    if (!Array.isArray(h.seasons) || !h.seasons.length) { err(`HOURS[${key}]: seasons が空`); return; }
    for (const s of h.seasons) {
      if (!/^\d{2}-\d{2}$/.test(s.from) || !/^\d{2}-\d{2}$/.test(s.to)) err(`HOURS[${key}]: season の from/to が MM-DD でない`);
      validateRanges(key, s.d, `season ${s.from}~${s.to}`);
    }
  } else if (h.d) {
    validateRanges(key, h.d, 'd');
  } else {
    err(`HOURS[${key}]: d も seasons も無い`);
  }
  if (h.w) {
    for (const dow of Object.keys(h.w)) {
      if (!/^[0-6]$/.test(dow)) err(`HOURS[${key}]: w の曜日キー "${dow}" は 0-6 でない`);
      validateRanges(key, h.w[dow], `w[${dow}]`);
    }
  }
  if (h.last != null && (typeof h.last !== 'number' || h.last < 0)) err(`HOURS[${key}]: last が不正 ${h.last}`);
  if (h.closedUntil != null) {
    if (!isDate(h.closedUntil)) err(`HOURS[${key}]: closedUntil が日付でない ${h.closedUntil}`);
    else if (h.closedUntil < todayTokyo) warn(`HOURS[${key}]: closedUntil ${h.closedUntil} は過去（再開済み → 削除推奨）`);
  }
  if (h.closedFrom != null) {
    if (!isDate(h.closedFrom)) err(`HOURS[${key}]: closedFrom が日付でない ${h.closedFrom}`);
    if (h.closedUntil != null && isDate(h.closedFrom) && isDate(h.closedUntil) && h.closedFrom > h.closedUntil) {
      err(`HOURS[${key}]: closedFrom が closedUntil より後です`);
    }
  }
  if (h.closedIndefinitely != null && typeof h.closedIndefinitely !== 'boolean') {
    err(`HOURS[${key}]: closedIndefinitely は boolean であること`);
  }
  if (h.closedIndefinitely && h.closedUntil) {
    err(`HOURS[${key}]: closedIndefinitely と closedUntil は同時に指定できない`);
  }
  if (h.closedIndefinitely && (!h.checkedAt || !h.source)) {
    err(`HOURS[${key}]: 無期限休館には checkedAt と source が必要`);
  }

  // 特定日の上書き（延長営業など）
  if (h.special != null) {
    if (!Array.isArray(h.special)) err(`HOURS[${key}]: special は配列であること`);
    else h.special.forEach((s, i) => {
      const at = `special[${i}]`;
      if (!Array.isArray(s.dates) || !s.dates.length) err(`HOURS[${key}] ${at}: dates が空`);
      else s.dates.forEach(d => {
        if (!isDate(d)) err(`HOURS[${key}] ${at}: 日付が不正 ${d}`);
        else if (ctx?.passEnd && d > ctx.passEnd) warn(`HOURS[${key}] ${at}: ${d} はパス終了日後（再生成漏れ？）`);
      });
      validateRanges(key, s.ranges, at);
      if (s.last != null && (typeof s.last !== 'number' || s.last < 0)) err(`HOURS[${key}] ${at}: last が不正 ${s.last}`);
    });
  }

  validateProvenance(`HOURS[${key}]`, h);
}

function validateTranslationText(label, value) {
  if (typeof value !== 'string' || !value.trim()) err(`${label}: 翻译值必须是非空字符串`);
}

function validateI18nOverlays(data, facilities) {
  const overlays = data.FACILITY_I18N || {};
  const locales = ['en', 'zh'];
  const facilityKeys = new Set(facilities.map(f => f._key));
  const areaNames = new Set((data.DATA || []).map(area => area.name));
  const makeContentKey = data.enrichedMetaKey || ((f, item) => `${f._key}::${item.url}::${item.title}`);
  const exhibitionKeys = new Set(facilities.flatMap(f => (f.enriched || []).map(item => makeContentKey(f, item))));

  for (const locale of locales) {
    const overlay = overlays[locale];
    if (!overlay || typeof overlay !== 'object') {
      err(`FACILITY_I18N.${locale}: overlay が無い`);
      continue;
    }

    for (const [areaName, translation] of Object.entries(overlay.areas || {})) {
      if (!areaNames.has(areaName)) err(`FACILITY_I18N.${locale}.areas の孤児キー: ${areaName}`);
      else validateTranslationText(`FACILITY_I18N.${locale}.areas[${areaName}]`, translation);
    }

    for (const [facilityKey, translation] of Object.entries(overlay.facilities || {})) {
      if (!facilityKeys.has(facilityKey)) {
        err(`FACILITY_I18N.${locale}.facilities の孤児キー: ${facilityKey}`);
        continue;
      }
      if (!translation || typeof translation !== 'object') {
        err(`FACILITY_I18N.${locale}.facilities[${facilityKey}]: オブジェクトでない`);
        continue;
      }
      for (const [field, value] of Object.entries(translation)) {
        if (field === 'name' || field === 'admission_label' || field === 'benefit_basis') {
          validateTranslationText(`FACILITY_I18N.${locale}.facilities[${facilityKey}].${field}`, value);
        } else if (['closed', 'fee', 'access', 'notes', 'schedule_lines', 'pass_notes'].includes(field)) {
          if (!Array.isArray(value) && typeof value !== 'string') err(`FACILITY_I18N.${locale}.facilities[${facilityKey}].${field}: 文字列または配列でない`);
        }
      }
    }

    for (const [contentKey, translation] of Object.entries(overlay.exhibitions || {})) {
      if (!exhibitionKeys.has(contentKey)) {
        err(`FACILITY_I18N.${locale}.exhibitions の孤児キー: ${contentKey}`);
        continue;
      }
      if (!translation || typeof translation !== 'object') {
        err(`FACILITY_I18N.${locale}.exhibitions[${contentKey}]: オブジェクトでない`);
        continue;
      }
      for (const field of ['title', 'summary', 'notice']) {
        if (translation[field] != null) validateTranslationText(`FACILITY_I18N.${locale}.exhibitions[${contentKey}].${field}`, translation[field]);
      }
      if (translation.fields != null) {
        if (!translation.fields || typeof translation.fields !== 'object' || Array.isArray(translation.fields)) {
          err(`FACILITY_I18N.${locale}.exhibitions[${contentKey}].fields: オブジェクトでない`);
        } else {
          for (const [field, value] of Object.entries(translation.fields))
            validateTranslationText(`FACILITY_I18N.${locale}.exhibitions[${contentKey}].fields.${field}`, value);
        }
      }
    }
  }
}

function validateSearchIndex(data, facilities) {
  const config = data.SEARCH_INDEX_CONFIG;
  if (!config || typeof config !== 'object') {
    err('SEARCH_INDEX_CONFIG: 搜索词典不存在');
    return;
  }

  if (!Array.isArray(config.tokenAliases)) {
    err('SEARCH_INDEX_CONFIG.tokenAliases: 必须是数组');
  } else {
    config.tokenAliases.forEach((rule, index) => {
      const label = `SEARCH_INDEX_CONFIG.tokenAliases[${index}]`;
      const tokens = Array.isArray(rule?.tokens) ? rule.tokens : [rule?.token];
      if (!tokens.length || tokens.some(token => typeof token !== 'string' || !token.trim()))
        err(`${label}.tokens: 必须包含非空字符串`);
      if (!Array.isArray(rule?.aliases) || !rule.aliases.length || rule.aliases.some(alias => typeof alias !== 'string' || !alias.trim()))
        err(`${label}.aliases: 必须包含非空字符串数组`);
    });
  }

  const facilityKeys = new Set(facilities.map(f => String(f._key)));
  const aliases = config.facilityAliases;
  if (!aliases || typeof aliases !== 'object' || Array.isArray(aliases)) {
    err('SEARCH_INDEX_CONFIG.facilityAliases: 必须是对象');
    return;
  }
  for (const [key, values] of Object.entries(aliases)) {
    if (!facilityKeys.has(String(key))) err(`SEARCH_INDEX_CONFIG.facilityAliases の孤児キー: ${key}`);
    if (!Array.isArray(values) || !values.length || values.some(value => typeof value !== 'string' || !value.trim()))
      err(`SEARCH_INDEX_CONFIG.facilityAliases[${key}]: 必须包含非空字符串数组`);
  }
  for (const key of facilityKeys) {
    if (!Object.prototype.hasOwnProperty.call(aliases, key))
      err(`SEARCH_INDEX_CONFIG.facilityAliases 缺少设施: ${key}`);
  }
}

function comparableUrl(url) {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname.replace(/\/+$/, '') || '/';
    return `${parsed.protocol}//${parsed.host}${pathname}${parsed.search}`;
  } catch {
    return String(url || '');
  }
}

function validateExhibitionLinks(data, facilities) {
  const links = data.EXHIBITION_LINKS || {};
  const facilityMap = new Map(facilities.map(f => [String(f._key || f.no), f]));

  for (const [facilityKey, entries] of Object.entries(links)) {
    const facility = facilityMap.get(String(facilityKey));
    if (!facility) {
      err(`EXHIBITION_LINKS の孤児施設キー: ${facilityKey}`);
      continue;
    }
    if (!entries || typeof entries !== 'object' || Array.isArray(entries)) {
      err(`EXHIBITION_LINKS[${facilityKey}]: オブジェクトでない`);
      continue;
    }
    const items = new Set((facility.enriched || []).map(item => item.title));
    for (const [title, url] of Object.entries(entries)) {
      if (!items.has(title)) err(`EXHIBITION_LINKS[${facilityKey}] の孤児タイトル: ${title}`);
      if (url !== null) validateUrl(`EXHIBITION_LINKS[${facilityKey}][${title}]`, url);
      if (url && (facility.urls || []).some(home => comparableUrl(home) === comparableUrl(url)))
        err(`EXHIBITION_LINKS[${facilityKey}][${title}]: 施設ホームページを特展リンクとして指定している`);
    }
  }

  for (const facility of facilities) {
    for (const item of facility.enriched || []) {
      const isFacilityHomepage = item?.url && (facility.urls || []).some(home => comparableUrl(home) === comparableUrl(item.url));
      if (!isFacilityHomepage) continue;
      const entries = links[String(facility._key || facility.no)] || {};
      if (!Object.prototype.hasOwnProperty.call(entries, item.title))
        err(`DATA[${facility._key}].enriched[${item.title}]: 施設ホームページURLには特展リンク上書きが必要`);
    }
  }
}

const SOURCE_SCOPES = ['edition', 'facility'];

/*
 * Page locators are what turn a 20-page PDF link into a usable citation, so a
 * malformed one is an ERROR rather than a cosmetic issue: a page past the end of
 * the document sends the reader somewhere that does not exist, and an orphan key
 * means a facility silently lost its citation.
 */
function validateSourcePages(data, facilities) {
  const keySet = new Set(facilities.map(f => f._key));
  const documents = data.SOURCE_PAGE_DOCUMENTS || {};
  for (const [name, document] of Object.entries(documents)) {
    const label = `SOURCE_PAGE_DOCUMENTS[${name}]`;
    validateUrl(`${label}.url`, document?.url);
    if (!Number.isInteger(document?.page_count) || document.page_count <= 0)
      err(`${label}.page_count が正の整数でない: ${document?.page_count}`);
    if (document?.checked_at != null && !isDate(document.checked_at))
      err(`${label}.checked_at が日付でない: ${document.checked_at}`);
  }
  for (const [name, table] of Object.entries(data.FACILITY_SOURCE_PAGES || {})) {
    const document = documents[name];
    if (!document) { err(`FACILITY_SOURCE_PAGES[${name}]: SOURCE_PAGE_DOCUMENTS に未登録`); continue; }
    for (const [key, page] of Object.entries(table || {})) {
      const label = `FACILITY_SOURCE_PAGES[${name}][${key}]`;
      if (!keySet.has(key)) err(`${label}: DATA に無い施設キー`);
      if (!Number.isInteger(page) || page <= 0) { err(`${label}: 1以上の整数でない: ${page}`); continue; }
      if (page > document.page_count)
        err(`${label}: ページ ${page} が総ページ数 ${document.page_count} を超えている（PDF差し替えの可能性）`);
    }
  }
  // The brochure's locators live in data/facility-brochure.js; check them against
  // the same recorded page count so the two homes cannot drift apart.
  const brochure = data.FACILITY_BROCHURE;
  const brochureDoc = Object.values(documents).find(entry => entry?.url === brochure?.metadata?.source);
  if (brochure && brochureDoc) {
    for (const [key, card] of Object.entries(brochure.cards || {})) {
      const page = card?.sourcePage;
      if (page == null) continue;
      const label = `FACILITY_BROCHURE.cards[${key}].sourcePage`;
      if (!Number.isInteger(page) || page <= 0) { err(`${label}: 1以上の整数でない: ${page}`); continue; }
      if (page > brochureDoc.page_count)
        err(`${label}: ページ ${page} が総ページ数 ${brochureDoc.page_count} を超えている`);
    }
  }
}

/*
 * Facility Introduction coverage.
 *
 * The Introduction renders approved product copy or nothing at all — there is no
 * longer a path by which the official brochure's prose can stand in for it. That
 * makes a missing approved summary invisible in the UI: the section just is not
 * there. So it has to be loud here instead.
 *
 * Venue-level, not card-level: the combined card carries two venues and needs
 * two approved records, and the renderer pairs them with the brochure's
 * subfacility order positionally.
 */
function validateIntroductionCoverage(data, facilities) {
  const summaries = data.FACILITY_PRODUCT_SUMMARIES;
  if (!summaries?.entries) { err('FACILITY_PRODUCT_SUMMARIES が読み込めていない'); return; }
  const cards = data.FACILITY_BROCHURE?.cards || {};
  const byFacility = new Map();
  for (const entry of summaries.entries) {
    const group = byFacility.get(entry.facility_key) || [];
    group.push(entry);
    byFacility.set(entry.facility_key, group);
  }
  for (const facility of facilities) {
    const key = facility._key;
    const card = cards[key];
    const expected = card?.subfacilities?.length || 1;
    const approved = byFacility.get(key) || [];
    if (!approved.length) {
      err(`FACILITY_PRODUCT_SUMMARIES: ${key} (No.${facility.no} ${facility.name}) に承認済み施設紹介がない — 紹介セクションは非表示になる（ブローシュア本文へのフォールバックは廃止済み）`);
      continue;
    }
    if (approved.length !== expected)
      err(`FACILITY_PRODUCT_SUMMARIES: ${key} は ${expected} 会場に対して ${approved.length} 件 — 会場数と一致しない`);
    approved.forEach(entry => {
      for (const locale of ['ja', 'en', 'zh']) {
        const text = entry.summary?.[locale];
        if (typeof text !== 'string' || !text.trim())
          err(`FACILITY_PRODUCT_SUMMARIES: ${entry.venue_key} の ${locale} 紹介文が空`);
      }
    });
  }
  const orphans = summaries.entries
    .map(entry => entry.facility_key)
    .filter(key => !facilities.some(facility => facility._key === key));
  for (const key of new Set(orphans)) err(`FACILITY_PRODUCT_SUMMARIES: 施設 ${key} は DATA に存在しない`);
}

function validateOfficialSources(data, facilities) {
  const authorities = data.OFFICIAL_SOURCE_AUTHORITIES || [];
  const pageTypes = data.OFFICIAL_SOURCE_PAGE_TYPES || [];
  const relations = data.OFFICIAL_SOURCE_RELATIONS || [];
  const confidences = data.OFFICIAL_SOURCE_CONFIDENCE || [];
  const keySet = new Set(facilities.map(f => f._key));

  const validateRecord = (label, record) => {
    if (!record || typeof record !== 'object') { err(`${label}: オブジェクトでない`); return; }
    if (record.url == null) err(`${label}.url が無い`);
    else validateUrl(`${label}.url`, record.url);
    if (record.authority != null && !authorities.includes(record.authority)) err(`${label}.authority が不正: ${record.authority}`);
    if (record.page_type != null && !pageTypes.includes(record.page_type)) err(`${label}.page_type が不正: ${record.page_type}`);
    if (record.relation != null && !relations.includes(record.relation)) err(`${label}.relation が不正: ${record.relation}`);
    if (record.confidence != null && !confidences.includes(record.confidence)) err(`${label}.confidence が不正: ${record.confidence}`);
    if (record.confirms_pass_entitlement != null && typeof record.confirms_pass_entitlement !== 'boolean')
      err(`${label}.confirms_pass_entitlement が boolean でない`);
    if (record.applicable_year != null && !(Number.isInteger(record.applicable_year) && record.applicable_year >= 2000 && record.applicable_year <= 2100))
      err(`${label}.applicable_year が不正: ${record.applicable_year}`);
    if (record.checked_at != null && !isDate(record.checked_at)) err(`${label}.checked_at が日付でない: ${record.checked_at}`);
    // Arbitration metadata. A malformed published_at would silently make a newer
    // record lose (or win) the entitlement-evidence pick, so it is an ERROR.
    if (record.source_scope != null && !SOURCE_SCOPES.includes(record.source_scope))
      err(`${label}.source_scope が不正: ${record.source_scope}`);
    if (record.published_at != null && !isDate(record.published_at))
      err(`${label}.published_at が日付でない: ${record.published_at}`);
    if (record.supersedes != null) {
      if (!Array.isArray(record.supersedes)) err(`${label}.supersedes が配列でない`);
      else record.supersedes.forEach((url, i) => validateUrl(`${label}.supersedes[${i}]`, url));
    }
    // A record that claims to confirm the entitlement must actually be allowed to.
    if (record.confirms_pass_entitlement === true && record.relation === 'context_confirmation')
      err(`${label}: context_confirmation は Pass entitlement を証明できない (confirms_pass_entitlement=true)`);
  };

  (data.FACILITY_OFFICIAL_GLOBAL_SOURCES || []).forEach((record, i) => validateRecord(`FACILITY_OFFICIAL_GLOBAL_SOURCES[${i}]`, record));
  for (const [key, records] of Object.entries(data.FACILITY_OFFICIAL_SOURCES || {})) {
    if (!keySet.has(key)) err(`FACILITY_OFFICIAL_SOURCES の孤児施設キー: ${key}`);
    if (!Array.isArray(records)) { err(`FACILITY_OFFICIAL_SOURCES[${key}]: 配列でない`); continue; }
    if (!records.length) err(`FACILITY_OFFICIAL_SOURCES[${key}]: 空配列`);
    const seen = new Set();
    records.forEach((record, i) => {
      const label = `FACILITY_OFFICIAL_SOURCES[${key}][${i}]`;
      validateRecord(label, record);
      // The registry dedupes by URL at read time, so two records for one URL means
      // one of the two roles is silently discarded.
      const url = String(record?.url || '').replace(/\/+$/, '');
      if (url && seen.has(url)) err(`${label}: 同一施設内で URL 重複 (${url})`);
      seen.add(url);
    });
  }
}

const PASS_TIME_SCOPE_CLASSIFICATIONS = ['persistent', 'exhibition_scoped', 'named_exhibition_scoped', 'explicit_date_scoped', 'other_conditional'];
const PASS_TIME_SCOPE_MODES = ['explicit_period', 'enumerated_exhibitions', 'eligible_exhibitions', 'awaiting_schedule'];

function validatePassTimeScope(data, facilities) {
  const keySet = new Set(facilities.map(f => f._key));
  const scope = data.FACILITY_PASS_TIME_SCOPE || {};
  const meta = data.FACILITY_PASS_TIME_SCOPE_META || {};
  const sources = data.FACILITY_PASS_TIME_SCOPE_SOURCES || {};
  for (const [ref, source] of Object.entries(sources)) {
    const label = `FACILITY_PASS_TIME_SCOPE_SOURCES[${ref}]`;
    if (!source || typeof source !== 'object') { err(`${label}: オブジェクトでない`); continue; }
    validateUrl(`${label}.url`, source.url);
    if (!isDate(source.published_at)) err(`${label}.published_at が日付でない: ${source.published_at}`);
    if (typeof source.is_exhaustive !== 'boolean') err(`${label}.is_exhaustive が boolean でない`);
  }
  if (meta.snapshot_as_of != null && !/^\d{4}-\d{2}$/.test(meta.snapshot_as_of))
    err(`FACILITY_PASS_TIME_SCOPE_META.snapshot_as_of が YYYY-MM でない: ${meta.snapshot_as_of}`);
  if (meta.source_checked_at != null && !isDate(meta.source_checked_at))
    err(`FACILITY_PASS_TIME_SCOPE_META.source_checked_at が日付でない: ${meta.source_checked_at}`);

  for (const [key, record] of Object.entries(scope)) {
    const label = `FACILITY_PASS_TIME_SCOPE[${key}]`;
    if (!keySet.has(key)) { err(`${label}: DATA に無い施設キー`); continue; }
    if (!record || typeof record !== 'object') { err(`${label}: オブジェクトでない`); continue; }
    if (record.classification != null && !PASS_TIME_SCOPE_CLASSIFICATIONS.includes(record.classification))
      err(`${label}.classification が不正: ${record.classification}`);
    if (record.admission_time_scoped != null && typeof record.admission_time_scoped !== 'boolean')
      err(`${label}.admission_time_scoped が boolean でない`);
    if (record.entitlement_mode != null && !PASS_TIME_SCOPE_MODES.includes(record.entitlement_mode))
      err(`${label}.entitlement_mode が不正: ${record.entitlement_mode}`);
    if (record.schedule_is_exhaustive != null && typeof record.schedule_is_exhaustive !== 'boolean')
      err(`${label}.schedule_is_exhaustive が boolean でない`);
    // A record may only claim its schedule is exhaustive when it quotes the
    // wording that closes the set. Without it, a window end is an exhibition end.
    if (record.schedule_is_exhaustive === true && !String(record.boundary_wording || '').trim())
      err(`${label}: schedule_is_exhaustive=true には boundary_wording（対象期間を明示する原文）が必要`);
    if (record.admission_time_scoped === true && !record.entitlement_baseline)
      err(`${label}: entitlement_baseline（施設レベルの給付名）が無い`);
    if (Array.isArray(record.windows)) {
      const seen = new Set();
      record.windows.forEach((w, i) => {
        if (!w || !isDate(w.valid_from)) err(`${label}.windows[${i}].valid_from が日付でない: ${w?.valid_from}`);
        if (!w || !isDate(w.valid_to)) err(`${label}.windows[${i}].valid_to が日付でない: ${w?.valid_to}`);
        if (w && isDate(w.valid_from) && isDate(w.valid_to) && w.valid_from > w.valid_to)
          err(`${label}.windows[${i}]: valid_from > valid_to`);
        // Two identical windows mean one source was folded in twice; the second
        // adds no evidence but doubles the apparent corroboration.
        const span = `${w?.valid_from}..${w?.valid_to}`;
        if (seen.has(span)) err(`${label}.windows[${i}]: 期間の重複定義 (${span})`);
        seen.add(span);
        // Every window must name the source that confirms it, and that source
        // must exist — this is what stops malformed newer evidence entering the
        // runtime as an anonymous date.
        const ref = String(w?.source_ref || '');
        if (!ref) err(`${label}.windows[${i}].source_ref が無い`);
        else if (!sources[ref]) err(`${label}.windows[${i}].source_ref が未登録: ${ref}`);
        (w?.corroborated_by || []).forEach(c => {
          if (!sources[c]) err(`${label}.windows[${i}].corroborated_by が未登録: ${c}`);
        });
        if (w?.supersedes != null && !sources[w.supersedes])
          err(`${label}.windows[${i}].supersedes が未登録: ${w.supersedes}`);
      });
    }
  }
}

function printI18nReport(data, facilities) {
  const makeContentKey = data.enrichedMetaKey || ((f, item) => `${f._key}::${item.url}::${item.title}`);
  const enrichedItems = facilities.flatMap(f => (f.enriched || []).map(item => makeContentKey(f, item)));
  const brochureCards = data.FACILITY_BROCHURE?.cards || {};
  console.log('');
  console.log('i18n 覆盖率（手动 overlay 的填写量，不等于用户看到的覆盖率）');
  console.log('  ※ 展览标题/概要按方针刻意保留日文（每月更新、链接为日文，UI 已标注「日文」），低数值是预期而非缺口');
  for (const locale of ['en', 'zh']) {
    const overlay = data.FACILITY_I18N?.[locale] || {};
    const names = facilities.filter(f => typeof overlay.facilities?.[f._key]?.name === 'string').length;
    const titles = enrichedItems.filter(key => typeof overlay.exhibitions?.[key]?.title === 'string').length;
    const summaries = enrichedItems.filter(key => typeof overlay.exhibitions?.[key]?.summary === 'string').length;
    const areas = (data.DATA || []).filter(area => typeof overlay.areas?.[area.name] === 'string').length;
    // Introduction coverage is product copy, not brochure translations: the
    // brochure's prose stopped shipping on 2026-08-17, so counting it here
    // would report a number no reader can ever see.
    const summaryEntries = data.FACILITY_PRODUCT_SUMMARIES?.entries || [];
    const intros = facilities.filter(f => {
      const approved = summaryEntries.filter(entry => entry.facility_key === f._key);
      return approved.length > 0 && approved.every(entry => typeof entry.summary?.[locale] === 'string' && entry.summary[locale].trim());
    }).length;
    console.log(`  ${locale}: 区域 ${areas}/${data.DATA?.length || 0} · 馆名 ${names}/${facilities.length} · 简介 ${intros}/${facilities.length} · 展览标题 ${titles}/${enrichedItems.length} · 概要 ${summaries}/${enrichedItems.length}`);
  }
  // The manual overlay is not what the user sees: English facility names fall
  // back to the official brochure `nameEn`, so effective name coverage is far
  // higher than the overlay count above. Report it so the overlay number is
  // never mistaken for a user-visible gap (it was, once).
  const effectiveEnNames = facilities.filter(f => {
    const overlayName = data.FACILITY_I18N?.en?.facilities?.[f._key]?.name;
    return typeof overlayName === 'string' || typeof brochureCards[f._key]?.nameEn === 'string';
  }).length;
  console.log(`  en 馆名 实际覆盖率: ${effectiveEnNames}/${facilities.length}（overlay + 官方手册 nameEn）`);
  console.log('  zh 馆名: 未翻译部分按方针显示日文专名（chineseFacilityName）');
}

// --- 本体 -----------------------------------------------------------------
function run(data) {
  const { CONFIG, HOLIDAYS, DATA, HOURS, COORDS, EXHIBITION_META, enrichedMetaKey, getEnrichedMeta } = data;

  // CONFIG
  if (!isDate(CONFIG.passEnd)) err(`CONFIG.passEnd が日付でない: ${CONFIG.passEnd}`);
  if (typeof CONFIG.year !== 'number') err(`CONFIG.year が数値でない`);
  if (!Number.isInteger(CONFIG.facilityCount) || CONFIG.facilityCount < 1) err(`CONFIG.facilityCount が正の整数でない`);
  if (!Number.isInteger(CONFIG.catalogNumberCount) || CONFIG.catalogNumberCount < 1) err(`CONFIG.catalogNumberCount が正の整数でない`);
  validateFooterSources(CONFIG.sources);
  if (!Array.isArray(CONFIG.sourcePolicy) || CONFIG.sourcePolicy.length < 3 || CONFIG.sourcePolicy.some(s => !s || !s.label || (s.url != null && !/^https?:\/\//.test(s.url))))
    err(`CONFIG.sourcePolicy は {label,url|null} の配列であること`);

  // DATA / facilities
  const facilities = DATA.flatMap(a => a.facilities || []);
  const expectedFacilities = CONFIG.facilityCount;
  if (facilities.length !== expectedFacilities)
    warn(`施設カード数 ${facilities.length}（想定 ${expectedFacilities}）。意図した増減なら config.js の facilityCount を更新`);
  const uniqueNumbers = new Set(facilities.map(f => String(f.no))).size;
  if (uniqueNumbers !== CONFIG.catalogNumberCount)
    warn(`公式番号数 ${uniqueNumbers}（想定 ${CONFIG.catalogNumberCount}）。重複番号を意図した増減なら config.js を更新`);

  const keys = facilities.map(f => f._key);
  const seen = new Set();
  for (const f of facilities) {
    if (!f._key) { err(`_key の無い施設: ${f.name || '(no name)'}`); continue; }
    if (seen.has(f._key)) err(`_key 重複: ${f._key}`);
    seen.add(f._key);
    if (!f.name) warn(`施設 ${f._key}: name が無い`);
  }
  const keySet = new Set(keys);
  const matchedMetaKeys = new Set();

  validateI18nOverlays(data, facilities);
  validateSearchIndex(data, facilities);
  validateExhibitionLinks(data, facilities);
  validateOfficialSources(data, facilities);
  validateSourcePages(data, facilities);
  validateIntroductionCoverage(data, facilities);
  validatePassTimeScope(data, facilities);

  // 展覧会情報: 会期を持たない項目も許容するが、画面上で「会期未確認」と明示し、
  // 月次更新時に WARN として拾えるようにする。
  for (const f of facilities) {
    if (f.enriched != null) {
      if (!Array.isArray(f.enriched)) {
        err(`DATA[${f._key}].enriched が配列でない`);
      } else {
        for (const [i, item] of f.enriched.entries()) {
          const label = `DATA[${f._key}].enriched[${i}]`;
          if (!item || typeof item !== 'object') { err(`${label}: オブジェクトでない`); continue; }
          if (!item.title) err(`${label}: title が無い`);
          if (!item.url || !/^https?:\/\//.test(item.url)) err(`${label}: url が公式 URL でない`);
          validateProvenance(label, item);
          const metaKey = enrichedMetaKey(f, item);
          if (Object.prototype.hasOwnProperty.call(EXHIBITION_META, metaKey)) matchedMetaKeys.add(metaKey);
          const meta = getEnrichedMeta(f, item);
          if (meta.validFrom != null && !isDate(meta.validFrom)) err(`${label}: validFrom が日付でない ${meta.validFrom}`);
          if (meta.validTo != null && !isDate(meta.validTo)) err(`${label}: validTo が日付でない ${meta.validTo}`);
          if (isDate(meta.validFrom) && isDate(meta.validTo) && meta.validFrom > meta.validTo)
            err(`${label}: validFrom > validTo (${meta.validFrom} > ${meta.validTo})`);
          if (meta.dateState === 'unknown') warn(`${label}: 会期未確認（画面では明示表示）`);
        }
      }
    }
    validateUrlList(`DATA[${f._key}].urls`, f.urls);
    validateUrlList(`DATA[${f._key}].exhibition_sources`, f.exhibition_sources);
    if (f.exhibition_check) validateProvenance(`DATA[${f._key}].exhibition_check`, f.exhibition_check);
  }

  for (const key of Object.keys(EXHIBITION_META)) {
    if (!matchedMetaKeys.has(key)) err(`EXHIBITION_META の孤児キー（DATA の enriched に一致しない）: ${key}`);
  }

  // キー整合性: DATA ↔ HOURS ↔ COORDS
  for (const k of keys) {
    if (!(k in HOURS)) warn(`施設 ${k}: HOURS が無い（画面では「時間未確認」表示）`);
    if (!(k in COORDS)) warn(`施設 ${k}: COORDS が無い（地図に出ない）`);
  }
  for (const k of Object.keys(HOURS)) if (!keySet.has(k)) warn(`HOURS の孤児キー（DATA に無い）: ${k}`);
  for (const k of Object.keys(COORDS)) if (!keySet.has(k)) warn(`COORDS の孤児キー（DATA に無い）: ${k}`);

  // HOURS 構造
  const hoursCtx = { passEnd: CONFIG.passEnd };
  for (const k of Object.keys(HOURS)) validateHoursEntry(k, HOURS[k], hoursCtx);

  // COORDS 値（日本の緯度経度 bbox 内か）
  for (const [k, v] of Object.entries(COORDS)) {
    if (!Array.isArray(v) || v.length !== 2 || v.some(n => typeof n !== 'number' || Number.isNaN(n))) {
      err(`COORDS[${k}]: [lat, lon] の数値ペアでない ${JSON.stringify(v)}`); continue;
    }
    const [lat, lon] = v;
    if (lat < 24 || lat > 46 || lon < 122 || lon > 146)
      err(`COORDS[${k}]: 日本の範囲外 (${lat}, ${lon})`);
  }

  // HOLIDAYS
  for (const d of HOLIDAYS) if (!isDate(d)) err(`HOLIDAYS: 日付の形式が不正 ${d}`);

  // パス期間が跨ぐ各年の祝日が登録されているか
  if (typeof CONFIG.year === 'number' && isDate(CONFIG.passEnd)) {
    const y0 = CONFIG.year, y1 = Number(CONFIG.passEnd.slice(0, 4));
    const years = new Set([...HOLIDAYS].map(d => d.slice(0, 4)));
    for (let y = y0; y <= y1; y++)
      if (!years.has(String(y))) warn(`祝日: ${y} 年の祝日が data/holidays.js に無い（パス期間が ${y} 年を含む）`);
  }

  return { facilities };
}

// --- リンク死活（opt-in・warn のみ） --------------------------------------
async function checkLinks(data) {
  const urls = new Set();
  for (const f of data.facilities) {
    (f.urls || []).forEach(u => urls.add(u));
    (f.enriched || []).forEach(e => e && e.url && urls.add(e.url));
  }
  const sourceGroups = data.CONFIG?.sources || {};
  [...(sourceGroups.core || []), ...(sourceGroups.exhibitions || [])]
    .forEach(s => s && s.url && urls.add(s.url));
  (sourceGroups.recommendations || []).forEach(s => {
    if (s?.admissionUrl) urls.add(s.admissionUrl);
    if (s?.discountUrl) urls.add(s.discountUrl);
  });
  (data.CONFIG?.sourcePolicy || []).forEach(s => s && s.url && urls.add(s.url));
  for (const f of data.facilities) {
    (f.exhibition_sources || []).forEach(u => urls.add(u));
    if (f.exhibition_check?.source_url) urls.add(f.exhibition_check.source_url);
  }
  for (const entries of Object.values(data.EXHIBITION_LINKS || {})) {
    for (const url of Object.values(entries || {})) if (url) urls.add(url);
  }
  const list = [...urls].filter(u => /^https?:\/\//.test(u));
  process.stdout.write(`\nリンク死活チェック: ${list.length} 件 …\n`);

  const pool = 8;
  let i = 0;
  async function one(url) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 12000);
      let res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: ctrl.signal });
      if (res.status === 405 || res.status === 501) // HEAD 非対応 → GET で再試行
        res = await fetch(url, { method: 'GET', redirect: 'follow', signal: ctrl.signal });
      clearTimeout(t);
      if (res.status >= 400) warn(`リンク ${res.status}: ${url}`);
    } catch (e) {
      warn(`リンク到達不可（${e.name === 'AbortError' ? 'timeout' : e.code || e.message}）: ${url}`);
    }
  }
  const workers = Array.from({ length: pool }, async () => {
    while (i < list.length) await one(list[i++]);
  });
  await Promise.all(workers);
}

// --- 実行 -----------------------------------------------------------------
(async () => {
  const data = loadData();
  const { facilities } = run(data);
  data.facilities = facilities;

  if (process.argv.includes('--check-links')) await checkLinks(data);
  if (process.argv.includes('--i18n-report')) printI18nReport(data, facilities);

  console.log('');
  warns.forEach(w => console.log(`  ⚠ WARN  ${w}`));
  errors.forEach(e => console.log(`  ✗ ERROR ${e}`));
  console.log('');
  console.log(`施設 ${facilities.length} 件 / ERROR ${errors.length} / WARN ${warns.length}`);
  if (errors.length) { console.log('❌ 検証失敗'); process.exit(1); }
  console.log('✅ 検証OK' + (warns.length ? '（WARN あり）' : ''));
})();
