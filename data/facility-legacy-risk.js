// Legacy monetary risk classification — Release Blocker B.
// Accepted legacy Pass value safeguards.
//
// Keys are app facility keys whose text-parsed legacy fallback must NOT be
// shown as a yen estimate: the price is exhibition-specific, one of several
// candidate prices, or otherwise of uncertain relation to the Pass
// entitlement. The entitlement still renders; only the unreliable amount is
// withheld from the reference-value layer and from My Pass.
//
// A key absent from this map is LOW_RISK (single scope, one clearly
// identifiable adult price, no variable wording) and may show 概算.
const FACILITY_LEGACY_HIGH_RISK = {
  "7": "exhibition_price",
  "15": "granted_scope_variable",
  "23": "price_changes_on_exhibition",
  "28": "exhibition_price",
  "33": "multiple_prices",
  "35": "multiple_prices",
  "37": "exhibition_price",
  "42": "granted_scope_separate_charge",
  "45": "exhibition_price",
  "48": "temporary_only_museum",
  "52": "granted_scope_variable",
  "53": "granted_scope_variable",
  "63": "granted_scope_separate_charge",
  "81": "multiple_prices",
  "83": "exhibition_price",
  "88": "granted_scope_variable",
  "89": "bundled_separate_prices",
  "92": "granted_scope_variable",
  "94": "granted_scope_variable",
  "96": "exhibition_price",
  "97": "exhibition_price",
  "99": "exhibition_price",
  "100": "exhibition_price",
  "103": "exhibition_price",
  "104": "exhibition_price",
  "106": "exhibition_price",
  "107": "multiple_prices",
  "32-WHAT-MUSEUM": "exhibition_price",
  "58-NTT-ICC": "exhibition_price"
};

if (typeof window !== 'undefined') window.FACILITY_LEGACY_HIGH_RISK = FACILITY_LEGACY_HIGH_RISK;
if (typeof module !== 'undefined' && module.exports) module.exports = { FACILITY_LEGACY_HIGH_RISK };
