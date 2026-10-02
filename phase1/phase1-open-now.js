/* ============================================================================
   Phase 1 ランタイム：「いま開いているか」判定
   hours-draft.js の HOURS 定義の直後に貼り付けてください。
   既存の checkStatus()（休館日判定）はそのまま使い、その上に時刻の層を重ねます。
   ========================================================================== */

// 最終入館の既定値（分）。HOURS 側に last があればそちらを優先します。
const DEFAULT_LAST_ADMISSION = 30;
// 「まもなく最終入館」を出す閾値（分）
const LAST_CALL_WINDOW = 60;

/* --- 端末のタイムゾーンに関係なく、必ず日本時間で「いま」を取る --------- */
function tokyoNow() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', weekday: 'short', hour12: false
  }).formatToParts(new Date());
  const get = t => parts.find(p => p.type === t)?.value;
  const hour = get('hour') === '24' ? '00' : get('hour');
  const wmap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    dateStr: `${get('year')}-${get('month')}-${get('day')}`,
    dow: wmap[get('weekday')],
    minutes: Number(hour) * 60 + Number(get('minute')),
    hhmm: `${hour}:${get('minute')}`
  };
}

const toMinutes = hhmm => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
const fromMinutes = mins => {
  const m = ((mins % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};

/* --- 季節区分（"05-01"〜"08-31" のように年をまたぐ場合も扱う）--------- */
function seasonMatches(season, mmdd) {
  return season.from <= season.to
    ? (mmdd >= season.from && mmdd <= season.to)   // 例 05-01〜08-31
    : (mmdd >= season.from || mmdd <= season.to);  // 例 09-01〜04-30
}

/* --- その施設・その日・その曜日の営業時段を返す ----------------------- */
function getHoursFor(facilityKey, dow, dateStr) {
  const entry = HOURS[facilityKey];
  if (!entry) return null;

  // 長期休館中（改修・工事など）
  if (entry.closedIndefinitely) {
    return { longClosedIndefinite: true };
  }
  const inDatedClosure = entry.closedUntil && dateStr
    && (!entry.closedFrom || dateStr >= entry.closedFrom)
    && dateStr <= entry.closedUntil;
  if (inDatedClosure) {
    return { longClosed: entry.closedUntil, longClosedReason: entry.closedReason };
  }

  // 特定日の上書き（延長営業・臨時開館など）。曜日・季節より優先。
  // dates は「その日限りの具体的な日付」の配列。定例ルール（月末金曜・祝前日等）は
  // scripts/materialize-special.js で当該期間の日付に展開して埋める（runtime は素の一致のみ）。
  if (entry.special && dateStr) {
    const hit = entry.special.find(s => Array.isArray(s.dates) && s.dates.includes(dateStr));
    if (hit && hit.ranges && hit.ranges.length) {
      const last = hit.last != null ? hit.last : entry.last;
      return {
        ranges: hit.ranges,
        last: last != null ? last : DEFAULT_LAST_ADMISSION,
        lastIsExact: last != null,
        special: true,
        // These hours apply to this date ALONE. Without saying so, "閉館 21:00"
        // reads as the everyday closing time.
        variant: { kind: 'date', date: dateStr }
      };
    }
  }

  // 季節で開館時間が変わる施設
  let src = entry;
  if (entry.seasons) {
    const mmdd = (dateStr || '').slice(5);
    src = entry.seasons.find(s => seasonMatches(s, mmdd));
    if (!src) return null;
  }

  const dowRanges = (src.w && src.w[dow]) || (entry.w && entry.w[dow]) || null;
  const ranges = dowRanges || src.d;
  if (!ranges || !ranges.length) return null;
  const last = src.last != null ? src.last : entry.last;
  // A weekday override is only worth flagging when it actually differs from the
  // facility's ordinary hours. Note this covers SHORTER days too (No.36-2 closes
  // at 17:00 on Tuesdays against 22:00 otherwise), so the label must stay neutral
  // — "Saturdays only", never "open late today".
  const differs = Boolean(dowRanges && src.d && JSON.stringify(dowRanges) !== JSON.stringify(src.d));
  return {
    ranges,
    last: last != null ? last : DEFAULT_LAST_ADMISSION,
    lastIsExact: last != null,
    variant: differs ? { kind: 'dow', dow } : null
  };
}

/* --- 本命：いまの開館状態 ---------------------------------------------
   戻り値の code:
     unknown  時間データなし → 開いているとは言わない
     before   本日まだ開館前
     open     開館中
     lastcall 最終入館まで LAST_CALL_WINDOW 分以内
     ended    最終入館は終了、閉館前
     after    本日は終了
   remain = 最終入館までの残り分（並び替え用。該当しなければ -1）
---------------------------------------------------------------------- */
function nextIsoDay(iso) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
  if (!match) return iso;
  const day = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  day.setUTCDate(day.getUTCDate() + 1);
  return day.toISOString().slice(0, 10);
}

function computeNowState(facilityKey, now) {
  const h = getHoursFor(facilityKey, now.dow, now.dateStr);
  if (!h) {
    return { code: 'unknown', cls: 'badge-out', icon: '⚪', text: '時間未確認',
             textKey: 'status.timeUnknown', noteKey: 'status.timeUnknownNote',
             note: '開館時間のデータがありません。公式サイトをご確認ください',
             reasonDetail: 'verification', needsHeaderVerification: true, remain: -1 };
  }
  if (h.longClosed || h.longClosedIndefinite) {
    if (h.longClosedIndefinite) {
      return { code: 'longclosed', cls: 'badge-closed', icon: '🚧', text: '長期休館中',
               textKey: 'status.longClosed', noteKey: 'status.longClosedIndefiniteNote',
               note: '改修等のため休館中（再開日は未定です。公式サイトでご確認ください）',
               reasonDetail: 'verification', needsHeaderVerification: true, remain: -1 };
    }
    const isExhibitionChangeover = h.longClosedReason === 'exhibitionChangeover';
    // closedUntil is the last CLOSED day, so the museum reopens the day after.
    // Quoting closedUntil itself sent visitors on the final closed day.
    const reopen = nextIsoDay(h.longClosed);
    return { code: 'longclosed', cls: 'badge-closed', icon: '🚧', text: '長期休館中',
             textKey: 'status.longClosed',
             noteKey: isExhibitionChangeover ? 'status.longClosedExhibitionChangeoverNote' : 'status.longClosedNote',
             note: isExhibitionChangeover
               ? `展示替えのため休館中（再開予定 ${reopen} 以降）`
               : `改修等のため休館中（再開予定 ${reopen} 以降）`,
             noteParams: { date: reopen }, reasonDetail: 'current', remain: -1 };
  }

  const suffix = h.lastIsExact ? '' : '（目安）';
  const cur = now.minutes;

  for (const [openStr, closeStr] of h.ranges) {
    const open = toMinutes(openStr);
    const close = toMinutes(closeStr);
    const lastAdm = close - h.last;

    if (cur < open) {
      return { code: 'before', cls: 'badge-warn', icon: '🕘', text: `${openStr} 開館`,
               textKey: 'status.before', noteKey: 'status.beforeNote',
               textParams: { open: openStr },
               noteParams: { minutes: open - cur, open: openStr, close: closeStr },
               note: `あと${open - cur}分で開館（${openStr}–${closeStr}）`,
               reasonDetail: 'hours', hoursVariant: h.variant || null, remain: lastAdm - cur };
    }
    if (cur < lastAdm) {
      const left = lastAdm - cur;
      if (left <= LAST_CALL_WINDOW) {
        return { code: 'lastcall', cls: 'badge-soon', icon: '🟠', text: `最終入館まで${left}分`,
                 textKey: 'status.lastCall', noteKey: 'status.lastCallNote',
                 textParams: { minutes: left },
                 noteParams: { last: fromMinutes(lastAdm), suffix, close: closeStr },
                 note: `最終入館 ${fromMinutes(lastAdm)}${suffix}・閉館 ${closeStr}`,
                 reasonDetail: 'hours', hoursVariant: h.variant || null, remain: left };
      }
      return { code: 'open', cls: 'badge-now', icon: '🟢', text: '開館中',
               textKey: 'status.openNow', noteKey: 'status.openNowNote',
               noteParams: { last: fromMinutes(lastAdm), suffix, close: closeStr },
               note: `最終入館 ${fromMinutes(lastAdm)}${suffix}・閉館 ${closeStr}`,
               reasonDetail: 'hours', hoursVariant: h.variant || null, remain: left };
    }
    if (cur < close) {
      return { code: 'ended', cls: 'badge-soon', icon: '🟠', text: '最終入館終了',
               textKey: 'status.ended', noteKey: 'status.endedNote',
               noteParams: { close: closeStr },
               note: `${closeStr} 閉館。入館の受付は終了しています`,
               reasonDetail: 'hours', hoursVariant: h.variant || null, remain: 0 };
    }
  }

  const lastClose = h.ranges[h.ranges.length - 1][1];
  return { code: 'after', cls: 'badge-closed', icon: '🔴', text: '本日は終了',
           textKey: 'status.after', noteKey: 'status.afterNote',
           noteParams: { close: lastClose },
           note: `${lastClose} に閉館しました`, reasonDetail: 'hours', hoursVariant: h.variant || null, remain: -1 };
}

/* ============================================================================
   統一評価器 getFacilityOpeningState(facility, datetime)
   Card / Detail / Map / Filter はここから同じ結果を得る。日付レベルの
   休館判定 (checkStatus) と時刻レベルの開館判定 (getHoursFor) を一本化する。
   datetime = { dateStr, dow?, minutes? }。minutes 省略時は日付レベルのみ。
   ========================================================================== */
function getFacilityOpeningState(facility, datetime) {
  const dateStr = datetime?.dateStr;
  const minutes = datetime?.minutes;
  const dow = datetime?.dow ?? (parseLocalDate(dateStr)?.getDay());
  const key = facility?._key || `${facility?.no || ''}-${facility?.name || ''}`;
  const base = {
    status: 'unknown', time_state: null,
    opens_at: null, closes_at: null, last_admission_at: null,
    source_rule_type: 'status.reason.raw', is_special_hours: false, hours_variant: null, confidence: 'low'
  };

  if (!dateStr) return base;

  const status = checkStatus(facility, dateStr);
  if (status.state === 'closed' || status.state === 'out') {
    return { ...base, status: 'closed', source_rule_type: status.reasonKey, confidence: 'high' };
  }
  if (status.state === 'warn') {
    return { ...base, status: 'unknown', source_rule_type: status.reasonKey, confidence: 'low' };
  }

  const h = getHoursFor(key, dow, dateStr);
  if (!h) {
    return { ...base, status: 'unknown', source_rule_type: 'status.timeUnknown', confidence: 'low' };
  }
  if (h.longClosed || h.longClosedIndefinite) {
    return { ...base, status: 'closed', source_rule_type: 'status.longClosed', confidence: 'high' };
  }

  const ranges = h.ranges || [];
  const last = h.last != null ? h.last : DEFAULT_LAST_ADMISSION;
  const isSpecial = Boolean(h.special);
  const hoursVariant = h.variant || null;
  const first = ranges[0];
  const lastRange = ranges[ranges.length - 1];

  if (minutes == null) {
    return {
      ...base,
      status: 'open',
      opens_at: first?.[0] || null,
      closes_at: lastRange?.[1] || null,
      last_admission_at: lastRange ? fromMinutes(toMinutes(lastRange[1]) - last) : null,
      source_rule_type: 'status.reason.openRule',
      is_special_hours: isSpecial, hours_variant: hoursVariant,
      confidence: 'high'
    };
  }

  for (const [openStr, closeStr] of ranges) {
    const open = toMinutes(openStr);
    const close = toMinutes(closeStr);
    const lastAdm = close - last;
    if (minutes < open) {
      return { ...base, status: 'closed', time_state: 'before', opens_at: openStr, closes_at: closeStr, last_admission_at: fromMinutes(lastAdm), source_rule_type: 'status.before', is_special_hours: isSpecial, hours_variant: hoursVariant, confidence: 'high' };
    }
    if (minutes < lastAdm) {
      const left = lastAdm - minutes;
      const timeState = left <= LAST_CALL_WINDOW ? 'lastcall' : 'open';
      return { ...base, status: 'open', time_state: timeState, opens_at: openStr, closes_at: closeStr, last_admission_at: fromMinutes(lastAdm), source_rule_type: timeState === 'lastcall' ? 'status.lastCall' : 'status.openNow', is_special_hours: isSpecial, hours_variant: hoursVariant, confidence: 'high' };
    }
    if (minutes < close) {
      return { ...base, status: 'open', time_state: 'ended', opens_at: openStr, closes_at: closeStr, last_admission_at: fromMinutes(lastAdm), source_rule_type: 'status.ended', is_special_hours: isSpecial, hours_variant: hoursVariant, confidence: 'high' };
    }
  }
  return { ...base, status: 'closed', time_state: 'after', closes_at: lastRange?.[1] || null, last_admission_at: lastRange ? fromMinutes(toMinutes(lastRange[1]) - last) : null, source_rule_type: 'status.after', is_special_hours: isSpecial, hours_variant: hoursVariant, confidence: 'high' };
}

/* ============================================================================
   既存の updateStatuses() を丸ごとこれに差し替える
   ========================================================================== */
function buildStatusPresentation(status, displayStatus, displayNow, separator = '／') {
  const primary = displayNow || displayStatus;
  const primaryReason = displayNow?.noteMain || displayNow?.note
    || displayStatus?.reasonMain || displayStatus?.reason || '';
  const primaryHours = displayNow?.noteHours || displayStatus?.reasonHours || '';
  const advisoryReason = status?.state === 'warn' && displayNow ? (displayStatus?.reason || '') : '';
  const needsHeaderVerification = Boolean(
    displayNow?.needsHeaderVerification || (!displayNow && status?.state === 'warn')
  );
  const needsVisitVerification = Boolean(
    (status?.needsVisitVerification ?? status?.state === 'warn') && !needsHeaderVerification
  );
  return {
    primary,
    // Localized in i18n/ui.js; passed through so the renderer only places it.
    hoursVariantNote: displayNow?.hoursVariantNote || '',
    reason: [primaryReason, advisoryReason].filter(Boolean).join(separator),
    reasonMain: primaryReason,
    reasonHours: primaryHours,
    reasonMainDetail: displayNow?.reasonDetail || displayStatus?.reasonDetail || (status?.state === 'warn' ? 'general-rule' : 'current'),
    reasonAdvisoryDetail: displayStatus?.reasonDetail || 'general-rule',
    advisoryReason,
    reasonSeparator: separator,
    needsHeaderVerification,
    needsVisitVerification,
    needsOfficialCheck: needsHeaderVerification || needsVisitVerification
  };
}

/*
 * The status area's "check opening info officially" destination.
 *
 * The Official Source Registry is consulted FIRST and always wins: when a
 * facility has a classified `operational_source` (page_type opening_hours /
 * visit) the link goes there, never to the homepage. The homepage fallback is
 * not coverage padding — the caller only asks for a URL when
 * `needsHeaderVerification` is set, i.e. the app genuinely cannot determine the
 * opening state and the status copy has just told the user to check officially.
 * Leaving that note without a destination would be worse than repeating what the
 * Header globe offers, so the fallback stays; it disappears the moment the
 * registry gains a precise hours page for that facility.
 */
function getOfficialStatusUrl(facility) {
  const precise = (typeof resolveContextualCtas === 'function'
    ? resolveContextualCtas('hours', facility)
    : [])
    .find(cta => cta.kind === 'opening_hours' && cta.source?.url);
  if (precise?.source?.url) return precise.source.url;
  const urls = Array.isArray(facility?.urls) ? facility.urls : [];
  return urls.find(url => /^https?:\/\/[^\s]+$/i.test(String(url || ''))) || '';
}

function updateStatuses() {
  const targetDate = document.getElementById('targetDate').value;
  if (!targetDate) return;

  const now = tokyoNow();
  const targetTime = document.getElementById('targetTime')?.value || '';
  // Live/custom is an explicit interaction state. The empty-time fallback was
  // the old sentinel and must not reappear in status calculations.
  const liveMode = typeof isLiveTimeMode === 'function' ? isLiveTimeMode() : false;
  const hasTargetTime = !liveMode && Boolean(targetTime);
  const selectedDate = parseLocalDate(targetDate);
  const selectedDow = selectedDate ? selectedDate.getDay() : null;
  const timeReference = liveMode
    ? now
    : hasTargetTime
    ? { dateStr: targetDate, dow: selectedDow, minutes: toMinutes(targetTime), hhmm: targetTime }
    : { dateStr: targetDate, dow: selectedDow, minutes: 0, hhmm: '00:00' };

  DATA.forEach(area => {
    area.facilities.forEach(f => {
      const key = f._key || `${f.no}-${f.name}`;
      const wrap = document.getElementById(`status-wrap-${key}`);
      const card = document.getElementById(`card-${key}`);
      if (!wrap) return;

      const status = checkStatus(f, targetDate);
      const displayStatus = typeof window !== 'undefined' && typeof window.localizeStatusResult === 'function'
        ? window.localizeStatusResult(status)
        : status;
      let displayNow = null;
      let nowCode = '';
      let remain = -1;
      let effectiveStatus = status.state;

      // 長期休館は通常の曜日休館より具体的なので、選択日が今日以外でも優先する。
      const selectedHours = selectedDow == null ? null : getHoursFor(key, selectedDow, targetDate);
      const isLongClosure = Boolean(selectedHours?.longClosed || selectedHours?.longClosedIndefinite);
      const shouldComputeTimeState = isLongClosure
        || ((liveMode || hasTargetTime) && status.state !== 'closed' && status.state !== 'out');
      if (shouldComputeTimeState) {
        const n = computeNowState(key, timeReference);
        displayNow = typeof window !== 'undefined' && typeof window.localizeNowState === 'function'
          ? window.localizeNowState(n)
          : n;
        nowCode = n.code;
        remain = n.remain;
        if (isLongClosure) effectiveStatus = 'closed';
      }

      const reasonSeparator = typeof window !== 'undefined' && typeof window.uiText === 'function'
        ? window.uiText('status.reasonSeparator')
        : '／';
      const presentation = buildStatusPresentation(status, displayStatus, displayNow, reasonSeparator);
      const primary = presentation.primary;
      const badgeHtml = `<span class="status-badge ${escapeHtml(primary.cls)}">${escapeHtml(primary.text)}</span>`;
      const officialUrl = presentation.needsHeaderVerification ? getOfficialStatusUrl(f) : '';
      const displayName = typeof window !== 'undefined' && typeof window.tField === 'function'
        ? window.tField(f, 'name', f.name)
        : f.name;
      const officialAction = officialUrl
        ? `<a class="status-official-link" href="${escapeHtml(officialUrl)}" target="_blank" rel="noopener" aria-label="${escapeHtml(typeof window !== 'undefined' && typeof window.uiText === 'function' ? window.uiText('facility.checkOpeningOfficialSiteAria', { name: displayName }) : '開館情報を公式サイトで確認する')}">${escapeHtml(typeof window !== 'undefined' && typeof window.uiText === 'function' ? window.uiText('facility.checkOpeningOfficialSite') : '開館情報を公式サイトで確認 →')}</a>`
        : '';
      const reasonMain = presentation.reasonMain || presentation.reason || '';
      const reasonHours = presentation.reasonHours || '';
      // Qualifies the times just stated when they do not apply every day.
      const variantNote = presentation.hoursVariantNote
        ? `<span class="status-reason-variant">${escapeHtml(presentation.hoursVariantNote)}</span>`
        : '';
      const advisoryReason = presentation.advisoryReason || '';
      const reasonAdvisory = advisoryReason
        ? `<span class="status-reason-advisory" data-status-detail="${escapeHtml(presentation.reasonAdvisoryDetail)}">${escapeHtml(presentation.reasonSeparator || reasonSeparator)}${escapeHtml(advisoryReason)}</span>`
        : '';
      wrap.dataset.statusNeedsHeaderCheck = String(presentation.needsHeaderVerification);
      wrap.dataset.statusNeedsVisitCheck = String(presentation.needsVisitVerification);
      wrap.dataset.statusDetail = presentation.reasonMainDetail;
      wrap.innerHTML = `${badgeHtml}<span class="status-support"><span class="status-reason" data-status-detail="${escapeHtml(presentation.reasonMainDetail)}"><span class="status-reason-main" data-status-detail="${escapeHtml(presentation.reasonMainDetail)}">${escapeHtml(reasonMain)}</span>${reasonHours ? `<span class="status-reason-hours" data-status-detail="hours">${escapeHtml(reasonHours)}</span>` : ''}${variantNote}${reasonAdvisory}</span>${officialAction}</span>`;
      if (card) {
        card.dataset.status = effectiveStatus;
        card.dataset.nowState = nowCode;
        card.dataset.remain = remain;
        if (typeof window !== 'undefined' && typeof window.syncFacilityVisitVerification === 'function') {
          window.syncFacilityVisitVerification(card, presentation.needsVisitVerification, presentation.needsHeaderVerification);
        }
      }
    });
  });
  // The Want-to-go list renders the localized status badge per item, so it must
  // refresh when the status layer re-computes (date/time change, minute tick).
  document.dispatchEvent(new CustomEvent('status-updated'));
}
