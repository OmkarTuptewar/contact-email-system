// UniqueContactGraph.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import LineGraph from './LineGraph';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UniqueContactGraph = ({ contactsPerYear }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/dashboard/handlecontacts`);
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error}</div>;
  }

  const years = Object.keys(data.categorizedData);
  const springUniqueCounts = years.map(year => data.categorizedData[year].spring.totalUnique);
  const fallUniqueCounts = years.map(year => data.categorizedData[year].fall.totalUnique);

  const chartData = {
    labels: years,
    datasets: [
      {
        label: 'Unique Contacts (Spring)',
        data: springUniqueCounts,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Unique Contacts (Fall)',
        data: fallUniqueCounts,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Unique Contacts per Year',
      },
    },
  };

  return (
    <div>
      <LineGraph
        contactsPerYear={contactsPerYear}
        uniquecontactsPerYear={data.categorizedData}
      />

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mt-10">
        <p className="text-xl font-semibold text-gray-900 dark:text-gray-200">
          Total Unique Contacts: {data.totalUniqueContacts}
        </p>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default UniqueContactGraph;
