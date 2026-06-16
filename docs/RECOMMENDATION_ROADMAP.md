# Recommendation Roadmap

## Purpose

This document manages the recommendation implementation order for Whisky-Scanner.

Whisky-Scanner's core value is helping users move from "I liked this bottle" to "I might like this next." Recommendation coverage is therefore not just a data-completion task. It is the product path that makes next-bottle discovery possible.

`docs/SUPPORTED_BOTTLES.md` is the support ledger: it tracks which bottles are planned, registered, recommendation-ready, or reviewed. This roadmap uses that ledger to decide which bottles should receive recommendation work first.

Use this document to:

- Prioritize recommendation implementation waves
- Keep MVP coverage focused on useful next-bottle paths
- Balance single malt, blended Scotch, and blended malt entry points
- Avoid expanding recommendation data in a random bottle-list order

## Current Coverage

After Wave 3 Japanese PR 1:

- Supported Bottles: 168
- Registered Bottles: 26
- Recommendation Implemented: 18
- Reviewed: 7

## Prioritization Criteria

Prioritize bottles that:

- Are commonly drunk in real home-drinking contexts
- Make clear recommendation paths easy to explain
- Work well with Taste Profile and preference flavor tags
- Support Whisky-Scanner-like next-bottle suggestions
- Are useful entry points for Japanese users
- Create bridges from blended whisky into single malt discovery
- Expand beyond single malt when blended Scotch or blended malt gives users a more natural starting point

## Tier A / Wave Plan

### Wave 1: Core Whisky-Scanner Character

Highest-priority candidates for establishing Whisky-Scanner's recommendation character.

| Bottle | Reason | Status |
| --- | --- | --- |
| Ardbeg 10 | ピート・スモーク導線の基本。既に実装済みの場合は Recommendation 扱い。 | Recommendation |
| Lagavulin 16 | 重厚なピートとシェリー寄り導線。既に実装済みの場合は Recommendation 扱い。 | Recommendation |
| Laphroaig 10 | アイラ・強いピートの入口。 | Recommendation |
| Springbank 10 | 潮気・麦の厚み・複雑さの導線。既に実装済みの場合は Recommendation 扱い。 | Recommendation |
| Longrow Peated | Springbankからピート方向へ広げる候補。 | Recommendation |

### Wave 2: Bridge Bottles

Candidates that connect peat, sherry, fruit, region cues, and drinking styles.

| Bottle | Reason | Status |
| --- | --- | --- |
| Highland Park 12 | ピートとシェリーの橋渡し。 | Recommendation |
| GlenAllachie 15 | シェリー樽・濃厚甘みの導線。 | Recommendation |
| Balvenie DoubleWood 12 | Speysideの甘みと樽感の入口。 | Recommendation |
| Oban 14 | Highland / Coastal感の入口。 | Recommendation |

### Wave 3: Japan Entry Points

Entry points for Japanese users and Japan-market familiarity.

| Bottle | Reason | Status |
| --- | --- | --- |
| 山崎 Single Malt | 日本市場での認知度が高い入口。 | Recommendation |
| 白州 Single Malt | 軽やかさ・ハーブ・森感の入口。 | Recommendation |
| 余市 Single Malt | 日本のピート・厚みの入口。 | Registered |
| 宮城峡 Single Malt | 果実感・やわらかさの入口。 | Registered |

### Wave 4: Blended / Blended Malt Entry Points

Important candidates for users whose whisky memory starts from widely available blended whisky.

| Bottle | Reason | Status |
| --- | --- | --- |
| Johnnie Walker Black Label 12 | 多く飲まれるブレンデッド。スモーク導線の入口。 | Planned |
| Chivas Regal 12 | 甘み・飲みやすさ・Speyside導線の入口。 | Planned |
| Dewar's 12 | ハイボールや食中酒導線の入口。 | Planned |
| Monkey Shoulder | ブレンデッドモルトからSpeyside系へつなぐ入口。 | Planned |

## Operational Rules

- Do not create or change recommendation copy in this document update.
- Do not change bottle data in this document update.
- Keep this as a docs-only roadmap.
- Keep statuses aligned with `docs/SUPPORTED_BOTTLES.md`.
- When recommendation implementation progresses, update this roadmap alongside `docs/SUPPORTED_BOTTLES.md`.
- Treat this roadmap as a prioritization guide, not as a complete bottle support ledger.
