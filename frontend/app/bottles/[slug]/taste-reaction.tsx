"use client";

import { useEffect, useMemo, useState } from "react";

type TasteReactionProps = {
  bottleName: string;
  bottleSlug: string;
};

const reactions = [
  { label: "好き", value: "positive" },
  { label: "少し違う", value: "neutral" },
  { label: "苦手", value: "negative" },
] as const;

type ReactionValue = (typeof reactions)[number]["value"];
type Reaction = (typeof reactions)[number];

type StoredTasteReaction = {
  reaction: ReactionValue;
  bottleSlug: string;
  bottleName: string;
  updatedAt: string;
};

export function TasteReaction({ bottleName, bottleSlug }: TasteReactionProps) {
  const [selectedReaction, setSelectedReaction] = useState<ReactionValue | null>(null);
  const [hasSaved, setHasSaved] = useState(false);

  const storageKey = useMemo(
    () => `whisky-scanner:taste-reaction:${bottleSlug}`,
    [bottleSlug],
  );

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(storageKey);

      if (!storedValue) {
        return;
      }

      const storedReaction = JSON.parse(storedValue) as Partial<StoredTasteReaction>;

      if (
        storedReaction.bottleSlug === bottleSlug &&
        isReactionValue(storedReaction.reaction)
      ) {
        setSelectedReaction(storedReaction.reaction);
      }
    } catch (error) {
      console.warn("Failed to restore taste reaction", {
        bottleSlug,
        error,
      });
    }
  }, [bottleSlug, storageKey]);

  function handleSelect(reaction: Reaction) {
    const storedReaction: StoredTasteReaction = {
      reaction: reaction.value,
      bottleSlug,
      bottleName,
      updatedAt: new Date().toISOString(),
    };

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(storedReaction));
      setSelectedReaction(reaction.value);
      setHasSaved(true);
      console.log("taste-reaction", {
        bottle: {
          name: bottleName,
          slug: bottleSlug,
        },
        reaction: {
          label: reaction.label,
          value: reaction.value,
        },
      });
    } catch (error) {
      console.warn("Failed to save taste reaction", {
        bottleSlug,
        reaction: reaction.value,
        error,
      });
    }
  }

  return (
    <section className="detailCard tasteReactionCard" aria-labelledby="taste-reaction-title">
      <p className="sectionKicker">Taste Learning</p>
      <h2 id="taste-reaction-title">これは好みに近かった？</h2>
      <div className="tasteReactionButtons" role="group" aria-label={`${bottleName} の好み確認`}>
        {reactions.map((reaction) => (
          <button
            className={
              selectedReaction === reaction.value
                ? "tasteReactionButton isSelected"
                : "tasteReactionButton"
            }
            key={reaction.value}
            type="button"
            aria-pressed={selectedReaction === reaction.value}
            onClick={() => handleSelect(reaction)}
          >
            {reaction.label}
          </button>
        ))}
      </div>
      {hasSaved ? (
        <p className="tasteReactionFeedback" role="status">
          好みを覚えました
        </p>
      ) : null}
    </section>
  );
}

function isReactionValue(value: unknown): value is ReactionValue {
  return reactions.some((reaction) => reaction.value === value);
}
