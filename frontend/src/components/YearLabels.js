// YearLabels.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const YearLabels = () => {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/contacts/season'); // Adjust the endpoint based on your API
        setYears(response.data); // Assuming response.data contains an array of years
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchYears();
  }, []);

  if (loading) return <p>Loading years...</p>;
  if (error) return <p>Error fetching years: {error}</p>;

  return (
    <div className="mt-4 max-h-[60vh] overflow-y-auto overflow-x-hidden scrollable">
      <h3 className="font-bold text-lg" aria-live="polite"> Year and season:</h3>
      <ul role="list" className="list-disc ml-5">
        {years.map((year) => (
          <li 
            key={year} // Use a unique identifier if available
            className="cursor-pointer mb-2 p-3 border border-gray-300 rounded-lg 
            transition duration-300 ease-in-out transform hover:bg-blue-200 hover:shadow-xl hover:scale-105
            active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            role="button"
            tabIndex={0} // Make it focusable
            onKeyDown={(e) => { if (e.key === 'Enter') console.log(`Selected year: ${year}`); }} // Example action
          >
            {year}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default YearLabels;
 