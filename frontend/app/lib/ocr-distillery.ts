import { distilleries, Distillery } from "../data/distilleries";

export type DistilleryCandidate = Pick<
  Distillery,
  "name" | "region" | "bottles"
>;

export type OcrTextAnnotation = {
  description: string;
  vertices?: {
    x: number;
    y: number;
  }[];
};

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

function matchesText(value: string, target: string) {
  const normalizedValue = value.toLowerCase();
  const normalizedTarget = target.toLowerCase();
  const compactValue = compactText(normalizedValue);
  const compactTarget = compactText(normalizedTarget);

  return (
    normalizedValue.includes(normalizedTarget) ||
    (compactTarget.length > 0 && compactValue.includes(compactTarget))
  );
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

function getAnnotationBox(annotation: OcrTextAnnotation) {
  const vertices = annotation.vertices?.filter(
    (vertex) => Number.isFinite(vertex.x) && Number.isFinite(vertex.y),
  );

  if (!vertices || vertices.length === 0) {
    return null;
  }

  const xs = vertices.map((vertex) => vertex.x);
  const ys = vertices.map((vertex) => vertex.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const width = Math.max(0, maxX - minX);
  const height = Math.max(0, maxY - minY);

  if (width === 0 || height === 0) {
    return null;
  }

  return {
    minX,
    maxX,
    minY,
    maxY,
    width,
    height,
    area: width * height,
    centerX: minX + width / 2,
    centerY: minY + height / 2,
  };
}

function getAnnotationLayout(annotations: OcrTextAnnotation[]) {
  const boxes = annotations
    .map((annotation) => getAnnotationBox(annotation))
    .filter((box) => box !== null);

  if (boxes.length === 0) {
    return null;
  }

  const minX = Math.min(...boxes.map((box) => box.minX));
  const maxX = Math.max(...boxes.map((box) => box.maxX));
  const minY = Math.min(...boxes.map((box) => box.minY));
  const maxY = Math.max(...boxes.map((box) => box.maxY));
  const width = Math.max(1, maxX - minX);
  const height = Math.max(1, maxY - minY);

  return {
    minX,
    minY,
    width,
    height,
    area: width * height,
    centerX: minX + width / 2,
    centerY: minY + height / 2,
  };
}

function annotationMatchesDistillery(
  annotation: OcrTextAnnotation,
  distillery: Distillery,
) {
  return (
    matchesText(annotation.description, distillery.name) ||
    distillery.keywords.some((keyword) =>
      matchesText(annotation.description, keyword),
    ) ||
    distillery.bottles.some((bottle) =>
      matchesText(annotation.description, bottle.name),
    )
  );
}

function scoreAnnotationVisualWeight(
  annotation: OcrTextAnnotation,
  layout: NonNullable<ReturnType<typeof getAnnotationLayout>>,
) {
  const box = getAnnotationBox(annotation);

  if (!box) {
    return 0;
  }

  const sizeScore = Math.min(40, Math.sqrt(box.area / layout.area) * 160);
  const widthScore = Math.min(20, (box.width / layout.width) * 80);
  const dx = (box.centerX - layout.centerX) / (layout.width / 2);
  const dy = (box.centerY - layout.centerY) / (layout.height / 2);
  const centerDistance = Math.min(1, Math.sqrt(dx * dx + dy * dy));
  const centerScore = (1 - centerDistance) * 20;

  return sizeScore + widthScore + centerScore;
}

function scoreVisualCandidate(
  distillery: Distillery,
  annotations: OcrTextAnnotation[],
) {
  const layout = getAnnotationLayout(annotations);

  if (!layout) {
    return 0;
  }

  return Math.min(
    80,
    Math.max(
      0,
      ...annotations
        .filter((annotation) => annotationMatchesDistillery(annotation, distillery))
        .map((annotation) => scoreAnnotationVisualWeight(annotation, layout)),
    ),
  );
}

function scoreDistilleryCandidate(
  distillery: Distillery,
  normalizedText: string,
  annotations: OcrTextAnnotation[],
) {
  const compactOcrText = compactText(normalizedText);
  let score = scoreVisualCandidate(distillery, annotations);

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

export function findDistilleryCandidate(
  text: string,
  annotations: OcrTextAnnotation[] = [],
): DistilleryCandidate {
  if (!text) {
    return unknownDistillery;
  }

  const candidates = distilleries
    .map((distillery) => ({
      distillery,
      score: scoreDistilleryCandidate(distillery, text, annotations),
    }))
    .filter((candidate) => candidate.score > 0)
    .sort((current, next) => next.score - current.score);

  return candidates[0]?.distillery ?? unknownDistillery;
}
