# AGENTS.md

Durable operating constraints for coding agents working on PYOKO.

## Architecture

- PYOKO is intentionally a buildless static HTML/JavaScript application.
- Do not introduce React, Vue, Svelte, TypeScript, a bundler, or a module migration without an explicitly approved architecture task.
- Existing ordinary script load order is part of the runtime contract. Do not reorder scripts or convert globals without dependency review.

## Data boundaries

- Public/runtime data and internal review evidence are separate layers. Internal
  evidence is not part of the public repository or the production artifact.
- Production output is defined by the build allowlist, not by a file merely existing in the repository.
- Every browser-shipped file must be acceptable as a publicly retrievable resource.

## Product semantics

- Do not change Pass entitlement semantics, opening-state semantics, comparable/reference-value rules, source/provenance ownership, Facility Introduction editorial boundaries, or personal-state semantics as incidental cleanup.

## Scope discipline

- Deferred or evidence-gated work requires an explicit accepted product decision
  before scope expands. DEFERRED is not TODO.
- Before creating or reviewing PYOKO-branded SNS, OG, campaign or other social
  visuals, read `docs/brand/pyoko-sns-visual-guidelines.md`. It is the active
  visual source of truth for the Forest identity's social applications.

## Testing

- Select validation by behavior and introduced risk, not merely because a tracked file changed or by path.
- For runtime/data/build changes, normally use focused tests while changing,
  then `npm test` and relevant public validators; run broader or release checks
  when justified by release policy or risk.
- For ordinary documentation-only changes—human-readable documentation not
  consumed by runtime/build tooling, tests/automation, executable configuration,
  generated-artifact production, or an executable/review surface—use
  documentation-specific checks: `git diff --check`, final diff and structure
  review, relevant links/paths, required content, source-of-truth consistency,
  and unrelated-file review. Do not run unrelated application, data, build, or
  release suites (for example `npm test`, `npm run validate`,
  `npm run build:pages`, or release tests) solely
  because documentation changed. Use an automated documentation checker only
  if an existing relevant checker exists; do not invent a Markdown test
  framework.
- Executable or machine-consumed documentation uses focused checks appropriate to its behavior. Mixed changes use the highest relevant behavioral risk; updating `CHANGELOG.md` as the lifecycle record does not itself require another application test run unless its changed content is relevant input to a current tool.
- Do not repeatedly chase known unrelated flaky E2E failures.

## Accepted-work lifecycle

- For meaningful tracked changes, after implementation and required acceptance/validation pass, normally update CHANGELOG.md, create one commit, and push it to the canonical remote so GitHub reflects the latest accepted durable project state.
- Honor an explicit local-only or no-push request.
- Read-only, audit, verification-only, and NO_CHANGE_REQUIRED work with no tracked changes must not create CHANGELOG noise, commits, or pushes.

## Deployment

- PUSH ≠ DEPLOY. Production deployment always requires explicit owner approval.
- A production-connected `main` must receive only validated changes with a
  successful exact-head Preview and explicit owner release approval before merge.
- Keep the production build allowlist explicit; a file's presence in the source
  repository does not authorize browser publication.

## Documentation ownership

- AGENTS.md = durable operating rules.
- CHANGELOG.md = implemented history.
- README.md = maintainer/developer usage and architecture.
- Do not copy large portions of existing documentation into AGENTS.md.

## Contributor scope

- Keep accepted public product, brand, schema, and release rules in their
  respective repository documents. Do not treat a tool or example as authority
  to change product semantics.
