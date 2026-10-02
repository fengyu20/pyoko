// i18n 的词表完整性、语言状态和稀疏 overlay 回退测试。
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');

function loadUi() {
  const window = {
    location: { href: 'http://localhost/index.html' },
    navigator: { language: 'ja' },
    localStorage: { getItem: () => null, setItem: () => {} }
  };
  const context = vm.createContext({ window, URL });
  vm.runInContext(fs.readFileSync(path.join(root, 'i18n/ui.js'), 'utf8'), context, { filename: 'i18n/ui.js' });
  vm.runInContext(fs.readFileSync(path.join(root, 'data/facility-brochure.js'), 'utf8'), context, { filename: 'data/facility-brochure.js' });
  return window;
}

test('a query-selected language is retained for local About navigation', () => {
  let storedLanguage = '';
  const window = {
    location: { href: 'http://localhost/index.html?lang=en' },
    navigator: { language: 'ja' },
    localStorage: {
      getItem: () => storedLanguage,
      setItem: (_key, value) => { storedLanguage = value; }
    }
  };
  const context = vm.createContext({ window, URL });
  vm.runInContext(fs.readFileSync(path.join(root, 'i18n/ui.js'), 'utf8'), context, { filename: 'i18n/ui.js' });
  assert.equal(window.getAppLanguage(), 'en');
  assert.equal(storedLanguage, 'en');
});

function loadOverlays() {
  const window = {};
  const context = vm.createContext({ window });
  for (const file of ['data/facilities.js', 'data/i18n/facilities.en.js', 'data/i18n/facilities.zh.js', 'data/search-aliases.js'])
    vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
  vm.runInContext(';globalThis.__data = DATA;', context);
  return { data: context.__data, overlays: window.FACILITY_I18N, searchConfig: window.SEARCH_INDEX_CONFIG };
}

test('all supported languages expose the same UI key set', () => {
  const window = loadUi();
  const tables = Object.values(window.UI_STRINGS).map(table => new Set(Object.keys(table)));
  assert.deepEqual([...tables[1]].sort(), [...tables[0]].sort());
  assert.deepEqual([...tables[2]].sort(), [...tables[0]].sort());
});

test('mobile discovery controls have localized copy in every supported language', () => {
  const window = loadUi();
  for (const language of ['ja', 'en', 'zh']) {
    window.setAppLanguage(language);
    for (const key of ['controls.dateTime', 'controls.done', 'controls.useNow', 'controls.openSearch', 'controls.filterShort', 'controls.list', 'controls.map']) {
      assert.ok(window.t(key), `${key} missing for ${language}`);
      assert.notEqual(window.t(key), key);
    }
    assert.match(window.t('controls.editDateTime', { value: '8/13 · 17:53' }), /8\/13 · 17:53/);
    assert.equal(window.t('controls.dateTimeSummary', { date: '8/13', time: '17:53' }), '8/13 · 17:53');
  }
  // Retired toolbar chrome must not leave dead keys behind.
  for (const table of Object.values(window.UI_STRINGS)) {
    assert.equal(table['controls.compact'], undefined);
    assert.equal(table['controls.collapse'], undefined);
  }
});

test('the condition date uses a compact locale form and only shows a foreign year', () => {
  const window = loadUi();
  const expected = {
    ja: { short: '8/13', long: '2027/3/31' },
    en: { short: 'Aug 13', long: 'Mar 31, 2027' },
    zh: { short: '8/13', long: '2027/3/31' }
  };
  for (const [language, forms] of Object.entries(expected)) {
    window.setAppLanguage(language);
    assert.equal(window.formatUiCompactDate('2026-08-13', {}), forms.short);
    assert.equal(window.formatUiCompactDate('2027-03-31', { withYear: true }), forms.long);
  }
});

test('visited tracker labels are translated in every supported language', () => {
  const window = loadUi();
  for (const language of ['ja', 'en', 'zh']) {
    window.setAppLanguage(language);
    assert.ok(window.t('pass.trackerTitle'));
    assert.ok(window.t('pass.visitedCount', { count: 2 }));
    assert.ok(window.t('pass.storageNote'));
    assert.ok(window.t('filters.unvisited'));
    assert.ok(window.t('filters.visitStatusAria'));
    assert.ok(window.t('filters.onlyVisited'));
  }
});

test('personal-state feedback uses short, consistent add actions in every language', () => {
  const window = loadUi();
  const expected = {
    ja: {
      want: '「行きたい」に追加しました',
      wantAction: 'リストを見る',
      visited: '「訪問済み」に記録しました',
      visitedAction: '記録を見る',
      combined: '訪問済みに記録し、「行きたい」から削除しました'
    },
    en: {
      want: 'Added to Want to go',
      wantAction: 'View list',
      visited: 'Marked as visited',
      visitedAction: 'View record',
      combined: 'Marked visited and removed from Want to go'
    },
    zh: {
      want: '已加入“想去”',
      wantAction: '查看列表',
      visited: '已记录为“去过”',
      visitedAction: '查看记录',
      combined: '已标记为去过，并从“想去”中移除'
    }
  };
  for (const [language, copy] of Object.entries(expected)) {
    window.setAppLanguage(language);
    assert.equal(window.t('pass.wantToGoAddedToast'), copy.want);
    assert.equal(window.t('pass.wantToGoAddedAction'), copy.wantAction);
    assert.equal(window.t('pass.visitedAddedToast'), copy.visited);
    assert.equal(window.t('pass.visitedAddedAction'), copy.visitedAction);
    assert.equal(window.t('pass.visitedFromWantToast'), copy.combined);
  }
});

test('break-even copy states the reference-value model rather than actual savings', () => {
  const window = loadUi();
  const expected = {
    ja: '参考価値では、あと700円でパス価格相当',
    en: '¥700 more in reference value to match the pass price',
    zh: '按参考价值，再 ¥700 达到通票价格'
  };
  for (const [language, text] of Object.entries(expected)) {
    window.setAppLanguage(language);
    assert.equal(window.t('pass.amountRemaining', { amount: language === 'ja' ? '700円' : '¥700' }), text);
    // Visiting a facility proves attendance, not what was paid — no My Pass
    // string may claim the visitor actually saved this money.
    for (const key of ['pass.totalReferenceValue', 'pass.referenceAmount', 'pass.paidOff', 'pass.entrySummary'])
      assert.doesNotMatch(window.t(key, { amount: '¥700', count: 2 }), /お得|saved|已省|节省/i, `${language} ${key}`);
  }
});

test('compact My Pass copy keeps reference-value semantics and the validity rule', () => {
  const window = loadUi();
  const expected = {
    ja: {
      matches: 'パス価格相当',
      remaining: '参考価値であと700円',
      mixed: '訪問済み 2施設 · 参考価値 700円（概算含む）',
      validity: '初回利用から2か月',
      final: '2026年度 最終利用日 2027年3月31日'
    },
    en: {
      matches: 'Matches pass price',
      remaining: '¥700 more in reference value',
      mixed: '2 visited · Reference value ¥700 (incl. estimates)',
      validity: 'Valid for 2 months from first use',
      final: '2026 edition final-use date: Mar 31, 2027'
    },
    zh: {
      matches: '达到通票票价',
      remaining: '参考价值还差¥700',
      mixed: '已去过2家 · 参考价值 ¥700（含估算）',
      validity: '首次使用起2个月',
      final: '2026年度最晚使用至 2027年3月31日'
    }
  };
  for (const [language, text] of Object.entries(expected)) {
    window.setAppLanguage(language);
    const amount = language === 'ja' ? '700円' : '¥700';
    assert.equal(window.t('pass.matchesPassPrice'), text.matches);
    assert.equal(window.t('pass.remainingCompact', { amount }), text.remaining);
    assert.equal(window.t('pass.entrySummaryMixed', { count: 2, amount }), text.mixed);
    assert.equal(window.t('pass.validityRule'), text.validity);
    assert.equal(window.t('pass.editionFinalUse', { year: 2026, date: window.formatUiDate('2027-03-31') }), text.final);
    // Compact wording must never claim actual savings or a personal expiry.
    for (const key of ['pass.matchesPassPrice', 'pass.remainingCompact', 'pass.entrySummaryMixed', 'pass.validityRule', 'pass.editionFinalUse']) {
      assert.doesNotMatch(window.t(key, { amount: '¥700', count: 2, year: 2026, date: '2027年3月31日' }), /saved|savings|paid off|お得|已省|节省|あなたの|your |你的/i, `${language} ${key}`);
    }
  }
});

test('Hero hierarchy copy localizes proposition, edition, freshness, and official boundary', () => {
  const window = loadUi();
  const expected = {
    ja: {
      unofficial: '非公式', proposition: 'ぐるっとパスで、次はどこへ。', context: '展覧会ガイド',
      edition: '2026年版', updated: '8月10日更新', official: '購入・最新情報は公式サイトへ ↗'
    },
    en: {
      unofficial: 'Unofficial', proposition: 'Where to next with your Grutto Pass?', context: 'Exhibition guide',
      edition: '2026 edition', updated: 'Updated Aug 10', official: 'Buy & check latest info on the official site ↗'
    },
    zh: {
      unofficial: '非官方', proposition: '拿着 Grutto Pass，下一站去哪？', context: '展览指南',
      edition: '2026版', updated: '8月10日更新', official: '购买及最新信息请查看官网 ↗'
    }
  };

  for (const language of Object.keys(expected)) {
    window.setAppLanguage(language);
    assert.equal(window.t('brand.unofficial'), expected[language].unofficial);
    assert.equal(window.t('app.heroTitle'), expected[language].proposition);
    assert.equal(window.t('app.pageContext'), expected[language].context);
    assert.equal(window.t('hero.editionLabel', { year: 2026 }), expected[language].edition);
    assert.equal(window.t('hero.updated', { date: window.formatUiShortDate('2026-08-10') }), expected[language].updated);
    assert.equal(window.t('hero.officialLink'), expected[language].official);
    assert.equal(window.formatUiDate('2026-08-10').includes('2026'), true);
  }
});

test('brand page identity and description stay separate from the hero proposition', () => {
  const window = loadUi();
  const expected = {
    ja: {
      title: '東京・ミュージアム ぐるっとパス2026 非公式ガイド | PYOKO',
      description: '開館状況・対象展・ぐるっとパスの特典を、出典・確認日つきでまとめて確認。気になる施設を保存して、地図や訪問記録から次の一館を決められる非公式ガイドです。',
      social: '開館状況・対象展・ぐるっとパスの特典を、出典・確認日つきで確認。施設を保存し、地図や訪問記録から次の一館を決められる非公式ガイド。'
    },
    en: {
      title: 'Tokyo Museum Grutto Pass 2026 Unofficial Guide | PYOKO',
      description: "See what's open, which exhibitions are covered by the Grutto Pass, and the reference value of each benefit — with sources and verification dates. Save places and use the map and visit history to decide where to go next. Unofficial guide.",
      social: "See what's open, which Grutto Pass exhibitions are covered, and each benefit's reference value — with sources and verification dates. Save places and decide where to go next. Unofficial guide."
    },
    zh: {
      title: '东京·博物馆 Grutto Pass 2026 非官方指南 | PYOKO',
      description: '查看场馆开放状态、Grutto Pass 对象展览与优惠内容，每条信息均标注官方出处和核验日期。收藏想去的场馆，结合地图与到访记录决定下一站。非官方指南。',
      social: '查看开放状态、Grutto Pass 对象展览和优惠内容，参考官方出处与核验日期；收藏场馆，结合地图和到访记录决定下一站。非官方指南。'
    }
  };

  for (const [language, copy] of Object.entries(expected)) {
    window.setAppLanguage(language);
    assert.equal(window.t('app.title', { year: 2026 }), copy.title);
    assert.equal(window.t('app.description', { year: 2026 }), copy.description);
    assert.equal(window.t('meta.socialDescription'), copy.social);
  }
});

test('visit information labels use the reviewed terminology in every language', () => {
  const window = loadUi();
  const expected = {
    ja: { title: '来館案内', closed: '休館日', fee: '料金', access: 'アクセス', link: '公式サイトで確認 →' },
    en: { title: 'Visit information', closed: 'Closed days', fee: 'Fee', access: 'Access', link: 'Check official site →' },
    zh: { title: '参观信息', closed: '休馆日', fee: '费用', access: '交通', link: '查看官方网站 →' }
  };
  for (const language of Object.keys(expected)) {
    window.setAppLanguage(language);
    assert.equal(window.t('facility.moreDetails'), expected[language].title);
    assert.equal(window.t('field.closed'), expected[language].closed);
    assert.equal(window.t('field.fee'), expected[language].fee);
    assert.equal(window.t('field.access'), expected[language].access);
    assert.equal(window.t('facility.checkOfficialSite'), expected[language].link);
    assert.ok(window.t('facility.variesByExhibition'));
  }
});

test('pass presentation keeps entitlement, amount and basis in separate slots', () => {
  const window = loadUi();
  const { data, overlays, searchConfig } = loadOverlays();
  window.FACILITY_I18N = overlays;
  window.SEARCH_INDEX_CONFIG = searchConfig;
  const facilities = data.flatMap(area => area.facilities);

  window.setAppLanguage('en');
  // Without a scoped record the model still produces a usable summary from
  // pass_types alone, and never fabricates a value or a basis.
  const admissionOnly = window.getPassPresentation(
    facilities.find(facility => facility._key === '1'),
    { passTypes: ['admission'] }
  );
  assert.deepEqual([...admissionOnly.phrases], ['Free admission']);
  assert.equal(admissionOnly.reference, null);
  assert.equal(admissionOnly.value, null);
  assert.equal(admissionOnly.clauses.length, 0);

  const entitlements = {
    official_clauses: [
      { label_ja: '入場', wording_ja: '常設展入場' },
      { label_ja: '割引', wording_ja: '特別展‥一般料金の20%引' }
    ],
    benefits: [
      {
        clause_index: 0, type: 'admission', scopes: ['permanent_collection'],
        official_wording: { ja: '常設展入場' }, interprets_ja: null,
        price_mode: 'fixed', regular_price_yen: 800, saving_yen: 800, discount_rate: null
      },
      {
        clause_index: 1, type: 'discount_percent', scopes: ['special_exhibition'],
        official_wording: { ja: '特別展‥一般料金の20%引' }, interprets_ja: null,
        price_mode: 'exhibition_variable', regular_price_yen: null, saving_yen: null, discount_rate: 0.2
      }
    ]
  };
  const mixed = window.getPassPresentation({}, {
    entitlements,
    comparable: {
      value_yen: 800,
      value_basis: { benefit_index: 0, benefit_type: 'admission', scope: 'permanent_collection', regular_price_yen: 800 },
      source: 'scoped'
    },
    passTypes: ['admission', 'discount']
  });
  assert.deepEqual([...mixed.phrases], ['Permanent collection · Free admission', 'Special exhibitions · 20% off']);
  assert.equal(mixed.reference.amount, '¥800');
  assert.match(mixed.reference.basis, /Permanent collection/);
  // The amount modifies neither entitlement sentence.
  assert.doesNotMatch(mixed.phrases.join(' '), /800/);
  // A brochure separator is punctuation; the wording itself stays verbatim.
  assert.equal(mixed.clauses[1].official, '特別展：一般料金の20%引');

  for (const facility of facilities) {
    const view = window.getPassPresentation(facility, { passTypes: facility.pass_types });
    for (const phrase of view.phrases) {
      assert.doesNotMatch(phrase, /Grutto Pass/i, `repeated pass name in ${facility._key}`);
      assert.doesNotMatch(phrase, /Estimated value|^admission$|^discount:/i, `raw pass copy for ${facility._key}`);
    }
  }
});

test('reviewed mixed Pass overlays keep the collection scope and exhibition conditions', () => {
  const window = loadUi();
  const { data, overlays, searchConfig } = loadOverlays();
  window.FACILITY_I18N = overlays;
  window.SEARCH_INDEX_CONFIG = searchConfig;
  const facilities = data.flatMap(area => area.facilities);
  const set = key => facilities.find(facility => facility._key === key);

  window.setAppLanguage('en');
  const english51 = set('51');
  const english74 = set('74');
  const english51Basis = window.tField(english51, 'benefit_basis', '');
  const english74Basis = window.tField(english74, 'benefit_basis', '');
  assert.match(english51Basis.toLowerCase(), /museum collection|group-rate-equivalent|varies by exhibition/);
  assert.match(window.tField(english51, 'pass_notes', []).join(' '), /Free admission to the Museum Collection/);
  assert.match(window.tField(english51, 'pass_notes', []).join(' '), /amount varies by exhibition/);
  assert.match(english74Basis.toLowerCase(), /mot collection|group-rate-equivalent|excluded/);
  assert.match(window.tField(english74, 'pass_notes', []).join(' '), /Free admission to the MOT Collection/);
  assert.match(window.tField(english74, 'pass_notes', []).join(' '), /some exhibitions are excluded/);
  assert.doesNotMatch(`${english51Basis} ${window.tField(english51, 'pass_notes', []).join(' ')}`, /¥200/);
  assert.doesNotMatch(`${english74Basis} ${window.tField(english74, 'pass_notes', []).join(' ')}`, /¥460/);

  window.setAppLanguage('zh');
  const chinese51 = set('51');
  const chinese74 = set('74');
  const chinese51Copy = `${window.tField(chinese51, 'benefit_basis', '')} ${window.tField(chinese51, 'pass_notes', []).join(' ')}`;
  const chinese74Copy = `${window.tField(chinese74, 'benefit_basis', '')} ${window.tField(chinese74, 'pass_notes', []).join(' ')}`;
  assert.match(chinese51Copy, /收藏展|企划展|团体票价|因展览而异/);
  assert.match(window.tField(chinese74, 'pass_notes', []).join(' '), /MOT收藏展免费入场/);
  assert.match(window.tField(chinese74, 'pass_notes', []).join(' '), /部分展览不适用/);
  assert.doesNotMatch(chinese51Copy, /¥200/);
  assert.doesNotMatch(chinese74Copy, /¥460/);
});

test('Japanese-source markers use compact visible text and complete accessible text', () => {
  const window = loadUi();
  window.setAppLanguage('en');
  assert.equal(window.t('exhibition.japaneseOnlyShort'), 'JP');
  assert.equal(window.t('exhibition.japaneseOnly'), 'Japanese only');
  window.setAppLanguage('zh');
  assert.equal(window.t('exhibition.japaneseOnlyShort'), '日文');
  assert.equal(window.t('exhibition.japaneseOnly'), '仅日文');
});

test('annual schedule labels are natural and include the configured year', () => {
  const window = loadUi();
  const expected = {
    ja: '2026年 展覧会スケジュール · 3件',
    en: '2026 exhibition schedule · 3 exhibitions',
    zh: '2026年展览日程 · 3项展览'
  };
  for (const language of ['ja', 'en', 'zh']) {
    window.setAppLanguage(language);
    const label = window.t('schedule.summary', { year: 2026 }) + window.t('schedule.count', { count: 3 });
    assert.equal(label, expected[language]);
    assert.doesNotMatch(label, /Show|total|显示全年/);
  }
});

test('language state and sparse content overlays use reviewed exhibition translations', () => {
  const window = loadUi();
  const { data, overlays, searchConfig } = loadOverlays();
  window.FACILITY_I18N = overlays;
  window.SEARCH_INDEX_CONFIG = searchConfig;
  window.setAppLanguage('en');

  const facility = data[0].facilities[0];
  const item = facility.enriched[0];
  assert.equal(window.getAppLanguage(), 'en');
  assert.equal(window.tField(facility, 'name', facility.name), 'Taito Shitamachi Museum');
  assert.equal(window.getLocalizedEnrichedField(facility, item, 'title', item.title), 'Mural: Asakusa Big Parade — Koji Kada’s Stars of Asakusa');
  assert.equal(window.getLocalizedEnrichedField(facility, item, 'summary', item.fields['概要']), 'A recreation of the mural and kamishibai works by Koji Kada featuring Asakusa stars.');
  assert.match(window.getEnrichedTranslation(facility, item).summary, /recreation/i);

  const untranslatedFacility = data.at(-1).facilities.at(-1);
  assert.equal(window.tField(untranslatedFacility, 'name', untranslatedFacility.name), 'Saitama Prefectural Museum of History and Folklore');
  window.setAppLanguage('zh');
  assert.equal(window.tField(untranslatedFacility, 'name', untranslatedFacility.name), '埼玉县立历史与民俗博物馆');
});

test('English and Chinese core fields never leak Japanese script', () => {
  const window = loadUi();
  const { data, overlays, searchConfig } = loadOverlays();
  window.FACILITY_I18N = overlays;
  window.SEARCH_INDEX_CONFIG = searchConfig;
  const facilities = data.flatMap(area => area.facilities);
  const fields = ['admission_label', 'closed', 'fee', 'access', 'notes', 'pass_notes', 'benefit_basis', 'tel'];

  for (const language of ['en', 'zh']) {
    window.setAppLanguage(language);
    for (const facility of facilities) {
      for (const field of fields) {
        const value = window.tField(facility, field, facility[field]);
        for (const entry of (Array.isArray(value) ? value : [value])) {
          assert.doesNotMatch(String(entry || ''), /[\u3040-\u30ff]/, `${language} ${facility._key} ${field}`);
        }
      }
    }
  }

  const ueno = facilities.find(facility => facility._key === '1');
  window.setAppLanguage('en');
  assert.match(window.tField(ueno, 'access', ueno.access).join(' '), /Ueno Station/);
  assert.match(window.tField(ueno, 'closed', ueno.closed).join(' '), /Mondays/);
  const westernArt = facilities.find(facility => facility._key === '3');
  const westernItem = westernArt.enriched[0];
  assert.equal(window.tField(westernArt, 'tel', westernArt.tel), '050-5541-8600 (Hello Dial)');
  assert.match(window.tField(westernArt, 'admission_label', westernArt.admission_label), /Permanent collection discount:/);
  assert.equal(window.getLocalizedEnrichedField(westernArt, westernItem, 'fee', westernItem.fields['料金']), 'after using the Grutto Pass ¥400 (permanent collection admission fee)');
  assert.equal(window.getLocalizedEnrichedField(westernArt, westernItem, 'hours', westernItem.fields['時間']), '9:30–17:30 (Fridays / Saturdays until 20:00)');
  window.setAppLanguage('zh');
  assert.match(window.tField(ueno, 'access', ueno.access).join(' '), /上野站/);
  assert.match(window.tField(ueno, 'closed', ueno.closed).join(' '), /周一/);
  assert.equal(window.tField(westernArt, 'tel', westernArt.tel), '050-5541-8600（咨询热线）');
  assert.equal(window.getLocalizedEnrichedField(westernArt, westernItem, 'fee', westernItem.fields['料金']), '使用通票后 ¥400（常设展入场费）');

  const operaCity = facilities.find(facility => facility._key === '57');
  window.setAppLanguage('en');
  const englishAccess = window.tField(operaCity, 'access', operaCity.access).join(' ');
  assert.match(englishAccess, /Hatsudai Station/);
  assert.doesNotMatch(englishAccess, /Access details are available/);
  window.setAppLanguage('zh');
  const chineseAccess = window.tField(operaCity, 'access', operaCity.access).join(' ');
  assert.match(chineseAccess, /初台站/);
  assert.doesNotMatch(chineseAccess, /交通详情请查看官方网站/);
});

test('all facility access values have direct English and Chinese translations', () => {
  const window = loadUi();
  const { data, overlays, searchConfig } = loadOverlays();
  window.FACILITY_I18N = overlays;
  window.SEARCH_INDEX_CONFIG = searchConfig;
  const facilities = data.flatMap(area => area.facilities);
  const fallback = {
    en: /Access details are available on the official site\./,
    zh: /交通详情请查看官方网站。/
  };

  for (const language of ['en', 'zh']) {
    window.setAppLanguage(language);
    for (const facility of facilities) {
      const translated = window.tField(facility, 'access', facility.access);
      const values = Array.isArray(translated) ? translated : [translated];
      assert.ok(values.length && values.every(value => String(value).trim()), `${language} ${facility._key} access is empty`);
      assert.ok(values.every(value => !/[\u3040-\u30ff]/.test(String(value))), `${language} ${facility._key} access contains Japanese script`);
      assert.ok(values.every(value => !fallback[language].test(String(value))), `${language} ${facility._key} access uses generic fallback`);
    }
  }
});

test('English facility cards expose readable names and basic fields', () => {
  const window = loadUi();
  const { data, overlays, searchConfig } = loadOverlays();
  window.FACILITY_I18N = overlays;
  window.SEARCH_INDEX_CONFIG = searchConfig;
  window.setAppLanguage('en');

  const facilities = data.flatMap(area => area.facilities);
  const englishName = facility => window.tField(facility, 'name', facility.name);
  const values = facility => field => {
    const value = window.tField(facility, field, facility[field]);
    return (Array.isArray(value) ? value : [value]).join(' ');
  };

  assert.equal(facilities.length, 108);
  assert.ok(facilities.every(facility => /[A-Za-z]/.test(englishName(facility))));

  const moriOgai = facilities.find(facility => facility._key === '15');
  assert.equal(englishName(moriOgai), 'Mori Ogai Memorial Museum');
  assert.match(values(moriOgai)('closed'), /Tuesdays|Mondays|closure/i);
  assert.match(values(moriOgai)('fee'), /Adults|¥|exhibition/i);
  assert.match(values(moriOgai)('access'), /Tokyo Metro|Station|walk/i);

  const olympicMuseum = facilities.find(facility => facility._key === '55');
  assert.equal(englishName(olympicMuseum), 'Japan Olympic Museum');
  assert.match(values(olympicMuseum)('access'), /Access details are available|Tokyo Metro|Toei|JR/);
});

test('exhibition title language markers distinguish translated titles from JP-only titles', () => {
  const window = loadUi();
  const { data, overlays, searchConfig } = loadOverlays();
  window.FACILITY_I18N = overlays;
  window.SEARCH_INDEX_CONFIG = searchConfig;
  const facilities = data.flatMap(area => area.facilities);
  const translatedItem = facilities.find(facility => facility._key === '1').enriched[0];
  const untranslatedFacility = facilities.find(facility => facility._key === '15');
  const untranslatedItem = untranslatedFacility.enriched[0];

  window.setAppLanguage('en');
  const translatedFacility = facilities.find(facility => facility._key === '1');
  assert.equal(window.isJapaneseOnlyExhibition(translatedFacility, translatedItem), false);
  assert.equal(window.getLocalizedEnrichedField(translatedFacility, translatedItem, 'title', translatedItem.title), 'Mural: Asakusa Big Parade — Koji Kada’s Stars of Asakusa');
  assert.equal(window.getLocalizedEnrichedField(translatedFacility, translatedItem, 'summary', translatedItem.fields['概要']), 'A recreation of the mural and kamishibai works by Koji Kada featuring Asakusa stars.');
  assert.equal(window.isJapaneseOnlyExhibition(untranslatedFacility, untranslatedItem), true);

  const supportingOnlyFacility = { ...translatedFacility, _key: 'supporting-only' };
  const supportingOnlyItem = {
    ...translatedItem,
    title: '原題のままの補足テキスト',
    fields: { ...translatedItem.fields, 概要: '未翻訳の補足説明' }
  };
  overlays.en.exhibitions[`supporting-only::${supportingOnlyItem.url}::${supportingOnlyItem.title}`] = {
    title: 'Translated title with an untranslated supporting field'
  };
  assert.equal(window.isJapaneseOnlyExhibition(supportingOnlyFacility, supportingOnlyItem), false);
  assert.equal(window.getLocalizedEnrichedField(supportingOnlyFacility, supportingOnlyItem, 'summary', supportingOnlyItem.fields['概要']), '未翻訳の補足説明');

  window.setAppLanguage('ja');
  assert.equal(window.isJapaneseOnlyExhibition(translatedFacility, translatedItem), false);
  assert.equal(window.isJapaneseOnlyExhibition(untranslatedFacility, untranslatedItem), false);
});

test('search text includes English and Chinese overlay terms', () => {
  const window = loadUi();
  const { data, overlays, searchConfig } = loadOverlays();
  window.FACILITY_I18N = overlays;
  window.SEARCH_INDEX_CONFIG = searchConfig;
  const facility = data[0].facilities[0];
  const searchText = window.getSearchableFacilityText(facility).join(' ');
  assert.match(searchText, /Taito Shitamachi Museum/);
  assert.match(searchText, /台东区下町博物馆/);
  assert.match(searchText, /Mural: Asakusa Big Parade/);
  assert.match(searchText, /壁画：浅草大游行/);
});

test('Japan Olympic Museum search aliases are available in English and Chinese', () => {
  const window = loadUi();
  const { data, overlays, searchConfig } = loadOverlays();
  window.FACILITY_I18N = overlays;
  window.SEARCH_INDEX_CONFIG = searchConfig;
  const olympicMuseum = data.flatMap(area => area.facilities).find(facility => facility.name.includes('オリンピック'));
  assert.ok(olympicMuseum);
  const searchText = window.getSearchableFacilityText(olympicMuseum).join(' ');
  assert.match(searchText, /Japan Olympic Museum/);
  assert.match(searchText, /日本奥林匹克博物馆/);
});

test('place-name search aliases resolve across the Japanese, English, and Chinese forms', () => {
  const window = loadUi();
  const { data, overlays, searchConfig } = loadOverlays();
  window.FACILITY_I18N = overlays;
  window.SEARCH_INDEX_CONFIG = searchConfig;
  const facilities = data.flatMap(area => area.facilities);
  const hits = query => facilities
    .filter(facility => window.searchTextMatches(window.getSearchableFacilityText(facility).join(' '), query))
    .map(facility => facility._key);
  for (const query of ['横浜', 'yokohama', '横滨']) {
    assert.ok(hits(query).some(key => ['100', '101', '102', '103', '104'].includes(key)), `expected Yokohama facility for ${query}`);
  }
  assert.equal(hits('yokohama').join(','), '100,101,102,103,104');
});

test('generated localized facility display names remain searchable', () => {
  const window = loadUi();
  const { data, overlays, searchConfig } = loadOverlays();
  window.FACILITY_I18N = overlays;
  window.SEARCH_INDEX_CONFIG = searchConfig;
  const facility = data.flatMap(area => area.facilities).find(item => item._key === '52');
  const searchText = window.getSearchableFacilityText(facility).join(' ');

  assert.equal(window.searchTextMatches(searchText, 'Soseki Sanbo Memorial Museum'), true);
  assert.equal(window.searchTextMatches(searchText, '新宿区立漱石山房纪念馆'), true);
});

test('every facility has a complete search record and every configured alias resolves', () => {
  const window = loadUi();
  const { data, overlays, searchConfig } = loadOverlays();
  window.FACILITY_I18N = overlays;
  window.SEARCH_INDEX_CONFIG = searchConfig;
  const facilities = data.flatMap(area => area.facilities);
  for (const facility of facilities) {
    const searchText = window.getSearchableFacilityText(facility).join(' ');
    assert.ok(searchText.includes(facility.name), `missing canonical name for ${facility._key}`);
    for (const alias of searchConfig.facilityAliases[facility._key]) {
      assert.equal(window.searchTextMatches(searchText, alias), true, `alias does not resolve: ${facility._key} / ${alias}`);
    }
  }
});

test('the personal-state filter is one dimension and its retired copy is gone', () => {
  const window = loadUi();
  // Want to go used to be a separate switch beside a "visit status" group.
  // Merging them retires the group's old label; a dead key would be free to
  // reappear on a surface that no longer exists.
  for (const table of Object.values(window.UI_STRINGS)) {
    assert.equal(table['filters.visitStatus'], undefined);
    assert.equal(table['filters.visitStatusAria'], undefined);
  }
  for (const language of ['ja', 'en', 'zh']) {
    window.setAppLanguage(language);
    for (const key of ['filters.myList', 'filters.myListAria', 'filters.unvisited', 'filters.onlyVisited', 'filters.wantToGoOnly']) {
      assert.ok(window.t(key), `${key} missing for ${language}`);
      assert.notEqual(window.t(key), key);
    }
  }
});

test('the open-now filter copy stops claiming "today" once a date and time are chosen', () => {
  const window = loadUi();
  // The filter matches the SELECTED date and time, so the variant shown in that
  // mode must not assert the present day in any language.
  const claimsToday = /今日|today|今天/i;
  for (const language of ['ja', 'en', 'zh']) {
    window.setAppLanguage(language);
    for (const key of ['filters.nowOpenAtSelected', 'filters.statusInfoNowSelected']) {
      const value = window.t(key);
      assert.ok(value, `${key} missing for ${language}`);
      assert.notEqual(value, key);
      assert.doesNotMatch(value, claimsToday, `${key} still claims "today" in ${language}`);
    }
    // The live-mode variant is untouched and stays distinct from it.
    assert.notEqual(window.t('filters.nowOpen'), window.t('filters.nowOpenAtSelected'));
    assert.notEqual(window.t('filters.statusInfoNow'), window.t('filters.statusInfoNowSelected'));
  }
});
