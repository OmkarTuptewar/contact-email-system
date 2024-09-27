import React, { useEffect, useState } from "react";
import axios from "axios";

const LabelList = ({ year, season, onSelectLabel,fetchLabels }) => {
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    if (year && season) {
      axios
        .get(`http://localhost:5000/api/contacts/${year}/${season}`)
        .then((response) => setLabels(response.data))
        .catch((err) => console.log(err));
    }
  }, [year, season,fetchLabels]);

  const handleLabelClick = (label) => {
    console.log('Label clicked:', label.label);
    onSelectLabel(label.label); // Trigger the label selection
  };

  return (
    <div className="bg-gray-100 rounded-lg p-4  shadow-md max-h-[90vh] overflow-y-auto scrollable">
      <h3 className="font-bold text-xl mb-2 text-gray-700">Labels</h3>
      <h4 className="font-semibold text-xl  text-gray-600 mb-4">
        {season}
      </h4>{" "}
      {/* Season in next line */}
      <ul className="space-y-2">
        {labels.map((label, idx) => (
          <li
            key={idx}
            className="cursor-pointer mb-2 p-3 border border-gray-300 rounded-lg 
            transition duration-300 ease-in-out transform hover:bg-blue-200 hover:shadow-xl hover:scale-105
             active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={() => handleLabelClick(label)}
          >
            <span className="text-blue-600 font-medium">
              {label.name || label.label || "Unnamed Label"}
            </span>{" "}
           
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LabelList;