import {
  getBottleRecommendation,
  type BottleRecommendation,
} from "./bottle-recommendations";

export type Bottle = {
  name: string;
  slug: string;
  tasteProfile: string;
  preferenceTags: string[];
  recommendedFor: string;
  recommendationReasons: string[];
  recommendation?: BottleRecommendation;
};

export type Distillery = {
  slug: string;
  name: string;
  region: string;
  keywords: string[];
  bottles: Bottle[];
};

type DistillerySeed = {
  name: string;
  region: string;
  keywords?: string[];
  bottleName?: string;
  tasteProfile?: string;
  preferenceTags?: string[];
  recommendedFor?: string;
  recommendationReasons?: string[];
};

function normalizeKeyword(value: string) {
  return value.toLowerCase();
}

function compactKeyword(value: string) {
  return normalizeKeyword(value).replace(/[^a-z0-9]/g, "");
}

function createSlug(value: string) {
  return compactKeyword(value) || "unknown";
}

function createDistillery(seed: DistillerySeed): Distillery {
  const englishKeywords = [seed.name, compactKeyword(seed.name)];
  const keywords = Array.from(
    new Set([...englishKeywords, ...(seed.keywords ?? [])].map(normalizeKeyword)),
  );
  const bottleName = seed.bottleName ?? `${seed.name} Single Malt`;
  const bottleSlug = createSlug(bottleName);
  const recommendation = getBottleRecommendation(bottleSlug);

  return {
    slug: createSlug(seed.name),
    name: seed.name,
    region: seed.region,
    keywords,
    bottles: [
      {
        name: bottleName,
        slug: bottleSlug,
        tasteProfile:
          seed.tasteProfile ??
          "モルトの甘さ、穏やかな樽香、軽い果実感を中心にした飲みやすい味わい。",
        preferenceTags: seed.preferenceTags ?? recommendation?.directionTags ?? [],
        recommendedFor:
          seed.recommendedFor ??
          "まずは蒸留所の雰囲気を知りたい人や、強いクセよりも飲みやすさを優先したい人向け。",
        recommendationReasons: seed.recommendationReasons ?? [],
        recommendation,
      },
    ],
  };
}

const distillerySeeds: DistillerySeed[] = [
  {
    name: "Glenfarclas",
    region: "Speyside",
    keywords: ["グレンファークラス"],
    bottleName: "Glenfarclas 12 Year Old",
    preferenceTags: ["シェリー樽", "ドライフルーツ", "蜂蜜", "ナッツ"],
    tasteProfile: "シェリー樽由来のドライフルーツ、蜂蜜、ナッツ感があり、甘く落ち着いた余韻。",
    recommendedFor: "食後にゆっくり甘みを楽しみたい人や、濃すぎないご褒美感を求める人向け。",
    recommendationReasons: ["シェリー樽の甘み", "食後にゆっくり飲みたい夜向け"],
  },
  {
    name: "Glenlivet",
    region: "Speyside",
    keywords: ["the glenlivet", "ザ グレンリベット", "グレンリベット"],
    bottleName: "The Glenlivet 12 Year Old",
    preferenceTags: ["果実感", "青りんご", "バニラ", "軽やか"],
    tasteProfile: "洋梨や青りんごのような軽やかな果実感と、バニラのやさしい甘さ。",
    recommendedFor: "クセが強すぎないシングルモルトから始めたい人や、ハイボールでも飲みたい人向け。",
  },
  {
    name: "Bowmore",
    region: "Islay",
    keywords: ["ボウモア"],
    bottleName: "Bowmore 12 Year Old",
    preferenceTags: ["スモーク", "潮気", "ビターチョコ", "やわらかい甘み"],
    tasteProfile: "やわらかなスモーク、潮気、ビターなチョコレート感がほどよく重なる味わい。",
    recommendedFor: "強烈すぎないスモーキーさを試したい人や、少し大人っぽい余韻が欲しい人向け。",
    recommendationReasons: ["スモーキー好きにおすすめ", "アイラ入門にも選びやすい"],
  },
  {
    name: "Highland Park",
    region: "Islands",
    keywords: ["ハイランドパーク"],
    bottleName: "Highland Park 12 Year Old",
    preferenceTags: ["穏やかなピート", "シェリー", "蜂蜜", "バランス", "島もの"],
  },
  {
    name: "Auchentoshan",
    region: "Lowland",
    keywords: ["オーヘントッシャン"],
    bottleName: "Auchentoshan 12 Year Old",
  },
  {
    name: "Macduff",
    region: "Highland",
    keywords: ["glen deveron", "マクダフ", "グレンデヴェロン"],
    bottleName: "Glen Deveron 12 Year Old",
  },
  {
    name: "Longmorn",
    region: "Speyside",
    keywords: ["ロングモーン"],
    bottleName: "Longmorn 16 Year Old",
  },
  {
    name: "Tamdhu",
    region: "Speyside",
    keywords: ["タムデュー"],
    bottleName: "Tamdhu 12 Year Old",
  },
  {
    name: "Glen Grant",
    region: "Speyside",
    keywords: ["glengrant", "グレングラント"],
    bottleName: "Glen Grant 10 Year Old",
  },
  {
    name: "Bunnahabhain",
    region: "Islay",
    keywords: ["ブナハーブン"],
    bottleName: "Bunnahabhain 12 Year Old",
  },
  {
    name: "Tomatin",
    region: "Highland",
    keywords: ["トマーティン"],
    bottleName: "Tomatin 12 Year Old",
  },
  {
    name: "Benriach",
    region: "Speyside",
    keywords: ["ben riach", "ベンリアック"],
    bottleName: "Benriach The Original Ten",
  },
  {
    name: "Dalmore",
    region: "Highland",
    keywords: ["ダルモア"],
    bottleName: "Dalmore 12 Year Old",
  },
  {
    name: "Talisker",
    region: "Islands",
    keywords: ["タリスカー"],
    bottleName: "Talisker 10 Year Old",
    preferenceTags: ["潮気", "黒胡椒", "スモーク", "スパイス"],
    tasteProfile: "潮気、黒胡椒のようなスパイス、焚き火を思わせるスモーク感。",
    recommendedFor: "気分を切り替える一杯が欲しい人や、ハイボールでも個性を感じたい人向け。",
    recommendationReasons: ["ドライ寄りの味わい", "潮気とスパイス感がある"],
  },
  {
    name: "Glenfiddich",
    region: "Speyside",
    keywords: ["グレンフィディック"],
    bottleName: "Glenfiddich 12 Year Old",
    preferenceTags: ["果実感", "洋梨", "青りんご", "軽やか"],
  },
  {
    name: "Glenturret",
    region: "Highland",
    keywords: ["グレンタレット"],
    bottleName: "Glenturret Triple Wood",
  },
  { name: "Scapa", region: "Islands", keywords: ["スキャパ"], bottleName: "Scapa Skiren" },
  { name: "Inchgower", region: "Speyside", keywords: ["インチガワー"] },
  { name: "Glen Garioch", region: "Highland", keywords: ["glengarioch", "グレンギリー"] },
  { name: "Inverleven", region: "Lowland" },
  { name: "Glenglassaugh", region: "Highland", keywords: ["グレングラッサ"] },
  { name: "Glenkinchie", region: "Lowland", keywords: ["グレンキンチー"] },
  { name: "Bruichladdich", region: "Islay", keywords: ["ブルックラディ"] },
  {
    name: "Macallan",
    region: "Speyside",
    keywords: ["the macallan", "マッカラン"],
    bottleName: "The Macallan 12 Year Old",
    preferenceTags: ["シェリー樽", "ドライフルーツ", "樽の甘み", "なめらか"],
  },
  { name: "Rosebank", region: "Lowland", keywords: ["ローズバンク"] },
  { name: "Clynelish", region: "Highland", keywords: ["クライヌリッシュ"] },
  {
    name: "Springbank",
    region: "Campbeltown",
    keywords: ["スプリングバンク"],
    bottleName: "Springbank 10 Year Old",
    preferenceTags: ["潮気", "麦の厚み", "オイリー", "スモーク"],
  },
  { name: "Tullibardine", region: "Highland", keywords: ["タリバーディン"] },
  {
    name: "Laphroaig",
    region: "Islay",
    keywords: ["ラフロイグ"],
    bottleName: "Laphroaig 10 Year Old",
    preferenceTags: ["ピート", "スモーク", "潮気", "薬品感", "アイラ"],
    tasteProfile: "薬品香を思わせる強いピート、海藻のような潮気、しっかりした煙たさ。",
    recommendedFor: "個性的で忘れにくい一本に挑戦したい人や、強いスモークが好きな人向け。",
  },
  { name: "Glenrothes", region: "Speyside", keywords: ["グレンロセス"] },
  { name: "Isle of Jura", region: "Islands", keywords: ["jura", "ジュラ"] },
  { name: "Edradour", region: "Highland", keywords: ["エドラダワー"] },
  {
    name: "Ardbeg",
    region: "Islay",
    keywords: ["アードベッグ"],
    bottleName: "Ardbeg 10 Year Old",
    preferenceTags: ["強いスモーク", "ピート", "ドライ", "潮気"],
  },
  { name: "Tamnavulin", region: "Speyside", keywords: ["タムナヴーリン"] },
  { name: "Glen Moray", region: "Speyside", keywords: ["glenmoray", "グレンマレイ"] },
  { name: "Benrinnes", region: "Speyside", keywords: ["ベンリネス"] },
  { name: "Cragganmore", region: "Speyside", keywords: ["クラガンモア"] },
  { name: "Caperdonich", region: "Speyside", keywords: ["キャパドニック"] },
  { name: "Linkwood", region: "Speyside", keywords: ["リンクウッド"] },
  {
    name: "Balvenie",
    region: "Speyside",
    keywords: ["バルヴェニー"],
    bottleName: "Balvenie DoubleWood 12 Year Old",
    preferenceTags: ["蜂蜜", "バニラ", "樽感", "甘み", "スペイサイド"],
  },
  { name: "Dailuaine", region: "Speyside", keywords: ["ダルユーイン"] },
  { name: "Ledaig", region: "Islands", keywords: ["レダイグ"] },
  { name: "Tobermory", region: "Islands", keywords: ["トバモリー"] },
  { name: "Port Ellen", region: "Islay", keywords: ["ポートエレン"] },
  { name: "Craigellachie", region: "Speyside", keywords: ["クライゲラキ"] },
  { name: "Dallas Dhu", region: "Speyside", keywords: ["dallasdhu", "ダラスデュー"] },
  { name: "Glenlossie", region: "Speyside", keywords: ["グレンロッシー"] },
  {
    name: "Benromach",
    region: "Speyside",
    keywords: ["ベンロマック"],
    bottleName: "Benromach 10 Year Old",
    preferenceTags: ["シェリー樽", "やわらかいスモーク", "麦の甘み", "クラシック"],
  },
  { name: "Balmenach", region: "Speyside", keywords: ["バルメナック"] },
  { name: "St Magdalene", region: "Lowland", keywords: ["saint magdalene", "セントマグダレン"] },
  { name: "Bladnoch", region: "Lowland", keywords: ["ブラドノック"] },
  { name: "Bushmills", region: "Northern Ireland", keywords: ["ブッシュミルズ"] },
  { name: "Old Pulteney", region: "Highland", keywords: ["oldpulteney", "オールドプルトニー"] },
  {
    name: "Caol Ila",
    region: "Islay",
    keywords: ["caolila", "カリラ"],
    bottleName: "Caol Ila 12 Year Old",
    tasteProfile: "レモンのような明るさ、クリーンなピート、軽い潮気があるすっきりした味わい。",
    recommendedFor: "煙たさは欲しいけれど重すぎる味は避けたい人や、食事にも合わせたい人向け。",
  },
  {
    name: "Aberlour",
    region: "Speyside",
    keywords: ["アベラワー"],
    bottleName: "Aberlour 12 Year Old",
    tasteProfile: "蜂蜜、熟した果実、シェリー樽の甘みがあり、丸く満足感のある味わい。",
    recommendedFor: "やさしい甘さから少し濃厚な方向へ進みたい人や、ご褒美の一杯を探す人向け。",
  },
  { name: "Brackla", region: "Highland", keywords: ["royal brackla", "ロイヤルブラックラ"] },
  { name: "Coleburn", region: "Speyside" },
  { name: "Glen Mhor", region: "Highland", keywords: ["glenmhor"] },
  { name: "Strathisla", region: "Speyside", keywords: ["ストラスアイラ"] },
  { name: "Teaninich", region: "Highland", keywords: ["ティーニニック"] },
  { name: "Aberfeldy", region: "Highland", keywords: ["アバフェルディ"] },
  { name: "Brora", region: "Highland", keywords: ["ブローラ"] },
  { name: "Glenlochy", region: "Highland", keywords: ["glenlochy"] },
  { name: "Glentauchers", region: "Speyside", keywords: ["グレントファース"] },
  { name: "Mannochmore", region: "Speyside", keywords: ["マノックモア"] },
  { name: "Imperial", region: "Speyside", keywords: ["インペリアル"] },
  { name: "Ardmore", region: "Highland", keywords: ["アードモア"] },
  { name: "Banff", region: "Speyside", keywords: ["バンフ"] },
  { name: "Blair Athol", region: "Highland", keywords: ["blairathol", "ブレアソール"] },
  { name: "Glen Albyn", region: "Highland", keywords: ["glenalbyn"] },
  { name: "Balblair", region: "Highland", keywords: ["バルブレア"] },
  { name: "Glenburgie", region: "Speyside", keywords: ["グレンバーギー"] },
  { name: "Miltonduff", region: "Speyside", keywords: ["ミルトンダフ"] },
  { name: "Aultmore", region: "Speyside", keywords: ["オルトモア"] },
  { name: "North Port", region: "Highland", keywords: ["northport"] },
  { name: "Glenury Royal", region: "Highland", keywords: ["glenuryroyal"] },
  { name: "Mortlach", region: "Speyside", keywords: ["モートラック"] },
  { name: "Glen Ord", region: "Highland", keywords: ["glenord", "グレンオード"] },
  { name: "Ben Nevis", region: "Highland", keywords: ["bennevis", "ベンネヴィス"] },
  { name: "Deanston", region: "Highland", keywords: ["ディーンストン"] },
  { name: "Glen Spey", region: "Speyside", keywords: ["glenspey"] },
  { name: "Glen Keith", region: "Speyside", keywords: ["glenkeith", "グレンキース"] },
  { name: "Glencadam", region: "Highland", keywords: ["グレンカダム"] },
  { name: "Convalmore", region: "Speyside", keywords: ["コンバルモア"] },
  { name: "Glendullan", region: "Speyside", keywords: ["グレンダラン"] },
  { name: "Glen Elgin", region: "Speyside", keywords: ["glenelgin", "グレンエルギン"] },
  { name: "Glenesk", region: "Highland", keywords: ["glenesk"] },
  { name: "Millburn", region: "Highland", keywords: ["millburn"] },
  { name: "Speyburn", region: "Speyside", keywords: ["スペイバーン"] },
  { name: "Tomintoul", region: "Speyside", keywords: ["トミントール"] },
  { name: "Pittyvaich", region: "Speyside", keywords: ["ピティヴェアック"] },
  { name: "Dufftown", region: "Speyside", keywords: ["ダフタウン"] },
  { name: "Lochside", region: "Highland", keywords: ["lochside"] },
  { name: "Glen Scotia", region: "Campbeltown", keywords: ["glenscotia", "グレンスコシア"] },
  { name: "Fettercairn", region: "Highland", keywords: ["フェッターケアン"] },
  { name: "Auchroisk", region: "Speyside", keywords: ["オスロスク"] },
  { name: "Glendronach", region: "Highland", keywords: ["glen dronach", "グレンドロナック"] },
  { name: "Littlemill", region: "Lowland", keywords: ["リトルミル"] },
  { name: "Lomond (Inverleven)", region: "Lowland", keywords: ["lomond", "inverleven"] },
  { name: "Glenugie", region: "Highland", keywords: ["glenugie"] },
  { name: "Strathmill", region: "Speyside", keywords: ["ストラスミル"] },
  { name: "Knockando", region: "Speyside", keywords: ["ノッカンドゥ"] },
  { name: "Dalwhinnie", region: "Highland", keywords: ["ダルウィニー"] },
  { name: "Royal Lochnagar", region: "Highland", keywords: ["royallochnagar", "ロイヤルロッホナガー"] },
  { name: "Glencraig", region: "Speyside", keywords: ["glencraig"] },
  { name: "Tormore", region: "Speyside", keywords: ["トーモア"] },
  { name: "Cardhu", region: "Speyside", keywords: ["カードゥ"] },
  {
    name: "Glenallachie",
    region: "Speyside",
    keywords: ["glen allachie", "グレンアラヒー"],
    bottleName: "GlenAllachie 15 Year Old",
    preferenceTags: ["シェリー", "ドライフルーツ", "チョコレート", "濃厚", "スペイサイド"],
    tasteProfile:
      "シェリー樽由来の濃厚な甘みに、レーズンのようなドライフルーツ感とチョコレートを思わせる深みが重なる味わい。",
    recommendedFor:
      "シェリー樽の甘みをしっかり楽しみたい人や、濃厚で厚みのある一本を食後にゆっくり味わいたい人向け。",
  },
  {
    name: "Allt-a'Bhainne",
    region: "Speyside",
    keywords: ["allt a bhainne", "allt-a-bhainne", "アルタベーン"],
  },
  { name: "Mosstowie", region: "Speyside", keywords: ["mosstowie"] },
  {
    name: "Oban",
    region: "Highland",
    keywords: ["オーバン"],
    bottleName: "Oban 14 Year Old",
    preferenceTags: ["潮気", "果実感", "麦感", "バランス", "ハイランド"],
    tasteProfile:
      "穏やかな潮気に、オレンジや洋梨を思わせる果実感、麦のやわらかな甘みが重なるバランスのよい味わい。",
    recommendedFor:
      "強すぎない潮気や果実感を楽しみながら、海沿いらしい個性を穏やかに味わいたい人向け。",
  },
  {
    name: "Lagavulin",
    region: "Islay",
    keywords: ["ラガヴーリン"],
    bottleName: "Lagavulin 16 Year Old",
    preferenceTags: ["深いスモーク", "ドライフルーツ", "潮気", "重厚な余韻"],
    tasteProfile: "深いスモーク、ドライフルーツ、潮気、長く残る重厚な余韻。",
    recommendedFor: "ゆっくり時間をかけて飲みたい人や、特別感のあるスモーキーな一本を選びたい人向け。",
  },
  { name: "Inchmurrin", region: "Highland", keywords: ["インチマリン"] },
  { name: "Braeval", region: "Speyside", keywords: ["braes of glenlivet", "ブレイヴァル"] },
  {
    name: "Longrow",
    region: "Campbeltown",
    keywords: ["ロングロウ"],
    bottleName: "Longrow Peated",
    preferenceTags: ["ピート", "スモーク", "潮気", "麦感", "キャンベルタウン"],
    tasteProfile:
      "力強いピートスモークに、潮気、麦の厚み、少しオイリーな質感が重なるキャンベルタウンらしい味わい。",
    recommendedFor:
      "アイラとは少し違うスモークや、麦感と潮気のある個性的な一本を試したい人向け。",
  },
  { name: "Knockdhu", region: "Highland", keywords: ["an cnoc", "ノックドゥ"] },
  {
    name: "Yoichi",
    region: "Japan",
    keywords: ["余市"],
    bottleName: "余市 シングルモルト",
  },
  { name: "Cooley", region: "Ireland", keywords: ["クーリー"] },
  { name: "Connemara", region: "Ireland", keywords: ["カネマラ"] },
  {
    name: "Yamazaki",
    region: "Japan",
    keywords: ["山崎"],
    bottleName: "Yamazaki Single Malt",
    preferenceTags: ["華やか", "果実感", "バランス型", "飲みやすい"],
    tasteProfile: "また飲みたい",
    recommendedFor: "果実感やバランスの良さを楽しみたい人",
  },
  {
    name: "Hakushu",
    region: "Japan",
    keywords: ["白州"],
    bottleName: "Hakushu Single Malt",
    preferenceTags: ["爽やか", "軽やか", "森林感", "穏やかなスモーキーさ"],
    tasteProfile: "また飲みたい",
    recommendedFor: "爽やかな香りと軽やかな飲み口が好きな人",
  },
  {
    name: "Isle of Arran",
    region: "Islands",
    keywords: ["arran", "アラン"],
    bottleName: "Arran 10 Year Old",
    preferenceTags: ["果実感", "麦の甘み", "軽やか", "樽の甘み"],
  },
  { name: "Croftengea", region: "Highland", keywords: ["croftengea"] },
  { name: "Glengoyne", region: "Highland", keywords: ["グレンゴイン"] },
  {
    name: "Miyagikyo",
    region: "Japan",
    keywords: ["宮城峡"],
    bottleName: "宮城峡 シングルモルト",
  },
  {
    name: "Glenmorangie",
    region: "Highland",
    keywords: ["グレンモーレンジィ"],
    bottleName: "Glenmorangie The Original",
    tasteProfile: "オレンジやバニラのような香り、軽やかな甘さ、なめらかな口当たり。",
    recommendedFor: "癒されたい夜の一本を探す人や、甘く軽い味わいを気楽に楽しみたい人向け。",
  },
  { name: "Hazelburn", region: "Campbeltown", keywords: ["ヘーゼルバーン"] },
  { name: "Port Charlotte", region: "Islay", keywords: ["ポートシャーロット"] },
  { name: "Penderyn", region: "Wales", keywords: ["ペンダーリン"] },
  { name: "Kilchoman", region: "Islay", keywords: ["キルホーマン"] },
  { name: "Chichibu", region: "Japan", keywords: ["秩父", "イチローズモルト"] },
  { name: "Hanyu", region: "Japan", keywords: ["羽生"] },
  { name: "Karuizawa", region: "Japan", keywords: ["軽井沢"] },
  { name: "Westland", region: "Washington", keywords: ["ウェストランド"] },
  { name: "Paul John", region: "India", keywords: ["pauljohn", "ポールジョン"] },
  { name: "Loch Lomond", region: "Highland", keywords: ["lochlomond", "ロッホローモンド"] },
  { name: "Eden Mill", region: "Lowland", keywords: ["edenmill"] },
  { name: "St George's", region: "England", keywords: ["st georges", "st george", "セントジョージ"] },
  { name: "Nantou", region: "Taiwan", keywords: ["ナントウ"] },
  {
    name: "Kavalan",
    region: "Taiwan",
    keywords: ["カバラン"],
    bottleName: "Kavalan Classic Single Malt",
  },
  { name: "Balcones", region: "Texas", keywords: ["バルコンズ"] },
  { name: "Fary Lochan", region: "Denmark", keywords: ["farylochan"] },
  { name: "Breuckelen", region: "New York", keywords: ["breuckelen"] },
  { name: "Copperworks Alba", region: "Washington", keywords: ["copperworks", "alba"] },
  { name: "High Coast", region: "Sweden", keywords: ["highcoast", "ハイコースト"] },
  { name: "Smogen", region: "Sweden", keywords: ["smögen", "スモーゲン"] },
  { name: "Cotswolds", region: "England", keywords: ["コッツウォルズ"] },
  { name: "Archie Rose", region: "Australia", keywords: ["archierose", "アーチーローズ"] },
  { name: "Starward", region: "Australia", keywords: ["スターワード"] },
  { name: "Ardnamurchan", region: "Highland", keywords: ["アードナムルッカン"] },
  { name: "West Cork", region: "Ireland", keywords: ["westcork", "ウエストコーク"] },
  { name: "Mackmyra", region: "Sweden", keywords: ["マックミラ"] },
  { name: "Shelter Point", region: "Canada", keywords: ["shelterpoint"] },
  { name: "Thy", region: "Denmark", keywords: ["thy whisky"] },
  { name: "Mosgaard", region: "Denmark", keywords: ["mosgaard"] },
  { name: "Milk & Honey", region: "Israel", keywords: ["milk and honey", "m&h", "m h"] },
  { name: "Glasgow Distillery", region: "Scotland", keywords: ["glasgow"] },
  { name: "Warenghem (Armorik)", region: "France", keywords: ["warenghem", "armorik"] },
  { name: "Yuza", region: "Japan", keywords: ["遊佐"] },
  { name: "Shinshu", region: "Japan", keywords: ["信州", "駒ヶ岳"] },
  { name: "Tsunuki", region: "Japan", keywords: ["津貫"] },
  { name: "Nc'Nean", region: "Scotland", keywords: ["ncnean", "nc nean"] },
  { name: "Raasay", region: "Scotland", keywords: ["raasay", "ラッセイ"] },
  { name: "Isle of Harris", region: "Scotland", keywords: ["harris", "ハリス"] },
];

export const distilleries: Distillery[] = distillerySeeds.map(createDistillery);

export type BottleDetail = Bottle & {
  distillery: string;
  region: string;
};

export const bottles: BottleDetail[] = distilleries.flatMap((distillery) =>
  distillery.bottles.map((bottle) => ({
    ...bottle,
    distillery: distillery.name,
    region: distillery.region,
  })),
);

export function findBottleBySlug(slug: string) {
  return bottles.find((bottle) => bottle.slug === slug);
}
