// Public approved-copy and structural independence contracts.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
function loadGlobal(relativePath, globalName) {
  const context = {};
  vm.createContext(context);
  vm.runInContext(
    `${fs.readFileSync(path.join(root, relativePath), 'utf8')};globalThis.__value = ${globalName};`,
    context,
    { filename: relativePath },
  );
  return context.__value;
}

const productionSummaries = loadGlobal('data/facility-summaries.js', 'FACILITY_PRODUCT_SUMMARIES');

test('museum notation and affected date ranges stay normalized in production', () => {
  const byVenue = new Map(productionSummaries.entries.map(entry => [entry.venue_key, entry]));
  const museum4 = byVenue.get('4').summary;
  assert.equal(museum4.ja, '常設展示は日本館と地球館の二棟。日本列島の自然と人の歩みを日本館が、地球の生命史と人類を地球館が扱います。360°球体映像の「シアター36〇」も楽しめます。');
  for (const language of ['ja', 'en', 'zh']) {
    assert.ok(museum4[language].includes('36〇'), `${language} must use U+3007`);
    assert.equal(museum4[language].includes('36○'), false, `${language} must not use U+25CB`);
  }

  const expectedGregorian = {
    '6': /1890年|1890/,
    '25': /1935.*1974/,
    '53': /1926.*1945.*2019/,
    '91': /(?:1940.*1960|40年代.*60年代)/,
    '104': /(?:1926.*1945|late 1920s.*mid-1940s)/,
  };
  for (const [venueKey, pattern] of Object.entries(expectedGregorian)) {
    const summary = byVenue.get(venueKey).summary;
    for (const language of ['ja', 'en', 'zh']) {
      assert.match(summary[language], pattern, `${venueKey} ${language} Gregorian notation`);
      assert.doesNotMatch(summary[language], /明治23年|昭和10年頃|昭和初期|昭和中期|平成/, `${venueKey} ${language} era notation`);
    }
  }
});

test('brochure prose is no longer reachable, or even present, at runtime', () => {
  // This started as a proof that the fallback was unreachable. It is now a
  // proof that the fallback does not exist: the 2026-08-17 decoupling moved all
  // 109 Japanese blurbs and their 218 reviewed translations out of the shipped
  // file entirely, so there is nothing left to reach.
  const summaries = loadGlobal('data/facility-summaries.js', 'FACILITY_PRODUCT_SUMMARIES');
  const brochure = loadGlobal('data/facility-brochure.js', 'FACILITY_BROCHURE');
  const covered = new Set(summaries.entries.map(entry => entry.facility_key));
  for (const facilityKey of Object.keys(brochure.cards)) {
    assert.ok(covered.has(facilityKey), `facility ${facilityKey} has no approved introduction`);
  }
  assert.equal(summaries.entries.length, 109);

  const brochureSource = fs.readFileSync(path.join(root, 'data/facility-brochure.js'), 'utf8');
  const declaration = brochureSource.slice(brochureSource.indexOf('const FACILITY_BROCHURE'));
  assert.doesNotMatch(declaration, /description(?:Ja|En|Zh)/);
  assert.doesNotMatch(indexHtml, /description(?:Ja|En|Zh)/);
  assert.doesNotMatch(indexHtml, /function brochureDescription\(/);

});

test('venue existence is structural, not "has official prose"', () => {
  // The old resolver decided which venues existed with
  // `entries.filter(entry => entry?.descriptionJa)`. That made the two No.103
  // labels depend on brochure text, so removing the text would have removed the
  // labels. Venue existence now comes from the subfacility array and nameJa.
  const brochure = loadGlobal('data/facility-brochure.js', 'FACILITY_BROCHURE');
  const combined = Object.values(brochure.cards).find(card => card.subfacilities?.length);
  assert.ok(combined, 'the combined card is gone; re-check this proof');
  assert.equal(combined.subfacilities.length, 2);
  for (const venue of combined.subfacilities) {
    assert.ok(venue.nameJa, 'a combined-card venue lost its Japanese name');
  }

  const start = indexHtml.indexOf('function getFacilityBrochureVenues(');
  assert.ok(start > 0, 'the structural venue resolver is gone');
  const resolver = indexHtml.slice(start, indexHtml.indexOf('\n}', start));
  assert.match(resolver, /Array\.isArray\(card\.subfacilities\) && card\.subfacilities\.length/);
  assert.match(resolver, /venues\.filter\(venue => venue\?\.nameJa\)/);
  assert.doesNotMatch(resolver, /description/);
});

test('a venue without approved copy renders no Introduction at all', () => {
  const start = indexHtml.indexOf('function renderFacilityBrochureInfo(');
  const body = indexHtml.slice(start, indexHtml.indexOf('\n}', start));
  assert.match(body, /approved\.length \? renderApprovedFacilitySummary\(f, approved\) : ''/);

  // And the resolver both renderers share bails out rather than reaching for
  // any other text source.
  const resolverStart = indexHtml.indexOf('function getFacilityIntroductionContent(');
  const resolver = indexHtml.slice(resolverStart, indexHtml.indexOf('\nfunction renderFacilityDiscoveryPreview(', resolverStart));
  assert.match(resolver, /if \(!resolvedApprovedEntries\.length\) return null;/);
  assert.doesNotMatch(resolver, /FACILITY_BROCHURE\.cards/);
});

test('accepted No.25 and No.28 copy keeps cross-language period and holdings scope', () => {
  const byVenue = new Map(productionSummaries.entries.map(entry => [entry.venue_key, entry.summary]));
  assert.match(byVenue.get('25').ja, /1935年頃から1974年まで/);
  assert.doesNotMatch(byVenue.get('25').ja, /昭和/);
  assert.match(byVenue.get('25').en, /from around 1935 through 1974/);
  assert.match(byVenue.get('25').zh, /1935年至1974年/);
  assert.equal(byVenue.get('28').en, 'The museum presents a varied exhibition programme, while its dedicated Rouault Gallery permanently displays selected works from a collection of about 270 works by Georges Rouault.');
});
