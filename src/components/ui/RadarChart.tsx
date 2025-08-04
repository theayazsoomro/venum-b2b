// components/ProductRadarChart.tsx
'use client';

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

import { Radar } from 'react-chartjs-2';

// Register necessary components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// Radar chart data
const data = {
  labels: ['Durability', 'Warranty', 'Bulk Price', 'Popularity', 'Maintenance'],
  datasets: [
    {
      label: 'Product A (Basic Treadmill)',
      data: [6, 3, 8, 7, 4],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      pointBackgroundColor: 'rgba(255, 99, 132, 1)',
    },
    {
      label: 'Product B (Commercial Treadmill)',
      data: [9, 5, 6, 9, 8],
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      pointBackgroundColor: 'rgba(54, 162, 235, 1)',
    },
  ],
};

// Component
export default function ProductRadarChart() {
  return <div className="container my-8">
    <div className="charts max-w-4xl mx-auto p-6">
        <Radar data={data} />
    </div>
  </div>;
}
