import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EmailLabels = ({ onSelectYear, onSelectSeason, fetchLabels }) => {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/email/season');
        setYears(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchYears();
  }, [fetchLabels]);

  if (loading) return <p>Loading years...</p>;
  if (error) return <p>Error fetching years: {error}</p>;

  const handleYearSeasonSelect = (year, season) => {
    console.log('Selected Year:', year);
    console.log('Selected Season:', season);
    onSelectYear(year);
    onSelectSeason(season);
  };

  const handleKeyPress = (e, yearNumber, season) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleYearSeasonSelect(yearNumber, season);
    }
  };

  return (
    <div className="relative">
      <div className="sticky top-0 bg-white z-10">
        <h3 className="font-bold text-lg py-2" aria-live="polite">
          Year and Season:
        </h3>
      </div>

      <div className="mt-2 max-h-[45vh] overflow-y-auto overflow-x-hidden">
        <ul role="list" className="list-disc ml-5">
          {years.map((year) => {
            const isStudent = year.toLowerCase().includes('student');
            const isAgent = year.toLowerCase().includes('agent');

            const bgColorClass = isStudent 
              ? 'bg-green-200' 
              : isAgent 
                ? 'bg-red-200' 
                : 'bg-gray-100';

            const yearNumber = year.split(' ')[0]; 
            const season = isStudent ? `${yearNumber} Student` : isAgent ? `${yearNumber} Agent` : `${yearNumber}`;

            return (
              <li 
                key={year}
                className={`cursor-pointer mb-2 p-3 border border-gray-300 rounded-lg 
                  transition duration-300 ease-in-out transform hover:bg-blue-200 hover:shadow-xl hover:scale-105
                  active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${bgColorClass}`}
                role="button"
                tabIndex={0} // Make focusable
                onClick={() => handleYearSeasonSelect(yearNumber, season)}
                onKeyPress={(e) => handleKeyPress(e, yearNumber, season)}
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

export default EmailLabels;
