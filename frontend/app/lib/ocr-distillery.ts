import { distilleries, Distillery } from "../data/distilleries";

export type DistilleryCandidate = Pick<Distillery, "name">;

export const unknownDistillery: DistilleryCandidate = {
  name: "Unknown",
};

export function normalizeOcrText(text: string) {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

export function findDistilleryCandidate(text: string): DistilleryCandidate {
  if (!text) {
    return unknownDistillery;
  }

  return (
    distilleries.find((distillery) =>
      [distillery.name, ...distillery.keywords].some((keyword) =>
        text.includes(keyword.toLowerCase()),
      ),
    ) ?? unknownDistillery
  );
}
