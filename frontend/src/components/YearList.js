import React from 'react';

const YearList = ({ selectedYear, selectedSeason }) => {
  return (
    <div className="p-4">
    <h3 className="font-bold text-lg text-gray-800 mb-2">
      Selected-Info
    </h3>
    <div className="text-gray-700">
      <div className="flex justify-between mb-1 leading-tight">
        <strong>Year:</strong>
        <span>{selectedYear || 'No'}</span>
      </div>
      <div className="flex justify-between mb-1 leading-tight">
        <strong>Season:</strong>
        <span>{selectedSeason || 'No'}</span>
      </div>
    </div>
  </div>
  
  
  );
};

export default YearList;
