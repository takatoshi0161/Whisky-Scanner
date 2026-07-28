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

Unknown country or production type values remain `null` or `unknown`; they must
not be inferred from region names or UI bottle defaults. Only `kind=distillery`
entries are eligible for distillery-based enrichment in consumers.

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
