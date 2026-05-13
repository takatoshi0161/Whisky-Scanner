"use client";

import { useEffect, useMemo, useState } from "react";

type TasteReactionValue = "positive" | "neutral" | "negative";

type StoredTasteReaction = {
  reaction: TasteReactionValue;
  bottleSlug: string;
  bottleName: string;
  updatedAt: string;
};

type TasteReactionProps = {
  bottleSlug: string;
  bottleName: string;
};

const reactionOptions: Array<{
  label: string;
  value: TasteReactionValue;
}> = [
  { label: "好き", value: "positive" },
  { label: "そうでもない", value: "neutral" },
  { label: "苦手", value: "negative" },
];

export function TasteReaction({ bottleSlug, bottleName }: TasteReactionProps) {
  const [selectedReaction, setSelectedReaction] = useState<TasteReactionValue | null>(null);
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
        isTasteReactionValue(storedReaction.reaction)
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

  const handleReactionSelect = (reaction: TasteReactionValue) => {
    const storedReaction: StoredTasteReaction = {
      reaction,
      bottleSlug,
      bottleName,
      updatedAt: new Date().toISOString(),
    };

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(storedReaction));
      setSelectedReaction(reaction);
      setHasSaved(true);
      console.log("Taste reaction saved", storedReaction);
    } catch (error) {
      console.warn("Failed to save taste reaction", {
        bottleSlug,
        reaction,
        error,
      });
    }
  };

  return (
    <section className="detailCard tasteReactionCard" aria-labelledby="taste-reaction-title">
      <p className="sectionKicker">Taste Profile</p>
      <h2 id="taste-reaction-title">この味の記憶</h2>
      <p className="tasteReactionLead">
        次の一本を選びやすくするために、今の好みとして軽く覚えておきます。
      </p>
      <div className="tasteReactionButtons" role="group" aria-label={`${bottleName}の好み`}>
        {reactionOptions.map((option) => {
          const isSelected = selectedReaction === option.value;

          return (
            <button
              key={option.value}
              type="button"
              className={`tasteReactionButton${isSelected ? " isSelected" : ""}`}
              aria-pressed={isSelected}
              onClick={() => handleReactionSelect(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {hasSaved ? (
        <p className="tasteReactionFeedback" role="status">
          好みを覚えました
        </p>
      ) : null}
    </section>
  );
}

function isTasteReactionValue(value: unknown): value is TasteReactionValue {
  return value === "positive" || value === "neutral" || value === "negative";
}
