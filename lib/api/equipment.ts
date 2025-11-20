import { supabase } from '@/lib/supabase';
import type { Equipment } from '@/types';

// 設備の全件取得
export async function getEquipment(): Promise<Equipment[]> {
  const { data, error } = await supabase
    .from('equipment')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching equipment:', error);
    throw error;
  }

  return data.map(item => ({
    ...item,
    serialNumber: item.serial_number,
    lastMaintenanceDate: new Date(item.last_maintenance_date),
    nextMaintenanceDate: new Date(item.next_maintenance_date),
    operatingHours: item.operating_hours,
    assignedProcesses: item.assigned_processes,
  }));
}

// 設備の単一取得
export async function getEquipmentById(id: string): Promise<Equipment | null> {
  const { data, error } = await supabase
    .from('equipment')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching equipment:', error);
    throw error;
  }

  if (!data) return null;

  return {
    ...data,
    serialNumber: data.serial_number,
    lastMaintenanceDate: new Date(data.last_maintenance_date),
    nextMaintenanceDate: new Date(data.next_maintenance_date),
    operatingHours: data.operating_hours,
    assignedProcesses: data.assigned_processes,
  };
}

// 設備の作成
export async function createEquipment(equipment: Omit<Equipment, 'id'>): Promise<Equipment> {
  const { data, error } = await supabase
    .from('equipment')
    .insert({
      id: `E${Date.now()}`,
      name: equipment.name,
      type: equipment.type,
      model: equipment.model,
      serial_number: equipment.serialNumber,
      status: equipment.status,
      location: equipment.location,
      last_maintenance_date: equipment.lastMaintenanceDate.toISOString(),
      next_maintenance_date: equipment.nextMaintenanceDate.toISOString(),
      operating_hours: equipment.operatingHours,
      assigned_processes: equipment.assignedProcesses,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating equipment:', error);
    throw error;
  }

  return {
    ...data,
    serialNumber: data.serial_number,
    lastMaintenanceDate: new Date(data.last_maintenance_date),
    nextMaintenanceDate: new Date(data.next_maintenance_date),
    operatingHours: data.operating_hours,
    assignedProcesses: data.assigned_processes,
  };
}

// 設備の更新
export async function updateEquipment(id: string, updates: Partial<Equipment>): Promise<Equipment> {
  const updateData: any = { ...updates };

  if (updates.serialNumber) {
    updateData.serial_number = updates.serialNumber;
    delete updateData.serialNumber;
  }

  if (updates.lastMaintenanceDate) {
    updateData.last_maintenance_date = updates.lastMaintenanceDate.toISOString();
    delete updateData.lastMaintenanceDate;
  }

  if (updates.nextMaintenanceDate) {
    updateData.next_maintenance_date = updates.nextMaintenanceDate.toISOString();
    delete updateData.nextMaintenanceDate;
  }

  if (updates.operatingHours !== undefined) {
    updateData.operating_hours = updates.operatingHours;
    delete updateData.operatingHours;
  }

  if (updates.assignedProcesses) {
    updateData.assigned_processes = updates.assignedProcesses;
    delete updateData.assignedProcesses;
  }

  const { data, error } = await supabase
    .from('equipment')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating equipment:', error);
    throw error;
  }

  return {
    ...data,
    serialNumber: data.serial_number,
    lastMaintenanceDate: new Date(data.last_maintenance_date),
    nextMaintenanceDate: new Date(data.next_maintenance_date),
    operatingHours: data.operating_hours,
    assignedProcesses: data.assigned_processes,
  };
}

// 設備の削除
export async function deleteEquipment(id: string): Promise<void> {
  const { error } = await supabase
    .from('equipment')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting equipment:', error);
    throw error;
  }
}
