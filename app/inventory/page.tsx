'use client';

import { mockInventory } from '@/lib/mockData';
import { Plus, AlertTriangle, TrendingUp, Package } from 'lucide-react';

export default function InventoryPage() {
  const lowStockItems = mockInventory.filter(item => item.quantity <= item.minStock);
  const totalValue = mockInventory.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">在庫管理</h1>
        <p className="text-gray-600 mt-2">原材料・部品・消耗品の在庫状況</p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Package className="text-blue-600" size={24} />
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <p className="text-sm text-gray-600">総在庫アイテム</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{mockInventory.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="text-red-600" size={24} />
          </div>
          <p className="text-sm text-gray-600">在庫不足アイテム</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{lowStockItems.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">¥</span>
          </div>
          <p className="text-sm text-gray-600">総在庫金額</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            ¥{totalValue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* アクションバー */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              全て
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              原材料
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              部品
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              消耗品
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={18} />
            <span>新規アイテム</span>
          </button>
        </div>
      </div>

      {/* 在庫一覧テーブル */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  品名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  カテゴリ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  現在庫
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  在庫状況
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  保管場所
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  仕入先
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  単価
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockInventory.map((item) => {
                const stockPercentage = (item.quantity / item.maxStock) * 100;
                const isLowStock = item.quantity <= item.minStock;

                return (
                  <tr key={item.id} className={`hover:bg-gray-50 ${isLowStock ? 'bg-red-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              isLowStock ? 'bg-red-500' : stockPercentage > 50 ? 'bg-green-500' : 'bg-yellow-500'
                            }`}
                            style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                          ></div>
                        </div>
                        {isLowStock && (
                          <AlertTriangle className="text-red-500" size={16} />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.supplier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ¥{item.unitPrice.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
