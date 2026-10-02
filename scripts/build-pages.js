'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { buildFacilitySurfaces, getBuildReferenceDate } = require('./facility-direct-url.js');

const projectRoot = path.resolve(__dirname, '..');
const canaryPreview = process.argv.includes('--canary-preview');
const outputDirArgument = process.argv.find(argument => argument.startsWith('--output-dir='));
const outputDir = outputDirArgument
  ? path.resolve(projectRoot, outputDirArgument.slice('--output-dir='.length))
  : path.join(projectRoot, canaryPreview ? '.canary-preview' : '.cloudflare-dist');
const referenceDate = getBuildReferenceDate(process.argv);

// Runtime files loaded directly by index.html plus Pages control files. Keep
// this list explicit so documentation, tests, and data-building utilities do
// not get deployed.
const rootFiles = [
  'index.html',
  '404.html',
  'facility-presentation-model.js',
  'exhibition-meta-runtime.js',
  'official-source-runtime.js',
  'pass-time-scope-runtime.js',
  'config.js',
  'coords.js',
  'map.js',
  'status.js',
  'sw.js',
  'manifest.json',
  'favicon.svg',
  'favicon-32x32.png',
  'apple-touch-icon.png',
  'THIRD-PARTY-NOTICES.md',
  'LICENSE',
  'DATA_AND_CONTENT_TERMS.md',
  'robots.txt',
];

// These directories contain runtime data, localized UI code, feature modules,
// and the self-hosted Leaflet assets used by the page.
const runtimeDirectories = [
  'i18n',
  'data',
  'phase1',
  'phase2',
  'assets',
  'vendor/leaflet',
  'vendor/leaflet.markercluster',
];

// ABOUT-001 and OWNED-GUIDE-001 are explicitly approved standalone static
// artifacts and are not part of the facility technical canary. ABOUT-001
// ownership is durable product identity/trust documentation; OWNED-GUIDE-001
// retains its separate roadmap/evidence-gated ownership. Listed as explicit
// files rather than copied directories so future unrelated files under
// `about/` or `guides/` do not ship by default.
const explicitPublicFiles = [
  'about/about.css',
  'about/about.js',
  'about/index.html',
  'about/data/index.html',
  'about/pass-tracker/index.html',
  'guides/grutto-pass-before-you-go/index.html',
  'guides/grutto-pass-before-you-go/pyoko-facility-detail-example.png',
];

// Paths that live under a runtime directory but are never loaded by the app.
// `data/review/` holds the internal verification artifacts — who checked what,
// when, and why a record was classified the way it was. Publishing them costs
// the reader nothing and hands away the reasoning behind the data set.
//
// `phase1/` and `phase2/` are runtime directories that also carry the working
// notes for their own monthly update procedure, plus the coordinate generator.
// The notes are the same kind of material as `data/review/`: `phase1-review.md`
// records which facilities are under-modelled and which judgments are still
// provisional. `build-coords.js` is a Node CLI, not browser code — it is kept in
// the repository as a development tool and simply must not be published.
const excludedPaths = [
  'data/review',
  'phase1/phase1-review.md',
  'phase1/phase1-integration.md',
  'phase2/phase2-integration.md',
  'phase2/build-coords.js',
];

// Editor and OS droppings are gitignored, so a CI build never sees them — but a
// local build does, and a local build should produce exactly what ships.
const excludedNames = new Set(['.DS_Store', 'Thumbs.db', '.gitkeep']);

function isExcluded(relativePath) {
  const normalized = relativePath.split(path.sep).join('/');
  if (excludedNames.has(path.basename(normalized))) return true;
  return excludedPaths.some(excluded => normalized === excluded || normalized.startsWith(`${excluded}/`));
}

function copyEntry(relativePath) {
  const source = path.join(projectRoot, relativePath);
  const target = path.join(outputDir, relativePath);

  if (!fs.existsSync(source)) {
    throw new Error(`Missing build input: ${relativePath}`);
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync(source, target, {
    recursive: true,
    filter: (from) => !isExcluded(path.relative(projectRoot, from))
  });
}

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

for (const file of rootFiles) copyEntry(file);
for (const directory of runtimeDirectories) copyEntry(directory);

// The standalone About pages and owned guide are production-owned static
// artifacts, not part of the facility technical canary (see docs/product-
// roadmap.md, ABOUT-001 and OWNED-GUIDE-001). The canary preview must stay
// limited to CANARY_CANDIDATES facility pages.
if (!canaryPreview) {
  for (const file of explicitPublicFiles) copyEntry(file);
}

const facilitySurfaces = buildFacilitySurfaces({
  outputDir,
  mode: canaryPreview ? 'canary' : 'production',
  referenceDate
});
const homepagePath = path.join(outputDir, 'index.html');
const homepageSource = fs.readFileSync(homepagePath, 'utf8');
const homepageLink = facilitySurfaces.keys.length
  ? '<p class="footer-section-note footer-facility-index-link"><a href="/facilities/">施設ページ一覧</a></p>'
  : '';
if (!homepageSource.includes('FACILITY_INDEX_LINK_SLOT')) {
  throw new Error('Homepage facility index link slot is missing');
}
fs.writeFileSync(homepagePath, homepageSource.replace('<!-- FACILITY_INDEX_LINK_SLOT -->', homepageLink));

const copiedFiles = [];
function collectFiles(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) collectFiles(entryPath);
    else copiedFiles.push(path.relative(outputDir, entryPath));
  }
}
collectFiles(outputDir);

/*
 * Guard, not a convention: a directory is copied recursively, so any file added
 * under `data/` would ship by default. The Service Worker's precache list is the
 * authoritative statement of what the application actually loads, so anything
 * shipped under `data/` that is absent from it is publishing work for no reader.
 * This turns "we remembered to exclude it" into a build failure.
 */
const shellAssets = new Set(
  (fs.readFileSync(path.join(projectRoot, 'sw.js'), 'utf8')
    .match(/const SHELL_ASSETS = \[([\s\S]*?)\]/)?.[1] || '')
    .split(',')
    .map(entry => entry.trim().replace(/^['"]\.\//, '').replace(/['"]$/, ''))
    .filter(Boolean)
);
const unusedData = copiedFiles
  .map(file => file.split(path.sep).join('/'))
  .filter(file => file.startsWith('data/') && !shellAssets.has(file));
if (unusedData.length) {
  throw new Error(
    `These files would be published but are never loaded by the app:\n  ${unusedData.join('\n  ')}\n` +
    'Add them to SHELL_ASSETS in sw.js if the app needs them, or to excludedPaths in this script.'
  );
}

console.log(`Cloudflare Pages output: ${path.relative(projectRoot, outputDir)}`);
console.log(`Facility surface mode: ${canaryPreview ? 'CANARY_PREVIEW' : 'PRODUCTION'}`);
console.log(`Facility exhibition reference date: ${referenceDate}`);
console.log(`Facility pages: ${facilitySurfaces.keys.length}`);
console.log(`Copied ${copiedFiles.length} files.`);
