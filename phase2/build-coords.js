#!/usr/bin/env node
/* ============================================================================
   build-coords.js — ぐるっとパスガイド用の座標テーブル生成（Phase 2）

   使い方：
     1. このファイルを index.html と同じフォルダに置く
     2. node build-coords.js
     3. coords.js と coords-review.md が出来る
     4. coords-review.md の指示に従って残りを手で埋める
     5. もう一度 node build-coords.js（済んだ分は再問い合わせしません）

   データ元は OpenStreetMap / Nominatim（ODbL）。
   サイトに座標を載せる場合はフッター等に出典表記を入れてください：
     地図データ © OpenStreetMap contributors

   Nominatim の利用規約：秒1リクエストまで、User-Agent 必須。
   下の CONTACT を自分の連絡先に書き換えてから実行してください。
   ========================================================================== */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const CONTACT = process.env.NOMINATIM_CONTACT || 'https://fengyu20.github.io/grutto-pass/';
const UA = `grutto-pass-map/1.0 (${CONTACT})`;
const SLEEP_MS = 1100;                       // 規約は1req/s。余裕をみて1.1秒
const NOMINATIM = 'https://nominatim.openstreetmap.org/search';
const PROJECT_ROOT = path.resolve(__dirname, '..');
const INPUT_DATA = process.env.GRUTTO_DATA || path.join(PROJECT_ROOT, 'data/facilities.js');
const OUTPUT_DIR = process.env.GRUTTO_OUTPUT_DIR || PROJECT_ROOT;

const sleep = ms => new Promise(r => setTimeout(r, ms));

/* --- 関東の外に飛んだ結果は問答無用で捨てる ---------------------------- */
const KANTO_BBOX = { minLat: 35.0, maxLat: 36.4, minLon: 138.8, maxLon: 140.9 };
const inKanto = (lat, lon) =>
  lat >= KANTO_BBOX.minLat && lat <= KANTO_BBOX.maxLat &&
  lon >= KANTO_BBOX.minLon && lon <= KANTO_BBOX.maxLon;

function haversine(a, b) {
  const R = 6371000, rad = d => d * Math.PI / 180;
  const dLat = rad(b.lat - a.lat), dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 +
            Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/* --- data/facilities.js から DATA を取り出す ---------------------------- */
function loadFacilities() {
  const source = fs.readFileSync(INPUT_DATA, 'utf8');
  const context = vm.createContext({});
  vm.runInContext(`${source}\n;globalThis.__gruttoData = DATA;`, context, { filename: INPUT_DATA });
  const DATA = context.__gruttoData;
  if (!Array.isArray(DATA)) throw new Error(`${INPUT_DATA} から DATA を読み込めませんでした`);

  const out = [];
  for (const area of DATA) {
    for (const f of area.facilities) {
      const access = (f.access || []).join(' ');
      const station = (access.match(/「([^」]{2,12}?駅)」/) || [])[1] || null;
      // Do not mistake 「バス停下車徒歩5分」 for a walk from the station.
      // Prefer a segment that mentions 徒歩 without mentioning a bus.
      const walk = (access.split(/[\/／]/)
        .filter(segment => !/バス/.test(segment))
        .map(segment => Number((segment.match(/徒歩\s*約?\s*(\d{1,2})\s*分/) || [])[1]) || null)
        .find(Boolean)) || null;
      // バス利用の施設は駅から数km離れうるので、距離チェックを緩める
      const byBus = /バス/.test(access);
      out.push({
        key: f._key || `${f.no}-${f.name}`,
        no: f.no,
        name: f.name,
        area: area.name,
        station,
        walk,
        byBus,
        pref: prefFromTel(f.tel) || prefFromArea(area.name)
      });
    }
  }
  return out;
}

// 市外局番から都県を推定（050のハローダイヤルは判定不能なのでエリア名にフォールバック）
function prefFromTel(tel) {
  if (!tel) return null;
  if (/^045-/.test(tel)) return '神奈川県';
  if (/^043-/.test(tel)) return '千葉県';
  if (/^048-/.test(tel)) return '埼玉県';
  if (/^0(3|4[0-9])-/.test(tel)) return '東京都';
  return null;
}
function prefFromArea(areaName) {
  return /神奈川|千葉|埼玉/.test(areaName) ? null : '東京都';
}

/* --- 検索クエリの候補を作る（上から順に試す）-------------------------- */
function queryVariants(f) {
  const v = [];
  const pref = f.pref ? ` ${f.pref}` : '';
  v.push(`${f.name}${pref}`);

  const aliases = {
    '57': ['東京オペラシティ アートギャラリー', '東京オペラシティタワー'],
    '58-NTT-ICC': ['NTTインターコミュニケーションセンター', '東京オペラシティタワー'],
    '62': ['永青文庫美術館', '永青文庫 目白台'],
    '71': ['江戸東京博物館 両国', '東京都江戸東京博物館', '東京都墨田区横網1-4-1'],
    '85': ['吉村昭書斎', '三鷹市 吉村昭書斎', '東京都三鷹市井の頭3-3-17'],
    '94': ['たましん美術館 立川', 'たましん美術館', '東京都立川市緑町3-4'],
    '101': ['横浜みなと博物館', '帆船日本丸 横浜'],
    '107': ['埼玉県立歴史と民俗の博物館', '埼玉県立歴史民俗博物館', 'さいたま市大宮区高鼻町4-219']
  };
  (aliases[f.key] || []).forEach(alias => v.push(`${alias}${pref}`));

  // 「台東区立」「江東区」などの設置者接頭辞を落とした形
  const stripped = f.name.replace(/^(?:[^\s]{2,4}[都道府県])?[^\s]{1,6}[区市町村]立?\s*/, '');
  if (stripped && stripped !== f.name) v.push(`${stripped}${pref}`);

  // 中黒やスラッシュで併記されている場合は前半だけ
  const head = f.name.split(/[／/･・]/)[0].trim();
  if (head && head !== f.name && head.length >= 3) v.push(`${head}${pref}`);

  // 最後の手段：駅名と組み合わせる
  if (f.station) v.push(`${f.name} ${f.station}`);
  return [...new Set(v)];
}

/* --- Nominatim 問い合わせ ---------------------------------------------- */
async function nominatim(q) {
  const url = `${NOMINATIM}?q=${encodeURIComponent(q)}&format=jsonv2&limit=5&countrycodes=jp&accept-language=ja`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (res.status === 429) throw new Error('RATE_LIMIT');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  await sleep(SLEEP_MS);
  return res.json();
}

/* --- 駅の座標はキャッシュして使い回す ---------------------------------- */
const stationCache = new Map();
async function geocodeStation(station, pref) {
  if (!station) return null;
  if (stationCache.has(station)) return stationCache.get(station);
  let hit = null;
  try {
    const rows = await nominatim(`${station} ${pref || '東京都'}`);
    const r = rows.find(x => inKanto(+x.lat, +x.lon));
    if (r) hit = { lat: +r.lat, lon: +r.lon };
  } catch (e) {
    if (e.message === 'RATE_LIMIT') throw e;
  }
  stationCache.set(station, hit);
  return hit;
}

/* --- 本命：1施設を解決する --------------------------------------------
   駅からの徒歩分×100m を許容半径として、明らかに遠い候補を弾きます。
   （徒歩1分=80mが目安ですが、出口や経路のぶんを見て100m + 下限600m）
---------------------------------------------------------------------- */
async function resolve(f) {
  const stationPos = await geocodeStation(f.station, f.pref);
  // 徒歩1分≒80mだが、出口や経路のぶんを見て100m換算＋余裕400m（下限600m）
  // 徒歩表記がある施設は access に「バス」の語があっても徒歩基準で判定する
  // （多くは代替経路としてバスに触れているだけで、実際は駅近のため）
  const tolerance = f.walk
    ? Math.max(f.walk * 100 + 400, 600)
    : (f.byBus ? 6000 : 1400);   // 徒歩表記なし＋バス＝駅から数km離れうる

  const tried = [];
  for (const q of queryVariants(f)) {
    let rows;
    try {
      rows = await nominatim(q);
    } catch (e) {
      if (e.message === 'RATE_LIMIT') throw e;
      tried.push({ q, err: e.message });
      continue;
    }

    for (const r of rows) {
      const lat = +r.lat, lon = +r.lon;
      if (!inKanto(lat, lon)) continue;

      if (stationPos) {
        const d = Math.round(haversine(stationPos, { lat, lon }));
        if (d > tolerance) { tried.push({ q, rejected: `駅から${d}m（許容${tolerance}m）` }); continue; }
        // バス前提の緩い照合は「ok」と言い切らない
        const conf = (!f.walk && d > 1500) ? 'weak' : 'ok';
        return { lat, lon, q, confidence: conf,
                 detail: `${f.station}から${d}m${conf === 'weak' ? '（バス利用・要目視）' : ''}`,
                 display: r.display_name };
      }
      // 駅が引けなかった場合は関東内チェックのみ＝要目視
      return { lat, lon, q, confidence: 'weak', detail: '駅照合なし', display: r.display_name };
    }
    if (!rows.length) tried.push({ q, rejected: 'ヒットなし' });
  }
  return { confidence: 'fail', tried };
}

/* --- 既存 coords.js を読み込んで再実行時に飛ばす ----------------------- */
function loadExisting() {
  const p = path.join(OUTPUT_DIR, 'coords.js');
  if (!fs.existsSync(p)) return {};
  try {
    return new Function(fs.readFileSync(p, 'utf8') + '; return COORDS;')();
  } catch {
    console.warn('! 既存の coords.js を読めませんでした。全件やり直します');
    return {};
  }
}

/* --- メイン ------------------------------------------------------------ */
async function main() {
  if (CONTACT === 'your-email@example.com') {
    console.error('CONTACT を自分の連絡先に書き換えてから実行してください（Nominatim の規約）');
    process.exit(1);
  }

  const facilities = loadFacilities();
  const existing = loadExisting();
  const results = {}, review = [];
  let done = 0, skipped = 0;

  for (const f of facilities) {
    if (existing[f.key] && Array.isArray(existing[f.key])) {
      results[f.key] = { lat: existing[f.key][0], lon: existing[f.key][1],
                         confidence: 'kept', detail: '既存の値を保持' };
      skipped++;
      continue;
    }

    process.stdout.write(`[${++done + skipped}/${facilities.length}] ${f.no} ${f.name} ... `);
    let r;
    try {
      r = await resolve(f);
    } catch (e) {
      if (e.message === 'RATE_LIMIT') {
        console.log('\n! Nominatim にレート制限されました。少し待って再実行してください');
        console.log('  ここまでの結果は coords.js に書き出します');
        break;
      }
      r = { confidence: 'fail', tried: [{ q: '(例外)', err: e.message }] };
    }

    if (r.confidence === 'fail') {
      console.log('✗');
      review.push({ f, r });
    } else {
      console.log(`${r.confidence === 'ok' ? '✓' : '△'} ${r.lat.toFixed(5)},${r.lon.toFixed(5)}  ${r.detail}`);
      results[f.key] = r;
      if (r.confidence === 'weak') review.push({ f, r });
    }
  }

  /* --- coords.js --------------------------------------------------------- */
  const lines = [
    '// 施設座標テーブル（Phase 2）',
    '// 出典：OpenStreetMap contributors（ODbL）／ Nominatim',
    '// サイト上に「地図データ © OpenStreetMap contributors」の表記を入れてください。',
    '// △ の行は駅からの距離で照合できていません。目視で確認してください。',
    'const COORDS = {'
  ];
  for (const f of facilities) {
    const r = results[f.key];
    if (!r) { lines.push(`  // "${f.key}": [ , ], // ✗ ${f.name}（要手入力）`); continue; }
    const mark = r.confidence === 'ok' ? '' : (r.confidence === 'kept' ? '' : ' △');
    lines.push(`  "${f.key}": [${r.lat.toFixed(6)}, ${r.lon.toFixed(6)}],${mark ? ' //' + mark : ' //'} ${f.name}｜${r.detail}`);
  }
  lines.push('};');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'coords.js'), lines.join('\n') + '\n');

  /* --- coords-review.md -------------------------------------------------- */
  const md = ['# 座標の手当てリスト', ''];
  md.push(`- 解決：**${Object.keys(results).length} / ${facilities.length}**`);
  md.push(`- 要対応：**${review.length}**`);
  md.push('');
  md.push('## 手で座標を入れる方法');
  md.push('');
  md.push('1. 下のリンクで Google マップを開く');
  md.push('2. 建物の上で右クリック →「この場所について」（数値をクリックでコピー）');
  md.push('3. `coords.js` の該当行を `"キー": [緯度, 経度],` の形で埋める');
  md.push('');
  md.push('※ Google マップは**目視で座標を読むだけ**に使ってください。');
  md.push('  Places API の返り値をそのまま保存するのは規約違反ですが、');
  md.push('  地図上の地点を人が読み取るのは通常の利用です。');
  md.push('');
  md.push('| キー | No | 施設名 | 状態 | 調べる |');
  md.push('|---|---|---|---|---|');
  for (const { f, r } of review) {
    const link = `https://www.google.com/maps/search/${encodeURIComponent(f.name + ' ' + (f.station || ''))}`;
    const state = r.confidence === 'weak'
      ? `△ 駅照合なし（${(r.display || '').slice(0, 40)}）`
      : `✗ 候補なし（${(r.tried || []).map(t => t.rejected || t.err).join(' / ').slice(0, 60)}）`;
    md.push(`| \`${f.key}\` | ${f.no} | ${f.name} | ${state} | [地図](${link}) |`);
  }
  fs.writeFileSync(path.join(OUTPUT_DIR, 'coords-review.md'), md.join('\n') + '\n');

  console.log(`\n解決 ${Object.keys(results).length}/${facilities.length}、要対応 ${review.length}`);
  console.log('→ coords.js / coords-review.md を書き出しました');
}

if (require.main === module) main();

module.exports = { loadFacilities, queryVariants, haversine };
