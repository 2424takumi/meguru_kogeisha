# めぐる工芸舎 — 投票機能 仕様（MVP＋拡張可能設計）

## 目的
- 産地やプロジェクトに関する論点を、使い手/作り手/支え手の合意形成や洞察に変える。
- MVPでは **5段階（リッカート）** を既定としつつ、**他方式を後から追加できるデータモデル/API/UI** にしておく。
- 各投票に **任意コメント欄**（選択後に出現）を付与できる。

---

## スコープ（MVP）
- 投票一覧（トップのサマリー＋詳細ページへ動線）
- 投票詳細（設問、背景説明、投票UI、任意コメント、送信、結果表示）
- API（投票送信、結果取得）
- 集計・可視化（分布・平均など）
- 多重投票の暫定制御（同一ブラウザ1票前提。将来は認証/端末指紋/レート制限）

> 将来拡張：スライダー、順位付け、複数選択、モデレーション済みコメント公開、ログインとポイント連携、RLS強化 など

---

## 用語
- **設問（Question）**: 投票の単位。説明・期間・方式・選択肢定義を含む。
- **投票（Ballot）**: 1ユーザーが1設問へ行った回答。任意のコメント含む。
- **方式（VoteType）**:
  - `likert5`（-2..+2）、`yesno`、`single`（単一選択）、`multiple`（複数選択）
  - 将来: `slider`（数値レンジ）、`ranked`（順位付け）

---

## 機能一覧（MVP）
1) **投票方式**  
   既定：`likert5`。`yesno` / `single` / `multiple` を追加しやすいUI/データ設計。
2) **任意コメント**  
   `allow_comment=true` の設問では、**選択後に**テキストエリアを表示（未入力可）。
3) **トップのサマリー**  
   簡易説明＋ミニUI（5段階など）＋「詳しく見る」ボタン → 詳細ページ。
4) **投票結果**  
   方式に応じた分布、合計、（数値系は平均）を表示。詳細ページにグラフ/表。
5) **制御**  
   期間（開始/終了）、公開/終了状態、重複投票の簡易抑止（cookie/localStorage）。

---

## UI フロー（MVP）
- **トップページ（/）**
  - 「今週の投票」カード（タイトル、1行説明、進行状況バー、**ミニ投票UI**）
  - ミニUIで選択すると即送信 or 詳細へ遷移（設定で切替可）
  - **詳しく見る** → `/votes/[id]`

- **投票詳細（/votes/[id]）**
  1. ヒーロー：タイトル、締切、タグ（産地/素材）
  2. 概要：背景説明（折りたたみ）
  3. **投票UI**：方式に応じて自動レンダリング  
     - リッカート：強反対〜強賛成（-2..+2）
     - Yes/No：2択
     - 単一選択（ラジオ）、複数選択（チェックボックス）
     - **選択後に任意コメント欄が出現**（`allow_comment=true`）
  4. 送信 → トースト「ご協力ありがとうございます」
  5. 結果概要（バー、円、分布表、平均）
  6. 「結果詳細を見る」→ `/votes/[id]/results`（将来：コメント公開/ロジ分析）

---

## アクセシビリティ
- ラジオ/チェックに `aria-labelledby` 付与
- コメント欄に `aria-describedby`（「任意入力」明記）、**文字数カウンタ**（例 0/2000）
- キーボード操作可能、フォーカスリング表示

---

## データモデル（Supabase 想定）

### テーブル: `vote_questions`
| 列名 | 型 | 必須 | 説明 |
|---|---|---|---|
| id | uuid | PK | |
| title | text | ✓ | タイトル |
| summary | text |  | 一行説明 |
| description_md | text |  | 背景説明（md） |
| vote_type | text | ✓ | `'likert5'|'yesno'|'single'|'multiple'|'slider'|'ranked'` |
| allow_comment | boolean | ✓ | 既定 false |
| comment_required | boolean | ✓ | 既定 false（MVPは false） |
| comment_label | text |  | プレースホルダ |
| start_at | timestamptz | ✓ | |
| end_at | timestamptz | ✓ | |
| status | text | ✓ | `'draft'|'open'|'closed'` |
| created_at | timestamptz | ✓ | default now() |

（拡張フィールド：`min_choices`, `max_choices`, `scale_min`, `scale_max`, `scale_step` など）

---

### テーブル: `vote_options`
| 列名 | 型 | 必須 | 説明 |
|---|---|---|---|
| id | uuid | PK | |
| question_id | uuid | ✓ FK | |
| value_key | text |  | 例：`"-2"`, `"yes"` |
| label | text | ✓ | 表示ラベル |
| order_index | smallint | ✓ | 表示順 |
| numeric_value | smallint |  | `likert5` 等の数値 |

> `likert5/yesno/single/multiple/ranked` は選択肢を行で保持。`slider` は不要。

---

### テーブル: `vote_ballots`（ヘッダ）
| 列名 | 型 | 必須 | 説明 |
|---|---|---|---|
| id | uuid | PK | |
| question_id | uuid | ✓ FK | |
| user_id | uuid |  | 将来の認証用（MVPはnull） |
| comment_text | text |  | 任意コメント |
| created_at | timestamptz | ✓ | default now() |

> 将来：Unique(question_id,user_id)

---

### テーブル: `vote_ballot_choices`（明細）
| 列名 | 型 | 必須 | 説明 |
|---|---|---|---|
| id | uuid | PK | |
| ballot_id | uuid | ✓ FK | |
| option_id | uuid |  | `slider` の場合は null 可 |
| rank | smallint |  | `ranked` 用 |
| numeric_value | integer |  | `likert5/slider` 用 |

> Unique(ballot_id, option_id, rank)（null 許容を考慮）

---

## API 仕様（Next.js Route Handlers）

### 1) 送信: `POST /api/votes/[id]/ballots`
**Request（共通）**
```json
{
  "choices": [
    { "option_id": "uuid-of-+1", "numeric_value": 1 }
  ],
  "comment": "任意の意見（省略可）"
}
```

方式別 例
	•	yesno: [{"option_id":"<yes-uuid>"}]
	•	single: [{"option_id":"<uuid>"}]
	•	multiple: [{"option_id":"<a>"},{"option_id":"<c>"}]（min/max_choices 準拠）
	•	likert5: [{"option_id":"<uuid>", "numeric_value": 2}]
	•	slider: [{"numeric_value": 72}]
	•	ranked: [{"option_id":"<a>","rank":1},{"option_id":"<c>","rank":2}]

Response

{ "ok": true }

バリデーション（必須）
	•	status='open' かつ start_at <= now <= end_at
	•	方式別ルール
	•	likert5: choices.length===1 かつ numeric_value ∈ {-2,-1,0,1,2}
	•	yesno: choices.length===1（yes/no のいずれか）
	•	single: choices.length===1
	•	multiple: min_choices <= length <= max_choices
	•	slider: scale_min <= numeric_value <= scale_max（step考慮）
	•	ranked: rank が 1..N 連番で重複なし
	•	allow_comment=false の設問はコメント受理しない（サニタイズ含む）
	•	コメント長 ≤ 2000

⸻

2) 結果: GET /api/votes/[id]/results

Response（例：likert5）

{
  "vote_type": "likert5",
  "total": 128,
  "distribution": [
    { "key":"-2", "label":"強く反対", "count": 8, "percent": 6.3 },
    { "key":"-1", "label":"反対",     "count": 20, "percent": 15.6 },
    { "key":"0",  "label":"どちらでもない", "count":40, "percent":31.3 },
    { "key":"+1", "label":"賛成",     "count": 44, "percent": 34.4 },
    { "key":"+2", "label":"強く賛成", "count": 16, "percent": 12.5 }
  ],
  "avg": 0.31
}

方式に応じて distribution のキー/指標を出し分け（numeric系は avg）。

⸻

集計・表示
	•	都度集計（MVP）：COUNT(*) / AVG(numeric_value) 等
	•	キャッシュは/api/votes/[id]/resultsで 30〜60秒程度（stale-while-revalidate）
	•	グラフ：バー/ドーナツ。数値系は平均/中央値表示（中央値は将来）

⸻

セキュリティ/多重投票（MVP）
	•	同一ブラウザの重複抑止：localStorage に ballot:<question_id> フラグ
	•	レート制限（将来）：IP＋User-Agent で簡易ブロック、Bot対策
	•	将来：認証（Supabase Auth）導入時に Unique(question_id,user_id) へ移行
	•	コメント公開は当面しない（モデレーション準備後に段階導入）

⸻

非機能要件
	•	パフォーマンス：LCP < 2.5s（投票UIはRSC優先、JS最小）
	•	アクセシビリティ：WCAG 2.1 AA 相当（フォーカス/ラベル/コントラスト）
	•	i18n：テキストは翻訳キー化（将来）

⸻

受入基準（Acceptance Criteria）
	•	likert5 を含む4方式（likert5/yesno/single/multiple）の UI/送信/集計が動作
	•	allow_comment=true の設問で 選択後に任意コメント欄が出現し、保存される
	•	バリデーションが方式別に働き、不正入力は 400
	•	結果APIが distribution と（numeric系は）avg を返す
	•	トップのサマリーに「詳しく見る」があり、詳細ページへ遷移できる
	•	同一ブラウザの二重投票はミニマムに抑止される

⸻

テスト（例）
	•	単体：各方式の入力正当/異常系（境界値、min/max、rank重複等）
	•	API：POST /ballots での400/200、GET /results の整合性
	•	E2E：トップ→詳細→投票→結果までの流れ（Cypress/Playwright）
	•	アクセシビリティ：ラベル、キーボード操作

⸻

実装メモ
	•	コンポーネント分割：
VoteForm（親） → Likert5Picker / YesNoPicker / SinglePicker / MultiPicker
	•	子は onChange(choices) で配列を返すだけに絞る
	•	親が allow_comment を見て、選択が入ったらコメント欄を表示
	•	APIは 共通POST フォーマットを維持（将来の方式追加が容易）
	•	集計負荷が出たら vote_results_counters の増分更新に切替

⸻

マイグレーション（参考SQL・PostgreSQL）

-- 既存テーブルに不足列の追加（存在チェックは省略）
ALTER TABLE vote_questions
  ADD COLUMN IF NOT EXISTS vote_type text NOT NULL DEFAULT 'likert5',
  ADD COLUMN IF NOT EXISTS allow_comment boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS comment_required boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS comment_label text,
  ADD COLUMN IF NOT EXISTS start_at timestamptz,
  ADD COLUMN IF NOT EXISTS end_at timestamptz,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS min_choices smallint,
  ADD COLUMN IF NOT EXISTS max_choices smallint,
  ADD COLUMN IF NOT EXISTS scale_min integer,
  ADD COLUMN IF NOT EXISTS scale_max integer,
  ADD COLUMN IF NOT EXISTS scale_step integer;

CREATE TABLE IF NOT EXISTS vote_ballot_choices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ballot_id uuid NOT NULL REFERENCES vote_ballots(id) ON DELETE CASCADE,
  option_id uuid REFERENCES vote_options(id) ON DELETE SET NULL,
  rank smallint,
  numeric_value integer
);
-- 拘束（一例）
-- CREATE UNIQUE INDEX ON vote_ballot_choices (ballot_id, option_id, rank);


⸻

将来拡張
	•	slider と ranked のUI/バリデーションと集計
	•	コメント公開（モデレーション、NGワード、並び替え）
	•	認証連携＆ポイント（重複投票の厳密化）
	•	結果の比較（産地別/属性別のクロス集計）、エクスポート

これで、**MVPを安全に作りきりつつ拡張にも耐える**設計になっています。  
次はこの仕様に沿って、フロントの `VoteForm` を「方式別サブコンポーネント＋共通POST」に整理 → APIバリデーション実装 → 1件テストデータで通し動作、の順でいきましょう。

