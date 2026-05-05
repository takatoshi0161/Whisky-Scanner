export type Bottle = {
  name: string;
};

export type Distillery = {
  name: string;
  region: string;
  keywords: string[];
  bottles: Bottle[];
};

export const distilleries: Distillery[] = [
  {
    name: "Yamazaki",
    region: "Japan",
    keywords: ["yamazaki", "山崎"],
    bottles: [{ name: "山崎 シングルモルト" }],
  },
  {
    name: "Hakushu",
    region: "Japan",
    keywords: ["hakushu", "白州"],
    bottles: [{ name: "白州 シングルモルト" }],
  },
  {
    name: "Yoichi",
    region: "Japan",
    keywords: ["yoichi", "余市"],
    bottles: [{ name: "余市 シングルモルト" }],
  },
  {
    name: "Miyagikyo",
    region: "Japan",
    keywords: ["miyagikyo", "宮城峡"],
    bottles: [{ name: "宮城峡 シングルモルト" }],
  },
  {
    name: "Glenfarclas",
    region: "Speyside",
    keywords: ["glenfarclas", "グレンファークラス"],
    bottles: [{ name: "Glenfarclas 12 Year Old" }],
  },
  {
    name: "The Glenlivet",
    region: "Speyside",
    keywords: ["glenlivet", "the glenlivet", "ザ グレンリベット", "グレンリベット"],
    bottles: [{ name: "The Glenlivet 12 Year Old" }],
  },
  {
    name: "Bowmore",
    region: "Islay",
    keywords: ["bowmore", "ボウモア"],
    bottles: [{ name: "Bowmore 12 Year Old" }],
  },
  {
    name: "Highland Park",
    region: "Island",
    keywords: ["highland park", "ハイランドパーク"],
    bottles: [{ name: "Highland Park 12 Year Old" }],
  },
  {
    name: "Auchentoshan",
    region: "Lowland",
    keywords: ["auchentoshan", "オーヘントッシャン"],
    bottles: [{ name: "Auchentoshan 12 Year Old" }],
  },
  {
    name: "Macduff",
    region: "Highland",
    keywords: ["macduff", "glen deveron", "マクダフ", "グレンデヴェロン"],
    bottles: [{ name: "Glen Deveron 12 Year Old" }],
  },
  {
    name: "Longmorn",
    region: "Speyside",
    keywords: ["longmorn", "ロングモーン"],
    bottles: [{ name: "Longmorn 16 Year Old" }],
  },
  {
    name: "Tamdhu",
    region: "Speyside",
    keywords: ["tamdhu", "タムデュー"],
    bottles: [{ name: "Tamdhu 12 Year Old" }],
  },
  {
    name: "Glen Grant",
    region: "Speyside",
    keywords: ["glen grant", "glengrant", "グレングラント"],
    bottles: [{ name: "Glen Grant 10 Year Old" }],
  },
  {
    name: "Bunnahabhain",
    region: "Islay",
    keywords: ["bunnahabhain", "ブナハーブン"],
    bottles: [{ name: "Bunnahabhain 12 Year Old" }],
  },
  {
    name: "Tomatin",
    region: "Highland",
    keywords: ["tomatin", "トマーティン"],
    bottles: [{ name: "Tomatin 12 Year Old" }],
  },
  {
    name: "Benriach",
    region: "Speyside",
    keywords: ["benriach", "ben riach", "ベンリアック"],
    bottles: [{ name: "Benriach The Original Ten" }],
  },
  {
    name: "Dalmore",
    region: "Highland",
    keywords: ["dalmore", "ダルモア"],
    bottles: [{ name: "Dalmore 12 Year Old" }],
  },
  {
    name: "Talisker",
    region: "Island",
    keywords: ["talisker", "タリスカー"],
    bottles: [{ name: "Talisker 10 Year Old" }],
  },
  {
    name: "Glenfiddich",
    region: "Speyside",
    keywords: ["glenfiddich", "グレンフィディック"],
    bottles: [{ name: "Glenfiddich 12 Year Old" }],
  },
  {
    name: "Glenturret",
    region: "Highland",
    keywords: ["glenturret", "グレンタレット"],
    bottles: [{ name: "Glenturret Triple Wood" }],
  },
  {
    name: "Scapa",
    region: "Island",
    keywords: ["scapa", "スキャパ"],
    bottles: [{ name: "Scapa Skiren" }],
  },
  {
    name: "Inchgower",
    region: "Speyside",
    keywords: ["inchgower", "インチガワー"],
    bottles: [{ name: "Inchgower 14 Year Old" }],
  },
  {
    name: "Glen Garioch",
    region: "Highland",
    keywords: ["glen garioch", "glengarioch", "グレンギリー"],
    bottles: [{ name: "Glen Garioch 12 Year Old" }],
  },
  {
    name: "Glenmorangie",
    region: "Highland",
    keywords: ["glenmorangie", "グレンモーレンジィ"],
    bottles: [{ name: "Glenmorangie The Original" }],
  },
  {
    name: "Balvenie",
    region: "Speyside",
    keywords: ["balvenie", "バルヴェニー"],
    bottles: [{ name: "Balvenie DoubleWood 12 Year Old" }],
  },
  {
    name: "Caol Ila",
    region: "Islay",
    keywords: ["caol ila", "caolila", "カリラ"],
    bottles: [{ name: "Caol Ila 12 Year Old" }],
  },
  {
    name: "Aberlour",
    region: "Speyside",
    keywords: ["aberlour", "アベラワー"],
    bottles: [{ name: "Aberlour 12 Year Old" }],
  },
  {
    name: "Arran",
    region: "Island",
    keywords: ["arran", "アラン"],
    bottles: [{ name: "Arran 10 Year Old" }],
  },
  {
    name: "Kavalan",
    region: "Taiwan",
    keywords: ["kavalan", "カバラン"],
    bottles: [{ name: "Kavalan Classic Single Malt" }],
  },
];
