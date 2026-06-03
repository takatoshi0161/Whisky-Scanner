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
      "スモーキーさを残しつつ、ゆっくり飲む満足感を広げやすい一本。",
    detailRecommendation:
      "「重めのスモーキー系」が好きならかなり近い方向。厚みのある甘さもあるので、休日にじっくり飲みたい日にも向いています。",
    directionTags: ["smoky", "coastal", "rich"],
    moodTags: ["quiet-night", "after-dinner", "slow-drink"],
    sceneTags: ["solo-drink", "deep-smoke", "nightcap"],
  },
  ardbeg10yearold: {
    bottleId: "ardbeg10yearold",
    cardRecommendation:
      "「煙感強め・ドライ寄り」が好きならかなり近い方向。",
    detailRecommendation:
      "しっかりした煙感は欲しいけど、甘さは控えめにしたい人向け。キレもあるので、ハイボールでも楽しみやすい一本です。",
    directionTags: ["smoky", "peaty", "dry"],
    moodTags: ["adventurous", "quiet-night", "slow-drink"],
    sceneTags: ["bold-smoke", "solo-drink", "after-dinner"],
  },
  laphroaig10yearold: {
    bottleId: "laphroaig10yearold",
    cardRecommendation:
      "力強いスモークや潮気が印象的な一本。\n\nピートをもっと楽しみたいならArdbeg 10、\n海沿いらしい個性を少し違う形で味わうならTalisker 10もおすすめです。",
    detailRecommendation:
      "Laphroaig 10の魅力は、強いピートだけでなく、\n潮気や薬品感まで含めた独特の個性にあります。\n\nこの方向が好きなら、\nより力強いスモークを感じられるArdbeg 10や、\n潮気を活かしたTalisker 10へ進んでみるのも面白い選択です。\n\n逆にピートは好きだけれど少し甘さも欲しいなら、\nLagavulin 16のような重厚なタイプも候補になります。",
    directionTags: ["peat-forward", "coastal", "medicinal", "smoky"],
    moodTags: ["じっくり", "個性的", "夜更け"],
    sceneTags: ["一人飲み", "バータイム", "ゆっくり飲みたい夜"],
  },
  bowmore12yearold: {
    bottleId: "bowmore12yearold",
    cardRecommendation:
      "スモーキーさを少しやわらかめに楽しみたい時向け。",
    detailRecommendation:
      "「ピート系は気になるけど、重すぎるのは避けたい」人にも入りやすい方向。ほどよい甘さもあるので、夜にゆっくり飲みたい日にも合います。",
    directionTags: ["smoky", "coastal", "gentle"],
    moodTags: ["relaxing", "rainy-day", "slow-drink"],
    sceneTags: ["first-islay", "home-drink", "bar-time"],
  },
  talisker10yearold: {
    bottleId: "talisker10yearold",
    cardRecommendation:
      "スモーキーさを残しつつ、キレを楽しみやすい方向。",
    detailRecommendation:
      "「煙感は欲しいけど、重たすぎるのは避けたい」人向け。スパイシーさもあるので、食事と合わせたい日にも向いています。",
    directionTags: ["coastal", "spicy", "smoky"],
    moodTags: ["rainy-day", "refreshing", "slow-drink"],
    sceneTags: ["highball", "solo-drink", "bar-time"],
  },
  springbank10yearold: {
    bottleId: "springbank10yearold",
    cardRecommendation:
      "少しクセ感のあるモルトを広げたい時にも試しやすい一本。",
    detailRecommendation:
      "「香ばしさやモルト感」をしっかり楽しみたい人向け。スモーキーさも軽く感じられるので、いつもの方向を少し広げたい時にも合います。",
    directionTags: ["oily", "coastal", "complex"],
    moodTags: ["slow-drink", "quiet-night", "curious"],
    sceneTags: ["solo-drink", "deep-dive", "after-dinner"],
  },
  arran10yearold: {
    bottleId: "arran10yearold",
    cardRecommendation:
      "フルーティさを軽やかに楽しみたい日に向いた方向。",
    detailRecommendation:
      "「華やか系を飲みたいけど、重すぎる甘さは避けたい」人にも試しやすいタイプ。軽やかなので、食後に一杯だけ飲みたい日にも向いています。",
    directionTags: ["fruity", "light", "malty"],
    moodTags: ["relaxing", "fresh-start", "easy-night"],
    sceneTags: ["home-drink", "first-single-malt", "casual"],
  },
  glenfarclas12yearold: {
    bottleId: "glenfarclas12yearold",
    cardRecommendation:
      "濃いめの甘さを、ゆっくり楽しみたい日に向いた一本。",
    detailRecommendation:
      "「シェリー系のコク」をしっかり楽しみたい人向け。重たすぎずまとまりもあるので、休日にゆっくり飲みたい時にも試しやすいです。",
    directionTags: ["sherry", "sweet", "nutty"],
    moodTags: ["after-dinner", "quiet-night", "slow-drink"],
    sceneTags: ["dessert-pairing", "home-drink", "nightcap"],
  },
  glenfiddich12yearold: {
    bottleId: "glenfiddich12yearold",
    cardRecommendation:
      "軽やかなフルーティ系を自然に試しやすい方向。",
    detailRecommendation:
      "「飲みやすいシングルモルト」を探している人にも入りやすいタイプ。すっきりした方向なので、普段ハイボール中心の人にも合いやすいです。",
    directionTags: ["fruity", "light", "fresh"],
    moodTags: ["relaxing", "fresh-start", "easy-night"],
    sceneTags: ["first-single-malt", "home-drink", "casual"],
  },
  themacallan12yearold: {
    bottleId: "themacallan12yearold",
    cardRecommendation:
      "甘さとコクを、ゆっくり広げたい日に向いた方向。",
    detailRecommendation:
      "「濃いめの甘さ」をしっかり楽しみたい人向け。重厚すぎず飲みやすさもあるので、食後にゆっくり飲みたい日にも合います。",
    directionTags: ["sherry", "elegant", "rich"],
    moodTags: ["after-dinner", "celebratory", "slow-drink"],
    sceneTags: ["special-night", "gift-idea", "nightcap"],
  },
  benromach10yearold: {
    bottleId: "benromach10yearold",
    cardRecommendation:
      "スモーキーさを少し香ばしめに広げやすいタイプ。",
    detailRecommendation:
      "「軽めのピート感」が好きなら自然に試しやすい方向。モルトの甘さも感じやすいので、夜にゆっくり飲みたい日にも向いています。",
    directionTags: ["sherry", "smoky", "classic"],
    moodTags: ["quiet-night", "after-dinner", "slow-drink"],
    sceneTags: ["home-drink", "classic-malt", "solo-drink"],
  },
};

export function getBottleRecommendation(bottleId: string) {
  return bottleRecommendations[bottleId];
}
