# めぐる工芸舎 — 画面仕様 & 情報設計（MVP）

最終更新: 2025-10-21（週次投票 5 段階スケール & モバイル最優先版）  
対象バージョン: MVP ローンチ（ロードマップ Step 1-2）

本ドキュメントは README の TODO（画面仕様・情報設計）を補完し、  
開発メンバー / コントリビューターが同じ認識で UI 実装と情報設計を進めるための基礎資料です。

---

## 1. コンセプトと体験要件

- **目的**: 日本各地の工芸文化を「知る → 深掘りする → 行動する」まで一貫した体験を提供する。
- **主要ユーザー像**
  - 工芸ファン / 旅行者: 来訪前に背景を知りたい・イベントを探したい。産地づくりに参加したい。
  - 職人 / 工房の関係者: 活動を発信し、新たな繋がりや支援者を得たい。
  - メディア / 支援者: 取材やコラボの可能性を探りたい。
- **MVP のゴール**
  1. 工芸分野の魅力を視覚的に提示し、ファーストビューから参加できる「今週の投票」（5 段階賛否・モバイル優先）を提供するトップページ。
  2. 産地ごとの情報を整理した情報アーカイブ。
  3. 一つのプロジェクトを深掘りできるストーリービュー。
  4. すべての UI をスマートフォン起点で設計し、必要に応じて段階的にレイアウトを拡張する。

---

## 2. ページ一覧とナビゲーション

| 画面 | URL 例 | 目的 | 備考 |
| --- | --- | --- | --- |
| トップページ | `/` | サービスの価値訴求、最新情報のエントリーポイント | ファーストビューに 5 段階賛否の「今週の投票」、続いて産地カード・紹介文 |
| 産地（エリア）一覧 | `/areas` *(Step 1 では省略可)* | 主要エリアをマッピングし詳細ページへ誘導 | Step 2 で JSON から生成 |
| 産地詳細ページ | `/areas/[slug]` | 工房・職人・イベントをまとめて紹介 、投票機能、提案機能| モックデータで 1〜2 エリア実装 |
| ストーリービュー | `/stories/[slug]` | 一つのプロジェクトの背景・年表・関係者を紹介 | 初期は静的 JSON で構成 |
| コンタクト / 行動導線 | `/contact` *(Step 3 以降)* | 予約 / 問い合わせ手段を提供 | MVP では外部リンクに留める |

ナビゲーション構造:

```
Header
 ├─ Home
 ├─ Areas
 └─ Stories
Footer
 ├─ About
 ├─ Contact (外部リンク)
 └─ SNS リンク
```

---

## 3. 画面仕様（概要）

### 3.1 トップページ `/`

| セクション | 要素 | 優先度 | データソース | 備考 |
| --- | --- | --- | --- | --- |
| 今週の投票 | 5 段階賛否スケール、解説テキスト、送信ボタン | 最高 | `weeklyVote`（`src/data/home.ts`） | モバイル: 大小5つの円形ラジオを横並びにし、選択時に説明を下部に展開。デスクトップ: カード形式。投票完了までは集計を非表示にし、送信後に現在の分布を開示 |
| エリア紹介 | 主要産地の概略カード | 高 | `craftAreas`（`src/data/home.ts`） | モバイル 1 カラム、`sm` で 2 カラム、`lg` で 3 カラム |
| プロジェクト哲学 | キーワード 3 本柱 | 中 | 固定文言 | About セクションとして表示 |
| ニュース / イベント | 最新イベント / お知らせ | 低 | `news.json` | Step 2 で実装予定 |

### 3.2 産地詳細ページ `/areas/[slug]`

| セクション | 要素 | 優先度 | データソース | 備考 |
| --- | --- | --- | --- | --- |
| ヘッダー | 産地名、説明、メインビジュアル | 高 | `areas.json` | スラッグでフィルタ |
| 工房 / 職人リスト | 名前、写真、紹介文、外部リンク | 高 | `craftspeople.json` | カードレイアウト（3 カラム / レスポンシブ） |
| プロジェクト | 関連ストーリーへのリンク | 中 | `stories.json` | タグで紐づけ |
| イベントカレンダー | 直近イベント一覧 | 中 | `events.json` | 日付 / 場所 / 申し込みリンク |
| アクセス情報 | 地図リンク、交通情報 | 低 | 固定 URL で可 | 将来 API 連携を検討 |

### 3.3 ストーリービュー `/stories/[slug]`

| セクション | 要素 | 優先度 | データソース | 備考 |
| --- | --- | --- | --- | --- |
| キービジュアル | Hero 画像、タイトル、概要 | 高 | `stories.json` | Markdown で本文を持たせても良い |
| タイムライン | 年表形式で出来事を表示 | 高 | `timeline.json` | 年月 + 出来事 + 画像オプション |
| 関係者 | 職人・協力者の一覧 | 中 | `profiles.json` | 産地ページと共有データを再利用 |
| 行動導線 | 工房訪問 / 応援リンク | 中 | `stories.json` | CTA ボタン複数配置可 |
| メディアギャラリー | 写真 / 動画 | 低 | `media.json` | スライダー UI を検討 |

---

## 4. 情報設計（IA）

### 4.1 データモデル（仮）

```
Area {
  id: string
  name: string
  region: string
  description: string
  heroImage: string
  craftspeople: string[]      // Craftsperson.id
  stories: string[]           // Story.id
  events: string[]            // Event.id
}

Craftsperson {
  id: string
  name: string
  craftType: string
  biography: string
  avatarImage?: string
  location: string
  socialLinks?: { type: 'instagram' | 'website' | 'x', url: string }[]
}

Story {
  id: string
  title: string
  summary: string
  heroImage: string
  timeline: TimelineEntry[]
  relatedAreas: string[]
  relatedCraftspeople: string[]
  actions: { label: string; url: string }[]
}

TimelineEntry {
  id: string
  date: string   // ISO 8601
  title: string
  description: string
  media?: string
}

VoteQuestion {
  id: string
  title: string
  prompt: string
  type: 'scale5' | 'single-choice' | 'free-text'
  description?: string
  scaleLabels?: {
    minLabel: string
    maxLabel: string
  }
  options?: WeeklyVoteOption[]   // single-choice の場合
}

WeeklyVoteOption {
  id: string
  label: string
  description: string
  supporters?: number  // 表示用の暫定値。将来は集計結果から取得
}

Event {
  id: string
  title: string
  startDate: string
  endDate?: string
  location: string
  description: string
  registrationUrl?: string
}
```

- 当面は `src/data/*.json` に静的ファイルを配置し、RSC から読み込む。  
- Supabase 導入後は同スキーマでテーブル化し、RLS で更新権限を管理。

### 4.2 ナビゲーション & IA マップ

```
Home
 ├─ Stories (section)
 │   └─ Story detail (/stories/[slug])
 ├─ Areas (section)
 │   └─ Area detail (/areas/[slug])
 └─ Philosophy / News (static sections)

Global Footer
 ├─ About / Vision（静的ページ）
 ├─ Contact（外部フォーム or メール）
 └─ SNS Links（Instagram, YouTube など）
```

---

## 5. 表示要件 & UI ガイド

- **レスポンシブ**: Tailwind の `sm`, `md`, `lg` ブレークポイントで制御。  
  - `sm` (0-639px): 1 カラム、主要要素は縦積み。フォームやボタンはフル幅に広げる。  
  - `md` (640-1023px): 2 カラムレイアウト開始。  
  - `lg` (1024px-): 3 カラムや余白を追加し情報密度を高める。
- **タイポグラフィ**: `font-sans`（Geistフォント）、階層は `text-3xl`, `text-2xl`, `text-base` を基準にし、モバイルでは余白を減らす。  
- **カラー**: ブランドは `brand-600`（えんじ系）、アクセントは `accent-600`（亜麻色系）、ボディテキストは `neutral-700`.  
- **アクセシビリティ**: 背景とテキストのコントラスト比 4.5:1 以上。画像には代替テキストを必ず設定。
- **投票結果の公開タイミング**: 集計値は投稿完了後にのみ表示し、未投票状態では非表示を保つ。
- **投票UI（モバイル）**: ラジオボタンは `role="radiogroup"` とし、左右キーで移動可能。外周サイズは端が最大・中央が最小になるよう `14px → 10px → 14px` で設定。

---

## 6. モックデータ方針

- すべて `src/data/` 配下に配置し、`import data from '@/data/areas.json' assert { type: 'json' }` で読み込む。現在は `home.ts` にモック投票データ (`weeklyVote`, `craftAreas`) を定義。  
- **ファイル分割例**
  - `areas.json`
  - `craftspeople.json`
  - `stories.json`
  - `timeline.json`
  - `events.json`
  - `votes.json`（将来 Supabase と連携する際に移行予定）
- Git 管理する（実データに移行するまでは公開前提のダミー情報とする）。

---

## 7. 今後追加したい仕様（Step 3 以降）

- Supabase 連携による CMS 的更新
  - 認証: メンテナンス用（RLS 設定で職人別の編集権限を調整）  
  - テーブル: `areas`, `craftspeople`, `stories`, `timeline_entries`, `events`
- フィルター / 検索機能（産地、技法、季節などで絞り込み）
- オンライン展示やアーカイブ映像の埋め込み
- 多言語化（日本語 / 英語）

---

## 8. 参照

- [README.md](../../README.md) — プロジェクト概要とロードマップ  
- [AGENTS.md](../../AGENTS.md) — コーディングエージェント向け開発ルール  
- `docs/adr/` *(今後作成)* — 重要な設計判断の記録

本ドキュメントへの改善提案は Issue / PR で歓迎します。
