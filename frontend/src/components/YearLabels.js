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
        setYears(response.data); // Assuming response.data contains an array of years and seasons
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
    <div className="relative">
      {/* Fixed Heading */}
      <div className="sticky top-0 bg-white z-10">
        <h3 className="font-bold text-lg py-2" aria-live="polite">
          Year and Season:
        </h3>
      </div>

      {/* Scrollable Content */}
      <div className="mt-2 max-h-[45vh] overflow-y-auto overflow-x-hidden">
        <ul role="list" className="list-disc ml-5">
          {years.map((year) => {
            // Determine background color based on season (e.g., Spring -> green, Fall -> red)
            const isSpring = year.toLowerCase().includes('spring');
            const isFall = year.toLowerCase().includes('fall');
            
            const bgColorClass = isSpring 
              ? 'bg-green-200' 
              : isFall 
                ? 'bg-red-200' 
                : 'bg-gray-100'; // Default background color if neither Spring nor Fall

            return (
              <li 
                key={year} // Use a unique identifier if available
                className={`cursor-pointer mb-2 p-3 border border-gray-300 rounded-lg 
                  transition duration-300 ease-in-out transform hover:bg-blue-200 hover:shadow-xl hover:scale-105
                  active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${bgColorClass}`}
                role="button"
                tabIndex={0} // Make it focusable
                onKeyDown={(e) => { if (e.key === 'Enter') console.log(`Selected year: ${year}`); }} // Example action
                onClick={() => console.log(`Selected year: ${year}`)} // Example action
              >
                {year}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default YearLabels;
