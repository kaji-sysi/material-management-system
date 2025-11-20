import { supabase } from '@/lib/supabase';
import type { InventoryItem } from '@/types';

// 在庫アイテムの全件取得
export async function getInventoryItems(): Promise<InventoryItem[]> {
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching inventory items:', error);
    throw error;
  }

  return data.map(item => ({
    ...item,
    minStock: item.min_stock,
    maxStock: item.max_stock,
    unitPrice: item.unit_price,
    lastUpdated: new Date(item.last_updated),
  }));
}

// 在庫アイテムの単一取得
export async function getInventoryItem(id: string): Promise<InventoryItem | null> {
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching inventory item:', error);
    throw error;
  }

  if (!data) return null;

  return {
    ...data,
    minStock: data.min_stock,
    maxStock: data.max_stock,
    unitPrice: data.unit_price,
    lastUpdated: new Date(data.last_updated),
  };
}

// 在庫アイテムの作成
export async function createInventoryItem(item: Omit<InventoryItem, 'id' | 'lastUpdated'>): Promise<InventoryItem> {
  const { data, error } = await supabase
    .from('inventory_items')
    .insert({
      id: `INV${Date.now()}`,
      name: item.name,
      sku: item.sku,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      min_stock: item.minStock,
      max_stock: item.maxStock,
      location: item.location,
      supplier: item.supplier,
      unit_price: item.unitPrice,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating inventory item:', error);
    throw error;
  }

  return {
    ...data,
    minStock: data.min_stock,
    maxStock: data.max_stock,
    unitPrice: data.unit_price,
    lastUpdated: new Date(data.last_updated),
  };
}

// 在庫アイテムの更新
export async function updateInventoryItem(id: string, updates: Partial<InventoryItem>): Promise<InventoryItem> {
  const updateData: any = { ...updates };

  if (updates.minStock !== undefined) {
    updateData.min_stock = updates.minStock;
    delete updateData.minStock;
  }

  if (updates.maxStock !== undefined) {
    updateData.max_stock = updates.maxStock;
    delete updateData.maxStock;
  }

  if (updates.unitPrice !== undefined) {
    updateData.unit_price = updates.unitPrice;
    delete updateData.unitPrice;
  }

  delete updateData.lastUpdated;

  const { data, error } = await supabase
    .from('inventory_items')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating inventory item:', error);
    throw error;
  }

  return {
    ...data,
    minStock: data.min_stock,
    maxStock: data.max_stock,
    unitPrice: data.unit_price,
    lastUpdated: new Date(data.last_updated),
  };
}

// 在庫アイテムの削除
export async function deleteInventoryItem(id: string): Promise<void> {
  const { error } = await supabase
    .from('inventory_items')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting inventory item:', error);
    throw error;
  }
}
