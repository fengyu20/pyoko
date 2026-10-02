#!/usr/bin/env node
/*
 * Semantic validation for scoped Pass benefit data.
 *
 *   node scripts/validate-pass-benefits.js
 *
 * Field-shape validation is not the point. These rules encode the meaning the
 * data must keep: a monetary value belongs to one scope, a variable benefit
 * cannot own a permanent yen amount, a derived value must be recomputable from
 * the benefit it names, and no value may quietly become a sum of two scopes.
 *
 * ERROR fails the run (exit 1). WARN reports and passes.
 */

const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const DATA_FILE = 'data/facility-pass-benefits.js';

const BENEFIT_TYPES = new Set(['admission', 'discount_fixed', 'discount_percent', 'discount_to_group_rate', 'other', 'unclear']);
const SCOPES = new Set([
  'whole_facility_admission', 'permanent_collection', 'collection', 'special_exhibition',
  'temporary_exhibition', 'named_exhibition', 'garden', 'building', 'unknown',
]);
const PRICE_MODES = new Set(['fixed', 'current_fixed_but_may_change', 'exhibition_variable', 'exhibition_specific', 'unknown']);
const PRICED_MODES = new Set(['fixed', 'current_fixed_but_may_change']);

function loadScopedBenefits() {
  return require(path.join(root, DATA_FILE)).FACILITY_PASS_BENEFITS;
}

// The single definition of what a benefit is worth. Anything a rule needs to
// know about money goes through here, so the validator and the builder cannot
// drift apart in their arithmetic.
function benefitValue(benefit) {
  const priced = PRICED_MODES.has(benefit.price_mode);
  if (benefit.type === 'admission' && priced && benefit.regular_price_yen != null) return benefit.regular_price_yen;
  if (benefit.type === 'discount_fixed' && benefit.saving_yen != null) return benefit.saving_yen;
  if (benefit.type === 'discount_percent' && priced && benefit.regular_price_yen != null && benefit.discount_rate != null) {
    return Math.round(benefit.regular_price_yen * benefit.discount_rate);
  }
  return null;
}

function validate(data) {
  const errors = [];
  const warns = [];

  for (const [key, record] of Object.entries(data)) {
    const at = suffix => `${key} (No.${record.facility_no}) ${suffix}`;

    if (!Array.isArray(record.official_clauses) || !record.official_clauses.length) {
      errors.push(at('has no official entitlement clause'));
    }
    // Source-backed condition notes are optional; when present they are verbatim
    // source strings and never a paraphrase.
    if (record.notes_ja != null) {
      if (!Array.isArray(record.notes_ja)) errors.push(at('notes_ja must be an array'));
      else for (const note of record.notes_ja) {
        if (typeof note !== 'string' || !note.trim()) errors.push(at('notes_ja must contain only non-empty strings'));
      }
    }
    for (const clause of record.official_clauses || []) {
      if (!clause.wording_ja) errors.push(at('has an official clause with no wording'));
    }
    if (!Array.isArray(record.benefits) || !record.benefits.length) {
      errors.push(at('has no structured benefit'));
      continue;
    }
    // A facility-level price is the defect this schema exists to remove.
    for (const field of ['regular_price_yen', 'pass_benefit_yen', 'saving_yen', 'price_mode', 'scope']) {
      if (field in record) errors.push(at(`carries a facility-level \`${field}\`; monetary and scope fields belong to a benefit`));
    }

    record.benefits.forEach((benefit, index) => {
      const where = at(`benefit ${index}`);
      if (!BENEFIT_TYPES.has(benefit.type)) errors.push(`${where}: unknown type \`${benefit.type}\``);
      if (!PRICE_MODES.has(benefit.price_mode)) errors.push(`${where}: unknown price_mode \`${benefit.price_mode}\``);

      // Rule: every monetary value has a scope.
      const hasMoney = benefit.regular_price_yen != null || benefit.saving_yen != null;
      if (!Array.isArray(benefit.scopes) || !benefit.scopes.length) {
        errors.push(`${where}: no scope`);
      } else {
        for (const scope of benefit.scopes) {
          if (!SCOPES.has(scope)) errors.push(`${where}: unknown scope \`${scope}\``);
        }
        if (benefit.scopes.includes('unknown')) {
          // A price only means something relative to a scope.
          if (benefit.regular_price_yen != null) {
            errors.push(`${where}: a price on an unknown scope`);
          }
          // A flat discount the Pass source states unconditionally is
          // scope-agnostic: "¥200 off the general price, whatever is showing".
          if (benefit.saving_yen != null && benefit.type !== 'discount_fixed') {
            errors.push(`${where}: a derived saving on an unknown scope`);
          }
        }
      }

      // Rule: official wording is present, or recoverable from the clause it
      // interprets. Structured scope with no traceable clause is forbidden.
      const clause = record.official_clauses?.[benefit.clause_index];
      if (benefit.clause_index == null || !clause) {
        errors.push(`${where}: does not reference an official clause`);
      } else if (!benefit.official_wording?.ja) {
        errors.push(`${where}: no official wording`);
      } else if (benefit.official_wording.ja !== clause.wording_ja) {
        errors.push(`${where}: official wording does not match its clause verbatim`);
      }
      if (benefit.interprets_ja && clause && !clause.wording_ja.includes(benefit.interprets_ja)) {
        errors.push(`${where}: interprets_ja is not part of the official clause`);
      }

      // Rule: a variable percentage discount cannot own a permanent yen value.
      if (benefit.type === 'discount_percent' && benefit.price_mode === 'exhibition_variable') {
        if (benefit.saving_yen != null) errors.push(`${where}: variable percentage discount with a permanent saving_yen`);
        if (benefit.regular_price_yen != null) errors.push(`${where}: variable percentage discount with a permanent regular_price_yen`);
      }
      if (benefit.type === 'discount_percent' && benefit.saving_yen != null && benefit.regular_price_yen == null) {
        errors.push(`${where}: percentage saving with no price basis`);
      }
      // Rule: admission to a scope with no verified price carries no value.
      if (benefit.type === 'admission' && !PRICED_MODES.has(benefit.price_mode) && benefit.saving_yen != null) {
        errors.push(`${where}: unverified admission with a permanent saving_yen`);
      }
      // Rule: a fixed yen discount is allowed to have no price at all.
      if (benefit.type === 'discount_fixed' && benefit.saving_yen == null) {
        warns.push(`${where}: fixed discount with no stated amount`);
      }
      // Provenance: a value must say where it came from.
      if (hasMoney && !benefit.price_source?.url) errors.push(`${where}: a monetary value with no price source`);
      if (hasMoney && !benefit.price_source?.checked_at) errors.push(`${where}: a monetary value with no checked_at`);
      if (benefit.discount_rate != null && (benefit.discount_rate <= 0 || benefit.discount_rate >= 1)) {
        errors.push(`${where}: discount_rate ${benefit.discount_rate} is not a fraction`);
      }
    });

    // Rule: a comparable value needs a basis, and the basis must produce it.
    const value = record.comparable_value_yen;
    const basis = record.value_basis;
    if (value != null && !basis) errors.push(at('has a comparable value with no value_basis'));
    if (value == null && basis) errors.push(at('has a value_basis with no comparable value'));
    if (value != null && basis) {
      const benefit = record.benefits[basis.benefit_index];
      if (!benefit) {
        errors.push(at(`value_basis points at benefit ${basis.benefit_index}, which does not exist`));
      } else {
        if (basis.benefit_type !== benefit.type) errors.push(at('value_basis type does not match its benefit'));
        if (!benefit.scopes.includes(basis.scope)) errors.push(at('value_basis scope does not match its benefit'));
        const recomputed = benefitValue(benefit);
        if (recomputed !== value) {
          errors.push(at(`comparable value ${value} cannot be recomputed from its basis (got ${recomputed})`));
        }
        // Rule: never a cross-scope sum.
        const single = record.benefits.map(benefitValue).filter(entry => entry != null);
        const largest = single.length ? Math.max(...single) : null;
        if (largest != null && value > largest) {
          errors.push(at(`comparable value ${value} exceeds the largest single-use saving ${largest}; scopes must not be summed`));
        }
      }
    }
    // A zero is never how an unknown value is expressed.
    if (value === 0) errors.push(at('uses 0 for a value that should be null'));

    if (!['priced', 'entitlement_only'].includes(record.verification_status)) {
      errors.push(at(`unknown verification_status \`${record.verification_status}\``));
    }
    if (record.verification_status === 'priced' && value == null) {
      warns.push(at('is marked priced but derives no comparable value'));
    }
  }

  return { errors, warns };
}

module.exports = { validate, loadScopedBenefits, benefitValue };

if (require.main === module) {
  const data = loadScopedBenefits();
  const { errors, warns } = validate(data);
  const total = Object.keys(data).length;
  const priced = Object.values(data).filter(record => record.verification_status === 'priced').length;
  for (const warn of warns) console.log(`WARN  ${warn}`);
  for (const error of errors) console.error(`ERROR ${error}`);
  console.log(`施設 ${total} 件 / うち価格検証済み ${priced} 件 / ERROR ${errors.length} / WARN ${warns.length}`);
  if (errors.length) process.exit(1);
  console.log('✅ scoped pass benefit semantics OK');
}
