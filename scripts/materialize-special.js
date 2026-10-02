#!/usr/bin/env node
// 定例ルール（月末金曜・祝前日など）を、年度開始日からパス終了日までの
// 具体的な日付リストに展開する。出力を data(HOURS) の special に貼る。
//   node scripts/materialize-special.js
//
// runtime（phase1-open-now.js）はあくまで「その日付か否か」の素の一致しか見ない。
// 「月末金曜」のような規則を runtime で解釈させない＝ここで日付に落とすのが設計方針。

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
function load() {
  const files = ['config.js', 'data/holidays.js'];
  let src = files.map(f => fs.readFileSync(path.join(root, f), 'utf8')).join('\n;\n');
  src += `;globalThis.__d = { CONFIG, HOLIDAYS };`;
  const ctx = vm.createContext({});
  vm.runInContext(src, ctx, { filename: 'bundle.js' });
  return ctx.__d;
}

// 日付は UTC 正午で扱い、タイムゾーンのずれを避ける
const toDate = iso => { const [y, m, d] = iso.split('-').map(Number); return new Date(Date.UTC(y, m - 1, d, 12)); };
const iso = dt => dt.toISOString().slice(0, 10);
const addDays = (dt, n) => new Date(dt.getTime() + n * 86400000);

function eachDay(startIso, endIso) {
  const out = [];
  for (let d = toDate(startIso); iso(d) <= endIso; d = addDays(d, 1)) out.push(iso(d));
  return out;
}

// 各月の最終「指定曜日」（0=日〜6=土）。期間内のものだけ返す。
function lastWeekdayOfMonths(startIso, endIso, weekday) {
  const out = new Set();
  for (const day of eachDay(startIso, endIso)) {
    const dt = toDate(day);
    if (dt.getUTCDay() !== weekday) continue;
    const next = addDays(dt, 7);
    if (next.getUTCMonth() !== dt.getUTCMonth()) out.add(day); // 同月内に翌週が無い＝最終
  }
  return [...out];
}

// 祝前日（HOLIDAYS の各日の前日）。期間内のものだけ。
function dayBeforeHolidays(startIso, endIso, holidays) {
  const out = new Set();
  for (const h of holidays) {
    const prev = iso(addDays(toDate(h), -1));
    if (prev >= startIso && prev <= endIso) out.add(prev);
  }
  return [...out].sort();
}

const { CONFIG, HOLIDAYS } = load();
const generationStart = `${String(CONFIG.year).padStart(4, '0')}-01-01`;
const { passEnd } = CONFIG;
const fmt = arr => arr.map(d => `"${d}"`).join(', ');

console.log(`# 生成範囲: ${generationStart} 〜 ${passEnd}\n`);
console.log('## 月末金曜（例: No.19 国立映画アーカイブ 20:00 まで）');
console.log(`dates: [${fmt(lastWeekdayOfMonths(generationStart, passEnd, 5))}]\n`);
console.log('## 祝前日（例: No.2 上野の森美術館。ただし展覧会依存のため採否は要判断）');
console.log(`dates: [${fmt(dayBeforeHolidays(generationStart, passEnd, [...HOLIDAYS]))}]`);
