# めぐる工芸舎（meguru-kogeisha）

**名称**：めぐる工芸舎（Meguru Kogeisha）  
**運営**：ONDO（代表：西村）  
**事業形態**：文化・工芸産地の「関係構造」を可視化し、参加を生み出すWEBプラットフォーム  
**目的**：  
> 工芸のつくり手・ささえ手・つかい手の三者が、  
> それぞれの想いや知識をめぐらせながら、  
> 持続可能で自立した産地をつくるための「場」をつくる。


---

## 📌 目的とゴール

- **可視化**：工芸の産地の情報や産地の関係人口を見える化する 
- **接続**：産地を応援する人が産地づくりに参加できるように投票機能や、提案機能で産地とのつながりを作る。
- **記録**：工芸の背景ストーリーを、写真・動画・文章とともにアーカイブとして残す。

MVP では「閲覧体験」を中心に、下記の 3 ビューを優先して実装します。

1. **トップページ**：ファーストビューに「今週の投票」（5段階賛否）を横並びで配置し、投票後に集計を確認できる動線を用意（モバイルでは円形ラジオを大→小にグラデーション配置し、選択時に説明が展開）。  
2. **産地（エリア）ページ**：工房／職人の一覧と、代表プロジェクト・イベント情報、投票機能、提案機能。  
3. **ストーリービュー**：一つの工芸プロジェクトを、年表・関係者で解説（初期はモックデータ）。

---

## ⚙️ システム要件

- Node.js **>= 20**（LTS 推奨）  
- pnpm **>= 9**（`corepack enable && corepack prepare pnpm@9 --activate`）  
- Apple Silicon の場合は、ネイティブモジュール `lightningcss.darwin-arm64` が必要  
  - 依存関係再構築時に `pnpm install` が失敗した場合は `pnpm install --fix-lockfile` を実行  
  - `lightningcss` 周りでエラーが出たら `pnpm rebuild lightningcss --force` を試す  
- `.env.local`（未コミット）に Supabase 等のシークレットを定義（将来的に導入予定）

---

## 🚀 セットアップ

```bash
# 依存関係をインストール
pnpm install

# 開発サーバーを起動
pnpm dev

# 別ターミナルで品質チェック
pnpm lint       # ESLint
pnpm build      # Next.js production build
# pnpm typecheck # 追加予定（tsc --noEmit）
```

ブラウザで `http://localhost:3000` を開くとトップページが表示されます。  
Tailwind が正しく動作していれば、投票カードが白地・えんじのアクセントで表示され、選択肢をタップするとハイライトが切り替わります。

---

## 🧩 ディレクトリ構成

```
meguru-kogeisha/
├─ src/
│  └─ app/                 # Next.js App Router
│     ├─ page.tsx          # トップページ（RSC）
│     ├─ layout.tsx        # ルートレイアウトとメタ情報
│     └─ globals.css       # Tailwind エントリ
│
├─ docs/
│  ├─ requirements/        # 要件定義・ユーザーストーリー（今後追加）
│  └─ adr/                 # Architecture Decision Record（今後追加）
│
├─ AGENTS.md               # コーディングエージェント向け作業マニュアル
└─ README.md               # 人間向けドキュメント（本ファイル）
```

- 画面仕様・情報設計の詳細は [`docs/requirements/screen-information-architecture.md`](docs/requirements/screen-information-architecture.md) を参照。

---

## 🔍 機能要件（MVP）

| カテゴリ | 機能 | 状態 | メモ |
| --- | --- | --- | --- |
| インタラクション | トップページに 5 段階賛否の週次投票コンポーネントを表示 | ✅ 実装済み | `WeeklyVote`（横スクロール可能な5段階ボタン）。投票するまで集計は非表示 |
| コンテンツ | トップページにメインビジュアル／紹介文を表示 | ✅ 実装済み | 投票セクションに続く紹介文・産地カードを Tailwind v4 で構築 |
| コンテンツ | 産地（エリア）ページで工芸情報を一覧表示 | ⏳ WIP | Step 1: 静的モック、Step 2: JSON 化 |
| コンテンツ | ストーリービュー（年表・関係者） | ⏳ WIP | モックデータで UI 骨格を作成 |
| データ | モックデータ層 | ⏳ WIP | `src/data/*.json` を設けて RSC で読み込み予定 |
| データ | Supabase 連携 | 🔜 計画 | 認証 & 投稿管理、RLS 設計が必要 |
| インタラクション | 予約導線 / お問い合わせ | 🔜 計画 | MVP では情報リンクに留める |

---

## 🛡️ 非機能要件

- **UX（デバイス）**：スマートフォンでの利用を最優先。主要コンポーネントはモバイル表示から設計し、`sm` 以上で段階的に拡張。  
- **パフォーマンス**：Lighthouse Performance 80+（モバイル）。画像は `next/image`、RSC で初期負荷を低減。  
- **アクセシビリティ**：WCAG 2.1 AA を目標。ラベル、コントラスト、キーボード操作に留意。  
- **レスポンシブ**：モバイルファーストで `sm` / `md` / `lg` ブレークポイントを設計。  
- **コンテンツ運用**：Supabase 도입後、テーブル定義とロール権限（RLS）ポリシーを ADR に明記。  
- **多言語対応**：将来的に日本語 / 英語の切り替えを想定。初回は日本語固定。  
- **監視**：Vercel Analytics + LogDrains（必要に応じて）を想定。

---

## 🧠 アーキテクチャ指針

- Next.js App Router + React Server Components を採用し、データフェッチは極力 RSC で完結させる。  
- Tailwind CSS v4 をコアとし、コンポーネント層では `src/components/` を後日整備。  
- API Route Handlers（`src/app/api/*`）は Supabase 連携時に実装予定。  
- 重要な設計判断は ADR (`docs/adr/`) に記録し、README からリンクする。

---

## 🧭 ロードマップ

1. **Step 1**：静的な UI を Tailwind で整える（トップ／産地ページの骨格）。  
2. **Step 2**：モック JSON からの動的レンダリングと RSC データフェッチ。  
3. **Step 3**：Supabase 認証・データモデル設計、管理画面との連携。  
4. **Step 4**：Vercel へ MVP デプロイ、Lighthouse / a11y チェック、ユーザーテスト。

---

## 🤝 コントリビューション

- 本プロジェクトは **オープンな学習・試行開発** を目的としています。  
- 変更作業を行う際は、AI/人間問わず `AGENTS.md` のガイドラインを必ず確認してください。  
- Issue / PR テンプレートは今後追加予定です。改善提案があればお気軽に Issue を立ててください。

---

## 📜 ライセンス

© 2025 めぐる工芸舎 / ONDO Project.  
This project is released under the MIT License.
