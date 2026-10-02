// Test loader: runs the browser logic files in a Node vm sandbox and exposes
// their functions — no build step, no dependencies, no source changes.
//
// Why a bundle: the source files use top-level `const`/`function` and rely on
// sharing globals across <script> tags (e.g. phase1-open-now.js reads HOURS
// from hours.js). vm.runInContext keeps each call's lexical scope private, so
// we concatenate the files into one script and run it once, mirroring how the
// browser shares one global lexical environment across scripts.

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');

// Load order matches index.html: data first, then the logic that reads it.
const FILES = ['data/holidays.js', 'phase1/hours.js', 'status.js', 'phase1/phase1-open-now.js'];

function loadApi() {
  let src = FILES
    .map(f => `// ===== ${f} =====\n` + fs.readFileSync(path.join(root, f), 'utf8'))
    .join('\n;\n');

  // Re-export the top-level bindings we want to test.
  src += `
;globalThis.__api = {
  HOURS, HOLIDAYS,
  tokyoNow, seasonMatches, getHoursFor, computeNowState,
  getFacilityOpeningState,
  buildStatusPresentation, getOfficialStatusUrl,
  checkStatus, makeStatus,
  DEFAULT_LAST_ADMISSION, LAST_CALL_WINDOW
};`;

  const context = vm.createContext({ console });
  vm.runInContext(src, context, { filename: 'gruttopass-bundle.js' });
  return context.__api;
}

module.exports = loadApi();
