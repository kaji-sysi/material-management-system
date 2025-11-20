'use client';

import { mockEquipment } from '@/lib/mockData';
import { Wrench, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { differenceInDays } from 'date-fns';

export default function EquipmentPage() {
  const statusCounts = {
    operational: mockEquipment.filter(e => e.status === '稼働中').length,
    stopped: mockEquipment.filter(e => e.status === '停止中').length,
    maintenance: mockEquipment.filter(e => e.status === 'メンテナンス').length,
    broken: mockEquipment.filter(e => e.status === '故障').length,
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">設備管理</h1>
        <p className="text-gray-600 mt-2">機械・設備の稼働状況とメンテナンス管理</p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="text-green-600" size={24} />
          </div>
          <p className="text-sm text-gray-600">稼働中</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{statusCounts.operational}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Wrench className="text-yellow-600" size={24} />
          </div>
          <p className="text-sm text-gray-600">メンテナンス中</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{statusCounts.maintenance}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="text-red-600" size={24} />
          </div>
          <p className="text-sm text-gray-600">故障</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{statusCounts.broken}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="text-gray-600" size={24} />
          </div>
          <p className="text-sm text-gray-600">停止中</p>
          <p className="text-3xl font-bold text-gray-600 mt-2">{statusCounts.stopped}</p>
        </div>
      </div>

      {/* 設備一覧 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockEquipment.map((equipment) => {
          const daysUntilMaintenance = differenceInDays(
            new Date(equipment.nextMaintenanceDate),
            new Date()
          );
          const isMaintenanceSoon = daysUntilMaintenance <= 7;

          return (
            <div
              key={equipment.id}
              className={`bg-white rounded-lg shadow p-6 border ${
                equipment.status === '故障'
                  ? 'border-red-300'
                  : isMaintenanceSoon
                  ? 'border-yellow-300'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{equipment.name}</h3>
                  <p className="text-sm text-gray-500">{equipment.type} • {equipment.model}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    equipment.status === '稼働中'
                      ? 'bg-green-100 text-green-800'
                      : equipment.status === 'メンテナンス'
                      ? 'bg-yellow-100 text-yellow-800'
                      : equipment.status === '故障'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {equipment.status}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">シリアル番号</span>
                  <span className="text-gray-900 font-medium">{equipment.serialNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">設置場所</span>
                  <span className="text-gray-900">{equipment.location}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">稼働時間</span>
                  <span className="text-gray-900">{equipment.operatingHours.toLocaleString()} h</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">前回メンテナンス</span>
                    <span className="text-gray-900">
                      {new Date(equipment.lastMaintenanceDate).toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">次回メンテナンス</span>
                    <span className={isMaintenanceSoon ? 'text-yellow-600 font-semibold' : 'text-gray-900'}>
                      {new Date(equipment.nextMaintenanceDate).toLocaleDateString('ja-JP')}
                      {isMaintenanceSoon && ` (${daysUntilMaintenance}日後)`}
                    </span>
                  </div>
                </div>

                {isMaintenanceSoon && (
                  <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded flex items-center gap-2">
                    <AlertCircle className="text-yellow-600" size={16} />
                    <span className="text-xs text-yellow-800">メンテナンスが近づいています</span>
                  </div>
                )}

                {equipment.status === '故障' && (
                  <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded flex items-center gap-2">
                    <AlertCircle className="text-red-600" size={16} />
                    <span className="text-xs text-red-800">緊急対応が必要です</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                  詳細
                </button>
                <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                  メンテナンス記録
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
