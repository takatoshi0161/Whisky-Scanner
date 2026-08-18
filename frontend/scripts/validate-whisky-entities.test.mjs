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

test("B15 country values are evidence-backed and Port Charlotte stays unresolved", () => {
  const byName = new Map(reference.entries.map((entry) => [entry.canonical_name, entry]));
  for (const name of ["Bowmore", "Lagavulin", "Port Ellen"]) {
    const entry = byName.get(name);
    assert.ok(entry, name);
    assert.equal(entry.kind, "distillery", name);
    assert.equal(entry.country, "Scotland", name);
    assert.equal(entry.region, "Islay", name);
  }
  assert.equal(byName.get("Port Charlotte")?.country, null);
});

test("B16 country value is evidence-backed", () => {
  const entry = new Map(reference.entries.map((value) => [value.canonical_name, value])).get("Milk & Honey");
  assert.ok(entry);
  assert.equal(entry.kind, "distillery");
  assert.equal(entry.country, "Israel");
  assert.equal(entry.region, "Israel");
});

test("B17 exact-source country values are confirmed", () => {
  const byName = new Map(reference.entries.map((entry) => [entry.canonical_name, entry]));
  for (const name of [
    "Chichibu",
    "Hanyu",
    "Miyagikyo",
    "Tsunuki",
    "Yamazaki",
    "Yoichi",
    "Yuza",
  ]) {
    const entry = byName.get(name);
    assert.ok(entry, name);
    assert.equal(entry.kind, "distillery", name);
    assert.equal(entry.country, "Japan", name);
    assert.equal(entry.region, "Japan", name);
  }
});

test("B17 user-approved managed country values are recorded separately", () => {
  const byName = new Map(reference.entries.map((entry) => [entry.canonical_name, entry]));
  for (const name of ["Karuizawa", "Shinshu"]) {
    const entry = byName.get(name);
    assert.ok(entry, name);
    assert.equal(entry.kind, "distillery", name);
    assert.equal(entry.country, "Japan", name);
    assert.equal(entry.region, "Japan", name);
  }
});

test("B18 exact-source country values are confirmed and unresolved entries stay null", () => {
  const byName = new Map(reference.entries.map((entry) => [entry.canonical_name, entry]));
  for (const name of ["Auchentoshan", "Bladnoch", "Eden Mill", "Glenkinchie", "Littlemill", "Rosebank"]) {
    const entry = byName.get(name);
    assert.ok(entry, name);
    assert.equal(entry.kind, "distillery", name);
    assert.equal(entry.country, "Scotland", name);
    assert.equal(entry.region, "Lowland", name);
  }
  for (const name of ["Inverleven", "Lomond (Inverleven)", "St Magdalene"]) {
    assert.equal(byName.get(name)?.country, null, name);
  }
});

test("B19 exact-source country value is confirmed", () => {
  const entry = new Map(reference.entries.map((value) => [value.canonical_name, value])).get("Breuckelen");
  assert.ok(entry);
  assert.equal(entry.kind, "distillery");
  assert.equal(entry.country, "United States");
  assert.equal(entry.region, "New York");
});

test("B22 direct-source country values are confirmed and insufficient evidence stays unresolved", () => {
  const byName = new Map(reference.entries.map((value) => [value.canonical_name, value]));
  for (const name of ["Aberlour", "Benromach"]) {
    const entry = byName.get(name);
    assert.ok(entry, name);
    assert.equal(entry.kind, "distillery", name);
    assert.equal(entry.country, "Scotland", name);
    assert.equal(entry.region, "Speyside", name);
  }
  for (const name of ["Allt-a'Bhainne", "Auchroisk", "Aultmore", "Balmenach", "Balvenie", "Banff", "Benrinnes", "Braeval"]) {
    assert.equal(byName.get(name)?.country, null, name);
  }
});

test("B20 exact-source country value is confirmed", () => {
  const entry = new Map(reference.entries.map((value) => [value.canonical_name, value])).get("Bushmills");
  assert.ok(entry);
  assert.equal(entry.kind, "distillery");
  assert.equal(entry.country, "Northern Ireland");
  assert.equal(entry.region, "Northern Ireland");
});

test("B23 remains unresolved when direct country evidence is insufficient", () => {
  const byName = new Map(reference.entries.map((value) => [value.canonical_name, value]));
  for (const name of [
    "Caperdonich",
    "Cardhu",
    "Coleburn",
    "Convalmore",
    "Cragganmore",
    "Craigellachie",
    "Dailuaine",
    "Dallas Dhu",
    "Dufftown",
    "Glen Elgin",
  ]) {
    const entry = byName.get(name);
    assert.ok(entry, name);
    assert.equal(entry.kind, "distillery", name);
    assert.equal(entry.country, null, name);
    assert.equal(entry.region, "Speyside", name);
  }
});

test("B28 direct-source country values are confirmed", () => {
  const byName = new Map(reference.entries.map((value) => [value.canonical_name, value]));
  for (const name of ["Kavalan", "Nantou"]) {
    const entry = byName.get(name);
    assert.ok(entry, name);
    assert.equal(entry.kind, "distillery", name);
    assert.equal(entry.country, "Taiwan", name);
    assert.equal(entry.region, "Taiwan", name);
  }
});

test("B21 exact-source country values are confirmed", () => {
  const byName = new Map(reference.entries.map((value) => [value.canonical_name, value]));
  for (const name of ["Glasgow", "Isle of Harris", "Nc'Nean", "Raasay"]) {
    const entry = byName.get(name);
    assert.ok(entry, name);
    assert.equal(entry.kind, "distillery", name);
    assert.equal(entry.country, "Scotland", name);
    assert.equal(entry.region, "Scotland", name);
  }
});

test("audited Collection distilleries retain exact managed identities", () => {
  const byName = new Map(reference.entries.map((entry) => [entry.canonical_name, entry]));
  const expected = {
    Linkwood: ["Scotland", "Speyside", "unknown"],
    Bunnahabhain: ["Scotland", "Islay", "unknown"],
    Springbank: ["Scotland", "Campbeltown", "unknown"],
    Bruichladdich: ["Scotland", "Islay", "unknown"],
    "Lindores Abbey": ["Scotland", "Lowland", "malt"],
    Saburomaru: ["Japan", "Toyama", "unknown"],
    Glasgow: ["Scotland", "Scotland", "unknown"],
  };
  for (const [name, [country, region, type]] of Object.entries(expected)) {
    const entry = byName.get(name);
    assert.ok(entry, name);
    assert.equal(entry.kind, "distillery", name);
    assert.equal(entry.country, country, name);
    assert.equal(entry.region, region, name);
    assert.equal(entry.distillery_type, type, name);
  }
  assert.deepEqual(byName.get("Lindores Abbey")?.aliases, ["Lindores Abbey Distillery"]);
  assert.deepEqual(byName.get("Saburomaru")?.aliases, ["三郎丸蒸留所", "Saburomaru Distillery"]);
  assert.deepEqual(byName.get("Glasgow")?.aliases, ["Glasgow Distillery"]);
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
