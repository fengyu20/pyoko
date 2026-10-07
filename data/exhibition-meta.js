// 展覧会の有効期間・例外表現・最終確認先。
//
// 基本の会期は data/facilities.js の schedule_lines から推定する。
// 表記が大きく違う展示、同じ施設に複数会期がある展示、公式ブログで
// 料金表現を補正した展示だけをここで明示的に上書きする。
//
// 情報の役割は次の三層に分ける：
//   1. ぐるっとパス公式の施設・展覧会一覧 = 利用資格の基準
//   2. ぐるっとパス公式ブログ = おすすめ展示の発見
//   3. 各施設公式サイト = 会期・料金・予約・休館日の最終確認

const EXHIBITION_META = {
  "6::https://www.taitogeibun.net/sougakudou/oshirase/news/480/::日曜コンサート（チェンバロ／パイプオルガン）": {
    dateState: 'recurring', checkedAt: '2026-08-09',
    notice: '第1・第3日曜はチェンバロ、第2・第4日曜はパイプオルガン。第5日曜は実施なし。'
  },
  "14::https://sekido-museum.jp/::開館20周年記念展 石洞山人 美を尊ぶ心": {
    validFrom: '2026-09-01', validTo: '2026-12-20', checkedAt: '2026-07-30'
  },
  "15::https://moriogai-kinenkan.jp/modules/news/index.php?page=article&storyid=750::鷗外、雑誌をつくる。": {
    validFrom: '2026-07-05', validTo: '2026-09-30', checkedAt: '2026-07-30'
  },
  "15::https://moriogai-kinenkan.jp/modules/event/print.php?action=View&caldate=2026-11-15&cid=0&event_id=0000002534&smode=Daily::特別展「観潮楼歌会―鴎外の歌壇観測」": {
    validFrom: '2026-10-10', validTo: '2027-01-11', checkedAt: '2026-10-06'
  },
  "17::https://www.yamasa.com/musee/exhibitions/20260523-0802/index.html::浜口陽三と白倉嘉入展 満ちてくる光": {
    validFrom: '2026-05-23', validTo: '2026-08-02', checkedAt: '2026-07-30'
  },
  "19::https://www.nfaj.go.jp/exhibition/mizoguchi2026/::没後70年 映画監督 溝口健二": {
    validFrom: '2026-08-11', validTo: '2026-12-13', checkedAt: '2026-07-31'
  },
  "37::https://shoto-museum.jp/exhibitions/212takashima/::没後50年 髙島野十郎展": {
    validFrom: '2026-07-04', validTo: '2026-09-06', checkedAt: '2026-07-30'
  },
  "49::https://www.hasegawamachiko.jp/art-future/5670/::アニメサザエさん展 サザエさん家の七転び八笑い": {
    validFrom: '2026-07-18', validTo: '2026-09-06', checkedAt: '2026-07-30'
  },
  "49::https://www.hasegawamachiko.jp/category/memorial-future/::サザエさん生誕80年記念 町子の余暇": {
    validFrom: '2026-07-18', validTo: '2026-11-08', checkedAt: '2026-07-30'
  },
  "52::https://soseki-museum.jp/tenji/13633/::熊本時代の漱石の旅": {
    validFrom: '2026-07-16', validTo: '2026-10-04', checkedAt: '2026-07-30'
  },
  "61::https://kumagai-morikazu.jp/::コレクション・常設展示": {
    validFrom: '2026-07-21', validTo: '2027-03-31', checkedAt: '2026-09-19'
  },
  "68::https://toyo-bunko.or.jp/museum-exhibition/2631/::「怖い」本": {
    validFrom: '2026-06-03', validTo: '2026-09-23', checkedAt: '2026-08-09'
  },
  "74::https://www.mot-art-museum.jp/::MOTコレクション　はじめて、びじゅつ": {
    validFrom: '2026-04-28', validTo: '2026-08-16', checkedAt: '2026-07-30'
  },
  "74::https://www.mot-art-museum.jp/::エリック・カール展　はじまりは、はらぺこあおむし": {
    validFrom: '2026-04-25', validTo: '2026-07-26', checkedAt: '2026-07-30'
  },
  "74::https://www.mot-art-museum.jp/::(UN)KNOWN HIROKO KOSHINO―新説／真説 コシノヒロコ―": {
    validFrom: '2026-05-26', validTo: '2026-07-26', checkedAt: '2026-07-30'
  },
  "74::https://www.mot-art-museum.jp/::多田美波―光、凛と ゆれる": {
    validFrom: '2026-08-29', validTo: '2026-12-06', checkedAt: '2026-07-30'
  },
  "74::https://www.mot-art-museum.jp/::共時的星叢―時を共にした星たち　越境する芸術のまなざし": {
    validFrom: '2026-09-05', validTo: '2026-12-13', checkedAt: '2026-07-30'
  },
  "77::https://www.chikahaku.jp/event/2026/40th-anniversary_event.html::開館40周年「ちかはく・メモリアル40」": {
    validFrom: '2026-07-07', validTo: '2026-08-30', checkedAt: '2026-08-09'
  },
  "79::https://www.yumenoshima.jp/botanicalhall/exhibition::食虫植物と熱帯の“ふしぎな”いきものたち展": {
    validFrom: '2026-07-14', validTo: '2026-09-06', checkedAt: '2026-08-09'
  },
  "80::https://www.miraikan.jst.go.jp/exhibitions/spexhibition/dainankyokuten.html::特別展「大南極展」": {
    validFrom: '2026-07-01', validTo: '2026-09-27', checkedAt: '2026-09-19'
  },
  "85::https://mitaka-sportsandculture.or.jp/yoshimura/::没後20年・太宰治賞受賞60年 三鷹の作家・吉村昭と田野畑村": {
    validFrom: '2026-07-23', validTo: '2027-01-11', checkedAt: '2026-07-30'
  },
  "89::https://www.fuchu-cpf.or.jp/museum/1000077/1003429.html::生解説プラネタリウム「クイズで星空大冒険！2026」": {
    validFrom: '2026-07-07', validTo: '2026-08-30', checkedAt: '2026-08-09',
    fields: { '料金': '一般900円（プラネタリウム観覧券付き入場券／パスで入場）' },
    notice: '受付で投映時刻の観覧券に引き換え。特別投映は対象外です。'
  },
  "89::https://www.fuchu-cpf.or.jp/museum/tenji/1000074/1007951.html::特別展 フチュウで はたらく ウチュウ人": {
    validFrom: '2026-07-25', validTo: '2026-10-04', checkedAt: '2026-07-31'
  },
  "89::https://www.fuchu-cpf.or.jp/museum/tenji/1000074/index.html::企画展 発掘された戦争の記憶": {
    validFrom: '2026-07-18', validTo: '2026-10-25', checkedAt: '2026-07-31'
  },
  "89::https://www.fuchu-cpf.or.jp/museum/tenji/1000074/index.html::復元建物展示 土蔵造りのお店": {
    validFrom: '2026-06-06', validTo: '2027-03-31', checkedAt: '2026-07-31'
  },
  "89::https://www.fuchu-cpf.or.jp/museum/1000077/1003431.html::今夜の星空と「ダイナソー・サバイバル 恐竜たちの大進化」": {
    validFrom: '2026-03-14', validTo: '2026-11-29', checkedAt: '2026-07-31'
  },
  "89::https://www.fuchu-cpf.or.jp/museum/1000077/1004188.html::今夜の星空と「イナズマデリバリー バイザウェイの宇宙旅行?!」": {
    validFrom: '2026-07-07', validTo: '2026-11-29', checkedAt: '2026-07-31'
  },
  "89::https://www.fuchu-cpf.or.jp/museum/1000077/1007950.html::今夜の星空と「ショーティと魔法のサンゴ礁」": {
    validFrom: '2026-07-11', validTo: '2026-08-30', checkedAt: '2026-07-31'
  },
  "89::https://www.fuchu-cpf.or.jp/museum/1000077/1003387.html::今夜の星空と「3-2-1 LIFTOFF! ハムスターのスペースアドベンチャー！」": {
    validFrom: '2026-07-11', validTo: '2026-08-30', checkedAt: '2026-07-31'
  },
  "94::https://www.tamashinmuseum.org/post/tabitobito::旅と美と 倉田三郎と美術家たちが出会った異国": {
    validFrom: '2026-07-18', validTo: '2026-10-04', checkedAt: '2026-07-30'
  },
  "107::https://saitama-rekimin.spec.ed.jp/page_226jikentosyowa::歴史特集展示 二・二六事件と昭和": {
    validFrom: '2026-06-09', validTo: '2026-09-13', checkedAt: '2026-07-30'
  },
  "2::https://www.ueno-mori.org/exhibitions/article.cgi?id=12651051::シンシナティ美術館展 アメリカに渡ったヨーロッパの至宝": {
    validFrom: '2026-10-10', validTo: '2027-01-10', checkedAt: '2026-09-04',
    notice: 'ぐるっとパス利用後の割引は平日のみ対象。当日券を会場チケット売場で購入する場合に利用できます。'
  },
  "4::https://www.kahaku.go.jp/tenji-event/nid00003997.html::野口英世生誕150年記念企画展「感染症への挑戦：過去・現在・未来」": {
    validFrom: '2026-10-27', validTo: '2027-02-28', checkedAt: '2026-09-04'
  },
  "13::https://www.taitogeibun.net/ichiyo/::特別展「没後100年－師の君 半井桃水と樋口一葉」": {
    validFrom: '2026-10-24', validTo: '2026-12-20', checkedAt: '2026-09-04'
  },
  "20::https://www.seikado.or.jp/::民藝SHOCK!!―没後60年 静嘉堂の河井寬次郎": {
    validFrom: '2026-09-05', validTo: '2026-11-08', checkedAt: '2026-09-04',
    notice: '日時指定予約優先です。当日券の販売もございます。'
  },
  "16::https://www.tokyo-park.or.jp/park/mukojima-hyakkaen/news/2026/hagimatsuri.html::萩まつり": {
    validFrom: '2026-09-19', validTo: '2026-10-12', checkedAt: '2026-09-04'
  },
  "16::https://www.tokyo-park.or.jp/park/mukojima-hyakkaen/::月見の会": {
    validFrom: '2026-09-24', validTo: '2026-09-26', checkedAt: '2026-09-04'
  },
  "17::https://www.yamasa.com/musee/exhibitions/20260912-1206/::2026年秋のコレクション展「浜口陽三展リズム」": {
    validFrom: '2026-09-12', validTo: '2026-12-06', checkedAt: '2026-09-04'
  },
  "18::https://www.mitsui-museum.jp/exhibition/next.html::館蔵の茶碗100撰―国宝から手造茶碗まで―": {
    validFrom: '2026-09-12', validTo: '2026-11-23', checkedAt: '2026-09-04'
  },
  "22::https://baseball-museum.or.jp/exhibitions/jingu20260905/::企画展「明治神宮野球場 100年」": {
    validFrom: '2026-09-05', validTo: '2026-11-24', checkedAt: '2026-09-04'
  },
  "24::https://www.jcii-cameramuseum.jp/news/2026/08/19/39408/::特別展「イマイコレクション リンホフとハッセルブラッドの世界 機能とデザインの美学」": {
    validFrom: '2026-10-27', validTo: '2027-01-24', checkedAt: '2026-09-04'
  },
  "28::https://panasonic.co.jp/ew/museum/exhibition/26/261015/index.html::吉田璋也のデザイン―新作民藝運動がめざした未来": {
    validFrom: '2026-10-15', validTo: '2026-12-20', checkedAt: '2026-09-04',
    notice: '2026年11月28日（土）～12月20日（日）の土・日・祝日は日時指定予約制です。'
  },
  "33::https://www.shukokan.org/exhibition/future.html::企画展「美しい瞬間（とき）―美人画を中心に」": {
    validFrom: '2026-10-03', validTo: '2026-12-20', checkedAt: '2026-09-04',
    notice: '前期は10月3日（土）～11月8日（日）、後期は11月10日（火）～12月20日（日）です。'
  },
  "38::https://www.toguri-museum.or.jp/tenrankai/tenrankai_2026autumn.php::めぐってたのしい　佐賀・長崎のやきもの展": {
    validFrom: '2026-10-07', validTo: '2026-12-20', checkedAt: '2026-09-04',
    notice: '入館は予約優先です。休館日・夜間開館日は施設公式サイトをご確認ください。'
  },
  "69::https://www.tabashio.jp/exhibition/2026/2609sep/index.html::新収蔵ミニチュア展―名人小林礫斎を支えた二人の中田": {
    validFrom: '2026-09-26', validTo: '2026-12-20', checkedAt: '2026-09-04'
  },
  "41::https://www.matsuoka-museum.jp/exhibition/::粧い眠る　秋と冬の日本画名品選": {
    validFrom: '2026-10-27', validTo: '2027-02-07', checkedAt: '2026-09-04'
  },
  "43::https://ins.kahaku.go.jp/::写真展「自然教育園の四季と生きものたち」": {
    validFrom: '2026-09-12', validTo: '2026-10-25', checkedAt: '2026-09-04'
  },
  "44::https://www.teien-art-museum.ne.jp/exhibition/20261003-1220_marimekko/::マリメッコ展　模様のちから": {
    validFrom: '2026-10-03', validTo: '2026-12-20', checkedAt: '2026-09-04',
    notice: '日時指定予約制です。来館前に施設公式サイトでチケットを確認してください。'
  },
  "49::https://www.hasegawamachiko.jp/::収蔵コレクション展「木彫の世界」": {
    validFrom: '2026-09-15', validTo: '2026-11-08', checkedAt: '2026-09-04'
  },
  "50::https://www.setabun.or.jp/collection_exhi/20260926_collection.html::後期コレクション展「没後30年 宇野千代展―わたしと生きて行く私―」": {
    validFrom: '2026-09-26', validTo: '2027-03-28', checkedAt: '2026-09-04'
  },
  "50::https://www.setabun.or.jp/exhibition/20261003-20270207_yamazakimari.html::企画展「ヤマザキマリの世界　今この瞬間を生きる―Carpe Diem―」": {
    validFrom: '2026-10-03', validTo: '2027-02-07', checkedAt: '2026-09-04'
  },
  "51::https://www.setagayaartmuseum.or.jp/exhibition/special/detail.php?id=sp00230::スウェーデン・テキスタイル―暮らしと自然に息づく北欧デザイン": {
    validFrom: '2026-09-19', validTo: '2026-11-15', checkedAt: '2026-09-04'
  },
  "52::https://soseki-museum.jp/::《特別展》発表120年記念 坊っちゃん、松山へ行く！": {
    validFrom: '2026-10-10', validTo: '2026-12-06', checkedAt: '2026-09-04'
  },
  "53::https://www.regasu-shinjuku.or.jp/rekihaku/wp-content/uploads/2026/03/chirashi_A4_04.pdf::松本竣介と『雑記帳』―下落合の「綜合工房」―": {
    validFrom: '2026-10-04', validTo: '2026-11-23', checkedAt: '2026-09-04'
  },
  "54::https://museum.bunka.ac.jp/exhibition/exhibition6284/::世界の刺繍をめぐる旅": {
    validFrom: '2026-09-24', validTo: '2026-11-21', checkedAt: '2026-09-04'
  },
  "57::https://www.operacity.jp/ag/exh/upcoming_exhibitions/::種と根っこ―都市の耕し方": {
    validFrom: '2026-10-17', validTo: '2026-12-20', checkedAt: '2026-09-04'
  },
  "62::https://www.eiseibunko.com/exhibition.html::秋季展「白隠ワールド―細川護立コレクションのはじまり―」": {
    validFrom: '2026-10-03', validTo: '2026-11-29', checkedAt: '2026-09-04'
  },
  "63::https://aom-tokyo.com/exhibition/20260919_silver.html::秋の特別展「古代オリエントから石見銀山へ―銀が動かす世界―」": {
    validFrom: '2026-09-19', validTo: '2026-12-06', checkedAt: '2026-09-04'
  },
  "64::https://papermuseum.jp/ja/special-exhibition/::企画展「吉井源太と土佐の紙すき」": {
    validFrom: '2026-09-19', validTo: '2026-11-29', checkedAt: '2026-09-04'
  },
  "65::https://www.shibusawa.or.jp/museum/special/2026/kikaku2026_02.html::収蔵品展「御正 伸の渋沢栄一―「粋な絵師」が描く小説挿絵」": {
    validFrom: '2026-08-04', validTo: '2026-09-13', checkedAt: '2026-09-04'
  },
  "70::https://hokusai-museum.jp/modules/Exhibition/exhibitions/view/5021::開館10周年記念　特別展「ベスト オブ すみだ北斎美術館―隅田川両岸景色図巻と名品―」": {
    validFrom: '2026-09-15', validTo: '2026-11-23', checkedAt: '2026-09-04'
  },
  "71::https://www.edo-tokyo-museum.or.jp/s-exhibition/toyotomi/::江戸東京博物館リニューアル記念・NHK大河ドラマ特別展「豊臣兄弟！」": {
    validFrom: '2026-09-15', validTo: '2026-11-08', checkedAt: '2026-09-04'
  },
  "74::https://www.mot-art-museum.jp/::MOTコレクション　いつかの光を今みている": {
    validFrom: '2026-09-19', validTo: '2027-01-06', checkedAt: '2026-09-04'
  },
  "81::https://www.musashino.or.jp/museum/1002006/1002008/1009837.html::谷口智則展　黒い森を抜けて―はいいろのぼくとオレンジのあいつ―": {
    validFrom: '2026-09-19', validTo: '2026-11-03', checkedAt: '2026-09-04'
  },
  "84::https://mitaka-sportsandculture.or.jp/yuzo/event/20260912/::三鷹市山本有三記念館開館30周年 建物の記録と記憶―三鷹市山本有三記念館、100年の時を経て―": {
    validFrom: '2026-09-12', validTo: '2027-03-07', checkedAt: '2026-09-04'
  },
  "86::https://www.mushakoji.org/schedule/tenji.html::秋の特別展「画家・河野通勢　生涯と代表作」": {
    validFrom: '2026-10-24', validTo: '2026-12-06', checkedAt: '2026-09-04'
  },
  "89::https://www.fuchu-cpf.or.jp/museum/event/1006476/index.html::第4回郷土の森曼珠沙華まつり": {
    validFrom: '2026-09-19', validTo: '2026-10-04', checkedAt: '2026-09-04'
  },
  "89::https://www.fuchu-cpf.or.jp/museum/1000077/1003158/index.html::生解説プラネタリウム「秋の四辺形からはじまる ペガスス座の物語」": {
    validFrom: '2026-09-01', validTo: '2026-11-29', checkedAt: '2026-09-04',
    notice: '受付で投映時刻の観覧券に引き換えてください。投映日・時刻は公式スケジュールをご確認ください。'
  },
  "89::https://www.fuchu-cpf.or.jp/museum/1000077/index.html::今夜の星空と「星の旅－世界編－」": {
    validFrom: '2026-09-01', validTo: '2026-11-29', checkedAt: '2026-09-04',
    notice: '投映日・時刻は公式スケジュールをご確認ください。'
  },
  "90::https://www.tamarokuto.or.jp/event/index.html?c=event&day=2026-09-30&info=3665::大人向けプラネタリウム「月の満ち欠け　まるわかり！」": {
    validFrom: '2026-09-27', validTo: '2026-09-30', checkedAt: '2026-09-04',
    notice: '開催日は2026年9月27日（日）と9月30日（水）のみです。'
  },
  "90::https://www.tamarokuto.or.jp/event/index.html?c=event&day=2026-10-28&info=3682::大人向けプラネタリウム「古天球儀にみる秋の星座たち」": {
    validFrom: '2026-10-25', validTo: '2026-10-28', checkedAt: '2026-09-04',
    notice: '開催日は2026年10月25日（日）と10月28日（水）のみです。'
  },
  "90::https://www.tamarokuto.or.jp/calendar/index.html?c=event&calendar=2026-11-07&month=2027-02::大型映像「VOYAGER／ボイジャー 終わりなき旅」": {
    validFrom: '2026-09-04', validTo: null, checkedAt: '2026-09-04',
    notice: '投映日・時刻は公式カレンダーをご確認ください。'
  },
  "90::https://www.tamarokuto.or.jp/event/index.html?c=event&info=3689&day=2026-12-27::全編生解説プラネタリウム「宇宙クルーズ2026〈追跡！ボイジャー1号〉」": {
    validFrom: '2026-09-29', validTo: '2026-12-27', checkedAt: '2026-09-04'
  },
  "92::https://www.city.kodaira.tokyo.jp/kurashi/061/061404.html::書の世界―平櫛田中コレクションより": {
    validFrom: '2026-09-10', validTo: '2026-11-23', checkedAt: '2026-09-04'
  },
  "94::https://www.tamashinmuseum.org/post/daigakuhangaten51::第51回全国大学版画展": {
    validFrom: '2026-10-21', validTo: '2026-12-20', checkedAt: '2026-09-04'
  },
  "96::https://www.yumebi.com/exb.html::没後20年　大野五郎／夭折の画家　小野幸吉": {
    validFrom: '2026-09-12', validTo: '2026-11-03', checkedAt: '2026-09-04'
  },
  "97::https://www.fujibi.or.jp/en/exhibitions/3202610031/::This is SUEKI―古代のカタチ、無限大！": {
    validFrom: '2026-10-03', validTo: '2026-12-27', checkedAt: '2026-09-04'
  },
  "99::https://hanga-museum.jp/exhibition/schedule/2026-631::うき世のたわむれ：笑いつづける浮世絵と幕末明治の渦": {
    validFrom: '2026-09-12', validTo: '2026-11-23', checkedAt: '2026-09-04'
  },
  "100::https://sogo-museum.jp/exhibitions/details.jsp?id=2071::カラフルパレット　鈴木信太郎": {
    validFrom: '2026-09-12', validTo: '2026-10-12', checkedAt: '2026-09-04'
  },
  "102::https://ch.kanagawa-museum.jp/event/11192::特別展「入門！神奈川県立歴史博物館―県博の守り伝えていくコレクション―」": {
    validFrom: '2026-10-17', validTo: '2026-12-13', checkedAt: '2026-09-19'
  },
  "105::https://www.ccma-net.jp/exhibitions/special/26-9-16-11-23/::千葉開府900年記念特別展　月と星と―美術がつなぐとき": {
    validFrom: '2026-09-16', validTo: '2026-11-23', checkedAt: '2026-09-19'
  },
  "106::https://pref.spec.ed.jp/momas/2026uchima::内間安瑆・俊子展　色を織り、記憶を紡ぐ": {
    validFrom: '2026-10-10', validTo: '2027-01-17', checkedAt: '2026-09-04'
  },
  "107::https://saitama-rekimin.spec.ed.jp/bunjinga::特別展「文人画家の寄り道―文晁、崋山と同好の士―」": {
    validFrom: '2026-10-10', validTo: '2026-11-23', checkedAt: '2026-09-04'
  },
  "107::https://saitama-rekimin.spec.ed.jp/tenjiannai/tokubetsukikakuten::美術特集展示「きん・ぎん・すなご―金工品と装飾経―」": {
    validFrom: '2026-10-27', validTo: '2027-01-17', checkedAt: '2026-09-04'
  },
  "107::https://saitama-rekimin.spec.ed.jp/tenjiannai/josetsuten::歴史特集展示「川村碩布と俳諧」": {
    validFrom: '2026-09-15', validTo: '2026-12-13', checkedAt: '2026-09-04'
  },
  "107::https://saitama-rekimin.spec.ed.jp/tenjiannai/josetsuten::民俗コラム展示「竹縄―「最強ロープ」ができるまで―」": {
    validFrom: '2026-09-15', validTo: '2026-11-29', checkedAt: '2026-09-04'
  },
  // No.47 アクセサリーミュージアム — provisional TORII identity finalized on the
  // facility official exhibition page (checked 2026-09-04).
  "47::https://acce-museum.main.jp/exhibition/::YUKI TORII 鳥居ユキのハッピー・パワー・アイデンティティ": {
    validFrom: '2026-09-01', validTo: '2026-12-20', checkedAt: '2026-09-04'
  },
  // No.98 青梅市吉川英治記念館 — currently running official event. The early
  // Grutto provisional plan (開館5周年記念展 英治が愛した青梅(仮)) is no longer
  // presented as current; the facility official event page is the current source.
  "98::https://ome-yoshikawaeiji.net/::青梅市吉川英治記念館×文豪とアルケミストPART Ⅵ Many thanks ～私たちと文アル～": {
    validFrom: '2026-07-18', validTo: '2026-11-29', checkedAt: '2026-09-04'
  },
  "34::https://www.musee-tomo.or.jp/exhibition/schedule.html::関島寿子 かごについてのかご": {
    validFrom: '2026-11-14', validTo: '2027-03-22', checkedAt: '2026-10-06'
  },
  "35::https://sen-oku.or.jp/program/t_202611_karamono/::特別展 唐物誕生―茶の湯デザインの源流をさぐる": {
    validFrom: '2026-11-03', validTo: '2026-12-13', checkedAt: '2026-10-06'
  },
  "36-2::https://www.mori.art.museum/jp/exhibitions/marikomori/index.html::森万里子：燦燦": {
    validFrom: '2026-10-31', validTo: '2027-03-28', checkedAt: '2026-10-06'
  }
};
