import { supabase } from '@/lib/supabase';
import type { Worker } from '@/types';

// 作業者の全件取得
export async function getWorkers(): Promise<Worker[]> {
  const { data, error } = await supabase
    .from('workers')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching workers:', error);
    throw error;
  }

  return data.map(item => ({
    ...item,
    employeeNumber: item.employee_number,
    currentTasks: item.current_tasks,
  }));
}

// 作業者の単一取得
export async function getWorker(id: string): Promise<Worker | null> {
  const { data, error } = await supabase
    .from('workers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching worker:', error);
    throw error;
  }

  if (!data) return null;

  return {
    ...data,
    employeeNumber: data.employee_number,
    currentTasks: data.current_tasks,
  };
}

// 作業者の作成
export async function createWorker(worker: Omit<Worker, 'id'>): Promise<Worker> {
  const { data, error } = await supabase
    .from('workers')
    .insert({
      id: `W${Date.now()}`,
      name: worker.name,
      employee_number: worker.employeeNumber,
      department: worker.department,
      skills: worker.skills,
      email: worker.email,
      phone: worker.phone,
      current_tasks: worker.currentTasks,
      availability: worker.availability,
      certifications: worker.certifications,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating worker:', error);
    throw error;
  }

  return {
    ...data,
    employeeNumber: data.employee_number,
    currentTasks: data.current_tasks,
  };
}

// 作業者の更新
export async function updateWorker(id: string, updates: Partial<Worker>): Promise<Worker> {
  const updateData: any = { ...updates };

  if (updates.employeeNumber) {
    updateData.employee_number = updates.employeeNumber;
    delete updateData.employeeNumber;
  }

  if (updates.currentTasks) {
    updateData.current_tasks = updates.currentTasks;
    delete updateData.currentTasks;
  }

  const { data, error } = await supabase
    .from('workers')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating worker:', error);
    throw error;
  }

  return {
    ...data,
    employeeNumber: data.employee_number,
    currentTasks: data.current_tasks,
  };
}

// 作業者の削除
export async function deleteWorker(id: string): Promise<void> {
  const { error } = await supabase
    .from('workers')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting worker:', error);
    throw error;
  }
}
