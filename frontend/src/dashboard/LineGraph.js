import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const LineGraph = ({ contactsPerYear, uniquecontactsPerYear }) => {
  const labels = Object.keys(contactsPerYear);

  const contactTotals = labels.map(year => {
    const spring = contactsPerYear[year]?.spring || 0;
    const fall = contactsPerYear[year]?.fall || 0;
    return spring + fall;
  });

  const uniqueContactTotals = labels.map(year => {
    
    const totalUniquePerYearr = uniquecontactsPerYear[year]?.totalUniquePerYear || 0;
    return totalUniquePerYearr ;
    
  });
  

  const data = {
    labels,
    datasets: [
      {
        label: 'Total Contacts per Year',
        data: contactTotals,
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        tension: 0.3,
      },
      {
        label: 'Unique Contacts per Year',
        data: uniqueContactTotals,
        fill: false,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className={`bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 h-[416px]`}>
       <p className="text-xl font-semibold text-gray-900 dark:text-gray-200">
        Total Contacts Vs Unique Contacts
      </p>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineGraph;
