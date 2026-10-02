// Executable runtime consuming data/exhibition-meta.js; load the data file first.

const makeEnrichedMetaKey = (facilityKey, url, title) => `${facilityKey}::${url}::${title}`;

function normalizeExhibitionTitle(text) {
  return String(text || '')
    .replace(/[髙﨑]/g, c => c === '髙' ? '高' : '崎')
    .replace(/[\s「」『』【】（）()［］\[\]"'“”‘’.,，:：・、…—–―ー〜～~／/?!？！]/g, '')
    .replace(/特別展|企画展|特集展示|特集|コレクション展|コレクション|展示|展/g, '')
    .toLowerCase();
}

function parseExhibitionDateTokens(text) {
  const tokens = [];
  // 年月日、YYYY/M/D、M/D、YYYY年M/D を同じ形式にそろえる。
  const re = /(?:(\d{2,4})[年\/]\s*)?(\d{1,2})(?:\/|月\s*)(\d{1,2})日?/g;
  let match;
  while ((match = re.exec(String(text || '')))) {
    let year = match[1] == null ? null : Number(match[1]);
    if (year != null && year < 100) year += 2000;
    tokens.push({ year, month: Number(match[2]), day: Number(match[3]) });
  }
  return tokens;
}

function exhibitionIso(year, month, day) {
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function parseExhibitionDateRanges(line) {
  const text = String(line || '');
  const tokens = parseExhibitionDateTokens(text);
  // A year omitted from a schedule line belongs to the configured Pass
  // edition. Do not make date inference vary with the machine's wall clock.
  const configuredYear = typeof CONFIG !== 'undefined' ? Number(CONFIG.year) : NaN;
  const baseYear = Number.isInteger(configuredYear) ? configuredYear : null;
  const ranges = [];

  for (let i = 0; i + 1 < tokens.length; i += 2) {
    const start = tokens[i];
    const end = tokens[i + 1];
    if (start.year == null && baseYear == null) continue;
    const startYear = start.year == null ? baseYear : start.year;
    let endYear = end.year == null ? startYear : end.year;
    if (end.year == null && (end.month < start.month || (end.month === start.month && end.day < start.day))) endYear += 1;
    ranges.push({
      from: exhibitionIso(startYear, start.month, start.day),
      to: exhibitionIso(endYear, end.month, end.day)
    });
  }

  if (!ranges.length && tokens.length === 1 && baseYear != null && /(?:開催中|上映中|実施中|開催予定)/.test(text)) {
    const end = tokens[0];
    ranges.push({ from: null, to: exhibitionIso(end.year == null ? baseYear : end.year, end.month, end.day) });
  }
  if (!ranges.length && /通年/.test(text)) ranges.push({ from: null, to: null, permanent: true });
  return ranges;
}

function scheduleLineHasDate(line) {
  return parseExhibitionDateTokens(line).length > 0 || /通年|開催中|上映中|実施中/.test(String(line || ''));
}

function exhibitionScheduleEntries(facility) {
  const lines = facility?.schedule_lines || [];
  const entries = [];
  lines.forEach((line, index) => {
    const ranges = parseExhibitionDateRanges(line);
    if (!ranges.length) return;
    const candidates = [line];
    for (let i = index - 1; i >= Math.max(0, index - 3); i -= 1) {
      const candidate = String(lines[i] || '').trim();
      if (candidate && !scheduleLineHasDate(candidate) && !/^※|^\*/.test(candidate)) candidates.push(candidate);
    }
    candidates.forEach(title => entries.push({ title, ranges }));
  });
  return entries;
}

function exhibitionTitleScore(itemTitle, scheduleTitle) {
  const item = normalizeExhibitionTitle(itemTitle);
  const schedule = normalizeExhibitionTitle(scheduleTitle);
  if (item.length < 4 || schedule.length < 4) return 0;
  if (item.includes(schedule) || schedule.includes(item)) return Math.min(item.length, schedule.length);
  const chunks = item.match(/.{4}/g) || [];
  return chunks.filter(chunk => schedule.includes(chunk)).length * 4;
}

function inferExhibitionRanges(facility, item) {
  let bestScore = 0;
  let best = null;
  for (const entry of exhibitionScheduleEntries(facility)) {
    const score = exhibitionTitleScore(item?.title, entry.title);
    if (score > bestScore) {
      bestScore = score;
      best = entry.ranges;
    }
  }
  return bestScore >= 4 ? best : [];
}

function enrichedMetaKey(facility, item) {
  return makeEnrichedMetaKey(facility?._key || facility?.no || '', item?.url || '', item?.title || '');
}

function getEnrichedMeta(facility, item) {
  const explicit = EXHIBITION_META[enrichedMetaKey(facility, item)] || {};
  const inferred = inferExhibitionRanges(facility, item);
  const ranges = explicit.validFrom || explicit.validTo
    ? [{ from: explicit.validFrom || null, to: explicit.validTo || null }]
    : inferred;
  const validFrom = ranges.length ? ranges.reduce((value, range) => value == null || (range.from != null && range.from < value) ? range.from : value, null) : null;
  const validTo = ranges.length ? ranges.reduce((value, range) => value == null || (range.to != null && range.to > value) ? range.to : value, null) : null;
  return {
    ...explicit,
    validFrom,
    validTo,
    dateState: explicit.dateState || (validFrom || validTo ? 'dated' : ranges.some(range => range.permanent) ? 'permanent' : 'unknown'),
    sourceRole: explicit.sourceRole || item?.sourceRole || 'facility-site',
    sourceUrl: explicit.sourceUrl || item?.sourceUrl || item?.url || facility?.exhibition_check?.source_url || facility?.urls?.[0] || ''
  };
}

// 料金・注意事項の修正はここで DATA に反映する。これにより、画面表示だけでなく
// お得度計算など DATA を読む処理にも同じ補正が適用される。
function applyExhibitionMeta() {
  if (typeof DATA === 'undefined') return;
  DATA.forEach(area => (area.facilities || []).forEach(facility => {
    (facility.enriched || []).forEach(item => {
      const explicit = EXHIBITION_META[enrichedMetaKey(facility, item)];
      if (!explicit) return;
      if (explicit.fields) item.fields = { ...(item.fields || {}), ...explicit.fields };
      if (explicit.notice) item.notice = explicit.notice;
      if (explicit.dateState) item.dateState = explicit.dateState;
      if (explicit.sourceUrl) item.sourceUrl = explicit.sourceUrl;
      if (explicit.validFrom) item.validFrom = explicit.validFrom;
      if (explicit.validTo) item.validTo = explicit.validTo;
      if (explicit.checkedAt) item.checkedAt = explicit.checkedAt;
    });
  }));
}

applyExhibitionMeta();
