# Whisky entity reference

`data/reference/whisky-entities.json` is the machine-readable source of truth for
whisky entities maintained by Whisky-Scanner. `frontend/app/data/distilleries.ts`
remains the current UI data source until a later UI migration, but other
projects must consume the JSON reference rather than parse the TypeScript file.

The reference may be copied as a validated, commit-pinned snapshot by other
projects owned by the same repository owner. Consumers must record the source
repository, commit SHA, `reference_id`, and `schema_version`. This is an
internal data reuse policy and does not set a license for the rest of the
project.

Unknown country and region values remain `null`; they must not be inferred from
region names or UI bottle defaults. Only `kind=distillery` entries are eligible
for distillery-based enrichment in consumers.

Every distillery has a non-null `distillery_type` and an explicit
`distillery_type_basis`. `managed_reference` means the type was positively
managed as reference data. `operational_default` means the personal workflow's
reviewed default of `malt` replaced a formerly unknown type; it is not evidence
that the production type was independently verified. Non-distillery entities
store both fields as `null`. Consumers must preserve this distinction in their
evidence and must not use the operational default without an exact managed
distillery match. Country and region stay independent and may remain `null`.

Validate changes before opening a pull request:

```powershell
cd frontend
npm run validate:reference
npm test
npm run build
```

Updates are made through a feature branch and pull request. The validation
command rejects unsupported schemas, duplicate canonical names, alias
collisions, whitespace errors, and invalid kind/type combinations.

## Distillery canonical naming

For a newly added or explicitly corrected managed distillery canonical name,
do not include a terminal `Distillery` unless an explicit review decision says
otherwise. This is a reference-data naming convention only: it does not
authorize a bulk rename of existing entries or any runtime suffix removal.

An official or historical observed label that includes `Distillery` may be
retained as an explicit, collision-free exact alias of the chosen canonical
name. Aliases remain complete labels; partial matching, fuzzy matching, and
automatic suffix stripping are not permitted.
