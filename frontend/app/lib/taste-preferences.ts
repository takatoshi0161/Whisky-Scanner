export const TASTE_PREFERENCES_STORAGE_KEY = "whisky-scanner:taste-preferences";

export type TastePreferenceReaction =
  | "want_again"
  | "occasionally"
  | "different_type";

export type TastePreferenceTagSummary = {
  tag: string;
  count: number;
  updatedAt: string;
};

type StoredTastePreferenceTag = {
  count: number;
  updatedAt: string;
  bottleSlugs: string[];
};

type StoredTastePreferences = {
  version: 1;
  tags: Record<string, StoredTastePreferenceTag>;
};

type SaveTastePreferenceInput = {
  reaction: TastePreferenceReaction;
  bottleSlug: string;
  preferenceTags: string[];
  storage?: Storage;
};

export function restoreTastePreferenceTags(storage = window.localStorage) {
  return summarizeTastePreferences(readTastePreferences(storage));
}

export function saveTastePreferenceInput({
  reaction,
  bottleSlug,
  preferenceTags,
  storage = window.localStorage,
}: SaveTastePreferenceInput) {
  const storedPreferences = readTastePreferences(storage);

  if (!shouldAccumulatePreferenceTags(reaction) || preferenceTags.length === 0) {
    return summarizeTastePreferences(storedPreferences);
  }

  const updatedAt = new Date().toISOString();
  const uniquePreferenceTags = Array.from(new Set(preferenceTags));

  for (const tag of uniquePreferenceTags) {
    const currentTag = storedPreferences.tags[tag] ?? {
      count: 0,
      updatedAt,
      bottleSlugs: [],
    };

    if (!currentTag.bottleSlugs.includes(bottleSlug)) {
      currentTag.count += 1;
      currentTag.bottleSlugs = [...currentTag.bottleSlugs, bottleSlug];
    }

    currentTag.updatedAt = updatedAt;
    storedPreferences.tags[tag] = currentTag;
  }

  storage.setItem(
    TASTE_PREFERENCES_STORAGE_KEY,
    JSON.stringify(storedPreferences),
  );

  return summarizeTastePreferences(storedPreferences);
}

function shouldAccumulatePreferenceTags(reaction: TastePreferenceReaction) {
  return reaction === "want_again" || reaction === "occasionally";
}

function readTastePreferences(storage: Storage): StoredTastePreferences {
  const fallback: StoredTastePreferences = {
    version: 1,
    tags: {},
  };

  try {
    const storedValue = storage.getItem(TASTE_PREFERENCES_STORAGE_KEY);

    if (!storedValue) {
      return fallback;
    }

    return normalizeTastePreferences(JSON.parse(storedValue));
  } catch (error) {
    console.warn("Failed to restore taste preference tags", { error });
    return fallback;
  }
}

function normalizeTastePreferences(value: unknown): StoredTastePreferences {
  if (!isRecord(value) || !isRecord(value.tags)) {
    return {
      version: 1,
      tags: {},
    };
  }

  const tags: Record<string, StoredTastePreferenceTag> = {};

  for (const [tag, preferenceTag] of Object.entries(value.tags)) {
    if (!isRecord(preferenceTag)) {
      continue;
    }

    const count = Number(preferenceTag.count);
    const updatedAt =
      typeof preferenceTag.updatedAt === "string"
        ? preferenceTag.updatedAt
        : "";
    const bottleSlugs = Array.isArray(preferenceTag.bottleSlugs)
      ? preferenceTag.bottleSlugs.filter(
          (bottleSlug): bottleSlug is string => typeof bottleSlug === "string",
        )
      : [];

    if (!Number.isFinite(count) || count <= 0 || bottleSlugs.length === 0) {
      continue;
    }

    tags[tag] = {
      count,
      updatedAt,
      bottleSlugs,
    };
  }

  return {
    version: 1,
    tags,
  };
}

function summarizeTastePreferences(storedPreferences: StoredTastePreferences) {
  return Object.entries(storedPreferences.tags)
    .map(([tag, preferenceTag]) => ({
      tag,
      count: preferenceTag.count,
      updatedAt: preferenceTag.updatedAt,
    }))
    .sort((currentTag, nextTag) => {
      if (nextTag.count !== currentTag.count) {
        return nextTag.count - currentTag.count;
      }

      return nextTag.updatedAt.localeCompare(currentTag.updatedAt);
    })
    .slice(0, 5);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
