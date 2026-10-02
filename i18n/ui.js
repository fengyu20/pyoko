/*
 * Buildless UI translations.
 *
 * Japanese data remains the source of truth. This file owns only stable UI
 * copy and the small runtime messages produced by the status/map layers.
 * Content translations live in data/i18n/*.js and are intentionally sparse.
 */
(function (root) {
  const UI_STRINGS = {
    ja: {
      'app.title': '東京・ミュージアム ぐるっとパス{year} 非公式ガイド | PYOKO',
      'app.description': '開館状況・対象展・ぐるっとパスの特典を、出典・確認日つきでまとめて確認。気になる施設を保存して、地図や訪問記録から次の一館を決められる非公式ガイドです。',
      'meta.socialDescription': '開館状況・対象展・ぐるっとパスの特典を、出典・確認日つきで確認。施設を保存し、地図や訪問記録から次の一館を決められる非公式ガイド。',
      'app.eyebrow': '東京・ミュージアム ぐるっとパス',
      'app.heroTitle': 'ぐるっとパスで、次はどこへ。',
      'app.pageContext': '展覧会ガイド',
      'hero.sub': '施設・展覧会を、日付・開館状況・パス種別・お得度で検索できます。',
      'brand.unofficial': '非公式',
      'hero.editionLabel': '{year}年版',
      'hero.officialLink': '購入・最新情報は公式サイトへ ↗',
      'hero.updated': '{date}更新',
      'edition.name': 'ぐるっとパス{year}',
      'pass.label': 'ぐるっとパス',
      'pass.benefitSectionAria': 'ぐるっとパスの特典',
      'pass.editionLabel': 'PASS {year}',
      'pass.price': '¥{amount}',
      'pass.until': '最終利用日 {date}',
      'pass.validityRule': '初回利用から2か月',
      'pass.editionFinalUse': '{year}年度 最終利用日 {date}',
      'pass.aria': 'PASS {year} {price} {until}',
      'pass.trackerKicker': 'PASS TRACKER',
      'pass.trackerTitle': 'あなたのぐるっとパス',
      'pass.entrySummary': '訪問済み {count}施設 · 参考価値 {amount}',
      'pass.entrySummaryUnknown': '訪問済み {count}施設 · 参考価値は未確認',
      'pass.entrySummaryMixed': '訪問済み {count}施設 · 参考価値 {amount}（概算含む）',
      'pass.trackVisits': '訪問記録をつけて、参考価値を確認',
      'pass.paidOff': '参考価値がパス価格に到達',
      'pass.matchesPassPrice': 'パス価格相当',
      'pass.amountRemaining': '参考価値では、あと{amount}でパス価格相当',
      'pass.remainingCompact': '参考価値であと{amount}',
      'pass.amountAhead': '参考価値でパス価格を{amount}超過',
      'pass.visitedFacilities': '訪問済み施設',
      'pass.visitedMetric': '{count}施設',
      'pass.totalReferenceValue': '参考価値の合計',
      'pass.totalReferenceValueMixed': '参考価値の合計（概算を含む）',
      'pass.passPrice': 'パス価格',
      'pass.unknownSavings': '参考価値が未確認の{count}施設は合計に含めていません',
      'pass.unknownSavingsSingle': '参考価値が未確認の{count}施設は合計に含めていません',
      'pass.savingsNotIncluded': '参考価値は未確認',
      'pass.referenceAmount': '参考 {amount}',
      'pass.noVisits': 'まだ訪問記録はありません',
      'pass.close': '閉じる',
      'pass.chip': 'PASS {price} · {count}/{total}',
      'pass.chipProgress': '参考価値 {amount} · {count}/{total}',
      'pass.visitedCount': '訪問済み {count}施設',
      'pass.valueTotal': '参考価値の合計 {amount}',
      'pass.recovered': '🎉 参考価値がパス価格に到達 · {amount} 超過',
      'pass.remaining': '参考価値では、あと {amount}でパス価格相当',
      'pass.unknownValue': '参考価値が未確認の{count}施設は合計に含めていません',
      'pass.storageNote': '訪問記録はこの端末にのみ保存されます。ログインは不要です。',
      'pass.clear': '記録を消去',
      'pass.clearToast': '訪問記録を消去しました',
      'pass.undo': '元に戻す',
      'pass.markVisited': '行った',
      'pass.markVisitedAria': '{name}を訪問済みにする',
      'pass.unmarkVisitedAria': '{name}の訪問済みを外す',
      'pass.markWantToGo': '行きたい',
      'pass.wantToGoTab': '行きたい',
      'pass.visitedTab': '訪問済み',
      'pass.collectionsAria': '個人コレクション',
      'pass.wantToGoEmpty': '気になる施設を「行きたい」に追加すると、ここでまとめて確認できます。',
      'pass.wantToGoCompact': '行きたい {count}',
      'facility.addWantToGo': '{name}を「行きたい」に追加',
      'facility.removeWantToGo': '{name}を「行きたい」から削除',
      'pass.freeWith': '入場無料',
      'pass.admissionAvailable': '対象展 入場無料',
      'pass.admissionUpcoming': '対象展は{from}から',
      'pass.admissionUnconfirmed': '対象展 未確認',
      'pass.dateApplicability': '対象期間',
      // Joins the confirmed eligible spans. A gap between exhibitions must read as
      // a break, not as one continuous period.
      'pass.periodSeparator': '・',
      'pass.browseCollection': '一覧・地図で見る',
      'pass.currentTargetUnconfirmed': '現在の対象展は未確認',
      'pass.listedTargetEnded': '掲載されている対象展は{to}に終了しました',
      'pass.youSave': '{amount}円お得',
      'pass.discountWith': '{amount}円引',
      'pass.discountUnknown': '割引あり',
      'pass.mixedWith': '入場無料・割引',
      'pass.eligibleWith': '特典あり',
      'pass.benefitVaries': '対象・金額は展覧会により異なります',
      'pass.basis.regularAdult': '一般料金',
      'pass.basis.permanentAdult': '常設展の一般料金',
      'pass.basis.permanent': '常設展',
      'pass.basis.specialAdult': '対象展の一般料金',
      'pass.basis.special': '対象展',
      'pass.basis.permanentAndSpecial': '常設展・対象展',
      'pass.basis.regularHours': '通常開館時間内の入場',
      'pass.basis.program': 'プラネタリウム・大型映像1回を含む',
      'pass.basis.permanentSpecialProgram': '常設展・対象展・プラネタリウム等1回',
      'pass.basis.eligible': '対象料金',
      'pass.scope.permanentCollection': '常設展',
      'pass.scope.temporaryExhibition': '企画展',
      'pass.scope.specialExhibition': '特別展',
      'pass.scope.collection': 'コレクション展',
      'pass.scope.garden': '庭園',
      'pass.scope.namedExhibition': '対象展',
      'pass.action.admission': '入場',
      'pass.action.discountFixed': '¥{amount}引',
      'pass.action.discountPercent': '{rate}%引',
      'pass.action.discountGroupRate': '団体料金相当の割引',
      'pass.action.discountUnspecified': '割引',
      'pass.phrase': '{scope} {action}',
      'pass.clause.admission': '入場',
      'pass.clause.discount': '割引',
      'pass.referenceValue': '参考価値',
      'pass.referenceShort': '参考 {amount}',
      'pass.referenceEstimate': '概算 {amount}',
      'pass.referenceBasis': '{basis}を基準',
      'pass.referenceBasisScoped': '{scope}の一般料金',
      'pass.referenceBasisGeneral': '一般料金',
      'pass.officialWording': '原文',
      'pass.referenceNote': '参考価値です。実際の料金・利用内容により異なります。',
      'pass.referenceLearnMore': '参考価値について',
      'source.aboutData': '情報・出典と判断について',
      'stats.overviewAria': '掲載情報の概要',
      'area.count': '全 {total} 件・詳細情報あり {enriched} 件',
      'language.label': '言語',
      'language.ja': '日本語',
      'language.en': 'English',
      'language.enShort': 'EN',
      'language.zh': '中文',
      'controls.searchLabel': '施設名・展覧会名を検索',
      'controls.skipToResults': '検索結果へ移動',
      'controls.searchPlaceholder': '施設名や展覧会名を検索…',
      'controls.date': '日付：',
      'controls.time': '時刻：',
      'controls.now': '今',
      'controls.useNow': '現在に戻す',
      'controls.dateTime': '日付と時刻',
      'controls.dateTimeSummary': '{date} · {time}',
      'controls.editDateTime': '日付と時刻を変更（{value}）',
      'controls.done': '完了',
      'controls.openSearch': '検索・条件を開く',
      'controls.filterShort': '絞り込み',
      'controls.timeReference': '{time} 時点の状況',
      'controls.view': '表示切替',
      'controls.list': 'リスト',
      'controls.map': 'マップ',
      'controls.filterToggle': '絞り込み・並び替え',
      'controls.quickFilters': 'よく使う絞り込み',
      'controls.clearFilters': '条件をすべてクリア',
      'results.total': '{count}件を表示',
      'results.filtered': '{total}件中 {count}件を表示 · 条件 {active}件',
      'results.feedback': '{total}件中 {count}件 · {active}条件を適用',
      'results.feedbackSingle': '{total}件中 {count}件 · 1条件を適用',
      'results.sortedTitle': '並び替え結果',
      'geo.use': '現在地を使う',
      'map.locate': '現在地',
      'map.locateAria': '現在地を取得して地図を移動',
      'map.recenterAria': '地図を現在地に戻す',
      'geo.update': '現在地を更新',
      'geo.loading': '取得中…',
      'geo.idle': '必要な時だけ位置情報を取得',
      'geo.label': '現在地から：',
      'geo.unsupported': 'このブラウザは位置情報に対応していません',
      'geo.loadingNote': '現在地を取得しています…',
      'geo.success': '現在地を取得しました（誤差およそ{meters}m）',
      'geo.denied': '位置情報の利用がブロックされています。ブラウザのアドレスバーの設定から許可してください',
      'geo.error': '現在地を取得できませんでした。電波の良い場所でもう一度お試しください',
      'geo.distance': '📍 直線 {distance}',
      'geo.distanceTitle': '直線距離です。実際の歩行距離・所要時間とは異なります',
      'geo.radiusNeedsLocation': '距離を指定するには、先に現在地を取得してください',
      'radius.none': '指定なし',
      'radius.1km': '1km以内',
      'radius.3km': '3km以内',
      'radius.5km': '5km以内',
      'filters.status': '開館状況：',
      'filters.statusAria': '開館状況で絞り込む',
      'filters.all': 'すべて',
      'filters.open': '開館',
      'filters.closed': '休館',
      'filters.nowOpen': 'いま開館中',
      'filters.nowOpenAtSelected': 'その時間に開館',
      'filters.openAtTimeSuggestion': '{time} に開館している施設だけ表示',
      'filters.statusInfoAria': '開館状況フィルターの説明',
      'filters.statusInfoIntro': '選択した日付の開館状況を表示します。',
      'filters.statusInfoOpen': '「開館」：通常の休館日ルールに該当しない施設',
      'filters.statusInfoClosed': '「休館」：通常休館日・既知の休館期間',
      'filters.statusInfoNow': '「いま開館中」：今日現在、開館中または最終入館間近の施設',
      'filters.statusInfoNowSelected': '「その時間に開館」：選択した日時に開館中、または最終入館が近い施設',
      'filters.statusInfoOther': '「要確認」「会期外」は「すべて」で確認できます',
      'filters.statusAdvisory': '開館状況は公開情報からの推定です。出発前に各カードの公式サイトでご確認ください。',
      'filters.passType': 'パスの種類：',
      'filters.passTypeAria': 'パスの種類で絞り込む',
      'filters.admission': '入場',
      'filters.discount': '割引',
      'filters.value': 'お得度：',
      'filters.value300': '300円以上',
      'filters.value500': '500円以上',
      'filters.value1000': '1,000円以上',
      'filters.sort': '並び替え：',
      'filters.sortNumber': '施設番号',
      'filters.sortBenefit': 'お得度 ↓',
      'filters.sortPrice': '一般料金 ↓',
      'filters.sortRemain': '最終入館まで',
      'filters.sortNear': '近い順',
      'filters.onlyEnriched': '最新展覧会情報ありのみ',
      'filters.wantToGoOnly': '行きたいのみ',
      'filters.myList': 'マイリスト：',
      'filters.myListAria': 'マイリストで絞り込む',
      'filters.unvisited': '未訪問のみ',
      'filters.onlyVisited': '訪問済みのみ',
      'filters.showCount': '{count}件を表示',
      'filters.close': '閉じる',
      'toc.label': 'エリアからさがす',
      'area.linkCount': '{name}（{count}）',
      'map.aria': '施設地図',
      'map.title': '施設地図',
      'map.keyAria': '地図の見方',
      'map.open': '開館中',
      'map.soon': '最終入館間近',
      'map.lastAdmission': ' · 最終入館{time}',
      'map.before': '開館前',
      'map.ended': '最終入館終了',
      'map.after': '本日は終了',
      'map.longclosed': '長期休館中',
      'map.unknown': '時間未確認',
      'map.closed': '休館',
      'map.admission': '入場',
      'map.discount': '割引',
      'map.canvasAria': 'ぐるっとパス施設の地図',
      'map.credit': '地図データ © OpenStreetMap contributors',
      'map.route': '経路',
      'map.current': '現在地',
      'map.summary': '表示 {count} 件',
      'map.clusterCount': '{count}施設の集まり',
      'map.clusterSelectedCount': '選択中の施設を含む{count}施設の集まり',
      'map.missing': '座標未登録 {count} 件',
      'map.locationUnset': '現在地未設定',
      'map.selectedFacilityAria': '選択中の施設詳細',
      'map.selectFacility': '地図から施設を選択してください',
      'map.details': '詳細を見る',
      'map.focusFacility': '地図で{name}を表示',
      'map.searchMap': '地図で検索',
      'facility.map': '地図を見る',
      'facility.route': 'Google Mapsで経路',
      'facility.searchMap': 'Google Mapsで検索',
      'facility.mapActionAria': '{name}を地図で見る',
      'facility.routeActionAria': '{name}への経路をGoogle Mapsで開く',
      'facility.drawerAria': '施設の詳細情報',
      'facility.number': 'No. {no}',
      'facility.openDetails': '{name}の詳細を開く',
      'facility.exhibitions': '展覧会',
      'facility.exhibitionOngoing': '開催中',
      'facility.exhibitionNearUpcoming': '近日開催',
      'facility.currentExhibitions': '開催中の展覧会',
      'facility.contact': '連絡先',
      'facility.close': '閉じる',
      'facility.moreDetails': '来館案内',
      'facility.checkOfficialSite': '公式サイトで確認 →',
      'facility.checkOpeningOfficialSite': '開館情報を公式サイトで確認 →',
      'facility.checkOpeningOfficialSiteAria': '{name}の開館情報を公式サイトで確認する',
      'facility.checkVisitOfficialSite': '来館情報を公式サイトで確認 →',
      'facility.checkVisitOfficialSiteAria': '{name}の来館情報を公式サイトで確認する',
      'facility.variesByExhibition': '展覧会により異なります。',
      'facility.intro': '施設紹介',
      'facility.introJapaneseSource': '日本語原文',
      'empty': '現在の検索・絞り込み条件に一致する施設がありません。',
      'empty.clear': '条件をクリアして全施設を表示',
      'field.period': '会期',
      'field.fee': '料金',
      'field.hours': '時間',
      'field.checked': '公式確認 {date}',
      'field.closed': '休館日',
      'field.access': 'アクセス',
      'field.notes': '注意',
      'contact.website': '公式サイト',
      'facility.openHomepage': '{name}の公式サイトを開く',
      'source.cta.entitlementEvidence': 'ぐるっとパス公式資料',
      'source.cta.passConfirmation': '施設公式の案内',
      'source.cta.exhibitionViewAll': 'すべての展覧会を見る',
      // Pass provenance disclosure. Collapsed by default: the product has already
      // read the official material and stated its conclusion, so the raw document
      // is secondary, not a permanent navigation row.
      'pass.provenanceSummary': '公式情報に基づく',
      'pass.provenancePublished': '公開 {date}',
      'pass.provenanceSnapshot': '{date}時点',
      'pass.provenancePage': 'p.{page}',
      'pass.provenanceChecked': '確認 {date}',
      'pass.provenanceSourceAria': '「{name}」を開く',
      // Role of a source in the Pass claim. Internal relation vocabulary
      // (entitlement_evidence …) is never shown to the reader.
      'pass.sourceRole.baseBenefit': '基本特典',
      'pass.sourceRole.eligibleExhibition': '対象展・会期',
      'pass.sourceRole.discountAmount': '割引額',
      'pass.sourceRole.facilityConfirmation': '施設側確認',
      'pass.sourceRole.latestEligibility': '最新の対象展情報',
      // Saving from a Card gives no hint where the collection lives, so the toast
      // both confirms the save and names the destination.
      'pass.wantToGoAddedToast': '「行きたい」に追加しました',
      'pass.wantToGoAddedAction': 'リストを見る',
      'pass.visitedAddedToast': '「訪問済み」に記録しました',
      'pass.visitedAddedAction': '記録を見る',
      'pass.visitedFromWantToast': '訪問済みに記録し、「行きたい」から削除しました',
      'source.cta.exhibitionPage': '展覧会ページ',
      'source.cta.exhibitionListing': '展覧会情報',
      'source.cta.openingHours': '開館時間を公式サイトで確認',
      'schedule.summary': '{year}年 展覧会スケジュール',
      'schedule.count': ' · {count}件',
      'schedule.countOne': ' · 1件',
      'pass.benefitEstimate': '{amount}円お得',
      'pass.valueChecking': 'お得額は展覧会により異なります',
      'pass.benefitTitle': '入場施設は判明している一般料金で計算、割引施設は割引額で計算',
      'period.range': '{from}〜{to}',
      'period.from': '{from}〜',
      'period.to': '〜{to}',
      'period.recurring': '定期開催',
      'period.permanent': '通年',
      'period.unknown': '会期未確認',
      'exhibition.listAria': '展覧会情報',
      'exhibition.ended': '終了',
      'exhibition.upcoming': '開催前',
      'exhibition.unknown': '会期未確認',
      'exhibition.japaneseOnly': '日本語のみ',
      'exhibition.japaneseOnlyShort': '日本語',
      'exhibition.untranslatedTitle': '日本語原題（翻訳未掲載）',
      'exhibition.untranslatedDetails': '詳細は公式サイトでご確認ください。',
      'exhibition.viewOriginal': '日本語公式ページを見る',
      'exhibition.scheduleUnavailable': '展覧会日程の翻訳は未掲載です。',
      'exhibition.showMore': 'さらに{count}件を表示',
      'status.openScheduled': '開館予定',
      'status.closed': '休館',
      'status.warn': '要確認',
      'status.verifyOfficial': '公式サイトで確認',
      'status.verifyOfficialAria': '{name}の最新情報を公式サイトで確認する',
      'status.reasonSeparator': '／',
      'status.out': '会期外',
      'status.reason.invalidDate': '日付の形式が正しくありません',
      'status.reason.explicit': '指定休館日または休館期間中（{raw}）',
      'status.reason.holidayNextBusiness': '祝休日の翌平日休館',
      'status.reason.holidayNextDay': '祝日の翌日休館',
      'status.reason.holidayShiftPrevious': '祝日のため休館日が前日に振り替え',
      'status.reason.holidayNextTwo': '祝日のため翌日・翌々日休館',
      'status.reason.holidayNextBusinessAlt': '祝日のため翌平日休館',
      'status.reason.holiday': '国民の祝日のため休館',
      'status.reason.weekday': '通常の休館日ルール（{day}曜日）',
      // Qualifies a closing time that does not apply every day. Neutral on
      // purpose: some facilities close EARLIER on their variant day.
      'status.hoursDowOnly': '（{day}曜のみ）',
      'status.hoursDateOnly': '（{date} 限定）',
      'status.reason.uncertainIrregular': '不定休が含まれるため、公式サイトでご確認ください',
      'status.reason.uncertainCommercial': '休館日は併設の商業施設に準ずるため、公式サイトでご確認ください',
      'status.reason.uncertainPlanned': '休館予定のみ公表されているため、公式サイトでご確認ください',
      'status.reason.uncertainHall': 'ホールの使用状況により開館状況が異なります',
      'status.reason.uncertainEvent': '通常の休館日ですが、試合開催日や長期休暇期間中は開館する場合があります',
      'status.reason.uncertainExhibition': '展覧会により当曜日の開館状況が異なります',
      'status.reason.outside': '現在判明している展覧会の会期外です',
      'status.reason.notice': '確定休館ルール非該当（※{notices}による臨時休館の可能性あり）',
      'status.reason.openRule': '通常のルールに基づき開館予定',
      'status.notice.exhibitionChangeover': '展示替え',
      'status.notice.temporaryClosure': '臨時休館',
      'status.notice.maintenance': '設備点検',
      'status.notice.inspection': '保守点検',
      'status.notice.seasonalClosure': '季節休館',
      'status.timeUnknown': '時間未確認',
      'status.timeUnknownNote': '開館時間のデータがありません。公式サイトをご確認ください',
      'status.longClosed': '長期休館中',
      'status.longClosedNote': '改修等のため休館中（再開予定 {date} 以降）',
      'status.longClosedExhibitionChangeoverNote': '展示替えのため休館中（再開予定 {date} 以降）',
      'status.longClosedIndefiniteNote': '改修等のため休館中（再開日は未定です。公式サイトでご確認ください）',
      'status.before': '{open} 開館',
      'status.beforeNote': 'あと{minutes}分で開館（{open}–{close}）',
      'status.lastCall': '最終入館まで{minutes}分',
      'status.estimatedSuffix': '（目安）',
      'status.lastCallNote': '最終入館 {last}{suffix}・閉館 {close}',
      'status.openNow': '開館中',
      'status.openNowNote': '最終入館 {last}{suffix}・閉館 {close}',
      'status.ended': '最終入館終了',
      'status.endedNote': '{close} 閉館。入館の受付は終了しています',
      'status.after': '本日は終了',
      'status.afterNote': '{close} に閉館しました',
      'brand.whyKicker': 'Why PYOKO?',
      'brand.whyLine': '「ぴょこ」っと、ひとつの場所から次の場所へ。',
      'footer.pyokoHeading': 'PYOKO について',
      'footer.pyokoBody': '「東京・ミュージアム ぐるっとパス」を持って出かける人のための、非公式の個人ガイドです。名前の PYOKO は「ぴょこ」から。ひとつの場所から、次の場所へ。その小さな移動が、このサイトの出発点になっています。購入と最新の公式情報は公式サイトでご確認ください。',
      'footer.aboutMore': 'PYOKOについて詳しく',
      'footer.about': '本サイトについて',
      'footer.sources': 'データ・出典',
      'footer.termsHeading': 'データのご利用について',
      'footer.termsBody': '施設の営業時間・料金などの事実そのものは各施設・公式資料に帰属し、本サイトが権利を主張するものではありません。一方、掲載範囲の選択と構成、出典の特定・照合とその記録（掲載ページ・確認日など）、および翻訳・編集部分は本サイトの制作物です。引用・リンクはご自由にどうぞ。データの一括複製・自動収集・機械学習用途での利用はご遠慮ください。',
      'footer.termsLicense': '利用条件の全文',
      'footer.coverageHeading': '掲載情報',
      'footer.coverageSummary': '<strong>{catalog}</strong> 公式施設 · <strong>{total}</strong> 施設カード',
      'footer.coverageNote': 'No.36のみ2館として掲載',
      'footer.passBasicsHeading': 'ぐるっとパスの基本',
      'footer.passBasicsSummary': '入場・割引に使えるパス',
      'footer.passValidity': '初回利用から2か月',
      'footer.passOnce': '各施設1回まで',
      'footer.admissionLabel': '入場',
      'footer.admissionMeaning': 'パスのみで入場',
      'footer.discountLabel': '割引',
      'footer.discountMeaning': '差額の支払いが必要',
      'footer.recordsHeading': 'あなたの記録',
      'footer.displayHeading': '表示について',
      'footer.valueHeading': 'お得度',
      'footer.valueAdmission': '入場施設：判明している一般料金で計算',
      'footer.valueDiscount': '割引施設：割引額で計算',
      'footer.valueHigher': '両方ある施設：高い方を採用',
      'footer.valueUnknown': '料金不明の施設：金額ベースの絞り込み対象外',
      'footer.statusHeading': '開館状況',
      'footer.statusMethod': '通常の休館日ルールと公開開館時間から推定しています。',
      'footer.statusLimit': '突発的な臨時休館や企画展ごとの変更は反映されない場合があります。お出かけ前に公式サイトをご確認ください。',
      'footer.accuracyHeading': '情報の正確性について',
      'footer.accuracyBody': 'PYOKOでは公式情報をもとに、できる限り正確な情報の確認・更新に努めています。ただし、開館時間・休館日・展覧会・パス特典などは変更される場合があります。来館前には、各ページに掲載している公式情報もあわせてご確認ください。',
      'footer.contactHeading': '情報の修正・更新について',
      'footer.contactPrefix': '掲載情報の誤りや更新が必要な箇所にお気づきの場合、またはPYOKOについてご質問がある場合は、',
      'footer.contactSuffix': 'までお知らせください。',
      'footer.unofficialShort': '非公式ガイドです。',
      'footer.officialSite': 'ぐるっとパス公式',
      'footer.coreSourcesHeading': '基本情報',
      'footer.exhibitionSourcesHeading': '展覧会情報',
      'footer.recommendationsHeading': '公式おすすめ',
      'footer.gruttoOfficialSource': 'ぐるっとパス公式情報',
      'footer.facilityOfficialSites': '各施設公式サイト',
      'footer.exhibitionList': 'ぐるっとパス{year} 展覧会一覧',
      'footer.admissionSource': '入場',
      'footer.discountSource': '割引',
      'backTop': 'トップに戻る'
    },
    en: {
      'app.title': 'Tokyo Museum Grutto Pass {year} Unofficial Guide | PYOKO',
      'app.description': "See what's open, which exhibitions are covered by the Grutto Pass, and the reference value of each benefit — with sources and verification dates. Save places and use the map and visit history to decide where to go next. Unofficial guide.",
      'meta.socialDescription': "See what's open, which Grutto Pass exhibitions are covered, and each benefit's reference value — with sources and verification dates. Save places and decide where to go next. Unofficial guide.",
      'app.eyebrow': 'Tokyo Museum Grutto Pass',
      'app.heroTitle': 'Where to next with your Grutto Pass?',
      'app.pageContext': 'Exhibition guide',
      'hero.sub': 'Search facilities and exhibitions by date, opening status, pass type, and value.',
      'brand.unofficial': 'Unofficial',
      'hero.editionLabel': '{year} edition',
      'hero.officialLink': 'Buy & check latest info on the official site ↗',
      'hero.updated': 'Updated {date}',
      'edition.name': 'Grutto Pass {year}',
      'pass.label': 'GRUTTO PASS',
      'pass.benefitSectionAria': 'Grutto Pass benefit',
      'pass.editionLabel': 'PASS {year}',
      'pass.price': '¥{amount}',
      'pass.until': 'Last use date {date}',
      'pass.validityRule': 'Valid for 2 months from first use',
      'pass.editionFinalUse': '{year} edition final-use date: {date}',
      'pass.aria': 'PASS {year} {price} {until}',
      'pass.trackerKicker': 'PASS TRACKER',
      'pass.trackerTitle': 'Your Grutto Pass',
      'pass.entrySummary': '{count} visited · {amount} reference value',
      'pass.entrySummaryUnknown': '{count} visited · Reference value not confirmed',
      'pass.entrySummaryMixed': '{count} visited · Reference value {amount} (incl. estimates)',
      'pass.trackVisits': 'Track your visits and their reference value',
      'pass.paidOff': 'Reference value matches the pass price',
      'pass.matchesPassPrice': 'Matches pass price',
      'pass.amountRemaining': '{amount} more in reference value to match the pass price',
      'pass.remainingCompact': '{amount} more in reference value',
      'pass.amountAhead': '{amount} beyond the pass price in reference value',
      'pass.visitedFacilities': 'Visited facilities',
      'pass.visitedMetric': '{count} visited',
      'pass.totalReferenceValue': 'Total reference value',
      'pass.totalReferenceValueMixed': 'Total reference value (includes estimates)',
      'pass.passPrice': 'Pass price',
      'pass.unknownSavings': '{count} visited facilities have no confirmed reference value',
      'pass.unknownSavingsSingle': 'The reference value of {count} visited facility is not confirmed',
      'pass.savingsNotIncluded': 'Reference value not confirmed',
      'pass.referenceAmount': 'Ref. {amount}',
      'pass.noVisits': 'No visits yet',
      'pass.close': 'Close',
      'pass.chip': 'PASS {price} · {count}/{total}',
      'pass.chipProgress': '{amount} reference value · {count}/{total}',
      'pass.visitedCount': '{count} facilities visited',
      'pass.valueTotal': 'Total reference value {amount}',
      'pass.recovered': '🎉 Reference value matches the pass price · {amount} beyond',
      'pass.remaining': '{amount} more in reference value to match the pass price',
      'pass.unknownValue': '{count} visited facilities without a confirmed reference value are excluded',
      'pass.storageNote': 'Visit records are saved only on this device. No login is required.',
      'pass.clear': 'Clear history',
      'pass.clearToast': 'Visit history cleared',
      'pass.undo': 'Undo',
      'pass.markVisited': 'Visited',
      'pass.markVisitedAria': 'Mark {name} as visited',
      'pass.unmarkVisitedAria': 'Remove visited status from {name}',
      'pass.markWantToGo': 'Want to go',
      'pass.wantToGoTab': 'Want to go',
      'pass.visitedTab': 'Visited',
      'pass.collectionsAria': 'Personal collections',
      'pass.wantToGoEmpty': 'Save places you want to visit and they’ll appear here.',
      'pass.wantToGoCompact': '{count} want to go',
      'facility.addWantToGo': 'Add {name} to Want to go',
      'facility.removeWantToGo': 'Remove {name} from Want to go',
      'pass.freeWith': 'Free admission',
      'pass.admissionAvailable': 'Eligible exhibition: free admission',
      'pass.admissionUpcoming': 'Eligible exhibition from {from}',
      'pass.admissionUnconfirmed': 'Eligible exhibition unconfirmed',
      'pass.dateApplicability': 'Eligible period',
      'pass.periodSeparator': ', ',
      'pass.browseCollection': 'View in list / map',
      'pass.currentTargetUnconfirmed': 'Current eligible exhibition is unconfirmed',
      'pass.listedTargetEnded': 'The listed eligible exhibition ended on {to}',
      'pass.youSave': 'Save ¥{amount}',
      'pass.discountWith': '¥{amount} off',
      'pass.discountUnknown': 'Discounted admission',
      'pass.mixedWith': 'Free admission and discounts',
      'pass.eligibleWith': 'Benefit available',
      'pass.benefitVaries': 'Benefits vary by exhibition',
      'pass.basis.regularAdult': 'Regular adult admission',
      'pass.basis.permanentAdult': 'Permanent collection adult admission',
      'pass.basis.permanent': 'Permanent collection admission',
      'pass.basis.specialAdult': 'Eligible exhibition adult admission',
      'pass.basis.special': 'Eligible exhibition admission',
      'pass.basis.permanentAndSpecial': 'Permanent collection + eligible exhibitions',
      'pass.basis.regularHours': 'Admission during regular opening hours',
      'pass.basis.program': 'Includes one planetarium or large-screen program',
      'pass.basis.permanentSpecialProgram': 'Permanent collection + eligible exhibitions + one planetarium or large-screen program',
      'pass.basis.eligible': 'Eligible admission',
      'pass.scope.permanentCollection': 'Permanent collection',
      'pass.scope.temporaryExhibition': 'Temporary exhibitions',
      'pass.scope.specialExhibition': 'Special exhibitions',
      'pass.scope.collection': 'Collection exhibitions',
      'pass.scope.garden': 'Garden',
      'pass.scope.namedExhibition': 'Featured exhibition',
      'pass.action.admission': 'Free admission',
      'pass.action.discountFixed': '¥{amount} off',
      'pass.action.discountPercent': '{rate}% off',
      'pass.action.discountGroupRate': 'Group-rate discount',
      'pass.action.discountUnspecified': 'Discount',
      'pass.phrase': '{scope} · {action}',
      'pass.clause.admission': 'Admission',
      'pass.clause.discount': 'Discount',
      'pass.referenceValue': 'Reference value',
      'pass.referenceShort': 'Ref. {amount}',
      'pass.referenceEstimate': 'Est. {amount}',
      'pass.referenceBasis': 'Based on {basis}',
      'pass.referenceBasisScoped': 'the regular admission price ({scope})',
      'pass.referenceBasisGeneral': 'regular admission',
      'pass.officialWording': 'Official wording',
      'pass.referenceNote': 'Reference values. Actual amounts vary by exhibition and how you use the pass.',
      'pass.referenceLearnMore': 'What does “reference value” mean?',
      'source.aboutData': 'How PYOKO handles information and sources',
      'stats.overviewAria': 'Guide overview',
      'area.count': '{total} total · {enriched} with details',
      'language.label': 'Language',
      'language.ja': '日本語',
      'language.en': 'English',
      'language.enShort': 'EN',
      'language.zh': '中文',
      'controls.searchLabel': 'Search facilities and exhibitions',
      'controls.skipToResults': 'Skip to search results',
      'controls.searchPlaceholder': 'Search facilities or exhibitions…',
      'controls.date': 'Date:',
      'controls.time': 'Time:',
      'controls.now': 'Now',
      'controls.useNow': 'Use current time',
      'controls.dateTime': 'Date & time',
      'controls.dateTimeSummary': '{date} · {time}',
      'controls.editDateTime': 'Change date and time ({value})',
      'controls.done': 'Done',
      'controls.openSearch': 'Open search and conditions',
      'controls.filterShort': 'Filter',
      'controls.timeReference': 'Status at {time}',
      'controls.view': 'View switcher',
      'controls.list': 'List',
      'controls.map': 'Map',
      'controls.filterToggle': 'Filter & sort',
      'controls.quickFilters': 'Quick filters',
      'controls.clearFilters': 'Clear all conditions',
      'results.total': 'Showing {count} facilities',
      'results.filtered': 'Showing {count} of {total} · {active} active conditions',
      'results.feedback': '{count} / {total} facilities · {active} active filters',
      'results.feedbackSingle': '{count} / {total} facilities · 1 active filter',
      'results.sortedTitle': 'Sorted results',
      'geo.use': 'Use my location',
      'map.locate': 'My location',
      'map.locateAria': 'Find my location and move the map',
      'map.recenterAria': 'Recenter the map on my location',
      'geo.update': 'Update location',
      'geo.loading': 'Getting location…',
      'geo.idle': 'Location is requested only when needed',
      'geo.label': 'From my location:',
      'geo.unsupported': 'This browser does not support location services',
      'geo.loadingNote': 'Getting your location…',
      'geo.success': 'Location acquired (accuracy about {meters}m)',
      'geo.denied': 'Location access is blocked. Allow it in your browser address-bar settings.',
      'geo.error': 'Could not get your location. Try again somewhere with a better signal.',
      'geo.distance': '📍 Straight-line {distance}',
      'geo.distanceTitle': 'Straight-line distance; actual walking distance and time may differ',
      'geo.radiusNeedsLocation': 'Use your current location before choosing a distance',
      'radius.none': 'No limit',
      'radius.1km': 'Within 1 km',
      'radius.3km': 'Within 3 km',
      'radius.5km': 'Within 5 km',
      'filters.status': 'Opening status:',
      'filters.statusAria': 'Filter by opening status',
      'filters.all': 'All',
      'filters.open': 'Open',
      'filters.closed': 'Closed',
      'filters.nowOpen': 'Open now',
      'filters.nowOpenAtSelected': 'Open at that time',
      'filters.openAtTimeSuggestion': 'Show only what is open at {time}',
      'filters.statusInfoAria': 'Opening-status filter explanation',
      'filters.statusInfoIntro': 'Shows opening status for the selected date.',
      'filters.statusInfoOpen': '“Open”: not covered by the regular closure rules',
      'filters.statusInfoClosed': '“Closed”: regular closure or a known closure period',
      'filters.statusInfoNow': '“Open now”: open today or close to last admission',
      'filters.statusInfoNowSelected': '“Open at that time”: open at the selected date and time, or close to last admission',
      'filters.statusInfoOther': '“Check” and “Outside period” remain under “All”.',
      'filters.statusAdvisory': 'Opening status is estimated from published information. Check each facility’s official site before leaving.',
      'filters.passType': 'Pass type:',
      'filters.passTypeAria': 'Filter by pass type',
      'filters.admission': 'Admission',
      'filters.discount': 'Discount',
      'filters.value': 'Savings:',
      'filters.value300': '¥300+',
      'filters.value500': '¥500+',
      'filters.value1000': '¥1,000+',
      'filters.sort': 'Sort:',
      'filters.sortNumber': 'Facility number',
      'filters.sortBenefit': 'Savings ↓',
      'filters.sortPrice': 'Regular price ↓',
      'filters.sortRemain': 'Time left today',
      'filters.sortNear': 'Nearest first',
      'filters.onlyEnriched': 'Only facilities with recent exhibition info',
      'filters.wantToGoOnly': 'Want to go only',
      'filters.myList': 'My list:',
      'filters.myListAria': 'Filter by my list',
      'filters.unvisited': 'Not visited',
      'filters.onlyVisited': 'Visited only',
      'filters.showCount': 'Show {count} facilities',
      'filters.close': 'Close',
      'toc.label': 'Browse by area',
      'area.linkCount': '{name} ({count})',
      'map.aria': 'Facility map',
      'map.title': 'Facility map',
      'map.keyAria': 'Map legend',
      'map.open': 'Open now',
      'map.soon': 'Near last admission',
      'map.lastAdmission': ' · last admission {time}',
      'map.before': 'Before opening',
      'map.ended': 'Last admission ended',
      'map.after': 'Closed for today',
      'map.longclosed': 'Long-term closure',
      'map.unknown': 'Hours unconfirmed',
      'map.closed': 'Closed',
      'map.admission': 'Admission',
      'map.discount': 'Discount',
      'map.canvasAria': 'Map of Grutto Pass facilities',
      'map.credit': 'Map data © OpenStreetMap contributors',
      'map.route': 'Directions',
      'map.current': 'My location',
      'map.summary': '{count} shown',
      'map.clusterCount': 'Cluster of {count} facilities',
      'map.clusterSelectedCount': 'Cluster of {count} facilities, including the selected facility',
      'map.missing': '{count} without coordinates',
      'map.locationUnset': 'Location not set',
      'map.selectedFacilityAria': 'Selected facility details',
      'map.selectFacility': 'Select a facility on the map',
      'map.details': 'View details',
      'map.focusFacility': 'Show {name} on the map',
      'map.searchMap': 'Search on map',
      'facility.map': 'View on map',
      'facility.route': 'Get directions',
      'facility.searchMap': 'Search on Google Maps',
      'facility.mapActionAria': 'View {name} on the map',
      'facility.routeActionAria': 'Open directions to {name} in Google Maps',
      'facility.drawerAria': 'Facility details',
      'facility.number': 'No. {no}',
      'facility.openDetails': 'Open details for {name}',
      'facility.exhibitions': 'Exhibitions',
      'facility.exhibitionOngoing': 'Ongoing',
      'facility.exhibitionNearUpcoming': 'Coming soon',
      'facility.currentExhibitions': 'Current exhibitions',
      'facility.contact': 'Contact',
      'facility.close': 'Close',
      'facility.moreDetails': 'Visit information',
      'facility.checkOfficialSite': 'Check official site →',
      'facility.checkOpeningOfficialSite': 'Check opening information on the official site →',
      'facility.checkOpeningOfficialSiteAria': 'Check {name} opening information on the official site',
      'facility.checkVisitOfficialSite': 'Check visit information on the official site →',
      'facility.checkVisitOfficialSiteAria': 'Check {name} visit information on the official site',
      'facility.variesByExhibition': 'Varies by exhibition.',
      'facility.intro': 'Facility introduction',
      'facility.introJapaneseSource': 'Japanese source',
      'empty': 'No facilities match the current search and filters.',
      'empty.clear': 'Clear conditions and show all facilities',
      'field.period': 'Period',
      'field.fee': 'Fee',
      'field.hours': 'Hours',
      'field.checked': 'Officially checked {date}',
      'field.closed': 'Closed days',
      'field.access': 'Access',
      'field.notes': 'Note',
      'contact.website': 'Official site',
      'facility.openHomepage': 'Open {name} official website',
      'source.cta.entitlementEvidence': 'Grutto Pass official source',
      'source.cta.passConfirmation': 'Facility official guidance',
      'source.cta.exhibitionViewAll': 'View all exhibitions',
      'pass.provenanceSummary': 'Based on official sources',
      'pass.provenancePublished': 'Published {date}',
      'pass.provenanceSnapshot': 'as of {date}',
      'pass.provenancePage': 'p.{page}',
      'pass.provenanceChecked': 'Checked {date}',
      'pass.provenanceSourceAria': 'Open "{name}"',
      'pass.sourceRole.baseBenefit': 'Base benefit',
      'pass.sourceRole.eligibleExhibition': 'Eligible exhibition & dates',
      'pass.sourceRole.discountAmount': 'Discount amount',
      'pass.sourceRole.facilityConfirmation': 'Facility confirmation',
      'pass.sourceRole.latestEligibility': 'Latest eligibility information',
      'pass.wantToGoAddedToast': 'Added to Want to go',
      'pass.wantToGoAddedAction': 'View list',
      'pass.visitedAddedToast': 'Marked as visited',
      'pass.visitedAddedAction': 'View record',
      'pass.visitedFromWantToast': 'Marked visited and removed from Want to go',
      'source.cta.exhibitionPage': 'Exhibition page',
      'source.cta.exhibitionListing': 'Exhibition information',
      'source.cta.openingHours': 'Check opening hours on the official site',
      'schedule.summary': '{year} exhibition schedule',
      'schedule.count': ' · {count} exhibitions',
      'schedule.countOne': ' · 1 exhibition',
      'pass.benefitEstimate': 'You save ¥{amount}',
      'pass.valueChecking': 'Savings vary by exhibition',
      'pass.benefitTitle': 'Admission venues use the known regular price; discount venues use the discount amount',
      'period.range': '{from}–{to}',
      'period.from': '{from}–',
      'period.to': '–{to}',
      'period.recurring': 'Recurring',
      'period.permanent': 'Year-round',
      'period.unknown': 'Period unconfirmed',
      'exhibition.listAria': 'Exhibition information',
      'exhibition.ended': 'Ended',
      'exhibition.upcoming': 'Upcoming',
      'exhibition.unknown': 'Period unconfirmed',
      'exhibition.japaneseOnly': 'Japanese only',
      'exhibition.japaneseOnlyShort': 'JP',
      'exhibition.untranslatedTitle': 'Japanese title (not translated)',
      'exhibition.untranslatedDetails': 'More details are available in Japanese on the official site.',
      'exhibition.viewOriginal': 'View the Japanese official page',
      'exhibition.scheduleUnavailable': 'The schedule is available in Japanese only.',
      'exhibition.showMore': 'Show {count} more',
      'status.openScheduled': 'Open as scheduled',
      'status.closed': 'Closed',
      'status.warn': 'Check details',
      'status.verifyOfficial': 'Verify on official site',
      'status.verifyOfficialAria': 'Check the official site for current details about {name}',
      'status.reasonSeparator': ' / ',
      'status.out': 'Outside period',
      'status.reason.invalidDate': 'The date format is invalid',
      'status.reason.explicit': 'Specified closure day or closure period ({raw})',
      'status.reason.holidayNextBusiness': 'Closed on the next business day after a holiday',
      'status.reason.holidayNextDay': 'Closed the day after a holiday',
      'status.reason.holidayShiftPrevious': 'Closure moved to the previous day because of a holiday',
      'status.reason.holidayNextTwo': 'Closed on the day and two days after a holiday',
      'status.reason.holidayNextBusinessAlt': 'Closed on the next business day after a holiday',
      'status.reason.holiday': 'Closed for a national holiday',
      'status.reason.weekday': 'Regular weekly closure ({day})',
      'status.hoursDowOnly': '({day} only)',
      'status.hoursDateOnly': '({date} only)',
      'status.reason.uncertainIrregular': 'Irregular closures are possible; check the official site',
      'status.reason.uncertainCommercial': 'Closure follows the attached commercial facility; check the official site',
      'status.reason.uncertainPlanned': 'Only a planned closure is published; check the official site',
      'status.reason.uncertainHall': 'Opening depends on hall usage',
      'status.reason.uncertainEvent': 'Usually closed, but events or school holidays may change opening',
      'status.reason.uncertainExhibition': 'Opening on this weekday varies by exhibition',
      'status.reason.outside': 'This date is outside currently known exhibition periods',
      'status.reason.notice': 'No confirmed closure rule applies (temporary closure may occur due to {notices})',
      'status.reason.openRule': 'Expected to be open under the usual rules',
      'status.notice.exhibitionChangeover': 'exhibition changeover',
      'status.notice.temporaryClosure': 'temporary closure',
      'status.notice.maintenance': 'facility maintenance',
      'status.notice.inspection': 'maintenance / inspection',
      'status.notice.seasonalClosure': 'seasonal closure',
      'status.timeUnknown': 'Hours unconfirmed',
      'status.timeUnknownNote': 'Opening hours are not in the guide; check the official site',
      'status.longClosed': 'Long-term closure',
      'status.longClosedNote': 'Closed for renovation or similar work (reopening after {date})',
      'status.longClosedExhibitionChangeoverNote': 'Closed for exhibition changeover (reopening after {date})',
      'status.longClosedIndefiniteNote': 'Closed for renovation or similar work (reopening date unconfirmed; check the official site)',
      'status.before': 'Opens {open}',
      'status.beforeNote': 'Opens in {minutes} min ({open}–{close})',
      'status.lastCall': '{minutes} min to last admission',
      'status.estimatedSuffix': ' (est.)',
      'status.lastCallNote': 'Last admission {last}{suffix} · closes {close}',
      'status.openNow': 'Open now',
      'status.openNowNote': 'Last admission {last}{suffix} · closes {close}',
      'status.ended': 'Last admission ended',
      'status.endedNote': 'Closed at {close}; admission is no longer available',
      'status.after': 'Closed for today',
      'status.afterNote': 'Closed at {close}',
      'brand.whyKicker': 'Why PYOKO?',
      'brand.whyLine': 'Inspired by 「ぴょこ」— a little hop from one place to the next.',
      'footer.pyokoHeading': 'About PYOKO',
      'footer.pyokoBody': 'An independent, unofficial guide for people heading out with the Tokyo Museum Grutto Pass. The name comes from 「ぴょこ」: a little hop from one place to the next, which is the small move this site is built around. Buy the pass and check the latest official details on the official site.',
      'footer.aboutMore': 'More about PYOKO',
      'footer.about': 'About this site',
      'footer.sources': 'Data & sources',
      'footer.termsHeading': 'Using this data',
      'footer.termsBody': 'The facts themselves — opening hours, prices and the like — belong to the facilities and their official materials, and no ownership of them is claimed here. What this site contributes is the selection and arrangement of the data set, the work of locating and cross-checking each source and recording it (page locators, verification dates), and the translations and editorial copy. Quoting and linking are welcome. Please do not bulk-copy, scrape, or use the data set for machine-learning training.',
      'footer.termsLicense': 'Full terms',
      'footer.coverageHeading': 'Coverage',
      'footer.coverageSummary': '<strong>{catalog}</strong> official facilities · <strong>{total}</strong> guide cards',
      'footer.coverageNote': 'No. 36 is listed as two museums',
      'footer.passBasicsHeading': 'Grutto Pass basics',
      'footer.passBasicsSummary': 'A pass for admission and discounts',
      'footer.passValidity': 'Valid for 2 months from first use',
      'footer.passOnce': 'One use per facility',
      'footer.admissionLabel': 'Admission',
      'footer.admissionMeaning': 'Enter with the pass only',
      'footer.discountLabel': 'Discount',
      'footer.discountMeaning': 'Pay the remaining balance',
      'footer.recordsHeading': 'Your records',
      'footer.displayHeading': 'How information is shown',
      'footer.valueHeading': 'Value estimate',
      'footer.valueAdmission': 'Admission venues: calculated from the known regular price',
      'footer.valueDiscount': 'Discount venues: calculated from the discount amount',
      'footer.valueHigher': 'Both apply: the higher value is used',
      'footer.valueUnknown': 'Unknown prices: excluded from value-based filters',
      'footer.statusHeading': 'Opening status',
      'footer.statusMethod': 'Estimated from regular closure rules and published opening hours.',
      'footer.statusLimit': 'Unexpected closures and exhibition-specific changes may not be reflected. Check the official site before visiting.',
      'footer.accuracyHeading': 'About information accuracy',
      'footer.accuracyBody': 'PYOKO makes every effort to verify and keep information up to date using official sources. Opening hours, closures, exhibitions and Pass benefits can still change, so please check the linked official information before visiting.',
      'footer.contactHeading': 'Questions or corrections?',
      'footer.contactPrefix': 'If you spot outdated or incorrect information, or have a question about PYOKO, email ',
      'footer.contactSuffix': '.',
      'footer.unofficialShort': 'Unofficial guide.',
      'footer.officialSite': 'Official Grutto Pass site',
      'footer.coreSourcesHeading': 'Basic information',
      'footer.exhibitionSourcesHeading': 'Exhibition information',
      'footer.recommendationsHeading': 'Official recommendations',
      'footer.gruttoOfficialSource': 'Official Grutto Pass information',
      'footer.facilityOfficialSites': 'Individual facility websites',
      'footer.exhibitionList': 'Grutto Pass {year} exhibition list',
      'footer.admissionSource': 'Admission',
      'footer.discountSource': 'Discount',
      'backTop': 'Back to top'
    },
    zh: {
      'app.title': '东京·博物馆 Grutto Pass {year} 非官方指南 | PYOKO',
      'app.description': '查看场馆开放状态、Grutto Pass 对象展览与优惠内容，每条信息均标注官方出处和核验日期。收藏想去的场馆，结合地图与到访记录决定下一站。非官方指南。',
      'meta.socialDescription': '查看开放状态、Grutto Pass 对象展览和优惠内容，参考官方出处与核验日期；收藏场馆，结合地图和到访记录决定下一站。非官方指南。',
      'app.eyebrow': '东京·博物馆 Grutto Pass',
      'app.heroTitle': '拿着 Grutto Pass，下一站去哪？',
      'app.pageContext': '展览指南',
      'hero.sub': '可按日期、开放状态、通票类型和优惠内容搜索设施与展览。',
      'brand.unofficial': '非官方',
      'hero.editionLabel': '{year}版',
      'hero.officialLink': '购买及最新信息请查看官网 ↗',
      'hero.updated': '{date}更新',
      'edition.name': 'Grutto Pass {year}',
      'pass.label': 'GRUTTO PASS',
      'pass.benefitSectionAria': 'Grutto Pass 优惠',
      'pass.editionLabel': 'PASS {year}',
      'pass.price': '¥{amount}',
      'pass.until': '最晚使用日 {date}',
      'pass.validityRule': '首次使用起2个月',
      'pass.editionFinalUse': '{year}年度最晚使用至 {date}',
      'pass.aria': 'PASS {year} {price} {until}',
      'pass.trackerKicker': 'PASS TRACKER',
      'pass.trackerTitle': '你的 Grutto Pass',
      'pass.entrySummary': '已去过{count}家 · 参考价值 {amount}',
      'pass.entrySummaryUnknown': '已去过{count}家 · 参考价值未确认',
      'pass.entrySummaryMixed': '已去过{count}家 · 参考价值 {amount}（含估算）',
      'pass.trackVisits': '记录去过的设施，查看参考价值',
      'pass.paidOff': '参考价值已达通票价格',
      'pass.matchesPassPrice': '达到通票票价',
      'pass.amountRemaining': '按参考价值，再 {amount} 达到通票价格',
      'pass.remainingCompact': '参考价值还差{amount}',
      'pass.amountAhead': '按参考价值已超出通票价格 {amount}',
      'pass.visitedFacilities': '去过的设施',
      'pass.visitedMetric': '已去过{count}家',
      'pass.totalReferenceValue': '参考价值合计',
      'pass.totalReferenceValueMixed': '参考价值合计（含估算）',
      'pass.passPrice': '通票价格',
      'pass.unknownSavings': '{count}家设施的参考价值未确认，未计入合计',
      'pass.unknownSavingsSingle': '{count}家设施的参考价值未确认，未计入合计',
      'pass.savingsNotIncluded': '参考价值未确认',
      'pass.referenceAmount': '参考 {amount}',
      'pass.noVisits': '还没有访问记录',
      'pass.close': '关闭',
      'pass.chip': 'PASS {price} · {count}/{total}',
      'pass.chipProgress': '参考价值 {amount} · {count}/{total}',
      'pass.visitedCount': '已去过 {count}家',
      'pass.valueTotal': '参考价值合计 {amount}',
      'pass.recovered': '🎉 参考价值已达通票价格 · 超出 {amount}',
      'pass.remaining': '按参考价值，还差 {amount} 达到通票价格',
      'pass.unknownValue': '{count}家参考价值未确认的设施未计入合计',
      'pass.storageNote': '访问记录仅保存在此设备上，无需登录。',
      'pass.clear': '清除记录',
      'pass.clearToast': '已清除访问记录',
      'pass.undo': '撤销',
      'pass.markVisited': '去过',
      'pass.markVisitedAria': '将{name}标记为去过',
      'pass.unmarkVisitedAria': '取消{name}的去过标记',
      'pass.markWantToGo': '想去',
      'pass.wantToGoTab': '想去',
      'pass.visitedTab': '已访问',
      'pass.collectionsAria': '个人收藏',
      'pass.wantToGoEmpty': '把感兴趣的场馆加入“想去”，就可以在这里统一查看。',
      'pass.wantToGoCompact': '想去 {count}',
      'facility.addWantToGo': '将{name}加入想去',
      'facility.removeWantToGo': '将{name}从想去中移除',
      'pass.freeWith': '免费入场',
      'pass.admissionAvailable': '适用展览 免费入场',
      'pass.admissionUpcoming': '适用展览从{from}起',
      'pass.admissionUnconfirmed': '适用展览 未确认',
      'pass.dateApplicability': '适用期间',
      'pass.periodSeparator': '、',
      'pass.browseCollection': '在列表 / 地图中查看',
      'pass.currentTargetUnconfirmed': '当前适用展览未确认',
      'pass.listedTargetEnded': '所列适用展览已于{to}结束',
      'pass.youSave': '可省 ¥{amount}',
      'pass.discountWith': '优惠 ¥{amount}',
      'pass.discountUnknown': '折扣入场',
      'pass.mixedWith': '免费入场并享折扣',
      'pass.eligibleWith': '可享优惠',
      'pass.benefitVaries': '适用范围和金额因展览而异',
      'pass.basis.regularAdult': '成人普通票价',
      'pass.basis.permanentAdult': '常设展成人票价',
      'pass.basis.permanent': '常设展入场费',
      'pass.basis.specialAdult': '适用展览成人票价',
      'pass.basis.special': '适用展览入场费',
      'pass.basis.permanentAndSpecial': '常设展及适用展览入场费',
      'pass.basis.regularHours': '正常开放时间内入场',
      'pass.basis.program': '含1次天象仪或大型影像节目',
      'pass.basis.permanentSpecialProgram': '常设展、适用展览及1次天象仪或大型影像节目',
      'pass.basis.eligible': '适用票价',
      'pass.scope.permanentCollection': '常设展',
      'pass.scope.temporaryExhibition': '企划展',
      'pass.scope.specialExhibition': '特别展',
      'pass.scope.collection': '馆藏展',
      'pass.scope.garden': '庭园',
      'pass.scope.namedExhibition': '指定展览',
      'pass.action.admission': '免费入场',
      'pass.action.discountFixed': '优惠 ¥{amount}',
      'pass.action.discountPercent': '{rate}% 折扣',
      'pass.action.discountGroupRate': '按团体票价优惠',
      'pass.action.discountUnspecified': '折扣',
      'pass.phrase': '{scope} · {action}',
      'pass.clause.admission': '入场',
      'pass.clause.discount': '折扣',
      'pass.referenceValue': '参考价值',
      'pass.referenceShort': '参考 {amount}',
      'pass.referenceEstimate': '约 {amount}',
      'pass.referenceBasis': '按{basis}计算',
      'pass.referenceBasisScoped': '{scope}普通票价',
      'pass.referenceBasisGeneral': '普通票价',
      'pass.officialWording': '原文',
      'pass.referenceNote': '此为参考价值，实际金额可能因展览和使用方式而异。',
      'pass.referenceLearnMore': '参考价值是什么意思？',
      'source.aboutData': '信息、来源与判断',
      'stats.overviewAria': '指南概览',
      'area.count': '共{total}家·有详细信息{enriched}家',
      'language.label': '语言',
      'language.ja': '日本語',
      'language.en': 'English',
      'language.enShort': 'EN',
      'language.zh': '中文',
      'controls.searchLabel': '搜索设施与展览',
      'controls.skipToResults': '跳到搜索结果',
      'controls.searchPlaceholder': '搜索设施名或展览名…',
      'controls.date': '日期：',
      'controls.time': '时间：',
      'controls.now': '现在',
      'controls.useNow': '回到现在',
      'controls.dateTime': '日期与时间',
      'controls.dateTimeSummary': '{date} · {time}',
      'controls.editDateTime': '更改日期与时间（{value}）',
      'controls.done': '完成',
      'controls.openSearch': '打开搜索与条件',
      'controls.filterShort': '筛选',
      'controls.timeReference': '{time} 时的状态',
      'controls.view': '视图切换',
      'controls.list': '列表',
      'controls.map': '地图',
      'controls.filterToggle': '筛选与排序',
      'controls.quickFilters': '常用筛选',
      'controls.clearFilters': '清除全部条件',
      'results.total': '显示{count}家设施',
      'results.filtered': '共{total}家，显示{count}家 · 已启用{active}项条件',
      'results.feedback': '显示{count} / {total} 家 · 已应用{active}项条件',
      'results.feedbackSingle': '显示{count} / {total} 家 · 已应用1项条件',
      'results.sortedTitle': '排序结果',
      'geo.use': '使用当前位置',
      'map.locate': '当前位置',
      'map.locateAria': '获取当前位置并移动地图',
      'map.recenterAria': '将地图移回当前位置',
      'geo.update': '更新当前位置',
      'geo.loading': '正在获取…',
      'geo.idle': '仅在需要时获取位置',
      'geo.label': '距当前位置：',
      'geo.unsupported': '此浏览器不支持位置服务',
      'geo.loadingNote': '正在获取当前位置…',
      'geo.success': '已获取当前位置（误差约{meters}米）',
      'geo.denied': '位置权限被阻止，请在浏览器地址栏设置中允许使用位置。',
      'geo.error': '无法获取当前位置，请在信号较好的地方重试。',
      'geo.distance': '📍 直线距离 {distance}',
      'geo.distanceTitle': '这是直线距离，实际步行距离和时间可能不同',
      'geo.radiusNeedsLocation': '请先获取当前位置，再选择距离范围',
      'radius.none': '不限',
      'radius.1km': '1公里内',
      'radius.3km': '3公里内',
      'radius.5km': '5公里内',
      'filters.status': '开放状态：',
      'filters.statusAria': '按开放状态筛选',
      'filters.all': '全部',
      'filters.open': '开放',
      'filters.closed': '闭馆',
      'filters.nowOpen': '当前开放',
      'filters.nowOpenAtSelected': '该时间开放',
      'filters.openAtTimeSuggestion': '只显示{time}开放的设施',
      'filters.statusInfoAria': '开放状态筛选说明',
      'filters.statusInfoIntro': '显示所选日期的开放状态。',
      'filters.statusInfoOpen': '“开放”：不属于通常闭馆规则的设施',
      'filters.statusInfoClosed': '“闭馆”：通常闭馆日或已知闭馆期间',
      'filters.statusInfoNow': '“当前开放”：今天正在开放或临近最后入馆时间',
      'filters.statusInfoNowSelected': '“该时间开放”：在所选日期时间正在开放，或临近最后入馆时间',
      'filters.statusInfoOther': '“需确认”“不在展期”可在“全部”中查看。',
      'filters.statusAdvisory': '开放状态根据公开信息推测。出发前请在各设施卡片中查看官方网站。',
      'filters.passType': '通票类型：',
      'filters.passTypeAria': '按通票类型筛选',
      'filters.admission': '入场',
      'filters.discount': '折扣',
      'filters.value': '优惠额：',
      'filters.value300': '300日元以上',
      'filters.value500': '500日元以上',
      'filters.value1000': '1,000日元以上',
      'filters.sort': '排序：',
      'filters.sortNumber': '设施编号',
      'filters.sortBenefit': '优惠额 ↓',
      'filters.sortPrice': '常规票价 ↓',
      'filters.sortRemain': '今日剩余时间',
      'filters.sortNear': '距离最近',
      'filters.onlyEnriched': '仅显示有最新展览信息的设施',
      'filters.wantToGoOnly': '只看想去',
      'filters.myList': '我的清单：',
      'filters.myListAria': '按我的清单筛选',
      'filters.unvisited': '仅未去过',
      'filters.onlyVisited': '仅显示去过的设施',
      'filters.showCount': '显示{count}家设施',
      'filters.close': '关闭',
      'toc.label': '按区域浏览',
      'area.linkCount': '{name}（{count}）',
      'map.aria': '设施地图',
      'map.title': '设施地图',
      'map.keyAria': '地图图例',
      'map.open': '当前开放',
      'map.soon': '临近最后入馆',
      'map.lastAdmission': ' · 最后入馆 {time}',
      'map.before': '尚未开放',
      'map.ended': '已过最后入馆时间',
      'map.after': '今日已结束',
      'map.longclosed': '长期闭馆',
      'map.unknown': '开放时间未确认',
      'map.closed': '闭馆',
      'map.admission': '入场',
      'map.discount': '折扣',
      'map.canvasAria': 'Grutto Pass 设施地图',
      'map.credit': '地图数据 © OpenStreetMap contributors',
      'map.route': '路线',
      'map.current': '当前位置',
      'map.summary': '显示{count}家',
      'map.clusterCount': '{count}家设施的聚合',
      'map.clusterSelectedCount': '包含已选设施的{count}家设施聚合',
      'map.missing': '{count}家未登记坐标',
      'map.locationUnset': '尚未设置当前位置',
      'map.selectedFacilityAria': '选中设施详情',
      'map.selectFacility': '请从地图上选择一个设施',
      'map.details': '查看详情',
      'map.focusFacility': '在地图上显示{name}',
      'map.searchMap': '在地图中搜索',
      'facility.map': '查看地图',
      'facility.route': 'Google 地图导航',
      'facility.searchMap': '在 Google 地图中搜索',
      'facility.mapActionAria': '在地图中查看{name}',
      'facility.routeActionAria': '在 Google 地图中打开前往{name}的路线',
      'facility.drawerAria': '设施详情',
      'facility.number': 'No. {no}',
      'facility.openDetails': '打开{name}的详情',
      'facility.exhibitions': '展览',
      'facility.exhibitionOngoing': '正在展出',
      'facility.exhibitionNearUpcoming': '近期展出',
      'facility.currentExhibitions': '当前展览',
      'facility.contact': '联系方式',
      'facility.close': '关闭',
      'facility.moreDetails': '参观信息',
      'facility.checkOfficialSite': '查看官方网站 →',
      'facility.checkOpeningOfficialSite': '前往官网确认开放信息 →',
      'facility.checkOpeningOfficialSiteAria': '前往官网确认{name}的开放信息',
      'facility.checkVisitOfficialSite': '前往官网确认到访信息 →',
      'facility.checkVisitOfficialSiteAria': '前往官网确认{name}的到访信息',
      'facility.variesByExhibition': '因展览而异。',
      'facility.intro': '场馆简介',
      'facility.introJapaneseSource': '日文原文',
      'empty': '没有符合当前搜索与筛选条件的设施。',
      'empty.clear': '清除条件并显示全部设施',
      'field.period': '展期',
      'field.fee': '费用',
      'field.hours': '时间',
      'field.checked': '官方确认于 {date}',
      'field.closed': '休馆日',
      'field.access': '交通',
      'field.notes': '注意',
      'contact.website': '官方网站',
      'facility.openHomepage': '打开{name}官网',
      'source.cta.entitlementEvidence': 'Grutto Pass 官方资料',
      'source.cta.passConfirmation': '场馆官方说明',
      'source.cta.exhibitionViewAll': '查看全部展览',
      'pass.provenanceSummary': '基于官方资料',
      'pass.provenancePublished': '发布 {date}',
      'pass.provenanceSnapshot': '{date}时点',
      'pass.provenancePage': '第{page}页',
      'pass.provenanceChecked': '确认 {date}',
      'pass.provenanceSourceAria': '打开“{name}”',
      'pass.sourceRole.baseBenefit': '基础权益',
      'pass.sourceRole.eligibleExhibition': '适用展览与日期',
      'pass.sourceRole.discountAmount': '优惠金额',
      'pass.sourceRole.facilityConfirmation': '场馆确认',
      'pass.sourceRole.latestEligibility': '最新适用信息',
      'pass.wantToGoAddedToast': '已加入“想去”',
      'pass.wantToGoAddedAction': '查看列表',
      'pass.visitedAddedToast': '已记录为“去过”',
      'pass.visitedAddedAction': '查看记录',
      'pass.visitedFromWantToast': '已标记为去过，并从“想去”中移除',
      'source.cta.exhibitionPage': '展览页面',
      'source.cta.exhibitionListing': '展览信息',
      'source.cta.openingHours': '在官网确认开放时间',
      'schedule.summary': '{year}年展览日程',
      'schedule.count': ' · {count}项展览',
      'schedule.countOne': ' · 1项展览',
      'pass.benefitEstimate': '可省 ¥{amount}',
      'pass.valueChecking': '优惠金额因展览而异',
      'pass.benefitTitle': '入场设施按已知普通票价计算，折扣设施按折扣金额计算',
      'period.range': '{from}–{to}',
      'period.from': '{from}–',
      'period.to': '–{to}',
      'period.recurring': '定期举办',
      'period.permanent': '全年',
      'period.unknown': '展期未确认',
      'exhibition.listAria': '展览信息',
      'exhibition.ended': '已结束',
      'exhibition.upcoming': '即将开始',
      'exhibition.unknown': '展期未确认',
      'exhibition.japaneseOnly': '仅日文',
      'exhibition.japaneseOnlyShort': '日文',
      'exhibition.untranslatedTitle': '日文标题（暂未翻译）',
      'exhibition.untranslatedDetails': '更多详情请查看日文官方网站。',
      'exhibition.viewOriginal': '查看日文官方网站',
      'exhibition.scheduleUnavailable': '展览日程暂未翻译。',
      'exhibition.showMore': '再显示 {count} 项',
      'status.openScheduled': '预计开放',
      'status.closed': '闭馆',
      'status.warn': '需确认',
      'status.verifyOfficial': '前往官网确认',
      'status.verifyOfficialAria': '前往{name}官方网站确认最新信息',
      'status.reasonSeparator': '；',
      'status.out': '不在展期',
      'status.reason.invalidDate': '日期格式不正确',
      'status.reason.explicit': '指定闭馆日或闭馆期间（{raw}）',
      'status.reason.holidayNextBusiness': '节假日后的下一个工作日闭馆',
      'status.reason.holidayNextDay': '节假日次日闭馆',
      'status.reason.holidayShiftPrevious': '因节假日，闭馆日调整至前一天',
      'status.reason.holidayNextTwo': '节假日后的当天及次日、次次日闭馆',
      'status.reason.holidayNextBusinessAlt': '节假日后的下一个工作日闭馆',
      'status.reason.holiday': '因日本国民节假日闭馆',
      'status.reason.weekday': '通常闭馆规则（星期{day}）',
      'status.hoursDowOnly': '（仅星期{day}）',
      'status.hoursDateOnly': '（仅限{date}）',
      'status.reason.uncertainIrregular': '包含不定期闭馆，请查看官方网站',
      'status.reason.uncertainCommercial': '闭馆日按附属商业设施安排，请查看官方网站',
      'status.reason.uncertainPlanned': '仅公布了计划闭馆，请查看官方网站',
      'status.reason.uncertainHall': '开放状态取决于场馆使用情况',
      'status.reason.uncertainEvent': '通常闭馆，但比赛或长假期间可能开放',
      'status.reason.uncertainExhibition': '该星期几的开放状态因展览而异',
      'status.reason.outside': '该日期不在目前已知的展览期间内',
      'status.reason.notice': '未发现确定的闭馆规则（可能因{notices}临时闭馆）',
      'status.reason.openRule': '按通常规则预计开放',
      'status.notice.exhibitionChangeover': '展览更换',
      'status.notice.temporaryClosure': '临时闭馆',
      'status.notice.maintenance': '设备维护',
      'status.notice.inspection': '维护检查',
      'status.notice.seasonalClosure': '季节性闭馆',
      'status.timeUnknown': '开放时间未确认',
      'status.timeUnknownNote': '指南中没有开放时间，请查看官方网站',
      'status.longClosed': '长期闭馆',
      'status.longClosedNote': '因整修等原因闭馆（预计{date}之后恢复）',
      'status.longClosedExhibitionChangeoverNote': '因换展闭馆（预计{date}之后恢复）',
      'status.longClosedIndefiniteNote': '因整修等原因闭馆（恢复日期未定，请查看官方网站）',
      'status.before': '{open}开放',
      'status.beforeNote': '{minutes}分钟后开放（{open}–{close}）',
      'status.lastCall': '距最后入馆{minutes}分钟',
      'status.estimatedSuffix': '（估算）',
      'status.lastCallNote': '最后入馆 {last}{suffix} · {close}闭馆',
      'status.openNow': '当前开放',
      'status.openNowNote': '最后入馆 {last}{suffix} · {close}闭馆',
      'status.ended': '已过最后入馆时间',
      'status.endedNote': '{close}闭馆，已停止入馆',
      'status.after': '今日已结束',
      'status.afterNote': '{close}已闭馆',
      'brand.whyKicker': '为什么叫 PYOKO？',
      'brand.whyLine': '灵感来自日语「ぴょこ」——轻轻一跳，从一个地方去往下一个地方。',
      'footer.pyokoHeading': '关于 PYOKO',
      'footer.pyokoBody': '这是为带着「东京·博物馆 Grutto Pass」出门的人做的独立非官方指南。PYOKO 这个名字来自日语「ぴょこ」——轻轻一跳，从一个地方去往下一个地方；这一小段移动，就是本站的出发点。购票与最新官方信息请以官网为准。',
      'footer.aboutMore': '了解更多关于 PYOKO',
      'footer.about': '关于本网站',
      'footer.sources': '数据与来源',
      'footer.termsHeading': '关于数据的使用',
      'footer.termsBody': '开馆时间、票价等事实本身归各设施及官方资料所有，本站并不主张权利。本站的贡献在于收录范围的选择与结构编排、逐条查证来源并留下记录（页码定位、核验日期），以及译文与编辑内容。欢迎引用与链接，但请勿整体复制、自动抓取，或用于机器学习训练。',
      'footer.termsLicense': '完整使用条款',
      'footer.coverageHeading': '收录信息',
      'footer.coverageSummary': '<strong>{catalog}</strong>家官方设施 · <strong>{total}</strong>张设施卡片',
      'footer.coverageNote': 'No.36拆分为两馆',
      'footer.passBasicsHeading': 'Grutto Pass 基本规则',
      'footer.passBasicsSummary': '可用于入场和折扣的通票',
      'footer.passValidity': '首次使用起2个月有效',
      'footer.passOnce': '每家设施限用1次',
      'footer.admissionLabel': '入场',
      'footer.admissionMeaning': '仅凭通票入场',
      'footer.discountLabel': '折扣',
      'footer.discountMeaning': '需支付差额',
      'footer.recordsHeading': '你的记录',
      'footer.displayHeading': '显示说明',
      'footer.valueHeading': '优惠额参考值',
      'footer.valueAdmission': '入场设施：按已知普通票价计算',
      'footer.valueDiscount': '折扣设施：按折扣金额计算',
      'footer.valueHigher': '两者均有：取较高值',
      'footer.valueUnknown': '费用未知：不纳入优惠额筛选',
      'footer.statusHeading': '开放状态',
      'footer.statusMethod': '根据通常闭馆规则和公开开放时间推测。',
      'footer.statusLimit': '临时闭馆及特定展览的变化未必包含在内，出行前请查看官方网站。',
      'footer.accuracyHeading': '关于信息准确性',
      'footer.accuracyBody': 'PYOKO 会尽可能根据官方来源核实并更新信息，但开放时间、休馆安排、展览及 Pass 优惠可能临时变更。来馆前建议确认页面中链接的官方信息。',
      'footer.contactHeading': '发现信息需要更新？',
      'footer.contactPrefix': '如果你发现数据有误、信息已经发生变化，或对 PYOKO 有其他问题，欢迎联系',
      'footer.contactSuffix': '。',
      'footer.unofficialShort': '非官方指南。',
      'footer.officialSite': 'Grutto Pass 官网',
      'footer.coreSourcesHeading': '基本信息',
      'footer.exhibitionSourcesHeading': '展览信息',
      'footer.recommendationsHeading': '官方推荐',
      'footer.gruttoOfficialSource': 'Grutto Pass 官方信息',
      'footer.facilityOfficialSites': '各设施官方网站',
      'footer.exhibitionList': 'Grutto Pass {year} 展览列表',
      'footer.admissionSource': '入场',
      'footer.discountSource': '折扣',
      'backTop': '返回顶部'
    }
  };

  const SUPPORTED_LANGS = ['ja', 'en', 'zh'];
  const LANG_STORAGE_KEY = 'grutto-pass-lang';
  const LANG_PARAM = 'lang';

  function normalizeLanguage(value) {
    const normalized = String(value || '').toLowerCase();
    if (normalized.startsWith('zh')) return 'zh';
    if (normalized.startsWith('en')) return 'en';
    return 'ja';
  }

  function readStoredLanguage() {
    try { return root.localStorage?.getItem(LANG_STORAGE_KEY) || ''; } catch { return ''; }
  }

  function initialLanguage() {
    let queryLanguage = '';
    try { queryLanguage = new URL(root.location.href).searchParams.get(LANG_PARAM) || ''; } catch {}
    if (queryLanguage) {
      const normalized = normalizeLanguage(queryLanguage);
      try { root.localStorage?.setItem(LANG_STORAGE_KEY, normalized); } catch {}
      return normalized;
    }
    const stored = readStoredLanguage();
    if (stored) return normalizeLanguage(stored);
    return normalizeLanguage(root.navigator?.language || 'ja');
  }

  let currentLanguage = initialLanguage();

  function interpolate(value, vars) {
    return String(value == null ? '' : value).replace(/\{([\w.]+)\}/g, (match, key) => {
      return Object.prototype.hasOwnProperty.call(vars || {}, key) ? String(vars[key]) : match;
    });
  }

  function uiText(key, vars, fallback) {
    const langTable = UI_STRINGS[currentLanguage] || UI_STRINGS.ja;
    const value = langTable[key] ?? UI_STRINGS.ja[key] ?? fallback ?? key;
    return interpolate(value, vars);
  }

  function overlayForLanguage() {
    const all = root.FACILITY_I18N || {};
    return all[currentLanguage] || {};
  }

  function contentKey(facility, item) {
    return `${facility?._key || facility?.no || ''}::${item?.url || ''}::${item?.title || ''}`;
  }

  function comparableUrl(url) {
    try {
      const parsed = new URL(url);
      const pathname = parsed.pathname.replace(/\/+$/, '') || '/';
      return `${parsed.protocol}//${parsed.host}${pathname}${parsed.search}`;
    } catch {
      return String(url || '').replace(/\/+$/, '');
    }
  }

  function isFacilityHomepage(facility, url) {
    if (!url) return false;
    const target = comparableUrl(url);
    return (facility?.urls || []).some(home => comparableUrl(home) === target);
  }

  /*
   * Classify an exhibition destination as 'exact' or 'listing'.
   *
   * Order of authority, all human-declared — nothing is guessed from a pathname:
   *   1. `EXHIBITION_LINK_TYPES` (the explicit per-URL declaration);
   *   2. the Official Source Registry's `page_type` for that URL, since a record
   *      there was already classified by a human;
   *   3. 'exact', the pre-existing default.
   */
  function classifyExhibitionUrl(facility, url) {
    const normalized = comparableUrl(url);
    if (!normalized) return 'exact';
    const declared = root.EXHIBITION_LINK_TYPES?.[normalized];
    if (declared === 'exact' || declared === 'listing') return declared;
    const records = typeof root.getFacilityOfficialSources === 'function'
      ? root.getFacilityOfficialSources(facility)
      : [];
    const record = records.find(source => comparableUrl(source?.url) === normalized);
    if (record?.page_type === 'exhibition_listing') return 'listing';
    if (record?.page_type === 'exhibition') return 'exact';
    return 'exact';
  }

  /*
   * The raw destination declared for one exhibition, before presentation policy.
   * Kept separate from getExhibitionLink so the renderer can tell "there is no
   * link at all" from "there is a link, but it is a listing and therefore must
   * not sit on the title".
   */
  function getExhibitionDestination(facility, item) {
    const facilityKey = String(facility?._key || facility?.no || '');
    const title = item?.title || '';
    const links = root.EXHIBITION_LINKS?.[facilityKey];
    if (links && Object.prototype.hasOwnProperty.call(links, title)) return links[title] || '';

    if (item?.url && !isFacilityHomepage(facility, item.url)) return item.url;

    const sourceUrl = (facility?.exhibition_sources || []).find(url => !isFacilityHomepage(facility, url));
    return sourceUrl || '';
  }

  /*
   * Presentation for one exhibition row.
   *
   *   { url, type }  url is the TITLE link and is empty unless the destination is
   *                  a page about this exhibition. A 'listing' destination is
   *                  reported with an empty url so the title stays plain text;
   *                  the caller hoists `listingUrl` into one section CTA.
   */
  function getExhibitionLinkPresentation(facility, item) {
    const url = getExhibitionDestination(facility, item);
    if (!url) return { url: '', type: 'none', listingUrl: '' };
    const type = classifyExhibitionUrl(facility, url);
    if (type === 'listing') return { url: '', type: 'listing', listingUrl: url };
    return { url, type: 'exact', listingUrl: '' };
  }

  // A title link only ever points at a page about that exhibition.
  function getExhibitionLink(facility, item) {
    return getExhibitionLinkPresentation(facility, item).url;
  }

  function facilityOverlay(facility) {
    return overlayForLanguage().facilities?.[facility?._key] || {};
  }

  const ENGLISH_CORE_FIELDS = new Set([
    'admission_label', 'closed', 'fee', 'access', 'notes', 'pass_notes', 'benefit_basis', 'tel'
  ]);

  function replaceJapaneseText(value, replacements) {
    return replacements.reduce((text, [from, to]) => text.split(from).join(to), String(value || ''));
  }

  function replaceText(value, replacements) {
    return replacements.reduce((text, [from, to]) => {
      const source = String(from || '');
      if (/^[A-Za-z]+$/.test(source)) {
        return text.replace(new RegExp(`\\b${source}\\b`, 'gi'), to);
      }
      return text.split(source).join(to);
    }, String(value || ''));
  }

  const JAPANESE_SCRIPT_RE = /[\u3040-\u30ff]/;
  const CJK_SCRIPT_RE = /[\u3400-\u9fff]/;
  const CHINESE_ALLOWED_LATIN = new Set(['JR', 'SOGO', 'MOMAS', 'ICC', 'IC']);
  function hasJapaneseScript(value) {
    return JAPANESE_SCRIPT_RE.test(String(value || ''));
  }

  function hasUntranslatedHan(value) {
    return CJK_SCRIPT_RE.test(String(value || ''));
  }

  function hasUntranslatedChineseLatin(value) {
    return (String(value || '').match(/[A-Za-z]{3,}/g) || [])
      .some(token => !CHINESE_ALLOWED_LATIN.has(token.toUpperCase()));
  }

  function englishFacilityName(facility, fallback) {
    const brochureCard = root.FACILITY_BROCHURE?.cards?.[facility?._key || facility?.no];
    if (brochureCard?.nameEn) return brochureCard.nameEn;
    const aliases = root.SEARCH_INDEX_CONFIG?.facilityAliases?.[facility?._key] || [];
    const englishAlias = aliases.find(alias => /[A-Za-z]/.test(alias));
    return englishAlias || fallback;
  }

  /*
   * Chinese content is intentionally allowed to use the official Japanese
   * proper name only when the name itself is not translatable.  A raw
   * Japanese fallback for an entire facility card is much harder to
   * understand than a Chinese rendering or a stable English proper name.
   */
  function chineseFacilityName(facility, fallback) {
    const aliases = root.SEARCH_INDEX_CONFIG?.facilityAliases?.[facility?._key] || [];
    const chineseAlias = aliases.find(alias => /[\u4e00-\u9fff]/.test(alias)
      && !hasJapaneseScript(alias)
      && /(?:博物馆|美术馆|艺术|纪念馆|资料馆|档案馆|文化馆|科学馆|动物园|水族园|植物园|庭园|公园|图书馆|展览)/.test(alias));
    if (chineseAlias) return chineseAlias;
    const translated = replaceJapaneseText(fallback, [
      ['上野の森美術館', '上野之森美术馆'], ['したまちミュージアム', '下町博物馆'],
      ['埼玉県立歴史と民俗の博物館', '埼玉县立历史与民俗博物馆'],
      ['そごう美術館', '横滨SOGO美术馆'],
      ['東京都', '东京都'], ['東京', '东京'], ['台東', '台东'], ['渋谷', '涩谷'],
      ['目黒', '目黑'], ['練馬', '练马'], ['武蔵野', '武藏野'], ['三鷹', '三鹰'],
      ['横浜', '横滨'], ['千葉', '千叶'], ['埼玉', '埼玉'], ['神奈川', '神奈川'],
      ['国立', '国立'], ['都立', '东京都立'], ['区立', '区立'], ['市立', '市立'],
      ['美術館', '美术馆'], ['美術', '美术'], ['博物館', '博物馆'], ['記念館', '纪念馆'],
      ['資料館', '资料馆'], ['文庫', '文库'], ['文化館', '文化馆'], ['科学館', '科学馆'],
      ['自然教育園', '自然教育园'], ['動物園', '动物园'], ['水族園', '水族园'],
      ['植物公園', '植物公园'], ['植物館', '植物馆'], ['庭園', '庭园'], ['公園', '公园'],
      ['写真', '摄影'], ['映画', '电影'], ['音楽', '音乐'], ['歴史', '历史'],
      ['民俗', '民俗'], ['現代', '现代'], ['国際', '国际'], ['開港', '开港'],
      ['旧東京音楽学校奏楽堂', '旧东京音乐学校奏乐堂'], ['旧岩崎邸', '旧岩崎邸'],
      ['旧芝離宮恩賜庭園', '旧芝离宫恩赐庭园'], ['旧古河庭園', '旧古河庭园'],
      ['恩賜上野動物園', '恩赐上野动物园'], ['ミュージアム', '博物馆'], ['ミュゼ', 'Musee'],
      ['パナソニック', 'Panasonic'], ['アートギャラリー', '艺术馆'], ['オペラシティ', '歌剧城'],
      ['インターコミュニケーションセンター', 'InterCommunication Center'], ['アクセサリー', 'Accessory'],
      ['アーカイブ', '档案馆'], ['ギャラリー', '画廊'], ['たましん', 'Tamashin'],
      ['シティビュー', 'City View'], ['奏楽堂', '奏乐堂'], ['松濤', '松涛'], ['鷗外', '鸥外'],
      ['漱石', '漱石'], ['芭蕉', '芭蕉'], ['千住', '千住'], ['殿ヶ谷戸', '殿谷户']
    ]);
    if (!hasJapaneseScript(translated)) return translated;
    return englishFacilityName(facility, fallback);
  }

  function translateEnglishCommon(value) {
    return replaceJapaneseText(value, [
      ['その他臨時に開館・休館することがあります', 'other temporary openings / closures may occur'],
      ['特別展等やドームシアターは別料金', 'special exhibitions and the dome theater have separate fees'],
      ['特別展は別料金', 'special exhibitions have a separate fee'],
      ['企画展は別料金', 'special exhibitions have a separate fee'],
      ['特別展の料金は', 'special exhibition fees '],
      ['企画展の料金は', 'special exhibition fees '],
      ['料金改定予定', 'prices are scheduled to change'],
      ['特別展は展覧会により異なります', 'special exhibition fees vary by exhibition'],
      ['企画展は展覧会により異なります', 'special exhibition fees vary by exhibition'],
      ['会期中無休', 'open daily during exhibitions'],
      ['会期中', 'during exhibitions'],
      ['開催時には', 'when held, '],
      ['事前日時予約制', 'advance timed reservation required'],
      ['予約不要', 'no reservation required'],
      ['入場制限', 'admission limits'],
      ['対象外', 'excluded'],
      ['特別展・企画展', 'special / temporary exhibitions'],
      ['特別展', 'special exhibition'],
      ['企画展', 'special exhibition'],
      ['常設展示', 'permanent exhibition'],
      ['常設展', 'permanent collection'],
      ['通常展', 'permanent exhibition'],
      ['その他', 'other'],
      ['臨時に休館', 'temporarily closed'],
      ['臨時に開館', 'temporarily open'],
      ['臨時に', 'temporarily'],
      ['がopen', ' are open'],
      ['はopen', ' are open'],
      ['もopen', ' are also open'],
      ['がclosed', ' are closed'],
      ['はclosed', ' are closed'],
      ['openmay', 'open; may'],
      ['closed期間', 'closure period'],
      ['closure daysは', 'closure days '],
      ['public holidaysの翌日', 'the day after public holidays'],
      ['periodは', 'period '],
      ['feeは', 'fee '],
      ['まで', ' until '],
      ['東京ドームプロ野球開催日', 'Tokyo Dome professional baseball game days'],
      ['資料の殺虫・燻蒸のため臨時休館', 'temporarily closed for pest control and fumigation'],
      ['施設整備工事のため', 'due to facility maintenance work'],
      ['そごう横浜店の休業日に準じます', 'follows Sogo Yokohama store closure days'],
      ['梅まつり期間は無休', 'open daily during the plum blossom festival'],
      ['曼珠沙華まつり', 'red spider lily festival'],
      ['冬期休館期間', 'winter closure period'],
      ['夏期休業期間', 'summer closure period'],
      ['夏期', 'summer'],
      ['冬期', 'winter'],
      ['展覧会開催中', 'during exhibitions'],
      ['土日祝日', 'weekends / public holidays'],
      ['土日祝', 'weekends / public holidays'],
      ['土日', 'weekends'],
      ['平日', 'weekdays'],
      ['展覧会によって', 'depending on the exhibition'],
      ['展覧会により異なります', 'varies by exhibition'],
      ['展示により異なります', 'varies by exhibition'],
      ['により異なります', 'varies depending on the details'],
      ['が異なります', 'varies'],
      ['が変更になります', 'will change'],
      ['対象外の展示があります', 'some exhibitions are excluded'],
      ['対象外となる場合があります', 'may be excluded'],
      ['休館日があります', 'closure days apply'],
      ['併用はできません', 'cannot be combined'],
      ['最新の情報は公式ウェブサイトをご確認ください', 'see the official website for the latest information'],
      ['最新の情報はHP等でご確認ください', 'see the official website for the latest information'],
      ['最新の情報はHPをご確認ください', 'see the official website for the latest information'],
      ['詳細はHP等でご確認ください', 'see the official website for details'],
      ['詳細はHPをご確認ください', 'see the official website for details'],
      ['ご確認ください', 'please check'],
      ['要保護者同伴', 'adult accompaniment required'],
      ['要引率者', 'adult supervisor required'],
      ['要証明書', 'proof required'],
      ['要証明', 'proof required'],
      ['入館時', 'at admission'],
      ['時靴下着用', 'socks required'],
      ['書斎棟のみ', 'study building only'],
      ['園内の洋館は庭園とは別に', 'the Western-style house has separate'],
      ['美術館入館料', 'art museum admission fee'],
      ['開館記念日', 'opening anniversary'],
      ['文化の日', 'Culture Day'],
      ['土日除く', 'excluding weekends'],
      ['両日とも', 'both days'],
      ['不定休', 'irregular closure days'],
      ['いずれも', 'all of which'],
      ['ただし', 'however'],
      ['することがあります', 'may occur'],
      ['する場合あり', 'may occur'],
      ['になる場合があります', 'may be'],
      ['などで臨時に', 'temporarily due to reasons such as'],
      ['休館', 'closed'],
      ['開館', 'open'],
      ['公開', 'open to visitors'],
      ['共通券', 'joint ticket'],
      ['券付き', 'with admission ticket'],
      ['券', 'ticket'],
      ['入館料', 'admission fee'],
      ['入園料', 'admission fee'],
      ['入場料', 'admission fee'],
      ['高校生', 'high school students'],
      ['大学生', 'university students'],
      ['中学生', 'middle school students'],
      ['小学生', 'elementary school students'],
      ['未就学児', 'preschool children'],
      ['幼児', 'preschool children'],
      ['無料', 'free'],
      ['割引', 'discount'],
      ['入場', 'admission'],
      ['入館', 'admission'],
      ['入園', 'admission'],
      ['必要', 'required'],
      ['可能性', 'possibility'],
      ['各館', 'each museum'],
      ['各庭園', 'each garden'],
      ['プラネタリウムまたは大型映像', 'planetarium or large-screen film'],
      ['プラネタリウム', 'planetarium'],
      ['大型映像', 'large-screen film'],
      ['ドームシアター', 'dome theater'],
      ['ギャラリー', 'gallery'],
      ['ルオー', 'Rouault'],
      ['コレクション', 'collection'],
      ['ミュージアム', 'museum'],
      ['美術館', 'art museum'],
      ['博物館', 'museum'],
      ['庭園', 'garden'],
      ['展覧会', 'exhibition'],
      ['展示室', 'exhibition room'],
      ['展示', 'exhibition'],
      ['当日', 'same-day'],
      ['回分', 'session(s)'],
      ['回', 'times'],
      ['引', 'off'],
      ['および', 'and'],
      ['または', 'or'],
      ['在住', 'resident'],
      ['在学', 'enrolled at a school'],
      ['都内', 'Tokyo'],
      ['横浜市内', 'Yokohama'],
      ['世田谷区内', 'within Setagaya Ward'],
      ['シニアほか各種', 'senior and other'],
      ['一部', 'some'],
      ['可', 'available'],
      ['等', 'etc.'],
      ['など', 'etc.'],
      ['他', 'other'],
      ['、', ', '],
      ['・', ' / '],
      ['。', '. '],
      ['「', '"'],
      ['」', '"'],
      ['：', ': '],
      ['／', ' / ']
    ])
      .replace(/（/g, ' (')
      .replace(/）/g, ') ')
      .replace(/([A-Za-z])etc\./g, '$1, etc.')
      .replace(/\.\s+see\b/g, '. See')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function translateEnglishClosed(value) {
    const dayNames = { '月': 'Mondays', '火': 'Tuesdays', '水': 'Wednesdays', '木': 'Thursdays', '金': 'Fridays', '土': 'Saturdays', '日': 'Sundays' };
    const ordinal = number => {
      const n = Number(number);
      const suffix = n % 100 >= 11 && n % 100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] || 'th');
      return `${n}${suffix}`;
    };
    let text = String(value || '')
      .replace(/第(\d+)([月火水木金土日])・([月火水木金土日])曜日/g, (_, number, firstDay, secondDay) => `the ${ordinal(number)} ${dayNames[firstDay]} / ${dayNames[secondDay]}`)
      .replace(/第(\d+)・第?(\d+)([月火水木金土日])曜日/g, (_, first, second, day) => `the ${ordinal(first)} and ${ordinal(second)} ${dayNames[day]}`)
      .replace(/第(\d+)([月火水木金土日])曜日/g, (_, number, day) => `the ${ordinal(number)} ${dayNames[day]}`);
    text = replaceJapaneseText(text, [
      ['不定休(年末年始、展示替などで臨時に休館)', 'irregular closure days (year-end / New Year holidays, exhibition changeover, and other temporary closures)'],
      ['不定休（年末年始、展示替などで臨時に休館）', 'irregular closure days (year-end / New Year holidays, exhibition changeover, and other temporary closures)'],
      ['展示替等で臨時休館', 'temporarily closed for exhibition changeover and similar reasons'],
      ['展示替等', 'exhibition changeover and similar'],
      ['で臨時休館', 'temporarily closed due to'],
      ['休館日は展覧会により異なる場合があります', 'closure days may vary by exhibition'],
      ['展覧会によって水曜日が開館になる場合があります', 'Wednesdays may be open depending on the exhibition'],
      ['冬期休館期間', 'winter closure period'],
      ['祝休日の翌日(土・日の場合は開園)', 'the day after public holidays (open on weekends)'],
      ['祝休日の翌日(土・日の場合は開館)', 'the day after public holidays (open on weekends)'],
      ['曼珠沙華まつり・梅まつり期間は無休', 'open daily during the red spider lily and plum blossom festivals'],
      ['企画展は毎週月曜日', 'special exhibitions: every Monday'],
      ['は資料の殺虫・燻蒸のため臨時休館', 'temporarily closed for pest control and fumigation'],
      ['その他臨時に開館・休館することがあります', 'other temporary openings / closures may occur'],
      ['火・水・日', 'Tuesdays / Wednesdays / Sundays'],
      ['その他の曜日についてはホール使用のない場合', 'on other days when the hall is not in use'],
      ['特別展・企画展は毎週月曜日', 'special / temporary exhibitions: every Monday'],
      ['祝休日の場合は開館し、両日とも開館の場合のみ翌平日休館', 'open on public holidays; if both days are open, closed the following weekday'],
      ['祝休日の場合は開館し翌日、翌々日休館', 'open on public holidays; closed the following day and the day after'],
      ['祝休日・都民の日の場合は開館し翌日休館', 'open on public holidays and Tokyo Citizens’ Day; closed the following day'],
      ['祝休日の場合および11/9は開館', 'open on public holidays and Nov 9'],
      ['祝休日等の場合は前日', 'the previous day if a public holiday or similar'],
      ['祝日の翌日(土日除く)', 'the day after public holidays (excluding weekends)'],
      ['祝休日の翌平日', 'the next weekday after public holidays'],
      ['祝休日・都民の日の場合は開園し翌日休園', 'open on public holidays and Tokyo Citizens’ Day; closed the following day'],
      ['祝休日の場合は開館し翌平日休館', 'open on public holidays; closed the following weekday'],
      ['祝休日の場合は開館し翌日休館', 'open on public holidays; closed the following day'],
      ['祝休日の場合は開館', 'open on public holidays'],
      ['祝休日の場合は開園し翌日休園', 'open on public holidays; closed the following day'],
      ['祝休日の場合は開園', 'open on public holidays'],
      ['毎月最終水曜日', 'the last Wednesday of each month'],
      ['第1・第5月曜日', 'the 1st and 5th Mondays'],
      ['第1・第5火曜日', 'the 1st and 5th Tuesdays'],
      ['第1・第5水曜日', 'the 1st and 5th Wednesdays'],
      ['第2・第4火曜日', 'the 2nd and 4th Tuesdays'],
      ['第2・第4水曜日', 'the 2nd and 4th Wednesdays'],
      ['第1・3月曜日', 'the 1st and 3rd Mondays'],
      ['第2・第4月曜日', 'the 2nd and 4th Mondays'],
      ['毎週月曜日', 'every Monday'],
      ['月・木曜日', 'Mondays / Thursdays'],
      ['日曜日・祝日', 'Sundays / public holidays'],
      ['年末年始', 'year-end / New Year holidays'],
      ['展示替期間', 'exhibition changeover period'],
      ['展示替', 'exhibition changeover'],
      ['資料整理休館日', 'collection maintenance closure days'],
      ['保守点検日', 'maintenance / inspection days'],
      ['保守点検等', 'maintenance / inspection'],
      ['整備休館', 'maintenance closure'],
      ['臨時休館日', 'irregular closure days'],
      ['臨時休館', 'temporary closure'],
      ['工事のため休館予定', 'planned closure for construction'],
      ['休館日', 'closure days'],
      ['休園', 'closed'],
      ['開園', 'open'],
      ['休館', 'closed'],
      ['開館', 'open'],
      ['無休', 'open daily'],
      ['入学試験期間', 'entrance examination period'],
      ['春・夏休み期間', 'spring / summer vacation period'],
      ['くん蒸期間', 'fumigation period'],
      ['工事のため休館予定', 'planned closure for construction'],
      ['詳細はHP等でご確認ください', 'see the official website for details'],
      ['詳細はHPをご確認ください', 'see the official website for details'],
      ['詳細はHPでご確認ください', 'see the official website for details'],
      ['展覧会により異なります', 'varies by exhibition'],
      ['展覧会により異なる場合があります', 'may vary by exhibition'],
      ['展示により異なります', 'varies by exhibition'],
      ['展示により異なる場合があります', 'may vary by exhibition'],
      ['その他臨時に開館・休館することがあります', 'other temporary openings / closures may occur'],
      ['休館日は展覧会により異なる場合があります', 'closure days may vary by exhibition'],
      ['休館は展示により異なります', 'closure days vary by exhibition'],
      ['施設整備工事のため休館', 'closed due to facility maintenance work'],
      ['資料の殺虫・燻蒸のため臨時休館', 'temporarily closed for pest control and fumigation'],
      ['秋頃まで', 'until around autumn '],
      ['休館予定', 'planned closure'],
      ['祝休日', 'public holidays'],
      ['祝日', 'public holidays'],
      ['月曜日', 'Mondays'],
      ['火曜日', 'Tuesdays'],
      ['水曜日', 'Wednesdays'],
      ['木曜日', 'Thursdays'],
      ['金曜日', 'Fridays'],
      ['土曜日', 'Saturdays'],
      ['日曜日', 'Sundays'],
      ['翌々日休館', 'closed the following two days'],
      ['翌平日休館', 'closed the following weekday'],
      ['翌日休館', 'closed the following day'],
      ['12/29~1/3', 'Dec 29–Jan 3'],
      ['12/29~1/4', 'Dec 29–Jan 4'],
      ['12/28~1/4', 'Dec 28–Jan 4'],
      ['12/28~1/3', 'Dec 28–Jan 3'],
      ['12/29-1/3', 'Dec 29–Jan 3'],
      ['12/29-1/1', 'Dec 29–Jan 1']
    ]);
    const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return translateEnglishCommon(text)
      .replace(/([0-9]+)月下旬頃/g, (_, month) => `around late ${monthNames[Number(month)] || month}`)
      .replace(/([0-9]+)月中旬/g, (_, month) => `mid-${monthNames[Number(month)] || month}`)
      .replace(/([0-9]+)月上旬/g, (_, month) => `early ${monthNames[Number(month)] || month}`)
      .replace(/([0-9]+)月/g, (_, month) => monthNames[Number(month)] || `${month}/`)
      .replace(/([0-9]+)日/g, '$1')
      .replace(/~|～/g, '–')
      .replace(/([0-9]+)\/([0-9]+)[-–~]([0-9]+)\/([0-9]+)/g, '$1/$2–$3/$4')
      .replace(/、/g, ', ')
      .replace(/。/g, '. ')
      .replace(/※|\*/g, 'Note: ')
      .replace(/(?<!\s)\(/g, ' (')
      .replace(/\)(?=[A-Za-z])/g, ') ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function translateEnglishFee(value) {
    let text = replaceJapaneseText(value, [
      ['常設展示・企画展割引:', 'Permanent / special exhibition discount: '],
      ['常設展割引:', 'Permanent collection discount: '],
      ['企画展割引:', 'Special exhibition discount: '],
      ['特別展割引:', 'Special exhibition discount: '],
      ['一般料金の', 'regular adult admission '],
      ['ぐるっとパス利用後', 'after using the Grutto Pass'],
      ['常設展観覧料', 'permanent collection admission fee'],
      ['詳細はHP等でご確認ください', 'see the official website for details'],
      ['詳細はHPでご確認ください', 'see the official website for details'],
      ['詳細はHPをご確認ください', 'see the official website for details'],
      ['高校生(高等専門学校生含む)以下と満65歳以上は', 'high school students and younger, including technical college students, and age 65+ are'],
      ['常設展示・企画展無料(入館時要証明)', 'permanent exhibition / special exhibition are free (proof required at admission)'],
      ['常設展示・企画展無料', 'permanent exhibition / special exhibition are free'],
      ['高校生以下と満65歳以上は', 'high school students and younger, and age 65+ are'],
      ['満65歳以上は', 'age 65+ are'],
      ['18歳未満は', 'under age 18 are'],
      ['特別展の入場は', 'special exhibition admission is'],
      ['特別展の料金は', 'special exhibition fees '],
      ['企画展の料金は', 'special exhibition fees '],
      ['Feeの', 'fee '],
      ['料金の', 'fee '],
      ['にdiscount', ' discount'],
      ['できます', 'can be used'],
      ['のみ対象', 'eligible only'],
      ['建物公開展', 'building exhibition'],
      ['帆船日本丸', 'Nippon Maru sailing ship'],
      ['収蔵品展', 'collection exhibition'],
      ['館蔵品展', 'museum collection exhibition'],
      ['所蔵作品展', 'collection exhibition'],
      ['東博', 'Tokyo National Museum'],
      ['※特別展等やドームシアターは別料金', 'Note: special exhibitions and the dome theater have separate fees'],
      ['※特別展は別料金', 'Note: special exhibitions have a separate fee'],
      ['※企画展は別料金', 'Note: special exhibitions have a separate fee'],
      ['特別展等やドームシアターは別料金', 'special exhibitions and the dome theater have separate fees'],
      ['特別展は別料金', 'special exhibitions have a separate fee'],
      ['企画展は別料金', 'special exhibitions have a separate fee'],
      ['特別展の料金は', 'special exhibition fees '],
      ['企画展の料金は', 'special exhibition fees '],
      ['特別展は展覧会により異なります', 'special exhibition fees vary by exhibition'],
      ['企画展は展覧会により異なります', 'special exhibition fees vary by exhibition'],
      ['特別展開催時には', 'when special exhibitions are held, '],
      ['特別展のadmissionは', 'special exhibition admission '],
      ['特別展のadmission', 'special exhibition admission'],
      ['展示会開催時には', 'when exhibitions are held, '],
      ['特別展の料金', 'special exhibition fees'],
      ['企画展の料金', 'special exhibition fees'],
      ['一般料金の団体割引相当額', 'group-rate equivalent discount'],
      ['満70歳以上', 'age 70+'],
      ['満65歳以上', 'age 65+'],
      ['満18歳未満', 'under age 18'],
      ['高校生(高等専門学校生含む)以下', 'high school students and younger, including technical college students'],
      ['中・高校生', 'middle / high school students'],
      ['小(4歳以上)', 'elementary school students (age 4+)'],
      ['25歳以下', 'age 25 and under'],
      ['18歳未満', 'under age 18'],
      ['4歳~中学生', 'age 4 to middle school students'],
      ['高校生以上', 'high school students and older'],
      ['土・日・祝日', 'weekends / public holidays'],
      ['土・日・祝・休日', 'weekends / public holidays'],
      ['夏休み期間中', 'during summer vacation'],
      ['各特別展', 'each special exhibition'],
      ['ぐるっとパス', 'Grutto Pass'],
      ['入場付', 'admission with'],
      ['特別展等', 'special exhibitions'],
      ['（常設展示）', '(Permanent exhibition)'],
      ['(常設展示)', '(Permanent exhibition)'],
      ['（常設展）', '(Permanent collection)'],
      ['(常設展)', '(Permanent collection)'],
      ['（企画展）', '(Special exhibition)'],
      ['(企画展)', '(Special exhibition)'],
      ['（特別展）', '(Special exhibition)'],
      ['(特別展)', '(Special exhibition)'],
      ['特別展は展覧会により異なります', 'special exhibition fees vary by exhibition'],
      ['企画展は展覧会により異なります', 'special exhibition fees vary by exhibition'],
      ['通常展(コレクション展)', 'permanent collection'],
      ['常設展・企画展・特別展入場', 'permanent collection / special exhibition admission'],
      ['特別展割引:', 'special exhibition discount: '],
      ['一般料金の', 'regular adult admission '],
      ['常設展入場', 'permanent collection admission'],
      ['企画展入場', 'special exhibition admission'],
      ['特別展入場', 'special exhibition admission'],
      ['通常時間内適用', 'applies during regular hours'],
      ['常設展示', 'Permanent exhibition'],
      ['常設展', 'Permanent collection'],
      ['企画展', 'Special exhibition'],
      ['特別展', 'Special exhibition'],
      ['特別展は展覧会により異なります', 'special exhibition fees vary by exhibition'],
      ['企画展は展覧会により異なります', 'special exhibition fees vary by exhibition'],
      ['コレクション展', 'collection exhibition'],
      ['通常展', 'permanent exhibition'],
      ['常設展・企画展・特別展入場', 'permanent collection / special exhibition admission'],
      ['特別展割引', 'special exhibition discount'],
      ['常設展入場', 'permanent collection admission'],
      ['企画展入場', 'special exhibition admission'],
      ['特別展入場', 'special exhibition admission'],
      ['通常時間内適用', 'applies during regular hours'],
      ['各庭園の通常入園料', 'regular admission fee for each garden'],
      ['通常入園料', 'regular admission fee'],
      ['一般料金', 'regular adult admission'],
      ['団体割引相当額', 'group-rate equivalent discount'],
      ['大・20歳未満', 'university students / under age 20 '],
      ['65歳以上・高', 'age 65+ / high school students'],
      ['入館時要証明', 'proof required at admission'],
      ['パスで入場', 'admission with the pass'],
      ['パス利用時', 'with the pass'],
      ['現金のみの取扱いとなります', 'cash only'],
      ['展覧会により異なります', 'varies by exhibition'],
      ['展示により異なります', 'varies by exhibition'],
      ['※特別展は別料金', 'Note: special exhibitions have a separate fee'],
      ['※企画展は別料金', 'Note: special exhibitions have a separate fee'],
      ['※特別展等やドームシアターは別料金', 'Note: special exhibitions and the dome theater have separate fees'],
      ['※小学生以下および都内在住・在学の中学生は無料', 'Note: free for elementary school students and younger, and Tokyo-resident or Tokyo-school middle school students'],
      ['※小学生以下、都内在住または在学の中学生は無料', 'Note: free for elementary school students and younger, and Tokyo-resident or Tokyo-school middle school students'],
      ['※高校生以下は無料', 'Note: free for high school students and younger'],
      ['※中学生以下は無料', 'Note: free for middle school students and younger'],
      ['※小学生未満は無料', 'Note: free for preschool children'],
      ['※小学生以下は無料', 'Note: free for elementary school students and younger'],
      ['※18歳以下・高校生は無料', 'Note: free for ages 18 and under and high school students'],
      ['※6歳以下の未就学児は無料', 'Note: free for preschool children age 6 and under'],
      ['※4歳未満は無料', 'Note: free for children under 4'],
      ['※料金改定予定', 'Note: prices are scheduled to change'],
      ['無料', 'Free'],
      ['大人', 'Adults'],
      ['一般', 'Adults '],
      ['高・大', 'high school / university students'],
      ['大・高', 'university / high school students'],
      ['小・中・高', 'elementary / middle / high school students'],
      ['小・中', 'elementary / middle school students'],
      ['中学生以下', 'middle school students and younger'],
      ['高校生以下', 'high school students and younger'],
      ['小学生以下', 'elementary school students and younger'],
      ['高等専門学校生', 'technical college students'],
      ['大学生', 'university students'],
      ['高校生', 'high school students'],
      ['中学生', 'middle school students'],
      ['小学生', 'elementary school students'],
      ['幼児', 'preschool children'],
      ['未就学児', 'preschool children'],
      ['65歳以上', 'age 65+'],
      ['70歳以上', 'age 70+'],
      ['20歳未満', 'under age 20 '],
      ['18歳以下', 'age 18 and under '],
      ['6歳以下', 'age 6 and under '],
      ['4歳未満', 'under age 4 '],
      ['学生', 'students'],
      ['こども', 'children'],
      ['別料金', 'separate fee'],
      ['改定予定', 'scheduled to change'],
      ['開催初日', 'opening day'],
      ['開催時', 'when held'],
      ['含む', 'including'],
      ['方と', 'people and'],
      ['方', 'people'],
      ['以上', 'and older'],
      ['以下', 'and younger'],
      ['はFree', ' are free'],
      ['は無料', ' are free'],
      ['があります', ' are available'],
      ['です', '.'],
      ['を', ' '],
      ['中 /', 'middle /'],
      ['高 /', 'high school /'],
      ['料金は', 'fees '],
      ['入場料', 'admission fee'],
      ['料は', 'fee '],
      ['料金', 'Fee'],
      ['割引', 'discount'],
      ['入場', 'admission'],
      ['入館', 'admission'],
      ['観覧', 'admission'],
      ['※', 'Note: '],
      ['、', ', '],
      ['・', ' / '],
      ['。', '. ']
    ]);
    text = text
      .replace(/([0-9][0-9,]*)円引/g, '¥$1 off')
      .replace(/(^|[（( /・])大(?=¥?[0-9])/g, '$1university students ')
      .replace(/(^|[（( /・])高(?=¥?[0-9])/g, '$1high school students ')
      .replace(/(^|[（( /・])中(?=¥?[0-9])/g, '$1middle school students ')
      .replace(/(^|[（( /・])小(?=¥?[0-9])/g, '$1elementary school students ')
      .replace(/([0-9][0-9,]*)円/g, '¥$1')
      .replace(/50％引|50%引/g, '50% off')
      .replace(/半額/g, 'half price')
      .replace(/\)(?=[A-Za-z])/g, ') ')
      .replace(/(?<!\s)Note:/g, ' Note:')
      .replace(/\s+/g, ' ')
      .trim();
    return translateEnglishCommon(text)
      .replace(/\/(?=[A-Za-z])/g, '/ ')
      .replace(/([A-Za-z])¥/g, '$1 ¥')
      .replace(/\s*\/\s*/g, ' / ')
      .replace(/age 65\+ are,\s+permanent exhibition/gi, 'age 65+ are; permanent exhibition')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function translateEnglishAccess(value) {
    let text = replaceJapaneseText(value, [
      ['台東区循環バス(東西めぐりん)', 'Taito City loop bus (Tosai Megurin)'],
      ['台東区循環バス（東西めぐりん）', 'Taito City loop bus (Tosai Megurin)'],
      ['京成上野駅', 'Keisei-Ueno Station'], ['上野駅', 'Ueno Station'], ['鶯谷駅', 'Uguisudani Station'],
      ['初台駅', 'Hatsudai Station'],
      ['都営新宿線直通', 'Toei Shinjuku Line through service'],
      ['東京駅', 'Tokyo Station'], ['横浜駅', 'Yokohama Station'], ['渋谷駅', 'Shibuya Station'],
      ['千駄木駅', 'Sendagi Station'], ['本駒込駅', 'Hon-Komagome Station'], ['根津駅', 'Nezu Station'],
      ['大宮公園駅', 'Omiya-Koen Station'], ['書道博物館', 'Calligraphy Museum'], ['百花園前', 'Hyakkaen-mae'],
      ['東西めぐりん', 'Taito City loop bus (Tosai Megurin)'], ['北めぐりん', 'Taito City loop bus (Kita Megurin)'],
      ['旧東京音楽学校奏楽堂', 'Former Tokyo Music School Sogakudo Concert Hall'],
      ['番出口直結', 'Exit directly connected'],
      ['東口直結徒歩', 'East Exit directly connected; walk '],
      ['直結徒歩', 'directly connected; walk '],
      ['公園改札徒歩', 'Park ticket gate; walk '],
      ['公園口徒歩', 'Park Exit walk '],
      ['出口徒歩', 'Exit walk '],
      ['番出口徒歩', 'Exit walk '],
      ['南口徒歩', 'South Exit walk '],
      ['北口徒歩', 'North Exit walk '],
      ['東口徒歩', 'East Exit walk '],
      ['西口徒歩', 'West Exit walk '],
      ['下車徒歩', 'get off; walk '],
      ['徒歩約', 'walk approx. '],
      ['徒歩', 'walk '],
      ['からバス', 'from; bus '],
      ['東京メトロ銀座線・日比谷線', 'Tokyo Metro Ginza / Hibiya Lines'],
      ['東京メトロ銀座線・日比谷線', 'Tokyo Metro Ginza / Hibiya Lines'],
      ['東京メトロ丸ノ内線・南北線', 'Tokyo Metro Marunouchi / Namboku Lines'],
      ['東京メトロ千代田線', 'Tokyo Metro Chiyoda Line'],
      ['東京メトロ日比谷線', 'Tokyo Metro Hibiya Line'],
      ['東京メトロ銀座線', 'Tokyo Metro Ginza Line'],
      ['東京メトロ半蔵門線', 'Tokyo Metro Hanzomon Line'],
      ['東京メトロ有楽町線', 'Tokyo Metro Yurakucho Line'],
      ['東京メトロ副都心線', 'Tokyo Metro Fukutoshin Line'],
      ['東京メトロ東西線', 'Tokyo Metro Tozai Line'],
      ['東京メトロ南北線', 'Tokyo Metro Namboku Line'],
      ['都営地下鉄大江戸線', 'Toei Oedo Line'],
      ['都営大江戸線', 'Toei Oedo Line'],
      ['都営新宿線', 'Toei Shinjuku Line'],
      ['都営三田線', 'Toei Mita Line'],
      ['都営浅草線', 'Toei Asakusa Line'],
      ['東京さくらトラム(都電荒川線)', 'Tokyo Sakura Tram (Toden Arakawa Line)'],
      ['JR京浜東北線', 'JR Keihin-Tohoku Line'],
      ['JR総武線', 'JR Sobu Line'],
      ['JR山手線', 'JR Yamanote Line'],
      ['JR中央線', 'JR Chuo Line'],
      ['JR南武線', 'JR Nambu Line'],
      ['JR京葉線', 'JR Keiyo Line'],
      ['京王新線', 'Keio New Line'],
      ['京王井の頭線', 'Keio Inokashira Line'],
      ['京王線', 'Keio Line'],
      ['小田急線', 'Odakyu Line'],
      ['小田急バス', 'Odakyu Bus'],
      ['西武新宿線', 'Seibu Shinjuku Line'],
      ['西武池袋線', 'Seibu Ikebukuro Line'],
      ['西武多摩湖線', 'Seibu Tamako Line'],
      ['東武アーバンパークライン(野田線)', 'Tobu Urban Park Line (Noda Line)'],
      ['東武スカイツリーライン', 'Tobu Skytree Line'],
      ['東武アーバンパークライン', 'Tobu Urban Park Line'],
      ['東武伊勢崎線', 'Tobu Isesaki Line'],
      ['京成押上線', 'Keisei Oshiage Line'],
      ['みなとみらい線', 'Minatomirai Line'],
      ['りんかい線', 'Rinkai Line'],
      ['多摩モノレール', 'Tama Monorail'],
      ['東京モノレール', 'Tokyo Monorail'],
      ['ゆりかもめ', 'Yurikamome'],
      ['東急田園都市線', 'Tokyu Den-en-toshi Line'],
      ['東急東横線', 'Tokyu Toyoko Line'],
      ['東急目黒線', 'Tokyu Meguro Line'],
      ['東急大井町線', 'Tokyu Oimachi Line'],
      ['東急線', 'Tokyu Line'],
      ['都電荒川線', 'Toden Arakawa Line'],
      ['東京さくらトラム', 'Tokyo Sakura Tram'],
      ['JR京浜東北線', 'JR Keihin-Tohoku Line'],
      ['JR総武快速線', 'JR Sobu Rapid Line'],
      ['JR線', 'JR Line'],
      ['京浜東北線', 'Keihin-Tohoku Line'],
      ['総武快速線', 'Sobu Rapid Line'],
      ['総武線', 'Sobu Line'],
      ['山手線', 'Yamanote Line'],
      ['中央線', 'Chuo Line'],
      ['京葉線', 'Keiyo Line'],
      ['南武線', 'Nambu Line'],
      ['青梅線', 'Ome Line'],
      ['横浜線', 'Yokohama Line'],
      ['武蔵野線', 'Musashino Line'],
      ['有楽町線', 'Yurakucho Line'],
      ['副都心線', 'Fukutoshin Line'],
      ['千代田線', 'Chiyoda Line'],
      ['日比谷線', 'Hibiya Line'],
      ['銀座線', 'Ginza Line'],
      ['半蔵門線', 'Hanzomon Line'],
      ['南北線', 'Namboku Line'],
      ['東西線', 'Tozai Line'],
      ['大江戸線', 'Oedo Line'],
      ['丸ノ内線', 'Marunouchi Line'],
      ['都営バス', 'Toei Bus'],
      ['京成バス', 'Keisei Bus'],
      ['京王バス', 'Keio Bus'],
      ['西東京バス', 'Nishi-Tokyo Bus'],
      ['西武バス', 'Seibu Bus'],
      ['東急バス', 'Tokyu Bus'],
      ['台東区循環バス', 'Taito City loop bus'],
      ['循環バス', 'loop bus'],
      ['市営地下鉄', 'municipal subway'],
      ['市営バス', 'municipal bus'],
      ['JR・私鉄', 'JR / private railway'],
      ['JR', 'JR'],
      ['京成線', 'Keisei Line'],
      ['京王線', 'Keio Line'],
      ['都営', 'Toei'],
      ['東京メトロ', 'Tokyo Metro'],
      ['新南口', 'New South Exit'],
      ['新都心口', 'Shintoshin Exit'],
      ['八重洲南口', 'Yaesu South Exit'],
      ['丸の内南口', 'Marunouchi South Exit'],
      ['公園改札口', 'Park ticket gate'],
      ['公園改札', 'Park ticket gate'],
      ['北改札', 'North ticket gate'],
      ['中央改札', 'Central ticket gate'],
      ['改札口', 'ticket gate'],
      ['東口', 'East Exit'],
      ['西口', 'West Exit'],
      ['北口', 'North Exit'],
      ['南口', 'South Exit'],
      ['公園口', 'Park Exit'],
      ['中央口', 'Central Exit'],
      ['改札', 'ticket gate'],
      ['ICカード専用', 'IC card only'],
      ['番出口', ' Exit'],
      ['出口', ' Exit'],
      ['各駅停車', 'local service'],
      ['各停', 'local service'],
      ['各線', 'all lines'],
      ['地下鉄', 'subway'],
      ['直結', 'directly connected'],
      ['直通', 'through service'],
      ['下車', 'get off at'],
      ['乗り場', 'boarding area'],
      ['バス停', 'bus stop'],
      ['終点', 'terminal stop'],
      ['駅前', 'in front of the station'],
      ['駅', ' Station'],
      ['電車', 'Train'],
      ['バス', 'bus'],
      ['にて', 'via'],
      ['方面', 'direction'],
      ['行き', 'bound for'],
      ['または', 'or'],
      ['各徒歩', 'each walk '],
      ['他', 'etc.'],
      ['から', 'from'],
      ['、', ', '],
      ['・', ' / '],
      ['「', '“'],
      ['」', '”'],
      ['~', '–'],
      ['～', '–']
    ]);
    return translateEnglishCommon(text)
      .replace(/徒歩約?([0-9]+)分/g, 'walk $1 min')
      .replace(/([0-9]+)分/g, '$1 min')
      .replace(/Station(?=[0-9])/g, 'Station ')
      .replace(/Exit(?=walk)/g, 'Exit ')
      .replace(/Exit(?=\()/g, 'Exit ')
      .replace(/”(?=walk)/g, '” ')
      .replace(/([0-9]+)番/g, '$1')
      .replace(/([0-9])Exit/g, '$1 Exit')
      .replace(/[“”]/g, '"')
      .replace(/\b(JR|Line|Lines|railway)\s*"/g, '$1 "')
      .replace(/"(?=(Park|South|North|East|West|Central|New|[0-9]+|A[0-9]|get off|walk))/g, '" ')
      .replace(/\)(?=")/g, ') ')
      .replace(/(?<!\s)\(/g, ' (')
      .replace(/\)(?=[A-Za-z])/g, ') ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function translateEnglishHours(value) {
    const text = String(value || '').replace(/金・土は(\d{1,2}:\d{2})まで/g, 'Fridays / Saturdays until $1');
    return translateEnglishCommon(replaceJapaneseText(text, [
      ['金・土は', 'Fridays / Saturdays are '],
      ['金・土', 'Fridays / Saturdays '],
      ['土・日・祝日', 'weekends / public holidays'],
      ['土・日', 'weekends'],
      ['土日は', 'on weekends'],
      ['平日は', 'on weekdays'],
      ['入館は', 'admission ends '],
      ['入館', 'admission']
    ])).replace(/〜|～/g, '–').replace(/\s+/g, ' ').trim();
  }

  /* Chinese uses the same reviewed source facts as English, but the output
     must not silently fall back to Japanese.  Translating the normalized
     English vocabulary here keeps dates, prices and route syntax consistent
     while leaving official abbreviations such as JR intact. */
  function translateChineseCommon(value) {
    const text = replaceText(value, [
      ['Permanent / special exhibition discount:', '常设展／特别展览折扣：'],
      ['Permanent collection discount:', '常设展折扣：'],
      ['Special exhibition discount:', '特别展览折扣：'],
      ['Fridays / Saturdays until', '周五／周六至'],
      ['after using the Grutto Pass', '使用通票后'],
      ['permanent collection admission fee', '常设展入场费'],
      ['permanent exhibition / special exhibition are free (proof required at admission)', '常设展／特别展览免费（入场时需出示证明）'],
      ['permanent exhibition / special exhibition are free', '常设展／特别展览免费'],
      ['Tuesdays / Wednesdays / Sundays (on other days when the hall is not in use) open to visitors', '周二／周三／周日（其他日期如场馆未使用则对外开放）'],
      ['and other temporary closures', '以及其他临时闭馆'],
      ['Taito City loop bus (Tosai Megurin)', '台东区循环巴士（东西环线巴士）'],
      ['Taito City loop bus (Kita Megurin)', '台东区循环巴士（北线环线巴士）'],
      ['Taito City loop bus', '台东区循环巴士'],
      ['Tosai Megurin', '东西环线巴士'], ['Kita Megurin', '北线环线巴士'],
      ['Former Tokyo Music School Sogakudo Concert Hall', '旧东京音乐学校奏乐堂'],
      ['high school students and younger, including technical college students, and age 65+ are', '高中生及以下（包括高等专门学校学生），以及65岁以上人群'],
      ['Note: free for elementary school students and younger, and Tokyo-resident or Tokyo-school middle school students', '注：小学生及以下，以及居住在东京都或在东京都就读的初中生免费'],
      ['Note: free for ages 18 and under and high school students', '注：18岁及以下人群和高中生免费'],
      ['Note: free for high school students and younger', '注：高中生及以下免费'],
      ['Note: free for middle school students and younger', '注：初中生及以下免费'],
      ['Note: free for elementary school students and younger', '注：小学生及以下免费'],
      ['Note: free for preschool children', '注：学龄前儿童免费'],
      ['proof required at admission', '入场时需出示证明'],
      ['admission applies during regular hours', '开放时间内适用'],
      ['adult accompaniment required', '需由成年人陪同'],
      ['no reservation required', '无需预约'],
      ['advance timed reservation required', '需提前预约时段'],
      ['open to visitors', '对外开放'],
      ['temporarilyclosed', '临时闭馆'],
      ['temporarily closed', '临时闭馆'],
      ['depending on the exhibition', '视展览而定'],
      ['when held', '举办时'],
      ['opening anniversary', '开馆纪念日'],
      ['Tokyo Citizens’ Day', '东京都民日'],
      ['special exhibitions and the dome theater have separate fees', '特别展览和穹顶剧场另收费'],
      ['special exhibitions have a separate fee', '特别展览另收费'],
      ['special exhibition fees vary by exhibition', '特别展览费用因展览而异'],
      ['special exhibition fees', '特别展览费用'],
      ['Special exhibition fees vary by exhibition', '特别展览费用因展览而异'],
      ['Special exhibition', '特别展览'],
      ['special / temporary exhibitions', '特别展览／临时展览'],
      ['elementary / middle / high school students', '小学生／初中生／高中生'],
      ['elementary / middle school students', '小学生／初中生'],
      ['high school / university students', '高中生／大学生'],
      ['university / high school students', '大学生／高中生'],
      ['Permanent exhibition', '常设展'], ['Permanent collection', '常设展'],
      ['temporarily closed', '临时闭馆'],
      ['permanent collection / special exhibition admission', '常设展／特别展览入场'],
      ['permanent collection admission', '常设展入场'],
      ['permanent collection', '常设展'],
      ['permanent exhibition', '常设展'],
      ['special exhibition admission', '特别展览入场'],
      ['special exhibition discount', '特别展览折扣'],
      ['special exhibition', '特别展览'],
      ['art museum admission fee', '美术馆入场费'],
      ['study building only', '仅书斋楼'],
      ['the day after public holidays (excluding weekends)', '节假日后的下一个工作日（周末除外）'],
      ['the day after public holidays', '节假日后的次日'],
      ['the previous day if a public holiday or similar', '如遇节假日等则提前一天'],
      ['the last Wednesday of each month', '每月最后一个周三'],
      ['all of which', '均'],
      ['regular hours', '开放时间'],
      ['collection exhibition', '馆藏展'],
      ['museum collection exhibition', '馆藏展'],
      ['building exhibition', '建筑展'],
      ['Nippon Maru sailing ship', '日本丸帆船'],
      ['planetarium', '天文馆'],
      ['large-screen film', '大屏影像'],
      ['session(s)', '场'],
      ['with admission ticket', '含入场券'],
      ['admission ticket', '入场券'],
      ['regular admission fee', '普通入场费'],
      ['scheduled to change', '计划调整'],
      ['opening day', '开幕日'],
      ['regular adult admission', '成人普通票价'],
      ['group-rate equivalent discount', '相当于团体票价的折扣'],
      ['admission fee', '入场费'],
      ['admission with the pass', '凭通票入场'],
      ['with the pass', '使用通票时'],
      ['admission limits', '入场限制'],
      ['admission', '入场'],
      ['university students', '大学生'],
      ['high school students and younger, including technical college students', '高中生及以下（包括高等专门学校学生）'],
      ['high school students and younger', '高中生及以下'],
      ['high school students and older', '高中生及以上'],
      ['middle school students and younger', '初中生及以下'],
      ['middle / high school students', '初中生／高中生'],
      ['elementary school students and younger', '小学生及以下'],
      ['elementary school students', '小学生'],
      ['technical college students', '高等专门学校学生'],
      ['preschool children', '学龄前儿童'],
      ['age 70+', '70岁以上'],
      ['age 65+', '65岁以上'],
      ['age 18 and under', '18岁及以下'],
      ['under age 20', '未满20岁'],
      ['under age 18', '未满18岁'],
      ['and older', '及以上'],
      ['and younger', '及以下'],
      ['Adults', '成人'],
      ['students', '学生'],
      ['free', '免费'],
      ['separate fee', '另收费'],
      ['varies depending on the details', '费用因具体内容而异'],
      ['varies by exhibition', '费用因展览而异'],
      ['may vary by exhibition', '可能因展览而异'],
      ['some exhibitions are excluded', '部分展览不适用'],
      ['may be excluded', '可能不适用'],
      ['see the official website for the latest information', '最新信息请查看官方网站'],
      ['see the official website for details', '详情请查看官方网站'],
      ['please check', '请查看'],
      ['proof required at admission', '入场时需出示证明'],
      ['cash only', '仅限现金'],
      ['open daily during exhibitions', '展览期间每日开放'],
      ['during exhibitions', '展览期间'],
      ['weekends / public holidays', '周末／法定节假日'],
      ['weekends', '周末'],
      ['weekdays', '工作日'],
      ['public holidays', '法定节假日'],
      ['year-end / New Year holidays', '年末年初假期'],
      ['exhibition changeover period', '换展期间'],
      ['exhibition changeover', '换展'],
      ['winter closure period', '冬季闭馆期间'],
      ['summer closure period', '夏季闭馆期间'],
      ['temporary closure', '临时闭馆'],
      ['irregular closure days', '临时闭馆日'],
      ['closure days', '闭馆日'],
      ['closed the following weekday', '下一个工作日闭馆'],
      ['closed the following day', '次日闭馆'],
      ['closed daily', '每日闭馆'],
      ['closed', '闭馆'],
      ['open daily', '每日开放'],
      ['open on public holidays', '法定节假日开放'],
      ['open', '开放'],
      ['other temporary openings / closures may occur', '可能还有其他临时开放／闭馆安排'],
      ['No confirmed closure rule applies', '未发现确定的闭馆规则'],
      ['Note:', '注：'],
      ['periodetc.', '期间等'], ['exhibition changeover periodetc.', '换展期间等'], ['etc.', '等'],
      ['fumigation period', '熏蒸期间'], ['private railway', '私铁'], ['Taito City loop bus', '台东区循环巴士'],
      ['Tokyo City loop bus', '东京区内循环巴士'], ['loop bus', '循环巴士'], ['get off', '下车'],
      ['follows Sogo Yokohama store closure days', '按横滨SOGO商店闭店日安排'],
      ['Sogo Yokohama store', '横滨SOGO商店'], ['local service', '各站停车'],
      ['same-day', '当日'], ['official website', '官方网站'], ['latest information', '最新信息'],
      ['additional notes', '其他注意事项'], ['Fee', '费用'], ['fees', '费用'],
      ['discount', '优惠'], ['off', '优惠'], ['resident', '居民'], ['enrolled at a school', '在校就读'],
      ['possibility', '可能性'], ['required', '需要'], ['available', '可用'],
      ['Tobu Skytree Line', '东武晴空塔线'], ['Tozai Line', '东西线'], ['Shinjuku Line', '新宿线'],
      ['Keio New Line', '京王新线'], ['Hatsudai', '初台'], ['through service', '直通'],
      ['Asakusa Line', '浅草线'], ['Fukutoshin Line', '副都心线'], ['Yurakucho Line', '有乐町线'],
      ['Keihin-Tohoku Line', '京滨东北线'], ['Yamanote Line', '山手线'], ['Chuo Line', '中央线'],
      ['Sobu Line', '总武线'], ['Keio Inokashira Line', '京王井之头线'], ['Tokyu Oimachi Line', '东急大井町线'],
      ['Tokyo Sakura Tram', '东京樱花有轨电车'], ['Toden Arakawa Line', '都电荒川线'],
      ['around late June', '6月下旬左右'],
      ['mid-June', '6月中旬'],
      ['early June', '6月上旬'],
      ['January', '1月'], ['February', '2月'], ['March', '3月'], ['April', '4月'],
      ['May', '5月'], ['June', '6月'], ['July', '7月'], ['August', '8月'],
      ['September', '9月'], ['October', '10月'], ['November', '11月'], ['December', '12月'],
      ['Fridays / Saturdays', '周五／周六'],
      ['Fridays', '周五'], ['Saturdays', '周六'], ['Thursdays', '周四'],
      ['Wednesdays', '周三'], ['Tuesdays', '周二'], ['Mondays', '周一'], ['Sundays', '周日'],
      ['weekend', '周末'],
      ['Tokyo Metro Ginza / Hibiya Lines', '东京地铁银座线／日比谷线'],
      ['Tokyo Metro Marunouchi / Namboku Lines', '东京地铁丸之内线／南北线'],
      ['Tokyo Metro', '东京地铁'],
      ['Namboku Line', '南北线'], ['Marunouchi Line', '丸之内线'], ['Hibiya Line', '日比谷线'],
      ['Ginza Line', '银座线'], ['Chiyoda Line', '千代田线'], ['Hanzomon Line', '半藏门线'],
      ['Toei Oedo Line', '都营大江户线'], ['Toei', '都营'], ['Keisei Line', '京成线'],
      ['Keio Line', '京王线'], ['Odakyu Line', '小田急线'], ['JR Line', 'JR线'],
      ['Station', '站'], ['Park Exit', '公园口'], ['South Exit', '南口'], ['North Exit', '北口'],
      ['East Exit', '东口'], ['West Exit', '西口'], ['Exit', '号出口'], ['walk approx.', '步行约'],
      ['walk', '步行'], ['min', '分钟'], ['get off at', '下车'], ['bus', '巴士'],
      ['directly connected', '直达'], ['via', '经由'], ['or', '或'], ['from', '从'],
      ['Keisei-Ueno', '京成上野'], ['Ueno', '上野'], ['Yokohama', '横滨'],
      ['on', '在'], ['are', '是'], ['the', '该'], ['and', '和'], ['for', '供'], ['of', '的'],
      ['to', '至'], ['until', '之前'], ['during', '期间'], ['when', '在'], ['held', '举办'],
      ['only', '仅'], ['required', '需要'], ['available', '可用'], ['can be used', '可以使用'],
      ['people', '人'], ['some', '部分'], ['each', '每个'], ['museum', '博物馆'], ['garden', '庭园'],
      ['exhibition', '展览'], ['collection', '馆藏'], ['details', '详情'], ['information', '信息'],
      ['official', '官方'], ['website', '网站'], ['latest', '最新'], ['other', '其他'],
      ['Jan', '1月'], ['Feb', '2月'], ['Mar', '3月'], ['Apr', '4月'], ['May', '5月'], ['Jun', '6月'],
      ['Jul', '7月'], ['Aug', '8月'], ['Sep', '9月'], ['Oct', '10月'], ['Nov', '11月'], ['Dec', '12月'],
      [' / ', '／'], [', ', '、']
    ]);
    return text
      .replace(/temporarily\s*closed/gi, '临时闭馆')
      .replace(/proof\s+(?:需要\s+)?at\s+入场/gi, '入场时需出示证明')
      .replace(/官方网站\s+请查看[。.]?/g, '官方网站')
      .replace(/高中生及及以下/g, '高中生及以下')
      .replace(/免费\s+供/g, '免费')
      .replace(/及以上\s+是/g, '及以上')
      .replace(/([一-龥])\s+站/g, '$1站')
      .replace(/、\s*等/g, '等')
      .replace(/"\s+/g, '"')
      .replace(/\s*;\s*/g, '；')
      .replace(/\s*,\s*/g, '、')
      .replace(/\.\s*/g, '。')
      .replace(/：\s+/g, '：')
      .replace(/期间\s+注：/g, '期间；注：')
      .replace(/"(下车|步行)/g, '" $1')
      .replace(/开放\s+在\s+法定节假日/g, '法定节假日开放')
      .replace(/开放\s+在/g, '在')
      .replace(/follows\s+横滨SOGO商店\s+闭馆日/gi, '按横滨SOGO商店闭店日安排')
      .replace(/该\s+(\d+)(st|nd|rd|th)\s+/gi, '第$1个')
      .replace(/\s+(等|期间等)/g, '$1')
      .replace(/([0-9]+月)\s+/g, '$1')
      .replace(/\s*–\s*/g, '–')
      .replace(/\s+/g, ' ')
      .replace(/([0-9])\s*分钟/g, '$1分钟')
      .trim();
  }

  function translateChineseClosed(value) {
    return translateChineseCommon(translateEnglishClosed(value))
      .replace(/the ([0-9]+)(st|nd|rd|th) (周一|周二|周三|周四|周五|周六|周日)/g, '每月$1日（$3）')
      .replace(/the next weekday after holidays/g, '节假日后的下一个工作日')
      .replace(/\s*\(\s*/g, '（').replace(/\s*\)\s*/g, '）')
      .replace(/、\s*等/g, '等')
      .replace(/\s*–\s*/g, '–')
      .trim();
  }

  function translateChineseFee(value) {
    return translateChineseCommon(translateEnglishFee(value))
      .replace(/([0-9][0-9,]*) off/g, '优惠$1日元')
      .replace(/([0-9][0-9,]*)% off/g, '优惠$1%')
      .replace(/¥\s*优惠\s*([0-9][0-9,]*)日元/g, '优惠$1日元')
      .replace(/([0-9][0-9,]*)日元\s*优惠/g, '优惠$1日元')
      .replace(/half price/g, '半价')
      .replace(/\s*\/\s*/g, '／')
      .replace(/\s*:\s*/g, '：')
      .replace(/\s*\(\s*/g, '（').replace(/\s*\)\s*/g, '）')
      .replace(/\s+/g, ' ').trim();
  }

  function translateChineseAccess(value) {
    return translateChineseCommon(translateEnglishAccess(value))
      .replace(/\s*\/\s*/g, '／')
      .replace(/\s*;\s*/g, '；')
      .replace(/\s+/g, ' ').trim();
  }

  function translateChineseHours(value) {
    return translateChineseCommon(translateEnglishHours(value))
      .replace(/\s*–\s*/g, '–')
      .replace(/\s+/g, ' ').trim();
  }

  function translateChineseSourceFragments(value) {
    return replaceJapaneseText(value, [
      ['ぐるっとパス', 'Grutto Pass'], ['東西めぐりん', '东西环线巴士'], ['北めぐりん', '北线环线巴士'],
      ['旧東京音楽学校奏楽堂', '旧东京音乐学校奏乐堂'], ['東京音楽学校奏楽堂', '东京音乐学校奏乐堂'],
      ['コミュニティバス', '社区巴士'], ['コンコース', '站厅'], ['エスカレーター', '扶梯'],
      ['スカイツリー前', '晴空塔前'], ['とうきょうスカイツリー', '东京晴空塔'], ['ハチ公口', '八公口'],
      ['かみのげ', 'Kaminoge'], ['つつじヶ丘', 'Tsutsujigaoka'], ['はるかぜ', 'Harukaze'],
      ['メンテナンス', '维护'], ['オンライン', '在线'], ['アート', '艺术'], ['ミュージアム', '博物馆'],
      ['一般料金', '普通票价'], ['一般当日料金', '成人当日票价'], ['一般', '成人'], ['料金', '费用'],
      ['円', '日元'], ['展覧会', '展览'], ['特別展', '特别展览'], ['企画展', '特别展览'],
      ['常設展示', '常设展'], ['常設展', '常设展'], ['収蔵品展', '馆藏展'], ['館蔵品展', '馆藏展'],
      ['所蔵作品展', '馆藏作品展'], ['コレクション展', '馆藏展'], ['割引', '折扣'],
      ['入場', '入场'], ['入館', '入场'], ['入園', '入园'], ['観覧', '参观'],
      ['できます', '可以'], ['ご利用', '使用'], ['利用', '使用'], ['詳細はHP', '详情请查看官方网站'],
      ['公式ウェブサイト', '官方网站'], ['公式サイト', '官方网站'], ['HP', '官方网站'],
      ['最新情報', '最新信息'], ['最新の情報', '最新信息'], ['展覧会により', '因展览而'],
      ['展示により', '因展览而'], ['により異なります', '因情况而异'], ['異なります', '不同'],
      ['あります', '有'], ['場合があります', '可能'], ['場合', '情况'], ['無料', '免费'],
      ['要証明書', '需出示证明'], ['要証明', '需出示证明'], ['要保護者同伴', '需由监护人陪同'],
      ['事前日時予約制', '需提前预约时段'], ['予約不要', '无需预约'], ['予約', '预约'],
      ['臨時休館', '临时闭馆'], ['休館日', '闭馆日'], ['休館', '闭馆'], ['開館', '开放'],
      ['土・日・祝日', '周末及法定节假日'], ['土・日・祝', '周末及法定节假日'], ['土日祝', '周末及法定节假日'],
      ['土日', '周末'], ['平日', '工作日'], ['年末年始', '年末年初'], ['展示替期間', '换展期间'],
      ['展示替', '换展'], ['保守点検', '维护检查'], ['設備点検', '设备维护'], ['整備休館', '维护闭馆'],
      ['夏期休業期間', '夏季休馆期间'], ['冬期休館期間', '冬季闭馆期间'], ['夏期', '夏季'], ['冬期', '冬季'],
      ['月曜日', '周一'], ['火曜日', '周二'], ['水曜日', '周三'], ['木曜日', '周四'],
      ['金曜日', '周五'], ['土曜日', '周六'], ['日曜日', '周日'], ['祝休日', '法定节假日'],
      ['祝日', '法定节假日'], ['大人', '成人'],
      ['大学生', '大学生'], ['高校生', '高中生'], ['中学生', '初中生'], ['小学生', '小学生'],
      ['未就学児', '学龄前儿童'], ['幼児', '幼儿'], ['学生', '学生'], ['こども', '儿童'],
      ['の', '的'], ['は', ''], ['と', '和'], ['に', ''], ['で', ''], ['が', ''], ['を', ''],
      ['です', '。'], ['ます', ''], ['等', '等']
    ]).replace(/\s+/g, ' ').trim();
  }

  function localizedCoreFallback(field) {
    const en = {
      closed: 'Closure details are available on the official site.',
      fee: 'Fee details are available on the official site.',
      access: 'Access details are available on the official site.',
      hours: 'Opening hours are available on the official site.',
      notes: 'Additional notes are available on the official site.',
      pass_notes: 'Pass benefit details are available on the official site.',
      benefit_basis: 'Pass benefit details are available on the official site.',
      admission_label: 'Admission details are available on the official site.',
      tel: 'Phone details are available on the official site.'
    };
    const zh = {
      closed: '闭馆安排请查看官方网站。',
      fee: '费用详情请查看官方网站。',
      access: '交通详情请查看官方网站。',
      hours: '开放时间请查看官方网站。',
      notes: '其他注意事项请查看官方网站。',
      pass_notes: '通票适用范围请查看官方网站。',
      benefit_basis: '通票优惠详情请查看官方网站。',
      admission_label: '入场详情请查看官方网站。',
      tel: '电话详情请查看官方网站。'
    };
    return (currentLanguage === 'zh' ? zh : en)[field] || (currentLanguage === 'zh' ? '详情请查看官方网站。' : 'See the official site for details.');
  }

  function sanitizeCoreTranslation(field, value) {
    const values = Array.isArray(value) ? value : [value];
    const sanitized = values.map(entry => {
      const text = String(entry == null ? '' : entry);
      const hasUntranslatedScript = hasJapaneseScript(text)
        || (currentLanguage === 'en' && hasUntranslatedHan(text))
        || (currentLanguage === 'zh' && hasUntranslatedChineseLatin(text));
      return hasUntranslatedScript ? localizedCoreFallback(field) : text;
    });
    return Array.isArray(value) ? sanitized : sanitized[0];
  }

  function translateTelephoneValue(value, language) {
    const replacements = language === 'zh'
      ? [['ハローダイヤル', '咨询热线'], ['フリーダイヤル', '免费电话']]
      : [['ハローダイヤル', 'Hello Dial'], ['フリーダイヤル', 'Toll-free']];
    const values = Array.isArray(value) ? value : [value];
    const translated = values.map(entry => {
      const text = replaceJapaneseText(entry, replacements);
      return language === 'zh'
        ? text.replace(/\s*\(([^()]*)\)/g, '（$1）')
        : text;
    });
    return Array.isArray(value) ? translated : translated[0];
  }

  function translateEnglishCoreValue(facility, field, value) {
    if (currentLanguage !== 'en' || value == null) return value;
    if (field === 'name') return englishFacilityName(facility, value);
    if (field === 'tel') return sanitizeCoreTranslation(field, translateTelephoneValue(value, 'en'));
    if (field === 'schedule_lines') return value;
    const values = Array.isArray(value) ? value : [value];
    const translated = values.map(entry => {
      if (field === 'access') return translateEnglishAccess(entry);
      if (field === 'hours') return translateEnglishHours(entry);
      if (field === 'fee' || field === 'benefit_basis' || field === 'admission_label') return translateEnglishFee(entry);
      return translateEnglishClosed(entry);
    });
    return sanitizeCoreTranslation(field, Array.isArray(value) ? translated : translated[0]);
  }

  function translateChineseCoreValue(facility, field, value) {
    if (currentLanguage !== 'zh' || value == null) return value;
    if (field === 'name') return chineseFacilityName(facility, value);
    if (field === 'tel') return sanitizeCoreTranslation(field, translateTelephoneValue(value, 'zh'));
    if (field === 'schedule_lines') return value;
    const values = Array.isArray(value) ? value : [value];
    const translated = values.map(entry => {
      if (field === 'access') return translateChineseAccess(entry);
      if (field === 'hours') return translateChineseHours(entry);
      if (field === 'fee' || field === 'benefit_basis' || field === 'admission_label') return translateChineseFee(entry);
      return translateChineseClosed(entry);
    });
    const localized = Array.isArray(value) ? translated : translated[0];
    const sanitized = Array.isArray(localized)
      ? localized.map(entry => translateChineseSourceFragments(entry))
      : translateChineseSourceFragments(localized);
    return sanitizeCoreTranslation(field, sanitized);
  }

  function tField(facility, field, fallback) {
    const overlay = facilityOverlay(facility);
    if (Object.prototype.hasOwnProperty.call(overlay, field)) return overlay[field];
    const value = fallback !== undefined ? fallback : facility?.[field];
    if (currentLanguage === 'en' && (field === 'name' || ENGLISH_CORE_FIELDS.has(field) || field === 'schedule_lines'))
      return translateEnglishCoreValue(facility, field, value);
    if (currentLanguage === 'zh' && (field === 'name' || ENGLISH_CORE_FIELDS.has(field) || field === 'schedule_lines'))
      return translateChineseCoreValue(facility, field, value);
    return value;
  }

  // One source of truth for presenting a facility name across the List card,
  // the Facility Drawer, and the desktop Map Detail panel. The localized name
  // leads; the Japanese official name follows only where it adds information.
  const JAPANESE_SECONDARY_NAME_TRIGGER_RE = /[\u3040-\u30ffA-Za-z]/;

  function getFacilityTitlePresentation(facility) {
    const language = currentLanguage;
    const japaneseName = String(facility?.name || '').trim();
    const localizedName = String(tField(facility, 'name', japaneseName) || '').trim();
    const primaryName = localizedName || japaneseName;

    if (language === 'ja') return { primaryName, secondaryName: '', secondaryLang: '' };
    if (!japaneseName || !localizedName || localizedName === japaneseName) {
      return { primaryName, secondaryName: '', secondaryLang: '' };
    }

    // English always keeps the Japanese official name as the secondary line.
    if (language === 'en') {
      return { primaryName, secondaryName: japaneseName, secondaryLang: 'ja' };
    }

    // Chinese repeats the Japanese name only when it carries non-Han
    // identifying information (kana or Latin), or when a reviewed overlay
    // opts in via showJapaneseName. A Han-only Japanese name is usually a
    // one-to-one script mapping of the Chinese translation and reads as a
    // duplicate, so it stays hidden by default.
    const overlay = facilityOverlay(facility);
    const show = typeof overlay?.showJapaneseName === 'boolean'
      ? overlay.showJapaneseName
      : JAPANESE_SECONDARY_NAME_TRIGGER_RE.test(japaneseName);
    return { primaryName, secondaryName: show ? japaneseName : '', secondaryLang: show ? 'ja' : '' };
  }

  function getLocalizedAreaName(area) {
    return overlayForLanguage().areas?.[area?.name] || area?.name || '';
  }

  function getEnrichedTranslation(facility, item) {
    return overlayForLanguage().exhibitions?.[contentKey(facility, item)] || {};
  }

  function hasUsableEnrichedTitleTranslation(facility, item) {
    if (currentLanguage === 'ja') return true;
    const translatedTitle = String(getEnrichedTranslation(facility, item).title || '').trim();
    const sourceTitle = String(item?.title || '').trim();
    return Boolean(translatedTitle && translatedTitle !== sourceTitle);
  }

  function isJapaneseOnlyExhibition(facility, item) {
    return currentLanguage !== 'ja' && !hasUsableEnrichedTitleTranslation(facility, item);
  }

  function getLocalizedEnrichedField(facility, item, field, fallback) {
    const translation = getEnrichedTranslation(facility, item);
    if (['title', 'summary', 'notice'].includes(field) && String(translation[field] || '').trim()) return translation[field];
    if (translation.fields && Object.prototype.hasOwnProperty.call(translation.fields, field)) return translation.fields[field];
    if (currentLanguage === 'en' && field === 'fee') return sanitizeCoreTranslation('fee', translateEnglishFee(fallback));
    if (currentLanguage === 'en' && field === 'hours') return sanitizeCoreTranslation('hours', translateEnglishHours(fallback));
    if (currentLanguage === 'zh' && field === 'fee') return sanitizeCoreTranslation('fee', translateChineseSourceFragments(translateChineseFee(fallback)));
    if (currentLanguage === 'zh' && field === 'hours') return sanitizeCoreTranslation('hours', translateChineseSourceFragments(translateChineseHours(fallback)));
    return fallback;
  }

  function passBasisKey(facility) {
    const source = `${facility?.benefit_basis || ''} ${facility?.admission_label || ''}`;
    const isAdult = /一般|大人/.test(source);
    const isPermanent = /常設|コレクション|所蔵|収蔵|館蔵/.test(source);
    const isSpecial = /企画展|特別展|対象展/.test(source);
    const hasProgram = /プラネタリウム|大型映像/.test(source);
    const hasRegularHours = /通常時間内/.test(source);
    if (hasProgram && isPermanent && isSpecial) return 'pass.basis.permanentSpecialProgram';
    if (hasProgram) return 'pass.basis.program';
    if (isPermanent && isSpecial) return 'pass.basis.permanentAndSpecial';
    if (isPermanent && isAdult) return 'pass.basis.permanentAdult';
    if (isSpecial && isAdult) return 'pass.basis.specialAdult';
    if (isAdult) return 'pass.basis.regularAdult';
    if (isPermanent) return 'pass.basis.permanent';
    if (isSpecial) return 'pass.basis.special';
    if (hasRegularHours) return 'pass.basis.regularHours';
    return 'pass.basis.eligible';
  }

  /* ---------------------------------------------------------------------
     Pass presentation model (Phase 3)

     Three layers that must never stand in for each other:

       1. Official entitlement  — what the Pass actually grants, in the
          brochure's own words. Authoritative on the Facility Detail.
       2. Product interpretation — the structured scope/action reading of
          that wording. Drives the concise Browse summary and the EN/ZH
          translation. It may simplify, never strengthen: a benefit whose
          source says 「展覧会に入場」 stays that broad even though its
          structured scope is narrower.
       3. Derived reference value — a comparable yen figure produced for
          sorting and break-even estimation. Always visually secondary,
          always named with the scope it was derived from.
     --------------------------------------------------------------------- */

  // whole_facility_admission and unknown deliberately have no label: naming a
  // scope there would tell the reader the benefit is narrower than it is.
  const PASS_SCOPE_KEYS = {
    permanent_collection: 'pass.scope.permanentCollection',
    temporary_exhibition: 'pass.scope.temporaryExhibition',
    special_exhibition: 'pass.scope.specialExhibition',
    collection: 'pass.scope.collection',
    garden: 'pass.scope.garden',
    named_exhibition: 'pass.scope.namedExhibition'
  };

  const PASS_CLAUSE_KEYS = {
    '入場': 'pass.clause.admission',
    '割引': 'pass.clause.discount'
  };

  // The brochure separates a clause from its terms with '‥'. Rendering that
  // as a colon is punctuation, not rewording — the wording itself is verbatim.
  function passOfficialWording(value) {
    return String(value == null ? '' : value).replace(/‥+/g, '：').trim();
  }

  function passNamedExhibitionTitle(benefit) {
    const match = /『[^』]+』/.exec(benefit?.official_wording?.ja || '');
    return match ? match[0] : '';
  }

  function passScopeJoin(labels, language) {
    const separator = language === 'ja' ? '・' : language === 'zh' ? '、' : ' / ';
    return [...new Set(labels.filter(Boolean))].join(separator);
  }

  /* Japanese prefers a label that literally appears in the source, so the
     product never shows a scope the brochure did not write. */
  function passScopeLabelFor(benefit, scopes, language) {
    const list = Array.isArray(scopes) ? scopes : [];
    if (language === 'ja') {
      const literal = String(benefit?.interprets_ja || '')
        .replace(/(入場|入館|入園|観覧)$/, '')
        .trim();
      if (literal && list.length <= 1) return literal;
      const named = passNamedExhibitionTitle(benefit);
      if (named && list.length === 1 && list[0] === 'named_exhibition') return named;
    }
    return passScopeJoin(list.map(scope => (PASS_SCOPE_KEYS[scope] ? uiText(PASS_SCOPE_KEYS[scope]) : '')), language);
  }

  function passActionLabel(benefit) {
    const type = benefit?.type;
    if (type === 'admission') return uiText('pass.action.admission');
    if (type === 'discount_to_group_rate') return uiText('pass.action.discountGroupRate');
    if (type === 'discount_percent') {
      const rate = Number(benefit?.discount_rate);
      // A percentage stays a percentage. Turning it into yen at facility level
      // would invent a price the source never fixed.
      return Number.isFinite(rate) && rate > 0
        ? uiText('pass.action.discountPercent', { rate: formatUiNumber(Math.round(rate * 100)) })
        : uiText('pass.action.discountUnspecified');
    }
    if (type === 'discount_fixed') {
      const saving = Number(benefit?.saving_yen);
      return Number.isFinite(saving)
        ? uiText('pass.action.discountFixed', { amount: formatUiNumber(saving) })
        : uiText('pass.action.discountUnspecified');
    }
    return uiText('pass.action.discountUnspecified');
  }

  /* Benefits that share a clause and an action read as one phrase, in the
     order their scopes appear in the official wording. */
  function passGroupBenefits(benefits) {
    const groups = new Map();
    benefits.forEach((benefit, index) => {
      const signature = `${benefit.clause_index}|${passActionLabel(benefit)}`;
      if (!groups.has(signature)) groups.set(signature, []);
      groups.get(signature).push({ benefit, index });
    });
    return [...groups.values()];
  }

  function passPhraseForGroup(group, language) {
    const wording = group[0].benefit?.official_wording?.ja || '';
    const labels = group
      .map(entry => ({
        label: passScopeLabelFor(entry.benefit, entry.benefit.scopes, language),
        // Ordered by where each scope appears in the official Japanese
        // wording, so every language lists them the way the source does.
        order: entry.benefit.scopes
          .map(scope => passScopeLabelFor(entry.benefit, [scope], 'ja'))
          .reduce((best, label) => {
            const at = label ? wording.indexOf(label) : -1;
            return at >= 0 && (best < 0 || at < best) ? at : best;
          }, -1)
      }))
      .sort((a, b) => (a.order < 0 ? Number.MAX_SAFE_INTEGER : a.order) - (b.order < 0 ? Number.MAX_SAFE_INTEGER : b.order));
    const scope = passScopeJoin(labels.map(entry => entry.label), language);
    const action = passActionLabel(group[0].benefit);
    if (scope) return uiText('pass.phrase', { scope, action });
    // Without a scope, '入場' alone is thinner than the benefit really is —
    // an unscoped admission clause means the whole facility is covered.
    return group[0].benefit?.type === 'admission' ? uiText('pass.freeWith') : action;
  }

  function passReferenceBasisText(benefit, basisScope, language) {
    const scope = passScopeLabelFor(benefit, basisScope ? [basisScope] : [], language);
    return uiText('pass.referenceBasis', {
      basis: scope
        ? uiText('pass.referenceBasisScoped', { scope })
        : uiText('pass.referenceBasisGeneral')
    });
  }

  /* Builds every Pass surface from one model. `entitlements` is the shape
     returned by getFacilityEntitlements(); `comparable` the shape returned by
     getFacilityComparableValue(). Both may be null — a facility with no scoped
     record still gets a usable summary from its pass_types. */
  function getPassPresentation(facility, input) {
    const options = input || {};
    const language = currentLanguage;
    const entitlements = options.entitlements || null;
    const comparable = options.comparable || null;
    const types = Array.isArray(options.passTypes) ? options.passTypes : [];
    const supporting = uiText(passBasisKey(facility));
    const benefits = Array.isArray(entitlements?.benefits) ? entitlements.benefits : [];
    const clauses = Array.isArray(entitlements?.official_clauses) ? entitlements.official_clauses : [];

    const groups = passGroupBenefits(benefits);
    const phrases = groups.map(group => passPhraseForGroup(group, language)).filter(Boolean);
    if (!phrases.length) {
      phrases.push(types.includes('admission')
        ? uiText('pass.action.admission')
        : types.includes('discount')
          ? uiText('pass.action.discountUnspecified')
          : uiText('pass.eligibleWith'));
    }

    // The reference value is withheld when the amount is already the official
    // entitlement — a source-stated "¥300 off" must not be repeated as a
    // separate derived line.
    const basis = comparable?.value_basis || null;
    const basisBenefit = basis && Number.isInteger(basis.benefit_index)
      ? benefits[basis.benefit_index] || null
      : null;
    // null means "this benefit has no fixed yen value" — coercing it to 0
    // would present an unknown as a worthless benefit.
    const rawAmount = comparable ? comparable.value_yen : null;
    const amount = Number(rawAmount);
    const hasAmount = rawAmount !== null && rawAmount !== undefined && Number.isFinite(amount);
    const statedInEntitlement = Boolean(basisBenefit
      && basisBenefit.type === 'discount_fixed'
      && Number.isFinite(Number(basisBenefit.saving_yen))
      && basisBenefit.saving_yen !== null
      && Number(basisBenefit.saving_yen) === amount);
    const verified = comparable?.source === 'scoped' && hasAmount && Boolean(basis);

    const reference = verified && !statedInEntitlement
      ? {
        label: uiText('pass.referenceValue'),
        amount: formatUiYen(amount),
        basis: passReferenceBasisText(basisBenefit, basis.scope, language),
        confidence: 'verified'
      }
      : null;

    // A legacy fallback amount is an estimate from unverified parsing. It stays
    // available to sorting and My Pass, but must never look as trustworthy as a
    // verified scoped reference value.
    const estimate = !verified && comparable?.source === 'legacy' && hasAmount
      ? { text: uiText('pass.referenceEstimate', { amount: formatUiYen(amount) }), confidence: 'estimated' }
      : null;

    return {
      phrases,
      headline: phrases[0],
      alternates: phrases.slice(1),
      value: reference
        ? { text: uiText('pass.referenceShort', { amount: reference.amount }), confidence: 'verified' }
        : estimate,
      clauses: clauses.map((clause, index) => {
        const own = groups.filter(group => group[0].benefit.clause_index === index);
        return {
          label: PASS_CLAUSE_KEYS[clause.label_ja] ? uiText(PASS_CLAUSE_KEYS[clause.label_ja]) : clause.label_ja,
          official: passOfficialWording(clause.wording_ja),
          // Japanese reads the source directly; repeating a paraphrase under it
          // would say the same thing twice.
          translated: language === 'ja'
            ? ''
            : [...new Set(own.map(group => passPhraseForGroup(group, language)).filter(Boolean))].join('; ')
        };
      }),
      reference,
      // Source-backed use conditions that live outside the verbatim clause, kept
      // as verbatim source text so the Detail never loses them.
      notes: Array.isArray(entitlements?.notes_ja) ? entitlements.notes_ja : [],
      supporting
    };
  }

  function formatUiYen(value) {
    return `¥${formatUiNumber(Math.max(0, Math.round(Number(value) || 0)))}`;
  }

  const SEARCHABLE_FACILITY_FIELDS = [
    'no', 'name', 'admission_label', 'schedule_lines', 'closed', 'fee',
    'access', 'notes', 'pass_notes', 'benefit_basis', 'urls',
    'exhibition_sources', 'data_source'
  ];

  function normalizeSearchQuery(value) {
    return String(value == null ? '' : value)
      .normalize('NFKC')
      .toLowerCase()
      .replace(/[‐‑‒–—―ー]/g, '-')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function searchTextMatches(searchText, query) {
    const normalizedText = normalizeSearchQuery(searchText);
    const normalizedQuery = normalizeSearchQuery(query);
    if (!normalizedQuery) return true;
    if (normalizedText.includes(normalizedQuery)) return true;
    return normalizedQuery.split(' ').filter(Boolean).every(token => normalizedText.includes(token));
  }

  function getSearchableFacilityText(facility) {
    const values = [];
    const aliasSourceValues = [];
    const add = value => {
      if (Array.isArray(value)) value.forEach(add);
      else if (typeof value === 'string' || typeof value === 'number') values.push(String(value));
    };
    const addAliasSource = value => {
      if (Array.isArray(value)) value.forEach(addAliasSource);
      else if (typeof value === 'string' || typeof value === 'number') aliasSourceValues.push(String(value));
    };
    const addFields = (source, includeAccess = true) => {
      if (!source || typeof source !== 'object') return;
      SEARCHABLE_FACILITY_FIELDS.forEach(field => {
        if (!includeAccess && field === 'access') return;
        add(source[field]);
        if (['name', 'admission_label', 'schedule_lines'].includes(field)) addAliasSource(source[field]);
      });
    };

    addFields(facility);
    const allOverlays = root.FACILITY_I18N || {};
    const facilityKey = facility?._key || facility?.no;
    add(root.FACILITY_BROCHURE?.cards?.[facilityKey]?.nameEn);
    // The display layer can derive a reviewed English or Chinese name from
    // brochure/alias metadata even when no sparse overlay record exists.
    // Keep those visible names searchable as well; otherwise a user can copy
    // the name they see in a localized card and get an empty result.
    add(englishFacilityName(facility, facility?.name));
    add(chineseFacilityName(facility, facility?.name));
    // Localized access is display content, not a facility location alias. Do
    // not let a route such as the Yokohama Line make a nearby facility match
    // a city query; canonical location aliases remain in search-aliases.js.
    SUPPORTED_LANGS.forEach(language => addFields(allOverlays[language]?.facilities?.[facilityKey], false));

    (facility?.enriched || []).forEach(item => {
      add(item?.url);
      add(item?.title);
      add(Object.values(item?.fields || {}));
      addAliasSource(item?.title);
      SUPPORTED_LANGS.forEach(language => {
        const translation = allOverlays[language]?.exhibitions?.[contentKey(facility, item)] || {};
        add(translation.title);
        add(translation.summary);
        add(translation.notice);
        add(Object.values(translation.fields || {}));
        addAliasSource(translation.title);
      });
    });
    const config = root.SEARCH_INDEX_CONFIG || {};
    // Do not derive English/Chinese location aliases from access text or the
    // aggregate area label. A route such as the Yokohama Line, or an area
    // named "Kanagawa / Chiba / Saitama", should not make unrelated cards
    // appear for a city query. Proper location aliases belong in the
    // per-facility data below.
    const searchableSource = normalizeSearchQuery(aliasSourceValues.join(' '));
    (config.tokenAliases || []).forEach(rule => {
      const tokens = Array.isArray(rule.tokens) ? rule.tokens : [rule.token];
      if (tokens.some(token => searchableSource.includes(normalizeSearchQuery(token)))) add(rule.aliases);
    });
    add(config.facilityAliases?.[facilityKey]);
    return values;
  }

  function formatUiNumber(value) {
    const locale = currentLanguage === 'en' ? 'en-US' : currentLanguage === 'zh' ? 'zh-CN' : 'ja-JP';
    return Number(value).toLocaleString(locale);
  }

  function parseUiDate(value) {
    const raw = String(value || '');
    const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return { raw, date: null };
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return { raw, date: null };
    return { raw, date };
  }

  function formatUiDate(value) {
    const parsed = parseUiDate(value);
    if (!parsed.date) return parsed.raw;
    try {
      const locale = currentLanguage === 'en' ? 'en-US' : currentLanguage === 'zh' ? 'zh-CN' : 'ja-JP';
      const options = currentLanguage === 'en'
        ? { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }
        : { year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'UTC' };
      const formatter = new Intl.DateTimeFormat(locale, options);
      if (currentLanguage === 'en') return formatter.format(parsed.date);
      const parts = Object.fromEntries(formatter.formatToParts(parsed.date).map(part => [part.type, part.value]));
      if (parts.year && parts.month && parts.day) return `${parts.year}年${parts.month}月${parts.day}日`;
      return formatter.format(parsed.date);
    } catch {
      return parsed.raw;
    }
  }

  // The mobile date+time condition needs the shortest locale-correct form, and
  // only shows the year when the target leaves the current Tokyo year.
  function formatUiCompactDate(value, options) {
    const parsed = parseUiDate(value);
    if (!parsed.date) return parsed.raw;
    try {
      const locale = currentLanguage === 'en' ? 'en-US' : currentLanguage === 'zh' ? 'zh-CN' : 'ja-JP';
      const format = {
        month: currentLanguage === 'en' ? 'short' : 'numeric',
        day: 'numeric',
        timeZone: 'UTC'
      };
      if (options && options.withYear) format.year = 'numeric';
      return new Intl.DateTimeFormat(locale, format).format(parsed.date);
    } catch {
      return parsed.raw;
    }
  }

  function formatUiShortDate(value) {
    const parsed = parseUiDate(value);
    if (!parsed.date) return parsed.raw;
    try {
      const locale = currentLanguage === 'en' ? 'en-US' : currentLanguage === 'zh' ? 'zh-CN' : 'ja-JP';
      const options = currentLanguage === 'en'
        ? { month: 'short', day: 'numeric', timeZone: 'UTC' }
        : { month: 'numeric', day: 'numeric', timeZone: 'UTC' };
      const formatter = new Intl.DateTimeFormat(locale, options);
      if (currentLanguage === 'en') return formatter.format(parsed.date);
      const parts = Object.fromEntries(formatter.formatToParts(parsed.date).map(part => [part.type, part.value]));
      if (parts.month && parts.day) return `${parts.month}月${parts.day}日`;
      return formatter.format(parsed.date);
    } catch {
      return parsed.raw;
    }
  }

  function localizeStatusNotices(value) {
    const noticeKeys = {
      '展示替え': 'status.notice.exhibitionChangeover',
      '臨時休館': 'status.notice.temporaryClosure',
      '設備点検': 'status.notice.maintenance',
      '保守点検': 'status.notice.inspection',
      '季節休館': 'status.notice.seasonalClosure'
    };
    return String(value || '')
      .split('/')
      .map(notice => uiText(noticeKeys[notice.trim()] || notice.trim()))
      .join(' / ');
  }

  function localizeStatusRaw(value) {
    if (currentLanguage === 'ja') return value;
    return String(value || '')
      .replace(/^・\s*/, '')
      .replace(/・/g, currentLanguage === 'en' ? ' / ' : '、')
      .replace(/~/g, '–');
  }

  function splitStatusHours(value) {
    const text = String(value || '');
    const match = /^(.*?)(\s*[（(]\s*\d{1,2}:\d{2}\s*[–-]\s*\d{1,2}:\d{2}\s*[）)])$/.exec(text);
    return match
      ? { main: match[1].trimEnd(), hours: match[2] }
      : { main: text, hours: '' };
  }

  function localizeStatusResult(result) {
    if (!result) return result;
    const reasonParams = { ...(result.reasonParams || {}) };
    if (reasonParams.notices) reasonParams.notices = localizeStatusNotices(reasonParams.notices);
    if (reasonParams.raw) reasonParams.raw = localizeStatusRaw(reasonParams.raw);
    if (reasonParams.day) {
      const dayNames = {
        en: { '日': 'Sunday', '月': 'Monday', '火': 'Tuesday', '水': 'Wednesday', '木': 'Thursday', '金': 'Friday', '土': 'Saturday' },
        zh: { '日': '日', '月': '一', '火': '二', '水': '三', '木': '四', '金': '五', '土': '六' }
      };
      reasonParams.day = dayNames[currentLanguage]?.[reasonParams.day] || reasonParams.day;
    }
    const reason = uiText(result.reasonKey, reasonParams, result.reason);
    const reasonParts = splitStatusHours(reason);
    return {
      ...result,
      text: uiText(result.textKey, result.textParams, result.text),
      reason,
      reasonMain: reasonParts.main,
      reasonHours: reasonParts.hours
    };
  }

  /*
   * A closing time that only applies on certain days must say so, or the reader
   * generalizes it: No.71 closes at 17:30 on weekdays and 19:30 on Saturdays, and
   * the status line showed only "19:30". Built here, once, so no renderer
   * assembles this copy itself.
   */
  const VARIANT_DAY_NAMES = {
    ja: ['日', '月', '火', '水', '木', '金', '土'],
    en: ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'],
    zh: ['日', '一', '二', '三', '四', '五', '六']
  };

  function hoursVariantNote(variant) {
    if (!variant) return '';
    if (variant.kind === 'dow') {
      const names = VARIANT_DAY_NAMES[currentLanguage] || VARIANT_DAY_NAMES.ja;
      const day = names[Number(variant.dow)];
      return day ? uiText('status.hoursDowOnly', { day }) : '';
    }
    if (variant.kind === 'date') {
      // Short M/D: the status line is a single compact row in every locale.
      const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(variant.date || ''));
      if (!match) return '';
      return uiText('status.hoursDateOnly', { date: `${Number(match[2])}/${Number(match[3])}` });
    }
    return '';
  }

  function localizeNowState(result) {
    if (!result) return result;
    const noteParams = { ...(result.noteParams || {}) };
    if (noteParams.suffix === '（目安）') noteParams.suffix = uiText('status.estimatedSuffix');
    // Every other date on the page is locale-formatted; this one was raw ISO.
    if (/^\d{4}-\d{2}-\d{2}$/.test(noteParams.date || '')) noteParams.date = formatUiDate(noteParams.date);
    const note = uiText(result.noteKey, noteParams, result.note);
    const noteParts = splitStatusHours(note);
    return {
      ...result,
      text: uiText(result.textKey, result.textParams, result.text),
      note,
      noteMain: noteParts.main,
      noteHours: noteParts.hours,
      hoursVariantNote: hoursVariantNote(result.hoursVariant)
    };
  }

  function applyUiTranslations() {
    if (!root.document) return;
    root.document.documentElement.lang = currentLanguage;
    root.document.querySelectorAll('[data-i18n]').forEach(element => {
      element.textContent = uiText(element.dataset.i18n);
    });
    root.document.querySelectorAll('[data-i18n-html]').forEach(element => {
      element.innerHTML = uiText(element.dataset.i18nHtml);
    });
    root.document.querySelectorAll('[data-i18n-attr]').forEach(element => {
      String(element.dataset.i18nAttr || '').split(',').forEach(pair => {
        const [attribute, key] = pair.split(':');
        if (attribute && key) element.setAttribute(attribute.trim(), uiText(key.trim()));
      });
    });
    root.document.querySelectorAll('[data-lang]').forEach(button => {
      const active = button.dataset.lang === currentLanguage;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function setAppLanguage(language) {
    const next = normalizeLanguage(language);
    if (!SUPPORTED_LANGS.includes(next)) return;
    currentLanguage = next;
    try { root.localStorage?.setItem(LANG_STORAGE_KEY, next); } catch {}
    try {
      const url = new URL(root.location.href);
      url.searchParams.set(LANG_PARAM, next);
      root.history?.replaceState(null, '', url.href);
    } catch {}
    applyUiTranslations();
    root.document?.dispatchEvent(new CustomEvent('app-language-change', { detail: { language: next } }));
  }

  root.UI_STRINGS = UI_STRINGS;
  root.SUPPORTED_LANGS = SUPPORTED_LANGS;
  root.t = uiText;
  root.getAppLanguage = () => currentLanguage;
  root.setAppLanguage = setAppLanguage;
  root.applyUiTranslations = applyUiTranslations;
  root.tField = tField;
  root.getFacilityTitlePresentation = getFacilityTitlePresentation;
  root.getLocalizedAreaName = getLocalizedAreaName;
  root.getExhibitionLink = getExhibitionLink;
  root.getExhibitionDestination = getExhibitionDestination;
  root.getExhibitionLinkPresentation = getExhibitionLinkPresentation;
  root.classifyExhibitionUrl = classifyExhibitionUrl;
  root.comparableExhibitionUrl = comparableUrl;
  root.getEnrichedTranslation = getEnrichedTranslation;
  root.isJapaneseOnlyExhibition = isJapaneseOnlyExhibition;
  root.getLocalizedEnrichedField = getLocalizedEnrichedField;
  root.getPassPresentation = getPassPresentation;
  root.formatUiYen = formatUiYen;
  root.normalizeSearchQuery = normalizeSearchQuery;
  root.searchTextMatches = searchTextMatches;
  root.getSearchableFacilityText = getSearchableFacilityText;
  root.formatUiNumber = formatUiNumber;
  root.formatUiDate = formatUiDate;
  root.formatUiCompactDate = formatUiCompactDate;
  root.formatUiShortDate = formatUiShortDate;
  root.localizeStatusResult = localizeStatusResult;
  root.localizeNowState = localizeNowState;
  root.hoursVariantNote = hoursVariantNote;
  root.uiText = uiText;
})(window);
