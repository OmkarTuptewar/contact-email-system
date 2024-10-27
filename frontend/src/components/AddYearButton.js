import React, { useState } from 'react';

const AddYearButton = ({ onSelectYear, onSelectSeason }) => {
  const [showSeasons, setShowSeasons] = useState(false);
  const [year, setYear] = useState('');

  const handleAddYear = () => {
    onSelectYear(year);
    setShowSeasons(true);
  };

  const handleSelectSeason = (season) => {
    onSelectSeason(season);
    setShowSeasons(false);
  };

  

  return (
    <div className="max-w-md mx-auto p-4">
      <input
        type="text"
        placeholder="Enter year"
        className="border p-2 rounded mb-2 w-full"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto"
        onClick={handleAddYear}
      >
        Add Year
      </button>
      {showSeasons && (
        <div className="mt-2 flex flex-wrap justify-center">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded mr-2 mb-2"
            onClick={() => handleSelectSeason(`${year} Spring`)}
          >
            Spring 
          </button>
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded mb-2"
            onClick={() => handleSelectSeason(`${year} Fall`)}
          >
            Fall 
          </button>
        </div>
      )}
    </div>
  );
};

export default AddYearButton;
