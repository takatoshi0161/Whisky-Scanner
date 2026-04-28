"use client";

import { useMemo, useState } from "react";

import { ScanUploader } from "./scan-uploader";

type HealthStatus = {
  status: string;
  database: string;
};

type Recommendation = {
  name: string;
  tags: string[];
  reason: string;
  match: string;
};

const moods = [
  "癒されたい",
  "スモーク欲しい",
  "ご褒美",
  "食事と合わせたい",
  "冒険したい",
  "ハイボールしたい",
] as const;

type Mood = (typeof moods)[number];

const favoriteBottle = {
  name: "The Balvenie DoubleWood 12",
  style: "蜂蜜 / ドライフルーツ / やわらかな樽香",
  memory: "甘さと余韻の長さが心地よくて、食後にゆっくり飲みたいと思えた一本。",
};

const recommendationsByMood: Record<Mood, Recommendation[]> = {
  "癒されたい": [
    {
      name: "Glenmorangie Original 10",
      tags: ["バニラ", "柑橘", "やさしい"],
      reason: "軽やかな甘さと柑橘感で、力を抜きたい夜に寄り添いやすいから。",
      match: "91%",
    },
    {
      name: "The Balvenie DoubleWood 12",
      tags: ["蜂蜜", "樽香", "なめらか"],
      reason: "最近好きだった甘い余韻に近く、安心して戻れる味わいだから。",
      match: "89%",
    },
    {
      name: "Arran 10",
      tags: ["果実", "モルト", "穏やか"],
      reason: "派手すぎない果実味で、ゆっくり一杯に向いているから。",
      match: "86%",
    },
  ],
  "スモーク欲しい": [
    {
      name: "Bowmore 12",
      tags: ["スモーク", "潮気", "チョコ"],
      reason: "強すぎない煙と甘さがあり、スモーク入門としても選びやすいから。",
      match: "93%",
    },
    {
      name: "Talisker 10",
      tags: ["黒胡椒", "潮気", "焚き火"],
      reason: "ピリッとした余韻があり、気分を切り替えたい夜に合うから。",
      match: "88%",
    },
    {
      name: "Caol Ila 12",
      tags: ["ピート", "レモン", "クリーン"],
      reason: "煙たさはしっかりありつつ、重すぎず飲み進めやすいから。",
      match: "85%",
    },
  ],
  "ご褒美": [
    {
      name: "Glenmorangie Lasanta 12",
      tags: ["シェリー樽", "ドライフルーツ", "なめらか"],
      reason: "好きだった蜂蜜感を残しながら、果実の厚みを少し足せるから。",
      match: "92%",
    },
    {
      name: "Aberlour 12 Double Cask",
      tags: ["濃厚", "蜂蜜", "ご褒美"],
      reason: "やさしい甘さから一歩進んで、満足感のある夜に合うから。",
      match: "88%",
    },
    {
      name: "Bunnahabhain 12",
      tags: ["穏やか", "ナッツ", "潮気"],
      reason: "まろやかな甘さに控えめな海のニュアンスが加わり、新しい発見があるから。",
      match: "84%",
    },
  ],
  "食事と合わせたい": [
    {
      name: "Dewar's 12",
      tags: ["ハニー", "軽快", "食中"],
      reason: "甘さが穏やかで、炭酸割りでも食事の邪魔をしにくいから。",
      match: "90%",
    },
    {
      name: "Monkey Shoulder",
      tags: ["モルト", "バニラ", "万能"],
      reason: "ハイボールでもロックでも合わせやすく、料理を選びにくいから。",
      match: "87%",
    },
    {
      name: "Chivas Regal Mizunara 12",
      tags: ["やわらか", "樽香", "和食"],
      reason: "穏やかな樽の香りで、和食や軽めのつまみに寄せやすいから。",
      match: "84%",
    },
  ],
  "冒険したい": [
    {
      name: "Amrut Fusion",
      tags: ["スパイス", "濃厚", "新世界"],
      reason: "いつもの甘い樽感から少し離れて、香味の広がりを試せるから。",
      match: "89%",
    },
    {
      name: "Kavalan Concertmaster",
      tags: ["トロピカル", "ワイン樽", "華やか"],
      reason: "果実感がはっきりしていて、次の発見として分かりやすいから。",
      match: "86%",
    },
    {
      name: "Nikka From The Barrel",
      tags: ["力強い", "スパイス", "濃密"],
      reason: "アルコール感と厚みがあり、少量でも満足する冒険感があるから。",
      match: "83%",
    },
  ],
  "ハイボールしたい": [
    {
      name: "Suntory Whisky Toki",
      tags: ["爽快", "青りんご", "ハイボール"],
      reason: "炭酸で香りが立ちやすく、軽快に今夜の一杯を始められるから。",
      match: "92%",
    },
    {
      name: "The Glenlivet 12",
      tags: ["洋梨", "軽やか", "すっきり"],
      reason: "果実の甘さが炭酸で伸びて、食事前にも飲みやすいから。",
      match: "88%",
    },
    {
      name: "Johnnie Walker Black Label",
      tags: ["スモーク", "バニラ", "定番"],
      reason: "少し煙のある余韻が残り、ハイボールでも物足りなさが出にくいから。",
      match: "85%",
    },
  ],
};

type HomeExperienceProps = {
  health: HealthStatus;
};

export function HomeExperience({ health }: HomeExperienceProps) {
  const [selectedMood, setSelectedMood] = useState<Mood>("ご褒美");
  const recommendations = useMemo(
    () => recommendationsByMood[selectedMood],
    [selectedMood],
  );

  return (
    <main className="appShell">
      <section className="homeHero" aria-labelledby="home-title">
        <p className="appName">Whisky Journey</p>
        <h1 id="home-title">好きだった一本から、次の一本へ。</h1>
        <p className="heroCopy">
          今夜の気分と、最近好きだった記憶から、あなたに合いそうな一本を選びます。
        </p>
        <button className="primaryAction" type="button">
          今夜の一本を選ぶ
        </button>
      </section>

      <section className="moodSection" aria-labelledby="mood-title">
        <div className="sectionHeader">
          <p className="sectionKicker">Tonight</p>
          <h2 id="mood-title">今夜どんな気分？</h2>
        </div>
        <div className="moodGrid">
          {moods.map((mood) => (
            <button
              aria-pressed={selectedMood === mood}
              className={`moodButton${selectedMood === mood ? " isSelected" : ""}`}
              key={mood}
              onClick={() => setSelectedMood(mood)}
              type="button"
            >
              {mood}
            </button>
          ))}
        </div>
      </section>

      <section className="recentSection" aria-labelledby="recent-title">
        <div className="sectionHeader">
          <p className="sectionKicker">Last Favorite</p>
          <h2 id="recent-title">最近好きだった一本</h2>
        </div>
        <article className="favoriteCard">
          <div className="bottleGlow" aria-hidden="true">
            <span />
          </div>
          <div>
            <p className="bottleLabel">記憶の基準</p>
            <h3>{favoriteBottle.name}</h3>
            <p className="tasteNote">{favoriteBottle.style}</p>
            <p className="memoryText">{favoriteBottle.memory}</p>
          </div>
        </article>
      </section>

      <section className="recommendSection" aria-labelledby="recommend-title">
        <div className="sectionHeader rowHeader">
          <div>
            <p className="sectionKicker">For You</p>
            <h2 id="recommend-title">あなた向けおすすめ3本</h2>
          </div>
          <span className="todayBadge">{selectedMood}</span>
        </div>

        <div className="recommendList">
          {recommendations.map((bottle, index) => (
            <article className="recommendCard" key={bottle.name}>
              <div className="rank">{index + 1}</div>
              <div className="recommendBody">
                <div className="recommendTop">
                  <div className="tagList">
                    {bottle.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <span className="matchScore">{bottle.match}</span>
                </div>
                <h3>{bottle.name}</h3>
                <p>{bottle.reason}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="scanSection" aria-labelledby="scan-title">
        <div className="sectionHeader">
          <p className="sectionKicker">Label Search</p>
          <h2 id="scan-title">ラベルから探す</h2>
        </div>
        <p className="sectionLead">
          手元のボトル名が分からないときだけ、ラベル画像から候補を探せます。
        </p>
        <ScanUploader />
      </section>

      <section className="devStatus" aria-label="開発用接続状態">
        <span>dev</span>
        <dl>
          <div>
            <dt>API</dt>
            <dd>{health.status}</dd>
          </div>
          <div>
            <dt>DB</dt>
            <dd>{health.database}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
