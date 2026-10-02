/*
 * Small reviewed corrections applied after the generated monthly DATA blob.
 * Keep these explicit until the next full data regeneration; each correction
 * must point to the source that justifies the override.
 */
const FACILITY_DATA_CORRECTIONS = {
  // Official museum notice (checked 2026-08-10): exhibition changeover closure
  // runs from Aug 3 through Sep 11. Source: https://www.yamasa.com/musee/
  '17': {
    closed: [
      '月曜日(祝休日の場合は開館し翌日休館)、夏期、年末年始、展示替期間',
      '※8/3~9/11 展示替期間（休館）'
    ]
  },
  // The official 2026 participation/fee sheet lists only permanent-exhibition
  // admission (¥630) for Miraikan; the special exhibition is not a pass
  // discount benefit.
  '80': {
    admission_label: '常設展入場',
    pass_notes: ['常設展入場'],
    pass_types: ['admission'],
    regular_price_yen: 630,
    benefit_basis: '常設展一般料金630円',
    data_source: 'ぐるっとパス2026参加施設・利用料金情報（入場施設）'
  },
  // Reviewed source correction (checked 2026-08-12): the Pass covers the
  // Museum Collection admission valued at ¥220. Temporary exhibitions use
  // the general group-rate equivalent discount, whose amount varies by show.
  '51': {
    admission_label: 'コレクション展入場 / 企画展割引:一般料金の団体割引相当額',
    pass_notes: [
      'コレクション展入場',
      '企画展割引:一般料金の団体割引相当額（展覧会により異なる）'
    ],
    pass_benefit_yen: 220,
    regular_price_yen: 220,
    benefit_basis: 'ミュージアム コレクション一般220円（コレクション展入場） / 企画展は一般料金の団体割引相当額（展覧会により異なる）'
  },
  // Reviewed source correction (checked 2026-08-12): the Pass covers the
  // MOT Collection admission valued at ¥500. Special exhibitions use the
  // general group-rate equivalent discount; some exhibitions are excluded.
  '74': {
    admission_label: 'MOTコレクション入場 / 企画展割引:一般料金の団体割引相当額',
    pass_notes: [
      'MOTコレクション入場',
      '企画展割引:一般料金の団体割引相当額（展覧会により異なる。一部割引対象外）'
    ],
    pass_benefit_yen: 500,
    regular_price_yen: 500,
    benefit_basis: 'MOTコレクション一般500円（MOTコレクション入場） / 企画展は一般料金の団体割引相当額（展覧会により異なる。一部割引対象外）'
  }
};

DATA.forEach(area => area.facilities.forEach(facility => {
  const correction = FACILITY_DATA_CORRECTIONS[facility._key];
  if (correction) Object.assign(facility, correction);
}));
