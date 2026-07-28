import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pathToFileURL } from "node:url";

export const KINDS = new Set(["distillery", "brand", "unknown"]);
export const DISTILLERY_TYPES = new Set(["malt", "grain", "mixed", "unknown"]);

function normalized(value) {
  return value.normalize("NFKC").toLocaleLowerCase("en-US");
}

function cleanString(value, label, { nullable = false } = {}) {
  if (nullable && value === null) return;
  if (typeof value !== "string" || !value || value !== value.trim()) {
    throw new Error(`${label} must be a non-empty trimmed string${nullable ? " or null" : ""}`);
  }
}

export function validateWhiskyEntities(value) {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    Object.keys(value).sort().join(",") !== "entries,reference_id,schema_version"
  ) {
    throw new Error("reference document has an invalid structure");
  }
  if (value.schema_version !== 1) throw new Error("unsupported schema_version");
  cleanString(value.reference_id, "reference_id");
  if (!Array.isArray(value.entries) || value.entries.length === 0) {
    throw new Error("entries must be a non-empty array");
  }

  const canonicalOwners = new Map();
  const aliasOwners = new Map();
  for (const [index, entry] of value.entries.entries()) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new Error(`entry ${index} has an invalid structure`);
    }
    cleanString(entry.canonical_name, `entry ${index} canonical_name`);
    const canonical = normalized(entry.canonical_name);
    if (canonicalOwners.has(canonical)) {
      throw new Error(`canonical name collision: ${entry.canonical_name}`);
    }
    canonicalOwners.set(canonical, entry.canonical_name);
  }
  for (const [index, entry] of value.entries.entries()) {
    if (
      !entry ||
      typeof entry !== "object" ||
      Array.isArray(entry) ||
      Object.keys(entry).sort().join(",") !==
        "aliases,canonical_name,country,distillery_type,kind,region"
    ) {
      throw new Error(`entry ${index} has an invalid structure`);
    }
    cleanString(entry.canonical_name, `entry ${index} canonical_name`);
    if (!Array.isArray(entry.aliases)) throw new Error(`entry ${index} aliases must be an array`);
    if (!KINDS.has(entry.kind)) throw new Error(`entry ${index} kind is invalid`);
    if (!DISTILLERY_TYPES.has(entry.distillery_type)) {
      throw new Error(`entry ${index} distillery_type is invalid`);
    }
    cleanString(entry.country, `entry ${index} country`, { nullable: true });
    cleanString(entry.region, `entry ${index} region`, { nullable: true });
    if (entry.kind !== "distillery" && entry.distillery_type !== "unknown") {
      throw new Error(`entry ${index} non-distillery cannot declare a distillery type`);
    }

    const canonical = normalized(entry.canonical_name);

    const localAliases = new Set();
    for (const alias of entry.aliases) {
      cleanString(alias, `entry ${index} alias`);
      const key = normalized(alias);
      if (key === canonical || localAliases.has(key)) {
        throw new Error(`alias collision in ${entry.canonical_name}: ${alias}`);
      }
      if (canonicalOwners.has(key) || aliasOwners.has(key)) {
        throw new Error(`global alias collision: ${alias}`);
      }
      localAliases.add(key);
      aliasOwners.set(key, entry.canonical_name);
    }
  }
  return value;
}

export function loadAndValidate(referencePath) {
  return validateWhiskyEntities(JSON.parse(fs.readFileSync(referencePath, "utf8")));
}

const isMain = process.argv[1] &&
  pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (isMain) {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const referencePath = path.resolve(here, "../../data/reference/whisky-entities.json");
  const value = loadAndValidate(referencePath);
  process.stdout.write(
    JSON.stringify({
      result: "reference_valid",
      entries: value.entries.length,
      distilleries: value.entries.filter((entry) => entry.kind === "distillery").length,
      brands: value.entries.filter((entry) => entry.kind === "brand").length,
      unknown: value.entries.filter((entry) => entry.kind === "unknown").length,
    }) + "\n",
  );
}
