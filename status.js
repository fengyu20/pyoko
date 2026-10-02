// 開館状況の判定（曜日・祝日・会期・休館ルール）
// index.html から分離。ブラウザではグローバルとして読み込まれ（<script src>）、
// テストでは Node の vm で読み込む。DOM 非依存の純関数群。
// 祝日リスト HOLIDAYS は data/holidays.js から供給される（先に読み込むこと）。

const DAY_NAMES = ['日','月','火','水','木','金','土'];
const DAY_INDEX = Object.fromEntries(DAY_NAMES.map((name, index) => [name, index]));

function parseLocalDate(dateStr) {
  const parts = String(dateStr || '').split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
  return new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0, 0);
}

function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function addDays(d, amount) {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + amount);
  return copy;
}

function sameDate(a, b) {
  return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function inRange(m, d, startM, startD, endM, endD) {
  const value = m * 100 + d;
  const start = startM * 100 + startD;
  const end = endM * 100 + endD;
  return start <= end ? value >= start && value <= end : value >= start || value <= end;
}

function getClosureText(f) {
  const parts = [...(f.closed || [])];
  (f.notes || []).forEach(note => {
    if (/(?:休館|休園|閉館)/.test(note)) parts.push(note);
  });
  (f.schedule_lines || []).forEach(line => {
    if (/(?:休館|休園|閉館)/.test(line)) parts.push(line);
  });
  return parts.join(' ');
}

function normalizeDateSeparators(text) {
  return String(text || '').replace(/[～〜－–—-]/g, '~').replace(/[，,]/g, '、');
}

function splitClosureDateSegments(text) {
  return String(text || '').split(/[。；;\n※]/).map(segment => segment.trim()).filter(Boolean);
}

function stripReopeningDatePhrases(text) {
  return String(text || '').replace(
    /(?:\d{1,2}\/\d{1,2}(?:\([^)]*\))?(?:\s*から)?\s*)?(?:次回展|再開|営業再開|次回開館|通常開館)[^、,]*/g,
    ' '
  );
}

function getExplicitClosureDateText(f) {
  const directClosureSegments = (f.closed || []).flatMap(splitClosureDateSegments);
  const annotatedClosureSegments = [...(f.notes || []), ...(f.schedule_lines || [])]
    .flatMap(splitClosureDateSegments)
    .filter(segment => /(?:休館|休園|閉館)/.test(segment));

  return [...directClosureSegments, ...annotatedClosureSegments]
    .map(stripReopeningDatePhrases)
    .join(' ');
}

function extractAnnualDateRules(text) {
  const normalized = normalizeDateSeparators(text);
  const rules = [];
  const re = /(\d{1,2})\/(\d{1,2})(?:\([^)]*\))?(?:\s*~\s*(?:(\d{1,2})\/)?(\d{1,2})(?:\([^)]*\))?)?/g;
  let match;

  while ((match = re.exec(normalized))) {
    const startMonth = Number(match[1]);
    const startDay = Number(match[2]);
    const endMonth = match[4] ? Number(match[3] || startMonth) : startMonth;
    const endDay = match[4] ? Number(match[4]) : startDay;
    rules.push({ startMonth, startDay, endMonth, endDay, raw: match[0] });

    let cursor = re.lastIndex;
    while (true) {
      const remainder = normalized.slice(cursor);
      const tail = remainder.match(/^\s*[・、]\s*(\d{1,2})(?:\s*~\s*(\d{1,2}))?/);
      if (!tail) break;
      const afterTail = remainder.slice(tail[0].length).trimStart();
      if (afterTail.startsWith('/')) break; 
      const tailStart = Number(tail[1]);
      const tailEnd = Number(tail[2] || tail[1]);
      rules.push({ startMonth, startDay: tailStart, endMonth: startMonth, endDay: tailEnd, raw: tail[0].trim() });
      cursor += tail[0].length;
      re.lastIndex = cursor;
    }
  }
  return rules;
}

function matchesAnnualRule(d, rule) {
  return inRange(d.getMonth()+1, d.getDate(), rule.startMonth, rule.startDay, rule.endMonth, rule.endDay);
}

function parseWeeklyRules(text) {
  let working = String(text || '').replace(/曜(?!日)/g, '曜日');
  const rules = [];

  function addRule(dayName, nths, raw) {
    const day = DAY_INDEX[dayName];
    if (day == null) return;
    const key = `${day}:${nths ? nths.join('.') : 'all'}`;
    if (!rules.some(rule => rule.key === key)) rules.push({ key, day, nths, raw });
  }

  working = working.replace(/毎月最終([月火水木金土日])曜日/g, (all, day) => {
    addRule(day, ['last'], all);
    return ' ';
  });

  working = working.replace(/第(\d+)((?:[月火水木金土日][・、])+[月火水木金土日])曜日/g, (all, nth, days) => {
    days.split(/[・、]/).forEach(day => addRule(day, [Number(nth)], all));
    return ' ';
  });

  working = working.replace(/第((?:\d+)(?:[・、](?:第)?\d+)*)([月火水木金土日])曜日/g, (all, nthText, day) => {
    const nths = (nthText.match(/\d+/g) || []).map(Number);
    addRule(day, nths, all);
    return ' ';
  });

  const simpleRe = /([月火水木金土日](?:[・、][月火水木金土日])*)曜日/g;
  let simple;
  while ((simple = simpleRe.exec(working))) {
    simple[1].split(/[・、]/).forEach(day => addRule(day, null, simple[0]));
  }
  return rules;
}

function isLastWeekdayOccurrence(d) {
  const daysInMonth = new Date(d.getFullYear(), d.getMonth()+1, 0).getDate();
  return d.getDate() + 7 > daysInMonth;
}

function matchesWeeklyRule(d, rule) {
  if (d.getDay() !== rule.day) return false;
  if (!rule.nths) return true;
  const occurrence = Math.floor((d.getDate() - 1) / 7) + 1;
  return rule.nths.includes(occurrence) || (rule.nths.includes('last') && isLastWeekdayOccurrence(d));
}

function matchesWeeklyClosure(d, weeklyRules) {
  return weeklyRules.some(rule => matchesWeeklyRule(d, rule));
}

function isTokyoMetropolitanDay(d) {
  return d.getMonth() === 9 && d.getDate() === 1;
}

function isHolidayLike(d, closureText) {
  return HOLIDAYS.has(dateKey(d)) || (closureText.includes('都民の日') && isTokyoMetropolitanDay(d));
}

function isBusinessDay(d, closureText) {
  return d.getDay() !== 0 && d.getDay() !== 6 && !isHolidayLike(d, closureText);
}

function nextBusinessDay(d, closureText) {
  let cursor = addDays(d, 1);
  for (let i = 0; i < 10; i++) {
    if (isBusinessDay(cursor, closureText)) return cursor;
    cursor = addDays(cursor, 1);
  }
  return cursor;
}

function holidayOpensVenue(closureText) {
  return /祝[^)]*開(?:館|園)/.test(closureText) || /祝休日等の場合は前日/.test(closureText);
}

function isGeneralHolidayClosure(closureText) {
  return /日曜日[・、]祝日/.test(closureText) || /(?:^|[、。])祝日(?:[、。]|$)/.test(closureText);
}

function getHolidaySubstituteClosure(d, closureText, weeklyRules) {
  const candidateIsHolidayBase = candidate => isHolidayLike(candidate, closureText) && matchesWeeklyClosure(candidate, weeklyRules);

  if (closureText.includes('祝休日の翌平日')) {
    for (let offset = 1; offset <= 7; offset++) {
      const candidate = addDays(d, -offset);
      if (isHolidayLike(candidate, closureText) && sameDate(nextBusinessDay(candidate, closureText), d)) {
        return '祝休日の翌平日休館';
      }
    }
  }

  if (closureText.includes('祝日の翌日')) {
    const yesterday = addDays(d, -1);
    if (HOLIDAYS.has(dateKey(yesterday)) && d.getDay() !== 0 && d.getDay() !== 6) {
      return '祝日の翌日休館';
    }
  }

  if (/祝休日等の場合は前日/.test(closureText)) {
    const tomorrow = addDays(d, 1);
    if (candidateIsHolidayBase(tomorrow)) return '祝日のため休館日が前日に振り替え';
  }

  if (/翌日、翌々日休(?:館|園)/.test(closureText)) {
    if (candidateIsHolidayBase(addDays(d, -1)) || candidateIsHolidayBase(addDays(d, -2))) {
      return '祝日のため翌日・翌々日休館';
    }
  } else if (/翌平日休(?:館|園)/.test(closureText)) {
    for (let offset = 1; offset <= 7; offset++) {
      const candidate = addDays(d, -offset);
      if (candidateIsHolidayBase(candidate) && sameDate(nextBusinessDay(candidate, closureText), d)) {
        return '祝日のため翌平日休館';
      }
    }
  } else if (/翌日休(?:館|園)/.test(closureText)) {
    if (candidateIsHolidayBase(addDays(d, -1))) return '祝日のため翌日休館';
  }
  return null;
}

function getBlockingUncertainty(d, closureText, isBaseClosureDay) {
  if (closureText.includes('不定休')) return '不定休が含まれるため、公式サイトでご確認ください';
  if (closureText.includes('休業日に準じ')) return '休館日は併設の商業施設に準ずるため、公式サイトでご確認ください';
  if (closureText.includes('休館予定') && !/\d{1,2}\/\d{1,2}/.test(closureText)) return '休館予定のみ公表されているため、公式サイトでご確認ください';

  if (closureText.includes('ホール使用のない場合')) {
    const definitelyPublic = [0, 2, 3].includes(d.getDay()); 
    if (!definitelyPublic && !isBaseClosureDay) return 'ホールの使用状況により開館状況が異なります';
  }

  if (isBaseClosureDay && /(東京ドームプロ野球開催日|春・夏休み期間中)/.test(closureText)) {
    return '通常の休館日ですが、試合開催日や長期休暇期間中は開館する場合があります';
  }
  if (isBaseClosureDay && /展覧会によって.*開館になる場合/.test(closureText)) {
    return '展覧会により当曜日の開館状況が異なります';
  }
  return null;
}

function extractExhibitionRanges(lines) {
  const ranges = [];
  (lines || []).forEach(line => {
    if (/(?:休館|休園|閉館)/.test(line)) return;
    const normalized = normalizeDateSeparators(line);
    const re = /(\d{1,2})\/(\d{1,2})(?:\([^)]*\))?\s*~\s*(\d{1,2})\/(\d{1,2})/g;
    let match;
    while ((match = re.exec(normalized))) {
      ranges.push({ startMonth:Number(match[1]), startDay:Number(match[2]), endMonth:Number(match[3]), endDay:Number(match[4]) });
    }
  });
  return ranges;
}

function isOutsideKnownExhibitionPeriod(f, d) {
  const admission = f.admission_label || '';
  const isExhibitionOnly = /(企画展|特別展|収蔵品展|館蔵品展)/.test(admission) && !/常設/.test(admission);
  if (!isExhibitionOnly) return false;
  const ranges = extractExhibitionRanges(f.schedule_lines || []);
  if (!ranges.length) return false;
  return !ranges.some(rule => matchesAnnualRule(d, rule));
}

const STATUS_REASON_SEMANTICS = Object.freeze({
  'status.reason.invalidDate': { detail: 'current', needsVisitVerification: false },
  'status.reason.explicit': { detail: 'current', needsVisitVerification: false },
  'status.reason.holidayNextBusiness': { detail: 'current', needsVisitVerification: false },
  'status.reason.holidayNextDay': { detail: 'current', needsVisitVerification: false },
  'status.reason.holidayShiftPrevious': { detail: 'current', needsVisitVerification: false },
  'status.reason.holidayNextTwo': { detail: 'current', needsVisitVerification: false },
  'status.reason.holidayNextBusinessAlt': { detail: 'current', needsVisitVerification: false },
  'status.reason.holiday': { detail: 'current', needsVisitVerification: false },
  'status.reason.uncertainIrregular': { detail: 'general-rule', needsVisitVerification: true },
  'status.reason.uncertainCommercial': { detail: 'general-rule', needsVisitVerification: true },
  'status.reason.uncertainPlanned': { detail: 'general-rule', needsVisitVerification: true },
  'status.reason.uncertainHall': { detail: 'general-rule', needsVisitVerification: true },
  'status.reason.uncertainEvent': { detail: 'general-rule', needsVisitVerification: true },
  'status.reason.uncertainExhibition': { detail: 'general-rule', needsVisitVerification: true },
  'status.reason.weekday': { detail: 'general-rule', needsVisitVerification: false },
  'status.reason.notice': { detail: 'general-rule', needsVisitVerification: false },
  'status.reason.outside': { detail: 'current', needsVisitVerification: false },
  'status.reason.openRule': { detail: 'general-rule', needsVisitVerification: false },
  'status.reason.raw': { detail: 'general-rule' }
});

function makeStatus(state, reason, reasonKey, reasonParams) {
  const map = {
    open:   { cls:'badge-open',   icon:'🟢', text:'開館予定', textKey:'status.openScheduled' },
    closed: { cls:'badge-closed', icon:'🔴', text:'休館', textKey:'status.closed' },
    warn:   { cls:'badge-warn',   icon:'🟡', text:'要確認', textKey:'status.warn' },
    out:    { cls:'badge-out',    icon:'⚪', text:'会期外', textKey:'status.out' }
  };
  const semantics = STATUS_REASON_SEMANTICS[reasonKey || 'status.reason.raw'] || {};
  return {
    state,
    reason,
    reasonKey: reasonKey || 'status.reason.raw',
    reasonParams: reasonParams || { raw: reason },
    reasonDetail: semantics.detail || (state === 'warn' ? 'general-rule' : 'current'),
    needsVisitVerification: semantics.needsVisitVerification ?? state === 'warn',
    ...map[state]
  };
}

function reasonDescriptor(reason) {
  const keys = {
    '祝休日の翌平日休館': 'status.reason.holidayNextBusiness',
    '祝日の翌日休館': 'status.reason.holidayNextDay',
    '祝日のため翌日休館': 'status.reason.holidayNextDay',
    '祝日のため休館日が前日に振り替え': 'status.reason.holidayShiftPrevious',
    '祝日のため翌日・翌々日休館': 'status.reason.holidayNextTwo',
    '祝日のため翌平日休館': 'status.reason.holidayNextBusinessAlt',
    '国民の祝日のため休館': 'status.reason.holiday',
    '不定休が含まれるため、公式サイトでご確認ください': 'status.reason.uncertainIrregular',
    '休館日は併設の商業施設に準ずるため、公式サイトでご確認ください': 'status.reason.uncertainCommercial',
    '休館予定のみ公表されているため、公式サイトでご確認ください': 'status.reason.uncertainPlanned',
    'ホールの使用状況により開館状況が異なります': 'status.reason.uncertainHall',
    '通常の休館日ですが、試合開催日や長期休暇期間中は開館する場合があります': 'status.reason.uncertainEvent',
    '展覧会により当曜日の開館状況が異なります': 'status.reason.uncertainExhibition',
    '現在判明している展覧会の会期外です': 'status.reason.outside',
    '通常のルールに基づき開館予定': 'status.reason.openRule'
  };
  return { key: keys[reason] || 'status.reason.raw', params: { raw: reason } };
}

function checkStatus(f, dateStr) {
  const d = parseLocalDate(dateStr);
  if (!d) return makeStatus('warn', '日付の形式が正しくありません', 'status.reason.invalidDate');

  const closureText = getClosureText(f);
  const weeklyRules = parseWeeklyRules(closureText);
  const explicitRules = extractAnnualDateRules(getExplicitClosureDateText(f));

  const explicitMatch = explicitRules.find(rule => matchesAnnualRule(d, rule));
  if (explicitMatch) {
    return makeStatus(
      'closed',
      `指定休館日または休館期間中（${explicitMatch.raw}）`,
      'status.reason.explicit',
      { raw: explicitMatch.raw }
    );
  }

  const substituteReason = getHolidaySubstituteClosure(d, closureText, weeklyRules);
  if (substituteReason) {
    const descriptor = reasonDescriptor(substituteReason);
    return makeStatus('closed', substituteReason, descriptor.key, descriptor.params);
  }

  if (isGeneralHolidayClosure(closureText) && HOLIDAYS.has(dateKey(d))) {
    return makeStatus('closed', '国民の祝日のため休館', 'status.reason.holiday');
  }

  const isBaseClosureDay = matchesWeeklyClosure(d, weeklyRules);
  const uncertainty = getBlockingUncertainty(d, closureText, isBaseClosureDay);

  if (isBaseClosureDay) {
    if (isHolidayLike(d, closureText) && holidayOpensVenue(closureText)) {
      // 祝日開館
    } else if (uncertainty) {
      const descriptor = reasonDescriptor(uncertainty);
      return makeStatus('warn', uncertainty, descriptor.key, descriptor.params);
    } else {
      return makeStatus(
        'closed',
        `通常の休館日ルール（${DAY_NAMES[d.getDay()]}曜日）`,
        'status.reason.weekday',
        { day: DAY_NAMES[d.getDay()] }
      );
    }
  } else if (uncertainty) {
    const descriptor = reasonDescriptor(uncertainty);
    return makeStatus('warn', uncertainty, descriptor.key, descriptor.params);
  }

  if (isOutsideKnownExhibitionPeriod(f, d)) {
    return makeStatus('out', '現在判明している展覧会の会期外です', 'status.reason.outside');
  }

  const notices = [];
  if (closureText.includes('展示替期間')) notices.push('展示替え');
  if (closureText.includes('臨時休館')) notices.push('臨時休館');
  if (closureText.includes('整備休館')) notices.push('設備点検');
  if (closureText.includes('保守点検')) notices.push('保守点検');
  if (/(?:夏期|冬期)休?館?期間|夏期/.test(closureText)) notices.push('季節休館');

  if (notices.length) {
    return makeStatus(
      'open',
      `確定休館ルール非該当（※${notices.join('/')}による臨時休館の可能性あり）`,
      'status.reason.notice',
      { notices: notices.join('/') }
    );
  }
  return makeStatus('open', '通常のルールに基づき開館予定', 'status.reason.openRule');
}
