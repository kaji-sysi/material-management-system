import { supabase } from '@/lib/supabase';
import type { QualityCheck } from '@/types';

// 品質検査の全件取得
export async function getQualityChecks(): Promise<QualityCheck[]> {
  const { data, error } = await supabase
    .from('quality_checks')
    .select('*')
    .order('check_date', { ascending: false });

  if (error) {
    console.error('Error fetching quality checks:', error);
    throw error;
  }

  return data.map(item => ({
    ...item,
    processId: item.process_id,
    inspectorId: item.inspector_id,
    checkDate: new Date(item.check_date),
    defectCount: item.defect_count,
    samplesChecked: item.samples_checked,
  }));
}

// 品質検査の単一取得
export async function getQualityCheck(id: string): Promise<QualityCheck | null> {
  const { data, error } = await supabase
    .from('quality_checks')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching quality check:', error);
    throw error;
  }

  if (!data) return null;

  return {
    ...data,
    processId: data.process_id,
    inspectorId: data.inspector_id,
    checkDate: new Date(data.check_date),
    defectCount: data.defect_count,
    samplesChecked: data.samples_checked,
  };
}

// 品質検査の作成
export async function createQualityCheck(check: Omit<QualityCheck, 'id'>): Promise<QualityCheck> {
  const { data, error } = await supabase
    .from('quality_checks')
    .insert({
      id: `QC${Date.now()}`,
      process_id: check.processId,
      inspector_id: check.inspectorId,
      check_date: check.checkDate.toISOString(),
      status: check.status,
      defect_count: check.defectCount,
      samples_checked: check.samplesChecked,
      notes: check.notes,
      criteria: check.criteria,
      images: check.images,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating quality check:', error);
    throw error;
  }

  return {
    ...data,
    processId: data.process_id,
    inspectorId: data.inspector_id,
    checkDate: new Date(data.check_date),
    defectCount: data.defect_count,
    samplesChecked: data.samples_checked,
  };
}

// 品質検査の更新
export async function updateQualityCheck(id: string, updates: Partial<QualityCheck>): Promise<QualityCheck> {
  const updateData: any = { ...updates };

  if (updates.processId) {
    updateData.process_id = updates.processId;
    delete updateData.processId;
  }

  if (updates.inspectorId) {
    updateData.inspector_id = updates.inspectorId;
    delete updateData.inspectorId;
  }

  if (updates.checkDate) {
    updateData.check_date = updates.checkDate.toISOString();
    delete updateData.checkDate;
  }

  if (updates.defectCount !== undefined) {
    updateData.defect_count = updates.defectCount;
    delete updateData.defectCount;
  }

  if (updates.samplesChecked !== undefined) {
    updateData.samples_checked = updates.samplesChecked;
    delete updateData.samplesChecked;
  }

  const { data, error } = await supabase
    .from('quality_checks')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating quality check:', error);
    throw error;
  }

  return {
    ...data,
    processId: data.process_id,
    inspectorId: data.inspector_id,
    checkDate: new Date(data.check_date),
    defectCount: data.defect_count,
    samplesChecked: data.samples_checked,
  };
}

// 品質検査の削除
export async function deleteQualityCheck(id: string): Promise<void> {
  const { error } = await supabase
    .from('quality_checks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting quality check:', error);
    throw error;
  }
}
