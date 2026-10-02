// Official brochure runtime identity, card/venue structure and page locators.
// Facility Introduction copy is owned by data/facility-summaries.js.
// Do not add description fields here. Venue existence is structural:
// non-empty subfacilities define venues; otherwise the card is one venue.
// No.103 remains one combined card describing two brochure venues.
const FACILITY_BROCHURE = {
  "metadata": {
    "source": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
    "sourceFile": "brochure_2026_01.pdf",
    "informationDate": "2026-02",
    "checkedAt": "2026-08-10",
    "officialNumberCount": 107,
    "brochureVenueCount": 109,
    "appCardCount": 108
  },
  "cards": {
    "1": {
      "nameJa": "台東区立したまちミュージアム",
      "nameEn": "Shitamachi Museum",
      "sourcePage": 6
    },
    "2": {
      "nameJa": "上野の森美術館",
      "nameEn": "The Ueno Royal Museum",
      "sourcePage": 7
    },
    "3": {
      "nameJa": "国立西洋美術館",
      "nameEn": "The National Museum of Western Art",
      "sourcePage": 7
    },
    "4": {
      "nameJa": "国立科学博物館",
      "nameEn": "National Museum of Nature and Science",
      "sourcePage": 7
    },
    "5": {
      "nameJa": "東京国立博物館",
      "nameEn": "Tokyo National Museum",
      "sourcePage": 7
    },
    "6": {
      "nameJa": "台東区立旧東京音楽学校奏楽堂",
      "nameEn": "Sogakudo of the Former Tokyo Music School",
      "sourcePage": 7
    },
    "7": {
      "nameJa": "東京都美術館",
      "nameEn": "Tokyo Metropolitan Art Museum",
      "sourcePage": 7
    },
    "8": {
      "nameJa": "恩賜上野動物園",
      "nameEn": "Ueno Zoological Gardens",
      "sourcePage": 7
    },
    "9": {
      "nameJa": "東京藝術大学大学美術館",
      "nameEn": "The University Art Museum, Tokyo University of the Arts",
      "sourcePage": 7
    },
    "10": {
      "nameJa": "旧岩崎邸庭園",
      "nameEn": "Kyu-Iwasaki-tei Gardens",
      "sourcePage": 7
    },
    "11": {
      "nameJa": "台東区立朝倉彫塑館",
      "nameEn": "ASAKURA Museum of Sculpture, Taito",
      "sourcePage": 7
    },
    "12": {
      "nameJa": "台東区立書道博物館",
      "nameEn": "Calligraphy Museum",
      "sourcePage": 7
    },
    "13": {
      "nameJa": "台東区立一葉記念館",
      "nameEn": "Ichiyo Memorial Museum",
      "sourcePage": 7
    },
    "14": {
      "nameJa": "石洞美術館",
      "nameEn": "Sekido Museum of Art",
      "sourcePage": 8
    },
    "15": {
      "nameJa": "文京区立森鷗外記念館",
      "nameEn": "Mori Ogai Memorial Museum",
      "sourcePage": 8
    },
    "16": {
      "nameJa": "向島百花園",
      "nameEn": "Mukojima-Hyakkaen Gardens",
      "sourcePage": 8
    },
    "17": {
      "nameJa": "ミュゼ浜口陽三・ヤマサコレクション",
      "nameEn": "Musée Hamaguchi Yozo: Yamasa Collection",
      "sourcePage": 8
    },
    "18": {
      "nameJa": "三井記念美術館",
      "nameEn": "Mitsui Memorial Museum",
      "sourcePage": 9
    },
    "19": {
      "nameJa": "国立映画アーカイブ",
      "nameEn": "National Film Archive of Japan",
      "sourcePage": 9
    },
    "20": {
      "nameJa": "静嘉堂文庫美術館",
      "nameEn": "Seikado Bunko Art Museum",
      "sourcePage": 9
    },
    "21": {
      "nameJa": "小石川後楽園",
      "nameEn": "Koishikawa Korakuen Gardens",
      "sourcePage": 9
    },
    "22": {
      "nameJa": "野球殿堂博物館",
      "nameEn": "The Baseball Hall of Fame and Museum",
      "sourcePage": 9
    },
    "23": {
      "nameJa": "印刷博物館",
      "nameEn": "Printing Museum, Tokyo",
      "sourcePage": 9
    },
    "24": {
      "nameJa": "日本カメラ博物館",
      "nameEn": "JCII Camera Museum",
      "sourcePage": 9
    },
    "25": {
      "nameJa": "昭和館",
      "nameEn": "Showa-kan/ National Showa Memorial Museum",
      "sourcePage": 9
    },
    "26": {
      "nameJa": "科学技術館",
      "nameEn": "Science Museum",
      "sourcePage": 9
    },
    "27": {
      "nameJa": "東京国立近代美術館",
      "nameEn": "The National Museum of Modern Art, Tokyo",
      "sourcePage": 10
    },
    "28": {
      "nameJa": "パナソニック汐留美術館",
      "nameEn": "Panasonic Shiodome Museum of Art",
      "sourcePage": 10
    },
    "29": {
      "nameJa": "お茶の文化創造博物館",
      "nameEn": "Ocha Culture Creation Museum",
      "sourcePage": 10
    },
    "30": {
      "nameJa": "浜離宮恩賜庭園",
      "nameEn": "Hama-rikyu Gardens",
      "sourcePage": 10
    },
    "31": {
      "nameJa": "旧芝離宮恩賜庭園",
      "nameEn": "Kyu-Shiba-rikyu Gardens",
      "sourcePage": 10
    },
    "33": {
      "nameJa": "大倉集古館",
      "nameEn": "Okura Museum of Art",
      "sourcePage": 10
    },
    "34": {
      "nameJa": "菊池寛実記念智美術館",
      "nameEn": "Kikuchi Kanjitsu Memorial Tomo Museum",
      "sourcePage": 11
    },
    "35": {
      "nameJa": "泉屋博古館東京",
      "nameEn": "Sen-oku Hakukokan Museum Tokyo",
      "sourcePage": 11
    },
    "36": {
      "nameJa": "東京シティビュー",
      "nameEn": "Tokyo City View",
      "sourcePage": 11
    },
    "37": {
      "nameJa": "渋谷区立松濤美術館",
      "nameEn": "The Shoto Museum of Art",
      "sourcePage": 11
    },
    "38": {
      "nameJa": "戸栗美術館",
      "nameEn": "Toguri Museum of Art",
      "sourcePage": 11
    },
    "39": {
      "nameJa": "山種美術館",
      "nameEn": "Yamatane Museum of Art",
      "sourcePage": 11
    },
    "40": {
      "nameJa": "東京都写真美術館",
      "nameEn": "Tokyo Photographic Art Museum",
      "sourcePage": 11
    },
    "41": {
      "nameJa": "松岡美術館",
      "nameEn": "Matsuoka Museum of Art",
      "sourcePage": 11
    },
    "42": {
      "nameJa": "港区立郷土歴史館",
      "nameEn": "Minato City Local History Museum",
      "sourcePage": 11
    },
    "43": {
      "nameJa": "国立科学博物館附属自然教育園",
      "nameEn": "Institute for Nature Study National Museum of Nature and Science",
      "sourcePage": 11
    },
    "44": {
      "nameJa": "東京都庭園美術館",
      "nameEn": "Tokyo Metropolitan Teien Art Museum",
      "sourcePage": 11
    },
    "45": {
      "nameJa": "目黒区美術館",
      "nameEn": "Meguro Museum of Art,Tokyo",
      "sourcePage": 12
    },
    "46": {
      "nameJa": "郷さくら美術館",
      "nameEn": "Sato Sakura Museum",
      "sourcePage": 12
    },
    "47": {
      "nameJa": "アクセサリーミュージアム",
      "nameEn": "Accessory Museum",
      "sourcePage": 12
    },
    "48": {
      "nameJa": "五島美術館",
      "nameEn": "The Gotoh Museum",
      "sourcePage": 12
    },
    "49": {
      "nameJa": "長谷川町子美術館",
      "nameEn": "The Hasegawa Machiko Art Museum",
      "sourcePage": 12
    },
    "50": {
      "nameJa": "世田谷文学館",
      "nameEn": "Setagaya Literary Museum",
      "sourcePage": 12
    },
    "51": {
      "nameJa": "世田谷美術館",
      "nameEn": "Setagaya Art Museum",
      "sourcePage": 12
    },
    "52": {
      "nameJa": "新宿区立漱石山房記念館",
      "nameEn": "Natsume Soseki Memorial Museum",
      "sourcePage": 13
    },
    "53": {
      "nameJa": "新宿区立新宿歴史博物館",
      "nameEn": "Shinjuku Historical Museum",
      "sourcePage": 13
    },
    "54": {
      "nameJa": "文化学園服飾博物館",
      "nameEn": "Bunka Gakuen Costume Museum",
      "sourcePage": 13
    },
    "55": {
      "nameJa": "日本オリンピックミュージアム",
      "nameEn": "Japan Olympic Museum",
      "sourcePage": 13
    },
    "56": {
      "nameJa": "古賀政男音楽博物館",
      "nameEn": "Koga Masao Museum of Music",
      "sourcePage": 13
    },
    "57": {
      "nameJa": "東京オペラシティアートギャラリー",
      "nameEn": "Tokyo Opera City Art Gallery",
      "sourcePage": 13
    },
    "59": {
      "nameJa": "新宿区立林芙美子記念館",
      "nameEn": "Hayashi Fumiko Memorial Hall",
      "sourcePage": 14
    },
    "60": {
      "nameJa": "ちひろ美術館・東京",
      "nameEn": "Chihiro Art Museum Tokyo",
      "sourcePage": 14
    },
    "61": {
      "nameJa": "豊島区立熊谷守一美術館",
      "nameEn": "Kumagai Morikazu Museum of Art",
      "sourcePage": 14
    },
    "62": {
      "nameJa": "永青文庫",
      "nameEn": "Eisei Bunko Museum",
      "sourcePage": 14
    },
    "63": {
      "nameJa": "古代オリエント博物館",
      "nameEn": "The Ancient Orient Museum,Tokyo",
      "sourcePage": 14
    },
    "64": {
      "nameJa": "紙の博物館",
      "nameEn": "Paper Museum",
      "sourcePage": 14
    },
    "65": {
      "nameJa": "渋沢史料館",
      "nameEn": "Shibusawa Memorial Museum",
      "sourcePage": 14
    },
    "66": {
      "nameJa": "旧古河庭園",
      "nameEn": "Kyu-Furukawa Gardens",
      "sourcePage": 14
    },
    "67": {
      "nameJa": "六義園",
      "nameEn": "Rikugien Gardens",
      "sourcePage": 14
    },
    "68": {
      "nameJa": "東洋文庫ミュージアム",
      "nameEn": "Toyo Bunko Museum",
      "sourcePage": 14
    },
    "69": {
      "nameJa": "たばこと塩の博物館",
      "nameEn": "Tobacco & Salt Museum",
      "sourcePage": 15
    },
    "70": {
      "nameJa": "すみだ北斎美術館",
      "nameEn": "The Sumida Hokusai Museum",
      "sourcePage": 15
    },
    "71": {
      "nameJa": "東京都江戸東京博物館",
      "nameEn": "Edo-Tokyo Museum",
      "sourcePage": 15
    },
    "72": {
      "nameJa": "江東区芭蕉記念館",
      "nameEn": "Basho Museum",
      "sourcePage": 15
    },
    "73": {
      "nameJa": "清澄庭園",
      "nameEn": "Kiyosumi Gardens",
      "sourcePage": 15
    },
    "74": {
      "nameJa": "東京都現代美術館",
      "nameEn": "Museum of Contemporary Art Tokyo",
      "sourcePage": 15
    },
    "75": {
      "nameJa": "江東区深川江戸資料館",
      "nameEn": "Fukagawa Edo Museum",
      "sourcePage": 15
    },
    "76": {
      "nameJa": "江東区中川船番所資料館",
      "nameEn": "Nakagawa Funabansho Museum",
      "sourcePage": 16
    },
    "77": {
      "nameJa": "地下鉄博物館",
      "nameEn": "Metro Museum",
      "sourcePage": 16
    },
    "78": {
      "nameJa": "葛西臨海水族園",
      "nameEn": "Tokyo Sea Life Park",
      "sourcePage": 16
    },
    "79": {
      "nameJa": "夢の島熱帯植物館",
      "nameEn": "Yumenoshima Tropical Greenhouse Dome",
      "sourcePage": 16
    },
    "80": {
      "nameJa": "日本科学未来館",
      "nameEn": "Miraikan – The National Museum of Emerging Science and Innovation",
      "sourcePage": 16
    },
    "81": {
      "nameJa": "武蔵野市立吉祥寺美術館",
      "nameEn": "Kichijoji Art Museum",
      "sourcePage": 16
    },
    "82": {
      "nameJa": "井の頭自然文化園",
      "nameEn": "Inokashira Park Zoo",
      "sourcePage": 17
    },
    "83": {
      "nameJa": "三鷹市美術ギャラリー",
      "nameEn": "Mitaka City Gallery of Art",
      "sourcePage": 17
    },
    "84": {
      "nameJa": "三鷹市山本有三記念館",
      "nameEn": "Mitaka City Yuzo Yamamoto Memorial Museum",
      "sourcePage": 17
    },
    "85": {
      "nameJa": "三鷹市吉村昭書斎",
      "nameEn": "Mitaka City Yoshimura Akira Writing Room",
      "sourcePage": 17
    },
    "86": {
      "nameJa": "調布市武者小路実篤記念館",
      "nameEn": "Mushakoji Saneatsu Memorial Museum",
      "sourcePage": 17
    },
    "87": {
      "nameJa": "神代植物公園",
      "nameEn": "Jindai Botanical Gardens",
      "sourcePage": 17
    },
    "88": {
      "nameJa": "府中市美術館",
      "nameEn": "Fuchu Art Museum",
      "sourcePage": 17
    },
    "89": {
      "nameJa": "府中市郷土の森博物館",
      "nameEn": "Fuchu Municipal Museum Kyodonomori",
      "sourcePage": 17
    },
    "90": {
      "nameJa": "多摩六都科学館",
      "nameEn": "Tamarokuto Science Center",
      "sourcePage": 17
    },
    "91": {
      "nameJa": "江戸東京たてもの園",
      "nameEn": "Edo-Tokyo Open Air Architectural Museum",
      "sourcePage": 17
    },
    "92": {
      "nameJa": "小平市平櫛田中彫刻美術館",
      "nameEn": "Kodaira Hirakushi Denchu Art Museum",
      "sourcePage": 17
    },
    "93": {
      "nameJa": "殿ヶ谷戸庭園",
      "nameEn": "Tonogayato Gardens",
      "sourcePage": 17
    },
    "94": {
      "nameJa": "たましん美術館",
      "nameEn": "Tamashin Art Museum",
      "sourcePage": 18
    },
    "95": {
      "nameJa": "多摩動物公園",
      "nameEn": "Tama Zoological Park",
      "sourcePage": 18
    },
    "96": {
      "nameJa": "八王子市夢美術館",
      "nameEn": "Hachioji Yume Art Museum",
      "sourcePage": 18
    },
    "97": {
      "nameJa": "東京富士美術館",
      "nameEn": "Tokyo Fuji Art Museum",
      "sourcePage": 18
    },
    "98": {
      "nameJa": "青梅市吉川英治記念館",
      "nameEn": "Yoshikawa Eiji Memorial Museum",
      "sourcePage": 18
    },
    "99": {
      "nameJa": "町田市立国際版画美術館",
      "nameEn": "Machida City Museum of Graphic Arts",
      "sourcePage": 18
    },
    "100": {
      "nameJa": "そごう美術館",
      "nameEn": "Sogo Museum of Art",
      "sourcePage": 19
    },
    "101": {
      "nameJa": "帆船日本丸/横浜みなと博物館",
      "nameEn": "Sail Training Ship NIPPON MARU／ Yokohama Port Museum",
      "sourcePage": 19
    },
    "102": {
      "nameJa": "神奈川県立歴史博物館",
      "nameEn": "Kanagawa Prefectural Museum of Cultural History",
      "sourcePage": 19
    },
    "103": {
      "nameJa": "横浜都市発展記念館/横浜ユーラシア文化館",
      "nameEn": "Museum of Yokohama Urban History / Yokohama Museum of EurAsian Cultures",
      "sourcePage": 19,
      "subfacilities": [
        {
          "nameJa": "横浜都市発展記念館",
          "nameEn": "Museum of Yokohama Urban History"
        },
        {
          "nameJa": "横浜ユーラシア文化館",
          "nameEn": "Yokohama Museum of EurAsian Cultures"
        }
      ]
    },
    "104": {
      "nameJa": "横浜開港資料館",
      "nameEn": "Yokohama Archives of History",
      "sourcePage": 19
    },
    "105": {
      "nameJa": "千葉市美術館",
      "nameEn": "Chiba City Museum of Art",
      "sourcePage": 19
    },
    "106": {
      "nameJa": "埼玉県立近代美術館",
      "nameEn": "The Museum of Modern Art, Saitama",
      "sourcePage": 19
    },
    "107": {
      "nameJa": "埼玉県立歴史と民俗の博物館",
      "nameEn": "Saitama Prefectural Museum of History and Folklore",
      "sourcePage": 19
    },
    "32-WHAT-MUSEUM": {
      "nameJa": "WHAT MUSEUM",
      "nameEn": "WHAT MUSEUM",
      "sourcePage": 10
    },
    "36-2": {
      "nameJa": "森美術館",
      "nameEn": "Mori Art Museum",
      "sourcePage": 11
    },
    "58-NTT-ICC": {
      "nameJa": "NTTインターコミュニケーション・センター［ICC］",
      "nameEn": "NTT InterCommunication Center [ICC]",
      "sourcePage": 13
    }
  }
};

if (typeof window !== 'undefined') window.FACILITY_BROCHURE = FACILITY_BROCHURE;
