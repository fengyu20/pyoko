/*
 * Time-scoped Pass entitlement runtime data.
 *
 * Distinguishes the entitlement fact ("what the Pass grants") from availability
 * ("is it usable on the selected date"). This file owns the accepted admission time-scope records,
 * interpreted by pass-time-scope-runtime.js; it does not duplicate the Official Source
 * Registry — CTA provenance stays in data/facility-official-sources.js.
 *
 * Default: a facility with no record here is `persistent` — its free-admission
 * entitlement is not gated by an exhibition schedule (zoos, gardens, aquariums,
 * permanent / collection exhibitions, and plain "入場" institutions).
 *
 * ---------------------------------------------------------------------------
 * SOURCE SEMANTICS (v96 correction — supersedes the v92 reading)
 * ---------------------------------------------------------------------------
 *
 * v92 treated the Grutto exhibition PDF as a *time-scoping authority*: the last
 * exhibition listed under a facility ended the facility's entitlement. Real use
 * proved that wrong. The PDF is authoritative evidence, but three different
 * claims live inside it and only one of them is an eligibility boundary:
 *
 *   1. facility entitlement baseline — the benefit label ("企画展入場",
 *      "企画展・特別展入場", "特別展入場"). This says WHAT the Pass grants; it
 *      carries no dates.
 *   2. exhibition information snapshot — the exhibitions known when the PDF was
 *      compiled ("2026年2月現在", covering "4月～9月まで"). A listed 会期 end is a
 *      SCHEDULE end, not an entitlement end.
 *   3. explicit eligibility boundary — wording that scopes the entitlement
 *      itself ("※対象展覧会開催期間は7/23～10/7です",
 *      "※ぐるっとパス対象企画展期間は5/30～8/2です",
 *      "展覧会入場(下記の展覧会のみ対象)"). Only this makes a date a boundary.
 *
 * `entitlement_mode` records which of the three applies:
 *
 *   explicit_period         the source states the eligible period outright.
 *   enumerated_exhibitions  the source states that only the listed exhibitions
 *                           are eligible (a closed set).
 *   eligible_exhibitions    facility-level benefit + a NON-exhaustive list of
 *                           confirmed exhibitions. Windows are evidence of
 *                           eligibility, never a boundary on it.
 *   awaiting_schedule       facility-level benefit, no confirmed exhibition yet.
 *
 * `schedule_is_exhaustive` is true only for the first two. When it is false, a
 * date after the last confirmed window is `unconfirmed` — the source never
 * claimed to cover it.
 *
 * Per-facility page locators inside those documents are NOT here: they cover all
 * 108 facilities, not just the time-scoped ones, so they live with the rest of the
 * source metadata in data/facility-official-sources.js (`FACILITY_SOURCE_PAGES`).
 *
 * ---------------------------------------------------------------------------
 * SOURCE ARBITRATION (per claim, never a global ranking)
 * ---------------------------------------------------------------------------
 *
 * A later official Grutto update (活用ブログ / お知らせ / a newer PDF) SUPPLEMENTS
 * an older snapshot when it speaks to the same claim — it adds confirmed
 * exhibition windows and corrects dates the snapshot had provisionally. It does
 * not win merely by being newer, and a source that says nothing about a facility
 * never removes that facility's older evidence. Each window therefore carries
 * its own `source_ref`, so provenance survives per fact rather than per file.
 *
 * A facility's own page is NOT eligibility evidence: it confirms an exhibition's
 * title and dates (context), and separately may confirm the Pass is accepted
 * (facility-side confirmation), but it never widens or narrows what Grutto
 * declared eligible. Facility pages are therefore registered in the Official
 * Source Registry, not here.
 */

/* ---- vocabularies (frozen; a new value is a deliberate schema change) ---- */
const PASS_TIME_SCOPE_ENTITLEMENT_MODES = Object.freeze([
  'explicit_period',
  'enumerated_exhibitions',
  'eligible_exhibitions',
  'awaiting_schedule'
]);

const PASS_TIME_SCOPE_SOURCE_ROLES = Object.freeze([
  'exhibition_information_snapshot',
  'later_grutto_update'
]);

/*
 * The Grutto-side sources a window may cite. `published_at` is the source's own
 * publication date and is what makes "later update" meaningful; `snapshot_as_of`
 * / `coverage_label` are the snapshot's self-declared horizon.
 */
const FACILITY_PASS_TIME_SCOPE_SOURCES = {
  grutto_exhibition_pdf_2026_01: {
    url: 'https://www.rekibun.or.jp/grutto/wp-content/uploads/sites/3/2026/03/exhibition_2026_01.pdf',
    authority: 'grutto_pass',
    role: 'exhibition_information_snapshot',
    label: '「ぐるっとパス2026」参加施設・対象の展覧会情報',
    published_at: '2026-03-01',
    snapshot_as_of: '2026-02',
    coverage_label: '2026-04..2026-09',
    is_exhaustive: false,
    non_exhaustive_wording: '4月～9月までの「ぐるっとパス2026」対象の展覧会情報です。(2026年2月現在)',
    checked_at: '2026-08-16'
  },
  grutto_blog_20260626: {
    url: 'https://www.rekibun.or.jp/grutto/blog/20260626-6804/',
    authority: 'grutto_pass',
    role: 'later_grutto_update',
    label: '7～8月のおすすめ展覧会（入場）',
    published_at: '2026-06-26',
    is_exhaustive: false,
    checked_at: '2026-08-16'
  },
  grutto_blog_20260729: {
    url: 'https://www.rekibun.or.jp/grutto/blog/20260729-6866/',
    authority: 'grutto_pass',
    role: 'later_grutto_update',
    label: '8～9月のおすすめ展覧会（入場）',
    published_at: '2026-07-29',
    is_exhaustive: false,
    checked_at: '2026-08-16'
  },
  grutto_blog_20260827: {
    url: 'https://www.rekibun.or.jp/grutto/blog/20260827-6903/',
    authority: 'grutto_pass',
    role: 'later_grutto_update',
    label: '9～10月のおすすめ展覧会（入場）',
    published_at: '2026-08-27',
    is_exhaustive: false,
    checked_at: '2026-09-04'
  }
};

/*
 * Backwards-compatible meta. `source_url` / `snapshot_as_of` / `coverage_label`
 * still describe the BASELINE snapshot; `sources` is the full arbitration set.
 */
const FACILITY_PASS_TIME_SCOPE_META = {
  source_url: FACILITY_PASS_TIME_SCOPE_SOURCES.grutto_exhibition_pdf_2026_01.url,
  snapshot_as_of: '2026-02',
  coverage_label: '2026-04..2026-09',
  source_checked_at: '2026-08-16',
  sources: FACILITY_PASS_TIME_SCOPE_SOURCES
};

/*
 * Keyed by facility `_key`. `admission_time_scoped: true` means the free-admission
 * entitlement depends on an eligible exhibition; `windows` carries the CONFIRMED
 * eligibility evidence (never an inferred boundary). `post_validity` governs a
 * date after the last confirmed window.
 */
const FACILITY_PASS_TIME_SCOPE = {
  // ---- explicit eligibility boundary: the source scopes the entitlement itself ----

  // "※対象展覧会開催期間は7/23～10/7です。" — the calibration case. 10/7 really is
  // the end of eligibility, not the end of a schedule.
  '7': {
    classification: 'named_exhibition_scoped',
    entitlement_mode: 'explicit_period',
    entitlement_baseline: '入場',
    schedule_is_exhaustive: true,
    boundary_wording: '※対象展覧会開催期間は7/23～10/7です。',
    admission_time_scoped: true,
    named_exhibition: 'この場所の風景―上野・大牟田・ブエノスアイレス',
    windows: [{
      valid_from: '2026-07-23',
      valid_to: '2026-10-07',
      title: '東京都美術館開館100周年記念 この場所の風景―上野・大牟田・ブエノスアイレス',
      source_ref: 'grutto_exhibition_pdf_2026_01',
      corroborated_by: ['grutto_blog_20260729', 'grutto_blog_20260827']
    }],
    post_validity: 'unconfirmed'
  },

  // "※ぐるっとパス対象企画展期間は5/30～8/2です。"
  '83': {
    classification: 'explicit_date_scoped',
    entitlement_mode: 'explicit_period',
    entitlement_baseline: '企画展入場',
    schedule_is_exhaustive: true,
    boundary_wording: '※ぐるっとパス対象企画展期間は5/30～8/2です。',
    admission_time_scoped: true,
    windows: [{
      valid_from: '2026-05-30',
      valid_to: '2026-08-02',
      title: '物語のかけらを見つけに展',
      source_ref: 'grutto_exhibition_pdf_2026_01',
      corroborated_by: ['grutto_blog_20260729']
    }],
    post_validity: 'unconfirmed'
  },

  // "展覧会入場(下記の展覧会のみ対象)" — a closed set. The later 企画展割引 rows are a
  // discount, not admission, so they do not extend the free-admission window.
  '40': {
    classification: 'exhibition_scoped',
    entitlement_mode: 'enumerated_exhibitions',
    entitlement_baseline: '展覧会入場(下記の展覧会のみ対象)',
    schedule_is_exhaustive: true,
    boundary_wording: '展覧会入場(下記の展覧会のみ対象)',
    admission_time_scoped: true,
    windows: [
      { valid_from: '2026-03-17', valid_to: '2026-06-07', title: 'W.ユージン・スミスとニューヨーク ロフトの時代', source_ref: 'grutto_exhibition_pdf_2026_01' },
      { valid_from: '2026-04-02', valid_to: '2026-06-21', title: 'ＴＯＰコレクション Don\'t think. Feel.', source_ref: 'grutto_exhibition_pdf_2026_01' },
      { valid_from: '2026-06-18', valid_to: '2026-09-21', title: '出光真子展', source_ref: 'grutto_exhibition_pdf_2026_01' },
      { valid_from: '2026-07-02', valid_to: '2026-09-21', title: 'ＴＯＰコレクション 明日の食卓', source_ref: 'grutto_exhibition_pdf_2026_01' }
    ],
    post_validity: 'unconfirmed'
  },

  // ---- facility-level benefit + non-exhaustive confirmed exhibitions ----
  // For every record below, a window end is an EXHIBITION end. It never ends the
  // facility's entitlement; a later official Grutto update may add windows.

  '28': {
    classification: 'exhibition_scoped',
    entitlement_mode: 'eligible_exhibitions',
    entitlement_baseline: '企画展・ルオーギャラリー入場',
    schedule_is_exhaustive: false,
    non_exhaustive_wording: '最新情報は美術館HPにてご確認ください。',
    admission_time_scoped: true,
    windows: [
      { valid_from: '2026-04-11', valid_to: '2026-06-21', title: 'ジョルジュ・ルオー アトリエの記憶', source_ref: 'grutto_exhibition_pdf_2026_01' },
      { valid_from: '2026-07-11', valid_to: '2026-09-23', title: '町田市立国際版画美術館所蔵 長谷川潔展 －パリに生きた銅版画家の軌跡', source_ref: 'grutto_exhibition_pdf_2026_01', corroborated_by: ['grutto_blog_20260729', 'grutto_blog_20260827'] },
      { valid_from: '2026-10-15', valid_to: '2026-12-20', title: '吉田璋也のデザイン', source_ref: 'grutto_blog_20260827' }
    ],
    post_validity: 'unconfirmed'
  },

  '32-WHAT-MUSEUM': {
    classification: 'exhibition_scoped',
    entitlement_mode: 'eligible_exhibitions',
    entitlement_baseline: '企画展入場',
    schedule_is_exhaustive: false,
    admission_time_scoped: true,
    windows: [
      { valid_from: '2026-04-21', valid_to: '2026-09-13', title: '波板と珊瑚礁 ー 建築を遠くに投げる八の実践', source_ref: 'grutto_exhibition_pdf_2026_01' }
    ],
    post_validity: 'unconfirmed'
  },

  // The 2026-07-29 Grutto update and the museum's own schedule both end 祈りと救いの美
  // on 9/27; the February snapshot's provisional 10/12 is superseded for that claim.
  '33': {
    classification: 'exhibition_scoped',
    entitlement_mode: 'eligible_exhibitions',
    entitlement_baseline: '企画展・特別展入場',
    schedule_is_exhaustive: false,
    admission_time_scoped: true,
    windows: [
      { valid_from: '2026-04-14', valid_to: '2026-06-28', title: '特別展「中国宋・元・明時代の漆器－和の漆器･香道具とともに」', source_ref: 'grutto_exhibition_pdf_2026_01' },
      { valid_from: '2026-07-28', valid_to: '2026-09-27', title: '企画展「祈りと救いの美―国宝 普賢菩薩騎象像との出会い」', source_ref: 'grutto_blog_20260729', supersedes: 'grutto_exhibition_pdf_2026_01', corroborated_by: ['grutto_blog_20260827'] },
      { valid_from: '2026-10-03', valid_to: '2026-12-20', title: '美しい瞬間', source_ref: 'grutto_blog_20260827' }
    ],
    post_validity: 'unconfirmed'
  },

  '34': {
    classification: 'exhibition_scoped',
    entitlement_mode: 'eligible_exhibitions',
    entitlement_baseline: '企画展入場',
    schedule_is_exhaustive: false,
    // The Grutto edition list confirms an eligible window; the facility schedule
    // independently owns the exhibition identity and dates.
    non_exhaustive_wording: '※展示室修繕のため2026年秋まで休館予定。',
    admission_time_scoped: true,
    windows: [{
      valid_from: '2026-11-14',
      valid_to: '2027-03-22',
      title: '関島寿子 かごについてのかご',
      source_ref: 'grutto_exhibition_pdf_2026_01'
    }],
    post_validity: 'unconfirmed'
  },

  '35': {
    classification: 'exhibition_scoped',
    entitlement_mode: 'eligible_exhibitions',
    entitlement_baseline: '企画展・特別展入場',
    schedule_is_exhaustive: false,
    admission_time_scoped: true,
    windows: [
      { valid_from: '2026-04-25', valid_to: '2026-07-05', title: '企画展 ライトアップ木島櫻谷Ⅲ ―おうこくの色をさがしに', source_ref: 'grutto_exhibition_pdf_2026_01' },
      { valid_from: '2026-08-29', valid_to: '2026-10-12', title: '特別展 没後100年記念 住友春翠 ―仕合わせの住友近代美術コレクション', source_ref: 'grutto_exhibition_pdf_2026_01', corroborated_by: ['grutto_blog_20260729'] },
      { valid_from: '2026-11-03', valid_to: '2026-12-13', title: '特別展 唐物誕生', source_ref: 'grutto_exhibition_pdf_2026_01' }
    ],
    post_validity: 'unconfirmed'
  },

  '37': {
    classification: 'exhibition_scoped',
    entitlement_mode: 'eligible_exhibitions',
    entitlement_baseline: '特別展入場',
    schedule_is_exhaustive: false,
    admission_time_scoped: true,
    windows: [
      { valid_from: '2026-04-11', valid_to: '2026-06-14', title: '中央アジアの手仕事 ―華麗なる刺繍とジュエリー 広島県立美術館コレクションより―', source_ref: 'grutto_exhibition_pdf_2026_01' },
      { valid_from: '2026-07-04', valid_to: '2026-09-06', title: '没後50年 髙島野十郎展', source_ref: 'grutto_exhibition_pdf_2026_01', corroborated_by: ['grutto_blog_20260729'] },
      { valid_from: '2026-09-19', valid_to: '2026-11-23', title: '路上、お邪魔ですか?', source_ref: 'grutto_exhibition_pdf_2026_01' }
    ],
    post_validity: 'unconfirmed'
  },

  '45': {
    classification: 'exhibition_scoped',
    entitlement_mode: 'eligible_exhibitions',
    entitlement_baseline: '企画展入場',
    schedule_is_exhaustive: false,
    admission_time_scoped: true,
    windows: [
      { valid_from: '2026-02-21', valid_to: '2026-05-10', title: '岡田謙三 パリ・目黒・ニューヨーク', source_ref: 'grutto_exhibition_pdf_2026_01' },
      { valid_from: '2026-06-27', valid_to: '2026-08-30', title: '高浜利也 目黒でいえあつめ', source_ref: 'grutto_exhibition_pdf_2026_01', corroborated_by: ['grutto_blog_20260729'] }
    ],
    post_validity: 'unconfirmed'
  },

  '48': {
    classification: 'exhibition_scoped',
    entitlement_mode: 'eligible_exhibitions',
    entitlement_baseline: '企画展入場',
    schedule_is_exhaustive: false,
    admission_time_scoped: true,
    windows: [
      { valid_from: '2026-04-07', valid_to: '2026-05-10', title: '【館蔵】春の優品展 名品を彩るアンティーク・テキスタイル', source_ref: 'grutto_exhibition_pdf_2026_01' },
      { valid_from: '2026-05-23', valid_to: '2026-07-20', title: '【館蔵】陶芸展 時代を超えた珠玉のやきもの', source_ref: 'grutto_exhibition_pdf_2026_01' },
      { valid_from: '2026-09-05', valid_to: '2026-10-12', title: '【館蔵】秋の優品展 唐草文の美', source_ref: 'grutto_exhibition_pdf_2026_01' }
    ],
    post_validity: 'unconfirmed'
  },

  '54': {
    classification: 'exhibition_scoped',
    entitlement_mode: 'eligible_exhibitions',
    entitlement_baseline: '企画展入場',
    schedule_is_exhaustive: false,
    admission_time_scoped: true,
    windows: [
      { valid_from: '2026-04-03', valid_to: '2026-06-22', title: 'こころときめく☆キラキラ＆リボン／デニム・ヒストリー', source_ref: 'grutto_exhibition_pdf_2026_01' },
      { valid_from: '2026-09-24', valid_to: '2026-11-21', title: '世界の刺繍をめぐる旅', source_ref: 'grutto_exhibition_pdf_2026_01', corroborated_by: ['grutto_blog_20260827'] }
    ],
    post_validity: 'unconfirmed'
  },

  // The February snapshot deferred the schedule to the venue
  // ("開催予定の展覧会最新情報は、館に直接お問い合わせください。"), so v92 left this
  // permanently unconfirmed. The 2026-06-26 / 2026-07-29 Grutto updates name an
  // eligible exhibition outright — a false negative the snapshot alone could not fix.
  '58-NTT-ICC': {
    classification: 'exhibition_scoped',
    entitlement_mode: 'eligible_exhibitions',
    entitlement_baseline: '企画展入場',
    schedule_is_exhaustive: false,
    non_exhaustive_wording: '開催予定の展覧会最新情報は、館に直接お問い合わせください。',
    admission_time_scoped: true,
    windows: [
      { valid_from: '2026-06-20', valid_to: '2026-11-08', title: 'ICC アニュアル 2026 遺す／残る／受けとめる', source_ref: 'grutto_blog_20260729', corroborated_by: ['grutto_blog_20260626', 'grutto_blog_20260827'] }
    ],
    post_validity: 'unconfirmed'
  },

  '62': {
    classification: 'exhibition_scoped',
    entitlement_mode: 'eligible_exhibitions',
    entitlement_baseline: '企画展入場',
    schedule_is_exhaustive: false,
    admission_time_scoped: true,
    windows: [
      { valid_from: '2026-04-11', valid_to: '2026-06-07', title: '春季展「熊本城―守り継がれた名城400年の軌跡―」', source_ref: 'grutto_exhibition_pdf_2026_01' },
      // The snapshot's provisional title 「大名家の狂言道具コレクション」(仮) was
      // finalized by the later update; the dates are unchanged.
      { valid_from: '2026-07-11', valid_to: '2026-09-06', title: '夏季展「えいえいやっとな！蔵出し！細川家の狂言面・装束」', source_ref: 'grutto_blog_20260729', corroborated_by: ['grutto_exhibition_pdf_2026_01', 'grutto_blog_20260827'] },
      { valid_from: '2026-10-03', valid_to: '2026-11-29', title: '白隠ワールド', source_ref: 'grutto_blog_20260827' }
    ],
    post_validity: 'unconfirmed'
  },

  // The snapshot listed 怖い本(仮) from 5/29; the later update and the museum's own
  // schedule both give 6/3. Only the start moved — the entitlement is unaffected.
  '68': {
    classification: 'exhibition_scoped',
    entitlement_mode: 'eligible_exhibitions',
    entitlement_baseline: '企画展入場',
    schedule_is_exhaustive: false,
    admission_time_scoped: true,
    windows: [
      { valid_from: '2026-01-21', valid_to: '2026-05-17', title: 'リニューアル・オープン記念 ニッポン再発見—異邦人のまなざし－', source_ref: 'grutto_exhibition_pdf_2026_01' },
      { valid_from: '2026-06-03', valid_to: '2026-09-23', title: '「怖い」本', source_ref: 'grutto_blog_20260729', supersedes: 'grutto_exhibition_pdf_2026_01' }
    ],
    post_validity: 'unconfirmed'
  },

  '94': {
    classification: 'exhibition_scoped',
    entitlement_mode: 'eligible_exhibitions',
    entitlement_baseline: '企画展入場',
    schedule_is_exhaustive: false,
    admission_time_scoped: true,
    windows: [
      { valid_from: '2026-04-11', valid_to: '2026-07-05', title: '春のたましんコレクション展2026 ソウゾウのめばえ', source_ref: 'grutto_exhibition_pdf_2026_01' },
      { valid_from: '2026-07-18', valid_to: '2026-10-04', title: '旅と美と 倉田三郎と美術家たちが出会った異国', source_ref: 'grutto_blog_20260729', corroborated_by: ['grutto_exhibition_pdf_2026_01', 'grutto_blog_20260827'] },
      { valid_from: '2026-10-21', valid_to: '2026-12-20', title: '第51回全国大学版画展', source_ref: 'grutto_blog_20260827' }
    ],
    post_validity: 'unconfirmed'
  },

  '99': {
    classification: 'exhibition_scoped',
    entitlement_mode: 'eligible_exhibitions',
    entitlement_baseline: '企画展入場',
    schedule_is_exhaustive: false,
    admission_time_scoped: true,
    windows: [
      { valid_from: '2026-06-27', valid_to: '2026-08-30', title: 'プレイバック!ミレニアム1991→2001:版画が／版画で越えた境界', source_ref: 'grutto_exhibition_pdf_2026_01', corroborated_by: ['grutto_blog_20260729'] },
      { valid_from: '2026-09-12', valid_to: '2026-11-23', title: 'うき世のたわむれ:笑いつづける浮世絵と幕末明治の渦', source_ref: 'grutto_exhibition_pdf_2026_01', corroborated_by: ['grutto_blog_20260729', 'grutto_blog_20260827'] }
    ],
    post_validity: 'unconfirmed'
  },

  /*
   * CANONICAL CORRECTION — No.100 そごう美術館.
   *
   * The February snapshot reads:
   *   「100 そごう美術館  企画展入場 / KAGAYA 天空の歌 4/11(土)～5/31(日)
   *    ※以降の展覧会の会期および詳細は決まり次第そごう美術館HPに掲載いたしますので、ご確認ください。」
   *
   * v92 stored 5/31 as the only window, so every date after 2026-05-31 resolved to
   * `unconfirmed` — the facility dropped out of the free-admission filter and the
   * card read 対象展 未確認 all summer. But 5/31 is the end of KAGAYA 天空の歌, and
   * the snapshot says outright that later exhibitions are not yet listed. The
   * entitlement is 企画展入場 and never expired.
   *
   * The 2026-06-26 and 2026-07-29 Grutto updates confirm the later exhibitions
   * ("一般料金：1,400円がパスだけで入場できます"), which is what actually decides
   * availability for August and September.
   */
  '100': {
    classification: 'exhibition_scoped',
    entitlement_mode: 'eligible_exhibitions',
    entitlement_baseline: '企画展入場',
    schedule_is_exhaustive: false,
    non_exhaustive_wording: '※以降の展覧会の会期および詳細は決まり次第そごう美術館HPに掲載いたしますので、ご確認ください。',
    admission_time_scoped: true,
    windows: [
      { valid_from: '2026-04-11', valid_to: '2026-05-31', title: 'KAGAYA 天空の歌', source_ref: 'grutto_exhibition_pdf_2026_01' },
      { valid_from: '2026-06-06', valid_to: '2026-07-17', title: '―虹の彼方に― 葉山有樹', source_ref: 'grutto_blog_20260626' },
      { valid_from: '2026-08-01', valid_to: '2026-08-31', title: 'The 50th Anniversary OSAMU GOODS展', source_ref: 'grutto_blog_20260729', corroborated_by: ['grutto_blog_20260626'] },
      { valid_from: '2026-09-12', valid_to: '2026-10-12', title: 'カラフルパレット　鈴木信太郎', source_ref: 'grutto_blog_20260729', corroborated_by: ['grutto_blog_20260827'] }
    ],
    post_validity: 'unconfirmed'
  },

  '106': {
    classification: 'exhibition_scoped',
    entitlement_mode: 'eligible_exhibitions',
    entitlement_baseline: '企画展入場',
    schedule_is_exhaustive: false,
    admission_time_scoped: true,
    windows: [
      { valid_from: '2026-02-07', valid_to: '2026-05-10', title: 'コレクションの舞台裏―光をあてる、掘りおこす。収蔵品をめぐる7つの試み', source_ref: 'grutto_exhibition_pdf_2026_01' },
      { valid_from: '2026-07-11', valid_to: '2026-09-23', title: '密やかな美 小村雪岱のすべて', source_ref: 'grutto_exhibition_pdf_2026_01', corroborated_by: ['grutto_blog_20260729', 'grutto_blog_20260827'] },
      { valid_from: '2026-10-10', valid_to: '2027-01-17', title: '内間安瑆・俊子展', source_ref: 'grutto_blog_20260827' }
    ],
    post_validity: 'unconfirmed'
  }
};

window.PASS_TIME_SCOPE_ENTITLEMENT_MODES = PASS_TIME_SCOPE_ENTITLEMENT_MODES;
window.PASS_TIME_SCOPE_SOURCE_ROLES = PASS_TIME_SCOPE_SOURCE_ROLES;
window.FACILITY_PASS_TIME_SCOPE_SOURCES = FACILITY_PASS_TIME_SCOPE_SOURCES;
window.FACILITY_PASS_TIME_SCOPE_META = FACILITY_PASS_TIME_SCOPE_META;
window.FACILITY_PASS_TIME_SCOPE = FACILITY_PASS_TIME_SCOPE;
