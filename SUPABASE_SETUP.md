# Supabase セットアップガイド

このガイドでは、製造管理システムをSupabaseデータベースに接続する手順を説明します。

## 📋 前提条件

- Supabaseアカウント (https://supabase.com/)
- Node.js 18以上
- プロジェクトが既にクローンされていること

## 🚀 セットアップ手順

### 1. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com/)にログイン
2. 「New Project」をクリック
3. プロジェクト名、データベースパスワードを設定
4. リージョンを選択（日本の場合は Tokyo または Singapore推奨）
5. プロジェクトが作成されるまで数分待つ

### 2. データベーススキーマの作成

1. Supabaseダッシュボードで「SQL Editor」を開く
2. `supabase/schema.sql` ファイルの内容をコピー
3. SQLエディタにペーストして実行
4. すべてのテーブルとインデックスが作成されたことを確認

### 3. 環境変数の設定

1. Supabaseダッシュボードで「Settings」→「API」を開く
2. 以下の情報をコピー:
   - `Project URL`
   - `anon public` キー

3. プロジェクトルートに `.env.local` ファイルを作成:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. 初期データの投入（オプション）

モックデータをデータベースに投入する場合:

```sql
-- 作業者データ
INSERT INTO workers (id, name, employee_number, department, skills, email, phone, current_tasks, availability, certifications)
VALUES
  ('W001', '山田太郎', 'EMP001', '製造部', ARRAY['溶接', 'CNC加工', '品質検査'], 'yamada@example.com', '03-1234-5678', ARRAY['T001', 'T005'], 'busy', ARRAY['溶接技能士1級', '品質管理検定2級']),
  ('W002', '佐藤花子', 'EMP002', '品質管理部', ARRAY['品質検査', 'データ分析', '文書管理'], 'sato@example.com', '03-1234-5679', ARRAY['T003'], 'available', ARRAY['品質管理検定1級', 'ISO9001内部監査員']);

-- 設備データ
INSERT INTO equipment (id, name, type, model, serial_number, status, location, last_maintenance_date, next_maintenance_date, operating_hours, assigned_processes)
VALUES
  ('E001', 'CNCフライス盤', '加工機械', 'DMU-50', 'SN-2023-001', '稼働中', '第1工場 A-101', '2024-10-15', '2025-01-15', 4520, ARRAY['P001', 'P003']),
  ('E002', '溶接ロボット', 'ロボット', 'ARC-Mate-100', 'SN-2023-002', '稼働中', '第1工場 B-205', '2024-11-01', '2025-02-01', 3280, ARRAY['P002']);

-- 工程データ
INSERT INTO processes (id, name, description, status, start_date, end_date, progress, assigned_workers, equipment_ids, dependencies, priority)
VALUES
  ('P001', '部品A 切削加工', 'ステンレス製部品Aの精密切削加工', '進行中', '2024-11-15', '2024-11-25', 65, ARRAY['W001', 'W003'], ARRAY['E001'], ARRAY[]::TEXT[], '高'),
  ('P002', '部品B 溶接工程', 'フレーム部品の自動溶接', '進行中', '2024-11-18', '2024-11-28', 45, ARRAY['W001'], ARRAY['E002'], ARRAY['P001'], '高');

-- 在庫データ
INSERT INTO inventory_items (id, name, sku, category, quantity, unit, min_stock, max_stock, location, supplier, unit_price)
VALUES
  ('INV001', 'ステンレス鋼板 SUS304', 'MAT-SS-001', '原材料', 450, 'kg', 200, 1000, '倉庫A-1', '山田鋼材株式会社', 850),
  ('INV002', '溶接棒 E308', 'CON-WR-001', '消耗品', 180, '本', 100, 500, '倉庫B-3', '溶材商事', 320);
```

### 5. Row Level Security (RLS) の設定（推奨）

開発中はRLSを無効化するか、すべてのユーザーに読み書き権限を付与:

```sql
-- 全テーブルに対して一時的に全権限を付与（開発用）
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for authenticated users" ON workers FOR ALL TO authenticated USING (true);

ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for authenticated users" ON equipment FOR ALL TO authenticated USING (true);

ALTER TABLE processes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for authenticated users" ON processes FOR ALL TO authenticated USING (true);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for authenticated users" ON tasks FOR ALL TO authenticated USING (true);

ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for authenticated users" ON inventory_items FOR ALL TO authenticated USING (true);

ALTER TABLE quality_checks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for authenticated users" ON quality_checks FOR ALL TO authenticated USING (true);

ALTER TABLE production_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for authenticated users" ON production_orders FOR ALL TO authenticated USING (true);

ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for authenticated users" ON calendar_events FOR ALL TO authenticated USING (true);

ALTER TABLE monthly_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for authenticated users" ON monthly_reports FOR ALL TO authenticated USING (true);
```

### 6. アプリケーションの起動

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで http://localhost:3000 を開くと、Supabaseに接続されたアプリケーションが起動します。

## 📊 データベース構造

### テーブル一覧

- `workers` - 作業者情報
- `equipment` - 設備情報
- `processes` - 工程情報
- `tasks` - タスク（カンバン用）
- `inventory_items` - 在庫アイテム
- `quality_checks` - 品質検査記録
- `production_orders` - 生産オーダー
- `calendar_events` - カレンダーイベント
- `monthly_reports` - 月次レポート

詳細なスキーマは `supabase/schema.sql` を参照してください。

## 🔧 API使用方法

### 工程の取得

```typescript
import { getProcesses } from '@/lib/api/processes';

const processes = await getProcesses();
```

### 工程の作成

```typescript
import { createProcess } from '@/lib/api/processes';

const newProcess = await createProcess({
  name: '新規工程',
  description: '説明',
  status: '未着手',
  startDate: new Date(),
  endDate: new Date(),
  progress: 0,
  assignedWorkers: [],
  equipmentIds: [],
  dependencies: [],
  priority: '中',
});
```

### React Queryを使用したデータフェッチ

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { getProcesses } from '@/lib/api/processes';

export default function ProcessList() {
  const { data: processes, isLoading } = useQuery({
    queryKey: ['processes'],
    queryFn: getProcesses,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {processes?.map(process => (
        <div key={process.id}>{process.name}</div>
      ))}
    </div>
  );
}
```

## 🐛 トラブルシューティング

### 接続エラー

- `.env.local` ファイルが正しく設定されているか確認
- Supabase URLとAPIキーが正しいか確認
- 開発サーバーを再起動

### データが表示されない

- Supabaseダッシュボードの「Table Editor」でデータが存在するか確認
- RLSポリシーが正しく設定されているか確認
- ブラウザのコンソールでエラーメッセージを確認

### CORS エラー

- Supabaseの設定で許可されているオリジンを確認
- `localhost:3000` が許可されているか確認

## 📝 次のステップ

1. 認証機能の追加（Supabase Auth）
2. リアルタイム更新の実装（Supabase Realtime）
3. ファイルアップロード機能（Supabase Storage）
4. 本番環境へのデプロイ

## 🔒 セキュリティ

本番環境では以下を実施してください:

1. RLSポリシーの適切な設定
2. 認証の実装
3. 環境変数の適切な管理
4. APIキーの保護
5. HTTPS の使用
