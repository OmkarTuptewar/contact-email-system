import React from 'react';

const PdfList = ({ selectedYear }) => {
  return (
    <div className="p-4">
      <h3 className="font-bold text-lg text-gray-800 mb-2">
        Selected PDF Info
      </h3>
      <div className="text-gray-700">
        <div className="flex justify-between mb-1 leading-tight">
          <strong>Year:</strong>
          <span>{selectedYear || 'No'}</span>
        </div>
      </div>
    </div>
  );
};

export default PdfList;
