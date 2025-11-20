'use client';

import { mockQualityChecks, mockProcesses, mockWorkers } from '@/lib/mockData';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { CheckCircle, XCircle, AlertCircle, TrendingDown } from 'lucide-react';

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6'];

export default function QualityPage() {
  const qualityStats = {
    total: mockQualityChecks.length,
    passed: mockQualityChecks.filter(q => q.status === '合格').length,
    failed: mockQualityChecks.filter(q => q.status === '不合格').length,
    needsReview: mockQualityChecks.filter(q => q.status === '要確認').length,
    retest: mockQualityChecks.filter(q => q.status === '再検査').length,
  };

  const statusData = [
    { name: '合格', value: qualityStats.passed },
    { name: '不合格', value: qualityStats.failed },
    { name: '要確認', value: qualityStats.needsReview },
    { name: '再検査', value: qualityStats.retest },
  ];

  const passRate = ((qualityStats.passed / qualityStats.total) * 100).toFixed(1);
  const defectRate = (((qualityStats.failed + qualityStats.needsReview) / qualityStats.total) * 100).toFixed(1);

  const getProcessName = (processId: string) => {
    return mockProcesses.find(p => p.id === processId)?.name || processId;
  };

  const getInspectorName = (inspectorId: string) => {
    return mockWorkers.find(w => w.id === inspectorId)?.name || inspectorId;
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">品質管理</h1>
        <p className="text-gray-600 mt-2">品質検査結果と不良分析</p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="text-green-600" size={24} />
          </div>
          <p className="text-sm text-gray-600">合格率</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{passRate}%</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="text-red-600" size={24} />
          </div>
          <p className="text-sm text-gray-600">不良率</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{defectRate}%</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="text-yellow-600" size={24} />
          </div>
          <p className="text-sm text-gray-600">要確認</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{qualityStats.needsReview}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="text-blue-600" size={24} />
          </div>
          <p className="text-sm text-gray-600">総検査数</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{qualityStats.total}</p>
        </div>
      </div>

      {/* グラフ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">検査結果分布</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">工程別検査状況</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" name="件数" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 品質検査一覧 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">品質検査一覧</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  工程
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  検査日
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  検査員
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  サンプル数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  不良数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  不良率
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  備考
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockQualityChecks.map((check) => {
                const defectRate = ((check.defectCount / check.samplesChecked) * 100).toFixed(1);

                return (
                  <tr key={check.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {getProcessName(check.processId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(check.checkDate).toLocaleDateString('ja-JP')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getInspectorName(check.inspectorId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          check.status === '合格'
                            ? 'bg-green-100 text-green-800'
                            : check.status === '不合格'
                            ? 'bg-red-100 text-red-800'
                            : check.status === '要確認'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {check.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {check.samplesChecked}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {check.defectCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-semibold ${
                        parseFloat(defectRate) > 5 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {defectRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {check.notes}
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
