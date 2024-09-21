import React from 'react';

const YearList = ({ selectedYear, selectedSeason }) => {
  return (
    <div className="p-4">
      <h3 className="font-bold text-lg text-gray-800 mb-2">
        Selected Information
      </h3>
      <div className="text-gray-700">
        <p>
          <strong>Year:</strong> {selectedYear || 'No'}
        </p>
        <p>
          <strong>Season:</strong> {selectedSeason || 'No'}
        </p>
      </div>
    </div>
  );
};

export default YearList;
