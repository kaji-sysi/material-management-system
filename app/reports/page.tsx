'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { mockReportData } from '@/lib/mockData';
import { Download, Filter, TrendingUp, TrendingDown } from 'lucide-react';

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  const latestData = mockReportData[0];
  const previousData = mockReportData[1];

  const metrics = [
    {
      name: '生産効率',
      current: latestData.efficiency,
      previous: previousData.efficiency,
      unit: '%',
      trend: latestData.efficiency > previousData.efficiency ? 'up' : 'down',
    },
    {
      name: '不良率',
      current: latestData.defectRate,
      previous: previousData.defectRate,
      unit: '%',
      trend: latestData.defectRate < previousData.defectRate ? 'up' : 'down',
      inverse: true,
    },
    {
      name: '生産量',
      current: latestData.productionVolume,
      previous: previousData.productionVolume,
      unit: '個',
      trend: latestData.productionVolume > previousData.productionVolume ? 'up' : 'down',
    },
    {
      name: '設備停止時間',
      current: latestData.equipmentDowntime,
      previous: previousData.equipmentDowntime,
      unit: '時間',
      trend: latestData.equipmentDowntime < previousData.equipmentDowntime ? 'up' : 'down',
      inverse: true,
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">レポート</h1>
        <p className="text-gray-600 mt-2">生産実績と分析レポート</p>
      </div>

      {/* フィルターとエクスポート */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Filter size={20} className="text-gray-600" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1month">直近1ヶ月</option>
              <option value="3months">直近3ヶ月</option>
              <option value="6months">直近6ヶ月</option>
              <option value="1year">直近1年</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download size={18} />
            <span>レポート出力</span>
          </button>
        </div>
      </div>

      {/* KPI メトリクス */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => {
          const change = metric.current - metric.previous;
          const changePercent = ((change / metric.previous) * 100).toFixed(1);
          const isPositive = metric.inverse ? change < 0 : change > 0;

          return (
            <div key={index} className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">{metric.name}</h3>
                {isPositive ? (
                  <TrendingUp className="text-green-500" size={20} />
                ) : (
                  <TrendingDown className="text-red-500" size={20} />
                )}
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {metric.current}
                <span className="text-lg text-gray-500 ml-1">{metric.unit}</span>
              </p>
              <p className={`text-sm mt-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {change > 0 ? '+' : ''}
                {change.toFixed(1)} ({changePercent}%)
                <span className="text-gray-500 ml-1">前月比</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* チャートグリッド */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 生産効率推移 */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">生産効率推移</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mockReportData}>
              <defs>
                <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="efficiency"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorEfficiency)"
                name="生産効率 (%)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 生産量と不良率 */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">生産量と不良率</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockReportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="productionVolume"
                stroke="#10b981"
                strokeWidth={2}
                name="生産量"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="defectRate"
                stroke="#ef4444"
                strokeWidth={2}
                name="不良率 (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 設備稼働時間 */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">労働時間推移</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockReportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="laborHours" fill="#8b5cf6" name="労働時間 (h)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 設備停止時間 */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">設備停止時間</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockReportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="equipmentDowntime" fill="#f59e0b" name="停止時間 (h)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* サマリーテーブル */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">月次実績サマリー</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  期間
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  完了工程数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  生産量
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  不良率
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  設備停止時間
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  労働時間
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  生産効率
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockReportData.map((data, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {data.period}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {data.processesCompleted}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {data.productionVolume.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-semibold ${
                      data.defectRate > 3 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {data.defectRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {data.equipmentDowntime}h
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {data.laborHours.toLocaleString()}h
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-semibold ${
                      data.efficiency > 85 ? 'text-green-600' : data.efficiency > 80 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {data.efficiency}%
                    </span>
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
