'use client';

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Settings,
  Package,
  AlertTriangle,
} from 'lucide-react';
import { mockDashboardStats, mockReportData, mockProcesses } from '@/lib/mockData';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  const stats = mockDashboardStats;

  // 工程ステータスのデータ
  const processStatusData = [
    { name: '進行中', value: stats.activeProcesses },
    { name: '完了', value: stats.completedProcesses },
    { name: '遅延', value: stats.delayedProcesses },
    { name: '未着手', value: stats.totalProcesses - stats.activeProcesses - stats.completedProcesses - stats.delayedProcesses },
  ];

  // 統計カード
  const statCards = [
    {
      title: '稼働中の工程',
      value: stats.activeProcesses,
      total: stats.totalProcesses,
      icon: Settings,
      color: 'blue',
      change: '+2',
    },
    {
      title: '利用可能な作業者',
      value: stats.availableWorkers,
      total: stats.totalWorkers,
      icon: Users,
      color: 'green',
      change: '-1',
    },
    {
      title: '設備稼働率',
      value: `${stats.equipmentUtilization}%`,
      total: '100%',
      icon: Package,
      color: 'yellow',
      change: '+3.2%',
    },
    {
      title: '遅延工程',
      value: stats.delayedProcesses,
      total: stats.totalProcesses,
      icon: AlertTriangle,
      color: 'red',
      change: '+1',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="text-gray-600 mt-2">製造工程の全体状況を確認</p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          const isNegative = card.change.startsWith('-') && card.color === 'red';

          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-lg ${
                    card.color === 'blue'
                      ? 'bg-blue-100'
                      : card.color === 'green'
                      ? 'bg-green-100'
                      : card.color === 'yellow'
                      ? 'bg-yellow-100'
                      : 'bg-red-100'
                  }`}
                >
                  <Icon
                    className={`${
                      card.color === 'blue'
                        ? 'text-blue-600'
                        : card.color === 'green'
                        ? 'text-green-600'
                        : card.color === 'yellow'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                    size={24}
                  />
                </div>
                <div className="flex items-center text-sm">
                  {isNegative ? (
                    <TrendingDown className="text-red-500 mr-1" size={16} />
                  ) : (
                    <TrendingUp className="text-green-500 mr-1" size={16} />
                  )}
                  <span
                    className={isNegative ? 'text-red-500' : 'text-green-500'}
                  >
                    {card.change}
                  </span>
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium">{card.title}</h3>
              <div className="mt-2 flex items-baseline">
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                <p className="ml-2 text-sm text-gray-500">/ {card.total}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* チャートセクション */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 月次生産効率 */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">月次生産効率</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockReportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="efficiency"
                stroke="#3b82f6"
                strokeWidth={2}
                name="生産効率 (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 工程ステータス */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">工程ステータス</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={processStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {processStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 月次生産量 */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">月次生産量</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockReportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="productionVolume" fill="#10b981" name="生産量" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 不良率推移 */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">不良率推移</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockReportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="defectRate"
                stroke="#ef4444"
                strokeWidth={2}
                name="不良率 (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 進行中の工程 */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">進行中の工程</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  工程名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  進捗
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  優先度
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  終了予定
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockProcesses.filter(p => p.status === '進行中' || p.status === '遅延').map((process) => (
                <tr key={process.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {process.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        process.status === '進行中'
                          ? 'bg-blue-100 text-blue-800'
                          : process.status === '遅延'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {process.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${process.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-700">
                        {process.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        process.priority === '緊急'
                          ? 'bg-red-100 text-red-800'
                          : process.priority === '高'
                          ? 'bg-orange-100 text-orange-800'
                          : process.priority === '中'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {process.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(process.endDate).toLocaleDateString('ja-JP')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
