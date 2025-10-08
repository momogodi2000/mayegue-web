import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { progressService } from '../services/progress.service';
import type { ProgressAnalytics } from '../types/progress.types';

interface ProgressChartProps {
  userId: string;
  timeframe: 'week' | 'month' | 'year';
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ userId, timeframe }) => {
  const [analytics, setAnalytics] = useState<ProgressAnalytics | null>(null);
  const [chartType, setChartType] = useState<'xp' | 'time' | 'performance' | 'distribution'>('xp');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [userId, timeframe]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await progressService.getProgressAnalytics(userId, timeframe);
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration
  const mockXpData = [
    { date: '2024-01-01', xp: 100, level: 1 },
    { date: '2024-01-02', xp: 250, level: 1 },
    { date: '2024-01-03', xp: 400, level: 1 },
    { date: '2024-01-04', xp: 650, level: 1 },
    { date: '2024-01-05', xp: 850, level: 1 },
    { date: '2024-01-06', xp: 1100, level: 2 },
    { date: '2024-01-07', xp: 1350, level: 2 },
  ];

  const mockTimeData = [
    { day: 'Lun', studyTime: 45, target: 60 },
    { day: 'Mar', studyTime: 30, target: 60 },
    { day: 'Mer', studyTime: 75, target: 60 },
    { day: 'Jeu', studyTime: 60, target: 60 },
    { day: 'Ven', studyTime: 90, target: 60 },
    { day: 'Sam', studyTime: 120, target: 60 },
    { day: 'Dim', studyTime: 80, target: 60 },
  ];

  const mockPerformanceData = [
    { category: 'Vocabulaire', score: 85, lessons: 12 },
    { category: 'Grammaire', score: 78, lessons: 8 },
    { category: 'Prononciation', score: 92, lessons: 6 },
    { category: 'Écoute', score: 74, lessons: 10 },
    { category: 'Expression', score: 88, lessons: 7 },
  ];

  const mockDistributionData = [
    { name: 'Matin', value: 25, color: '#3B82F6' },
    { name: 'Après-midi', value: 35, color: '#10B981' },
    { name: 'Soir', value: 30, color: '#F59E0B' },
    { name: 'Nuit', value: 10, color: '#8B5CF6' },
  ];

  const formatXAxisLabel = (tickItem: string) => {
    if (timeframe === 'week') {
      return new Date(tickItem).toLocaleDateString('fr-FR', { weekday: 'short' });
    } else if (timeframe === 'month') {
      return new Date(tickItem).toLocaleDateString('fr-FR', { day: 'numeric' });
    } else {
      return new Date(tickItem).toLocaleDateString('fr-FR', { month: 'short' });
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.dataKey === 'studyTime' && ' min'}
              {entry.dataKey === 'xp' && ' XP'}
              {entry.dataKey === 'score' && '%'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Chart Type Selector */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setChartType('xp')}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            chartType === 'xp'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
          }`}
        >
          Progression XP
        </button>
        <button
          onClick={() => setChartType('time')}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            chartType === 'time'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
          }`}
        >
          Temps d'étude
        </button>
        <button
          onClick={() => setChartType('performance')}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            chartType === 'performance'
              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
          }`}
        >
          Performance
        </button>
        <button
          onClick={() => setChartType('distribution')}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            chartType === 'distribution'
              ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
          }`}
        >
          Répartition
        </button>
      </div>

      {/* Chart Container */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'xp' ? (
            <LineChart data={mockXpData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxisLabel}
                className="text-xs"
              />
              <YAxis className="text-xs" />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="xp"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
              />
            </LineChart>
          ) : chartType === 'time' ? (
            <BarChart data={mockTimeData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="day" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="studyTime" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" fill="#E5E7EB" radius={[4, 4, 0, 0]} opacity={0.3} />
            </BarChart>
          ) : chartType === 'performance' ? (
            <BarChart data={mockPerformanceData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis type="number" domain={[0, 100]} className="text-xs" />
              <YAxis dataKey="category" type="category" width={80} className="text-xs" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="score" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={mockDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {mockDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value}%`, 'Pourcentage']}
                labelFormatter={(label: string) => `Période: ${label}`}
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Chart Legend for Distribution */}
      {chartType === 'distribution' && (
        <div className="flex justify-center space-x-4">
          {mockDistributionData.map((entry, index) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {entry.name} ({entry.value}%)
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Analytics Summary */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {Math.round(analytics.learningVelocity.daily)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">XP/jour moyen</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {Math.round(analytics.retentionRate * 100)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Taux de rétention</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {Math.round(analytics.engagementScore)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Score d'engagement</div>
          </div>
        </div>
      )}
    </div>
  );
};
