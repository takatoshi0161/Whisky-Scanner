import { ScanUploader } from "./scan-uploader";

const moods = [
  "癒されたい",
  "スモーク欲しい",
  "ご褒美",
  "食事と合わせたい",
  "冒険したい",
  "ハイボールしたい",
];

const favoriteBottle = {
  name: "The Balvenie DoubleWood 12",
  style: "蜂蜜 / ドライフルーツ / やわらかな樽香",
  memory: "甘さと余韻の長さが心地よくて、食後にゆっくり飲みたいと思えた一本。",
};

const recommendations = [
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
];

async function getHealthStatus() {
  const apiBaseUrl =
    process.env.INTERNAL_API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://backend:8000";

  try {
    const response = await fetch(`${apiBaseUrl}/health`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return { status: "unavailable", database: "unknown" };
    }

    return response.json();
  } catch {
    return { status: "unavailable", database: "unknown" };
  }
}

export default async function HomePage() {
  const health = await getHealthStatus();

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
            <button className="moodButton" key={mood} type="button">
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
          <span className="todayBadge">今夜</span>
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
