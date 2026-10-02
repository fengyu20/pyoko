// Scoped Pass benefit data — the semantic source of truth for what the Pass
// grants, at what scope, and what that is worth.
//
// Three layers, deliberately separate:
//   official_clauses[].wording_ja  official entitlement wording, verbatim
//   benefits[]                     our structured interpretation of that wording
//   comparable_value_yen           product-derived value, with value_basis
//
// A null price or saving means "not verified for this scope", never zero. A
// percentage benefit on an exhibition-variable price is complete data with no
// yen amount at all.
//
// Runtime interpretation follows docs/design/pass-benefit-scoped-schema.md.
const FACILITY_PASS_BENEFITS = {
  "1": {
    "facility_no": "1",
    "name_ja": "台東区立したまちミュージアム",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 6
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "全ての展覧会に入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "whole_facility_admission"
        ],
        "official_wording": {
          "ja": "全ての展覧会に入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "2": {
    "facility_no": "2",
    "name_ja": "上野の森美術館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 7
    },
    "official_clauses": [
      {
        "label_ja": "割引",
        "wording_ja": "企画展割引‥一般料金の100円引"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "discount_fixed",
        "scopes": [
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "企画展割引‥一般料金の100円引"
        },
        "interprets_ja": null,
        "price_mode": "exhibition_variable",
        "regular_price_yen": null,
        "saving_yen": 100,
        "discount_rate": null,
        "price_source": {
          "label": "Grutto Pass 2026 official brochure extraction",
          "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
          "checked_at": "2026-08-14"
        }
      }
    ],
    "comparable_value_yen": 100,
    "value_basis": {
      "benefit_index": 0,
      "benefit_type": "discount_fixed",
      "scope": "temporary_exhibition",
      "regular_price_yen": null,
      "derivation": "fixed discount amount stated by the Pass source"
    },
    "verification_status": "priced"
  },
  "3": {
    "facility_no": "3",
    "name_ja": "国立西洋美術館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 7
    },
    "official_clauses": [
      {
        "label_ja": "割引",
        "wording_ja": "常設展割引‥一般料金の100円引"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "discount_fixed",
        "scopes": [
          "permanent_collection"
        ],
        "official_wording": {
          "ja": "常設展割引‥一般料金の100円引"
        },
        "interprets_ja": null,
        "price_mode": "fixed",
        "regular_price_yen": 500,
        "saving_yen": 100,
        "discount_rate": null,
        "price_source": {
          "label": "facility official website",
          "url": "https://www.nmwa.go.jp/jp/visit/",
          "checked_at": "2026-08-14"
        }
      }
    ],
    "comparable_value_yen": 100,
    "value_basis": {
      "benefit_index": 0,
      "benefit_type": "discount_fixed",
      "scope": "permanent_collection",
      "regular_price_yen": 500,
      "derivation": "fixed discount amount stated by the Pass source"
    },
    "verification_status": "priced"
  },
  "4": {
    "facility_no": "4",
    "name_ja": "国立科学博物館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 7
    },
    "official_clauses": [
      {
        "label_ja": "割引",
        "wording_ja": "常設展示・企画展割引‥一般・大学生100円引"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "discount_fixed",
        "scopes": [
          "permanent_collection",
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "常設展示・企画展割引‥一般・大学生100円引"
        },
        "interprets_ja": null,
        "price_mode": "current_fixed_but_may_change",
        "regular_price_yen": 630,
        "saving_yen": 100,
        "discount_rate": null,
        "price_source": {
          "label": "Grutto Pass 2026 official brochure extraction",
          "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
          "checked_at": "2026-08-14"
        }
      }
    ],
    "comparable_value_yen": 100,
    "value_basis": {
      "benefit_index": 0,
      "benefit_type": "discount_fixed",
      "scope": "permanent_collection",
      "regular_price_yen": 630,
      "derivation": "fixed discount amount stated by the Pass source"
    },
    "verification_status": "priced"
  },
  "5": {
    "facility_no": "5",
    "name_ja": "東京国立博物館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 7
    },
    "official_clauses": [
      {
        "label_ja": "割引",
        "wording_ja": "東博コレクション展割引‥一般料金の100円引"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "discount_fixed",
        "scopes": [
          "collection"
        ],
        "official_wording": {
          "ja": "東博コレクション展割引‥一般料金の100円引"
        },
        "interprets_ja": null,
        "price_mode": "fixed",
        "regular_price_yen": 1000,
        "saving_yen": 100,
        "discount_rate": null,
        "price_source": {
          "label": "facility official website",
          "url": "https://www.tnm.jp/modules/r_free_page/index.php?id=113",
          "checked_at": "2026-08-14"
        }
      }
    ],
    "comparable_value_yen": 100,
    "value_basis": {
      "benefit_index": 0,
      "benefit_type": "discount_fixed",
      "scope": "collection",
      "regular_price_yen": 1000,
      "derivation": "fixed discount amount stated by the Pass source"
    },
    "verification_status": "priced"
  },
  "6": {
    "facility_no": "6",
    "name_ja": "台東区立旧東京音楽学校奏楽堂",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 7
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "常設展・企画展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "permanent_collection",
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "常設展・企画展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "7": {
    "facility_no": "7",
    "name_ja": "東京都美術館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 7
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "対象となる展覧会はHP等でご確認ください。"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "unknown"
        ],
        "official_wording": {
          "ja": "対象となる展覧会はHP等でご確認ください。"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "8": {
    "facility_no": "8",
    "name_ja": "恩賜上野動物園",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 7
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "whole_facility_admission"
        ],
        "official_wording": {
          "ja": "入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "9": {
    "facility_no": "9",
    "name_ja": "東京藝術大学大学美術館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 7
    },
    "official_clauses": [
      {
        "label_ja": "割引",
        "wording_ja": "一般料金の200円引"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "discount_fixed",
        "scopes": [
          "unknown"
        ],
        "official_wording": {
          "ja": "一般料金の200円引"
        },
        "interprets_ja": null,
        "price_mode": "exhibition_variable",
        "regular_price_yen": null,
        "saving_yen": 200,
        "discount_rate": null,
        "price_source": {
          "label": "Grutto Pass 2026 official brochure extraction",
          "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
          "checked_at": "2026-08-14"
        }
      }
    ],
    "comparable_value_yen": 200,
    "value_basis": {
      "benefit_index": 0,
      "benefit_type": "discount_fixed",
      "scope": "unknown",
      "regular_price_yen": null,
      "derivation": "fixed discount amount stated by the Pass source"
    },
    "verification_status": "priced"
  },
  "10": {
    "facility_no": "10",
    "name_ja": "旧岩崎邸庭園",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 7
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "通常時間内適用"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "unknown"
        ],
        "official_wording": {
          "ja": "通常時間内適用"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "11": {
    "facility_no": "11",
    "name_ja": "台東区立朝倉彫塑館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 7
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "全ての展覧会に入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "whole_facility_admission"
        ],
        "official_wording": {
          "ja": "全ての展覧会に入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "12": {
    "facility_no": "12",
    "name_ja": "台東区立書道博物館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 7
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "全ての展覧会に入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "whole_facility_admission"
        ],
        "official_wording": {
          "ja": "全ての展覧会に入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "13": {
    "facility_no": "13",
    "name_ja": "台東区立一葉記念館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 7
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "全ての展覧会に入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "whole_facility_admission"
        ],
        "official_wording": {
          "ja": "全ての展覧会に入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "14": {
    "facility_no": "14",
    "name_ja": "石洞美術館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 8
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "企画展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "企画展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "15": {
    "facility_no": "15",
    "name_ja": "文京区立森鷗外記念館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 8
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "全ての展覧会に入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "whole_facility_admission"
        ],
        "official_wording": {
          "ja": "全ての展覧会に入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "16": {
    "facility_no": "16",
    "name_ja": "向島百花園",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 8
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "通常時間内適用"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "unknown"
        ],
        "official_wording": {
          "ja": "通常時間内適用"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "17": {
    "facility_no": "17",
    "name_ja": "ミュゼ浜口陽三・ヤマサコレクション",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 8
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "全ての展覧会に入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "whole_facility_admission"
        ],
        "official_wording": {
          "ja": "全ての展覧会に入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "18": {
    "facility_no": "18",
    "name_ja": "三井記念美術館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 9
    },
    "official_clauses": [
      {
        "label_ja": "割引",
        "wording_ja": "企画展・特別展割引‥一般料金の300円引"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "discount_fixed",
        "scopes": [
          "temporary_exhibition",
          "special_exhibition"
        ],
        "official_wording": {
          "ja": "企画展・特別展割引‥一般料金の300円引"
        },
        "interprets_ja": null,
        "price_mode": "current_fixed_but_may_change",
        "regular_price_yen": 1200,
        "saving_yen": 300,
        "discount_rate": null,
        "price_source": {
          "label": "Grutto Pass 2026 official brochure extraction",
          "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
          "checked_at": "2026-08-14"
        }
      }
    ],
    "comparable_value_yen": 300,
    "value_basis": {
      "benefit_index": 0,
      "benefit_type": "discount_fixed",
      "scope": "temporary_exhibition",
      "regular_price_yen": 1200,
      "derivation": "fixed discount amount stated by the Pass source"
    },
    "verification_status": "priced"
  },
  "19": {
    "facility_no": "19",
    "name_ja": "国立映画アーカイブ",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 9
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "常設展・企画展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "permanent_collection",
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "常設展・企画展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "20": {
    "facility_no": "20",
    "name_ja": "静嘉堂文庫美術館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 9
    },
    "official_clauses": [
      {
        "label_ja": "割引",
        "wording_ja": "企画展割引‥一般料金の200円引"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "discount_fixed",
        "scopes": [
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "企画展割引‥一般料金の200円引"
        },
        "interprets_ja": null,
        "price_mode": "current_fixed_but_may_change",
        "regular_price_yen": 1500,
        "saving_yen": 200,
        "discount_rate": null,
        "price_source": {
          "label": "Grutto Pass 2026 official brochure extraction",
          "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
          "checked_at": "2026-08-14"
        }
      }
    ],
    "comparable_value_yen": 200,
    "value_basis": {
      "benefit_index": 0,
      "benefit_type": "discount_fixed",
      "scope": "temporary_exhibition",
      "regular_price_yen": 1500,
      "derivation": "fixed discount amount stated by the Pass source"
    },
    "verification_status": "priced"
  },
  "21": {
    "facility_no": "21",
    "name_ja": "小石川後楽園",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 9
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "通常時間内適用"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "unknown"
        ],
        "official_wording": {
          "ja": "通常時間内適用"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "22": {
    "facility_no": "22",
    "name_ja": "野球殿堂博物館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 9
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "常設展・企画展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "permanent_collection",
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "常設展・企画展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "23": {
    "facility_no": "23",
    "name_ja": "印刷博物館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 9
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "常設展・企画展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "permanent_collection",
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "常設展・企画展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "24": {
    "facility_no": "24",
    "name_ja": "日本カメラ博物館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 9
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "whole_facility_admission"
        ],
        "official_wording": {
          "ja": "入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "25": {
    "facility_no": "25",
    "name_ja": "昭和館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 9
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "常設展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "permanent_collection"
        ],
        "official_wording": {
          "ja": "常設展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "26": {
    "facility_no": "26",
    "name_ja": "科学技術館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 9
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "常設展・企画展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "permanent_collection",
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "常設展・企画展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "27": {
    "facility_no": "27",
    "name_ja": "東京国立近代美術館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 10
    },
    "official_clauses": [
      {
        "label_ja": "割引",
        "wording_ja": "所蔵作品展割引‥ 一般料金の100円引"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "discount_fixed",
        "scopes": [
          "collection"
        ],
        "official_wording": {
          "ja": "所蔵作品展割引‥ 一般料金の100円引"
        },
        "interprets_ja": null,
        "price_mode": "current_fixed_but_may_change",
        "regular_price_yen": 500,
        "saving_yen": 100,
        "discount_rate": null,
        "price_source": {
          "label": "Grutto Pass 2026 official brochure extraction",
          "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
          "checked_at": "2026-08-14"
        }
      }
    ],
    "comparable_value_yen": 100,
    "value_basis": {
      "benefit_index": 0,
      "benefit_type": "discount_fixed",
      "scope": "collection",
      "regular_price_yen": 500,
      "derivation": "fixed discount amount stated by the Pass source"
    },
    "verification_status": "priced"
  },
  "28": {
    "facility_no": "28",
    "name_ja": "パナソニック汐留美術館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 10
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "企画展、ルオー・ギャラリー入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "企画展、ルオー・ギャラリー入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "29": {
    "facility_no": "29",
    "name_ja": "お茶の文化創造博物館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 10
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "whole_facility_admission"
        ],
        "official_wording": {
          "ja": "入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "30": {
    "facility_no": "30",
    "name_ja": "浜離宮恩賜庭園",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 10
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "通常時間内適用"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "unknown"
        ],
        "official_wording": {
          "ja": "通常時間内適用"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "31": {
    "facility_no": "31",
    "name_ja": "旧芝離宮恩賜庭園",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 10
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "通常時間内適用"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "unknown"
        ],
        "official_wording": {
          "ja": "通常時間内適用"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "33": {
    "facility_no": "33",
    "name_ja": "大倉集古館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 10
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "企画展・特別展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "special_exhibition",
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "企画展・特別展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "34": {
    "facility_no": "34",
    "name_ja": "菊池寛実記念 智美術館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 11
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "企画展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "企画展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "35": {
    "facility_no": "35",
    "name_ja": "泉屋博古館東京",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 11
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "企画展・特別展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "special_exhibition",
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "企画展・特別展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "36": {
    "facility_no": "36",
    "name_ja": "東京シティビュー",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 11
    },
    "official_clauses": [
      {
        "label_ja": "割引",
        "wording_ja": "入館割引‥一般料金の200円引"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "discount_fixed",
        "scopes": [
          "whole_facility_admission"
        ],
        "official_wording": {
          "ja": "入館割引‥一般料金の200円引"
        },
        "interprets_ja": null,
        "price_mode": "exhibition_variable",
        "regular_price_yen": null,
        "saving_yen": 200,
        "discount_rate": null,
        "price_source": {
          "label": "Grutto Pass 2026 official brochure extraction",
          "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
          "checked_at": "2026-08-14"
        }
      }
    ],
    "comparable_value_yen": 200,
    "value_basis": {
      "benefit_index": 0,
      "benefit_type": "discount_fixed",
      "scope": "whole_facility_admission",
      "regular_price_yen": null,
      "derivation": "fixed discount amount stated by the Pass source"
    },
    "verification_status": "priced"
  },
  "37": {
    "facility_no": "37",
    "name_ja": "渋谷区立松濤美術館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 11
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "特別展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "special_exhibition"
        ],
        "official_wording": {
          "ja": "特別展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "38": {
    "facility_no": "38",
    "name_ja": "戸栗美術館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 11
    },
    "official_clauses": [
      {
        "label_ja": "割引",
        "wording_ja": "企画展割引‥一般料金の200円引"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "discount_fixed",
        "scopes": [
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "企画展割引‥一般料金の200円引"
        },
        "interprets_ja": null,
        "price_mode": "exhibition_variable",
        "regular_price_yen": null,
        "saving_yen": 200,
        "discount_rate": null,
        "price_source": {
          "label": "Grutto Pass 2026 official brochure extraction",
          "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
          "checked_at": "2026-08-14"
        }
      }
    ],
    "comparable_value_yen": 200,
    "value_basis": {
      "benefit_index": 0,
      "benefit_type": "discount_fixed",
      "scope": "temporary_exhibition",
      "regular_price_yen": null,
      "derivation": "fixed discount amount stated by the Pass source"
    },
    "verification_status": "priced"
  },
  "39": {
    "facility_no": "39",
    "name_ja": "山種美術館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 11
    },
    "official_clauses": [
      {
        "label_ja": "割引",
        "wording_ja": "企画展・特別展割引‥一般当日料金の200円引"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "discount_fixed",
        "scopes": [
          "temporary_exhibition",
          "special_exhibition"
        ],
        "official_wording": {
          "ja": "企画展・特別展割引‥一般当日料金の200円引"
        },
        "interprets_ja": null,
        "price_mode": "exhibition_variable",
        "regular_price_yen": null,
        "saving_yen": 200,
        "discount_rate": null,
        "price_source": {
          "label": "Grutto Pass 2026 official brochure extraction",
          "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
          "checked_at": "2026-08-14"
        }
      }
    ],
    "comparable_value_yen": 200,
    "value_basis": {
      "benefit_index": 0,
      "benefit_type": "discount_fixed",
      "scope": "temporary_exhibition",
      "regular_price_yen": null,
      "derivation": "fixed discount amount stated by the Pass source"
    },
    "verification_status": "priced"
  },
  "40": {
    "facility_no": "40",
    "name_ja": "東京都写真美術館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 11
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "対象となる展覧会はHP等でご確認ください。"
      },
      {
        "label_ja": "割引",
        "wording_ja": "企画展割引‥一般料金の団体割引相当額"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "unknown"
        ],
        "official_wording": {
          "ja": "対象となる展覧会はHP等でご確認ください。"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      },
      {
        "clause_index": 1,
        "type": "discount_to_group_rate",
        "scopes": [
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "企画展割引‥一般料金の団体割引相当額"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "41": {
    "facility_no": "41",
    "name_ja": "松岡美術館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 11
    },
    "official_clauses": [
      {
        "label_ja": "割引",
        "wording_ja": "常設展・企画展割引‥各料金の50％引"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "discount_percent",
        "scopes": [
          "permanent_collection",
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "常設展・企画展割引‥各料金の50％引"
        },
        "interprets_ja": null,
        "price_mode": "current_fixed_but_may_change",
        "regular_price_yen": 1400,
        "saving_yen": 700,
        "discount_rate": 0.5,
        "price_source": {
          "label": "facility official website",
          "url": "https://www.matsuoka-museum.jp/information/",
          "checked_at": "2026-08-14"
        }
      }
    ],
    "comparable_value_yen": 700,
    "value_basis": {
      "benefit_index": 0,
      "benefit_type": "discount_percent",
      "scope": "permanent_collection",
      "regular_price_yen": 1400,
      "derivation": "50% of the published price for this scope"
    },
    "verification_status": "priced"
  },
  "42": {
    "facility_no": "42",
    "name_ja": "港区立郷土歴史館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 11
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "常設展・企画展・特別展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "permanent_collection",
          "special_exhibition",
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "常設展・企画展・特別展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "43": {
    "facility_no": "43",
    "name_ja": "国立科学博物館附属自然教育園",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 11
    },
    "official_clauses": [
      {
        "label_ja": "割引",
        "wording_ja": "入園割引‥一般料金の100円引"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "discount_fixed",
        "scopes": [
          "whole_facility_admission"
        ],
        "official_wording": {
          "ja": "入園割引‥一般料金の100円引"
        },
        "interprets_ja": null,
        "price_mode": "current_fixed_but_may_change",
        "regular_price_yen": 320,
        "saving_yen": 100,
        "discount_rate": null,
        "price_source": {
          "label": "Grutto Pass 2026 official brochure extraction",
          "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
          "checked_at": "2026-08-14"
        }
      }
    ],
    "comparable_value_yen": 100,
    "value_basis": {
      "benefit_index": 0,
      "benefit_type": "discount_fixed",
      "scope": "whole_facility_admission",
      "regular_price_yen": 320,
      "derivation": "fixed discount amount stated by the Pass source"
    },
    "verification_status": "priced"
  },
  "44": {
    "facility_no": "44",
    "name_ja": "東京都庭園美術館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 11
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "建物公開展、庭園入場"
      },
      {
        "label_ja": "割引",
        "wording_ja": "企画展割引‥一般料金の団体割引相当額"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "garden"
        ],
        "official_wording": {
          "ja": "建物公開展、庭園入場"
        },
        "interprets_ja": "庭園入場",
        "price_mode": "fixed",
        "regular_price_yen": 200,
        "saving_yen": 200,
        "discount_rate": null,
        "price_source": {
          "label": "facility official website",
          "url": "https://www.teien-art-museum.ne.jp/visit/ticket/",
          "checked_at": "2026-08-14"
        }
      },
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "named_exhibition"
        ],
        "official_wording": {
          "ja": "建物公開展、庭園入場"
        },
        "interprets_ja": "建物公開展",
        "price_mode": "exhibition_variable",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      },
      {
        "clause_index": 1,
        "type": "discount_to_group_rate",
        "scopes": [
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "企画展割引‥一般料金の団体割引相当額"
        },
        "interprets_ja": null,
        "price_mode": "exhibition_variable",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": 200,
    "value_basis": {
      "benefit_index": 0,
      "benefit_type": "admission",
      "scope": "garden",
      "regular_price_yen": 200,
      "derivation": "free admission at the published price for this scope"
    },
    "verification_status": "priced"
  },
  "45": {
    "facility_no": "45",
    "name_ja": "目黒区美術館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 12
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "企画展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "企画展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "46": {
    "facility_no": "46",
    "name_ja": "郷さくら美術館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 12
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "全ての展覧会に入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "whole_facility_admission"
        ],
        "official_wording": {
          "ja": "全ての展覧会に入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "47": {
    "facility_no": "47",
    "name_ja": "アクセサリーミュージアム",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 12
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "常設展・企画展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "permanent_collection",
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "常設展・企画展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "48": {
    "facility_no": "48",
    "name_ja": "五島美術館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 12
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "企画展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "企画展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "49": {
    "facility_no": "49",
    "name_ja": "長谷川町子美術館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 12
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "長谷川町子記念館にも入場できます。"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "unknown"
        ],
        "official_wording": {
          "ja": "長谷川町子記念館にも入場できます。"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "50": {
    "facility_no": "50",
    "name_ja": "世田谷文学館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 12
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "コレクション展入場"
      },
      {
        "label_ja": "割引",
        "wording_ja": "企画展割引‥一般料金の団体割引相当額"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "collection"
        ],
        "official_wording": {
          "ja": "コレクション展入場"
        },
        "interprets_ja": null,
        "price_mode": "fixed",
        "regular_price_yen": 220,
        "saving_yen": 220,
        "discount_rate": null,
        "price_source": {
          "label": "facility official website",
          "url": "https://www.setabun.or.jp/outline/",
          "checked_at": "2026-08-14"
        }
      },
      {
        "clause_index": 1,
        "type": "discount_to_group_rate",
        "scopes": [
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "企画展割引‥一般料金の団体割引相当額"
        },
        "interprets_ja": null,
        "price_mode": "exhibition_variable",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": 220,
    "value_basis": {
      "benefit_index": 0,
      "benefit_type": "admission",
      "scope": "collection",
      "regular_price_yen": 220,
      "derivation": "free admission at the published price for this scope"
    },
    "verification_status": "priced"
  },
  "51": {
    "facility_no": "51",
    "name_ja": "世田谷美術館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 12
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "コレクション展入場"
      },
      {
        "label_ja": "割引",
        "wording_ja": "企画展割引‥一般料金の団体割引相当額"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "collection"
        ],
        "official_wording": {
          "ja": "コレクション展入場"
        },
        "interprets_ja": null,
        "price_mode": "fixed",
        "regular_price_yen": 220,
        "saving_yen": 220,
        "discount_rate": null,
        "price_source": {
          "label": "facility official website",
          "url": "https://www.setagayaartmuseum.or.jp/guide/open/",
          "checked_at": "2026-08-14"
        }
      },
      {
        "clause_index": 1,
        "type": "discount_to_group_rate",
        "scopes": [
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "企画展割引‥一般料金の団体割引相当額"
        },
        "interprets_ja": null,
        "price_mode": "exhibition_variable",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": 220,
    "value_basis": {
      "benefit_index": 0,
      "benefit_type": "admission",
      "scope": "collection",
      "regular_price_yen": 220,
      "derivation": "free admission at the published price for this scope"
    },
    "verification_status": "priced"
  },
  "52": {
    "facility_no": "52",
    "name_ja": "新宿区立漱石山房記念館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 13
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "全ての展覧会に入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "whole_facility_admission"
        ],
        "official_wording": {
          "ja": "全ての展覧会に入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "53": {
    "facility_no": "53",
    "name_ja": "新宿区立新宿歴史博物館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 13
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "常設展・特別展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "permanent_collection",
          "special_exhibition"
        ],
        "official_wording": {
          "ja": "常設展・特別展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "54": {
    "facility_no": "54",
    "name_ja": "文化学園服飾博物館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 13
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "企画展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "企画展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "55": {
    "facility_no": "55",
    "name_ja": "日本オリンピックミュージアム",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 13
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "常設展・企画展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "permanent_collection",
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "常設展・企画展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "56": {
    "facility_no": "56",
    "name_ja": "古賀政男音楽博物館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 13
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "常設展・企画展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "permanent_collection",
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "常設展・企画展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "57": {
    "facility_no": "57",
    "name_ja": "東京オペラシティ アートギャラリー",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 13
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "企画展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "企画展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "59": {
    "facility_no": "59",
    "name_ja": "新宿区立林芙美子記念館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 14
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "whole_facility_admission"
        ],
        "official_wording": {
          "ja": "入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "60": {
    "facility_no": "60",
    "name_ja": "ちひろ美術館・東京",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 14
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "全ての展覧会に入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "whole_facility_admission"
        ],
        "official_wording": {
          "ja": "全ての展覧会に入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "61": {
    "facility_no": "61",
    "name_ja": "豊島区立熊谷守一美術館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 14
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "企画展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "企画展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "62": {
    "facility_no": "62",
    "name_ja": "永青文庫",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 14
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "whole_facility_admission"
        ],
        "official_wording": {
          "ja": "入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "63": {
    "facility_no": "63",
    "name_ja": "古代オリエント博物館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 14
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "館蔵品展・特別展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "special_exhibition"
        ],
        "official_wording": {
          "ja": "館蔵品展・特別展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "64": {
    "facility_no": "64",
    "name_ja": "紙の博物館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 14
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "全ての展覧会に入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "whole_facility_admission"
        ],
        "official_wording": {
          "ja": "全ての展覧会に入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "65": {
    "facility_no": "65",
    "name_ja": "渋沢史料館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 14
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "whole_facility_admission"
        ],
        "official_wording": {
          "ja": "入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "66": {
    "facility_no": "66",
    "name_ja": "旧古河庭園",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 14
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "通常時間内適用"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "unknown"
        ],
        "official_wording": {
          "ja": "通常時間内適用"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "67": {
    "facility_no": "67",
    "name_ja": "六義園",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 14
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "通常時間内適用"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "unknown"
        ],
        "official_wording": {
          "ja": "通常時間内適用"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "68": {
    "facility_no": "68",
    "name_ja": "東洋文庫ミュージアム",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 14
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "企画展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "企画展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "69": {
    "facility_no": "69",
    "name_ja": "たばこと塩の博物館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 15
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "常設展・特別展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "permanent_collection",
          "special_exhibition"
        ],
        "official_wording": {
          "ja": "常設展・特別展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "70": {
    "facility_no": "70",
    "name_ja": "すみだ北斎美術館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 15
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "『北斎を学ぶ部屋』入場"
      },
      {
        "label_ja": "割引",
        "wording_ja": "企画展割引‥一般料金の20％引"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "named_exhibition"
        ],
        "official_wording": {
          "ja": "『北斎を学ぶ部屋』入場"
        },
        "interprets_ja": null,
        "price_mode": "fixed",
        "regular_price_yen": 400,
        "saving_yen": 400,
        "discount_rate": null,
        "price_source": {
          "label": "facility official website",
          "url": "https://hokusai-museum.jp/modules/Page/pages/view/1111",
          "checked_at": "2026-08-14"
        }
      },
      {
        "clause_index": 1,
        "type": "discount_percent",
        "scopes": [
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "企画展割引‥一般料金の20％引"
        },
        "interprets_ja": null,
        "price_mode": "exhibition_variable",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": 0.2,
        "price_source": null
      }
    ],
    "comparable_value_yen": 400,
    "value_basis": {
      "benefit_index": 0,
      "benefit_type": "admission",
      "scope": "named_exhibition",
      "regular_price_yen": 400,
      "derivation": "free admission at the published price for this scope"
    },
    "verification_status": "priced"
  },
  "71": {
    "facility_no": "71",
    "name_ja": "東京都江戸東京博物館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 15
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "常設展入場"
      },
      {
        "label_ja": "割引",
        "wording_ja": "特別展‥一般料金の20%引"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "permanent_collection"
        ],
        "official_wording": {
          "ja": "常設展入場"
        },
        "interprets_ja": null,
        "price_mode": "fixed",
        "regular_price_yen": 800,
        "saving_yen": 800,
        "discount_rate": null,
        "price_source": {
          "label": "facility official website",
          "url": "https://www.edo-tokyo-museum.or.jp/information/guide/",
          "checked_at": "2026-08-14"
        }
      },
      {
        "clause_index": 1,
        "type": "discount_percent",
        "scopes": [
          "special_exhibition"
        ],
        "official_wording": {
          "ja": "特別展‥一般料金の20%引"
        },
        "interprets_ja": null,
        "price_mode": "exhibition_variable",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": 0.2,
        "price_source": null
      }
    ],
    "comparable_value_yen": 800,
    "value_basis": {
      "benefit_index": 0,
      "benefit_type": "admission",
      "scope": "permanent_collection",
      "regular_price_yen": 800,
      "derivation": "free admission at the published price for this scope"
    },
    "verification_status": "priced"
  },
  "72": {
    "facility_no": "72",
    "name_ja": "江東区芭蕉記念館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 15
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "常設展・企画展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "permanent_collection",
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "常設展・企画展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "73": {
    "facility_no": "73",
    "name_ja": "清澄庭園",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 15
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "通常時間内適用"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "unknown"
        ],
        "official_wording": {
          "ja": "通常時間内適用"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "74": {
    "facility_no": "74",
    "name_ja": "東京都現代美術館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 15
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "MOTコレクション入場"
      },
      {
        "label_ja": "割引",
        "wording_ja": "企画展割引‥一般料金の団体割引相当額"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "collection"
        ],
        "official_wording": {
          "ja": "MOTコレクション入場"
        },
        "interprets_ja": null,
        "price_mode": "fixed",
        "regular_price_yen": 500,
        "saving_yen": 500,
        "discount_rate": null,
        "price_source": {
          "label": "facility official website",
          "url": "https://www.mot-art-museum.jp/guide/museum-info/",
          "checked_at": "2026-08-14"
        }
      },
      {
        "clause_index": 1,
        "type": "discount_to_group_rate",
        "scopes": [
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "企画展割引‥一般料金の団体割引相当額"
        },
        "interprets_ja": null,
        "price_mode": "exhibition_variable",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": 500,
    "value_basis": {
      "benefit_index": 0,
      "benefit_type": "admission",
      "scope": "collection",
      "regular_price_yen": 500,
      "derivation": "free admission at the published price for this scope"
    },
    "verification_status": "priced",
    "notes_ja": [
      "一部割引対象外の展示があります。"
    ]
  },
  "75": {
    "facility_no": "75",
    "name_ja": "江東区深川江戸資料館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 15
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "常設展・特別展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "permanent_collection",
          "special_exhibition"
        ],
        "official_wording": {
          "ja": "常設展・特別展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "76": {
    "facility_no": "76",
    "name_ja": "江東区中川船番所資料館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 16
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "常設展・企画展・特別展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "permanent_collection",
          "special_exhibition",
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "常設展・企画展・特別展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "77": {
    "facility_no": "77",
    "name_ja": "地下鉄博物館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 16
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "常設展・特別展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "permanent_collection",
          "special_exhibition"
        ],
        "official_wording": {
          "ja": "常設展・特別展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "78": {
    "facility_no": "78",
    "name_ja": "葛西臨海水族園",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 16
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "whole_facility_admission"
        ],
        "official_wording": {
          "ja": "入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "79": {
    "facility_no": "79",
    "name_ja": "夢の島熱帯植物館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 16
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "whole_facility_admission"
        ],
        "official_wording": {
          "ja": "入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "80": {
    "facility_no": "80",
    "name_ja": "日本科学未来館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 16
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "常設展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "permanent_collection"
        ],
        "official_wording": {
          "ja": "常設展入場"
        },
        "interprets_ja": null,
        "price_mode": "fixed",
        "regular_price_yen": 630,
        "saving_yen": 630,
        "discount_rate": null,
        "price_source": {
          "label": "facility official website",
          "url": "https://www.miraikan.jst.go.jp/visit/admission/",
          "checked_at": "2026-08-14"
        }
      }
    ],
    "comparable_value_yen": 630,
    "value_basis": {
      "benefit_index": 0,
      "benefit_type": "admission",
      "scope": "permanent_collection",
      "regular_price_yen": 630,
      "derivation": "free admission at the published price for this scope"
    },
    "verification_status": "priced"
  },
  "81": {
    "facility_no": "81",
    "name_ja": "武蔵野市立吉祥寺美術館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 16
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "常設展・企画展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "permanent_collection",
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "常設展・企画展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "82": {
    "facility_no": "82",
    "name_ja": "井の頭自然文化園",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 17
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "whole_facility_admission"
        ],
        "official_wording": {
          "ja": "入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "83": {
    "facility_no": "83",
    "name_ja": "三鷹市美術ギャラリー",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 17
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "企画展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "企画展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "84": {
    "facility_no": "84",
    "name_ja": "三鷹市山本有三記念館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 17
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "常設展・企画展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "permanent_collection",
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "常設展・企画展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "85": {
    "facility_no": "85",
    "name_ja": "三鷹市吉村昭書斎",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 17
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "whole_facility_admission"
        ],
        "official_wording": {
          "ja": "入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "86": {
    "facility_no": "86",
    "name_ja": "調布市武者小路実篤記念館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 17
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "全ての展覧会に入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "whole_facility_admission"
        ],
        "official_wording": {
          "ja": "全ての展覧会に入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "87": {
    "facility_no": "87",
    "name_ja": "神代植物公園",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 17
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "whole_facility_admission"
        ],
        "official_wording": {
          "ja": "入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "88": {
    "facility_no": "88",
    "name_ja": "府中市美術館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 17
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "コレクション展・企画展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "collection",
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "コレクション展・企画展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "89": {
    "facility_no": "89",
    "name_ja": "府中市郷土の森博物館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 17
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "常設展・企画展・特別展入場、プラネタリウム観覧（特別投映を除く）"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "permanent_collection",
          "special_exhibition",
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "常設展・企画展・特別展入場、プラネタリウム観覧（特別投映を除く）"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "90": {
    "facility_no": "90",
    "name_ja": "多摩六都科学館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 17
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "常設展・企画展に加えプラネタリウムまたは大型映像のいずれか１回を観覧できます"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "permanent_collection",
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "常設展・企画展に加えプラネタリウムまたは大型映像のいずれか１回を観覧できます"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "91": {
    "facility_no": "91",
    "name_ja": "江戸東京たてもの園",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 17
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "whole_facility_admission"
        ],
        "official_wording": {
          "ja": "入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "92": {
    "facility_no": "92",
    "name_ja": "小平市平櫛田中彫刻美術館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 17
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "全ての展覧会に入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "whole_facility_admission"
        ],
        "official_wording": {
          "ja": "全ての展覧会に入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "93": {
    "facility_no": "93",
    "name_ja": "殿ヶ谷戸庭園",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 17
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "通常時間内適用"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "unknown"
        ],
        "official_wording": {
          "ja": "通常時間内適用"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "94": {
    "facility_no": "94",
    "name_ja": "たましん美術館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 18
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "whole_facility_admission"
        ],
        "official_wording": {
          "ja": "入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "95": {
    "facility_no": "95",
    "name_ja": "多摩動物公園",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 18
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "whole_facility_admission"
        ],
        "official_wording": {
          "ja": "入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "96": {
    "facility_no": "96",
    "name_ja": "八王子市夢美術館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 18
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "常設展・企画展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "permanent_collection",
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "常設展・企画展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "97": {
    "facility_no": "97",
    "name_ja": "東京富士美術館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 18
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "館蔵品展・特別展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "special_exhibition"
        ],
        "official_wording": {
          "ja": "館蔵品展・特別展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "98": {
    "facility_no": "98",
    "name_ja": "青梅市吉川英治記念館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 18
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "whole_facility_admission"
        ],
        "official_wording": {
          "ja": "入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "99": {
    "facility_no": "99",
    "name_ja": "町田市立国際版画美術館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 18
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "企画展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "企画展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "100": {
    "facility_no": "100",
    "name_ja": "そごう美術館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 19
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "企画展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "企画展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "101": {
    "facility_no": "101",
    "name_ja": "帆船日本丸/横浜みなと博物館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 19
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "帆船日本丸・博物館・常設展・企画展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "permanent_collection",
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "帆船日本丸・博物館・常設展・企画展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "102": {
    "facility_no": "102",
    "name_ja": "神奈川県立歴史博物館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 19
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "常設展入場"
      },
      {
        "label_ja": "割引",
        "wording_ja": "特別展割引‥一般料金の団体割引相当額"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "permanent_collection"
        ],
        "official_wording": {
          "ja": "常設展入場"
        },
        "interprets_ja": null,
        "price_mode": "fixed",
        "regular_price_yen": 300,
        "saving_yen": 300,
        "discount_rate": null,
        "price_source": {
          "label": "facility official website",
          "url": "https://ch.kanagawa-museum.jp/guide",
          "checked_at": "2026-08-14"
        }
      },
      {
        "clause_index": 1,
        "type": "discount_to_group_rate",
        "scopes": [
          "special_exhibition"
        ],
        "official_wording": {
          "ja": "特別展割引‥一般料金の団体割引相当額"
        },
        "interprets_ja": null,
        "price_mode": "exhibition_variable",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": 300,
    "value_basis": {
      "benefit_index": 0,
      "benefit_type": "admission",
      "scope": "permanent_collection",
      "regular_price_yen": 300,
      "derivation": "free admission at the published price for this scope"
    },
    "verification_status": "priced"
  },
  "103": {
    "facility_no": "103",
    "name_ja": "横浜都市発展記念館 / 横浜ユーラシア文化館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 19
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "常設展・企画展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "permanent_collection",
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "常設展・企画展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "104": {
    "facility_no": "104",
    "name_ja": "横浜開港資料館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 19
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "常設展・特別公開入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "permanent_collection"
        ],
        "official_wording": {
          "ja": "常設展・特別公開入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "105": {
    "facility_no": "105",
    "name_ja": "千葉市美術館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 19
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "常設展入場"
      },
      {
        "label_ja": "割引",
        "wording_ja": "企画展割引‥一般料金の50％引"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "permanent_collection"
        ],
        "official_wording": {
          "ja": "常設展入場"
        },
        "interprets_ja": null,
        "price_mode": "fixed",
        "regular_price_yen": 300,
        "saving_yen": 300,
        "discount_rate": null,
        "price_source": {
          "label": "facility official website",
          "url": "https://www.ccma-net.jp/visit/general/",
          "checked_at": "2026-08-14"
        }
      },
      {
        "clause_index": 1,
        "type": "discount_percent",
        "scopes": [
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "企画展割引‥一般料金の50％引"
        },
        "interprets_ja": null,
        "price_mode": "exhibition_variable",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": 0.5,
        "price_source": null
      }
    ],
    "comparable_value_yen": 300,
    "value_basis": {
      "benefit_index": 0,
      "benefit_type": "admission",
      "scope": "permanent_collection",
      "regular_price_yen": 300,
      "derivation": "free admission at the published price for this scope"
    },
    "verification_status": "priced"
  },
  "106": {
    "facility_no": "106",
    "name_ja": "埼玉県立近代美術館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 19
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "企画展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "企画展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "107": {
    "facility_no": "107",
    "name_ja": "埼玉県立歴史と民俗の博物館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 19
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "常設展・企画展・特別展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "permanent_collection",
          "special_exhibition",
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "常設展・企画展・特別展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "32-WHAT-MUSEUM": {
    "facility_no": "32",
    "name_ja": "WHAT MUSEUM",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 10
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "企画展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "企画展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  },
  "36-2": {
    "facility_no": "36",
    "name_ja": "森美術館",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 11
    },
    "official_clauses": [
      {
        "label_ja": "割引",
        "wording_ja": "企画展割引‥一般料金の200円引"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "discount_fixed",
        "scopes": [
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "企画展割引‥一般料金の200円引"
        },
        "interprets_ja": null,
        "price_mode": "exhibition_variable",
        "regular_price_yen": null,
        "saving_yen": 200,
        "discount_rate": null,
        "price_source": {
          "label": "Grutto Pass 2026 official brochure extraction",
          "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
          "checked_at": "2026-08-14"
        }
      }
    ],
    "comparable_value_yen": 200,
    "value_basis": {
      "benefit_index": 0,
      "benefit_type": "discount_fixed",
      "scope": "temporary_exhibition",
      "regular_price_yen": null,
      "derivation": "fixed discount amount stated by the Pass source"
    },
    "verification_status": "priced",
    "notes_ja": [
      "展覧会により割引対象外となる場合があります。"
    ]
  },
  "58-NTT-ICC": {
    "facility_no": "58",
    "name_ja": "NTTインターコミュニケーションセンター [ICC]",
    "source": {
      "type": "grutto_brochure",
      "edition": "2026",
      "information_date": "2026-02",
      "url": "https://www.rekibun.or.jp/pdf/grutto/brochure_2026_01.pdf",
      "source_page": 13
    },
    "official_clauses": [
      {
        "label_ja": "入場",
        "wording_ja": "企画展入場"
      }
    ],
    "benefits": [
      {
        "clause_index": 0,
        "type": "admission",
        "scopes": [
          "temporary_exhibition"
        ],
        "official_wording": {
          "ja": "企画展入場"
        },
        "interprets_ja": null,
        "price_mode": "unknown",
        "regular_price_yen": null,
        "saving_yen": null,
        "discount_rate": null,
        "price_source": null
      }
    ],
    "comparable_value_yen": null,
    "value_basis": null,
    "verification_status": "entitlement_only"
  }
};

if (typeof window !== 'undefined') window.FACILITY_PASS_BENEFITS = FACILITY_PASS_BENEFITS;
if (typeof module !== 'undefined' && module.exports) module.exports = { FACILITY_PASS_BENEFITS };
