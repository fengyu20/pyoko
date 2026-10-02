// Executable runtime consuming data/facility-pass-time-scope.js; load the data file first.

function passTimeScopeKey(facility) {
  return String(facility?._key || `${facility?.no || ''}-${facility?.name || ''}`);
}

// Default is `persistent`: no record means free admission is not date-gated.
function getPassTimeScope(facility) {
  return FACILITY_PASS_TIME_SCOPE[passTimeScopeKey(facility)]
    || { classification: 'persistent', entitlement_mode: null, admission_time_scoped: false };
}

// Normalized, chronologically sorted confirmed windows.
function getPassAdmissionWindows(scope) {
  return (Array.isArray(scope?.windows) ? scope.windows : [])
    .map(w => ({
      valid_from: String(w?.valid_from || ''),
      valid_to: String(w?.valid_to || ''),
      title: String(w?.title || ''),
      source_ref: String(w?.source_ref || '')
    }))
    .filter(w => w.valid_from && w.valid_to)
    .sort((a, b) => a.valid_from.localeCompare(b.valid_from) || a.valid_to.localeCompare(b.valid_to));
}

/*
 * Availability resolver (entitlement-level).
 *
 *   available       — date is inside a confirmed eligibility window.
 *   upcoming        — a confirmed eligible scope exists but has not started.
 *   inactive_ended  — a one-off scope has ended (reserved).
 *   unconfirmed     — no confirmed window covers the date and the source does not
 *                     prove there is none. This is the honest answer both for a
 *                     non-exhaustive schedule and past an explicit boundary whose
 *                     successor has not been published.
 *   none_confirmed  — the source explicitly covers the date and states no scope.
 *
 * A date in a gap between two confirmed windows reports `upcoming` (the next known
 * scope), which is the most specific truthful answer.
 */
function resolvePassAdmissionAvailability(scope, dateStr) {
  const record = scope || {};
  if (record.admission_time_scoped !== true) return 'available';
  const windows = getPassAdmissionWindows(record);
  if (!windows.length) return record.post_validity || 'unconfirmed';
  const date = String(dateStr || '');
  for (const w of windows) {
    if (date >= w.valid_from && date <= w.valid_to) return 'available';
  }
  const next = windows.find(w => w.valid_from > date);
  if (next) return 'upcoming';
  return record.post_validity || 'unconfirmed';
}

// The next confirmed eligible window start after `dateStr`, for the "from …" label.
function getPassAdmissionNextWindowStart(scope, dateStr) {
  const next = getPassAdmissionWindows(scope).find(w => w.valid_from > String(dateStr || ''));
  return next ? next.valid_from : '';
}

// The window covering `dateStr`, so the UI can name the exhibition actually in scope.
function getPassAdmissionActiveWindow(scope, dateStr) {
  const date = String(dateStr || '');
  return getPassAdmissionWindows(scope).find(w => date >= w.valid_from && date <= w.valid_to) || null;
}

/*
 * Confirmed windows merged where they overlap or touch, so the Detail "対象期間"
 * label never presents a gap as one continuous eligibility span. A facility with
 * three separated exhibitions shows three spans, not 4/11–10/12.
 */
function getPassAdmissionMergedWindows(scope) {
  const windows = getPassAdmissionWindows(scope);
  const merged = [];
  windows.forEach(w => {
    const last = merged[merged.length - 1];
    if (last && w.valid_from <= last.valid_to) {
      if (w.valid_to > last.valid_to) last.valid_to = w.valid_to;
      return;
    }
    merged.push({ valid_from: w.valid_from, valid_to: w.valid_to });
  });
  return merged;
}

// Resolve a window's `source_ref` to its full source record (never a bare URL).
function getPassTimeScopeSource(ref) {
  return FACILITY_PASS_TIME_SCOPE_SOURCES[String(ref || '')] || null;
}

window.getPassTimeScope = getPassTimeScope;
window.getPassAdmissionWindows = getPassAdmissionWindows;
window.resolvePassAdmissionAvailability = resolvePassAdmissionAvailability;
window.getPassAdmissionNextWindowStart = getPassAdmissionNextWindowStart;
window.getPassAdmissionActiveWindow = getPassAdmissionActiveWindow;
window.getPassAdmissionMergedWindows = getPassAdmissionMergedWindows;
window.getPassTimeScopeSource = getPassTimeScopeSource;
