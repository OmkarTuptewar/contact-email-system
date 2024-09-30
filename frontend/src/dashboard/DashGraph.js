import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const DashGraph = ({ contactsPerYear }) => {
  // Prepare data for the chart
  const labels = Object.keys(contactsPerYear);
  const springData = labels.map(year => contactsPerYear[year].spring);
  const fallData = labels.map(year => contactsPerYear[year].fall);

  const data = {
    labels,
    datasets: [
      {
        label: 'Spring Contacts',
        data: springData,
        backgroundColor: 'rgba(0, 255, 0, 0.6)', // Bright green for Spring
      },
      {
        label: 'Fall Contacts',
        data: fallData,
        backgroundColor: 'rgba(255, 0, 0, 0.6)', // Bright red for Fall
      },
    ],
  };
  

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 -mt-[427px]  h-[405px]">
  <h2 className="text-xl font-semibold">Total Contacts : Spring and Fall</h2>
  <Bar data={data} options={options} />
</div>

  );
};

export default DashGraph;
