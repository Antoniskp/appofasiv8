'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function PollResults({ results, poll }) {
  if (!results || !results.optionStats) {
    return (
      <div className="text-center py-8 text-blue-900">
        Δεν υπάρχουν διαθέσιμα αποτελέσματα
      </div>
    );
  }

  const { totalVotes, authenticatedVotes, unauthenticatedVotes, optionStats, freeTextResponses } = results;

  // Prepare data for charts
  const labels = optionStats.map(stat => stat.text);
  const data = optionStats.map(stat => stat.totalVotes);
  const authData = optionStats.map(stat => stat.authenticatedVotes);
  const unauthData = optionStats.map(stat => stat.unauthenticatedVotes);

  // Color palette
  const backgroundColors = [
    'rgba(59, 130, 246, 0.7)',   // blue
    'rgba(16, 185, 129, 0.7)',   // green
    'rgba(245, 158, 11, 0.7)',   // amber
    'rgba(239, 68, 68, 0.7)',    // red
    'rgba(139, 92, 246, 0.7)',   // purple
    'rgba(236, 72, 153, 0.7)',   // pink
    'rgba(20, 184, 166, 0.7)',   // teal
    'rgba(251, 146, 60, 0.7)',   // orange
  ];

  const borderColors = backgroundColors.map(color => color.replace('0.7', '1'));

  // Bar chart data
  const barChartData = {
    labels,
    datasets: [
      {
        label: 'Συνδεδεμένοι Χρήστες',
        data: authData,
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: 'Μη Συνδεδεμένοι',
        data: unauthData,
        backgroundColor: 'rgba(156, 163, 175, 0.7)',
        borderColor: 'rgba(156, 163, 175, 1)',
        borderWidth: 1,
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Κατανομή Ψήφων ανά Επιλογή'
      },
      tooltip: {
        callbacks: {
          afterLabel: function(context) {
            const index = context.dataIndex;
            const percentage = optionStats[index].percentage;
            return `${percentage}% του συνόλου`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  // Pie chart data
  const pieChartData = {
    labels,
    datasets: [
      {
        label: 'Ψήφοι',
        data,
        backgroundColor: backgroundColors.slice(0, optionStats.length),
        borderColor: borderColors.slice(0, optionStats.length),
        borderWidth: 1,
      }
    ]
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Κατανομή Ψήφων'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const percentage = optionStats[context.dataIndex].percentage;
            return `${label}: ${value} ψήφοι (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">Συνολικά Αποτελέσματα</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-blue-700 font-medium">Σύνολο Ψήφων</div>
            <div className="text-3xl font-bold text-blue-900 mt-1">{totalVotes}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm text-green-700 font-medium">Συνδεδεμένοι</div>
            <div className="text-3xl font-bold text-green-900 mt-1">{authenticatedVotes}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-700 font-medium">Μη Συνδεδεμένοι</div>
            <div className="text-3xl font-bold text-gray-900 mt-1">{unauthenticatedVotes}</div>
          </div>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">Αναλυτικά Αποτελέσματα</h2>
        <div className="space-y-3">
          {optionStats.map((stat, index) => (
            <div key={stat.optionId} className="border border-seafoam rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-medium text-blue-900">{stat.text}</h3>
                  {stat.linkUrl && (
                    <a
                      href={stat.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Δείτε περισσότερα →
                    </a>
                  )}
                </div>
                {stat.photoUrl && (
                  <img
                    src={stat.photoUrl}
                    alt={stat.text}
                    className="h-16 w-16 object-cover rounded ml-4"
                  />
                )}
              </div>
              <div className="mt-2">
                <div className="flex items-center justify-between text-sm text-blue-900 mb-1">
                  <span>{stat.totalVotes} ψήφοι</span>
                  <span className="font-semibold">{stat.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${stat.percentage}%`,
                      backgroundColor: backgroundColors[index % backgroundColors.length]
                    }}
                  />
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                  <span>Συνδεδεμένοι: {stat.authenticatedVotes}</span>
                  <span>Μη συνδεδεμένοι: {stat.unauthenticatedVotes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="h-80">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="h-80">
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>
      </div>

      {/* Free Text Responses */}
      {freeTextResponses && freeTextResponses.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">
            Ελεύθερες Απαντήσεις ({freeTextResponses.length})
          </h2>
          <div className="space-y-3">
            {freeTextResponses.map((response, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="text-blue-900">{response.response}</p>
                <div className="text-xs text-gray-600 mt-1">
                  {response.isAuthenticated ? 'Συνδεδεμένος χρήστης' : 'Ανώνυμος'} •{' '}
                  {new Date(response.createdAt).toLocaleDateString('el-GR')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
