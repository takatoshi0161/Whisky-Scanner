export type BottleRecommendation = {
  bottleId: string;
  cardRecommendation: string;
  detailRecommendation: string;
  directionTags: string[];
  moodTags: string[];
  sceneTags: string[];
};

const bottleRecommendations: Record<string, BottleRecommendation> = {
  lagavulin16yearold: {
    bottleId: "lagavulin16yearold",
    cardRecommendation:
      "深いスモークや余韻をゆっくり楽しみたい夜に。強い味わいへ進みたいときの候補です。",
    detailRecommendation:
      "しっかりしたピートや潮気のある味が好きなら、この方向は次の一本の手がかりになります。食後に少し時間をかけて、濃い余韻を楽しみたい日に向いています。",
    directionTags: ["smoky", "coastal", "rich"],
    moodTags: ["quiet-night", "after-dinner", "slow-drink"],
    sceneTags: ["solo-drink", "deep-smoke", "nightcap"],
  },
  ardbeg10yearold: {
    bottleId: "ardbeg10yearold",
    cardRecommendation:
      "はっきりしたスモークを試したいならこの方向。力強い一本に進みたい日に合います。",
    detailRecommendation:
      "スモーキーさをもっと前に出したいときに選びやすい候補です。甘さよりもピートやドライな余韻を楽しみたい夜の手がかりになります。",
    directionTags: ["smoky", "peaty", "dry"],
    moodTags: ["adventurous", "quiet-night", "slow-drink"],
    sceneTags: ["bold-smoke", "solo-drink", "after-dinner"],
  },
  bowmore12yearold: {
    bottleId: "bowmore12yearold",
    cardRecommendation:
      "やわらかなスモークから入りたいときに。アイラらしさを穏やかに試せる候補です。",
    detailRecommendation:
      "スモーキーな方向に興味はあるけれど、強すぎる味は少し不安なときに見やすい一本です。潮気や甘さもあり、最初のアイラ候補としても使いやすい手がかりになります。",
    directionTags: ["smoky", "coastal", "gentle"],
    moodTags: ["relaxing", "rainy-day", "slow-drink"],
    sceneTags: ["first-islay", "home-drink", "bar-time"],
  },
  talisker10yearold: {
    bottleId: "talisker10yearold",
    cardRecommendation:
      "潮気やスパイス感がほしい日に。甘さだけではない一本へ進みたいときの候補です。",
    detailRecommendation:
      "果実の甘さよりも、潮気や黒胡椒のような刺激を少し足したいときに向いています。ハイボールでも個性が残りやすく、気分を切り替えたい日の手がかりになります。",
    directionTags: ["coastal", "spicy", "smoky"],
    moodTags: ["rainy-day", "refreshing", "slow-drink"],
    sceneTags: ["highball", "solo-drink", "bar-time"],
  },
  springbank10yearold: {
    bottleId: "springbank10yearold",
    cardRecommendation:
      "素朴さや奥行きのある味を探したいときに。少し通好みの方向へ進む候補です。",
    detailRecommendation:
      "きれいに整いすぎた味よりも、香ばしさやオイリーさのある表情を楽しみたい日に合います。ゆっくり飲みながら変化を見る一本として使いやすい手がかりです。",
    directionTags: ["oily", "coastal", "complex"],
    moodTags: ["slow-drink", "quiet-night", "curious"],
    sceneTags: ["solo-drink", "deep-dive", "after-dinner"],
  },
  arran10yearold: {
    bottleId: "arran10yearold",
    cardRecommendation:
      "明るい果実感と軽やかさを探す日に。重すぎない一本へ進みたいときの候補です。",
    detailRecommendation:
      "華やかな果実感やモルトの甘さを、気軽に楽しみたいときに見やすい一本です。強いスモークよりも、明るく飲み進めやすい方向を探す手がかりになります。",
    directionTags: ["fruity", "light", "malty"],
    moodTags: ["relaxing", "fresh-start", "easy-night"],
    sceneTags: ["home-drink", "first-single-malt", "casual"],
  },
  glenfarclas12yearold: {
    bottleId: "glenfarclas12yearold",
    cardRecommendation:
      "シェリー樽の甘みをゆっくり楽しみたい日に。食後の一杯として見やすい候補です。",
    detailRecommendation:
      "ドライフルーツやナッツのような甘さが好きなら、この方向は次の一本の手がかりになります。強いスモークよりも、落ち着いた甘みを食後に楽しみたい日に向いています。",
    directionTags: ["sherry", "sweet", "nutty"],
    moodTags: ["after-dinner", "quiet-night", "slow-drink"],
    sceneTags: ["dessert-pairing", "home-drink", "nightcap"],
  },
  glenfiddich12yearold: {
    bottleId: "glenfiddich12yearold",
    cardRecommendation:
      "青りんごのような軽さを探す日に。すっきりしたシングルモルト候補です。",
    detailRecommendation:
      "重い樽感よりも、軽やかな果実感や飲みやすさを優先したいときに見やすい一本です。最初のシングルモルトや、気軽に開けたい夜の手がかりになります。",
    directionTags: ["fruity", "light", "fresh"],
    moodTags: ["relaxing", "fresh-start", "easy-night"],
    sceneTags: ["first-single-malt", "home-drink", "casual"],
  },
  themacallan12yearold: {
    bottleId: "themacallan12yearold",
    cardRecommendation:
      "上品な甘みや樽の深みを探す日に。少し特別感のある候補です。",
    detailRecommendation:
      "シェリー樽由来の甘みや落ち着いた厚みを楽しみたいときに見やすい一本です。にぎやかに飲むより、食後にゆっくり味を確かめたい日の手がかりになります。",
    directionTags: ["sherry", "elegant", "rich"],
    moodTags: ["after-dinner", "celebratory", "slow-drink"],
    sceneTags: ["special-night", "gift-idea", "nightcap"],
  },
  benromach10yearold: {
    bottleId: "benromach10yearold",
    cardRecommendation:
      "甘さに少しスモークを足したいときに。クラシックな方向へ進む候補です。",
    detailRecommendation:
      "シェリーの甘みだけでは少し物足りない日に、やさしいピート感を足す手がかりになります。派手すぎず、食後や静かな夜にじっくり試しやすい一本です。",
    directionTags: ["sherry", "smoky", "classic"],
    moodTags: ["quiet-night", "after-dinner", "slow-drink"],
    sceneTags: ["home-drink", "classic-malt", "solo-drink"],
  },
};

export function getBottleRecommendation(bottleId: string) {
  return bottleRecommendations[bottleId];
}
