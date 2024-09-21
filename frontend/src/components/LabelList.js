import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LabelList = ({ year, season, onSelectLabel }) => {
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    if (year && season) {
      axios.get(`http://localhost:5000/api/contacts/${year}/${season}`)
        .then((response) => setLabels(response.data))
        .catch((err) => console.log(err));
    }
  }, [year, season]);

  return (
    <div>
      <ul>
        {labels.map((label, idx) => (
          <li
            key={idx}
            className="cursor-pointer mb-2 p-2 border rounded"
            onClick={() => onSelectLabel(label)}
          >
            {label.name || label.label || 'Unnamed Label'}  {/* Ensure you display a valid property */} 
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LabelList;
