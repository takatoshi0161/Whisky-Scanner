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
  longrowpeated: {
    bottleId: "longrowpeated",
    cardRecommendation:
      "潮気や麦の厚みに、心地よいスモークが重なる一本。\n\nこの方向が好きならSpringbank 10で麦の個性を楽しんだり、\n\nArdbeg 10でさらに力強いピートへ進んでみるのもおすすめです。",
    detailRecommendation:
      "Longrow Peated の魅力は、\n\nキャンベルタウンらしい麦の厚みや潮気を残しながら、\n\nしっかりとスモークを感じられるところにあります。\n\nこの方向が好きなら、\n\nSpringbank 10でより複雑なバランスを楽しんだり、\n\nArdbeg 10でピートをさらに前面に感じるスタイルへ進むのも面白い選択です。\n\nまた、潮気や力強さを別の形で味わいたいなら、\n\nTalisker 10も候補になります。",
    directionTags: ["peated", "coastal", "malt-forward", "campbeltown"],
    moodTags: ["じっくり", "落ち着いた夜", "探求したい"],
    sceneTags: ["一人飲み", "バータイム", "ゆっくり飲みたい夜"],
  },
  highlandpark12yearold: {
    bottleId: "highlandpark12yearold",
    cardRecommendation:
      "蜂蜜のような甘みと穏やかなスモークが重なる一本。\n\nシェリー系の甘さが好きならThe Macallan 12へ、\nもう少し潮気やピートを感じたいならTalisker 10へ進んでみるのもおすすめです。",
    detailRecommendation:
      "Highland Park 12 の魅力は、\n蜂蜜のような甘みやシェリー樽のニュアンスに、\n控えめなスモークが重なるバランスにあります。\n\nこの方向が好きなら、\nよりシェリーの甘みを楽しめるThe Macallan 12や、\n潮気とピートを少し強めに感じられるTalisker 10へ進んでみるのも面白い選択です。\n\nピートに苦手意識がある人でも、\n甘みとのバランスで楽しみやすい一本です。",
    directionTags: ["balanced-peat", "sherry", "honeyed", "island"],
    moodTags: ["落ち着いた夜", "穏やか", "少し広げたい"],
    sceneTags: ["食後", "ゆっくり飲みたい夜", "バータイム"],
  },
  oban14yearold: {
    bottleId: "oban14yearold",
    cardRecommendation:
      "海沿いらしい潮気と、やわらかな果実感のバランスが心地よい一本。\n\nTalisker 10の潮気が好きなら少し穏やかな方向として、\nArran 10が好きなら海沿いのニュアンスを足す一本としておすすめです。",
    detailRecommendation:
      "Oban 14 の魅力は、\n強く主張しすぎない潮気と、\n果実感や麦のやわらかさがきれいにまとまっているところにあります。\n\nTalisker 10の海沿いらしさが好きだけれど、\nもう少し穏やかに楽しみたいならOban 14は良い候補です。\n\nArran 10のような飲みやすさが好きな人にも、\n少し潮気のある方向へ広げる一本として試しやすいと思います。",
    directionTags: ["coastal", "balanced", "fruit-forward", "highland"],
    moodTags: ["穏やか", "落ち着いた夜", "自然体"],
    sceneTags: ["食後", "ゆっくり飲みたい夜", "初めてのバー"],
  },
  balveniedoublewood12yearold: {
    bottleId: "balveniedoublewood12yearold",
    cardRecommendation:
      "蜂蜜のような甘みと、樽由来のやわらかな香ばしさが楽しめる一本。\n\nGlenfiddich 12が好きなら少し樽感を足す方向で、\nThe Macallan 12が好きならより親しみやすい甘さとしておすすめです。",
    detailRecommendation:
      "Balvenie DoubleWood 12 の魅力は、\n蜂蜜のような甘みやバニラ感に、\n樽由来の香ばしさがやわらかく重なるところにあります。\n\nGlenfiddich 12の飲みやすさが好きなら、\n少し樽感や厚みを足す一本として楽しみやすいと思います。\n\nThe Macallan 12のような甘みが好きだけれど、\nもう少し肩の力を抜いて飲みたいときにも候補になります。",
    directionTags: ["honeyed", "oak", "speyside", "smooth"],
    moodTags: ["穏やか", "リラックス", "親しみやすい"],
    sceneTags: ["家飲み", "食後", "ゆっくり飲みたい夜"],
  },
  glenallachie15yearold: {
    bottleId: "glenallachie15yearold",
    cardRecommendation:
      "濃厚なシェリー感と、ドライフルーツのような甘みが印象的な一本。\n\nGlenfarclas 12が好きなら、より厚みのあるシェリー方向へ。\nThe Macallan 12が好きなら、甘みをさらに深く楽しむ一本としておすすめです。",
    detailRecommendation:
      "GlenAllachie 15 の魅力は、\nしっかりしたシェリー樽の甘みと、\nドライフルーツやチョコレートを思わせる濃厚さにあります。\n\nGlenfarclas 12のシェリー感が好きなら、\nより厚みと甘みを増した方向として楽しみやすい一本です。\n\nThe Macallan 12の上品な甘みが好きな人にも、\nもう少し濃く、深いシェリー系へ広げる候補になります。",
    directionTags: ["sherry-rich", "dried-fruit", "full-bodied", "speyside"],
    moodTags: ["じっくり", "濃厚", "夜更け"],
    sceneTags: ["食後", "バータイム", "ゆっくり飲みたい夜"],
  },
  yamazakisinglemalt: {
    bottleId: "yamazakisinglemalt",
    cardRecommendation:
      "華やかさや飲みやすさが印象に残ったなら、次は宮城峡や白州も面白い選択肢です。果実感や樽の表情の違いを比べると、自分の好みが少し見えてきます。",
    detailRecommendation:
      "山崎を飲んで心地よかったなら、まずは日本のシングルモルトを横に広げてみるのがおすすめです。\n\n白州なら軽やかで爽やかな方向へ、宮城峡ならやわらかな果実感の方向へ進めます。同じ飲みやすさの中でも印象は少しずつ違います。\n\nゆっくり飲みながら、自分が惹かれるのが果実感なのか、樽由来の甘さなのかを探してみると、次の一本選びが楽しくなります。",
    directionTags: ["fruity", "elegant", "japanese", "exploration"],
    moodTags: ["relaxed", "calm", "reflective"],
    sceneTags: ["quiet-evening", "first-japanese-whisky", "after-dinner"],
  },
  hakushusinglemalt: {
    bottleId: "hakushusinglemalt",
    cardRecommendation:
      "白州の爽やかさが心地よかったなら、Taliskerや余市のような少し個性のある方向も試してみたくなるかもしれません。",
    detailRecommendation:
      "白州を飲んで印象に残ったのが爽やかさや軽やかさなら、その感覚を起点に少しずつ世界を広げてみるのがおすすめです。\n\nTaliskerは潮風のニュアンスを、余市は穏やかなスモーキーさを感じられます。どちらも白州とは違う個性がありますが、自然につながる部分があります。\n\n静かな時間に一杯飲みながら、自分が求めているのが爽快感なのか、ほのかなスモーキーさなのかを探してみてください。",
    directionTags: ["fresh", "coastal", "lightly-smoky", "japanese"],
    moodTags: ["refreshing", "calm", "outdoors"],
    sceneTags: ["early-evening", "summer-night", "quiet-drink"],
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
