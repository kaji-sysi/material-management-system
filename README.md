# 製造業向け工程管理システム (Manufacturing MES)

Next.jsで構築した製造業向けの包括的な工程管理システムのサンプルアプリケーションです。

## 🎯 主な機能

### 1. ダッシュボード
- リアルタイム統計表示
- 生産効率の可視化
- 工程ステータスの円グラフ
- 月次生産量・不良率の推移グラフ
- 進行中の工程一覧

### 2. ガントチャート
- 工程スケジュールのタイムライン表示
- 進捗状況の可視化
- 工程のフィルタリング機能
- 生産オーダー一覧

### 3. カンバンボード
- ドラッグ&ドロップでタスク管理
- 4つのステータス列（待機、進行中、承認待ち、完了）
- 優先度・担当者・期限の表示
- タスクの詳細情報

### 4. カレンダー
- 工程、保全、会議、納期、検査のスケジュール表示
- 月次/週次/日次ビュー切り替え
- イベント詳細モーダル
- 色分けされたイベントタイプ

### 5. 工程管理
- 工程の登録・編集・削除
- ステータス・進捗・優先度の管理
- 担当者・使用設備の割り当て
- 検索機能

### 6. 作業者管理
- 作業者情報の一覧表示
- スキル・資格の管理
- 稼働状況の可視化
- 部署別の整理

### 7. 在庫管理
- 原材料・部品・消耗品の在庫状況
- 在庫不足アラート
- カテゴリ別フィルタリング
- 総在庫金額の表示

### 8. 品質管理
- 品質検査結果の記録
- 合格率・不良率の統計
- 検査結果の分布グラフ
- 工程別検査状況

### 9. 設備管理
- 機械・設備の稼働状況
- メンテナンススケジュール
- 稼働時間の記録
- メンテナンスアラート

### 10. レポート
- 月次生産実績レポート
- KPIメトリクスの表示
- 各種グラフによる可視化
- レポートのエクスポート機能

## 🛠️ 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **言語**: TypeScript
- **データベース**: Supabase (PostgreSQL)
- **状態管理**: TanStack Query (React Query)
- **スタイリング**: Tailwind CSS
- **チャート**: Recharts
- **ドラッグ&ドロップ**: @dnd-kit
- **カレンダー**: react-big-calendar
- **日付処理**: date-fns
- **アイコン**: lucide-react

## 📦 インストールと起動

### クイックスタート（モックデータ）

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認できます。

**注**: 環境変数が設定されていない場合、モックデータが表示されます。

### Supabaseデータベースと連携

実際のデータベースを使用する場合は、[SUPABASE_SETUP.md](./SUPABASE_SETUP.md) を参照してください。

1. Supabaseプロジェクトを作成
2. `supabase/schema.sql` を実行してテーブルを作成
3. `.env.local` ファイルを作成して環境変数を設定:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. アプリケーションを再起動

## 📁 プロジェクト構造

```
material-management-system/
├── app/                      # Next.js App Router
│   ├── page.tsx             # ダッシュボード
│   ├── gantt/               # ガントチャート
│   ├── kanban/              # カンバンボード
│   ├── calendar/            # カレンダー
│   ├── processes/           # 工程管理
│   ├── workers/             # 作業者管理
│   ├── inventory/           # 在庫管理
│   ├── quality/             # 品質管理
│   ├── equipment/           # 設備管理
│   ├── reports/             # レポート
│   ├── layout.tsx           # 共通レイアウト
│   └── globals.css          # グローバルスタイル
├── components/              # Reactコンポーネント
│   ├── Navigation.tsx       # サイドバーナビゲーション
│   ├── GanttChart.tsx       # ガントチャートコンポーネント
│   ├── KanbanColumn.tsx     # カンバン列コンポーネント
│   └── TaskCard.tsx         # タスクカードコンポーネント
├── types/                   # TypeScript型定義
│   └── index.ts
├── lib/                     # ユーティリティとモックデータ
│   └── mockData.ts
└── package.json
```

## 📊 実装されている機能

### フロントエンド（UI/UX）
- ✅ ダッシュボード（統計・グラフ表示）
- ✅ ガントチャート（工程スケジュール管理）
- ✅ カンバンボード（ドラッグ&ドロップタスク管理）
- ✅ カレンダー（スケジュール可視化）
- ✅ 工程管理（CRUD操作UI）
- ✅ 作業者管理（スキル・資格管理）
- ✅ 在庫管理（在庫状況・アラート）
- ✅ 品質管理（検査結果・統計）
- ✅ 設備管理（稼働状況・メンテナンス）
- ✅ レポート（月次実績・KPI）

### バックエンド（データベース連携）
- ✅ Supabase クライアント設定
- ✅ データベーススキーマ（SQL）
- ✅ API関数（工程、作業者、在庫、品質、設備）
- ✅ React Query による状態管理
- 📝 各ページのデータベース連携（サンプル実装あり）

## 🎨 カスタマイズ

### モード選択

#### 1. モックデータモード（デフォルト）
環境変数を設定せずに起動すると、`lib/mockData.ts` のモックデータが使用されます。
- データベース不要
- すぐに動作確認可能

#### 2. Supabaseモード
`.env.local` に環境変数を設定すると、Supabaseデータベースに接続されます。
- 実際のCRUD操作が可能
- データの永続化

### データベース連携の実装

各APIエンドポイントは `lib/api/` ディレクトリにあります:
- `processes.ts` - 工程管理
- `workers.ts` - 作業者管理
- `inventory.ts` - 在庫管理
- `quality.ts` - 品質管理
- `equipment.ts` - 設備管理

ページでの使用例:

```typescript
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProcesses, createProcess } from '@/lib/api/processes';

export default function ProcessesPage() {
  const queryClient = useQueryClient();

  // データ取得
  const { data: processes, isLoading } = useQuery({
    queryKey: ['processes'],
    queryFn: getProcesses,
  });

  // 作成
  const createMutation = useMutation({
    mutationFn: createProcess,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processes'] });
    },
  });

  // ...
}
```

## 📝 ライセンス

このプロジェクトはサンプルアプリケーションです。
