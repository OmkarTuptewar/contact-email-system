import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const LineGraph = ({ contactsPerYear, uniquecontactsPerYear }) => {
  // Extract years from the data
  const labels = Object.keys(contactsPerYear);

  // Calculate the total contacts per year by summing spring and fall contacts
  const contactTotals = labels.map(year => {
    const spring = contactsPerYear[year]?.spring || 0;
    const fall = contactsPerYear[year]?.fall || 0;
    return spring + fall;
  });

  // **DEBUG**: Log the unique contacts per year data to check the structure
  console.log('Unique Contacts Data:', uniquecontactsPerYear);

  // Calculate the unique contacts per year by summing spring and fall unique contacts
  const uniqueContactTotals = labels.map(year => {
    const springUnique = uniquecontactsPerYear[year]?.spring?.totalUnique || 0; // Handle undefined spring totalUnique
    const fallUnique = uniquecontactsPerYear[year]?.fall?.totalUnique || 0;     // Handle undefined fall totalUnique
    return springUnique + fallUnique;                                           // Sum of spring and fall unique contacts
  });

  // **DEBUG**: Log the uniqueContactTotals to check if the values are being calculated correctly
  console.log('Unique Contact Totals:', uniqueContactTotals);

  // Define chart data
  const data = {
    labels, // X-axis labels (years)
    datasets: [
      {
        label: 'Total Contacts per Year',
        data: contactTotals, // Y-axis data (sum of spring and fall contacts per year)
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        tension: 0.3, // Adds curve to the line
      },
      {
        label: 'Unique Contacts per Year',
        data: uniqueContactTotals, // Y-axis data for unique contacts per year
        fill: false,
        backgroundColor: 'rgba(255, 99, 132, 0.6)', // Different color for the unique contacts line
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        tension: 0.3, // Adds curve to the line
      }
    ],
  };

  // Define chart options (customizable)
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top', // Position of the legend
      },
      tooltip: {
        enabled: true, // Enable tooltips
      },
    },
    scales: {
      y: {
        beginAtZero: true, // Ensure the y-axis starts at zero
      },
    },
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 h-[416px] ">
    <h2 className="text-xl font-semibold"> Total Contacts Vs Unique Contacts </h2>
    <Line data={data} options={options} />
  </div>
  );
};

export default LineGraph;
