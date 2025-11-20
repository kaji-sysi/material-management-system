// 製造業向け工程管理システムの型定義

export type ProcessStatus = '未着手' | '進行中' | '完了' | '遅延' | '保留';
export type TaskStatus = '待機' | '進行中' | '完了' | '承認待ち';
export type Priority = '低' | '中' | '高' | '緊急';
export type QualityStatus = '合格' | '不合格' | '要確認' | '再検査';
export type EquipmentStatus = '稼働中' | '停止中' | 'メンテナンス' | '故障';

// 工程
export interface Process {
  id: string;
  name: string;
  description: string;
  status: ProcessStatus;
  startDate: Date;
  endDate: Date;
  progress: number;
  assignedWorkers: string[];
  equipmentIds: string[];
  parentProcessId?: string;
  dependencies: string[];
  priority: Priority;
}

// タスク（カンバン用）
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assignee?: string;
  dueDate?: Date;
  processId?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// 作業者
export interface Worker {
  id: string;
  name: string;
  employeeNumber: string;
  department: string;
  skills: string[];
  email: string;
  phone: string;
  currentTasks: string[];
  availability: 'available' | 'busy' | 'offline';
  certifications: string[];
}

// 機械・設備
export interface Equipment {
  id: string;
  name: string;
  type: string;
  model: string;
  serialNumber: string;
  status: EquipmentStatus;
  location: string;
  lastMaintenanceDate: Date;
  nextMaintenanceDate: Date;
  operatingHours: number;
  assignedProcesses: string[];
}

// 在庫アイテム
export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  maxStock: number;
  location: string;
  supplier: string;
  unitPrice: number;
  lastUpdated: Date;
}

// 品質検査
export interface QualityCheck {
  id: string;
  processId: string;
  inspectorId: string;
  checkDate: Date;
  status: QualityStatus;
  defectCount: number;
  samplesChecked: number;
  notes: string;
  criteria: string[];
  images?: string[];
}

// 生産オーダー
export interface ProductionOrder {
  id: string;
  orderNumber: string;
  productName: string;
  quantity: number;
  startDate: Date;
  dueDate: Date;
  status: ProcessStatus;
  priority: Priority;
  customer: string;
  processes: string[];
  progress: number;
}

// カレンダーイベント
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'process' | 'maintenance' | 'meeting' | 'deadline' | 'inspection';
  description?: string;
  relatedId?: string;
  attendees?: string[];
}

// ダッシュボード統計
export interface DashboardStats {
  totalProcesses: number;
  activeProcesses: number;
  completedProcesses: number;
  delayedProcesses: number;
  totalWorkers: number;
  availableWorkers: number;
  equipmentUtilization: number;
  qualityRate: number;
  productionEfficiency: number;
}

// レポートデータ
export interface ReportData {
  period: string;
  processesCompleted: number;
  productionVolume: number;
  defectRate: number;
  equipmentDowntime: number;
  laborHours: number;
  efficiency: number;
}
