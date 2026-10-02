'use strict';

// D2.2 identity and publication authority. This file is build/test input only;
// it is intentionally outside the public runtime allowlist.
//
// Slugs are registered once and are never derived from display names during a
// build. A display-name or translation correction therefore cannot silently
// change a canonical URL.
const FACILITY_URL_SLUGS = Object.freeze({
  '1': 'shitamachi-museum',
  '2': 'the-ueno-royal-museum',
  '3': 'the-national-museum-of-western-art',
  '4': 'national-museum-of-nature-and-science',
  '5': 'tokyo-national-museum',
  '6': 'sogakudo-of-the-former-tokyo-music-school',
  '7': 'tokyo-metropolitan-art-museum',
  '8': 'ueno-zoological-gardens',
  '9': 'the-university-art-museum-tokyo-university-of-the-arts',
  '10': 'kyu-iwasaki-tei-gardens',
  '11': 'asakura-museum-of-sculpture-taito',
  '12': 'calligraphy-museum',
  '13': 'ichiyo-memorial-museum',
  '14': 'sekido-museum-of-art',
  '15': 'mori-ogai-memorial-museum',
  '16': 'mukojima-hyakkaen-gardens',
  '17': 'musee-hamaguchi-yozo-yamasa-collection',
  '18': 'mitsui-memorial-museum',
  '19': 'national-film-archive-of-japan',
  '20': 'seikado-bunko-art-museum',
  '21': 'koishikawa-korakuen-gardens',
  '22': 'the-baseball-hall-of-fame-and-museum',
  '23': 'printing-museum-tokyo',
  '24': 'jcii-camera-museum',
  '25': 'showa-kan-national-showa-memorial-museum',
  '26': 'science-museum',
  '27': 'the-national-museum-of-modern-art-tokyo',
  '28': 'panasonic-shiodome-museum-of-art',
  '29': 'ocha-culture-creation-museum',
  '30': 'hama-rikyu-gardens',
  '31': 'kyu-shiba-rikyu-gardens',
  '32-WHAT-MUSEUM': 'what-museum',
  '33': 'okura-museum-of-art',
  '34': 'kikuchi-kanjitsu-memorial-tomo-museum',
  '35': 'sen-oku-hakukokan-museum-tokyo',
  '36': 'tokyo-city-view',
  '36-2': 'mori-art-museum',
  '37': 'the-shoto-museum-of-art',
  '38': 'toguri-museum-of-art',
  '39': 'yamatane-museum-of-art',
  '40': 'tokyo-photographic-art-museum',
  '41': 'matsuoka-museum-of-art',
  '42': 'minato-city-local-history-museum',
  '43': 'institute-for-nature-study-national-museum-of-nature-and-science',
  '44': 'tokyo-metropolitan-teien-art-museum',
  '45': 'meguro-museum-of-art-tokyo',
  '46': 'sato-sakura-museum',
  '47': 'accessory-museum',
  '48': 'the-gotoh-museum',
  '49': 'the-hasegawa-machiko-art-museum',
  '50': 'setagaya-literary-museum',
  '51': 'setagaya-art-museum',
  '52': 'natsume-soseki-memorial-museum',
  '53': 'shinjuku-historical-museum',
  '54': 'bunka-gakuen-costume-museum',
  '55': 'japan-olympic-museum',
  '56': 'koga-masao-museum-of-music',
  '57': 'tokyo-opera-city-art-gallery',
  '58-NTT-ICC': 'ntt-intercommunication-center-icc',
  '59': 'hayashi-fumiko-memorial-hall',
  '60': 'chihiro-art-museum-tokyo',
  '61': 'kumagai-morikazu-museum-of-art',
  '62': 'eisei-bunko-museum',
  '63': 'the-ancient-orient-museum-tokyo',
  '64': 'paper-museum',
  '65': 'shibusawa-memorial-museum',
  '66': 'kyu-furukawa-gardens',
  '67': 'rikugien-gardens',
  '68': 'toyo-bunko-museum',
  '69': 'tobacco-and-salt-museum',
  '70': 'the-sumida-hokusai-museum',
  '71': 'edo-tokyo-museum',
  '72': 'basho-museum',
  '73': 'kiyosumi-gardens',
  '74': 'museum-of-contemporary-art-tokyo',
  '75': 'fukagawa-edo-museum',
  '76': 'nakagawa-funabansho-museum',
  '77': 'metro-museum',
  '78': 'tokyo-sea-life-park',
  '79': 'yumenoshima-tropical-greenhouse-dome',
  '80': 'miraikan-the-national-museum-of-emerging-science-and-innovation',
  '81': 'kichijoji-art-museum',
  '82': 'inokashira-park-zoo',
  '83': 'mitaka-city-gallery-of-art',
  '84': 'mitaka-city-yuzo-yamamoto-memorial-museum',
  '85': 'mitaka-city-yoshimura-akira-writing-room',
  '86': 'mushakoji-saneatsu-memorial-museum',
  '87': 'jindai-botanical-gardens',
  '88': 'fuchu-art-museum',
  '89': 'fuchu-municipal-museum-kyodonomori',
  '90': 'tamarokuto-science-center',
  '91': 'edo-tokyo-open-air-architectural-museum',
  '92': 'kodaira-hirakushi-denchu-art-museum',
  '93': 'tonogayato-gardens',
  '94': 'tamashin-art-museum',
  '95': 'tama-zoological-park',
  '96': 'hachioji-yume-art-museum',
  '97': 'tokyo-fuji-art-museum',
  '98': 'yoshikawa-eiji-memorial-museum',
  '99': 'machida-city-museum-of-graphic-arts',
  '100': 'sogo-museum-of-art',
  '101': 'sail-training-ship-nippon-maru-yokohama-port-museum',
  '102': 'kanagawa-prefectural-museum-of-cultural-history',
  '103': 'museum-of-yokohama-urban-history-yokohama-museum-of-eurasian-cultures',
  '104': 'yokohama-archives-of-history',
  '105': 'chiba-city-museum-of-art',
  '106': 'the-museum-of-modern-art-saitama',
  '107': 'saitama-prefectural-museum-of-history-and-folklore'
});

// Technical canary only. These keys are intentionally not publication
// approval: preview generation exercises them without changing production.
const CANARY_CANDIDATES = Object.freeze([
  '5',    // prominent Ueno institution; discount; stable weekend-hours variant
  '7',    // admission; time-scoped Pass; representative high-risk legacy amount
  '18',   // discount; priced scoped record; approved-access fallback path
  '36',   // first of the two existing No.36 card identities
  '36-2', // second of the two existing No.36 card identities
  '44',   // mixed admission/discount; scoped garden value and variable exhibit
  '71',   // mixed admission/discount; scoped value and stable hours exception
  '103',  // one combined card with two subordinate venue introductions; high-risk legacy amount
  '105'   // lower-awareness regional mixed-benefit facility
]);

// Publication authority is an independent decision from CANARY_CANDIDATES.
// Keep this as a separate literal even while the first technical-canary
// cohort has equal membership in both authorities.
const PUBLICATION_APPROVED = Object.freeze([
  '5',    // 東京国立博物館
  '7',    // 東京都美術館
  '18',   // 三井記念美術館
  '36',   // 東京シティビュー
  '36-2', // 森美術館
  '44',   // 東京都庭園美術館
  '71',   // 東京都江戸東京博物館
  '103',  // 横浜都市発展記念館 / 横浜ユーラシア文化館
  '105'   // 千葉市美術館
]);

const FACILITY_DIRECT_URL_REGISTRY = Object.freeze({
  version: 1,
  slugs: FACILITY_URL_SLUGS,
  canaryCandidates: CANARY_CANDIDATES,
  publicationApproved: PUBLICATION_APPROVED
});

module.exports = {
  FACILITY_URL_SLUGS,
  CANARY_CANDIDATES,
  PUBLICATION_APPROVED,
  FACILITY_DIRECT_URL_REGISTRY
};
