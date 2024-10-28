import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Import your AuthContext

const PdfLabels = ({ onSelectYear, fetchLabels }) => {
  const { auth } = useContext(AuthContext); // Get auth context
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/pdf/unique-years`, {
          headers: {
            Authorization: `Bearer ${auth.token}`, // Add the authorization header directly
          },
        });
        setYears(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchYears();
  }, [fetchLabels, auth.token]); // Add auth.token to dependencies

  if (loading) return <p>Loading years...</p>;
  if (error) return <p>Error fetching years: {error}</p>;

  const handleYearSelect = (year) => {
    console.log('Selected Year:', year);
    onSelectYear(year);
  };

  const handleKeyPress = (e, year) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleYearSelect(year);
    }
  };

  return (
    <div className="relative">
      <div className="sticky top-0 bg-white z-10">
        <h3 className="font-bold text-lg py-2" aria-live="polite">
          Years:
        </h3>
      </div>

      <div className="mt-2 max-h-[45vh] overflow-y-auto overflow-x-hidden">
        <ul role="list" className="list-disc ml-5">
          {years.map((year) => (
            <li 
              key={year}
              className={`cursor-pointer mb-2 p-3 border border-gray-300 rounded-lg 
                transition duration-300 ease-in-out transform hover:bg-blue-200 hover:shadow-xl hover:scale-105
                active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
              role="button"
              tabIndex={0} // Make focusable
              onClick={() => handleYearSelect(year)}
              onKeyPress={(e) => handleKeyPress(e, year)}
            >
              {year}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PdfLabels;
