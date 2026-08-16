import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { validateWhiskyEntities } from "./validate-whisky-entities.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const referencePath = path.resolve(here, "../../data/reference/whisky-entities.json");
const reference = JSON.parse(fs.readFileSync(referencePath, "utf8"));

function clone() {
  return structuredClone(reference);
}

test("the migrated reference is valid and retains 169 entities", () => {
  const value = validateWhiskyEntities(clone());
  assert.equal(value.entries.length, 169);
});

test("priority distilleries have confirmed metadata", () => {
  const byName = new Map(reference.entries.map((entry) => [entry.canonical_name, entry]));
  const expected = {
    "Caol Ila": ["Scotland", "Islay"],
    Glenmorangie: ["Scotland", "Highland"],
    Kilchoman: ["Scotland", "Islay"],
    GlenAllachie: ["Scotland", "Speyside"],
    Ardbeg: ["Scotland", "Islay"],
    Laphroaig: ["Scotland", "Islay"],
    Hakushu: ["Japan", "Japan"],
    Benriach: ["Scotland", "Speyside"],
  };
  for (const [name, [country, region]] of Object.entries(expected)) {
    const entry = byName.get(name);
    assert.ok(entry, name);
    assert.equal(entry.kind, "distillery", name);
    assert.equal(entry.country, country, name);
    assert.equal(entry.region, region, name);
    assert.equal(entry.distillery_type, "malt", name);
  }
  assert.equal(byName.has("Meikle Tòir"), false);
  for (const name of ["Johnnie Walker", "Chivas Regal", "Dewar's"]) {
    assert.equal(byName.get(name)?.kind, "brand", name);
    assert.equal(byName.get(name)?.distillery_type, "unknown", name);
  }
});

test("audited Collection distilleries retain exact managed identities", () => {
  const byName = new Map(reference.entries.map((entry) => [entry.canonical_name, entry]));
  const expected = {
    Linkwood: ["Scotland", "Speyside", "unknown"],
    Springbank: ["Scotland", "Campbeltown", "unknown"],
    Bruichladdich: ["Scotland", "Islay", "unknown"],
    "Lindores Abbey Distillery": ["Scotland", "Lowland", "malt"],
    "Saburomaru Distillery": ["Japan", "Toyama", "unknown"],
  };
  for (const [name, [country, region, type]] of Object.entries(expected)) {
    const entry = byName.get(name);
    assert.ok(entry, name);
    assert.equal(entry.kind, "distillery", name);
    assert.equal(entry.country, country, name);
    assert.equal(entry.region, region, name);
    assert.equal(entry.distillery_type, type, name);
  }
  assert.deepEqual(byName.get("Lindores Abbey Distillery")?.aliases, []);
  assert.deepEqual(byName.get("Saburomaru Distillery")?.aliases, ["三郎丸蒸留所"]);
  assert.equal(byName.has("Adelphi Distillery Ltd."), false);
});

test("canonical, alias, and kind/type collisions are rejected", () => {
  const duplicate = clone();
  duplicate.entries[1].canonical_name = duplicate.entries[0].canonical_name;
  assert.throws(() => validateWhiskyEntities(duplicate), /canonical name collision/);

  const alias = clone();
  alias.entries[1].aliases.push(alias.entries[0].canonical_name);
  assert.throws(() => validateWhiskyEntities(alias), /global alias collision/);

  const brandType = clone();
  const brand = brandType.entries.find((entry) => entry.kind === "brand");
  brand.distillery_type = "malt";
  assert.throws(() => validateWhiskyEntities(brandType), /non-distillery/);
});
