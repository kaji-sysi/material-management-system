import { supabase } from '@/lib/supabase';
import type { Process } from '@/types';

// 工程の全件取得
export async function getProcesses(): Promise<Process[]> {
  const { data, error } = await supabase
    .from('processes')
    .select('*')
    .order('start_date', { ascending: false });

  if (error) {
    console.error('Error fetching processes:', error);
    throw error;
  }

  return data.map(item => ({
    ...item,
    startDate: new Date(item.start_date),
    endDate: new Date(item.end_date),
    assignedWorkers: item.assigned_workers,
    equipmentIds: item.equipment_ids,
    parentProcessId: item.parent_process_id || undefined,
  }));
}

// 工程の単一取得
export async function getProcess(id: string): Promise<Process | null> {
  const { data, error } = await supabase
    .from('processes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching process:', error);
    throw error;
  }

  if (!data) return null;

  return {
    ...data,
    startDate: new Date(data.start_date),
    endDate: new Date(data.end_date),
    assignedWorkers: data.assigned_workers,
    equipmentIds: data.equipment_ids,
    parentProcessId: data.parent_process_id || undefined,
  };
}

// 工程の作成
export async function createProcess(process: Omit<Process, 'id'>): Promise<Process> {
  const { data, error } = await supabase
    .from('processes')
    .insert({
      id: `P${Date.now()}`,
      name: process.name,
      description: process.description,
      status: process.status,
      start_date: process.startDate.toISOString(),
      end_date: process.endDate.toISOString(),
      progress: process.progress,
      assigned_workers: process.assignedWorkers,
      equipment_ids: process.equipmentIds,
      parent_process_id: process.parentProcessId || null,
      dependencies: process.dependencies,
      priority: process.priority,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating process:', error);
    throw error;
  }

  return {
    ...data,
    startDate: new Date(data.start_date),
    endDate: new Date(data.end_date),
    assignedWorkers: data.assigned_workers,
    equipmentIds: data.equipment_ids,
    parentProcessId: data.parent_process_id || undefined,
  };
}

// 工程の更新
export async function updateProcess(id: string, updates: Partial<Process>): Promise<Process> {
  const updateData: any = {
    ...updates,
  };

  if (updates.startDate) {
    updateData.start_date = updates.startDate.toISOString();
    delete updateData.startDate;
  }

  if (updates.endDate) {
    updateData.end_date = updates.endDate.toISOString();
    delete updateData.endDate;
  }

  if (updates.assignedWorkers) {
    updateData.assigned_workers = updates.assignedWorkers;
    delete updateData.assignedWorkers;
  }

  if (updates.equipmentIds) {
    updateData.equipment_ids = updates.equipmentIds;
    delete updateData.equipmentIds;
  }

  if (updates.parentProcessId !== undefined) {
    updateData.parent_process_id = updates.parentProcessId || null;
    delete updateData.parentProcessId;
  }

  const { data, error } = await supabase
    .from('processes')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating process:', error);
    throw error;
  }

  return {
    ...data,
    startDate: new Date(data.start_date),
    endDate: new Date(data.end_date),
    assignedWorkers: data.assigned_workers,
    equipmentIds: data.equipment_ids,
    parentProcessId: data.parent_process_id || undefined,
  };
}

// 工程の削除
export async function deleteProcess(id: string): Promise<void> {
  const { error } = await supabase
    .from('processes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting process:', error);
    throw error;
  }
}
