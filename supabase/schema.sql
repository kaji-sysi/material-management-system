-- 製造業向け工程管理システムのデータベーススキーマ

-- 作業者テーブル
CREATE TABLE IF NOT EXISTS workers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  employee_number TEXT UNIQUE NOT NULL,
  department TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}',
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  current_tasks TEXT[] DEFAULT '{}',
  availability TEXT CHECK (availability IN ('available', 'busy', 'offline')) DEFAULT 'available',
  certifications TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 設備テーブル
CREATE TABLE IF NOT EXISTS equipment (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  model TEXT,
  serial_number TEXT UNIQUE NOT NULL,
  status TEXT CHECK (status IN ('稼働中', '停止中', 'メンテナンス', '故障')) DEFAULT '停止中',
  location TEXT,
  last_maintenance_date TIMESTAMP WITH TIME ZONE,
  next_maintenance_date TIMESTAMP WITH TIME ZONE,
  operating_hours INTEGER DEFAULT 0,
  assigned_processes TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 工程テーブル
CREATE TABLE IF NOT EXISTS processes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('未着手', '進行中', '完了', '遅延', '保留')) DEFAULT '未着手',
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  assigned_workers TEXT[] DEFAULT '{}',
  equipment_ids TEXT[] DEFAULT '{}',
  parent_process_id TEXT REFERENCES processes(id),
  dependencies TEXT[] DEFAULT '{}',
  priority TEXT CHECK (priority IN ('低', '中', '高', '緊急')) DEFAULT '中',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- タスクテーブル（カンバン用）
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('待機', '進行中', '完了', '承認待ち')) DEFAULT '待機',
  priority TEXT CHECK (priority IN ('低', '中', '高', '緊急')) DEFAULT '中',
  assignee TEXT REFERENCES workers(id),
  due_date TIMESTAMP WITH TIME ZONE,
  process_id TEXT REFERENCES processes(id),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 在庫アイテムテーブル
CREATE TABLE IF NOT EXISTS inventory_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  quantity INTEGER DEFAULT 0 CHECK (quantity >= 0),
  unit TEXT NOT NULL,
  min_stock INTEGER DEFAULT 0,
  max_stock INTEGER DEFAULT 0,
  location TEXT,
  supplier TEXT,
  unit_price DECIMAL(10, 2) DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 品質検査テーブル
CREATE TABLE IF NOT EXISTS quality_checks (
  id TEXT PRIMARY KEY,
  process_id TEXT NOT NULL REFERENCES processes(id),
  inspector_id TEXT NOT NULL REFERENCES workers(id),
  check_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT CHECK (status IN ('合格', '不合格', '要確認', '再検査')) DEFAULT '要確認',
  defect_count INTEGER DEFAULT 0,
  samples_checked INTEGER NOT NULL,
  notes TEXT,
  criteria TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 生産オーダーテーブル
CREATE TABLE IF NOT EXISTS production_orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT CHECK (status IN ('未着手', '進行中', '完了', '遅延', '保留')) DEFAULT '未着手',
  priority TEXT CHECK (priority IN ('低', '中', '高', '緊急')) DEFAULT '中',
  customer TEXT,
  processes TEXT[] DEFAULT '{}',
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- カレンダーイベントテーブル
CREATE TABLE IF NOT EXISTS calendar_events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  event_type TEXT CHECK (event_type IN ('process', 'maintenance', 'meeting', 'deadline', 'inspection')) NOT NULL,
  description TEXT,
  related_id TEXT,
  attendees TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 月次レポートデータテーブル
CREATE TABLE IF NOT EXISTS monthly_reports (
  id TEXT PRIMARY KEY,
  period TEXT UNIQUE NOT NULL,
  processes_completed INTEGER DEFAULT 0,
  production_volume INTEGER DEFAULT 0,
  defect_rate DECIMAL(5, 2) DEFAULT 0,
  equipment_downtime INTEGER DEFAULT 0,
  labor_hours INTEGER DEFAULT 0,
  efficiency DECIMAL(5, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 更新日時の自動更新トリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 各テーブルに更新トリガーを追加
CREATE TRIGGER update_workers_updated_at BEFORE UPDATE ON workers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON equipment FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_processes_updated_at BEFORE UPDATE ON processes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quality_checks_updated_at BEFORE UPDATE ON quality_checks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_production_orders_updated_at BEFORE UPDATE ON production_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON calendar_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_monthly_reports_updated_at BEFORE UPDATE ON monthly_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_workers_department ON workers(department);
CREATE INDEX IF NOT EXISTS idx_workers_availability ON workers(availability);
CREATE INDEX IF NOT EXISTS idx_equipment_status ON equipment(status);
CREATE INDEX IF NOT EXISTS idx_processes_status ON processes(status);
CREATE INDEX IF NOT EXISTS idx_processes_dates ON processes(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assignee);
CREATE INDEX IF NOT EXISTS idx_inventory_items_category ON inventory_items(category);
CREATE INDEX IF NOT EXISTS idx_quality_checks_process ON quality_checks(process_id);
CREATE INDEX IF NOT EXISTS idx_quality_checks_status ON quality_checks(status);
CREATE INDEX IF NOT EXISTS idx_production_orders_status ON production_orders(status);
CREATE INDEX IF NOT EXISTS idx_calendar_events_dates ON calendar_events(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_calendar_events_type ON calendar_events(event_type);
