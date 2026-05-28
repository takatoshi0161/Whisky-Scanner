import { distilleries, Distillery } from "../data/distilleries";

export type DistilleryCandidate = Pick<
  Distillery,
  "name" | "region" | "bottles"
>;

export const unknownDistillery: DistilleryCandidate = {
  name: "Unknown",
  region: "Unknown",
  bottles: [],
};

export function normalizeOcrText(text: string) {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

function compactText(text: string) {
  return text.replace(/[^a-z0-9]+/g, "");
}

function getBottleAgeMarker(name: string) {
  return name.match(/\b(\d{2})\b/)?.[1];
}

function hasNearbyAgeMarker(text: string, distilleryName: string, age: string) {
  const pattern = new RegExp(
    `${distilleryName.toLowerCase()}[^a-z0-9]{0,24}${age}`,
    "i",
  );
  return pattern.test(text);
}

function hasAgeMarker(text: string, age: string) {
  return new RegExp(`\\b${age}\\b`).test(text);
}

function scoreDistilleryCandidate(
  distillery: Distillery,
  normalizedText: string,
) {
  const compactOcrText = compactText(normalizedText);
  let score = 0;

  if (normalizedText.includes(distillery.name.toLowerCase())) {
    score += 100;
  }

  for (const keyword of distillery.keywords) {
    if (normalizedText.includes(keyword.toLowerCase())) {
      score += 70;
    }
  }

  for (const bottle of distillery.bottles) {
    const normalizedBottleName = bottle.name.toLowerCase();

    if (normalizedText.includes(normalizedBottleName)) {
      score += 150;
    }

    if (compactOcrText.includes(compactText(normalizedBottleName))) {
      score += 120;
    }

    const age = getBottleAgeMarker(bottle.name);

    if (age && hasNearbyAgeMarker(normalizedText, distillery.name, age)) {
      score += 80;
    }

    if (
      age &&
      normalizedText.includes(distillery.name.toLowerCase()) &&
      hasAgeMarker(normalizedText, age)
    ) {
      score += 40;
    }
  }

  return score;
}

export function findDistilleryCandidate(text: string): DistilleryCandidate {
  if (!text) {
    return unknownDistillery;
  }

  const candidates = distilleries
    .map((distillery) => ({
      distillery,
      score: scoreDistilleryCandidate(distillery, text),
    }))
    .filter((candidate) => candidate.score > 0)
    .sort((current, next) => next.score - current.score);

  return candidates[0]?.distillery ?? unknownDistillery;
}
