// サイト全体の年度・期間・出典の設定。ここを変えれば毎年・毎月の切り替えが済む。
// ブラウザではグローバル CONFIG として読み込み、init() の applyConfig() が
// タイトル・Pass 情報・日付ピッカーの min/max・出典フッターに反映する。
const CONFIG = {
  year: 2026,
  edition: 'ぐるっとパス2026',
  // Pass の計算基準。表示文言ではなく数値としてロジックから参照する。
  passPriceYen: 2500,
  // Hero に表示する情報確認日。更新時はここも合わせて更新する。
  lastUpdated: '2026-10-06',

  // 公式サイトは107の番号付き施設。No.36は2施設を収録するため、
  // このガイドのカード（実体）数は108件になる。
  facilityCount: 108,
  catalogNumberCount: 107,

  // 日付ピッカーの上限（= ぐるっとパスの有効期限）。
  // 2026年版パスの年度有効期限まで。2027年の祝日は data/holidays.js に登録済み。
  passEnd:   '2027-03-31',

  // Footer の出典表示。表示文言は i18n、URL と期間はここを唯一の真実とする。
  // recommendations は新しい期間を先に並べる。過去の参照元も削除しない。
  sources: {
    core: [
      { id: 'grutto-official', type: 'official', url: 'https://www.rekibun.or.jp/grutto/' },
      { id: 'facility-official-sites', type: 'facility-sites' }
    ],
    exhibitions: [
      { id: 'edition-exhibition-list', type: 'exhibition-list', url: 'https://www.rekibun.or.jp/grutto/facilities/' }
    ],
    recommendations: [
      {
        id: '2026-10-06',
        periodStart: '2026-10',
        periodEnd: '2026-11',
        admissionUrl: 'https://www.rekibun.or.jp/grutto/blog/20260930-6956/',
        discountUrl: 'https://www.rekibun.or.jp/grutto/blog/20260930-6955/'
      },
      {
        id: '2026-09-04',
        periodStart: '2026-09',
        periodEnd: '2026-10',
        admissionUrl: 'https://www.rekibun.or.jp/grutto/blog/20260827-6903/',
        discountUrl: 'https://www.rekibun.or.jp/grutto/blog/20260827-6902/'
      },
      {
        id: '2026-08-09',
        periodStart: '2026-08',
        periodEnd: '2026-09',
        admissionUrl: 'https://www.rekibun.or.jp/grutto/blog/20260729-6866/',
        discountUrl: 'https://www.rekibun.or.jp/grutto/blog/20260729-6865/'
      },
      {
        id: '2026-07-08',
        periodStart: '2026-07',
        periodEnd: '2026-08',
        admissionUrl: 'https://www.rekibun.or.jp/grutto/blog/20260626-6804/',
        discountUrl: 'https://www.rekibun.or.jp/grutto/blog/20260624-6803/'
      }
    ]
  },

  // 情報の役割を混同しないための出典階層。会期・料金・予約・休館は
  // ブログではなく、各施設の公式サイトを最終確認先とする。
  sourcePolicy: [
    { label: '利用資格・基本会期', url: 'https://www.rekibun.or.jp/grutto/facilities/' },
    { label: 'おすすめ展示の発見', url: 'https://www.rekibun.or.jp/grutto/blog/' },
    { label: '会期・料金・予約・休館の最終確認', url: null }
  ]
};
