"use client";

import { useState } from "react";

type TasteReactionProps = {
  bottleName: string;
  bottleSlug: string;
};

const reactions = [
  { label: "好き", value: "like" },
  { label: "そうでもない", value: "neutral" },
  { label: "苦手", value: "dislike" },
] as const;

type ReactionValue = (typeof reactions)[number]["value"];
type Reaction = (typeof reactions)[number];

export function TasteReaction({ bottleName, bottleSlug }: TasteReactionProps) {
  const [selectedReaction, setSelectedReaction] = useState<ReactionValue | null>(null);

  function handleSelect(reaction: Reaction) {
    setSelectedReaction(reaction.value);
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
    </section>
  );
}
