"use client";

import { useEffect, useMemo, useState } from "react";

type TasteReactionProps = {
  bottleName: string;
  bottleSlug: string;
};

const reactions = [
  {
    label: "また飲みたい",
    value: "want_again",
    feedback: "次のおすすめに覚えておきます。",
  },
  {
    label: "たまになら",
    value: "occasionally",
    feedback: "気分に合わせて参考にします。",
  },
  {
    label: "別のタイプ",
    value: "different_type",
    feedback: "次は別のタイプも探してみます。",
  },
] as const;

type ReactionValue = (typeof reactions)[number]["value"];
type Reaction = (typeof reactions)[number];
type LegacyReactionValue = "positive" | "neutral" | "negative";

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
      const reactionValue = normalizeReactionValue(storedReaction.reaction);

      if (storedReaction.bottleSlug === bottleSlug && reactionValue) {
        setSelectedReaction(reactionValue);
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

  const selectedFeedback = reactions.find(
    (reaction) => reaction.value === selectedReaction,
  )?.feedback;

  return (
    <section className="detailCard tasteReactionCard" aria-labelledby="taste-reaction-title">
      <p className="sectionKicker">Next Pick</p>
      <h2 id="taste-reaction-title">この一本、次も選びたい？</h2>
      <div
        className="tasteReactionButtons"
        role="group"
        aria-label={`${bottleName} を次のおすすめに反映する方向性`}
      >
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
      <p className="tasteReactionHelper">次のおすすめに少しずつ反映します</p>
      {hasSaved && selectedFeedback ? (
        <p className="tasteReactionFeedback" role="status">
          {selectedFeedback}
        </p>
      ) : null}
    </section>
  );
}

function normalizeReactionValue(value: unknown): ReactionValue | null {
  if (isReactionValue(value)) {
    return value;
  }

  const legacyValues: Record<LegacyReactionValue, ReactionValue> = {
    positive: "want_again",
    neutral: "occasionally",
    negative: "different_type",
  };

  if (isLegacyReactionValue(value)) {
    return legacyValues[value];
  }

  return null;
}

function isReactionValue(value: unknown): value is ReactionValue {
  return reactions.some((reaction) => reaction.value === value);
}

function isLegacyReactionValue(value: unknown): value is LegacyReactionValue {
  return value === "positive" || value === "neutral" || value === "negative";
}
