# めぐる工芸舎（meguru-kogeisha）

日本の工芸をめぐり、記録し、つなぐデジタルプラットフォームです。  
本プロジェクトでは、伝統工芸と地域文化を現代のWeb体験として再構築し、  
「文化の生態系をめぐる」仕組みづくりを目指します。

---

## 🚀 クイックスタート

依存関係をインストール：
> pnpm i

開発サーバーを起動：
> pnpm dev

ブラウザで http://localhost:3000 を開くとトップページが表示されます。  
（Tailwind が動いていればタイトルが青色になります。）

---

## 🧩 プロジェクト構成

meguru-kogeisha/
├─ src/
│  └─ app/               # Next.js (App Router)
│     ├─ page.tsx        # トップページ
│     ├─ layout.tsx      # レイアウト設定
│     └─ globals.css     # グローバルスタイル (Tailwind)
│
├─ docs/
│  ├─ requirements/      # 要件定義 (MVP仕様・非機能要件など)
│  └─ adr/               # 重要設計判断 (Architecture Decision Record)
│
├─ AGENTS.md             # AI開発エージェント用ガイド
└─ README.md             # このファイル（人間用ドキュメント）

---

## 🧱 技術スタック

フレームワーク: Next.js 15 (App Router)  
言語: TypeScript  
UI / スタイル: Tailwind CSS 4  
パッケージ管理: pnpm  
ホスティング: Vercel (予定)  
データベース: Supabase (予定)

---

## 🧭 今後のロードマップ（MVP）

✅ Step 1: フロント構築（トップ・産地ページをTailwindで視覚化）  
🧩 Step 2: モックデータを利用して動的化（JSONで仮データ表示）  
🧠 Step 3: Supabase接続・管理画面との連携  
🚀 Step 4: VercelでのMVPデプロイ・テスト公開

---

## 🤝 貢献・開発ルール

- 本プロジェクトは **オープンな学習・試行開発** を目的としています。  
- コントリビュート時は AGENTS.md のガイドラインに従ってください。  
- バグ報告・提案は Issue または Pull Request にてお願いします。

---

## 📜 ライセンス

© 2025 めぐる工芸舎 / ONDO Project.  
This project is released under the MIT License.