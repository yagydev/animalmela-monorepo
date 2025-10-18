'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MelaDashboard: React.FC = () => {
  const { t } = useTranslation();

  const monthlyVisitsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: t('monthly_visits'),
        data: [150, 200, 300, 280, 350, 400],
        borderColor: '#2e7d32',
        backgroundColor: 'rgba(46, 125, 50, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const trainingData = {
    labels: ['Crop Management', 'Livestock Care', 'Organic Farming', 'Market Access', 'Technology'],
    datasets: [
      {
        label: t('training_registrations'),
        data: [120, 85, 200, 150, 90],
        backgroundColor: [
          '#2e7d32',
          '#4caf50',
          '#66bb6a',
          '#81c784',
          '#a5d6a7',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: t('dashboard'),
      },
    },
  };

  const stats = [
    { label: t('total_farmers'), value: '2,847', color: 'bg-green-500' },
    { label: t('active_events'), value: '12', color: 'bg-blue-500' },
    { label: t('completed_events'), value: '48', color: 'bg-purple-500' },
    { label: t('monthly_visits'), value: '1,250', color: 'bg-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard')}</h1>
          <p className="text-gray-600 mt-2">Kisaanmela Analytics & Insights</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Visits Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('monthly_visits')}</h3>
            <div className="h-64">
              <Line data={monthlyVisitsData} options={chartOptions} />
            </div>
          </div>

          {/* Training Registrations Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('training_registrations')}</h3>
            <div className="h-64">
              <Bar data={trainingData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Recent Events */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Organic Farming Workshop', date: '2024-01-15', participants: 45 },
              { title: 'Livestock Health Seminar', date: '2024-01-20', participants: 32 },
              { title: 'Market Access Training', date: '2024-01-25', participants: 28 },
            ].map((event, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-medium text-gray-900">{event.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{event.date}</p>
                <p className="text-sm text-green-600 mt-1">{event.participants} participants</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MelaDashboard;
