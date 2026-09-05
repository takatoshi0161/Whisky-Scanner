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

test("the version 2 reference is valid and retains 171 entities", () => {
  const value = validateWhiskyEntities(clone());
  assert.equal(value.entries.length, 171);
});

test("Lagg has one explicit managed identity backed by its official location", () => {
  const byName = new Map(reference.entries.map((entry) => [entry.canonical_name, entry]));
  const lagg = byName.get("Lagg");
  assert.ok(lagg);
  assert.deepEqual(lagg.aliases, ["Lagg Distillery"]);
  assert.equal(lagg.kind, "distillery");
  assert.equal(lagg.country, "Scotland");
  assert.equal(lagg.region, "Islands");
  assert.equal(lagg.distillery_type, "malt");
  assert.equal(lagg.distillery_type_basis, "managed_reference");

  assert.equal(
    reference.entries.filter(
      (entry) =>
        entry.canonical_name.normalize("NFKC").toLocaleLowerCase("en-US") === "lagg" ||
        entry.aliases.some(
          (alias) => alias.normalize("NFKC").toLocaleLowerCase("en-US") === "lagg distillery",
        ),
    ).length,
    1,
  );
  assert.equal(
    reference.entries.some((entry) => entry.aliases.includes("LAGG")),
    false,
  );

  const collision = clone();
  collision.entries.find((entry) => entry.canonical_name === "Lagavulin").aliases.push("Lagg Distillery");
  assert.throws(() => validateWhiskyEntities(collision), /global alias collision/);
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
    assert.equal(entry.distillery_type_basis, "managed_reference", name);
  }
  assert.equal(byName.has("Meikle Tòir"), false);
  for (const name of ["Johnnie Walker", "Chivas Regal", "Dewar's"]) {
    assert.equal(byName.get(name)?.kind, "brand", name);
    assert.equal(byName.get(name)?.distillery_type, null, name);
    assert.equal(byName.get(name)?.distillery_type_basis, null, name);
  }
});

test("distillery types distinguish managed facts from the malt operational default", () => {
  const distilleries = reference.entries.filter((entry) => entry.kind === "distillery");
  assert.equal(distilleries.length, 168);
  assert.equal(
    distilleries.filter((entry) => entry.distillery_type_basis === "managed_reference").length,
    10,
  );
  assert.equal(
    distilleries.filter((entry) => entry.distillery_type_basis === "operational_default").length,
    158,
  );
  assert.equal(reference.entries.some((entry) => entry.distillery_type === "unknown"), false);

  const byName = new Map(reference.entries.map((entry) => [entry.canonical_name, entry]));
  for (const name of ["Lagavulin", "Miyagikyo"]) {
    assert.equal(byName.get(name)?.distillery_type, "malt", name);
    assert.equal(byName.get(name)?.distillery_type_basis, "operational_default", name);
  }
  assert.equal(byName.get("Laphroaig")?.distillery_type_basis, "managed_reference");

  const unresolvedGeography = byName.get("Allt-a'Bhainne");
  assert.equal(unresolvedGeography?.distillery_type, "malt");
  assert.equal(unresolvedGeography?.distillery_type_basis, "operational_default");
  assert.equal(unresolvedGeography?.country, null);
  assert.equal(unresolvedGeography?.region, "Speyside");
});

test("confirmed grain remains representable but an operational default cannot claim grain", () => {
  const confirmedGrain = clone();
  const entry = confirmedGrain.entries.find((value) => value.canonical_name === "Lagavulin");
  entry.distillery_type = "grain";
  entry.distillery_type_basis = "managed_reference";
  assert.doesNotThrow(() => validateWhiskyEntities(confirmedGrain));

  entry.distillery_type_basis = "operational_default";
  assert.throws(() => validateWhiskyEntities(confirmedGrain), /operational default must be malt/);
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
  for (const name of ["Karuizawa", "Komagatake"]) {
    const entry = byName.get(name);
    assert.ok(entry, name);
    assert.equal(entry.kind, "distillery", name);
    assert.equal(entry.country, "Japan", name);
    assert.equal(entry.region, "Japan", name);
  }
});

test("Komagatake owns only the approved current exact labels", () => {
  const byName = new Map(reference.entries.map((entry) => [entry.canonical_name, entry]));
  const komagatake = byName.get("Komagatake");
  assert.ok(komagatake);
  assert.deepEqual(komagatake.aliases, ["MARS KOMAGATAKE DISTILLERY", "駒ヶ岳"]);
  assert.equal(komagatake.country, "Japan");
  assert.equal(byName.has("Shinshu"), false);
  assert.equal(
    reference.entries.some(
      (entry) => entry.aliases.includes("Shinshu") || entry.aliases.includes("信州"),
    ),
    false,
  );
  assert.equal(
    reference.entries.filter(
      (entry) =>
        entry.canonical_name === "MARS KOMAGATAKE DISTILLERY" ||
        entry.aliases.includes("MARS KOMAGATAKE DISTILLERY"),
    ).length,
    1,
  );
  assert.equal(
    reference.entries.some(
      (entry) =>
        entry.canonical_name === "Komagatake Distillery" ||
        entry.aliases.includes("Komagatake Distillery"),
    ),
    false,
  );

  const collision = clone();
  collision.entries
    .find((entry) => entry.canonical_name === "Karuizawa")
    .aliases.push("MARS KOMAGATAKE DISTILLERY");
  assert.throws(
    () => validateWhiskyEntities(collision),
    /global alias collision/,
  );
});

test("Tsunuki owns only the approved exact distillery label", () => {
  const byName = new Map(reference.entries.map((entry) => [entry.canonical_name, entry]));
  const tsunuki = byName.get("Tsunuki");
  assert.ok(tsunuki);
  assert.deepEqual(tsunuki.aliases, ["MARS TSUNUKI DISTILLERY", "津貫"]);
  assert.equal(tsunuki.country, "Japan");
  assert.equal(
    reference.entries.filter(
      (entry) =>
        entry.canonical_name === "MARS TSUNUKI DISTILLERY" ||
        entry.aliases.includes("MARS TSUNUKI DISTILLERY"),
    ).length,
    1,
  );
  assert.equal(
    reference.entries.some(
      (entry) =>
        entry.canonical_name === "Tsunuki Distillery" ||
        entry.aliases.includes("Tsunuki Distillery"),
    ),
    false,
  );

  const collision = clone();
  collision.entries
    .find((entry) => entry.canonical_name === "Karuizawa")
    .aliases.push("MARS TSUNUKI DISTILLERY");
  assert.throws(
    () => validateWhiskyEntities(collision),
    /global alias collision/,
  );
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

test("B26 direct-source country values are confirmed and insufficient evidence stays unresolved", () => {
  const byName = new Map(reference.entries.map((value) => [value.canonical_name, value]));
  for (const name of ["Speyburn", "Strathisla", "Tamdhu", "Tomintoul", "Tormore"]) {
    const entry = byName.get(name);
    assert.ok(entry, name);
    assert.equal(entry.kind, "distillery", name);
    assert.equal(entry.country, "Scotland", name);
    assert.equal(entry.region, "Speyside", name);
  }
  for (const name of ["Mortlach", "Mosstowie", "Pittyvaich", "Strathmill", "Tamnavulin"]) {
    assert.equal(byName.get(name)?.country, null, name);
  }
});

test("B27 direct-source country value is confirmed and unresolved entries stay null", () => {
  const byName = new Map(reference.entries.map((value) => [value.canonical_name, value]));
  const highCoast = byName.get("High Coast");
  assert.ok(highCoast);
  assert.equal(highCoast.kind, "distillery");
  assert.equal(highCoast.country, "Sweden");
  assert.equal(highCoast.region, "Sweden");
  for (const name of ["Mackmyra", "Smogen"]) {
    assert.equal(byName.get(name)?.country, null, name);
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

test("B30 direct-source country value is confirmed", () => {
  const entry = new Map(reference.entries.map((value) => [value.canonical_name, value])).get("Penderyn");
  assert.ok(entry);
  assert.equal(entry.kind, "distillery");
  assert.equal(entry.country, "Wales");
  assert.equal(entry.region, "Wales");
});

test("B29 user-approved managed country value is recorded separately", () => {
  const entry = new Map(reference.entries.map((value) => [value.canonical_name, value])).get("Balcones");
  assert.ok(entry);
  assert.equal(entry.kind, "distillery");
  assert.equal(entry.country, "United States");
  assert.equal(entry.region, "Texas");
});

test("B01-B04 direct-source country values are confirmed and insufficient evidence stays unresolved", () => {
  const byName = new Map(reference.entries.map((value) => [value.canonical_name, value]));
  const expected = {
    "Archie Rose": ["Australia", "Australia"],
    Starward: ["Australia", "Australia"],
    "Glen Scotia": ["Scotland", "Campbeltown"],
    Hazelburn: ["Scotland", "Campbeltown"],
    Longrow: ["Scotland", "Campbeltown"],
    "Shelter Point": ["Canada", "Canada"],
    Thy: ["Denmark", "Denmark"],
  };

  for (const [name, [country, region]] of Object.entries(expected)) {
    const entry = byName.get(name);
    assert.ok(entry, name);
    assert.equal(entry.kind, "distillery", name);
    assert.equal(entry.country, country, name);
    assert.equal(entry.region, region, name);
  }
  for (const name of ["Fary Lochan", "Mosgaard"]) {
    assert.equal(byName.get(name)?.country, null, name);
  }
});

test("B31 distinguishes direct-source and user-approved Washington country values", () => {
  const byName = new Map(reference.entries.map((value) => [value.canonical_name, value]));

  const westland = byName.get("Westland");
  assert.ok(westland);
  assert.equal(westland.kind, "distillery");
  assert.equal(westland.country, "United States");
  assert.equal(westland.region, "Washington");

  const copperworks = byName.get("Copperworks");
  assert.ok(copperworks);
  assert.equal(copperworks.kind, "distillery");
  assert.equal(copperworks.country, "United States");
  assert.equal(copperworks.region, "Washington");
  assert.deepEqual(copperworks.aliases, [
    "Copperworks Distilling Co.",
    "Copper Works Distilling Co.",
    "Copper Works",
  ]);
  assert.equal(
    reference.entries.filter(
      (entry) =>
        entry.canonical_name === "Copperworks Distilling Co." ||
        entry.aliases.includes("Copperworks Distilling Co."),
    ).length,
    1,
  );
  assert.equal(
    reference.entries.some(
      (entry) =>
        entry.canonical_name === "Copperworks Distilling Company" ||
        entry.aliases.includes("Copperworks Distilling Company") ||
        entry.aliases.includes("Copperworks Distilling Co"),
    ),
    false,
  );
  assert.equal(byName.has("Copperworks Alba"), false);
  assert.equal(
    reference.entries.some((entry) => entry.canonical_name === "Alba" || entry.aliases.includes("Alba")),
    false,
  );
});

test("B12-B14 direct-source country values are confirmed and Ledaig stays unresolved", () => {
  const byName = new Map(reference.entries.map((value) => [value.canonical_name, value]));
  const expected = {
    "Paul John": ["India", "India"],
    Connemara: ["Ireland", "Ireland"],
    Cooley: ["Ireland", "Ireland"],
    "West Cork": ["Ireland", "Ireland"],
    "Highland Park": ["Scotland", "Islands"],
    "Isle of Arran": ["Scotland", "Islands"],
    "Isle of Jura": ["Scotland", "Islands"],
    Scapa: ["Scotland", "Islands"],
    Talisker: ["Scotland", "Islands"],
    Tobermory: ["Scotland", "Islands"],
  };
  for (const [name, [country, region]] of Object.entries(expected)) {
    const entry = byName.get(name);
    assert.ok(entry, name);
    assert.equal(entry.kind, "distillery", name);
    assert.equal(entry.country, country, name);
    assert.equal(entry.region, region, name);
  }
  assert.equal(byName.get("Ledaig")?.country, null);
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

test("B24 and Glen Moray direct-source country values are confirmed and insufficient evidence stays unresolved", () => {
  const byName = new Map(reference.entries.map((value) => [value.canonical_name, value]));
  for (const name of ["Glen Grant", "Glen Moray", "Glenfarclas", "Glenfiddich", "Glenlivet"]) {
    const entry = byName.get(name);
    assert.ok(entry, name);
    assert.equal(entry.kind, "distillery", name);
    assert.equal(entry.country, "Scotland", name);
    assert.equal(entry.region, "Speyside", name);
  }
  for (const name of ["Glen Keith", "Glen Spey", "Glenburgie", "Glencraig", "Glendullan"]) {
    assert.equal(byName.get(name)?.country, null, name);
  }
});

test("B25 direct-source country values are confirmed and insufficient evidence stays unresolved", () => {
  const byName = new Map(reference.entries.map((value) => [value.canonical_name, value]));
  for (const name of ["Glenrothes", "Longmorn", "Macallan"]) {
    const entry = byName.get(name);
    assert.ok(entry, name);
    assert.equal(entry.kind, "distillery", name);
    assert.equal(entry.country, "Scotland", name);
    assert.equal(entry.region, "Speyside", name);
  }
  for (const name of ["Glenlossie", "Glentauchers", "Imperial", "Inchgower", "Knockando", "Mannochmore", "Miltonduff"]) {
    assert.equal(byName.get(name)?.country, null, name);
  }
});

test("B09-B11 official country values are confirmed and unresolved entries stay null", () => {
  const byName = new Map(reference.entries.map((value) => [value.canonical_name, value]));
  const expected = [
    "Glendronach",
    "Glenglassaugh",
    "Glengoyne",
    "Glenturret",
    "Loch Lomond",
    "Oban",
    "Old Pulteney",
    "Tomatin",
    "Tullibardine",
  ];
  for (const name of expected) {
    const entry = byName.get(name);
    assert.ok(entry, name);
    assert.equal(entry.kind, "distillery", name);
    assert.equal(entry.country, "Scotland", name);
    assert.equal(entry.region, "Highland", name);
  }
  for (const name of ["Glenesk", "Glenlochy", "Glenugie", "Glenury Royal", "Inchmurrin", "Knockdhu", "Lochside", "Macduff", "Millburn", "North Port", "Royal Lochnagar"]) {
    assert.equal(byName.get(name)?.country, null, name);
  }
});

test("Teaninich and Annandale have exact managed Scotland identities", () => {
  const byName = new Map(reference.entries.map((entry) => [entry.canonical_name, entry]));

  const teaninich = byName.get("Teaninich");
  assert.ok(teaninich);
  assert.deepEqual(teaninich.aliases, ["ティーニニック"]);
  assert.equal(teaninich.kind, "distillery");
  assert.equal(teaninich.country, "Scotland");
  assert.equal(teaninich.region, "Highland");

  const annandale = byName.get("Annandale");
  assert.ok(annandale);
  assert.deepEqual(annandale.aliases, ["Annandale Distillery"]);
  assert.equal(annandale.kind, "distillery");
  assert.equal(annandale.country, "Scotland");
  assert.equal(annandale.region, "Lowland");
  assert.equal(reference.entries.some((entry) => entry.canonical_name === "Annandale Distillery"), false);

  const collision = clone();
  collision.entries.find((entry) => entry.canonical_name === "Teaninich").aliases.push("Annandale Distillery");
  assert.throws(() => validateWhiskyEntities(collision), /global alias collision/);
});

test("Collection company-style observations resolve only through explicit exact aliases", () => {
  const byName = new Map(reference.entries.map((entry) => [entry.canonical_name, entry]));

  const edradour = byName.get("Edradour");
  assert.ok(edradour);
  assert.deepEqual(edradour.aliases, ["Edradour Distillery Co. Ltd", "エドラダワー"]);
  assert.equal(edradour.country, "Scotland");
  assert.equal(edradour.region, "Highland");

  const ardnamurchan = byName.get("Ardnamurchan");
  assert.ok(ardnamurchan);
  assert.deepEqual(ardnamurchan.aliases, ["The Ardnamurchan Distillery", "アードナムルッカン"]);
  assert.equal(ardnamurchan.country, "Scotland");
  assert.equal(ardnamurchan.region, "Highland");

  for (const alias of ["Edradour Distillery Co. Ltd", "The Ardnamurchan Distillery"]) {
    assert.equal(reference.entries.some((entry) => entry.canonical_name === alias), false);
  }

  const collision = clone();
  collision.entries.find((entry) => entry.canonical_name === "Ardnamurchan").aliases.push("Edradour Distillery Co. Ltd");
  assert.throws(() => validateWhiskyEntities(collision), /global alias collision/);
});

test("Annandale preserves the canonical naming policy without runtime suffix normalization", () => {
  const annandale = reference.entries.find((entry) => entry.canonical_name === "Annandale");
  assert.ok(annandale);
  assert.deepEqual(annandale.aliases, ["Annandale Distillery"]);
  assert.equal(reference.entries.some((entry) => entry.canonical_name === "Annandale Distillery"), false);
});

test("B05-B08 official country values are confirmed and unresolved entries stay null", () => {
  const byName = new Map(reference.entries.map((value) => [value.canonical_name, value]));
  const expected = {
    Cotswolds: ["England", "England"],
    "Warenghem (Armorik)": ["France", "France"],
    Aberfeldy: ["Scotland", "Highland"],
    Ardnamurchan: ["Scotland", "Highland"],
    "Ben Nevis": ["Scotland", "Highland"],
    "Blair Athol": ["Scotland", "Highland"],
    Brora: ["Scotland", "Highland"],
    Clynelish: ["Scotland", "Highland"],
    Dalwhinnie: ["Scotland", "Highland"],
    Edradour: ["Scotland", "Highland"],
    Fettercairn: ["Scotland", "Highland"],
    "Glen Garioch": ["Scotland", "Highland"],
    "Glen Ord": ["Scotland", "Highland"],
    Glencadam: ["Scotland", "Highland"],
  };
  for (const [name, [country, region]] of Object.entries(expected)) {
    const entry = byName.get(name);
    assert.ok(entry, name);
    assert.equal(entry.kind, "distillery", name);
    assert.equal(entry.country, country, name);
    assert.equal(entry.region, region, name);
  }
  for (const name of ["St George's", "Ardmore", "Balblair", "Brackla", "Croftengea", "Dalmore", "Deanston", "Glen Albyn", "Glen Mhor"]) {
    assert.equal(byName.get(name)?.country, null, name);
  }
});

test("audited Collection distilleries retain exact managed identities", () => {
  const byName = new Map(reference.entries.map((entry) => [entry.canonical_name, entry]));
  const expected = {
    Linkwood: ["Scotland", "Speyside", "malt", "operational_default"],
    Bunnahabhain: ["Scotland", "Islay", "malt", "operational_default"],
    Springbank: ["Scotland", "Campbeltown", "malt", "operational_default"],
    Bruichladdich: ["Scotland", "Islay", "malt", "operational_default"],
    "Lindores Abbey": ["Scotland", "Lowland", "malt", "managed_reference"],
    Saburomaru: ["Japan", "Toyama", "malt", "operational_default"],
    Glasgow: ["Scotland", "Scotland", "malt", "operational_default"],
  };
  for (const [name, [country, region, type, basis]] of Object.entries(expected)) {
    const entry = byName.get(name);
    assert.ok(entry, name);
    assert.equal(entry.kind, "distillery", name);
    assert.equal(entry.country, country, name);
    assert.equal(entry.region, region, name);
    assert.equal(entry.distillery_type, type, name);
    assert.equal(entry.distillery_type_basis, basis, name);
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
