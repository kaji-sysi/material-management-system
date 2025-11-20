export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      workers: {
        Row: {
          id: string
          name: string
          employee_number: string
          department: string
          skills: string[]
          email: string
          phone: string | null
          current_tasks: string[]
          availability: 'available' | 'busy' | 'offline'
          certifications: string[]
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['workers']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['workers']['Insert']>
      }
      equipment: {
        Row: {
          id: string
          name: string
          type: string
          model: string | null
          serial_number: string
          status: '稼働中' | '停止中' | 'メンテナンス' | '故障'
          location: string | null
          last_maintenance_date: string | null
          next_maintenance_date: string | null
          operating_hours: number
          assigned_processes: string[]
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['equipment']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['equipment']['Insert']>
      }
      processes: {
        Row: {
          id: string
          name: string
          description: string | null
          status: '未着手' | '進行中' | '完了' | '遅延' | '保留'
          start_date: string
          end_date: string
          progress: number
          assigned_workers: string[]
          equipment_ids: string[]
          parent_process_id: string | null
          dependencies: string[]
          priority: '低' | '中' | '高' | '緊急'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['processes']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['processes']['Insert']>
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          status: '待機' | '進行中' | '完了' | '承認待ち'
          priority: '低' | '中' | '高' | '緊急'
          assignee: string | null
          due_date: string | null
          process_id: string | null
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['tasks']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['tasks']['Insert']>
      }
      inventory_items: {
        Row: {
          id: string
          name: string
          sku: string
          category: string
          quantity: number
          unit: string
          min_stock: number
          max_stock: number
          location: string | null
          supplier: string | null
          unit_price: number
          last_updated: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['inventory_items']['Row'], 'last_updated' | 'created_at'>
        Update: Partial<Database['public']['Tables']['inventory_items']['Insert']>
      }
      quality_checks: {
        Row: {
          id: string
          process_id: string
          inspector_id: string
          check_date: string
          status: '合格' | '不合格' | '要確認' | '再検査'
          defect_count: number
          samples_checked: number
          notes: string | null
          criteria: string[]
          images: string[]
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['quality_checks']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['quality_checks']['Insert']>
      }
      production_orders: {
        Row: {
          id: string
          order_number: string
          product_name: string
          quantity: number
          start_date: string
          due_date: string
          status: '未着手' | '進行中' | '完了' | '遅延' | '保留'
          priority: '低' | '中' | '高' | '緊急'
          customer: string | null
          processes: string[]
          progress: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['production_orders']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['production_orders']['Insert']>
      }
      calendar_events: {
        Row: {
          id: string
          title: string
          start_time: string
          end_time: string
          event_type: 'process' | 'maintenance' | 'meeting' | 'deadline' | 'inspection'
          description: string | null
          related_id: string | null
          attendees: string[]
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['calendar_events']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['calendar_events']['Insert']>
      }
      monthly_reports: {
        Row: {
          id: string
          period: string
          processes_completed: number
          production_volume: number
          defect_rate: number
          equipment_downtime: number
          labor_hours: number
          efficiency: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['monthly_reports']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['monthly_reports']['Insert']>
      }
    }
  }
}
